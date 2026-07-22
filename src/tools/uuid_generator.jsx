import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

function generateUUID() {
  return crypto.randomUUID()
}

export default function uuid_generator() {

  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [uuids, setUuids] = useState(() => [generateUUID()])
  const [count, setCount] = useState(1)
  const [copied, setCopied] = useState(null)
  const [format, setFormat] = useState('standard') // standard, uppercase, no-dash

  const gen = useCallback(() => {
    setUuids(Array.from({ length: count }, () => {
      const u = generateUUID()
      if (format === 'uppercase') return u.toUpperCase()
      if (format === 'no-dash') return u.replace(/-/g, '')
      return u
    }))
    setCopied(null)
  }, [count, format])

  const copy = (text, i) => {
    navigator.clipboard.writeText(text)
    setCopied(i)
    setTimeout(() => setCopied(null), 1500)
  }

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'))
    setCopied('all')
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <ToolLayout
      title="UUID / GUID Generator"
      desc="Generate random UUID v4 identifiers. Copy single or batch generate multiple UUIDs."
      icon="🆔" iconBg="rgba(99,102,241,0.08)"
      category="dev" slug="uuid-generator"
      faq={[
        { q: 'What is a UUID?', a: 'A Universally Unique Identifier — a 128-bit number used to uniquely identify records, sessions, and resources.' },
        { q: 'What is UUID v4?', a: 'Version 4 uses cryptographically random numbers. It\'s the most commonly used UUID version.' },
      ]}
      howItWorks={[
        'Choose the output format (standard, uppercase, or no dashes).',
        'Select how many UUIDs to generate.',
        'Click Generate and copy the ones you need.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "UUID Generator", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/uuid-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Format */}
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-2 block">Format</label>
          <div className="flex gap-2">
            {[['standard', 'Standard'], ['uppercase', 'UPPERCASE'], ['no-dash', 'No Dashes']].map(([val, label]) => (
              <button key={val} onClick={() => setFormat(val)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${format === val ? 'bg-brand/15 text-brand-light border border-brand/30' : 'bg-white/[0.06] text-slate-500 border border-white/8'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-2 block">How many?</label>
          <div className="flex gap-2">
            {[1, 5, 10, 25].map(n => (
              <button key={n} onClick={() => setCount(n)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${count === n ? 'bg-brand/15 text-brand-light border border-brand/30' : 'bg-white/[0.06] text-slate-500 border border-white/8'}`}>
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Generate */}
        <button onClick={() => {gen(); jumpTo()}}
          className="glow-btn w-full py-3 rounded-xl text-sm">🔄 Generate</button>

        {/* UUIDs */}
        <div className="space-y-2">
          {uuids.length > 1 && (
            <button onClick={copyAll}
              className={`w-full py-2 rounded-xl text-xs font-semibold transition-all ${copied === 'all' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/8 text-slate-400 hover:text-white'}`}>
              {copied === 'all' ? '✓ All Copied' : `📋 Copy All (${uuids.length})`}
            </button>
          )}
          {uuids.map((u, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.05] border border-white/8 hover:border-white/12 transition-all group">
              <code className="flex-1 text-sm text-white font-mono break-all">{u}</code>
              <button onClick={() => copy(u, i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${copied === i ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/8 text-slate-400 hover:text-white'}`}>
                {copied === i ? '✓' : '📋'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  )
}
