import { Link, useParams } from 'react-router-dom';
import { buscarBarberia, DIAS, nombreServicio, t, textos } from '../datos';
import { enlaceComoLlegar, enlaceInstagram, enlaceTelefono } from '../lib/enlaces';
import { ahoraEnMadrid } from '../lib/tiempo';
import { EnlaceBoton, EtiquetaPrueba, Pantalla, Seccion } from '../componentes/Base';
import { SelloVivo } from '../componentes/Sello';
import { TextoApertura } from '../componentes/Tarjeta';
import { IconoFlecha, IconoInstagram, IconoRuta, IconoTelefono } from '../componentes/Iconos';

export default function Ficha() {
  const { id } = useParams();
  const b = buscarBarberia(id);

  if (!b) {
    return (
      <Pantalla volver>
        <p className="text-tiza-suave">{textos.ficha.noEncontrada}</p>
      </Pantalla>
    );
  }

  const hoy = ahoraEnMadrid().dia;
  const principal = b.barberosCertificados[0];

  return (
    <>
      <Pantalla volver>
        {b.fotos.length > 0 && (
          <div className="-mx-4 mb-5 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 [scrollbar-width:none]">
            {b.fotos.map((f) => (
              <img
                key={f.archivo + f.descripcion}
                src={`/fotos/${f.archivo}`}
                alt={f.descripcion}
                className="aspect-[4/3] w-[86%] shrink-0 snap-center rounded-md border border-linea bg-grafito object-cover"
                loading="lazy"
              />
            ))}
          </div>
        )}

        <div className="mb-1 flex flex-wrap items-center gap-2">
          <h1 className="text-[24px]">{b.nombre}</h1>
          {b.datosDePrueba && <EtiquetaPrueba />}
        </div>
        <p className="mb-5 text-tiza-suave">{b.ciudad} · <TextoApertura b={b} /></p>

        <SelloVivo b={b} />
        <p className="mt-3 border-l border-metal/60 pl-3 text-sm text-tiza">{textos.ficha.garantia}</p>

        <Seccion titulo={textos.ficha.barberoTitulo}>
          <ul className="space-y-3">
            {b.barberosCertificados.map((p) => (
              <li key={p.nombre} className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{p.nombre}</p>
                  <p className="text-[13px] text-tiza-suave">{t(textos.ficha.itinerario, { nivel: p.itinerario })}</p>
                  <p className="text-[13px] tabular-nums text-tiza-suave">{t(textos.ficha.certificadoEl, { fecha: p.fechaCertificacion })}</p>
                </div>
                {b.barberosCertificados.length > 1 && p.enlaceReserva && (
                  <EnlaceBoton href={p.enlaceReserva} variante="secundario" className="shrink-0 !min-h-10 !px-3 text-sm">
                    {textos.tarjeta.reservar}
                  </EnlaceBoton>
                )}
              </li>
            ))}
          </ul>
        </Seccion>

        <div className="mt-6 grid grid-cols-3 gap-2">
          {[
            { href: enlaceTelefono(b.telefono), texto: textos.ficha.llamar, Icono: IconoTelefono, mostrar: Boolean(b.telefono), externo: false },
            { href: enlaceComoLlegar(b), texto: textos.ficha.comoLlegar, Icono: IconoRuta, mostrar: true, externo: true },
            { href: enlaceInstagram(b.instagram), texto: textos.ficha.instagram, Icono: IconoInstagram, mostrar: Boolean(b.instagram), externo: true },
          ]
            .filter((a) => a.mostrar)
            .map(({ href, texto, Icono, externo }) => (
              <a
                key={texto}
                href={href}
                {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="pulsable flex min-h-16 flex-col items-center justify-center gap-1 rounded-md border border-linea bg-grafito text-[13px] active:bg-grafito-claro"
              >
                <Icono className="text-metal" />
                {texto}
              </a>
            ))}
        </div>

        <Seccion titulo={textos.ficha.direccion}>
          <p>{b.direccion}</p>
          <p className="text-tiza-suave">{b.codigoPostal} {b.ciudad} ({b.provincia})</p>
        </Seccion>

        <Seccion titulo={textos.ficha.horario}>
          <dl className="space-y-1 text-sm">
            {DIAS.map((d) => (
              <div key={d} className={`flex justify-between gap-4 ${d === hoy ? 'text-tiza' : 'text-tiza-suave'}`}>
                <dt className={d === hoy ? 'font-medium' : ''}>{textos.dias[d]}</dt>
                <dd className="tabular-nums">{b.horario[d].length ? b.horario[d].join(' · ').replace(/-/g, '–') : textos.ficha.cerradoDia}</dd>
              </div>
            ))}
          </dl>
        </Seccion>

        <Seccion titulo={textos.ficha.servicios}>
          <ul className="flex flex-wrap gap-2">
            {b.servicios.map((s) => (
              <li key={s} className="rounded-full border border-linea px-3 py-1 text-[13px]">{nombreServicio(s)}</li>
            ))}
          </ul>
        </Seccion>

        <Seccion titulo={textos.ficha.primeraVisitaTitulo}>
          <ol className="space-y-4">
            {textos.ficha.primeraVisita.map((paso, i) => (
              <li key={paso.titulo} className="flex gap-3">
                <span className="font-titular text-metal tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <p className="font-medium">{paso.titulo}</p>
                  <p className="text-sm text-tiza-suave">{paso.texto}</p>
                </div>
              </li>
            ))}
          </ol>
          {b.notaPrimeraVisita && <p className="mt-4 rounded-md bg-grafito p-3 text-sm">{b.notaPrimeraVisita}</p>}
        </Seccion>

        <Seccion>
          <Link to={`/cuestionario/${b.id}`} className="pulsable flex items-center justify-between rounded-md border border-linea bg-grafito p-4 active:bg-grafito-claro">
            <span>
              <span className="block">{textos.ficha.heVisitado}</span>
              <span className="block text-[13px] text-tiza-suave">{textos.ficha.heVisitadoTexto}</span>
            </span>
            <IconoFlecha className="text-metal" />
          </Link>
          <Link to={`/barberia/${b.id}/incidencia`} className="mt-5 block py-2 text-center text-[13px] text-tiza-suave underline decoration-linea underline-offset-4">
            {textos.ficha.reportar}
          </Link>
        </Seccion>
        <div className="h-16" />
      </Pantalla>

      {/* Botón de reserva fijo, siempre a mano mientras se lee la ficha */}
      <div className="fixed inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom))] z-30 border-t border-linea bg-obsidiana/92 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto max-w-xl">
          <EnlaceBoton href={principal.enlaceReserva || b.reserva.enlace} className="w-full">
            {t(textos.ficha.reservarCon, { nombre: principal.nombre.split(' ')[0] })}
          </EnlaceBoton>
        </div>
      </div>
    </>
  );
}
