import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'

// Prices = public list $ per 1M tokens, Sep 2026. Indicative — verify provider pages.
const MODELS = [
  // OpenAI
  { id: 'gpt56sol', name: 'GPT-5.6 Sol', provider: 'OpenAI', input: 4.0, output: 20.0, context: 400, intel: 89, speed: 78, open: false, best: 'Frontier reasoning, agents' },
  { id: 'gpt5', name: 'GPT-5', provider: 'OpenAI', input: 1.25, output: 10.0, context: 400, intel: 88, speed: 82, open: false, best: 'Coding, agents, reasoning' },
  { id: 'gpt5mini', name: 'GPT-5 mini', provider: 'OpenAI', input: 0.25, output: 2.0, context: 400, intel: 80, speed: 92, open: false, best: 'Cheap everyday tasks' },
  { id: 'gpt5nano', name: 'GPT-5 nano', provider: 'OpenAI', input: 0.05, output: 0.40, context: 400, intel: 72, speed: 97, open: false, best: 'Cheapest OpenAI bulk' },
  { id: 'gpt41', name: 'GPT-4.1', provider: 'OpenAI', input: 2.0, output: 8.0, context: 1000, intel: 82, speed: 84, open: false, best: 'Long-context coding' },
  { id: 'gpt41mini', name: 'GPT-4.1 mini', provider: 'OpenAI', input: 0.40, output: 1.60, context: 1000, intel: 78, speed: 93, open: false, best: 'Cheap long context' },
  { id: 'gpt4o', name: 'GPT-4o', provider: 'OpenAI', input: 2.50, output: 10.0, context: 128, intel: 80, speed: 85, open: false, best: 'Multimodal chat' },
  { id: 'gpt4omini', name: 'GPT-4o mini', provider: 'OpenAI', input: 0.15, output: 0.60, context: 128, intel: 74, speed: 95, open: false, best: 'Budget chat apps' },
  { id: 'o3', name: 'o3', provider: 'OpenAI', input: 2.0, output: 8.0, context: 200, intel: 87, speed: 55, open: false, best: 'Deep reasoning, math' },
  { id: 'o4mini', name: 'o4-mini', provider: 'OpenAI', input: 1.10, output: 4.40, context: 200, intel: 83, speed: 75, open: false, best: 'Fast reasoning' },
  // Anthropic
  { id: 'sonnet5', name: 'Claude Sonnet 5', provider: 'Anthropic', input: 3.0, output: 15.0, context: 1000, intel: 88, speed: 78, open: false, best: 'Newest Claude all-rounder' },
  { id: 'opus45', name: 'Claude Opus 4.5', provider: 'Anthropic', input: 5.0, output: 25.0, context: 200, intel: 87, speed: 65, open: false, best: 'Hardest reasoning, research' },
  { id: 'sonnet45', name: 'Claude Sonnet 4.5', provider: 'Anthropic', input: 3.0, output: 15.0, context: 1000, intel: 86, speed: 80, open: false, best: 'Coding, writing, agents' },
  { id: 'opus41', name: 'Claude Opus 4.1', provider: 'Anthropic', input: 15.0, output: 75.0, context: 200, intel: 86, speed: 60, open: false, best: 'Premium agentic coding' },
  { id: 'sonnet4', name: 'Claude Sonnet 4', provider: 'Anthropic', input: 3.0, output: 15.0, context: 200, intel: 84, speed: 82, open: false, best: 'Balanced coding/writing' },
  { id: 'haiku45', name: 'Claude Haiku 4.5', provider: 'Anthropic', input: 1.0, output: 5.0, context: 200, intel: 78, speed: 95, open: false, best: 'Fast cheap chat, support bots' },
  { id: 'haiku35', name: 'Claude Haiku 3.5', provider: 'Anthropic', input: 0.80, output: 4.0, context: 200, intel: 73, speed: 96, open: false, best: 'Legacy budget speed' },
  // Google
  { id: 'gemini31pro', name: 'Gemini 3.1 Pro', provider: 'Google', input: 1.50, output: 9.0, context: 1000, intel: 88, speed: 76, open: false, best: 'Newest Google reasoning' },
  { id: 'gemini3flash', name: 'Gemini 3 Flash', provider: 'Google', input: 0.50, output: 3.0, context: 1000, intel: 80, speed: 93, open: false, best: 'Fast cheap multimodal' },
  { id: 'gemini25pro', name: 'Gemini 2.5 Pro', provider: 'Google', input: 1.25, output: 10.0, context: 1000, intel: 86, speed: 78, open: false, best: 'Long docs, multimodal, math' },
  { id: 'gemini25flash', name: 'Gemini 2.5 Flash', provider: 'Google', input: 0.30, output: 2.50, context: 1000, intel: 78, speed: 94, open: false, best: 'High-volume apps, RAG' },
  { id: 'gemini25lite', name: 'Gemini 2.5 Flash-Lite', provider: 'Google', input: 0.10, output: 0.40, context: 1000, intel: 70, speed: 98, open: false, best: 'Cheapest bulk classification' },
  { id: 'gemini20flash', name: 'Gemini 2.0 Flash', provider: 'Google', input: 0.10, output: 0.40, context: 1000, intel: 74, speed: 96, open: false, best: 'Legacy budget speed' },
  { id: 'gemma327b', name: 'Gemma 3 27B', provider: 'Google', input: 0.10, output: 0.20, context: 128, intel: 72, speed: 90, open: true, best: 'Open efficient chat' },
  // xAI
  { id: 'grok4', name: 'Grok 4', provider: 'xAI', input: 3.0, output: 15.0, context: 256, intel: 85, speed: 75, open: false, best: 'Real-time X data, reasoning' },
  { id: 'grok3', name: 'Grok 3', provider: 'xAI', input: 3.0, output: 15.0, context: 131, intel: 82, speed: 78, open: false, best: 'X-grounded answers' },
  { id: 'grok3mini', name: 'Grok 3 mini', provider: 'xAI', input: 0.30, output: 0.50, context: 131, intel: 76, speed: 92, open: false, best: 'Cheap X-speed tasks' },
  // DeepSeek
  { id: 'deepseekv3', name: 'DeepSeek V3', provider: 'DeepSeek', input: 0.27, output: 1.10, context: 128, intel: 80, speed: 85, open: true, best: 'Open budget coding/math' },
  { id: 'deepseekr1', name: 'DeepSeek R1', provider: 'DeepSeek', input: 0.55, output: 2.19, context: 64, intel: 82, speed: 60, open: true, best: 'Open reasoning on budget' },
  // Meta
  { id: 'llama4mav', name: 'Llama 4 Maverick', provider: 'Meta', input: 0.25, output: 0.85, context: 1000, intel: 80, speed: 87, open: true, best: 'Open multimodal, long ctx' },
  { id: 'llama4scout', name: 'Llama 4 Scout', provider: 'Meta', input: 0.15, output: 0.45, context: 10000, intel: 76, speed: 90, open: true, best: 'Open ultra-long context' },
  { id: 'llama3370b', name: 'Llama 3.3 70B', provider: 'Meta', input: 0.35, output: 0.40, context: 128, intel: 78, speed: 88, open: true, best: 'Self-host, private deploys' },
  { id: 'llama31405b', name: 'Llama 3.1 405B', provider: 'Meta', input: 1.0, output: 1.0, context: 128, intel: 79, speed: 70, open: true, best: 'Biggest open model' },
  // Mistral
  { id: 'mistrallarge3', name: 'Mistral Large 3', provider: 'Mistral', input: 2.0, output: 6.0, context: 128, intel: 78, speed: 84, open: false, best: 'EU-hosted enterprise' },
  { id: 'mistralmed3', name: 'Mistral Medium 3', provider: 'Mistral', input: 0.40, output: 2.0, context: 128, intel: 75, speed: 90, open: false, best: 'EU mid-tier value' },
  { id: 'codestral', name: 'Codestral', provider: 'Mistral', input: 0.30, output: 0.90, context: 256, intel: 74, speed: 90, open: false, best: 'EU code specialist' },
  { id: 'mistrasmall3', name: 'Mistral Small 3', provider: 'Mistral', input: 0.10, output: 0.30, context: 128, intel: 71, speed: 95, open: true, best: 'Open edge/Latency tasks' },
  // Others
  { id: 'qwen3235b', name: 'Qwen3-235B', provider: 'Alibaba', input: 0.20, output: 0.80, context: 256, intel: 79, speed: 86, open: true, best: 'Open multilingual value' },
  { id: 'kimik2', name: 'Kimi K2', provider: 'Moonshot', input: 0.60, output: 2.50, context: 200, intel: 81, speed: 82, open: true, best: 'Open agentic coding' },
  { id: 'commandrplus', name: 'Command R+', provider: 'Cohere', input: 2.50, output: 10.0, context: 128, intel: 74, speed: 85, open: false, best: 'Enterprise RAG, citations' },
  { id: 'phi4', name: 'Phi-4', provider: 'Microsoft', input: 0.10, output: 0.30, context: 16, intel: 72, speed: 92, open: true, best: 'Tiny open on-device' },
  { id: 'o1', name: 'o1', provider: 'OpenAI', input: 15.00, output: 60.00, context: 200, intel: 83, speed: 50, open: false, best: 'PhD-level reasoning' },
  { id: 'o1mini', name: 'o1-mini', provider: 'OpenAI', input: 1.10, output: 4.40, context: 128, intel: 78, speed: 80, open: false, best: 'Cheap STEM reasoning' },
  { id: 'gpt45', name: 'GPT-4.5 Orion', provider: 'OpenAI', input: 75.00, output: 150.00, context: 128, intel: 81, speed: 70, open: false, best: 'Most creative chat' },
  { id: 'gpt5codex', name: 'GPT-5-Codex', provider: 'OpenAI', input: 1.25, output: 10.00, context: 400, intel: 87, speed: 80, open: false, best: 'Agentic coding specialist' },
  { id: 'sonnet46', name: 'Claude Sonnet 4.6', provider: 'Anthropic', input: 3.00, output: 15.00, context: 1000, intel: 87, speed: 79, open: false, best: 'Latest coding all-rounder' },
  { id: 'opus46', name: 'Claude Opus 4.6', provider: 'Anthropic', input: 5.00, output: 25.00, context: 200, intel: 88, speed: 63, open: false, best: 'Top Claude reasoning' },
  { id: 'fable5', name: 'Claude Fable 5', provider: 'Anthropic', input: 10.00, output: 50.00, context: 200, intel: 89, speed: 60, open: false, best: 'Flagship max capability' },
  { id: 'gemini15pro', name: 'Gemini 1.5 Pro', provider: 'Google', input: 1.25, output: 5.00, context: 2000, intel: 76, speed: 80, open: false, best: '2M-context analysis' },
  { id: 'gemini15flash', name: 'Gemini 1.5 Flash', provider: 'Google', input: 0.07, output: 0.30, context: 1000, intel: 72, speed: 95, open: false, best: 'Legacy ultra-cheap' },
  { id: 'gemma227b', name: 'Gemma 2 27B', provider: 'Google', input: 0.10, output: 0.15, context: 8, intel: 68, speed: 93, open: true, best: 'Tiny open efficient' },
  { id: 'grok41', name: 'Grok 4.1', provider: 'xAI', input: 3.00, output: 15.00, context: 2000, intel: 86, speed: 74, open: false, best: 'Big-context X reasoning' },
  { id: 'grokcodefast', name: 'Grok Code Fast 1', provider: 'xAI', input: 0.20, output: 1.50, context: 256, intel: 76, speed: 96, open: false, best: 'Cheap fast coding' },
  { id: 'deepseekv4', name: 'DeepSeek V4', provider: 'DeepSeek', input: 0.43, output: 0.87, context: 128, intel: 84, speed: 83, open: true, best: 'Newest open flagship' },
  { id: 'llama3170b', name: 'Llama 3.1 70B', provider: 'Meta', input: 0.30, output: 0.35, context: 128, intel: 76, speed: 89, open: true, best: 'Open workhorse' },
  { id: 'llama318b', name: 'Llama 3.1 8B', provider: 'Meta', input: 0.06, output: 0.10, context: 128, intel: 68, speed: 95, open: true, best: 'Smallest open Llama' },
  { id: 'mixtral8x22b', name: 'Mixtral 8x22B', provider: 'Mistral', input: 0.65, output: 0.65, context: 64, intel: 72, speed: 88, open: true, best: 'Open MoE value' },
  { id: 'mistral7b', name: 'Mistral 7B', provider: 'Mistral', input: 0.10, output: 0.25, context: 32, intel: 65, speed: 96, open: true, best: 'Featherweight open' },
  { id: 'devstral', name: 'Devstral Small', provider: 'Mistral', input: 0.10, output: 0.30, context: 128, intel: 73, speed: 94, open: true, best: 'Open code agent' },
  { id: 'qwen2572b', name: 'Qwen 2.5 72B', provider: 'Alibaba', input: 0.35, output: 0.40, context: 128, intel: 77, speed: 87, open: true, best: 'Open multilingual' },
  { id: 'qwen332b', name: 'Qwen3-32B', provider: 'Alibaba', input: 0.10, output: 0.30, context: 128, intel: 77, speed: 90, open: true, best: 'Open efficient hybrid' },
  { id: 'glm46', name: 'GLM-4.6', provider: 'Zhipu', input: 0.60, output: 2.20, context: 200, intel: 80, speed: 84, open: true, best: 'Open agentic coding' },
  { id: 'minimaxm2', name: 'MiniMax M2', provider: 'MiniMax', input: 0.30, output: 1.20, context: 200, intel: 79, speed: 85, open: false, best: 'Cheap agent model' },
  { id: 'novapro', name: 'Nova Pro', provider: 'Amazon', input: 0.80, output: 3.20, context: 300, intel: 77, speed: 86, open: false, best: 'AWS multimodal' },
  { id: 'novalite', name: 'Nova Lite', provider: 'Amazon', input: 0.06, output: 0.24, context: 300, intel: 70, speed: 95, open: false, best: 'AWS cheap fast' },
  { id: 'novamicro', name: 'Nova Micro', provider: 'Amazon', input: 0.03, output: 0.14, context: 128, intel: 65, speed: 98, open: false, best: 'AWS cheapest text' },
  { id: 'commandr', name: 'Command R', provider: 'Cohere', input: 0.15, output: 0.60, context: 128, intel: 70, speed: 90, open: false, best: 'Cheap RAG grounding' },
  { id: 'sonarpro', name: 'Sonar Pro', provider: 'Perplexity', input: 3.00, output: 15.00, context: 200, intel: 78, speed: 80, open: false, best: 'Search-grounded answers' },
  { id: 'sonar', name: 'Sonar', provider: 'Perplexity', input: 1.00, output: 1.00, context: 128, intel: 73, speed: 88, open: false, best: 'Cheap web Q&A' },
]

const PROVIDERS = ['All', ...new Set(MODELS.map(m => m.provider))]

function fmtCtx(k) { return k >= 1000 ? `${(k / 1000).toString().replace(/\.0$/, '')}M` : `${k}K` }
function costOf(m, inM, outM) { return m.input * inM + m.output * outM }
const byId = (id) => MODELS.find(m => m.id === id)

export default function ai_model_compare() {
  const [modelA, setModelA] = useState('gpt5')
  const [modelB, setModelB] = useState('sonnet45')
  const [provider, setProvider] = useState('All')
  const [sortKey, setSortKey] = useState('intel')
  const [sortDir, setSortDir] = useState(-1)
  const [inM, setInM] = useState(10)
  const [outM, setOutM] = useState(5)
  const [openOnly, setOpenOnly] = useState(false)

  const A = byId(modelA) || MODELS[0]
  const B = byId(modelB) || MODELS[1]

  const rows = useMemo(() => {
    let r = MODELS.filter(m => (provider === 'All' || m.provider === provider) && (!openOnly || m.open))
    return [...r].sort((a, b) => (a[sortKey] > b[sortKey] ? 1 : -1) * sortDir)
  }, [provider, sortKey, sortDir, openOnly])

  const toggleSort = (k) => {
    if (k === sortKey) setSortDir(d => -d)
    else { setSortKey(k); setSortDir(k === 'name' || k === 'provider' ? 1 : -1) }
  }

  const verdict = useMemo(() => {
    if (A.id === B.id) return 'Same model selected on both sides — pick two different models to compare.'
    const wins = []
    if (A.intel !== B.intel) wins.push(`🧠 Smarter: ${(A.intel > B.intel ? A : B).name} (${Math.max(A.intel, B.intel)} vs ${Math.min(A.intel, B.intel)})`)
    if (A.context !== B.context) wins.push(`📖 Bigger context: ${(A.context > B.context ? A : B).name} (${fmtCtx(Math.max(A.context, B.context))} vs ${fmtCtx(Math.min(A.context, B.context))})`)
    const cA = costOf(A, inM, outM), cB = costOf(B, inM, outM)
    if (cA !== cB) wins.push(`💰 Cheaper at your volume: ${(cA < cB ? A : B).name} ($${Math.min(cA, cB).toFixed(2)} vs $${Math.max(cA, cB).toFixed(2)}/mo)`)
    if (A.speed !== B.speed) wins.push(`⚡ Faster: ${(A.speed > B.speed ? A : B).name}`)
    return wins.join('  •  ')
  }, [A, B, inM, outM])

  const metricRows = [
    { l: 'Provider', v: m => m.provider },
    { l: 'Input $ / 1M', v: m => `$${m.input.toFixed(2)}`, raw: m => m.input, low: true },
    { l: 'Output $ / 1M', v: m => `$${m.output.toFixed(2)}`, raw: m => m.output, low: true },
    { l: 'Context window', v: m => fmtCtx(m.context), raw: m => m.context },
    { l: 'Intelligence /100', v: m => m.intel, raw: m => m.intel },
    { l: 'Speed /100', v: m => m.speed, raw: m => m.speed },
    { l: `Your cost: ${inM}M in + ${outM}M out`, v: m => `$${costOf(m, inM, outM).toFixed(2)}/mo`, raw: m => costOf(m, inM, outM), low: true },
    { l: 'License', v: m => (m.open ? 'Open weights' : 'Closed') },
    { l: 'Best for', v: m => m.best },
  ]

  const th = (label, k) => (
    <th onClick={() => toggleSort(k)} className="px-3 py-2.5 text-left text-xs font-bold text-slate-400 cursor-pointer hover:text-white whitespace-nowrap select-none">
      {label}{sortKey === k ? (sortDir === 1 ? ' ▲' : ' ▼') : ''}
    </th>
  )

  const costs = [...MODELS].map(m => ({ ...m, monthly: costOf(m, inM, outM) })).sort((a, b) => a.monthly - b.monthly)

  const dropdownCls = 'w-full bg-white/[0.06] border-2 border-white/10 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-indigo-500/50 [color-scheme:dark]'

  return (
    <ToolLayout
      title="AI Model Compare — Pricing, Intelligence & Context"
      desc="Compare 68 AI models side-by-side: API pricing per 1M tokens, intelligence score, context window, speed and best use. GPT, Claude, Gemini, Grok, DeepSeek, Llama, Mistral, Qwen, Kimi and more with monthly cost calculator."
      icon="🤖" iconBg="rgba(99,102,241,0.08)"
      category="ai" slug="ai-model-compare"
      faq={[
        { q: 'How many models are listed?', a: `68 models across ${PROVIDERS.length - 1} providers: OpenAI, Anthropic, Google, xAI, DeepSeek, Meta, Mistral, Alibaba, Moonshot, Cohere, Microsoft, Amazon, Perplexity, Zhipu and MiniMax.` },
        { q: 'Where do these prices come from?', a: 'Public provider list prices per 1M tokens as of September 2026 (OpenAI, Anthropic, Google, xAI, DeepSeek, Meta, Mistral and others). Prices change often — verify on the provider pricing page before budgeting.' },
        { q: 'What is the intelligence score?', a: 'A 0–100 composite based on public benchmarks (MMLU-Pro, SWE-bench, LMArena) around Sep 2026. Indicative only — test on your own task before choosing.' },
        { q: 'How is monthly cost calculated?', a: 'Monthly cost = (input $/1M × your input millions) + (output $/1M × your output millions). Caching, batch and tier discounts are not included.' },
        { q: 'Which model is cheapest?', a: 'Usually GPT-5 nano, Gemini Flash-Lite, Mistral Small 3 or DeepSeek V3 for bulk work. Use the calculator below with your own volumes.' },
        { q: 'Which model is smartest?', a: 'GPT-5.6 Sol, GPT-5, Claude Sonnet 5, Opus 4.5 and Gemini 3.1 Pro lead on reasoning and coding benchmarks. Pick by your task, not the score alone.' },
        { q: 'Is this AI Model Compare free?', a: 'Yes, completely free with no sign-up. Use it unlimited times on any device.' },
      ]}
      howItWorks={[
        'Pick Model A and Model B from the two dropdowns to compare head-to-head.',
        'Sort the full 68-model table by price, intelligence, context or speed.',
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
        {/* A vs B dropdowns */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="text-sm font-bold text-white mb-4">⚖️ Head-to-head — pick any two models</h3>
          <div className="flex items-stretch gap-3 flex-col sm:flex-row">
            <div className="flex-1">
              <label className="text-xs font-bold text-cyan-400 block mb-1.5">MODEL A</label>
              <select value={modelA} onChange={e => setModelA(e.target.value)} className={dropdownCls} style={{ borderColor: 'rgba(0,229,255,0.3)' }}>
                {MODELS.map(m => <option key={m.id} value={m.id}>{m.name} — {m.provider}</option>)}
              </select>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-lg font-extrabold text-slate-400 sm:pt-6">VS</span>
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold text-indigo-400 block mb-1.5">MODEL B</label>
              <select value={modelB} onChange={e => setModelB(e.target.value)} className={dropdownCls} style={{ borderColor: 'rgba(99,102,241,0.4)' }}>
                {MODELS.map(m => <option key={m.id} value={m.id}>{m.name} — {m.provider}</option>)}
              </select>
            </div>
          </div>

          {/* Comparison table */}
          <div className="mt-4 rounded-xl border border-white/10 overflow-x-auto">
            <table className="w-full text-sm min-w-[480px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-400">Metric</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-cyan-400">{A.name}</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-indigo-400">{B.name}</th>
                </tr>
              </thead>
              <tbody>
                {metricRows.map((row, i) => {
                  const va = row.raw ? row.raw(A) : null
                  const vb = row.raw ? row.raw(B) : null
                  const aWin = va !== null && vb !== null && va !== vb && (row.low ? va < vb : va > vb)
                  const bWin = va !== null && vb !== null && va !== vb && (row.low ? vb < va : vb > va)
                  return (
                    <tr key={i} className="border-b border-white/5">
                      <td className="px-4 py-2.5 text-xs font-bold text-slate-400">{row.l}</td>
                      <td className={`px-4 py-2.5 font-semibold ${aWin ? 'text-cyan-400' : 'text-slate-200'}`}>{row.v(A)}{aWin ? ' ★' : ''}</td>
                      <td className={`px-4 py-2.5 font-semibold ${bWin ? 'text-indigo-400' : 'text-slate-200'}`}>{row.v(B)}{bWin ? ' ★' : ''}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Verdict */}
          <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <h4 className="text-xs font-bold text-amber-400 mb-1.5">🏆 Verdict</h4>
            <p className="text-sm text-slate-300">{verdict}</p>
          </div>
        </div>

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
          <span className="text-xs text-slate-500 ml-auto">{rows.length} models</span>
        </div>

        {/* Full table */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead>
              <tr className="border-b border-white/10">
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
              {rows.map(m => {
                const hl = m.id === modelA || m.id === modelB
                return (
                  <tr key={m.id} onClick={() => (modelA === m.id ? setModelA(modelB) : modelB === m.id ? setModelB(modelA) : setModelB(m.id))}
                    title="Click to load into comparison"
                    className={`border-b border-white/5 hover:bg-white/[0.04] cursor-pointer ${hl ? 'bg-indigo-500/[0.07]' : ''}`}>
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
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500">Tip: click any row to load it into the A-vs-B comparison above.</p>

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
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {costs.map((m, i) => (
              <div key={m.id} className="flex items-center gap-3">
                <span className="w-40 truncate text-xs font-bold text-slate-200">{i === 0 ? '🏆 ' : ''}{m.name}</span>
                <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className={`h-full rounded-full ${i === 0 ? 'bg-emerald-400' : 'bg-indigo-400/60'}`} style={{ width: `${costs[costs.length - 1].monthly > 0 ? Math.max(3, (m.monthly / costs[costs.length - 1].monthly) * 100) : 3}%` }} />
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
