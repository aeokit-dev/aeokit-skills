import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const primarySources = [
  'https://developers.google.com/search/docs/fundamentals/ai-optimization-guide',
  'https://support.google.com/webmasters/answer/16984139?hl=en',
  'https://developers.openai.com/api/docs/bots',
  'https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler',
  'https://docs.perplexity.ai/docs/resources/perplexity-crawlers',
  'https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview',
  'https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls',
  'https://genai.owasp.org/llmrisk/llm01-prompt-injection/',
  'https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics',
  'https://developers.google.com/search/docs/appearance/structured-data/paywalled-content',
  'https://help.openai.com/en/articles/11128490-shopping-with-chatgpt-search',
  'https://developers.google.com/crawling/docs/crawlers-fetchers/verify-google-requests',
  'https://support.google.com/webmasters/answer/9012289?hl=en',
  'https://developers.google.com/search/docs/essentials/spam-policies',
  'https://developers.google.com/search/docs/crawling-indexing/links-crawlable',
  'https://developers.google.com/crawling/docs/crawl-budget',
  'https://doi.org/10.6028/NIST.CSWP.10',
  'https://doi.org/10.1145/3637528.3671900',
  'https://doi.org/10.6028/NIST.AI.800-3',
  'https://blog.cloudflare.com/content-independence-day-ai-options/',
  'https://blog.cloudflare.com/content-signals-policy/',
  'https://datatracker.ietf.org/doc/draft-ietf-aipref-vocab/',
  'https://datatracker.ietf.org/doc/draft-ietf-aipref-attach/',
  'https://developers.google.com/search/docs/appearance/structured-data/organization',
  'https://support.google.com/knowledgepanel/answer/9787176?hl=en',
  'https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec',
  'https://www.sitemaps.org/protocol.html',
  'https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap',
  'https://blogs.bing.com/webmaster/september-2023/Announcing-new-options-for-webmasters-to-control-usage-of-their-content-in-Bing-Chat',
  'https://llmstxt.org/',
  'https://developer.chrome.com/docs/lighthouse/agentic-browsing/scoring',
  'https://blog.google/products-and-platforms/products/search/overview-our-rater-guidelines-search/',
  'https://support.google.com/webmasters/answer/17010575?hl=en',
  'https://developers.google.com/search/docs/appearance/structured-data/faqpage',
  'https://developers.google.com/search/docs/appearance/structured-data/search-gallery',
  'https://webmachinelearning.github.io/webmcp/',
  'https://developer.chrome.com/docs/ai/webmcp/secure-tools',
  'https://developers.openai.com/commerce/guides/key-concepts',
  'https://datatracker.ietf.org/doc/draft-meunier-webbotauth-httpsig-protocol/',
  'https://developers.cloudflare.com/bots/reference/bot-verification/web-bot-auth/',
  'https://ap2-protocol.org/',
  'https://rslstandard.org/rsl',
  'https://developers.google.com/crawling/docs/troubleshooting/http-status-codes',
  'https://developers.google.com/crawling/docs/crawlers-fetchers/overview-google-crawlers'
];

test('research report records its scope, date, primary sources, and skill implications', async () => {
  const report = await readFile(new URL('../research/report-source.md', import.meta.url), 'utf8');
  assert.match(report, /Research date:\*\* 2026-08-29/);
  assert.match(report, /## What remains unknown or disputed/);
  assert.match(report, /## Changes this review requires in the skills/);
  assert.match(report, /## Citation and traceability registry/);
  for (const source of primarySources) assert.ok(report.includes(source), `missing primary source ${source}`);
  for (const skill of ['aeo-audit', 'aeo-improve', 'aeo-observe']) assert.match(report, new RegExp(`\`${skill}\``));
});

test('README links the packaged research report', async () => {
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  assert.match(readme, /\[source-backed AEO evidence review\]\(research\/report-source\.md\)/);
  assert.match(readme, /\[Open the numbered research claim and source ledger\]\(research\/report-source\.md#citation-and-traceability-registry\)/);
});
