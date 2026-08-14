import { useState, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const INDEP_1947 = new Date(1947, 7, 15, 0, 0, 0) // 15 Aug 1947, local midnight

function pad(n) { return String(n).padStart(2, '0') }

// Compute age of independent India as of a given date
function ageOfIndia(date) {
  let years = date.getFullYear() - 1947
  let months = date.getMonth() - 7
  let days = date.getDate() - 15
  if (days < 0) { months -= 1; const prev = new Date(date.getFullYear(), date.getMonth(), 0).getDate(); days += prev }
  if (months < 0) { years -= 1; months += 12 }
  return { years, months, days }
}

// Countdown to next 15 August
function nextIndependence(date) {
  let target = new Date(date.getFullYear(), 7, 15, 0, 0, 0)
  if (date >= target) target = new Date(date.getFullYear() + 1, 7, 15, 0, 0, 0)
  const diff = Math.max(0, target - date)
  const totalDays = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const mins = Math.floor((diff % 3600000) / 60000)
  const secs = Math.floor((diff % 60000) / 1000)
  const year = target.getFullYear()
  return { totalDays, hours, mins, secs, year, target }
}

export default function independence_day_countdown() {
  const { ref: resultRef } = useJumpToResult()
  const [now, setNow] = useState(new Date())
  const [customDate, setCustomDate] = useState('')
  const dateRef = useRef(new Date())

  // live ticking clock for the "right now" mode
  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const isLive = !customDate
  const effective = isLive ? now : (() => { try { const d = new Date(customDate + 'T00:00:00'); return isNaN(d) ? now : d } catch { return now } })()

  const age = ageOfIndia(effective)
  const next = nextIndependence(effective)
  const isToday = effective.getMonth() === 7 && effective.getDate() === 15

  return (
    <ToolLayout
      title="Independence Day Countdown & Age of India"
      desc="See how old independent India is today, the live countdown to the next 15 August, and check if it is a national holiday."
      icon="🇮🇳" iconBg="rgba(19,136,8,0.10)"
      category="text" slug="independence-day-countdown"
      faq={[
        { q: 'When did India become independent?', a: 'India became independent from British rule on 15 August 1947.' },
        { q: 'How many years of independence is it this year?', a: 'Counted from 15 August 1947. The tool shows exact years, months and days as of today or any date you pick.' },
        { q: 'Is Independence Day a bank holiday in India?', a: 'Yes — 15 August is a gazetted national holiday across India, so banks and most offices are closed.' },
        { q: 'Can I check a specific date?', a: 'Yes — pick any date to see India\'s age and the countdown as of that date.' },
      ]}
      howItWorks={[
        'The live clock shows India\'s exact age and the countdown to the next 15 August.',
        'Optionally pick a custom date to see those numbers as of that day.',
        'The tool also flags whether that date is Independence Day itself.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Independence Day Countdown", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/independence-day-countdown/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Age of India */}
        <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-7">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Age of Independent India</h3>
          </div>
          {isToday ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-3">🎉</div>
              <p className="text-2xl font-extrabold text-white">It's Independence Day!</p>
              <p className="text-sm text-slate-400 mt-2">India is celebrating its {age.years + 1}th year of independence today. Jai Hind! 🇮🇳</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                ['Years', age.years, 'text-indigo-400'],
                ['Months', age.months, 'text-emerald-400'],
                ['Days', age.days, 'text-amber-400'],
              ].map(([label, val, color]) => (
                <div key={label} className="p-4 rounded-xl bg-black/20 border border-white/[0.05]">
                  <div className={`text-3xl sm:text-4xl font-black ${color}`}>{val.toLocaleString()}</div>
                  <div className="text-[11px] text-slate-400 uppercase font-bold mt-1">{label}</div>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-slate-500 mt-4 text-center">Since 15 August 1947 • {isToday ? age.years + 1 : age.years} years of freedom</p>
        </div>

        {/* Countdown */}
        <div className="rounded-3xl border-2 border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-7">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Countdown to 15 August {next.year}</h3>
          </div>
          <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center mt-4">
            {[
              ['Days', next.totalDays, 'text-emerald-400'],
              ['Hours', next.hours, 'text-cyan-400'],
              ['Mins', next.mins, 'text-amber-400'],
              ['Secs', next.secs, 'text-rose-400'],
            ].map(([label, val, color]) => (
              <div key={label} className="p-3 sm:p-4 rounded-xl bg-black/20 border border-white/[0.05]">
                <div className={`text-xl sm:text-2xl font-black tabular-nums ${color}`}>{pad(val)}</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom date + holiday note */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider">Check Any Date</h3>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => setCustomDate('')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${isLive ? 'bg-indigo-600 text-white' : 'bg-white/[0.06] text-slate-300 hover:bg-white/[0.12] border border-white/[0.08]'}`}>
              🔴 Live Now
            </button>
            <input type="date" value={customDate} onChange={e => setCustomDate(e.target.value)}
              className="bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-2 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]" />
          </div>

          <div className="rounded-xl bg-black/20 border border-white/[0.06] p-4 space-y-1.5">
            <p className="text-sm text-slate-300">
              <span className="font-bold text-white">{isToday ? '🎉 Today' : effective.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span> — {age.years} years, {age.months} months, {age.days} days since independence.
            </p>
            <p className="text-sm text-slate-400">
              {isToday
                ? '🇮🇳 This is Independence Day — a gazetted national holiday in India.'
                : `⏳ ${next.totalDays} days until the next Independence Day (15 August ${next.year}).`}
            </p>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
