import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const WA_MEDIA_RE = /^(https?:\/\/)?([a-z0-9-]+\.)?(pps|mmg|mms)\.whatsapp\.net/i

export default function whatsapp_status_saver() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [mode, setMode] = useState('link')        // link | number | guide
  const [mediaUrl, setMediaUrl] = useState('')
  const [phone, setPhone] = useState('')
  const [waLink, setWaLink] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [fileName, setFileName] = useState('whatsapp-status')
  const [status, setStatus] = useState({ msg: '', type: '' })
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('android')

  const showStatus = (msg, type) => {
    setStatus({ msg, type })
    if (type === 'success' || type === 'error') setTimeout(() => setStatus({ msg: '', type: '' }), 6000)
  }

  const fetchMedia = useCallback(async () => {
    const raw = mediaUrl.trim()
    if (!raw) return showStatus('Paste a WhatsApp status media link first', 'error')
    if (!WA_MEDIA_RE.test(raw)) {
      return showStatus('That does not look like a WhatsApp media link (pps / mmg / mms.whatsapp.net)', 'error')
    }
    setLoading(true)
    showStatus('Fetching status media...', 'info')
    try {
      const res = await fetch(`https://backend.uptools.in/api/whatsapp-dp?url=${encodeURIComponent(raw)}`)
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Request failed' }))
        throw new Error(err.detail || err.error || 'Could not fetch the status')
      }
      const blob = await res.blob()
      const ct = blob.type || res.headers.get('Content-Type') || 'image/jpeg'
      const ext = ct.includes('png') ? 'png' : ct.includes('webp') ? 'webp' : ct.includes('video') ? 'mp4' : 'jpg'
      setFileName(`whatsapp-status-${Date.now()}.${ext}`)
      setFileUrl(URL.createObjectURL(blob))
      showStatus('✓ Status media fetched successfully!', 'success')
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch (e) {
      showStatus(e.message || 'Something went wrong', 'error')
    } finally {
      setLoading(false)
    }
  }, [mediaUrl])

  const makeWaLink = useCallback(() => {
    const clean = phone.replace(/[^0-9+]/g, '')
    if (!clean) return showStatus('Enter a WhatsApp phone number', 'error')
    const link = (clean.startsWith('+') ? `https://wa.me/${clean.slice(1)}` : `https://wa.me/${clean}`)
    setWaLink(link)
    showStatus('✓ Chat link created! Open it to view the status.', 'success')
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }, [phone])

  const downloadFile = () => {
    if (!fileUrl) return
    const a = document.createElement('a')
    a.href = fileUrl
    a.download = fileName
    document.body.appendChild(a); a.click(); a.remove()
    showStatus('✓ Download started!', 'success')
  }

  const tabBtn = (val, label, active) =>
    `flex-1 py-3 rounded-xl text-sm font-bold transition-all border-2 ${
      active ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
      : 'bg-white/[0.04] border-white/8 text-slate-400 hover:border-white/12'}`
  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"

  return (
    <ToolLayout
      title="WhatsApp Status Saver"
      desc="Save WhatsApp status photos and videos. Download status media by its real WhatsApp link (mmg.whatsapp.net), or get a chat link by number. Includes Android, iPhone, and WhatsApp Web methods."
      icon="📱" iconBg="rgba(37,211,102,0.08)"
      category="whatsapp" slug="whatsapp-status-saver"
      faq={[
        { q: "How do I save a WhatsApp status by link?", a: "Open the status on WhatsApp Web, right-click the photo/video and copy the image/video address (it starts with mmg.whatsapp.net), paste it into the 'By Media Link' tab, and click Fetch to download it." },
        { q: "Can I save a WhatsApp status by number?", a: "Use the 'By Number' tab to generate a wa.me chat link. WhatsApp statuses are 24-hour media delivered to your device, so you open the chat/status and save from there — there's no direct by-number download." },
        { q: "How do I save WhatsApp status on Android?", a: "Open WhatsApp and view the status, then open File Manager → enable 'Show hidden files' → WhatsApp/Media/.Statuses → copy the files to your gallery." },
        { q: "Can I save WhatsApp status on iPhone?", a: "View the status in WhatsApp, then take a screenshot (photos) or screen recording (videos). iOS doesn't allow direct file access to the status folder." },
        { q: "Is it legal to save someone's WhatsApp status?", a: "Saving status for personal viewing is generally acceptable, but sharing or reposting without permission may violate privacy and copyright." },
      ]}
      howItWorks={[
        "Pick a lane: save by status media link, by phone number, or from your device.",
        "By link: paste the mmg.whatsapp.net URL and click Fetch to download.",
        "By number: get a WhatsApp chat link and view the status from there.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        name: "WhatsApp Status Saver", applicationCategory: "UtilitiesApplication",
        url: "https://www.uptools.in/whatsapp-status-saver/",
        offers: { "@type": "Offer", price: "0", priceCurrency: "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
          <p className="text-sm text-amber-300 font-semibold">
            ⚠️ <b>Privacy Notice:</b> Always respect others' privacy. Saving and sharing someone's status without permission may violate their privacy rights.
          </p>
        </div>

        <div className="flex gap-2">
          <button className={tabBtn('link', '🔗 By Media Link', mode === 'link')} onClick={() => { setMode('link'); setFileUrl(''); setWaLink('') }}>🔗 By Media Link</button>
          <button className={tabBtn('number', '📞 By Number', mode === 'number')} onClick={() => { setMode('number'); setFileUrl(''); setWaLink('') }}>📞 By Number</button>
          <button className={tabBtn('guide', '📱 Device Guide', mode === 'guide')} onClick={() => { setMode('guide'); setFileUrl(''); setWaLink('') }}>📱 Device Guide</button>
        </div>

        {mode === 'link' && (
          <>
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-2">WhatsApp Status Media URL</label>
              <input type="text" value={mediaUrl} onChange={e => setMediaUrl(e.target.value)}
                placeholder="https://mmg.whatsapp.net/v/t61.24694-24/..." className={inputClass} />
              <p className="text-xs text-slate-500 mt-1.5">Get it from WhatsApp Web: open the status → right-click → copy image/video address (starts with mmg.whatsapp.net).</p>
            </div>
            <button onClick={fetchMedia} disabled={loading}
              className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-400 transition-all active:scale-[0.98] disabled:opacity-50">
              {loading ? '⏳ Fetching...' : '📥 Fetch Status Media'}
            </button>
          </>
        )}

        {mode === 'number' && (
          <>
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-2">WhatsApp Phone Number</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="+91 98765 43210" className={inputClass} />
              <p className="text-xs text-slate-500 mt-1.5">Statuses are 24-hour media delivered to your device — open the chat/status and save from there.</p>
            </div>
            <button onClick={makeWaLink}
              className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-400 transition-all active:scale-[0.98]">
              💬 Open WhatsApp Chat
            </button>
          </>
        )}

        {mode === 'guide' && (
          <div className="flex gap-2">
            {[['android', '📱 Android'], ['ios', '🍎 iPhone'], ['web', '💻 Web']].map(([tab, label]) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border-2 ${
                  activeTab === tab ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : 'bg-white/[0.04] border-white/8 text-slate-400 hover:border-white/12'}`}>
                {label}
              </button>
            ))}
          </div>
        )}

        {mode === 'guide' && (
          <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6">
            {activeTab === 'android' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white mb-2">Method 1: Using File Manager</h3>
                  <ol className="space-y-2 text-sm text-slate-400 list-decimal list-inside">
                    <li>Open WhatsApp and view the status you want to save</li>
                    <li>Open your phone's File Manager app</li>
                    <li>Tap the menu (⋮) and enable "Show hidden files"</li>
                    <li>Navigate to: <code className="bg-white/[0.06] px-1.5 py-0.5 rounded text-emerald-300 text-xs">Internal Storage &gt; WhatsApp &gt; Media &gt; .Statuses</code></li>
                    <li>Long-press and select "Copy" or "Move", then paste to Gallery/Downloads</li>
                  </ol>
                </div>
                <div className="border-t border-white/8 pt-4">
                  <h3 className="text-sm font-bold text-white mb-2">Method 2: Using Status Saver Apps</h3>
                  <ol className="space-y-2 text-sm text-slate-400 list-decimal list-inside">
                    <li>Download a status saver app from Google Play Store</li>
                    <li>Grant storage permissions, then select the status to save</li>
                  </ol>
                </div>
              </div>
            )}
            {activeTab === 'ios' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white mb-2">Method 1: Screenshot / Screen Recording</h3>
                  <ol className="space-y-2 text-sm text-slate-400 list-decimal list-inside">
                    <li>Open WhatsApp and view the status</li>
                    <li>Photos: screenshot (Volume Up + Power). Videos: screen recording (Control Center → Record)</li>
                    <li>The file is saved to your Photos app</li>
                  </ol>
                </div>
              </div>
            )}
            {activeTab === 'web' && (
              <ol className="space-y-2 text-sm text-slate-400 list-decimal list-inside">
                <li>Open WhatsApp Web on your computer</li>
                <li>Click the status icon to view statuses</li>
                <li>Photos: right-click → "Save image as". Videos: use the media link above or screen recording</li>
              </ol>
            )}
          </div>
        )}

        {status.msg && (
          <div className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-center ${
            status.type === 'success' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
            : status.type === 'error' ? 'bg-red-500/15 text-red-400 border border-red-500/30'
            : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'}`}>
            {status.msg}
          </div>
        )}

        {mode === 'number' && waLink && (
          <div ref={resultRef} className="rounded-3xl border-2 border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.06] via-white/[0.01] to-transparent p-6 text-center"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <p className="text-sm text-slate-400 mb-3">Open this chat to view the contact's status.</p>
            <a href={waLink} target="_blank" rel="noopener noreferrer"
              className="block text-sm font-mono text-emerald-300 bg-white/[0.06] rounded-xl p-3 break-all border border-emerald-500/20 hover:bg-emerald-500/10 transition-all">
              {waLink}
            </a>
            <div className="flex gap-2 mt-3">
              <button onClick={() => navigator.clipboard.writeText(waLink)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/8 text-sm font-bold text-slate-400 hover:text-white transition-all">📋 Copy</button>
              <a href={waLink} target="_blank" rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-bold text-center hover:bg-emerald-400 transition-all">↗ Open WhatsApp</a>
            </div>
          </div>
        )}

        {mode === 'link' && fileUrl && (
          <div ref={resultRef} className="rounded-3xl border-2 border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.06] via-white/[0.01] to-transparent p-6 text-center"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="text-4xl mb-3">{fileName.endsWith('.mp4') ? '🎬' : '🖼️'}</div>
            <p className="text-sm text-emerald-400 font-semibold mb-2">Status media ready!</p>
            <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
              {[['Format', fileName.split('.').pop().toUpperCase()], ['Status', '✓ Ready']].map(([k, v]) => (
                <div key={k} className="text-center p-2 rounded-xl bg-white/[0.06]">
                  <div className="text-[10px] text-slate-400 font-semibold">{k}</div>
                  <div className="text-xs text-white font-bold">{v}</div>
                </div>
              ))}
            </div>
            <button onClick={downloadFile}
              className="w-full py-3 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-400 transition-all">
              ⬇️ Download {fileName.split('.').pop().toUpperCase()}
            </button>
          </div>
        )}

        {mode === 'link' && !fileUrl && !loading && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📱</div>
            <p className="text-sm text-slate-600 font-medium">Paste a WhatsApp status media link to download it</p>
          </div>
        )}

        <div className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-5">
          <h3 className="text-sm font-bold text-slate-300 mb-3">💡 Tips for Saving WhatsApp Status</h3>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li>✅ <b className="text-slate-300">24-hour window:</b> Statuses disappear after 24 hours, so save them quickly</li>
            <li>✅ <b className="text-slate-300">Media link:</b> The fastest download is via the mmg.whatsapp.net link from WhatsApp Web</li>
            <li>✅ <b className="text-slate-300">Quality:</b> Original quality is preserved</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  )
}
