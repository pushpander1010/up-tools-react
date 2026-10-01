import { useState } from "react"
import { Link } from "react-router-dom"
import ToolLayout from "../components/ToolLayout"
import useJumpToResult from "../hooks/useJumpToResult"

const DRAW_SLOTS = [
  {
    time: "1:00 PM",
    name: "Dear Morning",
    schemes: "Dear Desert, Godavari, Mahanadi, Ganga, Narmada, Teesta",
    ticketPrice: "₹6",
    topPrize: "₹1 Crore",
    badge: "Morning Draw",
  },
  {
    time: "6:00 PM",
    name: "Dear Day",
    schemes: "Dear Mountain, River, Seagull, Wave, Hill, Lake",
    ticketPrice: "₹6",
    topPrize: "₹1 Crore",
    badge: "Evening Draw",
  },
  {
    time: "8:00 PM",
    name: "Dear Evening",
    schemes: "Dear Falcon, Flamingo, Ostrich, Eagle, Toucan, Parrot",
    ticketPrice: "₹6",
    topPrize: "₹1 Crore",
    badge: "Night Draw",
  },
]

const PRIZE_TIERS = [
  { rank: "1st Prize", amount: "₹1,00,00,000 (₹1 Crore)", count: "1 Winner per series", note: "Includes super prize amount" },
  { rank: "Consolation Prize", amount: "₹1,000", count: "Multiple across remaining series", note: "Matching 5 digits in other series" },
  { rank: "2nd Prize", amount: "₹9,000", count: "10 Numbers per draw", note: "No TDS deducted (Under ₹10,000 threshold)" },
  { rank: "3rd Prize", amount: "₹450", count: "10 Numbers per draw", note: "Direct sub-agent claim" },
  { rank: "4th Prize", amount: "₹250", count: "10 Numbers per draw", note: "Direct sub-agent claim" },
  { rank: "5th Prize", amount: "₹120", count: "100 Numbers per draw", note: "Direct sub-agent claim" },
]

const faq = [
  { q: "What are the daily draw times for Nagaland State Lottery Sambad?", a: "Nagaland State Lotteries conducts three official daily draws every day: Dear Morning at 1:00 PM, Dear Day at 6:00 PM, and Dear Evening at 8:00 PM. Each draw carries a 1st prize of ₹1 Crore for a ₹6 ticket." },
  { q: "How much income tax (TDS) is deducted from lottery winnings in India?", a: "Under Section 194B of the Income Tax Act, lottery winnings exceeding ₹10,000 attract a flat 30% TDS rate plus a 4% Health and Education Cess, totaling an effective minimum deduction of 31.2%. Surcharges apply on winnings over ₹50 Lakhs." },
  { q: "How can I safely verify the official Nagaland Lottery Sambad result?", a: "Always download the official government result gazette PDF published directly by the Directorate of Nagaland State Lotteries. Match your 2-digit serial and series letter, the 5-digit ticket number, and confirm the draw date and time slot." },
  { q: "What is the process and documents needed to claim a lottery prize?", a: "Prizes up to ₹10,000 can be claimed through authorized lottery sub-agents. For prizes above ₹10,000, submit a government claim form to the Directorate with the undamaged original ticket, government-notarized affidavit, PAN card, Aadhaar card, and a cancelled bank cheque." },
  { q: "Which Indian states permit legal government paper lotteries?", a: "Under the Lotteries (Regulation) Act 1998, paper lotteries organized by respective state governments are legal in 13 states including Nagaland, Kerala, West Bengal, Goa, Sikkim, Punjab, Maharashtra, Mizoram, Arunachal Pradesh, and Meghalaya." },
]

const howItWorks = [
  "Review daily official draw schedules across 1:00 PM, 6:00 PM, and 8:00 PM slots.",
  "Learn the 4-step official Gazette PDF result verification method.",
  "Calculate exact Section 194B TDS deductions and net in-hand prize money using the tax tool.",
  "Generate random 5-digit numbers for entertainment purposes and review claiming guidelines.",
]

export default function LotterySambadToday() {
  const { ref: resultRef } = useJumpToResult()
  const [grossWinning, setGrossWinning] = useState(10000000) // Default 1 Crore
  const [luckyNumber, setLuckyNumber] = useState("72489")
  const [luckySeries, setLuckySeries] = useState("84K")
  const [isSpinning, setIsSpinning] = useState(false)

  // Tax calculation under Section 194B & 115BB
  // Winnings above ₹10,000 attract flat 30% TDS
  const isTaxable = grossWinning > 10000
  let baseTds = 0
  let surcharge = 0
  let cess = 0

  if (isTaxable) {
    baseTds = Math.round(grossWinning * 0.3) // 30% base
    if (grossWinning > 10000000) {
      surcharge = Math.round(baseTds * 0.15) // 15% surcharge above 1 Cr
    } else if (grossWinning > 5000000) {
      surcharge = Math.round(baseTds * 0.1) // 10% surcharge above 50L
    }
    cess = Math.round((baseTds + surcharge) * 0.04) // 4% Health & Education Cess
  }

  const totalTax = baseTds + surcharge + cess
  const netInHand = grossWinning - totalTax
  const effectiveRate = grossWinning > 0 ? ((totalTax / grossWinning) * 100).toFixed(1) : "0.0"

  const generateLuckyNumber = () => {
    setIsSpinning(true)
    setTimeout(() => {
      const seriesNum = Math.floor(10 + Math.random() * 89)
      const letters = ["A", "B", "C", "D", "E", "G", "H", "J", "K", "L"]
      const randomLetter = letters[Math.floor(Math.random() * letters.length)]
      const random5Digits = String(Math.floor(10000 + Math.random() * 90000))
      setLuckySeries(`${seriesNum}${randomLetter}`)
      setLuckyNumber(random5Digits)
      setIsSpinning(false)
    }, 400)
  }

  return (
    <ToolLayout
      title="Lottery Sambad Result Guide, Draw Times & Tax Tool"
      desc="Check Nagaland Lottery Sambad draw times at 1PM, 6PM and 8PM, calculate 30% TDS on prize winnings, view official result steps, and get fun lucky numbers."
      icon="🎟️"
      iconBg="rgba(168,85,247,0.08)"
      category="finance"
      slug="lottery-sambad-today"
      faq={faq}
      howItWorks={howItWorks}
      schema={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Nagaland Lottery Sambad Guide & Tax Calculator",
        applicationCategory: "FinanceApplication",
        url: "https://www.uptools.in/lottery-sambad-today/",
        description: "Informational guide for Nagaland Lottery Sambad draw times, result checking verification procedures, and Section 194B 30% lottery prize tax TDS calculation.",
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6" ref={resultRef}>
        {/* Strict Non-Betting Educational Disclaimer */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-purple-500/20 text-xs text-slate-300 flex items-start gap-3 shadow-lg">
          <span className="text-xl">ℹ️</span>
          <div>
            <strong className="text-purple-300 font-bold block mb-1">
              Strictly Informational &amp; Educational Guide Only:
            </strong>
            UpTools is not affiliated with the Directorate of Nagaland State Lotteries or any government department. This portal does not sell lottery tickets, does not host games or betting, and does not facilitate any financial transactions. Lotteries carry financial risk and are subject to state laws (18+ only).
          </div>
        </div>

        {/* Daily Draw Timings Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Daily Nagaland State Draw Schedule (3 Draws Daily)
            </h3>
            <span className="text-[10px] text-slate-400 font-mono bg-white/[0.04] px-2 py-0.5 rounded-md">
              Ticket Price: ₹6
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {DRAW_SLOTS.map((slot) => (
              <div
                key={slot.time}
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-purple-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-black text-white font-mono">{slot.time}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {slot.badge}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-purple-200 mb-1">{slot.name}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{slot.schemes}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-slate-400">1st Prize:</span>
                  <span className="font-extrabold text-emerald-400 font-mono">{slot.topPrize}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 194B Prize Tax & TDS Calculator */}
        <div className="rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-6 shadow-xl">
          <div>
            <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>🧮</span> Lottery Prize TDS &amp; Net In-Hand Calculator
              </h3>
              <span className="text-[10px] font-mono bg-purple-500/15 text-purple-300 px-2.5 py-0.5 rounded-md border border-purple-500/30">
                Income Tax Section 194B / 115BB
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Calculate exact 30% base TDS, surcharge, and 4% Health &amp; Education cess on lottery winnings above ₹10,000.
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Select or Enter Prize Amount
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-3">
              {[
                { label: "₹1 Crore (Top Prize)", val: 10000000 },
                { label: "₹50 Lakhs", val: 5000000 },
                { label: "₹10 Lakhs", val: 1000000 },
                { label: "₹1 Lakh", val: 100000 },
                { label: "₹9,000 (2nd Prize)", val: 9000 },
              ].map((p) => (
                <button
                  key={p.val}
                  onClick={() => setGrossWinning(p.val)}
                  className={`p-2.5 rounded-xl text-center text-xs font-semibold border transition-all ${
                    grossWinning === p.val
                      ? "bg-purple-600 text-white border-purple-400 font-bold shadow-md shadow-purple-900/30"
                      : "bg-white/[0.03] border-white/5 text-slate-300 hover:text-white"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold">₹</span>
              <input
                type="number"
                min="0"
                value={grossWinning}
                onChange={(e) => setGrossWinning(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full bg-slate-900/90 border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-purple-500"
                placeholder="Enter winning prize amount"
              />
            </div>
          </div>

          {/* Calculation Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/8 text-center">
              <div className="text-xs text-slate-400 font-medium">Gross Winnings</div>
              <div className="text-xl sm:text-2xl font-extrabold text-white font-mono mt-1">
                ₹{grossWinning.toLocaleString("en-IN")}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Announced Prize</div>
            </div>

            <div className="p-4 rounded-2xl bg-red-500/[0.06] border border-red-500/20 text-center">
              <div className="text-xs text-red-300 font-medium">Total Tax Deducted (TDS)</div>
              <div className="text-xl sm:text-2xl font-extrabold text-red-400 font-mono mt-1">
                -₹{totalTax.toLocaleString("en-IN")}
              </div>
              <div className="text-[10px] text-red-300/80 mt-1 font-mono">
                {isTaxable ? `${effectiveRate}% Effective Rate` : "₹0 (Below ₹10k Exemption)"}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/[0.08] border border-emerald-500/20 text-center">
              <div className="text-xs text-emerald-300 font-medium">Net Take-Home Prize</div>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono mt-1">
                ₹{netInHand.toLocaleString("en-IN")}
              </div>
              <div className="text-[10px] text-emerald-300/80 mt-1">In-Hand Bank Credit</div>
            </div>
          </div>

          {/* Detailed Tax Line-Item Breakdown */}
          {isTaxable && (
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-xs">
              <div className="font-bold text-slate-300 mb-1">Detailed Statutory Tax Deductions:</div>
              <div className="flex justify-between text-slate-400">
                <span>Base TDS under Section 194B (Flat 30%):</span>
                <span className="font-mono text-slate-200">₹{baseTds.toLocaleString("en-IN")}</span>
              </div>
              {surcharge > 0 && (
                <div className="flex justify-between text-slate-400">
                  <span>Surcharge (High Net Prize Category):</span>
                  <span className="font-mono text-slate-200">₹{surcharge.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Health &amp; Education Cess (4% on TDS):</span>
                <span className="font-mono text-slate-200">₹{cess.toLocaleString("en-IN")}</span>
              </div>
              <div className="pt-2 border-t border-white/5 flex justify-between font-bold text-slate-200">
                <span>Total TDS Deducted at Source by Directorate:</span>
                <span className="font-mono text-red-400">₹{totalTax.toLocaleString("en-IN")}</span>
              </div>
            </div>
          )}

          {!isTaxable && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
              ✓ <strong className="text-white">Tax-Free Prize:</strong> Prizes of ₹10,000 or less are exempt from TDS deductions at source and can be encashed directly with registered sub-agents.
            </div>
          )}
        </div>

        {/* Fun Lucky Number Generator */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-semibold text-purple-400">
            <span>🎲</span>
            <span>FOR ENTERTAINMENT ONLY</span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white">
            Random Lucky Number &amp; Series Picker
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Random 5-digit number and series generated in your browser for fun. This does not predict or guarantee lottery results.
          </p>

          <div className="flex items-center justify-center gap-3 my-4">
            <div className="bg-slate-950 border border-purple-500/30 px-4 py-3 rounded-2xl font-mono text-xl sm:text-3xl font-black text-purple-300 tracking-wider shadow-inner">
              {luckySeries}
            </div>
            <div className="bg-slate-950 border border-emerald-500/30 px-6 py-3 rounded-2xl font-mono text-2xl sm:text-4xl font-black text-emerald-400 tracking-widest shadow-inner">
              {luckyNumber}
            </div>
          </div>

          <div>
            <button
              onClick={generateLuckyNumber}
              disabled={isSpinning}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-purple-900/30 disabled:opacity-50"
            >
              {isSpinning ? "Picking Random Digits..." : "🎲 Spin New Lucky Number"}
            </button>
          </div>
        </div>

        {/* How to Check Official Result Steps */}
        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/8 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span>📋</span> How to Verify Official Result PDF &amp; Gazette
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="font-bold text-purple-400">1. Official Source</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Download the result PDF directly from the official website of the Directorate of Nagaland State Lotteries or state gazette.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="font-bold text-purple-400">2. Match Time &amp; Date</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Confirm that the printed draw time (1:00 PM, 6:00 PM, or 8:00 PM) and draw date match your paper ticket exactly.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="font-bold text-purple-400">3. Check 5-Digit Number</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Check the 5-digit number and series letter across all prize tiers (1st, 2nd, 3rd, 4th, 5th, and consolation prizes).
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="font-bold text-purple-400">4. Claim Within 30 Days</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Prize claims must be lodged within 30 days of the draw date with an undamaged original ticket and valid KYC documents.
              </p>
            </div>
          </div>
        </div>

        {/* Prize Structure Table */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Nagaland Dear Lottery Prize Tier Structure
          </h3>
          <div className="divide-y divide-white/5 text-xs">
            {PRIZE_TIERS.map((tier) => (
              <div key={tier.rank} className="py-2.5 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="font-bold text-purple-300 block">{tier.rank}</span>
                  <span className="text-[11px] text-slate-400">{tier.note}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-white block">{tier.amount}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{tier.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Internal Links for SEO */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-3">
          <span className="font-semibold text-slate-300">Explore Financial &amp; Tax Calculators:</span>
          <div className="flex flex-wrap gap-2">
            <Link to="/income-tax-tool/" className="text-purple-400 hover:underline">Income Tax Calculator</Link>
            <span className="text-slate-600">•</span>
            <Link to="/tds-calculator/" className="text-purple-400 hover:underline">TDS Calculator</Link>
            <span className="text-slate-600">•</span>
            <Link to="/gst-calculator/" className="text-purple-400 hover:underline">GST Calculator</Link>
            <span className="text-slate-600">•</span>
            <Link to="/age-calculator-by-date/" className="text-purple-400 hover:underline">Age Calculator</Link>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
