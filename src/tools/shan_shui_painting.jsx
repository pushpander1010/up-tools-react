import { useState, useRef, useEffect, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'
import engineHtml from './shan_shui_engine.html?raw'

const CHROME_CSS = `<style>html,body{margin:0;background:#efede6}#SETTING,#SOURCE_BTN,#L,#R{display:none!important}table{border:none!important}td{padding:0!important}</style>`

function buildDoc(seed) {
  // Inject our seed, hide the engine's own buttons/menus, and disable its
  // URL parsing (inside srcdoc, location.href is the parent page URL).
  return CHROME_CSS + engineHtml
    .split('SEED = "" + new Date().getTime();').join(`SEED = ${JSON.stringify(seed)};`)
    .split('parseArgs({').join('if(0)parseArgs({')
}

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
  const [ready, setReady] = useState(false)
  const [status, setStatus] = useState('')
  const iframeRef = useRef(null)
  const triesRef = useRef(0)
  const busyRef = useRef(false)
  const { ref: resultRef, jumpTo } = useJumpToResult()

  useEffect(() => {
    const s = seedFromUrl()
    if (s) setSeed(s)
  }, [])

  const srcDoc = useMemo(() => buildDoc(seed), [seed])

  function engineWin() {
    return iframeRef.current?.contentWindow || null
  }

  function checkReady() {
    const svg = iframeRef.current?.contentDocument?.getElementById('SVG')
    if (svg && svg.outerHTML.length > 10000) {
      setReady(true)
      attachEdgeExtend()
      return
    }
    triesRef.current += 1
    if (triesRef.current < 40) {
      setTimeout(checkReady, 500)
    } else {
      setStatus('Painting took too long — click New Painting to retry.')
    }
  }

  // When the user scrolls near either end, grow the scroll in that
  // direction so the scroll never ends. Same-origin srcdoc: allowed.
  function attachEdgeExtend() {
    const win = engineWin()
    if (!win || win.__edgeHook) return
    win.__edgeHook = true
    win.addEventListener('scroll', () => {
      if (busyRef.current) return
      try {
        const max = win.document.body.scrollWidth - win.innerWidth
        if (max < 100) return
        if (win.scrollX > max - 350) {
          busyRef.current = true
          win.xcroll(600)
          setTimeout(() => {
            try { win.scrollTo((win.document.body.scrollWidth - win.innerWidth) / 2, 0) } catch {}
            busyRef.current = false
          }, 900)
        } else if (win.scrollX < 350) {
          busyRef.current = true
          win.xcroll(-600)
          setTimeout(() => {
            try { win.scrollTo((win.document.body.scrollWidth - win.innerWidth) / 2, 0) } catch {}
            busyRef.current = false
          }, 900)
        }
      } catch {}
    })
  }

  function handleIframeLoad() {
    triesRef.current = 0
    busyRef.current = false
    setTimeout(checkReady, 800)
  }

  function travel(dir) {
    const win = engineWin()
    if (!win || !ready) return
    try {
      win.xcroll(dir * 600)
      setTimeout(() => {
        try { win.scrollTo((win.document.body.scrollWidth - win.innerWidth) / 2, 0) } catch {}
      }, 600)
    } catch {}
  }

  function handleNew() {
    setReady(false)
    setStatus('')
    triesRef.current = 0
    busyRef.current = false
    setSeed(randomSeed())
    jumpTo()
  }

  function getLiveSvg() {
    return iframeRef.current?.contentDocument?.getElementById('SVG') || null
  }

  function handleDownloadSVG() {
    const el = getLiveSvg()
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
    const el = getLiveSvg()
    if (!el) { setStatus('Painting still loading — wait a few seconds and try again.'); return }
    setStatus('Rendering PNG…')
    const clone = el.cloneNode(true)
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    const w = parseInt(clone.getAttribute('width') || '3000', 10)
    const h = parseInt(clone.getAttribute('height') || '800', 10)
    const text = new XMLSerializer().serializeToString(clone)
    const url = URL.createObjectURL(new Blob([text], { type: 'image/svg+xml' }))
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
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
      desc="Generate endless Chinese ink-wash landscape scrolls where every click paints a unique downloadable scene."
      icon="🏔️" iconBg="rgba(0,200,180,0.08)"
      category="images" slug="shan-shui-painting"
      faq={[
        { q: "What is a shan shui painting?", a: "Shan shui (mountain-water) is classical Chinese landscape art. This generator paints an endless unique scroll using math — no two scenes are ever the same." },
        { q: "How do I travel through the painting?", a: "Drag sideways inside the frame, or use the arrow buttons. New mountains, water and trees are painted automatically as you reach either end — the scroll never runs out." },
        { q: "How do I download my painting?", a: "Click SVG for a tiny infinitely-scalable vector file, or PNG for an image you can share anywhere. Both are free with no sign-up." },
        { q: "Can I share a painting with someone?", a: "Yes — Copy Link saves this exact painting's seed. Anyone opening the link sees the identical scroll." },
        { q: "Is this free?", a: "Yes, completely free with no sign-up. Generate and download unlimited paintings. The engine is MIT-licensed open source by LingDong-." },
      ]}
      howItWorks={[
        "A fresh landscape scroll is painted automatically when the page loads.",
        "Drag sideways or press the arrows to travel — new scenery generates as you reach either end.",
        "Click New Painting for a brand-new unique scroll.",
        "Download the current scene as SVG (vector) or PNG (image), or copy the link to share it.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Shan Shui Painting Generator", "applicationCategory": "DesignApplication",
        "operatingSystem": "WebBrowser",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div ref={resultRef} className="rounded-2xl overflow-hidden border-2 border-white/8 bg-[#efede6] relative">
          {!ready && (
            <div className="flex items-center justify-center py-20">
              <p className="text-sm text-slate-500 font-medium">🏔️ Painting your scroll…</p>
            </div>
          )}
          <iframe
            ref={iframeRef}
            key={seed}
            srcDoc={srcDoc}
            title="Endless shan shui painting — drag sideways to travel"
            onLoad={handleIframeLoad}
            className="w-full block"
            style={{ height: ready ? '56vh' : 0, minHeight: ready ? 380 : 0, border: 'none', background: '#efede6' }}
          />
          {ready && (
            <>
              <button onClick={() => travel(-1)} aria-label="Travel left"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 text-white text-xl font-bold hover:bg-black/80 transition-all active:scale-95">‹</button>
              <button onClick={() => travel(1)} aria-label="Travel right"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 text-white text-xl font-bold hover:bg-black/80 transition-all active:scale-95">›</button>
            </>
          )}
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
