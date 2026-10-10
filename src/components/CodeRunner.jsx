import { useState, useCallback } from 'react'
import useJumpToResult from '../hooks/useJumpToResult'

export default function CodeRunner({ compiler, versionLabel, defaultCode }) {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [code, setCode] = useState(defaultCode)
  const [stdin, setStdin] = useState('')
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState('idle')
  const [exitInfo, setExitInfo] = useState('')
  const [copied, setCopied] = useState(false)

  const run = useCallback(async () => {
    const src = code
    const input = stdin
    setStatus('running')
    setOutput('')
    setExitInfo('')
    jumpTo()
    try {
      const res = await fetch('https://wandbox.org/api/compile.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ compiler, code: src, stdin: input }),
      })
      const j = await res.json()
      const parts = []
      if (j.compiler_output) parts.push(j.compiler_output)
      if (j.compiler_error) parts.push(j.compiler_error)
      if (j.program_output) parts.push(j.program_output)
      if (j.program_error) parts.push(j.program_error)
      const ok = String(j.status) === '0'
      setOutput(parts.join('\n') || (ok ? '(program ran with no output)' : ''))
      setStatus(ok ? 'ok' : 'error')
      setExitInfo(ok ? 'Exited with code 0' : 'Exited with code ' + String(j.status))
    } catch (e) {
      setStatus('error')
      setExitInfo('Connection failed')
      setOutput('Could not reach the compiler service. Check your internet connection and click Run again.')
    }
  }, [code, stdin, compiler, jumpTo])

  const copyOutput = () => {
    if (!output) return
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const pill = status === 'running'
    ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
    : status === 'ok'
      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
      : status === 'error'
        ? 'bg-red-500/15 text-red-300 border-red-500/30'
        : 'bg-white/5 text-slate-400 border-white/10'

  const pillText = status === 'running' ? 'Running…' : status === 'idle' ? 'Ready' : exitInfo

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${pill}`}>{pillText}</span>
          <span className="text-xs text-slate-500">{versionLabel}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={run} disabled={status === 'running'}
            className="glow-btn px-5 py-2 rounded-xl text-sm disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
            {status === 'running' ? 'Running…' : '▶ Run'}
          </button>
          <button onClick={() => { setCode(defaultCode); setStdin(''); setOutput(''); setStatus('idle'); setExitInfo('') }}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all">
            Reset
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Code</label>
        <textarea value={code} onChange={e => setCode(e.target.value)}
          placeholder="Write your code here..."
          rows={16} spellCheck={false}
          className="w-full bg-black/20 border-2 border-white/10 rounded-2xl px-5 py-4 text-sm text-white font-mono outline-none focus:border-cyan-500/40 transition-all placeholder:text-slate-600 resize-y" />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Program input (stdin) — optional</label>
        <textarea value={stdin} onChange={e => setStdin(e.target.value)}
          placeholder="One line per input value, used when your program reads input"
          rows={3} spellCheck={false}
          className="w-full bg-black/20 border-2 border-white/10 rounded-2xl px-5 py-4 text-sm text-white font-mono outline-none focus:border-cyan-500/40 transition-all placeholder:text-slate-600 resize-y" />
      </div>

      <div ref={resultRef}>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-semibold text-slate-400">Output</label>
          {output && (
            <button onClick={copyOutput}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'}`}>
              {copied ? '✓ Copied' : '📋 Copy output'}
            </button>
          )}
        </div>
        <pre className="w-full min-h-[180px] max-h-[480px] overflow-auto bg-black/30 border-2 border-white/10 rounded-2xl px-5 py-4 text-sm font-mono whitespace-pre-wrap break-words text-slate-200">
          {output || <span className="text-slate-600">Click Run to compile and execute your code. Output appears here.</span>}
        </pre>
      </div>
    </div>
  )
}
