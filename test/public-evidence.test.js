import assert from 'node:assert/strict';
import { once } from 'node:events';
import http from 'node:http';
import test from 'node:test';
import { collect } from '../skills/aeo-audit/scripts/collect-public-evidence.mjs';

test('public evidence collector stays bounded and labels its limits', async (context) => {
  const requests = [];
  const server = http.createServer((request, response) => {
    requests.push(request.url);
    if (request.url === '/robots.txt') {
      response.writeHead(200, { 'content-type': 'text/plain' });
      response.end('User-agent: *\nAllow: /\n');
      return;
    }
    if (request.url === '/sitemap.xml') {
      response.writeHead(200, { 'content-type': 'application/xml' });
      response.end('<?xml version="1.0"?><urlset></urlset>');
      return;
    }
    if (request.url?.startsWith('/__aeokit-missing-')) {
      response.writeHead(404, { 'content-type': 'text/html' });
      response.end('<title>Not found</title>');
      return;
    }
    response.writeHead(200, { 'content-type': 'text/html', 'x-robots-tag': 'index, follow' });
    response.end('<title>Example</title><link rel="canonical" href="/"><main>Useful answer</main>');
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  context.after(() => server.close());

  const address = server.address();
  const origin = `http://127.0.0.1:${address.port}`;
  const result = await collect({ target: origin, pages: [`${origin}/product`], timeoutMs: 2_000 });

  assert.equal(result.coverage, 'sampled');
  assert.equal(result.observations.length, 5);
  assert.equal(requests.length, 5);
  assert.ok(result.limitations.some((item) => item.includes('JavaScript rendering')));
  assert.ok(result.observations.every((item) => item.crawlerIdentity.includes('not verified crawler')));
  assert.equal(result.observations[0].html.title, 'Example');
  assert.equal(result.observations[0].html.hasMain, true);
  assert.equal(result.observations.at(-1).status, 404);
});

test('public evidence collector rejects cross-origin representative pages', async () => {
  await assert.rejects(
    collect({ target: 'https://example.com', pages: ['https://other.example/page'] }),
    /Representative page must use https:\/\/example\.com/
  );
});
