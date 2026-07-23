import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = v => new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(v || 0)

const TFSA_LIMITS = {
  2009: 5000, 2010: 5000, 2011: 5000, 2012: 5000,
  2013: 5500, 2014: 5500, 2015: 10000, 2016: 5500,
  2017: 5500, 2018: 5500, 2019: 6000, 2020: 6000,
  2021: 6000, 2022: 6000, 2023: 6500, 2024: 7000,
  2025: 7000
}

function totalLimit(fromYear) {
  let sum = 0
  const now = 2025
  for (let y = fromYear; y <= now; y++) {
    if (TFSA_LIMITS[y]) sum += TFSA_LIMITS[y]
  }
  return sum
}

function calcTFSA(startYear, contrib, withdraw, carry) {
  const sy = Number(startYear || 0)
  const c = Math.max(0, Number(contrib || 0))
  const w = Math.max(0, Number(withdraw || 0))
  const carryVal = Math.max(0, Number(carry || 0))
  if (!sy || sy < 2009) return null
  const limit = totalLimit(sy)
  const est = Math.max(0, limit + w + carryVal - c)
  return { room: est, totalLimit: limit }
}

export default function tfsa_room_tracker() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [startYear, setStartYear] = useState('')
  const [contrib, setContrib] = useState('')
  const [withdraw, setWithdraw] = useState('')
  const [carry, setCarry] = useState('')

  const result = useMemo(() => calcTFSA(startYear, contrib, withdraw, carry), [startYear, contrib, withdraw, carry])

  const inputClass = 'w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl px-5 py-4 text-2xl font-extrabold text-white outline-none focus:border-red-500/40 transition-all duration-300 placeholder:text-white/8'

  return (
    <ToolLayout
      title="TFSA Room Tracker"
      desc="Estimate TFSA contribution room using yearly limits, contributions, withdrawals, and carry-forward."
      icon="🍁" iconBg="rgba(220,38,38,0.08)"
      category="canada" slug="tfsa-room-tracker"
      faq={[
        { q: 'What is TFSA Room Tracker?', a: 'Estimate TFSA contribution room using yearly limits, contributions, withdrawals, and carry-forward.' },
        { q: 'Is it free to use?', a: 'Yes. All UpTools calculators are completely free, with no sign-ups required.' },
      ]}
      howItWorks={[
        'Enter the year you turned 18 or became eligible for TFSA.',
        'Enter your total contributions and withdrawals to date.',
        'Click Calculate to see your estimated available room.',
      ]}
      schema={{
        '@context': 'https://schema.org', '@type': 'SoftwareApplication',
        name: 'TFSA Room Tracker', applicationCategory: 'UtilitiesApplication',
        url: 'https://www.uptools.in/tfsa-room-tracker/',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'CAD' }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Year you became 18 (or started eligibility)</label>
          <input type="number" value={startYear} onChange={e => setStartYear(e.target.value)}
            placeholder="e.g., 2015" min="2009" max="2025" step="1"
            className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Total contributions to date</label>
          <input type="number" value={contrib} onChange={e => setContrib(e.target.value)}
            placeholder="e.g., 12000" min="0" step="100"
            className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Total withdrawals to date</label>
          <input type="number" value={withdraw} onChange={e => setWithdraw(e.target.value)}
            placeholder="e.g., 2000" min="0" step="100"
            className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Carry-forward room (optional)</label>
          <input type="number" value={carry} onChange={e => setCarry(e.target.value)}
            placeholder="e.g., 5000" min="0" step="100"
            className={inputClass} />
        </div>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-red-500/15 bg-gradient-to-br from-red-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider">Estimated Room</h3>
            </div>
            <div className="text-3xl font-extrabold text-white">{fmt(result.room)}</div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Total limits available</span>
                <span className="font-bold text-white">{fmt(result.totalLimit)}</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4">Uses published yearly limits through 2025. This is an estimate — check CRA for exact room.</p>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🍁</div>
            <p className="text-sm text-slate-600 font-medium">Enter start year (2009+) to see your TFSA room</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
