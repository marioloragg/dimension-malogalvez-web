import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import marca from './datos/marca.json';
import textos from './datos/textos.json';

// Convierte los colores de datos/marca.json en variables CSS (--color-obsidiana…)
// y los escribe dentro de index.html, para que la app nazca ya con sus colores.
function coloresDeMarca(): Plugin {
  const aCss = (grupo: string, colores: Record<string, string>) =>
    Object.entries(colores)
      .map(([k, v]) => `--${grupo}-${k.replace(/[A-Z]/g, (l) => '-' + l.toLowerCase())}:${v};`)
      .join('');
  return {
    name: 'colores-de-marca',
    transformIndexHtml(html) {
      const css = `:root{${aCss('color', marca.colores)}${aCss('mapa', marca.mapa)}` +
        `--fuente-titulares:'${marca.tipografias.titulares}',Georgia,serif;` +
        `--fuente-cuerpo:'${marca.tipografias.cuerpo}',system-ui,sans-serif;}`;
      return html.replace('</head>', `<style>${css}</style></head>`);
    },
  };
}

// Netlify Forms necesita ver los formularios en el HTML publicado para
// registrarlos. Se generan aquí, ocultos, con los mismos campos que envía la app.
function formulariosNetlify(): Plugin {
  const formularios: Record<string, string[]> = {
    incidencia: ['barberia', 'barberia-id', 'fecha', 'descripcion', 'email'],
    cuestionario: ['barberia', 'barberia-id', ...textos.cuestionario.preguntas.map((p) => p.id), 'comentario'],
    aviso: ['email', 'ciudad'],
    solicitud: ['barberia', 'ciudad', 'codigo-postal', 'responsable', 'email', 'telefono', 'barbero', 'motivo'],
  };
  const html = Object.entries(formularios)
    .map(([nombre, campos]) =>
      `<form name="${nombre}" data-netlify="true" netlify-honeypot="bot-field" hidden>` +
      `<input name="bot-field">` +
      campos.map((c) => `<input name="${c}">`).join('') +
      `</form>`,
    )
    .join('');
  return {
    name: 'formularios-netlify',
    transformIndexHtml: (h) => h.replace('<!--formularios-->', html),
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    coloresDeMarca(),
    formulariosNetlify(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['iconos/*.png', 'fotos/*'],
      manifest: {
        name: 'Dimension Finder',
        short_name: 'Dimension',
        description: 'Barberías certificadas de la Red Dimension by Malo Gálvez.',
        lang: 'es-ES',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: marca.colores.obsidiana,
        background_color: marca.colores.obsidiana,
        icons: [
          { src: '/iconos/icono-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/iconos/icono-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/iconos/icono-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg,webp,woff2}'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            // Guarda las piezas del mapa ya vistas para que se vean sin conexión.
            urlPattern: /^https:\/\/tiles\.openfreemap\.org\/.*/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'mapa',
              expiration: { maxEntries: 600, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
  build: { chunkSizeWarningLimit: 1000 },
  server: { host: true },
});
