# ADR 001 — Compile episode JSON to HyperFrames HTML

Status: accepted for Phase 1.

The repository already has a working plain-HTML HyperFrames composition. Hundreds
of lessons need shared visual behavior and independently reviewable content.

Use versioned JSON plus JSON Schema/Ajv and small ES modules to generate isolated
standard HyperFrames projects. Keep the existing sample intact. Node's test runner
is sufficient; TypeScript and a frontend framework add a build layer without a
corresponding runtime need.

Alternatives: hand-authoring lessons duplicates timing/layout; a dynamic browser
lesson loader complicates deterministic loading and media extraction. Build-time
compilation keeps rendered media static and inspectable.

Ajv is justified by nested schema diagnostics and strict validation; Prettier by
consistent formatting; HyperFrames remains the sole rendering dependency.
Generated files are ignored and rebuilt. Studio edits to generated output must be
translated back into episode data/components. Layout complexity stays in an
explicit small registry, not a generic plugin system.
