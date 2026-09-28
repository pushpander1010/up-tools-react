import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const PRESETS = [
  { label: 'Short', count: 10 },
  { label: 'Medium', count: 50 },
  { label: 'Long', count: 200 },
]

function generateInvisible(length, useZeroWidth) {
  const char = useZeroWidth ? '\u200B' : '\u3164'
  return char.repeat(length)
}

export default function invisible_text_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [preset, setPreset] = useState(50)
  const [customCount, setCustomCount] = useState('')
  const [useZeroWidth, setUseZeroWidth] = useState(false)
  const [copied, setCopied] = useState(false)

  const count = customCount ? Math.min(parseInt(customCount) || 1, 10000) : preset
  const text = generateInvisible(count, useZeroWidth)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [text])

  const handleShare = useCallback(() => {
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }, [text])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Invisible Text Generator"
      desc="Generate invisible blank text for WhatsApp, Instagram, and any app — using Hangul filler or zero-width characters."
      icon="👻" iconBg="rgba(168,85,247,0.08)"
      category="whatsapp" slug="invisible-text-generator"
      faq={[
        { q: "What is invisible text?", a: "Invisible text is made of Unicode characters that appear blank — like Hangul Filler (U+3164) or Zero-Width Space (U+200B). They look empty but take up space, useful for blank messages." },
        { q: "What's the difference between Hangul filler and zero-width?", a: "Hangul filler (U+3164) renders as a visible blank space in most apps. Zero-width space (U+200B) is truly invisible — it takes no visual space but still counts as a character." },
        { q: "Will this work on WhatsApp?", a: "Yes! Copy the invisible text and paste it into any WhatsApp chat. Some apps may trim very long blank messages." },
        { q: "How do I use this Invisible Text Generator online free?", a: "Choose a length preset or enter a custom count, pick the character type, and click Copy. Free, no sign-up, works on any device." },
      ]}
      howItWorks={[
        "Choose a character type — Hangul filler for visible blanks, zero-width for truly invisible.",
        "Select a length preset (Short/Medium/Long) or enter a custom character count.",
        "The invisible text is generated instantly with a live character count.",
        "Click Copy to clipboard, then paste it anywhere — WhatsApp, Instagram, etc.",
        "Use the WhatsApp Share button to send a blank message directly.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Invisible Text Generator", "applicationCategory": "UtilityApplication",
        "operatingSystem": "WebBrowser",
        "url": "https://www.uptools.in/invisible-text-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Character type */}
        <div>
          <label className="block text-sm font-bold text-slate-400 mb-2">Character Type</label>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setUseZeroWidth(false)}
              className={`py-3.5 rounded-xl font-semibold text-sm transition-all border-2 ${!useZeroWidth ? 'bg-purple-500/20 border-purple-500/40 text-purple-400' : 'bg-white/[0.04] border-white/8 text-slate-400 hover:border-white/15'}`}>
              <span className="block text-lg mb-1">ㅤ</span>
              Hangul Filler<br/><span className="text-xs opacity-60">U+3164</span>
            </button>
            <button onClick={() => setUseZeroWidth(true)}
              className={`py-3.5 rounded-xl font-semibold text-sm transition-all border-2 ${useZeroWidth ? 'bg-purple-500/20 border-purple-500/40 text-purple-400' : 'bg-white/[0.04] border-white/8 text-slate-400 hover:border-white/15'}`}>
              <span className="block text-lg mb-1">​</span>
              Zero-Width Space<br/><span className="text-xs opacity-60">U+200B</span>
            </button>
          </div>
        </div>

        {/* Length presets */}
        <div>
          <label className="block text-sm font-bold text-slate-400 mb-2">Length Preset</label>
          <div className="grid grid-cols-3 gap-3">
            {PRESETS.map(p => (
              <button key={p.count} onClick={() => { setPreset(p.count); setCustomCount('') }}
                className={`py-3 rounded-xl font-semibold text-sm transition-all border-2 ${preset === p.count && !customCount ? 'bg-purple-500/20 border-purple-500/40 text-purple-400' : 'bg-white/[0.04] border-white/8 text-slate-400 hover:border-white/15'}`}>
                {p.label}
                <span className="block text-xs opacity-60 mt-0.5">{p.count} chars</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom count */}
        <div>
          <label className="block text-sm font-bold text-slate-400 mb-2">Custom Count</label>
          <input type="number" value={customCount} onChange={(e) => setCustomCount(e.target.value)}
            placeholder="1 – 10,000" min="1" max="10000" className={inputClass} />
        </div>

        {/* Live preview */}
        <div ref={resultRef} className="rounded-3xl border-2 border-purple-500/15 bg-gradient-to-br from-purple-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider">Preview</h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">{count} chars</span>
          </div>
          <div className="min-h-[80px] p-4 rounded-xl bg-white/[0.04] border border-white/5 mb-4 break-all text-sm text-slate-300 font-mono">
            {text}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={handleCopy}
              className={`py-3 rounded-xl font-bold text-sm transition-all ${copied ? 'bg-green-500 text-white' : 'bg-purple-500 text-white hover:bg-purple-400'}`}>
              {copied ? '✓ Copied!' : '📋 Copy Text'}
            </button>
            <button onClick={handleShare}
              className="py-3 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-500 transition-all">
              💬 WhatsApp Share
            </button>
          </div>
        </div>

        {/* Warning */}
        <div className="rounded-xl bg-amber-500/[0.08] border border-amber-500/15 p-4 text-sm text-amber-400/80">
          ⚠️ Some apps (Twitter, certain chat apps) may trim or strip invisible characters. If the message appears empty on the receiving end, try a shorter length or Hangul filler instead of zero-width.
        </div>
      </div>
    </ToolLayout>
  )
}
