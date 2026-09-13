import { useState, useCallback, useEffect, useRef } from 'react'
import GameShell from '../components/GameShell'

const IMG = '/games/friendship-test'

const CAT = {
  fav: '🌟 Favorites',
  food: '🍕 Food',
  fun: '😂 Fun',
  deep: '💭 Deep',
  hab: '⚡ Habits',
  soc: '👫 Social',
  adv: '🧭 Adventure',
}

// "About me" bank — the creator answers about themselves, friends guess.
const BANK = [
  { id:1, c:'fav', t:"My favorite color:", a:["Blue","Black","Red","Pink"] },
  { id:2, c:'fav', t:"My favorite movie genre:", a:["Comedy","Action","Horror","Romance"] },
  { id:3, c:'fav', t:"My favorite music vibe:", a:["Bollywood hits","Lo-fi chill","Hip-hop and rap","Old classics"] },
  { id:4, c:'fav', t:"My favorite season:", a:["Summer","Monsoon","Winter","Spring"] },
  { id:5, c:'fav', t:"My dream holiday spot:", a:["Goa beaches","Manali mountains","Dubai city life","Bali vibes"] },
  { id:6, c:'fav', t:"My favorite sport to watch:", a:["Cricket","Football","Kabaddi","I don't watch sports"] },
  { id:7, c:'fav', t:"Chai or coffee person:", a:["Chai, always","Coffee first","Cold drink","Just water"] },
  { id:8, c:'fav', t:"My phone team:", a:["Android forever","iPhone only","Whatever works","Basic phone era"] },
  { id:9, c:'food', t:"My comfort food:", a:["Pizza","Biryani","Momos","Dal-chawal"] },
  { id:10, c:'food', t:"My go-to dessert:", a:["Ice cream","Chocolate cake","Gulab jamun","Brownies"] },
  { id:11, c:'food', t:"At a buffet I go straight for:", a:["Desserts first","Mains and protein","A bit of everything","Salads, obviously"] },
  { id:12, c:'food', t:"My spice tolerance:", a:["Extra spicy always","Medium","Mild please","No spice at all"] },
  { id:13, c:'food', t:"My cooking skills:", a:["Chef level","Decent","Maggi only","Fire hazard"] },
  { id:14, c:'food', t:"I eat dessert:", a:["Before the meal","After the meal","Instead of the meal","What's dessert"] },
  { id:15, c:'fun', t:"Pick a superpower for me:", a:["Read minds","Time travel","Invisibility","Super strength"] },
  { id:16, c:'fun', t:"In a horror movie I:", a:["Scream first","Laugh at jump scares","Cover my eyes","Sleep through it"] },
  { id:17, c:'fun', t:"My guilty pleasure show:", a:["Reality TV","Daily soaps","Anime","True crime"] },
  { id:18, c:'fun', t:"I laugh at my own jokes:", a:["Always","Usually","Rarely","Never"] },
  { id:19, c:'fun', t:"I sing out loud when others can hear:", a:["Always","Usually","Rarely","Never"] },
  { id:20, c:'fun', t:"I'm the first to dance at a party:", a:["Always","Usually","Rarely","Never"] },
  { id:21, c:'fun', t:"I talk or walk in my sleep:", a:["Always","Usually","Rarely","Never"] },
  { id:22, c:'fun', t:"I'm easily embarrassed:", a:["Always","Usually","Rarely","Never"] },
  { id:23, c:'fun', t:"My wallet is:", a:["Full and organized","Cards everywhere","Empty but hopeful","Digital only"] },
  { id:24, c:'fun', t:"Pick a pet for me:", a:["Dog","Cat","Something exotic","No pets for me"] },
  { id:25, c:'deep', t:"My biggest fear:", a:["Heights","Creepy crawlies","Being alone","Missing out"] },
  { id:26, c:'deep', t:"I cry during movies:", a:["Always","Sometimes","Rarely","Never"] },
  { id:27, c:'deep', t:"I handle stress by:", a:["Talking it out","Music and solitude","Snacks","Ignoring it exists"] },
  { id:28, c:'deep', t:"I forgive easily after being hurt:", a:["Always","Usually","Rarely","Never"] },
  { id:29, c:'deep', t:"I hold grudges:", a:["Longer than I should","A day or two","Rarely","Never"] },
  { id:30, c:'deep', t:"I'm brutally honest even if it hurts:", a:["Always","Usually","Rarely","Never"] },
  { id:31, c:'deep', t:"I'd drop everything for a friend in need:", a:["Always","Usually","Rarely","Never"] },
  { id:32, c:'deep', t:"I enjoy long deep conversations:", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:33, c:'deep', t:"Friends should tell each other everything:", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:34, c:'deep', t:"My dream job involves:", a:["Travel","Tech","Art","Being my own boss"] },
  { id:35, c:'hab', t:"I reply to messages:", a:["Instantly","Within an hour","When I feel like it","Days later, sorry"] },
  { id:36, c:'hab', t:"My sleep schedule:", a:["Early bird","Night owl","Chaotic","Whatever works"] },
  { id:37, c:'hab', t:"I am a morning person:", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:38, c:'hab', t:"My room is usually:", a:["Spotless","Organized chaos","A disaster zone","Someone else cleans it"] },
  { id:39, c:'hab', t:"I plan my weekends:", a:["In advance","One loose plan","Zero plans","What's a weekend"] },
  { id:40, c:'hab', t:"I finish things I start:", a:["Always","Usually","Rarely","Never"] },
  { id:41, c:'hab', t:"My texting style:", a:["Long paragraphs","Short and fast","Emojis only","Voice notes"] },
  { id:42, c:'hab', t:"I'd rather text than call:", a:["Always","Usually","Rarely","Never"] },
  { id:43, c:'hab', t:"I check my phone with company around:", a:["Always","Usually","Rarely","Never"] },
  { id:44, c:'hab', t:"My shopping style:", a:["Planned list","Window shopper","Impulse buyer","Online only"] },
  { id:45, c:'soc', t:"My ideal Friday night:", a:["Movie marathon at home","Party with friends","Quiet dinner out","Gaming all night"] },
  { id:46, c:'soc', t:"I prefer small gatherings over big parties:", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:47, c:'soc', t:"In a group project I am the:", a:["Leader","Ideas person","Quiet worker","Last-minute hero"] },
  { id:48, c:'soc', t:"My social battery:", a:["Never drains","Drains slowly","Drains fast","What social battery"] },
  { id:49, c:'soc', t:"I make new friends:", a:["Easily anywhere","Slowly but deeply","Only through friends","Rarely"] },
  { id:50, c:'soc', t:"At a wedding I am:", a:["On the dance floor","At the food counter","With my close circle","Leaving early"] },
  { id:51, c:'soc', t:"I remember birthdays and dates:", a:["Always","Usually","Rarely","Never"] },
  { id:52, c:'soc', t:"I enjoy giving gifts and surprises:", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:53, c:'soc', t:"I'm the one who plans hangouts:", a:["Always","Usually","Rarely","Never"] },
  { id:54, c:'soc', t:"Our friendship runs on:", a:["Memes","Deep talks","Food dates","Shared chaos"] },
  { id:55, c:'adv', t:"Pick a holiday vibe for me:", a:["Beach resort","Mountains","Big city","Road trip anywhere"] },
  { id:56, c:'adv', t:"On a road trip I am the:", a:["Driver","DJ","Navigator","Sleeper"] },
  { id:57, c:'adv', t:"My idea of adventure:", a:["Skydiving","Trekking","A new restaurant","A new video game"] },
  { id:58, c:'adv', t:"My reaction to surprise plans:", a:["Love it, let's go","Need 10 minutes","Anxious but okay","Absolutely not"] },
  { id:59, c:'adv', t:"I'd try bungee jumping:", a:["Without hesitation","Maybe once","Only if forced","Absolutely not"] },
  { id:60, c:'adv', t:"I'm spontaneous and go with the flow:", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:61, c:'adv', t:"I'd travel the world with my best friend:", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:62, c:'adv', t:"I'm the one who suggests new activities:", a:["Always","Usually","Rarely","Never"] },
  { id:63, c:'adv', t:"My weekend needs:", a:["Zero plans","One fun plan","Packed schedule","Just sleep"] },
  { id:64, c:'adv', t:"My attitude to rain:", a:["Dance in it","Chai and pakoras","Stuck indoors, ugh","Don't care"] },
]

const F_BEST = 'ft-best', F_PLAYS = 'ft-plays', F_HIST = 'ft-hist'

// --- share-link encoding: pack creator answers into a URL (v=2 format) ---
const enc = encodeURIComponent
const dec = decodeURIComponent
function encodeAnswers(a) { return a.map(v => v ?? '').join(',') }
function decodeAnswers(s) { return (s || '').split(',').map(x => (x === '' ? null : Number(x))) }
function parseShare() {
  const p = new URLSearchParams(window.location.search)
  if (!p.get('seed')) return null
  if (p.get('v') !== '2') return { old: true }
  return {
    seed: p.get('seed'),
    len: Math.min(20, Math.max(5, Number(p.get('len')) || 10)),
    nameA: p.get('nameA') ? dec(p.get('nameA')) : '',
    ansA: decodeAnswers(p.get('ansA') || ''),
  }
}
function buildShareUrl(seed, len, nameA, ansA) {
  const base = window.location.origin + '/games/friendship-test/'
  return `${base}?v=2&seed=${enc(seed)}&len=${len}&nameA=${enc(nameA)}&ansA=${enc(encodeAnswers(ansA))}`
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

function verdict(score) {
  if (score >= 90) return { emoji: '🏆', title: 'Ride or Die', msg: 'knows you better than you know yourself!', color: '#34d399', img: `${IMG}/trophy.jpg` }
  if (score >= 75) return { emoji: '🌟', title: 'Bestie Material', msg: 'really pays attention. Certified best friend!', color: '#60a5fa', img: `${IMG}/trophy.jpg` }
  if (score >= 60) return { emoji: '👍', title: 'Solid Friend', msg: 'knows you pretty well, with a few surprises!', color: '#a78bfa', img: `${IMG}/highfive.jpg` }
  if (score >= 45) return { emoji: '🌱', title: 'Getting There', msg: 'is still discovering the real you. Keep talking!', color: '#fbbf24', img: `${IMG}/highfive.jpg` }
  if (score >= 30) return { emoji: '🧲', title: 'Mystery Friend', msg: 'barely scratched the surface. Time for more chai dates!', color: '#fb923c', img: `${IMG}/whisper.jpg` }
  return { emoji: '💪', title: 'Stranger Danger', msg: 'knows NOTHING. Send this quiz again!', color: '#f87171', img: `${IMG}/whisper.jpg` }
}

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
const sndGood = () => { playTone(880, 0.1, 'sine', 0.1); setTimeout(() => playTone(1318, 0.18, 'sine', 0.1), 90) }
const sndBad = () => playTone(220, 0.2, 'sawtooth', 0.06)

function readLS(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }
function writeLS(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

const CONFETTI = ['🎉','⭐','💛','💜','🎊','✨']

export default function games_friendship_test() {
  const [step, setStep] = useState('home') // home, names, a, handoff, b, result, expired
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
  const [matches, setMatches] = useState(0)
  const [copied, setCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [shared, setShared] = useState(null)
  const [display, setDisplay] = useState(0)
  const [hist, setHist] = useState(() => readLS(F_HIST, []))
  const [flash, setFlash] = useState(null) // { i, ok } — instant feedback on guess turn
  const [streak, setStreak] = useState(0)
  const [correctSoFar, setCorrectSoFar] = useState(0)

  const best = readLS(F_BEST, null)
  const plays = readLS(F_PLAYS, 0)

  const startQuiz = useCallback(() => {
    const s = seed || Date.now().toString(36)
    setSeed(s)
    setQIdx(selectQuestions(s, quizLength))
    setCur(0)
    setAnswersA([]); setAnswersB([])
    setScore(null); setMatches(0); setDisplay(0)
    setFlash(null); setStreak(0); setCorrectSoFar(0)
    setShared(null)
    setShareUrl('')
    setPlayer('a')
    setStep('names')
  }, [quizLength, seed])

  const handleStartNames = () => {
    if (shared) {
      if (!nameB.trim()) return
      setStep('b')
    } else {
      if (!nameA.trim()) return
      setStep('a')
    }
  }

  const finishQuiz = (finalA, finalB) => {
    let m = 0
    for (let i = 0; i < quizLength; i++) {
      if (finalA[i] === finalB[i]) m++
    }
    const finalScore = Math.round((m / quizLength) * 100)
    setScore(finalScore)
    setMatches(m)
    const pair = `${nameA} & ${nameB}`
    if (!best || finalScore > best.score) {
      writeLS(F_BEST, { score: finalScore, pair, when: new Date().toLocaleDateString() })
    }
    const h = [{ score: finalScore, pair, when: new Date().toLocaleDateString() }, ...readLS(F_HIST, [])]
      .sort((x, y) => y.score - x.score).slice(0, 5)
    writeLS(F_HIST, h)
    setHist(h)
    writeLS(F_PLAYS, plays + 1)
    playTone(783.99, 0.18, 'sine', 0.13)
    setTimeout(() => playTone(1046.50, 0.25, 'sine', 0.13), 150)
    setTimeout(() => playTone(1318.51, 0.35, 'triangle', 0.10), 300)
    setStep('result')
  }

  const advanceAfter = (newA, newB) => {
    if (cur < quizLength - 1) {
      setCur(c => c + 1)
      setFlash(null)
    } else if (player === 'a') {
      setFlash(null)
      setStep('handoff')
    } else {
      setFlash(null)
      finishQuiz(newA, newB)
    }
  }

  const handleAnswer = (val) => {
    if (flash) return // wait for feedback animation
    if (player === 'a') {
      // Creator answering about themselves — no right/wrong yet
      const newAnswers = [...answersA]
      newAnswers[cur] = val
      setAnswersA(newAnswers)
      playTone(860, 0.07, 'sine', 0.03)
      setTimeout(() => advanceAfter(newAnswers, answersB), 150)
    } else {
      // Friend guessing — instant right/wrong feedback
      const ok = val === answersA[cur]
      setFlash({ i: val, ok })
      if (ok) { sndGood(); setStreak(s => s + 1); setCorrectSoFar(c => c + 1) }
      else { sndBad(); setStreak(0) }
      const newAnswers = [...answersB]
      newAnswers[cur] = val
      setAnswersB(newAnswers)
      setTimeout(() => advanceAfter(answersA, newAnswers), ok ? 550 : 950)
    }
  }
  const answerRef = useRef(handleAnswer)
  answerRef.current = handleAnswer

  // Keyboard: press 1-4 to answer (desktop speed-run)
  useEffect(() => {
    if (step !== 'a' && step !== 'b') return
    const h = (e) => {
      const n = Number(e.key)
      if (n >= 1 && n <= 4) answerRef.current(n - 1)
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [step])

  // Animated score count-up on the result screen
  useEffect(() => {
    if (step !== 'result' || score === null) return
    setDisplay(0)
    const t0 = performance.now(), dur = 1200
    let raf
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur)
      setDisplay(Math.round(score * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [step, score])

  const handleNext = () => {
    if (step === 'handoff') {
      setPlayer('b'); setCur(0); setStreak(0); setCorrectSoFar(0); setFlash(null); setStep('b')
    } else if (step === 'result') {
      setStep('home'); setScore(null); setShared(null); setShareUrl('')
    }
  }

  const goBack = () => { if (player === 'a' && cur > 0 && !flash) { playTone(520, 0.06, 'sine', 0.03); setCur(c => c - 1) } }

  const v = score !== null ? verdict(score) : null
  const resultMsg = score !== null
    ? `${v.emoji} ${nameB} got "${v.title}" — ${score}% on ${nameA}'s BFF Quiz! Matched ${matches}/${quizLength}. 👫\nThink you know ${nameA} better? Play here: ${window.location.origin}/games/friendship-test/`
    : ''

  const copyResult = () => {
    if (navigator.share) {
      navigator.share({ title: 'BFF Quiz Result', text: resultMsg }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(resultMsg).then(() => {
        setCopied(true); setTimeout(() => setCopied(false), 1500)
      }).catch(() => {
        setCopied(true); setTimeout(() => setCopied(false), 1500)
      })
    }
  }

  const shareWA = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(resultMsg)}`, '_blank', 'noopener')
  }

  // Creator finished → link carrying their answers so friends guess on their own phones
  const prepareShare = useCallback(() => {
    const url = buildShareUrl(seed, quizLength, nameA, answersA)
    setShareUrl(url)
    return url
  }, [seed, quizLength, nameA, answersA])

  const shareToFriend = useCallback(() => {
    const url = prepareShare()
    const msg = `I made a BFF quiz about MYSELF — bet you can't beat 80%! 😏\nGuess my answers here: ${url}`
    if (navigator.share) {
      navigator.share({ title: 'Best Friend Quiz', text: msg }).catch(() => {})
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
    window.open(`https://wa.me/?text=${encodeURIComponent(`I made a BFF quiz about MYSELF — bet you can't beat 80%! 😏\nGuess my answers here: ${url}`)}`, '_blank', 'noopener')
  }, [prepareShare])

  const q = qIdx[cur] !== undefined ? getQ(qIdx[cur]) : null
  const inputClass = "w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"

  const R = 64, CIRC = 2 * Math.PI * R

  // Shared link → reconstruct creator quiz, friend guesses
  useEffect(() => {
    const s = parseShare()
    if (!s) return
    if (s.old) { setStep('expired'); return }
    setShared(s)
    setNameA(s.nameA || 'Your friend')
    setSeed(s.seed)
    setQuizLength(s.len)
    setQIdx(selectQuestions(s.seed, s.len))
    setAnswersA(s.ansA)
    setAnswersB([])
    setPlayer('b')
    setCur(0)
    setStreak(0); setCorrectSoFar(0); setFlash(null)
    setScore(null)
    setStep('names')
  }, [])

  return (
    <GameShell
      name="FRIENDSHIP TEST"
      startAction={startQuiz} startLabel="▶ Start Quiz"
      title="BFF Test – Best Friend Test, Friendship Quiz | How Well Do Your Friends Know You"
      desc="Take the free BFF test and best friend quiz online. Answer 10–20 fun questions about yourself, share your friendship quiz link, and see which friend knows you best. No sign-up, no download."
      icon="👫" iconBg="rgba(99,102,241,0.08)"
      category="fun" slug="games-friendship-test"
      faq={[
        { q: "What is the BFF test?", a: "The BFF test is a best friend quiz where you answer fun questions about yourself, then share a link. Your friends guess your answers — the highest score proves who knows you best." },
        { q: "How does this best friend test work?", a: "Answer 10, 15, or 20 friendship quiz questions about YOURSELF, then tap Copy Quiz Link or WhatsApp. Friends open the link on their own phones and guess. Each correct guess scores toward 100%." },
        { q: "Is the friendship quiz free?", a: "Yes, completely free with no sign-up and no app download. Play unlimited BFF tests in your browser on mobile or desktop." },
        { q: "How do I share my BFF quiz with friends?", a: "After answering, tap Copy Quiz Link or WhatsApp. Drop it in your group chat, Instagram story, Snapchat, or bio — friends answer instantly with no login." },
        { q: "What questions are in the best friend quiz?", a: "64 fun questions across favorites, food, habits, social life, adventure, and deep topics — from comfort food and dream jobs to biggest fears and ideal Friday nights. Every game picks a fresh random set." },
        { q: "Can I play the friendship test without downloading?", a: "Yes. This BFF test runs entirely in your browser with no install, free on mobile and desktop." },
      ]}
      howItWorks={[
        "Answer fun questions about YOURSELF.",
        "Share your unique link with friends (WhatsApp, story, group chat).",
        "Friends guess your answers — instant right/wrong feedback.",
        "Top scorer is your certified bestie!",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "BFF Test - Best Friend Test and Friendship Quiz", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/friendship-test/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <style>{`@keyframes ftIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .ft-anim { animation: ftIn 0.25s ease-out; } @keyframes ftFall { 0% { transform: translateY(-40px) rotate(0deg); opacity: 1; } 100% { transform: translateY(320px) rotate(300deg); opacity: 0; } } .ft-confetti { position: absolute; top: 0; animation: ftFall 2.6s ease-in forwards; pointer-events: none; }`}</style>
      <div className="min-w-0 space-y-5">
        {/* Home screen */}
        {step === 'home' && (
          <div className="ft-anim min-w-0 space-y-5">
            <img src={`${IMG}/hero.jpg`} alt="Two best friends taking a selfie quiz"
              className="w-full h-44 sm:h-56 object-cover rounded-2xl border border-white/10" loading="eager" />

            {/* How it works */}
            <div className="glass rounded-2xl p-5">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div><div className="text-2xl mb-1">📝</div><p className="font-bold text-slate-200">1. Answer about YOU</p></div>
                <div><div className="text-2xl mb-1">📲</div><p className="font-bold text-slate-200">2. Share the link</p></div>
                <div><div className="text-2xl mb-1">🏆</div><p className="font-bold text-slate-200">3. Friends guess</p></div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center glass p-4 rounded-xl min-w-0">
                <div className="text-2xl font-extrabold text-white">{best ? `${best.score}%` : '--%'}</div>
                <div className="text-xs text-slate-400">Best Score</div>
              </div>
              <div className="text-center glass p-4 rounded-xl min-w-0">
                <div className="text-2xl font-extrabold text-white">{BANK.length}</div>
                <div className="text-xs text-slate-400">Questions</div>
              </div>
              <div className="text-center glass p-4 rounded-xl min-w-0">
                <div className="text-2xl font-extrabold text-white">{plays}</div>
                <div className="text-xs text-slate-400">Total Plays</div>
              </div>
              <div className="text-center glass p-4 rounded-xl min-w-0">
                <div className="text-2xl font-extrabold text-white truncate" title={best?.pair ?? ''}>{best?.pair ?? '—'}</div>
                <div className="text-xs text-slate-400">Top Pair</div>
              </div>
            </div>

            {/* Top scores */}
            {hist.length > 0 && (
              <div className="glass rounded-2xl p-5 min-w-0">
                <h3 className="text-sm font-bold text-white mb-3">🏅 Top scores on this device</h3>
                <div className="space-y-2">
                  {hist.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm min-w-0">
                      <span className="text-slate-500 font-bold w-5 shrink-0">{i + 1}</span>
                      <span className="flex-1 text-slate-300 font-semibold truncate min-w-0">{h.pair}</span>
                      <span className="text-slate-500 text-xs shrink-0 hidden sm:inline">{h.when}</span>
                      <span className="font-extrabold text-indigo-400 w-12 text-right shrink-0">{h.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quiz length */}
            <div className="flex gap-2 justify-center">
              {[10, 15, 20].map(len => (
                <button key={len} onClick={() => setQuizLength(len)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${quizLength === len ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30' : 'bg-white/[0.06] text-slate-400 border border-white/[0.08] hover:bg-white/[0.1]'}`}>
                  {len === 10 ? 'Quick' : len === 15 ? 'Classic' : 'Ultimate'} ({len})
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-slate-500">Fresh random questions every game · 🌟 Favorites · 😂 Fun · 💭 Deep · 🍕 Food · 🧭 Adventure · 👫 Social</p>

            {/* Start button */}
            <div className="text-center">
              <button onClick={() => {window.dispatchEvent(new Event('ut:game-start'))}}
                className="glow-btn px-8 py-4 rounded-2xl text-sm font-bold text-white transition-all">
                Create My Quiz
              </button>
            </div>
            <p className="text-center text-xs text-slate-600">Scores saved on this device only.</p>
          </div>
        )}

        {/* Old-version link */}
        {step === 'expired' && (
          <div className="glass rounded-2xl p-8 text-center min-w-0">
            <div className="text-4xl mb-3">🔄</div>
            <h2 className="text-xl font-bold text-white mb-2">This link is from an older quiz</h2>
            <p className="text-sm text-slate-400 mb-6">Ask your friend to create a fresh quiz and send you the new link — it takes 2 minutes!</p>
            <button onClick={() => { window.history.replaceState({}, '', window.location.pathname); setStep('home') }}
              className="glow-btn px-8 py-3 rounded-xl text-sm font-bold text-white transition-all">
              Create My Own Quiz ▶
            </button>
          </div>
        )}

        {/* Name entry */}
        {step === 'names' && shared ? (
          <div className="glass rounded-2xl p-6 space-y-5 min-w-0">
            <img src={`${IMG}/gift.jpg`} alt="Quiz challenge gift"
              className="w-full h-36 object-cover rounded-xl border border-white/10" loading="lazy" />
            <h2 className="text-lg font-bold text-white text-center">👫 You're invited!</h2>
            <p className="text-sm text-indigo-400 text-center"><strong>{nameA}</strong> made a quiz about themselves. Guess their answers!</p>
            <div>
              <label className="block text-sm text-indigo-400 mb-1">Your name</label>
              <input type="text" value={nameB} onChange={e => setNameB(e.target.value)}
                placeholder="Your name" maxLength={20} className={inputClass} />
            </div>
            <button onClick={handleStartNames} disabled={!nameB.trim()}
              className="glow-btn w-full py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50">
              Start Guessing ▶
            </button>
          </div>
        ) : step === 'names' && (
          <div className="glass rounded-2xl p-6 space-y-5 min-w-0">
            <h2 className="text-lg font-bold text-white text-center">👫 Create your quiz</h2>
            <p className="text-sm text-slate-400 text-center">Answer honestly about YOURSELF — your friends will try to guess!</p>
            <div>
              <label className="block text-sm text-indigo-400 mb-1">Your name</label>
              <input type="text" value={nameA} onChange={e => setNameA(e.target.value)}
                placeholder="Your name" maxLength={20} className={inputClass} />
            </div>
            <button onClick={handleStartNames} disabled={!nameA.trim()}
              className="glow-btn w-full py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50">
              Start Answering ▶
            </button>
          </div>
        )}

        {/* Quiz questions */}
        {(step === 'a' || step === 'b') && q && (
          <div key={`${player}-${cur}-${q.id}`} className="ft-anim glass rounded-2xl p-6 min-w-0">
            {/* Progress */}
            <div className="flex items-center gap-3 mb-1 min-w-0">
              <p className="text-sm text-indigo-400 flex-1 truncate min-w-0">
                {player === 'a' ? `${nameA}, answer about YOU` : `${nameB}, guess ${nameA}'s answer`} · {cur + 1}/{quizLength}
              </p>
              <span className="text-xs font-bold text-slate-400 shrink-0">{Math.round(((cur + 1) / quizLength) * 100)}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/[0.07] mb-4 overflow-hidden">
              <div className="h-full rounded-full bg-indigo-500 transition-all duration-300" style={{ width: `${((cur + 1) / quizLength) * 100}%` }} />
            </div>
            {player === 'b' && (
              <div className="flex items-center gap-2 mb-3 text-xs font-bold">
                <span className="text-emerald-400">✓ {correctSoFar} right</span>
                {streak >= 2 && <span className="text-orange-400">🔥 streak x{streak}</span>}
              </div>
            )}
            <div className="flex items-start gap-3 mb-4 min-w-0">
              <img src={`${IMG}/whisper.jpg`} alt="" aria-hidden
                className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0" loading="lazy" />
              <div className="min-w-0">
                <span className="inline-block text-xs font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1 mb-2">{CAT[q.c] || '👫 Quiz'}</span>
                <h2 className="text-lg font-bold text-white break-words">{q.t}</h2>
              </div>
            </div>
            <div className="space-y-3">
              {q.a.map((opt, i) => {
                const isTap = flash && flash.i === i
                const isRight = flash && answersA[cur] === i
                let cls = "w-full text-left p-4 rounded-xl text-sm font-semibold bg-white/[0.06] border-2 border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/10 hover:border-indigo-500/30 active:scale-[0.98] transition-all"
                if (flash && player === 'b') {
                  if (isTap && flash.ok) cls = "w-full text-left p-4 rounded-xl text-sm font-semibold bg-emerald-500/20 border-2 border-emerald-500/60 text-emerald-200 transition-all"
                  else if (isTap && !flash.ok) cls = "w-full text-left p-4 rounded-xl text-sm font-semibold bg-rose-500/20 border-2 border-rose-500/60 text-rose-200 transition-all"
                  else if (isRight) cls = "w-full text-left p-4 rounded-xl text-sm font-semibold bg-emerald-500/10 border-2 border-emerald-500/40 text-emerald-200 transition-all"
                  else cls = "w-full text-left p-4 rounded-xl text-sm font-semibold bg-white/[0.03] border-2 border-white/[0.05] text-slate-500 transition-all"
                }
                return (
                  <button key={i} onClick={() => handleAnswer(i)}
                    className={cls}>
                    <span className="inline-block w-6 h-6 mr-2 text-center text-xs font-bold rounded-md bg-white/[0.08] text-slate-400 align-middle leading-6">{i + 1}</span>
                    {opt}
                    {flash && player === 'b' && isTap && (flash.ok ? '  ✓' : '  ✗')}
                    {flash && player === 'b' && !isTap && isRight && '  ✓'}
                  </button>
                )
              })}
            </div>
            {flash && player === 'b' && (
              <p className={`text-center text-sm font-bold mt-4 ${flash.ok ? 'text-emerald-400' : 'text-rose-400'}`}>
                {flash.ok ? (streak >= 3 ? `🔥 Correct! Streak x${streak}!` : '✓ Nailed it!') : `✗ Nope! ${nameA} picked "${q.a[answersA[cur]]}"`}
              </p>
            )}
            <div className="flex items-center justify-between mt-4">
              {player === 'a' ? (
                <button onClick={goBack} disabled={cur === 0}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-white/[0.04] border border-white/[0.08] transition-all disabled:opacity-30">
                  ← Back
                </button>
              ) : <span />}
              <p className="text-xs text-slate-600 hidden sm:block">Tip: press 1–4 on keyboard</p>
            </div>
          </div>
        )}

        {/* Handoff / share screen */}
        {step === 'handoff' && (
          <div className="glass rounded-2xl p-6 sm:p-8 text-center min-w-0">
            <img src={`${IMG}/gift.jpg`} alt="Share your quiz gift"
              className="w-full h-36 object-cover rounded-xl border border-white/10 mb-4" loading="lazy" />
            <div className="text-4xl mb-2">🎉</div>
            <h2 className="text-xl font-bold text-white mb-2">Your quiz is ready, {nameA}!</h2>
            <p className="text-sm text-slate-400 mb-4">Now dare your friends to guess. Bet they can't beat 80% 😏</p>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 mb-4">
              <p className="text-sm text-slate-300 font-semibold mb-2">📲 Challenge your friends</p>
              <div className="flex gap-2 justify-center mb-2">
                <button onClick={shareToFriend}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:bg-white/[0.1] ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/[0.06] border border-white/[0.08] text-slate-300 hover:text-white'}`}>
                  {copied ? '✓ Copied!' : '🔗 Copy Quiz Link'}
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
          </div>
        )}

        {/* Result */}
        {step === 'result' && score !== null && v && (
          <div className="ft-anim text-center p-6 sm:p-8 glass rounded-2xl min-w-0 relative overflow-hidden">
            {score >= 75 && (
              <div className="absolute inset-0 overflow-hidden" aria-hidden>
                {CONFETTI.map((e, i) => (
                  <span key={i} className="ft-confetti text-xl"
                    style={{ left: `${(i * 17) % 100}%`, animationDelay: `${(i % 5) * 0.35}s` }}>{e}</span>
                ))}
              </div>
            )}
            <img src={v.img} alt={`${v.title} result art`}
              className="w-full h-40 object-cover rounded-xl border border-white/10 mb-4" loading="lazy" />
            {/* Score ring */}
            <div className="relative inline-block mb-2">
              <svg width="160" height="160" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r={R} fill="none" strokeWidth="12" stroke="rgba(255,255,255,0.08)" />
                <circle cx="80" cy="80" r={R} fill="none" strokeWidth="12" stroke={v.color}
                  strokeLinecap="round" strokeDasharray={CIRC}
                  strokeDashoffset={CIRC * (1 - display / 100)}
                  transform="rotate(-90 80 80)" style={{ transition: 'stroke-dashoffset 0.1s linear' }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl font-extrabold text-white">{display}%</div>
                <div className="text-xs text-slate-400">{matches}/{quizLength} matched</div>
              </div>
            </div>
            <div className="text-4xl mb-1">{v.emoji}</div>
            <div className="text-xl font-extrabold text-white mb-1">{v.title}</div>
            <p className="text-indigo-400 mb-6 break-words">{nameB} {v.msg}</p>

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

            {!shared && (
              <div className="rounded-2xl border border-indigo-500/25 bg-indigo-500/[0.07] p-4 mb-6">
                <p className="text-sm text-slate-200 font-semibold mb-2">😏 Think YOUR friends know you better?</p>
                <div className="flex gap-2 justify-center">
                  <button onClick={shareToFriend}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.1] transition-all">
                    🔗 Challenge Them Too
                  </button>
                  <button onClick={shareToFriendWA}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.1] transition-all">
                    📱 WhatsApp
                  </button>
                </div>
              </div>
            )}

            {/* Match breakdown */}
            <div className="text-left rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 mb-6 min-w-0">
              <h3 className="text-sm font-bold text-white mb-3 text-center">🔍 Every guess, revealed</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {qIdx.map((qid, i) => {
                  const qq = getQ(qid)
                  const ok = answersA[i] === answersB[i]
                  return (
                    <div key={qid} className={`rounded-xl border p-3 text-xs min-w-0 ${ok ? 'border-emerald-500/25 bg-emerald-500/[0.05]' : 'border-rose-500/25 bg-rose-500/[0.05]'}`}>
                      <p className="font-bold text-slate-200 mb-1.5 break-words">{ok ? '✓ ' : '✗ '}{qq.t}</p>
                      <p className="text-slate-400 break-words"><span className="font-semibold text-slate-300">{nameA} answered:</span> {qq.a[answersA[i]] ?? '—'}</p>
                      <p className="text-slate-400 break-words"><span className="font-semibold text-slate-300">{nameB} guessed:</span> {qq.a[answersB[i]] ?? '—'}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            <button onClick={handleNext}
              className="glow-btn px-8 py-3 rounded-xl text-sm font-bold text-white transition-all">
              {shared ? 'Make My Own Quiz ▶' : 'Play Again ▶'}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  )
}
