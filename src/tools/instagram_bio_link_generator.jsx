import { useState, useCallback, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const TEMPLATES = {
  minimal: { label: 'Minimal', emoji: '✨', links: [
    { label: 'Latest Blog Post', url: '' },
    { label: 'YouTube Channel', url: '' },
    { label: 'Online Store', url: '' },
  ]},
  creator: { label: 'Content Creator', emoji: '🎬', links: [
    { label: 'New Video', url: '' },
    { label: 'Merch Store', url: '' },
    { label: 'Patreon', url: '' },
    { label: 'Discord', url: '' },
    { label: 'TikTok', url: '' },
  ]},
  business: { label: 'Business', emoji: '💼', links: [
    { label: 'Official Website', url: '' },
    { label: 'Book a Call', url: '' },
    { label: 'Free Resources', url: '' },
    { label: 'Contact Us', url: '' },
    { label: 'Reviews', url: '' },
  ]},
  artist: { label: 'Artist/Portfolio', emoji: '🎨', links: [
    { label: 'Portfolio', url: '' },
    { label: 'Commission Info', url: '' },
    { label: 'Print Shop', url: '' },
    { label: 'Art Process', url: '' },
  ]},
  music: { label: 'Musician', emoji: '🎵', links: [
    { label: 'Latest Track', url: '' },
    { label: 'Spotify', url: '' },
    { label: 'Merch', url: '' },
    { label: 'Tour Dates', url: '' },
    { label: 'Behind the Scenes', url: '' },
  ]},
}

export default function instagram_bio_link_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [template, setTemplate] = useState('minimal')
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [links, setLinks] = useState(TEMPLATES.minimal.links.map(l => ({ ...l })))
  const [generated, setGenerated] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleTemplateChange = (t) => {
    setTemplate(t)
    setLinks(TEMPLATES[t].links.map(l => ({ ...l })))
  }

  const updateLink = (index, field, value) => {
    setLinks(prev => prev.map((l, i) => i === index ? { ...l, [field]: value } : l))
  }

  const addLink = () => setLinks(prev => [...prev, { label: 'New Link', url: '' }])
  const removeLink = (index) => setLinks(prev => prev.filter((_, i) => i !== index))

  const handleGenerate = useCallback(() => {
    const html = generateHTML(name, bio, links)
    setGenerated(html)
    jumpTo()
  }, [name, bio, links, jumpTo])

  const copyHTML = () => {
    if (!generated) return
    navigator.clipboard.writeText(generated)
    setCopied(true); setTimeout(() => setCopied(false), 1500)
  }

  const downloadHTML = () => {
    if (!generated) return
    const blob = new Blob([generated], { type: 'text/html' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'bio-link-page.html'
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(a.href)
  }

  return (
    <ToolLayout
      title="Instagram Bio Link Generator"
      desc="Create a beautiful link-in-bio page. Generate HTML you can host anywhere — no sign-up required."
      icon="🔗" iconBg="rgba(236,72,153,0.08)"
      category="social" slug="instagram-bio-link-generator"
      faq={[
        { q: "What is a bio link page?", a: "A bio link page is a single URL that houses multiple links — perfect for Instagram where you can only put one link in your bio." },
        { q: "How do I use the generated HTML?", a: "Download the HTML file and host it on any free hosting service (GitHub Pages, Netlify, Vercel). Then put that URL in your Instagram bio." },
        { q: "Can I customize the design?", a: "Yes! Edit the downloaded HTML file to change colors, fonts, layout, and add your own styling." },
      ]}
      howItWorks={[
        'Choose a template style that fits your brand.',
        'Add your name, bio, and links with labels.',
        'Generate and download the HTML file to host anywhere.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Instagram Bio Link Generator", "applicationCategory": "SocialNetworkingApplication",
        "url": "https://www.uptools.in/instagram-bio-link-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Template</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(TEMPLATES).map(([k, v]) => (
                <button key={k} onClick={() => handleTemplateChange(k)}
                  className={`p-3 rounded-xl text-sm font-bold transition-all text-center ${template === k ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30' : 'bg-white/[0.04] text-slate-500 border border-white/[0.08] hover:text-white'}`}>
                  {v.emoji} {v.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Display Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Your Name or Brand" maxLength={50}
              className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 [color-scheme:dark]" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Bio / Tagline</label>
            <input type="text" value={bio} onChange={e => setBio(e.target.value)}
              placeholder="Your tagline or description" maxLength={150}
              className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 [color-scheme:dark]" />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-300">Links</label>
            {links.map((link, i) => (
              <div key={i} className="flex gap-2 items-start">
                <input type="text" value={link.label} onChange={e => updateLink(i, 'label', e.target.value)}
                  placeholder="Label" maxLength={40}
                  className="flex-1 bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 [color-scheme:dark]" />
                <input type="url" value={link.url} onChange={e => updateLink(i, 'url', e.target.value)}
                  placeholder="https://..."
                  className="flex-1 bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 [color-scheme:dark]" />
                {links.length > 1 && (
                  <button onClick={() => removeLink(i)}
                    className="px-3 py-2.5 rounded-xl bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20 transition-all">✕</button>
                )}
              </div>
            ))}
            <button onClick={addLink}
              className="w-full py-2.5 rounded-xl border-2 border-dashed border-white/[0.08] text-slate-500 text-sm font-bold hover:text-white hover:border-white/20 transition-all">
              + Add Link
            </button>
          </div>

          <button onClick={handleGenerate}
            className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
            🔗 Generate Page
          </button>
        </div>

        {generated && (
          <div ref={resultRef} className="space-y-3" style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex gap-2">
              <button onClick={copyHTML}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/[0.08] text-slate-400 hover:text-white'}`}>
                {copied ? '✓ Copied' : '📋 Copy HTML'}
              </button>
              <button onClick={downloadHTML}
                className="flex-1 py-3 rounded-xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all">
                📥 Download HTML
              </button>
            </div>

            <div className="bg-black/30 rounded-2xl border border-white/[0.08] p-4 max-h-64 overflow-y-auto">
              <pre className="text-xs text-slate-400 font-mono whitespace-pre-wrap break-all">{generated}</pre>
            </div>

            {/* Live preview */}
            <div className="rounded-2xl border border-white/[0.08] overflow-hidden bg-white">
              <div className="bg-gray-100 px-4 py-2 text-xs text-gray-500 font-bold">Preview</div>
              <div className="p-6 bg-gradient-to-b from-pink-50 to-white text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold">
                  {(name || 'U')[0]?.toUpperCase()}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{name || 'Your Name'}</h3>
                <p className="text-sm text-gray-500 mt-1">{bio || 'Your bio goes here'}</p>
                <div className="mt-4 space-y-2">
                  {links.filter(l => l.label).map((l, i) => (
                    <div key={i} className="px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 bg-white">
                      {l.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {!generated && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🔗</div>
            <p className="text-sm text-slate-600 font-medium">Fill in your details and generate your bio link page</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}

function generateHTML(name, bio, links) {
  const linksHTML = links.filter(l => l.label).map(l =>
    `    <a href="${l.url || '#'}" class="link" target="_blank" rel="noopener">${l.label}</a>`
  ).join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name || 'My Links'} — Link in Bio</title>
  <meta name="description" content="${bio || 'My link in bio page'}">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #fdf2f8, #fce7f3); min-height: 100vh; display: flex; justify-content: center; padding: 2rem; }
    .container { max-width: 420px; width: 100%; text-align: center; padding-top: 3rem; }
    .avatar { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #a855f7, #ec4899); margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem; font-weight: bold; }
    h1 { font-size: 1.5rem; font-weight: 800; color: #1f2937; }
    .bio { color: #6b7280; margin: 0.5rem 0 1.5rem; font-size: 0.95rem; }
    .link { display: block; padding: 0.9rem 1.5rem; margin: 0.6rem 0; border: 1px solid #e5e7eb; border-radius: 12px; text-decoration: none; color: #374151; font-weight: 600; font-size: 0.95rem; background: white; transition: all 0.2s; }
    .link:hover { border-color: #a855f7; color: #a855f7; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .footer { margin-top: 3rem; color: #9ca3af; font-size: 0.75rem; }
  </style>
</head>
<body>
  <div class="container">
    <div class="avatar">${(name || 'U')[0]?.toUpperCase()}</div>
    <h1>${name || 'Your Name'}</h1>
    <p class="bio">${bio || ''}</p>
${linksHTML}
    <p class="footer">Created with UpTools Bio Link Generator</p>
  </div>
</body>
</html>`
}
