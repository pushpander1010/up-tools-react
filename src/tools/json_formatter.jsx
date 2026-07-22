import useJumpToResult from '../hooks/useJumpToResult'
import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'

export default function json_formatter() {

  const { ref: resultRef, trigger, reset } = useJumpToResult()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [indent, setIndent] = useState(2)
  const [copied, setCopied] = useState(false)
  const [view, setView] = useState('input')

  const process = (action) => {
    let text = input.trim()
    if (!text) { setError('Please enter some JSON data'); return }

    // Auto-fix common issues
    // 1. If it looks like a JS object (unquoted keys), try to fix
    if (text.startsWith('{') && !text.startsWith('{"')) {
      text = text.replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":')
    }
    // 2. Single quotes to double quotes
    if (text.includes("'") && !text.includes('"')) {
      text = text.replace(/'/g, '"')
    }
    // 3. Trailing commas
    text = text.replace(/,\s*([}\]])/g, '$1')
    // 4. Remove JS comments
    text = text.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '')

    try {
      const parsed = JSON.parse(text)
      if (action === 'minify') {
        setOutput(JSON.stringify(parsed))
      } else {
        setOutput(JSON.stringify(parsed, null, indent))
      }
      setError('')
      setView('output')
      // Update input if we fixed it
      if (text !== input.trim()) setInput(text)
    } catch (e) {
      // Show helpful error with line info
      const lineMatch = e.message.match(/position (\d+)/)
      if (lineMatch) {
        const pos = parseInt(lineMatch[1])
        const lines = text.substring(0, pos).split('\n')
        setError(`Error at line ${lines.length}, column ${lines[lines.length-1].length}: ${e.message}`)
      } else {
        setError(`Invalid JSON: ${e.message}`)
      }
    }
  }

  const formatInput = () => {
    let text = input.trim()
    if (!text) return
    // Auto-fix
    text = text.replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":')
    text = text.replace(/'/g, '"')
    text = text.replace(/,\s*([}\]])/g, '$1')
    text = text.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '')
    try {
      const parsed = JSON.parse(text)
      setInput(JSON.stringify(parsed, null, 2))
      setError('')
    } catch (e) { setError(`Cannot fix: ${e.message}`) }
  }

  const copyOutput = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <ToolLayout
      title="JSON Formatter"
      desc="Prettify, validate, and minify JSON data. Auto-fixes common issues like unquoted keys."
      icon="🛠️" iconBg="rgba(6,182,212,0.08)"
      category="dev" slug="json-formatter"
      faq={[
        { q: 'What is JSON?', a: 'JSON (JavaScript Object Notation) is a lightweight data format used for APIs, config files, and data exchange.' },
        { q: 'Can I fix broken JSON?', a: 'Yes — the formatter auto-fixes common issues: unquoted keys, single quotes, trailing commas, and JS comments.' },
      ]}
      howItWorks={[
        'Paste your JSON data in the input area.',
        'Click "Prettify" to format with indentation, or "Minify" to compress.',
        'Auto-fixes common issues like unquoted keys and trailing commas.',
        'Copy the formatted output to clipboard.',
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
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'input' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' : 'bg-white/[0.06] text-slate-500 border border-white/8'}`}>
            Input
          </button>
          <button onClick={() => setView('output')} disabled={!output}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'output' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' : 'bg-white/[0.06] text-slate-500 border border-white/8 disabled:opacity-30'}`}>
            Output
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500">Indent:</label>
            <select value={indent} onChange={e => setIndent(Number(e.target.value))}
              className="bg-white/[0.06] border border-white/8 rounded-lg px-2 py-1 text-xs text-white outline-none">
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
          placeholder={view === 'input' ? 'Paste JSON here...\n\nAuto-fixes: unquoted keys, single quotes, trailing commas, JS comments' : 'Formatted output...'}
          rows={16}
          className={`w-full bg-black/20 border-2 rounded-2xl px-5 py-4 text-sm font-mono outline-none transition-all resize-none ${
            error ? 'border-red-500/40 text-red-400' : view === 'output' ? 'border-emerald-500/20 text-emerald-400' : 'border-white/8 text-white focus:border-cyan-500/40'
          }`} />

        {/* Error */}
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 font-mono">
            ❌ {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => process('prettify')}
            className="glow-btn px-5 py-2.5 rounded-xl text-sm"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
            ✨ Prettify
          </button>
          <button onClick={() => process('minify')}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/5 border border-white/8 text-slate-400 hover:text-white transition-all">
            📦 Minify
          </button>
          <button onClick={formatInput}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/5 border border-white/8 text-slate-400 hover:text-white transition-all">
            🔧 Auto-Fix
          </button>
          {output && (
            <button onClick={copyOutput}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/8 text-slate-400 hover:text-white'}`}>
              {copied ? '✓ Copied' : '📋 Copy'}
            </button>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
