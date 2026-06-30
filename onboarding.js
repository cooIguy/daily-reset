'use strict';

const OB_STEPS = ['welcome', 'gender', 'age', 'height', 'weight', 'goal', 'summary'];
const OB_DRAFT_KEY = 'lock_in_onboarding_draft';

const obDraft = {
  name: '',
  gender: 'male',
  age: 20,
  heightCm: 175,
  weightKg: 70,
  weightUnit: 'kg',
  goal: 'recomp',
};

let obStepIdx = 0;
let pickerScrollTimer = null;
let rulerScrollTimer = null;

function obEl(id) { return document.getElementById(id); }

function loadObDraft() {
  try {
    const raw = sessionStorage.getItem(OB_DRAFT_KEY);
    if (raw) Object.assign(obDraft, JSON.parse(raw));
  } catch { /* noop */ }
}

function saveObDraft() {
  try { sessionStorage.setItem(OB_DRAFT_KEY, JSON.stringify(obDraft)); } catch { /* noop */ }
}

function renderObDots() {
  const dots = obEl('ob-dots');
  if (!dots) return;
  dots.innerHTML = OB_STEPS.map((_, i) =>
    `<span class="ob-dot${i === obStepIdx ? ' on' : ''}"></span>`
  ).join('');
}

function showObStep(idx) {
  obStepIdx = idx;
  document.querySelectorAll('.ob-screen').forEach((el, i) => {
    el.classList.toggle('active', i === idx);
  });
  const back = obEl('ob-back');
  if (back) back.classList.toggle('hidden', idx === 0);
  renderObDots();
  saveObDraft();

  const step = OB_STEPS[idx];
  if (step === 'age') initAgePicker();
  if (step === 'height') initRuler('height');
  if (step === 'weight') initRuler('weight');
  if (step === 'summary') renderSummary();
}

function buildOnboardingDOM() {
  const root = obEl('onboarding');
  if (!root || root.dataset.built) return;
  root.dataset.built = '1';

  root.innerHTML = `
    <div class="ob-top">
      <button type="button" class="ob-back hidden" id="ob-back" aria-label="Back">←</button>
      <div class="ob-dots" id="ob-dots"></div>
      <div style="width:40px"></div>
    </div>

    <div class="ob-screen active" data-step="welcome">
      <div class="ob-hero-logo" id="ob-hero-logo"></div>
      <p class="ob-welcome-greeting"><span class="hi">Hi</span> there!</p>
      <p class="ob-sub">Lock In helps you build a daily rhythm: morning habits, food, and beginner calisthenics at home. Tell us a bit about you so we can set realistic targets.</p>
      <label class="ob-title" for="ob-name">What should we call you?</label>
      <input type="text" class="ob-name-input" id="ob-name" placeholder="Your first name" maxlength="24" autocomplete="given-name" />
      <button type="button" class="ob-cta" id="ob-welcome-next">Let's go</button>
      <button type="button" class="ob-privacy-link" id="ob-privacy-open">What do we use this info for?</button>
    </div>

    <div class="ob-screen" data-step="gender">
      <h1 class="ob-title">What is your gender?</h1>
      <p class="ob-sub">This helps us estimate calories more accurately. You can change it later in Settings.</p>
      <div class="ob-choices" id="ob-gender-choices">
        <button type="button" class="ob-choice active" data-gender="male"><div class="ob-choice-ring" data-ob-icon="user"></div><span class="ob-choice-label">Male</span></button>
        <button type="button" class="ob-choice" data-gender="female"><div class="ob-choice-ring" data-ob-icon="user-round"></div><span class="ob-choice-label">Female</span></button>
      </div>
      <button type="button" class="ob-cta" id="ob-gender-next">Continue</button>
      <button type="button" class="ob-privacy-link ob-privacy-trigger">What do we use this info for?</button>
    </div>

    <div class="ob-screen" data-step="age">
      <h1 class="ob-title">What is your age?</h1>
      <div class="ob-age-display" id="ob-age-display">20</div>
      <div class="ob-picker-wrap">
        <div class="ob-picker-box"></div>
        <div class="ob-picker-track" id="ob-age-track"></div>
      </div>
      <button type="button" class="ob-cta" id="ob-age-next">Continue</button>
      <button type="button" class="ob-privacy-link ob-privacy-trigger">What do we use this info for?</button>
    </div>

    <div class="ob-screen" data-step="height">
      <h1 class="ob-title">How tall are you?</h1>
      <div class="ob-ruler-value"><span id="ob-height-val">175</span><span class="ob-ruler-unit">cm</span></div>
      <div class="ob-ruler-wrap">
        <div class="ob-ruler-indicator"></div>
        <div class="ob-ruler-track" id="ob-height-track"></div>
      </div>
      <button type="button" class="ob-cta" id="ob-height-next">Continue</button>
      <button type="button" class="ob-privacy-link ob-privacy-trigger">What do we use this info for?</button>
    </div>

    <div class="ob-screen" data-step="weight">
      <h1 class="ob-title">What is your weight?</h1>
      <div class="ob-unit-toggle" id="ob-weight-units">
        <button type="button" class="ob-unit-btn active" data-unit="kg">KG</button>
        <button type="button" class="ob-unit-btn" data-unit="lb">LB</button>
      </div>
      <div class="ob-ruler-value"><span id="ob-weight-val">70</span><span class="ob-ruler-unit" id="ob-weight-unit-label">kg</span></div>
      <div class="ob-ruler-wrap">
        <div class="ob-ruler-indicator"></div>
        <div class="ob-ruler-track" id="ob-weight-track"></div>
      </div>
      <button type="button" class="ob-cta" id="ob-weight-next">Continue</button>
      <button type="button" class="ob-privacy-link ob-privacy-trigger">What do we use this info for?</button>
    </div>

    <div class="ob-screen" data-step="goal">
      <h1 class="ob-title">What is your goal?</h1>
      <p class="ob-sub">Pick the one that fits best right now. You can switch later.</p>
      <div class="ob-goals" id="ob-goals">
        <button type="button" class="ob-goal-card" data-goal="lose"><strong>Lose weight</strong><span>Trim fat while keeping muscle with steady training</span></button>
        <button type="button" class="ob-goal-card active" data-goal="recomp"><strong>Build muscle, stay lean</strong><span>Best if you are skinny-fat or new to lifting</span></button>
        <button type="button" class="ob-goal-card" data-goal="gain"><strong>Gain weight</strong><span>Add size with a small calorie surplus</span></button>
        <button type="button" class="ob-goal-card" data-goal="maintain"><strong>Stay consistent</strong><span>Keep habits and strength without chasing the scale</span></button>
      </div>
      <button type="button" class="ob-cta" id="ob-goal-next">Continue</button>
      <button type="button" class="ob-privacy-link ob-privacy-trigger">What do we use this info for?</button>
    </div>

    <div class="ob-screen" data-step="summary">
      <div class="ob-summary">
        <div class="ob-summary-icon" id="ob-summary-icon"></div>
        <h2 id="ob-summary-title">You're set, friend.</h2>
        <p id="ob-summary-body">Your schedule, calories, and workout plan are ready.</p>
      </div>
      <button type="button" class="ob-cta" id="ob-finish">Open Lock In</button>
    </div>

    <div class="ob-modal" id="ob-privacy-modal">
      <div class="ob-modal-sheet">
        <h3>Your data stays on your phone</h3>
        <p>We use your age, height, weight, and goal to estimate calories and protein. Nothing is sent to a server. There is no account.</p>
        <p>You can export or delete everything from Settings at any time.</p>
        <a href="privacy.html" class="ob-privacy-link" style="margin-top:8px">Read the full privacy policy</a>
        <button type="button" class="ob-modal-close" id="ob-privacy-close">Got it</button>
      </div>
    </div>
  `;

  bindOnboardingEvents();
  obInjectIcons();
}

function obInjectIcons() {
  if (typeof icon !== 'function') return;
  obEl('ob-hero-logo')?.insertAdjacentHTML('afterbegin', icon('lock', 'icon-xl'));
  obEl('ob-summary-icon')?.insertAdjacentHTML('afterbegin', icon('circle-check', 'icon-xl'));
  document.querySelectorAll('[data-ob-icon]').forEach(el => {
    el.innerHTML = icon(el.dataset.obIcon, 'icon-lg');
  });
}

function bindOnboardingEvents() {
  obEl('ob-back')?.addEventListener('click', () => {
    if (obStepIdx > 0) showObStep(obStepIdx - 1);
  });

  obEl('ob-welcome-next')?.addEventListener('click', () => {
    const name = obEl('ob-name')?.value.trim();
    if (!name) { obEl('ob-name')?.focus(); return; }
    obDraft.name = name;
    showObStep(1);
  });

  document.querySelectorAll('#ob-gender-choices .ob-choice').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#ob-gender-choices .ob-choice').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      obDraft.gender = btn.dataset.gender;
    });
  });
  obEl('ob-gender-next')?.addEventListener('click', () => showObStep(2));

  obEl('ob-age-next')?.addEventListener('click', () => showObStep(3));
  obEl('ob-height-next')?.addEventListener('click', () => showObStep(4));
  obEl('ob-weight-next')?.addEventListener('click', () => showObStep(5));
  obEl('ob-goal-next')?.addEventListener('click', () => showObStep(6));

  document.querySelectorAll('#ob-goals .ob-goal-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('#ob-goals .ob-goal-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      obDraft.goal = card.dataset.goal;
    });
  });

  document.querySelectorAll('#ob-weight-units .ob-unit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#ob-weight-units .ob-unit-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      obDraft.weightUnit = btn.dataset.unit;
      initRuler('weight');
    });
  });

  const openPrivacy = () => obEl('ob-privacy-modal')?.classList.add('open');
  obEl('ob-privacy-open')?.addEventListener('click', openPrivacy);
  document.querySelectorAll('.ob-privacy-trigger').forEach(el => el.addEventListener('click', openPrivacy));
  obEl('ob-privacy-close')?.addEventListener('click', () => obEl('ob-privacy-modal')?.classList.remove('open'));
  obEl('ob-privacy-modal')?.addEventListener('click', e => {
    if (e.target === obEl('ob-privacy-modal')) obEl('ob-privacy-modal').classList.remove('open');
  });

  obEl('ob-finish')?.addEventListener('click', () => {
    if (typeof window.completeOnboarding === 'function') {
      window.completeOnboarding({ ...obDraft });
    }
    sessionStorage.removeItem(OB_DRAFT_KEY);
  });
}

function initAgePicker() {
  const track = obEl('ob-age-track');
  if (!track) return;
  track.innerHTML = '';
  for (let a = 13; a <= 80; a++) {
    const item = document.createElement('div');
    item.className = 'ob-picker-item';
    item.dataset.value = a;
    item.textContent = a;
    track.appendChild(item);
  }

  const sync = () => {
    const center = track.scrollLeft + track.clientWidth / 2;
    let closest = obDraft.age;
    let minDist = Infinity;
    track.querySelectorAll('.ob-picker-item').forEach(el => {
      const elCenter = el.offsetLeft + el.offsetWidth / 2;
      const dist = Math.abs(elCenter - center);
      el.classList.toggle('selected', dist < 30);
      if (dist < minDist) { minDist = dist; closest = parseInt(el.dataset.value, 10); }
    });
    obDraft.age = closest;
    const disp = obEl('ob-age-display');
    if (disp) disp.textContent = closest;
  };

  track.onscroll = () => {
    clearTimeout(pickerScrollTimer);
    pickerScrollTimer = setTimeout(sync, 80);
    sync();
  };

  requestAnimationFrame(() => {
    const target = track.querySelector(`[data-value="${obDraft.age}"]`);
    if (target) track.scrollLeft = target.offsetLeft - track.clientWidth / 2 + target.offsetWidth / 2;
    sync();
  });
}

function initRuler(type) {
  const isWeight = type === 'weight';
  const trackId = isWeight ? 'ob-weight-track' : 'ob-height-track';
  const track = obEl(trackId);
  if (!track) return;

  let min, max, step, value;
  if (isWeight) {
    if (obDraft.weightUnit === 'lb') {
      min = 88; max = 330; step = 1;
      value = Math.round(obDraft.weightKg * 2.20462);
    } else {
      min = 40; max = 150; step = 1;
      value = obDraft.weightKg;
    }
    obEl('ob-weight-unit-label').textContent = obDraft.weightUnit;
  } else {
    min = 140; max = 220; step = 1;
    value = obDraft.heightCm;
  }

  track.innerHTML = '';
  for (let v = min; v <= max; v += step) {
    const tick = document.createElement('div');
    const major = v % (step * 5) === 0;
    tick.className = `ob-ruler-tick ${major ? 'major' : 'minor'}`;
    tick.dataset.value = v;
    tick.innerHTML = `<div class="bar"></div>${major ? `<span class="num">${v}</span>` : ''}`;
    track.appendChild(tick);
  }

  const sync = () => {
    const center = track.scrollLeft + track.clientWidth / 2;
    let closest = value;
    let minDist = Infinity;
    track.querySelectorAll('.ob-ruler-tick').forEach(el => {
      const elCenter = el.offsetLeft + el.offsetWidth / 2;
      const dist = Math.abs(elCenter - center);
      if (dist < minDist) { minDist = dist; closest = parseInt(el.dataset.value, 10); }
    });
    if (isWeight) {
      if (obDraft.weightUnit === 'lb') {
        obDraft.weightKg = Math.round(closest / 2.20462);
        obEl('ob-weight-val').textContent = closest;
      } else {
        obDraft.weightKg = closest;
        obEl('ob-weight-val').textContent = closest;
      }
    } else {
      obDraft.heightCm = closest;
      obEl('ob-height-val').textContent = closest;
    }
  };

  track.onscroll = () => {
    clearTimeout(rulerScrollTimer);
    rulerScrollTimer = setTimeout(sync, 80);
    sync();
  };

  requestAnimationFrame(() => {
    const displayVal = isWeight
      ? (obDraft.weightUnit === 'lb' ? Math.round(obDraft.weightKg * 2.20462) : obDraft.weightKg)
      : obDraft.heightCm;
    const target = track.querySelector(`[data-value="${displayVal}"]`);
    if (target) track.scrollLeft = target.offsetLeft - track.clientWidth / 2 + target.offsetWidth / 2;
    sync();
  });
}

function renderSummary() {
  const name = obDraft.name || 'there';
  obEl('ob-summary-title').textContent = `You're set, ${name}.`;
  const goalLabels = { lose: 'lose fat', recomp: 'build muscle while staying lean', gain: 'gain size', maintain: 'stay consistent' };
  obEl('ob-summary-body').textContent =
    `Plan tuned for ${goalLabels[obDraft.goal] || 'your goal'}. ` +
    `About ${Math.round(obDraft.weightKg * 1.9)}g protein and a daily schedule that fits a ${obDraft.age}-year-old beginner.`;
}

function hideOnboarding() {
  const ob = obEl('onboarding');
  const app = obEl('app');
  ob?.classList.add('hidden');
  if (ob) ob.setAttribute('aria-hidden', 'true');
  app?.classList.remove('hidden');
  if (app) app.setAttribute('aria-hidden', 'false');
}

function startOnboarding() {
  buildOnboardingDOM();
  loadObDraft();
  if (obDraft.name) {
    const inp = obEl('ob-name');
    if (inp) inp.value = obDraft.name;
  }
  const ob = obEl('onboarding');
  const app = obEl('app');
  ob?.classList.remove('hidden');
  if (ob) ob.setAttribute('aria-hidden', 'false');
  app?.classList.add('hidden');
  if (app) app.setAttribute('aria-hidden', 'true');
  showObStep(0);
}

window.startOnboarding = startOnboarding;
window.hideOnboarding = hideOnboarding;
