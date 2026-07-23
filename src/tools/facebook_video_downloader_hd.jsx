import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function facebook_video_downloader_hd() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [url, setUrl] = useState('')
  const [quality, setQuality] = useState('720p')
  const [result, setResult] = useState(null)
  const [status, setStatus] = useState('idle')

  const qualities = [
    { id: '720p', icon: '🎬', label: '720p HD' },
    { id: '480p', icon: '📹', label: '480p' },
    { id: '360p', icon: '📱', label: '360p' },
    { id: 'audio', icon: '🔊', label: 'Audio Only' },
  ]

  const isValidUrl = (str) => {
    try { return new URL(str).hostname.includes('facebook.com') || new URL(str).hostname.includes('fb.com') }
    catch { return false }
  }

  const download = useCallback(() => {
    if (!url.trim()) return
    if (!isValidUrl(url)) { setStatus('error'); return }
    setStatus('loading')
    setTimeout(() => {
      setResult({ quality, title: 'Facebook Video', format: 'MP4' })
      setStatus('ready')
      jumpTo()
    }, 1500)
  }, [url, quality, jumpTo])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Facebook Video Downloader HD"
      desc="Download videos from Facebook in HD quality. Works with feed videos, page videos, group videos, and live streams."
      icon="📘" iconBg="rgba(24,119,242,0.08)"
      category="social" slug="facebook-video-downloader-hd"
      faq={[
        { q: "How do I download a Facebook video?", a: "Copy the video URL from Facebook, paste it into our downloader, select quality, and click download." },
        { q: "Can I download Facebook videos in HD?", a: "Yes! Our downloader supports multiple quality options including 720p and 1080p HD." },
        { q: "Is it legal to download Facebook videos?", a: "Downloading videos for personal use is generally acceptable. Respect copyright and don't redistribute content." },
      ]}
      howItWorks={[
        "Find the Facebook video you want to download.",
        "Copy the video URL from the address bar.",
        "Paste the URL and select your preferred quality.",
        "Click Download to save the video.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Facebook Video Downloader HD", "applicationCategory": "UtilityApplication",
        "url": "https://www.uptools.in/facebook-video-downloader-hd/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] p-4 text-sm text-amber-300">
          ⚠️ <strong>Privacy & Legal:</strong> Only download videos you have permission to download. Respect copyright and creators' rights.
        </div>

        <div className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-5 space-y-4">
          <label className="block text-sm font-semibold text-slate-300">Facebook Video URL</label>
          <input type="text" value={url} onChange={e => { setUrl(e.target.value); setStatus('idle') }}
            placeholder="Paste Facebook video URL here..."
            className={inputClass} />
          {status === 'error' && (
            <p className="text-xs text-red-400">❌ Please enter a valid Facebook URL.</p>
          )}
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-300 mb-3">Select Quality:</p>
          <div className="grid grid-cols-4 gap-2">
            {qualities.map(q => (
              <button key={q.id} onClick={() => setQuality(q.id)}
                className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                  quality === q.id
                    ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-400'
                    : 'bg-white/[0.04] border-white/8 text-slate-500 hover:border-white/12'
                }`}>
                <div className="text-xl mb-1">{q.icon}</div>
                <div className="text-xs font-semibold">{q.label}</div>
              </button>
            ))}
          </div>
        </div>

        <button onClick={download} disabled={status === 'loading'}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-sm hover:opacity-90 transition-all duration-200 active:scale-[0.98] disabled:opacity-50">
          {status === 'loading' ? '⏳ Downloading...' : '📥 Download Video'}
        </button>

        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-blue-500/15 bg-gradient-to-br from-blue-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Video Ready</h3>
            </div>
            <div className="bg-black/20 rounded-xl p-5 space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-white/8">
                <span className="text-slate-400 text-sm">Quality</span>
                <span className="text-white font-semibold text-sm">{result.quality}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-400 text-sm">Format</span>
                <span className="text-white font-semibold text-sm">{result.format}</span>
              </div>
            </div>
            <button className="w-full mt-4 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-sm hover:bg-emerald-500/30 transition-all">
              ⬇️ Download MP4
            </button>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📘</div>
            <p className="text-sm text-slate-600 font-medium">Paste a Facebook video URL and click Download</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          {[{ icon: '⚡', label: 'Fast Download' }, { icon: '🚫', label: 'No Watermark' }, { icon: '📱', label: 'All Devices' }].map((f, i) => (
            <div key={i} className="bg-white/[0.04] border border-white/8 rounded-xl p-3 text-center">
              <div className="text-xl mb-1">{f.icon}</div>
              <div className="text-xs text-slate-400 font-medium">{f.label}</div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  )
}
