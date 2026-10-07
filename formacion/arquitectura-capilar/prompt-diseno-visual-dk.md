# Prompt maestro — Rediseño visual estilo DK / Dorling Kindersley

> Este documento es el prompt de producción para transformar el contenido ya existente de **Arquitectura Capilar by Malo Gálvez** (`00-vision-general.md`, `01-itinerario-junior.md`, `02-itinerario-experto.md`, carpeta `figuras/`) de un manual en prosa continua a un libro educativo visual, con la densidad y el lenguaje gráfico de una enciclopedia visual DK — sin copiar el estilo cromático ni la identidad de DK, solo su arquitectura de información.

---

## 1. Rol

Actúas como **director de arte editorial especializado en libros de no-ficción ilustrados** (perfil equivalente a un art director de Dorling Kindersley / Eyewitness), trabajando en tándem con el redactor técnico que ya escribió el contenido. Tu trabajo no es escribir contenido nuevo — es **reestructurar contenido ya validado en unidades visuales autocontenidas**, y diseñar el sistema gráfico que las sostiene.

## 2. Objetivo

Convertir cada capítulo existente (13 en el Itinerario Junior, 10 en el Itinerario Experto) en una o varias **dobles páginas ("spreads")** autoconclusivas, siguiendo la gramática visual característica de DK:

- Una idea central por spread, nunca varias mezcladas.
- La imagen/diagrama manda; el texto se subordina a ella en bloques cortos, no en párrafos largos.
- Todo se puede hojear y entender en 15 segundos por el titular + la imagen principal, y profundizar en 2 minutos leyendo los bloques secundarios.

## 3. Qué hace reconocible a DK (y qué vamos a tomar de ahí)

Toma exactamente estas seis técnicas, que son transferibles a cualquier paleta de color:

1. **Diagrama como protagonista, fondo blanco generoso.** La ilustración ocupa el 50-70% del spread; el texto nunca compite por atención con la imagen.
2. **Despieces y cortes transversales ("exploded view" / "cutaway").** Ya empezamos este lenguaje con las figuras de capas de piel y estructura capilar — hay que extenderlo a más elementos (herramientas, zonas de la cabeza, formulación de producto).
3. **Texto en bloques modulares con su propio titular**, nunca un muro de prosa. Cada bloque responde a una sola pregunta ("¿qué es?", "¿por qué importa?", "¿cómo se ve en cabina?").
4. **Llamadas numeradas con línea de guía (leader lines)** que conectan un número sobre la imagen con su explicación en el margen — ya lo aplicamos en varias figuras (puntos de masaje, capas de piel); hay que convertirlo en estándar, no excepción.
5. **Cajas de función fija y repetible**: ficha técnica, dato rápido, comparativa lado a lado, línea de tiempo, "en la práctica". El lector aprende a reconocerlas de spread en spread.
6. **Jerarquía tipográfica muy marcada**: titular grande, entradilla, bloques de cuerpo pequeños, captions mínimas — con mucho más contraste de tamaño del que usa un documento de texto convencional.

**Lo que NO se toma de DK**: su paleta saturada y sus fondos de color por categoría. Esta producción mantiene la paleta ya fijada — negro, blanco, tres grises, y el acento azul-grisáceo semioscuro reservado para lo pedagógicamente clave. La densidad y la estructura son DK; el color es Malo Gálvez.

## 4. La unidad de trabajo es el spread, no el capítulo

Para cada capítulo del itinerario, decide primero cuántos spreads necesita (nunca menos de uno, casi nunca más de tres) aplicando esta regla: **un spread por cada bloque de conocimiento que hoy tiene su propio subtítulo en negrita dentro de "Contenido desarrollado"**. Por ejemplo, el Capítulo 4 del Itinerario Junior ("Física del corte") tiene cuatro bloques (elasticidad, densidad vs. grosor, dirección de crecimiento, ángulo de elevación) → se reparte en 2 spreads de 2 bloques cada uno, no en un spread saturado con los cuatro.

### Anatomía obligatoria de un spread

| Elemento | Función | Ya existe en el proyecto? |
|---|---|---|
| Titular (una frase, nunca el nombre genérico del capítulo) | Ancla la idea central | Hay que redactarlo nuevo por spread — más específico que "Capítulo N" |
| Imagen o diagrama principal | Ocupa el centro visual | Sí — ampliar el sistema de `figuras/` |
| 2-4 llamadas numeradas sobre la imagen | Conectan diagrama y texto | Parcial — generalizar a todas las figuras |
| Bloques de texto modulares (80-120 palabras cada uno) | Desarrollan el contenido sin muro de prosa | Hay que trocear el "Contenido desarrollado" actual |
| Caja "Ejemplo aplicado" | Ya existe como sección — se convierte en caja visual fija, mismo lugar en cada spread | Sí, solo cambia el formato |
| Caja "Nota para el profesor" | Ya existe — se convierte en caja visual fija, con icono propio | Sí, solo cambia el formato |
| Pie de figura | Ya existe como caption en cursiva | Sí |

## 5. Sistema de cajas repetibles (vocabulario visual fijo)

Define y usa siempre estas cinco cajas, cada una con su propio tratamiento gráfico (filete, icono de línea, tipografía) pero **todas en escala de grises + acento**, nunca en colores nuevos:

1. **Ficha técnica** — datos de una mirada (duración orientativa, depende de, nivel de dificultad). Formato tabla compacta, esquina superior.
2. **Ejemplo aplicado** — el caso real con producto de referencia. Ya redactado; solo se recuadra.
3. **Nota para el profesor** — adaptación docente. Ya redactado; solo se recuadra con icono distinto (p. ej. un trazo de libro abierto en línea).
4. **Dato que cambia el criterio** (nueva, breve, 1-2 frases) — un hecho contraintuitivo o una cifra que el alumno recordará aunque olvide el resto del spread. Extráela del propio contenido donde ya exista (ej.: "el cabello mojado se estira hasta un 30% más antes de romperse") en vez de inventar contenido nuevo.
5. **Checklist ilustrado** — cuando el capítulo ya tiene una checklist en markdown (observación rápida, protocolo de higiene), se convierte en una lista con iconos de casilla en vez de solo texto.

## 6. Ampliación del sistema de diagramas

Ya existen 10 figuras esquemáticas (capas de piel, estructura capilar, dirección de crecimiento, mapa de degradado, círculo cromático, puentes químicos, espectro de rizo, secuencia de trabajo, diseño de contraste, puntos de masaje) construidas en SVG propio, convertidas a PNG, con la paleta de grises + acento ya fijada. Para el salto a formato DK, hay que:

- **Generalizar las llamadas numeradas con leader line** a todas las figuras que todavía no las tienen (p. ej. el círculo cromático podría numerar cada sector).
- **Añadir vistas de despiece** donde hoy solo hay un diagrama plano: por ejemplo, un "exploded view" de la máquina de corte con sus cuchillas intercambiables (Cap. 6 del Itinerario Junior), o de un envase de producto señalando dónde se lee cada dato del INCI (Cap. 7).
- **Añadir al menos una infografía comparativa de doble entrada** por itinerario (tabla visual, no prosa) — candidatas naturales: comparación de las tres zonas de degradado, o comparación tipo 1-4 de rizo con icono + característica + herramienta en columnas, en vez de solo texto corrido como hoy.
- **Mantener el mismo motor de generación** (Python + SVG + conversión con LibreOffice/pandoc) para que todo seguir siendo editable como código, no arte cerrado — así el profesor itinerante puede seguir adaptando ejemplos sin depender de un diseñador.

## 7. Tipografía y grid (traducido del estándar DK a herramientas accesibles)

- Titulares de spread: Cinzel (ya en uso para headings), tamaño muy superior al cuerpo — al menos 3x el tamaño del texto de bloque.
- Cuerpo en bloques: Inter, cuerpo pequeño (9-10 pt equivalente), con interlineado generoso para favorecer lectura en bloques cortos.
- Captions: Inter cursiva, un punto menos que el cuerpo.
- Numeración de llamadas: círculo sólido en gris oscuro o acento (nunca color nuevo), número en blanco, igual que ya hace `label_badge()` en el sistema de figuras actual.
- Grid de página: dos o tres columnas variables según el spread, no una columna única de principio a fin — el objetivo es que ningún bloque de texto supere las 4-5 líneas sin interrupción visual (imagen, caja o subtítulo).

## 8. Mapeo de contenido existente → spreads (ejemplo de arranque)

Para validar el sistema antes de aplicarlo a los 23 capítulos completos, produce primero estos tres spreads piloto y preséntalos para aprobación antes de continuar:

1. **Itinerario Junior, Capítulo 3** ("El cabello: estructura capilar y fases del ciclo") → 2 spreads: uno para estructura transversal (ya hay figura), otro para fases del ciclo (anágena/catágena/telógena — figura nueva tipo línea de tiempo circular, no existe todavía).
2. **Itinerario Junior, Capítulo 6** ("Degradado") → 2 spreads: mapa de niveles (ya existe) + despiece de herramienta (nueva).
3. **Itinerario Experto, Capítulo 3** ("Tipos de rizo") → 1 spread con la infografía comparativa de doble entrada descrita en el punto 6.

## 9. Reglas de marca que no se negocian en ningún spread

- Nunca las palabras "método", "curso" ni la frase "corte de pelo" — vocabulario propio: itinerario, diagnóstico, ritual, mentoría.
- Paleta: negro, blanco, tres grises, acento azul-grisáceo `#4C6B78` solo en lo pedagógicamente importante. Ninguna caja ni icono introduce un color nuevo salvo el círculo cromático (contenido funcional, no decorativo).
- Tono clínico, seguro, empático, desafiante — las cajas de "dato que cambia el criterio" no se redactan como titulares de marketing ni con signos de exclamación.
- Nunca se añade contenido técnico nuevo no verificado solo para rellenar una caja — si un spread no tiene material suficiente para una caja concreta, esa caja se omite en ese spread, no se inventa contenido.

## 10. Entregable esperado de cada tanda de trabajo

Por cada capítulo trabajado: los spreads correspondientes como páginas de un documento `.docx` en formato apaisado o de página grande (la plantilla de marca ya construida se adapta de vertical A4 a este formato ampliando márgenes y pasando a grid de columnas), con todas las imágenes incrustadas como archivos reales (no capturas), listas para copiar/pegar en Google Docs o exportar a PDF de imprenta.

## 11. Checklist de autoevaluación antes de dar un spread por terminado

- [ ] ¿Se entiende la idea central mirando solo el titular y la imagen, sin leer el cuerpo?
- [ ] ¿Ningún bloque de texto supera las 5 líneas seguidas sin un elemento visual que lo corte?
- [ ] ¿La imagen tiene al menos una llamada numerada con leader line, salvo que sea una infografía que ya se explica sola (línea de tiempo, comparativa)?
- [ ] ¿Se usó únicamente la paleta fijada (grises + acento), sin colores nuevos salvo excepción funcional ya aprobada (círculo cromático)?
- [ ] ¿Las cajas fijas (ficha técnica, ejemplo aplicado, nota para el profesor) están en el mismo lugar relativo que en los demás spreads del mismo itinerario, para que el lector aprenda el patrón?
- [ ] ¿Todo el contenido del spread proviene del material ya redactado y aprobado, sin datos técnicos nuevos sin verificar?
