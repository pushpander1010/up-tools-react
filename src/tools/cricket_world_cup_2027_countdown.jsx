import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import ToolLayout from "../components/ToolLayout"
import useJumpToResult from "../hooks/useJumpToResult"

const HOSTS = [
  { name: "South Africa", flag: "🇿🇦", venues: "8 Venues (Wanderers, Newlands, Kingsmead, etc.)", role: "Primary Host" },
  { name: "Zimbabwe", flag: "🇿🇼", venues: "2 Venues (Harare Sports Club, Queens Sports Club Bulawayo)", role: "Co-Host" },
  { name: "Namibia", flag: "🇳🇦", venues: "Windhoek Stadiums (First-time CWC host)", role: "Co-Host" },
]

const GROUPS = [
  {
    name: "Group A",
    badge: "Group of Death",
    teams: [
      { name: "India", flag: "🇮🇳", ranking: "Top Seed", status: "Direct Qualifier" },
      { name: "Pakistan", flag: "🇵🇰", ranking: "Seeded", status: "Direct Qualifier" },
      { name: "Australia", flag: "🇦🇺", ranking: "Defending Champ", status: "Direct Qualifier" },
      { name: "South Africa", flag: "🇿🇦", ranking: "Co-Host", status: "Host Qualifier" },
      { name: "Netherlands", flag: "🇳🇱", ranking: "Associate Qualifier", status: "Qualifier" },
      { name: "Qualifier 1 (TBD)", flag: "🏏", ranking: "Global Qualifier", status: "CWC Qualifier" },
      { name: "Qualifier 2 (TBD)", flag: "🏏", ranking: "Global Qualifier", status: "CWC Qualifier" },
    ],
  },
  {
    name: "Group B",
    badge: "Challengers Group",
    teams: [
      { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", ranking: "Former Champ", status: "Direct Qualifier" },
      { name: "New Zealand", flag: "🇳🇿", ranking: "Top 4 Contender", status: "Direct Qualifier" },
      { name: "West Indies", flag: "🌴", ranking: "Two-time Champ", status: "Direct Qualifier" },
      { name: "Sri Lanka", flag: "🇱🇰", ranking: "Former Champ", status: "Direct Qualifier" },
      { name: "Afghanistan", flag: "🇦🇫", ranking: "Rising Force", status: "Direct Qualifier" },
      { name: "Zimbabwe", flag: "🇿🇼", ranking: "Co-Host", status: "Host Qualifier" },
      { name: "Namibia", flag: "🇳🇦", ranking: "Co-Host", status: "Host Qualifier" },
    ],
  },
]

const KEY_FIXTURES = [
  {
    match: "Opening Clash: South Africa vs Zimbabwe",
    stage: "Group Stage",
    venue: "Wanderers Stadium, Johannesburg 🇿🇦",
    date: "15 Oct 2027",
    timeIst: "13:30 IST",
    timeSast: "10:00 SAST",
    highlight: "Tournament Opener in the Highveld",
  },
  {
    match: "India vs Pakistan",
    stage: "Group A Marquee",
    venue: "Wanderers Stadium, Johannesburg 🇿🇦",
    date: "24 Oct 2027",
    timeIst: "14:00 IST",
    timeSast: "10:30 SAST",
    highlight: "Highest viewership clash of the group stage",
  },
  {
    match: "Australia vs India",
    stage: "Group A Blockbuster",
    venue: "Newlands, Cape Town 🇿🇦",
    date: "31 Oct 2027",
    timeIst: "14:00 IST",
    timeSast: "10:30 SAST",
    highlight: "Rematch of 2023 World Cup Finalists",
  },
  {
    match: "Australia vs Pakistan",
    stage: "Group A",
    venue: "SuperSport Park, Centurion 🇿🇦",
    date: "04 Nov 2027",
    timeIst: "14:00 IST",
    timeSast: "10:30 SAST",
    highlight: "Pace battle on bouncy Centurion turf",
  },
  {
    match: "England vs New Zealand",
    stage: "Group B",
    venue: "Harare Sports Club, Harare 🇿🇼",
    date: "07 Nov 2027",
    timeIst: "13:30 IST",
    timeSast: "10:00 SAST",
    highlight: "Classic 2019 rematch in Zimbabwe",
  },
  {
    match: "Semi-Final 1",
    stage: "Knockout",
    venue: "Kingsmead, Durban 🇿🇦",
    date: "23 Nov 2027",
    timeIst: "14:00 IST",
    timeSast: "10:30 SAST",
    highlight: "Super Six Seed 1 vs Seed 4",
  },
  {
    match: "Semi-Final 2",
    stage: "Knockout",
    venue: "Wanderers Stadium, Johannesburg 🇿🇦",
    date: "24 Nov 2027",
    timeIst: "14:00 IST",
    timeSast: "10:30 SAST",
    highlight: "Super Six Seed 2 vs Seed 3",
  },
  {
    match: "ICC CWC 2027 Grand Final",
    stage: "Championship Final",
    venue: "Wanderers Stadium, Johannesburg 🇿🇦",
    date: "28 Nov 2027",
    timeIst: "14:00 IST",
    timeSast: "10:30 SAST",
    highlight: "World Champion Crowned in Johannesburg",
  },
]

const TOURNAMENT_STATS = [
  { value: "14", label: "Teams", sub: "2 Groups of 7" },
  { value: "54", label: "Total Matches", sub: "Group, Super Six & Finals" },
  { value: "3", label: "Host Nations", sub: "SA, Zimbabwe & Namibia" },
  { value: "50", label: "Overs Format", sub: "Standard One Day International" },
]

const faq = [
  { q: "When does the ICC Mens Cricket World Cup 2027 start and end?", a: "The tournament is scheduled to run from October 15, 2027 through November 28, 2027, featuring 54 matches over a 6-week window across South Africa, Zimbabwe, and Namibia." },
  { q: "Which countries are hosting the 2027 Cricket World Cup?", a: "The 2027 edition is co-hosted by South Africa, Zimbabwe, and Namibia. South Africa will host matches across 8 venues, Zimbabwe across 2 grounds, and Namibia will host international fixtures for the first time." },
  { q: "Are India, Pakistan, and Australia in the same group for CWC 2027?", a: "Yes. Group A features a blockbuster lineup including India, Pakistan, Australia, and co-hosts South Africa, setting up major group stage matches including India vs Pakistan and India vs Australia." },
  { q: "What is the tournament format for the 14-team 2027 World Cup?", a: "The 14 teams are split into two groups of seven. The top three teams from each group advance to the Super Six stage with points carried forward, followed by the semi-finals and the grand final." },
  { q: "Where will the 2027 Cricket World Cup Final be played?", a: "The final is scheduled to take place on November 28, 2027 at the iconic Wanderers Stadium in Johannesburg, South Africa." },
]

const howItWorks = [
  "Check the live countdown timer tracking days, hours, minutes, and seconds until opening day.",
  "Explore the group draw featuring India, Pakistan, and Australia placed in Group A.",
  "Review marquee fixture dates, host venues, and switch between IST and local SAST kick-off times.",
  "Learn the tournament format from group stages to Super Six and the Johannesburg final.",
]

export default function CricketWorldCup2027Countdown() {
  const { ref: resultRef } = useJumpToResult()
  const [activeTab, setActiveTab] = useState("countdown")
  const [timezone, setTimezone] = useState("IST")
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false })

  useEffect(() => {
    const targetDate = new Date("2027-10-15T10:00:00+02:00").getTime()
    const updateCountdown = () => {
      const now = Date.now()
      const difference = targetDate - now
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true })
        return
      }
      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)
      setTimeLeft({ days, hours, minutes, seconds, isPast: false })
    }

    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <ToolLayout
      title="Cricket World Cup 2027 Countdown & Schedule"
      desc="Track ICC Mens Cricket World Cup 2027 countdown, live schedule, venues in South Africa, Zimbabwe, Namibia, plus Group stage draw with India and Pakistan."
      icon="🏏"
      iconBg="rgba(16,185,129,0.08)"
      category="cricket"
      slug="cricket-world-cup-2027-countdown"
      faq={faq}
      howItWorks={howItWorks}
      schema={{
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        name: "ICC Men's Cricket World Cup 2027",
        startDate: "2027-10-15",
        endDate: "2027-11-28",
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: {
          "@type": "Place",
          name: "Wanderers Stadium",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Johannesburg",
            addressCountry: "ZA",
          },
        },
        description: "ICC Men's Cricket World Cup 2027 live countdown, group tables, fixtures and venue guide across South Africa, Zimbabwe, and Namibia.",
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6" ref={resultRef}>
        {/* Main Countdown Hero */}
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/40 via-slate-900/80 to-slate-950 p-6 sm:p-8 text-center shadow-xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-400 mb-4">
            <span>🇿🇦 🇿🇼 🇳🇦</span>
            <span>OCTOBER 15 – NOVEMBER 28, 2027</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            ICC Men&apos;s Cricket World Cup 2027
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto mb-6">
            14 Nations, 54 ODIs, 3 Host Countries. Countdown to opening day at Wanderers Stadium, Johannesburg.
          </p>

          {/* Countdown Clock Grid */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-xl mx-auto mb-6">
            {[
              { label: "Days", val: timeLeft.days },
              { label: "Hours", val: timeLeft.hours },
              { label: "Minutes", val: timeLeft.minutes },
              { label: "Seconds", val: timeLeft.seconds },
            ].map((unit) => (
              <div key={unit.label} className="bg-slate-900/90 border border-emerald-500/20 rounded-2xl p-3 sm:p-4 text-center shadow-inner">
                <div className="text-2xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight">
                  {String(unit.val).padStart(2, "0")}
                </div>
                <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 bg-white/[0.04] px-3 py-1.5 rounded-lg border border-white/5">
              <span>🏟️</span> Wanderers, Newlands &amp; Kingsmead
            </span>
            <span className="flex items-center gap-1.5 bg-white/[0.04] px-3 py-1.5 rounded-lg border border-white/5">
              <span>🏆</span> Defending Champions: Australia 🇦🇺
            </span>
          </div>
        </div>

        {/* Tournament Highlights Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TOURNAMENT_STATS.map((stat) => (
            <div key={stat.label} className="p-4 rounded-2xl bg-white/[0.03] border border-white/8 text-center hover:border-emerald-500/30 transition-all">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">{stat.value}</div>
              <div className="text-xs font-bold text-slate-200 mt-0.5">{stat.label}</div>
              <div className="text-[11px] text-slate-400 mt-1">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
          {[
            { id: "countdown", label: "Groups & Draw" },
            { id: "fixtures", label: "Key Fixtures & Venues" },
            { id: "hosts", label: "Co-Hosts & Grounds" },
            { id: "format", label: "Format Explainer" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/30"
                  : "bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Groups & Teams */}
        {activeTab === "countdown" && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-3">
              <span className="text-base">🔥</span>
              <div>
                <strong className="text-amber-100 font-bold">Group of Death Confirmed:</strong> India, Pakistan, and Australia are drawn together in Group A alongside host South Africa. Only top 3 teams advance to Super Six!
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GROUPS.map((group) => (
                <div key={group.name} className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>🏏</span> {group.name}
                    </h3>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {group.badge}
                    </span>
                  </div>

                  <div className="divide-y divide-white/5">
                    {group.teams.map((t, idx) => (
                      <div key={t.name} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-slate-500 w-4">{idx + 1}</span>
                          <span className="text-lg">{t.flag}</span>
                          <span className="font-semibold text-slate-200">{t.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] text-slate-400 block">{t.ranking}</span>
                          <span className="text-[9px] text-emerald-400/80 font-mono">{t.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Key Fixtures */}
        {activeTab === "fixtures" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">High Voltage Match Schedule</h3>
              <div className="flex items-center gap-1.5 text-xs bg-white/[0.04] p-1 rounded-xl border border-white/10">
                <span className="text-slate-400 px-2">Timezone:</span>
                <button
                  onClick={() => setTimezone("IST")}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${timezone === "IST" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"}`}
                >
                  IST (India)
                </button>
                <button
                  onClick={() => setTimezone("SAST")}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${timezone === "SAST" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"}`}
                >
                  SAST (Local SA)
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {KEY_FIXTURES.map((fixture) => (
                <div key={fixture.match} className="p-4 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-emerald-500/20 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold text-emerald-400 mb-1">{fixture.stage}</div>
                      <h4 className="text-sm sm:text-base font-extrabold text-white">{fixture.match}</h4>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                        <span>📍</span> {fixture.venue}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-slate-200">{fixture.date}</div>
                      <div className="text-xs font-mono text-emerald-400 mt-0.5">
                        {timezone === "IST" ? fixture.timeIst : fixture.timeSast}
                      </div>
                      <span className="inline-block mt-1 text-[10px] text-slate-400 bg-white/[0.05] px-2 py-0.5 rounded-full">
                        {fixture.highlight}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Hosts & Grounds */}
        {activeTab === "hosts" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {HOSTS.map((host) => (
                <div key={host.name} className="p-5 rounded-2xl bg-white/[0.03] border border-white/8 text-center">
                  <div className="text-4xl mb-2">{host.flag}</div>
                  <h4 className="text-base font-bold text-white">{host.name}</h4>
                  <span className="text-[11px] text-emerald-400 font-semibold">{host.role}</span>
                  <p className="text-xs text-slate-400 mt-3 leading-relaxed">{host.venues}</p>
                </div>
              ))}
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-xs text-slate-300">
              <div className="font-bold text-white text-sm">Key Stadium Highlights:</div>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li><strong className="text-slate-200">Wanderers Stadium (Johannesburg):</strong> The &apos;Bullring&apos; will host the grand final, opening match, and India vs Pakistan.</li>
                <li><strong className="text-slate-200">Newlands (Cape Town):</strong> Scenic ground at the foot of Table Mountain hosting Australia vs India.</li>
                <li><strong className="text-slate-200">Kingsmead (Durban):</strong> Traditional coastal venue hosting Semi-Final 1 with pace and swing.</li>
                <li><strong className="text-slate-200">Harare Sports Club (Harare):</strong> Primary ground in Zimbabwe for Group B matches.</li>
                <li><strong className="text-slate-200">Windhoek Cricket Ground (Namibia):</strong> Landmark first-ever CWC matches hosted in Namibia.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 4: Format Explainer */}
        {activeTab === "format" && (
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/8 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white">How the 2027 World Cup Format Operates</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="text-emerald-400 font-bold mb-1">Step 1: Groups</div>
                <p className="text-slate-400">14 teams in 2 groups of 7. Each team plays 6 group stage round-robin matches.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="text-emerald-400 font-bold mb-1">Step 2: Super Six</div>
                <p className="text-slate-400">Top 3 teams from each group qualify. Points against fellow qualifiers carry forward.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="text-emerald-400 font-bold mb-1">Step 3: Semi-Finals</div>
                <p className="text-slate-400">Top 4 teams in the Super Six table progress to knockout semi-finals in Durban and Johannesburg.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="text-emerald-400 font-bold mb-1">Step 4: Final</div>
                <p className="text-slate-400">The 2 winners battle in the 50-over World Cup Final on November 28, 2027.</p>
              </div>
            </div>
          </div>
        )}

        {/* Internal Links for SEO */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-3">
          <span className="font-semibold text-slate-300">Explore Cricket Analytics Tools:</span>
          <div className="flex flex-wrap gap-2">
            <Link to="/cricket-run-rate/" className="text-emerald-400 hover:underline">Cricket Run Rate</Link>
            <span className="text-slate-600">•</span>
            <Link to="/cricket-nrr/" className="text-emerald-400 hover:underline">Net Run Rate Calculator</Link>
            <span className="text-slate-600">•</span>
            <Link to="/cricket-score-predictor/" className="text-emerald-400 hover:underline">Score Predictor</Link>
            <span className="text-slate-600">•</span>
            <Link to="/fifa-world-cup-countdown/" className="text-emerald-400 hover:underline">FIFA Countdown</Link>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
