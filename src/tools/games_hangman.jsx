import { useState, useCallback, useEffect, useRef } from 'react'
import GameShell from '../components/GameShell'

const WORDS = {
  animals: [
    { word: 'elephant', hint: 'Largest land animal' },
    { word: 'giraffe', hint: 'Tallest animal' },
    { word: 'penguin', hint: 'Flightless bird from Antarctica' },
    { word: 'dolphin', hint: 'Intelligent marine mammal' },
    { word: 'cheetah', hint: 'Fastest land animal' },
    { word: 'kangaroo', hint: 'Australian marsupial' },
    { word: 'crocodile', hint: 'Ancient reptile' },
    { word: 'butterfly', hint: 'Colorful flying insect' },
    { word: 'tiger', hint: 'Big striped cat' },
    { word: 'zebra', hint: 'Striped horse-like animal' },
    { word: 'panda', hint: 'Black and white bear' },
    { word: 'koala', hint: 'Australian tree climber' },
    { word: 'owl', hint: 'Bird that hunts at night' },
    { word: 'shark', hint: 'Ocean predator' },
    { word: 'camel', hint: 'Desert animal with humps' },
    { word: 'frog', hint: 'Amphibian that jumps' },
    { word: 'lion', hint: 'King of the jungle' },
    { word: 'wolf', hint: 'Wild dog that howls' },
    { word: 'squirrel', hint: 'Bushy-tailed nut hoarder' },
    { word: 'octopus', hint: 'Eight-armed sea animal' },
  ],
  countries: [
    { word: 'australia', hint: 'Country and continent' },
    { word: 'brazil', hint: 'Largest country in South America' },
    { word: 'canada', hint: 'Country north of USA' },
    { word: 'germany', hint: 'European country, capital Berlin' },
    { word: 'japan', hint: 'Island nation in East Asia' },
    { word: 'mexico', hint: 'Country south of USA' },
    { word: 'nigeria', hint: 'Most populous African country' },
    { word: 'thailand', hint: 'Southeast Asian country' },
    { word: 'france', hint: 'Country famous for the Eiffel Tower' },
    { word: 'italy', hint: 'Boot-shaped European country' },
    { word: 'spain', hint: 'Country famous for flamenco' },
    { word: 'india', hint: 'Country with the Taj Mahal' },
    { word: 'china', hint: 'Country with the Great Wall' },
    { word: 'egypt', hint: 'Country of pyramids and the Nile' },
    { word: 'argentina', hint: 'South American country, home of tango' },
    { word: 'greece', hint: 'Birthplace of the Olympics' },
    { word: 'turkey', hint: 'Country spanning Europe and Asia' },
    { word: 'norway', hint: 'Country of fjords and northern lights' },
    { word: 'indonesia', hint: 'Island nation with Bali' },
    { word: 'portugal', hint: 'Country famous for explorers and custard tarts' },
  ],
  tech: [
    { word: 'algorithm', hint: 'Step-by-step problem solving procedure' },
    { word: 'database', hint: 'Organized collection of data' },
    { word: 'javascript', hint: 'Popular web programming language' },
    { word: 'blockchain', hint: 'Distributed ledger technology' },
    { word: 'encryption', hint: 'Securing data with codes' },
    { word: 'bandwidth', hint: 'Data transfer capacity' },
    { word: 'framework', hint: 'Software development structure' },
    { word: 'interface', hint: 'Point of interaction' },
    { word: 'server', hint: 'Computer that serves data' },
    { word: 'cloud', hint: 'Online storage and computing' },
    { word: 'pixel', hint: 'Tiny dot on a screen' },
    { word: 'robot', hint: 'Programmable machine' },
    { word: 'software', hint: 'Programs and apps' },
    { word: 'hardware', hint: 'Physical computer parts' },
    { word: 'keyboard', hint: 'Device you type on' },
    { word: 'cache', hint: 'Fast temporary memory' },
    { word: 'firewall', hint: 'Network security wall' },
    { word: 'sensor', hint: 'Device that detects changes' },
    { word: 'drone', hint: 'Flying camera device' },
    { word: 'laptop', hint: 'Portable computer' },
  ],
  food: [
    { word: 'spaghetti', hint: 'Italian pasta dish' },
    { word: 'avocado', hint: 'Green creamy fruit' },
    { word: 'chocolate', hint: 'Sweet made from cacao' },
    { word: 'pineapple', hint: 'Tropical spiky fruit' },
    { word: 'broccoli', hint: 'Green tree-like vegetable' },
    { word: 'croissant', hint: 'French buttery pastry' },
    { word: 'blueberry', hint: 'Small blue fruit' },
    { word: 'cinnamon', hint: 'Brown spice from tree bark' },
    { word: 'pizza', hint: 'Cheesy Italian flatbread' },
    { word: 'burger', hint: 'Sandwich in a bun' },
    { word: 'pasta', hint: 'Italian staple food' },
    { word: 'mango', hint: 'King of fruits' },
    { word: 'apple', hint: 'Fruit that keeps the doctor away' },
    { word: 'sushi', hint: 'Japanese dish with raw fish' },
    { word: 'taco', hint: 'Mexican folded tortilla' },
    { word: 'salad', hint: 'Bowl of raw vegetables' },
    { word: 'cheese', hint: 'Made from milk' },
    { word: 'bread', hint: 'Baked from flour dough' },
    { word: 'honey', hint: 'Sweet syrup made by bees' },
    { word: 'noodles', hint: 'Long thin strips of dough' },
  ],
  sports: [
    { word: 'basketball', hint: 'Sport with hoops and orange ball' },
    { word: 'volleyball', hint: 'Net sport with six players per side' },
    { word: 'badminton', hint: 'Racket sport with shuttlecock' },
    { word: 'swimming', hint: 'Water sport' },
    { word: 'gymnastics', hint: 'Sport with flips and balance' },
    { word: 'archery', hint: 'Sport with bow and arrow' },
    { word: 'wrestling', hint: 'Combat sport' },
    { word: 'marathon', hint: '42km running race' },
    { word: 'football', hint: 'World\'s most popular sport' },
    { word: 'tennis', hint: 'Racket sport over a net' },
    { word: 'cricket', hint: 'Bat and ball sport, huge in India' },
    { word: 'golf', hint: 'Sport with clubs and holes' },
    { word: 'boxing', hint: 'Fighting sport with gloves' },
    { word: 'cycling', hint: 'Sport on two wheels' },
    { word: 'skiing', hint: 'Gliding down snowy slopes' },
    { word: 'surfing', hint: 'Riding ocean waves' },
    { word: 'yoga', hint: 'Indian mind-body practice' },
    { word: 'hockey', hint: 'Sport with sticks and a puck' },
    { word: 'rugby', hint: 'Tough team sport with an oval ball' },
    { word: 'kabaddi', hint: 'Indian contact team sport' },
  ],
}

const DIFFS = {
  easy: { label: 'Easy', mult: 1, test: (w) => w.length <= 5, blurb: 'short words' },
  normal: { label: 'Normal', mult: 2, test: () => true, blurb: 'all words' },
  hard: { label: 'Hard', mult: 3, test: (w) => w.length >= 7, blurb: 'long words' },
}

const MAX_WRONG = 6
const PARTS = ['head', 'body', 'larm', 'rarm', 'lleg', 'rleg']
const STATS_KEY = 'ut-hangman-stats'

function loadStats() {
  try {
    const s = JSON.parse(localStorage.getItem(STATS_KEY) || '{}')
    return { wins: s.wins || 0, losses: s.losses || 0, streak: 0, best: s.best || 0, score: s.score || 0 }
  } catch { return { wins: 0, losses: 0, streak: 0, best: 0, score: 0 } }
}

let audioCtx = null
function ensureAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

function playCorrect() {
  try {
    const ctx = ensureAudio()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    osc.frequency.setValueAtTime(600, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1)
    gain.gain.setValueAtTime(0.05, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)
    osc.start(); osc.stop(ctx.currentTime + 0.12)
  } catch {}
}

function playWrong() {
  try {
    const ctx = ensureAudio()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(150, ctx.currentTime)
    osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.2)
    gain.gain.setValueAtTime(0.08, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22)
    osc.start(); osc.stop(ctx.currentTime + 0.22)
  } catch {}
}

function playWin() {
  try {
    const ctx = ensureAudio()
    const notes = [523.25, 659.25, 783.99, 1046.50]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1)
      gain.gain.setValueAtTime(0.05, ctx.currentTime + i * 0.1)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.25)
      osc.start(ctx.currentTime + i * 0.1)
      osc.stop(ctx.currentTime + i * 0.1 + 0.25)
    })
  } catch {}
}

function playLose() {
  try {
    const ctx = ensureAudio()
    const notes = [392.00, 349.23, 311.13, 261.63]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12)
      gain.gain.setValueAtTime(0.06, ctx.currentTime + i * 0.12)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3)
      osc.start(ctx.currentTime + i * 0.12)
      osc.stop(ctx.currentTime + i * 0.12 + 0.3)
    })
  } catch {}
}

export default function games_hangman() {
  const [category, setCategory] = useState('all')
  const [diff, setDiff] = useState('normal')
  const [word, setWord] = useState('')
  const [hint, setHint] = useState('')
  const [guessed, setGuessed] = useState(new Set())
  const [wrongCount, setWrongCount] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)
  const [started, setStarted] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [stats, setStats] = useState(loadStats)
  const [lastPoints, setLastPoints] = useState(0)
  const wrongCountRef = useRef(0)
  const bagRef = useRef({})

  const persist = useCallback((s) => {
    setStats(s)
    try { localStorage.setItem(STATS_KEY, JSON.stringify({ wins: s.wins, losses: s.losses, best: s.best, score: s.score })) } catch {}
  }, [])

  const poolFor = useCallback((cat, d) => {
    const base = cat === 'all' ? Object.values(WORDS).flat() : (WORDS[cat] || WORDS.animals)
    return base.filter(e => DIFFS[d].test(e.word))
  }, [])

  // Shuffle-bag draw: no repeats until the pool is exhausted.
  const drawWord = useCallback((cat, d) => {
    const key = cat + ':' + d
    let bag = bagRef.current[key]
    if (!bag || bag.length === 0) {
      bag = [...poolFor(cat, d)]
      for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[bag[i], bag[j]] = [bag[j], bag[i]]
      }
    }
    const entry = bag.pop()
    bagRef.current[key] = bag
    return entry
  }, [poolFor])

  const initGame = useCallback((cat, d, showW) => {
    const entry = drawWord(cat || category, d || diff)
    setWord(entry.word.toLowerCase())
    setHint(entry.hint)
    setGuessed(new Set())
    setWrongCount(0)
    wrongCountRef.current = 0
    setGameOver(false)
    setWon(false)
    setShowOverlay(false)
    setLastPoints(0)
    setShowWelcome(!!showW)
  }, [category, diff, drawWord])

  useEffect(() => { initGame(category, diff, true) }, [category, diff, initGame])

  useEffect(() => { wrongCountRef.current = wrongCount }, [wrongCount])

  const guessLetter = useCallback((letter) => {
    if (gameOver || showWelcome || showOverlay) return
    if (guessed.has(letter)) return
    setStarted(true)
    const correct = word.includes(letter)
    const newGuessed = new Set(guessed)
    newGuessed.add(letter)
    setGuessed(newGuessed)

    if (!correct) playWrong()
    else playCorrect()

    const wonNow = word.split('').every(c => newGuessed.has(c))
    const newWrongCount = wrongCountRef.current + (correct ? 0 : 1)
    if (!correct) {
      wrongCountRef.current = newWrongCount
      setWrongCount(newWrongCount)
    }
    if (wonNow) {
      const pts = word.length * DIFFS[diff].mult
      setLastPoints(pts)
      setStats(prev => {
        const s = { ...prev, wins: prev.wins + 1, streak: prev.streak + 1, score: prev.score + pts }
        s.best = Math.max(s.best, s.streak)
        try { localStorage.setItem(STATS_KEY, JSON.stringify({ wins: s.wins, losses: s.losses, best: s.best, score: s.score })) } catch {}
        return s
      })
      setGameOver(true)
      setWon(true)
      setShowOverlay(true)
      playWin()
    } else if (newWrongCount >= MAX_WRONG) {
      setStats(prev => {
        const s = { ...prev, losses: prev.losses + 1, streak: 0 }
        try { localStorage.setItem(STATS_KEY, JSON.stringify({ wins: s.wins, losses: s.losses, best: s.best, score: s.score })) } catch {}
        return s
      })
      setGameOver(true)
      setWon(false)
      setShowOverlay(true)
      playLose()
    }
  }, [gameOver, showWelcome, showOverlay, guessed, word, diff])

  useEffect(() => {
    const handler = (e) => {
      if (showWelcome || showOverlay) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          window.dispatchEvent(new Event('ut:game-start'))
        }
        return
      }
      if (gameOver) return
      if (/^[a-z]$/i.test(e.key)) {
        ensureAudio()
        guessLetter(e.key.toLowerCase())
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [gameOver, showWelcome, showOverlay, guessLetter])

  // RAW start logic for the shell (ad + fullscreen handled by GameShell).
  const handleNewGame = () => {
    if (started && !gameOver) {
      if (!confirm('Start a new game? Your progress will be lost.')) return
    }
    setStarted(true)
    initGame(category, diff, false)
  }

  const changeOption = (fn) => {
    if (started && !gameOver) {
      if (!confirm('Changing options starts a new game. Continue?')) return
    }
    fn()
  }

  const wrongLetters = [...guessed].filter(c => !word.includes(c))

  return (
    <GameShell
      name="HANGMAN"
      startAction={handleNewGame} startLabel={started && !gameOver ? '⟲ New Game' : '▶ New Game'}
      extraButtons={<>
        {Object.keys(DIFFS).map(k => (
          <button key={k} type="button" onClick={() => changeOption(() => setDiff(k))}
            className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${diff === k
              ? 'bg-rose-500/25 border-rose-500/50 text-rose-200'
              : 'bg-white/[0.06] border-white/[0.08] text-slate-400 hover:text-white'}`}>
            {DIFFS[k].label}
          </button>
        ))}
      </>}
      headerStats={<><span>❌ <b className="text-red-300">{wrongCount}/{MAX_WRONG}</b></span><span>🔥 <b className="text-amber-300">{stats.streak}</b></span><span>⭐ <b className="text-emerald-300">{stats.score}</b></span><span className="text-slate-400">{category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)} · {DIFFS[diff].label}</span></>}
      title="Hangman Game Online - Free Word Guessing Game"
      desc="Classic word-guessing game with 100 words across 5 categories and 3 difficulty levels. Guess letters, build streaks and beat your best score."
      icon="🪢" iconBg="rgba(244,63,94,0.08)"
      category="fun" slug="games-hangman"
      faq={[
        { q: "How is the score calculated?", a: "Each win earns points equal to the word length times the difficulty multiplier: Easy x1, Normal x2, Hard x3. Wins also build a streak — losing resets it." },
        { q: "What do the difficulty levels change?", a: "Easy uses short words (5 letters or less), Normal mixes all 100 words, and Hard uses long words (7+ letters) worth triple points." },
        { q: "Is my best score saved?", a: "Yes. Your wins, best streak and total score are saved in your browser, so they survive refreshes. Nothing is uploaded anywhere." },
        { q: "Can I play with my keyboard?", a: "Yes. Type letters to guess, and press Enter on the welcome or game-over screen to start. On mobile, tap the on-screen keys." },
      ]}
      howItWorks={[
        "Pick a category and difficulty, then press Start.",
        "Type a letter using your keyboard or tap the on-screen keys.",
        "Correct letters appear in the word. Wrong ones add body parts to the hangman.",
        "Guess the word before 6 wrong guesses to score points and grow your streak!",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Hangman", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/hangman/",
        "genre": ["Word", "Classic", "Puzzle"],
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="flex gap-4 max-w-6xl mx-auto overflow-hidden">
        <div className="flex-1 min-w-0 max-w-2xl mx-auto space-y-5 overflow-hidden">
        {/* Category selector */}
        <div className="flex gap-2 items-center flex-wrap">
          <label className="text-sm font-semibold text-slate-300">Category:</label>
          <select value={category} onChange={e => changeOption(() => setCategory(e.target.value))}
            className="bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/40">
            <option value="all" className="bg-gray-900">All</option>
            {Object.keys(WORDS).map(cat => (
              <option key={cat} value={cat} className="bg-gray-900">{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
          <span className="text-[11px] text-slate-500">{poolFor(category, diff).length} words · {DIFFS[diff].blurb}</span>
        </div>

        {/* Game area */}
        <div className="glass p-6 relative">
          {showWelcome && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-5 py-4 bg-[#050d1a]/92 backdrop-blur-[2px] overflow-y-auto rounded-2xl"
              onPointerDown={(e) => { if (e.target.closest('button') || e.target.closest('select')) return; window.dispatchEvent(new Event('ut:game-start')) }}>
              <img src="/games/hangman/cover.jpg" alt="Hangman word guessing game cover art" loading="eager"
                className="w-full max-w-[420px] aspect-video object-cover rounded-2xl border border-rose-400/30 shadow-[0_0_40px_rgba(244,63,94,0.35)] mb-4" />
              <h2 className="text-4xl sm:text-5xl font-black tracking-tighter bg-gradient-to-b from-rose-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">HANGMAN</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 mb-3">Guess the word · 5 categories · 3 difficulties · 6 wrong guesses</p>
              <div className="flex flex-wrap justify-center gap-1.5 mb-3 text-[11px] font-bold">
                <span className="px-2.5 py-1 rounded-full bg-white/[0.07] border border-white/10 text-rose-200">📝 100 words</span>
                <span className="px-2.5 py-1 rounded-full bg-white/[0.07] border border-white/10 text-purple-200">🗂️ 5 categories</span>
                <span className="px-2.5 py-1 rounded-full bg-white/[0.07] border border-white/10 text-amber-200">💡 Hints included</span>
                <span className="px-2.5 py-1 rounded-full bg-white/[0.07] border border-white/10 text-cyan-200">🔥 Streaks + score</span>
              </div>
              {(stats.wins > 0 || stats.score > 0) && (
                <p className="text-xs text-slate-400 mb-3">Best streak <b className="text-amber-300">{stats.best}</b> · Wins <b className="text-emerald-300">{stats.wins}</b> · Score <b className="text-white">{stats.score}</b></p>
              )}
              <button onClick={() => window.dispatchEvent(new Event('ut:game-start'))} className="px-8 py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-extrabold text-lg shadow-[0_0_30px_rgba(244,63,94,0.5)] hover:scale-105 transition">▶ Start Game</button>
              <p className="text-[11px] text-slate-500 mt-3">Pick a category and difficulty, then start</p>
            </div>
          )}
          {/* SVG Hangman */}
          <div className="flex gap-4 items-start flex-wrap">
            <svg width="140" height="160" viewBox="0 0 160 180" className="flex-shrink-0">
              <line x1="20" y1="170" x2="140" y2="170" stroke="#4a5568" strokeWidth="4" strokeLinecap="round"/>
              <line x1="60" y1="170" x2="60" y2="10" stroke="#4a5568" strokeWidth="4" strokeLinecap="round"/>
              <line x1="60" y1="10" x2="100" y2="10" stroke="#4a5568" strokeWidth="4" strokeLinecap="round"/>
              <line x1="100" y1="10" x2="100" y2="30" stroke="#4a5568" strokeWidth="4" strokeLinecap="round"/>
              {wrongCount >= 1 && <circle cx="100" cy="45" r="15" stroke="#ff6b6b" strokeWidth="3" fill="none" className="animate-[pop_0.3s_ease-out]"/>}
              {wrongCount >= 2 && <line x1="100" y1="60" x2="100" y2="110" stroke="#ff6b6b" strokeWidth="3" strokeLinecap="round" className="animate-[pop_0.3s_ease-out]"/>}
              {wrongCount >= 3 && <line x1="100" y1="75" x2="75" y2="95" stroke="#ff6b6b" strokeWidth="3" strokeLinecap="round" className="animate-[pop_0.3s_ease-out]"/>}
              {wrongCount >= 4 && <line x1="100" y1="75" x2="125" y2="95" stroke="#ff6b6b" strokeWidth="3" strokeLinecap="round" className="animate-[pop_0.3s_ease-out]"/>}
              {wrongCount >= 5 && <line x1="100" y1="110" x2="75" y2="140" stroke="#ff6b6b" strokeWidth="3" strokeLinecap="round" className="animate-[pop_0.3s_ease-out]"/>}
              {wrongCount >= 6 && <line x1="100" y1="110" x2="125" y2="140" stroke="#ff6b6b" strokeWidth="3" strokeLinecap="round" className="animate-[pop_0.3s_ease-out]"/>}
            </svg>

            <div className="flex-1 min-w-[200px]">
              <div className="text-sm text-slate-400 mb-2">Hint: {hint}</div>
              <div className="flex gap-1.5 flex-wrap mb-3">
                {word.split('').map((c, i) => (
                  <div key={i} className="w-10 h-12 flex items-center justify-center bg-white/[0.06] border-2 border-white/10 rounded-lg text-xl font-bold text-white uppercase">
                    {guessed.has(c) ? c : ''}
                  </div>
                ))}
              </div>
              {wrongLetters.length > 0 && (
                <p className="text-sm text-red-400 mb-2">Wrong: {wrongLetters.map(c => c.toUpperCase()).join(', ')}</p>
              )}
              <p className="text-sm font-bold text-white min-h-[1.4em]">
                {showOverlay && (won ? `🎉 You won! +${lastPoints} pts · The word was: ${word.toUpperCase()}` : `💀 Game over! The word was: ${word.toUpperCase()}`)}
              </p>
            </div>
          </div>

          {/* On-screen keyboard (static DOM keys: no focus yank, no scroll jump) */}
          <div className="grid grid-cols-9 gap-1.5 mt-4 bg-[#030b14]/95 rounded-xl p-2 border border-white/[0.06]" style={{ touchAction: 'manipulation' }}>
            {'abcdefghijklmnopqrstuvwxyz'.split('').map(c => {
              const isGuessed = guessed.has(c)
              const isWrong = isGuessed && !word.includes(c)
              const isCorrect = isGuessed && word.includes(c)
              return (
                <button key={c} type="button" disabled={isGuessed || gameOver || showWelcome}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { ensureAudio(); guessLetter(c) }}
                  className={`h-10 rounded-lg text-sm font-bold select-none transition-all ${
                    isWrong ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    isCorrect ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    'bg-white/[0.06] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/10 active:scale-95'
                  }`}>
                  {c.toUpperCase()}
                </button>
              )
            })}
          </div>

          {/* Game over overlay */}
          {showOverlay && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-10">
              <div className="text-4xl mb-3">{won ? '🎉' : '💀'}</div>
              <h2 className="text-xl font-bold text-white mb-2">{won ? `You Won! +${lastPoints} pts` : 'Game Over!'}</h2>
              <p className="text-sm text-slate-400 mb-1">The word was: {word.toUpperCase()}</p>
              <p className="text-xs text-slate-500 mb-4">Streak <b className="text-amber-300">{stats.streak}</b> · Best <b className="text-amber-300">{stats.best}</b> · Score <b className="text-white">{stats.score}</b></p>
              <button onClick={() => window.dispatchEvent(new Event('ut:game-start'))}
                 className="glow-btn px-8 py-3 text-sm">
                Play Again
              </button>
            </div>
          )}
        </div>
        </div>
      </div>
    </GameShell>
  )
}
