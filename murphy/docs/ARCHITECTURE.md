# Architecture

One npm application, one HyperFrames rendering system. Curriculum content is data;
the factory compiles it into normal deterministic HTML, then delegates playback,
seeking, audio mixing and encoding to HyperFrames.

```text
murphy/
├── config/production.json        # branding, tokens, format, safe areas, audio, motion
├── schemas/                     # episode v1 and asset JSON Schema
├── episodes/<episode-id>/        # episode.json, script/transcript notes, review data
├── compositions/
│   ├── factory/                 # reusable Node-side layout and component renderers
│   ├── components/              # preserved registry snippets
│   └── *.html                   # preserved sample scenes
├── assets/manifest.json         # shared asset provenance; local fonts/runtime
├── assets/local/                # optional ignored, declared large dependencies
├── recordings/                  # tracked notes; ignored human audio masters/edits
├── references-private/          # isolated ignored textbook references
├── scripts/                     # validation, build, preview, readiness, export
├── tests/                       # deterministic production contracts
├── docs/                        # canonical operating policies and ADR
├── .hyperframes-build/          # ignored generated per-episode HyperFrames project
├── renders/                     # ignored new outputs; existing tracked evidence retained
└── index.html                   # preserved sample entry point
```

Directories for ignored outputs appear only when used. CI belongs at
`../.github/workflows/grammar-video-factory.yml` because the Git root is the parent.

## Data flow and ownership

1. `schemas/episode.schema.json` defines supported v1 fields; Ajv rejects missing,
   unknown and incorrectly typed fields with JSON paths. A breaking change needs a
   new supported schema version and explicit migration.
2. `scripts/project.mjs` checks cross-references, unique IDs, contiguous scenes,
   caption timing, assets, safe paths and release review. `validateAll` checks every
   episode, including folder/ID consistency. No hidden episode index to maintain.
3. `config/production.json` owns new-series output settings. Do not duplicate hex
   values or video dimensions in lessons. The preserved sample is a compatibility
   exception, not a source for new lesson styling.
4. `compositions/factory/components.mjs` registers `card`, `sentence`, `quiz`, and
   `image`, extended by the educational catalog in VISUAL_SYSTEM.md. Scene data
   selects one renderer; IDs resolve examples/rules/quizzes.
   `layout.mjs` owns shared typography, positioning and seekable motion. To add a
   visual explanation, add one component and tests.
5. `scripts/build.mjs` writes an isolated generated HyperFrames project. It copies
   declared required assets and notices, never textbook references. HTML is
   escaped; there are no runtime fetches, clocks or random values. Generated HTML
   is disposable and must not become the authoritative editing surface.
6. `scripts/factory.mjs` invokes the installed locked CLI with argument arrays.
   `media.mjs` inspects recordings/exports with FFmpeg/ffprobe. No custom encoder.

## Timing and narration contract

The ordered scenes' `start` and `duration` fields are authoritative. Scenes cover
`[0, durationSeconds)` without gaps/overlaps. A phase may span adjacent scenes.
Overlays (captions/audio) have separate tracks and may overlap scenes deliberately.
Caption times are absolute seconds, ordered and non-overlapping. Animations use
scene-local offsets in generated sub-compositions; they do not retime audio. Each
composition registers one paused GSAP timeline after construction. HyperFrames
nests scenes at their host start times.

Narration duration records the selected audio edit's measured duration. Final
readiness independently probes the file and compares it with the timeline. The
original master is required but is not inserted into the video. The chosen edit
is the sole audible narration input. Re-recording or editing invalidates QA.

## Readiness and reproducibility

Lifecycle labels express workflow state; release eligibility is independently
computed from valid content, required phases, existing assets, human recording,
approved transcript/captions, measured audio and signed review evidence. The review
fingerprint includes content/timings, captions, configuration, schemas, renderer
source, lockfile, manifest and required file bytes. Approval status, publication
URLs and the review record itself are excluded so recording approval does not
invalidate its own fingerprint. Material input changes require fresh review.

Production export checks inputs, HyperFrames behavior and encoded output. It emits
local verification JSON but does not claim human export acceptance or publish.
Screenshots/audio still need human review. A fingerprint proves which inputs were
reviewed, not the truth of a human approval statement.

Exact npm dependency versions plus package-lock.json give a repeatable toolchain.
Local browser/FFmpeg versions may change pixels or encoding; record them for final
deliveries. Container pinning can be considered later if byte-level reproducibility
becomes necessary. See [ADR 001](adr/001-data-driven-hyperframes.md).

CI uses portable validation: tracked files must exist, ignored local-required
sources must have valid declarations. Builds always require actual media bytes.

## Phase 2 library boundaries

`schemas/visual.schema.json` supplies additive component-specific scene contracts;
episode schema version 1 remains compatible with the Phase 1 fixture. `educational.mjs`
extends the existing registry, `primitives.mjs` escapes text and draws original SVG
symbols, `styles.mjs` reads central design tokens, `motion.mjs` builds seekable
animation commands, and `contracts.mjs` binds semantic timings to scene bounds.
No browser-side data loader or alternative renderer was introduced.

The showcase is an ordinary fixture episode and uses the same generator, asset
resolution, checks and draft export as any future episode. `visual-audit.mjs` is a
local browser verification tool using the already installed HyperFrames browser
package and compiled preview. It never supplies production composition content.
