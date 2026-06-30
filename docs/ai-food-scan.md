# AI features (meal scan, text estimate, coach)

Lock In uses one Cloudflare Worker (`worker/scan-meal.js`) for all AI: meal photo scanning, text-to-macros estimation, and the in-app AI coach. Your OpenAI API key stays on the Worker, never in the PWA.

## Endpoints (all on the same Worker)

| Endpoint | Method | Body | Returns |
|----------|--------|------|---------|
| `/scan-meal` | POST | `{ image }` (base64 data URL) | `{ name, calories, protein, items }` |
| `/estimate-food` | POST | `{ text }` (what you typed) | `{ name, calories, protein, items }` |
| `/assistant` | POST | `{ message, history, context }` | `{ reply, actions[] }` |
| `/exercise-gif/:id` | GET | — | WorkoutX GIF (proxied) |

The app derives the shared base URL from the **AI meal scan URL** setting by stripping the trailing `/scan-meal`, so a single setting powers all three AI features.

## Deploy the worker

1. Install [Wrangler](https://developers.cloud.com/workers/wrangler/): `npm install -g wrangler`
2. Log in: `wrangler login`
3. From this folder:

```bash
cd worker
wrangler secret put OPENAI_API_KEY
wrangler deploy
```

4. Copy the deployed URL (e.g. `https://lock-in-meal-scan.your-subdomain.workers.dev`)
5. In Lock In → **Settings** → **AI meal scan URL**, paste: `https://YOUR-WORKER.workers.dev/scan-meal`

## How it works

**Photo scan**
1. You tap **Scan meal photo** in the food log modal
2. The app compresses the image client-side (max 768px JPEG)
3. The image is POSTed to `/scan-meal`
4. The worker calls **gpt-4o** vision (`detail: low`) and returns JSON
5. You review and edit the numbers before saving

**Text estimate**
1. Type what you ate in the food name field
2. Tap **Estimate calories & protein with AI** (`/estimate-food`, gpt-4o-mini)
3. Calories and protein fill in automatically; review and save

**AI coach**
1. Tap the center ball button in the bottom bar
2. Your message plus a compact context snapshot (goal, schedule, nutrition targets, today's log) is POSTed to `/assistant`
3. The reply may include proposed plan changes; each shows an **Approve** button before anything is applied

Photos and messages are not stored on the worker. OpenAI processes requests per their API terms.

## Cost estimate (OpenAI credits)

Pricing: GPT-4o input **$2.50 / 1M tokens**, output **$10 / 1M tokens**.

| Scenario | Approx. cost per scan |
|----------|----------------------|
| Compressed photo, low detail | **~$0.002** |
| High detail (~1024px) | **~$0.004** |

| Usage | Scans/month | Low detail/month |
|-------|-------------|------------------|
| 3 meals/day | ~90 | **~$0.18** |
| 5 logs/day | ~150 | **~$0.30** |
| Heavy testing (10/day) | ~300 | **~$0.60** |

Regular use should stay under **$1/month**.

## Privacy

- Scan only runs when you tap the button
- Update [privacy.html](../privacy.html) disclosure applies
- Use your own OpenAI account and monitor usage at [platform.openai.com/usage](https://platform.openai.com/usage)

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "Add your AI Worker URL in Settings" | Add full URL including `/scan-meal`; the app derives the base for the other endpoints |
| Nothing happens on photo select | Update to latest build; without a Worker URL the app now shows an inline prompt and the chosen image preview |
| AI coach says it needs a URL | Same setting as meal scan; paste `https://YOUR-WORKER.workers.dev/scan-meal` |
| CORS error | Worker includes CORS headers; redeploy latest `scan-meal.js` |
| 502 OpenAI error | Check API key, billing, and model access |
| Wildly wrong estimates | Edit before saving; try a clearer photo or more detail in the text |
