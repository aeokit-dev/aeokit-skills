# Measurement contract

## Stable unit

The unit is one named product-surface response to one immutable prompt at one timestamp under recorded conditions. Store accepted negatives, abstentions, and failures separately; do not silently retry until a favorable answer appears. [C12](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c12)

A complete run record contains the following fields. Keep the collection tool and parser pinned across comparable runs, and record both versions: [C12](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c12) [P06](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#p06)

- brand, canonical domain, approved aliases, competitors, and corpus version [C12](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c12)
- exact prompt, prompt provenance, prompt hash, corpus order, conversation state, and sample number [C12](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c12)
- provider, product surface, displayed model when available, and web-search or grounding mode [C12](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c12)
- public UI, API, test agent, fixture, or other access mode [C12](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c12)
- account or signed-out state, locale, geography, device, and relevant personalization state [C12](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c12)
- UTC timestamp, release or deployment marker, parser version, and extraction rules [C12](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c12)
- collection tool name and exact resolved version [C12](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c12) [P06](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#p06)
- observed access state for the surface's fetch agent when it can be determined, including any delivery-layer or bot-management block and the crawler class it applies to [C43](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c43)
- raw answer, raw citation URLs and context, final redirected URLs when checked, and execution status [C12](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c12) [C13](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c13)

Collect only account, personalization, location, prompt, and telemetry fields necessary for the declared comparison. Redact credentials, session tokens, personal prompt content, user identifiers, and unrelated query parameters before sharing artifacts; restrict access and define retention for unredacted evidence. Preserve a stable pseudonymous condition label when exact identity is unnecessary. [C35](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c35)

## Deterministic metrics

- Mention: an approved brand name or alias appears in the accepted answer. [C13](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c13)
- Citation: the canonical brand domain or an approved subdomain appears in an extracted URL. [C13](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c13)
- Supported brand claim: a cited destination fully or partially supports the generated statement about the brand under a versioned human-review rubric. For material reviews, record reviewer condition, disagreements, and adjudication; do not present reviewer agreement as objective truth. [C13](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c13) [C39](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c39)
- Source domain: a normalized hostname extracted from a full answer URL. [C13](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c13)
- Source ownership: brand-owned, independent, platform-owned, user-generated, or unknown under a versioned classification. [C18](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c18)
- Competitor mention: an approved competitor entity appears by deterministic matching. [C13](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c13)
- Execution status: accepted positive, accepted negative, abstention, blocked/ineligible, timeout, parser failure, or other technical failure. [C12](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c12)

Do not treat a third-party citation near a brand mention as a citation of the brand's domain. Do not add sentiment, answer rank, citation quality, claim support, source ownership, or semantic entity matching without a versioned rubric, examples, and a validation set. For consequential qualitative labels, use independent review when practical, retain disagreement as data, and record adjudication rather than silently overwriting the original judgments. Citation precision and recall are different properties; a fluent answer or present link does not prove support. [C13](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c13) [C39](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c39)

## Compatible comparison

Require the same ordered prompt corpus and prompt hash. Hold provider, product surface, search mode, access mode, account state, locale, and geography stable. Segment material model or product changes rather than silently joining them. Record sampling counts, abstentions, failures, timeouts, and parser version. A changed corpus starts a new baseline. [C01](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c01) [C12](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c12)

Do not pool public consumer products, APIs, native owner reports, or grounded simulations. A blended provider score can hide incompatible retrieval and citation behavior. [C01](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c01) [C11](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c11)

## Interpretation

Fewer than five observations per prompt/provider/surface cell is an integration smoke test, not evidence of stability. Always report numerator and denominator. Within a genuinely independent Bernoulli cell, use a Wilson or another justified binomial interval; avoid symmetric normal intervals for tiny samples or rates near zero or one. Repeats within prompts are clustered, so report prompt-level cells and use a prompt-cluster bootstrap or justified hierarchical model for corpus-wide uncertainty when the sample supports it. Do not treat every answer as independent. If prompts are the intended population rather than a random sample, describe the interval as run-to-run uncertainty for that corpus, not population generalization. [C14](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c14)

An owner's own reuse directive is likewise a condition, not a result. A page excluded from a generative surface by a directive such as Bing's `noarchive` is ineligible there by choice, so record it as ineligible for that surface and keep it out of any comparison that treats absence as weak visibility. [C49](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c49) [C23](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c23)

A retrieval block is an access condition, not a negative mention. When the surface's fetch agent is blocked at the delivery layer or by a bot-management rule, record that as the condition under test and keep the affected observations out of any absence-of-visibility conclusion. [C43](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c43) [C12](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c12)

Repeated observations reduce sampling noise but cannot remove product-surface, prompt, personalization, geographic, freshness, indexing, or model-version differences. Declare the observation window and do not infer causality from a before/after change without a suitable design and adequate deployment and recrawl lag. [C12](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c12) [C15](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c15)

## Evidence sources

Keep these evidence classes separate: [C11](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c11)

1. **Native owner telemetry:** Google Search Console's generative AI performance report, Bing Webmaster Tools AI Performance, verified referrals, and server logs. State rollout, aggregation, sampling, privacy, and attribution limits. [S07](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#s07) [S12](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#s12) [C10](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c10)
2. **Public-surface observation:** a recorded consumer product answer. This is point-in-time evidence for that surface and context. [C11](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c11)
3. **Controlled simulation:** an API or agent answer using a fixed evidence snapshot. This tests comprehension, not consumer-product visibility. [C11](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c11)
4. **Deterministic verification:** crawl, page, source, and parser properties. This establishes readiness or extraction correctness, not observed selection. [C04](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c04) [C11](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c11)

For Search Console exports, record every applied filter and keep chart totals separate from table rows. Summed rows are not a total, a filtered `match` and `does not match` pair is not a partition, and an absent query row is not evidence of zero impressions. [C54](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c54) [C10](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c10)

For Bing AI Performance exports, retain the selected date range, filters, property, dimension, comparison basis, and export time. Treat intents, topics, grouped grounding queries, citation share, and comparison views as aggregated owner telemetry rather than exact prompts or public-answer samples. [C10](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c10) [C36](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c36)

## Report contract

Report the evidence class and coverage first, then a compatibility table for every compared run, raw numerators and denominators with failures separated, uncertainty appropriate to the design, citation-support review results, source ownership, material limitations, and links or paths to redacted raw artifacts. End with `observed`, `inconclusive`, or `not comparable`; never silently convert missing access, failed runs, or incompatible conditions into zero visibility. [C11](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c11) [C12](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c12) [P07](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#p07)

## Citation verification

When claim support matters, open the final citation destination and judge the exact generated statement against the cited passage. Preserve the passage or property reviewed, access time, redirect chain, support label, and reviewer or rubric version. Do not assume the answer engine selected the original or canonical source. [C13](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c13)

For commerce observations, verify volatile price, currency, stock, variant, shipping, and return facts at the final merchant destination and timestamp the check. Record whether the answer used a public page, first-party feed, platform catalog, or third-party provider when known; do not treat those paths as interchangeable. [C27](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c27)

The distinction is grounded in the verifiability research, which defines citation recall and precision and found that apparent utility did not ensure complete or accurate support in the systems studied. Treat the result as evidence for verification practice, not a current scorecard for products that have since changed. [S17](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#s17) [C13](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c13)

## Statistical reference

NIST AI 800-3 explains why LLM evaluations must account for item variation and why small-sample or extreme-rate normal approximations can miscover. Predeclare prompt provenance, the corpus, unit, exclusions, independence or clustering assumptions, interval method, and stopping rule. Do not increase samples only until a favorable result appears. [S18](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#s18) [C14](https://github.com/aeokit-dev/aeo-skills/blob/v0.1.0/research/report-source.md#c14)
