import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const API = 'https://backend.uptools.in/api/email-info'

export default function email_osint_lookup() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [email, setEmail] = useState('')
  const [result, setResult] = useState(null)
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const isValidEmail = (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)

  const lookup = useCallback(async () => {
    const trimmed = email.trim().toLowerCase()
    if (!trimmed) { setStatus('error'); setErrorMsg('Enter an email address first.'); return }
    if (!isValidEmail(trimmed)) { setStatus('error'); setErrorMsg('That does not look like a valid email.'); return }

    setStatus('loading')
    setResult(null)
    setErrorMsg('')
    jumpTo()
    try {
      const r = await fetch(`${API}?email=${encodeURIComponent(trimmed)}`)
      const d = await r.json()
      if (!r.ok) throw new Error(d.detail || 'Lookup failed')
      setResult(d)
      setStatus('done')
    } catch (e) {
      setStatus('error'); setErrorMsg(e.message || 'Could not look up this email.')
    }
  }, [email, jumpTo])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"

  const Badge = ({ ok, label }) => (
    <div className={`flex items-center justify-between gap-2 rounded-xl px-4 py-3 border ${ok ? 'bg-emerald-500/10 border-emerald-500/25' : 'bg-rose-500/10 border-rose-500/25'}`}>
      <span className="text-sm text-slate-300">{label}</span>
      <span className={`text-sm font-bold ${ok ? 'text-emerald-400' : 'text-rose-400'}`}>{ok ? 'Yes' : 'No'}</span>
    </div>
  )

  return (
    <ToolLayout
      title="Email OSINT Lookup 🔍 Find Info from an Email"
      desc="Email OSINT lookup — enter any email address to check validity, disposable status, DNS & MX records, and domain details. Free open-source intelligence tool, no sign-up."
      icon="🔍" iconBg="rgba(99,102,241,0.08)"
      category="security" slug="email-osint-lookup"
      faq={[
        { q: "What does an email OSINT lookup show?", a: "It checks whether the email format is valid, if the domain uses a disposable/temporary service, whether DNS/MX records exist (so mail can be delivered), and returns the domain's MX and A records." },
        { q: "Can I find a person's identity from an email?", a: "No. OSINT can verify an email's domain and infrastructure, but it cannot reveal a person's name, location, or other private data. We do not scrape personal information." },
        { q: "Is this free?", a: "Yes, completely free with no sign-up. Lookups run through our backend using free public sources (disify + dns.google)." },
        { q: "What is a disposable email?", a: "A temporary mailbox service (like temp-mail or mailinator). These are often flagged because they're commonly used to create throwaway accounts." },
      ]}
      howItWorks={[
        "Enter any email address.",
        "Our backend checks format, disposable domain, and DNS/MX records.",
        "See the domain's mail servers and validity results instantly.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        name: "Email OSINT Lookup", "applicationCategory": "UtilitiesApplication",
        url: "https://www.uptools.in/email-osint-lookup/",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-4">
          <p className="text-sm text-indigo-300 font-semibold">🔎 Open-source email intelligence — verify an email's domain, mail servers, and validity. Free, no sign-up, no personal data scraping.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Email Address</label>
          <input type="email" value={email} onChange={e => { setEmail(e.target.value); setStatus('idle') }}
            onKeyDown={e => e.key === 'Enter' && lookup()}
            placeholder="name@example.com" className={inputClass} />
        </div>

        <button onClick={lookup}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
          🔍 Look Up Email
        </button>

        {status === 'loading' && (
          <div className="text-center py-12 rounded-3xl border-2 border-indigo-500/15 bg-white/[0.01]">
            <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-slate-400">Running lookup...</p>
          </div>
        )}

        {status === 'error' && (
          <div ref={resultRef} className="rounded-3xl border-2 border-rose-500/15 bg-rose-500/[0.06] p-6 text-center">
            <div className="text-2xl mb-2">⚠️</div>
            <p className="text-sm text-rose-400 font-semibold">{errorMsg}</p>
          </div>
        )}

        {status === 'done' && result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Lookup Result</h3>
            </div>

            <div className="bg-white/[0.04] rounded-xl p-3 mb-4">
              <div className="text-[10px] text-slate-500 font-semibold uppercase">EMAIL</div>
              <div className="text-sm font-mono text-indigo-300 break-all">{result.email}</div>
            </div>

            <div className="space-y-2 mb-5">
              <Badge ok={result.valid_format} label="Valid format" />
              <Badge ok={!result.disposable} label="Not disposable / temporary" />
              <Badge ok={result.dns} label="DNS records exist (deliverable)" />
              <Badge ok={result.whitelist} label="Known real mail provider" />
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                ['Domain', result.domain],
                ['TLD', result.tld],
                ['Confidence', `${result.confidence}%`],
              ].map(([k, v]) => (
                <div key={k} className="text-center p-2 rounded-xl bg-white/[0.06]">
                  <div className="text-[10px] text-slate-400 font-semibold">{k}</div>
                  <div className="text-xs text-white font-bold break-all">{v || '—'}</div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {result.mx_records && result.mx_records.length > 0 && (
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase mb-1.5">Mail servers (MX)</div>
                  <div className="space-y-1">
                    {result.mx_records.slice(0, 8).map((m, i) => (
                      <div key={i} className="text-xs font-mono text-slate-400 bg-white/[0.04] rounded-lg px-3 py-1.5 break-all">{m}</div>
                    ))}
                  </div>
                </div>
              )}
              {result.a_records && result.a_records.length > 0 && (
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase mb-1.5">IP addresses (A)</div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.a_records.slice(0, 6).map((a, i) => (
                      <span key={i} className="text-xs font-mono text-slate-400 bg-white/[0.04] rounded-lg px-2.5 py-1">{a}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {status === 'idle' && (
          <div className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🔍</div>
            <p className="text-sm text-slate-600 font-medium">Enter an email address to begin the lookup</p>
          </div>
        )}

        <div className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-5">
          <h3 className="text-sm font-bold text-slate-300 mb-3">📌 How to Read the Results</h3>
          <ul className="space-y-2 text-sm text-slate-400 list-disc list-inside">
            <li><b className="text-slate-300">Valid format</b> — the email is syntactically correct.</li>
            <li><b className="text-slate-300">Disposable</b> — uses a temporary mail service (often flagged).</li>
            <li><b className="text-slate-300">DNS / MX</b> — the domain has mail servers, so the address could receive mail.</li>
            <li><b className="text-slate-300">MX & A records</b> — the domain's actual mail and web servers.</li>
          </ul>
        </div>

        <div className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-5">
          <h3 className="text-sm font-bold text-slate-300 mb-3">🛡️ What This Tool Does NOT Do</h3>
          <p className="text-sm text-slate-400">
            This is a technical/domain-level lookup. It does <b className="text-slate-300">not</b> reveal a person's
            name, location, phone number, or any private data, and it does not scan social media profiles.
            It only inspects the email's own domain and mail infrastructure from public sources.
          </p>
        </div>
      </div>
    </ToolLayout>
  )
}
