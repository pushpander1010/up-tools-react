import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const API = 'https://backend.uptools.in'

export default function facebook_video_downloader() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState('idle')
  const [info, setInfo] = useState(null)
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState(false)

  const lookup = useCallback(async () => {
    const trimmed = url.trim()
    setError('')
    setInfo(null)
    if (!trimmed) { setError('Please paste a Facebook video URL.'); return }
    try { new URL(trimmed) } catch { setError('Please enter a valid URL.'); return }
    setStatus('loading')
    jumpTo(true)
    try {
      const r = await fetch(API + '/api/dl/info', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.detail || 'Lookup failed')
      setInfo({ ...data, originalUrl: trimmed })
      setStatus('ready')
    } catch (e) {
      setError(e.message || 'Lookup failed')
      setStatus('fallback')
    }
    jumpTo(true)
  }, [url, jumpTo])

  const download = useCallback(async (audioOnly) => {
    if (!info) return
    setDownloading(true)
    setError('')
    try {
      const r = await fetch(API + '/api/dl', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: info.originalUrl, audio_only: audioOnly }),
      })
      if (!r.ok) {
        const data = await r.json().catch(() => ({}))
        throw new Error(data.detail || 'Download failed')
      }
      const blob = await r.blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = (info.title || 'facebook-video').replace(/[^\w\- ]+/g, '').slice(0, 60) + (audioOnly ? '.mp3' : '.mp4')
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(a.href), 5000)
    } catch (e) {
      setError(e.message || 'Download failed')
    }
    setDownloading(false)
  }, [info])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Facebook Video Downloader"
      desc="Facebook Video Downloader - download Facebook videos, Reels, and Stories in HD quality instantly, online free. Free online in HD. No app or login needed."
      icon="📹" iconBg="rgba(24,119,242,0.08)"
      category="social" slug="facebook-video-downloader"
      faq={[
        { q: "How do I download a Facebook video?", a: "Copy the video URL from Facebook, paste it into our downloader, and click Download." },
        { q: "What types of Facebook videos can I download?", a: "We support Facebook Videos, Reels, Stories, Live Videos, and Shared Videos." },
        { q: "Is this tool free?", a: "Yes, completely free! No registration or payment required." },
        { q: "How do I download online free?", a: "Paste the link above, pick your option, and save the file. Free with no sign-up or app needed." },
        { q: "What quality do I get?", a: "You get the highest quality available, free. Paste the link above and save it to your device." },
        { q: "Can I download on mobile?", a: "Yes. Open this page in your phone browser, paste the link, and save directly. No app needed." },
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
            onKeyDown={e => e.key === 'Enter' && lookup()}
            placeholder="Paste Facebook video URL here..." className={inputClass} />
        </div>

        <button onClick={lookup}
          disabled={status === 'loading'}
          className="w-full py-4 rounded-2xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-500 transition-all duration-200 active:scale-[0.98] disabled:opacity-50">
          {status === 'loading' ? '⏳ Finding video...' : 'Download'}
        </button>

        {error && <div ref={resultRef} className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300">❌ {error}</div>}

        {(status === 'ready' && info) && (
          <div ref={resultRef} className="rounded-3xl border-2 border-blue-500/15 bg-gradient-to-br from-blue-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Ready to Download</h3>
            </div>
            {info.thumbnail && <img src={info.thumbnail} alt="" className="w-full rounded-xl mb-4 max-h-56 object-cover" />}
            <p className="text-white font-semibold mb-4">{info.title || 'Facebook video'}</p>
            <div className="space-y-3">
              <button onClick={() => download(false)} disabled={downloading}
                className="block w-full py-4 rounded-2xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-500 transition-all disabled:opacity-50">
                {downloading ? '⏳ Downloading...' : '📥 Download Video (MP4)'}
              </button>
              <button onClick={() => download(true)} disabled={downloading}
                className="block w-full py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-300 font-bold text-sm hover:text-white transition-all disabled:opacity-50">
                🎵 Audio only (MP3)
              </button>
            </div>
          </div>
        )}

        {status === 'fallback' && (
          <div ref={resultRef} className="rounded-3xl border-2 border-blue-500/15 bg-blue-500/[0.04] p-6 sm:p-8">
            <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-2">Try a download service</h3>
            <p className="text-sm text-slate-400 mb-4">Our server can't fetch this link directly. Paste it into one of these free services:</p>
            <div className="space-y-3">
              <a href="https://snapsave.app/" target="_blank" rel="noopener noreferrer"
                className="block w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm text-center hover:bg-blue-500 transition-all no-underline">
                📥 Download via SnapSave
              </a>
              <a href="https://fdown.net/" target="_blank" rel="noopener noreferrer"
                className="block w-full py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-300 font-bold text-sm text-center hover:text-white transition-all no-underline">
                📥 Download via FDown
              </a>
            </div>
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
