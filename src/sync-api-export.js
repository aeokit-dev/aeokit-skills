import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { copyFile, mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { packageRoot as defaultPackageRoot } from './catalog.js';

const lockRelativePath = path.join('skills', '.aeokit-api.lock.json');
const destinationPattern = /^skills\/(aeo-audit|aeo-improve|aeo-observe)\/api\/aeokit\.md$/;

function posix(value) {
  return value.split(path.sep).join('/');
}

function digest(content) {
  return createHash('sha256').update(content).digest('hex');
}

function safeFile(root, relative, label) {
  if (path.isAbsolute(relative) || relative.split(/[\\/]/).includes('..')) {
    throw new Error(`${label} must be a relative path without '..'`);
  }
  return path.join(root, relative);
}

async function loadManifest(sourceRoot) {
  const manifest = JSON.parse(await readFile(path.join(sourceRoot, 'manifest.json'), 'utf8'));
  if (manifest.schemaVersion !== 1) throw new Error('unsupported AeoKit API export schema');
  if (typeof manifest.apiVersion !== 'string' || !manifest.apiVersion) throw new Error('AeoKit API export is missing apiVersion');
  if (!Array.isArray(manifest.files) || !manifest.files.length) throw new Error('AeoKit API export has no files');
  for (const file of manifest.files) {
    if (typeof file.source !== 'string') throw new Error('AeoKit API export file is missing source');
    if (typeof file.destination !== 'string' || !destinationPattern.test(file.destination)) {
      throw new Error(`unsupported AeoKit API export destination '${file.destination}'`);
    }
  }
  return manifest;
}

export async function syncApiExport(sourceRoot, { packageRoot = defaultPackageRoot } = {}) {
  const resolvedSource = path.resolve(sourceRoot);
  const manifest = await loadManifest(resolvedSource);
  const lockFile = path.join(packageRoot, lockRelativePath);
  let previous = null;
  try { previous = JSON.parse(await readFile(lockFile, 'utf8')); } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  const files = [];
  for (const entry of manifest.files) {
    const source = safeFile(resolvedSource, entry.source, 'source');
    const destination = safeFile(packageRoot, entry.destination, 'destination');
    const content = await readFile(source);
    await mkdir(path.dirname(destination), { recursive: true });
    await copyFile(source, destination);
    files.push({ source: posix(entry.source), destination: posix(entry.destination), sha256: digest(content) });
  }

  const currentDestinations = new Set(files.map((file) => file.destination));
  for (const stale of previous?.files ?? []) {
    if (!destinationPattern.test(stale.destination) || currentDestinations.has(stale.destination)) continue;
    try { await unlink(safeFile(packageRoot, stale.destination, 'stale destination')); } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }

  const lock = {
    schemaVersion: 1,
    sourceRepository: 'https://github.com/aeokit-dev/aeokit',
    apiVersion: manifest.apiVersion,
    files: files.sort((a, b) => a.destination.localeCompare(b.destination))
  };
  await writeFile(lockFile, `${JSON.stringify(lock, null, 2)}\n`);
  return lock;
}

export async function validateApiExport({ packageRoot = defaultPackageRoot } = {}) {
  const lockFile = path.join(packageRoot, lockRelativePath);
  const lock = JSON.parse(await readFile(lockFile, 'utf8'));
  if (lock.schemaVersion !== 1 || !Array.isArray(lock.files) || !lock.files.length) {
    throw new Error('invalid bundled AeoKit API export lock');
  }
  for (const file of lock.files) {
    if (!destinationPattern.test(file.destination)) throw new Error(`invalid bundled API destination '${file.destination}'`);
    const content = await readFile(safeFile(packageRoot, file.destination, 'destination'));
    if (digest(content) !== file.sha256) throw new Error(`${file.destination}: differs from the AeoKit API export lock`);
  }
  return true;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const sourceRoot = process.argv[2];
  if (!sourceRoot) {
    console.error('Usage: node src/sync-api-export.js <aeokit-repo>/agent-skills/api-export');
    process.exitCode = 1;
  } else {
    syncApiExport(sourceRoot).then((lock) => {
      console.log(`Synced ${lock.files.length} AeoKit API workflow files for API ${lock.apiVersion}.`);
    }).catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
  }
}
