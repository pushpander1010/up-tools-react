import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'

/* Lightweight YAML parser/serializer — no dependencies needed */
function yamlParse(str) {
  const lines = str.split('\n')
  const result = {}
  let currentKey = null
  let currentObj = result
  let indentStack = [{ indent: -1, obj: result }]

  for (let raw of lines) {
    const line = raw.replace(/\t/g, '  ')
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const indent = line.search(/\S/)
    const colonIdx = trimmed.indexOf(':')

    if (colonIdx === -1) continue

    const key = trimmed.slice(0, colonIdx).trim().replace(/^["']|["']$/g, '')
    const val = trimmed.slice(colonIdx + 1).trim()

    // Pop stack to find parent
    while (indentStack.length > 1 && indentStack[indentStack.length - 1].indent >= indent) {
      indentStack.pop()
    }
    const parent = indentStack[indentStack.length - 1].obj

    if (val === '' || val === '|' || val === '>') {
      // Nested object or array
      const newObj = {}
      if (Array.isArray(parent)) {
        parent.push(newObj)
      } else {
        parent[key] = newObj
      }
      indentStack.push({ indent, obj: newObj })
    } else if (val.startsWith('[') || val.startsWith('-')) {
      // Array
      const arr = parseYamlValue(val)
      parent[key] = arr
    } else {
      const parsed = parseYamlValue(val)
      if (Array.isArray(parent)) {
        parent.push(parsed)
      } else {
        parent[key] = parsed
      }
    }
  }
  return result
}

function parseYamlValue(val) {
  if (val === 'null' || val === '~') return null
  if (val === 'true') return true
  if (val === 'false') return false
  if (/^-?\d+$/.test(val)) return parseInt(val, 10)
  if (/^-?\d*\.\d+$/.test(val)) return parseFloat(val)
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    return val.slice(1, -1)
  }
  if (val.startsWith('[')) {
    try { return JSON.parse(val) } catch { return val.slice(1, -1).split(',').map(s => parseYamlValue(s.trim())) }
  }
  return val.replace(/^["']|["']$/g, '')
}

function jsonToYaml(obj, indent = 0) {
  const pad = '  '.repeat(indent)
  let yaml = ''

  if (Array.isArray(obj)) {
    return obj.map(item => {
      if (typeof item === 'object' && item !== null) {
        const inner = jsonToYaml(item, indent + 1)
        return pad + '-\n' + inner.split('\n').filter(Boolean).map(l => pad + '  ' + l.trim()).join('\n')
      }
      return pad + '- ' + yamlValue(item)
    }).join('\n')
  }

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      yaml += pad + key + ':\n'
      if (Array.isArray(value)) {
        yaml += jsonToYaml(value, indent + 1) + '\n'
      } else {
        yaml += jsonToYaml(value, indent + 1)
      }
    } else {
      yaml += pad + key + ': ' + yamlValue(value) + '\n'
    }
  }
  return yaml
}

function yamlValue(val) {
  if (val === null) return 'null'
  if (typeof val === 'boolean') return val.toString()
  if (typeof val === 'number') return val.toString()
  if (typeof val === 'string') {
    if (/[:{}\[\],&*?|>!%#@`]/.test(val) || val.includes('\n')) {
      return JSON.stringify(val)
    }
    return val
  }
  return String(val)
}

export default function yaml_to_json_converter() {
  const [input, setInput] = useState('name: John Doe\nage: 30\nactive: true\naddress:\n  street: 123 Main St\n  city: New York\n  zip: "10001"\nskills:\n  - JavaScript\n  - React\n  - Node.js')
  const [mode, setMode] = useState('yaml2json')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const process = useCallback(() => {
    try {
      setError('')
      if (mode === 'yaml2json') {
        const parsed = yamlParse(input)
        setOutput(JSON.stringify(parsed, null, 2))
      } else {
        const parsed = JSON.parse(input)
        setOutput(jsonToYaml(parsed).trim())
      }
    } catch (e) {
      setError(e.message)
      setOutput('')
    }
  }, [input, mode])

  const swap = () => {
    if (output) {
      setInput(output)
      setMode(m => m === 'yaml2json' ? 'json2yaml' : 'yaml2json')
      process()
    }
  }

  const copyOutput = () => {
    if (output) navigator.clipboard.writeText(output)
  }

  return (
    <ToolLayout
      title="YAML ⇄ JSON Converter"
      desc="Convert between YAML and JSON formats instantly. Parse, format, and validate your data."
      icon="🔄" iconBg="rgba(99,102,241,0.08)"
      category="dev" slug="yaml-to-json-converter"
      faq={[
        { q: 'What is YAML?', a: 'YAML is a human-readable data serialization format often used for configuration files.' },
        { q: 'Does this work offline?', a: 'Yes — the conversion runs entirely in your browser with no server requests.' },
      ]}
      howItWorks={[
        'Paste YAML or JSON in the input area.',
        'Choose conversion direction: YAML→JSON or JSON→YAML.',
        'Click Convert to process.',
      ]}
    >
      <div className="max-w-3xl mx-auto space-y-5">

        {/* Mode + Swap */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-xl overflow-hidden border border-white/[0.12]">
            {[['yaml2json', 'YAML → JSON'], ['json2yaml', 'JSON → YAML']].map(([m, label]) => (
              <button key={m} onClick={() => setMode(m)}
                className={`px-5 py-2.5 text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap ${mode === m ? 'bg-indigo-500 text-white' : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08]'}`}>
                {label}
              </button>
            ))}
          </div>
          <button onClick={swap} disabled={!output}
            className="px-4 py-2.5 bg-white/[0.06] border border-white/[0.1] text-slate-400 text-sm font-bold rounded-xl hover:bg-white/[0.10] transition-all disabled:opacity-30">
            ⇄ Swap
          </button>
        </div>

        {/* Input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            {mode === 'yaml2json' ? 'YAML Input' : 'JSON Input'}
          </label>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder={mode === 'yaml2json' ? 'Paste YAML here...' : 'Paste JSON here...'}
            rows={12}
            className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 resize-y" />
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium font-mono">{error}</div>
        )}

        {/* Convert */}
        <button onClick={process}
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-bold rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg shadow-indigo-500/20">
          Convert ⚡
        </button>

        {/* Output */}
        {output && (
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-slate-300">
                {mode === 'yaml2json' ? 'JSON Output' : 'YAML Output'}
              </label>
              <button onClick={copyOutput} className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-all">
                📋 Copy
              </button>
            </div>
            <textarea value={output} readOnly rows={12}
              className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm text-emerald-400 font-mono focus:outline-none resize-y" />
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
