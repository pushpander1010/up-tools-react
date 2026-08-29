import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dist = join(__dirname, '..', 'dist')
const toolsDir = join(__dirname, '..', 'src', 'tools')
const publicOgDir = join(__dirname, '..', 'public', 'assets', 'og')
const SITE = 'https://www.uptools.in'

function esc(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') }
function escAttr(s) { return s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;') }

// Extract { q, a } FAQ pairs
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
function hasFaqPageSchema(content) { return /["']@type["']\s*:\s*["']FAQPage["']/.test(content) }
function faqJsonLd(pairs) {
  const mainEntity = pairs.map(p => ({ '@type':'Question', name:p.q, acceptedAnswer:{'@type':'Answer', text:p.a}}))
  return `<script type="application/ld+json">${JSON.stringify({ '@context':'https://schema.org','@type':'FAQPage', mainEntity})}</script>`
}
function breadcrumbJsonLd(slug, title) {
  const parts = slug.split('/')
  const section = parts.length>1 ? parts[0] : null
  const sectionName = section==='hncker'?'HNCKER':section==='games'?'Games':section?section.charAt(0).toUpperCase()+section.slice(1):null
  const items = [
    { '@type':'ListItem', position:1, name:'Home', item: SITE+'/' },
    ...(section?[{ '@type':'ListItem', position:2, name:sectionName, item: SITE+'/'+section+'/' }]:[]),
    { '@type':'ListItem', position:section?3:2, name:title, item: SITE+'/'+slug+'/' },
  ]
  return `<script type="application/ld+json">${JSON.stringify({ '@context':'https://schema.org','@type':'BreadcrumbList', itemListElement:items })}</script>`
}

// howItWorks strings — handles 'Toggle "quoted" text' correctly (mixed quotes)
function extractHowItWorks(content) {
  const m = content.match(/howItWorks=\{\[([\s\S]*?)\]\s*\}/)
  if (!m) return []
  const block = m[1]
  const out=[]
  const re = /'((?:\\'|[^'])*)'|"((?:\\"|[^"])*)"/g
  let mm
  while((mm=re.exec(block))!==null){
    const raw = mm[1] !== undefined ? mm[1] : mm[2]
    const val = raw.replace(/\\'/g,"'").replace(/\\"/g,'"').replace(/\\\\/g,'\\').trim()
    if(val.length>8) out.push(val)
  }
  return out
}

// Try to pull applicationCategory from the tool's SoftwareApplication schema prop
function extractCategory(content) {
  const m = content.match(/"applicationCategory"\s*:\s*"([^"]+)"/)
  return m ? m[1] : 'UtilitiesApplication'
}
function softwareJsonLd(title, desc, slug, category) {
  const schema = {
    '@context':'https://schema.org',
    '@type':'SoftwareApplication',
    name: title,
    description: desc,
    url: SITE+'/'+slug+'/',
    applicationCategory: category,
    operatingSystem: 'Web',
    offers: { '@type':'Offer', price:'0', priceCurrency:'INR' }
  }
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`
}
function hasSoftwareSchema(content){ return /["']@type["']\s*:\s*["']SoftwareApplication["']/.test(content) }

// og:image resolver — prefers slug.png, else default.png
const ogFiles = new Set(readdirSync(publicOgDir).filter(f=>f.endsWith('.png')).map(f=>f.slice(0,-4)))
function ogImageForSlug(slug){
  if (ogFiles.has(slug)) return `/assets/og/${slug}.png`
  // also try short alias: e.g. gst.png for gst-calculator slug — prefer exact, else default
  const short = slug.split('/').pop()
  if (ogFiles.has(short)) return `/assets/og/${short}.png`
  // try mapping without suffix like income-tax -> income-tax.png exists
  return '/assets/og/default.png'
}

const toolFiles = readdirSync(toolsDir).filter(f=>f.endsWith('.jsx')||f.endsWith('.tsx'))
const template = readFileSync(join(dist,'index.html'),'utf-8')
const SKIP_SLUGS = new Set(['games','contact','hncker','aimakerich','privacy-policy'])

let count=0
for(const file of toolFiles){
  let slug = file.replace(/\.(jsx|tsx)$/,'').replace(/_/g,'-').replace(/^tool-/,'')
  if(slug.startsWith('hncker-')) slug='hncker/'+slug.slice('hncker-'.length)
  if(slug.startsWith('aimakerich-')) slug='aimakerich/'+slug.slice('aimakerich-'.length)
  if(slug.startsWith('games-')) slug='games/'+slug.slice('games-'.length)
  if(SKIP_SLUGS.has(slug)) continue

  const content = readFileSync(join(toolsDir,file),'utf-8')
  const titleMatch = content.match(/\btitle\s*=\s*['"`]([^'"`]+)['"`]/)
  const descMatch = content.match(/\bdesc\s*=\s*['"`]([^'"`]+)['"`]/)
  const rawTitle = titleMatch?titleMatch[1]:slug.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase())
  const rawDesc = descMatch?descMatch[1]:`${rawTitle}. Free online tool by UpTools.`
  const title = rawTitle.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  const desc = rawDesc.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  const ogImage = ogImageForSlug(slug)

  let html = template
  // title / desc / canonical
  html = html.replace(/<title>.*?<\/title>/, `<title>${title} | UpTools</title>`)
  const descTag = `<meta name="description" content="${escAttr(rawDesc)}" />`
  if(/<meta name="description"/.test(html)) html = html.replace(/<meta name="description"[^>]*\/>/, descTag)
  else html = html.replace(/<\/title>/, `</title>\n    ${descTag}`)
  html = html.replace(/<link rel="canonical"[^>]*\/>/, `<link rel="canonical" href="${SITE}/${slug}/" />`)

  // og/twitter — replace if present, else inject
  function upsertMeta(property, value){
    const tag = `<meta property="${property}" content="${escAttr(value)}" />`
    const re = new RegExp(`<meta property="${property}"[^>]*\\/?>`)
    if(re.test(html)) html = html.replace(re, tag)
    else html = html.replace('</head>', `    ${tag}\n  </head>`)
  }
  function upsertName(name, value){
    const tag = `<meta name="${name}" content="${escAttr(value)}" />`
    const re = new RegExp(`<meta name="${name}"[^>]*\\/?>`)
    if(re.test(html)) html = html.replace(re, tag)
    else html = html.replace('</head>', `    ${tag}\n  </head>`)
  }
  upsertMeta('og:title', `${rawTitle} | UpTools`)
  upsertMeta('og:description', rawDesc)
  upsertMeta('og:url', `${SITE}/${slug}/`)
  upsertMeta('og:type', 'website')
  upsertMeta('og:site_name', 'UpTools')
  // og:image (+ dimensions)
  upsertMeta('og:image', `${SITE}${ogImage}`)
  if(!/og:image:width/.test(html)) html = html.replace('</head>', `    <meta property="og:image:width" content="1200" />\n  </head>`)
  else html = html.replace(/<meta property="og:image:width"[^>]*>/, `<meta property="og:image:width" content="1200" />`)
  if(!/og:image:height/.test(html)) html = html.replace('</head>', `    <meta property="og:image:height" content="630" />\n  </head>`)
  else html = html.replace(/<meta property="og:image:height"[^>]*>/, `<meta property="og:image:height" content="630" />`)
  upsertName('twitter:card', 'summary_large_image')
  upsertName('twitter:title', `${rawTitle} | UpTools`)
  upsertName('twitter:description', rawDesc)
  // twitter:image
  const twImgTag = `<meta name="twitter:image" content="${SITE}${ogImage}" />`
  if(/twitter:image/.test(html)) html = html.replace(/<meta name="twitter:image"[^>]*\/?>/, twImgTag)
  else html = html.replace('</head>', `    ${twImgTag}\n  </head>`)

  // Inject static JSON-LD
  const pairs = extractFaq(content)
  if(pairs.length>0 && !hasFaqPageSchema(content)){
    html = html.replace('</head>', '    '+faqJsonLd(pairs)+'\n  </head>')
  } else if(pairs.length>0){
    // still inject static FAQ for crawler even if Helmet has it — dedupe by skipping, but we now prefer static
    // our earlier check skips dupes; Helmet will still render client-side. Keep skip to avoid double FAQPage.
  }
  html = html.replace('</head>', '    '+breadcrumbJsonLd(slug, rawTitle)+'\n  </head>')
  // Static SoftwareApplication — ensures dist/*.html is crawlable without JS (Helmet alone is not indexed)
  // Always inject static one; client Helmet will hydrate same data without conflict (Google merges).
  const cat = extractCategory(content)
  html = html.replace('</head>', '    '+softwareJsonLd(rawTitle, rawDesc, slug, cat)+'\n  </head>')

  // Per-page crawlable body: replace generic noscript with page-specific one
  const steps = extractHowItWorks(content)
  let noscript = `    <noscript>\n      <h1>${esc(rawTitle)}</h1>\n      <p>${esc(rawDesc)}</p>`
  if(steps.length){
    noscript += `\n      <h2>How it works</h2>\n      <ol>`
    for(const s of steps) noscript += `\n        <li>${esc(s)}</li>`
    noscript += `\n      </ol>`
  }
  if(pairs.length){
    noscript += `\n      <h2>FAQ</h2>\n      <dl>`
    for(const p of pairs) noscript += `\n        <dt>${esc(p.q)}</dt><dd>${esc(p.a)}</dd>`
    noscript += `\n      </dl>`
  }
  noscript += `\n      <p><a href="/">All tools</a> · <a href="/sitemap.xml">Sitemap</a> · <a href="/games/">Games</a></p>\n    </noscript>`
  if(/<noscript>[\s\S]*?<\/noscript>/.test(html)){
    html = html.replace(/<noscript>[\s\S]*?<\/noscript>/, noscript)
  } else {
    html = html.replace('</body>', noscript+'\n  </body>')
  }

  const outDir = join(dist, slug)
  mkdirSync(outDir, { recursive:true })
  writeFileSync(join(outDir,'index.html'), html)
  count++
}

function buildHtml(slug, title, desc){
  let html = template
  html = html.replace(/<title>.*?<\/title>/, `<title>${esc(title)}</title>`)
  const descTag = `<meta name="description" content="${escAttr(desc)}" />`
  if(/<meta name="description"/.test(html)) html = html.replace(/<meta name="description"[^>]*\/>/, descTag)
  else html = html.replace(/<\/title>/, `</title>\n    ${descTag}`)
  html = html.replace(/<link rel="canonical"[^>]*\/>/, `<link rel="canonical" href="${SITE}/${slug}/" />`)
  function upsert(property, value){
    const tag=`<meta property="${property}" content="${escAttr(value)}" />`
    const re=new RegExp(`<meta property="${property}"[^>]*\\/?>`)
    if(re.test(html)) html=html.replace(re,tag); else html=html.replace('</head>',`    ${tag}\n  </head>`)
  }
  upsert('og:title', title); upsert('og:description', desc); upsert('og:url', SITE+'/'+slug+'/'); upsert('og:type','website'); upsert('og:site_name','UpTools')
  upsert('og:image', SITE+'/assets/og/default.png')
  if(!/og:image:width/.test(html)) html=html.replace('</head>',`    <meta property="og:image:width" content="1200" />\n  </head>`)
  if(!/og:image:height/.test(html)) html=html.replace('</head>',`    <meta property="og:image:height" content="630" />\n  </head>`)
  const tw=`<meta name="twitter:card" content="summary_large_image" />`; if(!/twitter:card/.test(html)) html=html.replace('</head>',`    ${tw}\n  </head>`)
  const twImg=`<meta name="twitter:image" content="${SITE}/assets/og/default.png" />`; if(/twitter:image/.test(html)) html=html.replace(/<meta name="twitter:image"[^>]*\/?>/,twImg); else html=html.replace('</head>',`    ${twImg}\n  </head>`)
  const outDir=join(dist,slug); mkdirSync(outDir,{recursive:true}); writeFileSync(join(outDir,'index.html'),html)
}
buildHtml('hncker','HNCKER - Apps, Tools, Instagram & Videos','Follow HNCKER on Instagram, browse the free security tools, watch our tech videos, and download free Android apps.')
buildHtml('games','UpTools - Free Online Games','Play free online arcade, puzzle, card and word games on UpTools - Snake, Tetris, 2048, Pac-Man, Wordle and many more. No downloads, play in your browser.')
buildHtml('aimakerich','AIMakeRich - Finance, Investing & Trading Guides','AIMakeRich: practical money guides that match our Instagram reels. Learn investing, trading strategies and finance with real code, step-by-step processes, FAQs and how-tos.')
buildHtml('about','About UpTools - Privacy-First Free Web Tools','UpTools is a fast, privacy-first collection of 300+ free web tools and 40+ games. Calculate tax, GST, EMI and SIP; convert currency; validate PAN; format JSON; and more — no logins, instant results.')

console.log(`✅ Generated SEO HTML for ${count} tools`)
