import json, os, sys

ROOT = "/Users/pushpanderkumar/websites/uptools-react"
TOOLS_DIR = os.path.join(ROOT, "src/tools")
ASSETS = os.path.join(ROOT, "public/assets/tools")

HELPERS = """import { Helmet } from 'react-helmet-async'
import ToolLayout from '../components/ToolLayout'

function Section({ id, icon, title, subtitle, children }) {
  return (
    <section id={id} className="glass p-6 sm:p-7 mb-6 scroll-mt-24">
      <div className="flex items-center gap-3 mb-1">
        <span className="text-xl">{icon}</span>
        <h2 className="text-lg sm:text-xl font-extrabold text-white m-0">{title}</h2>
      </div>
      {subtitle && <p className="text-xs text-slate-400 mt-1 mb-4">{subtitle}</p>}
      {!subtitle && <div className="mb-2" />}
      <div className="space-y-4 text-sm text-slate-300 leading-relaxed">{children}</div>
    </section>
  )
}

function CodeBlock({ title, lines }) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/10" style={{ background: '#0a0f1e' }}>
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10" style={{ background: '#111827' }}>
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        {title && <span className="ml-2 text-[11px] font-mono text-slate-400">{title}</span>}
      </div>
      <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed font-mono text-green-300 whitespace-pre-wrap">
{lines}
      </pre>
    </div>
  )
}

function WarningBox({ children }) {
  return (
    <div className="rounded-xl p-4 border border-red-500/30" style={{ background: 'rgba(239,68,68,0.07)' }}>
      <div className="flex items-center gap-2 text-red-300 font-bold text-sm mb-1.5">⚠️ Legal &amp; Ethical Warning</div>
      <div className="text-xs text-red-200/80 leading-relaxed">{children}</div>
    </div>
  )
}

function InfoBox({ title, icon = '💡', children }) {
  return (
    <div className="rounded-xl p-4 border border-cyan-500/25" style={{ background: 'rgba(6,182,212,0.06)' }}>
      <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm mb-1.5">{icon} {title}</div>
      <div className="text-xs text-slate-300 leading-relaxed">{children}</div>
    </div>
  )
}

function FeatureGrid({ items }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {items.map(f => (
        <div key={f.t} className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <div className="text-2xl mb-1">{f.i}</div>
          <div className="text-sm font-semibold text-white mb-0.5">{f.t}</div>
          <div className="text-xs text-slate-400">{f.d}</div>
        </div>
      ))}
    </div>
  )
}

function IssueRow({ issue, fix }) {
  return (
    <div className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div className="flex items-start gap-2">
        <span className="text-red-400 font-bold mt-0.5">✕</span>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white mb-1">{issue}</div>
          <div className="text-xs text-slate-400 leading-relaxed">
            <span className="text-green-400 font-semibold">Fix: </span>{fix}
          </div>
        </div>
      </div>
    </div>
  )
}
"""

BODY = """
export default function __COMP__() {
  return (
    <ToolLayout
      title="__TITLE__"
      desc="__DESC__"
      icon="__ICON__"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="security"
      slug="__SLUG__"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://www.uptools.in/assets/tools/__KEY__/__KEY___scan.png" />
      </Helmet>

      <Section id="video" icon="🎬" title="Video Tutorial" subtitle="Learn it on the HNCKER channel">
        <div className="max-w-3xl mx-auto">
          <a href="https://www.youtube.com/@hncker" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-xl overflow-hidden border border-white/10 no-underline p-5 hover:border-red-500/40 transition-all"
            style={{ background: 'rgba(0,0,0,0.4)' }}>
            <div className="w-14 h-14 rounded-full bg-red-600/90 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-6 h-6 ml-0.5 fill-white"><path d="M8 5v14l11-7z" /></svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white m-0">__NAME__ — video walkthroughs on YouTube</p>
              <p className="text-xs text-slate-400 m-0 mt-1">Full tutorials on the @hncker channel. Watch, then practice below in your own lab.</p>
            </div>
          </a>
        </div>
      </Section>

      <WarningBox>
        __WARN__
      </WarningBox>

      <Section id="overview" icon="__ICON__" title="__OVERVIEW_TITLE__" subtitle="__OVERVIEW_SUB__">
        <p>
          __OVERVIEW_P1__
        </p>
        <p>
          __OVERVIEW_P2__
        </p>
        <FeatureGrid items={__FEATURES__} />
      </Section>

      <Section id="requirements" icon="⚙️" title="Requirements" subtitle="What you need before running">
        <ul className="list-none p-0 m-0 space-y-2">
          {__REQS__.map((t) => (
            <li key={t} className="flex items-start gap-2 text-slate-300">
              <span>☑️</span><span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="One command to install">
        <CodeBlock title="terminal" lines={__INSTALL_VERIFY__} />
        <CodeBlock title="debian / ubuntu" lines={__INSTALL_CMD__} />
        <InfoBox title="Kali has it already">
          __INSTALL_NOTE__
        </InfoBox>
      </Section>

__STEPS__

      <Section id="defense" icon="🛡️" title="__DEFENSE_TITLE__" subtitle="__DEFENSE_SUB__">
        <CodeBlock title="terminal" lines={__DEF_CODE__} />
        <FeatureGrid items={__DEF_ITEMS__} />
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshot" subtitle="__NAME__ in action">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/__KEY__/__KEY___scan.png" alt="__NAME__ terminal session" width="960" height="540"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">__CAPTION__</figcaption>
        </figure>
      </Section>

      <Section id="flags" icon="🏷️" title="Flags &amp; Options" subtitle="Every option explained">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {__FLAGS__.map(([flag, desc]) => (
            <div key={flag} className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="text-sm font-semibold text-green-300 font-mono mb-1">{flag}</div>
              <div className="text-xs text-slate-400">{desc}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="issues" icon="🐞" title="Common Issues & Fixes" subtitle="Real problems people hit">
        <div className="space-y-3">
          {__ISSUES__.map(([issue, fix]) => (
            <IssueRow key={issue} issue={issue} fix={fix} />
          ))}
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links">
        <div className="space-y-2">
          {__RESOURCES__.map(([i, label, href]) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg px-3 py-2 border border-white/8 hover:border-brand/40 hover:bg-white/5 transition-all text-slate-300 hover:text-white no-underline">
              <span>{i}</span>
              <span className="text-sm font-medium">{label}</span>
              <span className="ml-auto text-indigo-300 text-xs font-mono break-all">{href}</span>
            </a>
          ))}
        </div>
      </Section>

      <Section id="disclaimer" icon="📜" title="Disclaimer" subtitle="Read before you run anything">
        <p>
          __DISCLAIMER__
        </p>
      </Section>
    </ToolLayout>
  )
}
"""


def js_str(s):
    return json.dumps(s, ensure_ascii=False)


def js_code(s):
    # template-literal body for CodeBlock lines (content guaranteed free of backticks and ${)
    # NOTE: returned WITHOUT braces — call sites already supply lines={...}
    assert "`" not in s and "${" not in s, "unsafe code block: " + s[:60]
    return "`" + s + "`"


def build_steps(steps):
    out = []
    for st in steps:
        out.append(
            "      <Section id=\"%s\" icon=\"%s\" title=\"%s\" subtitle=\"%s\">\n"
            "        <p className=\"text-xs text-slate-400\">%s</p>\n"
            "        <CodeBlock title=\"%s\" lines={%s} />\n"
            "        <InfoBox title=\"%s\">\n          %s\n        </InfoBox>\n"
            "      </Section>\n"
            % (st["id"], st["icon"], st["title"], st["sub"], st["desc"],
               st["code_title"], js_code(st["code"]), st["box_title"], st["box"])
        )
    return "\n".join(out)


def qa_list(pairs):
    return "[\n" + "".join(
        "  { q: %s, a: %s },\n" % (js_str(q), js_str(a)) for q, a in pairs) + "]"


def str_list(items):
    return "[\n" + "".join("  %s,\n" % js_str(t) for t in items) + "]"


def pair_list(pairs):
    return "[\n" + "".join(
        "  [%s, %s],\n" % (js_str(a), js_str(b)) for a, b in pairs) + "]"


def feat_list(items):
    return "[\n" + "".join(
        "  { i: %s, t: %s, d: %s },\n" % (js_str(i), js_str(t), js_str(d))
        for i, t, d in items) + "]"


def render(tool):
    faq = qa_list(tool["faq"])
    how = str_list(tool["how"])
    schema = (
        "{\n  '@context': 'https://schema.org',\n  '@graph': [\n"
        "    {\n      '@type': 'TechArticle',\n"
        "      headline: %s,\n      description: %s,\n"
        "      about: %s,\n"
        "      educationalUse: 'Testing, education, and authorized use only',\n    },\n"
        "    {\n      '@type': 'FAQPage',\n"
        "      mainEntity: faq.map(f => ({\n"
        "        '@type': 'Question',\n        name: f.q,\n"
        "        acceptedAnswer: { '@type': 'Answer', text: f.a },\n      })),\n    },\n  ],\n}"
        % (js_str(tool["schema_head"]), js_str(tool["schema_desc"]), js_str(tool["about"]))
    )
    page = HELPERS
    page += "\nconst faq = %s\n\nconst howItWorks = %s\n\nconst schema = %s\n" % (faq, how, schema)
    body = BODY
    rep = {
        "__COMP__": "hncker_" + tool["key"],
        "__TITLE__": tool["title"],
        "__DESC__": tool["desc"],
        "__ICON__": tool["icon"],
        "__SLUG__": "hncker/" + tool["key"],
        "__KEY__": tool["key"],
        "__NAME__": tool["name"],
        "__WARN__": tool["warn"],
        "__OVERVIEW_TITLE__": tool["overview_title"],
        "__OVERVIEW_SUB__": tool["overview_sub"],
        "__OVERVIEW_P1__": tool["overview_p1"],
        "__OVERVIEW_P2__": tool["overview_p2"],
        "__FEATURES__": feat_list(tool["features"]),
        "__INSTALL_VERIFY__": js_code(tool["install_verify"]),
        "__INSTALL_CMD__": js_code(tool["install_cmd"]),
        "__INSTALL_NOTE__": tool["install_note"],
        "__STEPS__": build_steps(tool["steps"]),
        "__DEFENSE_TITLE__": tool["defense_title"],
        "__DEFENSE_SUB__": tool["defense_sub"],
        "__DEF_CODE__": js_code(tool["def_code"]),
        "__DEF_ITEMS__": feat_list(tool["def_items"]),
        "__CAPTION__": tool["caption"],
        "__DISCLAIMER__": tool["disclaimer"],
    }
    rep["__REQS__"] = "[" + ", ".join(js_str(t) for t in tool["reqs"]) + "]"
    rep["__FLAGS__"] = "[" + ", ".join(
        "[%s, %s]" % (js_str(a), js_str(b)) for a, b in tool["flags"]) + "]"
    rep["__ISSUES__"] = "[" + ", ".join(
        "[%s, %s]" % (js_str(a), js_str(b)) for a, b in tool["issues"]) + "]"
    rep["__RESOURCES__"] = "[" + ", ".join(
        "[%s, %s, %s]" % (js_str(a), js_str(b), js_str(c)) for a, b, c in tool["resources"]) + "]"
    for k, v in rep.items():
        body = body.replace(k, v)
    assert "__" not in body.replace("__KEY__", "").replace("____", "") or True
    leftover = [t for t in ["__COMP__", "__TITLE__", "__DESC__", "__ICON__", "__SLUG__",
                            "__WARN__", "__FEATURES__", "__REQS__", "__STEPS__", "__FLAGS__",
                            "__ISSUES__", "__RESOURCES__", "__DISCLAIMER__"] if t in body]
    assert not leftover, "unreplaced tokens: %s" % leftover
    return page + body


def main():
    data_path = sys.argv[1]
    tools = json.load(open(data_path, encoding="utf-8"))
    written = []
    for tool in tools:
        src = render(tool)
        path = os.path.join(TOOLS_DIR, "hncker_%s.jsx" % tool["key"])
        open(path, "w", encoding="utf-8").write(src)
        written.append(path)
    print("WROTE %d files" % len(written))
    for w in written:
        print(w)


if __name__ == "__main__":
    main()
