import { useState, useRef, useCallback, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'

const MODES = [
  { key: 'focus', label: '🍅 Focus', mins: 25, color: '#ef4444' },
  { key: 'short', label: '☕ Short Break', mins: 5, color: '#22c55e' },
  { key: 'long', label: '🌴 Long Break', mins: 15, color: '#6366f1' },
]

export default function pomodoro_timer() {
  const [mode, setMode] = useState('focus')
  const [seconds, setSeconds] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [completed, setCompleted] = useState(0)
  const intervalRef = useRef(null)

  const mins = MODES.find(m => m.key === mode).mins

  const fmt = (s) => {
    const m = String(Math.floor(s / 60)).padStart(2, '0')
    const sec = String(s % 60).padStart(2, '0')
    return `${m}:${sec}`
  }

  const switchMode = useCallback((key) => {
    clearInterval(intervalRef.current)
    setRunning(false)
    setMode(key)
    setSeconds(MODES.find(m => m.key === key).mins * 60)
  }, [])

  const toggle = useCallback(() => {
    if (running) {
      clearInterval(intervalRef.current)
      setRunning(false)
    } else {
      setRunning(true)
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            setCompleted(c => c + 1)
            if (Notification.permission === 'granted') {
              new Notification('Pomodoro', { body: 'Session complete! 🎉' })
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
  }, [running])

  const reset = useCallback(() => {
    clearInterval(intervalRef.current)
    setRunning(false)
    setSeconds(mins * 60)
  }, [mins])

  useEffect(() => () => clearInterval(intervalRef.current), [])

  const progress = 1 - seconds / (mins * 60)
  const circumference = 2 * Math.PI * 120
  const offset = circumference * (1 - progress)
  const activeMode = MODES.find(m => m.key === mode)

  return (
    <ToolLayout
      title="Pomodoro Timer"
      desc="Stay focused with the Pomodoro Technique. 25-minute focus sessions with short and long breaks."
      icon="🍅" iconBg="rgba(239,68,68,0.08)"
      category="productivity" slug="pomodoro-timer"
      faq={[
        { q: 'What is the Pomodoro Technique?', a: 'A time management method: work for 25 minutes, then take a 5-minute break. After 4 sessions, take a longer 15-minute break.' },
        { q: 'Can I customize durations?', a: 'Currently the durations are fixed at 25/5/15 minutes following the classic technique.' },
      ]}
      howItWorks={[
        'Select a mode: Focus, Short Break, or Long Break.',
        'Click Start to begin the countdown.',
        'When the timer ends, switch to the next session.',
        'Track your completed sessions with the counter.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Pomodoro Timer", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/pomodoro-timer/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-md mx-auto space-y-6">
        {/* Mode Tabs */}
        <div className="flex gap-2">
          {MODES.map(m => (
            <button key={m.key} onClick={() => switchMode(m.key)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border-2 ${mode === m.key
                ? 'border-white/20 text-white' : 'bg-white/[0.04] border-white/8 text-slate-500 hover:text-white'}`}
              style={mode === m.key ? { background: `${m.color}20`, borderColor: `${m.color}40`, color: m.color } : {}}>
              {m.label}
            </button>
          ))}
        </div>

        {/* Timer Circle */}
        <div className="flex flex-col items-center py-8">
          <div className="relative w-64 h-64">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 256 256">
              <circle cx="128" cy="128" r="120" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
              <circle cx="128" cy="128" r="120" fill="none" stroke={activeMode.color} strokeWidth="6"
                strokeDasharray={circumference} strokeDashoffset={offset}
                strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s linear' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-5xl font-mono font-bold text-white tracking-wider">{fmt(seconds)}</div>
              <div className="text-sm text-slate-400 mt-2">{activeMode.label}</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <button onClick={toggle}
            className="glow-btn flex-1 py-4 rounded-2xl text-sm font-bold"
            style={{ background: `linear-gradient(135deg, ${activeMode.color}, ${activeMode.color}cc)` }}>
            {running ? '⏸️ Pause' : '▶️ Start'}
          </button>
          <button onClick={reset}
            className="px-5 py-4 rounded-2xl text-sm font-bold bg-white/[0.06] border border-white/8 text-slate-400 hover:text-white transition-all">
            🔄 Reset
          </button>
        </div>

        {/* Session Counter */}
        <div className="bg-white/[0.06] border border-white/8 rounded-2xl p-4 text-center">
          <div className="text-xs text-slate-500 mb-2">Sessions Completed</div>
          <div className="text-3xl font-extrabold text-white">{completed}</div>
          <div className="text-xs text-slate-600 mt-1">{Array(completed).fill('🍅').join(' ')}</div>
        </div>
      </div>
    </ToolLayout>
  )
}
