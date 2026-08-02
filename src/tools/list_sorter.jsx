import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function ListSorter() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [input, setInput] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')
  const [ignoreCase, setIgnoreCase] = useState(false)
  const [trimWhitespace, setTrimWhitespace] = useState(true)
  const [removeEmpty, setRemoveEmpty] = useState(true)

  const process = useCallback((action) => {
    if (!input.trim()) return
    let lines = input.split('\n')
    if (trimWhitespace) lines = lines.map(l => l.trim())
    if (removeEmpty) lines = lines.filter(l => l.length > 0)
    if (lines.length === 0) return

    switch (action) {
      case 'sort-asc':
        lines.sort((a, b) => {
          const aa = ignoreCase ? a.toLowerCase() : a
          const bb = ignoreCase ? b.toLowerCase() : b
          return aa.localeCompare(bb, undefined, { numeric: true })
        })
        break
      case 'sort-desc':
        lines.sort((a, b) => {
          const aa = ignoreCase ? a.toLowerCase() : a
          const bb = ignoreCase ? b.toLowerCase() : b
          return bb.localeCompare(aa, undefined, { numeric: true })
        })
        break
      case 'shuffle': {
        for (let i = lines.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[lines[i], lines[j]] = [lines[j], lines[i]]
        }
        break
      }
      case 'reverse':
        lines.reverse()
        break
      case 'dedupe':
        lines = [...new Set(lines)]
        break
      case 'dedupe-count': {
        const freq = new Map()
        const unique = []
        const origLines = input.split('\n')
        for (const l of origLines) {
          const key = trimWhitespace ? l.trim() : l
          if (removeEmpty && !key) continue
          if (!freq.has(key)) { freq.set(key, 0); unique.push(key) }
          freq.set(key, freq.get(key) + 1)
        }
        lines = unique.map(k => `${k} (×${freq.get(k)})`)
        break
      }
      case 'sort-length':
        lines.sort((a, b) => a.length - b.length)
        break
      case 'unique-count': {
        const freq2 = new Map()
        for (const l of lines) freq2.set(l, (freq2.get(l) || 0) + 1)
        lines = [...freq2.entries()].map(([k, v]) => `${k} (×${v})`)
        break
      }
      default:
        break
    }
    setInput(lines.join('\n'))
    jumpTo()
  }, [input, ignoreCase, trimWhitespace, removeEmpty, jumpTo])

  const output = input

  const actions = [
    { key: 'sort-asc', label: '⬆️ Sort A→Z', color: 'emerald' },
    { key: 'sort-desc', label: '⬇️ Sort Z→A', color: 'emerald' },
    { key: 'sort-length', label: '📏 By Length', color: 'emerald' },
    { key: 'shuffle', label: '🔀 Shuffle', color: 'amber' },
    { key: 'reverse', label: '🔄 Reverse', color: 'cyan' },
    { key: 'dedupe', label: '✨ Dedupe', color: 'purple' },
    { key: 'dedupe-count', label: '📊 Dedupe+Count', color: 'purple' },
    { key: 'unique-count', label: '📋 Unique Counts', color: 'indigo' },
  ]

  return (
    <ToolLayout
      title="List Sorter"
      desc="Sort, shuffle, reverse, and deduplicate lists with advanced options."
      icon="📋" iconBg="rgba(99,102,241,0.08)"
      category="text" slug="list-sorter"
      faq={[
        { q: 'What is List Sorter?', a: 'A tool to sort, shuffle, reverse, and deduplicate line-by-line lists. Supports natural numeric sorting and case-insensitive options.' },
        { q: 'How does deduplication work?', a: 'It removes duplicate lines, keeping only the first occurrence. "Dedupe+Count" shows each unique line with its frequency.' },
      ]}
      howItWorks={[
        'Paste your list (one item per line) in the input box.',
        'Choose sorting, shuffling, reversing, or deduplication actions.',
        'Toggle options like case-insensitive, trim whitespace, remove empty lines.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "List Sorter", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/list-sorter/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Options */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'ignoreCase', label: 'Aa ignore case', value: ignoreCase, set: setIgnoreCase },
            { key: 'trimWhitespace', label: '✂️ trim', value: trimWhitespace, set: setTrimWhitespace },
            { key: 'removeEmpty', label: '🚫 remove empty', value: removeEmpty, set: setRemoveEmpty },
          ].map(opt => (
            <button key={opt.key} onClick={() => opt.set(!opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${
                opt.value ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400' : 'bg-white/[0.04] border-white/[0.08] text-slate-400'
              }`}>
              {opt.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Your List (one per line)</label>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder={"apple\nbanana\ncherry\napple\nbanana\navocado"}
            rows={8}
            className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3.5 text-white font-mono text-sm outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark] resize-none" />
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {actions.map(a => (
            <button key={a.key} onClick={() => process(a.key)}
              disabled={!input.trim()}
              className={`px-3 py-2.5 rounded-xl text-xs font-bold border-2 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed
                hover:border-${a.color}-500/40 hover:bg-${a.color}-500/10 border-white/[0.08] bg-white/[0.04] text-white`}>
              {a.label}
            </button>
          ))}
        </div>

        {/* Output */}
        {output ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Result</h3>
            </div>
            <textarea value={output} readOnly rows={8}
              className="w-full bg-black/20 border border-white/[0.05] rounded-xl px-4 py-3 text-sm text-white font-mono resize-none focus:outline-none" />
            <button onClick={() => navigator.clipboard.writeText(output)}
              className="mt-3 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
              📋 Copy to clipboard
            </button>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📋</div>
            <p className="text-sm text-slate-600 font-medium">Enter a list to sort, shuffle, or deduplicate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
