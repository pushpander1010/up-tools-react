import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"
const QUALITY_OPTIONS = [
  { value: 'original', label: 'Original', icon: '🎬' },
  { value: '720p', label: '720p', icon: '📹' },
  { value: '480p', label: '480p', icon: '📱' },
  { value: 'audio', label: 'Audio Only', icon: '🔊' }
]

export default function telegram_video_downloader() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [url, setUrl] = useState('')
  const [quality, setQuality] = useState('original')
  const [status, setStatus] = useState('idle')

  const handleDownload = useCallback(() => {
    if (!url.trim()) return
    setStatus('loading')
    jumpTo()
    setTimeout(() => setStatus('ready'), 2000)
  }, [url, jumpTo])

  return (
    <ToolLayout
      title="Telegram Video Downloader"
      desc="Download videos, photos, and media from Telegram channels and groups in HD quality."
      icon="📱" iconBg="rgba(14,165,233,0.08)"
      category="social" slug="telegram-video-downloader"
      faq={[
        { q: 'How do I download a Telegram video?', a: 'Copy the Telegram message link, paste it into our downloader, select quality, and click download.' },
        { q: 'Can I download from private channels?', a: 'Only public channels and groups are supported. Private channels require special access permissions.' }
      ]}
      howItWorks={['Open Telegram and find the message with the video.', 'Long-press and select Copy Link.', 'Paste the link, select quality, and click Download.']}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        name: "Telegram Video Downloader", applicationCategory: "UtilityApplication",
        offers: { "@type": "Offer", price: "0" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-3xl border-2 border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-xs text-amber-400">⚠️ Only download content you have permission to download. Respect copyright and creators' rights.</p>
        </div>

        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6 sm:p-8 space-y-4">
          <label className="block text-sm font-semibold text-slate-400">Telegram Message Link</label>
          <input className={inputClass} value={url} onChange={e => setUrl(e.target.value)}
            placeholder="Paste Telegram message link here..." />

          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-3">Quality</label>
            <div className="grid grid-cols-2 gap-2">
              {QUALITY_OPTIONS.map(q => (
                <button key={q.value} onClick={() => setQuality(q.value)}
                  className={`p-3 rounded-xl text-sm font-semibold transition-all border-2 ${quality === q.value
                    ? 'bg-sky-500/15 text-sky-400 border-sky-500/30' : 'bg-white/[0.04] border-white/8 text-slate-500 hover:border-white/12'}`}>
                  <span className="mr-1">{q.icon}</span> {q.label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleDownload}
            className="w-full py-4 rounded-2xl bg-sky-500 text-white font-bold text-sm hover:bg-sky-400 transition-all duration-200 active:scale-[0.98]">
            📥 Download
          </button>
        </div>

        {status === 'idle' && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📱</div>
            <p className="text-sm text-slate-600 font-medium">Paste a Telegram link and click Download</p>
          </div>
        )}

        {status === 'loading' && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 text-center"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-slate-400">Processing download...</p>
          </div>
        )}

        {status === 'ready' && (
          <div ref={resultRef} className="rounded-3xl border-2 border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 text-center"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="text-4xl mb-3">✅</div>
            <p className="text-sm text-emerald-400 font-semibold">Download ready! In production, the download would start automatically.</p>
            <p className="text-xs text-slate-500 mt-2">This is a demo — actual download connects to a third-party service.</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
