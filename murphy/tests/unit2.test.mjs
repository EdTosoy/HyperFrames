import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const episode = JSON.parse(
  readFileSync(
    new URL("../episodes/u002-p01-am-is-are-questions/episode.json", import.meta.url),
  ),
);
test("Unit 2 stays a complete silent draft with owner recording pending", () => {
  assert.equal(episode.curriculum.unit, 2);
  assert.equal(episode.status, "draft");
  assert.equal(episode.narration, null);
  assert.equal(episode.reviewEvidence, null);
  assert.equal(
    episode.scenes.at(-1).start + episode.scenes.at(-1).duration,
    episode.durationSeconds,
  );
  for (const word of ["What", "Who", "Where", "How", "Why"])
    assert.ok(episode.script.includes(word));
});
test("Unit 2 quizzes keep answer captions out of the thinking pause", () => {
  const scenes = episode.scenes.filter((s) => s.component === "quiz");
  assert.equal(scenes.length, 9);
  for (const s of scenes) {
    assert.equal(s.answerAt - s.visual.thinkingFrom, 5);
    assert.equal(
      episode.captions.filter(
        (c) => c.start < s.start + s.answerAt && c.end > s.start + s.visual.thinkingFrom,
      ).length,
      0,
    );
    assert.ok(
      episode.captions.some(
        (c) => c.start >= s.start + s.answerAt && c.end <= s.start + s.duration,
      ),
    );
  }
});
test("Unit 2 word movement crosses be and the subject using existing layers", () => {
  const s = episode.scenes.find((s) => s.visual.layers);
  assert.equal(s.component, "visual-context");
  assert.ok(s.visual.layers[0].to.x > 0);
  assert.ok(s.visual.layers[1].to.x < 0);
  assert.equal(s.visual.layers[2].to.x, 0);
});
