import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const SAMPLE_DATA = [
  { bank: 'HDFC Bank', branch: 'Andheri West', city: 'Mumbai', phone: '022-26781234', hours: '9:30 AM - 6:30 PM', services: ['Savings', 'Loan', 'Insurance'] },
  { bank: 'HDFC Bank', branch: 'Bandra East', city: 'Mumbai', phone: '022-26514567', hours: '9:30 AM - 6:30 PM', services: ['Savings', 'Fixed Deposit'] },
  { bank: 'ICICI Bank', branch: 'Koramangala', city: 'Bangalore', phone: '080-25537890', hours: '10:00 AM - 5:00 PM', services: ['Savings', 'Business Loan'] },
  { bank: 'SBI', branch: 'Connaught Place', city: 'Delhi', phone: '011-23345678', hours: '10:00 AM - 4:00 PM', services: ['Savings', 'Education Loan', 'Locker'] },
  { bank: 'Axis Bank', branch: 'Hinjewadi', city: 'Pune', phone: '020-27291234', hours: '9:30 AM - 6:30 PM', services: ['Savings', 'Credit Card'] },
  { bank: 'Kotak Mahindra', branch: 'T. Nagar', city: 'Chennai', phone: '044-28345678', hours: '10:00 AM - 5:00 PM', services: ['Savings', 'Demat'] },
]

export default function bank_branch_finder() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [bankName, setBankName] = useState('')
  const [city, setCity] = useState('')
  const [results, setResults] = useState([])

  const search = useCallback(() => {
    if (!bankName.trim() || !city.trim()) return
    const filtered = SAMPLE_DATA.filter(b =>
      b.bank.toLowerCase().includes(bankName.toLowerCase().trim()) &&
      b.city.toLowerCase().includes(city.toLowerCase().trim())
    )
    setResults(filtered)
  }, [bankName, city])

  return (
    <ToolLayout
      title="Bank Branch Finder"
      desc="Find bank branches, ATMs, and contact details. Search for nearest bank locations in your city."
      icon="🏦" iconBg="rgba(34,197,94,0.08)"
      category="finance" slug="bank-branch-finder"
      faq={[
        { q: "How do I find a bank branch?", a: "Enter the bank name and city, then click search." },
        { q: "What information is provided?", a: "Branch address, phone number, working hours, and services offered." },
      ]}
      howItWorks={["Enter the bank name you're looking for", "Enter the city", "Click Search to see results"]}
      schema={{"@context":"https://schema.org","@type":"SoftwareApplication","name":"Bank Branch Finder","applicationCategory":"UtilitiesApplication","url":"https://www.uptools.in/bank-branch-finder/","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}}}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6 sm:p-8 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Bank Name</label>
              <input type="text" value={bankName} onChange={e => setBankName(e.target.value)}
                placeholder="e.g., HDFC, ICICI, SBI"
                className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-green-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark]" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">City</label>
              <input type="text" value={city} onChange={e => setCity(e.target.value)}
                placeholder="e.g., Mumbai, Delhi"
                className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-green-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark]" />
            </div>
          </div>
          <button onClick={() => { search(); jumpTo() }}
            className="w-full py-4 rounded-2xl bg-green-500 text-white font-bold text-sm hover:bg-green-400 transition-all active:scale-[0.98]">
            🔍 Search Branches
          </button>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-3 gap-3">
          {[['🏦', 'Branch Locator'], ['🏧', 'ATM Finder'], ['📞', 'Contact Info']].map(([icon, label]) => (
            <div key={label} className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-4 text-center">
              <div className="text-2xl mb-1">{icon}</div>
              <p className="text-xs text-slate-500 font-medium">{label}</p>
            </div>
          ))}
        </div>

        {results.length > 0 ? (
          <div ref={resultRef} className="space-y-4"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider">{results.length} branches found</h3>
            {results.map((b, i) => (
              <div key={i} className="rounded-2xl border-2 border-green-500/15 bg-green-500/[0.04] p-5">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-bold">{b.bank}</h4>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-500/15 text-green-400 font-semibold">{b.branch}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-slate-500">City:</span> <span className="text-white">{b.city}</span></div>
                  <div><span className="text-slate-500">Phone:</span> <span className="text-white">{b.phone}</span></div>
                  <div><span className="text-slate-500">Hours:</span> <span className="text-white">{b.hours}</span></div>
                  <div><span className="text-slate-500">Services:</span> <span className="text-white">{b.services.join(', ')}</span></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🏦</div>
            <p className="text-sm text-slate-600 font-medium">Enter bank name and city to search</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
