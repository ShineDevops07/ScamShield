# ScamShield

ScamShield is a scam-awareness web application for checking suspicious messages, call transcripts, screenshots, recordings and website links. It combines explainable local checks, optional AI assistance, optional Supabase history, learning tools and recovery checklists.

This repository contains the complete current MVP: the Next.js website and its server routes, the separate Python/FastAPI backend, database migration, bundled OCR assets, configuration templates and documentation. Paid plans are previews; payments and family sharing are not implemented.

## 1. Install first

| Software | Required for |
| --- | --- |
| Node.js 22 or newer; Node.js 24 recommended | Website and Next.js API routes. Supabase SDK requires Node.js 22+. |
| pnpm | JavaScript dependencies and project commands. `package.json` declares pnpm 12.3.4. |
| Visual Studio Code | Recommended editor. Open the folder containing `package.json`. |
| Python 3.10+ and pip | Only if you want to run the separate Python backend. |

A local database server, Docker, system Tesseract installation and Python are not required to run the website. Supabase is a hosted service and can be managed from another laptop.

## 2. Run the website

Extract the ZIP and open its `scamshield` folder in VS Code. Use the terminal in that folder:

```sh
pnpm install
pnpm dev --webpack --hostname 127.0.0.1 --port 3100
```

Open [http://127.0.0.1:3100](http://127.0.0.1:3100).

This one command starts both the website and its Next.js backend routes. Keep the terminal running. Press Ctrl+C to stop it. VS Code Live Server does not run this application.

If your setup cannot obtain the declared pnpm version, this workspace has also been installed using pnpm 11.25.0 with:

```sh
pnpm --config.manage-package-manager-versions=false --config.package-manager-strict=false install
```

Use the same two configuration flags on subsequent pnpm commands if the manager attempts to switch to an unavailable version. This fallback is optional; use the declared manager when available.

For environments with restricted file watching:

```sh
WATCHPACK_POLLING=true pnpm dev --webpack --hostname 127.0.0.1 --port 3100
```

## 3. Where both AI keys go

Create **`.env.local` beside `package.json`**, in the project root. You can copy the supplied `.env.example` first.

macOS/Linux:

```sh
cp .env.example .env.local
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

If `.env.local` already exists, edit it instead of copying over it. Keep any existing Supabase settings.

```dotenv
# Gemini powers both optional AI chat and AI link-page review.
GEMINI_API_KEY=your_gemini_key_here
GEMINI_MODEL=gemini-3.8-flash
GEMINI_LINK_MODEL=gemini-3.8-flash

# OpenAI powers MP3/WAV speech-to-text.
OPENAI_API_KEY=your_openai_key_here
OPENAI_TRANSCRIBE_MODEL=gpt-transcribe

# Optional Supabase login and cross-device history.
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key_here
```

Replace the example values with your own values. Model settings are optional overrides; use model IDs supported by your provider account. A configured key does not guarantee billing balance or model access. If you are not enabling a provider, leave its key empty rather than keeping a placeholder string.

**Restart the Next.js server after adding or changing keys.** Supabase `NEXT_PUBLIC_` settings are embedded during build; rebuild the production app after changing those settings.

The root `.env.local` is used by the website. `backend/.env` belongs to the separate Python service. Keep Gemini and OpenAI keys server-only: never prefix them with `NEXT_PUBLIC_`. Supabase's publishable/anon key is public by design; a service-role/secret key must never go in the browser configuration.

The downloadable source excludes your real `.env.local` and `backend/.env`. Configure them again when moving the project to another laptop. Keep the same Supabase project settings and sign into the same ScamShield account to access the same cloud history.

### What works without keys?

Message/call-text checks, basic link inspection, screenshot OCR, guided assistant answers, manual transcript checks, learning, recovery, downloads and device history work without AI keys. AI chat/link review require Gemini; audio transcription requires OpenAI; cloud login/history require Supabase.

## 4. Set up Supabase

1. Open your Supabase project and copy its Project URL and publishable key into root `.env.local`.
2. In the Supabase SQL Editor, run [`supabase/migrations/202610230001_scamshield_history.sql`](supabase/migrations/202610230001_scamshield_history.sql) once for a new project. It creates `public.scamshield_checks`, its index, constraints and owner-access policies. Reusing the existing configured project reuses its existing table.
3. Enable email/password authentication. The built-in email sender only delivers to project-team addresses and currently has a two-emails-per-hour limit; configure custom SMTP for other recipients. See [AUTH-TROUBLESHOOTING.md](AUTH-TROUBLESHOOTING.md) if account creation fails. Configure the Site URL to your website origin. Allow the confirmation callback `http://127.0.0.1:3100/account` for local use; add `http://localhost:3100/account` if using localhost. Use your HTTPS application URL on deployment.
4. Restart the website. Signed-out visitors see an optional login popup. They can close it with **×**, Escape, an outside click or **Continue as guest**. The header's **Sign in** button reopens it. Signed-in visitors see **Logged in** in the same place; clicking it opens account settings. Successful sign-in or signup closes the form automatically. If signup still needs email confirmation, the form closes with a confirmation reminder and the header stays Sign in until authenticated. There is no separate login page; `/account` is a compatibility redirect for confirmation links.
5. Create an account, confirm the email if required, and sign in. Enable **Sync new saved checks**.
6. Select a check's save option. Its redacted summary can then sync to the account. Open **History → My cloud history** to review it.

Existing device history never imports automatically at sign-in. Review the device list and use **Upload N device checks to my account** if wanted. Device history keeps the latest 20 entries; cloud history loads 50 at a time. Cloud search/export applies to loaded records. Device and cloud deletion are separate.

Only redacted summaries/findings are kept. Raw screenshots, recordings, full-length source fields, raw webpage HTML and assistant conversations are excluded from the history table. Redacted previews/findings can still contain personal details that automatic redaction missed. Auth account information is maintained separately by Supabase Auth.

The table's row-level security restricts reads, inserts, updates and deletes to the signed-in record owner. Keep it enabled. See [SUPABASE.md](SUPABASE.md) for setup, access policies, retries and privacy details.

## 5. Features and pages

| Page | Included behavior |
| --- | --- |
| `/` — Checker | Local message, call-transcript and URL checks; findings, copy/download reports, optional saved summaries. |
| `/screenshots` | Local English Tesseract OCR, preview, editable extracted text and reviewed-text checks. Recognizable payment receipts stay **Payment not verified / Not scored**. |
| `/audio` | MP3/WAV preview, explicit upload permission, optional OpenAI transcription, editable review, local call-text checks and downloads. |
| `/assistant` | Guided scam-safety answers, optional Gemini conversation and optional redacted latest-check context. |
| `/links` | Local URL inspection plus optional **Review with AI**, using Gemini URL Context to assess accessible page content. Shows reasons, retrieval evidence, uncertainty and next steps. |
| `/history` | Device/cloud views, explicit import, search, filters, export, removal, local undo and cloud paging. Saved AI link findings appear separately from the basic URL score. |
| `/learn` | Six-situation quiz with explanations and a searchable pattern library. |
| `/recover` | Incident checklists, progress, downloads and reporting resources. |
| `/pricing` | Free tools, family plan previews, organization pilot proposals, comparisons and downloadable plan details. |

### Screenshot checks

Images are processed locally using bundled Tesseract.js assets and English recognition data. Supported files: PNG/JPEG/WebP, up to 5 MB, 20 megapixels and 12,000 pixels per edge. Users review extracted text before checking it. This does not authenticate an image, confirm a payment or decode a QR code. A genuine-looking receipt cannot prove that money reached an account.

### Audio transcription

Choose an MP3/WAV file up to 20 MB, listen locally, confirm permission and click **Transcribe audio**. The Next.js server forwards it to OpenAI in memory. Review the transcript before running a text check. Pasting a transcript works without a key. Limited language coverage produces an unscored limitation result rather than an unsupported reassurance. See [AUDIO.md](AUDIO.md).

### AI link review

**Inspect** stays local. **Review with AI** sends the public link through this server to Gemini's URL Context tool. The report distinguishes **Suspicious signs found**, **No clear warning signs found** and **Unable to verify**. Provider retrieval metadata must confirm the submitted page was retrieved; model claims alone are insufficient. Failed or blocked retrieval remains unverified.

The AI assessment has no invented authenticity percentage and is separate from the basic URL score. Cancelled/stale responses are discarded. Read [AI-LINK-REVIEW.md](AI-LINK-REVIEW.md) for setup and limits.

### Pricing previews

Family Essential: **₹99/month**. Family Plus: **₹199/month**. Proposed four-week organization pilots: **₹5,000** and **₹15,000**. These are previews/proposals: checkout, recurring billing, paid entitlements and family-sharing workflows are not implemented. See [SUBSCRIPTIONS.md](SUBSCRIPTIONS.md).

## 6. Source structure

```text
scamshield/
├── app/                         Next.js pages, shared layout and global CSS
│   ├── api/chat/route.ts        Gemini chat backend
│   ├── api/transcribe/route.ts  OpenAI audio transcription backend
│   ├── api/links/review/route.ts Gemini page-review backend
│   └── ...                     Nine existing application pages
├── components/                  Header/footer, login popup and cloud provider
├── lib/                         Rules, parsers, validation, storage and AI adapters
│   ├── analysis.ts              Message/call rules and assessment types
│   ├── url-inspector.ts         Local structural URL checks
│   ├── link-review*.ts          AI review types, validation and provider adapter
│   ├── storage.ts               Redaction, device history and session context
│   ├── cloud-history.ts         Owner-scoped Supabase operations
│   └── supabase/client.ts       Browser Supabase client
├── public/
│   ├── examples/                Included screenshot example
│   └── ocr/                     Self-hosted OCR worker, engine and English model
├── scripts/                     OCR asset preparation script
├── supabase/migrations/         PostgreSQL history table and RLS migration
├── backend/                     Separate Python/FastAPI implementation
│   ├── main.py                  API entrypoint and middleware
│   ├── app/api/routes/          HTTP route handlers
│   ├── app/core/                Configuration, logging and request controls
│   ├── app/rules/               Python fraud/context rules
│   ├── app/schemas/             Request and response models
│   ├── app/services/            Analysis, provider and recovery services
│   ├── app/tests/               Python automated tests
│   ├── requirements.txt        Python dependencies
│   └── .env.example            Separate backend settings template
├── .env.example                Website settings template; copy to .env.local
├── package.json                Website scripts and JavaScript dependencies
├── pnpm-lock.yaml              Locked JavaScript dependency versions
├── next.config.mjs             Next.js settings and legacy account redirect
├── tsconfig.json               Strict TypeScript configuration
└── README.md                   This setup and project guide
```

The website's frontend lives in `app/`, `components/`, `lib/` and `public/`. Its active backend endpoints live in `app/api/` and run with Next.js. The Supabase database is external. The Python service is a separate supplied implementation: **the current website does not call it**. Running both servers does not connect them automatically, and changing Python rules does not change the website's TypeScript rules.

## 7. Run the optional Python backend

Use a second VS Code terminal. Starting from the project root:

```sh
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
cp .env.example .env
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

On Windows PowerShell, use these environment-creation/activation commands instead:

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The supplied backend template starts with `AI_PROVIDER=none` and empty provider keys for rules-only use. Its settings file is `backend/.env`, with `ENV=development` and `CORS_ORIGINS` as a JSON list. The actual scoring fields are `RISK_THRESHOLD_CAUTION`, `RISK_THRESHOLD_HIGH` and `RISK_THRESHOLD_CRITICAL`.

Open [API documentation](http://127.0.0.1:8000/docs) or [health](http://127.0.0.1:8000/health). Its endpoints include analysis, static URL inspection, follow-up questions, recovery guidance and image analysis. See [backend/README.md](backend/README.md) for endpoint payloads. Its rules/scores differ from the website's rules; integrating the service requires reconciling those contracts. A configured threat-intelligence field or evidence category does not prove that a live verification lookup is implemented.

## 8. Build and checks

From the project root:

```sh
pnpm exec tsc --noEmit
pnpm build --webpack
pnpm start --hostname 127.0.0.1 --port 3100
```

Stop the development server first if it uses the same port. `pnpm start` needs a successful build. The production build includes TypeScript validation.

For the Python backend, with its virtual environment active:

```sh
cd backend
python -m pytest app/tests -v
```

The latest website build and local functional checks passed in the development workspace. AI link review was checked with mocked provider responses (71 checks), account/cloud behavior with 129 checks, and existing website/audio/scanner behavior with 246 checks. The migration/access policies were also exercised in an isolated PostgreSQL database. The browser test harnesses ran outside this application source; the included Python tests are under `backend/app/tests/`.

Live Gemini and OpenAI calls still require your keys; no live AI accuracy claim is made. The previously configured Supabase project was reachable and denied signed-out history reads after its migration. A fresh copy must be configured for your project and verified with your own signed-in check. Native browser visual verification was not performed in this environment.

Bundled OCR assets are ready to use. After changing Tesseract dependencies, run `pnpm prepare:ocr` to refresh worker/engine files. Model provenance is in [public/ocr/README.txt](public/ocr/README.txt).

## 9. Common setup issues

| Problem | Action |
| --- | --- |
| AI buttons say unavailable | Add the correct key to root `.env.local`, restart Next.js and reload. |
| Provider rejects the request | Check API billing, quota, permissions and configured model access. A placeholder key is not a working connection. |
| Supabase sign-in unavailable | Check the Project URL/public key and rebuild/restart after public setting changes. |
| History table missing | Apply the supplied migration to the same Supabase project used in `.env.local`. |
| Sign-in asks for email confirmation | Open the confirmation email and check your Supabase redirect URL settings. |
| Device history differs between localhost and 127.0.0.1 | They are different browser origins. Use the same address consistently or use cloud history. |
| Port 3100 is in use | Stop the existing server, or use another port consistently and update auth redirect settings. |
| TypeScript mentions a deleted route in `.next/types` | Stop the server and run a fresh Next.js build to regenerate route types. |
| Changing Python rules has no website effect | The website currently uses TypeScript rules, not the separate Python service. |

## 10. Data boundaries and limitations

Local checker scores are heuristic warning scores, not fraud probabilities or proof of authenticity. AI page review can use cached/incomplete content and does not independently establish website ownership or scan for malware. Screenshot OCR and audio transcription can misread content. Review extracted text and use independent verification before acting.

Device history is visible to anyone using the same browser profile. Cloud history belongs to the signed-in account. Redaction removes common identifiers but can miss names or unusual private details. Raw screenshots are processed locally; recordings are shared with OpenAI only after the transcription action and permission step; AI chat and AI page review send their stated inputs to Gemini. Provider data policies apply.

Process-local rate limits are demo controls, not distributed production quotas. This package is the current working MVP, not a completed payment platform or a production security certification.

## Further documentation

- [Supabase setup and privacy](SUPABASE.md)
- [AI link-review setup and evidence handling](AI-LINK-REVIEW.md)
- [Audio setup and files](AUDIO.md)
- [Feature explanation and hackathon demo](HACKATHON.md)
- [Screenshot feature and revenue experiments](SCREENSHOTS-AND-REVENUE.md)
- [Subscription previews](SUBSCRIPTIONS.md)
- [Python API details](backend/README.md)

## Archive contents

The source ZIP includes application source, assets, dependency manifests/lockfile, environment templates, the database migration, Python tests and documentation. Install dependencies after extraction. Installed packages, Next.js build output, Python virtual environments, local configuration/keys and caches are excluded.
