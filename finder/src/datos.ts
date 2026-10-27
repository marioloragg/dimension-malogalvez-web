// Puente entre los archivos de datos/ y la app. No hace falta tocarlo:
// para cambiar barberías, textos o colores, edita los archivos de datos/.
import barberiasJson from '../datos/barberias.json';
import textosJson from '../datos/textos.json';
import marcaJson from '../datos/marca.json';
import ciudadesJson from '../datos/ciudades.json';

export type Dia = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo';
export const DIAS: Dia[] = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

export interface Barberia {
  id: string;
  activo: boolean;
  datosDePrueba: boolean;
  nombre: string;
  pais: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  direccion: string;
  coordenadas: { lat: number; lng: number };
  telefono: string;
  instagram: string;
  reserva: { plataforma: string; enlace: string };
  barberosCertificados: { nombre: string; itinerario: string; fechaCertificacion: string; enlaceReserva?: string }[];
  sello: { certificadaDesde: string; ultimaRevision: string; proximaRevision: string };
  horario: Record<Dia, string[]>;
  servicios: string[];
  fotos: { archivo: string; descripcion: string }[];
  notaPrimeraVisita?: string;
}

export const textos = textosJson;
export const marca = marcaJson;
export const red = ciudadesJson;

// Solo las barberías con el Sello activo existen para la app.
export const barberias: Barberia[] = (barberiasJson.barberias as Barberia[]).filter((b) => b.activo);

export const ciudadesActivas: string[] = [...new Set(barberias.map((b) => b.ciudad))].sort((a, b) => a.localeCompare(b, 'es'));
export const ciudadesProximas: string[] = red.proximas.filter((c) => !ciudadesActivas.includes(c));

export function buscarBarberia(id: string | undefined): Barberia | undefined {
  return barberias.find((b) => b.id === id);
}

/** Sustituye {marcas} de un texto por valores: t('a {km} km', { km: '2,1' }) */
export function t(texto: string, valores: Record<string, string | number> = {}): string {
  return texto.replace(/\{(\w+)\}/g, (_, k) => (k in valores ? String(valores[k]) : `{${k}}`));
}

export function enlaceWeb(clave: keyof typeof marca.web.enlaces): string {
  return marca.web.base.replace(/\/$/, '') + marca.web.enlaces[clave];
}

export function nombreServicio(clave: string): string {
  return (textos.servicios as Record<string, string>)[clave] ?? clave;
}
