import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const HASHTAG_DATABASE = {
  photography: ['#photography','#photooftheday','#picoftheday','#instaphoto','#photographer','#photo','#naturephotography','#portraitphotography','#streetphotography','#landscapephotography','#mobilephotography','#photographylovers','#photographyislife','#photographyeveryday','#photographyart','#photographyskills','#photographytips','#photographyworld','#photographylife','#photographypassion','#photographyinspiration','#photographycommunity','#photographyisart','#photographylove','#photographysouls','#photographyaddicts','#photographyiseverything','#photographyvibes','#photographyjourney','#photoofthenight'],
  food: ['#food','#foodie','#instafood','#foodporn','#delicious','#yummy','#cooking','#recipe','#foodblogger','#homemade','#healthyfood','#foodstagram','#foodlover','#foodgasm','#foodpics','#foodphotography','#foodart','#foodculture','#foodaddict','#foodheaven','#foodcoma','#foodbeast','#foodnetwork','#fooddiary','#foodjournal','#foodprep','#foodstyling','#foodplating','#foodtruck','#foodfestival'],
  fitness: ['#fitness','#gym','#workout','#fit','#health','#motivation','#fitnessmotivation','#bodybuilding','#training','#healthy','#exercise','#fitlife','#fitnessjourney','#fitnessaddict','#fitnessgoals','#fitnessinspiration','#fitnesslifestyle','#fitnessmodel','#fitnessfreak','#fitnessfun','#fitnesstime','#fitnesscoach','#fitnesstrainer','#fitnessworld','#fitnesscommunity','#fitnesslife','#fitnesseveryday','#fitnesspassion','#fitnessvibes','#fitnesslove'],
  travel: ['#travel','#wanderlust','#adventure','#explore','#vacation','#trip','#traveling','#instatravel','#travelgram','#nature','#beautiful','#photography','#travelphotography','#traveladdict','#travelblogger','#traveldiaries','#travellife','#travelmore','#travellove','#travelvibes','#travelgoals','#travelinspiration','#travelmemories','#travelstory','#travelguide','#traveltime','#traveltheworld','#travelholic','#travelcommunity','#travelpassion'],
  fashion: ['#fashion','#style','#ootd','#outfit','#fashionista','#instafashion','#stylish','#fashionblogger','#beauty','#model','#shopping','#trend','#fashionstyle','#fashionlover','#fashionweek','#fashiondesign','#fashionphotography','#fashionmodel','#fashiontrends','#fashioninspo','#fashionpost','#fashiondiaries','#fashionaddicts','#fashionworld','#fashionlife','#fashionpassion','#fashionvibes','#fashiondaily','#fashionforward','#fashionstatement'],
  business: ['#business','#entrepreneur','#success','#motivation','#marketing','#startup','#smallbusiness','#businessowner','#leadership','#growth','#innovation','#hustle','#businesslife','#businessmindset','#businessgoals','#businesstips','#businesscoach','#businesswoman','#businessman','#businessdevelopment','#businessstrategy','#businesssuccess','#businessworld','#businesscommunity','#businessnetworking','#businessinspiration','#businesspassion','#businessjourney','#businessvibes','#businessmotivation'],
  lifestyle: ['#lifestyle','#life','#happy','#love','#instagood','#me','#selfie','#follow','#cute','#photooftheday','#tbt','#followme','#girl','#beautiful','#picoftheday','#instadaily','#food','#swag','#amazing','#fashion','#igers','#fun','#summer','#instalike','#bestoftheday','#smile','#like4like','#friends','#instamood','#lifestyleblogger'],
  beauty: ['#beauty','#makeup','#skincare','#beautiful','#cosmetics','#makeupartist','#beautyblogger','#makeuplover','#beautytips','#skincareroutine','#makeupoftheday','#beautyguru','#makeupjunkie','#beautyproducts','#makeuplife','#beautycare','#beautycommunity','#beautyisland','#beautyaddict','#beautyblogger','#makeupaddict','#skincareaddict','#beautyblogger','#beautygram','#beautyjunkie','#beautymusthave','#beautytips','#makeuptutorial','#skincaretips','#beautyworld'],
  art: ['#art','#artist','#artwork','#drawing','#painting','#illustration','#digitalart','#sketch','#creative','#design','#artoftheday','#artdaily','#artistsoninstagram','#artgallery','#contemporaryart','#abstractart','#artislove','#artlovers','#instaart','#artcommunity','#artprocess','#artjournal','#artdaily','#artvibes','#artlovers','#artsy','#artislife','#artaddict','#artofinstagram','#artpassion'],
  music: ['#music','#musician','#song','#singer','#guitar','#piano','#band','#concert','#musiclife','#musiclover','#musicproducer','#musicvideo','#newmusic','#livemusic','#musicislife','#musicfestival','#musicstudio','#musicartist','#musicworld','#musiccommunity','#musicpassion','#musicvibes','#musicinspiration','#musictime','#musiclove','#musicaddict','#musicdaily','#musictherapy','#musicjourney','#musicculture'],
  nature: ['#nature','#naturephotography','#landscape','#outdoors','#hiking','#mountains','#forest','#wildlife','#sunset','#sunrise','#flowers','#trees','#ocean','#beach','#sky','#clouds','#adventure','#explore','#camping','#backpacking','#naturelovers','#naturegram','#earthpix','#landscapephotography','#wildlifephotography','#naturelover','#mothernature','#getoutside','#optoutside','#naturewalk'],
  pets: ['#pets','#dog','#cat','#puppy','#kitten','#dogsofinstagram','#catsofinstagram','#petlover','#animals','#cute','#adorable','#furry','#petsofinstagram','#doglife','#catlife','#petphotography','#animallovers','#furbaby','#dogstagram','#catstagram','#petcare','#petfriendly','#rescue','#adopt','#petfamily','#doggo','#kitty','#pawsome','#fluffydog','#cutecat'],
  technology: ['#technology','#tech','#innovation','#digital','#gadgets','#smartphone','#computer','#software','#coding','#programming','#developer','#ai','#machinelearning','#blockchain','#cybersecurity','#startup','#techlife','#techworld','#techcommunity','#techtrends','#technews','#techreview','#techgeek','#techsavvy','#techblogger','#techinfluencer','#techpassion','#techvibes','#techinnovation','#techfuture'],
}

const CATEGORY_ICONS = {
  photography:'📸', food:'🍕', fitness:'💪', travel:'✈️', fashion:'👗',
  business:'💼', lifestyle:'🌟', beauty:'💄', art:'🎨', music:'🎵',
  nature:'🌿', pets:'🐕', technology:'💻',
}

const CUSTOM_SUFFIXES = ['life','love','gram','daily','vibes','time','world','community','passion','mood','inspo','goals','addict','lover','world']

export default function instagram_hashtag_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [activeCategory, setActiveCategory] = useState(null)
  const [customKeyword, setCustomKeyword] = useState('')
  const [currentHashtags, setCurrentHashtags] = useState([])
  const [selected, setSelected] = useState(new Set())
  const [copiedText, setCopiedText] = useState('')
  const [feedback, setFeedback] = useState('')

  const generateForCategory = useCallback((cat) => {
    const tags = HASHTAG_DATABASE[cat] || []
    setCurrentHashtags(tags)
    setSelected(new Set())
    setActiveCategory(cat)
    jumpTo()
  }, [jumpTo])

  const generateCustom = useCallback(() => {
    const keywords = customKeyword.toLowerCase().split(',').map(k => k.trim()).filter(k => k)
    if (keywords.length === 0) return
    const tags = []
    keywords.forEach(kw => {
      tags.push(`#${kw}`)
      CUSTOM_SUFFIXES.forEach(s => tags.push(`#${kw}${s}`))
    })
    tags.push('#instagood','#photooftheday','#beautiful','#happy','#love','#follow','#like4like','#instadaily','#amazing','#bestoftheday')
    setCurrentHashtags(tags)
    setSelected(new Set())
    setActiveCategory(null)
    jumpTo()
  }, [customKeyword, jumpTo])

  const toggleHashtag = useCallback((tag) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(tag)) { next.delete(tag) }
      else if (next.size < 30) { next.add(tag) }
      return next
    })
  }, [])

  const selectAll = useCallback(() => {
    setSelected(new Set(currentHashtags.slice(0, 30)))
  }, [currentHashtags])

  const copyTags = useCallback(async (text, label) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopiedText(label)
    setTimeout(() => setCopiedText(''), 2000)
  }, [])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Instagram Hashtag Generator"
      desc="Generate trending hashtags for any niche. Select categories or create custom hashtags for maximum reach."
      icon="#️⃣" iconBg="rgba(236,72,153,0.08)"
      category="social" slug="instagram-hashtag-generator"
      faq={[
        { q: 'How many hashtags should I use?', a: 'Instagram allows up to 30, but 5-15 targeted hashtags often perform best. Quality over quantity.' },
        { q: 'Are these hashtags trending?', a: 'These are popular, well-established hashtags in each category. For real-time trends, check Instagram search.' },
      ]}
      howItWorks={[
        'Choose a category or enter a custom keyword.',
        'Browse and select hashtags from the generated list.',
        'Copy selected or all hashtags with one click.',
        'Paste into your Instagram post caption.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Instagram Hashtag Generator", "applicationCategory": "SocialNetworkingApplication",
        "url": "https://www.uptools.in/instagram-hashtag-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Category Grid */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-3">Choose a Category</label>
          <div className="flex flex-wrap gap-2">
            {Object.keys(HASHTAG_DATABASE).map(cat => (
              <button key={cat} onClick={() => generateForCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border-2
                  ${activeCategory === cat ? 'bg-pink-500/10 border-pink-500/30 text-pink-400' : 'bg-white/[0.04] border-white/8 text-slate-500 hover:border-white/12'}`}>
                {CATEGORY_ICONS[cat] || '📱'} {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Keyword */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Or Enter Custom Keywords</label>
          <div className="flex gap-3">
            <input type="text" value={customKeyword} onChange={e => setCustomKeyword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generateCustom()}
              placeholder="e.g. fitness, yoga, wellness" className={inputClass} />
            <button onClick={generateCustom}
              className="px-6 py-3 rounded-xl bg-pink-500 text-white font-bold text-sm hover:bg-pink-400 transition-all duration-200 shrink-0">
              Generate
            </button>
          </div>
        </div>

        {/* Hashtag Results */}
        {currentHashtags.length > 0 && (
          <div ref={resultRef} className="space-y-4"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-pink-400 uppercase tracking-wider">
                {currentHashtags.length} hashtags generated
              </h3>
              <span className="text-xs text-slate-500">{selected.size}/30 selected</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {currentHashtags.slice(0, 30).map(tag => (
                <button key={tag} onClick={() => toggleHashtag(tag)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border
                    ${selected.has(tag)
                      ? 'bg-pink-500/20 border-pink-500/40 text-pink-300'
                      : 'bg-white/[0.04] border-white/8 text-slate-400 hover:border-white/15'}`}>
                  {tag}
                </button>
              ))}
            </div>

            {/* Selected Tags Display */}
            {selected.size > 0 && (
              <div className="rounded-2xl bg-black/20 p-4">
                <div className="text-xs text-slate-500 mb-2">Selected hashtags:</div>
                <div className="text-sm text-slate-300 font-mono break-all">
                  {Array.from(selected).join(' ')}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button onClick={selectAll}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-white/[0.06] text-slate-400 hover:text-white transition-all">
                Select Top 30
              </button>
              <button onClick={() => copyTags(Array.from(selected).join(' '), 'selected')}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{ background: copiedText === 'selected' ? '#22c55e' : 'rgba(255,255,255,0.06)', color: copiedText === 'selected' ? '#fff' : '#94a3b8' }}>
                {copiedText === 'selected' ? '✅ Copied!' : '📋 Copy Selected'}
              </button>
              <button onClick={() => copyTags(currentHashtags.slice(0, 30).join(' '), 'all')}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{ background: copiedText === 'all' ? '#22c55e' : 'rgba(255,255,255,0.06)', color: copiedText === 'all' ? '#fff' : '#94a3b8' }}>
                {copiedText === 'all' ? '✅ Copied!' : '📋 Copy All'}
              </button>
            </div>
          </div>
        )}

        {currentHashtags.length === 0 && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">#️⃣</div>
            <p className="text-sm text-slate-600 font-medium">Choose a category or enter keywords to generate hashtags</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
