import { useState, useCallback, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'
import useAIStream from '../hooks/useAIStream'

const TASKS = [
  { id: 'originality', label: '🔍 Originality Check' },
  { id: 'paraphrase', label: '🔄 Paraphrase' },
  { id: 'keywords', label: '🏷️ Extract Keywords' },
]

function sentences(text) { return (text.trim().match(/[^.!?]+[.!?]*/g) || []).map(s => s.trim()).filter(Boolean) }
function avg(a) { return a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0 }
function stddev(a) { if (!a.length) return 0; const m = avg(a); return Math.sqrt(avg(a.map(x => (x - m) * (x - m)))) }
function fleschReadingEase(text) {
  const words = (text.match(/\b[a-zA-Z''-]+\b/g) || [])
  const syllables = words.reduce((s, w) => s + ((w.toLowerCase().match(/[aeiouy]+/g) || []).length || 1), 0)
  const sents = sentences(text).length || 1
  const W = Math.max(words.length, 1), S = Math.max(sents, 1), SYL = Math.max(syllables, 1)
  return Math.max(0, Math.min(100, 206.835 - 1.015 * (W / S) - 84.6 * (SYL / W)))
}
function ngramRepeats(text, n = 4) {
  const tokens = (text.toLowerCase().match(/\b[\w''-]+\b/g) || [])
  const grams = new Map(); let repeats = 0
  for (let i = 0; i <= tokens.length - n; i++) { const g = tokens.slice(i, i + n).join(' '); grams.set(g, (grams.get(g) || 0) + 1) }
  grams.forEach(c => { if (c > 1) repeats += (c - 1) })
  return repeats
}
function sentenceVariety(text) { const lens = sentences(text).map(s => s.split(/\s+/).filter(Boolean).length); return stddev(lens) }
function heuristicOriginality(text) {
  if (!text || text.trim().length < 60) return 100
  const fre = fleschReadingEase(text); const rep4 = ngramRepeats(text, 4); const varS = sentenceVariety(text)
  let score = 92 - Math.min(40, rep4 * 2.5) + Math.min(6, varS * 0.6) + Math.min(6, (fre - 50) / 10)
  return Math.max(0, Math.min(100, Math.round(score)))
}

function buildPrompt(task, text, opts) {
  if (task === 'originality') {
    return [
      "You are an academic integrity assistant.",
      "Analyze the user's text for potential plagiarism risk WITHOUT using web search.",
      "Return: a short originality percentage estimate, and a concise list of risky lines/phrases with reasons (cliché, overused phrasing, unlikely author voice, formulaic structure, etc.).",
      `Depth: ${opts.depth || 'balanced'}. Format: ${opts.format || 'bullets'}.`,
      "Do not invent sources or URLs. Keep it actionable.",
      "\n---\n", text
    ].join('\n')
  }
  if (task === 'paraphrase') {
    return [
      `Paraphrase the text to improve originality while preserving meaning.`,
      `Tone: ${opts.tone || 'Neutral'}. Constraints: ${opts.rules || 'vary sentence structure; avoid clichés; active voice; keep citations if present.'}`,
      "Return only the rewritten text.",
      "\n---\n", text
    ].join('\n')
  }
  return [
    `Extract top ${opts.topN || 20} keywords from the text${opts.phrases === 'Yes' ? ' including keyphrases' : ''}.`,
    "Return as a comma-separated list only.", "\n---\n", text
  ].join('\n')
}

export default function ai_plagiarism() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const { output, status, streaming, generate, stop } = useAIStream()
  const [input, setInput] = useState('')
  const [task, setTask] = useState('originality')
  const [copied, setCopied] = useState(false)
  const fileRef = useRef(null)

  // Task options
  const [depth, setDepth] = useState('balanced')
  const [format, setFormat] = useState('bullets')
  const [tone, setTone] = useState('Neutral')
  const [rules, setRules] = useState('')
  const [topN, setTopN] = useState('20')
  const [phrases, setPhrases] = useState('Yes')

  const charCount = input.length
  const wordCount = input.trim() ? (input.trim().match(/\b[\w''-]+\b/g) || []).length : 0

  // Local heuristics
  const kpiOriginality = input.trim().length >= 60 ? heuristicOriginality(input) + '%' : '-'
  const kpiVariety = input.trim().length >= 60 ? sentenceVariety(input).toFixed(1) : '-'
  const kpiFlesch = input.trim().length >= 60 ? fleschReadingEase(input).toFixed(0) : '-'
  const kpiNgram = input.trim().length >= 60 ? ngramRepeats(input, 4).toString() : '-'

  const handleRun = useCallback(() => {
    const text = input.trim()
    if (!text) return

    const opts = { depth, format, tone, rules, topN, phrases }
    const prompt = buildPrompt(task, text, opts)

    generate({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      systemPrompt: 'You are a concise, careful assistant.',
    })
    jumpTo()
  }, [input, task, depth, format, tone, rules, topN, phrases, generate, jumpTo])

  const copy = () => {
    if (!output) return
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 1500)
    })
  }

  const download = () => {
    if (!output) return
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'ai-result.txt'
    document.body.appendChild(a); a.click(); a.remove()
    URL.revokeObjectURL(url)
  }

  const importFile = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setInput(await f.text())
    e.target.value = ''
  }

  const inputClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600"
  const selectClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"
  const smallInput = "bg-black/20 border-2 border-white/[0.08] rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600"

  return (
    <ToolLayout
      title="AI Plagiarism Checker & Paraphraser"
      desc="Check originality, paraphrase for higher uniqueness, or extract keywords — with local heuristics and AI-powered deep analysis."
      icon="🔍" iconBg="rgba(168,85,247,0.08)"
      category="ai" slug="ai-plagiarism"
      faq={[
        { q: "Does this check against the web?", a: "The originality check uses heuristic analysis (not web search) to identify overused patterns, clichés, and formulaic writing." },
        { q: "What does the paraphrase do?", a: "It rewrites your text to improve originality while preserving meaning. You can choose tone and constraints." },
      ]}
      howItWorks={[
        "Paste your text or import a file.",
        "Choose a task: Originality Check, Paraphrase, or Extract Keywords.",
        "Click Run for AI-powered analysis with local heuristic KPIs.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "AI Plagiarism Checker", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/ai-plagiarism/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Task Selector */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <label className="block text-sm font-semibold text-slate-300 mb-3">Task</label>
          <div className="flex flex-wrap gap-2">
            {TASKS.map(t => (
              <button key={t.id} onClick={() => setTask(t.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  task === t.id
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'bg-white/[0.04] text-slate-500 border border-white/[0.08] hover:text-white'
                }`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Task Options */}
        {task === 'originality' && (
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
            <label className="block text-sm font-semibold text-slate-300 mb-3">Options</label>
            <div className="flex gap-3 items-end">
              <div><label className="block text-[10px] text-slate-500 mb-1">Depth</label>
                <select value={depth} onChange={e => setDepth(e.target.value)} className={selectClass + ' w-32'}>
                  <option value="quick">Quick</option><option value="balanced">Balanced</option><option value="deep">Deep</option>
                </select></div>
              <div><label className="block text-[10px] text-slate-500 mb-1">Format</label>
                <select value={format} onChange={e => setFormat(e.target.value)} className={selectClass + ' w-32'}>
                  <option value="bullets">Bullets</option><option value="table">Table</option>
                </select></div>
            </div>
          </div>
        )}
        {task === 'paraphrase' && (
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
            <label className="block text-sm font-semibold text-slate-300 mb-3">Options</label>
            <div className="flex gap-3 items-end flex-wrap">
              <div><label className="block text-[10px] text-slate-500 mb-1">Tone</label>
                <select value={tone} onChange={e => setTone(e.target.value)} className={selectClass + ' w-32'}>
                  <option>Neutral</option><option>Friendly</option><option>Formal</option><option>Academic</option><option>Simple</option><option>Sales</option>
                </select></div>
              <div><label className="block text-[10px] text-slate-500 mb-1">Constraints</label>
                <input value={rules} onChange={e => setRules(e.target.value)} placeholder="e.g. shorter, active voice" className={smallInput + ' w-48'} /></div>
            </div>
          </div>
        )}
        {task === 'keywords' && (
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
            <label className="block text-sm font-semibold text-slate-300 mb-3">Options</label>
            <div className="flex gap-3 items-end">
              <div><label className="block text-[10px] text-slate-500 mb-1">Top N</label>
                <input type="number" value={topN} onChange={e => setTopN(e.target.value)} className={smallInput + ' w-20'} /></div>
              <div><label className="block text-[10px] text-slate-500 mb-1">Include Phrases</label>
                <select value={phrases} onChange={e => setPhrases(e.target.value)} className={selectClass + ' w-20'}>
                  <option>Yes</option><option>No</option>
                </select></div>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-slate-300">Input Text *</label>
            <div className="flex gap-3 text-xs text-slate-500">
              <span>Words: {wordCount.toLocaleString()}</span>
              <span>Chars: {charCount.toLocaleString()}</span>
            </div>
          </div>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={8}
            placeholder="Paste or type your text here..."
            className={inputClass + ' resize-none'} />
          <div className="flex gap-2">
            <button onClick={() => fileRef.current?.click()}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white/[0.04] border border-white/[0.08] text-slate-500 hover:text-white transition-all">
              📁 Import File
            </button>
            <button onClick={() => { setInput('') }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white/[0.04] border border-white/[0.08] text-slate-500 hover:text-white transition-all">
              Clear
            </button>
            <input ref={fileRef} type="file" accept=".txt,.md,.csv" onChange={importFile} className="hidden" />
          </div>
        </div>

        {/* Local KPIs */}
        {input.trim().length >= 60 && (
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Originality', value: kpiOriginality, color: 'text-emerald-400' },
              { label: 'Sentence Variety', value: kpiVariety, color: 'text-blue-400' },
              { label: 'Readability', value: kpiFlesch, color: 'text-amber-400' },
              { label: 'N-gram Repeats', value: kpiNgram, color: 'text-red-400' },
            ].map(kpi => (
              <div key={kpi.label} className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 text-center">
                <div className={`text-lg font-bold ${kpi.color}`}>{kpi.value}</div>
                <div className="text-[10px] text-slate-500 mt-1">{kpi.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          {streaming ? (
            <button onClick={stop}
              className="flex-1 px-6 py-3 rounded-xl text-sm font-bold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all">
              ⏹ Stop
            </button>
          ) : (
            <button onClick={handleRun} disabled={!input.trim()}
              className="flex-1 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}>
              ▶ Run Analysis
            </button>
          )}
          <button onClick={copy} disabled={!output}
            className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all disabled:opacity-40 ${copied ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/[0.06] border-white/[0.08] text-slate-400 hover:text-white'}`}>
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
          <button onClick={download} disabled={!output}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all disabled:opacity-40">
            ⬇ Download
          </button>
        </div>

        {/* Status */}
        {status && (
          <div className={`p-3 rounded-xl text-sm ${status.includes('Error') ? 'bg-red-500/10 border border-red-500/20 text-red-400' : status.includes('Done') ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-white/[0.06] border border-white/[0.08] text-slate-400'}`}>
            {status}
          </div>
        )}

        {/* Output */}
        <div ref={resultRef} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          {output ? (
            <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">{output}</pre>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-3 opacity-20">🔍</div>
              <p className="text-sm text-slate-600 font-medium">AI analysis will stream here…</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
