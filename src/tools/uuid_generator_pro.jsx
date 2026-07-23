import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = crypto.getRandomValues(new Uint8Array(1))[0] % 16
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

export default function uuid_generator_pro() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [count, setCount] = useState(10)
  const [format, setFormat] = useState('hyphen')
  const [uuids, setUuids] = useState('')
  const [copied, setCopied] = useState(false)

  const generate = useCallback(() => {
    const n = Math.min(100, Math.max(1, count || 10))
    const result = []
    for (let i = 0; i < n; i++) {
      let u = uuid()
      if (format === 'none') u = u.replace(/-/g, '')
      else if (format === 'upper') u = u.toUpperCase()
      result.push(u)
    }
    setUuids(result.join('\n'))
  }, [count, format])

  useState(() => generate())

  const copyAll = () => {
    navigator.clipboard.writeText(uuids)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <ToolLayout
      title="UUID Generator Pro"
      desc="Generate UUID v4 with customizable format and count."
      icon="🆔" iconBg="rgba(99,102,241,0.08)"
      category="dev" slug="uuid-generator-pro"
      faq={[
        { q: 'What is a UUID?', a: 'A Universally Unique Identifier (UUID) is a 128-bit number used to uniquely identify information in computer systems.' },
        { q: 'What is UUID v4?', a: 'UUID v4 is randomly generated. It uses cryptographic randomness to ensure uniqueness.' },
        { q: 'Is this secure?', a: 'Yes. The generator uses the browser crypto API for cryptographically secure random values.' },
      ]}
      howItWorks={[
        'Set the number of UUIDs to generate.',
        'Choose your preferred format.',
        'Click Generate.',
        'Copy all UUIDs to clipboard.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "UUID Generator Pro", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/uuid-generator-pro/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Config */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-2 block">Count</label>
              <input type="number" value={count} onChange={e => setCount(parseInt(e.target.value) || 10)}
                min={1} max={100}
                className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/40 transition-all" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-2 block">Format</label>
              <select value={format} onChange={e => setFormat(e.target.value)}
                className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/40 transition-all">
                <option value="hyphen">With hyphens</option>
                <option value="none">No hyphens</option>
                <option value="upper">Uppercase</option>
              </select>
            </div>
          </div>
          <button onClick={() => { generate(); jumpTo() }}
            className="glow-btn px-6 py-3 rounded-xl text-sm w-full mt-4"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>✨ Generate</button>
        </div>

        {/* Results */}
        <div ref={resultRef} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-white">UUIDs</h2>
            <button onClick={copyAll}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/[0.08] text-slate-400 hover:text-white'}`}>
              {copied ? '✓ Copied' : '📋 Copy All'}
            </button>
          </div>
          <div className="bg-black/20 border-2 border-emerald-500/20 rounded-xl p-4 font-mono text-xs text-emerald-400 whitespace-pre-wrap max-h-[400px] overflow-auto">
            {uuids || 'Click Generate to create UUIDs'}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
