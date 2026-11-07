# Unit 1 replacement v02 — technical review, 2026-11-06

One complete continuous silent lesson, updated in the existing episode. This is
agent teaching/technical review for an owner review draft, not human educational
approval, narration approval or production readiness. Status stays draft;
narration and reviewEvidence stay null. Unit 1 remains Planned teaching in the
learning progression record.

## Teaching and visual revision

- Rewrote the script around concrete meaning before form. Explained verb, be,
  subject, tense/present tense, statement, positive, negative, contraction and
  apostrophe. Defined subject before its first diagram label; replaced the
  unnecessary learner-facing label “negation” with the already explained “negative.”
- Covered feelings, identity, conditions and location; all seven subject forms,
  one or several you; positive/negative statements; all positive contractions,
  I'm not and both negative alternatives for he/she/it/you/we/they.
- Explained the two negative shortening patterns once, then retrieved them with
  varied examples. Used contextual that's, there's and here's, followed by ten
  original guided questions and a concise recap. Every question has seven seconds
  without captions/answers, then an explained answer.
- Reused sentence-builder, phrase-focus, quiz, recap and visual-context through
  the existing factory. Added only optional bounded image layers to visual-context
  for a continuous door-closing action and notebook handover. Existing v1 fixture
  data remains compatible. No new dependencies or rendering framework.
- Used seven locally frozen Lucide icons in original teaching layouts, plus
  precise original hinge/arm/group geometry. Provider source bytes and ISC/MIT
  notices are preserved with checksums; all SVGs parse. See assets/PROVENANCE.md.

| Time        | Teaching                                                      |
| ----------- | ------------------------------------------------------------- |
| 00:00–04:10 | Meaning, verb/be, subject, present tense and subject matching |
| 04:10–05:21 | Positive/negative meaning, moving door and not placement      |
| 05:21–06:58 | Contractions and all seven positive short forms               |
| 06:58–08:54 | I'm not and six equivalent negative pairs                     |
| 08:54–10:06 | That's, there's and here's in context                         |
| 10:06–14:06 | Ten original questions with thinking and explained answers    |
| 14:06–14:50 | Forms, meaning and a real-life practice recap                 |

## Executed checks on the corrected sources

- PASS: npm run validate — Prettier, Node syntax, all episode/asset/timing
  contracts and 37 tests. Script/reading copy/captions agree in spoken wording;
  quiz pauses contain no caption answer leaks. Invalid layer assets, out-of-bounds
  poses and insufficient motion holds are rejected; fixture compatibility and
  reduced-motion output are covered.
- PASS: npm run check:static — preserved sample and both fixtures.
- PASS: npm run check — preserved sample and both fixtures, with no findings.
- PASS: npm run check -- u001-p01-am-is-are-complete — sample and corrected
  lesson; zero lint warnings/errors, runtime/layout/motion findings; all 46 lesson
  contrast checks passed WCAG AA.
- PASS: npm run check:visual -- u001-p01-am-is-are-complete http://localhost:3002
  — 359 painted safe-area/text samples, state/word/quiz reveals, exact object
  motion endpoints and repeated backward seeks. Caption cues were split and a
  quiz heading shortened after this audit caught overflow missed by the general
  browser sweep. The corrected audit passed.
- REVIEWED: all 43 preview scenes, full-resolution door/notebook/quiz detail and
  360×640 phone-size frames. HyperFrames snapshots separately proved the two
  object layers survive its compilation path. No observed clipping/collisions.
- PASS: local documentation links, staged/unstaged diff whitespace, XML parsing
  of all lesson SVGs and the nine provider-source/license checksum entries.
- PASS: production readiness still rejects the lesson without human narration.
  No release safeguards were removed or approvals inferred from silent rendering.

## Encoded review export

- File: renders/u001-p01-am-is-are-complete/u001-am-is-are-silent-v02.mp4
- PASS: 1080×1920, 9:16, 30/1 FPS,
  h264/yuv420p, 890.000000 seconds (14:50),
  26700 frames, zero audio streams. No voice, music or TTS.
- PASS: FFmpeg decoded the complete encoded MP4 without errors. Encoded media
  checks and source/build/visual-audit fingerprints agree. Full probe and hashes
  are in the local u001-am-is-are-silent-v02.verification.json.
- REVIEWED: decoded frames from every scene, opening/ending, quiz thinking/reveal
  and door/notebook poses, including phone-size samples; no observed missing
  media, clipping or collisions. Evidence remains under ignored redo-v02/.
- SHA-256: faaa97675c758df21fc226f706cce9b903aae9f7badeb4e71b04460d1caf2ecc
- PASS: SSD copy /mnt/storage/hyperframes/murphy/u001-am-is-are-complete-silent-v02.mp4; SHA-256 matches the local MP4.
- PASS: [Drive archive](https://drive.google.com/file/d/1IJm5_7nu-bH0xmztlXFnUvwAXwgjtmWw/view?usp=drivesdk); read back with expected name,
  destination folder, video MIME type and byte count. Sharing settings preserved.

The earlier exports and recordings remain untouched. Essential new source assets
and provenance are staged in Git; no commit, push, publication or deployment was
performed. Existing progressive-policy edits were preserved.

## Remaining before voice-over integration and release

Owner teaching approval is pending. Timing/captions remain provisional; use the
owner's actual delivery to align the full scene timeline, semantic animations,
quiz pauses and captions. Record and preserve the original plus a separate edit,
verify the delivered transcript, then repeat audio/visual/grammar/export review.
No actual phone/platform-overlay test, beginner learning assessment, narrated
listening review or human full-export acceptance has been claimed. Other tenses,
questions/short answers and broader uses of 's and existential forms remain
deliberately deferred. Technical checks do not prove learner comprehension.

## Earlier v01 review evidence (retained)

The following record describes the preserved previous version, not this v02 export.

### Complete Unit 1 draft review — 2026-11-06

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

PASS: `npm run check:visual -- u001-p01-am-is-are-complete <local-preview-origin>`:
389 painted safe-area/text samples, semantic reveals, exact thinking-bar
progress, hidden answers throughout the pause, stable prompts and repeatable
backward seeks. The component showcase also passed 52 samples.
