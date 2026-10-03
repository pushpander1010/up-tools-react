import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function laya_decision_maker() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [question, setQuestion] = useState('')
  const [input, setInput] = useState('')
  const [backendUrl, setBackendUrl] = useState(() => { try { return localStorage.getItem('laya_backend') || '' } catch { return '' } })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])

  const choices = input.split('\n').flatMap(l => l.split(',')).map(s => s.trim()).filter(s => s.length > 0)

  const ask = useCallback(async () => {
    setError('')
    setResult(null)
    if (!question.trim()) { setError('Type your question first.'); return }
    if (choices.length < 2) { setError('Enter at least 2 choices (one per line).'); return }
    if (choices.length > 32) { setError('Max 32 choices (Laya limit).'); return }
    if (!backendUrl.trim()) { setError('Paste your Oracle Laya backend URL first.'); return }
    setLoading(true)
    try { localStorage.setItem('laya_backend', backendUrl.trim()) } catch { /* ignore */ }
    try {
      const base = backendUrl.trim().replace(/\/$/, '')
      const r = await fetch(base + '/decide', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim(), choices }),
      })
      const data = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error(data.detail || data.message || ('Backend error ' + r.status))
      setResult(data)
      jumpTo()
      const now = new Date()
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      setHistory(prev => [{ q: question.trim(), pick: data.pick, time }, ...prev].slice(0, 10))
    } catch (e) {
      setError(e.message || 'Laya backend unreachable. Check the URL and that the Oracle server is running.')
    } finally {
      setLoading(false)
    }
  }, [question, input, backendUrl, choices, jumpTo])

  const sorted = result && result.probabilities
    ? Object.entries(result.probabilities).sort((a, b) => b[1] - a[1])
    : []

  return (
    <ToolLayout
      title="Laya Decision Maker"
      desc="Laya Decision Maker - ask a question, list your options, and the Laya AI decision model picks the best choice with probabilities. Free online, no sign-up."
      icon="🧠" iconBg="rgba(245,158,11,0.08)"
      category="tools" slug="laya-decision-maker"
      faq={[
        { q: 'How does it work?', a: 'Type your question, list your options (one per line), and click Ask Laya. The Laya AI decision model on your Oracle backend scores every option and returns the best pick with probabilities.' },
        { q: 'What is Laya?', a: 'Laya is an open-weight AI decision model. Instead of writing text, it reads your question and options and returns a calibrated choice with a probability for each option.' },
        { q: 'Do I need the Oracle backend?', a: 'Yes. Laya runs on your Oracle server (see the setup guide in the oracle-laya-backend folder). Paste its URL once and the page remembers it.' },
        { q: 'What do the percentages mean?', a: 'Each option gets a probability. Higher means Laya is more confident that option fits your question best.' },
        { q: 'How is this different from a random picker?', a: 'A random picker chooses blindly. Laya reads your question and weighs each option, so the pick is reasoned, not random.' },
        { q: 'Is this Laya Decision Maker free?', a: 'Yes, completely free with no sign-up. Use it unlimited times online on any device.' },
      ]}
      howItWorks={[
        'Type your question, e.g. what should I have for lunch?',
        'List your options, one per line (2 to 32 choices).',
        'Paste your Oracle Laya backend URL (asked only once).',
        'Click Ask Laya and get the best pick with probabilities.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Laya Decision Maker", "applicationCategory": "UtilityApplication",
        "url": "https://www.uptools.in/laya-decision-maker/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Question */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Your Question</label>
          <input value={question} onChange={e => setQuestion(e.target.value)}
            placeholder="e.g. what should I have for lunch? vegetarian, cheap, quick"
            className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500/40 transition-all placeholder:text-slate-600" />
        </div>

        {/* Choices */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Your Options <span className="text-slate-400 font-normal">({choices.length} options, max 32)</span>
          </label>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder={"Salad\nPizza\nBiryani"}
            rows={5}
            className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500/40 transition-all placeholder:text-slate-600 resize-none" />
        </div>

        {/* Backend */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Oracle Laya Backend URL</label>
          <input value={backendUrl} onChange={e => setBackendUrl(e.target.value)}
            placeholder="e.g. http://129.154.x.x:8000"
            className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500/40 transition-all placeholder:text-slate-600" />
        </div>

        {/* Ask Button */}
        <button onClick={ask} disabled={loading}
          className="w-full py-4 rounded-2xl text-sm font-bold transition-all disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
          {loading ? '⏳ Laya deciding...' : '🧠 Ask Laya to Decide'}
        </button>

        {error && <p className="text-xs text-red-400 text-center">{error}</p>}

        {/* Result */}
        {result && (
          <div ref={resultRef}
            className="py-8 px-6 rounded-3xl border-2 border-amber-500/20 bg-gradient-to-br from-amber-500/[0.08] via-white/[0.02] to-transparent"
            style={{ animation: 'slideUp 0.35s ease-out' }}>
            <div className="text-5xl mb-2 text-center">🏆</div>
            <div className="text-3xl font-extrabold text-amber-400 text-center mb-1">{result.pick}</div>
            {typeof result.confidence === 'number' && (
              <p className="text-xs text-slate-400 text-center mb-4">Laya confidence: {Math.round(result.confidence * 1000) / 10}%</p>
            )}
            <div className="space-y-2 mt-4">
              {sorted.map(([opt, p]) => (
                <div key={opt}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/80">{opt}</span>
                    <span className="text-slate-400">{Math.round(p * 1000) / 10}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: (p * 100) + '%', background: 'linear-gradient(90deg, #f59e0b, #d97706)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.02]">
            <div className="text-4xl mb-3 opacity-20">🧠</div>
            <p className="text-sm text-slate-600 font-medium">Ask a question above and Laya will decide!</p>
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/[0.08]">
            <h3 className="text-sm font-bold text-slate-300 mb-3">History</h3>
            <div className="space-y-1">
              {history.map((h, i) => (
                <div key={i} className="flex justify-between items-center py-1 text-xs gap-3">
                  <span className="text-white/80 truncate">{h.q} → {h.pick}</span>
                  <span className="text-slate-400 shrink-0">{h.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
