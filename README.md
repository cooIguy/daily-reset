# Lock In

A personal habit and beginner fitness tracker. Installable Android PWA with full onboarding, profile-driven nutrition targets, and zero backend. All data stays on your device.

---

## What it does

**Schedule tab** — daily checklist that resets every morning:
- Wake-up and morning routine
- Meals aligned to your goal
- Calisthenics workout on training days
- Water and supplements
- Personalized calorie and protein targets from your profile

**Workout tab** — structured beginner bodyweight program:
- 3-day/week schedule (Mon, Wed, Fri by default)
- Workouts rotate A → B → C
- Built-in pull-up progression
- In-workout timer for timed exercises
- Exercise library with demos

**Progress tab** — streaks, stats, and recent workouts

**Settings tab** — profile, schedule, export, privacy policy, reset

**Onboarding** — Welcome, gender, age, height, weight, and goal pickers (Figma-style UI)

---

## Deploy to GitHub Pages

```bash
git add .
git commit -m "Lock In release"
git push origin master
```

Enable **Settings → Pages** → branch `master`, folder `/`.

Icons are pre-generated (`icons/icon-192.png`, `icons/icon-512.png`). Re-run `node make-icons.js` after changing `icons/icon.svg`.

---

## Google Play (TWA)

See [docs/play-store.md](docs/play-store.md) for Bubblewrap setup, asset links, and Play Console checklist.

---

## Offline use

After the first load, the service worker caches app files. Open from your home screen with no internet and it still works.

---

## Technical details

| Feature | Implementation |
|---|---|
| Data storage | `localStorage` (`daily_reset_v3`) |
| Offline | Service Worker (`lock-in-v4` cache) |
| PWA install | Web App Manifest + service worker |
| Stack | Vanilla HTML, CSS, JavaScript |

---

## File structure

```
├── index.html
├── app.css / app.js
├── onboarding.css / onboarding.js
├── manifest.json
├── sw.js
├── privacy.html
├── .well-known/assetlinks.json
├── android/twa-manifest.json
├── docs/play-store.md
└── icons/
```
