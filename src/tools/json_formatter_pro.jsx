import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function json_formatter_pro() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState(null)
  const [copied, setCopied] = useState(false)

  const process = (action) => {
    let text = input.trim()
    if (!text) { setStatus({ ok: false, msg: 'Please enter some JSON data' }); return }
    try {
      const parsed = JSON.parse(text)
      if (action === 'format') {
        setOutput(JSON.stringify(parsed, null, 2))
        setStatus({ ok: true, msg: '✅ Valid — formatted with 2-space indent' })
      } else if (action === 'minify') {
        setOutput(JSON.stringify(parsed))
        setStatus({ ok: true, msg: '✅ Valid — minified' })
      } else {
        setOutput('')
        setStatus({ ok: true, msg: '✅ Valid JSON' })
      }
    } catch (e) {
      setOutput('')
      setStatus({ ok: false, msg: '❌ ' + e.message })
    }
  }

  const copy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <ToolLayout
      title="JSON Formatter Pro"
      desc="Format, validate, and minify JSON data instantly. Pretty-print nested JSON, catch syntax errors."
      icon="🛠️" iconBg="rgba(6,182,212,0.08)"
      category="dev" slug="json-formatter-pro"
      faq={[
        { q: 'What can I do with this tool?', a: 'Format (pretty-print), minify (compress), and validate JSON data instantly.' },
        { q: 'What if my JSON has errors?', a: 'The tool shows the exact error message so you can fix your JSON.' },
      ]}
      howItWorks={[
        'Paste your JSON data in the input area.',
        'Click Format to pretty-print, Minify to compress, or Validate to check.',
        'Copy the formatted output to clipboard.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "JSON Formatter Pro", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/json-formatter-pro/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">JSON Input</label>
          <textarea value={input} onChange={e => { setInput(e.target.value); setStatus(null) }}
            placeholder='Paste JSON here... {"key": "value"}'
            rows={10}
            className="w-full bg-black/20 border-2 border-white/8 rounded-2xl px-5 py-4 text-sm text-white font-mono outline-none focus:border-cyan-500/40 transition-all placeholder:text-slate-600 resize-none" />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => { process('format'); jumpTo() }}
            className="glow-btn px-5 py-2.5 rounded-xl text-sm"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
            ✨ Format
          </button>
          <button onClick={() => { process('minify'); jumpTo() }}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/5 border border-white/8 text-slate-400 hover:text-white transition-all">
            📦 Minify
          </button>
          <button onClick={() => process('validate')}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/5 border border-white/8 text-slate-400 hover:text-white transition-all">
            ✅ Validate
          </button>
        </div>

        {/* Status */}
        {status && (
          <div className={`p-3 rounded-xl text-sm font-medium ${status.ok ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
            {status.msg}
          </div>
        )}

        {/* Output */}
        {output && (
          <div ref={resultRef} className="space-y-2" style={{ animation: 'slideUp 0.3s ease-out' }}>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-500">Output</label>
              <button onClick={copy}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/8 text-slate-400 hover:text-white'}`}>
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
            </div>
            <textarea value={output} readOnly rows={12}
              className="w-full bg-black/20 border-2 border-emerald-500/20 rounded-2xl px-5 py-4 text-sm font-mono text-emerald-400 resize-none" />
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
