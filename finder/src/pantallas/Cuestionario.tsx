import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { buscarBarberia, t, textos } from '../datos';
import { enviarFormulario } from '../lib/formularios';
import { Boton, Confirmacion, EnlaceBoton, Pantalla } from '../componentes/Base';

/** Cuestionario privado tras la visita. Se llega por el QR de la barbería o desde la ficha. */
export default function Cuestionario() {
  const { id } = useParams();
  const b = buscarBarberia(id);
  const preguntas = textos.cuestionario.preguntas;
  const total = preguntas.length;
  // paso -1 = introducción · 0..total-1 = preguntas · total = comentario final
  const [paso, setPaso] = useState(-1);
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [comentario, setComentario] = useState('');
  const [estado, setEstado] = useState<'listo' | 'enviando' | 'hecho' | 'error'>('listo');

  if (!b) return <Pantalla volver><p className="text-tiza-suave">{textos.ficha.noEncontrada}</p></Pantalla>;

  const enviar = async () => {
    setEstado('enviando');
    try {
      await enviarFormulario('cuestionario', { barberia: b.nombre, 'barberia-id': b.id, ...respuestas, comentario });
      setEstado('hecho');
    } catch {
      setEstado('error');
    }
  };

  if (estado === 'hecho') {
    return (
      <Pantalla titulo={textos.cuestionario.titulo}>
        <Confirmacion titulo={textos.cuestionario.confirmacionTitulo} texto={textos.cuestionario.confirmacion}>
          <EnlaceBoton to="/" variante="secundario">{textos.navegacion.inicio}</EnlaceBoton>
        </Confirmacion>
      </Pantalla>
    );
  }

  return (
    <Pantalla titulo={textos.cuestionario.titulo} volver>
      {paso >= 0 && (
        <div className="mb-6">
          <div className="mb-2 flex gap-1" aria-hidden>
            {Array.from({ length: total + 1 }, (_, i) => (
              <span key={i} className={`h-0.5 flex-1 rounded-full transition-colors ${i <= paso ? 'bg-metal' : 'bg-linea'}`} />
            ))}
          </div>
          {paso < total && <p className="etiqueta-mini">{t(textos.cuestionario.pregunta, { n: paso + 1, total })}</p>}
        </div>
      )}

      {paso === -1 && (
        <div className="aparece">
          <p className="mb-1 font-medium">{b.nombre}</p>
          <p className="mb-8 text-tiza-suave">{t(textos.cuestionario.intro, { barberia: b.nombre })}</p>
          <Boton className="w-full" onClick={() => setPaso(0)}>{textos.cuestionario.empezar}</Boton>
        </div>
      )}

      {paso >= 0 && paso < total && (
        <div className="aparece" key={paso}>
          <h2 className="mb-6 text-xl">{preguntas[paso].texto}</h2>
          <div className="space-y-2">
            {preguntas[paso].opciones.map((o) => {
              const elegida = respuestas[preguntas[paso].id] === o;
              return (
                <button
                  key={o}
                  onClick={() => {
                    setRespuestas({ ...respuestas, [preguntas[paso].id]: o });
                    setTimeout(() => setPaso(paso + 1), 180);
                  }}
                  className={`pulsable flex min-h-14 w-full items-center rounded-md border px-4 text-left ${elegida ? 'border-tiza bg-grafito-claro' : 'border-linea bg-grafito'}`}
                >
                  {o}
                </button>
              );
            })}
          </div>
          <Boton variante="discreto" className="mt-4" onClick={() => setPaso(paso - 1)}>{textos.cuestionario.anterior}</Boton>
        </div>
      )}

      {paso === total && (
        <div className="aparece">
          <label className="mb-2 block" htmlFor="comentario">{textos.cuestionario.comentario}</label>
          <textarea id="comentario" className="campo mb-4 min-h-32" value={comentario} onChange={(e) => setComentario(e.target.value)} />
          {estado === 'error' && <p className="mb-3 text-sm text-aviso" role="alert">{textos.general.errorEnvio}</p>}
          <Boton className="w-full" onClick={enviar} disabled={estado === 'enviando'}>
            {estado === 'enviando' ? textos.general.enviando : textos.cuestionario.enviar}
          </Boton>
          <Boton variante="discreto" className="mt-2" onClick={() => setPaso(paso - 1)}>{textos.cuestionario.anterior}</Boton>
        </div>
      )}
    </Pantalla>
  );
}
