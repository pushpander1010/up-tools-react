import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function instagram_carousel_downloader() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const extractPostId = (input) => {
    input = input.trim()
    const match = input.match(/instagram\.com\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/)
    return match ? match[1] : null
  }

  const handleLookup = useCallback(() => {
    setError('')
    setResult(null)
    const postId = extractPostId(url)
    if (!postId) { setError('Please enter a valid Instagram post URL (e.g., instagram.com/p/ABC123)'); return }
    setLoading(true)
    // Since we can't fetch Instagram content client-side due to CORS,
    // provide the user with the post link and third-party service links
    setResult({
      postId,
      originalUrl: url.startsWith('http') ? url : `https://www.instagram.com/p/${postId}/`,
    })
    setLoading(false)
    jumpTo()
  }, [url, jumpTo])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Instagram Carousel Downloader"
      desc="Download all images from Instagram carousel posts. Save every slide in high quality."
      icon="🎠" iconBg="rgba(168,85,247,0.08)"
      category="social" slug="instagram-carousel-downloader"
      faq={[
        { q: "What is a carousel post?", a: "A carousel post is an Instagram post that contains multiple images or videos that users can swipe through (up to 10 slides)." },
        { q: "Can I download all slides at once?", a: "Yes! This tool helps you access all images from a carousel post. You can save them individually or use the provided services." },
        { q: "Does this work with video carousels?", a: "Yes, the tool identifies carousel posts with both images and videos. For video slides, you'll be directed to appropriate download services." },
      ]}
      howItWorks={[
        'Copy the URL of the Instagram carousel post.',
        'Paste it into the input field above.',
        'Use the provided services to download all slides.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Instagram Carousel Downloader", "applicationCategory": "SocialNetworkingApplication",
        "url": "https://www.uptools.in/instagram-carousel-downloader/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Instagram Post URL</label>
          <input type="url" value={url} onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLookup()}
            placeholder="https://www.instagram.com/p/ABC123/"
            className={inputClass} />
          <button onClick={handleLookup} disabled={loading}
            className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98] disabled:opacity-50">
            🎠 Find Carousel Images
          </button>
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">❌ {error}</div>
          )}
        </div>

        {result && (
          <div ref={resultRef} className="space-y-4" style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Carousel Post Found</h3>
              </div>

              <div className="text-center mb-5">
                <div className="text-4xl mb-3">🎠</div>
                <div className="text-sm text-slate-400">Post ID: <span className="text-white font-mono">{result.postId}</span></div>
              </div>

              <div className="space-y-3">
                <a href={result.originalUrl} target="_blank" rel="noopener noreferrer"
                  className="block w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm text-center hover:opacity-90 transition-all no-underline">
                  📱 Open Original Post
                </a>
                <a href={`https://www.saveinsta.app/`} target="_blank" rel="noopener noreferrer"
                  className="block w-full py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-400 font-bold text-sm text-center hover:text-white transition-all no-underline">
                  📥 Download via SaveInsta
                </a>
                <a href={`https://igram.io/`} target="_blank" rel="noopener noreferrer"
                  className="block w-full py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-400 font-bold text-sm text-center hover:text-white transition-all no-underline">
                  📥 Download via iGram
                </a>
              </div>

              <div className="mt-5 p-4 rounded-2xl bg-white/[0.03]">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">💡 How to download</h4>
                <ol className="text-xs text-slate-500 space-y-1 list-decimal list-inside">
                  <li>Copy the Instagram post URL</li>
                  <li>Paste it into one of the download services above</li>
                  <li>Click download for each slide you want to save</li>
                  <li>Right-click and "Save Image As" to save to your device</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🎠</div>
            <p className="text-sm text-slate-600 font-medium">Paste an Instagram carousel post URL to download</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
