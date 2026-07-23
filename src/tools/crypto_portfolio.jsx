import { useState, useCallback, useMemo, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const API = 'https://api.coingecko.com/api/v3'
const DB_KEY = 'cpt:data:v1'

const PRIORITY = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'eth' },
  { id: 'tether', name: 'Tether', symbol: 'usdt' },
  { id: 'binancecoin', name: 'BNB', symbol: 'bnb' },
  { id: 'solana', name: 'Solana', symbol: 'sol' },
]

export default function crypto_portfolio() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [currency, setCurrency] = useState('inr')
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [selected, setSelected] = useState(null)
  const [qty, setQty] = useState('')
  const [buyPrice, setBuyPrice] = useState('')
  const [livePrice, setLivePrice] = useState(null)
  const [rows, setRows] = useState(() => {
    try { return JSON.parse(localStorage.getItem(DB_KEY) || '[]') } catch { return [] }
  })
  const [prices, setPrices] = useState({})
  const [loading, setLoading] = useState(false)

  const fmt = n => n != null ? new Intl.NumberFormat(currency === 'inr' ? 'en-IN' : 'en-US', {
    style: 'currency', currency: currency.toUpperCase(), maximumFractionDigits: Math.abs(n) >= 100 ? 0 : 2
  }).format(n) : '—'

  // Load coin list
  useEffect(() => {
    fetch(`${API}/coins/list?include_platform=false`)
      .then(r => r.json()).then(j => { if (j) localStorage.setItem('cpt:coins', JSON.stringify(j)) })
      .catch(() => {})
  }, [])

  // Fetch prices
  useEffect(() => {
    const ids = [...new Set(rows.map(r => r.id))]
    if (!ids.length) return
    fetch(`${API}/simple/price?ids=${ids.join(',')}&vs_currencies=${currency}&include_24hr_change=true`)
      .then(r => r.json()).then(j => {
        const p = {}
        ids.forEach(id => { if (j?.[id]) p[id] = { price: j[id][currency], ch24: j[id][`${currency}_24h_change`] } })
        setPrices(p)
      }).catch(() => {})
  }, [rows, currency])

  const search = useCallback(async (q) => {
    if (!q.trim()) { setSuggestions([]); return }
    try {
      const r = await fetch(`${API}/search?query=${encodeURIComponent(q)}`)
      const j = await r.json()
      setSuggestions((j?.coins || []).slice(0, 8).map(c => ({ id: c.id, name: c.name, symbol: c.symbol })))
    } catch { setSuggestions([]) }
  }, [])

  const selectCoin = useCallback(async (coin) => {
    setSelected(coin); setSearchQuery(`${coin.name} (${coin.symbol.toUpperCase()})`)
    setSuggestions([])
    try {
      const r = await fetch(`${API}/simple/price?ids=${coin.id}&vs_currencies=${currency}`)
      const j = await r.json()
      setLivePrice(j?.[coin.id]?.[currency] ?? null)
    } catch { setLivePrice(null) }
  }, [currency])

  const addRow = useCallback(() => {
    if (!selected || !qty) return
    const newRow = { id: selected.id, name: selected.name, symbol: selected.symbol, qty: parseFloat(qty), buy: parseFloat(buyPrice) || 0 }
    setRows(prev => { const next = [...prev, newRow]; localStorage.setItem(DB_KEY, JSON.stringify(next)); return next })
    setSelected(null); setQty(''); setBuyPrice(''); setSearchQuery(''); setLivePrice(null)
    jumpTo()
  }, [selected, qty, buyPrice, jumpTo])

  const removeRow = useCallback((id) => {
    setRows(prev => { const next = prev.filter(r => r.id !== id); localStorage.setItem(DB_KEY, JSON.stringify(next)); return next })
  }, [])

  const updateRow = useCallback((id, field, value) => {
    setRows(prev => {
      const next = prev.map(r => r.id === id ? { ...r, [field]: parseFloat(value) || 0 } : r)
      localStorage.setItem(DB_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const kpis = useMemo(() => {
    let total = 0, pl = 0
    rows.forEach(r => {
      const price = prices[r.id]?.price ?? 0
      total += (r.qty || 0) * price
      pl += (price - (r.buy || 0)) * (r.qty || 0)
    })
    return { total, pl }
  }, [rows, prices])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Crypto Portfolio Tracker"
      desc="Track your cryptocurrency portfolio with live prices. Add coins, set quantities and buy prices, and see your P&L in real-time."
      icon="🪙" iconBg="rgba(245,158,11,0.08)"
      category="finance" slug="crypto-portfolio"
      faq={[
        { q: 'Where do prices come from?', a: 'Live prices are fetched from the CoinGecko API — a free, widely-used crypto data provider.' },
        { q: 'Is my portfolio data saved?', a: 'Yes, your portfolio is saved in your browser\'s localStorage. No data is sent to any server.' },
      ]}
      howItWorks={[
        'Search for a cryptocurrency by name or symbol.',
        'Enter the quantity you hold and your buy price.',
        'View live prices, total value, and profit/loss.',
        'Your portfolio is auto-saved in your browser.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Crypto Portfolio Tracker", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/crypto-portfolio/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Currency Toggle */}
        <div className="flex gap-2 justify-center">
          {[['inr', '₹ INR'], ['usd', '$ USD']].map(([v, l]) => (
            <button key={v} onClick={() => setCurrency(v)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${currency === v ? 'bg-amber-500 text-white' : 'bg-white/[0.06] text-slate-400 border border-white/8'}`}>
              {l}
            </button>
          ))}
        </div>

        {/* Search & Add */}
        <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08] space-y-3">
          <div className="relative">
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Search Coin</label>
            <input type="text" value={searchQuery} onChange={e => { setSearchQuery(e.target.value); search(e.target.value) }}
              placeholder="Bitcoin, ETH, SOL..." className={inputClass} />
            {suggestions.length > 0 && (
              <div className="absolute z-10 top-full mt-1 w-full bg-[#0f172a] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                {suggestions.map(s => (
                  <button key={s.id} onClick={() => selectCoin(s)}
                    className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-white/[0.06] transition-all flex items-center gap-2">
                    <span className="font-bold">{s.name}</span>
                    <span className="text-xs text-slate-500">({s.symbol.toUpperCase()})</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {livePrice != null && (
            <div className="text-xs text-amber-400 font-semibold">Live: {fmt(livePrice)}</div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Quantity</label>
              <input type="number" value={qty} onChange={e => setQty(e.target.value)}
                placeholder="0.5" step="any" className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Buy Price ({currency.toUpperCase()})</label>
              <input type="number" value={buyPrice} onChange={e => setBuyPrice(e.target.value)}
                placeholder={livePrice ? String(Math.round(livePrice)) : ''} step="any" className={inputClass} />
            </div>
          </div>
          <button onClick={addRow} disabled={!selected || !qty}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
            ➕ Add to Portfolio
          </button>
        </div>

        {/* KPIs */}
        {rows.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Total Value', value: fmt(kpis.total), color: 'text-white' },
              { label: 'Profit/Loss', value: fmt(kpis.pl), color: kpis.pl >= 0 ? 'text-emerald-400' : 'text-red-400' },
              { label: 'Coins', value: rows.length, color: 'text-amber-400' },
            ].map(k => (
              <div key={k.label} className="p-3 rounded-xl bg-white/[0.04] border border-white/8 text-center">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">{k.label}</div>
                <div className={`text-lg font-extrabold font-mono ${k.color}`}>{k.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Portfolio Table */}
        {rows.length > 0 ? (
          <div ref={resultRef} className="rounded-2xl border border-white/8 overflow-hidden" style={{ animation: 'slideUp 0.35s ease-out' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-white/[0.04] border-b border-white/8">
                    <th className="text-left py-3 px-3 text-slate-500 font-semibold">Coin</th>
                    <th className="text-right py-3 px-3 text-slate-500 font-semibold">Qty</th>
                    <th className="text-right py-3 px-3 text-slate-500 font-semibold">Buy</th>
                    <th className="text-right py-3 px-3 text-slate-500 font-semibold">Price</th>
                    <th className="text-right py-3 px-3 text-slate-500 font-semibold">Value</th>
                    <th className="text-right py-3 px-3 text-slate-500 font-semibold">P&L</th>
                    <th className="text-right py-3 px-3 text-slate-500 font-semibold">24h</th>
                    <th className="py-3 px-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(r => {
                    const price = prices[r.id]?.price ?? 0
                    const ch = prices[r.id]?.ch24 ?? 0
                    const value = (r.qty || 0) * price
                    const pl = (price - (r.buy || 0)) * (r.qty || 0)
                    return (
                      <tr key={r.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-all">
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-white">{r.name}</div>
                          <div className="text-[10px] text-slate-500">{r.symbol.toUpperCase()}</div>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <input type="number" value={r.qty || ''} onChange={e => updateRow(r.id, 'qty', e.target.value)}
                            className="w-20 text-right bg-transparent border border-white/10 rounded px-2 py-1 text-xs font-mono text-white outline-none" />
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <input type="number" value={r.buy || ''} onChange={e => updateRow(r.id, 'buy', e.target.value)}
                            className="w-20 text-right bg-transparent border border-white/10 rounded px-2 py-1 text-xs font-mono text-white outline-none" />
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-300">{fmt(price)}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-white">{fmt(value)}</td>
                        <td className={`py-2.5 px-3 text-right font-mono font-bold ${pl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {Number.isFinite(pl) ? fmt(pl) : '—'}
                        </td>
                        <td className={`py-2.5 px-3 text-right font-mono ${ch >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {Number.isFinite(ch) ? `${ch > 0 ? '+' : ''}${ch.toFixed(2)}%` : '—'}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button onClick={() => removeRow(r.id)} className="text-slate-500 hover:text-red-400 transition-colors">✕</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🪙</div>
            <p className="text-sm text-slate-600 font-medium">Search for a coin to start building your portfolio</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
