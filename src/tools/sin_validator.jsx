import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const normalize = v => (v || '').replace(/\D/g, '').slice(0, 9)
const maskVal = v => v ? '•••••' + v.slice(-4) : '-'

function luhnCheck(num) {
  let sum = 0, alt = false
  for (let i = num.length - 1; i >= 0; i--) {
    let n = parseInt(num[i], 10)
    if (alt) { n *= 2; if (n > 9) n -= 9 }
    sum += n
    alt = !alt
  }
  return sum % 10 === 0
}

function validateSIN(sin, masked) {
  const v = normalize(sin)
  if (!v) return null
  const ok = v.length === 9 && luhnCheck(v)
  return {
    valid: ok,
    status: ok ? 'Valid checksum' : 'Invalid checksum',
    color: ok ? '#22c55e' : '#ef4444',
    display: masked ? maskVal(v) : v,
    note: ok ? 'Checksum looks valid.' : 'Check digits and try again.',
  }
}

export default function sin_validator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [sin, setSin] = useState('')
  const [masked, setMasked] = useState(false)

  const normalized = normalize(sin)
  const result = useMemo(() => validateSIN(sin, masked), [sin, masked])

  const inputClass = 'w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl px-5 py-4 text-2xl font-extrabold text-white outline-none focus:border-red-500/40 transition-all duration-300 placeholder:text-white/8 font-mono tracking-widest'

  return (
    <ToolLayout
      title="SIN Validator"
      desc="Validate Canadian SIN numbers with checksum (Luhn). Privacy-first."
      icon="🍁" iconBg="rgba(220,38,38,0.08)"
      category="canada" slug="sin-validator"
      faq={[
        { q: 'What is a SIN?', a: 'A Social Insurance Number (SIN) is a 9-digit number issued by the Canadian government.' },
        { q: 'Is my SIN stored?', a: 'No. All validation happens locally in your browser. Nothing is uploaded.' },
      ]}
      howItWorks={[
        'Enter a 9-digit Canadian SIN number.',
        'Optionally enable masking to hide most digits.',
        'View whether the checksum is valid.',
      ]}
      schema={{
        '@context': 'https://schema.org', '@type': 'SoftwareApplication',
        name: 'SIN Validator', applicationCategory: 'UtilitiesApplication',
        url: 'https://www.uptools.in/sin-validator/',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'CAD' }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Enter SIN (9 digits)</label>
          <input type="text" value={normalized} onChange={e => setSin(e.target.value)}
            placeholder="e.g., 046454286" maxLength={9} inputMode="numeric"
            className={inputClass} />
        </div>
        <label className="flex items-center gap-3 text-sm text-slate-400 cursor-pointer">
          <input type="checkbox" checked={masked} onChange={e => setMasked(e.target.checked)}
            className="w-4 h-4 rounded border-white/20 bg-white/10 text-red-500 focus:ring-red-500/40" />
          Mask number on screen
        </label>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 p-6 sm:p-8 overflow-hidden"
            style={{ borderColor: result.color + '30', background: result.color.replace(')', ',0.06)').replace('rgb', 'rgba'), animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: result.color }} />
              <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: result.color }}>{result.status}</h3>
            </div>
            <div className="text-2xl font-extrabold text-white font-mono tracking-wider">{result.display}</div>
            <p className="text-xs text-slate-500 mt-4">{result.note}</p>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🍁</div>
            <p className="text-sm text-slate-600 font-medium">Enter a SIN to validate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
