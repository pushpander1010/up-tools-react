import { useState, useCallback, useRef } from 'react'
import useJumpToResult from '../hooks/useJumpToResult'

const PYODIDE_VERSION = 'v0.26.4'
const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/' + PYODIDE_VERSION + '/full/'

let pyodidePromise = null

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector('script[src="' + src + '"]')) return resolve()
    const s = document.createElement('script')
    s.src = src
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('Python engine download failed'))
    document.head.appendChild(s)
  })
}

function getPyodide() {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      await loadScript(PYODIDE_URL + 'pyodide.js')
      return await window.loadPyodide({ indexURL: PYODIDE_URL })
    })()
  }
  return pyodidePromise
}

async function runPython(src, input) {
  const py = await getPyodide()
  let out = ''
  py.setStdout({ batched: (s) => { out += s + '\n' } })
  py.setStderr({ batched: (s) => { out += s + '\n' } })
  const text = input ? input + '\n' : ''
  const chars = Array.from(text)
  let idx = 0
  py.setStdin({ stdin: () => (idx < chars.length ? chars[idx++].codePointAt(0) : null), error: true })
  await py.runPythonAsync(src)
  return out
}

async function runJs(src, input) {
  const logs = []
  const line = (args) => args.map((a) => {
    if (typeof a === 'string') return a
    try { const j = JSON.stringify(a); return j === undefined ? String(a) : j } catch (e) { return String(a) }
  }).join(' ')
  const fakeConsole = {
    log: (...a) => logs.push(line(a)),
    info: (...a) => logs.push(line(a)),
    warn: (...a) => logs.push('Warning: ' + line(a)),
    error: (...a) => logs.push('Error: ' + line(a)),
  }
  const inputLines = input ? input.split('\n') : []
  const fn = new Function('console', 'inputLines', 'return (async () => {\n' + src + '\n})()')
  const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error('Timed out after 5 seconds — possible infinite loop.')), 5000))
  await Promise.race([fn(fakeConsole, inputLines), timeout])
  return logs.join('\n')
}

async function runWandbox(compiler, src, input) {
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
  return { ok: String(j.status) === '0', text: parts.join('\n'), code: String(j.status) }
}

export default function CodeRunner({ mode = 'wandbox', compiler, versionLabel, defaultCode }) {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [code, setCode] = useState(defaultCode)
  const [stdin, setStdin] = useState('')
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState('idle')
  const [exitInfo, setExitInfo] = useState('')
  const [elapsed, setElapsed] = useState(0)
  const [copied, setCopied] = useState(false)
  const timerRef = useRef(null)

  const busy = status === 'running' || status === 'loading'

  const run = useCallback(async () => {
    const src = code
    const input = stdin
    setStatus(mode === 'pyodide' ? 'loading' : 'running')
    setOutput('')
    setExitInfo('')
    setElapsed(0)
    const t0 = Date.now()
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setElapsed(Math.floor((Date.now() - t0) / 1000)), 500)
    try {
      if (mode === 'pyodide') {
        const text = await runPython(src, input)
        const clean = text.endsWith('\n') ? text.slice(0, -1) : text
        setOutput(clean || '(program ran with no output)')
        setStatus('ok')
        setExitInfo('Finished in ' + Math.max(1, Math.floor((Date.now() - t0) / 1000)) + 's')
      } else if (mode === 'local-js') {
        const text = await runJs(src, input)
        setOutput(text || '(program ran with no output)')
        setStatus('ok')
        setExitInfo('Finished instantly')
      } else {
        const r = await runWandbox(compiler, src, input)
        setOutput(r.text || (r.ok ? '(program ran with no output)' : ''))
        setStatus(r.ok ? 'ok' : 'error')
        setExitInfo(r.ok ? 'Exited with code 0' : 'Exited with code ' + r.code)
      }
    } catch (e) {
      setStatus('error')
      const msg = e && e.message ? e.message : String(e)
      if (mode === 'wandbox' && /failed to fetch|networkerror|load failed/i.test(msg)) {
        setExitInfo('Connection failed')
        setOutput('Could not reach the compiler service. Check your internet connection and click Run again.')
      } else {
        setExitInfo('Error')
        setOutput(msg)
      }
    } finally {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [code, stdin, compiler, mode])

  const copyOutput = () => {
    if (!output) return
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const pill = busy
    ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
    : status === 'ok'
      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
      : status === 'error'
        ? 'bg-red-500/15 text-red-300 border-red-500/30'
        : 'bg-white/5 text-slate-400 border-white/10'

  const pillText = status === 'loading'
    ? 'Loading Python… (one-time)'
    : status === 'running' && mode === 'wandbox'
      ? 'Running… ' + elapsed + 's'
      : busy ? 'Running…' : status === 'idle' ? 'Ready' : exitInfo

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${pill}`}>{pillText}</span>
          <span className="text-xs text-slate-500">{versionLabel}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { run(); jumpTo() }} disabled={busy}
            className="glow-btn px-5 py-2 rounded-xl text-sm disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
            {busy ? 'Running…' : '▶ Run'}
          </button>
          <button onClick={() => { setCode(defaultCode); setStdin(''); setOutput(''); setStatus('idle'); setExitInfo(''); setElapsed(0) }}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all">
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Code</label>
            <textarea value={code} onChange={e => setCode(e.target.value)}
              placeholder="Write your code here..."
              rows={18} spellCheck={false}
              className="w-full bg-black/20 border-2 border-white/10 rounded-2xl px-5 py-4 text-sm text-white font-mono outline-none focus:border-cyan-500/40 transition-all placeholder:text-slate-600 resize-y" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Program input (stdin) — optional</label>
            <textarea value={stdin} onChange={e => setStdin(e.target.value)}
              placeholder="One line per input value, used when your program reads input"
              rows={3} spellCheck={false}
              className="w-full bg-black/20 border-2 border-white/10 rounded-2xl px-5 py-4 text-sm text-white font-mono outline-none focus:border-cyan-500/40 transition-all placeholder:text-slate-600 resize-y" />
          </div>
        </div>

        <div ref={resultRef} className="flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-400">Output</label>
            {output && (
              <button onClick={copyOutput}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'}`}>
                {copied ? '✓ Copied' : '📋 Copy output'}
              </button>
            )}
          </div>
          <pre className="flex-1 w-full min-h-[420px] max-h-[640px] overflow-auto bg-black/30 border-2 border-white/10 rounded-2xl px-5 py-4 text-sm font-mono whitespace-pre-wrap break-words text-slate-200">
            {output || <span className="text-slate-600">Click Run — output appears here, beside your code.</span>}
          </pre>
          {mode === 'wandbox' && (
            <p className="text-xs text-slate-500 mt-2">Cloud compile usually takes 10–20 seconds. The timer above shows the wait.</p>
          )}
          {mode === 'pyodide' && (
            <p className="text-xs text-slate-500 mt-2">First run downloads the Python engine once (about 10 MB), then every run is instant.</p>
          )}
        </div>
      </div>
    </div>
  )
}
