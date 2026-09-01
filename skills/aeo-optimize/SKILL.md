---
name: aeo-optimize
description: Coordinate an ongoing AEO lifecycle across audit, baseline observation, evidence-backed improvement, and experiment evaluation. Use when the user wants agents to improve answer visibility over time rather than perform one isolated audit or measurement.
---

# Optimize Answer Visibility Over Time

Treat AeoKit as the system of record and preserve one traceable lifecycle. [P03](https://github.com/aeokit-dev/aeokit-skills/blob/v0.1.1/research/report-source.md#p03)

```text
audit -> observe baseline -> improve -> record experiment -> observe again -> evaluate
```

Read the bundled [AeoKit API workflow](api/aeokit.md) when a runtime is available. The workflow must still produce a useful plan without AeoKit. [P05](https://github.com/aeokit-dev/aeokit-skills/blob/v0.1.1/research/report-source.md#p05)

## Routing

1. Use `$aeo-audit` when no current readiness audit or buyer-question scope exists. An audit is diagnostic and does not modify the site. [P01](https://github.com/aeokit-dev/aeokit-skills/blob/v0.1.1/research/report-source.md#p01) [P02](https://github.com/aeokit-dev/aeokit-skills/blob/v0.1.1/research/report-source.md#p02)
2. Use `$aeo-observe` to establish a compatible baseline. Live provider runs can spend money and mutate runtime state; obtain explicit authorization and a sample or cost ceiling. [C14](https://github.com/aeokit-dev/aeokit-skills/blob/v0.1.1/research/report-source.md#c14) [P06](https://github.com/aeokit-dev/aeokit-skills/blob/v0.1.1/research/report-source.md#p06)
3. Select one evidence-backed opportunity. Use `$aeo-improve` to form a falsifiable hypothesis, create the AeoKit experiment when authorized, and implement the smallest useful change. [C15](https://github.com/aeokit-dev/aeokit-skills/blob/v0.1.1/research/report-source.md#c15) [P02](https://github.com/aeokit-dev/aeokit-skills/blob/v0.1.1/research/report-source.md#p02)
4. Preserve changed URLs, commit or deployment reference, baseline run IDs and metrics, and the unchanged evaluation window. [C12](https://github.com/aeokit-dev/aeokit-skills/blob/v0.1.1/research/report-source.md#c12) [P03](https://github.com/aeokit-dev/aeokit-skills/blob/v0.1.1/research/report-source.md#p03)
5. After that window, use a fresh observation context with the same corpus and compatible surfaces. Attach follow-up run IDs and classify the result as `won`, `lost`, `inconclusive`, or still `evaluating`. [C11](https://github.com/aeokit-dev/aeokit-skills/blob/v0.1.1/research/report-source.md#c11) [C15](https://github.com/aeokit-dev/aeokit-skills/blob/v0.1.1/research/report-source.md#c15)

Do not infer causality from a before/after difference alone. Report compatibility breaks, concurrent changes, failures, and insufficient samples. Keep the optimization agent's reasoning out of the independent observer's context. [C11](https://github.com/aeokit-dev/aeokit-skills/blob/v0.1.1/research/report-source.md#c11) [C15](https://github.com/aeokit-dev/aeokit-skills/blob/v0.1.1/research/report-source.md#c15)

## Stopping points

Stop after the audit when the prompt corpus needs user approval. Stop before a cost-bearing observation, site mutation, deployment, or AeoKit write unless the user authorized that action. After evaluation, recommend the next opportunity but do not start another experiment automatically. [P02](https://github.com/aeokit-dev/aeokit-skills/blob/v0.1.1/research/report-source.md#p02) [P06](https://github.com/aeokit-dev/aeokit-skills/blob/v0.1.1/research/report-source.md#p06) [P07](https://github.com/aeokit-dev/aeokit-skills/blob/v0.1.1/research/report-source.md#p07)

## Output

Return the current lifecycle stage, evidence IDs, project and experiment IDs when available, completed actions, next decision, required authorization, and the date or condition for the next observation. [P03](https://github.com/aeokit-dev/aeokit-skills/blob/v0.1.1/research/report-source.md#p03)
