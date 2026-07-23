import { useState, useCallback, useRef, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const sanitizeUsername = (u) => { if (!u) return ''; u = String(u).trim(); return u.startsWith('@') ? u.slice(1).toLowerCase() : u.toLowerCase() }

function parseList(text) {
  text = (text || '').trim()
  if (!text) return []
  try {
    const j = JSON.parse(text)
    if (Array.isArray(j)) return j.flatMap(x => {
      if (typeof x === 'string') return sanitizeUsername(x)
      if (x && typeof x === 'object') return sanitizeUsername(x.username || x.value || x.handle || x.user || x.name || x.string_list_data?.[0]?.value)
      return []
    }).filter(Boolean)
  } catch {}
  const lines = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean)
  if (lines.length > 0 && lines[0].includes(',')) {
    const rows = lines.map(l => { const r = []; let c = ''; let q = false; for (let i = 0; i < l.length; i++) { const ch = l[i]; if (ch === '"') q = !q; else if (ch === ',' && !q) { r.push(c.trim()); c = '' } else c += ch }; r.push(c.trim()); return r })
    const h = rows[0].map(h => h.toLowerCase())
    let col = h.findIndex(x => ['username', 'user', 'handle'].includes(x))
    if (col === -1) col = 0
    return rows.slice(1).map(r => sanitizeUsername(r[col] || '')).filter(Boolean)
  }
  return lines.map(s => sanitizeUsername(s)).filter(Boolean)
}

// Heuristic fake follower detection
function analyzeFakes(usernames) {
  return usernames.map(u => {
    let score = 0, reasons = []
    // Random character patterns (high ratio of numbers)
    const numRatio = (u.match(/\d/g) || []).length / u.length
    if (numRatio > 0.5) { score += 30; reasons.push('High number ratio') }
    // Very long username
    if (u.length > 20) { score += 15; reasons.push('Unusually long name') }
    // Repeated characters
    if (/(.)\1{3,}/.test(u)) { score += 25; reasons.push('Repeated characters') }
    // Common bot patterns
    if (/^(user|insta|follow|like|photo|pic|real)[_-]?\d{4,}/.test(u)) { score += 40; reasons.push('Bot-like prefix') }
    if (/\d{5,}$/.test(u)) { score += 20; reasons.push('Long number suffix') }
    // Very short with numbers
    if (u.length < 5 && /\d/.test(u)) { score += 15; reasons.push('Short with numbers') }
    // Underscore/number heavy
    const specialRatio = (u.match(/[_\-\.]/g) || []).length / u.length
    if (specialRatio > 0.4) { score += 15; reasons.push('Heavy special chars') }
    // No vowels (likely random)
    if (!/[aeiou]/.test(u) && u.length > 4) { score += 20; reasons.push('No vowels') }
    // Starts and ends with numbers
    if (/^\d/.test(u) && /\d$/.test(u)) { score += 10; reasons.push('Starts/ends with numbers') }

    const risk = score >= 50 ? 'high' : score >= 25 ? 'medium' : 'low'
    return { username: u, score: Math.min(score, 100), risk, reasons }
  }).sort((a, b) => b.score - a.score)
}

export default function instagram_fake_follower_checker() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [pasteText, setPasteText] = useState('')
  const [results, setResults] = useState(null)
  const fileRef = useRef(null)

  const handleAnalyze = useCallback(async () => {
    let usernames = []
    if (fileRef.current?.files?.length) {
      for (const f of fileRef.current.files) {
        const txt = await f.text()
        usernames.push(...parseList(txt))
      }
    }
    if (pasteText.trim()) usernames.push(...parseList(pasteText))
    usernames = [...new Set(usernames)]
    if (!usernames.length) return
    const analyzed = analyzeFakes(usernames)
    setResults(analyzed)
    jumpTo()
  }, [pasteText, jumpTo])

  const stats = useMemo(() => {
    if (!results) return null
    const high = results.filter(r => r.risk === 'high').length
    const medium = results.filter(r => r.risk === 'medium').length
    const low = results.filter(r => r.risk === 'low').length
    const avgScore = (results.reduce((s, r) => s + r.score, 0) / results.length).toFixed(1)
    return { high, medium, low, total: results.length, avgScore }
  }, [results])

  const riskColor = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' }
  const riskBg = { high: 'rgba(239,68,68,0.12)', medium: 'rgba(245,158,11,0.12)', low: 'rgba(34,197,94,0.12)' }
  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Instagram Fake Follower Checker"
      desc="Analyze your follower list for suspicious accounts using pattern-based heuristics. Client-side, privacy-first."
      icon="🕵️" iconBg="rgba(239,68,68,0.08)"
      category="social" slug="instagram-fake-follower-checker"
      faq={[
        { q: "How does this tool detect fake followers?", a: "It uses pattern-based heuristics: username patterns (long numbers, repeated chars, bot-like prefixes), statistical analysis, and common fake account naming conventions." },
        { q: "Is this 100% accurate?", a: "No. This is a heuristic analysis — it flags suspicious patterns but can produce false positives. Use it as a starting point, not a definitive judgment." },
        { q: "What should I do with fake followers?", a: "If you identify suspicious accounts, you can manually review and remove them. Focus on growing genuine, engaged followers instead." },
      ]}
      howItWorks={[
        'Upload your followers file or paste your follower list.',
        'The tool analyzes usernames for suspicious patterns.',
        'Review flagged accounts with risk levels and reasons.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Instagram Fake Follower Checker", "applicationCategory": "SocialNetworkingApplication",
        "url": "https://www.uptools.in/instagram-fake-follower-checker/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Upload followers file</label>
            <input ref={fileRef} type="file" accept=".json,.csv,.txt,.html"
              className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-indigo-500/20 file:text-indigo-400 hover:file:bg-indigo-500/30 file:cursor-pointer" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Or paste follower list</label>
            <textarea value={pasteText} onChange={e => setPasteText(e.target.value)}
              placeholder={"user1\nuser2\nuser3\n..."}
              rows={5}
              className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 resize-none [color-scheme:dark]" />
          </div>
          <button onClick={handleAnalyze}
            className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
            🕵️ Analyze Followers
          </button>
        </div>

        {results && stats && (
          <div ref={resultRef} className="space-y-4" style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center p-3 bg-black/20 rounded-xl">
                <div className="text-xl font-extrabold text-white">{stats.total}</div>
                <div className="text-xs text-slate-500">Total</div>
              </div>
              <div className="text-center p-3 rounded-xl" style={{ background: riskBg.high }}>
                <div className="text-xl font-extrabold" style={{ color: riskColor.high }}>{stats.high}</div>
                <div className="text-xs text-slate-500">High Risk</div>
              </div>
              <div className="text-center p-3 rounded-xl" style={{ background: riskBg.medium }}>
                <div className="text-xl font-extrabold" style={{ color: riskColor.medium }}>{stats.medium}</div>
                <div className="text-xs text-slate-500">Medium</div>
              </div>
              <div className="text-center p-3 rounded-xl" style={{ background: riskBg.low }}>
                <div className="text-xl font-extrabold" style={{ color: riskColor.low }}>{stats.low}</div>
                <div className="text-xs text-slate-500">Low Risk</div>
              </div>
            </div>

            <div className="text-center p-3 bg-white/[0.06] border border-white/[0.08] rounded-xl">
              <span className="text-sm text-slate-400">Average Risk Score: </span>
              <span className="text-sm font-bold" style={{ color: parseFloat(stats.avgScore) >= 50 ? riskColor.high : parseFloat(stats.avgScore) >= 25 ? riskColor.medium : riskColor.low }}>
                {stats.avgScore}/100
              </span>
            </div>

            <div className="space-y-2">
              {results.map((r, i) => (
                <div key={i} className="p-3 rounded-xl border transition-all"
                  style={{ background: riskBg[r.risk], borderColor: `${riskColor[r.risk]}33` }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <a href={`https://instagram.com/${r.username}`} target="_blank" rel="noopener noreferrer"
                        className="text-sm font-semibold text-white hover:text-indigo-400 transition-colors no-underline">
                        @{r.username}
                      </a>
                      <span className="px-2 py-0.5 rounded-lg text-xs font-bold uppercase"
                        style={{ background: `${riskColor[r.risk]}20`, color: riskColor[r.risk] }}>
                        {r.risk}
                      </span>
                    </div>
                    <div className="text-sm font-bold" style={{ color: riskColor[r.risk] }}>{r.score}%</div>
                  </div>
                  {r.reasons.length > 0 && (
                    <div className="mt-2 flex gap-1.5 flex-wrap">
                      {r.reasons.map((reason, j) => (
                        <span key={j} className="px-2 py-0.5 rounded-lg bg-white/[0.06] text-xs text-slate-400">{reason}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!results && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🕵️</div>
            <p className="text-sm text-slate-600 font-medium">Upload or paste your follower list to analyze</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
