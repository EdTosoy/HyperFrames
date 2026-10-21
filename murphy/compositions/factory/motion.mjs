const q = JSON.stringify;
export const isReduced = (episode) => episode.motionMode === "reduced";
export const motionDuration = (config, episode, key = "enterSeconds") =>
  isReduced(episode) ? config.motion.reducedSeconds : config.motion[key];
export function reveal(selector, at, config, episode, mode = "rise") {
  const y = mode === "rise" && !isReduced(episode) ? config.motion.risePixels : 0;
  return `tl.fromTo(${q(selector)},{y:${y},autoAlpha:0},{y:0,autoAlpha:1,duration:${mode === "none" ? 0 : motionDuration(config, episode)},ease:${q(config.motion.ease)}},${at});`;
}
export function hide(selector, at, config, episode) {
  return `tl.to(${q(selector)},{autoAlpha:0,duration:${motionDuration(config, episode, "replaceSeconds")},ease:'none'},${at});`;
}
export function emphasize(selector, at, style, config, episode) {
  const duration = motionDuration(config, episode, "highlightSeconds");
  return `${["underline", "both"].includes(style) ? `tl.fromTo(${q(selector)},{'--highlight-scale':0},{'--highlight-scale':1,duration:${duration},ease:'none'},${at});` : ""}
${["color", "both"].includes(style) ? `tl.fromTo(${q(selector)},{color:${q(config.tokens.text)}},{color:${q(config.tokens.grammar)},duration:${duration},ease:'none'},${at});` : ""}`;
}
