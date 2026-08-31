import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { syncApiExport, validateApiExport } from '../src/sync-api-export.js';

async function fixture() {
  const root = await mkdtemp(path.join(tmpdir(), 'aeokit-api-export-'));
  const source = path.join(root, 'source');
  const pkg = path.join(root, 'package');
  await mkdir(source, { recursive: true });
  await mkdir(path.join(pkg, 'skills'), { recursive: true });
  await writeFile(path.join(source, 'audit.md'), '# AeoKit API workflow\n');
  await writeFile(path.join(source, 'manifest.json'), JSON.stringify({
    schemaVersion: 1,
    apiVersion: '1.2.3',
    files: [{
      source: 'audit.md',
      destination: 'skills/aeo-audit/api/aeokit.md',
      operations: ['GET /api/projects']
    }]
  }));
  return { source, pkg };
}

test('syncs the AeoKit-owned API workflow and records a verifiable lock', async () => {
  const { source, pkg } = await fixture();
  const lock = await syncApiExport(source, { packageRoot: pkg });

  assert.equal(lock.apiVersion, '1.2.3');
  assert.equal(await readFile(path.join(pkg, lock.files[0].destination), 'utf8'), '# AeoKit API workflow\n');
  await validateApiExport({ packageRoot: pkg });
});

test('detects a bundled API workflow changed outside the AeoKit export', async () => {
  const { source, pkg } = await fixture();
  const lock = await syncApiExport(source, { packageRoot: pkg });
  await writeFile(path.join(pkg, lock.files[0].destination), 'stale or edited\n');

  await assert.rejects(() => validateApiExport({ packageRoot: pkg }), /differs from the AeoKit API export lock/);
});

test('refuses exports outside the three bounded API workflow destinations', async () => {
  const { source, pkg } = await fixture();
  const manifest = JSON.parse(await readFile(path.join(source, 'manifest.json'), 'utf8'));
  manifest.files[0].destination = '../README.md';
  await writeFile(path.join(source, 'manifest.json'), JSON.stringify(manifest));

  await assert.rejects(() => syncApiExport(source, { packageRoot: pkg }), /unsupported AeoKit API export destination/);
});
