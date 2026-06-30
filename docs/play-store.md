# Google Play release guide — Lock In

Lock In ships as a **Trusted Web Activity (TWA)**: the same PWA wrapped in a minimal Android shell for Play Store distribution.

**Live PWA URL:** `https://cooIguy.github.io/daily-reset/` (update if you use a custom domain)

**Package name:** `com.lockin.app`

---

## Prerequisites

- Node.js 18+
- JDK 17+ (Android Studio installs this)
- Android SDK (via [Android Studio](https://developer.android.com/studio))
- Google Play Developer account ($25 one-time)
- PWA deployed to HTTPS with valid `manifest.json` and `/.well-known/assetlinks.json`

---

## 1. Deploy the PWA

1. Push this repo to GitHub and enable **Pages** (branch `master`, folder `/`).
2. Confirm these URLs load over HTTPS:
   - `https://YOUR_DOMAIN/index.html`
   - `https://YOUR_DOMAIN/manifest.json`
   - `https://YOUR_DOMAIN/.well-known/assetlinks.json`
   - `https://YOUR_DOMAIN/privacy.html`

---

## 2. Generate the Android wrapper (Bubblewrap)

```bash
npm install -g @bubblewrap/cli
cd c:\lock-in
bubblewrap init --manifest https://YOUR_DOMAIN/manifest.json --directory android
```

When prompted:

| Field | Value |
|-------|-------|
| App name | Lock In |
| Short name | Lock In |
| Package ID | com.lockin.app |
| Display mode | standalone |
| Theme color | #0a0f0d |
| Background color | #0a0f0d |
| Start URL | /index.html |
| Icon URL | https://YOUR_DOMAIN/icons/icon-512.png |
| Maskable icon | same as above |
| Signing key | Create new (save passwords securely) |

Build the release bundle:

```bash
cd android
bubblewrap build
```

Output: `android/app-release-bundle.aab` (upload this to Play Console).

---

## 3. Digital Asset Links

After creating your signing key, get the SHA-256 fingerprint:

```bash
keytool -list -v -keystore android/android.keystore -alias android
```

Copy the **SHA256** line (colon-separated hex) and update `.well-known/assetlinks.json`:

```json
"sha256_cert_fingerprints": [
  "AA:BB:CC:..."
]
```

Redeploy the site, then verify:

```bash
curl https://YOUR_DOMAIN/.well-known/assetlinks.json
```

Or use [Google's Statement List Generator](https://developers.google.com/digital-asset-links/tools/generator).

---

## 4. Play Console checklist

### App content

- [ ] **Privacy policy URL:** `https://YOUR_DOMAIN/privacy.html`
- [ ] **Data safety:** No data collected or shared off-device. All storage is local.
- [ ] **Content rating:** Fitness/health questionnaire (no UGC, no violence)
- [ ] **Target audience:** 18+ recommended (app allows ages 13+ in onboarding)
- [ ] **Ads:** No
- [ ] **App access:** All functionality available without login

### Store listing

| Asset | Spec |
|-------|------|
| App name | Lock In |
| Short description (80 chars) | Daily habits, food targets, and beginner calisthenics. All on your phone. |
| Full description | See `store-listing.txt` in this folder |
| App icon | 512×512 PNG (`icons/icon-512.png`) |
| Feature graphic | 1024×500 JPG/PNG |
| Phone screenshots | 2–8 images, 1080×1920 or 9:16 |

Suggested screenshots: Welcome onboarding, goal picker, home schedule, workout session, progress stats, settings.

### Release

1. Create app → **Internal testing** track
2. Upload `app-release-bundle.aab`
3. Enable **Google Play App Signing** (recommended)
4. Add testers by email
5. After QA passes, promote to **Production**

---

## 5. Data Safety form (quick answers)

| Question | Answer |
|----------|--------|
| Collect personal info? | Yes (name, age, gender, height, weight) |
| Encrypted in transit? | N/A (never leaves device) |
| Users can request deletion? | Yes (Settings → Reset everything) |
| Data shared with third parties? | No |
| Purpose | App functionality only |

---

## 6. QA checklist

See [qa-checklist.md](./qa-checklist.md).

---

## Troubleshooting

**TWA opens in Chrome with URL bar:** `assetlinks.json` fingerprint or package name mismatch. Re-check SHA256 and redeploy.

**Install banner missing on web:** Ensure `icon-192.png` and `icon-512.png` exist and service worker registers.

**Offline broken after update:** Bump `CACHE_NAME` in `sw.js` and redeploy.

**Bubblewrap build fails:** Confirm `ANDROID_HOME` is set and JDK 17 is active.
