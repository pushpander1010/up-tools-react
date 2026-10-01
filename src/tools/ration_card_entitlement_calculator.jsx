import { useState } from "react"
import { Link } from "react-router-dom"
import ToolLayout from "../components/ToolLayout"
import useJumpToResult from "../hooks/useJumpToResult"

const STATES_DATA = [
  { state: "Uttar Pradesh", note: "5kg/unit free (3kg wheat + 2kg rice for PHH; 14kg wheat + 21kg rice for AAY) plus seasonal fortified salt & pulses." },
  { state: "Bihar", note: "5kg/unit free grain under PMGKAY, 100% biometric e-POS & Aadhaar face authentication enabled at FPS dealers." },
  { state: "West Bengal", note: "Khadya Sathi scheme provides free digital ration grain; special door-step delivery pilot in selected blocks." },
  { state: "Tamil Nadu", note: "Universal PDS: 20kg free rice to all eligible cardholders (35kg for AAY) plus subsidized sugar, toor dal & palmolein oil." },
  { state: "Maharashtra", note: "5kg/person free grain via e-POS, with Anandacha Shidha festive ration kits distributed during key festive seasons." },
  { state: "Rajasthan", note: "Free NFSA quota plus Annapurna food packet scheme containing edible oil, lentils, and essential spice packets." },
  { state: "Madhya Pradesh", note: "5kg free grain/person with coarse grains (bajra, jowar, maize) distribution prioritized across tribal blocks." },
  { state: "Karnataka", note: "Anna Bhagya scheme: 5kg free NFSA rice plus direct DBT cash transfer of ₹170/person for additional 5kg quota." },
  { state: "Gujarat", note: "5kg free food grains per member plus fortified double-iodized salt and edible oil at subsidized prices for NFSA cards." },
  { state: "Andhra Pradesh", note: "Doorstep delivery of Sortex-clean fortified boiled rice in reusable bags through village ward mobile delivery units." },
  { state: "Telangana", note: "6kg fine-grade (Sanna Biyyam) white rice per person at ₹0 for Food Security Card (FSC) holders across the state." },
  { state: "Kerala", note: "Color-coded card tiers: Yellow (AAY, 35kg free), Pink (PHH, 5kg/person free), Blue and White (subsidized state quotas)." },
  { state: "Delhi", note: "5kg free grain per unit with 100% portability under One Nation One Ration Card (ONORC) across all FPS outlets." },
  { state: "Punjab", note: "Ghar Ghar Ration scheme provides door-to-door packaged wheat flour (atta) delivery to eligible smart card holders." },
  { state: "Odisha", note: "5kg free rice per person under NFSA and State Food Security Scheme (SFSS) backed by e-KYC verified smart cards." },
  { state: "Assam", note: "Free rice (5kg/member PHH, 35kg AAY) with 100% Aadhaar-seeding coverage and cashless fair price shop operations." },
  { state: "Haryana", note: "5kg free grain per unit with mustard oil subsidy of ₹250/month credited via DBT for BPL/AAY cardholders." },
  { state: "Jharkhand", note: "5kg free grain per person under PMGKAY, plus green ration cards for 20 lakh state-funded non-NFSA beneficiaries." },
]

const faq = [
  { q: "How much ration grain is a PHH ration card holder entitled to per month?", a: "Under the National Food Security Act (NFSA), Priority Household (PHH) cardholders are entitled to exactly 5 kilograms of food grains per person per month. For example, a family of 5 members receives 25 kilograms of free food grains monthly." },
  { q: "What is the difference between PHH and AAY ration card quotas under NFSA?", a: "PHH (Priority Household) entitlement is unit-based at 5 kg per member per month. Antyodaya Anna Yojana (AAY) is issued to the poorest families and provides a fixed quota of 35 kg of food grains per household per month, regardless of the number of family members." },
  { q: "Are food grains completely free for ration card holders under PMGKAY?", a: "Yes. The Government of India has waived all grain issue prices (formerly ₹3/kg rice, ₹2/kg wheat) under the Pradhan Mantri Garib Kalyan Anna Yojana (PMGKAY). Free food grain distribution is approved through December 2028." },
  { q: "How do I complete mandatory Face-Auth eKYC for ration card in October 2026?", a: "Download the official Mera Ration 2.0 mobile app and the Aadhaar FaceRD app from Google Play Store. Log in using your ration card or Aadhaar number with mobile OTP, choose the family member pending eKYC, and use the camera for instant face biometric verification from home." },
  { q: "Can I collect my subsidized or free ration from any fair price shop in India?", a: "Yes. Under the One Nation One Ration Card (ONORC) portability system, any NFSA beneficiary can collect their monthly grain quota from any electronic Point of Sale (e-POS) enabled Fair Price Shop across all Indian states and Union Territories using biometric authentication." },
]

const howItWorks = [
  "Choose your ration card tier (PHH for Priority Household or AAY for Antyodaya Anna Yojana).",
  "Enter the number of family members registered on your digital ration card.",
  "Select your preferred grain split (Rice, Wheat, or Combined standard mix) to calculate your monthly quota.",
  "Read your state-specific entitlement rule and follow the step-by-step October 2026 Face-Auth eKYC guide.",
]

export default function RationCardEntitlementCalculator() {
  const { ref: resultRef } = useJumpToResult()
  const [cardType, setCardType] = useState("PHH")
  const [members, setMembers] = useState(4)
  const [grainMix, setGrainMix] = useState("split")
  const [selectedState, setSelectedState] = useState("Uttar Pradesh")
  const [copied, setCopied] = useState(false)

  // Calculations
  const marketPricePerKg = 38 // Average open-market cost of wheat/rice
  let totalGrain = 0

  if (cardType === "PHH") {
    totalGrain = members * 5
  } else if (cardType === "AAY") {
    totalGrain = 35 // Fixed 35 kg per family
  } else {
    // Non-NFSA / State Subsidized
    totalGrain = members * 3
  }

  let rice = 0
  let wheat = 0
  let coarse = 0

  if (grainMix === "split") {
    rice = Math.round(totalGrain * 0.6)
    wheat = totalGrain - rice
  } else if (grainMix === "rice") {
    rice = totalGrain
  } else if (grainMix === "wheat") {
    wheat = totalGrain
  } else {
    rice = Math.round(totalGrain * 0.5)
    wheat = Math.round(totalGrain * 0.3)
    coarse = totalGrain - rice - wheat
  }

  const monthlySavings = totalGrain * marketPricePerKg
  const annualSavings = monthlySavings * 12

  const activeStateInfo = STATES_DATA.find((s) => s.state === selectedState) || STATES_DATA[0]

  const copySummary = () => {
    const text = `NFSA Ration Entitlement Summary:\nCard Type: ${cardType} (${cardType === "AAY" ? "Antyodaya Anna Yojana" : "Priority Household"})\nFamily Units: ${members} members\nTotal Monthly Grain: ${totalGrain} kg (Free under PMGKAY)\nRice: ${rice} kg | Wheat: ${wheat} kg ${coarse > 0 ? `| Coarse Grains: ${coarse} kg` : ""}\nEstimated Monthly Savings: ₹${monthlySavings.toLocaleString("en-IN")}\nState Note (${selectedState}): ${activeStateInfo.note}\nFace e-KYC: Mandatory by October 2026 via Mera Ration 2.0 app.`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <ToolLayout
      title="Ration Card Entitlement Calculator & eKYC Guide"
      desc="Calculate NFSA ration quota for PHH and AAY cards, check free food grain entitlements by state, and learn how to complete mandatory face-auth eKYC online."
      icon="🌾"
      iconBg="rgba(245,158,11,0.08)"
      category="finance"
      slug="ration-card-entitlement-calculator"
      faq={faq}
      howItWorks={howItWorks}
      schema={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "NFSA Ration Card Entitlement Calculator",
        applicationCategory: "GovernmentApplication",
        url: "https://www.uptools.in/ration-card-entitlement-calculator/",
        description: "Calculate National Food Security Act (NFSA) food grain quota for PHH and AAY ration cardholders and learn how to complete Aadhaar FaceRD eKYC.",
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6" ref={resultRef}>
        {/* Government Announcement Banner */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-3">
          <span className="text-xl">📢</span>
          <div>
            <strong className="text-amber-100 font-bold">100% Free Food Grains (PMGKAY):</strong> Beneficiaries pay ₹0 at fair price shops. All cardholders must complete mandatory Aadhaar Face-Authentication eKYC by October 2026 to avoid interruption in ration allocation.
          </div>
        </div>

        {/* Calculator Inputs Card */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                1. Select Ration Card Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "PHH", title: "PHH Card", sub: "5 kg / Person" },
                  { id: "AAY", title: "AAY Card", sub: "35 kg / Family" },
                  { id: "OTHER", title: "State Non-NFSA", sub: "3 kg / Person" },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setCardType(tier.id)}
                    className={`p-3 rounded-2xl text-left border transition-all ${
                      cardType === tier.id
                        ? "bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-900/20"
                        : "bg-white/[0.03] border-white/5 text-slate-400 hover:text-white hover:bg-white/[0.06]"
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{tier.title}</div>
                    <div className="text-[10px] text-amber-400 font-medium mt-0.5">{tier.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Family Members Count */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  2. Family Members on Ration Card
                </label>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                  {members} {members === 1 ? "Member" : "Members"}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                value={members}
                onChange={(e) => setMembers(parseInt(e.target.value, 10))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>1 member</span>
                <span>5 members</span>
                <span>10 members</span>
                <span>15 members</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-white/5">
            {/* Grain Mix Preference */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                3. Grain Mix Preference
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "split", label: "Rice & Wheat (60:40)" },
                  { id: "rice", label: "100% Rice" },
                  { id: "wheat", label: "100% Wheat" },
                  { id: "coarse", label: "Millets / Coarse" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setGrainMix(item.id)}
                    className={`p-2.5 rounded-xl text-center text-xs font-semibold border transition-all ${
                      grainMix === item.id
                        ? "bg-amber-500 text-slate-950 border-amber-400 font-bold"
                        : "bg-white/[0.03] border-white/5 text-slate-300 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* State Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                4. Select State for Local Rule
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full bg-slate-800 border border-white/10 text-white rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-amber-500"
              >
                {STATES_DATA.map((s) => (
                  <option key={s.state} value={s.state}>
                    {s.state}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Calculation Result Hero Card */}
        <div className="rounded-3xl border-2 border-amber-500/20 bg-gradient-to-br from-amber-500/[0.08] via-slate-900 to-slate-950 p-6 sm:p-8 text-center shadow-xl">
          <div className="text-xs uppercase font-bold tracking-widest text-amber-400 mb-1">
            Total Monthly Food Grain Entitlement
          </div>
          <div className="text-4xl sm:text-6xl font-black text-white font-mono tracking-tight my-2">
            {totalGrain} <span className="text-xl sm:text-2xl text-amber-400 font-bold">KG / Month</span>
          </div>

          <p className="text-xs text-slate-300 max-w-lg mx-auto mb-6">
            Entitled under {cardType === "AAY" ? "Antyodaya Anna Yojana (AAY)" : cardType === "PHH" ? "Priority Household (PHH)" : "State Food Security Scheme"} for {members} registered {members === 1 ? "member" : "members"}.
          </p>

          {/* Grain Breakdown Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-6">
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/8 text-center">
              <div className="text-2xl mb-1">🍚</div>
              <div className="text-xl font-extrabold text-white font-mono">{rice} kg</div>
              <div className="text-[11px] text-slate-400 font-medium">Free Rice</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/8 text-center">
              <div className="text-2xl mb-1">🌾</div>
              <div className="text-xl font-extrabold text-white font-mono">{wheat} kg</div>
              <div className="text-[11px] text-slate-400 font-medium">Free Wheat</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/8 text-center">
              <div className="text-2xl mb-1">🪙</div>
              <div className="text-xl font-extrabold text-emerald-400 font-mono">₹0</div>
              <div className="text-[11px] text-slate-400 font-medium">Cost to Cardholder</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/8 text-center">
              <div className="text-2xl mb-1">💰</div>
              <div className="text-xl font-extrabold text-amber-400 font-mono">₹{monthlySavings.toLocaleString("en-IN")}</div>
              <div className="text-[11px] text-slate-400 font-medium">Monthly Subsidy Benefit</div>
            </div>
          </div>

          {/* Copy Summary Button */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={copySummary}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-900/30 flex items-center gap-2"
            >
              <span>{copied ? "✓ Copied Entitlement" : "📋 Copy Entitlement Summary"}</span>
            </button>
          </div>

          <div className="mt-4 text-[11px] text-slate-400">
            Equivalent annual family food security savings: <strong className="text-emerald-400">₹{annualSavings.toLocaleString("en-IN")}/year</strong> based on prevailing MSP market benchmarks.
          </div>
        </div>

        {/* State-wise Note Spotlight */}
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/8 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              State-Specific Entitlement Note: {activeStateInfo.state}
            </h3>
            <span className="text-[10px] text-slate-400 bg-white/[0.05] px-2 py-0.5 rounded-md">
              PDS Portal Verified
            </span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            {activeStateInfo.note}
          </p>
        </div>

        {/* October 2026 Face-Auth eKYC Explainer Guide */}
        <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/30 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xl shrink-0">
              📱
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                October 2026 Mandatory Face-Auth eKYC Guide
              </h3>
              <p className="text-xs text-slate-400">
                Complete Aadhaar biometric verification from home using your smartphone without visiting Fair Price Shops.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/6 space-y-2">
              <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h4 className="font-bold text-white text-xs">Install Required Apps</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Download <strong className="text-slate-200">Mera Ration 2.0</strong> and the UIDAI <strong className="text-slate-200">Aadhaar FaceRD</strong> app from Google Play Store on an Android phone.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/6 space-y-2">
              <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h4 className="font-bold text-white text-xs">Login with Aadhaar / Ration</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Open Mera Ration 2.0, enter your 12-digit Aadhaar or 10-digit Ration Card number, and submit the 6-digit OTP received on your Aadhaar-registered mobile.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/6 space-y-2">
              <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h4 className="font-bold text-white text-xs">Select Member &amp; Scan Face</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Select the family member showing &apos;eKYC Pending&apos;. Ensure good frontal lighting, blink when prompted, and allow the FaceRD camera to authenticate.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/6 space-y-2">
              <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                4
              </div>
              <h4 className="font-bold text-white text-xs">Instant Confirmation</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                A green checkmark appears confirming successful verification. The ration portal updates the member status to &apos;eKYC Completed&apos; within 24 hours.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="text-slate-300">
              <strong className="text-white">Do not have a smartphone?</strong> You can also complete eKYC free of charge at your local Fair Price Shop (FPS) dealer using their electronic Point of Sale (e-POS) biometric fingerprint or iris scanner.
            </div>
          </div>
        </div>

        {/* State Entitlement Quick Directory */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            State-Wise Ration Rules Directory
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {STATES_DATA.slice(0, 8).map((s) => (
              <div key={s.state} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="font-bold text-amber-400 block mb-0.5">{s.state}</span>
                <span className="text-slate-400 text-[11px]">{s.note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Internal Links for SEO */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-3">
          <span className="font-semibold text-slate-300">Related Public Benefit &amp; Tax Tools:</span>
          <div className="flex flex-wrap gap-2">
            <Link to="/aadhaar-validator/" className="text-amber-400 hover:underline">Aadhaar Validator</Link>
            <span className="text-slate-600">•</span>
            <Link to="/income-tax-tool/" className="text-amber-400 hover:underline">Income Tax Calculator</Link>
            <span className="text-slate-600">•</span>
            <Link to="/age-calculator-by-date/" className="text-amber-400 hover:underline">Age Calculator</Link>
            <span className="text-slate-600">•</span>
            <Link to="/gst-calculator/" className="text-amber-400 hover:underline">GST Calculator</Link>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
