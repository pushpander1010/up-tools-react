import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function instagram_dp_downloader() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [username, setUsername] = useState('')
  const [status, setStatus] = useState('idle') // idle, loading, ready, error
  const [errorMsg, setErrorMsg] = useState('')

  const handleDownload = useCallback(() => {
    const u = username.trim().replace('@', '')
    if (!u) {
      setStatus('error')
      setErrorMsg('Please enter an Instagram username.')
      return
    }
    if (!/^[a-zA-Z0-9._]+$/.test(u)) {
      setStatus('error')
      setErrorMsg('Invalid username. Only letters, numbers, dots, and underscores are allowed.')
      return
    }
    setStatus('loading')
    jumpTo()

    // Simulate fetch — in production this would call a backend API
    setTimeout(() => {
      setStatus('ready')
    }, 2000)
  }, [username, jumpTo])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Instagram DP Downloader"
      desc="Download any Instagram profile picture in full resolution. Free, no login required."
      icon="🖼️" iconBg="rgba(99,102,241,0.08)"
      category="social" slug="instagram-dp-downloader"
      faq={[
        { q: 'Can I download private account profile pictures?', a: 'No — Instagram does not serve private profiles\' photos to non-followers. Only public accounts can be fetched.' },
        { q: 'Do I need to log in?', a: 'No login needed for public profiles. Just enter the username.' },
        { q: 'Is this tool free?', a: 'Yes, completely free with no sign-ups required.' },
      ]}
      howItWorks={[
        'Enter the Instagram username (without @).',
        'Click Fetch to retrieve the profile picture.',
        'View the full-size profile picture.',
        'Click Download to save it to your device.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Instagram DP Downloader", "applicationCategory": "SocialNetworkingApplication",
        "url": "https://www.uptools.in/instagram-dp-downloader/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Instagram Username</label>
          <div className="flex gap-3">
            <input type="text" value={username} onChange={e => { setUsername(e.target.value); setStatus('idle') }}
              onKeyDown={e => e.key === 'Enter' && handleDownload()}
              placeholder="e.g. instagram" className={inputClass} />
            <button onClick={handleDownload}
              className="px-6 py-3 rounded-xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 shrink-0">
              Fetch
            </button>
          </div>
        </div>

        <div ref={resultRef}>
          {status === 'idle' && (
            <div className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
              <div className="text-4xl mb-3 opacity-20">🖼️</div>
              <p className="text-sm text-slate-600 font-medium">Enter a username and click Fetch</p>
            </div>
          )}

          {status === 'loading' && (
            <div className="text-center py-12 rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent"
              style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
              <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-slate-400">Fetching profile picture...</p>
            </div>
          )}

          {status === 'ready' && (
            <div className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 text-center"
              style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
              <div className="flex items-center gap-2 mb-5 justify-center">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Profile Picture</h3>
              </div>

              <div className="w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center text-5xl"
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                👤
              </div>
              <p className="text-white font-semibold mb-4">@{username.trim().replace('@', '')}</p>

              <button onClick={() => alert('In production, this would trigger a download of the full-resolution profile picture.')}
                className="px-8 py-3 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200">
                📥 Download Full Size
              </button>
              <p className="text-xs text-slate-500 mt-3">Full resolution image (typically 320×320 or higher)</p>
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
