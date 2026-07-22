import { useState, useCallback, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const CHARSETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
}

const ATTACK_SPEEDS = [
  { label: 'Online (100/sec)', speed: 100, icon: '🌐', desc: 'Brute-force over the internet' },
  { label: 'Offline Fast (10B/sec)', speed: 10_000_000_000, icon: '⚡', desc: 'GPU cluster, fast hash (MD5)' },
  { label: 'Offline Slow (100K/sec)', speed: 100_000, icon: '🐢', desc: 'Basic hardware, slow hash (bcrypt)' },
]

const FUN_FACTS = [
  '🔑 A 12-character password with all character types has ~78 bits of entropy',
  '🔓 8-character passwords can be cracked in under 8 hours on modern GPUs',
  '🛡️ Length matters more than complexity — "correct horse battery staple" beats "P@ssw0rd"',
  '⏱️ Adding 1 character roughly doubles the crack time for brute-force attacks',
  '🧮 The internet has ~4.7 billion users — your password competes against all of them',
  '🚫 65% of people reuse passwords across multiple sites',
  '💡 Passphrases (4+ random words) are both strong AND memorable',
]

function calculateEntropy(poolSize, length) {
  if (poolSize <= 0 || length <= 0) return 0
  return length * Math.log2(poolSize)
}

function formatTime(seconds) {
  if (seconds < 0.001) return 'Instant'
  if (seconds < 1) return `${(seconds * 1000).toFixed(0)} milliseconds`
  if (seconds < 60) return `${seconds.toFixed(1)} seconds`
  if (seconds < 3600) return `${(seconds / 60).toFixed(1)} minutes`
  if (seconds < 86400) return `${(seconds / 3600).toFixed(1)} hours`
  if (seconds < 31536000) return `${(seconds / 86400).toFixed(1)} days`
  if (seconds < 31536000 * 1000) return `${(seconds / 31536000).toFixed(1)} years`
  if (seconds < 31536000 * 1e6) return `${(seconds / 31536000 / 1000).toFixed(1)} thousand years`
  if (seconds < 31536000 * 1e9) return `${(seconds / 31536000 / 1e6).toFixed(1)} million years`
  return `${(seconds / 31536000 / 1e9).toFixed(1)} billion years`
}

function getStrength(entropy) {
  if (entropy < 28) return { label: 'Very Weak', color: '#ef4444', bg: 'rgba(239,68,68,0.15)', pct: 10, emoji: '💀', tip: 'Cracked instantly' }
  if (entropy < 36) return { label: 'Weak', color: '#f97316', bg: 'rgba(249,115,22,0.15)', pct: 25, emoji: '⚠️', tip: 'Minutes to hours' }
  if (entropy < 50) return { label: 'Fair', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', pct: 45, emoji: '😐', tip: 'Days to weeks' }
  if (entropy < 60) return { label: 'Good', color: '#84cc16', bg: 'rgba(132,204,22,0.15)', pct: 60, emoji: '👍', tip: 'Months to years' }
  if (entropy < 80) return { label: 'Strong', color: '#22c55e', bg: 'rgba(34,197,94,0.15)', pct: 80, emoji: '💪', tip: 'Centuries' }
  return { label: 'Very Strong', color: '#06b6d4', bg: 'rgba(6,182,212,0.15)', pct: 100, emoji: '🛡️', tip: 'Heat death of universe' }
}

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

export default function password_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [length, setLength] = useState(16)
  const [opts, setOpts] = useState({ upper: true, lower: true, numbers: true, symbols: false })
  const [count, setCount] = useState(5)
  const [passwords, setPasswords] = useState(() => Array.from({ length: 5 }, () => generate(16, { upper: true, lower: true, numbers: true, symbols: false })))
  const [copied, setCopied] = useState(null)
  const [showAnalysis, setShowAnalysis] = useState(null)

  const poolSize = useMemo(() => {
    let s = 0
    if (opts.upper) s += 26
    if (opts.lower) s += 26
    if (opts.numbers) s += 10
    if (opts.symbols) s += 27
    return s || 26
  }, [opts])

  const entropy = useMemo(() => calculateEntropy(poolSize, length), [poolSize, length])

  const crackTimes = useMemo(() => {
    const combinations = Math.pow(2, entropy)
    return ATTACK_SPEEDS.map(a => ({
      ...a,
      time: formatTime(combinations / a.speed / 2) // average case = half
    }))
  }, [entropy])

  const strength = useMemo(() => getStrength(entropy), [entropy])

  const gen = useCallback(() => {
    setPasswords(Array.from({ length: count }, () => generate(length, opts)))
    setCopied(null)
    setShowAnalysis(null)
  }, [length, opts, count])

  const copy = (text, i) => {
    navigator.clipboard.writeText(text); setCopied(i); setTimeout(() => setCopied(null), 2000)
  }

  const factIndex = useMemo(() => Math.floor(Math.random() * FUN_FACTS.length), [copied])

  return (
    <ToolLayout
      title="Password Generator"
      desc="Generate cryptographically secure passwords with real-time strength analysis and crack time estimates."
      icon="🔐" iconBg="rgba(239,68,68,0.08)"
      category="security" slug="password-generator"
      faq={[
        { q: 'Are these passwords truly secure?', a: 'Yes — they use crypto.getRandomValues(), the same cryptographic API banks and password managers use. No Math.random().' },
        { q: 'How long should my password be?', a: 'Minimum 12 characters for everyday accounts. 16+ for banking. 20+ for maximum security.' },
        { q: 'What makes a password strong?', a: 'Length + character variety. A 20-character lowercase passphrase beats an 8-character mixed password.' },
      ]}
      howItWorks={[
        'Set the desired password length with the slider (6 to 64 characters).',
        'Toggle character sets: uppercase, lowercase, numbers, symbols.',
        'Watch the real-time entropy and crack time analysis update.',
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
        {/* ─── Strength Meter (Live) ─── */}
        <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-300">Password Strength</span>
            <span className="text-lg" style={{ color: strength.color }}>{strength.emoji} {strength.label}</span>
          </div>
          <div className="h-3 rounded-full bg-white/5 overflow-hidden mb-3">
            <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${strength.pct}%`, background: `linear-gradient(90deg, ${strength.color}80, ${strength.color})` }} />
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500">{strength.tip}</span>
            <span className="text-slate-500">{entropy.toFixed(1)} bits of entropy</span>
          </div>
        </div>

        {/* ─── Crack Time Analysis ─── */}
        <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08]">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">⏱️ Time to Crack</h3>
          <div className="space-y-2.5">
            {crackTimes.map(ct => (
              <div key={ct.label} className="flex items-center gap-3">
                <span className="text-lg w-8 text-center">{ct.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">{ct.label}</span>
                    <span className="text-xs font-bold text-white font-mono">{ct.time}</span>
                  </div>
                  <div className="text-[10px] text-slate-600">{ct.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Length Slider ─── */}
        <div>
          <div className="flex justify-between items-baseline mb-3">
            <label className="text-sm font-semibold text-slate-300">Password Length</label>
            <span className="text-3xl font-extrabold text-white">{length}</span>
          </div>
          <input type="range" min="6" max="64" value={length} onChange={e => setLength(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none bg-white/10 accent-red-500 cursor-pointer" />
          <div className="flex justify-between text-[10px] text-slate-600 mt-1"><span>6</span><span>64</span></div>
        </div>

        {/* ─── Character Sets ─── */}
        <div>
          <label className="text-sm font-semibold text-slate-300 mb-3 block">Character Sets</label>
          <div className="grid grid-cols-2 gap-3">
            {[['upper', 'Uppercase', 'A-Z', 26], ['lower', 'Lowercase', 'a-z', 26], ['numbers', 'Numbers', '0-9', 10], ['symbols', 'Symbols', '!@#$%^&*', 27]].map(([key, label, sample, size]) => (
              <button key={key} onClick={() => setOpts(o => ({ ...o, [key]: !o[key] }))}
                className={`p-4 rounded-2xl border-2 text-left transition-all duration-200
                  ${opts[key] ? 'bg-red-500/8 border-red-500/25 shadow-lg shadow-red-500/10' : 'bg-white/[0.05] border-white/8 hover:border-white/12'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-white">{label}</span>
                    <span className="text-[10px] text-slate-600 ml-2">({size} chars)</span>
                  </div>
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold transition-all ${opts[key] ? 'bg-red-500 text-white' : 'bg-white/10 text-transparent'}`}>
                    {opts[key] && '✓'}
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 font-mono">{sample}</div>
              </button>
            ))}
          </div>
          <div className="mt-2 text-[11px] text-slate-600">Pool size: <span className="text-slate-400 font-mono">{poolSize}</span> characters → <span className="text-slate-400 font-mono">{poolSize}</span>^{length} = <span className="text-slate-400 font-mono">{Math.pow(poolSize, length).toExponential(2)}</span> combinations</div>
        </div>

        {/* ─── Batch + Generate ─── */}
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
            <button onClick={() => { gen(); jumpTo() }}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold text-sm shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-105 active:scale-95 transition-all duration-200">
              🔄 Generate
            </button>
          </div>
        </div>

        {/* ─── Password List ─── */}
        <div ref={resultRef} className="space-y-3">
          {passwords.map((pw, i) => {
            const pwEntropy = calculateEntropy(poolSize, pw.length)
            const pwStr = getStrength(pwEntropy)
            const pwCracks = ATTACK_SPEEDS.map(a => ({
              ...a,
              time: formatTime(Math.pow(2, pwEntropy) / a.speed / 2)
            }))
            const isExpanded = showAnalysis === i

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

                {/* Strength Bar */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pwStr.pct}%`, background: pwStr.color }} />
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md" style={{ color: pwStr.color, background: pwStr.bg }}>{pwStr.emoji} {pwStr.label}</span>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[10px] text-slate-600">
                    <span>{pw.length} chars</span>
                    <span>•</span>
                    <span>{pwEntropy.toFixed(0)} bits</span>
                    <span>•</span>
                    <span>Fast crack: {pwCracks[1].time}</span>
                  </div>
                  <button onClick={() => setShowAnalysis(isExpanded ? null : i)}
                    className="text-[10px] text-slate-500 hover:text-white transition-colors">
                    {isExpanded ? '▲ Less' : '▼ Details'}
                  </button>
                </div>

                {/* Expanded Analysis */}
                {isExpanded && (
                  <div className="mt-3 p-3 rounded-xl bg-black/20 border border-white/5 space-y-1.5" style={{ animation: 'slideUp 0.2s ease-out' }}>
                    {pwCracks.map(ct => (
                      <div key={ct.label} className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">{ct.icon} {ct.label}</span>
                        <span className="font-mono font-bold text-white">{ct.time}</span>
                      </div>
                    ))}
                    <div className="pt-1.5 border-t border-white/5 text-[10px] text-slate-600">
                      Combinations: {Math.pow(poolSize, pw.length).toExponential(2)}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* ─── Fun Fact ─── */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
          <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-1">💡 Did you know?</div>
          <div className="text-sm text-slate-300">{FUN_FACTS[factIndex]}</div>
        </div>
      </div>
    </ToolLayout>
  )
}
