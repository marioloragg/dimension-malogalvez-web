import { useState, type FormEvent } from 'react';
import { textos } from '../datos';
import { enviarFormulario } from '../lib/formularios';
import { Boton, Campo, Confirmacion, Pantalla } from '../componentes/Base';

const CAMPOS = [
  { nombre: 'barberia', etiqueta: textos.solicitud.campoBarberia, tipo: 'text', auto: 'organization' },
  { nombre: 'ciudad', etiqueta: textos.solicitud.campoCiudad, tipo: 'text', auto: 'address-level2' },
  { nombre: 'codigo-postal', etiqueta: textos.solicitud.campoCodigoPostal, tipo: 'text', auto: 'postal-code', patron: '\\d{5}', modo: 'numeric' },
  { nombre: 'responsable', etiqueta: textos.solicitud.campoResponsable, tipo: 'text', auto: 'name' },
  { nombre: 'email', etiqueta: textos.solicitud.campoEmail, tipo: 'email', auto: 'email', modo: 'email' },
  { nombre: 'telefono', etiqueta: textos.solicitud.campoTelefono, tipo: 'tel', auto: 'tel', modo: 'tel' },
  { nombre: 'barbero', etiqueta: textos.solicitud.campoBarbero, tipo: 'text', auto: 'off' },
] as const;

export default function Solicitud() {
  const [valores, setValores] = useState<Record<string, string>>({ telefono: '+34 ' });
  const [estado, setEstado] = useState<'listo' | 'enviando' | 'hecho' | 'error'>('listo');
  const s = textos.solicitud;

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    setEstado('enviando');
    try {
      await enviarFormulario('solicitud', valores);
      setEstado('hecho');
    } catch {
      setEstado('error');
    }
  };

  return (
    <Pantalla titulo={s.titulo} volver>
      {estado === 'hecho' ? (
        <Confirmacion titulo={s.confirmacionTitulo} texto={s.confirmacion} />
      ) : (
        <form onSubmit={enviar}>
          <p className="mb-3 text-tiza-suave">{s.intro}</p>
          <p className="mb-6 border-l border-metal/60 pl-3 text-sm">{s.requisito}</p>
          {CAMPOS.map((c) => (
            <Campo key={c.nombre} etiqueta={c.etiqueta}>
              <input
                className="campo"
                type={c.tipo}
                required
                autoComplete={c.auto}
                inputMode={'modo' in c ? c.modo : undefined}
                pattern={'patron' in c ? c.patron : undefined}
                value={valores[c.nombre] ?? ''}
                onChange={(e) => setValores({ ...valores, [c.nombre]: e.target.value })}
              />
            </Campo>
          ))}
          <Campo etiqueta={s.campoMotivo}>
            <textarea className="campo min-h-32" required value={valores.motivo ?? ''} onChange={(e) => setValores({ ...valores, motivo: e.target.value })} />
          </Campo>
          {estado === 'error' && <p className="mb-3 text-sm text-aviso" role="alert">{textos.general.errorEnvio}</p>}
          <Boton type="submit" className="w-full" disabled={estado === 'enviando'}>
            {estado === 'enviando' ? textos.general.enviando : s.boton}
          </Boton>
        </form>
      )}
    </Pantalla>
  );
}
