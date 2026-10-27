import { Link } from 'react-router-dom';
import type { Barberia } from '../datos';
import { t, textos } from '../datos';
import { estadoApertura } from '../lib/tiempo';
import { formatearKm } from '../lib/geo';
import { EstadoSello } from './Sello';
import { EtiquetaPrueba } from './Base';
import { IconoFlecha } from './Iconos';

export function TextoApertura({ b }: { b: Barberia }) {
  const e = estadoApertura(b);
  if (e.abierto) return <span className="text-tiza">{t(textos.tarjeta.abierto, { hora: e.hasta })}</span>;
  return <span className="text-tiza-suave">{e.abreA ? t(textos.tarjeta.abreA, { hora: e.abreA }) : textos.tarjeta.cerrado}</span>;
}

export function Tarjeta({ b, km, compacta = false }: { b: Barberia; km?: number; compacta?: boolean }) {
  const barbero = b.barberosCertificados[0];
  return (
    <article className="rounded-md border border-linea bg-grafito">
      <Link to={`/barberia/${b.id}`} className="pulsable block p-4 active:bg-grafito-claro">
        <div className="mb-1 flex items-start justify-between gap-3">
          <h3 className="text-[17px]">{b.nombre}</h3>
          {km !== undefined && (
            <span className="shrink-0 pt-0.5 text-sm tabular-nums text-metal">{t(textos.tarjeta.aKm, { km: formatearKm(km) })}</span>
          )}
        </div>
        <p className="text-sm text-tiza-suave">
          {b.ciudad} · {b.direccion}
        </p>
        {!compacta && (
          <p className="mt-3 text-sm">
            <span className="text-tiza-suave">{textos.tarjeta.certificado}: </span>
            {barbero.nombre}
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px]">
          <EstadoSello b={b} />
          <TextoApertura b={b} />
          {b.datosDePrueba && <EtiquetaPrueba />}
        </div>
      </Link>
      <div className="flex border-t border-linea">
        <a
          href={barbero.enlaceReserva || b.reserva.enlace}
          target="_blank"
          rel="noopener noreferrer"
          className="pulsable flex min-h-12 flex-1 items-center justify-center text-[15px] font-medium text-tiza active:bg-grafito-claro"
        >
          {textos.tarjeta.reservar}
        </a>
        <Link
          to={`/barberia/${b.id}`}
          className="pulsable flex min-h-12 flex-1 items-center justify-center gap-1.5 border-l border-linea text-[15px] text-tiza-suave active:bg-grafito-claro"
        >
          {textos.tarjeta.verFicha} <IconoFlecha width={16} height={16} />
        </Link>
      </div>
    </article>
  );
}
