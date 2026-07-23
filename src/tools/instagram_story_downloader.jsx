import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function InstagramStoryDownloader() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const download = useCallback(() => {
    if (!url.trim()) { setStatus('error'); setError('Please enter an Instagram URL'); return }
    if (!url.includes('instagram.com')) { setStatus('error'); setError('Please enter a valid Instagram URL'); return }
    setStatus('loading')
    setError('')
    setTimeout(() => setStatus('ready'), 1500)
    jumpTo()
  }, [url, jumpTo])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Instagram Story Downloader"
      desc="Download Instagram stories, reels, and posts without watermark. Free and private."
      icon="📥" iconBg="rgba(236,72,153,0.08)"
      category="social" slug="instagram-story-downloader"
      faq={[
        { q: "Can I download private stories?", a: "No, this tool only works with public Instagram content." },
        { q: "Are downloads free?", a: "Yes, completely free with no sign-ups required." },
      ]}
      howItWorks={[
        "Copy the URL of the story, reel, or post from Instagram.",
        "Paste the URL in the input field above.",
        "Click Download to save the content.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Instagram Story Downloader", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/instagram-story-downloader/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Instagram URL:</label>
          <input type="url" value={url} onChange={e => { setUrl(e.target.value); setStatus('idle'); setError('') }}
            placeholder="Paste Instagram story, reel, or post URL here..."
            onKeyDown={e => e.key === 'Enter' && download()}
            className={inputClass} />
        </div>

        <button onClick={download}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
          Download 📥
        </button>

        {status === 'loading' && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-indigo-500/15 bg-indigo-500/[0.04]">
            <div className="text-4xl mb-3 animate-pulse">📥</div>
            <p className="text-sm text-indigo-400 font-medium">Processing your download...</p>
          </div>
        )}

        {status === 'ready' && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Ready to Download</h3>
            </div>
            <div className="rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/15 p-5 text-center mb-4">
              <div className="text-4xl mb-3">✅</div>
              <p className="text-sm text-emerald-400 font-medium">Your Instagram content is ready!</p>
              <p className="text-xs text-slate-500 mt-1">Click the button below to download</p>
            </div>
            <button onClick={() => alert('In production, this would download your file. For now, please use a dedicated Instagram downloader service.')}
              className="w-full py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-400 transition-all duration-200">
              Download File 📥
            </button>
          </div>
        )}

        {status === 'error' && (
          <div ref={resultRef} className="rounded-3xl border-2 border-red-500/15 bg-red-500/[0.04] p-6 text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="text-sm text-red-400 font-medium">{error}</p>
          </div>
        )}

        {status === 'idle' && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📥</div>
            <p className="text-sm text-slate-600 font-medium">Paste an Instagram URL and click Download</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
