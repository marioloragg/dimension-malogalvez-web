import { createContext, useContext, useState, type ReactNode } from 'react';
import { estaEnEspana, origenRed, type Lugar } from './lib/geo';
import { textos } from './datos';

type ResultadoUbicacion = 'ok' | 'denegada' | 'fuera';

interface EstadoUbicacion {
  /** Punto desde el que se ordena la red. Por defecto, Valencia. */
  lugar: Lugar;
  /** Mensaje a mostrar (fuera de España, permiso denegado…). */
  aviso: string | null;
  pedirUbicacion: () => Promise<ResultadoUbicacion>;
  fijarLugar: (l: Lugar) => void;
}

const Contexto = createContext<EstadoUbicacion | null>(null);
const CLAVE = 'dimension.lugar';

function lugarGuardado(): Lugar | null {
  try {
    const v = sessionStorage.getItem(CLAVE);
    return v ? (JSON.parse(v) as Lugar) : null;
  } catch {
    return null;
  }
}

export function ProveedorUbicacion({ children }: { children: ReactNode }) {
  const [lugar, setLugar] = useState<Lugar>(() => lugarGuardado() ?? origenRed);
  const [aviso, setAviso] = useState<string | null>(null);

  const fijarLugar = (l: Lugar) => {
    setLugar(l);
    setAviso(null);
    try {
      sessionStorage.setItem(CLAVE, JSON.stringify(l));
    } catch {
      /* sin almacenamiento: no pasa nada */
    }
  };

  const pedirUbicacion = () =>
    new Promise<ResultadoUbicacion>((resolver) => {
      if (!('geolocation' in navigator)) {
        setAviso(textos.ubicacion.denegada);
        return resolver('denegada');
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          if (!estaEnEspana(p)) {
            fijarLugar(origenRed);
            setAviso(textos.ubicacion.fueraDeEspana);
            return resolver('fuera');
          }
          fijarLugar({ ...p, nombre: textos.red.tuUbicacion, tipo: 'gps' });
          resolver('ok');
        },
        () => {
          setAviso(textos.ubicacion.denegada);
          resolver('denegada');
        },
        { enableHighAccuracy: false, timeout: 12000, maximumAge: 5 * 60 * 1000 },
      );
    });

  return <Contexto.Provider value={{ lugar, aviso, pedirUbicacion, fijarLugar }}>{children}</Contexto.Provider>;
}

export function useUbicacion() {
  const c = useContext(Contexto);
  if (!c) throw new Error('useUbicacion fuera de ProveedorUbicacion');
  return c;
}
