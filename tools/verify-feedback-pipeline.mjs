// Read a reviewed host checkout; no server, network or production credentials.
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fixture, all } from '../tests/helpers/app-fixture.mjs';
import { NOTICES } from '../dist/shared/measurement-feedback-client.mjs';
import { MEASUREMENT_CONFIG } from '../dist/measurement-config.js';

if (!process.argv[2]) throw new Error('Pass the reviewed host checkout directory');
const host = pathToFileURL(resolve(process.argv[2]) + '/');
const parity = {};
for (const name of ['measurement-contract.mjs', 'measurement-feedback-client.mjs']) {
  const source = readFileSync(new URL(`shared/${name}`, host));
  const copied = readFileSync(new URL(`../dist/shared/${name}`, import.meta.url));
  assert.deepEqual(copied, source, `${name} must match final host bytes`);
  parity[name] = createHash('sha256').update(source).digest('hex');
}
const { createLocalBackend } = await import(new URL('fixtures/measurement-feedback/local-backend.mjs', host));
const backend = createLocalBackend(); // Virtual HTTPS in memory, no listening socket.
assert.equal(MEASUREMENT_CONFIG.enabled, false);
const f = fixture({ enabled: true, allowed: true, fetchImpl: backend.fetch });
const nodes = all(f.el('measurement-feedback'));
const read = async path => (await backend.read(path)).json();
assert.equal((await backend.fetch('/api/triage/feedback')).status, 401);
f.el('demo').onclick();
assert.equal(f.dns.length, 0);
assert.equal(f.calls.length, 1, 'only opted-in page entry, no demo event');
f.el('purpose-dns').checked = true;
f.el('domain').value = 'studio.example';
await f.submit();
await Promise.all(f.pending);
const totals = await read('/api/triage/events');
for (const event of ['page_view', 'tool_start', 'tool_complete']) {
  assert.equal(totals.rows.find(row => row.product === 'maildns' && row.event === event)?.count, 1);
}
assert.ok(f.calls.every(call => Object.keys(call.body).sort().join(',') === 'event,product'));
nodes.find(el => el.textContent === NOTICES.en.open).listeners.click();
await Promise.all(f.pending);
assert.equal((await read('/api/triage/feedback')).rows.length, 0, 'opening never submits');
// Feedback works with counts off and requires the actual explicit form submit.
f.storage.setItem('arcdrake.analytics.v1', 'no');
const message = nodes.find(el => el.tag === 'textarea');
nodes.find(el => el.tag === 'select').value = 'usability';
message.value = 'Synthetic in-process report; no personal data.';
await nodes.find(el => el.tag === 'form').listeners.submit({ preventDefault() {} });
const rows = (await read('/api/triage/feedback')).rows;
assert.equal(rows.length, 1);
assert.equal(rows[0].product, 'maildns');
assert.equal(rows[0].message, 'Synthetic in-process report; no personal data.');
assert.equal(message.value, '', 'strict valid receipt resets form');
assert.ok(nodes.some(el => el.textContent === NOTICES.en.sent + rows[0].id));
const exported = JSON.parse(await (await backend.read('/api/triage/export?kind=feedback&limit=1')).text());
assert.equal(exported.id, rows[0].id);
await backend.read(`/api/triage/feedback/${rows[0].id}`, { method: 'DELETE' });
assert.equal((await read('/api/triage/feedback')).rows.length, 0);
backend.advanceDays(91);
await backend.read('/api/triage/retention', { method: 'POST' });
assert.deepEqual([...(await backend.inspect()).keys()], ['nextSweep']);
console.log(JSON.stringify({ status: 'PASS', network: 'none', packagedEnabled: MEASUREMENT_CONFIG.enabled,
  explicitlyEnabledFixture: true, parity, actualDnsActionCounts: totals.rows,
  explicitFeedbackReceiptReset: 'PASS', authenticatedExportDelete: 'PASS', retentionAfter91Days: 'PASS' }, null, 2));
