import { useState, type FormEvent } from 'react';
import { ciudadesActivas, ciudadesProximas, t, textos } from '../datos';
import { enviarFormulario } from '../lib/formularios';
import { Boton, Campo, Confirmacion } from './Base';

export function ListaCiudades() {
  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <p className="etiqueta-mini mb-2">{textos.inicio.ciudadesActivas}</p>
        <ul className="space-y-1">
          {ciudadesActivas.map((c) => (
            <li key={c} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-metal" aria-hidden />
              {c}
            </li>
          ))}
        </ul>
      </div>
      {ciudadesProximas.length > 0 && (
        <div>
          <p className="etiqueta-mini mb-2">{textos.inicio.ciudadesProximas}</p>
          <ul className="space-y-1 text-tiza-suave">
            {ciudadesProximas.map((c) => (
              <li key={c} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full border border-metal/60" aria-hidden />
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function FormularioAviso({ ciudadInicial = '' }: { ciudadInicial?: string }) {
  const [email, setEmail] = useState('');
  const [ciudad, setCiudad] = useState(ciudadInicial);
  const [estado, setEstado] = useState<'listo' | 'enviando' | 'hecho' | 'error'>('listo');

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    setEstado('enviando');
    try {
      await enviarFormulario('aviso', { email, ciudad });
      setEstado('hecho');
    } catch {
      setEstado('error');
    }
  };

  if (estado === 'hecho') return <Confirmacion titulo={textos.expansion.avisoTitulo} texto={t(textos.expansion.confirmacion, { ciudad })} />;

  return (
    <form onSubmit={enviar} className="rounded-md border border-linea bg-grafito p-4">
      <h3 className="mb-1 text-base">{textos.expansion.avisoTitulo}</h3>
      <p className="mb-4 text-sm text-tiza-suave">{textos.expansion.avisoTexto}</p>
      <Campo etiqueta={textos.expansion.campoCiudad}>
        <input className="campo" required value={ciudad} onChange={(e) => setCiudad(e.target.value)} autoComplete="address-level2" />
      </Campo>
      <Campo etiqueta={textos.expansion.campoEmail}>
        <input className="campo" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" inputMode="email" />
      </Campo>
      {estado === 'error' && <p className="mb-3 text-sm text-aviso" role="alert">{textos.general.errorEnvio}</p>}
      <Boton type="submit" className="w-full" disabled={estado === 'enviando'}>
        {estado === 'enviando' ? textos.general.enviando : textos.expansion.boton}
      </Boton>
    </form>
  );
}

/** Estado vacío: no hay barberías certificadas cerca del cliente. */
export function Expansion({ lugar, alVerRed }: { lugar: string; alVerRed?: () => void }) {
  return (
    <div className="aparece space-y-6">
      <div>
        <h2 className="mb-2 text-lg">{textos.expansion.titulo}</h2>
        <p className="text-tiza-suave">{t(textos.expansion.texto, { lugar })}</p>
      </div>
      <ListaCiudades />
      <FormularioAviso ciudadInicial={/^\d/.test(lugar) || lugar === textos.red.tuUbicacion ? '' : lugar} />
      {alVerRed && (
        <Boton variante="secundario" className="w-full" onClick={alVerRed}>{textos.expansion.verRed}</Boton>
      )}
    </div>
  );
}
