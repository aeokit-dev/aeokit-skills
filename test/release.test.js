import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { parse } from 'yaml';

const root = new URL('../', import.meta.url);

test('release workflow publishes only a Release Please version', async () => {
  const workflow = parse(await readFile(new URL('.github/workflows/release.yml', root), 'utf8'));
  const manifest = JSON.parse(await readFile(new URL('.release-please-manifest.json', root), 'utf8'));
  const config = JSON.parse(await readFile(new URL('release-please-config.json', root), 'utf8'));
  const pkg = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
  const publish = workflow.jobs.publish;

  assert.deepEqual(workflow.on.push.branches, ['main']);
  assert.match(workflow.jobs.release.if, /RELEASE_AUTOMATION_ENABLED/);
  assert.equal(workflow.jobs.release.steps[0].uses, 'googleapis/release-please-action@v5');
  assert.match(publish.if, /release_created/);
  assert.equal(publish.environment, 'npm');
  assert.equal(publish.permissions['id-token'], 'write');
  assert.equal(publish.permissions.contents, 'read');
  assert.ok(publish.steps.some((step) => step.run === 'npm publish --provenance --access public'));
  assert.equal(manifest['.'], pkg.version);
  assert.deepEqual(
    config.packages['.']['extra-files'].map((file) => file.path),
    ['.codex-plugin/plugin.json', '.claude-plugin/plugin.json', '.claude-plugin/marketplace.json', 'src/cli.js']
  );
});

test('CI runs the complete package check for pushes and pull requests', async () => {
  const workflow = parse(await readFile(new URL('.github/workflows/ci.yml', root), 'utf8'));

  assert.deepEqual(workflow.on.push.branches, ['main']);
  assert.ok(Object.hasOwn(workflow.on, 'pull_request'));
  assert.ok(workflow.jobs.test.steps.some((step) => step.run === 'npm run check'));
});
