# Short-Term-Rentals

Static Next.js site (GitHub Pages) for the Mediterranean Rentals holiday homes.
This repository is public - see CLAUDE.md for what must never be committed.

## How a deploy works (`.github/workflows/deploy.yml`)

1. The Airbnb calendars are downloaded with the `AIRBNB_ICAL_*` secrets and
   parsed by `scripts/parse-ical.py` into `public/calendars/<id>.json`. A
   response that isn't a calendar (or is suddenly empty) is rejected and the
   calendar the live site serves is kept.
2. `npm run build` resizes the photos (`scripts/build-image-variants.js`),
   reads each property's rates from Business-Tracking's `rates-feed` branch
   and renders the site. The build never sees the Airbnb secrets, and fails
   if a rates feed can't be read, so wrong prices are never published.

## Local development

```sh
npm ci
npm run dev
```

Without network access to the rates feed, use `RATES_ALLOW_MISSING=1 npm run dev`
(all prices then show "Price on request"). Without `public/calendars/` the
booking calendar shows "Availability not loaded".
