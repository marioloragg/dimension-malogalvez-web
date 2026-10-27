import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import './estilos.css';
import { ProveedorUbicacion } from './estado';
import { BarraNavegacion } from './componentes/BarraNavegacion';
import Inicio from './pantallas/Inicio';
import Red from './pantallas/Red';
import Ficha from './pantallas/Ficha';
import Incidencia from './pantallas/Incidencia';
import Cuestionario from './pantallas/Cuestionario';
import SelloInfo from './pantallas/SelloInfo';
import Mas from './pantallas/Mas';
import Solicitud from './pantallas/Solicitud';
import Instalar from './pantallas/Instalar';
import Qr from './pantallas/Qr';

// Instala el service worker: la pieza que permite instalar la app y usarla sin conexión.
registerSW({ immediate: true });

function SubirAlCambiar() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ProveedorUbicacion>
        <SubirAlCambiar />
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/red" element={<Red />} />
          <Route path="/barberia/:id" element={<Ficha />} />
          <Route path="/barberia/:id/incidencia" element={<Incidencia />} />
          <Route path="/cuestionario/:id" element={<Cuestionario />} />
          <Route path="/sello" element={<SelloInfo />} />
          <Route path="/mas" element={<Mas />} />
          <Route path="/solicitar" element={<Solicitud />} />
          <Route path="/instalar" element={<Instalar />} />
          <Route path="/qr" element={<Qr />} />
          <Route path="*" element={<Inicio />} />
        </Routes>
        <BarraNavegacion />
      </ProveedorUbicacion>
    </BrowserRouter>
  </StrictMode>,
);
