import { useState, type FormEvent } from 'react';
import { t, textos } from '../datos';
import { buscarLugar, type Lugar } from '../lib/geo';
import { Boton } from './Base';

/** Búsqueda por ciudad, provincia o código postal español. */
export function Buscador({ alEncontrar, autoFocus = false }: { alEncontrar: (l: Lugar) => void; autoFocus?: boolean }) {
  const [texto, setTexto] = useState('');
  const [error, setError] = useState<string | null>(null);

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    const l = buscarLugar(texto);
    if (!l) return setError(t(textos.buscador.noEncontrado, { texto }));
    setError(null);
    alEncontrar(l);
  };

  return (
    <form onSubmit={enviar} role="search">
      <label className="mb-1.5 block text-sm" htmlFor="buscador">{textos.buscador.etiqueta}</label>
      <div className="flex gap-2">
        <input
          id="buscador"
          className="campo"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder={textos.buscador.ejemplo}
          autoComplete="postal-code"
          enterKeyHint="search"
          autoFocus={autoFocus}
        />
        <Boton type="submit" variante="secundario" className="shrink-0">{textos.buscador.boton}</Boton>
      </div>
      {error && <p className="mt-2 text-sm text-aviso" role="alert">{error}</p>}
    </form>
  );
}
