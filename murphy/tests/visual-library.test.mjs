import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  loadEpisode,
  validateEpisode,
  validateConfig,
  config,
  assetMap,
  root,
  readinessErrors,
} from "../scripts/project.mjs";
import { components } from "../compositions/factory/components.mjs";
import { renderScene, renderComposition } from "../compositions/factory/layout.mjs";

const showcase = () => structuredClone(loadEpisode("fixture-component-showcase"));
function invalid(component, edit, pattern) {
  const episode = showcase();
  const scene = episode.scenes.find((s) => s.component === component);
  edit(scene, episode);
  assert.match(validateEpisode(episode).join("\n"), pattern);
}
test("all catalog components resolve through the existing pipeline and cannot release", () => {
  const episode = showcase();
  assert.deepEqual(validateEpisode(episode), []);
  for (const scene of episode.scenes)
    assert.equal(typeof components[scene.component].render, "function");
  assert.match(readinessErrors(episode).join("\n"), /Fixtures cannot be released/);
  const legacy = loadEpisode();
  assert.equal(legacy.durationSeconds, 6);
  assert.deepEqual(validateEpisode(legacy), []);
});
test("component-specific schemas reject missing contracts and arbitrary styling", () => {
  invalid(
    "title",
    (s) => {
      delete s.visual;
    },
    /visual/,
  );
  invalid(
    "comparison",
    (s) => {
      s.visual.items.pop();
    },
    /items/,
  );
  invalid(
    "title",
    (s) => {
      s.visual.color = "#123456";
    },
    /additional properties/,
  );
  invalid(
    "sentence-builder",
    (s) => {
      s.visual.states[0].groups[0].role = "arbitrary";
    },
    /role/,
  );
  invalid(
    "dialogue",
    (s) => {
      s.visual.messages[0].text = "x".repeat(91);
    },
    /text/,
  );
});
test("sentence states leave time for reveals, highlights and replacements", () => {
  invalid(
    "sentence-builder",
    (s) => {
      s.visual.states[1].at = 0.7;
    },
    /states overlap/,
  );
  invalid(
    "sentence-builder",
    (s) => {
      s.visual.states[2].at = 7.8;
    },
    /final hold/,
  );
  invalid(
    "sentence-builder",
    (s) => {
      s.visual.states[0].groups.forEach((g) => {
        g.text = "A long descriptive group of words";
      });
    },
    /too dense/,
  );
});
test("comparison supports labeled validity, columns and sequential reveals", () => {
  const episode = showcase();
  const scene = episode.scenes.find((s) => s.component === "comparison");
  const html = components.comparison.render(scene, episode);
  assert.match(html, /REVISE/);
  assert.match(html, /CORRECT/);
  assert.match(html, /<svg/);
  scene.visual.layout = "columns";
  scene.visual.items.forEach((item) => {
    item.verdict = "different";
  });
  assert.deepEqual(validateEpisode(episode), []);
  assert.match(components.comparison.render(scene, episode), /ALSO VALID/);
  scene.visual.layout = "sequential";
  assert.match(validateEpisode(episode).join("\n"), /requires secondAt/);
  scene.visual.secondAt = 2.5;
  assert.deepEqual(validateEpisode(episode), []);
  assert.match(components.comparison.animate(scene, config, episode), /compare-0/);
});
test("timeline rejects conceptually misleading intervals and duplicate event IDs", () => {
  invalid(
    "timeline",
    (s) => {
      s.visual.events[0].end = 0.8;
    },
    /completed interval/,
  );
  invalid(
    "timeline",
    (s) => {
      s.visual.events[1].start = 0.6;
    },
    /ongoing interval/,
  );
  invalid(
    "timeline",
    (s) => {
      s.visual.events[0].end = 0.1;
    },
    /end must be after/,
  );
  invalid(
    "timeline",
    (s) => {
      s.visual.events[1].id = s.visual.events[0].id;
    },
    /duplicate event/,
  );
});
test("dialogue identities and explicit scene-local reveals are validated", () => {
  invalid(
    "dialogue",
    (s) => {
      s.visual.messages[0].speakerId = "missing";
    },
    /unresolved speaker/,
  );
  invalid(
    "dialogue",
    (s) => {
      s.visual.messages[1].at = 0.4;
    },
    /ordered and separated/,
  );
  invalid(
    "dialogue",
    (s) => {
      s.visual.speakers[1].side = "left";
    },
    /opposite sides/,
  );
  invalid(
    "dialogue",
    (s) => {
      s.visual.messages[0].emphasis = "not present";
    },
    /not present/,
  );
});
test("quiz supports prerecorded fill blanks, pause and answer hold", () => {
  const episode = showcase();
  const scene = episode.scenes.find((s) => s.component === "quiz");
  const question = episode.quizzes[0];
  Object.assign(question, {
    kind: "fill-blank",
    question: "The parcel is ___.",
    answer: "blue",
  });
  delete question.choices;
  delete question.answerIndex;
  assert.deepEqual(validateEpisode(episode), []);
  const html = components.quiz.render(scene, episode);
  assert.match(html, /ANSWER \/ blue/);
  assert.match(html, /___/);
  scene.answerAt = 0.8;
  assert.match(validateEpisode(episode).join("\n"), /thinking pause/);
  scene.answerAt = 5.4;
  assert.match(validateEpisode(episode).join("\n"), /answer hold/);
});
test("phrase replacement reserves both text shapes and follows emphasis", () => {
  const episode = showcase();
  const scene = episode.scenes.find((s) => s.component === "phrase-focus");
  const html = components["phrase-focus"].render(scene, episode);
  assert.match(html, /replacement-before/);
  assert.match(html, /replacement-after/);
  assert.match(html, /work/);
  assert.match(html, /learn/);
  invalid(
    "phrase-focus",
    (s) => {
      s.visual.tokens[1].replacement.at = 0.7;
    },
    /follow the original highlight/,
  );
});
test("captions preserve punctuation, emphasis, cue times and shared placement", () => {
  const episode = showcase();
  episode.captions[0].text = "Wait, then choose.";
  episode.captions[0].emphasis = ["then"];
  const html = renderComposition(episode, config, assetMap(episode));
  assert.match(html, /Wait, <strong class="text-emphasis">then<\/strong> choose\./);
  assert.match(html, /data-start="0.4" data-duration="2.2"/);
  assert.match(html, /class="caption-copy"/);
  episode.captions[0].emphasis = ["choose", "not there"];
  assert.match(validateEpisode(episode).join("\n"), /without overlap/);
});
test("reduced motion removes travel and drawing while retaining semantic cue times", () => {
  const episode = showcase();
  episode.motionMode = "reduced";
  const assets = assetMap(episode);
  const timeline = episode.scenes.find((s) => s.component === "timeline");
  const html = renderScene(timeline, 3, episode, config, assets);
  assert.doesNotMatch(html, /y:16/);
  assert.match(html, /scaleX:1,duration:0,/);
  const focus = episode.scenes.find((s) => s.component === "phrase-focus");
  const motion = components["phrase-focus"].animate(focus, config, episode);
  assert.ok(motion.includes("},1.8)"));
  assert.ok(motion.includes("},2)"));
});
test("rendering is deterministic, escapes text and handles empty optional content", () => {
  const episode = showcase();
  const assets = assetMap(episode);
  episode.scenes[0].visual.subtitle = "";
  episode.scenes[0].body = "";
  episode.scenes[0].heading = '<script>alert("x")</script>';
  const first = renderScene(episode.scenes[0], 0, episode, config, assets);
  assert.equal(
    first,
    renderScene(structuredClone(episode.scenes[0]), 0, episode, config, assets),
  );
  assert.match(first, /&lt;script&gt;/);
  assert.doesNotMatch(first, /<script>alert/);
  assert.doesNotMatch(first, /undefined|null/);
});
test("safe-area presets reserve separate branding, content, caption and overlay regions", () => {
  for (const area of Object.values(config.safeAreas)) {
    const contentTop = area.top + config.layout.contentOffset;
    const captionTop = config.profiles.vertical.height - area.bottom - area.captionHeight;
    const contentBottom = captionTop - area.captionGap;
    assert.ok(contentTop > area.top + 64);
    assert.ok(contentBottom - contentTop >= 700);
    assert.ok(area.left + area.right < config.profiles.vertical.width);
    assert.ok(area.captionHeight >= 200);
  }
  const broken = structuredClone(config);
  broken.spacing.md = -1;
  assert.match(validateConfig(broken).join("\n"), /spacing\/md/);
  for (const file of ["educational.mjs", "styles.mjs", "motion.mjs", "primitives.mjs"])
    assert.doesNotMatch(
      readFileSync(resolve(root, "compositions/factory", file), "utf8"),
      /#[0-9a-f]{6}\b/i,
    );
});
test("caption speed and unsupported typography produce actionable errors", () => {
  invalid(
    "title",
    (_, episode) => {
      episode.captions[0].end = 0.5;
    },
    /reading speed/,
  );
  invalid(
    "dialogue",
    (scene) => {
      scene.typography = "compact";
    },
    /compact typography/,
  );
});
test("final recap holds through the encoded ending unless an exit is explicitly requested", () => {
  const episode = showcase(),
    assets = assetMap(episode),
    index = episode.scenes.length - 1;
  const html = renderScene(episode.scenes[index], index, episode, config, assets);
  assert.doesNotMatch(html, /tl\.to\('#demo-recap-content'/);
  episode.scenes[index].motion = { exit: "fade" };
  assert.match(
    renderScene(episode.scenes[index], index, episode, config, assets),
    /tl\.to\('#demo-recap-content'/,
  );
});
