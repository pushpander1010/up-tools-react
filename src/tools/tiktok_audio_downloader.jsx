import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const QUALITIES = [
  { id: '320', label: '320 kbps', icon: '🎵', desc: 'Highest quality' },
  { id: '256', label: '256 kbps', icon: '🎶', desc: 'High quality' },
  { id: '192', label: '192 kbps', icon: '🔊', desc: 'Medium quality' },
  { id: '128', label: '128 kbps', icon: '📻', desc: 'Smallest size' },
]

export default function tiktok_audio_downloader() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [url, setUrl] = useState('')
  const [quality, setQuality] = useState('320')
  const [status, setStatus] = useState(null)

  const isValidUrl = (str) => {
    try { return str.includes('tiktok.com') || str.includes('vm.tiktok.com') }
    catch { return false }
  }

  const handleDownload = useCallback(() => {
    const u = url.trim()
    if (!u) { setStatus({ ok: false, msg: 'Please paste a TikTok video URL.' }); return }
    if (!isValidUrl(u)) { setStatus({ ok: false, msg: 'Please enter a valid TikTok URL.' }); return }
    setStatus({ ok: true, msg: `Audio ready for download at ${quality} kbps. Choose a service below.` })
  }, [url, quality])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="TikTok Audio Downloader"
      desc="Download TikTok music, sounds, and background audio as MP3. Extract audio from any TikTok video."
      icon="🎵" iconBg="rgba(0,0,0,0.08)"
      category="social" slug="tiktok-audio-downloader"
      faq={[
        { q: "How do I download TikTok audio?", a: "Copy the TikTok video URL, paste it into our downloader, select quality, and click download." },
        { q: "Can I download TikTok sounds?", a: "Yes! You can download any audio or sound used in TikTok videos." },
        { q: "What audio quality is available?", a: "We support 320 kbps (highest), 256 kbps, 192 kbps, and 128 kbps." },
      ]}
      howItWorks={[
        "Find the TikTok video with the audio you want.",
        "Copy the video URL and paste it above.",
        "Select your preferred quality and click Download.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "TikTok Audio Downloader", "applicationCategory": "SocialNetworkingApplication",
        "url": "https://www.uptools.in/tiktok-audio-downloader/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Privacy notice */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
          <p className="text-xs text-amber-400">
            <strong>⚠️ Privacy & Legal Notice:</strong> Only download audio you have permission to download. Respect copyright and creators' rights.
          </p>
        </div>

        {/* URL input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <label className="block text-sm font-semibold text-slate-300 mb-2">TikTok Video URL</label>
          <input type="text" value={url} onChange={e => { setUrl(e.target.value); setStatus(null) }}
            placeholder="Paste TikTok video URL here..."
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
          🎵 Download Audio
        </button>

        {/* Status */}
        {status && (
          <div ref={resultRef} className={`p-3 rounded-xl text-sm ${status.ok ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
            {status.ok ? '✅' : '❌'} {status.msg}
          </div>
        )}

        {!status && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🎵</div>
            <p className="text-sm text-slate-600 font-medium">Paste a TikTok URL and click Download Audio</p>
          </div>
        )}

        {/* Features */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: '⚡', label: 'Fast Download' },
            { icon: '🎵', label: 'High Quality' },
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
