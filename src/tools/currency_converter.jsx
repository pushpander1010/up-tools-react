import { useState, useEffect, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const CURRENCIES = [
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', flag: '🇸🇦' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
]

export default function currency_converter() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [amount, setAmount] = useState('1')
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('INR')
  const [rates, setRates] = useState(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('Loading rates...')

  useEffect(() => {
    let cancelled = false
    fetch('/api/rates')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        if (cancelled) return
        if (data?.rates) {
          setRates(data.rates)
          setStatus('Live rates')
        } else {
          throw new Error('no rates')
        }
      })
      .catch(() => {
        if (cancelled) return
        setStatus('Rate API unavailable')
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const result = useMemo(() => {
    if (!rates) return 0
    const amt = parseFloat(amount) || 0
    const fromRate = rates[from] || 1
    const toRate = rates[to] || 1
    return (amt / fromRate) * toRate
  }, [amount, from, to, rates])

  const swap = () => { setFrom(to); setTo(from) }

  const displayRate = rates && rates[from] && rates[to]
    ? (rates[to] / rates[from]).toFixed(6)
    : '—'

  return (
    <ToolLayout
      title="Currency Converter"
      desc="Convert between 20+ currencies with live interbank rates. Falls back to approximate rates when offline."
      icon="💱" iconBg="rgba(34,197,94,0.08)"
      category="finance" slug="currency-converter"
      faq={[
        { q: 'Where do exchange rates come from?', a: 'Live rates from ExchangeRate API proxied through our server, updated daily. These are mid-market interbank rates.' },
        { q: 'Are these rates accurate for transactions?', a: 'These are mid-market interbank rates. Actual exchange rates include fees and spreads.' },
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Currency Converter", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/currency-converter/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-lg mx-auto space-y-6" ref={resultRef}>
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Amount</label>
          <input className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-lg text-white font-mono focus:outline-none focus:border-indigo-500/50"
            type="number" value={amount} onChange={e => setAmount(e.target.value)} min="0" step="any"
          />
        </div>

        <div className="grid grid-cols-[1fr,auto,1fr] gap-3 items-end">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">From</label>
            <select className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50"
              value={from} onChange={e => setFrom(e.target.value)}>
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.flag} {c.code} - {c.name}</option>
              ))}
            </select>
          </div>

          <button className="glow-btn text-lg px-3 py-3 rounded-xl mt-6" onClick={swap} title="Swap currencies">⇄</button>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">To</label>
            <select className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50"
              value={to} onChange={e => setTo(e.target.value)}>
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.flag} {c.code} - {c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 text-center">
          <div className="text-3xl font-bold text-white mb-1">
            {isNaN(result) ? '0.00' : result.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
          </div>
          <div className="text-sm text-slate-400">
            {amount || '0'} {from} = {displayRate} {to}
          </div>
          <div className="text-xs text-slate-500 mt-2">
            {loading ? 'Loading...' : status}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {['USD', 'EUR', 'GBP', 'JPY', 'AED', 'SAR', 'CHF', 'SGD'].map(code => {
            const c = CURRENCIES.find(c => c.code === code)
            if (!c) return null
            const val = rates[code] ? (1 / rates[code] * rates[to]).toFixed(2) : '—'
            return (
              <button key={code} className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-left text-sm hover:border-indigo-500/30 transition-colors"
                onClick={() => { setFrom(code); jumpTo() }}>
                <span className="text-base">{c.flag}</span>
                <span className="text-slate-400 ml-1">{code}</span>
                <span className="text-white font-mono float-right">{val}</span>
              </button>
            )
          })}
        </div>
      </div>
    </ToolLayout>
  )
}
