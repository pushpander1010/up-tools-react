import { useState, useCallback, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'

function base64UrlDecode(str) {
  let s = str.replace(/-/g, '+').replace(/_/g, '/')
  while (s.length % 4) s += '='
  return decodeURIComponent(
    atob(s)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  )
}

function base64UrlToHex(str) {
  let s = str.replace(/-/g, '+').replace(/_/g, '/')
  while (s.length % 4) s += '='
  const bytes = atob(s)
  let hex = ''
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes.charCodeAt(i).toString(16).padStart(2, '0')
  }
  return hex
}

function syntaxHighlightJson(obj) {
  const json = JSON.stringify(obj, null, 2)
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    match => {
      let cls = 'text-yellow-400'
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'text-indigo-400'
        } else {
          cls = 'text-emerald-400'
        }
      } else if (/true|false/.test(match)) {
        cls = 'text-pink-400'
      } else if (/null/.test(match)) {
        cls = 'text-red-400'
      }
      return `<span class="${cls}">${match}</span>`
    }
  )
}

export default function JwtDebugger() {
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [header, setHeader] = useState(null)
  const [payload, setPayload] = useState(null)
  const [sigInfo, setSigInfo] = useState(null)
  const [copied, setCopied] = useState('')

  const decodeJwt = useCallback(() => {
    const t = token.trim()
    setError('')
    setHeader(null)
    setPayload(null)
    setSigInfo(null)

    if (!t) {
      setError('⚠️ Please paste a JWT token.')
      return
    }

    const parts = t.split('.')
    if (parts.length !== 3) {
      setError(`❌ Invalid JWT: Token must have exactly 3 parts separated by dots. Found ${parts.length} part(s).`)
      return
    }

    const b64urlRe = /^[A-Za-z0-9\-_]+$/
    if (!b64urlRe.test(parts[0]) || !b64urlRe.test(parts[1])) {
      setError('❌ Invalid JWT: Header or Payload contains invalid base64url characters.')
      return
    }

    let h, p
    try {
      h = JSON.parse(base64UrlDecode(parts[0]))
    } catch {
      setError('❌ Invalid JWT: Failed to decode header. Not valid JSON in base64url.')
      return
    }
    try {
      p = JSON.parse(base64UrlDecode(parts[1]))
    } catch {
      setError('❌ Invalid JWT: Failed to decode payload. Not valid JSON in base64url.')
      return
    }

    setHeader(h)
    setPayload(p)

    const algorithm = h.alg || 'Unknown'
    const typ = h.typ || 'N/A'
    const sigPreview = parts[2]
    const sigHex = base64UrlToHex(parts[2])
    const sigBytes = sigHex.length / 2

    let payloadFields = ''
    if (p.exp) {
      const expDate = new Date(p.exp * 1000)
      const expired = new Date() > expDate
      payloadFields += `  "expires": "${expDate.toISOString()}" (${expired ? 'EXPIRED' : 'Valid'})\n`
    }
    if (p.iat) {
      payloadFields += `  "issued_at": "${new Date(p.iat * 1000).toISOString()}"\n`
    }
    if (p.nbf) {
      payloadFields += `  "not_before": "${new Date(p.nbf * 1000).toISOString()}"\n`
    }

    const info = {
      algorithm,
      type: typ,
      signature_length: sigBytes + ' bytes',
      signature_preview: sigPreview.length > 64 ? sigPreview.substring(0, 64) + '...' : sigPreview,
    }

    let sigText = JSON.stringify(info, null, 2)
    if (payloadFields) {
      sigText += '\n\n// Time-based claims:\n' + payloadFields
    }
    sigText += '\n\n// Full signature (base64url):\n"' + sigPreview + '"'

    setSigInfo(sigText)
  }, [token])

  const clearAll = useCallback(() => {
    setToken('')
    setError('')
    setHeader(null)
    setPayload(null)
    setSigInfo(null)
  }, [])

  const copyPart = useCallback((text) => {
    navigator.clipboard.writeText(text)
    setCopied(text.substring(0, 10))
    setTimeout(() => setCopied(''), 1500)
  }, [])

  const headerHtml = header ? syntaxHighlightJson(header) : ''
  const payloadHtml = payload ? syntaxHighlightJson(payload) : ''

  return (
    <ToolLayout
      title="JWT Debugger"
      desc="Decode & inspect JWT tokens client-side. View header, payload, and signature info."
      icon="🛡️" iconBg="rgba(99,102,241,0.08)"
      category="dev" slug="jwt-debugger"
    >
      <div className="space-y-4">
        {/* Input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Paste your JWT token below</label>
          <textarea
            className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white font-mono min-h-[100px] resize-y focus:outline-none focus:border-indigo-500/50"
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder="eyJhbG...sw5c"
          />
          <div className="flex gap-2 mt-3">
            <button onClick={decodeJwt} className="glow-btn text-xs px-5 py-2 rounded-xl font-semibold">Decode</button>
            <button onClick={clearAll} className="text-xs px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-white transition">Clear</button>
          </div>
          {error && <p className="text-red-400 font-semibold mt-3 text-sm">{error}</p>}
        </div>

        {/* Results */}
        {header && payload && (
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
            <h2 className="text-lg font-bold text-white mb-4">Decoded Result</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <h3 className="text-sm font-semibold text-indigo-300">📋 Header</h3>
                  <button
                    onClick={() => copyPart(JSON.stringify(header, null, 2))}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition"
                  >
                    {copied === JSON.stringify(header, null, 2).substring(0, 10) ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
                <pre
                  className="bg-black/30 border border-white/[0.06] rounded-xl p-3 text-xs font-mono min-h-[80px] overflow-auto text-slate-200"
                  dangerouslySetInnerHTML={{ __html: headerHtml }}
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <h3 className="text-sm font-semibold text-indigo-300">📦 Payload</h3>
                  <button
                    onClick={() => copyPart(JSON.stringify(payload, null, 2))}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition"
                  >
                    {copied === JSON.stringify(payload, null, 2).substring(0, 10) ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
                <pre
                  className="bg-black/30 border border-white/[0.06] rounded-xl p-3 text-xs font-mono min-h-[80px] overflow-auto text-slate-200"
                  dangerouslySetInnerHTML={{ __html: payloadHtml }}
                />
              </div>
            </div>

            {sigInfo && (
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <h3 className="text-sm font-semibold text-indigo-300">🔐 Signature Info</h3>
                  <button
                    onClick={() => copyPart(sigInfo)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition"
                  >
                    {copied === sigInfo.substring(0, 10) ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="bg-black/30 border border-white/[0.06] rounded-xl p-3 text-xs font-mono min-h-[50px] overflow-auto text-slate-200 whitespace-pre-wrap">
                  {sigInfo}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
