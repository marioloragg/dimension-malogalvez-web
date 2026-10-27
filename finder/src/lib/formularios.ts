// Envía un formulario a Netlify Forms. Netlify guarda la respuesta y te la manda por email.
// Los nombres de formulario y de campos deben coincidir con los de vite.config.ts.
export type NombreFormulario = 'incidencia' | 'cuestionario' | 'aviso' | 'solicitud';

export async function enviarFormulario(nombre: NombreFormulario, campos: Record<string, string>): Promise<void> {
  if (import.meta.env.DEV) {
    // En el ordenador de pruebas no existe Netlify: simulamos el envío.
    console.info('[formulario de prueba]', nombre, campos);
    await new Promise((r) => setTimeout(r, 500));
    return;
  }
  const cuerpo = new URLSearchParams({ 'form-name': nombre, ...campos });
  const respuesta = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: cuerpo.toString(),
  });
  if (!respuesta.ok) throw new Error(`Envío fallido (${respuesta.status})`);
}
