/* =====================================================
   PASTE YOUR VIETNAMESE MESSAGE HERE.
   Use \n for a line break / new paragraph.
   ===================================================== */
const MESSAGE_TEXT = `Gửi em,

Đây là nơi anh muốn viết những điều anh chưa nói hết...

(dán tin nhắn của anh vào đây)`;

/* ===================== Screens ===================== */
const envelope = document.getElementById('envelope');
const envelopeScreen = document.getElementById('envelope-screen');
const lockScreen = document.getElementById('lock-screen');
const letterScreen = document.getElementById('letter-screen');
const galleryScreen = document.getElementById('gallery-screen');
const closingScreen = document.getElementById('closing-screen');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const lockBtns = document.getElementById('lock-btns');

const typewriterEl = document.getElementById('typewriter-text');
const cursorEl = document.getElementById('cursor');
const continueBtn = document.getElementById('continue-btn');
const closeLetterBtn = document.getElementById('close-letter-btn');
const toClosingBtn = document.getElementById('to-closing-btn');

function showScreen(el) {
  el.classList.remove('hidden-section');
  el.style.display = 'flex';
  requestAnimationFrame(() => { el.style.opacity = '1'; });
}

function hideScreen(el) {
  el.style.opacity = '0';
  setTimeout(() => {
    el.style.display = 'none';
    el.classList.add('hidden-section');
  }, 700);
}

/* ===================== Music ===================== */
const music = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
const musicIcon = document.getElementById('music-icon');
let musicStarted = false;

function tryStartMusic() {
  if (musicStarted) return;
  music.volume = 0.6;
  music.play().then(() => { musicStarted = true; }).catch(() => {});
}

musicToggle.addEventListener('click', () => {
  if (music.paused) {
    music.play();
    musicToggle.classList.remove('muted');
    musicIcon.textContent = '♪';
  } else {
    music.pause();
    musicToggle.classList.add('muted');
    musicIcon.textContent = '✕';
  }
});

/* ===================== Envelope open ===================== */
envelope.addEventListener('click', () => {
  if (envelope.classList.contains('opened')) return;
  envelope.classList.add('opened');
  tryStartMusic();
  setTimeout(() => {
    hideScreen(envelopeScreen);
    showScreen(lockScreen);
  }, 900);
});

/* ===================== Lock question (dodging "No") ===================== */
function distance(x1, y1, x2, y2) {
  return Math.hypot(x1 - x2, y1 - y2);
}

function dodgeNoBtnNear() {
  const containerRect = lockBtns.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();
  const yesRect = yesBtn.getBoundingClientRect();
  const maxX = Math.max(0, containerRect.width - btnRect.width);
  const maxY = Math.max(0, containerRect.height - btnRect.height);
  const prevX = btnRect.left - containerRect.left;
  const prevY = btnRect.top - containerRect.top;
  const yesX = yesRect.left - containerRect.left + yesRect.width / 2;
  const yesY = yesRect.top - containerRect.top + yesRect.height / 2;
  const minJump = Math.max(maxX, maxY) * 0.5;

  let newX, newY, attempts = 0;
  do {
    newX = Math.random() * maxX;
    newY = Math.random() * maxY;
    attempts++;
  } while (
    attempts < 25 &&
    (distance(newX, newY, prevX, prevY) < minJump ||
     distance(newX + btnRect.width / 2, newY + btnRect.height / 2, yesX, yesY) < 90)
  );

  noBtn.style.transition = 'left 0.12s ease, top 0.12s ease';
  noBtn.style.position = 'absolute';
  noBtn.style.left = newX + 'px';
  noBtn.style.top = newY + 'px';
}

// On touch (iPhone), send it far across the whole screen — never near its last spot,
// and never overlapping the "Yes" button
function dodgeNoBtnFar() {
  const margin = 24;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const btnRect = noBtn.getBoundingClientRect();
  const yesRect = yesBtn.getBoundingClientRect();
  const prevX = btnRect.left;
  const prevY = btnRect.top;
  const yesCenterX = yesRect.left + yesRect.width / 2;
  const yesCenterY = yesRect.top + yesRect.height / 2;
  const minJump = Math.min(vw, vh) * 0.5; // must land far from where it just was
  const minDistFromYes = 160; // must never land on/near the Yes button

  let newX, newY, attempts = 0;
  do {
    newX = margin + Math.random() * (vw - btnRect.width - margin * 2);
    newY = margin + Math.random() * (vh - btnRect.height - margin * 2);
    attempts++;
  } while (
    attempts < 30 &&
    (distance(newX, newY, prevX, prevY) < minJump ||
     distance(newX + btnRect.width / 2, newY + btnRect.height / 2, yesCenterX, yesCenterY) < minDistFromYes)
  );

  noBtn.style.transition = 'left 0.12s ease, top 0.12s ease';
  noBtn.style.position = 'fixed';
  noBtn.style.zIndex = '45';
  noBtn.style.left = newX + 'px';
  noBtn.style.top = newY + 'px';
}

noBtn.addEventListener('mouseenter', dodgeNoBtnNear);
noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); dodgeNoBtnFar(); }, { passive: false });
noBtn.addEventListener('click', (e) => { e.preventDefault(); dodgeNoBtnNear(); });

yesBtn.addEventListener('click', () => {
  hideScreen(lockScreen);
  showScreen(letterScreen);
  startTypewriter();
});

/* ===================== Typewriter ===================== */
function startTypewriter() {
  let i = 0;
  typewriterEl.textContent = '';
  continueBtn.style.display = 'none';
  cursorEl.style.display = 'inline-block';
  const speed = 38; // ms per character — adjust for pacing
  function type() {
    if (i < MESSAGE_TEXT.length) {
      typewriterEl.textContent += MESSAGE_TEXT.charAt(i);
      i++;
      setTimeout(type, speed);
    } else {
      cursorEl.style.display = 'none';
      continueBtn.style.display = 'inline-block';
    }
  }
  type();
}

continueBtn.addEventListener('click', () => {
  hideScreen(letterScreen);
  showScreen(galleryScreen);
});

/* Close the last message and animate the envelope shut again (music keeps playing) */
closeLetterBtn.addEventListener('click', () => {
  hideScreen(closingScreen);
  setTimeout(() => {
    showScreen(envelopeScreen);
    setTimeout(() => {
      envelope.classList.remove('opened');
    }, 150);
  }, 700);
});

toClosingBtn.addEventListener('click', () => {
  hideScreen(galleryScreen);
  showScreen(closingScreen);
});

/* ===================== Gallery reveal ===================== */
const photoCards = document.querySelectorAll('.photo-card');
document.querySelectorAll('.photo-card').forEach(card => {
  card.addEventListener('click', () => {
    if (card.classList.contains('revealed')) return;
    card.classList.add('revealed');
    const rect = card.getBoundingClientRect();
    burstHearts(rect.left + rect.width / 2, rect.top + rect.height / 2, 10);

    const allRevealed = document.querySelectorAll('.photo-card.revealed').length === photoCards.length;
    if (allRevealed) {
      toClosingBtn.style.display = 'inline-block';
    }
  });
});

/* ===================== Hearts canvas ===================== */
const canvas = document.getElementById('hearts-canvas');
const ctx = canvas.getContext('2d');
let W, H;
function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
window.addEventListener('resize', resize);
resize();

let particles = [];

function makeHeart(x, y, opts = {}) {
  return {
    x, y,
    vx: opts.vx ?? (Math.random() - 0.5) * 1.2,
    vy: opts.vy ?? (Math.random() * -2 - 1),
    size: opts.size ?? (10 + Math.random() * 10),
    life: 0,
    maxLife: opts.maxLife ?? (100 + Math.random() * 60),
    ambient: opts.ambient ?? false,
    rotation: Math.random() * Math.PI,
    color: opts.color ?? `hsl(${340 + Math.random() * 20}, 70%, ${70 + Math.random() * 15}%)`
  };
}

function drawHeart(p) {
  const { x, y, size, rotation, life, maxLife, ambient } = p;
  const alpha = ambient ? 0.55 : Math.max(0, 1 - life / maxLife);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = p.color;
  ctx.beginPath();
  const s = size / 2;
  ctx.moveTo(0, s * 0.3);
  ctx.bezierCurveTo(-s, -s * 0.6, -s * 1.6, s * 0.5, 0, s * 1.5);
  ctx.bezierCurveTo(s * 1.6, s * 0.5, s, -s * 0.6, 0, s * 0.3);
  ctx.fill();
  ctx.restore();
}

function burstHearts(x, y, count = 8) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const speed = 1.5 + Math.random() * 2.5;
    particles.push(makeHeart(x, y, {
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.5,
      maxLife: 70 + Math.random() * 30
    }));
  }
}

// Ambient gentle hearts, spawned periodically
let ambientEnabled = true;
setInterval(() => {
  if (!ambientEnabled) return;
  particles.push(makeHeart(Math.random() * W, H + 20, {
    vx: (Math.random() - 0.5) * 0.6,
    vy: -(0.6 + Math.random() * 0.8),
    size: 8 + Math.random() * 14,
    maxLife: 500,
    ambient: true
  }));
}, 700);

function animate() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    if (!p.ambient) p.vy += 0.04; // gravity for burst hearts
    p.life++;
    drawHeart(p);
  });
  particles = particles.filter(p => p.life < p.maxLife && p.y > -40 && p.y < H + 60);
  requestAnimationFrame(animate);
}
animate();

// Tap anywhere on closing screen for extra hearts
closingScreen.addEventListener('click', (e) => {
  burstHearts(e.clientX, e.clientY, 14);
});
closingScreen.addEventListener('touchstart', (e) => {
  const t = e.touches[0];
  burstHearts(t.clientX, t.clientY, 14);
}, { passive: true });
