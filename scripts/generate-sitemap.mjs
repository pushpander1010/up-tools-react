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

// Section landing pages
for (const [path, priority] of [['hncker', '0.6'], ['games', '0.6'], ['aimakerich', '0.6'], ['aiforrich', '0.6'], ['about', '0.5'], ['privacy-policy', '0.3']]) {
  urls.push({ loc: `${SITE}/${path}/`, priority, freq: 'weekly' })
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u.loc}</loc><lastmod>${today}</lastmod><changefreq>${u.freq}</changefreq><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>
`

writeFileSync(join(root, 'public/sitemap.xml'), xml)
console.log(`✅ Sitemap regenerated: ${urls.length} URLs -> public/sitemap.xml`)