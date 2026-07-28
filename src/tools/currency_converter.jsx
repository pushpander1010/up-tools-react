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
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState('')

  useEffect(() => {
    // Try primary API (open.er-api.com — free, no key, supports CORS)
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(r => {
        if (!r.ok) throw new Error('API returned ' + r.status)
        return r.json()
      })
      .then(data => {
        if (data.rates) {
          setRates(data.rates)
          setLastUpdated(data.time_last_update_utc || data.time_next_update_utc || new Date().toLocaleDateString('en-IN'))
          setError(null)
        } else {
          throw new Error('No rates in response')
        }
      })
      .catch(() => {
        // Fallback: frankfurter.dev (open-source, no key needed, CORS-friendly)
        fetch('https://api.frankfurter.dev/latest?from=USD')
          .then(r => {
            if (!r.ok) throw new Error('Fallback API returned ' + r.status)
            return r.json()
          })
          .then(data => {
            if (data.rates) {
              data.rates.USD = 1
              setRates(data.rates)
              setLastUpdated(data.date || new Date().toLocaleDateString('en-IN'))
              setError('fallback')
            } else {
              throw new Error('No rates in fallback response')
            }
          })
          .catch(() => {
            setError('offline')
            setLastUpdated('')
          })
          .finally(() => setLoading(false))
      })
      .finally(() => setLoading(false))
  }, [])

  const result = useMemo(() => {
    if (!rates) return 0
    const amt = parseFloat(amount) || 0
    const fromRate = rates[from] || 1
    const toRate = rates[to] || 1
    return (amt / fromRate) * toRate
  }, [amount, from, to, rates])

  const swap = () => { setFrom(to); setTo(from) }

  const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumDigits: 4, maximumFractionDigits: 4 })

  const rateDisplay = rates && rates[from] && rates[to] ? fmt(rates[to] / rates[from]) : '—'

  return (
    <ToolLayout
      title="Currency Converter"
      desc="Convert between 20+ currencies with live interbank rates. Supports INR, USD, EUR, GBP and more."
      icon="💱" iconBg="rgba(34,197,94,0.08)"
      category="finance" slug="currency-converter"
      faq={[
        { q: 'Where do exchange rates come from?', a: 'Live rates from ExchangeRate API (primary) and Frankfurter (fallback), updated daily. These are mid-market interbank rates.' },
        { q: 'Are these rates accurate for transactions?', a: 'These are mid-market interbank rates. Actual exchange rates include fees and spreads.' },
      ]}
      howItWorks={[
        'Enter the amount you want to convert.',
        'Select the source currency (From) and target currency (To).',
        'View the converted amount instantly.',
        'Click the swap button to flip currencies.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Currency Converter", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/currency-converter/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Offline warning */}
        {error === 'offline' && (
          <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold flex items-center gap-2">
            <span>⚠️</span>
            <span>Unable to fetch live rates. Please check your internet connection and reload.</span>
          </div>
        )}

        {/* Amount */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Amount</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
            className="w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl px-5 py-4 text-3xl font-extrabold text-white outline-none focus:border-emerald-500/40 transition-all duration-300 placeholder:text-white/8" />
        </div>

        {/* From / Swap / To */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">From</label>
            <select value={from} onChange={e => setFrom(e.target.value)}
              className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-white text-sm font-semibold outline-none focus:border-emerald-500/40 appearance-none cursor-pointer">
              {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>)}
            </select>
          </div>
          <button onClick={swap} className="mt-5 w-10 h-10 rounded-full bg-white/5 border border-white/8 flex items-center justify-center text-slate-400 hover:text-white hover:border-emerald-500/40 transition-all shrink-0 text-lg">⇄</button>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">To</label>
            <select value={to} onChange={e => setTo(e.target.value)}
              className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-white text-sm font-semibold outline-none focus:border-emerald-500/40 appearance-none cursor-pointer">
              {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>)}
            </select>
          </div>
        </div>

        {/* Result */}
        <div ref={resultRef} className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/8 via-white/[0.02] to-transparent border border-emerald-500/15 text-center" style={{ animation: 'slideUp 0.3s ease-out' }}>
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Converted Amount</div>
          <div className="text-4xl font-extrabold text-emerald-400 truncate">
            {loading ? (
              <span className="text-lg text-slate-400">Fetching rates...</span>
            ) : error === 'offline' ? (
              <span className="text-lg text-red-400">Rates unavailable</span>
            ) : (
              <>{CURRENCIES.find(c => c.code === to)?.symbol} {fmt(result)}</>
            )}
          </div>
          <div className="text-sm text-slate-400 mt-2">
            1 {from} = {rateDisplay} {to}
          </div>
          {lastUpdated && (
            <div className="text-[10px] text-slate-600 mt-2">
              Rates as of {lastUpdated}
              {error === 'fallback' && <span className="text-yellow-600/80 ml-1">(backup source)</span>}
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
