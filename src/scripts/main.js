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
   3. Hero — bloque de texto puro (sin imágenes de producto). Entrada suave
   al cargar la página; respeta prefers-reduced-motion mostrando el
   contenido ya asentado, sin animación.
   ========================================================================== */

function initHero() {
  const inner = document.querySelector('[data-hero-reveal]');
  if (!inner) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    inner.classList.add('is-visible');
    return;
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => inner.classList.add('is-visible'));
  });
}

/* ==========================================================================
   4. Carrusel de producto — MaloShop, bucle horizontal con inercia.
   Flujo constante hacia la izquierda; se interrumpe al arrastrar (mouse o
   touch) y, al soltar, la velocidad decae por fricción hasta volver al
   flujo de crucero en vez de detenerse en seco ("sigue flotando").
   Con prefers-reduced-motion se sustituye por scroll horizontal normal.
   ========================================================================== */

function initProductCarousel() {
  const viewport = document.querySelector('[data-carousel]');
  const track = document.querySelector('[data-carousel-track]');
  if (!viewport || !track) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    viewport.classList.add('is-static-scroll');
    return;
  }

  // Duplica los items una sola vez para el bucle sin costura.
  const originalItems = Array.from(track.children);
  originalItems.forEach((item) => {
    const clone = item.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });

  const AUTO_SPEED = -0.045; // px/ms — flujo de crucero constante
  let x = 0;
  let velocity = AUTO_SPEED;
  let dragging = false;
  let lastPointerX = 0;
  let lastTime = performance.now();
  let halfWidth = track.scrollWidth / 2;

  window.addEventListener('resize', () => {
    halfWidth = track.scrollWidth / 2;
  });

  function wrap(value) {
    if (halfWidth <= 0) return value;
    let v = value % halfWidth;
    if (v > 0) v -= halfWidth;
    return v;
  }

  function apply() {
    track.style.transform = `translate3d(${x}px, 0, 0)`;
  }

  function frame(now) {
    const dt = Math.min(48, now - lastTime);
    lastTime = now;

    if (!dragging) {
      // Fricción hacia la velocidad de crucero: flota tras soltar, no frena en seco.
      velocity += (AUTO_SPEED - velocity) * Math.min(1, dt / 600);
      x = wrap(x + velocity * dt);
      apply();
    }
    requestAnimationFrame(frame);
  }

  viewport.addEventListener('pointerdown', (e) => {
    dragging = true;
    lastPointerX = e.clientX;
    lastTime = performance.now();
    viewport.setPointerCapture(e.pointerId);
    viewport.classList.add('is-dragging');
  });

  viewport.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const now = performance.now();
    const dx = e.clientX - lastPointerX;
    const dt = Math.max(1, now - lastTime);
    velocity = dx / dt;
    x = wrap(x + dx);
    lastPointerX = e.clientX;
    lastTime = now;
    apply();
  });

  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false;
    viewport.classList.remove('is-dragging');
    if (e && viewport.hasPointerCapture?.(e.pointerId)) {
      viewport.releasePointerCapture(e.pointerId);
    }
  };
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);
  viewport.addEventListener('pointerleave', endDrag);

  lastTime = performance.now();
  requestAnimationFrame(frame);
}

/* ==========================================================================
   Init
   ========================================================================== */

initMegaMenu();
initMobileNav();
initHero();
initProductCarousel();
