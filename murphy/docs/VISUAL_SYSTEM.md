# Visual system

`config/production.json` is authoritative for new-series rendering. The preserved
sample keeps its historical CSS. Branding, tokens, font sizes, motion, safe areas
and export settings belong in config, not individual lessons.

| Token   | Value     | Use                                |
| ------- | --------- | ---------------------------------- |
| Canvas  | `#F6F5F0` | Full-frame background              |
| Text    | `#223248` | Essential text and labels          |
| Grammar | `#168076` | Sentence emphasis and answers      |
| Focus   | `#D79A55` | Highlight underline/decorative cue |
| Error   | `#C65E5A` | Error cue accompanied by a label   |

Focus/error colors are not approved small-text colors on canvas. Essential text
uses the text color, or grammar color when rendered contrast passes at the actual
size. Do not rely on color alone to convey an answer.

Default output: 1080×1920, 9:16, 30 FPS, MP4, H.264/yuv420p with AAC narration.
Use local Manrope, large type, short lines and clear hierarchy. Defaults: 78 px
title/sentence, 56 px body, 46 px captions, 28 px labels. Split content-heavy scenes
or use a purpose-built component instead of shrinking text.

The conservative social preset reserves 220 px at top, 180 at right, 420 at bottom
and 96 at left. Captions occupy the 240 px band immediately above the bottom
reserve, with a 48 px gap before essential content. These are editorial reserves,
**not guarantees about platform UI**: verify current Reels/TikTok/Shorts overlays
on a device before release. Preview the encoded video at phone size.

Use fixed label/heading anchors, one content lane and one caption lane. Restrained
0.3-second entrances move 16 px; highlights use a 0.4-second underline. Quiz
answers have explicit `answerAt` times and reading holds. No flashing, random
timing or decorative perpetual motion.

Reuse compositions/factory components. Add one only for a concrete educational
need and test it. Motion must seek deterministically through the paused GSAP root.
Full browser checks and visual inspection follow layout/token changes.

## Phase 2 component catalog

The catalog below extends the existing factory registry. Scene `component` selects
one renderer; `visual` contains its narrow contract. Contracts live in
`schemas/visual.schema.json`, referenced by the additive v1 episode schema.
The Phase 1 `card`, `sentence`, `quiz` and `image` scene shapes remain valid.

| Component          | Required visual content                                                             | Optional controls                                                            |
| ------------------ | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `title`            | An object, possibly empty; heading is the lesson title                              | `unit`, `part` override curriculum metadata; `subtitle` may be empty         |
| `sentence-builder` | `states`: ordered `{label, at, groups}`; each group has `text`, `role`              | Group `emphasis`: `none`, `underline`, `color`, `both`                       |
| `comparison`       | `layout`, exactly two labeled `{text, verdict}` items                               | Item `emphasis` phrase and `note`; `secondAt` required for sequential layout |
| `timeline`         | `labels` (past/present/future), normalized `now`, `events`                          | Event `end` creates interval; omit it for a point                            |
| `dialogue`         | Two named speakers on opposite sides and ordered `{speakerId,text,at}` messages     | Exact emphasis phrase per message                                            |
| `quiz`             | Existing `quizId`, `answerAt`, plus `visual.thinkingLabel` for the enhanced version | `thinkingFrom`; question kind `multiple-choice` or `fill-blank`              |
| `phrase-focus`     | Ordered tokens with `text`, `emphasis`, `at`                                        | Each token may have `replacement: {text,at}`; optional note                  |
| `recap`            | Short `pattern` and 1–3 `takeaways`                                                 | `reminder`, `nextPart`; branding comes from config                           |
| Captions           | Existing episode-level `captions[]` with absolute start/end/text                    | Exact `emphasis` phrases; punctuation remains unchanged                      |

Common scene fields remain authoritative: `id`, `start`, `duration`, `heading`,
`body`, `purpose`, `ruleIds`, `highlightAt`. `body` can now be empty. Optional
`label` supplies a short learner-facing section label (maximum 32 characters);
omit it to retain the component/purpose label used by existing fixtures. Optional
`motion.entrance` is `rise`, `fade` or `none`; `motion.exit` is `fade` or `none`.
The default educational entrance is a subtle rise, followed by a short exit fade.
The final scene holds through the last frame. Legacy scenes keep their original
no-exit default. `typography: compact` is restricted to sentence-builder,
comparison and phrase-focus; it selects a central preset, never arbitrary CSS.

### Sentence construction

Group roles are subject, auxiliary, verb, object, complement, negation or phrase.
Reorder groups and change their text in successive states to demonstrate positive,
negative and question structures. No grammar examples are embedded in renderer code.

```json
{
  "states": [
    {
      "label": "First structure",
      "at": 0.4,
      "groups": [
        { "text": "The robot", "role": "subject" },
        { "text": "can", "role": "auxiliary", "emphasis": "both" },
        { "text": "carry", "role": "verb" },
        { "text": "a parcel.", "role": "object" }
      ]
    }
  ]
}
```

This is the `visual` portion of a scene, not a standalone episode. See the original
non-curriculum `episodes/fixture-component-showcase/episode.json` for complete
examples of every component. The builder reserves the maximum state footprint,
reveals groups in reading order and fades between authored structures. Phrase
replacement reserves both old/new word widths in one grid cell, so surrounding
text does not jump when the word changes.

### Comparison, time and context

Comparisons support `stacked`, `columns` and `sequential`. Sequential comparisons
require an explicit `secondAt`. Verdicts `correct`, `incorrect` and `different`
produce CORRECT, REVISE and ALSO VALID labels plus original vector symbols.
Incorrect wording uses an error underline, not the correct-example emphasis cue.
Color alone never communicates correctness. Use stacked/sequential for longer text;
columns have a stricter text budget rather than a smaller automatic font.

Time positions range from 0 to 1 along one shared axis; `now` sets the present
reference. Events have stable IDs, labels, `start`, `at`, and status `event`,
`completed` or `ongoing`. An interval's `end` must follow its start. Completed
intervals finish at/before now; ongoing intervals cross now and use an open-ended
dashed arrow. Their end denotes the shown visual extent, not a promised completion
time. Point events may occur in any region. Lane labels and event shapes share the
same axis geometry. The present line stays anchored while events reveal/draw.

Dialogue text is fully authored; speaker IDs resolve to consistent names and sides.
Each message's `at` is scene-local, aligned manually with the human recording.
Original SVG speaker/check/revision symbols are generated from tracked code in
`primitives.mjs`; no external image collection or generation service is used.

### Quiz, captions and recap

The enhanced quiz is selected by adding visual thinking-pause options to the
existing quiz scene. Multiple-choice questions retain choices/answerIndex. A
fill-blank question uses `kind: fill-blank`, a prompt containing `___`, and `answer`.
The timer is a visual reading/thinking cue, not an interactive control. Validation
requires at least one second of thinking and one second of readable answer hold.
Actual lessons should allow longer pauses when appropriate.

Captions retain the Phase 1 timing source and human-recording workflow. Text appears
only during its cue interval, on an opaque panel in the caption band. Emphasis
phrases must occur exactly and may not overlap. Newlines in text are respected;
check line length and punctuation at phone size. The shared character-speed budget
is an editorial guard, not proof of comprehension or synchronization. Never infer
caption timing from animation duration or synthesize the owner's voice.

Recaps reinforce one pattern, concise takeaways, an optional practice reminder and
next-part reference. The series title is read from branding config. No engagement
bait is required. The final takeaway remains visible through the final frame.

## Shared production conventions

Config now owns spacing (12/20/32/48/72 px), 24 px panel radius, 2 px strokes,
opaque panel/line/muted tokens, no decorative shadow, and stable layout offsets.
Body text remains 56 px; compact content is 48 px; captions 46 px; role labels 30 px.
Use the approved font and split dense scenes rather than shrinking everything.

Motion uses the existing 0.3-second entrance, 16 px rise and power2.out ease, with
0.16-second word-group stagger, 0.2-second replacement/exit, 0.4-second emphasis
and 0.6-second interval drawing. Semantic `at` values are scene-local seconds;
captions stay episode-global. All behavior is authored on one paused GSAP timeline
per composition, with static DOM and no runtime fetches, timers, randomness or
text measurement callbacks. Plain-reading holds are deliberate.

Set episode `motionMode: reduced` to remove spatial entrance travel and make
interval drawing instantaneous at its semantic cue; text still fades briefly and
appears in the original order. Reduced motion is authored data, so export is
independent of a machine's matchMedia preference. The small episode-progress
indicator continues to communicate elapsed time.

`social-conservative` remains the default safe area. `reels-review` and
`shorts-review` are editable editorial variants with different reserves, not
certified platform UI measurements. Essential content ends before the caption gap;
captions end before the platform-overlay reserve. Branding, progress, heading,
component stage and caption band have independent fixed anchors. Preview the
intended platform on a phone before release.

## Visual verification and extension

Run schema/unit/static checks, then full `npm run check`. It now checks all fixture
compositions by default; supply an ID to inspect one selected episode plus the
preserved sample. CI performs static fixture checks without private media.

For painted bounds, semantic visibility and backward-seek verification:

```bash
npm run preview -- fixture-component-showcase
# Use the port printed by preview, for example:
npm run check:visual -- fixture-component-showcase http://localhost:3003
```

Set `HYPERFRAMES_BROWSER_PATH` to an installed Chrome/Chromium executable for this
audit on every platform. The local audit uses HyperFrames' installed browser dependency and compiled Studio
preview; it is a verification tool, not a second renderer. It writes ignored
`renders/<id>/visual-audit.json`. It checks content/captions against their actual
reserved regions, checks text boxes, verifies sentence states/dialogue/quiz/word
replacement, and compares painted geometry after backward seeking. This tool is
version-sensitive to the locked preview runtime and is not required in normal CI.

On long cuts, HyperFrames 0.8.184 caps its motion sweep at 300 observations.
`build.mjs` aligns generated long-cut motion deadlines to that observable grid;
it does not retime animation. `check:visual` additionally samples the original
entrance and quiz-answer deadlines exactly, preserving the authored timing check.
Run it for long-cut release review. Recheck this compatibility code on a CLI upgrade.

Render with `render:draft`, inspect decoded frames at every component, transition,
longest text, before/after an answer and the final frame. Review 360×640 copies of
those frames for mobile reading; inspect full-size detail too. Automated bounds
checks cannot prove educational clarity, natural pacing or caption accuracy.

To extend: use an existing component first; add one concrete schema definition,
registry descriptor and render/animate implementation only for a new teaching need.
Keep token/style/motion helpers shared. Add failure-case tests and a fixture proof,
then repeat the visual loop. Generated HTML is disposable; edit source data/code.
