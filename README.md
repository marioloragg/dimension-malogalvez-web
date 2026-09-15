# Dimension by Malo Gálvez

Portada de la web de Malo Gálvez (Arquitectura Capilar) y Ameba by Malo
Gálvez (MaloShop). Vite + JS vanilla, sin dependencia de framework, con GSAP
ScrollTrigger para el hero de scroll storytelling.

## Desarrollo

```bash
npm install
npm run dev      # servidor local con recarga en caliente
npm run build    # build de producción en dist/
```

## Estructura

```
index.html                   Menú + hero + accesos principales
src/styles/main.css           Tokens de marca, mega-menú, hero
src/scripts/main.js           Mega-menú (hover/tap), scroll storytelling
src/assets/scissors/          Placeholders de las 3 tijeras (a sustituir)
docs/hero-y-menu-entrega.md   Copy, especificación de assets, notas de degradación
```

Ver `docs/hero-y-menu-entrega.md` para el detalle de copy, especificación de
fotografía y notas de accesibilidad/rendimiento.

## Sistema de diagnóstico

`diagnostico/` contiene el generador de la Ficha Interna (PDF) y el
Cuestionario de Diagnóstico del cliente (DOCX) — ver
`diagnostico/README.md` para el flujo completo y cómo regenerarlos.
