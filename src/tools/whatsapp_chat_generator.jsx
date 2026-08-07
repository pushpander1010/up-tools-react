import { useRef, useState, useCallback, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const CW = 480                 // canvas width (iPhone-ish)
const HDR = 64                 // header height
const INP = 60                 // input bar height
const PAD = 12                 // side padding
const BUBBLE_R = 10            // bubble corner radius
const MAX_TXT_W = 300          // max text width inside bubble
const FONT = '15px -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'

let idc = 0
const nid = () => `m${++idc}`

export default function whatsapp_chat_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const canvasRef = useRef(null)
  const fileRef = useRef(null)
  const avFileRef = useRef(null)

  const [contactName, setContactName] = useState('Rahul Sharma')
  const [contactAvatar, setContactAvatar] = useState('')
  const [myAvatar, setMyAvatar] = useState('')
  const [bgImage, setBgImage] = useState('')
  const [theme, setTheme] = useState('classic')   // classic | dark | light
  const [msgText, setMsgText] = useState('')
  const [msgSide, setMsgSide] = useState('me')
  const [messages, setMessages] = useState([
    { id: nid(), text: 'Hey! How are you doing?', time: '10:24', side: 'them' },
    { id: nid(), text: 'I am good! Just testing this new WhatsApp chat generator 🎉', time: '10:26', side: 'me' },
    { id: nid(), text: 'Wow, that looks exactly like real WhatsApp 😄', time: '10:27', side: 'them' },
    { id: nid(), text: 'I know right!! Check it out at uptools.in', time: '10:29', side: 'me' },
  ])

  const THEMES = {
    classic: { header: '#075e54', headerText: '#ffffff', sub: '#99e0c0', bg: '#e5ddd5', mine: '#dcf8c6', theirs: '#ffffff', time: '#8b9298', ticks: '#4fc3f7', text: '#111111' },
    dark:   { header: '#1f2c34', headerText: '#e9edef', sub: '#a6b6bf', bg: '#0b141a', mine: '#005c4b', theirs: '#202c33', time: 'rgba(255,255,255,0.5)', ticks: '#53bdeb', text: '#e9edef' },
    light:  { header: '#008069', headerText: '#ffffff', sub: '#b3d9cf', bg: '#f0f2f5', mine: '#d9fdd3', theirs: '#ffffff', time: '#8b9298', ticks: '#53bdeb', text: '#111111' },
  }

  const themeC = THEMES[theme]

  // ---- file helpers ----
  const readFile = (e, setter) => {
    const f = e.target.files && e.target.files[0]
    if (!f) return
    const r = new FileReader()
    r.onload = () => setter(r.result)
    r.readAsDataURL(f)
  }
  const defaultAvatar = (name, s = 40) => {
    const c = document.createElement('canvas'); c.width = s; c.height = s
    const x = c.getContext('2d')
    const colors = ['#7e57c2','#26a69a','#ef5350','#5c6bc0','#ff7043','#8d6e63','#66bb6a']
    x.fillStyle = colors[(name.charCodeAt(0) || 0) % colors.length]
    x.beginPath(); x.arc(s/2, s/2, s/2, 0, Math.PI*2); x.fill()
    x.fillStyle = '#fff'; x.font = `600 ${Math.round(s*0.42)}px sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle'
    x.fillText((name.trim()[0] || '?').toUpperCase(), s/2, s/2 + 1)
    return c.toDataURL()
  }

  const addMsg = () => {
    const t = msgText.trim()
    if (!t) return
    const now = new Date()
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setMessages(m => [...m, { id: nid(), text: t, time, side: msgSide }])
    setMsgText('')
  }
  const removeMsg = (id) => setMessages(m => m.filter(x => x.id !== id))

  // ---- canvas drawing ----
  const wrap = (ctx, text, maxW) => {
    const words = text.split(/\s+/); const lines = []; let cur = ''
    for (const w of words) {
      const test = cur ? cur + ' ' + w : w
      if (ctx.measureText(test).width <= maxW) cur = test
      else { if (cur) lines.push(cur); cur = w }
    }
    if (cur) lines.push(cur)
    return lines
  }
  const roundRect = (ctx, x, y, w, h, r) => {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.arcTo(x + w, y, x + w, y + h, r)
    ctx.arcTo(x + w, y + h, x, y + h, r)
    ctx.arcTo(x, y + h, x, y, r)
    ctx.arcTo(x, y, x + w, y, r)
    ctx.closePath()
  }

  const render = useCallback(() => {
    const cv = canvasRef.current; if (!cv) return
    const ctx = cv.getContext('2d')
    ctx.font = FONT
    ctx.textBaseline = 'middle'

    // compute content height
    const lineH = 21, bubblePadX = 12, bubblePadY = 8, rowGap = 12
    let bodyH = HDR + PAD
    for (const m of messages) {
      const lines = wrap(ctx, m.text, MAX_TXT_W)
      const bubbleH = lines.length * lineH + bubblePadY * 2 + 18 // + time row
      bodyH += bubbleH + rowGap
    }
    bodyH += PAD
    const H = bodyH + INP
    cv.height = H

    // background
    ctx.fillStyle = themeC.bg
    ctx.fillRect(0, 0, CW, H)
    if (bgImage) {
      const img = new Image(); img.onload = () => { drawWithBg(img) }; img.src = bgImage
      return
    }
    drawHeader(ctx)
    drawMessages(ctx)
    drawInput(ctx)
  }, [messages, contactName, contactAvatar, myAvatar, bgImage, theme])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function drawWithBg(img) {
    const cv = canvasRef.current; if (!cv) return
    const ctx = cv.getContext('2d')
    const H = cv.height
    const scale = Math.max(CW / img.width, H / img.height)
    const w = img.width * scale, h = img.height * scale
    ctx.globalAlpha = 0.35
    ctx.drawImage(img, (CW - w) / 2, (H - h) / 2, w, h)
    ctx.globalAlpha = 1
    drawHeader(ctx)
    drawMessages(ctx)
    drawInput(ctx)
  }

  function drawHeader(ctx) {
    ctx.fillStyle = themeC.header
    ctx.fillRect(0, 0, CW, HDR)
    // back arrow
    ctx.strokeStyle = themeC.headerText; ctx.lineWidth = 2; ctx.lineCap = 'round'
    ctx.beginPath(); ctx.moveTo(18, HDR/2 - 6); ctx.lineTo(12, HDR/2); ctx.lineTo(18, HDR/2 + 6); ctx.stroke()
    // avatar
    const av = contactAvatar || defaultAvatar(contactName, 40)
    const img = new Image()
    img.onload = () => {
      ctx.save(); ctx.beginPath(); ctx.arc(40, HDR/2, 20, 0, Math.PI*2); ctx.clip()
      ctx.drawImage(img, 20, HDR/2 - 20, 40, 40); ctx.restore()
      drawHeaderText(ctx)
    }
    img.src = av
    if (!av) drawHeaderText(ctx)
    // call/video/icons (right side)
    ctx.fillStyle = themeC.headerText
    ;[[CW-26, HDR/2],[CW-58, HDR/2]].forEach(([x,y], i) => {
      ctx.beginPath()
      if (i===0){ ctx.moveTo(x,y-7); ctx.lineTo(x-4,y); ctx.lineTo(x,y+7) } // phone
      else { ctx.rect(x-7,y-6,10,10) }
      ctx.stroke()
    })
  }
  function drawHeaderText(ctx) {
    ctx.textAlign = 'left'
    ctx.fillStyle = themeC.headerText
    ctx.font = '600 16px -apple-system, Segoe UI, Roboto, sans-serif'
    ctx.fillText(contactName || 'Contact', 68, HDR/2 - 8)
    ctx.font = '13px -apple-system, Segoe UI, Roboto, sans-serif'
    ctx.fillStyle = themeC.sub
    ctx.fillText('online', 68, HDR/2 + 12)
  }

  function drawMessages(ctx) {
    const lineH = 21, bubblePadX = 12, bubblePadY = 8, rowGap = 12
    let y = HDR + PAD
    for (const m of messages) {
      const lines = wrap(ctx, m.text, MAX_TXT_W)
      const timeW = ctx.measureText(m.time).width + 24 // + ticks
      const bubbleW = Math.max(...lines.map(l => ctx.measureText(l).width), 40) + bubblePadX*2 + timeW
      const bubbleH = lines.length * lineH + bubblePadY*2 + 16
      const isMine = m.side === 'me'
      const x = isMine ? CW - PAD - bubbleW : PAD
      const col = isMine ? themeC.mine : themeC.theirs

      ctx.fillStyle = col
      roundRect(ctx, x, y, bubbleW, bubbleH, BUBBLE_R)
      ctx.fill()
      // tail
      ctx.beginPath()
      if (isMine) { ctx.moveTo(x + bubbleW - 3, y + 2); ctx.lineTo(x + bubbleW + 6, y); ctx.lineTo(x + bubbleW - 1, y + 9) }
      else { ctx.moveTo(x + 3, y + 2); ctx.lineTo(x - 6, y); ctx.lineTo(x + 1, y + 9) }
      ctx.fill()

      ctx.textAlign = 'left'; ctx.fillStyle = themeC.text
      ctx.font = FONT
      let ty = y + bubblePadY + lineH/2
      for (const ln of lines) { ctx.fillText(ln, x + bubblePadX, ty); ty += lineH }
      // time + ticks
      ctx.font = '11px -apple-system, Segoe UI, Roboto, sans-serif'
      ctx.fillStyle = themeC.time
      const timeX = isMine ? x + bubbleW - bubblePadX - 20 - ctx.measureText(m.time).width : x + bubbleW - bubblePadX - ctx.measureText(m.time).width
      ctx.fillText(m.time, timeX, y + bubbleH - 10)
      if (isMine) {
        ctx.strokeStyle = themeC.ticks; ctx.lineWidth = 1.4; ctx.lineCap='round'
        ctx.beginPath(); ctx.moveTo(timeX - 20, y + bubbleH - 13); ctx.lineTo(timeX - 16, y + bubbleH - 9); ctx.lineTo(timeX - 11, y + bubbleH - 13); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(timeX - 15, y + bubbleH - 13); ctx.lineTo(timeX - 11, y + bubbleH - 9); ctx.lineTo(timeX - 6, y + bubbleH - 13); ctx.stroke()
      }
      y += bubbleH + rowGap
    }
  }
  function drawInput(ctx) {
    const H = canvasRef.current.height
    ctx.fillStyle = themeC.theirs
    ctx.fillRect(0, H - INP, CW, INP)
    // emoji icon
    ctx.fillStyle = themeC.time
    ctx.beginPath(); ctx.arc(26, H - INP/2, 9, 0, Math.PI*2); ctx.fill()
    ctx.fillStyle = themeC.theirs; ctx.beginPath(); ctx.arc(26, H - INP/2, 4, 0, Math.PI*2); ctx.fill()
    // input pill
    ctx.fillStyle = themeC.bg
    roundRect(ctx, 44, H - INP + 10, CW - 44 - 54, INP - 20, 20); ctx.fill()
    ctx.fillStyle = themeC.time; ctx.font = '14px sans-serif'; ctx.textAlign = 'left'
    ctx.fillText('Type a message', 58, H - INP/2 + 1)
    // mic
    ctx.fillStyle = themeC.ticks
    ctx.beginPath(); ctx.arc(CW - 26, H - INP/2, 11, 0, Math.PI*2); ctx.fill()
  }

  useEffect(() => { render() }, [render])

  const download = (scale = 2) => {
    const cv = canvasRef.current; if (!cv) return
    const big = document.createElement('canvas')
    big.width = cv.width * scale; big.height = cv.height * scale
    big.getContext('2d').drawImage(cv, 0, 0, big.width, big.height)
    const a = document.createElement('a')
    a.download = `whatsapp-chat-${Date.now()}.png`
    a.href = big.toDataURL('image/png')
    a.click()
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-2.5 text-white font-semibold outline-none focus:border-emerald-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"
  const chip = (on, active) => `px-3 py-2 rounded-xl text-xs font-bold transition-all border-2 ${on ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-white/[0.04] border-white/8 text-slate-400 hover:border-white/12'}`

  return (
    <ToolLayout
      title="WhatsApp Chat Generator"
      desc="Create a realistic fake WhatsApp chat screenshot in seconds. Add messages, upload profile pictures, pick a theme, and download your WhatsApp-style chat as a high-quality PNG image."
      icon="💬" iconBg="rgba(37,211,102,0.08)"
      category="whatsapp" slug="whatsapp-chat-generator"
      faq={[
        { q: "Is this a real WhatsApp chat?", a: "No. This is a fake WhatsApp chat generator — it creates a realistic-looking screenshot of a conversation for fun, memes, and social content. It does not connect to WhatsApp." },
        { q: "Can I upload profile pictures?", a: "Yes. Upload a profile picture for the contact (and your own) and they appear in the chat header. You can also upload a custom chat wallpaper background." },
        { q: "How do I download the chat?", a: "Click 'Download PNG'. The chat is rendered on a canvas and downloaded as a high-resolution PNG (2x for sharpness) that you can share." },
        { q: "Is it free?", a: "Yes, completely free and runs in your browser. No images are uploaded to any server — everything stays on your device." },
      ]}
      howItWorks={[
        "Set the contact name and upload a profile picture.",
        "Type messages and add them as 'Me' or 'Them' bubbles.",
        "Pick a WhatsApp theme and click Download PNG.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        name: "WhatsApp Chat Generator", applicationCategory: "MultimediaApplication",
        url: "https://www.uptools.in/whatsapp-chat-generator/",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
      }}
    >
      <div className="max-w-4xl mx-auto grid lg:grid-cols-[1fr_auto] gap-6 items-start">
        {/* controls */}
        <div className="space-y-4">
          <div className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Contact Name</label>
              <input className={inputClass} value={contactName} onChange={e => setContactName(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Contact Picture</label>
                <input ref={avFileRef} type="file" accept="image/*" className="hidden" onChange={e => readFile(e, setContactAvatar)} />
                <button onClick={() => avFileRef.current.click()} className="w-full py-2.5 rounded-xl bg-white/[0.06] border border-white/8 text-xs font-bold text-slate-300 hover:border-emerald-500/40 transition-all">
                  📷 {contactAvatar ? 'Change' : 'Upload'}
                </button>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Your Picture</label>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => readFile(e, setMyAvatar)} />
                <button onClick={() => fileRef.current.click()} className="w-full py-2.5 rounded-xl bg-white/[0.06] border border-white/8 text-xs font-bold text-slate-300 hover:border-emerald-500/40 transition-all">
                  🧑 {myAvatar ? 'Change' : 'Upload'}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Theme</label>
              <div className="flex gap-2">
                {[['classic','🎨 Classic'],['dark','🌙 Dark'],['light','☀️ Light']].map(([k,l]) => (
                  <button key={k} className={chip(theme===k, true)} onClick={() => setTheme(k)}>{l}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Chat Wallpaper (optional)</label>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => readFile(e, setBgImage)} />
              <button onClick={() => fileRef.current.click()} className="w-full py-2.5 rounded-xl bg-white/[0.06] border border-white/8 text-xs font-bold text-slate-300 hover:border-emerald-500/40 transition-all">
                🖼️ {bgImage ? 'Change Wallpaper' : 'Upload Wallpaper'}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-5 space-y-3">
            <label className="block text-xs font-semibold text-slate-400">Add Message</label>
            <textarea className={inputClass + " resize-none"} rows={2} value={msgText} onChange={e => setMsgText(e.target.value)}
              placeholder="Type a message..." onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addMsg() } }} />
            <div className="flex gap-2">
              <button className={chip(msgSide==='me', true)} onClick={() => setMsgSide('me')}>Me (green)</button>
              <button className={chip(msgSide==='them', true)} onClick={() => setMsgSide('them')}>Them (white)</button>
              <button onClick={addMsg} className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-400 transition-all">＋ Add Message</button>
            </div>
            {messages.length > 0 && (
              <div className="max-h-36 overflow-auto space-y-1.5">
                {messages.map(m => (
                  <div key={m.id} className="flex items-center gap-2 bg-white/[0.04] rounded-lg px-3 py-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${m.side==='me' ? 'bg-emerald-400' : 'bg-white/40'}`} />
                    <span className="text-xs text-slate-300 flex-1 truncate">{m.text}</span>
                    <span className="text-[10px] text-slate-500">{m.time}</span>
                    <button onClick={() => removeMsg(m.id)} className="text-slate-500 hover:text-red-400 text-xs font-bold">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button onClick={() => download(2)} className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-400 transition-all active:scale-[0.98]">
            ⬇️ Download Chat as PNG
          </button>
        </div>

        {/* preview */}
        <div ref={resultRef} className="mx-auto lg:mx-0">
          <canvas ref={canvasRef} width={CW} height={600}
            className="w-[300px] lg:w-[340px] rounded-2xl shadow-2xl border-2 border-white/10" style={{ imageRendering: 'auto' }} />
          <p className="text-center text-[11px] text-slate-500 mt-2">Live preview — download gets full resolution</p>
        </div>
      </div>
    </ToolLayout>
  )
}
