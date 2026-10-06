import { useState, useRef, useEffect, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'

const BACKEND_URL = 'wss://chat.uptools.in'
const ROSE = 'linear-gradient(135deg, #f43f5e, #ec4899)'

// ---- E2E helpers (ECDH P-256 + AES-GCM). Keys exchanged over signalling,
// server only relays ciphertext and can never read messages. ----
async function genECDH() {
  return crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveKey'])
}
async function exportPub(key) {
  return crypto.subtle.exportKey('jwk', key.publicKey)
}
async function importPub(jwk) {
  return crypto.subtle.importKey('jwk', jwk, { name: 'ECDH', namedCurve: 'P-256' }, true, [])
}
async function deriveAES(priv, pubJwk) {
  const pub = await importPub(pubJwk)
  return crypto.subtle.deriveKey({ name: 'ECDH', public: pub }, priv, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt'])
}
function bufToB64(buf) {
  const b = new Uint8Array(buf)
  let s = ''
  for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i])
  return btoa(s)
}
function b64ToBuf(s) {
  const bin = atob(s)
  const b = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) b[i] = bin.charCodeAt(i)
  return b
}
async function encText(aesKey, text) {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, aesKey, new TextEncoder().encode(text))
  return { iv: bufToB64(iv), data: bufToB64(ct) }
}
async function decText(aesKey, ivB64, dataB64) {
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64ToBuf(ivB64) }, aesKey, b64ToBuf(dataB64))
  return new TextDecoder().decode(pt)
}

export default function stranger_chat() {
  const [stage, setStage] = useState('gate') // gate | matching | chat
  const [adult, setAdult] = useState(false)
  const [me, setMe] = useState('M')
  const [want, setWant] = useState('ANY')
  const [status, setStatus] = useState('Ready — press Start to meet a stranger. 💕')
  const [msgs, setMsgs] = useState([])
  const [draft, setDraft] = useState('')
  const [demo, setDemo] = useState(false)
  const [notice, setNotice] = useState('')
  const [rec, setRec] = useState(false)
  const wsRef = useRef(null)
  const aesRef = useRef(null)
  const ecdhRef = useRef(null)
  const mediaRef = useRef(null)
  const chunksRef = useRef([])
  const listRef = useRef(null)

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [msgs])

  const push = useCallback((who, kind, body) => {
    setMsgs(p => [...p.slice(-99), { who, kind, body, at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
  }, [])

  const connect = useCallback(() => {
    if (!adult) { setNotice('Please confirm you are 18 or older.'); return }
    setNotice('')
    setMsgs([])
    aesRef.current = null
    setStage('matching')
    setStatus('Checking server… 💕');
    // Preflight: plain HTTPS first. If this fails, the phone's network has
    // not picked up the new chat address yet (DNS cache) — WS would hang.
    (async () => {
      try {
        const ctl = new AbortController()
        const killer = setTimeout(() => ctl.abort(), 8000)
        const res = await fetch('https://chat.uptools.in/health?t=' + Date.now(), { signal: ctl.signal })
        clearTimeout(killer)
        if (!res.ok) throw new Error('bad')
      } catch {
        setStatus('Your network cannot reach the chat server yet — the new address is still spreading to your provider. Toggle airplane mode on/off, or switch WiFi/mobile data, then press Retry. 💗')
        return
      }
      openSocket()
    })()
  }, [adult, me, want, push, stage])

  const openSocket = useCallback(() => {
    setStatus('Connecting… 💕')
    try {
      const ws = new WebSocket(BACKEND_URL)
      wsRef.current = ws
      const to = setTimeout(() => {
        if (ws.readyState !== 1) {
          try { ws.close() } catch {}
          setStatus('Server is taking too long. Press Retry, or preview the UI in demo mode below.')
        }
      }, 12000)
      ws.onopen = async () => {
        clearTimeout(to)
        setStatus('Connected. Finding someone special… 💕')
        try {
          ecdhRef.current = await genECDH()
          const pub = await exportPub(ecdhRef.current)
          ws.send(JSON.stringify({ t: 'join', me, want, adult: true, pub }))
        } catch {
          ws.send(JSON.stringify({ t: 'join', me, want, adult: true }))
        }
      }
      ws.onmessage = async (ev) => {
        let m
        try { m = JSON.parse(ev.data) } catch { return }
        if (m.t === 'waiting') setStatus('Waiting for a stranger… keep this tab open 💗')
        else if (m.t === 'paired') {
          setStage('chat')
          setStatus('💘 Connected. Messages are end-to-end encrypted.')
          push('sys', 'text', '💘 Stranger connected. Say hi! (🔒 E2E encrypted)')
        }
        else if (m.t === 'partner-left') {
          setStatus('Stranger left. Press Next for someone new. 💔')
          push('sys', 'text', 'Stranger disconnected.')
        }
        else if (m.t === 'key' && m.pub && ecdhRef.current && !aesRef.current) {
          try {
            aesRef.current = await deriveAES(ecdhRef.current.privateKey, m.pub)
            setStatus('💘 Connected. Messages are end-to-end encrypted.')
          } catch {}
        }
        else if (m.t === 'msg' && m.iv && m.data) {
          if (aesRef.current) {
            try { push('them', 'text', await decText(aesRef.current, m.iv, m.data)) } catch {}
          }
        }
        else if ((m.t === 'img' || m.t === 'audio') && m.url) {
          push('them', m.t, m.url)
        }
        else if (m.t === 'reported') setStatus('Reported. Finding someone new…')
      }
      ws.onclose = () => {
        if (stage !== 'chat') setStatus('Connection lost. Check internet and try again.')
      }
      ws.onerror = () => {}
    } catch {
      setStage('matching')
      setStatus('Connection failed. Try again.')
    }
  }, [adult, me, want, push, stage])

  const sendText = useCallback(async () => {
    const t = draft.trim()
    if (!t) return
    setDraft('')
    push('me', 'text', t)
    const ws = wsRef.current
    if (ws && ws.readyState === 1 && aesRef.current) {
      try {
        const c = await encText(aesRef.current, t)
        ws.send(JSON.stringify({ t: 'msg', ...c }))
      } catch {}
    } else if (demo) {
      setTimeout(() => push('them', 'text', 'Hey! 💕 This is a demo preview — press Start above for real strangers.'), 900)
    }
  }, [draft, push, demo])

  const sendImage = useCallback((f) => {
    if (!f) return
    if (f.size > 2 * 1024 * 1024) { setNotice('Image too large. Max 2MB.'); return }
    const r = new FileReader()
    r.onload = () => {
      const url = r.result
      push('me', 'img', url)
      const ws = wsRef.current
      if (ws && ws.readyState === 1) { try { ws.send(JSON.stringify({ t: 'img', url })) } catch {} }
      else if (demo) setTimeout(() => push('them', 'text', 'Nice pic! 💕 (demo reply) 📸'), 1200)
    }
    r.readAsDataURL(f)
  }, [push, demo])

  const toggleRec = useCallback(async () => {
    if (rec) {
      try { mediaRef.current?.stop() } catch {}
      setRec(false)
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      chunksRef.current = []
      mr.ondataavailable = e => { if (e.data.size) chunksRef.current.push(e.data) }
      mr.onstop = () => {
        stream.getTracks().forEach(t => t.stop())
        const blob = new Blob(chunksRef.current, { type: mr.mimeType || 'audio/webm' })
        if (blob.size > 2 * 1024 * 1024) { setNotice('Voice note too long. Keep it short (2MB max).'); return }
        const r = new FileReader()
        r.onload = () => {
          push('me', 'audio', r.result)
          const ws = wsRef.current
          if (ws && ws.readyState === 1) { try { ws.send(JSON.stringify({ t: 'audio', url: r.result })) } catch {} }
        }
        r.readAsDataURL(blob)
      }
      mediaRef.current = mr
      mr.start()
      setRec(true)
      setNotice('')
    } catch {
      setNotice('Mic blocked. Allow microphone permission to send voice notes.')
    }
  }, [rec, push])

  const doNext = useCallback(() => {
    const ws = wsRef.current
    if (ws && ws.readyState === 1) { try { ws.send(JSON.stringify({ t: 'next' })) } catch {} }
    setMsgs([])
    setStage('matching')
    setStatus('Finding someone new… 💕')
    if (demo) setTimeout(() => { setStage('chat'); setStatus('Demo preview — no real stranger.') }, 800)
  }, [demo])

  const doEnd = useCallback(() => {
    try { wsRef.current?.send(JSON.stringify({ t: 'leave' })); wsRef.current?.close() } catch {}
    wsRef.current = null
    aesRef.current = null
    setMsgs([])
    setStage('gate')
    setStatus('Ready — press Start to meet a stranger. 💕')
  }, [])

  const doReport = useCallback(() => {
    const ws = wsRef.current
    if (ws && ws.readyState === 1) { try { ws.send(JSON.stringify({ t: 'report' })) } catch {} }
    push('sys', 'text', 'Reported and blocked. Never share personal info with strangers.')
    setMsgs([])
    setStage('matching')
    setStatus('Reported. Finding someone new…')
  }, [push])

  return (
    <ToolLayout
      title="Stranger Chat - Talk to Strangers Online"
      desc="Anonymous stranger chat: talk to strangers online with text, images and voice notes. No sign-up, 18+ only, end-to-end encrypted. Free."
      icon="💘" iconBg="rgba(244,63,94,0.10)"
      category="social" slug="stranger-chat"
      faq={[
        { q: 'How does stranger chat work?', a: 'Confirm 18+, pick I-am and who you want to talk to, press Start. The server pairs you 1-1 with a stranger. Text, images and voice notes are supported. Press Next anytime.' },
        { q: 'Is it free? Do I need an account?', a: 'Yes, completely free with no sign-up and no name required. Just select Male or Female and start.' },
        { q: 'Is it 18+ only?', a: 'Yes. This page is strictly 18+. You must confirm your age before chatting, per our safety policy.' },
        { q: 'Is my chat private?', a: 'Chats use ECDH + AES-GCM end-to-end encryption. The server only relays ciphertext and stores nothing — no logs, no images, no recordings.' },
        { q: 'What if someone misbehaves?', a: 'Press Report instantly: it blocks them and finds you someone new. Never share your phone, address, OTPs or photos with ID. For help mail grievance@uptools.in.' },
        { q: 'India IT Rules compliance?', a: 'We follow IT Rules 2021 for intermediaries: 18+ gating, report/block tools, no content storage, and a grievance contact (grievance@uptools.in) with 72-hour acknowledgement.' },
      ]}
      howItWorks={[
        'Confirm 18+, choose I-am (Male/Female) and who to meet.',
        'Press Start — the server pairs you with a stranger 1-1.',
        'Chat with text, images and voice notes. Simple, private, no names.',
        'Use Next, Report or End anytime. Stay anonymous, share nothing personal.',
      ]}
      schema={{
        '@context': 'https://schema.org', '@type': 'SoftwareApplication',
        name: 'Stranger Chat - Talk to Strangers Online', applicationCategory: 'SocialNetworkingApplication',
        operatingSystem: 'Web', url: 'https://www.uptools.in/stranger-chat/',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
      }}
    >
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Romance ribbon */}
        <div className="text-center rounded-3xl border border-rose-500/20 px-4 py-5"
          style={{ background: 'linear-gradient(135deg, rgba(244,63,94,0.12), rgba(236,72,153,0.10), rgba(99,102,241,0.08))' }}>
          <div className="text-4xl mb-1">💘</div>
          <p className="text-base font-black text-white m-0">Find your connection</p>
          <p className="text-xs text-rose-200/80 m-0 mt-1">Anonymous 18+ chats — simple, private, no names 💕</p>
        </div>
        <div className="text-xs text-slate-400 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2">{status}</div>
        {notice && <div className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2">{notice}</div>}

        {stage === 'gate' && (
          <div className="border border-rose-500/20 rounded-3xl p-5 space-y-4 bg-white/[0.04]">
            <label className="flex items-start gap-2 text-sm text-slate-200 cursor-pointer">
              <input type="checkbox" checked={adult} onChange={e => setAdult(e.target.checked)} className="mt-1 accent-rose-500" />
              <span>I am 18 years or older and agree to the chat rules below. 💗</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-rose-200/80 mb-1">I am 💁</label>
                <select value={me} onChange={e => setMe(e.target.value)} className="w-full bg-black/20 border border-rose-500/20 rounded-xl px-3 py-2.5 text-sm text-white">
                  <option value="M">Male 💙</option>
                  <option value="F">Female 💖</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-rose-200/80 mb-1">Meet 💘</label>
                <select value={want} onChange={e => setWant(e.target.value)} className="w-full bg-black/20 border border-rose-500/20 rounded-xl px-3 py-2.5 text-sm text-white">
                  <option value="ANY">Anyone 💕</option>
                  <option value="M">Male 💙</option>
                  <option value="F">Female 💖</option>
                </select>
              </div>
            </div>
            <button onClick={connect} className="w-full py-3.5 rounded-2xl text-sm font-black text-white shadow-lg shadow-rose-500/25 hover:scale-[1.01] transition-transform" style={{ background: ROSE }}>
              💘 Start Chat
            </button>
            <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
              <input type="checkbox" checked={demo} onChange={e => setDemo(e.target.checked)} className="accent-rose-500" />
              Preview the chat UI in demo mode (no real stranger, for testing)
            </label>
            {demo && <button onClick={() => { setMsgs([]); setStage('chat'); setStatus('Demo preview — no real stranger.') }} className="w-full py-2.5 rounded-xl text-xs font-semibold bg-white/[0.06] border border-white/[0.08] text-slate-300">Open demo chat</button>}
          </div>
        )}

        {stage === 'matching' && (
          <div className="text-center py-12 rounded-3xl border-2 border-dashed border-rose-500/25 bg-rose-500/[0.04]">
            <div className="text-4xl mb-3 animate-pulse">💓</div>
            <div className="w-8 h-8 mx-auto border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-rose-200/90 mt-4 font-medium">Finding someone special…</p>
            <div className="flex gap-2 justify-center mt-4 flex-wrap">
              <button onClick={connect} className="text-xs font-bold px-5 py-2 rounded-full text-white shadow-md shadow-rose-500/25" style={{ background: ROSE }}>Retry 💕</button>
              <button onClick={doEnd} className="text-xs px-4 py-2 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-300">Cancel</button>
              <button onClick={() => { setStage('chat'); setStatus('Demo preview — no real stranger.') }} className="text-xs px-4 py-2 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-400">Try demo instead</button>
            </div>
          </div>
        )}

        {stage === 'chat' && (
          <div className="border border-rose-500/20 rounded-3xl overflow-hidden bg-white/[0.04]">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-rose-500/15 bg-rose-500/[0.05]">
              <button onClick={doNext} className="text-xs px-3 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-200 font-bold">Next 💫</button>
              <button onClick={doReport} className="text-xs px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 font-semibold">Report</button>
              <button onClick={doEnd} className="text-xs px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-slate-400">End</button>
              <span className="ml-auto text-[11px] font-bold text-rose-300">💕 E2E</span>
            </div>
            <div ref={listRef} className="h-80 overflow-y-auto px-4 py-3 space-y-2">
              {msgs.length === 0 && <p className="text-xs text-slate-500 text-center pt-10">Say hi to start something beautiful. 💕</p>}
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.who === 'me' ? 'justify-end' : m.who === 'sys' ? 'justify-center' : 'justify-start'}`}>
                  {m.kind === 'text' && (
                    <div className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-sm ${m.who === 'me' ? 'rounded-br-md text-white' : m.who === 'sys' ? 'bg-transparent text-slate-500 text-xs italic' : 'rounded-bl-md bg-white/[0.08] text-slate-200'}`}
                      style={m.who === 'me' ? { background: ROSE } : undefined}>
                      {m.body}
                      <div className="text-[10px] opacity-60 mt-0.5">{m.at}</div>
                    </div>
                  )}
                  {m.kind === 'img' && <img src={m.body} alt="shared" className="max-w-[70%] rounded-2xl border border-rose-500/20" />}
                  {m.kind === 'audio' && <audio src={m.body} controls className="max-w-[75%] h-9" />}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 px-3 py-3 border-t border-rose-500/15">
              <label className="cursor-pointer text-lg px-1" title="Send image (max 2MB)">
                📷<input type="file" accept="image/*" className="hidden" onChange={e => { sendImage(e.target.files?.[0]); e.target.value = '' }} />
              </label>
              <button onClick={toggleRec} title="Voice note" className={`text-lg px-1 ${rec ? 'animate-pulse' : ''}`}>{rec ? '⏹️' : '🎙️'}</button>
              <button onClick={() => setNotice('Live voice calls are coming soon — voice notes work now. 💕')} title="Voice call" className="text-lg px-1">📞</button>
              <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') sendText() }}
                placeholder="Say something sweet… 💬" className="flex-1 bg-black/20 border border-rose-500/20 rounded-full px-4 py-2 text-sm text-white outline-none focus:border-rose-500/50" />
              <button onClick={sendText} className="px-4 py-2 rounded-full text-sm font-black text-white shadow-md shadow-rose-500/25" style={{ background: ROSE }}>Send 💕</button>
            </div>
          </div>
        )}

        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 text-xs text-slate-400 leading-relaxed">
          <p className="font-bold text-slate-300 mb-1">Rules — 18+ only, stay safe 💗</p>
          <p>1. 18+ strictly. No nudity, no harassment, no spam. 2. Never share phone, address, OTPs, bank or ID photos. 3. Report abuse instantly — it blocks and re-matches. 4. Chats are encrypted and never stored. Grievance: grievance@uptools.in (reply within 72h, IT Rules 2021).</p>
        </div>
      </div>
    </ToolLayout>
  )
}
