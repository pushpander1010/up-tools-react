import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const TIMEZONES = [
  { tz: 'America/New_York', label: 'New York', short: 'EST/EDT', flag: '🇺🇸' },
  { tz: 'America/Los_Angeles', label: 'Los Angeles', short: 'PST/PDT', flag: '🇺🇸' },
  { tz: 'America/Toronto', label: 'Toronto', short: 'EST/EDT', flag: '🇨🇦' },
  { tz: 'Europe/London', label: 'London', short: 'GMT/BST', flag: '🇬🇧' },
  { tz: 'Europe/Berlin', label: 'Berlin', short: 'CET/CEST', flag: '🇩🇪' },
  { tz: 'Asia/Dubai', label: 'Dubai', short: 'GST', flag: '🇦🇪' },
  { tz: 'Asia/Kolkata', label: 'Mumbai', short: 'IST', flag: '🇮🇳' },
  { tz: 'Asia/Singapore', label: 'Singapore', short: 'SGT', flag: '🇸🇬' },
  { tz: 'Asia/Tokyo', label: 'Tokyo', short: 'JST', flag: '🇯🇵' },
  { tz: 'Australia/Sydney', label: 'Sydney', short: 'AEST/AEDT', flag: '🇦🇺' },
]

const PRESETS = {
  americas: ['America/New_York', 'America/Los_Angeles', 'America/Toronto'],
  europe: ['Europe/London', 'Europe/Berlin'],
  asia: ['Asia/Dubai', 'Asia/Kolkata', 'Asia/Singapore', 'Asia/Tokyo'],
  remote: ['America/New_York', 'Europe/London', 'Asia/Singapore', 'Australia/Sydney'],
}

function getUserTimezone() {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone } catch { return 'UTC' }
}

function formatTime(date, tz) {
  try {
    return date.toLocaleTimeString('en-US', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  } catch { return '--:--' }
}

function formatDate(date, tz) {
  try {
    return date.toLocaleDateString('en-US', {
      timeZone: tz,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  } catch { return '' }
}

function getOffset(date, tz) {
  try {
    const str = date.toLocaleString('en-US', { timeZone: tz, timeZoneName: 'shortOffset' })
    const match = str.match(/GMT([+-]\d{1,2}(?::\d{2})?)/)
    return match ? `UTC${match[1]}` : ''
  } catch { return '' }
}

function isWorkingHours(date, tz) {
  try {
    const hour = parseInt(date.toLocaleString('en-US', { timeZone: tz, hour: 'numeric', hour12: false }))
    return hour >= 9 && hour < 18
  } catch { return false }
}

export default function timezone_converter() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const userTz = useMemo(() => getUserTimezone(), [])
  const [baseTz, setBaseTz] = useState(userTz)
  const [time, setTime] = useState(() => {
    const now = new Date()
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  })
  const [activePreset, setActivePreset] = useState(null)
  const [copiedIdx, setCopiedIdx] = useState(null)

  const selectedTzs = useMemo(() => {
    if (activePreset && PRESETS[activePreset]) {
      return PRESETS[activePreset]
    }
    // Default: all timezones
    return TIMEZONES.map(t => t.tz)
  }, [activePreset])

  const baseDate = useMemo(() => {
    const now = new Date()
    const [h, m] = (time || '12:00').split(':').map(Number)
    // Create a date in the base timezone
    const today = now.toLocaleDateString('en-CA', { timeZone: baseTz })
    return new Date(`${today}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`)
  }, [time, baseTz])

  const conversions = useMemo(() => {
    return selectedTzs.map(tz => {
      const zone = TIMEZONES.find(t => t.tz === tz) || { label: tz, short: '', flag: '🌍' }
      const localTime = formatTime(baseDate, tz)
      const localDate = formatDate(baseDate, tz)
      const offset = getOffset(baseDate, tz)
      const working = isWorkingHours(baseDate, tz)
      return { ...zone, localTime, localDate, offset, working }
    })
  }, [baseDate, selectedTzs])

  const handleConvert = useCallback(() => {
    jumpTo()
  }, [jumpTo])

  const handlePreset = useCallback((preset) => {
    setActivePreset(p => p === preset ? null : preset)
    jumpTo()
  }, [jumpTo])

  const handleCopy = useCallback((tz, time, idx) => {
    const zone = TIMEZONES.find(t => t.tz === tz)
    navigator.clipboard.writeText(`${zone?.label || tz}: ${time}`)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 1500)
  }, [])

  // Check if user's timezone is in the list
  const userTzInfo = TIMEZONES.find(t => t.tz === userTz)

  return (
    <ToolLayout
      title="Time Zone Converter"
      desc="Convert times between world time zones. Find meeting overlaps and compare working hours globally."
      icon="🕐" iconBg="rgba(245,158,11,0.08)"
      category="networking" slug="timezone-converter"
      faq={[
        { q: 'How does timezone conversion work?', a: 'Timezone conversion takes a given time in one timezone and calculates what that same moment is in other timezones. Each timezone has a UTC offset that determines its offset from Coordinated Universal Time (UTC).' },
        { q: 'What is UTC offset?', a: 'UTC offset is the difference in hours and minutes between a timezone and Coordinated Universal Time. For example, UTC+5:30 means the local time is 5 hours and 30 minutes ahead of UTC. India uses IST (UTC+5:30).' },
        { q: 'What is DST (Daylight Saving Time)?', a: 'Daylight Saving Time is the practice of advancing clocks by one hour during warmer months to extend evening daylight. Not all regions observe DST — for example, Arizona (US) and most of India do not. DST causes the UTC offset of a timezone to change twice a year.' },
      ]}
      howItWorks={[
        'Select your base timezone or use the auto-detected one.',
        'Pick a time using the time picker.',
        'Choose a region preset (Americas, Europe, Asia, Remote Team) or view all zones.',
        'See the converted times with working-hours indicators.',
        'Green highlights indicate it is working hours (9 AM – 6 PM) in that timezone.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Time Zone Converter", "applicationCategory": "UtilityApplication",
        "url": "https://www.uptools.in/timezone-converter/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Base timezone & time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-2 block">Base Timezone</label>
            <select
              value={baseTz}
              onChange={e => setBaseTz(e.target.value)}
              className="w-full bg-white/[0.06] border border-white/8 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500/40 transition-all appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2394a3b8'%3E%3Cpath d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
            >
              {TIMEZONES.map(t => (
                <option key={t.tz} value={t.tz}>{t.flag} {t.label} ({t.short})</option>
              ))}
              {/* Add user timezone if not in list */}
              {!userTzInfo && !TIMEZONES.find(t => t.tz === baseTz) && (
                <option value={baseTz}>📍 {baseTz}</option>
              )}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-2 block">Time</label>
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              className="w-full bg-white/[0.06] border border-white/8 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500/40 transition-all font-mono"
            />
          </div>
        </div>

        {/* Presets */}
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-2 block">Region Presets</label>
          <div className="flex gap-2">
            {[['americas', '🌎 Americas'], ['europe', '🌍 Europe'], ['asia', '🌏 Asia'], ['remote', '👥 Remote Team']].map(([val, label]) => (
              <button key={val} onClick={() => handlePreset(val)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${activePreset === val
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'bg-white/[0.06] text-slate-500 border border-white/8'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Convert */}
        <button onClick={handleConvert}
          className="glow-btn w-full py-3 rounded-xl text-sm font-semibold"
          style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.08))' }}>
          🕐 Convert Time
        </button>

        {/* Results */}
        <div ref={resultRef} className="space-y-3"
          style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>

          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Converted Times ({conversions.length} zones)
          </div>

          {conversions.map((c, i) => (
            <div key={c.tz} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
              c.working
                ? 'bg-emerald-500/[0.05] border-emerald-500/15'
                : 'bg-white/[0.04] border-white/8'
            }`}>
              <div className="flex items-center gap-3">
                <span className="text-xl">{c.flag}</span>
                <div>
                  <div className="text-sm font-semibold text-white">{c.label}</div>
                  <div className="text-[10px] text-slate-500">{c.offset} · {c.short}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-lg font-bold text-white font-mono">{c.localTime}</div>
                  <div className="text-[10px] text-slate-500">{c.localDate}</div>
                </div>
                {c.working && (
                  <div className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                    WORK
                  </div>
                )}
                <button onClick={() => handleCopy(c.tz, c.localTime, i)}
                  className={`px-2 py-1 rounded-lg text-xs transition-all ${
                    copiedIdx === i
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-white/5 border border-white/8 text-slate-500 hover:text-white'
                  }`}>
                  {copiedIdx === i ? '✓' : '📋'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  )
}
