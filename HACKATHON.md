# ScamShield — features and hackathon guide

## Positioning and USP

**ScamShield turns a suspicious message into an explanation, a conversation, and a practical response plan — with private checks by default.**

Use the phrase **“Detect. Understand. Act.”** for the demo. The differentiator is the connected journey: local warning-sign detection → an explanation tied to the submitted words → optional contextual chat → a checklist tailored to what the person already did. Reassuring language does not cancel a malicious request elsewhere in a message.

This is proposed positioning for this build, not a claim that no other product offers similar functions.

## 1. Interactive content checker — `/`

Paste a message, email text, call transcript, or website link. The checker explains matched warning signs and gives a risk score with a practical next step. It detects requests for security codes or documents, arrest threats, urgent payments, remote-control/app installation, unusual income promises, reverse-payment/QR tricks, and suspicious link structures.

The updated rules consider protective wording at the individual request level. For example, “Never share your OTP. But send your OTP to me immediately” still triggers a high-risk result. Ordinary text containing a word such as “pay” is not automatically treated as a scam.

The result provides:

- Excerpts and plain-language explanations.
- A copyable report and a downloadable redacted summary.
- An “Ask about this” link into the assistant.
- An “I already responded” link into recovery planning.
- Optional local history, off by default.

Scores are deterministic heuristics, not fraud probabilities. A low score does not establish authenticity. An invalid link is not scored.

## 2. Safety assistant — `/assistant`

A separate conversation page supports basic questions about phishing, OTPs, UPI/QR payments, risky links, job/investment traps, identity documents, reporting, and recovery. Suggested questions help users get started. It recognizes simple follow-ups and offers a clear scope response for unrelated questions.

**Guided mode works now without a key.** It uses curated local answers; it is not generative AI. It can explain the latest scan when the user checks “Include the redacted findings.” It does not silently take the original content from the checker. Users can reset or download a redacted conversation.

**Gemini AI mode is implemented but optional.** Add a server key to `.env.local` and restart:

```env
GEMINI_API_KEY=your_server_key
GEMINI_MODEL=gemini-3.8-flash
```

Use an available Gemini model appropriate to the account. The interface enables AI mode only when the server reports that a key is configured. A configured key is not proof of valid provider access. Users explicitly choose AI mode, which sends their automatically redacted conversation and any opted-in check summary to Gemini through the server.

Keys remain on the server. The adapter has bounded input, a timeout, a process-local request limit, and user-visible provider failures with a guided-answer fallback. Actual provider access was not exercised with a real key. Provider contracts were tested using a stub.

Chats are held in page memory and are not restored after leaving the page. Never enter private credentials. Automatic redaction is imperfect.

## 3. Standalone link inspector — `/links`

Reveals the actual destination hostname, protocol, path, and whether a shortener hides the final website. Flags include:

- A hostname hidden behind an `@` sign.
- Selected brand lookalikes, using correct domain boundaries.
- HTTP, direct IPs, private/local addresses, unusual ports, and excessive subdomains.
- Punycode and selected domain suffixes, described as caution clues rather than proof of fraud.
- Executable download paths.

It never opens the target, resolves its DNS, follows redirects, or calls a reputation service. It can copy the findings and provide a redacted session summary to the assistant. A shortener’s final destination remains unknown. The brand list is intentionally limited.

## 4. Recovery planner — `/recover`

Six situations provide tailored checklists:

1. Money sent.
2. OTP or password shared.
3. Suspicious link clicked.
4. Unknown app installed or remote access granted.
5. Identity documents shared.
6. Threats, extortion, or pressure.

Check off steps, watch progress, reset the plan, or download it. Progress stays on the page unless downloaded. The planner does not freeze accounts, file reports, contact anyone, or guarantee recovery.

India-specific reporting guidance links to the [National Cyber Crime Reporting Portal](https://cybercrime.gov.in/). The Ministry of Home Affairs describes [1930 as assistance for financial cyber-fraud complaints](https://www.mha.gov.in/MHA1/Par2017/pdfs/par2024-pdfs/LS10122024/204.pdf). Payment guidance links to [NPCI fraud awareness](https://www.npci.org.in/fraud-awareness); technical awareness links to [CERT-In](https://www.cert-in.org.in/).

## 5. Private scan history — `/history`

Saving is optional. The browser retains up to 20 recent redacted summaries, not complete original messages. Users can search, filter by risk, review findings, export JSON, remove a record, clear history, or undo the latest removal while the page remains open.

A separate session record keeps the most recent redacted check available for the assistant. Optional Supabase email/password accounts can synchronize newly saved check summaries across devices when sync is enabled. Existing device history requires explicit import. See SUPABASE.md for setup. Anyone using the same browser profile may see locally saved summaries. Names or unusual private details may survive automatic redaction, so users should avoid sensitive input.

## 6. Learning challenge and pattern library — `/learn`

A six-message challenge asks whether a situation contains warning signs or looks routine. Each answer reveals the reasoning. The result shows a practice score and a review of all six situations. Users can restart and search a six-category pattern library.

The challenge includes a protective OTP warning, a QR-payment trick, arrest impersonation, routine appointment text, a task-job deposit, and a mixed reassuring/malicious message. A correct quiz answer is not a certification of real-world fraud-detection ability.

## 7. Animation and navigation

- Shared navigation connects all six pages and highlights the active page.
- Light page-entry and result animations.
- Animated risk and recovery meters reflecting real computed state.
- Card hover feedback and staggered findings.
- An activity indicator while an actual AI request is pending.
- Mobile navigation, keyboard-accessible tabs, visible focus, announcements, and reduced-motion support.
- Descriptive page titles and a local shield favicon.

No fake scan duration, microphone recording, or simulated AI response is presented as a live capability.

## A three-minute hackathon demo

**0:00–0:25 — The problem.** “People need more than a warning. They need to understand the request and know their next step.” Show the clean checker.

**0:25–0:55 — Explainable detection.** Try the bank security-message example, then paste: “Never share your OTP with anyone. But send your OTP to me immediately or your account will be blocked.” Show that the reassuring sentence does not hide the risky request. Point to the evidence.

**0:55–1:25 — A conversation with context.** Open “Ask about this,” opt in to the latest check, and ask “Explain my latest check.” Say clearly whether guided or Gemini AI mode is active.

**1:25–1:50 — Reveal a deceptive link.** In the inspector choose “Hidden host.” Explain why text before `@` is not the actual destination. Nothing is opened.

**1:50–2:20 — Move from detection to action.** Open the recovery planner, select “I sent money,” check a step, and download the checklist. Point to the official reporting links.

**2:20–2:45 — Build awareness.** Start the learning challenge and show the reasoning behind a QR trick.

**2:45–3:00 — Privacy and close.** Show optional redacted history. Repeat the USP: “An explanation, a conversation, and a response plan — private checks by default.”

## Engineering boundaries

The app is a local Next.js demo. The original Python backend is preserved but remains a separate implementation; the new website does not silently use it. Gemini chat uses a dedicated Next.js server endpoint.

No live sender verification, call recording, threat feed, cloud evidence vault, public deployment, or automatic complaint filing is claimed. A later update adds local English screenshot OCR at `/screenshots`, with text review before analysis; see the screenshot guide. Local text checks are English-pattern oriented, and redaction has known limits. The framework was patched from Next.js 16.4.0 to 16.4.2 to address the advisories reported for the original version. This is not a complete production security audit; review the full deployment before public hosting. The single-process chat limit is suitable for a local demo, not distributed production traffic.

Verification covers static types, a production build, functional component checks, input/redaction behavior, storage, recovery, quizzes, navigation, and stubbed AI success/error contracts. Automated real-browser visual checks were unavailable in the local environment; desktop/mobile CSS was implemented but cannot be described as visually verified.

## Screenshot update

A seventh page, `/screenshots`, now provides real local English OCR without an AI key. It includes image preview, reviewed-text analysis, cancellation, redacted report downloads, and optional redacted text history. Screenshots stay in memory and are not uploaded or saved. A real OCR fixture test passed, and the expanded functional suite passed 94 checks.
