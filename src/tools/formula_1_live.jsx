import { useState, useCallback, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function formula_1_live() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [session, setSession] = useState(null)
  const [drivers, setDrivers] = useState([])
  const [positions, setPositions] = useState([])
  const [intervals, setIntervals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastUpdate, setLastUpdate] = useState(null)

  const load = useCallback(async () => {
    setError('')
    try {
      const [sessionR, driversR] = await Promise.all([
        fetch('https://api.openf1.org/v1/sessions?session_key=latest'),
        fetch('https://api.openf1.org/v1/drivers?session_key=latest'),
      ])
      const sessionD = await sessionR.json()
      const driversD = await driversR.json()
      if (!Array.isArray(sessionD) || sessionD.length === 0) {
        setError('No live F1 session is running right now. Check back during a race weekend.')
        setLoading(false)
        return
      }
      const s = sessionD[0]
      setSession(s)
      setDrivers(driversD)

      const [posR, intR] = await Promise.all([
        fetch(`https://api.openf1.org/v1/position?session_key=${s.session_key}`),
        fetch(`https://api.openf1.org/v1/intervals?session_key=${s.session_key}`),
      ])
      const posD = await posR.json()
      const intD = await intR.json()

      // latest position snapshot
      const posMap = new Map()
      posD.forEach(p => {
        const existing = posMap.get(p.driver_number)
        if (!existing || new Date(p.date) > new Date(existing.date)) posMap.set(p.driver_number, p)
      })
      const sortedPos = [...posMap.values()].sort((a, b) => a.position - b.position)
      setPositions(sortedPos)

      // latest interval per driver
      const intMap = new Map()
      intD.forEach(i => {
        const existing = intMap.get(i.driver_number)
        if (!existing || new Date(i.date) > new Date(existing.date)) intMap.set(i.driver_number, i)
      })
      setIntervals([...intMap.values()])
      setLastUpdate(new Date().toLocaleTimeString())
    } catch {
      setError('Could not load F1 data. Please try again.')
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])
  useEffect(() => { const iv = setInterval(load, 30000); return () => clearInterval(iv) }, [load])

  const driverFor = (num) => drivers.find(d => d.driver_number === num)

  const sessionType = {
    'Race': '🏁 Race', 'Qualifying': '⏱️ Qualifying', 'Practice 1': '🛠️ Practice 1',
    'Practice 2': '🛠️ Practice 2', 'Practice 3': '🛠️ Practice 3', 'Sprint': '⚡ Sprint',
    'Sprint Qualifying': '⚡ Sprint Qualifying', 'Sprint Shootout': '⚡ Sprint Shootout',
  }[session?.session_name] || session?.session_name || 'Live Session'

  return (
    <ToolLayout
      title="Formula 1 Live"
      desc="Live Formula 1 session data: real-time driver positions, gaps, and session info powered by the free OpenF1 API."
      icon="🏎️" iconBg="rgba(239,68,68,0.08)"
      category="sports" slug="formula-1-live"
      faq={[
        { q: 'Where does the data come from?', a: 'All data comes from the free, open OpenF1 API, which mirrors the official F1 timing feeds during live sessions.' },
        { q: 'How current is the data?', a: 'Positions and gaps refresh automatically every 30 seconds while a session is running.' },
        { q: 'What if no session is live?', a: 'The tool shows the latest completed session\u2019s standings. During off-weekends it returns the most recent data.' },
      ]}
      howItWorks={[
        'Open the page during a race weekend to see live timing.',
        'Drivers are ordered by position with team colors.',
        'Gap column shows time behind the leader (from interval data).',
        'Data auto-refreshes every 30 seconds.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        name: "Formula 1 Live", "applicationCategory": "SportsApplication",
        url: "https://www.uptools.in/formula-1-live/",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-5">
        {loading && <div className="text-center py-16"><div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>}

        {error && (
          <div className="text-center py-10">
            <p className="text-sm text-slate-400 mb-3">{error}</p>
            <button onClick={load} className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors">↻ Refresh</button>
          </div>
        )}

        {session && !error && (
          <div ref={resultRef} className="space-y-4" style={{ animation: 'slideUp 0.35s ease-out' }}>
            {/* Session header */}
            <div className="rounded-3xl border-2 border-white/8 bg-gradient-to-br from-red-500/[0.1] to-transparent p-6">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🏎️</div>
                <div>
                  <div className="text-lg font-extrabold text-white">{session.meeting_name}</div>
                  <div className="text-sm text-slate-400 mt-0.5">
                    {sessionType} · {session.country_name} {session.location ? `· ${session.location}` : ''}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> LIVE
                </span>
                <span className="text-[10px] text-slate-500">Updated {lastUpdate}</span>
              </div>
            </div>

            {/* Standings */}
            <div className="rounded-3xl border-2 border-white/8 bg-white/[0.03] overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <div className="w-8">Pos</div>
                <div className="flex-1">Driver</div>
                <div className="w-20 text-right">Gap</div>
              </div>
              {positions.length === 0 && (
                <div className="text-center py-10 text-slate-500 text-sm">No live position data yet.</div>
              )}
              {positions.map(p => {
                const d = driverFor(p.driver_number)
                const gap = intervals.find(i => i.driver_number === p.driver_number)?.gap_to_leader
                const teamColor = d?.team_colour ? '#' + d.team_colour : '#64748b'
                return (
                  <div key={p.driver_number} className="flex items-center gap-3 px-4 py-2.5 border-b border-white/5 hover:bg-white/[0.03] transition-all">
                    <div className="w-8 text-sm font-extrabold text-white">{p.position}</div>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <img src={d?.headshot_url} alt="" className="w-8 h-8 rounded-full object-cover border border-white/10" loading="lazy" />
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-white truncate">{d?.name_acronym || d?.full_name || `#${p.driver_number}`}</div>
                        <div className="text-[10px] text-slate-500 truncate" style={{ color: teamColor }}>{d?.team_name || ''}</div>
                      </div>
                    </div>
                    <div className="w-20 text-right text-xs font-semibold text-slate-300 font-mono">
                      {gap === 0 ? 'LEADER' : (gap ? `+${gap.toFixed(3)}` : '—')}
                    </div>
                  </div>
                )
              })}
            </div>

            <p className="text-[10px] text-slate-600 text-center">
              Live timing data from <a href="https://openf1.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-400">OpenF1</a> · refreshes every 30s.
            </p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
