import { useState, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function experience_letter_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const letterRef = useRef(null)
  const [employeeName, setEmployeeName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [role, setRole] = useState('')
  const [joiningDate, setJoiningDate] = useState('')
  const [leavingDate, setLeavingDate] = useState('')
  const [supervisorName, setSupervisorName] = useState('')
  const [supervisorTitle, setSupervisorTitle] = useState('')

  const hasData = employeeName && companyName && role

  const handleGenerate = () => {
    jumpTo()
  }

  const letterText = hasData
    ? `Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}

To Whom It May Concern,

Subject: Experience Certificate for ${employeeName}

This is to certify that ${employeeName} was employed with ${companyName} as ${role} from ${joiningDate || 'N/A'} to ${leavingDate || 'present'}.

During their tenure with us, ${employeeName} was sincere, hardworking, and dedicated to their duties. They carried out their responsibilities with utmost professionalism and integrity. They have a good analytical mind and a pleasant personality.

We found them to be of good character and conduct during their period of employment. We wish them all the best in their future endeavors.

Yours sincerely,

${supervisorName || '___________________'}
${supervisorTitle || 'Authorized Signatory'}
${companyName}`
    : ''

  const handleCopy = () => {
    navigator.clipboard.writeText(letterText)
  }

  const handleDownload = () => {
    const blob = new Blob([letterText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `experience-letter-${employeeName.replace(/\s+/g, '-').toLowerCase() || 'draft'}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <ToolLayout
      title="Experience Letter Generator"
      desc="Experience Letter Generator - create professional experience letters for employees online free. Free online, no sign-up. Works on any device."
      icon="📄" iconBg="rgba(34,197,94,0.08)"
      category="document" slug="experience-letter-generator"
      faq={[
        { q: 'What is an Experience Letter?', a: 'An experience letter is an official document issued by an employer confirming the employment details, role, and tenure of an employee at the organization.' },
        { q: 'How to use this tool?', a: 'Fill in the employee name, company, role, tenure dates, and signatory details, then click Generate to preview your experience letter instantly.' },
        { q: 'Can I download the letter?', a: 'Yes, after generating the letter you can copy it to your clipboard or download it as a plain text file.' },
        { q: 'Is this tool free?', a: 'Yes, completely free with no sign-up. Generate unlimited experience letters online on any device.' },
        { q: 'Can I edit the letter after generating?', a: 'You can modify the input fields at any time and the letter preview will update in real time.' },
        { q: 'What format is the downloaded file?', a: 'The letter is downloaded as a .txt file which you can then paste into any word processor for formatting.' },
      ]}
      howItWorks={[
        'Enter employee name, company name, and role designation.',
        'Provide joining date, leaving date, and authorized signatory details.',
        'Click Generate to preview the formatted experience letter.',
        'Copy or download the letter for use.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Experience Letter Generator", "applicationCategory": "BusinessApplication",
        "url": "https://www.uptools.in/experience-letter-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Input Form */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4">Employee Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              ['Employee Name', employeeName, setEmployeeName, 'e.g. Rahul Sharma'],
              ['Company Name', companyName, setCompanyName, 'e.g. Acme Corp'],
              ['Role / Designation', role, setRole, 'e.g. Senior Software Engineer'],
              ['Joining Date', joiningDate, setJoiningDate, 'e.g. 1 January 2022'],
              ['Leaving Date', leavingDate, setLeavingDate, 'e.g. 30 June 2025'],
              ['Supervisor Name', supervisorName, setSupervisorName, 'e.g. Priya Mehta'],
              ['Supervisor Title', supervisorTitle, setSupervisorTitle, 'e.g. HR Manager'],
            ].map(([label, val, setVal, ph]) => (
              <div key={label}>
                <label className="block text-xs font-semibold text-slate-400 mb-1">{label}</label>
                <input value={val} onChange={e => setVal(e.target.value)} placeholder={ph}
                  className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm font-medium outline-none focus:border-emerald-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark]" />
              </div>
            ))}
          </div>
          <button onClick={handleGenerate}
            className="mt-4 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm transition-all">
            Generate Letter
          </button>
        </div>

        {/* Preview */}
        {hasData ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Letter Preview</h3>
              </div>
              <div className="flex gap-2">
                <button onClick={handleCopy}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white text-xs font-bold rounded-lg transition-all">
                  📋 Copy
                </button>
                <button onClick={handleDownload}
                  className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold rounded-lg transition-all">
                  ⬇ Download
                </button>
              </div>
            </div>
            <div ref={letterRef}
              className="bg-black/30 border border-white/[0.06] rounded-xl p-6 text-sm leading-relaxed text-slate-300 whitespace-pre-wrap font-mono">
              {letterText}
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📄</div>
            <p className="text-sm text-slate-600 font-medium">Enter employee details to generate a letter</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
