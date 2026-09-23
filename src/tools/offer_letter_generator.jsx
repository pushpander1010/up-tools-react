import { useState, useRef, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function offer_letter_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [candidate, setCandidate] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [ctc, setCtc] = useState('')
  const [joining, setJoining] = useState('')
  const [location, setLocation] = useState('')
  const [copied, setCopied] = useState(false)

  const hasData = candidate && company && role

  const letterText = hasData ? `OFFER LETTER

Date: ${new Date().toLocaleDateString('en-IN')}

Dear ${candidate},

We are pleased to extend an offer of employment with ${company} for the position of ${role}.

${ctc ? `Your annual CTC will be ₹${parseInt(ctc).toLocaleString('en-IN')}.` : ''}
${joining ? `Your tentative date of joining is ${joining}.` : ''}
${location ? `Your work location will be ${location}.` : ''}

This offer is subject to satisfactory verification of your credentials and completion of pre-employment formalities.

We look forward to welcoming you to the team.

Warm regards,
${company} HR Team` : ''

  const downloadLetter = useCallback(() => {
    if (!letterText) return
    const blob = new Blob([letterText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `offer-letter-${candidate.replace(/\s+/g, '-').toLowerCase()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [letterText, candidate])

  const copyLetter = useCallback(() => {
    if (!letterText) return
    navigator.clipboard.writeText(letterText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [letterText])

  return (
    <ToolLayout
      title="Offer Letter Generator"
      desc="Offer Letter Generator - create professional offer letters with candidate details, CTC and joining date, online free. Free online, no sign-up. Works on any device."
      icon="📄" iconBg="rgba(245,158,11,0.08)"
      category="finance" slug="offer-letter-generator"
      faq={[
        { q: 'What is Offer Letter Generator?', a: 'A tool to generate professional offer letters with candidate name, company, role, CTC, and joining date.' },
        { q: 'How do I generate an offer letter?', a: 'Fill in the candidate name, company, role, CTC, and joining date — see a live preview and copy or download it.' },
        { q: 'How do I use this Offer Letter Generator online free?', a: 'Enter your input above, customize the options, and copy or save the result. Free with no sign-up.' },
        { q: 'How do I save my result?', a: 'Click the Download button to save as a .txt file, or click Copy to clipboard to paste elsewhere.' },
        { q: 'Can I use it more than once?', a: 'Yes, unlimited free use. Generate as many offer letters as you need, on any device.' },
        { q: 'Is this Offer Letter Generator free?', a: 'Yes, completely free with no sign-up. Use it unlimited times online on any device.' },
      ]}
      howItWorks={[
        'Enter candidate name, company name, role/position, annual CTC, and tentative joining date.',
        'Watch the offer letter preview update live as you type each field.',
        'Click Copy to clipboard to paste the letter into your own template or email.',
        'Click Download to save the letter as a .txt file, or open a print-ready view.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Offer Letter Generator", "applicationCategory": "BusinessApplication",
        "url": "https://www.uptools.in/offer-letter-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Inputs */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Candidate Name</label>
              <input value={candidate} onChange={e => setCandidate(e.target.value)} placeholder="Full name"
                className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm font-medium outline-none focus:border-amber-500/40 transition-all placeholder:text-slate-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Company Name</label>
              <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Company name"
                className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm font-medium outline-none focus:border-amber-500/40 transition-all placeholder:text-slate-500" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Role / Position</label>
              <input value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Software Engineer"
                className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm font-medium outline-none focus:border-amber-500/40 transition-all placeholder:text-slate-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Annual CTC (₹)</label>
              <input type="number" value={ctc} onChange={e => setCtc(e.target.value)} placeholder="e.g. 800000"
                className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm font-medium outline-none focus:border-amber-500/40 transition-all placeholder:text-slate-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Joining Date</label>
              <input type="date" value={joining} onChange={e => setJoining(e.target.value)}
                className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm font-medium outline-none focus:border-amber-500/40 transition-all placeholder:text-slate-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Work Location</label>
            <input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Bangalore"
              className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm font-medium outline-none focus:border-amber-500/40 transition-all placeholder:text-slate-500" />
          </div>
        </div>

        {/* Live Preview */}
        {hasData ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-amber-500/15 bg-gradient-to-br from-amber-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Live Preview</h3>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-slate-300 font-mono bg-black/30 rounded-xl p-4 border border-white/[0.05] leading-relaxed">{letterText}</pre>
            <div className="flex gap-3 mt-4">
              <button onClick={copyLetter}
                className="flex-1 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-sm hover:bg-amber-500/30 transition-all">
                {copied ? '✓ Copied!' : '📋 Copy to Clipboard'}
              </button>
              <button onClick={downloadLetter}
                className="flex-1 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-sm hover:bg-amber-500/30 transition-all">
                ⬇️ Download .txt
              </button>
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📄</div>
            <p className="text-sm text-slate-600 font-medium">Fill in the details to see a live preview</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
