# Rediseño de portada — Dimension by Malo Gálvez

Entregable técnico y de contenido para el nuevo menú (mega-menú al hover) y el
hero de scroll storytelling de la home. Código en `index.html`,
`src/styles/main.css` y `src/scripts/main.js`.

## 1. Titulares y subtítulos del hero

Cuatro fases con imagen (tres tijeras) más el claim de cierre. Cero uso de
"método", "curso" o "corte de pelo".

| # | Herramienta (dirección de arte) | Titular (Cinzel) | Subtítulo (Inter) |
|---|---|---|---|
| 01 | Tijera clásica, filo convexo, mango offset (ref. Yasaka) | **El filo que no arrastra, diagnostica** | Acero cobalto, filo convexo, mango offset: cero margen de error. |
| 02 | Tijera de acero damasco, filo convexo 3D (ref. Kamisori) | **Cada veta de acero, una decisión** | Damasco grafito para el pelo grueso que exige criterio. |
| 03 | Tijera de entresacar, hoja angulada (ref. Juntetsu) | **El degradado empieza en el diagnóstico** | Hoja angulada para la piel de alta fidelidad. |
| 04 | Cierre — claim de marca | **La Arquitectura Capilar es tu itinerario** | Un diagnóstico. Tres itinerarios: MaloShop, Academia & Mentoría, Distribuidores. |

La fase 0 (marca, estática) usa el lockup `Arquitectura Capilar / Malo Gálvez`
con el subtítulo `Diagnóstico morfológico craneal y facial. Visagismo Empático.`

## 2. Especificación de assets

Las tres fotografías definitivas de producto sustituyen a los placeholders
vectoriales en `src/assets/scissors/` (mismos nombres de archivo, para no
tocar el código al integrarlas):

| Archivo | Pieza | Dirección de arte |
|---|---|---|
| `yasaka-clasica.*` | Tijera de corte clásica, filo convexo, mango offset | Macro, luz fría lateral, fondo hormigón pulido o humo tenue. Acabado grafito mate / acero cepillado — sin dorado. |
| `kamisori-damasco.*` | Tijera de acero damasco, filo convexo 3D | Detalle de alto contraste, patrón damasco en grises/acerados, acabado escarchado. Pieza más "escultórica": reservada para la fase intermedia de mayor impacto visual. |
| `juntetsu-entresacar.*` | Tijera de entresacar, hoja angulada | Ángulo que muestre con claridad los dientes y la angulación de la hoja. |

Fondo neutro (gris grafito / hormigón) y luz fría/dura de estudio en las tres,
cero atrezzo de barbería tradicional (madera, cuero envejecido, brochas).

**Formatos y resoluciones a entregar por pieza** (6 archivos por tijera, 18 en total):

| Formato | Desktop (ancho) | Móvil (ancho) |
|---|---|---|
| AVIF | 1600 px | 800 px |
| WebP | 1600 px | 800 px |

- Relación de aspecto cuadrada (1:1), fondo incluido en el encuadre — coincide
  con el `viewBox="0 0 1200 1200"` de los placeholders SVG actuales.
- Servir con `<picture>` + `srcset`/`sizes` (o el equivalente en el CMS/framework
  final) apuntando AVIF → WebP → fallback JPEG de emergencia.
- Comprimir agresivamente (AVIF ~q50–60, WebP ~q70–75): son imágenes que se
  ven a pantalla completa durante el scroll, el peso impacta directamente en
  que la secuencia no salte.

## 3. Menú — criterio de aceptación

Estructura: 4 sectores de primer nivel (`Manifiesto`, `Academia & Mentoría`,
`MaloShop`, `Distribuidores`) + botón de acción `Reservar diagnóstico` fuera
del conteo de navegación, dentro del límite de 7 elementos / 2 niveles.

Verificado manualmente (ver sección 5): desde la home, en menos de 10s,
- un producto de MaloShop se alcanza en 2 clics (`MaloShop → Morphological
  Styling`, etc.),
- reservar una mentoría en 2 clics (`Academia & Mentoría → Mentoría 1:1` o el
  CTA `Reservar diagnóstico`),
- contacto de distribuidor en 2 clics (`Distribuidores → Solicitar
  distribución`).

Señalización de sección activa: subrayado + icono en gris metalizado claro
(`--c-metal-light`) sobre el elemento de primer nivel correspondiente a la
ruta actual — sin introducir ningún color fuera de la paleta autorizada.

## 4. Degradación — accesibilidad y rendimiento

- **`prefers-reduced-motion: reduce`**: se desactiva por completo el pin y el
  scroll-scrubbing. El hero pasa a un listado estático de tarjetas (una por
  tijera + el cierre), sin animación de entrada — visibles de inmediato, sin
  necesidad de intención de scroll.
- **Móvil (`< 720px` de ancho de viewport)**: mismo listado estático que el
  caso anterior (se evita el "scroll-jacking" completo, que en gama baja
  competía con el rendimiento del hilo principal), pero con un fundido ligero
  por tarjeta al entrar en el viewport vía `IntersectionObserver`
  (`fade + translateY(16px)`, sin bloquear el scroll nativo del dispositivo).
- **Desktop**: `position: sticky` (CSS) para el pin — sin coste de layout de
  un pin por JS — y GSAP ScrollTrigger únicamente para leer el progreso de
  scroll (`scrub: 0.4`) y animar opacidad/escala/rotación de cada fase.
- Las imágenes de las tijeras se cargan como `<img>` estándar (`loading="eager"`
  solo en la primera fase, `lazy` en el resto) — al integrar los AVIF/WebP
  definitivos, mantener esa misma estrategia de carga.

## 5. Cómo probarlo

```bash
npm install
npm run dev
```

Se ha verificado con Playwright (Chromium) en tres configuraciones: desktop
1440×900 (hover del mega-menú, apertura/cierre con retardo de salida,
progreso del scroll-storytelling por fase), móvil 390×844 táctil (panel por
toque, jerarquía de 2 niveles, fallback estático) y `reducedMotion: reduce`
(fallback estático inmediato, sin animación).
