import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'SEK', name: 'Swedish Krona' },
]

const RATES_API = 'https://www.uptools.in/api/rates'

export default function multi_currency_converter() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [amount, setAmount] = useState(1)
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('EUR')
  const [result, setResult] = useState(null)
  const [rates, setRates] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const convert = useCallback(async () => {
    const a = parseFloat(amount) || 0
    if (!rates) {
      setLoading(true)
      setError('')
      try {
        const r = await fetch(RATES_API)
        const d = await r.json()
        if (!d.conversion_rates) throw new Error('No rates available')
        setRates(d.conversion_rates)
        compute(a, fromCurrency, toCurrency, d.conversion_rates)
      } catch (e) {
        setError('Could not load live rates. Please try again.')
      } finally {
        setLoading(false)
      }
      return
    }
    compute(a, fromCurrency, toCurrency, rates)
  }, [amount, fromCurrency, toCurrency, rates])

  const compute = (a, from, to, ratesMap) => {
    const fromRate = ratesMap[from] || 1
    const toRate = ratesMap[to] || 1
    const converted = (a * toRate) / fromRate
    const rate = toRate / fromRate
    setResult({ converted, rate, fromCurrency: from, toCurrency: to, updated: ratesMap.__updated })
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"
  const selectClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"

  return (
    <ToolLayout
      title="Multi-Currency Converter"
      desc="Convert between 150+ currencies with real-time exchange rates. Updated every minute for accuracy."
      icon="💱" iconBg="rgba(234,179,8,0.08)"
      category="finance" slug="multi-currency-converter"
      faq={[
        { q: "How many currencies are supported?", a: "The converter uses live exchange rates covering 10 major currencies: USD, EUR, GBP, JPY, INR, AUD, CAD, CHF, CNY, SEK." },
        { q: "Are rates real-time?", a: "Yes. Rates are fetched live from the ExchangeRate-API through our backend and updated automatically throughout the day." },
      ]}
      howItWorks={[
        "Enter an amount and select the source currency.",
        "Choose the target currency from the dropdown.",
        "Click Convert to see the converted amount and exchange rate.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Multi-Currency Converter", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/multi-currency-converter/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">From</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
              min="0" placeholder="Amount" className={inputClass} />
            <select value={fromCurrency} onChange={e => setFromCurrency(e.target.value)}
              className={`${selectClass} mt-2`}>
              {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} – {c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">To</label>
            <input type="text" readOnly value={result ? result.converted.toFixed(2) : ''}
              placeholder="Result" className={`${inputClass} opacity-70`} />
            <select value={toCurrency} onChange={e => setToCurrency(e.target.value)}
              className={`${selectClass} mt-2`}>
              {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} – {c.name}</option>)}
            </select>
          </div>
        </div>

        <button onClick={() => { convert(); jumpTo() }} disabled={loading}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98] disabled:opacity-50">
          {loading ? '⏳ Loading rates...' : '💱 Convert'}
        </button>

        {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">❌ {error}</div>}

        {rates && !error && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live exchange rates
          </div>
        )}

        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Conversion Result</h3>
            </div>
            <div className="text-3xl font-extrabold text-white mb-1">{result.converted.toFixed(2)} {result.toCurrency}</div>
            <p className="text-sm text-slate-400">
              1 {result.fromCurrency} = {result.rate.toFixed(4)} {result.toCurrency}
            </p>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">💱</div>
            <p className="text-sm text-slate-600 font-medium">Enter amount and click Convert</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
