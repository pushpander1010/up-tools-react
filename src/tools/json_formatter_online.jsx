import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

function countKeys(obj) {
  if (obj === null || typeof obj !== 'object') return 0
  let count = 0
  const items = Array.isArray(obj) ? obj : Object.keys(obj)
  items.forEach(item => {
    if (!Array.isArray(obj)) count++
    const val = Array.isArray(obj) ? item : obj[item]
    count += countKeys(val)
  })
  return count
}

function getDepth(obj) {
  if (obj === null || typeof obj !== 'object') return 0
  let maxDepth = 0
  const items = Array.isArray(obj) ? obj : Object.values(obj)
  items.forEach(val => {
    const d = getDepth(val)
    if (d > maxDepth) maxDepth = d
  })
  return maxDepth + 1
}

function renderTree(obj, indent = '', isLast = true, key) {
  let html = ''
  const connector = isLast ? '└─ ' : '├─ '
  const childIndent = indent + (isLast ? '   ' : '│  ')

  if (obj === null) {
    html += indent + connector + (key !== undefined ? `<span style="color:#94a3b8">${key}</span>: ` : '') + `<span style="color:#64748b">null</span>\n`
  } else if (typeof obj === 'boolean') {
    html += indent + connector + (key !== undefined ? `<span style="color:#94a3b8">${key}</span>: ` : '') + `<span style="color:#f59e0b">${obj}</span>\n`
  } else if (typeof obj === 'number') {
    html += indent + connector + (key !== undefined ? `<span style="color:#94a3b8">${key}</span>: ` : '') + `<span style="color:#6366f1">${obj}</span>\n`
  } else if (typeof obj === 'string') {
    const display = obj.length > 80 ? obj.substring(0, 80) + '...' : obj
    html += indent + connector + (key !== undefined ? `<span style="color:#94a3b8">${key}</span>: ` : '') + `<span style="color:#22c55e">"${display.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}"</span>\n`
  } else if (Array.isArray(obj)) {
    if (obj.length === 0) {
      html += indent + connector + (key !== undefined ? `<span style="color:#94a3b8">${key}</span>: ` : '') + '[]\n'
    } else {
      const label = key !== undefined ? `<span style="color:#94a3b8">${key}</span>: ` : ''
      const id = 'n' + Math.random().toString(36).substr(2, 9)
      html += indent + connector + label + `<span class="cursor-pointer text-indigo-400 hover:text-indigo-300" onclick="this.parentElement.nextElementSibling?.classList.toggle('hidden');this.textContent=this.textContent.startsWith('▼')?'▶ Array [${obj.length}] (collapsed)':'▼ Array [${obj.length}]'">▼ Array [${obj.length}]</span>\n`
      html += indent + '<div>\n'
      obj.forEach((item, i) => { html += renderTree(item, childIndent, i === obj.length - 1) })
      html += indent + '</div>\n'
    }
  } else if (typeof obj === 'object') {
    const keys = Object.keys(obj)
    if (keys.length === 0) {
      html += indent + connector + (key !== undefined ? `<span style="color:#94a3b8">${key}</span>: ` : '') + '{}\n'
    } else {
      const label = key !== undefined ? `<span style="color:#94a3b8">${key}</span>: ` : ''
      const id = 'n' + Math.random().toString(36).substr(2, 9)
      html += indent + connector + label + `<span class="cursor-pointer text-indigo-400 hover:text-indigo-300" onclick="this.parentElement.nextElementSibling?.classList.toggle('hidden');this.textContent=this.textContent.startsWith('▼')?'▶ Object {${keys.length} keys} (collapsed)':'▼ Object {${keys.length} keys}'">▼ Object {${keys.length} keys}</span>\n`
      html += indent + '<div>\n'
      keys.forEach((k, i) => { html += renderTree(obj[k], childIndent, i === keys.length - 1, k) })
      html += indent + '</div>\n'
    }
  }
  return html
}

export default function json_formatter_online() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [treeView, setTreeView] = useState(false)
  const [treeHtml, setTreeHtml] = useState('')
  const [status, setStatus] = useState(null) // { ok, msg }
  const [stats, setStats] = useState({ chars: 0, bytes: 0, depth: 0, keys: 0 })
  const [copied, setCopied] = useState(false)

  const updateStats = useCallback((text, obj) => {
    setStats({
      chars: text.length.toLocaleString(),
      bytes: new Blob([text]).size.toLocaleString(),
      depth: obj !== null && obj !== undefined ? getDepth(obj) : '-',
      keys: obj !== null && obj !== undefined ? countKeys(obj).toLocaleString() : '-'
    })
  }, [])

  const formatJSON = () => {
    const raw = input.trim()
    if (!raw) return
    try {
      const parsed = JSON.parse(raw)
      const formatted = JSON.stringify(parsed, null, 2)
      setOutput(formatted)
      setTreeView(false)
      updateStats(formatted, parsed)
      setStatus({ ok: true, msg: `JSON formatted successfully (${formatted.length.toLocaleString()} chars)` })
    } catch (e) {
      setStatus({ ok: false, msg: 'Parse Error: ' + e.message })
      setOutput('')
    }
  }

  const minifyJSON = () => {
    const raw = input.trim()
    if (!raw) return
    try {
      const parsed = JSON.parse(raw)
      const minified = JSON.stringify(parsed)
      setOutput(minified)
      setTreeView(false)
      updateStats(minified, parsed)
      setStatus({ ok: true, msg: `JSON minified successfully (${minified.length.toLocaleString()} chars)` })
    } catch (e) {
      setStatus({ ok: false, msg: 'Parse Error: ' + e.message })
      setOutput('')
    }
  }

  const validateJSON = () => {
    const raw = input.trim()
    if (!raw) return
    try {
      const parsed = JSON.parse(raw)
      updateStats(raw, parsed)
      setStatus({ ok: true, msg: `Valid JSON! (${countKeys(parsed)} keys, depth ${getDepth(parsed)})` })
    } catch (e) {
      setStatus({ ok: false, msg: 'Invalid JSON: ' + e.message })
    }
  }

  const toggleTree = () => {
    const raw = input.trim()
    if (!raw) return
    try {
      const parsed = JSON.parse(raw)
      updateStats(raw, parsed)
      if (treeView) {
        setTreeView(false)
      } else {
        setTreeView(true)
        setTreeHtml(renderTree(parsed))
      }
    } catch (e) {
      setStatus({ ok: false, msg: 'Parse Error: ' + e.message })
    }
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
    setTreeHtml('')
    setTreeView(false)
    setStatus(null)
    setStats({ chars: 0, bytes: 0, depth: 0, keys: 0 })
  }

  const copyOutput = () => {
    const text = output || treeHtml.replace(/<[^>]+>/g, '')
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const downloadJSON = () => {
    if (!output) return
    const blob = new Blob([output], { type: 'application/json;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'formatted.json'
    document.body.appendChild(a); a.click(); a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <ToolLayout
      title="JSON Formatter Online"
      desc="Format, beautify, minify, and validate JSON instantly. Copy to clipboard, tree view."
      icon="📦" iconBg="rgba(99,102,241,0.08)"
      category="dev" slug="json-formatter-online"
      faq={[
        { q: 'What is JSON formatting?', a: 'JSON formatting (beautifying/pretty-printing) adds proper indentation and line breaks, making JSON human-readable and easier to debug.' },
        { q: 'Why minify JSON?', a: 'Minification reduces file size by removing whitespace. This is useful for production APIs and reducing bandwidth usage.' },
        { q: 'Is my data private?', a: 'Yes. All processing runs locally in your browser. Nothing is uploaded to any server.' },
        { q: 'Can I validate JSON?', a: 'Yes. Click Validate to check for syntax errors. The tool will highlight any issues.' },
      ]}
      howItWorks={[
        'Paste your JSON into the input area.',
        'Click Format, Minify, or Validate.',
        'View formatted output or switch to Tree View.',
        'Copy to clipboard or download as .json file.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "JSON Formatter Online", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/json-formatter-online/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <label className="text-xs font-semibold text-slate-500 mb-2 block">Paste your JSON below</label>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder='{"key": "value", "nested": {"a": 1, "b": true}}'
            rows={8} spellCheck={false}
            className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 resize-none" />
          <div className="flex flex-wrap gap-2 mt-3">
            <button onClick={() => { formatJSON(); jumpTo() }}
              className="glow-btn px-4 py-2 rounded-xl text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>✨ Format</button>
            <button onClick={() => { minifyJSON(); jumpTo() }}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">🗜️ Minify</button>
            <button onClick={() => { validateJSON(); jumpTo() }}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">✅ Validate</button>
            <button onClick={toggleTree}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">{treeView ? '📝 Text View' : '🌳 Tree View'}</button>
            <button onClick={clearAll}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">🗑️ Clear</button>
          </div>
        </div>

        {/* Status */}
        {status && (
          <div className={`p-3 rounded-xl text-sm ${status.ok ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
            {status.ok ? '✅' : '❌'} {status.msg}
          </div>
        )}

        {/* Output */}
        <div ref={resultRef} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          {!treeView ? (
            <>
              <label className="text-xs font-semibold text-slate-500 mb-2 block">Formatted Output</label>
              <textarea value={output} readOnly rows={8} spellCheck={false}
                className="w-full bg-black/20 border-2 border-indigo-500/20 rounded-xl px-4 py-3 text-sm font-mono text-indigo-300 resize-none" />
            </>
          ) : (
            <>
              <label className="text-xs font-semibold text-slate-500 mb-2 block">Tree View</label>
              <div className="bg-black/20 border-2 border-indigo-500/20 rounded-xl p-4 max-h-[520px] overflow-auto font-mono text-xs whitespace-pre"
                dangerouslySetInnerHTML={{ __html: treeHtml }} />
            </>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {[['Characters', stats.chars], ['Size (bytes)', stats.bytes], ['Depth', stats.depth], ['Keys', stats.keys]].map(([l, v]) => (
              <div key={l} className="text-center p-3 bg-black/20 rounded-xl">
                <div className="text-lg font-bold text-indigo-400">{v}</div>
                <div className="text-[11px] text-slate-500">{l}</div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button onClick={copyOutput}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/[0.08] text-slate-400 hover:text-white'}`}>
              {copied ? '✓ Copied' : '📋 Copy'}
            </button>
            <button onClick={downloadJSON}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">💾 Download</button>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
