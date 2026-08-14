import { useState, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const STATUSES = [
  { text: 'Happy Independence Day 🇮🇳 Jai Hind! 🇮🇳', tag: 'Short' },
  { text: 'Freedom in mind, faith in words, pride in our hearts. Happy Independence Day! 🇮🇳', tag: 'Inspirational' },
  { text: 'Sare Jahan Se Achha, Hindustan Hamara. Jai Hind! 🇮🇳', tag: 'Patriotic' },
  { text: 'Proud to be an Indian. Happy 78th Independence Day! 🇮🇳', tag: 'Short' },
  { text: '🇮🇳 The best way to find yourself is to lose yourself in the service of others — Mahatma Gandhi. Happy Independence Day!', tag: 'Quote' },
  { text: 'Freedom is never dear at any price. It is the breath of life. Happy Independence Day! 🇮🇳', tag: 'Quote' },
  { text: 'Azadi ka Amrit Mahotsav vibes! Saluting our freedom fighters today and every day. Jai Hind! 🇮🇳', tag: 'Patriotic' },
  { text: '🇮🇳 Happy Independence Day! Let freedom ring, let the tricolor fly high. 🧡🤍💚', tag: 'Short' },
  { text: 'We owe our freedom to the brave hearts who dreamt of an independent India. Respect & gratitude. 🇮🇳', tag: 'Inspirational' },
  { text: 'One nation, one vision, one pride. Happy Independence Day! Jai Hind! 🇮🇳', tag: 'Short' },
  { text: '🇮🇳 Let us remember the golden heritage of our country and feel proud of its rich culture. Happy Independence Day!', tag: 'Inspirational' },
  { text: 'My heart is Indian, my soul is Indian, and my pride is Indian. Happy Independence Day! 🇮🇳', tag: 'Patriotic' },
  { text: 'They gave us a free India. Let us give them a developed India. Jai Hind! 🇮🇳', tag: 'Quote' },
  { text: '🇮🇳 78 years of freedom, 78 years of pride. Salute to our heroes! 🧡🤍💚', tag: 'Patriotic' },
  { text: 'Where the mind is without fear and the head is held high — Tagore. Happy Independence Day! 🇮🇳', tag: 'Quote' },
  { text: 'Salute to the martyrs who laid down their lives for our freedom. 🇮🇳 Jai Hind!', tag: 'Patriotic' },
  { text: 'Happy Independence Day! May the tricolor always fly high in the sky of freedom. 🇮🇳', tag: 'Short' },
  { text: 'Freedom is the open window through which pours the sunlight of the human spirit. 🇮🇳', tag: 'Quote' },
  { text: 'Proud, patriotic, and free. Wishing you all a very Happy Independence Day! 🇮🇳', tag: 'Short' },
  { text: '🇮🇳 The land of unity in diversity. Celebrating 78 years of independence! 🧡🤍💚 Jai Hind!', tag: 'Patriotic' },
]

const TAG_COLORS = {
  'Short': 'text-cyan-400',
  'Inspirational': 'text-amber-400',
  'Patriotic': 'text-emerald-400',
  'Quote': 'text-purple-400',
}

export default function independence_day_status_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [current, setCurrent] = useState(0)
  const [copied, setCopied] = useState(false)
  const [img, setImg] = useState(null)
  const [frame, setFrame] = useState('tricolor') // tricolor | saffron | none
  const [downloadUrl, setDownloadUrl] = useState(null)
  const fileRef = useRef(null)
  const imgCanvasRef = useRef(null)

  const randomize = () => {
    setCopied(false)
    setCurrent(i => {
      let n = Math.floor(Math.random() * STATUSES.length)
      if (n === i) n = (n + 1) % STATUSES.length
      return n
    })
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(STATUSES[current].text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (e) {
      const ta = document.createElement('textarea')
      ta.value = STATUSES[current].text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  const onUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImg(reader.result)
    reader.readAsDataURL(file)
    setDownloadUrl(null)
  }

  const drawFramed = (onDone) => {
    if (!img) return
    const cvs = imgCanvasRef.current
    const temp = new Image()
    temp.onload = () => {
      const W = 720
      // preserve aspect ratio, add space at top for a tricolor header
      const H = Math.round(W * (temp.height / temp.width))
      cvs.width = W
      cvs.height = H
      const ctx = cvs.getContext('2d')
      ctx.drawImage(temp, 0, 0, W, H)

      if (frame !== 'none') {
        const bandH = Math.max(12, Math.round(W * 0.04))
        if (frame === 'tricolor') {
          ctx.fillStyle = '#FF9933'
          ctx.fillRect(0, 0, W, bandH)
          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(0, bandH, W, bandH)
          ctx.fillStyle = '#138808'
          ctx.fillRect(0, bandH * 2, W, bandH)
        } else if (frame === 'saffron') {
          ctx.fillStyle = '#FF9933'
          ctx.fillRect(0, 0, W, bandH)
        }
      }
      const url = cvs.toDataURL('image/png')
      setDownloadUrl(url)
      if (onDone) onDone(url)
    }
    temp.src = img
  }

  const downloadImg = () => {
    jumpTo()
    if (downloadUrl) {
      const link = document.createElement('a')
      link.download = 'tricolor-frame.png'
      link.href = downloadUrl
      link.click()
      return
    }
    drawFramed((url) => {
      const link = document.createElement('a')
      link.download = 'tricolor-frame.png'
      link.href = url
      link.click()
    })
  }

  const s = STATUSES[current]

  return (
    <ToolLayout
      title="Independence Day Status Generator"
      desc="Get ready-to-share Happy Independence Day statuses and captions for WhatsApp, Instagram and Facebook — plus add a tricolor frame to your own photo. Jai Hind! 🇮🇳"
      icon="🧡" iconBg="rgba(255,153,51,0.10)"
      category="text" slug="independence-day-status-generator"
      faq={[
        { q: 'What is the Independence Day Status Generator?', a: 'A free tool that gives you ready-made patriotic statuses and captions for WhatsApp, Instagram, and Facebook, and lets you add a tricolor frame to your own photo.' },
        { q: 'Can I use my own photo?', a: 'Yes — upload any photo and add a tricolor or saffron strip frame, then download it as a PNG.' },
        { q: 'Is it free?', a: 'Yes, everything on this page is completely free with no sign-up.' },
      ]}
      howItWorks={[
        'Click "New Status" to cycle through patriotic statuses and captions.',
        'Copy the text straight to WhatsApp, Instagram, or Facebook.',
        'Optionally upload your own photo and add a tricolor frame, then download it.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Independence Day Status Generator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/independence-day-status-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Status generator */}
        <div ref={resultRef} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Patriotic Status / Caption</h3>
          <div className="rounded-xl bg-black/30 border border-white/[0.06] p-5 min-h-[90px] flex items-center">
            <p className="text-lg text-white font-medium leading-relaxed">{s.text}</p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] ${TAG_COLORS[s.tag] || 'text-slate-300'}`}>{s.tag}</span>
            <span className="text-xs text-slate-500 font-semibold">#{current + 1} / {STATUSES.length}</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={randomize} className="px-5 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg text-sm">
              🎲 New Status
            </button>
            <button onClick={copy} className="px-5 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 transition-all shadow-lg text-sm">
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
          </div>
        </div>

        {/* Own image tricolor frame */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Add Tricolor Frame to Your Photo</h3>
          <input ref={fileRef} type="file" accept="image/*" onChange={onUpload} className="hidden" />
          <button onClick={() => fileRef.current?.click()}
            className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 transition-all shadow-lg text-sm">
            📷 Upload Your Photo
          </button>

          {img && (
            <>
              <div className="flex flex-wrap gap-2">
                {[['tricolor', '🇮🇳 Tricolor'], ['saffron', '🧡 Saffron'], ['none', 'No Frame']].map(([v, label]) => (
                  <button key={v} onClick={() => { setFrame(v); setDownloadUrl(null) }}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${frame === v ? 'bg-indigo-600 text-white' : 'bg-white/[0.06] text-slate-300 hover:bg-white/[0.12] border border-white/[0.08]'}`}>
                    {label}
                  </button>
                ))}
              </div>
              <div className="rounded-xl overflow-hidden border border-white/[0.08]">
                <img src={img} alt="Your upload" className="w-full h-auto" />
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => { jumpTo(); drawFramed() }} className="px-5 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg text-sm">
                  ✨ Apply Frame
                </button>
                <button onClick={downloadImg} className="px-5 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 transition-all shadow-lg text-sm">
                  ⬇ Download
                </button>
              </div>
            </>
          )}
        </div>

        <canvas ref={imgCanvasRef} className="hidden" />
      </div>
    </ToolLayout>
  )
}
