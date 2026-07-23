import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function word_frequency_counter() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [text, setText] = useState('')
  const [topN, setTopN] = useState(10)
  const [copied, setCopied] = useState(false)

  const frequencies = useMemo(() => {
    if (!text.trim()) return []
    const cleaned = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ')
    const words = cleaned.split(/\s+/).filter(Boolean)
    const map = {}
    words.forEach(w => { map[w] = (map[w] || 0) + 1 })
    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1])
    const total = words.length || 1
    return sorted.slice(0, Math.min(100, topN || 10)).map(([word, count]) => ({
      word, count, pct: ((count / total) * 100).toFixed(1)
    }))
  }, [text, topN])

  const handleCopy = useCallback(() => {
    const lines = frequencies.map(f => `${f.word}: ${f.count} (${f.pct}%)`).join('\n')
    navigator.clipboard.writeText(lines)
    setCopied(true); setTimeout(() => setCopied(false), 1500)
  }, [frequencies])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Word Frequency Counter"
      desc="Analyze text and count word frequency. See the most common words with percentages. Great for SEO and text analysis."
      icon="📊" iconBg="rgba(99,102,241,0.08)"
      category="text" slug="word-frequency-counter"
      faq={[
        { q: 'What is Word Frequency Counter?', a: 'A tool that analyzes text and counts how often each word appears, sorted by frequency with percentage.' },
        { q: 'How does it work?', a: 'Text is lowercased, punctuation removed, split into words, and counted. Results are sorted from most to least frequent.' },
      ]}
      howItWorks={[
        'Paste or type your text into the input field.',
        'Set how many top words to display (default: 10).',
        'View word frequencies with counts and percentages.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Word Frequency Counter", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/word-frequency-counter/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Enter or Paste Your Text</label>
          <textarea value={text} onChange={e => setText(e.target.value)}
            placeholder="Paste your text here to analyze word frequency..."
            rows={6} className={`${inputClass} resize-none`} />
          <div className="flex items-center gap-3 mt-3">
            <label className="text-sm font-semibold text-slate-300">Top N:</label>
            <input type="number" min={1} max={100} value={topN}
              onChange={e => setTopN(Math.max(1, Math.min(100, Number(e.target.value) || 10)))}
              className="w-20 bg-white/[0.06] border border-white/[0.08] rounded-xl px-3 py-2 text-white text-sm text-center outline-none focus:border-indigo-500/40 [color-scheme:dark]" />
            {frequencies.length > 0 && (
              <button onClick={handleCopy}
                className={`ml-auto px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                  copied ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/[0.06] border-white/[0.08] text-slate-400 hover:text-white'
                }`}>
                {copied ? '✓ Copied' : '📋 Copy Results'}
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div ref={resultRef} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Word Frequency</h3>
          {frequencies.length > 0 ? (
            <div className="space-y-1.5">
              {frequencies.map((f, i) => (
                <div key={f.word} className="flex items-center gap-3 py-1.5 border-b border-white/[0.04] last:border-0">
                  <span className="text-xs text-slate-500 w-6 text-right font-mono">{i + 1}</span>
                  <span className="text-sm font-bold text-white flex-1">{f.word}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full transition-all"
                        style={{ width: `${Math.min(100, Number(f.pct))}%` }} />
                    </div>
                    <span className="text-xs font-mono text-indigo-400 w-20 text-right">{f.count} ({f.pct}%)</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-600 text-sm">Enter text to see word frequency analysis</div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
