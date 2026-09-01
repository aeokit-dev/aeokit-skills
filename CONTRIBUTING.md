# Contributing

Keep each skill focused on one job, preserve the distinction between deterministic verification and production observation, and add references only when they change an agent's decisions.

```bash
npm install
npm run check
```

Use Conventional Commit prefixes for changes that should ship: `fix:` for a patch, `feat:` for a minor release, and `feat!:` or another `!` type for a breaking release. Release Please maintains the version and changelog PR. Merging that release PR publishes through npm trusted publishing; do not edit package or plugin versions independently.

New skills must work as ordinary Agent Skills without depending on AEO Agent. Tool-specific accelerators may be optional, never mandatory unless the description says so.

API-specific workflow text is owned by the main `aeokit` repository under `agent-skills/api-export`; do not hand-edit the imported `skills/*/api/aeokit.md` files here. After an AeoKit API change, run `npm run sync:aeokit-api -- /path/to/aeokit/agent-skills/api-export`, review the lock and imported diff, and commit them with the skills release. AeoKit validates the manifest's operations against OpenAPI; this repository validates the imported file digests.

Keep `.codex-plugin/plugin.json` and `.claude-plugin/plugin.json` pointed at the shared `skills/` tree. Do not create host-specific copies of a skill. The `agents`, `codex`, `cursor`, `copilot`, and `gemini` installer targets must continue to resolve to the standard `.agents/skills/` location. `agents/openai.yaml` is optional OpenAI presentation metadata; portable behavior belongs in `SKILL.md` and its referenced resources.

Consequential AEO guidance must be traceable to official platform documentation, a web standard, or original research in [research/report-source.md](research/report-source.md). Bound experimental and commercial findings by their methods; do not convert correlations into ranking rules. Recheck volatile crawler names, product controls, and native reports before release, update the research date when the evidence is substantively reviewed, and keep the research regression test current.

Every substantive line in `skills/*/SKILL.md` and `skills/*/references/*.md` must end with at least one clickable registry citation: `C##` for a synthesized research claim, `S##` for a source, or `P##` for a repository policy. Add or revise the numbered entry in the [citation and traceability registry](research/report-source.md#citation-and-traceability-registry) first, then run `npm run audit:citations`. The auditor rejects uncited instructional lines, unknown IDs, malformed links, duplicate registry IDs, broken claim-to-source links, and orphaned claims or policies.

Citation URLs use the independently versioned tag recorded in `research/citation-lock.json`; ordinary package releases do not rewrite hundreds of stable evidence links. Change that lock only when publishing a corresponding Git tag containing the reviewed ledger.
