import { useState, useCallback, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const TEXTS = [
  "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump.",
  "Programming is the art of telling another human what one wants the computer to do. Code is like humor. When you have to explain it, it is bad.",
  "The best way to predict the future is to invent it. Technology is best when it brings people together. Innovation distinguishes between a leader and a follower.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. The only way to do great work is to love what you do.",
  "In the middle of every difficulty lies opportunity. Life is what happens when you are busy making other plans. The future belongs to those who believe in the beauty of their dreams.",
  "To be or not to be that is the question. All that glitters is not gold. The lady doth protest too much methinks. What a piece of work is a man.",
  "Science is not only a disciple of reason but also one of romance and passion. The universe is under no obligation to make sense to you. Look up at the stars and not down at your feet.",
  "The only true wisdom is in knowing you know nothing. It is during our darkest moments that we must focus to see the light. The way to get started is to quit talking and begin doing.",
  "Do not go where the path may lead, go instead where there is no path and leave a trail. The future is already here, it is just not evenly distributed.",
  "Every moment is a fresh beginning. Act as if what you do makes a difference. It does. The only impossible journey is the one you never begin.",
]

let audioCtx = null
function ensureAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

function playTone(freq, dur, type = 'sine', vol = 0.03) {
  try {
    const ctx = ensureAudio()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    gain.gain.setValueAtTime(vol, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)
    osc.connect(gain); gain.connect(ctx.destination)
    osc.start(); osc.stop(ctx.currentTime + dur)
  } catch {}
}

function pickText() { return TEXTS[Math.floor(Math.random() * TEXTS.length)] }

function calcWPM(charsTyped, errCount, elapsedSeconds) {
  if (elapsedSeconds <= 0) return 0
  const grossWords = charsTyped / 5
  const net = grossWords - errCount
  return Math.max(0, Math.round((net / elapsedSeconds) * 60))
}

function calcAccuracy(charsTyped, errCount) {
  if (charsTyped === 0) return 100
  return Math.max(0, Math.round(((charsTyped - errCount) / charsTyped) * 100))
}

export default function games_typing_speed() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [duration, setDuration] = useState(60)
  const [timeLeft, setTimeLeft] = useState(60)
  const [testStarted, setTestStarted] = useState(false)
  const [testFinished, setTestFinished] = useState(false)
  const [currentText, setCurrentText] = useState('')
  const [typed, setTyped] = useState('')
  const [errors, setErrors] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [startTime, setStartTime] = useState(null)
  const [typedCharsTotal, setTypedCharsTotal] = useState(0)
  const [errorsCompleted, setErrorsCompleted] = useState(0)
  const inputRef = useRef(null)
  const timerRef = useRef(null)

  const resetTest = useCallback((dur) => {
    clearInterval(timerRef.current)
    setTestStarted(false)
    setTestFinished(false)
    setTimeLeft(dur || duration)
    setTyped('')
    setErrors(0)
    setWpm(0)
    setAccuracy(100)
    setStartTime(null)
    setTypedCharsTotal(0)
    setErrorsCompleted(0)
    setCurrentText(pickText())
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [duration])

  useEffect(() => { resetTest() }, []) // eslint-disable-line

  useEffect(() => {
    if (!testStarted || testFinished) return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          setTestFinished(true)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [testStarted, testFinished])

  const handleInput = useCallback((e) => {
    if (testFinished) return
    const val = e.target.value
    setTyped(val)

    if (!testStarted && val.length > 0) {
      setTestStarted(true)
      setStartTime(Date.now())
    }

    // Sound on keypress
    if (val.length > typed.length) {
      const lastIdx = val.length - 1
      if (val[lastIdx] === currentText[lastIdx]) {
        playTone(800, 0.05, 'sine', 0.02)
      } else {
        playTone(120, 0.15, 'sawtooth', 0.05)
      }
    }

    // Count errors for current segment
    let segErrors = 0
    for (let i = 0; i < val.length; i++) {
      if (val[i] !== currentText[i]) segErrors++
    }
    const totalChars = typedCharsTotal + val.length
    const totalErrors = errorsCompleted + segErrors
    setErrors(totalErrors)
    setAccuracy(calcAccuracy(totalChars, totalErrors))

    if (testStarted && startTime) {
      const elapsed = (Date.now() - startTime) / 1000
      setWpm(calcWPM(totalChars, totalErrors, elapsed))
    }

    // Auto-advance if text complete
    if (val.length >= currentText.length) {
      setTypedCharsTotal(prev => prev + val.length)
      setErrorsCompleted(prev => prev + segErrors)
      setCurrentText(pickText())
      setTyped('')
    }
  }, [testStarted, testFinished, currentText, typed, startTime, typedCharsTotal, errorsCompleted])

  // When timer ends, finalize stats
  useEffect(() => {
    if (testFinished && startTime) {
      const elapsed = (Date.now() - startTime) / 1000
      let segErrors = 0
      for (let i = 0; i < typed.length; i++) {
        if (typed[i] !== currentText[i]) segErrors++
      }
      const totalChars = typedCharsTotal + typed.length
      const totalErrors = errorsCompleted + segErrors
      setWpm(calcWPM(totalChars, totalErrors, elapsed))
      setAccuracy(calcAccuracy(totalChars, totalErrors))
      setErrors(totalErrors)
      try { playTone(440, 0.25, 'triangle', 0.06); setTimeout(() => playTone(349, 0.25, 'triangle', 0.06), 150) } catch {}
    }
  }, [testFinished]) // eslint-disable-line

  const handleDurationChange = (d) => {
    setDuration(d)
    resetTest(d)
  }

  const progressPct = duration ? ((duration - timeLeft) / duration) * 100 : 0

  return (
    <ToolLayout
      title="Typing Speed Test - WPM Test Online Free"
      desc="Test your typing speed and accuracy. Free WPM (words per minute) typing test with real-time tracking."
      icon="⌨️" iconBg="rgba(6,182,212,0.08)"
      category="fun" slug="games-typing-speed"
      faq={[
        { q: "What is WPM?", a: "Words Per Minute — the standard measure of typing speed. One word equals 5 characters." },
        { q: "How is accuracy calculated?", a: "Accuracy = (total characters typed - errors) / total characters typed × 100%." },
      ]}
      howItWorks={[
        "Select your preferred duration (30s, 1min, or 2min).",
        "Click the input field and start typing the displayed text.",
        "WPM, accuracy, and errors update in real-time.",
        "When the text ends, a new paragraph loads automatically.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Typing Speed Test", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/typing-speed/",
        "genre": ["Educational", "Quick Play"],
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Duration selector */}
        <div className="flex gap-2 items-center">
          {[30, 60, 120].map(d => (
            <button key={d} onClick={() => handleDurationChange(d)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                duration === d
                  ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                  : 'bg-white/[0.06] text-slate-500 border border-white/[0.08]'
              }`}>
              {d === 30 ? '30 seconds' : d === 60 ? '1 minute' : '2 minutes'}
            </button>
          ))}
        </div>

        {/* Text display */}
        <div ref={resultRef} className="p-4 bg-black/20 rounded-xl text-base leading-relaxed font-mono min-h-[80px]">
          {currentText.split('').map((c, i) => {
            let cls = 'text-slate-600'
            if (i < typed.length) cls = typed[i] === c ? 'text-emerald-400' : 'text-red-400 bg-red-500/20'
            else if (i === typed.length) cls = 'text-white border-b-2 border-indigo-400'
            return <span key={i} className={cls}>{c === ' ' ? '\u00A0' : c}</span>
          })}
        </div>

        {/* Input */}
        <input ref={inputRef} type="text" value={typed} onChange={handleInput} disabled={testFinished}
          placeholder="Click here and start typing…"
          autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
          className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600" />

        {/* Progress bar */}
        <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${progressPct}%` }}/>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center p-3 bg-black/20 rounded-xl">
            <div className="text-xl font-extrabold text-white">{wpm}</div>
            <div className="text-xs text-slate-500">WPM</div>
          </div>
          <div className="text-center p-3 bg-black/20 rounded-xl">
            <div className="text-xl font-extrabold text-white">{accuracy}%</div>
            <div className="text-xs text-slate-500">Accuracy</div>
          </div>
          <div className="text-center p-3 bg-black/20 rounded-xl">
            <div className="text-xl font-extrabold text-white">{timeLeft}</div>
            <div className="text-xs text-slate-500">Time Left</div>
          </div>
          <div className="text-center p-3 bg-black/20 rounded-xl">
            <div className="text-xl font-extrabold text-white">{errors}</div>
            <div className="text-xs text-slate-500">Errors</div>
          </div>
        </div>

        {/* Result */}
        {testFinished && (
          <div className="text-center p-8 bg-white/[0.06] border-2 border-white/8 rounded-2xl">
            <div className="text-5xl font-extrabold text-indigo-400 mb-2">{wpm}</div>
            <p className="text-slate-400 mb-4">Words Per Minute</p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div><div className="text-lg font-bold text-white">{accuracy}%</div><div className="text-xs text-slate-500">Accuracy</div></div>
              <div><div className="text-lg font-bold text-white">{errors}</div><div className="text-xs text-slate-500">Errors</div></div>
              <div><div className="text-lg font-bold text-white">{typedCharsTotal + typed.length}</div><div className="text-xs text-slate-500">Characters</div></div>
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={() => resetTest()}
                className="px-6 py-3 rounded-xl text-sm font-bold text-white transition-all"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                Try Again
              </button>
              <button onClick={() => { setTestFinished(false); resetTest() }}
                className="px-6 py-3 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">
                Change Duration
              </button>
            </div>
          </div>
        )}

        {/* Controls */}
        {!testFinished && (
          <div className="text-center">
            <button onClick={() => resetTest()}
              className="px-6 py-3 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">
              ↺ Restart
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
