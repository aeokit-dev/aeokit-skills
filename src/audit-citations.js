import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const researchFile = path.join(projectRoot, 'research', 'report-source.md');
const skillsRoot = path.join(projectRoot, 'skills');
const packageMetadata = JSON.parse(await readFile(path.join(projectRoot, 'package.json'), 'utf8'));

export const citationBase = `https://github.com/aeokit-dev/aeo-skills/blob/v${packageMetadata.version}/research/report-source.md#`;
const escapedCitationBase = citationBase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function relative(file) {
  return path.relative(projectRoot, file).split(path.sep).join('/');
}

async function instructionalFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await instructionalFiles(target));
      continue;
    }
    if (entry.name === 'SKILL.md' || (path.basename(directory) === 'references' && entry.name.endsWith('.md'))) {
      files.push(target);
    }
  }
  return files.sort();
}

function parseRegistry(report) {
  const errors = [];
  const entries = new Map();
  const entryPattern = /<a id="([csp]\d{2})"><\/a>\*\*([CSP]\d{2})\*\*/g;

  for (const match of report.matchAll(entryPattern)) {
    const [, anchor, label] = match;
    if (anchor !== label.toLowerCase()) errors.push(`research/report-source.md: registry label ${label} does not match #${anchor}`);
    if (entries.has(label)) errors.push(`research/report-source.md: duplicate registry ID ${label}`);
    entries.set(label, { anchor, label });
  }

  for (const prefix of ['C', 'S', 'P']) {
    const numbers = [...entries.keys()]
      .filter((id) => id.startsWith(prefix))
      .map((id) => Number(id.slice(1)))
      .sort((a, b) => a - b);
    if (!numbers.length) errors.push(`research/report-source.md: no ${prefix} registry entries found`);
    numbers.forEach((number, index) => {
      if (number !== index + 1) errors.push(`research/report-source.md: ${prefix} IDs must be sequential; expected ${prefix}${String(index + 1).padStart(2, '0')}`);
    });
  }

  const internalLinks = /\[([CSP]\d{2})\]\(#([csp]\d{2})\)/g;
  for (const match of report.matchAll(internalLinks)) {
    const [, label, anchor] = match;
    if (label.toLowerCase() !== anchor) errors.push(`research/report-source.md: ${label} links to mismatched #${anchor}`);
    if (!entries.has(label)) errors.push(`research/report-source.md: ${label} links to an unknown registry entry`);
  }

  const sourceUse = new Set();
  for (const line of report.split(/\r?\n/)) {
    const claim = line.match(/<a id="c\d{2}"><\/a>\*\*(C\d{2})\*\*/)?.[1];
    if (!claim) continue;
    const sources = [...line.matchAll(/\[(S\d{2})\]\(#s\d{2}\)/g)].map((match) => match[1]);
    if (!sources.length) errors.push(`research/report-source.md: ${claim} has no supporting source`);
    for (const source of sources) sourceUse.add(source);
  }

  for (const id of entries.keys()) {
    if (id.startsWith('S') && !sourceUse.has(id)) errors.push(`research/report-source.md: ${id} is not connected to a research claim`);
  }

  return { entries, errors };
}

export function auditInstructionMarkdown(content, filename, registryIds) {
  const errors = [];
  const usedIds = new Set();
  const lines = content.split(/\r?\n/);
  let substantiveLines = 0;
  let citationCount = 0;
  let inFrontmatter = lines[0]?.trim() === '---';
  let fence = null;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();
    const location = `${filename}:${index + 1}`;

    if (index === 0 && inFrontmatter) continue;
    if (inFrontmatter) {
      if (trimmed === '---') inFrontmatter = false;
      continue;
    }

    if (fence) {
      if (new RegExp(`^${fence.character}{${fence.length},}`).test(trimmed)) fence = null;
      continue;
    }

    const openingFence = trimmed.match(/^(`{3,}|~{3,})/);
    if (openingFence) {
      fence = { character: openingFence[1][0], length: openingFence[1].length };
      continue;
    }

    if (!trimmed || /^#{1,6}(?:\s|$)/.test(trimmed)) continue;
    substantiveLines += 1;

    let validCitation = false;
    const markers = [...line.matchAll(/\[([CSP]\d{2})\]/g)];
    for (const marker of markers) {
      const label = marker[1];
      const tail = line.slice(marker.index);
      const target = tail.match(new RegExp(`^\\[([CSP]\\d{2})\\]\\((${escapedCitationBase})([csp]\\d{2})\\)`));
      if (!target) {
        errors.push(`${location}: ${label} is not a complete canonical ledger link`);
        continue;
      }
      if (target[1] !== label || target[3] !== label.toLowerCase()) {
        errors.push(`${location}: ${label} links to mismatched #${target[3]}`);
        continue;
      }
      if (!registryIds.has(label)) {
        errors.push(`${location}: unknown citation ${label}`);
        continue;
      }
      validCitation = true;
      citationCount += 1;
      usedIds.add(label);
    }

    if (!validCitation) errors.push(`${location}: substantive instructional line has no valid C##, S##, or P## citation`);
  }

  if (inFrontmatter) errors.push(`${filename}: unclosed YAML frontmatter`);
  if (fence) errors.push(`${filename}: unclosed fenced code block`);

  return { citationCount, errors, filename, substantiveLines, usedIds };
}

export async function auditCitations() {
  const report = await readFile(researchFile, 'utf8');
  const registry = parseRegistry(report);
  const errors = [...registry.errors];
  const files = [];
  const usedInstructionIds = new Set();

  for (const file of await instructionalFiles(skillsRoot)) {
    const result = auditInstructionMarkdown(await readFile(file, 'utf8'), relative(file), new Set(registry.entries.keys()));
    files.push(result);
    errors.push(...result.errors);
    for (const id of result.usedIds) usedInstructionIds.add(id);
  }

  for (const id of registry.entries.keys()) {
    if ((id.startsWith('C') || id.startsWith('P')) && !usedInstructionIds.has(id)) {
      errors.push(`research/report-source.md: ${id} is not cited by any instructional line`);
    }
  }

  const ids = [...registry.entries.keys()];
  return {
    errors,
    files,
    registry: {
      claims: ids.filter((id) => id.startsWith('C')),
      policies: ids.filter((id) => id.startsWith('P')),
      sources: ids.filter((id) => id.startsWith('S'))
    },
    usedInstructionIds
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  auditCitations().then((result) => {
    if (result.errors.length) {
      console.error(result.errors.join('\n'));
      process.exitCode = 1;
      return;
    }

    const substantiveLines = result.files.reduce((sum, file) => sum + file.substantiveLines, 0);
    const citations = result.files.reduce((sum, file) => sum + file.citationCount, 0);
    console.log(`Citation audit passed: ${result.files.length} files, ${substantiveLines} substantive lines, ${citations} citations, ${result.registry.claims.length} claims, ${result.registry.sources.length} sources, ${result.registry.policies.length} policies.`);
    for (const file of result.files) console.log(`- ${file.filename}: ${file.substantiveLines} lines, ${file.citationCount} citations`);
  }).catch((error) => {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  });
}
