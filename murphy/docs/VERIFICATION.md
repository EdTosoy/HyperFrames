# Phase 1 implementation and verification — 2026-10-22

Phase 1 implements production infrastructure only. No textbook unit or curriculum
episode was created. The only episode data is the clearly labeled smoke fixture.

## Initial state and migration

The initial working tree was clean, with 76 tracked project files. The actual Git
root is the parent `hyperframes/`; no repository was initialized. See
[INITIAL_AUDIT.md](INITIAL_AUDIT.md) for the pre-change inventory and findings.

No existing creative files, assets or renders were moved or deleted. Existing
HTML/CSS, registry lock, motion assertions, brief, storyboard and metadata remain
unchanged. Existing tracked generated state is preserved; incidental cache changes
from verification are restored to the initial contents before handoff.

## Files and boundaries

Added:

- `config/production.json`: central design, branding, format, safe areas, audio,
  typography and motion standards.
- `schemas/{episode,asset}.schema.json`: strict versioned contracts.
- `episodes/fixture-pipeline-smoke/{episode.json,README.md}`: non-curriculum sample.
- `compositions/factory/{components,layout}.mjs`: shared card, sentence, quiz,
  image and frame rendering; generated scenes are HyperFrames sub-compositions.
- `scripts/{project,build,media,factory}.mjs`: validation, asset resolution,
  deterministic compilation, preview, measured readiness and export automation.
- `assets/manifest.json`: provenance for the retained runtime and font.
- `tests/production.test.mjs`: schema and production-contract tests.
- `recordings/README.md`, `references-private/README.md`: storage boundaries.
- `.gitignore`, `.gitattributes`, `.editorconfig`, `.nvmrc`, Prettier settings,
  package-lock.json, production documentation and ADR 001.
- `../.github/workflows/grammar-video-factory.yml`: workflow at the actual Git
  root, with `murphy` as working directory.

Modified: package.json, README.md, AGENTS.md and CLAUDE.md. There are no file moves,
index removals, commits, pushes, deployments or external publication. The manual
legacy publish shortcut is retained but was not executed.

The final directory map and decisions are in [ARCHITECTURE.md](ARCHITECTURE.md).
JSON-to-HTML compilation uses the existing HyperFrames rendering system, avoiding
a framework/database or duplicated episode implementations. Ajv supplies schema
diagnostics; Prettier supplies consistent source formatting; Node supplies tests.

## Executed checks

| Status  | Command or observation                                            | Result                                                                                                                               |
| ------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| PASS    | `npm ci`                                                          | Clean lockfile installation; 79 packages installed                                                                                   |
| PASS    | npm installation audit                                            | Zero vulnerabilities after selecting patched Ajv 8.20.0                                                                              |
| PASS    | `npm run validate`                                                | Formatting, Node syntax, all episode contracts and tests                                                                             |
| PASS    | `npm run validate:ci`                                             | Portable source validation and tests without private media                                                                           |
| PASS    | `npm test`                                                        | 14 contract test groups; zero failures/skips                                                                                         |
| PASS    | `npm run check:static`                                            | Existing sample and fixture: zero lint errors/warnings                                                                               |
| PASS    | `HYPERFRAMES_BROWSER_PATH="$(command -v chromium)" npm run check` | Existing sample and fixture browser checks passed on HyperFrames 0.8.184                                                             |
| PASS    | Final fixture check inside `render:draft`                         | Zero lint/runtime/layout/motion findings, nine sampled frames; 35/35 contrast checks                                                 |
| PASS    | Existing sample full browser audit                                | Zero findings, nine sampled frames; original motion assertions; 52/52 contrast checks                                                |
| PASS    | `npm run preview`, `npm run preview:status`, local HTTP request   | Supported persistent Studio server running; HTTP 200                                                                                 |
| PASS    | `npm run ready -- fixture-pipeline-smoke` negative test           | Exit 1, explicitly rejects fixture, missing human narration, incomplete phases and review                                            |
| PASS    | `npm run render:draft` with selected system browser               | Local draft render and automatic ffprobe contract passed                                                                             |
| PASS    | Frame inspection                                                  | Preview frames and decoded MP4 frames checked for anchors, highlight, caption, hidden/revealed answer and final hold                 |
| PASS    | `git check-ignore -v`                                             | Private references, raw recordings, local-required assets and new builds/renders excluded; source/manifests/notices remain trackable |
| PASS    | Scoped `git diff --exit-code`                                     | Existing creative sources, configuration, assets and renders unchanged                                                               |
| PASS    | `git diff --check` and workflow Prettier parse                    | No whitespace issues; workflow YAML parses                                                                                           |
| NOT RUN | Remote GitHub Actions execution                                   | Workflow created locally; nothing pushed                                                                                             |
| NOT RUN | Successful human-narrated production export                       | No human recording supplied; deliberately blocked                                                                                    |
| SKIPPED | TypeScript type checking                                          | Plain JavaScript source; Node syntax and contract tests apply                                                                        |

Tests cover unsupported/missing schema fields, unknown keys, duplicate episode and
scene IDs, unresolved components/rules/examples/assets, bad answer keys, scene
gaps/overlaps/frame alignment, caption ranges/overlaps, source licensing, private
path traversal, required files, vertical configuration, generated HTML contracts,
encoded output errors, stale reviews, changed narration duration, missing narration
and CI handling of declared private-media dependencies.

The first sandboxed browser attempt failed before a browser session ran. It was
not counted as a pass; system Chromium outside the sandbox completed the audits.
Early nested-scene lint warnings were resolved by generating sub-compositions.
Visual review found drifting title anchors; the final layout uses fixed anchors.

## Render evidence

Local artifact: `renders/fixture-pipeline-smoke/draft.mp4`.
Automatic probe: `renders/fixture-pipeline-smoke/draft.verification.json`.
Render log: `renders/fixture-pipeline-smoke/last-render.log`.
Decoded evidence: `renders/fixture-pipeline-smoke/decoded-frames/`.

ffprobe: MP4, H.264, yuv420p, 1080×1920, 30/1 FPS, 180 frames, 6.000000 seconds,
337,548 bytes. No audio stream, as intended for this fixture. Final render took
13.9 seconds; CLI summary reports screenshot capture and hardware GPU. Internal
traces also mention BeginFrame; the summary is reported without inferring a faster
capture path. All new render evidence is ignored, not staged.

## Limitations and next phase

- Actual voice quality, transcript accuracy, speech synchronization, final AAC
  loudness/peak and phone-platform overlays require the owner's recording and
  human review. Installed renderer source confirms 48 kHz audio processing and AAC
  MP4 output; the silent smoke render does not exercise an audible AAC track.
- Portable CI validates private dependencies' declarations, not their missing
  bytes or signatures. Builds and release checks require actual local media.
- Generated Studio edits must be reflected back in episode JSON or shared source.
  Pixel/bit-level reproducibility across browser/FFmpeg versions is not promised.
- The online HyperFrames documentation index was unavailable through the web tool.
  Installed 0.8.184 help/source and executed behavior were used for CLI contracts.
- Node 24 is the project runtime, pinned by .nvmrc. Its supported
  [test-isolation option](https://r2.nodejs.org/docs/v24.0.2/api/cli.html#--test-isolationmode)
  runs the small test suite in one process with explicit individual results.
- Already-tracked caches/renders remain tracked. Their later removal from the
  index requires a reviewed migration; ignored raw media needs separate backups.

Phase 2 should begin with one original, reviewed script and an owner-recorded
voice-over for an explicitly selected unit/part. Align the timeline and captions
to that recording, add only concept-specific visuals needed for the objective,
then exercise the real narration and final export gates. No curriculum production
or automatic publishing was started during Phase 1.

# Phase 2 implementation and verification — 2026-10-22

Phase 2 extends the existing data-driven factory with a visual library. It does
not create a curriculum lesson. The initial Phase 2 tree already contained the
uncommitted Phase 1 foundation: four modified tracked source/doc files and the
new foundation files. Those changes, the parent Git repository, original creative
sources, assets and renders were preserved. No dependencies or lockfile changed.

## Implementation

Added `educational.mjs`, `primitives.mjs`, `motion.mjs`, `styles.mjs` and
`contracts.mjs` under `compositions/factory/`, plus `schemas/visual.schema.json`,
`tests/visual-library.test.mjs`, `scripts/visual-audit.mjs` and the clearly labeled
`episodes/fixture-component-showcase/episode.json`.

The existing component registry, frame layout, episode schema, project/build
validation and factory commands were extended. Central config owns the additional
spacing, surface, motion and safe-area conventions. Episode schema version 1
remains backward compatible with the unchanged Phase 1 smoke fixture. Legacy
composition HTML and creative assets remain untouched. Documentation changes are
in README, ARCHITECTURE, VISUAL_SYSTEM, QA_CHECKLIST, this report and one concise
AGENTS instruction; CLAUDE's canonical pointer remains unchanged from Phase 1.

The catalog covers title, sentence construction/transformation, comparison,
timeline, dialogue, guided quiz, phrase emphasis/replacement, synchronized captions
and recap. Usage and extension contracts are in [VISUAL_SYSTEM.md](VISUAL_SYSTEM.md).
Generated scene HTML uses the established HyperFrames sub-composition pipeline;
there is no second renderer or timing authority. Original inline vector symbols
are authored in code, with no downloaded asset collection.

## Executed checks

| Status  | Check                                                | Result                                                                                                            |
| ------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| PASS    | `npm run validate:ci`                                | Formatting, syntax, portable contracts and 28 test groups                                                         |
| PASS    | `npm run validate`                                   | Local contracts and all 28 test groups                                                                            |
| PASS    | `npm run check:static`                               | Preserved sample and both fixtures: zero lint errors/warnings                                                     |
| PASS    | Full `npm run check` with system Chromium            | All three compositions: zero lint/runtime/layout/motion findings; nine runtime samples each                       |
| PASS    | Contrast checks                                      | Preserved sample 52/52; showcase 52/52; smoke fixture 35/35                                                       |
| PASS    | `check:visual` against compiled Studio preview       | 40 painted safe-area/text samples, semantic reveal checks and identical backward-seek states                      |
| PASS    | Showcase draft render and automatic ffprobe contract | MP4/H.264/yuv420p, 1080×1920, 30/1 FPS, 1,200 frames, exactly 40 seconds                                          |
| PASS    | Encoded frame review                                 | All eight scene types, three sentence states, quiz thinking/answer, phrase replacement and final frame inspected  |
| PASS    | Phone-scale review                                   | 360×640 decoded frames checked for type hierarchy, density, diagram labels, captions and readable answer/recap    |
| PASS    | Persistent preview                                   | Supported background Studio server and status command; showcase at local port 3003                                |
| PASS    | Preservation and whitespace review                   | Phase 1 smoke JSON/tests, lockfile, media helpers and legacy creative sources preserved; `git diff --check` clean |
| NOT RUN | Remote GitHub Actions                                | Nothing pushed; portable CI commands ran locally                                                                  |
| NOT RUN | Human narration and final production release         | No human audio supplied; showcase is a silent draft fixture and cannot pass release gates                         |

Browser checks required the installed system Chromium outside the restricted
sandbox. Studio's bundled browser launch initially failed; the showcase server
was restarted with `HYPERFRAMES_BROWSER_PATH`. The separate existing preview was
left running. Browser audit uses the seconds-control message path accepted by the
locked 0.8.184 preview runtime; unsupported direct seek calls were not retained.

Visual review prompted larger role labels, a clearer incorrect-example underline,
endpoint padding on timeline graphics and a final recap hold. The final encoded
frames show clear fixed anchors, no observed content/caption collisions, explicit
correctness labels, an ongoing timeline interval crossing the present reference,
and stable phrase replacement spacing. Static tests alone were not treated as
visual approval.

## Local evidence and limits

- Showcase: `renders/fixture-component-showcase/draft.mp4` (2,142,831 bytes).
- Probe and build signature: `draft.verification.json` in that directory.
- Browser bounds/seek evidence: `visual-audit.json`.
- Renderer log: `render.log`; final renderer summary reports screenshot capture
  and hardware GPU, with a 55.4-second render.
- Decoded full-resolution frames/contact sheet: `decoded-frames/`.
- Phone-scale copies: `mobile-frames/`.

All evidence is local and ignored. The output intentionally has no audio stream;
AAC narration, real speech pacing and caption synchronization remain unverified.
Reduced motion, comparison columns/sequential and fill-blank quiz contracts have
unit coverage; the rendered showcase demonstrates the main default variants.
Editorial safe presets are not certified measurements of current platform UI.
Physical-device/platform review, grammar review, human-audio QA and final export
approval remain manual release requirements. Browser/font/FFmpeg differences may
change pixels; bit-identical cross-machine output is not promised.

Before actual Unit 1 work, choose the unit/part, author and approve an original
script, record the owner's narration, align scenes and approved captions to that
recording, and run the established review/export gates. No narration generation,
publication, deployment, commits or pushes occurred in Phase 2.
