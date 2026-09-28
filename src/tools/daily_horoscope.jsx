import { useState, useCallback, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const SIGNS = [
  { name: 'Aries', emoji: '♈', dates: 'Mar 21 – Apr 19', start: [3, 21], end: [4, 19] },
  { name: 'Taurus', emoji: '♉', dates: 'Apr 20 – May 20', start: [4, 20], end: [5, 20] },
  { name: 'Gemini', emoji: '♊', dates: 'May 21 – Jun 20', start: [5, 21], end: [6, 20] },
  { name: 'Cancer', emoji: '♋', dates: 'Jun 21 – Jul 22', start: [6, 21], end: [7, 22] },
  { name: 'Leo', emoji: '♌', dates: 'Jul 23 – Aug 22', start: [7, 23], end: [8, 22] },
  { name: 'Virgo', emoji: '♍', dates: 'Aug 23 – Sep 22', start: [8, 23], end: [9, 22] },
  { name: 'Libra', emoji: '♎', dates: 'Sep 23 – Oct 22', start: [9, 23], end: [10, 22] },
  { name: 'Scorpio', emoji: '♏', dates: 'Oct 23 – Nov 21', start: [10, 23], end: [11, 21] },
  { name: 'Sagittarius', emoji: '♐', dates: 'Nov 22 – Dec 21', start: [11, 22], end: [12, 21] },
  { name: 'Capricorn', emoji: '♑', dates: 'Dec 22 – Jan 19', start: [12, 22], end: [1, 19] },
  { name: 'Aquarius', emoji: '♒', dates: 'Jan 20 – Feb 18', start: [1, 20], end: [2, 18] },
  { name: 'Pisces', emoji: '♓', dates: 'Feb 19 – Mar 20', start: [2, 19], end: [3, 20] },
]

/* Simple deterministic hash: sign index + day-of-year → stable within a day */
function dayOfYear(d) {
  const start = new Date(d.getFullYear(), 0, 0)
  return Math.floor((d - start) / 86400000)
}
function seededRandom(seed) {
  let s = seed
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646 }
}

const LOVE = [
  'Romance is in the air today — a heartfelt conversation could deepen a bond.',
  'Singles may find unexpected attraction in familiar circles. Stay open.',
  'A small gesture of appreciation goes a long way in love today.',
  'Partnership harmony peaks — plan something special together.',
  'Be honest about your feelings; vulnerability attracts genuine connections.',
  'Flirtatious energy surrounds you — enjoy the playful interactions.',
  'An old flame may resurface; respond thoughtfully.',
  'Self-love is the priority today — take care of your emotional needs.',
]
const CAREER = [
  'Focus on finishing what you started before chasing new projects.',
  'A collaborative approach yields better results than going solo.',
  'Networking opportunities arise unexpectedly — say yes to invitations.',
  'Avoid office gossip today; stay focused on your goals.',
  'Creative solutions to old problems will impress your superiors.',
  'Delegation is key — trust your team with smaller tasks.',
  'Your analytical skills shine; use them to solve a tricky issue.',
  'Take a strategic pause before making big career decisions.',
]
const HEALTH = [
  'Stay hydrated and take short breaks from screens throughout the day.',
  'A brisk walk outdoors will refresh your mind and body.',
  'Listen to your body — rest if you feel fatigued.',
  'Light stretching in the morning improves focus for the rest of the day.',
  'Nutritious meals today will boost your energy levels significantly.',
  'Avoid stress-eating; choose a calming activity instead.',
  'Sleep quality improves if you wind down without screens tonight.',
  'Physical activity brings mental clarity — even 20 minutes helps.',
]
const MOODS = ['Inspired', 'Calm', 'Energetic', 'Reflective', 'Playful', 'Confident', 'Curious', 'Serene', 'Determined', 'Hopeful']
const COLORS = ['Crimson', 'Emerald', 'Sapphire', 'Amber', 'Violet', 'Turquoise', 'Gold', 'Rose', 'Indigo', 'Coral']

function getDailyReading(signIdx) {
  const today = new Date()
  const seed = signIdx * 1000 + today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  const rand = seededRandom(seed)
  const pick = (arr) => arr[Math.floor(rand() * arr.length)]
  return {
    love: pick(LOVE),
    career: pick(CAREER),
    health: pick(HEALTH),
    luckyNumber: Math.floor(rand() * 99) + 1,
    luckyColor: pick(COLORS),
    mood: pick(MOODS),
    date: today.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
  }
}

export default function daily_horoscope() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [selectedSign, setSelectedSign] = useState(null)

  const reading = useMemo(() => selectedSign !== null ? getDailyReading(selectedSign) : null, [selectedSign])

  const handleSelect = (idx) => {
    setSelectedSign(idx)
    jumpTo()
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400"

  return (
    <ToolLayout
      title="Daily Horoscope – Free Zodiac Reading"
      desc="Get your free daily horoscope for all 12 zodiac signs. Love, career, health insights, lucky number and color — updated every day with a deterministic reading."
      icon="🔮" iconBg="rgba(139,92,246,0.08)"
      category="fun" slug="daily-horoscope"
      faq={[
        { q: "Is this horoscope really free?", a: "Yes, completely free with no sign-up required. Use it unlimited times on any device." },
        { q: "How is the reading generated?", a: "Each sign gets a deterministic reading based on a hash of the sign index and today's date. It changes daily but stays the same all day." },
        { q: "Can I check horoscopes for other signs?", a: "Absolutely! Tap any zodiac sign on the grid to get that sign's daily reading." },
        { q: "Is this daily horoscope accurate?", a: "Horoscopes are for entertainment and self-reflection only. They are not scientific predictions and should not be used for major life decisions." },
      ]}
      howItWorks={[
        "Select your zodiac sign from the grid below.",
        "The reading is generated deterministically from your sign and today's date.",
        "View your daily love, career, and health predictions along with lucky number, color, and mood.",
        "Your reading stays the same all day — refresh or revisit anytime.",
        "Share your horoscope with friends or check other signs too.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Daily Horoscope", "applicationCategory": "EntertainmentApplication",
        "operatingSystem": "WebBrowser",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {SIGNS.map((s, i) => (
            <button key={s.name} onClick={() => handleSelect(i)}
              className={`group flex flex-col items-center gap-1.5 py-4 rounded-2xl border-2 transition-all duration-200 active:scale-95 ${
                selectedSign === i
                  ? 'border-indigo-500/50 bg-indigo-500/10'
                  : 'border-white/8 bg-white/[0.04] hover:border-indigo-500/20 hover:bg-white/[0.06]'
              }`}>
              <span className="text-3xl">{s.emoji}</span>
              <span className="text-xs font-bold text-white">{s.name}</span>
              <span className="text-[10px] text-slate-500 font-medium">{s.dates}</span>
            </button>
          ))}
        </div>

        {reading ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-violet-500/15 bg-gradient-to-br from-violet-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-4xl">{SIGNS[selectedSign].emoji}</span>
              <div>
                <h3 className="text-lg font-bold text-white">{SIGNS[selectedSign].name} Daily Horoscope</h3>
                <p className="text-xs text-slate-400 font-medium">{reading.date}</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { icon: '❤️', label: 'Love', text: reading.love },
                { icon: '💼', label: 'Career', text: reading.career },
                { icon: '🏃', label: 'Health', text: reading.health },
              ].map((item, i) => (
                <div key={i} className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm font-bold text-violet-400 uppercase tracking-wider">{item.label}</span>
                  </div>
                  <p className="text-sm text-slate-300 font-medium leading-relaxed">{item.text}</p>
                </div>
              ))}

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5 text-center">
                  <span className="text-xs text-slate-500 font-bold uppercase">Lucky #</span>
                  <p className="text-xl font-bold text-amber-400 mt-1">{reading.luckyNumber}</p>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5 text-center">
                  <span className="text-xs text-slate-500 font-bold uppercase">Color</span>
                  <p className="text-xl font-bold text-fuchsia-400 mt-1">{reading.luckyColor}</p>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5 text-center">
                  <span className="text-xs text-slate-500 font-bold uppercase">Mood</span>
                  <p className="text-xl font-bold text-cyan-400 mt-1">{reading.mood}</p>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 mt-5 text-center font-medium italic">
              ⚠️ For entertainment purposes only. Not a substitute for professional advice.
            </p>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🔮</div>
            <p className="text-sm text-slate-600 font-medium">Select your zodiac sign to get today's reading</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
