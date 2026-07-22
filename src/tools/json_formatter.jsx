import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'

export default function json_formatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [indent, setIndent] = useState(2)
  const [copied, setCopied] = useState(false)
  const [view, setView] = useState('input') // 'input' | 'output'

  const prettyPrint = () => {
    try {
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, indent)
      setOutput(formatted)
      setError('')
      setView('output')
    } catch (e) {
      setError(e.message)
      setOutput('')
    }
  }

  const minify = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setError('')
      setView('output')
    } catch (e) {
      setError(e.message)
    }
  }

  const copyOutput = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const formatInput = () => {
    try {
      const parsed = JSON.parse(input)
      setInput(JSON.stringify(parsed, null, 2))
      setError('')
    } catch (e) { setError(e.message) }
  }

  return (
    <ToolLayout
      title="JSON Formatter"
      desc="Prettify, validate, and minify JSON data. Format with custom indentation."
      icon="🛠️" iconBg="rgba(6,182,212,0.08)"
      category="dev" slug="json-formatter"
      faq={[
        { q: 'What is JSON?', a: 'JSON (JavaScript Object Notation) is a lightweight data format used for APIs, config files, and data exchange.' },
        { q: 'Why do I need to format JSON?', a: 'Minified JSON is hard to read. Formatting adds indentation and line breaks for readability.' },
      ]}
      howItWorks={[
        'Paste your JSON data in the input area.',
        'Click "Prettify" to format with indentation, or "Minify" to compress.',
        'Copy the formatted output to clipboard.',
        'If there\'s a syntax error, the line number and message are shown.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "JSON Formatter", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/json-formatter/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Tabs */}
        <div className="flex gap-2">
          <button onClick={() => setView('input')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'input' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' : 'bg-white/[0.03] text-slate-500 border border-white/6'}`}>
            Input
          </button>
          <button onClick={() => setView('output')} disabled={!output}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'output' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' : 'bg-white/[0.03] text-slate-500 border border-white/6 disabled:opacity-30'}`}>
            Output
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500">Indent:</label>
            <select value={indent} onChange={e => setIndent(Number(e.target.value))}
              className="bg-white/[0.03] border border-white/6 rounded-lg px-2 py-1 text-xs text-white outline-none">
              <option value={2}>2</option>
              <option value={4}>4</option>
              <option value={8}>8</option>
            </select>
          </div>
        </div>

        {/* Editor */}
        <textarea
          value={view === 'input' ? input : output}
          onChange={e => { if (view === 'input') { setInput(e.target.value); setError('') } }}
          readOnly={view === 'output'}
          placeholder={view === 'input' ? 'Paste your JSON here...' : 'Formatted output will appear here...'}
          rows={16}
          className={`w-full bg-black/20 border-2 rounded-2xl px-5 py-4 text-sm font-mono outline-none transition-all duration-300 resize-none ${
            error ? 'border-red-500/40 text-red-400' : view === 'output' ? 'border-emerald-500/20 text-emerald-400' : 'border-white/8 text-white focus:border-cyan-500/40'
          }`} />

        {/* Error */}
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
            ❌ {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <button onClick={prettyPrint}
            className="glow-btn px-5 py-2.5 rounded-xl text-sm"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
            ✨ Prettify
          </button>
          <button onClick={minify}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/5 border border-white/8 text-slate-400 hover:text-white transition-all">
            📦 Minify
          </button>
          <button onClick={formatInput}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/5 border border-white/8 text-slate-400 hover:text-white transition-all">
            🔧 Fix Input
          </button>
          {output && (
            <button onClick={copyOutput}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/8 text-slate-400 hover:text-white'}`}>
              {copied ? '✓ Copied' : '📋 Copy Output'}
            </button>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
