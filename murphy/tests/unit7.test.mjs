import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { loadEpisode, validateEpisode } from "../scripts/project.mjs";

const id = "u007-p01-present-simple-questions";
test("Unit 7 is one complete silent draft extending positive and negative statements", () => {
  const e = loadEpisode(id);
  assert.deepEqual(validateEpisode(e), []);
  assert.equal(e.curriculum.unit, 7);
  assert.equal(e.narration, null);
  assert.equal(e.status, "draft");
  assert.equal(e.reviewEvidence, null);
  assert.deepEqual(e.publication, []);
  assert.equal(e.scenes.at(-1).start + e.scenes.at(-1).duration, e.durationSeconds);
  assert.deepEqual(
    e.scenes[0].visual.states.map((s) => s.groups.map((g) => g.text).join(" ")),
    ["She plays tennis.", "She doesn't play tennis.", "Does she play tennis?"],
  );
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

test("Unit 7 moves real ending letters and restores complete base words", () => {
  const e = loadEpisode(id);
  const pairs = [
    ["works", "work", "Does he work here?"],
    ["likes", "like", "Does she like music?"],
    ["watches", "watch", "Does she watch films?"],
    ["studies", "study", "Does he study here?"],
    ["has", "have", "Does she have a bicycle?"],
    ["goes", "go", "Does he go by train?"],
  ];
  for (const [positive, base, question] of pairs) {
    const s = e.scenes.find((s) => s.heading === `${positive} → ${base}`);
    assert.equal(s.visual.states[1].text, question);
    assert.equal(s.visual.layers.length, 1);
    const layer = s.visual.layers[0];
    assert.notDeepEqual(layer.from, layer.to);
    const after = e.assets.find((a) => a.id === s.visual.states[1].assetId);
    assert.ok(
      readFileSync(new URL(`../${after.path}`, import.meta.url), "utf8").includes(
        `>${base}</text>`,
      ),
    );
    assert.ok(layer.at + layer.duration < s.visual.states[1].at);
  }
});

test("Unit 7 practice protects five seconds before any answer or explanatory caption", () => {
  const e = loadEpisode(id);
  assert.equal(e.quizzes.length, 12);
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
  const last = e.scenes.findIndex((s) => s.heading === "Ask about the method");
  assert.equal(e.scenes[last - 1].component, "visual-context");
});

test("Unit 7 covers scoped information questions, do roles and perspective in an editable script", () => {
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
  assert.equal((body.match(/\[Pause for five seconds\.\]/g) || []).length, 12);
  assert.ok(e.captions.every((c) => c.end - c.start >= 1));
  const taught = e.scenes.filter((s) => s.purpose === "grammar-breakdown");
  for (const word of ["What", "Where", "When", "Why", "How", "How often", "How much"])
    assert.ok(
      taught.some((s) => s.visual.states?.some((state) => state.text?.startsWith(word))),
    );
  const roles = e.scenes.find((s) => s.heading === "Two words, different jobs").visual
    .states[0].groups;
  assert.equal(roles[1].text, "do");
  assert.equal(roles[1].role, "auxiliary");
  assert.equal(roles[3].text, "do?");
  assert.equal(roles[3].role, "verb");
  const perspective = e.scenes.find((s) => s.heading === "The speaker’s viewpoint");
  assert.equal(perspective.visual.messages[0].text, "Do you drive?");
  assert.equal(perspective.visual.messages[1].text, "Yes, I do.");
  assert.ok(e.script.includes("not a rule for every English question"));
});
