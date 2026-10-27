import { lazy, Suspense, useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { barberias, ciudadesActivas, nombreServicio, red, t, textos } from '../datos';
import { useUbicacion } from '../estado';
import { distanciaKm } from '../lib/geo';
import { estadoApertura } from '../lib/tiempo';
import { Tarjeta } from '../componentes/Tarjeta';
import { Expansion } from '../componentes/Expansion';
import { HojaUbicacion } from '../componentes/HojaUbicacion';
import { Boton } from '../componentes/Base';
import { IconoLista, IconoMapa } from '../componentes/Iconos';

// El mapa pesa bastante: solo se descarga cuando el cliente lo abre.
const Mapa = lazy(() => import('../componentes/Mapa'));

const SERVICIOS = Object.keys(textos.servicios);

function Chip({ activo, onClick, children }: { activo: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={activo}
      className={`pulsable h-9 shrink-0 rounded-full border px-3.5 text-[13px] ${activo ? 'border-tiza bg-tiza text-obsidiana' : 'border-linea bg-grafito text-tiza'}`}
    >
      {children}
    </button>
  );
}

export default function Red() {
  const { lugar, aviso } = useUbicacion();
  const [params, setParams] = useSearchParams();
  const vista = params.get('vista') === 'mapa' ? 'mapa' : 'lista';
  const [ciudad, setCiudad] = useState('');
  const [abierto, setAbierto] = useState(false);
  const [servicio, setServicio] = useState('');
  const [seleccionada, setSeleccionada] = useState<string | null>(null);
  const [hoja, setHoja] = useState(false);
  const [verTodaLaRed, setVerTodaLaRed] = useState(false);

  const ordenadas = useMemo(
    () => barberias.map((b) => ({ b, km: distanciaKm(lugar, b.coordenadas) })).sort((x, y) => x.km - y.km),
    [lugar],
  );
  const filtradas = ordenadas.filter(
    ({ b }) => (!ciudad || b.ciudad === ciudad) && (!abierto || estadoApertura(b).abierto) && (!servicio || b.servicios.includes(servicio)),
  );
  const lejos = lugar.tipo !== 'origen' && (ordenadas.length === 0 || ordenadas[0].km > red.radioCercaKm);
  const mostrarExpansion = (lejos && !verTodaLaRed) || barberias.length === 0;
  const alSeleccionar = useCallback((id: string) => setSeleccionada(id), []);

  const cambiarVista = (v: 'lista' | 'mapa') => {
    setParams(v === 'mapa' ? { vista: 'mapa' } : {}, { replace: true });
    setSeleccionada(null);
  };

  const quitarFiltros = () => {
    setCiudad('');
    setAbierto(false);
    setServicio('');
  };

  const controles = (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl">{textos.red.titulo}</h1>
        <div className="flex rounded-md border border-linea bg-grafito p-0.5" role="tablist">
          {(['lista', 'mapa'] as const).map((v) => (
            <button
              key={v}
              role="tab"
              aria-selected={vista === v}
              onClick={() => cambiarVista(v)}
              className={`pulsable flex h-9 items-center gap-1.5 rounded px-3 text-[13px] ${vista === v ? 'bg-grafito-claro text-tiza' : 'text-tiza-suave'}`}
            >
              {v === 'lista' ? <IconoLista width={16} height={16} /> : <IconoMapa width={16} height={16} />}
              {v === 'lista' ? textos.red.vistaLista : textos.red.vistaMapa}
            </button>
          ))}
        </div>
      </div>
      <p className="flex items-center justify-between gap-2 text-[13px] text-tiza-suave">
        <span>{t(textos.red.ordenDistancia, { lugar: lugar.nombre })}</span>
        <button onClick={() => setHoja(true)} className="pulsable shrink-0 text-tiza underline decoration-linea underline-offset-4">
          {textos.red.cambiarUbicacion}
        </button>
      </p>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]" aria-label={textos.filtros.titulo}>
        <label className={`relative flex h-9 shrink-0 items-center rounded-full border px-3.5 text-[13px] ${ciudad ? 'border-tiza bg-tiza text-obsidiana' : 'border-linea bg-grafito'}`}>
          <span className="sr-only">{textos.filtros.ciudad}</span>
          {ciudad || `${textos.filtros.ciudad}: ${textos.filtros.todasCiudades}`}
          <select value={ciudad} onChange={(e) => setCiudad(e.target.value)} className="absolute inset-0 opacity-0">
            <option value="">{textos.filtros.todasCiudades}</option>
            {ciudadesActivas.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <Chip activo={abierto} onClick={() => setAbierto(!abierto)}>{textos.filtros.abiertoAhora}</Chip>
        {SERVICIOS.map((s) => (
          <Chip key={s} activo={servicio === s} onClick={() => setServicio(servicio === s ? '' : s)}>{nombreServicio(s)}</Chip>
        ))}
      </div>
      {aviso && <p className="rounded-md border border-linea bg-grafito px-3 py-2 text-[13px] text-tiza-suave">{aviso}</p>}
    </div>
  );

  const hojaUbicacion = (
    <HojaUbicacion key={String(hoja)} abierta={hoja} alCerrar={() => setHoja(false)} alTerminar={() => { setHoja(false); setVerTodaLaRed(false); }} />
  );

  if (mostrarExpansion) {
    return (
      <main className="aparece mx-auto max-w-xl px-4 pb-28 pt-[calc(env(safe-area-inset-top)+16px)]">
        {controles}
        <div className="mt-6">
          <Expansion lugar={lugar.nombre} alVerRed={barberias.length ? () => setVerTodaLaRed(true) : undefined} />
        </div>
        {hojaUbicacion}
      </main>
    );
  }

  const sinResultados = (
    <div className="rounded-md border border-linea bg-grafito p-5 text-center">
      <p className="mb-3 text-tiza-suave">{textos.red.sinResultadosFiltros}</p>
      <Boton variante="secundario" onClick={quitarFiltros}>{textos.red.quitarFiltros}</Boton>
    </div>
  );

  if (vista === 'mapa') {
    const sel = filtradas.find((x) => x.b.id === seleccionada) ?? null;
    return (
      <main className="fixed inset-0 bottom-[calc(64px+env(safe-area-inset-bottom))]">
        <Suspense fallback={<div className="absolute inset-0 bg-grafito" />}>
          <Mapa barberias={filtradas.map((x) => x.b)} lugar={lugar} seleccionada={seleccionada} alSeleccionar={alSeleccionar} />
        </Suspense>
        <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-obsidiana via-obsidiana/90 to-transparent px-4 pb-8 pt-[calc(env(safe-area-inset-top)+16px)]">
          <div className="pointer-events-auto mx-auto max-w-xl">{controles}</div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 px-4 pb-9">
          <div className="pointer-events-auto mx-auto max-w-xl">
            {sel ? (
              <div className="aparece" key={sel.b.id}><Tarjeta b={sel.b} km={sel.km} compacta /></div>
            ) : filtradas.length === 0 ? (
              sinResultados
            ) : null}
          </div>
        </div>
        {hojaUbicacion}
      </main>
    );
  }

  return (
    <main className="aparece mx-auto max-w-xl px-4 pb-28 pt-[calc(env(safe-area-inset-top)+16px)]">
      {controles}
      <p className="mb-3 mt-5 etiqueta-mini">
        {filtradas.length === 1 ? textos.red.resultado : t(textos.red.resultados, { n: filtradas.length })}
      </p>
      <div className="space-y-3">
        {filtradas.length === 0 ? sinResultados : filtradas.map(({ b, km }) => <Tarjeta key={b.id} b={b} km={km} />)}
      </div>
      {hojaUbicacion}
    </main>
  );
}
