// Stranger-chat signalling server for Oracle VM.
// - Anonymous 1-1 pairing by gender preference (self-declared M/F, 18+ only, client attests).
// - Relays only: ciphertext, ECDH public keys, WebRTC offer/answer/ICE, image/voice-note blobs (<2MB).
// - Stores NOTHING: no chat logs, no images, no recordings. In-memory sockets only.
// - Rate limits + report/block + auto-disconnect on abuse.
// Run: npm install && PORT=8080 node server.js  (Caddy reverse-proxies wss://chat.uptools.in -> 127.0.0.1:8080)
'use strict'
const http = require('http')
const { WebSocketServer } = require('ws')

const PORT = process.env.PORT || 8080
const MAX_MSG = 2 * 1024 * 1024 // 2MB cap per payload
const RATE_WINDOW = 10_000
const RATE_MAX = 20 // msgs per window per socket

// waiters: [{ws, me, want}]  me: 'M'|'F', want: 'M'|'F'|'ANY'
const waiters = []
const pairs = new Map() // ws -> partner ws
const meta = new Map() // ws -> {me, want, adult, blocked:Set, hits:[timestamps], reports: n}

function send(ws, obj) {
  if (ws.readyState === 1) ws.send(JSON.stringify(obj))
}
function compat(a, b) {
  // a wants b and b wants a
  const aOk = a.want === 'ANY' || a.want === b.me
  const bOk = b.want === 'ANY' || b.want === a.me
  return aOk && bOk
}
function tryMatch(ws) {
  const m = meta.get(ws)
  if (!m || !m.adult || pairs.has(ws)) return
  for (let i = 0; i < waiters.length; i++) {
    const w = waiters[i]
    if (w.ws === ws || w.ws.readyState !== 1) continue
    const om = meta.get(w.ws)
    if (!om || pairs.has(w.ws)) continue
    if (m.blocked.has(w.id) || om.blocked.has(m.id)) continue
    if (compat({ me: m.me, want: m.want }, { me: om.me, want: om.want })) {
      waiters.splice(i, 1)
      const qi = waiters.findIndex(x => x.ws === ws)
      if (qi >= 0) waiters.splice(qi, 1)
      pairs.set(ws, w.ws)
      pairs.set(w.ws, ws)
      send(ws, { t: 'paired' })
      send(w.ws, { t: 'paired' })
      return
    }
  }
  if (!waiters.some(x => x.ws === ws)) waiters.push({ ws, id: m.id })
}
function unpair(ws, notify = true) {
  const p = pairs.get(ws)
  pairs.delete(ws)
  if (p) {
    pairs.delete(p)
    if (notify) send(p, { t: 'partner-left' })
  }
  const i = waiters.findIndex(x => x.ws === ws)
  if (i >= 0) waiters.splice(i, 1)
}

let nextId = 1
const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ ok: true, waiting: waiters.length, paired: pairs.size / 2 }))
    return
  }
  res.writeHead(404).end('not found')
})
const wss = new WebSocketServer({ server, maxPayload: MAX_MSG + 1024 })

wss.on('connection', (ws) => {
  const id = 'u' + (nextId++)
  meta.set(ws, { id, me: null, want: 'ANY', adult: false, blocked: new Set(), hits: [], reports: 0 })
  send(ws, { t: 'hello', id })

  ws.on('message', (raw) => {
    let m
    try { m = JSON.parse(raw.toString()) } catch { return }
    const st = meta.get(ws)
    if (!st) return
    // rate limit (skip for queue/join)
    if (m.t !== 'join' && m.t !== 'next') {
      const now = Date.now()
      st.hits = st.hits.filter(x => now - x < RATE_WINDOW)
      if (st.hits.length >= RATE_MAX) { send(ws, { t: 'warn', msg: 'slow down' }); return }
      st.hits.push(now)
    }
    const partner = pairs.get(ws)
    switch (m.t) {
      case 'join': {
        // {me:'M'|'F', want:'M'|'F'|'ANY', adult:true}
        if (m.adult !== true) { send(ws, { t: 'error', msg: '18+ only' }); ws.close(); return }
        if (m.me !== 'M' && m.me !== 'F') { send(ws, { t: 'error', msg: 'select an option' }); return }
        st.me = m.me
        st.want = ['M', 'F', 'ANY'].includes(m.want) ? m.want : 'ANY'
        st.adult = true
        tryMatch(ws)
        if (!pairs.has(ws)) send(ws, { t: 'waiting' })
        break
      }
      case 'next': {
        unpair(ws)
        tryMatch(ws)
        if (!pairs.has(ws)) send(ws, { t: 'waiting' })
        break
      }
      case 'leave': {
        unpair(ws, false)
        send(ws, { t: 'left' })
        break
      }
      case 'report': {
        // report partner; after 1 report auto-unpair + block; partner strike counted
        if (partner) {
          const pm = meta.get(partner)
          if (pm) {
            pm.reports = (pm.reports || 0) + 1
            st.blocked.add(pm.id)
            if (pm.reports >= 3) { try { partner.close() } catch {} }
          }
        }
        unpair(ws, false)
        if (partner) send(partner, { t: 'partner-left' })
        send(ws, { t: 'reported' })
        tryMatch(ws)
        break
      }
      // relayed verbatim to partner (ciphertext / keys / webrtc signalling / blobs)
      case 'key':
      case 'msg':
      case 'img':
      case 'audio':
      case 'call-offer':
      case 'call-answer':
      case 'ice':
      case 'call-end':
      case 'typing': {
        if (!partner || partner.readyState !== 1) { send(ws, { t: 'partner-left' }); return }
        if (raw.length > MAX_MSG) { send(ws, { t: 'warn', msg: 'file too large (2MB max)' }); return }
        partner.send(raw.toString())
        break
      }
      default:
        break
    }
  })

  ws.on('close', () => {
    const p = pairs.get(ws)
    unpair(ws)
    if (p && p.readyState === 1) send(p, { t: 'partner-left' })
    meta.delete(ws)
    // freed partner re-queues only when they press Next (keeps consent explicit)
  })
})

server.listen(PORT, () => console.log('stranger-backend listening on ' + PORT))
