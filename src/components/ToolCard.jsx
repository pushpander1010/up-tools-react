import { Link } from 'react-router-dom'

export default function ToolCard({ tool, categories }) {
  const mainCat = tool.cats?.[1] || tool.cats?.[0] || 'tools'
  const catColor = categories?.[mainCat]?.color || '#6366f1'

  return (
    <Link
      to={tool.href}
      className="glass block p-4 group relative overflow-hidden no-underline"
      style={{ '--card-accent': catColor }}
    >
      {/* Top accent line on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, transparent, ${catColor}, transparent)` }} />

      <div className="flex items-center gap-3 mb-2.5">
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: `${catColor}18` }}>
          {tool.icon}
        </div>
        {/* Badge */}
        <div className="flex gap-1.5">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium"
            style={{ background: `${catColor}18`, color: catColor, border: `1px solid ${catColor}35` }}>
            {categories?.[tool.cats?.[0]]?.label || 'Tool'}
          </span>
          {tool.new && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/12 text-emerald-400 border border-emerald-500/30">
              New
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-[15px] font-semibold text-white group-hover:text-brand-light transition-colors mb-1 truncate">
        {tool.title}
      </h3>

      {/* Description */}
      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-2.5">
        {tool.desc}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-2.5">
        {tool.tags?.slice(0, 3).map(tag => (
          <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/4 border border-white/8 text-slate-500">
            {tag}
          </span>
        ))}
      </div>

      {/* Open button */}
      <div className="flex items-center justify-between">
        <span className="glow-btn text-[13px] py-1.5 px-3.5 rounded-[10px] inline-flex">
          Open
        </span>
        <button className="text-slate-500 hover:text-white text-sm transition-colors" onClick={e => e.preventDefault()}>
          ☆
        </button>
      </div>
    </Link>
  )
}
