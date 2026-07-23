import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function word_counter() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [text, setText] = useState('')

  const stats = useMemo(() => {
    const s = text || ''
    const chars = s.length
    const words = (s.trim().match(/\S+/g) || []).length
    const sentences = (s.match(/[.!?]+/g) || []).length
    const paragraphs = s.trim() ? s.trim().split(/\n\s*\n/).length : 0
    const lines = s ? s.split(/\r?\n/).length : 0
    return { chars, words, sentences, paragraphs, lines }
  }, [text])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark] resize-none"

  return (
    <ToolLayout
      title="Word Counter"
      desc="Count words, characters, sentences, paragraphs, and lines in your text. Instant, private, no sign-up."
      icon="📝" iconBg="rgba(99,102,241,0.08)"
      category="text" slug="word-counter"
      faq={[
        { q: "What does Word Counter count?", a: "It counts characters, words, sentences, paragraphs, and lines in your text." },
        { q: "Is my text stored?", a: "No. Everything runs in your browser. Nothing is uploaded to any server." },
      ]}
      howItWorks={[
        "Paste or type your text in the input area.",
        "Stats update instantly as you type.",
        "View word count, character count, sentences, paragraphs, and lines.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Word Counter", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/word-counter/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Paste or type your text</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Paste text here..."
            rows={8}
            className={inputClass}
          />
        </div>

        <div ref={resultRef} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Characters', value: stats.chars },
            { label: 'Words', value: stats.words },
            { label: 'Sentences', value: stats.sentences },
            { label: 'Paragraphs', value: stats.paragraphs },
            { label: 'Lines', value: stats.lines },
          ].map(item => (
            <div key={item.label} className="text-center p-4 bg-black/20 rounded-xl">
              <div className="text-2xl font-bold text-indigo-400">{item.value}</div>
              <div className="text-xs text-slate-500 mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  )
}
