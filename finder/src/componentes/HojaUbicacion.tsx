import { useState } from 'react';
import { textos } from '../datos';
import { useUbicacion } from '../estado';
import type { Lugar } from '../lib/geo';
import { Boton } from './Base';
import { Buscador } from './Buscador';
import { IconoCerrar, IconoUbicacion } from './Iconos';

/**
 * Hoja que sube desde abajo. Explica para qué usamos la ubicación ANTES de que
 * Safari pida el permiso, y ofrece buscar por ciudad como alternativa.
 */
export function HojaUbicacion({ abierta, alCerrar, alTerminar, soloBuscar = false }: {
  abierta: boolean;
  alCerrar: () => void;
  alTerminar: () => void;
  soloBuscar?: boolean;
}) {
  const { pedirUbicacion, fijarLugar, aviso } = useUbicacion();
  const [modo, setModo] = useState<'permiso' | 'buscar'>(soloBuscar ? 'buscar' : 'permiso');
  const [buscando, setBuscando] = useState(false);

  if (!abierta) return null;

  const usarUbicacion = async () => {
    setBuscando(true);
    const r = await pedirUbicacion();
    setBuscando(false);
    if (r === 'denegada') setModo('buscar');
    else alTerminar();
  };

  const encontrado = (l: Lugar) => {
    fijarLugar(l);
    alTerminar();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true" aria-labelledby="hoja-titulo">
      <button className="absolute inset-0 bg-obsidiana/75 backdrop-blur-[2px]" onClick={alCerrar} aria-label={textos.general.volver} />
      <div className="aparece relative w-full max-w-xl rounded-t-xl border-t border-linea bg-grafito px-5 pb-[calc(env(safe-area-inset-bottom)+24px)] pt-5">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-linea" />
        <button onClick={alCerrar} className="absolute right-3 top-3 grid h-11 w-11 place-items-center text-tiza-suave" aria-label={textos.general.volver}>
          <IconoCerrar />
        </button>

        {modo === 'permiso' ? (
          <>
            <IconoUbicacion width={26} height={26} className="mb-3 text-metal" />
            <h2 id="hoja-titulo" className="mb-2 text-lg">{textos.ubicacion.titulo}</h2>
            <p className="mb-6 text-tiza-suave">{textos.ubicacion.texto}</p>
            <Boton className="w-full" onClick={usarUbicacion} disabled={buscando}>
              {buscando ? textos.ubicacion.buscando : textos.ubicacion.permitir}
            </Boton>
            <Boton variante="discreto" className="mt-2 w-full" onClick={() => setModo('buscar')}>
              {textos.ubicacion.alternativa}
            </Boton>
          </>
        ) : (
          <>
            <h2 id="hoja-titulo" className="mb-2 text-lg">{textos.buscador.titulo}</h2>
            {aviso && <p className="mb-4 text-sm text-tiza-suave">{aviso}</p>}
            <Buscador alEncontrar={encontrado} />
          </>
        )}
      </div>
    </div>
  );
}
