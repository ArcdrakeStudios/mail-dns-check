# DNS interpretation and test coverage

## What the records can tell you

Mail DNS Check summarizes records returned by one resolver. It does not test an individual message or prove that a mailbox accepts mail.

- **MX:** A null MX may intentionally reject incoming mail. If MX is absent, SMTP may fall back to A/AAAA records; this app does not query that fallback.
- **SPF:** The published policy is shown, but includes, redirects, macros, sender-address matching and DNS lookup budgets are not evaluated.
- **DMARC:** The app queries the exact domain's `_dmarc` record. It does not discover organizational domains or evaluate inherited policy.
- **DKIM:** A lookup requires a supplied selector. Public keys and message signatures are not validated; no selector is guessed.

CNAMEs remain visible in raw evidence without additional target queries. TXT chunks are concatenated into a record; unrelated TXT records remain available in raw evidence. Error, truncated and unavailable responses are distinct from missing records. TTL values describe resolver-cache evidence rather than global freshness.

## Request boundaries

An explicit check issues three queries: MX, domain TXT and exact-domain DMARC TXT. A supplied DKIM selector adds a fourth. Requests share a 12-second cancellation deadline; responses are capped at 64 KiB and 100 answers. Credentials are omitted, redirects rejected and no referrer is sent.

A new check, demo, Clear, Cancel or leaving the page invalidates prior responses. Internationalized domain names are normalized to ASCII. URLs, IP addresses and local names are rejected. Public inspection requires an explicit choice; an email address additionally requires confirmation to inspect only its domain. Provider-name hints do not establish ownership or intent.

## Running the checks

Install the development tools in the [README](../README.md), then run:

```sh
npm test
npm run test:ci
npm run test:localization
```

Core tests cover parsing and bounded record summaries. Chromium browser checks use controlled DNS fixtures to cover mailbox-help and public-inspection paths, domain-only confirmation, canceled requests, demo results, errors and narrow layouts. Localization checks cover English/German selection and preservation of DNS data.

Fixture tests do not verify a live resolver or CORS on a deployed origin. Check those separately when hosting a copy. Automated checks use Chromium; Safari, Firefox, physical devices and screen readers have not been verified.

Browser checks create their own loopback server and close it afterward. Screenshots default to ignored `artifacts/readiness/`. Setting `UPDATE_SCREENSHOTS=1` updates the documented screenshots in `docs/`; inspect those images before committing them.

The static package builder checks its file inventory and archive contents, then writes archive and per-file SHA-256 hashes. It does not publish.

## References

- [Cloudflare DNS-over-HTTPS JSON API](https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-https/make-api-requests/dns-json/)
- [SMTP routing, RFC 5321 section 5](https://www.rfc-editor.org/rfc/rfc5321.html#section-5)
- [Null MX, RFC 7505](https://www.rfc-editor.org/rfc/rfc7505.html)
- [SPF, RFC 7208](https://www.rfc-editor.org/rfc/rfc7208.html)
- [DMARC, RFC 7489](https://www.rfc-editor.org/rfc/rfc7489.html)
- [DKIM, RFC 6376](https://www.rfc-editor.org/rfc/rfc6376.html)
