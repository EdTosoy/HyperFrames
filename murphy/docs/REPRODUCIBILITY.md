# Episode preservation and restoration

Episode JSON is authoritative for script, captions, ordered scenes, timing, asset
references and narration metadata. SCRIPT.md is the reading copy: keep it in sync
when editing. Generated HTML and MP4s are disposable derivatives. Reopening or
rerendering requires no previous MP4. Never edit generated HTML as the only copy.

## Restore an older lesson

1. Record the Git revision AND any uncommitted source changes used for the export.
   A commit ID alone cannot reproduce an uncommitted draft. Preserve the complete
   episode folder, shared renderer, scripts, schemas, config, asset manifest, local
   fonts/runtime/notices, package.json, package-lock.json and .nvmrc together.
   Preserve a source snapshot outside the working device until changes are committed
   through an explicitly authorized workflow. Git staging is not an off-device backup.
2. Restore that revision in a separate checkout, not by resetting current work.
   Restore any source snapshot on top. Keep newer work intact. Use Node 24.21.0,
   npm 11.19.0 and `npm ci` with the saved lockfile (currently HyperFrames 0.8.184).
   Do not silently upgrade dependencies while reproducing an old episode.
3. Restore every declared local-required asset to its original relative path,
   including narration masters, working edits and approved transcript. Verify stored
   checksums when available. Keep licenses/notices with downloaded assets.
4. Install/use compatible FFmpeg, ffprobe and Chromium. Record their versions and
   OS/GPU with an export: the npm lockfile does not pin these, so byte-identical
   pixels/encoding across machines or indefinitely available dependencies cannot
   be guaranteed. Preserve dependency/toolchain artifacts separately if needed.
5. Run `npm run validate`, `npm run check:static`, then
   `npm run check -- <episode-id>`. Set HYPERFRAMES_BROWSER_PATH to the installed
   Chromium if necessary. `npm run preview -- <episode-id>` rebuilds Studio content.
   Verify `npm run preview:status -- <episode-id>`; stop after review.
6. Modify episode JSON and rebuild. For narration, preserve an immutable owner
   recording and a separate normalized edit, declare both assets, verify the spoken
   transcript, then align scenes/captions to measured audio. Refresh human review
   evidence after material changes; do not reuse stale approval fingerprints.
7. `npm run render:draft -- <episode-id>` writes renders/<id>/draft.mp4 with a
   watermark. `npm run render:production -- <episode-id>` separately requires
   current readiness, media measurements and human review before building without
   the watermark; it writes production.mp4. Both build only in .hyperframes-build.
   Repeated renders replace their output filename, never source JSON or recordings.
   Copy exports to versioned filenames when an older render must be retained.

## Audit — 2026-11-06

Existing tracked episodes, local Manrope/GSAP assets, schemas, config and lockfile
are present. The new complete Unit 1 folder was untracked at audit start; its source
JSON, reading script, documentation and eight original SVGs must enter Git tracking.
Existing shared implementation changes are still uncommitted. Base revision:
`c9473f29d99426683ad7b64b6d2f6231f71214ca`. That revision alone does not reproduce
the new lesson. An export fingerprint detects input changes; it is not a source backup.

Ignored source media requiring independent backups:

- recordings/u001-p01-am-is-are/take-01-original.mp3
- recordings/u001-p01-am-is-are/take-02-original.mp3
- recordings/u001-p01-am-is-are/edit-v02.wav
- recordings/u001-p01-am-is-are/edit-v02-pre-normalize.wav

All are locally present. Independent backup/restore of those recordings has not
been verified. Previously copied SSD/Drive MP4s do not back up editable lesson
sources or narration. The complete Unit 1 silent lesson uses only tracked-source
eligible local SVGs, the shared font/runtime and no narration input. Future lessons
are reproducible under the same source/asset/toolchain preservation conditions.

No source deletion, commit, push or publication is part of this audit.
