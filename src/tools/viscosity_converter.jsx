import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function viscosity_converter() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [value, setValue] = useState('')
  const [unit, setUnit] = useState('cP')
  const [result, setResult] = useState(null)

  const convert = useCallback(() => {
    const visc = parseFloat(value)
    if (isNaN(visc) || visc === 0) return

    let cP, St, P, Pas
    if (unit === 'cP') {
      cP = visc; P = visc / 100; Pas = visc / 1000; St = Pas / 1000
    } else if (unit === 'St') {
      St = visc; Pas = visc * 1000; cP = Pas * 1000; P = cP / 100
    } else if (unit === 'P') {
      P = visc; cP = visc * 100; Pas = visc / 10; St = Pas / 1000
    } else {
      Pas = visc; cP = visc * 1000; P = visc * 10; St = visc / 1000
    }

    setResult({ cP, St, P, Pas })
  }, [value, unit])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"
  const selectClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"

  return (
    <ToolLayout
      title="Viscosity Converter"
      desc="Convert viscosity units: Centipoise, Stokes, poise, Pa·s. Instant conversions."
      icon="🧴" iconBg="rgba(6,182,212,0.08)"
      category="converter" slug="viscosity-converter"
      faq={[
        { q: "What units can I convert?", a: "Centipoise (cP), Stokes (St), Poise (P), and Pascal-second (Pa·s)." },
        { q: "Is it accurate?", a: "Yes. All conversions use standard physics formulas and run entirely in your browser." },
      ]}
      howItWorks={[
        "Enter a viscosity value and select the source unit.",
        "Click Convert to see all equivalent values.",
        "Results show the value in all four viscosity units.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Viscosity Converter", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/viscosity-converter/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Enter Viscosity</label>
          <input type="number" value={value} onChange={e => setValue(e.target.value)}
            placeholder="e.g., 1" step="0.01"
            className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">From Unit</label>
          <select value={unit} onChange={e => setUnit(e.target.value)} className={selectClass}>
            <option value="cP">Centipoise (cP)</option>
            <option value="St">Stokes (St)</option>
            <option value="P">Poise (P)</option>
            <option value="Pas">Pascal-second (Pa·s)</option>
          </select>
        </div>

        <button onClick={() => { convert(); jumpTo() }}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
          🔄 Convert
        </button>

        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Conversion Results</h3>
            </div>
            <div className="space-y-3">
              {[
                ['Centipoise (cP)', result.cP.toFixed(4)],
                ['Stokes (St)', result.St.toFixed(6)],
                ['Poise (P)', result.P.toFixed(4)],
                ['Pascal-second (Pa·s)', result.Pas.toFixed(4)],
              ].map(([label, val]) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <span className="text-sm text-slate-400">{label}</span>
                  <span className="text-sm font-bold text-white">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🧴</div>
            <p className="text-sm text-slate-600 font-medium">Enter a value and click Convert</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
