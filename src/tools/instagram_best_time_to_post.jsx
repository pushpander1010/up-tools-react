import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const TIME_DATA = [
  { audience: 'General Audience', icon: '📱', times: 'Mon–Fri: 11 AM–1 PM, 7 PM–9 PM', engagement: '+35%', days: 'Monday – Friday' },
  { audience: 'Business/Professional', icon: '💼', times: 'Tue–Thu: 8 AM–10 AM, 5 PM–6 PM', engagement: '+42%', days: 'Tuesday – Thursday' },
  { audience: 'Creative/Design', icon: '🎨', times: 'Wed–Fri: 10 AM–12 PM, 6 PM–8 PM', engagement: '+38%', days: 'Wednesday – Friday' },
  { audience: 'Gaming/Entertainment', icon: '🎮', times: 'Thu–Sat: 6 PM–10 PM', engagement: '+45%', days: 'Thursday – Saturday' },
  { audience: 'Food/Lifestyle', icon: '🍔', times: 'Mon–Fri: 12 PM–1 PM, 7 PM–8 PM', engagement: '+40%', days: 'Monday – Friday' },
]

const WEEKLY_GRID = [
  { day: 'Mon', morning: 40, afternoon: 60, evening: 75 },
  { day: 'Tue', morning: 55, afternoon: 65, evening: 70 },
  { day: 'Wed', morning: 50, afternoon: 70, evening: 80 },
  { day: 'Thu', morning: 45, afternoon: 65, evening: 85 },
  { day: 'Fri', morning: 40, afternoon: 55, evening: 70 },
  { day: 'Sat', morning: 30, afternoon: 50, evening: 65 },
  { day: 'Sun', morning: 25, afternoon: 45, evening: 60 },
]

const TIPS = [
  'Post consistently at the same times',
  'Use Instagram Insights to track your audience activity',
  'Test different posting times and measure engagement',
  'Consider your audience\'s timezone',
  'Post 3-5 times per week for optimal reach',
  'Use Stories to stay active between posts',
  'Engage with comments within the first hour',
]

export default function instagram_best_time_to_post() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [audience, setAudience] = useState(0)

  const selected = TIME_DATA[audience]

  return (
    <ToolLayout
      title="Instagram Best Time to Post"
      desc="Find the optimal times to post on Instagram for maximum reach and engagement based on your audience type."
      icon="⏰" iconBg="rgba(245,158,11,0.08)"
      category="social" slug="instagram-best-time-to-post"
      faq={[
        { q: 'When is the best time to post on Instagram?', a: 'Generally, weekdays between 11 AM–1 PM and 7 PM–9 PM see the highest engagement. However, the best time depends on your specific audience.' },
        { q: 'Should I post at the same time every day?', a: 'Consistency helps your audience know when to expect content. Pick 2-3 optimal time slots and stick with them.' },
      ]}
      howItWorks={[
        'Select your audience type from the options below.',
        'View the recommended posting times and expected engagement boost.',
        'Check the weekly heatmap for day-by-day insights.',
        'Apply these times to your posting schedule.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Instagram Best Time to Post", "applicationCategory": "SocialNetworkingApplication",
        "url": "https://www.uptools.in/instagram-best-time-to-post/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Audience Type Selector */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-3">Your Audience Type</label>
          <div className="space-y-2">
            {TIME_DATA.map((item, i) => (
              <button key={i} onClick={() => { setAudience(i); jumpTo() }}
                className={`w-full text-left rounded-2xl p-4 transition-all duration-200 border-2
                  ${audience === i
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-white/[0.04] border-white/6 hover:border-white/15'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="text-sm font-bold text-white">{item.audience}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{item.times}</div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-amber-400">{item.engagement}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Result */}
        <div ref={resultRef} className="rounded-3xl border-2 border-amber-500/15 bg-gradient-to-br from-amber-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8"
          style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Best Times for {selected.audience}</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-2xl bg-white/[0.04] p-4 text-center">
              <div className="text-2xl font-extrabold text-amber-400">{selected.engagement}</div>
              <div className="text-xs text-slate-500 mt-1">Expected Engagement Boost</div>
            </div>
            <div className="rounded-2xl bg-white/[0.04] p-4 text-center">
              <div className="text-sm font-bold text-white">{selected.days}</div>
              <div className="text-xs text-slate-500 mt-1">Best Days</div>
            </div>
          </div>

          <div className="rounded-2xl bg-black/20 p-4">
            <div className="text-xs text-slate-500 mb-2">Optimal Posting Window</div>
            <div className="text-lg font-bold text-white">{selected.times}</div>
          </div>
        </div>

        {/* Weekly Heatmap */}
        <div>
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Weekly Engagement Heatmap</h3>
          <div className="rounded-2xl bg-white/[0.03] p-4 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-500">
                  <th className="text-left py-2 px-2">Day</th>
                  <th className="py-2 px-2">🌅 Morning</th>
                  <th className="py-2 px-2">☀️ Afternoon</th>
                  <th className="py-2 px-2">🌙 Evening</th>
                </tr>
              </thead>
              <tbody>
                {WEEKLY_GRID.map(row => (
                  <tr key={row.day} className="border-t border-white/5">
                    <td className="py-2 px-2 font-semibold text-white">{row.day}</td>
                    {['morning', 'afternoon', 'evening'].map(period => (
                      <td key={period} className="py-2 px-2 text-center">
                        <div className="inline-block w-12 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
                          style={{
                            background: `rgba(245,158,11,${row[period] / 100})`,
                            color: row[period] > 50 ? '#fff' : '#94a3b8',
                          }}>
                          {row[period]}%
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pro Tips */}
        <div className="rounded-2xl bg-white/[0.03] p-5">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Pro Tips</h3>
          <ul className="space-y-2">
            {TIPS.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                <span className="text-emerald-400 shrink-0">✅</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ToolLayout>
  )
}
