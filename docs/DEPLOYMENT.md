# Static hosting

The hosted application is available at [tools.arcdrake.com/mail-dns/](https://tools.arcdrake.com/mail-dns/). To host your own copy, build a package using [these instructions](RELEASING.md).

## Files and paths

Extract `artifacts/release/static-release.zip`. It contains ten application files: `index.html`, `style.css`, `app.js`, `core.js`, `language.js`, `measurement.js`, `feedback.js`, `measurement-config.js`, `shared/measurement-contract.mjs` and `shared/measurement-feedback-client.mjs`, plus `LICENSE` and `THIRD_PARTY_NOTICES.md`. A separate `manifest.json` records archive and per-file SHA-256 hashes.

Serve the extracted static files over HTTPS from a root or directory, preserving relative asset paths. A directory mount must serve its trailing-slash index. Do not serve the repository root, tests or development tools. The DNS checker works without an application backend or account system. Optional feedback/count APIs require the separate host integration described in [measurement and feedback](MEASUREMENT-FEEDBACK.md); a static preview cannot store feedback.

## Host configuration

Keep the application's Content Security Policy. Set `X-Content-Type-Options: nosniff` and `Referrer-Policy: no-referrer`, and configure framing restrictions appropriate to your host. Revalidate HTML and avoid serving stale assets from another version.

The app needs `connect-src 'self' https://cloudflare-dns.com` for explicit DNS lookups. Check DNS-over-HTTPS responses and CORS from your chosen origin. These direct browser requests expose the visitor's public IP address and requested DNS names to Cloudflare; no mail is sent.

No service worker is installed. Language preference storage belongs to the current origin.

## Check your deployment

Verify file hashes against the manifest, unknown-path 404 responses, asset loading, security headers, narrow layouts and English/German controls. Also check the demo, mailbox-help path and an explicit live DNS lookup.

Hosting receives ordinary page and asset requests and may keep access logs. Describe the host's processing and operator/contact information accurately. Keep the previous package and manifest if you need to restore an earlier version.

Optional usage-count preference storage also belongs to the current origin. The host must preserve the same-origin API paths and cannot redirect feedback to another origin. Production activation is separate from static packaging; see [integration](MEASUREMENT-FEEDBACK.md).
