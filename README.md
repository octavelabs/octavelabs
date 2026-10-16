# Octave labs website

A responsive implementation of the supplied Figma landing page, using local artwork, semantic HTML, CSS, vanilla JavaScript and a Node.js email endpoint. No production dependencies are required.

## Run locally

Requires Node.js 22 or newer.

```sh
cd octavelabs
npm run dev
```

Open http://localhost:3000. Refresh after editing frontend files. Restart the server after changing server code or environment variables.

## Enable Resend bookings

Copy `.env.example` to `.env` after cloning. The local `.env` file is ignored by Git. Set `RESEND_API_KEY` locally; do not put it in frontend code.

1. Add `octavelabs.co` in your Resend dashboard and add the DNS records Resend supplies. Wait until the domain is verified.
2. Create a sending API key and set `RESEND_API_KEY` in `.env`.
3. The configured sender is `Octave labs <bookings@octavelabs.co>` and the recipient is `clinton@octavelabs.co`. Adjust `RESEND_FROM_EMAIL` if you prefer another address on the verified domain.
4. Restart `npm run dev`. Submit a real enquiry to verify delivery.

The endpoint calls [Resend’s send-email API](https://resend.com/docs/api-reference/emails/send-email). The visitor’s email is used as `reply_to`, so replying to a booking reaches the visitor. Recipient and sender are controlled only by server configuration. No email is sent until a key is supplied. The UI reports failures honestly and provides the direct email address as a fallback.

## Files

- `src/index.html`: page content, Figma artwork markup, pricing copy, and enquiry dialog.
- `src/styles.css`: design tokens, responsive layouts, interactions and Figma animation tracks.
- `src/figma.css`: converted Figma layer styles, including the small product previews.
- `src/site.js`: shared navigation and booking form.
- `src/app.js`: homepage motion, service accordion and plan selection.
- `src/logg.html`, `src/case-study.css`, `src/case-study.js`: responsive Logg case study, scroll reveals and accessible image viewer.
- `src/assets/`: original local Figma images and SVGs; no expiring URLs.
- `server.mjs`: static server and `POST /api/bookings`.
- `scripts/build.mjs`: packages the frontend into `dist/`, checking local image references.
- `tests/bookings.test.mjs`: mocked email delivery, validation, configuration failures, origin checks and private-file protection.

## Checks and build

```sh
npm test
npm run build
```

For production on a Node host, build first, set the same environment variables, set `NODE_ENV=production`, set `HOST=0.0.0.0` as appropriate for your host, and run `npm start`. Put the service behind HTTPS. A static-only host will not run the booking endpoint.

The request limiter is process-local and allows ten attempts per IP per ten minutes. If deploying multiple instances or behind a proxy, use your host’s shared rate-limiting controls; the server deliberately does not trust arbitrary forwarded IP headers.

## Content and verification

Pricing descriptions, scopes and service-specific prices are draft proposals. Edit the static `#pricing` content in `src/index.html`; all four service panels are available without JavaScript. Starting prices (Starter / Growth / Scale):

- Mobile Development: £3,000 / £6,500 / £12,000.
- Web Development: £1,000 / £3,000 / £6,500.
- UI/UX & Brand Design: £750 / £2,000 / £4,500.
- Product Strategy: £500 / £1,500 / £3,500.

Desktop pricing pins only when the full stage fits the viewport. Scroll switches service panels, and package buttons provide direct navigation. Small screens, short viewports and reduced-motion settings use natural document flow with all packages visible. Selecting a plan prefills both its service and tier in the booking form.

Service panels open automatically as their headings enter the reading area, retaining earlier content to prevent scroll jumps; manual toggles remain available. Process cards reveal on entry and their illustrations float gently. Reduced-motion preferences disable these effects.

Featured projects share consistent image frames, copy layouts, tags, and two CTA positions. All five case studies are connected: `/breed.html`, `/logg.html`, `/sabiplay.html`, `/foureen.html`, and `/landlord.html`. Their live links point to `https://joinbreed.com`, `https://uselogg.com`, `https://sabiplay.app`, `https://foureen.com`, and `https://playlandlord.app` respectively. Landlord was previously named Naija Tycoon.

Footer social links are LinkedIn (`https://www.linkedin.com/company/octavelabs/`), Instagram (`https://instagram.com/octavelabshq`) and X (`https://x.com/octavelabshq`), in that order.

Desktop and 390px mobile layouts were checked in Chrome, including original artwork, navigation, service accordions, package preselection and the unavailable-email state. Email success and error responses are covered with mocked API tests; live Resend delivery awaits your credentials and domain verification. No public deployment has been made.

## Logg case study

The page follows the supplied case-study frame: hero, overview, opportunity, onboarding, user needs, solution, process, applicant dashboard, partner dashboard, website design, and results. All 13 images are local, unmodified Figma PNG exports; source frame names are recorded in `src/assets/logg/SOURCE.md`. Product screenshots retain the text in the original designs. New case-study prose replaces the layout’s placeholder text, and results describe the delivered experience without claiming measured business outcomes.

Screenshots open in a keyboard-dismissable image viewer, with normal image links available without JavaScript. Booking and navigation use the same shared script as the homepage. Desktop and 390px mobile previews, modal focus return, gallery loading, project navigation, and all four mocked booking tests were checked.

## Breed case study

`src/breed.html` reuses Logg’s section structure, shared styling, booking dialog, scroll reveals and image viewer. It includes live website screenshots and both believer and preacher workspaces. Assets and capture provenance are in `src/assets/breed/`. Copy describes product capabilities without claiming measured outcomes or an unconfirmed project timeline.

### Case-study gallery convention
Sabiplay is available at `/sabiplay.html`. All case studies share `case-study.css` and the full-image viewer. Screenshots fill the frame width without distortion, align at the top, and share an explicit `--shot-ratio` within each row. Set the row ratio to at least the widest source image ratio (default 1.6 for paired screens, 16/9 for wide screens); tall screens preview above the fold and open in full on click. Include intrinsic image width/height to reserve layout space.

Foureen’s case study is available at `/foureen.html` and linked from Featured Works. Public website captures and provenance are in `src/assets/foureen/`. It uses the shared case-study gallery and full-image viewer.

Landlord (formerly Naija Tycoon) is available at `/landlord.html`. Featured Works now uses its current name, gameplay screenshot, and `https://playlandlord.app` live URL. Screenshot provenance is recorded in `src/assets/landlord/SOURCE.md`.


## Breed mobile and light mode
Breed uses light-mode product captures throughout. Its mobile section includes six owner-supplied screenshots in two groups, with full-proportion frames, captions, and image enlargement. Desktop and 390px mobile layouts were checked. Capture provenance is recorded in `src/assets/breed/SOURCE.md`.

## Deploy on Vercel

The committed `vercel.json` selects the **Other** framework, runs `npm run build`, and serves `dist/` directly from Vercel’s CDN. Only `/api/bookings` invokes a Node function, using the same validation and Resend logic as the local server. Do not configure a catch-all rewrite to `server.mjs` or use the standalone Node server as the Vercel entry point.

Set these project environment variables for Production and Preview as needed:
- `RESEND_API_KEY`: your Resend key.
- `RESEND_FROM_EMAIL`: `Octave labs <bookings@octavelabs.co>` after domain verification.
- `BOOKING_TO_EMAIL`: `clinton@octavelabs.co`.

Redeploy after changing environment variables. Missing email configuration returns an honest 503 response from the form; it does not prevent pages or images from loading. The existing process-local limiter is best-effort across serverless instances; use Vercel’s shared rate-limiting controls for cross-instance enforcement.

The standalone `npm start` server remains available for other Node hosts.

### Deployment ownership

For the Vercel project hosted under `adabanyac`, merge deployment PRs using the GitHub account connected to that Vercel owner (`AdabanyaC`). On Hobby, Vercel requires the commit author to be the project team's owner; repository collaborator access alone does not grant deployment access. See [Vercel's collaboration requirements](https://vercel.com/docs/deployments/troubleshoot-project-collaboration).

If a deployment is **Blocked**, open its details and check the stated reason before changing application code. A blocked deployment has not verified the build or runtime fix. After an owner-authored merge, confirm the new `master` deployment is **Ready** and check the homepage and a case-study page.
