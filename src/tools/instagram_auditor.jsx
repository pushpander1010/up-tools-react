import { useState, useCallback, useRef, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const sanitizeUsername = (u, caseSensitive = false) => {
  if (!u) return ''
  u = String(u).trim()
  if (u.startsWith('@')) u = u.slice(1)
  return caseSensitive ? u : u.toLowerCase()
}

function parseTextContent(text) {
  text = (text || '').trim()
  if (!text) return []

  // Try JSON first
  try {
    const j = JSON.parse(text)
    if (Array.isArray(j)) {
      return j.flatMap(x => {
        if (typeof x === 'string') return sanitizeUsername(x)
        if (x && typeof x === 'object') {
          const candidate = x.username || x.value || x.string_list_data?.[0]?.value ||
            x.handle || x.user || x.user_name || x.field_username ||
            x.name || x.title || x.href?.split('/').pop()
          if (candidate) return sanitizeUsername(candidate)
          for (const k of Object.keys(x)) {
            if (typeof x[k] === 'string' && x[k].match(/^[a-zA-Z0-9._]+$/)) return sanitizeUsername(x[k])
            if (x[k] && typeof x[k] === 'object' && x[k].value) return sanitizeUsername(x[k].value)
          }
        }
        return []
      }).filter(Boolean)
    }
    if (typeof j === 'object') {
      const candidates = []
      function extractFromIG(obj) {
        if (!obj) return
        if (obj.string_list_data && Array.isArray(obj.string_list_data)) {
          obj.string_list_data.forEach(item => { if (item.value) candidates.push(sanitizeUsername(item.value)) })
        }
        if (obj.relationships_following || obj.relationships_followers) {
          [obj.relationships_following, obj.relationships_followers].forEach(rel => {
            if (rel && Array.isArray(rel)) rel.forEach(item => {
              if (item.string_list_data) item.string_list_data.forEach(d => { if (d.value) candidates.push(sanitizeUsername(d.value)) })
            })
          })
        }
        if (Array.isArray(obj)) obj.forEach(item => extractFromIG(item))
        else if (typeof obj === 'object') Object.keys(obj).forEach(key => {
          if (key.toLowerCase().includes('follow') || key.toLowerCase().includes('user')) extractFromIG(obj[key])
        })
      }
      extractFromIG(j)
      if (candidates.length) return [...new Set(candidates)]
      function walk(o) {
        if (!o) return
        if (Array.isArray(o)) {
          const a = o.flatMap(item => {
            if (typeof item === 'string') return sanitizeUsername(item)
            if (item && typeof item === 'object') return sanitizeUsername(item.username || item.handle || item.user || item.name || item.title || item.value)
            return []
          }).filter(Boolean)
          if (a.length > 0) candidates.push(...a)
        } else if (typeof o === 'object') Object.keys(o).forEach(k => walk(o[k]))
      }
      walk(j)
      if (candidates.length) return [...new Set(candidates)]
    }
  } catch {}

  // Try HTML format
  if (text.includes('<html') || text.includes('<!DOCTYPE') || text.includes('<body')) {
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(text, 'text/html')
      const usernames = []
      doc.querySelectorAll('a[href*="instagram.com/"]').forEach(link => {
        const match = link.getAttribute('href')?.match(/instagram\.com\/([a-zA-Z0-9._]+)/)
        if (match?.[1]) usernames.push(sanitizeUsername(match[1]))
      })
      const textContent = doc.body?.textContent || ''
      const mentionMatches = textContent.match(/@([a-zA-Z0-9._]+)/g)
      if (mentionMatches) mentionMatches.forEach(m => usernames.push(sanitizeUsername(m.replace('@', ''))))
      if (usernames.length) return [...new Set(usernames.filter(Boolean))]
    } catch {}
  }

  // CSV format
  const lines = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean)
  if (lines.length > 0 && lines[0].includes(',')) {
    const rows = lines.map(l => {
      const result = []; let current = ''; let inQuotes = false
      for (let i = 0; i < l.length; i++) {
        const char = l[i]
        if (char === '"') inQuotes = !inQuotes
        else if (char === ',' && !inQuotes) { result.push(current.trim().replace(/^"|"$/g, '')); current = '' }
        else current += char
      }
      result.push(current.trim().replace(/^"|"$/g, ''))
      return result
    })
    const headers = rows[0].map(h => h.toLowerCase())
    let usernameCol = -1
    for (let i = 0; i < headers.length; i++) {
      if (['username', 'user', 'handle', 'screen_name', 'account', 'profile'].includes(headers[i])) { usernameCol = i; break }
    }
    if (usernameCol === -1) usernameCol = 0
    const hasHeaders = headers.some(h => ['username', 'user', 'handle', 'screen_name', 'account', 'profile'].includes(h))
    return rows.slice(hasHeaders ? 1 : 0).map(r => sanitizeUsername(r[usernameCol] || '')).filter(Boolean)
  }

  // Tab-separated
  if (lines.length > 0 && lines[0].includes('\t')) return lines.map(l => sanitizeUsername(l.split('\t')[0] || '')).filter(Boolean)

  // Instagram URLs
  const urlPattern = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9._]+)/g
  const urlMatches = []; let match
  while ((match = urlPattern.exec(text)) !== null) urlMatches.push(sanitizeUsername(match[1]))
  if (urlMatches.length > 0) return [...new Set(urlMatches)]

  // @mentions
  const mentionPattern = /@([a-zA-Z0-9._]+)/g
  const mentions = []
  while ((match = mentionPattern.exec(text)) !== null) mentions.push(sanitizeUsername(match[1]))
  if (mentions.length > 0) return [...new Set(mentions)]

  // Fallback: newline list
  return lines.map(s => sanitizeUsername(s)).filter(Boolean)
}

function analyze({ followersList, followingList, caseSensitive }) {
  const map = arr => { const s = new Set(); for (const u of arr) { const v = sanitizeUsername(u, caseSensitive); if (v) s.add(v) }; return s }
  const followers = map(followersList)
  const following = map(followingList)
  const nonFollowers = [...following].filter(u => !followers.has(u))
  const fans = [...followers].filter(u => !following.has(u))
  const mutuals = [...following].filter(u => followers.has(u))
  return { followersCount: followers.size, followingCount: following.size, nonFollowers, fans, mutuals }
}

function downloadCSV(lines, filename) {
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(a.href)
}

export default function instagram_auditor() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [pasteText, setPasteText] = useState('')
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [result, setResult] = useState(null)
  const [viewMode, setViewMode] = useState('non')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(new Set())
  const [copied, setCopied] = useState(false)
  const followersFileRef = useRef(null)
  const followingFileRef = useRef(null)

  const filteredList = useMemo(() => {
    if (!result) return []
    const list = viewMode === 'non' ? result.nonFollowers : viewMode === 'fans' ? result.fans : result.mutuals
    const q = search.toLowerCase()
    return q ? list.filter(u => u.toLowerCase().includes(q)) : list
  }, [result, viewMode, search])

  const handleAnalyze = useCallback(async () => {
    let followersList = [], followingList = []
    const files = [followersFileRef.current?.files, followingFileRef.current?.files]
    if (files[0]?.length) {
      for (const f of files[0]) {
        const txt = await f.text()
        const parsed = parseTextContent(txt)
        if (f.name.toLowerCase().includes('followers')) followersList.push(...parsed)
        else if (f.name.toLowerCase().includes('following')) followingList.push(...parsed)
        else followersList.push(...parsed)
      }
    }
    if (files[1]?.length) {
      for (const f of files[1]) {
        const txt = await f.text()
        const parsed = parseTextContent(txt)
        if (f.name.toLowerCase().includes('following')) followingList.push(...parsed)
        else if (f.name.toLowerCase().includes('followers')) followersList.push(...parsed)
        else followingList.push(...parsed)
      }
    }
    if (pasteText.trim()) {
      const parsed = parseTextContent(pasteText)
      if (parsed.length) {
        if (!followersList.length) followersList.push(...parsed)
        else if (!followingList.length) followingList.push(...parsed)
        else { followersList.push(...parsed); followingList.push(...parsed) }
      }
    }
    const out = analyze({ followersList, followingList, caseSensitive })
    setResult(out)
    setSelected(new Set())
    setViewMode('non')
    jumpTo()
  }, [pasteText, caseSensitive, jumpTo])

  const handleClear = useCallback(() => {
    setPasteText(''); setResult(null); setSelected(new Set()); setSearch('')
    if (followersFileRef.current) followersFileRef.current.value = ''
    if (followingFileRef.current) followingFileRef.current.value = ''
  }, [])

  const handleDemo = useCallback(() => {
    setPasteText(JSON.stringify({
      followers: [
        { username: "alice_wonder" }, { username: "bob_builder" }, { username: "carol_singer" },
        { username: "david_photographer" }, { username: "eve_artist" }, { username: "frank_chef" },
        { username: "grace_dancer" }, { username: "henry_writer" }
      ],
      following: [
        { username: "alice_wonder" }, { username: "bob_builder" }, { username: "charlie_musician" },
        { username: "diana_fitness" }, { username: "ethan_tech" }, { username: "fiona_travel" },
        { username: "george_food" }, { username: "hannah_fashion" }, { username: "ian_sports" },
        { username: "julia_books" }
      ]
    }, null, 2))
  }, [])

  const toggleSelect = (u) => {
    setSelected(prev => { const next = new Set(prev); next.has(u) ? next.delete(u) : next.add(u); return next })
  }

  const selectAll = () => setSelected(new Set(filteredList))
  const selectNone = () => setSelected(new Set())

  const copySelected = async () => {
    const list = selected.size > 0 ? [...selected] : filteredList
    await navigator.clipboard.writeText(list.join('\n'))
    setCopied(true); setTimeout(() => setCopied(false), 1500)
  }

  const exportCSV = (list, label) => {
    if (!list.length) return
    const csvLines = ['S.No.,Account ID,Name,URL to Account']
    list.forEach((u, i) => csvLines.push(`${i + 1},${u},${u},"=HYPERLINK(""https://instagram.com/${u}"",""Open Profile"")"`))
    downloadCSV(csvLines, `${label}-${new Date().toISOString().slice(0, 10)}.csv`)
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"
  const fileInputClass = "w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-indigo-500/20 file:text-indigo-400 hover:file:bg-indigo-500/30 file:cursor-pointer"

  return (
    <ToolLayout
      title="Instagram Auditor"
      desc="Find non-followers, fans & mutuals. Upload your Instagram data export for privacy-first client-side analysis."
      icon="🔍" iconBg="rgba(236,72,153,0.08)"
      category="social" slug="instagram-auditor"
      faq={[
        { q: "What is Instagram Auditor?", a: "A privacy-first tool that analyzes your Instagram follower data. Upload your Instagram export files to find who doesn't follow you back, discover fans, and analyze mutual connections." },
        { q: "How to get my Instagram data?", a: "Go to Instagram Settings → Privacy and Security → Download Your Information → Select 'Followers and following' → Choose JSON or HTML format → Request download." },
        { q: "Is my data safe?", a: "Yes. All processing happens entirely in your browser. No data is uploaded to any server." },
      ]}
      howItWorks={[
        'Download your Instagram data export from Settings → Privacy and Security.',
        'Upload your followers.json and following.json files, or paste the data.',
        'View non-followers, fans, and mutual connections with search and export.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Instagram Auditor", "applicationCategory": "SocialNetworkingApplication",
        "url": "https://www.uptools.in/instagram-auditor/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Upload Section */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <h2 className="text-lg font-bold text-white text-center">📤 Upload Instagram Data</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Followers file</label>
              <input ref={followersFileRef} type="file" accept=".json,.csv,.txt,.html" className={fileInputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Following file</label>
              <input ref={followingFileRef} type="file" accept=".json,.csv,.txt,.html" className={fileInputClass} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Or paste data here</label>
            <textarea value={pasteText} onChange={e => setPasteText(e.target.value)}
              placeholder={'Paste JSON, HTML, CSV, or username list (one per line)\n\nExample:\nuser1\nuser2\nuser3'}
              rows={5}
              className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 resize-none [color-scheme:dark]" />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
            <input type="checkbox" checked={caseSensitive} onChange={e => setCaseSensitive(e.target.checked)}
              className="accent-indigo-500" />
            Case sensitive usernames
          </label>
          <div className="flex gap-3 flex-wrap">
            <button onClick={handleAnalyze}
              className="flex-1 py-3 rounded-xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all active:scale-[0.98]">
              🔍 Analyze Data
            </button>
            <button onClick={handleDemo}
              className="px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-400 text-sm font-bold hover:text-white transition-all">
              🧪 Demo
            </button>
            <button onClick={handleClear}
              className="px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-400 text-sm font-bold hover:text-white transition-all">
              🗑️ Clear
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div ref={resultRef} className="space-y-4" style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            {/* Stats */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Following', value: result.followingCount, color: 'text-cyan-400' },
                { label: 'Followers', value: result.followersCount, color: 'text-indigo-400' },
                { label: 'Non-followers', value: result.nonFollowers.length, color: 'text-red-400' },
                { label: 'Mutuals', value: result.mutuals.length, color: 'text-emerald-400' },
              ].map(s => (
                <div key={s.label} className="text-center p-3 bg-black/20 rounded-xl">
                  <div className={`text-xl font-extrabold ${s.color}`}>{s.value.toLocaleString()}</div>
                  <div className="text-xs text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Export buttons */}
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => exportCSV(result.nonFollowers, 'non-followers')}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-indigo-500 text-white hover:bg-indigo-400 transition-all">
                📄 Non-Followers CSV
              </button>
              <button onClick={() => exportCSV(result.fans, 'fans')}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">
                ⭐ Fans CSV
              </button>
              <button onClick={() => exportCSV(result.mutuals, 'mutuals')}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">
                🤝 Mutuals CSV
              </button>
            </div>

            {/* Search */}
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="🔍 Search usernames..."
              className={inputClass} />

            {/* View mode tabs */}
            <div className="flex gap-2">
              {[
                { key: 'non', label: '👥 Non-followers', count: result.nonFollowers.length },
                { key: 'fans', label: '⭐ Fans', count: result.fans.length },
                { key: 'mutual', label: '🤝 Mutuals', count: result.mutuals.length },
              ].map(m => (
                <button key={m.key} onClick={() => { setViewMode(m.key); setSelected(new Set()) }}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === m.key ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30' : 'bg-white/[0.06] text-slate-500 border border-white/[0.08]'}`}>
                  {m.label} ({m.count})
                </button>
              ))}
            </div>

            {/* Bulk actions */}
            <div className="flex gap-2 flex-wrap items-center">
              <button onClick={selectAll} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">✓ Select All</button>
              <button onClick={selectNone} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">✗ Clear</button>
              <button onClick={copySelected}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/[0.08] text-slate-400 hover:text-white'}`}>
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
              {selected.size > 0 && <span className="text-xs text-indigo-400 font-semibold">{selected.size} selected</span>}
            </div>

            {/* User list */}
            <div className="space-y-2">
              {filteredList.length === 0 ? (
                <div className="text-center py-10 rounded-2xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
                  <div className="text-3xl mb-2 opacity-20">📭</div>
                  <p className="text-sm text-slate-600">No results found</p>
                </div>
              ) : (
                filteredList.map(u => (
                  <div key={u}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${selected.has(u) ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-white/[0.02] border-white/[0.08] hover:bg-indigo-500/5 hover:border-indigo-500/15'}`}>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <input type="checkbox" checked={selected.has(u)} onChange={() => toggleSelect(u)}
                        className="accent-indigo-500 shrink-0" />
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm shrink-0">
                        {u[0]?.toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <a href={`https://instagram.com/${u}`} target="_blank" rel="noopener noreferrer"
                          className="text-sm font-semibold text-white hover:text-indigo-400 transition-colors truncate block">
                          {u}
                        </a>
                        <div className="text-xs text-slate-500">@{u}</div>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0 ml-2">
                      <a href={`https://instagram.com/${u}`} target="_blank" rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-pink-500 text-white hover:bg-pink-400 transition-all no-underline">
                        📱 Profile
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🔍</div>
            <p className="text-sm text-slate-600 font-medium">Upload your Instagram data or paste it to analyze</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
