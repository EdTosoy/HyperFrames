# Unit 4 silent draft v01 — technical review

Draft, 2026-11-07. Human teaching approval and narration integration remain pending.

PASS `npm run validate`: formatting, syntax, all episode contracts and 48 tests.
PASS `npm run check:static`: preserved sample and both fixtures.
PASS `npm run check`: sample and both fixtures after the shared routed-movement change.
PASS `npm run check -- u004-p01-present-continuous-questions`: zero lint/runtime/layout/motion issues and 45/45 contrast checks.
PASS `npm run check:visual -- u004-p01-present-continuous-questions http://localhost:3003`: 351 painted safe-area/text samples, semantic reveals, motion endpoints, exact five-second thinking progress, hidden answers and repeatable backward seeks.

## Visual findings and corrections

The dense quiz about friends initially exceeded the conservative content reserve.
Shortened its explanation and quiz headings, then reran the full audit successfully.
Routed be and the subject through separate upper/lower poses during swaps so tile
text does not cross in the same lane. The action phrase remains fixed. Existing
single-segment layers retain their behavior. Unit 4 uses no new renderer or dependencies.

Inspected full-resolution preview word-transition, longer-subject, dialogue and
quiz-answer frames. Phone-scale transition, library destination and visual-exercise
answer samples remain readable. Question context sits immediately before its exercise.
Original soup marks make the contextual food answer visible. New SVG source and
provenance are retained; earlier lessons' sources are unchanged.

Coverage: standard continuous questions; all seven subject forms; whole noun-phrase
subjects; what/where/why/who/how; looking at and talking to; yes/no versus information
replies; affirmative/negative short answers and alternatives; three common mistake
corrections; ten original timed practice questions; recap and closing conversation.
Prior Unit 2 knowledge is retrieved briefly, then applied to Unit 3 ongoing actions.

Remaining: full human playback/phone and teaching review, owner recording, measured
audio, revised timing/caption alignment, and current production review evidence.
Reduced-motion routed paths have contract tests; this visual review exercises full
motion. No publication approval is claimed.

## Encoded MP4 and backup

PASS: `npm run render -- .hyperframes-build/u004-p01-present-continuous-questions --quality draft --fps 30 --workers 6 --strict --output renders/u004-p01-present-continuous-questions/u004-present-continuous-questions-silent-v01.mp4`.
The existing locked HyperFrames engine rendered the compiled episode; no alternate
renderer was introduced. Screenshot capture on hardware GPU completed in 18m20s.

PASS: repository `outputErrors` media contract and full FFmpeg decode to null.
ffprobe reports H.264/yuv420p, 1080×1920, 30/1 FPS, 22,140 frames, exactly
738 seconds and zero audio streams. File size: 17,417,831 bytes.
SHA-256: `4a6c9a3e570dece07608895c004586c973b28a456e3664af028b3d97a5e615c1`.
Fingerprint/probe/checksum, decode log and encoded frame evidence are retained
under the episode's renders directory.

Inspected encoded full-resolution frames at 5.7, 151 and 511 seconds and phone-scale
frames at 204, 440, 508 and 637 seconds. Word routes, food context, question types,
thinking cue and answer explanations remain readable; no clipping or collision was
found in these samples. Sampling does not establish complete human playback review.

Google Drive backup completed using the Google Drive skill:
[Unit 4 video](https://drive.google.com/file/d/1sVpDDRe3gx_NfVWqTHA7Vz5Pqq3VL9Qk/view).
Metadata readback verified the authorized murphy folder and matching byte size.
SSD backup remains unavailable: the storage volume is mounted read-only.
Studio remains running for owner review at
http://localhost:3003/#project/u004-p01-present-continuous-questions.
