# Realty 25 AZ site (GitHub Pages ready)

Black and White static rebuild of realty25az.com. Plain HTML/CSS/JS. No build step.

## Preview locally (subpath, like github.io project pages)

1. From the parent of this folder:
   `cd /workspace && python3 -m http.server 8765`
2. Open `http://127.0.0.1:8765/realty25az-site/`
3. Or from inside this folder for root-style preview:
   `cd /workspace/realty25az-site && python3 -m http.server 8765`
   then open `http://127.0.0.1:8765/`

Relative links work in both modes. Do not add a CNAME file until go-live.

Planned public preview: `https://r25sandbox.github.io/realty25az-site/`

## Structure

1. `/` home
2. `/pricing/` management pricing + walkthrough request modal
3. `/faq/`
4. `/reviews/`
5. `/about/`
6. `/service-area/`
7. `/agents/` referral program + diagram modal
8. `/tools/` hub
9. `/tools/cash-flow-calculator/` (ric.js)
10. `/tools/equity-calculator/` (eec.js)
11. `/tools/rental-comp/` (copied RentalComp app + pricing)
12. `/guides/` stub hub
13. `/privacy/`
14. `404.html`, `robots.txt`, `sitemap.xml`, `llms.txt`

Assets live under `assets/{css,js,img,docs,fonts}/`.

## Cloudflare Worker

Forms and RentalComp still call `https://rentalcomp-proxy.alik-levin.workers.dev` (unchanged paths). Do not redeploy Worker from old repo copies.

For preview form tests, Worker `ALLOWED_ORIGIN` must include `https://r25sandbox.github.io`.

## Go-live checklist (only when Alik approves)

1. Push this folder to `r25sandbox/realty25az-site` and enable GitHub Pages from `main` (root).
2. Preview on `https://r25sandbox.github.io/realty25az-site/` and smoke-test forms and tools.
3. Lower DNS TTL on realty25az.com / www.
4. In Cloudflare DNS: set apex A records to GitHub Pages (`185.199.108.153`, `.109.153`, `.110.153`, `.111.153`) and `www` CNAME to `r25sandbox.github.io`, with proxy OFF (DNS only) until GitHub issues the certificate.
5. Add custom domain `realty25az.com` in the repo Pages settings (add CNAME file at that time only). Wait for cert. Enforce HTTPS.
6. Then turn Cloudflare proxy ON with SSL mode Full (not Flexible).
7. Confirm Worker ALLOWED_ORIGIN includes `https://realty25az.com` (and keep github.io if still needed).
8. Keep Carrd live until cutover is confirmed; screenshot prior DNS for rollback.
9. Submit updated sitemap in Search Console / Bing.

## Design

Near-black `#0E0E10` header/footer, white main, black square buttons, Montserrat 700 wordmark with gold `25` (`#C8A96E`), Fraunces headings, Inter body. No photos. Gold only in the wordmark.
