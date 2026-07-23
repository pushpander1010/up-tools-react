import { useState, useCallback, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'
import useAIStream from '../hooks/useAIStream'

const TASKS = [
  { id: 'summarize', label: '📝 Summarize' },
  { id: 'rewrite', label: '🔄 Rewrite' },
  { id: 'translate', label: '🌐 Translate' },
  { id: 'keywords', label: '🏷️ Keywords' },
  { id: 'outline', label: '📋 Outline' },
  { id: 'seometa', label: '🔍 SEO Meta' },
  { id: 'improve', label: '✨ Improve' },
]

function buildPrompt(task, text, opts) {
  if (task === 'summarize') {
    return `You are a precise summarizer. Style: ${opts.style || 'brief'}. Max words: ${opts.maxWords || 180}. Use clear language.\n\n---\n${text}`
  }
  if (task === 'rewrite') {
    return `Rewrite the text in a ${opts.tone || 'Neutral'} tone. Constraints: ${opts.rules || 'keep meaning, increase clarity'}. Return only the rewritten text.\n\n---\n${text}`
  }
  if (task === 'translate') {
    return `Translate the text into ${opts.lang || 'Hindi'}. Maintain meaning and proper nouns. Return only the translation.\n\n---\n${text}`
  }
  if (task === 'keywords') {
    return `Extract top ${opts.topN || 15} keywords from the text${opts.phrases === 'Yes' ? ' including keyphrases' : ''}. Return a comma-separated list.\n\n---\n${text}`
  }
  if (task === 'outline') {
    return `Create a blog outline with depth level ${opts.depth || 2}. Use markdown headings. Include a short intro and conclusion.\n\n---\n${text}`
  }
  if (task === 'seometa') {
    return `From the text, generate:\n- SEO Title (<= 60 chars)\n- Meta Description (<= 155 chars)\n- 10 Keywords\nBrand: ${opts.brand || 'UpTools'}\nReturn as:\nTitle: ...\nDescription: ...\nKeywords: ...\n\n---\n${text}`
  }
  return `Improve the text for clarity, flow, and readability. Fix grammar. Return only the improved text.\n\n---\n${text}`
}

export default function ai_writer() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const { output, status, streaming, generate, stop } = useAIStream()
  const [input, setInput] = useState('')
  const [task, setTask] = useState('summarize')
  const [copied, setCopied] = useState(false)
  const fileRef = useRef(null)

  // Task-specific options
  const [style, setStyle] = useState('brief')
  const [maxWords, setMaxWords] = useState('180')
  const [tone, setTone] = useState('Neutral')
  const [rules, setRules] = useState('')
  const [lang, setLang] = useState('Hindi')
  const [topN, setTopN] = useState('15')
  const [phrases, setPhrases] = useState('Yes')
  const [depth, setDepth] = useState('2')
  const [brand, setBrand] = useState('UpTools')

  const charCount = input.length

  const handleRun = useCallback(() => {
    const text = input.trim()
    if (!text) return
    if (text.length > 30000) return

    const opts = { style, maxWords, tone, rules, lang, topN, phrases, depth, brand }
    const prompt = buildPrompt(task, text, opts)

    generate({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      systemPrompt: 'You are a helpful, concise writing assistant.',
    })
    jumpTo()
  }, [input, task, style, maxWords, tone, rules, lang, topN, phrases, depth, brand, generate, jumpTo])

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
    a.href = url; a.download = 'ai-output.txt'
    document.body.appendChild(a); a.click(); a.remove()
    URL.revokeObjectURL(url)
  }

  const importFile = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    const text = await f.text()
    setInput(text)
    e.target.value = ''
  }

  const inputClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600"
  const selectClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"
  const smallInput = "bg-black/20 border-2 border-white/[0.08] rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600"

  return (
    <ToolLayout
      title="AI Writing Assistant"
      desc="Summarize, rewrite, translate, extract keywords, generate outlines, and create SEO meta — all in one tool."
      icon="✍️" iconBg="rgba(99,102,241,0.08)"
      category="ai" slug="ai-writer"
      faq={[
        { q: "What tasks are available?", a: "Summarize, Rewrite, Translate, Extract Keywords, Create Outline, Generate SEO Meta, and Improve text." },
        { q: "Is there a text limit?", a: "Up to 30,000 characters per request." },
      ]}
      howItWorks={[
        "Paste or type your text, or import a file.",
        "Select a task (summarize, rewrite, translate, etc.).",
        "Click Run to get AI-processed output.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "AI Writing Assistant", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/ai-writer/",
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
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    : 'bg-white/[0.04] text-slate-500 border border-white/[0.08] hover:text-white'
                }`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Task Options */}
        {(task === 'summarize' || task === 'rewrite' || task === 'translate' || task === 'keywords' || task === 'outline' || task === 'seometa') && (
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
            <label className="block text-sm font-semibold text-slate-300 mb-3">Options</label>
            <div className="flex flex-wrap gap-3 items-end">
              {task === 'summarize' && <>
                <div><label className="block text-[10px] text-slate-500 mb-1">Style</label>
                  <select value={style} onChange={e => setStyle(e.target.value)} className={selectClass + ' w-32'}>
                    <option value="brief">Brief</option><option value="bullets">Bulleted</option><option value="detailed">Detailed</option>
                  </select></div>
                <div><label className="block text-[10px] text-slate-500 mb-1">Max Words</label>
                  <input type="number" value={maxWords} onChange={e => setMaxWords(e.target.value)} className={smallInput + ' w-24'} /></div>
              </>}
              {task === 'rewrite' && <>
                <div><label className="block text-[10px] text-slate-500 mb-1">Tone</label>
                  <select value={tone} onChange={e => setTone(e.target.value)} className={selectClass + ' w-32'}>
                    <option>Neutral</option><option>Friendly</option><option>Formal</option><option>Academic</option><option>Sales</option><option>Playful</option>
                  </select></div>
                <div><label className="block text-[10px] text-slate-500 mb-1">Constraints</label>
                  <input value={rules} onChange={e => setRules(e.target.value)} placeholder="e.g. shorter, active voice" className={smallInput + ' w-48'} /></div>
              </>}
              {task === 'translate' && (
                <div><label className="block text-[10px] text-slate-500 mb-1">Language</label>
                  <input value={lang} onChange={e => setLang(e.target.value)} className={smallInput + ' w-32'} /></div>
              )}
              {task === 'keywords' && <>
                <div><label className="block text-[10px] text-slate-500 mb-1">Top N</label>
                  <input type="number" value={topN} onChange={e => setTopN(e.target.value)} className={smallInput + ' w-20'} /></div>
                <div><label className="block text-[10px] text-slate-500 mb-1">Phrases</label>
                  <select value={phrases} onChange={e => setPhrases(e.target.value)} className={selectClass + ' w-20'}>
                    <option>Yes</option><option>No</option>
                  </select></div>
              </>}
              {task === 'outline' && (
                <div><label className="block text-[10px] text-slate-500 mb-1">Depth</label>
                  <select value={depth} onChange={e => setDepth(e.target.value)} className={selectClass + ' w-24'}>
                    <option value="2">H2 + H3</option><option value="3">H2 + H3 + H4</option>
                  </select></div>
              )}
              {task === 'seometa' && (
                <div><label className="block text-[10px] text-slate-500 mb-1">Brand</label>
                  <input value={brand} onChange={e => setBrand(e.target.value)} className={smallInput + ' w-32'} /></div>
              )}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-slate-300">Input Text *</label>
            <span className="text-xs text-slate-500">{charCount.toLocaleString()} chars</span>
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
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              ▶ Run
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
              <div className="text-4xl mb-3 opacity-20">✍️</div>
              <p className="text-sm text-slate-600 font-medium">AI output will stream here…</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
