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
  { q: "Where do I start with pricing?", a: "Measure the cost of serving each endpoint, add your margin, then round to a clean number. Start low and raise with demand." },
  { q: "Should anything be free?", a: "Yes, at least a sample. Agents cannot judge quality without trying, and free tiers build trust." },
  { q: "How do I price AI-generated answers?", a: "Track GPU cost per answer and add margin. These are your most expensive endpoints, so price them highest." },
  { q: "What if agents stop paying after a hike?", a: "You raised too fast or without added value. Roll back, announce changes, and move gradually." },
  { q: "Should heavy users get discounts?", a: "Offer volume passes or flat plans for regulars while keeping per-request prices for casual agents." },
  { q: "How do I handle currency swings?", a: "Price in dollars and settle in stablecoin, so quotes stay stable regardless of crypto markets." },
]

const howItWorks = [
  "Measure the true serving cost of each endpoint you plan to charge for.",
  "Add your target margin and round to a clean stablecoin amount.",
  "Keep one endpoint free so agents can verify quality first.",
  "Publish the price list where both humans and agents can read it.",
  "Track quote-to-payment conversion and adjust monthly.",
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: "Pricing Content for AI Agents",
      description: "Pricing strategies for AI agent content: cost-plus tiers, free samples, clean numbers, and conversion tracking.",
      about: "pricing content for AI agent buyers",
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

export default function x402_pricing_strategies() {
  return (
    <ToolLayout
      title="Pricing Content for AI Agents"
      desc="Pricing content for AI agents: cost-plus tiers, free samples, and simple rules for setting per-request prices that bots actually pay."
      icon="7"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="crypto"
      slug="x402-pricing-strategies"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Section id="overview" icon="7" title="Pricing Content for AI Agents" subtitle="Prices bots understand and pay">
        <p>
          Pricing for agents is simpler than pricing for humans: no psychology tricks, just clear numbers tied to real costs. An agent compares your quote against its budget in milliseconds and either pays or walks away.
        </p>
        <p>
          The winning formula is a free sample, two or three clean tiers, and a published list. Measure conversion the way shops measure footfall, and adjust until quotes turn into payments.
        </p>
        <FeatureGrid items={[
  { t: "Cost-plus base", d: "Server plus data plus margin sets the floor. Never price below true cost." },
  { t: "Free sample", d: "One free endpoint proves value and pulls agents into paid tiers." },
  { t: "Three tiers max", d: "Cheap, standard, and premium. More tiers confuse both humans and bots." },
  { t: "Watch conversion", d: "Paid hits divided by 402 quotes tells you if a price is right." },
]} />
      </Section>

      <Section id="flow" icon="🔁" title="Tier Example" subtitle="Cost in, price out">
        <p className="text-xs text-slate-400">Tie every price to a measured cost. Samples are free, lookups are cheap, heavy AI costs most.</p>
        <CodeBlock title="endpoint pricing map" lines={`endpoint pricing map:
  hello sample   -> free (quality proof)
  search         -> 0.002 (cheap compute)
  full dataset   -> 0.02 (heavy query)
  AI summary     -> 0.05 (GPU cost)
Map each endpoint to real cost plus margin.`} />
        <InfoBox title="Trust builder">
          Publish a simple price list agents can read. Surprise pricing kills trust, while a clear list gets bookmarked and revisited.
        </InfoBox>
      </Section>

      <Section id="facts" icon="📌" title="Pricing Habits" subtitle="Habits of good pricers">
        <FeatureGrid items={[
  { t: "Free samples convert", d: "A free hello endpoint lets agents verify quality before spending a cent." },
  { t: "Tier by cost", d: "Cheap lookups cost little, GPU summaries cost more. Price follows compute." },
  { t: "Round numbers win", d: "0.01 and 0.02 are easy to budget. Odd fractions invite rounding confusion." },
  { t: "Review monthly", d: "Traffic and costs shift. Revisit prices once a month, not once a year." },
]} />
      </Section>

      <Section id="issues" icon="🐞" title="Common Mistakes and Fixes" subtitle="What people get wrong">
        <div className="space-y-3">
          {[["Pricing below cost", "Measure serving cost first. Sub-cent quotes with no margin bleed money at scale."], ["Too many tiers", "Agents handle simple lists best. Three tiers maximum, then stop."], ["Hiding the price list", "Unpublished prices mean agents cannot budget. Publish the list and watch conversion rise."]].map(([issue, fix]) => (
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
          Educational pricing guidance with example numbers, not financial advice. Base prices on your measured costs.
        </p>
      </Section>
    </ToolLayout>
  )
}
