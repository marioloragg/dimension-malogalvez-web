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

## Cosas a tener en cuenta

- La sección "Tienda" del menú lleva a `/collections/all`, que **aparecerá vacía** en el previsualizador porque los 9 productos siguen en DRAFT (a la espera de tu validación de precios/marcas).
- No hay fotos reales todavía — el hero y la sección "huella" se ven con el placeholder gris de Dawn (sin imagen).
- El logo se aplicó tal cual (fondo blanco original) — pendiente de resolver el recorte/fondo cuando podamos verlo con vista previa real (ver conversación sobre `mix-blend-mode`).

## Preguntas guardadas para cuando vuelvas

1. ¿Publicamos este tema en vivo (visible a cualquiera) ya, o seguimos solo en el previsualizador hasta tener fotos/productos validados?
2. ¿Activamos (ACTIVE) los 9 productos para que se vean en la tienda, o seguimos revisándolos primero?
3. ¿Algo que quieras rescatar de la versión anterior (Academia/Ameba/Legado) antes de darla por sustituida del todo? Sigue existiendo como páginas sueltas (`/pages/academia`, `/pages/ameba`, `/pages/manifiesto`) que ya no están enlazadas desde el menú — no las he borrado por si acaso.
4. Logo: ¿pruebo el tratamiento `mix-blend-mode`/cromado directamente en el tema (ahora que sí puedo verlo en vista previa), o prefieres mandarme una versión ya recortada tú?
