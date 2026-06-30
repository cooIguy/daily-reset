# Daily Reset

A personal habit and beginner fitness tracker — installable Android PWA, zero backend, all data stored locally on your device.

---

## What it does

**Today tab** — daily checklist that resets every morning:
- Phone stayed out of bed
- Got up within 15 minutes of waking
- Brushed teeth
- Made the bed
- Had breakfast / balanced meals
- Water glasses (8-glass tracker)
- Screens off before bed

**Workout tab** — structured beginner bodyweight program:
- 3-day/week schedule (Mon · Wed · Fri by default, fully adjustable)
- Workouts rotate A → B → C:
  - **A (Push Day):** Push-ups, Pike Push-ups, Squats, Glute Bridge, Plank
  - **B (Pull Day):** Dead Hang, Scapular Pull-ups, Negative Pull-ups, Inverted Rows, Hollow Body Hold
  - **C (Full Body):** Push-ups, Negative Pull-ups, Squats, Mountain Climbers, Plank
- Built-in pull-up progression (dead hang → scapular pulls → negatives → full pull-ups)
- In-workout timer for timed exercises (plank, dead hang, etc.)
- RPE (effort) rating after each session
- Resumes if you close the app mid-workout

**Progress tab** — streak tracking, personal bests, recent workouts

**Settings tab** — edit any checklist label, toggle items, change workout days, export or reset data

---

## Deploying to GitHub Pages (Android install guide)

### Step 1 — Generate the PNG icons (one-time setup)

The app needs `icon-192.png` and `icon-512.png` in the `icons/` folder for Android's PWA install banner.

1. Open `icons/generate.html` in any browser (Chrome, Firefox, Edge)
2. The icons will preview automatically on screen
3. Click **"Generate & Download Icons"**
4. Move `icon-192.png` and `icon-512.png` into the `icons/` folder of this repo

> **SVG fallback:** If you skip this step, the app still works on Chrome 98+ Android using the SVG icon, but the install banner may not appear on all devices.

### Step 2 — Create a GitHub repository

1. Go to [github.com](https://github.com) → **New repository**
2. Name it anything (e.g. `daily-reset`)
3. Set it to **Public** (required for free GitHub Pages)
4. Don't initialize with README (you have one already)

### Step 3 — Push this folder to GitHub

```bash
# Inside this folder (c:\lock-in):
git init
git add .
git commit -m "Initial commit — Daily Reset PWA"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 4 — Enable GitHub Pages

1. Open your repo on GitHub
2. Go to **Settings → Pages**
3. Under **Source**, choose:
   - Branch: `main`
   - Folder: `/ (root)`
4. Click **Save**
5. Wait ~60 seconds, then your URL will appear: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

### Step 5 — Install on Android

1. Open Chrome on your Android phone
2. Navigate to your GitHub Pages URL
3. Wait a moment — Chrome will show a banner: **"Add Daily Reset to Home screen"**
4. Tap it and tap **"Add"**
5. The app will appear on your home screen and works fully offline

> **If the banner doesn't appear automatically:** tap Chrome's three-dot menu (⋮) → "Add to Home screen" or "Install app"

---

## Offline use

After the first load, the service worker caches all app files. The app works completely offline — open it from your home screen with no internet and it will load and function normally.

---

## Technical details

| Feature | Implementation |
|---|---|
| Data storage | `localStorage` (all on-device, never leaves your phone) |
| Offline | Service Worker with cache-first strategy |
| PWA install | Web App Manifest + service worker |
| Framework | None — vanilla HTML, CSS, JavaScript |
| External dependencies | None |

---

## File structure

```
├── index.html          # App shell
├── app.css             # All styles (dark mode, mobile-first)
├── app.js              # All application logic
├── manifest.json       # PWA manifest
├── sw.js               # Service worker
└── icons/
    ├── icon.svg        # Vector icon (SVG)
    ├── icon-192.png    # PNG icon for install (generate once)
    ├── icon-512.png    # PNG icon for splash (generate once)
    └── generate.html   # One-click icon generator (open in browser)
```

---

## Customization

Everything is adjustable in the **Settings tab** without touching code:
- Edit checklist item labels
- Toggle items on/off
- Change which days of the week you train

The workout program is designed as a beginner foundation. The A/B/C rotation and exercise selection are a good starting point for 2–4 months. Once pull-ups are achievable and push-ups hit 3×15+, the program can be upgraded.
