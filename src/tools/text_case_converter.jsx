import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const titleCase = (s) => s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
const camelCase = (s) => s.toLowerCase().split(/[^a-z0-9]+/i).filter(Boolean).map((w, i) => i ? w[0].toUpperCase() + w.slice(1) : w).join('')
const snakeCase = (s) => s.trim().replace(/\s+/g, '_').replace(/[^A-Za-z0-9_]/g, '').toLowerCase()
const kebabCase = (s) => s.trim().replace(/\s+/g, '-').replace(/[^A-Za-z0-9-]/g, '').toLowerCase()

const OPS = [
  { op: 'upper', label: 'UPPERCASE', fn: (s) => s.toUpperCase() },
  { op: 'lower', label: 'lowercase', fn: (s) => s.toLowerCase() },
  { op: 'title', label: 'Title Case', fn: titleCase },
  { op: 'camel', label: 'camelCase', fn: camelCase },
  { op: 'snake', label: 'snake_case', fn: snakeCase },
  { op: 'kebab', label: 'kebab-case', fn: kebabCase },
]

export default function text_case_converter() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)

  const handleConvert = useCallback((op) => {
    const converted = op.fn(text || '')
    setResult({ op: op.label, value: converted })
    jumpTo()
  }, [text, jumpTo])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark] resize-none"

  return (
    <ToolLayout
      title="Text Case Converter"
      desc="Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case, or kebab-case instantly."
      icon="🔤" iconBg="rgba(99,102,241,0.08)"
      category="text" slug="text-case-converter"
      faq={[
        { q: "What text cases are supported?", a: "UPPERCASE, lowercase, Title Case, camelCase, snake_case, and kebab-case." },
        { q: "Is my text stored?", a: "No. Everything runs in your browser. Nothing is uploaded to any server." },
      ]}
      howItWorks={[
        "Type or paste your text in the input field.",
        "Click any case button to convert instantly.",
        "Copy the result from the output area.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Text Case Converter", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/text-case-converter/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-400 mb-2">Input Text</label>
          <textarea value={text} onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here..."
            rows={5} className={inputClass} />
        </div>

        <div className="grid grid-cols-3 gap-2">
          {OPS.map((op) => (
            <button key={op.op} onClick={() => handleConvert(op)}
              className="py-3 rounded-xl bg-white/[0.06] border border-white/8 text-white font-bold text-sm hover:bg-indigo-500/15 hover:border-indigo-500/30 hover:text-indigo-400 transition-all active:scale-[0.98]">
              {op.label}
            </button>
          ))}
        </div>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">{result.op}</h3>
              </div>
              <button onClick={() => { navigator.clipboard.writeText(result.value) }}
                className="text-xs text-slate-400 hover:text-white transition-colors">
                Copy
              </button>
            </div>
            <pre className="text-white font-mono text-sm whitespace-pre-wrap break-all bg-black/20 rounded-xl p-4">
              {result.value}
            </pre>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🔤</div>
            <p className="text-sm text-slate-600 font-medium">Enter text and click a case button</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
