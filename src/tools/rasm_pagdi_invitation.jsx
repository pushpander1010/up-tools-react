import { useState, useCallback, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

function transliterate(text) {
  text = text.toLowerCase()
  const CONS = [
    ['shri', 'श्री'], ['ksh', 'क्ष'], ['gya', 'ज्ञ'], ['jnya', 'ज्ञ'],
    ['chh', 'छ'], ['kh', 'ख'], ['gh', 'घ'], ['ch', 'च'], ['jh', 'झ'],
    ['th', 'थ'], ['dh', 'ध'], ['ph', 'फ'], ['bh', 'भ'], ['sh', 'श'],
    ['ny', 'ञ'], ['ng', 'ङ'], ['tr', 'त्र'], ['pr', 'प्र'],
    ['k', 'क'], ['g', 'ग'], ['c', 'च'], ['j', 'ज'], ['t', 'त'], ['d', 'द'],
    ['n', 'न'], ['p', 'प'], ['b', 'ब'], ['m', 'म'], ['y', 'य'], ['r', 'र'],
    ['l', 'ल'], ['v', 'व'], ['w', 'व'], ['f', 'फ़'], ['s', 'स'], ['h', 'ह'],
    ['z', 'ज़'], ['q', 'क'], ['x', 'क्स'],
  ]
  const VOWS = [
    ['aa', 'आ', 'ा'], ['ai', 'ऐ', 'ै'], ['ae', 'ऐ', 'ै'],
    ['au', 'औ', 'ौ'], ['ou', 'औ', 'ौ'], ['ow', 'औ', 'ौ'],
    ['ee', 'ई', 'ी'], ['ii', 'ई', 'ी'], ['oo', 'ऊ', 'ू'], ['uu', 'ऊ', 'ू'],
    ['ri', 'ऋ', 'ृ'], ['oa', 'ओ', 'ो'],
    ['a', 'अ', ''], ['e', 'ए', 'े'], ['i', 'इ', 'ि'], ['u', 'उ', 'ु'], ['o', 'ओ', 'ो'],
  ]
  const VIRAMA = '्'
  let result = ''
  let i = 0
  let afterCons = false
  while (i < text.length) {
    const ch = text[i]
    if (!/[a-z]/.test(ch)) { afterCons = false; result += ch; i++; continue }
    let best = null, bestLen = 0, bestType = null
    for (const [rom, dev] of CONS) {
      if (text.startsWith(rom, i) && rom.length > bestLen) { best = dev; bestLen = rom.length; bestType = 'C' }
    }
    for (const [rom, sa, ma] of VOWS) {
      if (text.startsWith(rom, i) && rom.length > bestLen) { best = [sa, ma]; bestLen = rom.length; bestType = 'V' }
    }
    if (bestType === 'C') { if (afterCons) result += VIRAMA; result += best; i += bestLen; afterCons = true }
    else if (bestType === 'V') { const [sa, ma] = best; result += afterCons ? ma : sa; i += bestLen; afterCons = false }
    else { result += ch; i++; afterCons = false }
  }
  return result
}

const HEADERS = [
  '॥ In Loving Memory ॥',
  '॥ With Heavy Hearts ॥',
  '॥ Shradhanjali ॥',
]

const MSGS = [
  'With profound grief we inform you of the sad demise of our beloved. Rasm Pagdi ceremony will be held as per programme below. Kindly grace the occasion and pray for the departed soul.',
  'With a heavy heart we share that our beloved has left for heavenly abode. Please join us for the Rasm Pagdi to offer prayers for peace to the departed soul.',
  'In loving memory of our beloved. We request your gracious presence at the Rasm Pagdi ceremony to join us in prayers.',
]

const THEMES = [
  { id: 'classic', label: 'Classic Gold', bg1: '#fbf6ea', bg2: '#f0e2c4', accent: '#8a5a00', text: '#3d2c10', sub: '#6b5320', dark: false },
  { id: 'serene', label: 'Warm Golden', bg1: '#faf0d7', bg2: '#ecd3a0', accent: '#8a5a00', text: '#4a3208', sub: '#7a5c1a', dark: false },
  { id: 'maroon', label: 'Royal Maroon', bg1: '#4a0e0e', bg2: '#2a0808', accent: '#e8b64c', text: '#f5e9d0', sub: '#c9a86a', dark: true },
  { id: 'saffron', label: 'Saffron Dawn', bg1: '#fff8ef', bg2: '#fbe3bd', accent: '#b45309', text: '#5a3200', sub: '#8a5a1a', dark: false },
  { id: 'slate', label: 'Slate Serene', bg1: '#f5f7f9', bg2: '#dde5ec', accent: '#3f5468', text: '#22303d', sub: '#55697c', dark: false },
  { id: 'bark', label: 'Deep Brown', bg1: '#3d2c17', bg2: '#201304', accent: '#e8b64c', text: '#f3e6cb', sub: '#c9a86a', dark: true },
]

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ')
  const lines = []
  let line = ''
  words.forEach(word => {
    const test = line + word + ' '
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line.trim())
      line = word + ' '
    } else {
      line = test
    }
  })
  if (line.trim()) lines.push(line.trim())
  return lines
}

function drawCard(canvas, d, themeId, headerIdx, msgIdx) {
  const ctx = canvas.getContext('2d')
  const W = 1080, H = 1890
  canvas.width = W; canvas.height = H
  const theme = THEMES.find(t => t.id === themeId) || THEMES[0]
  const header = HEADERS[headerIdx] || HEADERS[0]
  const msg = d.customMsg.trim() || MSGS[msgIdx]

  const bg = ctx.createLinearGradient(0, 0, 0, H)
  bg.addColorStop(0, theme.bg1)
  bg.addColorStop(1, theme.bg2)
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // Double border
  ctx.strokeStyle = theme.accent
  ctx.lineWidth = 5
  ctx.strokeRect(36, 36, W - 72, H - 72)
  ctx.lineWidth = 1.5
  ctx.strokeRect(52, 52, W - 104, H - 104)

  // Corner motifs
  ctx.fillStyle = theme.accent
  ;[[70, 70], [W - 70, 70], [70, H - 70], [W - 70, H - 70]].forEach(([cx, cy]) => {
    ctx.beginPath()
    ctx.arc(cx, cy, 10, 0, Math.PI * 2)
    ctx.fill()
  })

  ctx.textAlign = 'center'
  let y = 230

  // Om / Ik Onkar mark
  ctx.fillStyle = theme.accent
  ctx.font = 'bold 100px Georgia,"Nirmala UI","Noto Sans Devanagari",serif'
  ctx.fillText('ॐ', W / 2, y)
  y += 95

  ctx.font = 'bold 44px Georgia,"Nirmala UI","Noto Sans Devanagari",serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  const hw = ctx.measureText(header).width
  ctx.fillText(header, (W - hw) / 2, y)
  ctx.textAlign = 'center'
  y += 30
  ctx.fillRect(W / 2 - 120, y, 240, 2)
  y += 70

  // Deceased name
  ctx.fillStyle = theme.text
  ctx.font = 'bold 62px Georgia,"Nirmala UI","Noto Sans Devanagari",serif'
  const nameLines = wrapText(ctx, d.deceased || 'Late Name', W - 220)
  nameLines.slice(0, 2).forEach(l => { ctx.fillText(l, W / 2, y); y += 72 })
  y += 10

  if (d.demise) {
    ctx.fillStyle = theme.sub
    ctx.font = 'italic 32px Georgia,"Nirmala UI","Noto Sans Devanagari",serif'
    ctx.fillText(`Left for heavenly abode: ${d.demise}`, W / 2, y)
    y += 60
  }

  // Message
  ctx.fillStyle = theme.text
  ctx.font = '30px Georgia,"Nirmala UI","Noto Sans Devanagari",serif'
  const msgLines = wrapText(ctx, msg, W - 220)
  msgLines.slice(0, 8).forEach(l => { ctx.fillText(l, W / 2, y); y += 46 })
  y += 40

  // Programme box
  ctx.fillStyle = theme.dark ? 'rgba(232,182,76,0.08)' : 'rgba(138,90,0,0.06)'
  const boxY = y
  ctx.fillRect(110, boxY, W - 220, 380)
  ctx.strokeStyle = theme.accent
  ctx.lineWidth = 2
  ctx.strokeRect(110, boxY, W - 220, 380)
  y = boxY + 66
  ctx.fillStyle = theme.accent
  ctx.font = 'bold 34px Georgia,"Nirmala UI","Noto Sans Devanagari",serif'
  ctx.fillText('RASM PAGDI', W / 2, y)
  y += 52
  ctx.fillStyle = theme.text
  ctx.font = '32px Georgia,"Nirmala UI","Noto Sans Devanagari",serif'
  if (d.date) { ctx.fillText(`Date: ${d.date}`, W / 2, y); y += 48 }
  if (d.time) { ctx.fillText(`Time: ${d.time}`, W / 2, y); y += 48 }
  if (d.venue) {
    const vLines = wrapText(ctx, `Venue: ${d.venue}`, W - 300)
    vLines.slice(0, 2).forEach(l => { ctx.fillText(l, W / 2, y); y += 46 })
  }
  y = boxY + 380 + 70

  // Family
  if (d.family) {
    ctx.fillStyle = theme.sub
    ctx.font = 'italic 30px Georgia,"Nirmala UI","Noto Sans Devanagari",serif'
    const fLines = wrapText(ctx, `— ${d.family}`, W - 220)
    fLines.slice(0, 3).forEach(l => { ctx.fillText(l, W / 2, y); y += 44 })
    y += 10
  }
  if (d.phone) {
    ctx.fillStyle = theme.sub
    ctx.font = '30px Georgia,"Nirmala UI","Noto Sans Devanagari",serif'
    ctx.fillText(`Contact: ${d.phone}`, W / 2, y)
    y += 50
  }

  // (no watermark — clean personal invitation)
}

export default function rasm_pagdi_invitation() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const canvasRef = useRef(null)
  const [d, setD] = useState({ deceased: '', demise: '', date: '', time: '', venue: '', family: '', phone: '', customMsg: '' })
  const [themeId, setThemeId] = useState('classic')
  const [headerIdx, setHeaderIdx] = useState(0)
  const [msgIdx, setMsgIdx] = useState(0)
  const [rendered, setRendered] = useState(false)
  const [pdfBusy, setPdfBusy] = useState(false)

  const set = (k) => (e) => { setD(prev => ({ ...prev, [k]: e.target.value })); setRendered(false) }

  const handleHindi = () => {
    setD(prev => ({
      ...prev,
      deceased: transliterate(prev.deceased),
      venue: transliterate(prev.venue),
      family: transliterate(prev.family),
      customMsg: transliterate(prev.customMsg),
    }))
    setRendered(false)
  }

  const handleRender = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawCard(canvas, d, themeId, headerIdx, msgIdx)
    setRendered(true)
    jumpTo()
  }, [d, themeId, headerIdx, msgIdx, jumpTo])

  const handlePNG = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'rasm-pagdi-invitation.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const handlePDF = async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    setPdfBusy(true)
    try {
      const { PDFDocument } = await import('https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm')
      const pngBytes = await (await fetch(canvas.toDataURL('image/png'))).arrayBuffer()
      const pdf = await PDFDocument.create()
      const img = await pdf.embedPng(pngBytes)
      const pageW = 595, pageH = (595 / img.width) * img.height
      const page = pdf.addPage([pageW, Math.min(pageH, 842)])
      page.drawImage(img, { x: 0, y: 0, width: pageW, height: Math.min(pageH, 842) })
      const bytes = await pdf.save()
      const blob = new Blob([bytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = 'rasm-pagdi-invitation.pdf'
      link.href = url
      link.click()
      URL.revokeObjectURL(url)
    } finally {
      setPdfBusy(false)
    }
  }

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
    `Rasm Pagdi Invitation\n\nIn memory of: ${d.deceased || '(name)'}\nDate: ${d.date || '-'}\nTime: ${d.time || '-'}\nVenue: ${d.venue || '-'}\n\nKindly join us in prayers.${d.phone ? ' Contact: ' + d.phone : ''}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"
  const labelClass = "block text-sm font-bold text-slate-400 mb-2"

  return (
    <ToolLayout
      title="Rasm Pagdi Invitation Maker"
      desc="Make a respectful Rasm Pagdi invitation card free — fill details, pick a format, download image or PDF, share on WhatsApp."
      icon="🪔" iconBg="rgba(232,182,76,0.08)"
      category="india" slug="rasm-pagdi-invitation"
      faq={[
        { q: "How do I make a Rasm Pagdi invitation?", a: "Fill in the name of the departed, ceremony date, time and venue, pick one of 6 respectful formats, then click Create Invitation. Download the card as a free PNG image or PDF." },
        { q: "Is this Rasm Pagdi card maker free?", a: "Yes, completely free with no sign-up. Unlimited cards, free image and PDF download." },
        { q: "What formats are available?", a: "Six respectful canvas-drawn formats: Classic Gold, Warm Golden, Royal Maroon, Saffron Dawn, Slate Serene, and Deep Brown. Each includes header line, message, and a Rasm Pagdi programme box." },
        { q: "Can I make the card in Hindi?", a: "Yes — type names and address in English, tap 'English → Hindi (देवनागरी)', and the card is drawn in Hindi script. Works fully offline. Tip: use aa, ee, oo for long vowels — raam becomes राम, seeta becomes सीता." },
        { q: "Can I share the invitation on WhatsApp?", a: "Yes — after creating the card, use Share on WhatsApp to send the ceremony details, or download the image/PDF and forward it directly." },
      ]}
      howItWorks={[
        "Enter details: name of departed, demise date, ceremony date, time, venue, family and contact. Use English → Hindi for a Devanagari card.",
        "Choose a header line, message preset (or write your own), and one of 6 formats.",
        "Click Create Invitation to render the card.",
        "Download free PNG image or PDF, or share details on WhatsApp.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Rasm Pagdi Invitation Maker", "applicationCategory": "DesignApplication",
        "operatingSystem": "WebBrowser",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Name of Departed *</label>
            <input type="text" value={d.deceased} onChange={set('deceased')} placeholder="e.g. Late Shri Ram Lal Sharma" className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Demise Date</label>
              <input type="text" value={d.demise} onChange={set('demise')} placeholder="e.g. 5 Oct 2026" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Ceremony Date *</label>
              <input type="text" value={d.date} onChange={set('date')} placeholder="e.g. 14 Oct 2026" className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Time</label>
              <input type="text" value={d.time} onChange={set('time')} placeholder="e.g. 12 PM onwards" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Contact Phone</label>
              <input type="text" value={d.phone} onChange={set('phone')} placeholder="e.g. 98XXXXXXXX" className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Venue / Address *</label>
            <input type="text" value={d.venue} onChange={set('venue')} placeholder="e.g. Village Hall, Main Road, Karnal" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Family / Host Names</label>
            <input type="text" value={d.family} onChange={set('family')} placeholder="e.g. Sharma Family — sons Rajesh & Suresh" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Header Line</label>
            <select value={headerIdx} onChange={(e) => { setHeaderIdx(parseInt(e.target.value)); setRendered(false) }} className={inputClass}>
              {HEADERS.map((h, i) => (<option key={i} value={i}>{h}</option>))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Message</label>
            <select value={msgIdx} onChange={(e) => { setMsgIdx(parseInt(e.target.value)); setRendered(false) }} className={inputClass}>
              {MSGS.map((m, i) => (<option key={i} value={i}>Format {i + 1} — {m.slice(0, 48)}…</option>))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Custom Message (optional, overrides preset)</label>
            <input type="text" value={d.customMsg} onChange={set('customMsg')} placeholder="Write your own message…" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Format</label>
            <div className="grid grid-cols-3 gap-3">
              {THEMES.map(t => (
                <button key={t.id} onClick={() => { setThemeId(t.id); setRendered(false) }}
                  className={`py-3 rounded-xl border-2 text-sm font-bold transition-all ${themeId === t.id ? 'border-indigo-500 bg-indigo-500/10 text-white' : 'border-white/8 bg-white/[0.03] text-slate-400 hover:border-white/15'}`}
                  style={{ background: themeId === t.id ? undefined : `linear-gradient(135deg, ${t.bg1}, ${t.bg2})`, color: themeId === t.id ? undefined : t.text }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={handleHindi}
          className="w-full py-3 rounded-2xl border-2 border-orange-500/50 text-orange-300 font-bold text-sm hover:bg-orange-500/10 transition-all duration-200 active:scale-[0.98]">
          अ English → Hindi (देवनागरी)
        </button>

        <button onClick={handleRender}
          className="w-full py-4 rounded-2xl bg-amber-500 text-white font-bold text-sm hover:bg-amber-400 transition-all duration-200 active:scale-[0.98]">
          🪔 Create Invitation
        </button>

        <div ref={resultRef}>
          <canvas ref={canvasRef} className="w-full rounded-2xl border-2 border-white/8" style={{ display: rendered ? 'block' : 'none' }} />
        </div>

        {rendered && (
          <div className="flex gap-3 flex-wrap">
            <button onClick={handlePNG} className="flex-1 min-w-[140px] py-3 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-500 transition-all">⬇ Image (PNG)</button>
            <button onClick={handlePDF} disabled={pdfBusy} className="flex-1 min-w-[140px] py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-500 transition-all disabled:opacity-50">{pdfBusy ? 'Making PDF…' : '⬇ PDF (Free)'}</button>
            <button onClick={handleWhatsApp} className="flex-1 min-w-[140px] py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-500 transition-all">📲 WhatsApp</button>
          </div>
        )}

        {!rendered && (
          <div className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🪔</div>
            <p className="text-sm text-slate-600 font-medium">Fill details and click Create Invitation</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
