import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { loadEpisode, validateEpisode, config } from "../scripts/project.mjs";
import { components } from "../compositions/factory/components.mjs";
const id = "u004-p01-present-continuous-questions";
test("Unit 4 is a complete silent draft with ten five-second explanatory quizzes", () => {
  const e = loadEpisode(id);
  assert.deepEqual(validateEpisode(e), []);
  assert.equal(e.narration, null);
  assert.equal(e.status, "draft");
  assert.equal(e.reviewEvidence, null);
  assert.equal(e.curriculum.unit, 4);
  assert.equal(e.quizzes.length, 10);
  assert.equal(e.scenes.at(-1).start + e.scenes.at(-1).duration, e.durationSeconds);
  for (const s of e.scenes.filter((s) => s.component === "quiz")) {
    assert.equal(s.answerAt - s.visual.thinkingFrom, 5);
    assert.ok(
      !e.captions.some(
        (c) => c.start < s.start + s.answerAt && c.end > s.start + s.visual.thinkingFrom,
      ),
    );
    assert.ok(e.quizzes.find((q) => q.id === s.quizId).explanation.length > 10);
  }
});
test("Unit 4 swaps be and the subject while keeping the action fixed", () => {
  const e = loadEpisode(id);
  const s = e.scenes[0];
  const [subject, be, action] = s.visual.layers;
  assert.equal(subject.x + subject.to.x, be.x);
  assert.equal(be.x + be.to.x, subject.x);
  assert.deepEqual(action.from, action.to);
  assert.match(components["visual-context"].animate(s, config, e), /svgOrigin/);
  const context = e.scenes.findIndex((s) => s.heading === "Look before you ask");
  assert.equal(e.scenes[context + 1].heading, "Ask about Ava");
});
test("Unit 4 narration reading copy matches the complete episode script", () => {
  const e = loadEpisode(id);
  let copy = readFileSync(
    new URL("../episodes/" + id + "/SCRIPT.md", import.meta.url),
    "utf8",
  );
  copy = copy
    .slice(copy.indexOf("## 0–18s"))
    .replace(/^## .*$/gm, "")
    .replace(/\[Visual:[^\]]*\]/g, "");
  const words = (s) =>
    s.replace(/\[Pause[^\]]*\]/g, "").match(/[A-Za-z0-9]+(?:[’'][A-Za-z]+)*/g);
  assert.deepEqual(words(copy), words(e.script));
  for (const q of [
    "Am I",
    "Is he",
    "Is she",
    "Is it",
    "Are you",
    "Are we",
    "Are they",
    "What",
    "Where",
    "Why",
    "Who",
    "How",
  ])
    assert.ok(e.script.toLowerCase().includes(q.toLowerCase()));
});

test("routed word tiles reject out-of-bounds intermediate poses and repeated routes", () => {
  const e = structuredClone(loadEpisode(id));
  const s = e.scenes[0];
  const layer = s.visual.layers[1];
  assert.ok(layer.via.y < 0);
  layer.via.y = -500;
  assert.match(validateEpisode(e).join("\n"), /poses must fit|must be >=/);
  layer.via.y = -100;
  layer.cycles = 3;
  assert.match(validateEpisode(e).join("\n"), /single cycle/);
  layer.cycles = 1;
  const motion = components["visual-context"].animate(s, config, {
    ...e,
    motionMode: "reduced",
  });
  assert.match(motion, /"duration":0/);
});
