# Grammar Video Factory — agent instructions

- Read README.md and docs/ARCHITECTURE.md; inspect Git status before editing. The
  Git root is the parent. Preserve unrelated work and existing creative files.
- Use implement-feature for features, fix-bug for debugging and verify-changes
  before completion. Read hyperframes first for HyperFrames work, then relevant
  core/animation/CLI skills before composition edits. After a desktop handoff,
  run `hyperframes catch-up` before editing.
- Canonical standards: docs/SERIES_BIBLE.md, TEACHING_STANDARDS.md, VISUAL_SYSTEM.md,
  ASSET_POLICY.md, PRODUCTION_WORKFLOW.md and QA_CHECKLIST.md. Reuse their boundaries.
- New lessons are versioned episode JSON; reuse compositions/factory and central
  config. Generated .hyperframes-build HTML is disposable. Translate Studio edits
  back to data/components; do not create competing lesson renderers.
- Prefer the component catalog/contracts in docs/VISUAL_SYSTEM.md before adding
  visuals. Preserve fixture compatibility; use shared styles/motion and run painted
  safe-area/backward-seek checks for library changes.
- Published teaching is original. Keep textbook screenshots private; never copy
  pages, illustrations, exercises or substantial passages. The owner records all
  narration: no generated/cloned voice or required Whisper.
- Use npm, exact dependencies and the lockfile. Add dependencies only for concrete
  needs. Check version-matched CLI help for unfamiliar flags. No system changes,
  global packages, backend, database or automatic publishing.
- Run `npm run validate` and `npm run check:static` after foundation changes.
  After composition HTML or renderer/layout edits run full `npm run check` for
  sample/fixture and the affected episode. Inspect frames/audio when relevant.
  Disclose unavailable/skipped checks; never claim unexecuted checks passed.
- Agent preview uses `npm run preview -- <id>` (supported background mode).
  Verify preview:status, keep it alive during review and stop it afterward.
- Production-ready requires current review evidence, media measurements and human
  export review. Never commit, push, merge, deploy or publish without authorization.
- Follow docs/GIT_WORKFLOW.md. Do not delete valuable assets or untrack existing
  artifacts without authorization. Ignored recordings need independent backups.
