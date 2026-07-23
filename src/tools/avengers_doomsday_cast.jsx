import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'

export default function avengers_doomsday_cast() {
  const [openFaq, setOpenFaq] = useState(null)

  const faqs = [
    { q: 'Who plays Doctor Doom?', a: 'Doom leads the Multiverse Saga finale. Marvel reveals casting in official waves — this page tracks confirmations as they land.' },
    { q: 'Which Avengers return?', a: 'Core survivors from Endgame return alongside X-Men and variant heroes. The full ensemble is announced progressively.' },
    { q: 'Are the X-Men really in it?', a: 'Yes — the multiverse premise brings X-Men variants into the story at a scale never seen in the MCU before.' },
  ]

  return (
    <ToolLayout
      title="Avengers: Doomsday Cast"
      desc="The biggest ensemble in MCU history. Here's the rundown of who's confirmed and what to expect from the Doomsday cast."
      icon="🦸" iconBg="rgba(244,63,94,0.08)"
      category="fun" slug="avengers-doomsday-cast"
      faq={[
        { q: 'Who plays Doctor Doom in Doomsday?', a: 'Doctor Doom is the central villain of the Multiverse Saga finale. Casting is announced in waves by Marvel — see the full confirmed list on this page as it\'s revealed.' },
        { q: 'Which Avengers return for Doomsday?', a: 'Core Avengers from the Infinity Saga return alongside X-Men and multiversal variants. The exact ensemble is revealed progressively through official Marvel announcements.' },
        { q: 'Are the X-Men in Doomsday?', a: 'Yes — the multiverse setup brings X-Men variants into the MCU for the first time at this scale, a major draw of the film.' },
      ]}
      howItWorks={[
        'The Infinity Saga survivors regroup for the multiversal threat.',
        'X-Men variants enter the MCU at scale for the first time.',
        'Doctor Doom unites heroes against a common foe.',
        'Multiverse cameos bring variants of familiar faces across the multiverse.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Avengers Doomsday Cast", "applicationCategory": "EntertainmentApplication",
        "url": "https://www.uptools.in/avengers-doomsday-cast/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6">
          <h2 className="text-lg font-bold text-white mb-3">What to expect</h2>
          <ul className="space-y-3 text-slate-300 text-sm">
            <li className="flex gap-3">
              <span className="text-rose-400 font-bold">•</span>
              <div><strong className="text-white">Returning Avengers</strong> — the Infinity Saga survivors regroup for the multiversal threat.</div>
            </li>
            <li className="flex gap-3">
              <span className="text-rose-400 font-bold">•</span>
              <div><strong className="text-white">X-Men variants</strong> — mutants enter the MCU at scale for the first time.</div>
            </li>
            <li className="flex gap-3">
              <span className="text-rose-400 font-bold">•</span>
              <div><strong className="text-white">Doctor Doom</strong> — the saga's central villain, uniting heroes against a common foe.</div>
            </li>
            <li className="flex gap-3">
              <span className="text-rose-400 font-bold">•</span>
              <div><strong className="text-white">Multiverse cameos</strong> — variants of familiar faces from across the multiverse.</div>
            </li>
          </ul>
        </div>

        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6">
          <h2 className="text-lg font-bold text-white mb-4">Frequently asked questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-white/8 bg-white/[0.04] overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-white">{faq.q}</span>
                  <span className={`text-slate-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>▾</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-slate-400">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6">
          <h2 className="text-lg font-bold text-white mb-3">Related</h2>
          <div className="flex flex-wrap gap-2 text-sm">
            <a href="/marvel-doomsday/" className="px-4 py-2 rounded-xl bg-white/[0.06] border border-white/8 text-indigo-400 hover:bg-indigo-500/10 transition-all">Marvel Doomsday 2026</a>
            <a href="/marvel-movie-timeline/" className="px-4 py-2 rounded-xl bg-white/[0.06] border border-white/8 text-indigo-400 hover:bg-indigo-500/10 transition-all">MCU Timeline</a>
            <a href="/games/" className="px-4 py-2 rounded-xl bg-white/[0.06] border border-white/8 text-indigo-400 hover:bg-indigo-500/10 transition-all">Marvel Games</a>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
