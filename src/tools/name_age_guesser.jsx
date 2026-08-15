import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function name_age_guesser() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [name, setName] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const guess = useCallback(async () => {
    const n = name.trim()
    if (!n) return
    setLoading(true)
    setError('')
    setResult(null)
    jumpTo()
    try {
      const [ageR, genderR, natR] = await Promise.all([
        fetch(`https://api.agify.io/?name=${encodeURIComponent(n)}`),
        fetch(`https://api.genderize.io/?name=${encodeURIComponent(n)}`),
        fetch(`https://api.nationalize.io/?name=${encodeURIComponent(n)}`),
      ])
      const ageD = await ageR.json()
      const genderD = await genderR.json()
      const natD = await natR.json()
      setResult({
        age: ageD.age ?? null,
        ageCount: ageD.count ?? 0,
        gender: genderD.gender ?? null,
        genderProb: genderD.probability ?? 0,
        genderCount: genderD.count ?? 0,
        nationalities: (natD.country || []).sort((a, b) => b.probability - a.probability).slice(0, 3),
      })
    } catch {
      setError('Could not fetch name data. Please try again.')
    }
    setLoading(false)
  }, [name, jumpTo])

  const flagFor = (code) => code
    ? String.fromCodePoint(...[...code.toUpperCase()].map(c => 0x1F1E6 - 65 + c.charCodeAt(0)))
    : '🌍'

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-400 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Name Age & Gender Guesser"
      desc="Predict age, gender, and nationality from any first name. Free AI-powered name statistics tool."
      icon="🔮" iconBg="rgba(168,85,247,0.08)"
      category="fun" slug="name-age-guesser"
      faq={[
        { q: 'How does this work?', a: 'The tool uses agify.io, genderize.io, and nationalize.io — free APIs built on public name datasets that estimate age, gender, and nationality from millions of real records.' },
        { q: 'How accurate is it?', a: 'Accuracy depends on how many records exist for that name. Common names with high counts give reliable estimates; rare names may return no data or a wide guess.' },
        { q: 'Can I check any name?', a: 'Yes, enter any first name. Names with non-ASCII characters work best when spelled phonetically.' },
      ]}
      howItWorks={[
        'Type a first name and press Guess.',
        'The tool queries three name datasets in parallel.',
        'See predicted age, gender with confidence, and top probable nationalities.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        name: "Name Age & Gender Guesser", "applicationCategory": "EntertainmentApplication",
        url: "https://www.uptools.in/name-age-guesser/",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && guess()}
            placeholder="Enter a first name (e.g. Aarav, Priya, John)"
            className={inputClass}
          />
          <button onClick={guess} disabled={loading}
            className="shrink-0 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-500/25 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
            {loading ? '⏳' : '🔮 Guess'}
          </button>
        </div>

        {error && <p className="text-center text-sm text-rose-400">{error}</p>}

        {result && (
          <div ref={resultRef} className="space-y-4" style={{ animation: 'slideUp 0.35s ease-out' }}>
            {/* Age */}
            <div className="rounded-3xl border-2 border-white/8 bg-gradient-to-br from-purple-500/[0.08] to-transparent p-6 text-center">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Predicted Age</div>
              <div className="text-4xl font-extrabold text-white">
                {result.age !== null ? result.age : '—'}
              </div>
              {result.age !== null && (
                <div className="text-xs text-slate-500 mt-1">based on {result.ageCount.toLocaleString()} name records</div>
              )}
            </div>

            {/* Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-3xl border-2 border-white/8 bg-white/[0.04] p-5">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Predicted Gender</div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{result.gender === 'male' ? '👨' : result.gender === 'female' ? '👩' : '❓'}</span>
                  <div className="flex-1">
                    <div className="text-lg font-bold text-white capitalize">
                      {result.gender ? result.gender : 'Unknown'}
                    </div>
                    {result.gender && (
                      <>
                        <div className="h-2 bg-white/8 rounded-full overflow-hidden mt-2">
                          <div className="h-full bg-purple-500 rounded-full"
                            style={{ width: `${(result.genderProb * 100).toFixed(0)}%` }} />
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          {(result.genderProb * 100).toFixed(0)}% confidence
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Nationalities */}
              <div className="rounded-3xl border-2 border-white/8 bg-white/[0.04] p-5">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Likely Nationality</div>
                {result.nationalities.length > 0 ? (
                  <div className="space-y-2">
                    {result.nationalities.map(n => (
                      <div key={n.country_id} className="flex items-center gap-2">
                        <span className="text-lg">{flagFor(n.country_id)}</span>
                        <span className="text-sm font-semibold text-white flex-1">{n.country_id}</span>
                        <span className="text-xs font-bold text-purple-400">{(n.probability * 100).toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-slate-500">No nationality data for this name.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
