import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { barberias, textos } from '../datos';
import { Pantalla } from '../componentes/Base';

/**
 * Página interna (no aparece en los menús): /qr
 * Genera el código QR del cuestionario privado de cada barbería.
 */
export default function Qr() {
  const [codigos, setCodigos] = useState<Record<string, string>>({});

  useEffect(() => {
    Promise.all(
      barberias.map(async (b) => {
        const url = `${window.location.origin}/cuestionario/${b.id}`;
        const png = await QRCode.toDataURL(url, { width: 600, margin: 2, color: { dark: '#0d0e10', light: '#ffffff' } });
        return [b.id, png] as const;
      }),
    ).then((pares) => setCodigos(Object.fromEntries(pares)));
  }, []);

  return (
    <Pantalla titulo={textos.qr.titulo} volver>
      <p className="mb-6 text-tiza-suave">{textos.qr.intro}</p>
      <ul className="space-y-4">
        {barberias.map((b) => (
          <li key={b.id} className="flex items-center gap-4 rounded-md border border-linea bg-grafito p-4">
            {codigos[b.id] ? <img src={codigos[b.id]} alt="" className="h-24 w-24 rounded bg-white" /> : <div className="h-24 w-24 rounded bg-grafito-claro" />}
            <div className="min-w-0">
              <p className="font-medium">{b.nombre}</p>
              <p className="mb-2 truncate text-xs text-tiza-suave">/cuestionario/{b.id}</p>
              {codigos[b.id] && (
                <a href={codigos[b.id]} download={`qr-${b.id}.png`} className="text-sm underline decoration-linea underline-offset-4">
                  {textos.qr.descargar}
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Pantalla>
  );
}
