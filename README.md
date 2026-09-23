# Mt. Tam Racquet & Athletic Club website

A fast, accessible, animated static website. It has no build step and no dependencies: every page is a plain HTML file.

## Deploy to Vercel
1. Put the contents of this folder at the root of a GitHub repo, so `index.html` is at the top level.
2. In Vercel, import the repo and set the Framework Preset to **Other**. Leave the build settings empty.
3. `vercel.json` turns on clean URLs, so pages load at `/tennis` instead of `/tennis.html`.

## Staff photos
Staff photos currently load from the existing mttamrc.com site. If a photo can't load, the page shows the person's initials instead (or an illustration, for Shibu's page).

To host the photos yourself, run `bash scripts/get-photos.sh`. It saves them into `images/team/`. Commit the new files.

To add a photo that isn't on the old site (for example Marta Kaltrieder), save it as `images/team/marta-kaltrieder.jpg`.

## Editing common things
- **Membership prices:** edit them in `membership.html` (the tables and the promotion table) and in `site.js` (the `plans` object).
- **The prepaid-dues promotion:** edit or remove the `#promo` section in `membership.html`, the home banner in `index.html`, and `PROMO` in `site.js`.
- **Swim lesson fees:** edit the three fee cards in `swim-lessons.html`.
- **Hours:** edit them in the page text and in `site.js` (the `hours` object). The café opens at 10:30 AM.
- **Tennis lessons:** Shibu's line, (415) 505-9550.
- **Free trials:** the gym, the pools and the café only. Nothing else on the site offers a free trial.

## Motion and accessibility
- **Motion On/Off switch** in the top bar, remembered on each device. Motion also turns off automatically when the device has "reduce motion" enabled.
- **Text size switch (A / A+)**, also remembered on each device.
- The activities ribbon is driven by JavaScript: it loops seamlessly, pauses when it's off screen, and pauses on mouse hover.
- On phones the menu opens as a full-screen sheet that scrolls on its own, and the page behind it stays put.

## Before launch
Confirm these with the front desk:
- The exact terms of the prepaid-dues promotion
- The Saturday pickleball drop-in time (listed as 2–4 PM)
- A photo and short bio for Marta Kaltrieder
