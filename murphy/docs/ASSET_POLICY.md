# Asset policy

Prefer existing, appropriately licensed assets from reputable providers before
creating custom illustrations. Use Lucide as the preferred icon library. Consider
unDraw for illustrations and Unsplash for photography when contextual imagery
helps explain the lesson. Provider names are starting points, not blanket license
approval: verify the selected asset's reuse, modification, redistribution,
commercial-use and attribution conditions before incorporating it. Public
accessibility is not a license. Download only assets needed for the lesson, not
stock collections in advance.

Create custom SVG illustrations or HyperFrames diagrams only when suitable
existing assets cannot clearly demonstrate the grammar concept or when precise
animation is needed. Reuse the existing components and rendering pipeline; do not
add an icon package or other dependency merely to use a few downloaded assets.

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

Download required assets locally; never depend on runtime hotlinks or on a
provider URL remaining available. Preserve the exact files used, applicable license
notices and attribution text alongside their manifest records. Track small assets
when their license permits repository distribution. Independently back up ignored
`local-required` assets, keeping their original relative paths and checksums with
the backup inventory; verify restoration before relying on that backup. Preserve
the selected asset version for older episodes instead of silently replacing its
bytes. An MP4 export is not a backup of the source assets needed for rerendering.

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

## Visual teaching and sourcing

Choose typography for form, diagrams for relationships, and context imagery for
meaning. Show a useful situation before explaining its rule; reveal information
progressively. Licensed illustrations, photos and icons may be combined with
custom visuals where justified by the selection rules above. Every
visual must teach; no mascot or decorative image quota. Verify reuse and
attribution rights before downloading external media, store it locally, and record
source, author and license in the shared or episode asset manifest. Avoid
watermarks, weak resolution and runtime hotlinks. If no suitable licensed asset
clearly teaches the concept, use an original illustration or precise diagram and
continue production. Do not force imagery into scenes better taught with text.
