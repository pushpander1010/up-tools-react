import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function word_counter() {

  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [text, setText] = useState('')

  const stats = useMemo(() => {
    if (!text) return null
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const chars = text.length
    const charsNoSpaces = text.replace(/\s/g, '').length
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length || (text.trim() ? 1 : 0)
    const readingTime = Math.ceil(words / 200)
    const speakingTime = Math.ceil(words / 130)
    const pages = (words / 250).toFixed(1)
    return { words, chars, charsNoSpaces, sentences, paragraphs, readingTime, speakingTime, pages }
  }, [text])

  const wordDensity = useMemo(() => {
    if (!text || !stats) return []
    const words = text.toLowerCase().match(/\b[a-z']+\b/g) || {}
    const freq = {}
    words.forEach(w => { if (w.length > 2) freq[w] = (freq[w] || 0) + 1 })
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 15)
  }, [text, stats])

  return (
    <ToolLayout
      title="Word Counter"
      desc="Count words, characters, sentences, paragraphs, and reading time. Analyze text density."
      icon="📝" iconBg="rgba(99,102,241,0.08)"
      category="text" slug="word-counter"
      faq={[
        { q: 'What is the average reading speed?', a: 'About 200-250 words per minute for English. We use 200 wpm for calculations.' },
        { q: 'How is speaking time calculated?', a: 'Average speaking rate is about 130 words per minute.' },
      ]}
      howItWorks={[
        'Type or paste your text in the input area.',
        'View word count, character count, sentences, and paragraphs instantly.',
        'Check reading time and speaking time estimates.',
        'See word frequency density for the most common words.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Word Counter", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/word-counter/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Your Text</label>
          <textarea value={text} onChange={e => { setText(e.target.value); jumpTo() }}
            placeholder="Type or paste your text here..."
            rows={8}
            className="w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl px-5 py-4 text-white text-sm outline-none focus:border-brand/40 transition-all duration-300 placeholder:text-slate-600 resize-none" />
        </div>

        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" style={{ animation: 'slideUp 0.3s ease-out' }}>
            {[
              { label: 'Words', value: stats.words, color: 'text-brand-light' },
              { label: 'Characters', value: stats.chars, color: 'text-emerald-400' },
              { label: 'Characters (no spaces)', value: stats.charsNoSpaces, color: 'text-cyan-400' },
              { label: 'Sentences', value: stats.sentences, color: 'text-amber-400' },
              { label: 'Paragraphs', value: stats.paragraphs, color: 'text-rose-400' },
              { label: 'Reading Time', value: `${stats.readingTime} min`, color: 'text-purple-400' },
              { label: 'Speaking Time', value: `${stats.speakingTime} min`, color: 'text-emerald-400' },
              { label: 'Pages (250 wpg)', value: stats.pages, color: 'text-brand-light' },
            ].map(s => (
              <div key={s.label} className="p-4 rounded-2xl bg-white/[0.06] border border-white/8 text-center">
                <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
                <div className="text-[11px] text-slate-500 mt-1 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {wordDensity.length > 0 && (
          <div className="p-5 rounded-2xl bg-white/[0.05] border border-white/8" style={{ animation: 'slideUp 0.4s ease-out' }}>
            <h3 className="text-sm font-bold text-slate-300 mb-3">Word Frequency</h3>
            <div className="space-y-1.5">
              {wordDensity.map(([word, count], i) => (
                <div key={word} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-4 text-right">{i + 1}</span>
                  <span className="text-sm text-white font-mono w-32 truncate">{word}</span>
                  <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full bg-brand/50 transition-all" style={{ width: `${(count / wordDensity[0][1]) * 100}%` }} />
                  </div>
                  <span className="text-xs text-slate-500 w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!text && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📝</div>
            <p className="text-sm text-slate-600 font-medium">Start typing to see word count statistics</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
