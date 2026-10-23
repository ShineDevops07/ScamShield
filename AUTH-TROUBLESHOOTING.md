# Signup troubleshooting

The original generic account-creation message did not expose which Supabase condition failed. The popup now shows a fixed, readable explanation and a safe **Error reference**. This update improves diagnosis; it does not change Supabase project settings or bypass email confirmation.

## Find the exact failure

On the laptop showing the error, open the site in Chrome or Edge. Open Developer Tools (F12), select Network, retry signup, and select the request containing `/auth/v1/signup`. In Response, read `error_code`/`code` and `msg`/`message`. Share only the error code and a non-sensitive message. Do not share request headers, passwords, API keys or tokens.

The project owner can also inspect the failed signup event in Supabase's authentication logs. The screenshot alone cannot establish the root cause.

## Common error references

| Reference | Meaning and action |
| --- | --- |
| `email_address_not_authorized` | Supabase's built-in SMTP sender cannot send to this address. It is restricted to addresses belonging to the project's organization/team. Configure a custom SMTP sender for user emails; for a team-only test, use an existing team member's own address. Do not grant organization access merely to let ordinary app users sign up. |
| `over_email_send_rate_limit` | The email-sending quota was exceeded. Wait for the quota to reset; avoid repeated retries. The built-in sender currently allows two emails per hour. Configure an appropriate custom sender for broader use. |
| `weak_password` | The project's password policy rejected the password. Use a longer password satisfying the configured character rules. |
| `signup_disabled` | Enable registration in the project's Auth settings if registration is intended. |
| `email_provider_disabled` | Enable email/password authentication for the project. |
| `email_not_confirmed` | Open the confirmation email, including checking spam, before signing in. |
| `invalid_credentials` | Check the sign-in details and required confirmation. |
| `captcha_failed` | Inspect the configured verification/CAPTCHA integration. |
| `unexpected_failure` | Inspect the server-side Auth logs; possible causes include mail delivery, hooks or database triggers. The generic screenshot does not identify which. |
| No code, HTTP 401/403 | Check the Project URL and public key belong to the same Supabase project. |

The website's root `.env.local` contains the public project settings. Restart the development server after editing it; rebuild production after changing public settings. The standalone Python backend does not handle this website's signups.

## Install the small patch on another laptop

Copy the patch's two files into the existing project, preserving these relative paths:

```text
scamshield/
├── components/
│   └── auth-dialog.tsx        # Replace this file
└── lib/
    └── auth-errors.ts        # Add this file
```

Keep `.env.local` and the rest of your project. Restart development with `pnpm dev --webpack --hostname 127.0.0.1 --port 3100`. For a production preview, rebuild and restart instead. Retry signup once and read the displayed Error reference.

Local verification: TypeScript and signup/account functional tests pass with mocked Supabase errors. No live signup, confirmation email, user record or authentication setting was changed by this patch. The remote signup failure remains unconfirmed until its error code/log event is available.

Official references: [Supabase auth error codes](https://supabase.com/docs/guides/auth/debugging/error-codes), [default sender restrictions and custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp), [Auth rate limits](https://supabase.com/docs/guides/auth/rate-limits).
