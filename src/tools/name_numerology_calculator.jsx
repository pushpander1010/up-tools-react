import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const PYTHAGOREAN = { a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,j:1,k:2,l:3,m:4,n:5,o:6,p:7,q:8,r:9,s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8 }
const CHALDEAN = { a:1,b:2,c:3,d:4,e:5,f:8,h:5,i:1,j:1,k:2,l:3,m:4,n:5,o:7,p:8,q:1,r:2,s:3,t:4,v:6,w:6,x:5,y:1,z:7 }

const PERSONALITY = {
  1: { title: 'The Leader', desc: 'Independent, ambitious, and born to blaze trails. Natural authority.' },
  2: { title: 'The Diplomat', desc: 'Cooperative, sensitive, and peace-loving. The peacemaker.' },
  3: { title: 'The Creative', desc: 'Expressive, optimistic, and artistic. A joyful communicator.' },
  4: { title: 'The Builder', desc: 'Practical, hardworking, and disciplined. Rock-solid reliability.' },
  5: { title: 'The Adventurer', desc: 'Versatile, curious, and freedom-loving. Thrives on change.' },
  6: { title: 'The Nurturer', desc: 'Responsible, loving, and family-oriented. The heart of the home.' },
  7: { title: 'The Thinker', desc: 'Analytical, introspective, and spiritual. Seeks deeper truth.' },
  8: { title: 'The Achiever', desc: 'Ambitious, confident, and material-savvy. Driven by success.' },
  9: { title: 'The Humanitarian', desc: 'Compassionate, idealistic, and selfless. Wants to heal the world.' },
}

function reduceToDigit(n) { while (n > 9 && n !== 11 && n !== 22) n = String(n).split('').reduce((s, d) => s + Number(d), 0); return n }
function sumDigits(arr) { return arr.reduce((s, n) => s + n, 0) }
function calcPythagorean(name) {
  return name.toLowerCase().replace(/[^a-z]/g, '').split('').map(c => PYTHAGOREAN[c] || 0)
}
function calcChaldean(name) {
  return name.toLowerCase().replace(/[^a-z]/g, '').split('').map(c => CHALDEAN[c] || 0)
}
function destinyFromDOB(dob) {
  const digits = dob.replace(/-/g, '').split('').map(Number)
  return reduceToDigit(digits.reduce((s, d) => s + d, 0))
}

export default function name_numerology_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [result, setResult] = useState(null)

  const calculate = useCallback(() => {
    const trimmed = name.trim()
    if (!trimmed) return
    const pythValues = calcPythagorean(trimmed)
    const chalValues = calcChaldean(trimmed)
    const pythRaw = sumDigits(pythValues)
    const chalRaw = sumDigits(chalValues)
    const pythNum = reduceToDigit(pythRaw)
    const chalNum = reduceToDigit(chalRaw)
    const destiny = dob ? destinyFromDOB(dob) : null
    setResult({ pythValues, chalValues, pythRaw, chalRaw, pythNum, chalNum, destiny })
    setTimeout(() => jumpTo(), 50)
  }, [name, dob])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Name Numerology Calculator"
      desc="Discover your Pythagorean and Chaldean numerology numbers from your name, plus destiny number from birthdate."
      icon="⭐" iconBg="rgba(250,204,21,0.08)"
      category="fun" slug="name-numerology-calculator"
      faq={[
        { q: "What is Pythagorean numerology?", a: "Pythagorean numerology maps letters A–I to 1–9, then J–R repeats 1–9, and S–Z follows. Your name number is the sum of these values reduced to a single digit." },
        { q: "How is Chaldean different from Pythagorean?", a: "Chaldean numerology uses a 1–8 mapping (number 9 is sacred and excluded). It values the name you're commonly called rather than your birth name." },
        { q: "What is a destiny number?", a: "The destiny (or life path) number is derived from your full birthdate — month + day + year digits summed and reduced to a single digit. It reveals your life purpose." },
        { q: "How do I use this Name Numerology Calculator online free?", a: "Enter your name (and optionally birthdate) above and click Calculate. Free, no sign-up, works on any device." },
      ]}
      howItWorks={[
        "Enter your full name in the field above.",
        "Optionally add your birthdate for a destiny number.",
        "Click Calculate — the tool maps each letter to Pythagorean and Chaldean values.",
        "View your reduced name numbers for both systems with personality descriptions.",
        "If a birthdate was provided, your destiny number and meaning appear too.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Name Numerology Calculator", "applicationCategory": "LifestyleApplication",
        "operatingSystem": "WebBrowser",
        "url": "https://www.uptools.in/name-numerology-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Birthdate <span className="text-slate-600">(optional)</span></label>
            <input type="date" value={dob} onChange={(e) => setDob(e.target.value)}
              className={inputClass} />
          </div>
        </div>

        <button onClick={calculate}
          className="w-full py-4 rounded-2xl bg-yellow-500 text-black font-bold text-sm hover:bg-yellow-400 transition-all duration-200 active:scale-[0.98]">
          Calculate
        </button>

        {result ? (
          <div ref={resultRef} className="space-y-4"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>

            {/* Pythagorean */}
            <div className="rounded-3xl border-2 border-yellow-500/15 bg-gradient-to-br from-yellow-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-wider">Pythagorean System</h3>
              </div>
              <div className="text-center mb-4">
                <div className="text-6xl font-black text-white mb-1">{result.pythNum}</div>
                <div className="text-sm text-slate-400">Letter values: {result.pythValues.join(' + ')} = {result.pythRaw} → {result.pythNum}</div>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/5">
                <div className="font-bold text-indigo-400 mb-1">{PERSONALITY[result.pythNum]?.title}</div>
                <div className="text-sm text-slate-400">{PERSONALITY[result.pythNum]?.desc}</div>
              </div>
            </div>

            {/* Chaldean */}
            <div className="rounded-3xl border-2 border-yellow-500/15 bg-gradient-to-br from-yellow-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-wider">Chaldean System</h3>
              </div>
              <div className="text-center mb-4">
                <div className="text-6xl font-black text-white mb-1">{result.chalNum}</div>
                <div className="text-sm text-slate-400">Letter values: {result.chalValues.join(' + ')} = {result.chalRaw} → {result.chalNum}</div>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/5">
                <div className="font-bold text-indigo-400 mb-1">{PERSONALITY[result.chalNum]?.title}</div>
                <div className="text-sm text-slate-400">{PERSONALITY[result.chalNum]?.desc}</div>
              </div>
            </div>

            {/* Destiny */}
            {result.destiny !== null && (
              <div className="rounded-3xl border-2 border-yellow-500/15 bg-gradient-to-br from-yellow-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                  <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-wider">Destiny Number (from birthdate)</h3>
                </div>
                <div className="text-center mb-4">
                  <div className="text-6xl font-black text-white mb-1">{result.destiny}</div>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/5">
                  <div className="font-bold text-indigo-400 mb-1">{PERSONALITY[result.destiny]?.title}</div>
                  <div className="text-sm text-slate-400">{PERSONALITY[result.destiny]?.desc}</div>
                </div>
              </div>
            )}

            {/* Quick reference */}
            <div className="rounded-3xl border-2 border-white/8 bg-white/[0.02] p-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Number Meanings</h3>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(PERSONALITY).map(([num, v]) => (
                  <div key={num} className="text-center p-2 rounded-lg bg-white/[0.03]">
                    <div className="text-lg font-bold text-white">{num}</div>
                    <div className="text-xs text-slate-500">{v.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">⭐</div>
            <p className="text-sm text-slate-600 font-medium">Enter your name and click Calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
