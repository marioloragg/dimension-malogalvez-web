/**
 * Genera el Cuestionario de Diagnóstico — Cliente (DOCX) de Dimension by Malo Gálvez.
 *
 * Uso: node build-docx.js
 * Escribe ../output/Dimension_Cuestionario_Cliente.docx
 *
 * Compatibilidad con Google Docs: anchos de tabla siempre en DXA (nunca
 * PERCENTAGE), sombreado siempre ShadingType.CLEAR (nunca SOLID), sin
 * cuadros de texto ni formas flotantes, sin "\n" (un Paragraph por línea).
 */
const fs = require("fs");
const path = require("path");
const {
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
  AlignmentType,
  VerticalAlign,
  TabStopType,
  Footer,
} = require("docx");

// ---------------------------------------------------------------------------
// Sistema de diseño Dimension
// ---------------------------------------------------------------------------

const COLOR = {
  obsidiana: "0C0C0E",
  grafito: "232326",
  grafitoSec: "55555A",
  metal: "AEB1B5",
  metalClaro: "D6D8DA",
  tiza: "F4F2EE",
  tizaCampo: "FAF9F7",
  avisoFill: "EFEDE8",
};

const FONT_DISPLAY = "Cinzel";
const FONT_BODY = "Inter";

const mmToDxa = (v) => Math.round(v * 56.6929133858);
const ptToHalfPt = (v) => Math.round(v * 2);
const ptToTracking = (v) => Math.round(v * 20);
const ptToEighths = (v) => Math.round(v * 8);

const PAGE_W = 11906; // A4, 210mm
const PAGE_H = 16838; // A4, 297mm
const MARGIN = {
  top: mmToDxa(26),
  bottom: mmToDxa(24),
  left: mmToDxa(18),
  right: mmToDxa(18),
};
const CONTENT_W = PAGE_W - MARGIN.left - MARGIN.right;

// ---------------------------------------------------------------------------
// Helpers de bajo nivel
// ---------------------------------------------------------------------------

function border(sizePt, color) {
  return { style: BorderStyle.SINGLE, size: ptToEighths(sizePt), color };
}

function allBorders(sizePt, color) {
  const b = border(sizePt, color);
  return { top: b, bottom: b, left: b, right: b };
}

/** Paragraph vacío usado solo como separador vertical entre bloques/tablas. */
function spacer(twips) {
  return new Paragraph({ spacing: { before: 0, after: twips }, children: [] });
}

function run(text, opts = {}) {
  return new TextRun({
    text,
    font: opts.font || FONT_BODY,
    size: ptToHalfPt(opts.size || 9),
    color: opts.color || COLOR.grafito,
    bold: !!opts.bold,
    italics: !!opts.italics,
    characterSpacing: opts.tracking ? ptToTracking(opts.tracking) : undefined,
  });
}

// ---------------------------------------------------------------------------
// Componentes de marca
// ---------------------------------------------------------------------------

function kicker(text) {
  return new Paragraph({
    spacing: { before: 0, after: 140 },
    children: [
      run("■  ", { size: 8, color: COLOR.obsidiana, bold: true }),
      run(text, { size: 7.6, bold: true, color: COLOR.grafitoSec, tracking: 3 }),
    ],
  });
}

function brandTitle() {
  return new Paragraph({
    spacing: { before: 0, after: 120 },
    children: [
      run("DIMENSION ", { font: FONT_DISPLAY, bold: true, size: 27, color: COLOR.obsidiana }),
      run("by Malo Gálvez", { font: FONT_DISPLAY, size: 27 * 0.62, color: COLOR.grafitoSec }),
    ],
  });
}

function docSubtitle(text) {
  return new Paragraph({
    spacing: { before: 0, after: 100 },
    children: [run(text, { size: 10.5, color: COLOR.grafito, tracking: 2.4 })],
  });
}

function docNoteBold(text) {
  return new Paragraph({
    spacing: { before: 0, after: 160 },
    children: [run(text, { size: 9.6, bold: true, color: COLOR.grafito })],
  });
}

function masthead({ subtitle, entradilla, instrucciones }) {
  const children = [
    kicker("Arquitectura Capilar · Visagismo Empático"),
    brandTitle(),
    docSubtitle(subtitle),
    docNoteBold(entradilla),
  ];
  instrucciones.forEach((line) => {
    children.push(
      new Paragraph({
        spacing: { after: 60 },
        children: [run(line, { size: 8.6, color: COLOR.grafitoSec })],
      })
    );
  });
  children.push(
    new Paragraph({
      spacing: { before: 160, after: 0 },
      border: { bottom: border(1.1, COLOR.obsidiana) },
      children: [],
    })
  );
  return children;
}

/** Cabecera de sección: número Cinzel en columna fija + título Inter, sobre un filete. */
function sectionHeader(num, title) {
  const numColWidth = mmToDxa(13);
  const titleColWidth = CONTENT_W - numColWidth;
  const bottomRule = border(0.6, COLOR.metalClaro);
  const noBorderSides = { top: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } };

  return [
    spacer(260),
    new Table({
      width: { size: CONTENT_W, type: WidthType.DXA },
      columnWidths: [numColWidth, titleColWidth],
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: numColWidth, type: WidthType.DXA },
              borders: { ...noBorderSides, bottom: bottomRule },
              margins: { bottom: 90 },
              verticalAlign: VerticalAlign.BOTTOM,
              children: [new Paragraph({ children: [run(num, { font: FONT_DISPLAY, bold: true, size: 13, color: COLOR.metal })] })],
            }),
            new TableCell({
              width: { size: titleColWidth, type: WidthType.DXA },
              borders: { ...noBorderSides, bottom: bottomRule },
              margins: { bottom: 90 },
              verticalAlign: VerticalAlign.BOTTOM,
              children: [new Paragraph({ children: [run(title, { bold: true, size: 10.2, color: COLOR.grafito, tracking: 1.8 })] })],
            }),
          ],
        }),
      ],
    }),
    spacer(180),
  ];
}

/** Texto de pregunta. `parts` es un string o un array de {text, italic}. */
function questionText(parts, { before = 200, after = 100 } = {}) {
  const segments = Array.isArray(parts) ? parts : [{ text: parts }];
  const children = segments.map((p) =>
    run(p.text, { size: 8.9, italics: !!p.italic, color: p.italic ? COLOR.grafitoSec : COLOR.grafito })
  );
  return new Paragraph({ spacing: { before, after }, keepNext: true, children });
}

/** Opciones marcables en línea, separadas por espacio (❑  Etiqueta). */
function optionsInline(labels, { after = 220 } = {}) {
  const children = [];
  labels.forEach((label, i) => {
    if (i > 0) children.push(run("     ", { size: 8.7 }));
    children.push(run("❑  ", { size: 8.7, color: COLOR.obsidiana }));
    children.push(run(label, { size: 8.7, color: COLOR.grafito }));
  });
  return new Paragraph({ spacing: { after }, children });
}

/** Opciones marcables, una por línea (para listas largas de checkboxes). */
function optionsList(labels, { after = 90, lastAfter = 220 } = {}) {
  return labels.map(
    (label, i) =>
      new Paragraph({
        spacing: { after: i === labels.length - 1 ? lastAfter : after },
        children: [run("❑  ", { size: 8.7, color: COLOR.obsidiana }), run(label, { size: 8.7, color: COLOR.grafito })],
      })
  );
}

/** Campo de respuesta: tabla de una sola celda con fondo tiza-campo. */
function answerBox({ tall = false, after = 260 } = {}) {
  const lineCount = tall ? 3 : 1;
  const paras = Array.from({ length: lineCount }, () => new Paragraph({ children: [run("", { size: 9 })] }));
  return [
    new Table({
      width: { size: CONTENT_W, type: WidthType.DXA },
      columnWidths: [CONTENT_W],
      rows: [
        new TableRow({
          cantSplit: true,
          children: [
            new TableCell({
              width: { size: CONTENT_W, type: WidthType.DXA },
              shading: { type: ShadingType.CLEAR, fill: COLOR.tizaCampo, color: "auto" },
              borders: allBorders(0.25, COLOR.metalClaro),
              margins: { top: 140, bottom: 140, left: 160, right: 160 },
              children: paras,
            }),
          ],
        }),
      ],
    }),
    spacer(after),
  ];
}

/** Pregunta abierta completa: texto + campo de respuesta. */
function openQuestion(parts, { tall = false, before = 200 } = {}) {
  return [questionText(parts, { before }), ...answerBox({ tall })];
}

/** Pregunta con opciones marcables en línea. */
function optionQuestion(parts, labels, { before = 200 } = {}) {
  return [questionText(parts, { before }), optionsInline(labels)];
}

module.exports = {
  COLOR,
  FONT_DISPLAY,
  FONT_BODY,
  mmToDxa,
  ptToHalfPt,
  ptToTracking,
  ptToEighths,
  PAGE_W,
  PAGE_H,
  MARGIN,
  CONTENT_W,
  border,
  allBorders,
  spacer,
  run,
  kicker,
  brandTitle,
  docSubtitle,
  docNoteBold,
  masthead,
  sectionHeader,
  questionText,
  optionsInline,
  optionsList,
  answerBox,
  openQuestion,
  optionQuestion,
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
  AlignmentType,
  VerticalAlign,
  TabStopType,
  Footer,
};
