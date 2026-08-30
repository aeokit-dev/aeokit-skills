import { cp, mkdir, stat } from 'node:fs/promises';
import { homedir } from 'node:os';
import path from 'node:path';
import { catalog } from './catalog.js';

const targetAliases = Object.freeze({
  agents: 'agents',
  codex: 'agents',
  cursor: 'agents',
  copilot: 'agents',
  gemini: 'agents',
  claude: 'claude',
  agent: 'agent'
});

async function exists(file) {
  try { await stat(file); return true; } catch { return false; }
}

export function targetRoot({ to, scope, project = process.cwd(), userHome = homedir() }) {
  const target = Object.hasOwn(targetAliases, to) ? targetAliases[to] : undefined;
  if (!target) throw new Error('--to must be agents, codex, cursor, copilot, gemini, claude, or agent');
  if (!['project', 'user'].includes(scope)) throw new Error('--scope must be project or user');
  if (scope === 'project') {
    if (target === 'agents') return path.join(path.resolve(project), '.agents', 'skills');
    if (target === 'claude') return path.join(path.resolve(project), '.claude', 'skills');
    return path.join(path.resolve(project), '.aeokit', 'skills');
  }
  if (target === 'agents') return path.join(userHome, '.agents', 'skills');
  if (target === 'claude') return path.join(userHome, '.claude', 'skills');
  return path.join(userHome, '.aeokit', 'skills');
}

export async function installSkills(names, options) {
  const available = await catalog();
  const selected = names.includes('all') ? available : names.map((name) => {
    const skill = available.find((item) => item.name === name);
    if (!skill) throw new Error(`unknown skill '${name}'`);
    return skill;
  });
  if (!selected.length) throw new Error('name a skill or use --all');
  const root = targetRoot(options);
  const results = [];
  for (const skill of selected) {
    const destination = path.join(root, skill.name);
    const present = await exists(destination);
    if (present && !options.force) throw new Error(`${destination} already exists; pass --force to replace it`);
    results.push({ name: skill.name, destination, replaced: present, dryRun: Boolean(options.dryRun) });
    if (options.dryRun) continue;
    await mkdir(root, { recursive: true });
    await cp(skill.directory, destination, { recursive: true, force: Boolean(options.force) });
  }
  return results;
}
