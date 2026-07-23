import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const categoryEmojis = {
  food: ['🍕', '🍔', '🍰', '☕', '🍜', '🥗'],
  fashion: ['👗', '👔', '👠', '👜', '💍', '🧥'],
  beauty: ['💄', '💅', '✨', '💇', '🧴', '💆'],
  tech: ['💻', '📱', '⚡', '🔧', '🖥️', '⌨️'],
  health: ['🏥', '💊', '🩺', '❤️', '🧘', '💪'],
  education: ['📚', '✏️', '🎓', '📖', '🧠', '👨‍🏫']
}

const nameTemplates = {
  food: ['Tasty', 'Fresh', 'Delicious', 'Yummy', 'Gourmet', 'Savory'],
  fashion: ['Chic', 'Trendy', 'Elegant', 'Style', 'Fashion', 'Boutique'],
  beauty: ['Glow', 'Beauty', 'Glamour', 'Radiant', 'Luxe', 'Shine'],
  tech: ['Tech', 'Digital', 'Smart', 'Pro', 'Cyber', 'Gadget'],
  health: ['Wellness', 'Care', 'Health', 'Fit', 'Vital', 'Pure'],
  education: ['Learn', 'Academy', 'Edu', 'Smart', 'Bright', 'Knowledge']
}

const categoryLabels = {
  food: '🍕 Food', fashion: '👗 Fashion', beauty: '💄 Beauty',
  tech: '💻 Tech', health: '🏥 Health', education: '📚 Education'
}

export default function whatsapp_business_name_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [businessType, setBusinessType] = useState('')
  const [location, setLocation] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [names, setNames] = useState([])
  const [copied, setCopied] = useState(null)

  const generate = useCallback(() => {
    if (!businessType.trim()) return
    const category = selectedCategory || 'food'
    const emojis = categoryEmojis[category]
    const templates = nameTemplates[category]
    const result = []
    for (let i = 0; i < 10; i++) {
      const emoji = emojis[i % emojis.length]
      const template = templates[i % templates.length]
      let name = ''
      if (i < 3 && location.trim()) {
        name = `${emoji} ${template} ${businessType} ${location}`
      } else if (i < 6) {
        name = `${emoji} ${template} ${businessType}`
      } else if (i < 8 && location.trim()) {
        name = `${businessType} ${location} ${emoji}`
      } else {
        name = `${businessType} ${emoji}`
      }
      result.push(name)
    }
    setNames(result)
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      jumpTo()
    }, 100)
  }, [businessType, location, selectedCategory])

  const copyName = (name) => {
    navigator.clipboard.writeText(name).then(() => {
      setCopied(name)
      setTimeout(() => setCopied(null), 1500)
    })
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="WhatsApp Business Name Generator"
      desc="Generate professional, catchy business names for your WhatsApp Business profile. Stand out in customer chats!"
      icon="💼" iconBg="rgba(37,211,102,0.08)"
      category="whatsapp" slug="whatsapp-business-name-generator"
      faq={[
        { q: "How do I choose a good WhatsApp Business name?", a: "Choose a name that's memorable, easy to spell, reflects your business, and is professional. Keep it under 25 characters." },
        { q: "Can I use emojis in my WhatsApp Business name?", a: "Yes! Emojis can make your business name stand out in chat lists. Use 1-2 relevant emojis." },
        { q: "Should my WhatsApp Business name match my company name?", a: "It's recommended but not required. Your name should be recognizable to customers." },
      ]}
      howItWorks={[
        "Enter your business type (e.g., Bakery, Salon, Clothing Store).",
        "Optionally add a location and select a category.",
        "Click Generate and copy the names you like.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "WhatsApp Business Name Generator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/whatsapp-business-name-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-2">Business Type</label>
          <input type="text" value={businessType} onChange={e => setBusinessType(e.target.value)}
            placeholder="e.g., Bakery, Salon, Clothing Store"
            className={inputClass} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-2">Location (Optional)</label>
          <input type="text" value={location} onChange={e => setLocation(e.target.value)}
            placeholder="e.g., Downtown, Mumbai, London"
            className={inputClass} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-2">Business Category</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(categoryLabels).map(([val, label]) => (
              <button key={val} onClick={() => setSelectedCategory(val)}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === val
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-white/[0.06] text-slate-500 border border-white/8'
                }`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => { generate(); jumpTo() }}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
          ✨ Generate Business Names
        </button>

        {names.length > 0 && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Generated Names</h3>
            </div>
            <div className="space-y-2">
              {names.map(name => (
                <div key={name} className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                  copied === name
                    ? 'bg-emerald-500/15 border border-emerald-500/30'
                    : 'bg-white/[0.06] border border-white/8'
                }`}>
                  <span className="text-sm text-white font-medium truncate mr-3">{name}</span>
                  <button onClick={() => copyName(name)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/8 text-slate-400 hover:text-white transition-all shrink-0">
                    {copied === name ? '✓' : '📋'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-5">
          <h3 className="text-sm font-bold text-slate-300 mb-3">💡 Tips for a Great WhatsApp Business Name</h3>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li>✅ <b className="text-slate-300">Keep it short:</b> Under 25 characters for better visibility</li>
            <li>✅ <b className="text-slate-300">Make it memorable:</b> Easy to spell and pronounce</li>
            <li>✅ <b className="text-slate-300">Add emojis:</b> 1-2 relevant emojis help you stand out</li>
            <li>✅ <b className="text-slate-300">Include location:</b> Helps local customers find you</li>
            <li>✅ <b className="text-slate-300">Be professional:</b> Avoid slang or confusing abbreviations</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  )
}
