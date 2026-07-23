import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const UNITS = [
  { key: 'kgm3', label: 'kg/m³' },
  { key: 'gcm3', label: 'g/cm³' },
  { key: 'lbft3', label: 'lb/ft³' },
  { key: 'lbin3', label: 'lb/in³' },
]

// All values in kg/m³ as base
const TO_KGM3 = { kgm3: 1, gcm3: 1000, lbft3: 16.0185, lbin3: 27679.9 }
const FROM_KGM3 = { kgm3: 1, gcm3: 0.001, lbft3: 0.0624279, lbin3: 0.0000361273 }

export default function density_converter() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [value, setValue] = useState('')
  const [unit, setUnit] = useState('kgm3')
  const [converted, setConverted] = useState(null)

  const convert = () => {
    const v = parseFloat(value)
    if (isNaN(v)) return
    const baseKgm3 = v * TO_KGM3[unit]
    const results = UNITS.map(u => ({
      label: u.label,
      value: (baseKgm3 * FROM_KGM3[u.key]).toFixed(u.key === 'lbin3' ? 6 : 4)
    }))
    setConverted(results)
    jumpTo()
  }

  return (
    <ToolLayout
      title="Density Converter"
      desc="Convert between kg/m³, g/cm³, lb/ft³, and lb/in³ instantly."
      icon="⚖️" iconBg="rgba(99,102,241,0.08)"
      category="dev" slug="density-converter"
      faq={[
        { q: 'What is density?', a: 'Density is mass per unit volume. It measures how compact a substance is.' },
        { q: 'Which unit should I use?', a: 'kg/m³ is SI standard, g/cm³ is common in chemistry, lb/ft³ in engineering.' },
      ]}
      howItWorks={[
        'Enter a density value.',
        'Select the source unit.',
        'View the converted values in all units.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Density Converter", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/density-converter/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08] space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Density Value</label>
            <input type="number" value={value} onChange={e => setValue(e.target.value)}
              placeholder="Enter value..."
              className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Unit</label>
            <div className="flex gap-2">
              {UNITS.map(u => (
                <button key={u.key} onClick={() => setUnit(u.key)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    unit === u.key
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40'
                      : 'bg-white/[0.06] text-slate-500 border border-white/[0.08] hover:text-white'
                  }`}>
                  {u.label}
                </button>
              ))}
            </div>
          </div>
          <button onClick={convert}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            ⚖️ Convert
          </button>
        </div>

        {converted ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6"
            style={{ animation: 'slideUp 0.35s ease-out' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Results</h3>
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
            <div className="text-4xl mb-3 opacity-20">⚖️</div>
            <p className="text-sm text-slate-600 font-medium">Enter a value and click Convert</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
