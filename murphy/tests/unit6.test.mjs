import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { loadEpisode, validateEpisode } from "../scripts/project.mjs";

const id = "u006-p01-present-simple-negative";
test("Unit 6 is a complete rerenderable silent draft with protected release state", () => {
  const e = loadEpisode(id);
  assert.deepEqual(validateEpisode(e), []);
  assert.equal(e.curriculum.unit, 6);
  assert.equal(e.narration, null);
  assert.equal(e.status, "draft");
  assert.equal(e.reviewEvidence, null);
  assert.deepEqual(e.publication, []);
  assert.equal(e.scenes.at(-1).start + e.scenes.at(-1).duration, e.durationSeconds);
  assert.deepEqual(
    [...new Set(e.scenes.map((s) => s.purpose))],
    [
      "hook",
      "real-life-example",
      "visual-explanation",
      "grammar-breakdown",
      "guided-practice",
      "recap",
    ],
  );
});

test("Every Unit 6 practice protects five caption-free seconds and explains the answer", () => {
  const e = loadEpisode(id);
  assert.equal(e.quizzes.length, 13);
  for (const s of e.scenes.filter((s) => s.component === "quiz")) {
    const q = e.quizzes.find((q) => q.id === s.quizId);
    assert.equal(s.answerAt - s.visual.thinkingFrom, 5);
    assert.ok(s.visual.thinkingFrom >= 1);
    assert.ok(
      !e.captions.some(
        (c) => c.start < s.start + s.answerAt && c.end > s.start + s.visual.thinkingFrom,
      ),
    );
    const answer = q.kind === "fill-blank" ? q.answer : q.choices[q.answerIndex];
    assert.ok(answer.length > 0 && q.explanation.length > 25);
    assert.ok(
      e.captions.some(
        (c) =>
          c.start >= s.start + s.answerAt &&
          c.end <= s.start + s.duration &&
          c.text.includes(answer),
      ),
    );
  }
});

test("Unit 6 explicitly restores special base forms and corrects subject agreement", () => {
  const e = loadEpisode(id);
  const replacements = e.scenes
    .filter((s) => s.component === "phrase-focus")
    .flatMap((s) =>
      s.visual.tokens
        .filter((t) => t.replacement)
        .map((t) => [t.text, t.replacement.text]),
    );
  for (const pair of [
    ["She watches films.", "She doesn’t watch films."],
    ["She studies at night.", "She doesn’t study at night."],
    ["She has a bicycle.", "She doesn’t have a bicycle."],
    ["He does his homework.", "He doesn’t do his homework."],
    ["She goes by train.", "She doesn’t go by train."],
  ])
    assert.ok(replacements.some((p) => JSON.stringify(p) === JSON.stringify(pair)));
  for (const s of e.scenes.filter((s) => s.component === "comparison")) {
    assert.equal(s.visual.layout, "sequential");
    assert.equal(s.visual.items[0].verdict, "incorrect");
    assert.equal(s.visual.items[1].verdict, "correct");
    assert.ok(s.visual.secondAt >= 3);
  }
  const practice = e.scenes.findIndex((s) => s.heading === "Describe Lea’s habit");
  assert.equal(e.scenes[practice - 1].component, "visual-context");
  assert.ok(e.script.includes("not always equivalent"));
  assert.ok(e.script.includes("not a fixed definition"));
});

test("Unit 6 editable script preserves all narrated teaching and pause cues", () => {
  const e = loadEpisode(id);
  const copy = readFileSync(
    new URL(`../episodes/${id}/SCRIPT.md`, import.meta.url),
    "utf8",
  );
  const body = copy
    .slice(copy.indexOf("## 0–"))
    .replace(/^## .*$/gm, "")
    .replace(/\[Visual:[^\]]*\]/g, "");
  const words = (s) => s.match(/[A-Za-z0-9]+(?:[’'][A-Za-z]+)*/g);
  assert.deepEqual(words(body), words(e.script));
  assert.equal((body.match(/\[Pause for five seconds\.\]/g) || []).length, 13);
  assert.ok(
    e.captions.every((c) => c.end - c.start >= 1),
    "Avoid unreadably brief caption fragments",
  );
});
