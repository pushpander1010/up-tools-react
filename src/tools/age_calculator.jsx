import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

function calcAge(dob) {
  if (!dob) return null
  const birth = new Date(dob)
  const today = new Date()
  let years = today.getFullYear() - birth.getFullYear()
  let months = today.getMonth() - birth.getMonth()
  let days = today.getDate() - birth.getDate()
  if (days < 0) { months--; days += new Date(today.getFullYear(), today.getMonth(), 0).getDate() }
  if (months < 0) { years--; months += 12 }
  return { years, months, days, totalDays: Math.floor((today - birth) / 86400000) }
}

function getZodiac(month, day) {
  const signs = [
    [1, 20, 'Capricorn', '♑'], [2, 19, 'Aquarius', '♒'], [3, 21, 'Pisces', '♓'],
    [4, 20, 'Aries', '♈'], [5, 21, 'Taurus', '♉'], [6, 21, 'Gemini', '♊'],
    [7, 23, 'Cancer', '♋'], [8, 23, 'Leo', '♌'], [9, 23, 'Virgo', '♍'],
    [10, 23, 'Libra', '♎'], [11, 22, 'Scorpio', '♏'], [12, 22, 'Sagittarius', '♐'],
    [12, 32, 'Capricorn', '♑']
  ]
  for (const [m, d, name, sym] of signs) {
    if (month === m && day <= d) return { name, sym }
  }
  return { name: 'Capricorn', sym: '♑' }
}

function getNextBirthday(dob) {
  const birth = new Date(dob)
  const today = new Date()
  let next = new Date(today.getFullYear(), birth.getMonth(), birth.getDate())
  if (next <= today) next.setFullYear(next.getFullYear())
  return Math.ceil((next - today) / 86400000)
}

export default function age_calculator() {
  const [dob, setDob] = useState('')
  const age = calcAge(dob)
  const zodiac = dob ? getZodiac(new Date(dob).getMonth() + 1, new Date(dob).getDate()) : null
  const nextBday = dob ? getNextBirthday(dob) : null

  return (
    <>
      <Helmet>
        <title>Age Calculator — Exact Age, Zodiac & Birthday Countdown</title>
        <meta name="description" content="Calculate your exact age in years, months, days. Find your zodiac sign and next birthday countdown." />
        <link rel="canonical" href="https://www.uptools.in/age-calculator/" />
      </Helmet>

      <nav className="text-xs text-slate-500 mb-4">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span className="mx-2 text-slate-700">›</span>
        <span className="text-white">Age Calculator</span>
      </nav>

      <section className="glass p-6 mb-6" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(17,24,39,0.6))', borderColor: 'rgba(99,102,241,0.2)' }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>🎂</div>
          <div>
            <h1 className="text-xl font-bold text-white m-0">Age Calculator</h1>
            <p className="text-sm text-slate-400 mt-1">Exact age in years, months, days with zodiac sign</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="glass p-5">
            <label className="text-xs font-medium text-slate-400 mb-2 block">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={e => setDob(e.target.value)}
              className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white text-lg font-semibold outline-none focus:border-brand/50 transition-colors"
            />
          </div>

          {age && (
            <div className="grid grid-cols-3 gap-3">
              <div className="glass p-4 text-center">
                <div className="text-3xl font-extrabold gradient-text">{age.years}</div>
                <div className="text-xs text-slate-500 mt-1">Years</div>
              </div>
              <div className="glass p-4 text-center">
                <div className="text-3xl font-extrabold gradient-text">{age.months}</div>
                <div className="text-xs text-slate-500 mt-1">Months</div>
              </div>
              <div className="glass p-4 text-center">
                <div className="text-3xl font-extrabold gradient-text">{age.days}</div>
                <div className="text-xs text-slate-500 mt-1">Days</div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {zodiac && (
            <div className="glass p-5 text-center">
              <div className="text-4xl mb-2">{zodiac.sym}</div>
              <div className="text-lg font-bold text-white">{zodiac.name}</div>
              <div className="text-xs text-slate-500">Zodiac Sign</div>
            </div>
          )}
          {nextBday != null && (
            <div className="glass p-5 text-center">
              <div className="text-3xl font-extrabold text-emerald-400">{nextBday}</div>
              <div className="text-xs text-slate-500 mt-1">days until next birthday</div>
            </div>
          )}
          {age && (
            <div className="glass p-5">
              <div className="text-xs text-slate-500 mb-2">Total Days Lived</div>
              <div className="text-lg font-bold text-white">{age.totalDays.toLocaleString()}</div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
