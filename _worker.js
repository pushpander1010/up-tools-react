// Worker: serve tool/game HTML pages as static files, React SPA for everything else
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Try serving the exact static file (tool pages, games, assets, etc.)
    const response = await env.ASSETS.fetch(request);
    
    // If it's a real file (not redirect/404), serve it
    if (response.status === 200) {
      const contentType = response.headers.get('content-type') || '';
      // Serve HTML tool/game pages directly
      if (contentType.includes('text/html')) {
        return response;
      }
      // Serve static assets (JS, CSS, images, APKs, etc.)
      return response;
    }

    // For SPA routes (/, /games, /hncker, /:toolSlug that don't have matching HTML)
    // serve index.html
    const indexRequest = new Request(new URL('/index.html', request.url), request);
    return env.ASSETS.fetch(indexRequest);
  }
};
