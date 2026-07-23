import { useState, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const TIMELINE = [
  { icon: '🏟️', title: 'Group Stage', date: 'June 11 – 27' },
  { icon: '⚔️', title: 'Round of 32', date: 'June 28 – July 3' },
  { icon: '🔰', title: 'Round of 16', date: 'July 4 – 7' },
  { icon: '🏅', title: 'Quarter-Finals', date: 'July 9 – 11' },
  { icon: '🌟', title: 'Semi-Finals', date: 'July 14 – 15' },
  { icon: '🥉', title: '3rd Place Play-off', date: 'July 18' },
  { icon: '🏆', title: 'Final', date: 'July 19', active: true },
]

const STATS = [
  { num: '48', label: 'Teams' },
  { num: '16', label: 'Venues' },
  { num: '3', label: 'Host Countries' },
  { num: '104', label: 'Matches' },
]

export default function fifa_world_cup_countdown() {
  const { ref: resultRef, jumpTo } = useJumpToResult()

  return (
    <ToolLayout
      title="FIFA World Cup 2026 Results"
      desc="The 2026 FIFA World Cup has concluded. Spain beat Argentina 1-0 in the Final on July 19, 2026 at MetLife Stadium."
      icon="🏆" iconBg="rgba(234,179,8,0.08)"
      category="fifa" slug="fifa-world-cup-countdown"
      faq={[
        { q: "When is the FIFA World Cup 2026 Final?", a: "The Final was held on July 19, 2026, at 8:00 PM ET at MetLife Stadium in East Rutherford, New Jersey. Spain beat Argentina 1–0." },
        { q: "How many teams were in the 2026 World Cup?", a: "48 teams for the first time, expanded from 32." },
        { q: "Which countries hosted the 2026 World Cup?", a: "The United States, Mexico, and Canada — the first World Cup hosted by three nations." },
      ]}
      howItWorks={[
        "The tournament ran from June 11 to July 19, 2026.",
        "104 matches across 16 venues in 3 countries.",
        "Spain won the Final 1–0 against Argentina.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "WebApplication",
        name: "FIFA World Cup 2026 Countdown Timer",
        url: "https://www.uptools.in/fifa-world-cup-countdown/",
        description: "The FIFA World Cup 2026 has concluded. Spain beat Argentina 1-0 in the Final.",
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6" ref={resultRef}>
        {/* Champion Card */}
        <div className="rounded-3xl border-2 border-amber-500/20 bg-gradient-to-br from-amber-500/[0.08] via-white/[0.02] to-transparent p-6 sm:p-8 text-center">
          <div className="text-5xl mb-3">🏆</div>
          <h2 className="text-2xl font-extrabold text-white mb-1">
            <span className="text-amber-400">🇪🇸 Spain</span> — 2026 Champions
          </h2>
          <p className="text-slate-400 text-sm mb-6">Second World Cup title (after 2010)</p>
          <div className="flex items-center justify-center gap-4 text-4xl font-extrabold">
            <div className="text-center">
              <div className="text-amber-400">1</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Spain 🇪🇸</div>
            </div>
            <div className="text-slate-600 text-lg">–</div>
            <div className="text-center">
              <div className="text-slate-400">0</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Argentina 🇦🇷</div>
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-500">
            <strong>MetLife Stadium</strong> · East Rutherford, NJ · July 19, 2026
          </div>
          <div className="mt-2 text-xs text-slate-600">
            🥇 Golden Boot: Kylian Mbappé (10 goals)
          </div>
        </div>

        {/* Tournament Timeline */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Tournament Timeline</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TIMELINE.map((t, i) => (
              <div key={i} className={`p-3 rounded-xl text-center transition-all ${t.active ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-white/[0.03] border border-white/5'}`}>
                <div className="text-2xl mb-1">{t.icon}</div>
                <div className={`text-xs font-bold ${t.active ? 'text-amber-400' : 'text-slate-300'}`}>{t.title}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{t.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STATS.map(s => (
            <div key={s.label} className="p-4 rounded-2xl bg-white/[0.06] border border-white/8 text-center">
              <div className="text-2xl font-extrabold text-indigo-400">{s.num}</div>
              <div className="text-[11px] text-slate-500 mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="text-center text-xs text-slate-600 rounded-xl bg-white/[0.03] border border-white/5 p-3">
          The <strong className="text-slate-300">FIFA World Cup 2026</strong> is the first edition to feature 48 teams and hosted by three nations: <strong className="text-slate-300">United States</strong>, <strong className="text-slate-300">Mexico</strong>, and <strong className="text-slate-300">Canada</strong>.
        </div>
      </div>
    </ToolLayout>
  )
}
