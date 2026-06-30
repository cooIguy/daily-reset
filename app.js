'use strict';

// ============================================================
// EXERCISE & WORKOUT PROGRAM DATA
// ============================================================

const EXERCISES = {
  pushups: {
    id: 'pushups', name: 'Push-ups', category: 'push',
    trackType: 'reps', targetSets: 3, targetMin: 5, targetMax: 12, unit: 'reps',
    desc: 'Upper body push — chest, shoulders, triceps.',
    steps: [
      'Hands slightly wider than shoulder-width, fingers forward',
      'Keep body in a straight line — no sagging hips, no raised butt',
      'Lower chest until it nearly touches the floor',
      'Push back up, arms almost fully extended',
      "Can't do 5? Start with knee push-ups — same movement pattern, less load",
    ],
    prog: 'Once you hit 3 × 12 with clean form, try close-grip or diamond push-ups',
  },
  pike_pushups: {
    id: 'pike_pushups', name: 'Pike Push-ups', category: 'push',
    trackType: 'reps', targetSets: 3, targetMin: 5, targetMax: 10, unit: 'reps',
    desc: 'Hips raised high — shifts load onto shoulders.',
    steps: [
      'Start in a downward-dog position: hips high, forming an upside-down V',
      'Bend elbows and lower the top of your head toward the floor',
      'Push back up to the starting V position',
      'The higher your hips, the more shoulder activation you get',
    ],
    prog: 'Progress toward wall-supported handstand push-ups',
  },
  squats: {
    id: 'squats', name: 'Bodyweight Squats', category: 'legs',
    trackType: 'reps', targetSets: 3, targetMin: 15, targetMax: 20, unit: 'reps',
    desc: 'Foundational lower body movement.',
    steps: [
      'Feet shoulder-width apart, toes slightly turned out',
      'Keep chest up and core braced throughout',
      'Sit back and down as if lowering onto a chair',
      'Aim for thighs parallel to the floor or deeper',
      'Drive through your heels to stand back up',
    ],
    prog: 'Progress to jump squats or single-leg squat prep (pistol squats)',
  },
  glute_bridge: {
    id: 'glute_bridge', name: 'Glute Bridge', category: 'legs',
    trackType: 'reps', targetSets: 3, targetMin: 12, targetMax: 20, unit: 'reps',
    desc: 'Hip extension — glutes and hamstrings.',
    steps: [
      'Lie on your back, knees bent, feet flat on floor hip-width apart',
      'Push through your heels and lift hips until shoulder-to-knee is a straight line',
      'Squeeze glutes hard at the top, hold 1–2 seconds',
      'Lower slowly and repeat',
    ],
    prog: 'Progress to single-leg glute bridges once 20 reps feels easy',
  },
  plank: {
    id: 'plank', name: 'Plank', category: 'core',
    trackType: 'time', targetSets: 3, targetMin: 20, targetMax: 45, unit: 'sec',
    desc: 'Static core hold — the foundation of everything.',
    steps: [
      'Forearms on the floor, elbows directly under shoulders',
      'Keep your body in a perfectly straight line from head to heels',
      'Brace your core hard, as if bracing for a punch to the stomach',
      "Don't let hips sag or rise",
      'Breathe steadily — in through nose, out through mouth',
    ],
    prog: 'Build to 60-second holds, then try side planks or RKC planks',
  },
  dead_hang: {
    id: 'dead_hang', name: 'Dead Hang', category: 'pull',
    trackType: 'time', targetSets: 3, targetMin: 15, targetMax: 45, unit: 'sec',
    desc: 'Just hang from the bar. Builds grip strength and shoulder health.',
    steps: [
      'Grip the bar with hands slightly wider than shoulder-width',
      'Hang with arms fully extended',
      'Let your shoulders relax and open at the top — feel the stretch',
      "Don't actively pull — just hang and breathe steadily",
      'Work up from 15 seconds toward 45+ seconds per set',
    ],
    prog: 'Build to 60-second dead hangs before progressing further',
  },
  scapular_pulls: {
    id: 'scapular_pulls', name: 'Scapular Pull-ups', category: 'pull',
    trackType: 'reps', targetSets: 3, targetMin: 5, targetMax: 10, unit: 'reps',
    desc: 'The key move that unlocks pull-up strength — no elbow bending needed.',
    steps: [
      'Start from a full dead hang',
      'WITHOUT bending your elbows, squeeze your shoulder blades DOWN (not together)',
      'Your body will rise 1–2 inches — feel your lats engage',
      'Pause at the top for 1 second, then slowly lower back to dead hang',
      'This activates the exact same muscles you need for pull-ups',
    ],
    prog: 'Master 3 × 8 before adding negative pull-ups to your sessions',
  },
  negative_pullups: {
    id: 'negative_pullups', name: 'Negative Pull-ups', category: 'pull',
    trackType: 'reps', targetSets: 3, targetMin: 3, targetMax: 6, unit: 'reps',
    desc: 'The fastest path to your first pull-up. Jump to the top, lower slowly.',
    steps: [
      'Use a chair or jump to get your chin ABOVE the bar (starting position)',
      'Remove the support — hold yourself up with bent arms',
      'SLOWLY lower yourself over 4–5 seconds — count it out loud',
      'Once arms are fully extended, step or jump back to the top',
      "Don't drop — the controlled descent is where the strength is built",
    ],
    prog: '3 × 5 negatives with 5-second descents → attempt your first full pull-up!',
  },
  inverted_rows: {
    id: 'inverted_rows', name: 'Inverted Rows', category: 'pull',
    trackType: 'reps', targetSets: 3, targetMin: 8, targetMax: 15, unit: 'reps',
    desc: 'Horizontal row using a sturdy table or low bar. Great back builder.',
    steps: [
      'Lie under a sturdy table, grip the edge with both hands shoulder-width apart',
      'Keep your body straight like a plank, heels on the floor',
      'Pull your chest up to the table edge, squeezing shoulder blades together',
      'Lower slowly and repeat',
      'Easier: bend your knees. Harder: elevate your heels on a chair',
    ],
    prog: 'Build to 3 × 15 before adding more difficulty',
  },
  hollow_hold: {
    id: 'hollow_hold', name: 'Hollow Body Hold', category: 'core',
    trackType: 'time', targetSets: 3, targetMin: 15, targetMax: 30, unit: 'sec',
    desc: 'The foundation of core strength — used in gymnastics and calisthenics.',
    steps: [
      'Lie on your back, arms extended overhead',
      'Press your lower back HARD into the floor — this is the critical cue',
      'Lift arms, head, shoulders, and legs off the floor',
      'Your body forms a shallow hollow banana shape',
      'Too hard? Bend your knees to reduce the leverage',
    ],
    prog: 'Build to 30-second holds, then progress toward tuck-to-extended',
  },
  mountain_climbers: {
    id: 'mountain_climbers', name: 'Mountain Climbers', category: 'core',
    trackType: 'reps', targetSets: 3, targetMin: 16, targetMax: 30, unit: 'total reps',
    desc: 'Dynamic core exercise with a cardio bonus. Count each leg drive.',
    steps: [
      'Start in a high plank: hands directly under shoulders, body straight',
      'Keeping core tight, drive one knee toward your chest',
      'Quickly switch legs — alternate in a controlled running motion',
      'Count each leg drive as one rep (16 total = 8 each side)',
      "Don't let your hips rise — flat back throughout",
    ],
    prog: 'Increase speed gradually as form stabilizes over weeks',
  },
};

const WORKOUTS = {
  A: {
    id: 'A', name: 'Push Day', emoji: '💪',
    focus: 'Chest · Shoulders · Triceps · Legs',
    exercises: ['pushups', 'pike_pushups', 'squats', 'glute_bridge', 'plank'],
  },
  B: {
    id: 'B', name: 'Pull Day', emoji: '🏋️',
    focus: 'Back · Biceps · Grip · Core',
    exercises: ['dead_hang', 'scapular_pulls', 'negative_pullups', 'inverted_rows', 'hollow_hold'],
  },
  C: {
    id: 'C', name: 'Full Body', emoji: '⚡',
    focus: 'Total body · Conditioning',
    exercises: ['pushups', 'negative_pullups', 'squats', 'mountain_climbers', 'plank'],
  },
};

const WORKOUT_CYCLE = ['A', 'B', 'C'];
const DAYS_SHORT  = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_ABBREV = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ============================================================
// STORAGE
// ============================================================

const STORAGE_KEY = 'daily_reset_v1';
let appData = null;

function getDefaultSettings() {
  return {
    morningItems: [
      { id: 'phone',  label: 'Phone stayed out of bed',        enabled: true },
      { id: 'gotup',  label: 'Got up within 15 min of waking', enabled: true },
      { id: 'teeth',  label: 'Brushed teeth',                  enabled: true },
      { id: 'bed',    label: 'Made the bed',                   enabled: true },
    ],
    foodItems: [
      { id: 'breakfast', label: 'Had breakfast',       enabled: true },
      { id: 'meals',     label: 'Ate balanced meals',  enabled: true },
    ],
    eveningItems: [
      { id: 'screens', label: 'Screens off before bed', enabled: true },
    ],
    workoutSchedule: [1, 3, 5],
  };
}

function loadAppData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshAppData();
    const p = JSON.parse(raw);
    const def = getDefaultSettings();
    return {
      settings: {
        morningItems:    p.settings?.morningItems    ?? def.morningItems,
        foodItems:       p.settings?.foodItems       ?? def.foodItems,
        eveningItems:    p.settings?.eveningItems    ?? def.eveningItems,
        workoutSchedule: p.settings?.workoutSchedule ?? def.workoutSchedule,
      },
      days:            p.days            ?? {},
      workoutSequence: p.workoutSequence ?? 0,
      bestStreak:      p.bestStreak      ?? 0,
      bests:           p.bests           ?? {},
    };
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
// DATE UTILITIES
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

// ============================================================
// DAY DATA
// ============================================================

function ensureTodayData() {
  const today = todayStr();
  if (!appData.days[today]) { appData.days[today] = buildEmptyDay(); save(); }
  return appData.days[today];
}

function buildEmptyDay() {
  const s = appData.settings;
  const day = { morning: {}, food: { water: 0 }, evening: {}, workout: null };
  s.morningItems.forEach(it  => { day.morning[it.id]  = false; });
  s.foodItems.forEach(it     => { day.food[it.id]     = false; });
  s.eveningItems.forEach(it  => { day.evening[it.id]  = false; });
  return day;
}

function syncDayFields(dateStr) {
  const day = appData.days[dateStr];
  if (!day) return;
  const s = appData.settings;
  s.morningItems.forEach(it => { if (!(it.id in day.morning)) day.morning[it.id] = false; });
  s.foodItems.forEach(it    => { if (!(it.id in day.food))    day.food[it.id]    = false; });
  s.eveningItems.forEach(it => { if (!(it.id in day.evening)) day.evening[it.id] = false; });
}

function isWorkoutDay(dateStr) {
  return appData.settings.workoutSchedule.includes(dowOf(dateStr));
}

function getNextWorkoutId() {
  return WORKOUT_CYCLE[appData.workoutSequence % 3];
}

// ============================================================
// COMPLETION & STREAKS
// ============================================================

function getDayPct(dateStr) {
  const day = appData.days[dateStr];
  const s = appData.settings;
  if (!day) return 0;
  let total = 0, done = 0;

  s.morningItems.filter(i => i.enabled).forEach(i => {
    total++; if (day.morning?.[i.id]) done++;
  });
  s.foodItems.filter(i => i.enabled).forEach(i => {
    total++; if (day.food?.[i.id]) done++;
  });
  total++;
  if ((day.food?.water ?? 0) >= 6) done++;

  s.eveningItems.filter(i => i.enabled).forEach(i => {
    total++; if (day.evening?.[i.id]) done++;
  });
  if (isWorkoutDay(dateStr)) {
    total++; if (day.workout?.completed) done++;
  }
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

function calcStreaks() {
  const today = todayStr();
  let running = 0;

  for (let i = 0; i <= 365; i++) {
    const dStr = daysAgoStr(i);
    const pct = getDayPct(dStr);
    const hasData = !!appData.days[dStr];

    if (dStr === today) {
      running++; continue;
    }
    if (hasData && pct >= 50) {
      running++;
    } else {
      break;
    }
  }

  let current = Math.max(0, running - 1);
  if (getDayPct(today) >= 50) current = running;

  if (current > (appData.bestStreak || 0)) {
    appData.bestStreak = current; save();
  }
  return { current, best: appData.bestStreak || 0 };
}

// ============================================================
// ENCOURAGEMENT
// ============================================================

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5)  return 'Late night.';
  if (h < 12) return 'Good morning.';
  if (h < 17) return 'Good afternoon.';
  if (h < 21) return 'Good evening.';
  return 'Almost bedtime.';
}

function getEncouragement(pct, streak) {
  if (pct === 100) return '✓ Perfect day. You showed up completely.';
  if (pct >= 75)   return 'Nearly there — finish strong.';
  if (pct >= 50)   return "You're building real momentum.";
  if (pct >= 1)    return "You've begun — that's everything.";
  if (streak >= 14) return `${streak} days straight. This is who you're becoming.`;
  if (streak >= 7)  return 'One week in. The habit is forming.';
  if (streak >= 3)  return 'Early days, real progress.';
  return 'A fresh start. Every day is a new chance.';
}

// ============================================================
// WORKOUT SESSION STATE
// ============================================================

let sessionData  = null;
let timerSecs    = 0;
let timerRunning = false;
let timerInt     = null;

function initSession(workoutId) {
  const workout = WORKOUTS[workoutId];
  const sets = workout.exercises.map(exId =>
    Array.from({ length: EXERCISES[exId].targetSets }, () => ({ val: null, done: false }))
  );
  sessionData = { workoutId, exIdx: 0, sets, rpe: null, showRpe: false, startedAt: Date.now() };
}

function persistSession() {
  const today = todayStr();
  if (!appData.days[today]) appData.days[today] = buildEmptyDay();
  if (sessionData) {
    appData.days[today].workoutInProgress = JSON.parse(JSON.stringify(sessionData));
  } else {
    delete appData.days[today]?.workoutInProgress;
  }
  save();
}

function restoreSession() {
  const today = todayStr();
  const day = appData.days[today];
  if (day?.workoutInProgress && !day.workout?.completed) {
    sessionData = day.workoutInProgress;
    return true;
  }
  return false;
}

function stopTimer() {
  if (timerInt) { clearInterval(timerInt); timerInt = null; }
  timerRunning = false;
}

function updateBests() {
  if (!sessionData) return;
  const workout = WORKOUTS[sessionData.workoutId];
  workout.exercises.forEach((exId, i) => {
    const ex = EXERCISES[exId];
    const vals = sessionData.sets[i]
      .filter(s => s.done && s.val !== null)
      .map(s => Number(s.val))
      .filter(v => !isNaN(v) && v > 0);
    if (!vals.length) return;
    const best = Math.max(...vals);
    if (!appData.bests[exId] || best > appData.bests[exId].val) {
      appData.bests[exId] = { val: best, date: todayStr() };
    }
  });
  save();
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
  const dateEl   = document.getElementById('header-date');
  const streakEl = document.getElementById('header-streak');
  if (dateEl)   dateEl.textContent = fmtDisplay(todayStr());
  if (streakEl) streakEl.textContent = calcStreaks().current;
}

// ============================================================
// RENDER — TODAY TAB
// ============================================================

function renderTodayTab() {
  const today = todayStr();
  const day = ensureTodayData();
  syncDayFields(today);

  const pct = getDayPct(today);
  const { current: streak } = calcStreaks();

  // Progress ring
  const R = 34;
  const circumference = 2 * Math.PI * R;
  const ringFill = document.getElementById('ring-fill');
  const ringPct  = document.getElementById('ring-pct');
  if (ringFill) {
    ringFill.setAttribute('stroke-dasharray', circumference);
    ringFill.setAttribute('stroke-dashoffset', circumference * (1 - pct / 100));
  }
  if (ringPct) ringPct.textContent = pct + '%';

  document.getElementById('overview-greeting')?.setAttribute('data-text', getGreeting());
  const greetEl = document.getElementById('overview-greeting');
  const encEl   = document.getElementById('overview-enc');
  if (greetEl) greetEl.textContent = getGreeting();
  if (encEl)   encEl.textContent   = getEncouragement(pct, streak);

  // Sections
  renderCheckSection(
    document.getElementById('morning-list'),
    appData.settings.morningItems, 'morning', day.morning
  );
  renderCheckSection(
    document.getElementById('food-list'),
    appData.settings.foodItems, 'food', day.food
  );
  renderWater(day);
  renderCheckSection(
    document.getElementById('evening-list'),
    appData.settings.eveningItems, 'evening', day.evening
  );

  updateMinis(day);
  renderSevenDots('seven-day-dots');
}

function renderCheckSection(container, items, section, data) {
  if (!container) return;
  container.innerHTML = '';
  items.filter(i => i.enabled).forEach(item => {
    const checked = !!data?.[item.id];
    const el = document.createElement('div');
    el.className = `checklist-item${checked ? ' done' : ''}`;
    el.innerHTML = `
      <div class="check-box${checked ? ' checked' : ''}">
        <svg class="check-icon" viewBox="0 0 12 10" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="1.5,5.5 4.5,9 10.5,1"/>
        </svg>
      </div>
      <span class="item-label">${esc(item.label)}</span>
    `;
    el.addEventListener('click', () => toggleCheck(section, item.id));
    container.appendChild(el);
  });
}

function renderWater(day) {
  const w = day?.food?.water ?? 0;
  const countEl = document.getElementById('water-count');
  const dotsEl  = document.getElementById('water-dots');
  if (countEl) countEl.textContent = w;
  if (dotsEl) {
    dotsEl.innerHTML = Array.from({ length: 8 }, (_, i) =>
      `<div class="w-dot${i < w ? ' filled' : ''}"></div>`
    ).join('');
  }
}

function updateMinis(day) {
  const s = appData.settings;

  const mItems = s.morningItems.filter(i => i.enabled);
  const mDone  = mItems.filter(i => day.morning?.[i.id]).length;
  setElText('morning-mini', `${mDone}/${mItems.length}`);

  const fItems = s.foodItems.filter(i => i.enabled);
  const fDone  = fItems.filter(i => day.food?.[i.id]).length;
  const wDone  = (day.food?.water ?? 0) >= 6 ? 1 : 0;
  setElText('food-mini', `${fDone + wDone}/${fItems.length + 1}`);

  const eItems = s.eveningItems.filter(i => i.enabled);
  const eDone  = eItems.filter(i => day.evening?.[i.id]).length;
  setElText('evening-mini', `${eDone}/${eItems.length}`);
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
      else if (pct >= 1)  lv = 1;
    }

    const d = new Date(dStr + 'T12:00:00');
    const item = document.createElement('div');
    item.className = 'day-dot-item';
    const label = pct > 0 ? pct + '%' : (isToday ? '—' : '');
    item.innerHTML = `
      <div class="day-dot-name">${DAYS_ABBREV[d.getDay()]}</div>
      <div class="day-dot lv${lv}${isToday ? ' today' : ''}">${label}</div>
      <div style="font-size:9px;text-align:center;min-height:14px;${workoutDone ? 'color:var(--cyan)' : ''}">
        ${workoutDone ? '🏋' : ''}
      </div>
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
  const sessionActive = !!sessionData;
  const todayIsWD = isWorkoutDay(today);

  if (sessionActive && !completed) {
    preview.style.display = 'none';
    sessionEl.classList.add('active');
    renderSession();
  } else {
    preview.style.display = '';
    sessionEl.classList.remove('active');
    if (completed) {
      renderWorkoutComplete(preview, day.workout);
    } else if (todayIsWD) {
      renderWorkoutPreview(preview, getNextWorkoutId());
    } else {
      renderRestDay(preview, getNextWorkoutId());
    }
  }
}

function renderWorkoutPreview(container, wId) {
  const w = WORKOUTS[wId];
  container.innerHTML = `
    <div class="workout-header-card">
      <div class="workout-type-row">
        <div class="workout-day-badge">${w.emoji} Workout ${wId}</div>
      </div>
      <div class="workout-name">${w.name}</div>
      <div class="workout-focus">${w.focus}</div>
      <div class="workout-status-row mt-16">
        <button class="btn btn-primary" id="start-workout-btn">▶ Start Workout</button>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><h2><span class="section-icon">📋</span> Exercises — tap any to expand</h2></div>
      <div id="exercise-list-preview"></div>
    </div>
    <div class="card" style="padding:16px">
      <p style="font-size:13px;color:var(--text-2);line-height:1.7;">
        <strong style="color:var(--text)">Rest 60–90 seconds between sets.</strong><br>
        Focus on form over speed. If something hurts sharply (not just the burn), stop and rest.
        Soreness after is normal and expected.
      </p>
    </div>
  `;
  document.getElementById('start-workout-btn')?.addEventListener('click', startWorkout);
  renderExerciseList(document.getElementById('exercise-list-preview'), w.exercises);
}

function renderExerciseList(container, exerciseIds) {
  if (!container) return;
  container.innerHTML = '';
  const catIcons = { push: '🔴', pull: '🔵', legs: '🟡', core: '🟢' };
  exerciseIds.forEach(exId => {
    const ex = EXERCISES[exId];
    const item = document.createElement('div');
    item.className = 'exercise-item';
    item.innerHTML = `
      <div class="exercise-row">
        <div class="ex-cat-icon ${ex.category}">${catIcons[ex.category]}</div>
        <div class="ex-info">
          <div class="ex-name">${ex.name}</div>
          <div class="ex-target">${ex.targetSets} sets · ${ex.targetMin}–${ex.targetMax} ${ex.unit}</div>
        </div>
        <span class="ex-chevron">▼</span>
      </div>
      <div class="exercise-detail">
        <div class="exercise-detail-inner">
          <p style="font-size:13px;color:var(--text-2);margin-bottom:10px;line-height:1.5;">${ex.desc}</p>
          <ol>${ex.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
          <div class="progression-note"><strong>Progress: </strong>${esc(ex.prog)}</div>
        </div>
      </div>
    `;
    item.querySelector('.exercise-row').addEventListener('click', () =>
      item.classList.toggle('expanded')
    );
    container.appendChild(item);
  });
}

function renderRestDay(container, nextWId) {
  const next = WORKOUTS[nextWId];
  const schedule = [...appData.settings.workoutSchedule].sort((a,b)=>a-b);
  const todayDow = dowOf(todayStr());
  const diffs = schedule.map(d => { const diff = (d - todayDow + 7) % 7; return diff === 0 ? 7 : diff; });
  const daysUntil = diffs.length ? Math.min(...diffs) : 1;

  container.innerHTML = `
    <div class="card">
      <div class="rest-day-card">
        <div class="rest-day-emoji">🌿</div>
        <div class="rest-day-title">Rest Day</div>
        <div class="rest-day-text">
          Recovery is when the actual gains happen — your muscles repair and grow stronger during rest, not during the workout.<br><br>
          Coming up: <strong style="color:var(--primary-light)">${next.emoji} ${next.name}</strong>
          in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}.
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><h2><span class="section-icon">👀</span> Next Workout Preview</h2></div>
      <div id="exercise-list-rest"></div>
    </div>
  `;
  renderExerciseList(document.getElementById('exercise-list-rest'), next.exercises);
}

function renderWorkoutComplete(container, wData) {
  const w = WORKOUTS[wData.workoutId];
  const setsCount = (wData.exercises || []).reduce(
    (sum, ex) => sum + (ex.sets?.filter(v => v !== null).length ?? 0), 0
  );

  container.innerHTML = `
    <div class="workout-done-card">
      <div class="workout-done-emoji">🎉</div>
      <div class="workout-done-title">Workout complete!</div>
      <div class="workout-done-sub">
        ${w.emoji} ${w.name} · ${setsCount} sets logged${wData.rpe ? ` · RPE ${wData.rpe}/10` : ''}
      </div>
    </div>
    <div class="card">
      <div class="card-header"><h2><span class="section-icon">📊</span> Today's Log</h2></div>
      <div id="workout-detail-list"></div>
    </div>
  `;

  const logContainer = document.getElementById('workout-detail-list');
  if (logContainer && wData.exercises) {
    wData.exercises.forEach(exLog => {
      const ex = EXERCISES[exLog.id];
      if (!ex) return;
      const vals = (exLog.sets || []).filter(v => v !== null)
        .map(v => `${v}${ex.unit === 'sec' ? 's' : ''}`).join('  ·  ');
      const row = document.createElement('div');
      row.className = 'best-item';
      row.innerHTML = `
        <div class="best-ex-info">
          <div class="best-ex-name">${ex.name}</div>
          <div class="best-ex-date" style="margin-top:3px;">${vals || 'No sets logged'}</div>
        </div>
        ${exLog.best ? `<div class="best-val">Best: ${exLog.best}${ex.unit === 'sec' ? 's' : ''}</div>` : ''}
      `;
      logContainer.appendChild(row);
    });
  }
}

// ============================================================
// RENDER — WORKOUT SESSION
// ============================================================

function renderSession() {
  const container = document.getElementById('workout-session');
  if (!container || !sessionData) return;

  if (sessionData.showRpe) { renderRpeScreen(container); return; }

  const workout  = WORKOUTS[sessionData.workoutId];
  const totalEx  = workout.exercises.length;
  const curIdx   = sessionData.exIdx;
  const ex       = EXERCISES[workout.exercises[curIdx]];
  const allDone  = sessionData.sets[curIdx].every(s => s.done);
  const isLast   = curIdx === totalEx - 1;
  const progress = ((curIdx + 1) / totalEx) * 100;

  const timerHtml = ex.trackType === 'time' ? `
    <div class="timer-section">
      <div class="timer-display" id="timer-display">0:00</div>
      <div class="timer-hint">Tap Start, hold your set, tap Stop to log it</div>
      <div class="timer-btns">
        <button class="btn btn-secondary btn-sm" id="timer-start-btn">▶ Start</button>
        <button class="btn btn-ghost btn-sm" id="timer-stop-btn" disabled>⏹ Stop &amp; Log</button>
      </div>
    </div>
  ` : '';

  const setsHtml = sessionData.sets[curIdx].map((s, i) => {
    const val = s.val !== null ? s.val : '';
    return `
      <div class="set-row${s.done ? ' set-complete' : ''}">
        <div class="set-num">Set ${i + 1}</div>
        <div class="set-input-area">
          <input class="set-input" id="set-inp-${i}" type="number" inputmode="numeric"
            min="0" max="9999" value="${esc(String(val))}"
            placeholder="0" ${s.done ? 'readonly' : ''} />
          <span class="set-unit-label">${ex.unit}</span>
        </div>
        <button class="set-check-btn${s.done ? ' done' : ''}" data-sidx="${i}">
          <svg viewBox="0 0 14 11" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="1.5,5.5 5,9.5 12.5,1.5"/>
          </svg>
        </button>
      </div>
    `;
  }).join('');

  const nextBtnHtml = allDone
    ? (isLast
        ? `<button class="btn btn-success" id="sess-finish-btn">✓ All done — Finish Workout</button>`
        : `<button class="btn btn-primary" id="sess-next-btn">Next Exercise →</button>`)
    : `<button class="btn btn-secondary" disabled>Complete sets above to continue</button>`;

  const prevBtnHtml = curIdx > 0
    ? `<div style="text-align:center;margin-top:6px;">
         <button class="btn btn-ghost btn-sm" id="sess-prev-btn">← Previous Exercise</button>
       </div>` : '';

  container.innerHTML = `
    <div class="session-header">
      <div class="session-ex-label">Exercise ${curIdx + 1} of ${totalEx}</div>
      <button class="session-quit-btn" id="sess-quit-btn">✕ Quit</button>
    </div>
    <div class="session-progress-bar">
      <div class="session-progress-fill" style="width:${progress}%"></div>
    </div>
    <div class="session-ex-card">
      <div class="session-ex-header">
        <div class="session-ex-name">${ex.name}</div>
        <div class="session-ex-meta">
          <span class="pill pill-${ex.category}">${ex.category}</span>
          <span class="text-dim">${ex.targetSets} sets · ${ex.targetMin}–${ex.targetMax} ${ex.unit}</span>
        </div>
        <div class="session-ex-desc mt-8">${ex.desc}</div>
      </div>
      ${timerHtml}
      <div class="session-sets">
        <div class="session-sets-title">Log Your Sets</div>
        ${setsHtml}
      </div>
    </div>
    <div class="session-nav single">${nextBtnHtml}</div>
    ${prevBtnHtml}
  `;

  // Events
  document.getElementById('sess-quit-btn')?.addEventListener('click', quitWorkout);
  document.getElementById('sess-next-btn')?.addEventListener('click', () => {
    sessionData.exIdx++; persistSession(); renderSession();
  });
  document.getElementById('sess-prev-btn')?.addEventListener('click', () => {
    if (sessionData.exIdx > 0) { sessionData.exIdx--; persistSession(); renderSession(); }
  });
  document.getElementById('sess-finish-btn')?.addEventListener('click', () => {
    sessionData.showRpe = true; renderSession();
  });

  container.querySelectorAll('.set-check-btn').forEach(btn => {
    btn.addEventListener('click', () => markSetDone(parseInt(btn.dataset.sidx)));
  });

  if (ex.trackType === 'time') setupTimer();

  // Auto-focus first empty input
  const firstEmpty = container.querySelector('.set-input:not([readonly])');
  if (firstEmpty) setTimeout(() => firstEmpty.focus(), 50);
}

function setupTimer() {
  const display  = document.getElementById('timer-display');
  const startBtn = document.getElementById('timer-start-btn');
  const stopBtn  = document.getElementById('timer-stop-btn');
  if (!display || !startBtn || !stopBtn) return;

  stopTimer(); timerSecs = 0; display.textContent = '0:00';

  startBtn.addEventListener('click', () => {
    if (timerRunning) return;
    timerRunning = true;
    startBtn.disabled = true;
    stopBtn.disabled = false;
    timerInt = setInterval(() => {
      timerSecs++;
      const m = Math.floor(timerSecs / 60);
      const s = timerSecs % 60;
      display.textContent = `${m}:${String(s).padStart(2, '0')}`;
    }, 1000);
  });

  stopBtn.addEventListener('click', () => {
    if (!timerRunning) return;
    stopTimer();
    startBtn.disabled = false;
    stopBtn.disabled = true;
    // Fill first empty set
    const emptyIdx = sessionData.sets[sessionData.exIdx].findIndex(s => !s.done);
    if (emptyIdx !== -1) {
      const inp = document.getElementById(`set-inp-${emptyIdx}`);
      if (inp) inp.value = timerSecs;
    }
    display.textContent = '0:00';
    timerSecs = 0;
  });
}

function markSetDone(setIdx) {
  if (!sessionData) return;
  const exIdx = sessionData.exIdx;
  const inp = document.getElementById(`set-inp-${setIdx}`);
  const raw = inp ? parseFloat(inp.value) : null;
  sessionData.sets[exIdx][setIdx] = { val: (!isNaN(raw) && raw >= 0) ? raw : 0, done: true };
  persistSession();
  renderSession();
}

function startWorkout() {
  const wId = getNextWorkoutId();
  initSession(wId);
  persistSession();
  renderWorkoutTab();
}

function quitWorkout() {
  if (!confirm('Quit the workout? Progress will be lost.')) return;
  stopTimer();
  sessionData = null;
  const today = todayStr();
  if (appData.days[today]) delete appData.days[today].workoutInProgress;
  save();
  renderWorkoutTab();
}

function renderRpeScreen(container) {
  container.innerHTML = `
    <div class="session-header">
      <div class="session-ex-label">Nice work — one last step</div>
      <button class="session-quit-btn" id="sess-quit-btn-rpe">✕ Quit</button>
    </div>
    <div class="rpe-section">
      <div class="rpe-title">How hard was that overall? (1–10)</div>
      <div class="rpe-subtitle">Rate of Perceived Exertion. 1 = trivially easy · 6–7 = the sweet spot · 10 = max effort. Tracking this helps you calibrate progression.</div>
      <div class="rpe-grid" id="rpe-grid">
        ${[1,2,3,4,5,6,7,8,9,10].map(n =>
          `<button class="rpe-btn${sessionData.rpe === n ? ' sel' : ''}" data-rpe="${n}">${n}</button>`
        ).join('')}
      </div>
    </div>
    <div style="margin-top:12px;">
      <button class="btn btn-success" id="save-workout-btn" ${sessionData.rpe == null ? 'disabled' : ''}>
        ✓ Save Workout
      </button>
    </div>
    <div style="text-align:center;margin-top:8px;">
      <button class="btn btn-ghost btn-sm" id="skip-rpe-btn">Skip rating</button>
    </div>
  `;

  document.querySelectorAll('.rpe-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sessionData.rpe = parseInt(btn.dataset.rpe);
      document.querySelectorAll('.rpe-btn').forEach(b => b.classList.remove('sel'));
      btn.classList.add('sel');
      document.getElementById('save-workout-btn')?.removeAttribute('disabled');
    });
  });

  document.getElementById('save-workout-btn')?.addEventListener('click', completeWorkout);
  document.getElementById('skip-rpe-btn')?.addEventListener('click', () => {
    sessionData.rpe = null; completeWorkout();
  });
  document.getElementById('sess-quit-btn-rpe')?.addEventListener('click', quitWorkout);
}

function completeWorkout() {
  if (!sessionData) return;
  stopTimer();

  const today = todayStr();
  const workout = WORKOUTS[sessionData.workoutId];
  const exercises = workout.exercises.map((exId, i) => {
    const ex = EXERCISES[exId];
    const sets = sessionData.sets[i].map(s => s.done ? s.val : null);
    const completed = sets.filter(v => v !== null).map(Number).filter(v => v > 0);
    const best = completed.length ? Math.max(...completed) : null;
    return { id: exId, sets, best };
  });

  if (!appData.days[today]) appData.days[today] = buildEmptyDay();
  appData.days[today].workout = {
    workoutId: sessionData.workoutId,
    completed: true,
    completedAt: new Date().toISOString(),
    rpe: sessionData.rpe,
    exercises,
  };
  delete appData.days[today].workoutInProgress;

  appData.workoutSequence++;
  updateBests();
  save();

  sessionData = null;
  showToast('Workout saved! 💪');
  renderHeader();
  renderWorkoutTab();
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
      <div class="stat-card">
        <div class="stat-value">${current}</div>
        <div class="stat-label">Day Streak 🔥</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${best}</div>
        <div class="stat-label">Best Streak</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${totalWorkouts}</div>
        <div class="stat-label">Workouts Done</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${todayPct}%</div>
        <div class="stat-label">Today's Score</div>
      </div>
    </div>

    <div class="section-title">Last 7 Days</div>
    <div class="card">
      <div class="seven-day-section">
        <div class="seven-day-dots" id="progress-7day-dots"></div>
      </div>
    </div>

    <div class="section-title">Personal Bests</div>
    <div class="card" id="bests-card">
      <div id="bests-list"></div>
    </div>

    <div class="section-title">Recent Workouts</div>
    <div class="card">
      <div id="recent-workouts"></div>
    </div>
  `;

  renderSevenDots('progress-7day-dots');

  // Personal bests
  const bestsContainer = document.getElementById('bests-list');
  if (bestsContainer) {
    const keyEx = ['pushups', 'negative_pullups', 'dead_hang', 'plank', 'inverted_rows', 'scapular_pulls'];
    const hasBests = keyEx.some(id => appData.bests[id]);
    if (!hasBests) {
      bestsContainer.innerHTML = `<div class="empty-note">Complete your first workout to start tracking personal bests. 🏆</div>`;
    } else {
      keyEx.forEach(exId => {
        const ex = EXERCISES[exId];
        const b = appData.bests[exId];
        if (!b) return;
        const row = document.createElement('div');
        row.className = 'best-item';
        row.innerHTML = `
          <div class="best-ex-info">
            <div class="best-ex-name">${ex.name}</div>
            <div class="best-ex-date">${fmtCompact(b.date)}</div>
          </div>
          <div class="best-val">${b.val}${ex.unit === 'sec' ? 's' : ''}</div>
        `;
        bestsContainer.appendChild(row);
      });
    }
  }

  // Recent workouts
  const recentContainer = document.getElementById('recent-workouts');
  if (recentContainer) {
    const wDays = Object.entries(appData.days)
      .filter(([, d]) => d.workout?.completed)
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, 7);

    if (!wDays.length) {
      recentContainer.innerHTML = `<div class="empty-note">No workouts logged yet.<br>Start your first one today!</div>`;
    } else {
      wDays.forEach(([dateStr, day]) => {
        const w  = day.workout;
        const wd = WORKOUTS[w.workoutId];
        const row = document.createElement('div');
        row.className = 'best-item';
        row.innerHTML = `
          <div class="best-ex-info">
            <div class="best-ex-name">${wd.emoji} ${wd.name}</div>
            <div class="best-ex-date">${fmtDisplay(dateStr)}</div>
          </div>
          <div class="best-val" style="font-size:13px;color:var(--text-2);">
            ${w.rpe != null ? `RPE ${w.rpe}/10` : ''}
          </div>
        `;
        recentContainer.appendChild(row);
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

  container.innerHTML = `
    <div class="settings-group">
      <div class="settings-group-title">Workout Schedule</div>
      <div class="settings-card">
        <div style="padding:12px 16px 4px;">
          <p class="text-dim" style="margin-bottom:10px;">Tap days to toggle. Workouts rotate A → B → C.</p>
        </div>
        <div class="day-picker" id="day-picker">
          ${DAYS_SHORT.map((name, i) =>
            `<button class="day-picker-btn${s.workoutSchedule.includes(i) ? ' on' : ''}" data-dow="${i}">${name}</button>`
          ).join('')}
        </div>
        <div style="padding:4px 16px 14px;">
          <p class="text-dim">${s.workoutSchedule.length} day${s.workoutSchedule.length !== 1 ? 's' : ''}/week selected · Next: ${WORKOUTS[getNextWorkoutId()].emoji} ${WORKOUTS[getNextWorkoutId()].name}</p>
        </div>
      </div>
    </div>

    <div class="settings-group">
      <div class="settings-group-title">Morning Checklist <span class="text-dim">(tap label to edit)</span></div>
      <div class="settings-card" id="set-morning"></div>
    </div>

    <div class="settings-group">
      <div class="settings-group-title">Food &amp; Water</div>
      <div class="settings-card" id="set-food"></div>
    </div>

    <div class="settings-group">
      <div class="settings-group-title">Evening</div>
      <div class="settings-card" id="set-evening"></div>
    </div>

    <div class="settings-group">
      <div class="settings-group-title">Data &amp; Privacy</div>
      <div class="settings-card">
        <div class="setting-row">
          <div class="setting-row-info">
            <div class="setting-row-label">Export Data</div>
            <div class="setting-row-sub">Download your full history as JSON</div>
          </div>
          <button class="btn btn-secondary btn-sm" id="btn-export">Export</button>
        </div>
        <div class="setting-row">
          <div class="setting-row-info">
            <div class="setting-row-label" style="color:var(--red)">Reset Everything</div>
            <div class="setting-row-sub">Delete all data — cannot be undone</div>
          </div>
          <button class="btn btn-danger btn-sm" id="btn-reset">Reset</button>
        </div>
      </div>
    </div>

    <div class="settings-group">
      <div class="settings-group-title">About</div>
      <div class="settings-card">
        <div class="setting-row">
          <div class="setting-row-info">
            <div class="setting-row-label">Daily Reset v1.0</div>
            <div class="setting-row-sub">All data stays on this device only. No accounts, no servers.</div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.querySelectorAll('.day-picker-btn').forEach(btn => {
    btn.addEventListener('click', () => toggleScheduleDay(parseInt(btn.dataset.dow)));
  });

  buildChecklistSettings(document.getElementById('set-morning'), 'morningItems');
  buildChecklistSettings(document.getElementById('set-food'),    'foodItems');
  buildChecklistSettings(document.getElementById('set-evening'), 'eveningItems');

  document.getElementById('btn-export')?.addEventListener('click', exportData);
  document.getElementById('btn-reset')?.addEventListener('click', resetAllData);
}

function buildChecklistSettings(container, key) {
  if (!container) return;
  container.innerHTML = '';
  appData.settings[key].forEach(item => {
    const row = document.createElement('div');
    row.className = 'editable-field';
    row.innerHTML = `
      <input class="editable-input" type="text" value="${esc(item.label)}" />
      <label class="toggle-wrap">
        <input type="checkbox" ${item.enabled ? 'checked' : ''}>
        <div class="toggle-track"><div class="toggle-thumb"></div></div>
      </label>
    `;
    const labelInp = row.querySelector('.editable-input');
    labelInp.addEventListener('blur', () => {
      const v = labelInp.value.trim();
      if (v) { item.label = v; save(); if (activeTab === 'today') renderTodayTab(); }
      else labelInp.value = item.label;
    });
    row.querySelector('input[type="checkbox"]').addEventListener('change', e => {
      item.enabled = e.target.checked; save();
      if (activeTab === 'today') renderTodayTab();
    });
    container.appendChild(row);
  });
}

// ============================================================
// EVENT HANDLERS
// ============================================================

function toggleCheck(section, itemId) {
  const today = todayStr();
  const day = ensureTodayData();
  syncDayFields(today);
  day[section][itemId] = !day[section][itemId];
  save();
  renderTodayTab();
  renderHeader();
}

function adjustWater(delta) {
  const day = ensureTodayData();
  day.food.water = Math.max(0, Math.min(15, (day.food.water ?? 0) + delta));
  save();
  renderWater(day);
  updateMinis(day);
  // Update ring
  const pct = getDayPct(todayStr());
  const R = 34, circ = 2 * Math.PI * R;
  const rf = document.getElementById('ring-fill');
  const rp = document.getElementById('ring-pct');
  if (rf) rf.setAttribute('stroke-dashoffset', circ * (1 - pct / 100));
  if (rp) rp.textContent = pct + '%';
  renderHeader();
}

function toggleScheduleDay(dow) {
  const sched = appData.settings.workoutSchedule;
  const idx = sched.indexOf(dow);
  if (idx !== -1) {
    if (sched.length <= 1) { showToast('Keep at least 1 workout day'); return; }
    sched.splice(idx, 1);
  } else {
    sched.push(dow); sched.sort((a,b) => a-b);
  }
  save();
  renderSettingsTab();
}

// ============================================================
// DATA MANAGEMENT
// ============================================================

function exportData() {
  const json = JSON.stringify(appData, null, 2);
  const url  = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
  const a    = Object.assign(document.createElement('a'), { href: url, download: `daily-reset-${todayStr()}.json` });
  a.click();
  URL.revokeObjectURL(url);
}

function resetAllData() {
  if (!confirm('Delete ALL data? This cannot be undone.')) return;
  if (!confirm('Last chance — are you sure you want to start completely fresh?')) return;
  localStorage.removeItem(STORAGE_KEY);
  appData = freshAppData();
  save();
  sessionData = null;
  showToast('Fresh start. 🌱');
  showTab('today');
  renderHeader();
}

// ============================================================
// TOAST
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

// ============================================================
// UTILITIES
// ============================================================

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ============================================================
// SERVICE WORKER
// ============================================================

function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

// ============================================================
// INIT
// ============================================================

function init() {
  appData = loadAppData();
  restoreSession();
  registerSW();

  // Nav
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => showTab(btn.dataset.tab));
  });

  // Water
  document.getElementById('water-minus')?.addEventListener('click', () => adjustWater(-1));
  document.getElementById('water-plus')?.addEventListener('click',  () => adjustWater(+1));

  renderHeader();
  showTab('today');
}

document.addEventListener('DOMContentLoaded', init);
