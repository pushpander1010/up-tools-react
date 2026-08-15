import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const PRESETS = [
  { name: 'BBC World', url: 'https://feeds.bbci.co.uk/news/world/rss.xml' },
  { name: 'BBC India', url: 'https://feeds.bbci.co.uk/news/world/asia/india/rss.xml' },
  { name: 'NDTV', url: 'https://feeds.feedburner.com/ndtvnews-top-stories' },
  { name: 'The Hindu', url: 'https://www.thehindu.com/news/national/feeder/default.rss' },
  { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
  { name: 'Hacker News', url: 'https://news.ycombinator.com/rss' },
  { name: 'Reddit (r/technology)', url: 'https://www.reddit.com/r/technology/.rss' },
  { name: 'GitHub Blog', url: 'https://github.blog/feed/' },
]

export default function rss_feed_reader() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [feedUrl, setFeedUrl] = useState(PRESETS[0].url)
  const [feed, setFeed] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async (url) => {
    const target = (url || feedUrl).trim()
    if (!target) return
    setLoading(true)
    setError('')
    jumpTo()
    try {
      const r = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(target)}`)
      const d = await r.json()
      if (d.status !== 'ok' || !d.items) throw new Error('bad feed')
      setFeed(d.feed)
      setItems(d.items)
    } catch {
      setError('Could not load that RSS feed. Check the URL or try another feed.')
      setFeed(null)
      setItems([])
    }
    setLoading(false)
  }, [feedUrl, jumpTo])

  const stripHtml = (s) => {
    const div = document.createElement('div')
    div.innerHTML = s || ''
    return div.textContent || ''
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-400 [color-scheme:dark]"

  return (
    <ToolLayout
      title="RSS Feed Reader"
      desc="Read any RSS or Atom feed as clean, readable articles. Browse news, blogs, and sites with a simple feed URL."
      icon="📰" iconBg="rgba(245,158,11,0.08)"
      category="dev" slug="rss-feed-reader"
      faq={[
        { q: 'What is an RSS feed?', a: 'RSS (Really Simple Syndication) is a format that lets websites publish updates in a standardized XML feed, which readers can subscribe to and browse.' },
        { q: 'How do I find a feed URL?', a: 'Most news sites and blogs expose a feed at URLs like example.com/feed or example.com/rss. Look for the RSS icon or add /feed to a site URL.' },
        { q: 'What happens to the data?', a: 'Nothing is stored. The feed is fetched live through the rss2json API and displayed in your browser.' },
      ]}
      howItWorks={[
        'Pick a preset feed or paste any RSS/Atom URL.',
        'The feed is converted to JSON and loaded.',
        'Browse the latest articles, click through to read on the source site.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        name: "RSS Feed Reader", "applicationCategory": "DeveloperApplication",
        url: "https://www.uptools.in/rss-feed-reader/",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Presets */}
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (
            <button key={p.url} onClick={() => { setFeedUrl(p.url); load(p.url) }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${feedUrl === p.url ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25' : 'bg-white/[0.04] text-slate-400 border border-white/5 hover:text-white'}`}>
              {p.name}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-3">
          <input
            type="text"
            value={feedUrl}
            onChange={e => setFeedUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && load()}
            placeholder="Paste RSS/Atom feed URL..."
            className={inputClass}
          />
          <button onClick={() => load()} disabled={loading}
            className="shrink-0 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm shadow-lg shadow-amber-500/25 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
            {loading ? '⏳' : '📰 Load'}
          </button>
        </div>

        {error && <p className="text-center text-sm text-rose-400">{error}</p>}

        {feed && items.length > 0 && (
          <div ref={resultRef} className="space-y-3" style={{ animation: 'slideUp 0.35s ease-out' }}>
            {/* Feed header */}
            <div className="rounded-3xl border-2 border-white/8 bg-gradient-to-br from-amber-500/[0.08] to-transparent p-5 flex items-center gap-3">
              <div className="text-3xl">📰</div>
              <div>
                <div className="text-lg font-extrabold text-white">{feed.title}</div>
                <div className="text-xs text-slate-400 mt-0.5">{items.length} latest articles</div>
              </div>
            </div>

            {/* Articles */}
            <div className="space-y-2">
              {items.map((it, i) => (
                <a key={i} href={it.link} target="_blank" rel="noopener noreferrer"
                  className="block p-4 rounded-2xl bg-white/[0.04] border border-white/8 hover:bg-white/[0.07] hover:border-white/15 transition-all">
                  <div className="text-sm font-bold text-white mb-1">{it.title}</div>
                  {it.description && (
                    <p className="text-xs text-slate-400 line-clamp-2 mb-2">{stripHtml(it.description)}</p>
                  )}
                  <div className="text-[10px] text-slate-500">
                    {it.pubDate ? new Date(it.pubDate).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : ''}
                    {it.author ? ` · ${it.author}` : ''}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
