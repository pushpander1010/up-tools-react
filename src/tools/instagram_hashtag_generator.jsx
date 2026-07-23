import { useState, useCallback, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const DB = {
  photography: ['#photography','#photooftheday','#picoftheday','#instaphoto','#photographer','#photo','#naturephotography','#portraitphotography','#streetphotography','#landscapephotography','#blackandwhitephotography','#mobilephotography','#photographylovers','#photographyislife','#photographyeveryday','#photographyart','#photographyskills','#photographytips','#photographyworld','#photographylife','#photographypassion','#photographyinspiration','#photographycommunity','#photographyisart','#photographylove','#photographysouls','#photographyaddicts','#photographyiseverything','#photographyvibes','#photographyjourney'],
  food: ['#food','#foodie','#instafood','#foodporn','#delicious','#yummy','#cooking','#recipe','#foodblogger','#homemade','#healthyfood','#foodstagram','#foodlover','#foodgasm','#foodpics','#foodphotography','#foodart','#foodculture','#foodaddict','#foodheaven','#foodcoma','#foodbeast','#foodnetwork','#fooddiary','#foodjournal','#foodprep','#foodstyling','#foodplating','#foodtruck','#foodfestival'],
  fitness: ['#fitness','#gym','#workout','#fit','#health','#motivation','#fitnessmotivation','#bodybuilding','#training','#healthy','#exercise','#fitlife','#fitnessjourney','#fitnessaddict','#fitnessgoals','#fitnessinspiration','#fitnesslifestyle','#fitnessmodel','#fitnessfreak','#fitnessfun','#fitnesstime','#fitnesscoach','#fitnesstrainer','#fitnessworld','#fitnesscommunity','#fitnesslife','#fitnesseveryday','#fitnesspassion','#fitnessvibes','#fitnesslove'],
  travel: ['#travel','#wanderlust','#adventure','#explore','#vacation','#trip','#traveling','#instatravel','#travelgram','#nature','#beautiful','#photography','#travelphotography','#traveladdict','#travelblogger','#traveldiaries','#travellife','#travelmore','#travellove','#travelvibes','#travelgoals','#travelinspiration','#travelmemories','#travelstory','#travelguide','#traveltime','#traveltheworld','#travelholic','#travelcommunity','#travelpassion'],
  fashion: ['#fashion','#style','#ootd','#outfit','#fashionista','#instafashion','#stylish','#fashionblogger','#beauty','#model','#shopping','#trend','#fashionstyle','#fashionlover','#fashionweek','#fashiondesign','#fashionphotography','#fashionmodel','#fashiontrends','#fashioninspo','#fashionpost','#fashiondiaries','#fashionaddicts','#fashionworld','#fashionlife','#fashionpassion','#fashionvibes','#fashiondaily','#fashionforward','#fashionstatement'],
  business: ['#business','#entrepreneur','#success','#motivation','#marketing','#startup','#smallbusiness','#businessowner','#leadership','#growth','#innovation','#hustle','#businesslife','#businessmindset','#businessgoals','#businesstips','#businesscoach','#businesswoman','#businessman','#businessdevelopment','#businessstrategy','#businesssuccess','#businessworld','#businesscommunity','#businessnetworking','#businessinspiration','#businesspassion','#businessjourney','#businessvibes','#businessmotivation'],
  lifestyle: ['#lifestyle','#life','#happy','#love','#instagood','#me','#selfie','#follow','#cute','#photooftheday','#tbt','#followme','#girl','#beautiful','#picoftheday','#instadaily','#food','#swag','#amazing','#fashion','#igers','#fun','#summer','#instalike','#bestoftheday','#smile','#like4like','#friends','#instamood','#vibes'],
  beauty: ['#beauty','#makeup','#skincare','#beautiful','#cosmetics','#makeupartist','#beautyblogger','#makeuplover','#beautytips','#skincareroutine','#makeupoftheday','#beautyguru','#makeupjunkie','#beautyproducts','#makeuplife','#beautycare','#makeupaddicts','#beautycommunity','#makeupinspiration','#beautyinfluencer','#makeuptools','#beautytrends','#makeupbrand','#beautyworld','#makeuppassion','#beautyvibes','#makeuplook','#beautylover','#makeuptime','#beautyessentials'],
  art: ['#art','#artist','#artwork','#drawing','#painting','#creative','#design','#illustration','#sketch','#artoftheday','#instaart','#artistsoninstagram','#artlife','#artlover','#artgallery','#artcollector','#artworld','#artcommunity','#artinspiration','#artpassion','#arttherapy','#artprocess','#artjournal','#artdaily','#artvibes','#artlovers','#artsy','#artislife','#artaddict','#artofinstagram'],
  music: ['#music','#musician','#song','#singer','#guitar','#piano','#band','#concert','#musiclife','#musiclover','#musicproducer','#musicvideo','#newmusic','#livemusic','#musicislife','#musicfestival','#musicstudio','#musicartist','#musicworld','#musiccommunity','#musicpassion','#musicvibes','#musicinspiration','#musictime','#musiclove','#musicaddict','#musicdaily','#musictherapy','#musicjourney','#musicculture'],
  nature: ['#nature','#naturephotography','#landscape','#outdoors','#hiking','#mountains','#forest','#wildlife','#sunset','#sunrise','#flowers','#trees','#ocean','#beach','#sky','#clouds','#adventure','#explore','#camping','#backpacking','#naturelovers','#naturegram','#earthpix','#landscapephotography','#wildlifephotography','#naturelover','#mothernature','#getoutside','#optoutside','#naturewalk'],
  pets: ['#pets','#dog','#cat','#puppy','#kitten','#dogsofinstagram','#catsofinstagram','#petlover','#animals','#cute','#adorable','#furry','#petsofinstagram','#doglife','#catlife','#petphotography','#animallovers','#furbaby','#dogstagram','#catstagram','#petcare','#petfriendly','#rescue','#adopt','#petfamily','#doggo','#kitty','#pawsome','#fluffydog','#cutecat'],
  technology: ['#technology','#tech','#innovation','#digital','#gadgets','#smartphone','#computer','#software','#coding','#programming','#developer','#ai','#machinelearning','#blockchain','#cybersecurity','#startup','#techlife','#techworld','#techcommunity','#techtrends','#technews','#techreview','#techgeek','#techsavvy','#techblogger','#techinfluencer','#techpassion','#techvibes','#techinnovation','#techfuture'],
}

const ICONS = {
  photography:'📸',food:'🍕',fitness:'💪',travel:'✈️',fashion:'👗',business:'💼',
  lifestyle:'🌟',beauty:'💄',art:'🎨',music:'🎵',nature:'🌿',pets:'🐕',technology:'💻',
}

export default function instagram_hashtag_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [activeCategory, setActiveCategory] = useState(null)
  const [customKeyword, setCustomKeyword] = useState('')
  const [generated, setGenerated] = useState([])
  const [selected, setSelected] = useState(new Set())

  const generateCategory = useCallback((cat) => {
    setActiveCategory(cat)
    setGenerated(DB[cat] || [])
    setSelected(new Set())
  }, [])

  const generateCustom = useCallback(() => {
    if (!customKeyword.trim()) return
    const keyword = customKeyword.trim().toLowerCase().replace(/\s+/g, '')
    const customTags = [
      `#${keyword}`, `#${keyword}life`, `#${keyword}world`, `#${keyword}daily`,
      `#${keyword}lover`, `#${keyword}vibes`, `#${keyword}community`, `#${keyword}addict`,
      `#${keyword}passion`, `#${keyword}inspiration`, `#${keyword}goals`, `#${keyword}style`,
      `#${keyword}photos`, `#${keyword}time`, `#${keyword}love`, `#${keyword}trend`,
      `#${keyword}art`, `#${keyword}post`, `#${keyword}model`, `#${keyword}mood`,
      `#insta${keyword}`, `${keyword}`, `#best${keyword}`, `${keyword}oftheday`,
      `#trending${keyword}`, `#${keyword}gram`, `${keyword}daily`, `#${keyword}photography`,
      `#${keyword}blogger`, `#${keyword}insta`,
    ]
    setActiveCategory(null)
    setGenerated(customTags)
    setSelected(new Set())
  }, [customKeyword])

  const toggleSelect = (tag) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(tag)) next.delete(tag)
      else if (next.size < 30) next.add(tag)
      return next
    })
  }

  const selectAll = () => setSelected(new Set(generated.slice(0, 30)))

  const selectedText = useMemo(() => [...selected].join(' '), [selected])

  const copyText = (text) => navigator.clipboard.writeText(text)

  return (
    <ToolLayout
      title="Instagram Hashtag Generator"
      desc="Generate trending Instagram hashtags instantly. Get the best hashtags for your niche, analyze popularity, and boost your reach."
      icon="📊" iconBg="rgba(236,72,153,0.08)"
      category="social" slug="instagram-hashtag-generator"
      faq={[
        { q: 'Is this tool free?', a: 'Yes, completely free with no sign-ups required.' },
        { q: 'Are these hashtags effective?', a: 'We curate hashtags from popular categories. Mix them with niche-specific ones for best results.' },
        { q: 'How many hashtags should I use?', a: 'Instagram allows up to 30. We recommend 20-30 for maximum reach.' },
      ]}
      howItWorks={[
        'Select a category or enter custom keywords.',
        'Browse the generated hashtags and click to select.',
        'Copy selected hashtags or all at once.',
        'Paste them into your Instagram post.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Instagram Hashtag Generator", "applicationCategory": "SocialNetworkingApplication",
        "url": "https://www.uptools.in/instagram-hashtag-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Category Selection */}
        <div>
          <h3 className="text-sm font-bold text-pink-400 mb-3">Select Category</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
            {Object.keys(DB).map(cat => (
              <button key={cat} onClick={() => generateCategory(cat)}
                className={`p-3 rounded-xl border-2 text-center transition-all duration-200 text-xs font-bold ${
                  activeCategory === cat
                    ? 'bg-pink-500/15 border-pink-500/30 text-pink-400 shadow-lg shadow-pink-500/10'
                    : 'bg-white/[0.04] border-white/8 text-slate-400 hover:border-white/12 hover:text-white'
                }`}>
                <div className="text-lg mb-1">{ICONS[cat]}</div>
                <div className="capitalize">{cat}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Keyword */}
        <div>
          <h3 className="text-sm font-bold text-pink-400 mb-3">Or Enter Custom Keywords</h3>
          <div className="flex gap-2">
            <input type="text" value={customKeyword} onChange={e => setCustomKeyword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generateCustom()}
              placeholder="e.g., fitness, food, travel"
              className="flex-1 bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-pink-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark]" />
            <button onClick={() => { generateCustom(); jumpTo() }}
              className="px-6 py-3.5 rounded-xl bg-pink-500 text-white font-bold text-sm hover:bg-pink-400 transition-all active:scale-95">
              Generate
            </button>
          </div>
        </div>

        {/* Generated Hashtags */}
        {generated.length > 0 ? (
          <div ref={resultRef} className="space-y-4"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-pink-400">Generated Hashtags ({generated.length})</h3>
              <div className="flex gap-2">
                <button onClick={selectAll}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/8 text-[11px] font-bold text-slate-400 hover:text-white transition-all">
                  Select All
                </button>
                <button onClick={() => copyText(selectedText)}
                  disabled={selected.size === 0}
                  className="px-3 py-1.5 rounded-lg bg-pink-500/15 border border-pink-500/30 text-[11px] font-bold text-pink-400 disabled:opacity-40 transition-all">
                  Copy ({selected.size})
                </button>
              </div>
            </div>

            {/* Hashtag Grid */}
            <div className="flex flex-wrap gap-2">
              {generated.map((tag, i) => (
                <button key={i} onClick={() => toggleSelect(tag)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 ${
                    selected.has(tag)
                      ? 'bg-pink-500/20 border border-pink-500/40 text-pink-300 shadow-lg shadow-pink-500/10'
                      : 'bg-white/[0.04] border border-white/8 text-slate-400 hover:border-white/12 hover:text-white'
                  }`}>
                  {tag}
                </button>
              ))}
            </div>

            {/* Selected Preview */}
            {selected.size > 0 && (
              <div className="p-4 rounded-2xl bg-pink-500/5 border border-pink-500/15">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-pink-400">Selected ({selected.size}/30)</span>
                  <button onClick={() => copyText(selectedText)}
                    className="px-3 py-1 rounded-lg bg-pink-500 text-white text-[11px] font-bold hover:bg-pink-400 transition-all active:scale-95">
                    📋 Copy Text
                  </button>
                </div>
                <p className="text-xs text-slate-500 font-mono leading-relaxed break-all">{selectedText}</p>
              </div>
            )}
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📊</div>
            <p className="text-sm text-slate-600 font-medium">Select a category or enter keywords</p>
          </div>
        )}

        {/* Popular Categories Preview */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-pink-400">🔥 Popular Categories</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { cat: 'photography', icon: '📸', label: 'Photography' },
              { cat: 'food', icon: '🍕', label: 'Food & Cooking' },
              { cat: 'fitness', icon: '💪', label: 'Fitness & Health' },
              { cat: 'travel', icon: '✈️', label: 'Travel' },
              { cat: 'fashion', icon: '👗', label: 'Fashion & Style' },
              { cat: 'business', icon: '💼', label: 'Business' },
            ].map(({ cat, icon, label }) => (
              <button key={cat} onClick={() => { generateCategory(cat); jumpTo() }}
                className="p-4 rounded-2xl bg-white/[0.04] border border-white/8 hover:border-pink-500/20 transition-all text-left">
                <div className="text-xl mb-1">{icon}</div>
                <div className="text-sm font-bold text-white">{label}</div>
                <div className="text-[10px] text-slate-600 font-mono mt-1 line-clamp-2">
                  {DB[cat].slice(0, 5).join(' ')}...
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
