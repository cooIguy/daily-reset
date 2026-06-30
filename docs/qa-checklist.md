# Lock In — QA checklist (pre-release)

Run through this on a clean device or after clearing site data.

## Fresh install

- [ ] App shows onboarding (Welcome → Gender → Age → Height → Weight → Goal → Summary)
- [ ] Privacy modal opens from "What do we use this info for?"
- [ ] Completing onboarding lands on Schedule tab with personalized greeting (`Hi, {name}!`)
- [ ] Nutrition targets reflect age/height/weight/goal (not flat `kg × 30`)
- [ ] Goal-specific tips section title matches selected goal

## Returning user

- [ ] Relaunch skips onboarding
- [ ] Streak, schedule, and workout data persist

## v2 migration

- [ ] Users with `daily_reset_v2` in localStorage keep schedule/workout data
- [ ] Migrated users skip onboarding (`onboardingComplete: true`)
- [ ] Data writes to `daily_reset_v3` key after first launch

## Core flows

- [ ] Toggle schedule blocks; ring percentage updates
- [ ] Water +/- works; 6+ glasses counts toward completion
- [ ] Start workout → log sets → finish → shows complete state
- [ ] Progress tab shows streaks and 7-day dots
- [ ] Settings: edit wake time shifts schedule
- [ ] Settings: export downloads JSON
- [ ] Settings: re-run onboarding via Edit profile
- [ ] Settings: privacy policy link works

## Offline

- [ ] After first load, enable airplane mode
- [ ] App opens from home screen and Schedule tab renders
- [ ] Workout tab and exercise library load (cached shell)

## Food log and nutrition

- [ ] Log food manually with name, calories, protein
- [ ] Progress bars update for calories and protein vs targets
- [ ] Meal suggestion chips pre-fill the log modal
- [ ] Edit and delete food entries
- [ ] AI scan works when worker URL is set (see docs/ai-food-scan.md)

## Water reminders

- [ ] Water blocks appear every 90 min on schedule (when enabled)
- [ ] Hero shows next water reminder time
- [ ] Checking off a water block adds a glass
- [ ] Browser notifications can be enabled in Settings

## Icons and contrast

- [ ] No emojis anywhere in the UI (Lucide icons only)
- [ ] Quick chip labels readable on dark background
- [ ] Nutrition card text readable on white card

## Copy audit

- [ ] No em dashes in visible UI strings

## TWA (Android)

- [ ] `assetlinks.json` deployed with correct SHA256
- [ ] Installed from internal testing track opens full-screen (no browser chrome)
- [ ] Deep link to `index.html` works

## Screenshots for Play

Capture at 1080×1920 (Chrome DevTools device mode):

1. Onboarding welcome
2. Age or weight picker
3. Home / Schedule with targets
4. Workout preview
5. Progress stats
6. Settings profile section

Save to `docs/screenshots/` before uploading to Play Console.
