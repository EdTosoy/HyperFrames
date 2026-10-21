import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  loadEpisode,
  validateEpisode,
  readinessErrors,
  assetMap,
  config,
} from "../scripts/project.mjs";
import { renderScene, renderComposition } from "../compositions/factory/layout.mjs";
import { sampledMotionDeadline } from "../scripts/build.mjs";

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

test("expanded narration, recording copy and provisional captions stay in sync", () => {
  const episode = loadEpisode("u001-p01-am-is-are");
  const words = (text) =>
    text
      .replace(/\[Pause[^\]]*\]/g, "")
      .replace(/^#{1,6} .*$/gm, "")
      .toLowerCase()
      .match(/[a-z0-9]+(?:['’][a-z]+)*/g) || [];
  assert.deepEqual(
    words(episode.captions.map((cue) => cue.text).join(" ")),
    words(episode.script),
    "Captions must cover the spoken script in order without reading stage directions",
  );
  const recordingCopy = readFileSync(
    new URL("../episodes/u001-p01-am-is-are/SCRIPT.md", import.meta.url),
    "utf8",
  ).split("### Scene 1 — Hook")[1];
  assert.ok(recordingCopy, "Recording copy needs the six authored scene headings");
  assert.deepEqual(words(recordingCopy), words(episode.script));
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

test("long-cut motion checks account for the locked CLI observation grid", () => {
  const deadline = config.motion.enterSeconds + 1 / config.profiles.vertical.fps;
  assert.equal(sampledMotionDeadline(deadline, 6), deadline);
  assert.equal(sampledMotionDeadline(deadline, 74), deadline);
  assert.equal(sampledMotionDeadline(deadline, 150), 0.502);
  const episode = loadEpisode("u001-p01-am-is-are");
  for (const scene of episode.scenes) {
    const authored = scene.start + deadline;
    const sampled = sampledMotionDeadline(authored, episode.durationSeconds);
    assert.ok(sampled >= authored);
    assert.ok(sampled - authored < episode.durationSeconds / 299 + 0.001);
    assert.ok(sampled < scene.start + scene.duration);
  }
});
