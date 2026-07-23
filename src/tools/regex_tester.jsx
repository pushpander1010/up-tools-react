import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function regex_tester() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [pattern, setPattern] = useState('')
  const [testStr, setTestStr] = useState('')
  const [flags, setFlags] = useState({ g: true, i: false, m: false })
  const [error, setError] = useState('')

  const flagStr = Object.entries(flags).filter(([, v]) => v).map(([k]) => k).join('')

  const matches = useMemo(() => {
    if (!pattern || !testStr) return []
    try {
      setError('')
      const regex = new RegExp(pattern, flagStr)
      const results = [...testStr.matchAll(regex)]
      return results.map((m, i) => ({ match: m[0], index: m.index, groups: m.slice(1) }))
    } catch (e) {
      setError(e.message)
      return []
    }
  }, [pattern, testStr, flagStr])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  const toggleFlag = (f) => setFlags(prev => ({ ...prev, [f]: !prev[f] }))

  return (
    <ToolLayout
      title="Regex Tester"
      desc="Test regular expressions online with live matching and group capture. Instant, private, no sign-up."
      icon="🔍" iconBg="rgba(99,102,241,0.08)"
      category="dev" slug="regex-tester"
      faq={[
        { q: "What is a regular expression?", a: "A regular expression (regex) is a pattern used to match character combinations in strings." },
        { q: "Are my patterns stored?", a: "No. Everything runs in your browser. Nothing is uploaded." },
      ]}
      howItWorks={[
        "Enter a regex pattern in the Pattern field.",
        "Enter text to test in the Test String field.",
        "Toggle flags (g, i, m) as needed.",
        "Matches are highlighted instantly.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Regex Tester", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/regex-tester/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 space-y-3">
          <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Pattern</label>
              <input type="text" value={pattern} onChange={e => setPattern(e.target.value)}
                placeholder="/^[a-z]+$/gi" className={`${inputClass} font-mono`} />
            </div>
            <button onClick={jumpTo}
              className="px-5 py-3 rounded-xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all active:scale-[0.98]">
              Test
            </button>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Test String</label>
            <textarea value={testStr} onChange={e => setTestStr(e.target.value)}
              placeholder="Enter text to test..." rows={4} className={`${inputClass} resize-none`} />
          </div>
          <div className="flex gap-4">
            {['g', 'i', 'm'].map(f => (
              <label key={f} className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                <input type="checkbox" checked={flags[f]} onChange={() => toggleFlag(f)}
                  className="w-4 h-4 rounded border-white/20 bg-white/10 text-indigo-500 focus:ring-indigo-500/40" />
                <span className="font-mono font-bold">{f}</span>
              </label>
            ))}
          </div>
        </div>

        <div ref={resultRef} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-3">Matches</h3>
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">❌ {error}</div>
          )}
          {!error && matches.length === 0 && pattern && testStr && (
            <div className="text-sm text-slate-500">No matches found</div>
          )}
          {matches.length > 0 && (
            <>
              <div className="text-sm font-semibold text-emerald-400 mb-3">{matches.length} match(es) found</div>
              <div className="space-y-2">
                {matches.map((m, i) => (
                  <div key={i} className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                    <span className="text-xs font-bold text-indigo-400">Match {i + 1}:</span>{' '}
                    <span className="font-mono text-white">"{m.match}"</span>
                    <span className="text-xs text-slate-500 ml-2">(index {m.index})</span>
                    {m.groups.length > 0 && (
                      <div className="mt-1 text-xs text-slate-400">
                        Groups: {m.groups.map((g, j) => <span key={j} className="font-mono text-cyan-400 ml-1">"{g}"</span>)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
          {!error && !pattern && (
            <div className="text-center py-8 text-sm text-slate-600">
              Enter a pattern and test string to see matches
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
