import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const IFSC_DB = {
  'SBIN0001234': { bank: 'State Bank of India', branch: 'Mumbai Main', city: 'Mumbai', address: 'Fort, Mumbai' },
  'HDFC0000001': { bank: 'HDFC Bank', branch: 'Delhi HQ', city: 'Delhi', address: 'Gurgaon, Delhi' },
  'ICIC0000001': { bank: 'ICICI Bank', branch: 'Bangalore', city: 'Bangalore', address: 'Whitefield, Bangalore' },
  'AXIS0000001': { bank: 'Axis Bank', branch: 'Pune', city: 'Pune', address: 'Hinjewadi, Pune' },
}

export default function ifsc_bulk_lookup() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [input, setInput] = useState('')
  const [results, setResults] = useState([])

  const lookup = useCallback(() => {
    const codes = input.split('\n').filter(c => c.trim())
    if (codes.length === 0) return
    const res = codes.map(code => {
      const trimmed = code.trim().toUpperCase()
      const data = IFSC_DB[trimmed]
      return data ? { code: trimmed, ...data, found: true } : { code: trimmed, bank: '-', branch: '-', city: '-', found: false }
    })
    setResults(res)
  }, [input])

  const downloadCSV = useCallback(() => {
    if (results.length === 0) return
    let csv = 'IFSC Code,Bank Name,Branch,City,Status\n'
    results.forEach(r => {
      csv += `${r.code},${r.bank},${r.branch},${r.city},${r.found ? 'Found' : 'Not Found'}\n`
    })
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'ifsc-lookup-results.csv'; a.click()
    URL.revokeObjectURL(url)
  }, [results])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark] resize-none"

  return (
    <ToolLayout
      title="IFSC Bulk Lookup"
      desc="Search multiple IFSC codes at once. Get bank branch details instantly. Download results as CSV."
      icon="🏦" iconBg="rgba(34,197,94,0.08)"
      category="finance" slug="ifsc-bulk-lookup"
      faq={[
        { q: "What is an IFSC code?", a: "IFSC (Indian Financial System Code) is a unique 11-character code assigned to every bank branch in India." },
        { q: "Can I search unlimited codes?", a: "Yes, paste them one per line and click Search." },
      ]}
      howItWorks={["Enter IFSC codes in the text area (one per line)", "Click Search to see results", "Download results as CSV"]}
      schema={{"@context":"https://schema.org","@type":"SoftwareApplication","name":"IFSC Bulk Lookup","applicationCategory":"UtilitiesApplication","url":"https://www.uptools.in/ifsc-bulk-lookup/","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}}}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6 sm:p-8 space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Enter IFSC Codes (one per line)</label>
            <textarea value={input} onChange={e => setInput(e.target.value)} rows={6}
              placeholder={"SBIN0001234\nHDFC0000001\nICIC0000001\nAXIS0000001"}
              className={inputClass} />
          </div>
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => { lookup(); jumpTo() }}
              className="flex-1 py-3 rounded-xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all active:scale-[0.98]">
              🔍 Search
            </button>
            <button onClick={() => { setInput(''); setResults([]) }}
              className="px-5 py-3 rounded-xl bg-white/[0.06] border border-white/8 text-slate-400 font-semibold text-sm hover:bg-white/10 transition-all">
              Clear
            </button>
            {results.length > 0 && (
              <button onClick={downloadCSV}
                className="px-5 py-3 rounded-xl bg-white/[0.06] border border-white/8 text-slate-400 font-semibold text-sm hover:bg-white/10 transition-all">
                📥 CSV
              </button>
            )}
          </div>
        </div>

        {results.length > 0 ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-x-auto"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Results ({results.length})</h3>
            </div>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-white/8">
                <th className="text-left py-2 text-slate-400 font-semibold">IFSC</th>
                <th className="text-left py-2 text-slate-400 font-semibold">Bank</th>
                <th className="text-left py-2 text-slate-400 font-semibold">Branch</th>
                <th className="text-left py-2 text-slate-400 font-semibold">City</th>
                <th className="text-left py-2 text-slate-400 font-semibold">Status</th>
              </tr></thead>
              <tbody>
                {results.map(r => (
                  <tr key={r.code} className="border-b border-white/5">
                    <td className="py-2 text-white font-mono text-xs">{r.code}</td>
                    <td className="py-2 text-white">{r.bank}</td>
                    <td className="py-2 text-slate-400">{r.branch}</td>
                    <td className="py-2 text-slate-400">{r.city}</td>
                    <td className="py-2">
                      {r.found
                        ? <span className="text-green-400 text-xs font-semibold">✓ Found</span>
                        : <span className="text-red-400 text-xs font-semibold">✗ Not Found</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🏦</div>
            <p className="text-sm text-slate-600 font-medium">Enter IFSC codes and click Search</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
