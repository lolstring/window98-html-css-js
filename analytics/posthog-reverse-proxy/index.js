const API_HOST = "eu.i.posthog.com" // Change to "eu.i.posthog.com" for the EU region
const ASSET_HOST = "eu-assets.i.posthog.com" // Change to "eu-assets.i.posthog.com" for the EU region
const allowedOrigins = ["http://localhost:9000", "http://dash.cloudflare.com"];

async function handleRequest(request, ctx) {
  const url = new URL(request.url)
  const pathname = url.pathname
  const search = url.search
  const pathWithParams = pathname + search

  if (pathname.startsWith("/static/")) {
    return retrieveStatic(request, pathWithParams, ctx)
  } else {
    return forwardRequest(request, pathWithParams)
  }
}

async function retrieveStatic(request, pathname, ctx) {
  let response = await caches.default.match(request)
  if (!response) {
    response = await fetch(`https://${ASSET_HOST}${pathname}`)
    ctx.waitUntil(caches.default.put(request, response.clone()))
  }
  return response
}

async function forwardRequest(request, pathWithSearch) {
  const originRequest = new Request(request)
  originRequest.headers.delete("cookie")
  return await fetch(`https://${API_HOST}${pathWithSearch}`, originRequest)
}

async function setupDomains(env) {
  if (env.DOMAIN_WHITE_LIST) {
    allowedOrigins.push(...env.DOMAIN_WHITE_LIST.split(',').map(domain => domain.trim()));
  }
}

function getDomainIndex(request) {
  const requestOrigin = request.headers.get('Origin') || request.headers.get('Referer');
  return allowedOrigins.findIndex(domain => requestOrigin && requestOrigin.includes(domain))
}

function validateDomain(request) {
  if (getDomainIndex(request) === -1) {
    return new Response("", {
      status: 404,
      headers: {
        "Access-Control-Allow-Origin": getAccessControlAllowOrigin(request),
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      }
    })
  }
}

function getAccessControlAllowOrigin(request) {
  const domainIndex = getDomainIndex(request);
  if (domainIndex !== -1) {
    return allowedOrigins[domainIndex];
  }
  return allowedOrigins[allowedOrigins.length - 1]; // No match, return last domain
}

export default {
  async fetch(request, env, ctx) {
    setupDomains(env);
    const response = validateDomain(request);
    if (response) {
      return response;
    }
    return handleRequest(request, ctx).then((res) => {
      const newHeaders = new Headers(res.headers)
      newHeaders.set("Access-Control-Allow-Origin", getAccessControlAllowOrigin(request));
      const newResponse = new Response(res.body, {
        headers: newHeaders
      })
      return newResponse;
    });
  }
};