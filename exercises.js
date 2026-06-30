'use strict';

// ============================================================
// Exercise catalog + program merge
// ============================================================

let exerciseApiBase = '';
const PROGRAM_EXERCISES = {
  pushups: {
    id: 'pushups', name: 'Push-ups', category: 'push', muscles: 'Chest, shoulders, triceps',
    trackType: 'reps', targetSets: 3, targetMin: 5, targetMax: 12, unit: 'reps',
    svgUrl: 'icons/exercises/pushups.svg',
    youtubeQuery: 'push up proper form beginner',
    desc: 'The foundation upper-body push. Keep a straight line from head to heels.',
    cues: ['Hands slightly wider than shoulders', 'Body straight. No sagging hips', 'Chest nearly touches floor'],
    steps: [
      'Start in a high plank. Hands slightly wider than shoulder-width, fingers forward',
      'Brace your core and keep your body in one straight line from head to heels',
      'Lower your chest until it nearly touches the floor. Elbows at about 45°',
      'Push back up until arms are almost fully straight',
      'Too hard? Drop to your knees. Same movement, less load',
    ],
    mistakes: ['Hips sagging or piking up', 'Elbows flaring straight out to the sides', 'Half reps. Not going low enough'],
    easierId: null,
    prog: 'Hit 3 × 12 clean reps → try diamond or close-grip push-ups',
  },
  pike_pushups: {
    id: 'pike_pushups', name: 'Pike Push-ups', category: 'push', muscles: 'Shoulders, upper chest, triceps',
    trackType: 'reps', targetSets: 3, targetMin: 5, targetMax: 10, unit: 'reps',
    svgUrl: 'icons/exercises/pike_pushups.svg',
    youtubeQuery: 'pike push up tutorial calisthenics',
    desc: 'A shoulder press using your bodyweight. Hips stay high in an inverted V. This is NOT a regular push-up.',
    cues: ['Hips high. Inverted V shape', 'Head lowers between your hands', 'Elbows at ~45°, not flared wide'],
    steps: [
      'Start in downward-dog: hands and feet on floor, hips pushed HIGH toward the ceiling',
      'Your body forms an upside-down V. The higher your hips, the more shoulder work you get',
      'Bend your elbows and lower the TOP of your head toward the floor between your hands',
      'Keep your neck neutral. Look at your feet, not ahead of you',
      'Push through your hands back to the starting V position',
      'Too hard? Put hands on a chair or low table to reduce the angle',
    ],
    mistakes: ['Hips too low. Turns into a regular push-up', 'Head going forward of hands instead of between them', 'Elbows flaring wide. Hurts shoulders'],
    easierId: 'pushups',
    prog: 'Build to 3 × 10 → try feet-elevated pike push-ups',
  },
  squats: {
    id: 'squats', name: 'Bodyweight Squats', category: 'legs', muscles: 'Quads, glutes, hamstrings',
    trackType: 'reps', targetSets: 3, targetMin: 15, targetMax: 20, unit: 'reps',
    svgUrl: 'icons/exercises/squats.svg',
    youtubeQuery: 'bodyweight squat form beginner',
    desc: 'Foundational lower-body movement for leg strength and muscle.',
    cues: ['Chest up, core braced', 'Sit back like lowering onto a chair', 'Knees track over toes'],
    steps: [
      'Feet shoulder-width apart, toes slightly turned out',
      'Keep chest up and core braced throughout',
      'Sit back and down. Hips go back first, then down',
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
    svgUrl: 'icons/exercises/glute_bridge.svg',
    youtubeQuery: 'glute bridge exercise form',
    desc: 'Hip extension that builds glutes. Important for posture and lower-body strength.',
    cues: ['Heels close to hips', 'Squeeze glutes hard at the top', '1-2 second pause at top'],
    steps: [
      'Lie on your back, knees bent, feet flat hip-width apart',
      'Push through heels and lift hips until shoulder-to-knee is a straight line',
      'Squeeze glutes hard at the top. Hold 1-2 seconds',
      'Lower slowly and repeat',
    ],
    mistakes: ['Over-arching the lower back instead of using glutes', 'Pushing through toes instead of heels', 'Rushing. No squeeze at top'],
    easierId: null,
    prog: '20 easy reps → single-leg glute bridges',
  },
  plank: {
    id: 'plank', name: 'Plank', category: 'core', muscles: 'Core, shoulders',
    trackType: 'time', targetSets: 3, targetMin: 20, targetMax: 45, unit: 'sec',
    svgUrl: 'icons/exercises/plank.svg',
    youtubeQuery: 'plank exercise proper form',
    desc: 'Static core hold. Foundation for all calisthenics skills.',
    cues: ['Elbows under shoulders', 'Straight line head to heels', 'Brace core. Don\'t hold breath'],
    steps: [
      'Forearms on floor, elbows directly under shoulders',
      'Body in a perfectly straight line from head to heels',
      'Brace core as if bracing for a punch to the stomach',
      'Don\'t let hips sag or rise',
      'Breathe steadily throughout the hold',
    ],
    mistakes: ['Hips sagging. Lower back strain', 'Hips too high. Easy but useless', 'Holding breath the entire time'],
    easierId: null,
    prog: '45-second holds → side planks or RKC planks',
  },
  dead_hang: {
    id: 'dead_hang', name: 'Dead Hang', category: 'pull', muscles: 'Grip, lats, shoulders',
    trackType: 'time', targetSets: 3, targetMin: 15, targetMax: 45, unit: 'sec',
    svgUrl: 'icons/exercises/dead_hang.svg',
    youtubeQuery: 'dead hang pull up bar beginner',
    desc: 'Just hang from the bar. Builds grip and shoulder health. Step 1 toward pull-ups.',
    cues: ['Full arm extension', 'Relax shoulders at the top', 'Breathe steadily'],
    steps: [
      'Grip the bar hands slightly wider than shoulder-width',
      'Hang with arms fully extended',
      'Let shoulders relax and open. Feel the stretch',
      'Don\'t actively pull. Just hang and breathe',
      'Work from 15 seconds toward 45+ per set',
    ],
    mistakes: ['Shrugging shoulders up to ears', 'Bending arms. Not a full hang', 'Dropping off when grip burns. That\'s the training'],
    easierId: null,
    prog: '60-second hangs → add scapular pulls',
  },
  scapular_pulls: {
    id: 'scapular_pulls', name: 'Scapular Pull-ups', category: 'pull', muscles: 'Lats, lower traps',
    trackType: 'reps', targetSets: 3, targetMin: 5, targetMax: 10, unit: 'reps',
    svgUrl: 'icons/exercises/scapular_pulls.svg',
    youtubeQuery: 'scapular pull up tutorial',
    desc: 'The unlock for pull-ups. Shoulder blades move. Elbows stay straight.',
    cues: ['No elbow bending', 'Pull shoulder blades DOWN', 'Pause 1 sec at top'],
    steps: [
      'Start in a full dead hang',
      'WITHOUT bending elbows, pull shoulder blades DOWN (depress, not squeeze together)',
      'Your body rises 1-2 inches. Feel lats engage',
      'Pause 1 second at top, slowly lower to dead hang',
      'This is the exact muscle pattern for pull-ups',
    ],
    mistakes: ['Bending elbows. That\'s a mini pull-up, not scapular', 'Shrugging up instead of depressing down', 'Using momentum. Move slow and controlled'],
    easierId: 'dead_hang',
    prog: '3 × 8 clean reps → add negative pull-ups',
  },
  negative_pullups: {
    id: 'negative_pullups', name: 'Negative Pull-ups', category: 'pull', muscles: 'Lats, biceps, grip',
    trackType: 'reps', targetSets: 3, targetMin: 3, targetMax: 6, unit: 'reps',
    svgUrl: 'icons/exercises/negative_pullups.svg',
    youtubeQuery: 'negative pull up progression beginner',
    desc: 'Fastest path to your first pull-up. Jump up, lower slowly.',
    cues: ['Chin starts above bar', '4-5 second lowering. Count out loud', 'Full dead hang at bottom'],
    steps: [
      'Use a chair or jump to get chin ABOVE the bar',
      'Remove support. Hold with bent arms at the top',
      'SLOWLY lower over 4-5 seconds. Count: one-one-thousand, two-one-thousand…',
      'Full dead hang at bottom, then reset to top',
      'Don\'t drop. The slow descent builds the strength',
    ],
    mistakes: ['Dropping fast. Skips all the benefit', 'Not starting with chin above bar', 'Kipping or swinging'],
    easierId: 'scapular_pulls',
    prog: '3 × 5 with 5-sec lowers → attempt your first full pull-up',
  },
  inverted_rows: {
    id: 'inverted_rows', name: 'Inverted Rows', category: 'pull', muscles: 'Back, biceps, rear delts',
    trackType: 'reps', targetSets: 3, targetMin: 8, targetMax: 15, unit: 'reps',
    svgUrl: 'icons/exercises/inverted_rows.svg',
    youtubeQuery: 'inverted row table bodyweight',
    desc: 'Horizontal row using a sturdy table. Builds back thickness.',
    cues: ['Body straight like a plank', 'Pull chest to edge', 'Squeeze shoulder blades'],
    steps: [
      'Lie under a sturdy table, grip the edge hands shoulder-width apart',
      'Body straight like a plank, heels on floor',
      'Pull chest up to table edge. Squeeze shoulder blades together',
      'Lower slowly and repeat',
      'Easier: bend knees. Harder: elevate heels on a chair',
    ],
    mistakes: ['Hips sagging. Not a straight line', 'Using only arms. Lead with shoulder blades', 'Unstable table. Safety first'],
    easierId: null,
    prog: '3 × 15 → lower bar height or add pause at top',
  },
  hollow_hold: {
    id: 'hollow_hold', name: 'Hollow Body Hold', category: 'core', muscles: 'Abs, hip flexors',
    trackType: 'time', targetSets: 3, targetMin: 15, targetMax: 30, unit: 'sec',
    svgUrl: 'icons/exercises/hollow_hold.svg',
    youtubeQuery: 'hollow body hold gymnastics',
    desc: 'Gymnastics core foundation. Used in every calisthenics skill.',
    cues: ['Lower back pressed into floor', 'Banana shape. Arms and legs off ground', 'Breathe while bracing'],
    steps: [
      'Lie on back, arms extended overhead',
      'Press lower back HARD into the floor. Critical cue',
      'Lift arms, head, shoulders, and legs off the floor',
      'Body forms a shallow hollow banana shape',
      'Too hard? Bend knees to reduce leverage',
    ],
    mistakes: ['Lower back arching off the floor', 'Holding breath', 'Legs too high. Reduces ab tension'],
    easierId: null,
    prog: '30-second holds → tuck hollow → extended hollow',
  },
  mountain_climbers: {
    id: 'mountain_climbers', name: 'Mountain Climbers', category: 'core', muscles: 'Core, hip flexors, cardio',
    trackType: 'reps', targetSets: 3, targetMin: 16, targetMax: 30, unit: 'total reps',
    svgUrl: 'icons/exercises/mountain_climbers.svg',
    youtubeQuery: 'mountain climbers exercise form',
    desc: 'Dynamic core + cardio. Count each leg drive as one rep.',
    cues: ['High plank start', 'Drive knee to chest', 'Hips stay low. Don\'t pike up'],
    steps: [
      'High plank. Hands under shoulders, body straight',
      'Drive one knee toward chest, core tight',
      'Quickly switch legs in a controlled running motion',
      'Count each leg drive as one rep (16 = 8 each side)',
      'Don\'t let hips rise. Flat back throughout',
    ],
    mistakes: ['Hips bouncing up and down', 'Going too fast with sloppy form', 'Hands creeping forward'],
    easierId: 'plank',
    prog: 'Increase speed only when form stays solid',
  },
  jumping_jacks: {
    id: 'jumping_jacks', name: 'Jumping Jacks', category: 'cardio', muscles: 'Full body, cardio',
    trackType: 'time', targetSets: 3, targetMin: 30, targetMax: 60, unit: 'sec',
    svgUrl: 'icons/exercises/mountain_climbers.svg',
    youtubeQuery: 'jumping jacks proper form',
    desc: 'Simple full-body cardio to raise your heart rate and warm up.',
    cues: ['Land softly on the balls of your feet', 'Arms fully overhead', 'Keep a steady rhythm'],
    steps: [
      'Stand tall, feet together, arms at your sides',
      'Jump your feet out wide while raising your arms overhead',
      'Jump back to the start, bringing arms down',
      'Keep a steady, breathable pace for the full set',
    ],
    mistakes: ['Stiff, heavy landings', 'Half-raising the arms', 'Holding your breath'],
    easierId: null,
    prog: 'Build to 60-second rounds, then shorten rest between sets',
  },
  high_knees: {
    id: 'high_knees', name: 'High Knees', category: 'cardio', muscles: 'Legs, core, cardio',
    trackType: 'time', targetSets: 3, targetMin: 20, targetMax: 45, unit: 'sec',
    svgUrl: 'icons/exercises/mountain_climbers.svg',
    youtubeQuery: 'high knees exercise form',
    desc: 'Run in place driving the knees high. Strong cardio and core driver.',
    cues: ['Knees to hip height', 'Stay on the balls of your feet', 'Pump your arms'],
    steps: [
      'Stand tall with feet hip-width apart',
      'Drive one knee up toward hip height, then quickly switch',
      'Stay light on the balls of your feet',
      'Pump your arms to keep the pace and balance',
    ],
    mistakes: ['Knees staying low', 'Leaning too far back', 'Flat-footed stomping'],
    easierId: null,
    prog: 'Increase pace and round length as conditioning improves',
  },
  burpees: {
    id: 'burpees', name: 'Burpees', category: 'cardio', muscles: 'Full body, cardio',
    trackType: 'reps', targetSets: 3, targetMin: 6, targetMax: 12, unit: 'reps',
    svgUrl: 'icons/exercises/pushups.svg',
    youtubeQuery: 'burpee proper form beginner',
    desc: 'Full-body conditioning move: squat, plank, hop. Big calorie burner.',
    cues: ['Chest to floor on the bottom (or scale it)', 'Jump feet in under hips', 'Stand tall and reach up'],
    steps: [
      'From standing, squat and place both hands on the floor',
      'Hop or step your feet back into a plank',
      'Lower your chest (full or knees-down), then push back up',
      'Hop your feet back toward your hands',
      'Stand and jump with arms overhead. Scale by removing the jump',
    ],
    mistakes: ['Sagging hips in the plank', 'Skipping the chest lower', 'Rushing into sloppy reps'],
    easierId: 'squats',
    prog: 'Add the push-up and jump as you build, then increase reps',
  },
};

let catalogById = new Map();
let catalogList = [];
let programMap = {};
let catalogReady = false;
let catalogLoadPromise = null;

function normalizeExerciseId(id) {
  if (id == null || id === '') return null;
  const s = String(id);
  return /^\d+$/.test(s) ? s.padStart(4, '0') : s;
}

function findCatalogBySearchName(searchName) {
  if (!searchName) return null;
  const q = searchName.toLowerCase();
  const matches = catalogList.filter(e => e.name.toLowerCase().includes(q));
  if (!matches.length) return null;
  const exact = matches.find(e => e.name.toLowerCase() === q);
  if (exact) return exact;
  return matches.sort((a, b) => a.name.length - b.name.length)[0];
}

function setExerciseApiBase(url) {
  exerciseApiBase = (url || '').trim().replace(/\/$/, '');
}

function gifMediaUrl(catalogId) {
  const raw = String(catalogId || '');
  if (!/^\d+$/.test(raw)) return '';
  const id = normalizeExerciseId(raw);
  if (exerciseApiBase && id) {
    return `${exerciseApiBase}/exercise-gif/${id}`;
  }
  return '';
}

function formatMuscles(entry) {
  if (!entry) return '';
  const primary = entry.target
    ? [entry.target]
    : (entry.primaryMuscles || []);
  const secondary = entry.secondaryMuscles || [];
  const main = primary.join(', ');
  if (!secondary.length) return main;
  return main + (main ? '; ' : '') + secondary.join(', ');
}

function lookupCatalog(id) {
  if (id == null || id === '') return null;
  const s = String(id);
  return catalogById.get(s) || catalogById.get(normalizeExerciseId(s) || s);
}

function mergeProgramWithCatalog(programId) {
  const program = PROGRAM_EXERCISES[programId];
  if (!program) return null;

  const map = programMap[programId] || {};

  // Same catalog entries as the exercise library
  let catalog = map.searchName ? findCatalogBySearchName(map.searchName) : null;
  if (!catalog && map.catalogId) {
    catalog = lookupCatalog(map.catalogId);
  }

  const merged = {
    ...program,
    isProgram: true,
    catalogId: catalog?.id || map.catalogId || null,
    catalogInstructions: catalog?.catalogInstructions || catalog?.instructions || [],
  };

  if (map.mediaOverride) {
    merged.mediaUrls = [map.mediaOverride];
    merged.thumbUrl = map.mediaOverride;
  } else if (catalog) {
    merged.mediaUrls = getMediaUrls(catalog);
    merged.thumbUrl = getThumbUrl(catalog);
  } else {
    merged.mediaUrls = program.svgUrl ? [program.svgUrl] : [];
    merged.thumbUrl = program.svgUrl || '';
  }
  return merged;
}

function normalizeCatalogEntry(entry) {
  const id = String(entry.id);
  const gifUrl = entry.gifUrl || null;
  const legacyImages = entry.images || [];

  return {
    id,
    name: entry.name,
    category: (entry.bodyPart || entry.category || 'strength').toLowerCase(),
    bodyPart: entry.bodyPart || null,
    muscles: formatMuscles(entry),
    level: entry.difficulty || entry.level || null,
    difficulty: entry.difficulty || entry.level || null,
    force: entry.force || null,
    mechanic: entry.mechanic || null,
    equipment: entry.equipment || 'body weight',
    primaryMuscles: entry.target ? [entry.target] : (entry.primaryMuscles || []),
    secondaryMuscles: entry.secondaryMuscles || [],
    desc: (entry.instructions && entry.instructions[0]) || entry.description || '',
    steps: entry.instructions || [],
    cues: [],
    mistakes: [],
    gifUrl,
    mediaUrls: legacyImages,
    thumbUrl: legacyImages[0] || null,
    catalogInstructions: entry.instructions || [],
    isProgram: false,
    youtubeQuery: entry.name,
  };
}

function loadExerciseData() {
  if (catalogLoadPromise) return catalogLoadPromise;

  catalogLoadPromise = Promise.all([
    fetch('./data/exercise-catalog.json').then(r => {
      if (!r.ok) throw new Error('Failed to load exercise catalog');
      return r.json();
    }),
    fetch('./data/program-map.json').then(r => {
      if (!r.ok) throw new Error('Failed to load program map');
      return r.json();
    }),
  ]).then(([catalogPayload, mapPayload]) => {
    programMap = mapPayload;
    catalogList = (catalogPayload.exercises || []).map(normalizeCatalogEntry);
    catalogById = new Map();
    catalogList.forEach(e => {
      catalogById.set(String(e.id), e);
      const norm = normalizeExerciseId(e.id);
      if (norm) catalogById.set(norm, e);
    });
    catalogReady = true;
    return { catalogList, programMap };
  }).catch(err => {
    console.error('Exercise catalog load failed:', err);
    programMap = {};
    catalogList = [];
    catalogById = new Map();
    catalogReady = true;
    return { catalogList, programMap };
  });

  return catalogLoadPromise;
}

function isCatalogReady() {
  return catalogReady;
}

function isProgramExercise(id) {
  return id in PROGRAM_EXERCISES;
}

function getProgramIds() {
  return Object.keys(PROGRAM_EXERCISES);
}

/** Resolved exercise for program id or catalog id */
function getExercise(id) {
  if (isProgramExercise(id)) return mergeProgramWithCatalog(id);
  const entry = catalogById.get(id);
  return entry ? { ...entry } : null;
}

function getProgramExercise(id) {
  return mergeProgramWithCatalog(id);
}

function getCatalog() {
  return catalogList;
}

function getCatalogEntry(catalogId) {
  const entry = catalogById.get(catalogId);
  return entry ? { ...entry } : null;
}

function getMediaUrls(ex) {
  if (!ex) return [];
  const proxied = gifMediaUrl(ex.catalogId || ex.id);
  if (proxied) return [proxied];
  if (ex.mediaUrls?.length) return ex.mediaUrls;
  if (ex.thumbUrl) return [ex.thumbUrl];
  if (ex.svgUrl) return [ex.svgUrl];
  return [];
}

function getThumbUrl(ex) {
  if (!ex) return '';
  const urls = getMediaUrls(ex);
  return urls[0] || ex.svgUrl || '';
}

function searchExercises(query, filters = {}) {
  const q = (query || '').trim().toLowerCase();
  const target = (filters.target || filters.muscle || '').trim().toLowerCase();
  const level = (filters.level || filters.difficulty || '').trim().toLowerCase();
  const bodyPart = (filters.bodyPart || filters.category || '').trim().toLowerCase();

  return catalogList.filter(entry => {
    if (level && (entry.level || '').toLowerCase() !== level) return false;
    if (bodyPart && (entry.bodyPart || entry.category || '').toLowerCase() !== bodyPart) return false;
    if (target && !(entry.primaryMuscles || []).some(m => m.toLowerCase() === target)) return false;
    if (!q) return true;
    const hay = [
      entry.name,
      entry.muscles,
      entry.bodyPart,
      entry.category,
      entry.level,
      ...(entry.primaryMuscles || []),
    ].join(' ').toLowerCase();
    return hay.includes(q);
  });
}

function getFilterOptions() {
  const targets = new Set();
  const levels = new Set();
  const bodyParts = new Set();

  catalogList.forEach(e => {
    (e.primaryMuscles || []).forEach(m => targets.add(m));
    if (e.level) levels.add(e.level);
    if (e.bodyPart) bodyParts.add(e.bodyPart);
    else if (e.category) bodyParts.add(e.category);
  });

  return {
    targets: [...targets].sort(),
    levels: [...levels].sort(),
    bodyParts: [...bodyParts].sort(),
    // legacy aliases for app.js
    muscles: [...targets].sort(),
    categories: [...bodyParts].sort(),
  };
}

function isSvgUrl(url) {
  return typeof url === 'string' && url.trim().toLowerCase().endsWith('.svg');
}

function exercisePlaceholderHtml(name, cls) {
  const dumbbellSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z"/><path d="m2.5 21.5 1.4-1.4"/><path d="m20.1 3.9 1.4-1.4"/><path d="M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z"/><path d="m9.6 14.4 4.8-4.8"/></svg>`;
  return `<div class="${cls || 'ex-media'} ex-media-placeholder">
    <div class="ex-placeholder-icon">${dumbbellSvg}</div>
    <div class="ex-placeholder-label">${escAttr(name || 'Exercise')}</div>
  </div>`;
}

function exerciseMediaHtml(ex, cls) {
  if (!ex) return '';
  const urls = getMediaUrls(ex).filter(u => !isSvgUrl(u));
  const name = ex.name || 'Exercise';

  if (!urls.length) return exercisePlaceholderHtml(name, cls);

  if (urls.length > 1) {
    const dots = urls.map((_, i) =>
      `<button type="button" class="ex-carousel-dot${i === 0 ? ' active' : ''}" data-idx="${i}" aria-label="Demo ${i + 1}"></button>`
    ).join('');
    const imgs = urls.map((url, i) =>
      `<img class="ex-photo${i === 0 ? ' active' : ''}" src="${escAttr(url)}" alt="${escAttr(name)} demo ${i + 1}"
        data-idx="${i}" onerror="this.style.display='none';" loading="lazy" />`
    ).join('');
    return `<div class="${cls || 'ex-media'} ex-carousel" data-carousel>
      <div class="ex-carousel-track">${imgs}</div>
      <div class="ex-carousel-dots">${dots}</div>
    </div>`;
  }

  return `<div class="${cls || 'ex-media'}">
    <img class="ex-photo" src="${escAttr(urls[0])}" alt="${escAttr(name)} demo"
      onerror="this.onerror=null;this.style.display='none';this.insertAdjacentHTML('afterend','<div class=\\'ex-placeholder-icon-inline\\'></div>');" loading="lazy" />
  </div>`;
}

function escAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;');
}

function initExerciseCarousels(root) {
  if (!root) return;
  root.querySelectorAll('[data-carousel]').forEach(carousel => {
    const imgs = carousel.querySelectorAll('.ex-photo');
    const dots = carousel.querySelectorAll('.ex-carousel-dot');
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = Number(dot.dataset.idx);
        imgs.forEach((img, i) => img.classList.toggle('active', i === idx));
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      });
    });
  });
}

// Back-compat alias used by app.js workout session
const EXERCISES = new Proxy({}, {
  get(_, prop) {
    if (prop === 'then') return undefined;
    if (typeof prop !== 'string') return undefined;
    return getProgramExercise(prop);
  },
  has(_, prop) {
    return prop in PROGRAM_EXERCISES;
  },
  ownKeys() {
    return Object.keys(PROGRAM_EXERCISES);
  },
  getOwnPropertyDescriptor(_, prop) {
    if (!(prop in PROGRAM_EXERCISES)) return undefined;
    return { configurable: true, enumerable: true, value: getProgramExercise(prop) };
  },
});
