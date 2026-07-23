import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'

const LOOKS = [
  { name: "Rihanna", designer: "Margiela Couture by Glenn Martens", note: "Metallic sculptural arrival with avant-garde silhouette", image: "https://images.unsplash.com/photo-1746025240954-20b5aed60e1d?w=400" },
  { name: "A$AP Rocky", designer: "Chanel", note: "Tailored house look with classic elegance", image: "https://images.unsplash.com/photo-1746025241709-0fb2528687e2?w=400" },
  { name: "Beyonce", designer: "Olivier Rousteing and Chopard", note: "Feathered gown arrival with dramatic presence", image: "https://images.unsplash.com/photo-1746025241699-b4b197e3d421?w=400" },
  { name: "Kim Kardashian", designer: "Not specified", note: "Featured in Vanity Fair gallery with iconic styling", image: "https://images.unsplash.com/photo-1746207067856-7b380ca95b10?w=400" },
  { name: "Charli XCX", designer: "Saint Laurent", note: "Minimalist black-red carpet styling with modern edge", image: "https://images.unsplash.com/photo-1718871729636-887b3d2359ae?w=400" },
  { name: "Hailey Bieber", designer: "Not specified", note: "Featured in gallery with signature minimalist aesthetic", image: "https://images.unsplash.com/photo-1762285315034-0df9960d9905?w=400" },
  { name: "Cher", designer: "Not specified", note: "Featured in gallery with timeless style", image: "https://images.unsplash.com/photo-1746025241709-0fb2528687e2?w=400" },
  { name: "Kris Jenner", designer: "Dolce&Gabbana", note: "House credit listed with sophisticated styling", image: "https://images.unsplash.com/photo-1746025241699-b4b197e3d421?w=400" },
  { name: "Troye Sivan", designer: "Prada and Pandora", note: "Designer and jewelry credit listed with artistic flair", image: "https://images.unsplash.com/photo-1746207067856-7b380ca95b10?w=400" },
  { name: "Daisy Edgar-Jones", designer: "Boucheron", note: "Jewelry credit listed with elegant presentation", image: "https://images.unsplash.com/photo-1718871729636-887b3d2359ae?w=400" },
  { name: "Cardi B", designer: "Marc Jacobs", note: "Exaggerated proportions mentioned with dramatic impact", image: "https://images.unsplash.com/photo-1746025241709-0fb2528687e2?w=400" },
  { name: "Justin Jefferson", designer: "Who Decides War", note: "House credit listed with contemporary edge", image: "https://images.unsplash.com/photo-1746025241699-b4b197e3d421?w=400" },
  { name: "Rachel Sennott", designer: "Marc Jacobs", note: "House credit listed with artistic styling", image: "https://images.unsplash.com/photo-1746207067856-7b380ca95b10?w=400" },
  { name: "Tessa Thompson", designer: "Valentino", note: "House credit listed with sophisticated design", image: "https://images.unsplash.com/photo-1753550577402-4f06511832a4?w=400" },
  { name: "Sarah Paulson", designer: "Matieres Fecales", note: "House credit listed with avant-garde styling", image: "https://images.unsplash.com/photo-1746025240954-20b5aed60e1d?w=400" },
  { name: "Paloma Elsesser", designer: "Francesco Risso", note: "House credit listed with contemporary design", image: "https://images.unsplash.com/photo-1746025241709-0fb2528687e2?w=400" },
  { name: "Lila Moss", designer: "Not specified", note: "Featured in gallery with modern aesthetic", image: "https://images.unsplash.com/photo-1746207067856-7b380ca95b10?w=400" },
]

export default function met_gala_2026() {
  const [search, setSearch] = useState('')
  const [designerFilter, setDesignerFilter] = useState('')

  const designers = useMemo(() => [...new Set(LOOKS.map(l => l.designer).filter(v => v && v !== 'Not specified'))].sort(), [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return LOOKS.filter(item => {
      const matchesSearch = !q || `${item.name} ${item.designer} ${item.note}`.toLowerCase().includes(q)
      const matchesDesigner = !designerFilter || item.designer === designerFilter
      return matchesSearch && matchesDesigner
    })
  }, [search, designerFilter])

  return (
    <ToolLayout
      title="Met Gala 2026"
      desc="Browse Met Gala 2026 celebrity looks and designer outfits."
      icon="👗" iconBg="rgba(236,72,153,0.08)"
      category="social" slug="met-gala-2026"
      faq={[
        { q: "What was the Met Gala 2026 theme?", a: "The 2026 Met Gala featured celebrity fashion from various designers." },
        { q: "How many looks are featured?", a: "This gallery features 17+ celebrity looks from the Met Gala 2026 red carpet." },
      ]}
      howItWorks={[
        "Browse all celebrity looks in the gallery.",
        "Search by celebrity name or designer.",
        "Filter by specific designer using the dropdown.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Met Gala 2026", "applicationCategory": "EntertainmentApplication",
        "url": "https://www.uptools.in/met-gala-2026/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Filters */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 space-y-3">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search celebrity or designer..."
            className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-pink-500/40 transition-all placeholder:text-slate-600" />
          <select value={designerFilter} onChange={e => setDesignerFilter(e.target.value)}
            className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-pink-500/40 transition-all bg-gray-900">
            <option value="">All designers</option>
            {designers.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <div className="text-xs text-slate-500">{filtered.length} looks</div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((item, i) => (
            <div key={i} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl overflow-hidden">
              <img src={item.image} alt={`${item.name} in ${item.designer}`} loading="lazy"
                className="w-full h-40 object-cover" />
              <div className="p-3">
                <h3 className="text-sm font-bold text-white">{item.name}</h3>
                <div className="text-xs text-pink-400">{item.designer}</div>
                <p className="text-xs text-slate-400 mt-1">{item.note}</p>
                <div className="flex gap-1 mt-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-pink-500/10 text-pink-400">
                    {item.designer === 'Not specified' ? 'Designer not listed' : 'Designer credit'}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-white/[0.06] text-slate-500">Met Gala 2026</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">👗</div>
            <p className="text-sm text-slate-600 font-medium">No looks match your search</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
