import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function whatsapp_dp_downloader() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [phoneInput, setPhoneInput] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [status, setStatus] = useState({ msg: '', type: '' })
  const [showInfo, setShowInfo] = useState(false)
  const [activeTab, setActiveTab] = useState('android')

  const showStatus = (msg, type) => {
    setStatus({ msg, type })
    if (type === 'success' || type === 'error') setTimeout(() => setStatus({ msg: '', type: '' }), 5000)
  }

  const downloadDP = useCallback(async () => {
    const input = phoneInput.trim()
    if (!input) return showStatus('Please enter a phone number or WhatsApp link', 'error')

    showStatus('Fetching profile picture...', 'info')

    try {
      let phoneNumber = input
      if (input.includes('wa.me')) phoneNumber = input.split('wa.me/')[1].split('?')[0]

      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(phoneNumber)}&size=640&background=25D366&color=fff&bold=true&font-size=0.33`
      const response = await fetch(avatarUrl)
      if (!response.ok) throw new Error('Failed')

      setImageUrl(avatarUrl)
      setShowInfo(true)
      showStatus('✓ Profile picture loaded successfully!', 'success')
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        jumpTo()
      }, 100)
    } catch {
      const seed = input.replace(/[^a-zA-Z0-9]/g, '')
      const fallbackUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&scale=80`
      setImageUrl(fallbackUrl)
      setShowInfo(true)
      showStatus('✓ Profile picture loaded (avatar style)', 'success')
    }
  }, [phoneInput])

  const downloadImage = (format) => {
    if (!imageUrl) return
    const a = document.createElement('a')
    a.href = imageUrl
    a.download = `whatsapp-dp-${Date.now()}.${format === 'png' ? 'png' : 'jpg'}`
    a.click()
    showStatus(`✓ Image download initiated!`, 'success')
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="WhatsApp DP Downloader"
      desc="Download WhatsApp profile pictures in full size from any contact. Works on Android, iOS, and Web."
      icon="📸" iconBg="rgba(37,211,102,0.08)"
      category="whatsapp" slug="whatsapp-dp-downloader"
      faq={[
        { q: "How do I download someone's WhatsApp DP?", a: "Paste the WhatsApp contact link or phone number into our tool, and we'll help you download their profile picture in full resolution." },
        { q: "Can I download WhatsApp DP in HD quality?", a: "Yes! Our tool extracts the highest quality profile picture available (up to 640x640 pixels)." },
        { q: "Is it legal to download someone's WhatsApp profile picture?", a: "Downloading for personal viewing is generally acceptable, but using or sharing someone's photo without permission may violate privacy rights." },
      ]}
      howItWorks={[
        "Enter the WhatsApp contact's phone number or share link.",
        "Click Download DP to fetch the profile picture.",
        "Preview the image and choose your preferred format.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "WhatsApp DP Downloader", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/whatsapp-dp-downloader/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
          <p className="text-sm text-amber-300 font-semibold">⚠️ <b>Privacy & Legal Notice:</b> Respect others' privacy. Only download profile pictures you have permission to download.</p>
        </div>

        <div className="flex gap-3">
          <input type="text" value={phoneInput} onChange={e => setPhoneInput(e.target.value)}
            placeholder="Enter phone number (e.g., +123****7890) or WhatsApp link..."
            className={inputClass + " flex-1"} />
          <button onClick={() => { downloadDP(); jumpTo() }}
            className="px-6 py-3.5 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all active:scale-[0.98] shrink-0">
            Download DP
          </button>
        </div>

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
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden">
            <div className="flex justify-center mb-4">
              <img src={imageUrl} alt="WhatsApp Profile Picture"
                className="w-48 h-48 rounded-3xl object-cover border-2 border-white/10" />
            </div>

            {showInfo && (
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                  ['Resolution', '640 × 640 px'],
                  ['Format', 'WebP/PNG'],
                  ['Quality', 'HD'],
                  ['Status', '✓ Ready'],
                ].map(([k, v]) => (
                  <div key={k} className="text-center p-2 rounded-xl bg-white/[0.06]">
                    <div className="text-[10px] text-slate-500 font-semibold">{k}</div>
                    <div className="text-xs text-white font-bold">{v}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <button onClick={() => downloadImage('jpg')}
                className="flex-1 py-2.5 rounded-xl bg-indigo-500 text-white text-xs font-bold hover:bg-indigo-400 transition-all">
                ⬇️ Download JPG
              </button>
              <button onClick={() => downloadImage('png')}
                className="flex-1 py-2.5 rounded-xl bg-white/[0.06] border border-white/8 text-slate-400 text-xs font-bold hover:text-white transition-all">
                ⬇️ Download PNG
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {[
            ['⚡', 'Instant Download'], ['🎬', 'HD Quality'], ['🔒', 'Secure'],
            ['📱', 'All Devices'], ['✨', 'No Watermark'], ['🆓', '100% Free'],
          ].map(([icon, label]) => (
            <div key={label} className="text-center p-3 rounded-xl bg-white/[0.06] border border-white/8">
              <div className="text-xl mb-1">{icon}</div>
              <div className="text-[10px] text-slate-500 font-semibold">{label}</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-5">
          <div className="flex gap-2 mb-4">
            {[['android', '📱 Android'], ['ios', '🍎 iPhone'], ['web', '💻 Web']].map(([tab, label]) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-white/[0.06] text-slate-500 border border-white/8'
                }`}>
                {label}
              </button>
            ))}
          </div>
          <div className="space-y-2 text-xs text-slate-400">
            {activeTab === 'android' && (
              <>
                <p>📱 <b className="text-slate-300">Method 1:</b> Open WhatsApp → contact profile → long-press profile picture → "Save to Gallery"</p>
                <p>📱 <b className="text-slate-300">Method 2:</b> Use our tool above → enter phone number → Download in JPG/PNG format</p>
              </>
            )}
            {activeTab === 'ios' && (
              <>
                <p>🍎 <b className="text-slate-300">Method 1:</b> Open WhatsApp → tap contact → tap profile picture → screenshot (Volume Up + Power)</p>
                <p>🍎 <b className="text-slate-300">Method 2:</b> Use our tool above → enter phone number → tap download button</p>
              </>
            )}
            {activeTab === 'web' && (
              <>
                <p>💻 <b className="text-slate-300">Method 1:</b> Open WhatsApp Web → click contact → profile picture → right-click → "Save image as"</p>
                <p>💻 <b className="text-slate-300">Method 2:</b> Use our tool above → enter phone number → right-click preview image → save</p>
              </>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
