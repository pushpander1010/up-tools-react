import { useState, useMemo, useRef, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const QR_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'url', label: 'URL' },
  { value: 'wifi', label: 'WiFi' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'sms', label: 'SMS' },
  { value: 'vcard', label: 'vCard' },
]

function getContent(type, fields) {
  switch (type) {
    case 'url': return fields.content
    case 'wifi': return `WIFI:T:WPA;S:${fields.wifiSsid};P:${fields.wifiPass};;`
    case 'email': return `mailto:${fields.emailTo}?subject=${encodeURIComponent(fields.emailSubject)}`
    case 'phone': return `tel:${fields.content}`
    case 'sms': return `sms:${fields.content}`
    case 'vcard': return `BEGIN:VCARD\nVERSION:3.0\nFN:${fields.vcardName}\nTEL:${fields.content}\nEND:VCARD`
    default: return fields.content
  }
}

function getQrUrl(text, size) {
  if (!text) return null
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&margin=10`
}

export default function qr_code_generator_pro() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [qrType, setQrType] = useState('text')
  const [size, setSize] = useState(300)
  const [fields, setFields] = useState({
    content: '',
    wifiSsid: '',
    wifiPass: '',
    emailTo: '',
    emailSubject: '',
    vcardName: '',
  })
  const [generated, setGenerated] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const qrText = useMemo(() => {
    if (!generated) return ''
    return getContent(qrType, fields)
  }, [qrType, fields, generated])

  const qrUrl = useMemo(() => getQrUrl(qrText, size), [qrText, size])

  const generate = () => {
    setGenerated(true)
    jumpTo()
  }

  const updateField = (key, val) => setFields(prev => ({ ...prev, [key]: val }))

  const downloadPng = async () => {
    if (!qrUrl) return
    setDownloading(true)
    try {
      const res = await fetch(qrUrl)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = 'qrcode.png'; a.click()
      URL.revokeObjectURL(url)
    } catch (e) { console.error(e) }
    setDownloading(false)
  }

  const downloadSvg = async () => {
    if (!qrText) return
    try {
      const res = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(qrText)}&margin=10&format=svg`)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = 'qrcode.svg'; a.click()
      URL.revokeObjectURL(url)
    } catch (e) { console.error(e) }
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"
  const selectClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 [color-scheme:dark]"

  const showWifi = qrType === 'wifi'
  const showEmail = qrType === 'email'
  const showVcard = qrType === 'vcard'
  const showMainContent = !showWifi && !showEmail

  return (
    <ToolLayout
      title="QR Code Generator"
      desc="Generate QR codes for text, URLs, WiFi, email, phone, and vCard. Download as PNG or SVG."
      icon="📱" iconBg="rgba(99,102,241,0.08)"
      category="tools" slug="qr-code-generator-pro"
      faq={[
        { q: "What can I encode?", a: "Text, URLs, WiFi credentials, email addresses, phone numbers, SMS, and vCards." },
        { q: "How do I scan a QR code?", a: "Open your phone camera and point it at the QR code. Most phones detect QR codes automatically." },
      ]}
      howItWorks={[
        "Choose the QR code type (Text, URL, WiFi, etc.).",
        "Enter the content and set the size.",
        "Click Generate to create your QR code.",
        "Download as PNG or SVG.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "QR Code Generator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/qr-code-generator-pro/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Type</label>
            <select value={qrType} onChange={e => { setQrType(e.target.value); setGenerated(false) }}
              className={selectClass}>
              {QR_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Size (px)</label>
            <input type="number" value={size} min={100} max={1000} step={50}
              onChange={e => setSize(parseInt(e.target.value) || 300)}
              className={inputClass} />
          </div>
        </div>

        {showMainContent && (
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Content</label>
            <textarea value={fields.content} onChange={e => updateField('content', e.target.value)}
              placeholder={qrType === 'url' ? 'https://example.com' : 'Enter text...'}
              rows={3}
              className={inputClass + ' resize-none'} />
          </div>
        )}

        {showWifi && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">SSID</label>
              <input type="text" value={fields.wifiSsid} onChange={e => updateField('wifiSsid', e.target.value)}
                placeholder="Network name" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
              <input type="text" value={fields.wifiPass} onChange={e => updateField('wifiPass', e.target.value)}
                placeholder="Password" className={inputClass} />
            </div>
          </div>
        )}

        {showEmail && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">To</label>
              <input type="email" value={fields.emailTo} onChange={e => updateField('emailTo', e.target.value)}
                placeholder="email@example.com" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Subject</label>
              <input type="text" value={fields.emailSubject} onChange={e => updateField('emailSubject', e.target.value)}
                placeholder="Subject" className={inputClass} />
            </div>
          </div>
        )}

        {showVcard && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Name</label>
              <input type="text" value={fields.vcardName} onChange={e => updateField('vcardName', e.target.value)}
                placeholder="John Doe" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Phone</label>
              <input type="tel" value={fields.content} onChange={e => updateField('content', e.target.value)}
                placeholder="+1 234 567 890" className={inputClass} />
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={generate}
            className="flex-1 py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
            ✨ Generate QR Code
          </button>
        </div>

        {generated && qrUrl && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden text-center"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <h3 className="text-sm font-bold text-indigo-400 mb-4">QR Code</h3>
            <img src={qrUrl} alt="Generated QR Code" className="block mx-auto rounded-xl shadow-2xl mb-4"
              style={{ width: Math.min(size, 300), height: Math.min(size, 300) }} />
            <div className="flex gap-3 justify-center">
              <button onClick={downloadPng} disabled={downloading}
                className="px-6 py-2.5 rounded-xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all">
                {downloading ? '⏳' : '⬇️'} PNG
              </button>
              <button onClick={downloadSvg}
                className="px-6 py-2.5 rounded-xl bg-white/[0.06] border border-white/8 text-slate-400 font-bold text-sm hover:text-white transition-all">
                ⬇️ SVG
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
