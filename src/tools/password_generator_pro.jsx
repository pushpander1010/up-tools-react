import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const CHARS = {
  u: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  l: 'abcdefghijklmnopqrstuvwxyz',
  n: '0123456789',
  s: '!@#$%^&*()_+-='
}

function generatePassword(length, options) {
  let cs = ''
  if (options.upper) cs += CHARS.u
  if (options.lower) cs += CHARS.l
  if (options.numbers) cs += CHARS.n
  if (options.symbols) cs += CHARS.s
  if (!cs) cs = CHARS.l
  const arr = new Uint32Array(length)
  crypto.getRandomValues(arr)
  return Array.from(arr, v => cs[v % cs.length]).join('')
}

export default function password_generator_pro() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [length, setLength] = useState(16)
  const [options, setOptions] = useState({ upper: true, lower: true, numbers: true, symbols: true })
  const [password, setPassword] = useState('')
  const [bulkCount, setBulkCount] = useState(10)
  const [bulkPasswords, setBulkPasswords] = useState([])
  const [copied, setCopied] = useState(null)

  const generate = useCallback(() => {
    setPassword(generatePassword(length, options))
  }, [length, options])

  const generateBulk = useCallback(() => {
    setBulkPasswords(Array.from({ length: bulkCount }, () => generatePassword(length, options)))
  }, [length, options, bulkCount])

  const copy = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 1500)
  }

  const toggle = (key) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Password Generator"
      desc="Generate cryptographically secure passwords with customizable length and character options."
      icon="🔐" iconBg="rgba(99,102,241,0.08)"
      category="security" slug="password-generator-pro"
      faq={[
        { q: "Are the passwords secure?", a: "Yes. Passwords are generated using the Web Crypto API (crypto.getRandomValues), which provides cryptographically strong randomness." },
        { q: "Are passwords stored anywhere?", a: "No. All generation happens in your browser. Nothing is sent to any server." },
      ]}
      howItWorks={[
        "Choose password length with the slider (8–64 characters).",
        "Toggle character types: uppercase, lowercase, numbers, symbols.",
        "Click Generate to create a new password.",
        "Copy with one click or generate multiple passwords at once.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Password Generator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/password-generator-pro/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Password display */}
        <div className="p-4 rounded-2xl bg-white/[0.04] text-center">
          <div className="text-xl sm:text-2xl font-extrabold text-indigo-400 font-mono break-all leading-relaxed">
            {password || <span className="text-slate-600 text-base font-normal">Click Generate</span>}
          </div>
        </div>

        {/* Generate + Copy */}
        <div className="flex gap-3">
          <button onClick={() => { generate(); jumpTo() }}
            className="flex-1 py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
            🔄 Generate
          </button>
          <button onClick={() => password && copy(password, 'single')}
            className={`px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
              copied === 'single' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/[0.06] border border-white/8 text-slate-400 hover:text-white'
            }`}>
            {copied === 'single' ? '✓' : '📋'}
          </button>
        </div>

        {/* Length slider */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Length: <span className="text-indigo-400">{length}</span>
          </label>
          <input type="range" min="8" max="64" value={length}
            onChange={e => setLength(parseInt(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer accent-indigo-500"
            style={{ background: `linear-gradient(to right, #6366f1 ${(length - 8) / 56 * 100}%, rgba(255,255,255,0.06) ${(length - 8) / 56 * 100}%)` }} />
          <div className="flex justify-between text-[10px] text-slate-600 mt-1"><span>8</span><span>64</span></div>
        </div>

        {/* Character options */}
        <div className="grid grid-cols-2 gap-3">
          {[
            ['upper', 'Uppercase (A-Z)'],
            ['lower', 'Lowercase (a-z)'],
            ['numbers', 'Numbers (0-9)'],
            ['symbols', 'Symbols (!@#$)'],
          ].map(([key, label]) => (
            <button key={key} onClick={() => toggle(key)}
              className={`p-3 rounded-xl text-sm font-semibold text-left transition-all ${
                options[key] ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30' : 'bg-white/[0.06] text-slate-500 border border-white/8'
              }`}>
              {options[key] ? '✅' : '⬜'} {label}
            </button>
          ))}
        </div>

        {/* Bulk generation */}
        <div className="p-5 rounded-3xl border-2 border-white/8 bg-white/[0.02]">
          <h3 className="text-sm font-bold text-white mb-3">Bulk Generate</h3>
          <div className="flex gap-3 mb-3">
            <div className="w-24">
              <input type="number" value={bulkCount} min={1} max={100}
                onChange={e => setBulkCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                className={inputClass} />
            </div>
            <button onClick={() => { generateBulk(); jumpTo() }}
              className="flex-1 py-3 rounded-xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all">
              Generate Multiple
            </button>
            {bulkPasswords.length > 0 && (
              <button onClick={() => copy(bulkPasswords.join('\n'), 'bulk')}
                className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  copied === 'bulk' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/[0.06] border border-white/8 text-slate-400 hover:text-white'
                }`}>
                {copied === 'bulk' ? '✓' : '📋 Copy All'}
              </button>
            )}
          </div>
          {bulkPasswords.length > 0 && (
            <div className="max-h-48 overflow-y-auto space-y-1">
              {bulkPasswords.map((pw, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.05] transition-all group">
                  <code className="flex-1 text-xs text-slate-300 font-mono break-all">{pw}</code>
                  <button onClick={() => copy(pw, `bulk-${i}`)}
                    className="px-2 py-1 rounded text-[10px] text-slate-600 hover:text-white transition-colors shrink-0">
                    {copied === `bulk-${i}` ? '✓' : '📋'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
