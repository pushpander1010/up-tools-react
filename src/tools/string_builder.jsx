import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function string_builder() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [activeMode, setActiveMode] = useState('')
  const [copied, setCopied] = useState(false)

  const transforms = [
    { id: 'upper', label: 'UPPER', icon: '⬆️', fn: s => s.toUpperCase() },
    { id: 'lower', label: 'lower', icon: '⬇️', fn: s => s.toLowerCase() },
    { id: 'title', label: 'Title Case', icon: '🔤', fn: s => s.replace(/\b\w/g, c => c.toUpperCase()) },
    { id: 'slug', label: 'slug-case', icon: '🔗', fn: s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') },
    { id: 'camel', label: 'camelCase', icon: '🐪', fn: s => s.replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()) },
    { id: 'snake', label: 'snake_case', icon: '🐍', fn: s => s.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/[^a-z0-9_]/g, '_') },
    { id: 'reverse', label: 'esrever', icon: '🔄', fn: s => s.split('').reverse().join('') },
    { id: 'trim', label: 'trim spaces', icon: '✂️', fn: s => s.replace(/\s+/g, ' ').trim() },
  ]

  const apply = useCallback((t) => {
    const result = t.fn(input)
    setOutput(result)
    setActiveMode(t.id)
    jumpTo()
  }, [input])

  const copyToClipboard = useCallback(async () => {
    try { await navigator.clipboard.writeText(output) } catch {}
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [output])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="String Builder"
      desc="Transform text with 8 built-in modes: uppercase, lowercase, title case, slug, camelCase, snake_case, reverse, and trim."
      icon="🔧" iconBg="rgba(6,182,212,0.08)"
      category="dev" slug="string-builder"
      faq={[
        { q: "What transformations are available?", a: "UPPER, lower, Title Case, slug-case, camelCase, snake_case, reverse, and trim spaces." },
        { q: "Can I chain transformations?", a: "Apply one transformation, then copy the output and paste it back as input to chain multiple transformations." },
      ]}
      howItWorks={[
        "Enter your text in the input field.",
        "Click a transformation button to apply it.",
        "Copy the transformed output or use it as new input.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "String Builder", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/string-builder/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Input Text</label>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder="Enter text to transform..."
            rows={4} className={inputClass + " resize-none font-mono"} />
        </div>

        <div className="bg-white/[0.06] border-2 border-white/8 rounded-2xl p-4">
          <p className="text-sm font-semibold text-slate-300 mb-3">Transform</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {transforms.map(t => (
              <button key={t.id} onClick={() => apply(t)}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all border-2 ${
                  activeMode === t.id
                    ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                    : 'bg-black/20 text-slate-400 border-white/8 hover:text-white hover:border-white/15'
                }`}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        {output && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Output</h3>
            </div>
            <div className="bg-black/20 rounded-xl p-4 font-mono text-sm text-white break-all mb-3">
              {output}
            </div>
            <button onClick={copyToClipboard}
              className={`w-full px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                copied ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/5 border-white/[0.08] text-slate-400 hover:text-white'
              }`}>
              {copied ? '✅ Copied!' : '📋 Copy Output'}
            </button>
          </div>
        )}

        {!output && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🔧</div>
            <p className="text-sm text-slate-600 font-medium">Enter text and click a transformation button</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
