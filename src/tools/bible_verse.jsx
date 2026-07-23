import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const TRANSLATIONS = [
  { id: 'KJV', label: 'KJV' },
  { id: 'ASV', label: 'ASV' },
  { id: 'WEB', label: 'WEB' },
]

const QUICK_REFS = ['John 3:16', 'Psalm 23', 'Genesis 1:1', 'Proverbs 3:5-6', 'Romans 8:28', 'Philippians 4:13', 'Isaiah 41:10', 'Matthew 11:28', 'Jeremiah 29:11', '1 Corinthians 13:4-7', 'Matthew 5:14', 'Psalm 46:10']

const DAILY_VERSES = [
  { ref: 'Jeremiah 29:11', text: '"For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, plans to give you hope and a future."', trans: 'NIV' },
  { ref: 'Psalm 23:1', text: 'The Lord is my shepherd; I shall not want.', trans: 'KJV' },
  { ref: 'John 14:6', text: 'Jesus answered, "I am the way and the truth and the life. No one comes to the Father except through me."', trans: 'NIV' },
  { ref: 'Proverbs 3:5-6', text: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.', trans: 'NIV' },
  { ref: 'Romans 8:28', text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.', trans: 'NIV' },
  { ref: 'Philippians 4:13', text: 'I can do all things through Christ who strengthens me.', trans: 'NKJV' },
  { ref: 'Isaiah 40:31', text: 'But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.', trans: 'NIV' },
]

const RANDOM_REFS = ['Psalm 23', 'John 3:16', 'Romans 8:28', 'Philippians 4:13', 'Proverbs 3:5', 'Isaiah 41:10', 'Matthew 11:28', 'Jeremiah 29:11', 'Psalm 46:10', '1 Corinthians 13:4', 'Matthew 5:14', 'Psalm 91:1']

export default function bible_verse() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [refInput, setRefInput] = useState('')
  const [activeTrans, setActiveTrans] = useState('KJV')
  const [verse, setVerse] = useState(null)
  const [status, setStatus] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const daily = DAILY_VERSES[new Date().getDate() % DAILY_VERSES.length]

  const lookup = useCallback(async (ref) => {
    if (!ref) return
    setStatus(`Looking up ${ref}...`)
    setVerse(null)
    setError('')
    try {
      const r = await fetch(`https://bible-api.com/${encodeURIComponent(ref)}?translation=${activeTrans.toLowerCase()}`)
      const d = await r.json()
      if (d.text) {
        setVerse({ text: d.text.trim(), reference: d.reference || ref })
        setStatus('')
      } else {
        setError('Verse not found. Try a different reference like "John 3:16" or "Psalm 23".')
        setStatus('')
      }
    } catch {
      setError('Error fetching verse. Please try again.')
      setStatus('')
    }
  }, [activeTrans])

  const randomVerse = useCallback(() => {
    const ref = RANDOM_REFS[Math.floor(Math.random() * RANDOM_REFS.length)]
    setRefInput(ref)
    lookup(ref)
    jumpTo()
  }, [lookup, jumpTo])

  const copyVerse = useCallback(async () => {
    if (!verse) return
    const text = `${verse.text}\n— ${verse.reference} (${activeTrans})`
    try { await navigator.clipboard.writeText(text) } catch { /* fallback */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [verse, activeTrans])

  const shareVerse = useCallback(() => {
    if (!verse) return
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(verse.text.substring(0, 200) + '\n— ' + verse.reference)}`, '_blank')
  }, [verse])

  return (
    <ToolLayout
      title="Bible Verse"
      desc="Look up Bible verses with multiple translations."
      icon="✝️" iconBg="rgba(99,102,241,0.08)"
      category="text" slug="bible-verse"
      faq={[
        { q: "What translations are available?", a: "KJV (King James Version), ASV (American Standard Version), and WEB (World English Bible)." },
        { q: "How do I search for a verse?", a: "Type a reference like 'John 3:16' or 'Psalm 23' and press Enter or click Lookup." },
      ]}
      howItWorks={[
        "Select a translation (KJV, ASV, or WEB).",
        "Enter a Bible reference like 'John 3:16' or 'Psalm 23'.",
        "Click Lookup or press Enter to see the verse.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Bible Verse", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/bible-verse/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Daily Verse */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">✨ Verse of the Day</div>
          <p className="text-sm text-slate-300 italic">{daily.text}</p>
          <p className="text-xs text-slate-500 mt-1">{daily.ref} ({daily.trans})</p>
        </div>

        {/* Translation Chips */}
        <div className="flex gap-2">
          {TRANSLATIONS.map(t => (
            <button key={t.id} onClick={() => setActiveTrans(t.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${activeTrans === t.id ? 'bg-purple-500/15 border-purple-500/30 text-purple-400' : 'bg-white/[0.06] border-white/[0.08] text-slate-500 hover:text-white'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Quick References */}
        <div className="flex flex-wrap gap-2">
          {QUICK_REFS.map(r => (
            <button key={r} onClick={() => { setRefInput(r); lookup(r); jumpTo() }}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">
              {r}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <div className="flex gap-2">
            <input type="text" value={refInput} onChange={e => setRefInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { lookup(refInput.trim()); jumpTo() } }}
              placeholder="Enter verse reference (e.g., John 3:16)..."
              className="flex-1 bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500/40 transition-all placeholder:text-slate-600" />
            <button onClick={() => { lookup(refInput.trim()); jumpTo() }}
              className="px-5 py-3 rounded-xl text-sm font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30 transition-all">
              🔎 Lookup
            </button>
            <button onClick={randomVerse}
              className="px-5 py-3 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">
              🎲 Random
            </button>
          </div>
        </div>

        {status && <div className="text-xs text-slate-400 text-center">{status}</div>}

        {/* Verse Result */}
        {verse && (
          <div ref={resultRef} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-6">
            <div className="text-xs text-purple-400 font-bold mb-2">{verse.reference} ({activeTrans})</div>
            <p className="text-sm text-white leading-relaxed mb-4">{verse.text}</p>
            <div className="flex gap-2">
              <button onClick={copyVerse}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white'}`}>
                {copied ? '✅ Copied!' : '📋 Copy'}
              </button>
              <button onClick={shareVerse}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">
                🐦 Share
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 text-sm text-slate-400 text-center">
            {error}
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
