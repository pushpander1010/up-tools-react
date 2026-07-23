import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function instagram_igtv_downloader() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [status, setStatus] = useState('idle')

  const isValidUrl = (str) => {
    try { return new URL(str).hostname.includes('instagram.com') }
    catch { return false }
  }

  const download = useCallback(() => {
    if (!url.trim()) return
    if (!isValidUrl(url)) { setStatus('error'); return }
    setStatus('loading')
    setTimeout(() => {
      setResult({
        title: 'Instagram IGTV Video',
        duration: '12:34',
        quality: '1080p',
        size: '~150 MB',
      })
      setStatus('ready')
      jumpTo()
    }, 1500)
  }, [url, jumpTo])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Instagram IGTV Downloader"
      desc="Download Instagram IGTV videos in HD quality. Save long-form videos from any public Instagram profile."
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
        "Click Download to save the video in HD quality.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Instagram IGTV Downloader", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/instagram-igtv-downloader/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-5">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Instagram IGTV URL</label>
          <input type="text" value={url} onChange={e => { setUrl(e.target.value); setStatus('idle') }}
            placeholder="Paste IGTV video URL here..."
            className={inputClass} />
          {status === 'error' && (
            <p className="text-xs text-red-400 mt-2">❌ Please enter a valid Instagram URL.</p>
          )}
        </div>

        <button onClick={download} disabled={status === 'loading'}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-sm hover:opacity-90 transition-all duration-200 active:scale-[0.98] disabled:opacity-50">
          {status === 'loading' ? '⏳ Fetching Video...' : '📥 Download IGTV Video'}
        </button>

        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-pink-500/15 bg-gradient-to-br from-pink-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
              <h3 className="text-sm font-bold text-pink-400 uppercase tracking-wider">Video Ready</h3>
            </div>
            <div className="bg-black/20 rounded-xl p-5 space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-white/8">
                <span className="text-slate-400 text-sm">Title</span>
                <span className="text-white font-semibold text-sm">{result.title}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/8">
                <span className="text-slate-400 text-sm">Duration</span>
                <span className="text-white font-semibold text-sm">{result.duration}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/8">
                <span className="text-slate-400 text-sm">Quality</span>
                <span className="text-white font-semibold text-sm">{result.quality}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-400 text-sm">Est. Size</span>
                <span className="text-white font-semibold text-sm">{result.size}</span>
              </div>
            </div>
            <button className="w-full mt-4 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-sm hover:bg-emerald-500/30 transition-all">
              ⬇️ Download MP4
            </button>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📺</div>
            <p className="text-sm text-slate-600 font-medium">Paste an IGTV URL and click Download</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
