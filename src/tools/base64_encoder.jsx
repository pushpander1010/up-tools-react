import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'

export default function base64_encoder() {

  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [input, setInput] = useState('')
  const [mode, setMode] = useState('encode')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const process = () => {
    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))))
      } else {
        setOutput(decodeURIComponent(escape(atob(input))))
      }
      setError('')
    } catch (e) {
      setError(mode === 'decode' ? 'Invalid Base64 string' : e.message)
      setOutput('')
    }
  }

  const copy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <ToolLayout
      title="Base64 Encoder & Decoder"
      desc="Encode text to Base64 or decode Base64 strings back to text. Works with Unicode."
      icon="🧬" iconBg="rgba(6,182,212,0.08)"
      category="dev" slug="base64-encoder"
      faq={[
        { q: 'What is Base64?', a: 'A encoding scheme that converts binary data to ASCII text, commonly used in email, URLs, and data URLs.' },
        { q: 'Why use Base64?', a: 'To safely transmit binary data over text-based protocols like HTTP, email, or JSON.' },
      ]}
      howItWorks={[
        'Choose Encode or Decode mode.',
        'Paste your text (encode) or Base64 string (decode).',
        'Click the process button.',
        'Copy the result.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Base64 Encoder Decoder", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/base64-encoder/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Mode Toggle */}
        <div className="flex gap-2">
          {['encode', 'decode'].map(m => (
            <button key={m} onClick={() => { setMode(m); setOutput(''); setError('') }}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === m ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' : 'bg-white/[0.06] text-slate-500 border border-white/8'}`}>
              {m === 'encode' ? '🔒 Encode' : '🔓 Decode'}
            </button>
          ))}
        </div>

        {/* Input */}
        <textarea value={input} onChange={e => { setInput(e.target.value); setError('') }}
          placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 string to decode...'}
          rows={6}
          className="w-full bg-black/20 border-2 border-white/8 rounded-2xl px-5 py-4 text-sm font-mono outline-none focus:border-cyan-500/40 transition-all placeholder:text-slate-600 resize-none" />

        {/* Process Button */}
        <button onClick={() => {process(); jumpTo()}}
          className="glow-btn px-6 py-3 rounded-xl text-sm w-full"
          style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
          {mode === 'encode' ? '🔒 Encode to Base64' : '🔓 Decode from Base64'}
        </button>

        {/* Error */}
        {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">❌ {error}</div>}

        {/* Output */}
        {output && (
          <div className="space-y-2" style={{ animation: 'slideUp 0.3s ease-out' }}>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-500">Output</label>
              <button onClick={copy}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/8 text-slate-400 hover:text-white'}`}>
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
            </div>
            <textarea value={output} readOnly rows={6}
              className="w-full bg-black/20 border-2 border-emerald-500/20 rounded-2xl px-5 py-4 text-sm font-mono text-emerald-400 resize-none" />
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
