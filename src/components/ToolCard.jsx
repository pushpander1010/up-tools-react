import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { categoryColor } from '../lib/categoryColors'
import { getSavedSlugs, setSavedSlugsStorage } from '../lib/savedTools'

export default function ToolCard({ tool, categories, savedSet, onToggleSave }) {
  const mainCat = tool.cats?.[1] || tool.cats?.[0] || 'tools'
  const catColor = categoryColor(mainCat)
  const [localSaved, setLocalSaved] = useState(() => getSavedSlugs().has(tool.slug))
  const isSaved = savedSet ? savedSet.has(tool.slug) : localSaved

  const handleSave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onToggleSave) {
      onToggleSave(tool.slug)
      return
    }
    try {
      const current = getSavedSlugs()
      if (current.has(tool.slug)) current.delete(tool.slug)
      else current.add(tool.slug)
      setSavedSlugsStorage(current)
      setLocalSaved(current.has(tool.slug))
    } catch {}
  }, [tool.slug, onToggleSave])

  const catLabel = categories?.[mainCat]?.label || categories?.[tool.cats?.[0]]?.label || 'Utility'

  return (
    <Link
      to={tool.href || `/${tool.slug}/`}
      className="glass flex flex-col justify-between p-4.5 group relative overflow-hidden no-underline hover:-translate-y-1 transition-all duration-200 h-full"
      style={{ '--card-accent': catColor }}
    >
      {/* Top gradient accent bar */}
      <div
        className="absolute top-0 left-5 right-5 h-[2px] rounded-full opacity-75 group-hover:opacity-100 group-hover:left-3 group-hover:right-3 transition-all duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${catColor}, transparent)` }}
      />

      {/* Ambient corner glow on hover */}
      <div
        className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl opacity-0 group-hover:opacity-25 transition-opacity duration-300 pointer-events-none"
        style={{ background: catColor }}
      />

      <div>
        <div className="flex items-start justify-between gap-2.5 mb-3 mt-0.5">
          {/* Icon tile */}
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-md group-hover:scale-105 transition-transform duration-200"
            style={{
              background: `linear-gradient(135deg, ${catColor}28, ${catColor}12)`,
              border: `1px solid ${catColor}45`,
              boxShadow: `0 4px 14px -4px ${catColor}35`,
            }}
          >
            {tool.icon}
          </div>

          <div className="flex items-center gap-1.5">
            {tool.new && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                NEW
              </span>
            )}
            <span
              className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide"
              style={{
                background: `${catColor}16`,
                color: '#e2e8f0',
                border: `1px solid ${catColor}38`,
              }}
            >
              {catLabel}
            </span>
            <button
              type="button"
              onClick={handleSave}
              aria-label={isSaved ? `Remove ${tool.title} from saved tools` : `Save ${tool.title}`}
              title={isSaved ? 'Saved' : 'Save tool'}
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-colors cursor-pointer border ${
                isSaved
                  ? 'text-amber-400 bg-amber-500/15 border-amber-500/30'
                  : 'text-slate-500 hover:text-amber-300 bg-white/[0.03] border-white/[0.06] hover:border-white/15'
              }`}
            >
              {isSaved ? '★' : '☆'}
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-bold text-white group-hover:text-indigo-300 transition-colors mb-1.5 leading-snug line-clamp-1 m-0">
          {tool.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3 m-0">
          {tool.desc}
        </p>
      </div>

      {/* Footer: Tags + CTA */}
      <div className="pt-2.5 border-t border-white/[0.05] flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1 min-w-0 overflow-hidden">
          {tool.tags?.slice(0, 2).map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/[0.04] border border-white/[0.06] text-slate-400 truncate max-w-[96px]"
            >
              #{tag}
            </span>
          ))}
        </div>
        <span
          className="text-xs font-bold inline-flex items-center gap-1 group-hover:gap-1.5 transition-all shrink-0"
          style={{ color: catColor }}
        >
          Open <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  )
}
