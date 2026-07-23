import { useState, useCallback, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'

const CATS = [
  { key: '', label: '🎲 Random' },
  { key: 'pasta', label: '🍝 Pasta' },
  { key: 'rice', label: '🍚 Rice' },
  { key: 'curry', label: '🍛 Curry' },
  { key: 'dessert', label: '🍰 Desserts' },
  { key: 'breakfast', label: '🥞 Breakfast' },
  { key: 'pizza', label: '🍕 Pizza' },
  { key: 'burger', label: '🍔 Burger' },
  { key: 'sandwich', label: '🥪 Sandwich' },
  { key: 'sushi', label: '🍣 Sushi' },
  { key: 'seafood', label: '🦐 Seafood' },
  { key: 'steak', label: '🥩 Steak' },
]

export default function food_randomizer() {
  const [activeCat, setActiveCat] = useState('')
  const [current, setCurrent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('uptools.food.history') || '[]') } catch { return [] }
  })
  const [favs, setFavs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('uptools.food.favs') || '[]') } catch { return [] }
  })

  useEffect(() => { localStorage.setItem('uptools.food.history', JSON.stringify(history)) }, [history])
  useEffect(() => { localStorage.setItem('uptools.food.favs', JSON.stringify(favs)) }, [favs])

  const getFood = useCallback(async (cat = activeCat) => {
    setLoading(true); setError('')
    try {
      const url = cat ? `https://foodish-api.com/api/images/${cat}` : 'https://foodish-api.com/api/'
      const r = await fetch(url)
      const d = await r.json()
      if (!d.image) throw new Error('No image')
      const food = {
        image: d.image,
        category: d.category || cat || 'random',
        name: d.image.split('/').pop().replace(/[-_]/g, ' ').replace(/\.\w+$/, ''),
      }
      setCurrent(food)
      setHistory(prev => {
        const next = [food, ...prev.filter(h => h.image !== food.image)].slice(0, 20)
        return next
      })
    } catch {
      setError('Could not load food image. Try again.')
    }
    setLoading(false)
  }, [activeCat])

  const toggleFav = useCallback(() => {
    if (!current) return
    setFavs(prev => {
      const idx = prev.findIndex(f => f.image === current.image)
      if (idx >= 0) return prev.filter((_, i) => i !== idx)
      return [current, ...prev]
    })
  }, [current])

  const isFav = current && favs.some(f => f.image === current.image)

  return (
    <ToolLayout
      title="Random Food Generator"
      desc="Discover delicious dishes from around the world by category."
      icon="🍽️" iconBg="rgba(245,158,11,0.08)"
      category="fun" slug="food-randomizer"
      faq={[
        { q: 'Where do food images come from?', a: 'From the free Foodish API providing random food photographs.' },
        { q: 'Can I filter by food type?', a: 'Yes, use the category chips for pasta, rice, curry, desserts, etc.' },
        { q: 'Can I save favorite foods?', a: 'Yes, click the heart icon to save favorites. Stored locally.' },
      ]}
      howItWorks={[
        'Pick a category or leave it random.',
        'Click New Food to get a random dish image and name.',
        'Save favorites and build your food discovery collection.',
      ]}
      schema={{
        '@context': 'https://schema.org', '@type': 'SoftwareApplication',
        name: 'Food Randomizer', applicationCategory: 'UtilitiesApplication',
        url: 'https://www.uptools.in/food-randomizer/',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
      }}
    >
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {CATS.map(c => (
            <button key={c.key} onClick={() => { setActiveCat(c.key); getFood(c.key) }}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border-2 ${activeCat === c.key ? 'border-indigo-500/40 bg-indigo-500/15 text-indigo-400' : 'border-white/[0.08] bg-white/[0.04] text-slate-500 hover:border-white/12'}`}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Main Food Display */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl overflow-hidden">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm text-slate-500">Finding a dish...</p>
            </div>
          )}
          {error && (
            <div className="p-6 text-center">
              <p className="text-sm text-red-400">{error}</p>
              <button onClick={() => getFood()} className="mt-3 px-4 py-2 rounded-xl text-xs font-bold bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-all">
                Try Again
              </button>
            </div>
          )}
          {!loading && !error && current && (
            <div style={{ animation: 'slideUp 0.35s ease-out' }}>
              <img src={current.image} alt={current.name} className="w-full h-64 object-cover"
                onError={e => { e.target.src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22><rect fill=%22%230b0f1a%22 width=%22400%22 height=%22300%22/><text fill=%22%23a6adbb%22 x=%22200%22 y=%22150%22 text-anchor=%22middle%22 font-size=%2220%22>Image unavailable</text></svg>' }} />
              <div className="p-4">
                <div className="text-lg font-bold text-white capitalize">{current.name}</div>
                <div className="text-xs text-slate-500 capitalize mt-1">{(current.category || '').replace(/_/g, ' ')}</div>
              </div>
            </div>
          )}
          {!loading && !error && !current && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-600">
              <div className="text-4xl mb-3 opacity-20">🍽️</div>
              <p className="text-sm font-medium">Click "New Food" to discover a dish</p>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button onClick={() => getFood()} disabled={loading}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-sm hover:from-indigo-400 hover:to-purple-400 transition-all active:scale-[0.98] disabled:opacity-50">
            🔄 New Food
          </button>
          <button onClick={toggleFav} disabled={!current}
            className={`px-5 py-3 rounded-xl text-sm font-bold transition-all ${isFav ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white'} disabled:opacity-40`}>
            ❤️
          </button>
          <button onClick={() => current && navigator.clipboard.writeText(current.image)} disabled={!current}
            className="px-5 py-3 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all disabled:opacity-40">
            📋
          </button>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">🕐 History ({history.length})</h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {history.map((h, i) => (
                <button key={i} onClick={() => { setCurrent(h); setActiveCat(h.category || '') }}
                  className="aspect-square rounded-xl overflow-hidden border border-white/[0.06] hover:border-indigo-500/30 transition-all relative group">
                  <img src={h.image} alt={h.name} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-1">
                    <div className="text-[9px] font-bold text-white truncate">{h.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Favorites */}
        {favs.length > 0 && (
          <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">❤️ Favorites ({favs.length})</h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {favs.map((f, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden border border-white/[0.06] relative group">
                  <img src={f.image} alt={f.name} className="w-full h-full object-cover" loading="lazy" />
                  <button onClick={() => setFavs(prev => prev.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/80 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
