# Initial repository audit — 2026-10-22

Before implementation, `git status --short` was empty, including untracked files.
The Git root is the **parent** `hyperframes/`, and this application is its `murphy/`
subdirectory. Preserve that repository and history; do not initialize another repo.
There were 76 tracked project files and no local ignore, attributes, editor settings,
dependency lockfile, tests or CI. No applicable parent AGENTS.md was found.

## Existing application

- `package.json`: private npm ES-module project, four scripts invoking pinned
  `hyperframes@0.8.181` via npx; no installed project dependencies or lockfile.
- `index.html`: working silent 30-second, 1080×1920, 30 FPS lesson, seven mounted
  sub-compositions. `index.motion.json` verifies timing and sentence bounds.
- `compositions/`: persistent shell, intro, three examples, rule, quiz and two
  installed component snippets. All referenced paths resolve.
- `assets/`: local GSAP 3.14.2, Manrope with OFL notice and lesson CSS (~260 KB).
- `hyperframes.json`: local asset/component paths and two registry items;
  `hyperframes.lock.json`: registry content hashes, **not** an npm lockfile.
- `BRIEF.md`, `STORYBOARD.md`, `meta.json`: describe the existing lesson;
  these remain historical creative inputs, not the new series specification.
- `AGENTS.md` and `CLAUDE.md`: duplicated long scaffold instructions.
- `scripts/`: empty. No episode specifications or recordings were present.
- `renders/`: ~4.1 MB, including a 1.58 MB MP4, verification notes, frame images
  and timeline/motion evidence; all tracked. Preserve these files.
- `.hyperframes/` (~336 KB) and `.thumbnails/` (~96 KB) contain tracked generated
  state and thumbnails. Future generated files should be ignored, but existing
  index entries must not be silently removed.

No textbook screenshots, raw recordings, secrets or private reference documents
were found among tracked project files. This is a file inventory, not a complete
history or secret audit. Local irreplaceable media needs separate backups.

## Toolchain evidence

Node 24.21.0, npm 11.19.0, FFmpeg, ffprobe and system Chromium are available.
The original verification report documents NixOS browser-library and sandbox
restrictions. Use `HYPERFRAMES_BROWSER_PATH` when bundled Chromium cannot launch.
No system changes are needed.

Installed CLI `--help`, `render --help`, `check --help` and `docs rendering`
confirm MP4 output, draft/delivery quality, explicit FPS, project-directory
arguments, static lint and full browser checks. There is no invented codec flag:
encode and inspect the output with ffprobe. The read-only latest-version probe
reports 0.8.184. The official online llms.txt index was unavailable through the web
tool; version-matched installed help/source is the API authority for this change.

## Migration choice

Keep `index.html`, existing compositions, assets, brief, storyboard and renders in
place, so existing paths and creative behavior survive. Add a data-driven factory
alongside these **using the same HyperFrames renderer**. No content moves are
necessary. Build output and private media are excluded prospectively. A root-level
GitHub workflow must live in the parent Git root and use `murphy` as working directory.
See ARCHITECTURE.md and GIT_WORKFLOW.md for the resulting boundaries and tracked
artifact migration proposal.
