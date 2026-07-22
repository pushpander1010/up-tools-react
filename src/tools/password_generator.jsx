import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'

const CHARSETS = { upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', lower: 'abcdefghijklmnopqrstuvwxyz', numbers: '0123456789', symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?' }

function generate(len, opts) {
  let chars = ''
  if (opts.upper) chars += CHARSETS.upper
  if (opts.lower) chars += CHARSETS.lower
  if (opts.numbers) chars += CHARSETS.numbers
  if (opts.symbols) chars += CHARSETS.symbols
  if (!chars) chars = CHARSETS.lower
  const arr = new Uint32Array(len); crypto.getRandomValues(arr)
  return Array.from(arr, x => chars[x % chars.length]).join('')
}

function getStrength(pw) {
  let s = 0
  if (pw.length >= 8) s++; if (pw.length >= 12) s++; if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++; if (/[^A-Za-z0-9]/.test(pw)) s++; if (pw.length >= 16) s++
  if (s <= 2) return { label: 'Weak', color: '#ef4444', bg: 'rgba(239,68,68,0.15)', pct: 25 }
  if (s <= 3) return { label: 'Fair', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', pct: 50 }
  if (s <= 4) return { label: 'Strong', color: '#22c55e', bg: 'rgba(34,197,94,0.15)', pct: 75 }
  return { label: 'Very Strong', color: '#06b6d4', bg: 'rgba(6,182,212,0.15)', pct: 100 }
}

export default function password_generator() {
  const [length, setLength] = useState(16)
  const [opts, setOpts] = useState({ upper: true, lower: true, numbers: true, symbols: false })
  const [count, setCount] = useState(5)
  const [passwords, setPasswords] = useState(() => Array.from({ length: 5 }, () => generate(16, { upper: true, lower: true, numbers: true, symbols: false })))
  const [copied, setCopied] = useState(null)

  const gen = useCallback(() => {
    setPasswords(Array.from({ length: count }, () => generate(length, opts)))
    setCopied(null)
  }, [length, opts, count])

  const copy = (text, i) => {
    navigator.clipboard.writeText(text); setCopied(i); setTimeout(() => setCopied(null), 2000)
  }

  return (
    <ToolLayout
      title="Password Generator"
      desc="Generate cryptographically secure passwords. Customize length, character sets, and batch generate multiple passwords."
      icon="🔐" iconBg="rgba(239,68,68,0.08)"
      category="security" slug="password-generator"
      faq={[
        { q: 'Are these passwords truly secure?', a: 'Yes — they use crypto.getRandomValues(), the same cryptographic API banks and password managers use. No Math.random().' },
        { q: 'How long should my password be?', a: 'Minimum 12 characters for everyday accounts. 16+ for banking and critical accounts. 20+ for maximum security.' },
        { q: 'Should I include symbols?', a: 'Absolutely. Symbols exponentially increase the number of possible combinations, making brute-force attacks impractical.' },
      ]}
      howItWorks={[
        'Set the desired password length with the slider (6 to 64 characters).',
        'Toggle which character sets to include: uppercase, lowercase, numbers, symbols.',
        'Choose how many passwords to generate at once.',
        'Click Generate and copy the one you like best.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Password Generator", "applicationCategory": "SecurityApplication",
        "url": "https://www.uptools.in/password-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Length Slider */}
        <div>
          <div className="flex justify-between items-baseline mb-3">
            <label className="text-sm font-semibold text-slate-300">Password Length</label>
            <span className="text-3xl font-extrabold text-white">{length}</span>
          </div>
          <input type="range" min="6" max="64" value={length} onChange={e => setLength(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none bg-white/10 accent-red-500 cursor-pointer" />
          <div className="flex justify-between text-[10px] text-slate-600 mt-1"><span>6</span><span>64</span></div>
        </div>

        {/* Character Sets */}
        <div>
          <label className="text-sm font-semibold text-slate-300 mb-3 block">Character Sets</label>
          <div className="grid grid-cols-2 gap-3">
            {[['upper', 'Uppercase', 'A-Z'], ['lower', 'Lowercase', 'a-z'], ['numbers', 'Numbers', '0-9'], ['symbols', 'Symbols', '!@#$%^&*']].map(([key, label, sample]) => (
              <button key={key} onClick={() => setOpts(o => ({ ...o, [key]: !o[key] }))}
                className={`p-4 rounded-2xl border-2 text-left transition-all duration-200
                  ${opts[key] ? 'bg-red-500/8 border-red-500/25 shadow-lg shadow-red-500/10' : 'bg-white/[0.05] border-white/8 hover:border-white/12'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{label}</span>
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold transition-all ${opts[key] ? 'bg-red-500 text-white' : 'bg-white/10 text-transparent'}`}>
                    {opts[key] && '✓'}
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 font-mono">{sample}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Batch + Generate */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs font-semibold text-slate-500 mb-2 block">Generate how many?</label>
            <div className="flex gap-2">
              {[1, 3, 5, 10].map(n => (
                <button key={n} onClick={() => setCount(n)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${count === n ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' : 'bg-white/[0.06] text-slate-400 border border-white/8 hover:border-white/12'}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end">
            <button onClick={gen}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold text-sm shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-105 active:scale-95 transition-all duration-200">
              🔄 Generate
            </button>
          </div>
        </div>

        {/* Password List */}
        <div className="space-y-3">
          {passwords.map((pw, i) => {
            const str = getStrength(pw)
            return (
              <div key={i} className="p-4 rounded-2xl bg-white/[0.05] border border-white/8 hover:border-white/12 transition-all group">
                <div className="flex items-center gap-3 mb-3">
                  <code className="flex-1 text-sm text-white font-mono break-all bg-black/20 rounded-xl px-4 py-3 border border-white/6">{pw}</code>
                  <button onClick={() => copy(pw, i)}
                    className={`px-4 py-3 rounded-xl text-xs font-bold shrink-0 transition-all duration-200 active:scale-95 ${
                      copied === i
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-white/5 border border-white/8 text-slate-400 hover:text-white hover:border-white/15 hover:bg-white/10'
                    }`}>
                    {copied === i ? '✓ Copied' : '📋 Copy'}
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${str.pct}%`, background: str.color }} />
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md" style={{ color: str.color, background: str.bg }}>{str.label}</span>
                  <span className="text-[10px] text-slate-600">{pw.length} chars</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </ToolLayout>
  )
}
