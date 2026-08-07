import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const WA_HOST_RE = /^(https?:\/\/)?([a-z0-9-]+\.)?(pps|mmg)\.whatsapp\.net/i

export default function whatsapp_dp_downloader() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [mode, setMode] = useState('link')
  const [input, setInput] = useState('')
  const [phone, setPhone] = useState('')
  const [waLink, setWaLink] = useState('')
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

  const makeWaLink = useCallback(() => {
    const clean = phone.replace(/[^0-9+]/g, '')
    if (!clean) return showStatus('Enter a WhatsApp phone number', 'error')
    const link = (clean.startsWith('+') ? `https://wa.me/${clean.slice(1)}` : `https://wa.me/${clean}`)
    setWaLink(link)
    showStatus('✓ Chat link created! Open it to view and save the DP.', 'success')
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }, [phone])

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

  const tabBtn = (val, label, active) =>
    `flex-1 py-3 rounded-xl text-sm font-bold transition-all border-2 ${
      active ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
      : 'bg-white/[0.04] border-white/8 text-slate-400 hover:border-white/12'}`
  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"

  return (
    <ToolLayout
      title="WhatsApp DP Downloader"
      desc="WhatsApp DP downloader — download WhatsApp profile pictures online free, by image link or by phone number. Save any visible profile picture in full resolution. Works as a WhatsApp DP saver, no app or sign-up needed."
      icon="📸" iconBg="rgba(37,211,102,0.08)"
      category="whatsapp" slug="whatsapp-dp-downloader"
      faq={[
        { q: "How do I download a WhatsApp DP online free?", a: "Two ways: (1) By image link — paste the pps.whatsapp.net profile-picture URL from WhatsApp Web and click Fetch Picture to download it. (2) By number — enter the phone number and we generate a wa.me chat link; open it to view and save the DP in the chat." },
        { q: "How do I download a WhatsApp DP by number?", a: "Select the 'Number / Chat' tab, enter the phone number, and click Open WhatsApp. We generate a wa.me link that opens the chat — tap the contact's name then the profile photo to save it. WhatsApp doesn't allow direct by-number downloads without a session." },
        { q: "How do I get the WhatsApp profile-picture link?", a: "Open WhatsApp Web, open a chat, right-click the contact's profile photo and copy the image address — it starts with pps.whatsapp.net. Paste that link here to download the DP." },
        { q: "Why can't I just enter a phone number to get the DP?", a: "WhatsApp does not expose profile pictures by phone number without a logged-in session. That's why we offer both lanes: the image link downloads it directly, and the number lane opens the chat so you can save it manually." },
        { q: "What resolution do I get?", a: "WhatsApp stores profile pictures at up to 640x640 pixels. The image-link lane pulls the highest-quality version available." },
        { q: "Is it legal to download someone's WhatsApp profile picture?", a: "Downloading for personal viewing is generally acceptable, but using or sharing someone's photo without permission may violate their privacy rights." },
      ]}
      howItWorks={[
        "Choose a lane: by image link (real download) or by phone number (opens the chat).",
        "Paste the pps.whatsapp.net link, or enter the number and open WhatsApp.",
        "Download the full-resolution WhatsApp DP.",
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
            ⚠️ <b>Note:</b> WhatsApp doesn't expose a DP by phone number alone. Use the <b>image-link</b> lane to download directly, or the <b>number</b> lane to open the chat and save it. Respect others' privacy — only download pictures you're allowed to.
          </p>
        </div>

        <div className="flex gap-2">
          <button className={tabBtn('link', '🔗 By Image Link', mode === 'link')} onClick={() => { setMode('link'); setImageUrl(''); setWaLink('') }}>
            🔗 By Image Link
          </button>
          <button className={tabBtn('number', '📞 By Number', mode === 'number')} onClick={() => { setMode('number'); setImageUrl(''); setWaLink('') }}>
            📞 By Number
          </button>
        </div>

        {mode === 'link' && (
          <>
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
          </>
        )}

        {mode === 'number' && (
          <>
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-2">WhatsApp Phone Number</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className={inputClass} />
            </div>
            <button onClick={makeWaLink}
              className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-400 transition-all active:scale-[0.98]">
              💬 Open WhatsApp Chat
            </button>
            {waLink && (
              <div ref={resultRef} className="rounded-3xl border-2 border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.06] via-white/[0.01] to-transparent p-6 text-center"
                style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
                <p className="text-sm text-slate-400 mb-3">
                  Open this link, then tap the contact's <b className="text-slate-300">name → profile photo</b> to view and save the DP.
                </p>
                <a href={waLink} target="_blank" rel="noopener noreferrer"
                  className="block text-sm font-mono text-emerald-300 bg-white/[0.06] rounded-xl p-3 break-all border border-emerald-500/20 hover:bg-emerald-500/10 transition-all">
                  {waLink}
                </a>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => navigator.clipboard.writeText(waLink)}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/8 text-sm font-bold text-slate-400 hover:text-white transition-all">
                    📋 Copy
                  </button>
                  <a href={waLink} target="_blank" rel="noopener noreferrer"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-bold text-center hover:bg-emerald-400 transition-all">
                    ↗ Open WhatsApp
                  </a>
                </div>
              </div>
            )}
          </>
        )}

        {status.msg && (
          <div className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-center ${
            status.type === 'success' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
            : status.type === 'error' ? 'bg-red-500/15 text-red-400 border border-red-500/30'
            : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
          }`}>
            {status.msg}
          </div>
        )}

        {mode === 'link' && imageUrl && (
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

        {mode === 'link' && !imageUrl && !loading && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📸</div>
            <p className="text-sm text-slate-600 font-medium">Paste a WhatsApp profile-picture link and click Fetch Picture</p>
          </div>
        )}

        <div className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-6 space-y-5">
          <h2 className="text-base font-bold text-white">How to Download WhatsApp DP Online Free</h2>
          <p className="text-sm text-slate-400">
            This free WhatsApp DP downloader offers <b className="text-slate-300">two lanes</b>: paste the real
            image link (<span className="font-mono text-emerald-300">pps.whatsapp.net</span>) to download directly,
            or enter a phone number to get a <b className="text-slate-300">WhatsApp chat link</b> and save the DP from
            the chat. It works as a WhatsApp DP saver — no app, no registration, and no watermark.
          </p>
          <ol className="space-y-2 text-sm text-slate-400 list-decimal list-inside">
            <li><b className="text-slate-300">By link:</b> WhatsApp Web → right-click profile photo → copy image address → paste here.</li>
            <li><b className="text-slate-300">By number:</b> enter the number → open the wa.me chat → tap name → tap profile photo → save.</li>
            <li>Download the full-resolution photo as JPG or PNG.</li>
          </ol>
          <div className="border-t border-white/8 pt-4">
            <h3 className="text-sm font-bold text-slate-300 mb-2">WhatsApp DP Saver tips</h3>
            <ul className="space-y-1.5 text-sm text-slate-400 list-disc list-inside">
              <li>The image link expires after a while — download soon after copying it.</li>
              <li>You can only download a DP you can actually see in WhatsApp.</li>
              <li>For <b className="text-slate-300">WhatsApp DP download by number</b>, see our <a className="text-emerald-300 underline" href="/whatsapp-dp-by-number/">WhatsApp DP by Number</a> guide.</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
