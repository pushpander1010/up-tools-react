import { useState, useRef, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const ENGINE = '/shan-shui-painting/engine.html'

function seedFromUrl() {
  try {
    const m = window.location.search.match(/seed=([^&]+)/)
    return m ? decodeURIComponent(m[1]) : null
  } catch { return null }
}

function randomSeed() {
  return String(Date.now())
}

export default function ShanShuiPainting() {
  const [seed, setSeed] = useState(() => seedFromUrl() || randomSeed())
  const [status, setStatus] = useState('')
  const iframeRef = useRef(null)
  const { ref: resultRef, jumpTo } = useJumpToResult()

  useEffect(() => {
    const s = seedFromUrl()
    if (s) setSeed(s)
  }, [])

  const src = `${ENGINE}?seed=${encodeURIComponent(seed)}`

  function getSvgEl() {
    const doc = iframeRef.current?.contentDocument
    if (!doc) return null
    return doc.getElementById('SVG')
  }

  function handleNew() {
    setSeed(randomSeed())
    setStatus('')
    jumpTo()
  }

  function handleDownloadSVG() {
    const el = getSvgEl()
    if (!el) { setStatus('Painting still loading — wait a few seconds and try again.'); return }
    const text = new XMLSerializer().serializeToString(el)
    const blob = new Blob([text], { type: 'image/svg+xml' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `shan-shui-${seed}.svg`
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 5000)
    setStatus('SVG downloaded — infinitely scalable, tiny file.')
  }

  function handleDownloadPNG() {
    const el = getSvgEl()
    if (!el) { setStatus('Painting still loading — wait a few seconds and try again.'); return }
    setStatus('Rendering PNG…')
    const clone = el.cloneNode(true)
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    const w = parseInt(clone.getAttribute('width') || '1600', 10)
    const h = parseInt(clone.getAttribute('height') || '800', 10)
    const text = new XMLSerializer().serializeToString(clone)
    const url = URL.createObjectURL(new Blob([text], { type: 'image/svg+xml' }))
    const img = new Image()
    img.onload = () => {
      const scale = 2
      const canvas = document.createElement('canvas')
      canvas.width = w * scale
      canvas.height = h * scale
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#efede6'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      canvas.toBlob((blob) => {
        if (!blob) { setStatus('PNG render failed in this browser — SVG download works everywhere.'); return }
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = `shan-shui-${seed}.png`
        a.click()
        setTimeout(() => URL.revokeObjectURL(a.href), 5000)
        setStatus('PNG downloaded.')
      }, 'image/png')
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      setStatus('PNG render failed in this browser — SVG download works everywhere.')
    }
    img.src = url
  }

  function handleCopyLink() {
    const url = `${window.location.origin}/shan-shui-painting/?seed=${encodeURIComponent(seed)}`
    navigator.clipboard?.writeText(url).then(
      () => setStatus('Link copied — anyone opening it sees this exact painting.'),
      () => setStatus(url)
    )
  }

  return (
    <ToolLayout
      title="Shan Shui Painting Generator"
      desc="Generate endless Chinese ink-wash landscape scrolls — every click paints a unique mountains-and-water scene you can download as SVG or PNG."
      icon="🏔️" iconBg="rgba(0,200,180,0.08)"
      category="images" slug="shan-shui-painting"
      faq={[
        { q: "What is a shan shui painting?", a: "Shan shui (mountain-water) is classical Chinese landscape art. This generator paints a new unique scroll on every click using math — no two paintings are ever the same." },
        { q: "How do I download my painting?", a: "Click Download SVG for a tiny infinitely-scalable vector file, or Download PNG for a 2x image you can share anywhere. Both are free with no sign-up." },
        { q: "Can I share a painting with someone?", a: "Yes — Copy Link saves this exact painting's seed. Anyone opening the link sees the identical scroll." },
        { q: "Is this free?", a: "Yes, completely free with no sign-up. Generate and download unlimited paintings. The engine is MIT-licensed open source by LingDong-." },
      ]}
      howItWorks={[
        "The generator paints a fresh landscape scroll automatically when the page loads.",
        "Scroll sideways inside the frame to travel through the painting.",
        "Click New Painting for a brand-new unique scroll.",
        "Download it as SVG (vector) or PNG (image), or copy the link to share this exact scene.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Shan Shui Painting Generator", "applicationCategory": "DesignApplication",
        "operatingSystem": "WebBrowser",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div ref={resultRef} className="rounded-2xl overflow-hidden border-2 border-white/8 bg-[#efede6]">
          <iframe
            ref={iframeRef}
            key={seed}
            src={src}
            title="Shan shui generative painting"
            className="w-full block"
            style={{ height: '52vh', minHeight: 340, border: 'none' }}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button onClick={handleNew}
            className="py-3 rounded-xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-500 transition-all active:scale-[0.98]">
            🎲 New Painting
          </button>
          <button onClick={handleDownloadSVG}
            className="py-3 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-500 transition-all active:scale-[0.98]">
            ⬇ SVG
          </button>
          <button onClick={handleDownloadPNG}
            className="py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-500 transition-all active:scale-[0.98]">
            🖼 PNG
          </button>
          <button onClick={handleCopyLink}
            className="py-3 rounded-xl bg-white/[0.06] border-2 border-white/8 text-white font-bold text-sm hover:border-white/15 transition-all active:scale-[0.98]">
            🔗 Copy Link
          </button>
        </div>

        {status && (
          <p className="text-sm text-slate-400 font-medium text-center">{status}</p>
        )}
        <p className="text-xs text-slate-600 text-center">Seed: {seed} · Same seed = same painting · Engine: MIT-licensed shan-shui-inf by LingDong-</p>
      </div>
    </ToolLayout>
  )
}
