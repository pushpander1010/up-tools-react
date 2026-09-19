import { useState, useCallback, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = (n) => n == null || isNaN(n) ? '—' : '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })

export default function diwali_sale_discount_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [mrp, setMrp] = useState('49999')
  const [saleDisc, setSaleDisc] = useState('20')
  const [coupon, setCoupon] = useState('2000')
  const [cardDisc, setCardDisc] = useState('10')
  const [cardCap, setCardCap] = useState('1500')
  const [exchange, setExchange] = useState('0')
  const [tenure, setTenure] = useState('0')
  const [apr, setApr] = useState('16')
  const [result, setResult] = useState(null)

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-white font-semibold text-sm outline-none focus:border-orange-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"

  const analyze = useCallback(() => {
    const M = parseFloat(mrp) || 0
    if (M <= 0) { alert('Enter a valid MRP.'); return }
    const sd = Math.min(100, Math.max(0, parseFloat(saleDisc) || 0))
    const cp = Math.max(0, parseFloat(coupon) || 0)
    const cd = Math.min(100, Math.max(0, parseFloat(cardDisc) || 0))
    const cap = Math.max(0, parseFloat(cardCap) || 0)
    const ex = Math.max(0, parseFloat(exchange) || 0)
    const afterSale = M * (1 - sd / 100)
    const afterCoupon = Math.max(0, afterSale - cp)
    const cardOff = cd > 0 ? Math.min(afterCoupon * cd / 100, cap || Infinity) : 0
    const finalPrice = Math.max(0, Math.round((afterCoupon - cardOff - ex) * 100) / 100)
    const totalOff = Math.round((M - finalPrice) * 100) / 100
    const effDisc = M > 0 ? (totalOff / M) * 100 : 0
    // EMI on final price
    const n = parseInt(tenure) || 0
    const r = (parseFloat(apr) || 0) / 1200
    let emi = null, emiTotal = null, emiInterest = null
    if (n > 0 && finalPrice > 0) {
      emi = r > 0 ? (finalPrice * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : finalPrice / n
      emiTotal = emi * n
      emiInterest = emiTotal - finalPrice
    }
    setResult({ M, sd, cp, cd, cap, ex, afterSale, afterCoupon, cardOff, finalPrice, totalOff, effDisc, n, emi, emiTotal, emiInterest })
    jumpTo()
  }, [mrp, saleDisc, coupon, cardDisc, cardCap, exchange, tenure, apr, jumpTo])

  const demo = useMemo(() => ({ mrp: '49999', saleDisc: '20', coupon: '2000', cardDisc: '10', cardCap: '1500' }), [])

  return (
    <ToolLayout
      title="Diwali Sale Discount Calculator — Real Price After All Offers"
      desc="Diwali sale calculator: stack sale discount + coupon + bank card offer (with cap) + exchange bonus on MRP, see the true final price and effective % off, and compare no-cost EMI vs upfront payment."
      icon="🪔" iconBg="rgba(249,115,22,0.08)"
      category="finance" slug="diwali-sale-discount-calculator"
      faq={[
        { q: 'How do I find the real Diwali sale price?', a: 'Enter MRP, then layer each offer: sale % off first, minus flat coupon, minus bank card % (capped), minus exchange bonus. The tool computes the true final price and effective discount — the number the banner never shows.' },
        { q: 'Why is the effective discount lower than the banner?', a: 'Banner % applies only to MRP before other conditions. Coupons have minimum order values, card offers have caps (e.g. 10% up to Rs 1,500), and exchange bonuses need an old device. Stacking all four usually lands 5–15 points below the headline.' },
        { q: 'How do bank card caps work?', a: 'A "10% instant discount up to Rs 1,500" gives 10% of the price after coupon, but never more than Rs 1,500. On a Rs 40,000 item that is Rs 1,500 (not Rs 4,000). The calculator applies the cap automatically.' },
        { q: 'Is no-cost EMI really free?', a: 'Often the "discount" is converted into upfront interest or the card offer is removed on EMI. Compare the EMI total (principal + interest at your card APR) against the upfront final price here before choosing.' },
        { q: 'Does exchange bonus always apply?', a: 'Only if your old device passes inspection and the model is eligible. Exchange values drop for damaged screens or missing bills — treat the quoted bonus as a maximum, not a promise.' },
        { q: 'Is my data kept private?', a: 'Yes. Everything runs in your browser. Nothing you enter is uploaded or stored.' },
      ]}
      howItWorks={[
        'Enter MRP and each live offer: sale %, flat coupon, bank card % + cap, exchange bonus.',
        'Click Calculate to see price after each layer plus the true effective discount.',
        'Optionally add EMI tenure + card APR to compare monthly cost vs paying upfront.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Diwali Sale Discount Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/diwali-sale-discount-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6">
          <h2 className="text-sm font-bold text-white mb-1">Stack Your Offers</h2>
          <p className="text-xs text-slate-400 mb-4">Applied in real checkout order: sale % → coupon → card % (capped) → exchange.</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">MRP (₹)</label>
              <input type="number" value={mrp} onChange={e => setMrp(e.target.value)} placeholder="e.g. 49999" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Sale discount (%)</label>
              <input type="number" value={saleDisc} onChange={e => setSaleDisc(e.target.value)} placeholder="e.g. 20" min="0" max="100" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Flat coupon (₹)</label>
              <input type="number" value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="e.g. 2000" min="0" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Bank card offer (%)</label>
              <input type="number" value={cardDisc} onChange={e => setCardDisc(e.target.value)} placeholder="e.g. 10" min="0" max="100" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Card discount cap (₹)</label>
              <input type="number" value={cardCap} onChange={e => setCardCap(e.target.value)} placeholder="e.g. 1500" min="0" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Exchange bonus (₹)</label>
              <input type="number" value={exchange} onChange={e => setExchange(e.target.value)} placeholder="0 if none" min="0" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">EMI tenure (months, 0 = none)</label>
              <input type="number" value={tenure} onChange={e => setTenure(e.target.value)} placeholder="0" min="0" max="36" className={inputClass} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Card APR for EMI comparison (% p.a.)</label>
              <input type="number" value={apr} onChange={e => setApr(e.target.value)} placeholder="16" min="0" className={inputClass} />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={analyze} className="flex-1 py-3 rounded-xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-400 transition-all">Calculate Real Price</button>
            <button onClick={() => { setMrp(demo.mrp); setSaleDisc(demo.saleDisc); setCoupon(demo.coupon); setCardDisc(demo.cardDisc); setCardCap(demo.cardCap); setResult(null) }} className="px-4 py-3 rounded-xl bg-white/[0.06] border border-white/8 text-white text-xs font-bold hover:bg-white/10 transition-all">Demo</button>
          </div>
        </div>

        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-orange-500/15 bg-gradient-to-br from-orange-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
              <h3 className="text-sm font-bold text-orange-400 uppercase tracking-wider">True Price Breakdown</h3>
            </div>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between"><span className="text-slate-400">MRP</span><span className="text-slate-300 font-semibold">{fmt(result.M)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">After {result.sd}% sale off</span><span className="text-slate-300 font-semibold">{fmt(result.afterSale)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">After ₹ coupon</span><span className="text-slate-300 font-semibold">{fmt(result.afterCoupon)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Card offer applied</span><span className="text-emerald-400 font-semibold">− {fmt(result.cardOff)}</span></div>
              {result.ex > 0 && (<div className="flex justify-between"><span className="text-slate-400">Exchange bonus</span><span className="text-emerald-400 font-semibold">− {fmt(result.ex)}</span></div>)}
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="rounded-xl border border-white/8 bg-white/[0.04] p-3 text-center">
                <div className="text-xs text-slate-400">You Pay</div>
                <div className="text-xl font-extrabold text-white">{fmt(result.finalPrice)}</div>
              </div>
              <div className="rounded-xl border border-white/8 bg-white/[0.04] p-3 text-center">
                <div className="text-xs text-slate-400">Effective Off</div>
                <div className="text-xl font-extrabold text-orange-400">{result.effDisc.toFixed(1)}%</div>
                <div className="text-[11px] text-slate-500">save {fmt(result.totalOff)}</div>
              </div>
            </div>
            {result.n > 0 && result.emi != null && (
              <div className="rounded-xl border border-white/8 bg-white/[0.04] p-4 text-sm">
                <div className="text-xs font-bold text-white mb-2">EMI check ({result.n} months)</div>
                <div className="flex justify-between"><span className="text-slate-400">Monthly EMI</span><span className="text-white font-bold">{fmt(result.emi)}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Total with interest</span><span className="text-white font-bold">{fmt(result.emiTotal)}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Interest cost</span><span className={result.emiInterest > 0 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>{fmt(result.emiInterest)}</span></div>
                <p className="text-[11px] text-slate-500 mt-2">{result.emiInterest > result.cardOff ? 'Interest wipes out the card offer — paying upfront is cheaper here.' : 'EMI cost stays below the card offer value — EMI is reasonable if cash flow matters.'}</p>
              </div>
            )}
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🪔</div>
            <p className="text-sm text-slate-600 font-medium">Enter MRP + offers and click Calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
