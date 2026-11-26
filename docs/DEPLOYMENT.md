# Halleyvine landing page: deployment and operations

## Stack
Next.js (App Router, TypeScript), Bootstrap 5 (Sass), Nodemailer (SMTP). Built as a standalone Node server in a Docker image.

## Deploy on Dokploy (Dockerfile build)
1. Create an **Application** in Dokploy and connect the Git repository.
2. Build type: **Dockerfile**, Dockerfile path `./Dockerfile`, container port `3036` (set by `PORT` and `EXPOSE` in the Dockerfile).
3. Add environment variables (see `.env.example`):
   - Runtime: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SALES_TO_EMAIL`, `SALES_FROM_EMAIL`.
   - Build-time (set as build args, inlined into the client bundle): `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID`.
4. Domains: add `halleyvine.online`, point its DNS A record at the Dokploy server, and enable HTTPS (Let's Encrypt).
5. Health check path: `/api/health`.
6. Deploy. Submit a test enquiry and confirm the email reaches `SALES_TO_EMAIL`.

If SMTP is not configured, the form shows a friendly error that points visitors to WhatsApp, and the server logs a message (no personal data).

## Local development
```
cp .env.example .env.local
npm install
npm run dev          # http://localhost:3000/?src=test-code
npm test             # unit and component tests
```
For local email testing, run Mailpit (`docker run -p 1025:1025 -p 8025:8025 axllent/mailpit`) and set `SMTP_HOST=localhost`, `SMTP_PORT=1025`, `SMTP_SECURE=false`, with any sender/recipient addresses. Open http://localhost:8025 to see the email.

## Campaign QR codes
Every ad or bulletin gets its own source code (letters, digits, `-`, `_`; up to 64 characters), for example `stmarys-bulletin-jan`.
```
node scripts/qr.mjs stmarys-bulletin-jan,graceland-flyer-feb
node scripts/qr.mjs codes.txt ./qr-codes
```
Each PNG encodes `https://halleyvine.online/?src=<code>`. The code is saved for the browser session, added to the sales email (Source line and subject), and added to WhatsApp messages as `(Ref: <code>)`.

## Placeholders checklist
Images are `null` in `src/content/site.ts` until a file exists, and the page shows a labelled placeholder meanwhile. To replace one, save the file under the name below, then set the matching field in `site.ts` to the value shown. Leave a field as `null` until its file is in place, otherwise the image will not load.

### Images
| Checked | Section (placeholder label) | Save file as | Set in `site.ts` | Suggested size |
|---|---|---|---|---|
| [x] | Hero slideshow (`hero-1.jpg` and `hero-2.jpg` added) | `public/images/hero-1.jpg`, `hero-2.jpg`, `hero-3.jpg`, ... in display order | add `{ src: "/images/hero-3.jpg", alt: "..." }` to `hero.images` | 2400 x 1500, landscape, subject centred (cropped to portrait on phones) |
| [ ] | Introduction ("Introduction image") | `public/images/intro.jpg` | `intro.image: "/images/intro.jpg"` | 1920 x 1080 (16:9) |
| [x] | Two-bedroom floor plan (added) | `public/plans/two-bed.jpg` | `apartments.units[0].floorPlan: { src: "/plans/two-bed.jpg", width: 2276, height: 1280 }` | Any shape; shown whole (not cropped). White background, about 2400 to 2800 px wide so labels stay readable when enlarged |
| [x] | Three-bedroom floor plan (added) | `public/plans/three-bed.jpg` | `apartments.units[1].floorPlan: { src: "/plans/three-bed.jpg", width: 2800, height: 1340 }` | Same as above |
| [ ] | Living experience ("Living experience image") | `public/images/living.jpg` | `living.image: "/images/living.jpg"` | 1920 x 1080 (16:9) |
| [ ] | Location ("Novare Mall, Sangotedo") | `public/images/novare-mall.jpg` | `location.image: "/images/novare-mall.jpg"` | 1920 x 1200 (16:10); keep the bottom-right corner plain, because the map overlay covers it |
| [x] | Developer logo, footer "Developed by" (added) | `public/images/logo-chateau-royal.png` | `developer: { name, logo: { src, width, height } }` | Transparent PNG or SVG; shown 150 px wide on a light plate |
| [ ] | Favicon | `src/app/icon.png` | no change needed (Next.js detects it) | 512 x 512, square |
| [ ] | Social share preview | `src/app/opengraph-image.jpg` | no change needed (Next.js detects it) | 1200 x 630 |
| [x] | Logo (added) | `public/images/logo.png` | `logo: { src, alt, width, height }`; set width/height to the file's pixel size | Transparent PNG or SVG cropped tight to the artwork (no empty margin); shown 52 px tall on phones, 60 px on desktop |

JPG or PNG both work; if you use `.png` or `.webp`, use that extension in the `site.ts` value too. Next.js converts images to AVIF/WebP and resizes them automatically, so export at the sizes above without heavy compression. Keep each source file under about 1 MB.

### Content
- [ ] Approved introduction text (`intro.body`)
- [ ] Unit details for each floor plan, such as size and finishes (`apartments.units[].details`)
- [ ] Confirmed amenities list (`living.amenities`)
- [ ] Exact project address or coordinates for the map (`location.mapQuery`, for example `"6.4698,3.6285"`)
- [ ] Verified coastal road distance and access details (`location.coastalCallout`)

### Other
- [ ] Brochure PDF (not yet sent automatically; the visitor's email is included in the sales email)
- [ ] Sales recipient email and SMTP credentials
- [ ] Analytics IDs (optional)

## Not included yet
- Automatic brochure email to the visitor (deferred; the optional email field is already collected).
- Lead storage beyond email (Google Sheets was dropped for now).
