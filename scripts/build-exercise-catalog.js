#!/usr/bin/env node
'use strict';

/**
 * Fetch bodyweight exercises from WorkoutX and write data/exercise-catalog.json
 *
 * Usage:
 *   set WORKOUTX_API_KEY=wx_your_key
 *   node scripts/build-exercise-catalog.js
 *
 * Get a free key: https://workoutxapp.com
 */

const fs = require('fs');
const path = require('path');

const API_BASE = 'https://api.workoutxapp.com/v1';
const OUT = path.join(__dirname, '..', 'data', 'exercise-catalog.json');
const MAP_OUT = path.join(__dirname, '..', 'data', 'program-map.json');

const PAGE_SIZE = 100;

function headers(key) {
  return { 'X-WorkoutX-Key': key, Accept: 'application/json' };
}

async function wxGet(key, pathSuffix) {
  const res = await fetch(`${API_BASE}${pathSuffix}`, { headers: headers(key) });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`WorkoutX ${pathSuffix} → ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

function unwrapList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  return [];
}

function isBodyweight(entry) {
  const eq = (entry.equipment || '').toLowerCase().replace(/_/g, ' ');
  return eq === 'body weight' || eq === 'bodyweight' || eq === 'body only';
}

async function fetchAllBodyweight(key) {
  const all = [];
  let offset = 0;

  while (true) {
    const payload = await wxGet(key, `/exercises?limit=${PAGE_SIZE}&offset=${offset}`);
    const batch = unwrapList(payload);
    if (!batch.length) break;
    for (const entry of batch) {
      if (isBodyweight(entry)) all.push(entry);
    }
    if (batch.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
    process.stdout.write(`\r  scanned ${offset}, kept ${all.length} bodyweight…`);
  }
  process.stdout.write('\n');
  return all;
}

function slim(entry) {
  return {
    id: String(entry.id),
    name: entry.name,
    bodyPart: entry.bodyPart || null,
    target: entry.target || null,
    equipment: entry.equipment || 'body weight',
    secondaryMuscles: entry.secondaryMuscles || [],
    difficulty: entry.difficulty || null,
    category: entry.category || null,
    instructions: entry.instructions || [],
    gifUrl: entry.gifUrl || `${API_BASE}/gifs/${entry.id}`,
  };
}

function pickBestMatch(candidates, searchName) {
  if (!candidates.length) return null;
  const q = searchName.toLowerCase();
  const exact = candidates.find(c => c.name.toLowerCase() === q);
  if (exact) return exact;
  const incl = candidates.find(c => c.name.toLowerCase().includes(q));
  if (incl) return incl;
  return candidates[0];
}

async function resolveProgramMap(key, catalogById, map) {
  const next = { ...map };

  for (const [programId, row] of Object.entries(next)) {
    if (row.catalogId && catalogById.has(String(row.catalogId).padStart(4, '0'))) continue;
    if (!row.searchName) continue;

    let match = null;
    const local = [...catalogById.values()].filter(e =>
      e.name.toLowerCase().includes(row.searchName.toLowerCase())
    );
    match = pickBestMatch(local, row.searchName);

    if (!match) {
      const payload = await wxGet(
        key,
        `/exercises/name/${encodeURIComponent(row.searchName)}?limit=10`
      );
      match = pickBestMatch(unwrapList(payload), row.searchName);
    }

    if (match) {
      row.catalogId = String(match.id);
      console.log(`  map ${programId} → ${match.id} (${match.name})`);
    } else {
      console.warn(`  warn: no WorkoutX match for ${programId} (${row.searchName})`);
    }
  }

  return next;
}

async function main() {
  const key = process.env.WORKOUTX_API_KEY;
  if (!key) {
    console.error('Set WORKOUTX_API_KEY (free at https://workoutxapp.com)');
    process.exit(1);
  }

  console.log('Fetching bodyweight exercises from WorkoutX…');
  const raw = await fetchAllBodyweight(key);
  const catalog = raw.map(slim).sort((a, b) => a.name.localeCompare(b.name));
  const catalogById = new Map(catalog.map(e => [String(e.id).padStart(4, '0'), e]));

  const payload = {
    version: 2,
    source: 'workoutxapp.com',
    apiBase: API_BASE,
    generatedAt: new Date().toISOString(),
    count: catalog.length,
    exercises: catalog,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2) + '\n');
  console.log(`Wrote ${catalog.length} exercises → ${OUT}`);

  if (fs.existsSync(MAP_OUT)) {
    const map = JSON.parse(fs.readFileSync(MAP_OUT, 'utf8'));
    console.log('Resolving program-map catalog IDs…');
    const resolved = await resolveProgramMap(key, catalogById, map);
    fs.writeFileSync(MAP_OUT, JSON.stringify(resolved, null, 2) + '\n');
    console.log(`Updated ${MAP_OUT}`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
