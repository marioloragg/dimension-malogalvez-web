import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Barberia } from '../datos';
import type { Lugar } from '../lib/geo';
import { estiloMapa } from '../lib/estiloMapa';

interface Props {
  barberias: Barberia[];
  lugar: Lugar;
  seleccionada: string | null;
  alSeleccionar: (id: string) => void;
}

export default function Mapa({ barberias, lugar, seleccionada, alSeleccionar }: Props) {
  const contenedor = useRef<HTMLDivElement>(null);
  const mapa = useRef<maplibregl.Map | null>(null);
  const marcadores = useRef<Map<string, HTMLDivElement>>(new Map());

  // Crear el mapa una sola vez.
  useEffect(() => {
    if (!contenedor.current) return;
    const m = new maplibregl.Map({
      container: contenedor.current,
      style: estiloMapa,
      center: [lugar.lng, lugar.lat],
      zoom: 11.5,
      attributionControl: { compact: true, customAttribution: '© OpenStreetMap · OpenFreeMap' },
      dragRotate: false,
      pitchWithRotate: false,
    });
    m.touchZoomRotate.disableRotation();
    mapa.current = m;
    return () => {
      m.remove();
      mapa.current = null;
      marcadores.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Marcadores de barberías y del cliente.
  useEffect(() => {
    const m = mapa.current;
    if (!m) return;
    const creados: maplibregl.Marker[] = [];
    marcadores.current.clear();
    for (const b of barberias) {
      const el = document.createElement('div');
      el.className = 'marcador';
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        alSeleccionar(b.id);
      });
      marcadores.current.set(b.id, el);
      creados.push(new maplibregl.Marker({ element: el }).setLngLat([b.coordenadas.lng, b.coordenadas.lat]).addTo(m));
      el.setAttribute('aria-label', b.nombre); // después de addTo: MapLibre pone su propia etiqueta
    }
    if (lugar.tipo === 'gps') {
      const yo = document.createElement('div');
      yo.className = 'marcador-yo';
      creados.push(new maplibregl.Marker({ element: yo }).setLngLat([lugar.lng, lugar.lat]).addTo(m));
    }
    // Encuadrar: el cliente y las barberías más cercanas.
    const puntos: [number, number][] = [[lugar.lng, lugar.lat], ...barberias.slice(0, 3).map((b) => [b.coordenadas.lng, b.coordenadas.lat] as [number, number])];
    const caja = puntos.reduce((acc, p) => acc.extend(p), new maplibregl.LngLatBounds(puntos[0], puntos[0]));
    m.fitBounds(caja, { padding: { top: 250, bottom: 230, left: 50, right: 50 }, maxZoom: 14, duration: 0 });
    return () => creados.forEach((mk) => mk.remove());
  }, [barberias, lugar, alSeleccionar]);

  // Resaltar la seleccionada y centrarla.
  useEffect(() => {
    marcadores.current.forEach((el, id) => el.classList.toggle('activo', id === seleccionada));
    const b = barberias.find((x) => x.id === seleccionada);
    if (b && mapa.current) mapa.current.easeTo({ center: [b.coordenadas.lng, b.coordenadas.lat], duration: 400, offset: [0, -60] });
  }, [seleccionada, barberias]);

  return (
    <div className="absolute inset-0">
      <div ref={contenedor} className="h-full w-full" />
    </div>
  );
}
