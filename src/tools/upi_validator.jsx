import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'

const UPI_DOMAINS = new Set([
  'okicici','okaxis','oksbi','okhdfcbank','okbankofindia','okbob','okcanara',
  'okindianbank','okcentralbank','okpunjabbank','okunitedbank','okuco bank',
  'okunionbank','okvijayabank','okcorporationbank','okdenabank','okbankofbaroda',
  'okbankofmaharashtra','okcentralbankofindia','okidbi','oksbin','okpnbs',
  'okurtibank','okapna','okallahabadbank','okandhra','okaranyakanya',
  'ybl','ibl','paytm','googlepay','razorpay','phonepe','freecharge',
  'mobikwik','bhim','npci','upi',
  'okcity','okfederal','oksouth','okkarur','oktamilnad','okkarnataka',
  'okkerala','oklakshmi','okmuthoot','okmanappuram','okfino',
  'okairtel','okjio','okvi','okbsnl','okjpb',
  'okequitas','oksuryoday','okjan','okshivalik','okpbs',
  'okausf','okcapital','okindusind','kotak','yesbank','axisbank',
  'hdfcbank','icicibank','bob','canarabank','pnb','sbi',
  'unionbankofindia','bankofbaroda','centralbank','idbibank',
  'federalbank','indusind','kotakbank','rblbank',
  'dbs','digibank','scb','standardchartered','hsbc','citibank',
  'barclays','deutsche','jp morgan','goldmansachs','boi',
  'iob','tb','corpbank','dena','vijaya','pnbs','psb','sbs',
  'ucobank','allahabadbank','andhra','corporation',
  'idbi','indian','oriental','punjab','syndicate',
  'vijaya','andhra bank','bank of india','bank of maharashtra',
  'canara','central','dena','indian overseas',
  'punjab national','punjab sind',
])

function validateUPI(upi) {
  const errors = []
  const warnings = []
  let username = '', domain = ''

  if (!upi.includes('@')) {
    errors.push('Missing @ separator. UPI ID must be in format username@bank')
    return { isValid: false, errors, warnings, username, domain, isFormatValid: false }
  }

  const parts = upi.split('@')
  if (parts.length !== 2) {
    errors.push('Multiple @ symbols found. UPI ID must have exactly one @ separator')
    return { isValid: false, errors, warnings, username, domain, isFormatValid: false }
  }

  username = parts[0].trim()
  domain = parts[1].trim().toLowerCase()

  if (!username) errors.push('Username cannot be empty')
  else if (username.length > 50) errors.push(`Username must be 50 characters or less (found ${username.length})`)
  else if (!/^[a-zA-Z0-9._-]+$/.test(username)) errors.push('Username can only contain letters, numbers, periods (.), hyphens (-), and underscores (_)')

  if (!domain) errors.push('Domain (bank name) cannot be empty after @')
  else if (!/^[a-zA-Z0-9.-]+$/.test(domain)) errors.push('Domain can only contain letters, numbers, periods, and hyphens')
  else if (domain.length > 30) errors.push(`Domain appears too long (${domain.length} characters)`)
  else if (!UPI_DOMAINS.has(domain)) warnings.push(`Domain "${domain}" is not in our database of recognized UPI handles`)

  const isFormatValid = errors.length === 0
  const isValid = isFormatValid && UPI_DOMAINS.has(domain)
  return { isValid, errors, warnings, username, domain, isFormatValid }
}

export default function upi_validator() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(false)

  const validate = useCallback(() => {
    const val = input.trim().toLowerCase()
    if (!val) { setResult(null); return }
    setResult(validateUPI(val))
  }, [input])

  const toCSV = useCallback(() => {
    if (!result) return
    const val = input.trim().toLowerCase()
    const csv = `Input,Username,Domain,Format Valid,Domain Recognized,Overall Valid\n"${val}","${result.username}","${result.domain}",${result.isFormatValid ? 'Yes' : 'No'},${result.isValid ? 'Yes' : 'No'},${result.isValid ? 'Yes' : 'No'}`
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'upi_validation.csv'
    document.body.appendChild(a); a.click(); a.remove()
  }, [result, input])

  return (
    <ToolLayout
      title="UPI Validator"
      desc="Validate Indian UPI IDs. Check format, username, and verify bank domain against our database of 100+ UPI handles."
      icon="💳" iconBg="rgba(34,197,94,0.08)"
      category="finance" slug="upi-validator"
      faq={[
        { q: 'What UPI formats are supported?', a: 'We validate the standard format: username@bank (e.g., user@okicici, name@paytm).' },
        { q: 'How many banks are in the database?', a: '100+ UPI handles including all major banks (SBI, ICICI, HDFC) and third-party apps (PhonePe, Paytm, GooglePay).' },
      ]}
      howItWorks={[
        'Enter a UPI ID in the format username@bank.',
        'Click Validate to check format and domain.',
        'See detailed results with errors, warnings, and recognized status.',
        'Export results as CSV for record-keeping.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "UPI Validator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/upi-validator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-lg mx-auto space-y-4">
        {/* Input */}
        <div className="bg-white/[0.06] border border-white/8 rounded-2xl p-4">
          <label className="text-xs font-semibold text-slate-500 mb-2 block">Enter UPI ID</label>
          <input type="text" value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && validate()}
            placeholder="e.g. user@okicici, name@paytm"
            className="w-full bg-black/20 border-2 border-white/8 rounded-xl px-4 py-3 text-sm font-mono text-white outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600" />
          <div className="flex gap-2 mt-3">
            <button onClick={validate} className="glow-btn flex-1 py-3 rounded-xl text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
              ✅ Validate
            </button>
            <button onClick={() => { setInput(''); setResult(null) }}
              className="px-4 py-3 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/8 text-slate-400 hover:text-white transition-all">
              🔄 Reset
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="bg-white/[0.06] border border-white/8 rounded-2xl p-4 space-y-4"
            style={{ animation: 'slideUp 0.3s ease-out' }}>
            {/* Status */}
            <div className="text-center py-4">
              <div className="text-3xl mb-2">{result.isValid ? '✅' : result.isFormatValid ? '⚠️' : '❌'}</div>
              <div className={`text-lg font-extrabold ${result.isValid ? 'text-emerald-400' : result.isFormatValid ? 'text-amber-400' : 'text-red-400'}`}>
                {result.isValid ? 'Valid UPI ID' : result.isFormatValid ? 'Format Valid — Unknown Domain' : 'Invalid UPI ID'}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {result.isValid ? 'Format and domain are recognized.' : result.isFormatValid ? 'The format is correct but the domain is not in our database.' : 'Please check the format and try again.'}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2 text-sm">
              {[
                { label: 'Input', value: input.trim().toLowerCase() },
                { label: 'Username', value: result.username || 'N/A' },
                { label: 'Domain', value: result.domain || 'N/A' },
                { label: 'Format', value: result.isFormatValid ? '✅ Correct' : '❌ Incorrect', color: result.isFormatValid ? '#22c55e' : '#ef4444' },
                { label: 'Domain recognized', value: result.isValid ? '✅ Yes' : result.warnings.length > 0 ? '⚠️ Unknown' : '❌ No', color: result.isValid ? '#22c55e' : result.warnings.length > 0 ? '#f59e0b' : '#ef4444' },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                  <span className="text-slate-500 font-semibold">{row.label}</span>
                  <span className="font-mono" style={{ color: row.color || '#e2e8f0' }}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Errors */}
            {result.errors.length > 0 && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 space-y-1">
                <div className="text-xs font-bold text-red-400">Errors:</div>
                {result.errors.map((e, i) => <div key={i} className="text-xs text-red-300">• {e}</div>)}
              </div>
            )}

            {/* Warnings */}
            {result.warnings.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                <div className="text-xs font-bold text-amber-400">Warnings:</div>
                {result.warnings.map((w, i) => <div key={i} className="text-xs text-amber-300">• {w}</div>)}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <button onClick={toCSV}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-white/[0.06] border border-white/8 text-slate-400 hover:text-white transition-all">
                📥 Export CSV
              </button>
              <button onClick={() => { navigator.clipboard.writeText(input.trim().toLowerCase()); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/[0.06] border border-white/8 text-slate-400 hover:text-white'}`}>
                {copied ? '✓ Copied' : '📋 Copy UPI'}
              </button>
            </div>
          </div>
        )}

        {!result && (
          <div className="text-center py-10 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">💳</div>
            <p className="text-sm text-slate-600 font-medium">Enter a UPI ID and click Validate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
