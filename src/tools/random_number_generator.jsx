import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function random_number_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [min, setMin] = useState('1')
  const [max, setMax] = useState('100')
  const [count, setCount] = useState('1')
  const [results, setResults] = useState(null)

  const generate = useCallback(() => {
    const mn = parseInt(min) || 1
    const mx = parseInt(max) || 100
    const cnt = parseInt(count) || 1
    if (mn > mx) return
    const nums = []
    for (let i = 0; i < cnt; i++) {
      const arr = new Uint32Array(1)
      crypto.getRandomValues(arr)
      nums.push(mn + arr[0] % (mx - mn + 1))
    }
    setResults(nums)
    jumpTo()
  }, [min, max, count, jumpTo])

  return (
    <ToolLayout
      title="Random Number Generator"
      desc="Generate cryptographically secure random numbers. Choose range and count."
      icon="🔢" iconBg="rgba(99,102,241,0.08)"
      category="dev" slug="random-number-generator"
      faq={[
        { q: 'Is this truly random?', a: 'Yes. It uses the Web Crypto API (crypto.getRandomValues) which is cryptographically secure.' },
        { q: 'What is the range?', a: 'You set the minimum and maximum. The generator produces integers within that inclusive range.' },
      ]}
      howItWorks={[
        'Set the minimum and maximum values.',
        'Choose how many numbers to generate.',
        'Click Generate for cryptographically secure random numbers.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Random Number Generator", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/random-number-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08] space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Min</label>
              <input type="number" value={min} onChange={e => setMin(e.target.value)}
                className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-500/40 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Max</label>
              <input type="number" value={max} onChange={e => setMax(e.target.value)}
                className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-500/40 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Count</label>
              <input type="number" value={count} onChange={e => setCount(e.target.value)}
                min="1" max="100"
                className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-500/40 transition-all" />
            </div>
          </div>
          <button onClick={generate}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            🔢 Generate
          </button>
        </div>

        {results ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6"
            style={{ animation: 'slideUp 0.35s ease-out' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Results</h3>
            </div>
            {results.length === 1 ? (
              <div className="text-5xl font-extrabold text-white text-center py-4">{results[0]}</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {results.map((n, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-indigo-500/15 text-indigo-300 text-sm font-mono font-bold">
                    {n}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.02]">
            <div className="text-4xl mb-3 opacity-20">🔢</div>
            <p className="text-sm text-slate-600 font-medium">Set range and count, then click Generate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
