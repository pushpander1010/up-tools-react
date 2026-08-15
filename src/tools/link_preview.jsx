import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function link_preview() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')

  const normalize = (u) => {
    const t = u.trim()
    if (!t) return ''
    return /^https?:\/\//i.test(t) ? t : 'https://' + t
  }

  const preview = useCallback(async () => {
    const target = normalize(url)
    if (!target) return
    setLoading(true)
    setError('')
    setResult(null)
    jumpTo()
    try {
      const r = await fetch(`https://api.microlink.io?url=${encodeURIComponent(target)}&data=title,description,url,image,logo,publisher,author,lang`)
      if (!r.ok) throw new Error('bad status')
      const d = await r.json()
      if (d.status !== 'success' || !d.data) throw new Error('could not parse')
      const info = d.data
      if (!info.title && !info.description) {
        setError('No preview data found for that URL. The page may block previews or return no metadata.')
      } else {
        setResult(info)
      }
    } catch {
      setError('Could not preview that URL. Please check the address and try again.')
    }
    setLoading(false)
  }, [url, jumpTo])

  const copy = useCallback((text, key) => {
    navigator.clipboard?.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 1500)
  }, [])

  const inputClass = "flex-1 bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-400 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Link Preview"
      desc="Extract title, description, image, and favicon from any URL. Preview how a link will appear when shared on social media."
      icon="🔗" iconBg="rgba(14,165,233,0.08)"
      category="marketing" slug="link-preview"
      faq={[
        { q: 'What is a link preview?', a: 'A link preview shows the title, description, and thumbnail that appear when a URL is shared on WhatsApp, Telegram, Facebook, or LinkedIn. It is generated from the page\u2019s Open Graph (OG) metadata.' },
        { q: 'Why does my link have no preview?', a: 'Some sites block preview bots, return no OG tags, or require login. In those cases no preview data can be extracted.' },
        { q: 'How is this useful for SEO?', a: 'Marketers use link previews to check how their pages appear when shared, verify OG tags are set correctly, and ensure the right image and title are displayed.' },
      ]}
      howItWorks={[
        'Paste any web URL.',
        'The tool fetches the page metadata via the Microlink API.',
        'See the title, description, thumbnail, publisher, and favicon as it would appear when shared.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        name: "Link Preview", "applicationCategory": "BusinessApplication",
        url: "https://www.uptools.in/link-preview/",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && preview()}
            placeholder="https://example.com"
            className={inputClass}
          />
          <button onClick={preview} disabled={loading}
            className="shrink-0 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-bold text-sm shadow-lg shadow-sky-500/25 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
            {loading ? '⏳' : '🔗 Preview'}
          </button>
        </div>

        {error && <p className="text-center text-sm text-rose-400">{error}</p>}

        {result && (
          <div ref={resultRef} className="space-y-4" style={{ animation: 'slideUp 0.35s ease-out' }}>
            {/* Card preview */}
            <div className="rounded-3xl border-2 border-white/8 bg-white/[0.04] overflow-hidden">
              {result.image?.url && (
                <img src={result.image.url} alt={result.title || 'preview'} className="w-full h-48 object-cover border-b border-white/8" loading="lazy" />
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  {result.logo?.url && (
                    <img src={result.logo.url} alt="" className="w-5 h-5 rounded" loading="lazy" />
                  )}
                  <span className="text-xs text-slate-400">{result.publisher || new URL(result.url).hostname}</span>
                </div>
                <div className="text-base font-extrabold text-white mb-1">{result.title || 'No title'}</div>
                {result.description && (
                  <p className="text-sm text-slate-400 line-clamp-2">{result.description}</p>
                )}
              </div>
            </div>

            {/* Metadata */}
            <div className="rounded-3xl border-2 border-white/8 bg-white/[0.03] p-5 space-y-3">
              {[
                ['🔤', 'Title', result.title, 'title'],
                ['📝', 'Description', result.description, 'desc'],
                ['🌐', 'URL', result.url, 'url'],
                ['🏢', 'Publisher', result.publisher, 'pub'],
                ['🗣️', 'Author', result.author, 'author'],
              ].filter(([, , v]) => v).map(([icon, label, value, key]) => (
                <div key={key}>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{icon} {label}</div>
                  <div className="flex items-start gap-2">
                    <div className="text-sm text-white break-all flex-1">{value}</div>
                    <button onClick={() => copy(String(value), key)}
                      className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-lg transition-all ${copied === key ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/[0.06] text-slate-400 hover:text-white'}`}>
                      {copied === key ? '✓' : '📋'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
