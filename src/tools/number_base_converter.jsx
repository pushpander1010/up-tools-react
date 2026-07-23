import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const BASES = [
  { value: '2', label: 'Binary', icon: '💻', placeholder: '1010' },
  { value: '8', label: 'Octal', icon: '🔢', placeholder: '52' },
  { value: '10', label: 'Decimal', icon: '🔟', placeholder: '42' },
  { value: '16', label: 'Hexadecimal', icon: 'hex', placeholder: '2A' },
]

export default function number_base_converter() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [input, setInput] = useState('')
  const [fromBase, setFromBase] = useState('10')
  const [toBase, setToBase] = useState('2')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const convert = useCallback(() => {
    if (!input.trim()) { setError('Enter a number'); setResult(null); return }
    try {
      const num = parseInt(input.trim(), parseInt(fromBase))
      if (isNaN(num)) throw new Error('Invalid number for this base')
      if (num < 0) throw new Error('Only positive numbers supported')
      const converted = num.toString(parseInt(toBase)).toUpperCase()
      setResult({ value: converted, decimal: num.toString() })
      setError('')
    } catch (e) {
      setError(e.message)
      setResult(null)
    }
  }, [input, fromBase, toBase])

  const [copied, setCopied] = useState(false)
  const copy = () => {
    if (!result) return
    navigator.clipboard.writeText(result.value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const swap = () => {
    setFromBase(toBase)
    setToBase(fromBase)
    if (result) { setInput(result.value); setResult(null) }
  }

  return (
    <ToolLayout
      title="Number Base Converter"
      desc="Convert between Binary, Octal, Decimal, and Hexadecimal instantly."
      icon="🔢" iconBg="rgba(99,102,241,0.08)"
      category="dev" slug="number-base-converter"
      faq={[
        { q: 'What is a number base?', a: 'A base (or radix) is the number of unique digits used to represent values. Binary=2, Octal=8, Decimal=10, Hex=16.' },
        { q: 'What is hexadecimal?', a: 'Base-16 using digits 0–9 and letters A–F. Commonly used in color codes (#FF5733), memory addresses, and CSS.' },
        { q: 'What is binary?', a: 'Base-2 using only 0 and 1. The fundamental language of computers and digital electronics.' },
      ]}
      howItWorks={[
        'Enter a number in the input field.',
        'Select the base you are converting FROM.',
        'Select the base you are converting TO.',
        'View the converted result instantly.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Number Base Converter", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/number-base-converter/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <label className="text-xs font-semibold text-slate-500 mb-2 block">Number</label>
          <input type="text" value={input} onChange={e => { setInput(e.target.value); setError(''); setResult(null) }}
            placeholder={BASES.find(b => b.value === fromBase)?.placeholder || '0'}
            className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm font-mono text-white outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600" />
        </div>

        {/* From / To + Swap */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
            <label className="text-xs font-semibold text-slate-500 mb-2 block">From</label>
            <select value={fromBase} onChange={e => setFromBase(e.target.value)}
              className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/40">
              {BASES.map(b => <option key={b.value} value={b.value} className="bg-gray-900">{b.icon} {b.label} ({b.value})</option>)}
            </select>
          </div>
          <button onClick={swap}
            className="px-3 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all text-lg mb-0.5">
            ⇄
          </button>
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
            <label className="text-xs font-semibold text-slate-500 mb-2 block">To</label>
            <select value={toBase} onChange={e => setToBase(e.target.value)}
              className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/40">
              {BASES.map(b => <option key={b.value} value={b.value} className="bg-gray-900">{b.icon} {b.label} ({b.value})</option>)}
            </select>
          </div>
        </div>

        {/* Convert Button */}
        <button onClick={() => { convert(); jumpTo() }}
          className="glow-btn px-6 py-3 rounded-xl text-sm w-full"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
          🔢 Convert
        </button>

        {/* Error */}
        {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">❌ {error}</div>}

        {/* Result */}
        {result && (
          <div ref={resultRef} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4"
            style={{ animation: 'slideUp 0.3s ease-out' }}>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-slate-500">Result ({BASES.find(b => b.value === toBase)?.label})</label>
              <button onClick={copy}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/[0.08] text-slate-400 hover:text-white'}`}>
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
            </div>
            <div className="bg-black/20 border-2 border-indigo-500/20 rounded-xl p-5 text-center">
              <div className="text-3xl font-extrabold text-indigo-400 font-mono break-all">{result.value}</div>
              <div className="text-xs text-slate-500 mt-2">Decimal: {result.decimal}</div>
            </div>
          </div>
        )}

        {!result && !error && (
          <div ref={resultRef} className="text-center py-12 rounded-2xl border-2 border-dashed border-white/[0.08] bg-white/[0.02]">
            <div className="text-4xl mb-3 opacity-20">🔢</div>
            <p className="text-sm text-slate-600 font-medium">Enter a number and click Convert</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
