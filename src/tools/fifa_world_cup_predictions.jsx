import { useState, useCallback, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const TEAMS = [
  { n: 'Australia', f: '🇦🇺' }, { n: 'Iran', f: '🇮🇷' }, { n: 'Iraq', f: '🇮🇶' }, { n: 'Japan', f: '🇯🇵' },
  { n: 'Jordan', f: '🇯🇴' }, { n: 'Qatar', f: '🇶🇦' }, { n: 'Saudi Arabia', f: '🇸🇦' }, { n: 'South Korea', f: '🇰🇷' },
  { n: 'Uzbekistan', f: '🇺🇿' }, { n: 'Algeria', f: '🇩🇿' }, { n: 'Cape Verde', f: '🇨🇻' }, { n: 'DR Congo', f: '🇨🇩' },
  { n: 'Egypt', f: '🇪🇬' }, { n: 'Ghana', f: '🇬🇭' }, { n: 'Ivory Coast', f: '🇨🇮' }, { n: 'Morocco', f: '🇲🇦' },
  { n: 'Senegal', f: '🇸🇳' }, { n: 'South Africa', f: '🇿🇦' }, { n: 'Tunisia', f: '🇹🇳' }, { n: 'Canada', f: '🇨🇦' },
  { n: 'Curacao', f: '🇨🇼' }, { n: 'Haiti', f: '🇭🇹' }, { n: 'Mexico', f: '🇲🇽' }, { n: 'Panama', f: '🇵🇦' },
  { n: 'USA', f: '🇺🇸' }, { n: 'Argentina', f: '🇦🇷' }, { n: 'Brazil', f: '🇧🇷' }, { n: 'Colombia', f: '🇨🇴' },
  { n: 'Ecuador', f: '🇪🇨' }, { n: 'Paraguay', f: '🇵🇾' }, { n: 'Uruguay', f: '🇺🇾' }, { n: 'New Zealand', f: '🇳🇿' },
  { n: 'Austria', f: '🇦🇹' }, { n: 'Belgium', f: '🇧🇪' }, { n: 'Bosnia', f: '🇧🇦' }, { n: 'Croatia', f: '🇭🇷' },
  { n: 'Czech Republic', f: '🇨🇿' }, { n: 'England', f: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' }, { n: 'France', f: '🇫🇷' }, { n: 'Germany', f: '🇩🇪' },
  { n: 'Netherlands', f: '🇳🇱' }, { n: 'Norway', f: '🇳🇴' }, { n: 'Portugal', f: '🇵🇹' }, { n: 'Scotland', f: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  { n: 'Spain', f: '🇪🇸' }, { n: 'Sweden', f: '🇸🇪' }, { n: 'Switzerland', f: '🇨🇭' }, { n: 'Turkey', f: '🇹🇷' },
]

const GROUPS = 'ABCDEFGHIJKL'.split('').map(g => `Group ${g}`)
const GROUP_LABELS = GROUPS.flatMap(g => [`${g} Winner`, `${g} Runner-up`])
const AWARDS = ['🏆 Champion', '⚽ Golden Boot', '🥇 Golden Ball']
const AWARD_KEYS = ['champion', 'goldenBoot', 'goldenBall']
const ALL_KEYS = [...GROUP_LABELS.map((_, i) => `g${i}`), ...AWARD_KEYS]

function TeamSelect({ value, onChange, label }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-400 mb-1">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]">
        <option value="" className="bg-gray-900">Select team...</option>
        {TEAMS.map(t => (
          <option key={t.n} value={t.n} className="bg-gray-900">{t.f} {t.n}</option>
        ))}
      </select>
    </div>
  )
}

export default function fifa_world_cup_predictions() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [picks, setPicks] = useState(() => {
    try {
      const saved = localStorage.getItem('wc2026_predictions')
      return saved ? JSON.parse(saved) : {}
    } catch { return {} }
  })
  const [shareUrl, setShareUrl] = useState('')

  const setPick = useCallback((key, value) => {
    setPicks(prev => {
      const next = { ...prev, [key]: value }
      localStorage.setItem('wc2026_predictions', JSON.stringify(next))
      return next
    })
  }, [])

  const savePredictions = useCallback(() => {
    localStorage.setItem('wc2026_predictions', JSON.stringify(picks))
    alert('✅ Predictions saved to your browser!')
  }, [picks])

  const clearPredictions = useCallback(() => {
    if (!confirm('Clear all predictions?')) return
    localStorage.removeItem('wc2026_predictions')
    setPicks({})
    alert('🗑️ Predictions cleared.')
  }, [])

  const sharePredictions = useCallback(() => {
    const p = Object.values(picks).filter(v => v).join(',')
    if (!p) { alert('Please make at least one selection first.'); return }
    const u = window.location.origin + window.location.pathname + '?p=' + btoa(encodeURIComponent(JSON.stringify(picks)))
    setShareUrl(u)
  }, [picks])

  const copyShare = useCallback(() => {
    navigator.clipboard.writeText(shareUrl).then(() => alert('📋 Link copied!'))
  }, [shareUrl])

  const filledCount = useMemo(() => Object.values(picks).filter(v => v).length, [picks])

  return (
    <ToolLayout
      title="FIFA World Cup 2026 Predictions"
      desc="Make your FIFA World Cup 2026 predictions. Pick group winners, runners-up, Golden Boot, champion, and Golden Ball."
      icon="📋" iconBg="rgba(234,179,8,0.08)"
      category="fifa" slug="fifa-world-cup-predictions"
      faq={[
        { q: "When was the FIFA World Cup 2026?", a: "The 2026 FIFA World Cup ran from June 11 to July 19, 2026, across 16 cities in the United States, Mexico, and Canada. Spain won, beating Argentina 1–0 in the Final." },
        { q: "How many teams are in WC 2026?", a: "48 teams competed — expanded from 32. Split into 12 groups of 4 teams each." },
        { q: "Can I save my predictions?", a: "Yes! Click Save to store in your browser's local storage." },
        { q: "Can I share my predictions with friends?", a: "Click Share to generate a unique link with all your predictions encoded." },
      ]}
      howItWorks={[
        "Select group winners & runners-up for all 12 groups.",
        "Predict the Champion, Golden Boot, and Golden Ball winners.",
        "Save to browser, share via link, and compare with friends!",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "WebApplication",
        name: "FIFA World Cup 2026 Predictions",
        url: "https://www.uptools.in/fifa-world-cup-predictions/",
      }}
    >
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Info */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 text-center text-xs">
            {[{ n: '48', l: 'Teams' }, { n: '12', l: 'Groups' }, { n: '104', l: 'Matches' }, { n: '🇺🇸🇲🇽🇨🇦', l: 'Hosts' }, { n: 'Jun 11 – Jul 19', l: '2026' }, { n: `${filledCount}/27`, l: 'Picks Made' }].map(s => (
              <div key={s.l} className="bg-black/20 rounded-xl p-2">
                <div className="text-sm font-extrabold text-indigo-400">{s.n}</div>
                <div className="text-[9px] text-slate-500">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Group Predictions */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <h2 className="text-sm font-bold text-white mb-3">📋 Group Predictions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {GROUP_LABELS.map((label, i) => (
              <TeamSelect key={i} label={label} value={picks[`g${i}`] || ''}
                onChange={v => setPick(`g${i}`, v)} />
            ))}
          </div>
        </div>

        {/* Awards */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <h2 className="text-sm font-bold text-white mb-3">🏆 Tournament Awards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {AWARDS.map((label, i) => (
              <TeamSelect key={i} label={label} value={picks[AWARD_KEYS[i]] || ''}
                onChange={v => setPick(AWARD_KEYS[i], v)} />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2" ref={resultRef}>
          <button onClick={() => { savePredictions(); jumpTo() }}
            className="px-5 py-3 rounded-xl bg-indigo-500 text-white text-sm font-bold hover:bg-indigo-400 transition-all">
            💾 Save Predictions
          </button>
          <button onClick={sharePredictions}
            className="px-5 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-400 text-sm font-semibold hover:text-white transition-all">
            🔗 Share
          </button>
          <button onClick={clearPredictions}
            className="px-5 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-400 text-sm font-semibold hover:text-white transition-all">
            🗑️ Clear
          </button>
        </div>

        {shareUrl && (
          <div className="bg-indigo-500/[0.06] border border-indigo-500/15 rounded-xl p-3 flex items-center gap-2">
            <span className="text-xs text-slate-400 flex-1 truncate">{shareUrl}</span>
            <button onClick={copyShare}
              className="px-3 py-1 rounded-lg bg-white/5 border border-white/[0.08] text-xs text-slate-400 hover:text-white transition-all whitespace-nowrap">
              📋 Copy
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
