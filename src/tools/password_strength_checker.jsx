import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'

const CRITERIA = [
  { label: 'At least 8 characters', test: p => p.length >= 8 },
  { label: 'At least 12 characters', test: p => p.length >= 12 },
  { label: 'Uppercase letter (A-Z)', test: p => /[A-Z]/.test(p) },
  { label: 'Lowercase letter (a-z)', test: p => /[a-z]/.test(p) },
  { label: 'Number (0-9)', test: p => /[0-9]/.test(p) },
  { label: 'Special character (!@#$...)', test: p => /[^A-Za-z0-9]/.test(p) },
  { label: 'No common patterns', test: p => !/(.)\1{2,}|012|abc|qwe|password|1234|qwerty/i.test(p) },
  { label: 'Length ≥ 16', test: p => p.length >= 16 },
]

function calcEntropy(password) {
  let charsetSize = 0
  if (/[a-z]/.test(password)) charsetSize += 26
  if (/[A-Z]/.test(password)) charsetSize += 26
  if (/[0-9]/.test(password)) charsetSize += 10
  if (/[^A-Za-z0-9]/.test(password)) charsetSize += 32
  if (charsetSize === 0) return 0
  return Math.floor(password.length * Math.log2(charsetSize))
}

function getStrength(score) {
  if (score <= 30) return { label: 'Very Weak', color: 'bg-red-500', textColor: 'text-red-400', width: '15%' }
  if (score <= 50) return { label: 'Weak', color: 'bg-orange-500', textColor: 'text-orange-400', width: '35%' }
  if (score <= 70) return { label: 'Fair', color: 'bg-yellow-500', textColor: 'text-yellow-400', width: '55%' }
  if (score <= 90) return { label: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-400', width: '80%' }
  return { label: 'Very Strong', color: 'bg-green-400', textColor: 'text-green-300', width: '100%' }
}

function getCrackTime(entropy) {
  const guessesPerSec = 1e10
  const combinations = Math.pow(2, entropy)
  const seconds = combinations / guessesPerSec / 2
  if (seconds < 1) return 'Instant'
  if (seconds < 60) return `${Math.round(seconds)} seconds`
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`
  if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`
  if (seconds < 31536000 * 1000) return `${Math.round(seconds / 31536000)} years`
  if (seconds < 31536000 * 1e6) return `${Math.round(seconds / 31536000 / 1000)}k years`
  if (seconds < 31536000 * 1e9) return `${Math.round(seconds / 31536000 / 1e6)}M years`
  return `${(seconds / 31536000 / 1e9).toExponential(1)} years`
}

export default function password_strength_checker() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const analysis = useMemo(() => {
    if (!password) return null
    const passed = CRITERIA.filter(c => c.test(password))
    const entropy = calcEntropy(password)
    const strength = getStrength(entropy)
    return { passed, entropy, strength, crackTime: getCrackTime(entropy) }
  }, [password])

  return (
    <ToolLayout
      title="Password Strength Checker"
      desc="Analyze password security with entropy calculation, criteria checks, and crack time estimation. Never leaves your browser."
      icon="🔒" iconBg="rgba(99,102,241,0.08)"
      category="security" slug="password-strength-checker"
      faq={[
        { q: 'Is my password sent to a server?', a: 'No — all analysis happens locally in your browser. Nothing is transmitted.' },
        { q: 'What is entropy?', a: 'Entropy measures password randomness in bits. Higher entropy means harder to crack.' },
      ]}
      howItWorks={[
        'Enter a password (it never leaves your device).',
        'See real-time strength analysis, criteria checks, and estimated crack time.',
        'Follow the recommendations to improve your password.',
      ]}
    >
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Password input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Enter Password</label>
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Enter a password to analyze..."
              className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-5 py-4 text-white text-lg font-mono focus:outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 pr-14" />
            <button onClick={() => setShowPassword(s => !s)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-all text-sm font-bold">
              {showPassword ? '👁️‍🗨️' : '👁️'}
            </button>
          </div>
        </div>

        {analysis && (
          <>
            {/* Strength bar */}
            <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Strength</span>
                <span className={`text-sm font-extrabold ${analysis.strength.textColor}`}>
                  {analysis.strength.label}
                </span>
              </div>
              <div className="h-3 bg-black/30 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${analysis.strength.color}`}
                  style={{ width: analysis.strength.width }} />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-red-500/60">WEAK</span>
                <span className="text-[10px] text-green-500/60">STRONG</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 text-center">
                <div className="text-2xl font-extrabold text-indigo-400">{password.length}</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">Length</div>
              </div>
              <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 text-center">
                <div className="text-2xl font-extrabold text-purple-400">{analysis.entropy} bits</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">Entropy</div>
              </div>
              <div className="col-span-2 bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 text-center">
                <div className="text-xs font-bold text-slate-400 mb-1">Est. Crack Time (10B guesses/sec)</div>
                <div className={`text-lg font-extrabold ${analysis.strength.textColor}`}>{analysis.crackTime}</div>
              </div>
            </div>

            {/* Criteria checklist */}
            <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Criteria Checklist</h3>
              <div className="space-y-2">
                {CRITERIA.map(c => {
                  const passed = c.test(password)
                  return (
                    <div key={c.label} className={`flex items-center gap-3 px-3 py-2 rounded-xl ${passed ? 'bg-emerald-500/10' : 'bg-white/[0.02]'}`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${passed ? 'bg-emerald-500 text-white' : 'bg-white/[0.08] text-slate-600'}`}>
                        {passed ? '✓' : '○'}
                      </div>
                      <span className={`text-sm font-medium ${passed ? 'text-emerald-300' : 'text-slate-400'}`}>{c.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {!password && (
          <div className="text-center py-10 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🔒</div>
            <p className="text-sm text-slate-600 font-medium">Type a password to see its strength analysis</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
