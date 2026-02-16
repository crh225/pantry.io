import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

addEventListener('fetch', event => {
  event.respondWith(handleEvent(event))
})

async function handleEvent(event) {
  try {
    return await getAssetFromKV(event, {
      mapRequestToAsset: serveSinglePageApp,
    })
  } catch (e) {
    return new Response(e.message || e.toString(), { status: 500 })
  }
}

function serveSinglePageApp(request) {
  const parsedUrl = new URL(request.url)
  const pathname = parsedUrl.pathname

  // Serve index.html for client-side routing
  if (!pathname.includes('.')) {
    parsedUrl.pathname = '/index.html'
    return new Request(parsedUrl.toString(), request)
  }

  return request
}
