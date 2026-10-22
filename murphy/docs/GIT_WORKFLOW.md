# Git workflow

The application is `murphy/` in the existing parent Git repository. Preserve its
history and other projects. Use this directory for npm commands; understand the
parent root before repository-level actions. No nested Git repository is needed.

Track source, config, schemas, episode JSON/scripts/transcripts/captions/review
notes, small original/licensed assets and notices/manifests, npm and HyperFrames
lockfiles, tests and docs. Use kebab-case names and `uNNN-pNN-topic` episode IDs;
reserve `fixture-*` for infrastructure tests.

Ignore dependencies, new builds/renders/caches, local settings, secrets, private
references, raw audio and large working media. Do not ignore recordings wholesale:
text logs remain trackable. Large dependencies under assets/local declare
local-required provenance and must be restored locally. CI uses no private media.
Never use `git add -f` to bypass privacy exclusions.

Generated `.hyperframes/` state, `.thumbnails/` and `renders/` are untracked and
ignored, including the older artifacts originally committed with the project.
The cleanup retained their local files and historical Git versions; it did not
rewrite history. Do not add regenerated output back to Git. Keep verification
summaries in episode review notes and canonical docs; local frame/audio evidence
stays under renders/. Preserve useful local history and independently back up
irreplaceable recordings before removing working files.

Git LFS is not enabled: assets are small, no large required source audio is
committed, and remote LFS support is unverified. Do not add filters or migrate
history without a concrete need and authorization. Git is not a recording backup;
see ASSET_POLICY.md for independent backup expectations.

Use short topic branches, scoped diffs and `git diff --check`; run validation and
relevant composition checks before review. Stage explicit paths (including the
parent-root CI workflow), avoid unrelated work, and describe behavior in commits.
Agents must not commit, push, merge, deploy or publish without authorization.

Use `npm ci`; update dependencies intentionally at exact versions and review the
lockfile. HyperFrames registry hashes describe snippets, not npm dependencies;
do not rewrite them for unrelated changes. Formatting excludes preserved creative
HTML and generated/private assets. CI is at the Git root, not inside murphy/.github.
