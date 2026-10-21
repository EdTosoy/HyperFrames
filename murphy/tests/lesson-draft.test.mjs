import test from "node:test";
import assert from "node:assert/strict";
import {
  loadEpisode,
  validateEpisode,
  readinessErrors,
  assetMap,
  config,
} from "../scripts/project.mjs";
import { renderScene, renderComposition } from "../compositions/factory/layout.mjs";

test("lesson draft preserves the six teaching phases and blocks silent release", () => {
  const episode = loadEpisode("u001-p01-am-is-are");
  assert.deepEqual(validateEpisode(episode), []);
  assert.equal(episode.kind, "lesson");
  assert.equal(episode.status, "draft");
  assert.equal(episode.narration, null);
  const errors = readinessErrors(episode).join("\n");
  assert.match(errors, /human narration|recording/i);
  assert.doesNotMatch(errors, /six teaching phases/);
  assert.doesNotMatch(renderComposition(episode, config, assetMap(episode)), /<audio\b/);
});

test("lesson quiz reserves three silent seconds before the correct plural answer", () => {
  const episode = loadEpisode("u001-p01-am-is-are");
  const scene = episode.scenes.find((s) => s.component === "quiz");
  const question = episode.quizzes.find((q) => q.id === scene.quizId);
  const start = scene.start + scene.visual.thinkingFrom;
  const end = scene.start + scene.answerAt;
  assert.equal(scene.answerAt - scene.visual.thinkingFrom, 3);
  assert.equal(question.choices[question.answerIndex], "are");
  assert.equal(
    episode.captions.some((cue) => cue.start < end && cue.end > start),
    false,
    "The thinking pause must contain no provisional narration captions",
  );
  assert.match(question.explanation, /classmates = they/);
});

test("learner-facing scene labels are optional, bounded and escaped", () => {
  const episode = loadEpisode("fixture-component-showcase");
  const scene = episode.scenes[0];
  const assets = assetMap(episode);
  assert.match(renderScene(scene, 0, episode, config, assets), /01 \/ title/);
  scene.label = "Listen & notice <this>";
  assert.deepEqual(validateEpisode(episode), []);
  assert.match(
    renderScene(scene, 0, episode, config, assets),
    /Listen &amp; notice &lt;this&gt;/,
  );
  scene.label = "x".repeat(33);
  assert.match(validateEpisode(episode).join("\n"), /label.*32/);
});
