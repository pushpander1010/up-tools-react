import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

function wristFrameSize(heightIn, wristIn, sx) {
  if (sx === 'female') {
    if (heightIn < 62) { if (wristIn < 5.5) return 'small'; if (wristIn <= 5.75) return 'medium'; return 'large' }
    if (heightIn <= 65) { if (wristIn < 6.0) return 'small'; if (wristIn <= 6.25) return 'medium'; return 'large' }
    if (wristIn < 6.25) return 'small'; if (wristIn <= 6.5) return 'medium'; return 'large'
  }
  if (wristIn < 6.5) return 'small'; if (wristIn <= 7.5) return 'medium'; return 'large'
}

function elbowFrameSize(heightIn, elbowIn, sx) {
  let s, m
  if (sx === 'male') {
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
  if (elbowIn < s) return 'small'; if (elbowIn <= m) return 'medium'; return 'large'
}

function hamwiWeight(heightIn, sx, frameSize) {
  const extra = Math.max(0, heightIn - 60)
  const base = sx === 'male' ? 106 + extra * 6 : 100 + extra * 5
  if (frameSize === 'small') return base * 0.9
  if (frameSize === 'large') return base * 1.1
  return base
}

const FRAME_DESC = {
  small: 'You have a fine, narrow bone structure. Your healthy weight range is naturally lower for your height.',
  medium: 'You have an average bone structure typical for your height and sex.',
  large: 'You have a broad, dense bone structure. Your healthy weight range is naturally higher.'
}

export default function body_frame_size() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [isMetric, setIsMetric] = useState(false)
  const [sex, setSex] = useState('male')
  const [hFt, setHFt] = useState('5')
  const [hIn, setHIn] = useState('7')
  const [hCm, setHCm] = useState('170')
  const [wristVal, setWristVal] = useState('')
  const [elbowVal, setElbowVal] = useState('')
  const [result, setResult] = useState(null)

  const getHeightInches = useCallback(() => {
    if (isMetric) {
      const cm = parseFloat(hCm)
      if (!cm || cm < 90 || cm > 250) return null
      return cm / 2.54
    }
    const total = (parseFloat(hFt) || 0) * 12 + (parseFloat(hIn) || 0)
    if (total < 36 || total > 100) return null
    return total
  }, [isMetric, hFt, hIn, hCm])

  const calcWrist = useCallback(() => {
    const heightIn = getHeightInches()
    if (!heightIn) return
    const raw = parseFloat(wristVal)
    if (!raw || raw < 2) return
    const wristIn = isMetric ? raw / 2.54 : raw
    const frame = wristFrameSize(heightIn, wristIn, sex)
    const idealLbs = hamwiWeight(heightIn, sex, frame)
    const lo = Math.round(idealLbs - 5), hi = Math.round(idealLbs + 5)
    const weight = isMetric ? `${(lo * 0.453592).toFixed(1)} – ${(hi * 0.453592).toFixed(1)} kg` : `${lo} – ${hi} lbs`
    setResult({ method: 'Wrist Circumference', frame, weight })
  }, [getHeightInches, wristVal, isMetric, sex])

  const calcElbow = useCallback(() => {
    const heightIn = getHeightInches()
    if (!heightIn) return
    const raw = parseFloat(elbowVal)
    if (!raw || raw < 1) return
    const elbowIn = isMetric ? raw / 2.54 : raw
    const frame = elbowFrameSize(heightIn, elbowIn, sex)
    const idealLbs = hamwiWeight(heightIn, sex, frame)
    const lo = Math.round(idealLbs - 5), hi = Math.round(idealLbs + 5)
    const weight = isMetric ? `${(lo * 0.453592).toFixed(1)} – ${(hi * 0.453592).toFixed(1)} kg` : `${lo} – ${hi} lbs`
    setResult({ method: 'Elbow Breadth', frame, weight })
  }, [getHeightInches, elbowVal, isMetric, sex])

  const inputClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600"

  return (
    <ToolLayout
      title="Body Frame Size Calculator"
      desc="Determine your body frame size (small, medium, or large) using wrist circumference or elbow breadth methods."
      icon="🦴" iconBg="rgba(239,68,68,0.08)"
      category="health" slug="body-frame-size"
      faq={[
        { q: 'What is body frame size?', a: 'It refers to the size of your bone structure — not your weight or muscle mass. Classified as small, medium, or large.' },
        { q: 'Why does it matter?', a: 'Two people with the same height can have very different healthy weights based on frame size.' },
      ]}
      howItWorks={[
        'Select Imperial or Metric units and your sex.',
        'Enter your height.',
        'Use either the Wrist Circumference or Elbow Breadth method to calculate your frame size.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Body Frame Size Calculator", "applicationCategory": "HealthApplication",
        "url": "https://www.uptools.in/body-frame-size/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Toggles */}
        <div className="flex gap-2">
          <button onClick={() => setIsMetric(false)}
            className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all ${!isMetric ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400' : 'bg-white/[0.06] border-white/[0.08] text-slate-500'}`}>
            📏 Imperial
          </button>
          <button onClick={() => setIsMetric(true)}
            className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all ${isMetric ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400' : 'bg-white/[0.06] border-white/[0.08] text-slate-500'}`}>
            📐 Metric
          </button>
        </div>
        <div className="flex gap-2">
          {[['male', '♂ Male'], ['female', '♀ Female']].map(([s, label]) => (
            <button key={s} onClick={() => setSex(s)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all ${sex === s ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400' : 'bg-white/[0.06] border-white/[0.08] text-slate-500'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Height */}
        <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/[0.08]">
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">
            Height {isMetric ? '(cm)' : ''}
          </label>
          {isMetric ? (
            <input type="number" min="90" max="250" step="0.1" value={hCm} onChange={e => setHCm(e.target.value)} placeholder="170" className={inputClass} />
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <input type="number" min="3" max="8" value={hFt} onChange={e => setHFt(e.target.value)} placeholder="ft" className={inputClass} />
              <input type="number" min="0" max="11" value={hIn} onChange={e => setHIn(e.target.value)} placeholder="in" className={inputClass} />
            </div>
          )}
        </div>

        {/* Two Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08] space-y-3">
            <h3 className="text-sm font-bold text-slate-300">Wrist Circumference <span className="text-[10px] text-indigo-400 font-normal">Method 1</span></h3>
            <p className="text-[11px] text-slate-600">Wrap a tape measure around the smallest part of your wrist, just below the wrist bone.</p>
            <label className="block text-xs font-semibold text-slate-400">Wrist ({isMetric ? 'cm' : 'in'})</label>
            <input type="number" step="0.01" value={wristVal} onChange={e => setWristVal(e.target.value)} placeholder={isMetric ? '16' : '6.5'} className={inputClass} />
            <button onClick={() => { calcWrist(); jumpTo() }}
              className="glow-btn w-full py-3 rounded-xl text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              Calculate Frame Size
            </button>
          </div>
          <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08] space-y-3">
            <h3 className="text-sm font-bold text-slate-300">Elbow Breadth <span className="text-[10px] text-amber-400 font-normal">Method 2</span></h3>
            <p className="text-[11px] text-slate-600">Measure the distance between the two bony prominences on each side of your elbow.</p>
            <label className="block text-xs font-semibold text-slate-400">Elbow ({isMetric ? 'cm' : 'in'})</label>
            <input type="number" step="0.01" value={elbowVal} onChange={e => setElbowVal(e.target.value)} placeholder={isMetric ? '7' : '2.75'} className={inputClass} />
            <button onClick={() => { calcElbow(); jumpTo() }}
              className="glow-btn w-full py-3 rounded-xl text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
              Calculate Frame Size
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div ref={resultRef} className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/[0.08] to-transparent border-2 border-indigo-500/20 text-center"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="text-[10px] text-slate-600 uppercase tracking-wider mb-2">{result.method} Method</div>
            <div className={`text-3xl font-extrabold mb-2 ${result.frame === 'small' ? 'text-cyan-400' : result.frame === 'large' ? 'text-amber-400' : 'text-emerald-400'}`}>
              {result.frame.charAt(0).toUpperCase() + result.frame.slice(1)} Frame
            </div>
            <p className="text-sm text-slate-400 mb-4">{FRAME_DESC[result.frame]}</p>
            <div className="text-[10px] text-slate-600 uppercase tracking-wider mb-1">Ideal Weight Range (Hamwi)</div>
            <div className="text-lg font-bold text-white">{result.weight}</div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
