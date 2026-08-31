import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { installSkills, targetRoot } from '../src/install.js';

test('maps shared host aliases and dedicated hosts to supported locations', () => {
  for (const to of ['agents', 'codex', 'cursor', 'copilot', 'gemini']) {
    assert.equal(targetRoot({ to, scope: 'project', project: '/tmp/project' }), '/tmp/project/.agents/skills');
    assert.equal(targetRoot({ to, scope: 'user', userHome: '/tmp/user' }), '/tmp/user/.agents/skills');
  }
  assert.equal(targetRoot({ to: 'claude', scope: 'project', project: '/tmp/project' }), '/tmp/project/.claude/skills');
  assert.equal(targetRoot({ to: 'agent', scope: 'project', project: '/tmp/project' }), '/tmp/project/.aeokit/skills');
  assert.throws(() => targetRoot({ to: 'toString', scope: 'project' }), /--to must be/);
});

test('installs the same complete skill through every supported target', async () => {
  const source = await readFile(new URL('../skills/aeo-audit/SKILL.md', import.meta.url), 'utf8');
  for (const to of ['agents', 'codex', 'cursor', 'copilot', 'gemini', 'claude', 'agent']) {
    const project = await mkdtemp(path.join(tmpdir(), `aeokit-${to}-install-`));
    const [result] = await installSkills(['aeo-audit'], { to, scope: 'project', project });
    const installed = await readFile(path.join(result.destination, 'SKILL.md'), 'utf8');
    const apiWorkflow = await readFile(path.join(result.destination, 'api', 'aeokit.md'), 'utf8');
    const openaiMetadata = await readFile(path.join(result.destination, 'agents', 'openai.yaml'), 'utf8');
    assert.equal(installed, source, `${to} installation rewrote SKILL.md`);
    assert.match(apiWorkflow, /# AeoKit API workflow/);
    assert.match(openaiMetadata, /display_name: "AEO Audit"/);
  }
});

test('refuses to overwrite an installed skill without force', async () => {
  const project = await mkdtemp(path.join(tmpdir(), 'aeokit-skill-refuse-'));
  await installSkills(['aeo-observe'], { to: 'claude', scope: 'project', project });
  await assert.rejects(() => installSkills(['aeo-observe'], { to: 'claude', scope: 'project', project }), /already exists/);
});
