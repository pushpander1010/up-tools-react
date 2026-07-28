// Currency rate proxy worker
export default {
  async fetch(req) {
    const url = new URL(req.url)
    
    // CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Max-Age': '86400',
        }
      })
    }

    // Currency rates endpoint
    if (url.pathname === '/api/rates') {
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD')
        if (!res.ok) {
          // Fallback to frankfurter
          const fallback = await fetch('https://api.frankfurter.dev/latest?from=USD')
          if (!fallback.ok) {
            return new Response(JSON.stringify({ error: 'Rate APIs unavailable' }), {
              status: 502,
              headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            })
          }
          const data = await fallback.json()
          data.rates.USD = 1
          return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=3600' }
          })
        }
        const data = await res.json()
        return new Response(JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=3600' }
        })
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        })
      }
    }

    // Serve static assets for all other routes
    return req.env.ASSETS.fetch(req)
  }
}
