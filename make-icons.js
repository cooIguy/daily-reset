// Pure Node.js PNG generator — no external packages
const zlib = require('zlib');
const fs   = require('fs');
const path = require('path');

// CRC32 table
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[i] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (const b of buf) c = (c >>> 8) ^ CRC_TABLE[(c ^ b) & 0xFF];
  return ((c ^ 0xFFFFFFFF) >>> 0);
}

function pngChunk(type, data) {
  const tb = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const crcBuf = Buffer.concat([tb, data]);
  const crcVal = Buffer.alloc(4); crcVal.writeUInt32BE(crc32(crcBuf));
  return Buffer.concat([len, tb, data, crcVal]);
}

function makePNG(size) {
  const w = size, h = size;
  // Raw image data: one filter byte (0) + RGBA pixels per row
  const raw = Buffer.alloc(h * (1 + w * 4), 0);

  function px(x, y, r, g, b, a = 255) {
    if (x < 0 || x >= w || y < 0 || y >= h) return;
    const o = y * (1 + w * 4) + 1 + x * 4;
    raw[o] = r; raw[o+1] = g; raw[o+2] = b; raw[o+3] = a;
  }

  const cx = w / 2, cy = h / 2;
  const rr = size * 0.18; // rounded corner radius

  function inRR(px, py) {
    const ix = px - cx, iy = py - cy;
    const hw = w / 2 - rr, hh = h / 2 - rr;
    const ox = Math.max(0, Math.abs(ix) - hw);
    const oy = Math.max(0, Math.abs(iy) - hh);
    return Math.sqrt(ox * ox + oy * oy) <= rr;
  }

  // Background with rounded corners
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (inRR(x + 0.5, y + 0.5)) px(x, y, 26, 26, 46);
    }
  }

  // Arc ring (purple → cyan gradient)
  const arcR = size * 0.322;
  const arcThick = size * 0.04;
  const arcStart = -Math.PI / 2;
  const arcSpan  = 300 * Math.PI / 180;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = x + 0.5 - cx, dy = y + 0.5 - cy;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (Math.abs(d - arcR) > arcThick) continue;

      let ang = Math.atan2(dy, dx);
      // Normalize so arcStart is base
      let rel = ang - arcStart;
      if (rel < 0) rel += 2 * Math.PI;
      if (rel > arcSpan) continue;

      const t = rel / arcSpan;
      // Smooth gradient purple #7c3aed → cyan #06b6d4
      const r = Math.round(124 + (6   - 124) * t);
      const g = Math.round(58  + (182 - 58)  * t);
      const b = Math.round(237 + (212 - 237) * t);
      // Anti-alias: fade edges of stroke
      const edge = Math.abs(d - arcR) / arcThick;
      const alpha = Math.round(255 * Math.max(0, 1 - edge));
      if (alpha < 20) continue;

      px(x, y, r, g, b, alpha);
    }
  }

  // Center dot
  const dotR1 = size * 0.056, dotR2 = size * 0.032;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = x + 0.5 - cx, dy = y + 0.5 - cy;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d <= dotR1) px(x, y, 124, 58, 237);
      if (d <= dotR2) px(x, y, 168, 85, 247);
    }
  }

  // Build PNG
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA

  const compressed = zlib.deflateSync(raw, { level: 6 });

  return Buffer.concat([
    sig,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', compressed),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

const outDir = path.join(__dirname, 'icons');
for (const size of [192, 512]) {
  const outFile = path.join(outDir, `icon-${size}.png`);
  fs.writeFileSync(outFile, makePNG(size));
  console.log(`✓ icons/icon-${size}.png`);
}
console.log('Done.');
