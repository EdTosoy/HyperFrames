import test from "node:test";
import assert from "node:assert/strict";
import { loadEpisode, validateEpisode, config } from "../scripts/project.mjs";
import { components } from "../compositions/factory/components.mjs";

const lessonIds = ["u001-p01-am-is-are-complete", "u002-p01-am-is-are-questions"];

test("silent guided practice gives five seconds after complete prompts, then explains answers", () => {
  let count = 0;
  for (const id of lessonIds) {
    const episode = loadEpisode(id);
    for (const scene of episode.scenes.filter((s) => s.component === "quiz")) {
      count++;
      const from = scene.visual.thinkingFrom;
      const question = episode.quizzes.find((q) => q.id === scene.quizId);
      assert.ok(from >= config.motion.enterSeconds);
      assert.equal(scene.answerAt - from, 5);
      const html = components.quiz.render(scene, episode);
      assert.ok(html.includes(question.explanation));
      assert.ok(question.explanation.trim().length > 0);
      const cues = episode.captions.filter(
        (c) => c.start >= scene.start && c.end <= scene.start + scene.duration,
      );
      assert.ok(cues.some((c) => c.end <= scene.start + from));
      assert.ok(
        cues.some(
          (c) =>
            c.start >=
            scene.start +
              scene.answerAt +
              config.motion.replaceSeconds +
              config.motion.enterSeconds,
        ),
      );
      for (const motionMode of ["full", "reduced"]) {
        const animation = components.quiz.animate(scene, config, {
          ...episode,
          motionMode,
        });
        assert.match(animation, /scaleX:0,duration:5,ease:'none'/);
      }
    }
  }
  assert.equal(count, 19);
});

test("silent lesson validation rejects short/long pauses, early starts and caption leaks", () => {
  for (const edit of [
    (s) => (s.answerAt -= 1 / 30),
    (s) => (s.answerAt += 1 / 30),
    (s) => {
      s.visual.thinkingFrom = 0;
      s.answerAt = 5;
    },
    (s, e) => {
      const cue = e.captions.find((c) => c.start >= s.start + s.answerAt);
      cue.start = s.start + s.answerAt - 1 / 30;
    },
    (s) => delete s.visual,
  ]) {
    const episode = structuredClone(loadEpisode(lessonIds[0]));
    edit(
      episode.scenes.find((s) => s.component === "quiz"),
      episode,
    );
    assert.match(validateEpisode(episode).join("\n"), /thinking.pause/);
  }
});

test("short fixtures and historical narration retain their authored timing", () => {
  for (const id of [
    "fixture-pipeline-smoke",
    "fixture-component-showcase",
    "u001-p01-am-is-are",
  ])
    assert.deepEqual(validateEpisode(loadEpisode(id), { checkLocalMedia: false }), []);
});
