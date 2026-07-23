import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const UNITS = [
  { id: 'kmh', label: 'Kilometers per Hour', symbol: 'km/h' },
  { id: 'mph', label: 'Miles per Hour', symbol: 'mph' },
  { id: 'knots', label: 'Knots', symbol: 'kn' },
  { id: 'ms', label: 'Meters per Second', symbol: 'm/s' },
  { id: 'fts', label: 'Feet per Second', symbol: 'ft/s' },
]

// Conversion factors: all relative to km/h as base
const TO_KMH = {
  kmh: 1,
  mph: 1.60934,
  knots: 1.852,
  ms: 3.6,
  fts: 1.09728,
}

const FROM_KMH = {
  kmh: 1,
  mph: 0.621371,
  knots: 0.539957,
  ms: 1 / 3.6,
  fts: 0.911344,
}

const PRESETS = [
  { label: 'Walking', value: 5, unit: 'kmh', icon: '🚶' },
  { label: 'City Speed', value: 50, unit: 'kmh', icon: '🚗' },
  { label: 'Highway', value: 100, unit: 'kmh', icon: '🛣️' },
  { label: 'US Highway', value: 65, unit: 'mph', icon: '🇺🇸' },
  { label: 'Speed of Sound', value: 1235, unit: 'kmh', icon: '🔊' },
  { label: 'Bullet Train', value: 320, unit: 'kmh', icon: '🚄' },
  { label: 'Light (1%)', value: 3000, unit: 'kmh', icon: '⚡' },
]

function toKmh(value, from) {
  return value * TO_KMH[from]
}

function fromKmh(kmh, to) {
  return kmh * FROM_KMH[to]
}

function speedColor(kmh) {
  if (kmh <= 10) return { bg: 'from-green-500/20 to-emerald-500/10', accent: 'text-green-400', bar: 'bg-green-400', label: 'Slow' }
  if (kmh <= 60) return { bg: 'from-cyan-500/20 to-blue-500/10', accent: 'text-cyan-400', bar: 'bg-cyan-400', label: 'Moderate' }
  if (kmh <= 150) return { bg: 'from-amber-500/20 to-orange-500/10', accent: 'text-amber-400', bar: 'bg-amber-400', label: 'Fast' }
  if (kmh <= 500) return { bg: 'from-orange-500/20 to-red-500/10', accent: 'text-orange-400', bar: 'bg-orange-400', label: 'Very Fast' }
  return { bg: 'from-red-600/25 to-purple-500/10', accent: 'text-red-400', bar: 'bg-red-400', label: 'Extreme' }
}

function fmt(n) {
  if (Math.abs(n) >= 1e8) return n.toExponential(4)
  if (Math.abs(n) < 0.001 && n !== 0) return n.toExponential(4)
  return parseFloat(n.toPrecision(8)).toString()
}

export default function speed_converter() {

  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [value, setValue] = useState('100')
  const [fromUnit, setFromUnit] = useState('kmh')
  const [converted, setConverted] = useState(null)
  const [showResults, setShowResults] = useState(false)

  const kmh = useMemo(() => toKmh(parseFloat(value) || 0, fromUnit), [value, fromUnit])

  const doConvert = useCallback(() => {
    const v = parseFloat(value) || 0
    const results = UNITS.map(u => ({
      ...u,
      value: fromKmh(toKmh(v, fromUnit), u.id),
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

  const speedInfo = speedColor(kmh)

  return (
    <ToolLayout
      title="Speed Converter"
      desc="Convert between km/h, mph, knots, m/s, and ft/s. Visual speed gauge with common presets."
      icon="🚀" iconBg="rgba(6,182,212,0.08)"
      category="dev" slug="speed-converter"
      faq={[
        { q: 'What is the difference between km/h and mph?', a: 'Kilometers per hour (km/h) is the metric standard. Miles per hour (mph) is used in the US, UK, and a few other countries. 1 km/h ≈ 0.6214 mph.' },
        { q: 'What are knots?', a: 'A knot equals one nautical mile per hour (1.852 km/h). Used in aviation and maritime navigation. Named after the old practice of counting knots on a rope.' },
        { q: 'How fast is the speed of light?', a: 'Light travels at approximately 299,792 km/s or about 1,079,252,849 km/h — roughly 874,030 times faster than a commercial jet.' },
        { q: 'What is m/s used for?', a: 'Meters per second (m/s) is the SI unit of speed. Used in science, engineering, and physics. 1 m/s = 3.6 km/h.' },
      ]}
      howItWorks={[
        'Enter a speed value in the input field.',
        'Select the source unit (km/h, mph, knots, m/s, or ft/s).',
        'Click Convert to see the speed in all 5 units.',
        'Use quick presets for common speeds from walking to bullet trains.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Speed Converter", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/speed-converter/",
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
          <label className="block text-sm font-semibold text-slate-300 mb-2">Speed Value</label>
          <input type="number" value={value} onChange={e => { setValue(e.target.value); setShowResults(false) }}
            className="w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl px-5 py-4 text-3xl font-extrabold text-white outline-none focus:border-cyan-500/40 transition-all placeholder:text-white/8" />
        </div>

        {/* Unit Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-2 block">From Unit</label>
          <div className="grid grid-cols-5 gap-2">
            {UNITS.map(u => (
              <button key={u.id} onClick={() => { setFromUnit(u.id); setShowResults(false) }}
                className={`py-3 rounded-xl text-sm font-bold transition-all border-2 ${fromUnit === u.id
                  ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-500/10'
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
            <span className={`text-sm font-bold ${speedInfo.accent}`}>
              {fmt(kmh)} km/h — {speedInfo.label}
            </span>
          </div>
          <div className="relative w-full h-3 rounded-full bg-white/[0.06] border border-white/8 overflow-hidden">
            <div className={`absolute inset-y-0 left-0 ${speedInfo.bar} rounded-full transition-all duration-500 ease-out`}
              style={{ width: `${Math.min(100, (kmh / 1500) * 100)}%` }} />
          </div>
          <div className="flex justify-between text-[10px] text-slate-600">
            <span>0</span><span>300</span><span>700</span><span>1500 km/h</span>
          </div>
        </div>

        {/* Convert Button */}
        <button onClick={() => { doConvert(); jumpTo() }}
          className="glow-btn w-full py-3 rounded-xl text-sm font-bold"
          style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
          🚀 Convert Speed
        </button>

        {/* Results */}
        {showResults && converted && (
          <div ref={resultRef} className="space-y-3" style={{ animation: 'slideUp 0.3s ease-out' }}>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Conversion Results</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {converted.map(u => (
                <div key={u.id} className={`p-4 rounded-2xl border transition-all ${u.id === fromUnit
                  ? 'bg-cyan-500/10 border-cyan-500/20'
                  : 'bg-white/[0.06] border-white/8'
                }`}>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{u.label}</div>
                  <div className={`text-2xl font-extrabold ${u.id === fromUnit ? 'text-cyan-400' : 'text-white'}`}>
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
