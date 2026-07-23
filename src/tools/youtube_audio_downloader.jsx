import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const YT_RE = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"
const QUALITY_OPTIONS = [
  { value: '320', label: '320 kbps (Best)', icon: '🎵' },
  { value: '256', label: '256 kbps', icon: '🎶' },
  { value: '192', label: '192 kbps', icon: '🔊' },
  { value: '128', label: '128 kbps (Smallest)', icon: '🔈' }
]

export default function youtube_audio_downloader() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [url, setUrl] = useState('')
  const [quality, setQuality] = useState('320')
  const [status, setStatus] = useState('idle')

  const handleDownload = useCallback(() => {
    if (!url.trim()) return
    if (!YT_RE.test(url.trim())) return
    setStatus('loading')
    jumpTo()
    setTimeout(() => setStatus('ready'), 2000)
  }, [url, jumpTo])

  return (
    <ToolLayout
      title="YouTube Audio Downloader"
      desc="Download audio from YouTube videos as MP3. Extract music instantly. Free, fast, no registration needed."
      icon="🎵" iconBg="rgba(239,68,68,0.08)"
      category="social" slug="youtube-audio-downloader"
      faq={[
        { q: 'Is it legal to download YouTube audio?', a: 'Downloading for personal use is generally acceptable, but respect copyright laws. Don\'t distribute copyrighted content.' },
        { q: 'What audio quality should I choose?', a: '320 kbps is best quality, 128 kbps is smallest file size. Choose based on your needs.' }
      ]}
      howItWorks={['Find the YouTube video you want to download.', 'Copy the video URL.', 'Paste the URL, select quality, and click Download.']}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        name: "YouTube Audio Downloader", applicationCategory: "UtilityApplication",
        offers: { "@type": "Offer", price: "0" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6 sm:p-8 space-y-4">
          <label className="block text-sm font-semibold text-slate-400">YouTube URL</label>
          <input className={inputClass} value={url} onChange={e => setUrl(e.target.value)}
            placeholder="Paste YouTube video URL here..." />

          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-3">Audio Quality</label>
            <div className="grid grid-cols-2 gap-2">
              {QUALITY_OPTIONS.map(q => (
                <button key={q.value} onClick={() => setQuality(q.value)}
                  className={`p-3 rounded-xl text-sm font-semibold transition-all border-2 ${quality === q.value
                    ? 'bg-red-500/15 text-red-400 border-red-500/30' : 'bg-white/[0.04] border-white/8 text-slate-500 hover:border-white/12'}`}>
                  <span className="mr-1">{q.icon}</span> {q.label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleDownload}
            className="w-full py-4 rounded-2xl bg-red-500 text-white font-bold text-sm hover:bg-red-400 transition-all duration-200 active:scale-[0.98]">
            🎵 Download MP3
          </button>
        </div>

        {status === 'idle' && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🎵</div>
            <p className="text-sm text-slate-600 font-medium">Paste a YouTube URL and click Download</p>
          </div>
        )}

        {status === 'loading' && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 text-center"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-slate-400">Converting audio...</p>
          </div>
        )}

        {status === 'ready' && (
          <div ref={resultRef} className="rounded-3xl border-2 border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 text-center"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="text-4xl mb-3">✅</div>
            <p className="text-sm text-emerald-400 font-semibold">Audio ready! In production, the download would start automatically.</p>
            <p className="text-xs text-slate-500 mt-2">This is a demo — the actual download connects to a third-party conversion service.</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
