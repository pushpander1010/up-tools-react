import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const FLAMES = ['F', 'L', 'A', 'M', 'E', 'S']
const MEANINGS = {
  F: { label: 'Friends', desc: 'You two share a warm, platonic bond built on trust and fun.' },
  L: { label: 'Love', desc: 'There is a strong romantic spark between you two.' },
  A: { label: 'Affection', desc: 'You share deep caring and emotional closeness.' },
  M: { label: 'Marriage', desc: 'You are destined for a lifelong committed partnership.' },
  E: { label: 'Enemies', desc: 'You are too similar — expect frequent clashes and rivalry.' },
  S: { label: 'Siblings', desc: 'Your bond is like family — protective and unconditional.' },
}

function stripCommonLetters(a, b) {
  const arr1 = a.toLowerCase().split('')
  const arr2 = b.toLowerCase().split('')
  for (const ch of arr1) {
    const idx = arr2.indexOf(ch)
    if (idx !== -1) {
      arr1.splice(arr1.indexOf(ch), 1)
      arr2.splice(idx, 1)
    }
  }
  return arr1.length + arr2.length
}

function josephusElimination(count) {
  const letters = [...FLAMES]
  const steps = []
  let idx = 0
  while (letters.length > 1) {
    idx = (idx + count - 1) % letters.length
    const eliminated = letters.splice(idx, 1)[0]
    steps.push({ eliminated, remaining: [...letters] })
  }
  return { winner: letters[0], steps }
}

export default function flames_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [name1, setName1] = useState('')
  const [name2, setName2] = useState('')
  const [result, setResult] = useState(null)

  const calculate = useCallback(() => {
    const a = name1.trim().replace(/\s/g, '')
    const b = name2.trim().replace(/\s/g, '')
    if (!a || !b) return

    const count = stripCommonLetters(a, b)
    if (count === 0) {
      setResult({ sameNames: true })
      return
    }
    const { winner, steps } = josephusElimination(count)
    setResult({ sameNames: false, winner, steps, count })
    jumpTo()
  }, [name1, name2])

  const handleCalculate = () => {
    calculate()
    setTimeout(() => jumpTo(), 50)
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"

  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    if (!result || result.sameNames) return
    const text = `FLAMES Result: ${name1.trim()} & ${name2.trim()} → ${MEANINGS[result.winner].label}!`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <ToolLayout
      title="FLAMES Calculator"
      desc="Classic FLAMES relationship game — enter two names to discover if you're Friends, Lovers, Affectionate, Married, Enemies, or like Siblings."
      icon="🔥" iconBg="rgba(239,68,68,0.08)"
      category="fun" slug="flames-calculator"
      faq={[
        { q: "What is the FLAMES game?", a: "FLAMES is a popular childhood game where two names are entered, common letters removed, and the remaining count used to eliminate letters from FLAMES until one remains — revealing the relationship type." },
        { q: "How does the elimination work?", a: "Starting from F, you count forward by the remainder and eliminate that letter. The process repeats until only one letter is left, which becomes your result." },
        { q: "What if both names are the same?", a: "If stripping common letters gives zero, the names are identical — the tool shows a special 'same names' message." },
        { q: "How do I use this FLAMES Calculator online free?", a: "Enter two names above and click Calculate. Free, no sign-up, works on mobile and desktop." },
      ]}
      howItWorks={[
        "Enter two names in the fields above.",
        "Click Calculate — common letters between both names are stripped automatically.",
        "The remaining letter count triggers Josephus elimination over the FLAMES letters.",
        "Watch the step-by-step elimination display as letters are removed one by one.",
        "Your final FLAMES result appears with a meaning description and a copy button.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "FLAMES Calculator", "applicationCategory": "GameApplication",
        "operatingSystem": "WebBrowser",
        "url": "https://www.uptools.in/flames-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">First Name</label>
            <input type="text" value={name1} onChange={(e) => setName1(e.target.value)}
              placeholder="Enter first name" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Second Name</label>
            <input type="text" value={name2} onChange={(e) => setName2(e.target.value)}
              placeholder="Enter second name" className={inputClass} />
          </div>
        </div>

        <button onClick={handleCalculate}
          className="w-full py-4 rounded-2xl bg-red-500 text-white font-bold text-sm hover:bg-red-400 transition-all duration-200 active:scale-[0.98]">
          Calculate
        </button>

        {result ? (
          result.sameNames ? (
            <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 text-center"
              style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-white mb-2">Same Names!</h3>
              <p className="text-slate-400">Both names are identical — of course you're perfectly matched!</p>
            </div>
          ) : (
            <div ref={resultRef} className="rounded-3xl border-2 border-red-500/15 bg-gradient-to-br from-red-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
              style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider">Elimination Steps (count = {result.count})</h3>
              </div>
              <div className="space-y-2 mb-6">
                {result.steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="text-slate-500 font-mono w-16 shrink-0">Step {i + 1}</span>
                    <span className="text-rose-400 font-bold">✕ {step.eliminated}</span>
                    <span className="text-slate-500">→</span>
                    <span className="text-slate-300">{step.remaining.join(' ')}</span>
                  </div>
                ))}
              </div>

              <div className="text-center p-6 rounded-2xl bg-white/[0.04] border border-white/5">
                <div className="text-6xl mb-3">
                  {result.winner === 'F' ? '🫂' : result.winner === 'L' ? '❤️' : result.winner === 'A' ? '💕' : result.winner === 'M' ? '💒' : result.winner === 'E' ? '⚡' : '👨‍👩‍👧‍👦'}
                </div>
                <div className="text-4xl font-black text-white mb-1 tracking-wider">{result.winner}</div>
                <div className="text-xl font-bold text-indigo-400 mb-2">{MEANINGS[result.winner].label}</div>
                <p className="text-slate-400 text-sm max-w-xs mx-auto">{MEANINGS[result.winner].desc}</p>
              </div>

              <button onClick={handleCopy}
                className="mt-4 w-full py-3 rounded-xl bg-white/[0.06] border border-white/8 text-sm font-semibold text-slate-300 hover:bg-white/[0.1] transition-all">
                {copied ? '✓ Copied!' : '📋 Copy Result'}
              </button>
            </div>
          )
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🔥</div>
            <p className="text-sm text-slate-600 font-medium">Enter two names and click Calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
