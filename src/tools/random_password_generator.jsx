import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`'

export default function random_password_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [length, setLength] = useState(16)
  const [useUpper, setUseUpper] = useState(true)
  const [useLower, setUseLower] = useState(true)
  const [useNumbers, setUseNumbers] = useState(true)
  const [useSymbols, setUseSymbols] = useState(true)
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)

  const getPool = useCallback(() => {
    let pool = ''
    if (useUpper) pool += UPPER
    if (useLower) pool += LOWER
    if (useNumbers) pool += NUMBERS
    if (useSymbols) pool += SYMBOLS
    return pool
  }, [useUpper, useLower, useNumbers, useSymbols])

  const generate = useCallback(() => {
    const pool = getPool()
    if (!pool) return
    const arr = new Uint32Array(length)
    crypto.getRandomValues(arr)
    const pw = Array.from(arr, v => pool[v % pool.length]).join('')
    setPassword(pw)
    jumpTo()
  }, [length, getPool, jumpTo])

  const calcStrength = useCallback(() => {
    if (!password) return { label: '—', color: '#64748b', pct: 0 }
    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (password.length >= 16) score++
    if (password.length >= 24) score++
    if (useUpper) score++
    if (useLower) score++
    if (useNumbers) score++
    if (useSymbols) score++
    if (password.length >= 32) score++
    if (score <= 2) return { label: 'Weak', color: '#ef4444', pct: 20 }
    if (score <= 4) return { label: 'Fair', color: '#facc15', pct: 45 }
    if (score <= 6) return { label: 'Strong', color: '#f97316', pct: 70 }
    return { label: 'Very Strong', color: '#22c55e', pct: 100 }
  }, [password, useUpper, useLower, useNumbers, useSymbols])

  const strength = calcStrength()

  const countChars = useCallback(() => {
    if (!password) return { u: 0, l: 0, n: 0, s: 0 }
    let u = 0, l = 0, n = 0, s = 0
    for (const c of password) {
      if (UPPER.includes(c)) u++
      else if (LOWER.includes(c)) l++
      else if (NUMBERS.includes(c)) n++
      else if (SYMBOLS.includes(c)) s++
    }
    return { u, l, n, s }
  }, [password])

  const counts = countChars()

  const copyPassword = useCallback(async () => {
    if (!password) return
    try { await navigator.clipboard.writeText(password) } catch {
      const ta = document.createElement('textarea'); ta.value = password
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta)
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }, [password])

  const download = useCallback(() => {
    if (!password) return
    const blob = new Blob([password], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'password.txt'
    document.body.appendChild(a); a.click(); a.remove()
    URL.revokeObjectURL(url)
  }, [password])

  return (
    <ToolLayout
      title="Random Password Generator"
      desc="Generate strong, cryptographically secure passwords. Customize length and character types."
      icon="🔐" iconBg="rgba(34,197,94,0.08)"
      category="dev" slug="random-password-generator"
      faq={[
        { q: 'How secure are generated passwords?', a: 'Uses crypto.getRandomValues() — cryptographically secure, suitable for any account.' },
        { q: 'What length should I use?', a: '12-16 characters for most accounts. 24-32 for maximum security.' },
      ]}
      howItWorks={[
        'Adjust the password length slider.',
        'Toggle character types (uppercase, lowercase, numbers, symbols).',
        'Click Generate and copy the password.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Random Password Generator", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/random-password-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Settings */}
        <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08] space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Length: <span className="text-emerald-400">{length}</span>
            </label>
            <input type="range" min="4" max="128" value={length}
              onChange={e => { setLength(Number(e.target.value)); generate() }}
              className="w-full accent-emerald-500" />
            <div className="flex gap-2 mt-2">
              {[8, 12, 16, 24, 32].map(n => (
                <button key={n} onClick={() => { setLength(n) }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    length === n ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-white/[0.06] text-slate-500 border border-white/[0.08]'
                  }`}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Uppercase (A-Z)', checked: useUpper, set: setUseUpper },
              { label: 'Lowercase (a-z)', checked: useLower, set: setUseLower },
              { label: 'Numbers (0-9)', checked: useNumbers, set: setUseNumbers },
              { label: 'Symbols (!@#$%)', checked: useSymbols, set: setUseSymbols },
            ].map(opt => (
              <label key={opt.label} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input type="checkbox" checked={opt.checked} onChange={e => opt.set(e.target.checked)}
                  className="accent-emerald-500" />
                {opt.label}
              </label>
            ))}
          </div>

          <button onClick={generate}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all"
            style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
            🔐 Generate Password
          </button>
        </div>

        {/* Result */}
        {password ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.06] via-white/[0.01] to-transparent p-6"
            style={{ animation: 'slideUp 0.35s ease-out' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Generated Password</h3>
            </div>

            <div className="flex gap-2 mb-4">
              <input type="text" value={password} readOnly
                className="flex-1 bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm font-mono outline-none" />
              <button onClick={copyPassword}
                className={`px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/[0.08] text-slate-400 hover:text-white'
                }`}>
                {copied ? '✅ Copied' : '📋 Copy'}
              </button>
            </div>

            {/* Strength */}
            <div className="mb-4">
              <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-full rounded-full transition-all duration-300"
                  style={{ width: strength.pct + '%', background: strength.color }} />
              </div>
              <div className="text-xs font-semibold mt-1" style={{ color: strength.color }}>{strength.label}</div>
            </div>

            {/* Character Counts */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[
                { label: 'Upper', count: counts.u },
                { label: 'Lower', count: counts.l },
                { label: 'Numbers', count: counts.n },
                { label: 'Symbols', count: counts.s },
              ].map(c => (
                <div key={c.label} className="text-center p-2 bg-black/20 rounded-xl">
                  <div className="text-xs text-slate-500">{c.label}</div>
                  <div className="text-sm font-bold text-white">{c.count}</div>
                </div>
              ))}
            </div>

            <button onClick={download}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">
              💾 Download as .txt
            </button>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.02]">
            <div className="text-4xl mb-3 opacity-20">🔐</div>
            <p className="text-sm text-slate-600 font-medium">Click Generate to create a password</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
