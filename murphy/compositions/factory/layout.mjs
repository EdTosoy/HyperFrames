import { escapeHtml as h, components } from "./components.mjs";
import { markedText } from "./primitives.mjs";
import { reveal, motionDuration } from "./motion.mjs";
import { libraryStyles } from "./styles.mjs";

export function renderComposition(episode, config, assets, draft = true) {
  const p = config.profiles[episode.profile];
  const safe = config.safeAreas[episode.safeArea];
  const t = config.typography;
  const colors = Object.entries(config.tokens)
    .map(([key, value]) => `--${key}:${value}`)
    .join(";");
  const contentBottom = safe.bottom + safe.captionHeight + safe.captionGap;
  const sceneHtml = episode.scenes
    .map(
      (scene) =>
        `<div id="slot-${scene.id}" class="clip" data-composition-id="${scene.id}" data-composition-src="compositions/${scene.id}.html" data-start="${scene.start}" data-duration="${scene.duration}" data-track-index="1" data-track-kind="graphics" data-width="${p.width}" data-height="${p.height}"></div>`,
    )
    .join("\n");
  const captions = episode.captions
    .map(
      (cue) =>
        `<p id="${cue.id}" class="clip caption" data-start="${cue.start}" data-duration="${cue.end - cue.start}" data-track-index="2" data-track-kind="captions"><span class="caption-copy">${markedText(cue.text, cue.emphasis || [])}</span></p>`,
    )
    .join("\n");
  const narration = episode.narration
    ? `<audio id="narration" src="${h(assets.get(episode.narration.editAssetId).path)}" data-start="0" data-duration="${episode.durationSeconds}" data-track-index="3" data-volume="1"></audio>`
    : "";
  return `<!doctype html>
<!-- Generated from episode JSON. Edit the source specification and rebuild. -->
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=${p.width}, height=${p.height}"><title>${h(episode.title)}</title>
<script src="${h(assets.get(config.runtimeAssetId).path)}"></script>
<style>
@font-face{font-family:'${t.family}';src:url('${assets.get(t.fontAssetId).path}') format('truetype');font-weight:200 800;font-display:block}
:root{${colors}}
*{box-sizing:border-box;margin:0}html,body{width:${p.width}px;height:${p.height}px;overflow:hidden;background:var(--canvas);color:var(--text);font-family:'${t.family}',sans-serif}
#root{position:relative;width:100%;height:100%;overflow:hidden;background:var(--canvas)}.clip{position:absolute;inset:0;width:100%;height:100%}
.brand{position:absolute;left:${safe.left}px;right:${safe.right}px;top:${safe.top}px;font-size:${t.label}px;font-weight:800;letter-spacing:2px}
.content{position:absolute;left:${safe.left}px;right:${safe.right}px;top:${safe.top + config.layout.legacyContentOffset}px;bottom:${contentBottom}px;display:flex;flex-direction:column;justify-content:flex-start;gap:${config.layout.legacyGap}px}
.component-stage{display:flex;flex-direction:column;gap:${config.layout.legacyGap}px;min-height:0}
.label{font-size:${t.label}px;font-weight:700;text-transform:uppercase;line-height:1.4}.body{font-size:${t.body}px;line-height:1.35;font-weight:600;overflow-wrap:anywhere}
h1{font-size:${t.title}px;line-height:1.15;letter-spacing:-2px;font-weight:800;overflow-wrap:anywhere}
.sentence{font-size:${t.title}px;line-height:1.4;font-weight:800}.word{display:inline-block}.highlight{position:relative;color:var(--grammar);--highlight-scale:0}.highlight::after{content:'';position:absolute;left:0;right:0;bottom:0;height:5px;background:var(--focus);transform:scaleX(var(--highlight-scale));transform-origin:left}
.choices{display:flex;flex-direction:column;gap:18px}.answer{color:var(--grammar)}.illustration{max-width:100%;height:${config.layout.illustrationHeight}px;object-fit:contain}
.caption{inset:auto ${safe.right}px ${safe.bottom}px ${safe.left}px;width:auto;height:${safe.captionHeight}px;display:flex;align-items:center;font-size:${t.caption}px;line-height:1.35;font-weight:700;overflow-wrap:anywhere}
.draft{position:absolute;left:${safe.left}px;bottom:${safe.bottom - 70}px;font-size:${t.label}px;font-weight:800}
.caption-copy{display:block;max-width:100%;padding:${config.layout.captionPadding}px;background:var(--panel);border-radius:${config.surface.radius}px;white-space:pre-line}
.progress-track{position:absolute;left:${safe.left}px;right:${safe.right}px;top:${safe.top + config.layout.progressOffset}px;height:${config.layout.progressHeight}px;background:var(--line)}.series-progress{height:100%;width:100%;background:var(--grammar);transform-origin:left}
.content.library{top:${safe.top + config.layout.contentOffset}px;gap:${config.spacing.sm}px}.library h1{flex:none}.library .label{color:var(--muted)}
${libraryStyles(config)}
</style></head><body><div id="root" data-composition-id="episode" data-start="0" data-duration="${episode.durationSeconds}" data-width="${p.width}" data-height="${p.height}" data-fps="${p.fps}">
<header class="brand">${h(config.branding.label)}</header><div class="progress-track"><div class="series-progress"></div></div>
${sceneHtml}\n${captions}\n${narration}
${draft ? `<p class="draft">${episode.kind === "fixture" ? "INFRASTRUCTURE FIXTURE / NOT FOR PUBLICATION" : "DRAFT / NOT FOR PUBLICATION"}</p>` : ""}
</div><script>
window.__timelines=window.__timelines||{};
const tl=gsap.timeline({paused:true});
tl.fromTo('.series-progress',{scaleX:0},{scaleX:1,duration:${episode.durationSeconds},ease:'none'},0);
window.__timelines['episode']=tl;
</script></body></html>\n`;
}

export function renderScene(scene, index, episode, config, assets) {
  const p = config.profiles[episode.profile];
  const library = Boolean(scene.visual);
  const descriptor = components[scene.component];
  const entrance = scene.motion?.entrance || "rise";
  const exit =
    scene.motion?.exit ||
    (library && index < episode.scenes.length - 1 ? "fade" : "none");
  const label =
    scene.label ??
    (library ? scene.component.replaceAll("-", " ") : scene.purpose.replaceAll("-", " "));
  return `<template>
<div id="${scene.id}" data-composition-id="${scene.id}" data-duration="${scene.duration}" data-width="${p.width}" data-height="${p.height}">
<style>#${scene.id}{position:absolute;inset:0;width:100%;height:100%}</style>
<div id="${scene.id}-content" class="content${library ? " library" : ""}${scene.typography === "compact" ? " type-compact" : ""}"><p class="label">${String(index + 1).padStart(2, "0")} / ${h(label)}</p><h1>${h(scene.heading)}</h1><div class="component-stage">${descriptor.render(scene, episode, assets, config)}</div></div>
</div><script>(()=>{
const tl=gsap.timeline({paused:true});
${reveal(`#${scene.id}-content`, 0, config, episode, entrance)}
${exit === "fade" ? `tl.to('#${scene.id}-content',{opacity:0,duration:${motionDuration(config, episode, "exitSeconds")},ease:'none'},${scene.duration - config.motion.exitSeconds});` : ""}
${scene.component === "sentence" ? `tl.fromTo('#${scene.id} .highlight',{'--highlight-scale':0},{'--highlight-scale':1,duration:${motionDuration(config, episode, "highlightSeconds")},ease:'none'},${scene.highlightAt});` : ""}
${scene.component === "quiz" && !scene.visual ? `tl.fromTo('#${scene.id}-answer',{opacity:0},{opacity:1,duration:${motionDuration(config, episode)},ease:'none'},${scene.answerAt});` : ""}
${descriptor.animate && library ? descriptor.animate(scene, config, episode) : ""}
${scene.component === "title" ? `tl.fromTo('#${scene.id} .title-rule',{scaleX:0},{scaleX:1,duration:${motionDuration(config, episode, "highlightSeconds")},ease:'none'},${config.motion.enterSeconds});` : ""}
window.__timelines['${scene.id}']=tl;
})();</script></template>\n`;
}
