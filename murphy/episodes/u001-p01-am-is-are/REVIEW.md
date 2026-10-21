# Expanded-script silent draft — 2026-10-22

Episode: `u001-p01-am-is-are`. This revision uses the six-chapter script supplied
in the conversation, including the meaning of be, present meanings and the subject
definition. The earlier 74-second draft and its source/review evidence are preserved
in `renders/u001-p01-am-is-are/versions/v01-74s/`.

Status remains **draft**. These are implementation observations, not human approval
or production review evidence. The longer script takes priority over the original
60–75-second target. Delivery and caption timing remain estimates until recording.

## Output

- File: `renders/u001-p01-am-is-are/draft.mp4` (ignored).
- MP4, H.264, yuv420p, 1080×1920, 9:16, 30/1 FPS.
- Duration: **150.000000 seconds**, **4,500 frames**, **6013648 bytes**.
- Audio streams: **0**, intentionally. No generated voice, music or sound effects.
- Input fingerprint: `206e33f2ab8e69764d40395e7abbc68d16fbfc94abb8339085de5ec9c5ddc870`.
- Automatic ffprobe evidence: `draft.verification.json` beside the MP4.
- Render log: `expanded-render.log`. Renderer summary: 161.6 seconds, screenshot
  capture, hardware GPU. Internal BeginFrame traces do not establish a faster path.

## Executed checks

| Status  | Check                                  | Result                                                                                                                      |
| ------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| PASS    | `npm run validate`                     | Formatting, syntax, schema/reference/timeline contracts and 33 test groups                                                  |
| PASS    | Full preserved/fixture regression      | Zero lint/runtime/layout/motion findings; contrast 52/52, 52/52 and 35/35                                                   |
| PASS    | Revised lesson HyperFrames check       | Nine layout samples, zero lint/runtime/layout/motion findings; contrast 54/54                                               |
| PASS    | Draft render gate and ffprobe          | All checks passed; encoded vertical format and duration match source                                                        |
| PASS    | `check:visual`                         | 155 painted-bounds samples, semantic reveals, exact authored deadlines and repeatable backward seeks                        |
| PASS    | Script consistency                     | All spoken words covered in order by provisional captions and recording copy; stage directions excluded                     |
| PASS    | Quiz timing                            | Exactly 117.5–120.5 seconds of thinking; answer hidden and no narration captions during that interval                       |
| PASS    | Release negative check                 | Missing narration, approvals and human review evidence still reject final release                                           |
| PASS    | Encoded visual review                  | 49 decoded full-size frames/contact sheets, including sequential comparison, replacements, quiz before/after and last frame |
| PASS    | Phone-scale review                     | 360×640 present-meaning, contraction, quiz, subject-substitution and ending frames inspected                                |
| PASS    | Source signatures                      | Browser evidence and rendered MP4 verification match final source fingerprint                                               |
| PASS    | Studio preview                         | Persistent server on port 3004; status verified and HTTP 200                                                                |
| PASS    | Preservation                           | Shared design/renderers/schemas, fixtures, assets and dependency lock unchanged                                             |
| NOT RUN | Audible human narration / AAC QA       | No owner recording supplied; actual synchronization, delivery and loudness remain unverified                                |
| NOT RUN | Physical phone/platform overlay review | Desktop phone-size inspection does not verify changing platform UI                                                          |
| NOT RUN | Remote CI or external upload           | No push, publication or updated Drive upload in this revision                                                               |

## Long-cut verification repair

The first full check failed 11 appearsBy assertions despite correct visible frames.
Installed HyperFrames 0.8.184 source confirmed its motion sweep is capped at 300
points; 150 seconds therefore gives observations about 0.502 seconds apart, missing
some original 0.333-second entrance deadlines. This was an observation-grid mismatch,
not permission to ignore motion failures.

`sampledMotionDeadline` aligns generated long-cut sidecar deadlines to the next
observable sample. Short-cut deadlines remain unchanged. The browser audit now
also tests every entrance and quiz answer at its original, unsnapped deadline.
The repaired full check and all 155 exact/semantic/bounds samples pass. Animation
and scene times were not retimed by the repair, and release gates were not changed.
Revisit this compatibility code when upgrading the locked CLI.

Failure evidence: `expanded-check-before-fix.log` beside the output. Regression tests
cover short-cut compatibility and the 150-second sampling grid. No dependency or
installed package source was patched.

## Visual observations and limits

The added explanations use brief successive visual scenes rather than paragraphs.
Examples distinguish a current feeling from a generally true identity, identify
She as a subject, then match subject groups to be forms and positive statements.
Contractions keep their meaning; the plural practice changes My classmates to They
while retaining are. The recap and Unit 1 · Part 1/3 branding hold to the last frame.

Reviewed frames show readable mobile type, separate caption/content regions, clear
apostrophes, consistent anchors, and no observed clipping or content collisions.
Long subject groups wrap deliberately within the safe region. Scene and replacement
fades include brief low-opacity transition frames; no missing scene mounts were
observed. This is visual evidence, not proof of natural spoken pacing.

Evidence: `decoded-expanded-v02/` (full-resolution PNGs, timestamp map and contact
sheets), `mobile-expanded-v02/` (360×640 copies), `visual-audit.json`, and
`expanded-render.log`. All are ignored local artifacts.

Record the owner's narration at a comfortable pace, then realign scene boundaries,
cues and the total to that audio. Preserve the three-second thinking interval.
Approve script, actual transcript and captions through the canonical workflow;
no approval, publication metadata or production-ready status was fabricated.
