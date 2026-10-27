/**
 * Dimension — contador de interesados en Red Dimension.
 * Recibe los envíos del formulario "Avísame", crea/etiqueta un Cliente real
 * en Shopify y escribe el recuento exacto en el metaobject `red_dimension_stats`
 * que la home lee directamente por Liquid (sin necesidad de recargar la página
 * para que el número exista, aunque sí para verlo reflejado).
 *
 * Variables de entorno requeridas (Cloudflare):
 *   SHOPIFY_STORE_DOMAIN   ej. "aaxv0k-kn.myshopify.com"        (var)
 *   ALLOWED_ORIGIN         ej. "https://aaxv0k-kn.myshopify.com" (var)
 *   METAOBJECT_ID          "gid://shopify/Metaobject/773972885849" (var)
 *   SHOPIFY_ADMIN_TOKEN    token de Admin API (secret, nunca en el repo)
 *                          scopes: read_customers, write_customers,
 *                                  read_metaobjects, write_metaobjects
 */

const TAG = 'red-dimension-interesado';
const API_VERSION = '2026-10';

function corsHeaders(origin, allowedOrigin) {
  const allow = origin === allowedOrigin ? origin : allowedOrigin;
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  };
}

function jsonResponse(body, status, origin, env) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(origin, env.ALLOWED_ORIGIN),
    },
  });
}

async function shopifyAdmin(env, query, variables) {
  const res = await fetch(`https://${env.SHOPIFY_STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': env.SHOPIFY_ADMIN_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) {
    throw new Error('Shopify GraphQL error: ' + JSON.stringify(json.errors));
  }
  return json.data;
}

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function findCustomerByEmail(env, email) {
  const data = await shopifyAdmin(
    env,
    `query($q: String!) { customers(first: 1, query: $q) { nodes { id tags } } }`,
    { q: `email:${email}` }
  );
  return data.customers.nodes[0] || null;
}

async function addTag(env, customerId) {
  await shopifyAdmin(
    env,
    `mutation($id: ID!, $tags: [String!]!) {
      tagsAdd(id: $id, tags: $tags) { userErrors { field message } }
    }`,
    { id: customerId, tags: [TAG] }
  );
}

async function ensureTaggedCustomer(env, { email, name, city }) {
  const existing = await findCustomerByEmail(env, email);

  if (existing) {
    if (!existing.tags.includes(TAG)) await addTag(env, existing.id);
    return;
  }

  const [firstName] = (name || '').trim().split(/\s+/, 1);
  const note = city ? `Interés en Red Dimension — ciudad: ${city}` : 'Interés en Red Dimension';

  const data = await shopifyAdmin(
    env,
    `mutation($input: CustomerInput!) {
      customerCreate(input: $input) {
        customer { id }
        userErrors { field message }
      }
    }`,
    { input: { email, firstName: firstName || undefined, tags: [TAG], note } }
  );

  if (data.customerCreate.userErrors.length) {
    // Carrera: alguien creó al mismo cliente entre la búsqueda y la creación.
    const retry = await findCustomerByEmail(env, email);
    if (retry && !retry.tags.includes(TAG)) await addTag(env, retry.id);
  }
}

async function countTaggedCustomers(env) {
  let total = 0;
  let cursor = null;
  // El store empieza pequeño; 250 por página y hasta 10.000 resultados
  // cubre años de crecimiento real antes de necesitar otra estrategia.
  for (let i = 0; i < 40; i++) {
    const data = await shopifyAdmin(
      env,
      `query($q: String!, $after: String) {
        customers(first: 250, after: $after, query: $q) {
          nodes { id }
          pageInfo { hasNextPage endCursor }
        }
      }`,
      { q: `tag:${TAG}`, after: cursor }
    );
    total += data.customers.nodes.length;
    if (!data.customers.pageInfo.hasNextPage) break;
    cursor = data.customers.pageInfo.endCursor;
  }
  return total;
}

async function updateCounterMetaobject(env, count) {
  await shopifyAdmin(
    env,
    `mutation($id: ID!, $value: String!) {
      metaobjectUpdate(id: $id, metaobject: { fields: [{ key: "interesados", value: $value }] }) {
        userErrors { field message }
      }
    }`,
    { id: env.METAOBJECT_ID, value: String(count) }
  );
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(origin, env.ALLOWED_ORIGIN) });
    }
    if (request.method !== 'POST') {
      return jsonResponse({ error: 'method_not_allowed' }, 405, origin, env);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: 'invalid_json' }, 400, origin, env);
    }

    // Honeypot: campo oculto que un humano nunca rellena.
    if (body.website) {
      return jsonResponse({ ok: true, count: null }, 200, origin, env);
    }

    const email = (body.email || '').trim().toLowerCase();
    const name = (body.name || '').trim();
    const city = (body.city || '').trim();

    if (!isValidEmail(email)) {
      return jsonResponse({ error: 'invalid_email' }, 400, origin, env);
    }

    try {
      await ensureTaggedCustomer(env, { email, name, city });
      const count = await countTaggedCustomers(env);
      await updateCounterMetaobject(env, count);
      return jsonResponse({ ok: true, count }, 200, origin, env);
    } catch (err) {
      console.error(err);
      return jsonResponse({ error: 'server_error' }, 500, origin, env);
    }
  },
};
