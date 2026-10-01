import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'
import {
  ERROR_CORRECTION_LEVELS,
  SIZE_PRESETS,
  MARGIN_PRESETS,
  calculateContrast,
  generateQrCanvas,
  generateQrSvgString,
  downloadBlob,
  downloadSvgString,
  copyCanvasToClipboard,
  copyTextToClipboard,
} from '../lib/qrHelper'

const VPA_REGEX = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/

const BANK_HANDLES = [
  '@okaxis',
  '@okhdfcbank',
  '@oksbi',
  '@okicici',
  '@paytm',
  '@ybl',
  '@ibl',
  '@axl',
]

const AMOUNT_PRESETS = [50, 100, 200, 500, 1000, 2000]

const UPI_PALETTES = [
  { name: 'UPI Teal', fg: '#0d9488', bg: '#ffffff' },
  { name: 'Emerald Pay', fg: '#047857', bg: '#ffffff' },
  { name: 'BHIM Navy', fg: '#0f172a', bg: '#ffffff' },
  { name: 'PhonePe Violet', fg: '#581c87', bg: '#ffffff' },
  { name: 'GPay Blue', fg: '#1d4ed8', bg: '#ffffff' },
  { name: 'Classic Black', fg: '#000000', bg: '#ffffff' },
  { name: 'Dark Mode Slate', fg: '#f8fafc', bg: '#0f172a' },
]

export default function UpiQrGenerator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)

  // UPI Input Fields
  const [upiId, setUpiId] = useState('merchant@icici')
  const [payeeName, setPayeeName] = useState('UpTools Store')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  // QR Customization
  const [fgColor, setFgColor] = useState('#0d9488')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [ecLevel, setEcLevel] = useState('Q')
  const [margin, setMargin] = useState(4)
  const [exportSize, setExportSize] = useState(1024)
  const [logoDataUrl, setLogoDataUrl] = useState(null)
  const [logoName, setLogoName] = useState('')

  // UI status
  const [generated, setGenerated] = useState(true)
  const [error, setError] = useState('')
  const [copiedStatus, setCopiedStatus] = useState('')
  const [downloadingPng, setDownloadingPng] = useState(false)
  const [downloadingSvg, setDownloadingSvg] = useState(false)

  // Read URL query parameters on initial mount
  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    if (q.has('pa')) setUpiId(q.get('pa'))
    if (q.has('pn')) setPayeeName(q.get('pn'))
    if (q.has('am')) setAmount(q.get('am'))
    if (q.has('tn')) setNote(q.get('tn'))
  }, [])

  // VPA Validation
  const trimmedUpi = upiId.trim()
  const isVpaValid = useMemo(() => VPA_REGEX.test(trimmedUpi), [trimmedUpi])

  // Contrast diagnostic
  const contrast = useMemo(() => calculateContrast(fgColor, bgColor), [fgColor, bgColor])

  // Build standard NPCI UPI Intent URI
  const upiIntentString = useMemo(() => {
    if (!trimmedUpi) return ''
    const params = new URLSearchParams()
    params.set('pa', trimmedUpi)
    params.set('cu', 'INR')

    if (payeeName.trim()) params.set('pn', payeeName.trim())
    if (note.trim()) params.set('tn', note.trim())

    const parsedAm = parseFloat(amount)
    if (!isNaN(parsedAm) && parsedAm > 0) {
      params.set('am', parsedAm.toFixed(2))
    }

    return `upi://pay?${params.toString()}`
  }, [trimmedUpi, payeeName, amount, note])

  // Bank handle suffix click
  const handleBankSuffix = (suffix) => {
    const current = trimmedUpi
    if (current.includes('@')) {
      const username = current.split('@')[0]
      setUpiId(`${username}${suffix}`)
    } else {
      setUpiId(`${current}${suffix}`)
    }
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
      setEcLevel('H') // Auto-switch to High recovery
      setError('')
    }
    reader.readAsDataURL(file)
  }

  const removeLogo = () => {
    setLogoDataUrl(null)
    setLogoName('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Render QR Canvas preview
  useEffect(() => {
    if (!upiIntentString || !isVpaValid) return

    let isMounted = true
    generateQrCanvas({
      text: upiIntentString,
      size: 600,
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
      console.error('Failed to render UPI QR canvas:', err)
    })

    return () => { isMounted = false }
  }, [upiIntentString, isVpaValid, ecLevel, margin, fgColor, bgColor, logoDataUrl])

  const handleGenerate = () => {
    if (!trimmedUpi) {
      setError('Please enter a UPI Virtual Payment Address (e.g., name@okhdfcbank).')
      return
    }
    if (!isVpaValid) {
      setError('Invalid UPI ID format. UPI IDs must follow username@bank (e.g., name@okaxis, 9876543210@paytm).')
      return
    }

    setError('')
    setGenerated(true)
    jumpTo()
  }

  const handleDownloadPng = async () => {
    if (!isVpaValid || !upiIntentString) {
      setError('Please provide a valid UPI ID before downloading.')
      return
    }

    setDownloadingPng(true)
    try {
      const fullCanvas = await generateQrCanvas({
        text: upiIntentString,
        size: exportSize,
        errorCorrectionLevel: ecLevel,
        margin,
        fgColor,
        bgColor,
        logoDataUrl,
      })
      fullCanvas.toBlob((blob) => {
        if (blob) {
          const safeName = trimmedUpi.replace(/[^a-zA-Z0-9]/g, '_')
          downloadBlob(blob, `upi-qr-${safeName}-${exportSize}px.png`)
        }
        setDownloadingPng(false)
      }, 'image/png')
    } catch {
      setError('Failed to generate PNG download.')
      setDownloadingPng(false)
    }
  }

  const handleDownloadSvg = async () => {
    if (!isVpaValid || !upiIntentString) {
      setError('Please provide a valid UPI ID before downloading.')
      return
    }

    setDownloadingSvg(true)
    try {
      const svgString = await generateQrSvgString({
        text: upiIntentString,
        errorCorrectionLevel: ecLevel,
        margin,
        fgColor,
        bgColor,
        logoDataUrl,
      })
      const safeName = trimmedUpi.replace(/[^a-zA-Z0-9]/g, '_')
      downloadSvgString(svgString, `upi-qr-${safeName}.svg`)
    } catch {
      setError('Failed to generate SVG download.')
    } finally {
      setDownloadingSvg(false)
    }
  }

  const handleCopyImage = async () => {
    if (!canvasRef.current) return
    const res = await copyCanvasToClipboard(canvasRef.current)
    if (res.success) {
      setCopiedStatus(res.mode === 'image' ? 'QR Image copied to clipboard!' : 'QR Data URL copied!')
      setTimeout(() => setCopiedStatus(''), 2500)
    } else {
      setError('Clipboard image copy not supported in this browser. Please download PNG.')
    }
  }

  const handleCopyText = async (text, label) => {
    const ok = await copyTextToClipboard(text)
    if (ok) {
      setCopiedStatus(`✓ ${label} copied!`)
      setTimeout(() => setCopiedStatus(''), 2500)
    }
  }

  const reset = useCallback(() => {
    setUpiId('')
    setPayeeName('')
    setAmount('')
    setNote('')
    setGenerated(false)
    setError('')
    window.history.replaceState(null, '', window.location.pathname)
  }, [])

  return (
    <ToolLayout
      title="Free UPI QR Code Generator – GPay, PhonePe, Paytm"
      desc="Free UPI QR code generator for India: make a scan-and-pay QR from your UPI ID with optional amount and note. Works with GPay, PhonePe, Paytm, BHIM. No signup."
      icon="📱"
      iconBg="rgba(34,197,94,0.08)"
      category="finance"
      slug="upi-qr-generator"
      faq={[
        { q: 'What is a UPI QR code?', a: 'A scannable code containing your UPI ID and optional amount and note. When a customer scans it with GPay, PhonePe, Paytm, or BHIM, the payment details are pre-filled — they just tap pay.' },
        { q: 'Which apps can scan my UPI QR code?', a: 'All major Indian UPI apps: Google Pay, PhonePe, Paytm, BHIM, Amazon Pay, and WhatsApp Pay.' },
        { q: 'Is the amount mandatory?', a: 'No. Generate a QR with just your UPI ID and the payer enters the amount. Set a fixed amount for fixed-price items like a ₹100 product.' },
        { q: 'Should I add my name to the QR code?', a: 'Yes, adding your shop or personal name builds trust — payers see the name before confirming payment, which reduces failed or wrong payments.' },
        { q: 'Is it safe to share my UPI QR code publicly?', a: 'Yes. A UPI QR only contains your payment address — it cannot be used to withdraw money. Never share UPI PINs or OTPs with anyone.' },
        { q: 'Is this UPI QR generator free?', a: 'Yes, completely free with no sign-up and unlimited QR codes. Your details stay in your browser.' },
      ]}
      howItWorks={[
        'Enter your UPI ID in the format username@bank, plus your name (optional).',
        'Optionally set a fixed amount and a payment note.',
        'Click Generate to create the QR code.',
        'Download, print, or share the QR code image.',
      ]}
      schema={{
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Free UPI QR Code Generator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any (Web Browser)',
        url: 'https://www.uptools.in/upi-qr-generator/',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
      }}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Main Grid: Form Left, Preview Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form & Styling */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary UPI Details Card */}
            <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 sm:p-6 space-y-5">
              <h2 className="text-sm font-bold text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span>⚡</span> UPI Payment Details
                </span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  NPCI Compliant
                </span>
              </h2>

              {/* UPI ID (VPA) with real-time validation */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    UPI ID / VPA <span className="text-red-400">*</span>
                  </label>
                  {trimmedUpi && (
                    <span
                      className={`text-[11px] font-bold flex items-center gap-1 ${
                        isVpaValid ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {isVpaValid ? '✓ Valid UPI format' : '⚠️ Format: name@bank'}
                    </span>
                  )}
                </div>

                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => {
                    setUpiId(e.target.value)
                    setError('')
                  }}
                  placeholder="e.g., yourname@okhdfcbank or 9876543210@paytm"
                  className={`w-full bg-white/[0.04] border rounded-xl px-4 py-3 text-white text-sm outline-none transition-all placeholder:text-slate-500 min-h-[44px] ${
                    trimmedUpi && !isVpaValid
                      ? 'border-amber-500/50 focus:border-amber-500'
                      : 'border-white/[0.1] focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50'
                  }`}
                />

                {/* Popular Bank Handle Chips */}
                <div className="pt-1.5">
                  <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">
                    Quick Bank Suffixes:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {BANK_HANDLES.map((handle) => {
                      const active = trimmedUpi.endsWith(handle)
                      return (
                        <button
                          key={handle}
                          type="button"
                          onClick={() => handleBankSuffix(handle)}
                          className={`min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-mono transition-all duration-150 active:scale-95 ${
                            active
                              ? 'bg-emerald-600 text-white shadow-sm border border-emerald-500 font-bold'
                              : 'bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.08]'
                          }`}
                        >
                          {active && <span className="mr-1">✓</span>}
                          {handle}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Payee Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Payee / Merchant Name (Optional)
                </label>
                <input
                  type="text"
                  value={payeeName}
                  onChange={(e) => setPayeeName(e.target.value)}
                  placeholder="e.g., John&apos;s Cafe or Acme Retail"
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-500 min-h-[44px]"
                />
                <p className="text-[11px] text-slate-500">
                  Visible to the payer in GPay/PhonePe to confirm identity before payment.
                </p>
              </div>

              {/* Amount with Quick Presets */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    Preset Amount (₹ INR) — Optional
                  </label>
                  {amount && (
                    <button
                      type="button"
                      onClick={() => setAmount('')}
                      className="text-[11px] text-slate-400 hover:text-red-400 transition-colors"
                    >
                      Clear Amount
                    </button>
                  )}
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Leave empty for payer to enter any amount"
                    min="1"
                    step="0.01"
                    className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl pl-9 pr-4 py-3 text-white text-sm outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-500 min-h-[44px]"
                  />
                </div>

                {/* Amount presets */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 pt-1">
                  {AMOUNT_PRESETS.map((val) => {
                    const active = amount === String(val)
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setAmount(String(val))}
                        className={`min-h-[40px] px-2 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 ${
                          active
                            ? 'bg-emerald-600 text-white shadow-sm border border-emerald-500'
                            : 'bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.08]'
                        }`}
                      >
                        {active && <span className="mr-1">✓</span>}
                        ₹{val}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Note / Purpose */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Payment Note / Remark (Optional)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g., Dinner, Order #1234, or Support"
                  maxLength={80}
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-500 min-h-[44px]"
                />
              </div>
            </div>

            {/* Styling & Customization Card */}
            <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 sm:p-6 space-y-6">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>🎨</span> QR Code Styling &amp; Branding
              </h2>

              {/* Palette Presets */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">
                  Branded UPI Themes
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {UPI_PALETTES.map((pal) => {
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
                            ? 'bg-emerald-600/30 border-2 border-emerald-500 text-white'
                            : 'bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:border-white/20'
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full border border-white/20 shrink-0 flex items-center justify-center shadow" style={{ backgroundColor: pal.bg }}>
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pal.fg }} />
                        </span>
                        <span className="truncate font-medium">{pal.name}</span>
                        {active && <span className="ml-auto text-xs text-emerald-400">✓</span>}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Custom Color Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Foreground Color</label>
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Background Color</label>
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

              {/* Contrast warning */}
              {contrast.rating === 'critical' ? (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2.5">
                  <span className="text-base shrink-0">⚠️</span>
                  <div>
                    <strong className="block font-bold">Contrast Warning ({contrast.ratio}:1)</strong>
                    <span>Cameras may fail to read this payment code. Please increase contrast between the foreground and background.</span>
                  </div>
                </div>
              ) : contrast.rating === 'warning' ? (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-2.5">
                  <span className="text-base shrink-0">⚠️</span>
                  <div>
                    <strong className="block font-bold">Borderline Contrast ({contrast.ratio}:1)</strong>
                    <span>Payment scanners in dim store lighting may scan slower.</span>
                  </div>
                </div>
              ) : null}

              {/* Margin & Error Correction */}
              <div className="space-y-4 pt-2 border-t border-white/[0.06]">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-300">
                      Error Correction Level
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Redundancy protection
                    </span>
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
                              ? 'bg-emerald-600 text-white shadow-sm border border-emerald-500'
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
                              ? 'bg-emerald-600 text-white shadow-sm border border-emerald-500'
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

              {/* Logo / Merchant Badge Upload */}
              <div className="pt-2 border-t border-white/[0.06] space-y-2.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Merchant Logo / Shop Brand Overlay (~20% centered)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="upi-logo-upload"
                  />
                  <label
                    htmlFor="upi-logo-upload"
                    className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-slate-300 hover:text-white hover:border-white/20 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all duration-150"
                  >
                    <span>🏪</span>
                    <span>{logoDataUrl ? 'Change Shop Logo' : 'Upload Store Logo'}</span>
                  </label>

                  {logoDataUrl && (
                    <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 rounded-xl">
                      <img src={logoDataUrl} alt="Logo" className="w-7 h-7 rounded object-contain bg-white/10 p-0.5" />
                      <span className="text-xs text-slate-300 truncate max-w-[140px]">{logoName || 'Logo loaded'}</span>
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="text-xs text-red-400 hover:text-red-300 p-1 min-h-[32px]"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  Adds credibility and trust on your print standees. Error correction is automatically raised to High (H).
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-sm text-red-300 flex items-center gap-3">
                <span className="text-lg">❌</span>
                <span>{error}</span>
              </div>
            )}

            {/* Generate & Reset Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleGenerate}
                className="glow-btn flex-1 py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 min-h-[48px]"
              >
                <span>📱</span>
                <span>Generate UPI QR Code</span>
              </button>
              <button
                type="button"
                onClick={reset}
                className="min-h-[48px] px-5 py-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-slate-400 hover:text-white text-sm font-semibold transition-all"
              >
                Reset
              </button>
            </div>

            {/* UPI Intent String Live Box */}
            <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider">
                  UPI Intent String Preview
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyText(upiIntentString, 'UPI Intent')}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  Copy Intent
                </button>
              </div>
              <div className="font-mono text-xs text-slate-300 bg-black/30 p-3 rounded-xl break-all select-all leading-relaxed">
                {upiIntentString || 'Enter your UPI ID above to generate intent string'}
              </div>
            </div>
          </div>

          {/* Right Column: Branded Merchant Display & Downloads */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-6" ref={resultRef}>
            {generated && isVpaValid ? (
              <div
                className="rounded-3xl border border-white/[0.08] bg-white/[0.06] p-6 sm:p-7 text-center space-y-5 shadow-2xl backdrop-blur-md"
                style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}
              >
                {/* Merchant Header Badge */}
                <div className="space-y-1 pb-2 border-b border-white/[0.06]">
                  <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold text-emerald-400">
                    <span>⚡</span>
                    <span>BHIM UPI • Instant Payment</span>
                  </div>
                  {payeeName.trim() && (
                    <h3 className="text-lg font-bold text-white pt-1 truncate">
                      {payeeName.trim()}
                    </h3>
                  )}
                  <p className="text-xs text-slate-400 font-mono truncate">
                    {trimmedUpi}
                  </p>
                </div>

                {/* QR Canvas Display */}
                <div className="flex justify-center py-1">
                  <div
                    className="p-4 rounded-2xl shadow-2xl border border-white/10 transition-transform duration-200 hover:scale-[1.02]"
                    style={{ backgroundColor: bgColor }}
                  >
                    <canvas
                      ref={canvasRef}
                      className="block rounded-lg max-w-[260px] sm:max-w-[280px] w-full h-auto aspect-square"
                    />
                  </div>
                </div>

                {/* Amount or Prompt Banner */}
                {amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3 text-center">
                    <span className="text-[11px] text-emerald-400/80 uppercase tracking-wider font-semibold block">
                      Pay Exact Amount
                    </span>
                    <span className="text-2xl font-black text-emerald-400 tracking-tight">
                      ₹{parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    {note.trim() && (
                      <span className="text-xs text-slate-400 block pt-0.5 truncate">
                        For: &quot;{note.trim()}&quot;
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl py-2 px-3 text-xs text-slate-400">
                    Scan with any UPI app to pay any amount
                  </div>
                )}

                {/* Supported Apps Pills */}
                <div className="flex items-center justify-center gap-2 flex-wrap text-[11px] text-slate-400 pt-1">
                  <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">GPay</span>
                  <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">PhonePe</span>
                  <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">Paytm</span>
                  <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">BHIM</span>
                  <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">Amazon Pay</span>
                </div>

                {/* Size Presets for Export */}
                <div className="text-left space-y-1.5 pt-2 border-t border-white/[0.06]">
                  <label className="block text-xs font-semibold text-slate-400">
                    Export Resolution
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
                              ? 'bg-emerald-600 text-white shadow-sm border border-emerald-500'
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

                {/* Download Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handleDownloadPng}
                    disabled={downloadingPng}
                    className="min-h-[44px] py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                  >
                    <span>{downloadingPng ? '⏳' : '📥'}</span>
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
                    onClick={() => handleCopyText(trimmedUpi, 'UPI ID')}
                    className="min-h-[44px] py-2.5 px-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.08] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>🆔</span>
                    <span>Copy UPI ID</span>
                  </button>
                </div>

                {/* Mobile Intent Direct Link */}
                <a
                  href={upiIntentString}
                  className="min-h-[44px] w-full py-2.5 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <span>⚡</span>
                  <span>Test Payment on Mobile</span>
                </a>

                {/* Toast Notification */}
                {copiedStatus && (
                  <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs font-bold text-emerald-300 flex items-center justify-center gap-2 animate-slide-up">
                    <span>✓</span>
                    <span>{copiedStatus}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.02] space-y-3">
                <div className="text-4xl opacity-25">📱</div>
                <h4 className="text-sm font-bold text-white">UPI QR Code Preview</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Enter a valid UPI virtual payment address (e.g., username@bank) to generate your branded payment code.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* SEO / Editorial Section */}
        <div className="pt-6">
          <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                Generate NPCI-Compliant UPI QR Codes for Seamless Payments
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Accept digital payments across India with zero transaction fees. This UPI QR Code Generator creates standard NPCI specification QR codes that can be scanned by every Indian UPI application, including Google Pay (GPay), PhonePe, Paytm, BHIM UPI, Amazon Pay, Cred, and WhatsApp Pay.
              </p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-2">
                Why use custom QR codes for your shop or business?
              </h3>
              <ul className="list-disc list-inside text-sm text-slate-400 space-y-1.5 leading-relaxed">
                <li><strong className="text-slate-200">High-Resolution Vector SVG &amp; 4K PNG:</strong> Perfect for printing shop counters, invoice receipts, menu cards, and acrylic standees without blurriness.</li>
                <li><strong className="text-slate-200">Pre-set Fixed Amounts:</strong> Eliminates customer typing errors for set-price products, event tickets, or fixed billing fees.</li>
                <li><strong className="text-slate-200">Logo Branding:</strong> Overlay your company or shop emblem right in the center with high error correction for an authentic brand look.</li>
                <li><strong className="text-slate-200">100% Client-Side Privacy:</strong> Your banking handles and customer notes are calculated entirely in your browser — zero tracking or middleman servers.</li>
              </ul>
            </div>
            <p className="text-xs text-slate-600 pt-1">
              Explore more free tools:{' '}
              <a className="text-emerald-400 hover:text-emerald-300" href="/qr-generator/">QR Code Generator</a>,{' '}
              <a className="text-emerald-400 hover:text-emerald-300" href="/qr-reader/">QR Code Scanner</a>, and{' '}
              <a className="text-emerald-400 hover:text-emerald-300" href="/barcode-generator/">Barcode Generator</a>.
            </p>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
