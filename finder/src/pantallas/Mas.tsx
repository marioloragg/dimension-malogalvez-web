import { Link } from 'react-router-dom';
import { enlaceWeb, textos } from '../datos';
import { Monograma, Pantalla, Seccion } from '../componentes/Base';
import { IconoExterno, IconoFlecha } from '../componentes/Iconos';

function Fila({ titulo, texto, href, to }: { titulo: string; texto: string; href?: string; to?: string }) {
  const contenido = (
    <>
      <span>
        <span className="block">{titulo}</span>
        <span className="block text-[13px] text-tiza-suave">{texto}</span>
      </span>
      {href ? <IconoExterno className="shrink-0 text-metal" width={18} height={18} /> : <IconoFlecha className="shrink-0 text-metal" width={18} height={18} />}
    </>
  );
  const clases = 'pulsable flex min-h-16 items-center justify-between gap-3 border-b border-linea py-3 last:border-0';
  return to ? (
    <Link to={to} className={clases}>{contenido}</Link>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer" className={clases}>{contenido}</a>
  );
}

export default function Mas() {
  const m = textos.mas;
  return (
    <Pantalla>
      <div className="mb-6 flex items-center gap-3">
        <Monograma tam={40} />
        <h1 className="text-xl">{m.webTitulo}</h1>
      </div>

      <Seccion>
        <Fila titulo={m.tienda} texto={m.tiendaTexto} href={enlaceWeb('tienda')} />
        <Fila titulo={m.academia} texto={m.academiaTexto} href={enlaceWeb('academia')} />
        <Fila titulo={m.manifiesto} texto={m.manifiestoTexto} href={enlaceWeb('manifiesto')} />
      </Seccion>

      <Seccion titulo={m.barberiasTitulo}>
        <Fila titulo={m.solicitar} texto={m.solicitarTexto} to="/solicitar" />
      </Seccion>

      <Seccion titulo={m.appTitulo}>
        <Fila titulo={m.instalar} texto={m.instalarTexto} to="/instalar" />
      </Seccion>
    </Pantalla>
  );
}
