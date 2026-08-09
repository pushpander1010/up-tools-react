import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dist = join(__dirname, '..', 'dist')
const toolsDir = join(__dirname, '..', 'src', 'tools')

// Extract { q, a } FAQ pairs from a tool's JSX source. Supports both:
//   const faq = [ { q: '..', a: '..' }, ... ]
//   faq={[ { q: "..", a: ".." }, ... ]}
function extractFaq(content) {
  let m = content.match(/const faq = \[(.*?)\n\]/s)
  if (!m) m = content.match(/faq=\{\[(.*?)\]\s*\}/s)
  if (!m) return []
  const block = m[1]
  const pairs = []
  const re = /\{\s*q\s*:\s*(['"])((?:(?!\1).|\\.)*)\1\s*,\s*a\s*:\s*(['"])((?:(?!\3).|\\.)*)\3\s*\}/g
  let om
  while ((om = re.exec(block)) !== null) {
    const unq = (s) => s.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, '\\')
    pairs.push({ q: unq(om[2]), a: unq(om[4]) })
  }
  return pairs
}

// Page already ships FAQPage schema client-side via Helmet -> skip static injection to avoid dupes.
function hasFaqPageSchema(content) {
  return /["']@type["']\s*:\s*["']FAQPage["']/.test(content)
}

// Build a FAQPage JSON-LD script tag.
function faqJsonLd(pairs) {
  const mainEntity = pairs.map((p) => ({
    '@type': 'Question',
    name: p.q,
    acceptedAnswer: { '@type': 'Answer', text: p.a },
  }))
  const schema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity }
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`
}

// Get all tool JSX/TSX files
const toolFiles = readdirSync(toolsDir).filter(f => f.endsWith('.jsx') || f.endsWith('.tsx'))

// Read built index.html as template (once, outside the loop)
const template = readFileSync(join(dist, 'index.html'), 'utf-8')

// Slugs that have dedicated static HTML in public/ — don't overwrite
const SKIP_SLUGS = new Set(['games', 'about', 'contact', 'hncker', 'aimakerich', 'privacy-policy'])

let count = 0
for (const file of toolFiles) {
  let slug = file.replace(/\.(jsx|tsx)$/, '').replace(/_/g, '-')
    .replace(/^tool-/, '') // remove tool_ prefix for files starting with digits

  // Nested hncker pages: hncker_ahmyth.jsx → /hncker/ahmyth/
  if (slug.startsWith('hncker-')) {
    slug = 'hncker/' + slug.slice('hncker-'.length)
  }

  // Nested aimakerich pages: aimakerich_x.jsx → /aimakerich/x/
  if (slug.startsWith('aimakerich-')) {
    slug = 'aimakerich/' + slug.slice('aimakerich-'.length)
  }

  // Nested game pages: games_snake.jsx → /games/snake/
  if (slug.startsWith('games-')) {
    slug = 'games/' + slug.slice('games-'.length)
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
  
  const descTag = `<meta name="description" content="${desc}" />`
  if (/<meta name="description"/.test(html)) {
    html = html.replace(/<meta name="description"[^>]*\/>/, descTag)
  } else {
    html = html.replace(/<\/title>/, `</title>\n    ${descTag}`)
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

  // Inject static FAQPage JSON-LD for pages with FAQ data (skip pages already shipping it via Helmet)
  const pairs = extractFaq(content)
  if (pairs.length > 0 && !hasFaqPageSchema(content)) {
    html = html.replace('</head>', '    ' + faqJsonLd(pairs) + '\n  </head>')
  }

  const outDir = join(dist, slug)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'index.html'), html)
  count++
}

// Build a static index.html for a given slug (used for landing pages skipped above)
function buildHtml(slug, title, desc) {
  let html = template
  html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
  const descTag = `<meta name="description" content="${desc}" />`
  if (/<meta name="description"/.test(html)) {
    html = html.replace(/<meta name="description"[^>]*\/>/, descTag)
  } else {
    html = html.replace(/<\/title>/, `</title>\n    ${descTag}`)
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

// Games landing page: same failure class. Once dist/games/ exists as a directory
// (from the game sub-pages), /games/ 1101s without its own static index.html.
buildHtml('games', 'UpTools - Free Online Games',
  'Play free online arcade, puzzle, card and word games on UpTools - Snake, Tetris, 2048, Pac-Man, Wordle and many more. No downloads, play in your browser.')

// AIMakeRich landing page: same failure class as hncker/games. Once dist/aimakerich/
// exists as a directory (from the reel sub-pages), /aimakerich/ 1101s without its own
// static index.html. Give it one so the nested route resolves.
buildHtml('aimakerich', 'AIMakeRich - Finance, Investing & Trading Guides',
  'AIMakeRich: practical money guides that match our Instagram reels. Learn investing, trading strategies and finance with real code, step-by-step processes, FAQs and how-tos.')

console.log(`✅ Generated SEO HTML for ${count} tools`)
