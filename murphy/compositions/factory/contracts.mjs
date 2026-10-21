// Schema handles shape; these checks bind content to its actual scene duration.
export function visualErrors(episode, config) {
  const errors = [];
  const error = (scene, text) => errors.push(`/scenes/${scene.id}/visual: ${text}`);
  const duration = config.motion.enterSeconds;
  const validateAt = (scene, at, label, tail = duration) => {
    if (at < duration || at + tail > scene.duration - config.motion.exitSeconds)
      error(scene, `${label} must leave entrance and final hold inside the scene`);
  };
  const exactPhrase = (scene, text, phrase) => {
    if (phrase && !text.includes(phrase))
      error(scene, `emphasis "${phrase}" is not present in its text`);
  };
  for (const scene of episode.scenes) {
    if (
      scene.typography === "compact" &&
      !["sentence-builder", "comparison", "phrase-focus"].includes(scene.component)
    )
      error(
        scene,
        "compact typography is supported for sentence-builder, comparison and phrase-focus",
      );
    const v = scene.visual;
    if (!v) continue;
    if (scene.duration < 2)
      error(scene, "educational components need at least two seconds");
    if (scene.component === "sentence-builder") {
      let lastEnd = 0;
      v.states.forEach((state, i) => {
        const end =
          state.at +
          (i ? config.motion.replaceSeconds : 0) +
          (state.groups.length - 1) * config.motion.staggerSeconds +
          duration +
          config.motion.highlightSeconds;
        validateAt(scene, state.at, "state.at", end - state.at);
        if (state.at < lastEnd)
          error(
            scene,
            "sentence states overlap before their reveals and highlights finish",
          );
        if (state.groups.map((g) => g.text).join(" ").length > 110)
          error(scene, "sentence state is too dense; split it into shorter scenes");
        lastEnd = end;
      });
    }
    if (scene.component === "comparison") {
      if (v.layout === "sequential") {
        if (v.secondAt === undefined)
          error(scene, "sequential comparison requires secondAt");
        else validateAt(scene, v.secondAt, "secondAt", 1);
      }
      for (const item of v.items) {
        exactPhrase(scene, item.text, item.emphasis);
        if (
          v.layout === "columns" &&
          (item.text.length > 56 || (item.note?.length || 0) > 48)
        )
          error(
            scene,
            "column comparison is too dense; use stacked/sequential or shorter text",
          );
      }
    }
    if (scene.component === "timeline") {
      const ids = new Set();
      for (const event of v.events) {
        if (ids.has(event.id)) error(scene, `duplicate event ID ${event.id}`);
        ids.add(event.id);
        validateAt(scene, event.at, "event.at", config.motion.drawSeconds);
        if (event.end !== undefined && event.end <= event.start)
          error(scene, "interval end must be after start");
        if (event.status !== "event" && event.end === undefined)
          error(scene, "completed/ongoing actions require an interval end");
        if (event.status === "completed" && event.end > v.now)
          error(scene, "completed interval must finish at or before present");
        if (event.status === "ongoing" && !(event.start <= v.now && event.end >= v.now))
          error(scene, "ongoing interval must cross present");
      }
    }
    if (scene.component === "dialogue") {
      if (new Set(v.speakers.map((s) => s.id)).size !== v.speakers.length)
        error(scene, "speaker IDs must be unique");
      if (v.speakers[0].side === v.speakers[1].side)
        error(scene, "speakers must use opposite sides");
      let last = -1;
      for (const message of v.messages) {
        if (!v.speakers.some((s) => s.id === message.speakerId))
          error(scene, `unresolved speaker ${message.speakerId}`);
        validateAt(scene, message.at, "message.at");
        if (message.at < last + duration)
          error(scene, "message reveals must be ordered and separated");
        last = message.at;
        exactPhrase(scene, message.text, message.emphasis);
      }
      if (
        v.messages.map((m) => m.text).join("").length >
        (v.messages.length === 3 ? 96 : 140)
      )
        error(scene, "dialogue is too dense; split the exchange");
    }
    if (scene.component === "phrase-focus") {
      if (v.tokens.map((t) => t.replacement?.text || t.text).join(" ").length > 100)
        error(scene, "focus sentence is too dense; use shorter phrases");
      for (const token of v.tokens) {
        validateAt(scene, token.at, "emphasis.at", config.motion.highlightSeconds);
        if (token.replacement) {
          validateAt(
            scene,
            token.replacement.at,
            "replacement.at",
            config.motion.replaceSeconds + duration,
          );
          if (token.replacement.at < token.at + config.motion.highlightSeconds)
            error(scene, "replacement must follow the original highlight");
        }
      }
    }
    if (scene.component === "quiz") {
      const from = v.thinkingFrom ?? duration;
      if (
        from < duration ||
        scene.answerAt - from < 1 ||
        scene.answerAt + config.motion.replaceSeconds + duration + 1 > scene.duration
      )
        error(
          scene,
          "quiz needs a visible one-second thinking pause and one-second answer hold",
        );
    }
    if (
      scene.component === "recap" &&
      (v.pattern.length > 72 || v.takeaways.join("").length > 120)
    )
      error(scene, "recap is too dense; use one short pattern and concise takeaways");
    const strings = JSON.stringify(v).match(/[A-Za-z]{30,}/g);
    if (strings?.length)
      error(
        scene,
        "unbroken words over 29 letters need a shorter label or a separate explanation",
      );
  }
  for (const cue of episode.captions) {
    if (cue.text.length / (cue.end - cue.start) > config.layout.captionMaxCharsPerSecond)
      errors.push(
        `/captions/${cue.id}: reading speed exceeds the shared character budget; shorten or extend the cue`,
      );
    let end = -1;
    const ranges = (cue.emphasis || [])
      .map((phrase) => ({ phrase, start: cue.text.indexOf(phrase) }))
      .sort((a, b) => a.start - b.start);
    for (const range of ranges) {
      if (range.start < 0 || range.start < end)
        errors.push(`/captions/${cue.id}/emphasis: phrases must occur without overlap`);
      end = range.start + range.phrase.length;
    }
  }
  return errors;
}
