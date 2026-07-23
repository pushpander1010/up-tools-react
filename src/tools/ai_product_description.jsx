import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'
import useAIStream from '../hooks/useAIStream'

const PLATFORMS = ['Amazon', 'Shopify', 'Flipkart', 'Etsy', 'Instagram Shop', 'General']

const PLATFORM_GUIDES = {
  'Amazon': 'Include: compelling title variation, 5 bullet points for key features, and a detailed description paragraph. Amazon format.',
  'Shopify': 'Write a short punchy headline, 2–3 paragraph description, and a bulleted feature list. Optimize for conversion.',
  'Flipkart': 'Include product highlights as bullet points, a detailed description, and key specifications. Indian market focus.',
  'Etsy': 'Warm, personal tone. Emphasize handmade quality, story behind the product, and materials. Include care instructions if relevant.',
  'Instagram Shop': 'Short, punchy, emoji-friendly. 150 words max. Include a strong CTA.',
  'General': 'Versatile product description with title, short description, key features, and a CTA.',
}

export default function ai_product_description() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const { output, status, streaming, generate, stop } = useAIStream()
  const [productName, setProductName] = useState('')
  const [features, setFeatures] = useState('')
  const [category, setCategory] = useState('Electronics')
  const [audience, setAudience] = useState('')
  const [tone, setTone] = useState('Persuasive')
  const [keywords, setKeywords] = useState('')
  const [usp, setUsp] = useState('')
  const [platform, setPlatform] = useState('Amazon')
  const [copied, setCopied] = useState(false)

  const handleGenerate = useCallback(() => {
    if (!productName.trim() || !features.trim()) return

    const prompt = `Write a compelling, conversion-optimized product description for ${platform}.

Product: ${productName.trim()}
Category: ${category}
Key Features/Specs: ${features.trim()}
${audience ? 'Target buyer: ' + audience.trim() : ''}
${usp ? 'Unique selling point: ' + usp.trim() : ''}
Tone: ${tone}
${keywords ? 'SEO keywords to include naturally: ' + keywords.trim() : ''}

Platform requirements: ${PLATFORM_GUIDES[platform]}

Make it persuasive, benefit-focused (not just feature-focused), and ready to publish.`

    generate({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.65,
      systemPrompt: 'You are an expert e-commerce copywriter who writes product descriptions that convert browsers into buyers. You understand SEO, platform requirements, and consumer psychology.',
    })
    jumpTo()
  }, [productName, features, category, audience, tone, keywords, usp, platform, generate, jumpTo])

  const copy = () => {
    if (!output) return
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 1500)
    })
  }

  const download = () => {
    if (!output) return
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'product-description.txt'
    document.body.appendChild(a); a.click(); a.remove()
    URL.revokeObjectURL(url)
  }

  const inputClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600"
  const selectClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"

  return (
    <ToolLayout
      title="AI Product Description Generator"
      desc="Write conversion-optimized product descriptions for Amazon, Shopify, Flipkart, Etsy, Instagram Shop, and more."
      icon="📦" iconBg="rgba(168,85,247,0.08)"
      category="ai" slug="ai-product-description"
      faq={[
        { q: "Which platforms are supported?", a: "Amazon, Shopify, Flipkart, Etsy, Instagram Shop, and a General format." },
        { q: "Is the generated description SEO-friendly?", a: "Yes — it naturally incorporates your keywords and follows platform-specific best practices." },
      ]}
      howItWorks={[
        "Enter your product name, features, and select the target platform.",
        "Choose tone, target audience, and add SEO keywords if needed.",
        "Click Generate to get a platform-optimized description.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "AI Product Description Generator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/ai-product-description/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Platform Tabs */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <label className="block text-sm font-semibold text-slate-300 mb-3">Target Platform</label>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map(p => (
              <button key={p} onClick={() => setPlatform(p)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  platform === p
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'bg-white/[0.04] text-slate-500 border border-white/[0.08] hover:text-white'
                }`}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 space-y-3">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Product Name *</label>
            <input type="text" value={productName} onChange={e => setProductName(e.target.value)}
              placeholder="e.g. Wireless Noise-Cancelling Headphones"
              className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Key Features / Specs *</label>
            <textarea value={features} onChange={e => setFeatures(e.target.value)} rows={3}
              placeholder="e.g. 40hr battery, Bluetooth 5.3, active noise cancellation, foldable design"
              className={inputClass + ' resize-none'} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className={selectClass}>
                {['Electronics', 'Fashion', 'Home & Kitchen', 'Beauty', 'Sports', 'Toys', 'Books', 'Food & Grocery', 'Health', 'Other'].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Tone</label>
              <select value={tone} onChange={e => setTone(e.target.value)} className={selectClass}>
                {['Persuasive', 'Professional', 'Casual', 'Luxury', 'Fun', 'Minimalist'].map(t => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Target Buyer</label>
              <input type="text" value={audience} onChange={e => setAudience(e.target.value)}
                placeholder="e.g. Young professionals, music lovers"
                className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">SEO Keywords</label>
              <input type="text" value={keywords} onChange={e => setKeywords(e.target.value)}
                placeholder="e.g. wireless headphones, noise cancelling"
                className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Unique Selling Point</label>
            <input type="text" value={usp} onChange={e => setUsp(e.target.value)}
              placeholder="e.g. 40-hour battery life — longest in class"
              className={inputClass} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          {streaming ? (
            <button onClick={stop}
              className="flex-1 px-6 py-3 rounded-xl text-sm font-bold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all">
              ⏹ Stop
            </button>
          ) : (
            <button onClick={handleGenerate} disabled={!productName.trim() || !features.trim()}
              className="flex-1 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}>
              📦 Generate Description
            </button>
          )}
          <button onClick={copy} disabled={!output}
            className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all disabled:opacity-40 ${copied ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/[0.06] border-white/[0.08] text-slate-400 hover:text-white'}`}>
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
          <button onClick={download} disabled={!output}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all disabled:opacity-40">
            ⬇ Download
          </button>
        </div>

        {/* Status */}
        {status && (
          <div className={`p-3 rounded-xl text-sm ${status.includes('Error') ? 'bg-red-500/10 border border-red-500/20 text-red-400' : status.includes('Done') ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-white/[0.06] border border-white/[0.08] text-slate-400'}`}>
            {status}
          </div>
        )}

        {/* Output */}
        <div ref={resultRef} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          {output ? (
            <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">{output}</pre>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-3 opacity-20">📦</div>
              <p className="text-sm text-slate-600 font-medium">Your product description will stream here…</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
