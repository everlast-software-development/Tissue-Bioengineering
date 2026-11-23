# Website forms: email delivery

Every form on the site posts to the Node API in `server/`, which sends one notification email
per submission with **Nodemailer over SMTP**. Nothing else sends mail; there is no third-party
email API.

| Form | Page | Endpoint | Subject |
| --- | --- | --- | --- |
| Contact form | `/contact` (`src/pages/Contact/ContactForm.tsx`) | `POST /api/v1/contact` | New Contact Form Submission |
| Consultation request | `/consultation` (`src/pages/Consultation/ConsultationForm.tsx`) | `POST /api/v1/consultations` | New Consultation Request |

Addressing (fixed in `server/config.ts`, overridable by env):

- **To:** `info@tissuebioengineering.com` (`MAIL_TO`)
- **From:** `Tissue Bioengineering <no-reply@tissuebioengineering.com>` (`MAIL_FROM_NAME`, `MAIL_FROM`)
- **Reply-To:** the visitor's name and email address (never used as the sender)

The visitor sees a success message only after the SMTP server has accepted the message for
`MAIL_TO`. Any SMTP failure returns an error to the form, which shows it and keeps the typed values.

## Configuration

Copy `.env.example` to `.env` locally, or set the same variables on the Railway service.
Required: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` and `TURNSTILE_SECRET_KEY`. The rest
have defaults.
The `EMAIL_*` names from the hosting setup (`EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`,
`EMAIL_PASS`, `EMAIL_SECURE`, `EMAIL_FROM`, `EMAIL_FROM_NAME`, `EMAIL_TO`, `EMAIL_TIMEZONE`)
are accepted as aliases. Credentials are read only by the server process; nothing is bundled
into the frontend except the public Turnstile site key.

`GET /api/health` reports whether the SMTP connection verified (it is also verified at startup),
whether Turnstile is configured, and names any missing variables, without exposing their values.

## Cloudflare Turnstile

Both forms run Cloudflare Turnstile invisibly (`src/components/forms/Turnstile.tsx`): the widget
is rendered with `execution: 'execute'` and `appearance: 'interaction-only'`, so nothing is shown
and no space is taken while the form is filled in. On submit the form calls `getToken()`, which
runs the challenge in the background and resolves with a fresh single-use token that is sent as
`turnstileToken` in the JSON payload; without one the request is never made and the form shows
an error banner instead. Only when Cloudflare decides the visitor must interact (a checkbox) does
the widget appear, with the "Security check" label, just above the submit button for the duration
of that interaction. The widget's script is loaded only on pages with a form and uses the site's
dark theme and the page's language (English or Arabic).

Whether an interactive challenge can ever appear depends on the widget's mode in the Cloudflare
dashboard: with a **Managed** widget, `interaction-only` shows it only to suspected bots; with an
**Invisible** widget nothing is ever shown (Cloudflare then requires a reference to its Turnstile
Privacy Addendum in the site's privacy policy).

The server (`server/turnstile.ts`) sends every token to Cloudflare's `siteverify` endpoint with
`TURNSTILE_SECRET_KEY` and the visitor's IP before anything else happens. A rejected token
(expired, already used, or a failed challenge) returns a 400 with a `turnstileToken` field error,
shown by the form as its error banner; the next submit runs a new challenge and sends a new token.
If the secret key is missing, or Cloudflare cannot be reached or rejects the secret, the
submission is refused with a 503 and the error is logged. The honeypot is still checked first.

Keys: the **site key** (public) is the default in `Turnstile.tsx` and can be overridden at build
time with `VITE_TURNSTILE_SITE_KEY`; the **secret key** is `TURNSTILE_SECRET_KEY` on the server
(Railway variable or local `.env`). Both come from the Cloudflare dashboard (Turnstile section),
where the widget's allowed hostnames are managed: `localhost` must be listed there for the widget
to work in development (otherwise the challenge fails with Cloudflare error 110200). Alternatively
build with `VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA` and run the server with
`TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA` (Cloudflare's always-pass test keys).

## Running

```sh
npm run dev          # both of the below, with [web]/[api] log prefixes; Ctrl+C stops both
npm run dev:web      # Vite on :3000 only, proxies /api to the API server
npm run dev:server   # API on :8787 only (runs the TypeScript directly; Node >= 22.18)

npm run build        # site -> dist/, API -> server/dist/
npm start            # serves dist/ with SPA fallback + the API on $PORT
```

On Railway the service must run `npm start` (one Node process serves both the site and the
API). The API is same-origin, so no CORS or `VITE_API_BASE_URL` is needed. If the site is ever
hosted elsewhere, set `CORS_ORIGIN` on the API and `VITE_API_BASE_URL` at build time.

## Safeguards

- Server-side validation with zod (`server/forms.ts`); unknown fields are rejected, so a new
  form field cannot be dropped silently. Single-line fields reject CR/LF (header injection).
- HTML body is escaped field by field (in `server/email/components.ts`); a plain-text
  alternative built from the same data is always included.
- Per-IP rate limit on the form endpoints (5 per 15 minutes by default, `FORM_RATE_LIMIT_*`).
- Hidden honeypot field (`website`); filled submissions are discarded with a fake success.
- Cloudflare Turnstile token on every submission, verified server-side (see above).
- JSON bodies capped at 64 KB. Internal errors are logged as JSON lines without credentials;
  visitors only see generic messages.

## Header logo

The email header shows the official logo, embedded in each message as an inline image
(`cid:logo@tissuebioengineering.com`) rather than linked from a URL, so it displays without the
"download pictures" prompt in Outlook for Windows. The file is
`server/email/assets/tissue-bioengineering-logo-email.png`: a PNG copy of
`public/images/tissuebioengineering-header.webp` at 388 x 116 (shown at 194 x 58). If it is
missing, the header falls back to the text wordmark and a warning is logged; sending still works.

## Adding a form

1. In `server/forms.ts`, add the form's schema and its email template (copy `contactEmail`: a
   typed label for every field, grouped into sections), then add a definition to `FORMS`
   (schema, endpoint, subject, `email: yourTemplate`). The shared layout, header, metadata,
   reply note, footer and plain-text version come from `server/email/` automatically.
2. Register it in `server/index.ts` with `registerForm(...)`.
3. Add the endpoint and a submit function in `src/lib/api.ts`; let submission errors propagate
   so the form can show them.
4. Include `turnstileToken` in the server schema. On the page, submit through
   `useFormSubmission` and end the form with `<FormSubmit>` (both in `src/components/forms/`;
   copy the contact form): they run the invisible Turnstile check on every attempt and show the
   server's errors. The route verifies the token after schema validation and the honeypot check.
