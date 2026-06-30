'use strict';

// Program exercises + catalog: see exercises.js

// Workout programs grouped by training style. Each goal maps to a style,
// so a fat-loss user gets conditioning circuits instead of strength calisthenics.
const WORKOUT_PROGRAMS = {
  strength: {
    label: 'Calisthenics',
    cycle: ['A', 'B', 'C'],
    workouts: {
      A: {
        id: 'A', name: 'Push & Legs', icon: 'dumbbell', style: 'strength',
        focus: 'Chest · Shoulders · Legs · Core',
        exercises: ['pushups', 'pike_pushups', 'squats', 'glute_bridge', 'plank'],
      },
      B: {
        id: 'B', name: 'Pull & Core', icon: 'dumbbell', style: 'strength',
        focus: 'Back · Grip · Pull-up prep · Core',
        exercises: ['dead_hang', 'scapular_pulls', 'negative_pullups', 'inverted_rows', 'hollow_hold'],
      },
      C: {
        id: 'C', name: 'Full Body', icon: 'zap', style: 'strength',
        focus: 'Total body · Conditioning',
        exercises: ['pushups', 'negative_pullups', 'squats', 'mountain_climbers', 'plank'],
      },
    },
  },
  fatloss: {
    label: 'Conditioning circuit',
    cycle: ['F1', 'F2', 'F3'],
    workouts: {
      F1: {
        id: 'F1', name: 'Fat-Burn Circuit', icon: 'zap', style: 'fatloss',
        focus: 'Full body · Cardio · Fat loss',
        exercises: ['jumping_jacks', 'squats', 'mountain_climbers', 'high_knees', 'plank'],
      },
      F2: {
        id: 'F2', name: 'Cardio & Core', icon: 'zap', style: 'fatloss',
        focus: 'Heart rate · Core · Conditioning',
        exercises: ['high_knees', 'mountain_climbers', 'burpees', 'glute_bridge', 'hollow_hold'],
      },
      F3: {
        id: 'F3', name: 'Full Body Burn', icon: 'zap', style: 'fatloss',
        focus: 'Total body · High calorie burn',
        exercises: ['burpees', 'jumping_jacks', 'squats', 'pushups', 'mountain_climbers'],
      },
    },
  },
  maintain: {
    label: 'Balanced workout',
    cycle: ['MX1', 'MX2'],
    workouts: {
      MX1: {
        id: 'MX1', name: 'Strength & Sweat', icon: 'dumbbell', style: 'maintain',
        focus: 'Strength · Conditioning · Core',
        exercises: ['pushups', 'squats', 'mountain_climbers', 'glute_bridge', 'plank'],
      },
      MX2: {
        id: 'MX2', name: 'Pull & Move', icon: 'dumbbell', style: 'maintain',
        focus: 'Back · Cardio · Core',
        exercises: ['scapular_pulls', 'inverted_rows', 'jumping_jacks', 'high_knees', 'hollow_hold'],
      },
    },
  },
};

const GOAL_TO_STYLE = { lose: 'fatloss', recomp: 'strength', gain: 'strength', maintain: 'maintain' };

// Flat lookup of every workout by id (across all styles) for stored sessions.
const WORKOUTS = Object.values(WORKOUT_PROGRAMS).reduce((acc, prog) => {
  Object.assign(acc, prog.workouts);
  return acc;
}, {});


const MEALS = {
  breakfast: {
    title: 'Breakfast', time: '08:30', protein: 35, calories: 520,
    short: '3 eggs, oats with banana, glass of milk',
    detail: 'Scramble or boil 3 eggs. Cook ½ cup oats with water or milk, top with a sliced banana. Drink a glass of milk or have yogurt on the side.',
  },
  lunch: {
    title: 'Lunch', time: '12:30', protein: 45, calories: 650,
    short: 'Chicken breast, rice, vegetables, drizzle of olive oil',
    detail: 'Palm-sized chicken breast (150-200g), 1 cup cooked rice, large handful of vegetables (broccoli, peppers, salad). Cook with a teaspoon of olive oil.',
  },
  snack: {
    title: 'Snack', time: '15:00', protein: 20, calories: 280,
    short: 'Greek yogurt + handful of nuts',
    detail: '1 cup Greek yogurt (high protein) plus a small handful of almonds or walnuts. Good time to drink 1-2 glasses of water.',
  },
  dinner: {
    title: 'Dinner', time: '18:30', protein: 40, calories: 580,
    short: 'Fish or lean beef, potatoes, salad',
    detail: '150-200g salmon, white fish, or lean beef. 1-2 medium potatoes or sweet potato. Large side salad or steamed vegetables.',
  },
};

function getSupplements() {
  const { bmi } = getNutritionTargets();
  const goal = getProfile().goal || 'recomp';

  if (bmi < 18.5) {
    return [
      { name: 'Mass gainer', verdict: 'yes', dose: '1 serving post-workout on training days',
        why: 'You are underweight. A mass gainer combined with training is an efficient way to reach a caloric surplus without eating uncomfortably large meals.' },
      { name: 'Creatine monohydrate', verdict: 'yes', dose: '3-5 g/day, any time',
        why: 'Adds strength and helps build lean mass — especially valuable while you are gaining weight.' },
      { name: 'Whey protein', verdict: 'yes', dose: '1 scoop after training if needed',
        why: 'Helps hit protein targets on days when eating more whole food is difficult.' },
    ];
  }

  if (goal === 'lose') {
    const overBmi = bmi >= 30;
    return [
      { name: 'Creatine monohydrate', verdict: 'optional', dose: '3-5 g/day if you choose to use it',
        why: overBmi
          ? 'Can help preserve muscle during a calorie deficit, but optional — focus on your diet first.'
          : 'Helps retain strength and muscle while in a calorie deficit. Worthwhile if you train consistently.' },
      { name: 'Whey protein', verdict: overBmi ? 'optional' : 'yes', dose: '1 scoop on days you miss your protein target',
        why: 'Hitting your protein goal is the single most important supplement strategy for fat loss — it keeps you full and preserves muscle.' },
      { name: 'Mass gainer', verdict: 'skip', dose: 'Skip',
        why: 'Mass gainers are calorie-dense by design. They work against a fat-loss goal.' },
    ];
  }

  return [
    { name: 'Creatine monohydrate', verdict: 'yes', dose: '3-5 g/day, any time, daily',
      why: 'Well-researched for strength and muscle. Near-zero calories. Works for any build goal.' },
    { name: 'Whey protein', verdict: 'optional', dose: 'Only if needed',
      why: 'Optional helper if you consistently miss your daily protein target from meals.' },
    { name: 'Mass gainer', verdict: 'skip', dose: 'Skip for now',
      why: 'High-sugar calorie bombs can add fat instead of muscle. Eat real food first.' },
  ];
}

const DAYS_SHORT  = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_ABBREV = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ============================================================
// STORAGE
// ============================================================

const STORAGE_KEY = 'daily_reset_v3';
const STORAGE_KEY_V2 = 'daily_reset_v2';
const STORAGE_KEY_V1 = 'daily_reset_v1';
let appData = null;

function getDefaultProfile() {
  return {
    onboardingComplete: false,
    name: '',
    gender: 'male',
    age: 20,
    heightCm: 175,
    weightKg: 70,
    weightUnit: 'kg',
    goal: 'recomp',
  };
}

function goalMealTip(goal, mealId) {
  const tips = {
    lose: {
      breakfast: 'Breakfast',
      lunch: 'Lunch',
      snack: 'Snack + water check-in',
      dinner: 'Dinner (protein first, smaller starch portion)',
    },
    gain: {
      breakfast: 'Breakfast (do not skip)',
      lunch: 'Lunch',
      snack: 'Snack + extra calories if you are short',
      dinner: 'Dinner (eat until satisfied)',
    },
    recomp: {
      breakfast: 'Breakfast',
      lunch: 'Lunch',
      snack: 'Snack + water check-in',
      dinner: 'Dinner',
    },
    maintain: {
      breakfast: 'Breakfast',
      lunch: 'Lunch',
      snack: 'Snack + water check-in',
      dinner: 'Dinner',
    },
  };
  return tips[goal]?.[mealId] || MEALS[mealId]?.title || mealId;
}

function getWorkoutBlockLabel(goal) {
  const style = GOAL_TO_STYLE[goal] || 'strength';
  return `${(WORKOUT_PROGRAMS[style] || WORKOUT_PROGRAMS.strength).label} workout`;
}

function getDefaultScheduleBlocks(profile) {
  const goal = profile?.goal || 'recomp';
  return [
    { id: 'wake',     time: '08:00', label: 'Wake up. Leave your phone out of bed and get up within 15 minutes.', type: 'habit',   enabled: true },
    { id: 'routine',  time: '08:15', label: 'Morning routine. Brush teeth and make the bed.',                  type: 'habit',   enabled: true },
    { id: 'breakfast',time: '08:30', label: goalMealTip(goal, 'breakfast'),                                type: 'meal',    mealId: 'breakfast', enabled: true },
    { id: 'workout',  time: '09:30', label: getWorkoutBlockLabel(goal),                                       type: 'workout', enabled: true },
    { id: 'lunch',    time: '12:30', label: goalMealTip(goal, 'lunch'),                                    type: 'meal',    mealId: 'lunch', enabled: true },
    { id: 'snack',    time: '15:00', label: goalMealTip(goal, 'snack'),                                    type: 'meal',    mealId: 'snack', enabled: true },
    { id: 'dinner',   time: '18:30', label: goalMealTip(goal, 'dinner'),                                   type: 'meal',    mealId: 'dinner', enabled: true },
    { id: 'winddown', time: '21:30', label: 'Screens off before bed',                                        type: 'habit',   enabled: true },
  ];
}

function getDefaultSettings(profile) {
  const p = profile || getDefaultProfile();
  return {
    wakeTime: '08:00',
    bodyweightKg: p.weightKg || 70,
    scheduleBlocks: getDefaultScheduleBlocks(p),
    workoutSchedule: [1, 3, 5],
          ...getDefaultSettingsExtras(),
        };
        migrateNotificationSettings(appData.settings);
}

// Re-tune the plan when the goal changes (onboarding finish, AI, settings).
// Preserves custom blocks, times, and enabled states; nutrition targets are
// derived live from profile.goal in getNutritionTargets().
function applyGoalToPlan() {
  const goal = getProfile().goal || 'recomp';
  (appData.settings.scheduleBlocks || []).forEach(b => {
    if (b.type === 'meal' && b.mealId) {
      b.label = goalMealTip(goal, b.mealId);
    } else if (b.id === 'workout') {
      b.label = getWorkoutBlockLabel(goal);
    }
  });
  appData.workoutSequence = 0;
  save();
}

function insertScheduleBlock({ time, label, type } = {}) {
  const block = {
    id: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    time: time || '12:00',
    label: (label || 'New block').slice(0, 120),
    type: ['habit', 'meal', 'workout', 'water'].includes(type) ? type : 'habit',
    enabled: true,
  };
  appData.settings.scheduleBlocks.push(block);
  appData.settings.scheduleBlocks.sort((a, b) => parseTime(a.time) - parseTime(b.time));
  save();
  return block;
}

function openBlockModal() {
  let root = document.getElementById('block-modal-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'block-modal-root';
    document.body.appendChild(root);
  }
  const now = new Date();
  const defTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  root.innerHTML = `
    <div class="food-modal-overlay open" id="block-modal">
      <div class="food-modal-sheet">
        <h3>Add to your day</h3>
        <div class="food-field">
          <label for="block-label">What is it?</label>
          <input type="text" id="block-label" placeholder="e.g. 20 min walk" maxlength="120" />
        </div>
        <div class="food-field-row">
          <div class="food-field">
            <label for="block-time">Time</label>
            <input type="time" id="block-time" value="${defTime}" />
          </div>
          <div class="food-field">
            <label for="block-type">Type</label>
            <select id="block-type" class="block-type-select">
              <option value="habit">Habit / task</option>
              <option value="meal">Meal</option>
              <option value="workout">Workout</option>
              <option value="water">Water</option>
            </select>
          </div>
        </div>
        <div class="food-modal-btns">
          <button type="button" class="btn btn-primary" id="block-save-btn">Add to day</button>
          <button type="button" class="btn btn-ghost" id="block-cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  `;

  const close = () => { root.innerHTML = ''; };
  document.getElementById('block-cancel-btn')?.addEventListener('click', close);
  document.getElementById('block-modal')?.addEventListener('click', e => {
    if (e.target.id === 'block-modal') close();
  });
  document.getElementById('block-save-btn')?.addEventListener('click', () => {
    const label = document.getElementById('block-label')?.value.trim();
    const time = document.getElementById('block-time')?.value || defTime;
    const type = document.getElementById('block-type')?.value || 'habit';
    if (!label) { document.getElementById('block-label')?.focus(); return; }
    insertScheduleBlock({ time, label, type });
    close();
    if (activeTab === 'today') renderTodayTab();
    if (activeTab === 'settings') renderSettingsTab();
    showToast('Added to your day.');
  });
  setTimeout(() => document.getElementById('block-label')?.focus(), 100);
}

function deleteScheduleBlock(id) {
  appData.settings.scheduleBlocks = appData.settings.scheduleBlocks.filter(b => b.id !== id);
  save();
  if (activeTab === 'today') renderTodayTab();
  if (activeTab === 'settings') renderSettingsTab();
}

function migrateFromV1(v1) {
  const profile = { ...getDefaultProfile(), onboardingComplete: true, weightKg: 70 };
  const def = getDefaultSettings(profile);
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
    profile,
    settings: def,
    days,
    workoutSequence: v1.workoutSequence ?? 0,
    bestStreak: v1.bestStreak ?? 0,
    bests: v1.bests ?? {},
  };
}

function migrateFromV2(v2) {
  const profile = {
    ...getDefaultProfile(),
    onboardingComplete: true,
    weightKg: v2.settings?.bodyweightKg ?? 70,
  };
  return {
    profile,
    settings: {
      wakeTime:        v2.settings?.wakeTime        ?? '08:00',
      bodyweightKg:    v2.settings?.bodyweightKg    ?? 70,
      scheduleBlocks:  v2.settings?.scheduleBlocks  ?? getDefaultScheduleBlocks(profile),
      workoutSchedule: v2.settings?.workoutSchedule ?? [1, 3, 5],
    },
    days:            v2.days            ?? {},
    workoutSequence: v2.workoutSequence ?? 0,
    bestStreak:      v2.bestStreak      ?? 0,
    bests:           v2.bests           ?? {},
  };
}

function loadAppData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      const profile = { ...getDefaultProfile(), ...(p.profile || {}) };
      const def = getDefaultSettings(profile);
      const data = {
        profile,
        settings: {
          wakeTime:        p.settings?.wakeTime        ?? def.wakeTime,
          bodyweightKg:    p.settings?.bodyweightKg    ?? profile.weightKg ?? def.bodyweightKg,
          scheduleBlocks:  (p.settings?.scheduleBlocks ?? def.scheduleBlocks).filter(b => !b.id?.startsWith('water_')),
          workoutSchedule: p.settings?.workoutSchedule ?? def.workoutSchedule,
          ...getDefaultSettingsExtras(),
          ...(p.settings || {}),
        },
        days:            p.days            ?? {},
        workoutSequence: p.workoutSequence ?? 0,
        bestStreak:      p.bestStreak      ?? 0,
        bests:           p.bests           ?? {},
      };
      migrateAllDays(data.days);
      ensureWorkerSettings(data.settings);
      migrateNotificationSettings(data.settings);
      return data;
    }
    const v2raw = localStorage.getItem(STORAGE_KEY_V2);
    if (v2raw) {
      const data = migrateFromV2(JSON.parse(v2raw));
      migrateAllDays(data.days);
      ensureWorkerSettings(data.settings);
      migrateNotificationSettings(data.settings);
      return data;
    }
    const v1raw = localStorage.getItem(STORAGE_KEY_V1);
    if (v1raw) {
      const data = migrateFromV1(JSON.parse(v1raw));
      migrateAllDays(data.days);
      ensureWorkerSettings(data.settings);
      migrateNotificationSettings(data.settings);
      return data;
    }
    return freshAppData();
  } catch {
    return freshAppData();
  }
}

function freshAppData() {
  const profile = getDefaultProfile();
  const data = {
    profile,
    settings: getDefaultSettings(profile),
    days: {},
    workoutSequence: 0,
    bestStreak: 0,
    bests: {},
  };
  migrateAllDays(data.days);
  ensureWorkerSettings(data.settings);
  return data;
}

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(appData)); } catch { /* noop */ }
  if (typeof syncAllScheduleReminders === 'function') syncAllScheduleReminders();
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

function getProfile() {
  return appData?.profile || getDefaultProfile();
}

function calcBMR(profile) {
  const p = profile || getProfile();
  const w = p.weightKg || appData.settings.bodyweightKg || 70;
  const h = p.heightCm || 175;
  const a = p.age || 20;
  if (p.gender === 'female') return 10 * w + 6.25 * h - 5 * a - 161;
  if (p.gender === 'male') return 10 * w + 6.25 * h - 5 * a + 5;
  return 10 * w + 6.25 * h - 5 * a - 78;
}

function calcTDEE(profile) {
  return Math.round(calcBMR(profile) * 1.55);
}

function getNutritionTargets() {
  const profile = getProfile();
  const kg = profile.weightKg || appData.settings.bodyweightKg || 70;
  const tdee = calcTDEE(profile);
  const offsets = { lose: -300, gain: 300, recomp: 0, maintain: 0 };
  const calories = tdee + (offsets[profile.goal] ?? 0);
  const calorieLabel = {
    lose: 'Calories (small deficit)',
    gain: 'Calories (small surplus)',
    recomp: 'Calories (maintenance)',
    maintain: 'Calories (maintenance)',
  }[profile.goal] || 'Calories';
  return {
    proteinMin: Math.round(kg * 1.8),
    proteinMax: Math.round(kg * 2.2),
    calories,
    calorieLabel,
    tdee,
    bmi: profile.heightCm ? Math.round((kg / ((profile.heightCm / 100) ** 2)) * 10) / 10 : null,
  };
}

function getNutritionStrategyText() {
  const goal = getProfile().goal || 'recomp';
  const texts = {
    lose: 'Eat in a small deficit with high protein. Train hard and keep most of your muscle.',
    gain: 'Eat slightly above maintenance. Add size without going overboard on junk food.',
    recomp: 'Eat at maintenance while you train. You want muscle, not a dirty bulk.',
    maintain: 'Hold steady calories and keep showing up. Consistency beats extremes.',
  };
  return texts[goal] || texts.recomp;
}

function getGoalTips() {
  const goal = getProfile().goal || 'recomp';
  const tips = {
    lose: [
      'Train consistently. Muscle keeps your shape even when the scale drops.',
      'High protein and a modest deficit beat crash dieting when you are still building strength.',
      'Track push-ups and pull-up progress, not just weight on the scale.',
      'Sleep and your morning routine matter as much as the workout.',
    ],
    gain: [
      'Hit your calorie target most days. One missed meal slows progress.',
      'Protein still matters. Aim for the upper end of your range.',
      'Add reps before you add junk calories.',
      'Sleep is when muscle actually grows. Protect your wind-down block.',
    ],
    recomp: [
      'Train consistently. Muscle changes your shape even if the scale stays flat.',
      'High protein at maintenance beats aggressive cutting when you are under-muscled.',
      'Belly fat comes off gradually as you get stronger. Track strength, not just weight.',
      'Sleep and your morning routine matter as much as the workout.',
    ],
    maintain: [
      'You do not need a perfect week. You need a repeatable week.',
      'Keep protein high enough to hold muscle while life gets busy.',
      'Use workout logs to see progress when the scale is boring.',
      'Protect sleep and your morning routine. They anchor everything else.',
    ],
  };
  return tips[goal] || tips.recomp;
}

function getGoalSectionTitle() {
  const goal = getProfile().goal || 'recomp';
  const titles = {
    lose: 'Why this plan works for fat loss',
    gain: 'Why this plan works for gaining size',
    recomp: 'Why this works for recomposition',
    maintain: 'Why consistency beats extremes',
  };
  return titles[goal] || titles.recomp;
}

function getActiveScheduleBlocks(dateStr) {
  let blocks = getMergedScheduleBlocks().filter(b => b.enabled);
  if (!isWorkoutDay(dateStr)) blocks = blocks.filter(b => b.type !== 'workout');
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
  appData.settings.scheduleBlocks = getBaseScheduleBlocks();
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
  normalizeDay(appData.days[today]);
  return appData.days[today];
}

function buildEmptyDay() {
  return { schedule: {}, water: 0, workout: null, foodLog: [] };
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

function getActiveWorkoutStyle() {
  return GOAL_TO_STYLE[getProfile().goal] || 'strength';
}

function getActiveWorkoutCycle() {
  const style = getActiveWorkoutStyle();
  return (WORKOUT_PROGRAMS[style] || WORKOUT_PROGRAMS.strength).cycle;
}

function getNextWorkoutId() {
  const cycle = getActiveWorkoutCycle();
  return cycle[appData.workoutSequence % cycle.length];
}

function toggleScheduleBlock(blockId) {
  const today = todayStr();
  const day = ensureTodayData();
  syncDaySchedule(today);
  const wasDone = !!day.schedule[blockId];
  day.schedule[blockId] = !wasDone;
  if (!wasDone && blockId.startsWith('water_')) {
    day.water = Math.min(15, (day.water ?? 0) + 1);
  }
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
  if (h < 5)  return 'Late night';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  if (h < 21) return 'Good evening';
  return 'Almost bedtime';
}

function renderHeroGreeting() {
  const el = document.getElementById('overview-greeting');
  if (!el) return;
  const profile = getProfile();
  if (profile.onboardingComplete && profile.name) {
    el.textContent = `Hello, ${profile.name}!`;
    return;
  }
  el.textContent = `${getGreeting()}!`;
}

function renderChallengeBanner(pct, streak) {
  const meta = document.getElementById('challenge-meta');
  if (!meta) return;
  if (pct === 100) {
    meta.textContent = 'You finished today. Rest up and run it back tomorrow.';
  } else if (streak >= 3) {
    meta.textContent = `${streak}-day streak. ${100 - pct}% left today.`;
  } else {
    meta.textContent = `${100 - pct}% left. Finish one more block.`;
  }
}

function getEncouragement(pct, streak) {
  if (pct === 100) return 'You showed up completely today.';
  if (pct >= 75)   return 'Almost done for today. One or two blocks left.';
  if (pct >= 50)   return 'You are building real momentum.';
  if (pct >= 1)    return 'You started. That counts.';
  if (streak >= 7)  return `${streak} days in. The habit is forming.`;
  return 'One block at a time.';
}

// ============================================================
// EXERCISE MODAL & LIBRARY
// ============================================================

let sessionData = null;
let timerSecs = 0;
let timerInt = null;
let showExerciseLibrary = false;
let librarySearch = '';
let libraryFilters = { target: '', level: '', bodyPart: '' };

function resolveExercise(exId, opts = {}) {
  if (opts.program || isProgramExercise(exId)) return getProgramExercise(exId);
  return getExercise(exId);
}

function openExerciseModal(exId, opts = {}) {
  const ex = resolveExercise(exId, opts);
  if (!ex) return;

  let modal = document.getElementById('exercise-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'exercise-modal';
    modal.className = 'exercise-modal';
    document.body.appendChild(modal);
  }

  const isProgram = ex.isProgram !== false && isProgramExercise(exId);
  const easier = isProgram && ex.easierId ? getProgramExercise(ex.easierId) : null;
  const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(ex.youtubeQuery || ex.name)}`;
  const pillClass = isProgram ? ex.category : (ex.category || 'strength');
  const steps = (isProgram && ex.steps?.length) ? ex.steps : (ex.catalogInstructions || ex.steps || []);
  const metaLine = [
    ex.muscles,
    ex.level ? ex.level : '',
    ex.category && !isProgram ? ex.category : '',
  ].filter(Boolean).join(' · ');

  modal.innerHTML = `
    <div class="exercise-modal-backdrop" id="modal-backdrop"></div>
    <div class="exercise-modal-sheet">
      <button class="modal-close" id="modal-close" aria-label="Close">✕</button>
      ${exerciseMediaHtml(ex, 'ex-media-modal')}
      <div class="modal-body">
        <span class="pill pill-${esc(pillClass)}">${esc(isProgram ? ex.category : (ex.category || 'bodyweight'))}</span>
        <h2 class="modal-title">${esc(ex.name)}</h2>
        <p class="modal-muscles">${esc(metaLine)}</p>
        ${ex.desc ? `<p class="modal-desc">${esc(ex.desc)}</p>` : ''}
        ${isProgram && ex.cues?.length ? `
        <div class="modal-section">
          <h3>Key cues</h3>
          <ul>${ex.cues.map(c => `<li>${esc(c)}</li>`).join('')}</ul>
        </div>` : ''}
        <div class="modal-section">
          <h3>How to do it</h3>
          <ol>${steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
        </div>
        ${isProgram && ex.mistakes?.length ? `
        <div class="modal-section mistakes">
          <h3>Common mistakes</h3>
          <ul>${ex.mistakes.map(m => `<li>${esc(m)}</li>`).join('')}</ul>
        </div>` : ''}
        ${easier ? `<div class="modal-section"><h3>Easier version</h3><p>Try <button class="link-btn" data-easier="${ex.easierId}">${esc(easier.name)}</button> first.</p></div>` : ''}
        ${isProgram && ex.prog ? `<div class="modal-section"><h3>Progression</h3><p>${esc(ex.prog)}</p></div>` : ''}
        <a class="btn btn-ghost btn-sm yt-link" href="${ytUrl}" target="_blank" rel="noopener">▶ Watch video demo</a>
      </div>
    </div>
  `;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  initExerciseCarousels(modal);
  modal.querySelector('#modal-close')?.addEventListener('click', closeExerciseModal);
  modal.querySelector('#modal-backdrop')?.addEventListener('click', closeExerciseModal);
  modal.querySelector('[data-easier]')?.addEventListener('click', e => {
    openExerciseModal(e.target.dataset.easier, { program: true });
  });
}

function closeExerciseModal() {
  const modal = document.getElementById('exercise-modal');
  if (modal) { modal.classList.remove('open'); document.body.style.overflow = ''; }
}

// ============================================================
// WORKOUT SESSION (SIMPLIFIED)
// ============================================================

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
  if (name === 'today') {
    document.querySelectorAll('.quick-chip').forEach(c =>
      c.classList.toggle('active', c.dataset.quick === 'schedule')
    );
    renderTodayTab();
  }
  if (name === 'workout')  renderWorkoutTab();
  if (name === 'progress') renderProgressTab();
  if (name === 'settings') renderSettingsTab();
}

// ============================================================
// RENDER. HEADER
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
// RENDER. TODAY / SCHEDULE TAB
// ============================================================

function renderTodayTab() {
  const today = todayStr();
  const day = ensureTodayData();
  syncDaySchedule(today);
  const pct = getDayPct(today);
  const { current: streak } = calcStreaks();
  const targets = getNutritionTargets();

  updateRing(pct);
  renderHeroGreeting();
  setElText('overview-enc', getEncouragement(pct, streak));
  setElText('schedule-pct', pct + '% done');
  renderChallengeBanner(pct, streak);
  renderWaterNextHint();

  renderNutritionCard(day, targets);

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
    if (block.type === 'water') {
      extra = `<div class="meal-short">${icon('droplet', 'icon-sm')} Hydration reminder</div>`;
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
  const supps = getSupplements();
  const { bmi } = getNutritionTargets();
  const bmiNote = bmi < 18.5 ? 'Recommendations for your underweight range.'
    : bmi < 25 ? 'Recommendations for your healthy weight range.'
    : bmi < 30 ? 'Recommendations for your overweight range.'
    : 'Recommendations for your BMI range.';
  el.innerHTML = supps.map(s => `
    <div class="supp-row supp-${esc(s.verdict)}">
      <div class="supp-name">${esc(s.name)}</div>
      <div class="supp-verdict">${suppVerdictHtml(s.verdict)}</div>
      <div class="supp-dose">${esc(s.dose)}</div>
      <div class="supp-why">${esc(s.why)}</div>
    </div>
  `).join('') + `<p class="supp-disclaimer">${esc(bmiNote)} General info, not medical advice. Consult a doctor before starting any supplement if you have health concerns.</p>`;
}

function renderRecompCard() {
  const el = document.getElementById('recomp-tips');
  const summary = document.querySelector('.recomp-summary .panel-title');
  if (summary) summary.textContent = getGoalSectionTitle();
  if (!el) return;
  el.innerHTML = `<ul>${getGoalTips().map(t => `<li>${esc(t)}</li>`).join('')}</ul>`;
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
  renderWaterNextHint();
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
      <div class="day-dot lv${lv}${isToday ? ' today' : ''}">${pct > 0 ? pct + '%' : (isToday ? '' : '')}</div>
      <div class="day-dot-workout">${workoutDone ? icon('dumbbell', 'icon-sm') : ''}</div>
    `;
    container.appendChild(item);
  }
}

function setElText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

// ============================================================
// RENDER. WORKOUT TAB
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


function renderWorkoutPreview(container, wId) {
  const w = WORKOUTS[wId];
  const isStrength = (w.style || 'strength') === 'strength';
  container.innerHTML = `
    <div class="tab-hero workout-hero">
      <h2 class="tab-hero-title">${esc(w.name)}</h2>
      <p class="tab-hero-sub">${esc(w.focus)} · ~25 min</p>
    </div>
    <div class="workout-header-card">
      <div class="workout-day-badge">${esc((WORKOUT_PROGRAMS[w.style] || WORKOUT_PROGRAMS.strength).label)}</div>
      <button class="btn btn-primary mt-16" id="start-workout-btn">Start workout</button>
      <button class="btn btn-ghost mt-8" id="open-library-btn">Exercise library</button>
    </div>
    <div class="card">
      <div class="card-header"><h2>Today's exercises</h2></div>
      <div id="exercise-list-preview"></div>
    </div>
  `;
  document.getElementById('start-workout-btn')?.addEventListener('click', () => { showExerciseLibrary = false; startWorkout(); });
  document.getElementById('open-library-btn')?.addEventListener('click', () => { showExerciseLibrary = true; renderWorkoutTab(); });
  renderExerciseListSimple(document.getElementById('exercise-list-preview'), w.exercises, { program: true });
}

function renderExerciseListSimple(container, exerciseIds, opts = {}) {
  if (!container) return;
  const isProgram = opts.program !== false;
  container.innerHTML = '';
  exerciseIds.forEach(exId => {
    const ex = resolveExercise(exId, { program: isProgram });
    if (!ex) return;
    const thumb = getThumbUrl(ex);
    const fallback = ex.svgUrl || '';
    const targetLine = isProgram && ex.targetSets
      ? `${ex.targetSets} sets · ${ex.targetMin}-${ex.targetMax} ${ex.unit}`
      : [ex.level, ex.primaryMuscles?.[0]].filter(Boolean).join(' · ');

    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'exercise-library-row';
    row.innerHTML = `
      <img class="ex-thumb" src="${esc(thumb)}" alt="" onerror="this.onerror=null;this.src='${esc(fallback)}';" loading="lazy" />
      <div class="ex-lib-info">
        <div class="ex-name">${esc(ex.name)}</div>
        <div class="ex-target">${esc(targetLine)}</div>
      </div>
      <span class="ex-learn">How to →</span>
    `;
    row.addEventListener('click', () => openExerciseModal(exId, { program: isProgram }));
    container.appendChild(row);
  });
}

function renderLibraryFilters(container) {
  const opts = getFilterOptions();
  const targetOpts = ['<option value="">All targets</option>']
    .concat(opts.targets.map(m => `<option value="${esc(m)}"${libraryFilters.target === m ? ' selected' : ''}>${esc(m)}</option>`))
    .join('');
  const levelOpts = ['<option value="">All levels</option>']
    .concat(opts.levels.map(l => `<option value="${esc(l)}"${libraryFilters.level === l ? ' selected' : ''}>${esc(l)}</option>`))
    .join('');
  const bodyOpts = ['<option value="">All body parts</option>']
    .concat(opts.bodyParts.map(c => `<option value="${esc(c)}"${libraryFilters.bodyPart === c ? ' selected' : ''}>${esc(c)}</option>`))
    .join('');

  container.innerHTML = `
    <div class="library-toolbar">
      <input type="search" class="library-search" id="library-search" placeholder="Search exercises…" value="${esc(librarySearch)}" autocomplete="off" />
      <div class="library-filters">
        <select class="library-filter-select" id="library-filter-target">${targetOpts}</select>
        <select class="library-filter-select" id="library-filter-level">${levelOpts}</select>
        <select class="library-filter-select" id="library-filter-body">${bodyOpts}</select>
      </div>
      <p class="library-count text-muted" id="library-count"></p>
    </div>
  `;

  document.getElementById('library-search')?.addEventListener('input', e => {
    librarySearch = e.target.value;
    renderLibraryResults();
  });
  document.getElementById('library-filter-target')?.addEventListener('change', e => {
    libraryFilters.target = e.target.value;
    renderLibraryResults();
  });
  document.getElementById('library-filter-level')?.addEventListener('change', e => {
    libraryFilters.level = e.target.value;
    renderLibraryResults();
  });
  document.getElementById('library-filter-body')?.addEventListener('change', e => {
    libraryFilters.bodyPart = e.target.value;
    renderLibraryResults();
  });
}

function renderLibraryResults() {
  const grid = document.getElementById('library-grid');
  const countEl = document.getElementById('library-count');
  if (!grid) return;

  const results = searchExercises(librarySearch, libraryFilters);
  if (countEl) countEl.textContent = `${results.length} exercise${results.length === 1 ? '' : 's'}`;

  grid.innerHTML = '';
  if (!results.length) {
    grid.innerHTML = '<p class="library-empty text-muted">No exercises match your search.</p>';
    return;
  }

  results.forEach(entry => {
    const thumb = getThumbUrl(entry);
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'exercise-library-row';
    row.innerHTML = `
      <img class="ex-thumb" src="${esc(thumb)}" alt="" loading="lazy" />
      <div class="ex-lib-info">
        <div class="ex-name">${esc(entry.name)}</div>
        <div class="ex-target">${esc([entry.level, entry.primaryMuscles?.[0]].filter(Boolean).join(' · '))}</div>
      </div>
      <span class="ex-learn">How to →</span>
    `;
    row.addEventListener('click', () => openExerciseModal(entry.id, { program: false }));
    grid.appendChild(row);
  });
}

function renderExerciseLibrary(container) {
  container.innerHTML = `
    <div class="library-header">
      <button class="btn btn-ghost btn-sm" id="back-from-library">← Back</button>
      <h2>Exercise Library</h2>
      <p class="text-muted">Bodyweight catalog with GIF demos and step-by-step instructions.</p>
    </div>
    <div class="card">
      <div id="library-toolbar-root"></div>
      <div id="library-grid"></div>
    </div>
  `;
  document.getElementById('back-from-library')?.addEventListener('click', () => {
    showExerciseLibrary = false;
    renderWorkoutTab();
  });
  renderLibraryFilters(document.getElementById('library-toolbar-root'));
  renderLibraryResults();
}

function renderRestDay(container, nextWId) {
  const next = WORKOUTS[nextWId];
  container.innerHTML = `
    <div class="tab-hero workout-hero">
      <h2 class="tab-hero-title">Rest day</h2>
      <p class="tab-hero-sub">Recovery is when you get stronger.</p>
    </div>
    <div class="card"><div class="rest-day-card">
      <div class="rest-day-title">Take it easy today</div>
      <div class="rest-day-text">Muscles repair between sessions. Walk, stretch, sleep.<br><br>Next up: <strong>${esc(next.name)}</strong></div>
      <button class="btn btn-ghost mt-16" id="open-library-rest">Browse exercise library</button>
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
      <div class="workout-done-title">Workout complete</div>
      <div class="workout-done-sub">${esc(w.name)}</div>
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
      <span class="set-tap-status">${s.done ? icon('check', 'icon-sm') + ' Done' : 'Tap when finished'}</span>
    </button>
  `).join('');

  const navHtml = allDone
    ? (isLast
        ? `<button class="btn btn-success" id="sess-finish-btn">${icon('check', 'icon-sm')} Finish Workout</button>`
        : `<button class="btn btn-primary" id="sess-next-btn">Next Exercise →</button>`)
    : `<p class="text-dim" style="text-align:center;padding:8px 0">Complete all sets to continue</p>`;

  container.innerHTML = `
    <div class="session-header">
      <span class="session-ex-label">${curIdx + 1} / ${totalEx}</span>
      <button class="session-quit-btn" id="sess-quit-btn">Quit</button>
    </div>
    <div class="session-progress-bar"><div class="session-progress-fill" style="width:${progress}%"></div></div>
    ${exerciseMediaHtml(ex, 'ex-media-session')}
    <div class="session-ex-card">
      <div class="session-ex-header">
        <div class="session-ex-name">${esc(ex.name)}</div>
        <div class="session-ex-meta"><span class="pill pill-${ex.category}">${ex.category}</span>
          <span class="text-dim">${ex.targetSets} sets · ${ex.targetMin}-${ex.targetMax} ${ex.unit}</span></div>
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
// RENDER. PROGRESS TAB
// ============================================================

function renderProgressTab() {
  const container = document.querySelector('[data-tab="progress"]');
  if (!container) return;
  const { current, best } = calcStreaks();
  const totalWorkouts = Object.values(appData.days).filter(d => d.workout?.completed).length;
  const todayPct = getDayPct(todayStr());
  const p = getProfile();

  container.innerHTML = `
    <div class="tab-hero progress-hero">
      <h2 class="tab-hero-title">${p.name ? esc(p.name) + "'s progress" : 'Your progress'}</h2>
      <p class="tab-hero-sub">Streaks, workouts, and the last 7 days.</p>
    </div>
    <div class="stats-grid stats-grid-figma">
      <div class="stat-card"><div class="stat-value">${current}</div><div class="stat-label">Day Streak</div></div>
      <div class="stat-card"><div class="stat-value">${best}</div><div class="stat-label">Best Streak</div></div>
      <div class="stat-card"><div class="stat-value">${totalWorkouts}</div><div class="stat-label">Workouts</div></div>
      <div class="stat-card"><div class="stat-value">${todayPct}%</div><div class="stat-label">Today</div></div>
    </div>
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
        row.innerHTML = `<div class="best-ex-info"><div class="best-ex-name">${workoutIconHtml(wd.id)} ${esc(wd.name)}</div><div class="best-ex-date">${fmtDisplay(dateStr)}</div></div>`;
        recent.appendChild(row);
      });
    }
  }
}

// ============================================================
// RENDER. SETTINGS TAB
// ============================================================

function renderSettingsTab() {
  const container = document.querySelector('[data-tab="settings"]');
  if (!container) return;
  const s = appData.settings;
  const p = getProfile();
  const targets = getNutritionTargets();

  container.innerHTML = `
    <div class="tab-hero settings-hero">
      <h2 class="tab-hero-title">Settings</h2>
      <p class="tab-hero-sub">Profile, schedule, and data on this device.</p>
    </div>

    <div class="settings-group">
      <div class="settings-group-title">Profile</div>
      <div class="settings-card">
        <div class="setting-row">
          <div class="setting-row-info">
            <div class="setting-row-label">${esc(p.name || 'Your profile')}</div>
            <div class="setting-row-sub">${p.age} yrs · ${p.heightCm} cm · ${p.weightKg} kg · ${esc(p.goal)}${targets.bmi ? ` · BMI ${targets.bmi}` : ''}</div>
          </div>
        </div>
        <div class="setting-row">
          <div class="setting-row-info">
            <div class="setting-row-label">Edit profile</div>
            <div class="setting-row-sub">Re-run onboarding to change name, goal, or body stats</div>
          </div>
          <button class="btn btn-secondary btn-sm" id="btn-edit-profile">Edit</button>
        </div>
        <div class="setting-row">
          <div class="setting-row-info">
            <div class="setting-row-label">Privacy policy</div>
          </div>
          <a class="btn btn-ghost btn-sm" href="privacy.html">View</a>
        </div>
      </div>
    </div>

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
            <div class="setting-row-sub">Protein: ${targets.proteinMin}-${targets.proteinMax}g · ~${targets.calories} kcal</div>
          </div>
          <input type="number" id="bodyweight-input" value="${s.bodyweightKg}" min="40" max="150" class="num-input" />
        </div>
      </div>
    </div>

    <div class="settings-group">
      <div class="settings-group-title">Nutrition</div>
      <div class="settings-card">
        <div class="setting-row">
          <div class="setting-row-info">
            <div class="setting-row-label">Meal suggestion chips</div>
            <div class="setting-row-sub">Quick-add presets on the food log</div>
          </div>
          <label class="toggle-wrap toggle-sm">
            <input type="checkbox" id="toggle-meal-chips" ${s.showMealSuggestions !== false ? 'checked' : ''} />
            <div class="toggle-track"><div class="toggle-thumb"></div></div>
          </label>
        </div>
      </div>
    </div>

    <div class="settings-group">
      <div class="settings-group-title">Water reminders</div>
      <div class="settings-card">
        <div class="setting-row">
          <div class="setting-row-info">
            <div class="setting-row-label">Reminders on schedule</div>
            <div class="setting-row-sub">Every 90 min between wake and wind-down</div>
          </div>
          <label class="toggle-wrap toggle-sm">
            <input type="checkbox" id="toggle-water-schedule" ${s.waterRemindersOnSchedule !== false ? 'checked' : ''} />
            <div class="toggle-track"><div class="toggle-thumb"></div></div>
          </label>
        </div>
        <div class="setting-row">
          <div class="setting-row-info">
            <div class="setting-row-label">Schedule reminders</div>
            <div class="setting-row-sub">Get notified for every step in your day — wake, meals, workout, water, and wind-down.</div>
          </div>
          <button class="btn btn-secondary btn-sm" id="btn-schedule-notify">${icon('bell', 'icon-sm')} ${s.scheduleNotifications ? 'On' : 'Enable'}</button>
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
        <div class="setting-row-label">Lock In v3.1</div>
        <div class="setting-row-sub">All data stays on this device.</div>
      </div></div></div>
    </div>
  `;

  document.getElementById('btn-edit-profile')?.addEventListener('click', () => {
    appData.profile.onboardingComplete = false;
    save();
    if (typeof startOnboarding === 'function') startOnboarding();
  });

  document.getElementById('toggle-meal-chips')?.addEventListener('change', e => {
    appData.settings.showMealSuggestions = e.target.checked;
    save();
    if (activeTab === 'today') renderTodayTab();
  });

  document.getElementById('toggle-water-schedule')?.addEventListener('change', e => {
    appData.settings.waterRemindersOnSchedule = e.target.checked;
    save();
    if (activeTab === 'today') renderTodayTab();
  });

  document.getElementById('btn-schedule-notify')?.addEventListener('click', async () => {
    const ok = await requestScheduleNotifications();
    if (!ok) showToast('Notifications blocked — enable them in phone settings.');
    renderSettingsTab();
  });

  document.getElementById('wake-time-input')?.addEventListener('change', e => {
    shiftScheduleToWakeTime(e.target.value);
    save();
    renderSettingsTab();
    if (activeTab === 'today') renderTodayTab();
  });

  document.getElementById('bodyweight-input')?.addEventListener('change', e => {
    const kg = Math.max(40, Math.min(150, parseInt(e.target.value) || 70));
    appData.settings.bodyweightKg = kg;
    appData.profile.weightKg = kg;
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
    const isCustom = String(block.id).startsWith('custom_');
    const row = document.createElement('div');
    row.className = 'schedule-edit-row';
    row.innerHTML = `
      <input type="time" class="time-input-sm" value="${esc(block.time)}" data-id="${block.id}" data-field="time" />
      <input type="text" class="editable-input" value="${esc(block.label)}" data-id="${block.id}" data-field="label" />
      ${isCustom
        ? `<button type="button" class="schedule-del-btn" data-id="${block.id}" aria-label="Delete block">${icon('trash-2', 'icon-sm')}</button>`
        : `<label class="toggle-wrap toggle-sm">
        <input type="checkbox" ${block.enabled ? 'checked' : ''} data-id="${block.id}" data-field="enabled" />
        <div class="toggle-track"><div class="toggle-thumb"></div></div>
      </label>`}
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
    row.querySelector('.schedule-del-btn')?.addEventListener('click', () => deleteScheduleBlock(block.id));
    container.appendChild(row);
  });

  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.className = 'btn btn-secondary btn-sm schedule-add-row';
  addBtn.innerHTML = `${icon('plus', 'icon-sm')} Add block`;
  addBtn.addEventListener('click', openBlockModal);
  container.appendChild(addBtn);
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
  const a = Object.assign(document.createElement('a'), { href: url, download: `lock-in-${todayStr()}.json` });
  a.click();
  URL.revokeObjectURL(url);
}

function resetAllData() {
  if (!confirm('Delete ALL data? Cannot be undone.')) return;
  if (!confirm('Last chance. Start completely fresh?')) return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STORAGE_KEY_V2);
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

function completeOnboarding(draft) {
  appData.profile = {
    ...getDefaultProfile(),
    ...draft,
    onboardingComplete: true,
  };
  appData.settings.bodyweightKg = appData.profile.weightKg;
  appData.settings.scheduleBlocks = getDefaultScheduleBlocks(appData.profile);
  appData.workoutSequence = 0;
  save();
  if (typeof hideOnboarding === 'function') hideOnboarding();
  document.getElementById('app')?.classList.remove('hidden');
  injectStaticIcons();
  renderHeader();
  showTab('today');
  showToast(`Welcome, ${appData.profile.name}.`);
  requestScheduleNotifications();
}

window.completeOnboarding = completeOnboarding;

function init() {
  loadExerciseData().then(() => {
    appData = loadAppData();
    setExerciseApiBase(getExerciseApiBase());
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (!saved.settings?.aiScanEndpoint?.trim() || !saved.settings?.exerciseApiBase?.trim()) {
          ensureWorkerSettings(appData.settings);
          save();
        }
      }
    } catch { /* noop */ }
    if (!localStorage.getItem(STORAGE_KEY) &&
        (localStorage.getItem(STORAGE_KEY_V2) || localStorage.getItem(STORAGE_KEY_V1))) {
      save();
    }
    restoreSession();
    registerSW();

    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => showTab(btn.dataset.tab));
    });

    document.getElementById('ai-fab')?.addEventListener('click', () => {
      if (typeof openAssistant === 'function') openAssistant();
    });

    document.getElementById('schedule-add-btn')?.addEventListener('click', openBlockModal);

    document.querySelectorAll('.quick-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const target = chip.dataset.quick;
        document.querySelectorAll('.quick-chip').forEach(c =>
          c.classList.toggle('active', c === chip)
        );
        if (target === 'workout') showTab('workout');
        else if (target === 'progress') showTab('progress');
        else if (target === 'targets') {
          document.getElementById('targets-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (target === 'schedule') {
          document.querySelector('.schedule-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    document.getElementById('water-minus')?.addEventListener('click', () => adjustWater(-1));
    document.getElementById('water-plus')?.addEventListener('click', () => adjustWater(+1));

    if (!appData.profile?.onboardingComplete) {
      if (typeof startOnboarding === 'function') {
        startOnboarding();
        return;
      }
    }

    document.getElementById('app')?.classList.remove('hidden');
    injectStaticIcons();
    if (appData.settings.scheduleNotifications) startScheduleReminderLoop();
    renderHeader();
    showTab('today');
  });
}

document.addEventListener('DOMContentLoaded', init);
