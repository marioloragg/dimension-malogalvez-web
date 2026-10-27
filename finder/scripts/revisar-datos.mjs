// Revisor automático de los datos de Dimension Finder.
//
// Se ejecuta solo antes de cada publicación. Si encuentra un error,
// la publicación se detiene y la versión anterior sigue en internet.
//
// Uso:
//   node scripts/revisar-datos.mjs               → revisa todo
//   node scripts/revisar-datos.mjs --revisiones  → solo avisa de revisiones del Sello vencidas o próximas

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const carpetaDatos = join(dirname(fileURLToPath(import.meta.url)), '..', 'datos');
const soloRevisiones = process.argv.includes('--revisiones');

const errores = [];
const avisos = [];

const PALABRAS_PROHIBIDAS = ['método', 'metodo', 'curso', 'cursos', 'corte de pelo', 'descuento', 'descuentos', 'oferta', 'ofertas', 'promoción', 'promociones', 'rebaja', 'rebajas'];
const DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
const DIAS_AVISO_REVISION = 30;

function leerJson(nombre) {
  const ruta = join(carpetaDatos, nombre);
  const texto = readFileSync(ruta, 'utf8');
  try {
    return JSON.parse(texto);
  } catch (e) {
    const pos = Number((/position (\d+)/.exec(e.message) || [])[1]);
    let donde = '';
    if (!Number.isNaN(pos)) {
      const antes = texto.slice(0, pos).split('\n');
      donde = ` (línea ${antes.length}, columna ${antes[antes.length - 1].length + 1})`;
    }
    errores.push(
      `${nombre}: el archivo no se puede leer${donde}. ` +
        'Suele ser una coma de más o de menos, o unas comillas sin cerrar justo antes de ese punto.',
    );
    return null;
  }
}

function fecha(texto) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto || '');
  if (!m) return null;
  const d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
  if (d.getDate() !== Number(m[1]) || d.getMonth() !== Number(m[2]) - 1) return null;
  return d;
}

function buscarPalabrasProhibidas(valor, archivo, ruta = '') {
  if (typeof valor === 'string') {
    const t = valor.toLowerCase();
    for (const p of PALABRAS_PROHIBIDAS) {
      if (new RegExp(`(^|[^a-záéíóúñü])${p}([^a-záéíóúñü]|$)`, 'i').test(t)) {
        errores.push(`${archivo}: la palabra «${p}» no está permitida (en ${ruta || 'el texto'}).`);
      }
    }
  } else if (Array.isArray(valor)) {
    valor.forEach((v, i) => buscarPalabrasProhibidas(v, archivo, `${ruta}[${i + 1}]`));
  } else if (valor && typeof valor === 'object') {
    for (const [k, v] of Object.entries(valor)) {
      if (k.startsWith('_')) continue; // las líneas de ayuda no se revisan
      buscarPalabrasProhibidas(v, archivo, ruta ? `${ruta}.${k}` : k);
    }
  }
}

function minutos(hhmm) {
  const m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(hhmm);
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
}

function revisarBarberia(b, i, servicios, ids) {
  const quien = `Barbería ${i + 1}${b && b.nombre ? ` («${b.nombre}»)` : ''}`;
  const err = (t) => errores.push(`barberias.json · ${quien}: ${t}`);

  if (!b || typeof b !== 'object') return err('no es un bloque válido.');

  if (!b.id || !/^[a-z0-9-]+$/.test(b.id)) err('"id" debe ir en minúsculas, sin espacios ni tildes (usa guiones). Ej.: "estudio-ruzafa".');
  else if (ids.has(b.id)) err(`el id "${b.id}" está repetido. Cada barbería necesita uno distinto.`);
  else ids.add(b.id);

  if (typeof b.activo !== 'boolean') err('"activo" debe ser true o false, sin comillas.');
  if (typeof b.datosDePrueba !== 'boolean') err('"datosDePrueba" debe ser true o false, sin comillas.');
  for (const campo of ['nombre', 'ciudad', 'provincia', 'direccion', 'pais']) {
    if (typeof b[campo] !== 'string' || !b[campo].trim()) err(`falta "${campo}".`);
  }
  if (b.pais && !/^[A-Z]{2}$/.test(b.pais)) err('"pais" son dos letras mayúsculas. España: "ES".');
  if (b.pais === 'ES' && !/^(0[1-9]|[1-4]\d|5[0-2])\d{3}$/.test(b.codigoPostal || '')) {
    err(`"codigoPostal" debe tener 5 cifras y entre comillas (ahora: ${JSON.stringify(b.codigoPostal)}).`);
  }
  const c = b.coordenadas;
  if (!c || typeof c.lat !== 'number' || typeof c.lng !== 'number' || Math.abs(c.lat) > 90 || Math.abs(c.lng) > 180) {
    err('"coordenadas" necesita "lat" y "lng" como números, sin comillas. Ej.: { "lat": 39.4699, "lng": -0.3763 }.');
  } else if (b.pais === 'ES' && (c.lat < 27 || c.lat > 44.5 || c.lng < -18.5 || c.lng > 4.5)) {
    err('las coordenadas quedan fuera de España. ¿Has intercambiado "lat" y "lng", o falta el signo menos?');
  }
  if (b.telefono && !/^\+\d{2,3}( ?\d){8,12}$/.test(b.telefono)) err('"telefono" debe empezar por +34. Ej.: "+34 600 000 000".');
  if (b.instagram && /[@\s/]/.test(b.instagram)) err('"instagram" es solo el usuario, sin @, sin espacios y sin enlace.');
  if (!b.reserva || !/^https:\/\//.test(b.reserva.enlace || '')) err('"reserva.enlace" debe empezar por https://');

  if (!Array.isArray(b.barberosCertificados) || b.barberosCertificados.length === 0) {
    err('necesita al menos un barbero en "barberosCertificados". Sin barbero certificado no hay Sello.');
  } else {
    b.barberosCertificados.forEach((p, j) => {
      if (!p.nombre) err(`al barbero ${j + 1} le falta "nombre".`);
      if (p.itinerario !== 'Experto') err(`el barbero ${j + 1} debe tener "itinerario": "Experto".`);
      if (!fecha(p.fechaCertificacion)) err(`la "fechaCertificacion" del barbero ${j + 1} debe ser dd/mm/aaaa.`);
      if (p.enlaceReserva && !/^https:\/\//.test(p.enlaceReserva)) err(`el "enlaceReserva" del barbero ${j + 1} debe empezar por https://`);
    });
  }

  const s = b.sello || {};
  const desde = fecha(s.certificadaDesde);
  const ultima = fecha(s.ultimaRevision);
  const proxima = fecha(s.proximaRevision);
  if (!desde) err('"sello.certificadaDesde" debe ser una fecha real con formato dd/mm/aaaa.');
  if (!ultima) err('"sello.ultimaRevision" debe ser una fecha real con formato dd/mm/aaaa.');
  if (!proxima) err('"sello.proximaRevision" debe ser una fecha real con formato dd/mm/aaaa.');
  if (ultima && proxima && proxima <= ultima) err('la próxima revisión debe ser posterior a la última.');
  if (ultima && proxima) {
    const meses = (proxima - ultima) / (1000 * 60 * 60 * 24 * 30.44);
    if (meses > 18.5) avisos.push(`${quien}: entre revisiones hay más de 18 meses.`);
  }

  if (!b.horario || typeof b.horario !== 'object') {
    err('falta "horario".');
  } else {
    for (const dia of DIAS) {
      const tramos = b.horario[dia];
      if (!Array.isArray(tramos)) {
        err(`falta el día "${dia}" en el horario (usa [] si está cerrado).`);
        continue;
      }
      for (const t of tramos) {
        const [a, z] = String(t).split('-');
        const ma = minutos(a);
        const mz = minutos(z);
        if (ma === null || mz === null || mz <= ma) err(`el tramo "${t}" del ${dia} no es válido. Formato: "10:00-14:00" (24 h).`);
      }
    }
    for (const dia of Object.keys(b.horario)) {
      if (!DIAS.includes(dia)) err(`"${dia}" no es un día válido. Escribe: ${DIAS.join(', ')} (sin tildes).`);
    }
  }

  if (!Array.isArray(b.servicios)) err('"servicios" debe ser una lista entre corchetes [ ].');
  else for (const sv of b.servicios) if (!servicios.includes(sv)) err(`el servicio "${sv}" no existe. Posibles: ${servicios.join(', ')}.`);

  if (!Array.isArray(b.fotos)) err('"fotos" debe ser una lista (puede estar vacía: []).');
  else b.fotos.forEach((f, j) => { if (!f.archivo || !f.descripcion) err(`a la foto ${j + 1} le falta "archivo" o "descripcion".`); });
}

function revisarRevisiones(barberias) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const pendientes = [];
  for (const b of barberias) {
    if (!b || !b.activo) continue;
    const proxima = fecha(b.sello && b.sello.proximaRevision);
    if (!proxima) continue;
    const dias = Math.round((proxima - hoy) / 86400000);
    if (dias < 0) pendientes.push(`«${b.nombre}»: la revisión venció el ${b.sello.proximaRevision}. La app muestra "En revisión periódica".`);
    else if (dias <= DIAS_AVISO_REVISION) pendientes.push(`«${b.nombre}»: revisión prevista el ${b.sello.proximaRevision} (faltan ${dias} días).`);
  }
  return pendientes;
}

// ---------- Revisión ----------

const barberiasJson = leerJson('barberias.json');
const textos = leerJson('textos.json');
const marca = leerJson('marca.json');
const ciudades = leerJson('ciudades.json');

const barberias = barberiasJson && Array.isArray(barberiasJson.barberias) ? barberiasJson.barberias : [];
if (barberiasJson && !Array.isArray(barberiasJson.barberias)) errores.push('barberias.json: falta la lista "barberias".');

if (soloRevisiones) {
  const pendientes = revisarRevisiones(barberias);
  if (pendientes.length) {
    console.log('\nRevisiones del Sello que requieren atención:\n');
    pendientes.forEach((p) => console.log('  ⚠ ' + p));
    console.log('\nCuando hagas la revisión, actualiza "ultimaRevision" y "proximaRevision" en datos/barberias.json.\n');
    process.exit(1);
  }
  console.log('✔ Ninguna revisión del Sello vencida ni en los próximos 30 días.');
  process.exit(errores.length ? 1 : 0);
}

const servicios = textos && textos.servicios ? Object.keys(textos.servicios) : [];
const ids = new Set();
barberias.forEach((b, i) => revisarBarberia(b, i, servicios, ids));
revisarRevisiones(barberias).forEach((p) => avisos.push(p));

if (textos) buscarPalabrasProhibidas(textos, 'textos.json');
if (barberiasJson) buscarPalabrasProhibidas(barberiasJson, 'barberias.json');

if (marca) {
  for (const [grupo, colores] of [['colores', marca.colores], ['mapa', marca.mapa]]) {
    for (const [k, v] of Object.entries(colores || {})) {
      if (!/^#[0-9a-fA-F]{6}$/.test(v)) errores.push(`marca.json: el color "${grupo}.${k}" debe tener el formato #RRGGBB (ahora: ${JSON.stringify(v)}).`);
    }
  }
  if (!marca.web || !/^https:\/\//.test(marca.web.base || '')) errores.push('marca.json: "web.base" debe empezar por https://');
}

if (ciudades) {
  const o = ciudades.origen;
  if (!o || typeof o.lat !== 'number' || typeof o.lng !== 'number') errores.push('ciudades.json: "origen" necesita "lat" y "lng" como números.');
  if (typeof ciudades.radioCercaKm !== 'number') errores.push('ciudades.json: "radioCercaKm" debe ser un número, sin comillas.');
  if (!Array.isArray(ciudades.proximas)) errores.push('ciudades.json: "proximas" debe ser una lista entre corchetes [ ].');
}

const activas = barberias.filter((b) => b && b.activo).length;
if (!errores.length && activas === 0) avisos.push('No hay ninguna barbería activa: la app mostrará solo la pantalla de expansión.');

console.log('\nRevisor de datos · Dimension Finder');
if (avisos.length) {
  console.log('\nAvisos (no impiden publicar):');
  avisos.forEach((a) => console.log('  ⚠ ' + a));
}
if (errores.length) {
  console.log('\nErrores (hay que corregirlos para publicar):');
  errores.forEach((e) => console.log('  ✖ ' + e));
  console.log(`\n${errores.length} error(es). La versión anterior de la app sigue publicada.\n`);
  process.exit(1);
}
console.log(`\n✔ Todo correcto: ${barberias.length} barberías (${activas} activas).\n`);
