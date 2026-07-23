import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function instagram_dp_downloader() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [username, setUsername] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const extractUsername = (input) => {
    input = input.trim()
    const urlMatch = input.match(/instagram\.com\/([a-zA-Z0-9._]+)/)
    if (urlMatch) return urlMatch[1]
    if (input.startsWith('@')) return input.slice(1)
    if (/^[a-zA-Z0-9._]+$/.test(input)) return input
    return null
  }

  const handleFetch = useCallback(() => {
    setError('')
    setResult(null)
    const clean = extractUsername(username)
    if (!clean) { setError('Please enter a valid Instagram username or URL.'); return }
    setLoading(true)
    setResult({ username: clean })
    setLoading(false)
    jumpTo()
  }, [username, jumpTo])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Instagram DP Downloader"
      desc="Download Instagram profile pictures in full HD quality. View and save any public profile photo instantly."
      icon="🖼️" iconBg="rgba(99,102,241,0.08)"
      category="social" slug="instagram-dp-downloader"
      faq={[
        { q: "Can I download private account profile pictures?", a: "No — only public Instagram profile pictures can be downloaded. Private accounts restrict access." },
        { q: "Do I need to log in?", a: "No login needed for public profiles. Just enter the username." },
        { q: "What quality are the downloads?", a: "Profile pictures are fetched in the highest available resolution, typically 320×320 or higher." },
      ]}
      howItWorks={[
        'Enter the Instagram username (without @).',
        'Click Fetch to find the profile picture.',
        'Use one of the provided services to view and download the full-size image.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Instagram DP Downloader", "applicationCategory": "SocialNetworkingApplication",
        "url": "https://www.uptools.in/instagram-dp-downloader/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Instagram Username</label>
          <input type="text" value={username} onChange={e => { setUsername(e.target.value); setResult(null); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleFetch()}
            placeholder="e.g. natgeo or https://instagram.com/natgeo"
            className={inputClass} />
          <button onClick={handleFetch} disabled={loading}
            className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98] disabled:opacity-50">
            🖼️ Fetch Profile Picture
          </button>
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">❌ {error}</div>
          )}
        </div>

        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Profile Found</h3>
            </div>

            <div className="text-center mb-5">
              <div className="w-24 h-24 rounded-full mx-auto mb-3 flex items-center justify-center text-4xl"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                👤
              </div>
              <div className="text-lg font-bold text-white">@{result.username}</div>
            </div>

            <div className="space-y-3">
              <a href={`https://www.instagram.com/${result.username}/`} target="_blank" rel="noopener noreferrer"
                className="block w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-sm text-center hover:opacity-90 transition-all no-underline">
                👁️ View Instagram Profile
              </a>
              <a href={`https://imginn.com/${result.username}/`} target="_blank" rel="noopener noreferrer"
                className="block w-full py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-400 font-bold text-sm text-center hover:text-white transition-all no-underline">
                📥 View Full Size on Imginn
              </a>
              <a href={`https://www.picuki.com/profile/${result.username}`} target="_blank" rel="noopener noreferrer"
                className="block w-full py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-400 font-bold text-sm text-center hover:text-white transition-all no-underline">
                📥 View on Picuki
              </a>
            </div>

            <div className="mt-5 p-4 rounded-2xl bg-white/[0.03]">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">💡 How to download</h4>
              <ol className="text-xs text-slate-500 space-y-1 list-decimal list-inside">
                <li>Click one of the services above to view the profile picture</li>
                <li>Right-click the full-size image</li>
                <li>Select "Save Image As" to download to your device</li>
              </ol>
            </div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🖼️</div>
            <p className="text-sm text-slate-600 font-medium">Enter a username to view their profile picture</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
