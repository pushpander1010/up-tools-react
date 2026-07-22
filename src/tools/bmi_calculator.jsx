import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

function calcBMI(weight, height, unit) {
  let w = weight, h = height
  if (unit === 'imperial') {
    w = weight * 0.453592 // lbs to kg
    h = height * 2.54 // inches to cm
  }
  h = h / 100 // cm to m
  if (w <= 0 || h <= 0) return null
  const bmi = w / (h * h)
  let category, color
  if (bmi < 18.5) { category = 'Underweight'; color = '#0ea5e9' }
  else if (bmi < 25) { category = 'Normal'; color = '#22c55e' }
  else if (bmi < 30) { category = 'Overweight'; color = '#f59e0b' }
  else { category = 'Obese'; color = '#ef4444' }
  return { bmi: bmi.toFixed(1), category, color }
}

export default function bmi_calculator() {
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [unit, setUnit] = useState('metric')

  const result = useMemo(() => calcBMI(parseFloat(weight), parseFloat(height), unit), [weight, height, unit])

  return (
    <>
      <Helmet>
        <title>BMI Calculator — Check Body Mass Index</title>
        <meta name="description" content="Calculate your BMI instantly. Supports metric and imperial units." />
        <link rel="canonical" href="https://www.uptools.in/bmi-calculator/" />
      </Helmet>

      <nav className="text-xs text-slate-500 mb-4">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span className="mx-2 text-slate-700">›</span>
        <span className="text-white">BMI Calculator</span>
      </nav>

      <section className="glass p-6 mb-6" style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.08), rgba(17,24,39,0.6))', borderColor: 'rgba(20,184,166,0.2)' }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)' }}>⚖️</div>
          <div>
            <h1 className="text-xl font-bold text-white m-0">BMI Calculator</h1>
            <p className="text-sm text-slate-400 mt-1">Body Mass Index — metric & imperial</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {/* Unit Toggle */}
          <div className="flex gap-2">
            {['metric', 'imperial'].map(u => (
              <button key={u} onClick={() => setUnit(u)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                  unit === u ? 'bg-teal-500/20 border-teal-500/40 text-teal-400' : 'bg-white/4 border-white/6 text-slate-400 hover:text-white'
                }`}>
                {u === 'metric' ? 'Metric (kg/cm)' : 'Imperial (lbs/in)'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass p-5">
              <label className="text-xs font-medium text-slate-400 mb-2 block">Weight ({unit === 'metric' ? 'kg' : 'lbs'})</label>
              <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="0"
                className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white text-lg font-semibold outline-none focus:border-teal-500/50 transition-colors placeholder:text-slate-600" />
            </div>
            <div className="glass p-5">
              <label className="text-xs font-medium text-slate-400 mb-2 block">Height ({unit === 'metric' ? 'cm' : 'inches'})</label>
              <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="0"
                className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white text-lg font-semibold outline-none focus:border-teal-500/50 transition-colors placeholder:text-slate-600" />
            </div>
          </div>
        </div>

        <div className="glass p-5 h-fit sticky top-20 text-center">
          {result ? (
            <>
              <div className="text-5xl font-extrabold mb-2" style={{ color: result.color }}>{result.bmi}</div>
              <div className="text-sm font-bold mb-4" style={{ color: result.color }}>{result.category}</div>
              {/* BMI Meter */}
              <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden mb-4">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((parseFloat(result.bmi) / 40) * 100, 100)}%`, background: result.color }} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Underweight</span>
                <span>Normal</span>
                <span>Overweight</span>
                <span>Obese</span>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-500 py-8">Enter weight and height</p>
          )}
        </div>
      </div>
    </>
  )
}
