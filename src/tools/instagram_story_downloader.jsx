import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function instagram_story_downloader() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const extractContentId = (input) => {
    input = input.trim()
    const m = input.match(/instagram\.com\/(?:stories|p|reel|tv)\/(?:[a-zA-Z0-9._-]+\/)?([a-zA-Z0-9_-]+)/)
    return m ? m[1] : null
  }

  const handleLookup = useCallback(() => {
    setError('')
    setResult(null)
    const id = extractContentId(url)
    if (!id) { setError('Please enter a valid Instagram story, reel, or post URL.'); return }
    setLoading(true)
    setResult({
      id,
      originalUrl: url.startsWith('http') ? url : `https://www.instagram.com/${id}/`,
    })
    setLoading(false)
    jumpTo()
  }, [url, jumpTo])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Instagram Story Downloader"
      desc="Download Instagram stories, reels, and posts — save photos and videos from public accounts in high quality."
      icon="📥" iconBg="rgba(236,72,153,0.08)"
      category="social" slug="instagram-story-downloader"
      faq={[
        { q: "Can I download private stories?", a: "No, this tool only works with public Instagram content. Private accounts and followers-only stories cannot be downloaded." },
        { q: "Can I download both photos and videos?", a: "Yes. Stories, posts, and reels can contain images or videos, and the services below handle both formats." },
        { q: "Do I need to log in?", a: "No login is needed for public content. Paste the URL and use a download service." },
        { q: "Why can't you download directly here?", a: "Instagram blocks browser-to-server downloads from data centers, so we route you through reliable third-party download services instead." },
      ]}
      howItWorks={[
        "Copy the URL of the story, reel, or post from Instagram.",
        "Paste it into the field above and click Find Content.",
        "Open the original or use a download service to save the photo or video.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Instagram Story Downloader", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/instagram-story-downloader/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-2xl border border-pink-500/30 bg-pink-500/10 p-4">
          <p className="text-sm text-pink-300 font-semibold">📥 Save Instagram stories, posts & reels — photos and videos from public accounts, free, no sign-up.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Instagram URL</label>
          <input type="url" value={url} onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLookup()}
            placeholder="https://www.instagram.com/stories/username/1234567890/ or /p/..."
            className={inputClass} />
        </div>

        <button onClick={handleLookup} disabled={loading}
          className="w-full py-4 rounded-2xl bg-pink-500 text-white font-bold text-sm hover:bg-pink-400 transition-all duration-200 active:scale-[0.98] disabled:opacity-50">
          {loading ? '⏳ Finding...' : '📥 Find Content'}
        </button>

        {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">❌ {error}</div>}

        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-pink-500/15 bg-gradient-to-br from-pink-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
              <h3 className="text-sm font-bold text-pink-400 uppercase tracking-wider">Content Found</h3>
            </div>

            <div className="text-center mb-5">
              <div className="text-4xl mb-3">📥</div>
              <div className="text-sm text-slate-400">Content ID: <span className="text-white font-mono">{result.id}</span></div>
            </div>

            <div className="space-y-3">
              <a href={result.originalUrl} target="_blank" rel="noopener noreferrer"
                className="block w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white font-bold text-sm text-center hover:opacity-90 transition-all no-underline">
                📱 Open Original
              </a>
              <a href="https://www.saveinsta.app/" target="_blank" rel="noopener noreferrer"
                className="block w-full py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-400 font-bold text-sm text-center hover:text-white transition-all no-underline">
                📥 Download via SaveInsta
              </a>
              <a href="https://www.storysaver.net/" target="_blank" rel="noopener noreferrer"
                className="block w-full py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-400 font-bold text-sm text-center hover:text-white transition-all no-underline">
                📥 Download via StorySaver
              </a>
            </div>

            <div className="mt-5 p-4 rounded-2xl bg-white/[0.03]">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">💡 How to download</h4>
              <ol className="text-xs text-slate-400 space-y-1 list-decimal list-inside">
                <li>Copy the story, reel, or post URL from Instagram</li>
                <li>Paste it into one of the download services above</li>
                <li>Choose the photo or video you want to save</li>
                <li>Long-press or right-click and save to your device</li>
              </ol>
            </div>
          </div>
        )}

        {!result && !error && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📥</div>
            <p className="text-sm text-slate-600 font-medium">Paste an Instagram story, reel, or post URL to get download options</p>
          </div>
        )}

        <div className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-5">
          <h3 className="text-sm font-bold text-slate-300 mb-3">🖼️ Photos & 🎬 Videos</h3>
          <p className="text-sm text-slate-400 mb-2">This tool covers both content types:</p>
          <ul className="space-y-2 text-sm text-slate-400 list-disc list-inside">
            <li><b className="text-slate-300">Photos (images)</b> — story photos, post images, profile pictures, and carousel slides.</li>
            <li><b className="text-slate-300">Videos</b> — story videos, reels, IGTV, and video posts (saved as MP4).</li>
            <li>Paste any public Instagram URL — the services detect whether it's an image or video and let you save it.</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  )
}
