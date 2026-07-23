import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const QUOTES = [
  { q: "The only way to do great work is to love what you do.", a: "Steve Jobs", c: "motivational" },
  { q: "Innovation distinguishes between a leader and a follower.", a: "Steve Jobs", c: "motivational" },
  { q: "Your time is limited, don't waste it living someone else's life.", a: "Steve Jobs", c: "motivational" },
  { q: "Stay hungry, stay foolish.", a: "Steve Jobs", c: "motivational" },
  { q: "The future belongs to those who believe in the beauty of their dreams.", a: "Eleanor Roosevelt", c: "motivational" },
  { q: "It does not matter how slowly you go as long as you do not stop.", a: "Confucius", c: "motivational" },
  { q: "Success is not final, failure is not fatal: it is the courage to continue that counts.", a: "Winston Churchill", c: "motivational" },
  { q: "Believe you can and you're halfway there.", a: "Theodore Roosevelt", c: "motivational" },
  { q: "The only impossible journey is the one you never begin.", a: "Tony Robbins", c: "motivational" },
  { q: "Act as if what you do makes a difference. It does.", a: "William James", c: "motivational" },
  { q: "Life is what happens when you're busy making other plans.", a: "John Lennon", c: "life" },
  { q: "In the end, it's not the years in your life that count. It's the life in your years.", a: "Abraham Lincoln", c: "life" },
  { q: "Get busy living or get busy dying.", a: "Stephen King", c: "life" },
  { q: "The greatest thing you'll ever learn is just to love and be loved in return.", a: "Eden Ahbez", c: "love" },
  { q: "The only true wisdom is in knowing you know nothing.", a: "Socrates", c: "wisdom" },
  { q: "In three words I can sum up everything I've learned about life: it goes on.", a: "Robert Frost", c: "wisdom" },
  { q: "Success usually comes to those who are too busy to be looking for it.", a: "Henry David Thoreau", c: "success" },
  { q: "Don't be afraid to give up the good to go for the great.", a: "John D. Rockefeller", c: "success" },
  { q: "Imagination is more important than knowledge.", a: "Albert Einstein", c: "science" },
  { q: "The important thing is not to stop questioning.", a: "Albert Einstein", c: "science" },
  { q: "I think, therefore I am.", a: "René Descartes", c: "philosophy" },
  { q: "Courage is not the absence of fear, but the triumph over it.", a: "Nelson Mandela", c: "courage" },
  { q: "Creativity is intelligence having fun.", a: "Albert Einstein", c: "creativity" },
  { q: "Happiness depends upon ourselves.", a: "Aristotle", c: "happiness" },
  { q: "The greatest leader is not the one who does the greatest things.", a: "Ronald Reagan", c: "leadership" },
  { q: "Time you enjoy wasting is not wasted time.", a: "Marthe Troly-Curtin", c: "time" },
  { q: "Gratitude turns what we have into enough.", a: "Melody Beattie", c: "gratitude" },
  { q: "Persistence guarantees that results are inevitable.", a: "Yogananda", c: "persistence" },
  { q: "Be the change that you wish to see in the world.", a: "Mahatma Gandhi", c: "change" },
  { q: "Knowledge is power.", a: "Francis Bacon", c: "knowledge" },
  { q: "Kindness is a language which the deaf can hear and the blind can see.", a: "Mark Twain", c: "kindness" },
  { q: "Technology is a useful servant but a dangerous master.", a: "Christian Lous Lange", c: "technology" },
  { q: "A day without laughter is a day wasted.", a: "Charlie Chaplin", c: "humor" },
  { q: "Education is the most powerful weapon which you can use to change the world.", a: "Nelson Mandela", c: "education" },
  { q: "The best and most beautiful things in the world cannot be seen or even touched — they must be felt with the heart.", a: "Helen Keller", c: "kindness" },
  { q: "Progress is impossible without change.", a: "George Bernard Shaw", c: "change" },
  { q: "Fall seven times, stand up eight.", a: "Japanese Proverb", c: "persistence" },
  { q: "The creative adult is the child who survived.", a: "Ursula K. Le Guin", c: "creativity" },
  { q: "No man ever steps in the same river twice.", a: "Heraclitus", c: "philosophy" },
  { q: "The two most powerful warriors are patience and time.", a: "Leo Tolstoy", c: "time" },
]

const CATS = [...new Set(QUOTES.map(q => q.c))]

export default function quote_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [activeCat, setActiveCat] = useState('all')
  const [current, setCurrent] = useState(null)
  const [favs, setFavs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('uptools.quotes.favs') || '[]') } catch { return [] }
  })
  const [copied, setCopied] = useState(false)
  const [search, setSearch] = useState('')
  const [lastIndex, setLastIndex] = useState(-1)

  const daily = useMemo(() => {
    const today = new Date()
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
    return QUOTES[seed % QUOTES.length]
  }, [])

  const getQuote = useCallback(() => {
    const pool = activeCat === 'all' ? QUOTES : QUOTES.filter(q => q.c === activeCat)
    let idx
    do { idx = Math.floor(Math.random() * pool.length) } while (idx === lastIndex && pool.length > 1)
    setLastIndex(idx)
    setCurrent(pool[idx])
  }, [activeCat, lastIndex])

  const toggleFav = useCallback(() => {
    if (!current) return
    setFavs(prev => {
      const idx = prev.findIndex(f => f.q === current.q)
      const next = idx >= 0 ? prev.filter((_, i) => i !== idx) : [current, ...prev]
      localStorage.setItem('uptools.quotes.favs', JSON.stringify(next))
      return next
    })
  }, [current])

  const removeFav = useCallback((i) => {
    setFavs(prev => {
      const next = prev.filter((_, idx) => idx !== i)
      localStorage.setItem('uptools.quotes.favs', JSON.stringify(next))
      return next
    })
  }, [])

  const copyQuote = useCallback(async () => {
    if (!current) return
    const text = `"${current.q}" — ${current.a}`
    try { await navigator.clipboard.writeText(text) } catch { /* fallback */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [current])

  const filtered = useMemo(() => {
    if (!search.trim()) return []
    const term = search.toLowerCase()
    return QUOTES.filter(q => q.q.toLowerCase().includes(term) || q.a.toLowerCase().includes(term))
  }, [search])

  const handleSearch = useCallback((e) => {
    const term = e.target.value
    setSearch(term)
    if (!term.trim()) { getQuote(); return }
    const matches = QUOTES.filter(q => q.q.toLowerCase().includes(term.toLowerCase()) || q.a.toLowerCase().includes(term.toLowerCase()))
    if (matches.length) setCurrent(matches[Math.floor(Math.random() * matches.length)])
  }, [getQuote])

  return (
    <ToolLayout
      title="Quote Generator"
      desc="Generate inspiring quotes by category. Save favorites and share."
      icon="💬" iconBg="rgba(99,102,241,0.08)"
      category="text" slug="quote-generator"
      faq={[
        { q: "How many quotes are available?", a: "Over 40 quotes across 15+ categories including motivational, wisdom, love, and more." },
        { q: "Can I save my favorite quotes?", a: "Yes! Click the heart icon to save quotes to your favorites list (stored locally)." },
      ]}
      howItWorks={[
        "Select a category or search for keywords.",
        "Click 'New Quote' to get a random quote from the selected category.",
        "Save favorites, copy, or share quotes on social media.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Quote Generator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/quote-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Daily Quote */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">✨ Quote of the Day</div>
          <p className="text-sm text-slate-300 italic">"{daily.q}"</p>
          <p className="text-xs text-slate-500 mt-1">— {daily.a}</p>
        </div>

        {/* Search */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <input type="text" value={search} onChange={handleSearch}
            placeholder="Search quotes or authors..."
            className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600" />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => { setActiveCat('all'); setSearch(''); getQuote() }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${activeCat === 'all' ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400' : 'bg-white/[0.06] border-white/[0.08] text-slate-500 hover:text-white'}`}>
            All
          </button>
          {CATS.map(c => (
            <button key={c} onClick={() => { setActiveCat(c); setSearch(''); getQuote() }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all border ${activeCat === c ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400' : 'bg-white/[0.06] border-white/[0.08] text-slate-500 hover:text-white'}`}>
              {c}
            </button>
          ))}
        </div>

        {/* Quote Card */}
        {current && (
          <div ref={resultRef} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-6 text-center">
            <p className="text-lg text-white italic mb-3">"{current.q}"</p>
            <p className="text-sm text-slate-400 mb-4">— {current.a}</p>
            <div className="text-xs text-indigo-400 font-semibold mb-4 capitalize">{current.c}</div>
            <div className="flex gap-2 justify-center flex-wrap">
              <button onClick={getQuote}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/30 transition-all">
                🔄 New Quote
              </button>
              <button onClick={toggleFav}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">
                {favs.some(f => f.q === current.q) ? '❤️ Saved' : '🤍 Save'}
              </button>
              <button onClick={copyQuote}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white'}`}>
                {copied ? '✅ Copied!' : '📋 Copy'}
              </button>
            </div>
          </div>
        )}

        {!current && (
          <button onClick={() => { getQuote(); jumpTo() }}
            className="glow-btn w-full py-4 rounded-2xl text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            ✨ Get Quote
          </button>
        )}

        {/* Search Results */}
        {search.trim() && filtered.length > 0 && (
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 space-y-2">
            <div className="text-xs font-bold text-slate-400">{filtered.length} results</div>
            {filtered.slice(0, 5).map((q, i) => (
              <button key={i} onClick={() => { setCurrent(q); setSearch('') }}
                className="w-full text-left p-3 rounded-xl bg-black/20 hover:bg-black/30 transition-all">
                <p className="text-sm text-white truncate">"{q.q}"</p>
                <p className="text-xs text-slate-500">— {q.a}</p>
              </button>
            ))}
          </div>
        )}

        {/* Favorites */}
        {favs.length > 0 && (
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
            <div className="text-xs font-bold text-slate-400 mb-2">❤️ Favorites ({favs.length})</div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {favs.map((f, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded-xl bg-black/20">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white truncate">"{f.q}"</p>
                    <p className="text-xs text-slate-500">— {f.a}</p>
                  </div>
                  <button onClick={() => removeFav(i)} className="text-xs text-slate-600 hover:text-red-400">✕</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
