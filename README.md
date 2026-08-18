# Dimension by Malo Gálvez — Web

Rediseño de la tienda Shopify [aaxv0k-kn.myshopify.com](https://aaxv0k-kn.myshopify.com/) ("Dimension by Malo Gálvez"). Este repositorio guarda las decisiones de marca, la arquitectura de contenido y las maquetas de trabajo; los cambios de catálogo (productos, colecciones) se aplican directamente en el admin de Shopify vía API.

## Decisiones de marca confirmadas

- **Nombre**: "Dimension" es el nombre de esta web/tienda. El concepto de fondo sigue siendo Malo Gálvez — Arquitectura Capilar, Visagismo Empático, mentoría por itinerarios — con vocabulario propio (nunca "método", "curso" ni "corte de pelo").
- **Paleta**: gris, gris lobo, plata, negro y blanco. Sin acento dorado — confirmado explícitamente por el cliente.
- **Tipografía de trabajo**: Cinzel (titulares) + Inter (cuerpo) + JetBrains Mono (etiquetas/eyebrows).
- **Arquitectura de navegación**: tres puertas con jerarquía visual equivalente — *Formación & Mentoría* (barberos), *Tienda* (clientes y barberos), *Red Dimension* (barberías que se suman al sello).

## Estructura del repo

- `content/home.md` — copy y estructura de la página principal.
- `content/productos.md` — investigación de producto real (marca, precio, distribuidor, fuente) para las 3 líneas del catálogo.
- Maqueta visual de la Home: publicada como Artifact (enlace compartido en la conversación de trabajo).

## Estado del catálogo en Shopify (a fecha de la última sesión)

3 colecciones pobladas con 3 productos cada una, todos en **DRAFT** (no publicados) a la espera de validación de precios/imágenes:

- **Pro Tools & Hardware**: Wahl Cordless Magic Clip, JRL FreshFade 2020C, Navaja Feather Artist Club SS.
- **Clinical Grooming**: Aceite de Barba Beardburys Original Heritage, Brocha de Afeitar Proraso, Bálsamo Aftershave Proraso Wood & Spice.
- **Morphological Styling**: Pomada Reuzel Fiber, Bálsamo Aftershave Proraso Red, Champú Densify Beardburys.

Ver `content/productos.md` para precios, fuentes y notas de vigencia.

## Pendiente del cliente

- Fotografía real: espacio, Malo Gálvez trabajando, clientes satisfechos, detalle de herramientas (ver maqueta de Home para la lista exacta de tomas).
- Logo para la sección de valores/filosofía.
- Validación de los 9 productos en borrador (precio, distribuidor, si se mantienen o se sustituyen).
- Texto final de la sección "Sello Dimension" / filosofía de la estrella que cae (borrador en `content/home.md`, pendiente de aprobación).
