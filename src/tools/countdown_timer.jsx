import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function countdown_timer() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [input, setInput] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)
  const [running, setRunning] = useState(false)
  const intervalRef = useState(null)

  const setTimer = useCallback((seconds) => {
    setTimeLeft(seconds)
  }, [])

  const startTimer = useCallback(() => {
    const val = parseInt(input)
    let current = timeLeft === 0 && input ? val : timeLeft
    if (!current || current <= 0) return
    setTimeLeft(current)
    jumpTo()

    if (intervalRef.current) return
    const id = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(id)
          intervalRef.current = null
          setRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    intervalRef.current = id
    setRunning(true)
  }, [input, timeLeft, intervalRef])

  const pauseTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
      setRunning(false)
    }
  }, [intervalRef])

  const resetTimer = useCallback(() => {
    pauseTimer()
    setTimeLeft(0)
    setInput('')
  }, [pauseTimer])

  const formatTime = (t) => {
    const h = Math.floor(t / 3600)
    const m = Math.floor((t % 3600) / 60)
    const s = t % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const presets = [
    { label: '1 min', value: 60 },
    { label: '5 min', value: 300 },
    { label: '10 min', value: 600 },
    { label: '15 min', value: 900 },
    { label: '30 min', value: 1800 },
    { label: '1 hour', value: 3600 },
  ]

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Countdown Timer"
      desc="Set a countdown timer with custom or preset durations. Start, pause, and reset anytime."
      icon="⏱️" iconBg="rgba(6,182,212,0.08)"
      category="text" slug="countdown-timer"
      faq={[
        { q: "How do I set a timer?", a: "Enter seconds in the input field or click a preset button, then click Start." },
        { q: "Can I pause and resume?", a: "Yes, click Pause to stop the timer and Start to resume from where it left off." },
      ]}
      howItWorks={[
        "Enter a time in seconds or click a preset duration.",
        "Click Start to begin the countdown.",
        "Use Pause to stop and Reset to start over.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Countdown Timer", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/countdown-timer/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white/[0.06] border-2 border-white/8 rounded-2xl p-6 text-center">
          <div className="font-mono text-5xl sm:text-6xl font-bold text-white mb-4 tracking-wider">
            {formatTime(timeLeft)}
          </div>
          <div className="flex gap-2 justify-center">
            <div className={`w-3 h-3 rounded-full ${running ? 'bg-emerald-400 animate-pulse' : timeLeft > 0 ? 'bg-amber-400' : 'bg-slate-600'}`} />
            <span className="text-sm text-slate-400">
              {running ? 'Running' : timeLeft > 0 ? 'Paused' : 'Ready'}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Seconds</label>
          <input type="number" value={input} onChange={e => setInput(e.target.value)}
            placeholder="Enter seconds (e.g. 300)" min="0"
            className={inputClass} />
        </div>

        <div className="flex flex-wrap gap-2">
          {presets.map(p => (
            <button key={p.value} onClick={() => { setInput(''); setTimeLeft(p.value); jumpTo() }}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-indigo-500/10 hover:border-indigo-500/20 transition-all">
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={startTimer}
            className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-400 transition-all active:scale-[0.98]">
            ▶ {running ? 'Resume' : 'Start'}
          </button>
          <button onClick={pauseTimer}
            className="flex-1 py-3 rounded-xl bg-amber-500 text-white font-bold text-sm hover:bg-amber-400 transition-all active:scale-[0.98]"
            disabled={!running}>
            ⏸ Pause
          </button>
          <button onClick={resetTimer}
            className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-400 transition-all active:scale-[0.98]">
            ↺ Reset
          </button>
        </div>

        <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
          <div className="text-4xl mb-3 opacity-20">⏱️</div>
          <p className="text-sm text-slate-600 font-medium">
            {timeLeft > 0 ? `${timeLeft} seconds remaining` : 'Set a time and click Start'}
          </p>
        </div>
      </div>
    </ToolLayout>
  )
}
