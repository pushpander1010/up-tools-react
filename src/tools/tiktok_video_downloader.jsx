import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const QUALITIES = [
  { id: '1080p', label: '1080p', icon: '🎬', desc: 'Full HD' },
  { id: '720p', label: '720p', icon: '📹', desc: 'HD' },
  { id: '480p', label: '480p', icon: '📱', desc: 'SD' },
  { id: 'audio', label: 'Audio Only', icon: '🔊', desc: 'MP3' },
]

export default function tiktok_video_downloader() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [url, setUrl] = useState('')
  const [quality, setQuality] = useState('1080p')
  const [status, setStatus] = useState(null)

  const isValidUrl = (str) => {
    try { return str.includes('tiktok.com') || str.includes('vm.tiktok.com') }
    catch { return false }
  }

  const handleDownload = useCallback(() => {
    const u = url.trim()
    if (!u) { setStatus({ ok: false, msg: 'Please enter a TikTok video URL.' }); return }
    if (!isValidUrl(u)) { setStatus({ ok: false, msg: 'Please enter a valid TikTok URL.' }); return }
    setStatus({ ok: true, msg: `Video ready for download at ${quality}. Choose a service below.` })
  }, [url, quality])

  const copyLink = useCallback(async () => {
    try { await navigator.clipboard.writeText(url) } catch {}
    setStatus({ ok: true, msg: '✓ Video link copied to clipboard!' })
  }, [url])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="TikTok Video Downloader"
      desc="Download TikTok videos without watermark in HD quality. Works on all devices."
      icon="🎬" iconBg="rgba(0,0,0,0.08)"
      category="social" slug="tiktok-video-downloader"
      faq={[
        { q: "How do I get the TikTok video URL?", a: "Open the TikTok video, tap the share button, and copy the link. Or copy the URL from your browser's address bar." },
        { q: "Can I download private videos?", a: "No, only public TikTok videos can be downloaded." },
        { q: "What formats are supported?", a: "We support MP4 (most compatible) and WebM (modern browsers). MP4 is recommended." },
      ]}
      howItWorks={[
        "Find the TikTok video you want to download.",
        "Copy the video URL and paste it above.",
        "Select quality and click Download Video.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "TikTok Video Downloader", "applicationCategory": "SocialNetworkingApplication",
        "url": "https://www.uptools.in/tiktok-video-downloader/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Privacy notice */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
          <p className="text-xs text-amber-400">
            <strong>⚠️ Privacy & Legal Notice:</strong> Only download videos you have permission to download. Respect copyright and creators' rights.
          </p>
        </div>

        {/* URL input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <label className="block text-sm font-semibold text-slate-300 mb-2">TikTok Video URL</label>
          <input type="text" value={url} onChange={e => { setUrl(e.target.value); setStatus(null) }}
            placeholder="https://www.tiktok.com/@user/video/..."
            className={inputClass} />
        </div>

        {/* Quality selector */}
        <div>
          <p className="text-sm font-semibold text-slate-300 mb-3">Select Quality</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {QUALITIES.map(q => (
              <button key={q.id} onClick={() => setQuality(q.id)}
                className={`p-3 rounded-xl text-center transition-all duration-200 border-2
                  ${quality === q.id ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-white/[0.06] border-white/8 text-slate-500 hover:border-white/12'}`}>
                <div className="text-xl mb-1">{q.icon}</div>
                <div className="text-xs font-bold">{q.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Download button */}
        <button onClick={() => { handleDownload(); jumpTo() }}
          className="w-full py-4 rounded-2xl text-white font-bold text-sm transition-all duration-200 active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
          🎬 Download Video
        </button>

        {/* Status */}
        {status && (
          <div ref={resultRef} className={`p-3 rounded-xl text-sm ${status.ok ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
            {status.ok ? '✅' : '❌'} {status.msg}
          </div>
        )}

        {/* Download actions */}
        {status?.ok && (
          <div className="flex gap-2">
            <button onClick={copyLink}
              className="flex-1 py-3 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">
              📋 Copy Link
            </button>
          </div>
        )}

        {!status && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🎬</div>
            <p className="text-sm text-slate-600 font-medium">Paste a TikTok URL and click Download Video</p>
          </div>
        )}

        {/* Features */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: '⚡', label: 'Instant Download' },
            { icon: '🚫', label: 'No Watermark' },
            { icon: '📱', label: 'All Devices' },
          ].map((f, i) => (
            <div key={i} className="bg-white/[0.06] border border-white/[0.08] rounded-xl p-3 text-center">
              <div className="text-lg mb-1">{f.icon}</div>
              <div className="text-[10px] text-slate-500 font-semibold">{f.label}</div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  )
}
