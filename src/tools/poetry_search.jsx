import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const AUTHORS = ['William Shakespeare', 'Emily Dickinson', 'William Wordsworth', 'John Keats', 'Percy Bysshe Shelley', 'Lord Byron', 'Robert Frost', 'Langston Hughes', 'Edgar Allan Poe', 'Maya Angelou', 'Walt Whitman', 'Christina Rossetti', 'Alfred Tennyson', 'Rudyard Kipling', 'William Blake']

export default function poetry_search() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [searchInput, setSearchInput] = useState('')
  const [poems, setPoems] = useState([])
  const [selectedPoem, setSelectedPoem] = useState(null)
  const [status, setStatus] = useState('')
  const [copied, setCopied] = useState(false)

  const searchPoems = useCallback(async (q) => {
    if (!q) return
    setStatus('Searching poems...')
    setPoems([])
    setSelectedPoem(null)

    const endpoints = [
      `https://poetrydb.org/title/${encodeURIComponent(q)}/poems`,
      `https://poetrydb.org/author/${encodeURIComponent(q)}/poems`,
      `https://poetrydb.org/lines,1:1/${encodeURIComponent(q)}/poems`,
    ]

    for (const url of endpoints) {
      try {
        const r = await fetch(url)
        if (r.ok) {
          const d = await r.json()
          if (d.status === 200 && d.poems?.length) {
            setPoems(d.poems)
            setStatus(`${d.poems.length} poem${d.poems.length !== 1 ? 's' : ''} found`)
            return
          }
        }
      } catch { /* try next endpoint */ }
    }
    setStatus('No poems found. Try a different search.')
  }, [])

  const searchByAuthor = useCallback(async (author) => {
    setSearchInput(author)
    setStatus(`Loading ${author} poems...`)
    setPoems([])
    setSelectedPoem(null)
    try {
      const r = await fetch(`https://poetrydb.org/author/${encodeURIComponent(author)}/poems`)
      const d = await r.json()
      if (d.status === 200) {
        setPoems(d.poems)
        setStatus(`${d.poems.length} poem${d.poems.length !== 1 ? 's' : ''} found`)
      }
    } catch {
      setStatus('Error loading poems.')
    }
  }, [])

  const copyPoem = useCallback(async () => {
    if (!selectedPoem) return
    const text = `${selectedPoem.title}\nby ${selectedPoem.author}\n\n${(selectedPoem.lines || []).join('\n')}`
    try { await navigator.clipboard.writeText(text) } catch { /* fallback */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [selectedPoem])

  const sharePoem = useCallback(() => {
    if (!selectedPoem) return
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${selectedPoem.title}" by ${selectedPoem.author}`)}`, '_blank')
  }, [selectedPoem])

  return (
    <ToolLayout
      title="Poetry Search"
      desc="Search thousands of poems by title, author, or first line."
      icon="📖" iconBg="rgba(99,102,241,0.08)"
      category="text" slug="poetry-search"
      faq={[
        { q: "What poetry database does this use?", a: "This tool uses PoetryDB, a free API containing thousands of classic poems." },
        { q: "Can I search by first line?", a: "Yes! Enter any line from a poem and the tool will try to find matching poems." },
      ]}
      howItWorks={[
        "Type a poem title, author name, or first line in the search box.",
        "Click Search or press Enter to find matching poems.",
        "Click a poem to read the full text, copy it, or share on Twitter.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Poetry Search", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/poetry-search/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Author Chips */}
        <div className="flex flex-wrap gap-2">
          {AUTHORS.map(a => (
            <button key={a} onClick={() => { searchByAuthor(a); jumpTo() }}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">
              {a.split(' ').pop()}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <div className="flex gap-2">
            <input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { searchPoems(searchInput.trim()); jumpTo() } }}
              placeholder="Search poems by title, author, or first line..."
              className="flex-1 bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600" />
            <button onClick={() => { searchPoems(searchInput.trim()); jumpTo() }}
              className="px-5 py-3 rounded-xl text-sm font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/30 transition-all">
              🔎 Search
            </button>
          </div>
        </div>

        {/* Status */}
        {status && <div className="text-xs text-slate-400 text-center">{status}</div>}

        {/* Selected Poem */}
        {selectedPoem && (
          <div ref={resultRef} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-6">
            <button onClick={() => setSelectedPoem(null)}
              className="text-xs text-cyan-400 mb-3 hover:text-cyan-300 transition-all">
              ← Back to results
            </button>
            <h2 className="text-lg font-bold text-white mb-1">{selectedPoem.title}</h2>
            <div className="text-sm text-slate-400 mb-4">{selectedPoem.author}</div>
            <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
              {(selectedPoem.lines || []).join('\n')}
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={copyPoem}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white'}`}>
                {copied ? '✅ Copied!' : '📋 Copy Poem'}
              </button>
              <button onClick={sharePoem}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">
                🐦 Share
              </button>
            </div>
          </div>
        )}

        {/* Poem List */}
        {poems.length > 0 && !selectedPoem && (
          <div className="space-y-2" ref={resultRef}>
            {poems.map((p, i) => (
              <button key={i} onClick={() => setSelectedPoem(p)}
                className="w-full text-left p-4 rounded-2xl bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] transition-all">
                <div className="text-sm font-bold text-white">{p.title}</div>
                <div className="text-xs text-slate-400">{p.author}</div>
                <div className="text-xs text-slate-500 mt-1 truncate">
                  {(p.lines || []).slice(0, 2).join(' / ')}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Empty State */}
        {poems.length === 0 && !selectedPoem && !status && (
          <div className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📖</div>
            <p className="text-sm text-slate-600 font-medium">Search for poems or click an author above</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
