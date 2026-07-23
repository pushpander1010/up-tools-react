import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const UNITS = {
  length: { 'Meter': 1, 'Kilometer': 1000, 'Centimeter': 0.01, 'Millimeter': 0.001, 'Mile': 1609.344, 'Yard': 0.9144, 'Foot': 0.3048, 'Inch': 0.0254 },
  weight: { 'Kilogram': 1, 'Gram': 0.001, 'Milligram': 0.000001, 'Pound': 0.453592, 'Ounce': 0.0283495, 'Ton': 1000 },
  temperature: { 'Celsius': 'C', 'Fahrenheit': 'F', 'Kelvin': 'K' },
  volume: { 'Liter': 1, 'Milliliter': 0.001, 'Gallon (US)': 3.78541, 'Quart': 0.946353, 'Cup': 0.236588, 'Fl Oz': 0.0295735 },
  area: { 'Sq Meter': 1, 'Sq Kilometer': 1000000, 'Sq Foot': 0.092903, 'Sq Inch': 0.00064516, 'Acre': 4046.86, 'Hectare': 10000 },
  speed: { 'm/s': 1, 'km/h': 0.277778, 'mph': 0.44704, 'knot': 0.514444, 'ft/s': 0.3048 },
  data: { 'Byte': 1, 'KB': 1024, 'MB': 1048576, 'GB': 1073741824, 'TB': 1099511627776 },
  time: { 'Second': 1, 'Millisecond': 0.001, 'Minute': 60, 'Hour': 3600, 'Day': 86400, 'Week': 604800 }
}

const CATEGORIES = Object.keys(UNITS)

function convertValue(cat, val, from, to) {
  if (cat === 'temperature') {
    let celsius
    if (from === 'Celsius') celsius = val
    else if (from === 'Fahrenheit') celsius = (val - 32) * 5 / 9
    else celsius = val - 273.15

    if (to === 'Celsius') return celsius
    if (to === 'Fahrenheit') return celsius * 9 / 5 + 32
    return celsius + 273.15
  }
  return (val * UNITS[cat][from]) / UNITS[cat][to]
}

export default function unit_converter_pro() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [category, setCategory] = useState('length')
  const [value, setValue] = useState('1')
  const [fromUnit, setFromUnit] = useState('Meter')
  const [toUnit, setToUnit] = useState('Kilometer')
  const [copied, setCopied] = useState(false)

  const unitKeys = useMemo(() => Object.keys(UNITS[category]), [category])

  const result = useMemo(() => {
    const val = parseFloat(value) || 0
    return convertValue(category, val, fromUnit, toUnit)
  }, [category, value, fromUnit, toUnit])

  const allConversions = useMemo(() => {
    const val = parseFloat(value) || 0
    return unitKeys.map(u => ({
      unit: u,
      value: convertValue(category, val, fromUnit, u)
    }))
  }, [category, value, fromUnit, unitKeys])

  const handleCategoryChange = (newCat) => {
    setCategory(newCat)
    const keys = Object.keys(UNITS[newCat])
    setFromUnit(keys[0])
    setToUnit(keys[1] || keys[0])
  }

  const swap = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
    jumpTo()
  }

  const copyResult = () => {
    navigator.clipboard.writeText(`${result.toFixed(6)} ${toUnit}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  const selectClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Unit Converter"
      desc="Convert between units of length, weight, temperature, volume, area, speed, data, and time."
      icon="🔄" iconBg="rgba(99,102,241,0.08)"
      category="tools" slug="unit-converter-pro"
      faq={[
        { q: "What units are supported?", a: "8 categories: Length, Weight, Temperature, Volume, Area, Speed, Data Storage, and Time — with 5-8 units each." },
        { q: "How accurate are conversions?", a: "Conversions use standard scientific factors and are accurate to 6 decimal places." },
      ]}
      howItWorks={[
        "Select a category (Length, Weight, Temperature, etc.).",
        "Enter the value and choose From/To units.",
        "View the result instantly with all equivalent conversions.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Unit Converter", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/unit-converter-pro/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Category + Value */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Category</label>
            <select value={category} onChange={e => handleCategoryChange(e.target.value)}
              className={selectClass}>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Value</label>
            <input type="number" value={value} onChange={e => setValue(e.target.value)}
              className={inputClass} />
          </div>
        </div>

        {/* From / To */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">From</label>
            <select value={fromUnit} onChange={e => setFromUnit(e.target.value)}
              className={selectClass}>
              {unitKeys.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">To</label>
            <select value={toUnit} onChange={e => setToUnit(e.target.value)}
              className={selectClass}>
              {unitKeys.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        {/* Swap + Copy */}
        <div className="flex gap-3">
          <button onClick={swap}
            className="flex-1 py-3 rounded-xl bg-white/[0.06] border border-white/8 text-slate-400 text-sm font-semibold hover:text-white hover:border-white/20 transition-all">
            🔄 Swap
          </button>
          <button onClick={copyResult}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
              copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/[0.06] border border-white/8 text-slate-400 hover:text-white'
            }`}>
            {copied ? '✓ Copied' : '📋 Copy Result'}
          </button>
        </div>

        {/* Result */}
        <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
          style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400 mb-2">{result.toFixed(6)}</div>
            <div className="text-sm text-slate-400">
              {parseFloat(value) || 0} {fromUnit} = {result.toFixed(6)} {toUnit}
            </div>
          </div>
        </div>

        {/* All Conversions */}
        <div className="p-5 rounded-3xl border-2 border-white/8 bg-white/[0.02]">
          <h3 className="text-sm font-bold text-indigo-400 mb-3">All Conversions (1 {fromUnit} =)</h3>
          <div className="space-y-1">
            {allConversions.map(({ unit, value: v }) => (
              <div key={unit} className="flex justify-between text-sm py-1.5 border-b border-white/5 last:border-0">
                <span className="text-slate-400">{unit}</span>
                <span className="text-white font-mono font-semibold">{v.toFixed(6)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
