import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { readFile, readdir } from 'node:fs/promises';

export const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const skillsRoot = path.join(packageRoot, 'skills');

export function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const value = (key) => match[1].match(new RegExp(`^${key}:\\s*["']?([^"'\\n]+)["']?\\s*$`, 'm'))?.[1]?.trim();
  return { name: value('name'), description: value('description') };
}

export async function catalog() {
  const entries = await readdir(skillsRoot, { withFileTypes: true });
  const skills = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const directory = path.join(skillsRoot, entry.name);
    const frontmatter = parseFrontmatter(await readFile(path.join(directory, 'SKILL.md'), 'utf8'));
    skills.push({ ...frontmatter, directory });
  }
  return skills.sort((a, b) => a.name.localeCompare(b.name));
}
