# Sistema de Diagnóstico de Visagismo Empático

Dos documentos generados por código que forman el diagnóstico previo de
**Dimension by Malo Gálvez**, con el mismo sistema de diseño (tipografía
Outfit, paleta obsidiana → grafito → metal → metal-claro → tiza, cero
rellenos negros, el peso lo dan los filetes finos y el aire — no bloques):

- **Conectores y campos circulares**: las casillas son círculos (○ / ●) en
  vez de la casilla cuadrada clásica, y en el PDF los campos de respuesta
  son píldoras redondeadas (border-radius) en vez de líneas rectas — el
  bloque de diagnóstico también lleva la esquina superior izquierda
  redondeada. **Límite real de Word**: los bordes de tabla/párrafo de
  OOXML no admiten esquinas redondeadas, así que en el DOCX los campos de
  respuesta siguen siendo línea punteada (no píldora) — solo las casillas
  pudieron volverse circulares de verdad ahí.
- **El cuestionario (DOCX) usa el mismo lenguaje que la Ficha Interna**:
  fondo de página tiza, preguntas a línea limpia y respuestas en línea
  punteada (misma convención que `.answer-line` del PDF). Las casillas son
  un content control nativo de Word — clic para marcarlas, no hace falta
  teclear nada encima.
- **La Ficha Interna (PDF) termina con "Armonía de ángulos"**: 4 recuadros
  blancos, uno por foto (frontal, perfil izquierdo, perfil derecho,
  posterior/coronilla), para que el barbero esboce a mano los ángulos más
  marcados de cada vista y la corrección que busca.

| Documento | Formato | Lo rellena | Ruta fuente | Salida |
|---|---|---|---|---|
| Ficha Interna — Lectura Morfológica | PDF (A4, 2 páginas) | El barbero | `ficha-interna/` | `output/Dimension_Ficha_INTERNA_Lectura_Morfologica.pdf` |
| Cuestionario de Diagnóstico — Cliente | DOCX editable (A4) | El cliente | `cuestionario-cliente/` | `output/Dimension_Cuestionario_Cliente.docx` |

## Flujo de trabajo (3 pasos)

1. **Enviar el cuestionario al cliente.** Se le manda
   `Dimension_Cuestionario_Cliente.docx` (o su copia en Google Drive). El
   cliente lo rellena haciendo clic en las casillas interactivas y
   escribiendo en los campos grises.
2. **Recibir el cuestionario relleno y las 4 fotos** (frontal, perfil
   izquierdo, perfil derecho, posterior/coronilla) que el propio documento
   le pide al cliente en el aviso inicial.
3. **Cumplimentar la Ficha Interna y emitir el diagnóstico.** El barbero
   imprime o abre `Dimension_Ficha_INTERNA_Lectura_Morfologica.pdf`, lee la
   morfología directamente sobre las 4 fotos, marca las secciones 01 y 02, y
   cruza esa lectura con las respuestas del cuestionario del cliente para
   escribir el bloque final — Diagnóstico, Construcción recomendada, Motivo
   estructural y Qué evitar.

## Estructura

```
diagnostico/
  fuentes/                 Outfit, instanciada como .ttf estáticos
    instanciar.py           Script para regenerar los .ttf desde Google Fonts
  ficha-interna/            Fuente del PDF (HTML + CSS, WeasyPrint)
    ficha.html
    ficha.css
    build.py
    assets/marcas/          Marcas de esquina (SVG) para @page
  cuestionario-cliente/     Fuente del DOCX (Node + docx-js)
    dimension-lib.js         Helpers del sistema de diseño (color, tipografía, componentes)
    build-docx.js            Contenido del cuestionario y ensamblado del documento
    package.json
  output/                   PDF y DOCX generados (los dos entregables)
```

## Cómo regenerar los documentos

### Ficha Interna (PDF)

```bash
pip install weasyprint --break-system-packages   # una sola vez
cd diagnostico/ficha-interna
python3 build.py
```

Escribe `../output/Dimension_Ficha_INTERNA_Lectura_Morfologica.pdf`.

### Cuestionario Cliente (DOCX)

```bash
cd diagnostico/cuestionario-cliente
npm install       # una sola vez, instala docx (docx-js)
node build-docx.js
```

Escribe `../output/Dimension_Cuestionario_Cliente.docx`. El script usa
`unzip`/`zip` para un pequeño parche posterior al footer (ver comentario en
`build-docx.js`): convierte los campos de número de página a `fldSimple`
con un valor en caché correctamente formateado, así el pie de página no
queda mal estilizado antes de que Word/Google Docs recalculen los campos.

### Editar contenido o diseño

- Texto, preguntas y opciones de la Ficha Interna: editar `ficha.html`.
- Diseño compartido del PDF (color, tipografía, retícula, componentes):
  editar `ficha.css`.
- Texto, preguntas y secciones del Cuestionario: editar la lista `children`
  en `build-docx.js`.
- Componentes reutilizables del DOCX (kicker, cabecera de sección, campo de
  respuesta, checkbox, bloque de cierre): editar `dimension-lib.js`.
- Si cambian los pesos tipográficos necesarios, `fuentes/instanciar.py`
  vuelve a descargar las variable fonts de Google Fonts y las instancia.

### Verificar el resultado

```bash
# PDF
pdftoppm -jpeg -r 150 output/Dimension_Ficha_INTERNA_Lectura_Morfologica.pdf page

# DOCX (requiere LibreOffice)
python3 /mnt/skills/public/docx/scripts/office/soffice.py --headless --convert-to pdf output/Dimension_Cuestionario_Cliente.docx
pdftoppm -jpeg -r 130 Dimension_Cuestionario_Cliente.pdf page
```

Después, revisar las imágenes contra la lista de comprobación del brief:
cero rellenos negros, cero oro/champagne, Outfit correcta, sin las
palabras "método", "curso" o "corte de pelo", marcas de esquina en todas
las páginas del PDF, y ningún campo de respuesta separado de su pregunta
por un salto de página.
