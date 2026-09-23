import { useState, useMemo, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function rent_agreement_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const agreementRef = useRef(null)

  const [form, setForm] = useState({
    landlordName: '',
    landlordAddress: '',
    tenantName: '',
    tenantAddress: '',
    propertyAddress: '',
    propertyDescription: '',
    monthlyRent: '',
    securityDeposit: '',
    startDate: '',
    endDate: '',
    leaseDuration: '',
    paymentDueDay: '1',
    maintenanceResponsibility: 'Tenant',
    noticePeriod: '30',
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
  })

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const agreement = useMemo(() => {
    if (!form.landlordName && !form.tenantName) return ''
    return `RENT AGREEMENT

Date: ${form.date}

This Rent Agreement ("Agreement") is entered into on ${form.date} by and between:

LANDLORD:
Name: ${form.landlordName || '________________'}
Address: ${form.landlordAddress || '________________'}

(hereinafter referred to as the "Landlord", which expression shall unless repugnant to the context, include its successors and permitted assigns)

AND

TENANT:
Name: ${form.tenantName || '________________'}
Address: ${form.tenantAddress || '________________'}

(hereinafter referred to as the "Tenant", which expression shall unless repugnant to the context, include its successors and permitted assigns)

1. PROPERTY DETAILS
The Landlord hereby agrees to let and the Tenant agrees to take on rent the following property:

Address: ${form.propertyAddress || '________________'}
Description: ${form.propertyDescription || '________________'}

2. LEASE TERM
${form.startDate && form.endDate ? `The lease shall commence on ${form.startDate} and shall terminate on ${form.endDate}.` : 'The lease term shall be: ' + (form.leaseDuration || '________') + '.'}

3. RENT
The Tenant agrees to pay a monthly rent of Rs. ${form.monthlyRent || '________'}/- (Rupees ${form.monthlyRent ? numberToWords(Number(form.monthlyRent)) + ' Only' : '________________ Only'}) payable in advance on or before the ${form.paymentDueDay || '1'}${form.paymentDueDay === '1' ? 'st' : form.paymentDueDay === '2' ? 'nd' : form.paymentDueDay === '3' ? 'rd' : 'th'} day of each calendar month.

4. SECURITY DEPOSIT
${form.securityDeposit ? `The Tenant has paid a security deposit of Rs. ${form.securityDeposit}/- (Rupees ${numberToWords(Number(form.securityDeposit))} Only) at the time of execution of this Agreement.` : 'The Tenant shall pay a security deposit of Rs. __________/-.'} This deposit shall be refundable at the time of vacation of the premises, after deducting any outstanding dues or damages beyond normal wear and tear.

5. MAINTENANCE
${form.maintenanceResponsibility === 'Tenant' ? 'The Tenant shall be responsible for routine maintenance and minor repairs of the property.' : form.maintenanceResponsibility === 'Landlord' ? 'The Landlord shall be responsible for routine maintenance and repairs of the property.' : 'Maintenance responsibilities shall be shared as mutually agreed upon.'}

6. NOTICE PERIOD
Either party may terminate this Agreement by giving ${form.noticePeriod || '30'} days' written notice to the other party.

7. GENERAL TERMS
a) The Tenant shall use the property solely for residential purposes.
b) The Tenant shall not sublet or assign this Agreement without prior written consent of the Landlord.
c) The Tenant shall comply with all applicable laws and regulations.
d) The Landlord shall have the right to inspect the property with reasonable notice.
e) Any disputes arising out of this Agreement shall be subject to the jurisdiction of local courts.


LANDLORD'S SIGNATURE

_________________________
${form.landlordName || ''}


TENANT'S SIGNATURE

_________________________
${form.tenantName || ''}


WITNESS 1:

_________________________
Name: __________________
Address: ________________


WITNESS 2:

_________________________
Name: __________________
Address: ________________`
  }, [form])

  function numberToWords(num) {
    if (!num || isNaN(num)) return ''
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
    if (num === 0) return 'Zero'
    if (num < 20) return ones[num]
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '')
    if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + numberToWords(num % 100) : '')
    if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numberToWords(num % 1000) : '')
    if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + numberToWords(num % 100000) : '')
    return numberToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 ? ' ' + numberToWords(num % 10000000) : '')
  }

  const copyToClipboard = () => navigator.clipboard.writeText(agreement)

  const downloadAgreement = () => {
    const blob = new Blob([agreement], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Rent_Agreement_${form.tenantName || 'Draft'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const printAgreement = () => {
    const w = window.open('', '_blank')
    w.document.write(`<pre style="font-family:serif;font-size:14px;line-height:1.8;white-space:pre-wrap;padding:40px">${agreement.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`)
    w.document.close()
    w.print()
  }

  const inputCls = "w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-3 text-white font-medium outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"
  const labelCls = "block text-sm font-semibold text-slate-300 mb-1.5"

  return (
    <ToolLayout
      title="Rent Agreement Draft Generator"
      desc="Rent Agreement Draft Generator - create a professional rental agreement online free. Free online, no sign-up. Works on any device."
      icon="🏠" iconBg="rgba(16,185,129,0.08)"
      category="documents" slug="rent-agreement-generator"
      faq={[
        { q: 'What is a Rent Agreement?', a: 'A rent agreement is a legal contract between a landlord and tenant that outlines the terms and conditions of renting a property, including rent amount, deposit, duration, and responsibilities.' },
        { q: 'Is a rent agreement legally valid?', a: 'Yes, a rent agreement is a legally binding document. While notarization is optional for agreements under 12 months, registration is recommended for enforceability.' },
        { q: "How do I use this Rent Agreement Generator online free?", a: "Fill in landlord, tenant, property, and rent details above. The agreement draft updates in real time. Copy, download, or print the result. Free with no sign-up." },
        { q: "How do I save my result?", a: "Use the copy, download, or print buttons on the preview. Free with no sign-up." },
        { q: "Can I use it more than once?", a: "Yes, unlimited free use. Generate as many rent agreements as you need, on any device." },
        { q: "Is this Rent Agreement Generator free?", a: "Yes, completely free with no sign-up. Use it unlimited times online on any device." },
      ]}
      howItWorks={[
        'Enter landlord and tenant details including names and addresses.',
        'Provide the property address, description, monthly rent, and security deposit.',
        'Set the lease term, payment due date, and other conditions.',
        'Preview the agreement draft, then copy, download, or print it.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Rent Agreement Draft Generator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/rent-agreement-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Parties */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4">Parties</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Landlord Name *</label>
              <input value={form.landlordName} onChange={e => set('landlordName', e.target.value)} placeholder="e.g. Suresh Patel" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Landlord Address</label>
              <input value={form.landlordAddress} onChange={e => set('landlordAddress', e.target.value)} placeholder="Permanent address" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Tenant Name *</label>
              <input value={form.tenantName} onChange={e => set('tenantName', e.target.value)} placeholder="e.g. Priya Mehta" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Tenant Address</label>
              <input value={form.tenantAddress} onChange={e => set('tenantAddress', e.target.value)} placeholder="Current / permanent address" className={inputCls} />
            </div>
          </div>
        </div>

        {/* Property */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4">Property Details</h3>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Property Address *</label>
              <input value={form.propertyAddress} onChange={e => set('propertyAddress', e.target.value)} placeholder="Full address of the rented property" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <input value={form.propertyDescription} onChange={e => set('propertyDescription', e.target.value)} placeholder="e.g. 2 BHK flat, fully furnished" className={inputCls} />
            </div>
          </div>
        </div>

        {/* Rent & Deposit */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4">Rent & Deposit</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Monthly Rent (Rs.) *</label>
              <input type="number" value={form.monthlyRent} onChange={e => set('monthlyRent', e.target.value)} placeholder="e.g. 15000" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Security Deposit (Rs.)</label>
              <input type="number" value={form.securityDeposit} onChange={e => set('securityDeposit', e.target.value)} placeholder="e.g. 30000" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Payment Due Day</label>
              <select value={form.paymentDueDay} onChange={e => set('paymentDueDay', e.target.value)} className={inputCls + " appearance-none"}>
                {[1,5,7,10,15].map(d => <option key={d} value={d}>{d}{d===1?'st':d===2?'nd':d===3?'rd':'th'}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Tenure & Terms */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4">Tenure & Terms</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Lease Start Date</label>
              <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Lease End Date</label>
              <input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Maintenance Responsibility</label>
              <select value={form.maintenanceResponsibility} onChange={e => set('maintenanceResponsibility', e.target.value)} className={inputCls + " appearance-none"}>
                <option value="Tenant">Tenant</option>
                <option value="Landlord">Landlord</option>
                <option value="Shared">Shared</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Notice Period (days)</label>
              <input type="number" value={form.noticePeriod} onChange={e => set('noticePeriod', e.target.value)} className={inputCls} />
            </div>
          </div>
        </div>

        {/* Preview */}
        {agreement ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Rent Agreement Draft</h3>
              </div>
              <div className="flex gap-2">
                <button onClick={copyToClipboard} className="px-3 py-1.5 text-xs font-bold bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-xl transition-all">Copy</button>
                <button onClick={downloadAgreement} className="px-3 py-1.5 text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-xl transition-all">Download</button>
                <button onClick={printAgreement} className="px-3 py-1.5 text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-xl transition-all">Print</button>
              </div>
            </div>
            <pre ref={agreementRef} className="whitespace-pre-wrap font-sans text-sm text-slate-300 leading-relaxed bg-black/20 rounded-xl p-4 border border-white/[0.05] max-h-[600px] overflow-y-auto">{agreement}</pre>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🏠</div>
            <p className="text-sm text-slate-600 font-medium">Fill in the details to generate your rent agreement draft</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
