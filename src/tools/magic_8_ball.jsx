import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const ANSWERS = [
  { text: "It is certain.", type: "affirmative" },
  { text: "It is decidedly so.", type: "affirmative" },
  { text: "Without a doubt.", type: "affirmative" },
  { text: "Yes — definitely.", type: "affirmative" },
  { text: "You may rely on it.", type: "affirmative" },
  { text: "As I see it, yes.", type: "affirmative" },
  { text: "Most likely.", type: "affirmative" },
  { text: "Outlook good.", type: "affirmative" },
  { text: "Yes.", type: "affirmative" },
  { text: "Signs point to yes.", type: "affirmative" },
  { text: "Reply hazy, try again.", type: "neutral" },
  { text: "Ask again later.", type: "neutral" },
  { text: "Better not tell you now.", type: "neutral" },
  { text: "Cannot predict now.", type: "neutral" },
  { text: "Concentrate and ask again.", type: "neutral" },
  { text: "Don't count on it.", type: "negative" },
  { text: "My reply is no.", type: "negative" },
  { text: "My sources say no.", type: "negative" },
  { text: "Outlook not so good.", type: "negative" },
  { text: "Very doubtful.", type: "negative" },
]

const typeColor = {
  affirmative: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  neutral: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  negative: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
}

export default function magic_8_ball() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [question, setQuestion] = useState('')
  const [currentAnswer, setCurrentAnswer] = useState(null)
  const [isShaking, setIsShaking] = useState(false)
  const [history, setHistory] = useState([])

  const ask = useCallback(() => {
    const q = question.trim()
    if (!q) return
    setIsShaking(true)
    setCurrentAnswer(null)

    setTimeout(() => {
      const answer = ANSWERS[Math.floor(Math.random() * ANSWERS.length)]
      setCurrentAnswer(answer)
      setIsShaking(false)
      setHistory(prev => [{ question: q, answer: answer.text, type: answer.type, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }, ...prev].slice(0, 20))
      jumpTo()
    }, 1200)
  }, [question, jumpTo])

  const handleKeyDown = (e) => { if (e.key === 'Enter') ask() }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400"

  return (
    <ToolLayout
      title="Magic 8 Ball – Online Yes or No Answer"
      desc="Ask the Magic 8 Ball any yes or no question and get an instant answer. Classic 20 answers with color coding and answer history."
      icon="🎱" iconBg="rgba(30,41,59,0.3)"
      category="fun" slug="magic-8-ball"
      faq={[
        { q: "How many answers does the Magic 8 Ball have?", a: "This online Magic 8 Ball features all 20 classic answers: 10 affirmative, 5 non-committal, and 5 negative — just like the original toy." },
        { q: "Is the answer truly random?", a: "Yes! Each answer is picked randomly using JavaScript's Math.random(). Different shakes give different answers." },
        { q: "Can I see my previous answers?", a: "Yes, the answer history shows your last 20 questions and answers in chronological order." },
        { q: "Is this Magic 8 Ball free to use?", a: "Completely free, no sign-up needed. Works on any device with a web browser." },
      ]}
      howItWorks={[
        "Type your yes or no question in the input box above.",
        "Press Enter or click the Ask button to shake the Magic 8 Ball.",
        "Watch the shake animation and wait for your answer to appear.",
        "Your question and answer are saved in the history below.",
        "Ask as many questions as you like — the history keeps your last 20 answers.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Magic 8 Ball", "applicationCategory": "EntertainmentApplication",
        "operatingSystem": "WebBrowser",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex gap-3">
          <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a yes or no question…"
            className={`${inputClass} flex-1`} />
          <button onClick={ask} disabled={isShaking || !question.trim()}
            className="px-6 py-3.5 rounded-xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap">
            Ask
          </button>
        </div>

        <div className="flex justify-center">
          <div className={`w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-4 border-indigo-500/20 flex items-center justify-center shadow-2xl shadow-indigo-500/10 transition-transform duration-300 ${
            isShaking ? 'animate-shake' : ''
          }`}>
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-slate-900 to-black flex items-center justify-center border border-white/5">
              <span className="text-white text-5xl sm:text-6xl font-black drop-shadow-lg" style={{ textShadow: '0 0 20px rgba(99,102,241,0.5)' }}>8</span>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes shake {
            0%, 100% { transform: rotate(0deg) scale(1); }
            10% { transform: rotate(-12deg) scale(1.05); }
            20% { transform: rotate(10deg) scale(1.05); }
            30% { transform: rotate(-8deg) scale(1.03); }
            40% { transform: rotate(6deg) scale(1.03); }
            50% { transform: rotate(-4deg) scale(1.01); }
            60% { transform: rotate(3deg) scale(1.01); }
            70% { transform: rotate(-2deg); }
            80% { transform: rotate(1deg); }
            90% { transform: rotate(0deg); }
          }
          .animate-shake { animation: shake 1.2s ease-in-out; }
        `}</style>

        {currentAnswer ? (
          <div ref={resultRef} className={`rounded-2xl border-2 p-6 text-center ${typeColor[currentAnswer.type]}`}
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <p className="text-lg sm:text-xl font-bold leading-relaxed">{currentAnswer.text}</p>
            <p className="text-xs mt-2 opacity-60 font-medium uppercase tracking-wider">
              {currentAnswer.type === 'affirmative' ? '✅ Yes' : currentAnswer.type === 'neutral' ? '🤔 Non-committal' : '❌ No'}
            </p>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-8 rounded-2xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <p className="text-sm text-slate-600 font-medium">{isShaking ? '🔮 Shaking the 8 Ball…' : 'Type a question and press Enter'}</p>
          </div>
        )}

        {history.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Answer History</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {history.map((h, i) => (
                <div key={i} className="flex items-start gap-3 bg-white/[0.03] rounded-xl px-4 py-3 border border-white/5">
                  <span className="text-xs text-slate-600 font-mono mt-0.5 shrink-0">{h.time}</span>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500 font-medium truncate">Q: {h.question}</p>
                    <p className={`text-sm font-bold ${h.type === 'affirmative' ? 'text-emerald-400' : h.type === 'neutral' ? 'text-amber-400' : 'text-rose-400'}`}>A: {h.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
