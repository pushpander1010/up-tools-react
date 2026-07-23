import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const WEEKDAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

function formatDate(d) {
  if (!d || isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function formatDateShort(d) {
  if (!d || isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function toISODate(d) {
  if (!d || isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}

function countBusinessDays(start, end) {
  if (!start || !end) return 0
  let count = 0
  const s = new Date(Math.min(start.getTime(), end.getTime()))
  const e = new Date(Math.max(start.getTime(), end.getTime()))
  s.setHours(0, 0, 0, 0)
  e.setHours(0, 0, 0, 0)
  const current = new Date(s)
  while (current <= e) {
    const dow = current.getDay()
    if (dow !== 0 && dow !== 6) count++
    current.setDate(current.getDate() + 1)
  }
  return count
}

function AnimatedNumber({ value, suffix = '' }) {
  const [display, setDisplay] = useState(value)
  const frameRef = useRef(null)

  useEffect(() => {
    if (value === undefined || value === null) return
    const start = display
    const diff = value - start
    const duration = 300
    const startTime = performance.now()
    function tick(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(start + diff * eased)
      if (progress < 1) frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [value])

  return <span>{Math.round(display)}{suffix}</span>
}

export default function date_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [mode, setMode] = useState('add') // 'add' | 'diff'
  const [startDate, setStartDate] = useState(toISODate(new Date()))
  const [addDays, setAddDays] = useState('')
  const [addDirection, setAddDirection] = useState('add') // 'add' | 'subtract'
  const [endDate, setEndDate] = useState('')
  const [copied, setCopied] = useState(false)
  const [showBusinessDays, setShowBusinessDays] = useState(false)

  const startD = useMemo(() => startDate ? new Date(startDate + 'T00:00:00') : null, [startDate])
  const endD = useMemo(() => endDate ? new Date(endDate + 'T00:00:00') : null, [endDate])

  // Add/Subtract result
  const addResult = useMemo(() => {
    if (!startD || !addDays) return null
    const days = parseInt(addDays, 10)
    if (isNaN(days)) return null
    const target = new Date(startD)
    target.setDate(target.getDate() + (addDirection === 'add' ? days : -days))
    const totalDays = Math.abs(days)
    const weeks = Math.floor(totalDays / 7)
    const remainDays = totalDays % 7
    const months = Math.floor(totalDays / 30.44)
    const years = Math.floor(totalDays / 365.25)
    return { target, totalDays, weeks, remainDays, months, years }
  }, [startD, addDays, addDirection])

  // Difference result
  const diffResult = useMemo(() => {
    if (!startD || !endD) return null
    const diffMs = endD.getTime() - startD.getTime()
    const totalDays = Math.round(Math.abs(diffMs) / (1000 * 60 * 60 * 24))
    const sign = diffMs >= 0 ? 1 : -1
    const weeks = Math.floor(totalDays / 7)
    const remainDays = totalDays % 7
    const months = Math.floor(totalDays / 30.44)
    const years = Math.floor(totalDays / 365.25)
    const bizDays = countBusinessDays(startD, endD)
    return { totalDays, weeks, remainDays, months, years, sign, bizDays, future: diffMs > 0 }
  }, [startD, endD])


  // Fun facts about a date
  const dateFacts = useMemo(() => {
    if (!startD) return null
    const month = startD.getMonth()
    const day = startD.getDate()
    const facts = [
      `This day has ${countBusinessDays(startD, new Date(startD.getFullYear(), 11, 31))} business days remaining in the year.`,
      `You were born on a ${WEEKDAYS[startD.getDay()]}.`,
      `Your birthstone is ${['Garnet', 'Amethyst', 'Aquamarine', 'Diamond', 'Emerald', 'Pearl', 'Ruby', 'Peridot', 'Sapphire', 'Opal', 'Topaz', 'Tanzanite'][month]}.`,
      `Your zodiac sign is ${['Capricorn','Aquarius','Pisces','Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius'][(day < 20 ? month - 1 + 12 : month) % 12]}.`,
    ]
    return facts
  }, [startD])


  const result = mode === 'add' ? addResult : diffResult
  const hasResult = (mode === 'add' && addResult) || (mode === 'diff' && diffResult)

  const handleCopy = useCallback(() => {
    let text = ''
    if (mode === 'add' && addResult) {
      text = [
        `Date Calculator — Add/Subtract`,
        `Start Date: ${formatDate(startD)}`,
        `${addDirection === 'add' ? 'Add' : 'Subtract'}: ${addDays} days`,
        `Result: ${formatDate(addResult.target)}`,
        `Breakdown: ${addResult.totalDays} days = ${addResult.weeks} weeks + ${addResult.remainDays} days`,
      ].join('\n')
    } else if (mode === 'diff' && diffResult) {
      text = [
        `Date Calculator — Difference`,
        `Start: ${formatDate(startD)}`,
        `End: ${formatDate(endD)}`,
        `Difference: ${diffResult.totalDays} days`,
        `Breakdown: ${diffResult.weeks} weeks + ${diffResult.remainDays} days ≈ ${diffResult.months} months ≈ ${diffResult.years} years`,
        `Business Days: ${diffResult.bizDays}`,
      ].join('\n')
    }
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [mode, addResult, diffResult, startD, addDays, addDirection, endD])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-amber-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Date Calculator"
      desc="Add or subtract days from any date, or find the exact difference between two dates. Includes business days, weeks, months breakdown."
      icon="📅" iconBg="rgba(245,158,11,0.08)"
      category="tools" slug="date-calculator"
      faq={[
        { q: 'How do I add days to a date?', a: 'Select "Add/Subtract" mode, pick a start date, enter the number of days, and choose Add. The result date appears instantly.' },
        { q: 'How to calculate date difference?', a: 'Switch to "Difference" mode, set two dates, and see the gap in days, weeks, months, and years.' },
        { q: 'What are business days vs calendar days?', a: 'Business days exclude Saturdays and Sundays. Toggle the "Business Days" option to see the count of working days between two dates.' },
      ]}
      howItWorks={[
        'Choose a mode: Add/Subtract days or Find Difference between dates.',
        'Pick a start date using the date picker.',
        'Enter the number of days (for Add mode) or an end date (for Difference mode).',
        'Toggle business days to exclude weekends.',
        'See animated results with a full breakdown of weeks, months, and years.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Date Calculator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/date-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* ─── Mode Toggle ─── */}
        <div className="grid grid-cols-2 gap-2">
          {[
            ['add', 'Add / Subtract', '📅'],
            ['diff', 'Find Difference', '↔️'],
          ].map(([m, label, icon]) => (
            <button key={m} onClick={() => setMode(m)}
              className={`relative py-4 rounded-2xl text-sm font-bold transition-all duration-300 overflow-hidden border-2
                ${mode === m
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-400 shadow-lg shadow-amber-500/10'
                  : 'bg-white/[0.04] border-white/6 text-slate-500 hover:border-white/12 hover:text-slate-300'
                }`}>
              {mode === m && <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent" />}
              <span className="relative text-lg">{icon}</span>
              <span className="relative block mt-1 text-xs">{label}</span>
            </button>
          ))}
        </div>

        {/* ─── Start Date ─── */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Start Date</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
            className={inputClass} />
          {startD && (
            <p className="text-xs text-slate-600 mt-1.5 ml-1">{formatDate(startD)}</p>
          )}
        </div>

        {/* ─── Mode A: Add / Subtract ─── */}
        {mode === 'add' && (
          <div style={{ animation: 'slideUp 0.3s cubic-bezier(0.4,0,0.2,1)' }}>
            {/* Direction Toggle */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                ['add', '+ Add', 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'],
                ['subtract', '− Subtract', 'bg-red-500/10 border-red-500/20 text-red-400'],
              ].map(([d, label, activeStyle]) => (
                <button key={d} onClick={() => setAddDirection(d)}
                  className={`py-3 rounded-xl text-sm font-bold border-2 transition-all duration-200
                    ${addDirection === d ? activeStyle : 'bg-white/[0.04] border-white/6 text-slate-500 hover:border-white/12'}`}>
                  {label}
                </button>
              ))}
            </div>
            {/* Days Input */}
            <label className="block text-sm font-semibold text-slate-300 mb-2">Number of Days</label>
            <div className="relative">
              <input type="number" value={addDays} onChange={e => setAddDays(e.target.value)}
                placeholder="Enter days" min="0"
                className={inputClass} />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-600">DAYS</span>
            </div>
            {/* Quick Buttons */}
            {dateFacts && (
              <div className="mt-4 p-4 rounded-2xl bg-amber-500/[0.06] border border-amber-500/15">
                <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-2">✨ Fun Facts About Your Date</div>
                <ul className="space-y-1.5">
                  {dateFacts.map((f, i) => (
                    <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                      <span className="text-amber-500/40 mt-0.5">•</span>{f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex gap-2 mt-3 flex-wrap">
              {[1, 7, 14, 30, 60, 90, 180, 365].map(d => (
                <button key={d} onClick={() => setAddDays(String(d))}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/[0.05] border border-white/8 text-slate-400 hover:text-white hover:border-white/15 transition-all duration-150">
                  {d}d
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ─── Mode B: Difference ─── */}
        {mode === 'diff' && (
          <div style={{ animation: 'slideUp 0.3s cubic-bezier(0.4,0,0.2,1)' }}>
            <label className="block text-sm font-semibold text-slate-300 mb-2">End Date</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
              className={inputClass} />
            {endD && (
              <p className="text-xs text-slate-600 mt-1.5 ml-1">{formatDate(endD)}</p>
            )}
            {/* Business Days Toggle */}
            <button onClick={() => setShowBusinessDays(!showBusinessDays)}
              className={`mt-4 w-full p-4 rounded-2xl border-2 text-left transition-all duration-200
                ${showBusinessDays
                  ? 'bg-amber-500/8 border-amber-500/20 shadow-lg shadow-amber-500/10'
                  : 'bg-white/[0.04] border-white/6 hover:border-white/12'
                }`}>
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold transition-all duration-200
                  ${showBusinessDays ? 'bg-amber-500 text-white' : 'bg-white/10 text-transparent'}`}>
                  {showBusinessDays && '✓'}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Business Days</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Exclude Saturdays & Sundays</div>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* ─── Add Result ─── */}
        {mode === 'add' && addResult && (
          <div ref={resultRef} className="rounded-3xl border-2 border-amber-500/15 bg-gradient-to-br from-amber-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Result Date</h3>
              </div>
              <button onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/5 border border-white/8 text-slate-400 hover:text-white hover:border-white/15 hover:bg-white/10 transition-all duration-200 active:scale-95">
                {copied ? (
                  <><svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg> Copied!</>
                ) : (
                  <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg> Copy</>
                )}
              </button>
            </div>

            {/* Result Date Card */}
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-5">
              <div className="text-[11px] font-bold text-amber-500/60 uppercase tracking-wider mb-1">
                {addDirection === 'add' ? `${addDays} days from now` : `${addDays} days ago`}
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {formatDate(addResult.target)}
              </div>
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: 'Weeks', value: addResult.weeks, icon: '📆' },
                { label: 'Extra Days', value: addResult.remainDays, icon: '📅' },
                { label: 'Months ≈', value: addResult.months, icon: '🗓️' },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/[0.04] border border-white/6 text-center">
                  <div className="text-lg mb-0.5">{item.icon}</div>
                  <div className="text-lg font-extrabold text-amber-400 truncate">
                    <AnimatedNumber value={item.value} />
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{item.label}</div>
                </div>
              ))}
            </div>

            {/* Visual Timeline */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="text-xs text-slate-500 font-semibold mb-3">Timeline</div>
              <div className="flex items-center gap-3">
                <div className="flex-1 text-center">
                  <div className="text-xs text-slate-500">Start</div>
                  <div className="text-sm font-bold text-white mt-1">{formatDateShort(startD)}</div>
                </div>
                <div className="flex-1 relative h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-500/40 to-amber-400/80 transition-all duration-500"
                    style={{ width: `${Math.min((addResult.totalDays / 365) * 100, 100)}%` }} />
                </div>
                <div className="flex-1 text-center">
                  <div className="text-xs text-slate-500">End</div>
                  <div className="text-sm font-bold text-amber-400 mt-1">{formatDateShort(addResult.target)}</div>
                </div>
              </div>
              <div className="text-center text-xs font-bold text-amber-400/70 mt-2">
                <AnimatedNumber value={addResult.totalDays} suffix=" total days" />
              </div>
            </div>
          </div>
        )}

        {/* ─── Diff Result ─── */}
        {mode === 'diff' && diffResult && (
          <div ref={resultRef} className="rounded-3xl border-2 border-amber-500/15 bg-gradient-to-br from-amber-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Date Difference</h3>
              </div>
              <button onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/5 border border-white/8 text-slate-400 hover:text-white hover:border-white/15 hover:bg-white/10 transition-all duration-200 active:scale-95">
                {copied ? (
                  <><svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg> Copied!</>
                ) : (
                  <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg> Copy</>
                )}
              </button>
            </div>

            {/* Total Days */}
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-5">
              <div className="text-center">
                <div className="text-xs font-bold text-amber-500/60 uppercase tracking-wider mb-1">
                  {diffResult.future ? 'Days Until' : 'Days Since'}
                </div>
                <div className="text-4xl sm:text-5xl font-extrabold text-amber-400 tracking-tight">
                  <AnimatedNumber value={diffResult.totalDays} />
                </div>
                <div className="text-xs text-slate-500 mt-1">calendar days</div>
              </div>
            </div>

            {/* Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {[
                { label: 'Years', value: diffResult.years, icon: '📅' },
                { label: 'Months', value: diffResult.months, icon: '📆' },
                { label: 'Weeks', value: diffResult.weeks, icon: '🗓️' },
                { label: 'Remaining', value: diffResult.remainDays, icon: '📌' },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/[0.04] border border-white/6 text-center">
                  <div className="text-sm mb-0.5">{item.icon}</div>
                  <div className="text-xl font-extrabold text-amber-400 truncate">
                    <AnimatedNumber value={item.value} />
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{item.label}</div>
                </div>
              ))}
            </div>

            {/* Business Days */}
            {showBusinessDays && (
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 font-semibold">Business Days</div>
                  <div className="text-[11px] text-slate-600">Excluding weekends</div>
                </div>
                <div className="text-xl font-extrabold text-amber-400 truncate">
                  <AnimatedNumber value={diffResult.bizDays} />
                </div>
              </div>
            )}

            {/* Visual Timeline */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 mt-4">
              <div className="text-xs text-slate-500 font-semibold mb-3">Timeline</div>
              <div className="flex items-center gap-3">
                <div className="flex-1 text-center">
                  <div className="text-xs text-slate-500">Start</div>
                  <div className="text-sm font-bold text-white mt-1">{formatDateShort(startD)}</div>
                </div>
                <div className="flex-1 relative h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-500/40 to-amber-400/80" style={{ width: '100%' }} />
                </div>
                <div className="flex-1 text-center">
                  <div className="text-xs text-slate-500">End</div>
                  <div className="text-sm font-bold text-amber-400 mt-1">{formatDateShort(endD)}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── Birthday Countdown ─── */}
        {daysToBirthday !== null && mode === 'add' && (
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎂</span>
              <div>
                <div className="text-xs text-slate-500 font-semibold">Days to next birthday</div>
                <div className="text-lg font-extrabold text-amber-400 truncate">{daysToBirthday === 0 ? 'Today! 🎉' : daysToBirthday}</div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!hasResult && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📅</div>
            <p className="text-sm text-slate-600 font-medium">Select a mode and enter dates to calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
