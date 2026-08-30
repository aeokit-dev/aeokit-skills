#!/usr/bin/env node

import process from 'node:process';

const HELP = `Usage: collect-public-evidence.mjs <url> [--page <url>]... [--timeout <ms>]

Collects bounded public HTTP evidence for an AEO audit and prints JSON to stdout.
It fetches the supplied URL, same-origin representative pages, robots.txt,
sitemap.xml, and one generated missing URL. It does not render JavaScript or
authenticate crawler identity.`;

function parseArgs(argv) {
  const args = [...argv];
  if (args.includes('--help') || args.includes('-h')) return { help: true };
  const target = args.shift();
  if (!target) throw new Error('A target URL is required. Use --help for usage.');
  const pages = [];
  let timeoutMs = 15_000;
  while (args.length) {
    const flag = args.shift();
    if (flag === '--page') {
      const value = args.shift();
      if (!value) throw new Error('--page requires a URL.');
      pages.push(value);
    } else if (flag === '--timeout') {
      const value = Number(args.shift());
      if (!Number.isInteger(value) || value < 1_000 || value > 60_000) {
        throw new Error('--timeout must be an integer from 1000 to 60000.');
      }
      timeoutMs = value;
    } else {
      throw new Error(`Unknown argument: ${flag}`);
    }
  }
  return { target, pages, timeoutMs };
}

function normalizeUrl(value, base) {
  const url = new URL(value, base);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error(`Unsupported URL protocol: ${url.protocol}`);
  url.hash = '';
  return url;
}

function unique(values) {
  return [...new Map(values.map((value) => [value.href, value])).values()];
}

function firstMatch(source, pattern) {
  return source.match(pattern)?.[1]?.trim() || null;
}

function inspectHtml(body) {
  const jsonLd = [...body.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  return {
    title: firstMatch(body, /<title\b[^>]*>([\s\S]*?)<\/title>/i),
    canonical: firstMatch(body, /<link\b[^>]*rel=["'][^"']*canonical[^"']*["'][^>]*href=["']([^"']+)["'][^>]*>/i)
      || firstMatch(body, /<link\b[^>]*href=["']([^"']+)["'][^>]*rel=["'][^"']*canonical[^"']*["'][^>]*>/i),
    metaRobots: firstMatch(body, /<meta\b[^>]*name=["']robots["'][^>]*content=["']([^"']*)["'][^>]*>/i)
      || firstMatch(body, /<meta\b[^>]*content=["']([^"']*)["'][^>]*name=["']robots["'][^>]*>/i),
    jsonLdBlocks: jsonLd.length,
    hasMain: /<main\b/i.test(body),
    bodyBytesCaptured: Buffer.byteLength(body)
  };
}

async function fetchEvidence(url, timeoutMs) {
  const startedAt = new Date().toISOString();
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(timeoutMs),
      headers: { 'user-agent': 'AeoKit-Public-Evidence/1.0' }
    });
    const body = await response.text();
    const contentType = response.headers.get('content-type') || '';
    return {
      requestedUrl: url.href,
      finalUrl: response.url,
      retrievedAt: startedAt,
      method: 'raw HTTP',
      authentication: 'none',
      crawlerIdentity: 'ordinary declared user-agent; not verified crawler traffic',
      status: response.status,
      contentType,
      headers: {
        cacheControl: response.headers.get('cache-control'),
        contentLanguage: response.headers.get('content-language'),
        contentLength: response.headers.get('content-length'),
        location: response.headers.get('location'),
        server: response.headers.get('server'),
        xRobotsTag: response.headers.get('x-robots-tag')
      },
      html: contentType.includes('text/html') ? inspectHtml(body) : null,
      bodyPreview: body.slice(0, 2_000)
    };
  } catch (error) {
    return {
      requestedUrl: url.href,
      retrievedAt: startedAt,
      method: 'raw HTTP',
      authentication: 'none',
      crawlerIdentity: 'ordinary declared user-agent; not verified crawler traffic',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

export async function collect({ target, pages = [], timeoutMs = 15_000 }) {
  const root = normalizeUrl(target);
  const origin = root.origin;
  const requestedPages = pages.map((page) => normalizeUrl(page, root));
  for (const page of requestedPages) {
    if (page.origin !== origin) throw new Error(`Representative page must use ${origin}: ${page.href}`);
  }
  const missing = new URL(`/__aeokit-missing-${Date.now().toString(36)}`, origin);
  const urls = unique([
    root,
    ...requestedPages,
    new URL('/robots.txt', origin),
    new URL('/sitemap.xml', origin),
    missing
  ]);
  const observations = [];
  for (const url of urls) observations.push(await fetchEvidence(url, timeoutMs));
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    target: root.href,
    coverage: 'sampled',
    limitations: [
      'Raw public HTTP only; JavaScript rendering was not tested.',
      'Requests were not authenticated as any named crawler.',
      'Indexing, selection, citation, traffic, and conversion were not observed.'
    ],
    observations
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(`${HELP}\n`);
    return;
  }
  process.stdout.write(`${JSON.stringify(await collect(options), null, 2)}\n`);
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
