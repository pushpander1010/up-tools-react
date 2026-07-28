import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'

export default function DuplicateLineRemover() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [stats, setStats] = useState(null)
  const [copied, setCopied] = useState(false)

  const getLines = (text) => text.split('\n').filter(() => true)

  const dedup = (caseInsensitive) => {
    const raw = getLines(input)
    if (caseInsensitive) {
      const seen = new Set()
      const out = []
      for (const l of raw) {
        const k = l.trim().toLowerCase()
        if (!seen.has(k) && l.trim()) {
          seen.add(k)
          out.push(l)
        }
      }
      updateResult(raw, out)
    } else {
      const out = [...new Set(raw.filter(l => l.trim()))]
      updateResult(raw, out)
    }
  }

  const countOnly = () => {
    const raw = getLines(input)
    const seen = new Set()
    raw.forEach(l => { if (l.trim()) seen.add(l.trim()) })
    updateResult(raw, [...seen])
  }

  const showDupes = () => {
    const raw = getLines(input)
    const counts = {}
    raw.forEach(l => {
      const t = l.trim()
      if (t) counts[t] = (counts[t] || 0) + 1
    })
    const dupes = Object.entries(counts)
      .filter(([, c]) => c > 1)
      .map(([l, c]) => `${l} (×${c})`)
    updateResult(raw, dupes)
  }

  const updateResult = (raw, out) => {
    const d = raw.length - out.length
    const i = raw.length
    const o = out.length
    setOutput(out.join('\n'))
    setStats(i > 0 ? `${i} lines in → ${o} unique (${d} duplicate${d !== 1 ? 's' : ''} removed)` : '')
  }

  const handleCopy = () => {
    if (!output) return
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setStats(null)
  }

  const inCount = useMemo(() => input ? input.split('\n').length : 0, [input])
  const outCount = useMemo(() => output ? output.split('\n').length : 0, [output])

  return (
    <ToolLayout
      title="Duplicate Line Remover"
      desc="Remove duplicate lines, count unique entries, and clean up your text. All client-side."
      icon="🗑️" iconBg="rgba(99,102,241,0.08)"
      category="text" slug="duplicate-line-remover"
      faq={[
        { q: 'What is Duplicate Line Remover?', a: 'A tool that removes duplicate lines from your text. Supports case-sensitive and case-insensitive deduplication, counting unique lines, and showing only duplicates.' },
        { q: 'How to use it?', a: 'Paste your text, choose a deduplication mode, and get the cleaned output instantly.' },
      ]}
      howItWorks={[
        'Paste your text with one item per line in the input area.',
        'Click a dedup mode: Remove Duplicates, Case Insensitive, Count Only, or Show Duplicates.',
        'View the cleaned output and stats.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Duplicate Line Remover", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/duplicate-line-remover/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => dedup(false)}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] text-indigo-400 transition-all">
            Remove Duplicates
          </button>
          <button onClick={() => dedup(true)}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] text-emerald-400 transition-all">
            Remove Duplicates (Case Insensitive)
          </button>
          <button onClick={countOnly}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] text-amber-400 transition-all">
            Count Only Unique
          </button>
          <button onClick={showDupes}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] text-cyan-400 transition-all">
            Show Only Duplicates
          </button>
        </div>

        {/* Input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Input (<span className="text-indigo-400">{inCount}</span> lines)
          </label>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder="Enter lines here (one per line)..."
            rows={10}
            className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3.5 text-white font-mono text-sm outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark] resize-none" />
        </div>

        {/* Stats */}
        {stats && (
          <div className="rounded-2xl border border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-transparent to-transparent p-4 text-center">
            <p className="text-sm font-semibold text-indigo-300">{stats}</p>
          </div>
        )}

        {/* Output */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Output (<span className="text-emerald-400">{outCount}</span> lines)
          </label>
          <textarea value={output} readOnly
            placeholder="Result will appear here..."
            rows={10}
            className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3.5 text-white font-mono text-sm outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark] resize-none" />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button onClick={handleCopy}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] text-slate-300 transition-all">
            {copied ? '✅ Copied!' : '📋 Copy Output'}
          </button>
          <button onClick={handleClear}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] text-slate-300 transition-all">
            🗑️ Clear All
          </button>
        </div>
      </div>
    </ToolLayout>
  )
}
