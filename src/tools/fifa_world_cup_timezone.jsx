import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const MATCHES = [
  { date:"2026-06-11", stage:"Group Stage", home:"Mexico", away:"South Africa", venue:"Estadio Azteca", et:"15:00" },
  { date:"2026-06-12", stage:"Group Stage", home:"USA", away:"Canada", venue:"SoFi Stadium", et:"16:00" },
  { date:"2026-06-13", stage:"Group Stage", home:"Argentina", away:"Chile", venue:"Mercedes-Benz Stadium", et:"14:00" },
  { date:"2026-06-14", stage:"Group Stage", home:"Brazil", away:"Colombia", venue:"AT&T Stadium", et:"17:00" },
  { date:"2026-06-15", stage:"Group Stage", home:"England", away:"Wales", venue:"Levi's Stadium", et:"13:00" },
  { date:"2026-06-16", stage:"Group Stage", home:"Germany", away:"Netherlands", venue:"MetLife Stadium", et:"20:00" },
  { date:"2026-06-18", stage:"Group Stage", home:"France", away:"Portugal", venue:"Gillette Stadium", et:"16:00" },
  { date:"2026-06-20", stage:"Group Stage", home:"Spain", away:"Italy", venue:"NRG Stadium", et:"19:00" },
  { date:"2026-06-22", stage:"Group Stage", home:"Japan", away:"South Korea", venue:"BC Place", et:"14:00" },
  { date:"2026-06-25", stage:"Group Stage", home:"India", away:"Morocco", venue:"Rose Bowl", et:"18:00" },
  { date:"2026-06-28", stage:"Round of 32", home:"Winner A", away:"Runner-up B", venue:"SoFi Stadium", et:"16:00" },
  { date:"2026-07-01", stage:"Round of 32", home:"Winner C", away:"Runner-up D", venue:"MetLife Stadium", et:"19:00" },
  { date:"2026-07-05", stage:"Round of 16", home:"R16", away:"R16", venue:"MetLife Stadium", et:"15:00" },
  { date:"2026-07-09", stage:"Quarter-Final", home:"QF", away:"QF", venue:"SoFi Stadium", et:"16:00" },
  { date:"2026-07-14", stage:"Semi-Final", home:"SF", away:"SF", venue:"AT&T Stadium", et:"18:00" },
  { date:"2026-07-19", stage:"Final", home:"Spain", away:"Argentina", venue:"MetLife Stadium", et:"19:00", note:"Spain won 1–0" },
]

const COMPARE_TZS = [
  { label:"ET (NY)", tz:"America/New_York" },
  { label:"PT (LA)", tz:"America/Los_Angeles" },
  { label:"BST (UK)", tz:"Europe/London" },
  { label:"IST (IN)", tz:"Asia/Kolkata" },
  { label:"GST (Dubai)", tz:"Asia/Dubai" },
  { label:"AEST (Syd)", tz:"Australia/Sydney" },
]

const BASE_TZS = [
  { v: "America/New_York", l: "🇺🇸 USA Eastern (ET, UTC-4)" },
  { v: "America/Chicago", l: "🇺🇸 USA Central (CT, UTC-5)" },
  { v: "America/Denver", l: "🇺🇸 USA Mountain (MT, UTC-6)" },
  { v: "America/Los_Angeles", l: "🇺🇸 USA Pacific (PT, UTC-7)" },
  { v: "America/Toronto", l: "🇨🇦 Canada Eastern (ET, UTC-4)" },
  { v: "America/Vancouver", l: "🇨🇦 Canada Pacific (PT, UTC-7)" },
  { v: "America/Mexico_City", l: "🇲🇽 Mexico City (CST, UTC-6)" },
]

const QUICK_TZS = [
  { tz: "Asia/Kolkata", l: "🇮🇳 India (IST +5:30)" },
  { tz: "America/New_York", l: "🇺🇸 USA East (ET -4)" },
  { tz: "America/Los_Angeles", l: "🇺🇸 USA West (PT -7)" },
  { tz: "Europe/London", l: "🇬🇧 UK (BST +1)" },
  { tz: "Asia/Dubai", l: "🇦🇪 Gulf (GST +4)" },
  { tz: "Asia/Tokyo", l: "🇯🇵 Japan (JST +9)" },
  { tz: "Australia/Sydney", l: "🇦🇺 Australia (AEST +10)" },
]

const TARGET_TZS = [
  "America/New_York","America/Chicago","America/Denver","America/Los_Angeles",
  "America/Toronto","America/Vancouver","America/Mexico_City",
  "Europe/London","Europe/Paris","Europe/Berlin","Europe/Madrid","Europe/Rome",
  "Asia/Kolkata","Asia/Dubai","Asia/Tokyo","Asia/Shanghai","Asia/Singapore",
  "Australia/Sydney","Australia/Melbourne","Pacific/Auckland",
  "Africa/Cairo","Africa/Lagos","Africa/Johannesburg",
  "America/Sao_Paulo","America/Argentina/Buenos_Aires",
]

function formatTime(dateStr, timeStr, tz) {
  const [h, m] = timeStr.split(':').map(Number)
  const d = new Date(dateStr + 'T' + String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0') + ':00')
  return new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }).format(d)
}

function formatTimeShort(dateStr, timeStr, tz) {
  const [h, m] = timeStr.split(':').map(Number)
  const d = new Date(dateStr + 'T' + String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0') + ':00')
  return new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit', hour12: true }).format(d)
}

function formatDateShort(dateStr, tz) {
  const d = new Date(dateStr + 'T12:00:00')
  return new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short', month: 'short', day: 'numeric' }).format(d)
}

export default function fifa_world_cup_timezone() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const userTz = useMemo(() => {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone } catch { return 'America/New_York' }
  }, [])
  const [baseTz, setBaseTz] = useState('America/New_York')
  const [targetTz, setTargetTz] = useState(userTz)
  const [activeQuick, setActiveQuick] = useState(userTz)

  const allTargetTzs = useMemo(() => {
    const set = new Set(TARGET_TZS)
    if (!set.has(userTz)) TARGET_TZS.push(userTz)
    const sorted = [...TARGET_TZS].sort((a, b) => {
      if (a === userTz) return -1
      if (b === userTz) return 1
      return a.localeCompare(b)
    })
    return sorted
  }, [userTz])

  const handleQuickTz = useCallback((tz) => {
    setTargetTz(tz)
    setActiveQuick(tz)
    jumpTo()
  }, [jumpTo])

  return (
    <ToolLayout
      title="FIFA World Cup 2026 Time Zone Converter"
      desc="Convert every World Cup 2026 match kickoff time to your local timezone. Never miss a game — see match times in IST, EST, PST, GMT and more."
      icon="🕐" iconBg="rgba(99,102,241,0.08)"
      category="fifa" slug="fifa-world-cup-timezone"
      faq={[
        { q: "What timezone are matches scheduled in?", a: "Most matches use the local time of the host venue across USA, Canada, and Mexico. Eastern Time (ET) is the most common reference." },
        { q: "How do I convert to IST?", a: "Select 'India (IST +5:30)' in the quick buttons, or choose Asia/Kolkata from the dropdown." },
        { q: "Does it handle Daylight Saving Time?", a: "Yes. The tool uses JavaScript's Intl.DateTimeFormat with the IANA timezone database, which accounts for DST transitions automatically." },
        { q: "When is the 2026 World Cup final?", a: "The final is on Sunday, July 19, 2026 at MetLife Stadium, New Jersey. Kickoff is expected around 4:00 PM ET." },
        { q: "How many matches are in the 2026 World Cup?", a: "The 2026 tournament features 48 teams and 104 matches — the largest World Cup ever." },
      ]}
      howItWorks={[
        "Pick base timezone — defaults to USA Eastern since most 2026 matches are in North America.",
        "Choose your timezone — auto-detected from your browser, or pick from quick buttons.",
        "See converted times — all match kickoffs instantly update to your local timezone.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "WebApplication",
        name: "FIFA World Cup 2026 Time Zone Converter",
        url: "https://www.uptools.in/fifa-world-cup-timezone/",
      }}
    >
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Timezone Selectors */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 space-y-3">
          <h2 className="text-sm font-bold text-white">⚽ Time Zone Converter</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Match Timezone (base)</label>
              <select value={baseTz} onChange={e => setBaseTz(e.target.value)}
                className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]">
                {BASE_TZS.map(tz => <option key={tz.v} value={tz.v} className="bg-gray-900">{tz.l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Your Timezone (target)</label>
              <select value={targetTz} onChange={e => { setTargetTz(e.target.value); setActiveQuick('') }}
                className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]">
                {allTargetTzs.map(tz => <option key={tz} value={tz} className="bg-gray-900">{tz}</option>)}
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {QUICK_TZS.map(qt => (
              <button key={qt.tz} onClick={() => handleQuickTz(qt.tz)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${activeQuick === qt.tz ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30' : 'bg-white/[0.06] text-slate-500 border border-white/[0.08]'}`}>
                {qt.l}
              </button>
            ))}
          </div>
        </div>

        {/* Match Schedule */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4" ref={resultRef}>
          <h2 className="text-sm font-bold text-white mb-3">📅 Match Schedule</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="text-slate-500 border-b border-white/[0.08]">
                  <th className="text-left py-2 px-2">Date</th>
                  <th className="text-left py-2 px-2">Stage</th>
                  <th className="text-left py-2 px-2">Match</th>
                  <th className="text-left py-2 px-2 hidden sm:table-cell">Venue</th>
                  <th className="text-left py-2 px-2">ET</th>
                  <th className="text-left py-2 px-2 font-bold text-indigo-400">Your Time</th>
                </tr>
              </thead>
              <tbody>
                {MATCHES.map((m, i) => {
                  const isFinal = m.stage === 'Final'
                  const isOpening = m.home === 'Mexico' && m.away === 'South Africa'
                  return (
                    <tr key={i} className={`border-b border-white/[0.04] ${isFinal ? 'bg-amber-500/[0.04]' : ''}`}>
                      <td className="py-2 px-2 text-slate-400">{formatDateShort(m.date, targetTz)}</td>
                      <td className="py-2 px-2">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          isFinal ? 'bg-amber-500/15 text-amber-400' : isOpening ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/[0.06] text-slate-400'
                        }`}>
                          {m.stage}{isOpening ? ' 🏟' : isFinal ? ' 🏆' : ''}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-white font-medium">{m.home} vs {m.away}</td>
                      <td className="py-2 px-2 text-slate-500 hidden sm:table-cell">{m.venue}</td>
                      <td className="py-2 px-2 text-slate-400">{formatTimeShort(m.date, m.et, baseTz)}</td>
                      <td className="py-2 px-2 text-white font-bold">{formatTime(m.date, m.et, targetTz)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Comparison Chart */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <h2 className="text-sm font-bold text-white mb-1">🌍 Popular Timezone Comparison</h2>
          <p className="text-[10px] text-slate-600 mb-3">Same match — Mexico vs South Africa (Opening, June 11) — across 6 timezones.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-[10px]">
              <thead>
                <tr className="text-slate-500 border-b border-white/[0.08]">
                  <th className="text-left py-2 px-2">Match</th>
                  {COMPARE_TZS.map(tz => <th key={tz.tz} className="text-left py-2 px-2">{tz.label}</th>)}
                </tr>
              </thead>
              <tbody>
                {MATCHES.slice(0, 4).map((m, i) => (
                  <tr key={i} className="border-b border-white/[0.04]">
                    <td className="py-2 px-2 text-white">{m.home} vs {m.away}</td>
                    {COMPARE_TZS.map(tz => (
                      <td key={tz.tz} className="py-2 px-2 text-slate-400">{formatTime(m.date, m.et, tz.tz)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
