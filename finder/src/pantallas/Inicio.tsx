import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { textos } from '../datos';
import { Boton, Monograma, Pantalla } from '../componentes/Base';
import { HojaUbicacion } from '../componentes/HojaUbicacion';
import { ListaCiudades } from '../componentes/Expansion';
import { IconoSello, IconoUbicacion } from '../componentes/Iconos';

export default function Inicio() {
  const navegar = useNavigate();
  const [hoja, setHoja] = useState<null | 'permiso' | 'buscar'>(null);

  return (
    <Pantalla>
      <div className="flex min-h-[calc(100dvh-120px)] flex-col">
        <div className="flex items-center gap-3 pt-2">
          <Monograma tam={40} />
          <div className="leading-tight">
            <p className="font-titular text-[15px] tracking-[0.18em]">{textos.general.marca.toUpperCase()}</p>
            <p className="text-xs text-tiza-suave">{textos.general.submarca}</p>
          </div>
        </div>

        <div className="mt-auto pt-14">
          <p className="etiqueta-mini mb-3">{textos.inicio.antetitulo}</p>
          <h1 className="mb-3 text-[28px]">{textos.inicio.titulo}</h1>
          <p className="mb-8 text-tiza-suave">{textos.inicio.subtitulo}</p>

          <Boton className="w-full text-base" onClick={() => setHoja('permiso')}>
            <IconoUbicacion /> {textos.inicio.botonLocalizar}
          </Boton>
          <Boton variante="discreto" className="mt-1 w-full" onClick={() => setHoja('buscar')}>
            {textos.inicio.botonBuscar}
          </Boton>

          <div className="mt-8 border-l border-metal/60 pl-4">
            <p className="etiqueta-mini mb-1.5 flex items-center gap-1.5">
              <IconoSello width={14} height={14} /> {textos.inicio.garantiaTitulo}
            </p>
            <p className="text-[15px] text-tiza">{textos.inicio.garantia}</p>
          </div>
        </div>
      </div>

      <section className="mt-10 border-t border-linea pt-6">
        <h2 className="mb-2 text-lg">{textos.inicio.origenTitulo}</h2>
        <p className="mb-5 text-sm text-tiza-suave">{textos.inicio.origenTexto}</p>
        <ListaCiudades />
      </section>

      <HojaUbicacion
        key={hoja ?? 'cerrada'}
        abierta={hoja !== null}
        soloBuscar={hoja === 'buscar'}
        alCerrar={() => setHoja(null)}
        alTerminar={() => navegar('/red')}
      />
    </Pantalla>
  );
}
