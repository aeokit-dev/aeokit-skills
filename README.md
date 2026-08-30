# AEO Skills

Portable Agent Skills by AEOkit for evidence-backed answer-engine optimization. The same `SKILL.md` workflows run in ChatGPT, Codex, Cursor, GitHub Copilot, Gemini CLI, Claude Code, or [AEO Agent](https://github.com/aeokit-dev/aeo-agent).

**Audit the evidence:** [Open the numbered research claim and source ledger](research/report-source.md#citation-and-traceability-registry).

## Included skills

| Skill | Job |
|---|---|
| `aeo-audit` | Read-only crawlability, entity, extraction, schema-parity, and evidence audit |
| `aeo-improve` | Diagnose one buyer question, propose or implement a small patch, and verify it honestly |
| `aeo-observe` | Run stable buyer prompts and report mentions, citations, uncertainty, and raw evidence |

The skills use the open Agent Skills folder format. They remain useful without AEO Agent; when AEOkit tools are installed, the instructions use them for deterministic checks and reproducible observations.

## Install skill folders

List the catalog:

```bash
npx aeo-skills@latest list
```

Install one skill into the current repository:

```bash
npx aeo-skills@latest add aeo-improve --to agents
npx aeo-skills@latest add aeo-improve --to claude
npx aeo-skills@latest add aeo-improve --to agent
```

The shared `agents` target works with Codex, Cursor, GitHub Copilot, and Gemini CLI. The aliases `codex`, `cursor`, `copilot`, and `gemini` resolve to that same location.

Install all skills for your user account:

```bash
npx aeo-skills@latest add --all --to agents --scope user
npx aeo-skills@latest add --all --to claude --scope user
npx aeo-skills@latest add --all --to agent --scope user
```

Existing directories are never replaced unless `--force` is explicit. Use `--dry-run` to inspect destinations first.

## Locations

| Host | Project | User |
|---|---|---|
| Codex, Cursor, GitHub Copilot, Gemini CLI | `.agents/skills/<name>/` | `~/.agents/skills/<name>/` |
| Claude Code | `.claude/skills/<name>/` | `~/.claude/skills/<name>/` |
| AEO Agent | `.aeokit/skills/<name>/` | `~/.aeokit/skills/<name>/` |

The shared `.agents/skills/` location is documented by [OpenAI](https://developers.openai.com/codex/build-skills), [Cursor](https://cursor.com/docs/skills), [GitHub Copilot](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/add-skills), and [Gemini CLI](https://geminicli.com/docs/cli/skills/). Claude Code discovers the same skill format from its own directory. AEO Agent uses that file structure and adds typed AEO tool and evidence contracts.

## Plugin distribution

The repository root is a skills-only plugin for the OpenAI and Claude plugin systems:

| Ecosystem | Manifest | Skill discovery |
|---|---|---|
| ChatGPT and Codex | `.codex-plugin/plugin.json` | `./skills/` declared by the manifest |
| Claude Code | `.claude-plugin/plugin.json` | `./skills/` discovered from the plugin root |

The OpenAI plugin exposes the same three skills in ChatGPT and Codex. The Claude Code plugin exposes them with the `aeokit` namespace, such as `/aeokit:aeo-audit`. Neither manifest forks or rewrites the underlying skill instructions.

This layout follows the [OpenAI skill and plugin guidance](https://developers.openai.com/codex/build-skills) and [Claude Code plugin guidance](https://code.claude.com/docs/en/plugins). The npm installer remains useful for direct project or user installation without a plugin marketplace.

## Invoke

Codex:

```text
$aeo-audit Audit this repository for the buyer question "best open-source AEO testing tools."
```

ChatGPT:

```text
Select the installed AEO Audit skill with @, then ask it to audit the site for a buyer question.
```

Claude Code:

```text
/aeokit:aeo-improve Make this site easier to accurately cite for "best open-source AEO testing tools."
```

The namespaced form above is for the plugin. A direct `--to claude` installation uses `/aeo-improve`. Cursor and GitHub Copilot expose installed skills through `/`; Gemini CLI lists and manages them through `/skills`.

AEO Agent loads `aeo-improve` automatically during planning when installed:

```bash
aeo-agent skills
aeo-agent plan --query "What are the best open-source AEO testing tools?"
```

## Design rules

- The optimizing agent does not grade its own work.
- Every diagnosis is tied to an evidence ID or source URL.
- Local checks, grounded simulations, and production observations are labeled separately.
- Skills never invent claims or imply that schema alone creates visibility.
- Mutating work requires user authorization; deployment is a separate action.

## Research basis

The skills are maintained against a [source-backed AEO evidence review](research/report-source.md), last researched on 2026-08-29. Every substantive instructional line links to a stable research claim (`C##`), source (`S##`), or repository policy (`P##`) in its [numbered citation ledger](research/report-source.md#citation-and-traceability-registry).

Its core conclusion is that durable AEO combines platform-specific retrieval access, people-first and verifiable content, consistent entity data, and reproducible per-surface measurement. It does not assume that `llms.txt`, special schema, artificial content chunking, or a single prompt observation improves visibility.

## Development

Requires Node.js 22.19 or newer.

```bash
npm install
npm run audit:citations
npm run check
```

The GitHub Actions definition is checked in as `.github/ci.yml.example`; move it to `.github/workflows/ci.yml` when the publishing token has GitHub's `workflow` scope.

## License

MIT
