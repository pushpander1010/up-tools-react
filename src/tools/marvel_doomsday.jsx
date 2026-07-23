import ToolLayout from '../components/ToolLayout'
import { Link } from 'react-router-dom'

export default function marvel_doomsday() {
  const keyInfo = [
    { icon: '📅', label: 'Release', value: '2026 — penultimate chapter before Secret Wars' },
    { icon: '🌀', label: 'Saga', value: 'Multiverse Saga (WandaVision → Loki → Quantumania → Doomsday → Secret Wars)' },
    { icon: '🌍', label: 'Scale', value: 'Unites Avengers, X-Men, and multiversal variants on one battlefield' },
    { icon: '🦹', label: 'Villain', value: 'Doctor Doom — first MCU appearance as central threat' },
  ]

  const relatedTools = [
    { label: 'MCU Movie Timeline', href: '/marvel-movie-timeline/', icon: '🎬' },
    { label: 'Doomsday Cast', href: '/avengers-doomsday-cast/', icon: '🎭' },
    { label: 'Marvel Games', href: '/games/', icon: '🎮' },
  ]

  return (
    <ToolLayout
      title="Marvel Doomsday 2026"
      desc="Everything about Marvel's Doomsday (2026): release date, confirmed cast, how it connects to the Multiverse Saga, and what to expect."
      icon="🎬" iconBg="rgba(244,63,94,0.08)"
      category="entertainment" slug="marvel-doomsday"
      faq={[
        { q: "When is Marvel's Doomsday released?", a: "Doomsday is scheduled for 2026 as the next major Avengers film in the Multiverse Saga. The exact date is confirmed by Marvel as production wraps." },
        { q: "Is Doomsday part of the Multiverse Saga?", a: "Yes. Doomsday continues the Multiverse Saga that began with WandaVision and runs through Secret Wars, bringing together variants of beloved heroes and villains." },
        { q: "Who returns in Doomsday?", a: "The film reunites core Avengers with X-Men and multiverse variants. Confirmed casting is announced in waves — follow official Marvel channels for the full list." },
      ]}
      howItWorks={[
        "Doomsday is the penultimate chapter before Secret Wars in the Multiverse Saga.",
        "Doctor Doom takes center stage — a first for the MCU as the saga's central villain.",
        "The multiverse threads from Loki, Spider-Man, and Deadpool & Wolverine all converge here.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        name: "Marvel Doomsday 2026", "applicationCategory": "EntertainmentApplication",
        url: "https://www.uptools.in/marvel-doomsday/",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Key Info */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-3">What We Know</h2>
          <div className="space-y-3">
            {keyInfo.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-lg mt-0.5">{item.icon}</span>
                <div>
                  <span className="text-xs font-bold text-slate-300">{item.label}</span>
                  <p className="text-xs text-slate-400 mt-0.5">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Connects */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-3">How It Connects</h2>
          <p className="text-xs text-slate-400 mb-4">
            If you're catching up, our MCU Movie Timeline lays out the exact watch order so Doomsday lands.
            The multiverse threads from Loki, the Spider-Man films, and Deadpool & Wolverine all converge here.
          </p>
          <Link to="/marvel-movie-timeline/"
            className="inline-block px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-bold hover:bg-indigo-400 transition-all">
            See the Timeline →
          </Link>
        </div>

        {/* FAQ */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: "When is Doomsday released?", a: "2026, as the next major Avengers film. The exact date is confirmed by Marvel as production wraps — bookmark this page for updates." },
              { q: "Is Doomsday part of the Multiverse Saga?", a: "Yes. It's the direct lead-in to Secret Wars and resolves the multiversal storyline running since Phase 4." },
              { q: "Who is the main villain?", a: "Doctor Doom (Victor Von Doom) becomes the MCU's central threat for this two-film finale." },
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
