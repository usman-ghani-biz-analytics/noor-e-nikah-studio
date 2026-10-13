import { formatDate, formatTime } from "./themes";
import bgRoyalUrl from "../images/bg-royal.png";
import bgEmeraldUrl from "../images/bg-emerald.png";
import bgSapphireUrl from "../images/bg-sapphire.png";
import coupleUrl from "../images/couple.png";
import goldCornerUrl from "../images/gold-corner.png";

export const VIDEO_DURATION = 30;
export const VIDEO_FPS = 15;
export const VIDEO_W = 640;
export const VIDEO_H = 1136;
export const TOTAL_FRAMES = VIDEO_DURATION * VIDEO_FPS;

/* ── easing helpers ── */
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const progress = (t, start, end) => clamp01((t - start) / (end - start));

function hexToRgba(hex, alpha) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/* ── fonts ── */
export async function loadCanvasFonts() {
  try {
    const fonts = [
      '700 72px "Playfair Display"',
      '400 48px "Cormorant Garamond"',
      '400 80px "Great Vibes"',
      '700 64px "Amiri"',
      '600 28px "Playfair Display"',
    ];
    await Promise.all(fonts.map((f) => document.fonts.load(f)));
    await document.fonts.ready;
  } catch (_) {
    /* fallback fonts are fine */
  }
}

/* ── roundRect polyfill (older browsers) ── */
if (typeof CanvasRenderingContext2D !== "undefined" && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    const radius = typeof r === "number" ? r : 0;
    this.moveTo(x + radius, y);
    this.arcTo(x + w, y, x + w, y + h, radius);
    this.arcTo(x + w, y + h, x, y + h, radius);
    this.arcTo(x, y + h, x, y, radius);
    this.arcTo(x, y, x + w, y, radius);
    this.closePath();
    return this;
  };
}

/* ── image loading ── */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image: " + src));
    img.src = src;
  });
}

const bgUrlMap = {
  "Royal Red & Gold": bgRoyalUrl,
  "Emerald & Gold": bgEmeraldUrl,
  "Midnight Sapphire": bgSapphireUrl,
};

export async function loadTemplate2Assets(themeName) {
  const results = await Promise.allSettled([
    loadImage(bgUrlMap[themeName] || bgRoyalUrl),
    loadImage(coupleUrl),
    loadImage(goldCornerUrl),
  ]);
  const bg = results[0].status === "fulfilled" ? results[0].value : null;
  const couple = results[1].status === "fulfilled" ? results[1].value : null;
  const corner = results[2].status === "fulfilled" ? results[2].value : null;
  if (!couple) {
    console.warn("Couple image failed to load — falling back to vector rendering");
  }
  return { bg, couple, corner };
}

/* ── particles ── */
function createParticles(count) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 1080,
    y: Math.random() * 1920,
    size: Math.random() * 5 + 1.5,
    speed: Math.random() * 60 + 30,
    drift: (Math.random() - 0.5) * 40,
    phase: Math.random() * Math.PI * 2,
    opacity: Math.random() * 0.5 + 0.2,
  }));
}

/* virtual design space is always 1080×1920; canvas may be smaller */
const DESIGN_W = 1080;
const DESIGN_H = 1920;

/* ── draw helpers ── */
function drawStar(ctx, sx, sy, sr, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const px = sx + sr * Math.cos(angle);
    const py = sy + sr * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawDivider(ctx, cx, y, alphaRaw, gold, width = 500) {
  const a = easeOutCubic(alphaRaw);
  if (a <= 0) return;
  ctx.save();
  ctx.globalAlpha = a * 0.6;
  const lw = width * easeOutCubic(alphaRaw);
  const gradL = ctx.createLinearGradient(cx - lw / 2, y, cx, y);
  gradL.addColorStop(0, "transparent");
  gradL.addColorStop(1, gold);
  ctx.strokeStyle = gradL;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - lw / 2, y);
  ctx.lineTo(cx, y);
  ctx.stroke();
  const gradR = ctx.createLinearGradient(cx, y, cx + lw / 2, y);
  gradR.addColorStop(0, gold);
  gradR.addColorStop(1, "transparent");
  ctx.strokeStyle = gradR;
  ctx.beginPath();
  ctx.moveTo(cx, y);
  ctx.lineTo(cx + lw / 2, y);
  ctx.stroke();
  ctx.fillStyle = gold;
  ctx.globalAlpha = a * 0.9;
  ctx.beginPath();
  ctx.moveTo(cx, y - 5);
  ctx.lineTo(cx + 5, y);
  ctx.lineTo(cx, y + 5);
  ctx.lineTo(cx - 5, y);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawText(ctx, text, x, y, font, color, alphaRaw, letterSpacing = 0, align = "center") {
  const a = easeOutCubic(alphaRaw);
  if (a <= 0) return;
  ctx.save();
  ctx.globalAlpha = a;
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  if (letterSpacing > 0) {
    const chars = text.split("");
    const totalW =
      chars.reduce((w, ch) => w + ctx.measureText(ch).width + letterSpacing, 0) -
      letterSpacing;
    let startX = align === "center" ? x - totalW / 2 : x;
    chars.forEach((ch) => {
      ctx.fillText(ch, startX, y);
      startX += ctx.measureText(ch).width + letterSpacing;
    });
  } else {
    ctx.fillText(text, x, y);
  }
  ctx.restore();
}

function drawGoldText(ctx, text, cx, y, font, alphaRaw, size, gold, gold2, t) {
  const a = easeOutCubic(alphaRaw);
  if (a <= 0) return;
  ctx.save();
  ctx.globalAlpha = a;
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const shimmerPos = (Math.sin(t * 1.2) + 1) / 2;
  const grad = ctx.createLinearGradient(cx - size * 3, y, cx + size * 3, y);
  grad.addColorStop(0, gold2);
  grad.addColorStop(Math.max(0.01, shimmerPos - 0.2), gold2);
  grad.addColorStop(shimmerPos, "#FFF8DC");
  grad.addColorStop(Math.min(0.99, shimmerPos + 0.2), gold);
  grad.addColorStop(1, gold2);
  ctx.fillStyle = grad;
  /* skip expensive shadow during video render for performance */
  ctx.fillText(text, cx, y);
  ctx.restore();
}

function drawMoonStar(ctx, x, y, size, alphaRaw, gold, rotation) {
  const a = easeOutCubic(alphaRaw);
  if (a <= 0) return;
  ctx.save();
  ctx.globalAlpha = a;
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.fillStyle = gold;
  /* no shadowBlur — too expensive per-frame */
  ctx.beginPath();
  ctx.arc(0, 0, size, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(size * 0.35, -size * 0.15, size * 0.82, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = gold;
  const sx = size * 0.65;
  const sy = -size * 0.45;
  const sr = size * 0.22;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const px = sx + sr * Math.cos(angle);
    const py = sy + sr * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawThreeStars(ctx, cx, y, alphaRaw, gold) {
  const a = easeOutCubic(alphaRaw);
  if (a <= 0) return;
  drawStar(ctx, cx - 30, y, 8, a * 0.5);
  drawStar(ctx, cx, y, 14, a * 0.9);
  drawStar(ctx, cx + 30, y, 8, a * 0.5);
}

/* ornamental glass card: fill + double gold border + corner dots */
function drawCardFrame(ctx, x, y, w, h, alphaRaw, gold, radius = 22) {
  const a = easeOutCubic(alphaRaw);
  if (a <= 0) return;
  ctx.save();
  ctx.globalAlpha = a;
  /* translucent glass fill */
  ctx.fillStyle = "rgba(0,0,0,0.34)";
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.fill();
  /* outer gold border */
  ctx.strokeStyle = gold;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  /* inner hairline */
  ctx.globalAlpha = a * 0.55;
  ctx.strokeStyle = gold;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(x + 9, y + 9, w - 18, h - 18, Math.max(6, radius - 8));
  ctx.stroke();
  /* four corner dots */
  ctx.globalAlpha = a;
  ctx.fillStyle = gold;
  const inset = 16;
  const dots = [
    [x + inset, y + inset],
    [x + w - inset, y + inset],
    [x + inset, y + h - inset],
    [x + w - inset, y + h - inset],
  ];
  dots.forEach(([px, py]) => {
    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

/* small ornamental flourish: line — diamond — line */
function drawFlourish(ctx, cx, y, halfW, alphaRaw, gold) {
  const a = easeOutCubic(alphaRaw);
  if (a <= 0) return;
  ctx.save();
  ctx.globalAlpha = a * 0.85;
  ctx.strokeStyle = gold;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - halfW, y);
  ctx.lineTo(cx - 16, y);
  ctx.moveTo(cx + 16, y);
  ctx.lineTo(cx + halfW, y);
  ctx.stroke();
  ctx.fillStyle = gold;
  ctx.beginPath();
  ctx.moveTo(cx, y - 7);
  ctx.lineTo(cx + 7, y);
  ctx.lineTo(cx, y + 7);
  ctx.lineTo(cx - 7, y);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/* deterministic twinkling sparkles — cheap, no allocation */
function drawSparkles(ctx, t, W, H, gold, count = 14) {
  ctx.save();
  for (let i = 0; i < count; i++) {
    const sx = (((i * 173) % 100) / 100) * W;
    const sy = (((i * 271) % 100) / 100) * H;
    const a = 0.1 + 0.3 * (0.5 + 0.5 * Math.sin(t * 1.7 + i * 1.9));
    ctx.globalAlpha = a;
    ctx.fillStyle = gold;
    ctx.beginPath();
    ctx.arc(sx, sy, 2 + (i % 3), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/* mosque silhouette: domes + minarets, filled dark with gold rim */
function drawMosqueSilhouette(ctx, cx, baseY, scale, alphaRaw, gold, dark) {
  const a = easeOutCubic(alphaRaw);
  if (a <= 0) return;
  const s = scale;
  ctx.save();
  ctx.globalAlpha = a;
  ctx.fillStyle = dark;
  /* main body */
  const bodyW = 220 * s;
  const bodyH = 140 * s;
  ctx.fillRect(cx - bodyW / 2, baseY - bodyH, bodyW, bodyH);
  /* main dome */
  ctx.beginPath();
  ctx.arc(cx, baseY - bodyH, bodyW / 2, Math.PI, 0);
  ctx.fill();
  /* dome finial */
  ctx.fillRect(cx - 3 * s, baseY - bodyH - 70 * s, 6 * s, 70 * s);
  ctx.beginPath();
  ctx.arc(cx, baseY - bodyH - 75 * s, 8 * s, 0, Math.PI * 2);
  ctx.fill();
  /* side domes */
  [-1, 1].forEach((dir) => {
    const sx = cx + dir * 145 * s;
    const sw = 90 * s;
    const sh = 95 * s;
    ctx.fillRect(sx - sw / 2, baseY - sh, sw, sh);
    ctx.beginPath();
    ctx.arc(sx, baseY - sh, sw / 2, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(sx - 2 * s, baseY - sh - 42 * s, 4 * s, 42 * s);
  });
  /* minarets */
  [-1, 1].forEach((dir) => {
    const mx = cx + dir * 235 * s;
    const mw = 26 * s;
    const mh = 240 * s;
    ctx.fillRect(mx - mw / 2, baseY - mh, mw, mh);
    ctx.fillRect(mx - mw * 0.95, baseY - mh + 34 * s, mw * 1.9, 10 * s);
    ctx.beginPath();
    ctx.arc(mx, baseY - mh, mw / 2, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(mx - 2 * s, baseY - mh - 42 * s, 4 * s, 42 * s);
    ctx.beginPath();
    ctx.arc(mx, baseY - mh - 46 * s, 6 * s, 0, Math.PI * 2);
    ctx.fill();
  });
  /* gold rim on dome tops */
  ctx.strokeStyle = gold;
  ctx.globalAlpha = a * 0.55;
  ctx.lineWidth = 2.2 * s;
  ctx.beginPath();
  ctx.arc(cx, baseY - bodyH, bodyW / 2, Math.PI, 0);
  ctx.stroke();
  [-1, 1].forEach((dir) => {
    ctx.beginPath();
    ctx.arc(cx + dir * 145 * s, baseY - 95 * s, 45 * s, Math.PI, 0);
    ctx.stroke();
  });
  /* arched doorway glow */
  ctx.globalAlpha = a * 0.35;
  ctx.fillStyle = gold;
  ctx.beginPath();
  ctx.moveTo(cx - 26 * s, baseY);
  ctx.lineTo(cx - 26 * s, baseY - 50 * s);
  ctx.arc(cx, baseY - 50 * s, 26 * s, Math.PI, 0);
  ctx.lineTo(cx + 26 * s, baseY);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/* hanging ornate lantern with flickering glow */
function drawLantern(ctx, x, y, size, alphaRaw, gold, t, phase = 0) {
  const a = easeOutCubic(alphaRaw);
  if (a <= 0) return;
  const s = size;
  ctx.save();
  ctx.translate(x, y);
  /* hanging cord */
  ctx.strokeStyle = gold;
  ctx.globalAlpha = a * 0.45;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, -90 * s);
  ctx.lineTo(0, -14 * s);
  ctx.stroke();
  /* glow */
  const flicker = 0.55 + 0.35 * (0.5 + 0.5 * Math.sin(t * 3 + phase));
  ctx.globalAlpha = a * 0.3 * flicker;
  const glow = ctx.createRadialGradient(0, 6 * s, 2, 0, 6 * s, 30 * s);
  glow.addColorStop(0, gold);
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 6 * s, 30 * s, 0, Math.PI * 2);
  ctx.fill();
  /* top cap */
  ctx.globalAlpha = a;
  ctx.fillStyle = gold;
  ctx.fillRect(-7 * s, -16 * s, 14 * s, 6 * s);
  ctx.fillRect(-4 * s, -20 * s, 8 * s, 4 * s);
  /* glass body */
  ctx.globalAlpha = a * 0.3;
  ctx.beginPath();
  ctx.moveTo(-11 * s, -10 * s);
  ctx.lineTo(11 * s, -10 * s);
  ctx.lineTo(8 * s, 16 * s);
  ctx.lineTo(-8 * s, 16 * s);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = a;
  ctx.strokeStyle = gold;
  ctx.lineWidth = 1.8;
  ctx.stroke();
  /* frame ribs */
  ctx.globalAlpha = a * 0.7;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, -10 * s);
  ctx.lineTo(0, 16 * s);
  ctx.stroke();
  /* bottom finial */
  ctx.globalAlpha = a;
  ctx.fillStyle = gold;
  ctx.fillRect(-5 * s, 16 * s, 10 * s, 5 * s);
  ctx.beginPath();
  ctx.arc(0, 24 * s, 3.5 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/* khatim: two rotated squares = 8-point Islamic star */
function drawKhatim(ctx, cx, cy, r, alphaRaw, gold, rotation = 0) {
  const a = easeOutCubic(alphaRaw);
  if (a <= 0) return;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.globalAlpha = a;
  ctx.strokeStyle = gold;
  ctx.lineWidth = 1.5;
  for (let sq = 0; sq < 2; sq++) {
    ctx.save();
    ctx.rotate((sq * Math.PI) / 4);
    ctx.strokeRect(-r * 0.7, -r * 0.7, r * 1.4, r * 1.4);
    ctx.restore();
  }
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.32, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

/* tiled Islamic geometric pattern — single batched stroke */
function drawGeoTiles(ctx, W, H, alphaRaw, gold, cell = 190) {
  const a = easeOutCubic(alphaRaw);
  if (a <= 0) return;
  ctx.save();
  ctx.globalAlpha = a * 0.1;
  ctx.strokeStyle = gold;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let y = 0; y <= H + cell; y += cell) {
    for (let x = 0; x <= W + cell; x += cell) {
      ctx.moveTo(x, y - 42);
      ctx.lineTo(x + 42, y);
      ctx.lineTo(x, y + 42);
      ctx.lineTo(x - 42, y);
      ctx.closePath();
      const r = 30;
      ctx.moveTo(x - r, y - r);
      ctx.lineTo(x + r, y - r);
      ctx.lineTo(x + r, y + r);
      ctx.lineTo(x - r, y + r);
      ctx.closePath();
    }
  }
  ctx.stroke();
  ctx.restore();
}

/* floral corner vine ornament */
function drawFloralCorner(ctx, x, y, size, alphaRaw, gold, flipX, flipY) {
  const a = easeOutCubic(alphaRaw);
  if (a <= 0) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
  ctx.globalAlpha = a;
  ctx.strokeStyle = gold;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(size * 0.65, size * 0.08, size, size * 0.72);
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(size * 0.08, size * 0.65, size * 0.72, size);
  ctx.stroke();
  ctx.fillStyle = gold;
  [[size * 0.32, size * 0.1, 0.6], [size * 0.1, size * 0.32, -0.6], [size * 0.55, size * 0.42, 0.3]].forEach(
    ([lx, ly, rot]) => {
      ctx.save();
      ctx.translate(lx, ly);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, 13, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  );
  [[size * 0.78, size * 0.58], [size * 0.58, size * 0.78], [size * 0.9, size * 0.88]].forEach(([dx, dy]) => {
    ctx.beginPath();
    ctx.arc(dx, dy, 4, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

/* Islamic greeting strings — overridable via data.customGreeting */
const GREETING_AR = "السَّلَامُ عَلَيْكُمْ وَرَحْمَةِ اللهِ وَبَرَكَاتُهُ";
const GREETING_EN = "As-Salamu Alaykum wa Rahmatullahi wa Barakatuh";

function greetingPair(data) {
  const custom = (data?.customGreeting || "").trim();
  if (custom) return [custom, ""];
  return [GREETING_AR, GREETING_EN];
}

/* ── main frame draw (template 1) ── */
export function drawVideoFrame(ctx, t, data, theme, particles) {
  const W = DESIGN_W;
  const H = DESIGN_H;
  const cx = W / 2;
  const gold = theme.goldPrimary;
  const gold2 = theme.goldSecondary;
  const textC = theme.textColor;

  /* background */
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, theme.canvasBg1);
  bg.addColorStop(0.5, theme.canvasBg2);
  bg.addColorStop(1, theme.canvasBg3);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  /* geometric pattern — simplified for video perf */
  ctx.save();
  ctx.globalAlpha = 0.03;
  ctx.strokeStyle = gold;
  ctx.lineWidth = 1;
  const gridSize = 160;
  const offset = (t * 10) % gridSize;
  ctx.beginPath();
  for (let gx = -gridSize + offset; gx < W + gridSize; gx += gridSize) {
    for (let gy = -gridSize + offset; gy < H + gridSize; gy += gridSize) {
      ctx.moveTo(gx + gridSize / 2, gy);
      ctx.lineTo(gx + gridSize, gy + gridSize / 2);
      ctx.lineTo(gx + gridSize / 2, gy + gridSize);
      ctx.lineTo(gx, gy + gridSize / 2);
      ctx.closePath();
    }
  }
  ctx.stroke();
  ctx.restore();

  /* vignette */
  const vig = ctx.createRadialGradient(cx, H / 2, H * 0.2, cx, H / 2, H * 0.7);
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, "rgba(0,0,0,0.4)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  /* particles */
  ctx.save();
  particles.forEach((p) => {
    const py = (((p.y - t * p.speed) % (H + 40)) + H + 40) % (H + 40) - 20;
    const px = p.x + Math.sin(t * 0.8 + p.phase) * p.drift;
    const flicker = 0.5 + 0.5 * Math.sin(t * 3 + p.phase);
    ctx.globalAlpha = p.opacity * flicker;
    const grad = ctx.createRadialGradient(px, py, 0, px, py, p.size * 2);
    grad.addColorStop(0, "#fff9c4");
    grad.addColorStop(0.5, gold);
    grad.addColorStop(1, gold2);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(px, py, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

  /* ── card frame ── */
  const cardTop = 280;
  const cardW = 820;
  const cardLeft = (W - cardW) / 2;
  const cardH = 1360;
  const r = 24;

  const cardAppear = easeOutCubic(progress(t, 0.5, 1.8));
  const cardGlow = easeOutCubic(progress(t, 0.3, 1.5));

  if (cardGlow > 0) {
    ctx.save();
    /* no shadowBlur — use a wider stroke glow instead for performance */
    ctx.globalAlpha = cardGlow * 0.25;
    ctx.strokeStyle = gold;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.roundRect(cardLeft, cardTop, cardW, cardH, r);
    ctx.stroke();
    ctx.globalAlpha = cardGlow;
    ctx.lineWidth = 4;
    ctx.strokeStyle = hexToRgba(gold, 0.4);
    ctx.beginPath();
    ctx.roundRect(cardLeft, cardTop, cardW, cardH, r);
    ctx.stroke();
    ctx.restore();
  }

  if (cardAppear > 0) {
    ctx.save();
    ctx.globalAlpha = cardAppear;
    const cardGrad = ctx.createLinearGradient(cardLeft, cardTop, cardLeft, cardTop + cardH);
    cardGrad.addColorStop(0, hexToRgba(theme.canvasBg1, 0.9));
    cardGrad.addColorStop(1, hexToRgba(theme.canvasBg3, 0.95));
    ctx.fillStyle = cardGrad;
    ctx.beginPath();
    ctx.roundRect(cardLeft, cardTop, cardW, cardH, r);
    ctx.fill();
    ctx.strokeStyle = hexToRgba(gold, 0.25 * cardAppear);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(cardLeft + 10, cardTop + 10, cardW - 20, cardH - 20, 16);
    ctx.stroke();
    ctx.restore();
  }

  /* ═════ SCENE 1 (0–5s): Bismillah + Title ═════ */
  drawText(
    ctx,
    "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
    cx,
    cardTop + 120,
    '64px "Amiri", serif',
    hexToRgba(gold, 0.85),
    progress(t, 1.0, 2.2)
  );
  drawDivider(ctx, cx, cardTop + 180, progress(t, 1.5, 2.5), gold, 500);
  drawThreeStars(ctx, cx, cardTop + 220, progress(t, 2.0, 3.0), gold);
  drawText(
    ctx,
    "THE HOLY BOND OF",
    cx,
    cardTop + 280,
    '600 28px "Playfair Display", serif',
    hexToRgba(gold, 0.7),
    progress(t, 2.5, 3.5),
    14
  );
  drawGoldText(
    ctx,
    "Nikah",
    cx,
    cardTop + 360,
    '400 80px "Great Vibes", cursive',
    progress(t, 3.0, 4.2),
    80,
    gold,
    gold2,
    t
  );
  drawText(
    ctx,
    "CELEBRATION",
    cx,
    cardTop + 420,
    '600 28px "Playfair Display", serif',
    hexToRgba(gold, 0.7),
    progress(t, 3.5, 4.5),
    14
  );
  drawDivider(ctx, cx, cardTop + 470, progress(t, 4.0, 5.0), gold, 500);

  /* ═════ SCENE 2 (5–15s): Invite + Names ═════ */
  drawText(
    ctx,
    "With the blessings of Allah SWT,",
    cx,
    cardTop + 540,
    '400 36px "Cormorant Garamond", serif',
    hexToRgba(textC, 0.75),
    progress(t, 5.0, 6.0)
  );
  drawText(
    ctx,
    "we joyfully invite you to celebrate",
    cx,
    cardTop + 585,
    '400 36px "Cormorant Garamond", serif',
    hexToRgba(textC, 0.75),
    progress(t, 5.3, 6.3)
  );
  drawText(
    ctx,
    "the wedding of",
    cx,
    cardTop + 630,
    '400 36px "Cormorant Garamond", serif',
    hexToRgba(textC, 0.75),
    progress(t, 5.6, 6.6)
  );

  /* Groom */
  const groomIn = progress(t, 7.0, 8.2);
  if (groomIn > 0) {
    const slide = (1 - easeOutCubic(groomIn)) * 30;
    ctx.save();
    ctx.translate(0, slide);
    drawGoldText(
      ctx,
      data.dulhaName || "Dulha Name",
      cx,
      cardTop + 720,
      '700 58px "Playfair Display", serif',
      groomIn,
      58,
      gold,
      gold2,
      t
    );
    ctx.restore();
  }

  drawDivider(ctx, cx, cardTop + 770, progress(t, 8.5, 9.3), gold, 200);
  const ampIn = progress(t, 8.8, 9.5);
  if (ampIn > 0) {
    ctx.save();
    ctx.globalAlpha = easeOutCubic(ampIn);
    ctx.font = '400 52px "Great Vibes", cursive';
    ctx.fillStyle = gold;
    ctx.textAlign = "center";
    ctx.fillText("&", cx, cardTop + 830);
    ctx.restore();
  }
  drawDivider(ctx, cx, cardTop + 870, progress(t, 9.0, 9.8), gold, 200);

  /* Bride */
  const brideIn = progress(t, 9.5, 10.7);
  if (brideIn > 0) {
    const slide = (1 - easeOutCubic(brideIn)) * 30;
    ctx.save();
    ctx.translate(0, slide);
    drawGoldText(
      ctx,
      data.dulhanName || "Dulhan Name",
      cx,
      cardTop + 930,
      '700 58px "Playfair Display", serif',
      brideIn,
      58,
      gold,
      gold2,
      t
    );
    ctx.restore();
  }

  drawText(
    ctx,
    "Daughter of",
    cx,
    cardTop + 1000,
    '400 32px "Cormorant Garamond", serif',
    hexToRgba(textC, 0.65),
    progress(t, 10.5, 11.3)
  );
  drawText(
    ctx,
    data.dulhanFather || "Father's Name",
    cx,
    cardTop + 1040,
    '600 34px "Cormorant Garamond", serif',
    hexToRgba(gold, 0.9),
    progress(t, 10.8, 11.6)
  );
  drawDivider(ctx, cx, cardTop + 1090, progress(t, 11.5, 12.3), gold, 500);

  /* ═════ SCENE 3 (12–18s): Details ═════ */
  /* date */
  const dateIn = progress(t, 12.0, 13.0);
  if (dateIn > 0) {
    ctx.save();
    ctx.globalAlpha = easeOutCubic(dateIn);
    ctx.strokeStyle = hexToRgba(gold, 0.8);
    ctx.lineWidth = 2;
    const ix = cx - 240;
    const iy = cardTop + 1150;
    ctx.strokeRect(ix, iy - 8, 16, 16);
    ctx.beginPath();
    ctx.moveTo(ix, iy - 4);
    ctx.lineTo(ix + 16, iy - 4);
    ctx.stroke();
    ctx.font = '400 36px "Cormorant Garamond", serif';
    ctx.fillStyle = hexToRgba(textC, 0.85);
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(formatDate(data.nikahDate), ix + 30, iy);
    ctx.restore();
  }

  /* time */
  const timeIn = progress(t, 13.0, 14.0);
  if (timeIn > 0) {
    ctx.save();
    ctx.globalAlpha = easeOutCubic(timeIn);
    ctx.strokeStyle = hexToRgba(gold, 0.8);
    ctx.lineWidth = 2;
    const ix = cx - 240;
    const iy = cardTop + 1210;
    ctx.beginPath();
    ctx.arc(ix + 8, iy, 9, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(ix + 8, iy - 5);
    ctx.lineTo(ix + 8, iy);
    ctx.lineTo(ix + 13, iy);
    ctx.stroke();
    ctx.font = '400 36px "Cormorant Garamond", serif';
    ctx.fillStyle = hexToRgba(textC, 0.85);
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(formatTime(data.nikahTime), ix + 30, iy);
    ctx.restore();
  }

  /* venue */
  const venueIn = progress(t, 14.0, 15.0);
  if (venueIn > 0) {
    ctx.save();
    ctx.globalAlpha = easeOutCubic(venueIn);
    ctx.strokeStyle = hexToRgba(gold, 0.8);
    ctx.lineWidth = 2;
    const ix = cx - 240;
    const iy = cardTop + 1270;
    ctx.beginPath();
    ctx.arc(ix + 8, iy - 4, 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(ix + 2, iy - 1);
    ctx.lineTo(ix + 8, iy + 10);
    ctx.lineTo(ix + 14, iy - 1);
    ctx.stroke();
    ctx.font = '400 32px "Cormorant Garamond", serif';
    ctx.fillStyle = hexToRgba(textC, 0.85);
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    const venue = data.venue || "Venue TBA";
    if (ctx.measureText(venue).width > 460) {
      const words = venue.split(" ");
      let line = "";
      let ly = iy;
      words.forEach((word) => {
        const test = line ? line + " " + word : word;
        if (ctx.measureText(test).width > 440) {
          ctx.fillText(line, ix + 30, ly);
          line = word;
          ly += 38;
        } else {
          line = test;
        }
      });
      ctx.fillText(line, ix + 30, ly);
    } else {
      ctx.fillText(venue, ix + 30, iy);
    }
    ctx.restore();
  }

  drawDivider(ctx, cx, cardTop + 1340, progress(t, 15.0, 15.8), gold, 500);

  /* ═════ SCENE 4 (17–24s): Closing ═════ */
  drawGoldText(
    ctx,
    "Insha'Allah",
    cx,
    cardTop + 1430,
    '400 56px "Great Vibes", cursive',
    progress(t, 17.0, 18.5),
    56,
    gold,
    gold2,
    t
  );
  drawText(
    ctx,
    "WE AWAIT YOUR GRACIOUS PRESENCE",
    cx,
    cardTop + 1490,
    '400 26px "Cormorant Garamond", serif',
    hexToRgba(textC, 0.5),
    progress(t, 18.0, 19.2),
    8
  );
  drawMoonStar(ctx, cx - 20, cardTop + 1540, 16, progress(t, 19.0, 20.0), gold, -0.4);
  drawThreeStars(ctx, cx, cardTop + 1540, progress(t, 19.5, 20.5), gold);

  /* ═════ Finale (22–30s): glow pulse + fade ═════ */
  const finale = progress(t, 22, 26);
  if (finale > 0) {
    const pulse = 0.5 + 0.5 * Math.sin(t * 2);
    ctx.save();
    ctx.globalAlpha = finale * 0.15 * pulse;
    const fg = ctx.createRadialGradient(cx, cardTop + cardH / 2, 100, cx, cardTop + cardH / 2, cardW);
    fg.addColorStop(0, gold);
    fg.addColorStop(1, "transparent");
    ctx.fillStyle = fg;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  /* animated border shimmer */
  const borderPulse = 0.3 + 0.2 * Math.sin(t * 1.5);
  ctx.save();
  ctx.globalAlpha = cardAppear * borderPulse;
  ctx.strokeStyle = gold;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(cardLeft - 2, cardTop - 2, cardW + 4, cardH + 4, 26);
  ctx.stroke();
  ctx.restore();

  /* final fade */
  const fadeOut = progress(t, 27.5, 30);
  if (fadeOut > 0) {
    ctx.save();
    ctx.globalAlpha = fadeOut;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
}

/* ═══════════ TEMPLATE 2: Couple Portrait ═══════════ */
function drawVideoFrameTemplate2(ctx, t, data, theme, assets) {
  const W = DESIGN_W;
  const H = DESIGN_H;
  const cx = W / 2;
  const gold = theme.goldPrimary;
  const gold2 = theme.goldSecondary;
  const textC = theme.textColor;
  const { bg, couple, corner } = assets;

  /* photo background (cover) — fallback to gradient */
  if (bg) {
    const bgScale = Math.max(W / bg.width, H / bg.height);
    const bgW = bg.width * bgScale;
    const bgH = bg.height * bgScale;
    ctx.drawImage(bg, (W - bgW) / 2, (H - bgH) / 2, bgW, bgH);
  } else {
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, theme.canvasBg1);
    bgGrad.addColorStop(0.5, theme.canvasBg2);
    bgGrad.addColorStop(1, theme.canvasBg3);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);
  }

  /* dark overlay gradient for readability */
  const ov = ctx.createLinearGradient(0, 0, 0, H);
  ov.addColorStop(0, "rgba(0,0,0,0.45)");
  ov.addColorStop(0.4, "rgba(0,0,0,0.15)");
  ov.addColorStop(1, "rgba(0,0,0,0.78)");
  ctx.fillStyle = ov;
  ctx.fillRect(0, 0, W, H);

  /* floating gold sparkles over background */
  drawSparkles(ctx, t, W, H, gold, 14);

  /* gold corners — skip if image missing */
  if (corner) {
    const cornerSize = 160;
    ctx.save();
    ctx.globalAlpha = 0.75;
    ctx.drawImage(corner, 0, 0, cornerSize, cornerSize);
    ctx.save();
    ctx.translate(W, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(corner, 0, 0, cornerSize, cornerSize);
    ctx.restore();
    ctx.save();
    ctx.translate(0, H);
    ctx.scale(1, -1);
    ctx.drawImage(corner, 0, 0, cornerSize, cornerSize);
    ctx.restore();
    ctx.save();
    ctx.translate(W, H);
    ctx.scale(-1, -1);
    ctx.drawImage(corner, 0, 0, cornerSize, cornerSize);
    ctx.restore();
    ctx.restore();
  }

  /* gold inner border */
  const bAppear = easeOutCubic(progress(t, 0.3, 1.2));
  ctx.save();
  ctx.globalAlpha = bAppear * (0.4 + 0.2 * Math.sin(t * 1.5));
  ctx.strokeStyle = gold;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(16, 16, W - 32, H - 32, 20);
  ctx.stroke();
  ctx.restore();

  /* couple image in an ornamental framed card — skip if missing */
  if (couple) {
    const coupleIn = easeOutCubic(progress(t, 4.5, 7));
    const coupleFull = progress(t, 5, 8);
    const coupleAlpha = 0.2 + coupleFull * 0.8;
    const coupleScale = 0.85 + coupleFull * 0.15;
    /* fit inside a reserved band so it never collides with bottom text */
    let coupleW = W * 0.78 * coupleScale;
    let coupleH = (couple.height / couple.width) * coupleW;
    const maxH = H * 0.4 * coupleScale;
    if (coupleH > maxH) {
      coupleH = maxH;
      coupleW = (couple.width / couple.height) * coupleH;
    }
    const coupleX = (W - coupleW) / 2;
    const coupleY = H * 0.44 - coupleH / 2 + (1 - coupleIn) * 80;

    ctx.save();
    ctx.globalAlpha = coupleAlpha;
    ctx.beginPath();
    ctx.roundRect(coupleX, coupleY, coupleW, coupleH, 16);
    ctx.clip();
    ctx.drawImage(couple, coupleX, coupleY, coupleW, coupleH);
    ctx.restore();

    /* ornamental double border + corner dots */
    drawCardFrame(
      ctx,
      coupleX - 20,
      coupleY - 20,
      coupleW + 40,
      coupleH + 40,
      progress(t, 4.8, 6.2),
      gold,
      26
    );
    /* flourish under the couple card */
    drawFlourish(
      ctx,
      cx,
      coupleY + coupleH + 52,
      200,
      progress(t, 6.5, 7.5),
      gold
    );
  } else {
    /* vector fallback: simple crescent + star */
    drawMoonStar(ctx, W / 2, H * 0.4, 60, progress(t, 5, 8), gold, -0.3);
  }

  /* ═══ SCENE 1 (0–5s): Bismillah ═══ */
  drawText(
    ctx,
    "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
    cx,
    H * 0.13,
    '60px "Amiri", serif',
    hexToRgba(gold, 0.9),
    progress(t, 1.0, 2.2)
  );
  drawDivider(ctx, cx, H * 0.17, progress(t, 1.5, 2.5), gold, 600);
  drawThreeStars(ctx, cx, H * 0.2, progress(t, 2.2, 3.2), gold);
  drawFlourish(ctx, cx, H * 0.232, 240, progress(t, 2.6, 3.6), gold);

  /* ═══ SCENE 2 (5–15s): Invite + couple names ═══ */
  /* ornamental invite card */
  drawCardFrame(ctx, W * 0.08, H * 0.688, W * 0.84, H * 0.155, progress(t, 4.8, 6.0), gold, 24);
  drawText(
    ctx,
    "With the blessings of Allah SWT, we joyfully invite you",
    cx,
    H * 0.72,
    '400 34px "Cormorant Garamond", serif',
    hexToRgba(textC, 0.85),
    progress(t, 5.0, 6.0)
  );
  drawText(
    ctx,
    "to celebrate the wedding of",
    cx,
    H * 0.755,
    '400 34px "Cormorant Garamond", serif',
    hexToRgba(textC, 0.85),
    progress(t, 5.3, 6.3)
  );
  drawGoldText(
    ctx,
    `${data.dulhaName || "Groom"} & ${data.dulhanName || "Bride"}`,
    cx,
    H * 0.81,
    '400 52px "Great Vibes", cursive',
    progress(t, 6.5, 8.0),
    52,
    gold,
    gold2,
    t
  );

  /* ═══ SCENE 3 (15–25s): Names + family ═══ */
  drawDivider(ctx, cx, H * 0.86, progress(t, 15.0, 15.8), gold, 500);
  /* ornamental names card */
  drawCardFrame(ctx, W * 0.1, H * 0.872, W * 0.8, H * 0.114, progress(t, 15.2, 16.4), gold, 20);
  drawGoldText(
    ctx,
    data.dulhaName || "Dulha Name",
    cx,
    H * 0.895,
    '700 48px "Playfair Display", serif',
    progress(t, 15.5, 16.5),
    48,
    gold,
    gold2,
    t
  );
  const amp2 = progress(t, 16.5, 17.2);
  if (amp2 > 0) {
    ctx.save();
    ctx.globalAlpha = easeOutCubic(amp2);
    ctx.font = '400 44px "Great Vibes", cursive';
    ctx.fillStyle = gold;
    ctx.textAlign = "center";
    ctx.fillText("&", cx, H * 0.92);
    ctx.restore();
  }
  drawGoldText(
    ctx,
    data.dulhanName || "Dulhan Name",
    cx,
    H * 0.945,
    '700 48px "Playfair Display", serif',
    progress(t, 17.0, 18.0),
    48,
    gold,
    gold2,
    t
  );
  drawText(
    ctx,
    `D/O ${data.dulhanFather || "Father's Name"}`,
    cx,
    H * 0.97,
    '600 30px "Cormorant Garamond", serif',
    hexToRgba(gold, 0.9),
    progress(t, 18.0, 19.0)
  );

  /* ═══ SCENE 4 (25–30s): Details + closing ═══ */
  /* ornamental details card behind date/time/venue */
  drawCardFrame(ctx, W * 0.1, H * 0.548, W * 0.8, H * 0.125, progress(t, 25.0, 26.0), gold, 20);
  drawDivider(ctx, cx, H * 0.695, progress(t, 25.0, 25.5), gold, 600);
  /* flourish under closing */
  drawFlourish(ctx, cx, H * 0.455, 220, progress(t, 28.3, 29.2), gold);

  /* date */
  const d4 = progress(t, 25.3, 26.0);
  if (d4 > 0) {
    ctx.save();
    ctx.globalAlpha = easeOutCubic(d4);
    ctx.font = '400 34px "Cormorant Garamond", serif';
    ctx.fillStyle = hexToRgba(textC, 0.9);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(formatDate(data.nikahDate), cx, H * 0.64);
    ctx.restore();
  }
  /* time */
  const t4 = progress(t, 26.0, 26.7);
  if (t4 > 0) {
    ctx.save();
    ctx.globalAlpha = easeOutCubic(t4);
    ctx.font = '400 34px "Cormorant Garamond", serif';
    ctx.fillStyle = hexToRgba(textC, 0.9);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(formatTime(data.nikahTime), cx, H * 0.605);
    ctx.restore();
  }
  /* venue */
  const v4 = progress(t, 26.7, 27.4);
  if (v4 > 0) {
    ctx.save();
    ctx.globalAlpha = easeOutCubic(v4);
    ctx.font = '400 30px "Cormorant Garamond", serif';
    ctx.fillStyle = hexToRgba(textC, 0.9);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const venue = data.venue || "Venue TBA";
    if (ctx.measureText(venue).width > W - 120) {
      const words = venue.split(" ");
      let line = "";
      let ly = H * 0.57;
      words.forEach((word) => {
        const test = line ? line + " " + word : word;
        if (ctx.measureText(test).width > W - 140) {
          ctx.fillText(line, cx, ly);
          line = word;
          ly += 36;
        } else {
          line = test;
        }
      });
      ctx.fillText(line, cx, ly);
    } else {
      ctx.fillText(venue, cx, H * 0.57);
    }
    ctx.restore();
  }

  /* Insha'Allah closing */
  drawGoldText(
    ctx,
    "Insha'Allah",
    cx,
    H * 0.53,
    '400 48px "Great Vibes", cursive',
    progress(t, 27.5, 28.5),
    48,
    gold,
    gold2,
    t
  );
  drawText(
    ctx,
    "WE AWAIT YOUR GRACIOUS PRESENCE",
    cx,
    H * 0.49,
    '400 24px "Cormorant Garamond", serif',
    hexToRgba(textC, 0.55),
    progress(t, 28.0, 29.0),
    6
  );

  /* finale glow */
  const finale = progress(t, 22, 26);
  if (finale > 0) {
    const pulse = 0.5 + 0.5 * Math.sin(t * 2);
    ctx.save();
    ctx.globalAlpha = finale * 0.12 * pulse;
    const fg = ctx.createRadialGradient(cx, H / 2, 100, cx, H / 2, W);
    fg.addColorStop(0, gold);
    fg.addColorStop(1, "transparent");
    ctx.fillStyle = fg;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  /* final fade */
  const fadeOut = progress(t, 27.5, 30);
  if (fadeOut > 0) {
    ctx.save();
    ctx.globalAlpha = fadeOut;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
}

/* ═══════════ TEMPLATE 3: Masjid Nightscape ═══════════ */
function drawVideoFrameTemplate3(ctx, t, data, theme) {
  const W = DESIGN_W;
  const H = DESIGN_H;
  const cx = W / 2;
  const gold = theme.goldPrimary;
  const gold2 = theme.goldSecondary;
  const textC = theme.textColor;

  /* night sky gradient */
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, "#0A1628");
  sky.addColorStop(0.45, "#13233F");
  sky.addColorStop(1, "#060B14");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  /* stars */
  drawSparkles(ctx, t, W, H * 0.7, "#FFF8DC", 34);

  /* crescent moon top-right */
  drawMoonStar(ctx, W * 0.82, H * 0.12, 46, progress(t, 0.5, 2.0), gold, -0.35);

  /* mosque silhouette rises from bottom */
  drawMosqueSilhouette(
    ctx,
    cx,
    H * 0.985,
    1.15,
    progress(t, 1.0, 3.5),
    gold,
    "#04070D"
  );

  /* hanging lanterns */
  drawLantern(ctx, W * 0.16, H * 0.2, 1.1, progress(t, 2.0, 3.5), gold, t, 0);
  drawLantern(ctx, W * 0.5, H * 0.15, 1.35, progress(t, 2.4, 3.9), gold, t, 1.7);
  drawLantern(ctx, W * 0.84, H * 0.21, 1.1, progress(t, 2.8, 4.3), gold, t, 3.4);

  /* gold border */
  const bA = easeOutCubic(progress(t, 0.3, 1.2));
  ctx.save();
  ctx.globalAlpha = bA * (0.4 + 0.2 * Math.sin(t * 1.5));
  ctx.strokeStyle = gold;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(16, 16, W - 32, H - 32, 20);
  ctx.stroke();
  ctx.restore();

  /* ═══ SCENE 1 (0–5s): Islamic greeting ═══ */
  const [gAr, gEn] = greetingPair(data);
  const g1 = progress(t, 1.2, 2.6);
  if (g1 > 0) {
    drawCardFrame(ctx, W * 0.07, H * 0.3, W * 0.86, H * 0.14, g1, gold, 22);
    drawText(ctx, gAr, cx, H * 0.345, '52px "Amiri", serif', hexToRgba(gold, 0.95), g1, 1);
    if (gEn) {
      drawText(
        ctx,
        gEn,
        cx,
        H * 0.395,
        '400 26px "Cormorant Garamond", serif',
        hexToRgba(textC, 0.8),
        progress(t, 1.8, 3.0),
        2
      );
    }
  }
  drawFlourish(ctx, cx, H * 0.465, 260, progress(t, 2.6, 3.6), gold);

  /* ═══ SCENE 2 (5–15s): Bismillah + invitation ═══ */
  drawText(
    ctx,
    "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
    cx,
    H * 0.52,
    '56px "Amiri", serif',
    hexToRgba(gold, 0.9),
    progress(t, 5.5, 6.8)
  );
  drawCardFrame(ctx, W * 0.08, H * 0.56, W * 0.84, H * 0.1, progress(t, 6.0, 7.2), gold, 20);
  drawText(
    ctx,
    "With the blessings of Allah SWT, we joyfully invite you",
    cx,
    H * 0.585,
    '400 30px "Cormorant Garamond", serif',
    hexToRgba(textC, 0.85),
    progress(t, 6.3, 7.3)
  );
  drawText(
    ctx,
    "to celebrate the wedding of",
    cx,
    H * 0.62,
    '400 30px "Cormorant Garamond", serif',
    hexToRgba(textC, 0.85),
    progress(t, 6.6, 7.6)
  );
  drawGoldText(
    ctx,
    `${data.dulhaName || "Groom"} & ${data.dulhanName || "Bride"}`,
    cx,
    H * 0.645,
    '400 40px "Great Vibes", cursive',
    progress(t, 7.5, 9.0),
    40,
    gold,
    gold2,
    t
  );

  /* ═══ SCENE 3 (15–25s): Names card ═══ */
  drawCardFrame(ctx, W * 0.1, H * 0.7, W * 0.8, H * 0.16, progress(t, 15.0, 16.3), gold, 22);
  drawGoldText(
    ctx,
    data.dulhaName || "Dulha Name",
    cx,
    H * 0.745,
    '700 44px "Playfair Display", serif',
    progress(t, 15.5, 16.5),
    44,
    gold,
    gold2,
    t
  );
  drawFlourish(ctx, cx, H * 0.78, 160, progress(t, 16.5, 17.3), gold);
  drawGoldText(
    ctx,
    data.dulhanName || "Dulhan Name",
    cx,
    H * 0.825,
    '700 44px "Playfair Display", serif',
    progress(t, 17.0, 18.0),
    44,
    gold,
    gold2,
    t
  );
  drawText(
    ctx,
    `D/O ${data.dulhanFather || "Father's Name"}`,
    cx,
    H * 0.85,
    '600 26px "Cormorant Garamond", serif',
    hexToRgba(gold, 0.85),
    progress(t, 18.0, 19.0)
  );

  /* ═══ SCENE 4 (25–30s): Details + closing ═══ */
  drawCardFrame(ctx, W * 0.1, H * 0.38, W * 0.8, H * 0.17, progress(t, 25.0, 26.2), gold, 22);
  const rows4 = [
    [formatDate(data.nikahDate), 25.3, 26.0],
    [formatTime(data.nikahTime), 25.9, 26.6],
    [data.venue || "Venue TBA", 26.5, 27.2],
  ];
  rows4.forEach(([txt, s, e], i) => {
    drawText(
      ctx,
      txt,
      cx,
      H * (0.415 + i * 0.048),
      i === 2 ? '400 28px "Cormorant Garamond", serif' : '400 32px "Cormorant Garamond", serif',
      hexToRgba(textC, 0.92),
      progress(t, s, e)
    );
  });
  drawGoldText(
    ctx,
    "Insha'Allah",
    cx,
    H * 0.585,
    '400 46px "Great Vibes", cursive',
    progress(t, 27.4, 28.4),
    46,
    gold,
    gold2,
    t
  );
  drawText(
    ctx,
    "WE AWAIT YOUR GRACIOUS PRESENCE",
    cx,
    H * 0.625,
    '400 22px "Cormorant Garamond", serif',
    hexToRgba(textC, 0.5),
    progress(t, 28.0, 29.0),
    6
  );

  /* finale glow + fade */
  const finale3 = progress(t, 22, 26);
  if (finale3 > 0) {
    const pulse = 0.5 + 0.5 * Math.sin(t * 2);
    ctx.save();
    ctx.globalAlpha = finale3 * 0.1 * pulse;
    const fg = ctx.createRadialGradient(cx, H * 0.4, 80, cx, H * 0.4, W);
    fg.addColorStop(0, gold);
    fg.addColorStop(1, "transparent");
    ctx.fillStyle = fg;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
  const fadeOut3 = progress(t, 27.5, 30);
  if (fadeOut3 > 0) {
    ctx.save();
    ctx.globalAlpha = fadeOut3;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
}

/* ═══════════ TEMPLATE 4: Emerald Geometry ═══════════ */
function drawVideoFrameTemplate4(ctx, t, data, theme) {
  const W = DESIGN_W;
  const H = DESIGN_H;
  const cx = W / 2;
  const gold = theme.goldPrimary;
  const gold2 = theme.goldSecondary;
  const textC = theme.textColor;

  /* deep emerald gradient */
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0A3B2C");
  bg.addColorStop(0.5, "#062018");
  bg.addColorStop(1, "#031A12");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  /* geometric tiles */
  drawGeoTiles(ctx, W, H, 1, gold, 190);

  /* floral corners */
  const fA = progress(t, 0.5, 2.0);
  drawFloralCorner(ctx, 24, 24, 150, fA, gold, false, false);
  drawFloralCorner(ctx, W - 24, 24, 150, fA, gold, true, false);
  drawFloralCorner(ctx, 24, H - 24, 150, fA, gold, false, true);
  drawFloralCorner(ctx, W - 24, H - 24, 150, fA, gold, true, true);

  /* gold border */
  const bA = easeOutCubic(progress(t, 0.3, 1.2));
  ctx.save();
  ctx.globalAlpha = bA * (0.45 + 0.2 * Math.sin(t * 1.5));
  ctx.strokeStyle = gold;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(18, 18, W - 36, H - 36, 18);
  ctx.stroke();
  ctx.restore();

  /* rotating khatim medallion behind content */
  drawKhatim(ctx, cx, H * 0.44, 150, progress(t, 1.0, 2.5) * 0.5, gold, t * 0.08);
  drawKhatim(ctx, cx, H * 0.44, 110, progress(t, 1.4, 2.9) * 0.6, gold, -t * 0.1);
  ctx.save();
  ctx.globalAlpha = progress(t, 1.2, 2.6) * 0.25;
  const med = ctx.createRadialGradient(cx, H * 0.44, 20, cx, H * 0.44, 150);
  med.addColorStop(0, gold);
  med.addColorStop(1, "transparent");
  ctx.fillStyle = med;
  ctx.beginPath();
  ctx.arc(cx, H * 0.44, 150, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  /* small khatims drifting */
  drawKhatim(ctx, W * 0.15, H * 0.72, 28, progress(t, 2.5, 4) * 0.4, gold, t * 0.15);
  drawKhatim(ctx, W * 0.85, H * 0.68, 24, progress(t, 3.0, 4.5) * 0.4, gold, -t * 0.12);

  /* ═══ SCENE 1 (0–5s): Greeting inside medallion ═══ */
  const [gAr, gEn] = greetingPair(data);
  drawText(ctx, gAr, cx, H * 0.38, '44px "Amiri", serif', hexToRgba(gold, 0.95), progress(t, 1.5, 3.0), 1);
  if (gEn) {
    drawText(
      ctx,
      gEn,
      cx,
      H * 0.425,
      '400 24px "Cormorant Garamond", serif',
      hexToRgba(textC, 0.8),
      progress(t, 2.0, 3.4),
      2
    );
  }
  drawFlourish(ctx, cx, H * 0.48, 220, progress(t, 2.8, 3.8), gold);

  /* ═══ SCENE 2 (5–15s): Bismillah + invitation ═══ */
  drawCardFrame(ctx, W * 0.08, H * 0.55, W * 0.84, H * 0.2, progress(t, 5.5, 6.8), gold, 22);
  drawText(
    ctx,
    "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
    cx,
    H * 0.59,
    '48px "Amiri", serif',
    hexToRgba(gold, 0.9),
    progress(t, 5.8, 7.0)
  );
  drawFlourish(ctx, cx, H * 0.625, 180, progress(t, 6.2, 7.2), gold);
  drawText(
    ctx,
    "With the blessings of Allah SWT, we joyfully invite you",
    cx,
    H * 0.665,
    '400 28px "Cormorant Garamond", serif',
    hexToRgba(textC, 0.85),
    progress(t, 6.5, 7.5)
  );
  drawText(
    ctx,
    "to celebrate the wedding of",
    cx,
    H * 0.695,
    '400 28px "Cormorant Garamond", serif',
    hexToRgba(textC, 0.85),
    progress(t, 6.8, 7.8)
  );
  drawGoldText(
    ctx,
    `${data.dulhaName || "Groom"} & ${data.dulhanName || "Bride"}`,
    cx,
    H * 0.735,
    '400 40px "Great Vibes", cursive',
    progress(t, 7.8, 9.2),
    40,
    gold,
    gold2,
    t
  );

  /* ═══ SCENE 3 (15–25s): Names in medallion ═══ */
  drawKhatim(ctx, cx, H * 0.4, 130, progress(t, 15.0, 16.3) * 0.55, gold, t * 0.06);
  drawGoldText(
    ctx,
    data.dulhaName || "Dulha Name",
    cx,
    H * 0.37,
    '700 46px "Playfair Display", serif',
    progress(t, 15.5, 16.5),
    46,
    gold,
    gold2,
    t
  );
  drawFlourish(ctx, cx, H * 0.41, 150, progress(t, 16.5, 17.3), gold);
  drawGoldText(
    ctx,
    data.dulhanName || "Dulhan Name",
    cx,
    H * 0.455,
    '700 46px "Playfair Display", serif',
    progress(t, 17.0, 18.0),
    46,
    gold,
    gold2,
    t
  );
  drawText(
    ctx,
    `D/O ${data.dulhanFather || "Father's Name"}`,
    cx,
    H * 0.495,
    '600 26px "Cormorant Garamond", serif',
    hexToRgba(gold, 0.85),
    progress(t, 18.0, 19.0)
  );

  /* ═══ SCENE 4 (25–30s): Details + closing ═══ */
  drawCardFrame(ctx, W * 0.1, H * 0.58, W * 0.8, H * 0.18, progress(t, 25.0, 26.2), gold, 22);
  const rows4 = [
    [formatDate(data.nikahDate), 25.3, 26.0],
    [formatTime(data.nikahTime), 25.9, 26.6],
    [data.venue || "Venue TBA", 26.5, 27.2],
  ];
  rows4.forEach(([txt, s, e], i) => {
    drawText(
      ctx,
      txt,
      cx,
      H * (0.615 + i * 0.048),
      i === 2 ? '400 26px "Cormorant Garamond", serif' : '400 30px "Cormorant Garamond", serif',
      hexToRgba(textC, 0.92),
      progress(t, s, e)
    );
  });
  drawGoldText(
    ctx,
    "Insha'Allah",
    cx,
    H * 0.8,
    '400 46px "Great Vibes", cursive',
    progress(t, 27.4, 28.4),
    46,
    gold,
    gold2,
    t
  );
  drawText(
    ctx,
    "WE AWAIT YOUR GRACIOUS PRESENCE",
    cx,
    H * 0.84,
    '400 22px "Cormorant Garamond", serif',
    hexToRgba(textC, 0.5),
    progress(t, 28.0, 29.0),
    6
  );

  const fadeOut4 = progress(t, 27.5, 30);
  if (fadeOut4 > 0) {
    ctx.save();
    ctx.globalAlpha = fadeOut4;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
}

/* ═══════════ TEMPLATE 5: Golden Crescent ═══════════ */
function drawVideoFrameTemplate5(ctx, t, data, theme) {
  const W = DESIGN_W;
  const H = DESIGN_H;
  const cx = W / 2;
  const gold = theme.goldPrimary;
  const gold2 = theme.goldSecondary;
  const textC = theme.textColor;

  /* warm night gradient */
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#1A0F3D");
  bg.addColorStop(0.5, "#120A2B");
  bg.addColorStop(1, "#070414");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  /* stars + soft bokeh */
  drawSparkles(ctx, t, W, H * 0.75, "#FFF8DC", 40);
  ctx.save();
  for (let i = 0; i < 8; i++) {
    const bx = (((i * 313) % 100) / 100) * W;
    const by = H * 0.25 + (((i * 197) % 100) / 100) * H * 0.45;
    const br = 18 + (i % 4) * 10;
    const ba = 0.04 + 0.03 * (0.5 + 0.5 * Math.sin(t * 1.2 + i));
    ctx.globalAlpha = ba;
    const bok = ctx.createRadialGradient(bx, by, 2, bx, by, br);
    bok.addColorStop(0, gold);
    bok.addColorStop(1, "transparent");
    ctx.fillStyle = bok;
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  /* BIG crescent centerpiece — slowly floats */
  const moonY = H * 0.3 + Math.sin(t * 0.4) * 12;
  const moonIn = easeOutCubic(progress(t, 0.8, 2.8));
  ctx.save();
  ctx.globalAlpha = moonIn * 0.22;
  const mg = ctx.createRadialGradient(cx, moonY, 40, cx, moonY, 260);
  mg.addColorStop(0, gold);
  mg.addColorStop(1, "transparent");
  ctx.fillStyle = mg;
  ctx.beginPath();
  ctx.arc(cx, moonY, 260, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  drawMoonStar(ctx, cx, moonY, 95, moonIn, gold, -0.3);

  /* lanterns flanking the moon */
  drawLantern(ctx, W * 0.14, H * 0.24, 1.0, progress(t, 2.0, 3.5), gold, t, 0.8);
  drawLantern(ctx, W * 0.86, H * 0.24, 1.0, progress(t, 2.4, 3.9), gold, t, 2.5);

  /* gold border */
  const bA = easeOutCubic(progress(t, 0.3, 1.2));
  ctx.save();
  ctx.globalAlpha = bA * (0.45 + 0.2 * Math.sin(t * 1.5));
  ctx.strokeStyle = gold;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(16, 16, W - 32, H - 32, 20);
  ctx.stroke();
  ctx.restore();

  /* ═══ SCENE 1 (0–5s): Greeting ═══ */
  const [gAr, gEn] = greetingPair(data);
  drawCardFrame(ctx, W * 0.07, H * 0.47, W * 0.86, H * 0.13, progress(t, 1.5, 2.8), gold, 22);
  drawText(ctx, gAr, cx, H * 0.51, '46px "Amiri", serif', hexToRgba(gold, 0.95), progress(t, 1.8, 3.2), 1);
  if (gEn) {
    drawText(
      ctx,
      gEn,
      cx,
      H * 0.56,
      '400 24px "Cormorant Garamond", serif',
      hexToRgba(textC, 0.8),
      progress(t, 2.3, 3.6),
      2
    );
  }
  drawFlourish(ctx, cx, H * 0.62, 240, progress(t, 3.0, 4.0), gold);

  /* ═══ SCENE 2 (5–15s): Bismillah + invitation ═══ */
  drawText(
    ctx,
    "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
    cx,
    H * 0.66,
    '52px "Amiri", serif',
    hexToRgba(gold, 0.9),
    progress(t, 5.5, 6.8)
  );
  drawCardFrame(ctx, W * 0.08, H * 0.7, W * 0.84, H * 0.1, progress(t, 6.0, 7.2), gold, 20);
  drawText(
    ctx,
    "With the blessings of Allah SWT, we joyfully invite you",
    cx,
    H * 0.725,
    '400 28px "Cormorant Garamond", serif',
    hexToRgba(textC, 0.85),
    progress(t, 6.3, 7.3)
  );
  drawText(
    ctx,
    "to celebrate the wedding of",
    cx,
    H * 0.758,
    '400 28px "Cormorant Garamond", serif',
    hexToRgba(textC, 0.85),
    progress(t, 6.6, 7.6)
  );
  drawGoldText(
    ctx,
    `${data.dulhaName || "Groom"} & ${data.dulhanName || "Bride"}`,
    cx,
    H * 0.785,
    '400 40px "Great Vibes", cursive',
    progress(t, 7.5, 9.0),
    40,
    gold,
    gold2,
    t
  );

  /* ═══ SCENE 3 (15–25s): Names ═══ */
  drawCardFrame(ctx, W * 0.1, H * 0.46, W * 0.8, H * 0.16, progress(t, 15.0, 16.3), gold, 22);
  drawGoldText(
    ctx,
    data.dulhaName || "Dulha Name",
    cx,
    H * 0.5,
    '700 44px "Playfair Display", serif',
    progress(t, 15.5, 16.5),
    44,
    gold,
    gold2,
    t
  );
  drawFlourish(ctx, cx, H * 0.535, 160, progress(t, 16.5, 17.3), gold);
  drawGoldText(
    ctx,
    data.dulhanName || "Dulhan Name",
    cx,
    H * 0.578,
    '700 44px "Playfair Display", serif',
    progress(t, 17.0, 18.0),
    44,
    gold,
    gold2,
    t
  );
  drawText(
    ctx,
    `D/O ${data.dulhanFather || "Father's Name"}`,
    cx,
    H * 0.605,
    '600 26px "Cormorant Garamond", serif',
    hexToRgba(gold, 0.85),
    progress(t, 18.0, 19.0)
  );

  /* ═══ SCENE 4 (25–30s): Details + closing ═══ */
  drawCardFrame(ctx, W * 0.1, H * 0.64, W * 0.8, H * 0.17, progress(t, 25.0, 26.2), gold, 22);
  const rows4 = [
    [formatDate(data.nikahDate), 25.3, 26.0],
    [formatTime(data.nikahTime), 25.9, 26.6],
    [data.venue || "Venue TBA", 26.5, 27.2],
  ];
  rows4.forEach(([txt, s, e], i) => {
    drawText(
      ctx,
      txt,
      cx,
      H * (0.675 + i * 0.046),
      i === 2 ? '400 26px "Cormorant Garamond", serif' : '400 30px "Cormorant Garamond", serif',
      hexToRgba(textC, 0.92),
      progress(t, s, e)
    );
  });
  drawGoldText(
    ctx,
    "Insha'Allah",
    cx,
    H * 0.85,
    '400 46px "Great Vibes", cursive',
    progress(t, 27.4, 28.4),
    46,
    gold,
    gold2,
    t
  );
  drawText(
    ctx,
    "WE AWAIT YOUR GRACIOUS PRESENCE",
    cx,
    H * 0.885,
    '400 22px "Cormorant Garamond", serif',
    hexToRgba(textC, 0.5),
    progress(t, 28.0, 29.0),
    6
  );

  const fadeOut5 = progress(t, 27.5, 30);
  if (fadeOut5 > 0) {
    ctx.save();
    ctx.globalAlpha = fadeOut5;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
}

/* ── shared: render one frame to a canvas (used by BOTH preview and export) ── */
const previewParticles = createParticles(20);

export function renderPreviewFrame(canvas, t, data, theme, templateId, assets) {
  const ctx = canvas.getContext("2d", { alpha: false });
  const scaleX = canvas.width / DESIGN_W;
  const scaleY = canvas.height / DESIGN_H;
  ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);
  switch (templateId) {
    case 2:
      if (assets) drawVideoFrameTemplate2(ctx, t, data, theme, assets);
      else drawVideoFrame(ctx, t, data, theme, previewParticles);
      break;
    case 3:
      drawVideoFrameTemplate3(ctx, t, data, theme);
      break;
    case 4:
      drawVideoFrameTemplate4(ctx, t, data, theme);
      break;
    case 5:
      drawVideoFrameTemplate5(ctx, t, data, theme);
      break;
    default:
      drawVideoFrame(ctx, t, data, theme, previewParticles);
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

/* ── public: render + download ── */
export async function renderAndDownloadVideo(data, theme, onProgress, { templateId = 1, themeName = "Royal Red & Gold" } = {}) {
  await loadCanvasFonts();

  let assets = null;
  if (templateId === 2) {
    assets = await loadTemplate2Assets(themeName);
  }

  const canvas = document.createElement("canvas");
  canvas.width = VIDEO_W;
  canvas.height = VIDEO_H;
  const ctx = canvas.getContext("2d", { alpha: false });

  const scaleX = VIDEO_W / DESIGN_W;
  const scaleY = VIDEO_H / DESIGN_H;
  const particles = createParticles(20);

  const drawFrame = (time) => {
    ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);
    switch (templateId) {
      case 2:
        if (assets) drawVideoFrameTemplate2(ctx, time, data, theme, assets);
        else drawVideoFrame(ctx, time, data, theme, particles);
        break;
      case 3:
        drawVideoFrameTemplate3(ctx, time, data, theme);
        break;
      case 4:
        drawVideoFrameTemplate4(ctx, time, data, theme);
        break;
      case 5:
        drawVideoFrameTemplate5(ctx, time, data, theme);
        break;
      default:
        drawVideoFrame(ctx, time, data, theme, particles);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  };

  /* probe one frame to catch draw errors early */
  try {
    drawFrame(0);
  } catch (err) {
    console.error("Frame draw probe failed:", err);
    throw new Error("Canvas draw failed: " + (err?.message || err));
  }

  /* MANUAL frame capture — we control exactly when each frame is recorded */
  const stream = canvas.captureStream(0);
  const track = stream.getVideoTracks()[0];

  const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
    ? "video/webm;codecs=vp9"
    : MediaRecorder.isTypeSupported("video/webm;codecs=vp8")
      ? "video/webm;codecs=vp8"
      : "video/webm";

  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 5_000_000,
  });

  const chunks = [];
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  const fileTagMap = {
    1: "royal-arch",
    2: "couple",
    3: "masjid-nights",
    4: "emerald-geometry",
    5: "golden-crescent",
  };
  const fileTag = fileTagMap[templateId] || "royal-arch";
  const frameInterval = 1000 / VIDEO_FPS; /* ms per frame */

  return new Promise((resolve, reject) => {
    let finished = false;
    let frameIndex = 0;

    const finish = () => {
      if (finished) return;
      finished = true;
      try {
        if (chunks.length === 0) {
          reject(new Error("No video data was captured. Try Chrome/Edge."));
          return;
        }
        const blob = new Blob(chunks, { type: "video/webm" });
        if (blob.size < 1000) {
          reject(new Error("Video file is too small — recording failed."));
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `noor-e-nikah-${fileTag}-${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 8000);
        resolve();
      } catch (err) {
        reject(err);
      }
    };

    recorder.onstop = finish;
    recorder.onerror = (e) => {
      if (!finished) {
        finished = true;
        reject(e.error || new Error("MediaRecorder error"));
      }
    };

    /* safety timeout */
    const safetyTimer = setTimeout(() => {
      if (!finished && recorder.state !== "inactive") {
        try { recorder.requestData(); } catch (_) {}
        try { recorder.stop(); } catch (_) {}
      }
    }, (VIDEO_DURATION + 10) * 1000);

    recorder.start(250);

    const startTime = performance.now();
    let frameErrors = 0;

    const tick = () => {
      if (finished) return;
      try {
        /* virtual time based on frame index — guarantees correct animation timeline */
        const virtualTime = frameIndex / VIDEO_FPS;
        drawFrame(virtualTime);

        /* tell the track a new frame is ready — this is what MediaRecorder captures */
        if (track.requestFrame) {
          track.requestFrame();
        }

        frameIndex++;
        onProgress?.({
          progress: frameIndex / TOTAL_FRAMES,
          frame: frameIndex,
        });

        if (frameIndex >= TOTAL_FRAMES) {
          clearTimeout(safetyTimer);
          try { recorder.requestData(); } catch (_) {}
          try { recorder.stop(); } catch (_) { finish(); }
          return;
        }

        /* pace to real-time: sleep the remainder of the frame interval */
        const targetTime = startTime + frameIndex * frameInterval;
        const delay = Math.max(0, targetTime - performance.now());
        setTimeout(tick, delay);
      } catch (err) {
        frameErrors++;
        console.error("Frame draw error:", err);
        if (frameErrors > 50) {
          clearTimeout(safetyTimer);
          finished = true;
          reject(new Error("Repeated draw errors: " + (err?.message || err)));
          return;
        }
        frameIndex++; /* skip this frame but keep timeline moving */
        if (!finished) setTimeout(tick, 0);
      }
    };

    tick();
  });
}
