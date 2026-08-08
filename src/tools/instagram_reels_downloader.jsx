import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function instagram_reels_downloader() {
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
    if (!trimmed) { setError('Please paste an Instagram Reel URL.'); return }
    if (!isValidUrl(trimmed)) { setError('Please enter a valid Instagram URL.'); return }
    setLoading(true)
    setResult({ originalUrl: trimmed })
    setLoading(false)
    jumpTo()
  }, [url, jumpTo])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Instagram Reels Downloader"
      desc="Download Instagram Reels in high quality — save reel videos and images from public accounts, free and no login."
      icon="🎬" iconBg="rgba(236,72,153,0.08)"
      category="social" slug="instagram-reels-downloader"
      faq={[
        { q: 'Can I download any Instagram Reel?', a: 'You can download Reels from public accounts. Private account content is not accessible.' },
        { q: 'What quality are the downloads?', a: 'Reels are downloaded in the highest available quality, typically up to 1080p.' },
        { q: 'Can I download reel photos or images?', a: 'Yes — the download services also save reel cover photos and any images on the post.' },
        { q: 'Why not download directly here?', a: 'Instagram blocks data-center servers from fetching content, so we route you through reliable third-party download services instead.' },
      ]}
      howItWorks={[
        'Copy the Instagram Reel URL from the app or browser.',
        'Paste it into the field above and click Find Reel.',
        'Open the original or use a download service to save the video or image.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Instagram Reels Downloader", "applicationCategory": "MultimediaApplication",
        "url": "https://www.uptools.in/instagram-reels-downloader/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-2xl border border-pink-500/30 bg-pink-500/10 p-4">
          <p className="text-sm text-pink-300 font-semibold">🎬 Save Instagram Reels in high quality — video and images from public accounts, free, no login.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Reel URL</label>
          <input type="url" value={url} onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLookup()}
            placeholder="https://www.instagram.com/reel/..." className={inputClass} />
        </div>

        <button onClick={handleLookup} disabled={loading}
          className="w-full py-4 rounded-2xl bg-pink-500 text-white font-bold text-sm hover:bg-pink-400 transition-all duration-200 active:scale-[0.98] disabled:opacity-50">
          {loading ? '⏳ Finding...' : '🎬 Find Reel'}
        </button>

        {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">❌ {error}</div>}

        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-pink-500/15 bg-gradient-to-br from-pink-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
              <h3 className="text-sm font-bold text-pink-400 uppercase tracking-wider">Reel Found</h3>
            </div>

            <div className="text-center mb-5">
              <div className="text-4xl mb-3">🎬</div>
              <div className="text-sm text-slate-400">Instagram Reel · up to 1080p</div>
            </div>

            <div className="space-y-3">
              <a href={result.originalUrl} target="_blank" rel="noopener noreferrer"
                className="block w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-violet-500 text-white font-bold text-sm text-center hover:opacity-90 transition-all no-underline">
                📱 Open Original
              </a>
              <a href="https://www.saveinsta.app/" target="_blank" rel="noopener noreferrer"
                className="block w-full py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-400 font-bold text-sm text-center hover:text-white transition-all no-underline">
                📥 Download Reel via SaveInsta
              </a>
              <a href="https://www.snapsave.app/" target="_blank" rel="noopener noreferrer"
                className="block w-full py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-400 font-bold text-sm text-center hover:text-white transition-all no-underline">
                📥 Download Reel via SnapSave
              </a>
            </div>

            <div className="mt-5 p-4 rounded-2xl bg-white/[0.03]">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">💡 How to download</h4>
              <ol className="text-xs text-slate-400 space-y-1 list-decimal list-inside">
                <li>Copy the Reel URL from the Instagram app</li>
                <li>Paste it into one of the download services above</li>
                <li>Wait for the Reel to load, then tap Download</li>
                <li>Long-press or right-click the video to save it</li>
              </ol>
            </div>
          </div>
        )}

        {!result && !error && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🎬</div>
            <p className="text-sm text-slate-600 font-medium">Paste an Instagram Reel URL to get download options</p>
          </div>
        )}

        <div className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-5">
          <h3 className="text-sm font-bold text-slate-300 mb-3">🎬 Videos & 🖼️ Images</h3>
          <p className="text-sm text-slate-400 mb-2">Reels can contain both media types — this tool handles them all:</p>
          <ul className="space-y-2 text-sm text-slate-400 list-disc list-inside">
            <li><b className="text-slate-300">Videos</b> — the full Reel clip, saved as MP4.</li>
            <li><b className="text-slate-300">Images</b> — Reel cover/thumbnail and any photos, saved as JPG/PNG.</li>
            <li>The download services detect the media type and give you the right save option.</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  )
}
