import assert from 'node:assert/strict';
import test from 'node:test';
import { auditCitations, auditInstructionMarkdown, citationBase } from '../src/audit-citations.js';

test('every instructional line is connected to the numbered research ledger', async () => {
  const result = await auditCitations();
  assert.deepEqual(result.errors, []);
  assert.equal(result.files.length, 9);
  assert.equal(result.registry.claims.length, 63);
  assert.equal(result.registry.sources.length, 76);
  assert.equal(result.registry.policies.length, 7);
  assert.ok(result.files.every((file) => file.substantiveLines > 0));
  assert.ok(result.files.every((file) => file.citationCount >= file.substantiveLines));
});

test('citation auditor rejects uncited, malformed, and unknown references', () => {
  const known = new Set(['C01']);
  const content = [
    '# Example',
    'This line has no citation.',
    'This one is malformed. [C01](#c01)',
    `This one is unknown. [C02](${citationBase}c02)`
  ].join('\n');
  const result = auditInstructionMarkdown(content, 'example.md', known);

  assert.equal(result.substantiveLines, 3);
  assert.equal(result.citationCount, 0);
  assert.ok(result.errors.some((error) => error.includes('no valid C##, S##, or P## citation')));
  assert.ok(result.errors.some((error) => error.includes('not a complete canonical ledger link')));
  assert.ok(result.errors.some((error) => error.includes('unknown citation C02')));
});

test('citation base is pinned to a versioned research ledger tag', () => {
  assert.match(citationBase, /\/blob\/v\d+\.\d+\.\d+\/research\/report-source\.md#$/);
  assert.doesNotMatch(citationBase, /\/blob\/main\//);
});
