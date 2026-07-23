import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

/* ── LCS Diff Algorithm ── */
function buildLCSTable(a, b) {
  const m = a.length, n = b.length
  const dp = new Uint32Array((m + 1) * (n + 1))
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i * (n + 1) + j] = dp[(i - 1) * (n + 1) + (j - 1)] + 1
      } else {
        dp[i * (n + 1) + j] = Math.max(dp[(i - 1) * (n + 1) + j], dp[i * (n + 1) + (j - 1)])
      }
    }
  }
  return { dp, m, n }
}

function backtrackLCS({ dp, m, n }, a, b) {
  const ops = []
  let i = m, j = n
  const W = n + 1
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      ops.push({ type: 'equal', value: a[i - 1] }); i--; j--
    } else if (j > 0 && (i === 0 || dp[i * W + (j - 1)] >= dp[(i - 1) * W + j])) {
      ops.push({ type: 'add', value: b[j - 1] }); j--
    } else {
      ops.push({ type: 'remove', value: a[i - 1] }); i--
    }
  }
  return ops.reverse()
}

function lineDiff(orig, mod) {
  const a = orig === '' ? [] : orig.split('\n')
  const b = mod === '' ? [] : mod.split('\n')
  return backtrackLCS(buildLCSTable(a, b), a, b)
}

function computeStats(ops) {
  let added = 0, removed = 0, unchanged = 0
  for (const op of ops) {
    if (op.type === 'add') added++
    else if (op.type === 'remove') removed++
    else unchanged++
  }
  return { added, removed, unchanged, total: added + removed }
}

function buildUnifiedDiff(ops) {
  const CONTEXT = 3
  const lines = []
  let origLine = 0, modLine = 0
  const structured = ops.map(op => {
    let o = null, m = null
    if (op.type === 'equal') { origLine++; modLine++; o = origLine; m = modLine }
    else if (op.type === 'remove') { origLine++; o = origLine }
    else { modLine++; m = modLine }
    return { type: op.type, value: op.value, o, m }
  })
  const changed = new Set()
  for (let i = 0; i < structured.length; i++) {
    if (structured[i].type !== 'equal') {
      for (let k = Math.max(0, i - CONTEXT); k <= Math.min(structured.length - 1, i + CONTEXT); k++) {
        changed.add(k)
      }
    }
  }
  lines.push('--- Original')
  lines.push('+++ Modified')
  let i = 0
  while (i < structured.length) {
    if (!changed.has(i)) { i++; continue }
    const start = i
    while (i < structured.length && changed.has(i)) i++
    const hunk = structured.slice(start, i)
    lines.push(`@@ -${hunk[0].o || '0'},+${hunk[0].m || '0'} @@`)
    for (const row of hunk) {
      if (row.type === 'equal') lines.push(' ' + row.value)
      else if (row.type === 'remove') lines.push('-' + row.value)
      else lines.push('+' + row.value)
    }
  }
  return lines.join('\n')
}

export default function diff_checker() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [original, setOriginal] = useState('')
  const [modified, setModified] = useState('')
  const [showContext, setShowContext] = useState(true)
  const [copied, setCopied] = useState(false)

  const ops = useMemo(() => {
    if (!original && !modified) return []
    return lineDiff(original, modified)
  }, [original, modified])

  const stats = useMemo(() => computeStats(ops), [ops])

  const structured = useMemo(() => {
    const CONTEXT = 3
    let origLine = 0, modLine = 0
    const rows = ops.map(op => {
      let o = null, m = null
      if (op.type === 'equal') { origLine++; modLine++; o = origLine; m = modLine }
      else if (op.type === 'remove') { origLine++; o = origLine }
      else { modLine++; m = modLine }
      return { type: op.type, value: op.value, origLine: o, modLine: m }
    })
    if (!showContext) {
      const flags = new Array(rows.length).fill(false)
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].type !== 'equal') {
          for (let k = Math.max(0, i - CONTEXT); k <= Math.min(rows.length - 1, i + CONTEXT); k++) {
            flags[k] = true
          }
        }
      }
      return rows.map((r, i) => ({ ...r, visible: flags[i] }))
    }
    return rows.map(r => ({ ...r, visible: true }))
  }, [ops, showContext])

  const copyDiff = () => {
    navigator.clipboard.writeText(buildUnifiedDiff(ops))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const clear = () => { setOriginal(''); setModified('') }

  const renderDiffBody = () => {
    let prevShown = false
    return structured.map((row, i) => {
      if (!row.visible) {
        const sep = prevShown
          ? <tr key={`sep-${i}`} className="border-t border-white/5"><td colSpan={4} className="text-center text-xs text-slate-600 py-1">⋯ hidden unchanged lines ⋯</td></tr>
          : null
        prevShown = false
        return sep
      }
      prevShown = true
      const cls = row.type === 'equal' ? 'text-slate-400' : row.type === 'remove' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
      const prefix = row.type === 'equal' ? ' ' : row.type === 'remove' ? '−' : '+'
      return (
        <tr key={i} className={`${cls} text-xs font-mono`}>
          <td className="px-2 py-0.5 text-slate-600 w-10 text-right select-none">{row.origLine || ''}</td>
          <td className="px-2 py-0.5 text-slate-600 w-10 text-right select-none">{row.modLine || ''}</td>
          <td className="px-2 py-0.5 text-slate-500 w-6 text-center select-none">{prefix}</td>
          <td className="px-3 py-0.5 whitespace-pre-wrap break-all">{row.value}</td>
        </tr>
      )
    }).filter(Boolean)
  }

  return (
    <ToolLayout
      title="Text Diff Checker"
      desc="Compare two texts side-by-side with line-by-line and character-level diff highlighting."
      icon="📝" iconBg="rgba(99,102,241,0.08)"
      category="text" slug="diff-checker"
      faq={[
        { q: 'What diff algorithm is used?', a: 'LCS (Longest Common Subsequence) based diff — same approach as professional diff tools.' },
        { q: 'Can I copy the diff?', a: 'Yes — click Copy Diff to get unified diff format output.' },
      ]}
      howItWorks={[
        'Paste original text in the left area.',
        'Paste modified text in the right area.',
        'View the diff output with additions and deletions highlighted.',
        'Toggle context visibility and copy unified diff format.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Text Diff Checker", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/diff-checker/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Input Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <span className="w-2 h-2 rounded-full bg-red-400" /> Original Text
            </label>
            <textarea value={original} onChange={e => setOriginal(e.target.value)}
              placeholder="Paste or type your original text here…"
              rows={8}
              className="w-full bg-black/20 border-2 border-white/8 rounded-2xl px-5 py-4 text-sm text-white font-mono outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 resize-none" />
          </div>
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Modified Text
            </label>
            <textarea value={modified} onChange={e => setModified(e.target.value)}
              placeholder="Paste or type your modified text here…"
              rows={8}
              className="w-full bg-black/20 border-2 border-white/8 rounded-2xl px-5 py-4 text-sm text-white font-mono outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 resize-none" />
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-2 items-center">
          <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
            <input type="checkbox" checked={showContext} onChange={e => setShowContext(e.target.checked)}
              className="accent-indigo-500 w-4 h-4" />
            Show unchanged lines
          </label>
          <div className="flex-1" />
          <button onClick={() => { copyDiff(); jumpTo() }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/8 text-slate-400 hover:text-white'}`}>
            {copied ? '✓ Copied' : '📋 Copy Diff'}
          </button>
          <button onClick={clear}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/8 text-slate-400 hover:text-white transition-all">
            🗑️ Clear
          </button>
        </div>

        {/* Stats */}
        {(stats.added > 0 || stats.removed > 0) && (
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">+ {stats.added} added</span>
            <span className="px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 font-semibold">− {stats.removed} removed</span>
            <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/8 text-slate-400 font-semibold">= {stats.unchanged} unchanged</span>
          </div>
        )}
        {stats.total === 0 && stats.unchanged > 0 && (
          <div className="px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-semibold inline-block">✓ Identical — {stats.unchanged} lines</div>
        )}

        {/* Diff Output */}
        <div ref={resultRef} className="bg-black/20 border-2 border-white/8 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/8">
            <span className="text-xs font-bold text-slate-400">Diff Output</span>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Line Mode</span>
          </div>
          {structured.length > 0 ? (
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="w-full border-collapse">
                <tbody>
                  {renderDiffBody()}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-sm text-slate-600">Type or paste text into both fields to see the diff</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
