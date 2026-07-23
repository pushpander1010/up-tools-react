import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function frequency_converter() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [freq, setFreq] = useState('')
  const [unit, setUnit] = useState('hz')
  const [result, setResult] = useState(null)

  const convert = useCallback(() => {
    const val = parseFloat(freq)
    if (isNaN(val)) return
    let hz, khz, mhz, ghz, rpm

    if (unit === 'hz') { hz = val; khz = val / 1000; mhz = val / 1e6; ghz = val / 1e9; rpm = val * 60; }
    else if (unit === 'khz') { khz = val; hz = val * 1000; mhz = val / 1000; ghz = val / 1e6; rpm = val * 60000; }
    else if (unit === 'mhz') { mhz = val; hz = val * 1e6; khz = val * 1000; ghz = val / 1000; rpm = val * 6e7; }
    else if (unit === 'ghz') { ghz = val; hz = val * 1e9; khz = val * 1e6; mhz = val * 1000; rpm = val * 6e10; }
    else if (unit === 'rpm') { rpm = val; hz = val / 60; khz = hz / 1000; mhz = hz / 1e6; ghz = hz / 1e9; }

    setResult({
      hz: hz.toFixed(2), khz: khz.toFixed(4), mhz: mhz.toFixed(6),
      ghz: ghz.toFixed(9), rpm: rpm.toFixed(2)
    })
    jumpTo()
  }, [freq, unit])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  const rows = result ? [
    { label: 'Hertz (Hz)', value: result.hz },
    { label: 'Kilohertz (kHz)', value: result.khz },
    { label: 'Megahertz (MHz)', value: result.mhz },
    { label: 'Gigahertz (GHz)', value: result.ghz },
    { label: 'RPM', value: result.rpm },
  ] : []

  return (
    <ToolLayout
      title="Frequency Converter"
      desc="Convert between Hz, kHz, MHz, GHz, and RPM instantly. Essential tool for electronics and engineering."
      icon="Hz" iconBg="rgba(6,182,212,0.08)"
      category="dev" slug="frequency-converter"
      faq={[
        { q: "What units can I convert?", a: "Hertz (Hz), Kilohertz (kHz), Megahertz (MHz), Gigahertz (GHz), and RPM." },
        { q: "How does RPM relate to Hz?", a: "1 Hz = 60 RPM (revolutions per minute), since there are 60 seconds in a minute." },
      ]}
      howItWorks={[
        "Enter a frequency value in the input field.",
        "Select the unit you are entering from.",
        "Click Convert to see all equivalent values.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Frequency Converter", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/frequency-converter/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-slate-300 mb-2">Value</label>
            <input type="number" value={freq} onChange={e => setFreq(e.target.value)}
              placeholder="Enter frequency..." step="any"
              className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Unit</label>
            <select value={unit} onChange={e => setUnit(e.target.value)}
              className={inputClass + " bg-gray-900"}>
              <option value="hz" className="bg-gray-900">Hz</option>
              <option value="khz" className="bg-gray-900">kHz</option>
              <option value="mhz" className="bg-gray-900">MHz</option>
              <option value="ghz" className="bg-gray-900">GHz</option>
              <option value="rpm" className="bg-gray-900">RPM</option>
            </select>
          </div>
        </div>

        <button onClick={convert}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
          🔄 Convert
        </button>

        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Results</h3>
            </div>
            <div className="space-y-0">
              {rows.map((row, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-white/[0.04] last:border-0">
                  <span className="text-sm text-slate-400">{row.label}</span>
                  <span className="text-sm font-bold text-white font-mono">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">Hz</div>
            <p className="text-sm text-slate-600 font-medium">Enter a frequency value and click Convert</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
