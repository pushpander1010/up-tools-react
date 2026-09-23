import { useState, useMemo, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function noc_letter_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const letterRef = useRef(null)

  const [form, setForm] = useState({
    issuerName: '',
    issuerDesignation: '',
    issuerCompany: '',
    personName: '',
    purpose: '',
    propertyType: 'Vehicle',
    propertyDetail: '',
    validFrom: '',
    validTo: '',
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
  })

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const letter = useMemo(() => {
    if (!form.issuerName && !form.personName) return ''
    return `Date: ${form.date}

TO WHOM IT MAY CONCERN

NO OBJECTION CERTIFICATE (NOC)

I, ${form.issuerName || '________________'}, ${form.issuerDesignation ? form.issuerDesignation + ', ' : ''}${form.issuerCompany ? 'representing ' + form.issuerCompany : 'do hereby declare'}, that I have no objection to ${form.personName || '________________'} ${form.purpose ? 'for the purpose of ' + form.purpose : 'using the following'}.

Details of the ${form.propertyType || 'Vehicle / Property'}:

Type: ${form.propertyType || 'Vehicle / Property'}
Description / Registration No.: ${form.propertyDetail || '________________'}

${form.validFrom ? `Valid From: ${form.validFrom}` : ''}
${form.validTo ? `Valid To: ${form.validTo}` : ''}

This NOC is issued on voluntary basis and without any coercion or undue influence. The above-mentioned person is free to use the said ${form.propertyType?.toLowerCase() || 'property'} for the stated purpose during the validity period.

This NOC shall be valid from the date mentioned above and shall automatically expire on the date mentioned as Valid To, unless revoked earlier in writing.

ISSUER'S DETAILS:

Name: ${form.issuerName || '________________'}
Designation: ${form.issuerDesignation || '________________'}
Company / Organization: ${form.issuerCompany || '________________'}


_________________________
Signature / Seal
${form.issuerName || ''}`
  }, [form])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(letter)
  }

  const downloadLetter = () => {
    const blob = new Blob([letter], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `NOC_Letter_${form.personName || 'Draft'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const inputCls = "w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-3 text-white font-medium outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"
  const labelCls = "block text-sm font-semibold text-slate-300 mb-1.5"

  return (
    <ToolLayout
      title="NOC Letter Generator"
      desc="NOC Letter Generator - create a professional No Objection Certificate online free. Free online, no sign-up. Works on any device."
      icon="📝" iconBg="rgba(99,102,241,0.08)"
      category="documents" slug="noc-letter-generator"
      faq={[
        { q: 'What is an NOC Letter?', a: 'An NOC (No Objection Certificate) is a legal document stating that the issuer has no objection to a person using a vehicle, property, or undertaking a specific purpose.' },
        { q: 'When do I need an NOC?', a: 'NOCs are commonly needed for vehicle transfers, property matters, travel authorizations, employment clearances, and many other official purposes.' },
        { q: "How do I use this NOC Letter Generator online free?", a: "Fill in the issuer details, person name, purpose, and property information above. The letter preview updates instantly. Copy or download the result. Free with no sign-up." },
        { q: "How do I save my result?", a: "Click the copy button to paste elsewhere, or the download button to save as a text file. Free with no sign-up." },
        { q: "Can I use it more than once?", a: "Yes, unlimited free use. Generate as many NOC letters as you need, on any device." },
        { q: "Is this NOC Letter Generator free?", a: "Yes, completely free with no sign-up. Use it unlimited times online on any device." },
      ]}
      howItWorks={[
        'Enter the issuer details: name, designation, and company name.',
        'Provide the recipient person name, purpose, and property type and description.',
        'Set the validity dates if applicable.',
        'Preview the NOC letter in real time, then copy or download it.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "NOC Letter Generator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/noc-letter-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Issuer Details */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-4">Issuer Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Your Full Name *</label>
              <input value={form.issuerName} onChange={e => set('issuerName', e.target.value)} placeholder="e.g. Rajesh Kumar" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Designation</label>
              <input value={form.issuerDesignation} onChange={e => set('issuerDesignation', e.target.value)} placeholder="e.g. Manager" className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Company / Organization</label>
              <input value={form.issuerCompany} onChange={e => set('issuerCompany', e.target.value)} placeholder="e.g. ABC Pvt. Ltd." className={inputCls} />
            </div>
          </div>
        </div>

        {/* Person & Purpose */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-4">Person & Purpose</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Person Name *</label>
              <input value={form.personName} onChange={e => set('personName', e.target.value)} placeholder="e.g. Amit Sharma" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Purpose</label>
              <input value={form.purpose} onChange={e => set('purpose', e.target.value)} placeholder="e.g. vehicle transfer / rental" className={inputCls} />
            </div>
          </div>
        </div>

        {/* Property / Vehicle */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-4">Property / Vehicle Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Type</label>
              <select value={form.propertyType} onChange={e => set('propertyType', e.target.value)}
                className={inputCls + " appearance-none"}>
                <option value="Vehicle">Vehicle</option>
                <option value="Property">Property</option>
                <option value="Equipment">Equipment</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Description / Registration No.</label>
              <input value={form.propertyDetail} onChange={e => set('propertyDetail', e.target.value)} placeholder="e.g. MH-12-AB-1234" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Valid From</label>
              <input type="date" value={form.validFrom} onChange={e => set('validFrom', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Valid To</label>
              <input type="date" value={form.validTo} onChange={e => set('validTo', e.target.value)} className={inputCls} />
            </div>
          </div>
        </div>

        {/* Preview */}
        {letter ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">NOC Letter Preview</h3>
              </div>
              <div className="flex gap-2">
                <button onClick={copyToClipboard} className="px-4 py-2 text-xs font-bold bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-xl transition-all">Copy</button>
                <button onClick={downloadLetter} className="px-4 py-2 text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-xl transition-all">Download</button>
              </div>
            </div>
            <pre ref={letterRef} className="whitespace-pre-wrap font-sans text-sm text-slate-300 leading-relaxed bg-black/20 rounded-xl p-4 border border-white/[0.05] max-h-[500px] overflow-y-auto">{letter}</pre>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📝</div>
            <p className="text-sm text-slate-600 font-medium">Fill in the details to generate your NOC letter</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
