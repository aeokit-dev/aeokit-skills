---
name: aeo-observe
description: Measure whether independent AI research agents mention and cite a brand for a stable buyer-prompt corpus. Use for repeatable AEO observations and run comparisons, not website editing.
---

# Observe Brand Visibility

**Research:** [Open the numbered claim and source ledger](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#citation-and-traceability-registry). [P05](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#p05)

Use AEO Preview when available so raw answers, prompt hashes, provider identity, and deterministic extraction remain reproducible. [C12](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c12) [P04](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#p04)

## Workflow

1. Record the brand, canonical domain, aliases, category, audience, use case, competitors, business outcome, and the exact buyer prompts. Preserve each prompt's provenance; generated prompts are hypotheses, not proof of customer demand. [C12](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c12) [P01](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#p01)
2. Lint prompts for neutrality. Avoid prompts that presume the tracked brand is best, deserving of inclusion, or the desired answer. Start each independent prompt in a fresh conversation; version a multi-turn journey as a different corpus and retain its full transcript. [C12](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c12) [C15](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c15)
3. Choose and label the evidence source: native owner telemetry, verified referrals, public consumer-surface observation, or controlled simulation. Never blend these into one visibility score. [C11](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c11)
4. Keep provider, product surface, displayed model when available, search/grounding mode, account state, locale, geography, device, timestamp, samples, corpus order, prompt hash, and parser version in every run record. [C12](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c12)
5. Start with one fixture or otherwise cost-free sample as an integration check. Before any live or subscription-backed run, obtain authorization for the provider, maximum samples, and cost ceiling. Inspect raw answers, citation destinations, and extraction errors before increasing usage. [C14](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c14) [P04](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#p04) [P06](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#p06)
6. Report raw numerators and denominators, mention rate, canonical-domain citation rate, supported-brand-claim rate when reviewed, observation and failure counts, uncertainty interval when appropriate, source domains and ownership, and competitor mentions. [C13](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c13) [C14](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c14) [C18](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c18)
7. Compare only compatible runs. Refuse or clearly qualify comparisons across changed prompt corpora, providers, product surfaces, access modes, account states, locales, or material model changes. [C01](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c01) [C12](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c12)
8. Preserve accepted negative answers, abstentions, and technical failures as distinct outcomes. Absence is data; a failed run is not a negative mention. [C12](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c12)
9. Prefer available native reports for their own surfaces, including Google Search Console generative AI impressions and Bing Webmaster Tools AI Performance. Do not reverse-engineer a native platform total from prompt samples. [C10](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c10) [C16](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c16)

Read [references/measurement-contract.md](references/measurement-contract.md) before defining metrics or interpreting a run. [C11](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c11) [P05](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#p05)

## Commands

For a configured project, resolve and record one approved `aeo-preview` version for the whole run series; do not use `@latest` for comparable baselines and reruns. [C12](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c12) [P06](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#p06)

```bash
AEO_PREVIEW_VERSION="X.Y.Z"
npx "aeo-preview@${AEO_PREVIEW_VERSION}" run --provider codex --samples 1
npx "aeo-preview@${AEO_PREVIEW_VERSION}" report --markdown
npx "aeo-preview@${AEO_PREVIEW_VERSION}" diff
```

Claude Code can be used with `--provider claude`. Use the fixture provider for CI and parser tests. Never replace fixture runs with live subscription calls in unattended CI. [P04](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#p04)

## Boundaries

Call subscription-backed agent or API results `directional agent simulations` unless the run genuinely observes a named public consumer surface. Do not infer causality from before/after changes, pool incompatible surfaces, trust a citation without checking its destination when support matters, or call a single observation a stable visibility score. [C01](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c01) [C11](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c11) [C13](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c13) [C15](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c15)
