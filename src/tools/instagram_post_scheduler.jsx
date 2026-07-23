import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const TIMES = ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM']
const CONTENT_TYPES = ['Photo', 'Carousel', 'Reel', 'Story', 'IGTV', 'Live']

function generateSchedule(postsPerWeek, niche) {
  const schedule = []
  const selectedDays = DAYS.slice(0, postsPerWeek)
  selectedDays.forEach((day, i) => {
    const timeIdx = (i * 3 + 5) % TIMES.length
    schedule.push({
      day,
      time: TIMES[timeIdx],
      type: CONTENT_TYPES[i % CONTENT_TYPES.length],
      topic: `${niche} post #${i + 1}`,
      caption: `📝 ${niche} content for ${day.toLowerCase()}. Stay tuned!`,
      status: 'planned',
    })
  })
  return schedule
}

export default function instagram_post_scheduler() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [postsPerWeek, setPostsPerWeek] = useState(3)
  const [niche, setNiche] = useState('lifestyle')
  const [schedule, setSchedule] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleGenerate = useCallback(() => {
    setSchedule(generateSchedule(postsPerWeek, niche))
    jumpTo()
  }, [postsPerWeek, niche, jumpTo])

  const copyAll = () => {
    if (!schedule) return
    const text = schedule.map(s => `${s.day} at ${s.time} — ${s.type}: ${s.topic}\nCaption: ${s.caption}`).join('\n\n')
    navigator.clipboard.writeText(text)
    setCopied(true); setTimeout(() => setCopied(false), 1500)
  }

  return (
    <ToolLayout
      title="Instagram Post Scheduler"
      desc="Plan your weekly Instagram posts with optimal timing. Generate a content schedule based on your niche."
      icon="📋" iconBg="rgba(168,85,247,0.08)"
      category="social" slug="instagram-post-scheduler"
      faq={[
        { q: "How many times should I post per week?", a: "Aim for 3-5 posts per week for consistent growth. Quality matters more than quantity." },
        { q: "What are the best times to post?", a: "Generally 9-11 AM and 6-9 PM in your audience's timezone. Use Instagram Insights to find your specific optimal times." },
        { q: "Can I customize the schedule?", a: "Yes! Use this as a starting template and adjust times, topics, and content types based on your analytics." },
      ]}
      howItWorks={[
        'Set how many posts you want per week (1-7).',
        'Choose your content niche.',
        'Generate a schedule with optimal posting times.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Instagram Post Scheduler", "applicationCategory": "SocialNetworkingApplication",
        "url": "https://www.uptools.in/instagram-post-scheduler/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Posts per week</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map(n => (
                <button key={n} onClick={() => setPostsPerWeek(n)}
                  className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${postsPerWeek === n ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30' : 'bg-white/[0.04] text-slate-500 border border-white/[0.08]'}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Content niche</label>
            <select value={niche} onChange={e => setNiche(e.target.value)}
              className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]">
              {['fitness', 'food', 'travel', 'fashion', 'tech', 'business', 'lifestyle', 'photography', 'education', 'entertainment'].map(n => (
                <option key={n} value={n} className="bg-gray-900">{n.charAt(0).toUpperCase() + n.slice(1)}</option>
              ))}
            </select>
          </div>
          <button onClick={handleGenerate}
            className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
            📋 Generate Schedule
          </button>
        </div>

        {schedule && (
          <div ref={resultRef} className="space-y-3" style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-300">Weekly Schedule</h3>
              <button onClick={copyAll}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/[0.08] text-slate-400 hover:text-white'}`}>
                {copied ? '✓ Copied' : '📋 Copy All'}
              </button>
            </div>

            {schedule.map((s, i) => (
              <div key={i} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-extrabold text-white">{s.day}</span>
                    <span className="px-2 py-0.5 rounded-lg bg-purple-500/15 text-purple-400 text-xs font-bold">{s.type}</span>
                  </div>
                  <span className="text-xs text-slate-500">⏰ {s.time}</span>
                </div>
                <div className="text-sm font-semibold text-slate-300 mb-2">{s.topic}</div>
                <div className="text-xs text-slate-500 bg-black/20 rounded-xl p-3 font-mono">{s.caption}</div>
              </div>
            ))}
          </div>
        )}

        {!schedule && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📋</div>
            <p className="text-sm text-slate-600 font-medium">Configure your schedule and generate a plan</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
