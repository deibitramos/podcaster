export const config = { runtime: 'edge' };

const ALLOWED_PATHS = new Set(['/search', '/lookup']);

/** Build the iTunes target URL, allow-listing only /search and /lookup */
function buildTargetURL(reqUrl: URL): URL | null {
  const endpoint = reqUrl.searchParams.get('endpoint'); // e.g. "search" | "lookup"
  if (!endpoint) return null;

  const path = `/${endpoint}`;
  if (!ALLOWED_PATHS.has(path)) return null;

  // Copy all params except "endpoint"
  const params = new URLSearchParams(reqUrl.search);
  params.delete('endpoint');

  // iTunes base
  const target = new URL(`https://itunes.apple.com${path}`);
  // Pass through the remaining query (entity, term, limit, id, country, media, etc.)
  params.forEach((v, k) => {
    target.searchParams.append(k, v);
  });

  return target;
}

function corsHeaders(origin: string | null) {
  return {
    'Access-Control-Allow-Origin': origin ?? '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Vary': 'Origin',
  };
}

export default async function handler(req: Request) {
  const reqUrl = new URL(req.url);
  const origin = req.headers.get('origin');

  // Handle preflight (not strictly needed for GET, but harmless)
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders(origin) });
  }

  if (req.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders(origin) });
  }

  const target = buildTargetURL(reqUrl);
  if (!target) {
    return new Response('Bad Request: invalid endpoint',
      { status: 400, headers: corsHeaders(origin) });
  }

  const upstream = await fetch(target.toString(), {
    headers: { 'User-Agent': 'podcaster.deibit.dev' },
    redirect: 'follow',
  });

  const headers = new Headers(upstream.headers);
  headers.set('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=3600');

  const ch = corsHeaders(origin);
  Object.entries(ch).forEach(([k, v]) => {
    headers.set(k, v);
  });

  headers.delete('Transfer-Encoding');
  headers.delete('Connection');

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
