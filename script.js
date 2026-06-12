/* ═══════════════════════════════════════════════════════════════
   script.js — Muhammad Saad Ahmed Portfolio
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ────────────────────────────────────────────────────────────────
   0. HELPERS
   ──────────────────────────────────────────────────────────────── */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ────────────────────────────────────────────────────────────────
   1. LOADING SCREEN
   ──────────────────────────────────────────────────────────────── */
(function initLoader() {
  const loader = $('#loader');
  // Lock scroll while loading
  document.body.style.overflow = 'hidden';

  window.addEventListener('load', () => {
    // Match loader-bar animation duration (2 s) + a short buffer
    setTimeout(() => {
      loader.classList.add('gone');
      document.body.style.overflow = '';
      startTypewriter();   // kick off hero typewriter after load
    }, 2300);
  });
})();

/* ────────────────────────────────────────────────────────────────
   2. PARTICLE CANVAS  —  network-graph style
   ──────────────────────────────────────────────────────────────── */
(function initCanvas() {
  const canvas = $('#particle-canvas');
  const ctx    = canvas.getContext('2d');
  const COUNT  = 60;
  const LINK_D = 140;   // max distance for drawing a connection line

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.init(); }
    init() {
      this.x    = Math.random() * W;
      this.y    = Math.random() * H;
      this.vx   = (Math.random() - 0.5) * 0.32;
      this.vy   = (Math.random() - 0.5) * 0.32;
      this.r    = Math.random() * 1.8 + 0.8;
      this.cyan = Math.random() > 0.38;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.cyan
        ? 'rgba(0,255,255,0.65)'
        : 'rgba(255,0,127,0.55)';
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < COUNT; i++) {
      particles[i].update();
      particles[i].draw();
      for (let j = i + 1; j < COUNT; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_D) {
          const a = (1 - dist / LINK_D) * 0.28;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = particles[i].cyan
            ? `rgba(0,255,255,${a})`
            : `rgba(255,0,127,${a * 0.75})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ────────────────────────────────────────────────────────────────
   3. CUSTOM CURSOR
   ──────────────────────────────────────────────────────────────── */
(function initCursor() {
  const ring = $('#cursor-ring');
  const dot  = $('#cursor-dot');
  if (!ring || !dot) return;

  let mX = 0, mY = 0;   // real mouse position
  let rX = 0, rY = 0;   // ring position (lagged)

  document.addEventListener('mousemove', e => {
    mX = e.clientX;
    mY = e.clientY;
    dot.style.left = mX + 'px';
    dot.style.top  = mY + 'px';
  });

  // Smooth ring follow
  (function trackRing() {
    rX += (mX - rX) * 0.10;
    rY += (mY - rY) * 0.10;
    ring.style.left = rX + 'px';
    ring.style.top  = rY + 'px';
    requestAnimationFrame(trackRing);
  })();

  // Hover state
  const hoverEls = 'a, button, input, textarea, .tag, .hex-card, .proj-card, .skill-cat, .cred-card, .c-item';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverEls)) {
      ring.classList.add('hover');
      dot.classList.add('hover');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverEls)) {
      ring.classList.remove('hover');
      dot.classList.remove('hover');
    }
  });
})();

/* ────────────────────────────────────────────────────────────────
   4. NAVIGATION  —  scroll-shrink + active-link + hamburger
   ──────────────────────────────────────────────────────────────── */
(function initNav() {
  const navbar   = $('#navbar');
  const hamburger= $('#hamburger');
  const drawer   = $('#mobile-drawer');
  const navLinks = $$('.nav-link');
  const sections = $$('section[id]');

  /* Scrolled class */
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    highlightNav();
  }, { passive: true });

  /* Active nav highlight */
  function highlightNav() {
    let current = '';
    const offset = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-h')) + 10 || 82;

    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - offset) {
        current = sec.id;
      }
    });

    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  /* Hamburger toggle */
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    drawer.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    drawer.setAttribute('aria-hidden', !open);
  });

  /* Close drawer on link click */
  $$('.drawer-link').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      drawer.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
    });
  });
})();

/* ────────────────────────────────────────────────────────────────
   5. SMOOTH SCROLL  (for all anchor links)
   ──────────────────────────────────────────────────────────────── */
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const target = document.querySelector(a.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  const navH = $('#navbar').offsetHeight;
  const top  = target.getBoundingClientRect().top + window.scrollY - navH;
  window.scrollTo({ top, behavior: 'smooth' });
});

/* ────────────────────────────────────────────────────────────────
   6. SCROLL REVEAL  (IntersectionObserver)
   ──────────────────────────────────────────────────────────────── */
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      // Read stagger delay from inline CSS variable  style="--d:0.1s"
      const rawDelay = entry.target.style.getPropertyValue('--d');
      const delay    = rawDelay ? parseFloat(rawDelay) * 1000 : 0;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -55px 0px' });

  $$('.reveal').forEach(el => observer.observe(el));
})();

/* ────────────────────────────────────────────────────────────────
   7. TYPEWRITER EFFECT  (called after loader resolves)
   ──────────────────────────────────────────────────────────────── */
function startTypewriter() {
  const el = $('#tw-text');
  if (!el) return;

  const phrases = [
    'Cybersecurity Professional',
    'Penetration Tester',
    'Security Researcher',
    'Bug Bounty Hunter',
    'Network Defense Specialist',
    'SIEM Analyst',
    'Vulnerability Assessor',
  ];

  let pIdx      = 0;
  let cIdx      = 0;
  let deleting  = false;
  let delay     = 95;

  function tick() {
    const phrase = phrases[pIdx];
    el.textContent = phrase.substring(0, cIdx);

    if (!deleting) {
      cIdx++;
      delay = 95;
      if (cIdx > phrase.length) { deleting = true; delay = 1800; }
    } else {
      cIdx--;
      delay = 50;
      if (cIdx < 0) {
        deleting = false;
        cIdx     = 0;
        pIdx     = (pIdx + 1) % phrases.length;
        delay    = 450;
      }
    }
    setTimeout(tick, delay);
  }
  tick();
}

/* ────────────────────────────────────────────────────────────────
   8. PROMPT ARG — mirror dns-input into terminal prompt display
   ──────────────────────────────────────────────────────────────── */
(function initPromptMirror() {
  const input = $('#dns-input');
  const arg   = $('#prompt-arg');
  if (!input || !arg) return;

  input.addEventListener('input', () => {
    arg.textContent = input.value.trim() || '_';
  });
})();

/* ────────────────────────────────────────────────────────────────
   9. NETWORK TOOLS  —  DNS / Reverse-IP Lookup
   ──────────────────────────────────────────────────────────────── */
(function initDNSTool() {
  const input    = $('#dns-input');
  const btn      = $('#dns-btn');
  const loading  = $('#dns-loading');
  const errBox   = $('#dns-error');
  const errMsg   = $('#dns-err-msg');
  const result   = $('#dns-result');

  // Result fields
  const rvQuery  = $('#rv-query');
  const rvType   = $('#rv-type');
  const rvAnswer = $('#rv-answer');
  const rvTTL    = $('#rv-ttl');
  const rvTTLRow = $('#rv-ttl-row');
  const rvAll    = $('#rv-all');
  const rvAllRow = $('#rv-all-row');
  const resBadge = $('#res-badge');

  if (!input || !btn) return;

  /* ── Helpers ── */
  function setState(state) {
    loading.classList.add('hidden');
    errBox.classList.add('hidden');
    result.classList.add('hidden');
    if (state === 'loading') loading.classList.remove('hidden');
    if (state === 'error')   errBox.classList.remove('hidden');
    if (state === 'result')  result.classList.remove('hidden');
  }

  function setError(msg) {
    errMsg.textContent = msg;
    setState('error');
  }

  function isIPv4(str) {
    const parts = str.split('.');
    if (parts.length !== 4) return false;
    return parts.every(p => /^\d+$/.test(p) && +p >= 0 && +p <= 255);
  }

  function stripProtocol(raw) {
    return raw
      .trim()
      .replace(/^https?:\/\//i, '')
      .replace(/\/.*$/, '')
      .toLowerCase();
  }

  /* ── Core lookup ── */
  async function lookup() {
    const raw = input.value.trim();
    if (!raw) { setError('Please enter an IP address or domain name.'); return; }

    setState('loading');
    btn.disabled = true;

    try {
      if (isIPv4(raw)) {
        /* ── Reverse DNS: IP → hostname ── */
        const ptr      = raw.split('.').reverse().join('.') + '.in-addr.arpa';
        const url      = `https://dns.google/resolve?name=${encodeURIComponent(ptr)}&type=PTR`;
        const resp     = await fetch(url);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data     = await resp.json();

        rvQuery.textContent = raw;
        rvType.textContent  = 'Reverse DNS (PTR)';
        resBadge.textContent= 'PTR';
        rvAllRow.style.display = 'none';

        if (data.Answer && data.Answer.length) {
          rvAnswer.textContent = data.Answer[0].data.replace(/\.$/, '');
          rvTTL.textContent    = data.Answer[0].TTL + ' s';
          rvTTLRow.style.display = '';
          setState('result');
        } else {
          setError(`No PTR record found for ${raw}. This IP may not have reverse DNS configured.`);
        }

      } else {
        /* ── Forward DNS: domain → IP(s) ── */
        const domain = stripProtocol(raw);
        if (!domain) { setError('Invalid input. Please enter a valid domain or IP.'); return; }

        const url  = `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`;
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();

        rvQuery.textContent = domain;
        rvType.textContent  = 'Forward DNS (A Record)';
        resBadge.textContent= 'A';

        if (data.Answer && data.Answer.length) {
          const aRecs = data.Answer.filter(r => r.type === 1);   // type 1 = A record
          if (!aRecs.length) { setError(`No A records found for "${domain}".`); return; }

          rvAnswer.textContent = aRecs[0].data;
          rvTTL.textContent    = aRecs[0].TTL + ' s';
          rvTTLRow.style.display = '';

          if (aRecs.length > 1) {
            rvAllRow.style.display = '';
            rvAll.textContent = aRecs.map(r => r.data).join('  ·  ');
          } else {
            rvAllRow.style.display = 'none';
          }
          setState('result');

        } else {
          // Map Google's rcode numbers to human-readable messages
          const rcodeMsgs = {
            2: 'DNS server failure (SERVFAIL). Try again.',
            3: `Domain "${domain}" does not exist (NXDOMAIN).`,
            5: 'Query refused by DNS server (REFUSED).',
          };
          const msg = rcodeMsgs[data.Status] || `DNS query failed (rcode ${data.Status}).`;
          setError(msg);
        }
      }
    } catch (err) {
      if (err.name === 'TypeError') {
        setError('Network error — please check your connection and try again.');
      } else {
        setError(`Unexpected error: ${err.message}`);
      }
    } finally {
      btn.disabled = false;
    }
  }

  btn.addEventListener('click', lookup);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') lookup(); });
})();

/* ────────────────────────────────────────────────────────────────
   10. CONTACT FORM  —  AJAX submit to Formspree
   ──────────────────────────────────────────────────────────────── */
(function initContactForm() {
  const form    = $('#contact-form');
  const okMsg   = $('#form-ok');
  const errMsg  = $('#form-err');
  const submitBtn  = $('#form-btn');
  const submitTxt  = $('#form-btn-txt');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Client-side validation
    const name  = $('#f-name').value.trim();
    const email = $('#f-email').value.trim();
    const msg   = $('#f-msg').value.trim();

    if (!name || !email || !msg) {
      errMsg.textContent = '❌ Please fill in all fields before sending.';
      errMsg.classList.remove('hidden');
      okMsg.classList.add('hidden');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errMsg.textContent = '❌ Please enter a valid email address.';
      errMsg.classList.remove('hidden');
      okMsg.classList.add('hidden');
      return;
    }

    // Submit
    submitBtn.disabled = true;
    submitTxt.textContent = 'Sending…';
    okMsg.classList.add('hidden');
    errMsg.classList.add('hidden');

    try {
      const res = await fetch(form.action, {
        method:  'POST',
        body:    new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        okMsg.classList.remove('hidden');
        form.reset();
      } else {
        const body = await res.json().catch(() => ({}));
        const hint = body.errors ? body.errors.map(er => er.message).join(', ') : '';
        errMsg.textContent = hint
          ? `❌ Submission error: ${hint}`
          : '❌ Something went wrong. Please email me directly at shksaad2003@gmail.com';
        errMsg.classList.remove('hidden');
      }
    } catch {
      errMsg.textContent = '❌ Network error. Please try again or email me directly.';
      errMsg.classList.remove('hidden');
    } finally {
      submitBtn.disabled = false;
      submitTxt.textContent = 'Send Message';
    }
  });
})();

/* ────────────────────────────────────────────────────────────────
   11. HERO  —  subtle parallax tilt on hex-grid cards
   ──────────────────────────────────────────────────────────────── */
(function initHexTilt() {
  const cards = $$('.hex-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r   = card.getBoundingClientRect();
      const cx  = r.left + r.width  / 2;
      const cy  = r.top  + r.height / 2;
      const dx  = (e.clientX - cx) / (r.width  / 2);   // -1 to 1
      const dy  = (e.clientY - cy) / (r.height / 2);
      card.style.transform = `translateY(-5px) rotateX(${-dy * 8}deg) rotateY(${dx * 8}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ────────────────────────────────────────────────────────────────
   12. STATS COUNTER  —  animate numbers when About scrolls in
   ──────────────────────────────────────────────────────────────── */
(function initCounters() {
  const stats = $$('.stat-n');
  const seen  = new Set();

  function animateNum(el, target, suffix) {
    if (seen.has(el)) return;
    seen.add(el);
    let cur = 0;
    const step = Math.max(1, Math.floor(target / 40));
    const timer = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = cur + suffix;
      if (cur >= target) clearInterval(timer);
    }, 35);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      stats.forEach(el => {
        const txt = el.textContent.trim();   // e.g. "2+", "4+", "Jr."
        const num = parseInt(txt);
        if (isNaN(num)) return;             // "Jr." — skip
        const suffix = txt.replace(/\d+/, '');
        animateNum(el, num, suffix);
      });
    });
  }, { threshold: 0.5 });

  const section = $('#about');
  if (section) observer.observe(section);
})();

/* ────────────────────────────────────────────────────────────────
   13. PROGRESS BAR  —  animate Vanguard SIEM bar on reveal
   ──────────────────────────────────────────────────────────────── */
(function initProgressBar() {
  const fill = $('.wip-fill');
  if (!fill) return;

  // Store target width, reset to 0 initially
  const target = fill.style.width;   // e.g. "65%"
  fill.style.width = '0%';

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      setTimeout(() => { fill.style.transition = 'width 1.2s cubic-bezier(0.4,0,0.2,1)'; fill.style.width = target; }, 200);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  observer.observe(fill.closest('.proj-card') || fill);
})();

/* ────────────────────────────────────────────────────────────────
   END OF SCRIPT
   ──────────────────────────────────────────────────────────────── */
