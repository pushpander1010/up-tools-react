import { useState, useMemo, useCallback, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

function timestampToDate(ts) {
  // Auto-detect seconds vs milliseconds
  const ms = ts > 1e10 ? ts : ts * 1000
  return new Date(ms)
}

function dateToTimestamp(date) {
  return Math.floor(date.getTime() / 1000)
}

function formatISO(date) {
  try { return date.toISOString() } catch { return 'Invalid date' }
}

function formatLocal(date) {
  try {
    return date.toLocaleString(undefined, {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    })
  } catch { return 'Invalid date' }
}

function formatUTC(date) {
  try {
    return date.toUTCString()
  } catch { return 'Invalid date' }
}

function isValidDate(d) {
  return d instanceof Date && !isNaN(d.getTime())
}

function toLocalInputValue(date) {
  if (!isValidDate(date)) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  const s = String(date.getSeconds()).padStart(2, '0')
  return `${y}-${m}-${d}T${h}:${min}:${s}`
}

export default function unix_timestamp_converter() {

  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [mode, setMode] = useState('ts2date')
  const [tsInput, setTsInput] = useState('')
  const [dateInput, setDateInput] = useState('')
  const [results, setResults] = useState(null)
  const [showResults, setShowResults] = useState(false)

  const [currentTs, setCurrentTs] = useState(Math.floor(Date.now() / 1000))

  // Live updating current timestamp
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTs(Math.floor(Date.now() / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const doConvert = useCallback(() => {
    if (mode === 'ts2date') {
      const ts = parseInt(tsInput, 10)
      if (isNaN(ts)) { setResults(null); return }
      const date = timestampToDate(ts)
      if (!isValidDate(date)) { setResults(null); return }
      const ms = ts > 1e10 ? ts : ts * 1000
      setResults({
        type: 'ts2date',
        inputTs: ts,
        seconds: Math.floor(ms / 1000),
        milliseconds: ms,
        iso: formatISO(date),
        local: formatLocal(date),
        utc: formatUTC(date),
      })
    } else {
      if (!dateInput) { setResults(null); return }
      const date = new Date(dateInput)
      if (!isValidDate(date)) { setResults(null); return }
      const ts = dateToTimestamp(date)
      setResults({
        type: 'date2ts',
        inputDate: dateInput,
        seconds: ts,
        milliseconds: ts * 1000,
        iso: formatISO(date),
        local: formatLocal(date),
        utc: formatUTC(date),
      })
    }
    setShowResults(true)
  }, [mode, tsInput, dateInput])

  const copy = useCallback((text, id) => {
    navigator.clipboard.writeText(String(text))
    setResults(r => r ? { ...r, copiedId: id } : r)
    setTimeout(() => setResults(r => r ? { ...r, copiedId: null } : r), 1500)
  }, [])

  const applyCurrentTs = useCallback(() => {
    setTsInput(String(Math.floor(Date.now() / 1000)))
    setShowResults(false)
  }, [])

  const applyCurrentDate = useCallback(() => {
    setDateInput(toLocalInputValue(new Date()))
    setShowResults(false)
  }, [])

  return (
    <ToolLayout
      title="Unix Timestamp Converter"
      desc="Convert Unix timestamps to dates and vice versa. Auto-detects seconds vs milliseconds."
      icon="⏱️" iconBg="rgba(168,85,247,0.08)"
      category="dev" slug="unix-timestamp-converter"
      faq={[
        { q: 'What is Unix time?', a: 'Unix time (also called Unix epoch time) is the number of seconds elapsed since January 1, 1970 00:00:00 UTC. It\'s the standard way computers represent dates.' },
        { q: 'What is the difference between seconds and milliseconds?', a: 'Unix timestamps can be in seconds (10 digits, e.g. 1700000000) or milliseconds (13 digits, e.g. 1700000000000). This tool auto-detects which format you\'re using.' },
        { q: 'What is the Unix epoch?', a: 'The Unix epoch is January 1, 1970 00:00:00 UTC — the starting point for Unix time. All timestamps count upward from this moment.' },
        { q: 'Why use Unix timestamps?', a: 'They\'re timezone-independent, easy to compare, and supported by virtually all programming languages and databases.' },
      ]}
      howItWorks={[
        'Choose between Timestamp → Date or Date → Timestamp mode.',
        'For timestamp mode: paste a Unix timestamp (auto-detects seconds vs ms).',
        'For date mode: use the date picker to select a date/time.',
        'Click Convert to see all output formats — seconds, milliseconds, ISO 8601, local, and UTC.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Unix Timestamp Converter", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/unix-timestamp-converter/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Current Timestamp */}
        <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
          <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-2">Current Unix Timestamp</div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-3xl font-extrabold text-purple-400 font-mono">{currentTs}</div>
              <div className="text-xs text-slate-400 mt-1">seconds since epoch</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-white font-mono">{currentTs * 1000}</div>
              <div className="text-xs text-slate-400">milliseconds</div>
            </div>
          </div>
        </div>

        {/* Mode Toggle */}
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-2 block">Conversion Mode</label>
          <div className="flex gap-2">
            {[
              ['ts2date', '📅 Timestamp → Date'],
              ['date2ts', '🔢 Date → Timestamp'],
            ].map(([val, label]) => (
              <button key={val} onClick={() => { setMode(val); setResults(null); setShowResults(false) }}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border-2 ${mode === val
                  ? 'bg-purple-500/15 border-purple-500/30 text-purple-400 shadow-lg shadow-purple-500/10'
                  : 'bg-white/[0.06] border-white/8 text-slate-400 hover:border-white/12'
                }`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        {mode === 'ts2date' ? (
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Unix Timestamp</label>
            <div className="flex gap-2">
              <input type="number" value={tsInput} onChange={e => { setTsInput(e.target.value); setShowResults(false) }}
                placeholder="e.g. 1700000000"
                className="flex-1 bg-white/[0.06] border-2 border-white/8 rounded-2xl px-5 py-4 text-2xl font-extrabold text-white outline-none focus:border-purple-500/40 transition-all placeholder:text-white/8 placeholder:text-lg placeholder:font-normal" />
              <button onClick={applyCurrentTs}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white/[0.06] border border-white/8 text-slate-400 hover:text-white hover:border-white/12 transition-all whitespace-nowrap">
                Now
              </button>
            </div>
            <div className="text-[11px] text-slate-600 mt-2">
              Auto-detects seconds (10 digits) vs milliseconds (13 digits)
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Date & Time</label>
            <div className="flex gap-2">
              <input type="datetime-local" value={dateInput}
                onChange={e => { setDateInput(e.target.value); setShowResults(false) }}
                step="1"
                className="flex-1 bg-white/[0.06] border-2 border-white/8 rounded-2xl px-5 py-4 text-lg font-bold text-white outline-none focus:border-purple-500/40 transition-all" />
              <button onClick={applyCurrentDate}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white/[0.06] border border-white/8 text-slate-400 hover:text-white hover:border-white/12 transition-all whitespace-nowrap">
                Now
              </button>
            </div>
          </div>
        )}

        {/* Convert Button */}
        <button onClick={() => { doConvert(); jumpTo() }}
          className="glow-btn w-full py-3 rounded-xl text-sm font-bold"
          style={{ background: 'linear-gradient(135deg, #a855f7, #9333ea)' }}>
          ⏱️ Convert
        </button>

        {/* Results */}
        {showResults && results && (
          <div ref={resultRef} className="space-y-3" style={{ animation: 'slideUp 0.3s ease-out' }}>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Conversion Results</div>

            {/* Seconds */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.06] border border-white/8 group">
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Unix Seconds</div>
                <div className="text-xl font-extrabold text-white font-mono">{results.seconds}</div>
              </div>
              <button onClick={() => copy(results.seconds, 'seconds')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${results.copiedId === 'seconds'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/8 text-slate-400 hover:text-white'}`}>
                {results.copiedId === 'seconds' ? '✓' : '📋'}
              </button>
            </div>

            {/* Milliseconds */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.06] border border-white/8 group">
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Milliseconds</div>
                <div className="text-xl font-extrabold text-white font-mono">{results.milliseconds}</div>
              </div>
              <button onClick={() => copy(results.milliseconds, 'ms')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${results.copiedId === 'ms'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/8 text-slate-400 hover:text-white'}`}>
                {results.copiedId === 'ms' ? '✓' : '📋'}
              </button>
            </div>

            {/* ISO 8601 */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-purple-500/8 border border-purple-500/15 group">
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-1">ISO 8601</div>
                <div className="text-sm font-bold text-white font-mono break-all">{results.iso}</div>
              </div>
              <button onClick={() => copy(results.iso, 'iso')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${results.copiedId === 'iso'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/8 text-slate-400 hover:text-white'}`}>
                {results.copiedId === 'iso' ? '✓' : '📋'}
              </button>
            </div>

            {/* Local Time */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.06] border border-white/8 group">
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Local Time</div>
                <div className="text-sm font-bold text-white">{results.local}</div>
              </div>
              <button onClick={() => copy(results.local, 'local')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${results.copiedId === 'local'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/8 text-slate-400 hover:text-white'}`}>
                {results.copiedId === 'local' ? '✓' : '📋'}
              </button>
            </div>

            {/* UTC */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.06] border border-white/8 group">
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">UTC</div>
                <div className="text-sm font-bold text-white">{results.utc}</div>
              </div>
              <button onClick={() => copy(results.utc, 'utc')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${results.copiedId === 'utc'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/8 text-slate-400 hover:text-white'}`}>
                {results.copiedId === 'utc' ? '✓' : '📋'}
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
