import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const QUESTIONS = [
  {
    q: 'India gained independence from British rule on which date?',
    options: ['15 August 1947', '26 January 1950', '15 August 1950', '26 January 1947'],
    answer: 0,
  },
  {
    q: 'Who is known as the "Father of the Nation" in India?',
    options: ['Jawaharlal Nehru', 'Mahatma Gandhi', 'Subhas Chandra Bose', 'Sardar Patel'],
    answer: 1,
  },
  {
    q: 'Who was the first Prime Minister of independent India?',
    options: ['Sardar Vallabhbhai Patel', 'Dr. Rajendra Prasad', 'Jawaharlal Nehru', 'Lal Bahadur Shastri'],
    answer: 2,
  },
  {
    q: 'Which freedom fighter gave the slogan "Jai Hind"?',
    options: ['Mahatma Gandhi', 'Bhagat Singh', 'Subhas Chandra Bose', 'Bal Gangadhar Tilak'],
    answer: 2,
  },
  {
    q: 'The national flag of India has how many spokes in the Ashoka Chakra?',
    options: ['12', '18', '21', '24'],
    answer: 3,
  },
  {
    q: 'What is the national animal of India?',
    options: ['Lion', 'Bengal Tiger', 'Elephant', 'Leopard'],
    answer: 1,
  },
  {
    q: 'Who wrote the national anthem "Jana Gana Mana"?',
    options: ['Mahatma Gandhi', 'Sarojini Naidu', 'Rabindranath Tagore', 'Bankim Chandra Chatterjee'],
    answer: 2,
  },
  {
    q: 'The famous "Quit India Movement" was launched in which year?',
    options: ['1930', '1942', '1935', '1945'],
    answer: 1,
  },
  {
    q: 'Which freedom fighter was known as the "Iron Man of India"?',
    options: ['Subhas Chandra Bose', 'Bhagat Singh', 'Sardar Vallabhbhai Patel', 'Bal Gangadhar Tilak'],
    answer: 2,
  },
  {
    q: 'Who was the first Governor-General (Governor-General of the Dominion) of independent India?',
    options: ['Lord Mountbatten', 'C. Rajagopalachari', 'Jawaharlal Nehru', 'Dr. Rajendra Prasad'],
    answer: 0,
  },
  {
    q: 'The national flower of India is:',
    options: ['Rose', 'Lotus', 'Sunflower', 'Marigold'],
    answer: 1,
  },
  {
    q: 'Which of these is a national symbol of India?',
    options: ['Peacock', 'Taj Mahal', 'Gateway of India', 'Red Fort'],
    answer: 0,
  },
  {
    q: '"Swaraj is my birthright and I shall have it" — whose famous slogan?',
    options: ['Mahatma Gandhi', 'Lala Lajpat Rai', 'Bal Gangadhar Tilak', 'Gopal Krishna Gokhale'],
    answer: 2,
  },
  {
    q: 'The Indian Constitution was adopted on which date?',
    options: ['15 August 1947', '26 January 1950', '26 November 1949', '15 August 1950'],
    answer: 2,
  },
  {
    q: 'Who unfurled the national flag at the Red Fort on the first Independence Day in 1947?',
    options: ['Mahatma Gandhi', 'Jawaharlal Nehru', 'Sardar Patel', 'Dr. Rajendra Prasad'],
    answer: 1,
  },
]

const CATEGORY = [
  { name: 'Freedom Fighters', range: [0, 3] },
  { name: 'National Symbols', range: [4, 8] },
  { name: 'History & Slogans', range: [9, 14] },
]

export default function independence_day_quiz() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [started, setStarted] = useState(false)

  const q = QUESTIONS[idx]

  const start = () => {
    setStarted(true)
    setIdx(0)
    setSelected(null)
    setScore(0)
    setDone(false)
    jumpTo()
  }

  const answer = (i) => {
    if (selected !== null) return
    setSelected(i)
    if (i === q.answer) setScore(s => s + 1)
  }

  const next = () => {
    if (idx + 1 >= QUESTIONS.length) {
      setDone(true)
    } else {
      setIdx(i => i + 1)
      setSelected(null)
    }
  }

  const pct = Math.round((score / QUESTIONS.length) * 100)

  const verdict = pct >= 80 ? { t: '🇮🇳 True Patriot!', c: 'text-emerald-400', m: 'Outstanding! You know India inside out. Jai Hind!' }
    : pct >= 60 ? { t: '🏅 Patriotic Proud', c: 'text-indigo-400', m: 'Great job! Brush up on a few facts to reach the top.' }
    : pct >= 40 ? { t: '🤔 Getting There', c: 'text-amber-400', m: 'Not bad! Revisit your Indian history and try again.' }
    : { t: '📚 Keep Learning', c: 'text-rose-400', m: 'This Independence Day, take a moment to learn more about India\'s great history.' }

  return (
    <ToolLayout
      title="Independence Day Quiz"
      desc="Test your knowledge of India's freedom fighters, national symbols, and history with this fun Independence Day quiz. 15 questions, instant scoring, share your score!"
      icon="🇮🇳" iconBg="rgba(19,136,8,0.10)"
      category="games" slug="independence-day-quiz"
      faq={[
        { q: 'How many questions are in the Independence Day quiz?', a: 'There are 15 questions covering freedom fighters, national symbols, and Indian history.' },
        { q: 'Is the quiz free?', a: 'Yes, it is completely free and requires no sign-up. You can retake it as many times as you like.' },
        { q: 'Can I share my score?', a: 'Yes — your final score is shown with a verdict you can share on WhatsApp, Instagram, or Facebook.' },
      ]}
      howItWorks={[
        'Tap Start Quiz to begin.',
        'Answer each multiple-choice question — pick one option per question.',
        'See your score and verdict at the end, then retake or share.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Independence Day Quiz", "applicationCategory": "GamesApplication",
        "url": "https://www.uptools.in/independence-day-quiz/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {!started && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-8 text-center space-y-4">
            <div className="text-5xl">🇮🇳</div>
            <div>
              <h3 className="text-xl font-bold text-white">Independence Day Quiz</h3>
              <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">15 questions on freedom fighters, national symbols, and Indian history. How well do you know your country?</p>
            </div>
            <button onClick={start} className="px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg text-sm">
              🚀 Start Quiz
            </button>
          </div>
        )}

        {started && !done && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-7 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Question {idx + 1} / {QUESTIONS.length}</span>
              <span className="text-xs font-bold text-emerald-400">Score: {score}</span>
            </div>
            <div className="h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300" style={{ width: `${((idx + 1) / QUESTIONS.length) * 100}%` }} />
            </div>

            <h3 className="text-lg font-bold text-white leading-snug">{q.q}</h3>

            <div className="space-y-2.5">
              {q.options.map((opt, i) => {
                let cls = 'bg-white/[0.06] border-white/[0.08] hover:bg-white/[0.12] text-white'
                if (selected !== null) {
                  if (i === q.answer) cls = 'bg-emerald-600/20 border-emerald-500/50 text-emerald-300'
                  else if (i === selected) cls = 'bg-rose-600/20 border-rose-500/50 text-rose-300'
                  else cls = 'bg-white/[0.04] border-white/[0.06] text-slate-500'
                }
                return (
                  <button key={i} onClick={() => answer(i)} disabled={selected !== null}
                    className={`w-full text-left px-4 py-3.5 rounded-xl border font-semibold transition-all ${cls}`}>
                    <span className="font-mono text-xs opacity-60 mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
                  </button>
                )
              })}
            </div>

            {selected !== null && (
              <div className="flex items-center justify-between gap-3 pt-1">
                <span className={`text-sm font-bold ${selected === q.answer ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {selected === q.answer ? '✓ Correct!' : `✗ Correct: ${q.options[q.answer]}`}
                </span>
                <button onClick={next} className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg text-sm">
                  {idx + 1 >= QUESTIONS.length ? 'See Result →' : 'Next →'}
                </button>
              </div>
            )}
          </div>
        )}

        {done && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-8 text-center space-y-4">
            <div className="text-5xl">{pct >= 60 ? '🏆' : pct >= 40 ? '🎉' : '💪'}</div>
            <div>
              <h3 className={`text-2xl font-extrabold ${verdict.c}`}>{verdict.t}</h3>
              <p className="text-4xl font-black text-white mt-2">{score} / {QUESTIONS.length}</p>
              <p className="text-sm text-slate-400 mt-2">{verdict.m}</p>
            </div>
            <div className="h-3 w-full max-w-xs mx-auto bg-white/[0.08] rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-indigo-500' : pct >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${pct}%` }} />
            </div>
            <div className="flex flex-wrap gap-3 justify-center pt-2">
              <button onClick={start} className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg text-sm">
                🔄 Retake Quiz
              </button>
            </div>
          </div>
        )}

        {CATEGORY && started && (
          <p className="text-xs text-slate-600 text-center">Categories: {CATEGORY.map(c => c.name).join(' • ')}</p>
        )}
      </div>
    </ToolLayout>
  )
}
