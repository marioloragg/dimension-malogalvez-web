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

// Copy por fase — debe reflejar el contenido inicial ya presente en el HTML
// para la fase 1; se usa para actualizar la ficha al cambiar de fase activa.
const HERO_PHASES = [
  {
    index: '01 / Filo convexo',
    headline: 'El filo que no arrastra, diagnostica',
    sub: 'Acero cobalto, filo convexo, mango offset: cero margen de error.',
  },
  {
    index: '02 / Acero damasco',
    headline: 'Cada veta de acero, una decisión',
    sub: 'Damasco grafito para el pelo grueso que exige criterio.',
  },
  {
    index: '03 / Hoja angulada',
    headline: 'El degradado empieza en el diagnóstico',
    sub: 'Hoja angulada para la piel de alta fidelidad.',
  },
];

function initHeroScrollStory() {
  const track = document.querySelector('[data-hero-track]');
  if (!track) return;

  const figures = Array.from(track.querySelectorAll('.hero-right__frame [data-hero-figure]'));
  const indexEl = track.querySelector('[data-hero-index]');
  const headlineEl = track.querySelector('[data-hero-headline]');
  const subEl = track.querySelector('[data-hero-sub]');
  const countEl = track.querySelector('[data-hero-count]');
  if (!figures.length) return;

  // Rangos de progreso (0–1) por tijera, con solape para el fundido cruzado.
  const ranges = [
    { start: 0, end: 0.36, holdAtEnd: false },
    { start: 0.3, end: 0.7, holdAtEnd: false },
    { start: 0.64, end: 1, holdAtEnd: true },
  ];

  let activeIndex = -1;

  const setActive = (i) => {
    if (i === activeIndex) return;
    activeIndex = i;
    const phase = HERO_PHASES[i];
    if (indexEl) indexEl.textContent = phase.index;
    if (headlineEl) headlineEl.textContent = phase.headline;
    if (subEl) subEl.textContent = phase.sub;
    if (countEl) countEl.textContent = String(i + 1).padStart(2, '0');
  };

  ScrollTrigger.create({
    trigger: track,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.4,
    onUpdate: (self) => {
      const progress = self.progress;
      let bestIndex = 0;
      let maxOpacity = -1;

      figures.forEach((figure, i) => {
        const range = ranges[i];
        const opacity = phaseOpacity(progress, range.start, range.end, {
          holdAtEnd: range.holdAtEnd,
        });
        // Entrada estilo Apple: la tijera aparece con un leve zoom + rotación
        // en vez de un simple fundido — efecto pedido desde el brief original.
        const localT = clamp01((progress - range.start) / (range.end - range.start || 1));
        const enter = clamp01(localT / 0.25);
        gsap.set(figure, {
          opacity,
          scale: 0.88 + 0.12 * enter,
          rotate: -6 * (1 - enter),
          transformOrigin: '50% 50%',
        });

        if (opacity > maxOpacity) {
          maxOpacity = opacity;
          bestIndex = i;
        }
      });

      setActive(bestIndex);
    },
  });

  setActive(0);
}

/* ==========================================================================
   4. Degradación: prefers-reduced-motion y móvil de gama baja/estrecha.
   En ambos casos se sustituye la secuencia con pin por un listado estático
   (sin scroll-jacking); en móvil, además, las tarjetas reciben un fundido
   ligero al entrar en viewport (IntersectionObserver, sin JS de scroll-pin).
   ========================================================================== */

function shouldUseStaticFallback() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const narrowViewport = window.innerWidth < 760;
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
