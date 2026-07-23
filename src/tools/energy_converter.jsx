import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const UNITS = [
  { key: 'j', label: 'Joules (J)' },
  { key: 'cal', label: 'Calories (cal)' },
  { key: 'btu', label: 'BTU' },
  { key: 'kwh', label: 'kWh' },
  { key: 'erg', label: 'Erg' },
]

// All values in Joules as base
const TO_J = { j: 1, cal: 4.184, btu: 1055.06, kwh: 3600000, erg: 1e-7 }
const FROM_J = { j: 1, cal: 0.239006, btu: 0.000947817, kwh: 1/3600000, erg: 1e7 }

export default function energy_converter() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [value, setValue] = useState('')
  const [unit, setUnit] = useState('j')
  const [converted, setConverted] = useState(null)

  const convert = () => {
    const v = parseFloat(value)
    if (isNaN(v)) return
    const baseJ = v * TO_J[unit]
    const results = UNITS.map(u => ({
      label: u.label,
      value: (baseJ * FROM_J[u.key]).toFixed(u.key === 'kwh' ? 8 : 4)
    }))
    setConverted(results)
    jumpTo()
  }

  return (
    <ToolLayout
      title="Energy Converter"
      desc="Convert between Joules, Calories, BTU, kWh, and Erg instantly."
      icon="⚡" iconBg="rgba(245,158,11,0.08)"
      category="dev" slug="energy-converter"
      faq={[
        { q: 'What is a Joule?', a: 'A Joule is the SI unit of energy. 1 Joule = 1 Newton-meter.' },
        { q: 'What is BTU?', a: 'BTU (British Thermal Unit) is the energy needed to heat 1 pound of water by 1°F.' },
      ]}
      howItWorks={[
        'Enter an energy value.',
        'Select the source unit.',
        'View conversions in all units.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Energy Converter", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/energy-converter/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08] space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Energy Value</label>
            <input type="number" value={value} onChange={e => setValue(e.target.value)}
              placeholder="Enter value..."
              className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500/40 transition-all placeholder:text-slate-600" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Unit</label>
            <div className="flex flex-wrap gap-2">
              {UNITS.map(u => (
                <button key={u.key} onClick={() => setUnit(u.key)}
                  className={`flex-1 min-w-[80px] py-2.5 rounded-xl text-xs font-bold transition-all ${
                    unit === u.key
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-white/[0.06] text-slate-500 border border-white/[0.08] hover:text-white'
                  }`}>
                  {u.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
          <button onClick={convert}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            ⚡ Convert
          </button>
        </div>

        {converted ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-amber-500/15 bg-gradient-to-br from-amber-500/[0.06] via-white/[0.01] to-transparent p-6"
            style={{ animation: 'slideUp 0.35s ease-out' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Results</h3>
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
            <div className="text-4xl mb-3 opacity-20">⚡</div>
            <p className="text-sm text-slate-600 font-medium">Enter a value and click Convert</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
