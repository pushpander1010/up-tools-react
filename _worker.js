// Worker: serve static assets, React SPA for all HTML routes
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Try serving the exact static file
    const response = await env.ASSETS.fetch(request);

    if (response.status === 200) {
      const contentType = response.headers.get('content-type') || '';

      // Serve non-HTML assets directly (JS, CSS, images, APKs, etc.)
      if (!contentType.includes('text/html')) {
        return response;
      }

      // For HTML: only serve if it's NOT a tool/game subdirectory page
      // Tool pages like /gst-calculator/index.html should use React SPA instead
      const isSubPage = path !== '/' && path !== '/index.html' && path.split('/').filter(Boolean).length >= 1;
      if (isSubPage) {
        // Skip old HTML, serve React SPA
        const indexRequest = new Request(new URL('/index.html', request.url), request);
        return env.ASSETS.fetch(indexRequest);
      }

      // Root index.html — serve it
      return response;
    }

    // Fallback: serve React SPA for all unmatched routes
    const indexRequest = new Request(new URL('/index.html', request.url), request);
    return env.ASSETS.fetch(indexRequest);
  }
};
