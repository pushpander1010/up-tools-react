import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import blogsData from '../data/blogs.json'
import FAQ from '../components/FAQ'

export default function BlogPostPage() {
  const { slug } = useParams()
  const blog = blogsData.find(b => b.slug === slug)
  const [copied, setCopied] = useState(false)

  if (!blog) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-white mb-3">Blog not found</h1>
        <p className="text-sm text-slate-400 mb-6">We could not find the article you are looking for.</p>
        <Link to="/blogs" className="glow-btn text-sm px-6 py-2.5 rounded-xl no-underline inline-flex items-center gap-2">← Back to Blogs</Link>
      </div>
    )
  }

  const idx = blogsData.findIndex(b => b.slug === slug)
  const prev = idx > 0 ? blogsData[idx - 1] : null
  const next = idx < blogsData.length - 1 ? blogsData[idx + 1] : null
  const related = blogsData.filter(b => b.slug !== slug).slice(0, 3)

  const url = `https://www.uptools.in/blogs/${blog.slug}/`
  const ogImage = blog.coverImage || '/assets/og/default.png'

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.desc,
    image: `https://www.uptools.in${ogImage}`,
    datePublished: blog.date,
    dateModified: blog.date,
    author: { '@type': 'Organization', name: 'UpTools', url: 'https://www.uptools.in/' },
    publisher: { '@type': 'Organization', name: 'UpTools', logo: { '@type': 'ImageObject', url: 'https://www.uptools.in/assets/logo/uptools-logo.svg' } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    keywords: (blog.keywords || blog.tags || []).join(', '),
    articleSection: blog.category,
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.uptools.in/' },
      { '@type': 'ListItem', position: 2, name: 'Blogs', item: 'https://www.uptools.in/blogs/' },
      { '@type': 'ListItem', position: 3, name: blog.title, item: url },
    ]
  }

  const faqSchema = blog.faq && blog.faq.length ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: blog.faq.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  } : null

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <>
      <Helmet>
        <title>{blog.title} | UpTools</title>
        <meta name="description" content={blog.desc} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={`${blog.title} | UpTools`} />
        <meta property="og:description" content={blog.desc} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={`https://www.uptools.in${ogImage}`} />
        <meta property="og:site_name" content="UpTools" />
        <meta property="article:published_time" content={blog.date} />
        <meta property="article:author" content="UpTools Editorial" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${blog.title} | UpTools`} />
        <meta name="twitter:description" content={blog.desc} />
        <meta name="twitter:image" content={`https://www.uptools.in${ogImage}`} />
        {blog.keywords && <meta name="keywords" content={blog.keywords.join(', ')} />}
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
      </Helmet>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-5 flex-wrap" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span className="text-slate-700">›</span>
        <Link to="/blogs" className="hover:text-white transition-colors">Blogs</Link>
        <span className="text-slate-700">›</span>
        <span className="text-slate-300 font-medium line-clamp-1">{blog.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand/20 border border-brand/30 text-indigo-300">{blog.category}</span>
          <span className="text-xs text-slate-500">{blog.date}</span>
          <span className="text-xs text-slate-600">•</span>
          <span className="text-xs text-slate-500">{blog.readTime}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">{blog.title}</h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-3xl mb-4">{blog.desc}</p>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-xs">U</span>
          <span className="text-slate-300 font-medium">{blog.author}</span>
          <span>•</span>
          <span>{blog.readTime}</span>
        </div>
      </div>

      {/* Cover */}
      <div className="rounded-2xl overflow-hidden border border-white/10 mb-8 bg-navy-950">
        <img
          src={blog.coverImage}
          alt={blog.coverAlt}
          className="w-full aspect-video object-cover"
          loading="eager"
          onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/assets/og/default.png' }}
        />
      </div>

      {/* 2-col layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Article */}
        <article className="flex-1 min-w-0">
          {/* TOC mobile */}
          {blog.toc && blog.toc.length > 0 && (
            <div className="lg:hidden mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs font-bold text-white mb-2 uppercase tracking-wider">In this article</p>
              <ul className="space-y-1.5">
                {blog.toc.map(item => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} className="text-xs text-indigo-300 hover:text-white transition-colors">→ {item.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Blog HTML content */}
          <div
            className="blog-content text-sm leading-7 text-slate-300 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:tracking-tight [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul_li]:mb-1.5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_table]:w-full [&_table]:text-xs [&_table]:border-collapse [&_table]:mb-6 [&_th]:bg-white/[0.06] [&_th]:text-white [&_th]:font-semibold [&_th]:px-3 [&_th]:py-2 [&_th]:border [&_th]:border-white/10 [&_td]:px-3 [&_td]:py-2 [&_td]:border [&_td]:border-white/10 [&_td]:text-slate-300 [&_blockquote]:border-l-2 [&_blockquote]:border-indigo-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-400 [&_blockquote]:my-4 [&_a]:text-indigo-400 [&_a]:hover:text-indigo-300 [&_strong]:text-white [&_.lead]:text-base [&_.lead]:text-slate-200 [&_.lead]:leading-relaxed [&_.lead]:mb-6"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* YouTube embed */}
          {blog.youtubeId && (
            <div className="mt-8 rounded-2xl overflow-hidden border border-white/10 bg-black">
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${blog.youtubeId}`}
                  title={blog.title}
                  className="w-full h-full"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="px-4 py-2 bg-white/[0.03] border-t border-white/10">
                <p className="text-xs text-slate-500">Video: {blog.title} — watch on YouTube</p>
              </div>
            </div>
          )}

          {/* Related tools */}
          {blog.relatedTools && blog.relatedTools.length > 0 && (
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h3 className="text-sm font-bold text-white mb-3">Related Tools on UpTools</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {blog.relatedTools.map(tool => (
                  <Link
                    key={tool.slug}
                    to={`/${tool.slug}/`}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.07] hover:border-white/20 transition-colors no-underline group"
                  >
                    <span className="w-8 h-8 rounded-lg bg-brand/20 border border-brand/30 flex items-center justify-center text-xs shrink-0">🔧</span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors">{tool.name}</p>
                      <p className="text-xs text-slate-400 leading-relaxed mt-0.5">{tool.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="mt-8 flex flex-wrap gap-2">
            {blog.tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-slate-400">#{tag}</span>
            ))}
          </div>

          {/* Share */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] border border-white/10 text-slate-300 hover:bg-white/[0.1] hover:text-white transition-colors cursor-pointer"
            >
              {copied ? '✓ Copied!' : '⎘ Copy link'}
            </button>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(blog.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#1DA1F2]/10 border border-[#1DA1F2]/20 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 transition-colors no-underline"
            >
              𝕏 Share on X
            </a>
          </div>

          {/* Prev / Next */}
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            {prev && (
              <Link to={`/blogs/${prev.slug}/`} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-colors no-underline group">
                <p className="text-xs text-slate-500 mb-1">← Previous</p>
                <p className="text-sm font-semibold text-white group-hover:text-indigo-300 line-clamp-2">{prev.title}</p>
              </Link>
            )}
            {next && (
              <Link to={`/blogs/${next.slug}/`} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-colors no-underline group text-right sm:text-left">
                <p className="text-xs text-slate-500 mb-1">Next →</p>
                <p className="text-sm font-semibold text-white group-hover:text-indigo-300 line-clamp-2">{next.title}</p>
              </Link>
            )}
          </div>

          {/* FAQ */}
          {blog.faq && blog.faq.length > 0 && (
            <div className="mt-8">
              <FAQ questions={blog.faq} />
            </div>
          )}
        </article>

        {/* Sidebar - desktop only */}
        <aside className="hidden lg:block w-[300px] shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* TOC */}
            {blog.toc && blog.toc.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">On this page</h3>
                <ul className="space-y-2">
                  {blog.toc.map(item => (
                    <li key={item.id}>
                      <a href={`#${item.id}`} className="text-xs text-slate-400 hover:text-indigo-300 transition-colors leading-relaxed block border-l-2 border-transparent hover:border-indigo-500 pl-3 -ml-px">
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related blogs */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">More from Blogs</h3>
              <div className="space-y-3">
                {related.map(r => (
                  <Link key={r.slug} to={`/blogs/${r.slug}/`} className="flex gap-3 group no-underline">
                    <img src={r.coverImage} alt="" className="w-16 h-12 rounded-lg object-cover shrink-0 bg-navy-950 border border-white/10" loading="lazy" onError={e => { e.currentTarget.style.display = 'none' }} />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white group-hover:text-indigo-300 line-clamp-2 leading-snug">{r.title}</p>
                      <p className="text-[11px] text-slate-500 mt-1">{r.readTime}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link to="/blogs" className="mt-4 inline-flex text-xs font-semibold text-indigo-400 hover:text-indigo-300">View all blogs →</Link>
            </div>

            {/* Tools CTA */}
            <div className="rounded-2xl border border-brand/20 bg-brand/5 p-5">
              <h3 className="text-sm font-bold text-white mb-1">300+ Free Tools</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">Calculators, converters, AI writers — all in your browser. No signup.</p>
              <Link to="/" className="inline-flex px-4 py-2 rounded-xl text-xs font-semibold bg-brand text-white hover:bg-brand/90 transition-colors no-underline">Explore Tools</Link>
            </div>
          </div>
        </aside>
      </div>

      {/* Related blogs - mobile (below article) */}
      <div className="lg:hidden mt-8">
        <h3 className="text-sm font-bold text-white mb-3">More from Blogs</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {related.map(r => (
            <Link key={r.slug} to={`/blogs/${r.slug}/`} className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden hover:bg-white/[0.06] transition-colors no-underline group">
              <img src={r.coverImage} alt={r.coverAlt} className="w-full aspect-video object-cover" loading="lazy" onError={e => { e.currentTarget.src = '/assets/og/default.png' }} />
              <div className="p-3">
                <p className="text-xs font-semibold text-white group-hover:text-indigo-300 line-clamp-2">{r.title}</p>
                <p className="text-[11px] text-slate-500 mt-1">{r.readTime} • {r.category}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
