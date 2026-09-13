import { useState, useCallback, useEffect, useRef } from 'react'
import GameShell from '../components/GameShell'

const CAT = {
  habits: '⚡ Habits',
  fun: '😂 Just for fun',
  deep: '💭 Deep',
  food: '🍕 Food',
  adventure: '🧭 Adventure',
  social: '👫 Social',
}

const BANK = [
  { id:1, c:'habits', t:"I prefer texting over calling.", a:["Always","Usually","Rarely","Never"] },
  { id:2, c:'social', t:"I'm the one who plans our hangouts.", a:["Always","Usually","Rarely","Never"] },
  { id:3, c:'social', t:"I'd rather stay in than go out.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:4, c:'social', t:"I remember important dates (birthdays, anniversaries).", a:["Always","Usually","Rarely","Never"] },
  { id:5, c:'social', t:"I'm the one who starts conversations.", a:["Always","Usually","Rarely","Never"] },
  { id:6, c:'food', t:"I share food without being asked.", a:["Always","Usually","Rarely","Never"] },
  { id:7, c:'deep', t:"I'm brutally honest even if it hurts.", a:["Always","Usually","Rarely","Never"] },
  { id:8, c:'deep', t:"I'd drop everything for a friend in need.", a:["Always","Usually","Rarely","Never"] },
  { id:9, c:'deep', t:"I enjoy long deep conversations.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:10, c:'fun', t:"I'm the funny one in the group.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:11, c:'deep', t:"I keep secrets well.", a:["Always","Usually","Rarely","Never"] },
  { id:12, c:'adventure', t:"I'm the one who suggests new activities.", a:["Always","Usually","Rarely","Never"] },
  { id:13, c:'social', t:"I get jealous when my friend hangs out with others.", a:["Always","Usually","Rarely","Never"] },
  { id:14, c:'social', t:"I prefer small gatherings over big parties.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:15, c:'deep', t:"I'm the one who apologizes first after a fight.", a:["Always","Usually","Rarely","Never"] },
  { id:16, c:'social', t:"I enjoy giving gifts and surprises.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:17, c:'deep', t:"I'm a good listener.", a:["Always","Usually","Rarely","Never"] },
  { id:18, c:'adventure', t:"I'd travel with my best friend.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:19, c:'fun', t:"I'm the one who takes photos for memories.", a:["Always","Usually","Rarely","Never"] },
  { id:20, c:'deep', t:"I'd be friends with this person for life.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:21, c:'fun', t:"I'm usually the last one to leave a party.", a:["Always","Usually","Rarely","Never"] },
  { id:22, c:'fun', t:"I overshare personal stories quickly.", a:["Always","Usually","Rarely","Never"] },
  { id:23, c:'habits', t:"I'd rather text a voice note than a message.", a:["Always","Usually","Rarely","Never"] },
  { id:24, c:'deep', t:"I forgive easily after being hurt.", a:["Always","Usually","Rarely","Never"] },
  { id:25, c:'habits', t:"I plan my weekends in advance.", a:["Always","Usually","Rarely","Never"] },
  { id:26, c:'habits', t:"I finish things I start.", a:["Always","Usually","Rarely","Never"] },
  { id:27, c:'fun', t:"I'm easily embarrassed.", a:["Always","Usually","Rarely","Never"] },
  { id:28, c:'fun', t:"I laugh at my own jokes.", a:["Always","Usually","Rarely","Never"] },
  { id:29, c:'habits', t:"I check my phone constantly even with company.", a:["Always","Usually","Rarely","Never"] },
  { id:30, c:'adventure', t:"I'm spontaneous and go with the flow.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:31, c:'deep', t:"I worry about what others think of me.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:32, c:'social', t:"I'm the peacemaker in conflicts.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:33, c:'adventure', t:"I'd try bungee jumping without hesitation.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:34, c:'fun', t:"I talk in my sleep or walk in my sleep.", a:["Always","Usually","Rarely","Never"] },
  { id:35, c:'food', t:"I eat dessert before the main course.", a:["Always","Usually","Rarely","Never"] },
  { id:36, c:'fun', t:"I sing out loud even when others can hear.", a:["Always","Usually","Rarely","Never"] },
  { id:37, c:'fun', t:"I'm the first to dance at a party.", a:["Always","Usually","Rarely","Never"] },
  { id:38, c:'deep', t:"I hold grudges longer than I should.", a:["Always","Usually","Rarely","Never"] },
  { id:39, c:'habits', t:"I'd rather be early than fashionably late.", a:["Always","Usually","Rarely","Never"] },
  { id:40, c:'deep', t:"I believe friends should tell each other everything.", a:["Strongly agree","Agree","Disagree","Strongly disagree"] },
  { id:41, c:'social', t:"My ideal Friday night is:", a:["Movie marathon at home","Party with friends","Quiet dinner out","Gaming all night"] },
  { id:42, c:'adventure', t:"Pick a holiday destination:", a:["Beach resort","Mountains","Big city","Road trip anywhere"] },
  { id:43, c:'food', t:"My go-to comfort food:", a:["Pizza","Biryani","Chocolate","Momos"] },
  { id:44, c:'habits', t:"I reply to messages:", a:["Instantly","Within an hour","Whenever I feel like it","Days later, sorry"] },
  { id:45, c:'social', t:"In a group project I am the:", a:["Leader","Ideas person","Quiet worker","Last-minute hero"] },
  { id:46, c:'deep', t:"My biggest fear:", a:["Heights","Creepy crawlies","Being alone","Missing out"] },
  { id:47, c:'habits', t:"I spend free money on:", a:["Food","Gadgets","Clothes","Experiences"] },
  { id:48, c:'habits', t:"My sleep schedule is:", a:["Early bird","Night owl","Chaotic","Whatever works"] },
  { id:49, c:'fun', t:"Pick a superpower:", a:["Read minds","Time travel","Invisibility","Super strength"] },
  { id:50, c:'fun', t:"My phone battery is usually:", a:["Full, always charged","Around 50%","Dead by evening","I never check"] },
  { id:51, c:'food', t:"At a buffet I go straight for:", a:["Desserts first","Mains and protein","A bit of everything","Salads, obviously"] },
  { id:52, c:'adventure', t:"My reaction to surprise plans:", a:["Love it, let's go","Need 10 minutes","Anxious but okay","Absolutely not"] },
  { id:53, c:'deep', t:"I cry during movies:", a:["Always","Sometimes","Rarely","Never"] },
  { id:54, c:'habits', t:"My room is usually:", a:["Spotless","Organized chaos","A disaster zone","Someone else cleans it"] },
  { id:55, c:'fun', t:"Pick a music vibe:", a:["Bollywood hits","Lo-fi chill","Hip-hop and rap","Old classics"] },
  { id:56, c:'adventure', t:"On a road trip I am the:", a:["Driver","DJ","Navigator","Sleeper"] },
  { id:57, c:'food', t:"My cooking skills are:", a:["Chef level","Decent","Maggi only","Fire hazard"] },
  { id:58, c:'deep', t:"I handle stress by:", a:["Talking it out","Music and solitude","Snacks","Ignoring it exists"] },
  { id:59, c:'social', t:"My social battery:", a:["Never drains","Drains slowly","Drains fast","What social battery"] },
  { id:60, c:'fun', t:"Pick a pet:", a:["Dog","Cat","Something exotic","No pets for me"] },
  { id:61, c:'habits', t:"My shopping style:", a:["Planned list","Window shopper","Impulse buyer","Online only"] },
  { id:62, c:'fun', t:"In photos I am the:", a:["Poser","Candid natural","Photographer","Hiding in back"] },
  { id:63, c:'adventure', t:"My idea of adventure:", a:["Skydiving","Trekking","A new restaurant","A new video game"] },
  { id:64, c:'deep', t:"I believe in:", a:["Full honesty always","White lies are fine","Silence is golden","Depends on the day"] },
  { id:65, c:'habits', t:"My morning routine:", a:["Up and productive","Snooze x5","Coffee first, talk later","No routine"] },
  { id:66, c:'food', t:"Pick a dessert:", a:["Ice cream","Cake","Gulab jamun","Brownies"] },
  { id:67, c:'habits', t:"My texting style:", a:["Long paragraphs","Short and fast","Emojis only","Voice notes"] },
  { id:68, c:'social', t:"At a wedding I am:", a:["On the dance floor","At the food counter","With my close circle","Leaving early"] },
  { id:69, c:'fun', t:"My guilty pleasure show:", a:["Reality TV","Daily soaps","Anime","True crime"] },
  { id:70, c:'habits', t:"I save money by:", a:["Budgeting strictly","Skipping outings","Side hustles","I don't, help"] },
  { id:71, c:'deep', t:"My dream job involves:", a:["Travel","Tech","Art","Being my own boss"] },
  { id:72, c:'fun', t:"In a horror movie I:", a:["Scream first","Laugh at jump scares","Cover my eyes","Sleep through it"] },
  { id:73, c:'food', t:"My spice tolerance:", a:["Extra spicy always","Medium","Mild please","No spice at all"] },
  { id:74, c:'social', t:"I make new friends:", a:["Easily anywhere","Slowly but deeply","Only through friends","Rarely"] },
  { id:75, c:'habits', t:"My weekend needs:", a:["Zero plans","One fun plan","Packed schedule","Just sleep"] },
  { id:76, c:'fun', t:"Pick a season:", a:["Summer","Monsoon","Winter","Spring"] },
  { id:77, c:'fun', t:"My attitude to rain:", a:["Dance in it","Chai and pakoras","Stuck indoors, ugh","Don't care"] },
  { id:78, c:'deep', t:"I learn best by:", a:["Doing it myself","Watching videos","Reading","Someone teaching me"] },
  { id:79, c:'fun', t:"My wallet is:", a:["Full and organized","Cards everywhere","Empty but hopeful","Digital only"] },
  { id:80, c:'social', t:"Our friendship runs on:", a:["Memes","Deep talks","Food dates","Shared chaos"] },
]

const F_BEST = 'ft-best', F_PLAYS = 'ft-plays', F_HIST = 'ft-hist'

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

function verdict(score) {
  if (score >= 90) return { emoji: '🏆', title: 'Legendary Duo', msg: 'You two are basically the same person. Finish each other\u2019s sentences much?', color: '#34d399' }
  if (score >= 75) return { emoji: '🌟', title: 'Dynamic Duo', msg: 'Great bond! You know each other scary well.', color: '#60a5fa' }
  if (score >= 60) return { emoji: '👍', title: 'Solid Squad', msg: 'Strong friendship with a few fun surprises left.', color: '#a78bfa' }
  if (score >= 45) return { emoji: '🌱', title: 'Growing Bond', msg: 'Good friends, still discovering each other. Keep talking!', color: '#fbbf24' }
  if (score >= 30) return { emoji: '🧲', title: 'Opposite Charm', msg: 'Different wavelengths, same playlist. Opposites attract!', color: '#fb923c' }
  return { emoji: '💪', title: 'New Chapter', msg: 'So much left to learn about each other \u2014 the adventure starts now!', color: '#f87171' }
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

function readLS(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }
function writeLS(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

export default function games_friendship_test() {
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
  const [matches, setMatches] = useState(0)
  const [copied, setCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [shared, setShared] = useState(null) // { seed, len, nameA, ansA } when opened via link
  const [display, setDisplay] = useState(0) // animated score count-up
  const [hist, setHist] = useState(() => readLS(F_HIST, []))

  const best = readLS(F_BEST, null)
  const plays = readLS(F_PLAYS, 0)

  const startQuiz = useCallback(() => {
    const s = seed || Date.now().toString(36)
    setSeed(s)
    setQIdx(selectQuestions(s, quizLength))
    setCur(0)
    setAnswersA([]); setAnswersB([])
    setScore(null); setMatches(0); setDisplay(0)
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

  const finishQuiz = (finalA, finalB) => {
    let m = 0
    for (let i = 0; i < quizLength; i++) {
      if (finalA[i] === finalB[i]) m++
    }
    const finalScore = Math.round((m / quizLength) * 100)
    setScore(finalScore)
    setMatches(m)
    const pair = shared ? `${nameA} & ${nameB}` : `${nameA} & ${nameB}`
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
      finishQuiz(answersA, newAnswers)
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
      setPlayer('b'); setCur(0); setStep('b')
    } else if (step === 'result') {
      setStep('home'); setScore(null); setShared(null); setShareUrl('')
    }
  }

  const goBack = () => { if (cur > 0) { playTone(520, 0.06, 'sine', 0.03); setCur(c => c - 1) } }

  const v = score !== null ? verdict(score) : null
  const resultMsg = score !== null
    ? `${v.emoji} We got "${v.title}" — ${score}% on the UpTools BFF Test! ${nameA} & ${nameB} matched ${matches}/${quizLength}. 👫\nPlay it here: ${window.location.origin}/games/friendship-test/`
    : ''

  const copyResult = () => {
    if (navigator.share) {
      navigator.share({ title: 'Friendship Test Result', text: resultMsg }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(resultMsg).then(() => {
        setCopied(true); setTimeout(() => setCopied(false), 1500)
      }).catch(() => {
        setCopied(true); setTimeout(() => setCopied(false), 1500)
      })
    }
  }

  const shareWA = () => {
    const msg = encodeURIComponent(resultMsg)
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

  const R = 64, CIRC = 2 * Math.PI * R

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
    <GameShell
      name="FRIENDSHIP TEST"
      startAction={startQuiz} startLabel="▶ Start Quiz"
      title="Best Friend Compatibility Test 👫 How Well Do You Know Each Other"
      desc="Best Friend Compatibility Test 👫 How Well Do You Know Each Other, online free. Play online free, no download. Works on mobile and desktop."
      icon="👫" iconBg="rgba(99,102,241,0.08)"
      category="fun" slug="games-friendship-test"
      faq={[
        { q: "How does the friendship test work?", a: "Player 1 answers all questions first, then Player 2 answers the same questions. Your compatibility score is based on how many answers match. You can play on one device, or Player 1 can share a link so Player 2 answers on their own phone." },
        { q: "Is the test free?", a: "Yes, completely free with no sign-up required. Scores are saved locally on your device only." },
        { q: "How do I play Best Friend Compatibility Test 👫 How Well Do You Know Each Other online free?", a: "Click Start and follow the on-screen steps. Use mouse, touch, or keyboard controls. No download needed." },
        { q: "Can I play Best Friend Compatibility Test 👫 How Well Do You Know Each Other without downloading?", a: "Yes. This Best Friend Compatibility Test 👫 How Well Do You Know Each Other runs in your browser with no install. Free on mobile and desktop." },
        { q: "How do I use this Best Friend Compatibility Test 👫 How Well Do You Know Each Other online free?", a: "Open the game above and press Start. Free with no login, works on mobile and desktop." },
        { q: "Is this Best Friend Compatibility Test 👫 How Well Do You Know Each Other free?", a: "Yes, completely free with no sign-up. Use it unlimited times online on any device." },
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
      <style>{`@keyframes ftIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .ft-anim { animation: ftIn 0.25s ease-out; }`}</style>
      <div className="flex gap-4 max-w-6xl mx-auto overflow-hidden">
        <div className="flex-1 min-w-0 max-w-2xl mx-auto space-y-5 overflow-hidden">
        {/* Home screen */}
        {step === 'home' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="text-center glass p-4 rounded-xl">
                <div className="text-2xl font-extrabold text-white">{best ? `${best.score}%` : '--%'}</div>
                <div className="text-xs text-slate-400">Best Score</div>
              </div>
              <div className="text-center glass p-4 rounded-xl">
                <div className="text-2xl font-extrabold text-white">{BANK.length}</div>
                <div className="text-xs text-slate-400">Questions</div>
              </div>
              <div className="text-center glass p-4 rounded-xl">
                <div className="text-2xl font-extrabold text-white">{plays}</div>
                <div className="text-xs text-slate-400">Total Plays</div>
              </div>
              <div className="text-center glass p-4 rounded-xl">
                <div className="text-2xl font-extrabold text-white">{best?.pair ?? '—'}</div>
                <div className="text-xs text-slate-400">Top Pair</div>
              </div>
            </div>

            {/* Top scores */}
            {hist.length > 0 && (
              <div className="glass rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white mb-3">🏅 Top scores on this device</h3>
                <div className="space-y-2">
                  {hist.map((h, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <span className="text-slate-500 font-bold w-5">{i + 1}</span>
                      <span className="flex-1 text-slate-300 font-semibold truncate">{h.pair}</span>
                      <span className="text-slate-500 text-xs">{h.when}</span>
                      <span className="font-extrabold text-indigo-400 w-12 text-right">{h.score}%</span>
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
            <p className="text-center text-xs text-slate-500">Fresh random questions every game · ⚡ Habits · 😂 Fun · 💭 Deep · 🍕 Food · 🧭 Adventure · 👫 Social</p>

            {/* Start button */}
            <div className="text-center">
              <button onClick={() => {window.dispatchEvent(new Event('ut:game-start'))}}
                className="glow-btn px-8 py-4 rounded-2xl text-sm font-bold text-white transition-all">
                Start Quiz
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
          <div key={`${player}-${cur}-${q.id}`} className="ft-anim glass rounded-2xl p-6">
            {/* Progress */}
            <div className="flex items-center gap-3 mb-1">
              <p className="text-sm text-indigo-400 flex-1">{player === 'a' ? nameA : nameB}'s turn · Question {cur + 1} of {quizLength}</p>
              <span className="text-xs font-bold text-slate-400">{Math.round(((cur + 1) / quizLength) * 100)}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/[0.07] mb-4 overflow-hidden">
              <div className="h-full rounded-full bg-indigo-500 transition-all duration-300" style={{ width: `${((cur + 1) / quizLength) * 100}%` }} />
            </div>
            <div className="mb-4">
              <span className="inline-block text-xs font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1 mb-2">{CAT[q.c] || '👫 Quiz'}</span>
              <h2 className="text-lg font-bold text-white">{q.t}</h2>
            </div>
            <div className="space-y-3">
              {q.a.map((opt, i) => (
                <button key={i} onClick={() => handleAnswer(i)}
                  className="w-full text-left p-4 rounded-xl text-sm font-semibold bg-white/[0.06] border-2 border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/10 hover:border-indigo-500/30 active:scale-[0.98] transition-all">
                  <span className="inline-block w-6 h-6 mr-2 text-center text-xs font-bold rounded-md bg-white/[0.08] text-slate-400 align-middle leading-6">{i + 1}</span>
                  {opt}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4">
              <button onClick={goBack} disabled={cur === 0}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-white/[0.04] border border-white/[0.08] transition-all disabled:opacity-30">
                ← Back
              </button>
              <p className="text-xs text-slate-600 hidden sm:block">Tip: press 1–4 on keyboard</p>
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
        {step === 'result' && score !== null && v && (
          <div className="ft-anim text-center p-6 sm:p-8 glass rounded-2xl">
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
            <p className="text-indigo-400 mb-6">{nameA} & {nameB}: {v.msg}</p>

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

            {/* Match breakdown */}
            <div className="text-left rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 mb-6">
              <h3 className="text-sm font-bold text-white mb-3 text-center">🔍 Where you matched (and clashed)</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {qIdx.map((qid, i) => {
                  const qq = getQ(qid)
                  const ok = answersA[i] === answersB[i]
                  return (
                    <div key={qid} className={`rounded-xl border p-3 text-xs ${ok ? 'border-emerald-500/25 bg-emerald-500/[0.05]' : 'border-rose-500/25 bg-rose-500/[0.05]'}`}>
                      <p className="font-bold text-slate-200 mb-1.5">{ok ? '✓ ' : '✗ '}{qq.t}</p>
                      <p className="text-slate-400"><span className="font-semibold text-slate-300">{nameA}:</span> {qq.a[answersA[i]] ?? '—'}</p>
                      <p className="text-slate-400"><span className="font-semibold text-slate-300">{nameB}:</span> {qq.a[answersB[i]] ?? '—'}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            <button onClick={handleNext}
              className="glow-btn px-8 py-3 rounded-xl text-sm font-bold text-white transition-all">
              Play Again ▶
            </button>
          </div>
        )}
        </div>
      </div>
    </GameShell>
  )
}
