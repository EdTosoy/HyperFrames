# Unit 1 · Part 1 — am / is / are

Episode ID: `u001-p01-am-is-are`. Real lesson draft for local visual evaluation;
not approved for release. Original teaching material based on the requested topic,
not copied textbook content. Only Part 1 exists.

The expanded 150-second silent preview uses estimated narration timing. It follows
the six-scene script supplied in the conversation, with shorter visual scenes
inside each chapter. The full script takes priority over the original 60–75-second
target; narration must not be rushed to fit that earlier cut. `episode.json` owns
content, scenes and provisional captions. `SCRIPT.md` is a recording copy of its
editable `script` field; synchronize both after script feedback. No transcript is
approved and no audio, music or generated voice is present. Draft watermark and
all production-readiness checks remain active.

## Visual plan

| Time    | Script chapter                | Shared visuals                                                         |
| ------- | ----------------------------- | ---------------------------------------------------------------------- |
| 0–16    | 1 · Hook                      | Title, successive sentence forms, comparison                           |
| 16–53   | 2 · Understanding the meaning | Three forms of be, feeling/identity/location, present meanings         |
| 53–90   | 3 · Why does the verb change? | Subject definition, subject/verb matching, positive examples           |
| 90–111  | 4 · Short forms               | Contractions, three transformations, unchanged meaning                 |
| 111–137 | 5 · Practice                  | Quiz, three-second thinking pause, plural explanation and substitution |
| 137–150 | 6 · Recap                     | Sequential rule groups and short branded ending                        |

There are 24 generated visual scenes, using the existing component library. The
quiz thinking interval is exactly **117.5–120.5 seconds**. No narration captions
appear during that interval. The answer begins its reveal at 120.5 seconds and
settles by 121. Do not shorten this interval after recording.

The earlier 74-second MP4, source specification and verification are preserved in
`renders/u001-p01-am-is-are/versions/v01-74s/`. No previous export was deleted.
The previously uploaded Drive copy still contains that earlier version.

Text-only explanations remain deliberate: subject grouping and substitution carry
the meaning without decorative imagery or a mascot. `durationReason` explains the
longer educational draft; final timing will follow the owner's actual recording.

The grammar scope is positive present statements with be. `She's` means `she is`
in these examples; other uses are outside this episode. Accuracy cross-check:
[British Council: present simple be](https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2/present-simple-be).
No examples or exercise sets were taken from that reference.

## Preview and iterate

```bash
export HYPERFRAMES_BROWSER_PATH="$(command -v chromium)"
npm run validate
npm run check -- u001-p01-am-is-are
npm run preview -- u001-p01-am-is-are
# Substitute the port printed by preview:
npm run check:visual -- u001-p01-am-is-are http://localhost:3004
npm run render:draft -- u001-p01-am-is-are
npm run preview:status -- u001-p01-am-is-are
```

Draft output: `renders/u001-p01-am-is-are/draft.mp4`. Builds and render evidence are
ignored. Change source JSON, then rebuild/re-preview and rerender; generated HTML
is disposable. A preview already open may need refreshing after the rebuild.
Stop the server after review with `npm run preview:stop -- u001-p01-am-is-are`.

## After recording

Follow [the production workflow](../../docs/PRODUCTION_WORKFLOW.md): preserve and
back up 48 kHz WAV takes, select an edited recording, register its master/edit asset
IDs, approve the actual transcript, then align scene boundaries and captions to
that recording on the 30 FPS grid. Preserve the quiz pause. Estimated cues and
`SCRIPT.md` are not evidence of spoken synchronization. Keep status draft until
human script approval; record no fabricated review evidence. Final release still
requires approved audio/captions, current review evidence and encoded-output QA.

Local verification findings are recorded in `REVIEW.md` after rendering.
