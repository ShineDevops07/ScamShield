# ScamShield plans and subscription page

Open `/pricing`, or select **Plans** in the navigation. The page uses the prices accepted for this project, within the previously proposed ₹99–₹199/month family range and ₹5,000–₹15,000 four-week organization pilot range.

| Plan | Price | Status and scope |
| --- | --- | --- |
| Free | ₹0 | Available now: current message, transcript, screenshot, and link checks; guided safety conversations; learning; recovery checklists; optional local history; downloads. |
| Family Essential | ₹99/month | Planned: trusted-contact invitations, shared second-opinion requests, and family awareness reminders, alongside the free tools. |
| Family Plus | ₹199/month | Planned: Essential benefits plus a shared family review dashboard, review status and follow-up reminders, and a monthly learning recap. |
| Starter pilot | ₹5,000 for four weeks | Proposed service scope: guided tool introduction, one awareness workshop, a recovery resource pack, and a feedback review. |
| Extended pilot | ₹15,000 for four weeks | Proposed service scope: Starter plus a follow-up workshop, audience-specific scenarios, and a written feedback and next-step summary. |

There is no annual-price toggle, invented discount, or extra plan price. The pilots are single four-week programs with no automatic renewal. Paid plans cannot be purchased yet. Optional Gemini usage requires a separately configured key and is not included in these plan prices.

## Working interactions

- Switch between individuals/families and organizations. The cards and comparison table update together.
- Explore a family plan or preview an organization pilot to open its summary. The heading receives keyboard focus; closing returns focus to the triggering button.
- Pick a preferred pilot focus: everyday safety, payment scams, phishing, students, or older adults.
- Download a text plan summary or pilot brief with the chosen price, scope, and focus. This is a device-local download, not a submitted booking or order.
- Read six expandable FAQs covering free access, availability, family benefits, pilots, billing terms, and product limitations.
- Use the free checker and screenshot scanner directly from this page.

The layout adapts to small screens with stacked cards and a horizontally scrollable comparison table. Styles follow the existing restrained green and neutral palette, including visible keyboard focus and reduced-motion support.

## Storage and billing

Plan selections stay in page memory. There is no pricing database, waitlist, email submission, subscription record, checkout session, payment gateway, or fake purchase success state. Downloading a summary does not submit information to anyone. Existing optional local scan history is unaffected.

Before taking payments, implement the actual family capabilities, account and consent controls, secure server-side checkout with a payment provider, verified payment webhooks, subscription entitlement storage, billing management and cancellation, and final invoice/tax details. A pilot must have an agreed scope, delivery owner, and schedule before booking. Do not advertise future benefits as active until they work.

## Verification

123 functional checks pass across the eight pages and shared logic, including approved prices, audience switching, plan previews, correct exports, pilot-focus selection, focus restoration, unchanged storage, and clear non-purchase status. TypeScript checking and the production build pass. The tests do not measure scam-detection accuracy. Native browser visual verification is unavailable in this environment.
