import { textos } from '../datos';
import { Pantalla, Seccion } from '../componentes/Base';
import { IconoCheck } from '../componentes/Iconos';

export default function SelloInfo() {
  const s = textos.selloInfo;
  return (
    <Pantalla>
      <p className="etiqueta-mini mb-3">{s.antetitulo}</p>
      <h1 className="mb-4 text-[26px]">{s.titulo}</h1>
      <p className="text-tiza-suave">{s.intro}</p>

      <Seccion titulo={s.criteriosTitulo}>
        <ul className="space-y-3">
          {s.criterios.map((c) => (
            <li key={c} className="flex gap-3">
              <IconoCheck className="mt-0.5 shrink-0 text-metal" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </Seccion>

      <Seccion titulo={s.revisionTitulo}>
        <p>{s.revision}</p>
      </Seccion>

      <Seccion titulo={s.cupoTitulo}>
        <p>{s.cupo}</p>
      </Seccion>

      <p className="mt-8 border-l border-metal/60 pl-4 text-sm text-tiza-suave">{s.sinRanking}</p>
    </Pantalla>
  );
}
