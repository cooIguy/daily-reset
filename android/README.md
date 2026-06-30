# Android TWA project

This folder holds the [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) Trusted Web Activity wrapper for Lock In.

## Quick start

1. Deploy the PWA to GitHub Pages (see `../docs/play-store.md`).
2. Install Bubblewrap: `npm install -g @bubblewrap/cli`
3. From repo root, generate the Gradle project (first time only):

```bash
bubblewrap init --manifest https://cooiguy.github.io/daily-reset/manifest.json --directory android
```

If `twa-manifest.json` already exists, update `host`, `startUrl`, and icon URLs to match your deployment, then:

```bash
cd android
bubblewrap update
bubblewrap build
```

4. Upload `app-release-bundle.aab` to Google Play Console internal testing.

## Files

| File | Purpose |
|------|---------|
| `twa-manifest.json` | Bubblewrap config (package ID, URLs, colors) |
| `android.keystore` | Created on first `bubblewrap init` (do not commit; add to `.gitignore`) |

## Asset links

After generating the keystore, update `../.well-known/assetlinks.json` with your SHA-256 fingerprint and redeploy the website before publishing the AAB.

See `../docs/play-store.md` for the full Play Console workflow.
