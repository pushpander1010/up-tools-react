import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function character_counter() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [text, setText] = useState('')

  const stats = useMemo(() => {
    if (!text) return null
    const words = text.trim() ? text.trim().split(/\s+/).filter(w => w.length > 0) : []
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim().length > 0) : []
    const lines = text ? text.split('\n').length : 0
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim().length > 0) : []
    return {
      chars: text.length,
      charsNoSpaces: text.replace(/\s/g, '').length,
      words: words.length,
      sentences: sentences.length,
      paragraphs: paragraphs.length || (text.trim() ? 1 : 0),
      lines,
    }
  }, [text])

  return (
    <ToolLayout
      title="Character & Word Counter"
      desc="Count characters, words, sentences, lines and paragraphs in your text. Instant real-time analysis."
      icon="🔢" iconBg="rgba(99,102,241,0.08)"
      category="text" slug="character-counter"
      faq={[
        { q: 'What is Character & Word Counter?', a: 'A tool that instantly counts characters (with and without spaces), words, sentences, lines, and paragraphs in any text.' },
        { q: 'How to use it?', a: 'Paste or type your text and see all counts update in real time.' },
      ]}
      howItWorks={[
        'Type or paste your text in the input area.',
        'View real-time counts for characters, words, sentences, lines, and paragraphs.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Character & Word Counter", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/character-counter/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Enter Your Text</label>
          <textarea value={text} onChange={e => setText(e.target.value)}
            placeholder="Type or paste your text here..."
            rows={8}
            className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark] resize-none" />
        </div>

        {/* Stats */}
        {stats ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Counts</h3>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                ['Characters', stats.chars.toLocaleString(), 'text-indigo-400'],
                ['No Spaces', stats.charsNoSpaces.toLocaleString(), 'text-indigo-400'],
                ['Words', stats.words.toLocaleString(), 'text-emerald-400'],
                ['Sentences', stats.sentences.toLocaleString(), 'text-amber-400'],
                ['Lines', stats.lines.toLocaleString(), 'text-cyan-400'],
                ['Paragraphs', stats.paragraphs.toLocaleString(), 'text-purple-400'],
              ].map(([label, val, color]) => (
                <div key={label} className="p-2.5 sm:p-3 rounded-xl bg-black/20 border border-white/[0.05] text-center">
                  <div className={`text-xl sm:text-2xl font-extrabold ${color}`}>{val}</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🔢</div>
            <p className="text-sm text-slate-600 font-medium">Enter text to see counts</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
