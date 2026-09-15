/**
 * Construye el contenido del Cuestionario de Diagnóstico — Cliente y lo
 * empaqueta como .docx. Ejecutar con: node build-docx.js
 */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const os = require("os");
const L = require("./dimension-lib");

/**
 * docx-js emits PAGE/NUMPAGES fields as bare <w:fldChar begin/separate/end>
 * with no cached result run. Word recalculates that fine, but LibreOffice
 * (used here only to verify the render) draws the freshly computed digits
 * in the paragraph's default style instead of the field run's own <w:rPr>,
 * producing an oversized, wrongly-colored page number. Converting each
 * field to the equivalent <w:fldSimple> with an inline, correctly-styled
 * cached run fixes the preview and is what Word/Google Docs recalculate
 * text into anyway on open, so it changes nothing for the real target.
 */
function patchPageNumberFields(docxPath) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "docx-patch-"));
  execFileSync("unzip", ["-q", docxPath, "word/footer1.xml", "-d", tmp]);
  const footerPath = path.join(tmp, "word", "footer1.xml");
  let xml = fs.readFileSync(footerPath, "utf8");

  const rprMatch = xml.match(/<w:rPr>(.*?)<\/w:rPr>/);
  if (!rprMatch) throw new Error("No se encontró <w:rPr> en el footer para parchear los campos de página.");
  const rpr = rprMatch[1];

  const swap = (instr, cached) => {
    const oldFrag =
      `<w:r><w:rPr>${rpr}</w:rPr><w:fldChar w:fldCharType="begin"/>` +
      `<w:instrText xml:space="preserve">${instr}</w:instrText>` +
      `<w:fldChar w:fldCharType="separate"/><w:fldChar w:fldCharType="end"/></w:r>`;
    const newFrag = `<w:fldSimple w:instr="${instr}"><w:r><w:rPr>${rpr}</w:rPr><w:t>${cached}</w:t></w:r></w:fldSimple>`;
    const count = xml.split(oldFrag).length - 1;
    if (count !== 1) throw new Error(`Se esperaba 1 aparición del campo ${instr} en el footer, se encontraron ${count}.`);
    xml = xml.replace(oldFrag, newFrag);
  };
  swap("PAGE", "1");
  swap("NUMPAGES", "1");

  fs.writeFileSync(footerPath, xml, "utf8");
  execFileSync("zip", ["-q", path.resolve(docxPath), "word/footer1.xml"], { cwd: tmp });
  fs.rmSync(tmp, { recursive: true, force: true });
}

const {
  COLOR,
  FONT_DISPLAY,
  CONTENT_W,
  MARGIN,
  PAGE_W,
  PAGE_H,
  border,
  allBorders,
  spacer,
  run,
  masthead,
  sectionHeader,
  optionsInline,
  openQuestion,
  optionQuestion,
  optionQuestionList,
  Document,
  Packer,
  Paragraph,
  TextRun,
  Tab,
  PageNumber,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
  BorderStyle,
  VerticalAlign,
  TabStopType,
  Footer,
} = L;

// ---------------------------------------------------------------------------
// Aviso de las 4 fotos
// ---------------------------------------------------------------------------

function avisoFotos() {
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: CONTENT_W, type: WidthType.DXA },
            shading: { type: ShadingType.CLEAR, fill: COLOR.avisoFill, color: "auto" },
            borders: allBorders(0.75, COLOR.obsidiana),
            margins: { top: 220, bottom: 220, left: 280, right: 280 },
            children: [
              new Paragraph({
                spacing: { after: 140 },
                children: [run("LAS 4 FOTOS QUE NECESITO PARA LEER TU MORFOLOGÍA", { bold: true, size: 7.6, color: COLOR.grafito, tracking: 1.4 })],
              }),
              optionsInline(["Frontal", "Perfil izquierdo", "Perfil derecho", "Posterior / coronilla"], { after: 160 }),
              new Paragraph({
                children: [
                  run("Luz natural, sin gorra, con el pelo tal y como lo llevas a diario — sin peinar para la ocasión.", {
                    size: 8.3,
                    italics: true,
                    color: COLOR.grafitoSec,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// ---------------------------------------------------------------------------
// Sección 01 · Identificación — grid de campos cortos, mismo lenguaje de
// tarjeta "escribir" (tiza-campo + acento metal-oscuro) que el resto del
// documento, en dos columnas para que quepan cuatro campos cortos sin aire
// de sobra.
// ---------------------------------------------------------------------------

function fieldLabel(text) {
  return new Paragraph({
    spacing: { after: 100 },
    children: [run(text, { size: 6.8, bold: true, color: COLOR.grafitoSec, tracking: 1.4 })],
  });
}

function identCell(label, width) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: { type: ShadingType.CLEAR, fill: COLOR.tizaCampo, color: "auto" },
    borders: { ...allBorders(0.5, COLOR.metalClaro), left: border(1.5, COLOR.metalOscuro) },
    margins: { top: 140, bottom: 140, left: 220, right: 200 },
    children: [fieldLabel(label), new Paragraph({ children: [run("", { size: 9 })] })],
  });
}

function identGrid(rowsOfLabels) {
  const colW = CONTENT_W / 2;
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [colW, colW],
    rows: rowsOfLabels.map(([a, b]) => new TableRow({ cantSplit: true, children: [identCell(a, colW), identCell(b, colW)] })),
  });
}

// ---------------------------------------------------------------------------
// Bloque de cierre — sin relleno negro, mismo recurso que el diagnóstico del PDF
// ---------------------------------------------------------------------------

function bloqueCierre() {
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: CONTENT_W, type: WidthType.DXA },
            shading: { type: ShadingType.CLEAR, fill: COLOR.tizaCampo, color: "auto" },
            borders: {
              top: border(1.5, COLOR.obsidiana),
              left: border(2.5, COLOR.obsidiana),
              bottom: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            margins: { top: 260, bottom: 300, left: 320, right: 320 },
            children: [
              new Paragraph({
                spacing: { after: 140 },
                children: [run("AL TERMINAR", { bold: true, size: 7, color: COLOR.metal, tracking: 2.6 })],
              }),
              new Paragraph({
                children: [
                  run(
                    "Guárdalo y devuélvemelo junto a las cuatro fotos. A partir de ahí estudio tu morfología y te entrego un diagnóstico razonado: qué construcción te sostiene estructuralmente, por qué, y qué conviene evitar en tu caso.",
                    { size: 9.3, color: COLOR.grafito }
                  ),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// ---------------------------------------------------------------------------
// Pie de página
// ---------------------------------------------------------------------------

function footer() {
  const style = { font: "Inter", size: 6.6 * 2, color: COLOR.metal, characterSpacing: 1.6 * 20 };
  return new Footer({
    children: [
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_W }],
        children: [
          new TextRun({ text: "DIMENSION — ARQUITECTURA CAPILAR", ...style }),
          new TextRun({ children: [new Tab()], ...style }),
          new TextRun({ text: "FICHA ", ...style }),
          new TextRun({ children: [PageNumber.CURRENT], ...style }),
          new TextRun({ text: " / ", ...style }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], ...style }),
        ],
      }),
    ],
  });
}

// ---------------------------------------------------------------------------
// Cuerpo del documento
// ---------------------------------------------------------------------------

const children = [];

children.push(
  ...masthead({
    subtitle: "CUESTIONARIO DE DIAGNÓSTICO — PARA EL CLIENTE",
    entradilla: "Este cuestionario es la mitad de tu diagnóstico. La otra mitad la leo yo en tus fotos.",
    instrucciones: [
      "Contesta con honestidad, no con lo que suena mejor — una respuesta complaciente produce un diagnóstico equivocado.",
      "“No lo sé” es una respuesta válida.",
      "Las casillas son interactivas: haz clic para marcarlas. Escribe directamente sobre los campos grises.",
    ],
  })
);

children.push(spacer(220));
children.push(avisoFotos());
children.push(spacer(160));

// 01 · Identificación
children.push(...sectionHeader("01", "Identificación"));
children.push(
  identGrid([
    ["Nombre y apellidos", "Fecha de hoy"],
    ["Edad", "Teléfono o correo de contacto"],
  ])
);
children.push(spacer(260));

// 02 · Tu rutina capilar actual
children.push(...sectionHeader("02", "Tu rutina capilar actual"));
children.push(...openQuestion("¿Qué champú usas? (marca y nombre; si no lo recuerdas, “no lo sé”)"));
children.push(...openQuestion("¿Usas acondicionador, mascarilla o algún tratamiento capilar? ¿Cuál?"));
children.push(...optionQuestion("¿Qué producto de peinado usas?", ["Cera", "Pomada", "Fibra", "Spray", "Aceite", "Gel", "Ninguno"]));
children.push(...openQuestion("Marca y nombre de ese producto"));
children.push(...optionQuestion("Frecuencia de lavado:", ["A diario", "4–6/sem", "2–3/sem", "1 vez o menos"]));
children.push(...optionQuestion("¿Cómo lo secas?", ["Al aire", "Toalla", "Secador", "Secador y cepillo"]));
children.push(...openQuestion("¿Algún producto te ha dado problemas? (exceso de grasa, sequedad, picor, residuo…)"));
children.push(spacer(160));

// 03 · Tu día a día
children.push(...sectionHeader("03", "Tu día a día"));
children.push(...optionQuestion("Tiempo real de peinado:", ["Menos de 2 min", "2–5", "5–10", "Más de 10"]));
children.push(...optionQuestion("Deporte con sudoración:", ["A diario", "3–4/sem", "1–2/sem", "Casi nunca"]));
children.push(...openQuestion("¿Usas gorra, casco, uniforme o EPI con frecuencia? (cuál y cuántas horas al día)"));
children.push(
  ...optionQuestion("Código de imagen del entorno de trabajo:", ["Formal/traje", "Business casual", "Informal", "Creativo/libre", "Uniforme"])
);
children.push(
  ...optionQuestion("¿Cada cuánto puedes volver a la barbería, de forma realista?", ["2 sem", "3–4 sem", "5–8 sem", "Cuando puedo"])
);
children.push(spacer(160));

// 04 · Tu historial
children.push(...sectionHeader("04", "Tu historial"));
children.push(...openQuestion("¿Qué construcción o largo llevas ahora?"));
children.push(
  ...openQuestion(
    [{ text: "¿Qué construcción te has llevado antes que NO te funcionó? " }, { text: "¿Por qué crees que falló?", italic: true }],
    { tall: true }
  )
);
children.push(
  ...openQuestion(
    [
      { text: "El estilo con el que MÁS cómodo te has sentido en tu vida. " },
      { text: "Descríbelo y, sobre todo, explica por qué te sentías bien con él.", italic: true },
    ],
    { tall: true }
  )
);
children.push(...openQuestion("¿Qué es lo que más te molesta de tu cabello o tu cabeza en el día a día?"));
children.push(...openQuestion("¿Hay algo que un barbero te haya dicho antes sobre tu cabeza o tu cabello que recuerdes?"));
children.push(...openQuestion("¿Has llevado barba o vello facial? ¿Cómo te sentiste con ello?"));
children.push(spacer(160));

// 05 · Lo que buscas
children.push(...sectionHeader("05", "Lo que buscas"));
children.push(...optionQuestion("¿Qué buscas con este cambio?", ["Mantenimiento", "Transformación", "Resolver un problema concreto"]));
children.push(
  ...optionQuestion("Si es un problema concreto, ¿cuál?", ["Entradas", "Densidad", "Forma de la cabeza", "Encrespamiento", "Otro"])
);
children.push(
  ...openQuestion(
    [
      { text: "Describe con tus palabras cómo te gustaría verte al salir. " },
      { text: "No hace falta vocabulario técnico — di lo que sientes.", italic: true },
    ],
    { tall: true }
  )
);
children.push(
  ...optionQuestion(
    [{ text: "¿Qué quieres que transmita tu imagen? " }, { text: "(marca hasta dos)", italic: true }],
    ["Autoridad/seriedad", "Cercanía", "Juventud", "Discreción", "Carácter/ruptura", "Otro"]
  )
);
children.push(...openQuestion("¿Tienes alguna referencia visual en mente? (adjunta foto, o describe dónde la viste)"));
children.push(
  ...openQuestion([
    { text: "¿Qué NO quieres bajo ningún concepto? " },
    { text: "Sé concreto — esto me ahorra proponerte algo que vas a rechazar.", italic: true },
  ])
);
children.push(spacer(160));

// 06 · Tu margen de cambio
children.push(...sectionHeader("06", "Tu margen de cambio"));
children.push(
  new Paragraph({
    spacing: { after: 220 },
    children: [
      run(
        "Esta sección es la más importante del cuestionario. Me dice hasta dónde puedo llevarte sin traicionar lo que tú quieres.",
        { italics: true, size: 8.6, color: COLOR.grafitoSec }
      ),
    ],
  })
);
children.push(
  ...optionQuestionList("Apertura al cambio:", ["Muy conservador", "Cambio moderado", "Abierto a un cambio notable", "Confío plenamente en tu criterio"])
);
children.push(
  ...optionQuestionList(
    [{ text: "¿Cuáles de estas cosas estarías dispuesto a aceptar? " }, { text: "(marca todas las que apliquen)", italic: true }],
    [
      "Acortar mucho el largo actual",
      "Dejarlo crecer varios meses antes de la construcción definitiva",
      "Rapar o degradar mucho los laterales",
      "Descubrir la frente",
      "Peinar en la dirección en que crece, aunque no sea la que usas ahora",
      "Recortar, rediseñar o afeitar la barba para equilibrar el conjunto",
      "Cambiar por completo de productos",
      "Aumentar la frecuencia de visita a barbería",
      "Un cambio de carácter permanente o de transición larga (varios meses)",
    ]
  )
);
children.push(
  ...openQuestion([{ text: "¿Qué es innegociable para ti? " }, { text: "Lo que no vas a ceder pase lo que pase. Todos tenemos algo.", italic: true }])
);
children.push(...openQuestion("¿Hay una fecha o un evento para el que necesites estar listo?"));
children.push(
  ...optionQuestionList("Si mi diagnóstico contradice lo que tenías en mente, ¿qué prefieres?:", [
    "Que me lo digas directamente",
    "Que me lo digas, pero con alternativas",
    "Que respetes mi idea aunque no sea la óptima",
  ])
);
children.push(...openQuestion("¿Algo más que deba saber antes de estudiar tu caso?", { tall: true }));

children.push(spacer(160));
children.push(bloqueCierre());

// ---------------------------------------------------------------------------
// Documento
// ---------------------------------------------------------------------------

const doc = new Document({
  background: { color: COLOR.tiza },
  styles: {
    default: {
      document: {
        run: { font: "Inter", size: 18 },
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: PAGE_W, height: PAGE_H },
          margin: { top: MARGIN.top, bottom: MARGIN.bottom, left: MARGIN.left, right: MARGIN.right },
        },
      },
      footers: { default: footer() },
      children,
    },
  ],
});

const outDir = path.join(__dirname, "..", "output");
fs.mkdirSync(outDir, { recursive: true });
const dest = path.join(outDir, "Dimension_Cuestionario_Cliente.docx");

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(dest, buffer);
  patchPageNumberFields(dest);
  console.log("Generado:", dest);
});
