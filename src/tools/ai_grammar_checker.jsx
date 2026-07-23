import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'
import useAIStream from '../hooks/useAIStream'

export default function ai_grammar_checker() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const { output, status, streaming, generate, stop } = useAIStream()
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(false)

  const wordCount = input.trim() ? (input.trim().match(/\S+/g) || []).length : 0
  const charCount = input.length

  const handleCheck = useCallback(() => {
    const text = input.trim()
    if (!text) return
    if (text.length > 30000) return

    generate({
      messages: [{
        role: 'user',
        content: `Check and correct the following text. Output:\n1. CORRECTED TEXT: (the full corrected version)\n2. CHANGES MADE: (numbered list of each correction with explanation)\n\nText to check:\n\n${text}`
      }],
      temperature: 0.2,
      systemPrompt: 'You are an expert English grammar checker and editor. Fix all grammar, spelling, punctuation, and style issues. First output the fully corrected text, then list each change made with a brief explanation.',
    })
    jumpTo()
  }, [input, generate, jumpTo])

  const copy = () => {
    if (!output) return
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const clear = () => { setInput('') }

  const inputClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 resize-none"

  return (
    <ToolLayout
      title="AI Grammar Checker"
      desc="Fix grammar, spelling, punctuation and style issues instantly. Paste or type your text and get a corrected version with detailed explanations."
      icon="✅" iconBg="rgba(34,197,94,0.08)"
      category="ai" slug="ai-grammar-checker"
      faq={[
        { q: "Is the grammar checker free?", a: "Yes, completely free with no sign-up required. Powered by AI via a secure server-side proxy." },
        { q: "What languages does it support?", a: "It works best with English but can handle other languages as well." },
        { q: "How much text can I check?", a: "Up to 30,000 characters per check." },
      ]}
      howItWorks={[
        "Paste or type your text into the input area.",
        "Click Check Grammar to stream the AI-corrected version.",
        "Review the corrected text and list of changes made.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "AI Grammar Checker", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/ai-grammar-checker/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Input Section */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-slate-300">Your Text *</label>
            <div className="flex gap-3 text-xs text-slate-500">
              <span>Words: {wordCount}</span>
              <span>Chars: {charCount}</span>
            </div>
          </div>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder="Paste or type your text here..."
            rows={8} className={inputClass} />
          <div className="flex gap-2">
            <button onClick={clear}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white/[0.04] border border-white/[0.08] text-slate-500 hover:text-white transition-all">
              Clear
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          {streaming ? (
            <button onClick={stop}
              className="flex-1 px-6 py-3 rounded-xl text-sm font-bold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all">
              ⏹ Stop
            </button>
          ) : (
            <button onClick={handleCheck} disabled={!input.trim()}
              className="flex-1 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
              ✅ Check Grammar
            </button>
          )}
          <button onClick={copy} disabled={!output}
            className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all disabled:opacity-40 ${copied ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/[0.06] border-white/[0.08] text-slate-400 hover:text-white'}`}>
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
        </div>

        {/* Status */}
        {status && (
          <div className={`p-3 rounded-xl text-sm ${status.includes('Error') ? 'bg-red-500/10 border border-red-500/20 text-red-400' : status.includes('Done') ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-white/[0.06] border border-white/[0.08] text-slate-400'}`}>
            {status}
          </div>
        )}

        {/* Output */}
        <div ref={resultRef} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          {output ? (
            <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">{output}</pre>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-3 opacity-20">✅</div>
              <p className="text-sm text-slate-600 font-medium">Corrected text will stream here…</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
