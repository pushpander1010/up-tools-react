import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'

const MODELS = [
  { id: 'gpt5', name: 'GPT-5', provider: 'OpenAI', input: 1.25, output: 10.0, context: 400, intel: 88, speed: 82, open: false, best: 'Coding, agents, reasoning' },
  { id: 'gpt5mini', name: 'GPT-5 mini', provider: 'OpenAI', input: 0.25, output: 2.0, context: 400, intel: 80, speed: 92, open: false, best: 'Cheap everyday tasks' },
  { id: 'sonnet45', name: 'Claude Sonnet 4.5', provider: 'Anthropic', input: 3.0, output: 15.0, context: 1000, intel: 86, speed: 80, open: false, best: 'Coding, writing, agents' },
  { id: 'opus45', name: 'Claude Opus 4.5', provider: 'Anthropic', input: 5.0, output: 25.0, context: 200, intel: 87, speed: 65, open: false, best: 'Hardest reasoning, research' },
  { id: 'haiku45', name: 'Claude Haiku 4.5', provider: 'Anthropic', input: 1.0, output: 5.0, context: 200, intel: 78, speed: 95, open: false, best: 'Fast cheap chat, support bots' },
  { id: 'gemini25pro', name: 'Gemini 2.5 Pro', provider: 'Google', input: 1.25, output: 10.0, context: 1000, intel: 86, speed: 78, open: false, best: 'Long docs, multimodal, math' },
  { id: 'gemini25flash', name: 'Gemini 2.5 Flash', provider: 'Google', input: 0.30, output: 2.50, context: 1000, intel: 78, speed: 94, open: false, best: 'High-volume apps, RAG' },
  { id: 'gemini25lite', name: 'Gemini 2.5 Flash-Lite', provider: 'Google', input: 0.10, output: 0.40, context: 1000, intel: 70, speed: 98, open: false, best: 'Cheapest bulk classification' },
  { id: 'grok4', name: 'Grok 4', provider: 'xAI', input: 3.0, output: 15.0, context: 256, intel: 85, speed: 75, open: false, best: 'Real-time X data, reasoning' },
  { id: 'deepseekv3', name: 'DeepSeek V3', provider: 'DeepSeek', input: 0.27, output: 1.10, context: 128, intel: 80, speed: 85, open: true, best: 'Open budget coding/math' },
  { id: 'llama33', name: 'Llama 3.3 70B', provider: 'Meta', input: 0.35, output: 0.40, context: 128, intel: 78, speed: 88, open: true, best: 'Self-host, private deploys' },
  { id: 'mistrallarge', name: 'Mistral Large 3', provider: 'Mistral', input: 2.0, output: 6.0, context: 128, intel: 78, speed: 84, open: false, best: 'EU-hosted enterprise' },
]

const PROVIDERS = ['All', ...new Set(MODELS.map(m => m.provider))]

function fmtCtx(k) { return k >= 1000 ? `${(k / 1000).toString().replace(/\.0$/, '')}M` : `${k}K` }
function costOf(m, inM, outM) { return m.input * inM + m.output * outM }

export default function ai_model_compare() {
  const [provider, setProvider] = useState('All')
  const [sortKey, setSortKey] = useState('intel')
  const [sortDir, setSortDir] = useState(-1)
  const [picked, setPicked] = useState(['gpt5', 'sonnet45', 'gemini25pro'])
  const [inM, setInM] = useState(10)
  const [outM, setOutM] = useState(5)
  const [openOnly, setOpenOnly] = useState(false)

  const rows = useMemo(() => {
    let r = MODELS.filter(m => (provider === 'All' || m.provider === provider) && (!openOnly || m.open))
    r = [...r].sort((a, b) => (a[sortKey] > b[sortKey] ? 1 : -1) * sortDir)
    return r
  }, [provider, sortKey, sortDir, openOnly])

  const toggleSort = (k) => {
    if (k === sortKey) setSortDir(d => -d)
    else { setSortKey(k); setSortDir(k === 'name' ? 1 : -1) }
  }

  const togglePick = (id) => {
    setPicked(p => p.includes(id) ? p.filter(x => x !== id) : (p.length >= 3 ? [...p.slice(1), id] : [...p, id]))
  }

  const compared = picked.map(id => MODELS.find(m => m.id === id)).filter(Boolean)
  const costs = [...MODELS].map(m => ({ ...m, monthly: costOf(m, inM, outM) })).sort((a, b) => a.monthly - b.monthly)
  const cheapest = costs[0]

  const th = (label, k) => (
    <th onClick={() => toggleSort(k)} className="px-3 py-2.5 text-left text-xs font-bold text-slate-400 cursor-pointer hover:text-white whitespace-nowrap select-none">
      {label}{sortKey === k ? (sortDir === 1 ? ' ▲' : ' ▼') : ''}
    </th>
  )

  return (
    <ToolLayout
      title="AI Model Compare — Pricing, Intelligence & Context"
      desc="Compare AI models side-by-side: API pricing per 1M tokens, intelligence score, context window, speed and best use. GPT, Claude, Gemini, Grok, DeepSeek, Llama, Mistral with monthly cost calculator."
      icon="🤖" iconBg="rgba(99,102,241,0.08)"
      category="ai" slug="ai-model-compare"
      faq={[
        { q: 'Where do these prices come from?', a: 'Public provider list prices per 1M tokens as of September 2026 (OpenAI, Anthropic, Google, xAI, DeepSeek, Meta, Mistral). Prices change often — verify on the provider pricing page before budgeting.' },
        { q: 'What is the intelligence score?', a: 'A 0–100 composite based on public benchmarks (MMLU-Pro, SWE-bench, LMArena) around Sep 2026. Indicative only — test on your own task before choosing.' },
        { q: 'How is monthly cost calculated?', a: 'Monthly cost = (input $/1M × your input millions) + (output $/1M × your output millions). Caching, batch and tier discounts are not included.' },
        { q: 'Which model is cheapest?', a: 'Usually Gemini 2.5 Flash-Lite, DeepSeek V3 or Llama 3.3 70B for bulk work. Use the calculator below with your own volumes.' },
        { q: 'Which model is smartest?', a: 'GPT-5, Claude Opus 4.5, Sonnet 4.5 and Gemini 2.5 Pro lead on reasoning and coding benchmarks. Pick by your task, not the score alone.' },
        { q: 'Is this AI Model Compare free?', a: 'Yes, completely free with no sign-up. Use it unlimited times on any device.' },
      ]}
      howItWorks={[
        'Tick up to 3 models to compare side-by-side.',
        'Sort the full table by price, intelligence, context or speed.',
        'Enter your monthly token volumes to see cheapest-first costs.',
      ]}
      schema={{
        '@context': 'https://schema.org', '@type': 'SoftwareApplication',
        name: 'AI Model Compare — Pricing, Intelligence & Context',
        url: 'https://www.uptools.in/ai-model-compare/',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      }}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {PROVIDERS.map(p => (
            <button key={p} onClick={() => setProvider(p)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${provider === p ? 'bg-indigo-500 text-white' : 'bg-white/[0.05] text-slate-300 border border-white/10 hover:text-white'}`}>
              {p}
            </button>
          ))}
          <button onClick={() => setOpenOnly(o => !o)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${openOnly ? 'bg-emerald-500 text-white' : 'bg-white/[0.05] text-slate-300 border border-white/10 hover:text-white'}`}>
            {openOnly ? '✓ Open weights' : 'Open weights'}
          </button>
        </div>

        {/* Side-by-side */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
          <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">⚖️ Side-by-side (pick up to 3 below)</h3>
            <span className="text-xs text-slate-400">{compared.length}/3 selected</span>
          </div>
          {compared.length === 0 ? (
            <p className="px-5 py-6 text-sm text-slate-400">Tick the checkboxes in the table to compare models here.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[560px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-400">Metric</th>
                    {compared.map(m => (
                      <th key={m.id} className="px-4 py-3 text-left text-xs font-bold text-white">{m.name}<br /><span className="font-medium text-slate-400">{m.provider}</span></th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { l: 'Input $ / 1M', v: m => `$${m.input.toFixed(2)}`, best: arr => Math.min(...arr) },
                    { l: 'Output $ / 1M', v: m => `$${m.output.toFixed(2)}`, best: arr => Math.min(...arr) },
                    { l: 'Context', v: m => fmtCtx(m.context), raw: m => m.context, best: arr => Math.max(...arr) },
                    { l: 'Intelligence /100', v: m => m.intel, best: arr => Math.max(...arr) },
                    { l: 'Speed /100', v: m => m.speed, best: arr => Math.max(...arr) },
                    { l: `Cost for ${inM}M in + ${outM}M out`, v: m => `$${costOf(m, inM, outM).toFixed(2)}`, raw: m => costOf(m, inM, outM), best: arr => Math.min(...arr) },
                    { l: 'License', v: m => (m.open ? 'Open weights' : 'Closed') },
                    { l: 'Best for', v: m => m.best },
                  ].map((row, i) => {
                    const vals = compared.map(m => row.raw ? row.raw(m) : null)
                    return (
                      <tr key={i} className="border-b border-white/5">
                        <td className="px-4 py-2.5 text-xs font-bold text-slate-400">{row.l}</td>
                        {compared.map((m, j) => {
                          const isBest = compared.length > 1 && row.best && row.raw && vals[j] === row.best(vals)
                          return <td key={m.id} className={`px-4 py-2.5 font-semibold ${isBest ? 'text-emerald-400' : 'text-slate-200'}`}>{row.v(m)}{isBest ? ' ★' : ''}</td>
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Full table */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-3 py-2.5 text-left text-xs font-bold text-slate-400">✓</th>
                {th('Model', 'name')}
                {th('Provider', 'provider')}
                {th('In $/1M', 'input')}
                {th('Out $/1M', 'output')}
                {th('Context', 'context')}
                {th('Intel', 'intel')}
                {th('Speed', 'speed')}
                <th className="px-3 py-2.5 text-left text-xs font-bold text-slate-400">Best for</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(m => (
                <tr key={m.id} className={`border-b border-white/5 hover:bg-white/[0.02] ${picked.includes(m.id) ? 'bg-indigo-500/[0.07]' : ''}`}>
                  <td className="px-3 py-2.5">
                    <input type="checkbox" checked={picked.includes(m.id)} onChange={() => togglePick(m.id)} className="w-4 h-4 accent-indigo-500" aria-label={`Compare ${m.name}`} />
                  </td>
                  <td className="px-3 py-2.5 font-bold text-white whitespace-nowrap">{m.name} {m.open && <span className="ml-1 text-[10px] font-bold text-emerald-400 border border-emerald-500/30 rounded px-1 py-0.5">OPEN</span>}</td>
                  <td className="px-3 py-2.5 text-slate-300">{m.provider}</td>
                  <td className="px-3 py-2.5 text-slate-200 font-semibold">${m.input.toFixed(2)}</td>
                  <td className="px-3 py-2.5 text-slate-200 font-semibold">${m.output.toFixed(2)}</td>
                  <td className="px-3 py-2.5 text-slate-200">{fmtCtx(m.context)}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 h-1.5 rounded-full bg-white/10 overflow-hidden"><div className="h-full rounded-full bg-indigo-400" style={{ width: `${m.intel}%` }} /></div>
                      <span className="text-xs font-bold text-slate-200">{m.intel}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-slate-200 font-semibold">{m.speed}</td>
                  <td className="px-3 py-2.5 text-xs text-slate-400">{m.best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cost calculator */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5">
          <h3 className="text-sm font-bold text-emerald-400 mb-1">💰 Monthly cost calculator</h3>
          <p className="text-xs text-slate-400 mb-4">Enter your volumes in millions of tokens. Cheapest first.</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <label className="block">
              <span className="text-xs font-bold text-slate-300">Input (M tokens)</span>
              <input type="number" min="0" value={inM} onChange={e => setInM(Math.max(0, Number(e.target.value)))}
                className="mt-1 w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-white font-bold outline-none focus:border-emerald-500/50 [color-scheme:dark]" />
            </label>
            <label className="block">
              <span className="text-xs font-bold text-slate-300">Output (M tokens)</span>
              <input type="number" min="0" value={outM} onChange={e => setOutM(Math.max(0, Number(e.target.value)))}
                className="mt-1 w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-white font-bold outline-none focus:border-emerald-500/50 [color-scheme:dark]" />
            </label>
          </div>
          <div className="space-y-2">
            {costs.map((m, i) => (
              <div key={m.id} className="flex items-center gap-3">
                <span className="w-40 truncate text-xs font-bold text-slate-200">{i === 0 ? '🏆 ' : ''}{m.name}</span>
                <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className={`h-full rounded-full ${i === 0 ? 'bg-emerald-400' : 'bg-indigo-400/60'}`} style={{ width: `${cheapest.monthly > 0 ? Math.max(3, (m.monthly / costs[costs.length - 1].monthly) * 100) : 3}%` }} />
                </div>
                <span className={`w-24 text-right text-xs font-bold ${i === 0 ? 'text-emerald-400' : 'text-slate-300'}`}>${m.monthly.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 mt-4">Prices: public list prices Sep 2026, excludes caching/batch discounts. Intelligence scores indicative — verify provider pages before budgeting.</p>
        </div>
      </div>
    </ToolLayout>
  )
}
