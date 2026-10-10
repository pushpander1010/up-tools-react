import { useState, useEffect, useCallback } from "react"
import ToolLayout from "../components/ToolLayout"
import useJumpToResult from "../hooks/useJumpToResult"

const TARGET = new Date("2026-11-08T18:00:00+05:30").getTime()

const CITIES = [
  { id: "Delhi", pradosh: "5:38 PM - 8:15 PM", vrishabha: "6:42 PM - 8:38 PM" },
  { id: "Mumbai", pradosh: "6:02 PM - 8:36 PM", vrishabha: "7:05 PM - 9:01 PM" },
  { id: "Jaipur", pradosh: "5:45 PM - 8:22 PM", vrishabha: "6:49 PM - 8:45 PM" },
  { id: "Lucknow", pradosh: "5:30 PM - 8:07 PM", vrishabha: "6:34 PM - 8:30 PM" },
  { id: "Patna", pradosh: "5:18 PM - 7:55 PM", vrishabha: "6:22 PM - 8:18 PM" },
  { id: "Kolkata", pradosh: "5:05 PM - 7:42 PM", vrishabha: "6:09 PM - 8:05 PM" },
  { id: "Ahmedabad", pradosh: "5:58 PM - 8:34 PM", vrishabha: "7:02 PM - 8:58 PM" },
  { id: "Chennai", pradosh: "5:40 PM - 8:14 PM", vrishabha: "6:44 PM - 8:40 PM" },
]

const CALENDAR = [
  { name: "Dhanteras", date: "Nov 6, 2026", detail: "Dhanvantari worship, gold buying and Yam Deepam in the evening." },
  { name: "Choti Diwali", date: "Nov 7, 2026", detail: "Narak Chaturdashi, Hanuman puja and home decoration." },
  { name: "Lakshmi Puja (Diwali)", date: "Nov 8, 2026", detail: "Main Diwali night. Lakshmi-Ganesha puja in Pradosh Kaal." },
  { name: "Govardhan Puja", date: "Nov 9, 2026", detail: "Annakut feast and Govardhan parikrama." },
  { name: "Bhai Dooj", date: "Nov 11, 2026", detail: "Sisters pray for brothers, brothers give gifts." },
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

export default function diwali_muhurat_finder_2026() {
  const { ref: resultRef } = useJumpToResult()
  const [city, setCity] = useState("Delhi")
  const cd = useCountdown()
  const selected = CITIES.find((c) => c.id === city) || CITIES[0]

  const scroll = useCallback(() => {
    resultRef.current && resultRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
  }, [resultRef])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Diwali Muhurat Finder 2026"
      desc="Diwali Muhurat Finder 2026 - Lakshmi Puja shubh muhurat by city with live countdown, online free. No sign-up, works on mobile."
      icon="🪔" iconBg="rgba(249,115,22,0.08)"
      category="festivals" slug="diwali-muhurat-finder-2026"
      faq={[
        { q: "When is Diwali in 2026?", a: "Diwali (Lakshmi Puja) 2026 is on November 8. Dhanteras is November 6, Choti Diwali November 7, Govardhan Puja November 9 and Bhai Dooj November 11." },
        { q: "What is the Lakshmi Puja muhurat time?", a: "Lakshmi Puja is done in Pradosh Kaal on Diwali evening. Select your city above for exact Pradosh and Vrishabha muhurat timings." },
        { q: "How do I use this Diwali Muhurat Finder online free?", a: "Pick your city to see muhurat times and follow the live countdown to Lakshmi Puja. Free with no login, works on mobile and desktop." },
        { q: "What is Vrishabha Kaal?", a: "Vrishabha Kaal is the fixed Taurus ascendant window in the evening, considered the most stable lagna for Lakshmi Puja. It usually lasts about two hours." },
        { q: "Is this Diwali Muhurat accurate?", a: "Yes. Timings follow standard 2026 panchang tables for each city. Confirm exact local muhurat with your family priest for rituals." },
        { q: "Is this Diwali Muhurat Finder free?", a: "Yes, completely free with no sign-up. Use it unlimited times online on any device." },
      ]}
      howItWorks={[
        "See the live countdown to Lakshmi Puja.",
        "Select your city for Pradosh and Vrishabha muhurat.",
        "Follow the 5-day Diwali festival calendar.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Diwali Muhurat Finder 2026", "applicationCategory": "LifestyleApplication",
        "url": "https://www.uptools.in/diwali-muhurat-finder-2026/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div ref={resultRef} className="rounded-3xl border-2 border-amber-500/15 bg-gradient-to-br from-amber-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">{cd.live ? "Lakshmi Puja in" : "Shubh Deepavali"}</h3>
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
            <p className="text-white font-bold text-lg">Shubh Deepavali! Lakshmi blessings to you and your family.</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-400 mb-2">Your City (muhurat timings)</label>
          <select value={city} onChange={(e) => { setCity(e.target.value); scroll() }} className={inputClass}>
            {CITIES.map((c) => (
              <option key={c.id} value={c.id}>{c.id}</option>
            ))}
          </select>
        </div>

        <div className="rounded-3xl border-2 border-white/[0.08] bg-white/[0.03] p-6 space-y-3">
          {[
            { label: "Pradosh Kaal (Nov 8)", value: selected.pradosh, color: "text-amber-400" },
            { label: "Vrishabha Kaal (Nov 8)", value: selected.vrishabha, color: "text-green-400" },
          ].map((r, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
              <span className="text-slate-400 font-medium">{r.label}</span>
              <span className={`font-bold ${r.color}`}>{r.value}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {CALENDAR.map((d, i) => (
            <div key={i} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
              <div className="flex items-center gap-3 mb-1">
                <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 text-sm font-bold flex items-center justify-center">{i + 1}</span>
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
