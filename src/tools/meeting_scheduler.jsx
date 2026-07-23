import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const TIMEZONES = [
  { label: 'UTC', offset: 0 },
  { label: 'EST (UTC-5)', offset: -5 },
  { label: 'CST (UTC-6)', offset: -6 },
  { label: 'PST (UTC-8)', offset: -8 },
  { label: 'GMT (UTC+0)', offset: 0 },
  { label: 'IST (UTC+5:30)', offset: 5.5 },
  { label: 'SGT (UTC+8)', offset: 8 },
  { label: 'AEST (UTC+10)', offset: 10 },
  { label: 'CET (UTC+1)', offset: 1 },
  { label: 'JST (UTC+9)', offset: 9 },
]

const HOURS = Array.from({ length: 24 }, (_, i) => i)

function formatHour(h, offset) {
  const local = ((h + offset) % 24 + 24) % 24
  const ampm = local >= 12 ? 'PM' : 'AM'
  const h12 = local === 0 ? 12 : local > 12 ? local - 12 : local
  return `${h12}:00 ${ampm}`
}

export default function meeting_scheduler() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [participants, setParticipants] = useState([
    { name: 'Participant 1', tzIdx: 1 },
    { name: 'Participant 2', tzIdx: 8 },
  ])
  const [results, setResults] = useState([])

  const addParticipant = () => {
    if (participants.length < 8) {
      setParticipants([...participants, { name: `Participant ${participants.length + 1}`, tzIdx: 0 }])
    }
  }

  const removeParticipant = (idx) => {
    if (participants.length > 2) {
      setParticipants(participants.filter((_, i) => i !== idx))
    }
  }

  const updateParticipant = (idx, field, value) => {
    const updated = [...participants]
    updated[idx] = { ...updated[idx], [field]: value }
    setParticipants(updated)
  }

  const findBestTimes = useCallback(() => {
    const scores = HOURS.map(hour => {
      let score = 0
      participants.forEach(p => {
        const localHour = ((hour + TIMEZONES[p.tzIdx].offset) % 24 + 24) % 24
        // Working hours 9-17 are best, 7-21 acceptable
        if (localHour >= 9 && localHour <= 17) score += 2
        else if (localHour >= 7 && localHour <= 21) score += 1
      })
      return { hour, score }
    })

    scores.sort((a, b) => b.score - a.score)

    const top3 = scores.slice(0, 3).map(s => ({
      utcHour: s.hour,
      score: s.score,
      times: participants.map(p => ({
        name: p.name,
        tz: TIMEZONES[p.tzIdx].label,
        time: formatHour(s.hour, TIMEZONES[p.tzIdx].offset),
      }))
    }))

    setResults(top3)
  }, [participants])

  return (
    <ToolLayout
      title="Meeting Scheduler"
      desc="Find the best meeting time across multiple timezones. Schedule meetings with team members worldwide instantly."
      icon="🌍" iconBg="rgba(99,102,241,0.08)"
      category="productivity" slug="meeting-scheduler"
      faq={[
        { q: 'How does the timezone matching work?', a: 'We score each hour based on how many participants fall within working hours (9 AM - 5 PM local time). The best overlapping hours are shown first.' },
        { q: 'How many participants can I add?', a: 'Up to 8 participants with different timezones.' },
        { q: 'Does this account for daylight saving?', a: 'The tool uses fixed UTC offsets. For DST-accurate scheduling, verify with a timezone database.' },
      ]}
      howItWorks={[
        'Enter participant names and select their timezones.',
        'Add or remove participants as needed.',
        'Click Find Best Time to find overlapping working hours.',
        'The top 3 best meeting windows are shown with each participant\'s local time.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Meeting Scheduler", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/meeting-scheduler/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Participants */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-300">Participants</label>
            <button onClick={addParticipant} disabled={participants.length >= 8}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 disabled:text-slate-600 transition-colors">
              + Add Person
            </button>
          </div>

          {participants.map((p, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input type="text" value={p.name} onChange={e => updateParticipant(i, 'name', e.target.value)}
                className="flex-1 bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-white font-semibold text-sm outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark]"
                placeholder="Name" />
              <select value={p.tzIdx} onChange={e => updateParticipant(i, 'tzIdx', Number(e.target.value))}
                className="bg-white/[0.06] border-2 border-white/8 rounded-xl px-3 py-3 text-white font-semibold text-sm outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]">
                {TIMEZONES.map((tz, j) => <option key={j} value={j}>{tz.label}</option>)}
              </select>
              {participants.length > 2 && (
                <button onClick={() => removeParticipant(i)}
                  className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold hover:bg-red-500/20 transition-all">
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Find Button */}
        <button onClick={() => { findBestTimes(); jumpTo() }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
          🌍 Find Best Time
        </button>

        {/* Results */}
        {results.length > 0 ? (
          <div ref={resultRef} className="space-y-4">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Best Meeting Windows</h3>
            {results.map((r, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white/[0.05] border border-white/8 hover:border-white/12 transition-all"
                style={{ animation: 'slideUp 0.3s ease-out', animationDelay: `${i * 0.1}s` }}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-base font-bold text-white">🕐 {formatHour(r.utcHour, 0)} UTC</h4>
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                    r.score >= participants.length * 2 ? 'bg-green-500/15 text-green-400' :
                    r.score >= participants.length ? 'bg-amber-500/15 text-amber-400' :
                    'bg-slate-500/15 text-slate-400'
                  }`}>
                    {r.score >= participants.length * 2 ? 'Perfect' : r.score >= participants.length ? 'Good' : 'Fair'}
                  </span>
                </div>
                <div className="grid gap-2">
                  {r.times.map((t, j) => (
                    <div key={j} className="flex items-center gap-3 text-sm">
                      <span className="text-slate-500 w-28 truncate">{t.name}</span>
                      <span className="text-white font-mono font-semibold">{t.time}</span>
                      <span className="text-[10px] text-slate-600">{t.tz}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🌍</div>
            <p className="text-sm text-slate-600 font-medium">Add participants and click Find Best Time</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
