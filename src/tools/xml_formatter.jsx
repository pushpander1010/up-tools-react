import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'

function formatXML(xml, indent = 2) {
  const pad = ' '.repeat(indent)
  let formatted = ''
  let depth = 0
  let inTag = false
  let isClosing = false

  const cleaned = xml.replace(/(>)[\s]+(<)/g, '$1\n$2').trim()
  const lines = cleaned.split('\n').map(l => l.trim()).filter(Boolean)

  for (const line of lines) {
    if (line.startsWith('</')) {
      depth = Math.max(0, depth - 1)
      formatted += pad.repeat(depth) + line + '\n'
    } else if (line.startsWith('<?') || line.startsWith('<!')) {
      formatted += line + '\n'
    } else if (line.startsWith('<')) {
      formatted += pad.repeat(depth) + line + '\n'
      if (!line.endsWith('/>') && !line.includes('</') && !line.startsWith('<?')) {
        depth++
      }
    } else {
      formatted += pad.repeat(depth) + line + '\n'
    }
  }
  return formatted.trim()
}

function minifyXML(xml) {
  return xml
    .replace(/>\s+</g, '><')
    .replace(/\n\s*/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

function validateXML(xml) {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(xml, 'text/xml')
    const err = doc.querySelector('parsererror')
    if (err) {
      return { valid: false, error: err.textContent.split('\n')[0] }
    }
    return { valid: true, error: null }
  } catch (e) {
    return { valid: false, error: e.message }
  }
}

export default function xml_formatter() {
  const [input, setInput] = useState(`<?xml version="1.0" encoding="UTF-8"?>
<root>
  <item id="1">
    <name>Apple</name>
    <price>1.99</price>
  </item>
  <item id="2">
    <name>Banana</name>
    <price>0.99</price>
  </item>
</root>`)
  const [mode, setMode] = useState('format')
  const [output, setOutput] = useState('')
  const [validation, setValidation] = useState(null)
  const [indent, setIndent] = useState(2)

  const process = useCallback(() => {
    if (mode === 'validate') {
      setValidation(validateXML(input))
      setOutput('')
    } else if (mode === 'format') {
      setValidation(null)
      setOutput(formatXML(input, indent))
    } else {
      setValidation(null)
      setOutput(minifyXML(input))
    }
  }, [input, mode, indent])

  const copyOutput = () => {
    if (output) navigator.clipboard.writeText(output)
  }

  return (
    <ToolLayout
      title="XML Formatter & Validator"
      desc="Format (pretty-print), minify, or validate XML documents instantly in your browser."
      icon="📄" iconBg="rgba(99,102,241,0.08)"
      category="dev" slug="xml-formatter"
      faq={[
        { q: 'How does XML validation work?', a: 'It parses the XML using the browser\'s built-in DOMParser and checks for well-formedness.' },
        { q: 'What does minify do?', a: 'It removes all whitespace between tags to produce the smallest possible XML output.' },
      ]}
      howItWorks={[
        'Paste your XML in the input area.',
        'Choose Format (pretty-print), Minify (compress), or Validate.',
        'Click Process to see results.',
      ]}
    >
      <div className="max-w-3xl mx-auto space-y-5">

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-xl overflow-hidden border border-white/[0.12]">
            {['format', 'minify', 'validate'].map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`px-5 py-2.5 text-sm font-bold uppercase tracking-wider transition-all ${mode === m ? 'bg-indigo-500 text-white' : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08]'}`}>
                {m}
              </button>
            ))}
          </div>
          {mode === 'format' && (
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
        </div>

        {/* Input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <label className="block text-sm font-semibold text-slate-300 mb-2">XML Input</label>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder="Paste your XML here..."
            rows={12}
            className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 resize-y" />
        </div>

        {/* Process */}
        <button onClick={process}
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-bold rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg shadow-indigo-500/20">
          {mode === 'validate' ? 'Validate ✓' : `Process ${mode === 'format' ? '📄' : '🗜️'}`}
        </button>

        {/* Validation Result */}
        {validation && (
          <div className={`p-4 rounded-2xl border-2 ${validation.valid ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-3 h-3 rounded-full ${validation.valid ? 'bg-emerald-400' : 'bg-red-400'}`} />
              <span className={`text-sm font-bold ${validation.valid ? 'text-emerald-400' : 'text-red-400'}`}>
                {validation.valid ? '✓ Valid XML' : '✗ Invalid XML'}
              </span>
            </div>
            {validation.error && <p className="text-xs text-red-300 mt-2 font-mono">{validation.error}</p>}
          </div>
        )}

        {/* Output */}
        {output && (
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-slate-300">Output</label>
              <button onClick={copyOutput} className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-all">
                📋 Copy
              </button>
            </div>
            <textarea value={output} readOnly rows={12}
              className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm text-emerald-400 font-mono focus:outline-none resize-y" />
            <div className="mt-2 text-xs text-slate-500">
              Input: {input.length.toLocaleString()} chars → Output: {output.length.toLocaleString()} chars
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
