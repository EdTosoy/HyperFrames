# Complete Unit 1 draft review — 2026-11-06

This episode is one continuous silent lesson. It is not a publication or human
production approval. Previous partial-lesson files and recordings are preserved.

## Executed checks

- PASS: `npm run validate`: formatting, source syntax, all episode/asset/timing
  contracts and 34 tests, including contextual asset/timing failure cases.
- PASS: `npm run check:static`: preserved sample and both fixtures.
- PASS: `npm run check -- u001-p01-am-is-are-complete`: preserved sample and lesson;
  zero lint/runtime/layout/motion findings, 47/47 lesson contrast samples passed.
- PASS: `npm run check`: preserved sample and both fixtures; zero findings.
- PASS: `npm run check:visual -- u001-p01-am-is-are-complete http://localhost:3003`:
  342 painted samples, original entrance/answer deadlines, ordered sentence and
  context states, caption bounds and repeatable backward seeks.
- REVIEWED: one live-preview frame for each of 39 scenes; full-size door-change,
  dense negative-contraction and quiz frames; 360×640 quiz image. No observed text
  clipping or content/caption collisions. The conservative layout is deliberately
  spacious. Original vector scenes illustrate meaning; sentence and contraction
  scenes retain typographic focus.

## Educational review and limitations

The script explains present, subject, negative, contraction, subject agreement,
singular/plural you, standard I'm not, and two equivalent negative contraction
patterns. It covers all seven pronouns, three everyday expressions and five
original practice questions with six-second thinking intervals and explanations.
The linked British Council grammar reference confirms present be and contraction
rules; no textbook wording or exercises were copied.

Timing and captions are provisional script estimates. They have not been aligned
to a human recording. Captions and grammar states can advance at different points
within a scene; the owner’s future recording must determine their final alignment.
Review identified two unexplained labels; complement and phrase were replaced
with description and words before the corrected render. Context illustrations
use restrained crossfades rather than detailed character animation. The notebook
scene conveys handover with a directional illustration, not articulated hand motion.

NOT RUN: actual phone/platform-overlay testing, beginner learning assessment,
human narration/listening review, or final production approval. No voice, music,
TTS, publishing, deployment, commit or push was used. HyperFrames remained pinned
to the repository’s installed version; no dependencies were added.

## Actual encoded delivery

- PASS: `review-silent.mp4` rendered with the installed HyperFrames CLI, draft
  quality, six workers. Capture used the slower screenshot path with hardware GPU;
  export completed successfully in 15m54.8s. No renderer upgrade was applied.
- PASS: ffprobe: H.264/yuv420p, 1080×1920, 30 FPS, 19,110 frames, exactly 637 seconds,
  zero audio streams, 14,032,763 bytes. FFmpeg decoded the entire MP4 without errors.
- REVIEWED: decoded frames from every scene, the full-resolution identity/quiz
  frames and a 360×640 contraction frame. No observed clipping or collisions.
  Provisional caption/state timing differences remain disclosed above.
- PASS: Studio status running and HTTP 200 at localhost:3003.
- PASS: SSD video copy checksum matches the local encoded MP4. Drive upload was
  read back with the expected filename, folder, MIME type and size.
- SHA-256: `032fddc2b354d2ff807580d9da330e84a40db625e9d2df1cc187445b97104d2e`.
- SSD: `/mnt/storage/hyperframes/murphy/u001-am-is-are-complete-silent-v01.mp4`.
- [Drive video](https://drive.google.com/file/d/120zJq1TG3uc6HD-BC3xG3l3aPetOw8nB/view?usp=drivesdk).

Media probe/checksum evidence is local in `review-silent.verification.json`;
preview captures and decoded review images remain in ignored renders. These are
technical and agent review results, not human educational or production approval.
