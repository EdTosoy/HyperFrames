import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { loadEpisode, validateEpisode, assetMap, config } from "../scripts/project.mjs";
import { components } from "../compositions/factory/components.mjs";
test("complete unit is silent and its contextual assets and reading holds are validated", () => {
  const e = structuredClone(loadEpisode("u001-p01-am-is-are-complete"));
  assert.deepEqual(validateEpisode(e), []);
  assert.equal(e.narration, null);
  assert.ok(e.quizzes.length >= 5);
  const s = e.scenes.find((s) => s.component === "visual-context");
  assert.match(components["visual-context"].render(s, e, assetMap(e)), /<img/);
  assert.match(components["visual-context"].animate(s, config, e), /fromTo/);
  s.visual.states[0].assetId = "missing";
  assert.match(validateEpisode(e).join("\n"), /context asset/);
  s.visual.states[0].at = s.duration;
  assert.match(validateEpisode(e).join("\n"), /final hold/);
});

test("context object motion is additive to the fixture contract and bounded", () => {
  const e = structuredClone(loadEpisode("fixture-component-showcase"));
  const lesson = loadEpisode("u001-p01-am-is-are-complete");
  const demo = e.scenes.find((s) => s.component === "comparison");
  demo.component = "visual-context";
  demo.visual = structuredClone(lesson.scenes.find((s) => s.visual?.layers).visual);
  demo.visual.states.forEach((s, i) => (s.at = i ? 3 : 0.3));
  demo.visual.layers[0].at = 1;
  demo.visual.layers[0].duration = 1;
  e.assets = lesson.assets;
  e.mediaAssetIds = lesson.mediaAssetIds;
  assert.deepEqual(validateEpisode(e), []);
  const html = components["visual-context"].render(demo, e, assetMap(e));
  assert.equal((html.match(/<img\b/g) || []).length, 1);
  const animation = components["visual-context"].animate(demo, config, e);
  assert.match(animation, /svgOrigin/);
  const reduced = components["visual-context"].animate(demo, config, {
    ...e,
    motionMode: "reduced",
  });
  assert.match(reduced, /"duration":0/);
  const layer = demo.visual.layers[0];
  layer.to.x = 600;
  assert.match(validateEpisode(e).join("\n"), /poses must fit/);
  layer.to.x = 0;
  layer.at = demo.duration - 1;
  assert.match(validateEpisode(e).join("\n"), /layer.at.*final hold/);
  layer.at = 1;
  layer.assetId = "font-manrope";
  assert.match(validateEpisode(e).join("\n"), /context.*image|context layer asset/);
});

test("complete-unit narration and provisional captions agree without leaking quiz answers", () => {
  const e = loadEpisode("u001-p01-am-is-are-complete");
  const words = (s) =>
    s.replace(/\[Pause[^\]]*\]/g, "").match(/[A-Za-z0-9]+(?:[’'][A-Za-z]+)*/g);
  assert.deepEqual(words(e.captions.map((c) => c.text).join(" ")), words(e.script));
  const copy = readFileSync(
    new URL("../episodes/u001-p01-am-is-are-complete/SCRIPT.md", import.meta.url),
    "utf8",
  )
    .split("## Spoken script")[1]
    .split("## Visual and recording notes")[0]
    .replace(/^### .*$/gm, "");
  assert.deepEqual(words(copy), words(e.script));
  for (const s of e.scenes.filter((s) => s.component === "quiz")) {
    const from = s.start + s.visual.thinkingFrom;
    const until = s.start + s.answerAt;
    assert.equal(until - from, 5, "Each question needs five full thinking seconds");
    assert.equal(
      e.captions.some((c) => c.start < until && c.end > from),
      false,
      `${s.id}: no captions during thinking time`,
    );
  }
});
