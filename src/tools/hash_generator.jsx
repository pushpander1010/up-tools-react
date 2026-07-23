import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const ALGOS = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']
const ALGO_COLORS = {
  'SHA-1': 'text-indigo-400',
  'SHA-256': 'text-cyan-400',
  'SHA-384': 'text-purple-400',
  'SHA-512': 'text-amber-400',
}

export default function hash_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [input, setInput] = useState('')
  const [hashes, setHashes] = useState({})
  const [copied, setCopied] = useState(null)
  const [loading, setLoading] = useState(false)

  const generate = useCallback(async () => {
    if (!input.trim()) return
    setLoading(true)
    try {
      const d = new TextEncoder().encode(input)
      const results = {}
      for (const algo of ALGOS) {
        const buf = await crypto.subtle.digest(algo, d)
        results[algo] = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
      }
      setHashes(results)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }, [input])

  const copyHash = (algo) => {
    navigator.clipboard.writeText(hashes[algo])
    setCopied(algo)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <ToolLayout
      title="Hash Generator"
      desc="Generate SHA-1, SHA-256, SHA-384, SHA-512 hashes from any text. Free online tool."
      icon="🔐" iconBg="rgba(99,102,241,0.08)"
      category="dev" slug="hash-generator"
      faq={[
        { q: 'What hashing algorithms are supported?', a: 'SHA-1, SHA-256, SHA-384, and SHA-512 — all computed using the browser\'s built-in Web Crypto API.' },
        { q: 'Is my data private?', a: 'Yes. All hashing happens locally in your browser. No data is sent to any server.' },
      ]}
      howItWorks={[
        'Enter the text you want to hash.',
        'Click Generate Hashes.',
        'All four hash values appear instantly.',
        'Click any copy button to copy a specific hash.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Hash Generator", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/hash-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Enter text to hash</label>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder="Type or paste your text here..."
            rows={3}
            className="w-full bg-black/20 border-2 border-white/8 rounded-2xl px-5 py-4 text-sm text-white font-mono outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 resize-none" />
        </div>

        {/* Generate Button */}
        <button onClick={() => { generate(); jumpTo() }}
          disabled={loading}
          className="glow-btn px-6 py-3 rounded-xl text-sm w-full disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
          {loading ? '⏳ Computing...' : '🔐 Generate Hashes'}
        </button>

        {/* Results */}
        <div ref={resultRef} className="space-y-3">
          {Object.entries(hashes).map(([algo, hash]) => (
            <div key={algo} className="p-4 rounded-xl bg-white/[0.05] border border-white/8">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-bold ${ALGO_COLORS[algo]}`}>{algo}</span>
                <button onClick={() => copyHash(algo)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${copied === algo ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/8 text-slate-400 hover:text-white'}`}>
                  {copied === algo ? '✓ Copied' : '📋 Copy'}
                </button>
              </div>
              <div className="text-xs text-slate-300 font-mono break-all leading-relaxed bg-black/20 rounded-lg p-3">
                {hash}
              </div>
            </div>
          ))}
          {Object.keys(hashes).length === 0 && (
            <div className="text-center py-8 rounded-2xl border-2 border-dashed border-white/8 bg-white/[0.01]">
              <div className="text-4xl mb-3 opacity-20">🔐</div>
              <p className="text-sm text-slate-600 font-medium">Enter text and click Generate</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
