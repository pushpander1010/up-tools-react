import { Link } from 'react-router-dom'

export default function Breadcrumbs({ items }) {
  // items: [{ label: 'Home', href: '/' }, { label: 'GST Calculator' }]
  return (
    <nav className="text-xs text-slate-500 mb-4 flex flex-wrap items-center gap-1" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <span className="text-slate-700">›</span>}
          {item.href ? (
            <Link to={item.href} className="hover:text-white transition-colors">{item.label}</Link>
          ) : (
            <span className="text-white">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
