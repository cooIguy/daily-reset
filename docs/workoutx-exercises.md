# Exercise library (WorkoutX)

Lock In uses [WorkoutX](https://workoutxapp.com) for exercise GIFs, instructions, and the bodyweight library catalog.

## Why a worker proxy?

WorkoutX GIF URLs require an API key. The key must not ship inside the PWA. Your Cloudflare Worker adds `X-WorkoutX-Key` server-side and serves GIFs at `/exercise-gif/:id`.

## One-time setup

### 1. Get a WorkoutX API key

Sign up at [workoutxapp.com](https://workoutxapp.com) (free tier: 500 requests/month).

### 2. Deploy the worker

```powershell
cd c:\lock-in\worker
npx wrangler login
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put WORKOUTX_API_KEY
npx wrangler deploy
```

### 3. Build the bundled catalog

```powershell
cd c:\lock-in
$env:WORKOUTX_API_KEY = "wx_your_key_here"
node scripts/build-exercise-catalog.js
```

This writes `data/exercise-catalog.json` and resolves `data/program-map.json` IDs. Commit both files so GitHub Pages works offline for metadata.

### 4. Configure the app

Lock In → **Settings** → **Exercise API URL** → paste your worker base URL, e.g.:

```
https://lock-in-meal-scan.your-subdomain.workers.dev
```

No path suffix needed. GIFs load from `{url}/exercise-gif/{id}`.

## Refreshing the catalog

Re-run the build script when you want updated exercises from WorkoutX:

```powershell
$env:WORKOUTX_API_KEY = "wx_..."
node scripts/build-exercise-catalog.js
```

## Cost

| Action | WorkoutX usage |
|--------|----------------|
| Build script (full bodyweight library) | ~3–10 API calls (pagination) |
| Each new GIF viewed in app | 1 request (cached by service worker) |
| Free tier | 500 requests / month |

Regular app use stays within the free tier if the catalog is bundled and GIFs are cached after first view.

## Privacy

Exercise GIF requests go from your browser to **your** worker, then to WorkoutX. Lock In does not host or log them. See [privacy.html](../privacy.html).
