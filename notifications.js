'use strict';
// Schedule reminders — web notifications + Android alarm sync

let scheduleReminderInterval = null;

function migrateNotificationSettings(settings) {
  if (settings.scheduleNotifications == null) {
    settings.scheduleNotifications = !!settings.waterNotifications;
  }
  return settings;
}

function showScheduleNotification(body, blockId) {
  const title = 'Lock In';
  const opts = {
    body,
    icon: './icons/icon-192.png',
    badge: './icons/icon-192.png',
    tag: blockId ? `lockin-${blockId}` : 'lockin-schedule',
    renotify: true,
  };
  if (Notification.permission !== 'granted') return;
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(reg => reg.showNotification(title, opts)).catch(() => {
      new Notification(title, opts);
    });
  } else {
    new Notification(title, opts);
  }
}

function scheduleBlocksForNotify() {
  return getMergedScheduleBlocks().filter(b => b.enabled !== false);
}

function syncScheduleToServiceWorker() {
  if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) return;
  const day = ensureTodayData();
  navigator.serviceWorker.controller.postMessage({
    type: 'SYNC_SCHEDULE',
    blocks: scheduleBlocksForNotify().map(b => ({
      id: b.id,
      time: b.time,
      label: b.label,
      type: b.type || 'task',
    })),
    completed: day.schedule || {},
    date: todayStr(),
    enabled: !!appData.settings.scheduleNotifications,
  });
}

function syncScheduleToAndroid() {
  if (!window.LockInAndroid?.syncSchedule) return;
  try {
    window.LockInAndroid.syncSchedule(JSON.stringify({
      blocks: scheduleBlocksForNotify().map(b => ({
        id: b.id,
        time: b.time,
        label: b.label,
      })),
      enabled: !!appData.settings.scheduleNotifications,
    }));
  } catch { /* WebView bridge unavailable */ }
}

function syncAllScheduleReminders() {
  syncScheduleToServiceWorker();
  syncScheduleToAndroid();
}

function checkScheduleReminderNotifications() {
  if (!appData.settings.scheduleNotifications) return;
  if (Notification.permission !== 'granted') return;
  const day = ensureTodayData();
  const nowM = new Date().getHours() * 60 + new Date().getMinutes();
  for (const b of scheduleBlocksForNotify()) {
    const t = parseTime(b.time);
    if (nowM < t || nowM >= t + 20) continue;
    if (day.schedule?.[b.id]) continue;
    const key = `sched_${b.id}_${todayStr()}`;
    if (sessionStorage.getItem(key)) continue;
    sessionStorage.setItem(key, '1');
    const action = b.type === 'water' ? 'Drink water' : b.type === 'meal' ? 'Time to eat' : b.type === 'workout' ? 'Workout time' : 'Schedule check-in';
    showScheduleNotification(`${b.time} — ${action}: ${b.label}`, b.id);
    break;
  }
  syncAllScheduleReminders();
}

function startScheduleReminderLoop() {
  if (scheduleReminderInterval) clearInterval(scheduleReminderInterval);
  syncAllScheduleReminders();
  checkScheduleReminderNotifications();
  scheduleReminderInterval = setInterval(() => {
    checkScheduleReminderNotifications();
  }, 60000);
}

function stopScheduleReminderLoop() {
  if (scheduleReminderInterval) {
    clearInterval(scheduleReminderInterval);
    scheduleReminderInterval = null;
  }
}

async function requestScheduleNotifications() {
  if (!('Notification' in window)) {
    showToast('Notifications are not supported here.');
    return false;
  }
  const perm = await Notification.requestPermission();
  appData.settings.scheduleNotifications = perm === 'granted';
  appData.settings.waterNotifications = perm === 'granted';
  save();
  if (perm === 'granted') {
    startScheduleReminderLoop();
    showToast('Schedule reminders on — you’ll get a nudge for each step.');
  }
  return perm === 'granted';
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && appData?.settings?.scheduleNotifications) {
    syncAllScheduleReminders();
    checkScheduleReminderNotifications();
  }
});
