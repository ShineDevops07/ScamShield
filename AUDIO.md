# ScamShield audio transcription

## Start

The Audio navigation link opens `/audio`. The existing Next.js server provides this feature; you do not need to run the separate Python backend or install a system speech-recognition package.

1. Obtain an OpenAI API key with access to the configured transcription model and available API billing.
2. Add `OPENAI_API_KEY=your_real_api_key` to `.env.local` in the project root. Never use `NEXT_PUBLIC_OPENAI_API_KEY` or paste a key into the website/chat.
3. Optionally set `OPENAI_TRANSCRIBE_MODEL=gpt-transcribe` in the same file. This is the default.
4. Restart Next.js: `pnpm dev --webpack --hostname 127.0.0.1 --port 3100`.
5. Open `http://127.0.0.1:3100/audio`. The page reports whether transcription is configured. Key presence is not proof that provider billing or model access will succeed; errors are explained when a request is made.

The root settings are independent of `backend/.env` and of `GEMINI_API_KEY`. Gemini chat and local Tesseract screenshot OCR remain separate features.

## User flow

1. Choose or drop an MP3/WAV recording up to 20 MB. Header checks reject unsupported files, empty files, and obvious renamed non-audio. These checks do not authenticate audio or guarantee that every damaged file is playable.
2. Listen using the local audio player. File selection/playback does not upload it.
3. Confirm that the recording may be shared with OpenAI. Click **Transcribe audio** to upload it through this server. The UI shows an actual pending state without a fabricated progress percentage.
4. Review the editable returned transcript. Correct errors in amounts, requests, and negation. The page does not automatically run a scam assessment.
5. Select **Check reviewed transcript** to run the existing local call-text engine.
6. Optionally save a redacted text summary, download the redacted transcript or assessment, ask the assistant about a completed assessment, or open recovery guidance.

**Load sample transcript** inserts clearly labeled example text. It never pretends to transcribe the selected recording. Pasting and checking a transcript works even without an OpenAI key.

Changing/removing the recording clears its transcript, result, and consent. Editing the transcript clears its previous result. Cancellation discards a late response and forwards an abort signal to the provider where supported. Already-started provider work may still be processed or billed.

## Files added

| File | Purpose |
| --- | --- |
| `app/audio/page.tsx` | Upload/drop, local audio playback, availability, consent, transcription/cancel, editable review, local check, history option, exports, and results. |
| `app/audio/layout.tsx` | Page title and description metadata. |
| `app/api/transcribe/route.ts` | Server-only transcription adapter: GET capabilities; POST bounded multipart upload, consent, audio validation, provider request, cancellation, and sanitized errors. |
| `lib/audio.ts` | Shared MP3/WAV header validation, file/text limits, basic language-coverage checks, and call-assessment wrapper. |
| `AUDIO.md` | This setup and implementation guide. |

Updated shared files: `components/site-header.tsx` adds Audio; `app/page.tsx` adds the Phone call recording shortcut; `app/globals.css` styles the page; `.env.example` documents the key/model; `app/pricing/page.tsx` clarifies external API usage; `README.md` documents the route and setup.

## Server contract

- `GET /api/transcribe`: returns `available`, provider name, formats, and maximum file bytes, without returning keys. Responses use `Cache-Control: no-store`.
- `POST /api/transcribe`: multipart form with one `file` and `consent=true`. Missing key returns 503; missing consent returns 400; unsupported audio returns 415; oversized upload returns 413.
- Default provider request: `POST https://api.openai.com/v1/audio/transcriptions`, using `gpt-transcribe` and a prompt asking to preserve wording/language without summarization or translation. MP3 is forwarded directly; WAV is also accepted. No conversion to a larger WAV is needed for an MP3.
- The original filename is replaced by `recording.mp3` or `recording.wav` before forwarding. Private filenames and keys are not returned to the browser or saved in reports.
- Successful response: `{text, languages, provider}`. Only a real returned transcript is used; empty/invalid provider outputs are errors.
- Transcripts are limited to 50,000 characters for review/export. The local checker accepts 10,000 at a time. Longer text is not silently truncated; users must shorten it before checking.
- The server bounds the actual streamed body to 20 MB plus 64 KB of multipart overhead, rather than relying only on Content-Length. Declared oversize requests are rejected early.
- Same-origin browser uploads are checked. The demo allows one active request and six attempts per minute per server process. These are local-demo controls, not authenticated per-user quotas or distributed billing protection.
- Provider calls have a 110-second deadline; the browser request has a 120-second deadline. Deployment hosting limits may be shorter and must be checked before public hosting.

## Privacy and limitations

Audio is held in page/server memory for the request, not written by this app to disk, browser storage, or scan history. The provider receives the recording, so do not describe this as offline or device-only transcription. Review [OpenAI data controls](https://developers.openai.com/api/docs/guides/your-data). The application does not claim a particular provider retention period or zero retention.

Optional history contains a redacted call-text summary, using the existing browser storage settings. Redaction is imperfect, and it cannot strip sensitive speech from the audio before upload. The provider may already have processed a recording by the time a cancellation arrives.

The transcription service can return languages beyond English. The scam rules remain English-oriented. Detected non-English language codes or substantial non-Latin text cause a limited-coverage result; if no substantial English warning matched, no score or history entry is created. Mixed-language text with an English warning can still show that finding alongside a limitation. These checks are not a complete language detector and do not validate translation quality. Use a carefully reviewed English version for the English checker.

No automatic translation, voice cloning, caller identity verification, speaker matching, live microphone capture, telephone recording, or audio-edit detection is claimed. Low-risk English text results still do not prove caller authenticity.

## Verification

The combined suite passes 246 functional checks across the nine pages and shared logic. New audio checks use a silent WAV fixture, MP3 header fixtures, and stubbed provider responses; they cover the UI lifecycle and HTTP contract, not recognition accuracy. Tests include review-before-checking, manual fallback, redacted exports, opt-in history, unavailable configuration, bad/mislabeled files, absent consent, size limits including streamed requests, model configuration, provider failures, concurrent requests, rate limits, abort propagation, and late-response suppression.

No live OpenAI transcription was run without a configured key. Real-browser playback and visual verification are unavailable in this environment. Test a permitted real recording after configuration; verify Hindi-English transcription quality with representative samples before claiming accuracy.

Official references checked 23 October 2026: [File transcription](https://developers.openai.com/api/docs/guides/speech-to-text) and [Create transcription API](https://developers.openai.com/api/reference/resources/audio/subresources/transcriptions/methods/create).
