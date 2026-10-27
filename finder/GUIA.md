# GUÍA de Dimension Finder

Esta guía es tuya, Mario. Crece con cada sesión. Si algún día no recuerdas
cómo se hace algo, empieza a buscar aquí.

---

## 1. Qué es Dimension Finder

La app de cliente de Dimension by Malo Gálvez. Sirve para localizar la
barbería certificada más cercana de la Red Dimension.

- Solo aparecen barberías con **Sello Dimension vigente**. No es un directorio
  general: la exclusividad es el valor.
- No hay estrellas ni reseñas públicas. La confianza la da la certificación.
- Nace en Valencia y crece ciudad a ciudad por España.

---

## 2. Palabras que vas a oír

| Palabra | Qué significa |
|---|---|
| **PWA** | Una web que se instala en el móvil como una app, con su icono, sin pasar por App Store. En iPhone: Safari → Compartir → *Añadir a pantalla de inicio*. |
| **Repositorio** | La carpeta del proyecto guardada en GitHub. Recuerda cada cambio, así que siempre se puede volver atrás. |
| **GitHub** | La web donde vive el repositorio. Desde Safari puedes ver y editar los archivos. |
| **Commit** | "Guardar con nota": guardar un cambio en GitHub con una frase que explica qué cambiaste. |
| **Netlify** | El servicio que publica la app en internet. Cada vez que guardas un cambio en GitHub, Netlify lo publica solo en 1-2 minutos. |
| **JSON** | Un archivo de texto con datos en forma de `"etiqueta": "valor"`. Es como una ficha de cliente. La app lo lee y lo pinta en pantalla. |
| **Dominio** | El nombre de tu web en internet (por ejemplo `tudominio.com`). Todavía no tienes uno propio. |

---

## 3. Decisiones tomadas (Sesión 1)

| Tema | Decisión |
|---|---|
| Formato | PWA pensada primero para móvil (iPhone + Safari). |
| Herramientas | Solo el iPhone. Claude trabaja en la nube; tú pruebas y editas desde Safari. |
| Dónde vive el código | En este repositorio, dentro de la carpeta `finder/`. La portada de la web no se toca. |
| Dónde se publica | Netlify (`…netlify.app`). Cuando haya dominio propio: `red.tudominio`. |
| Enlace desde Shopify | Desde la página "Directorio Red Dimension" y el menú. |
| Formularios | Netlify Forms: las respuestas llegan a tu email. |
| Cuestionario privado | Código QR en cada barbería y botón "He visitado esta barbería" en la ficha. |
| Revisión vencida | La barbería sigue visible con "Revisión en curso" y tú recibes un aviso. |
| Retirar el Sello | Interruptor `activo: false`. Desaparece al instante. |
| Botón de la tienda | "Mal oShop". |
| Mapa | MapLibre + OpenStreetMap en tonos grafito. Sin cuentas ni claves. |

**Texto de garantía (Inicio):**
> Cada barbería de la Red Dimension mantiene un Sello vigente. Lo revisamos
> de forma continua. Si el estándar cae, el Sello se retira y la barbería
> deja de aparecer aquí.

**Texto de garantía (ficha):**
> Sello revisado de forma continua. Si el estándar cae, se retira.

---

## 4. Pantallas

Barra inferior fija con cuatro accesos: **Inicio · Red · Sello · Más**.

1. **Inicio**: botón "Localizar barbería certificada" (en la zona del pulgar),
   garantía, "Nacida en Valencia".
2. **Aviso de ubicación**: antes de que Safari pida permiso, explicamos para qué
   se usa. Alternativa: buscar por ciudad, provincia o código postal.
3. **Red**: mapa a pantalla completa y lista en una hoja que se desliza
   desde abajo. Filtros: ciudad, abierto ahora y servicio.
4. **Red en expansión**: si no hay barberías cerca. Ciudades activas y
   próximas, y un campo de email para recibir aviso.
5. **Ficha de barbería**: fotos, Sello vivo, barbero certificado, botón fijo
   "Reservar", Llamar, Cómo llegar, horario, Instagram, servicios, qué esperar
   en la primera visita y "Reportar una experiencia por debajo del estándar".
6. **Incidencia**: formulario breve con confirmación al cliente.
7. **Cuestionario privado**: una pregunta por pantalla, 3-4 en total.
8. **Qué es el Sello Dimension**: criterios, revisión cada 12-18 meses y cupo
   por ciudad.
9. **Más**: Mal oShop, Academia, Manifiesto, "Solicitar el Sello Dimension"
   (para barberías) e "Instalar Dimension".

---

## 5. Archivos que vas a tocar

Todo lo que editas vive en la carpeta `finder/datos/`. No hace falta tocar
el código.

| Archivo | Qué contiene |
|---|---|
| `barberias.json` | Las barberías de la red. |
| `ciudades.json` | Ciudades activas y próximas (pantalla "Red en expansión"). |
| `textos.json` | Todas las frases de la app. |
| `marca.json` | Colores, tipografías y enlaces a la web. |

### Ficha de una barbería (formato provisional)

Se confirmará en la Sesión 2. Las notas con `←` son explicaciones de esta
guía; **en el archivo real no se escriben**.

```
{
  "id": "atelier-ruzafa",                ← nombre interno, sin espacios ni tildes
  "activo": true,                        ← false = Sello retirado, desaparece
  "datosDePrueba": true,                 ← true = muestra "Ficha de prueba"
  "nombre": "Atelier Ruzafa",
  "pais": "ES",
  "ciudad": "Valencia",
  "provincia": "Valencia",
  "codigoPostal": "46004",               ← siempre 5 cifras, entre comillas
  "direccion": "Calle Sueca 12, bajo",
  "coordenadas": { "lat": 39.4625, "lng": -0.3740 },
  "telefono": "+34 600 000 000",
  "instagram": "atelierruzafa",          ← sin @
  "reserva": { "plataforma": "Booksy", "enlace": "https://..." },
  "barberosCertificados": [
    {
      "nombre": "Nombre Apellido",
      "itinerario": "Experto",
      "fechaCertificacion": "15/03/2025",
      "enlaceReserva": "https://..."
    }
  ],
  "sello": {
    "certificadaDesde": "15/03/2025",
    "ultimaRevision": "10/09/2026",
    "proximaRevision": "10/03/2028"     ← fechas siempre dd/mm/aaaa
  },
  "horario": {
    "lunes":   ["10:00-14:00", "16:30-20:30"],
    "martes":  ["10:00-20:00"],
    "domingo": []                        ← lista vacía = cerrado
  },
  "servicios": ["degradado-alta-fidelidad", "ritual-barba", "afeitado-navaja"],
  "fotos": [ { "archivo": "atelier-ruzafa-1.jpg", "descripcion": "Sala principal" } ],
  "notaPrimeraVisita": ""                ← opcional
}
```

Reglas de oro del JSON:
- Los textos van **entre comillas**: `"Valencia"`.
- `true`, `false` y los números van **sin comillas**.
- Cada línea termina en **coma**, **salvo la última** de cada bloque.
- Si te equivocas, el revisor automático no deja publicar y te dice en qué
  línea está el fallo.

---

## 6. Tareas habituales

Se completa en las próximas sesiones:

- Añadir una barbería → *Sesión 2*
- Retirar una barbería (quitar el Sello) → *Sesión 2*
- Cambiar un texto → *Sesión 2*
- Cambiar un color → *Sesión 2*
- Subir fotos desde el iPhone → *Sesión 4*
- Leer los formularios → *Sesión 5*
- Publicar y ver la vista previa → *Sesión 6*

---

## 7. Tono y palabras

- Clínico, seguro, empático, desafiante. Nunca servil.
- **Prohibido en la app:** "método", "curso", "corte de pelo".
  Usa: Arquitectura Capilar, diagnóstico, ritual, itinerario.
- Nunca descuentos, ofertas ni promociones.
- Confianza con datos comprobables, nunca con superlativos.

---

## 8. Si algo falla

- **Calma: nada se pierde.** GitHub guarda cada versión y siempre se puede
  volver a la anterior.
- Si la app no se actualiza tras guardar, espera 2 minutos y recarga.
- Si el revisor automático da un error, lee la línea que indica: casi siempre
  es una coma o unas comillas.
- *(Se ampliará en cada sesión.)*

**Pendiente de revisar juntos:** en la carpeta principal del repositorio hay un
archivo llamado `# Arquitectura Capilar by Malo Gálvez` que parece creado sin
querer. No rompe nada; lo borraremos juntos cuando aprendas a borrar archivos.

---

## 9. Diario de sesiones

### Sesión 1 · Plano de la app
- Qué es una PWA y por qué no hace falta App Store.
- Por qué la app vive fuera de Shopify pero enlazada desde tu web.
- Cómo es la ficha de una barbería y qué hace el interruptor `activo`.
- Para qué sirve el cuestionario privado y en qué se diferencia de una incidencia.
- Siguiente: Sesión 2, la app base con la lista de barberías desde el JSON.
