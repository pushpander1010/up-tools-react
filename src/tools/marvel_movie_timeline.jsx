import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'
import { Link } from 'react-router-dom'

const PHASES = [
  {
    name: 'Phase 1',
    subtitle: 'The Beginning',
    color: 'indigo',
    movies: [
      { title: 'Iron Man', year: 2008 },
      { title: 'The Incredible Hulk', year: 2008 },
      { title: 'Iron Man 2', year: 2010 },
      { title: 'Thor', year: 2011 },
      { title: 'Captain America: The First Avenger', year: 2011 },
      { title: 'The Avengers', year: 2012, highlight: true },
    ],
  },
  {
    name: 'Phase 2',
    subtitle: '',
    color: 'cyan',
    movies: [
      { title: 'Iron Man 3', year: 2013 },
      { title: 'Thor: The Dark World', year: 2013 },
      { title: 'Captain America: The Winter Soldier', year: 2014 },
      { title: 'Guardians of the Galaxy', year: 2014 },
      { title: 'Avengers: Age of Ultron', year: 2015, highlight: true },
      { title: 'Ant-Man', year: 2015 },
    ],
  },
  {
    name: 'Phase 3',
    subtitle: 'Infinity Saga',
    color: 'amber',
    movies: [
      { title: 'Captain America: Civil War', year: 2016 },
      { title: 'Doctor Strange', year: 2016 },
      { title: 'Guardians of the Galaxy Vol. 2', year: 2017 },
      { title: 'Spider-Man: Homecoming', year: 2017 },
      { title: 'Black Panther', year: 2018 },
      { title: 'Avengers: Infinity War', year: 2018, highlight: true },
      { title: 'Ant-Man and the Wasp', year: 2018 },
      { title: 'Captain Marvel', year: 2019 },
      { title: 'Avengers: Endgame', year: 2019, highlight: true },
      { title: 'Spider-Man: Far From Home', year: 2019 },
    ],
  },
  {
    name: 'Phase 4–6',
    subtitle: 'Multiverse Saga',
    color: 'rose',
    movies: [
      { title: 'WandaVision', year: 2021, note: 'Multiverse opens' },
      { title: 'Loki', year: 2021, note: 'Multiverse opens' },
      { title: 'Spider-Man: No Way Home', year: 2021, highlight: true },
      { title: 'Doctor Strange 2: Multiverse of Madness', year: 2022 },
      { title: 'Ant-Man 3: Quantumania', year: 2023 },
      { title: 'Deadpool & Wolverine', year: 2024, highlight: true },
      { title: 'Doomsday', year: 2026, highlight: true, upcoming: true },
      { title: 'Secret Wars', year: 2026, upcoming: true },
    ],
  },
]

const COLOR_MAP = {
  indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-400', dot: 'bg-indigo-400' },
  cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400', dot: 'bg-cyan-400' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', dot: 'bg-amber-400' },
  rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400', dot: 'bg-rose-400' },
}

export default function marvel_movie_timeline() {
  const [activePhase, setActivePhase] = useState('Phase 1')
  const phase = PHASES.find(p => p.name === activePhase)
  const colors = COLOR_MAP[phase?.color || 'indigo']

  const relatedTools = [
    { label: 'Marvel Doomsday 2026', href: '/marvel-doomsday/', icon: '🎬' },
    { label: 'Doomsday Cast', href: '/avengers-doomsday-cast/', icon: '🎭' },
    { label: 'Marvel Games', href: '/games/', icon: '🎮' },
  ]

  return (
    <ToolLayout
      title="MCU Movie Timeline"
      desc="The complete Marvel Cinematic Universe timeline and watch order — every phase, from Iron Man to the Multiverse Saga and Doomsday."
      icon="🎬" iconBg="rgba(244,63,94,0.08)"
      category="entertainment" slug="marvel-movie-timeline"
      faq={[
        { q: "What is the best Marvel watch order?", a: "For story continuity, watch in release order: Phase 1 (Iron Man → Avengers), Phase 2, Phase 3 (Infinity War / Endgame), then the Phase 4-6 Multiverse Saga leading into Doomsday and Secret Wars." },
        { q: "Do I need to watch everything before Doomsday?", a: "Not all of it. The key build-up is Loki, Doctor Strange 2, Ant-Man 3, the Spider-Man films, and Deadpool & Wolverine. Those set up the multiverse conflict." },
        { q: "What phase is Doomsday in?", a: "Doomsday is the climax of the Multiverse Saga (Phase 6), directly preceding Secret Wars." },
      ]}
      howItWorks={[
        "Each phase builds on the previous one — watch in release order for the intended story beats.",
        "Phase 4–6 (Multiverse Saga) is the essential setup for Doomsday and Secret Wars.",
        "Focus on Loki, Spider-Man films, and Deadpool & Wolverine before Doomsday.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        name: "MCU Movie Timeline", "applicationCategory": "EntertainmentApplication",
        url: "https://www.uptools.in/marvel-movie-timeline/",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Phase Tabs */}
        <div className="flex flex-wrap gap-2">
          {PHASES.map(p => {
            const c = COLOR_MAP[p.color]
            const isActive = activePhase === p.name
            return (
              <button key={p.name} onClick={() => setActivePhase(p.name)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border-2
                  ${isActive ? `${c.bg} ${c.border} ${c.text}` : 'bg-white/[0.06] border-white/8 text-slate-500 hover:text-white'}`}>
                {p.name}
              </button>
            )
          })}
        </div>

        {/* Active Phase Content */}
        {phase && (
          <div className={`rounded-2xl border ${colors.border} ${colors.bg} p-5`}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
              <h3 className={`text-sm font-bold ${colors.text}`}>
                {phase.name}{phase.subtitle ? ` — ${phase.subtitle}` : ''}
              </h3>
            </div>
            <div className="space-y-2">
              {phase.movies.map((m, i) => (
                <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all
                  ${m.upcoming ? 'bg-white/[0.06] border border-dashed border-white/12' : m.highlight ? 'bg-white/[0.06]' : ''}`}>
                  <span className={`text-xs font-mono w-10 ${m.upcoming ? 'text-slate-600' : 'text-slate-500'}`}>{m.year}</span>
                  <span className={`text-sm font-semibold ${m.highlight ? 'text-white' : 'text-slate-300'} ${m.upcoming ? 'italic' : ''}`}>
                    {m.title}
                  </span>
                  {m.note && <span className="text-[10px] text-slate-500 ml-auto">{m.note}</span>}
                  {m.upcoming && <span className="text-[10px] text-amber-400 ml-auto font-bold">UPCOMING</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Phases Overview */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-3">All Phases at a Glance</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PHASES.map(p => {
              const c = COLOR_MAP[p.color]
              return (
                <button key={p.name} onClick={() => setActivePhase(p.name)}
                  className={`p-3 rounded-xl text-center border transition-all
                    ${activePhase === p.name ? `${c.bg} ${c.border}` : 'bg-white/[0.03] border-white/5 hover:border-white/12'}`}>
                  <div className={`text-xs font-bold ${activePhase === p.name ? c.text : 'text-slate-300'}`}>{p.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{p.movies.length} titles</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: "What's the best Marvel watch order?", a: "Release order gives the intended story beats. Start with Phase 1 and follow through to the Multiverse Saga." },
              { q: "Do I need to watch everything before Doomsday?", a: "No — focus on Loki, Doctor Strange 2, Ant-Man 3, the Spider-Man films, and Deadpool & Wolverine. Those set up the multiverse conflict." },
              { q: "Where does Doomsday fit?", a: "It's the Phase 6 climax of the Multiverse Saga, directly before Secret Wars." },
            ].map((faq, i) => (
              <div key={i} className="bg-black/20 rounded-xl p-3">
                <div className="text-xs font-bold text-white mb-1">{faq.q}</div>
                <div className="text-[11px] text-slate-400">{faq.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Related */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <h2 className="text-sm font-bold text-white mb-3">Related Tools</h2>
          <div className="flex flex-wrap gap-2">
            {relatedTools.map(tool => (
              <Link key={tool.label} to={tool.href}
                className="px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-xs text-slate-400 hover:text-white transition-all">
                {tool.icon} {tool.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
