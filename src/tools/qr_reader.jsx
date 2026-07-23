import { useState, useCallback, useRef, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

function analyzePayload(raw) {
  if (/^https?:\/\//i.test(raw)) return { type: 'URL', parsed: { href: raw } }
  if (/^mailto:/i.test(raw)) return { type: 'Email', parsed: { href: raw } }
  if (/^tel:/i.test(raw)) return { type: 'Phone', parsed: { href: raw } }
  if (/^wifi:/i.test(raw)) return { type: 'WiFi', parsed: null }
  if (/^BEGIN:VCARD/i.test(raw)) return { type: 'vCard', parsed: null }
  if (/^[A-Z0-9]{4}\d{7}$/.test(raw)) return { type: 'IFSC', parsed: null }
  return { type: 'Text', parsed: null }
}

export default function qr_reader() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const videoRef = useRef(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [stream, setStream] = useState(null)
  const [results, setResults] = useState([])
  const [error, setError] = useState('')
  const [copying, setCopying] = useState(null)

  const addResult = useCallback((text, meta = {}) => {
    const { type, parsed } = analyzePayload(text)
    setResults(prev => [{ text, type, parsed, meta, time: new Date().toLocaleTimeString() }, ...prev])
  }, [])

  const startCamera = useCallback(async () => {
    try {
      setError('')
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } } })
      setStream(s)
      setCameraActive(true)
      if (videoRef.current) {
        videoRef.current.srcObject = s
        videoRef.current.play()
      }
    } catch (err) {
      setError('Camera access denied. Try uploading an image instead.')
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (stream) stream.getTracks().forEach(t => t.stop())
    setStream(null)
    setCameraActive(false)
  }, [stream])

  useEffect(() => {
    return () => { if (stream) stream.getTracks().forEach(t => t.stop()) }
  }, [stream])

  const scanFile = useCallback(async (file) => {
    if (!file) return
    try {
      const bmp = await createImageBitmap(file)
      if ('BarcodeDetector' in window) {
        try {
          const det = new window.BarcodeDetector({ formats: ['qr_code'] })
          const detections = await det.detect(bmp)
          if (detections.length) {
            detections.forEach(d => addResult(d.rawValue, { from: 'image' }))
            jumpTo()
            return
          }
        } catch {}
      }
      // Fallback: try to read as text
      const reader = new FileReader()
      reader.onload = async (e) => {
        const img = new Image()
        img.onload = async () => {
          const canvas = document.createElement('canvas')
          canvas.width = img.width; canvas.height = img.height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0)
          if ('BarcodeDetector' in window) {
            try {
              const det = new window.BarcodeDetector({ formats: ['qr_code'] })
              const detections = await det.detect(canvas)
              detections.forEach(d => addResult(d.rawValue, { from: 'image' }))
            } catch { setError('No QR code found in image.') }
          } else {
            setError('QR detection not supported in this browser.')
          }
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    } catch (err) {
      setError('Failed to process image.')
    }
  }, [addResult, jumpTo])

  const copy = useCallback((text, idx) => {
    navigator.clipboard?.writeText(text)
    setCopying(idx); setTimeout(() => setCopying(null), 2000)
  }, [])

  const share = useCallback(async (text) => {
    if (navigator.share) { try { await navigator.share({ text }) } catch {} }
    else { navigator.clipboard?.writeText(text) }
  }, [])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="QR Code Scanner"
      desc="Scan QR codes from camera, uploaded images, or screen capture. Instantly decode URLs, text, WiFi, vCards, and more."
      icon="📷" iconBg="rgba(34,197,94,0.08)"
      category="utility" slug="qr-reader"
      faq={[
        { q: 'Does this upload my images?', a: 'No. Everything runs locally in your browser. Camera and image processing happen on-device.' },
        { q: 'What QR code types are supported?', a: 'URLs, text, WiFi credentials, vCards, phone numbers, email addresses, IFSC codes, and plain text.' },
      ]}
      howItWorks={[
        'Click Start Camera to use your device camera for live scanning.',
        'Or upload an image containing a QR code.',
        'Results appear instantly below — click Copy or Share to use them.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "QR Code Scanner", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/qr-reader/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Camera Controls */}
        <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">📸 Camera</h3>
            <div className="flex gap-2">
              {!cameraActive ? (
                <button onClick={startCamera}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-400 transition-all">
                  Start Camera
                </button>
              ) : (
                <button onClick={stopCamera}
                  className="px-4 py-2 rounded-xl bg-red-500 text-white font-bold text-xs hover:bg-red-400 transition-all">
                  Stop
                </button>
              )}
            </div>
          </div>

          {cameraActive && (
            <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
              <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
              <div className="absolute inset-0 border-2 border-emerald-400/30 rounded-xl pointer-events-none">
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-emerald-400 rounded-tl-lg" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-emerald-400 rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-emerald-400 rounded-br-lg" />
              </div>
            </div>
          )}

          {/* File Upload */}
          <div className="flex gap-3">
            <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/[0.06] border border-white/8 text-slate-400 text-xs font-bold cursor-pointer hover:border-white/15 transition-all">
              📁 Upload Image
              <input type="file" accept="image/*" className="hidden" onChange={e => scanFile(e.target.files?.[0])} />
            </label>
          </div>

          {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">{error}</div>}
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <div ref={resultRef} className="space-y-3" style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            {results.map((r, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/[0.05] border border-white/8 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">{r.type}</span>
                  {r.meta.from && <span className="text-[10px] text-slate-500">via {r.meta.from}</span>}
                  <span className="text-[10px] text-slate-600 ml-auto">{r.time}</span>
                </div>
                <div className="text-sm text-white font-mono break-all bg-black/20 rounded-lg px-3 py-2">{r.text}</div>
                <div className="flex gap-2">
                  <button onClick={() => copy(r.text, i)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${copying === i ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-400 hover:text-white'}`}>
                    {copying === i ? '✓ Copied' : '📋 Copy'}
                  </button>
                  <button onClick={() => share(r.text)}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-white/5 text-slate-400 hover:text-white transition-all">
                    📤 Share
                  </button>
                  {r.parsed?.href && (
                    <a href={r.parsed.href} target="_blank" rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-all">
                      🔗 Open
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📷</div>
            <p className="text-sm text-slate-600 font-medium">Start camera or upload an image to scan</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
