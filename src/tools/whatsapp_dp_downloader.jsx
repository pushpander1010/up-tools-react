import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const WA_HOST_RE = /^(https?:\/\/)?([a-z0-9-]+\.)?(pps|mmg)\.whatsapp\.net/i

export default function whatsapp_dp_downloader() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [input, setInput] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [fileName, setFileName] = useState('whatsapp-dp')
  const [status, setStatus] = useState({ msg: '', type: '' })
  const [loading, setLoading] = useState(false)

  const showStatus = (msg, type) => {
    setStatus({ msg, type })
    if (type === 'success' || type === 'error') setTimeout(() => setStatus({ msg: '', type: '' }), 6000)
  }

  const fetchDP = useCallback(async () => {
    const raw = input.trim()
    if (!raw) return showStatus('Paste a WhatsApp profile-picture URL first', 'error')
    if (!WA_HOST_RE.test(raw)) {
      return showStatus('That does not look like a WhatsApp profile-picture link (must be pps.whatsapp.net)', 'error')
    }

    setLoading(true)
    showStatus('Fetching profile picture...', 'info')
    try {
      const res = await fetch(`https://backend.uptools.in/api/whatsapp-dp?url=${encodeURIComponent(raw)}`)
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Request failed' }))
        throw new Error(err.detail || err.error || 'Could not fetch the picture')
      }
      const blob = await res.blob()
      const contentType = blob.type || res.headers.get('Content-Type') || 'image/jpeg'
      const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg'
      setFileName(`whatsapp-dp-${Date.now()}.${ext}`)
      setImageUrl(URL.createObjectURL(blob))
      showStatus('✓ Profile picture fetched successfully!', 'success')
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch (e) {
      showStatus(e.message || 'Something went wrong', 'error')
    } finally {
      setLoading(false)
    }
  }, [input])

  const downloadImage = () => {
    if (!imageUrl) return
    const a = document.createElement('a')
    a.href = imageUrl
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    a.remove()
    showStatus('✓ Download started!', 'success')
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"

  return (
    <ToolLayout
      title="WhatsApp DP Downloader"
      desc="Download a WhatsApp profile picture (DP) from its real profile-picture link. Paste the pps.whatsapp.net image URL and get the full-resolution photo."
      icon="📸" iconBg="rgba(37,211,102,0.08)"
      category="whatsapp" slug="whatsapp-dp-downloader"
      faq={[
        { q: "How do I get the WhatsApp profile-picture link?", a: "Open WhatsApp Web, open a chat, right-click the contact's profile photo and copy the image address — it starts with pps.whatsapp.net. Paste that link here." },
        { q: "Why can't I just enter a phone number?", a: "WhatsApp does not expose profile pictures by phone number without a logged-in session. The image URL is the only way a server can fetch it anonymously." },
        { q: "Is it legal to download someone's WhatsApp profile picture?", a: "Downloading for personal viewing is generally acceptable, but using or sharing someone's photo without permission may violate their privacy rights." },
      ]}
      howItWorks={[
        "Copy the real profile-picture link from WhatsApp Web (right-click the photo → copy image address).",
        "Paste the link into the box below.",
        "Click Fetch Picture to download the full-resolution image.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        name: "WhatsApp DP Downloader", applicationCategory: "UtilitiesApplication",
        url: "https://www.uptools.in/whatsapp-dp-downloader/",
        offers: { "@type": "Offer", price: "0", priceCurrency: "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
          <p className="text-sm text-amber-300 font-semibold">
            ⚠️ <b>Note:</b> WhatsApp doesn't expose a DP by phone number alone. This tool fetches the picture from its <b>real image link</b> (a pps.whatsapp.net URL). Respect others' privacy — only download pictures you're allowed to.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-400 mb-2">WhatsApp Profile Picture URL</label>
          <input type="text" value={input} onChange={e => setInput(e.target.value)}
            placeholder="https://pps.whatsapp.net/v/t61.24694-24/..."
            className={inputClass} />
        </div>

        <button onClick={fetchDP} disabled={loading}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all active:scale-[0.98] disabled:opacity-50">
          {loading ? '⏳ Fetching...' : '📸 Fetch Picture'}
        </button>

        {status.msg && (
          <div className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-center ${
            status.type === 'success' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
            : status.type === 'error' ? 'bg-red-500/15 text-red-400 border border-red-500/30'
            : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
          }`}>
            {status.msg}
          </div>
        )}

        {imageUrl && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex justify-center mb-4">
              <img src={imageUrl} alt="WhatsApp Profile Picture"
                className="w-48 h-48 rounded-3xl object-cover border-2 border-white/10" />
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                ['Status', '✓ Ready'],
                ['Source', 'WhatsApp CDN'],
                ['Format', fileName.split('.').pop().toUpperCase()],
              ].map(([k, v]) => (
                <div key={k} className="text-center p-2 rounded-xl bg-white/[0.06]">
                  <div className="text-[10px] text-slate-400 font-semibold">{k}</div>
                  <div className="text-xs text-white font-bold">{v}</div>
                </div>
              ))}
            </div>
            <button onClick={downloadImage}
              className="w-full py-3 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-400 transition-all">
              ⬇️ Download {fileName.split('.').pop().toUpperCase()}
            </button>
          </div>
        )}

        {!imageUrl && !loading && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📸</div>
            <p className="text-sm text-slate-600 font-medium">Paste a WhatsApp profile-picture link and click Fetch Picture</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
