import test from "node:test";
import assert from "node:assert/strict";
import { loadEpisode, validateEpisode, config } from "../scripts/project.mjs";
import { components } from "../compositions/factory/components.mjs";
const id = "u003-p01-present-continuous";
test("Unit 3 is a complete silent lesson with five-second practice and original movement", () => {
  const e = loadEpisode(id);
  assert.deepEqual(validateEpisode(e), []);
  assert.equal(e.narration, null);
  assert.equal(e.status, "draft");
  assert.equal(e.reviewEvidence, null);
  assert.equal(e.scenes.at(-1).start + e.scenes.at(-1).duration, e.durationSeconds);
  assert.equal(e.quizzes.length, 9);
  for (const s of e.scenes.filter((s) => s.component === "quiz"))
    assert.equal(s.answerAt - s.visual.thinkingFrom, 5);
  for (const word of ["present continuous", "making", "running", "lying", "not"])
    assert.ok(e.script.includes(word));
  const s = e.scenes.find((s) => s.visual?.layers?.[0]?.cycles);
  assert.match(
    components["visual-context"].animate(s, config, e),
    /"repeat":8,"yoyo":true/,
  );
  const bad = structuredClone(e);
  bad.scenes.find((s) => s.visual?.layers?.[0]?.cycles).visual.layers[0].duration = 10;
  assert.match(validateEpisode(bad).join("\n"), /final hold/);
  const reduced = components["visual-context"].animate(s, config, {
    ...e,
    motionMode: "reduced",
  });
  assert.match(reduced, /"repeat":0/);
});
