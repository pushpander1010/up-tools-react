// Worker: serve static assets, React SPA for all routes
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Try serving the exact static file
    const response = await env.ASSETS.fetch(request);

    if (response.status === 200) {
      const contentType = response.headers.get('content-type') || '';

      // Serve non-HTML assets directly (JS, CSS, images, APKs, SVGs, etc.)
      if (!contentType.includes('text/html')) {
        return response;
      }

      // HTML from root (/index.html) — serve it
      if (path === '/' || path === '/index.html') {
        return response;
      }

      // Any other HTML file — redirect to SPA
      // (old tool pages that somehow still exist)
      return Response.redirect(url.origin + '/', 302);
    }

    // 307/308 redirect from ASSETS (trailing slash issues etc)
    // Follow it but if it leads to HTML, serve SPA instead
    if (response.status === 307 || response.status === 308) {
      const location = response.headers.get('location');
      if (location) {
        const redirectUrl = new URL(location, url.origin);
        const subResponse = await env.ASSETS.fetch(new Request(redirectUrl, request));
        if (subResponse.status === 200) {
          const ct = subResponse.headers.get('content-type') || '';
          if (!ct.includes('text/html')) {
            return subResponse;
          }
          // HTML sub-page — serve SPA instead
        }
      }
      // Serve SPA for all redirected HTML requests
      const indexRequest = new Request(new URL('/index.html', request.url), request);
      return env.ASSETS.fetch(indexRequest);
    }

    // 404 or other — serve SPA
    const indexRequest = new Request(new URL('/index.html', request.url), request);
    return env.ASSETS.fetch(indexRequest);
  }
};
