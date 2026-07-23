import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const YT_REGEX = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/

export default function youtube_shorts_downloader() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [url, setUrl] = useState('')
  const [quality, setQuality] = useState('720')
  const [showWidget, setShowWidget] = useState(false)
  const [error, setError] = useState('')

  const download = useCallback(() => {
    if (!url.trim()) { setError('Please paste a YouTube URL'); return }
    const match = url.match(YT_REGEX)
    if (!match) { setError('Please enter a valid YouTube URL'); return }
    setError('')
    setShowWidget(true)
    jumpTo()
  }, [url, jumpTo])

  return (
    <ToolLayout
      title="YouTube Shorts Downloader"
      desc="Download YouTube Shorts videos in HD quality."
      icon="📱" iconBg="rgba(239,68,68,0.08)"
      category="social" slug="youtube-shorts-downloader"
      faq={[
        { q: "What quality can I download?", a: "You can choose from 360p, 720p, and 1080p quality options." },
        { q: "Is this tool free?", a: "Yes, this tool is completely free to use." },
      ]}
      howItWorks={[
        "Paste a YouTube Shorts URL in the input field.",
        "Select your preferred video quality.",
        "Click Download to process the video.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "YouTube Shorts Downloader", "applicationCategory": "MultimediaApplication",
        "url": "https://www.uptools.in/youtube-shorts-downloader/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">YouTube Shorts URL</label>
            <input type="text" value={url} onChange={e => { setUrl(e.target.value); setError('') }}
              placeholder="https://youtube.com/shorts/..."
              className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-red-500/40 transition-all placeholder:text-slate-600" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">Quality</label>
            <div className="flex gap-2">
              {['360', '720', '1080'].map(q => (
                <button key={q} onClick={() => setQuality(q)}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all border ${quality === q ? 'bg-red-500/15 border-red-500/30 text-red-400' : 'bg-white/[0.06] border-white/[0.08] text-slate-500'}`}>
                  {q}p
                </button>
              ))}
            </div>
          </div>

          {error && <div className="text-xs text-red-400">{error}</div>}

          <button onClick={download}
            className="glow-btn w-full py-3 rounded-xl text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
            📥 Download
          </button>
        </div>

        {/* Widget */}
        {showWidget && (
          <div ref={resultRef} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
            <div className="text-xs font-bold text-slate-400 mb-3">📥 Download Widget</div>
            <div className="bg-black/20 rounded-xl p-4 text-center">
              <p className="text-sm text-slate-400 mb-3">Click the button below to proceed with download:</p>
              <a href={`https://loader.to/api/button/?url=${encodeURIComponent(url)}&f=mp4&color=ff0000`}
                target="_blank" rel="noopener noreferrer"
                className="inline-block px-6 py-3 rounded-xl text-sm font-bold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all">
                🎬 Download {quality}p Video
              </a>
              <p className="text-xs text-slate-600 mt-3">Opens in a new tab. Follow the instructions there.</p>
            </div>
          </div>
        )}

        {!showWidget && (
          <div className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📱</div>
            <p className="text-sm text-slate-600 font-medium">Paste a YouTube Shorts URL to download</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
