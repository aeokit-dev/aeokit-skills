import { catalog } from './catalog.js';
import { installSkills, targetRoot } from './install.js';
import { validateSkills } from './validate.js';

const version = '0.1.1';

function parse(argv) {
  const [command = 'help', ...rest] = argv;
  const positional = [];
  const flags = {};
  for (let index = 0; index < rest.length; index++) {
    const token = rest[index];
    if (!token.startsWith('--')) positional.push(token);
    else {
      const [key, inline] = token.slice(2).split('=', 2);
      flags[key] = inline ?? (rest[index + 1] && !rest[index + 1].startsWith('--') ? rest[++index] : true);
    }
  }
  return { command, positional, flags };
}

function help() {
  console.log(`AEO Skills ${version} by aeokit\n\nUsage:\n  aeokit-skills list [--json]\n  aeokit-skills add <skill> --to agents|claude|agent [--scope project|user]\n  aeokit-skills add --all --to agents|claude|agent [--dry-run] [--force]\n  aeokit-skills doctor\n\nProject locations:\n  Shared agents  .agents/skills/  (Codex, Cursor, Copilot, Gemini)\n  Claude Code    .claude/skills/\n  AEO Agent      .aeokit/skills/\n\nAliases codex, cursor, copilot, and gemini resolve to the shared agents location. User locations use the corresponding directory under the user's home. Existing skills are never replaced unless --force is explicit.`);
}

export async function main(argv) {
  if (!argv.length || argv[0] === '--help' || argv[0] === '-h') return help();
  if (argv[0] === '--version' || argv[0] === '-V') return console.log(version);
  const { command, positional, flags } = parse(argv);
  if (command === 'help' || flags.help) return help();
  if (command === 'list') {
    const skills = (await catalog()).map(({ directory, ...skill }) => skill);
    if (flags.json) console.log(JSON.stringify(skills, null, 2));
    else skills.forEach((skill) => console.log(`${skill.name.padEnd(16)} ${skill.description}`));
    return;
  }
  if (command === 'add') {
    const names = flags.all ? ['all'] : positional;
    const options = {
      to: flags.to,
      scope: flags.scope || 'project',
      project: flags.project || process.cwd(),
      force: Boolean(flags.force),
      dryRun: Boolean(flags['dry-run'])
    };
    const results = await installSkills(names, options);
    if (flags.json) console.log(JSON.stringify(results, null, 2));
    else results.forEach((result) => console.log(`${result.dryRun ? 'Would install' : result.replaced ? 'Replaced' : 'Installed'} ${result.name}\n  ${result.destination}`));
    return;
  }
  if (command === 'doctor') {
    await validateSkills();
    const locations = ['agents', 'claude', 'agent'].map((to) => ({ to, project: targetRoot({ to, scope: 'project' }), user: targetRoot({ to, scope: 'user' }) }));
    if (flags.json) console.log(JSON.stringify({ valid: true, locations }, null, 2));
    else {
      console.log('Bundled skills valid');
      locations.forEach((item) => console.log(`${item.to.padEnd(7)} project ${item.project}\n        user    ${item.user}`));
    }
    return;
  }
  throw new Error(`unknown command '${command}'`);
}
