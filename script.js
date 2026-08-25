const body = document.body;
const nav = document.querySelector('.nav');
const progress = document.querySelector('.scroll-progress span');
const navLinks = [...document.querySelectorAll('.nav-link')];
const sections = [...document.querySelectorAll('main section[id]')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function updateScrollUI() {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 30);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
}
window.addEventListener('scroll', updateScrollUI, {passive:true});
updateScrollUI();

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, {threshold:.12, rootMargin:'0px 0px -7% 0px'});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const link = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
    if (!link) return;
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
}, {threshold:.35});
sections.forEach(s => sectionObserver.observe(s));

const menuButton = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav nav');
menuButton?.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', open);
});
navLinks.forEach(link => link.addEventListener('click', () => {
  navMenu.classList.remove('open');
  menuButton?.setAttribute('aria-expanded','false');
}));

// Lightweight cursor.
if (window.matchMedia('(pointer:fine)').matches && !reducedMotion) {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let mx = innerWidth/2, my = innerHeight/2, rx = mx, ry = my;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.left = `${mx}px`; dot.style.top = `${my}px`; });
  function cursorLoop() {
    rx += (mx-rx)*.16; ry += (my-ry)*.16;
    ring.style.left = `${rx}px`; ring.style.top = `${ry}px`;
    requestAnimationFrame(cursorLoop);
  }
  cursorLoop();
  document.querySelectorAll('a, button, .project-card, .skill-card, .capability').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
}

// Magnetic buttons, intentionally subtle.
if (window.matchMedia('(pointer:fine)').matches && !reducedMotion) {
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left+r.width/2)) * .08;
      const y = (e.clientY - (r.top+r.height/2)) * .08;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

// Hero parallax.
if (!reducedMotion) {
  const visual = document.querySelector('.hero-visual');
  const image = document.querySelector('.hero-image');
  window.addEventListener('scroll', () => {
    if (window.scrollY > innerHeight * 1.1) return;
    const shift = window.scrollY * .045;
    if (image) image.style.transform = `translateY(${shift}px) scale(1.02)`;
  }, {passive:true});
}

// Project modal.
const modal = document.querySelector('.project-modal');
const modalTitle = document.querySelector('#modal-title');
const modalType = document.querySelector('#modal-type');
const modalDescription = document.querySelector('#modal-description');
const closeModal = () => {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
  body.classList.remove('modal-open');
};
document.querySelectorAll('.project-open').forEach(btn => {
  btn.addEventListener('click', () => {
    modalTitle.textContent = btn.dataset.title || 'Project';
    modalType.textContent = btn.dataset.type || 'PROJECT';
    modalDescription.textContent = btn.dataset.description || '';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    body.classList.add('modal-open');
  });
});
document.querySelector('.modal-close')?.addEventListener('click', closeModal);
document.querySelector('.modal-backdrop')?.addEventListener('click', closeModal);
window.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Keep marquee accessible when reduced motion is enabled.
if (reducedMotion) document.querySelectorAll('.marquee-track').forEach(t => t.style.transform = 'none');
