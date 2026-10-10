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

const faq = [
  { q: "Which endpoints should I charge for first?", a: "The ones bots hammer: search, datasets, and AI features. Leave marketing pages and docs free." },
  { q: "Will paywalls hurt my SEO?", a: "Only if you block crawlers and humans from content pages. Charge API-style endpoints, not articles." },
  { q: "How do I announce the change?", a: "Publish the price list, keep a free tier, and give regulars notice before flipping the switch." },
  { q: "Should existing API key users move to x402?", a: "No need. Let key holders stay on plans and use x402 for anonymous agent traffic." },
  { q: "How do I handle abuse?", a: "Rate limits plus per-request prices work together. Aggressive scrapers pay more and get throttled sooner." },
  { q: "What metrics prove it works?", a: "Quote-to-payment conversion, revenue per endpoint, and repeat buyers. Rising repeats mean real value." },
]

const howItWorks = [
  "Rank endpoints by agent hits and serving cost using your logs.",
  "Keep pages, docs, and one sample endpoint free.",
  "Put 402 quotes on the high-traffic data and AI endpoints.",
  "Test the full pay-and-receive loop with a real agent on staging.",
  "Launch, publish prices, and track revenue per endpoint weekly.",
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: "Monetize Your API With x402",
      description: "How to monetize an API with x402 per-request pricing: choosing endpoints, keeping humans free, testing, and tracking revenue.",
      about: "monetizing an existing API with per-request x402 pricing",
      educationalUse: 'Education and reference only',
    },
    {
      '@type': 'FAQPage',
      mainEntity: faq.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
}

export default function x402_monetize_api() {
  return (
    <ToolLayout
      title="Monetize Your API With x402"
      desc="Monetize your API with x402 per-request pricing: pick chargeable endpoints, keep humans free, test with agents, and track revenue."
      icon="9"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="crypto"
      slug="x402-monetize-api"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Section id="overview" icon="9" title="Monetize Your API With x402" subtitle="Turn bot traffic into revenue">
        <p>
          If bots already hammer your API, you are paying to serve customers who never pay you. x402 flips that: the endpoints agents love start charging tiny per-request prices while humans keep browsing free.
        </p>
        <p>
          Rollout is gradual, not a big bang. Pick one endpoint, price it from measured cost, test with a real agent, and expand to the next magnet once revenue flows.
        </p>
        <FeatureGrid items={[
  { t: "Charge the magnets", d: "Data and search endpoints agents love become revenue instead of cost." },
  { t: "Free trust layer", d: "Docs and samples stay open so new buyers can evaluate you." },
  { t: "Keep both models", d: "Plans for partners, per-request for the anonymous long tail." },
  { t: "Grow on data", d: "Endpoint revenue tells you what to improve and what to raise." },
]} />
      </Section>

      <Section id="flow" icon="🔁" title="Split Example" subtitle="Doors free, magnets paid">
        <p className="text-xs text-slate-400">Free doors for trust, paid magnets for revenue, both models living side by side.</p>
        <CodeBlock title="what to charge" lines={`homepage        -> free (humans plus SEO)
docs            -> free (builds trust)
api search      -> 0.005 (bot magnet)
api full data   -> 0.02 (heavy query)
api AI summary  -> 0.05 (GPU cost)
Charge the magnets, keep doors free.`} />
        <InfoBox title="Where to charge">
          Do not paywall your homepage or signup flow. Charge the data endpoints agents hammer and keep the front door free.
        </InfoBox>
      </Section>

      <Section id="facts" icon="📌" title="Launch Notes" subtitle="Rollout wisdom">
        <FeatureGrid items={[
  { t: "Find bot magnets", d: "Logs show which endpoints agents hit hardest. Those are your first candidates." },
  { t: "Free doors stay free", d: "Homepage, docs, and samples remain open for humans, SEO, and trust." },
  { t: "Test with agents", d: "Point a test agent at staging and confirm the 402 to 200 loop before launch." },
  { t: "Revenue per endpoint", d: "Track earnings per route and double down on what agents actually buy." },
]} />
      </Section>

      <Section id="issues" icon="🐞" title="Common Mistakes and Fixes" subtitle="What people get wrong">
        <div className="space-y-3">
          {[["Paywalling everything at once", "Start with one endpoint. A full paywall on day one scares away both bots and humans."], ["No free tier", "Agents need a sample to trust you. Keep one endpoint free forever."], ["Ignoring conversion data", "If quotes never convert, the price or the content is wrong. Fix it before expanding."]].map(([issue, fix]) => (
            <IssueRow key={issue} issue={issue} fix={fix} />
          ))}
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links">
        <div className="space-y-2">
          {[["Docs", "Cloudflare x402 docs", "https://developers.cloudflare.com/agents/tools/payments/x402/"], ["Docs", "Cloudflare agent payments overview", "https://developers.cloudflare.com/agents/tools/payments/"], ["News", "Cloudflare Monetization Gateway beta", "https://blog.cloudflare.com/monetization-gateway-beta/"]].map(([i, label, href]) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg px-3 py-2 border border-white/8 hover:border-brand/40 hover:bg-white/5 transition-all text-slate-300 hover:text-white no-underline">
              <span>{i}</span>
              <span className="text-sm font-medium">{label}</span>
              <span className="ml-auto text-indigo-300 text-xs font-mono break-all">{href}</span>
            </a>
          ))}
        </div>
      </Section>

      <Section id="disclaimer" icon="📜" title="Disclaimer" subtitle="Read before you act">
        <p>
          Educational business guidance with example prices, not financial advice. Validate demand before paywalling anything.
        </p>
      </Section>
    </ToolLayout>
  )
}
