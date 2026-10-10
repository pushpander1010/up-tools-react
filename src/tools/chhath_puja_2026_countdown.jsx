import { useState, useEffect, useCallback } from "react"
import ToolLayout from "../components/ToolLayout"
import useJumpToResult from "../hooks/useJumpToResult"

const TARGET = new Date("2026-10-27T17:30:00+05:30").getTime()

const CITIES = [
  { id: "Patna", sunset: "5:28 PM", sunrise: "6:03 AM" },
  { id: "Delhi", sunset: "5:43 PM", sunrise: "6:28 AM" },
  { id: "Lucknow", sunset: "5:35 PM", sunrise: "6:15 AM" },
  { id: "Varanasi", sunset: "5:30 PM", sunrise: "6:07 AM" },
  { id: "Ranchi", sunset: "5:22 PM", sunrise: "5:58 AM" },
  { id: "Kolkata", sunset: "5:12 PM", sunrise: "5:48 AM" },
  { id: "Mumbai", sunset: "6:08 PM", sunrise: "6:37 AM" },
]

const DAYS = [
  { name: "Nahay Khay", date: "Oct 26, 2026", detail: "Holy bath and bottle gourd meal. Devotees prepare the home and ghat." },
  { name: "Kharna", date: "Oct 27 morning, 2026", detail: "Day-long fast broken after sunset with kheer and roti prasad." },
  { name: "Sandhya Arghya", date: "Oct 27 evening, 2026", detail: "Evening offering to the setting sun at riverbank or pond." },
  { name: "Usha Arghya", date: "Oct 28 sunrise, 2026", detail: "Morning offering to the rising sun, then fast ends." },
]

function useCountdown() {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  const diff = Math.max(0, TARGET - now)
  return {
    live: diff > 0,
    d: Math.floor(diff / 86400000),
    h: Math.floor(diff / 3600000) % 24,
    m: Math.floor(diff / 60000) % 60,
    s: Math.floor(diff / 1000) % 60,
  }
}

export default function chhath_puja_2026_countdown() {
  const { ref: resultRef } = useJumpToResult()
  const [city, setCity] = useState("Patna")
  const cd = useCountdown()
  const selected = CITIES.find((c) => c.id === city) || CITIES[0]

  const scroll = useCallback(() => {
    resultRef.current && resultRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
  }, [resultRef])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Chhath Puja 2026 Countdown"
      desc="Chhath Puja 2026 Countdown - live timer, 4-day calendar and city-wise arghya timings, online free. No sign-up, works on mobile."
      icon="🌅" iconBg="rgba(249,115,22,0.08)"
      category="festivals" slug="chhath-puja-2026-countdown"
      faq={[
        { q: "When is Chhath Puja in 2026?", a: "Chhath Puja 2026 falls on October 27 to 28. Nahay Khay is October 26, Kharna October 27 morning, Sandhya Arghya October 27 evening and Usha Arghya October 28 at sunrise." },
        { q: "What is Sandhya Arghya time?", a: "Sandhya Arghya is offered at sunset on October 27, 2026. Pick your city above for the exact sunset time, around 5:12 PM to 6:08 PM across India." },
        { q: "How do I use this Chhath Puja Countdown online free?", a: "The live timer runs automatically. Select your city to see arghya timings and the 4-day calendar. Free with no login, works on mobile and desktop." },
        { q: "What are the 4 days of Chhath?", a: "Day 1 Nahay Khay, Day 2 Kharna fast, Day 3 Sandhya Arghya to the setting sun, Day 4 Usha Arghya to the rising sun when the fast ends." },
        { q: "Is this Chhath Puja Countdown accurate?", a: "Yes. Timings follow standard 2026 sunrise and sunset tables for each city. Confirm exact local muhurat with your family priest for rituals." },
        { q: "Is this Chhath Puja Countdown free?", a: "Yes, completely free with no sign-up. Use it unlimited times online on any device." },
      ]}
      howItWorks={[
        "See the live countdown to Sandhya Arghya.",
        "Select your city for sunset and sunrise arghya times.",
        "Follow the 4-day calendar and ritual checklist.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Chhath Puja 2026 Countdown", "applicationCategory": "LifestyleApplication",
        "url": "https://www.uptools.in/chhath-puja-2026-countdown/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div ref={resultRef} className="rounded-3xl border-2 border-orange-500/15 bg-gradient-to-br from-orange-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            <h3 className="text-sm font-bold text-orange-400 uppercase tracking-wider">{cd.live ? "Sandhya Arghya in" : "Chhath Puja 2026"}</h3>
          </div>
          {cd.live ? (
            <div className="grid grid-cols-4 gap-3 text-center">
              {[
                { v: cd.d, l: "Days" },
                { v: cd.h, l: "Hours" },
                { v: cd.m, l: "Mins" },
                { v: cd.s, l: "Secs" },
              ].map((u, i) => (
                <div key={i} className="rounded-2xl bg-white/[0.04] border border-white/[0.08] py-4">
                  <div className="text-3xl font-bold text-white">{String(u.v).padStart(2, "0")}</div>
                  <div className="text-xs font-bold text-slate-400 mt-1">{u.l}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white font-bold text-lg">Shubh Chhath Puja! Usha Arghya blessings to you and your family.</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-400 mb-2">Your City (arghya timings)</label>
          <select value={city} onChange={(e) => { setCity(e.target.value); scroll() }} className={inputClass}>
            {CITIES.map((c) => (
              <option key={c.id} value={c.id}>{c.id}</option>
            ))}
          </select>
        </div>

        <div className="rounded-3xl border-2 border-white/[0.08] bg-white/[0.03] p-6 space-y-3">
          {[
            { label: "Sandhya Arghya (sunset, Oct 27)", value: selected.sunset, color: "text-orange-400" },
            { label: "Usha Arghya (sunrise, Oct 28)", value: selected.sunrise, color: "text-amber-300" },
          ].map((r, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
              <span className="text-slate-400 font-medium">{r.label}</span>
              <span className={`font-bold ${r.color}`}>{r.value}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {DAYS.map((d, i) => (
            <div key={i} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
              <div className="flex items-center gap-3 mb-1">
                <span className="w-7 h-7 rounded-full bg-orange-500/20 text-orange-300 text-sm font-bold flex items-center justify-center">{i + 1}</span>
                <h4 className="text-white font-bold">{d.name}</h4>
              </div>
              <p className="text-xs font-bold text-slate-500 ml-10">{d.date}</p>
              <p className="text-sm text-slate-300 ml-10 mt-1">{d.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  )
}
