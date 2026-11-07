import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { root, config, loadEpisode, readJson, fingerprint } from "./project.mjs";

// Local verification only. Use HyperFrames' installed browser dependency and its
// compiled preview; no alternative composition compiler or production renderer.
const require = createRequire(resolve(root, "node_modules/hyperframes/package.json"));
const puppeteer = require("puppeteer-core");
const [id = "fixture-component-showcase", origin] = process.argv.slice(2);
if (!origin)
  throw new Error(
    "Use npm run check:visual -- <episode-id> http://localhost:<Studio-port> after preview",
  );
const url = new URL(origin);
assert.ok(
  url.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname),
  "Visual audit requires a local Studio origin",
);
const episode = loadEpisode(id);
assert.equal(
  readJson(resolve(root, ".hyperframes-build", id, "build.json")).fingerprint,
  fingerprint(episode),
  "Build is stale; run episode:build or preview again",
);
if (!process.env.HYPERFRAMES_BROWSER_PATH)
  throw new Error(
    "Set HYPERFRAMES_BROWSER_PATH to the installed Chrome/Chromium executable for check:visual",
  );
const browser = await puppeteer.launch({
  executablePath: process.env.HYPERFRAMES_BROWSER_PATH,
  headless: true,
});
try {
  const page = await browser.newPage();
  await page.setViewport({
    width: config.profiles[episode.profile].width,
    height: config.profiles[episode.profile].height,
  });
  await page.goto(`${url.origin}/api/projects/${encodeURIComponent(id)}/preview`, {
    waitUntil: "domcontentloaded",
  });
  await page.waitForFunction(
    (ids) => window.__renderReady === true && ids.every((id) => window.__timelines?.[id]),
    { timeout: 10000 },
    episode.scenes.map((scene) => scene.id),
  );
  await page.evaluate(() => document.fonts.ready);
  async function seek(time) {
    await page.evaluate(async (time) => {
      // Studio seconds-control compatibility path, verified against the locked runtime.
      await new Promise((resolve) => {
        window.addEventListener("message", function listener(event) {
          if (
            event.source === window &&
            event.data?.source === "hf-parent" &&
            event.data?.action === "seek"
          ) {
            window.removeEventListener("message", listener);
            resolve();
          }
        });
        window.postMessage(
          { source: "hf-parent", type: "control", action: "seek", timeSeconds: time },
          "*",
        );
      });
      if (window.__hfWaitForSeekCompletion) await window.__hfWaitForSeekCompletion();
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
    }, time);
  }
  async function visible(selector, time) {
    await seek(time);
    return page.evaluate((selector) => {
      const element = document.querySelector(selector);
      if (!element) throw new Error(`Missing visual target ${selector}`);
      for (let node = element; node; node = node.parentElement) {
        const s = getComputedStyle(node);
        if (s.visibility === "hidden" || s.display === "none" || Number(s.opacity) < 0.5)
          return false;
      }
      return true;
    }, selector);
  }
  const times = new Set([
    0.5,
    episode.durationSeconds - 1 / config.profiles.vertical.fps,
  ]);
  for (const scene of episode.scenes) {
    const entranceDeadline =
      scene.start + config.motion.enterSeconds + 1 / config.profiles[episode.profile].fps;
    times.add(entranceDeadline);
    assert.equal(
      await visible(`#${scene.id}-content`, entranceDeadline),
      true,
      `${scene.id}: entrance missed its authored deadline`,
    );
    times.add(scene.start + 0.4);
    times.add(scene.start + scene.duration - 0.4);
    const v = scene.visual;
    if (!v) continue;
    if (scene.component === "visual-context") {
      for (const [i, state] of v.states.entries()) {
        const time =
          scene.start +
          state.at +
          config.motion.replaceSeconds +
          config.motion.enterSeconds +
          0.1;
        times.add(time);
        assert.equal(await visible(`#${scene.id}-context-${i}`, time), true);
        for (let j = 0; j < v.states.length; j++)
          if (j !== i)
            assert.equal(await visible(`#${scene.id}-context-${j}`, time), false);
      }
      for (const [i, layer] of (v.layers || []).entries()) {
        const selector = `#${scene.id}-layer-${i}`;
        const before = scene.start + layer.at - 0.1;
        const after = scene.start + layer.at + layer.duration * (layer.cycles || 1) + 0.1;
        async function pose(time) {
          await seek(time);
          return page.evaluate((selector) => {
            const node = document.querySelector(selector);
            const r = node.getBoundingClientRect();
            return {
              left: r.left,
              top: r.top,
              width: r.width,
              scale: node.parentElement.getScreenCTM().a,
            };
          }, selector);
        }
        const a = await pose(before);
        const b = await pose(after);
        assert.ok(
          Math.abs(b.width / a.width - layer.to.scaleX / layer.from.scaleX) < 0.02,
          `${selector}: illustration did not reach its authored scale`,
        );
        assert.ok(
          Math.abs(b.left - a.left - (layer.to.x - layer.from.x) * a.scale) < 2 &&
            Math.abs(b.top - a.top - (layer.to.y - layer.from.y) * a.scale) < 2,
          `${selector}: illustration did not reach its authored position`,
        );
        for (const time of [before, (before + after) / 2, after]) times.add(time);
      }
    }
    if (scene.component === "sentence-builder")
      for (const [i, state] of v.states.entries()) {
        const time =
          scene.start +
          state.at +
          (i ? config.motion.replaceSeconds : 0) +
          (state.groups.length - 1) * config.motion.staggerSeconds +
          config.motion.enterSeconds +
          config.motion.highlightSeconds +
          0.05;
        times.add(time);
        assert.equal(
          await visible(`#${scene.id}-state-${i}`, time),
          true,
          `State ${i} should be visible`,
        );
        for (let j = 0; j < v.states.length; j++)
          if (j !== i)
            assert.equal(
              await visible(`#${scene.id}-state-${j}`, time),
              false,
              `State ${j} should be hidden`,
            );
      }
    if (scene.component === "quiz") {
      const from = v.thinkingFrom ?? config.motion.enterSeconds;
      const pause = scene.answerAt - from;
      const frame = 1 / config.profiles[episode.profile].fps;
      const question = episode.quizzes.find((q) => q.id === scene.quizId);
      let promptBounds;
      // Repeat in reverse after the answer to catch state leaking across seeks.
      for (const offset of [0, pause / 2, pause - frame, pause + 1, pause / 2, 0]) {
        if (offset > pause) {
          await seek(scene.start + from + offset);
          continue;
        }
        const time = scene.start + from + offset;
        times.add(time);
        await seek(time);
        const state = await page.evaluate((id) => {
          const scope = document.getElementById(`${id}-content`);
          const opacity = (element) => {
            let value = 1;
            for (let node = element; node; node = node.parentElement) {
              const css = getComputedStyle(node);
              if (css.visibility === "hidden" || css.display === "none") return 0;
              value *= Number(css.opacity);
            }
            return value;
          };
          const prompts = [...scope.querySelectorAll(".quiz-prompt,.quiz-choice")];
          const bar = scope.querySelector(".thinking-bar");
          return {
            promptOpacity: prompts.map(opacity),
            promptBounds: prompts.map((p) => {
              const r = p.getBoundingClientRect();
              return [r.x, r.y, r.width, r.height];
            }),
            answerOpacity: opacity(scope.querySelector(".quiz-answer")),
            thinkingOpacity: opacity(scope.querySelector(".thinking")),
            remaining:
              bar.getBoundingClientRect().width /
              bar.parentElement.getBoundingClientRect().width,
          };
        }, scene.id);
        assert.equal(state.promptOpacity.length, 1 + (question.choices?.length ?? 0));
        assert.ok(
          state.promptOpacity.every((a) => a >= 0.999),
          "Keep full prompts visible",
        );
        promptBounds ??= state.promptBounds;
        assert.deepEqual(state.promptBounds, promptBounds, "Question must stay in place");
        assert.ok(
          state.answerOpacity < 0.0001,
          "Answer/explanation leaked before pause ended",
        );
        assert.ok(
          state.thinkingOpacity >= 0.999,
          "Thinking cue must cover the full pause",
        );
        assert.ok(
          Math.abs(state.remaining - (1 - offset / pause)) < 0.002,
          "Thinking progress must follow the authored pause",
        );
      }
      const answerDeadline =
        scene.start +
        scene.answerAt +
        config.motion.replaceSeconds +
        config.motion.enterSeconds +
        1 / config.profiles[episode.profile].fps;
      times.add(answerDeadline);
      assert.equal(
        await visible(`#${scene.id}-answer`, answerDeadline),
        true,
        "Quiz answer missed its authored reveal deadline",
      );
      const before = scene.start + scene.answerAt - 0.1,
        after =
          scene.start +
          scene.answerAt +
          config.motion.replaceSeconds +
          config.motion.enterSeconds +
          0.1;
      times.add(before);
      times.add(after);
      assert.equal(
        await visible(`#${scene.id}-answer`, before),
        false,
        "Quiz answer must remain hidden during the thinking pause",
      );
      assert.equal(
        await visible(`#${scene.id}-answer`, after),
        true,
        "Quiz answer should reveal after the pause",
      );
      assert.equal(
        await visible(`#${scene.id}-thinking`, after),
        false,
        "Thinking cue must leave after answer",
      );
    }
    if (scene.component === "dialogue")
      for (const [i, message] of v.messages.entries()) {
        const time = scene.start + message.at + config.motion.enterSeconds + 0.05;
        times.add(time);
        assert.equal(
          await visible(`#${scene.id}-message-${i}`, time),
          true,
          "Dialogue cue did not reveal",
        );
        if (i + 1 < v.messages.length)
          assert.equal(
            await visible(`#${scene.id}-message-${i + 1}`, time),
            false,
            "Dialogue must not reveal early",
          );
      }
    if (scene.component === "phrase-focus")
      for (const [i, token] of v.tokens.entries())
        if (token.replacement) {
          const before = scene.start + token.replacement.at - 0.1,
            after =
              scene.start +
              token.replacement.at +
              config.motion.replaceSeconds +
              config.motion.enterSeconds +
              0.1;
          times.add(before);
          times.add(after);
          assert.equal(await visible(`#${scene.id}-before-${i}`, before), true);
          assert.equal(await visible(`#${scene.id}-after-${i}`, before), false);
          assert.equal(await visible(`#${scene.id}-after-${i}`, after), true);
          assert.equal(await visible(`#${scene.id}-before-${i}`, after), false);
        }
    if (scene.component === "timeline")
      for (const event of v.events)
        times.add(scene.start + event.at + config.motion.drawSeconds + 0.1);
  }
  for (const cue of episode.captions) times.add((cue.start + cue.end) / 2);
  const safe = config.safeAreas[episode.safeArea],
    p = config.profiles[episode.profile];
  async function sample(time) {
    await seek(time);
    return page.evaluate(
      ({ safe, p, offset }) => {
        const isVisible = (element) => {
          for (let node = element; node; node = node.parentElement) {
            const s = getComputedStyle(node);
            if (
              s.display === "none" ||
              s.visibility === "hidden" ||
              Number(s.opacity) < 0.5
            )
              return false;
          }
          return true;
        };
        const rows = [];
        const main = {
          left: safe.left,
          right: p.width - safe.right,
          top: safe.top + offset,
          bottom: p.height - safe.bottom - safe.captionHeight - safe.captionGap,
        };
        const caption = {
          ...main,
          top: p.height - safe.bottom - safe.captionHeight,
          bottom: p.height - safe.bottom,
        };
        for (const element of document.querySelectorAll(
          ".library .context-stack>.illustration,.library .context-state .illustration,.library .context-overlay image,.library p,.library h1,.library .word-group,.library .speech,.library .event-line,.library .event-point,.library .comparison-card,.library .recap-pattern,.caption-copy",
        )) {
          if (!isVisible(element)) continue;
          const r = element.getBoundingClientRect();
          if (!r.width || !r.height) continue;
          const bound = element.matches(".caption-copy") ? caption : main;
          const textRange = document.createRange();
          textRange.selectNodeContents(element);
          const painted = textRange.getBoundingClientRect();
          const paintedFits =
            !painted.width ||
            (painted.left >= bound.left - 2 &&
              painted.right <= bound.right + 2 &&
              painted.top >= bound.top - 2 &&
              painted.bottom <= bound.bottom + 2);
          const fits =
            paintedFits &&
            r.left >= bound.left - 2 &&
            r.right <= bound.right + 2 &&
            r.top >= bound.top - 2 &&
            r.bottom <= bound.bottom + 2;
          const css = getComputedStyle(element);
          const textFits =
            (css.overflowX === "visible" ||
              element.scrollWidth <= element.clientWidth + 2) &&
            (css.overflowY === "visible" ||
              element.scrollHeight <= element.clientHeight + 2);
          rows.push({
            selector: element.id ? "#" + element.id : element.className,
            bounds: [r.left, r.top, r.right, r.bottom].map(
              (v) => Math.round(v * 100) / 100,
            ),
            fits,
            textFits,
          });
        }
        return rows;
      },
      {
        safe,
        p,
        offset:
          config.layout.progressOffset + config.layout.progressHeight + config.spacing.sm,
      },
    );
  }
  const snapshots = [];
  const ordered = [...times].sort((a, b) => a - b);
  for (const time of ordered) {
    const rows = await sample(time);
    for (const row of rows)
      assert.ok(
        row.fits && row.textFits,
        `Safe-area/text overflow at ${time.toFixed(3)}s: ${JSON.stringify(row)}`,
      );
    snapshots.push({ time, rows });
  }
  for (const expected of snapshots.toReversed())
    assert.deepEqual(
      await sample(expected.time),
      expected.rows,
      `Backward seek changed the painted state at ${expected.time}s`,
    );
  const directory = resolve(root, "renders", id);
  mkdirSync(directory, { recursive: true });
  writeFileSync(
    resolve(directory, "visual-audit.json"),
    JSON.stringify(
      {
        episodeId: id,
        fingerprint: fingerprint(episode),
        sampleCount: snapshots.length,
        semanticChecks: true,
        backwardSeek: true,
        snapshots,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    `PASS: ${snapshots.length} painted safe-area/text samples, semantic reveals, and repeatable backward seeks`,
  );
} finally {
  await browser.close();
}
