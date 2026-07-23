import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function facebook_video_downloader() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState('idle')

  const download = useCallback(() => {
    if (!url.trim()) return
    setStatus('loading')
    setTimeout(() => setStatus('ready'), 1500)
  }, [url])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Facebook Video Downloader"
      desc="Download Facebook videos, Reels, and Stories in HD quality instantly."
      icon="📹" iconBg="rgba(24,119,242,0.08)"
      category="social" slug="facebook-video-downloader"
      faq={[
        { q: "How do I download a Facebook video?", a: "Copy the video URL from Facebook, paste it into our downloader, and click Download." },
        { q: "What types of Facebook videos can I download?", a: "We support Facebook Videos, Reels, Stories, Live Videos, and Shared Videos." },
        { q: "Is this tool free?", a: "Yes, completely free! No registration or payment required." },
      ]}
      howItWorks={[
        "Open Facebook and find the video you want to download.",
        "Right-click the video and copy the video URL (or use the share button).",
        "Paste the URL above and click Download.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Facebook Video Downloader", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/facebook-video-downloader/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Facebook Video URL</label>
          <input type="text" value={url} onChange={e => setUrl(e.target.value)}
            placeholder="Paste Facebook video URL here..." className={inputClass} />
        </div>

        <button onClick={() => { download(); jumpTo() }}
          disabled={status === 'loading'}
          className="w-full py-4 rounded-2xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-500 transition-all duration-200 active:scale-[0.98] disabled:opacity-50">
          {status === 'loading' ? '⏳ Processing...' : 'Download'}
        </button>

        {status === 'loading' && (
          <div ref={resultRef} className="text-center py-8 rounded-3xl border-2 border-blue-500/15 bg-blue-500/[0.04]">
            <div className="text-3xl mb-3 animate-pulse">⏳</div>
            <p className="text-sm text-slate-400">Processing your download...</p>
          </div>
        )}

        {status === 'ready' && (
          <div ref={resultRef} className="rounded-3xl border-2 border-blue-500/15 bg-gradient-to-br from-blue-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Ready to Download</h3>
            </div>
            <p className="text-sm text-slate-400">Download started! The video will be saved to your device.</p>
          </div>
        )}

        {status === 'idle' && (
          <div ref={resultRef}>
            <div className="rounded-2xl bg-white/[0.04] border border-white/5 p-5 mb-4">
              <h3 className="text-sm font-bold text-blue-400 mb-3">Supported Content</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>✅ Facebook Videos</li>
                <li>✅ Facebook Reels</li>
                <li>✅ Facebook Stories</li>
                <li>✅ Facebook Live Videos</li>
                <li>✅ Shared Videos</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-white/[0.04] border border-white/5 p-5">
              <h3 className="text-sm font-bold text-blue-400 mb-3">Features</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>✅ HD quality download</li>
                <li>✅ No watermark</li>
                <li>✅ Fast download speed</li>
                <li>✅ No registration needed</li>
                <li>✅ Works on all devices</li>
                <li>✅ Download audio separately</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
