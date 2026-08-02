import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'

function slugify(text, separator, caseType) {
  if (!text) return ''
  let slug = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  slug = slug.replace(/[^a-zA-Z0-9\s\-_.~]/g, '').trim()
  if (caseType === 'lower') slug = slug.toLowerCase()
  else if (caseType === 'upper') slug = slug.toUpperCase()
  slug = slug.replace(/\s+/g, separator)
  slug = slug.replace(new RegExp('[' + separator + ']{2,}', 'g'), separator)
  slug = slug.replace(new RegExp('^[' + separator + ']+|[' + separator + ']+$', 'g'), '')
  return slug
}

export default function SlugGenerator() {
  const [input, setInput] = useState('How to Install Node.js on Ubuntu')
  const [separator, setSeparator] = useState('-')
  const [caseType, setCaseType] = useState('lower')

  const output = useMemo(() => slugify(input, separator, caseType), [input, separator, caseType])

  return (
    <ToolLayout
      title="URL Slug Generator"
      desc="Convert any text to a clean, SEO-optimized URL slug instantly. Supports multiple languages."
      icon="🔗" iconBg="rgba(99,102,241,0.08)"
      category="dev" slug="slug-generator"
      faq={[
        { q: 'What is a URL slug?', a: 'A URL slug is the part of a URL that identifies a specific page in a human-readable format, e.g. "my-blog-post" from "/blog/my-blog-post/".' },
        { q: 'Why use lowercase slugs?', a: 'Lowercase slugs are standard because URLs are case-sensitive on many servers. Consistency avoids duplicate content and 404 errors.' },
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "URL Slug Generator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/slug-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Text to Convert</label>
          <textarea className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white font-mono min-h-[100px] resize-y focus:outline-none focus:border-indigo-500/50"
            value={input} onChange={e => setInput(e.target.value)} placeholder="Enter text to slugify..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Separator</label>
            <select className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50"
              value={separator} onChange={e => setSeparator(e.target.value)}>
              <option value="-">Hyphen (-)</option>
              <option value="_">Underscore (_)</option>
              <option value=".">Dot (.)</option>
              <option value="~">Tilde (~)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Case</label>
            <select className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50"
              value={caseType} onChange={e => setCaseType(e.target.value)}>
              <option value="lower">Lowercase</option>
              <option value="upper">UPPERCASE</option>
              <option value="keep">Keep Original</option>
            </select>
          </div>
        </div>

        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-slate-300">Generated Slug</label>
            <button className="glow-btn text-xs px-3 py-1 rounded-lg" onClick={() => navigator.clipboard.writeText(output)}>
              📋 Copy
            </button>
          </div>
          <div className="bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white font-mono break-all">
            {output || <span className="text-slate-400">Enter text to generate a slug</span>}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
