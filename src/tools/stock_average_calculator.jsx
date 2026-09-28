import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmtINR = (n) => isFinite(n) ? '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 }) : '–'
const fmtPct = (n) => isFinite(n) ? (n >= 0 ? '+' : '') + n.toFixed(2) + '%' : '–'

export default function stock_average_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [lots, setLots] = useState([
    { qty: '', price: '' },
    { qty: '', price: '' },
  ])
  const [marketPrice, setMarketPrice] = useState('')

  const updateLot = (i, field, val) => {
    const next = lots.map((l, idx) => idx === i ? { ...l, [field]: val } : l)
    setLots(next)
  }

  const addLot = () => setLots([...lots, { qty: '', price: '' }])
  const removeLot = (i) => { if (lots.length > 1) setLots(lots.filter((_, idx) => idx !== i)) }

  const calculate = useCallback(() => {
    let totalQty = 0, totalCost = 0
    for (const l of lots) {
      const q = parseFloat(l.qty) || 0
      const p = parseFloat(l.price) || 0
      totalQty += q
      totalCost += q * p
    }
    if (totalQty <= 0) return null

    const avgPrice = totalCost / totalQty
    const mkt = parseFloat(marketPrice) || 0
    const currentValue = mkt > 0 ? totalQty * mkt : null
    const pnl = currentValue !== null ? currentValue - totalCost : null
    const pnlPct = currentValue !== null && totalCost > 0 ? ((currentValue - totalCost) / totalCost) * 100 : null
    const breakeven = avgPrice // break-even is the average buy price itself

    let verdict = ''
    if (currentValue !== null) {
      if (pnl > 0) verdict = `Profit of ${fmtINR(pnl)} — you're in the green. Consider booking partial profits.`
      else if (pnl < 0) verdict = `Loss of ${fmtINR(Math.abs(pnl))} — review your thesis before averaging further.`
      else verdict = 'At break-even — no profit or loss at current market price.'
    }

    return { avgPrice, totalQty, totalCost, currentValue, pnl, pnlPct, breakeven, verdict }
  }, [lots, marketPrice])

  const result = calculate()

  const handleCalculate = () => {
    calculate()
    jumpTo()
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-white font-semibold text-sm outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"
  const btnClass = "w-full py-4 rounded-2xl bg-blue-500 text-white font-bold text-sm hover:bg-blue-400 transition-all duration-200 active:scale-[0.98]"

  return (
    <ToolLayout
      title="Stock Average Calculator India"
      desc="Calculate your stock average buy price with multiple buy lots, total invested, profit/loss, and break-even price — free online SIP/averaging calculator."
      icon="📈" iconBg="rgba(59,130,246,0.08)"
      category="finance" slug="stock-average-calculator"
      faq={[
        { q: "What is average buy price in stocks?", a: "Average buy price is the total cost divided by total shares held. It tells you the effective price per share across all your purchases, useful for tracking your break-even point." },
        { q: "How do I use this Stock Average Calculator?", a: "Add each buy lot with quantity and buy price, enter current market price, and click Calculate. You'll see your average price, total invested, current value, and profit/loss." },
        { q: "What is the break-even price?", a: "Break-even is the minimum price at which you neither make a profit nor a loss. For a single stock it equals your average buy price. If you add selling charges, the actual break-even is slightly higher." },
        { q: "Is this calculator free?", a: "Yes, this Stock Average Calculator India is completely free with no sign-up. Use it unlimited times on any device." },
      ]}
      howItWorks={[
        "Enter each buy lot — quantity (number of shares) and buy price per share.",
        "Click + Add Lot to include more purchases, or remove a row if not needed.",
        "Enter the current market price of the stock.",
        "Click Calculate to see your average price, total invested, and P&L.",
        "Check the break-even price and profit/loss verdict.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Stock Average Calculator India", "applicationCategory": "FinanceApplication",
        "operatingSystem": "WebBrowser",
        "url": "https://www.uptools.in/stock-average-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-400">Buy Lots</label>
          {lots.map((lot, i) => (
            <div key={i} className="flex gap-2 items-center">
              <div className="flex-1">
                <input type="number" value={lot.qty} onChange={(e) => updateLot(i, 'qty', e.target.value)}
                  placeholder="Qty" min="0" className={inputClass} />
              </div>
              <div className="flex-1">
                <input type="number" value={lot.price} onChange={(e) => updateLot(i, 'price', e.target.value)}
                  placeholder="Buy Price (₹)" min="0" className={inputClass} />
              </div>
              {lots.length > 1 && (
                <button onClick={() => removeLot(i)}
                  className="shrink-0 w-9 h-9 rounded-lg bg-rose-500/10 text-rose-400 font-bold text-lg flex items-center justify-center hover:bg-rose-500/20 transition-all">
                  ×
                </button>
              )}
            </div>
          ))}
          <button onClick={addLot}
            className="w-full py-2.5 rounded-xl border-2 border-dashed border-white/10 text-slate-500 font-bold text-sm hover:border-blue-500/30 hover:text-blue-400 transition-all">
            + Add Lot
          </button>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-400 mb-2">Current Market Price (₹)</label>
          <input type="number" value={marketPrice} onChange={(e) => setMarketPrice(e.target.value)}
            placeholder="e.g. 1850" min="0" className={inputClass} />
        </div>

        <button onClick={handleCalculate} className={btnClass}>
          Calculate
        </button>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-blue-500/15 bg-gradient-to-br from-blue-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Result</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Total Shares', value: Number(result.totalQty).toLocaleString('en-IN'), color: 'text-white' },
                { label: 'Total Invested', value: fmtINR(result.totalCost), color: 'text-white' },
                { label: 'Average Buy Price', value: fmtINR(result.avgPrice), color: 'text-blue-400' },
                ...(result.currentValue !== null ? [
                  { label: 'Current Value', value: fmtINR(result.currentValue), color: 'text-white' },
                  { label: 'Profit / (Loss)', value: fmtINR(result.pnl) + ' (' + fmtPct(result.pnlPct) + ')', color: result.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400' },
                  { label: 'Break-Even Price', value: fmtINR(result.breakeven), color: 'text-amber-400' },
                ] : []),
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-slate-400 font-medium">{r.label}</span>
                  <span className={`font-bold ${r.color}`}>{r.value}</span>
                </div>
              ))}
              {result.verdict && (
                <div className="mt-4 p-4 rounded-2xl bg-white/[0.04] border border-white/5">
                  <p className={`text-sm font-bold ${result.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{result.verdict}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📈</div>
            <p className="text-sm text-slate-600 font-medium">Enter buy lots and current price to calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
