import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const FORMATS = [
  { key: '1080', label: 'MP4 - 1080p (Full HD)' },
  { key: '720', label: 'MP4 - 720p (HD)' },
  { key: '480', label: 'MP4 - 480p (SD)' },
  { key: '360', label: 'MP4 - 360p (SD)' },
  { key: 'mp3', label: 'MP3 - Audio Only (320kbps)' }
]

const YT_REGEX = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/

export default function youtube_video_downloader() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [url, setUrl] = useState('')
  const [quality, setQuality] = useState('720')
  const [error, setError] = useState('')
  const [showWidget, setShowWidget] = useState(false)

  const handleSubmit = useCallback(() => {
    setError('')
    if (!url.trim()) { setError('Please paste a YouTube URL'); return }
    if (!YT_REGEX.test(url)) { setError('Please enter a valid YouTube URL'); return }
    setShowWidget(true)
    jumpTo()
  }, [url, jumpTo])

  return (
    <ToolLayout
      title="YouTube Video Downloader"
      desc="Download YouTube videos and audio in HD quality. Save videos as MP4 or audio as MP3 instantly."
      icon="🎥" iconBg="rgba(239,68,68,0.08)"
      category="social" slug="youtube-video-downloader"
      faq={[
        { q: 'Is this tool free?', a: 'Yes, completely free with no sign-ups required.' },
        { q: 'Is my data private?', a: 'Yes. Your input is used only to fetch the requested content. No data is stored on our servers.' },
        { q: 'Does it work on mobile?', a: 'Yes. All tools are mobile-responsive and work on any device.' }
      ]}
      howItWorks={[
        'Open a YouTube video and copy the URL from the address bar.',
        'Paste the YouTube URL in the input field above.',
        'Select your preferred format (MP4 video or MP3 audio).',
        'Click Download and the file will be saved to your device.'
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "YouTube Video Downloader", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/youtube-video-downloader/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <input
          type="text"
          value={url}
          onChange={(e) => { setUrl(e.target.value); setError('') }}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
          placeholder="Paste YouTube video URL here..."
          className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500"
        />

        {error && <p className="text-sm text-red-400 font-medium">❌ {error}</p>}

        {/* Quality Select */}
        <div>
          <label className="text-xs text-slate-500 font-medium mb-2 block">Resolution / Format</label>
          <select value={quality} onChange={(e) => setQuality(e.target.value)}
            className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3 text-white text-sm font-semibold outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]">
            {FORMATS.map(f => <option key={f.key} value={f.key}>{f.label}</option>)}
          </select>
        </div>

        <button onClick={handleSubmit}
          className="w-full py-4 rounded-2xl bg-red-500 text-white font-bold text-sm hover:bg-red-400 transition-all duration-200 active:scale-[0.98]">
          ⬇️ Download
        </button>

        {showWidget && YT_REGEX.test(url) ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-red-500/15 bg-gradient-to-br from-red-500/[0.06] via-white/[0.01] to-transparent p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider">Conversion Ready</h3>
            </div>
            <p className="text-white font-semibold mb-1">YouTube Video — {FORMATS.find(f => f.key === quality)?.label}</p>
            <p className="text-xs text-slate-400 mb-4">Click the button below to start your download.</p>
            <a href={`https://loader.to/api/button/?url=${encodeURIComponent(url)}&f=${quality}&color=ff0000`}
              target="_blank" rel="noopener noreferrer"
              className="block w-full py-4 rounded-2xl bg-red-500 text-white font-bold text-sm text-center hover:bg-red-400 transition-all">
              📥 Download Now
            </a>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🎥</div>
            <p className="text-sm text-slate-600 font-medium">Paste a YouTube URL and click Download</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
