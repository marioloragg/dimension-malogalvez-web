import type { Barberia } from '../datos';
import { textos } from '../datos';
import { selloVigente } from '../lib/tiempo';
import { IconoSello } from './Iconos';

/** Estado del Sello: vigente o en revisión periódica. */
export function EstadoSello({ b }: { b: Barberia }) {
  const vigente = selloVigente(b);
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] text-metal">
      <IconoSello width={15} height={15} />
      {vigente ? textos.sello.vigente : textos.sello.enRevision}
    </span>
  );
}

/** Bloque completo del Sello vivo con sus fechas, para la ficha. */
export function SelloVivo({ b }: { b: Barberia }) {
  const vigente = selloVigente(b);
  const filas: [string, string][] = [
    [textos.sello.ultimaRevision, b.sello.ultimaRevision],
    ...(vigente ? ([[textos.sello.proximaRevision, b.sello.proximaRevision]] as [string, string][]) : []),
    [textos.sello.certificadaDesde, b.sello.certificadaDesde],
  ];
  return (
    <div className="rounded-md border border-linea bg-grafito p-4">
      <div className="mb-3 flex items-center gap-2 text-metal">
        <IconoSello width={18} height={18} />
        <span className="font-medium tracking-wide">{vigente ? textos.sello.vigente : textos.sello.enRevision}</span>
      </div>
      <dl className="space-y-1.5 text-sm">
        {filas.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4">
            <dt className="text-tiza-suave">{k}</dt>
            <dd className="tabular-nums text-tiza">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
