import { useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { buscarBarberia, t, textos } from '../datos';
import { enviarFormulario } from '../lib/formularios';
import { Boton, Campo, Confirmacion, EnlaceBoton, Pantalla } from '../componentes/Base';

export default function Incidencia() {
  const { id } = useParams();
  const b = buscarBarberia(id);
  const [fecha, setFecha] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState<'listo' | 'enviando' | 'hecho' | 'error'>('listo');

  if (!b) return <Pantalla volver><p className="text-tiza-suave">{textos.ficha.noEncontrada}</p></Pantalla>;

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    setEstado('enviando');
    try {
      // La fecha llega del calendario como aaaa-mm-dd; se envía como dd/mm/aaaa.
      const fechaEs = fecha.split('-').reverse().join('/');
      await enviarFormulario('incidencia', { barberia: b.nombre, 'barberia-id': b.id, fecha: fechaEs, descripcion, email });
      setEstado('hecho');
    } catch {
      setEstado('error');
    }
  };

  return (
    <Pantalla titulo={textos.incidencia.titulo} volver>
      {estado === 'hecho' ? (
        <Confirmacion titulo={textos.incidencia.confirmacionTitulo} texto={textos.incidencia.confirmacion}>
          <EnlaceBoton to={`/barberia/${b.id}`} variante="secundario">{textos.general.volver}</EnlaceBoton>
        </Confirmacion>
      ) : (
        <form onSubmit={enviar}>
          <p className="mb-6 text-tiza-suave">{t(textos.incidencia.intro, { barberia: b.nombre })}</p>
          <Campo etiqueta={textos.incidencia.campoFecha}>
            <input className="campo" type="date" required value={fecha} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setFecha(e.target.value)} />
          </Campo>
          <Campo etiqueta={textos.incidencia.campoQue} ayuda={textos.incidencia.campoQueAyuda}>
            <textarea className="campo min-h-36" required value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
          </Campo>
          <Campo etiqueta={textos.incidencia.campoEmail}>
            <input className="campo" type="email" required inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Campo>
          {estado === 'error' && <p className="mb-3 text-sm text-aviso" role="alert">{textos.general.errorEnvio}</p>}
          <Boton type="submit" className="w-full" disabled={estado === 'enviando'}>
            {estado === 'enviando' ? textos.general.enviando : textos.incidencia.boton}
          </Boton>
        </form>
      )}
    </Pantalla>
  );
}
