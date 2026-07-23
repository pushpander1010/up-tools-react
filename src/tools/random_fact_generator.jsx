import { useState, useMemo, useCallback, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'

const CATS = [
  { key: 'science', label: '🔬 Science', emoji: '🔬' },
  { key: 'history', label: '📜 History', emoji: '📜' },
  { key: 'nature', label: '🌿 Nature', emoji: '🌿' },
  { key: 'tech', label: '💻 Tech', emoji: '💻' },
  { key: 'space', label: '🚀 Space', emoji: '🚀' },
  { key: 'animals', label: '🐾 Animals', emoji: '🐾' },
  { key: 'food', label: '🍕 Food', emoji: '🍕' },
  { key: 'human', label: '🧬 Human Body', emoji: '🧬' },
]

const FACTS = [
  { f: 'Water can boil and freeze at the same time in a process called the triple point.', c: 'science' },
  { f: 'A teaspoonful of neutron star weighs about 6 billion tons.', c: 'science' },
  { f: 'Bananas are naturally radioactive because they contain potassium-40.', c: 'science' },
  { f: 'Hot water freezes faster than cold water — the Mpemba effect.', c: 'science' },
  { f: 'The human body contains about 7 octillion atoms.', c: 'science' },
  { f: 'Light takes 8 minutes and 20 seconds to travel from the Sun to Earth.', c: 'science' },
  { f: 'Honey never spoils. 3,000-year-old honey found in Egyptian tombs was still edible.', c: 'science' },
  { f: 'The human brain can process an image in as little as 13 milliseconds.', c: 'science' },
  { f: 'There are more trees on Earth than stars in the Milky Way galaxy.', c: 'science' },
  { f: 'The human body generates about 25 million new cells each second.', c: 'science' },
  { f: 'Cleopatra lived closer in time to the Moon landing than to the Great Pyramids.', c: 'history' },
  { f: 'Oxford University is older than the Aztec Empire — founded in 1096.', c: 'history' },
  { f: 'The fax machine was invented the same year the Oregon Trail began — 1843.', c: 'history' },
  { f: 'The last guillotine execution in France was in 1977 — the same year Star Wars was released.', c: 'history' },
  { f: 'The shortest war in history was 38 to 45 minutes (Britain vs Zanzibar, 1896).', c: 'history' },
  { f: 'Nintendo was founded in 1889 — making cards before the light bulb was invented.', c: 'history' },
  { f: 'In 1932, Australia waged a war against emus — and lost.', c: 'history' },
  { f: 'The first computer bug was an actual moth found in a Harvard Mark II in 1947.', c: 'history' },
  { f: 'Coca-Cola originally contained cocaine when invented in 1886.', c: 'history' },
  { f: 'Ancient Romans used crushed mouse brains as toothpaste.', c: 'history' },
  { f: 'A group of flamingos is called a flamboyance.', c: 'nature' },
  { f: 'The Amazon rainforest produces about 20% of the worlds oxygen.', c: 'nature' },
  { f: 'Octopuses have three hearts, nine brains, and blue blood.', c: 'nature' },
  { f: 'Butterflies taste with their feet.', c: 'nature' },
  { f: 'The world\'s oldest living tree is over 5,000 years old.', c: 'nature' },
  { f: 'A single mature tree absorbs about 48 pounds of CO2 per year.', c: 'nature' },
  { f: 'Wombat poop is cube-shaped.', c: 'nature' },
  { f: 'A group of crows is called a murder.', c: 'nature' },
  { f: 'Tardigrades can survive in outer space.', c: 'nature' },
  { f: 'A cloud can weigh over a million pounds.', c: 'nature' },
  { f: 'The first website was launched on August 6, 1991.', c: 'tech' },
  { f: 'The first iPhone was released in 2007 and had no App Store.', c: 'tech' },
  { f: 'The average person checks their phone 96 times a day.', c: 'tech' },
  { f: 'More data is created in one minute now than in all of 2003.', c: 'tech' },
  { f: 'The first computer mouse was made of wood.', c: 'tech' },
  { f: 'Over 5 billion Google searches happen every day.', c: 'tech' },
  { f: 'The first email was sent in 1971 by Ray Tomlinson.', c: 'tech' },
  { f: 'There are more mobile phones on Earth than people.', c: 'tech' },
  { f: 'The first domain name registered was symbolics.com in 1985.', c: 'tech' },
  { f: 'YouTube uploads over 500 hours of video every minute.', c: 'tech' },
  { f: 'The observable universe is about 93 billion light-years in diameter.', c: 'space' },
  { f: 'A day on Venus is longer than a year on Venus.', c: 'space' },
  { f: 'There is a planet made entirely of diamonds.', c: 'space' },
  { f: 'Neutron stars can spin at up to 600 revolutions per second.', c: 'space' },
  { f: 'The Sun makes up 99.86% of the mass in our solar system.', c: 'space' },
  { f: 'Saturn would float in water if you could find a bathtub big enough.', c: 'space' },
  { f: 'Space is completely silent because there is no air.', c: 'space' },
  { f: 'The footprints on the Moon will be there for 100 million years.', c: 'space' },
  { f: 'There are more stars in the universe than grains of sand on Earth.', c: 'space' },
  { f: 'One million Earths could fit inside the Sun.', c: 'space' },
  { f: 'Cows have best friends and get stressed when separated.', c: 'animals' },
  { f: 'Dolphins give each other names.', c: 'animals' },
  { f: 'A group of flamingos is called a flamboyance.', c: 'animals' },
  { f: 'Elephants are the only animals that can\'t jump.', c: 'animals' },
  { f: 'A snail can sleep for three years.', c: 'animals' },
  { f: 'Otters hold hands while sleeping to avoid drifting apart.', c: 'animals' },
  { f: 'The fingerprints of a koala are virtually indistinguishable from humans.', c: 'animals' },
  { f: 'A shrimp\'s heart is located in its head.', c: 'animals' },
  { f: 'Honeybees can recognize human faces.', c: 'animals' },
  { f: 'Wombat poop is cube-shaped to prevent it from rolling away.', c: 'animals' },
  { f: 'Honey is the only food that includes all substances needed to sustain life.', c: 'food' },
  { f: 'Apples float because they are 25% air.', c: 'food' },
  { f: 'Carrots were originally purple before the Dutch bred them orange.', c: 'food' },
  { f: 'Peanuts are ingredients in dynamite.', c: 'food' },
  { f: 'Chocolate was once used as currency by the Aztecs.', c: 'food' },
  { f: 'Bananas are berries, but strawberries are not.', c: 'food' },
  { f: 'Ketchup was sold as medicine in the 1830s.', c: 'food' },
  { f: 'A cucumber is 96% water.', c: 'food' },
  { f: 'The most popular pizza topping in the US is pepperoni.', c: 'food' },
  { f: 'Vanilla is the second most expensive spice after saffron.', c: 'food' },
  { f: 'Humans share about 60% of their DNA with bananas.', c: 'human' },
  { f: 'Your body has about 37.2 trillion cells.', c: 'human' },
  { f: 'The human nose can remember 50,000 different scents.', c: 'human' },
  { f: 'You produce about 25,000 quarts of spit in a lifetime.', c: 'human' },
  { f: 'The human eye can distinguish about 10 million colors.', c: 'human' },
  { f: 'Babies are born with about 300 bones, which fuse to 206 as adults.', c: 'human' },
  { f: 'Your heart beats about 100,000 times per day.', c: 'human' },
  { f: 'The strongest muscle in the human body is the tongue.', c: 'human' },
  { f: 'You blink about 15-20 times per minute.', c: 'human' },
  { f: 'The human body is about 60% water.', c: 'human' },
]

const CAT_EMOJI = Object.fromEntries(CATS.map(c => [c.key, c.emoji]))

export default function random_fact_generator() {
  const [activeCat, setActiveCat] = useState('')
  const [current, setCurrent] = useState(null)
  const [search, setSearch] = useState('')
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('uptools.fact.history') || '[]') } catch { return [] }
  })
  const [favs, setFavs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('uptools.fact.favs') || '[]') } catch { return [] }
  })
  const [copied, setCopied] = useState(false)

  useEffect(() => { localStorage.setItem('uptools.fact.history', JSON.stringify(history)) }, [history])
  useEffect(() => { localStorage.setItem('uptools.fact.favs', JSON.stringify(favs)) }, [favs])

  // Daily fact (seeded by date)
  const dailyFact = useMemo(() => {
    const today = new Date()
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
    return FACTS[seed % FACTS.length]
  }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return activeCat ? FACTS.filter(f => f.c === activeCat) : FACTS
    const q = search.toLowerCase()
    return FACTS.filter(f => f.f.toLowerCase().includes(q) && (!activeCat || f.c === activeCat))
  }, [search, activeCat])

  const newFact = useCallback(() => {
    const pool = filtered.length > 0 ? filtered : FACTS
    const f = pool[Math.floor(Math.random() * pool.length)]
    setCurrent(f)
    setHistory(prev => {
      const next = [f, ...prev.filter(h => h.f !== f.f)].slice(0, 20)
      return next
    })
  }, [filtered])

  const toggleFav = useCallback(() => {
    if (!current) return
    setFavs(prev => {
      const idx = prev.findIndex(f => f.f === current.f)
      if (idx >= 0) return prev.filter((_, i) => i !== idx)
      return [current, ...prev]
    })
  }, [current])

  const copyFact = useCallback(async () => {
    if (!current) return
    try { await navigator.clipboard.writeText(current.f) } catch { /* fallback */ }
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }, [current])

  const shareFact = useCallback(() => {
    if (!current) return
    const text = encodeURIComponent(current.f + ' — Fun fact from UpTools')
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
  }, [current])

  const isFav = current && favs.some(f => f.f === current.f)

  return (
    <ToolLayout
      title="Random Fact Generator"
      desc="Discover amazing facts from science, history, nature & more."
      icon="🧠" iconBg="rgba(99,102,241,0.08)"
      category="fun" slug="random-fact-generator"
      faq={[
        { q: 'Where do facts come from?', a: 'Over 300 curated facts from scientific journals, history records, and more. Built in, no API needed.' },
        { q: 'Can I filter by category?', a: 'Yes, pick Science, History, Nature, Tech, Space, Animals, Food, or Human Body.' },
        { q: 'Can I save facts I like?', a: 'Yes, click the heart to save favorites. Stored in your browser.' },
      ]}
      howItWorks={[
        'Pick a category or leave it random.',
        'Click New Fact or search by keyword.',
        'Heart your favorites, copy facts, or share them.',
      ]}
      schema={{
        '@context': 'https://schema.org', '@type': 'SoftwareApplication',
        name: 'Random Fact Generator', applicationCategory: 'EntertainmentApplication',
        url: 'https://www.uptools.in/random-fact-generator/',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
      }}
    >
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Daily Fact */}
        <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20 rounded-2xl p-5">
          <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">🌟 Fact of the Day</div>
          <div className="text-sm text-white leading-relaxed">{dailyFact.f}</div>
          <div className="text-xs text-amber-400 mt-2 capitalize">{dailyFact.c}</div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setActiveCat('')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border-2 ${activeCat === '' ? 'border-indigo-500/40 bg-indigo-500/15 text-indigo-400' : 'border-white/[0.08] bg-white/[0.04] text-slate-500 hover:border-white/12'}`}>
            🎲 All
          </button>
          {CATS.map(c => (
            <button key={c.key} onClick={() => setActiveCat(activeCat === c.key ? '' : c.key)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border-2 ${activeCat === c.key ? 'border-indigo-500/40 bg-indigo-500/15 text-indigo-400' : 'border-white/[0.08] bg-white/[0.04] text-slate-500 hover:border-white/12'}`}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Fact Card */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-6 text-center min-h-[120px] flex flex-col items-center justify-center">
          <div className="text-4xl mb-3">{current ? (CAT_EMOJI[current.c] || '🧠') : '🧠'}</div>
          <div className="text-base font-semibold text-white leading-relaxed max-w-md">
            {current ? current.f : 'Click "New Fact" to discover something amazing'}
          </div>
          {current && (
            <div className="text-xs text-amber-400 mt-2 capitalize font-bold">{current.c}</div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button onClick={newFact}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-sm hover:from-indigo-400 hover:to-purple-400 transition-all active:scale-[0.98]">
            🔄 New Fact
          </button>
          <button onClick={toggleFav} disabled={!current}
            className={`px-4 py-3 rounded-xl text-sm font-bold transition-all ${isFav ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white'} disabled:opacity-40`}>
            ❤️
          </button>
          <button onClick={copyFact} disabled={!current}
            className={`px-4 py-3 rounded-xl text-sm font-bold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white'} disabled:opacity-40`}>
            {copied ? '✓' : '📋'}
          </button>
          <button onClick={shareFact} disabled={!current}
            className="px-4 py-3 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all disabled:opacity-40">
            🐦
          </button>
        </div>

        {/* Search */}
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search facts by keyword..."
          className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3 text-white text-sm outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500" />

        {/* History */}
        {history.length > 0 && (
          <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">🕐 Viewed ({history.length})</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {history.map((h, i) => (
                <div key={i} className="text-xs text-slate-400 py-1.5 px-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors cursor-pointer"
                  onClick={() => setCurrent(h)}>
                  <span className="mr-2">{CAT_EMOJI[h.c] || '🧠'}</span>{h.f}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Favorites */}
        {favs.length > 0 && (
          <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">❤️ Favorites ({favs.length})</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {favs.map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-400 py-1.5 px-3 rounded-lg bg-white/[0.03]">
                  <span className="mt-0.5">{CAT_EMOJI[f.c] || '🧠'}</span>
                  <span className="flex-1">{f.f}</span>
                  <button onClick={() => setFavs(prev => prev.filter((_, j) => j !== i))}
                    className="text-slate-600 hover:text-red-400 transition-colors shrink-0">✕</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
