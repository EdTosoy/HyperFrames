# Production workflow

## Lifecycle

`draft → script-approved → voiceover-ready → visual-review → QA-approved → published`

Transitions are human decisions recorded in episode JSON. Validation checks state
requirements; the CLI does not publish or infer approval.

1. Create a draft with `npm run episode:new -- uNNN-pNN-topic`. Replace TODOs with
   an original objective, hook, script, rules, examples and answer keys. Keep the
   six teaching phases. IDs are stable; do not recycle published IDs.
2. Review accuracy, originality and teaching effectiveness. Mark `script-approved`
   only after a person approves the script. Keep revision notes with the episode.
3. Record the owner speaking English. Preserve immutable `take-01.wav` etc. and
   take notes. Use 48 kHz mono PCM WAV (24-bit preferred, 16-bit accepted), a quiet
   room, steady microphone distance and recording peaks around -12 to -6 dBFS.
   Avoid clipping; normalization cannot repair it.
4. Back up originals before editing. Create `edit-v01.wav` from selected takes;
   keep an edit log mapping corrections to takes. Declare master/edit as separate
   local-required audio assets. Corrections get new take/edit versions; never
   overwrite the only original.
5. Write and approve the delivered transcript at `episodes/<id>/transcript.txt`.
   No TTS, voice cloning, Whisper or transcription service is required. Automation
   could be evaluated later as an optional aid; human approval remains mandatory.
6. Declare narration with `performer: "human-owner"`, `masterAssetId`, `editAssetId`,
   `transcriptPath`, measured `durationSeconds`, `transcriptApproved` and
   `captionsApproved`. `voiceover-ready` means the recording and approved
   transcript are ready for visual alignment.
7. Align scenes to the selected audio, on 30 FPS frame boundaries. Captions use
   absolute seconds and unique IDs. Adjust cues manually while listening; check
   phrase boundaries, punctuation, reading speed, corrections and pauses. Episode
   JSON is the sole caption timing source; exported subtitle files are derived.
8. Build/preview and mark `visual-review`. Adapt scene length to the recording.
   If duration changes, update measured duration, affected scene/caption times
   and the total, then re-review. Do not speed up the speaker to force a template.
9. Normalize a **copy** to -16 ±1 integrated LUFS, true peak ≤ -1 dBTP, 48 kHz mono
   WAV. Use an editor's loudness tool or FFmpeg two-pass loudnorm; measure the
   finished copy independently. Listen for pumping, noise and clipped edits.
   Readiness measures LUFS/true peak with FFmpeg without modifying recordings.
10. Run `npm run validate`, `npm run check -- <id>` and `npm run render:draft -- <id>`.
    Watch/listen through every scene transition, caption, quiz hold/reveal, opening
    and last frame. Resolve the QA checklist.

## Final review and export

Run `npm run ready -- <id> --fingerprint` after all source changes. A person records
`reviewEvidence` with that fingerprint, reviewer name, ISO `reviewedAt` date, and
`checks` booleans `originality`, `grammar`, `visual`, `audio`, `captions`. Mark
`QA-approved`. Missing media, stale reviews, bad timing and fixtures still block release.

```bash
npm run ready -- <id>
npm run render:production -- <id>
```

Final export runs readiness, audio measurements, HyperFrames check, delivery MP4
render and ffprobe. Output is `renders/<id>/production.mp4` plus local verification
JSON bound to the input fingerprint. It requires 1080×1920, 30 FPS, H.264/yuv420p,
48 kHz AAC and duration matching the timeline.

Watch/listen to the final encoded MP4 on a phone, measure final AAC loudness/peak,
check overlays and record acceptance in tracked QA notes. AAC can alter peaks:
input measurement does not certify the final mix. Output review is manual in
Phase 1. Only after authorized manual publication record platform, HTTPS URL and
ISO publishedAt, then mark `published`. No tooling uploads content. Fingerprints
do not replace educational or rights review.

Missing narration is allowed in a draft (`narration: null`) with a clear watermark.
A declared missing asset fails even a draft build. Final video has no silent
fallback. The fixture is always silent and excluded from release. Keep raw and
trimmed audio separate: master duration may exceed the edit; edit duration must
match the video. Backups and file naming are described in recordings/README.md.

## Commands

| Purpose                             | Command                                                              |
| ----------------------------------- | -------------------------------------------------------------------- |
| Install locked dependencies         | `npm ci`                                                             |
| Format foundation sources           | `npm run format` / `npm run format:check`                            |
| Node syntax                         | `npm run lint`                                                       |
| All episode contracts               | `npm run validate:episodes`                                          |
| Format, syntax, data, tests         | `npm run validate`                                                   |
| Contract tests                      | `npm test`                                                           |
| Static CLI lint, sample and fixture | `npm run check:static`                                               |
| Full browser checks                 | `npm run check -- <id>`                                              |
| Build HTML                          | `npm run episode:build -- <id>`                                      |
| Persistent preview                  | `npm run preview -- <id>`                                            |
| Query / stop preview                | `npm run preview:status -- <id>` / `npm run preview:stop -- <id>`    |
| Draft / final export                | `npm run render:draft -- <id>` / `npm run render:production -- <id>` |
| Readiness / fingerprint             | `npm run ready -- <id>` / `npm run ready -- <id> --fingerprint`      |

Most commands default to the fixture; readiness/final export require explicit IDs.
`npm run dev` and `npm run render -- <CLI flags>` are direct tools for the preserved
sample, with no production-readiness claim. Upgrade pins intentionally with checks.

CI runs `npm run validate:ci`: it checks declarations and requires tracked source
assets/transcripts, without requiring ignored `local-required` media bytes. Local
`validate:episodes` checks every declared dependency. Builds and release checks
always require the selected episode's actual media. Portable CI does not establish
production readiness. Restore archived media before an all-episode local check.
