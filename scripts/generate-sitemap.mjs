// Regenerate public/sitemap.xml from src/data/tools.json (idempotent, run at build).
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const tools = JSON.parse(readFileSync(join(root, 'src/data/tools.json'), 'utf8')).tools

const today = new Date().toISOString().slice(0, 10)
const SITE = 'https://www.uptools.in'

function mapSlug(slug) {
  // Nested sections: hncker_x.jsx → /hncker/x/, games handled by dir, aimakerich_x → /aimakerich/x/, aiforrich_x → /aiforrich/x/
  if (slug.startsWith('hncker-')) return `hncker/${slug.slice('hncker-'.length)}`
  if (slug.startsWith('aimakerich-')) return `aimakerich/${slug.slice('aimakerich-'.length)}`
  if (slug.startsWith('aiforrich-')) return `aiforrich/${slug.slice('aiforrich-'.length)}`
  if (slug.startsWith('games-')) return `games/${slug.slice('games-'.length)}`
  return slug
}

const urls = []
urls.push({ loc: `${SITE}/`, priority: '0.9', freq: 'daily' })

// Priority boost for high-traffic finance/tax pages (helps Google weigh crawl)
const PRIORITY_BOOST = new Set([
  'income-tax-tool', 'gst-calculator', 'emi-calculator', 'sip-calculator',
  'fd-calculator', 'ppf-calculator', 'epf-calculator', 'tds-calculator',
  'ctc-salary-calculator', 'currency-converter', 'indian-stock-market-live',
  'gold-rate-india', 'mutual-fund-nav', 'home-loan-eligibility-calculator',
  'life-insurance-calculator', 'health-insurance-calculator', 'car-insurance-calculator', 'bike-insurance-calculator',
])

for (const t of tools) {
  const slugPath = mapSlug(t.slug)
  urls.push({
    loc: `${SITE}/${slugPath}/`,
    priority: PRIORITY_BOOST.has(t.slug) ? '0.8' : '0.6',
    freq: t.cats?.includes('finance') ? 'daily' : 'weekly',
  })
}

// Blogs landing + individual posts (from src/data/blogs.json)
try {
  const blogs = JSON.parse(readFileSync(join(root, 'src/data/blogs.json'), 'utf8'))
  const blogList = Array.isArray(blogs) ? blogs : (blogs.blogs || [])
  urls.push({ loc: `${SITE}/blogs/`, priority: '0.7', freq: 'daily' })
  for (const b of blogList) {
    if (b.slug) urls.push({ loc: `${SITE}/blogs/${b.slug}/`, priority: '0.7', freq: 'weekly', lastmod: b.date || today })
  }
} catch (e) { console.warn('blogs.json not found for sitemap', e.message) }

// All games from GamesPage.jsx GAMES list (many are NOT in tools.json —
// sitemap gap found Sep 2026: flappy-bird, snake, tetris etc. had no entry)
const seenLocs = new Set(urls.map(u => u.loc))
try {
  const gamesSrc = readFileSync(join(root, 'src/pages/GamesPage.jsx'), 'utf8')
  const m = gamesSrc.match(/const GAMES = \[([\s\S]*?)\n\]/)
  if (m) {
    const re = /\{\s*slug:\s*'([^']+)'/g
    let g
    while ((g = re.exec(m[1])) !== null) {
      const loc = `${SITE}/games/${g[1]}/`
      if (!seenLocs.has(loc)) {
        seenLocs.add(loc)
        urls.push({ loc, priority: '0.6', freq: 'weekly' })
      }
    }
  }
} catch (e) { console.warn('GamesPage not found for sitemap', e.message) }

// Orphan hub entries: pages that exist in section-page arrays (HnckerPage etc.)
// but were never added to tools.json (mosint, phunter found Sep 2026)
for (const [pageFile, section] of [['HnckerPage.jsx', 'hncker'], ['AimakerichPage.jsx', 'aimakerich'], ['AiforrichPage.jsx', 'aiforrich']]) {
  try {
    const src = readFileSync(join(root, 'src/pages', pageFile), 'utf8')
    const m = src.match(/const tools = \[([\s\S]*?)\n\]/)
    if (!m) continue
    const re = /\{\s*slug:\s*'([^']+)'/g
    let g
    while ((g = re.exec(m[1])) !== null) {
      const loc = `${SITE}/${section}/${g[1]}/`
      if (!seenLocs.has(loc)) {
        seenLocs.add(loc)
        urls.push({ loc, priority: '0.6', freq: 'weekly' })
      }
    }
  } catch (e) { console.warn(`${pageFile} not found for sitemap`, e.message) }
}

// Section landing pages
for (const [path, priority] of [['hncker', '0.6'], ['games', '0.6'], ['aimakerich', '0.6'], ['aiforrich', '0.6'], ['about', '0.5'], ['privacy-policy', '0.3']]) {
  urls.push({ loc: `${SITE}/${path}/`, priority, freq: 'weekly' })
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod || today}</lastmod><changefreq>${u.freq}</changefreq><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>
`

writeFileSync(join(root, 'public/sitemap.xml'), xml)
console.log(`✅ Sitemap regenerated: ${urls.length} URLs -> public/sitemap.xml`)