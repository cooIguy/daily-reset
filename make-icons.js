// Lock In — lime on dark PNG icons (no external packages)
const zlib = require('zlib');
const fs   = require('fs');
const path = require('path');

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
  const raw = Buffer.alloc(h * (1 + w * 4), 0);
  const BG = [10, 15, 13];
  const LIME = [157, 252, 41];

  function px(x, y, r, g, b, a = 255) {
    if (x < 0 || x >= w || y < 0 || y >= h) return;
    const o = y * (1 + w * 4) + 1 + x * 4;
    raw[o] = r; raw[o+1] = g; raw[o+2] = b; raw[o+3] = a;
  }

  const cx = w / 2, cy = h / 2;
  const rr = size * 0.2;

  function inRR(px, py) {
    const ix = px - cx, iy = py - cy;
    const hw = w / 2 - rr, hh = h / 2 - rr;
    const ox = Math.max(0, Math.abs(ix) - hw);
    const oy = Math.max(0, Math.abs(iy) - hh);
    return Math.sqrt(ox * ox + oy * oy) <= rr;
  }

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (inRR(x + 0.5, y + 0.5)) px(x, y, ...BG);
    }
  }

  // Lock body (rounded rect)
  const lw = size * 0.34, lh = size * 0.38;
  const lt = size * 0.08;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = Math.abs(x + 0.5 - cx);
      const dy = y + 0.5 - (cy - lh * 0.05);
      if (dx <= lw / 2 && dy >= -lh / 2 && dy <= lh / 2) {
        const edgeX = lw / 2 - dx, edgeY = Math.min(dy + lh / 2, lh / 2 - dy);
        if (edgeX > lt && edgeY > lt) px(x, y, ...LIME);
        else if (edgeX > 0 && edgeY > 0) {
          const corner = Math.min(edgeX, edgeY);
          if (corner <= lt) px(x, y, ...LIME);
        }
      }
    }
  }

  // Shackle arc
  const arcR = size * 0.18;
  const arcW = size * 0.055;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = x + 0.5 - cx;
      const dy = y + 0.5 - (cy - lh * 0.55);
      const d = Math.sqrt(dx * dx + dy * dy);
      if (Math.abs(d - arcR) <= arcW && dy <= 0) px(x, y, ...LIME);
    }
  }

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6;
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
  fs.writeFileSync(path.join(outDir, `icon-${size}.png`), makePNG(size));
  console.log(`icons/icon-${size}.png`);
}
