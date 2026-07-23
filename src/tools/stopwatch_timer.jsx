import { useState, useRef, useCallback, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'

export default function stopwatch_timer() {
  const [tab, setTab] = useState('sw')

  // Stopwatch
  const [swTime, setSwTime] = useState(0)
  const [swRunning, setSwRunning] = useState(false)
  const [laps, setLaps] = useState([])
  const swRef = useRef(null)
  const swStartRef = useRef(0)

  // Timer
  const [tmH, setTmH] = useState(0)
  const [tmM, setTmM] = useState(0)
  const [tmS, setTmS] = useState(0)
  const [tmRemaining, setTmRemaining] = useState(0)
  const [tmRunning, setTmRunning] = useState(false)
  const tmRef = useRef(null)

  const fmtSW = (ms) => {
    const h = String(Math.floor(ms / 3600000)).padStart(2, '0')
    const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0')
    const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0')
    const cs = String(Math.floor((ms % 1000) / 10)).padStart(2, '0')
    return `${h}:${m}:${s}.${cs}`
  }

  const fmtTM = (sec) => {
    const h = String(Math.floor(sec / 3600)).padStart(2, '0')
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0')
    const s = String(sec % 60).padStart(2, '0')
    return `${h}:${m}:${s}`
  }

  // Stopwatch
  const swToggle = useCallback(() => {
    if (swRunning) {
      clearInterval(swRef.current)
      setSwRunning(false)
    } else {
      swStartRef.current = Date.now() - swTime
      swRef.current = setInterval(() => {
        setSwTime(Date.now() - swStartRef.current)
      }, 10)
      setSwRunning(true)
    }
  }, [swRunning, swTime])

  const swLap = useCallback(() => {
    if (!swRunning) return
    setLaps(prev => [{ time: swTime, num: prev.length + 1 }, ...prev])
  }, [swRunning, swTime])

  const swReset = useCallback(() => {
    clearInterval(swRef.current)
    setSwRunning(false)
    setSwTime(0)
    setLaps([])
  }, [])

  // Timer
  const tmTotal = () => (tmH || 0) * 3600 + (tmM || 0) * 60 + (tmS || 0)

  const tmToggle = useCallback(() => {
    if (tmRunning) {
      clearInterval(tmRef.current)
      setTmRunning(false)
    } else {
      let rem = tmRemaining > 0 ? tmRemaining : tmTotal()
      if (rem <= 0) return
      setTmRemaining(rem)
      setTmRunning(true)
      tmRef.current = setInterval(() => {
        setTmRemaining(prev => {
          if (prev <= 1) {
            clearInterval(tmRef.current)
            setTmRunning(false)
            if (Notification.permission === 'granted') {
              new Notification('Timer', { body: 'Time is up! ⏰' })
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
  }, [tmRunning, tmRemaining, tmH, tmM, tmS])

  const tmReset = useCallback(() => {
    clearInterval(tmRef.current)
    setTmRunning(false)
    setTmRemaining(0)
  }, [])

  useEffect(() => () => { clearInterval(swRef.current); clearInterval(tmRef.current) }, [])

  const tabBtn = (key, label) => (
    <button key={key} onClick={() => setTab(key)}
      className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === key
        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40' : 'bg-white/[0.06] text-slate-500 border border-white/8 hover:text-white'}`}>
      {label}
    </button>
  )

  return (
    <ToolLayout
      title="Stopwatch & Timer"
      desc="Precision stopwatch with lap tracking and countdown timer with notifications."
      icon="⏱️" iconBg="rgba(99,102,241,0.08)"
      category="productivity" slug="stopwatch-timer"
      faq={[
        { q: 'Can I use both simultaneously?', a: 'The stopwatch and timer are in separate tabs, but you can switch between them freely.' },
        { q: 'Does the timer send notifications?', a: 'Yes, if you grant browser notification permission, you\'ll get an alert when the timer finishes.' },
      ]}
      howItWorks={[
        'Switch between Stopwatch and Timer tabs.',
        'For Stopwatch: Start/Pause, record laps, and reset.',
        'For Timer: Set hours, minutes, seconds, then Start.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Stopwatch & Timer", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/stopwatch-timer/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-lg mx-auto space-y-6">
        {/* Tabs */}
        <div className="flex gap-2">{tabBtn('sw', '⏱️ Stopwatch')}{tabBtn('tm', '⏲️ Timer')}</div>

        {tab === 'sw' ? (
          <>
            {/* Stopwatch Display */}
            <div className="text-center py-10">
              <div className="text-5xl md:text-6xl font-mono font-bold text-white tracking-wider">{fmtSW(swTime)}</div>
            </div>
            <div className="flex gap-3">
              <button onClick={swToggle} className="glow-btn flex-1 py-4 rounded-2xl text-sm font-bold"
                style={{ background: swRunning ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                {swRunning ? '⏸️ Pause' : '▶️ Start'}
              </button>
              <button onClick={swLap} disabled={!swRunning}
                className="px-5 py-4 rounded-2xl text-sm font-bold bg-white/[0.06] border border-white/8 text-slate-400 hover:text-white transition-all disabled:opacity-30">
                🏁 Lap
              </button>
              <button onClick={swReset}
                className="px-5 py-4 rounded-2xl text-sm font-bold bg-white/[0.06] border border-white/8 text-slate-400 hover:text-white transition-all">
                🔄
              </button>
            </div>
            {laps.length > 0 && (
              <div className="bg-white/[0.06] border border-white/8 rounded-2xl p-4 max-h-60 overflow-y-auto space-y-2">
                {laps.map((lap, i) => (
                  <div key={i} className="flex justify-between items-center py-2 px-3 rounded-xl bg-black/20 text-sm">
                    <span className="text-slate-400 font-semibold">Lap {lap.num}</span>
                    <span className="font-mono text-white font-bold">{fmtSW(lap.time)}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Timer Inputs */}
            <div className="flex gap-3 justify-center">
              {[
                { val: tmH, set: setTmH, label: 'Hours' },
                { val: tmM, set: setTmM, label: 'Minutes' },
                { val: tmS, set: setTmS, label: 'Seconds' },
              ].map(({ val, set, label }) => (
                <div key={label} className="text-center">
                  <input type="number" min="0" max="99" value={val || ''}
                    onChange={e => set(Math.max(0, Math.min(99, parseInt(e.target.value) || 0)))}
                    disabled={tmRunning}
                    className="w-20 h-20 text-center text-3xl font-mono font-bold bg-black/30 border-2 border-white/8 rounded-2xl text-white outline-none focus:border-indigo-500/40 disabled:opacity-40 [color-scheme:dark]" />
                  <div className="text-xs text-slate-500 mt-2">{label}</div>
                </div>
              ))}
            </div>
            {/* Timer Display */}
            <div className="text-center py-4">
              <div className="text-5xl font-mono font-bold text-white tracking-wider">{fmtTM(tmRemaining || tmTotal())}</div>
            </div>
            <div className="flex gap-3">
              <button onClick={tmToggle} className="glow-btn flex-1 py-4 rounded-2xl text-sm font-bold"
                style={{ background: tmRunning ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                {tmRunning ? '⏸️ Pause' : '▶️ Start'}
              </button>
              <button onClick={tmReset}
                className="px-5 py-4 rounded-2xl text-sm font-bold bg-white/[0.06] border border-white/8 text-slate-400 hover:text-white transition-all">
                🔄 Reset
              </button>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  )
}
