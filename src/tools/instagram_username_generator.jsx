import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const PATTERNS = {
  simple: ['{name}', '{name}{number}', '{name}_{category}', '{category}_{name}'],
  creative: ['{name}_{adjective}', '{adjective}_{name}', '{name}_{verb}', '{verb}_{name}', '{name}.{category}'],
  professional: ['{name}_{category}', '{category}.{name}', '{name}_official', 'official_{name}', '{name}_pro'],
  trendy: ['{name}_{trend}', '{trend}_{name}', '{name}.{trend}', 'the_{name}', '{name}_vibes'],
  unique: ['{name}_{unique}', '{unique}_{name}', '{name}{symbol}{category}', '{category}{symbol}{name}'],
  short: ['{name}{num}', '{initial}{category}', '{name}{letter}', '{letter}{name}'],
}

const WORDS = {
  adjectives: ['amazing','awesome','brilliant','creative','dynamic','epic','fantastic','genuine','incredible','legendary','magical','outstanding','perfect','radiant','stellar','ultimate','vibrant','wonderful'],
  verbs: ['create','inspire','explore','discover','achieve','build','design','innovate','lead','shine','thrive','grow','excel','succeed','dream','aspire'],
  trends: ['vibes','mood','aesthetic','energy','flow','wave','style','essence','spirit','aura','zen','glow','spark','magic','power'],
  unique: ['studio','lab','hub','space','zone','realm','world','universe','dimension','galaxy','empire','kingdom','domain','sanctuary'],
  symbols: ['_','','.'],
  numbers: ['1','2','3','7','9','21','24','99','101','365'],
  letters: ['x','z','v','k','j'],
}

const CATEGORIES = {
  personal: ['life','daily','journey','story','world','vibes','moments','adventures'],
  business: ['co','inc','group','solutions','services','consulting','agency','studio'],
  creative: ['art','design','creative','studio','gallery','works','creations','vision'],
  fitness: ['fit','strong','power','muscle','gym','training','health','wellness'],
  food: ['kitchen','chef','taste','flavor','recipe','cook','foodie','delicious'],
  travel: ['wanderer','explorer','nomad','journey','adventure','roam','discover','globe'],
  fashion: ['style','chic','trendy','fashion','boutique','closet','wardrobe','couture'],
  tech: ['tech','digital','code','dev','innovation','future','smart','cyber'],
  music: ['beats','rhythm','melody','sound','music','audio','tune','harmony'],
  photography: ['lens','focus','capture','shot','frame','pixel','image','visual'],
}

const pick = arr => arr[Math.floor(Math.random() * arr.length)]

function createUsernames(name, category, style, count, opts) {
  const patterns = PATTERNS[style] || PATTERNS.simple
  const cats = CATEGORIES[category] || CATEGORIES.personal
  const usernames = new Set()
  let attempts = 0

  while (usernames.size < count && attempts < count * 10) {
    attempts++
    let u = pick(patterns)
    u = u.replace('{name}', name)
      .replace('{category}', pick(cats))
      .replace('{adjective}', pick(WORDS.adjectives))
      .replace('{verb}', pick(WORDS.verbs))
      .replace('{trend}', pick(WORDS.trends))
      .replace('{unique}', pick(WORDS.unique))
      .replace('{symbol}', pick(WORDS.symbols))
      .replace('{number}', pick(WORDS.numbers))
      .replace('{num}', String(Math.floor(Math.random() * 99) + 1))
      .replace('{letter}', pick(WORDS.letters))
      .replace('{initial}', name.charAt(0))

    if (opts.numbers && !/\d/.test(u)) u += Math.floor(Math.random() * 999) + 1
    if (opts.underscores && Math.random() > 0.7) u = u.replace(/([a-z])([a-z])/g, '$1_$2')
    if (opts.dots && Math.random() > 0.7) u = u.replace(/_/g, '.')

    u = u.replace(/[^a-z0-9._]/g, '').replace(/^[._]|[._]$/g, '').replace(/[._]{2,}/g, '.')
    if (u.length >= 3 && u.length <= 30) usernames.add(u)
  }
  return Array.from(usernames)
}

export default function instagram_username_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [name, setName] = useState('')
  const [category, setCategory] = useState('personal')
  const [style, setStyle] = useState('simple')
  const [opts, setOpts] = useState({ numbers: true, underscores: false, dots: false })
  const [usernames, setUsernames] = useState([])
  const [copiedIdx, setCopiedIdx] = useState(null)
  const [allCopied, setAllCopied] = useState(false)

  const generate = useCallback(() => {
    const n = name.trim().toLowerCase()
    if (!n) return
    const result = createUsernames(n, category, style, 12, opts)
    setUsernames(result)
    jumpTo()
  }, [name, category, style, opts, jumpTo])

  const generateMore = useCallback(() => {
    const n = name.trim().toLowerCase()
    if (!n) return
    const more = createUsernames(n, category, style, 8, opts)
    setUsernames(prev => [...prev, ...more])
  }, [name, category, style, opts])

  const copyUsername = useCallback(async (username, idx) => {
    try { await navigator.clipboard.writeText(username) } catch {
      const ta = document.createElement('textarea'); ta.value = username
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta)
    }
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }, [])

  const copyAll = useCallback(async () => {
    const text = usernames.map(u => '@' + u).join('\n')
    try { await navigator.clipboard.writeText(text) } catch {
      const ta = document.createElement('textarea'); ta.value = text
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta)
    }
    setAllCopied(true)
    setTimeout(() => setAllCopied(false), 2000)
  }, [usernames])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Instagram Username Generator"
      desc="Generate unique, creative Instagram username ideas. Choose from multiple styles and categories."
      icon="👤" iconBg="rgba(99,102,241,0.08)"
      category="social" slug="instagram-username-generator"
      faq={[
        { q: 'How do I check if a username is available?', a: 'After generating, try registering the username on Instagram. The tool provides suggestions but cannot check real-time availability.' },
        { q: 'Can I generate usernames for a business?', a: 'Yes! Select the "Business" category and "Professional" style for business-appropriate username suggestions.' },
      ]}
      howItWorks={[
        'Enter your name or brand keyword.',
        'Choose a category and username style.',
        'Toggle options for numbers, underscores, or dots.',
        'Click Generate and copy your favorite usernames.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Instagram Username Generator", "applicationCategory": "SocialNetworkingApplication",
        "url": "https://www.uptools.in/instagram-username-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Your Name or Keyword</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && generate()}
            placeholder="e.g. john, creativelab" className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Category</label>
          <div className="flex flex-wrap gap-2">
            {Object.keys(CATEGORIES).map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all duration-200 border-2
                  ${category === cat ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-white/[0.04] border-white/8 text-slate-500 hover:border-white/12'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Username Style</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.keys(PATTERNS).map(s => (
              <button key={s} onClick={() => setStyle(s)}
                className={`py-2.5 rounded-xl text-sm font-semibold capitalize transition-all duration-200 border-2
                  ${style === s ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-white/[0.04] border-white/8 text-slate-500 hover:border-white/12'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Options</label>
          <div className="flex gap-4">
            {[
              ['numbers', 'Add numbers'],
              ['underscores', 'Add underscores'],
              ['dots', 'Use dots'],
            ].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                <input type="checkbox" checked={opts[key]}
                  onChange={e => setOpts(p => ({ ...p, [key]: e.target.checked }))}
                  className="w-4 h-4 rounded accent-indigo-500" />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={generate}
            className="flex-1 py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
            Generate Usernames
          </button>
          {usernames.length > 0 && (
            <button onClick={generateMore}
              className="px-6 py-4 rounded-2xl bg-white/[0.06] text-slate-400 font-bold text-sm hover:text-white transition-all duration-200">
              + More
            </button>
          )}
        </div>

        {usernames.length > 0 && (
          <div ref={resultRef} className="space-y-3"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">
                {usernames.length} usernames generated
              </h3>
              <button onClick={copyAll}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold transition-all"
                style={{ background: allCopied ? '#22c55e' : 'rgba(255,255,255,0.06)', color: allCopied ? '#fff' : '#94a3b8' }}>
                {allCopied ? '✅ Copied All!' : '📋 Copy All'}
              </button>
            </div>

            {usernames.map((u, i) => (
              <div key={i} className="flex items-center justify-between rounded-2xl bg-white/[0.04] border border-white/6 px-5 py-3">
                <div>
                  <span className="text-white font-semibold">@{u}</span>
                </div>
                <button onClick={() => copyUsername('@' + u, i)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{ background: copiedIdx === i ? '#22c55e' : 'rgba(255,255,255,0.06)', color: copiedIdx === i ? '#fff' : '#94a3b8' }}>
                  {copiedIdx === i ? '✅' : '📋'}
                </button>
              </div>
            ))}
          </div>
        )}

        {usernames.length === 0 && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">@</div>
            <p className="text-sm text-slate-600 font-medium">Enter your name and click Generate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
