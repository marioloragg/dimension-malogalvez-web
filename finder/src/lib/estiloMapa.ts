// Estilo del mapa en tonos grafito. Los colores salen de datos/marca.json ("mapa").
// Las teselas (piezas del mapa) son de OpenFreeMap: gratuitas y sin clave.
import type { StyleSpecification } from 'maplibre-gl';
import { marca } from '../datos';

const c = marca.mapa;
const FUENTE = ['Noto Sans Regular'];

export const estiloMapa: StyleSpecification = {
  version: 8,
  glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
  sources: {
    omt: { type: 'vector', url: 'https://tiles.openfreemap.org/planet' },
  },
  layers: [
    { id: 'fondo', type: 'background', paint: { 'background-color': c.fondo } },
    {
      id: 'verde',
      type: 'fill',
      source: 'omt',
      'source-layer': 'park',
      paint: { 'fill-color': c.zonasVerdes },
    },
    {
      id: 'cubierta',
      type: 'fill',
      source: 'omt',
      'source-layer': 'landcover',
      filter: ['in', ['get', 'class'], ['literal', ['grass', 'wood', 'farmland']]],
      paint: { 'fill-color': c.zonasVerdes, 'fill-opacity': 0.7 },
    },
    { id: 'agua', type: 'fill', source: 'omt', 'source-layer': 'water', paint: { 'fill-color': c.agua } },
    {
      id: 'edificios',
      type: 'fill',
      source: 'omt',
      'source-layer': 'building',
      minzoom: 14,
      paint: { 'fill-color': c.edificios },
    },
    {
      id: 'calles',
      type: 'line',
      source: 'omt',
      'source-layer': 'transportation',
      filter: ['in', ['get', 'class'], ['literal', ['minor', 'service', 'tertiary', 'street']]],
      minzoom: 12,
      paint: {
        'line-color': c.calles,
        'line-width': ['interpolate', ['linear'], ['zoom'], 12, 0.5, 16, 4, 18, 9],
      },
    },
    {
      id: 'calles-principales',
      type: 'line',
      source: 'omt',
      'source-layer': 'transportation',
      filter: ['in', ['get', 'class'], ['literal', ['motorway', 'trunk', 'primary', 'secondary']]],
      paint: {
        'line-color': c.callesPrincipales,
        'line-width': ['interpolate', ['linear'], ['zoom'], 6, 0.5, 12, 1.5, 16, 6, 18, 12],
      },
    },
    {
      id: 'limites',
      type: 'line',
      source: 'omt',
      'source-layer': 'boundary',
      filter: ['<=', ['get', 'admin_level'], 4],
      paint: { 'line-color': c.callesPrincipales, 'line-dasharray': [2, 2], 'line-width': 0.8 },
    },
    {
      id: 'nombres-calles',
      type: 'symbol',
      source: 'omt',
      'source-layer': 'transportation_name',
      minzoom: 14,
      layout: {
        'symbol-placement': 'line',
        'text-field': ['get', 'name'],
        'text-font': FUENTE,
        'text-size': 11,
      },
      paint: { 'text-color': c.textos, 'text-halo-color': c.fondo, 'text-halo-width': 1.2 },
    },
    {
      id: 'lugares',
      type: 'symbol',
      source: 'omt',
      'source-layer': 'place',
      filter: ['in', ['get', 'class'], ['literal', ['city', 'town', 'village', 'suburb', 'neighbourhood']]],
      layout: {
        'text-field': ['get', 'name'],
        'text-font': FUENTE,
        'text-size': ['match', ['get', 'class'], 'city', 14, 'town', 12, 11],
        'text-transform': 'uppercase',
        'text-letter-spacing': 0.12,
      },
      paint: { 'text-color': c.textos, 'text-halo-color': c.fondo, 'text-halo-width': 1.4 },
    },
  ],
};
