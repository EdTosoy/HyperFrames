import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { loadEpisode, validateEpisode } from "../scripts/project.mjs";

const id = "u008-p01-present-simple-vs-continuous";
test("Unit 8 combines previous forms in one complete silent draft", () => {
  const e = loadEpisode(id);
  assert.deepEqual(validateEpisode(e), []);
  assert.equal(e.curriculum.unit, 8);
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

test("Unit 8 preserves reading identity, actual page motion and around-now meaning", () => {
  const e = loadEpisode(id);
  const first = e.scenes[0];
  assert.equal(first.visual.states[0].assetId, "u008-reader");
  assert.equal(first.visual.layers[0].assetId, "u008-page");
  assert.notEqual(first.visual.layers[0].from.scaleX, first.visual.layers[0].to.scaleX);
  assert.ok(first.visual.layers[0].cycles > 1);
  const source = (assetId) =>
    readFileSync(
      new URL(`../${e.assets.find((a) => a.id === assetId).path}`, import.meta.url),
      "utf8",
    );
  assert.ok(source("u008-reading-week").includes("Maya · her novel"));
  assert.ok(source("u008-reader-dan").includes("Dan · his book"));
  const interval = e.scenes.find((s) => s.component === "timeline").visual;
  assert.ok(
    interval.events[0].start < interval.now && interval.events[0].end > interval.now,
  );
  assert.ok(e.script.includes("Both sentences can be true"));
  assert.ok(e.script.includes("does not always mean an action at the exact second"));
});

test("All Unit 8 exercises protect five caption-free seconds and explain their answers", () => {
  const e = loadEpisode(id);
  assert.equal(e.quizzes.length, 14);
  for (const s of e.scenes.filter((s) => s.component === "quiz")) {
    const q = e.quizzes.find((q) => q.id === s.quizId);
    assert.equal(s.answerAt - s.visual.thinkingFrom, 5);
    assert.ok(
      !e.captions.some(
        (c) => c.start < s.start + s.answerAt && c.end > s.start + s.visual.thinkingFrom,
      ),
    );
    const answer = q.kind === "fill-blank" ? q.answer : q.choices[q.answerIndex];
    assert.ok(q.explanation.length > 25);
    assert.ok(
      e.captions.some(
        (c) =>
          c.start >= s.start + s.answerAt &&
          c.end <= s.start + s.duration &&
          c.text.includes(answer),
      ),
    );
  }
  const q = e.quizzes.find((q) => q.id === "u8-q2");
  assert.ok(
    !q.question.includes("reads"),
    "The routine prompt must not supply the answer form",
  );
});

test("Unit 8 scopes state meanings and retains a complete editable narration copy", () => {
  const e = loadEpisode(id);
  for (const word of [
    "like",
    "love",
    "want",
    "need",
    "know",
    "understand",
    "remember",
    "forget",
    "believe",
    "prefer",
    "mean",
  ])
    assert.ok(e.script.toLowerCase().includes(word), word);
  assert.ok(
    e.script.includes("Do not turn that into a claim that they can never be continuous"),
  );
  assert.ok(e.script.includes("other meanings or contexts with continuous forms"));
  assert.ok(e.script.includes("repeated memory habit"));
  assert.ok(e.script.includes("The continuous wording can fit other contexts"));
  assert.ok(e.script.includes("I'm having lunch describes an activity"));
  assert.ok(e.script.includes("I have a bicycle describes possession"));
  assert.ok(!e.script.includes("Unit 9"));
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
  assert.equal((body.match(/\[Pause for five seconds\.\]/g) || []).length, 14);
  assert.ok(e.captions.every((c) => c.end - c.start >= 1));
});
