import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const STORY_TEMPLATES = {
  business: [
    { title: 'New Product Launch', text: '🚀 Exciting news!\n\nWe\'re launching something amazing today. Can you guess what it is?\n\n👆 Swipe up to find out!' },
    { title: 'Behind the Scenes', text: '👀 Behind the scenes\n\nThis is how we make the magic happen. Hard work pays off!\n\n💪 #TeamWork' },
    { title: 'Customer Testimonial', text: '💬 What our customers say:\n\n"This changed everything for my business!"\n\n⭐ Thank you for trusting us!' },
    { title: 'Team Spotlight', text: '🌟 Team Spotlight\n\nMeet Sarah, our amazing designer! She\'s the creative genius behind our visuals.\n\n👏 #TeamAppreciation' },
    { title: 'Company Milestone', text: '🎉 Milestone Alert!\n\nWe just hit 10K followers! Thank you for being part of our journey.\n\n❤️ #Grateful' },
  ],
  personal: [
    { title: 'Good Morning', text: '☀️ Good morning!\n\nStarting the day with gratitude and positive vibes. What are you grateful for today?\n\n✨ #GoodVibes' },
    { title: 'Weekend Plans', text: '🎉 Weekend vibes!\n\nPlanning to relax, recharge, and spend time with loved ones. What about you?\n\n💕 #WeekendMood' },
    { title: 'Daily Motivation', text: '💪 Daily reminder:\n\nYou are stronger than you think. Keep pushing forward!\n\n🌟 #Motivation' },
    { title: 'Favorite Things', text: '❤️ Current favorites:\n\n☕ Morning coffee\n📚 Good books\n🎵 Chill music\n\nWhat are yours?' },
    { title: 'Life Update', text: '📱 Life update:\n\nTrying new things, learning every day, and enjoying the journey!\n\n✨ #Growth' },
  ],
  promotional: [
    { title: 'Flash Sale', text: '⚡ FLASH SALE ALERT!\n\n50% OFF everything for the next 24 hours only!\n\n🛒 Shop now before it\'s gone!' },
    { title: 'Limited Offer', text: '🔥 LIMITED TIME OFFER\n\nGet 2 for the price of 1! Only 48 hours left.\n\n⏰ Don\'t miss out!' },
    { title: 'New Collection', text: '✨ NEW COLLECTION DROP\n\nFresh designs, premium quality, unbeatable prices.\n\n👆 Swipe up to shop!' },
    { title: 'Exclusive Deal', text: '🎁 EXCLUSIVE FOR YOU\n\nSpecial discount just for our story viewers!\n\n💫 Use code: STORY20' },
    { title: 'Last Chance', text: '⏰ LAST CHANCE!\n\nSale ends in 6 hours. Don\'t let this opportunity slip away!\n\n🏃‍♀️ Hurry up!' },
  ],
  interactive: [
    { title: 'This or That', text: '🤔 This or That?\n\nCoffee ☕ or Tea 🍵\nBooks 📚 or Movies 🎬\nBeach 🏖️ or Mountains 🏔️\n\nVote in our poll!' },
    { title: 'Ask Me Anything', text: '❓ ASK ME ANYTHING\n\nI\'m here to answer your questions! Drop them below.\n\n💬 Let\'s chat!' },
    { title: 'Rate My Outfit', text: '👗 Rate my outfit!\n\nOn a scale of 1-10, how would you rate today\'s look?\n\n⭐ Use the slider!' },
    { title: 'Guess the Location', text: '📍 Guess where I am!\n\nHint: It\'s somewhere tropical and beautiful!\n\n🌴 Drop your guesses below!' },
    { title: 'Would You Rather', text: '🤷‍♀️ Would you rather...\n\nTravel to the past or future?\nHave the ability to fly or be invisible?\n\n🗳️ Vote now!' },
  ],
  quotes: [
    { title: 'Motivational Quote', text: '✨ Monday Motivation\n\n"The only way to do great work is to love what you do."\n\n- Steve Jobs\n\n💪 #Motivation' },
    { title: 'Inspirational Quote', text: '🌟 Daily Inspiration\n\n"Believe you can and you\'re halfway there."\n\n- Theodore Roosevelt\n\n🚀 #Inspiration' },
    { title: 'Success Quote', text: '🎯 Success Mindset\n\n"Success is not final, failure is not fatal: it is the courage to continue that counts."\n\n- Winston Churchill' },
    { title: 'Life Quote', text: '🌈 Life Wisdom\n\n"Life is 10% what happens to you and 90% how you react to it."\n\n- Charles R. Swindoll' },
    { title: 'Dream Quote', text: '💫 Dream Big\n\n"The future belongs to those who believe in the beauty of their dreams."\n\n- Eleanor Roosevelt' },
  ],
  lifestyle: [
    { title: 'Morning Routine', text: '🌅 Morning Routine:\n\n5 AM - Workout\n7:30 AM - Healthy breakfast\n8 AM - Ready to conquer the day!\n\n💪 #MorningVibes' },
    { title: 'Workspace Tour', text: '🏢 Workspace Wednesday\n\nTake a peek at where the magic happens! Clean desk, good vibes, and lots of coffee.\n\n☕ #WorkspaceGoals' },
    { title: 'Creative Process', text: '🎨 Creative process:\n\n1. Brainstorm ideas\n2. Sketch concepts\n3. Refine and perfect\n4. Share with the world!\n\n✨ #CreativeLife' },
    { title: 'Day in the Life', text: '📱 Day in my life:\n\nMorning coffee → Work sessions → Lunch break → More creativity → Evening wind down\n\n🌙 #DayInTheLife' },
    { title: 'Making Process', text: '👀 How it\'s made:\n\nFrom concept to creation, here\'s the journey of our latest project!\n\n🛠️ #BehindTheScenes' },
  ],
}

const INTERACTIVE_ELEMENTS = [
  { key: 'poll', label: '📊 Poll', suggestion: '\n\n📊 Add a poll: \'Which do you prefer?\'' },
  { key: 'question', label: '❓ Question', suggestion: '\n\n❓ Ask your audience: \'What questions do you have?\'' },
  { key: 'quiz', label: '🧠 Quiz', suggestion: '\n\n🧠 Quiz time: \'Can you guess the answer?\'' },
  { key: 'slider', label: '📏 Slider', suggestion: '\n\n📏 Rate this from 1-10!' },
  { key: 'countdown', label: '⏰ Countdown', suggestion: '\n\n⏰ Countdown to something exciting!' },
  { key: 'location', label: '📍 Location', suggestion: '\n\n📍 Tag your location' },
  { key: 'mention', label: '@ Mention', suggestion: '\n\n@ Mention relevant accounts' },
  { key: 'hashtag', label: '# Hashtag', suggestion: '\n\n# Add relevant hashtags' },
]

export default function instagram_story_templates() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [category, setCategory] = useState('business')
  const [storyText, setStoryText] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [activeElements, setActiveElements] = useState(new Set())
  const [copied, setCopied] = useState(false)

  const selectTemplate = useCallback((tmpl) => {
    setStoryText(tmpl.text)
    setSelectedTemplate(tmpl.title)
    jumpTo()
  }, [jumpTo])

  const toggleElement = useCallback((el) => {
    setActiveElements(prev => {
      const next = new Set(prev)
      if (next.has(el.key)) {
        next.delete(el.key)
        setStoryText(t => t.replace(el.suggestion, ''))
      } else {
        next.add(el.key)
        setStoryText(t => t + el.suggestion)
      }
      return next
    })
  }, [])

  const copyText = useCallback(async () => {
    if (!storyText) return
    try { await navigator.clipboard.writeText(storyText) } catch {
      const ta = document.createElement('textarea'); ta.value = storyText
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [storyText])

  const randomTemplate = useCallback(() => {
    const templates = STORY_TEMPLATES[category] || []
    if (templates.length === 0) return
    const tmpl = templates[Math.floor(Math.random() * templates.length)]
    setStoryText(tmpl.text)
    setSelectedTemplate(tmpl.title)
  }, [category])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Instagram Story Templates"
      desc="Browse ready-made story templates for any occasion. Business, personal, promotional, interactive, and more."
      icon="📱" iconBg="rgba(236,72,153,0.08)"
      category="social" slug="instagram-story-templates"
      faq={[
        { q: 'Can I customize the templates?', a: 'Yes! Select a template to load it into the editor, then modify the text as needed before copying.' },
        { q: 'How do interactive elements work?', a: 'Toggle elements like polls, questions, and quizzes to add engagement prompts to your story text.' },
      ]}
      howItWorks={[
        'Choose a template category (business, personal, etc.).',
        'Click a template to load it into the editor.',
        'Optionally add interactive elements (polls, questions).',
        'Copy the text and paste it into your Instagram story.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Instagram Story Templates", "applicationCategory": "SocialNetworkingApplication",
        "url": "https://www.uptools.in/instagram-story-templates/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Category Selector */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Category</label>
          <div className="flex flex-wrap gap-2">
            {Object.keys(STORY_TEMPLATES).map(cat => (
              <button key={cat} onClick={() => { setCategory(cat); setSelectedTemplate(null) }}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all duration-200 border-2
                  ${category === cat ? 'bg-pink-500/10 border-pink-500/30 text-pink-400' : 'bg-white/[0.04] border-white/8 text-slate-500 hover:border-white/12'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {(STORY_TEMPLATES[category] || []).map((tmpl, i) => (
            <button key={i} onClick={() => selectTemplate(tmpl)}
              className={`text-left rounded-2xl p-4 transition-all duration-200 border-2
                ${selectedTemplate === tmpl.title
                  ? 'bg-pink-500/10 border-pink-500/30'
                  : 'bg-white/[0.04] border-white/6 hover:border-white/15'}`}>
              <div className="text-sm font-bold text-white mb-1">{tmpl.title}</div>
              <div className="text-xs text-slate-500 line-clamp-2">{tmpl.text.substring(0, 60)}...</div>
            </button>
          ))}
        </div>

        {/* Editor */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Story Text</label>
          <textarea value={storyText} onChange={e => setStoryText(e.target.value)}
            placeholder="Select a template above or write your own story text..."
            rows={6} className={inputClass + " resize-none"} />
          <div className="text-xs text-slate-600 mt-1">{storyText.length} / 2,200 characters</div>
        </div>

        {/* Interactive Elements */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Interactive Elements</label>
          <div className="flex flex-wrap gap-2">
            {INTERACTIVE_ELEMENTS.map(el => (
              <button key={el.key} onClick={() => toggleElement(el)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border
                  ${activeElements.has(el.key)
                    ? 'bg-pink-500/20 border-pink-500/40 text-pink-300'
                    : 'bg-white/[0.04] border-white/8 text-slate-500 hover:border-white/12'}`}>
                {el.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={copyText}
            className="flex-1 py-4 rounded-2xl font-bold text-sm transition-all duration-200"
            style={{ background: copied ? '#22c55e' : '#ec4899', color: '#fff' }}>
            {copied ? '✅ Copied!' : '📋 Copy Text'}
          </button>
          <button onClick={randomTemplate}
            className="px-6 py-4 rounded-2xl bg-white/[0.06] text-slate-400 font-bold text-sm hover:text-white transition-all">
            🎲 Random
          </button>
          <button onClick={() => { setStoryText(''); setSelectedTemplate(null); setActiveElements(new Set()) }}
            className="px-6 py-4 rounded-2xl bg-white/[0.06] text-slate-400 font-bold text-sm hover:text-white transition-all">
            Clear
          </button>
        </div>

        {/* Preview */}
        {storyText && (
          <div ref={resultRef} className="rounded-3xl border-2 border-pink-500/15 bg-gradient-to-br from-pink-500/[0.06] via-white/[0.01] to-transparent p-6"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
              <h3 className="text-sm font-bold text-pink-400 uppercase tracking-wider">Preview</h3>
            </div>
            <div className="whitespace-pre-line text-sm text-slate-300 bg-black/20 rounded-xl p-4">{storyText}</div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
