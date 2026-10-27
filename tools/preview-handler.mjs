import { readFile } from 'node:fs/promises';

const root = new URL('../dist/', import.meta.url);
const files = new Map([
  ['/', ['index.html', 'text/html']],
  ...['index.html', 'core.js', 'language.js', 'app.js', 'measurement.js', 'feedback.js', 'measurement-config.js', 'style.css',
    'shared/measurement-contract.mjs', 'shared/measurement-feedback-client.mjs']
    .map(name => ['/' + name, [name, name.endsWith('.html') ? 'text/html' :
      name.endsWith('.css') ? 'text/css' : 'text/javascript']]),
]);

// An explicitly unavailable API, never a local fake inbox or success receipt.
export async function handlePreview(req, res) {
  const path = (req.url ?? '').split('?')[0];
  if (['/api/events', '/api/feedback'].includes(path)) {
    const method = req.method === 'POST';
    res.writeHead(method ? 503 : 405, { 'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    res.end(JSON.stringify({ ok: false, error: method ? 'unavailable' : 'method' }));
    return;
  }
  const file = files.get(path);
  if (!file) { res.writeHead(404); res.end('Not found'); return; }
  try {
    const body = await readFile(new URL(file[0], root));
    res.writeHead(200, { 'Content-Type': file[1] + '; charset=utf-8',
      'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer',
      'X-Content-Type-Options': 'nosniff' });
    res.end(body);
  } catch { res.writeHead(500); res.end('Unavailable'); }
}
