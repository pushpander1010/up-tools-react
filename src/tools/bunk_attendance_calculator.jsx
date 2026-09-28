import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function bunk_attendance_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [held, setHeld] = useState('')
  const [attended, setAttended] = useState('')
  const [required, setRequired] = useState('75')
  const [result, setResult] = useState(null)

  const calculate = useCallback(() => {
    const h = parseInt(held) || 0
    const a = parseInt(attended) || 0
    const r = parseFloat(required) || 75
    if (h <= 0 || a < 0 || a > h) return

    const currentPct = h > 0 ? (a / h) * 100 : 0
    const isSafe = currentPct >= r

    // Classes you can still bunk
    let canBunk = 0
    if (isSafe) {
      while (a / (h + canBunk + 1) * 100 >= r) canBunk++
    }

    // Classes you must attend consecutively to recover
    let mustAttend = 0
    if (!isSafe && r > 0) {
      let tempA = a, tempH = h
      while (tempA / tempH * 100 < r) {
        tempA++
        tempH++
        mustAttend++
        if (mustAttend > 1000) break // safety
      }
    }

    // Projected after next 10 if attend all
    const projected = h + 10 > 0 ? ((a + 10) / (h + 10)) * 100 : 0

    setResult({ currentPct, isSafe, canBunk, mustAttend, projected, shortfall: r - currentPct })
    setTimeout(() => jumpTo(), 50)
  }, [held, attended, required])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Bunk Attendance Calculator"
      desc="Find out how many classes you can still bunk, how many you must attend to recover, and your projected attendance — all in one place."
      icon="🏫" iconBg="rgba(34,197,94,0.08)"
      category="education" slug="bunk-attendance-calculator"
      faq={[
        { q: "How do I calculate how many classes I can bunk?", a: "Enter total classes held, classes attended, and your required percentage. The tool calculates exactly how many more classes you can miss while staying above the required attendance." },
        { q: "What if my attendance is already below the requirement?", a: "The tool shows exactly how many consecutive classes you need to attend to bring your attendance back to the required percentage." },
        { q: "What does 'projected attendance' mean?", a: "If you attend the next 10 classes without missing any, the tool shows what your attendance percentage would be afterward." },
        { q: "How do I use this Bunk Attendance Calculator online free?", a: "Enter your numbers above and click Calculate. Free, no sign-up, works on mobile and desktop." },
      ]}
      howItWorks={[
        "Enter the total number of classes held so far.",
        "Enter the number of classes you've actually attended.",
        "Set your required attendance percentage (default 75%).",
        "Click Calculate to see if you're safe or in shortage.",
        "View bunk allowance, recovery plan, and projected attendance.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Bunk Attendance Calculator", "applicationCategory": "EducationApplication",
        "operatingSystem": "WebBrowser",
        "url": "https://www.uptools.in/bunk-attendance-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Total Classes Held</label>
            <input type="number" value={held} onChange={(e) => setHeld(e.target.value)}
              placeholder="e.g. 60" min="0" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Classes Attended</label>
            <input type="number" value={attended} onChange={(e) => setAttended(e.target.value)}
              placeholder="e.g. 42" min="0" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Required Attendance (%)</label>
            <input type="number" value={required} onChange={(e) => setRequired(e.target.value)}
              placeholder="75" min="0" max="100" step="0.1" className={inputClass} />
          </div>
        </div>

        <button onClick={calculate}
          className="w-full py-4 rounded-2xl bg-green-500 text-white font-bold text-sm hover:bg-green-400 transition-all duration-200 active:scale-[0.98]">
          Calculate
        </button>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-green-500/15 bg-gradient-to-br from-green-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider">Result</h3>
            </div>

            {/* Big current percent */}
            <div className="text-center mb-6">
              <div className={`text-6xl font-black ${result.isSafe ? 'text-green-400' : 'text-rose-400'}`}>
                {result.currentPct.toFixed(1)}%
              </div>
              <div className={`text-lg font-bold mt-2 ${result.isSafe ? 'text-green-400' : 'text-rose-400'}`}>
                {result.isSafe ? '✅ Safe' : '⚠️ Shortage'}
              </div>
              {!result.isSafe && (
                <div className="text-sm text-rose-400/70 mt-1">
                  You need {result.shortfall.toFixed(1)}% more to reach {required}%
                </div>
              )}
            </div>

            <div className="space-y-3">
              {result.isSafe ? (
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="text-slate-400 font-medium">Can still bunk</span>
                  <span className="text-2xl font-bold text-green-400">{result.canBunk} class{result.canBunk !== 1 ? 'es' : ''}</span>
                </div>
              ) : (
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="text-slate-400 font-medium">Must attend consecutively</span>
                  <span className="text-2xl font-bold text-rose-400">{result.mustAttend} class{result.mustAttend !== 1 ? 'es' : ''}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-slate-400 font-medium">Projected (next 10 attended)</span>
                <span className={`text-2xl font-bold ${result.projected >= parseFloat(required) ? 'text-green-400' : 'text-rose-400'}`}>
                  {result.projected.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🏫</div>
            <p className="text-sm text-slate-600 font-medium">Enter attendance details and click Calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
