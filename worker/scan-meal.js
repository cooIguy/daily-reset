/**
 * Lock In — Cloudflare Worker (meal scan + WorkoutX exercise GIF proxy)
 * Deploy:
 *   npx wrangler secret put OPENAI_API_KEY
 *   npx wrangler secret put WORKOUTX_API_KEY
 *
 * Security notes:
 * - CORS is intentionally open (*) because this is a personal PWA with no
 *   secret credentials on the client side. The Worker secrets (OPENAI_API_KEY,
 *   WORKOUTX_API_KEY) are only accessible server-side and are never returned to
 *   the client.
 * - Rate limiting: configure Cloudflare's built-in rate limiting rule in the
 *   dashboard to ~30 requests/min per IP to prevent abuse of the OpenAI quota.
 *   Go to Security → WAF → Rate limiting rules and target this Worker's route.
 * - Input size is capped to 10 MB server-side (see MAX_BODY_BYTES below).
 */

const MAX_BODY_BYTES = 10 * 1024 * 1024; // 10 MB

export default {
  async fetch(request, env) {
    const cors = {
      // Open CORS: this Worker has no client-visible secrets; API keys live only
      // in env bindings. Change to your domain if you want extra defence-in-depth.
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: cors });
    }

    // Reject oversized request bodies before parsing JSON / base64 image data.
    const contentLength = parseInt(request.headers.get('content-length') || '0', 10);
    if (request.method === 'POST' && contentLength > MAX_BODY_BYTES) {
      return json({ error: 'Request body too large (max 10 MB)' }, 413, cors);
    }

    const url = new URL(request.url);
    const gifMatch = url.pathname.match(/\/exercise-gif\/([^/]+)$/);

    if (request.method === 'GET' && gifMatch) {
      return proxyExerciseGif(gifMatch[1], env, cors);
    }

    if (request.method === 'POST' && url.pathname.endsWith('/estimate-food')) {
      return estimateFood(request, env, cors);
    }

    if (request.method === 'POST' && url.pathname.endsWith('/assistant')) {
      return assistant(request, env, cors);
    }

    if (request.method !== 'POST' || !url.pathname.endsWith('/scan-meal')) {
      return json({ error: 'Not found' }, 404, cors);
    }

    return scanMeal(request, env, cors);
  },
};

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors },
  });
}

function parseJsonLoose(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    const match = String(raw).match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('Model did not return JSON');
  }
}

async function openAiEstimateNutrition(env, text) {
  if (!env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not configured');
  }
  const prompt = `You are a nutrition assistant for a fitness tracker. The user ate:
"${String(text).slice(0, 400)}"
Estimate the nutrition. Return ONLY valid JSON with these fields:
- name: a short, cleaned-up food description (string)
- calories: estimated total kcal (integer)
- protein: estimated protein in grams (integer)
- items: optional array of { name, calories, protein }
Assume a typical single serving if no quantity is given. Be conservative if uncertain. Round to whole numbers.`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 300,
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText.slice(0, 200));
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content || '{}';
  const parsed = parseJsonLoose(raw);
  return {
    name: String(parsed.name || text).slice(0, 120),
    calories: Math.round(Number(parsed.calories) || 0),
    protein: Math.round(Number(parsed.protein) || 0),
    items: Array.isArray(parsed.items) ? parsed.items : [],
  };
}

async function openAiVisionScan(env, image) {
  const prompt = `You are a nutrition assistant. Estimate the meal in this photo for a fitness tracker.
Return ONLY valid JSON with these fields:
- name: short meal description (string)
- calories: estimated total kcal (integer)
- protein: estimated protein in grams (integer)
- items: optional array of { name, calories, protein }
Be conservative if uncertain. Round calories and protein to whole numbers.`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 300,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: image, detail: 'low' } },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText.slice(0, 200));
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content || '{}';
  const parsed = parseJsonLoose(raw);
  return {
    name: String(parsed.name || parsed.meal || 'Meal'),
    calories: Math.round(Number(parsed.calories) || 0),
    protein: Math.round(Number(parsed.protein) || 0),
    items: Array.isArray(parsed.items) ? parsed.items : [],
  };
}

async function captionMealWithWorkersAi(env, imageDataUrl) {
  if (!env.AI) return { text: null, error: 'Workers AI binding missing' };

  const prompt = 'Describe the food in this photo in one short sentence for a nutrition tracker. Include what the food is and approximate portion if visible.';

  try {
    await env.AI.run('@cf/meta/llama-3.2-11b-vision-instruct', { prompt: 'agree' });
  } catch { /* may already be accepted */ }

  try {
    const out = await env.AI.run('@cf/meta/llama-3.2-11b-vision-instruct', {
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: imageDataUrl } },
          ],
        },
      ],
    });
    const text = out?.response || out?.result || out?.description;
    if (typeof text === 'string' && text.trim()) return { text: text.trim(), error: null };
    return { text: null, error: `Vision model empty response: ${JSON.stringify(out).slice(0, 160)}` };
  } catch (e) {
    return { text: null, error: `Vision model: ${e.message || e}` };
  }
}

async function scanMeal(request, env, cors) {
  if (!env.OPENAI_API_KEY) {
    return json({ error: 'OPENAI_API_KEY not configured' }, 500, cors);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400, cors);
  }

  const image = body.image;
  if (!image || typeof image !== 'string' || !image.startsWith('data:image/')) {
    return json({ error: 'Missing image (base64 data URL)' }, 400, cors);
  }

  try {
    const result = await openAiVisionScan(env, image);
    return json(result, 200, cors);
  } catch (visionErr) {
    const { text: caption, error: captionError } = await captionMealWithWorkersAi(env, image);
    if (!caption) {
      return json({
        error: 'Scan failed',
        detail: captionError || String(visionErr.message || visionErr).slice(0, 200),
      }, 502, cors);
    }
    try {
      const result = await openAiEstimateNutrition(env, caption);
      return json({ ...result, source: 'caption' }, 200, cors);
    } catch (estimateErr) {
      return json({
        error: 'Scan failed',
        detail: String(estimateErr.message || estimateErr).slice(0, 200),
      }, 502, cors);
    }
  }
}

async function estimateFood(request, env, cors) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400, cors);
  }

  const text = (body.text || '').toString().trim();
  if (!text) {
    return json({ error: 'Missing text' }, 400, cors);
  }

  try {
    const result = await openAiEstimateNutrition(env, text);
    return json(result, 200, cors);
  } catch (e) {
    return json({ error: 'Estimate failed', detail: String(e.message || e) }, 500, cors);
  }
}

async function assistant(request, env, cors) {
  if (!env.OPENAI_API_KEY) {
    return json({ error: 'OPENAI_API_KEY not configured' }, 500, cors);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400, cors);
  }

  const message = (body.message || '').toString().trim();
  if (!message) {
    return json({ error: 'Missing message' }, 400, cors);
  }

  const history = Array.isArray(body.history) ? body.history.slice(-10) : [];
  const context = body.context && typeof body.context === 'object' ? body.context : {};

  const system = `You are the in-app AI coach for "Lock In", a fitness and daily-habit app for beginners working out at home.
You help the user with training, nutrition, and their daily schedule. Be concise, friendly, and practical.

You can PROPOSE changes to the user's plan. The app will show each proposed change with an "Approve" button; you never apply changes yourself.
Return ONLY valid JSON shaped exactly like:
{
  "reply": "your short conversational answer",
  "actions": [ ... ]
}
Each action is one of these exact shapes (omit "actions" or use [] when no change is needed):
- { "type": "add_block", "time": "HH:MM", "label": "string", "blockType": "habit"|"meal"|"workout"|"water" }
- { "type": "remove_block", "id": "string" }   // use an id from context.schedule
- { "type": "set_goal", "goal": "lose"|"recomp"|"gain"|"maintain" }
- { "type": "set_workout_days", "days": [0..6] }   // 0=Sun .. 6=Sat
- { "type": "add_food", "name": "string", "calories": int, "protein": int, "time": "HH:MM" }
Rules:
- Only include actions the user clearly asked for or agreed to. Prefer asking in "reply" before proposing destructive changes.
- Keep "reply" under ~80 words. Never include any field not listed above.
- Tailor advice to the user's goal: someone whose goal is "lose" generally prefers conditioning/cardio over heavy calisthenics volume.

User context (JSON): ${JSON.stringify(context).slice(0, 3000)}`;

  const messages = [{ role: 'system', content: system }];
  for (const h of history) {
    if (h && (h.role === 'user' || h.role === 'assistant') && typeof h.content === 'string') {
      messages.push({ role: h.role, content: h.content.slice(0, 1000) });
    }
  }
  messages.push({ role: 'user', content: message.slice(0, 1000) });

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 500,
        response_format: { type: 'json_object' },
        messages,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return json({ error: 'OpenAI error', detail: errText.slice(0, 200) }, 502, cors);
    }

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content || '{}';
    const parsed = JSON.parse(raw);
    return json({
      reply: String(parsed.reply || '').slice(0, 1200),
      actions: sanitizeActions(parsed.actions),
    }, 200, cors);
  } catch (e) {
    return json({ error: 'Assistant failed', detail: String(e.message || e) }, 500, cors);
  }
}

function sanitizeActions(actions) {
  if (!Array.isArray(actions)) return [];
  const clean = [];
  for (const a of actions.slice(0, 6)) {
    if (!a || typeof a !== 'object') continue;
    if (a.type === 'add_block' && a.time && a.label) {
      clean.push({
        type: 'add_block',
        time: String(a.time).slice(0, 5),
        label: String(a.label).slice(0, 120),
        blockType: ['habit', 'meal', 'workout', 'water'].includes(a.blockType) ? a.blockType : 'habit',
      });
    } else if (a.type === 'remove_block' && a.id) {
      clean.push({ type: 'remove_block', id: String(a.id).slice(0, 60) });
    } else if (a.type === 'set_goal' && ['lose', 'recomp', 'gain', 'maintain'].includes(a.goal)) {
      clean.push({ type: 'set_goal', goal: a.goal });
    } else if (a.type === 'set_workout_days' && Array.isArray(a.days)) {
      const days = [...new Set(a.days.map(Number).filter(d => d >= 0 && d <= 6))].sort((x, y) => x - y);
      if (days.length) clean.push({ type: 'set_workout_days', days });
    } else if (a.type === 'add_food' && a.name) {
      clean.push({
        type: 'add_food',
        name: String(a.name).slice(0, 120),
        calories: Math.max(0, Math.round(Number(a.calories) || 0)),
        protein: Math.max(0, Math.round(Number(a.protein) || 0)),
        time: a.time ? String(a.time).slice(0, 5) : '',
      });
    }
  }
  return clean;
}

async function proxyExerciseGif(id, env, cors) {
  if (!env.WORKOUTX_API_KEY) {
    return json({ error: 'WORKOUTX_API_KEY not configured' }, 500, cors);
  }

  const cleanId = String(id).replace(/\.gif$/i, '');
  const gifRes = await fetch(`https://api.workoutxapp.com/v1/gifs/${cleanId}.gif`, {
    headers: { 'X-WorkoutX-Key': env.WORKOUTX_API_KEY },
  });

  if (!gifRes.ok) {
    return json({ error: 'GIF fetch failed', status: gifRes.status }, gifRes.status, cors);
  }

  return new Response(gifRes.body, {
    status: 200,
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'public, max-age=604800',
      ...cors,
    },
  });
}
