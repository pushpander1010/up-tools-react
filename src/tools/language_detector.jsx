import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function language_detector() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [input, setInput] = useState('')
  const [results, setResults] = useState([])

  const languages = {
    'English': /[a-z]/gi,
    'Spanish': /[áéíóúñ]/gi,
    'French': /[àâäæçéèêëïîôùûüœ]/gi,
    'German': /[äöüß]/gi,
    'Italian': /[àèéìòù]/gi,
    'Portuguese': /[ãõç]/gi,
    'Russian': /[а-яА-ЯёЁ]/g,
    'Chinese': /[\u4E00-\u9FFF]/g,
    'Japanese': /[\u3040-\u309F\u30A0-\u30FF]/g,
    'Korean': /[\uAC00-\uD7AF]/g,
    'Arabic': /[\u0600-\u06FF]/g,
    'Hebrew': /[\u0590-\u05FF]/g,
    'Thai': /[\u0E00-\u0E7F]/g,
    'Hindi': /[\u0900-\u097F]/g,
  }

  const detect = useCallback(() => {
    const text = input.trim()
    if (!text) return

    const scores = {}
    for (const [lang, pattern] of Object.entries(languages)) {
      const matches = text.match(pattern) || []
      scores[lang] = (matches.length / text.length) * 100
    }

    const sorted = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .filter(([_, score]) => score > 0)
      .slice(0, 5)

    setResults(sorted)
    jumpTo()
  }, [input])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Language Detector"
      desc="Detect the language of any text using pattern analysis. Supports 14+ languages including Hindi, Arabic, Chinese, and more."
      icon="🌍" iconBg="rgba(99,102,241,0.08)"
      category="text" slug="language-detector"
      faq={[
        { q: "How does language detection work?", a: "It analyzes character patterns specific to each language (e.g., Devanagari for Hindi, Cyrillic for Russian) to determine the most likely language." },
        { q: "How accurate is it?", a: "It works best with longer texts. Short phrases may be harder to detect accurately." },
      ]}
      howItWorks={[
        "Enter or paste text in any language.",
        "Click Detect to analyze the text.",
        "View the top detected languages with confidence scores.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Language Detector", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/language-detector/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Text to Analyze</label>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder="Paste or type text in any language..."
            rows={5} className={inputClass + " resize-none"} />
        </div>

        <button onClick={detect}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
          🌍 Detect Language
        </button>

        {results.length > 0 && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Detected Languages</h3>
            </div>
            <div className="space-y-3">
              {results.map(([lang, score], i) => (
                <div key={lang} className="flex items-center gap-3">
                  <span className="text-sm text-slate-300 w-24">{lang}</span>
                  <div className="flex-1 bg-black/20 rounded-full h-3 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(score, 100)}%`,
                        background: i === 0 ? 'linear-gradient(90deg, #22c55e, #16a34a)' :
                          i === 1 ? 'linear-gradient(90deg, #3b82f6, #2563eb)' :
                          'linear-gradient(90deg, #8b5cf6, #7c3aed)'
                      }} />
                  </div>
                  <span className="text-sm font-mono text-slate-400 w-14 text-right">{score.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {results.length === 0 && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🌍</div>
            <p className="text-sm text-slate-600 font-medium">Enter text and click Detect to identify the language</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
