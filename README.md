# Mt. Tam Racquet & Athletic Club website

A fast, accessible, animated static website. It has no build step and no dependencies: every page is a plain HTML file.

## Deploy to Vercel
1. Put the contents of this folder at the root of a GitHub repo, so `index.html` is at the top level.
2. In Vercel, import the repo and set the Framework Preset to **Other**. Leave the build settings empty.
3. `vercel.json` turns on clean URLs, so pages load at `/tennis` instead of `/tennis.html`.

## Staff photos
Staff photos currently load from the existing mttamrc.com site. If a photo can't load, the page shows the person's initials instead (or an illustration, for Shibu's page).

To host the photos yourself, run `bash scripts/get-photos.sh`. It saves them into `images/team/`. Commit the new files.

To add a photo that isn't on the old site yet (for example Marta Kaltrieder), save it as `images/team/marta-kaltrieder.jpg`. The site picks it up automatically.

## Editing common things
- **Membership prices:** edit them in `membership.html` (the tables and the promotion table) and in `site.js` (the `plans` object).
- **The prepaid-dues promotion:** edit or remove the `#promo` section in `membership.html`, the home page banner in `index.html`, and `PROMO` in `site.js`. `months` sets how many months are prepaid.
- **Swim lesson prices:** edit the table in `swim-lessons.html`.
- **Hours:** edit them in the page text and in `site.js` (the `hours` object that powers the "Open now" indicators). The café opens at 10:30 AM.
- **Tennis lesson number:** Shibu's line, (415) 505-9550, appears on `tennis.html`, `shibu-lal.html` and the home page.

## Motion and accessibility
- **Motion On/Off switch** in the top bar. The choice is remembered on each device. Motion also turns off automatically when the device has "reduce motion" turned on.
- **Text size switch (A / A+)**, also remembered on each device.
- On phones the menu opens as a full-screen sheet that scrolls on its own, with the page locked behind it.

## Before launch
Confirm these with the front desk:
- The exact terms of the prepaid-dues promotion
- Swim lesson prices. They came from the club's older website, which said to double-check them.
- A photo and short bio for Marta Kaltrieder
