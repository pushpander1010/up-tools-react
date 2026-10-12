import { Link } from 'react-router-dom'

// One fixed colour per category — every card in the same category shares it,
// so users can spot Finance vs AI vs Fun at a glance.
const CATEGORY_COLORS = {
  finance: '#059669', tax: '#0d9488', banking: '#0284c7', crypto: '#d97706',
  images: '#7c3aed', text: '#4f46e5', dev: '#334155', security: '#dc2626',
  networking: '#0891b2', fun: '#db2777', health: '#16a34a', canada: '#ef4444',
  romantic: '#f43f5e', social: '#ec4899', whatsapp: '#00a884', wifi: '#2563eb',
  ai: '#8b5cf6', marketing: '#ea580c', cricket: '#65a30d', sports: '#0ea5e9',
  fifa: '#16a34a', india: '#f97316', education: '#4f46e5', downloader: '#9333ea',
  tools: '#6366f1',
}

export default function ToolCard({ tool, categories }) {
  const mainCat = tool.cats?.[1] || tool.cats?.[0] || 'tools'
  const catColor = CATEGORY_COLORS[mainCat] || categories?.[mainCat]?.color || '#6366f1'

  return (
    <Link
      to={tool.href}
      className="glass block p-4 group relative overflow-hidden no-underline hover:-translate-y-1 transition-transform duration-200"
      style={{ '--card-accent': catColor }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-4 right-4 h-[3px] rounded-full"
        style={{ background: catColor }} />

      <div className="flex items-center gap-3 mb-2.5 mt-1">
        {/* Icon — solid playful tile */}
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 text-white shadow-md group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-200"
          style={{ background: catColor }}>
          {tool.icon}
        </div>
        {/* Badge */}
        <div className="flex gap-1.5 flex-wrap">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
            style={{ background: `${catColor}18`, color: catColor, border: `1px solid ${catColor}35` }}>
            {categories?.[tool.cats?.[0]]?.label || 'Tool'}
          </span>
          {tool.new && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              New
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-[15px] font-bold text-white group-hover:text-brand-light transition-colors mb-1 truncate">
        {tool.title}
      </h3>

      {/* Description */}
      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-2.5">
        {tool.desc}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {tool.tags?.slice(0, 3).map(tag => (
          <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/4 border border-white/8 text-slate-400">
            {tag}
          </span>
        ))}
      </div>

      {/* Open button */}
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-extrabold inline-flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: catColor }}>
          Open <span aria-hidden="true">→</span>
        </span>
        <button className="text-slate-500 group-hover:text-amber-300 text-base transition-colors" onClick={e => e.preventDefault()} aria-label="Save tool">
          ☆
        </button>
      </div>
    </Link>
  )
}
