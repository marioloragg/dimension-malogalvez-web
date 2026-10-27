// Piezas básicas reutilizadas en todas las pantallas.
import type { ReactNode, AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconoVolver } from './Iconos';
import { textos } from '../datos';

export function Pantalla({ titulo, volver, children }: { titulo?: string; volver?: boolean; children: ReactNode }) {
  const navegar = useNavigate();
  return (
    <main className="aparece mx-auto w-full max-w-xl px-4 pb-28 pt-[calc(env(safe-area-inset-top)+16px)]">
      {(titulo || volver) && (
        <header className="mb-6 flex items-center gap-3">
          {volver && (
            <button
              onClick={() => (window.history.length > 1 ? navegar(-1) : navegar('/'))}
              className="pulsable -ml-2 grid h-11 w-11 place-items-center rounded-full text-tiza-suave active:bg-grafito"
              aria-label={textos.general.volver}
            >
              <IconoVolver />
            </button>
          )}
          {titulo && <h1 className="text-xl">{titulo}</h1>}
        </header>
      )}
      {children}
    </main>
  );
}

type Variante = 'principal' | 'secundario' | 'discreto';
const estilos: Record<Variante, string> = {
  principal: 'bg-tiza text-obsidiana font-medium',
  secundario: 'border border-linea bg-grafito text-tiza',
  discreto: 'text-tiza-suave underline underline-offset-4 decoration-linea',
};
const comun = 'pulsable inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-5 text-[15px]';

export function Boton({ variante = 'principal', className = '', ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variante?: Variante }) {
  return <button {...p} className={`${comun} ${estilos[variante]} disabled:opacity-50 ${className}`} />;
}

export function EnlaceBoton({ variante = 'principal', className = '', to, ...p }: AnchorHTMLAttributes<HTMLAnchorElement> & { variante?: Variante; to?: string }) {
  const clases = `${comun} ${estilos[variante]} ${className}`;
  if (to) return <Link to={to} className={clases}>{p.children}</Link>;
  return <a target="_blank" rel="noopener noreferrer" {...p} className={clases} />;
}

export function Seccion({ titulo, children, className = '' }: { titulo?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`border-t border-linea pt-5 mt-6 ${className}`}>
      {titulo && <h2 className="etiqueta-mini mb-3 font-cuerpo font-medium">{titulo}</h2>}
      {children}
    </section>
  );
}

export function EtiquetaPrueba() {
  return (
    <span className="rounded-sm border border-dashed border-aviso/70 px-1.5 py-0.5 text-[10px] uppercase tracking-[0.12em] text-aviso">
      {textos.general.fichaDePrueba}
    </span>
  );
}

export function Monograma({ tam = 44 }: { tam?: number }) {
  return (
    <span
      className="inline-grid place-items-center border border-metal/70 font-titular text-metal"
      style={{ width: tam, height: tam, fontSize: tam * 0.48 }}
      aria-hidden
    >
      D
    </span>
  );
}

export function Confirmacion({ titulo, texto, children }: { titulo: string; texto: string; children?: ReactNode }) {
  return (
    <div className="aparece rounded-md border border-linea bg-grafito p-6 text-center" role="status">
      <h2 className="mb-2 text-lg">{titulo}</h2>
      <p className="text-tiza-suave">{texto}</p>
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}

export function Campo({ etiqueta, ayuda, children }: { etiqueta: string; ayuda?: string; children: ReactNode }) {
  return (
    <label className="mb-4 block">
      <span className="mb-1.5 block text-sm text-tiza">{etiqueta}</span>
      {children}
      {ayuda && <span className="mt-1 block text-xs text-tiza-suave">{ayuda}</span>}
    </label>
  );
}

