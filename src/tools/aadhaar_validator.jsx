import { useState, useCallback, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const VERHOEFF_D = [
  [0,1,2,3,4,5,6,7,8,9],
  [1,2,3,4,0,6,7,8,9,5],
  [2,3,4,0,1,7,8,9,5,6],
  [3,4,0,1,2,8,9,5,6,7],
  [4,0,1,2,3,9,5,6,7,8],
  [5,9,8,7,6,0,4,3,2,1],
  [6,5,9,8,7,1,0,4,3,2],
  [7,6,5,9,8,2,1,0,4,3],
  [8,7,6,5,9,3,2,1,0,4],
  [9,8,7,6,5,4,3,2,1,0]
]
const VERHOEFF_P = [
  [0,1,2,3,4,5,6,7,8,9],
  [1,5,7,6,2,8,3,0,9,4],
  [5,8,0,3,7,9,6,1,4,2],
  [8,9,1,6,0,4,3,5,2,7],
  [9,4,5,3,1,2,6,8,7,0],
  [4,2,8,6,5,7,3,9,0,1],
  [2,7,9,3,8,0,6,4,1,5],
  [7,0,4,6,9,1,3,2,5,8]
]
const VERHOEFF_INV = [0,4,3,2,1,5,6,7,8,9]

function verhoeffCheck(num) {
  let c = 0
  const digits = num.split('').reverse()
  for (let i = 0; i < digits.length; i++) {
    c = VERHOEFF_D[c][VERHOEFF_P[i % 8][parseInt(digits[i])]]
  }
  return c === 0
}

export default function aadhaar_validator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)

  const formatInput = useCallback((val) => {
    let digits = val.replace(/[^\d]/g, '')
    if (digits.length > 12) digits = digits.substring(0, 12)
    if (digits.length > 8) return digits.substring(0, 4) + ' ' + digits.substring(4, 8) + ' ' + digits.substring(8)
    if (digits.length > 4) return digits.substring(0, 4) + ' ' + digits.substring(4)
    return digits
  }, [])

  const handleInput = useCallback((e) => {
    setInput(formatInput(e.target.value))
  }, [formatInput])

  const validate = useCallback(() => {
    const digits = input.replace(/\s/g, '')
    if (!digits) { setResult(null); return }
    if (!/^\d{12}$/.test(digits)) {
      setResult({ valid: false, formatted: digits, formatOk: false, checksumOk: false, digits })
      return
    }
    const checksumOk = verhoeffCheck(digits)
    const formatted = digits.substring(0, 4) + ' ' + digits.substring(4, 8) + ' ' + digits.substring(8)
    setResult({ valid: checksumOk, formatted, formatOk: true, checksumOk, digits })
  }, [input])

  const reset = useCallback(() => { setInput(''); setResult(null) }, [])

  const copyShare = useCallback(() => {
    const num = input.replace(/\s/g, '')
    const url = new URL(window.location.href)
    if (num) url.searchParams.set('n', num)
    navigator.clipboard.writeText(url.toString())
  }, [input])

  const inputClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 text-center text-xl tracking-widest font-mono"

  return (
    <ToolLayout
      title="Aadhaar Number Validator"
      desc="Validate your 12-digit Aadhaar number instantly using the Verhoeff checksum algorithm. No data stored."
      icon="🪪" iconBg="rgba(99,102,241,0.08)"
      category="dev" slug="aadhaar-validator"
      faq={[
        { q: 'What is an Aadhaar number?', a: 'Aadhaar is a 12-digit unique identity number issued by UIDAI to residents of India.' },
        { q: 'Does this tool store my Aadhaar number?', a: 'No. All validation runs locally in your browser. Your Aadhaar number is never sent to any server.' },
      ]}
      howItWorks={[
        'Enter your 12-digit Aadhaar number (spaces are handled automatically).',
        'Click Validate to check format and Verhoeff checksum.',
        'See detailed validation results with format and checksum status.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Aadhaar Number Validator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/aadhaar-validator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08]">
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">Enter Aadhaar Number (12 digits)</label>
          <input type="text" inputMode="numeric" maxLength={14} value={input} onChange={handleInput}
            placeholder="e.g. 1234 5678 9012" className={inputClass} />
          <div className="text-center text-[11px] text-slate-600 mt-2">Enter 12 digits. Spaces are automatically handled.</div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => { validate(); jumpTo() }}
            className="glow-btn flex-1 py-3 rounded-xl text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            Validate Aadhaar
          </button>
          <button onClick={reset}
            className="px-4 py-3 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">
            Reset
          </button>
          <button onClick={copyShare}
            className="px-4 py-3 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">
            🔗 Share
          </button>
        </div>

        {result && (
          <div ref={resultRef} className="space-y-3" style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            {/* Main Result */}
            <div className={`p-5 rounded-2xl text-center border-2 ${result.valid ? 'bg-emerald-500/[0.08] border-emerald-500/30' : 'bg-red-500/[0.08] border-red-500/30'}`}>
              <div className="text-2xl font-mono font-bold text-white tracking-widest mb-2">{result.formatted}</div>
              <div className={`text-lg font-bold ${result.valid ? 'text-emerald-400' : 'text-red-400'}`}>
                {result.valid ? '✅ Valid Aadhaar Number' : '❌ Invalid Aadhaar Number'}
              </div>
            </div>

            {/* Details */}
            <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/[0.08]">
              <h3 className="text-sm font-bold text-slate-300 mb-3">Validation Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  ['Digits', result.digits],
                  ['Length', `${result.digits.length} digits`],
                  ['Format', result.formatOk ? '✅ Correct (12)' : '❌ Incorrect'],
                  ['Checksum', result.checksumOk ? '✅ Valid' : '❌ Invalid'],
                ].map(([label, val]) => (
                  <div key={label} className="py-1.5 border-b border-white/[0.04]">
                    <span className="text-slate-500">{label}: </span>
                    <span className="text-white">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
