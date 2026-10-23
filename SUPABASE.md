# Supabase account and history setup

ScamShield uses Supabase Auth for email/password accounts and Supabase Postgres for completed check summaries. The project works with device history if Supabase is not configured. No service-role key is needed.

## Connect your project

1. Open your Supabase project. Copy its Project URL and publishable key from the Connect dialog. The URL looks like `https://your-project-id.supabase.co`. A legacy anon key is also supported. Never use a secret/service-role key in the browser.
2. Copy `.env.example` to `.env.local` in this Next.js project. Keep any existing AI keys. Set:

   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   ```

3. In Supabase SQL Editor, run the contents of `supabase/migrations/202610230001_scamshield_history.sql`. Alternatively apply the migration through your Supabase CLI project. It creates `public.scamshield_checks`, its owner index, and four row-level security policies. No existing application tables are changed.
4. In Authentication settings, enable email/password sign-in. Keep email confirmation enabled for a deployed app. Set Site URL to your application origin. For local testing on the current server add `http://127.0.0.1:3100/account` to allowed redirect URLs. If you also use localhost, add `http://localhost:3100/account`. Use the production HTTPS URL on deployment. Existing `/account` confirmation URLs stay valid: they redirect to the home page, preserving the confirmation fragment, and open the popup. Configure your email sender/rate limits before wider use.
5. Install dependencies using pnpm, then start development with `pnpm dev --port 3100`. For the production preview run `pnpm build` then `pnpm start --port 3100`. Public environment variables are embedded at build time: rebuild after changing them.
6. Open the website. Signed-out visitors see a dismissible sign-in popup once per page load; use the cross, Escape, outside click or **Continue as guest** to browse without an account. Reopen it with **Sign in** in the header (or **Logged in** after signing in). Create an account, confirm your email if required, and sign in. Turn on **Sync new saved checks**. This preference applies to the signed-in account on this browser.
7. Complete a message, link, screenshot or audio check with its save checkbox selected. Open `/history` → **My cloud history**. A cloud success message appears only after the database confirms saving. Use a second browser signed into the same account to verify cross-device access.

## What is saved

Each row has a unique check ID, owner ID, date, channel, source, a redacted preview of up to 160 characters, and the assessment/findings. Source labels distinguish message, call, link, screenshot and audio checks. Payment receipts remain unverified/unscored; storing a check does not establish authenticity.

Raw images, recordings, full transcripts and assistant conversations are not uploaded to this table. OCR runs locally; audio transcription still uses the separately configured transcription provider. Redaction removes common numeric identifiers and email patterns but can miss names or other personal details. Review inputs before saving. Supabase Auth stores account information separately in its managed authentication tables.

Device history remains a separate browser list of the latest 20 saved checks. Existing device checks never upload automatically at sign-in. Review them, then use **Upload N device checks to my account** to import. Import is idempotent for the same account/check ID. Importing after deleting a cloud check can restore it from its device copy.

Cloud history loads 50 records per page. Search, filters and export operate on loaded records; use **Load more checks** for older entries. Remove individual cloud entries with the trash button. Device clear/undo applies only to the device list; cloud removal does not remove device copies. Signing out hides the cloud list and clears the in-memory retry queue. Auth sessions persist on this browser until sign-out or session expiry.

If a cloud save fails, the device copy is retained if browser storage allowed it. **Retry unsaved cloud checks** retries the current account’s memory-only failed saves; leaving the app or signing out discards that queue. The device import can recover retained local entries later. Turning sync off stops future automatic uploads; it does not remove already uploaded records or cancel an upload already in progress.

## Access control

The browser uses a public key and the signed-in user’s token. PostgreSQL row-level security permits authenticated users to read, insert, update and delete only rows whose `user_id` equals `auth.uid()`. Owner filters are also applied in client queries. Never disable RLS to fix access errors. The composite primary key `(user_id, id)` prevents duplicate uploads within an account.

Before deploying, verify isolation against your live project: account A saves a check; account B cannot see, modify or delete it, even with a direct API request using B’s token and A’s check ID. Signed-out API requests must fail. Local automated checks cover serialization, owner filters, auth behavior and failure states. The actual migration and account-isolation policies also pass in an isolated PostgreSQL (PGlite) database with an auth fixture. This does not replace the live-project policy test.

## Files added

- `lib/supabase/client.ts`: lazy browser SDK client and public configuration check.
- `lib/cloud-history.ts`: allowlisted redacted payloads, fetch, upload and owner-scoped delete.
- `components/cloud-history-provider.tsx`: auth session, sync preference, save listener, status and retry queue.
- `components/cloud-save-note.tsx`: current save behavior beneath check preferences.
- `components/auth-dialog.tsx`: optional sign-in/signup dialog, sign-out, sync settings, keyboard dismissal and focus restoration.
- `components/account-button.tsx`: opens the same dialog from the header, footer and save hints.
- `next.config.mjs`: redirects legacy `/account` confirmation links to the home page with the dialog open; there is no separate login page.
- `supabase/migrations/202610230001_scamshield_history.sql`: table, constraints, index and RLS.

The existing History page now provides device/cloud views, import, refresh, paging and cloud deletion. Check pages tag the source and emit a saved-check event; links now have a save option and retain their actual inspection findings. Paid subscriptions and family account sharing remain future features; these accounts do not activate billing.

Official references: [Supabase JavaScript client](https://supabase.com/docs/reference/javascript/initializing), [email/password sign-in](https://supabase.com/docs/reference/javascript/auth-signinwithpassword), [row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security).

## Signup failures

The popup displays specific signup failures and an error reference. See [AUTH-TROUBLESHOOTING.md](AUTH-TROUBLESHOOTING.md). The default Supabase email sender is restricted to project-team addresses and currently two emails/hour; email/password account creation may require configuring custom SMTP for other users. Do not infer a specific cause from the old generic message alone.

Successful login closes the popup and updates the header to **Logged in**. Clicking that button reopens account settings and sign-out. Successful signup also closes the form; if email confirmation is pending, a reminder appears and the app waits for a real session before showing Logged in.
