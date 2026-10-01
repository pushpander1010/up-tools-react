import { useState, useMemo, useRef, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'
import {
  ERROR_CORRECTION_LEVELS,
  SIZE_PRESETS,
  MARGIN_PRESETS,
  COLOR_PALETTES,
  calculateContrast,
  generateQrCanvas,
  generateQrSvgString,
  downloadBlob,
  downloadSvgString,
  copyCanvasToClipboard,
  copyTextToClipboard,
} from '../lib/qrHelper'

const QR_TYPES = [
  { value: 'url', label: 'URL / Link', icon: '🔗' },
  { value: 'text', label: 'Plain Text', icon: '📝' },
  { value: 'wifi', label: 'WiFi Network', icon: '📶' },
  { value: 'email', label: 'Email', icon: '✉️' },
  { value: 'phone', label: 'Phone Call', icon: '📞' },
  { value: 'sms', label: 'SMS Message', icon: '💬' },
  { value: 'vcard', label: 'Contact Card', icon: '👤' },
]

function escapeWifi(s) {
  const b = String.fromCharCode(92)
  return (s || '')
    .split(b).join(b + b)
    .split(';').join(b + ';')
    .split(',').join(b + ',')
    .split(':').join(b + ':')
    .split('"').join(b + '"')
}

function getContent(type, fields) {
  switch (type) {
    case 'url': {
      const u = (fields.content || '').trim()
      if (!u) return ''
      const low = u.toLowerCase()
      return (low.startsWith('http://') || low.startsWith('https://')) ? u : `https://${u}`
    }
    case 'wifi': {
      const sec = fields.wifiSec || 'WPA'
      const t = sec === 'none' ? '' : `T:${sec};`
      const hidden = fields.wifiHidden ? 'H:true;' : ''
      return `WIFI:${t}S:${escapeWifi(fields.wifiSsid)};${fields.wifiPass ? `P:${escapeWifi(fields.wifiPass)};` : ''}${hidden};`
    }
    case 'email': {
      const to = (fields.emailTo || '').trim()
      const params = []
      if (fields.emailSubject) params.push(`subject=${encodeURIComponent(fields.emailSubject)}`)
      if (fields.emailBody) params.push(`body=${encodeURIComponent(fields.emailBody)}`)
      return `mailto:${to}${params.length ? `?${params.join('&')}` : ''}`
    }
    case 'phone':
      return `tel:${(fields.content || '').trim()}`
    case 'sms': {
      const phone = (fields.content || '').trim()
      const body = (fields.smsBody || '').trim()
      return `sms:${phone}${body ? `?body=${encodeURIComponent(body)}` : ''}`
    }
    case 'vcard': {
      const lines = ['BEGIN:VCARD', 'VERSION:3.0']
      if (fields.vcardName) lines.push(`FN:${fields.vcardName}`)
      if (fields.content) lines.push(`TEL:${(fields.content || '').trim()}`)
      if (fields.vcardEmail) lines.push(`EMAIL:${(fields.vcardEmail || '').trim()}`)
      if (fields.vcardOrg) lines.push(`ORG:${(fields.vcardOrg || '').trim()}`)
      if (fields.vcardUrl) lines.push(`URL:${(fields.vcardUrl || '').trim()}`)
      lines.push('END:VCARD')
      return lines.join('\n')
    }
    default:
      return fields.content || ''
  }
}

export default function QrGenerator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)

  // Configuration state
  const [qrType, setQrType] = useState('url')
  const [fields, setFields] = useState({
    content: 'https://uptools.in',
    wifiSsid: '',
    wifiPass: '',
    wifiSec: 'WPA',
    wifiHidden: false,
    emailTo: '',
    emailSubject: '',
    emailBody: '',
    smsBody: '',
    vcardName: '',
    vcardEmail: '',
    vcardOrg: '',
    vcardUrl: '',
  })

  // Styling & Customization state
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [ecLevel, setEcLevel] = useState('M')
  const [margin, setMargin] = useState(4)
  const [exportSize, setExportSize] = useState(1024)
  const [logoDataUrl, setLogoDataUrl] = useState(null)
  const [logoName, setLogoName] = useState('')

  // UI status
  const [_generated, setGenerated] = useState(true)
  const [error, setError] = useState('')
  const [downloadingPng, setDownloadingPng] = useState(false)
  const [downloadingSvg, setDownloadingSvg] = useState(false)
  const [copiedStatus, setCopiedStatus] = useState('')

  // Contrast check
  const contrast = useMemo(() => calculateContrast(fgColor, bgColor), [fgColor, bgColor])

  // Content string to encode
  const qrText = useMemo(() => getContent(qrType, fields), [qrType, fields])

  const updateField = (key, val) => {
    setFields(prev => ({ ...prev, [key]: val }))
    setError('')
  }

  // Handle Logo Upload
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, SVG, WebP).')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Logo image must be smaller than 5MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = (evt) => {
      setLogoDataUrl(evt.target.result)
      setLogoName(file.name)
      // High error correction is recommended for logos
      setEcLevel('H')
      setError('')
    }
    reader.readAsDataURL(file)
  }

  const removeLogo = () => {
    setLogoDataUrl(null)
    setLogoName('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Render QR Code onto the canvas
  useEffect(() => {
    if (!qrText.trim()) return

    let isMounted = true
    generateQrCanvas({
      text: qrText,
      size: 600, // sharp display size
      errorCorrectionLevel: ecLevel,
      margin,
      fgColor,
      bgColor,
      logoDataUrl,
    }).then(offscreen => {
      if (!isMounted || !canvasRef.current) return
      const canvas = canvasRef.current
      canvas.width = offscreen.width
      canvas.height = offscreen.height
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(offscreen, 0, 0)
    }).catch(err => {
      console.error('QR preview rendering failed:', err)
    })

    return () => { isMounted = false }
  }, [qrText, ecLevel, margin, fgColor, bgColor, logoDataUrl])

  const validate = () => {
    if (qrType === 'wifi' && !fields.wifiSsid.trim()) {
      return 'Please enter your WiFi network name (SSID).'
    }
    if (qrType === 'email' && !fields.emailTo.trim()) {
      return 'Please enter a recipient email address.'
    }
    if (qrType === 'vcard' && !fields.vcardName.trim() && !fields.content.trim()) {
      return 'Please enter at least a contact name or phone number.'
    }
    if ((qrType === 'text' || qrType === 'url' || qrType === 'phone' || qrType === 'sms') && !fields.content.trim()) {
      return 'Please enter content or a URL to generate your QR code.'
    }
    return ''
  }

  const handleGenerate = () => {
    const err = validate()
    if (err) {
      setError(err)
      return
    }
    setError('')
    setGenerated(true)
    jumpTo()
  }

  // Download high-resolution PNG
  const handleDownloadPng = async () => {
    const err = validate()
    if (err) { setError(err); return }
    if (!qrText) return

    setDownloadingPng(true)
    try {
      const fullCanvas = await generateQrCanvas({
        text: qrText,
        size: exportSize,
        errorCorrectionLevel: ecLevel,
        margin,
        fgColor,
        bgColor,
        logoDataUrl,
      })
      fullCanvas.toBlob((blob) => {
        if (blob) {
          const filename = `qrcode-${exportSize}x${exportSize}.png`
          downloadBlob(blob, filename)
        }
        setDownloadingPng(false)
      }, 'image/png')
    } catch (e) {
      console.error(e)
      setError('Failed to generate PNG download.')
      setDownloadingPng(false)
    }
  }

  // Download scalable SVG
  const handleDownloadSvg = async () => {
    const err = validate()
    if (err) { setError(err); return }
    if (!qrText) return

    setDownloadingSvg(true)
    try {
      const svgString = await generateQrSvgString({
        text: qrText,
        errorCorrectionLevel: ecLevel,
        margin,
        fgColor,
        bgColor,
        logoDataUrl,
      })
      downloadSvgString(svgString, 'qrcode.svg')
    } catch (e) {
      console.error(e)
      setError('Failed to generate SVG download.')
    } finally {
      setDownloadingSvg(false)
    }
  }

  // Copy PNG image to clipboard
  const handleCopyImage = async () => {
    if (!canvasRef.current) return
    const res = await copyCanvasToClipboard(canvasRef.current)
    if (res.success) {
      setCopiedStatus(res.mode === 'image' ? 'Image copied to clipboard!' : 'Data URL copied!')
      setTimeout(() => setCopiedStatus(''), 2500)
    } else {
      setError('Could not copy image to clipboard. Try downloading instead.')
    }
  }

  // Copy raw payload text
  const handleCopyText = async () => {
    if (!qrText) return
    const ok = await copyTextToClipboard(qrText)
    if (ok) {
      setCopiedStatus('Content text copied!')
      setTimeout(() => setCopiedStatus(''), 2500)
    }
  }

  const showWifi = qrType === 'wifi'
  const showEmail = qrType === 'email'
  const showVcard = qrType === 'vcard'
  const showSms = qrType === 'sms'
  const showMainContent = !showWifi && !showEmail && !showVcard

  const faq = [
    { q: "What can I make a QR code for?", a: "URLs, WiFi credentials, plain text, email addresses, phone numbers, SMS, and vCards. Pick the type, enter the details, and generate." },
    { q: "How do I make a WiFi QR code?", a: "Choose the WiFi type, enter your network name (SSID) and password, then click Generate. Your phone can scan the code to join the WiFi instantly without typing the password." },
    { q: "Can I make a QR code for a URL or link?", a: "Yes. Choose the URL type, paste your link, and generate. Anyone can scan it to open the link — perfect for business cards, posters, menus, or sharing a link in print." },
    { q: "Is the QR code generator free?", a: "Yes, it is completely free with no signup and no watermarks. Generate as many QR codes as you need and download them as PNG or SVG." },
    { q: "How do I scan a QR code?", a: "Open your phone camera and point it at the QR code. Most phones detect QR codes automatically." },
    { q: "Do my QR codes expire?", a: "No. These QR codes encode your content directly (link, text, WiFi details) — there is no tracking server or expiry date. They work forever, even offline." },
    { q: "What file formats can I download?", a: "You can download your QR code as a high-quality PNG or SVG, so it prints cleanly at any size." },
]

  return (
    <ToolLayout
      title="QR Code Generator – Make Free QR Codes Online"
      desc="Free QR code generator: make QR codes for URLs, WiFi, text, email, phone, SMS, and vCard. Download as PNG or SVG — no signup, no watermark."
      icon="📱"
      iconBg="rgba(99,102,241,0.08)"
      category="tools"
      slug="qr-generator"
      faq={faq}
      howItWorks={[
        "Choose the QR code type (Text, URL, WiFi, etc.).",
        "Enter the content and set the size.",
        "Click Generate to create your QR code.",
        "Download as PNG or SVG.",
      ]}
      schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "QR Code Generator",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Any (Web Browser)",
        "url": "https://www.uptools.in/qr-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      }}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Type Selector Chips */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 sm:p-5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Choose QR Content Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {QR_TYPES.map((t) => {
              const selected = qrType === t.value
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => {
                    setQrType(t.value)
                    setError('')
                  }}
                  className={`min-h-[44px] px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-95 ${
                    selected
                      ? 'bg-indigo-600 text-white shadow-md border border-indigo-500'
                      : 'bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  {selected && <span className="text-xs">✓</span>}
                  <span>{t.icon}</span>
                  <span className="truncate">{t.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Two-column layout on desktop: Left Config, Right Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Form: Inputs & Customization */}
          <div className="lg:col-span-7 space-y-6">
            {/* Content Input Card */}
            <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 sm:p-6 space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>📝</span> Content Details
              </h2>

              {showMainContent && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {qrType === 'url' ? 'Website URL' : qrType === 'phone' ? 'Phone Number' : 'Text Content'}
                  </label>
                  {qrType === 'url' ? (
                    <input
                      type="url"
                      value={fields.content}
                      onChange={(e) => updateField('content', e.target.value)}
                      placeholder="https://example.com"
                      className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-500 min-h-[44px]"
                    />
                  ) : qrType === 'phone' ? (
                    <input
                      type="tel"
                      value={fields.content}
                      onChange={(e) => updateField('content', e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-500 min-h-[44px]"
                    />
                  ) : (
                    <textarea
                      value={fields.content}
                      onChange={(e) => updateField('content', e.target.value)}
                      placeholder="Type or paste any text..."
                      rows={4}
                      className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-500 resize-none"
                    />
                  )}
                </div>
              )}

              {showSms && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      value={fields.content}
                      onChange={(e) => updateField('content', e.target.value)}
                      placeholder="+1 234 567 8900"
                      className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-500 min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Pre-filled Message (optional)</label>
                    <textarea
                      value={fields.smsBody}
                      onChange={(e) => updateField('smsBody', e.target.value)}
                      placeholder="Hello, I would like to inquire about..."
                      rows={2}
                      className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-500 resize-none"
                    />
                  </div>
                </div>
              )}

              {showWifi && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Network Name (SSID)</label>
                      <input
                        type="text"
                        value={fields.wifiSsid}
                        onChange={(e) => updateField('wifiSsid', e.target.value)}
                        placeholder="MyHomeWiFi"
                        className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-500 min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Security Mode</label>
                      <select
                        value={fields.wifiSec}
                        onChange={(e) => updateField('wifiSec', e.target.value)}
                        className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/50 transition-all min-h-[44px]"
                      >
                        <option value="WPA">WPA / WPA2 / WPA3</option>
                        <option value="WEP">WEP (Legacy)</option>
                        <option value="none">Open (No Password)</option>
                      </select>
                    </div>
                  </div>

                  {fields.wifiSec !== 'none' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Network Password</label>
                      <input
                        type="text"
                        value={fields.wifiPass}
                        onChange={(e) => updateField('wifiPass', e.target.value)}
                        placeholder="WiFi password"
                        className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-500 min-h-[44px]"
                      />
                    </div>
                  )}

                  <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={fields.wifiHidden}
                      onChange={(e) => updateField('wifiHidden', e.target.checked)}
                      className="rounded bg-white/10 border-white/20 text-indigo-600 focus:ring-0 w-4 h-4"
                    />
                    <span>Hidden network (SSID not broadcast)</span>
                  </label>
                </div>
              )}

              {showEmail && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Recipient Email</label>
                    <input
                      type="email"
                      value={fields.emailTo}
                      onChange={(e) => updateField('emailTo', e.target.value)}
                      placeholder="support@example.com"
                      className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-500 min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subject Line</label>
                    <input
                      type="text"
                      value={fields.emailSubject}
                      onChange={(e) => updateField('emailSubject', e.target.value)}
                      placeholder="Feedback / Inquiry"
                      className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-500 min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Message Body</label>
                    <textarea
                      value={fields.emailBody}
                      onChange={(e) => updateField('emailBody', e.target.value)}
                      placeholder="Your pre-filled email body..."
                      rows={2}
                      className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-500 resize-none"
                    />
                  </div>
                </div>
              )}

              {showVcard && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                      <input
                        type="text"
                        value={fields.vcardName}
                        onChange={(e) => updateField('vcardName', e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-500 min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phone Number</label>
                      <input
                        type="tel"
                        value={fields.content}
                        onChange={(e) => updateField('content', e.target.value)}
                        placeholder="+1 555 123 4567"
                        className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-500 min-h-[44px]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                      <input
                        type="email"
                        value={fields.vcardEmail}
                        onChange={(e) => updateField('vcardEmail', e.target.value)}
                        placeholder="john@company.com"
                        className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-500 min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Company / Org</label>
                      <input
                        type="text"
                        value={fields.vcardOrg}
                        onChange={(e) => updateField('vcardOrg', e.target.value)}
                        placeholder="Acme Corporation"
                        className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-500 min-h-[44px]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Website URL</label>
                    <input
                      type="url"
                      value={fields.vcardUrl}
                      onChange={(e) => updateField('vcardUrl', e.target.value)}
                      placeholder="https://company.com"
                      className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-500 min-h-[44px]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Styling & Customization Card */}
            <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 sm:p-6 space-y-6">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>🎨</span> Styling &amp; Colors
              </h2>

              {/* Color Presets */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">Preset Color Palettes</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {COLOR_PALETTES.map((pal) => {
                    const active = fgColor === pal.fg && bgColor === pal.bg
                    return (
                      <button
                        key={pal.name}
                        type="button"
                        onClick={() => {
                          setFgColor(pal.fg)
                          setBgColor(pal.bg)
                        }}
                        className={`min-h-[44px] px-2.5 py-2 rounded-xl text-xs flex items-center gap-2 transition-all duration-150 ${
                          active
                            ? 'bg-indigo-600/30 border-2 border-indigo-500 text-white'
                            : 'bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:border-white/20'
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full border border-white/20 shrink-0 flex items-center justify-center text-[10px] shadow" style={{ backgroundColor: pal.bg }}>
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pal.fg }} />
                        </span>
                        <span className="truncate font-medium">{pal.name}</span>
                        {active && <span className="ml-auto text-xs text-indigo-400">✓</span>}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Custom Color Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Foreground (Dots)</label>
                  <div className="flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.1] rounded-xl p-2 min-h-[44px]">
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="bg-transparent text-white font-mono text-xs outline-none uppercase w-20"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Background</label>
                  <div className="flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.1] rounded-xl p-2 min-h-[44px]">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="bg-transparent text-white font-mono text-xs outline-none uppercase w-20"
                    />
                  </div>
                </div>
              </div>

              {/* Contrast Warning Banner */}
              {contrast.rating === 'critical' ? (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2.5">
                  <span className="text-base shrink-0">⚠️</span>
                  <div>
                    <strong className="block font-bold">Very Low Contrast ({contrast.ratio}:1)</strong>
                    <span>{contrast.message} Darken your foreground or brighten the background to ensure scannability.</span>
                  </div>
                </div>
              ) : contrast.rating === 'warning' ? (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-2.5">
                  <span className="text-base shrink-0">⚠️</span>
                  <div>
                    <strong className="block font-bold">Notice: Borderline Contrast ({contrast.ratio}:1)</strong>
                    <span>{contrast.message}</span>
                  </div>
                </div>
              ) : contrast.isInverted ? (
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex items-center gap-2">
                  <span>ℹ️</span>
                  <span>Inverted colors (light on dark). Works on modern smartphones.</span>
                </div>
              ) : null}

              {/* Error Correction & Quiet Zone */}
              <div className="space-y-4 pt-2 border-t border-white/[0.06]">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-300">
                      Error Correction Level
                    </label>
                    {logoDataUrl && (
                      <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                        Logo attached: High (H) active
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {ERROR_CORRECTION_LEVELS.map((lvl) => {
                      const selected = ecLevel === lvl.value
                      return (
                        <button
                          key={lvl.value}
                          type="button"
                          onClick={() => setEcLevel(lvl.value)}
                          className={`min-h-[44px] px-3 py-2 rounded-xl text-left transition-all duration-150 ${
                            selected
                              ? 'bg-indigo-600 text-white shadow-sm border border-indigo-500'
                              : 'bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.08]'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span>{lvl.label}</span>
                            {selected && <span>✓</span>}
                          </div>
                          <div className="text-[10px] opacity-75">{lvl.recovery} repair</div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Quiet Zone Margin
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {MARGIN_PRESETS.map((m) => {
                      const selected = margin === m.value
                      return (
                        <button
                          key={m.value}
                          type="button"
                          onClick={() => setMargin(m.value)}
                          className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-150 ${
                            selected
                              ? 'bg-indigo-600 text-white shadow-sm border border-indigo-500'
                              : 'bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.08]'
                          }`}
                        >
                          {selected && <span>✓</span>}
                          <span>{m.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Logo Overlay Upload */}
              <div className="pt-2 border-t border-white/[0.06] space-y-2.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Center Logo Image Overlay (Auto-scaled ~20%)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="qr-logo-upload"
                  />
                  <label
                    htmlFor="qr-logo-upload"
                    className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-slate-300 hover:text-white hover:border-white/20 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all duration-150"
                  >
                    <span>🖼️</span>
                    <span>{logoDataUrl ? 'Change Logo' : 'Upload Logo Image'}</span>
                  </label>

                  {logoDataUrl && (
                    <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 rounded-xl">
                      <img src={logoDataUrl} alt="Logo preview" className="w-7 h-7 rounded object-contain bg-white/10 p-0.5" />
                      <span className="text-xs text-slate-300 truncate max-w-[140px]">{logoName || 'Logo uploaded'}</span>
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="text-xs text-red-400 hover:text-red-300 p-1 min-h-[32px]"
                        title="Remove logo"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  Logos are centered and rendered with high error correction so scanners read effortlessly.
                </p>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-sm text-red-300 flex items-center gap-3">
                <span className="text-lg">❌</span>
                <span>{error}</span>
              </div>
            )}

            {/* Generate Action Button */}
            <button
              type="button"
              onClick={handleGenerate}
              className="glow-btn w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 min-h-[48px]"
            >
              <span>✨</span>
              <span>Generate &amp; Preview QR Code</span>
            </button>
          </div>

          {/* Right Column: Live Result & Downloads */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-6" ref={resultRef}>
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.06] p-6 sm:p-7 text-center space-y-5 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Preview</span>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Ready to scan
                </span>
              </div>

              {/* Canvas Preview Container */}
              <div className="flex justify-center py-2">
                <div
                  className="p-4 rounded-2xl shadow-xl border border-white/10 transition-transform duration-200 hover:scale-[1.02]"
                  style={{ backgroundColor: bgColor }}
                >
                  <canvas
                    ref={canvasRef}
                    className="block rounded-lg max-w-[260px] sm:max-w-[280px] w-full h-auto aspect-square"
                  />
                </div>
              </div>

              {/* Details Pill */}
              <div className="text-xs font-mono text-slate-400 bg-white/[0.03] border border-white/[0.06] rounded-xl py-2 px-3 flex items-center justify-center gap-3 flex-wrap">
                <span>EC: Level {ecLevel}</span>
                <span>•</span>
                <span>Margin: {margin}</span>
                <span>•</span>
                <span>Contrast: {contrast.ratio}:1</span>
              </div>

              {/* Size Preset Selector for Export */}
              <div className="text-left space-y-1.5 pt-2 border-t border-white/[0.06]">
                <label className="block text-xs font-semibold text-slate-400">
                  Download Resolution Preset
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {SIZE_PRESETS.map((p) => {
                    const selected = exportSize === p.size
                    return (
                      <button
                        key={p.size}
                        type="button"
                        onClick={() => setExportSize(p.size)}
                        className={`min-h-[44px] px-2 py-2 rounded-xl text-center transition-all duration-150 ${
                          selected
                            ? 'bg-indigo-600 text-white shadow-sm border border-indigo-500'
                            : 'bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.08]'
                        }`}
                      >
                        <div className="text-xs font-bold flex items-center justify-center gap-1">
                          {selected && <span className="text-[10px]">✓</span>}
                          <span>{p.label}</span>
                        </div>
                        <div className="text-[9px] opacity-75 truncate">{p.tag}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Actions: Download PNG, Download SVG */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadPng}
                  disabled={downloadingPng}
                  className="min-h-[44px] py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                >
                  <span>{downloadingPng ? '⏳' : '⬇️'}</span>
                  <span>Download PNG</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadSvg}
                  disabled={downloadingSvg}
                  className="min-h-[44px] py-3 px-4 rounded-xl bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.1] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <span>{downloadingSvg ? '⏳' : '📐'}</span>
                  <span>Download SVG</span>
                </button>
              </div>

              {/* Clipboard Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCopyImage}
                  className="min-h-[44px] py-2.5 px-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.08] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>📋</span>
                  <span>Copy QR Image</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="min-h-[44px] py-2.5 px-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.08] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>📄</span>
                  <span>Copy Payload Text</span>
                </button>
              </div>

              {/* Toast Confirmation */}
              {copiedStatus && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400 flex items-center justify-center gap-2 animate-slide-up">
                  <span>✓</span>
                  <span>{copiedStatus}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SEO / Editorial Content Section */}
        <div className="pt-6">
          <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                Professional Online QR Code Generator – 100% Free &amp; Private
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Generate high-resolution, vector-crisp QR codes right in your browser. Whether you need a quick WiFi access card for your guests, a high-contrast website link for physical product packaging, or a contact vCard for business cards, this generator delivers enterprise-level control with custom color palettes, automatic contrast ratio validation, logo image overlays, and multiple error-correction modes.
              </p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-2">How to create a high-quality QR code</h3>
              <ol className="list-decimal list-inside text-sm text-slate-400 space-y-1.5 leading-relaxed">
                <li>Pick the data format (URL, WiFi, Email, Phone, SMS, Plain Text, or vCard).</li>
                <li>Enter the details — URLs are automatically formatted with secure protocols.</li>
                <li>Fine-tune your brand colors and check the real-time WCAG contrast diagnostic.</li>
                <li>Optionally upload your company or personal logo with automatic high-redundancy protection.</li>
                <li>Choose between high-resolution PNG (up to 2048px 4K) or infinite-scale vector SVG.</li>
              </ol>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-2">Why error correction &amp; contrast matter</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                QR codes use Reed-Solomon error correction to reconstruct damaged or obscured data. When adding a center logo, level <strong className="text-slate-200">High (H)</strong> provides up to 30% data recovery, ensuring modern smartphones can reliably decode your code even in harsh lighting or at an angle. Furthermore, maintaining a contrast ratio of at least 4:1 guarantees optical sensors can distinguish individual modules cleanly.
              </p>
            </div>
            <p className="text-xs text-slate-600 pt-1">
              Need related tools? Check out our{' '}
              <a className="text-indigo-400 hover:text-indigo-300" href="/qr-reader/">QR Code Scanner</a>,{' '}
              <a className="text-indigo-400 hover:text-indigo-300" href="/upi-qr-generator/">UPI QR Generator</a>,{' '}
              and <a className="text-indigo-400 hover:text-indigo-300" href="/barcode-generator/">Barcode Generator</a>.
            </p>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
