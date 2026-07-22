#!/usr/bin/env python3
"""Generate React tool components — iframe-based for all 343 tools."""
import os, json

ROOT = "/Users/pushpanderkumar/websites/uptools-react"
TOOLS_DATA = json.load(open(os.path.join(ROOT, "src/data/tools.json")))
tools = TOOLS_DATA["tools"]

OUT_DIR = os.path.join(ROOT, "src/tools")
os.makedirs(OUT_DIR, exist_ok=True)

template = """import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

export default function COMP_NAME() {
  return (
    <>
      <Helmet>
        <title>TITLE | UpTools</title>
        <meta name="description" content="DESC" />
        <link rel="canonical" href="https://www.uptools.inHREF" />
        <meta property="og:title" content="TITLE | UpTools" />
        <meta property="og:description" content="DESC" />
      </Helmet>

      <nav className="text-xs text-slate-500 mb-4">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span className="mx-2 text-slate-700">›</span>
        <span className="text-white">TITLE</span>
      </nav>

      <section className="glass p-6 mb-6" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(17,24,39,0.6))', borderColor: 'rgba(99,102,241,0.2)' }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>ICON</div>
          <div>
            <h1 className="text-xl font-bold text-white m-0">TITLE</h1>
            <p className="text-sm text-slate-400 mt-1">DESC</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-4">
          TAGS_JSX
        </div>
      </section>

      <iframe
        src="/SLUG/index.html"
        className="w-full border-0 rounded-2xl overflow-hidden"
        style={{ minHeight: '700px', background: '#0f172a' }}
        title="TITLE"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin"
      />
    </>
  )
}
"""

count = 0
exports = []

for tool in tools:
    slug = tool["slug"]
    comp_name = slug.replace("-", "_")
    title = tool["title"].replace('"', '\\"').replace("'", "\\'")
    desc = tool.get("desc", "").replace('"', '\\"').replace("'", "\\'")
    icon = tool.get("icon", "🔧")
    href = tool.get("href", f"/{slug}/")
    tags = tool.get("tags", [])[:5]

    tags_jsx = "\n          ".join([
        f'<span key="{t}" className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/4 border border-white/6 text-slate-400">{t}</span>'
        for t in tags
    ])

    comp = template
    comp = comp.replace("COMP_NAME", comp_name)
    comp = comp.replace("TITLE", title)
    comp = comp.replace("DESC", desc)
    comp = comp.replace("ICON", icon)
    comp = comp.replace("HREF", href)
    comp = comp.replace("SLUG", slug)
    comp = comp.replace("TAGS_JSX", tags_jsx)

    path = os.path.join(OUT_DIR, f"{comp_name}.jsx")
    with open(path, "w", encoding="utf-8") as f:
        f.write(comp)
    count += 1
    exports.append(f'export {{ default as {comp_name} }} from "./{comp_name}"')

# Barrel export
with open(os.path.join(OUT_DIR, "index.js"), "w") as f:
    f.write("\n".join(exports))

print(f"Generated {count} tool components")
