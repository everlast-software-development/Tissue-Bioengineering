# Tissue Bioengineering

Website for Tissue Bioengineering, a regenerative-medicine practice treating burn scars, diabetic foot, wounds, scars, facial palsy and facial asymmetry. Clinical treatment is provided by Everlast Wellness Medical Center, Abu Dhabi. The site presents services, research, technologies, articles and case studies in English and Arabic, and emails Contact and Consultation form submissions to the clinic.

## Technology stack

- **Frontend:** React 19, TypeScript, Vite 5, React Router 6, Tailwind CSS 3, Framer Motion
- **Forms:** React Hook Form + Zod, react-phone-number-input, Cloudflare Turnstile
- **Backend:** Node.js ≥ 22.18, Express 5, Nodemailer (SMTP). One process serves the built site and `/api`
- **Hosting:** Railway

## Local development

```sh
npm install
cp .env.example .env    # fill in SMTP_* and TURNSTILE_SECRET_KEY
npm run dev             # site on http://localhost:3000, API on :8787 (proxied at /api)
npm run build           # site -> dist/, API -> server/dist/
npm start               # serve the built site and API on $PORT
npm run typecheck && npm run lint
```

## Important notes

**Deployment.** Railway must run `npm start`. Set the variables from `.env.example` on the service. `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` and `TURNSTILE_SECRET_KEY` are required (`EMAIL_*` aliases are accepted), and forms are refused until they are set. `GET /api/health` reports SMTP and Turnstile status without exposing values. `dist/` is tracked in the repository, so `npm run build` overwrites committed files.

**Turnstile.** For local development, either add `localhost` to the widget's allowed hostnames in Cloudflare, or use Cloudflare's always-pass test keys: `VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA` for the frontend and `TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA` for the server. If the widget is ever switched to Cloudflare's *Invisible* mode, the privacy policy must reference Cloudflare's Turnstile Privacy Addendum.

**Arabic.** English is served at `/…` and Arabic at `/ar/…` (right-to-left). The Arabic message objects are typed against the English ones, so `npm run typecheck` reports any missing translation. The Arabic font, Cairo, is self-hosted under the SIL Open Font License; keep `public/fonts/cairo/OFL.txt` with the font files. The site renders on the client, so crawlers that do not run JavaScript see the English `index.html` for every URL.

**Hero video.** The Home hero clip is pre-rendered with `tools/hero-video` (usage is in each script's header). The current assets were rendered with `render-frames.mjs --w 1728 --h 2160` and then `encode-alpha.mjs`. Encoding needs macOS (`hevc_videotoolbox`).

### Image licences

| File (`public/images/`) | Source | Creator | Licence |
|---|---|---|---|
| `diabetic-foot-examination.webp` | [Unsplash](https://unsplash.com/photos/x-ray-of-human-feet-against-a-black-background-IhGonjnG148) | Rohit Choudhari | Unsplash License |
| `biomedical-research-laboratory.webp` | [Pexels](https://www.pexels.com/photo/equipment-inside-a-laboratory-9574569/) | Tima Miroshnichenko | Pexels License |
| `surgical-team-operating-room.webp` | [Pexels](https://www.pexels.com/photo/operating-table-inside-a-room-7108118/) | Pavel Danilyuk | Pexels License |
| `stem-cell-culture-flasks.webp` | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Celcultuuroven.JPG) | Biol | Public domain |
| `research-laboratory-bench.webp` | [Unsplash](https://unsplash.com/photos/_9xRHrMOjeg) | Trnava University | Unsplash License |
| `bioprinting-laboratory.webp` | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Bioprinting.jpg) | Philip Ezze | **CC BY-SA 4.0** |

**Attribution is still owed.** The site does not show image credits yet. Before publishing, add these credits somewhere visitors can find them, such as an "Image credits" link in the footer:

- "Bioprinting" by Philip Ezze, via Wikimedia Commons (https://commons.wikimedia.org/wiki/File:Bioprinting.jpg), licensed CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/). Cropped and colour-graded; this modified version is also available under CC BY-SA 4.0.

No source or licence is recorded for `bioprinted-tissue-well-plate`, `craniofacial-skull-model`, `keloid-histopathology`, `nanofiber-scaffold-sem`, `peripheral-nerve-fibers` and `scaffold-bg`. Confirm their licences before publishing. Stock portraits that had been captioned as named staff were removed as misleading. Use only authentic, approved headshots for team members, never stock or AI-generated portraits.

### Content compliance (unresolved)

A scientific-content audit on 2026-11-09 found that none of the site's clinical, regulatory or scientific claims is supported by evidence in the repository. These claims are still on the site and need clinical, regulatory and legal sign-off before publication:

- "FDA-approved" therapies and an "FDA Approved" research badge, with no product or approval identified
- Absolute outcome claims such as "Zero Graft Rejection" and "100%" closure
- Systemic stem-cell and exosome infusions offered as outpatient services
- Case studies and testimonials, one involving a 9-year-old, with no consent records
- ISO 13485, GMP and HIPAA claims with no certificates or documentation
- All 8 research DOIs: 6 are not registered and 2 resolve to unrelated papers
- The 24/7 burn and trauma hotline, which must be confirmed as staffed

The Arabic translations reproduce these claims as written. The full audit (44 findings and an evidence checklist) and the open Arabic translation questions are kept in git history: `git show 3e65b90:docs/SCIENTIFIC-CONTENT-AUDIT.md` and `git show 3e65b90:docs/ARABIC-LOCALIZATION.md`.
