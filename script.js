'use strict';

/* ═══════════════════════════════════════════════════════
   1. TYPEWRITER — cicla frases no hero
   Escreve, pausa, apaga e passa para a próxima frase.
═══════════════════════════════════════════════════════ */
const phrases = [
  '"Cloud Computing | DevOps | Infraestrutura como Código."',
  '"Do ambiente corporativo à nuvem Azure."',
  '"Automação, resiliência e entrega contínua."',
  '"Construindo a ponte entre código e nuvem."',
];

let phraseIdx = 0;
let charIdx   = 0;
let deleting  = false;
const typeEl  = document.getElementById('typewriter');

function type() {
  if (!typeEl) return;

  const current = phrases[phraseIdx];

  if (deleting) {
    typeEl.textContent = current.substring(0, charIdx - 1);
    charIdx--;
  } else {
    typeEl.textContent = current.substring(0, charIdx + 1);
    charIdx++;
  }

  let delay = deleting ? 35 : 75;

  if (!deleting && charIdx === current.length) {
    delay    = 2200;   // pausa antes de apagar
    deleting = true;
  } else if (deleting && charIdx === 0) {
    deleting  = false;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    delay     = 450;
  }

  setTimeout(type, delay);
}

type();


/* ═══════════════════════════════════════════════════════
   2. MOBILE BURGER — abre/fecha menu em telas pequenas
═══════════════════════════════════════════════════════ */
const burger   = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

if (burger && navLinks) {
  burger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    burger.classList.toggle('active', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  // Fecha ao clicar em um link (UX mobile)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
}


/* ═══════════════════════════════════════════════════════
   3. NAV SHADOW — sombra ao rolar a página
═══════════════════════════════════════════════════════ */
const navBar = document.querySelector('.nav-bar');

window.addEventListener('scroll', () => {
  if (navBar) navBar.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });


/* ═══════════════════════════════════════════════════════
   4. SCROLL REVEAL — anima elementos ao entrar no viewport
   Adicione class="reveal" a qualquer elemento no HTML.
═══════════════════════════════════════════════════════ */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger leve: cada elemento atrasa um pouco mais que o anterior
      setTimeout(() => entry.target.classList.add('visible'), i * 70);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => revealObserver.observe(el));


/* ═══════════════════════════════════════════════════════
   5. CONTADOR ANIMADO — incrementa números ao entrar no viewport
   Use data-target="N" no elemento <span class="stat-n">.
═══════════════════════════════════════════════════════ */
function animateCount(el, target, duration = 1300) {
  const start = performance.now();

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cúbico
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const counters = document.querySelectorAll('.stat-n[data-target]');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el     = entry.target;
      const target = parseInt(el.getAttribute('data-target'), 10);
      animateCount(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

counters.forEach(el => counterObserver.observe(el));


/* ═══════════════════════════════════════════════════════
   6. ACTIVE NAV — destaca o link da seção visível
═══════════════════════════════════════════════════════ */
const sections = document.querySelectorAll('section[id], aside[id]');
const navItems = document.querySelectorAll('#navLinks a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navItems.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));


/* ═══════════════════════════════════════════════════════
   7. BACK TO TOP — botão aparece após 400px de scroll
═══════════════════════════════════════════════════════ */
const backTop = document.getElementById('backTop');

window.addEventListener('scroll', () => {
  if (backTop) backTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

if (backTop) {
  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ═══════════════════════════════════════════════════════
   8. GITHUB API — busca contagem real de repositórios
   Atualiza o contador com data-key="repos" em tempo real.
   Falha silenciosamente se a API estiver com rate limit.
═══════════════════════════════════════════════════════ */
const repoEl = document.querySelector('.stat-n[data-key="repos"]');

if (repoEl) {
  fetch('https://api.github.com/users/MatheusSSiqueira')
    .then(res => res.ok ? res.json() : null)
    .then(data => {
      if (data && data.public_repos !== undefined) {
        repoEl.setAttribute('data-target', data.public_repos);
        // Re-anima com o valor real (se o elemento já foi animado, atualiza direto)
        if (repoEl.classList.contains('counted')) {
          repoEl.textContent = data.public_repos;
        }
      }
    })
    .catch(() => { /* falha silenciosa */ });
}