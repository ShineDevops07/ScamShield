# ScamShield: screenshot scanning and a revenue plan

Prepared 23 October 2026. Pricing below is a set of hypotheses to test, not evidence of market demand or current revenue.

## What was added

Open `/screenshots` from the navigation or the screenshot shortcut in the checker.

1. Choose, drop, or paste a PNG, JPEG, or WebP screenshot, up to 5 MB.
2. Preview the image and select **Extract text**.
3. Read and correct the extracted text.
4. Select **Check reviewed text**. The existing local analysis engine explains warning signs.
5. Download a redacted report, discuss the latest check in the assistant, or open the recovery planner.

Recognition uses Tesseract.js 7.0.0 and a self-hosted English recognition model. Images are processed on the device; they are not uploaded to the server, sent to an external OCR provider, or stored in scan history. Worker, model, and engine files are delivered by this app. No AI key is needed for screenshot text extraction. The optional Gemini chat remains a separate opt-in feature.

The page includes real recognition progress, cancellation, a demonstration image, an editable review area, and optional redacted text history. File signatures are checked rather than trusting extensions. Declared image dimensions are checked before decoding; images above 20 megapixels or with an edge above 12,000 pixels are rejected.

The current feature is for printed English. Small text, stylized fonts, handwriting, mixed scripts, and poor-quality images may be misread. Users review extracted text before checking. The tool does not authenticate an image, inspect an attached file, or decode QR codes. A low-risk result is not proof of safety.

Verification: a real OCR run recognized the demonstration screenshot’s OTP demand and blocking threat. The functional suite passed 94 checks across the seven pages, including screenshot state, validation, cancellation, reviewed-text analysis, and the previous capabilities. Full real-browser visual verification remains unavailable in this local environment.

## Why might someone pay?

There is a real competitive hurdle: screenshot analysis itself is available in free products. [Norton’s official Genie FAQ](https://support.norton.com/sp/en/us/home/current/solutions/v20230717145233467) describes free screenshot checks. [Bitdefender’s Scamio page](https://www.bitdefender.com/en-us/consumer/scamio) also offers free image and text checks.

Your paid value proposition should therefore be specific and measurable:

- **Convenience:** reading a screenshot avoids copying or retyping a message.
- **Understanding:** findings explain the request and the words that triggered concern.
- **Practical response:** the checker connects to a conversation and incident-specific recovery steps.
- **Private handling:** local screenshot extraction and opt-in redacted history can appeal to privacy-conscious users.
- **Training:** the challenge and pattern library can support facilitated awareness sessions for institutions.

These are reasons to test demand, not proof that people will subscribe. The current project is a working demo, not a validated fraud-prevention service. It has not established a measured reduction in fraud losses.

## Recommended first revenue: a paid organizational pilot

Start with a narrow customer group, such as a college placement cell or a small employer wanting practical scam-awareness training.

**Offer:** a four-week facilitated pilot using the scanner, screenshot flow, learning challenge, and recovery materials, plus onboarding and a feedback session.

**Proposed price experiment:** ₹5,000–₹15,000 per organization for the pilot. Choose a scope you can actually support. This is a test range, not a researched market price.

Why an organization might buy: the coordinator gets a structured training activity and a practical tool to teach safer decisions. Your first deliverable is a supported service, which can be sold before a full enterprise platform exists.

Keep feedback aggregated and obtain consent for any collected examples. Do not promise employee monitoring, bank verification, or incident reporting features that are not implemented.

## Revenue options after pilot validation

| Model | Potential buyer | Paid value to build | Pricing experiment |
| --- | --- | --- | --- |
| Organization subscription | Colleges, employers, small associations | Team access, repeat training, aggregate learning reports, administration, and support | Start by converting a successful pilot into a negotiated annual license. |
| Family plan | Adults supporting relatives who want help reviewing suspicious messages | Explicitly consented trusted-contact review, shared history controls, and accessible language options | Test ₹99–₹199/month after these features exist. |
| Usage-based integration | Platforms or service providers | An authenticated API, quotas, usage reporting, privacy controls, reliability commitments, and embedding support | Paid integration pilot followed by an agreed usage allowance and overage price. |

The paid features in this table are a roadmap; they are not all present in the current build. In particular, optional Supabase accounts and private cloud check history are now implemented (see SUPABASE.md), while family sharing, organization dashboards, an authenticated public API, and billing remain planned.

Keep a useful free tier for basic checks and awareness. Let it help people experience the product. Charge for the supported workflow and additional capabilities once customers demonstrate demand.

## Example revenue arithmetic

Ten organizations paying ₹5,000 for a pilot would produce **₹50,000 gross pilot revenue**. It would not automatically be recurring monthly revenue or profit.

For a later family subscription, 100 paying families at ₹149/month would produce **₹14,900 monthly gross revenue**. These are arithmetic examples, not sales forecasts.

Track the costs before choosing prices: hosting and asset delivery, optional AI requests, cloud storage if introduced, support time, payment fees, and acquisition. Local OCR does not incur an external OCR request fee, but delivering the recognition assets and supporting users still cost money.

## What to prove before charging subscriptions

1. Interview around ten people in one target segment about recent suspicious messages and their current response.
2. Offer three clearly scoped paid pilots. A payment commitment gives stronger evidence than positive comments alone.
3. Measure repeat use, task completion, time to reach a safe next step, support effort, and willingness to renew.
4. Evaluate false alarms and missed scams on a separate labeled test set. Do not market the functional test count as detection accuracy.
5. Use the results to decide which paid workflow to build next.

## Suggested commercial pitch

“ScamShield gives people a private way to turn a suspicious screenshot into an explained assessment and a practical next step. For organizations, we package that experience into hands-on scam-awareness training and measurable learning workflows.”

“Measurable learning workflows” describes the proposed organizational offering; aggregated reporting would need to be implemented or delivered manually with consent during a pilot. Avoid claims that the product guarantees safety, prevents a particular amount of loss, or is uniquely capable of screenshot detection.
