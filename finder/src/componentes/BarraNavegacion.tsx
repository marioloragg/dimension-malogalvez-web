import { NavLink } from 'react-router-dom';
import { textos } from '../datos';
import { IconoInicio, IconoMas, IconoRed, IconoSello } from './Iconos';

const accesos = [
  { a: '/', texto: textos.navegacion.inicio, Icono: IconoInicio },
  { a: '/red', texto: textos.navegacion.red, Icono: IconoRed },
  { a: '/sello', texto: textos.navegacion.sello, Icono: IconoSello },
  { a: '/mas', texto: textos.navegacion.mas, Icono: IconoMas },
];

/** Barra fija inferior, al alcance del pulgar. */
export function BarraNavegacion() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-linea bg-obsidiana/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
      <ul className="mx-auto grid max-w-xl grid-cols-4">
        {accesos.map(({ a, texto, Icono }) => (
          <li key={a}>
            <NavLink
              to={a}
              end={a === '/'}
              className={({ isActive }) =>
                `pulsable flex h-16 flex-col items-center justify-center gap-1 text-[11px] tracking-wide ${isActive ? 'text-tiza' : 'text-tiza-suave/70'}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icono width={22} height={22} strokeWidth={isActive ? 1.8 : 1.4} />
                  {texto}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
