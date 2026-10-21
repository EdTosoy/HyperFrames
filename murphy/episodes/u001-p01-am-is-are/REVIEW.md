# Local silent-draft review — 2026-10-22

Episode: `u001-p01-am-is-are`. Status remains **draft**. These are implementation
observations, not human approval or production review evidence.

## Output

- File: `renders/u001-p01-am-is-are/draft.mp4` (ignored).
- MP4, H.264, yuv420p, 1080×1920, 9:16, 30/1 FPS.
- Duration: **74.000000 seconds**, **2,220 frames**, **3,043,790 bytes**.
- Audio streams: **0**, intentionally. No speech, music or sound effects.
- Input fingerprint: `4d4a84d891e6b893917d289b4a494d20de255e74b0be7fa62cd78d3a6e19c4a0`.
- Automatic ffprobe evidence: `draft.verification.json` beside the MP4.
- Render: 98.5 seconds; CLI summary reports screenshot capture with hardware GPU.
  Internal traces mention BeginFrame, but no faster capture path is inferred.

## Executed verification

| Status  | Check                                    | Observation                                                                                      |
| ------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------ |
| PASS    | `npm run validate`                       | Formatting, Node syntax, episode contracts and 31 test groups                                    |
| PASS    | `npm run check`                          | Preserved composition and both fixtures: zero lint/runtime/layout/motion findings                |
| PASS    | Initial lesson browser check             | 24 authored timestamps spanning all scenes; zero findings; 49/49 contrast checks                 |
| PASS    | Final draft command's HyperFrames check  | Nine samples, zero lint/runtime/layout/motion findings; 51/51 contrast checks                    |
| PASS    | `check:visual` against final lesson data | 71 painted-bounds samples, semantic reveals and repeatable backward seeks                        |
| PASS    | Release negative check                   | `ready` exits 1 for missing human narration, approvals and current human review evidence         |
| PASS    | Encoded output contract                  | Expected dimensions, frame rate, H.264, pixel format and timeline duration                       |
| PASS    | Source/render signature                  | Export verification and browser audit match the final episode/config/schema/renderer fingerprint |
| PASS    | Studio handoff                           | Background preview status verified and local HTTP 200 on port 3004                               |
| PASS    | Encoded visual review                    | 31 extracted frames, including scene seams, contractions, quiz before/after and final frame      |
| PASS    | Mobile review                            | 360×640 decoded comparison, contraction, quiz, subject substitution and ending frames inspected  |
| NOT RUN | Human-audio QA                           | Narration has not been recorded; synchronization, delivery speed, AAC and loudness are untested  |
| NOT RUN | Physical-device/platform review          | Editorial safe zones are not a guarantee about current platform overlays                         |
| NOT RUN | Remote CI/publication                    | No commit, push, deployment or upload                                                            |

## Visual findings

The lesson uses progressive subject/verb patterns, highlighted present forms,
three full-form/contraction replacements, a three-second quiz thinking interval,
and a short branded ending. Each scene has a learner-facing label; no component
implementation names appear in the lesson. The original component-name fallback
is preserved for existing fixtures.

An initial phrase replacement left too much space between They and are. That scene
was changed to the existing sentence builder with its compact typography preset,
then inspected again before rendering. It now changes the subject while keeping
the verb are explicit. The longer first subject uses a second line for outside;
content stays within the reserved region and captions remain separate.

Reviewed encoded frames show readable mobile type, consistent brand/title anchors,
clear apostrophes, purposeful fades/underlines, no observed clipping or content/
caption collisions, and a final branded hold through the last frame. Brief low-
opacity scene seams are intentional fades, not missing scene mounts. The quiz
answer is hidden throughout **51.8–54.8 seconds**; captions are absent during that
thinking interval. The answer is readable after the transition settles.

Full-size PNGs/contact sheet and their timestamp map are in
`renders/u001-p01-am-is-are/decoded-frames/`; phone copies are in `mobile-frames/`.
The browser report is `visual-audit.json`; the render log is `render.log`.
All generated evidence remains local and ignored.

## Remaining review

The script and all caption cues are provisional. Record the owner at a comfortable
pace, then adjust timings to the selected recording. The grammar patterns were
cross-checked against the linked British Council reference in README; a person
still needs to approve teaching accuracy and delivery. This draft is not eligible
for final export or publication. Use the canonical production workflow for script,
recording, transcript/caption approval, current review evidence and final-output QA.
