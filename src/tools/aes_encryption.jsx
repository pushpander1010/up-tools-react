import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'

// ── Web Crypto API based AES-256-GCM encrypt/decrypt ──

function strToBuf(str) {
  return new TextEncoder().encode(str)
}
function bufToStr(buf) {
  return new TextDecoder().decode(buf)
}
function bufToHex(buf) {
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}
function hexToBuf(hex) {
  const bytes = hex.match(/.{1,2}/g).map(b => parseInt(b, 16))
  return new Uint8Array(bytes)
}
function bufToBase64(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
}
function base64ToBuf(b64) {
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

async function deriveKey(password, salt) {
  const keyMaterial = await crypto.subtle.importKey('raw', strToBuf(password), 'PBKDF2', false, ['deriveKey'])
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

async function encrypt(plaintext, password) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(password, salt)
  const cipherBuf = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, strToBuf(plaintext))
  // Pack: salt(16) + iv(12) + ciphertext
  const packed = new Uint8Array(salt.length + iv.length + cipherBuf.byteLength)
  packed.set(salt, 0)
  packed.set(iv, salt.length)
  packed.set(new Uint8Array(cipherBuf), salt.length + iv.length)
  return bufToBase64(packed)
}

async function decrypt(cipherB64, password) {
  const packed = base64ToBuf(cipherB64)
  const salt = packed.slice(0, 16)
  const iv = packed.slice(16, 28)
  const data = packed.slice(28)
  const key = await deriveKey(password, salt)
  const plainBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data)
  return bufToStr(plainBuf)
}

export default function AesEncryption() {
  const [plaintext, setPlaintext] = useState('')
  const [ciphertext, setCiphertext] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('encrypt')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleProcess = useCallback(async () => {
    setError('')
    setOutput('')
    setLoading(true)
    try {
      if (!password) { setError('Please enter a password.'); setLoading(false); return }
      if (mode === 'encrypt') {
        if (!plaintext.trim()) { setError('Please enter text to encrypt.'); setLoading(false); return }
        const result = await encrypt(plaintext, password)
        setOutput(result)
      } else {
        if (!ciphertext.trim()) { setError('Please enter ciphertext to decrypt.'); setLoading(false); return }
        const result = await decrypt(ciphertext.trim(), password)
        setOutput(result)
      }
    } catch (e) {
      setError('Decryption failed. Check your password and ciphertext.')
    }
    setLoading(false)
  }, [mode, plaintext, ciphertext, password])

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleSwap = () => {
    if (output) {
      if (mode === 'encrypt') setCiphertext(output)
      else setPlaintext(output)
    }
    setOutput('')
    setError('')
  }

  return (
    <ToolLayout
      title="AES Encryption Tool"
      desc="Encrypt & decrypt text with AES-256-GCM using the Web Crypto API. Client-side only — your data never leaves your browser."
      icon="🔐" iconBg="rgba(99,102,241,0.08)"
      category="security" slug="aes-encryption"
      faq={[
        { q: 'What is AES-256-GCM?', a: 'AES-256-GCM is an authenticated encryption algorithm that provides both confidentiality and integrity. It uses a 256-bit key and is considered highly secure.' },
        { q: 'Is my data sent to a server?', a: 'No. All encryption and decryption happens locally in your browser using the Web Crypto API. Nothing is transmitted.' },
      ]}
      howItWorks={[
        'Enter your text and a password.',
        'Choose encrypt or decrypt mode.',
        'Click Process — the result appears instantly.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "AES Encryption Tool", "applicationCategory": "SecurityApplication",
        "url": "https://www.uptools.in/aes-encryption/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Mode toggle */}
        <div className="flex gap-2">
          <button className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${mode === 'encrypt' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-white/[0.06] text-slate-400 border border-white/[0.08]'}`}
            onClick={() => { setMode('encrypt'); setOutput(''); setError('') }}>
            🔒 Encrypt
          </button>
          <button className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${mode === 'decrypt' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-white/[0.06] text-slate-400 border border-white/[0.08]'}`}
            onClick={() => { setMode('decrypt'); setOutput(''); setError('') }}>
            🔓 Decrypt
          </button>
        </div>

        {/* Password */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
          <input type="password"
            className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-indigo-500/50"
            value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Enter encryption password..."
          />
        </div>

        {/* Input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            {mode === 'encrypt' ? 'Plaintext' : 'Ciphertext (Base64)'}
          </label>
          <textarea
            className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white font-mono min-h-[140px] resize-y focus:outline-none focus:border-indigo-500/50"
            value={mode === 'encrypt' ? plaintext : ciphertext}
            onChange={e => mode === 'encrypt' ? setPlaintext(e.target.value) : setCiphertext(e.target.value)}
            placeholder={mode === 'encrypt' ? 'Enter text to encrypt...' : 'Paste Base64 ciphertext...'}
          />
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2 text-sm text-red-400">{error}</div>
        )}

        <div className="flex gap-3">
          <button className="glow-btn text-sm px-6 py-2.5 rounded-xl font-semibold" onClick={handleProcess} disabled={loading}>
            {loading ? 'Processing...' : mode === 'encrypt' ? '🔒 Encrypt' : '🔓 Decrypt'}
          </button>
          {output && <button onClick={handleSwap} className="text-xs px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white">↔ Swap to input</button>}
        </div>

        {/* Output */}
        {output && (
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-slate-300">Output</label>
              <button onClick={handleCopy} className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
            <textarea
              className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-emerald-400 font-mono min-h-[100px] resize-y focus:outline-none"
              value={output} readOnly
            />
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
