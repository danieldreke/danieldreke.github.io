// ── Accent hue (color effect) ──
function accentLuminance(h) {
  const s = 1, l = 0.6;
  const a = s * Math.min(l, 1 - l);
  const f = n => { const k = (n + h/30) % 12; return l - a * Math.max(-1, Math.min(k-3, 9-k, 1)); };
  const lin = c => c <= 0.04045 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4);
  return 0.2126*lin(f(0)) + 0.7152*lin(f(8)) + 0.0722*lin(f(4));
}

let hue = 210, lastX = null, lastY = null;
const autoSpeed = 0.08;

function applyHue() {
  hue = (hue + autoSpeed) % 360;
  document.documentElement.style.setProperty('--hue', Math.round(hue));
  document.body.classList.toggle('bright-accent', accentLuminance(hue) > 0.18);
  requestAnimationFrame(applyHue);
}
requestAnimationFrame(applyHue);

function handleMove(x, y) {
  if (lastX === null) { lastX = x; lastY = y; return; }
  const dist = Math.sqrt((x - lastX) ** 2 + (y - lastY) ** 2);
  hue = (hue + dist * 0.1) % 360;
  lastX = x; lastY = y;
}

document.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));

document.addEventListener('touchmove', (e) => {
  const t = e.touches[0];
  handleMove(t.clientX, t.clientY);
}, { passive: true });

let lastScroll = window.scrollY;
window.addEventListener('scroll', () => {
  const delta = Math.abs(window.scrollY - lastScroll);
  hue = (hue + delta * 0.2) % 360;
  lastScroll = window.scrollY;
}, { passive: true });

document.addEventListener('touchstart', (e) => {
  const t = e.touches[0];
  lastX = t.clientX; lastY = t.clientY;
  if (!e.target.closest('.card')) {
    document.querySelectorAll('.card.active').forEach(c => c.classList.remove('active'));
  }
}, { passive: true });

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('touchstart', () => {
    document.querySelectorAll('.card.active').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
  }, { passive: true });
});

// ── Star field ──
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let W, H;

function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
window.addEventListener('resize', resize);
resize();

const layers = [
  Array.from({length: 320}, () => ({
    x: Math.random(), y: Math.random(),
    r: 0.8 + Math.random() * 0.6,
    base: 0.12 + Math.random() * 0.22,
    swing: 0.06 + Math.random() * 0.10,
    spd: 0.04 + Math.random() * 0.12,
    phase: Math.random() * Math.PI * 2,
  })),
  Array.from({length: 100}, (_, i) => ({
    x: Math.random(), y: Math.random(),
    r: i < 6 ? 1.4 + Math.random() * 0.8 : 0.8 + Math.random() * 0.5,
    base: i < 6 ? 0.55 + Math.random() * 0.30 : 0.22 + Math.random() * 0.22,
    swing: i < 6 ? 0.20 : 0.10,
    spd: 0.03 + Math.random() * 0.08,
    phase: Math.random() * Math.PI * 2,
  })),
];
const DRIFT = [10, 20];

let driftOffset = 0;

function draw(t) {
  driftOffset += 0.015;
  ctx.clearRect(0, 0, W, H);
  layers.forEach((stars, li) => {
    const ox = -(driftOffset * DRIFT[li]);
    for (const s of stars) {
      const alpha = s.base + s.swing * Math.abs(Math.sin(t * s.spd * 0.0001 + s.phase));
      const x = ((s.x * W + ox) % W + W) % W;
      ctx.beginPath();
      ctx.arc(x, s.y * H, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(230,240,255,${alpha})`;
      ctx.fill();
    }
  });
  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);
