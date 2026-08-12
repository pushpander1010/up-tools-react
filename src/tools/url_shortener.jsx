import { useState, useCallback, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function url_shortener() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('uptools.urlshort.hist') || '[]') }
    catch { return [] }
  })
  const [copied, setCopied] = useState(null)

  useEffect(() => {
    localStorage.setItem('uptools.urlshort.hist', JSON.stringify(history))
  }, [history])

  const shorten = useCallback(async () => {
    if (!url.trim()) return
    setLoading(true); setError(''); setShortUrl('')
    try {
      const res = await fetch('https://backend.uptools.in/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() })
      })
      const data = await res.json()
      if (data.short) {
        setShortUrl(data.short)
        setHistory(prev => [{ orig: url.trim(), short: data.short, time: Date.now() }, ...prev].slice(0, 20))
        jumpTo()
      } else {
        setError(data.detail || 'Error shortening URL')
      }
    } catch {
      setError('API error — try again')
    }
    setLoading(false)
  }, [url, jumpTo])

  const copy = useCallback(async (text, label) => {
    try { await navigator.clipboard.writeText(text) } catch {
      const ta = document.createElement('textarea'); ta.value = text
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta)
    }
    setCopied(label); setTimeout(() => setCopied(null), 2000)
  }, [])

  const removeHist = useCallback((idx) => {
    setHistory(prev => prev.filter((_, i) => i !== idx))
  }, [])

  const clearHist = useCallback(() => {
    setHistory([]); localStorage.removeItem('uptools.urlshort.hist')
  }, [])

  const fmtTime = (ts) => new Date(ts).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <ToolLayout
      title="URL Shortener – Shorten Links Free, No Signup"
      desc="Shorten long URLs free, no signup. Create short UpTools links for your Instagram bio, WhatsApp, and social posts — no account, no tracking, no expiry."
      icon="🔗" iconBg="rgba(6,182,212,0.08)"
      category="dev" slug="url-shortener"
      faq={[
        { q: 'How does URL shortening work?', a: 'We run our own free URL shortener on the UpTools backend. Paste a link, we store it and give you a short UpTools link that redirects to your original.' },
        { q: 'Do I need an account or signup?', a: 'No. Shortening is completely free and requires no signup, no login, and no personal information.' },
        { q: 'Is my history saved?', a: 'Yes, locally in your browser. Nothing about your history is sent to any server.' },
        { q: 'Are my short links permanent?', a: 'Short links stay live on our backend with no expiry. They do not expire after a set number of days or clicks.' },
        { q: 'Can I shorten a link for my Instagram bio?', a: 'Yes. Paste any long URL — an Instagram, YouTube, Amazon, or any other link — and you will get a clean short URL you can drop in your bio, captions, or comments.' },
        { q: 'Is there any tracking on my short links?', a: 'No. We do not add tracking cookies or personal identifiers. Short links simply redirect to your destination.' },
      ]}
      howItWorks={[
        'Paste a long URL into the input field.',
        'Click Shorten to generate a short link.',
        'Copy the short URL or scan the QR code.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "URL Shortener", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/url-shortener/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Input */}
        <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08] space-y-3">
          <label className="block text-sm font-semibold text-slate-300">Paste your long URL</label>
          <input type="url" value={url} onChange={e => setUrl(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') shorten() }}
            placeholder="https://example.com/very-long-url..."
            className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-500/40 transition-all placeholder:text-slate-600" />
          <button onClick={shorten} disabled={loading || !url.trim()}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
            {loading ? '⏳ Shortening...' : '🔗 Shorten URL'}
          </button>
          {error && <div className="text-xs text-red-400">{error}</div>}
        </div>

        {/* Result */}
        {shortUrl && (
          <div ref={resultRef} className="rounded-3xl border-2 border-cyan-500/15 bg-gradient-to-br from-cyan-500/[0.06] via-white/[0.01] to-transparent p-6"
            style={{ animation: 'slideUp 0.35s ease-out' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">Shortened URL</h3>
            </div>
            <div className="text-lg font-mono text-white font-bold mb-4 break-all">{shortUrl}</div>
            <div className="flex gap-2">
              <button onClick={() => copy(shortUrl, 'short')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  copied === 'short' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/[0.08] text-slate-400 hover:text-white'
                }`}>
                {copied === 'short' ? '✅ Copied' : '📋 Copy Short'}
              </button>
              <button onClick={() => copy(url, 'original')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  copied === 'original' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/[0.08] text-slate-400 hover:text-white'
                }`}>
                {copied === 'original' ? '✅ Copied' : '📋 Copy Original'}
              </button>
            </div>
          </div>
        )}

        {!shortUrl && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.02]">
            <div className="text-4xl mb-3 opacity-20">🔗</div>
            <p className="text-sm text-slate-600 font-medium">Paste a URL and click Shorten</p>
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/[0.08]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-300">History ({history.length})</h3>
              <button onClick={clearHist} className="text-xs text-red-400 hover:text-red-300 transition-all">Clear All</button>
            </div>
            <div className="space-y-2">
              {history.map((h, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.04]">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-400 truncate">{h.orig}</div>
                    <div className="text-xs font-mono text-cyan-400 truncate">{h.short}</div>
                    <div className="text-[10px] text-slate-600">{fmtTime(h.time)}</div>
                  </div>
                  <button onClick={() => copy(h.short, `hist-${i}`)}
                    className="px-2 py-1 rounded text-xs bg-white/[0.06] text-slate-400 hover:text-white">
                    📋
                  </button>
                  <button onClick={() => removeHist(i)}
                    className="px-2 py-1 rounded text-xs text-red-400 hover:text-red-300">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SEO content section */}
      <div className="max-w-2xl mx-auto pt-2">
        <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8 space-y-5">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Free URL Shortener – No Signup, No Tracking</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              UpTools is a free URL shortener with no signup and no account. Paste any long link and
              get a short, shareable link in seconds — perfect for shortening a URL for your
              Instagram bio, WhatsApp messages, TikTok captions, emails, or social posts. There is
              no login wall, no link expiry, and no tracking cookies.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white mb-2">Shorten links for Instagram bio, WhatsApp &amp; more</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Long URLs break character limits and look messy. Use this short link maker to condense
              an affiliate link, a product page, a YouTube video, or any web address into a clean
              short URL you can drop anywhere. Our short links are hosted on the UpTools domain, so
              they work reliably on every device and messenger.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white mb-2">A URL shortener with your own domain</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Unlike free link shorteners that use random third-party domains, short links here point
              to the UpTools domain — a real, fast website. That means your shortened links look more
              trustworthy and redirect instantly, so you can shorten links for Instagram, WhatsApp,
              and anywhere else with confidence.
            </p>
          </div>
          <p className="text-xs text-slate-600 pt-1">
            Try our other link tools:{' '}
            <a className="text-cyan-400 hover:text-cyan-300" href="/qr-generator/">QR Code Generator</a>,{' '}
            <a className="text-cyan-400 hover:text-cyan-300" href="/whatsapp-link-generator/">WhatsApp Link Generator</a>,{' '}
            and <a className="text-cyan-400 hover:text-cyan-300" href="/whatsapp-chat/">WhatsApp Click-to-Chat</a>.
          </p>
        </div>
      </div>
    </ToolLayout>
  )
}
