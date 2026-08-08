import { useState, useCallback, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'
import useFullscreen from '../hooks/useFullscreen'
import GameAdSlot from '../components/GameAdSlot'
import InterstitialAd from '../components/InterstitialAd'

const BANK = [
  { id:1, t:"I prefer texting over calling.", a:["Always","Usually","Rarely","Never"] },
  { id:2, t:"I'm the one who plans our hangouts.", a:["Always","Usually","Rarely","Never"] },
  { id:3, t:"I'd rather stay in than go out.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:4, t:"I remember important dates (birthdays, anniversaries).", a:["Always","Usually","Rarely","Never"] },
  { id:5, t:"I'm the one who starts conversations.", a:["Always","Usually","Rarely","Never"] },
  { id:6, t:"I share food without being asked.", a:["Always","Usually","Rarely","Never"] },
  { id:7, t:"I'm brutally honest even if it hurts.", a:["Always","Usually","Rarely","Never"] },
  { id:8, t:"I'd drop everything for a friend in need.", a:["Always","Usually","Rarely","Never"] },
  { id:9, t:"I enjoy long deep conversations.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:10, t:"I'm the funny one in the group.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:11, t:"I keep secrets well.", a:["Always","Usually","Rarely","Never"] },
  { id:12, t:"I'm the one who suggests new activities.", a:["Always","Usually","Rarely","Never"] },
  { id:13, t:"I get jealous when my friend hangs out with others.", a:["Always","Usually","Rarely","Never"] },
  { id:14, t:"I prefer small gatherings over big parties.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:15, t:"I'm the one who apologizes first after a fight.", a:["Always","Usually","Rarely","Never"] },
  { id:16, t:"I enjoy giving gifts and surprises.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:17, t:"I'm a good listener.", a:["Always","Usually","Rarely","Never"] },
  { id:18, t:"I'd travel with my best friend.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:19, t:"I'm the one who takes photos for memories.", a:["Always","Usually","Rarely","Never"] },
  { id:20, t:"I'd be friends with this person for life.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:21, t:"I'm usually the last one to leave a party.", a:["Always","Usually","Rarely","Never"] },
  { id:22, t:"I overshare personal stories quickly.", a:["Always","Usually","Rarely","Never"] },
  { id:23, t:"I'd rather text a voice note than a message.", a:["Always","Usually","Rarely","Never"] },
  { id:24, t:"I forgive easily after being hurt.", a:["Always","Usually","Rarely","Never"] },
  { id:25, t:"I plan my weekends in advance.", a:["Always","Usually","Rarely","Never"] },
  { id:26, t:"I finish things I start.", a:["Always","Usually","Rarely","Never"] },
  { id:27, t:"I'm easily embarrassed.", a:["Always","Usually","Rarely","Never"] },
  { id:28, t:"I laugh at my own jokes.", a:["Always","Usually","Rarely","Never"] },
  { id:29, t:"I check my phone constantly even with company.", a:["Always","Usually","Rarely","Never"] },
  { id:30, t:"I'm spontaneous and go with the flow.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:31, t:"I worry about what others think of me.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:32, t:"I'm the peacemaker in conflicts.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:33, t:"I'd try bungee jumping without hesitation.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:34, t:"I talk in my sleep or walk in my sleep.", a:["Always","Usually","Rarely","Never"] },
  { id:35, t:"I eat dessert before the main course.", a:["Always","Usually","Rarely","Never"] },
  { id:36, t:"I sing out loud even when others can hear.", a:["Always","Usually","Rarely","Never"] },
  { id:37, t:"I'm the first to dance at a party.", a:["Always","Usually","Rarely","Never"] },
  { id:38, t:"I hold grudges longer than I should.", a:["Always","Usually","Rarely","Never"] },
  { id:39, t:"I'd rather be early than fashionably late.", a:["Always","Usually","Rarely","Never"] },
  { id:40, t:"I believe friends should tell each other everything.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
]

const F_BEST = 'ft-best', F_PLAYS = 'ft-plays'

// --- share-link encoding: pack a quiz + player A's answers into a URL ---
const enc = encodeURIComponent
const dec = decodeURIComponent
function encodeAnswers(a) { return a.map(v => v ?? '').join(',') }
function decodeAnswers(s) { return (s || '').split(',').map(x => (x === '' ? null : Number(x))) }
function parseShare() {
  const p = new URLSearchParams(window.location.search)
  if (!p.get('seed')) return null
  return {
    seed: p.get('seed'),
    len: Math.min(20, Math.max(5, Number(p.get('len')) || 10)),
    nameA: p.get('nameA') ? dec(p.get('nameA')) : '',
    ansA: decodeAnswers(p.get('ansA') || ''),
  }
}
function buildShareUrl(seed, len, nameA, ansA) {
  const base = window.location.origin + '/games/friendship-test/'
  return `${base}?seed=${enc(seed)}&len=${len}&nameA=${enc(nameA)}&ansA=${enc(encodeAnswers(ansA))}`
}

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
function playTone(freq, dur, type = 'sine', vol = 0.12) {
  try {
    const ctx = ensureAudio()
    const osc = ctx.createOscillator(); const gain = ctx.createGain()
    osc.type = type; osc.frequency.setValueAtTime(freq, ctx.currentTime)
    gain.gain.setValueAtTime(vol, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)
    osc.connect(gain); gain.connect(ctx.destination)
    osc.start(); osc.stop(ctx.currentTime + dur)
  } catch {}
}

function readLS(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }
function writeLS(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

export default function games_friendship_test() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [step, setStep] = useState('home') // home, names, a, handoff, b, result
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
  const [shareUrl, setShareUrl] = useState('')
  const [shared, setShared] = useState(null) // { seed, len, nameA, ansA } when opened via link
  const { isFs, toggle: toggleFs, onChange: onFsChange } = useFullscreen()
  const [showAd, setShowAd] = useState(false)
  const pendingAction = useRef(null)
  const triggerAd = useCallback((action) => { pendingAction.current = action; setShowAd(true) }, [])
  const onAdDismiss = useCallback(() => { setShowAd(false); if (pendingAction.current) { pendingAction.current(); pendingAction.current = null } }, [])

  const best = readLS(F_BEST, null)
  const plays = readLS(F_PLAYS, 0)

  const startQuiz = useCallback(() => {
    const s = seed || Date.now().toString(36)
    setSeed(s)
    setQIdx(selectQuestions(s, quizLength))
    setCur(0)
    setAnswersA([]); setAnswersB([])
    setScore(null)
    setShared(null)
    setShareUrl('')
    setStep('names')
  }, [quizLength, seed])

  const handleStartNames = () => {
    if (shared) {
      // Friend opening a shared link: only their name is needed, then they answer
      if (!nameB.trim()) return
      setStep('b')
    } else {
      if (!nameA.trim() || !nameB.trim()) return
      setStep('a')
    }
  }

  const handleAnswer = (val) => {
    const newAnswers = player === 'a' ? [...answersA] : [...answersB]
    newAnswers[cur] = val
    if (player === 'a') setAnswersA(newAnswers)
    else setAnswersB(newAnswers)

    playTone(860, 0.07, 'sine', 0.03)

    if (cur < quizLength - 1) {
      setTimeout(() => setCur(c => c + 1), 150)
    } else if (player === 'a') {
      setStep('handoff')
    } else {
      // Calculate score: count matching answers across the full answer sets
      let matches = 0
      for (let i = 0; i < quizLength; i++) {
        if (answersA[i] === newAnswers[i]) matches++
      }
      const finalScore = Math.round((matches / quizLength) * 100)
      setScore(finalScore)
      if (!best || finalScore > best.score) {
        writeLS(F_BEST, { score: finalScore, pair: `${nameA} & ${nameB}`, when: new Date().toLocaleDateString() })
      }
      writeLS(F_PLAYS, plays + 1)
      playTone(783.99, 0.18, 'sine', 0.13)
      setTimeout(() => playTone(1046.50, 0.25, 'sine', 0.13), 150)
      setTimeout(() => playTone(1318.51, 0.35, 'triangle', 0.10), 300)
      setStep('result')
    }
  }

  const handleNext = () => {
    if (step === 'handoff') {
      setPlayer('b'); setCur(0); setStep('b')
    } else if (step === 'result') {
      setStep('home'); setScore(null); setShared(null); setShareUrl('')
    }
  }

  const copyResult = () => {
    const msg = `Our BFF score on UpTools was ${score}% 👫\nPlay it here: ${window.location.origin}/games/friendship-test/`
    if (navigator.share) {
      navigator.share({ title: 'Friendship Test Result', text: msg }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(msg).then(() => {
        setCopied(true); setTimeout(() => setCopied(false), 1500)
      }).catch(() => {
        setCopied(true); setTimeout(() => setCopied(false), 1500)
      })
    }
  }

  const shareWA = () => {
    const msg = encodeURIComponent(`Our BFF score on UpTools was ${score}% 👫\nPlay it here: ${window.location.origin}/games/friendship-test/`)
    window.open(`https://wa.me/?text=${msg}`, '_blank', 'noopener')
  }

  // Player A finished → build a link carrying their answers so a friend can answer on their own device
  const prepareShare = useCallback(() => {
    const url = buildShareUrl(seed, quizLength, nameA, answersA)
    setShareUrl(url)
    return url
  }, [seed, quizLength, nameA, answersA])

  const shareToFriend = useCallback(() => {
    const url = prepareShare()
    const msg = `I answered a BFF quiz on UpTools — now it's your turn! 👫\nAnswer the same questions here: ${url}`
    if (navigator.share) {
      navigator.share({ title: 'Best Friend Compatibility Test', text: msg }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(msg).then(() => {
        setCopied(true); setTimeout(() => setCopied(false), 1500)
      }).catch(() => {
        setCopied(true); setTimeout(() => setCopied(false), 1500)
      })
    }
  }, [prepareShare])

  const shareToFriendWA = useCallback(() => {
    const url = prepareShare()
    const msg = encodeURIComponent(`I answered a BFF quiz on UpTools — now it's your turn! 👫\nAnswer the same questions here: ${url}`)
    window.open(`https://wa.me/?text=${msg}`, '_blank', 'noopener')
  }, [prepareShare])

  const q = qIdx[cur] !== undefined ? getQ(qIdx[cur]) : null
  const inputClass = "w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"

  useEffect(() => {
    const handler = () => onFsChange()
    document.addEventListener('fullscreenchange', handler)
    document.addEventListener('webkitfullscreenchange', handler)
    return () => { document.removeEventListener('fullscreenchange', handler); document.removeEventListener('webkitfullscreenchange', handler) }
  }, [onFsChange])

  // If opened via a shared link, reconstruct the quiz + player A's answers and start Player B's turn
  useEffect(() => {
    const s = parseShare()
    if (!s) return
    setShared(s)
    setNameA(s.nameA || 'Your friend')
    setSeed(s.seed)
    setQuizLength(s.len)
    setQIdx(selectQuestions(s.seed, s.len))
    setAnswersA(s.ansA)
    setAnswersB([])
    setPlayer('b')
    setCur(0)
    setScore(null)
    setStep('names') // Player B enters their name, then answers the same questions
  }, [])

  return (
    <ToolLayout
      title="Best Friend Compatibility Test 👫 How Well Do You Know Each Other"
      hideHeader={isFs}
      desc="Two-player friendship quiz. Answer questions about each other and see your BFF score!"
      icon="👫" iconBg="rgba(99,102,241,0.08)"
      category="fun" slug="games-friendship-test"
      faq={[
        { q: "How does the friendship test work?", a: "Player 1 answers all questions first, then Player 2 answers the same questions. Your compatibility score is based on how many answers match. You can play on one device, or Player 1 can share a link so Player 2 answers on their own phone." },
        { q: "Is the test free?", a: "Yes, completely free with no sign-up required. Scores are saved locally on your device only." },
      ]}
      howItWorks={[
        "Enter both players' names and select quiz length.",
        "Player 1 answers all questions first.",
        "Share the link with your friend so they answer on their own device — or hand them the device.",
        "Both answer the same questions, then see your BFF compatibility score!",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "Best Friend Compatibility Test", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/friendship-test/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <InterstitialAd show={showAd} onDismiss={onAdDismiss} countdown={3} />
      <div className="flex gap-4 max-w-6xl mx-auto overflow-hidden">
        <div className="hidden lg:block w-[160px] shrink-0 sticky top-24 self-start">
          <GameAdSlot slot="3494503358" format="vertical" className="mt-2" width={160} height={600} />
        </div>
        <div className="flex-1 min-w-0 max-w-2xl mx-auto space-y-5 overflow-hidden">
        {/* Home screen */}
        {step === 'home' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center glass p-4 rounded-xl">
                <div className="text-2xl font-extrabold text-white">{best ? `${best.score}%` : '--%'}</div>
                <div className="text-xs text-slate-400">Best Score</div>
              </div>
              <div className="text-center glass p-4 rounded-xl">
                <div className="text-2xl font-extrabold text-white">{best?.pair ?? '—'}</div>
                <div className="text-xs text-slate-400">Last Pair</div>
              </div>
              <div className="text-center glass p-4 rounded-xl">
                <div className="text-2xl font-extrabold text-white">{best?.when ?? '—'}</div>
                <div className="text-xs text-slate-400">Last Time</div>
              </div>
              <div className="text-center glass p-4 rounded-xl">
                <div className="text-2xl font-extrabold text-white">{plays}</div>
                <div className="text-xs text-slate-400">Total Plays</div>
              </div>
            </div>

            {/* Quiz length */}
            <div className="flex gap-2 justify-center">
              {[10, 15, 20].map(len => (
                <button key={len} onClick={() => setQuizLength(len)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${quizLength === len ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30' : 'bg-white/[0.06] text-slate-400 border border-white/[0.08] hover:bg-white/[0.1]'}`}>
                  {len === 10 ? 'Short' : len === 15 ? 'Standard' : 'Long'} ({len})
                </button>
              ))}
            </div>

            {/* Start button */}
            <div className="text-center">
              <button onClick={() => triggerAd(startQuiz)}
                className="glow-btn px-8 py-4 rounded-2xl text-sm font-bold text-white transition-all">
                Start Quiz
              </button>
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={toggleFs} className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all" title="Fullscreen">
                {isFs ? '⊡' : '⛶'}
              </button>
            </div>
            <p className="text-center text-xs text-slate-600">Scores saved on this device only.</p>
          </>
        )}

        {/* Name entry */}
        {step === 'names' && shared ? (
          <div className="glass rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-bold text-white text-center">👫 You're invited!</h2>
            <p className="text-sm text-indigo-400 text-center"><strong>{nameA}</strong> already answered the quiz. Now it's your turn to answer the same questions.</p>
            <div>
              <label className="block text-sm text-indigo-400 mb-1">Your name</label>
              <input type="text" value={nameB} onChange={e => setNameB(e.target.value)}
                placeholder="Your name" maxLength={20} className={inputClass} />
            </div>
            <button onClick={handleStartNames} disabled={!nameB.trim()}
              className="glow-btn w-full py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50">
              Start Answering ▶
            </button>
          </div>
        ) : step === 'names' && (
          <div className="glass rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-bold text-white text-center">👫 Enter your names</h2>
            <div>
              <label className="block text-sm text-indigo-400 mb-1">Player 1 (answers first)</label>
              <input type="text" value={nameA} onChange={e => setNameA(e.target.value)}
                placeholder="Your name" maxLength={20} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm text-indigo-400 mb-1">Player 2 (answers second)</label>
              <input type="text" value={nameB} onChange={e => setNameB(e.target.value)}
                placeholder="Friend's name" maxLength={20} className={inputClass} />
            </div>
            <button onClick={handleStartNames} disabled={!nameA.trim() || !nameB.trim()}
              className="glow-btn w-full py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50">
              Start ▶
            </button>
          </div>
        )}

        {/* Quiz questions */}
        {(step === 'a' || step === 'b') && q && (
          <div ref={resultRef} className="glass rounded-2xl p-6">
            <p className="text-sm text-indigo-400 mb-1">{player === 'a' ? nameA : nameB}'s turn · Question {cur + 1} of {quizLength}</p>
            <h2 className="text-lg font-bold text-white mb-4">{q.t}</h2>
            <div className="space-y-3">
              {q.a.map((opt, i) => (
                <button key={i} onClick={() => handleAnswer(i)}
                  className="w-full text-left p-4 rounded-xl text-sm font-semibold bg-white/[0.06] border-2 border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/10 hover:border-indigo-500/30 active:scale-[0.98] transition-all">
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Handoff screen */}
        {step === 'handoff' && (
          <div className="glass rounded-2xl p-8 text-center">
            <div className="text-4xl mb-3">🤝</div>
            <h2 className="text-xl font-bold text-white mb-2">{nameA} is done!</h2>
            <p className="text-indigo-400 mb-4">Two ways to continue:</p>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 mb-4">
              <p className="text-sm text-slate-300 font-semibold mb-2">📲 Option 1 — Share with your friend</p>
              <p className="text-sm text-slate-400 mb-3">Send {nameA}'s answers to your friend so they can answer on their own phone. You'll both see the score.</p>
              <div className="flex gap-2 justify-center mb-2">
                <button onClick={shareToFriend}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:bg-white/[0.1] ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/[0.06] border border-white/[0.08] text-slate-300 hover:text-white'}`}>
                  {copied ? '✓ Copied!' : '🔗 Copy Share Link'}
                </button>
                <button onClick={shareToFriendWA}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.1] transition-all">
                  📱 WhatsApp
                </button>
              </div>
              {shareUrl && (
                <p className="text-xs text-slate-500 break-all bg-white/[0.04] rounded-lg p-2">{shareUrl}</p>
              )}
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 mb-6">
              <p className="text-sm text-slate-300 font-semibold mb-1">🤝 Option 2 — Same device</p>
              <p className="text-sm text-slate-400 mb-3">Hand the device to <strong>{nameB}</strong> to answer the same questions.</p>
              <p className="text-xs text-slate-500 mb-3">Don't peek at {nameA}'s answers!</p>
              <button onClick={handleNext}
                className="glow-btn w-full py-3 rounded-xl text-sm font-bold text-white transition-all">
                {nameB}'s Turn on This Device ▶
              </button>
            </div>
          </div>
        )}

        {/* Result */}
        {step === 'result' && score !== null && (
          <div className="text-center p-8 glass rounded-2xl">
            <div className="text-4xl mb-2">{score >= 80 ? '🏆' : score >= 60 ? '🌟' : score >= 40 ? '👍' : '💪'}</div>
            <div className="text-5xl font-extrabold text-indigo-400 mb-2">{score}%</div>
            <div className="text-lg font-bold text-white mb-2">BFF Compatibility Score</div>
            <p className="text-indigo-400 mb-6">{nameA} & {nameB}: {score >= 80 ? 'You two are basically the same person!' : score >= 60 ? 'Great friendship! You know each other well.' : score >= 40 ? 'Good friends with room to grow closer!' : 'You have a lot to learn about each other!'}</p>

            <div className="flex gap-3 justify-center mb-6">
              <button onClick={copyResult}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:bg-white/[0.1] ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white'}`}>
                {copied ? '✓ Copied' : '📋 Copy Result'}
              </button>
              <button onClick={shareWA}
                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all">
                📱 WhatsApp
              </button>
            </div>

            <button onClick={handleNext}
              className="glow-btn px-8 py-3 rounded-xl text-sm font-bold text-white transition-all">
              Play Again ▶
            </button>
          </div>
        )}
        </div>
        <div className="hidden lg:block w-[160px] shrink-0 sticky top-24 self-start">
          <GameAdSlot slot="3414612309" format="vertical" className="mt-2" width={160} height={600} />
        </div>
      </div>
      <div className="w-full max-w-6xl mx-auto px-5">
  <GameAdSlot slot="8865234201" format="horizontal" className="mt-2" />
</div>
    </ToolLayout>
  )
}
