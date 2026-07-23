import { useState, useCallback, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

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
  ],
}

const PARTS = ['head', 'body', 'larm', 'rarm', 'lleg', 'rleg']

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

function getWords(cat) {
  if (cat === 'all') return Object.values(WORDS).flat()
  return WORDS[cat] || WORDS.animals
}

function pickWord(cat) {
  const pool = getWords(cat)
  return pool[Math.floor(Math.random() * pool.length)]
}

export default function games_hangman() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [category, setCategory] = useState('all')
  const [word, setWord] = useState('')
  const [hint, setHint] = useState('')
  const [guessed, setGuessed] = useState(new Set())
  const [wrongCount, setWrongCount] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)
  const [started, setStarted] = useState(false)
  const inputRef = useRef(null)
  const wrongCountRef = useRef(0)

  const initGame = useCallback((cat) => {
    const entry = pickWord(cat || category)
    setWord(entry.word.toLowerCase())
    setHint(entry.hint)
    setGuessed(new Set())
    setWrongCount(0)
    setGameOver(false)
    setWon(false)
    setShowOverlay(false)
    setStarted(false)
  }, [category])

  useEffect(() => { initGame(category) }, [category, initGame])

  useEffect(() => { wrongCountRef.current = wrongCount }, [wrongCount])

  useEffect(() => {
    const handler = (e) => {
      if (gameOver || showOverlay) return
      if (/^[a-z]$/i.test(e.key)) {
        ensureAudio()
        guessLetter(e.key.toLowerCase())
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [gameOver, showOverlay, guessLetter])

  const guessLetter = useCallback((letter) => {
    if (gameOver || guessed.has(letter)) return
    const newGuessed = new Set(guessed)
    newGuessed.add(letter)
    setGuessed(newGuessed)
    setStarted(true)

    if (!word.includes(letter)) {
      setWrongCount(prev => {
        const next = prev + 1
        playWrong()
        return next
      })
    } else {
      playCorrect()
    }

    const wonNow = word.split('').every(c => newGuessed.has(c))
    const newWrongCount = wrongCountRef.current + (word.includes(letter) ? 0 : 1)
    if (wonNow) {
      setGameOver(true)
      setWon(true)
      setShowOverlay(true)
      playWin()
    } else if (newWrongCount >= PARTS.length) {
      setGameOver(true)
      setWon(false)
      setShowOverlay(true)
      playLose()
    }
  }, [gameOver, guessed, word, wrongCount])

  const handleNewGame = () => {
    if (started && !gameOver) {
      if (!confirm('Start a new game? Your progress will be lost.')) return
    }
    initGame(category)
  }

  const handleCategoryChange = (cat) => {
    if (started && !gameOver) {
      if (!confirm('Changing category starts a new game. Continue?')) return
    }
    setCategory(cat)
  }

  const wrongLetters = [...guessed].filter(c => !word.includes(c))
  const guessedLetters = [...guessed].filter(c => word.includes(c))

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Hangman Game Online - Free Word Guessing Game"
      desc="Classic word guessing game with multiple categories. Guess the word letter by letter before the man is hanged."
      icon="🪢" iconBg="rgba(244,63,94,0.08)"
      category="fun" slug="games-hangman"
      faq={[
        { q: "What is Hangman?", a: "Hangman is a classic word guessing game where you try to guess a hidden word one letter at a time. You have 6 wrong guesses before the hangman is complete." },
        { q: "How many categories are there?", a: "There are 5 categories: Animals, Countries, Technology, Food, and Sports. You can also play with 'All' to mix them." },
      ]}
      howItWorks={[
        "Select a category or play with all words mixed.",
        "Type a letter using your keyboard or tap the on-screen keys.",
        "Correct letters appear in the word. Wrong ones add body parts to the hangman.",
        "Guess the word before 6 wrong guesses to win!",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Hangman", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/hangman/",
        "genre": ["Word", "Classic", "Puzzle"],
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Category selector */}
        <div className="flex gap-2 items-center flex-wrap">
          <label className="text-sm font-semibold text-slate-300">Category:</label>
          <select value={category} onChange={e => handleCategoryChange(e.target.value)}
            className="bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/40">
            <option value="all" className="bg-gray-900">All</option>
            {Object.keys(WORDS).map(cat => (
              <option key={cat} value={cat} className="bg-gray-900">{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
          <button onClick={handleNewGame}
            className="ml-auto px-5 py-2.5 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.1] transition-all">
           New Game
         </button>
        </div>

        {/* Game area */}
        <div ref={resultRef} className="glass p-6 relative">
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
                {showOverlay && (won ? `🎉 You won! The word was: ${word.toUpperCase()}` : `💀 Game over! The word was: ${word.toUpperCase()}`)}
              </p>
            </div>
          </div>

          {/* Keyboard */}
          <div className="grid grid-cols-9 gap-1.5 mt-4">
            {'abcdefghijklmnopqrstuvwxyz'.split('').map(c => {
              const isGuessed = guessed.has(c)
              const isWrong = isGuessed && !word.includes(c)
              const isCorrect = isGuessed && word.includes(c)
              return (
                <button key={c} disabled={isGuessed || gameOver}
                  onClick={() => { ensureAudio(); guessLetter(c) }}
                  className={`h-10 rounded-lg text-sm font-bold transition-all ${
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
              <h2 className="text-xl font-bold text-white mb-2">{won ? 'You Won!' : 'Game Over!'}</h2>
              <p className="text-sm text-slate-400 mb-4">The word was: {word.toUpperCase()}</p>
              <button onClick={() => initGame(category)}
                 className="glow-btn px-8 py-3 text-sm">
                Play Again
              </button>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
