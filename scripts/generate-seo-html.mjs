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
  const sectionName = section==='hncker'?'HNCKER':section==='hackolution'?'HACKOLUTION':section==='aiforrich'?'AIFORRICH':section==='aimakerich'?'AIMakeRich':section==='games'?'Games':section?section.charAt(0).toUpperCase()+section.slice(1):null
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
function softwareJsonLd(title, desc, slug, category, appType = 'SoftwareApplication') {
  const schema = {
    '@context':'https://schema.org',
    '@type': appType,
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
const SKIP_SLUGS = new Set(['games','contact','hncker','hackolution','hackolution/apps','aimakerich','aiforrich','privacy-policy'])

let count=0
for(const file of toolFiles){
  let slug = file.replace(/\.(jsx|tsx)$/,'').replace(/_/g,'-').replace(/^tool-/,'')
  if(slug.startsWith('hncker-')) slug='hncker/'+slug.slice('hncker-'.length)
  if(slug.startsWith('hackolution-')) slug='hackolution/'+slug.slice('hackolution-'.length)
  if(slug.startsWith('aimakerich-')) slug='aimakerich/'+slug.slice('aimakerich-'.length)
  if(slug.startsWith('aiforrich-')) slug='aiforrich/'+slug.slice('aiforrich-'.length)
  if(slug.startsWith('games-')) slug='games/'+slug.slice('games-'.length)
  if(SKIP_SLUGS.has(slug)) continue

  const content = readFileSync(join(toolsDir,file),'utf-8')
  // Prefer the page title on the layout wrapper (ToolLayout/GameShell title="...").
  // A naive first-match would grab canvas/game-state strings like `Level ${nl}`
  // or share-sheet titles ('Friendship Test Result') appearing earlier in file.
  const shellTitle = content.match(/<(?:ToolLayout|GameShell)[\s\S]*?\btitle\s*=\s*"([^"]+)"/)
  const titleMatch = shellTitle || content.match(/\btitle\s*=\s*['"`]([^'"`]+)['"`]/)
  let descMatch = content.match(/<(?:ToolLayout|GameShell)[\s\S]*?\bdesc\s*=\s*"([^"]+)"/)
  if (!descMatch) descMatch = content.match(/\bdesc\s*=\s*['"`]([^'"`]+)['"`]/)
  // Dynamic desc={`...${X}...`} — resolve known interpolations instead of
  // falling back to "Free online tool by UpTools" (weak meta, found Sep 2026)
  let rawDescDyn = null
  if (!descMatch) {
    const dynM = content.match(/<(?:ToolLayout|GameShell)[\s\S]*?\bdesc\s*=\s*\{`([\s\S]*?)`\}/)
    if (dynM) {
      rawDescDyn = dynM[1]
        .replace(/\$\{GAMES\.length\}/g, '40+')
        .replace(/\$\{PROMPTS\.length\}/g, '100+')
        .replace(/\$\{STOCKS\.india\.length\}/g, '200+')
        .replace(/\$\{STOCKS\.us\.length\}/g, '300+')
        .replace(/\$\{[^}]*\}/g, '')
        .replace(/\s+/g, ' ').trim()
    }
  }
  const rawTitle = titleMatch?titleMatch[1]:slug.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase())
  // Helmet-only pages (no ToolLayout title/desc): use their <title> + meta description
  let helmetTitle = null, helmetDesc = null
  if (!titleMatch || (!descMatch && !rawDescDyn)) {
    const ht = content.match(/<title>([^<]{10,120})<\/title>/)
    if (ht) helmetTitle = ht[1].replace(/\s*\|\s*UpTools\s*$/,'').trim()
    const hd = content.match(/<meta name="description"\s*\n?\s*content="([^"]{60,300})"/)
    if (hd) helmetDesc = hd[1].trim()
  }
  const finalTitle = (!titleMatch && helmetTitle) ? helmetTitle : rawTitle
  const rawDesc = descMatch?descMatch[1]:(rawDescDyn && rawDescDyn.length>60 ? rawDescDyn : (helmetDesc || `${finalTitle}. Free online tool by UpTools.`))
  const title = finalTitle.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
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
  // Static app schema — WebApplication when the tool declares it (interactive
  // browser tools), else SoftwareApplication. Ensures dist/*.html is crawlable
  // without JS (Helmet alone is not indexed). Always inject static one; client
  // Helmet will hydrate same data without conflict (Google merges).
  const cat = extractCategory(content)
  const appType = /["']@type["']\s*:\s*["']WebApplication["']/.test(content) ? 'WebApplication' : 'SoftwareApplication'
  html = html.replace('</head>', '    '+softwareJsonLd(rawTitle, rawDesc, slug, cat, appType)+'\n  </head>')

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

// Hub SEO helpers: static ItemList JSON-LD + noscript links so section hubs
// expose their children to crawlers without JS (same gap as /blogs/ Sep 2026).
function hubLinksFor(section) {
  try {
    const tools = JSON.parse(readFileSync(join(__dirname, '..', 'src/data/tools.json'), 'utf8')).tools
    return tools
      .filter(t => (t.slug || '').startsWith(section + '/') || (t.slug || '').startsWith(section + '-'))
      .map(t => {
        const p = t.slug.startsWith(section + '-')
          ? section + '/' + t.slug.slice(section.length + 1)
          : t.slug
        return [`/${p}/`, t.title]
      })
  } catch { return [] }
}
function hubItemList(section, name) {
  const links = hubLinksFor(section)
  return { '@context': 'https://schema.org', '@type': 'ItemList', name, itemListElement: links.map(([href, title], i) => ({ '@type': 'ListItem', position: i + 1, name: title, url: SITE + href })) }
}
function sectionHubSeo(section, name) {
  const links = hubLinksFor(section)
  return { itemList: hubItemList(section, name), noscriptLinks: links.slice(0, 60), noscriptTitle: name }
}
function hnckerHubSeo() { return sectionHubSeo('hncker', 'HNCKER Security Tools') }
function hackolutionAppsSeo() {
  const apps = [
    ['/downloads/android/mouse-jiggler-1.0.apk', 'Mouse Jiggler 1.0 (5.6 MB) - Keeps screen awake, ad-free'],
    ['/downloads/android/scanpdf-1.0.apk', 'Scan&PDF 1.0 (22 MB) - Document scanner to PDF, ad-free'],
    ['/downloads/android/netshield-1.3.apk', 'NetShield Ad Blocker 1.3 (15 MB) - On-device ad blocking'],
    ['/downloads/android/recoverypro-1.0.apk', 'RecoveryPRO 1.0 (3.6 MB) - Phone storage cleaner'],
    ['/downloads/android/wifi-analyzer-2.1.apk', 'WiFi Analyzer 2.1 (3.5 MB) - WiFi scanner'],
    ['/downloads/android/tank-battle-1.2.apk', 'Tank Battle 1.2 (11 MB) - Battle game'],
  ]
  return {
    itemList: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Hackolution Android Apps',
      itemListElement: apps.map(([href, title], i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: title,
        url: SITE + href
      }))
    },
    noscriptLinks: apps,
    noscriptTitle: 'Hackolution Android Apps Downloads'
  }
}
function gamesHubSeo() {
  let links = []
  try {
    const src = readFileSync(join(__dirname, '..', 'src/pages/GamesPage.jsx'), 'utf8')
    const m = src.match(/const GAMES = \[([\s\S]*?)\n\]/)
    if (m) {
      const re = /\{\s*slug:\s*'([^']+)'\s*,\s*title:\s*'([^']+)'/g
      let g
      while ((g = re.exec(m[1])) !== null) links.push([`/games/${g[1]}/`, g[2]])
    }
  } catch { links = [] }
  // Fallback to tools.json games entries if page parse fails
  if (!links.length) {
    try {
      const tools = JSON.parse(readFileSync(join(__dirname, '..', 'src/data/tools.json'), 'utf8')).tools
      links = tools
        .filter(t => (t.slug || '').startsWith('games/') || (t.slug || '').startsWith('games-'))
        .map(t => {
          const p = t.slug.startsWith('games-') ? 'games/' + t.slug.slice(6) : t.slug
          return [`/${p}/`, t.title]
        })
    } catch { links = [] }
  }
  return { itemList: { '@context': 'https://schema.org', '@type': 'ItemList', name: 'UpTools Free Online Games', itemListElement: links.map(([href, title], i) => ({ '@type': 'ListItem', position: i + 1, name: title, url: SITE + href })) }, noscriptLinks: links.slice(0, 60), noscriptTitle: 'UpTools Free Online Games' }
}

function buildHtml(slug, title, desc, opts = {}) {
  let html = template
  html = html.replace(/<title>.*?<\/title>/, `<title>${esc(title)}</title>`)
  const descTag = `<meta name="description" content="${escAttr(desc)}" />`
  if (/<meta name="description"/.test(html)) html = html.replace(/<meta name="description"[^>]*\/>/, descTag)
  else html = html.replace(/<\/title>/, `</title>\n    ${descTag}`)
  html = html.replace(/<link rel="canonical"[^>]*\/>/, `<link rel="canonical" href="${SITE}/${slug}/" />`)
  function upsert(property, value) {
    const tag = `<meta property="${property}" content="${escAttr(value)}" />`
    const re = new RegExp(`<meta property="${property}"[^>]*\\/?>`)
    if (re.test(html)) html = html.replace(re, tag); else html = html.replace('</head>', `    ${tag}\n  </head>`)
  }
  upsert('og:title', title); upsert('og:description', desc); upsert('og:url', SITE + '/' + slug + '/'); upsert('og:type', 'website'); upsert('og:site_name', 'UpTools')
  upsert('og:image', opts.ogImage ? SITE + opts.ogImage : SITE + '/assets/og/default.png')
  if (!/og:image:width/.test(html)) html = html.replace('</head>', `    <meta property="og:image:width" content="1200" />\n  </head>`)
  if (!/og:image:height/.test(html)) html = html.replace('</head>', `    <meta property="og:image:height" content="630" />\n  </head>`)
  const tw = `<meta name="twitter:card" content="summary_large_image" />`; if (!/twitter:card/.test(html)) html = html.replace('</head>', `    ${tw}\n  </head>`)
  const twImg = `<meta name="twitter:image" content="${opts.ogImage ? SITE + opts.ogImage : SITE + '/assets/og/default.png'}" />`; if (/twitter:image/.test(html)) html = html.replace(/<meta name="twitter:image"[^>]*\/?>/, twImg); else html = html.replace('</head>', `    ${twImg}\n  </head>`)
  // WebSite JSON-LD on hubs + WebPage JSON-LD everywhere (crawlable entity without JS)
  const webPageLd = { '@context': 'https://schema.org', '@type': 'WebPage', name: title, description: desc, url: `${SITE}/${slug}/`, isPartOf: { '@type': 'WebSite', name: 'UpTools', url: SITE + '/' } }
  html = html.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(webPageLd)}</script>\n  </head>`)
  if (opts.itemList) {
    html = html.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(opts.itemList)}</script>\n  </head>`)
  }
  if (opts.noscriptLinks && opts.noscriptLinks.length) {
    const escH = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    let ns = `    <noscript>\n      <h1>${escH(opts.noscriptTitle || title)}</h1>\n      <p>${escH(desc)}</p>\n      <ul>`
    for (const [href, label] of opts.noscriptLinks) ns += `\n        <li><a href="${href}">${escH(label)}</a></li>`
    ns += `\n      </ul>\n      <p><a href="/">All tools</a> · <a href="/sitemap.xml">Sitemap</a></p>\n    </noscript>`
    if (/<noscript>[\s\S]*?<\/noscript>/.test(html)) html = html.replace(/<noscript>[\s\S]*?<\/noscript>/, ns)
    else html = html.replace('</body>', ns + '\n  </body>')
  }
  const outDir = join(dist, slug); mkdirSync(outDir, { recursive: true }); writeFileSync(join(outDir, 'index.html'), html)
}
buildHtml('hncker','HNCKER - Apps, Tools, Instagram & Videos','Follow HNCKER on Instagram, browse the free security tools, watch our tech videos, and download free Android apps.', hnckerHubSeo())
buildHtml('hackolution','HACKOLUTION - Tools, Instagram & YouTube Videos','Follow HACKOLUTION on Instagram, browse the free security tools, and watch full tutorials on YouTube.', sectionHubSeo('hackolution', 'HACKOLUTION Security Tools'))
buildHtml('hackolution/apps','Hackolution Apps','Download free Android APK apps by HACKOLUTION. Fast, ad-free APK downloads for Mouse Jiggler, Scan&PDF, NetShield Ad Blocker, RecoveryPRO, WiFi Analyzer, and Tank Battle.', hackolutionAppsSeo())
buildHtml('games','UpTools - Free Online Games','Play free online arcade, puzzle, card and word games on UpTools - Snake, Tetris, 2048, Pac-Man, Wordle and many more. No downloads, play in your browser.', gamesHubSeo())
buildHtml('aimakerich','AIMakeRich - Finance, Investing & Trading Guides','AIMakeRich: practical money guides that match our Instagram reels. Learn investing, trading strategies and finance with real code, step-by-step processes, FAQs and how-tos.', sectionHubSeo('aimakerich', 'AIMakeRich Finance Guides'))
buildHtml('aiforrich','AIFORRICH - Algo Trading, Pine Script & Crypto Trading Guides','AIFORRICH: Algo trading for international markets and crypto — reels + code guides. Practical quantitative trading strategies, Pine Script indicators, and automated execution bots with copy-paste code.', sectionHubSeo('aiforrich', 'AIFORRICH Trading Guides'))
buildHtml('about','About UpTools - Privacy-First Free Web Tools','UpTools is a fast, privacy-first collection of 300+ free web tools and 40+ games. Calculate tax, GST, EMI and SIP; convert currency; validate PAN; format JSON; and more — no logins, instant results.')
buildHtml('learning','Learning — DSA & AI Guides with Animations','Learn DSA and AI on UpTools — algorithms explained with step-by-step animations, practice questions and interview prep tips. Start with Quickselect.', { itemList: { '@context': 'https://schema.org', '@type': 'ItemList', name: 'UpTools Learning Tracks', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'DSA', url: SITE + '/learning/dsa/' }, { '@type': 'ListItem', position: 2, name: 'AI', url: SITE + '/learning/ai/' }] }, noscriptLinks: [['/learning/dsa/', 'DSA — Algorithms Explained with Animation'], ['/learning/ai/', 'AI — Plain-English Guides'], ['/learning/ai/how-ai-works/', 'How AI Actually Works in Plain English with Animation'], ['/learning/dsa/quickselect/', 'Quickselect Algorithm Explained with Animation']], noscriptTitle: 'UpTools Learning Tracks' })
buildHtml('learning/dsa','DSA Algorithms Explained with Animation','Master DSA with live animations — Quickselect and more. Each algorithm: visual walkthrough, code in Python & JavaScript, practice questions and interview tips.', { itemList: { '@context': 'https://schema.org', '@type': 'ItemList', name: 'DSA Algorithms Explained with Animation', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Quickselect Algorithm', url: SITE + '/learning/dsa/quickselect/' }] }, noscriptLinks: [['/learning/dsa/quickselect/', 'Quickselect Algorithm Explained with Animation (Kth Smallest in O(n))']], noscriptTitle: 'DSA Algorithms Explained with Animation' })
buildHtml('learning/ai','AI Guides in Plain English with Animation | UpTools','Learn how AI really works — plain-English guides with live animations. Lessons 1–16 are live: How AI Actually Works (next-word predictor), Prompting That Gets Results (live prompt improver), Context & Memory (sliding context window demo with memory toggle), Hallucinations & Verifying (confident-vs-true meter), Embeddings & Search (2D semantic dot map with cosine similarity), Chat With Your Documents (RAG simulator with grounded citations), AI Agents That Do Tasks (autonomous task planning, ReAct loop & human approval gate), Image Generation Basics (diffusion model denoising stages & CFG scale), Voice & Video AI (neural TTS, mel-spectrograms, vocoders & talking avatar visemes), AI for Resumes & Interviews (Google X-Y-Z bullet transformer & STAR interview simulator), AI for Small Business (shop day operations workflow, WhatsApp concierge bot & automated bookkeeping), AI Costs & Tokens (live token counter, cost in Rupees across 3 model tiers & monthly budget planner), Privacy & Safety with AI (live data flow animator, PII sanitizer, sharing risk meter & security checklist), Building with APIs (live API call builder, Bearer auth headers, SSE token streaming, HTTP status codes 200/401/429/500 & exponential backoff), Fine-tuning vs Prompting (interactive decision flowchart animator, cost vs accuracy tradeoff simulator, LoRA PEFT concepts & break-even volume calculator), and Checking AI Quality (interactive quality scorecard, animated accuracy/tone/format/safety gauges & regression test runner).', { itemList: { '@context': 'https://schema.org', '@type': 'ItemList', name: 'AI Guides in Plain English with Animation', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'How AI Actually Works', url: SITE + '/learning/ai/how-ai-works/' }, { '@type': 'ListItem', position: 2, name: 'Prompting That Gets Results', url: SITE + '/learning/ai/prompting-that-gets-results/' }, { '@type': 'ListItem', position: 3, name: 'Context & Memory', url: SITE + '/learning/ai/context-and-memory/' }, { '@type': 'ListItem', position: 4, name: 'Hallucinations & Verifying', url: SITE + '/learning/ai/hallucinations-and-verifying/' }, { '@type': 'ListItem', position: 5, name: 'Embeddings and Search', url: SITE + '/learning/ai/embeddings-and-search/' }, { '@type': 'ListItem', position: 6, name: 'Chat With Your Documents (RAG)', url: SITE + '/learning/ai/rag-chat-with-documents/' }, { '@type': 'ListItem', position: 7, name: 'AI Agents That Do Tasks', url: SITE + '/learning/ai/ai-agents-that-do-tasks/' }, { '@type': 'ListItem', position: 8, name: 'Image Generation Basics', url: SITE + '/learning/ai/image-generation-basics/' }, { '@type': 'ListItem', position: 9, name: 'Voice and Video AI', url: SITE + '/learning/ai/voice-and-video-ai/' }, { '@type': 'ListItem', position: 10, name: 'AI for Resumes and Interviews', url: SITE + '/learning/ai/ai-for-resumes-interviews/' }, { '@type': 'ListItem', position: 11, name: 'AI for Small Business', url: SITE + '/learning/ai/ai-for-small-business/' }, { '@type': 'ListItem', position: 12, name: 'AI Costs and Tokens', url: SITE + '/learning/ai/ai-costs-and-tokens/' }, { '@type': 'ListItem', position: 13, name: 'Privacy and Safety with AI', url: SITE + '/learning/ai/privacy-and-safety/' }, { '@type': 'ListItem', position: 14, name: 'Building with APIs', url: SITE + '/learning/ai/building-with-apis/' }, { '@type': 'ListItem', position: 15, name: 'Fine-tuning vs Prompting', url: SITE + '/learning/ai/finetuning-vs-prompting/' }, { '@type': 'ListItem', position: 16, name: 'Checking AI Quality', url: SITE + '/learning/ai/checking-ai-quality/' }] }, noscriptLinks: [['/learning/ai/how-ai-works/', 'How AI Actually Works in Plain English with Animation'], ['/learning/ai/prompting-that-gets-results/', 'Prompting That Gets Results — The 4-Part Formula'], ['/learning/ai/context-and-memory/', 'Context & Memory — Why AI Forgets and How to Make It Remember'], ['/learning/ai/hallucinations-and-verifying/', 'Hallucinations & Verifying — Catch AI Made-Up Facts'], ['/learning/ai/embeddings-and-search/', 'Embeddings and Search — 2D Semantic Dot Map & Vector Search'], ['/learning/ai/rag-chat-with-documents/', 'Chat With Your Documents (RAG) — Live Grounding & Citation Simulator'], ['/learning/ai/ai-agents-that-do-tasks/', 'AI Agents That Do Tasks — Autonomous Planning, ReAct Loop & Tools'], ['/learning/ai/image-generation-basics/', 'Image Generation Basics — Diffusion Denoising Stages & CFG Scale'], ['/learning/ai/voice-and-video-ai/', 'Voice & Video AI — Neural TTS, Vocoders & Talking Avatars'], ['/learning/ai/ai-for-resumes-interviews/', 'AI for Resumes & Interviews — ATS Optimization, Bullet Power & Mock Prep'], ['/learning/ai/ai-for-small-business/', 'AI for Small Business — Automate Daily Ops, WhatsApp & Marketing'], ['/learning/ai/ai-costs-and-tokens/', 'AI Costs and Tokens — Live Token Counter, Pricing in Rupees & Budget Planner'], ['/learning/ai/privacy-and-safety/', 'Privacy & Safety with AI — Live Data Flow Animator, PII Sanitizer & Security Checklist'], ['/learning/ai/building-with-apis/', 'Building with APIs — Live REST API Builder, Bearer Auth & Error Simulator'], ['/learning/ai/finetuning-vs-prompting/', 'Fine-tuning vs Prompting — Interactive Decision Flowchart & Cost/Accuracy Tradeoff Simulator'], ['/learning/ai/checking-ai-quality/', 'Checking AI Quality — Interactive Scorecard, Gauges & Regression Evals']], noscriptTitle: 'AI Guides in Plain English with Animation' })
buildHtml('learning/ai/checking-ai-quality','Checking AI Quality: Evaluation, Benchmarks & Automated Testing | UpTools','Learn how to test, benchmark, and monitor AI outputs in production — interactive quality scorecard with animated accuracy, tone, format, and safety gauges, plus a real-time 5-case regression test runner. Includes LLM-as-a-Judge concepts, production Python & JavaScript eval code, 5 practice questions, and 4 FAQs.')
buildHtml('learning/ai/finetuning-vs-prompting','Fine-Tuning vs Prompting: When to Train, Prompt, or Use RAG | UpTools','Learn when to use Prompt Engineering, RAG (Retrieval-Augmented Generation), or Fine-Tuning — interactive decision flowchart animator, dynamic cost vs accuracy tradeoff simulator across 5 real-world sample tasks (customer support, medical diagnosis, SQL code generation, legal drafting, brand voice), LoRA/PEFT concepts, production Python & JavaScript code, 5 practice questions, and 4 FAQs.')
buildHtml('learning/ai/building-with-apis','Building with APIs: REST Endpoints, Payloads & Error Handling | UpTools','Learn how software connects to AI models using REST APIs — interactive API call builder with endpoint picker, Bearer authentication headers, JSON request payloads, live response streaming, and HTTP status code & error simulators (200, 401, 429, 500). Includes production Python & JavaScript code, 5 practice questions, and 4 FAQs.')
buildHtml('learning/ai/privacy-and-safety','Privacy and Safety with AI: Data Flow, PII Protection & Enterprise Security | UpTools','Master AI privacy, data safety, and prompt security with an interactive data flow animator and live PII risk meter. Discover what leaves your device when prompting AI, how model training retention works, how to sanitize passwords, OTPs, customer records, and API keys, plus Python & JavaScript anonymization code, 5 practice questions, and 4 FAQs.')
buildHtml('learning/ai/ai-costs-and-tokens','AI Costs and Tokens: How AI Pricing Works & Monthly Budget Planner | UpTools','Master AI token economics and API pricing with a live token counter & cost calculator in Indian Rupees (₹) across 3 model tiers, plus an interactive monthly budget planner slider. Explore input vs output pricing, prompt caching, tiered model routing, Python & JavaScript cost estimators, 5 practice questions, and 4 FAQs.')
buildHtml('learning/ai/ai-for-small-business','AI for Small Business: Automate Daily Ops, WhatsApp & Marketing | UpTools','Master AI automation for small businesses with an interactive shop day simulator — automate morning price lists & inventory, noon WhatsApp customer replies, and evening accounts & bookkeeping. Explore real-time time-saved meters, cost comparison toggles, Python & JavaScript automation code, 5 practice questions, 4 FAQs and actionable business tips.')
buildHtml('learning/ai/ai-for-resumes-interviews','AI for Resumes & Interviews: ATS Optimization, Bullet Power & Mock Prep | UpTools','Master AI for resumes and interviews with an interactive resume bullet transformer & STAR interview simulator — watch weak bullets transform with metrics and action verbs, boost ATS match scores, practice behavioral mock questions, and explore Python & JavaScript prompt automation. Includes 5 practice questions, 4 FAQs and interview tips.')
buildHtml('learning/ai/ai-agents-that-do-tasks','AI Agents That Do Tasks: How Autonomous AI Plans, Uses Tools & Takes Action | UpTools','Learn how AI Agents work with an interactive step-by-step simulator — see an agent reason (ReAct loop), plan multi-step workflows, call search/database/email tools, and enforce human approval gates. Includes Python & JavaScript code, 5 practice questions, 4 FAQs and interview tips.')
buildHtml('learning/ai/image-generation-basics','Image Generation Basics: How Diffusion Models Turn Text into Art & Photos | UpTools','Learn how AI image generation works with an interactive diffusion simulator — explore prompt strength (CFG scale), step-by-step progressive denoising stages, text conditioning with CLIP, and latent space decoding. Includes Python & JavaScript code, 5 practice questions, 4 FAQs and interview tips.')
buildHtml('learning/ai/voice-and-video-ai','Voice & Video AI: Text-to-Speech (TTS), Voice Cloning & Talking Avatars | UpTools','Learn how AI voice synthesis and video generation work with an interactive TTS & talking-avatar simulator — explore text-to-phoneme conversion, mel-spectrogram acoustic modeling, vocoder synthesis (HiFi-GAN), pitch/speed modulation, and viseme lip-syncing. Includes Python & JavaScript code, 5 practice questions, 4 FAQs and interview tips.')
buildHtml('learning/ai/context-and-memory','Context & Memory: Why AI Forgets and How to Make It Remember | UpTools','Learn why AI forgets mid-conversation with a live sliding-context-window demo — tokens fill up, the oldest messages drop, and a memory toggle keeps key facts alive. Includes Python & JavaScript chat-memory code, 5 practice questions, 4 FAQs and interview tips.', { ogImage: '/assets/learning/ai/ai-lesson3-hero.jpg' })
buildHtml('learning/ai/embeddings-and-search','Embeddings and Search: How AI Understands Meaning with Vectors | UpTools','Learn how AI turns text into meaning with a live 2D semantic dot map — type or click any word (chai, coffee, king, queen, car, computer) to see nearest neighbours by cosine similarity distance. Includes vector search code in Python & JavaScript, 5 practice questions, 4 FAQs and interview tips.')
buildHtml('learning/ai/hallucinations-and-verifying','AI Hallucinations & How to Verify AI Answers | UpTools','Learn why AI invents confident-sounding facts with a live confident-vs-true meter — drag a slider from raw guess to source-verified answer and watch AI confidence stay pinned at 95% while the truth meter gets checked claim by claim. Includes Python & JavaScript claim-verification code, 5 practice questions, 4 FAQs and interview tips.', { ogImage: '/assets/learning/ai/ai-lesson4-hero.jpg' })
buildHtml('learning/ai/how-ai-works','How AI Actually Works in Plain English with Animation | UpTools','See how AI really works with a live next-word predictor — animated probability bars, a plain-English 5-step explanation, Python & JavaScript code, 5 practice questions, 4 FAQs and interview tips.', { ogImage: '/assets/learning/ai/ai-lesson1-hero.jpg' })
buildHtml('learning/ai/prompting-that-gets-results','Prompting That Gets Results: Write AI Prompts That Work | UpTools','Learn prompting that gets results with a live prompt improver — toggle context, examples and check rules and watch output quality bars climb. Includes a 5-step method, Python & JavaScript prompt-builder code, 5 practice questions, 4 FAQs and interview tips.', { ogImage: '/assets/learning/ai/ai-lesson2-hero.jpg' })
buildHtml('learning/ai/rag-chat-with-documents','Chat With Your Documents (RAG): How AI Answers from Your Files | UpTools','Learn Retrieval-Augmented Generation (RAG) with a live interactive simulator — ask questions across 3 sample documents, see retrieved chunks highlighted with source citations, and toggle RAG on/off to compare grounded vs hallucinated answers. Includes Python & JavaScript code, 5 practice questions, 4 FAQs and interview tips.')
buildHtml('learning/dsa/quickselect','Quickselect Algorithm Explained with Animation (Kth Smallest in O(n))','Learn Quickselect step by step with a live animation — find the kth smallest element without full sorting. Includes Python & JavaScript code, 5 practice questions and interview tips.')
// Snake is a custom page (no ToolLayout/GameShell title prop) — pin its SEO title
// so it never falls back to the slug-derived 'Games/Snake'.
buildHtml('games/snake','Play Snake Game Online Free - Classic Neon Arcade','Play Snake game online free - eat food, grow your snake, and chase the high score. Arrow keys and WASD on desktop, swipe on mobile. No download, free in your browser.')

// ---- Blogs: prerender /blogs and /blogs/<slug> ----
let blogCount = 0
try {
  const rawBlogs = JSON.parse(readFileSync(join(__dirname, '..', 'src/data/blogs.json'), 'utf8'))
  const blogs = Array.isArray(rawBlogs) ? rawBlogs : (rawBlogs.blogs || [])
  for (const b of blogs) {
    const slug = `blogs/${b.slug}`
    const rawTitle = b.title
    const rawDesc = b.desc
    const blogOg = b.coverImage || '/assets/og/default.png'
    const ogImage = blogOg.startsWith('/') ? blogOg : '/' + blogOg
    let html = template
    html = html.replace(/<title>.*?<\/title>/, `<title>${esc(rawTitle)} | UpTools</title>`)
    const descTag = `<meta name="description" content="${escAttr(rawDesc)}" />`
    if (/<meta name="description"/.test(html)) html = html.replace(/<meta name="description"[^>]*\/>/, descTag)
    else html = html.replace(/<\/title>/, `</title>\n    ${descTag}`)
    html = html.replace(/<link rel="canonical"[^>]*\/>/, `<link rel="canonical" href="${SITE}/${slug}/" />`)
    const upsertBlog = (property, value) => {
      const tag = `<meta property="${property}" content="${escAttr(value)}" />`
      const re = new RegExp(`<meta property="${property}"[^>]*\\/?>`)
      if (re.test(html)) html = html.replace(re, tag)
      else html = html.replace('</head>', `    ${tag}\n  </head>`)
    }
    const upsertNameBlog = (name, value) => {
      const tag = `<meta name="${name}" content="${escAttr(value)}" />`
      const re = new RegExp(`<meta name="${name}"[^>]*\\/?>`)
      if (re.test(html)) html = html.replace(re, tag)
      else html = html.replace('</head>', `    ${tag}\n  </head>`)
    }
    upsertBlog('og:title', `${rawTitle} | UpTools`)
    upsertBlog('og:description', rawDesc)
    upsertBlog('og:url', `${SITE}/${slug}/`)
    upsertBlog('og:type', 'article')
    upsertBlog('og:site_name', 'UpTools')
    upsertBlog('og:image', `${SITE}${ogImage}`)
    if (!/og:image:width/.test(html)) html = html.replace('</head>', `    <meta property="og:image:width" content="1200" />\n  </head>`)
    if (!/og:image:height/.test(html)) html = html.replace('</head>', `    <meta property="og:image:height" content="630" />\n  </head>`)
    upsertNameBlog('twitter:card', 'summary_large_image')
    upsertNameBlog('twitter:title', `${rawTitle} | UpTools`)
    upsertNameBlog('twitter:description', rawDesc)
    const twBlog = `<meta name="twitter:image" content="${SITE}${ogImage}" />`
    if (/twitter:image/.test(html)) html = html.replace(/<meta name="twitter:image"[^>]*\/?>/, twBlog)
    else html = html.replace('</head>', `    ${twBlog}\n  </head>`)
    const articleLd = { '@context':'https://schema.org','@type':'BlogPosting', headline: rawTitle, description: rawDesc, image: `${SITE}${ogImage}`, datePublished: b.date, dateModified: b.date, author: { '@type':'Organization', name: 'UpTools', url: SITE+'/' }, publisher: { '@type':'Organization', name:'UpTools', logo:{'@type':'ImageObject', url: SITE+'/assets/logo/uptools-logo.svg'}}, mainEntityOfPage:{'@type':'WebPage','@id': `${SITE}/${slug}/`}, keywords: (b.keywords||b.tags||[]).join(', '), articleSection: b.category }
    html = html.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(articleLd)}</script>\n  </head>`)
    const bcLd = { '@context':'https://schema.org','@type':'BreadcrumbList', itemListElement: [ { '@type':'ListItem', position:1, name:'Home', item: SITE+'/' }, { '@type':'ListItem', position:2, name:'Blogs', item: SITE+'/blogs/' }, { '@type':'ListItem', position:3, name: rawTitle, item: SITE+'/'+slug+'/' } ] }
    html = html.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(bcLd)}</script>\n  </head>`)
    if (b.faq && b.faq.length) {
      const faqLd = { '@context':'https://schema.org','@type':'FAQPage', mainEntity: b.faq.map(f=>({ '@type':'Question', name:f.q, acceptedAnswer:{'@type':'Answer', text:f.a}})) }
      html = html.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(faqLd)}</script>\n  </head>`)
    }
    const stripHtml = (s) => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g,' ').trim()
    let noscript = `    <noscript>\n      <h1>${esc(rawTitle)}</h1>\n      <p>${esc(rawDesc)}</p>`
    if (b.content) noscript += `\n      <p>${esc(stripHtml(b.content).slice(0, 2000))}</p>`
    if (b.faq && b.faq.length) {
      noscript += `\n      <h2>FAQ</h2>\n      <dl>`
      for (const f of b.faq) noscript += `\n        <dt>${esc(f.q)}</dt><dd>${esc(f.a)}</dd>`
      noscript += `\n      </dl>`
    }
    noscript += `\n      <p><a href="/blogs/">All blogs</a> · <a href="/">All tools</a> · <a href="/sitemap.xml">Sitemap</a></p>\n    </noscript>`
    if (/<noscript>[\s\S]*?<\/noscript>/.test(html)) html = html.replace(/<noscript>[\s\S]*?<\/noscript>/, noscript)
    else html = html.replace('</body>', noscript+'\n  </body>')
    const outDir = join(dist, slug)
    mkdirSync(outDir, { recursive:true })
    writeFileSync(join(outDir,'index.html'), html)
    blogCount++
  }
  {
    const rawTitle = 'Blogs - Trending Tech, Cricket, Sports & AI News'
    const rawDesc = 'Explore trending stories from India, USA & UK on iPhone 17, Asia Cup 2026, US Open tennis, Premier League, and the best AI tools — curated by UpTools.'
    const slug = 'blogs'
    let html = template
    html = html.replace(/<title>.*?<\/title>/, `<title>${esc(rawTitle)} | UpTools</title>`)
    const descTag = `<meta name="description" content="${escAttr(rawDesc)}" />`
    if (/<meta name="description"/.test(html)) html = html.replace(/<meta name="description"[^>]*\/>/, descTag)
    else html = html.replace(/<\/title>/, `</title>\n    ${descTag}`)
    html = html.replace(/<link rel="canonical"[^>]*\/>/, `<link rel="canonical" href="${SITE}/${slug}/" />`)
    const upsert2 = (property, value) => {
      const tag=`<meta property="${property}" content="${escAttr(value)}" />`
      const re=new RegExp(`<meta property="${property}"[^>]*\\/?>`)
      if(re.test(html)) html=html.replace(re,tag); else html=html.replace('</head>',`    ${tag}\n  </head>`)
    }
    upsert2('og:title', `${rawTitle} | UpTools`); upsert2('og:description', rawDesc); upsert2('og:url', SITE+'/'+slug+'/'); upsert2('og:type','website'); upsert2('og:site_name','UpTools')
    upsert2('og:image', SITE+'/assets/og/default.png')
    if(!/og:image:width/.test(html)) html=html.replace('</head>',`    <meta property="og:image:width" content="1200" />\n  </head>`)
    if(!/og:image:height/.test(html)) html=html.replace('</head>',`    <meta property="og:image:height" content="630" />\n  </head>`)
    const bc = { '@context':'https://schema.org','@type':'BreadcrumbList', itemListElement: [ { '@type':'ListItem', position:1, name:'Home', item: SITE+'/' }, { '@type':'ListItem', position:2, name:'Blogs', item: SITE+'/blogs/' } ] }
    html = html.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(bc)}</script>\n  </head>`)
    const rawBlogs2 = JSON.parse(readFileSync(join(__dirname, '..', 'src/data/blogs.json'), 'utf8'))
    const blogs2 = Array.isArray(rawBlogs2) ? rawBlogs2 : (rawBlogs2.blogs || [])
    const il = { '@context':'https://schema.org','@type':'ItemList', name:'UpTools Trending Blogs', itemListElement: blogs2.map((b,i)=>({ '@type':'ListItem', position:i+1, name:b.title, url: `${SITE}/blogs/${b.slug}/` })) }
    html = html.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(il)}</script>\n  </head>`)
    // Static crawlable post links: the /blogs/ hub is client-rendered, so without
    // this Googlebot sees no <a href> to individual posts (discovery gap Sep 2026).
    const escHub = (s) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    let hubNoscript = `    <noscript>\n      <h1>UpTools Trending Blogs — Tech, Cricket, Sports & AI News</h1>\n      <p>Latest trending stories from India, USA & UK.</p>\n      <ul>`
    const sortedBlogs = [...blogs2].sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    for (const b of sortedBlogs) {
      hubNoscript += `\n        <li><a href="/blogs/${b.slug}/">${escHub(b.title)}</a></li>`
    }
    hubNoscript += `\n      </ul>\n      <p><a href="/">All tools</a> · <a href="/sitemap.xml">Sitemap</a></p>\n    </noscript>`
    if (/<noscript>[\s\S]*?<\/noscript>/.test(html)) html = html.replace(/<noscript>[\s\S]*?<\/noscript>/, hubNoscript)
    else html = html.replace('</body>', hubNoscript + '\n  </body>')
    const outDir=join(dist,slug); mkdirSync(outDir,{recursive:true}); writeFileSync(join(outDir,'index.html'),html)
    blogCount++
  }
  console.log(`✅ Generated SEO HTML for ${blogCount} blog pages (/blogs + posts)`)
} catch (e) { console.warn('⚠️  Blogs SEO generation skipped:', e.message) }

console.log(`✅ Generated SEO HTML for ${count} tools`)
