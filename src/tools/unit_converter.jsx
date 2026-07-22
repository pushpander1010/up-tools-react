import useJumpToResult from '../hooks/useJumpToResult'
import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'

const CATEGORIES = {
  length: { label: 'Length', icon: '📏', units: [
    { id: 'mm', label: 'Millimeter' }, { id: 'cm', label: 'Centimeter' }, { id: 'm', label: 'Meter' },
    { id: 'km', label: 'Kilometer' }, { id: 'in', label: 'Inch' }, { id: 'ft', label: 'Foot' },
    { id: 'yd', label: 'Yard' }, { id: 'mi', label: 'Mile' },
    { id: 'ly', label: 'Light Year' }, { id: 'au', label: 'Astronomical Unit' },
    { id: 'nm', label: 'Nautical Mile' }, { id: 'fathom', label: 'Fathom' },
    { id: 'chain', label: 'Chain' }, { id: 'rod', label: 'Rod' },
    { id: 'fur', label: 'Furlong' }, { id: 'league', label: 'League' },
  ]},
  weight: { label: 'Weight', icon: '⚖️', units: [
    { id: 'mg', label: 'Milligram' }, { id: 'g', label: 'Gram' }, { id: 'kg', label: 'Kilogram' },
    { id: 't', label: 'Metric Ton' }, { id: 'oz', label: 'Ounce' }, { id: 'lb', label: 'Pound' },
    { id: 'stone', label: 'Stone' }, { id: 'grain', label: 'Grain' },
    { id: 'carat', label: 'Carat' }, { id: 'ton_us', label: 'US Ton' },
  ]},
  temperature: { label: 'Temperature', icon: '🌡️', units: [
    { id: 'c', label: 'Celsius' }, { id: 'f', label: 'Fahrenheit' }, { id: 'k', label: 'Kelvin' },
    { id: 'r', label: 'Rankine' },
  ]},
  volume: { label: 'Volume', icon: '🧪', units: [
    { id: 'ml', label: 'Milliliter' }, { id: 'l', label: 'Liter' }, { id: 'gal', label: 'Gallon (US)' },
    { id: 'qt', label: 'Quart' }, { id: 'pt', label: 'Pint' }, { id: 'cup', label: 'Cup' },
    { id: 'floz', label: 'Fluid Ounce' }, { id: 'tbsp', label: 'Tablespoon' },
    { id: 'tsp', label: 'Teaspoon' }, { id: 'm3', label: 'Cubic Meter' },
    { id: 'gal_uk', label: 'Gallon (UK)' },
  ]},
  speed: { label: 'Speed', icon: '🚀', units: [
    { id: 'ms', label: 'm/s' }, { id: 'kmh', label: 'km/h' }, { id: 'mph', label: 'mph' },
    { id: 'kn', label: 'Knots' }, { id: 'fts', label: 'ft/s' }, { id: 'mach', label: 'Mach' },
    { id: 'c', label: 'Speed of Light' },
  ]},
  data: { label: 'Data', icon: '💾', units: [
    { id: 'b', label: 'Byte' }, { id: 'kb', label: 'Kilobyte' }, { id: 'mb', label: 'Megabyte' },
    { id: 'gb', label: 'Gigabyte' }, { id: 'tb', label: 'Terabyte' }, { id: 'pb', label: 'Petabyte' },
    { id: 'bit', label: 'Bit' }, { id: 'nibble', label: 'Nibble' },
  ]},
  area: { label: 'Area', icon: '📐', units: [
    { id: 'mm2', label: 'Sq Millimeter' }, { id: 'cm2', label: 'Sq Centimeter' },
    { id: 'm2', label: 'Sq Meter' }, { id: 'km2', label: 'Sq Kilometer' },
    { id: 'ha', label: 'Hectare' }, { id: 'acre', label: 'Acre' },
    { id: 'ft2', label: 'Sq Foot' }, { id: 'yd2', label: 'Sq Yard' },
    { id: 'mi2', label: 'Sq Mile' }, { id: 'in2', label: 'Sq Inch' },
  ]},
  time: { label: 'Time', icon: '⏱️', units: [
    { id: 'ms_t', label: 'Millisecond' }, { id: 's', label: 'Second' }, { id: 'min', label: 'Minute' },
    { id: 'hr', label: 'Hour' }, { id: 'day', label: 'Day' }, { id: 'wk', label: 'Week' },
    { id: 'mo', label: 'Month (30d)' }, { id: 'yr', label: 'Year (365d)' },
    { id: 'decade', label: 'Decade' }, { id: 'century', label: 'Century' },
  ]},
}

// Conversion factors to base unit
const TO_BASE = {
  // length (to meter)
  mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344,
  ly: 9.461e15, au: 1.496e11, nm: 1852, fathom: 1.8288, chain: 20.1168, rod: 5.0292, fur: 201.168, league: 4828.032,
  // weight (to kilogram)
  mg: 0.000001, g: 0.001, kg: 1, t: 1000, oz: 0.0283495, lb: 0.453592, stone: 6.35029, grain: 0.0000648, carat: 0.0002, ton_us: 907.185,
  // volume (to liter)
  ml: 0.001, l: 1, gal: 3.78541, qt: 0.946353, pt: 0.473176, cup: 0.236588, floz: 0.0295735, tbsp: 0.0147868, tsp: 0.00492892, m3: 1000, gal_uk: 4.54609,
  // speed (to m/s)
  ms: 1, kmh: 0.277778, mph: 0.44704, kn: 0.514444, fts: 0.3048, mach: 343, c: 299792458,
  // data (to byte)
  b: 1, kb: 1024, mb: 1048576, gb: 1073741824, tb: 1099511627776, pb: 1125899906842624, bit: 0.125, nibble: 0.5,
  // area (to sq meter)
  mm2: 0.000001, cm2: 0.0001, m2: 1, km2: 1000000, ha: 10000, acre: 4046.86, ft2: 0.092903, yd2: 0.836127, mi2: 2589988, in2: 0.00064516,
  // time (to second)
  ms_t: 0.001, s: 1, min: 60, hr: 3600, day: 86400, wk: 604800, mo: 2592000, yr: 31536000, decade: 315360000, century: 3153600000,
}

function convertTemp(value, from, to) {
  const toR = { c: (v) => v, f: (v) => (v - 32) * 5/9, k: (v) => v - 273.15, r: (v) => (v - 491.67) * 5/9 }
  const fromR = { c: (v) => v, f: (v) => v * 9/5 + 32, k: (v) => v + 273.15, r: (v) => v * 9/5 + 491.67 }
  const celsius = toR[from](value)
  return fromR[to](celsius)
}

export default function unit_converter() {

  const { ref: resultRef, trigger, reset } = useJumpToResult()
  const [cat, setCat] = useState('length')
  const [value, setValue] = useState('1')
  const [fromUnit, setFromUnit] = useState('m')
  const [toUnit, setToUnit] = useState('km')

  const currentCat = CATEGORIES[cat]
  const isTemp = cat === 'temperature'

  const result = useMemo(() => {
    const v = parseFloat(value) || 0
    if (isTemp) return convertTemp(v, fromUnit, toUnit)
    return (v * (TO_BASE[fromUnit] || 1)) / (TO_BASE[toUnit] || 1)
  }, [value, fromUnit, toUnit, cat, isTemp])
  if (result !== null && result !== undefined && result !== 0) trigger()

  const swap = () => { setFromUnit(toUnit); setToUnit(fromUnit) }

  const fmt = (n) => {
    if (Math.abs(n) >= 1e12) return n.toExponential(4)
    if (Math.abs(n) < 0.0001 && n !== 0) return n.toExponential(4)
    return parseFloat(n.toPrecision(8)).toString()
  }

  return (
    <ToolLayout
      title="Unit Converter"
      desc="Convert between length, weight, temperature, volume, speed, data, area, and time units instantly."
      icon="📏" iconBg="rgba(6,182,212,0.08)"
      category="dev" slug="unit-converter"
      faq={[
        { q: 'What units are supported?', a: '8 categories: Length (including light years, AU), Weight (including stone, grain), Temperature, Volume, Speed (including Mach), Data, Area, and Time.' },
        { q: 'How accurate are conversions?', a: 'All conversions use precise mathematical factors. Results are accurate to 8 significant figures.' },
      ]}
      howItWorks={[
        'Select a category (Length, Weight, Temperature, etc.).',
        'Enter the value you want to convert.',
        'Choose the source and target units.',
        'Result updates instantly — click swap to flip.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Unit Converter", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/unit-converter/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Category */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(CATEGORIES).map(([key, c]) => (
            <button key={key} onClick={() => { setCat(key); setFromUnit(c.units[0].id); setToUnit(c.units[1]?.id || c.units[0].id) }}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${cat === key ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-500/10' : 'bg-white/[0.06] border-white/8 text-slate-400 hover:border-white/12'}`}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        {/* Value */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Value</label>
          <input type="number" value={value} onChange={e => setValue(e.target.value)}
            className="w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl px-5 py-4 text-3xl font-extrabold text-white outline-none focus:border-cyan-500/40 transition-all placeholder:text-white/8" />
        </div>

        {/* From / Swap / To */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">From</label>
            <select value={fromUnit} onChange={e => setFromUnit(e.target.value)}
              className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-white text-sm font-semibold outline-none focus:border-cyan-500/40 appearance-none cursor-pointer">
              {currentCat.units.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
            </select>
          </div>
          <button onClick={swap} className="mt-5 w-10 h-10 rounded-full bg-white/5 border border-white/8 flex items-center justify-center text-slate-400 hover:text-white hover:border-cyan-500/40 transition-all shrink-0 text-lg">⇄</button>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">To</label>
            <select value={toUnit} onChange={e => setToUnit(e.target.value)}
              className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-white text-sm font-semibold outline-none focus:border-cyan-500/40 appearance-none cursor-pointer">
              {currentCat.units.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
            </select>
          </div>
        </div>

        {/* Result */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-500/8 via-white/[0.02] to-transparent border border-cyan-500/15 text-center" style={{ animation: 'slideUp 0.3s ease-out' }}>
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Result</div>
          <div ref={resultRef} className="text-4xl font-extrabold text-cyan-400">{fmt(result)}</div>
          <div className="text-sm text-slate-400 mt-2">
            {value || '0'} {currentCat.units.find(u => u.id === fromUnit)?.label} = {fmt(result)} {currentCat.units.find(u => u.id === toUnit)?.label}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
