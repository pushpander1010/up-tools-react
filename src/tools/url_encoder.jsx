import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'

export default function url_encoder() {

  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [input, setInput] = useState('')
  const [mode, setMode] = useState('encode')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const process = () => {
    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input))
      } else {
        setOutput(decodeURIComponent(input))
      }
      setError('')
    } catch (e) {
      setError('Invalid input for decoding')
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
      title="URL Encoder / Decoder"
      desc="Encode special characters for URLs or decode encoded URLs back to readable text."
      icon="🔗" iconBg="rgba(6,182,212,0.08)"
      category="dev" slug="url-encoder"
      faq={[
        { q: 'When do I need URL encoding?', a: 'When passing special characters in URLs — spaces become %20, Chinese characters become %E4..., etc.' },
        { q: 'What characters are encoded?', a: 'Spaces, Chinese/Japanese characters, symbols like !, @, #, $, &, +, =, and more.' },
      ]}
      howItWorks={[
        'Choose Encode or Decode mode.',
        'Paste your text or encoded URL.',
        'Click the process button.',
        'Copy the result.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "URL Encoder Decoder", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/url-encoder/",
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
          placeholder={mode === 'encode' ? 'Enter text or URL to encode...' : 'Enter encoded URL to decode...'}
          rows={4}
          className="w-full bg-black/20 border-2 border-white/8 rounded-2xl px-5 py-4 text-sm font-mono outline-none focus:border-cyan-500/40 transition-all placeholder:text-slate-600 resize-none" />

        {/* Process Button */}
        <button onClick={() => {process(); jumpTo()}}
          className="glow-btn w-full py-3 rounded-xl text-sm"
          style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
          {mode === 'encode' ? '🔒 Encode URL' : '🔓 Decode URL'}
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
            <textarea value={output} readOnly rows={3}
              className="w-full bg-black/20 border-2 border-emerald-500/20 rounded-2xl px-5 py-4 text-sm font-mono text-emerald-400 resize-none" />
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
