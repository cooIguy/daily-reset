'use strict';
// Nutrition, food log, water reminders, AI scan — used by app.js

const LOCK_IN_WORKER_BASE = 'https://lock-in-meal-scan.mihkelmartin7.workers.dev';
const DEFAULT_AI_SCAN_ENDPOINT = `${LOCK_IN_WORKER_BASE}/scan-meal`;

function getDefaultSettingsExtras() {
  return {
    waterRemindersOnSchedule: true,
    waterNotifications: false,
    showMealSuggestions: true,
    aiScanEndpoint: DEFAULT_AI_SCAN_ENDPOINT,
    exerciseApiBase: LOCK_IN_WORKER_BASE,
    assistantHistory: [],
  };
}

function ensureWorkerSettings(settings) {
  const def = getDefaultSettingsExtras();
  if (!settings.aiScanEndpoint?.trim()) settings.aiScanEndpoint = def.aiScanEndpoint;
  if (!settings.exerciseApiBase?.trim()) settings.exerciseApiBase = def.exerciseApiBase;
  return settings;
}

function getExerciseApiBase() {
  const base = appData?.settings?.exerciseApiBase || LOCK_IN_WORKER_BASE;
  return base.trim().replace(/\/$/, '');
}

function normalizeDay(day) {
  if (!day) return;
  if (!Array.isArray(day.foodLog)) day.foodLog = [];
  if (day.water == null) day.water = 0;
}

function migrateAllDays(days) {
  for (const day of Object.values(days || {})) normalizeDay(day);
}

function buildEmptyDay() {
  return { schedule: {}, water: 0, workout: null, foodLog: [] };
}

function getBaseScheduleBlocks() {
  return appData.settings.scheduleBlocks.filter(b => !b.id.startsWith('water_'));
}

function generateWaterBlocks(baseBlocks) {
  if (!appData.settings.waterRemindersOnSchedule) return [];
  const wakeM = parseTime(appData.settings.wakeTime || '08:00');
  const wind = baseBlocks.find(b => b.id === 'winddown');
  const endM = wind ? parseTime(wind.time) : 21 * 60 + 30;
  const blocks = [];
  for (let t = wakeM + 90; t < endM - 30; t += 90) {
    blocks.push({
      id: `water_${t}`,
      time: fmtTime(t),
      label: 'Drink water',
      type: 'water',
      enabled: true,
    });
  }
  return blocks;
}

function getMergedScheduleBlocks() {
  const base = getBaseScheduleBlocks();
  const water = generateWaterBlocks(base);
  return [...base, ...water].sort((a, b) => parseTime(a.time) - parseTime(b.time));
}

function getFoodTotals(day) {
  const log = day?.foodLog || [];
  return log.reduce((acc, e) => ({
    calories: acc.calories + (Number(e.calories) || 0),
    protein: acc.protein + (Number(e.protein) || 0),
  }), { calories: 0, protein: 0 });
}

function progressBarClass(pct, endOfDay) {
  if (endOfDay && pct < 50) return 'low';
  if (pct < 70) return 'warn';
  return '';
}

function newFoodId() {
  return `f_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function getNextWaterReminderTime() {
  const blocks = getMergedScheduleBlocks().filter(b => b.type === 'water');
  const nowM = new Date().getHours() * 60 + new Date().getMinutes();
  const day = ensureTodayData();
  for (const b of blocks) {
    const t = parseTime(b.time);
    if (t >= nowM && !day.schedule?.[b.id]) return b.time;
  }
  return null;
}

function renderWaterNextHint() {
  const el = document.getElementById('water-next-hint');
  if (!el) return;
  const next = getNextWaterReminderTime();
  if (!next) {
    el.classList.add('hidden');
    return;
  }
  el.classList.remove('hidden');
  el.innerHTML = `${icon('droplet', 'icon-sm')} Next water reminder: ${esc(next)}`;
}

function renderNutritionCard(day, targets) {
  const nutEl = document.getElementById('nutrition-targets');
  if (!nutEl) return;
  const totals = getFoodTotals(day);
  const proteinTarget = targets.proteinMin;
  const calPct = targets.calories ? Math.min(100, Math.round((totals.calories / targets.calories) * 100)) : 0;
  const proPct = proteinTarget ? Math.min(100, Math.round((totals.protein / proteinTarget) * 100)) : 0;
  const hour = new Date().getHours();
  const endOfDay = hour >= 18;
  const calClass = progressBarClass(calPct, endOfDay);
  const proClass = progressBarClass(proPct, endOfDay);

  nutEl.innerHTML = `
    <div class="nut-progress">
      <div class="nut-progress-row">
        <div class="nut-progress-head"><span>Calories</span><span>${totals.calories} / ${targets.calories} kcal</span></div>
        <div class="nut-progress-bar"><div class="nut-progress-fill ${calClass}" style="width:${calPct}%"></div></div>
      </div>
      <div class="nut-progress-row">
        <div class="nut-progress-head"><span>Protein</span><span>${totals.protein} / ${proteinTarget}-${targets.proteinMax} g</span></div>
        <div class="nut-progress-bar"><div class="nut-progress-fill ${proClass}" style="width:${proPct}%"></div></div>
      </div>
    </div>
    <div class="nut-strategy">${esc(getNutritionStrategyText())}</div>
  `;
  renderFoodLogSection(day);
}

function renderFoodLogSection(day) {
  const root = document.getElementById('food-log-root');
  if (!root) return;
  const log = day.foodLog || [];
  const showChips = appData.settings.showMealSuggestions !== false;

  let chipsHtml = '';
  if (showChips) {
    chipsHtml = `<div class="meal-chips">${Object.entries(MEALS).map(([id, m]) =>
      `<button type="button" class="meal-chip" data-meal-preset="${id}">${esc(m.title)} ~${m.calories} kcal</button>`
    ).join('')}</div>`;
  }

  const listHtml = log.length
    ? log.slice().sort((a, b) => (a.time || '').localeCompare(b.time || '')).map(e => `
      <div class="food-log-item" data-food-id="${esc(e.id)}">
        <div class="food-log-info">
          <div class="food-log-name">${esc(e.name)}</div>
          <div class="food-log-meta">${esc(e.time || '')} · ${e.calories} kcal · ${e.protein}g protein${e.source === 'ai' ? ' · AI scan' : ''}</div>
        </div>
        <div class="food-log-btns">
          <button type="button" class="food-log-btn food-edit-btn" aria-label="Edit">${icon('pencil')}</button>
          <button type="button" class="food-log-btn food-del-btn" aria-label="Delete">${icon('trash-2')}</button>
        </div>
      </div>
    `).join('')
    : `<div class="food-log-empty">Nothing logged yet. Add what you actually ate.</div>`;

  root.innerHTML = `
    <div class="food-log-section">
      <div class="food-log-head">
        <span class="food-log-title">Food log</span>
        <div class="food-log-actions">
          <button type="button" class="btn btn-secondary btn-sm" id="btn-log-food">${icon('plus', 'icon-sm')} Log food</button>
        </div>
      </div>
      ${chipsHtml}
      <div class="food-log-list">${listHtml}</div>
    </div>
  `;

  root.querySelector('#btn-log-food')?.addEventListener('click', () => openFoodModal());
  root.querySelectorAll('.meal-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const m = MEALS[btn.dataset.mealPreset];
      if (m) openFoodModal(null, { name: m.short, calories: m.calories, protein: m.protein });
    });
  });
  root.querySelectorAll('.food-log-item').forEach(row => {
    row.querySelector('.food-edit-btn')?.addEventListener('click', () => openFoodModal(row.dataset.foodId));
    row.querySelector('.food-del-btn')?.addEventListener('click', () => deleteFoodEntry(row.dataset.foodId));
  });
}

let foodModalEditId = null;
let foodModalSource = 'manual';

function openFoodModal(editId, preset) {
  foodModalEditId = editId || null;
  foodModalSource = preset?.source || (editId ? null : 'manual');
  const day = ensureTodayData();
  const existing = editId ? day.foodLog.find(e => e.id === editId) : null;
  const now = new Date();
  const defaultTime = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  const draft = existing || preset || { name: '', calories: '', protein: '', time: defaultTime };

  let root = document.getElementById('food-modal-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'food-modal-root';
    document.body.appendChild(root);
  }

  root.innerHTML = `
    <div class="food-modal-overlay open" id="food-modal">
      <div class="food-modal-sheet">
        <h3>${editId ? 'Edit food' : 'Log food'}</h3>
        <div class="food-field">
          <label for="food-name">What did you eat?</label>
          <input type="text" id="food-name" placeholder="e.g. chicken rice bowl" value="${esc(draft.name || '')}" maxlength="120" />
          <button type="button" class="btn btn-ghost btn-sm food-estimate-btn" id="food-estimate-btn">${icon('sparkles', 'icon-sm')} Estimate calories &amp; protein with AI</button>
        </div>
        <div class="food-field-row">
          <div class="food-field">
            <label for="food-cal">Calories</label>
            <input type="number" id="food-cal" min="0" max="5000" value="${draft.calories ?? ''}" />
          </div>
          <div class="food-field">
            <label for="food-pro">Protein (g)</label>
            <input type="number" id="food-pro" min="0" max="300" value="${draft.protein ?? ''}" />
          </div>
        </div>
        <div class="food-field">
          <label for="food-time">Time</label>
          <input type="time" id="food-time" value="${esc(draft.time || defaultTime)}" />
        </div>
        <input type="file" id="food-photo-input" accept="image/*" capture="environment" class="hidden" />
        <div id="food-scan-preview-wrap"></div>
        <div class="food-scan-status hidden" id="food-scan-status"></div>
        <div class="food-modal-btns">
          <button type="button" class="btn btn-ghost" id="food-scan-btn">${icon('camera', 'icon-sm')} Scan meal photo</button>
          <button type="button" class="btn btn-primary" id="food-save-btn">Save</button>
          <button type="button" class="btn btn-ghost" id="food-cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('food-cancel-btn')?.addEventListener('click', closeFoodModal);
  document.getElementById('food-modal')?.addEventListener('click', e => {
    if (e.target.id === 'food-modal') closeFoodModal();
  });
  document.getElementById('food-save-btn')?.addEventListener('click', saveFoodModal);
  document.getElementById('food-scan-btn')?.addEventListener('click', () => {
    document.getElementById('food-photo-input')?.click();
  });
  document.getElementById('food-photo-input')?.addEventListener('change', e => {
    const file = e.target.files?.[0];
    if (file) scanMealPhoto(file);
  });
  document.getElementById('food-estimate-btn')?.addEventListener('click', estimateFoodFromText);
}

function closeFoodModal() {
  const root = document.getElementById('food-modal-root');
  if (root) root.innerHTML = '';
  foodModalEditId = null;
  foodModalSource = 'manual';
}

function saveFoodModal() {
  const name = document.getElementById('food-name')?.value.trim();
  const calories = parseInt(document.getElementById('food-cal')?.value, 10);
  const protein = parseInt(document.getElementById('food-pro')?.value, 10);
  const time = document.getElementById('food-time')?.value || '';
  if (!name) { document.getElementById('food-name')?.focus(); return; }
  if (!Number.isFinite(calories) || calories < 0) { showToast('Enter calories'); return; }
  if (!Number.isFinite(protein) || protein < 0) { showToast('Enter protein'); return; }

  const day = ensureTodayData();
  const entry = {
    id: foodModalEditId || newFoodId(),
    name,
    calories,
    protein,
    time,
    source: foodModalEditId
      ? (day.foodLog.find(e => e.id === foodModalEditId)?.source || 'manual')
      : foodModalSource,
  };

  if (foodModalEditId) {
    const idx = day.foodLog.findIndex(e => e.id === foodModalEditId);
    if (idx >= 0) day.foodLog[idx] = entry;
  } else {
    day.foodLog.push(entry);
  }
  save();
  closeFoodModal();
  if (activeTab === 'today') renderTodayTab();
  showToast('Food logged.');
}

function deleteFoodEntry(id) {
  const day = ensureTodayData();
  day.foodLog = (day.foodLog || []).filter(e => e.id !== id);
  save();
  if (activeTab === 'today') renderTodayTab();
}

function compressImageForScan(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const max = 768;
      let w = img.width, h = img.height;
      if (w > max || h > max) {
        if (w > h) { h = Math.round(h * max / w); w = max; }
        else { w = Math.round(w * max / h); h = max; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = reject;
    img.src = url;
  });
}

function getAiBase() {
  const ep = (appData?.settings?.aiScanEndpoint || DEFAULT_AI_SCAN_ENDPOINT).trim();
  return ep.replace(/\/scan-meal\/?$/i, '').replace(/\/+$/, '');
}

function showScanStatus(msg, tone) {
  const status = document.getElementById('food-scan-status');
  if (!status) return;
  status.classList.remove('hidden');
  status.textContent = msg;
  status.style.color = tone === 'error' ? 'var(--danger)' : (tone === 'ok' ? 'var(--success)' : '');
}

async function scanMealPhoto(file) {
  const base = getAiBase();
  const preview = document.getElementById('food-scan-preview-wrap');
  if (/heic|heif/i.test(file.type || '') || /\.heic$/i.test(file.name || '')) {
    showScanStatus('HEIC photos are not supported yet. Use JPG/PNG or type what you ate instead.', 'error');
    return;
  }
  showScanStatus('Analyzing photo…');
  try {
    const dataUrl = await compressImageForScan(file);
    if (preview) preview.innerHTML = `<img class="food-scan-preview" src="${dataUrl}" alt="Meal preview" />`;

    const res = await fetch(`${base}/scan-meal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: dataUrl }),
    });
    if (!res.ok) {
      let detail = '';
      try {
        const errBody = await res.json();
        detail = errBody.detail || errBody.error || '';
      } catch {
        detail = await res.text();
      }
      throw new Error(detail || `HTTP ${res.status}`);
    }
    const data = await res.json();
    if (data.error) throw new Error(data.detail || data.error);
    if (document.getElementById('food-name')) document.getElementById('food-name').value = data.name || data.food || '';
    if (document.getElementById('food-cal')) document.getElementById('food-cal').value = data.calories ?? '';
    if (document.getElementById('food-pro')) document.getElementById('food-pro').value = data.protein ?? '';
    foodModalSource = 'ai';
    showScanStatus('Review the numbers, then tap Save.', 'ok');
  } catch (err) {
    const msg = String(err?.message || err || '');
    if (/heic|heif|decode|format/i.test(msg)) {
      showScanStatus('Could not read this photo. Try a JPG/PNG or take a new picture.', 'error');
    } else {
      showScanStatus('Scan failed. Type what you ate and tap Estimate calories & protein with AI.', 'error');
      document.getElementById('food-name')?.focus();
    }
    showToast('Scan failed.');
  }
}

async function estimateFoodFromText() {
  const nameInput = document.getElementById('food-name');
  const text = (nameInput?.value || '').trim();
  if (!text) { nameInput?.focus(); return; }

  const base = getAiBase();
  const btn = document.getElementById('food-estimate-btn');
  if (btn) btn.disabled = true;
  showScanStatus('Estimating calories and protein…');
  try {
    const res = await fetch(`${base}/estimate-food`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) {
      let detail = '';
      try {
        const errBody = await res.json();
        detail = errBody.detail || errBody.error || '';
      } catch {
        detail = await res.text();
      }
      throw new Error(detail || `HTTP ${res.status}`);
    }
    const data = await res.json();
    if (data.error) throw new Error(data.detail || data.error);
    if (data.name && nameInput) nameInput.value = data.name;
    if (document.getElementById('food-cal')) document.getElementById('food-cal').value = data.calories ?? '';
    if (document.getElementById('food-pro')) document.getElementById('food-pro').value = data.protein ?? '';
    foodModalSource = 'ai';
    showScanStatus('Review the numbers, then tap Save.', 'ok');
  } catch (err) {
    showScanStatus('Estimate failed. Try again in a moment.', 'error');
    showToast('Estimate failed.');
  } finally {
    if (btn) btn.disabled = false;
  }
}

let waterReminderInterval = null;
let lastWaterNotificationAt = 0;

function showWaterNotification(body) {
  const title = 'Lock In — drink water';
  if (Notification.permission === 'granted') {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then(reg => reg.showNotification(title, { body, icon: './icons/icon-192.png' }));
    } else {
      new Notification(title, { body, icon: './icons/icon-192.png' });
    }
  }
}

function checkWaterReminderNotifications() {
  if (!appData.settings.waterNotifications) return;
  if (Notification.permission !== 'granted') return;
  const day = ensureTodayData();
  const nowM = new Date().getHours() * 60 + new Date().getMinutes();
  const blocks = getMergedScheduleBlocks().filter(b => b.type === 'water');
  for (const b of blocks) {
    const t = parseTime(b.time);
    if (nowM >= t && nowM < t + 30 && !day.schedule?.[b.id]) {
      const key = `water_${b.id}_${todayStr()}`;
      if (lastWaterNotificationAt === t) continue;
      if (sessionStorage.getItem(key)) continue;
      sessionStorage.setItem(key, '1');
      lastWaterNotificationAt = t;
      showWaterNotification(`Time for water (${b.time}). Tap + when you drink a glass.`);
      break;
    }
  }
}

function startWaterReminderLoop() {
  if (waterReminderInterval) clearInterval(waterReminderInterval);
  waterReminderInterval = setInterval(checkWaterReminderNotifications, 60000);
}

async function requestWaterNotifications() {
  if (!('Notification' in window)) {
    showToast('Notifications not supported on this browser.');
    return false;
  }
  const perm = await Notification.requestPermission();
  appData.settings.waterNotifications = perm === 'granted';
  save();
  if (perm === 'granted') startWaterReminderLoop();
  return perm === 'granted';
}

function injectStaticIcons() {
  document.getElementById('streak-icon')?.insertAdjacentHTML('afterbegin', icon('flame'));
  document.getElementById('challenge-banner-icon')?.insertAdjacentHTML('afterbegin', icon('zap'));
  document.querySelectorAll('[data-icon]').forEach(el => {
    const n = el.dataset.icon;
    if (n) el.innerHTML = icon(n);
  });
  const wMinus = document.getElementById('water-minus');
  const wPlus = document.getElementById('water-plus');
  if (wMinus && !wMinus.querySelector('.icon')) wMinus.innerHTML = icon('minus');
  if (wPlus && !wPlus.querySelector('.icon')) wPlus.innerHTML = icon('plus');
}

function workoutIconHtml(wId) {
  const icons = { A: 'dumbbell', B: 'dumbbell', C: 'zap' };
  return `<span class="workout-icon-badge">${icon(icons[wId] || 'dumbbell')}</span>`;
}

function suppVerdictHtml(verdict) {
  if (verdict === 'yes') return `${icon('circle-check', 'icon-sm')} Recommended`;
  if (verdict === 'skip') return `${icon('circle-x', 'icon-sm')} Skip for now`;
  return 'Optional';
}
