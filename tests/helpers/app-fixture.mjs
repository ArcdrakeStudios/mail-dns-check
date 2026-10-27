import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import * as core from '../../dist/core.js';
import { runDnsInspection } from '../../dist/measurement.js';
import { mountProductFeedback } from '../../dist/feedback.js';
import { CHOICE_KEY } from '../../dist/shared/measurement-feedback-client.mjs';

// Executes actual application handlers with an in-memory DOM and resolver.
// This checks application wiring, not browser layout or native form validation.
class Element {
  constructor(tag, doc) {
    Object.assign(this, { tag, ownerDocument: doc, children: [], listeners: {}, attributes: {},
      value: '', textContent: '', checked: false, disabled: false, hidden: false, dataset: {} });
  }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this.children = children; }
  setAttribute(key, value) { this.attributes[key] = value; }
  addEventListener(key, callback) { const prior = this.listeners[key]; this.listeners[key] = prior ? event => { prior(event); return callback(event); } : callback; }
  querySelectorAll(tag) { return all(this).filter(el => el !== this && (tag === 'p[role="status"]' ? el.tag === 'p' && el.attributes.role === 'status' : el.tag === tag)); }
  reset() { for (const el of all(this)) if (['input', 'textarea'].includes(el.tag)) el.value = ''; }
  focus() {}
  set innerHTML(_value) { assert.fail('feedback must render plain text'); }
}
export const all = root => [root, ...root.children.flatMap(all)];
const usable = () => ({ Status: 0, Answer: [] });

export function fixture({ allowed = false, offline = false, enabled = true, fetchImpl, privacy = {}, queryFn = async () => usable() } = {}) {
  let language = 'en';
  const calls = [], pending = [], dns = [], ids = new Map(), events = {};
  const doc = { createElement: tag => new Element(tag, doc), getElementById: id => {
    if (!ids.has(id)) ids.set(id, new Element('div', doc));
    return ids.get(id);
  } };
  const data = new Map(allowed ? [[CHOICE_KEY, 'yes']] : []);
  const storage = { getItem: key => data.get(key), setItem: (key, value) => data.set(key, value) };
  class CheckSession extends core.CheckSession {
    constructor() { super(async (...args) => { dns.push(args); return queryFn(...args); }, 50); }
  }
  const context = vm.createContext({ ...core, CheckSession, runDnsInspection, getLanguage: () => language,
    mountProductFeedback: (container, options) => mountProductFeedback(container, {
      ...options, enabled, storage, privacy, fetchImpl: async (path, options) => {
        calls.push({ path, options, body: JSON.parse(options.body) });
        if (fetchImpl) { const operation = fetchImpl(path, options); pending.push(operation); return operation; }
        if (offline) return Response.json({ ok: false, error: 'unavailable' }, { status: 503 });
        return Response.json(path.endsWith('/feedback') ? { ok: true, id: '00112233-4455-4677-8899-aabbccddeeff' } : { ok: true }, { status: 202 });
      },
    }),
    document: doc, window: { addEventListener: (key, callback) => { events[key] = callback; } },
  });
  const source = readFileSync(new URL('../../dist/app.js', import.meta.url), 'utf8');
  vm.runInContext(source.replace(/^import[^\n]+;\r?\n/gm, ''), context);
  const el = id => doc.getElementById(id);
  const submit = () => el('form').listeners.submit({ preventDefault() {} });
  return { calls, pending, dns, el, submit, events, storage,
    changeLanguage: next => { language = next; events['arcdrake-language-change'](); } };
}
