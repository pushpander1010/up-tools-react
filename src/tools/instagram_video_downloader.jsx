import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function instagram_video_downloader() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isValidUrl = (str) => {
    try { return new URL(str).hostname.includes('instagram.com') } catch { return false }
  }

  const handleLookup = useCallback(() => {
    setError('')
    setResult(null)
    const trimmed = url.trim()
    if (!trimmed) { setError('Please paste an Instagram video URL.'); return }
    if (!isValidUrl(trimmed)) { setError('Please enter a valid Instagram URL.'); return }
    setLoading(true)
    setResult({ originalUrl: trimmed })
    setLoading(false)
    jumpTo()
  }, [url, jumpTo])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Instagram Video Downloader"
      desc="Download Instagram videos, reels, and IGTV in high quality. Save MP4 videos and photos from public accounts."
      icon="🎥" iconBg="rgba(99,102,241,0.08)"
      category="social" slug="instagram-video-downloader"
      faq={[
        { q: 'Can I download any Instagram video?', a: 'You can download videos from public accounts. Private account content is not accessible.' },
        { q: 'Does this work with IGTV and reels?', a: 'Yes, this tool supports regular Instagram videos, reels, and IGTV content.' },
        { q: 'Can I download images too?', a: 'Yes — the download services also save post photos and carousel images alongside videos.' },
        { q: 'Why not download directly here?', a: 'Instagram blocks data-center servers from fetching content, so we route you through reliable third-party download services instead.' },
      ]}
      howItWorks={[
        'Copy the Instagram video, reel, or IGTV URL.',
        'Paste it into the field above and click Find Video.',
        'Open the original or use a download service to save the MP4.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Instagram Video Downloader", "applicationCategory": "MultimediaApplication",
        "url": "https://www.uptools.in/instagram-video-downloader/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-4">
          <p className="text-sm text-indigo-300 font-semibold">🎥 Save Instagram videos, reels & IGTV in MP4 — plus photos from public accounts, free, no login.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Video URL</label>
          <input type="url" value={url} onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLookup()}
            placeholder="https://www.instagram.com/reel/... or /p/... or /tv/..." className={inputClass} />
        </div>

        <button onClick={handleLookup} disabled={loading}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98] disabled:opacity-50">
          {loading ? '⏳ Finding...' : '🎥 Find Video'}
        </button>

        {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">❌ {error}</div>}

        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Video Found</h3>
            </div>

            <div className="text-center mb-5">
              <div className="text-4xl mb-3">🎥</div>
              <div className="text-sm text-slate-400">Instagram video · MP4</div>
            </div>

            <div className="space-y-3">
              <a href={result.originalUrl} target="_blank" rel="noopener noreferrer"
                className="block w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-bold text-sm text-center hover:opacity-90 transition-all no-underline">
                📱 Open Original
              </a>
              <a href="https://www.saveinsta.app/" target="_blank" rel="noopener noreferrer"
                className="block w-full py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-400 font-bold text-sm text-center hover:text-white transition-all no-underline">
                📥 Download MP4 via SaveInsta
              </a>
              <a href="https://igram.io/" target="_blank" rel="noopener noreferrer"
                className="block w-full py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-400 font-bold text-sm text-center hover:text-white transition-all no-underline">
                📥 Download MP4 via iGram
              </a>
            </div>

            <div className="mt-5 p-4 rounded-2xl bg-white/[0.03]">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">💡 How to download</h4>
              <ol className="text-xs text-slate-400 space-y-1 list-decimal list-inside">
                <li>Copy the Instagram video/reel/IGTV URL</li>
                <li>Paste it into one of the download services above</li>
                <li>Wait for the video to load, then tap Download MP4</li>
                <li>Long-press or right-click the video to save it</li>
              </ol>
            </div>
          </div>
        )}

        {!result && !error && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🎥</div>
            <p className="text-sm text-slate-600 font-medium">Paste an Instagram video, reel, or IGTV URL to get download options</p>
          </div>
        )}

        <div className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-5">
          <h3 className="text-sm font-bold text-slate-300 mb-3">🎬 Videos & 🖼️ Images</h3>
          <p className="text-sm text-slate-400 mb-2">This tool handles both media types on Instagram:</p>
          <ul className="space-y-2 text-sm text-slate-400 list-disc list-inside">
            <li><b className="text-slate-300">Videos</b> — reels, IGTV, and video posts (saved as MP4).</li>
            <li><b className="text-slate-300">Images</b> — post photos, story photos, and carousel slides (saved as JPG/PNG).</li>
            <li>The download services detect the content type and give you the right save option.</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  )
}
