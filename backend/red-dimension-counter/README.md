# Contador de interesados — Red Dimension

Función serverless (Cloudflare Worker) que recibe el formulario "Avísame" de
Red Dimension / Directorio, crea o etiqueta un Cliente real en Shopify
(`red-dimension-interesado`) y escribe el recuento exacto en el metaobject
`red_dimension_stats` (ya creado en la tienda), que la home lee en directo
por Liquid.

## 1. Crear el token de Admin API en Shopify

1. Shopify Admin → **Configuración → Apps y canales de venta → Desarrollar apps**.
2. **Crear una app** (nómbrala p. ej. "Contador Red Dimension").
3. **Configuración de API** → **Configurar Admin API scopes** → marca:
   - `read_customers`, `write_customers`
   - `read_metaobjects`, `write_metaobjects`
4. **Instalar app** → copia el **token de acceso de Admin API** (empieza por `shpat_...`).
   Guárdalo en un gestor de contraseñas — no lo pegues en este chat ni lo subas al repo.

## 2. Desplegar en Cloudflare Workers

Necesitas una cuenta gratuita en [cloudflare.com](https://cloudflare.com) (el plan free cubre 100.000 peticiones/día).

```bash
npm install -g wrangler
cd backend/red-dimension-counter
wrangler login                      # abre el navegador para autorizar
wrangler secret put SHOPIFY_ADMIN_TOKEN   # pega aquí el token del paso 1
wrangler deploy
```

Al terminar, `wrangler` imprime la URL pública del Worker, algo como:

```
https://dimension-red-counter.<tu-subdominio>.workers.dev
```

Esa es la URL que luego pegarás en el ajuste del tema (te aviso en cuanto
conecte el formulario, no hace falta tocar código de nuevo para esto).

## 3. Verificar que funciona

```bash
curl -X POST "https://dimension-red-counter.<tu-subdominio>.workers.dev" \
  -H "Content-Type: application/json" \
  -H "Origin: https://aaxv0k-kn.myshopify.com" \
  -d '{"name":"Prueba","email":"prueba@ejemplo.com","city":"Madrid"}'
```

Debería devolver `{"ok":true,"count":1}` (o el número que corresponda).
Puedes confirmar el valor directamente en Shopify Admin en el metaobject
`red_dimension_stats`.

## Notas de diseño

- El recuento se recalcula desde cero en cada envío consultando
  `customers(query: "tag:red-dimension-interesado")` — nunca se incrementa
  a ciegas, así que nunca se desincroniza aunque borres o editen clientes
  a mano desde el admin.
- Un email que ya está registrado no se cuenta dos veces (se busca primero,
  solo se crea si no existe).
- Lleva un honeypot (campo `website` oculto) como primera barrera antibot;
  si luego hace falta más protección, Cloudflare permite añadir reglas de
  rate-limiting desde el dashboard sin tocar este código.
- `ALLOWED_ORIGIN` restringe qué dominio puede llamar al Worker — actualízalo
  si cambias de dominio (p. ej. al conectar un dominio propio).
