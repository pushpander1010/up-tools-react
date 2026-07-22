import { useState, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

const CHARSETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
}

function generatePassword(length, options) {
  let chars = ''
  if (options.upper) chars += CHARSETS.upper
  if (options.lower) chars += CHARSETS.lower
  if (options.numbers) chars += CHARSETS.numbers
  if (options.symbols) chars += CHARSETS.symbols
  if (!chars) chars = CHARSETS.lower

  const arr = new Uint32Array(length)
  crypto.getRandomValues(arr)
  return Array.from(arr, x => chars[x % chars.length]).join('')
}

function strength(password) {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  if (password.length >= 16) score++
  if (score <= 2) return { label: 'Weak', color: '#ef4444', width: '25%' }
  if (score <= 3) return { label: 'Fair', color: '#f59e0b', width: '50%' }
  if (score <= 4) return { label: 'Strong', color: '#22c55e', width: '75%' }
  return { label: 'Very Strong', color: '#06b6d4', width: '100%' }
}

export default function password_generator() {
  const [length, setLength] = useState(16)
  const [options, setOptions] = useState({ upper: true, lower: true, numbers: true, symbols: false })
  const [count, setCount] = useState(5)
  const [passwords, setPasswords] = useState([])
  const [copied, setCopied] = useState(null)

  const generate = useCallback(() => {
    const list = Array.from({ length: count }, () => generatePassword(length, options))
    setPasswords(list)
    setCopied(null)
  }, [length, options, count])

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text)
    setCopied(idx)
    setTimeout(() => setCopied(null), 1500)
  }

  const toggle = (key) => setOptions(prev => ({ ...prev, [key]: !prev[key] }))

  // Generate initial
  if (passwords.length === 0) {
    setTimeout(() => generate(), 0)
  }

  return (
    <>
      <Helmet>
        <title>Password Generator — Strong Random Passwords</title>
        <meta name="description" content="Generate cryptographically secure passwords. Customize length, character sets." />
        <link rel="canonical" href="https://www.uptools.in/password-generator/" />
      </Helmet>

      <nav className="text-xs text-slate-500 mb-4">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span className="mx-2 text-slate-700">›</span>
        <span className="text-white">Password Generator</span>
      </nav>

      <section className="glass p-6 mb-6" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(17,24,39,0.6))', borderColor: 'rgba(239,68,68,0.2)' }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>🔐</div>
          <div>
            <h1 className="text-xl font-bold text-white m-0">Password Generator</h1>
            <p className="text-sm text-slate-400 mt-1">Cryptographically secure random passwords</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Settings */}
        <div className="space-y-4">
          <div className="glass p-5">
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs font-medium text-slate-400">Length</label>
              <span className="text-sm font-bold text-white">{length}</span>
            </div>
            <input type="range" min="6" max="64" value={length} onChange={e => setLength(Number(e.target.value))}
              className="w-full accent-red-500" />
            <div className="flex justify-between text-[10px] text-slate-600 mt-1">
              <span>6</span><span>64</span>
            </div>
          </div>

          <div className="glass p-5">
            <label className="text-xs font-medium text-slate-400 mb-3 block">Character Sets</label>
            {[
              { key: 'upper', label: 'Uppercase (A-Z)' },
              { key: 'lower', label: 'Lowercase (a-z)' },
              { key: 'numbers', label: 'Numbers (0-9)' },
              { key: 'symbols', label: 'Symbols (!@#$)' },
            ].map(opt => (
              <label key={opt.key} className="flex items-center gap-3 py-2 cursor-pointer">
                <input type="checkbox" checked={options[opt.key]} onChange={() => toggle(opt.key)}
                  className="w-4 h-4 accent-red-500" />
                <span className="text-sm text-white">{opt.label}</span>
              </label>
            ))}
          </div>

          <div className="glass p-5">
            <label className="text-xs font-medium text-slate-400 mb-2 block">How many?</label>
            <div className="flex gap-2">
              {[1, 3, 5, 10].map(n => (
                <button key={n} onClick={() => setCount(n)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all border ${
                    count === n ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'bg-white/4 border-white/6 text-slate-400'
                  }`}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button onClick={generate} className="glow-btn w-full py-3 rounded-xl text-sm"
            style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
            🔄 Generate
          </button>
        </div>

        {/* Passwords */}
        <div className="lg:col-span-2 space-y-3">
          {passwords.map((pw, i) => {
            const str = strength(pw)
            return (
              <div key={i} className="glass p-4">
                <div className="flex items-center gap-3 mb-2">
                  <code className="flex-1 text-sm text-white font-mono break-all bg-white/4 rounded-lg px-3 py-2">{pw}</code>
                  <button onClick={() => copyToClipboard(pw, i)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                      copied === i ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-white/5 border border-white/8 text-slate-400 hover:text-white'
                    }`}>
                    {copied === i ? '✓ Copied' : '📋 Copy'}
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: str.width, background: str.color }} />
                  </div>
                  <span className="text-[11px] font-medium" style={{ color: str.color }}>{str.label}</span>
                  <span className="text-[10px] text-slate-600">{pw.length} chars</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
