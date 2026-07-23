import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const DISPOSABLE_DOMAINS = [
  'guerrillamail.com', 'tempmail.com', 'yopmail.com', 'mailinator.com',
  '10minutemail.com', 'trashmail.com', 'dispostable.com', 'sharklasers.com',
  'guerrillamailblock.com', 'grr.la', 'disposableemailaddresses.emailmiser.com',
  'throwaway.email', 'getnada.com', 'mohmal.com', 'emailondeck.com',
  'fakeinbox.com', 'trashemail.de', 'maildrop.cc', 'discard.email',
  'mintemail.com', 'discardmail.com', 'tempail.com', 'temp-mail.org',
  'mytemp.email', 'burnermail.io',
]

function checkFormat(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function getDomain(email) {
  const parts = email.split('@')
  return parts.length === 2 ? parts[1].toLowerCase() : ''
}

function isDisposable(domain) {
  return DISPOSABLE_DOMAINS.includes(domain)
}

export default function email_validator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [email, setEmail] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const validate = useCallback(async () => {
    const trimmed = email.trim().toLowerCase()
    if (!trimmed) return

    setLoading(true)
    jumpTo()

    const formatOk = checkFormat(trimmed)
    const domain = getDomain(trimmed)
    const disposable = isDisposable(domain)

    let mxRecords = []
    let domainExists = false
    let mxError = null

    try {
      const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=MX`)
      const data = await res.json()
      if (data.Answer && data.Answer.length > 0) {
        mxRecords = data.Answer
          .filter(a => a.type === 15)
          .map(a => ({ priority: a.data.split(' ')[0], exchange: a.data.split(' ').slice(1).join(' ') }))
        domainExists = true
      } else {
        // Try A record to see if domain exists
        const aRes = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`)
        const aData = await aRes.json()
        domainExists = !!(aData.Answer && aData.Answer.length > 0)
      }
    } catch (err) {
      mxError = 'Could not check MX records'
    }

    // Score calculation
    let score = 0
    if (formatOk) score += 30
    if (domainExists) score += 25
    if (mxRecords.length > 0) score += 25
    if (!disposable) score += 20

    setResult({
      email: trimmed,
      formatOk,
      domain,
      domainExists,
      mxRecords,
      mxError,
      disposable,
      score,
    })

    setLoading(false)
  }, [email, jumpTo])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') validate()
  }, [validate])

  const scoreColor = result ? (
    result.score >= 80 ? 'emerald' : result.score >= 50 ? 'amber' : 'rose'
  ) : 'slate'

  const scoreLabel = result ? (
    result.score >= 80 ? 'Excellent' : result.score >= 50 ? 'Suspicious' : 'Invalid'
  ) : ''

  return (
    <ToolLayout
      title="Email Validator"
      desc="Validate email format, verify MX records, check disposable domains, and get a trust score."
      icon="✉️" iconBg="rgba(34,197,94,0.08)"
      category="security" slug="email-validator"
      faq={[
        { q: 'What makes an email address valid?', a: 'A valid email has a proper format (user@domain.tld), the domain must exist and have MX (Mail Exchange) records configured to receive email. The format regex checks for the basic structure.' },
        { q: 'What are disposable email addresses?', a: 'Disposable emails are temporary addresses that forward to spam or expire quickly. Services like Mailinator, Guerrilla Mail, and 10 Minute Mail provide throwaway inboxes often used for spam or signups you do not want to keep.' },
        { q: 'What are MX records?', a: 'MX (Mail Exchange) records are DNS entries that specify which mail servers accept email for a domain. Without MX records, an email address cannot receive mail even if the format is correct.' },
      ]}
      howItWorks={[
        'Enter the email address you want to validate.',
        'Click "Validate Email" to run the checks.',
        'Review the format check, domain existence, MX records, and disposable flag.',
        'See the overall trust score from 0 to 100.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Email Validator", "applicationCategory": "SecurityApplication",
        "url": "https://www.uptools.in/email-validator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Input */}
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-2 block">Email Address</label>
          <div className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="user@example.com"
              className="flex-1 bg-white/[0.06] border border-white/8 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/40 transition-all placeholder:text-slate-600"
            />
            <button onClick={validate} disabled={loading}
              className="glow-btn px-6 py-3 rounded-xl text-sm font-semibold disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.08))' }}>
              {loading ? '⏳' : '✉️'} Validate
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div ref={resultRef} className="space-y-4"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>

            {/* Score */}
            <div className="rounded-3xl border border-white/8 bg-white/[0.04] p-6 text-center">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Trust Score</div>
              <div className={`text-5xl font-extrabold mb-1 ${
                scoreColor === 'emerald' ? 'text-emerald-400' :
                scoreColor === 'amber' ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {result.score}
              </div>
              <div className={`text-sm font-bold ${
                scoreColor === 'emerald' ? 'text-emerald-400' :
                scoreColor === 'amber' ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {scoreLabel}
              </div>
              {/* Score bar */}
              <div className="mt-3 h-2 bg-white/[0.08] rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${
                  scoreColor === 'emerald' ? 'bg-emerald-500' :
                  scoreColor === 'amber' ? 'bg-amber-500' : 'bg-rose-500'
                }`} style={{ width: `${result.score}%` }} />
              </div>
            </div>

            {/* Check items */}
            <div className="space-y-3">
              {/* Format */}
              <CheckItem
                label="Format Valid"
                value={result.formatOk ? 'Correct format (user@domain.tld)' : 'Invalid format'}
                ok={result.formatOk}
              />

              {/* Domain */}
              <CheckItem
                label="Domain Exists"
                value={result.domainExists ? `${result.domain} is a valid domain` : `${result.domain} could not be resolved`}
                ok={result.domainExists}
              />

              {/* MX Records */}
              <CheckItem
                label="MX Records"
                value={result.mxRecords.length > 0
                  ? `${result.mxRecords.length} record(s) found: ${result.mxRecords[0].exchange}`
                  : result.mxError || 'No MX records found'}
                ok={result.mxRecords.length > 0}
              />

              {/* Disposable */}
              <CheckItem
                label="Disposable Check"
                value={result.disposable ? `${result.domain} is a known disposable email provider` : 'Not a disposable email domain'}
                ok={!result.disposable}
              />
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}

function CheckItem({ label, value, ok }) {
  return (
    <div className={`flex items-start gap-3 p-4 rounded-2xl border transition-all ${
      ok ? 'bg-emerald-500/[0.05] border-emerald-500/15' : 'bg-rose-500/[0.05] border-rose-500/15'
    }`}>
      <span className={`text-lg mt-0.5 ${ok ? 'text-emerald-400' : 'text-rose-400'}`}>
        {ok ? '✅' : '❌'}
      </span>
      <div>
        <div className="text-sm font-semibold text-white">{label}</div>
        <div className={`text-xs mt-0.5 ${ok ? 'text-emerald-400/80' : 'text-rose-400/80'}`}>{value}</div>
      </div>
    </div>
  )
}
