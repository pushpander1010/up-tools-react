import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const UNITS = [
  { key: 'psi', label: 'PSI' },
  { key: 'bar', label: 'bar' },
  { key: 'pa', label: 'Pascal (Pa)' },
  { key: 'atm', label: 'ATM' },
  { key: 'mmhg', label: 'mmHg' },
]

// All values in Pa as base
const TO_PA = { psi: 6894.76, bar: 100000, pa: 1, atm: 101325, mmhg: 133.322 }
const FROM_PA = { psi: 1/6894.76, bar: 1e-5, pa: 1, atm: 1/101325, mmhg: 1/133.322 }

export default function pressure_converter() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [value, setValue] = useState('')
  const [unit, setUnit] = useState('psi')
  const [converted, setConverted] = useState(null)

  const convert = () => {
    const v = parseFloat(value)
    if (isNaN(v)) return
    const basePa = v * TO_PA[unit]
    const results = UNITS.map(u => ({
      label: u.label,
      value: (basePa * FROM_PA[u.key]).toFixed(u.key === 'pa' ? 2 : 4)
    }))
    setConverted(results)
    jumpTo()
  }

  return (
    <ToolLayout
      title="Pressure Converter"
      desc="Convert between PSI, bar, Pascal, ATM, and mmHg instantly."
      icon="🌡️" iconBg="rgba(239,68,68,0.08)"
      category="dev" slug="pressure-converter"
      faq={[
        { q: 'What is PSI?', a: 'PSI (Pounds per Square Inch) is a unit of pressure based on the avoirdupois pound-force.' },
        { q: 'What is standard atmospheric pressure?', a: '1 ATM = 101,325 Pa = 14.696 PSI = 760 mmHg = 1.01325 bar.' },
      ]}
      howItWorks={[
        'Enter a pressure value.',
        'Select the source unit.',
        'View conversions in all units.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Pressure Converter", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/pressure-converter/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08] space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Pressure Value</label>
            <input type="number" value={value} onChange={e => setValue(e.target.value)}
              placeholder="Enter value..."
              className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-red-500/40 transition-all placeholder:text-slate-600" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Unit</label>
            <div className="flex flex-wrap gap-2">
              {UNITS.map(u => (
                <button key={u.key} onClick={() => setUnit(u.key)}
                  className={`flex-1 min-w-[60px] py-2.5 rounded-xl text-xs font-bold transition-all ${
                    unit === u.key
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : 'bg-white/[0.06] text-slate-500 border border-white/[0.08] hover:text-white'
                  }`}>
                  {u.key.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <button onClick={convert}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all"
            style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
            🌡️ Convert
          </button>
        </div>

        {converted ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-red-500/15 bg-gradient-to-br from-red-500/[0.06] via-white/[0.01] to-transparent p-6"
            style={{ animation: 'slideUp 0.35s ease-out' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider">Results</h3>
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
            <div className="text-4xl mb-3 opacity-20">🌡️</div>
            <p className="text-sm text-slate-600 font-medium">Enter a value and click Convert</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
