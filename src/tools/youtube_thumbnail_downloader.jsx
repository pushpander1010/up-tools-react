import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function youtube_thumbnail_downloader() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [input, setInput] = useState('')
  const [videoId, setVideoId] = useState('')
  const [error, setError] = useState('')

  const extractVideoId = (url) => {
    const trimmed = url.trim()
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
      /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    ]
    for (const p of patterns) {
      const m = trimmed.match(p)
      if (m) return m[1]
    }
    return null
  }

  const handleExtract = () => {
    if (!input.trim()) {
      setError('Please enter a YouTube URL or video ID')
      setVideoId('')
      return
    }
    const id = extractVideoId(input)
    if (id) {
      setVideoId(id)
      setError('')
    } else {
      setError('Could not extract a video ID. Please enter a valid YouTube URL or 11-character video ID.')
      setVideoId('')
    }
  }

  const thumbnails = videoId
    ? [
        { label: 'Max Resolution', url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`, quality: 'maxresdefault' },
        { label: 'High Quality', url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`, quality: 'hqdefault' },
        { label: 'Medium Quality', url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`, quality: 'mqdefault' },
        { label: 'Default', url: `https://img.youtube.com/vi/${videoId}/default.jpg`, quality: 'default' },
      ]
    : []

  return (
    <ToolLayout
      title="YouTube Thumbnail Downloader"
      desc="YouTube Thumbnail Download – extract and download high-quality thumbnails from any YouTube video. No API key needed. Free online, no sign-up. Works on any device."
      icon="🎬" iconBg="rgba(239,68,68,0.08)"
      category="tools" slug="youtube-thumbnail-downloader"
      faq={[
        { q: 'How do I download a YouTube thumbnail?', a: 'Paste a YouTube video URL or video ID, click Extract, then click Download on the thumbnail you want.' },
        { q: 'Do I need an API key?', a: 'No. This tool works entirely client-side by parsing the video ID and fetching thumbnails from YouTube\'s CDN.' },
        { q: 'What resolutions are available?', a: 'You can get max resolution (maxresdefault), high quality (hqdefault), medium quality (mqdefault), and default thumbnails.' },
        { q: 'Does this work with YouTube Shorts?', a: 'Yes. Paste any YouTube Shorts URL and the tool extracts the video ID to fetch thumbnails.' },
        { q: 'Can I use the thumbnails commercially?', a: 'Thumbnails are owned by the video creator. Use them only for fair-use purposes such as commentary, reviews, or with permission.' },
        { q: 'Is this tool free?', a: 'Yes, completely free with no sign-up. Use it unlimited times online on any device.' },
      ]}
      howItWorks={[
        'Paste a YouTube video URL (e.g., youtube.com/watch?v=...) or the 11-character video ID into the input field.',
        'Click Extract to parse the video ID. The tool validates the ID client-side with no external API calls.',
        'View thumbnail previews at different resolutions (maxres, hqdefault, mqdefault, default).',
        'Click Open to view full-size or Download to save the thumbnail image to your device.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "YouTube Thumbnail Downloader", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/youtube-thumbnail-downloader/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <label className="block text-sm font-semibold text-slate-300 mb-2">YouTube Video URL or ID</label>
          <div className="flex gap-2">
            <input
              type="text" value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleExtract()}
              placeholder="e.g. https://youtube.com/watch?v=dQw4w9WgXcQ"
              className="flex-1 bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3 text-white font-semibold outline-none focus:border-red-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]" />
            <button onClick={handleExtract}
              className="px-5 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all duration-200 shrink-0">
              Extract
            </button>
          </div>
          {error && <p className="text-red-400 text-sm mt-2 font-medium">{error}</p>}
          {videoId && <p className="text-slate-400 text-xs mt-2">Video ID: <span className="text-white font-mono">{videoId}</span></p>}
        </div>

        {/* Thumbnails */}
        {videoId ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-red-500/15 bg-gradient-to-br from-red-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider">Available Thumbnails</h3>
            </div>

            <div className="grid gap-4">
              {thumbnails.map(t => (
                <div key={t.quality} className="bg-black/20 border border-white/[0.05] rounded-xl overflow-hidden">
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">{t.label}</span>
                    <div className="flex gap-2">
                      <a href={t.url} target="_blank" rel="noopener noreferrer"
                        className="px-3 py-1.5 text-xs font-bold bg-white/[0.08] hover:bg-white/[0.15] text-slate-300 rounded-lg transition-all duration-200">
                        Open
                      </a>
                      <a href={t.url} download={`thumbnail_${videoId}_${t.quality}.jpg`}
                        className="px-3 py-1.5 text-xs font-bold bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all duration-200">
                        Download
                      </a>
                    </div>
                  </div>
                  <img src={t.url} alt={`${t.label} thumbnail`}
                    className="w-full aspect-video object-cover"
                    onError={e => { e.target.style.display = 'none' }} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🎬</div>
            <p className="text-sm text-slate-600 font-medium">Paste a YouTube URL to get thumbnails</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
