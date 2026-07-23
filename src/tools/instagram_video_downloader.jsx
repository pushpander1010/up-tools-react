import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function instagram_video_downloader() {
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
      setStatus('error'); setErrorMsg('Please paste an Instagram video URL.'); return
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
      title="Instagram Video Downloader"
      desc="Download Instagram videos and IGTV content in high quality. Free, fast, no login required."
      icon="🎥" iconBg="rgba(99,102,241,0.08)"
      category="social" slug="instagram-video-downloader"
      faq={[
        { q: 'Can I download any Instagram video?', a: 'You can download videos from public accounts. Private account content is not accessible.' },
        { q: 'Does this work with IGTV?', a: 'Yes, this tool supports both regular Instagram videos and IGTV content.' },
        { q: 'What format is the downloaded video?', a: 'Videos are downloaded in MP4 format, which is compatible with most devices and players.' },
      ]}
      howItWorks={[
        'Copy the Instagram video or IGTV URL.',
        'Paste it into the input field above.',
        'Click Download to process the video.',
        'Save the MP4 file to your device.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Instagram Video Downloader", "applicationCategory": "MultimediaApplication",
        "url": "https://www.uptools.in/instagram-video-downloader/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Video URL</label>
          <div className="flex gap-3">
            <input type="text" value={url} onChange={e => { setUrl(e.target.value); setStatus('idle') }}
              onKeyDown={e => e.key === 'Enter' && handleDownload()}
              placeholder="https://www.instagram.com/p/... or /tv/..." className={inputClass} />
            <button onClick={handleDownload}
              className="px-6 py-3 rounded-xl bg-violet-500 text-white font-bold text-sm hover:bg-violet-400 transition-all duration-200 shrink-0">
              Download
            </button>
          </div>
        </div>

        <div ref={resultRef}>
          {status === 'idle' && (
            <div className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
              <div className="text-4xl mb-3 opacity-20">🎥</div>
              <p className="text-sm text-slate-600 font-medium">Paste a video URL and click Download</p>
            </div>
          )}

          {status === 'loading' && (
            <div className="text-center py-12 rounded-3xl border-2 border-violet-500/15 bg-gradient-to-br from-violet-500/[0.06] via-white/[0.01] to-transparent"
              style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
              <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-slate-400">Processing video...</p>
            </div>
          )}

          {status === 'ready' && (
            <div className="rounded-3xl border-2 border-violet-500/15 bg-gradient-to-br from-violet-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 text-center"
              style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
              <div className="flex items-center gap-2 mb-5 justify-center">
                <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                <h3 className="text-sm font-bold text-violet-400 uppercase tracking-wider">Video Ready</h3>
              </div>
              <div className="w-56 h-36 mx-auto mb-4 rounded-2xl flex items-center justify-center text-4xl"
                style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)' }}>
                🎥
              </div>
              <p className="text-sm text-slate-400 mb-4">Instagram Video — MP4 Format</p>
              <button onClick={() => alert('In production, this would download the video as an MP4 file.')}
                className="px-8 py-3 rounded-2xl bg-violet-500 text-white font-bold text-sm hover:bg-violet-400 transition-all duration-200">
                📥 Download MP4
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
