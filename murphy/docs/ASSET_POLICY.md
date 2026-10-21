# Asset policy

Prefer original SVGs, diagrams and simple illustrations. Do not download stock
collections in advance. Publish only original material or files whose rights
cover the intended use. Public accessibility is not a license.

Shared assets are in `assets/manifest.json`; episode assets live in the episode's
`assets` array with unambiguous IDs. Both use schemas/asset.schema.json. Record ID,
type, creator, source, license name/source, distribution permission, attribution,
intended usage, path and distribution class. Retain font/runtime notices. The
existing GSAP header links its Standard License; Manrope ships with its OFL text.

Use kebab-case IDs and episode-prefixed filenames. References are repository-relative,
resolved through the manifest. Small distributable sources under assets are tracked.
Large dependencies use ignored `assets/local/` and declare `local-required`;
recordings use `recordings/<episode-id>/`. Missing required files fail validation,
including ignored files. Rights review remains a human obligation.

Textbook screenshots stay in ignored `references-private/`. They must never enter
the manifest, composition, render input or CI artifacts. Do not reproduce pages,
illustrations, exercise sets or substantial passages. Track original teaching only.

Raw takes and edits are irreplaceable even though Git ignores them. Before editing,
keep two independent backups, one off-device; test restoration periodically. Keep
originals immutable, preserve correction notes and back up references separately.
The render build is not a backup.

No private/copyrighted reference files were found tracked in the initial inventory.
If found later, stop distribution, identify affected history/remotes and propose an
authorized migration. Removing an index entry does not erase history. Do not rewrite
history or delete originals automatically. See GIT_WORKFLOW.md.
