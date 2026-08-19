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

## Cosas a tener en cuenta

- La sección "Tienda" del menú lleva a `/collections/all`, que **aparecerá vacía** en el previsualizador porque los 9 productos siguen en DRAFT (a la espera de tu validación de precios/marcas).
- No hay fotos reales todavía — el hero y la sección "huella" se ven con el placeholder gris de Dawn (sin imagen).
- El logo se aplicó tal cual (fondo blanco original) — pendiente de resolver el recorte/fondo cuando podamos verlo con vista previa real (ver conversación sobre `mix-blend-mode`).

## Preguntas guardadas para cuando vuelvas

1. ¿Publicamos este tema en vivo (visible a cualquiera) ya, o seguimos solo en el previsualizador hasta tener fotos/productos validados?
2. ¿Activamos (ACTIVE) los 9 productos para que se vean en la tienda, o seguimos revisándolos primero?
3. ¿Algo que quieras rescatar de la versión anterior (Academia/Ameba/Legado) antes de darla por sustituida del todo? Sigue existiendo como páginas sueltas (`/pages/academia`, `/pages/ameba`, `/pages/manifiesto`) que ya no están enlazadas desde el menú — no las he borrado por si acaso.
4. Logo: ¿pruebo el tratamiento `mix-blend-mode`/cromado directamente en el tema (ahora que sí puedo verlo en vista previa), o prefieres mandarme una versión ya recortada tú?
