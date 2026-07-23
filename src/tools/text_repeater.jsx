import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const SEPARATORS = [
  { id: 'newline', label: '↵ Newline', value: '\n' },
  { id: 'comma', label: '﹐ Comma + Space', value: ', ' },
  { id: 'space', label: '␣ Space', value: ' ' },
  { id: 'pipe', label: '│ Pipe', value: ' | ' },
  { id: 'tab', label: '⇥ Tab', value: '\t' },
  { id: 'custom', label: '✏️ Custom…', value: '' },
]

const CASES = [
  { id: 'asis', label: 'As-Is (no change)' },
  { id: 'upper', label: 'UPPERCASE' },
  { id: 'lower', label: 'lowercase' },
  { id: 'title', label: 'Title Case' },
  { id: 'alt', label: 'aLtErNaTiNg CaSe' },
]

function applyCase(text, caseType) {
  if (caseType === 'upper') return text.toUpperCase()
  if (caseType === 'lower') return text.toLowerCase()
  if (caseType === 'title') return text.replace(/\b\w/g, c => c.toUpperCase())
  if (caseType === 'alt') {
    let i = 0
    return text.replace(/[a-zA-Z]/g, c => (i++ % 2 === 0) ? c.toLowerCase() : c.toUpperCase())
  }
  return text
}

export default function text_repeater() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [input, setInput] = useState('')
  const [count, setCount] = useState(5)
  const [sepType, setSepType] = useState('newline')
  const [customSep, setCustomSep] = useState('---')
  const [caseType, setCaseType] = useState('asis')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const generate = useCallback(() => {
    if (!input.trim()) return
    const sep = sepType === 'custom' ? customSep : SEPARATORS.find(s => s.id === sepType)?.value || '\n'
    const processed = applyCase(input, caseType)
    const result = Array(count).fill(processed).join(sep)
    setOutput(result)
  }, [input, count, sepType, customSep, caseType])

  const stats = output ? {
    chars: output.length.toLocaleString(),
    words: output.trim() ? output.trim().split(/\s+/).length.toLocaleString() : '0',
    lines: output.split('\n').length.toLocaleString(),
  } : null

  const copy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const download = () => {
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'repeated-text.txt'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <ToolLayout
      title="Text Repeater"
      desc="Repeat any text 1–1000× with custom separators and case transforms. Copy or download instantly."
      icon="🔁" iconBg="rgba(99,102,241,0.08)"
      category="text" slug="text-repeater"
      faq={[
        { q: 'What is Text Repeater?', a: 'Repeat any text 1–1000 times with custom separators (newline, comma, space, pipe). Generate repeated content with case options. Copy or download.' },
        { q: 'What separators are available?', a: 'Newline, Comma + Space, Space, Pipe, Tab, or a custom separator you define.' },
      ]}
      howItWorks={[
        'Enter the text you want to repeat.',
        'Set the repeat count (1–1000), separator, and case transform.',
        'Click Generate or let it auto-update (live mode for ≤100 repeats).',
        'Copy to clipboard or download as .txt file.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Text Repeater", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/text-repeater/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <label className="text-xs font-semibold text-slate-500 mb-2 block">Text to Repeat</label>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder="Type or paste the text you want to repeat…"
            rows={4}
            className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 resize-none" />
        </div>

        {/* Controls */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 space-y-4">
          <h3 className="text-sm font-bold text-slate-300">⚙️ Options</h3>

          {/* Repeat count */}
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-2 block">
              Repeat Count: <span className="text-indigo-400 font-bold">{count}</span>
            </label>
            <div className="flex items-center gap-3">
              <input type="range" min="1" max="1000" value={count}
                onChange={e => setCount(parseInt(e.target.value))}
                className="flex-1 h-2 rounded-full appearance-none bg-white/10 accent-indigo-500" />
              <input type="number" min="1" max="1000" value={count}
                onChange={e => { const v = Math.max(1, Math.min(1000, parseInt(e.target.value) || 1)); setCount(v) }}
                className="w-20 bg-black/20 border-2 border-white/[0.08] rounded-xl px-3 py-2 text-sm text-center font-mono text-white outline-none focus:border-indigo-500/40" />
            </div>
          </div>

          {/* Separator + Case */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-2 block">Separator</label>
              <select value={sepType} onChange={e => setSepType(e.target.value)}
                className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/40">
                {SEPARATORS.map(s => <option key={s.id} value={s.id} className="bg-gray-900">{s.label}</option>)}
              </select>
              {sepType === 'custom' && (
                <input type="text" value={customSep} onChange={e => setCustomSep(e.target.value)}
                  placeholder='e.g. --- or " | "'
                  className="w-full mt-2 bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-sm font-mono text-white outline-none focus:border-indigo-500/40 placeholder:text-slate-600" />
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-2 block">Case Transform</label>
              <select value={caseType} onChange={e => setCaseType(e.target.value)}
                className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/40">
                {CASES.map(c => <option key={c.id} value={c.id} className="bg-gray-900">{c.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button onClick={() => { generate(); jumpTo() }}
          className="glow-btn px-6 py-3 rounded-xl text-sm w-full"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
          🔄 Generate Repeated Text
        </button>

        {/* Output */}
        {output && (
          <div ref={resultRef} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 space-y-3"
            style={{ animation: 'slideUp 0.3s ease-out' }}>
            {output.length > 100000 && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-400">
                ⚠️ Output exceeds 100,000 characters — large text may slow down some browsers.
              </div>
            )}
            {stats && (
              <div className="flex gap-3 text-xs">
                <span className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold">{stats.chars} chars</span>
                <span className="px-3 py-1 rounded-lg bg-purple-500/10 text-purple-400 font-bold">{stats.words} words</span>
                <span className="px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 font-bold">{stats.lines} lines</span>
              </div>
            )}
            <textarea value={output} readOnly rows={8}
              className="w-full bg-black/20 border-2 border-indigo-500/20 rounded-xl px-4 py-3 text-sm font-mono text-white resize-none" />
            <div className="flex gap-2">
              <button onClick={copy}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/[0.08] text-slate-400 hover:text-white'}`}>
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
              <button onClick={download}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white/5 border border-white/[0.08] text-slate-400 hover:text-white transition-all">
                📥 Download .txt
              </button>
            </div>
          </div>
        )}

        {!output && (
          <div ref={resultRef} className="text-center py-12 rounded-2xl border-2 border-dashed border-white/[0.08] bg-white/[0.02]">
            <div className="text-4xl mb-3 opacity-20">🔁</div>
            <p className="text-sm text-slate-600 font-medium">Enter text and click Generate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
