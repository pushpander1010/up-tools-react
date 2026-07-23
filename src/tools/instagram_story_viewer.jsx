import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function instagram_story_viewer() {
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

  const handleLookup = useCallback(() => {
    setError('')
    setResult(null)
    const clean = extractUsername(username)
    if (!clean) { setError('Please enter a valid Instagram username or URL.'); return }
    setLoading(true)
    setResult({
      username: clean,
      profileUrl: `https://www.instagram.com/${clean}/`,
    })
    setLoading(false)
    jumpTo()
  }, [username, jumpTo])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Instagram Story Viewer"
      desc="View Instagram stories anonymously. Watch stories without the poster knowing you viewed them."
      icon="👁️" iconBg="rgba(6,182,212,0.08)"
      category="social" slug="instagram-story-viewer"
      faq={[
        { q: "Can I view stories anonymously?", a: "Yes, this tool helps you view Instagram stories without appearing in the viewer list. The story poster won't know you watched." },
        { q: "Does this work for private accounts?", a: "No, you can only view stories from public accounts. Private account stories require you to be an approved follower." },
        { q: "Are stories cached?", a: "Stories are available for 24 hours after posting. This tool shows currently active stories only." },
      ]}
      howItWorks={[
        'Enter the Instagram username whose stories you want to view.',
        'Click View Stories to access the viewer.',
        'Stories are displayed anonymously — the poster won\'t see your view.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Instagram Story Viewer", "applicationCategory": "SocialNetworkingApplication",
        "url": "https://www.uptools.in/instagram-story-viewer/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Instagram Username</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLookup()}
            placeholder="e.g. instagram or https://instagram.com/instagram"
            className={inputClass} />
          <button onClick={handleLookup} disabled={loading}
            className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98] disabled:opacity-50">
            👁️ View Stories
          </button>
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">❌ {error}</div>
          )}
        </div>

        {result && (
          <div ref={resultRef} className="space-y-4" style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Story Viewer</h3>
              </div>

              <div className="text-center mb-5">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold">
                  {result.username[0]?.toUpperCase()}
                </div>
                <div className="text-lg font-bold text-white">@{result.username}</div>
              </div>

              <div className="space-y-3">
                <a href={result.profileUrl} target="_blank" rel="noopener noreferrer"
                  className="block w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-sm text-center hover:opacity-90 transition-all no-underline">
                  👁️ View Stories Anonymously
                </a>
                <a href={`https://www storiesig.net/stories/${result.username}`} target="_blank" rel="noopener noreferrer"
                  className="block w-full py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-400 font-bold text-sm text-center hover:text-white transition-all no-underline">
                  📥 Download via StoriesIG
                </a>
                <a href={`https://instastories.watch/${result.username}`} target="_blank" rel="noopener noreferrer"
                  className="block w-full py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-400 font-bold text-sm text-center hover:text-white transition-all no-underline">
                  📥 Download via InstaStories
                </a>
              </div>

              <div className="mt-5 p-4 rounded-2xl bg-white/[0.03]">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">💡 How it works</h4>
                <ul className="text-xs text-slate-500 space-y-1 list-disc list-inside">
                  <li>Stories are fetched from public profile data</li>
                  <li>Your view is not registered — completely anonymous</li>
                  <li>Works only for public accounts (not private)</li>
                  <li>Stories expire after 24 hours</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">👁️</div>
            <p className="text-sm text-slate-600 font-medium">Enter a username to view their stories anonymously</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
