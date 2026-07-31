import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dist = join(__dirname, '..', 'dist')
const toolsDir = join(__dirname, '..', 'src', 'tools')

// Read built index.html as template
const template = readFileSync(join(dist, 'index.html'), 'utf-8')

// Get all tool JSX/TSX files
const toolFiles = readdirSync(toolsDir).filter(f => f.endsWith('.jsx') || f.endsWith('.tsx'))

// Slugs that have dedicated static HTML in public/ — don't overwrite
const SKIP_SLUGS = new Set(['games', 'about', 'contact', 'hncker', 'privacy-policy'])

let count = 0
for (const file of toolFiles) {
  let slug = file.replace(/\.(jsx|tsx)$/, '').replace(/_/g, '-')
    .replace(/^tool-/, '') // remove tool_ prefix for files starting with digits

  // Nested hncker pages: hncker_ahmyth.jsx → /hncker/ahmyth/
  if (slug.startsWith('hncker-')) {
    slug = 'hncker/' + slug.slice('hncker-'.length)
  }

  // Skip slugs with dedicated static pages
  if (SKIP_SLUGS.has(slug)) continue
  
  // Read component to extract title/desc from ToolLayout props
  const content = readFileSync(join(toolsDir, file), 'utf-8')
  
  const titleMatch = content.match(/\btitle\s*=\s*['"`]([^'"`]+)['"`]/)
  const descMatch = content.match(/\bdesc\s*=\s*['"`]([^'"`]+)['"`]/)
  
  const title = (titleMatch ? titleMatch[1] : slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const desc = (descMatch ? descMatch[1] : `${title}. Free online tool by UpTools.`)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  
  // Build per-tool HTML
  let html = template
  
  html = html.replace(/<title>.*?<\/title>/, `<title>${title} | UpTools</title>`)
  
  if (/<meta name="description"/.test(html)) {
    html = html.replace(/<meta name="description"[^>]*\/>/, `<meta name="description" content="${desc}" />`)
  }
  
  html = html.replace(/<link rel="canonical"[^>]*\/>/, `<link rel="canonical" href="https://www.uptools.in/${slug}/" />`)
  
  const og = `
    <meta property="og:title" content="${title} | UpTools" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:url" content="https://www.uptools.in/${slug}/" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="UpTools" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title} | UpTools" />
    <meta name="twitter:description" content="${desc}" />
  `
  html = html.replace('</head>', og + '\n  </head>')
  
  const outDir = join(dist, slug)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'index.html'), html)
  count++
}

// Build a static index.html for a given slug (used for landing pages skipped above)
function buildHtml(slug, title, desc) {
  let html = template
  html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
  if (/<meta name="description"/.test(html)) {
    html = html.replace(/<meta name="description"[^>]*\/>/, `<meta name="description" content="${desc}" />`)
  }
  html = html.replace(/<link rel="canonical"[^>]*\/>/, `<link rel="canonical" href="https://www.uptools.in/${slug}/" />`)
  const og = `
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:url" content="https://www.uptools.in/${slug}/" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="UpTools" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${desc}" />
  `
  html = html.replace('</head>', og + '\n  </head>')
  const outDir = join(dist, slug)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'index.html'), html)
}

// HNCKER landing page: it sits in SKIP_SLUGS, but once dist/hncker/ exists as a
// directory (from the tool sub-pages) the worker 1101s on /hncker/ without a static
// index.html. Give it one so the nested route resolves.
buildHtml('hncker', 'HNCKER - Apps, Tools, Instagram & Videos',
  'Follow HNCKER on Instagram, browse the free security tools, watch our tech videos, and download free Android apps.')

console.log(`✅ Generated SEO HTML for ${count} tools`)
