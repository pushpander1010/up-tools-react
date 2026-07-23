import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const groupNames = {
  family: [
    '👨‍👩‍👧‍👦 The Fam Bam', '🏠 Home Sweet Home', '❤️ Family First', '👪 The Clan',
    '🌟 Our Tribe', '💕 Blood & Love', '🎭 The Drama Squad', '🍕 Family Feast',
    '📸 Memory Makers', '🎉 The Celebration Crew', '💬 Family Chat', '🏡 The Homebase'
  ],
  friends: [
    '👯 Squad Goals', '🔥 The Lit Crew', '😎 Cool Kids Club', '🎊 Party Animals',
    '💯 Real Ones', '🌟 Star Squad', '🎭 Drama Queens/Kings', '🍕 Pizza Lovers',
    '🎮 Game Night Gang', '☕ Coffee Addicts', '🎬 Movie Buffs', '🎵 Music Maniacs'
  ],
  work: [
    '💼 The Office', '📊 Team Success', '🎯 Goal Getters', '💪 Hustle Squad',
    '📈 Growth Mindset', '⚡ Power Team', '🏆 Winners Circle', '🚀 Innovation Hub',
    '💡 Bright Ideas', '🎯 Mission Control', '📱 Always Online', '☕ Coffee & Deadlines'
  ],
  college: [
    '🎓 Study Buddies', '📚 Book Worms', '🎉 Campus Legends', '😴 Sleep Deprived',
    '☕ Caffeine Addicts', '📝 Assignment SOS', '🎭 Drama Department', '🏀 Sports Squad',
    '🎨 Creative Minds', '🔬 Lab Rats', '🎵 Music Society', '🍕 Broke But Happy'
  ],
  party: [
    '🎉 Party People', '🍾 Celebration Station', '🎊 Event Squad', '🥳 Good Vibes Only',
    '🎭 The Fun Gang', '🍻 Cheers Squad', '🎵 Dance Floor', '🌟 VIP Lounge',
    '🎪 Circus Crew', '🎨 Theme Party', '🍕 Food & Fun', '📸 Photo Booth'
  ],
  travel: [
    '✈️ Wanderlust', '🌍 Globe Trotters', '🗺️ Adventure Squad', '🏖️ Beach Bums',
    '⛰️ Mountain Climbers', '🚗 Road Trippers', '📸 Travel Diaries', '🎒 Backpackers',
    '🌅 Sunset Chasers', '🏝️ Island Hoppers', '🛫 Jet Setters', '🗼 City Explorers'
  ],
  gaming: [
    '🎮 Game On', '🏆 Victory Squad', '⚔️ Battle Royale', '🎯 Headshot Heroes',
    '👾 Pixel Warriors', '🕹️ Console Kings', '💀 Noob Slayers', '🔥 Pro Gamers',
    '🎪 Rage Quit Club', '🌟 Level Up', '⚡ Speed Runners', '🎭 Role Players'
  ],
  fitness: [
    '💪 Gym Rats', '🏋️ Gains Gang', '🏃 Run Club', '🥗 Healthy Squad',
    '💯 Fitness Goals', '🔥 Sweat Squad', '⚡ Power Lifters', '🎯 Body Goals',
    '🏆 Champions', '💪 Strong Squad', '🥇 Winners', '🌟 Transformation'
  ],
  food: [
    '🍕 Pizza Lovers', '🍔 Burger Squad', '🍜 Foodie Gang', '🍰 Dessert First',
    '☕ Coffee Addicts', '🌮 Taco Tuesday', '🍣 Sushi Squad', '🍝 Pasta Party',
    '🍦 Ice Cream Club', '🥗 Healthy Eaters', '🍕 Midnight Snackers', '🍩 Donut Worry'
  ],
  funny: [
    '😂 LOL Squad', '🤪 Crazy Bunch', '🙃 Upside Down', '🤡 Circus Act',
    '😜 Weirdos United', '🤣 Meme Team', '😎 Too Cool', '🤓 Nerds Rule',
    '😴 Always Tired', '🍕 Broke AF', '🤷 Whatever', '😅 Hot Mess'
  ],
}

const typeLabels = {
  family: '👨‍👩‍👧‍👦 Family', friends: '👯 Friends', work: '💼 Work/Office',
  college: '🎓 College/School', party: '🎉 Party/Event', travel: '✈️ Travel',
  gaming: '🎮 Gaming', fitness: '💪 Fitness', food: '🍕 Foodies', funny: '😂 Funny/Meme',
}

export default function whatsapp_group_name_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [groupType, setGroupType] = useState('family')
  const [copied, setCopied] = useState(null)
  const [generated, setGenerated] = useState(false)

  const generate = useCallback(() => {
    setGenerated(true)
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      jumpTo()
    }, 100)
  }, [])

  const copyName = (name) => {
    navigator.clipboard.writeText(name).then(() => {
      setCopied(name)
      setTimeout(() => setCopied(null), 1500)
    })
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="WhatsApp Group Name Generator"
      desc="Generate creative and funny WhatsApp group names for any occasion!"
      icon="💬" iconBg="rgba(37,211,102,0.08)"
      category="whatsapp" slug="whatsapp-group-name-generator"
      faq={[
        { q: "What makes a good WhatsApp group name?", a: "A good name is relevant, easy to remember, creative or funny, not too long, and appropriate for all members. Consider using emojis." },
        { q: "Can I use emojis in WhatsApp group names?", a: "Yes! Emojis make group names more fun and recognizable. You can add them at the beginning, end, or throughout the name." },
        { q: "How long can a WhatsApp group name be?", a: "WhatsApp group names can be up to 25 characters long. Keep it concise and memorable." },
      ]}
      howItWorks={[
        "Select the group type from the dropdown.",
        "Click Generate to get creative name suggestions.",
        "Click any name to copy it to your clipboard.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "WhatsApp Group Name Generator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/whatsapp-group-name-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-2">Group Type</label>
          <select value={groupType} onChange={e => setGroupType(e.target.value)}
            className={inputClass + " appearance-none"}>
            {Object.entries(typeLabels).map(([val, label]) => (
              <option key={val} value={val} className="bg-gray-900">{label}</option>
            ))}
          </select>
        </div>

        <button onClick={() => { generate(); jumpTo() }}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
          ✨ Generate Group Names
        </button>

        {generated && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Your Group Names</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">Click any name to copy it</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {groupNames[groupType].map(name => (
                <button key={name} onClick={() => copyName(name)}
                  className={`flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                    copied === name
                      ? 'bg-emerald-500/15 border border-emerald-500/30'
                      : 'bg-white/[0.06] border border-white/8 hover:border-indigo-500/40'
                  }`}>
                  <span className="text-sm text-white font-medium truncate mr-2">{name}</span>
                  <span className="text-xs text-slate-500 shrink-0">{copied === name ? '✓' : '📋'}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
