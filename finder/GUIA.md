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
| **PWA** | Una web que se instala en el móvil como una app, sin App Store. En iPhone: Safari → Compartir → *Añadir a pantalla de inicio*. |
| **Repositorio** | La carpeta del proyecto guardada en GitHub. Recuerda cada cambio: siempre se puede volver atrás. |
| **Commit** | "Guardar con nota": guardar un cambio en GitHub con una frase que explica qué cambiaste. |
| **Rama** | Una copia paralela del proyecto para trabajar sin tocar la versión principal (`main`). La app se prepara en la rama `claude/dimension-finder`. |
| **Netlify** | El servicio que publica la app. Cada vez que guardas un cambio en GitHub, Netlify lo publica solo en 1-2 minutos. |
| **JSON** | Un archivo de texto con datos en forma de `"etiqueta": "valor"`. Es como una ficha de cliente: la app lo lee y lo pinta. |
| **Revisor** | Un pequeño programa que lee tus archivos de datos antes de publicar. Si hay un error, no deja publicar y te dice qué falla. |
| **Service worker** | La pieza invisible que permite instalar la app y usarla sin conexión. |
| **Código QR** | El cuadrado de puntos que se escanea con la cámara. Cada barbería tiene el suyo para el cuestionario privado. |

---

## 3. Decisiones tomadas

| Tema | Decisión |
|---|---|
| Formato | PWA pensada primero para móvil (iPhone + Safari). |
| Herramientas | Solo el iPhone. Claude trabaja en la nube; tú pruebas y editas desde Safari. |
| Dónde vive el código | En este repositorio, carpeta `finder/`. La portada de la web no se toca. |
| Dónde se publica | Netlify (`…netlify.app`). Con dominio propio: `red.tudominio`. |
| Formularios | Netlify Forms: las respuestas llegan a tu email. |
| Cuestionario privado | Código QR en cada barbería y botón "He visitado esta barbería" en la ficha. |
| Revisión vencida | La barbería sigue visible con **"En revisión periódica"** y a ti te llega un aviso. |
| Retirar el Sello | `"activo": false`. Desaparece al instante. |
| Tienda | "Mal oShop". |
| Mapa | MapLibre + OpenFreeMap (mapas de OpenStreetMap) en tonos grafito. Sin cuentas ni claves. |

> **Un cambio que debes conocer.** En la Sesión 1 dijimos "Revisión en curso".
> Pero "curso" es una de tus palabras prohibidas, y el revisor lo habría
> bloqueado. Ahora dice **"En revisión periódica"**. Si prefieres otra
> fórmula, cámbiala en `textos.json` → `"sello"` → `"enRevision"`.

---

## 4. Pantallas

Barra inferior fija: **Inicio · Red · Sello · Más**.

| Pantalla | Dirección | Qué hace |
|---|---|---|
| Inicio | `/` | Botón "Localizar barbería certificada", garantía, "Nacida en Valencia". |
| Aviso de ubicación | (hoja que sube) | Explica para qué usamos la ubicación antes de que Safari pida permiso. Alternativa: buscar. |
| Red | `/red` | Lista o mapa, ordenados por distancia. Filtros: ciudad, abierto ahora y servicio. |
| Red en expansión | (dentro de Red) | Aparece si la barbería más cercana está a más de 40 km. |
| Ficha | `/barberia/ID` | Fotos, Sello vivo, barbero, Reservar, Llamar, Cómo llegar, horario, servicios, primera visita, cuestionario e incidencias. |
| Incidencia | `/barberia/ID/incidencia` | Formulario que te llega por email. |
| Cuestionario | `/cuestionario/ID` | 4 preguntas, una por pantalla. Es la dirección del QR. |
| Sello | `/sello` | Criterios, revisión y cupo por ciudad. |
| Más | `/mas` | Mal oShop, Academia, Manifiesto, Solicitar el Sello e Instalar. |
| Solicitud | `/solicitar` | Formulario para barberías. |
| Instalar | `/instalar` | Pasos para iPhone y Android. |
| **Códigos QR** | `/qr` | **Página interna, solo para ti.** No aparece en los menús. Genera y descarga el QR de cada barbería. |

---

## 5. Mapa de carpetas

```
finder/
├── datos/            ← LO TUYO. Aquí haces el 95 % de los cambios.
│   ├── barberias.json    las barberías
│   ├── ciudades.json     ciudades próximas, radio y centro del mapa
│   ├── textos.json       todas las frases de la app
│   └── marca.json        colores, tipografías y enlaces a tu web
├── public/
│   ├── fotos/        ← fotos de las barberías
│   └── iconos/       ← iconos de la app (no tocar)
├── src/              ← el código de la app (no hace falta tocarlo)
├── scripts/          ← el revisor de datos y el generador de iconos
├── GUIA.md           ← esta guía
└── netlify.toml      ← instrucciones de publicación (no tocar)
```

Cada archivo de `datos/` empieza con un bloque `"_ayuda"`: unas líneas que
te explican el archivo. La app no las muestra.

---

## 6. Tareas habituales (desde el iPhone)

### 6.1 Cómo editar un archivo en GitHub

1. En Safari, entra en `github.com/marioloragg/dimension-malogalvez-web`.
2. Si te lo pide, cambia de rama: toca **main** y elige la rama de la app.
3. Entra en `finder` → `datos` → el archivo que quieras.
4. Toca el **lápiz** (Edit). Si no lo ves, usa Safari → "aA" → *Solicitar sitio web de escritorio*.
5. Haz el cambio.
6. Toca **Commit changes…**, escribe una frase corta ("Añade barbería X") y confirma.
7. En 1-2 minutos, Netlify publica el cambio. Si hay un error, la versión anterior sigue publicada (ver 8).

### 6.2 Añadir una barbería

1. Abre `datos/barberias.json` y edítalo (6.1).
2. Copia un bloque completo de barbería, desde `{` hasta su `}`.
3. Pégalo después del último bloque. Pon **una coma** entre el `}` anterior y el `{` nuevo.
4. Cambia los datos:
   - `"id"`: en minúsculas, sin espacios ni tildes y distinto a los demás. Ej.: `"estudio-centro-alicante"`.
   - `"datosDePrueba": false` si es una barbería real.
   - **Coordenadas.** En Google Maps, mantén el dedo sobre la barbería: arriba aparecen dos números, como `39.4628, -0.3746`. El primero va en `"lat"` y el segundo en `"lng"`.
   - **Fechas** en dd/mm/aaaa y **horario** en 24 h.
5. Guarda (commit).

**Ejemplo de bloque explicado.** Las notas con `←` son explicaciones; en el archivo real no se escriben:

```
{
  "id": "estudio-ruzafa",            ← sin espacios ni tildes
  "activo": true,                    ← false = Sello retirado
  "datosDePrueba": false,            ← true = muestra "Ficha de prueba"
  "nombre": "Estudio Ruzafa",
  "pais": "ES",
  "ciudad": "Valencia",
  "provincia": "Valencia",
  "codigoPostal": "46004",           ← 5 cifras, CON comillas
  "direccion": "Carrer de Sueca 12, bajo",
  "coordenadas": { "lat": 39.4628, "lng": -0.3746 },   ← SIN comillas
  "telefono": "+34 600 000 001",
  "instagram": "estudioruzafa",      ← sin @; "" si no tiene
  "reserva": { "plataforma": "Booksy", "enlace": "https://..." },
  "barberosCertificados": [
    { "nombre": "Nombre Apellido", "itinerario": "Experto",
      "fechaCertificacion": "15/03/2025", "enlaceReserva": "https://..." }
  ],
  "sello": {
    "certificadaDesde": "02/04/2025",
    "ultimaRevision": "10/09/2026",
    "proximaRevision": "10/03/2028"
  },
  "horario": {
    "lunes": [], "martes": ["10:00-14:00", "16:30-20:30"], "miercoles": ["10:00-20:00"],
    "jueves": ["10:00-20:00"], "viernes": ["10:00-20:00"], "sabado": ["09:30-14:30"], "domingo": []
  },
  "servicios": ["degradado-alta-fidelidad", "ritual-barba", "afeitado-navaja"],
  "fotos": [ { "archivo": "estudio-ruzafa-1.jpg", "descripcion": "Sala principal" } ],
  "notaPrimeraVisita": ""            ← opcional
}
```

Los días se escriben **sin tildes**: `miercoles`, `sabado`.

### 6.3 Retirar una barbería (quitar el Sello)

Cambia `"activo": true` por `"activo": false` y guarda. Desaparece de la app
en 1-2 minutos. Sus datos se conservan por si recupera el Sello.

### 6.4 Registrar una revisión del Sello

Actualiza `"ultimaRevision"` (la fecha de hoy) y `"proximaRevision"` (entre
12 y 18 meses después). Si la diferencia supera los 18 meses, el revisor te
avisa.

### 6.5 Cambiar un texto

Abre `datos/textos.json`. Cambia solo lo que va entre comillas a la
**derecha** de los dos puntos. Respeta las `{palabras entre llaves}`: la app
las sustituye por datos reales.

### 6.6 Cambiar un color

Abre `datos/marca.json` → `"colores"` o `"mapa"`. Formato `#RRGGBB`. Para
encontrar el código de un color, busca "selector de color" en Google.
Respeta la paleta: 80 % obsidiana/grafito, 15 % tiza, 5 % metal, sin dorado.

### 6.7 Añadir fotos

1. En GitHub, entra en `finder/public/fotos`.
2. Toca **Add file → Upload files** y elige la foto del carrete. Usa un nombre sin espacios ni tildes, por ejemplo `estudio-ruzafa-1.jpg`.
3. Commit.
4. En `barberias.json`, escribe ese nombre en `"fotos"` → `"archivo"` y añade una `"descripcion"`.

Fotos horizontales 4:3, de unos 1600 px de ancho y menos de 500 KB.
Estética: hormigón, acero, luz fría. Nada de madera rústica ni postes.

### 6.8 Ciudades "próximas" y radio de cercanía

En `datos/ciudades.json`: `"proximas"` es la lista que aparece como "Próximas".
`"radioCercaKm"` (40) es la distancia a partir de la cual la app muestra
"La Red Dimension está en expansión". Las ciudades activas se calculan solas.

### 6.9 Códigos QR del cuestionario

Abre la app en `/qr` (por ejemplo `https://dimension-finder.netlify.app/qr`).
Cada barbería tiene su QR: tócalo, descárgalo y mándalo a la barbería para
imprimirlo. Si añades una barbería nueva, aparecerá ahí sola.

---

## 7. Formularios: cómo te llegan

Hay 4 formularios: **incidencia**, **cuestionario**, **aviso** (emails de
ciudades sin red) y **solicitud** del Sello. Todos se guardan en Netlify.

- **Leerlos:** en Netlify, entra en tu sitio → **Forms**. Verás cada formulario con sus respuestas.
- **Recibirlos por email:** en tu sitio de Netlify → configuración → **Notifications** → *Form submission notification* → tu email. Los nombres exactos del menú pueden cambiar; los revisamos juntos.
- **Límites:** el plan gratuito de Netlify tiene un número máximo de envíos al mes. Lo comprobamos al configurarlo.

---

## 8. Publicar

### 8.1 Primera vez: conectar Netlify (tarea tuya, una sola vez)

1. En Safari, entra en **netlify.com** → *Sign up* → **con GitHub**.
2. *Add new site / project* → *Import an existing project* → **GitHub** → autoriza → elige `dimension-malogalvez-web`.
3. Rellena:
   - **Branch to deploy:** `claude/dimension-finder`. Cuando unamos la app a `main`, lo cambiaremos a `main`.
   - **Base directory:** `finder`
   - **Build command:** `npm run build`
   - **Publish directory:** `finder/dist`
4. Pulsa **Deploy**. En 2-3 minutos tendrás una dirección `algo.netlify.app`.
5. En la configuración del sitio, cambia el nombre a `dimension-finder`.
6. En **Forms**, activa la detección de formularios (*Enable form detection*) y vuelve a publicar.

### 8.2 Cada cambio

Guardas en GitHub (commit) y Netlify publica solo. Para verlo, recarga la app.
Si está instalada en el iPhone, ciérrala del todo y vuelve a abrirla.

### 8.3 Enlazar la app desde Shopify

1. Shopify (admin) → **Tienda online → Páginas → Directorio Red Dimension**.
2. Escribe un texto breve y añade un enlace a `https://dimension-finder.netlify.app` con el texto **"Localizar barbería certificada"**.
3. Para el menú: **Tienda online → Navegación → menú principal** → *Añadir elemento* → "Red Dimension" → pega el mismo enlace.
4. Cuando tengas dominio propio, apuntaremos `red.tudominio` a Netlify y cambiarás el enlace en estos dos sitios.

---

## 9. Avisos de revisión del Sello

Cada lunes, GitHub revisa si alguna barbería tiene la revisión vencida o
prevista en los próximos 30 días. Si es así, la comprobación sale en rojo y
**GitHub te envía un email**. También puedes lanzarla a mano: en GitHub,
pestaña **Actions** → *Revisión del Sello* → *Run workflow*.

Importante: GitHub solo hace esta revisión semanal desde la rama principal
(`main`). Empezará a funcionar cuando unamos la app a `main`.

---

## 10. Si algo falla

- **Calma: nada se pierde.** GitHub guarda cada versión.
- **Guardé y la app no cambia.** Espera 2 minutos. Después, en Netlify → *Deploys*, mira el último: si está en rojo, el revisor encontró un error y **la versión anterior sigue publicada**.
- **Leer el error.** Entra en ese deploy rojo y busca líneas que empiezan por ✖. Por ejemplo:
  - `el archivo no se puede leer (línea 15, columna 22)` → una coma de más o de menos, o unas comillas sin cerrar, justo antes de ese punto.
  - `"codigoPostal" debe tener 5 cifras y entre comillas` → escribe `"46004"`, no `46004`.
  - `la palabra «curso» no está permitida` → cambia esa palabra.
- **Volver atrás.** En GitHub, abre el archivo → *History*. Ahí ves cada versión y puedes copiar la anterior.
- **Pendiente de revisar juntos:** en la carpeta principal del repositorio hay un archivo llamado `# Arquitectura Capilar by Malo Gálvez` que parece creado sin querer.

---

## 11. Tono y palabras

- Clínico, seguro, empático, desafiante. Nunca servil.
- **Prohibido:** "método", "curso", "corte de pelo", descuentos, ofertas y promociones. El revisor lo comprueba solo.
- Usa: Arquitectura Capilar, diagnóstico, ritual, itinerario.
- Confianza con datos comprobables, nunca con superlativos.

---

## 12. Diario de sesiones

### Sesión 1 · Plano de la app
- Qué es una PWA y por qué no hace falta App Store.
- Por qué la app vive fuera de Shopify pero enlazada desde tu web.
- Cómo es la ficha de una barbería y qué hace el interruptor `activo`.
- Para qué sirve el cuestionario privado.

### Bloque autónomo (equivale a las Sesiones 2-6)
Construido por Claude mientras trabajaba solo:
- App completa con las 3 barberías de prueba (Ruzafa, Ciutat Vella, Paterna).
- Lista y mapa, ubicación con aviso previo, búsqueda por ciudad, provincia o código postal.
- Fichas, filtros, estado de expansión, los 4 formularios y la página de QR.
- PWA instalable con iconos (D metalizada sobre obsidiana) y uso sin conexión.
- Revisor de datos y aviso semanal de revisiones.

**Pendiente contigo:** conectar Netlify (8.1), probar la app en tu iPhone y
hacer los ejercicios.
