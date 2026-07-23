import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const CATEGORIES = {
  engagement: { emoji: '💬', label: 'Engagement', ideas: [
    'This or That poll — pick between two options',
    'Ask Me Anything — let followers ask questions',
    'Rate my [outfit/room/setup] — slider sticker',
    'Caption this photo — creative writing challenge',
    'Guess the song/movie — trivia game',
    'Fill in the blank — complete the sentence',
    'Would you rather — fun dilemma choices',
    'Two truths and a lie — get to know you game',
    'Emoji reaction — how do you feel about...',
    'Quiz time — test your knowledge',
  ]},
  behindScenes: { emoji: '🎬', label: 'Behind the Scenes', ideas: [
    'My morning routine — day in the life',
    'Workspace tour — where the magic happens',
    'How I edit my photos/videos — process reveal',
    'Bloopers and fails — authentic moments',
    'A day in my life — hourly snapshots',
    'My creative process — from idea to post',
    'Unboxing something exciting — reaction',
    'What\'s in my bag — everyday essentials',
    'My setup tour — gear and workspace',
    'Preparing for [event] — countdown',
  ]},
  educational: { emoji: '📚', label: 'Educational', ideas: [
    'Quick tip — share a useful hack',
    'Myth vs Fact — debunk common misconceptions',
    'Step-by-step tutorial — teach something',
    'Tools I use — share your favorite apps/gear',
    'Beginner\'s guide — explain a concept simply',
    'Common mistakes — what to avoid',
    'Before & After — show transformation',
    'FAQ answers — respond to common questions',
    'Industry insight — share your expertise',
    'Resource roundup — list helpful links/books',
  ]},
  personal: { emoji: '🌟', label: 'Personal', ideas: [
    'Gratitude post — what you\'re thankful for',
    'Current mood — share how you\'re feeling',
    'Favorite thing right now — recommendation',
    'Throwback — share a memory',
    'Goals update — progress check-in',
    'Weekend vibes — what you\'re up to',
    'Small wins — celebrate achievements',
    'Current favorites — books/shows/music',
    'Self-care Sunday — wellness tips',
    'Monthly recap — highlights of the month',
  ]},
  trending: { emoji: '🔥', label: 'Trending', ideas: [
    'Take on a viral trend — put your spin on it',
    'Duet/Stitch a popular post — add your take',
    'Challenge participation — join a community challenge',
    'Meme format — use a trending template',
    'Sound trend — use a trending audio',
    'Hashtag challenge — create your own',
    'Collaboration — partner with another creator',
    'Seasonal content — tie into current events',
    'React to news — share your perspective',
    'Flashback trend — recreate an old post',
  ]},
}

export default function instagram_story_ideas_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [category, setCategory] = useState('engagement')
  const [ideas, setIdeas] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleGenerate = useCallback(() => {
    const cat = CATEGORIES[category]
    setIdeas(cat.ideas.map((idea, i) => ({
      text: idea,
      type: cat.label,
      emoji: cat.emoji,
      number: i + 1,
    })))
    jumpTo()
  }, [category, jumpTo])

  const copyAll = () => {
    if (!ideas) return
    const text = ideas.map(i => `${i.number}. ${i.text}`).join('\n')
    navigator.clipboard.writeText(text)
    setCopied(true); setTimeout(() => setCopied(false), 1500)
  }

  const copyIdea = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true); setTimeout(() => setCopied(false), 1500)
  }

  return (
    <ToolLayout
      title="Instagram Story Ideas Generator"
      desc="Get 10 fresh story ideas for any niche. Never run out of content with categorized prompts."
      icon="💡" iconBg="rgba(168,85,247,0.08)"
      category="social" slug="instagram-story-ideas-generator"
      faq={[
        { q: "How many stories should I post daily?", a: "Aim for 3-7 stories per day. Too few won't engage; too many may cause fatigue. Consistency is key." },
        { q: "What makes a good Instagram story?", a: "Stories that spark interaction (polls, questions), provide value (tips, tutorials), or show authenticity (behind-the-scenes) tend to perform best." },
        { q: "Can I use these ideas for Reels too?", a: "Absolutely! Most story ideas translate well to Reels. Just adapt the format to be more polished and add trending audio." },
      ]}
      howItWorks={[
        'Choose a category: Engagement, Behind the Scenes, Educational, Personal, or Trending.',
        'Click Generate to get 10 curated story ideas.',
        'Copy individual ideas or the full list to use in your content plan.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Instagram Story Ideas Generator", "applicationCategory": "SocialNetworkingApplication",
        "url": "https://www.uptools.in/instagram-story-ideas-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <label className="block text-sm font-semibold text-slate-300">Choose a category</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(CATEGORIES).map(([k, v]) => (
              <button key={k} onClick={() => setCategory(k)}
                className={`p-3 rounded-xl text-sm font-bold transition-all text-center ${category === k ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30' : 'bg-white/[0.04] text-slate-500 border border-white/[0.08] hover:text-white'}`}>
                {v.emoji} {v.label}
              </button>
            ))}
          </div>
          <button onClick={handleGenerate}
            className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
            💡 Generate Ideas
          </button>
        </div>

        {ideas && (
          <div ref={resultRef} className="space-y-3" style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                {CATEGORIES[category].emoji} {CATEGORIES[category].label} Ideas
              </h3>
              <button onClick={copyAll}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/[0.08] text-slate-400 hover:text-white'}`}>
                {copied ? '✓ Copied' : '📋 Copy All'}
              </button>
            </div>

            {ideas.map((idea, i) => (
              <div key={i}
                className="flex items-center gap-3 p-4 bg-white/[0.06] border border-white/[0.08] rounded-2xl hover:bg-white/[0.08] transition-all group cursor-pointer"
                onClick={() => copyIdea(idea.text)}>
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm shrink-0">
                  {idea.number}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white">{idea.text}</div>
                  <div className="text-xs text-slate-500 mt-0.5">Click to copy</div>
                </div>
                <div className="text-lg opacity-0 group-hover:opacity-100 transition-opacity">📋</div>
              </div>
            ))}
          </div>
        )}

        {!ideas && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">💡</div>
            <p className="text-sm text-slate-600 font-medium">Select a category and generate story ideas</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
