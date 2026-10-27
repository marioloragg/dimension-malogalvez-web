import { textos } from '../datos';
import { esIOS, estaInstalada } from '../lib/enlaces';
import { Monograma, Pantalla, Seccion } from '../componentes/Base';

function Pasos({ titulo, pasos }: { titulo: string; pasos: string[] }) {
  return (
    <Seccion titulo={titulo}>
      <ol className="space-y-3">
        {pasos.map((p, i) => (
          <li key={p} className="flex gap-3">
            <span className="font-titular text-metal">{i + 1}</span>
            <span>{p}</span>
          </li>
        ))}
      </ol>
    </Seccion>
  );
}

export default function Instalar() {
  const i = textos.instalar;
  const ios = esIOS();
  return (
    <Pantalla titulo={i.titulo} volver>
      <div className="mb-5 flex items-center gap-4">
        <Monograma tam={56} />
        <p className="text-tiza-suave">{i.intro}</p>
      </div>
      {estaInstalada() ? (
        <p className="rounded-md border border-linea bg-grafito p-4">{i.yaInstalada}</p>
      ) : ios ? (
        <>
          <Pasos titulo={i.iphoneTitulo} pasos={i.iphonePasos} />
          <Pasos titulo={i.androidTitulo} pasos={i.androidPasos} />
        </>
      ) : (
        <>
          <Pasos titulo={i.androidTitulo} pasos={i.androidPasos} />
          <Pasos titulo={i.iphoneTitulo} pasos={i.iphonePasos} />
        </>
      )}
    </Pantalla>
  );
}
