import { useState, useCallback, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const sanitizeUsername = (u) => { if (!u) return ''; u = String(u).trim(); return u.startsWith('@') ? u.slice(1).toLowerCase() : u.toLowerCase() }

function parseList(text) {
  text = (text || '').trim()
  if (!text) return []
  try {
    const j = JSON.parse(text)
    if (Array.isArray(j)) return j.flatMap(x => {
      if (typeof x === 'string') return sanitizeUsername(x)
      if (x && typeof x === 'object') return sanitizeUsername(x.username || x.value || x.handle || x.user || x.name || x.string_list_data?.[0]?.value)
      return []
    }).filter(Boolean)
  } catch {}
  const lines = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean)
  if (lines.length > 0 && lines[0].includes(',')) {
    const rows = lines.map(l => { const r = []; let c = ''; let q = false; for (let i = 0; i < l.length; i++) { const ch = l[i]; if (ch === '"') q = !q; else if (ch === ',' && !q) { r.push(c.trim()); c = '' } else c += ch }; r.push(c.trim()); return r })
    const h = rows[0].map(h => h.toLowerCase())
    let col = h.findIndex(x => ['username', 'user', 'handle'].includes(x))
    if (col === -1) col = 0
    return rows.slice(1).map(r => sanitizeUsername(r[col] || '')).filter(Boolean)
  }
  return lines.map(s => sanitizeUsername(s)).filter(Boolean)
}

function downloadCSV(lines, filename) {
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(a.href)
}

export default function instagram_following_list_exporter() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [pasteText, setPasteText] = useState('')
  const [usernames, setUsernames] = useState(null)
  const [copied, setCopied] = useState(false)
  const fileRef = useRef(null)

  const handleParse = useCallback(async () => {
    let list = []
    if (fileRef.current?.files?.length) {
      for (const f of fileRef.current.files) { const txt = await f.text(); list.push(...parseList(txt)) }
    }
    if (pasteText.trim()) list.push(...parseList(pasteText))
    list = [...new Set(list)]
    if (!list.length) return
    setUsernames(list)
    jumpTo()
  }, [pasteText, jumpTo])

  const exportCSV = () => {
    if (!usernames) return
    const csvLines = ['S.No.,Username,Profile URL']
    usernames.forEach((u, i) => csvLines.push(`${i + 1},${u},https://instagram.com/${u}`))
    downloadCSV(csvLines, `following-${new Date().toISOString().slice(0, 10)}.csv`)
  }

  const copyAll = () => {
    if (!usernames) return
    navigator.clipboard.writeText(usernames.join('\n'))
    setCopied(true); setTimeout(() => setCopied(false), 1500)
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Instagram Following List Exporter"
      desc="Upload your Instagram data export and convert your following list to CSV. Client-side, privacy-first."
      icon="📤" iconBg="rgba(6,182,212,0.08)"
      category="social" slug="instagram-following-list-exporter"
      faq={[
        { q: "What's the difference between followers and following?", a: "Followers are people who follow you. Following are people you follow. This tool exports your following list." },
        { q: "How do I get my following list?", a: "Download your Instagram data from Settings → Privacy and Security → Download Your Information → Select 'Followers and following'." },
        { q: "Can I compare this with my followers?", a: "Yes! Export both lists and compare them in a spreadsheet, or use the Instagram Auditor tool to find non-followers automatically." },
      ]}
      howItWorks={[
        'Upload your Instagram following data file or paste the data.',
        'The tool parses JSON, HTML, CSV, or plain text formats.',
        'Export as CSV or copy the list to clipboard.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Instagram Following List Exporter", "applicationCategory": "SocialNetworkingApplication",
        "url": "https://www.uptools.in/instagram-following-list-exporter/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Upload following file</label>
            <input ref={fileRef} type="file" accept=".json,.csv,.txt,.html"
              className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-indigo-500/20 file:text-indigo-400 hover:file:bg-indigo-500/30 file:cursor-pointer" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Or paste following data</label>
            <textarea value={pasteText} onChange={e => setPasteText(e.target.value)}
              placeholder={"Paste JSON, CSV, or username list\n\nExample:\nuser1\nuser2\nuser3"}
              rows={5}
              className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 resize-none [color-scheme:dark]" />
          </div>
          <button onClick={handleParse}
            className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
            📤 Parse & Export
          </button>
        </div>

        {usernames && (
          <div ref={resultRef} className="space-y-4" style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-300">{usernames.length.toLocaleString()} following found</h3>
              <div className="flex gap-2">
                <button onClick={copyAll}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/[0.08] text-slate-400 hover:text-white'}`}>
                  {copied ? '✓ Copied' : '📋 Copy'}
                </button>
                <button onClick={exportCSV}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-indigo-500 text-white hover:bg-indigo-400 transition-all">
                  📄 Export CSV
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-1.5 pr-1">
              {usernames.map((u, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all">
                  <span className="text-xs text-slate-600 w-8 text-right shrink-0">{i + 1}</span>
                  <div className="w-7 h-7 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xs shrink-0">
                    {u[0]?.toUpperCase()}
                  </div>
                  <a href={`https://instagram.com/${u}`} target="_blank" rel="noopener noreferrer"
                    className="text-sm font-semibold text-white hover:text-cyan-400 transition-colors no-underline truncate">
                    @{u}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {!usernames && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📤</div>
            <p className="text-sm text-slate-600 font-medium">Upload or paste your following data to export</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
