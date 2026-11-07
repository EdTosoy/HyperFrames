# Unit 1 — complete silent lesson

Episode: `u001-p01-am-is-are-complete`. Replacement draft **v02**, updated in place:
43 scenes, 14 minutes 50 seconds, 1080×1920, 30 FPS. Internal `p01` is schema
metadata; learners receive one continuous complete-unit video. The earlier partial
lesson, previous complete render and owner recordings are preserved.

## Editable source

- `episode.json`: authoritative narration script, scenes, semantic animation cues,
  121 provisional caption cues, ten practice questions, answer keys and provenance.
- `SCRIPT.md`: complete editable reading copy with scene times and recording notes.
  Revise both script sources together; tests check their spoken wording agrees.
- `assets/`: preserved earlier artwork plus the v02 context boards/object layers.
  `assets/lucide/` retains exact selected provider SVGs, ISC/MIT notices and a
  SHA-256 source inventory. See [asset provenance](assets/PROVENANCE.md).
- Shared renderers: `compositions/factory/`, selected by ordinary scene data.
  No separate lesson renderer or generated HTML edits are required.

## Teaching revision

The earlier complete draft covered the principal forms but left verb undefined,
repeated an identical negative-contraction explanation six times, used generic
figures without clear speaker/listener relationships, and described notebook motion
that its still illustration did not show. Its caption estimates could diverge from
visual changes; practice covered only five questions and one everyday expression.

This rewrite explains verb, be, tense/present tense, subject, statement, positive,
negative, contraction and apostrophe through original examples. It distinguishes
sentence polarity from a good/bad feeling. It shows who I/you/we/they refer to,
explains that matching depends on the subject, and preserves are for one listener.
All requested positive and negative forms, contractions and three everyday
expressions remain within one lesson. Ten guided questions exercise positive
forms, negatives, short forms and all three expressions, with five caption-free
thinking seconds followed by an answer and reasoning.

The same door leaf visibly closes before the negative appears. The same notebook
moves to the listener during an offer. Positive contractions transform in place;
negative alternatives reveal in order, with the rule explained once and retrieved
through varied examples. Narration captions and major visual changes share authored
cue times; all remain provisional until the owner's voice is recorded.

Coverage is **planned**, not approved, in
[learning progression](../../docs/LEARNING_PROGRESSION.md). Broader meanings of 's,
questions, short answers, other tenses and plural existential forms are deferred.

Accuracy references (examples independently written):
[British Council: present be](https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2/present-simple-be),
[Cambridge: contractions](https://dictionary.cambridge.org/grammar/british-grammar/contractions).
[Lucide's license](https://lucide.dev/license) permits reuse with retained notices;
the frozen release and original Feather notice are stored locally.

## Preview, render and later narration

```bash
npm run validate
npm run check:static
HYPERFRAMES_BROWSER_PATH="$(command -v chromium)" npm run check -- u001-p01-am-is-are-complete
npm run preview -- u001-p01-am-is-are-complete
npm run preview:status -- u001-p01-am-is-are-complete
# Use the actual port returned by preview:
HYPERFRAMES_BROWSER_PATH="$(command -v chromium)" npm run check:visual -- u001-p01-am-is-are-complete http://localhost:3003
```

The versioned review export is `renders/u001-p01-am-is-are-complete/u001-am-is-are-silent-v02.mp4`.
The factory's normal `render:draft` command remains available; it uses `draft.mp4`.
This task uses a versioned filename to preserve older renders. The generated
`.hyperframes-build/u001-p01-am-is-are-complete` is disposable. Translate any Studio
edits back into source JSON/components before rebuilding.

Status remains `draft`, `narration: null`, `reviewEvidence: null`. There is no audio,
AI speech or music. Later, record the owner, preserve the original plus a separate
edit, align every scene/caption cue to the selected delivery, verify the transcript
and repeat human teaching/visual/audio/export review. A silent draft does not meet
production readiness. See [workflow](../../docs/PRODUCTION_WORKFLOW.md) and current
[review evidence](REVIEW.md).
