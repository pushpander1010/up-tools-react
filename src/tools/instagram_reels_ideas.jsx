import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const IDEA_TEMPLATES = {
  fitness: [
    { title: 'Morning Workout Routine', desc: 'Show your daily morning workout in a quick 15-second timelapse', tags: ['#fitness', '#morningworkout', '#motivation'] },
    { title: 'Workout Transformation', desc: 'Before/after clips showing your fitness journey progress', tags: ['#transformation', '#fitfam', '#gym'] },
    { title: 'Healthy Meal Prep', desc: 'Quick recipe or meal prep tutorial for fitness enthusiasts', tags: ['#mealprep', '#healthyeating', '#fitnessfood'] },
    { title: 'Exercise Tutorial', desc: 'Teach one exercise with proper form in under 30 seconds', tags: ['#exercisetips', '#formcheck', '#workout'] },
    { title: 'Gym Fails & Wins', desc: 'Funny or motivational gym moments that resonate', tags: ['#gymfails', '#gymmotivation', '#fitlife'] },
  ],
  food: [
    { title: 'Quick Recipe Reel', desc: 'A 30-second recipe that looks delicious and is easy to follow', tags: ['#recipe', '#foodie', '#cooking'] },
    { title: 'Kitchen Hacks', desc: 'Share a clever cooking tip or kitchen shortcut', tags: ['#kitchenhacks', '#foodtips', '#cooking'] },
    { title: 'Taste Test', desc: 'Try a new food or drink and share your honest reaction', tags: ['#tastetest', '#foodreview', '#yummy'] },
    { title: 'Food Styling', desc: 'Show how you plate and style food for photos', tags: ['#foodstyling', '#foodphotography', '#plating'] },
    { title: 'Restaurant Review', desc: 'Quick review of a local restaurant or food spot', tags: ['#foodreview', '#restaurant', '#foodie'] },
  ],
  travel: [
    { title: 'Hidden Gems', desc: 'Show a lesser-known spot that travelers should visit', tags: ['#hiddengems', '#travel', '#explore'] },
    { title: 'Travel Tips', desc: 'Share one essential travel tip in 15 seconds', tags: ['#traveltips', '#wanderlust', '#adventure'] },
    { title: 'Packing Hacks', desc: 'Show your packing技巧 or clever travel hacks', tags: ['#packinghacks', '#traveltips', '#travel'] },
    { title: 'Sunset/Sunrise Timelapse', desc: 'Capture a beautiful moment at golden hour', tags: ['#sunset', '#goldenhour', '#travelgram'] },
    { title: 'Day in My Life', desc: 'Document a full day of travel in a quick montage', tags: ['#dayinmylife', '#travelvlog', '#wanderlust'] },
  ],
  business: [
    { title: 'Day in My Life', desc: 'Show what a typical workday looks like as an entrepreneur', tags: ['#entrepreneur', '#business', '#dayinmylife'] },
    { title: 'Quick Tip', desc: 'Share one actionable business tip in 15 seconds', tags: ['#businesstips', '#startup', '#hustle'] },
    { title: 'Behind the Scenes', desc: 'Show the behind-the-scenes of your business or workspace', tags: ['#behindthescenes', '#business', '#workspace'] },
    { title: 'Motivation Monday', desc: 'Share a motivational quote or story for entrepreneurs', tags: ['#mondaymotivation', '#hustle', '#success'] },
    { title: 'Tool Review', desc: 'Review a productivity tool or app that helps your business', tags: ['#productivity', '#toolreview', '#business'] },
  ],
  lifestyle: [
    { title: 'Morning Routine', desc: 'Show your morning routine that sets you up for a great day', tags: ['#morningroutine', '#selfcare', '#lifestyle'] },
    { title: 'GRWM', desc: 'Get Ready With Me - show your daily preparation', tags: ['#grwm', '#lifestyle', '#routine'] },
    { title: 'Home Tour', desc: 'Quick tour of your living space or a room makeover', tags: ['#hometour', '#interiordesign', '#home'] },
    { title: 'Self-Care Tips', desc: 'Share quick self-care tips for mental or physical wellness', tags: ['#selfcare', '#wellness', '#lifestyle'] },
    { title: 'Hobby Showcase', desc: 'Show off a hobby or skill you enjoy in a creative way', tags: ['#hobby', '#lifestyle', '#passion'] },
  ],
  creative: [
    { title: 'Art Process', desc: 'Show the creation process of your artwork in timelapse', tags: ['#artprocess', '#timelapse', '#creative'] },
    { title: 'Before & After Edit', desc: 'Show a photo/video before and after editing', tags: ['#beforeandafter', '#editing', '#creative'] },
    { title: 'Skill Showcase', desc: 'Demonstrate a creative skill or technique', tags: ['#skillshare', '#creative', '#tutorial'] },
    { title: 'Inspiration Sources', desc: 'Share what inspires your creative work', tags: ['#inspiration', '#creative', '#art'] },
    { title: 'Collab Challenge', desc: 'Start a creative challenge and invite others to participate', tags: ['#challenge', '#collab', '#creative'] },
  ],
}

const CATEGORIES = [
  { value: 'fitness', label: '💪 Fitness' },
  { value: 'food', label: '🍕 Food' },
  { value: 'travel', label: '✈️ Travel' },
  { value: 'business', label: '💼 Business' },
  { value: 'lifestyle', label: '🌟 Lifestyle' },
  { value: 'creative', label: '🎨 Creative' },
]

export default function InstagramReelsIdeas() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [category, setCategory] = useState('')
  const [ideas, setIdeas] = useState([])

  const generate = useCallback(() => {
    if (!category) return
    setIdeas(IDEA_TEMPLATES[category] || [])
    jumpTo()
  }, [category, jumpTo])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Instagram Reels Ideas"
      desc="Get creative ideas for your next Instagram Reels. Never run out of content ideas again."
      icon="🎬" iconBg="rgba(236,72,153,0.08)"
      category="social" slug="instagram-reels-ideas"
      faq={[
        { q: "How long should Instagram Reels be?", a: "Reels can be 15, 30, 60, or 90 seconds. Shorter Reels (15-30s) tend to get more replays." },
        { q: "How often should I post Reels?", a: "Aim for 4-7 Reels per week for optimal growth. Quality matters more than quantity." },
      ]}
      howItWorks={[
        "Select your content niche or category.",
        "Click Get Ideas to see 5 trending Reels ideas.",
        "Pick an idea and start creating content!",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Instagram Reels Ideas", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/instagram-reels-ideas/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Your Niche/Category:</label>
          <select value={category} onChange={e => setCategory(e.target.value)} className={inputClass}>
            <option value="">Select a category...</option>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>

        <button onClick={generate}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
          Get Ideas 🎬
        </button>

        {ideas.length > 0 ? (
          <div ref={resultRef} className="space-y-4">
            {ideas.map((idea, i) => (
              <div key={i} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-5 overflow-hidden"
                style={{ animation: `slideUp 0.35s cubic-bezier(0.4,0,0.2,1) ${i * 0.08}s` }}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/15 flex items-center justify-center text-sm font-bold text-indigo-400 shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-bold text-white mb-1">{idea.title}</h4>
                    <p className="text-sm text-slate-400 mb-3">{idea.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {idea.tags.map((tag, j) => (
                        <span key={j} className="px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/8 text-xs text-slate-400">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🎬</div>
            <p className="text-sm text-slate-600 font-medium">Select a category and click Get Ideas</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
