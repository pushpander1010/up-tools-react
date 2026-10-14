import { useState, useCallback, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

function parseLrc(text) {
  const lines = []
  const re = /\[(\d{1,3}):(\d{2})(?:[.:](\d{1,3}))?\](.*)/
  for (const raw of (text || '').split(/\r?\n/)) {
    const m = raw.match(re)
    if (m) {
      const min = parseInt(m[1], 10), sec = parseInt(m[2], 10)
      let ms = (min * 60 + sec) * 1000
      if (m[3]) { const f = m[3]; ms += f.length === 3 ? parseInt(f, 10) : parseInt(f, 10) * (f.length === 2 ? 10 : 100) }
      lines.push({ ms, text: (m[4] || '').trim() })
    }
  }
  lines.sort((a, b) => a.ms - b.ms)
  return lines
}

function fmtLrc(ms) {
  const m = Math.floor(ms / 60000), s = Math.floor((ms % 60000) / 1000), cs = Math.floor((ms % 1000) / 10)
  return `[${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}]`
}
function fmtSrt(ms) {
  const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000), s = Math.floor((ms % 60000) / 1000), x = ms % 1000
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(x).padStart(3, '0')}`
}
function fmtClock(ms) {
  const m = Math.floor(ms / 60000), s = Math.floor((ms % 60000) / 1000)
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function lrc_lyrics_converter() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [input, setInput] = useState('')
  const [converted, setConverted] = useState(false)
  const [error, setError] = useState('')

  const lines = useMemo(() => parseLrc(input), [input])
  const plain = useMemo(() => lines.map(l => l.text).filter(Boolean).join('\n'), [lines])
  const srt = useMemo(() => lines.map((l, i) => {
    const end = i + 1 < lines.length ? lines[i + 1].ms : l.ms + 3000
    return `${i + 1}\n${fmtSrt(l.ms)} --> ${fmtSrt(end)}\n${l.text || '(instrumental)'}\n`
  }).join('\n'), [lines])
  const duration = lines.length ? lines[lines.length - 1].ms : 0

  const download = useCallback((text, filename) => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = filename
    document.body.appendChild(a)
    a.click()
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove() }, 500)
  }, [])

  const handleConvert = useCallback(() => {
    setError('')
    if (!lines.length) { setError('No timestamped lines found. Paste LRC like [00:42.10] your lyric line.'); setConverted(false); return }
    setConverted(true)
    jumpTo()
  }, [lines, jumpTo])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-sky-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"

  return (
    <ToolLayout
      title="LRC Lyrics Converter — LRC to SRT & Plain Text"
      desc="Convert LRC lyrics free: LRC to SRT subtitles, LRC to plain text, retime previews and download .lrc, .srt or .txt. Works offline in your browser, no sign-up."
      icon="📝" iconBg="rgba(14,165,233,0.08)"
      category="tools" slug="lrc-lyrics-converter"
      faq={[
        { q: 'What does this converter do?', a: 'It reads timestamped LRC lyrics and converts them to SRT subtitles for video players or plain text for printing — plus stats like line count and song length.' },
        { q: 'How do I convert LRC to SRT?', a: 'Paste your LRC above and click Convert. Each lyric line becomes a subtitle timed from its timestamp to the next line, ready to download as a .srt file.' },
        { q: 'My LRC has no milliseconds — will it work?', a: 'Yes. Both [02:15] and [02:15.40] formats parse fine, and lines are auto-sorted by time if they are out of order.' },
        { q: 'Is my pasted lyrics uploaded anywhere?', a: 'No. All parsing happens offline in your browser with JavaScript — nothing leaves your device.' },
        { q: 'How do I use the SRT with a video?', a: 'Save the .srt next to the video with the same filename (video.mp4 + video.srt) — VLC, MX Player, and YouTube Studio all load it automatically.' },
        { q: 'Is it free without sign-up?', a: 'Yes — unlimited conversions and downloads, free with no account.' },
      ]}
      howItWorks={[
        'Paste your timestamped LRC lyrics into the box.',
        'Click Convert to get plain text, SRT subtitles, and timing stats.',
        'Copy or download the result as .lrc, .srt, or .txt.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "LRC Lyrics Converter — LRC to SRT & Plain Text", "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Any", "url": "https://www.uptools.in/lrc-lyrics-converter/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 p-4">
          <p className="text-sm text-sky-300 font-semibold">📝 LRC → SRT, LRC → plain text, retimed and downloadable — 100% offline.</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Paste LRC lyrics</label>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={9}
            placeholder={"[00:12.00] Look at the stars\n[00:17.40] Look how they shine for you"} className={inputClass + " font-mono text-sm"} />
        </div>
        <button onClick={handleConvert}
          className="w-full py-4 rounded-2xl bg-sky-500 text-white font-bold text-sm hover:bg-sky-400 transition-all duration-200 active:scale-[0.98]">
          📝 Convert Lyrics
        </button>
        {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">❌ {error}</div>}
        {converted && lines.length > 0 && (
          <div ref={resultRef} className="rounded-3xl border-2 border-sky-500/15 bg-sky-500/[0.04] p-6 sm:p-8"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider">Converted</h3>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-5 text-center">
              <div className="rounded-xl bg-black/30 p-3"><div className="text-xl font-extrabold text-white">{lines.length}</div><div className="text-xs text-slate-400">lines</div></div>
              <div className="rounded-xl bg-black/30 p-3"><div className="text-xl font-extrabold text-white">{fmtClock(duration)}</div><div className="text-xs text-slate-400">last line at</div></div>
              <div className="rounded-xl bg-black/30 p-3"><div className="text-xl font-extrabold text-white">{plain.split(/\s+/).filter(Boolean).length}</div><div className="text-xs text-slate-400">words</div></div>
            </div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Plain text preview</label>
            <pre className="max-h-48 overflow-y-auto whitespace-pre-wrap text-sm text-slate-200 bg-black/30 rounded-xl p-4 leading-relaxed mb-4">{plain.slice(0, 3000)}</pre>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">SRT preview</label>
            <pre className="max-h-48 overflow-y-auto whitespace-pre-wrap text-sm text-slate-200 bg-black/30 rounded-xl p-4 leading-relaxed">{srt.slice(0, 3000)}</pre>
            <div className="grid sm:grid-cols-3 gap-3 mt-5">
              <button onClick={() => download(lines.map(l => `${fmtLrc(l.ms)} ${l.text}`).join('\n'), 'lyrics.lrc')}
                className="py-3 rounded-xl bg-sky-500 text-white font-bold text-sm hover:bg-sky-400 transition-all">⬇️ .LRC</button>
              <button onClick={() => download(srt, 'lyrics.srt')}
                className="py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-200 font-bold text-sm hover:text-white transition-all">⬇️ .SRT</button>
              <button onClick={() => download(plain, 'lyrics.txt')}
                className="py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-200 font-bold text-sm hover:text-white transition-all">⬇️ .TXT</button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
