# Verification

Latest local pass: 15 October 2026. 16 deterministic core tests passed under Node.js 24.14.0; 23 Chromium 151.0.7922.34 browser fixture checks passed. Mailbox-help journeys for Gmail, Yahoo, Outlook and unknown providers make no DNS queries. Every domain requires public-DNS intent; every email requires explicit domain-only confirmation, and no local part is sent. Switching to mailbox help cancels pending DNS results. Provider detection never establishes ownership or intent. The overview renders ~all, p=none, supplied/omitted DKIM selectors, a CNAME-only answer, permissive SPF, tool parse limitations, missing records and partial unavailability, NXDOMAIN and unavailable results. Cancel, Clear and demo replacement discard late responses. A versionless signing key remains a candidate, not a validated key. Updated synthetic desktop and 390px screenshots were visually inspected; no horizontal overflow was measured. Physical devices, screen readers, non-Chromium browsers and the production origin have not been tested in this run.

Run `npm test`. For browser checks follow the [README](../README.md): install the locked
Playwright dependency and Chromium using the documented commands. The browser script
starts its own loopback server and closes it and its isolated browser afterward.
Screenshots default to ignored artifacts; UPDATE_SCREENSHOTS=1 is a deliberate
release-image refresh. The application needs no package installation.

The static package builder rejects unexpected files/subdirectories, uses stored
ZIP entries with fixed metadata, checks each archive member against source and
writes archive/per-file SHA-256 hashes. It is not a publishing command.

On 14 October 2026, the app served from a local loopback origin queried the public DNS records for arcdrake.com through Cloudflare DoH. Its MX, TXT and DMARC requests returned HTTP 200 with application/dns-json and Access-Control-Allow-Origin: *. The app rendered those responses. This tested arcdrake.com as the queried domain, not as the app hosting origin. Production-origin behavior requires a separate check after deployment.
