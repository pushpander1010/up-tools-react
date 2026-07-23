import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const UNITS = [
  { key: 'w', label: 'Watts (W)' },
  { key: 'hp', label: 'Horsepower (hp)' },
  { key: 'kw', label: 'Kilowatts (kW)' },
  { key: 'btuh', label: 'BTU/h' },
]

// All values in Watts as base
const TO_W = { w: 1, hp: 745.7, kw: 1000, btuh: 0.293071 }
const FROM_W = { w: 1, hp: 0.00134102, kw: 0.001, btuh: 3.41214 }

export default function power_converter() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [value, setValue] = useState('')
  const [unit, setUnit] = useState('w')
  const [converted, setConverted] = useState(null)

  const convert = () => {
    const v = parseFloat(value)
    if (isNaN(v)) return
    const baseW = v * TO_W[unit]
    const results = UNITS.map(u => ({
      label: u.label,
      value: (baseW * FROM_W[u.key]).toFixed(4)
    }))
    setConverted(results)
    jumpTo()
  }

  return (
    <ToolLayout
      title="Power Converter"
      desc="Convert between Watts, Horsepower, Kilowatts, and BTU/h instantly."
      icon="🔌" iconBg="rgba(236,72,153,0.08)"
      category="dev" slug="power-converter"
      faq={[
        { q: 'What is a Watt?', a: 'A Watt is the SI unit of power, equal to 1 Joule per second.' },
        { q: 'What is horsepower?', a: 'Horsepower is a unit of power. 1 hp ≈ 745.7 Watts.' },
      ]}
      howItWorks={[
        'Enter a power value.',
        'Select the source unit.',
        'View conversions in all units.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Power Converter", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/power-converter/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08] space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Power Value</label>
            <input type="number" value={value} onChange={e => setValue(e.target.value)}
              placeholder="Enter value..."
              className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-pink-500/40 transition-all placeholder:text-slate-600" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Unit</label>
            <div className="flex gap-2">
              {UNITS.map(u => (
                <button key={u.key} onClick={() => setUnit(u.key)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    unit === u.key
                      ? 'bg-pink-500/20 text-pink-400 border border-pink-500/40'
                      : 'bg-white/[0.06] text-slate-500 border border-white/[0.08] hover:text-white'
                  }`}>
                  {u.key.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <button onClick={convert}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all"
            style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}>
            🔌 Convert
          </button>
        </div>

        {converted ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-pink-500/15 bg-gradient-to-br from-pink-500/[0.06] via-white/[0.01] to-transparent p-6"
            style={{ animation: 'slideUp 0.35s ease-out' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
              <h3 className="text-sm font-bold text-pink-400 uppercase tracking-wider">Results</h3>
            </div>
            <div className="space-y-2">
              {converted.map((r, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                  <span className="text-sm text-slate-400">{r.label}</span>
                  <span className="text-sm font-mono font-bold text-white">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.02]">
            <div className="text-4xl mb-3 opacity-20">🔌</div>
            <p className="text-sm text-slate-600 font-medium">Enter a value and click Convert</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
