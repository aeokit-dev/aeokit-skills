import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function json(relativePath) {
  return JSON.parse(await readFile(new URL(relativePath, root), 'utf8'));
}

test('ships matching Codex and Claude plugin identities', async () => {
  const [codex, claude, pkg] = await Promise.all([
    json('.codex-plugin/plugin.json'),
    json('.claude-plugin/plugin.json'),
    json('package.json')
  ]);

  assert.equal(codex.name, 'aeokit');
  assert.equal(claude.name, codex.name);
  assert.equal(codex.version, pkg.version);
  assert.equal(claude.version, pkg.version);
  assert.equal(codex.skills, './skills/');
  assert.ok(pkg.files.includes('.codex-plugin'));
  assert.ok(pkg.files.includes('.claude-plugin'));
});

test('Codex plugin skill path resolves to every bundled skill', async () => {
  const [codex, skills] = await Promise.all([
    json('.codex-plugin/plugin.json'),
    import('../src/catalog.js').then(({ catalog }) => catalog())
  ]);
  const skillsRoot = new URL(codex.skills, root);

  assert.ok(skills.length > 0);
  for (const skill of skills) {
    await access(new URL(`${skill.name}/SKILL.md`, skillsRoot));
  }
});
