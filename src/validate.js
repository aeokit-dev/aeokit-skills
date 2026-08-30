import { fileURLToPath } from 'node:url';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { parseDocument } from 'yaml';
import { catalog, parseFrontmatter } from './catalog.js';

const quotedString = /^\s*(?:-\s+)?[a-z_]+:\s*(["']).*\1\s*$/;

async function exists(file) {
  try { await stat(file); return true; } catch { return false; }
}

export async function validateSkillDirectory(directory) {
  const failures = [];
  const file = path.join(directory, 'SKILL.md');
  const content = await readFile(file, 'utf8');
  const frontmatter = parseFrontmatter(content);
  const skillName = frontmatter?.name;
  if (!skillName || !frontmatter?.description) failures.push(`${directory}: missing name or description`);
  if (skillName !== path.basename(directory)) failures.push(`${directory}: folder and skill name differ`);
  if (!/^[a-z0-9-]{1,64}$/.test(skillName || '')) failures.push(`${directory}: invalid skill name`);
  if (/\[TODO:|placeholder/i.test(content)) failures.push(`${directory}: unfinished scaffold text`);

  const references = [...content.matchAll(/\]\((references\/[^)]+)\)/g)].map((match) => match[1]);
  for (const reference of references) {
    if (!await exists(path.join(directory, reference))) failures.push(`${directory}: missing ${reference}`);
  }

  const metadataFile = path.join(directory, 'agents', 'openai.yaml');
  if (!await exists(metadataFile)) {
    failures.push(`${directory}: missing agents/openai.yaml`);
    return failures;
  }

  const metadataSource = await readFile(metadataFile, 'utf8');
  const document = parseDocument(metadataSource);
  if (document.errors.length) {
    failures.push(`${directory}: invalid agents/openai.yaml: ${document.errors[0].message.split('\n')[0]}`);
    return failures;
  }
  const metadata = document.toJS();
  if (!metadata?.interface || typeof metadata.interface !== 'object' || Array.isArray(metadata.interface)) {
    failures.push(`${directory}: agents/openai.yaml missing interface mapping`);
    return failures;
  }

  const { display_name: displayName, short_description: shortDescription, default_prompt: defaultPrompt } = metadata.interface;
  if (typeof displayName !== 'string' || !displayName.trim()) failures.push(`${directory}: interface.display_name must be a non-empty string`);
  if (typeof shortDescription !== 'string' || shortDescription.length < 25 || shortDescription.length > 64) {
    failures.push(`${directory}: interface.short_description must be 25-64 characters`);
  }
  if (typeof defaultPrompt !== 'string' || !defaultPrompt.includes(`$${skillName}`)) {
    failures.push(`${directory}: interface.default_prompt must mention $${skillName}`);
  }

  for (const line of metadataSource.split('\n')) {
    const match = line.match(/^\s*(?:-\s+)?([a-z_]+):\s*(.*?)\s*$/);
    if (!match || !match[2] || ['true', 'false'].includes(match[2])) continue;
    if (!quotedString.test(line)) failures.push(`${directory}: agents/openai.yaml string values must be quoted (${match[1]})`);
  }

  for (const field of ['icon_small', 'icon_large']) {
    const icon = metadata.interface[field];
    if (icon !== undefined && (typeof icon !== 'string' || !await exists(path.resolve(directory, icon)))) {
      failures.push(`${directory}: interface.${field} must reference an existing file`);
    }
  }
  if (metadata.policy?.allow_implicit_invocation !== undefined && typeof metadata.policy.allow_implicit_invocation !== 'boolean') {
    failures.push(`${directory}: policy.allow_implicit_invocation must be boolean`);
  }
  if (metadata.dependencies?.tools !== undefined) {
    if (!Array.isArray(metadata.dependencies.tools)) failures.push(`${directory}: dependencies.tools must be a list`);
    else for (const tool of metadata.dependencies.tools) {
      if (tool?.type !== 'mcp' || !['value', 'description', 'transport', 'url'].every((key) => typeof tool[key] === 'string' && tool[key])) {
        failures.push(`${directory}: each dependency tool must be a complete MCP dependency`);
      }
    }
  }
  return failures;
}

export async function validateSkills() {
  const failures = [];
  for (const skill of await catalog()) {
    failures.push(...await validateSkillDirectory(skill.directory));
  }
  if (failures.length) throw new Error(failures.join('\n'));
  return true;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  validateSkills().then(() => console.log('All skills are valid.')).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
