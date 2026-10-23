# AI page review in the Link inspector

The existing `/links` page now provides **Inspect** (local URL structure rules) and **Review with AI** (Gemini page-content assessment). No new page or login requirement was added. The optional account popup and existing tools still work.

## Enable it later

Add these settings to the Next.js project's `.env.local`:

```dotenv
GEMINI_API_KEY=your-real-key
GEMINI_LINK_MODEL=gemini-3.8-flash
```

Keep the key on the server; never use `NEXT_PUBLIC_` for it. It can be the same Gemini key used by the assistant. `GEMINI_LINK_MODEL` takes precedence over `GEMINI_MODEL`; choose a model available to your account that supports URL Context. Without a key, the AI button is marked unavailable and basic inspection remains usable. Restart the Next.js server after adding/changing the key, then reload the link page. Provider usage is billed under your own Gemini account and is separate from ScamShield plan previews.

## How it works

1. Enter a public http(s) URL. **Inspect** runs only local structural checks and does not send the URL externally.
2. **Review with AI** also performs the local check, then sends the URL through `/api/links/review` to Gemini with its URL Context tool enabled. The disclosure appears beside the button. The app server only contacts the fixed Google API endpoint; arbitrary destination fetching is delegated to Google's retrieval tool.
3. Gemini is instructed to retrieve the submitted page, examine signs of impersonation, credential/payment requests, threats and implausible promises, and return an assessment with reasons and practical next steps. Retrieved content is treated as untrusted evidence rather than instructions. The tool may use indexed/cached content or a live fetch; this is not a live browser session and does not execute the website's JavaScript or submit forms.
4. The server checks the provider's retrieval metadata for the exact submitted URL. A model's own claim that it read the page is insufficient. Missing/failed/unsafe retrieval becomes **Unable to verify**, and model claims about unread content are discarded.
5. The existing link page displays **Suspicious signs found**, **No clear warning signs found**, or **Unable to verify**, alongside whether content was retrieved, the reviewed URL, time, findings and next steps. No AI probability or authenticity score is invented. The basic numeric URL score remains a separate structural heuristic.

Page content alone cannot establish that a site belongs to an organization. A polished design or HTTPS does not prove legitimacy. This feature does not run an independent reputation/blacklist search, WHOIS/domain-age lookup, certificate verification or malware scan. Pages that require login, depend heavily on JavaScript, block retrieval, or show different content to different visitors may be incomplete or inaccessible. “No clear warning signs” is not a guarantee of safety.

## History and privacy

AI review sends the unfragmented URL, hostname and basic warning flags to Google. Avoid confidential and one-time links. Embedded credentials, custom ports, raw IP addresses, localhost/private-name aliases and obvious token/password/signature query parameters are rejected for AI review; local inspection still accepts supported URL formats. Parameter checks cannot identify every private link.

Only completed AI responses are eligible for history. With the save option selected, the existing summary also stores a bounded, redacted AI verdict, summary, findings, retrieval flag and timestamp. Raw page HTML and provider response bodies are excluded. The existing Supabase JSON assessment column supports this metadata, so no new database migration is required. Cloud sync still requires a signed-in account with sync enabled. History labels basic and AI assessments separately. Assistant context can include the saved AI summary when the user opts into their latest check.

Cancellation, editing the URL, selecting another sample or leaving the page aborts/invalidates a pending request. Late results are ignored and not added to history. A basic session summary can remain available to the assistant; failed or cancelled requests never fabricate an AI result. Cancellation cannot guarantee reversal of provider work already started.

## Files

- `app/links/page.tsx`: in-place controls, progress/cancellation, retrieval-aware report and optional history.
- `app/api/links/review/route.ts`: server-only availability and POST endpoints, bounded input, validation, timeout, rate/concurrency limits and safe error messages.
- `lib/link-review.ts`: shared types, public URL validation, result validation and outcome labels.
- `lib/link-review-server.ts`: Gemini URL Context request, strict response parsing, evidence gating and bounded provider response.
- `lib/storage.ts`, `lib/cloud-history.ts`, `lib/analysis.ts`: allowlisted/redacted AI metadata using the existing history schema.
- `app/history/page.tsx`: labels and displays saved AI findings separately from basic checks.
- `lib/assistant.ts`, `app/assistant/page.tsx`: includes AI findings in opted-in latest-check context.

The route allows up to 10 requests/minute and 3 concurrent requests per running process. These are MVP limits; multiple instances do not share a durable quota. Do not treat them as a production billing-control system.

## Verification

Automated checks use mocked Gemini responses for retrieval success, missing metadata, blocked pages, malformed answers, provider failures, private URLs, rate/concurrency limits, cancellation, stale responses and redacted history. Existing functional suites and a production build are also run. No live AI result has been verified because the owner will add the API key later. After enabling it, review a known public page and confirm the retrieval flag, then test an inaccessible page and confirm it stays unverified.

Official reference: [Google Gemini URL Context documentation and REST examples](https://ai.google.dev/gemini-api/docs/generate-content/url-context).
