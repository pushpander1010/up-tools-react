import { useState, useRef, useEffect, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'

const BACKEND_URL = 'wss://backend.uptools.in/chat-ws'
const BACKEND_HEALTH = 'https://backend.uptools.in/chat-ws/health'
const BACKEND_CRED = 'https://backend.uptools.in/chat-ws/turn-cred'
const STUN_ONLY = [{ urls: 'stun:stun.l.google.com:19302' }]
// Voice relay login: short-lived pass fetched from our own server at call
// time (never stored in code). Falls back to direct connection if unreachable.
async function getIceServers() {
  try {
    const ctl = new AbortController()
    const killer = setTimeout(() => ctl.abort(), 8000)
    const r = await fetch(BACKEND_CRED + '?t=' + Date.now(), { signal: ctl.signal })
    clearTimeout(killer)
    if (!r.ok) throw new Error('bad')
    const c = await r.json()
    if (c && c.username && c.password) {
      return [...STUN_ONLY, { urls: 'turn:161.118.188.85:3478', username: c.username, credential: c.password }]
    }
  } catch {}
  return STUN_ONLY
}
const ROSE_SOLID = '#f43f5e'
const TEAL_SOLID = '#00a884'

function ChatGlyph({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}
function ShieldGlyph({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" /><path d="M9 12l2 2 4-4" />
    </svg>
  )
}
function BoltGlyph({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M13 2L3 14h7l-1 8 10-12h-7z" />
    </svg>
  )
}
function MicGlyph({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 17v4" />
    </svg>
  )
}
function ImgGlyph({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="1.5" /><path d="M4 18l5-5 3 3 4-4 4 4" />
    </svg>
  )
}
function SmileGlyph({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><path d="M9 9h.01M15 9h.01" />
    </svg>
  )
}
function PhoneGlyph({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z" />
    </svg>
  )
}
function PersonGlyph({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
    </svg>
  )
}
function HeartGlyph({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 21s-7.5-4.7-10-9.3C.4 8.6 2.3 5 5.7 5c2 0 3.4 1.1 4.3 2.6h4c.9-1.5 2.3-2.6 4.3-2.6 3.4 0 5.3 3.6 3.7 6.7C19.5 16.3 12 21 12 21z" transform="scale(0.95) translate(0.6,0.5)" />
    </svg>
  )
}

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
  const [notice, setNotice] = useState('')
  const [rec, setRec] = useState(false)
  const [call, setCall] = useState('idle') // idle | calling | incoming | incall
  const [callSecs, setCallSecs] = useState(0)
  const [muted, setMuted] = useState(false)
  const [online, setOnline] = useState(null)
  const wsRef = useRef(null)
  const aesRef = useRef(null)
  const pendingRef = useRef([])
  const pcRef = useRef(null)
  const micRef = useRef(null)
  const micStreamRef = useRef(null)
  const offerRef = useRef(null)
  const callTimerRef = useRef(null)
  const ecdhRef = useRef(null)
  const mediaRef = useRef(null)
  const chunksRef = useRef([])
  const listRef = useRef(null)
  const nearBottomRef = useRef(true)
  // rooms (no E2E — server relays plaintext, transport-encrypted)
  const [room, setRoom] = useState(null) // {id, members[]} | null
  const [myName, setMyName] = useState('')
  const [roomPw, setRoomPw] = useState('')
  const [joinId, setJoinId] = useState('')
  const [joinPw, setJoinPw] = useState('')
  const [roomLink, setRoomLink] = useState('')
  const [roomPanel, setRoomPanel] = useState(null) // null | 'create' | 'join'
  const [showPics, setShowPics] = useState(false)
  const [peerAct, setPeerAct] = useState(null) // 'typing…' | 'sending a photo…' | 'recording voice…' | 'Name: …'
  const typingTimerRef = useRef(null)
  const typingOnRef = useRef(false)
  const actTimerRef = useRef(null)
  const showPeerAct = useCallback((text) => {
    setPeerAct(text)
    if (actTimerRef.current) clearTimeout(actTimerRef.current)
    actTimerRef.current = setTimeout(() => setPeerAct(null), 4500)
  }, [])
  const hidePeerAct = useCallback(() => {
    if (actTimerRef.current) clearTimeout(actTimerRef.current)
    setPeerAct(null)
  }, [])
  // signal peer: {t:'typing'|'activity'} for 1-1, room-* for rooms
  const sendSignal = useCallback((kind, payload) => {
    const ws = wsRef.current
    if (!ws || ws.readyState !== 1) return
    try {
      if (room) ws.send(JSON.stringify({ t: kind === 'typing' ? 'room-typing' : 'room-activity', ...payload }))
      else ws.send(JSON.stringify({ t: kind, ...payload }))
    } catch {}
  }, [room])
  const onDraftChange = useCallback((v) => {
    setDraft(v)
    const ws = wsRef.current
    if (!ws || ws.readyState !== 1) return
    if (v.trim() && !typingOnRef.current) {
      typingOnRef.current = true
      sendSignal('typing', { state: true })
    }
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
    typingTimerRef.current = setTimeout(() => {
      typingOnRef.current = false
      sendSignal('typing', { state: false })
    }, 1200)
  }, [sendSignal])

  const onScrollList = useCallback(() => {
    const el = listRef.current
    if (!el) return
    nearBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120
  }, [])

  useEffect(() => {
    // auto-scroll ONLY when user is already near bottom (never yank readers)
    const el = listRef.current
    if (el && nearBottomRef.current) el.scrollTop = el.scrollHeight
  }, [msgs])

  // deep link: #room=<id> -> prefill join UI
  useEffect(() => {
    try {
      const h = window.location.hash || ''
      const mm = h.match(/room=([A-Za-z0-9]{4,16})/)
      if (mm) { setJoinId(mm[1].toLowerCase()); setRoomPanel('join') }
    } catch {}
  }, [])

  useEffect(() => {
    let stop = false
    const fetchOnline = async () => {
      try {
        const r = await fetch(BACKEND_HEALTH + '?t=' + Date.now())
        if (!r.ok) return
        const j = await r.json()
        if (stop) return
        if (typeof j.online === 'number') setOnline(j.online)
        else if (typeof j.waiting === 'number') setOnline(j.waiting + (j.paired || 0) * 2)
      } catch {}
    }
    fetchOnline()
    const iv = setInterval(fetchOnline, 30000)
    return () => { stop = true; clearInterval(iv) }
  }, [])

  const push = useCallback((who, kind, body) => {
    setMsgs(p => [...p.slice(-99), { who, kind, body, at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
  }, [])

  const cidRef = useRef(null)
  if (!cidRef.current) {
    try { cidRef.current = Math.random().toString(36).slice(2) + Date.now().toString(36) } catch { cidRef.current = 'x' }
  }
  const connect = useCallback(() => {
    if (!adult) { setNotice('Please confirm you are 18 or older.'); return }
    setNotice('')
    setMsgs([])
    aesRef.current = null
    // close any previous socket first — otherwise Retry leaves the old
    // socket in the server queue and the server pairs us with ourselves
    try { wsRef.current?.close() } catch {}
    wsRef.current = null
    setStage('matching')
    setStatus('Checking server… 💕');
    // Preflight: plain HTTPS first. If this fails, the phone's network has
    // not picked up the new chat address yet (DNS cache) — WS would hang.
    (async () => {
      try {
        const ctl = new AbortController()
        const killer = setTimeout(() => ctl.abort(), 8000)
        const res = await fetch(BACKEND_HEALTH + '?t=' + Date.now(), { signal: ctl.signal })
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
          setStatus('Server is taking too long. Press Retry.')
        }
      }, 12000)
      ws.onopen = async () => {
        clearTimeout(to)
        setStatus('Connected. Finding someone special… 💕')
        try {
          ecdhRef.current = await genECDH()
          const pub = await exportPub(ecdhRef.current)
          ws.send(JSON.stringify({ t: 'join', me, want, adult: true, pub, cid: cidRef.current }))
        } catch {
          ws.send(JSON.stringify({ t: 'join', me, want, adult: true, cid: cidRef.current }))
        }
      }
      ws.onmessage = async (ev) => {
        let m
        try { m = JSON.parse(ev.data) } catch { return }
        if (m.t === 'waiting') setStatus('Waiting for a stranger… keep this tab open 💗')
        else if (m.t === 'paired') {
          setStage('chat')
          hidePeerAct()
          setStatus('💘 Connected. Messages are end-to-end encrypted.')
          push('sys', 'text', '💘 Stranger connected. Say hi! (🔒 E2E encrypted)')
        }
        else if (m.t === 'partner-left') {
          closeCall(true)
          hidePeerAct()
          setStatus('Stranger left. Press Next for someone new. 💔')
          push('sys', 'text', 'Stranger disconnected.')
        }
        else if (m.t === 'hello' && m.name) setMyName(m.name)
        else if (m.t === 'room-created') {
          setRoom({ id: m.id, members: m.members || [] })
          const link = 'https://www.uptools.in/stranger-chat/#room=' + m.id
          setRoomLink(link)
          try { window.location.hash = 'room=' + m.id } catch {}
          setStage('chat')
          setMsgs([])
          setStatus('🏠 Room ' + m.id + ' created. Share the link — transport-encrypted (no E2E in rooms).')
          push('sys', 'text', '🏠 Room created. You are ' + (m.name || myName) + '. Share the link to invite up to 8 people.')
        }
        else if (m.t === 'room-joined') {
          setRoom({ id: m.id, members: m.members || [] })
          setRoomLink('https://www.uptools.in/stranger-chat/#room=' + m.id)
          setStage('chat')
          setMsgs([])
          setStatus('🏠 Joined room ' + m.id + ' as ' + (m.name || '') + ' — transport-encrypted (no E2E in rooms).')
          push('sys', 'text', '🏠 You joined as ' + (m.name || 'guest') + ' (' + ((m.members || []).length) + ' in room).')
        }
        else if (m.t === 'room-error') {
          const r = m.reason === 'bad password' ? 'Wrong room password. 💔'
            : m.reason === 'full' ? 'Room is full (8 max). 💔'
            : m.reason === 'expired' ? 'Room expired (24h). Create a new one. 💔'
            : 'Room not found — check the link. 💔'
          setNotice(r)
          setStatus(r)
        }
        else if (m.t === 'peer-joined' && m.name) {
          setRoom(rm => rm ? { ...rm, members: [...new Set([...(rm.members || []), m.name])] } : rm)
          push('sys', 'text', '🎉 ' + m.name + ' joined the room')
        }
        else if (m.t === 'peer-left' && m.name) {
          setRoom(rm => rm ? { ...rm, members: (rm.members || []).filter(x => x !== m.name) } : rm)
          push('sys', 'text', '👋 ' + m.name + ' left the room')
        }
        else if (m.t === 'room-msg' && typeof m.text === 'string') {
          push('them', 'text', (m.name ? m.name + ': ' : '') + m.text)
        }
        else if ((m.t === 'room-img' || m.t === 'room-audio') && m.url) {
          push('them', m.t === 'room-img' ? 'img' : 'audio', m.url)
          if (m.name) push('sys', 'text', '— sent by ' + m.name)
          hidePeerAct()
        }
        else if (m.t === 'typing') {
          if (m.state) showPeerAct('Stranger is typing…')
          else hidePeerAct()
        }
        else if (m.t === 'activity') {
          if (m.kind === 'image') showPeerAct('Stranger is sending a photo…')
          else if (m.kind === 'voice') showPeerAct('Stranger is recording a voice note…')
          else hidePeerAct()
        }
        else if (m.t === 'room-typing' && m.name) {
          if (m.state) showPeerAct(m.name + ' is typing…')
          else hidePeerAct()
        }
        else if (m.t === 'room-activity' && m.name) {
          if (m.kind === 'image') showPeerAct(m.name + ' is sending a photo…')
          else if (m.kind === 'voice') showPeerAct(m.name + ' is recording a voice note…')
          else hidePeerAct()
        }
        else if (m.t === 'key' && m.pub && ecdhRef.current && !aesRef.current) {
          try {
            aesRef.current = await deriveAES(ecdhRef.current.privateKey, m.pub)
            setStatus('💘 Connected. Messages are end-to-end encrypted.')
            // flush messages typed while encryption was setting up
            const q = pendingRef.current.splice(0)
            for (const text of q) {
              try {
                const c = await encText(aesRef.current, text)
                ws.send(JSON.stringify({ t: 'msg', ...c }))
              } catch {}
            }
            if (q.length) setNotice('')
          } catch {}
        }
        else if (m.t === 'msg' && m.iv && m.data) {
          if (aesRef.current) {
            try { push('them', 'text', await decText(aesRef.current, m.iv, m.data)); hidePeerAct() } catch {}
          }
        }
        else if ((m.t === 'img' || m.t === 'audio') && m.url) {
          push('them', m.t, m.url)
          hidePeerAct()
        }
        else if (m.t === 'call-offer' && m.sdp) {
          if (pcRef.current || offerRef.current) {
            try { ws.send(JSON.stringify({ t: 'call-end', busy: true })) } catch {}
          } else {
            offerRef.current = m.sdp
            setCall('incoming')
            push('sys', 'text', '📞 Incoming call…')
          }
        }
        else if (m.t === 'call-answer' && m.sdp && pcRef.current) {
          try {
            await pcRef.current.setRemoteDescription(new RTCSessionDescription(m.sdp))
            setCall('incall')
            setCallSecs(0)
            if (callTimerRef.current) clearInterval(callTimerRef.current)
            callTimerRef.current = setInterval(() => setCallSecs(s => s + 1), 1000)
            push('sys', 'text', '📞 Call connected 💕')
          } catch {}
        }
        else if (m.t === 'ice' && m.cand && pcRef.current) {
          try { await pcRef.current.addIceCandidate(new RTCIceCandidate(m.cand)) } catch {}
        }
        else if (m.t === 'call-end') {
          if (pcRef.current || offerRef.current) {
            try { pcRef.current?.close() } catch {}
            pcRef.current = null
            try { micStreamRef.current?.getTracks().forEach(t => t.stop()) } catch {}
            micStreamRef.current = null
            offerRef.current = null
            if (callTimerRef.current) { clearInterval(callTimerRef.current); callTimerRef.current = null }
            setCall('idle')
            setCallSecs(0)
            setMuted(false)
            push('sys', 'text', m.busy ? 'Stranger is on another call.' : 'Call ended by stranger.')
          }
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
    typingOnRef.current = false
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
    sendSignal('typing', { state: false })
    push('me', 'text', t)
    const ws = wsRef.current
    if (room && ws && ws.readyState === 1) {
      try { ws.send(JSON.stringify({ t: 'room-msg', text: t.slice(0, 2000) })) } catch {}
      return
    }
    if (ws && ws.readyState === 1 && aesRef.current) {
      try {
        const c = await encText(aesRef.current, t)
        ws.send(JSON.stringify({ t: 'msg', ...c }))
      } catch {}
    } else if (ws && ws.readyState === 1 && !aesRef.current) {
      pendingRef.current.push(t)
      setNotice('Setting up encryption… your message sends by itself in a second. 💕')
    }
  }, [draft, push, room, sendSignal])

  // compress any image down under maxBytes (step down quality + size)
  const compressImage = useCallback(async (file, maxBytes) => {
    const bmp = await createImageBitmap(file)
    const dims = [1280, 1024, 800, 640]
    const quals = [0.72, 0.6, 0.5, 0.4]
    for (const MAXD of dims) {
      const sc = Math.min(1, MAXD / Math.max(bmp.width, bmp.height))
      const w = Math.max(1, Math.round(bmp.width * sc))
      const h = Math.max(1, Math.round(bmp.height * sc))
      const cv = document.createElement('canvas')
      cv.width = w; cv.height = h
      cv.getContext('2d').drawImage(bmp, 0, 0, w, h)
      for (const q of quals) {
        const blob = await new Promise(res => cv.toBlob(res, 'image/jpeg', q))
        if (blob && blob.size <= maxBytes) return blob
      }
    }
    // last resort: smallest rendition regardless of size
    const cv = document.createElement('canvas')
    cv.width = 640; cv.height = Math.max(1, Math.round(640 * bmp.height / bmp.width))
    cv.getContext('2d').drawImage(bmp, 0, 0, cv.width, cv.height)
    return await new Promise(res => cv.toBlob(res, 'image/jpeg', 0.4))
  }, [])
  const [pendingImg, setPendingImg] = useState(null) // {file, url} awaiting compress/original choice
  const sendImage = useCallback((f) => {
    if (!f) return
    sendSignal('activity', { kind: 'image' })
    // over 2MB: compress and send straight away, no dialog
    if (f.size > 2 * 1024 * 1024) {
      setNotice('Large photo — compressing for fast send…');
      (async () => {
        try {
          const blob = await compressImage(f, 1200 * 1024)
          if (!blob) throw new Error('compress')
          const r = new FileReader()
          r.onload = () => deliverImageUrl(r.result)
          r.readAsDataURL(blob)
        } catch {
          sendSignal('activity', { kind: null })
          setNotice('Could not process that photo. Try a smaller one.')
        }
      })()
      return
    }
    try {
      const url = URL.createObjectURL(f)
      setPendingImg({ file: f, url })
    } catch {
      // fallback: send original directly if preview fails
      const r = new FileReader()
      r.onload = () => {
        const durl = r.result
        push('me', 'img', durl)
        sendSignal('activity', { kind: null })
        const ws = wsRef.current
        if (ws && ws.readyState === 1) {
          try { ws.send(JSON.stringify(room ? { t: 'room-img', url: durl } : { t: 'img', url: durl })) } catch {}
        }
      }
      r.readAsDataURL(f)
    }
  }, [push, room, sendSignal, compressImage])
  const deliverImageUrl = useCallback((durl) => {
    push('me', 'img', durl)
    sendSignal('activity', { kind: null })
    const ws = wsRef.current
    if (ws && ws.readyState === 1) {
      try { ws.send(JSON.stringify(room ? { t: 'room-img', url: durl } : { t: 'img', url: durl })) } catch {}
    }
  }, [push, room, sendSignal])
  const sendImgCompressed = useCallback(async () => {
    const p = pendingImg
    if (!p) return
    setPendingImg(null)
    try {
      const blob = await compressImage(p.file, 1200 * 1024)
      if (!blob) throw new Error('compress')
      const r = new FileReader()
      r.onload = () => deliverImageUrl(r.result)
      r.readAsDataURL(blob)
    } catch {
      // compression unsupported — send original
      const r = new FileReader()
      r.onload = () => deliverImageUrl(r.result)
      r.readAsDataURL(p.file)
    }
    try { URL.revokeObjectURL(p.url) } catch {}
  }, [pendingImg, deliverImageUrl, compressImage])
  const sendImgOriginal = useCallback(() => {
    const p = pendingImg
    if (!p) return
    setPendingImg(null)
    try { URL.revokeObjectURL(p.url) } catch {}
    if (p.file.size > 1400 * 1024) setNotice('Large file — may fail on slow networks. Compressed is safer. 💕')
    const r = new FileReader()
    r.onload = () => deliverImageUrl(r.result)
    r.readAsDataURL(p.file)
  }, [pendingImg, deliverImageUrl])
  const cancelPendingImg = useCallback(() => {
    const p = pendingImg
    if (p) { try { URL.revokeObjectURL(p.url) } catch {} }
    setPendingImg(null)
    sendSignal('activity', { kind: null })
  }, [pendingImg, sendSignal])

  const toggleRec = useCallback(async () => {
    if (rec) {
      try { mediaRef.current?.stop() } catch {}
      setRec(false)
      sendSignal('activity', { kind: null })
      return
    }
    sendSignal('activity', { kind: 'voice' })
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
          if (ws && ws.readyState === 1) { try { ws.send(JSON.stringify(room ? { t: 'room-audio', url: r.result } : { t: 'audio', url: r.result })) } catch {} }
        }
        r.readAsDataURL(blob)
      }
      mediaRef.current = mr
      mr.start()
      setRec(true)
      setNotice('')
    } catch {
      sendSignal('activity', { kind: null })
      setNotice('Mic blocked. Allow microphone permission to send voice notes.')
    }
  }, [rec, push, room, sendSignal])

  // ---- voice calls (WebRTC audio, signalled over the same socket) ----
  const fmtCall = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const closeCall = useCallback((silent) => {
    try { pcRef.current?.close() } catch {}
    pcRef.current = null
    try { micStreamRef.current?.getTracks().forEach(t => t.stop()) } catch {}
    micStreamRef.current = null
    offerRef.current = null
    if (callTimerRef.current) { clearInterval(callTimerRef.current); callTimerRef.current = null }
    setCall('idle')
    setCallSecs(0)
    setMuted(false)
    if (!silent) {
      try { wsRef.current?.readyState === 1 && wsRef.current.send(JSON.stringify({ t: 'call-end' })) } catch {}
    }
  }, [])

  const makePC = useCallback((ws, ice) => {
    const pc = new RTCPeerConnection({ iceServers: ice })
    pc.onicecandidate = (e) => {
      if (e.candidate && ws.readyState === 1) {
        try { ws.send(JSON.stringify({ t: 'ice', cand: e.candidate })) } catch {}
      }
    }
    pc.ontrack = (e) => {
      try {
        if (micRef.current) {
          micRef.current.srcObject = e.streams[0]
          micRef.current.play().catch(() => {})
        }
      } catch {}
    }
    pcRef.current = pc
    return pc
  }, [])

  const startCall = useCallback(async () => {
    const ws = wsRef.current
    if (!ws || ws.readyState !== 1) { setNotice('Connect to a stranger first, then call. 💕'); return }
    if (call !== 'idle') return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      micStreamRef.current = stream
      const pc = makePC(ws, await getIceServers())
      stream.getTracks().forEach(t => pc.addTrack(t, stream))
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      ws.send(JSON.stringify({ t: 'call-offer', sdp: offer }))
      setCall('calling')
      push('sys', 'text', '📞 Calling…')
    } catch {
      setNotice('Mic blocked. Allow microphone permission to call. 🎙️')
    }
  }, [call, makePC, push])

  const acceptCall = useCallback(async () => {
    const ws = wsRef.current
    const offer = offerRef.current
    if (!ws || !offer) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      micStreamRef.current = stream
      const pc = makePC(ws, await getIceServers())
      stream.getTracks().forEach(t => pc.addTrack(t, stream))
      await pc.setRemoteDescription(new RTCSessionDescription(offer))
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)
      ws.send(JSON.stringify({ t: 'call-answer', sdp: answer }))
      setCall('incall')
      setCallSecs(0)
      callTimerRef.current = setInterval(() => setCallSecs(s => s + 1), 1000)
      push('sys', 'text', '📞 Call connected 💕')
    } catch {
      setNotice('Mic blocked. Allow microphone permission to call. 🎙️')
      closeCall()
    }
  }, [makePC, push, closeCall])

  const declineCall = useCallback(() => {
    push('sys', 'text', 'Call declined.')
    closeCall()
  }, [closeCall, push])

  const endCall = useCallback(() => {
    push('sys', 'text', 'Call ended.')
    closeCall()
  }, [closeCall, push])

  const toggleMute = useCallback(() => {
    const track = micStreamRef.current?.getAudioTracks()?.[0]
    if (track) {
      track.enabled = !track.enabled
      setMuted(!track.enabled)
    }
  }, [])

  // ---- rooms: group voice channel (mesh audio, up to 8) ----
  const [rvOn, setRvOn] = useState(false)
  const [rvPeers, setRvPeers] = useState([]) // names in voice (excl self)
  const rvPCs = useRef({}) // name -> RTCPeerConnection
  const rvBoxRef = useRef(null)
  const rvOnRef = useRef(false)
  rvOnRef.current = rvOn
  const rvAudio = useCallback((name) => {
    let el = null
    try { el = document.getElementById('rv-a-' + name) } catch {}
    if (el) return el
    el = document.createElement('audio')
    el.id = 'rv-a-' + name
    el.autoplay = true
    el.controls = false
    try { (rvBoxRef.current || document.body).appendChild(el) } catch {}
    return el
  }, [])
  const rvDrop = useCallback((name) => {
    try { rvPCs.current[name]?.close() } catch {}
    delete rvPCs.current[name]
    try { document.getElementById('rv-a-' + name)?.remove() } catch {}
    setRvPeers(p => p.filter(x => x !== name))
  }, [])
  const rvMakePC = useCallback((ws, peer, ice) => {
    try { rvPCs.current[peer]?.close() } catch {}
    const pc = new RTCPeerConnection({ iceServers: ice })
    pc.onicecandidate = (e) => {
      if (e.candidate && ws.readyState === 1) {
        try { ws.send(JSON.stringify({ t: 'room-voice-ice', to: peer, cand: e.candidate })) } catch {}
      }
    }
    pc.ontrack = (e) => {
      try {
        const el = rvAudio(peer)
        el.srcObject = e.streams[0]
        el.play().catch(() => {})
      } catch {}
    }
    try { micStreamRef.current?.getTracks().forEach(t => pc.addTrack(t, micStreamRef.current)) } catch {}
    rvPCs.current[peer] = pc
    return pc
  }, [rvAudio])
  const rvOfferTo = useCallback(async (peer) => {
    const ws = wsRef.current
    if (!ws || ws.readyState !== 1 || !rvOnRef.current) return
    try {
      const pc = rvMakePC(ws, peer, await getIceServers())
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      ws.send(JSON.stringify({ t: 'room-voice-offer', to: peer, sdp: offer }))
      setRvPeers(p => p.includes(peer) ? p : [...p, peer])
    } catch {}
  }, [rvMakePC])
  const rvLeave = useCallback((silent) => {
    Object.keys(rvPCs.current).forEach(n => { try { rvPCs.current[n]?.close() } catch {} })
    rvPCs.current = {}
    try { micStreamRef.current?.getTracks().forEach(t => t.stop()) } catch {}
    micStreamRef.current = null
    try { rvBoxRef.current?.replaceChildren() } catch {}
    setRvPeers([])
    setRvOn(false)
    setMuted(false)
    if (!silent) {
      try { wsRef.current?.readyState === 1 && wsRef.current.send(JSON.stringify({ t: 'room-voice-leave' })) } catch {}
    }
  }, [])
  const rvToggle = useCallback(async () => {
    const ws = wsRef.current
    if (!ws || ws.readyState !== 1 || !room) { setNotice('Join a room first, then tap the phone for group voice.'); return }
    if (rvOnRef.current) { push('sys', 'text', 'Left voice channel.'); rvLeave(); return }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      micStreamRef.current = stream
      setMuted(false)
      setRvOn(true)
      ws.send(JSON.stringify({ t: 'room-voice-join' }))
      push('sys', 'text', 'Joined room voice — others hear you now. Tap 📞 again to leave.')
    } catch { setNotice('Mic blocked. Allow microphone permission for voice.') }
  }, [room, rvLeave, push])

  // ---- rooms: open a bare socket (no 1-1 join) then create/join ----
  const openRoomSocket = useCallback((action) => {
    if (!adult) { setNotice('Please confirm you are 18 or older.'); return }
    setNotice('')
    const run = () => {
      const ws = wsRef.current
      if (ws && ws.readyState === 1) { action(ws); return }
      try {
        const w2 = new WebSocket(BACKEND_URL)
        wsRef.current = w2
        w2.onopen = () => { action(w2) }
        w2.onmessage = wsRef.current?.onmessage || null
        // reuse main handler: attach minimal dispatcher by reopening via openSocket path
        w2.onmessage = async (ev) => {
          let m
          try { m = JSON.parse(ev.data) } catch { return }
          if (m.t === 'hello' && m.name) setMyName(m.name)
          else if (m.t === 'room-created') {
            setRoom({ id: m.id, members: m.members || [] })
            const link = 'https://www.uptools.in/stranger-chat/#room=' + m.id
            setRoomLink(link)
            try { window.location.hash = 'room=' + m.id } catch {}
            setStage('chat'); setMsgs([])
            setStatus('🏠 Room ' + m.id + ' created. Share the link — transport-encrypted (no E2E in rooms).')
            push('sys', 'text', '🏠 Room created. You are ' + (m.name || '') + '. Share the link to invite up to 8 people.')
          } else if (m.t === 'room-joined') {
            setRoom({ id: m.id, members: m.members || [] })
            setRoomLink('https://www.uptools.in/stranger-chat/#room=' + m.id)
            setStage('chat'); setMsgs([])
            setStatus('🏠 Joined room ' + m.id + ' — transport-encrypted (no E2E in rooms).')
            push('sys', 'text', '🏠 You joined as ' + (m.name || 'guest') + ' (' + ((m.members || []).length) + ' in room).')
          } else if (m.t === 'room-error') {
            const r = m.reason === 'bad password' ? 'Wrong room password. 💔'
              : m.reason === 'full' ? 'Room is full (8 max). 💔'
              : m.reason === 'expired' ? 'Room expired (24h). Create a new one. 💔'
              : m.reason === 'not in room' ? 'You left the room.' : 'Room not found — check the link. 💔'
            setNotice(r); setStatus(r)
          } else if (m.t === 'peer-joined' && m.name) {
            setRoom(rm => rm ? { ...rm, members: [...new Set([...(rm.members || []), m.name])] } : rm)
            push('sys', 'text', '🎉 ' + m.name + ' joined the room')
          } else if (m.t === 'peer-left' && m.name) {
            setRoom(rm => rm ? { ...rm, members: (rm.members || []).filter(x => x !== m.name) } : rm)
            push('sys', 'text', '👋 ' + m.name + ' left the room')
          } else if (m.t === 'room-msg' && typeof m.text === 'string') {
            push('them', 'text', (m.name ? m.name + ': ' : '') + m.text)
            hidePeerAct()
          } else if ((m.t === 'room-img' || m.t === 'room-audio') && m.url) {
            push('them', m.t === 'room-img' ? 'img' : 'audio', m.url)
            hidePeerAct()
          } else if (m.t === 'room-typing' && m.name) {
            if (m.state) showPeerAct(m.name + ' is typing…')
            else hidePeerAct()
          } else if (m.t === 'room-activity' && m.name) {
            if (m.kind === 'image') showPeerAct(m.name + ' is sending a photo…')
            else if (m.kind === 'voice') showPeerAct(m.name + ' is recording a voice note…')
            else hidePeerAct()
          } else if (m.t === 'room-voice-peers' && Array.isArray(m.peers)) {
            if (rvOnRef.current) { for (const p of m.peers.slice(0, 7)) { try { await rvOfferTo(p) } catch {} } }
            else setRvPeers(m.peers.slice(0, 7))
          } else if (m.t === 'room-voice-join' && m.name) {
            push('sys', 'text', '🎙 ' + m.name + ' joined voice')
            if (rvOnRef.current) { try { await rvOfferTo(m.name) } catch {} }
            else setRvPeers(p => p.includes(m.name) ? p : [...p, m.name])
          } else if (m.t === 'room-voice-offer' && m.from && m.sdp) {
            if (rvOnRef.current) {
              try {
                const ws0 = wsRef.current
                const pc = rvMakePC(ws0, m.from, await getIceServers())
                await pc.setRemoteDescription(new RTCSessionDescription(m.sdp))
                const ans = await pc.createAnswer()
                await pc.setLocalDescription(ans)
                ws0.send(JSON.stringify({ t: 'room-voice-answer', to: m.from, sdp: ans }))
                setRvPeers(p => p.includes(m.from) ? p : [...p, m.from])
              } catch {}
            }
          } else if (m.t === 'room-voice-answer' && m.from && m.sdp) {
            try { await rvPCs.current[m.from]?.setRemoteDescription(new RTCSessionDescription(m.sdp)) } catch {}
          } else if (m.t === 'room-voice-ice' && m.from && m.cand) {
            try { await rvPCs.current[m.from]?.addIceCandidate(new RTCIceCandidate(m.cand)) } catch {}
          } else if (m.t === 'room-voice-leave' && m.name) {
            rvDrop(m.name)
          }
        }
      } catch { setNotice('Connection failed. Try again.') }
    }
    run()
  }, [adult, push, rvOfferTo, rvMakePC, rvDrop])

  const createRoom = useCallback(() => {
    setMsgs([])
    openRoomSocket((ws) => { try { ws.send(JSON.stringify({ t: 'create-room', password: roomPw })) } catch {} })
  }, [openRoomSocket, roomPw])

  const joinRoom = useCallback(() => {
    const id = joinId.trim().toLowerCase()
    if (!id) { setNotice('Enter a room id from the shared link.'); return }
    setMsgs([])
    openRoomSocket((ws) => { try { ws.send(JSON.stringify({ t: 'join-room', id, password: joinPw })) } catch {} })
  }, [openRoomSocket, joinId, joinPw])

  // 6 built-in tap-to-send picture cards (local inline SVG, no network)
  const PICS = [
    { n: 'Love', svg: `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' rx='24' fill='#f43f5e'/><text x='60' y='82' font-size='56' text-anchor='middle'>❤️</text></svg>` },
    { n: 'Star', svg: `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' rx='24' fill='#f59e0b'/><text x='60' y='82' font-size='56' text-anchor='middle'>⭐</text></svg>` },
    { n: 'Like', svg: `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' rx='24' fill='#22c55e'/><text x='60' y='82' font-size='56' text-anchor='middle'>👍</text></svg>` },
    { n: 'Kiss', svg: `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' rx='24' fill='#ec4899'/><text x='60' y='82' font-size='56' text-anchor='middle'>💋</text></svg>` },
    { n: 'Fire', svg: `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' rx='24' fill='#f97316'/><text x='60' y='82' font-size='56' text-anchor='middle'>🔥</text></svg>` },
    { n: 'Party', svg: `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' rx='24' fill='#8b5cf6'/><text x='60' y='82' font-size='56' text-anchor='middle'>🎉</text></svg>` },
  ]
  const sendPic = useCallback((p) => {
    const url = 'data:image/svg+xml;utf8,' + encodeURIComponent(p.svg)
    push('me', 'img', url)
    sendSignal('activity', { kind: 'image' })
    setTimeout(() => sendSignal('activity', { kind: null }), 1500)
    const ws = wsRef.current
    if (ws && ws.readyState === 1) {
      try { ws.send(JSON.stringify(room ? { t: 'room-img', url } : { t: 'img', url })) } catch {}
    }
  }, [push, room, sendSignal])

  const doNext = useCallback(() => {
    closeCall()
    try { rvLeave(true) } catch {}
    hidePeerAct()
    setPendingImg(null)
    typingOnRef.current = false
    pendingRef.current = []
    setNotice('')
    const ws = wsRef.current
    if (ws && ws.readyState === 1) { try { ws.send(JSON.stringify({ t: 'next' })) } catch {} }
    setMsgs([])
    setStage('matching')
    setStatus('Finding someone new… 💕')
  }, [closeCall, rvLeave])

  const doEnd = useCallback(() => {
    closeCall()
    try { rvLeave(true) } catch {}
    hidePeerAct()
    setPendingImg(null)
    typingOnRef.current = false
    try { wsRef.current?.send(JSON.stringify(room ? { t: 'room-leave' } : { t: 'leave' })); wsRef.current?.close() } catch {}
    wsRef.current = null
    aesRef.current = null
    pendingRef.current = []
    setRoom(null)
    setRoomLink('')
    try { history.replaceState(null, '', window.location.pathname) } catch {}
    setMsgs([])
    setStage('gate')
    setStatus('Ready — press Start to meet a stranger. 💕')
  }, [closeCall, room, rvLeave])

  const doReport = useCallback(() => {
    closeCall()
    const ws = wsRef.current
    if (ws && ws.readyState === 1) { try { ws.send(JSON.stringify({ t: 'report' })) } catch {} }
    push('sys', 'text', 'Reported and blocked. Never share personal info with strangers.')
    setMsgs([])
    setStage('matching')
    setStatus('Reported. Finding someone new…')
  }, [push, closeCall])

  return (
    <ToolLayout
      title="Stranger Chat - Talk to Strangers Online"
      desc="Anonymous stranger chat: talk to strangers online with text, images, voice notes and voice calls. No sign-up, 18+ only, encrypted. Free."
      icon="💘" iconBg="rgba(244,63,94,0.10)"
      category="social" slug="stranger-chat"
      faq={[
        { q: 'How does stranger chat work?', a: 'Confirm 18+, pick I-am and who you want to talk to, press Start. The server pairs you 1-1 with a stranger. Text, images and voice notes are supported. Press Next anytime.' },
        { q: 'Is it free? Do I need an account?', a: 'Yes, completely free with no sign-up and no name required. Just select Male or Female and start.' },
        { q: 'Is it 18+ only?', a: 'Yes. This page is strictly 18+. You must confirm your age before chatting, per our safety policy.' },
        { q: 'Is my chat private?', a: 'Random 1-1 chats use ECDH + AES-GCM end-to-end encryption. The server only relays ciphertext and stores nothing — no logs, no images, no recordings.' },
        { q: 'What are group rooms?', a: 'Create a room (optional password) and share the link — up to 8 people, link lasts 24h. Rooms are transport-encrypted (TLS) but NOT end-to-end encrypted, since the server relays plain text to the group.' },
        { q: 'What if someone misbehaves?', a: 'Press Report instantly: it blocks them and finds you someone new. Never share your phone, address, OTPs or photos with ID. For help mail grievance@uptools.in.' },
        { q: 'India IT Rules compliance?', a: 'We follow IT Rules 2021 for intermediaries: 18+ gating, report/block tools, no content storage, and a grievance contact (grievance@uptools.in) with 72-hour acknowledgement.' },
      ]}
      howItWorks={[
        'Confirm 18+, choose I-am (Male/Female) and who to meet.',
        'Press Start — the server pairs you with a stranger 1-1.',
        'Chat with text, images and voice notes. Tap 📞 for a live voice call in the same style.',
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
        {/* Hero — bold, playful, solid colour */}
        <div className="rounded-3xl overflow-hidden" style={{ background: ROSE_SOLID }}>
          <div className="px-5 py-6 sm:px-7 sm:py-7">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/25 text-[11px] font-extrabold text-white tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                {online === null ? 'connecting…' : `${online} online now`}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-black/25 text-[11px] font-extrabold text-white tracking-wide">18+ · NO SIGN-UP</span>
            </div>
            <p className="text-3xl sm:text-4xl font-black text-white m-0 mt-3 leading-[1.05] tracking-tight">Bored?<br />Say hi to<br />someone new.</p>
            <p className="text-[13px] text-white/90 m-0 mt-2 font-medium">Anonymous 1-1 chat, group rooms, voice notes and calls. Nothing stored, ever.</p>
            <div className="flex items-center mt-4">
              <div className="flex -space-x-2">
                {[['A', '#7c3aed'], ['R', '#059669'], ['S', '#d97706'], ['P', '#2563eb'], ['+', '#111827']].map(([t, c]) => (
                  <span key={t} className="w-8 h-8 rounded-full border-2 border-white/70 flex items-center justify-center text-xs font-black text-white" style={{ background: c }}>{t}</span>
                ))}
              </div>
              <span className="text-[11px] font-bold text-white/90 ml-2">strangers waiting to talk</span>
            </div>
          </div>
          <div className="px-5 sm:px-7 pb-5 space-y-2">
            <div className="flex justify-start">
              <div className="max-w-[80%] bg-white text-slate-800 text-[13px] font-medium rounded-2xl rounded-tl-md px-3.5 py-2 shadow">hey! anyone here love cricket?</div>
            </div>
            <div className="flex justify-end">
              <div className="max-w-[80%] bg-[#111827] text-white text-[13px] font-medium rounded-2xl rounded-tr-md px-3.5 py-2 shadow">yess! match tonight — you watching?</div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            [<PersonGlyph size={18} />, '1. Pick', 'Male / Female / Any'],
            [<BoltGlyph size={18} />, '2. Match', 'Paired in seconds'],
            [<ChatGlyph size={18} />, '3. Chat', 'Text, voice, rooms'],
          ].map(([icon, t, s], i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-[#111827] px-3 py-3 text-center">
              <div className="w-9 h-9 mx-auto rounded-xl flex items-center justify-center text-white" style={{ background: [ROSE_SOLID, TEAL_SOLID, '#7c3aed'][i] }}>{icon}</div>
              <p className="text-xs font-extrabold text-white m-0 mt-1.5">{t}</p>
              <p className="text-[11px] text-slate-400 m-0">{s}</p>
            </div>
          ))}
        </div>
        <div className="text-xs text-slate-300 bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 leading-relaxed">{status}</div>
        {notice && <div className="text-xs text-amber-200 bg-amber-500/10 border border-amber-500/25 rounded-xl px-4 py-2.5">{notice}</div>}

        {stage === 'gate' && (
          <div className="border border-white/10 rounded-3xl p-5 sm:p-6 space-y-5 bg-[#111827]">
            <div className="text-center">
              <p className="text-base font-extrabold text-white m-0">Who do you want to meet?</p>
              <p className="text-xs text-slate-400 m-0 mt-1">Takes 5 seconds — skip anyone with Next.</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <p className="col-span-2 text-[11px] font-extrabold text-slate-400 tracking-wide m-0">I AM</p>
              {['M', 'F'].map(v => (
                <button key={v} onClick={() => setMe(v)}
                  className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-extrabold border-2 transition-all cursor-pointer ${me === v ? 'text-white border-transparent' : 'text-slate-300 border-white/10 bg-white/[0.03] hover:border-white/25'}`}
                  style={me === v ? { background: ROSE_SOLID } : undefined}>
                  <PersonGlyph size={18} /> {v === 'M' ? 'Male' : 'Female'}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <p className="col-span-3 text-[11px] font-extrabold text-slate-400 tracking-wide m-0">I WANT TO MEET</p>
              {[['ANY', 'Any'], ['M', 'Male'], ['F', 'Female']].map(([v, l]) => (
                <button key={v} onClick={() => setWant(v)}
                  className={`flex items-center justify-center gap-1.5 py-3 rounded-2xl text-sm font-extrabold border-2 transition-all cursor-pointer ${want === v ? 'text-white border-transparent' : 'text-slate-300 border-white/10 bg-white/[0.03] hover:border-white/25'}`}
                  style={want === v ? { background: TEAL_SOLID } : undefined}>
                  {l}
                </button>
              ))}
            </div>
            <label className="flex items-start gap-2.5 text-[13px] text-slate-200 cursor-pointer bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-3">
              <input type="checkbox" checked={adult} onChange={e => setAdult(e.target.checked)} className="mt-0.5 accent-rose-500 w-4 h-4 shrink-0" />
              <span>I am 18 or older and agree to the rules. Be kind, stay anonymous.</span>
            </label>
            <button onClick={connect} className="w-full py-4 rounded-2xl text-base font-black text-white hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2" style={{ background: ROSE_SOLID }}>
              Start chatting — it is free <span aria-hidden="true">→</span>
            </button>
            <p className="text-center text-[11px] text-slate-500 m-0 flex items-center justify-center gap-1.5"><ShieldGlyph size={13} /> Encrypted · No account · Nothing saved</p>
            {/* rooms */}
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 space-y-3 overflow-hidden">
              <p className="text-[13px] font-bold text-white m-0">Prefer a group vibe? <span className="font-normal text-slate-400">Up to 8 friends, link lasts 24h.</span></p>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setRoomPanel(roomPanel === 'create' ? null : 'create')} className="py-2.5 rounded-xl text-xs font-black text-white cursor-pointer" style={{ background: ROSE_SOLID }}>Create Room</button>
                <button onClick={() => setRoomPanel(roomPanel === 'join' ? null : 'join')} className="py-2.5 rounded-xl text-xs font-bold bg-white/[0.06] border border-white/[0.08] text-slate-200">Join Room</button>
              </div>
              {roomPanel === 'create' && (
                <div className="space-y-2">
                  <input value={roomPw} onChange={e => setRoomPw(e.target.value)} type="password" placeholder="Room password (optional)"
                    className="w-full min-w-0 bg-black/30 border border-rose-500/20 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-rose-500/50" />
                  <button onClick={createRoom} className="w-full py-2.5 rounded-xl text-xs font-black text-white cursor-pointer" style={{ background: ROSE_SOLID }}>Create + Copy Link</button>
                </div>
              )}
              {roomPanel === 'join' && (
                <div className="space-y-2">
                  <input value={joinId} onChange={e => setJoinId(e.target.value)} placeholder={joinId ? `Room id: ${joinId}` : 'Room id (from shared link)'}
                    className="w-full min-w-0 bg-black/30 border border-rose-500/20 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-rose-500/50" />
                  <input value={joinPw} onChange={e => setJoinPw(e.target.value)} type="password" placeholder="Password (if any)"
                    className="w-full min-w-0 bg-black/30 border border-rose-500/20 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-rose-500/50" />
                  <button onClick={joinRoom} className="w-full py-2.5 rounded-xl text-xs font-bold bg-white/[0.06] border border-white/[0.08] text-slate-200">Join Room</button>
                </div>
              )}
            </div>
          </div>
        )}

        {stage === 'matching' && (
          <div className="relative text-center py-12 px-6 rounded-2xl border border-rose-500/25 bg-[#1a1020] overflow-hidden">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-rose-500/15 animate-ping" />
              <div className="relative w-14 h-14 rounded-full flex items-center justify-center text-white" style={{ background: ROSE_SOLID }}>
                <ChatGlyph size={24} />
              </div>
            </div>
            <p className="text-[15px] text-white mt-5 font-bold m-0">Finding someone you will like…</p>
            <p className="text-xs text-slate-400 mt-1 m-0">Keep this tab open — most matches land in seconds.</p>
            <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-[11px] font-semibold text-slate-200">
              <BoltGlyph size={13} /> Tip: say more than “hi” — mention a song, game or city
            </div>
            <div className="flex gap-2 justify-center mt-5 flex-wrap">
              <button onClick={connect} className="text-xs font-bold px-6 py-2.5 rounded-full text-white cursor-pointer" style={{ background: ROSE_SOLID }}>Retry</button>
              <button onClick={doEnd} className="text-xs px-5 py-2.5 rounded-full bg-white/[0.06] border border-white/10 text-slate-300 cursor-pointer">Cancel</button>
            </div>
          </div>
        )}

        {stage === 'chat' && (
          <div className="border border-white/10 rounded-3xl overflow-hidden flex flex-col h-[calc(100dvh-13rem)] min-h-[480px] max-h-[720px]" style={{ background: '#0b141a' }}>
            <div className="h-14 px-3 flex items-center gap-2 shrink-0" style={{ background: '#1f2c34' }}>
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-base text-white font-bold" style={{ background: '#00a884' }}>S</div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-black" />
              </div>
              <div className="min-w-0 leading-tight">
                <div className="text-[14px] font-semibold text-white truncate">{room ? `Room ${room.id}` : 'Stranger'}</div>
                <div className="text-[11px] text-slate-400">{room ? `${(room.members || []).length}/8 online` : 'online'}</div>
              </div>
              <div className="ml-auto flex items-center gap-1 shrink-0">
                {!room && <button onClick={doNext} title="Next stranger" className="h-8 px-2.5 rounded-lg text-xs font-bold text-slate-200 hover:bg-white/10 active:scale-95 transition-all">Next</button>}
                {!room && <button onClick={doReport} title="Report" className="h-8 px-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-red-300 hover:bg-white/10 active:scale-95 transition-all">Report</button>}
                <button onClick={doEnd} title="End chat" className="h-8 px-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all">End</button>
              </div>
            </div>
            {roomLink && room && (
              <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 shrink-0 overflow-hidden" style={{ background: '#1f2c34' }}>
                <span className="text-[11px] text-slate-300 truncate flex-1 min-w-0">{roomLink}</span>
                <button onClick={() => { try { navigator.clipboard.writeText(roomLink); setNotice('Room link copied — share it!') } catch {} }} className="text-[11px] px-2.5 py-1 rounded-full text-white font-bold shrink-0" style={{ background: '#00a884' }}>Copy</button>
              </div>
            )}
            {room && (rvOn || rvPeers.length > 0) && (
              <div className="flex items-center gap-2 px-4 py-2 border-b border-green-500/20 shrink-0" style={{ background: '#0f2a22' }}>
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
                <span className="text-[11px] text-green-200 font-bold truncate flex-1 min-w-0">{rvOn ? `In voice (${rvPeers.length + 1})` : `${rvPeers.length} in voice`} — tap 📞 to {rvOn ? 'leave' : 'join'}</span>
                {rvOn && <button onClick={toggleMute} className="text-[11px] px-2.5 py-1 rounded-full bg-white/10 text-white font-bold shrink-0">{muted ? 'Unmute' : 'Mute'}</button>}
                {rvOn && <button onClick={() => rvLeave()} className="text-[11px] px-2.5 py-1 rounded-full bg-red-500/80 text-white font-bold shrink-0">Leave</button>}
              </div>
            )}
            <div ref={rvBoxRef} className="hidden" aria-hidden="true" />
            <div ref={listRef} onScroll={onScrollList} className="flex-1 overflow-y-auto px-4 py-3 space-y-2" style={{ scrollbarGutter: 'stable' }}>
              {msgs.length === 0 && <p className="text-xs text-slate-500 text-center pt-10">Say hi to start something beautiful. 💕</p>}
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.who === 'me' ? 'justify-end' : m.who === 'sys' ? 'justify-center' : 'justify-start'}`}>
                  {m.kind === 'text' && m.who === 'sys' && (
                    <div className="inline-block max-w-[90%] px-3 py-1 rounded-full text-[11px] font-medium text-center text-slate-400 bg-white/[0.05] border border-white/[0.08]">
                      {m.body}
                    </div>
                  )}
                  {m.kind === 'text' && m.who !== 'sys' && (
                    <div className={`max-w-[78%] break-words px-3 py-2 text-[14px] leading-relaxed shadow-sm ${m.who === 'me' ? 'rounded-lg rounded-tr-none text-white' : 'rounded-lg rounded-tl-none text-slate-100'}`}
                      style={m.who === 'me' ? { background: '#005c4b' } : { background: '#1f2c34' }}>
                      {m.body}
                      <span className={`inline-block float-right ml-2 mt-1.5 select-none text-[10px] font-medium ${m.who === 'me' ? 'text-white/70' : 'text-slate-500'}`}>{m.at}</span>
                    </div>
                  )}
                  {m.kind === 'img' && <img src={m.body} alt="shared" className="max-w-[70%] rounded-2xl border border-rose-500/20" />}
                  {m.kind === 'audio' && <audio src={m.body} controls className="max-w-[75%] h-9" />}
                </div>
              ))}
            </div>
            <div className="shrink-0" style={{ background: '#1f2c34' }}>
              {showPics && (
                <div className="flex gap-2 px-3 py-2 border-b border-white/10 overflow-x-auto" style={{ background: '#1f2c34' }}>
                  {PICS.map((p) => (
                    <button key={p.n} onClick={() => { sendPic(p); setShowPics(false) }} title={'Send ' + p.n}
                      className="shrink-0 w-9 h-9 rounded-xl overflow-hidden border border-white/10 hover:border-green-500/60 hover:scale-105 active:scale-95 transition-all">
                      <img src={'data:image/svg+xml;utf8,' + encodeURIComponent(p.svg)} alt={p.n} className="w-full h-full" />
                    </button>
                  ))}
                </div>
              )}
              {peerAct && (
                <div className="px-4 pt-2 flex justify-start max-w-full" style={{ background: '#1f2c34' }}>
                  {peerAct.indexOf('typing') >= 0 ? (
                    <div className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg rounded-tl-none w-fit" style={{ background: '#1f2c34', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '-0.3s' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '-0.15s' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                    </div>
                  ) : (
                    <div className="max-w-full truncate text-[11px] italic text-slate-400 bg-white/[0.05] border border-white/[0.08] rounded-full px-3 py-1">{peerAct}</div>
                  )}
                </div>
              )}
              {pendingImg && (
                <div className="mx-3 mb-1 rounded-2xl border border-rose-500/25 bg-black/40 p-3 flex flex-wrap items-center gap-3 overflow-hidden">
                  <img src={pendingImg.url} alt="preview" className="w-14 h-14 shrink-0 rounded-xl object-cover border border-white/10" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white">Send this photo?</div>
                    <div className="text-[11px] text-slate-400">Compressed is smaller and sends faster.</div>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    <button onClick={sendImgCompressed} className="text-[11px] font-black px-3 py-1.5 rounded-full text-white shrink-0 cursor-pointer" style={{ background: ROSE_SOLID }}>Compressed</button>
                    <button onClick={sendImgOriginal} className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-white/[0.08] border border-white/10 text-slate-200 shrink-0">Original</button>
                    <button onClick={cancelPendingImg} className="text-[11px] px-3 py-1 text-slate-500 shrink-0">Cancel</button>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-1.5 px-2.5 py-2" style={{ background: '#1f2c34' }}>
              <button onClick={() => setShowPics(v => !v)} title="Stickers" className={`w-9 h-9 shrink-0 flex items-center justify-center rounded-full transition-all active:scale-95 cursor-pointer ${showPics ? 'text-green-300 bg-white/10' : 'text-slate-400 hover:text-green-300 hover:bg-white/10'}`}><SmileGlyph /></button>
              <label className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full text-slate-400 hover:text-green-300 hover:bg-white/10 active:scale-95 transition-all cursor-pointer" title="Send image">
                <ImgGlyph /><input type="file" accept="image/*" className="hidden" onChange={e => { sendImage(e.target.files?.[0]); e.target.value = '' }} />
              </label>
              <button onClick={toggleRec} title="Voice note" className={`w-9 h-9 shrink-0 flex items-center justify-center rounded-full transition-all active:scale-95 cursor-pointer ${rec ? 'bg-green-500/20 text-green-300 animate-pulse' : 'text-slate-400 hover:text-green-300 hover:bg-white/10'}`}><MicGlyph /></button>
              {!room && <button onClick={startCall} title="Voice call" className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full text-slate-400 hover:text-green-300 hover:bg-white/10 active:scale-95 transition-all cursor-pointer"><PhoneGlyph /></button>}
              {room && <button onClick={rvToggle} title={rvOn ? 'Leave group voice' : 'Join group voice'} className={`w-9 h-9 shrink-0 flex items-center justify-center rounded-full active:scale-95 transition-all cursor-pointer ${rvOn ? 'bg-green-500/25 text-green-300 animate-pulse' : 'text-slate-400 hover:text-green-300 hover:bg-white/10'}`}><PhoneGlyph /></button>}
              <input value={draft} onChange={e => onDraftChange(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') sendText() }}
                placeholder="Message" className="flex-1 min-w-0 rounded-full px-4 py-2.5 text-base sm:text-sm text-white outline-none placeholder:text-slate-500 focus:border-green-500/50 transition-all" style={{ background: '#2a3942', border: '1px solid rgba(255,255,255,0.06)' }} />
              <button onClick={sendText} title="Send" className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-white shadow-md hover:scale-105 active:scale-95 transition-transform text-base" style={{ background: '#00a884' }}>➤</button>
              </div>
            </div>
          </div>
        )}

        {/* Hidden remote-audio element for call sound */}
        <audio ref={micRef} autoPlay playsInline className="hidden" />

        {/* Phone-call style window */}
        {call !== 'idle' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-5" style={{ background: 'rgba(20,8,16,0.97)' }}>
            <div className="w-full max-w-xs text-center rounded-3xl border border-rose-500/25 p-7 bg-[#1a1020]">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full bg-rose-500/25 animate-ping" />
                <div className="relative w-24 h-24 rounded-full flex items-center justify-center text-white border-2 border-rose-400/50"
                  style={{ background: ROSE_SOLID }}><ChatGlyph size={40} /></div>
              </div>
              <p className="text-lg font-black text-white m-0">Stranger</p>
              <p className="text-sm text-rose-200/90 m-0 mt-1 mb-6">
                {call === 'calling' && 'Calling…'}
                {call === 'incoming' && 'Incoming call…'}
                {call === 'incall' && `${fmtCall(callSecs)}`}
              </p>
              {call === 'incoming' ? (
                <div className="flex gap-3 justify-center">
                  <button onClick={declineCall} className="flex-1 py-3 rounded-full text-sm font-black text-white cursor-pointer"
                    style={{ background: '#dc2626' }}>Decline</button>
                  <button onClick={acceptCall} className="flex-1 py-3 rounded-full text-sm font-black text-white animate-pulse cursor-pointer"
                    style={{ background: '#16a34a' }}>Accept</button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-4">
                  <button onClick={toggleMute} title={muted ? 'Unmute' : 'Mute'}
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-white border cursor-pointer ${muted ? 'bg-amber-500/25 border-amber-500/40' : 'bg-white/[0.08] border-white/15'}`}>
                    <MicGlyph size={22} />
                  </button>
                  <button onClick={endCall} title="End call"
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white cursor-pointer"
                    style={{ background: '#dc2626' }}><PhoneGlyph size={26} /></button>
                  <button onClick={() => setNotice('Chat stays here — end the call to type again.')} title="Keypad"
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white bg-white/[0.08] border border-white/15 cursor-pointer"><ChatGlyph size={22} /></button>
                </div>
              )}
              <p className="text-[11px] text-rose-200/60 m-0 mt-5">Voice runs peer-to-peer, never stored</p>
            </div>
          </div>
        )}

        <div className="bg-[#111827] border border-white/10 rounded-2xl p-5">
          <p className="font-bold text-white text-[13px] m-0 mb-2">A fun chat is a safe chat — 18+ only</p>
          <div className="grid sm:grid-cols-2 gap-2 text-xs text-slate-300 leading-relaxed">
            <div className="flex gap-2"><span className="text-rose-400 font-bold">01</span><span>Be kind. No nudity, harassment or spam — Report blocks instantly.</span></div>
            <div className="flex gap-2"><span className="text-rose-400 font-bold">02</span><span>Stay anonymous. Never share phone, address, OTPs or ID photos.</span></div>
            <div className="flex gap-2"><span className="text-rose-400 font-bold">03</span><span>1-1 chats are end-to-end encrypted and never stored.</span></div>
            <div className="flex gap-2"><span className="text-rose-400 font-bold">04</span><span>Need help? grievance@uptools.in — reply within 72h (IT Rules 2021).</span></div>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
