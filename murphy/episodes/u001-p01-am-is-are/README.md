# Unit 1 · Part 1 — am / is / are

Episode ID: `u001-p01-am-is-are`. Real lesson draft for local visual evaluation;
not approved for release. Original teaching material based on the requested topic,
not copied textbook content. Only Part 1 exists.

The current **126.3-second narration draft** uses the supplied `2.mp3`,
stored as `recordings/u001-p01-am-is-are/take-02-original.mp3`.
The original file remains unchanged; a separate 48 kHz WAV edit provides normalized
audio, a three-second inserted quiz hold and a short final hold. No AI voice or
music was added. See [the recording log](../../recordings/u001-p01-am-is-are/README.md).

`episode.json` owns scenes, narration references and captions. `SCRIPT.md` is the
recording-script copy. `transcript.txt` is a **candidate**, based on the known
script; it has not been checked against the spoken words. Timing uses detected
speech pauses and script-duration estimates rather than a speech recognizer.
Transcript/caption approval remains false, status remains draft, and release gates
are intact. Watch and listen through the draft to confirm the alignment.

## Visual plan

| Time          | Script chapter            | Shared visuals                                             |
| ------------- | ------------------------- | ---------------------------------------------------------- |
| 0–13.10       | Hook                      | Title, highlighted statements and comparison               |
| 13.10–44.13   | Understanding the meaning | Forms of be, feelings/identity/location, present meanings  |
| 44.13–72.77   | Why does the verb change? | Subject definition, subject groups and positive statements |
| 72.77–89.60   | Short forms               | Three contractions and meaning comparison                  |
| 89.60–112.67  | Practice                  | Quiz, thinking hold, plural explanation and substitution   |
| 112.67–126.30 | Recap                     | Sequential subject/verb patterns and branded ending        |

The thinking timer covers exactly **97.0–100.0 seconds**; no narration captions
appear in that interval. An extra three seconds of silence was inserted at source
97.0 seconds in the working audio. That editorial boundary was inferred from the
script and quiet gaps and must be confirmed by listening.

The earlier exports, episode sources and evidence are preserved in
`renders/u001-p01-am-is-are/versions/v01-74s/` and `versions/v02-150s/`.
Previously uploaded Drive copies remain those silent versions.

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

## Review the narration draft

Listen to the actual encoded MP4, checking spoken wording, scene boundaries,
caption cues and the quiz pause. Correct `transcript.txt` to the delivered words
and align episode JSON manually where needed. Do not approve the estimates merely
because an automated check passes.

The source MP3 remains the declared original; the converted working WAV is not
presented as a lossless original recording. Final export still requires the
canonical recording-master standard, human script/transcript/caption approval,
current review evidence and final encoded-audio QA. Follow
[the production workflow](../../docs/PRODUCTION_WORKFLOW.md).

Local measured results and review limits are recorded in `REVIEW.md`.
