# AEO Skills

Portable Agent Skills by aeokit for evidence-backed answer-engine optimization. The same `SKILL.md` workflows run in ChatGPT, Codex, Cursor, GitHub Copilot, Gemini CLI, Claude Code, or [AEO Agent](https://github.com/aeokit-dev/aeo-agent).

**Audit the evidence:** [Open the numbered research claim and source ledger](research/report-source.md#citation-and-traceability-registry).

## Included skills

| Skill | Job |
|---|---|
| `aeo-audit` | Read-only crawlability, entity, extraction, schema-parity, and evidence audit |
| `aeo-improve` | Diagnose one buyer question, propose or implement a small patch, and verify it honestly |
| `aeo-observe` | Run stable buyer prompts and report mentions, citations, uncertainty, and raw evidence |

The skills use the open Agent Skills folder format. They remain useful without AEO Agent; when aeokit tools are installed, the instructions use them for deterministic checks and reproducible observations.

## Zero to cited

SEO competes to rank a page. AEO competes to make useful evidence available to
an AI-generated answer. A new, original source can potentially appear in an
answer as soon as a live answer engine discovers it and finds it relevant; it
does not necessarily need months of ranking history first. Inclusion is never
guaranteed, so this repository provides a reproducible workflow rather than a
promise of instant visibility.

Use the three skills together to follow a source from publication to its first
observed citation:

```text
aeo-audit -> aeo-improve -> publish -> aeo-observe
                                      |
                                      v
                 crawler visit -> mention -> citation
```

- `aeo-audit` checks whether the source is accessible, extractable, and
  supported by verifiable evidence.
- `aeo-improve` makes the smallest authorized change for a specific buyer
  question and verifies the local result.
- `aeo-observe` repeats stable prompts and records what answer engines actually
  mention and cite.

aeokit is the system of record for auditable answers, citations, mentions, and
crawler activity. AEO Agent is the conversational interface for exploring that
evidence. These skills make the workflow portable across supported agents.

## Install the aeokit plugin

The plugin is the recommended installation for Codex, ChatGPT, and Claude Code. It keeps the three portable skills together under the `aeokit` identity.

For Claude Code, add this GitHub repository as a marketplace and install the plugin:

```text
/plugin marketplace add aeokit-dev/aeo-skills
/plugin install aeokit@aeokit
```

The skills are then available as `/aeokit:aeo-audit`, `/aeokit:aeo-improve`, and `/aeokit:aeo-observe`.

For Codex and ChatGPT, install `aeokit` from the universal plugin directory after publication.

## Install standalone skill folders

List the catalog:

```bash
npx @aeokit/skills@latest list
```

Install one skill into the current repository:

```bash
npx @aeokit/skills@latest add aeo-improve --to agents
npx @aeokit/skills@latest add aeo-improve --to claude
npx @aeokit/skills@latest add aeo-improve --to agent
```

The shared `agents` target works with Codex, Cursor, GitHub Copilot, and Gemini CLI. The aliases `codex`, `cursor`, `copilot`, and `gemini` resolve to that same location.

Install all skills for your user account:

```bash
npx @aeokit/skills@latest add --all --to agents --scope user
npx @aeokit/skills@latest add --all --to claude --scope user
npx @aeokit/skills@latest add --all --to agent --scope user
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

Each skill also contains the same versioned AeoKit API workflow reference for Claude Code and Codex. Those API-specific files are authored and tested in the main `aeokit` repository, then imported into this repository before release. End users still install only this plugin; no runtime download or second skill installation is required.

The Claude marketplace catalog is stored at `.claude-plugin/marketplace.json`, so this GitHub repository can be added directly as a marketplace.

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
npm run sync:aeokit-api -- /path/to/aeokit/agent-skills/api-export
npm run audit:citations
npm run check
```

The sync command writes `skills/.aeokit-api.lock.json` with the API version and SHA-256 digest of every imported file. `npm run check` verifies that lock, so locally edited or stale imported guidance cannot be published accidentally.

Validate the Claude plugin and marketplace with Claude Code 2.1.233 or newer:

```bash
claude plugin validate .
```

Validate the Codex plugin before submission. Public Codex and ChatGPT publication uses the OpenAI Platform plugin submission portal; public Claude publication uses the plugin submission form in Claude.ai or the Anthropic Console.

Releases are automated with Release Please and npm trusted publishing. Conventional `feat:`, `fix:`, and breaking-change commits update a release PR; merging that PR creates the GitHub release and publishes the exact tagged commit to npm with provenance.

One-time activation requires an organization owner to allow GitHub Actions to create pull requests, then an npm package owner must add a trusted publisher for repository `aeokit-dev/aeokit-skills`, workflow `release.yml`, and environment `npm`. Finally set the repository variable `RELEASE_AUTOMATION_ENABLED` to `true`. The release job remains safely disabled while that variable is absent or false.

## License

MIT
