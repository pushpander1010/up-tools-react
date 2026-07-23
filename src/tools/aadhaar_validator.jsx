import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

// Verhoeff algorithm tables
const d = [
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
const p = [
  [0,1,2,3,4,5,6,7,8,9],
  [1,5,7,6,2,8,3,0,9,4],
  [5,8,0,3,7,9,6,1,4,2],
  [8,9,1,6,0,4,3,5,2,7],
  [9,4,5,3,1,2,6,8,7,0],
  [4,2,8,6,5,7,3,9,0,1],
  [2,7,9,3,8,0,6,4,1,5],
  [7,0,4,6,9,1,3,2,5,8]
]

function verhoeffCheck(num) {
  let c = 0
  const digits = num.split('').reverse()
  for (let i = 0; i < digits.length; i++) {
    c = d[c][p[i % 8][parseInt(digits[i])]]
  }
  return c === 0
}

function formatAadhaar(digits) {
  if (digits.length === 12) {
    return digits.substring(0, 4) + ' ' + digits.substring(4, 8) + ' ' + digits.substring(8, 12)
  }
  return digits
}

export default function aadhaar_validator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)

  const handleInput = useCallback((val) => {
    let digits = val.replace(/[^\d]/g, '')
    if (digits.length > 12) digits = digits.substring(0, 12)
    if (digits.length > 8) val = digits.substring(0, 4) + ' ' + digits.substring(4, 8) + ' ' + digits.substring(8)
    else if (digits.length > 4) val = digits.substring(0, 4) + ' ' + digits.substring(4)
    else val = digits
    setInput(val)
  }, [])

  const validate = useCallback(() => {
    const digits = input.replace(/\s/g, '')
    if (!digits) {
      setResult({ valid: false, error: 'Please enter an Aadhaar number.' })
      return
    }
    if (!/^\d{12}$/.test(digits)) {
      setResult({ valid: false, error: `Aadhaar must be exactly 12 digits. You entered ${digits.length}.`, digits, input })
      return
    }
    const isValid = verhoeffCheck(digits)
    const formatted = formatAadhaar(digits)
    setResult({
      valid: isValid,
      formatted,
      digits,
      input,
      formatValid: true,
      checksumValid: isValid,
    })
  }, [input])

  const reset = useCallback(() => {
    setInput('')
    setResult(null)
  }, [])

  const downloadCSV = useCallback(() => {
    if (!result) return
    const csv = "Input,Digits,Length,Format Valid,Checksum Valid,Overall Valid\n" +
      `"${result.input}","${result.digits}",${result.digits.length},${result.formatValid ? 'Yes' : 'No'},${result.checksumValid ? 'Yes' : 'No'},${result.valid ? 'Yes' : 'No'}`
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url; a.download = "aadhaar_validation.csv"
    document.body.appendChild(a); a.click(); a.remove()
    URL.revokeObjectURL(url)
  }, [result])

  const copyShare = useCallback(async () => {
    const num = input.replace(/\s/g, '')
    const url = new URL(window.location.href)
    if (num) url.searchParams.set('n', num)
    try { await navigator.clipboard.writeText(url.toString()) } catch {}
  }, [input])

  return (
    <ToolLayout
      title="Aadhaar Number Validator"
      desc="Validate Indian Aadhaar numbers using the Verhoeff checksum algorithm."
      icon="🆔" iconBg="rgba(99,102,241,0.08)"
      category="validator" slug="aadhaar-validator"
      faq={[
        { q: 'How does Aadhaar validation work?', a: 'It uses the Verhoeff checksum algorithm, which detects all single-digit errors and all adjacent transposition errors.' },
        { q: 'Is my Aadhaar number stored?', a: 'No. All validation happens locally in your browser. Nothing is sent to any server.' },
      ]}
      howItWorks={[
        'Enter a 12-digit Aadhaar number.',
        'Click Validate to run the Verhoeff checksum.',
        'See if the number is valid and download results as CSV.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Aadhaar Number Validator", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/aadhaar-validator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Aadhaar Number</label>
          <input type="text" value={input} onChange={e => handleInput(e.target.value)}
            placeholder="Enter 12-digit Aadhaar number"
            className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-5 py-4 text-white text-lg font-mono outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 tracking-widest" />
        </div>

        <div className="flex gap-3">
          <button onClick={() => { validate(); jumpTo() }}
            className="glow-btn px-6 py-3 rounded-xl text-sm flex-1"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            Validate
          </button>
          <button onClick={reset}
            className="px-4 py-3 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">
            Reset
          </button>
        </div>

        {result && (
          <div ref={resultRef} className="space-y-4">
            {result.error ? (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
                <div className="text-2xl mb-2">❌</div>
                <div className="text-red-400 font-semibold">{result.error}</div>
              </div>
            ) : (
              <>
                <div className="text-center p-6 rounded-2xl bg-black/20 border border-white/[0.08]">
                  <div className="text-2xl font-mono font-bold text-white tracking-widest mb-3">{result.formatted}</div>
                  <div className={`text-lg font-semibold ${result.valid ? 'text-emerald-400' : 'text-red-400'}`}>
                    {result.valid ? '✅ Valid Aadhaar Number' : '❌ Invalid Aadhaar Number'}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    {result.valid ? 'Passes Verhoeff checksum validation.' : 'Fails the Verhoeff checksum. Please check for typos.'}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { label: 'Input', value: result.input },
                    { label: 'Digits', value: result.digits },
                    { label: 'Format', value: result.formatValid ? '✅ 12 digits' : '❌ Incorrect' },
                    { label: 'Checksum', value: result.checksumValid ? '✅ Valid' : '❌ Invalid' },
                  ].map((item, i) => (
                    <div key={i} className="p-3 bg-black/20 rounded-xl">
                      <div className="text-xs text-slate-500">{item.label}</div>
                      <div className="text-white font-semibold">{item.value}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={downloadCSV}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">
                    📥 CSV Export
                  </button>
                  <button onClick={copyShare}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">
                    🔗 Copy Share Link
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
