const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'icons', 'exercises');
const poses = {
  pushups: { label: 'Push-up', hint: 'Straight body line' },
  pike_pushups: { label: 'Pike push-up', hint: 'Hips high — inverted V' },
  squats: { label: 'Squat', hint: 'Thighs parallel' },
  glute_bridge: { label: 'Glute bridge', hint: 'Squeeze at top' },
  plank: { label: 'Plank', hint: 'Flat back hold' },
  dead_hang: { label: 'Dead hang', hint: 'Full arm extension' },
  scapular_pulls: { label: 'Scapular pull', hint: 'Shoulders down, no elbow bend' },
  negative_pullups: { label: 'Negative pull-up', hint: 'Slow 4–5 sec lower' },
  inverted_rows: { label: 'Inverted row', hint: 'Pull chest to table' },
  hollow_hold: { label: 'Hollow hold', hint: 'Lower back pressed down' },
  mountain_climbers: { label: 'Mountain climbers', hint: 'Knees to chest' },
};

function svg(id, title, hint) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 140" role="img" aria-label="${title}">
  <rect width="200" height="140" rx="12" fill="#16213e"/>
  <text x="100" y="18" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="system-ui,sans-serif">${title}</text>
  <circle cx="100" cy="52" r="10" fill="#a78bfa"/>
  <line x1="100" y1="62" x2="100" y2="95" stroke="#a78bfa" stroke-width="4" stroke-linecap="round"/>
  <line x1="100" y1="72" x2="70" y2="88" stroke="#a78bfa" stroke-width="4" stroke-linecap="round"/>
  <line x1="100" y1="72" x2="130" y2="88" stroke="#a78bfa" stroke-width="4" stroke-linecap="round"/>
  <line x1="100" y1="95" x2="82" y2="118" stroke="#06b6d4" stroke-width="4" stroke-linecap="round"/>
  <line x1="100" y1="95" x2="118" y2="118" stroke="#06b6d4" stroke-width="4" stroke-linecap="round"/>
  <text x="100" y="134" text-anchor="middle" fill="#64748b" font-size="9" font-family="system-ui,sans-serif">${hint}</text>
</svg>`;
}

fs.mkdirSync(dir, { recursive: true });
for (const [id, p] of Object.entries(poses)) {
  fs.writeFileSync(path.join(dir, `${id}.svg`), svg(id, p.label, p.hint));
}
console.log('Generated', Object.keys(poses).length, 'exercise SVGs');
