import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function synced_lyrics_finder() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [artist, setArtist] = useState('')
  const [title, setTitle] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const download = useCallback((text, filename, mime) => {
    const blob = new Blob([text], { type: mime || 'text/plain;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = filename
    document.body.appendChild(a)
    a.click()
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove() }, 500)
  }, [])

  const handleSearch = useCallback(async () => {
    setError('')
    setResult(null)
    const ar = artist.trim(), ti = title.trim()
    if (!ar || !ti) { setError('Enter both artist and song title.'); return }
    setLoading(true)
    try {
      let found = null, source = ''
      try {
        const r = await fetch(`https://lrclib.net/api/get?artist_name=${encodeURIComponent(ar)}&track_name=${encodeURIComponent(ti)}`)
        if (r.ok) { const j = await r.json(); if (j && (j.plainLyrics || j.syncedLyrics)) { found = j; source = 'LRCLib' } }
      } catch { /* fall through to search */ }
      if (!found) {
        const s = await fetch(`https://lrclib.net/api/search?q=${encodeURIComponent(ar + ' ' + ti)}`)
        if (s.ok) {
          const arr = await s.json()
          if (Array.isArray(arr) && arr.length) {
            const d = await fetch(`https://lrclib.net/api/get/${arr[0].id}`)
            if (d.ok) { found = await d.json(); source = 'LRCLib' }
          }
        }
      }
      if (!found) {
        const o = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(ar)}/${encodeURIComponent(ti)}`)
        if (o.ok) {
          const j = await o.json()
          if (j && j.lyrics) { found = { trackName: ti, artistName: ar, plainLyrics: j.lyrics, syncedLyrics: null }; source = 'Lyrics.ovh (plain only)' }
        }
      }
      if (!found) { setError('No lyrics found for that artist + title. Check spelling and try again.'); return }
      setResult({ ...found, source })
      jumpTo()
    } catch {
      setError('Lyrics services are unreachable right now. Try again in a minute.')
    } finally {
      setLoading(false)
    }
  }, [artist, title, jumpTo])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-emerald-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Synced Lyrics Finder — LRC Lyrics Search"
      desc="Find synced lyrics free: search any song for line-timed LRC lyrics plus plain lyrics, preview with timestamps, copy or download the .lrc file. No sign-up."
      icon="🎵" iconBg="rgba(16,185,129,0.08)"
      category="tools" slug="synced-lyrics-finder"
      faq={[
        { q: 'What are synced lyrics?', a: 'Synced lyrics carry a timestamp per line ([00:42.10] …), so players can highlight each line as it is sung. Plain lyrics are the same words with no timing.' },
        { q: 'What is an LRC file?', a: 'LRC is the standard lyrics file format: one timestamped line per lyric, readable by most music players. This tool lets you download results as a ready .lrc file.' },
        { q: 'Where do the lyrics come from?', a: 'Results come from the free LRCLib database (synced + plain) with a Lyrics.ovh fallback for plain lyrics, covering millions of songs in 2026.' },
        { q: 'Why is there no synced version for my song?', a: 'About 1 in 3 songs has only plain lyrics because nobody has timed it yet. Download the plain version or convert it with our LRC converter.' },
        { q: 'Is this free without sign-up?', a: 'Yes — unlimited searches, previews, and downloads, free with no account or API key.' },
        { q: 'How do I use the downloaded LRC?', a: 'Save it next to your audio file with the same name (song.mp3 + song.lrc) — most Android and desktop players pick it up automatically.' },
      ]}
      howItWorks={[
        'Type the artist and song title above and click Find Lyrics.',
        'Preview the synced lines with timestamps or the plain words.',
        'Copy or download the result as .lrc (synced) or .txt (plain).',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "Synced Lyrics Finder — LRC Lyrics Search", "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Any", "url": "https://www.uptools.in/synced-lyrics-finder/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <p className="text-sm text-emerald-300 font-semibold">🎵 Line-timed LRC lyrics for millions of songs — search, preview, download free.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Artist</label>
            <input value={artist} onChange={e => setArtist(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Coldplay" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Song title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Yellow" className={inputClass} />
          </div>
        </div>
        <button onClick={handleSearch} disabled={loading}
          className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-400 transition-all duration-200 active:scale-[0.98] disabled:opacity-50">
          {loading ? '⏳ Searching...' : '🎵 Find Lyrics'}
        </button>
        {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">❌ {error}</div>}
        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-emerald-500/15 bg-emerald-500/[0.04] p-6 sm:p-8"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">{result.trackName} · {result.artistName}</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">Source: {result.source}{result.syncedLyrics ? ' · synced ✓' : ' · plain only'}</p>
            <pre className="max-h-80 overflow-y-auto whitespace-pre-wrap text-sm text-slate-200 bg-black/30 rounded-xl p-4 leading-relaxed">
              {(result.syncedLyrics || result.plainLyrics || '').slice(0, 6000)}
            </pre>
            <div className="grid sm:grid-cols-3 gap-3 mt-5">
              {result.syncedLyrics && (
                <button onClick={() => download(result.syncedLyrics, `${result.artistName} - ${result.trackName}.lrc`)}
                  className="py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-400 transition-all">⬇️ .LRC file</button>
              )}
              <button onClick={() => download(result.plainLyrics || '', `${result.artistName} - ${result.trackName}.txt`)}
                className="py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-200 font-bold text-sm hover:text-white transition-all">⬇️ .TXT file</button>
              <button onClick={() => { try { navigator.clipboard.writeText(result.syncedLyrics || result.plainLyrics || '') } catch {} }}
                className="py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-200 font-bold text-sm hover:text-white transition-all">📋 Copy</button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
