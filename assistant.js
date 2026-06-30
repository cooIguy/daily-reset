'use strict';
// AI coach chat sheet — talks to the Cloudflare Worker /assistant endpoint.
// Proposes plan changes the user can Approve. Used by app.js.
//
// XSS safety: AI reply text is always set via textContent (never innerHTML).
// Suggestion chip labels use textContent. describeAction() esc()-encodes all
// user-derived values before inserting into innerHTML. No eval() is used.

let aiPending = false;

const AI_SUGGESTIONS = [
  'What should I eat today?',
  'Add a 20 min walk to my plan',
  'Make my plan easier',
  'I want to focus on losing fat',
];

function getAssistantHistory() {
  if (!Array.isArray(appData.settings.assistantHistory)) {
    appData.settings.assistantHistory = [];
  }
  return appData.settings.assistantHistory;
}

function buildAssistantContext() {
  const p = getProfile();
  const targets = getNutritionTargets();
  const today = todayStr();
  const day = (typeof ensureTodayData === 'function') ? ensureTodayData() : null;
  const blocks = getActiveScheduleBlocks(today).map(b => ({
    id: b.id, time: b.time, label: b.label, type: b.type,
  }));
  const foodLog = (day?.foodLog || []).map(e => ({
    name: e.name, calories: e.calories, protein: e.protein, time: e.time,
  }));
  const totals = (typeof getFoodTotals === 'function') ? getFoodTotals(day) : { calories: 0, protein: 0 };
  return {
    name: p.name || '',
    goal: p.goal,
    age: p.age,
    gender: p.gender,
    heightCm: p.heightCm,
    weightKg: p.weightKg,
    workoutStyle: (typeof getActiveWorkoutStyle === 'function') ? getActiveWorkoutStyle() : 'strength',
    workoutDays: appData.settings.workoutSchedule,
    nutritionTargets: {
      calories: targets.calories,
      proteinMin: targets.proteinMin,
      proteinMax: targets.proteinMax,
    },
    consumedToday: totals,
    schedule: blocks,
    foodLogToday: foodLog,
  };
}

function buildAssistantSheet() {
  let root = document.getElementById('ai-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'ai-root';
    document.body.appendChild(root);
  }
  if (root.dataset.built) return root;
  root.dataset.built = '1';

  const sparkIcon = '<svg viewBox="0 0 24 24"><path d="M12 3l1.9 4.8L18.5 9l-4.6 1.9L12 15l-1.9-4.1L5.5 9l4.6-1.2L12 3z"/></svg>';
  root.innerHTML = `
    <div class="ai-overlay" id="ai-overlay">
      <div class="ai-sheet" role="dialog" aria-label="AI coach">
        <div class="ai-head">
          <div class="ai-head-icon">${sparkIcon}</div>
          <div class="ai-head-title">AI Coach<div class="ai-head-sub">Suggestions you approve before they apply</div></div>
          <button type="button" class="ai-new-chat" id="ai-new-chat" aria-label="New conversation">New chat</button>
          <button type="button" class="ai-close" id="ai-close" aria-label="Close">&times;</button>
        </div>
        <div class="ai-messages" id="ai-messages"></div>
        <div class="ai-input-bar">
          <input type="text" class="ai-input" id="ai-input" placeholder="Ask your coach anything..." autocomplete="off" />
          <button type="button" class="ai-send" id="ai-send" aria-label="Send">
            <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('ai-close')?.addEventListener('click', closeAssistant);
  document.getElementById('ai-new-chat')?.addEventListener('click', clearAssistantHistory);
  document.getElementById('ai-overlay')?.addEventListener('click', e => {
    if (e.target.id === 'ai-overlay') closeAssistant();
  });
  document.getElementById('ai-send')?.addEventListener('click', sendAssistantMessage);
  document.getElementById('ai-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); sendAssistantMessage(); }
  });
  return root;
}

function clearAssistantHistory() {
  appData.settings.assistantHistory = [];
  save();
  const list = document.getElementById('ai-messages');
  if (list) {
    list.innerHTML = '';
    delete list.dataset.seeded;
    list.dataset.seeded = '1';
    const name = getProfile().name || 'there';
    appendAiMessage('bot', `Hey ${name}. Fresh start — ask me anything about food, workouts, or your schedule.`, false);
    appendSuggestionChips();
  }
}

function openAssistant() {
  buildAssistantSheet();
  const overlay = document.getElementById('ai-overlay');
  const list = document.getElementById('ai-messages');
  if (list && !list.dataset.seeded) {
    list.dataset.seeded = '1';
    const history = getAssistantHistory();
    if (history.length) {
      history.forEach(m => appendAiMessage(m.role === 'user' ? 'user' : 'bot', m.content, false));
    } else {
      const name = getProfile().name || 'there';
      appendAiMessage('bot', `Hey ${name}. I'm your coach. Ask me about food, workouts, or your schedule and I can update your plan when you approve.`, false);
      appendSuggestionChips();
    }
  }
  requestAnimationFrame(() => overlay?.classList.add('open'));
  setTimeout(() => document.getElementById('ai-input')?.focus(), 250);
  scrollAiToBottom();
}

function closeAssistant() {
  document.getElementById('ai-overlay')?.classList.remove('open');
}

function appendSuggestionChips() {
  const list = document.getElementById('ai-messages');
  if (!list) return;
  const wrap = document.createElement('div');
  wrap.className = 'ai-suggestions';
  wrap.id = 'ai-suggestions';
  AI_SUGGESTIONS.forEach(text => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'ai-suggestion-chip';
    chip.textContent = text;
    chip.addEventListener('click', () => {
      const input = document.getElementById('ai-input');
      if (input) input.value = text;
      sendAssistantMessage();
    });
    wrap.appendChild(chip);
  });
  list.appendChild(wrap);
}

function appendAiMessage(role, text, persist = true) {
  const list = document.getElementById('ai-messages');
  if (!list) return null;
  const div = document.createElement('div');
  div.className = `ai-msg ${role}`;
  div.textContent = text;
  list.appendChild(div);
  scrollAiToBottom();
  if (persist) {
    const history = getAssistantHistory();
    history.push({ role: role === 'user' ? 'user' : 'assistant', content: text });
    while (history.length > 20) history.shift();
    save();
  }
  return div;
}

function scrollAiToBottom() {
  const list = document.getElementById('ai-messages');
  if (list) list.scrollTop = list.scrollHeight;
}

async function sendAssistantMessage() {
  if (aiPending) return;
  const input = document.getElementById('ai-input');
  const text = (input?.value || '').trim();
  if (!text) return;

  const base = getAiBase();

  document.getElementById('ai-suggestions')?.remove();
  if (input) input.value = '';
  appendAiMessage('user', text);

  aiPending = true;
  const sendBtn = document.getElementById('ai-send');
  if (sendBtn) sendBtn.disabled = true;
  const typing = document.createElement('div');
  typing.className = 'ai-msg bot typing';
  typing.textContent = 'Coach is thinking...';
  document.getElementById('ai-messages')?.appendChild(typing);
  scrollAiToBottom();

  try {
    const history = getAssistantHistory().slice(0, -1).slice(-10);
    const res = await fetch(`${base}/assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, history, context: buildAssistantContext() }),
    });
    typing.remove();
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    const reply = data.reply || 'Done.';
    appendAiMessage('bot', reply);
    (data.actions || []).forEach(renderActionCard);
  } catch (err) {
    typing.remove();
    appendAiMessage('bot', 'Something went wrong reaching the AI coach. Try again in a moment.', false);
  } finally {
    aiPending = false;
    if (sendBtn) sendBtn.disabled = false;
    scrollAiToBottom();
  }
}

function describeAction(action) {
  switch (action.type) {
    case 'add_block':
      return `Add to your day: <strong>${esc(action.label)}</strong> at ${esc(action.time)}`;
    case 'remove_block':
      return `Remove the <strong>${esc(action.id)}</strong> block from your day`;
    case 'set_goal': {
      const labels = { lose: 'Lose weight', recomp: 'Build muscle, stay lean', gain: 'Gain weight', maintain: 'Stay consistent' };
      return `Change your goal to <strong>${esc(labels[action.goal] || action.goal)}</strong> and retune your plan`;
    }
    case 'set_workout_days': {
      const names = action.days.map(d => DAYS_SHORT[d]).join(', ');
      return `Set your workout days to <strong>${esc(names)}</strong>`;
    }
    case 'add_food':
      return `Log food: <strong>${esc(action.name)}</strong> (${action.calories} kcal, ${action.protein}g protein)`;
    default:
      return 'Update your plan';
  }
}

function renderActionCard(action) {
  const list = document.getElementById('ai-messages');
  if (!list) return;
  const card = document.createElement('div');
  card.className = 'ai-action-card';
  card.innerHTML = `
    <div class="ai-action-text">${describeAction(action)}</div>
    <div class="ai-action-btns">
      <button type="button" class="btn btn-primary btn-sm ai-approve">Approve</button>
      <button type="button" class="btn btn-ghost btn-sm ai-dismiss">Dismiss</button>
    </div>
  `;
  card.querySelector('.ai-approve')?.addEventListener('click', () => {
    const ok = applyAssistantAction(action);
    card.classList.add('done');
    card.innerHTML = `<div class="ai-action-status">${ok ? 'Applied to your plan' : 'Could not apply'}</div>`;
  });
  card.querySelector('.ai-dismiss')?.addEventListener('click', () => {
    card.classList.add('done');
    card.innerHTML = `<div class="ai-action-status" style="color:var(--text-3)">Dismissed</div>`;
  });
  list.appendChild(card);
  scrollAiToBottom();
}

function applyAssistantAction(action) {
  try {
    switch (action.type) {
      case 'add_block':
        insertScheduleBlock({ time: action.time, label: action.label, type: action.blockType || 'habit' });
        break;
      case 'remove_block': {
        const before = appData.settings.scheduleBlocks.length;
        appData.settings.scheduleBlocks = appData.settings.scheduleBlocks.filter(b => b.id !== action.id);
        if (appData.settings.scheduleBlocks.length === before) return false;
        break;
      }
      case 'set_goal':
        appData.profile.goal = action.goal;
        if (typeof applyGoalToPlan === 'function') applyGoalToPlan();
        break;
      case 'set_workout_days':
        if (!action.days.length) return false;
        appData.settings.workoutSchedule = action.days;
        break;
      case 'add_food': {
        const day = ensureTodayData();
        day.foodLog.push({
          id: newFoodId(),
          name: action.name,
          calories: action.calories,
          protein: action.protein,
          time: action.time || '',
          source: 'ai',
        });
        break;
      }
      default:
        return false;
    }
    save();
    if (activeTab === 'today') renderTodayTab();
    else if (activeTab === 'settings') renderSettingsTab();
    showToast('Plan updated.');
    return true;
  } catch {
    return false;
  }
}

window.openAssistant = openAssistant;
