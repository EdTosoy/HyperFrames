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

const context = (scene, episode, assets) => {
  const states = scene.visual.states;
  const shared = states.every((s) => s.assetId === states[0].assetId);
  return `<div class="context-stack${shared ? " context-shared" : ""}">${shared ? `<img class="illustration" src="${escapeHtml(assets.get(states[0].assetId).path)}" alt="${escapeHtml(scene.heading)}">` : ""}${states.map((state, i) => `<div id="${scene.id}-context-${i}" class="context-state">${shared ? "" : `<img class="illustration" src="${escapeHtml(assets.get(state.assetId).path)}" alt="${escapeHtml(state.text)}">`}<p class="context-sentence">${escapeHtml(state.text)}</p></div>`).join("")}${scene.visual.layers ? `<svg class="context-overlay" viewBox="0 0 720 320" aria-label="Animated context objects">${scene.visual.layers.map((layer, i) => `<g transform="translate(${layer.x} ${layer.y})"><g id="${scene.id}-layer-${i}"><image href="${escapeHtml(assets.get(layer.assetId).path)}" width="${layer.width}" height="${layer.height}"/></g></g>`).join("")}</svg>` : ""}</div>`;
};

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
    render: context,
    animate: (scene, config, episode) =>
      scene.visual.states
        .map(
          (
            state,
            i,
          ) => `${i ? hide(`#${scene.id}-context-${i - 1}`, state.at, config, episode) : ""}
${reveal(`#${scene.id}-context-${i}`, state.at + (i ? config.motion.replaceSeconds : 0), config, episode, "fade")}`,
        )
        .join("\n") +
      (scene.visual.layers || [])
        .map((layer, i) =>
          layer.via
            ? `tl.fromTo('#${scene.id}-layer-${i}',${JSON.stringify({ ...layer.from, svgOrigin: "0 0" })},${JSON.stringify({ ...layer.via, svgOrigin: "0 0", duration: episode.motionMode === "reduced" ? 0 : layer.duration / 2, ease: config.motion.ease })},${layer.at});
             tl.to('#${scene.id}-layer-${i}',${JSON.stringify({ ...layer.to, svgOrigin: "0 0", duration: episode.motionMode === "reduced" ? 0 : layer.duration / 2, ease: config.motion.ease })},${layer.at + (episode.motionMode === "reduced" ? 0 : layer.duration / 2)});`
            : `tl.fromTo('#${scene.id}-layer-${i}',${JSON.stringify({ ...layer.from, svgOrigin: "0 0" })},${JSON.stringify({ ...layer.to, svgOrigin: "0 0", duration: episode.motionMode === "reduced" ? 0 : layer.duration, repeat: episode.motionMode === "reduced" ? 0 : (layer.cycles || 1) - 1, yoyo: layer.yoyo ?? true, ease: config.motion.ease })},${layer.at});`,
        )
        .join("\n"),
  },
  quiz: {
    file: "compositions/factory/components.mjs",
    render: quiz,
    animate: animateQuiz,
  },
});
