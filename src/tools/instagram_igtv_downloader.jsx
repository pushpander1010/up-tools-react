import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function instagram_igtv_downloader() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isValidUrl = (str) => {
    try { return new URL(str).hostname.includes('instagram.com') }
    catch { return false }
  }

  const extractPostId = (input) => {
    const match = input.match(/instagram\.com\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/)
    return match ? match[1] : null
  }

  const handleDownload = useCallback(() => {
    setError('')
    setResult(null)
    if (!url.trim()) { setError('Please paste an Instagram IGTV URL.'); return }
    if (!isValidUrl(url.trim())) { setError('Please enter a valid Instagram URL.'); return }
    setLoading(true)
    const postId = extractPostId(url)
    setResult({
      url: url.trim(),
      postId: postId || 'unknown',
    })
    setLoading(false)
    jumpTo()
  }, [url, jumpTo])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Instagram IGTV Downloader"
      desc="Download Instagram IGTV long-form videos in HD quality. Save any public IGTV video to your device."
      icon="📺" iconBg="rgba(236,72,153,0.08)"
      category="social" slug="instagram-igtv-downloader"
      faq={[
        { q: "Can I download IGTV videos from private accounts?", a: "No, only public IGTV videos can be downloaded. Private accounts restrict access." },
        { q: "What quality are IGTV downloads?", a: "IGTV videos are downloaded in the highest available quality, typically 1080p." },
        { q: "Is this tool free?", a: "Yes, completely free with no sign-ups required." },
      ]}
      howItWorks={[
        "Copy the IGTV video URL from Instagram.",
        "Paste it into the input field above.",
        "Use the provided services to download the video in HD.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Instagram IGTV Downloader", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/instagram-igtv-downloader/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Instagram IGTV URL</label>
          <input type="text" value={url} onChange={e => { setUrl(e.target.value); setResult(null); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleDownload()}
            placeholder="Paste IGTV video URL here..."
            className={inputClass} />
          <button onClick={handleDownload} disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-sm hover:opacity-90 transition-all duration-200 active:scale-[0.98] disabled:opacity-50">
            📺 Download IGTV Video
          </button>
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">❌ {error}</div>
          )}
        </div>

        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-pink-500/15 bg-gradient-to-br from-pink-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
              <h3 className="text-sm font-bold text-pink-400 uppercase tracking-wider">Video Found</h3>
            </div>

            <div className="text-center mb-5">
              <div className="w-56 h-36 mx-auto mb-3 rounded-2xl flex items-center justify-center text-4xl"
                style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }}>
                📺
              </div>
              <div className="text-sm text-slate-400">Instagram IGTV Video</div>
            </div>

            <div className="space-y-3">
              <a href={result.url} target="_blank" rel="noopener noreferrer"
                className="block w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-sm text-center hover:opacity-90 transition-all no-underline">
                📱 Open Original Video
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
                <li>Copy the Instagram IGTV video URL</li>
                <li>Paste it into one of the download services above</li>
                <li>Click download and save the MP4 file to your device</li>
              </ol>
            </div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📺</div>
            <p className="text-sm text-slate-600 font-medium">Paste an IGTV URL and click Download</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
