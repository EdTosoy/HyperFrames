import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { loadEpisode, validateEpisode } from "../scripts/project.mjs";
const id = "u005-p01-present-simple";
test("Unit 5 is one valid silent draft with twelve timed explanatory exercises", () => {
  const e = loadEpisode(id);
  assert.deepEqual(validateEpisode(e), []);
  assert.equal(e.narration, null);
  assert.equal(e.status, "draft");
  assert.equal(e.reviewEvidence, null);
  assert.equal(e.quizzes.length, 12);
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
  const i = e.scenes.findIndex((s) => s.heading === "Look at Nora’s routine");
  assert.equal(e.scenes[i + 1].heading, "Describe the routine");
});
test("Unit 5 has calendar evidence, accurate spelling and scoped placement teaching", () => {
  const e = loadEpisode(id);
  for (const t of [
    "works",
    "watches",
    "finishes",
    "passes",
    "has",
    "does",
    "goes",
    "studies",
    "tries",
    "plays",
    "enjoys",
    "always",
    "usually",
    "often",
    "sometimes",
    "never",
  ])
    assert.ok(e.script.includes(t), t);
  assert.ok(e.script.includes("not fixed counts or percentages"));
  assert.ok(e.script.includes("one listener or several"));
  const s = e.scenes.find((s) => s.heading === "Move always into place");
  assert.equal(s.visual.layers[1].via.y, 85);
  assert.ok(s.visual.layers[2].to.x < 0);
  const weeks = e.assets.filter((a) => a.id.startsWith("u005-week-"));
  assert.equal(weeks.length, 5);
  const cups = weeks.map(
    (a) =>
      (
        readFileSync(new URL("../" + a.path, import.meta.url), "utf8").match(
          /transform="translate/g,
        ) || []
      ).length,
  );
  assert.deepEqual(cups, [7, 6, 4, 2, 0]);
});
test("Unit 5 editable reading copy matches the complete original narration", () => {
  const e = loadEpisode(id);
  let s = readFileSync(
    new URL("../episodes/" + id + "/SCRIPT.md", import.meta.url),
    "utf8",
  );
  s = s
    .slice(s.indexOf("## 0–16s"))
    .replace(/^## .*$/gm, "")
    .replace(/\[Visual:[^\]]*\]/g, "");
  const words = (s) =>
    s.replace(/\[Pause[^\]]*\]/g, "").match(/[A-Za-z0-9]+(?:[’'][A-Za-z]+)*/g);
  assert.deepEqual(words(s), words(e.script));
});
