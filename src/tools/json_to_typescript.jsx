import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'

function jsonToTypeScript(obj, indent = 0, name = 'Root', visited = new Set()) {
  const pad = '  '.repeat(indent)

  if (obj === null) return 'null'
  if (obj === undefined) return 'unknown'
  if (typeof obj === 'string') return 'string'
  if (typeof obj === 'number') return 'number'
  if (typeof obj === 'boolean') return 'boolean'

  if (Array.isArray(obj)) {
    if (obj.length === 0) return 'unknown[]'
    const inner = jsonToTypeScript(obj[0], indent, name, visited)
    // Avoid deeply nested arrays of the same type
    if (inner.endsWith('[]') || inner.includes('[]')) return inner
    return inner + '[]'
  }

  if (typeof obj === 'object') {
    // Check for circular references
    if (visited.has(obj)) return 'Record<string, unknown>'
    visited.add(obj)

    const keys = Object.keys(obj)
    if (keys.length === 0) return 'Record<string, unknown>'

    const lines = []
    for (const key of keys) {
      const val = obj[key]
      const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `'${key}'`
      const type = jsonToTypeScript(val, indent + 1, key, visited)
      lines.push(`${pad}  ${safeKey}: ${type};`)
    }

    return `{\n${lines.join('\n')}\n${pad}}`
  }

  return 'unknown'
}

function parseJsonSafe(str) {
  try {
    return [JSON.parse(str), null]
  } catch (e) {
    return [null, e.message]
  }
}

const SAMPLE_JSON = `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "isActive": true,
  "address": {
    "street": "123 Main St",
    "city": "Springfield",
    "zip": "62704"
  },
  "tags": ["developer", "designer"],
  "projects": [
    {
      "title": "My Project",
      "stars": 42,
      "tags": ["react", "typescript"]
    }
  ]
}`

export default function json_to_typescript() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [rootName, setRootName] = useState('Root')
  const [prettyOutput, setPrettyOutput] = useState('')

  const convert = () => {
    if (!input.trim()) {
      setError('Please paste some JSON to convert.')
      setOutput('')
      return
    }
    const [parsed, parseError] = parseJsonSafe(input.trim())
    if (parseError) {
      setError('Invalid JSON: ' + parseError)
      setOutput('')
      return
    }
    try {
      const tsType = jsonToTypeScript(parsed, 0, rootName)
      const interfaceStr = `interface ${rootName} ${tsType}`
      setOutput(interfaceStr)
      setPrettyOutput(interfaceStr)
      setError('')
    } catch (e) {
      setError('Conversion error: ' + e.message)
      setOutput('')
    }
  }

  const loadSample = () => {
    setInput(SAMPLE_JSON)
    setError('')
    setOutput('')
  }

  const copyOutput = () => {
    navigator.clipboard.writeText(prettyOutput || output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  const formatInput = () => {
    const [parsed, parseError] = parseJsonSafe(input.trim())
    if (parseError) {
      setError('Cannot format: Invalid JSON — ' + parseError)
      return
    }
    setInput(JSON.stringify(parsed, null, 2))
    setError('')
  }

  return (
    <ToolLayout
      title="JSON to TypeScript Generator"
      desc="Convert JSON data to TypeScript interfaces with proper type inference and nesting."
      icon="🔷" iconBg="rgba(59,130,246,0.08)"
      category="developer" slug="json-to-typescript"
      faq={[
        { q: 'What does this tool generate?', a: 'It generates TypeScript interface definitions from JSON data. It infers types (string, number, boolean, arrays, nested objects) and generates properly nested interfaces.' },
        { q: 'Does it handle nested objects?', a: 'Yes. Nested objects and arrays are properly typed with recursive type generation. Circular references are detected and handled gracefully.' },
      ]}
      howItWorks={[
        'Paste your JSON data into the input area or click "Load Sample".',
        '(Optional) Set a custom interface name in the "Interface Name" field.',
        'Click "Generate TypeScript" to create the interface.',
        'Copy the generated TypeScript interface to your clipboard.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "JSON to TypeScript Generator", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/json-to-typescript/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Top bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-xl px-3 py-1.5">
            <label className="text-xs font-bold text-slate-400">Interface:</label>
            <input value={rootName} onChange={e => setRootName(e.target.value)}
              className="bg-transparent text-white text-sm font-semibold outline-none w-28 placeholder:text-slate-600" />
          </div>
          <button onClick={loadSample}
            className="px-4 py-2 rounded-xl bg-blue-500/15 text-blue-400 text-xs font-bold hover:bg-blue-500/25 transition-all duration-200">
            📄 Load Sample
          </button>
          <button onClick={formatInput}
            className="px-4 py-2 rounded-xl bg-white/[0.04] text-slate-500 text-xs font-bold hover:bg-white/[0.08] hover:text-slate-300 transition-all duration-200">
            ✨ Format JSON
          </button>
          <button onClick={convert}
            className="px-6 py-2 rounded-xl bg-blue-500/20 text-blue-400 text-xs font-bold hover:bg-blue-500/30 transition-all duration-200">
            ⚡ Generate TypeScript
          </button>
          {output && (
            <button onClick={copyOutput}
              className="ml-auto px-5 py-2 rounded-xl bg-blue-500/20 text-blue-400 text-xs font-bold hover:bg-blue-500/30 transition-all duration-200">
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 text-sm text-rose-400 font-medium">
            {error}
          </div>
        )}

        {/* Editor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Input */}
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">JSON Input</span>
            </div>
            <textarea value={input} onChange={e => setInput(e.target.value)}
              placeholder='{\n  "name": "John",\n  "age": 30,\n  "active": true\n}'
              className="w-full h-80 bg-transparent text-white font-mono text-xs p-4 outline-none resize-none placeholder:text-slate-600 [color-scheme:dark]" />
          </div>

          {/* Output */}
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">TypeScript Output</span>
            </div>
            <textarea value={output} readOnly
              placeholder="TypeScript interface will appear here..."
              className="w-full h-80 bg-transparent text-white font-mono text-xs p-4 outline-none resize-none placeholder:text-slate-600 [color-scheme:dark]" />
          </div>
        </div>

        {/* Type mapping reference */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h3 className="text-sm font-bold text-slate-300 mb-3">Type Inference Rules</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-[10px] font-mono">
            {[
              ['"hello"', 'string'],
              ['42', 'number'],
              ['true / false', 'boolean'],
              ['null', 'null'],
              ['[]', 'unknown[]'],
              ['{}', 'Record<string, unknown>'],
              ['[{...}]', 'Object[]'],
              ['{ nested: {...} }', 'nested object'],
            ].map(([json, ts]) => (
              <div key={json} className="bg-black/20 rounded-lg px-2.5 py-1.5 flex items-center gap-1">
                <span className="text-amber-400">{json}</span>
                <span className="text-slate-500">→</span>
                <span className="text-blue-400">{ts}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
