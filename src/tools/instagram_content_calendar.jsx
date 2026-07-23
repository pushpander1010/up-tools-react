import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const NICHES = {
  fitness: { emoji: '💪', label: 'Fitness' },
  food: { emoji: '🍕', label: 'Food & Cooking' },
  travel: { emoji: '✈️', label: 'Travel' },
  fashion: { emoji: '👗', label: 'Fashion' },
  tech: { emoji: '💻', label: 'Tech' },
  business: { emoji: '💼', label: 'Business' },
  lifestyle: { emoji: '🌟', label: 'Lifestyle' },
  photography: { emoji: '📸', label: 'Photography' },
  education: { emoji: '📚', label: 'Education' },
  entertainment: { emoji: '🎬', label: 'Entertainment' },
}

const CONTENT_TYPES = ['Carousel', 'Reel', 'Story', 'Single Post', 'Poll/Quiz', 'Behind the Scenes']

const TOPICS = {
  fitness: ['Workout of the Day', 'Meal Prep Tips', 'Progress Check-in', 'Exercise Tutorial', 'Motivation Monday', 'Form Correction', 'Rest Day Advice', 'Supplement Review', 'Transformation Story', 'Q&A Session', 'Gym Hacks', 'Stretching Routine'],
  food: ['Recipe of the Week', 'Kitchen Hack', 'Ingredient Spotlight', 'Restaurant Review', 'Meal Prep Sunday', 'Food Photography Tip', 'Cultural Dish Story', 'Quick Snack Idea', 'Grocery Haul', 'Cooking Fail', 'Seasonal Recipe', 'Taste Test'],
  travel: ['Destination Guide', 'Budget Tip', 'Hidden Gem', 'Travel Diary', 'Packing List', 'Local Food Review', 'Photo Spot Guide', 'Travel Mistake', 'Itinerary Share', 'Cultural Insight', 'Hotel Review', 'Travel Challenge'],
  fashion: ['OOTD', 'Style Tip', 'Closet Organization', 'Trend Alert', 'Outfit Breakdown', 'Thrift Haul', 'Seasonal Transition', 'Accessory Feature', 'Color Theory', 'Fashion History', 'Brand Spotlight', 'Style Challenge'],
  tech: ['App Review', 'Tech Tip', 'Gadget Unboxing', 'Coding Tutorial', 'Industry News', 'Productivity Hack', 'AI Tool Review', 'Setup Tour', 'Comparison Post', 'Quick Fix', 'Career Advice', 'Future Trends'],
  business: ['Business Tip', 'Revenue Report', 'Client Testimonial', 'Behind the Scenes', 'Lessons Learned', 'Tool Recommendation', 'Growth Strategy', 'Networking Tip', 'Motivation', 'Market Trend', 'Case Study', 'FAQ Answer'],
  lifestyle: ['Daily Routine', 'Self-Care Tip', 'Home Decor', 'Book Recommendation', 'Gratitude Post', 'Life Hack', 'Seasonal Activity', 'Relationship Advice', 'Wellness Tip', 'Goal Setting', 'Mindfulness', 'Weekend Vibe'],
  photography: ['Photo Tip', 'Editing Tutorial', 'Gear Review', 'Composition Guide', 'Lighting Setup', 'Before & After', 'Location Scout', 'Portfolio Share', 'Client Work', 'Challenge Entry', 'Color Grading', 'Lens Comparison'],
  education: ['Quick Lesson', 'Study Tip', 'Book Summary', 'Concept Explained', 'Tutorial', 'Myth Busting', 'Resource Share', 'Exam Prep', 'Career Guidance', 'Industry Insight', 'Skill Building', 'Student Success'],
  entertainment: ['Movie Review', 'Show Recommendation', 'Music Discovery', 'Meme Post', 'Fan Theory', 'Pop Culture Take', 'Behind the Scenes', 'Review Roundup', 'Challenge Video', 'Nostalgia Post', 'Fan Art Feature', 'Cast Spotlight'],
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function generateCalendar(niche) {
  const topics = TOPICS[niche] || TOPICS.lifestyle
  return DAYS.map((day, i) => ({
    day,
    topic: topics[i % topics.length],
    type: CONTENT_TYPES[i % CONTENT_TYPES.length],
    time: ['9:00 AM', '12:00 PM', '6:00 PM', '11:00 AM', '3:00 PM', '10:00 AM', '7:00 PM'][i],
    caption: `💡 ${topics[i % topics.length]} — Stay tuned! #${niche} #contentcreator #instagramtips`,
  }))
}

export default function instagram_content_calendar() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [niche, setNiche] = useState('fitness')
  const [calendar, setCalendar] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleGenerate = useCallback(() => {
    setCalendar(generateCalendar(niche))
    jumpTo()
  }, [niche, jumpTo])

  const copyAll = () => {
    if (!calendar) return
    const text = calendar.map(c => `${c.day}: ${c.topic} (${c.type}) at ${c.time}\nCaption: ${c.caption}`).join('\n\n')
    navigator.clipboard.writeText(text)
    setCopied(true); setTimeout(() => setCopied(false), 1500)
  }

  return (
    <ToolLayout
      title="Instagram Content Calendar"
      desc="Generate a weekly content calendar with post ideas, types, and captions for your niche."
      icon="📅" iconBg="rgba(245,158,11,0.08)"
      category="social" slug="instagram-content-calendar"
      faq={[
        { q: "How often should I post?", a: "Aim for 3-5 posts per week plus daily stories. Consistency matters more than frequency." },
        { q: "What's the best time to post?", a: "Generally 9-11 AM and 6-9 PM in your audience's timezone. Use Instagram Insights to find your specific best times." },
        { q: "How do I use this calendar?", a: "Select your niche, generate the calendar, and use the ideas as a starting point. Customize topics and captions to match your brand voice." },
      ]}
      howItWorks={[
        'Select your content niche from the dropdown.',
        'Click Generate to create a 7-day content plan.',
        'Copy the calendar and customize ideas for your brand.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Instagram Content Calendar", "applicationCategory": "SocialNetworkingApplication",
        "url": "https://www.uptools.in/instagram-content-calendar/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <label className="block text-sm font-semibold text-slate-300">Select your niche</label>
          <select value={niche} onChange={e => setNiche(e.target.value)}
            className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]">
            {Object.entries(NICHES).map(([k, v]) => (
              <option key={k} value={k} className="bg-gray-900">{v.emoji} {v.label}</option>
            ))}
          </select>
          <button onClick={handleGenerate}
            className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
            📅 Generate Calendar
          </button>
        </div>

        {calendar && (
          <div ref={resultRef} className="space-y-4" style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <button onClick={copyAll}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/[0.08] text-slate-400 hover:text-white'}`}>
              {copied ? '✓ Copied' : '📋 Copy All'}
            </button>

            <div className="space-y-3">
              {calendar.map((c, i) => (
                <div key={i} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-extrabold text-white">{c.day}</span>
                      <span className="px-2 py-0.5 rounded-lg bg-indigo-500/15 text-indigo-400 text-xs font-bold">{c.type}</span>
                    </div>
                    <span className="text-xs text-slate-500">⏰ {c.time}</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-300 mb-2">{c.topic}</div>
                  <div className="text-xs text-slate-500 bg-black/20 rounded-xl p-3 font-mono">{c.caption}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!calendar && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📅</div>
            <p className="text-sm text-slate-600 font-medium">Select a niche and generate your content calendar</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
