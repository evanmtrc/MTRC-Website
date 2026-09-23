# Mt. Tam Racquet & Athletic Club website

A fast, accessible static website. It has no build step and no dependencies: every page is a plain HTML file.

## Deploy to Vercel
1. Put the contents of this folder at the root of a GitHub repo, so `index.html` is at the top level.
2. In Vercel, go to **Add New → Project**, import the repo, set the Framework Preset to **Other**, and click **Deploy**.
3. To use a custom domain, go to **Project → Settings → Domains**.

`vercel.json` turns on clean URLs, so pages load at `/tennis` instead of `/tennis.html`.

## Staff photos
Staff photos currently load from the existing mttamrc.com WordPress site. If a photo can't load, the page shows the person's initials instead (or an illustration, for Shibu's page).

To host the photos yourself, run `bash scripts/get-photos.sh`. It saves them into `images/team/`, and the site uses those local copies first. Commit the new files.

To add or replace a photo, save it as `images/team/<first-last>.jpg`. For example: `images/team/raina-lal.jpg`.

## Pages
| Page | File |
|---|---|
| Home | `index.html` |
| Tennis, tennis pros | `tennis.html` |
| Shibu Lal (tennis director) | `shibu-lal.html` |
| Pickleball | `pickleball.html` |
| Swim | `swim.html` |
| Fitness and training | `fitness.html` |
| Pilates | `pilates.html` |
| Class guide (filterable) | `classes.html` |
| Kids and summer camp | `kids.html` |
| Café | `cafe.html` |
| Events and club life | `events.html` |
| Staff and instructors | `team.html` |
| Our story | `about.html` |
| Membership, prices and plan finder | `membership.html` |
| Visit and contact | `visit.html` |
| Accessibility | `accessibility.html` |
| Not found | `404.html` |

## Editing common things
- **Prices:** edit them in `membership.html` (the tables) and in `site.js` (the `plans` object used by the plan finder).
- **Hours:** edit them in the page text and in `site.js` (the `hours` object that powers the "Open now" indicator).
- **Your domain:** if it isn't mttamrc.com, find and replace it in `sitemap.xml`, `robots.txt` and the `canonical`/`og:` tags.

## Built-in features
- Text-size switch (A / A+), remembered on each device
- Live "open now" status for the club and café, based on Pacific time
- Membership plan finder
- Filterable class guide
- Keyboard-friendly dropdown menus and a mobile menu
- Skip link and screen-reader labels
- SEO: meta descriptions, Open Graph image, schema.org business data, sitemap and robots.txt
- Print-friendly styles

## Before launch
Confirm these with the front desk:
- What each membership plan includes
- Current promotions
- Event dates
- Raina Lal's bio and photo
