import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function ai_joke_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)

  const calculate = useCallback(() => {
    if (!input.trim()) return
    setResult({ value: input, timestamp: new Date().toLocaleString() })
  }, [input])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="AI Joke Generator"
      desc="Get hilarious jokes, puns & one-liners instantly."
      icon="🤖" iconBg="rgba(168,85,247,0.08)"
      category="ai" slug="ai-joke-generator"
      faq={[
        { q: "What is AI Joke Generator?", a: "AI Joke Generator is a free online tool by UpTools. Get hilarious jokes, puns & one-liners instantly." },
        { q: "How to use AI Joke Generator?", a: "Simply enter your input and click Calculate to get instant results." },
      ]}
      howItWorks={[
        "Enter your input in the field below.",
        "Click the Calculate button to process.",
        "View your results instantly.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "AI Joke Generator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/SLUG/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Input</label>
          <input type="text" value={input} onChange={e => setInput(e.target.value)}
            placeholder="Enter value..."
            className={inputClass} />
        </div>
        
        <button onClick={() => { calculate(); jumpTo() }}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
          Calculate
        </button>

        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Result</h3>
            </div>
            <div className="text-xl font-extrabold text-white">{result.value}</div>
            <div className="text-xs text-slate-500 mt-2">Calculated at {result.timestamp}</div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">ICON</div>
            <p className="text-sm text-slate-600 font-medium">Enter a value and click Calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}