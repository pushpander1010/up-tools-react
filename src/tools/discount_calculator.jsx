import { useState, useCallback } from "react";
import ToolLayout from "../components/ToolLayout";
import useJumpToResult from "../hooks/useJumpToResult";

const fmtINR = (n) => (isFinite(n) ? "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 }) : "–");

export default function discount_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult();
  const [price, setPrice] = useState("1999");
  const [discount, setDiscount] = useState("40");
  const [coupon, setCoupon] = useState("0");

  const calculate = useCallback(() => {
    const P = parseFloat(price) || 0;
    const d = Math.min(100, Math.max(0, parseFloat(discount) || 0));
    const c = parseFloat(coupon) || 0;
    if (P <= 0) return null;
    const afterDiscount = P * (1 - d / 100);
    const final = Math.max(0, afterDiscount - c);
    const saved = P - final;
    const effective = P > 0 ? (saved / P) * 100 : 0;
    return { afterDiscount, final, saved, effective };
  }, [price, discount, coupon]);

  const result = calculate();
  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]";

  return (
    <ToolLayout
      title="Discount Calculator"
      desc="Discount Calculator — calculate sale price and savings online free. Enter MRP, discount percent and coupon to get instant final price and total savings. No login needed."
      icon="🏷️" iconBg="rgba(244,114,182,0.08)"
      category="finance" slug="discount-calculator"
      faq={[
        { q: "How do I calculate discount price online free?", a: "Enter the MRP and discount percent above. The calculator shows the sale price and how much you save instantly, free with no login." },
        { q: "How is discount percent calculated?", a: "Discount percent equals (MRP minus sale price) divided by MRP, multiplied by 100. This tool also reverses it to find the price from any percent off." },
        { q: "Does it include extra coupon discounts?", a: "Yes. Add any flat coupon amount and it applies after the percent discount, exactly like Amazon and Flipkart checkout." },
        { q: "What is a good discount on electronics in India?", a: "Phones typically sell at 10 to 20 percent off MRP during sales, TVs at 25 to 40 percent. Anything above 50 percent deserves a price-history check." },
        { q: "Is this discount calculator free?", a: "Yes, completely free with no sign-up. Use it unlimited times while shopping online or in stores." },
        { q: "Can I use it for any currency?", a: "Yes. Enter any currency amount — the math is identical and results update live." },
      ]}
      howItWorks={[
        "Enter the MRP or original price.",
        "Enter the discount percent and any extra coupon amount.",
        "Click Calculate to see final price, total savings and effective discount.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Discount Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/discount-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Original Price / MRP (₹)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 1999" min="0" className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Discount (%)</label>
              <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)}
                placeholder="e.g. 40" min="0" max="100" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Extra Coupon (₹)</label>
              <input type="number" value={coupon} onChange={(e) => setCoupon(e.target.value)}
                placeholder="e.g. 100" min="0" className={inputClass} />
            </div>
          </div>
        </div>

        <button onClick={jumpTo}
          className="w-full py-4 rounded-2xl bg-pink-500 text-white font-bold text-sm hover:bg-pink-400 transition-all duration-200 active:scale-[0.98]">
          Calculate
        </button>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-pink-500/15 bg-gradient-to-br from-pink-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: "slideUp 0.35s cubic-bezier(0.4,0,0.2,1)" }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
              <h3 className="text-sm font-bold text-pink-400 uppercase tracking-wider">Result</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "Final Price", value: fmtINR(result.final), color: "text-pink-400" },
                { label: "You Save", value: fmtINR(result.saved), color: "text-green-400" },
                { label: "Effective Discount", value: result.effective.toFixed(1) + " % off", color: "text-white" },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-slate-400 font-medium">{r.label}</span>
                  <span className={"font-bold " + r.color}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🏷️</div>
            <p className="text-sm text-slate-600 font-medium">Enter a price to calculate the discounted deal</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
