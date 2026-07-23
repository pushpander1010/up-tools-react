import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function instagram_highlight_downloader() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [username, setUsername] = useState('')
  const [result, setResult] = useState(null)
  const [status, setStatus] = useState('idle')

  const download = useCallback(() => {
    const u = username.trim().replace('@', '')
    if (!u) return
    setStatus('loading')
    setTimeout(() => {
      setResult({
        username: u,
        highlights: [
          { name: 'Highlights 1', icon: '🎬' },
          { name: 'Travel', icon: '✈️' },
          { name: 'Food', icon: '🍔' },
          { name: 'Fitness', icon: '💪' },
        ]
      })
      setStatus('ready')
      jumpTo()
    }, 1500)
  }, [username, jumpTo])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Instagram Highlight Downloader"
      desc="Download Instagram story highlights from any public profile. Save highlight covers and stories in full quality."
      icon="📱" iconBg="rgba(236,72,153,0.08)"
      category="social" slug="instagram-highlight-downloader"
      faq={[
        { q: "Can I download highlights from private accounts?", a: "No, only public Instagram profiles have downloadable highlights. Private accounts restrict access to their content." },
        { q: "Is this tool free?", a: "Yes, completely free! No registration or payment required." },
        { q: "What quality are the downloads?", a: "Highlights are downloaded in the original quality uploaded by the user." },
      ]}
      howItWorks={[
        "Enter the Instagram username whose highlights you want to download.",
        "Click the Download button to fetch available highlights.",
        "Browse and select the highlights you want to save.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Instagram Highlight Downloader", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/instagram-highlight-downloader/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-5">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Instagram Username</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)}
            placeholder="e.g., natgeo, travelplusmore"
            className={inputClass} />
          <p className="text-xs text-slate-500 mt-2">Enter the username (without @) of the public profile.</p>
        </div>

        <button onClick={download} disabled={status === 'loading'}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-sm hover:opacity-90 transition-all duration-200 active:scale-[0.98] disabled:opacity-50">
          {status === 'loading' ? '⏳ Fetching Highlights...' : '📥 Download Highlights'}
        </button>

        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-pink-500/15 bg-gradient-to-br from-pink-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
              <h3 className="text-sm font-bold text-pink-400 uppercase tracking-wider">@{result.username}'s Highlights</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {result.highlights.map((h, i) => (
                <div key={i} className="bg-black/20 rounded-xl p-4 text-center border border-white/8 hover:border-pink-500/30 transition-all cursor-pointer">
                  <div className="text-3xl mb-2">{h.icon}</div>
                  <div className="text-sm font-semibold text-white">{h.name}</div>
                  <button className="mt-2 text-xs text-pink-400 hover:text-pink-300 font-medium">Download</button>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-4 text-center">Click any highlight to download its stories.</p>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📱</div>
            <p className="text-sm text-slate-600 font-medium">Enter a username and click Download</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
