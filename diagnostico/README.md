# Sistema de Diagnóstico de Visagismo Empático

Dos documentos generados por código que forman el diagnóstico previo de
**Dimension by Malo Gálvez**, con el mismo sistema de diseño (Cinzel + Inter,
rampa de grises obsidiana → grafito → metal-oscuro → metal → metal-claro →
perla → tiza-campo → tiza, cero rellenos negros):

- **El cuestionario (DOCX) es interactivo de verdad**: cada casilla es un
  content control nativo de Word (clic para marcar, no hay que teclear una
  X encima), la página tiene fondo tiza, y cada pregunta lleva un filete de
  acento a la izquierda que continúa por el borde de su tarjeta de
  respuesta — tarjetas tiza-campo (más claras que la página, "escribir") y
  tarjetas perla (algo más oscuras, "elegir") distinguen a simple vista qué
  tipo de campo es cada uno.
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
  fuentes/                 Cinzel e Inter, instanciadas como .ttf estáticos
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
cero rellenos negros, cero oro/champagne, Cinzel/Inter correctos, sin las
palabras "método", "curso" o "corte de pelo", marcas de esquina en todas
las páginas del PDF, y ningún campo de respuesta separado de su pregunta
por un salto de página.
