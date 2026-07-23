import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'

const STORY_IDEAS = {
  daily: [
    { title: 'Morning Routine', desc: 'Show your morning coffee, breakfast, and getting ready', tags: ['lifestyle', 'routine'] },
    { title: 'Workout Session', desc: 'Share your gym session or home workout', tags: ['fitness', 'health'] },
    { title: 'What I Ate Today', desc: 'Document all your meals throughout the day', tags: ['food', 'lifestyle'] },
    { title: 'Study/Work Setup', desc: 'Show your desk, tools, and productivity tips', tags: ['productivity', 'work'] }
  ],
  fun: [
    { title: 'Filter Challenge', desc: 'Try 10 different Snapchat filters in one story', tags: ['challenge', 'filters'] },
    { title: 'Pet Takeover', desc: "Let your pet 'take over' your story for a day", tags: ['pets', 'funny'] },
    { title: 'Throwback Thursday', desc: 'Share old photos with current reactions', tags: ['nostalgia', 'memories'] },
    { title: 'Rate My Outfit', desc: 'Ask followers to rate your outfit choices', tags: ['fashion', 'poll'] }
  ],
  creative: [
    { title: 'Time-Lapse Art', desc: 'Create art and show the process in time-lapse', tags: ['art', 'creative'] },
    { title: 'Recipe Tutorial', desc: 'Quick cooking tutorial with step-by-step snaps', tags: ['food', 'tutorial'] },
    { title: 'DIY Project', desc: 'Show a DIY project from start to finish', tags: ['diy', 'creative'] },
    { title: 'Photography Tips', desc: 'Share your best photo spots and techniques', tags: ['photography', 'tips'] }
  ],
  challenge: [
    { title: '24-Hour Challenge', desc: "Document a 24-hour challenge you're doing", tags: ['challenge', 'vlog'] },
    { title: 'No Phone Challenge', desc: 'Go phone-free and document the experience', tags: ['challenge', 'lifestyle'] },
    { title: 'Try Not to Laugh', desc: 'Watch funny videos and try not to laugh', tags: ['challenge', 'funny'] },
    { title: 'Accent Challenge', desc: 'Try speaking in different accents', tags: ['challenge', 'fun'] }
  ]
}

const CATEGORIES = [
  { key: 'all', label: '🎯 All' },
  { key: 'daily', label: '📅 Daily Life' },
  { key: 'fun', label: '🎉 Fun' },
  { key: 'creative', label: '🎨 Creative' },
  { key: 'challenge', label: '🏆 Challenge' }
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function snapchat_story_ideas() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [ideas, setIdeas] = useState([])

  const generate = useCallback(() => {
    let pool = []
    if (activeCategory === 'all') {
      Object.values(STORY_IDEAS).forEach(cat => pool.push(...cat))
    } else {
      pool = STORY_IDEAS[activeCategory] || []
    }
    setIdeas(shuffle(pool).slice(0, 5))
  }, [activeCategory])

  // Generate on first load
  const [initialized, setInitialized] = useState(false)
  if (!initialized) { generate(); setInitialized(true) }

  return (
    <ToolLayout
      title="Snapchat Story Ideas Generator"
      desc="Generate creative Snapchat story ideas. Never run out of content inspiration!"
      icon="👻" iconBg="rgba(250,204,21,0.08)"
      category="social" slug="snapchat-story-ideas"
      faq={[
        { q: 'What makes a good Snapchat story?', a: 'Good Snapchat stories are authentic, engaging, and tell a narrative. Use a mix of photos, videos, text, and stickers. Keep it under 10 snaps.' },
        { q: 'How often should I post Snapchat stories?', a: 'Post 1-3 times daily for best engagement. Consistency matters more than frequency.' },
        { q: 'What are trending Snapchat story ideas?', a: 'Trending ideas include: day-in-the-life, behind-the-scenes, Q&A sessions, polls, challenges, tutorials, and reaction videos.' }
      ]}
      howItWorks={[
        'Select a category (All, Daily Life, Fun, Creative, or Challenge).',
        'Click "Generate New Ideas" to get fresh story prompts.',
        'Use the ideas as inspiration for your next Snapchat story.'
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Snapchat Story Ideas Generator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/snapchat-story-ideas/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Category Selector */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button key={cat.key} onClick={() => { setActiveCategory(cat.key); generate() }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border-2 ${
                activeCategory === cat.key
                  ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                  : 'bg-white/[0.06] border-white/8 text-slate-500 hover:border-white/15'
              }`}>
              {cat.label}
            </button>
          ))}
        </div>

        <button onClick={generate}
          className="w-full py-4 rounded-2xl bg-yellow-500 text-black font-bold text-sm hover:bg-yellow-400 transition-all duration-200 active:scale-[0.98]">
          ✨ Generate New Ideas
        </button>

        {/* Ideas Grid */}
        <div className="space-y-3">
          {ideas.map((idea, i) => (
            <div key={`${activeCategory}-${i}`}
              className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-5 hover:border-yellow-500/20 transition-all"
              style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)', animationDelay: `${i * 60}ms` }}>
              <h3 className="text-white font-bold text-sm mb-1">{idea.title}</h3>
              <p className="text-slate-400 text-xs mb-3">{idea.desc}</p>
              <div className="flex gap-2 flex-wrap">
                {idea.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-lg bg-white/[0.06] text-[10px] text-slate-500 font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  )
}
