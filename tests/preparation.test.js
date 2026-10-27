import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { handlePreview } from '../tools/preview-handler.mjs';
import { NOTICES } from '../dist/shared/measurement-feedback-client.mjs';
import { validatePayload } from '../dist/shared/measurement-contract.mjs';

test('static preview serves every module and truthful unavailable APIs without opening a socket', async () => {
  const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
  assert.match(html, /connect-src 'self' https:\/\/cloudflare-dns.com/);
  assert.ok(html.indexOf('id="demo-row"') < html.indexOf('id="form"'));
  assert.doesNotMatch(html, /id="demo-row" hidden/);
  assert.equal((html.match(/id="demo"/g) ?? []).length, 1);
  assert.doesNotMatch(html, /static local preview|local build|local configuration/i);
  for (const path of ['/', '/measurement.js', '/feedback.js', '/measurement-config.js', '/shared/measurement-contract.mjs',
    '/shared/measurement-feedback-client.mjs', '/api/events', '/api/feedback', '/../../RELEASE_PREP.md']) {
    const response = {};
    await handlePreview({ url: path, method: 'POST' }, {
      writeHead(status, headers) { Object.assign(response, { status, headers }); },
      end(body) { response.body = String(body); },
    });
    if (path.startsWith('/api/')) {
      assert.equal(response.status, 503);
      assert.deepEqual(JSON.parse(response.body), { ok: false, error: 'unavailable' });
    } else if (path.includes('..')) assert.equal(response.status, 404);
    else {
      assert.equal(response.status, 200);
      assert.match(response.headers['Content-Type'], path === '/' ? /text\/html/ : /text\/javascript/);
    }
  }
});

test('feedback field and event allowlists match shared validation boundaries', () => {
  const valid = { product: 'maildns', category: 'usability', message: '  Synthetic\n\treport  ' };
  assert.equal(validatePayload('feedback', valid).message, 'Synthetic\n\treport');
  for (const fields of [{ ...valid, message: '' }, { ...valid, message: 'x'.repeat(2001) },
    { ...valid, category: 'support' }, { ...valid, message: 'bad\u0000' },
    { ...valid, replyTo: '' }, { ...valid, replyTo: 'not-an-address' },
    { ...valid, replyTo: 'a@example.com\nBcc:x@example.com' }, { ...valid, url: 'private' }]) {
    assert.throws(() => validatePayload('feedback', fields), /invalid/);
  }
  assert.equal(validatePayload('feedback', { ...valid, replyTo: ' a@example.com ' }).replyTo, 'a@example.com');
  for (const fields of [{ product: 'maildns', event: 'domain_checked' },
    { product: 'maildns', event: 'tool_complete', domain: 'private.example' }]) {
    assert.throws(() => validatePayload('events', fields), /invalid/);
  }
});

function languageFixture() {
  const listeners = {}, saved = new Map();
  const texts = ['Feedback & optional usage counts', NOTICES.en.analytics, NOTICES.en.feedback,
    NOTICES.en.unavailable, NOTICES.en.sent + 'synthetic-receipt', 'Problem',
    'Explore without a DNS request.',
    ', the only resolver used. Cloudflare receives the DNS names and your public IP address. Domains, selectors and results are not saved by this app.',
    'Usage counts are unavailable on this page.',
    'Feedback and usage counts may be unavailable on this page. An unconfirmed send keeps your text in the form, even if storage succeeded. There is no automatic retry. The DNS checker and fictional demo work independently.']
    .map(nodeValue => ({ nodeValue, parentElement: { closest: () => null } }));
  const raw = { nodeValue: 'Give feedback', parentElement: { closest: () => ({}) } };
  texts.push(raw);
  const draft = { value: 'Private draft stays local' };
  const context = vm.createContext({ NOTICES, URL, WeakMap, Map, NodeFilter: { SHOW_TEXT: 4 },
    navigator: { language: 'en' }, location: { href: 'https://tools.arcdrake.com/mail-dns/?keep=1#result' },
    localStorage: { getItem: key => saved.get(key), setItem: (key, value) => saved.set(key, value) },
    history: { replaceState() {}, state: null }, CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } },
    MutationObserver: class { observe() {} disconnect() {} },
    window: { addEventListener(type, fn) { listeners[type] = fn; }, dispatchEvent(event) { listeners[event.type]?.(event); } },
    document: {
      documentElement: {},
      createTreeWalker() { let index = -1; return { currentNode: null, nextNode() { this.currentNode = texts[++index]; return Boolean(this.currentNode); } }; },
      querySelectorAll() { return []; },
      querySelector() { return { append() {} }; },
      createElement() { return { setAttribute() {}, addEventListener() {} }; },
    },
  });
  const source = readFileSync(new URL('../dist/language.js', import.meta.url), 'utf8')
    .replace(/^import[^\n]+;\r?\n/gm, '').replaceAll('export ', '');
  vm.runInContext(source, context);
  return { context, texts, draft, raw, listeners };
}

test('actual bundled EN/DE translator covers notices/receipts and preserves raw text and draft across changes', () => {
  const f = languageFixture();
  f.listeners['arcdrake-language-change']({ detail: { language: 'de' } });
  assert.equal(f.texts[1].nodeValue, NOTICES.de.analytics);
  assert.equal(f.texts[2].nodeValue, NOTICES.de.feedback);
  assert.equal(f.texts[3].nodeValue, NOTICES.de.unavailable);
  assert.equal(f.texts[4].nodeValue, NOTICES.de.sent + 'synthetic-receipt');
  assert.equal(f.texts[5].nodeValue, NOTICES.de.bug);
  assert.match(f.texts[7].nodeValue, /den einzigen verwendeten Resolver/);
  assert.doesNotMatch(f.texts[7].nodeValue, /the only resolver/);
  assert.equal(f.texts[8].nodeValue, 'Nutzungszählungen sind auf dieser Seite nicht verfügbar.');
  assert.match(f.texts[9].nodeValue, /fiktive Demo/);
  assert.doesNotMatch(f.texts[9].nodeValue, /Feedback and usage/);
  assert.equal(f.raw.nodeValue, 'Give feedback');
  assert.equal(f.draft.value, 'Private draft stays local');
  f.listeners.storage({ key: 'arcdrake-tools-language', newValue: 'en' });
  assert.equal(f.texts[1].nodeValue, NOTICES.en.analytics);
  assert.equal(f.texts[4].nodeValue, NOTICES.en.sent + 'synthetic-receipt');
  assert.equal(f.context.document.documentElement.lang, 'en');
});
