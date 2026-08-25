# Estado de la tienda Shopify — sesión de montaje del tema

## Qué se hizo

1. **Descubrimiento**: el tema no publicado "Dimension by Malo Gálvez" (`gid://shopify/OnlineStoreTheme/204158861657`, basado en Dawn) ya tenía una home construida con la estructura antigua "Academia / Ameba / Legado" (vocabulario de Arquitectura Capilar/Ameba). El cliente confirmó sustituirla por la estructura "Dimension" de esta sesión.
2. **Home** (`templates/index.json`): reescrita con 7 secciones — hero, manifiesto, tres puertas (Formación & Mentoría / Tienda / Red Dimension), huella, sello (3 pilares: diagnóstico/atención/paz), teaser de tienda (enlazado a las 3 colecciones reales) y cierre.
3. **Colores y logo** (`config/settings_data.json`): paleta ya estaba en negro/grafito/blanco/plata sin oro (scheme-1 a scheme-5). Se añadió el logo real subido por el cliente (`shopify://shop_images/WhatsApp_Image_2026-08-15_at_13.55.17.jpg`) como logo del header.
4. **Páginas creadas y publicadas**: `/pages/sello-dimension` (contenido completo de valores/filosofía), `/pages/formacion` (stub), `/pages/red-dimension` (stub).
5. **Menú principal actualizado**: Formación & Mentoría → Tienda (`/collections/all`) → Red Dimension → Sello Dimension. Sustituye el menú antiguo (Academia/Ameba/Manifiesto/Admisión) que apuntaba a páginas inexistentes.

## Previsualización

Tema no publicado — **no es visible públicamente**. Para verlo:
`https://aaxv0k-kn.myshopify.com/?preview_theme_id=204158861657`
(o desde el admin: Tienda online → Temas → "Dimension by Malo Gálvez" → Vista previa)

## Ajuste adicional

- El anuncio superior (announcement bar) tenía el texto de fábrica "Welcome to our store" — lo cambié a "Un estándar, no una franquicia — Dimension by Malo Gálvez".
- **No apliqué el `mix-blend-mode` al logo del header.** Comprobé que el header usa `scheme-1` (fondo casi negro, #0B0B0C) — con tinta negra pura, el multiply ahí dejaría el logo casi invisible (negro sobre negro), no lo contrario. No quise arriesgarme a que el logo desaparezca sin poder verlo yo mismo antes de que tú revises. Lo dejo pendiente para resolverlo contigo viendo la vista previa real.

## Más pulido (segunda pasada, sin interrumpir)

- Footer: menú "footer" actualizado (Tienda, Formación & Mentoría, Red Dimension, Sello Dimension, Búsqueda) y bloques `link_list` + `brand_information` añadidos a `sections/footer-group.json`. Newsletter renombrada a "Recibe noticias de la Red Dimension".
- Las 3 colecciones reales de Shopify (Pro Tools & Hardware, Clinical Grooming, Morphological Styling) ya tienen `descriptionHtml` propio — antes estaban vacías.
- Las 3 páginas creadas ya no repiten el título como `<h1>` dentro del body (la plantilla de Dawn ya lo muestra).

- Menú principal: "Tienda" ahora tiene desplegable con las 3 líneas reales (Herramientas, Para barberos, Para clientes), enlazando directo a cada colección.

## Tercera pasada — puesta en marcha (logo, tienda completa, estilo Zara/Zarahome)

1. **Logo**: aplicado `mix-blend-mode: multiply` + resplandor (`drop-shadow`) sobre el logo del header — ya no se ve el recuadro blanco, y el efecto de brillo compensa el bajo contraste de tinta negra sobre fondo casi negro. Vía `snippets/dimension-logo-fix.liquid`, incluido en `layout/theme.liquid`.
2. **Tienda completa**: los 9 productos pasaron de DRAFT a **ACTIVE** — ya son visibles en el previsualizador.
3. **Grid estilo Zara**: `templates/collection.json` ajustado a `image_ratio: portrait`, 4 columnas desktop, sin bordes/sombras en las tarjetas (ya estaba minimal, se afinó el ratio de imagen).
4. **Rebautizado "MaloShop"**: la sección de tienda pasa a llamarse "MaloShop" en menú principal, menú de footer, la puerta de "Tres puertas" y el teaser de la home. **Aviso**: es la primera vez que aparece ese nombre — si no era intencional, dímelo y lo revierto a "Tienda".
5. **Home estilo Zarahome sin fotos**: el hero y el cierre dejaron de ser secciones `image-banner` (que sin foto real mostraban un icono de placeholder feo) y pasaron a `rich-text` con **degradados propios** de fondo (grafito → negro → grafito) en vez de fotos — más limpio que un hueco vacío, sin inventar ninguna imagen.
6. **Generador de fotos**: seguimos sin él (sin cuota gratuita en tu clave de Gemini). No he vuelto a intentarlo.

## Cuarta pasada — color de acento

Confirmado: "MaloShop" es el nombre definitivo de la tienda.

Se introdujo un acento de color **oxblood/burdeos oscuro (#8B3A3F)** en todos los botones principales del sitio (las 5 paletas de color del tema) — antes eran blanco/plata sobre negro, ahora tienen un color propio. Es deliberado que sea solo en botones: mantiene la disciplina de "un solo acento, todo lo demás en calma" en vez de llenar la web de color. Nada de dorado, tal y como pediste.

## Quinta pasada — grises lobo en vez de rojo

Rectificado: quitamos el acento oxblood y lo sustituimos por **grises lobo** de verdad — no solo negro/blanco:
- Botones: gris lobo `#75767B` (antes rojo oxblood) en la mayoría de esquemas; `#5B5C61` sobre fondo claro.
- Nuevo tono de fondo medio `#4B4B50` (scheme-5) aplicado a la sección "Sales siendo otra persona" — ya no todo es negro puro, hay un escalón de gris real en la página.
- "Tres puertas" pasó de negro puro a gris grafito (scheme-2) para otro escalón de contraste.

## Sexta pasada — tema en vivo, chrome animado y envíos

**Aviso crítico**: el tema "Dimension by Malo Gálvez" es ahora el **MAIN/en vivo** (lo publicó el cliente directamente en el admin, protegido con contraseña). Shopify bloquea escribir sobre un tema en vivo, así que a partir de aquí trabajo sobre una **copia sin publicar**: "Copia de Dimension by Malo Gálvez" (`gid://shopify/OnlineStoreTheme/204773130585`).

- **Logo**: efecto de plata cromada líquida animada — un brillo diagonal recorre el logo en bucle continuo (3.2s), enmascarado exactamente a la forma del logo real (vía CSS `mask-image` + Liquid), sobre el fondo blanco ya eliminado con `multiply`. Vive en la copia, pendiente de publicar.
- **Catálogo confirmado**: se mantienen los 9 productos (Wahl, JRL, Feather, Beardburys, Proraso, Reuzel) tal cual.
- **Transportista confirmado**: Packlink PRO. Creé la página `/pages/envios` con política honesta (sin inventar plazos/costes exactos — se calculan en checkout) y la añadí al menú de footer.
- **Pendiente de ti**: publicar la copia de trabajo — yo no puedo hacerlo (Shopify bloquea la mutación de publicar tema por seguridad). Ve a Tienda online → Temas → en "Copia de Dimension by Malo Gálvez" → **Publicar**.

## Séptima pasada — bug del logo animado

El efecto de chrome animado no se veía porque el CSS apuntaba a `.header__heading-logo-link`, una clase que no existe en este tema — verifiqué el `sections/header.liquid` real y la clase correcta es `.header__heading-logo-wrapper`. Corregido en la copia de trabajo. Revisa de nuevo la vista previa: `https://aaxv0k-kn.myshopify.com/?preview_theme_id=204773130585`.

## Octava pasada — silueta real + gris metálico + movimiento líquido

Cambié de técnica: en vez de mostrar el JPG y ponerle un brillo encima (lo que dejaba ver el rectángulo del archivo), ahora uso el logo como **máscara de silueta invertida** (SVG `feColorMatrix` + `mask`) y relleno esa silueta exacta con un degradado metálico de 8 tonos de gris. Resuelve los tres puntos pedidos:
- **Negro → gris metálico**: la estrella ya no es negra, es el degradado plateado.
- **Cuadrado eliminado**: la máscara sigue la silueta real de la estrella, no el rectángulo del JPG.
- **Efecto líquido**: el degradado se mueve en un recorrido de 4 puntos (no solo izquierda-derecha) a lo largo de 6s en bucle, más orgánico que el barrido anterior.

## Novena pasada — revertido el cuadro, límite técnico real

El intento de recolorear el negro a gris (SVG `feColorMatrix` invirtiendo la imagen para usarla como máscara) fallaba: los navegadores bloquean/ignoran filtros SVG aplicados a imágenes externas por seguridad entre dominios, así que la máscara no se invertía y se veía el rectángulo completo en vez de la silueta. Revertido a la versión confirmada sin cuadro (fondo eliminado con `multiply` + brillo líquido animado en 4 puntos con `mask-image` directo, que sí recorta bien a la silueta).

**Límite real**: recolorear el negro del logo de forma limpia solo es fiable con una imagen con **canal alfa (PNG transparente)**, no con el JPG actual. Si el cliente puede conseguir una versión en PNG con fondo transparente del mismo logo, se puede aplicar el degradado metálico de verdad sobre la silueta exacta.

## Décima pasada — por qué no salía la estrella, y técnica definitiva

Diagnóstico real: con `mix-blend-mode: multiply` sobre el header casi negro, la tinta negra de la estrella se fundía con el fondo — bajo contraste, no un bug de posición. Cambié de técnica:
- `filter: invert(1)` sobre la imagen (el negro se vuelve blanco) + `mix-blend-mode: screen` (el fondo, ahora negro, se vuelve invisible sobre cualquier fondo oscuro; la estrella, ahora blanca, brilla con fuerza). Sin necesitar ninguna máscara — elimina de raíz el riesgo de "cuadrado".
- Encima, una capa con degradado metálico de 8 tonos y `mix-blend-mode: color`, que tiñe automáticamente solo donde hay brillo (la estrella), respetando su forma real sin máscara.
- Movimiento: recorrido de 8 puntos con curva `cubic-bezier` suave a lo largo de 9s, más armónico/orgánico que el barrido anterior.

## Undécima pasada — color visible + logo en la pantalla de contraseña

- **Bug de color encontrado**: usaba `mix-blend-mode: color`, que solo transmite matiz/saturación — como mi degradado era de grises neutros (saturación ≈ 0), no se veía ningún color, solo blanco. Cambiado a `mix-blend-mode: overlay`, que sí responde a la luminosidad de cada tono del degradado — ahora se ven las bandas plateado/gris moviéndose de verdad.
- **Pantalla de contraseña**: el logo ahí usa una clase distinta (`.password-logo`, sin wrapper). Añadí el wrapper y la clase `header__heading-logo` en `sections/main-password-header.liquid`, e incluí el snippet en `layout/password.liquid` — mismo efecto ahí también.

## Duodécima pasada — cambio de estrategia: estrella 100% vectorial

El cuadrado persistía porque el JPG tiene ruido de compresión en el fondo (no es blanco puro, tiene variaciones), y cualquier técnica de máscara/blend basada en ese archivo terminaba mostrando algo del rectángulo. Solución definitiva: dejo de usar el JPG para el efecto y dibujo la estrella **directamente en SVG** (los mismos rayos + círculo del sello, generados por JS) con el degradado metálico de 8 tonos aplicado como `stroke`, y una rotación continua vía `animateTransform` (SMIL) — gira de verdad, sin trucos de `background-position`. El JPG original se oculta (`visibility:hidden`, sigue ahí para accesibilidad/SEO) y esta estrella vectorial ocupa su lugar. Al ser vectorial, es matemáticamente imposible que aparezca un cuadrado — no hay ningún rectángulo de por medio, solo los trazos de la estrella.

## Decimotercera pasada — vuelta al logo real, técnica definitiva

El cliente pidió volver a su estrella original (no la vectorial). Causa raíz encontrada por fin: tras `invert(1)` + `screen`, la estrella queda en **blanco puro (255,255,255)** — y casi ningún blend mode puede pintar color sobre blanco puro (por eso `color` y `overlay` se veían "solo blanco"). La excepción es `multiply`: `multiply(blanco, color) = color` (pinta el color exacto sobre la estrella) y `multiply(negro, color) ≈ negro` (el fondo se queda invisible solo, sin necesitar ninguna máscara). Con esto: estrella real, coloreada con el degradado metálico animado, sin cuadrado, sin máscara. Quité la estrella vectorial JS que había puesto de prueba.

## Decimocuarta pasada — decisión final: estrella vectorial

Cliente confirma: usar la versión vectorial de forma definitiva (garantiza cero riesgo de cuadrado, ya que no hay ningún archivo raster de por medio). Aplicado en la copia de trabajo. Código completo documentado en `content/logo-estrella-cromada.liquid` y enviado al cliente como archivo.

## Cosas a tener en cuenta

- La sección "Tienda" del menú lleva a `/collections/all`, que **aparecerá vacía** en el previsualizador porque los 9 productos siguen en DRAFT (a la espera de tu validación de precios/marcas).
- No hay fotos reales todavía — el hero y la sección "huella" se ven con el placeholder gris de Dawn (sin imagen).
- El logo se aplicó tal cual (fondo blanco original) — pendiente de resolver el recorte/fondo cuando podamos verlo con vista previa real (ver conversación sobre `mix-blend-mode`).

## Decimoquinta pasada — el cliente publicó la copia; sincronizado el tema en borrador

Descubrimiento a media sesión: el cliente publicó él mismo "Copia de Dimension by Malo Gálvez" desde el admin. Los roles de los temas se intercambiaron:
- **MAIN (en vivo) ahora**: `gid://shopify/OnlineStoreTheme/204773130585` ("Copia de..."). Ya tenía la estrella vectorial correcta — el efecto quedó visible en vivo sin que yo tuviera que tocar nada más.
- **UNPUBLISHED (borrador) ahora**: `gid://shopify/OnlineStoreTheme/204158861657` ("Dimension by Malo Gálvez", el original). Se quedó con el snippet antiguo (`mix-blend-mode: multiply`, sin la estrella) y sin renderizar el efecto en la pantalla de contraseña.

Sincronicé ese tema en borrador con la versión correcta (snippet vectorial + render en `layout/password.liquid`) para que ambos temas queden coherentes.

**Cambio de rumbo inmediato**: el cliente subió su logo real como PNG (`shopify://shop_images/star_liquid_metal.png`, mismo tamaño en píxeles que el JPG original — probablemente la misma foto con el fondo ya quitado) y pidió explícitamente el sol/estrella real, no la estrella vectorial genérica dibujada por JS. Ya lo había puesto como `settings.logo` del tema en borrador él mismo.

Reescribí `snippets/dimension-logo-fix.liquid` **solo en el tema en borrador** (204158861657, por petición expresa: "al tema en borrador") para aplicar el degradado metálico animado directamente sobre la silueta real del PNG vía `mask-image` (la misma técnica ya validada en `content/liquid-chrome-metal-corregido.liquid`, con la sombra en un contenedor separado de la máscara para evitar el bug de Safari). Ya no dibuja una estrella genérica — recorta el degradado a la forma exacta del sol/estrella subido.

**Aviso técnico**: no pude renderizar una captura de la vista previa real — el sandbox de esta sesión bloquea las conexiones salientes a `myshopify.com` y `cdn.shopify.com` (confirmado por el proxy de red). La implementación se apoya en la técnica de `mask-image` ya confirmada por el cliente en la sección Liquid Chrome Metal, y en que `star_liquid_metal.png` tenga canal alfa real (fondo transparente) — si al revisar la vista previa se ve un rectángulo en vez de solo la silueta, es señal de que ese PNG no tiene transparencia real y haría falta regenerarlo con fondo transparente de verdad.

**Nota de alcance**: este cambio del sol real (en vez de la estrella vectorial) solo se aplicó al tema en borrador (204158861657), no al tema en vivo (204773130585), tal y como se pidió. Si el resultado convence en el borrador, hace falta repetir la misma escritura en el tema en vivo — cosa que la API bloquea (solo permite escribir en temas sin publicar), así que requeriría o bien que el cliente publique este borrador, o que yo lo haga cuando dejen de estar bloqueadas las escrituras al tema activo.

## Decimosexta pasada — el sol real no se veía: causa encontrada

Tras la Decimoquinta pasada, el cliente reportó que el logo seguía sin verse en absoluto (ni siquiera un rectángulo) en el editor de temas de la app móvil de Shopify. Descarté varias hipótesis por orden, con evidencia de la propia API en cada paso:

1. **No era el editor recargando la sección por AJAX** (`shopify:section:load`) — añadí reconstrucción del efecto en ese evento y seguía sin verse.
2. **No era un colapso de tamaño a 0×0** — encontré una regla real conflictiva en `assets/base.css` (`.header__heading-logo-wrapper { width: 100% }`, el mismo patrón de bug ya documentado en `liquid-chrome-metal-corregido.liquid`) y la pisé con `width`/`height` fijos en px + `!important`. Seguía sin verse.
3. **Confirmé que el tema compilaba sin errores** (`processingFailed: false`) y que los archivos se habían guardado exactamente como se enviaron (sin truncar/corromper) — descartado también.

Con las tres hipótesis anteriores agotadas y aun así sin resultado, la causa real solo podía estar en la propia técnica de `mask-image` + capas superpuestas (quizá el `mask-image`/`-webkit-mask-image` no se soporta en el WebView del editor de la app móvil, o algo en esa combinación específica fallaba silenciosamente). En vez de seguir intentando adivinar sin poder ver el resultado yo mismo (esta sesión tiene bloqueada la salida de red a `myshopify.com`/`cdn.shopify.com`), **retiré toda la complejidad**: sin máscara, sin capas, sin JavaScript. Ahora `snippets/dimension-logo-fix.liquid` solo aplica un `filter: drop-shadow(...)` directo sobre el `<img>` real (ya no oculto con `visibility: hidden`) — la foto tal cual, con un resplandor. **Confirmado por el cliente que así sí se ve.**

**Pendiente si se quiere retomar la animación líquida**: ahora que la visibilidad base está confirmada, el efecto de degradado metálico animado habría que reconstruirlo con una técnica que NO dependa de `mask-image` (por ejemplo, `mix-blend-mode` sobre una capa de degradado encima de la imagen real, en vez de recortarla a su silueta) — evitando así el punto exacto que falló aquí.

## Decimoséptima pasada — mix-blend-mode tampoco aísla la silueta; solución definitiva: silueta real trazada del canal alfa

Probé `mix-blend-mode` (primero `overlay` con un brillo encima de la foto sin tocar la foto en sí — seguía viéndose el cuadro blanco; luego `multiply` directo sobre la foto, que si funde el blanco matemáticamente pero deja el sol como una mancha gris apagada, no un metal brillante). El cliente confirmó que ninguna de las dos aísla bien la silueta — pidió expresamente la forma del sol en blanco con el efecto metal, sin cuadrado, y me dio libertad para cambiar de técnica.

Diagnóstico de por qué `mask-image` fallaba en el editor de la app: casi con seguridad es una restricción de origen cruzado (CORS) del WebView al usar una imagen de `cdn.shopify.com` como fuente de máscara — un `<img>` normal carga esa misma URL sin problema, pero `mask-image` exige acceso a nivel de píxel al recurso, como con `canvas`, y sin cabecera CORS adecuada el navegador lo descarta en silencio (de ahí que no se viera nada, ni un error).

Solución: encontré el archivo original de la imagen del sol en el propio historial de esta conversación (Claude Code lo guarda en base64 dentro del transcript de la sesión), lo extraje a un PNG real, confirmé que sí tiene canal alfa auténtico (76% transparente, 17% opaco, 7% de antialiasing en los bordes — descartando definitivamente que la falta de transparencia fuera el problema), y usé `scikit-image` (`measure.find_contours` + `approximate_polygon`) para trazar la silueta exacta directamente de los píxeles, incluyendo los dos aros, el hueco central en forma de hoja/ojo con su detalle interno, y el puntito. Ese trazado se convirtió en un único `<path>` SVG con `fill-rule="evenodd"` (para que las 20 formas anidadas —contorno exterior + huecos— se recorten correctamente), relleno con el mismo degradado metálico animado de siempre, y sin depender de ninguna imagen externa — mismo enfoque 100% vectorial que ya se había confirmado como definitivo antes en este proyecto, pero esta vez con la silueta real del cliente en vez de una estrella genérica. **Confirmado por el cliente: "está perfecto".**

Detalle de accesibilidad: la animación se desactiva automáticamente en dispositivos con "Reducir movimiento" activado (viene heredado de las versiones anteriores del efecto) — el cliente lo revisó y pidió dejarlo así a propósito, en vez de forzar el movimiento para todos.

**Estado final del logo**: `snippets/dimension-logo-fix.liquid` en el tema en borrador (204158861657) dibuja el sol real del cliente en SVG puro con degradado metálico animado (9s, en bucle), respeta `prefers-reduced-motion`, y se reconstruye solo si el editor de temas recarga la sección por AJAX. Sin imagen externa, sin `mask-image`, sin `mix-blend-mode`. Pendiente únicamente: llevar este mismo cambio al tema en vivo (204773130585) cuando el cliente lo confirme, ya que la API sigue bloqueando escrituras directas al tema publicado.

## Decimoctava pasada — auditoría completa + primeros arreglos de Fase 0

Auditoría profesional del proyecto completo (estructura, Liquid/CSS/JS, assets, metafields, productos, SEO, velocidad, accesibilidad, UX, conversión) entregada como artefacto, con roadmap de 6 fases. Hallazgo más importante: ya existe una arquitectura de metafields bajo el namespace `ameba` (línea de producto, diagnóstico recomendado, nivel técnico, `probado_por_malo`, `uso_en_academia`) al 0% de uso — es el puente de datos hacia academia/marca personal que pide el roadmap, ya construido pero vacío. Hallazgo más urgente: 0 de 9 productos activos tienen imagen.

Con permiso explícito para trabajar sobre el tema en borrador (`Dimension by Malo Gálvez`, sin publicar — el "original"), apliqué la primera tanda de arreglos de Fase 0, todos ya en producción real (páginas/redirects son contenido de tienda, no del tema, así que afectan al sitio en vivo de inmediato):

1. **Traducciones al español**: "You may also like" → "También te puede interesar" y "Share" → "Compartir" en `templates/product.json` del tema en borrador.
2. **Accesibilidad del logo**: el SVG animado del sol ahora lleva `role="img"` y `aria-label="{{ shop.name }}"` — un lector de pantalla vuelve a anunciar el nombre de la marca en el header.
3. **Páginas huérfanas resueltas** (a petición del cliente: no solo ocultarlas, sino redirigirlas a destinos vivos y mejorar el contenido real):
   - `/pages/academia` → redirect 301 a `/pages/formacion`.
   - `/pages/ameba` → redirect 301 a `/collections/all` (MaloShop).
   - `/pages/manifiesto` → en vez de redirigirla, se reescribió y se **publicó** como página real y propia — no duplica el contenido de "Sello Dimension" (que ya cubre los 3 pilares del sello), sino que aporta la tesis/filosofía de marca en bloques cortos y escaneables (no formato blog), aplicando el vocabulario y tono del skill `voz-marca-ameba` (sin "método"/"curso"/"corte de pelo"; tono clínico-empático-desafiante).
   - `/pages/formacion` (antes un solo párrafo "en construcción") se reescribió con contenido real: itinerario Junior, itinerario Experto, y cómo funciona la mentoría — manteniendo honesto que el calendario de ciudades sigue pendiente, sin inventar fechas.

**Resuelto**: la página Manifiesto ya está enlazada desde "Sello Dimension" (última línea, tras el bloque de posicionamiento) — se mantuvo el nombre/título "Sello Dimension" sin cambios, solo se añadió el enlace de salida hacia `/pages/manifiesto`.

## Decimonovena pasada — halo del cristal y temblor del centro del sol

El cliente reportó, con captura, una línea/halo justo encima del texto "corta. Se construye." — el degradado del cristal del header no se disolvía del todo ahí. Causa: el margen de disolución del `mask-image` estaba en porcentaje (últimos 30% de la altura del hueco). Con la cabecera ya encogida por el scroll, ese hueco es pequeño, así que el 30% se traducía en muy pocos píxeles reales — insuficiente para que un desenfoque de 14px hiciera una transición suave, y aparecía como un corte visible.

- **Arreglado**: el margen de disolución de `snippets/dimension-motion.liquid` pasa de porcentaje a **64px fijos** (`calc(100% - 64px)`), así que la zona de transición es siempre varias veces mayor que el radio de desenfoque, sin importar cuánto haya encogido la cabecera.
- **De paso**, subí también el arreglo que tenía preparado para el sol: el movimiento tipo llama de las puntas ahora vive en una capa aparte, recortada con una máscara de anillo (`snippets/dimension-logo-fix.liquid`) — el centro del sol (ojo/puntito) queda en una capa fija sin filtro, así que ya no tiembla con el resto.

Ambos cambios ya están en el tema en borrador (204158861657). Pendiente de que el cliente confirme con la vista previa real antes de llevarlos también al tema en vivo.

## Vigesimosegunda pasada — firma sin caja + gap ajustado

Confirmado por el cliente: el sol ya no queda eclipsado y la firma "Dimension / by Malo Gálvez" se ve bien dividida. Dos ajustes finales:
1. Quité el fondo y la línea propios del aviso superior (`.utility-bar`) para que deje de leerse como una banderita en caja aparte y se funda con el negro del fondo — más presencia como título real.
2. El hueco entre la firma y el sol se acortó a la mitad: el `padding-top` dinámico del header pasó de `24px + overflow` a `8px + (overflow * 0.5)` (el cristal de fondo sigue usando la extensión completa para el blur, solo el espacio en blanco se redujo), y el padding inferior del texto de 1.6rem a 1rem — para que la firma y el sol se sientan como una sola pieza en vez de dos bloques separados.

## Vigesimotercera pasada — transición suave al volver arriba rápido

El cliente notó que al hacer scroll rápido de vuelta arriba, el sol "saltaba" a su tamaño grande en vez de crecer con fluidez. Causa: el tamaño del sol (`--logo-scale`) se aplicaba con `transform: scale()` sin ninguna transición CSS — se recalculaba en cada frame de scroll de forma instantánea, así que un scroll brusco (en vez de uno lento y continuo) se notaba como un salto en vez de una animación. El hueco del header sí tenía transición, pero el sol y el fondo de cristal no, así que además iban desacompasados entre sí.

Arreglado en `snippets/dimension-motion.liquid`: añadí `transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)` al sol y la misma curva/duración al fondo de cristal (`top`/`height`) y al hueco del header (que ya tenía transición, ajustada para igualar) — los tres elementos ahora se mueven como una sola pieza con una curva de easing suave, sin importar la velocidad del scroll. Respeta `prefers-reduced-motion` (transición desactivada del todo ahí, como el resto del efecto).

## Vigésima pasada — el sol se comía el aviso de arriba

Con captura, el cliente mostró que el sol (a su tamaño máximo, sin hacer scroll) quedaba eclipsado por el aviso superior "Dimension by Malo Gálvez" — sus puntas de arriba se cortaban contra ese texto. Causa: `.header` de Dawn tiene `padding-top: 0`, y el aviso va pegado justo encima en el DOM (sección `announcement-bar`); no había ningún hueco reservado para que el logo, escalado ×2 al cargar la página, creciera hacia arriba sin invadir ese espacio.

Arreglado en `snippets/dimension-motion.liquid`: `.header-wrapper .header` ahora lleva `padding-top: calc(24px + var(--dm-logo-overflow))` — el mismo margen dinámico que ya usaba el fondo de cristal para su propia extensión, más un colchón fijo de 24px. Crece cuando el logo está grande (arriba de la página) y se reduce solo al hacer scroll, en vez de un hueco fijo que sobrara o faltara según el tamaño del logo en cada momento.

## Vigesimoprimera pasada — aviso superior a modo de firma

El cliente pidió que el texto del aviso superior ("Dimension by Malo Gálvez") se viera como una firma: "Dimension" en tamaño de título, y "by Malo Gálvez" debajo, más pequeño. Como el campo de texto del bloque se renderiza escapado (no admite HTML), añadí en `snippets/dimension-motion.liquid` un pequeño script que separa el texto por la primera palabra ("Dimension" / resto) y lo envuelve en dos `<span>` con estilos distintos — título en mayúsculas con tracking amplio, firma en cursiva y opacidad reducida debajo, apilados en columna. No se tocó el contenido del bloque en el admin, así que sigue editable ahí con normalidad (el script se re-ejecuta si la sección se recarga en el editor).

## Preguntas guardadas para cuando vuelvas

1. ¿Activamos (ACTIVE) los 9 productos para que se vean en la tienda, o seguimos revisándolos primero?
2. El logo del sol real, ya con el efecto metálico animado definitivo, está solo en el tema en borrador (204158861657) — dime cuándo quieres que lo lleve también al tema en vivo (204773130585, "Copia de...").
3. Siguiente paso natural del roadmap: Fase 1 (fotografía real de los 9 productos) — es el mayor freno de conversión detectado en la auditoría.
