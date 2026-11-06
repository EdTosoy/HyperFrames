import { reveal, hide } from "./motion.mjs";
import { escapeHtml } from "./primitives.mjs";
import { educational, renderQuiz, animateQuiz } from "./educational.mjs";
export { escapeHtml } from "./primitives.mjs";

const card = (scene, episode) =>
  `<p class="body">${escapeHtml(scene.body)}</p>${scene.ruleIds.map((id) => `<p class="body">${escapeHtml(episode.rules.find((rule) => rule.id === id).explanation)}</p>`).join("")}`;
const sentence = (scene, episode) => {
  const example = episode.examples.find((item) => item.id === scene.exampleId);
  return `<p class="sentence">${example.tokens.map((token) => `<span class="word${token.highlight ? " highlight" : ""}">${escapeHtml(token.text)}</span>`).join(" ")}</p><p class="body">${escapeHtml(example.explanation)}</p>`;
};
const quiz = (scene, episode) => {
  if (scene.visual) return renderQuiz(scene, episode);
  const question = episode.quizzes.find((item) => item.id === scene.quizId);
  return `<p class="body">${escapeHtml(question.question)}</p><div class="choices">${question.choices.map((choice, index) => `<p class="body">${index + 1}. ${escapeHtml(choice)}</p>`).join("")}</div><p class="body answer" id="${scene.id}-answer">${escapeHtml(question.choices[question.answerIndex])} — ${escapeHtml(question.explanation)}</p>`;
};
const image = (scene, episode, assets) =>
  `<img class="illustration" src="${escapeHtml(assets.get(scene.mediaAssetId).path)}" alt="${escapeHtml(scene.body)}"><p class="body">${escapeHtml(scene.body)}</p>`;

// Explicit, small registry. Add a renderer here and corresponding contract tests.
export const components = Object.freeze({
  ...Object.fromEntries(
    Object.entries({ card, sentence, quiz, image }).map(([id, render]) => [
      id,
      { file: "compositions/factory/components.mjs", render },
    ]),
  ),
  ...educational,
  "visual-context": {
    file: "compositions/factory/components.mjs",
    render: (scene, episode, assets) =>
      `<div class="context-stack">${scene.visual.states.map((state, i) => `<div id="${scene.id}-context-${i}" class="context-state"><img class="illustration" src="${escapeHtml(assets.get(state.assetId).path)}" alt="${escapeHtml(state.text)}"><p class="context-sentence">${escapeHtml(state.text)}</p></div>`).join("")}</div>`,
    animate: (scene, config, episode) =>
      scene.visual.states
        .map(
          (
            state,
            i,
          ) => `${i ? hide(`#${scene.id}-context-${i - 1}`, state.at, config, episode) : ""}
${reveal(`#${scene.id}-context-${i}`, state.at + (i ? config.motion.replaceSeconds : 0), config, episode, "fade")}`,
        )
        .join("\n"),
  },
  quiz: {
    file: "compositions/factory/components.mjs",
    render: quiz,
    animate: animateQuiz,
  },
});
