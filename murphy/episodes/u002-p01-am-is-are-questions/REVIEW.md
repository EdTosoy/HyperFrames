# Unit 2 — v01 review evidence

Draft, 2026-11-07. No human teaching or production approval is asserted.

- PASS `npm run validate`: formatting, syntax, all episode schemas/assets/timelines
  and 40 tests, including three new Unit 2 tests.
- PASS `npm run check:static`: preserved sample and both fixtures.
- PASS `npm run check -- u002-p01-am-is-are-questions`: preserved sample and episode;
  zero lint/runtime/layout/motion issues; 47/47 episode contrast checks.
- PASS corrected source `npm run check:visual -- u002-p01-am-is-are-questions http://localhost:3002`:
  317 painted safe-area/text samples, semantic reveals and backward seeking.
- Inspected full-resolution frames at 62, 255, 455, 650, 670 and 880 seconds,
  including moving words, dialogue, short answers, correction, quiz reveal and recap.
  Shortened the first quiz answer after it approached the right editorial reserve.
  The corrected 360×640 quiz preview is readable and within reserves.
- Encoded output verification is recorded locally after the render finishes.

Remaining: owner script/teaching approval, recording and timing/caption alignment,
full human playback review and an actual phone/platform-overlay review. Automated
sampling and resized screenshots do not establish those approvals.

Archival SSD was mounted read-only; no mount changes or fallback writes attempted.

## Encoded silent draft v01

PASS: repository `outputErrors` media contract; ffprobe reports 1080×1920,
30/1 FPS, H.264/yuv420p, 26,670 frames, exactly 889 seconds and zero audio
streams. FFmpeg full-file decode completed successfully without errors.
Inspected the encoded quiz frame at 360×640: answer and explanation fit.
Local probe, decode log, SHA-bound source fingerprint and verification JSON are
under `renders/u002-p01-am-is-are-questions/`.

Google Drive backup completed with the Google Drive skill; metadata readback
confirmed 15,913,309 bytes in the authorized murphy folder:
[video backup](https://drive.google.com/file/d/1Q78u4b-qBu8tgFbe51Gl8xqX85IgsmqQ/view).
SSD backup remains blocked by its read-only mount. No system changes attempted.

## Guided-practice timing revision — 2026-11-07

Source now uses five seconds of caption-free thinking for every practice question.
The full question and choices remain visible while a subtle bar drains; answer
and reasoning follow the pause. Prompt reading and scene durations are preserved,
and answer captions move two seconds earlier to follow the revised reveal.
The thinking cue finishes its entrance before the countdown starts.

PASS: `npm run validate` (43 tests), `npm run check:static`, and full
`npm run check` for sample/fixtures and each affected lesson. Local thinking and
answer frames were inspected under `renders/<episode-id>/guided-practice-5s-*.png`.

Earlier encoded exports and archived copies predate this timing revision. No new
video was exported or archived in this edit; human playback review of a revised
export remains pending. These checks do not establish human teaching approval.

PASS: `npm run check:visual -- u002-p01-am-is-are-questions <local-preview-origin>`:
344 painted safe-area/text samples, semantic reveals, exact thinking-bar
progress, hidden answers throughout the pause, stable prompts and repeatable
backward seeks. The component showcase also passed 52 samples.
