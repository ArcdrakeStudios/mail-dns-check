import test from 'node:test';
import assert from 'node:assert/strict';
import * as core from '../dist/core.js';
import { runDnsInspection } from '../dist/measurement.js';
import { CHOICE_KEY, NOTICES } from '../dist/shared/measurement-feedback-client.mjs';
import { fixture, all } from './helpers/app-fixture.mjs';
import { MEASUREMENT_CONFIG } from '../dist/measurement-config.js';
const usable = () => ({ Status: 0, Answer: [] });

test('packaged configuration disables every intake flow, even with stored consent and explicit feedback', async () => {
  assert.equal(MEASUREMENT_CONFIG.enabled, false);
  const f = fixture({ allowed: true, enabled: MEASUREMENT_CONFIG.enabled });
  const nodes = all(f.el('measurement-feedback'));
  assert.equal(nodes.find(el => el.textContent === NOTICES.en.allow).disabled, true);
  f.el('demo').onclick();
  f.el('purpose-dns').checked = true;
  f.el('domain').value = 'studio.example';
  await f.submit();
  assert.equal(f.dns.length, 3);
  nodes.find(el => el.textContent === NOTICES.en.open).listeners.click();
  nodes.find(el => el.tag === 'select').value = 'other';
  nodes.find(el => el.tag === 'textarea').value = 'Synthetic draft';
  await nodes.find(el => el.tag === 'form').listeners.submit({ preventDefault() {} });
  nodes.find(el => el.textContent === NOTICES.en.deny).listeners.click();
  f.events.storage();
  assert.equal(f.calls.length, 0);
  assert.equal(nodes.find(el => el.tag === 'textarea').value, 'Synthetic draft');
  assert.ok(nodes.some(el => el.textContent === NOTICES.en.unavailable));
  assert.ok(nodes.some(el => el.textContent === 'Usage counts are unavailable on this page.'));
});

test('real entry, demo, mailbox help, invalid input and email confirmation never submit feedback or start DNS', async () => {
  const f = fixture();
  assert.equal(f.calls.length, 0);
  f.el('demo').onclick();
  assert.equal(f.el('result-domain').textContent, 'studio.example');
  assert.match(f.el('status').textContent, /No DNS query/);
  f.el('purpose-mailbox').checked = true;
  f.el('purpose-mailbox').listeners.change();
  await f.submit();
  f.el('purpose-dns').checked = true;
  f.el('domain').value = 'https://example.com';
  await f.submit();
  f.el('domain').value = 'private-local-part@example.com';
  await f.submit();
  assert.match(f.el('status').textContent, /Confirm the domain-only/);
  assert.equal(f.dns.length, 0);
  assert.equal(f.calls.length, 0);
});

test('actual DNS form produces narrow start/completion payloads, including NXDOMAIN, not configuration pass claims', async () => {
  for (const queryFn of [async () => usable(), async () => ({ Status: 3 })]) {
    const f = fixture({ allowed: true, queryFn });
    assert.deepEqual(f.calls.map(call => call.body.event), ['page_view']);
    f.el('demo').onclick();
    assert.equal(f.calls.length, 1, 'demo never measures an action');
    f.el('purpose-dns').checked = true;
    f.el('domain').value = 'private.example';
    await f.submit();
    assert.equal(f.dns.length, 3);
    assert.deepEqual(f.calls.map(call => call.body), ['page_view', 'tool_start', 'tool_complete']
      .map(event => ({ product: 'maildns', event })));
    for (const call of f.calls) {
      assert.equal(call.path, '/api/events');
      assert.equal(call.options.mode, 'same-origin');
      assert.equal(call.options.redirect, 'error');
      assert.doesNotMatch(call.options.body, /private|selector|result|https|userId/);
    }
  }
});

test('actual DNS checks remain useful with analytics off or unavailable; failed evidence does not count completion', async () => {
  const off = fixture();
  off.el('purpose-dns').checked = true;
  off.el('domain').value = 'studio.example';
  await off.submit();
  assert.equal(off.calls.length, 0);
  assert.equal(off.dns.length, 3);
  const offline = fixture({ allowed: true, offline: true });
  offline.el('purpose-dns').checked = true;
  offline.el('domain').value = 'studio.example';
  await offline.submit();
  assert.equal(offline.el('results').hidden, false);
  assert.equal(offline.el('check').disabled, false);
  const failed = fixture({ allowed: true, queryFn: async () => { throw Error('resolver unavailable'); } });
  failed.el('purpose-dns').checked = true;
  failed.el('domain').value = 'studio.example';
  await failed.submit();
  assert.deepEqual(failed.calls.map(call => call.body.event), ['page_view', 'tool_start']);
  assert.equal(failed.el('results').hidden, false);
});

test('real cancellation, deadline, partial evidence and supersession never count completion', async () => {
  const calls = [], client = { track: async event => { calls.push(event); } };
  const tasks = [['MX', 'studio.example', 'MX']];
  const pending = new core.CheckSession(() => new Promise(() => {}), 10);
  const cancelled = runDnsInspection(pending, tasks, client);
  pending.cancel();
  assert.equal(await cancelled, null);
  await runDnsInspection(pending, tasks, client); // shared deadline returns unavailable
  const older = runDnsInspection(pending, tasks, client);
  const newer = runDnsInspection(pending, tasks, client);
  assert.equal(await older, null);
  await newer;
  for (const result of [{ Status: 0, TC: true }, { Status: 2 }, { Status: 0, Answer: [{type:16,data:'"bad',name:'studio.example'}] }]) {
    const checker = new core.CheckSession(async () => result);
    await runDnsInspection(checker, [['SPF', 'studio.example', 'TXT']], client);
  }
  assert.ok(calls.length >= 7);
  assert.ok(calls.every(event => event === 'tool_start'));
});

test('product feedback opens without a send, uses existing links/categories, and preserves draft on 503', async () => {
  const f = fixture({ offline: true });
  const nodes = all(f.el('measurement-feedback'));
  assert.ok(nodes.some(el => el.href === 'https://tools.arcdrake.com/privacy/'));
  assert.ok(nodes.some(el => el.href === 'https://arcdrake.com/contact/'));
  assert.deepEqual(nodes.filter(el => el.tag === 'option').map(el => el.value), ['bug', 'idea', 'usability', 'other']);
  nodes.find(el => el.textContent === NOTICES.en.open).listeners.click();
  const message = nodes.find(el => el.tag === 'textarea');
  message.value = 'Synthetic report';
  nodes.find(el => el.tag === 'select').value = 'bug';
  assert.equal(f.calls.length, 0);
  await nodes.find(el => el.tag === 'form').listeners.submit({ preventDefault() {} });
  assert.equal(f.calls.length, 1);
  assert.equal(f.calls[0].path, '/api/feedback');
  assert.deepEqual(f.calls[0].body, { product: 'maildns', category: 'bug', message: 'Synthetic report' });
  assert.equal(message.value, 'Synthetic report');
  assert.ok(nodes.some(el => el.textContent === NOTICES.en.unavailable));
  assert.equal(f.storage.getItem(CHOICE_KEY), undefined);
  const root = f.el('measurement-feedback').children[0];
  f.changeLanguage('de');
  assert.equal(f.el('measurement-feedback').children[0], root);
  assert.equal(message.value, 'Synthetic report');
  assert.ok(nodes.some(el => el.href === 'https://tools.arcdrake.com/de/privacy/'));
  assert.ok(nodes.some(el => el.href === 'https://arcdrake.com/de/contact/'));
  assert.equal(f.calls.length, 1, 'language switching never resubmits');
});

test('real task hooks recheck opt-out between start and completion and honor GPC/DNT', async () => {
  for (const privacy of [{ globalPrivacyControl: true }, { doNotTrack: '1' }]) {
    const f = fixture({ allowed: true, privacy });
    f.el('purpose-dns').checked = true;
    f.el('domain').value = 'studio.example';
    await f.submit();
    assert.equal(f.dns.length, 3);
    assert.equal(f.calls.length, 0);
  }
  const resolvers = [];
  const f = fixture({ allowed: true, queryFn: () => new Promise(resolve => resolvers.push(resolve)) });
  f.el('purpose-dns').checked = true;
  f.el('domain').value = 'studio.example';
  const running = f.submit();
  f.storage.setItem(CHOICE_KEY, 'no');
  for (const resolve of resolvers) resolve(usable());
  await running;
  assert.deepEqual(f.calls.map(call => call.body.event), ['page_view', 'tool_start']);
  assert.equal(f.el('results').hidden, false);
});
