// Stranger-chat signalling server for Oracle VM.
// - Anonymous 1-1 pairing by gender preference (self-declared M/F, 18+ only, client attests).
// - Plus in-memory group rooms (cap 8, 24h expiry, optional sha256 password).
// - Relays only: ciphertext, ECDH public keys, WebRTC offer/answer/ICE, image/voice-note blobs (<2MB).
// - Stores NOTHING durable: no chat logs, no images, no recordings. In-memory sockets only.
// Run: npm install && PORT=8080 node server.js  (Caddy reverse-proxies wss://chat.uptools.in -> 127.0.0.1:8080)
'use strict'
const http = require('http')
const crypto = require('crypto')
const { WebSocketServer } = require('ws')

const PORT = process.env.PORT || 8080
const MAX_MSG = 2 * 1024 * 1024 // 2MB cap per payload
const RATE_WINDOW = 10_000
const RATE_MAX = 20 // msgs per window per socket
const ROOM_CAP = 8
const ROOM_TTL = 24 * 3600 * 1000

// waiters: [{ws, me, want}]  me: 'M'|'F', want: 'M'|'F'|'ANY'
const waiters = []
const pairs = new Map() // ws -> partner ws
const credHits = new Map() // ip -> [timestamps] for /turn-cred throttle
const meta = new Map() // ws -> {me, want, adult, blocked:Set, hits:[timestamps], reports: n, name, roomId}

// ---- rooms: id -> {id, passwordHash|null, expiresAt, members:Set<ws>, timer} ----
const rooms = new Map()
const ROOM_CHARS = 'abcdefghjkmnpqrstuvwxyz23456789'
function newRoomId() {
  let id
  do {
    id = ''
    for (let i = 0; i < 6; i++) id += ROOM_CHARS[crypto.randomInt(ROOM_CHARS.length)]
  } while (rooms.has(id))
  return id
}
function guestName() {
  let s = ''
  for (let i = 0; i < 4; i++) s += ROOM_CHARS[crypto.randomInt(ROOM_CHARS.length)]
  return 'Guest-' + s
}
function roomMembers(room) {
  const out = []
  for (const ws of room.members) {
    const m = meta.get(ws)
    if (m && ws.readyState === 1) out.push(m.name || 'Guest-????')
  }
  return out
}
function roomBroadcast(room, except, obj) {
  const s = JSON.stringify(obj)
  for (const ws of room.members) {
    if (ws !== except && ws.readyState === 1) { try { ws.send(s) } catch {} }
  }
}
function destroyRoom(id) {
  const r = rooms.get(id)
  if (!r) return
  if (r.timer) clearTimeout(r.timer)
  rooms.delete(id)
}
function leaveRoom(ws, notify = true) {
  const st = meta.get(ws)
  if (!st || !st.roomId) return
  const room = rooms.get(st.roomId)
  const name = st.name || 'Guest-????'
  st.roomId = null
  if (!room) return
  room.members.delete(ws)
  if (notify) roomBroadcast(room, ws, { t: 'peer-left', name })
  if (room.members.size === 0) destroyRoom(room.id)
}

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
      // swap ECDH public keys so both sides derive the same AES key (E2E)
      try {
        const aPub = meta.get(ws)?.pub
        const bPub = meta.get(w.ws)?.pub
        if (bPub) send(ws, { t: 'key', pub: bPub })
        if (aPub) send(w.ws, { t: 'key', pub: aPub })
      } catch {}
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
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS' })
    res.end()
    return
  }
  if (req.url === '/health' || req.url.split('?')[0] === '/health') {
    res.writeHead(200, { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    res.end(JSON.stringify({ ok: true, online: meta.size, waiting: waiters.length, paired: pairs.size / 2, rooms: rooms.size }))
    return
  }
  if (req.url.split('?')[0] === '/turn-cred') {
    // Short-lived TURN password (HMAC of expiry username). Secret lives only on this VM.
    const secret = process.env.TURN_SECRET || ''
    if (!secret) { res.writeHead(503).end('not configured'); return }
    const ip = req.socket.remoteAddress || '?'
    const now = Date.now()
    credHits.set(ip, (credHits.get(ip) || []).filter(t => now - t < 60000))
    if (credHits.get(ip).length >= 30) { res.writeHead(429).end('slow down'); return }
    credHits.get(ip).push(now)
    const ttl = 24 * 3600
    const username = (Math.floor(now / 1000) + ttl) + ':upchat'
    const password = crypto.createHmac('sha1', secret).update(username).digest('base64')
    res.writeHead(200, { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    res.end(JSON.stringify({ username, password, ttl }))
    return
  }
  res.writeHead(404).end('not found')
})
const wss = new WebSocketServer({ server, maxPayload: MAX_MSG + 1024 })

// hourly sweep for expired rooms
setInterval(() => {
  const now = Date.now()
  for (const [id, r] of rooms) {
    if (r.expiresAt <= now) {
      roomBroadcast(r, null, { t: 'room-error', reason: 'expired' })
      for (const ws of r.members) {
        const st = meta.get(ws)
        if (st) st.roomId = null
      }
      destroyRoom(id)
    }
  }
}, 3600_000)

wss.on('connection', (ws) => {
  const id = 'u' + (nextId++)
  meta.set(ws, { id, me: null, want: 'ANY', adult: false, blocked: new Set(), hits: [], reports: 0, name: guestName(), roomId: null })
  send(ws, { t: 'hello', id, name: meta.get(ws).name })

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
        // store partner ECDH public key (small JWK) for the key swap on pair
        if (m.pub && typeof m.pub === 'object') {
          try {
            const s = JSON.stringify(m.pub)
            if (s.length < 3000) st.pub = m.pub
          } catch {}
        }
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
        leaveRoom(ws, false)
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
      // ---- rooms ----
      case 'create-room': {
        if (st.roomId) leaveRoom(ws)
        unpair(ws, false)
        const pw = typeof m.password === 'string' ? m.password.slice(0, 100) : ''
        const roomId = newRoomId()
        const room = {
          id: roomId,
          passwordHash: pw ? crypto.createHash('sha256').update(pw).digest('hex') : null,
          expiresAt: Date.now() + ROOM_TTL,
          members: new Set(),
          timer: null,
        }
        room.timer = setTimeout(() => {
          const r = rooms.get(roomId)
          if (r) {
            roomBroadcast(r, null, { t: 'room-error', reason: 'expired' })
            for (const w of r.members) { const s2 = meta.get(w); if (s2) s2.roomId = null }
            destroyRoom(roomId)
          }
        }, ROOM_TTL)
        if (room.timer.unref) room.timer.unref()
        rooms.set(roomId, room)
        room.members.add(ws)
        st.roomId = roomId
        send(ws, { t: 'room-created', id: roomId, name: st.name, members: roomMembers(room) })
        break
      }
      case 'join-room': {
        const roomId = typeof m.id === 'string' ? m.id.trim().toLowerCase().slice(0, 16) : ''
        const room = rooms.get(roomId)
        if (!room) { send(ws, { t: 'room-error', reason: 'bad id' }); break }
        if (room.expiresAt <= Date.now()) { send(ws, { t: 'room-error', reason: 'expired' }); destroyRoom(roomId); break }
        if (room.passwordHash) {
          const pw = typeof m.password === 'string' ? m.password : ''
          const h = crypto.createHash('sha256').update(pw).digest('hex')
          if (h !== room.passwordHash) { send(ws, { t: 'room-error', reason: 'bad password' }); break }
        }
        if (!room.members.has(ws) && room.members.size >= ROOM_CAP) { send(ws, { t: 'room-error', reason: 'full' }); break }
        if (st.roomId && st.roomId !== roomId) leaveRoom(ws)
        unpair(ws, false)
        const isNew = !room.members.has(ws)
        room.members.add(ws)
        st.roomId = roomId
        send(ws, { t: 'room-joined', id: roomId, name: st.name, members: roomMembers(room) })
        if (isNew) roomBroadcast(room, ws, { t: 'peer-joined', name: st.name })
        break
      }
      case 'room-msg':
      case 'room-img':
      case 'room-audio': {
        const room = st.roomId ? rooms.get(st.roomId) : null
        if (!room || !room.members.has(ws)) { send(ws, { t: 'room-error', reason: 'not in room' }); break }
        if (raw.length > MAX_MSG) { send(ws, { t: 'warn', msg: 'file too large (2MB max)' }); break }
        const out = m.t === 'room-msg'
          ? { t: 'room-msg', name: st.name, text: String(m.text || '').slice(0, 2000) }
          : { t: m.t, name: st.name, url: String(m.url || '').slice(0, MAX_MSG) }
        roomBroadcast(room, ws, out)
        break
      }
      case 'room-leave': {
        leaveRoom(ws)
        send(ws, { t: 'room-left' })
        break
      }
      case 'room-typing':
      case 'room-activity': {
        const room = st.roomId ? rooms.get(st.roomId) : null
        if (!room || !room.members.has(ws)) break
        if (m.t === 'room-typing') {
          roomBroadcast(room, ws, { t: 'room-typing', name: st.name, state: m.state === true })
        } else {
          const kind = String(m.kind || '')
          if (!['image', 'voice'].includes(kind) && m.kind !== null) break
          roomBroadcast(room, ws, { t: 'room-activity', name: st.name, kind: m.kind })
        }
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
      case 'typing':
      case 'activity': {
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
    const st = meta.get(ws)
    const roomId = st?.roomId
    const name = st?.name
    unpair(ws)
    if (roomId && rooms.get(roomId)) {
      const room = rooms.get(roomId)
      room.members.delete(ws)
      if (name) roomBroadcast(room, ws, { t: 'peer-left', name })
      if (room.members.size === 0) destroyRoom(roomId)
    }
    if (p && p.readyState === 1) send(p, { t: 'partner-left' })
    meta.delete(ws)
    // freed partner re-queues only when they press Next (keeps consent explicit)
  })
})

server.listen(PORT, () => console.log('stranger-backend listening on ' + PORT))
