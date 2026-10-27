import type { Barberia } from '../datos';

export const esIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

/** Abre Apple Maps en iPhone y Google Maps en el resto. */
export function enlaceComoLlegar(b: Barberia): string {
  const { lat, lng } = b.coordenadas;
  return esIOS()
    ? `https://maps.apple.com/?daddr=${lat},${lng}&q=${encodeURIComponent(b.nombre)}`
    : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

export const enlaceTelefono = (tel: string) => `tel:${tel.replace(/\s/g, '')}`;
export const enlaceInstagram = (usuario: string) => `https://instagram.com/${usuario}`;

export const estaInstalada = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;
