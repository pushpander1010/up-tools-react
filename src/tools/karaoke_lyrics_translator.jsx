import { useState, useCallback, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const LANGS = [
  ['hi', 'Hindi'], ['es', 'Spanish'], ['fr', 'French'], ['de', 'German'],
  ['pt', 'Portuguese'], ['it', 'Italian'], ['tr', 'Turkish'], ['pa', 'Punjabi'],
  ['bn', 'Bengali'], ['ta', 'Tamil'], ['te', 'Telugu'], ['ar', 'Arabic'],
]

export default function karaoke_lyrics_translator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [lyrics, setLyrics] = useState('')
  const [lang, setLang] = useState('hi')
  const [pairs, setPairs] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(3)
  const [active, setActive] = useState(0)
  const timer = useRef(null)

  useEffect(() => () => { if (timer.current) clearInterval(timer.current) }, [])

  useEffect(() => {
    if (timer.current) clearInterval(timer.current)
    if (playing && pairs.length) {
      timer.current = setInterval(() => setActive(a => (a + 1) % pairs.length), Math.max(1, speed) * 1000)
    }
    return () => { if (timer.current) clearInterval(timer.current) }
  }, [playing, speed, pairs.length])

  const handleTranslate = useCallback(async () => {
    setError('')
    setPairs([])
    setPlaying(false)
    setActive(0)
    const srcLines = lyrics.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
    if (!srcLines.length) { setError('Paste some lyrics first.'); return }
    if (srcLines.length > 120) { setError('Keep it under 120 lines per translation.'); return }
    setLoading(true)
    try {
      const chunks = []
      let cur = []
      let len = 0
      for (const ln of srcLines) {
        if (len + ln.length > 420 && cur.length) { chunks.push(cur); cur = []; len = 0 }
        cur.push(ln); len += ln.length + 1
      }
      if (cur.length) chunks.push(cur)
      const out = []
      for (const ch of chunks) {
        const q = encodeURIComponent(ch.join('\n'))
        const r = await fetch(`https://api.mymemory.translated.net/get?q=${q}&langpair=en|${lang}`)
        if (!r.ok) throw new Error('translate failed')
        const j = await r.json()
        const text = (j && j.responseData && j.responseData.translatedText) || ''
        const parts = text.split('\n')
        ch.forEach((orig, i) => out.push({ orig, trans: (parts[i] || '').trim() || '—' }))
        await new Promise(res => setTimeout(res, 400))
      }
      setPairs(out)
      jumpTo()
    } catch {
      setError('Translation service is busy. Wait a minute and try again.')
    } finally {
      setLoading(false)
    }
  }, [lyrics, lang, jumpTo])

  const download = useCallback(() => {
    const text = pairs.map(p => `${p.orig}\n${p.trans}\n`).join('\n')
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'translated-lyrics.txt'
    document.body.appendChild(a)
    a.click()
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove() }, 500)
  }, [pairs])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-violet-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Lyrics Translator + Karaoke Mode — Translate Songs"
      desc="Translate song lyrics free: English to Hindi, Spanish, French and 9 more languages, side-by-side original and translation, karaoke sing-along mode. No sign-up."
      icon="🎤" iconBg="rgba(139,92,246,0.08)"
      category="tools" slug="karaoke-lyrics-translator"
      faq={[
        { q: 'Which languages are supported?', a: '12 languages: Hindi, Spanish, French, German, Portuguese, Italian, Turkish, Punjabi, Bengali, Tamil, Telugu, and Arabic — all translated from English.' },
        { q: 'How accurate is the translation?', a: 'Good enough for meaning and sing-along fun, around 85–90% for common languages. Poetic wordplay and rhymes rarely survive translation in any tool.' },
        { q: 'What is karaoke mode?', a: 'Karaoke mode highlights one lyric line at a time at a speed you set (1–8 seconds per line), so you can sing along with the original and translated lines together.' },
        { q: 'Is there a line limit?', a: 'Yes — 120 lines per translation, because the free translation API caps each request at about 450 characters. Most songs fit in 3–5 requests.' },
        { q: 'Is it free without sign-up?', a: 'Yes — free translations, karaoke mode, and .txt downloads with no account. Heavy use may briefly rate-limit the shared quota.' },
        { q: 'Can I download the translation?', a: 'Yes — one click saves the original and translated lines side by side as a .txt file, ready to print or share.' },
      ]}
      howItWorks={[
        'Paste English lyrics, pick a target language, click Translate.',
        'Read the side-by-side original and translation.',
        'Press Karaoke mode to sing along line by line, or download the .txt.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "Lyrics Translator + Karaoke Mode — Translate Songs", "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Any", "url": "https://www.uptools.in/karaoke-lyrics-translator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-4">
          <p className="text-sm text-violet-300 font-semibold">🎤 Translate any lyrics to 12 languages + karaoke sing-along — free.</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Paste English lyrics</label>
          <textarea value={lyrics} onChange={e => setLyrics(e.target.value)} rows={8}
            placeholder={"Look at the stars\nLook how they shine for you"} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Translate to</label>
          <select value={lang} onChange={e => setLang(e.target.value)} className={inputClass}>
            {LANGS.map(([c, n]) => <option key={c} value={c}>{n}</option>)}
          </select>
        </div>
        <button onClick={handleTranslate} disabled={loading}
          className="w-full py-4 rounded-2xl bg-violet-500 text-white font-bold text-sm hover:bg-violet-400 transition-all duration-200 active:scale-[0.98] disabled:opacity-50">
          {loading ? '⏳ Translating...' : '🎤 Translate Lyrics'}
        </button>
        {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">❌ {error}</div>}
        {pairs.length > 0 && (
          <div ref={resultRef} className="rounded-3xl border-2 border-violet-500/15 bg-violet-500/[0.04] p-6 sm:p-8"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                <h3 className="text-sm font-bold text-violet-400 uppercase tracking-wider">{pairs.length} lines translated</h3>
              </div>
              <button onClick={download}
                className="px-4 py-2 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-200 font-bold text-xs hover:text-white transition-all">⬇️ .TXT</button>
            </div>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <button onClick={() => { setActive(0); setPlaying(p => !p) }}
                className="px-5 py-2.5 rounded-xl bg-violet-500 text-white font-bold text-sm hover:bg-violet-400 transition-all">
                {playing ? '⏸ Pause karaoke' : '▶ Karaoke mode'}
              </button>
              <label className="text-xs text-slate-400 font-semibold flex items-center gap-2">
                {speed}s/line
                <input type="range" min="1" max="8" value={speed} onChange={e => setSpeed(parseInt(e.target.value, 10))} className="accent-violet-500" />
              </label>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {pairs.map((p, i) => (
                <div key={i} className={`rounded-xl p-3 border transition-all ${i === active && playing ? 'border-violet-400/60 bg-violet-500/15' : 'border-white/[0.06] bg-black/30'}`}>
                  <div className="text-sm text-slate-100 font-semibold">{p.orig}</div>
                  <div className="text-sm text-violet-300 mt-0.5">{p.trans}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
