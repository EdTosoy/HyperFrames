# Unit 1 · Part 1 — am / is / are

Episode ID: `u001-p01-am-is-are`. Real lesson draft for local visual evaluation;
not approved for release. Original teaching material based on the requested topic,
not copied textbook content. Only Part 1 exists.

The 74-second silent preview uses estimated narration timing. `episode.json` owns
content, scenes and provisional captions. `SCRIPT.md` is a recording copy of its
editable `script` field; synchronize both after script feedback. No transcript is
approved and no audio, music or generated voice is present. Draft watermark and
all production-readiness checks remain active.

## Visual plan

| Time     | Teaching beat                                        | Shared component                               |
| -------- | ---------------------------------------------------- | ---------------------------------------------- |
| 0–2.5    | Introduce the three forms; invite listening          | Title                                          |
| 2.5–10.5 | I am / She is / They are excited                     | Sentence builder; successive highlighted verbs |
| 10.5–14  | Why different verbs?                                 | Two valid structures, grammar comparison       |
| 14–22    | Present forms of be; choose for the subject          | Phrase highlighting                            |
| 22–32    | Match one subject group at a time                    | Sentence builder                               |
| 32–39    | I am → I'm                                           | Phrase replacement                             |
| 39–43    | She is → She's                                       | Phrase replacement                             |
| 43–47    | They are → They're                                   | Phrase replacement                             |
| 47–60    | Classmates quiz, choices, three-second pause, answer | Guided quiz                                    |
| 60–64    | My classmates → They; keep are                       | Sentence builder transformation                |
| 64–71.5  | Sequential subject/verb patterns                     | Sentence builder                               |
| 71.5–74  | Branded final hold, Unit 1 · Part 1/3                | Recap                                          |

The quiz thinking interval is exactly **51.8–54.8 seconds**. No narration captions
appear during that interval. The answer begins its reveal at 54.8 seconds; the
shared transition settles by 55.3. Do not shorten the thinking interval after
recording. Text-only diagrams are deliberate: subject grouping and substitution
carry the meaning without decorative imagery or a mascot.

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
