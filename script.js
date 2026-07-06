'use strict';

/* ──────────────────────────────────────────────────
   1. TYPEWRITER — cicla frases no hero
────────────────────────────────────────────────── */
const phrases = [
  '"Cloud Computing | DevOps | Infraestrutura como Código."',
  '"Do ambiente corporativo à nuvem Azure."',
  '"Automação, resiliência e entrega contínua."',
  '"Construindo a ponte entre código e nuvem."',
];

let phraseIdx = 0, charIdx = 0, deleting = false;
const typeEl  = document.getElementById('typewriter');

function type() {
  if (!typeEl) return;
  const current = phrases[phraseIdx];
  typeEl.textContent = deleting
    ? current.substring(0, charIdx - 1)
    : current.substring(0, charIdx + 1);

  deleting ? charIdx-- : charIdx++;

  let delay = deleting ? 35 : 75;
  if (!deleting && charIdx === current.length) { delay = 2200; deleting = true; }
  else if (deleting && charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; delay = 400; }

  setTimeout(type, delay);
}
type();


/* ──────────────────────────────────────────────────
   2. NAV SHADOW — sombra ao rolar
────────────────────────────────────────────────── */
const nav = document.getElementById('navBar');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });


/* ──────────────────────────────────────────────────
   3. SCROLL REVEAL — fade-in ao entrar no viewport
────────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 65);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ──────────────────────────────────────────────────
   4. CONTADOR ANIMADO — incrementa com easing
────────────────────────────────────────────────── */
function animateCount(el, target, duration = 1200) {
  const start = performance.now();
  (function update(now) {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
    if (p < 1) requestAnimationFrame(update);
    else el.classList.add('counted');
  })(start);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      animateCount(el, parseInt(el.dataset.target, 10));
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-n[data-target]').forEach(el => counterObserver.observe(el));


/* ──────────────────────────────────────────────────
   5. ACTIVE NAV — destaca seção visível
────────────────────────────────────────────────── */
const navItems = document.querySelectorAll('#navLinks a');

new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navItems.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' })
.observe && document.querySelectorAll('section[id], footer[id]')
  .forEach(s => new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting)
        navItems.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${e.target.id}`));
    });
  }, { rootMargin: '-40% 0px -55% 0px' }).observe(s));


/* ──────────────────────────────────────────────────
   6. BACK TO TOP — aparece após 400px de scroll
────────────────────────────────────────────────── */
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
  backTop?.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


/* ──────────────────────────────────────────────────
   7. GITHUB API — atualiza contagem de repos em tempo real
   Conecta ao README principal do perfil MatheusSSiqueira
────────────────────────────────────────────────── */
const repoEl = document.querySelector('.stat-n[data-key="repos"]');

if (repoEl) {
  fetch('https://api.github.com/users/MatheusSSiqueira')
    .then(r => r.ok ? r.json() : null)
    .then(data => {
      if (!data) return;
      const real = data.public_repos;
      repoEl.dataset.target = real;
      // Se o contador já rodou, atualiza direto
      if (repoEl.classList.contains('counted')) repoEl.textContent = real;
    })
    .catch(() => {}); // falha silenciosa — mantém valor padrão
}