import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'
import useAIStream from '../hooks/useAIStream'

const PRESETS = [
  { label: '🏖️ Beach Paradise', destination: 'Bali, Indonesia', interests: 'beaches, temples, nightlife', notes: 'Budget-friendly trip for 2 weeks' },
  { label: '🏔️ Mountain Trek', destination: 'Swiss Alps', interests: 'hiking, scenic trains, cheese', notes: 'Summer trip, moderate budget' },
  { label: '🗼 City Break', destination: 'Tokyo, Japan', interests: 'food, tech, anime, temples', notes: 'First time in Japan, 10 days' },
]

export default function ai_travel_planner() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const { output, status, streaming, generate, stop } = useAIStream()
  const [copied, setCopied] = useState(false)

  const [destination, setDestination] = useState('')
  const [days, setDays] = useState('5')
  const [budget, setBudget] = useState('medium')
  const [pace, setPace] = useState('balanced')
  const [interests, setInterests] = useState('')
  const [notes, setNotes] = useState('')

  const applyPreset = (p) => {
    setDestination(p.destination)
    setInterests(p.interests)
    setNotes(p.notes)
  }

  const handleGenerate = useCallback(() => {
    if (!destination.trim()) return

    const prompt = `Create a realistic ${days}-day travel itinerary.

Destination: ${destination}
Budget: ${budget}
Pace: ${pace}
Interests: ${interests || 'General sightseeing'}
Notes: ${notes || 'No extra notes'}

Requirements:
- Organize by day with morning, afternoon and evening.
- Keep recommendations practical and geographically sensible.
- Mention one signature food or local experience per day when appropriate.
- Include one short budget tip and one transport tip near the end.
- Avoid claiming live prices or opening hours.
- Output in clean markdown with headings and bullet points.`

    generate({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      systemPrompt: 'You are a pragmatic travel planner who creates realistic itineraries.',
    })
    jumpTo()
  }, [destination, days, budget, pace, interests, notes, generate, jumpTo])

  const copy = () => {
    if (!output) return
    navigator.clipboard.writeText(output).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) })
  }

  const inputClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600"
  const selectClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"

  return (
    <ToolLayout
      title="AI Travel Planner"
      desc="Get a personalized day-by-day travel itinerary with AI. Enter your destination, budget, and interests."
      icon="✈️" iconBg="rgba(6,182,212,0.08)"
      category="ai" slug="ai-travel-planner"
      faq={[
        { q: "Are the prices accurate?", a: "No — the tool provides general guidance. Always check current prices before booking." },
        { q: "Can I customize the itinerary?", a: "Yes — add notes about preferences, dietary restrictions, accessibility needs, etc." },
      ]}
      howItWorks={[
        "Enter your destination, trip length, and budget level.",
        "Add your interests and any special notes.",
        "Click Generate to get a complete day-by-day itinerary.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "AI Travel Planner", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/ai-travel-planner/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Presets */}
        <div className="flex gap-2 flex-wrap">
          {PRESETS.map(p => (
            <button key={p.label} onClick={() => applyPreset(p)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">
              {p.label}
            </button>
          ))}
        </div>

        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Destination *</label>
            <input type="text" value={destination} onChange={e => setDestination(e.target.value)}
              placeholder="e.g. Bali, Indonesia" className={inputClass} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Days</label>
              <select value={days} onChange={e => setDays(e.target.value)} className={selectClass}>
                {['2', '3', '5', '7', '10', '14'].map(d => <option key={d}>{d} days</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Budget</label>
              <select value={budget} onChange={e => setBudget(e.target.value)} className={selectClass}>
                <option>budget</option><option>medium</option><option>luxury</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Pace</label>
              <select value={pace} onChange={e => setPace(e.target.value)} className={selectClass}>
                <option>relaxed</option><option>balanced</option><option>packed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Interests</label>
            <input type="text" value={interests} onChange={e => setInterests(e.target.value)}
              placeholder="e.g. food, history, beaches, hiking" className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Notes (optional)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
              placeholder="e.g. Traveling with kids, vegetarian, first time visiting" className={inputClass + ' resize-none'} />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {streaming ? (
            <button onClick={stop} className="flex-1 px-6 py-3 rounded-xl text-sm font-bold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all">⏹ Stop</button>
          ) : (
            <button onClick={handleGenerate} disabled={!destination.trim()}
              className="flex-1 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>✨ Generate Itinerary</button>
          )}
          <button onClick={copy} disabled={!output} className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all disabled:opacity-40 ${copied ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/[0.06] border-white/[0.08] text-slate-400 hover:text-white'}`}>
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
        </div>

        {status && <div className={`p-3 rounded-xl text-sm ${status.includes('Error') ? 'bg-red-500/10 border border-red-500/20 text-red-400' : status.includes('Done') ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-white/[0.06] border border-white/[0.08] text-slate-400'}`}>{status}</div>}

        <div ref={resultRef} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          {output ? (
            <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">{output}</pre>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-3 opacity-20">✈️</div>
              <p className="text-sm text-slate-600 font-medium">Enter a destination and click Generate</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
