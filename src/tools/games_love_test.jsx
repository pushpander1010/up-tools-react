import { useState, useCallback, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const BANK = [
  { id:1, t:"I love spontaneous date nights.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:2, t:"Quality time matters more to me than gifts.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:3, t:"I enjoy public displays of affection.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:4, t:"I'd rather text all day than call.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:5, t:"I'm a planner; I like scheduling our dates.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:6, t:"I prefer cozy nights in over going out.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:7, t:"Surprises make me happy.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:8, t:"I want us to travel together often.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:9, t:"I'm comfortable resolving conflicts quickly.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:10, t:"I like posting our photos on social media.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:11, t:"I'm an early riser; morning dates are fine.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:12, t:"I'd adopt a pet together someday.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:13, t:"I enjoy cooking together.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:14, t:"I love handwritten notes or letters.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:15, t:"We should plan an annual trip.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:16, t:"I'm okay with long drives with just music & chats.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:17, t:"I prefer simple dates over fancy ones.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:18, t:"I'd like to learn a hobby together.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:19, t:"I'd move cities for love if needed.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:20, t:"I'm excited to plan our future home together.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:21, t:"Weekly movie night is a must.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:22, t:"I need frequent check-ins during the day.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:23, t:"I appreciate small acts of service.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:24, t:"I'd love dancing together, even at home.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:25, t:"I'm comfortable meeting each other's families.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:26, t:"I like celebrating little milestones.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:27, t:"I'm okay with sharing passwords someday.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:28, t:"I prefer voice notes over long texts.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:29, t:"We should have monthly budget dates (money talk!).", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:30, t:"I'd love a stargazing picnic together.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
]

const F_BEST = "cq-best", F_PLAYS = "cq-plays"

function mulberry32(seed) { let t = seed >>> 0; return () => { t += 0x6D2B79F5; let r = Math.imul(t ^ t >>> 15, 1 | t); r ^= r + Math.imul(r ^ r >>> 7, 61 | r); return ((r ^ r >>> 14) >>> 0) / 4294967296; }; }
function strHash(s) { let h = 2166136261 >>> 0; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

function selectQuestions(seed, n) {
  const rng = mulberry32(strHash(seed))
  const pool = [...BANK]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, n).map(q => q.id)
}

function getQ(idx) { return BANK.find(q => q.id === idx) }

let audioCtx = null
function ensureAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}
function playTone(freq, dur, type = 'triangle', vol = 0.06) {
  try {
    const ctx = ensureAudio()
    const osc = ctx.createOscillator(); const gain = ctx.createGain()
    osc.type = type; osc.frequency.value = freq
    g.gain.setValueAtTime(vol, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)
    osc.connect(gain); gain.connect(ctx.destination)
    osc.start(); osc.stop(ctx.currentTime + dur)
  } catch {}
}

function readLS(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }
function writeLS(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

export default function games_love_test() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [step, setStep] = useState('home')
  const [quizLength, setQuizLength] = useState(10)
  const [seed, setSeed] = useState('')
  const [qIdx, setQIdx] = useState([])
  const [cur, setCur] = useState(0)
  const [answersA, setAnswersA] = useState([])
  const [answersB, setAnswersB] = useState([])
  const [nameA, setNameA] = useState('')
  const [nameB, setNameB] = useState('')
  const [player, setPlayer] = useState('a')
  const [score, setScore] = useState(null)
  const [copied, setCopied] = useState(false)

  const best = readLS(F_BEST, null)
  const plays = readLS(F_PLAYS, 0)

  const startQuiz = useCallback(() => {
    const s = seed || Date.now().toString(36)
    setSeed(s)
    setQIdx(selectQuestions(s, quizLength))
    setCur(0); setAnswersA([]); setAnswersB([]); setScore(null); setStep('names')
  }, [quizLength, seed])

  const handleStartNames = () => {
    if (!nameA.trim() || !nameB.trim()) return
    setStep('a')
  }

  const handleAnswer = (val) => {
    const newAnswers = player === 'a' ? [...answersA] : [...answersB]
    newAnswers[cur] = val
    if (player === 'a') setAnswersA(newAnswers)
    else setAnswersB(newAnswers)

    if (cur < quizLength - 1) {
      setTimeout(() => setCur(c => c + 1), 150)
    } else if (player === 'a') {
      setStep('handoff')
    } else {
      let matches = 0
      for (let i = 0; i < quizLength; i++) { if (answersA[i] === val) matches++ }
      const finalScore = Math.round((matches / quizLength) * 100)
      setScore(finalScore)
      if (!best || finalScore > best.score) {
        writeLS(F_BEST, { score: finalScore, pair: `${nameA} & ${nameB}`, when: new Date().toLocaleDateString() })
      }
      writeLS(F_PLAYS, plays + 1)
      try {
        const ctx = ensureAudio()
        ;[523, 659, 784, 1047].forEach((f, i) => {
          setTimeout(() => {
            const o = ctx.createOscillator(), g = ctx.createGain()
            o.type = 'triangle'; o.frequency.value = f
            g.gain.setValueAtTime(0.06, ctx.currentTime)
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
            o.connect(g); g.connect(ctx.destination)
            o.start(); o.stop(ctx.currentTime + 0.35)
          }, i * 120)
        })
      } catch {}
      setStep('result')
    }
  }

  const handleNext = () => {
    if (step === 'handoff') { setPlayer('b'); setCur(0); setStep('b') }
    else if (step === 'result') { setStep('home'); setScore(null) }
  }

  const copyResult = () => {
    const msg = `Our love compatibility score on UpTools was ${score}% ❤️\nPlay it here: ${window.location.origin}/games/love-test/`
    navigator.clipboard?.writeText(msg)
    setCopied(true); setTimeout(() => setCopied(false), 1500)
  }

  const shareWA = () => {
    const msg = encodeURIComponent(`Our love compatibility score on UpTools was ${score}% ❤️\nPlay it here: ${window.location.origin}/games/love-test/`)
    window.open(`https://wa.me/?text=${msg}`, '_blank', 'noopener')
  }

  const q = qIdx[cur] !== undefined ? getQ(qIdx[cur]) : null
  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-pink-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Couple Compatibility Quiz ❤️ Romantic Love Test"
      desc="Two-player romantic quiz. Answer sweet prompts, compare with your partner, and get a love score."
      icon="❤️" iconBg="rgba(255,95,162,0.08)"
      category="fun" slug="games-love-test"
      faq={[
        { q: "How does the love test work?", a: "Both partners answer the same romantic questions. Your compatibility score is based on how many answers match." },
        { q: "Can I share the test?", a: "Yes! Use the WhatsApp or Copy buttons to share your result with your partner." },
      ]}
      howItWorks={[
        "Enter both partners' names and select quiz length.",
        "Partner 1 answers all romantic questions first.",
        "Hand the device to Partner 2 who answers the same questions.",
        "See your love compatibility score!",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "Couple Compatibility Quiz", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/love-test/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {step === 'home' && (
          <>
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center p-3 bg-black/20 rounded-xl">
                <div className="text-lg font-extrabold text-pink-400">{best ? `${best.score.toFixed(1)}%` : '--%'}</div>
                <div className="text-xs text-slate-500">Best Score</div>
              </div>
              <div className="text-center p-3 bg-black/20 rounded-xl">
                <div className="text-lg font-extrabold text-white">{best?.pair ?? '—'}</div>
                <div className="text-xs text-slate-500">Last Pair</div>
              </div>
              <div className="text-center p-3 bg-black/20 rounded-xl">
                <div className="text-lg font-extrabold text-white">{best?.when ?? '—'}</div>
                <div className="text-xs text-slate-500">Last Time</div>
              </div>
              <div className="text-center p-3 bg-black/20 rounded-xl">
                <div className="text-lg font-extrabold text-white">{plays}</div>
                <div className="text-xs text-slate-500">Total Plays</div>
              </div>
            </div>
            <div className="flex gap-2 justify-center">
              {[10, 15, 20].map(len => (
                <button key={len} onClick={() => setQuizLength(len)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${quizLength === len ? 'bg-pink-500/15 text-pink-400 border border-pink-500/30' : 'bg-white/[0.06] text-slate-500 border border-white/[0.08]'}`}>
                  {len === 10 ? 'Short' : len === 15 ? 'Standard' : 'Long'} ({len})
                </button>
              ))}
            </div>
            <div className="text-center">
              <button onClick={startQuiz}
                className="px-8 py-4 rounded-2xl text-sm font-bold text-white transition-all"
                style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}>
                💖 Start Quiz
              </button>
            </div>
            <p className="text-center text-xs text-slate-600">Best scores & last played are stored on this device only.</p>
          </>
        )}

        {step === 'names' && (
          <div className="bg-white/[0.06] border-2 border-white/8 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white text-center">❤️ Enter your names</h2>
            <div>
              <label className="block text-sm text-pink-400 mb-1">Partner 1 (answers first)</label>
              <input type="text" value={nameA} onChange={e => setNameA(e.target.value)} placeholder="Your name" maxLength={20} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm text-pink-400 mb-1">Partner 2 (answers second)</label>
              <input type="text" value={nameB} onChange={e => setNameB(e.target.value)} placeholder="Partner's name" maxLength={20} className={inputClass} />
            </div>
            <button onClick={handleStartNames} disabled={!nameA.trim() || !nameB.trim()}
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}>
              Start ▶
            </button>
          </div>
        )}

        {(step === 'a' || step === 'b') && q && (
          <div ref={resultRef} className="bg-white/[0.06] border-2 border-white/8 rounded-2xl p-6">
            <p className="text-sm text-pink-400 mb-1">{player === 'a' ? nameA : nameB}'s turn · Question {cur + 1} of {quizLength}</p>
            <h2 className="text-lg font-bold text-white mb-4">{q.t}</h2>
            <div className="space-y-3">
              {q.a.map((opt, i) => (
                <button key={i} onClick={() => handleAnswer(i)}
                  className="w-full text-left p-4 rounded-xl text-sm font-semibold bg-white/[0.06] border-2 border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/10 hover:border-pink-500/30 active:scale-[0.98] transition-all">
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'handoff' && (
          <div className="bg-white/[0.06] border-2 border-white/8 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-3">💕</div>
            <h2 className="text-xl font-bold text-white mb-2">{nameA} is done!</h2>
            <p className="text-pink-400 mb-6">Now hand the device to <strong>{nameB}</strong> to answer the same questions.</p>
            <button onClick={handleNext}
              className="px-8 py-3 rounded-xl text-sm font-bold text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}>
              {nameB}'s Turn ▶
            </button>
          </div>
        )}

        {step === 'result' && score !== null && (
          <div className="text-center p-8 bg-white/[0.06] border-2 border-white/8 rounded-2xl">
            <div className="text-4xl mb-2">{score >= 80 ? '💕' : score >= 60 ? '💗' : score >= 40 ? '🤍' : '💪'}</div>
            <div className="text-5xl font-extrabold text-pink-400 mb-2">{score}%</div>
            <div className="text-lg font-bold text-white mb-2">Love Compatibility Score</div>
            <p className="text-pink-400 mb-6">{nameA} & {nameB}: {score >= 80 ? 'You two are a perfect match! 💕' : score >= 60 ? 'Great chemistry! You complement each other well.' : score >= 40 ? 'Some differences make relationships exciting!' : 'Opposites attract! Keep discovering each other.'}</p>
            <div className="flex gap-3 justify-center mb-6">
              <button onClick={copyResult}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white'}`}>
                {copied ? '✓ Copied' : '📋 Copy Result'}
              </button>
              <button onClick={shareWA}
                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">
                📱 WhatsApp
              </button>
            </div>
            <button onClick={handleNext}
              className="px-8 py-3 rounded-xl text-sm font-bold text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}>
              Play Again ▶
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
