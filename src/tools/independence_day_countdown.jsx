import { useState, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const INDEP_1947 = new Date(1947, 7, 15, 0, 0, 0)

// Indian national / gazetted holidays (month-1 = Jan). year is the reference.
const DAYS = [
  { key: 'independence', name: 'Independence Day', emoji: '🇮🇳', month: 8, date: 15, color: '#FF9933', blurb: 'Gained independence from British rule on 15 Aug 1947.' },
  { key: 'republic', name: 'Republic Day', emoji: '🇮🇳', month: 1, date: 26, color: '#138808', blurb: 'The Constitution of India came into force on 26 Jan 1950.' },
  { key: 'gandhi', name: 'Gandhi Jayanti', emoji: '🕊️', month: 10, date: 2, color: '#FFFFFF', blurb: 'Birth anniversary of Mahatma Gandhi (2 Oct 1869).' },
  { key: 'diwali', name: 'Diwali', emoji: '🪔', month: 11, date: 1, color: '#FFB300', blurb: 'Festival of lights — approximate date for the current year.' },
  { key: 'holi', name: 'Holi', emoji: '🎨', month: 3, date: 1, color: '#E91E63', blurb: 'Festival of colours — approximate date for the current year.' },
  { key: 'martyrs', name: 'Martyrs\' Day', emoji: '🕯️', month: 1, date: 30, color: '#9E9E9E', blurb: 'Remembering Mahatma Gandhi\'s sacrifice (30 Jan 1948).' },
  { key: 'kargil', name: 'Kargil Vijay Diwas', emoji: '🎖️', month: 7, date: 26, color: '#FF6D00', blurb: 'Victory in the Kargil War (1999).' },
]

function pad(n) { return String(n).padStart(2, '0') }

function ageOfIndia(date) {
  let years = date.getFullYear() - 1947
  let months = date.getMonth() - 7
  let days = date.getDate() - 15
  if (days < 0) { months -= 1; const prev = new Date(date.getFullYear(), date.getMonth(), 0).getDate(); days += prev }
  if (months < 0) { years -= 1; months += 12 }
  return { years, months, days }
}

// Countdown to next occurrence of a (month, date)
function nextOccurrence(date, month, day) {
  let target = new Date(date.getFullYear(), month - 1, day, 0, 0, 0)
  if (date >= target) target = new Date(date.getFullYear() + 1, month - 1, day, 0, 0, 0)
  const diff = Math.max(0, target - date)
  return {
    totalDays: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins: Math.floor((diff % 3600000) / 60000),
    secs: Math.floor((diff % 60000) / 1000),
    year: target.getFullYear(),
    weekday: target.toLocaleDateString('en-IN', { weekday: 'long' }),
    target,
  }
}

export default function independence_day_countdown() {
  const { ref: resultRef } = useJumpToResult()
  const [now, setNow] = useState(new Date())
  const [customDate, setCustomDate] = useState('')
  const [dayKey, setDayKey] = useState('independence')

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const isLive = !customDate
  const effective = isLive ? now : (() => { try { const d = new Date(customDate + 'T00:00:00'); return isNaN(d) ? now : d } catch { return now } })()
  const day = DAYS.find(d => d.key === dayKey) || DAYS[0]
  const age = ageOfIndia(effective)
  const next = nextOccurrence(effective, day.month, day.date)
  const isToday = effective.getMonth() === day.month - 1 && effective.getDate() === day.date

  return (
    <ToolLayout
      title="Indian National Days Countdown"
      desc="Live countdown to every major Indian national day — Independence Day, Republic Day, Gandhi Jayanti and more — plus how old independent India is today."
      icon="🇮🇳" iconBg="rgba(19,136,8,0.10)"
      category="text" slug="independence-day-countdown"
      faq={[
        { q: 'When did India become independent?', a: 'India became independent from British rule on 15 August 1947.' },
        { q: 'What national days can I count down to?', a: 'Independence Day, Republic Day, Gandhi Jayanti, Diwali, Holi, Martyrs\' Day and Kargil Vijay Diwas.' },
        { q: 'How many years of independence is it this year?', a: 'Counted from 15 August 1947. The tool shows exact years, months and days as of today or any date you pick.' },
        { q: 'Is Independence Day a bank holiday in India?', a: 'Yes — 15 August is a gazetted national holiday across India, so banks and most offices are closed.' },
        { q: 'Can I check a specific date?', a: 'Yes — pick any date to see the countdown and India\'s age as of that date.' },
      ]}
      howItWorks={[
        'Pick a national day from the list.',
        'See the live countdown and that day\'s history.',
        'Switch to "Live Now" for today, or pick a custom date.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Indian National Days Countdown", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/independence-day-countdown/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Day selector */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-3">
          <label className="block text-sm font-semibold text-slate-300">National Day</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {DAYS.map(d => (
              <button key={d.key} onClick={() => setDayKey(d.key)}
                className={`px-3 py-2.5 rounded-xl text-sm font-bold transition-all border flex items-center gap-2 ${dayKey === d.key ? 'bg-indigo-600/20 text-white border-indigo-500/40' : 'bg-white/[0.06] text-slate-300 hover:bg-white/[0.12] border-white/[0.08]'}`}>
                <span className="text-base">{d.emoji}</span>
                <span className="truncate">{d.name}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500">{day.blurb}</p>
        </div>

        {/* Countdown */}
        <div ref={resultRef} className="rounded-3xl border-2 p-5 sm:p-7" style={{ borderColor: day.color + '40', background: `linear-gradient(135deg, ${day.color}14, transparent)` }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: day.color }} />
            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: day.color }}>{day.emoji} Countdown to {day.name} {next.year}</h3>
          </div>
          {isToday ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-3">🎉</div>
              <p className="text-2xl font-extrabold text-white">It's {day.name} today!</p>
              <p className="text-sm text-slate-400 mt-2">{day.blurb} Jai Hind! 🇮🇳</p>
            </div>
          ) : (
            <>
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
              <p className="text-xs text-slate-400 mt-3 text-center">{next.weekday}, {next.target.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </>
          )}
        </div>

        {/* Age of India (only meaningful for Independence context) */}
        <div className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-7">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Age of Independent India</h3>
          </div>
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
          <p className="text-xs text-slate-500 mt-4 text-center">Since 15 August 1947</p>
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
              <span className="font-bold text-white">{isLive ? '🔴 Today' : effective.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span> — India is {age.years} years, {age.months} months, {age.days} days old.
            </p>
            <p className="text-sm text-slate-400">
              {isToday
                ? `${day.emoji} This is ${day.name} — a gazetted national holiday in India.`
                : `⏳ ${next.totalDays} days until ${day.name} (${next.weekday}, ${next.target.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}).`}
            </p>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
