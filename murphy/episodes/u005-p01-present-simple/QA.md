# Unit 5 silent visual version v01

Scope: one complete unit, 48 scenes, 768 seconds, twelve original exercises.
Narration remains disabled by owner direction. This is a review draft, not a
human-approved teaching release.

Input fingerprint:
`110585a4306e2c6e2f0d8479f64081c820f521172d25692d18415e9b29ca8ed1`

## Automated verification

- PASS: `npm run validate`, including 51 tests.
- PASS: `npm run check -- u005-p01-present-simple` outside the browser sandbox;
  preserved sample and episode runtime, layout, motion and contrast checks pass.
- PASS: `npm run check:visual -- u005-p01-present-simple http://localhost:3002`;
  436 painted safe-area/text samples, semantic reveals and repeatable backward seeks.
- PASS: local preview status verified outside the sandbox.
- PASS: `git diff --check` before export.

## Export and backups

- Completed `u005-present-simple-silent-v01.mp4`, delivery quality, 24,340,540 bytes.
- PASS: ffprobe plus executed assertions: H.264/yuv420p, 1080×1920, 30 FPS,
  768 seconds, 23,040 frames, exactly one video stream and zero audio streams.
- PASS: full FFmpeg decode to null, with no decoding errors.
- Inspected a decoded midpoint contact sheet covering all 48 scenes and full-size
  decoded opening (3s), quiz answer (551s), and final hold (767.9s) frames.
  Samples show mounted artwork, readable text and the ending held on screen.
  This sampled inspection does not replace uninterrupted human playback review.
- Local media report: `renders/u005-p01-present-simple/silent-v01.probe.json`.
- SSD: `/mnt/storage/hyperframes/murphy/u005-present-simple-silent-v01.mp4`;
  exclusive new-file copy, flushed and read back with matching SHA-256.
- [Google Drive copy](https://drive.google.com/file/d/1FphDt3YPxZMwu2bjYSmiaaUaIGA2wZEV/view?usp=drivesdk):
  upload completed; independent metadata readback confirms ID, filename, video/mp4,
  24,340,540-byte size and parent folder `1SbqYvGc6-uhdbMZDFTCO5vee0kukU0S7`.
  Drive checksum was not returned by the connector.
- SHA-256: `3b967cc5489779cfb947590150a728848c548d02531e82b3b7e2cc2799247349`.
- Toolchain: HyperFrames 0.8.184, Chrome 153.0.8010.52; screenshot capture,
  hardware GPU, eight workers; render elapsed 16m 20.8s.

No existing exports were replaced. Initial sandbox mount inspection showed the
SSD read-only; outside-sandbox inspection confirmed the actual mount was writable
and the backup succeeded. HyperFrames usage lookup returned unknown
(`usage_request_failed`); no allowance estimate was inferred.

## Human review

Teaching approval and uninterrupted final playback/phone acceptance remain
pending. Planned narration is not treated as approved silent visual teaching in
the learning progression record. No generated speech, music or publishing.
