import { useState, useCallback, useRef, useEffect } from 'react'
import jsQR from 'jsqr'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'
import { copyTextToClipboard } from '../lib/qrHelper'

const STORAGE_KEY = 'uptools_qr_reader_history'

function analyzePayload(raw) {
  const text = (raw || '').trim()
  const low = text.toLowerCase()

  if (low.startsWith('http://') || low.startsWith('https://')) {
    return {
      type: 'URL',
      icon: '🔗',
      badgeClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      actionLabel: 'Open Link',
      actionHref: text,
      details: null,
    }
  }

  if (low.startsWith('upi://pay')) {
    const params = new URLSearchParams(text.replace(/^upi:\/\/pay\??/, ''))
    const pa = params.get('pa') || ''
    const pn = params.get('pn') || ''
    const am = params.get('am') || ''
    const tn = params.get('tn') || ''
    return {
      type: 'UPI Payment',
      icon: '⚡',
      badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      actionLabel: 'Open in UPI App',
      actionHref: text,
      details: { pa, pn, am, tn },
    }
  }

  if (low.startsWith('wifi:')) {
    // WIFI:T:WPA;S:MyNetwork;P:MyPassword;H:true;;
    const sMatch = text.match(/S:([^;]+)/)
    const pMatch = text.match(/P:([^;]+)/)
    const tMatch = text.match(/T:([^;]+)/)
    const ssid = sMatch ? sMatch[1] : ''
    const password = pMatch ? pMatch[1] : ''
    const security = tMatch ? tMatch[1] : 'WPA'
    return {
      type: 'WiFi Network',
      icon: '📶',
      badgeClass: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      actionLabel: null,
      actionHref: null,
      details: { ssid, password, security },
    }
  }

  if (low.startsWith('mailto:')) {
    return {
      type: 'Email',
      icon: '✉️',
      badgeClass: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      actionLabel: 'Compose Email',
      actionHref: text,
      details: null,
    }
  }

  if (low.startsWith('tel:')) {
    return {
      type: 'Phone',
      icon: '📞',
      badgeClass: 'bg-green-500/20 text-green-400 border-green-500/30',
      actionLabel: 'Call Number',
      actionHref: text,
      details: null,
    }
  }

  if (low.startsWith('sms:') || low.startsWith('smsto:')) {
    return {
      type: 'SMS Message',
      icon: '💬',
      badgeClass: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
      actionLabel: 'Send SMS',
      actionHref: text,
      details: null,
    }
  }

  if (low.startsWith('begin:vcard')) {
    const fnMatch = text.match(/FN:(.+)/i)
    const telMatch = text.match(/TEL.*:(.+)/i)
    const emailMatch = text.match(/EMAIL.*:(.+)/i)
    return {
      type: 'vCard Contact',
      icon: '👤',
      badgeClass: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      actionLabel: null,
      actionHref: null,
      details: {
        name: fnMatch ? fnMatch[1].trim() : '',
        tel: telMatch ? telMatch[1].trim() : '',
        email: emailMatch ? emailMatch[1].trim() : '',
      },
    }
  }

  return {
    type: 'Plain Text',
    icon: '📝',
    badgeClass: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    actionLabel: null,
    actionHref: null,
    details: null,
  }
}

export default function QrReader() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const fileInputRef = useRef(null)

  // Camera state
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraLoading, setCameraLoading] = useState(false)
  const [hasTorch, setHasTorch] = useState(false)
  const [torchOn, setTorchOn] = useState(false)
  const [facingMode, setFacingMode] = useState('environment')
  const [cameraError, setCameraError] = useState(null)

  // Scan Results & History
  const [results, setResults] = useState([])
  const [latestScan, setLatestScan] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const [scanMessage, setScanMessage] = useState('')

  // Drag & drop state
  const [isDragging, setIsDragging] = useState(false)
  const [processingImage, setProcessingImage] = useState(false)

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setResults(parsed.slice(0, 50))
        }
      }
    } catch {}
  }, [])

  // Sync history to localStorage
  const saveHistory = useCallback((items) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 50)))
    } catch {}
  }, [])

  const addResult = useCallback((text, meta = {}) => {
    if (!text || !text.trim()) return

    const trimmed = text.trim()
    const analyzed = analyzePayload(trimmed)
    const newEntry = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      text: trimmed,
      type: analyzed.type,
      icon: analyzed.icon,
      badgeClass: analyzed.badgeClass,
      actionLabel: analyzed.actionLabel,
      actionHref: analyzed.actionHref,
      details: analyzed.details,
      source: meta.source || 'scanner',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      date: new Date().toLocaleDateString(),
    }

    setLatestScan(newEntry)
    setScanMessage(`Decoded ${analyzed.type} successfully!`)
    setTimeout(() => setScanMessage(''), 4000)

    setResults(prev => {
      // Avoid duplicate immediate top entry
      const filtered = prev.filter(item => item.text !== trimmed)
      const updated = [newEntry, ...filtered]
      saveHistory(updated)
      return updated
    })

    jumpTo()
  }, [jumpTo, saveHistory])

  // Stop active camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setCameraActive(false)
    setCameraLoading(false)
    setHasTorch(false)
    setTorchOn(false)
  }, [])

  // Start Camera
  const startCamera = useCallback(async (mode = facingMode) => {
    stopCamera()
    setCameraError(null)
    setCameraLoading(true)

    if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== "function") {
      setCameraError({
        message: "Camera needs a secure HTTPS connection. Please open this page with https:// and try again, or upload an image instead.",
        type: "general",
      })
      setCameraLoading(false)
      return
    }

    try {
      let s
      try {
        s = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: mode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        })
      } catch (err) {
        // Some devices reject ideal constraints — retry with basic video
        if (err && err.name === "OverconstrainedError") {
          s = await navigator.mediaDevices.getUserMedia({ video: true })
        } else {
          throw err
        }
      }
      streamRef.current = s

      // NOTE: the <video> element mounts after setCameraActive(true) below,
      // so the stream is attached in the effect watching cameraActive.
      setCameraActive(true)
      setFacingMode(mode)

      // Check torch capability
      const track = s.getVideoTracks()[0]
      if (track && typeof track.getCapabilities === 'function') {
        const caps = track.getCapabilities()
        if (caps.torch) {
          setHasTorch(true)
        }
      }
    } catch (err) {
      console.warn('Camera initialization failed:', err)
      let msg = 'Could not access the camera. Please check permissions.'
      let type = 'general'

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'Camera permission was denied. Please allow camera access in your browser address bar and try again.'
        type = 'permission'
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        msg = 'No video camera was detected on this device. You can upload an image file instead.'
        type = 'not_found'
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        msg = 'The camera is currently locked or being used by another application. Please close other camera apps and retry.'
        type = 'in_use'
      }

      setCameraError({ message: msg, type })
      setCameraActive(false)
    } finally {
      setCameraLoading(false)
    }
  }, [facingMode, stopCamera])

  // Toggle Torch
  const toggleTorch = useCallback(async () => {
    if (!streamRef.current || !hasTorch) return
    const track = streamRef.current.getVideoTracks()[0]
    if (!track) return

    try {
      const newState = !torchOn
      await track.applyConstraints({
        advanced: [{ torch: newState }],
      })
      setTorchOn(newState)
    } catch (e) {
      console.warn('Failed to toggle torch:', e)
    }
  }, [hasTorch, torchOn])

  // Flip Camera (environment <-> user)
  const flipCamera = useCallback(() => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment'
    startCamera(nextMode)
  }, [facingMode, startCamera])

  // Attach the stream once the <video> element has mounted
  useEffect(() => {
    if (cameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
      videoRef.current.play().catch(() => {})
    }
  }, [cameraActive])

  // Process a canvas / image data with both BarcodeDetector & jsQR
  const decodeCanvas = useCallback(async (canvas) => {
    // 1. Try native BarcodeDetector if available for hardware speed
    if ('BarcodeDetector' in window) {
      try {
        const detector = new window.BarcodeDetector({ formats: ['qr_code'] })
        const detections = await detector.detect(canvas)
        if (detections && detections.length && detections[0].rawValue) {
          return detections[0].rawValue
        }
      } catch {}
    }

    // 2. High-reliability jsQR fallback with both inversion attempts
    try {
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return null
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imgData.data, imgData.width, imgData.height, {
        inversionAttempts: 'attemptBoth',
      })
      if (code && code.data) {
        return code.data
      }
    } catch (err) {
      console.warn('jsQR processing failed:', err)
    }

    return null
  }, [])

  // Camera continuous scanning loop
  useEffect(() => {
    if (!cameraActive) return

    let stopped = false
    let timerId = null
    const hiddenCanvas = document.createElement('canvas')
    const hiddenCtx = hiddenCanvas.getContext('2d', { willReadFrequently: true })
    const seenRecently = new Set()

    const scanFrame = async () => {
      if (stopped) return

      try {
        const video = videoRef.current
        if (video && video.readyState >= 2 && video.videoWidth > 0) {
          hiddenCanvas.width = video.videoWidth
          hiddenCanvas.height = video.videoHeight
          hiddenCtx.drawImage(video, 0, 0, hiddenCanvas.width, hiddenCanvas.height)

          const decoded = await decodeCanvas(hiddenCanvas)
          if (decoded && !seenRecently.has(decoded)) {
            seenRecently.add(decoded)
            addResult(decoded, { source: 'Camera Scan' })
            // Cooldown for same code
            setTimeout(() => seenRecently.delete(decoded), 3000)
          }
        }
      } catch {}

      if (!stopped) {
        timerId = setTimeout(scanFrame, 200)
      }
    }

    scanFrame()

    return () => {
      stopped = true
      if (timerId) clearTimeout(timerId)
    }
  }, [cameraActive, decodeCanvas, addResult])

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
      }
    }
  }, [])

  // Scan file image
  const processImageFile = useCallback(async (file) => {
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setCameraError({ message: 'Selected file is not an image. Please upload a PNG, JPG, or WebP.', type: 'invalid_file' })
      return
    }

    setProcessingImage(true)
    setCameraError(null)

    try {
      const img = new Image()
      const objectUrl = URL.createObjectURL(file)

      img.onload = async () => {
        try {
          const canvas = document.createElement('canvas')
          canvas.width = img.naturalWidth || img.width
          canvas.height = img.naturalHeight || img.height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0)

          const decoded = await decodeCanvas(canvas)
          URL.revokeObjectURL(objectUrl)

          if (decoded) {
            addResult(decoded, { source: file.name || 'Uploaded Image' })
          } else {
            setCameraError({
              message: 'No QR code found in this image. Try an image with higher lighting and closer focus.',
              type: 'not_found',
            })
          }
        } catch {
          setCameraError({ message: 'Failed to process image file.', type: 'error' })
        } finally {
          setProcessingImage(false)
        }
      }

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl)
        setCameraError({ message: 'Unable to load image file.', type: 'error' })
        setProcessingImage(false)
      }

      img.src = objectUrl
    } catch {
      setCameraError({ message: 'Failed to read image file.', type: 'error' })
      setProcessingImage(false)
    }
  }, [decodeCanvas, addResult])

  // Drag and drop event handlers
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer?.files?.[0]
    if (file) {
      processImageFile(file)
    }
  }

  // Paste image handler (Cmd+V / Ctrl+V anywhere)
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items
      if (!items) return
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile()
          if (blob) {
            processImageFile(blob)
            break
          }
        }
      }
    }
    window.addEventListener('paste', handlePaste)
    return () => window.removeEventListener('paste', handlePaste)
  }, [processImageFile])

  // Copy handler
  const handleCopy = async (text, id) => {
    const ok = await copyTextToClipboard(text)
    if (ok) {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    }
  }

  // Clear single history item
  const deleteHistoryItem = (id) => {
    setResults(prev => {
      const updated = prev.filter(r => r.id !== id)
      saveHistory(updated)
      return updated
    })
    if (latestScan && latestScan.id === id) {
      setLatestScan(null)
    }
  }

  // Clear all history
  const clearAllHistory = () => {
    setResults([])
    setLatestScan(null)
    saveHistory([])
  }

  return (
    <ToolLayout
      title="Free QR Code Scanner Online – Camera & Image"
      desc="Free QR code scanner online: scan QR codes with your camera or upload an image. Reads URLs, UPI, WiFi, vCards instantly — private, on-device, no signup."
      icon="📷"
      iconBg="rgba(34,197,94,0.08)"
      category="utility"
      slug="qr-reader"
      faq={[
        { q: 'Does this upload my images?', a: 'No. Everything runs locally in your browser. Camera and image processing happen on-device — your scans never leave your phone or computer.' },
        { q: 'What QR code types can it read?', a: 'URLs, plain text, UPI payment codes, WiFi credentials, vCards, phone numbers, SMS, email addresses, and locations.' },
        { q: 'How do I scan a QR code with my camera?', a: 'Click Start Camera, allow camera permission, and point your phone or laptop camera at the QR code. The result appears automatically — no photo needed.' },
        { q: 'Can I scan a QR code from a screenshot?', a: 'Yes. Save the screenshot as an image and upload it or drag and drop it into the drop zone. You can also paste screenshots directly from your clipboard.' },
        { q: 'Why is my QR code not scanning?', a: 'Common causes: blur, glare, too small, or low contrast. Hold steady, improve lighting, and fill the frame with the code. If the camera fails, try uploading a photo instead.' },
        { q: 'Is this QR scanner free?', a: 'Yes, completely free with no sign-up and unlimited scans, on any device.' },
      ]}
      howItWorks={[
        'Click Start Camera to use your device camera for live scanning.',
        'Or drag and drop an image containing a QR code onto the screen.',
        'Results appear instantly below with one-tap copy and link opening.',
      ]}
      schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Free QR Code Scanner Online",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Any (Web Browser)",
        "url": "https://www.uptools.in/qr-reader/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Main Scanner Section */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-3xl p-5 sm:p-6 space-y-5 shadow-xl">
          {/* Top Controls Bar */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-sm font-bold text-white tracking-wide">Live Optical Scanner</h2>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {!cameraActive ? (
                <button
                  type="button"
                  onClick={() => startCamera()}
                  disabled={cameraLoading}
                  className="glow-btn min-h-[44px] px-5 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 active:scale-95"
                >
                  <span>{cameraLoading ? '⏳' : '📸'}</span>
                  <span>{cameraLoading ? 'Starting Camera...' : 'Start Camera'}</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  {hasTorch && (
                    <button
                      type="button"
                      onClick={toggleTorch}
                      className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        torchOn
                          ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                          : 'bg-white/[0.08] text-white hover:bg-white/[0.15]'
                      }`}
                      title={torchOn ? 'Turn flashlight off' : 'Turn flashlight on'}
                    >
                      <span>{torchOn ? '🔦 On' : '🔦 Torch'}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={flipCamera}
                    className="min-h-[44px] px-3 py-2 rounded-xl bg-white/[0.08] text-white hover:bg-white/[0.15] text-xs font-bold transition-all"
                    title="Switch camera"
                  >
                    🔄 Flip
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-red-500/80 hover:bg-red-500 text-white text-xs font-bold transition-all active:scale-95"
                  >
                    Stop
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Active Camera Viewport */}
          {(cameraActive || cameraLoading) && (
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video sm:aspect-4/3 flex items-center justify-center border border-white/10 shadow-2xl">
              {cameraLoading && !cameraActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                  <div className="text-center">
                    <div className="text-3xl mb-2 animate-pulse">📸</div>
                    <div className="text-xs text-slate-300">Starting camera...</div>
                  </div>
                </div>
              )}
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
                autoPlay
              />
              {/* Animated HUD Viewfinder Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 border-2 border-emerald-400/40 rounded-2xl">
                  {/* Corner Targets */}
                  <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl" />
                  <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl" />
                  <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl" />
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-xl" />
                  {/* Laser scan line */}
                  <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="absolute bottom-3 inset-x-0 text-center pointer-events-none">
                <span className="bg-black/70 backdrop-blur-md text-emerald-300 font-mono text-[11px] px-3 py-1 rounded-full border border-white/10">
                  Point camera at QR code
                </span>
              </div>
            </div>
          )}

          {/* Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center transition-all duration-200 cursor-pointer ${
              isDragging
                ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
                : 'border-white/[0.1] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => processImageFile(e.target.files?.[0])}
            />

            <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
              <span className="text-3xl sm:text-4xl">{processingImage ? '⏳' : '📁'}</span>
              <p className="text-sm font-bold text-white">
                {processingImage ? 'Analyzing Image...' : 'Drop QR Image Here or Click to Browse'}
              </p>
              <p className="text-xs text-slate-400 max-w-sm">
                Supports PNG, JPG, WebP, or SVG screenshots. You can also paste directly from clipboard with <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">Ctrl+V</kbd>.
              </p>
            </div>
          </div>

          {/* Camera Permission / Error State with Retry Button */}
          {cameraError && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/25 space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-xl shrink-0">⚠️</span>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-red-300 uppercase tracking-wider">
                    {cameraError.type === 'permission'
                      ? 'Camera Access Required'
                      : cameraError.type === 'not_found'
                      ? 'No Camera Found'
                      : 'Scanning Notice'}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{cameraError.message}</p>
                </div>
              </div>

              {cameraError.type === 'permission' && (
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => startCamera()}
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold text-xs transition-all active:scale-95"
                  >
                    🔄 Retry Camera Access
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-semibold transition-all"
                  >
                    Upload Image Instead
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Success Flash Notification */}
          {scanMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2.5 animate-slide-up">
              <span className="text-base">✓</span>
              <span>{scanMessage}</span>
            </div>
          )}
        </div>

        {/* Latest Scan Result Card (Prominent View) */}
        {latestScan && (
          <div
            ref={resultRef}
            className="bg-white/[0.06] border border-white/[0.08] rounded-3xl p-5 sm:p-7 space-y-4 shadow-2xl relative overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}
          >
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2.5">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${latestScan.badgeClass}`}>
                  <span>{latestScan.icon}</span>
                  <span>{latestScan.type}</span>
                </span>
                <span className="text-[11px] text-slate-400">via {latestScan.source}</span>
              </div>
              <span className="text-xs text-slate-500 font-mono">{latestScan.time}</span>
            </div>

            {/* Structured details for WiFi or UPI */}
            {latestScan.details && latestScan.type === 'WiFi Network' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-white/[0.03] p-3 rounded-xl border border-white/[0.06]">
                <div>
                  <span className="text-slate-400 block text-[10px]">SSID:</span>
                  <span className="font-bold text-white font-mono">{latestScan.details.ssid || 'Hidden'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Password:</span>
                  <span className="font-bold text-emerald-400 font-mono">{latestScan.details.password || 'None'}</span>
                </div>
              </div>
            )}

            {latestScan.details && latestScan.type === 'UPI Payment' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-white/[0.03] p-3 rounded-xl border border-white/[0.06]">
                <div>
                  <span className="text-slate-400 block text-[10px]">VPA:</span>
                  <span className="font-bold text-white truncate block">{latestScan.details.pa}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Payee:</span>
                  <span className="font-semibold text-slate-200 truncate block">{latestScan.details.pn || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Amount:</span>
                  <span className="font-bold text-emerald-400 block">
                    {latestScan.details.am ? `₹${latestScan.details.am}` : 'User entered'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Note:</span>
                  <span className="text-slate-300 truncate block">{latestScan.details.tn || 'None'}</span>
                </div>
              </div>
            )}

            {/* Raw Scanned Payload */}
            <div className="bg-black/30 border border-white/[0.06] rounded-xl p-3.5 font-mono text-xs sm:text-sm text-slate-100 break-all select-all leading-relaxed">
              {latestScan.text}
            </div>

            {/* Actions for Latest Scan */}
            <div className="flex items-center gap-2.5 flex-wrap pt-1">
              <button
                type="button"
                onClick={() => handleCopy(latestScan.text, latestScan.id)}
                className={`min-h-[44px] px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 ${
                  copiedId === latestScan.id
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                <span>{copiedId === latestScan.id ? '✓' : '📋'}</span>
                <span>{copiedId === latestScan.id ? 'Copied to Clipboard' : 'Copy Content'}</span>
              </button>

              {latestScan.actionHref && (
                <a
                  href={latestScan.actionHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.1] text-white text-xs font-bold flex items-center gap-2 transition-all active:scale-95"
                >
                  <span>🔗</span>
                  <span>{latestScan.actionLabel || 'Open Link'}</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Scan History Section */}
        {results.length > 0 ? (
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Scan History
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/[0.08] text-slate-400">
                  {results.length}
                </span>
              </div>
              <button
                type="button"
                onClick={clearAllHistory}
                className="text-xs text-red-400 hover:text-red-300 font-semibold transition-colors min-h-[36px] px-2 flex items-center"
              >
                Clear History
              </button>
            </div>

            <div className="space-y-3">
              {results.map((r) => {
                const isCopied = copiedId === r.id
                return (
                  <div
                    key={r.id}
                    className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/15 transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${r.badgeClass}`}>
                          {r.icon} {r.type}
                        </span>
                        <span className="text-[10px] text-slate-500">{r.source}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{r.time}</span>
                    </div>

                    <p className="text-xs font-mono text-slate-200 break-all bg-black/20 p-2.5 rounded-lg">
                      {r.text}
                    </p>

                    <div className="flex items-center gap-2 flex-wrap pt-1">
                      <button
                        type="button"
                        onClick={() => handleCopy(r.text, r.id)}
                        className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          isCopied
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-white/[0.05] hover:bg-white/[0.1] text-slate-300'
                        }`}
                      >
                        <span>{isCopied ? '✓' : '📋'}</span>
                        <span>{isCopied ? 'Copied' : 'Copy'}</span>
                      </button>

                      {r.actionHref && (
                        <a
                          href={r.actionHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
                        >
                          <span>🔗</span>
                          <span>{r.actionLabel || 'Open'}</span>
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => deleteHistoryItem(r.id)}
                        className="ml-auto text-xs text-slate-500 hover:text-red-400 transition-colors p-1.5 min-h-[38px] flex items-center"
                        title="Remove from history"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : !latestScan ? (
          <div className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01] space-y-2">
            <div className="text-4xl opacity-20">📷</div>
            <p className="text-sm text-slate-500 font-medium">
              Start camera or drop an image above to scan
            </p>
            <p className="text-xs text-slate-600">
              Scanned QR codes will appear here with instant history retention.
            </p>
          </div>
        ) : null}

        {/* Footer Navigation */}
        <p className="text-xs text-slate-500 text-center pt-2">
          Need to generate codes instead? Try our free{' '}
          <a className="text-emerald-400 hover:text-emerald-300" href="/qr-generator/">QR Code Generator</a>,{' '}
          <a className="text-emerald-400 hover:text-emerald-300" href="/upi-qr-generator/">UPI QR Generator</a>, or{' '}
          <a className="text-emerald-400 hover:text-emerald-300" href="/barcode-generator/">Barcode Generator</a>.
        </p>
      </div>
    </ToolLayout>
  )
}
