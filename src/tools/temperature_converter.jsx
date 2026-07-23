import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const UNITS = [
  { id: 'C', label: 'Celsius', symbol: '°C' },
  { id: 'F', label: 'Fahrenheit', symbol: '°F' },
  { id: 'K', label: 'Kelvin', symbol: 'K' },
  { id: 'R', label: 'Rankine', symbol: '°R' },
]

const PRESETS = [
  { label: 'Absolute Zero', value: -273.15, unit: 'C', icon: '❄️' },
  { label: 'Freezing Point', value: 0, unit: 'C', icon: '🧊' },
  { label: 'Body Temperature', value: 37, unit: 'C', icon: '🌡️' },
  { label: 'Boiling Point', value: 100, unit: 'C', icon: '♨️' },
  { label: 'Room Temperature', value: 20, unit: 'C', icon: '🏠' },
  { label: 'Absolute Zero (°F)', value: -459.67, unit: 'F', icon: '🥶' },
]

function toCelsius(value, from) {
  switch (from) {
    case 'C': return value
    case 'F': return (value - 32) * 5 / 9
    case 'K': return value - 273.15
    case 'R': return (value - 491.67) * 5 / 9
    default: return value
  }
}

function fromCelsius(c, to) {
  switch (to) {
    case 'C': return c
    case 'F': return (c * 9 / 5) + 32
    case 'K': return c + 273.15
    case 'R': return (c + 273.15) * 9 / 5
    default: return c
  }
}

function tempColor(celsius) {
  if (celsius <= -200) return { bg: 'from-blue-900/30 to-blue-700/10', accent: 'text-blue-300', bar: 'bg-blue-400', pct: 0 }
  if (celsius <= 0) return { bg: 'from-blue-600/20 to-cyan-500/10', accent: 'text-blue-400', bar: 'bg-cyan-400', pct: 25 + (celsius + 200) / 200 * 15 }
  if (celsius <= 100) return { bg: 'from-amber-500/20 to-orange-500/10', accent: 'text-amber-400', bar: 'bg-amber-400', pct: 40 + (celsius / 100) * 30 }
  return { bg: 'from-red-600/25 to-red-400/10', accent: 'text-red-400', bar: 'bg-red-400', pct: 70 + Math.min(celsius / 1000, 0.3) * 30 }
}

function ThermometerGauge({ celsius }) {
  const { pct, bar } = tempColor(celsius)
  const clamped = Math.max(0, Math.min(100, pct))

  return (
    <div className="relative w-full h-3 rounded-full bg-white/[0.06] border border-white/8 overflow-hidden">
      <div className={`absolute inset-y-0 left-0 ${bar} rounded-full transition-all duration-500 ease-out`} style={{ width: `${clamped}%` }} />
    </div>
  )
}

function fmt(n) {
  if (Math.abs(n) >= 1e8) return n.toExponential(4)
  if (Math.abs(n) < 0.001 && n !== 0) return n.toExponential(4)
  return parseFloat(n.toPrecision(8)).toString()
}

export default function temperature_converter() {

  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [value, setValue] = useState('37')
  const [fromUnit, setFromUnit] = useState('C')
  const [converted, setConverted] = useState(null)
  const [showResults, setShowResults] = useState(false)

  const celsius = useMemo(() => toCelsius(parseFloat(value) || 0, fromUnit), [value, fromUnit])

  const doConvert = useCallback(() => {
    const v = parseFloat(value) || 0
    const results = UNITS.map(u => ({
      ...u,
      value: fromCelsius(toCelsius(v, fromUnit), u.id),
    }))
    setConverted(results)
    setShowResults(true)
  }, [value, fromUnit])

  const applyPreset = useCallback((preset) => {
    setValue(preset.value.toString())
    setFromUnit(preset.unit)
    setShowResults(false)
    setConverted(null)
  }, [])

  return (
    <ToolLayout
      title="Temperature Converter"
      desc="Convert between Celsius, Fahrenheit, Kelvin, and Rankine. See all 4 scales instantly with visual gauge."
      icon="🌡️" iconBg="rgba(239,68,68,0.08)"
      category="dev" slug="temperature-converter"
      faq={[
        { q: 'How do I convert Celsius to Fahrenheit?', a: 'Formula: °F = (°C × 9/5) + 32. Multiply the Celsius value by 1.8, then add 32.' },
        { q: 'What is absolute zero?', a: 'Absolute zero is -273.15°C / -459.67°F / 0 K / 0°R — the lowest possible temperature where all molecular motion ceases.' },
        { q: 'What are common reference temperatures?', a: 'Water freezes at 0°C (32°F), body temperature is ~37°C (98.6°F), and water boils at 100°C (212°F) at sea level.' },
        { q: 'What is Rankine?', a: 'Rankine (°R) is an absolute temperature scale using Fahrenheit degrees. It starts at absolute zero (0°R) like Kelvin but uses the Fahrenheit scale intervals.' },
      ]}
      howItWorks={[
        'Enter a temperature value in the input field.',
        'Select the source unit (Celsius, Fahrenheit, Kelvin, or Rankine).',
        'Click Convert to see the value in all 4 temperature scales.',
        'Use the quick presets for common temperatures like body temp or boiling point.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Temperature Converter", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/temperature-converter/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Quick Presets */}
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-2 block">Quick Presets</label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map(p => (
              <button key={p.label} onClick={() => applyPreset(p)}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] border border-white/8 text-slate-400 hover:text-white hover:border-white/12 transition-all">
                {p.icon} {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Value Input */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Value</label>
          <input type="number" value={value} onChange={e => { setValue(e.target.value); setShowResults(false) }}
            className="w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl px-5 py-4 text-3xl font-extrabold text-white outline-none focus:border-red-500/40 transition-all placeholder:text-white/8" />
        </div>

        {/* Unit Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-2 block">From Unit</label>
          <div className="grid grid-cols-4 gap-2">
            {UNITS.map(u => (
              <button key={u.id} onClick={() => { setFromUnit(u.id); setShowResults(false) }}
                className={`py-3 rounded-xl text-sm font-bold transition-all border-2 ${fromUnit === u.id
                  ? 'bg-red-500/15 border-red-500/30 text-red-400 shadow-lg shadow-red-500/10'
                  : 'bg-white/[0.06] border-white/8 text-slate-400 hover:border-white/12'
                }`}>
                {u.symbol}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Gauge */}
        <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/8 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500">Visual Gauge</span>
            <span className={`text-sm font-bold ${tempColor(celsius).accent}`}>
              {fmt(celsius)}°C
            </span>
          </div>
          <ThermometerGauge celsius={celsius} />
          <div className="flex justify-between text-[10px] text-slate-600">
            <span>-273°C</span><span>0°C</span><span>100°C</span><span>1000°C+</span>
          </div>
        </div>

        {/* Convert Button */}
        <button onClick={() => { doConvert(); jumpTo() }}
          className="glow-btn w-full py-3 rounded-xl text-sm font-bold"
          style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
          🌡️ Convert Temperature
        </button>

        {/* Results */}
        {showResults && converted && (
          <div ref={resultRef} className="space-y-3" style={{ animation: 'slideUp 0.3s ease-out' }}>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Conversion Results</div>
            <div className="grid grid-cols-2 gap-3">
              {converted.map(u => (
                <div key={u.id} className={`p-4 rounded-2xl border transition-all ${u.id === fromUnit
                  ? 'bg-red-500/10 border-red-500/20'
                  : 'bg-white/[0.06] border-white/8'
                }`}>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{u.label}</div>
                  <div className={`text-2xl font-extrabold ${u.id === fromUnit ? 'text-red-400' : 'text-white'}`}>
                    {fmt(u.value)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{u.symbol}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
