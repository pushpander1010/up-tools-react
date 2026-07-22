import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1)
const YEARS = Array.from({ length: 100 }, (_, i) => 2025 - i)

const ZODIAC_DATA = {
  'Capricorn': { sym: '♑', dates: 'Dec 22 – Jan 19', element: 'Earth', planet: 'Saturn',
    traits: ['Ambitious', 'Disciplined', 'Patient', 'Strategic', 'Practical'],
    personality: 'Natural leaders who build empires with patience and discipline. They value structure and aren\'t afraid of hard work. Their determination is unmatched.',
    famous: 'Martin Luther King Jr., Muhammad Ali, Kate Middleton' },
  'Aquarius': { sym: '♒', dates: 'Jan 20 – Feb 18', element: 'Air', planet: 'Uranus',
    traits: ['Innovative', 'Independent', 'Humanitarian', 'Visionary', 'Quirky'],
    personality: 'The rebels and inventors of the zodiac. They think ten steps ahead and march to their own beat. Their originality changes the world.',
    famous: 'Oprah Winfrey, Thomas Edison, Abraham Lincoln' },
  'Pisces': { sym: '♓', dates: 'Feb 19 – Mar 20', element: 'Water', planet: 'Neptune',
    traits: ['Empathetic', 'Creative', 'Intuitive', 'Compassionate', 'Dreamy'],
    personality: 'Deeply emotional and artistically gifted. They feel everything and channel it into art, music, and healing. Their intuition is psychic-level.',
    famous: 'Albert Einstein, Steve Jobs, Rihanna' },
  'Aries': { sym: '♈', dates: 'Mar 21 – Apr 19', element: 'Fire', planet: 'Mars',
    traits: ['Bold', 'Energetic', 'Competitive', 'Pioneering', 'Passionate'],
    personality: 'Born leaders who charge headfirst into everything. Their energy is infectious and their courage is legendary. First to act, never first to quit.',
    famous: 'Leonardo da Vinci, Maya Angelou, Robert Downey Jr.' },
  'Taurus': { sym: '♉', dates: 'Apr 20 – May 20', element: 'Earth', planet: 'Venus',
    traits: ['Reliable', 'Patient', 'Loyal', 'Sensual', 'Determined'],
    personality: 'The most grounded sign. They appreciate beauty, comfort, and loyalty above all. Once they commit, they\'re forever. Stubborn? Only when they\'re right.',
    famous: 'William Shakespeare, Adele, David Beckham' },
  'Gemini': { sym: '♊', dates: 'May 21 – Jun 20', element: 'Air', planet: 'Mercury',
    traits: ['Versatile', 'Witty', 'Curious', 'Communicative', 'Adaptable'],
    personality: 'Two minds in one body. They can hold three conversations at once and charm anyone. Their curiosity makes them the most interesting person in any room.',
    famous: 'Morgan Freeman, Kendrick Lamar, Johnny Depp' },
  'Cancer': { sym: '♋', dates: 'Jun 21 – Jul 22', element: 'Water', planet: 'Moon',
    traits: ['Nurturing', 'Protective', 'Intuitive', 'Loyal', 'Emotional'],
    personality: 'The heart of the zodiac. Fiercely protective of loved ones, they create homes and families that feel like sanctuaries. Their empathy is a superpower.',
    famous: 'Princess Diana, Tom Hanks, Selena Gomez' },
  'Leo': { sym: '♌', dates: 'Jul 23 – Aug 22', element: 'Fire', planet: 'Sun',
    traits: ['Charismatic', 'Creative', 'Generous', 'Confident', 'Dramatic'],
    personality: 'Born to shine. They light up every room and inspire everyone around them. Natural performers, born leaders, and the most generous sign.',
    famous: 'Barack Obama, Jennifer Lopez, Usain Bolt' },
  'Virgo': { sym: '♍', dates: 'Aug 23 – Sep 22', element: 'Earth', planet: 'Mercury',
    traits: ['Analytical', 'Meticulous', 'Helpful', 'Practical', 'Humble'],
    personality: 'The perfectionists who make everything work. Their attention to detail is unmatched and their ability to organize chaos is legendary.',
    famous: 'Beyoncé, Keanu Reeves, Warren Buffett' },
  'Libra': { sym: '♎', dates: 'Sep 23 – Oct 22', element: 'Air', planet: 'Venus',
    traits: ['Diplomatic', 'Charming', 'Fair-minded', 'Social', 'Artistic'],
    personality: 'The peacemakers with impeccable taste. They see both sides of every argument and make everything beautiful. Their charm is effortless.',
    famous: 'Gandhi, Will Smith, Kim Kardashian' },
  'Scorpio': { sym: '♏', dates: 'Oct 23 – Nov 21', element: 'Water', planet: 'Pluto',
    traits: ['Intense', 'Mysterious', 'Loyal', 'Perceptive', 'Transformative'],
    personality: 'The most powerful sign. They see through lies, feel deeply, and transform everything they touch. Loyal to the end — cross them once and you\'ll know why.',
    famous: 'Marie Curie, Leonardo DiCaprio, Bill Gates' },
  'Sagittarius': { sym: '♐', dates: 'Nov 22 – Dec 21', element: 'Fire', planet: 'Jupiter',
    traits: ['Adventurous', 'Optimistic', 'Philosophical', 'Free-spirited', 'Honest'],
    personality: 'The eternal travelers and truth-seekers. They collect experiences like others collect things. Their optimism is infectious and their honesty is refreshing.',
    famous: 'Walt Disney, Taylor Swift, Brad Pitt' },
}

function getZodiac(month, day) {
  const signs = [[1, 20, 'Capricorn'], [2, 19, 'Aquarius'], [3, 21, 'Pisces'], [4, 20, 'Aries'], [5, 21, 'Taurus'], [6, 21, 'Gemini'], [7, 23, 'Cancer'], [8, 23, 'Leo'], [9, 23, 'Virgo'], [10, 23, 'Libra'], [11, 22, 'Scorpio'], [12, 22, 'Sagittarius'], [12, 32, 'Capricorn']]
  for (const [m, d, name] of signs) { if (month === m && day <= d) return name }
  return 'Capricorn'
}

function calcAge(day, month, year) {
  if (!day || !month || !year) return null
  const birth = new Date(year, month - 1, day)
  const today = new Date()
  if (birth > today) return null
  let y = today.getFullYear() - birth.getFullYear()
  let m = today.getMonth() - birth.getMonth()
  let d = today.getDate() - birth.getDate()
  if (d < 0) { m--; d += new Date(today.getFullYear(), today.getMonth(), 0).getDate() }
  if (m < 0) { y--; m += 12 }
  const totalDays = Math.floor((today - birth) / 86400000)
  const totalWeeks = Math.floor(totalDays / 7)
  const totalHours = totalDays * 24
  const totalMinutes = totalHours * 60
  const totalSeconds = totalMinutes * 60
  const heartbeats = Math.floor(totalMinutes * 72) // avg 72 bpm
  const breaths = Math.floor(totalMinutes * 16) // avg 16 breaths/min
  const nextBday = (() => {
    let n = new Date(today.getFullYear(), birth.getMonth(), birth.getDate())
    if (n <= today) n.setFullYear(n.getFullYear())
    return Math.ceil((n - today) / 86400000)
  })()
  const dayOfWeek = birth.toLocaleDateString('en-US', { weekday: 'long' })
  return { years: y, months: m, days: d, totalDays, totalWeeks, totalHours, totalMinutes, totalSeconds, heartbeats, breaths, nextBday, dayOfWeek }
}

function SelectField({ label, value, onChange, options, placeholder }) {
  return (
    <div className="flex-1">
      <label className="block text-xs font-semibold text-slate-500 mb-1.5">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-3 py-3 text-sm text-white font-semibold outline-none focus:border-brand/40 transition-all duration-200 appearance-none cursor-pointer"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M2 4l4 4 4-4'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}>
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

const StatCard = ({ value, label, color = 'gradient-text' }) => (
  <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/8 text-center">
    <div className={`text-3xl font-extrabold ${color}`}>{value}</div>
    <div className="text-xs text-slate-500 mt-1 font-medium">{label}</div>
  </div>
)

export default function age_calculator() {

  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')

  const age = useMemo(() => calcAge(parseInt(day), parseInt(month), parseInt(year)), [day, month, year])
  const zodiacName = useMemo(() => (day && month) ? getZodiac(parseInt(month), parseInt(day)) : null, [day, month])
  const zodiac = useMemo(() => zodiacName ? ZODIAC_DATA[zodiacName] : null, [zodiacName])

  const hasAll = day && month && year

  return (
    <ToolLayout
      title="Age Calculator"
      desc="Calculate your exact age in years, months, and days. Find your zodiac sign, personality traits, and fun life stats."
      icon="🎂" iconBg="rgba(99,102,241,0.08)"
      category="text" slug="age-calculator"
      faq={[
        { q: 'How is my exact age calculated?', a: 'From your date of birth to today, accounting for varying month lengths and leap years.' },
        { q: 'What is a zodiac sign?', a: 'Based on your birth date, one of 12 astrological signs associated with constellations and personality archetypes.' },
        { q: 'Are zodiac traits accurate?', a: 'They\'re for fun and entertainment. Personality is shaped by many factors beyond birth date!' },
      ]}
      howItWorks={[
        'Select your birth day, month, and year from the dropdowns.',
        'View your exact age in years, months, and days.',
        'Discover your zodiac sign, personality traits, and fun life statistics.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Age Calculator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/age-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Date of Birth — 3 Dropdowns */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-3">Date of Birth</label>
          <div className="flex gap-3">
            <SelectField label="Day" value={day} onChange={setDay}
              options={DAYS.map(d => ({ value: d, label: d }))}
              placeholder="DD" />
            <SelectField label="Month" value={month} onChange={setMonth}
              options={MONTHS.map((m, i) => ({ value: i + 1, label: m }))}
              placeholder="Month" />
            <SelectField label="Year" value={year} onChange={setYear}
              options={YEARS.map(y => ({ value: y, label: String(y) }))}
              placeholder="YYYY" />
          </div>
          {hasAll && (
            <button onClick={jumpTo}
              className="w-full mt-4 glow-btn py-3 rounded-xl text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
              🎂 Calculate My Age
            </button>
          )}
        </div>

        {/* Age Display */}
        {age && (
          <div style={{ animation: 'slideUp 0.35s ease-out' }}>
            <div ref={resultRef} className="grid grid-cols-3 gap-3 mb-4">
              <StatCard value={age.years} label="Years" />
              <StatCard value={age.months} label="Months" />
              <StatCard value={age.days} label="Days" />
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.05] border border-white/8 text-center">
              <span className="text-sm text-slate-400">Born on a </span>
              <span className="text-sm font-bold text-brand-light">{age.dayOfWeek}</span>
            </div>
          </div>
        )}

        {/* Fun Life Stats */}
        {age && (
          <div style={{ animation: 'slideUp 0.4s ease-out' }}>
            <h3 className="text-sm font-bold text-slate-300 mb-3">✨ Life Stats</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/8">
                <div className="text-2xl font-extrabold gradient-text">{age.totalDays.toLocaleString()}</div>
                <div className="text-[11px] text-slate-500 mt-1">Days Alive</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/8">
                <div className="text-2xl font-extrabold gradient-text">{age.totalWeeks.toLocaleString()}</div>
                <div className="text-[11px] text-slate-500 mt-1">Weeks Lived</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/8">
                <div className="text-2xl font-extrabold gradient-text">{age.totalHours.toLocaleString()}</div>
                <div className="text-[11px] text-slate-500 mt-1">Hours Breathed</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/8">
                <div className="text-2xl font-extrabold text-rose-400">{age.heartbeats.toLocaleString()}</div>
                <div className="text-[11px] text-slate-500 mt-1">Heartbeats 💓</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/8">
                <div className="text-2xl font-extrabold text-emerald-400">{age.breaths.toLocaleString()}</div>
                <div className="text-[11px] text-slate-500 mt-1">Breaths Taken</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/8">
                <div className="text-2xl font-extrabold text-amber-400">{age.totalMinutes.toLocaleString()}</div>
                <div className="text-[11px] text-slate-500 mt-1">Minutes Lived</div>
              </div>
            </div>
          </div>
        )}

        {/* Zodiac + Birthday */}
        {zodiac && age && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ animation: 'slideUp 0.5s ease-out' }}>
            {/* Birthday Countdown */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-brand/5 to-purple-500/5 border border-brand/15 text-center">
              <div className="text-5xl font-extrabold text-brand-light">{age.nextBday}</div>
              <div className="text-sm text-slate-400 mt-2">days until your next birthday</div>
              <div className="text-xs text-slate-500 mt-1">You'll be {age.years + 1} years old!</div>
            </div>

            {/* Zodiac Quick */}
            <div className="p-6 rounded-2xl bg-white/[0.05] border border-white/8 text-center">
              <div className="text-5xl mb-2">{zodiac.sym}</div>
              <div className="text-xl font-extrabold text-white">{zodiacName}</div>
              <div className="text-xs text-slate-500 mt-1">{zodiac.dates}</div>
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/8 text-slate-400">{zodiac.element}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/8 text-slate-400">{zodiac.planet}</span>
              </div>
            </div>
          </div>
        )}

        {/* Zodiac Personality Card */}
        {zodiac && zodiacName && (
          <div className="rounded-2xl bg-white/[0.05] border border-white/8 overflow-hidden" style={{ animation: 'slideUp 0.6s ease-out' }}>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{zodiac.sym}</span>
                <div>
                  <h3 className="text-lg font-bold text-white">{zodiacName} Personality</h3>
                  <p className="text-xs text-slate-500">{zodiac.element} sign • Ruled by {zodiac.planet}</p>
                </div>
              </div>

              {/* Traits */}
              <div className="flex flex-wrap gap-2 mb-4">
                {zodiac.traits.map(trait => (
                  <span key={trait} className="px-3 py-1 rounded-full text-xs font-bold bg-brand/10 text-brand-light border border-brand/20">
                    {trait}
                  </span>
                ))}
              </div>

              {/* Personality */}
              <p className="text-sm text-slate-400 leading-relaxed mb-4">{zodiac.personality}</p>

              {/* Famous */}
              <div className="p-3 rounded-xl bg-white/[0.06] border border-white/6">
                <span className="text-xs text-slate-500 font-semibold">Famous {zodiacName}s: </span>
                <span className="text-xs text-slate-300">{zodiac.famous}</span>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!hasAll && (
          <div className="text-center py-12 rounded-2xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🎂</div>
            <p className="text-sm text-slate-600 font-medium">Select your date of birth above to discover your age, zodiac, and life stats</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
