import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import blogsData from '../data/blogs.json'

export default function BlogsPage() {
  const [selectedCat, setSelectedCat] = useState('All')
  const [search, setSearch] = useState('')

  const categories = useMemo(() => {
    const set = new Set(blogsData.map(b => b.category))
    return ['All', ...Array.from(set)]
  }, [])

  const filteredBlogs = useMemo(() => {
    return blogsData.filter(b => {
      const matchCat = selectedCat === 'All' || b.category === selectedCat
      const q = search.toLowerCase().trim()
      const matchSearch = !q || b.title.toLowerCase().includes(q) ||
        b.desc.toLowerCase().includes(q) ||
        b.tags.some(t => t.toLowerCase().includes(q))
      return matchCat && matchSearch
    })
  }, [selectedCat, search])

  const breadcrumbsSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.uptools.in/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blogs',
        item: 'https://www.uptools.in/blogs/'
      }
    ]
  }

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'UpTools Trending Blogs & Insights',
    description: 'Trending stories and comprehensive guides covering Tech, Cricket, Sports, and AI across India, USA, and the UK.',
    numberOfItems: blogsData.length,
    itemListElement: blogsData.map((b, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: b.title,
      url: `https://www.uptools.in/blogs/${b.slug}/`
    }))
  }

  return (
    <>
      <Helmet>
        <title>Blogs - Trending Tech, Cricket, Sports & AI News | UpTools</title>
        <meta name="description" content="Explore trending stories from India, USA & UK on iPhone 17, Asia Cup 2026, US Open tennis, Premier League, and the best AI tools — curated by UpTools." />
        <link rel="canonical" href="https://www.uptools.in/blogs/" />
        <meta property="og:title" content="Blogs - Trending Tech, Cricket, Sports & AI News | UpTools" />
        <meta property="og:description" content="Trending stories from India, USA & UK on iPhone 17, Asia Cup 2026, US Open, and AI tools — curated by UpTools." />
        <meta property="og:url" content="https://www.uptools.in/blogs/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="UpTools" />
        <meta property="og:image" content="https://www.uptools.in/assets/og/default.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blogs - Trending Tech, Cricket, Sports & AI News | UpTools" />
        <meta name="twitter:description" content="Trending stories from India, USA & UK on iPhone 17, Asia Cup 2026, US Open, and AI tools." />
        <script type="application/ld+json">{JSON.stringify(breadcrumbsSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
      </Helmet>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-5" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span className="text-slate-700">›</span>
        <span className="text-slate-300 font-medium">Blogs</span>
      </nav>

      {/* Hero Header */}
      <div className="relative mb-8 overflow-hidden rounded-3xl border border-white/[0.06] p-8 sm:p-10"
        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(17,24,39,0.4))' }}>
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.2), transparent 70%)' }} />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)' }} />

        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand/10 border border-brand/30 text-indigo-300 mb-4">
            <span>📰</span> UpTools Editorial & Insights
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold gradient-text leading-tight m-0 mb-3">
            Trending Stories & Guides
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Trending stories from India, USA & UK — curated by UpTools. Deep dives into consumer tech, global sports events, AI productivity, and financial breakdowns.
          </p>

          {/* Search & Category filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <input
                type="search"
                placeholder="Search trending blogs, topics, tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-navy-950/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                    selectedCat === cat
                      ? 'bg-brand/20 border-brand/50 text-white'
                      : 'border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Blogs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.map((blog) => (
          <article
            key={blog.slug}
            className="bg-white/[0.04] border border-white/10 rounded-2xl hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300 flex flex-col overflow-hidden group shadow-lg shadow-black/20"
          >
            {/* Cover Image Container */}
            <Link to={`/blogs/${blog.slug}/`} className="block relative aspect-video overflow-hidden bg-navy-950">
              <img
                src={blog.coverImage}
                alt={blog.coverAlt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src = '/assets/og/default.png'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-brand/80 text-white shadow-md backdrop-blur-md border border-white/20">
                  {blog.category}
                </span>
              </div>
            </Link>

            {/* Card Content */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2.5 font-medium">
                  <span>{blog.date}</span>
                  <span>•</span>
                  <span>{blog.readTime}</span>
                </div>

                <h2 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug mb-2">
                  <Link to={`/blogs/${blog.slug}/`} className="hover:underline">
                    {blog.title}
                  </Link>
                </h2>

                <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {blog.excerpt}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {blog.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white/5 text-slate-400 border border-white/5"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">{blog.author}</span>
                  <Link
                    to={`/blogs/${blog.slug}/`}
                    className="font-semibold text-indigo-400 group-hover:text-indigo-300 group-hover:translate-x-0.5 transition-all inline-flex items-center gap-1"
                  >
                    Read →
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredBlogs.length === 0 && (
        <div className="text-center py-16 rounded-3xl border border-dashed border-white/10 bg-white/[0.02]">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-semibold text-white mb-1">No blogs found</h3>
          <p className="text-sm text-slate-400">Try changing your search query or category filter.</p>
        </div>
      )}
    </>
  )
}
