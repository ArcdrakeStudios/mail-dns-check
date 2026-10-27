import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fixture, all } from './helpers/app-fixture.mjs';
import { CHOICE_KEY } from '../dist/shared/measurement-feedback-client.mjs';

test('actual adapter initializes native consent in the selected locale and preserves draft and choice when switching', () => {
  for (const initialLanguage of ['de', 'en']) {
    const f = fixture({ initialLanguage, nativeDialog: true });
    const container = f.el('measurement-feedback');
    const dialog = f.doc.body.children.find(node => node.tag === 'dialog');
    const form = all(container).find(node => node.tag === 'form');
    const message = all(container).find(node => node.tag === 'textarea');
    const email = all(container).find(node => node.tag === 'input');
    message.value = 'Unsaved DNS report'; email.value = 'reply@example.test';
    const check = language => {
      const nodes = all(dialog);
      assert.equal(dialog.lang, language);
      assert.equal(nodes.find(node => node.tag === 'h2').textContent, language === 'de' ? 'Datenschutzeinstellungen' : 'Privacy choices');
      assert.match(nodes.find(node => node.tag === 'p').textContent, language === 'de' ? /möchte mit deiner Einwilligung/ : /would like your consent/);
      assert.equal(nodes.find(node => node.tag === 'summary').textContent, language === 'de' ? 'Was wird verarbeitet und gespeichert?' : 'What is processed and stored?');
      assert.equal(nodes.find(node => node.tag === 'button').textContent, language === 'de' ? 'Ohne Nutzungszählung' : 'No usage counts');
      assert.equal(nodes.find(node => node.tag === 'a').href, `https://tools.arcdrake.com/${language === 'de' ? 'de/' : ''}privacy/`);
      assert.equal(all(container).find(node => node.tag === 'form'), form);
      assert.equal(message.value, 'Unsaved DNS report'); assert.equal(email.value, 'reply@example.test');
    };
    check(initialLanguage); assert.equal(dialog.open, true);
    all(dialog).find(node => node.tag === 'button').listeners.click();
    assert.equal(f.storage.getItem(CHOICE_KEY), 'no');
    f.changeLanguage(initialLanguage === 'de' ? 'en' : 'de'); check(initialLanguage === 'de' ? 'en' : 'de');
    f.changeLanguage(initialLanguage); check(initialLanguage);
    assert.equal(f.storage.getItem(CHOICE_KEY), 'no');
    assert.equal(dialog.open, false); assert.equal(f.calls.length, 0); assert.equal(f.dns.length, 0);
  }
  assert.match(readFileSync(new URL('../dist/style.css', import.meta.url), 'utf8'), /\.arcdrake-consent summary\{color:inherit\}/);
});
