import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'

function minifyCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    .replace(/\s*:\s*/g, ':')
    .replace(/\s*;\s*/g, ';')
    .replace(/\s*,\s*/g, ',')
    .replace(/\n/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

function beautifyCSS(css, indentSize = 2) {
  const indent = ' '.repeat(indentSize)
  let result = ''
  let depth = 0
  let i = 0
  const len = css.length

  while (i < len) {
    if (css[i] === '/' && css[i + 1] === '*') {
      const end = css.indexOf('*/', i + 2)
      if (end === -1) break
      result += css.slice(i, end + 2) + '\n'
      i = end + 2
    } else if (css[i] === '{') {
      result += ' {\n'
      depth++
      i++
    } else if (css[i] === '}') {
      result = result.trimEnd() + '\n'
      depth = Math.max(0, depth - 1)
      result += indent.repeat(depth) + '}\n'
      i++
    } else if (css[i] === ';') {
      result += ';\n' + indent.repeat(depth)
      i++
    } else {
      result += css[i]
      i++
    }
  }
  return result.trim()
}

export default function css_minifier() {
  const [input, setInput] = useState('.container {\n  display: flex;\n  gap: 16px;\n}\n\n/* Header styles */\n.header {\n  background: #fff;\n  padding: 20px;\n}')
  const [mode, setMode] = useState('beautify')
  const [indent, setIndent] = useState(2)
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const process = useCallback(() => {
    try {
      setError('')
      if (mode === 'minify') {
        setOutput(minifyCSS(input))
      } else {
        setOutput(beautifyCSS(input, indent))
      }
    } catch (e) {
      setError(e.message)
      setOutput('')
    }
  }, [input, mode, indent])

  const copyOutput = () => {
    if (output) navigator.clipboard.writeText(output)
  }

  return (
    <ToolLayout
      title="CSS Minifier & Beautifier"
      desc="Minify CSS to reduce file size, or beautify it for readability with custom indent settings."
      icon="🎨" iconBg="rgba(99,102,241,0.08)"
      category="dev" slug="css-minifier"
      faq={[
        { q: 'What does CSS minification do?', a: 'It removes whitespace, comments, and unnecessary characters to reduce file size for production.' },
        { q: 'Is the minified CSS valid?', a: 'Yes — it produces functionally identical CSS with all formatting removed.' },
      ]}
      howItWorks={[
        'Paste your CSS in the input area.',
        'Choose Minify (compress) or Beautify (format) mode.',
        'Adjust indent size for beautify mode, then click Process.',
      ]}
    >
      <div className="max-w-3xl mx-auto space-y-5">

        {/* Input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <label className="block text-sm font-semibold text-slate-300 mb-2">CSS Input</label>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder="Paste your CSS here..."
            rows={10}
            className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 resize-y" />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-xl overflow-hidden border border-white/[0.12]">
            {['beautify', 'minify'].map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`px-5 py-2.5 text-sm font-bold uppercase tracking-wider transition-all ${mode === m ? 'bg-indigo-500 text-white' : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08]'}`}>
                {m}
              </button>
            ))}
          </div>
          {mode === 'beautify' && (
            <div className="flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-2">
              <span className="text-xs font-semibold text-slate-400">Indent:</span>
              {[2, 4].map(s => (
                <button key={s} onClick={() => setIndent(s)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${indent === s ? 'bg-indigo-500/30 text-indigo-300' : 'text-slate-500 hover:text-slate-300'}`}>
                  {s}
                </button>
              ))}
            </div>
          )}
          <button onClick={process}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-500/20">
            Process ⚡
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">{error}</div>
        )}

        {/* Output */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-slate-300">Output</label>
            {output && (
              <button onClick={copyOutput} className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-all">
                📋 Copy
              </button>
            )}
          </div>
          <textarea value={output} readOnly
            placeholder="Processed output appears here..."
            rows={10}
            className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm text-emerald-400 font-mono focus:outline-none resize-y placeholder:text-slate-600" />
          {output && (
            <div className="mt-2 text-xs text-slate-500">
              Input: {input.length.toLocaleString()} chars → Output: {output.length.toLocaleString()} chars
              ({input.length > 0 ? Math.round((1 - output.length / input.length) * 100) : 0}% {mode === 'minify' ? 'reduced' : 'expanded'})
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
