import { barberias, red } from '../datos';

export interface Punto { lat: number; lng: number }
export interface Lugar extends Punto { nombre: string; tipo: 'gps' | 'busqueda' | 'origen' }

export function distanciaKm(a: Punto, b: Punto): number {
  const R = 6371;
  const rad = (g: number) => (g * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

const formatoKm = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
const formatoKmEntero = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 });
export function formatearKm(km: number): string {
  return km < 10 ? formatoKm.format(km) : formatoKmEntero.format(km);
}

/** Península, Baleares, Canarias, Ceuta y Melilla (aproximado). */
export function estaEnEspana(p: Punto): boolean {
  const peninsula = p.lat >= 35.8 && p.lat <= 43.9 && p.lng >= -9.5 && p.lng <= 4.4;
  const canarias = p.lat >= 27.5 && p.lat <= 29.5 && p.lng >= -18.3 && p.lng <= -13.3;
  const ceutaMelilla = p.lat >= 35.2 && p.lat <= 36 && p.lng >= -5.5 && p.lng <= -2.8;
  return peninsula || canarias || ceutaMelilla;
}

export const origenRed: Lugar = { ...red.origen, tipo: 'origen' };

// Provincias de España: las dos primeras cifras del código postal indican la provincia.
// Coordenadas aproximadas de cada capital.
const PROVINCIAS: [string, string, number, number, string[]][] = [
  ['01', 'Álava', 42.846, -2.672, ['araba', 'vitoria', 'vitoria-gasteiz']],
  ['02', 'Albacete', 38.994, -1.858, []],
  ['03', 'Alicante', 38.345, -0.481, ['alacant']],
  ['04', 'Almería', 36.834, -2.464, []],
  ['05', 'Ávila', 40.656, -4.7, []],
  ['06', 'Badajoz', 38.879, -6.97, []],
  ['07', 'Illes Balears', 39.57, 2.65, ['baleares', 'islas baleares', 'mallorca', 'palma', 'palma de mallorca']],
  ['08', 'Barcelona', 41.387, 2.17, []],
  ['09', 'Burgos', 42.344, -3.697, []],
  ['10', 'Cáceres', 39.475, -6.372, []],
  ['11', 'Cádiz', 36.527, -6.288, []],
  ['12', 'Castellón', 39.986, -0.051, ['castello', 'castellon de la plana']],
  ['13', 'Ciudad Real', 38.985, -3.927, []],
  ['14', 'Córdoba', 37.888, -4.779, []],
  ['15', 'A Coruña', 43.362, -8.411, ['la coruña', 'coruña', 'coruna']],
  ['16', 'Cuenca', 40.07, -2.137, []],
  ['17', 'Girona', 41.979, 2.821, ['gerona']],
  ['18', 'Granada', 37.177, -3.599, []],
  ['19', 'Guadalajara', 40.633, -3.167, []],
  ['20', 'Gipuzkoa', 43.318, -1.981, ['guipuzcoa', 'san sebastian', 'donostia']],
  ['21', 'Huelva', 37.261, -6.945, []],
  ['22', 'Huesca', 42.136, -0.409, []],
  ['23', 'Jaén', 37.779, -3.785, []],
  ['24', 'León', 42.599, -5.567, []],
  ['25', 'Lleida', 41.618, 0.62, ['lerida']],
  ['26', 'La Rioja', 42.465, -2.445, ['logroño', 'logrono', 'rioja']],
  ['27', 'Lugo', 43.012, -7.556, []],
  ['28', 'Madrid', 40.417, -3.704, []],
  ['29', 'Málaga', 36.721, -4.421, []],
  ['30', 'Murcia', 37.992, -1.131, []],
  ['31', 'Navarra', 42.812, -1.645, ['pamplona', 'iruña']],
  ['32', 'Ourense', 42.336, -7.864, ['orense']],
  ['33', 'Asturias', 43.361, -5.849, ['oviedo']],
  ['34', 'Palencia', 42.01, -4.533, []],
  ['35', 'Las Palmas', 28.124, -15.43, ['gran canaria', 'las palmas de gran canaria']],
  ['36', 'Pontevedra', 42.431, -8.644, ['vigo']],
  ['37', 'Salamanca', 40.97, -5.664, []],
  ['38', 'Santa Cruz de Tenerife', 28.464, -16.251, ['tenerife']],
  ['39', 'Cantabria', 43.462, -3.81, ['santander']],
  ['40', 'Segovia', 40.943, -4.109, []],
  ['41', 'Sevilla', 37.389, -5.984, []],
  ['42', 'Soria', 41.764, -2.464, []],
  ['43', 'Tarragona', 41.119, 1.245, []],
  ['44', 'Teruel', 40.345, -1.106, []],
  ['45', 'Toledo', 39.863, -4.027, []],
  ['46', 'Valencia', 39.47, -0.376, ['valència']],
  ['47', 'Valladolid', 41.652, -4.724, []],
  ['48', 'Bizkaia', 43.263, -2.935, ['vizcaya', 'bilbao']],
  ['49', 'Zamora', 41.503, -5.745, []],
  ['50', 'Zaragoza', 41.649, -0.889, []],
  ['51', 'Ceuta', 35.889, -5.321, []],
  ['52', 'Melilla', 35.292, -2.938, []],
];

const normalizar = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();

/** Convierte lo que escribe el cliente (ciudad, provincia o CP) en un punto del mapa. */
export function buscarLugar(texto: string): Lugar | null {
  const q = normalizar(texto);
  if (!q) return null;

  if (/^\d{5}$/.test(q)) {
    // 1º: una barbería de la red con ese mismo código postal o la misma zona (3 primeras cifras).
    const exacta = barberias.find((b) => b.codigoPostal === q) ?? barberias.find((b) => b.codigoPostal.slice(0, 3) === q.slice(0, 3));
    if (exacta) return { ...exacta.coordenadas, nombre: q, tipo: 'busqueda' };
    // 2º: la capital de la provincia.
    const prov = PROVINCIAS.find((p) => p[0] === q.slice(0, 2));
    return prov ? { lat: prov[2], lng: prov[3], nombre: q, tipo: 'busqueda' } : null;
  }

  const enRed = barberias.find((b) => normalizar(b.ciudad) === q);
  if (enRed) return { ...enRed.coordenadas, nombre: enRed.ciudad, tipo: 'busqueda' };

  const prov = PROVINCIAS.find((p) => normalizar(p[1]) === q || p[4].some((a) => normalizar(a) === q));
  if (prov) return { lat: prov[2], lng: prov[3], nombre: prov[1], tipo: 'busqueda' };

  const parcial = PROVINCIAS.find((p) => q.length >= 4 && normalizar(p[1]).startsWith(q));
  if (parcial) return { lat: parcial[2], lng: parcial[3], nombre: parcial[1], tipo: 'busqueda' };

  return null;
}
