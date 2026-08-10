// Shared image-backend helper for uptools image tools.
// Calls the Oracle FastAPI backend (Caddy injects auth + CORS server-side,
// so the client never sends a token).
const BACKEND = 'https://backend.uptools.in/api/image'

export function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// POST a file to an image endpoint with extra form fields.
// Returns { blob, url, width, height, size, quality }.
export async function postImage(endpoint, file, fields = {}) {
  const fd = new FormData()
  fd.append('file', file)
  for (const [k, v] of Object.entries(fields)) {
    if (v !== undefined && v !== null && v !== '') fd.append(k, String(v))
  }
  let res
  try {
    res = await fetch(`${BACKEND}/${endpoint}`, { method: 'POST', body: fd })
  } catch {
    throw new Error('Network error — could not reach the processing server.')
  }
  if (!res.ok) {
    let detail = `Request failed (HTTP ${res.status})`
    try {
      const j = await res.json()
      if (j && j.detail) detail = String(j.detail)
    } catch { /* ignore */ }
    throw new Error(detail)
  }
  const blob = await res.blob()
  const h = (k) => res.headers.get(k)
  return {
    blob,
    url: URL.createObjectURL(blob),
    width: parseInt(h('X-Image-Width') || '0', 10),
    height: parseInt(h('X-Image-Height') || '0', 10),
    size: parseInt(h('X-Image-Size') || String(blob.size), 10) || blob.size,
    quality: parseInt(h('X-Image-Quality') || '0', 10),
  }
}
