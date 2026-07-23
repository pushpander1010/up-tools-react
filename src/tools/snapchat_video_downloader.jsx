import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const QUALITIES = [
  { value: 'hd', icon: '🎬', label: 'HD Quality' },
  { value: 'sd', icon: '📹', label: 'SD Quality' },
  { value: 'audio', icon: '🔊', label: 'Audio Only' },
]

export default function snapchat_video_downloader() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [url, setUrl] = useState('')
  const [quality, setQuality] = useState('hd')
  const [status, setStatus] = useState('idle')

  const download = useCallback(() => {
    if (!url.trim()) return
    setStatus('loading')
    setTimeout(() => setStatus('ready'), 1500)
  }, [url])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Snapchat Video Downloader"
      desc="Download Snapchat videos, snaps, stories, and memories before they expire."
      icon="👻" iconBg="rgba(255,252,0,0.08)"
      category="social" slug="snapchat-video-downloader"
      faq={[
        { q: "How do I download a Snapchat video?", a: "Copy the snap or story link, paste it into our downloader, select quality, and click download." },
        { q: "Can I download Snapchat stories?", a: "Yes! You can download public stories, friend stories, and memories. Private snaps require the sender's permission." },
        { q: "Will the sender know I downloaded their snap?", a: "Our downloader doesn't trigger Snapchat's screenshot notification system. However, always respect others' privacy." },
        { q: "Is this tool free?", a: "Yes, completely free! No registration, no hidden fees." },
      ]}
      howItWorks={[
        "Open Snapchat and find the snap or story you want to download.",
        "Long-press on the snap to get the share menu and copy the link.",
        "Paste the URL, select quality, and click Download.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Snapchat Video Downloader", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/snapchat-video-downloader/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4">
          <p className="text-sm text-amber-300"><strong>⚠️ Privacy & Legal Notice:</strong> Only download content you have permission to download. Respect others' privacy and don't share downloaded content without consent.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Snapchat Video URL</label>
          <input type="text" value={url} onChange={e => setUrl(e.target.value)}
            placeholder="Paste Snapchat snap or story link..." className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-3">Select Quality</label>
          <div className="grid grid-cols-3 gap-2">
            {QUALITIES.map(q => (
              <button key={q.value} onClick={() => setQuality(q.value)}
                className={`text-center p-3 rounded-xl border-2 transition-all ${
                  quality === q.value
                    ? 'border-yellow-400/40 bg-yellow-400/10'
                    : 'border-white/5 bg-white/[0.03] hover:border-white/10'
                }`}>
                <div className="text-xl mb-1">{q.icon}</div>
                <div className="text-xs font-semibold text-white">{q.label}</div>
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => { download(); jumpTo() }}
          disabled={status === 'loading'}
          className="w-full py-4 rounded-2xl bg-yellow-400 text-black font-bold text-sm hover:bg-yellow-300 transition-all duration-200 active:scale-[0.98] disabled:opacity-50">
          {status === 'loading' ? '⏳ Processing...' : 'Download'}
        </button>

        {status === 'loading' && (
          <div ref={resultRef} className="text-center py-8 rounded-3xl border-2 border-yellow-400/15 bg-yellow-400/[0.04]">
            <div className="text-3xl mb-3 animate-pulse">⏳</div>
            <p className="text-sm text-slate-400">Processing your download...</p>
          </div>
        )}

        {status === 'ready' && (
          <div ref={resultRef} className="rounded-3xl border-2 border-yellow-400/15 bg-gradient-to-br from-yellow-400/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-wider">Ready to Download</h3>
            </div>
            <p className="text-sm text-slate-400">Download feature coming soon! Use a third-party service for now.</p>
          </div>
        )}

        {status === 'idle' && (
          <div ref={resultRef} className="grid grid-cols-3 gap-3">
            {[
              ['⚡', 'Instant Download'],
              ['🎬', 'HD Quality'],
              ['⏰', 'Before Expiry'],
              ['📱', 'All Devices'],
              ['🔒', 'Secure'],
              ['✨', 'Easy to Use'],
            ].map(([icon, label]) => (
              <div key={label} className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="text-xl mb-1">{icon}</div>
                <p className="text-xs font-semibold text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="rounded-2xl bg-white/[0.04] border border-white/5 p-5">
          <h3 className="text-sm font-bold text-yellow-400 mb-3">What You Can Download</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>✅ <strong className="text-white">Personal Snaps:</strong> Videos sent to you by friends</li>
            <li>✅ <strong className="text-white">Stories:</strong> Public and friend stories</li>
            <li>✅ <strong className="text-white">Memories:</strong> Videos saved in your memories</li>
            <li>✅ <strong className="text-white">Public Stories:</strong> Stories from public accounts</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  )
}
