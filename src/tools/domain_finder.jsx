import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const PREFIXES = ['go', 'get', 'try', 'my', 'hey', 'we', 'use', 'top', 'pro', 'neo', 'ultra', 'swift', 'true', 'hyper', 'omni', 'mint', 'clear', 'alpha', 'next']
const SUFFIXES = ['ly', 'ify', 'io', 'hub', 'labs', 'base', 'stack', 'gen', 'flow', 'grid', 'zone', 'spot', 'deck', 'kit', 'forge', 'nest', 'pilot', 'vista', 'pulse', 'mint']
const TLDs = ['.com', '.in', '.co', '.ai', '.io', '.dev', '.app']

function brandScore(domain) {
  const name = domain.split('.')[0]
  let s = 100
  if (name.length < 4 || name.length > 14) s -= 20
  if (/-/.test(name)) s -= 15
  if (/\d/.test(name)) s -= 10
  if (/(ai|io|ly|ify|hub|labs|base|stack|gen|flow|grid|zone|nest|forge|kit|deck|nova|pulse|mint)$/.test(name)) s += 8
  if (/^(go|get|try|my|hey|we|use|top|pro)/.test(name)) s += 5
  return Math.max(0, Math.min(100, s))
}

function generateDomains(seeds, tlds, maxLen, allowHyphen, allowDigit) {
  const names = new Set()
  seeds.forEach(seed => {
    const s = seed.toLowerCase().replace(/[^a-z0-9-]+/g, '')
    if (!s) return
    names.add(s)
    PREFIXES.forEach(p => names.add(p + s))
    SUFFIXES.forEach(x => names.add(s + x))
    names.add(s.replace(/[aeiou][^aeiou]*$/, ''))
    names.add(s.slice(0, Math.max(3, s.length - 1)))
  })

  const domains = []
  names.forEach(name => {
    let clean = name
    if (!allowHyphen) clean = clean.replace(/-/g, '')
    if (!allowDigit) clean = clean.replace(/\d/g, '')
    tlds.forEach(tld => {
      const d = clean + tld
      if (clean && d.length <= maxLen + tld.length && /^[a-z0-9-]+(\.[a-z]{2,})$/.test(d)) {
        domains.push({ domain: d, score: brandScore(d) })
      }
    })
  })

  return [...new Map(domains.map(d => [d.domain, d])).values()]
    .sort((a, b) => b.score - a.score || a.domain.length - b.domain.length)
    .slice(0, 100)
}

export default function domain_finder() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [keywords, setKeywords] = useState('')
  const [selectedTlds, setSelectedTlds] = useState(new Set(['.com', '.in', '.co']))
  const [maxLen, setMaxLen] = useState(14)
  const [allowHyphen, setAllowHyphen] = useState(false)
  const [allowDigit, setAllowDigit] = useState(false)
  const [results, setResults] = useState([])
  const [copied, setCopied] = useState(null)

  const toggleTld = (tld) => {
    setSelectedTlds(prev => { const next = new Set(prev); if (next.has(tld)) next.delete(tld); else next.add(tld); return next })
  }

  const search = useCallback(() => {
    const seeds = keywords.split(/[, ]+/).map(s => s.trim().toLowerCase()).filter(Boolean)
    if (!seeds.length && !keywords.trim()) {
      // Random generation
      const randomSeeds = Array.from({ length: 10 }, () => {
        const len = 4 + Math.floor(Math.random() * 6)
        return Array.from({ length: len }, () => 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]).join('')
      })
      seeds.push(...randomSeeds)
    }
    const domains = generateDomains(seeds, [...selectedTlds], maxLen, allowHyphen, allowDigit)
    setResults(domains)
    jumpTo()
  }, [keywords, selectedTlds, maxLen, allowHyphen, allowDigit, jumpTo])

  const copy = useCallback((text, label) => {
    navigator.clipboard?.writeText(text)
    setCopied(label); setTimeout(() => setCopied(null), 2000)
  }, [])

  const copyAll = useCallback(() => {
    const text = results.map(r => r.domain).join('\n')
    navigator.clipboard?.writeText(text)
    setCopied('all'); setTimeout(() => setCopied(null), 2000)
  }, [results])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Domain Finder"
      desc="Find brandable domain name ideas from keywords. Generate available-looking domains with brand scores."
      icon="🌐" iconBg="rgba(99,102,241,0.08)"
      category="business" slug="domain-finder"
      faq={[
        { q: 'Does this check if domains are available?', a: 'No — this generates domain name ideas with brand scores. You\'ll need to verify availability on a registrar like GoDaddy or Namecheap.' },
        { q: 'How is brand score calculated?', a: 'Based on name length (4-14 chars optimal), no hyphens, no digits, and TLD quality (.com > .in > .co).' },
      ]}
      howItWorks={[
        'Enter comma-separated seed keywords (e.g., "ai, health, travel").',
        'Select your preferred TLDs (.com, .in, .ai, etc.).',
        'Adjust max name length and character options.',
        'Click Generate to see brandable domain ideas.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Domain Finder", "applicationCategory": "BusinessApplication",
        "url": "https://www.uptools.in/domain-finder/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Input */}
        <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08] space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Seed Keywords</label>
            <input type="text" value={keywords} onChange={e => setKeywords(e.target.value)}
              placeholder="ai, health, travel — or leave empty for random"
              className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-2 block">TLDs</label>
            <div className="flex flex-wrap gap-2">
              {TLDs.map(tld => (
                <button key={tld} onClick={() => toggleTld(tld)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedTlds.has(tld) ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-white/[0.04] text-slate-500 border border-white/8'}`}>
                  {tld}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Max Length</label>
              <input type="number" value={maxLen} onChange={e => setMaxLen(parseInt(e.target.value) || 14)}
                min="3" max="30" className={inputClass} />
            </div>
            <label className="flex items-center gap-2 pt-6">
              <input type="checkbox" checked={allowHyphen} onChange={e => setAllowHyphen(e.target.checked)}
                className="w-4 h-4 accent-indigo-500" />
              <span className="text-xs text-slate-400">Hyphens</span>
            </label>
            <label className="flex items-center gap-2 pt-6">
              <input type="checkbox" checked={allowDigit} onChange={e => setAllowDigit(e.target.checked)}
                className="w-4 h-4 accent-indigo-500" />
              <span className="text-xs text-slate-400">Digits</span>
            </label>
          </div>
        </div>

        <button onClick={search}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-95 transition-all duration-200">
          🔍 Generate Domains
        </button>

        {/* Results */}
        {results.length > 0 ? (
          <div ref={resultRef} className="space-y-3" style={{ animation: 'slideUp 0.35s ease-out' }}>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold">{results.length} domains found</span>
              <button onClick={copyAll}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${copied === 'all' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/[0.06] text-slate-400 hover:text-white'}`}>
                {copied === 'all' ? '✓ Copied' : '📋 Copy All'}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {results.map((r, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/8 hover:border-white/15 transition-all cursor-pointer"
                  onClick={() => copy(r.domain, `d-${i}`)}>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-white font-mono truncate">{r.domain}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full" style={{
                        width: `${r.score}%`,
                        background: r.score >= 80 ? '#22c55e' : r.score >= 60 ? '#f59e0b' : '#ef4444'
                      }} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 w-6 text-right">{r.score}</span>
                    <span className="text-[10px] text-slate-600">{copied === `d-${i}` ? '✓' : ''}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🌐</div>
            <p className="text-sm text-slate-600 font-medium">Enter keywords or leave empty for random domains</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
