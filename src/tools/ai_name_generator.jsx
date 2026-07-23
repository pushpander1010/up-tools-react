import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'

const NAMES = {
  baby: {
    male: ["Aarav","Arjun","Vihaan","Reyansh","Ayaan","Atharv","Dhruv","Kabir","Ishaan","Rohan","Aiden","Liam","Noah","Ethan","Lucas","Mason","Logan","Oliver","Elijah","James","Aryan","Kiran","Dev","Sai","Rishi","Vivaan","Arnav","Advait","Shaurya","Yash"],
    female: ["Aadhya","Ananya","Diya","Saanvi","Pari","Myra","Anika","Riya","Priya","Nisha","Emma","Olivia","Ava","Sophia","Isabella","Mia","Charlotte","Amelia","Harper","Evelyn","Zara","Aria","Luna","Chloe","Layla","Nora","Lily","Eleanor","Natalie","Stella"],
    neutral: ["Arya","Avery","Jordan","Riley","Morgan","Quinn","Sage","River","Rowan","Skylar","Reese","Finley","Casey","Drew","Alex","Blake","Cameron","Dakota","Emery","Hayden","Jamie","Kendall","Logan","Parker","Peyton","Remy","Sawyer","Taylor","Wren","Zion"]
  },
  business: ["Nexus","Apex","Vortex","Pinnacle","Catalyst","Synergy","Momentum","Elevate","Horizon","Zenith","Forge","Spark","Pulse","Orbit","Vertex","Clarity","Fusion","Radiant","Ascend","Luminary","Stratos","Kinetic","Prism","Axiom","Beacon","Cipher","Dynamo","Ember","Flux","Glyph"],
  brand: ["Zova","Luxe","Aura","Vibe","Glow","Bloom","Drift","Halo","Muse","Nova","Posh","Raze","Silk","Tint","Urge","Veil","Wink","Xcel","Yolo","Zest","Bliss","Crisp","Dash","Echo","Flair","Glam","Hype","Icon","Jade","Keen"],
  startup: ["Launchly","Growthify","Scalr","Buildify","Stackr","Flowbase","Nexify","Pivotly","Launchpad","Growthhack","Techify","Buildstack","Codeflow","Dataloop","Edgecase","Fastlane","Gridlock","Hackbase","Ideaflow","Jumpstart","Keystone","Launchkit","Mindstack","Nodebase","Openloop","Pipeflow","Quickstart","Roadmap","Scaleup","Techstack"],
  character: ["Zephyr","Orion","Lyra","Caspian","Seraphina","Theron","Isolde","Caelum","Vesper","Alaric","Elowen","Soren","Calista","Dorian","Fiora","Gideon","Hestia","Idris","Juno","Kael","Lirien","Malachar","Nyx","Oberon","Petra","Quillon","Riven","Sylvara","Talon","Ulric"],
  pet: ["Biscuit","Mochi","Peanut","Waffles","Noodle","Pretzel","Dumpling","Cheddar","Pickles","Mango","Coco","Latte","Mocha","Caramel","Fudge","Gizmo","Pixel","Zigzag","Bubbles","Sprout","Pepper","Ginger","Maple","Hazel","Clover","Daisy","Poppy","Willow","Ivy","Fern"],
  username: ["NeonWolf","PixelDrift","CyberNova","GlitchKing","ShadowByte","NightOwl","StarForge","VoidWalker","NeonPulse","CryptoFox","DataGhost","EchoStrike","FluxRider","GridHacker","HyperLink","IronCode","JetStream","KernelPanic","LaserFocus","MindByte"]
}

const TYPES = [
  { id: 'baby', label: '👶 Baby Names' },
  { id: 'business', label: '🏢 Business' },
  { id: 'brand', label: '💎 Brand' },
  { id: 'startup', label: '🚀 Startup' },
  { id: 'character', label: '🎭 Character' },
  { id: 'pet', label: '🐾 Pet Names' },
  { id: 'username', label: '👤 Username' },
]

const GENDERS = [
  { id: 'any', label: 'Any' },
  { id: 'male', label: '♂ Male' },
  { id: 'female', label: '♀ Female' },
]

export default function ai_name_generator() {
  const [nameType, setNameType] = useState('baby')
  const [gender, setGender] = useState('any')
  const [keywords, setKeywords] = useState('')
  const [count, setCount] = useState(12)
  const [results, setResults] = useState([])
  const [copied, setCopied] = useState(null)
  const [copiedAll, setCopiedAll] = useState(false)

  const generate = useCallback(() => {
    let pool = []
    if (nameType === 'baby') {
      if (gender === 'male') pool = NAMES.baby.male
      else if (gender === 'female') pool = NAMES.baby.female
      else pool = [...NAMES.baby.male, ...NAMES.baby.female, ...NAMES.baby.neutral]
    } else {
      pool = NAMES[nameType] || NAMES.brand
    }

    let filtered = pool
    if (keywords.trim()) {
      const kws = keywords.toLowerCase().split(/[\s,]+/).filter(Boolean)
      filtered = pool.filter(n => kws.some(k => n.toLowerCase().includes(k)))
      if (filtered.length < 3) filtered = pool
    }

    const shuffled = [...filtered].sort(() => Math.random() - 0.5)
    let picked = shuffled.slice(0, Math.min(count, shuffled.length))
    while (picked.length < count) {
      const extra = [...pool].sort(() => Math.random() - 0.5)
      for (const n of extra) {
        if (!picked.includes(n)) picked.push(n)
        if (picked.length >= count) break
      }
    }
    setResults(picked)
  }, [nameType, gender, keywords, count])

  const copyName = (name, idx) => {
    navigator.clipboard.writeText(name).then(() => {
      setCopied(idx); setTimeout(() => setCopied(null), 1500)
    })
  }

  const copyAll = () => {
    if (!results.length) return
    navigator.clipboard.writeText(results.join(', ')).then(() => {
      setCopiedAll(true); setTimeout(() => setCopiedAll(false), 1500)
    })
  }

  const inputClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600"
  const selectClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"

  return (
    <ToolLayout
      title="AI Name Generator"
      desc="Generate baby names, business names, brand names, startup names, character names, pet names, and usernames instantly."
      icon="✨" iconBg="rgba(234,179,8,0.08)"
      category="ai" slug="ai-name-generator"
      faq={[
        { q: "How are names generated?", a: "From curated name banks covering Indian, Western, and creative names across 7 categories." },
        { q: "Can I filter by keywords?", a: "Yes — enter keywords to filter names that contain your search terms." },
      ]}
      howItWorks={[
        "Select a name type (baby, business, brand, etc.).",
        "Optionally filter by gender and keywords.",
        "Click Generate and click any name to copy it.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "AI Name Generator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/ai-name-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Type Selector */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <label className="block text-sm font-semibold text-slate-300 mb-3">Name Type</label>
          <div className="flex flex-wrap gap-2">
            {TYPES.map(t => (
              <button key={t.id} onClick={() => setNameType(t.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  nameType === t.id
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-white/[0.04] text-slate-500 border border-white/[0.08] hover:text-white'
                }`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Options */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 space-y-3">
          {nameType === 'baby' && (
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Gender</label>
              <div className="flex gap-2">
                {GENDERS.map(g => (
                  <button key={g.id} onClick={() => setGender(g.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      gender === g.id
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-white/[0.04] text-slate-500 border border-white/[0.08] hover:text-white'
                    }`}>
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Keywords (optional)</label>
              <input type="text" value={keywords} onChange={e => setKeywords(e.target.value)}
                placeholder="e.g. moon, star, tech"
                className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Count</label>
              <select value={count} onChange={e => setCount(parseInt(e.target.value))} className={selectClass}>
                {[6, 8, 10, 12, 15, 20].map(n => (
                  <option key={n} value={n}>{n} names</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button onClick={generate}
          className="w-full px-6 py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
          ✨ Generate Names
        </button>

        {/* Copy All */}
        {results.length > 0 && (
          <button onClick={copyAll}
            className={`w-full px-4 py-2 rounded-xl text-sm font-bold border transition-all ${copiedAll ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/[0.06] border-white/[0.08] text-slate-400 hover:text-white'}`}>
            {copiedAll ? '✓ All Copied!' : '📋 Copy All Names'}
          </button>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div ref={null} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
            <div className="text-xs text-slate-500 mb-3">{results.length} names generated. Click any to copy.</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {results.map((name, i) => (
                <button key={i} onClick={() => copyName(name, i)}
                  className={`p-3 rounded-xl text-sm font-semibold text-left transition-all border ${
                    copied === i
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : 'bg-white/[0.04] text-slate-300 border-white/[0.08] hover:border-amber-500/30 hover:text-white'
                  }`}>
                  {copied === i ? '✓ ' : ''}{name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {results.length === 0 && (
          <div className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">✨</div>
            <p className="text-sm text-slate-600 font-medium">Select a type and click Generate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
