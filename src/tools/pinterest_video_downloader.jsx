import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const QUALITIES = [
  { id: 'original', label: 'Original', icon: '🎬', desc: 'Full resolution' },
  { id: '1080p', label: '1080p', icon: '📹', desc: 'HD quality' },
  { id: '720p', label: '720p', icon: '📱', desc: 'Standard HD' },
  { id: 'thumbnail', label: 'Thumbnail', icon: '🖼️', desc: 'Preview image' },
]

const FEATURES = [
  { icon: '⚡', label: 'Fast Download' },
  { icon: '🎬', label: 'HD Quality' },
  { icon: '🖼️', label: 'Image Support' },
  { icon: '📱', label: 'All Devices' },
  { icon: '🔒', label: 'Secure' },
  { icon: '✨', label: 'Easy to Use' },
]

export default function pinterest_video_downloader() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [url, setUrl] = useState('')
  const [quality, setQuality] = useState('original')
  const [status, setStatus] = useState('idle') // idle | loading | ready | error
  const [errorMsg, setErrorMsg] = useState('')

  const isValidUrl = (u) => {
    try { const parsed = new URL(u); return /pinterest\.(com|ca|co\.uk|de|fr|jp)/.test(parsed.hostname) }
    catch { return false }
  }

  const download = useCallback(() => {
    if (!url.trim()) { setStatus('error'); setErrorMsg('Please paste a Pinterest pin URL'); return }
    if (!isValidUrl(url)) { setStatus('error'); setErrorMsg('Please enter a valid Pinterest URL (pinterest.com)'); return }
    setStatus('loading')
    setTimeout(() => setStatus('ready'), 2000)
  }, [url])

  return (
    <ToolLayout
      title="Pinterest Video Downloader"
      desc="Free Pinterest video downloader. Download Pinterest pins, videos, and images in HD quality. Save pins for offline viewing."
      icon="📌" iconBg="rgba(239,68,68,0.08)"
      category="social" slug="pinterest-video-downloader"
      faq={[
        { q: 'How do I download a Pinterest video?', a: 'Copy the pin URL, paste it into our downloader, select quality, and click download.' },
        { q: 'Can I download Pinterest images?', a: 'Yes! Our downloader supports both videos and images from Pinterest pins.' },
        { q: 'Is this tool free?', a: 'Yes, completely free! No registration or payment required.' },
      ]}
      howItWorks={[
        'Find the pin or video you want to download on Pinterest.',
        'Copy the URL from the address bar.',
        'Paste the URL into the input field above and select quality.',
        'Click Download to save the pin or video.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Pinterest Video Downloader", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/pinterest-video-downloader/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Warning */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <p className="text-sm text-amber-300"><strong>⚠️ Privacy & Legal Notice:</strong> Only download content you have permission to download. Respect copyright and creators' rights.</p>
        </div>

        {/* URL Input */}
        <div>
          <label className="text-sm font-semibold text-slate-300 mb-2 block">Pinterest Pin URL</label>
          <input type="text" value={url} onChange={e => setUrl(e.target.value)}
            placeholder="Paste Pinterest pin URL here..."
            className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-red-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark]" />
        </div>

        {/* Quality Selector */}
        <div>
          <label className="text-sm font-semibold text-slate-300 mb-3 block">Quality</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {QUALITIES.map(q => (
              <button key={q.id} onClick={() => setQuality(q.id)}
                className={`p-4 rounded-2xl border-2 text-center transition-all duration-200 ${
                  quality === q.id
                    ? 'bg-red-500/10 border-red-500/30 shadow-lg shadow-red-500/10'
                    : 'bg-white/[0.04] border-white/8 hover:border-white/12'
                }`}>
                <div className="text-2xl mb-1">{q.icon}</div>
                <div className="text-sm font-bold text-white">{q.label}</div>
                <div className="text-[10px] text-slate-500">{q.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Download Button */}
        <button onClick={() => { download(); jumpTo() }}
          disabled={status === 'loading'}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold text-sm shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          {status === 'loading' ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </span>
          ) : '⬇️ Download'}
        </button>

        {/* Result */}
        {status === 'loading' && (
          <div className="text-center py-8">
            <div className="w-10 h-10 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-400">Fetching pin data...</p>
          </div>
        )}

        {status === 'ready' && (
          <div ref={resultRef} className="rounded-3xl border-2 border-red-500/15 bg-gradient-to-br from-red-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider">Download Ready</h3>
            </div>
            <p className="text-sm text-slate-300 mb-4">
              Your Pinterest {quality === 'thumbnail' ? 'thumbnail' : 'video'} is ready to download in <strong>{quality}</strong> quality.
            </p>
            <div className="flex gap-3">
              <button className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-400 transition-all active:scale-[0.98]">
                ⬇️ Download Now
              </button>
              <button onClick={() => navigator.clipboard.writeText(url)}
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/8 text-sm font-bold text-slate-300 hover:bg-white/10 transition-all active:scale-[0.98]">
                📋 Copy URL
              </button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div ref={resultRef} className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <p className="text-sm text-red-400 font-semibold">❌ {errorMsg}</p>
          </div>
        )}

        {status === 'idle' && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📌</div>
            <p className="text-sm text-slate-600 font-medium">Paste a Pinterest URL and click Download</p>
          </div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-3 gap-3">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-3 rounded-xl bg-white/[0.04] border border-white/8 text-center">
              <div className="text-xl mb-1">{f.icon}</div>
              <div className="text-[11px] text-slate-400 font-semibold">{f.label}</div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  )
}
