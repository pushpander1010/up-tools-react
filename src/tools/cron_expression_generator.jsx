import { useState, useCallback, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function cron_expression_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [minute, setMinute] = useState('*')
  const [hour, setHour] = useState('*')
  const [day, setDay] = useState('*')
  const [month, setMonth] = useState('*')
  const [weekday, setWeekday] = useState('*')
  const [copied, setCopied] = useState(false)

  const expression = `${minute} ${hour} ${day} ${month} ${weekday}`

  const presets = [
    { label: 'Every Minute', expr: '* * * * *', v: ['*','*','*','*','*'] },
    { label: 'Every Hour', expr: '0 * * * *', v: ['0','*','*','*','*'] },
    { label: 'Every Day 9am', expr: '0 9 * * *', v: ['0','9','*','*','*'] },
    { label: 'Every Monday', expr: '0 9 * * 1', v: ['0','9','*','*','1'] },
    { label: '1st of Month', expr: '0 0 1 * *', v: ['0','0','1','*','*'] },
  ]

  const applyPreset = useCallback((v) => {
    setMinute(v[0]); setHour(v[1]); setDay(v[2]); setMonth(v[3]); setWeekday(v[4])
  }, [])

  const copyToClipboard = useCallback(async () => {
    try { await navigator.clipboard.writeText(expression) } catch {}
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [expression])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-white font-mono font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Cron Expression Generator"
      desc="Build cron expressions with a visual interface. Set minute, hour, day, month, and weekday with ease."
      icon="⏰" iconBg="rgba(6,182,212,0.08)"
      category="dev" slug="cron-expression-generator"
      faq={[
        { q: "What is a cron expression?", a: "A cron expression is a string of 5 fields that represents a schedule in cron syntax (used in Unix-like systems)." },
        { q: "What does * mean?", a: "An asterisk (*) means 'every' — e.g., * in the minute field means 'every minute'." },
      ]}
      howItWorks={[
        "Set values for minute, hour, day, month, and weekday fields.",
        "Use presets for common schedules.",
        "Copy the generated cron expression.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Cron Expression Generator", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/cron-expression-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white/[0.06] border-2 border-white/8 rounded-2xl p-4">
          <p className="text-sm font-semibold text-slate-300 mb-3">Presets</p>
          <div className="flex flex-wrap gap-2">
            {presets.map((p, i) => (
              <button key={i} onClick={() => applyPreset(p.v)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-black/20 border border-white/8 text-slate-400 hover:text-white hover:border-indigo-500/30 transition-all">
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {[
            { label: 'Min', value: minute, set: setMinute },
            { label: 'Hour', value: hour, set: setHour },
            { label: 'Day', value: day, set: setDay },
            { label: 'Month', value: month, set: setMonth },
            { label: 'Week', value: weekday, set: setWeekday },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-xs font-semibold text-slate-400 mb-1 text-center">{f.label}</label>
              <input type="text" value={f.value} onChange={e => f.set(e.target.value)}
                className={inputClass + " text-center text-xs"} />
            </div>
          ))}
        </div>

        <button onClick={() => jumpTo()}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
          ✅ Generate
        </button>

        <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Cron Expression</h3>
          </div>
          <div className="bg-black/20 rounded-xl p-4 font-mono text-lg text-white text-center mb-3">
            {expression}
          </div>
          <button onClick={copyToClipboard}
            className={`w-full px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${
              copied ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/5 border-white/[0.08] text-slate-400 hover:text-white'
            }`}>
            {copied ? '✅ Copied!' : '📋 Copy Expression'}
          </button>
        </div>
      </div>
    </ToolLayout>
  )
}
