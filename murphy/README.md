# Grammar Video Factory

Production foundation for **English, Made Clear.**: original English teaching
videos with the owner's recorded voice. Phases 1–2 supply the production foundation, a reusable visual library, and labeled
infrastructure fixtures. The first curriculum episode is an owner-narrated local draft:
[`u001-p01-am-is-are`](episodes/u001-p01-am-is-are/README.md).

## Quick start

From this directory (`murphy/` inside the existing parent Git repository), use
Node 24 and npm 11.19.0 (`.nvmrc` pins 24.21.0). FFmpeg and ffprobe must be on
PATH; browser checks/rendering require Chromium.

```bash
npm ci
npm run validate
npm run check:static
npm run check
npm run preview
npm run preview:status
npm run render:draft
npm run preview:stop
```

The default episode is `fixture-pipeline-smoke`, a silent six-second vertical
layout test. It is permanently ineligible for production release. Render output
is `renders/fixture-pipeline-smoke/draft.mp4`; generated HTML lives in
`.hyperframes-build/fixture-pipeline-smoke/`. Both are ignored.

On NixOS, or when bundled Chromium cannot launch, select an existing browser:

```bash
export HYPERFRAMES_BROWSER_PATH="$(command -v chromium)"
```

This machine requires browser checks and rendering outside the restrictive agent
sandbox. Do not modify the operating system to fix that environment restriction.
For persistent agent handoff, `npm run preview` uses the supported HyperFrames
`preview --background`; verify with `preview:status`. Stop it after review.

## Create a future episode

```bash
npm run episode:new -- u002-p01-topic-name
# Edit episodes/u002-p01-topic-name/episode.json; replace every TODO.
npm run validate:episodes
npm run episode:build -- u002-p01-topic-name
npm run preview -- u002-p01-topic-name
npm run render:draft -- u002-p01-topic-name
```

No new lesson HTML is needed. Script, scene times, examples, quiz answer key,
captions and asset IDs belong in the episode specification. Timing uses seconds
on a 30 FPS frame grid. See [production workflow](docs/PRODUCTION_WORKFLOW.md) for
script approval, recording, alignment, fingerprint review and final export.

```bash
npm run ready -- u002-p01-topic-name --fingerprint
npm run ready -- u002-p01-topic-name
npm run render:production -- u002-p01-topic-name
```

Readiness is derived, never a trusted `ready: true` flag. The production command
requires current human review evidence and recordings, runs the composition
check, renders, and probes the resulting MP4. Watching/listening to the actual
export remains a required manual acceptance step. There is no automatic publishing.

## Preserved example

The pre-existing silent 30-second composition remains at `index.html` with its
original assets, scenes, BRIEF.md, STORYBOARD.md, motion checks and render evidence.
Its older visual palette remains intentionally unchanged. Use `npm run dev` to
preview it, and the following to render it:

```bash
npm run render -- --quality draft --fps 30 --output renders/legacy-draft.mp4
```

The factory uses the same HyperFrames runtime. `npm run check` checks both the
preserved example and all fixtures (or the episode ID supplied after `--`).
The existing `npm run publish` shortcut is retained for explicitly authorized
manual use only; it is never invoked by validation, rendering, CI or the factory
workflow and does not establish production readiness.

## Repository guide

- [Initial audit](docs/INITIAL_AUDIT.md) and [implementation verification](docs/VERIFICATION.md)
- [Architecture and directory map](docs/ARCHITECTURE.md)
- [Series bible](docs/SERIES_BIBLE.md) and [teaching standards](docs/TEACHING_STANDARDS.md)
- [Visual system](docs/VISUAL_SYSTEM.md) and [asset policy](docs/ASSET_POLICY.md)
- [Production workflow](docs/PRODUCTION_WORKFLOW.md) and [QA checklist](docs/QA_CHECKLIST.md)
- [Git workflow](docs/GIT_WORKFLOW.md)

HyperFrames is locked to 0.8.184, Ajv validates JSON Schema, Prettier formats the
foundation sources, and Node's built-in test runner runs contract tests. There is
no TypeScript build step, backend, database or second package manager. The CLI's
installed `hyperframes <command> --help` is the version-matched reference.

## Visual component showcase

The 40-second `fixture-component-showcase` demonstrates titles, sentence building,
comparisons, time diagrams, dialogue, a thinking pause/quiz, phrase replacement,
captions and a branded recap. It is silent and permanently ineligible for release.
See the [component catalog and contracts](docs/VISUAL_SYSTEM.md).

```bash
npm run episode:build -- fixture-component-showcase
npm run check -- fixture-component-showcase
npm run preview -- fixture-component-showcase
npm run preview:status -- fixture-component-showcase
# Substitute the port printed by preview:
npm run check:visual -- fixture-component-showcase http://localhost:3003
npm run render:draft -- fixture-component-showcase
npm run preview:stop -- fixture-component-showcase
```

Output: `renders/fixture-component-showcase/draft.mp4`. Set
`HYPERFRAMES_BROWSER_PATH` as described above on this workstation. `npm run check`
and `check:static` now cover all fixtures by default; preview/build/draft still
default to the Phase 1 smoke fixture. There are no additional dependencies.
