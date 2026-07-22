import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'

const CATEGORIES = {
  length: { label: 'Length', icon: '📏', units: [
    { id: 'mm', label: 'Millimeter', factor: 0.001 }, { id: 'cm', label: 'Centimeter', factor: 0.01 },
    { id: 'm', label: 'Meter', factor: 1 }, { id: 'km', label: 'Kilometer', factor: 1000 },
    { id: 'in', label: 'Inch', factor: 0.0254 }, { id: 'ft', label: 'Foot', factor: 0.3048 },
    { id: 'yd', label: 'Yard', factor: 0.9144 }, { id: 'mi', label: 'Mile', factor: 1609.344 },
  ]},
  weight: { label: 'Weight', icon: '⚖️', units: [
    { id: 'mg', label: 'Milligram', factor: 0.000001 }, { id: 'g', label: 'Gram', factor: 0.001 },
    { id: 'kg', label: 'Kilogram', factor: 1 }, { id: 't', label: 'Metric Ton', factor: 1000 },
    { id: 'oz', label: 'Ounce', factor: 0.0283495 }, { id: 'lb', label: 'Pound', factor: 0.453592 },
  ]},
  temperature: { label: 'Temperature', icon: '🌡️', units: [
    { id: 'c', label: 'Celsius' }, { id: 'f', label: 'Fahrenheit' }, { id: 'k', label: 'Kelvin' },
  ]},
  volume: { label: 'Volume', icon: '🧪', units: [
    { id: 'ml', label: 'Milliliter', factor: 0.001 }, { id: 'l', label: 'Liter', factor: 1 },
    { id: 'gal', label: 'Gallon (US)', factor: 3.78541 }, { id: 'qt', label: 'Quart', factor: 0.946353 },
    { id: 'pt', label: 'Pint', factor: 0.473176 }, { id: 'cup', label: 'Cup', factor: 0.236588 },
  ]},
  speed: { label: 'Speed', icon: '🚀', units: [
    { id: 'ms', label: 'm/s', factor: 1 }, { id: 'kmh', label: 'km/h', factor: 0.277778 },
    { id: 'mph', label: 'mph', factor: 0.44704 }, { id: 'kn', label: 'Knots', factor: 0.514444 },
    { id: 'fts', label: 'ft/s', factor: 0.3048 },
  ]},
  data: { label: 'Data', icon: '💾', units: [
    { id: 'b', label: 'Byte', factor: 1 }, { id: 'kb', label: 'Kilobyte', factor: 1024 },
    { id: 'mb', label: 'Megabyte', factor: 1048576 }, { id: 'gb', label: 'Gigabyte', factor: 1073741824 },
    { id: 'tb', label: 'Terabyte', factor: 1099511627776 },
  ]},
}

function convertTemp(value, from, to) {
  let celsius
  if (from === 'c') celsius = value
  else if (from === 'f') celsius = (value - 32) * 5/9
  else celsius = value - 273.15

  if (to === 'c') return celsius
  if (to === 'f') return celsius * 9/5 + 32
  return celsius + 273.15
}

export default function unit_converter() {
  const [cat, setCat] = useState('length')
  const [value, setValue] = useState('1')
  const [fromUnit, setFromUnit] = useState('m')
  const [toUnit, setToUnit] = useState('km')

  const currentCat = CATEGORIES[cat]
  const isTemp = cat === 'temperature'

  const result = useMemo(() => {
    const v = parseFloat(value) || 0
    if (isTemp) return convertTemp(v, fromUnit, toUnit)
    const fromFactor = currentCat.units.find(u => u.id === fromUnit)?.factor || 1
    const toFactor = currentCat.units.find(u => u.id === toUnit)?.factor || 1
    return (v * fromFactor) / toFactor
  }, [value, fromUnit, toUnit, cat, isTemp, currentCat])

  const swap = () => { setFromUnit(toUnit); setToUnit(fromUnit) }

  const formatResult = (n) => {
    if (Math.abs(n) >= 1000000) return n.toExponential(4)
    if (Math.abs(n) < 0.001 && n !== 0) return n.toExponential(4)
    return parseFloat(n.toPrecision(8)).toString()
  }

  return (
    <ToolLayout
      title="Unit Converter"
      desc="Convert between length, weight, temperature, volume, speed, and data units instantly."
      icon="📏" iconBg="rgba(6,182,212,0.08)"
      category="dev" slug="unit-converter"
      faq={[
        { q: 'How accurate are the conversions?', a: 'All conversions use precise mathematical factors. Results are accurate to 8 significant figures.' },
        { q: 'Can I convert temperature?', a: 'Yes — select the Temperature category to convert between Celsius, Fahrenheit, and Kelvin.' },
      ]}
      howItWorks={[
        'Select a category (Length, Weight, Temperature, etc.).',
        'Enter the value you want to convert.',
        'Choose the source and target units.',
        'Result updates instantly — click swap to flip units.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Unit Converter", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/unit-converter/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Category Selector */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(CATEGORIES).map(([key, c]) => (
            <button key={key} onClick={() => { setCat(key); setFromUnit(c.units[0].id); setToUnit(c.units[1]?.id || c.units[0].id) }}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${cat === key ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-500/10' : 'bg-white/[0.03] border-white/6 text-slate-400 hover:border-white/12'}`}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Value</label>
          <input type="number" value={value} onChange={e => setValue(e.target.value)}
            className="w-full bg-white/[0.03] border-2 border-white/8 rounded-2xl px-5 py-4 text-3xl font-extrabold text-white outline-none focus:border-cyan-500/40 transition-all duration-300 placeholder:text-white/8" />
        </div>

        {/* From / Swap / To */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">From</label>
            <select value={fromUnit} onChange={e => setFromUnit(e.target.value)}
              className="w-full bg-white/[0.03] border-2 border-white/8 rounded-xl px-4 py-3 text-white text-sm font-semibold outline-none focus:border-cyan-500/40 appearance-none cursor-pointer">
              {currentCat.units.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
            </select>
          </div>
          <button onClick={swap} className="mt-5 w-10 h-10 rounded-full bg-white/5 border border-white/8 flex items-center justify-center text-slate-400 hover:text-white hover:border-cyan-500/40 transition-all shrink-0">
            ⇄
          </button>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">To</label>
            <select value={toUnit} onChange={e => setToUnit(e.target.value)}
              className="w-full bg-white/[0.03] border-2 border-white/8 rounded-xl px-4 py-3 text-white text-sm font-semibold outline-none focus:border-cyan-500/40 appearance-none cursor-pointer">
              {currentCat.units.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
            </select>
          </div>
        </div>

        {/* Result */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-500/8 via-white/[0.02] to-transparent border border-cyan-500/15 text-center" style={{ animation: 'slideUp 0.3s ease-out' }}>
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Result</div>
          <div className="text-4xl font-extrabold text-cyan-400">{formatResult(result)}</div>
          <div className="text-sm text-slate-400 mt-2">
            {value || '0'} {currentCat.units.find(u => u.id === fromUnit)?.label} = {formatResult(result)} {currentCat.units.find(u => u.id === toUnit)?.label}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
