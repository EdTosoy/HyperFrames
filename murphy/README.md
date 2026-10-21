# Am, Is & Are — English Essentials

A silent 30-second grammar lesson, adapted from the existing Kinetic Type starter.
1080 × 1920 (9:16), 30 fps. All required runtime and font assets are local.

- 0–3.5 s: am / is / are introduction
- 3.5–8 s: I am ready
- 8–12.5 s: She is ready
- 12.5–17 s: They are ready
- 17–23 s: concise subject agreement rule
- 23–30 s: We ___ happy. Answer begins revealing at 27 s.

## Local commands

```bash
npm run check
npx --yes hyperframes@0.8.181 preview --background
npm run render -- --quality delivery --fps 30 --workers 2 --output renders/am-is-are-lesson.mp4
```

On this NixOS machine, bundled Chrome lacks shared libraries. Use the working
system Chromium for checks, snapshots and rendering, without changing the system:

```bash
export HYPERFRAMES_BROWSER_PATH="$(command -v chromium)"
```

Chromium must run outside the restrictive agent sandbox. The browser was tested
in isolation before selecting it; no system configuration was changed.
No optional transcription, voice, music, or semantic-search models were installed.

## Project files

`index.html` mounts a persistent frame and six editable scene sub-compositions.
`assets/lesson.css` defines typography and the three verb colors. Each scene
registers one paused GSAP timeline. `index.motion.json` checks reveal order,
answer arrival, and sentence bounds against the seeked browser composition.
`STORYBOARD.md` records the timing and animation plan.

The local font is Manrope (see `assets/fonts/OFL-Manrope.txt`).
The local GSAP runtime preserves the starter's 3.14.2 version.

Inspection artifacts live in `renders/preview-frames/`, `renders/motion-map.json`,
`renders/timeline.json`, and `renders/word-reveal-proof.png`.
To stop Studio after review: `npx --yes hyperframes@0.8.181 preview --stop`.
# HyperFrames
# HyperFrames
# HyperFrames
