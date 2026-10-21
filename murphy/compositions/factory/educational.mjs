import { escapeHtml as h, markedText, symbol } from "./primitives.mjs";
import { reveal, hide, emphasize, motionDuration, isReduced } from "./motion.mjs";

const support = (scene) => (scene.body ? `<p class="support">${h(scene.body)}</p>` : "");
const title = (scene, episode) => {
  const unit =
    scene.visual.unit === undefined ? episode.curriculum.unit : scene.visual.unit;
  const part = scene.visual.part ?? episode.curriculum.part;
  return `<div class="title-lockup"><p class="unit-tag">${unit === null ? "LIBRARY DEMO" : `UNIT ${String(unit).padStart(2, "0")}`} / PART ${String(part).padStart(2, "0")}</p>${scene.visual.subtitle ? `<p class="title-subtitle">${h(scene.visual.subtitle)}</p>` : ""}<div class="title-rule"></div>${support(scene)}</div>`;
};
const builder = (scene) =>
  `<div class="state-stack">${scene.visual.states.map((state, i) => `<div id="${scene.id}-state-${i}" class="builder-state"><p class="state-label">${h(state.label)}</p><div class="word-groups">${state.groups.map((group, j) => `<div id="${scene.id}-group-${i}-${j}" class="word-group"><span class="role-label">${h(group.role)}</span><span class="group-text mark" id="${scene.id}-mark-${i}-${j}">${h(group.text)}</span></div>`).join("")}</div></div>`).join("")}</div>${support(scene)}`;
const animateBuilder = (scene, config, episode) =>
  scene.visual.states
    .map((state, i) => {
      const at = state.at + (i ? config.motion.replaceSeconds : 0);
      return `${i ? hide(`#${scene.id}-state-${i - 1}`, state.at, config, episode) : ""}
${reveal(`#${scene.id}-state-${i}`, at, config, episode, "fade")}
${state.groups
  .map(
    (
      group,
      j,
    ) => `${reveal(`#${scene.id}-group-${i}-${j}`, at + j * config.motion.staggerSeconds, config, episode)}
${emphasize(`#${scene.id}-mark-${i}-${j}`, at + j * config.motion.staggerSeconds + config.motion.enterSeconds, group.emphasis || "none", config, episode)}`,
  )
  .join("\n")}`;
    })
    .join("\n");
const comparison = (scene) =>
  `<div class="comparison comparison-${scene.visual.layout}">${scene.visual.items.map((item, i) => `<article id="${scene.id}-compare-${i}" class="comparison-card verdict-${item.verdict}"><p class="verdict">${symbol(item.verdict)}<span>${item.verdict === "correct" ? "CORRECT" : item.verdict === "incorrect" ? "REVISE" : "ALSO VALID"}</span></p><p class="card-label">${h(item.label)}</p><p class="compare-text">${markedText(item.text, item.emphasis ? [item.emphasis] : [])}</p>${item.note ? `<p class="support">${h(item.note)}</p>` : ""}</article>`).join("")}</div>${support(scene)}`;
const animateComparison = (scene, config, episode) =>
  scene.visual.items
    .map(
      (
        _,
        i,
      ) => `${i && scene.visual.layout === "sequential" ? hide(`#${scene.id}-compare-0`, scene.visual.secondAt, config, episode) : ""}
${reveal(`#${scene.id}-compare-${i}`, i ? (scene.visual.layout === "sequential" ? scene.visual.secondAt + config.motion.replaceSeconds : config.motion.enterSeconds + config.motion.staggerSeconds) : config.motion.enterSeconds, config, episode)}`,
    )
    .join("\n");
const timeline = (scene) => {
  const v = scene.visual;
  return `<div class="time-diagram"><div class="time-labels"><span>${h(v.labels.past)}</span><span style="left:${v.now * 100}%">${h(v.labels.present)}</span><span>${h(v.labels.future)}</span></div><div class="time-axis"></div><div id="${scene.id}-now" class="now-marker" style="left:${v.now * 100}%"></div><div class="event-rows">${v.events.map((event, i) => `<div id="${scene.id}-event-${i}" class="event-row"><p class="event-label">${h(event.label)} <span class="event-status">${h(event.status)}</span></p><div class="event-track">${event.end === undefined ? `<span class="event-point" style="left:${event.start * 100}%"></span>` : `<span class="event-line event-${event.status}" style="left:${event.start * 100}%;width:${(event.end - event.start) * 100}%"></span>`}</div></div>`).join("")}</div></div>${support(scene)}`;
};
const animateTimeline = (
  scene,
  config,
  episode,
) => `${reveal(`#${scene.id}-now`, config.motion.enterSeconds, config, episode, "fade")}
${scene.visual.events
  .map(
    (event, i) => `${reveal(`#${scene.id}-event-${i}`, event.at, config, episode, "fade")}
${event.end === undefined ? "" : `tl.fromTo('#${scene.id}-event-${i} .event-line',{scaleX:0},{scaleX:1,duration:${isReduced(episode) ? 0 : config.motion.drawSeconds},ease:'none'},${event.at});`}`,
  )
  .join("\n")}`;
const dialogue = (scene) =>
  `<div class="dialogue">${scene.visual.messages
    .map((message, i) => {
      const speaker = scene.visual.speakers.find((s) => s.id === message.speakerId);
      return `<article id="${scene.id}-message-${i}" class="speech speech-${speaker.side}"><p class="speaker">${symbol("speaker")}<span>${h(speaker.name)}</span></p><p class="speech-text">${markedText(message.text, message.emphasis ? [message.emphasis] : [])}</p></article>`;
    })
    .join("")}</div>${support(scene)}`;
const animateDialogue = (scene, config, episode) =>
  scene.visual.messages
    .map((message, i) => reveal(`#${scene.id}-message-${i}`, message.at, config, episode))
    .join("\n");
const focus = (scene) =>
  `<p class="focus-sentence">${scene.visual.tokens.map((token, i) => `<span id="${scene.id}-focus-${i}" class="focus-token mark">${token.replacement ? `<span id="${scene.id}-before-${i}" class="replacement-before">${h(token.text)}</span><span id="${scene.id}-after-${i}" class="replacement-after">${h(token.replacement.text)}</span>` : h(token.text)}</span>`).join(" ")}</p>${scene.visual.note ? `<p class="support">${h(scene.visual.note)}</p>` : ""}${support(scene)}`;
const animateFocus = (scene, config, episode) =>
  scene.visual.tokens
    .map(
      (
        token,
        i,
      ) => `${emphasize(`#${scene.id}-focus-${i}`, token.at, token.emphasis, config, episode)}
${
  token.replacement
    ? `${hide(`#${scene.id}-before-${i}`, token.replacement.at, config, episode)}
${reveal(`#${scene.id}-after-${i}`, token.replacement.at + config.motion.replaceSeconds, config, episode, "fade")}`
    : ""
}`,
    )
    .join("\n");
const recap = (scene, episode, assets, config) =>
  `<div class="recap-pattern">${h(scene.visual.pattern)}</div><div class="takeaways">${scene.visual.takeaways.map((item, i) => `<p id="${scene.id}-takeaway-${i}" class="takeaway">${symbol("correct")}<span>${h(item)}</span></p>`).join("")}</div>${scene.visual.reminder ? `<p class="support">${h(scene.visual.reminder)}</p>` : ""}${scene.visual.nextPart ? `<p class="next-part">${h(scene.visual.nextPart)}</p>` : ""}<p class="end-brand">${h(config.branding.seriesTitle)}</p>`;
const animateRecap = (scene, config, episode) =>
  scene.visual.takeaways
    .map((_, i) =>
      reveal(
        `#${scene.id}-takeaway-${i}`,
        config.motion.enterSeconds + i * config.motion.staggerSeconds,
        config,
        episode,
      ),
    )
    .join("\n");

export function renderQuiz(scene, episode) {
  const question = episode.quizzes.find((q) => q.id === scene.quizId);
  const fill = question.kind === "fill-blank";
  const answer = fill ? question.answer : question.choices[question.answerIndex];
  return `<p class="quiz-prompt">${h(question.question)}</p>${fill ? "" : `<div class="quiz-choices">${question.choices.map((choice, i) => `<p class="quiz-choice"><span class="choice-number">${String.fromCharCode(65 + i)}</span><span>${h(choice)}</span></p>`).join("")}</div>`}<div class="quiz-response"><div id="${scene.id}-thinking" class="thinking"><p>${h(scene.visual.thinkingLabel)}</p><div class="thinking-track"><div id="${scene.id}-thinking-bar" class="thinking-bar"></div></div></div><div id="${scene.id}-answer" class="quiz-answer"><p class="verdict">${symbol("correct")}<span>ANSWER / ${h(answer)}</span></p><p class="support">${h(question.explanation)}</p></div></div>`;
}
export function animateQuiz(scene, config, episode) {
  const from = scene.visual.thinkingFrom ?? config.motion.enterSeconds;
  return `${reveal(`#${scene.id}-thinking`, from, config, episode, "fade")}
tl.fromTo('#${scene.id}-thinking-bar',{scaleX:1},{scaleX:0,duration:${scene.answerAt - from},ease:'none'},${from});
${hide(`#${scene.id}-thinking`, scene.answerAt, config, episode)}
${reveal(`#${scene.id}-answer`, scene.answerAt + config.motion.replaceSeconds, config, episode, "fade")}`;
}

// The Phase 1 registry remains the only selection point; this is a small extension.
export const educational = Object.fromEntries(
  Object.entries({
    title: { render: title },
    "sentence-builder": { render: builder, animate: animateBuilder },
    comparison: { render: comparison, animate: animateComparison },
    timeline: { render: timeline, animate: animateTimeline },
    dialogue: { render: dialogue, animate: animateDialogue },
    "phrase-focus": { render: focus, animate: animateFocus },
    recap: { render: recap, animate: animateRecap },
  }).map(([id, descriptor]) => [
    id,
    { file: "compositions/factory/educational.mjs", ...descriptor },
  ]),
);
