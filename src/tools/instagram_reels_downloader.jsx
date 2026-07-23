import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function instagram_reels_downloader() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const isValidUrl = (str) => {
    try {
      const u = new URL(str)
      return u.hostname.includes('instagram.com')
    } catch { return false }
  }

  const handleDownload = useCallback(() => {
    if (!url.trim()) {
      setStatus('error'); setErrorMsg('Please paste an Instagram Reel URL.'); return
    }
    if (!isValidUrl(url.trim())) {
      setStatus('error'); setErrorMsg('Please enter a valid Instagram URL.'); return
    }
    setStatus('loading')
    jumpTo()
    setTimeout(() => setStatus('ready'), 2000)
  }, [url, jumpTo])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Instagram Reels Downloader"
      desc="Download Instagram Reels in high quality. Free, fast, and no login required."
      icon="🎬" iconBg="rgba(236,72,153,0.08)"
      category="social" slug="instagram-reels-downloader"
      faq={[
        { q: 'Can I download any Instagram Reel?', a: 'You can download Reels from public accounts. Private account content is not accessible.' },
        { q: 'What quality are the downloads?', a: 'Reels are downloaded in the highest available quality, typically 1080p.' },
        { q: 'Is this tool free?', a: 'Yes, completely free with no sign-ups or watermarks.' },
      ]}
      howItWorks={[
        'Copy the Instagram Reel URL from the app or browser.',
        'Paste it into the input field above.',
        'Click Download to process the video.',
        'Save the video to your device.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Instagram Reels Downloader", "applicationCategory": "MultimediaApplication",
        "url": "https://www.uptools.in/instagram-reels-downloader/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Reel URL</label>
          <div className="flex gap-3">
            <input type="text" value={url} onChange={e => { setUrl(e.target.value); setStatus('idle') }}
              onKeyDown={e => e.key === 'Enter' && handleDownload()}
              placeholder="https://www.instagram.com/reel/..." className={inputClass} />
            <button onClick={handleDownload}
              className="px-6 py-3 rounded-xl bg-pink-500 text-white font-bold text-sm hover:bg-pink-400 transition-all duration-200 shrink-0">
              Download
            </button>
          </div>
        </div>

        <div ref={resultRef}>
          {status === 'idle' && (
            <div className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
              <div className="text-4xl mb-3 opacity-20">🎬</div>
              <p className="text-sm text-slate-600 font-medium">Paste a Reel URL and click Download</p>
            </div>
          )}

          {status === 'loading' && (
            <div className="text-center py-12 rounded-3xl border-2 border-pink-500/15 bg-gradient-to-br from-pink-500/[0.06] via-white/[0.01] to-transparent"
              style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
              <div className="w-10 h-10 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-slate-400">Processing Reel...</p>
            </div>
          )}

          {status === 'ready' && (
            <div className="rounded-3xl border-2 border-pink-500/15 bg-gradient-to-br from-pink-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 text-center"
              style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
              <div className="flex items-center gap-2 mb-5 justify-center">
                <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
                <h3 className="text-sm font-bold text-pink-400 uppercase tracking-wider">Reel Ready</h3>
              </div>
              <div className="w-48 h-64 mx-auto mb-4 rounded-2xl flex items-center justify-center text-4xl"
                style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)' }}>
                🎬
              </div>
              <p className="text-sm text-slate-400 mb-4">Instagram Reel — 1080p Quality</p>
              <button onClick={() => alert('In production, this would download the Reel video file.')}
                className="px-8 py-3 rounded-2xl bg-pink-500 text-white font-bold text-sm hover:bg-pink-400 transition-all duration-200">
                📥 Download Video
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="rounded-3xl border-2 border-red-500/15 bg-red-500/[0.06] p-6 text-center"
              style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
              <div className="text-2xl mb-2">⚠️</div>
              <p className="text-sm text-red-400 font-semibold">{errorMsg}</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
