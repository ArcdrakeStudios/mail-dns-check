# Optional counts and voluntary feedback

This static candidate does not activate production collection. The DNS checker
and fictional demo work without a feedback service. A static local preview has
no feedback storage; an explicit send can fail with an unconfirmed receipt, keeps
the draft and never retries automatically. A network error can occur after a
server write, so failure does not prove nothing was stored.

`dist/measurement-config.js` sets `enabled: false`. The product adapter blocks
all intake fetches even with previously saved consent or an explicit send.
The count opt-in button is disabled and its status explains page availability;
opt-out still clears a saved choice. The feedback form keeps drafts and reports
an unavailable service. No feedback is persisted in this static configuration.
The public copy uses page availability wording, independent of build location.

## Public client

`dist/shared/measurement-contract.mjs` and
`dist/shared/measurement-feedback-client.mjs` are the shared v1 source modules.
Keep them together and update them together from the host's reviewed contract.
There are no browser secrets or analytics dependencies. The only endpoints are
the exact same-origin `POST /api/events` and `POST /api/feedback`. These root paths
also apply when the app is mounted under `/mail-dns/`. Configure routing on the
host, rather than replacing them with a cross-origin collector. The CSP permits
`'self'` and the existing Cloudflare DNS resolver for connections.

Events contain exactly `{product:'maildns',event}`. The contract allowlist is
`page_view`, `play_start`, `play_complete`, `feedback_open`, `tool_start`,
`tool_complete`. This tool uses entry, feedback-open and actual DNS task events.
No input, selector, URL/query, record, result, identity or arbitrary metadata is
attached. Demo, mailbox-help, invalid input and domain-only confirmation do not
start a measured DNS task. Completion requires all requested observations to be
usable; missing records/NXDOMAIN are usable observations, not configuration passes.
Unavailable/truncated/uninterpretable results, cancellation and supersession do
not record completion. Skipped DKIM is not a failure.

Counts default off. Every call checks `arcdrake.analytics.v1`, GPC and DNT (`1`).
The yes/no preference is shared on the origin, with session-only fallback if
storage fails. Allowing counts does not send earlier activity. Off stops future
events and cannot remove a contribution from existing daily totals. These are
action counts, not unique visitors. Hosting and abuse protection still receive
connection metadata, including IP addresses, separately.

Feedback is available with counts off. It sends only through the form's explicit
Send feedback action: product, category (`bug`, `idea`, `usability`, `other`),
trimmed message (1–2000 JavaScript code units; tabs/newlines allowed, other controls
rejected), optional valid trimmed reply email (at most 254 code units, omitted
when empty). Unknown properties are rejected. No files or automatic replies.
Feedback text is never saved in browser storage. Rendering uses textContent.
Only HTTP 202 with `ok:true` is acceptance; feedback success includes a receipt ID.
Cookies, referrer, redirect following, automatic retries and beacons are omitted.
The UI preserves the draft on unconfirmed sends. No human response is promised.

Feedback requires exactly `{ok:true,id}` with a UUIDv4 receipt; events require
exactly `{ok:true}`. Status/error pairs must match the shared map. A single
10-second deadline bounds fetch and JSON parsing, including an adapter that
ignores abort. A malformed receipt never clears the form. Rate/capacity messages
preserve valid text and explain service limits.

Verify a copied client against a reviewed host checkout without network or a
server: `node tools/verify-feedback-pipeline.mjs <host-checkout>`. This byte-compares
both shared modules (including their relative dependency), prints SHA-256 hashes,
and explicitly enables only the in-memory fixture. Actual app DNS handlers use
synthetic resolver results through the shared client, API and MemoryStorage;
feedback requires submit and a valid receipt. Authenticated export/delete and
91-day cleanup are also checked. This does not enable the packaged config or
establish production ingress, persistence, alarms or provider retention.

The form names Arcdrake as recipient and links existing EN/DE Tools privacy and
Arcdrake company contact pages. Language changes preserve draft, send state and
receipt rather than rebuilding the form. The existing language event and native
buttons remain compatible with the hosting wrapper's duplicate-control fallback.

## Hosting integration (separate activation)

Use the shared v1 hosting Worker forwarding through the private
`MEASUREMENT_FEEDBACK` service binding. Missing bindings must return JSON 503,
never HTML success or an acknowledgement of persistence. The backend must have
no public route/preview/workers.dev endpoint and no CORS permissions. Never expose
triage credentials in static files or public configuration.

Set `HOST_PRODUCTS` as a map of exact reviewed HTTPS origins to allowed product
IDs, including `maildns` for the publication host. Reject wildcard/path/HTTP
origins, unknown hosts and products. The public client is not frozen to a local
or example origin. Preserve the original HTTPS ingress URL, same-origin Origin
and trusted platform CF-Connecting-IP through the binding; forwarded headers are
not an identity capability. POST requires JSON, no query, valid UTF-8 and at most
12,000 body bytes. Do not weaken CSP or use a public cross-origin intake.

Errors use `{ok:false,error}`: 400 invalid, 403 origin/product, 405 method,
413 size, 415 type, 429 rate (Retry-After: 60), 503 unavailable/capacity. Provider
details are not echoed. The client preserves these codes and treats malformed,
redirected, network and unexpected responses as unavailable.

Only daily count totals are stored for the current UTC day plus 89 prior days.
Feedback is accessible to authorized Arcdrake triage operators/agents for 30 days,
then hidden immediately and physically deleted by hourly active-store cleanup,
subject to platform failure. Provider backups/recovery have separate retention
that must be checked before activation. Private authenticated exports must expire
by the row expiry or earlier, and deletion requests must cover retained copies.
Receipt-based requests use existing company contact, not a browser delete secret.

Before any separately authorized release: integrate the shared private backend
and service binding, exact host/product map, rate limits, retention alarms and
server-only secrets; verify provider backup retention/free allowance support;
update host EN/DE privacy notices; perform bounded synthetic runtime smoke tests
and delete the synthetic feedback. Verify binding origin/platform-IP propagation,
unauthenticated triage denial, retention and missing-backend JSON failures.
Then check the final hosted EN/DE UX and navigation in an authorized browser review.
Packaging alone establishes none of these production properties.

Only after those dependencies and a separately authorized release, set
`MEASUREMENT_CONFIG.enabled` to `true` and rebuild the archive. This flag does
not grant consent: GPC/DNT and the per-call opt-in/off gates still apply.

Rollback removes client integration and API forwarding/binding together or
returns explicit 503 while preserving static/DNS behavior. Keep cleanup active
for retained feedback; do not delete the namespace as an incidental rollback.
