import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ==========================================================================
   1. Mega-menu — hover en desktop, tap en móvil
   ========================================================================== */

function initMegaMenu() {
  const navItems = document.querySelectorAll('[data-nav-item]');
  const OPEN_DELAY = 0;
  const CLOSE_DELAY = 150; // ms de margen para que el cursor cruce fuera sin cerrar

  navItems.forEach((item) => {
    const link = item.querySelector(':scope > .nav-link');
    let closeTimer = null;

    const open = () => {
      clearTimeout(closeTimer);
      navItems.forEach((other) => {
        if (other !== item) closeNavItem(other);
      });
      item.classList.add('is-open');
      link?.setAttribute('aria-expanded', 'true');
    };

    const scheduleClose = () => {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => closeNavItem(item), CLOSE_DELAY);
    };

    item.addEventListener('mouseenter', open);
    item.addEventListener('mouseleave', scheduleClose);
    item.addEventListener('focusin', open);
    item.addEventListener('focusout', (e) => {
      if (!item.contains(e.relatedTarget)) scheduleClose();
    });
  });

  function closeNavItem(item) {
    item.classList.remove('is-open');
    item.querySelector(':scope > .nav-link')?.setAttribute('aria-expanded', 'false');
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') navItems.forEach(closeNavItem);
  });

  // Marca la sección activa según la ruta actual.
  const path = window.location.pathname;
  navItems.forEach((item) => {
    const link = item.querySelector(':scope > .nav-link');
    const href = link?.getAttribute('href');
    if (href && href !== '/' && path.startsWith(href)) {
      item.classList.add('is-active');
    }
  });
}

/* ==========================================================================
   2. Navegación móvil — panel por toque, misma jerarquía de 2 niveles
   ========================================================================== */

function initMobileNav() {
  const toggle = document.querySelector('[data-mobile-toggle]');
  const panel = document.querySelector('[data-mobile-nav]');
  if (!toggle || !panel) return;

  toggle.addEventListener('click', () => {
    const isOpen = panel.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.querySelectorAll('[data-m-item]').forEach((mItem) => {
    const trigger = mItem.querySelector('.m-item__trigger');
    trigger?.addEventListener('click', () => {
      const isOpen = mItem.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', String(isOpen));
    });
  });
}

/* ==========================================================================
   3. Hero — scroll storytelling con GSAP ScrollTrigger
   El pin usa `position: sticky` (CSS) para máximo rendimiento; ScrollTrigger
   solo mide el progreso de scroll dentro del contenedor y controla las fases.
   ========================================================================== */

function clamp01(v) {
  return Math.min(1, Math.max(0, v));
}

// Fundido con tramo de entrada/salida dentro del rango [start, end] de progreso global.
function phaseOpacity(progress, start, end, { fadeIn = 0.25, fadeOut = 0.25, holdAtEnd = false } = {}) {
  if (progress <= start) return 0;
  if (progress >= end) return holdAtEnd ? 1 : 0;
  const local = (progress - start) / (end - start);
  if (local < fadeIn) return local / fadeIn;
  const fadeOutStart = 1 - fadeOut;
  if (!holdAtEnd && local > fadeOutStart) return (1 - local) / fadeOut;
  return 1;
}

function initHeroScrollStory() {
  const track = document.querySelector('[data-hero-track]');
  if (!track) return;

  const phases = Array.from(track.querySelectorAll('[data-hero-phase]'));
  const dots = Array.from(document.querySelectorAll('[data-hero-progress] .hero-progress__dot'));

  // Rangos de progreso (0–1) por fase: quieta → tijera 1 → tijera 2 → tijera 3 → cierre.
  const ranges = [
    { start: 0, end: 0.14, holdAtEnd: false },
    { start: 0.08, end: 0.34, holdAtEnd: false },
    { start: 0.3, end: 0.56, holdAtEnd: false },
    { start: 0.52, end: 0.78, holdAtEnd: false },
    { start: 0.74, end: 1, holdAtEnd: true },
  ];

  ScrollTrigger.create({
    trigger: track,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.4,
    onUpdate: (self) => {
      const progress = self.progress;
      let activeIndex = 0;
      let maxOpacity = -1;

      phases.forEach((phase, i) => {
        const range = ranges[i];
        const opacity = phaseOpacity(progress, range.start, range.end, {
          holdAtEnd: range.holdAtEnd,
        });
        const copy = phase.querySelector('.hero-phase__copy');
        const figure = phase.querySelector('.hero-phase__figure');

        // La imagen (si la fase tiene una) entra con leve rotación + escala
        // desde fuera de campo; el texto solo funde y se eleva ligeramente.
        if (figure) {
          const localT = clamp01((progress - range.start) / (range.end - range.start || 1));
          const enter = clamp01(localT / 0.25);
          // El contenedor de fase queda siempre visible; el fundido real lo
          // llevan la figura y el texto, para poder animarlos por separado.
          gsap.set(phase, { opacity: 1 });
          gsap.set(figure, {
            opacity,
            scale: 0.86 + 0.14 * enter,
            rotate: -7 * (1 - enter),
            transformOrigin: '50% 50%',
          });
          gsap.set(copy, { opacity, y: (1 - opacity) * 14 });
        } else {
          // Fases sin imagen (marca inicial, cierre): la fase completa funde.
          gsap.set(phase, { opacity, y: (1 - opacity) * 14 });
        }

        if (opacity > maxOpacity) {
          maxOpacity = opacity;
          activeIndex = i;
        }
      });

      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === activeIndex));
    },
  });
}

/* ==========================================================================
   4. Degradación: prefers-reduced-motion y móvil de gama baja/estrecha.
   En ambos casos se sustituye la secuencia con pin por un listado estático
   (sin scroll-jacking); en móvil, además, las tarjetas reciben un fundido
   ligero al entrar en viewport (IntersectionObserver, sin JS de scroll-pin).
   ========================================================================== */

function shouldUseStaticFallback() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const narrowViewport = window.innerWidth < 720;
  return reducedMotion || narrowViewport;
}

function initStaticCardReveal() {
  const cards = document.querySelectorAll('.hero-static__card');
  if (!cards.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    cards.forEach((c) => c.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  cards.forEach((c) => io.observe(c));
}

function initHero() {
  if (shouldUseStaticFallback()) {
    document.body.classList.add('no-scrollstory');
    initStaticCardReveal();
    return;
  }
  initHeroScrollStory();
}

/* ==========================================================================
   Init
   ========================================================================== */

initMegaMenu();
initMobileNav();
initHero();
