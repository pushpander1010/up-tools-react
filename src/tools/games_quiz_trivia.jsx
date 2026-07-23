import { useState, useCallback, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const QUESTIONS = {
  science: [
    { q: "What is the chemical symbol for gold?", opts: ["Au", "Ag", "Fe", "Cu"], ans: 0, diff: "Easy" },
    { q: "How many bones are in the adult human body?", opts: ["206", "208", "196", "212"], ans: 0, diff: "Medium" },
    { q: "What planet is known as the Red Planet?", opts: ["Venus", "Jupiter", "Mars", "Saturn"], ans: 2, diff: "Easy" },
    { q: "What is the speed of light (approx)?", opts: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "200,000 km/s"], ans: 0, diff: "Medium" },
    { q: "What gas do plants absorb from the atmosphere?", opts: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], ans: 2, diff: "Easy" },
    { q: "What is the powerhouse of the cell?", opts: ["Nucleus", "Ribosome", "Mitochondria", "Golgi body"], ans: 2, diff: "Easy" },
    { q: "What is the atomic number of Carbon?", opts: ["6", "8", "12", "14"], ans: 0, diff: "Medium" },
    { q: "Which planet has the most moons?", opts: ["Jupiter", "Saturn", "Uranus", "Neptune"], ans: 1, diff: "Hard" },
    { q: "What is the hardest natural substance on Earth?", opts: ["Gold", "Iron", "Diamond", "Quartz"], ans: 2, diff: "Easy" },
    { q: "What is the most abundant gas in Earth's atmosphere?", opts: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"], ans: 2, diff: "Medium" },
  ],
  history: [
    { q: "In which year did World War II end?", opts: ["1943", "1944", "1945", "1946"], ans: 2, diff: "Easy" },
    { q: "Who was the first President of the United States?", opts: ["Abraham Lincoln", "George Washington", "Thomas Jefferson", "John Adams"], ans: 1, diff: "Easy" },
    { q: "The Great Wall of China was primarily built during which dynasty?", opts: ["Han", "Tang", "Ming", "Qing"], ans: 2, diff: "Medium" },
    { q: "In which year did India gain independence?", opts: ["1945", "1947", "1948", "1950"], ans: 1, diff: "Easy" },
    { q: "Who painted the Mona Lisa?", opts: ["Michelangelo", "Raphael", "Leonardo da Vinci", "Donatello"], ans: 2, diff: "Easy" },
    { q: "The Berlin Wall fell in which year?", opts: ["1987", "1988", "1989", "1990"], ans: 2, diff: "Medium" },
    { q: "Which ancient wonder was located in Alexandria?", opts: ["Colossus of Rhodes", "Lighthouse of Alexandria", "Hanging Gardens", "Temple of Artemis"], ans: 1, diff: "Hard" },
    { q: "Who was the first man to walk on the moon?", opts: ["Buzz Aldrin", "Yuri Gagarin", "Neil Armstrong", "John Glenn"], ans: 2, diff: "Easy" },
    { q: "The French Revolution began in which year?", opts: ["1776", "1789", "1799", "1804"], ans: 1, diff: "Medium" },
    { q: "Which empire was ruled by Genghis Khan?", opts: ["Ottoman", "Roman", "Mongol", "Persian"], ans: 2, diff: "Easy" },
  ],
  tech: [
    { q: "What does 'HTTP' stand for?", opts: ["HyperText Transfer Protocol", "High Tech Transfer Protocol", "HyperText Transmission Process", "Hyper Transfer Text Protocol"], ans: 0, diff: "Easy" },
    { q: "Who co-founded Apple with Steve Jobs?", opts: ["Bill Gates", "Steve Wozniak", "Paul Allen", "Larry Page"], ans: 1, diff: "Easy" },
    { q: "What does 'CPU' stand for?", opts: ["Central Processing Unit", "Computer Processing Unit", "Central Program Unit", "Core Processing Unit"], ans: 0, diff: "Easy" },
    { q: "Which programming language was created by Guido van Rossum?", opts: ["Java", "Ruby", "Python", "Perl"], ans: 2, diff: "Easy" },
    { q: "What year was the first iPhone released?", opts: ["2005", "2006", "2007", "2008"], ans: 2, diff: "Medium" },
    { q: "What does 'RAM' stand for?", opts: ["Random Access Memory", "Read Access Memory", "Rapid Access Module", "Random Application Memory"], ans: 0, diff: "Easy" },
    { q: "Which company developed the Android operating system?", opts: ["Apple", "Microsoft", "Google", "Samsung"], ans: 2, diff: "Easy" },
    { q: "What is the binary representation of the decimal number 10?", opts: ["1010", "1001", "1100", "0110"], ans: 0, diff: "Medium" },
    { q: "What does 'URL' stand for?", opts: ["Universal Resource Locator", "Uniform Resource Locator", "Universal Reference Link", "Unified Resource Locator"], ans: 1, diff: "Easy" },
    { q: "Which company created the Java programming language?", opts: ["Microsoft", "IBM", "Sun Microsystems", "Oracle"], ans: 2, diff: "Medium" },
  ],
  sports: [
    { q: "How many players are on a standard soccer team?", opts: ["9", "10", "11", "12"], ans: 2, diff: "Easy" },
    { q: "In which sport would you perform a 'slam dunk'?", opts: ["Volleyball", "Basketball", "Tennis", "Baseball"], ans: 1, diff: "Easy" },
    { q: "How many Grand Slam tournaments are there in tennis?", opts: ["2", "3", "4", "5"], ans: 2, diff: "Easy" },
    { q: "Which country has won the most FIFA World Cups?", opts: ["Germany", "Argentina", "Italy", "Brazil"], ans: 3, diff: "Medium" },
    { q: "How long is a standard marathon?", opts: ["26.2 miles", "25 miles", "27 miles", "24.5 miles"], ans: 0, diff: "Medium" },
    { q: "In cricket, how many balls are in an over?", opts: ["4", "5", "6", "8"], ans: 2, diff: "Easy" },
    { q: "Which sport uses a shuttlecock?", opts: ["Tennis", "Squash", "Badminton", "Pickleball"], ans: 2, diff: "Easy" },
    { q: "How many rings are on the Olympic flag?", opts: ["4", "5", "6", "7"], ans: 1, diff: "Easy" },
    { q: "In which sport is the 'Ryder Cup' contested?", opts: ["Tennis", "Golf", "Cricket", "Rugby"], ans: 1, diff: "Medium" },
    { q: "What is the maximum score in a single bowling frame?", opts: ["10", "20", "30", "300"], ans: 2, diff: "Medium" },
  ],
  geography: [
    { q: "What is the capital of Australia?", opts: ["Sydney", "Melbourne", "Canberra", "Brisbane"], ans: 2, diff: "Medium" },
    { q: "Which is the longest river in the world?", opts: ["Amazon", "Nile", "Yangtze", "Mississippi"], ans: 1, diff: "Easy" },
    { q: "What is the smallest country in the world?", opts: ["Monaco", "San Marino", "Vatican City", "Liechtenstein"], ans: 2, diff: "Medium" },
    { q: "Which continent is the Sahara Desert located in?", opts: ["Asia", "Australia", "Africa", "South America"], ans: 2, diff: "Easy" },
    { q: "What is the capital of Canada?", opts: ["Toronto", "Vancouver", "Montreal", "Ottawa"], ans: 3, diff: "Medium" },
    { q: "Which ocean is the largest?", opts: ["Atlantic", "Indian", "Arctic", "Pacific"], ans: 3, diff: "Easy" },
    { q: "Mount Everest is located in which mountain range?", opts: ["Andes", "Alps", "Himalayas", "Rockies"], ans: 2, diff: "Easy" },
    { q: "What is the capital of Japan?", opts: ["Osaka", "Kyoto", "Tokyo", "Hiroshima"], ans: 2, diff: "Easy" },
    { q: "Which country has the most natural lakes?", opts: ["Russia", "USA", "Canada", "Brazil"], ans: 2, diff: "Hard" },
    { q: "The Amazon River flows through which continent?", opts: ["Africa", "Asia", "South America", "North America"], ans: 2, diff: "Easy" },
  ],
}

let audioCtx = null
function ensureAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

function playSound(type) {
  try {
    const ctx = ensureAudio()
    const now = ctx.currentTime
    if (type === 'correct') {
      const notes = [523.25, 659.25]
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now + idx * 0.08)
        gain.gain.setValueAtTime(0.0, now + idx * 0.08)
        gain.gain.linearRampToValueAtTime(0.1, now + idx * 0.08 + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.2)
        osc.connect(gain); gain.connect(ctx.destination)
        osc.start(now + idx * 0.08); osc.stop(now + idx * 0.08 + 0.2)
      })
    } else if (type === 'wrong') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(150, now)
      osc.frequency.linearRampToValueAtTime(100, now + 0.25)
      gain.gain.setValueAtTime(0.0, now)
      gain.gain.linearRampToValueAtTime(0.08, now + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
      osc.connect(gain); gain.connect(ctx.destination)
      osc.start(now); osc.stop(now + 0.25)
    } else if (type === 'victory') {
      const notes = [261.63, 329.63, 392.00, 523.25]
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now + idx * 0.1)
        gain.gain.setValueAtTime(0.0, now + idx * 0.1)
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.1 + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.35)
        osc.connect(gain); gain.connect(ctx.destination)
        osc.start(now + idx * 0.1); osc.stop(now + idx * 0.1 + 0.35)
      })
    } else if (type === 'click') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(600, now)
      gain.gain.setValueAtTime(0.0, now)
      gain.gain.linearRampToValueAtTime(0.05, now + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
      osc.connect(gain); gain.connect(ctx.destination)
      osc.start(now); osc.stop(now + 0.08)
    }
  } catch {}
}

function getQuestions(cat) {
  let pool = cat === 'all' ? Object.values(QUESTIONS).flat() : (QUESTIONS[cat] || [])
  pool = [...pool].sort(() => Math.random() - 0.5)
  return pool.slice(0, 10)
}

export default function games_quiz_trivia() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [category, setCategory] = useState('all')
  const [questions, setQuestions] = useState([])
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [started, setStarted] = useState(false)

  const startQuiz = useCallback((cat) => {
    const qs = getQuestions(cat || category)
    setQuestions(qs)
    setCurrentQ(0); setScore(0); setStreak(0); setAnswered(false); setSelectedIdx(null)
    setShowResult(false); setStarted(true)
    playSound('click')
  }, [category])

  useEffect(() => { startQuiz(category) }, []) // eslint-disable-line

  const handleCategoryChange = (cat) => {
    setCategory(cat)
    startQuiz(cat)
  }

  const selectAnswer = useCallback((idx) => {
    if (answered) return
    setAnswered(true)
    setSelectedIdx(idx)
    const q = questions[currentQ]

    if (idx === q.ans) {
      playSound('correct')
      setScore(s => s + 1)
      setStreak(s => s + 1)
    } else {
      playSound('wrong')
      setStreak(0)
    }

    if (currentQ >= questions.length - 1) {
      setTimeout(() => {
        playSound('victory')
        setShowResult(true)
      }, 1200)
    }
  }, [answered, currentQ, questions])

  const handleNext = () => {
    playSound('click')
    setCurrentQ(c => c + 1)
    setAnswered(false)
    setSelectedIdx(null)
  }

  const q = questions[currentQ]
  const progressPct = questions.length ? ((currentQ + 1) / questions.length) * 100 : 0
  const msgs = ['Keep practicing! 💪', 'Not bad! 👍', 'Good job! 🎉', 'Excellent! 🌟', 'Perfect score! 🏆']

  return (
    <ToolLayout
      title="Quiz Trivia Game Online - General Knowledge Quiz Free"
      desc="Test your general knowledge with 10 questions per round across science, history, sports, tech, and more."
      icon="🧠" iconBg="rgba(168,85,247,0.08)"
      category="fun" slug="games-quiz-trivia"
      faq={[
        { q: "How many questions per round?", a: "10 questions per round, randomly selected from the chosen category." },
        { q: "Can I play again?", a: "Yes! Click 'Play Again' at the end of each round to start a new quiz." },
      ]}
      howItWorks={[
        "Select a category or play with all topics mixed.",
        "Answer 10 multiple-choice questions.",
        "Build streaks for consecutive correct answers!",
        "See your final score at the end of each round.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Quiz Trivia", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/quiz-trivia/",
        "genre": ["Quiz", "Brain", "Educational"],
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {!showResult && started && q && (
          <>
            {/* Category + New Quiz */}
            <div className="flex gap-2 items-center flex-wrap">
              <select value={category} onChange={e => handleCategoryChange(e.target.value)}
                className="bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/40">
                <option value="all" className="bg-gray-900">All Categories</option>
                {Object.keys(QUESTIONS).map(cat => (
                  <option key={cat} value={cat} className="bg-gray-900">{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
              <button onClick={() => startQuiz(category)}
                className="ml-auto px-5 py-2.5 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-300 hover:text-white transition-all">
                New Quiz
              </button>
            </div>

            {/* Score row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-black/20 rounded-xl">
                <div className="text-xl font-extrabold text-white">{score}</div>
                <div className="text-xs text-slate-500">Score</div>
              </div>
              <div className="text-center p-3 bg-black/20 rounded-xl">
                <div className="text-xl font-extrabold text-white">{currentQ + 1}/10</div>
                <div className="text-xs text-slate-500">Question</div>
              </div>
              <div className="text-center p-3 bg-black/20 rounded-xl">
                <div className="text-xl font-extrabold text-white">{streak} 🔥</div>
                <div className="text-xs text-slate-500">Streak</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }}/>
            </div>

            {/* Category & Difficulty pills */}
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-400 text-xs font-bold border border-indigo-500/30">
                {category === 'all' ? 'Mixed' : category}
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-500/15 text-purple-400 text-xs font-bold border border-purple-500/30">
                {q.diff}
              </span>
            </div>

            {/* Question */}
            <div ref={resultRef} className="p-5 bg-black/20 rounded-xl text-lg font-semibold text-white">{q.q}</div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-3">
              {q.opts.map((opt, i) => {
                const isSelected = selectedIdx === i
                const isCorrect = i === q.ans
                let btnClass = "w-full text-left p-4 rounded-xl text-sm font-semibold transition-all border-2 "
                if (answered) {
                  if (isCorrect) btnClass += "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                  else if (isSelected) btnClass += "bg-red-500/15 border-red-500/30 text-red-400"
                  else btnClass += "bg-white/[0.02] border-white/[0.05] text-slate-600"
                } else {
                  btnClass += "bg-white/[0.06] border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/10 active:scale-[0.98]"
                }
                return (
                  <button key={i} disabled={answered} onClick={() => selectAnswer(i)} className={btnClass}>
                    {String.fromCharCode(65 + i)}. {opt}
                  </button>
                )
              })}
            </div>

            {/* Feedback */}
            {answered && (
              <p className="text-center text-sm font-bold" style={{ color: selectedIdx === q.ans ? '#00e5a0' : '#ff6b6b' }}>
                {selectedIdx === q.ans
                  ? `✅ Correct! ${streak > 1 ? `🔥 ${streak} streak!` : ''}`
                  : `❌ Wrong! The answer was: ${q.opts[q.ans]}`}
              </p>
            )}

            {/* Next button */}
            {answered && currentQ < questions.length - 1 && (
              <div className="text-center">
                <button onClick={handleNext}
                  className="px-8 py-3 rounded-xl text-sm font-bold text-white transition-all"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  Next Question →
                </button>
              </div>
            )}
          </>
        )}

        {/* Result */}
        {showResult && (
          <div className="text-center p-8 bg-white/[0.06] border-2 border-white/8 rounded-2xl">
            <div className="text-5xl font-extrabold text-white mb-2">{score}/10</div>
            <p className="text-slate-400 mb-2">Questions Correct</p>
            <p className="text-lg font-bold text-white mb-6">{msgs[Math.floor(score / 2.5)] || msgs[4]}</p>
            <button onClick={() => startQuiz(category)}
              className="px-8 py-3 rounded-xl text-sm font-bold text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              Play Again
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
