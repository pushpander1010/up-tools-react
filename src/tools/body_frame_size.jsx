import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const FRAME_DESC = {
  small: 'You have a fine, narrow bone structure. Your healthy weight range is naturally on the lower end for your height.',
  medium: 'You have an average bone structure typical for your height and sex. Standard weight guidelines apply well to you.',
  large: 'You have a broad, dense bone structure. Your healthy weight range is naturally higher — this is not the same as being overweight.'
}

function wristFrame(heightIn, wristIn, sex) {
  if (sex === 'female') {
    if (heightIn < 62) return wristIn < 5.5 ? 'small' : wristIn <= 5.75 ? 'medium' : 'large'
    if (heightIn <= 65) return wristIn < 6.0 ? 'small' : wristIn <= 6.25 ? 'medium' : 'large'
    return wristIn < 6.25 ? 'small' : wristIn <= 6.5 ? 'medium' : 'large'
  }
  return wristIn < 6.5 ? 'small' : wristIn <= 7.5 ? 'medium' : 'large'
}

function elbowFrame(heightIn, elbowIn, sex) {
  let s, m
  if (sex === 'male') {
    if (heightIn <= 63) { s = 2.5; m = 2.875 }
    else if (heightIn <= 67) { s = 2.625; m = 2.875 }
    else if (heightIn <= 71) { s = 2.75; m = 3.0 }
    else if (heightIn <= 75) { s = 2.75; m = 3.125 }
    else { s = 2.875; m = 3.25 }
  } else {
    if (heightIn <= 59) { s = 2.25; m = 2.5 }
    else if (heightIn <= 63) { s = 2.25; m = 2.5 }
    else if (heightIn <= 67) { s = 2.375; m = 2.625 }
    else if (heightIn <= 71) { s = 2.375; m = 2.625 }
    else { s = 2.5; m = 2.75 }
  }
  return elbowIn < s ? 'small' : elbowIn <= m ? 'medium' : 'large'
}

function hamwiWeight(heightIn, sex, frame) {
  const extra = Math.max(0, heightIn - 60)
  const base = sex === 'male' ? 106 + extra * 6 : 100 + extra * 5
  if (frame === 'small') return base * 0.9
  if (frame === 'large') return base * 1.1
  return base
}

export default function body_frame_size() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [isMetric, setIsMetric] = useState(false)
  const [sex, setSex] = useState('male')
  const [method, setMethod] = useState('wrist')
  const [wristVal, setWristVal] = useState('')
  const [elbowVal, setElbowVal] = useState('')
  const [heightFt, setHeightFt] = useState('')
  const [heightIn, setHeightIn] = useState('')
  const [heightCm, setHeightCm] = useState('')
  const [result, setResult] = useState(null)

  const getHeightInches = useCallback(() => {
    if (isMetric) {
      const cm = parseFloat(heightCm)
      if (!cm || cm < 90 || cm > 250) return null
      return cm / 2.54
    }
    const ft = parseFloat(heightFt) || 0
    const inches = parseFloat(heightIn) || 0
    const total = ft * 12 + inches
    if (total < 36 || total > 100) return null
    return total
  }, [isMetric, heightFt, heightIn, heightCm])

  const calculate = useCallback(() => {
    const hIn = getHeightInches()
    if (!hIn) return
    if (method === 'wrist') {
      const raw = parseFloat(wristVal)
      if (!raw || raw < 2) return
      const wristIn = isMetric ? raw / 2.54 : raw
      const frame = wristFrame(hIn, wristIn, sex)
      const idealLbs = hamwiWeight(hIn, sex, frame)
      const lo = Math.round(idealLbs - 5), hi = Math.round(idealLbs + 5)
      setResult({
        method: 'Wrist Circumference Method', frame,
        weight: isMetric ? `${(lo * 0.453592).toFixed(1)} – ${(hi * 0.453592).toFixed(1)} kg` : `${lo} – ${hi} lbs`
      })
    } else {
      const raw = parseFloat(elbowVal)
      if (!raw || raw < 1) return
      const elbowIn = isMetric ? raw / 2.54 : raw
      const frame = elbowFrame(hIn, elbowIn, sex)
      const idealLbs = hamwiWeight(hIn, sex, frame)
      const lo = Math.round(idealLbs - 5), hi = Math.round(idealLbs + 5)
      setResult({
        method: 'Elbow Breadth Method', frame,
        weight: isMetric ? `${(lo * 0.453592).toFixed(1)} – ${(hi * 0.453592).toFixed(1)} kg` : `${lo} – ${hi} lbs`
      })
    }
  }, [method, wristVal, elbowVal, isMetric, sex, getHeightInches])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark]"
  const btnClass = "px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95"

  return (
    <ToolLayout
      title="Body Frame Size Calculator"
      desc="Determine your body frame size (small, medium, or large) using wrist circumference or elbow breadth methods. Includes ideal weight range."
      icon="🦴" iconBg="rgba(239,68,68,0.08)"
      category="health" slug="body-frame-size"
      faq={[
        { q: 'What is body frame size?', a: 'Body frame size refers to the size of your bone structure — not your weight or muscle mass. It is classified as small, medium, or large.' },
        { q: 'Why does frame size matter?', a: 'Two people with the same height can have very different healthy weights based on frame size. BMI ignores frame size, which is why it can misclassify large-framed people as overweight.' },
        { q: 'Which method is more accurate?', a: 'The elbow breadth method is used in standard NHANES health surveys and is considered more accurate than the wrist method.' },
      ]}
      howItWorks={[
        'Select your sex and toggle between Imperial/Metric units.',
        'Enter your height in the required format.',
        'Choose a method: Wrist Circumference or Elbow Breadth, and enter the measurement.',
        'Click Calculate to see your frame size and ideal weight range.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Body Frame Size Calculator", "applicationCategory": "HealthApplication",
        "url": "https://www.uptools.in/body-frame-size/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Unit Toggle */}
        <div className="flex items-center justify-center gap-3">
          <span className={`text-sm font-semibold ${!isMetric ? 'text-white' : 'text-slate-600'}`}>Imperial</span>
          <button onClick={() => { setIsMetric(!isMetric); setResult(null) }}
            className={`w-14 h-7 rounded-full transition-all duration-300 ${isMetric ? 'bg-indigo-500' : 'bg-white/10'}`}>
            <div className={`w-5 h-5 rounded-full bg-white shadow-lg transition-transform duration-300 mx-1 ${isMetric ? 'translate-x-7' : ''}`} />
          </button>
          <span className={`text-sm font-semibold ${isMetric ? 'text-white' : 'text-slate-600'}`}>Metric</span>
        </div>

        {/* Sex Toggle */}
        <div className="flex gap-2 justify-center">
          {[['male', '♂ Male'], ['female', '♀ Female']].map(([v, l]) => (
            <button key={v} onClick={() => { setSex(v); setResult(null) }}
              className={`${btnClass} ${sex === v ? 'bg-rose-500 text-white' : 'bg-white/[0.06] text-slate-400 border border-white/8'}`}>
              {l}
            </button>
          ))}
        </div>

        {/* Height */}
        <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08] space-y-4">
          <h3 className="text-sm font-semibold text-slate-300">📏 Height</h3>
          {isMetric ? (
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Height (cm)</label>
              <input type="number" value={heightCm} onChange={e => setHeightCm(e.target.value)}
                placeholder="170" min="90" max="250" className={inputClass} />
            </div>
          ) : (
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Feet</label>
                <input type="number" value={heightFt} onChange={e => setHeightFt(e.target.value)}
                  placeholder="5" min="3" max="8" className={inputClass} />
              </div>
              <div className="flex-1">
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Inches</label>
                <input type="number" value={heightIn} onChange={e => setHeightIn(e.target.value)}
                  placeholder="7" min="0" max="11" className={inputClass} />
              </div>
            </div>
          )}
        </div>

        {/* Two Methods */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { id: 'wrist', label: 'Wrist Circumference', badge: 'Method 1', desc: 'Measure the smallest part of your wrist, just below the wrist bone.', val: wristVal, set: setWristVal, unit: isMetric ? 'cm' : 'in' },
            { id: 'elbow', label: 'Elbow Breadth', badge: 'Method 2', desc: 'Measure the distance between the two bony prominences on each side of your elbow.', val: elbowVal, set: setElbowVal, unit: isMetric ? 'cm' : 'in' },
          ].map(m => (
            <div key={m.id} className={`p-5 rounded-2xl border-2 transition-all duration-200 ${method === m.id ? 'border-indigo-500/30 bg-indigo-500/[0.06]' : 'border-white/8 bg-white/[0.04]'}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white">{m.label}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${method === m.id ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/[0.06] text-slate-500'}`}>{m.badge}</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">{m.desc}</p>
              <input type="number" value={m.val} onChange={e => { m.set(e.target.value); setMethod(m.id) }}
                placeholder={m.id === 'wrist' ? '6.5' : '2.75'} min="1" max="15" step="0.01"
                className={inputClass} />
              <div className="text-[10px] text-slate-600 mt-1">{m.unit}</div>
            </div>
          ))}
        </div>

        {/* Calculate Button */}
        <button onClick={() => { calculate(); jumpTo() }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-sm shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-[1.02] active:scale-95 transition-all duration-200">
          Calculate Frame Size
        </button>

        {/* Result */}
        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-rose-500/15 bg-gradient-to-br from-rose-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="text-center">
              <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">{result.method}</div>
              <div className={`text-4xl font-extrabold mb-2 ${result.frame === 'small' ? 'text-cyan-400' : result.frame === 'medium' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {result.frame.charAt(0).toUpperCase() + result.frame.slice(1)}
              </div>
              <p className="text-sm text-slate-400 mb-4">{FRAME_DESC[result.frame]}</p>
              <div className="p-3 rounded-xl bg-black/20 inline-block">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Ideal Weight Range (Hamwi)</div>
                <div className="text-lg font-bold text-white">{result.weight}</div>
              </div>
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🦴</div>
            <p className="text-sm text-slate-600 font-medium">Enter height and a measurement to calculate</p>
          </div>
        )}

        {/* Reference Table */}
        <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08]">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">📊 Reference Chart</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 text-slate-500 font-semibold">Height</th>
                  <th className="text-center py-2 text-cyan-400 font-semibold">Small</th>
                  <th className="text-center py-2 text-emerald-400 font-semibold">Medium</th>
                  <th className="text-center py-2 text-amber-400 font-semibold">Large</th>
                </tr>
              </thead>
              <tbody>
                {sex === 'female' ? (
                  <>
                    <tr className="border-b border-white/5">
                      <td className="py-2 text-slate-400">{'<'} 5'2"</td>
                      <td className="text-center py-2 text-slate-300">{'<'} 5.5"</td>
                      <td className="text-center py-2 text-slate-300">5.5"–5.75"</td>
                      <td className="text-center py-2 text-slate-300">{'>'} 5.75"</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2 text-slate-400">5'2"–5'5"</td>
                      <td className="text-center py-2 text-slate-300">{'<'} 6.0"</td>
                      <td className="text-center py-2 text-slate-300">6.0"–6.25"</td>
                      <td className="text-center py-2 text-slate-300">{'>'} 6.25"</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-slate-400">{'>'} 5'5"</td>
                      <td className="text-center py-2 text-slate-300">{'<'} 6.25"</td>
                      <td className="text-center py-2 text-slate-300">6.25"–6.5"</td>
                      <td className="text-center py-2 text-slate-300">{'>'} 6.5"</td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td className="py-2 text-slate-400">All Heights</td>
                    <td className="text-center py-2 text-slate-300">{'<'} 6.5"</td>
                    <td className="text-center py-2 text-slate-300">6.5"–7.5"</td>
                    <td className="text-center py-2 text-slate-300">{'>'} 7.5"</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
