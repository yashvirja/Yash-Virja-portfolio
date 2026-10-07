/* =========================================================
   YASH VIRJA — PORTFOLIO | script.js
   ========================================================= */

'use strict';

/* ─── Custom Cursor ─────────────────────────────────────── */
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .skill-pill, .stat-card, .timeline-card, .exp-card, .contact-link').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* ─── Particle Canvas ───────────────────────────────────── */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const PARTICLE_COUNT = 90;

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(true); }

  reset(initial = false) {
    this.x = Math.random() * canvas.width;
    this.y = initial ? Math.random() * canvas.height : canvas.height + 10;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = -(Math.random() * 0.4 + 0.1);
    this.r = Math.random() * 1.8 + 0.5;
    this.opacity = Math.random() * 0.6 + 0.1;
    this.life = 0;
    this.maxLife = Math.random() * 400 + 200;
    this.hue = Math.random() > 0.5 ? 192 : 220; // cyan or blue
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life += 1;
    if (this.life > this.maxLife || this.y < -10) this.reset();
  }

  draw() {
    const fade = this.life < 60 ? this.life / 60 : this.life > this.maxLife - 60 ? (this.maxLife - this.life) / 60 : 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue}, 100%, 65%, ${this.opacity * fade})`;
    ctx.fill();
  }
}

// Connection lines
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0, 212, 255, ${(1 - dist / 100) * 0.06})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawConnections();
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// Mouse parallax on canvas
let mx = 0, my = 0;
canvas.addEventListener('mousemove', e => {
  mx = (e.clientX / canvas.width - 0.5) * 2;
  my = (e.clientY / canvas.height - 0.5) * 2;
});

/* ─── Typing Effect ─────────────────────────────────────── */
const typedEl = document.getElementById('typed-text');
const phrases = [
  'Computer Engineering Student',
  'Frontend Developer',
  'C++ Programmer',
  'Tech Enthusiast',
  'Arduino Tinkerer',
  'Problem Solver',
  'Chess Player ♟️',
];
let phraseIdx = 0, charIdx = 0, isDeleting = false;

function typeLoop() {
  const phrase = phrases[phraseIdx];
  if (isDeleting) {
    typedEl.textContent = phrase.substring(0, charIdx - 1);
    charIdx--;
  } else {
    typedEl.textContent = phrase.substring(0, charIdx + 1);
    charIdx++;
  }

  let delay = isDeleting ? 45 : 90;

  if (!isDeleting && charIdx === phrase.length) {
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    delay = 400;
  }

  setTimeout(typeLoop, delay);
}
typeLoop();

/* ─── Navbar ────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelector('.nav-links');
const hamburger = document.querySelector('.hamburger');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  updateActiveNav();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

function updateActiveNav() {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

/* ─── Scroll Reveal ─────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el, i) => {
  if (!el.dataset.delay) el.dataset.delay = (i % 4) * 80;
  revealObserver.observe(el);
});

/* ─── Counter Animation ─────────────────────────────────── */
function animateCounter(el, target, duration = 1500) {
  const start = performance.now();
  const isDecimal = target % 1 !== 0;
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = isDecimal
      ? (eased * target).toFixed(1)
      : Math.round(eased * target) + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

/* ─── Contact Form — Web3Forms ──────────────────────────── */
const WEB3FORMS_KEY = '3a68216c-7d8a-48ff-85d0-d63997dfaea4';

const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('contact-submit-btn');
const formStatus = document.getElementById('form-status');

// Add spin keyframe
const spinStyle = document.createElement('style');
spinStyle.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(spinStyle);

const spinnerSVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
  style="animation:spin 0.75s linear infinite;display:inline-block;vertical-align:middle;margin-right:6px;">
  <circle cx="12" cy="12" r="10" stroke-opacity="0.2"/>
  <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
</svg>`;

function setFormStatus(type, msg) {
  formStatus.textContent = msg;
  formStatus.className = 'form-status-msg form-status-' + type;
}

function setBtnLoading(loading) {
  submitBtn.disabled = loading;
  submitBtn.innerHTML = loading
    ? spinnerSVG + 'Sending…'
    : `<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg> Send Message`;
}

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous status
    formStatus.className = '';
    formStatus.textContent = '';

    // Grab values
    const name = document.getElementById('cf-name').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const message = document.getElementById('cf-message').value.trim();

    // Basic validation
    if (!name || !email || !message) {
      setFormStatus('error', '⚠️ Please fill in all fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormStatus('error', '⚠️ Please enter a valid email address.');
      return;
    }

    setBtnLoading(true);

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name,
          email,
          message,
          subject: `Portfolio Contact from ${name}`,
          from_name: 'Yash Virja Portfolio',
          botcheck: '',
        }),
      });
      const data = await res.json();

      if (data.success) {
        setFormStatus('success', '✅ Message sent! I\'ll get back to you soon 🙌');
        contactForm.reset();
      } else {
        setFormStatus('error', '❌ ' + (data.message || 'Something went wrong. Please try again.'));
      }
    } catch (err) {
      setFormStatus('error', '❌ Network error. Please check your connection and try again.');
    } finally {
      setBtnLoading(false);
      setTimeout(() => {
        formStatus.className = '';
        formStatus.textContent = '';
      }, 7000);
    }
  });
}

/* ─── Smooth scroll for buttons ─────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
