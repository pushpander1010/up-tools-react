import { useState, useCallback, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const WORDS = {
  animals: [
    { word: 'elephant', hint: 'Largest land animal with a trunk' },
    { word: 'giraffe', hint: 'Tallest animal with a long neck' },
    { word: 'penguin', hint: 'Flightless bird from Antarctica' },
    { word: 'dolphin', hint: 'Intelligent marine mammal' },
    { word: 'cheetah', hint: 'Fastest land animal' },
    { word: 'kangaroo', hint: 'Australian marsupial with a pouch' },
    { word: 'butterfly', hint: 'Colorful flying insect' },
    { word: 'crocodile', hint: 'Large ancient reptile' },
    { word: 'flamingo', hint: 'Pink bird that stands on one leg' },
    { word: 'octopus', hint: 'Eight-armed sea creature' },
  ],
  countries: [
    { word: 'australia', hint: 'Country and continent down under' },
    { word: 'brazil', hint: 'Largest country in South America' },
    { word: 'canada', hint: 'Country north of USA with maple leaf flag' },
    { word: 'germany', hint: 'European country, capital is Berlin' },
    { word: 'japan', hint: 'Island nation known for sushi and anime' },
    { word: 'mexico', hint: 'Country south of USA' },
    { word: 'nigeria', hint: 'Most populous African country' },
    { word: 'thailand', hint: 'Southeast Asian country, land of smiles' },
    { word: 'argentina', hint: 'South American country, home of tango' },
    { word: 'portugal', hint: 'European country, birthplace of explorers' },
  ],
  tech: [
    { word: 'algorithm', hint: 'Step-by-step problem solving procedure' },
    { word: 'database', hint: 'Organized collection of structured data' },
    { word: 'javascript', hint: 'Popular web programming language' },
    { word: 'blockchain', hint: 'Distributed ledger technology' },
    { word: 'encryption', hint: 'Securing data with codes' },
    { word: 'bandwidth', hint: 'Data transfer capacity of a network' },
    { word: 'framework', hint: 'Software development structure' },
    { word: 'interface', hint: 'Point of interaction between systems' },
    { word: 'compiler', hint: 'Translates code to machine language' },
    { word: 'protocol', hint: 'Set of rules for communication' },
  ],
  food: [
    { word: 'spaghetti', hint: 'Long thin Italian pasta' },
    { word: 'avocado', hint: 'Green creamy fruit used in guacamole' },
    { word: 'chocolate', hint: 'Sweet made from cacao beans' },
    { word: 'pineapple', hint: 'Tropical spiky yellow fruit' },
    { word: 'broccoli', hint: 'Green tree-like vegetable' },
    { word: 'croissant', hint: 'French buttery crescent pastry' },
    { word: 'blueberry', hint: 'Small round blue fruit' },
    { word: 'cinnamon', hint: 'Brown spice from tree bark' },
    { word: 'mushroom', hint: 'Fungus used in cooking' },
    { word: 'strawberry', hint: 'Red heart-shaped fruit' },
  ],
  sports: [
    { word: 'basketball', hint: 'Sport with hoops and orange ball' },
    { word: 'volleyball', hint: 'Net sport with six players per side' },
    { word: 'badminton', hint: 'Racket sport with shuttlecock' },
    { word: 'swimming', hint: 'Water sport' },
    { word: 'gymnastics', hint: 'Sport with flips and balance beams' },
    { word: 'archery', hint: 'Sport with bow and arrow' },
    { word: 'wrestling', hint: 'Combat sport on a mat' },
    { word: 'marathon', hint: '42.195 km running race' },
    { word: 'cricket', hint: 'Bat and ball sport popular in India' },
    { word: 'football', hint: 'Most popular sport in the world' },
  ],
}

let audioCtx = null
function ensureAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

function playTone(freq, dur, type = 'sine', vol = 0.04) {
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

function scramble(word) {
  const arr = word.split('')
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  const result = arr.join('')
  return result === word ? scramble(word) : result
}

function getPool(cat) {
  return cat === 'all' ? Object.values(WORDS).flat() : (WORDS[cat] || [])
}

export default function games_word_scramble() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [category, setCategory] = useState('all')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [questionNum, setQuestionNum] = useState(1)
  const [currentWord, setCurrentWord] = useState('')
  const [currentHint, setCurrentHint] = useState('')
  const [scrambledWord, setScrambledWord] = useState('')
  const [hintRevealed, setHintRevealed] = useState(false)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState({ text: '', color: '' })
  const [showOverlay, setShowOverlay] = useState(false)
  const [overlayText, setOverlayText] = useState({ title: '', message: '' })
  const inputRef = useRef(null)

  const nextWord = useCallback((cat) => {
    const pool = getPool(cat || category)
    const entry = pool[Math.floor(Math.random() * pool.length)]
    setCurrentWord(entry.word)
    setCurrentHint(entry.hint)
    setScrambledWord(scramble(entry.word))
    setHintRevealed(false)
    setAnswer('')
    setFeedback({ text: '', color: '' })
    setShowOverlay(false)
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [category])

  useEffect(() => { nextWord(category) }, []) // eslint-disable-line

  const handleSubmit = useCallback(() => {
    ensureAudio()
    const trimmed = answer.trim().toLowerCase()
    if (!trimmed) return

    if (trimmed === currentWord) {
      const points = hintRevealed ? 5 : 10
      setScore(s => s + points)
      setStreak(s => s + 1)
      setQuestionNum(n => n + 1)
      setFeedback({ text: `✅ Correct! +${points} points`, color: '#00e5a0' })
      playTone(587.33, 0.08)
      setTimeout(() => playTone(880, 0.12), 80)
      setTimeout(nextWord, 1000)
    } else {
      setStreak(0)
      setFeedback({ text: `❌ Try again! (${trimmed.length} letters)`, color: '#ff6b6b' })
      playTone(120, 0.18, 'sawtooth', 0.06)
      setAnswer('')
    }
  }, [answer, currentWord, hintRevealed, nextWord])

  const handleSkip = () => {
    playTone(440, 0.05, 'sine', 0.02)
    setStreak(0)
    setQuestionNum(n => n + 1)
    nextWord()
  }

  const handleReveal = () => {
    playTone(440, 0.05, 'sine', 0.02)
    setOverlayText({ title: 'Reveal Answer', message: `The word was: ${currentWord.toUpperCase()}` })
    setShowOverlay(true)
    setStreak(0)
  }

  const handleNewGame = () => {
    playTone(440, 0.05, 'sine', 0.02)
    setScore(0); setStreak(0); setQuestionNum(1)
    nextWord()
  }

  return (
    <ToolLayout
      title="Word Scramble Game Online - Unscramble Words Free"
      desc="Unscramble jumbled letters to find the hidden word. Multiple categories, hints, and scoring."
      icon="🔀" iconBg="rgba(168,85,247,0.08)"
      category="fun" slug="games-word-scramble"
      faq={[
        { q: "How does scoring work?", a: "You get 10 points for a correct answer without a hint, and 5 points if you used the hint. Streaks are tracked too!" },
        { q: "What if I can't guess the word?", a: "You can skip to the next word (streak resets) or reveal the answer." },
      ]}
      howItWorks={[
        "Select a category or play with all words.",
        "Look at the scrambled letters and type your answer.",
        "Use the hint if you're stuck (reduces points).",
        "Build streaks for consecutive correct answers!",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Word Scramble", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/word-scramble/",
        "genre": ["Word", "Puzzle", "Brain"],
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Category selector */}
        <div className="flex gap-2 items-center flex-wrap">
          <select value={category} onChange={e => { setCategory(e.target.value); nextWord(e.target.value) }}
            className="bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/40">
            <option value="all" className="bg-gray-900">All Categories</option>
            {Object.keys(WORDS).map(cat => (
              <option key={cat} value={cat} className="bg-gray-900">{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
          <button onClick={handleSkip}
            className="px-4 py-2.5 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all">Skip</button>
          <button onClick={handleNewGame}
            className="px-4 py-2.5 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all">New Game</button>
        </div>

        {/* Score row */}
        <div className="glass p-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-extrabold text-white">{score}</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-white">{streak} 🔥</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-white">{questionNum}</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Question</div>
            </div>
          </div>
        </div>

        {/* Scrambled word */}
        <div className="text-center text-3xl sm:text-4xl font-bold tracking-[0.2em] sm:tracking-[0.3em] text-white py-4 overflow-hidden px-2">
          {scrambledWord.toUpperCase()}
        </div>

        {/* Hint */}
        <button onClick={() => { setHintRevealed(true); playTone(523.25, 0.08) }}
          className="w-full text-center py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-400 hover:bg-amber-500/15 transition-all">
          💡 {hintRevealed ? currentHint : 'Click for hint'}
        </button>

        {/* Input */}
        <input ref={inputRef} type="text" value={answer} onChange={e => setAnswer(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
          placeholder="TYPE YOUR ANSWER…"
          className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-5 py-3.5 text-white font-semibold text-lg tracking-wider outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 text-center uppercase" />

        {/* Buttons */}
        <div className="flex gap-3 justify-center">
          <button onClick={() => { ensureAudio(); handleSubmit(); jumpTo() }}
            className="glow-btn px-8 py-3 text-sm">
           ✅ Submit
         </button>
         <button onClick={handleReveal}
            className="px-6 py-3 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all">
           Reveal Answer
         </button>
        </div>

        {/* Feedback */}
        {feedback.text && (
          <p className="text-center text-sm font-bold" style={{ color: feedback.color }}>{feedback.text}</p>
        )}

        {/* Overlay */}
        {showOverlay && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#0e1628] border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center">
              <h2 className="text-xl font-bold text-white mb-2">{overlayText.title}</h2>
              <p className="text-slate-400 mb-6">{overlayText.message}</p>
              <button onClick={() => { nextWord() }}
                 className="glow-btn px-8 py-3 text-sm">
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
