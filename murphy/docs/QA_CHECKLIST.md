# Release acceptance checklist

Record reviewer, date, fingerprint and final export review in episode notes.
An automated pass is necessary but does not prove teaching quality.

- Original explanations, examples, illustrations and practice; no textbook content.
  Correct objective, level, unit/part metadata; narrow accurate rule scope.
- Natural English, answer keys verified, thinking time and explanatory answer reveal.
- Six teaching phases in order, sensible duration (or exception), no TODOs.
  Scene intervals contiguous; timeline matches the selected narration edit.
- Owner's narration present, transcript approved, master backed up, selected edit
  clean. No clipped words, noise jumps or edit clicks.
- Input 48 kHz mono PCM WAV, -16 ±1 LUFS and ≤ -1 dBTP. Listen to and measure final
  AAC too. Check opening/end, synchronization and silence.
- Captions accurate, approved, non-overlapping, readable at phone size and clear
  of platform controls. Cue boundaries follow the actual spoken delivery.
- Sources resolve; licensing/attribution recorded; no private screenshot or remote
  runtime dependency. Required ignored media has tested independent backups.
- Shared tokens, anchors, safe zones, restrained motion and contrast pass. Answers
  have a cue beyond color. No overflow, occlusion or essential content behind UI.
- `npm run validate`, relevant `npm run check`, readiness and encoded media checks
  pass. Inspect every phase, transition, highlight, quiz reveal, first/last frame.
  Confirm MP4/H.264/yuv420p/AAC, 1080×1920, 30 FPS and correct duration.
- Review evidence matches current inputs. Watch/listen to the final export on a
  phone before accepting it. Record actual output acceptance separately.
- Explicit authorization before publishing; add actual URLs after manual publication.
  No infrastructure fixture or silent legacy example is a series release.

CI covers formatting, syntax, data, tests and static composition lint. Browser
layout/contrast/motion, rendering, listening and device checks are local gates.
Never report skipped browser audits as passes merely because static lint succeeded.

For library changes, also verify the component showcase and original smoke fixture.
Run check:visual against the local preview; inspect sentence state order, reserved
word-replacement widths, dialogue cues, timeline semantics, quiz before/after,
caption bands, transition seams and the final hold. Review encoded frames at
360×640 as well as full resolution. Record actual findings, including variants or
platforms that were not visually exercised.
