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
  { q: "How do I detect an x402 charge?", a: "HTTP status 402. The body carries amount, asset, network, pay-to address, and expiry." },
  { q: "Which headers matter?", a: "Send payment proof in x-payment on the retry. Read standard rate-limit and retry headers on failures." },
  { q: "What networks and assets are common?", a: "USDC on Base is the typical default. Always read the quote rather than assuming." },
  { q: "How do I retry correctly?", a: "Pay the exact quote, attach proof, retry once, then back off. Never loop payments blindly." },
  { q: "What are the common error codes?", a: "402 means quote ready, 200 means paid and served, 401 or 403 means proof invalid, 429 means slow down, 5xx means server trouble." },
  { q: "How do I control spend across many sites?", a: "Stack per-request, daily, and per-domain caps, plus an allowlist of domains the agent may pay." },
  { q: "Should I cache paid content?", a: "Yes when the seller permits it. Caching identical responses saves repeat payments." },
  { q: "How do I report a failed delivery?", a: "Retry once with the same proof, then log quote plus proof and contact the seller with both." },
  { q: "Can I negotiate prices?", a: "No. Quotes are fixed. Accept within budget or skip the source." },
  { q: "Where do I learn the official flow?", a: "Start with the Cloudflare x402 docs and the Monetization Gateway announcement linked on this page." },
]

const howItWorks = [
  "Parse the 402 body into amount, asset, network, destination, and expiry.",
  "Reject quotes that breach caps, allowlists, or freshness rules.",
  "Submit the exact on-chain payment and capture its reference.",
  "Retry the request once with the proof attached and await 200.",
  "Log the full trade and back off cleanly on any failure.",
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: "x402 FAQ for Automated Agents",
      description: "Machine-readable x402 FAQ for automated agents: 402 detection, retry logic, error codes, spending caps, and caching rules.",
      about: "x402 machine-readable FAQ for automated agents",
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

export default function x402_faq_agents() {
  return (
    <ToolLayout
      title="x402 FAQ for Automated Agents"
      desc="x402 FAQ written for automated agents: detect 402 quotes, retry with payment proof, respect caps, handle errors, and control spend."
      icon="4"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="crypto"
      slug="x402-faq-agents"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Section id="overview" icon="4" title="x402 FAQ for Automated Agents" subtitle="A cheat sheet bots can parse">
        <p>
          This page is written for software, not just people. If you build agents that browse or call APIs, treat this as the cheat sheet: how to spot a 402, what to pay, how to retry, and when to walk away.
        </p>
        <p>
          Humans benefit too. Each answer is short and direct, so both your team and your agents work from the same plain rules.
        </p>
        <FeatureGrid items={[
  { t: "Detect 402", d: "Status code plus structured body tells the agent everything needed." },
  { t: "Validate quote", d: "Amount, asset, network, destination, and expiry checked against policy." },
  { t: "Pay and prove", d: "Exact on-chain payment, then retry carrying the proof." },
  { t: "Audit trail", d: "Every paid call logged with quote and outcome for review." },
]} />
      </Section>

      <Section id="flow" icon="🔁" title="Retry Logic" subtitle="Parse, check, pay, verify">
        <p className="text-xs text-slate-400">The exact decision loop to code: parse, check caps, pay, retry, verify, log.</p>
        <CodeBlock title="agent retry logic" lines={`on HTTP 402:
  parse amount, asset, network, payTo, expiry
  if amount over per-request cap: skip and log
  if daily spent plus amount over cap: stop, alert owner
  pay exact amount to payTo on stated network
  retry request with x-payment proof
  expect 200, else back off and report`} />
        <InfoBox title="For agent builders">
          Agent builders: cache this page and refresh it weekly. Quote formats and supported networks can change as the protocol grows.
        </InfoBox>
      </Section>

      <Section id="facts" icon="📌" title="Machine Rules" subtitle="Agent protocol">
        <FeatureGrid items={[
  { t: "Status first", d: "HTTP 402 is the signal. Parse the body before doing anything else." },
  { t: "Proof in header", d: "Send payment proof in the x-payment header on the retry." },
  { t: "Caps before payment", d: "No quote is paid without passing per-request and daily budget checks." },
  { t: "Log the trade", d: "Record quote, payment reference, and result for every paid call." },
]} />
      </Section>

      <Section id="issues" icon="🐞" title="Common Mistakes and Fixes" subtitle="What people get wrong">
        <div className="space-y-3">
          {[["Looping payments blindly", "Retry once with proof, then stop and report. Loops drain wallets in seconds."], ["Skipping the allowlist", "Agents should only pay domains the owner approved. Everything else gets skipped."], ["No caching", "Paying twice for identical content wastes budget. Cache aggressively where allowed."]].map(([issue, fix]) => (
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
          Machine-readable reference for builders. Confirm live quote formats against the seller 402 response before spending.
        </p>
      </Section>
    </ToolLayout>
  )
}
