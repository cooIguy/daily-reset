'use strict';

// ============================================================
// EXERCISES — calisthenics program with demos
// ============================================================

const GIF = id => `https://static.exercisedb.dev/media/${id}.gif`;

const EXERCISES = {
  pushups: {
    id: 'pushups', name: 'Push-ups', category: 'push', muscles: 'Chest, shoulders, triceps',
    trackType: 'reps', targetSets: 3, targetMin: 5, targetMax: 12, unit: 'reps',
    gifUrl: GIF('IaGQCrC'), svgUrl: 'icons/exercises/pushups.svg',
    youtubeQuery: 'push up proper form beginner',
    desc: 'The foundation upper-body push. Keep a straight line from head to heels.',
    cues: ['Hands slightly wider than shoulders', 'Body straight — no sagging hips', 'Chest nearly touches floor'],
    steps: [
      'Start in a high plank — hands slightly wider than shoulder-width, fingers forward',
      'Brace your core and keep your body in one straight line from head to heels',
      'Lower your chest until it nearly touches the floor — elbows at about 45°',
      'Push back up until arms are almost fully straight',
      "Too hard? Drop to your knees — same movement, less load",
    ],
    mistakes: ['Hips sagging or piking up', 'Elbows flaring straight out to the sides', 'Half reps — not going low enough'],
    easierId: null,
    prog: 'Hit 3 × 12 clean reps → try diamond or close-grip push-ups',
  },
  pike_pushups: {
    id: 'pike_pushups', name: 'Pike Push-ups', category: 'push', muscles: 'Shoulders, upper chest, triceps',
    trackType: 'reps', targetSets: 3, targetMin: 5, targetMax: 10, unit: 'reps',
    gifUrl: 'https://pub-7c14918da31d450e8d6787a3c225c277.r2.dev/gifs/720/2921.webp',
    svgUrl: 'icons/exercises/pike_pushups.svg',
    youtubeQuery: 'pike push up tutorial calisthenics',
    desc: 'A shoulder press using your bodyweight. Hips stay high in an inverted V — this is NOT a regular push-up.',
    cues: ['Hips high — inverted V shape', 'Head lowers between your hands', 'Elbows at ~45°, not flared wide'],
    steps: [
      'Start in downward-dog: hands and feet on floor, hips pushed HIGH toward the ceiling',
      'Your body forms an upside-down V — the higher your hips, the more shoulder work you get',
      'Bend your elbows and lower the TOP of your head toward the floor between your hands',
      'Keep your neck neutral — look at your feet, not ahead of you',
      'Push through your hands back to the starting V position',
      'Too hard? Put hands on a chair or low table to reduce the angle',
    ],
    mistakes: ['Hips too low — turns into a regular push-up', 'Head going forward of hands instead of between them', 'Elbows flaring wide — hurts shoulders'],
    easierId: 'pushups',
    prog: 'Build to 3 × 10 → try feet-elevated pike push-ups',
  },
  squats: {
    id: 'squats', name: 'Bodyweight Squats', category: 'legs', muscles: 'Quads, glutes, hamstrings',
    trackType: 'reps', targetSets: 3, targetMin: 15, targetMax: 20, unit: 'reps',
    gifUrl: GIF('ecl28tP'), svgUrl: 'icons/exercises/squats.svg',
    youtubeQuery: 'bodyweight squat form beginner',
    desc: 'Foundational lower-body movement for leg strength and muscle.',
    cues: ['Chest up, core braced', 'Sit back like lowering onto a chair', 'Knees track over toes'],
    steps: [
      'Feet shoulder-width apart, toes slightly turned out',
      'Keep chest up and core braced throughout',
      'Sit back and down — hips go back first, then down',
      'Aim for thighs parallel to the floor or deeper',
      'Drive through your heels to stand back up',
    ],
    mistakes: ['Knees caving inward', 'Heels lifting off the floor', 'Rounding the lower back'],
    easierId: null,
    prog: '3 × 20 clean reps → jump squats or split squat prep',
  },
  glute_bridge: {
    id: 'glute_bridge', name: 'Glute Bridge', category: 'legs', muscles: 'Glutes, hamstrings',
    trackType: 'reps', targetSets: 3, targetMin: 12, targetMax: 20, unit: 'reps',
    gifUrl: GIF('c9MnDRp'), svgUrl: 'icons/exercises/glute_bridge.svg',
    youtubeQuery: 'glute bridge exercise form',
    desc: 'Hip extension that builds glutes — important for posture and lower-body strength.',
    cues: ['Heels close to hips', 'Squeeze glutes hard at the top', '1–2 second pause at top'],
    steps: [
      'Lie on your back, knees bent, feet flat hip-width apart',
      'Push through heels and lift hips until shoulder-to-knee is a straight line',
      'Squeeze glutes hard at the top — hold 1–2 seconds',
      'Lower slowly and repeat',
    ],
    mistakes: ['Over-arching the lower back instead of using glutes', 'Pushing through toes instead of heels', 'Rushing — no squeeze at top'],
    easierId: null,
    prog: '20 easy reps → single-leg glute bridges',
  },
  plank: {
    id: 'plank', name: 'Plank', category: 'core', muscles: 'Core, shoulders',
    trackType: 'time', targetSets: 3, targetMin: 20, targetMax: 45, unit: 'sec',
    gifUrl: GIF('QZFv5ui'), svgUrl: 'icons/exercises/plank.svg',
    youtubeQuery: 'plank exercise proper form',
    desc: 'Static core hold — foundation for all calisthenics skills.',
    cues: ['Elbows under shoulders', 'Straight line head to heels', 'Brace core — don\'t hold breath'],
    steps: [
      'Forearms on floor, elbows directly under shoulders',
      'Body in a perfectly straight line from head to heels',
      'Brace core as if bracing for a punch to the stomach',
      "Don't let hips sag or rise",
      'Breathe steadily throughout the hold',
    ],
    mistakes: ['Hips sagging — lower back strain', 'Hips too high — easy but useless', 'Holding breath the entire time'],
    easierId: null,
    prog: '45-second holds → side planks or RKC planks',
  },
  dead_hang: {
    id: 'dead_hang', name: 'Dead Hang', category: 'pull', muscles: 'Grip, lats, shoulders',
    trackType: 'time', targetSets: 3, targetMin: 15, targetMax: 45, unit: 'sec',
    gifUrl: GIF('VPPtusI'), svgUrl: 'icons/exercises/dead_hang.svg',
    youtubeQuery: 'dead hang pull up bar beginner',
    desc: 'Just hang from the bar. Builds grip and shoulder health — step 1 toward pull-ups.',
    cues: ['Full arm extension', 'Relax shoulders at the top', 'Breathe steadily'],
    steps: [
      'Grip the bar hands slightly wider than shoulder-width',
      'Hang with arms fully extended',
      'Let shoulders relax and open — feel the stretch',
      "Don't actively pull — just hang and breathe",
      'Work from 15 seconds toward 45+ per set',
    ],
    mistakes: ['Shrugging shoulders up to ears', 'Bending arms — not a full hang', 'Dropping off when grip burns — that\'s the training'],
    easierId: null,
    prog: '60-second hangs → add scapular pulls',
  },
  scapular_pulls: {
    id: 'scapular_pulls', name: 'Scapular Pull-ups', category: 'pull', muscles: 'Lats, lower traps',
    trackType: 'reps', targetSets: 3, targetMin: 5, targetMax: 10, unit: 'reps',
    gifUrl: GIF('03lzqwk'), svgUrl: 'icons/exercises/scapular_pulls.svg',
    youtubeQuery: 'scapular pull up tutorial',
    desc: 'The unlock for pull-ups. Shoulder blades move — elbows stay straight.',
    cues: ['No elbow bending', 'Pull shoulder blades DOWN', 'Pause 1 sec at top'],
    steps: [
      'Start in a full dead hang',
      'WITHOUT bending elbows, pull shoulder blades DOWN (depress, not squeeze together)',
      'Your body rises 1–2 inches — feel lats engage',
      'Pause 1 second at top, slowly lower to dead hang',
      'This is the exact muscle pattern for pull-ups',
    ],
    mistakes: ['Bending elbows — that\'s a mini pull-up, not scapular', 'Shrugging up instead of depressing down', 'Using momentum — move slow and controlled'],
    easierId: 'dead_hang',
    prog: '3 × 8 clean reps → add negative pull-ups',
  },
  negative_pullups: {
    id: 'negative_pullups', name: 'Negative Pull-ups', category: 'pull', muscles: 'Lats, biceps, grip',
    trackType: 'reps', targetSets: 3, targetMin: 3, targetMax: 6, unit: 'reps',
    gifUrl: GIF('0V2YQjW'), svgUrl: 'icons/exercises/negative_pullups.svg',
    youtubeQuery: 'negative pull up progression beginner',
    desc: 'Fastest path to your first pull-up. Jump up, lower slowly.',
    cues: ['Chin starts above bar', '4–5 second lowering — count out loud', 'Full dead hang at bottom'],
    steps: [
      'Use a chair or jump to get chin ABOVE the bar',
      'Remove support — hold with bent arms at the top',
      'SLOWLY lower over 4–5 seconds — count: one-one-thousand, two-one-thousand…',
      'Full dead hang at bottom, then reset to top',
      "Don't drop — the slow descent builds the strength",
    ],
    mistakes: ['Dropping fast — skips all the benefit', 'Not starting with chin above bar', 'Kipping or swinging'],
    easierId: 'scapular_pulls',
    prog: '3 × 5 with 5-sec lowers → attempt your first full pull-up',
  },
  inverted_rows: {
    id: 'inverted_rows', name: 'Inverted Rows', category: 'pull', muscles: 'Back, biceps, rear delts',
    trackType: 'reps', targetSets: 3, targetMin: 8, targetMax: 15, unit: 'reps',
    gifUrl: GIF('c9MnDRp'), svgUrl: 'icons/exercises/inverted_rows.svg',
    youtubeQuery: 'inverted row table bodyweight',
    desc: 'Horizontal row using a sturdy table. Builds back thickness.',
    cues: ['Body straight like a plank', 'Pull chest to edge', 'Squeeze shoulder blades'],
    steps: [
      'Lie under a sturdy table, grip the edge hands shoulder-width apart',
      'Body straight like a plank, heels on floor',
      'Pull chest up to table edge — squeeze shoulder blades together',
      'Lower slowly and repeat',
      'Easier: bend knees. Harder: elevate heels on a chair',
    ],
    mistakes: ['Hips sagging — not a straight line', 'Using only arms — lead with shoulder blades', 'Unstable table — safety first'],
    easierId: null,
    prog: '3 × 15 → lower bar height or add pause at top',
  },
  hollow_hold: {
    id: 'hollow_hold', name: 'Hollow Body Hold', category: 'core', muscles: 'Abs, hip flexors',
    trackType: 'time', targetSets: 3, targetMin: 15, targetMax: 30, unit: 'sec',
    gifUrl: GIF('3TZduzM'), svgUrl: 'icons/exercises/hollow_hold.svg',
    youtubeQuery: 'hollow body hold gymnastics',
    desc: 'Gymnastics core foundation — used in every calisthenics skill.',
    cues: ['Lower back pressed into floor', 'Banana shape — arms and legs off ground', 'Breathe while bracing'],
    steps: [
      'Lie on back, arms extended overhead',
      'Press lower back HARD into the floor — critical cue',
      'Lift arms, head, shoulders, and legs off the floor',
      'Body forms a shallow hollow banana shape',
      'Too hard? Bend knees to reduce leverage',
    ],
    mistakes: ['Lower back arching off the floor', 'Holding breath', 'Legs too high — reduces ab tension'],
    easierId: null,
    prog: '30-second holds → tuck hollow → extended hollow',
  },
  mountain_climbers: {
    id: 'mountain_climbers', name: 'Mountain Climbers', category: 'core', muscles: 'Core, hip flexors, cardio',
    trackType: 'reps', targetSets: 3, targetMin: 16, targetMax: 30, unit: 'total reps',
    gifUrl: GIF('3TZduzM'), svgUrl: 'icons/exercises/mountain_climbers.svg',
    youtubeQuery: 'mountain climbers exercise form',
    desc: 'Dynamic core + cardio. Count each leg drive as one rep.',
    cues: ['High plank start', 'Drive knee to chest', 'Hips stay low — don\'t pike up'],
    steps: [
      'High plank — hands under shoulders, body straight',
      'Drive one knee toward chest, core tight',
      'Quickly switch legs in a controlled running motion',
      'Count each leg drive as one rep (16 = 8 each side)',
      "Don't let hips rise — flat back throughout",
    ],
    mistakes: ['Hips bouncing up and down', 'Going too fast with sloppy form', 'Hands creeping forward'],
    easierId: 'plank',
    prog: 'Increase speed only when form stays solid',
  },
};

const WORKOUTS = {
  A: {
    id: 'A', name: 'Push & Legs', emoji: '💪',
    focus: 'Chest · Shoulders · Legs · Core',
    exercises: ['pushups', 'pike_pushups', 'squats', 'glute_bridge', 'plank'],
  },
  B: {
    id: 'B', name: 'Pull & Core', emoji: '🏋️',
    focus: 'Back · Grip · Pull-up prep · Core',
    exercises: ['dead_hang', 'scapular_pulls', 'negative_pullups', 'inverted_rows', 'hollow_hold'],
  },
  C: {
    id: 'C', name: 'Full Body', emoji: '⚡',
    focus: 'Total body · Conditioning',
    exercises: ['pushups', 'negative_pullups', 'squats', 'mountain_climbers', 'plank'],
  },
};

const CALISTHENICS_PATH = [
  { label: 'Dead hang', exId: 'dead_hang' },
  { label: 'Scapular pulls', exId: 'scapular_pulls' },
  { label: 'Negatives', exId: 'negative_pullups' },
  { label: 'First pull-up', exId: 'negative_pullups' },
];

const MEALS = {
  breakfast: {
    title: 'Breakfast', time: '08:30', protein: 35,
    short: '3 eggs, oats with banana, glass of milk',
    detail: 'Scramble or boil 3 eggs. Cook ½ cup oats with water or milk, top with a sliced banana. Drink a glass of milk or have yogurt on the side.',
  },
  lunch: {
    title: 'Lunch', time: '12:30', protein: 45,
    short: 'Chicken breast, rice, vegetables, drizzle of olive oil',
    detail: 'Palm-sized chicken breast (150–200g), 1 cup cooked rice, large handful of vegetables (broccoli, peppers, salad). Cook with a teaspoon of olive oil.',
  },
  snack: {
    title: 'Snack', time: '15:00', protein: 20,
    short: 'Greek yogurt + handful of nuts',
    detail: '1 cup Greek yogurt (high protein) plus a small handful of almonds or walnuts. Good time to drink 1–2 glasses of water.',
  },
  dinner: {
    title: 'Dinner', time: '18:30', protein: 40,
    short: 'Fish or lean beef, potatoes, salad',
    detail: '150–200g salmon, white fish, or lean beef. 1–2 medium potatoes or sweet potato. Large side salad or steamed vegetables.',
  },
};

const RECOMP_TIPS = [
  'Train consistently — muscle changes your shape even if the scale stays flat',
  'High protein + maintenance calories beats aggressive cutting when you\'re under-muscled',
  'Belly fat comes off gradually as you get stronger — track pull-up and push-up progress, not just weight',
  'Sleep and your morning routine matter as much as the workout',
];

const SUPPLEMENTS = [
  {
    name: 'Creatine monohydrate',
    verdict: 'yes',
    dose: '3–5 g/day, any time, daily',
    why: 'Well-researched for strength and muscle. Near-zero calories. Good fit for skinny-fat recomposition.',
  },
  {
    name: 'Mass gainer',
    verdict: 'skip',
    dose: 'Skip for now',
    why: 'High-sugar calorie bombs often add belly fat without fixing under-eating habits. Eat real food first.',
  },
  {
    name: 'Whey protein',
    verdict: 'optional',
    dose: 'Only if needed',
    why: 'Optional helper if you consistently miss your daily protein target from meals.',
  },
];

const WORKOUT_CYCLE = ['A', 'B', 'C'];
const DAYS_SHORT  = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_ABBREV = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ============================================================
// STORAGE
// ============================================================

const STORAGE_KEY = 'daily_reset_v2';
const STORAGE_KEY_V1 = 'daily_reset_v1';
let appData = null;

function getDefaultScheduleBlocks() {
  return [
    { id: 'wake',     time: '08:00', label: 'Wake up — phone stays out of bed; get up within 15 min', type: 'habit',   enabled: true },
    { id: 'routine',  time: '08:15', label: 'Morning routine — brush teeth, make bed',                  type: 'habit',   enabled: true },
    { id: 'breakfast',time: '08:30', label: 'Breakfast',                                                type: 'meal',    mealId: 'breakfast', enabled: true },
    { id: 'workout',  time: '09:30', label: 'Calisthenics workout',                                     type: 'workout', enabled: true },
    { id: 'lunch',    time: '12:30', label: 'Lunch',                                                    type: 'meal',    mealId: 'lunch', enabled: true },
    { id: 'snack',    time: '15:00', label: 'Snack + water check-in',                                   type: 'meal',    mealId: 'snack', enabled: true },
    { id: 'dinner',   time: '18:30', label: 'Dinner',                                                   type: 'meal',    mealId: 'dinner', enabled: true },
    { id: 'winddown', time: '21:30', label: 'Screens off before bed',                                   type: 'habit',   enabled: true },
  ];
}

function getDefaultSettings() {
  return {
    wakeTime: '08:00',
    bodyweightKg: 70,
    scheduleBlocks: getDefaultScheduleBlocks(),
    workoutSchedule: [1, 3, 5],
  };
}

function migrateFromV1(v1) {
  const def = getDefaultSettings();
  const days = { ...(v1.days || {}) };
  for (const [dateStr, day] of Object.entries(days)) {
    if (!day.schedule) {
      day.schedule = {};
      if (day.morning?.phone || day.morning?.gotup) day.schedule.wake = true;
      if (day.morning?.teeth || day.morning?.bed) day.schedule.routine = true;
      if (day.food?.breakfast) day.schedule.breakfast = true;
      if (day.food?.meals) { day.schedule.lunch = true; day.schedule.dinner = true; }
      if (day.evening?.screens) day.schedule.winddown = true;
      if (day.workout?.completed) day.schedule.workout = true;
    }
    if (day.food?.water == null) day.water = day.food?.water ?? 0;
    else day.water = day.food.water;
  }
  return {
    settings: def,
    days,
    workoutSequence: v1.workoutSequence ?? 0,
    bestStreak: v1.bestStreak ?? 0,
    bests: v1.bests ?? {},
  };
}

function loadAppData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      const def = getDefaultSettings();
      return {
        settings: {
          wakeTime:        p.settings?.wakeTime        ?? def.wakeTime,
          bodyweightKg:    p.settings?.bodyweightKg    ?? def.bodyweightKg,
          scheduleBlocks:  p.settings?.scheduleBlocks  ?? def.scheduleBlocks,
          workoutSchedule: p.settings?.workoutSchedule ?? def.workoutSchedule,
        },
        days:            p.days            ?? {},
        workoutSequence: p.workoutSequence ?? 0,
        bestStreak:      p.bestStreak      ?? 0,
        bests:           p.bests           ?? {},
      };
    }
    const v1raw = localStorage.getItem(STORAGE_KEY_V1);
    if (v1raw) return migrateFromV1(JSON.parse(v1raw));
    return freshAppData();
  } catch {
    return freshAppData();
  }
}

function freshAppData() {
  return { settings: getDefaultSettings(), days: {}, workoutSequence: 0, bestStreak: 0, bests: {} };
}

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(appData)); } catch { /* noop */ }
}

// ============================================================
// DATE & SCHEDULE UTILITIES
// ============================================================

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function daysAgoStr(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function dowOf(dateStr) { return new Date(dateStr + 'T12:00:00').getDay(); }

function fmtDisplay(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return `${DAYS_SHORT[d.getDay()]}, ${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`;
}

function fmtCompact(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`;
}

function parseTime(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function fmtTime(mins) {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}

function getNutritionTargets() {
  const kg = appData.settings.bodyweightKg || 70;
  return {
    proteinMin: Math.round(kg * 1.8),
    proteinMax: Math.round(kg * 2.2),
    calories: Math.round(kg * 30),
  };
}

function getActiveScheduleBlocks(dateStr) {
  const blocks = appData.settings.scheduleBlocks.filter(b => b.enabled);
  if (!isWorkoutDay(dateStr)) return blocks.filter(b => b.type !== 'workout');
  return blocks;
}

function getNowBlockId(blocks) {
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  let current = null;
  for (const b of blocks) {
    if (parseTime(b.time) <= nowMins) current = b.id;
  }
  return current;
}

function getNextBlockId(blocks) {
  const nowMins = new Date().getHours() * 60 + new Date().getMinutes();
  const upcoming = blocks.find(b => parseTime(b.time) > nowMins);
  return upcoming?.id || null;
}

function shiftScheduleToWakeTime(newWake) {
  const blocks = appData.settings.scheduleBlocks;
  const oldWake = parseTime(appData.settings.wakeTime || '08:00');
  const newWakeM = parseTime(newWake);
  const delta = newWakeM - oldWake;
  blocks.forEach(b => {
    b.time = fmtTime(parseTime(b.time) + delta);
  });
  appData.settings.wakeTime = newWake;
}

// ============================================================
// DAY DATA
// ============================================================

function ensureTodayData() {
  const today = todayStr();
  if (!appData.days[today]) { appData.days[today] = buildEmptyDay(); save(); }
  return appData.days[today];
}

function buildEmptyDay() {
  return { schedule: {}, water: 0, workout: null };
}

function syncDaySchedule(dateStr) {
  const day = appData.days[dateStr];
  if (!day) return;
  if (!day.schedule) day.schedule = {};
  getActiveScheduleBlocks(dateStr).forEach(b => {
    if (!(b.id in day.schedule)) day.schedule[b.id] = false;
  });
}

function isWorkoutDay(dateStr) {
  return appData.settings.workoutSchedule.includes(dowOf(dateStr));
}

function getNextWorkoutId() {
  return WORKOUT_CYCLE[appData.workoutSequence % 3];
}

function toggleScheduleBlock(blockId) {
  const today = todayStr();
  const day = ensureTodayData();
  syncDaySchedule(today);
  day.schedule[blockId] = !day.schedule[blockId];
  save();
  renderHeader();
  if (activeTab === 'today') renderTodayTab();
}

// ============================================================
// COMPLETION & STREAKS
// ============================================================

function getDayPct(dateStr) {
  const day = appData.days[dateStr];
  if (!day) return 0;
  syncDaySchedule(dateStr);
  const blocks = getActiveScheduleBlocks(dateStr);
  const total = blocks.length + 1;
  let done = blocks.filter(b => day.schedule?.[b.id]).length;
  if ((day.water ?? 0) >= 6) done++;
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

function calcStreaks() {
  const today = todayStr();
  let running = 0;
  for (let i = 0; i <= 365; i++) {
    const dStr = daysAgoStr(i);
    const pct = getDayPct(dStr);
    const hasData = !!appData.days[dStr];
    if (dStr === today) { running++; continue; }
    if (hasData && pct >= 50) running++;
    else break;
  }
  let current = Math.max(0, running - 1);
  if (getDayPct(today) >= 50) current = running;
  if (current > (appData.bestStreak || 0)) { appData.bestStreak = current; save(); }
  return { current, best: appData.bestStreak || 0 };
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5)  return 'Late night.';
  if (h < 12) return 'Good morning.';
  if (h < 17) return 'Good afternoon.';
  if (h < 21) return 'Good evening.';
  return 'Almost bedtime.';
}

function getEncouragement(pct, streak) {
  if (pct === 100) return 'You showed up completely today.';
  if (pct >= 75)   return 'Nearly there — finish strong.';
  if (pct >= 50)   return "You're building real momentum.";
  if (pct >= 1)    return "You've begun — that's everything.";
  if (streak >= 7)  return `${streak} days in. The habit is forming.`;
  return 'One block at a time. No guilt if you miss one.';
}

// ============================================================
// EXERCISE MODAL & LIBRARY
// ============================================================

function exerciseMediaHtml(exId, cls) {
  const ex = EXERCISES[exId];
  if (!ex) return '';
  return `<div class="${cls || 'ex-media'}">
    <img class="ex-gif" src="${esc(ex.gifUrl)}" alt="${esc(ex.name)} demo"
      onerror="this.onerror=null;this.src='${esc(ex.svgUrl)}';" loading="lazy" />
  </div>`;
}

function openExerciseModal(exId) {
  const ex = EXERCISES[exId];
  if (!ex) return;
  let modal = document.getElementById('exercise-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'exercise-modal';
    modal.className = 'exercise-modal';
    document.body.appendChild(modal);
  }
  const easier = ex.easierId ? EXERCISES[ex.easierId] : null;
  const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(ex.youtubeQuery || ex.name)}`;
  modal.innerHTML = `
    <div class="exercise-modal-backdrop" id="modal-backdrop"></div>
    <div class="exercise-modal-sheet">
      <button class="modal-close" id="modal-close" aria-label="Close">✕</button>
      ${exerciseMediaHtml(exId, 'ex-media-modal')}
      <div class="modal-body">
        <span class="pill pill-${ex.category}">${ex.category}</span>
        <h2 class="modal-title">${esc(ex.name)}</h2>
        <p class="modal-muscles">${esc(ex.muscles)}</p>
        <p class="modal-desc">${esc(ex.desc)}</p>
        <div class="modal-section">
          <h3>Key cues</h3>
          <ul>${ex.cues.map(c => `<li>${esc(c)}</li>`).join('')}</ul>
        </div>
        <div class="modal-section">
          <h3>How to do it</h3>
          <ol>${ex.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
        </div>
        <div class="modal-section mistakes">
          <h3>Common mistakes</h3>
          <ul>${ex.mistakes.map(m => `<li>${esc(m)}</li>`).join('')}</ul>
        </div>
        ${easier ? `<div class="modal-section"><h3>Easier version</h3><p>Try <button class="link-btn" data-easier="${ex.easierId}">${esc(easier.name)}</button> first.</p></div>` : ''}
        <div class="modal-section"><h3>Progression</h3><p>${esc(ex.prog)}</p></div>
        <a class="btn btn-ghost btn-sm yt-link" href="${ytUrl}" target="_blank" rel="noopener">▶ Watch video demo</a>
      </div>
    </div>
  `;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  modal.querySelector('#modal-close')?.addEventListener('click', closeExerciseModal);
  modal.querySelector('#modal-backdrop')?.addEventListener('click', closeExerciseModal);
  modal.querySelector('[data-easier]')?.addEventListener('click', e => {
    openExerciseModal(e.target.dataset.easier);
  });
}

function closeExerciseModal() {
  const modal = document.getElementById('exercise-modal');
  if (modal) { modal.classList.remove('open'); document.body.style.overflow = ''; }
}

// ============================================================
// WORKOUT SESSION (SIMPLIFIED)
// ============================================================

let sessionData = null;
let timerSecs = 0;
let timerInt = null;
let showExerciseLibrary = false;

function initSession(workoutId) {
  const workout = WORKOUTS[workoutId];
  sessionData = {
    workoutId,
    exIdx: 0,
    sets: workout.exercises.map(exId =>
      Array.from({ length: EXERCISES[exId].targetSets }, () => ({ done: false, val: null }))
    ),
    showLog: false,
    startedAt: Date.now(),
  };
}

function persistSession() {
  const today = todayStr();
  if (!appData.days[today]) appData.days[today] = buildEmptyDay();
  if (sessionData) appData.days[today].workoutInProgress = JSON.parse(JSON.stringify(sessionData));
  else delete appData.days[today]?.workoutInProgress;
  save();
}

function restoreSession() {
  const day = appData.days[todayStr()];
  if (day?.workoutInProgress && !day.workout?.completed) {
    sessionData = day.workoutInProgress;
    return true;
  }
  return false;
}

function stopTimer() {
  if (timerInt) { clearInterval(timerInt); timerInt = null; }
  timerSecs = 0;
}

function startWorkout() {
  initSession(getNextWorkoutId());
  persistSession();
  renderWorkoutTab();
}

function quitWorkout() {
  if (!confirm('Quit workout? Progress will be lost.')) return;
  stopTimer();
  sessionData = null;
  delete appData.days[todayStr()]?.workoutInProgress;
  save();
  renderWorkoutTab();
}

function completeWorkout() {
  if (!sessionData) return;
  stopTimer();
  const today = todayStr();
  const workout = WORKOUTS[sessionData.workoutId];
  const exercises = workout.exercises.map((exId, i) => ({
    id: exId,
    sets: sessionData.sets[i].map(s => s.done ? (s.val ?? 1) : null),
    best: sessionData.sets[i].filter(s => s.done).length,
  }));
  if (!appData.days[today]) appData.days[today] = buildEmptyDay();
  appData.days[today].workout = {
    workoutId: sessionData.workoutId,
    completed: true,
    completedAt: new Date().toISOString(),
    exercises,
  };
  appData.days[today].schedule = appData.days[today].schedule || {};
  appData.days[today].schedule.workout = true;
  delete appData.days[today].workoutInProgress;
  appData.workoutSequence++;
  save();
  sessionData = null;
  showToast('Workout saved!');
  renderHeader();
  renderWorkoutTab();
  if (activeTab === 'today') renderTodayTab();
}

function toggleSet(exIdx, setIdx) {
  if (!sessionData) return;
  const s = sessionData.sets[exIdx][setIdx];
  s.done = !s.done;
  if (s.done && s.val == null) s.val = 1;
  persistSession();
  renderSession();
}

// ============================================================
// NAVIGATION
// ============================================================

let activeTab = 'today';

function showTab(name) {
  activeTab = name;
  document.querySelectorAll('.tab-content').forEach(el =>
    el.classList.toggle('active', el.dataset.tab === name)
  );
  document.querySelectorAll('.nav-btn').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.tab === name)
  );
  if (name === 'today')    renderTodayTab();
  if (name === 'workout')  renderWorkoutTab();
  if (name === 'progress') renderProgressTab();
  if (name === 'settings') renderSettingsTab();
}

// ============================================================
// RENDER — HEADER
// ============================================================

function renderHeader() {
  const dateEl = document.getElementById('header-date');
  const streakEl = document.getElementById('header-streak');
  if (dateEl) dateEl.textContent = fmtDisplay(todayStr());
  if (streakEl) streakEl.textContent = calcStreaks().current;
}

function updateRing(pct) {
  const R = 34, circ = 2 * Math.PI * R;
  const ringFill = document.getElementById('ring-fill');
  const ringPct = document.getElementById('ring-pct');
  if (ringFill) {
    ringFill.setAttribute('stroke-dasharray', circ);
    ringFill.setAttribute('stroke-dashoffset', circ * (1 - pct / 100));
  }
  if (ringPct) ringPct.textContent = pct + '%';
}

// ============================================================
// RENDER — TODAY / SCHEDULE TAB
// ============================================================

function renderTodayTab() {
  const today = todayStr();
  const day = ensureTodayData();
  syncDaySchedule(today);
  const pct = getDayPct(today);
  const { current: streak } = calcStreaks();
  const targets = getNutritionTargets();

  updateRing(pct);
  setElText('overview-greeting', getGreeting());
  setElText('overview-enc', getEncouragement(pct, streak));

  const nutEl = document.getElementById('nutrition-targets');
  if (nutEl) {
    nutEl.innerHTML = `
      <div class="nut-row"><span class="nut-label">Protein target</span><span class="nut-val">${targets.proteinMin}–${targets.proteinMax} g/day</span></div>
      <div class="nut-row"><span class="nut-label">Calories (maintenance)</span><span class="nut-val">~${targets.calories} kcal</span></div>
      <div class="nut-strategy">Body recomposition — build muscle at maintenance, not a dirty bulk.</div>
    `;
  }

  renderScheduleTimeline(day, today);
  renderSupplementsCard();
  renderRecompCard();
  renderWater(day);
  renderSevenDots('seven-day-dots');
}

function renderScheduleTimeline(day, dateStr) {
  const container = document.getElementById('schedule-timeline');
  if (!container) return;
  const blocks = getActiveScheduleBlocks(dateStr);
  const nowId = getNowBlockId(blocks);
  const nextId = getNextBlockId(blocks);

  container.innerHTML = '';
  blocks.forEach(block => {
    const done = !!day.schedule?.[block.id];
    const isNow = block.id === nowId || (block.id === nextId && !nowId);
    const isNext = block.id === nextId;
    const meal = block.mealId ? MEALS[block.mealId] : null;

    const el = document.createElement('div');
    el.className = `schedule-block${done ? ' done' : ''}${isNow ? ' now' : ''}${isNext && !done ? ' upcoming' : ''}`;

    let extra = '';
    if (meal) {
      extra = `
        <div class="meal-short">${esc(meal.short)} · ~${meal.protein}g protein</div>
        <details class="meal-details"><summary>Full meal</summary><p>${esc(meal.detail)}</p></details>
      `;
    }
    if (block.type === 'workout') {
      extra += `<button class="link-btn schedule-workout-link" type="button">Open workout →</button>`;
    }

    el.innerHTML = `
      <div class="schedule-time">${esc(block.time)}</div>
      <div class="schedule-line"><div class="schedule-dot${done ? ' checked' : ''}"></div></div>
      <div class="schedule-content">
        <div class="schedule-block-header">
          <div class="check-box schedule-check${done ? ' checked' : ''}" data-block="${block.id}">
            <svg class="check-icon" viewBox="0 0 12 10"><polyline points="1.5,5.5 4.5,9 10.5,1"/></svg>
          </div>
          <div>
            <div class="schedule-label">${esc(block.label)}</div>
            ${isNow && !done ? '<span class="now-badge">Now</span>' : ''}
            ${isNext && !done && !isNow ? '<span class="next-badge">Up next</span>' : ''}
          </div>
        </div>
        ${extra}
      </div>
    `;

    el.querySelector('.schedule-check')?.addEventListener('click', e => {
      e.stopPropagation();
      toggleScheduleBlock(block.id);
    });
    el.querySelector('.schedule-workout-link')?.addEventListener('click', e => {
      e.stopPropagation();
      showTab('workout');
    });
    el.querySelector('.meal-details')?.addEventListener('click', e => e.stopPropagation());

    container.appendChild(el);
  });
}

function renderSupplementsCard() {
  const el = document.getElementById('supplements-card');
  if (!el) return;
  el.innerHTML = SUPPLEMENTS.map(s => `
    <div class="supp-row supp-${s.verdict}">
      <div class="supp-name">${esc(s.name)}</div>
      <div class="supp-verdict">${s.verdict === 'yes' ? '✓ Recommended' : s.verdict === 'skip' ? '✗ Skip for now' : 'Optional'}</div>
      <div class="supp-dose">${esc(s.dose)}</div>
      <div class="supp-why">${esc(s.why)}</div>
    </div>
  `).join('') + `<p class="supp-disclaimer">Informational only — not medical advice. Ask a doctor if you have kidney concerns before creatine.</p>`;
}

function renderRecompCard() {
  const el = document.getElementById('recomp-tips');
  if (!el) return;
  el.innerHTML = `<ul>${RECOMP_TIPS.map(t => `<li>${esc(t)}</li>`).join('')}</ul>`;
}

function renderWater(day) {
  const w = day?.water ?? 0;
  setElText('water-count', w);
  const dotsEl = document.getElementById('water-dots');
  if (dotsEl) {
    dotsEl.innerHTML = Array.from({ length: 8 }, (_, i) =>
      `<div class="w-dot${i < w ? ' filled' : ''}"></div>`
    ).join('');
  }
}

function adjustWater(delta) {
  const day = ensureTodayData();
  day.water = Math.max(0, Math.min(15, (day.water ?? 0) + delta));
  save();
  renderWater(day);
  renderHeader();
  updateRing(getDayPct(todayStr()));
}

function renderSevenDots(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  const today = todayStr();
  for (let i = 6; i >= 0; i--) {
    const dStr = daysAgoStr(i);
    const pct = getDayPct(dStr);
    const hasData = !!appData.days[dStr];
    const isToday = dStr === today;
    const workoutDone = !!appData.days[dStr]?.workout?.completed;
    let lv = 0;
    if (hasData || isToday) {
      if (pct >= 75) lv = 3;
      else if (pct >= 50) lv = 2;
      else if (pct >= 1) lv = 1;
    }
    const d = new Date(dStr + 'T12:00:00');
    const item = document.createElement('div');
    item.className = 'day-dot-item';
    item.innerHTML = `
      <div class="day-dot-name">${DAYS_ABBREV[d.getDay()]}</div>
      <div class="day-dot lv${lv}${isToday ? ' today' : ''}">${pct > 0 ? pct + '%' : (isToday ? '—' : '')}</div>
      <div class="day-dot-workout">${workoutDone ? '🏋' : ''}</div>
    `;
    container.appendChild(item);
  }
}

function setElText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

// ============================================================
// RENDER — WORKOUT TAB
// ============================================================

function renderWorkoutTab() {
  const preview = document.getElementById('workout-preview');
  const sessionEl = document.getElementById('workout-session');
  if (!preview || !sessionEl) return;

  const today = todayStr();
  const day = ensureTodayData();
  const completed = day.workout?.completed;
  const todayIsWD = isWorkoutDay(today);

  if (showExerciseLibrary) {
    preview.style.display = '';
    sessionEl.classList.remove('active');
    renderExerciseLibrary(preview);
    return;
  }

  if (sessionData && !completed) {
    preview.style.display = 'none';
    sessionEl.classList.add('active');
    renderSession();
    return;
  }

  preview.style.display = '';
  sessionEl.classList.remove('active');
  if (completed) renderWorkoutComplete(preview, day.workout);
  else if (todayIsWD) renderWorkoutPreview(preview, getNextWorkoutId());
  else renderRestDay(preview, getNextWorkoutId());
}

function renderCalisthenicsPath(container) {
  const pathHtml = CALISTHENICS_PATH.map((p, i) =>
    `<span class="path-step">${i > 0 ? '→ ' : ''}${esc(p.label)}</span>`
  ).join('');
  return `<div class="path-strip"><span class="path-label">Your pull-up path:</span> ${pathHtml}</div>`;
}

function renderWorkoutPreview(container, wId) {
  const w = WORKOUTS[wId];
  container.innerHTML = `
    <div class="workout-header-card">
      <div class="workout-day-badge">${w.emoji} Workout ${wId} · ~25 min</div>
      <div class="workout-name">${w.name}</div>
      <div class="workout-focus">${w.focus}</div>
      ${renderCalisthenicsPath()}
      <button class="btn btn-primary mt-16" id="start-workout-btn">▶ Start Workout</button>
      <button class="btn btn-ghost mt-8" id="open-library-btn">📚 Exercise Library — see how each move looks</button>
    </div>
    <div class="card">
      <div class="card-header"><h2>Today's exercises</h2></div>
      <div id="exercise-list-preview"></div>
    </div>
  `;
  document.getElementById('start-workout-btn')?.addEventListener('click', () => { showExerciseLibrary = false; startWorkout(); });
  document.getElementById('open-library-btn')?.addEventListener('click', () => { showExerciseLibrary = true; renderWorkoutTab(); });
  renderExerciseListSimple(document.getElementById('exercise-list-preview'), w.exercises);
}

function renderExerciseListSimple(container, exerciseIds) {
  if (!container) return;
  container.innerHTML = '';
  exerciseIds.forEach(exId => {
    const ex = EXERCISES[exId];
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'exercise-library-row';
    row.innerHTML = `
      <img class="ex-thumb" src="${esc(ex.gifUrl)}" alt="" onerror="this.src='${esc(ex.svgUrl)}'" loading="lazy" />
      <div class="ex-lib-info">
        <div class="ex-name">${esc(ex.name)}</div>
        <div class="ex-target">${ex.targetSets} sets · ${ex.targetMin}–${ex.targetMax} ${ex.unit}</div>
      </div>
      <span class="ex-learn">How to →</span>
    `;
    row.addEventListener('click', () => openExerciseModal(exId));
    container.appendChild(row);
  });
}

function renderExerciseLibrary(container) {
  container.innerHTML = `
    <div class="library-header">
      <button class="btn btn-ghost btn-sm" id="back-from-library">← Back</button>
      <h2>Exercise Library</h2>
      <p class="text-muted">Tap any exercise to see GIF, steps, and common mistakes.</p>
    </div>
    <div class="card"><div id="library-grid"></div></div>
  `;
  document.getElementById('back-from-library')?.addEventListener('click', () => {
    showExerciseLibrary = false;
    renderWorkoutTab();
  });
  renderExerciseListSimple(document.getElementById('library-grid'), Object.keys(EXERCISES));
}

function renderRestDay(container, nextWId) {
  const next = WORKOUTS[nextWId];
  container.innerHTML = `
    <div class="card"><div class="rest-day-card">
      <div class="rest-day-emoji">🌿</div>
      <div class="rest-day-title">Rest Day</div>
      <div class="rest-day-text">Recovery is when gains happen. Muscles repair and grow stronger today — not in the gym.<br><br>Next: <strong>${next.emoji} ${next.name}</strong></div>
      <button class="btn btn-ghost mt-16" id="open-library-rest">📚 Browse Exercise Library</button>
    </div></div>
  `;
  document.getElementById('open-library-rest')?.addEventListener('click', () => {
    showExerciseLibrary = true;
    renderWorkoutTab();
  });
}

function renderWorkoutComplete(container, wData) {
  const w = WORKOUTS[wData.workoutId];
  container.innerHTML = `
    <div class="workout-done-card">
      <div class="workout-done-emoji">🎉</div>
      <div class="workout-done-title">Workout complete!</div>
      <div class="workout-done-sub">${w.emoji} ${w.name}</div>
    </div>
  `;
}

function renderSession() {
  const container = document.getElementById('workout-session');
  if (!container || !sessionData) return;

  const workout = WORKOUTS[sessionData.workoutId];
  const totalEx = workout.exercises.length;
  const curIdx = sessionData.exIdx;
  const ex = EXERCISES[workout.exercises[curIdx]];
  const sets = sessionData.sets[curIdx];
  const allDone = sets.every(s => s.done);
  const isLast = curIdx === totalEx - 1;
  const progress = ((curIdx + (allDone ? 1 : 0.5)) / totalEx) * 100;

  const timerHtml = ex.trackType === 'time' ? `
    <div class="timer-section">
      <div class="timer-display" id="timer-display">0:00</div>
      <div class="timer-hint">Hold your set, then tap Stop</div>
      <div class="timer-btns">
        <button class="btn btn-secondary btn-sm" id="timer-start-btn">▶ Start</button>
        <button class="btn btn-ghost btn-sm" id="timer-stop-btn" disabled>⏹ Stop</button>
      </div>
    </div>
  ` : '';

  const setsHtml = sets.map((s, i) => `
    <button type="button" class="set-tap${s.done ? ' done' : ''}" data-sidx="${i}">
      <span class="set-tap-num">Set ${i + 1}</span>
      <span class="set-tap-status">${s.done ? '✓ Done' : 'Tap when finished'}</span>
    </button>
  `).join('');

  const navHtml = allDone
    ? (isLast
        ? `<button class="btn btn-success" id="sess-finish-btn">✓ Finish Workout</button>`
        : `<button class="btn btn-primary" id="sess-next-btn">Next Exercise →</button>`)
    : `<p class="text-dim" style="text-align:center;padding:8px 0">Complete all sets to continue</p>`;

  container.innerHTML = `
    <div class="session-header">
      <span class="session-ex-label">${curIdx + 1} / ${totalEx}</span>
      <button class="session-quit-btn" id="sess-quit-btn">Quit</button>
    </div>
    <div class="session-progress-bar"><div class="session-progress-fill" style="width:${progress}%"></div></div>
    ${exerciseMediaHtml(workout.exercises[curIdx], 'ex-media-session')}
    <div class="session-ex-card">
      <div class="session-ex-header">
        <div class="session-ex-name">${esc(ex.name)}</div>
        <div class="session-ex-meta"><span class="pill pill-${ex.category}">${ex.category}</span>
          <span class="text-dim">${ex.targetSets} sets · ${ex.targetMin}–${ex.targetMax} ${ex.unit}</span></div>
      </div>
      ${timerHtml}
      <div class="session-sets-simple">${setsHtml}</div>
      <button class="link-btn" type="button" id="show-how-btn">How to do this exercise</button>
    </div>
    <div class="session-nav single">${navHtml}</div>
    ${curIdx > 0 ? `<button class="btn btn-ghost btn-sm" id="sess-prev-btn" style="width:100%;margin-top:8px">← Previous</button>` : ''}
  `;

  container.querySelectorAll('.set-tap').forEach(btn => {
    btn.addEventListener('click', () => toggleSet(curIdx, parseInt(btn.dataset.sidx)));
  });
  document.getElementById('sess-quit-btn')?.addEventListener('click', quitWorkout);
  document.getElementById('sess-next-btn')?.addEventListener('click', () => {
    sessionData.exIdx++; persistSession(); renderSession();
  });
  document.getElementById('sess-prev-btn')?.addEventListener('click', () => {
    if (sessionData.exIdx > 0) { sessionData.exIdx--; persistSession(); renderSession(); }
  });
  document.getElementById('sess-finish-btn')?.addEventListener('click', completeWorkout);
  document.getElementById('show-how-btn')?.addEventListener('click', () => openExerciseModal(workout.exercises[curIdx]));

  if (ex.trackType === 'time') setupSimpleTimer(curIdx);
}

function setupSimpleTimer(exIdx) {
  const display = document.getElementById('timer-display');
  const startBtn = document.getElementById('timer-start-btn');
  const stopBtn = document.getElementById('timer-stop-btn');
  if (!display) return;
  stopTimer();
  timerSecs = 0;
  display.textContent = '0:00';
  startBtn?.addEventListener('click', () => {
    if (timerInt) return;
    startBtn.disabled = true;
    stopBtn.disabled = false;
    timerInt = setInterval(() => {
      timerSecs++;
      display.textContent = `${Math.floor(timerSecs/60)}:${String(timerSecs%60).padStart(2,'0')}`;
    }, 1000);
  });
  stopBtn?.addEventListener('click', () => {
    stopTimer();
    startBtn.disabled = false;
    stopBtn.disabled = true;
    const empty = sessionData.sets[exIdx].findIndex(s => !s.done);
    if (empty !== -1) {
      sessionData.sets[exIdx][empty].val = timerSecs;
      sessionData.sets[exIdx][empty].done = true;
      persistSession();
      renderSession();
    }
    display.textContent = '0:00';
  });
}

// ============================================================
// RENDER — PROGRESS TAB
// ============================================================

function renderProgressTab() {
  const container = document.querySelector('[data-tab="progress"]');
  if (!container) return;
  const { current, best } = calcStreaks();
  const totalWorkouts = Object.values(appData.days).filter(d => d.workout?.completed).length;
  const todayPct = getDayPct(todayStr());

  container.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-value">${current}</div><div class="stat-label">Day Streak</div></div>
      <div class="stat-card"><div class="stat-value">${best}</div><div class="stat-label">Best Streak</div></div>
      <div class="stat-card"><div class="stat-value">${totalWorkouts}</div><div class="stat-label">Workouts</div></div>
      <div class="stat-card"><div class="stat-value">${todayPct}%</div><div class="stat-label">Today</div></div>
    </div>
    <div class="section-title">Calisthenics path</div>
    <div class="card path-card">${renderCalisthenicsPath()}</div>
    <div class="section-title">Last 7 Days</div>
    <div class="card"><div class="seven-day-section"><div class="seven-day-dots" id="progress-7day-dots"></div></div></div>
    <div class="section-title">Recent Workouts</div>
    <div class="card"><div id="recent-workouts"></div></div>
  `;
  renderSevenDots('progress-7day-dots');

  const recent = document.getElementById('recent-workouts');
  if (recent) {
    const wDays = Object.entries(appData.days).filter(([, d]) => d.workout?.completed)
      .sort(([a], [b]) => b.localeCompare(a)).slice(0, 7);
    if (!wDays.length) {
      recent.innerHTML = `<div class="empty-note">No workouts yet. Start with today's session.</div>`;
    } else {
      wDays.forEach(([dateStr, day]) => {
        const wd = WORKOUTS[day.workout.workoutId];
        const row = document.createElement('div');
        row.className = 'best-item';
        row.innerHTML = `<div class="best-ex-info"><div class="best-ex-name">${wd.emoji} ${wd.name}</div><div class="best-ex-date">${fmtDisplay(dateStr)}</div></div>`;
        recent.appendChild(row);
      });
    }
  }
}

// ============================================================
// RENDER — SETTINGS TAB
// ============================================================

function renderSettingsTab() {
  const container = document.querySelector('[data-tab="settings"]');
  if (!container) return;
  const s = appData.settings;
  const targets = getNutritionTargets();

  container.innerHTML = `
    <div class="settings-group">
      <div class="settings-group-title">Schedule</div>
      <div class="settings-card">
        <div class="setting-row">
          <div class="setting-row-info">
            <div class="setting-row-label">Wake time</div>
            <div class="setting-row-sub">Shifts your whole daily schedule</div>
          </div>
          <input type="time" id="wake-time-input" value="${esc(s.wakeTime)}" class="time-input" />
        </div>
        <div class="setting-row">
          <div class="setting-row-info">
            <div class="setting-row-label">Body weight (kg)</div>
            <div class="setting-row-sub">Protein: ${targets.proteinMin}–${targets.proteinMax}g · ~${targets.calories} kcal</div>
          </div>
          <input type="number" id="bodyweight-input" value="${s.bodyweightKg}" min="40" max="150" class="num-input" />
        </div>
      </div>
    </div>

    <div class="settings-group">
      <div class="settings-group-title">Workout days</div>
      <div class="settings-card">
        <div class="day-picker" id="day-picker">
          ${DAYS_SHORT.map((name, i) =>
            `<button type="button" class="day-picker-btn${s.workoutSchedule.includes(i) ? ' on' : ''}" data-dow="${i}">${name}</button>`
          ).join('')}
        </div>
      </div>
    </div>

    <div class="settings-group">
      <div class="settings-group-title">Daily blocks <span class="text-dim">tap label to edit</span></div>
      <div class="settings-card" id="schedule-editor"></div>
    </div>

    <div class="settings-group">
      <div class="settings-group-title">Data</div>
      <div class="settings-card">
        <div class="setting-row">
          <div class="setting-row-info"><div class="setting-row-label">Export data</div></div>
          <button class="btn btn-secondary btn-sm" id="btn-export">Export</button>
        </div>
        <div class="setting-row">
          <div class="setting-row-info"><div class="setting-row-label" style="color:var(--danger)">Reset everything</div></div>
          <button class="btn btn-danger btn-sm" id="btn-reset">Reset</button>
        </div>
      </div>
    </div>
    <div class="settings-group">
      <div class="settings-card"><div class="setting-row"><div class="setting-row-info">
        <div class="setting-row-label">Daily Reset v2</div>
        <div class="setting-row-sub">All data stays on this device.</div>
      </div></div></div>
    </div>
  `;

  document.getElementById('wake-time-input')?.addEventListener('change', e => {
    shiftScheduleToWakeTime(e.target.value);
    save();
    renderSettingsTab();
    if (activeTab === 'today') renderTodayTab();
  });

  document.getElementById('bodyweight-input')?.addEventListener('change', e => {
    appData.settings.bodyweightKg = Math.max(40, Math.min(150, parseInt(e.target.value) || 70));
    save();
    renderSettingsTab();
    if (activeTab === 'today') renderTodayTab();
  });

  document.querySelectorAll('.day-picker-btn').forEach(btn => {
    btn.addEventListener('click', () => toggleScheduleDay(parseInt(btn.dataset.dow)));
  });

  renderScheduleEditor(document.getElementById('schedule-editor'));
  document.getElementById('btn-export')?.addEventListener('click', exportData);
  document.getElementById('btn-reset')?.addEventListener('click', resetAllData);
}

function renderScheduleEditor(container) {
  if (!container) return;
  container.innerHTML = '';
  appData.settings.scheduleBlocks.forEach(block => {
    const row = document.createElement('div');
    row.className = 'schedule-edit-row';
    row.innerHTML = `
      <input type="time" class="time-input-sm" value="${esc(block.time)}" data-id="${block.id}" data-field="time" />
      <input type="text" class="editable-input" value="${esc(block.label)}" data-id="${block.id}" data-field="label" />
      <label class="toggle-wrap toggle-sm">
        <input type="checkbox" ${block.enabled ? 'checked' : ''} data-id="${block.id}" data-field="enabled" />
        <div class="toggle-track"><div class="toggle-thumb"></div></div>
      </label>
    `;
    row.querySelector('[data-field=time]')?.addEventListener('change', e => {
      const b = appData.settings.scheduleBlocks.find(x => x.id === block.id);
      if (b) { b.time = e.target.value; save(); if (activeTab === 'today') renderTodayTab(); }
    });
    row.querySelector('[data-field=label]')?.addEventListener('blur', e => {
      const b = appData.settings.scheduleBlocks.find(x => x.id === block.id);
      if (b && e.target.value.trim()) { b.label = e.target.value.trim(); save(); if (activeTab === 'today') renderTodayTab(); }
    });
    row.querySelector('[data-field=enabled]')?.addEventListener('change', e => {
      const b = appData.settings.scheduleBlocks.find(x => x.id === block.id);
      if (b) { b.enabled = e.target.checked; save(); if (activeTab === 'today') renderTodayTab(); }
    });
    container.appendChild(row);
  });
}

function toggleScheduleDay(dow) {
  const sched = appData.settings.workoutSchedule;
  const idx = sched.indexOf(dow);
  if (idx !== -1) {
    if (sched.length <= 1) { showToast('Keep at least 1 workout day'); return; }
    sched.splice(idx, 1);
  } else { sched.push(dow); sched.sort((a, b) => a - b); }
  save();
  renderSettingsTab();
  if (activeTab === 'today') renderTodayTab();
}

function exportData() {
  const json = JSON.stringify(appData, null, 2);
  const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: `daily-reset-${todayStr()}.json` });
  a.click();
  URL.revokeObjectURL(url);
}

function resetAllData() {
  if (!confirm('Delete ALL data? Cannot be undone.')) return;
  if (!confirm('Last chance — start completely fresh?')) return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STORAGE_KEY_V1);
  appData = freshAppData();
  sessionData = null;
  save();
  showToast('Fresh start.');
  showTab('today');
  renderHeader();
}

// ============================================================
// TOAST & UTILS
// ============================================================

let toastTimer = null;

function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('visible'), 2600);
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

function init() {
  appData = loadAppData();
  restoreSession();
  registerSW();

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => showTab(btn.dataset.tab));
  });
  document.getElementById('water-minus')?.addEventListener('click', () => adjustWater(-1));
  document.getElementById('water-plus')?.addEventListener('click', () => adjustWater(+1));

  renderHeader();
  showTab('today');
}

document.addEventListener('DOMContentLoaded', init);
