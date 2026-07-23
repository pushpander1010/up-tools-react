import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function whatsapp_font_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [input, setInput] = useState('Hello WhatsApp!')
  const [copied, setCopied] = useState(null)

  const styles = [
    { key: 'bold', label: 'Bold', syntax: '*text*', wrap: t => `*${t}*` },
    { key: 'italic', label: 'Italic', syntax: '_text_', wrap: t => `_${t}_` },
    { key: 'strike', label: 'Strikethrough', syntax: '~text~', wrap: t => `~${t}~` },
    { key: 'mono', label: 'Monospace', syntax: '```text```', wrap: t => '```' + t + '```' },
    { key: 'boldItalic', label: 'Bold + Italic', syntax: '*_text_*', wrap: t => `*_${t}_*` },
    { key: 'all', label: 'All Styles', syntax: '*_~text~_*', wrap: t => `*_~${t}~_*` },
  ]

  const copy = useCallback((type, text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type)
      setTimeout(() => setCopied(null), 1500)
    })
  }, [])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="WhatsApp Font Generator"
      desc="Generate styled text for WhatsApp: bold, italic, strikethrough, monospace. Copy and paste into your chats!"
      icon="✍️" iconBg="rgba(37,211,102,0.08)"
      category="whatsapp" slug="whatsapp-font-generator"
      faq={[
        { q: "How do I make text bold in WhatsApp?", a: "Wrap your text with asterisks: *bold text*. Or use this tool to generate it automatically." },
        { q: "Can I combine multiple text styles in WhatsApp?", a: "Yes! You can combine bold, italic, and strikethrough. For example: *_~text~_* creates bold, italic, and strikethrough." },
        { q: "Does WhatsApp font formatting work on all devices?", a: "Yes, WhatsApp text formatting works on Android, iOS, and WhatsApp Web across all devices." },
      ]}
      howItWorks={[
        "Type your message in the input field.",
        "All formatted versions are generated instantly.",
        "Click the Copy button to copy any style to your clipboard.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "WhatsApp Font Generator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/whatsapp-font-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Enter Your Text</label>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder="Type your message here..."
            rows={3}
            className={inputClass + " resize-vertical"} />
        </div>

        <div ref={resultRef} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {styles.map(s => {
            const formatted = s.wrap(input || 'Hello WhatsApp!')
            return (
              <div key={s.key} className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-4 space-y-2">
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{s.label}</div>
                <div className="text-white font-mono text-sm break-all leading-relaxed">{formatted}</div>
                <button onClick={() => { copy(s.key, formatted); jumpTo() }}
                  className={`w-full py-2 rounded-xl text-xs font-semibold transition-all ${
                    copied === s.key
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-white/5 border border-white/8 text-slate-400 hover:text-white'
                  }`}>
                  {copied === s.key ? '✓ Copied' : '📋 Copy'}
                </button>
              </div>
            )
          })}
        </div>

        <div className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-5">
          <h3 className="text-sm font-bold text-slate-300 mb-3">⌨️ WhatsApp Formatting Shortcuts</h3>
          <div className="space-y-2 text-sm">
            {[
              ['Bold', '*text*', '*bold*'],
              ['Italic', '_text_', '_italic_'],
              ['Strikethrough', '~text~', '~strike~'],
              ['Monospace', '```text```', '```mono```'],
            ].map(([style, syntax, example]) => (
              <div key={style} className="flex items-center justify-between text-slate-400">
                <span className="font-semibold text-slate-300">{style}</span>
                <code className="text-xs bg-white/[0.06] px-2 py-1 rounded">{syntax}</code>
                <span className="font-mono text-xs">{example}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
