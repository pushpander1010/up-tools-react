import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

function flatten(obj, prefix = '', result = {}) {
  for (const key in obj) {
    const val = obj[key]
    const newKey = prefix ? `${prefix}.${key}` : key
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      flatten(val, newKey, result)
    } else {
      result[newKey] = val
    }
  }
  return result
}

export default function json_to_csv_converter() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [rowCount, setRowCount] = useState(0)

  const convert = useCallback(() => {
    try {
      const arr = JSON.parse(input.trim())
      if (!Array.isArray(arr)) {
        setError('Input must be a JSON array of objects')
        setOutput('')
        return
      }
      const rows = arr.map(o => flatten(o))
      const cols = [...new Set(rows.flatMap(r => Object.keys(r)))]
      let csv = cols.join(',') + '\n'
      rows.forEach(r => {
        csv += cols.map(c => {
          const v = r[c] === undefined ? '' : String(r[c])
          return v.includes(',') || v.includes('"') ? '"' + v.replace(/"/g, '""') + '"' : v
        }).join(',') + '\n'
      })
      setOutput(csv.trim())
      setRowCount(rows.length)
      setError('')
    } catch (e) {
      setError('Invalid JSON: ' + e.message)
      setOutput('')
    }
  }, [input])

  const copy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const download = () => {
    const blob = new Blob([output], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'data.csv'
    document.body.appendChild(a); a.click(); a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <ToolLayout
      title="JSON to CSV Converter"
      desc="Convert a JSON array of objects into CSV instantly. Handles nested flattening and downloads the result."
      icon="📊" iconBg="rgba(6,182,212,0.08)"
      category="dev" slug="json-to-csv-converter"
      faq={[
        { q: 'What input format is supported?', a: 'An array of flat or nested JSON objects, e.g. [{"name":"A","age":20}].' },
        { q: 'Does it flatten nested objects?', a: 'Yes — nested fields are flattened with dot notation (e.g. user.name).' },
      ]}
      howItWorks={[
        'Paste a JSON array of objects in the input area.',
        'Click Convert to CSV.',
        'Copy or download the generated CSV.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "JSON to CSV Converter", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/json-to-csv-converter/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Paste JSON Array</label>
          <textarea value={input} onChange={e => { setInput(e.target.value); setError('') }}
            placeholder='[{"name":"Alice","age":25},{"name":"Bob","age":30}]'
            rows={7}
            className="w-full bg-black/20 border-2 border-white/8 rounded-2xl px-5 py-4 text-sm text-white font-mono outline-none focus:border-cyan-500/40 transition-all placeholder:text-slate-600 resize-none" />
        </div>

        {/* Convert Button */}
        <button onClick={() => { convert(); jumpTo() }}
          className="glow-btn px-6 py-3 rounded-xl text-sm w-full"
          style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
          📊 Convert to CSV
        </button>

        {/* Error */}
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
            ❌ {error}
          </div>
        )}

        {/* Output */}
        {output && (
          <div ref={resultRef} className="space-y-2" style={{ animation: 'slideUp 0.3s ease-out' }}>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-500">CSV Output ({rowCount} rows)</label>
              <div className="flex gap-2">
                <button onClick={copy}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/8 text-slate-400 hover:text-white'}`}>
                  {copied ? '✓ Copied' : '📋 Copy'}
                </button>
                <button onClick={download}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/8 text-slate-400 hover:text-white transition-all">
                  💾 Download
                </button>
              </div>
            </div>
            <textarea value={output} readOnly rows={12}
              className="w-full bg-black/20 border-2 border-emerald-500/20 rounded-2xl px-5 py-4 text-sm font-mono text-emerald-400 resize-none" />
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
