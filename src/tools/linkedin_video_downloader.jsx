import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const QUALITIES = [
  { key: '720p', label: '720p HD', icon: '🎬' },
  { key: '480p', label: '480p', icon: '📹' },
  { key: '360p', label: '360p', icon: '📱' },
  { key: 'audio', label: 'Audio Only', icon: '🔊' }
]

const SERVICES = [
  { name: 'SaveFrom', url: (id) => `https://savefrom.net/1/?url=https://www.linkedin.com/video/${id}` },
  { name: 'SnapSave', url: (id) => `https://snapsave.app/down?url=https://www.linkedin.com/video/${id}` },
  { name: 'iGram', url: (id) => `https://igram.io/linkedin-downloader/?url=https://www.linkedin.com/video/${id}` }
]

export default function linkedin_video_downloader() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [url, setUrl] = useState('')
  const [quality, setQuality] = useState('720p')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const extractVideoId = useCallback((input) => {
    const m = input.match(/linkedin\.com\/(?:video\/|feed\/update\/|posts\/)([\w-]+)/)
    return m ? m[1] : input.trim()
  }, [])

  const handleDownload = useCallback(() => {
    if (!url.trim()) { setError('Please paste a LinkedIn video URL'); return }
    if (!url.includes('linkedin.com')) { setError('Please enter a valid LinkedIn URL'); return }
    setError('')
    const videoId = extractVideoId(url)
    setResult({ videoId, quality, services: SERVICES.map(s => ({ name: s.name, url: s.url(videoId) })) })
    jumpTo()
  }, [url, quality, extractVideoId, jumpTo])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="LinkedIn Video Downloader"
      desc="Download videos from LinkedIn posts, articles, and courses in HD quality. Fast, easy, and free."
      icon="💼" iconBg="rgba(14,165,233,0.08)"
      category="social" slug="linkedin-video-downloader"
      faq={[
        { q: "How do I download a LinkedIn video?", a: "Copy the LinkedIn post URL, paste it into our downloader, select quality, and click download." },
        { q: "Can I download LinkedIn course videos?", a: "Yes! Our downloader supports videos from LinkedIn posts, articles, and course content." },
        { q: "Is this tool free?", a: "Yes, completely free! No registration or payment required." },
      ]}
      howItWorks={[
        "Find the LinkedIn post with the video you want to download.",
        "Copy the URL from the address bar and paste it above.",
        "Select your preferred quality and click Download.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "LinkedIn Video Downloader", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/linkedin-video-downloader/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Warning */}
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-300">
          ⚠️ <strong>Privacy Notice:</strong> Only download content you have permission to download. Respect copyright and creators' rights.
        </div>

        {/* URL input */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">LinkedIn Video URL</label>
          <input type="text" value={url} onChange={e => { setUrl(e.target.value); setError('') }}
            placeholder="Paste LinkedIn video URL here..."
            className={inputClass} />
          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
        </div>

        {/* Quality selector */}
        <div className="grid grid-cols-4 gap-2">
          {QUALITIES.map(q => (
            <button key={q.key} onClick={() => setQuality(q.key)}
              className={`p-3 rounded-xl text-center transition-all border-2 ${
                quality === q.key
                  ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                  : 'bg-white/[0.04] border-white/8 text-slate-500 hover:border-white/12'
              }`}>
              <div className="text-xl mb-1">{q.icon}</div>
              <div className="text-[10px] font-bold">{q.label}</div>
            </button>
          ))}
        </div>

        {/* Download button */}
        <button onClick={handleDownload}
          className="w-full py-4 rounded-2xl bg-sky-500 text-white font-bold text-sm hover:bg-sky-400 transition-all duration-200 active:scale-[0.98]">
          ⬇️ Download
        </button>

        {/* Results */}
        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-sky-500/15 bg-gradient-to-br from-sky-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider">Download Link</h3>
            </div>
            <p className="text-slate-400 text-sm mb-4">Choose a service to download your video ({result.quality}):</p>
            <div className="space-y-2">
              {result.services.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                  className="block py-3 px-4 rounded-xl bg-white/[0.06] border border-white/8 text-white text-sm font-medium hover:border-sky-500/30 transition-all">
                  🌐 Download via {s.name}
                </a>
              ))}
            </div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">💼</div>
            <p className="text-sm text-slate-600 font-medium">Paste a LinkedIn video URL and click Download</p>
          </div>
        )}

        {/* Steps */}
        <div className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-5">
          <h3 className="text-sm font-bold text-white mb-3">How to Download LinkedIn Videos</h3>
          <ol className="space-y-2 text-sm text-slate-400 list-decimal list-inside">
            <li>Find the LinkedIn post with the video you want to download</li>
            <li>Click on the video to open it</li>
            <li>Copy the URL from the address bar</li>
            <li>Paste the URL into the input field above</li>
            <li>Select your preferred quality and click Download</li>
          </ol>
        </div>
      </div>
    </ToolLayout>
  )
}
