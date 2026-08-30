import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { validateSkillDirectory, validateSkills } from '../src/validate.js';

test('all bundled skills have valid metadata and references', async () => {
  await validateSkills();
});

async function fixture(metadata) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'aeo-skill-'));
  const directory = path.join(root, 'demo-skill');
  await mkdir(path.join(directory, 'agents'), { recursive: true });
  await writeFile(path.join(directory, 'SKILL.md'), '---\nname: demo-skill\ndescription: Demonstrate validation.\n---\n\n# Demo\n');
  await writeFile(path.join(directory, 'agents', 'openai.yaml'), metadata);
  return directory;
}

test('metadata validator rejects malformed YAML', async () => {
  const directory = await fixture('interface: [\n');
  assert.match((await validateSkillDirectory(directory)).join('\n'), /invalid agents\/openai\.yaml/);
});

test('metadata validator enforces interface strings and skill prompt', async () => {
  const directory = await fixture(`interface:\n  display_name: Demo\n  short_description: "Too short"\n  default_prompt: "Run this skill."\n`);
  const failures = (await validateSkillDirectory(directory)).join('\n');
  assert.match(failures, /string values must be quoted \(display_name\)/);
  assert.match(failures, /short_description must be 25-64 characters/);
  assert.match(failures, /default_prompt must mention \$demo-skill/);
});

test('metadata validator checks icon paths and policy types', async () => {
  const directory = await fixture(`interface:\n  display_name: "Demo Skill"\n  short_description: "Demonstrate complete skill metadata"\n  default_prompt: "Use $demo-skill to demonstrate validation."\n  icon_small: "./assets/missing.png"\npolicy:\n  allow_implicit_invocation: "yes"\n`);
  const failures = (await validateSkillDirectory(directory)).join('\n');
  assert.match(failures, /icon_small must reference an existing file/);
  assert.match(failures, /allow_implicit_invocation must be boolean/);
});
