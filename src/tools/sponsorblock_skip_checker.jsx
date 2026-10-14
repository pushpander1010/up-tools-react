import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const CATS = ['sponsor', 'intro', 'outro', 'selfpromo', 'interaction', 'music_offtopic']

function fmt(sec) {
  const m = Math.floor(sec / 60), s = Math.floor(sec % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}
function extractId(input) {
  const t = (input || '').trim()
  if (/^[A-Za-z0-9_-]{11}$/.test(t)) return t
  try {
    const u = new URL(t)
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1).slice(0, 11)
    if (u.searchParams.get('v')) return u.searchParams.get('v').slice(0, 11)
    const m = t.match(/\/shorts\/([A-Za-z0-9_-]{11})/) || t.match(/\/embed\/([A-Za-z0-9_-]{11})/) || t.match(/\/live\/([A-Za-z0-9_-]{11})/)
    if (m) return m[1]
  } catch { /* plain text fallthrough */ }
  const m = t.match(/([A-Za-z0-9_-]{11})/)
  return m ? m[1] : ''
}

export default function sponsorblock_skip_checker() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCheck = useCallback(async () => {
    setError('')
    setResult(null)
    const id = extractId(url)
    if (!id) { setError('Paste a valid YouTube link or 11-character video ID.'); return }
    setLoading(true)
    try {
      const cats = encodeURIComponent(JSON.stringify(CATS))
      const r = await fetch(`https://sponsor.ajay.app/api/skipSegments?videoID=${id}&categories=${cats}`, { headers: { 'Accept': 'application/json' } })
      if (r.status === 404) { setResult({ id, segs: [] }); jumpTo(); return }
      if (!r.ok) throw new Error('api error')
      const j = await r.json()
      const segs = (Array.isArray(j) ? j : []).filter(s => s && s.actionType !== 'mute').map(s => ({
        from: s.segment[0], to: s.segment[1], cat: s.category || 'sponsor', votes: s.votes || 0,
      })).sort((a, b) => a.from - b.from)
      setResult({ id, segs })
      jumpTo()
    } catch {
      setError('SponsorBlock server is unreachable. Try again in a minute.')
    } finally {
      setLoading(false)
    }
  }, [url, jumpTo])

  const total = result ? result.segs.reduce((a, s) => a + (s.to - s.from), 0) : 0
  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-amber-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"

  return (
    <ToolLayout
      title="SponsorBlock Skip Checker — YouTube Sponsor Segments"
      desc="Check any YouTube video for sponsor, intro, outro and self-promo segments free. Paste a link, see skippable timestamps and total skip time. No sign-up."
      icon="⏭️" iconBg="rgba(245,158,11,0.08)"
      category="social" slug="sponsorblock-skip-checker"
      faq={[
        { q: 'What is SponsorBlock?', a: 'SponsorBlock is a crowdsourced database where viewers mark sponsor reads, intros, outros, and filler in YouTube videos so others can skip them — over 10 million segments marked to date.' },
        { q: 'How do I check a video?', a: 'Paste any youtube.com, youtu.be, Shorts, or embed link above (or just the 11-character video ID) and click Check Segments.' },
        { q: 'What do the categories mean?', a: 'Sponsor is paid promotions, intro/outro are channel bumpers, selfpromo is merch or Patreon plugs, interaction is subscribe begging, and music_offtopic is talking inside music videos.' },
        { q: 'What if it says no segments found?', a: 'That video simply has no crowdsourced marks yet — common for videos under 50,000 views. You can mark segments yourself with the free SponsorBlock browser extension.' },
        { q: 'Does this skip segments in the video?', a: 'No — this page only shows the timestamps. Auto-skipping needs the SponsorBlock extension or an app like the Square music client.' },
        { q: 'Is it free without sign-up?', a: 'Yes — unlimited checks, free with no account.' },
      ]}
      howItWorks={[
        'Paste a YouTube link or video ID above and click Check Segments.',
        'See every marked sponsor, intro, and promo segment with timestamps.',
        'Copy the timestamps or jump straight to them on YouTube.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "SponsorBlock Skip Checker — YouTube Sponsor Segments", "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Any", "url": "https://www.uptools.in/sponsorblock-skip-checker/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
          <p className="text-sm text-amber-300 font-semibold">⏭️ Crowdsourced sponsor, intro & filler timestamps for any YouTube video.</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">YouTube link or video ID</label>
          <input value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCheck()}
            placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className={inputClass} />
        </div>
        <button onClick={handleCheck} disabled={loading}
          className="w-full py-4 rounded-2xl bg-amber-500 text-white font-bold text-sm hover:bg-amber-400 transition-all duration-200 active:scale-[0.98] disabled:opacity-50">
          {loading ? '⏳ Checking...' : '⏭️ Check Segments'}
        </button>
        {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">❌ {error}</div>}
        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-amber-500/15 bg-amber-500/[0.04] p-6 sm:p-8"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
                {result.segs.length ? `${result.segs.length} segment${result.segs.length > 1 ? 's' : ''} · ${fmt(total)} skippable` : 'No segments marked'}
              </h3>
            </div>
            {result.segs.length === 0 ? (
              <p className="text-sm text-slate-400">Nobody has marked segments for this video yet. Watch it normally — or mark them with the SponsorBlock extension to help others.</p>
            ) : (
              <div className="space-y-2">
                {result.segs.map((s, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 rounded-xl bg-black/30 border border-white/[0.06] p-3">
                    <div>
                      <div className="text-sm text-slate-100 font-bold capitalize">{s.cat.replace('music_offtopic', 'music offtopic')}</div>
                      <div className="text-xs text-slate-400">{fmt(s.from)} → {fmt(s.to)} · saves {Math.round(s.to - s.from)}s · {s.votes} votes</div>
                    </div>
                    <a href={`https://www.youtube.com/watch?v=${result.id}&t=${Math.floor(s.from)}s`} target="_blank" rel="noopener noreferrer"
                      className="px-3 py-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-xs hover:bg-amber-500/25 transition-all no-underline shrink-0">▶ Jump</a>
                  </div>
                ))}
              </div>
            )}
            <a href={`https://www.youtube.com/watch?v=${result.id}`} target="_blank" rel="noopener noreferrer"
              className="block w-full py-3 mt-5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-300 font-bold text-sm text-center hover:text-white transition-all no-underline">
              📱 Open video on YouTube
            </a>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
