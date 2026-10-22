# Take 2 narrated draft — 2026-10-22

Episode `u001-p01-am-is-are` now uses the owner's `2.mp3`. Take 1 preparation was
superseded and archived locally; both original takes are retained unchanged under
`recordings/u001-p01-am-is-are/`. The expanded
lesson script and shared components remain intact. Status is draft: transcript
and captions are unapproved, with no fabricated human QA evidence.

## Export and checks

- `renders/u001-p01-am-is-are/draft.mp4`: 126.300000 seconds, 3,789 frames,
  8,498,754 bytes; H.264/yuv420p, 1080×1920, 30 FPS; mono AAC, 48 kHz.
- PASS: `npm run validate` — formatting, syntax, schemas, assets and all 33 tests.
- PASS: selected lesson's full HyperFrames render gate — no lint/runtime/layout/
  motion errors or warnings, nine layout samples, 39/39 contrast checks.
- PASS: `check:visual` — 155 painted safe-area/text samples, semantic reveals,
  original motion deadlines and deterministic backward seeks.
- PASS: final ffprobe/output contract. Automatic probe is `draft.verification.json`.
- PASS: final encoded loudness -16.37 LUFS, -1.13 dBTP. The working WAV measures
  -16.34 LUFS, -1.47 dBTP. See `take-02-audio-verification.json`.
- PASS: three-second thinking timer at 97–100 seconds; no captions during it.
  Measured encoded audio maximum is -91 dB over its interior (97.05–99.95).
- PASS: 38 decoded full-resolution frames/contact sheets plus 360×640 quiz and
  ending review. No observed clipping, collisions or unreadable text. Frames
  include sentence states, contraction transitions, quiz pause/reveal and branding.
- PASS: Studio and its actual narration asset URL both return HTTP 200; persistent
  preview remains on port 3004. Original take 2 and stored source hashes match.
- PASS: final readiness rejects draft status, unapproved transcript/captions and
  missing named, dated human review evidence.
- NOT RUN: audible wording/delivery/caption synchronization review; no listening
  tool was available. Caption estimates use known script and detected quiet gaps,
  not a verified transcription. The pause insertion boundary also needs listening.
- NOT RUN: physical phone/platform-overlay review, remote CI, upload or publication.

Earlier silent exports and evidence remain under `versions/v01-74s/` and
`versions/v02-150s/`. New frame evidence is `decoded-take-02/` and
`mobile-take-02/`; render/audit logs have the `take-02-` prefix.

## Local audio finishing

The locked HyperFrames renderer duplicated mono narration into stereo, giving
-13.36 integrated LUFS. Its unmodified result is preserved as
`take-02-hyperframes-stereo.mp4`. Final audio was encoded directly from the
normalized working WAV as mono AAC; H.264 packets were copied unchanged (verified
by matching SHA-256 packet hashes). No video was rerendered by this audio step.
The final MP4 passes the existing media contract and measured audio targets.

Reproduce after the usual `npm run render:draft -- u001-p01-am-is-are`:

```bash
ffmpeg -y -i renders/u001-p01-am-is-are/draft.mp4 \
  -i recordings/u001-p01-am-is-are/edit-v02.wav \
  -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -ar 48000 -ac 1 -b:a 192k \
  -t 126.3 -movflags +faststart renders/u001-p01-am-is-are/draft-mono.mp4
mv renders/u001-p01-am-is-are/draft-mono.mp4 renders/u001-p01-am-is-are/draft.mp4
ffprobe -v error -show_streams -show_format renders/u001-p01-am-is-are/draft.mp4
```

Remeasure final audio after any new encode; a future plain factory render uses the
locked renderer's stereo behavior again. Its automatic probe describes that new
encode, so regenerate final finishing evidence before relying on it. Revisit the
renderer channel handling before production automation. Current final probe and
audio report describe the finished mono version.

The supplied original is MP3, not a lossless recording master. Resampling cannot
recover lost detail; the canonical final master-format gate remains unchanged.
Back up ignored originals and edits independently of Git. Human approval still
requires listening through actual words, caption boundaries, pause and final AAC.
