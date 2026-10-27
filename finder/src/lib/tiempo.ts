import { DIAS, type Barberia, type Dia } from '../datos';

/** Día de la semana y minuto del día en hora de Madrid, esté donde esté el móvil. */
export function ahoraEnMadrid(fecha = new Date()): { dia: Dia; minuto: number } {
  const partes = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Madrid',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(fecha);
  const v = (tipo: string) => partes.find((p) => p.type === tipo)?.value ?? '';
  const indice = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(v('weekday'));
  return { dia: DIAS[indice < 0 ? 0 : indice], minuto: Number(v('hour')) * 60 + Number(v('minute')) };
}

const aMinutos = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

export type EstadoApertura =
  | { abierto: true; hasta: string }
  | { abierto: false; abreA?: string };

export function estadoApertura(b: Barberia, ahora = ahoraEnMadrid()): EstadoApertura {
  const tramos = b.horario[ahora.dia] ?? [];
  for (const tramo of tramos) {
    const [a, z] = tramo.split('-');
    if (ahora.minuto >= aMinutos(a) && ahora.minuto < aMinutos(z)) return { abierto: true, hasta: z };
  }
  const siguiente = tramos.map((tr) => tr.split('-')[0]).find((a) => aMinutos(a) > ahora.minuto);
  return { abierto: false, abreA: siguiente };
}

/** Lee una fecha dd/mm/aaaa. */
export function leerFecha(texto: string): Date | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);
  return m ? new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]), 23, 59) : null;
}

export function selloVigente(b: Barberia, hoy = new Date()): boolean {
  const proxima = leerFecha(b.sello.proximaRevision);
  return !proxima || proxima >= hoy;
}
