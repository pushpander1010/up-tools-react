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
  { q: "How does an agent detect a 402?", a: "The HTTP status code is 402. The response body holds the quote: amount, asset, network, destination, and expiry." },
  { q: "What is the x-payment header?", a: "It carries the payment proof on the retried request, such as a transaction reference the server can verify." },
  { q: "Should the agent pay any price blindly?", a: "Never. Set a max price per request and a daily budget. Skip anything above the cap and log it." },
  { q: "What if payment succeeds but content fails?", a: "Retry the request with the same proof first. If the server still fails, its refund or support policy applies." },
  { q: "Can one payment cover many requests?", a: "Only if the seller allows it, such as a day-pass token. By default, one payment unlocks one response." },
  { q: "How should errors be handled?", a: "Treat 402 as a quote, 200 as success, and anything else as a normal HTTP error with backoff and retries." },
]

const howItWorks = [
  "Send the request with no payment and expect either content or a 402 quote.",
  "Parse the 402 body for amount, asset, network, destination, and expiry time.",
  "Compare the amount against your per-request cap and remaining daily budget.",
  "Submit the on-chain payment, then retry the request with the proof attached.",
  "Verify you received HTTP 200 and the expected content shape before continuing.",
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: "How x402 Works: the Agent Request Flow",
      description: "Step-by-step x402 request flow for AI agents: quote parsing, budget checks, stablecoin payment, retry with proof, and error handling.",
      about: "x402 request flow for AI agent builders",
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

export default function x402_how_it_works_agents() {
  return (
    <ToolLayout
      title="How x402 Works: the Agent Request Flow"
      desc="How the x402 flow works for AI agents: read the quote, check the budget, pay in stablecoin, retry with proof, and handle errors."
      icon="9"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="crypto"
      slug="x402-how-it-works"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Section id="overview" icon="9" title="How x402 Works for Agents" subtitle="From first request to content in hand">
        <p>
          The x402 flow is a short conversation between two machines. The agent asks for something, the server names its price with a 402 response, the agent pays on-chain, and the retry with proof unlocks the content.
        </p>
        <p>
          Because every step is plain HTTP plus a blockchain payment, any agent framework can implement it in an afternoon. The skill is not the code, it is the budget discipline around it.
        </p>
        <FeatureGrid items={[
  { t: "Step 1: ask", d: "The agent makes a plain request. No credentials, no pre-registration." },
  { t: "Step 2: read quote", d: "The 402 body states amount, asset, network, pay-to address, and expiry." },
  { t: "Step 3: pay", d: "The agent submits the stablecoin transfer from its own wallet." },
  { t: "Step 4: receive", d: "The retry with payment proof returns the content and a success status." },
]} />
      </Section>

      <Section id="flow" icon="🔁" title="The Five-Message Flow" subtitle="Five messages, one result">
        <p className="text-xs text-slate-400">Follow this exact order in code: request, parse quote, budget check, pay, retry with proof.</p>
        <CodeBlock title="agent request flow" lines={`1. Agent: GET /dataset/top-stories
2. Server: 402, amount 0.02, asset USDC, network base
3. Agent: checks price against budget, pays 0.02 USDC
4. Agent: GET again with x-payment proof header
5. Server: verifies on-chain, returns 200 plus data`} />
        <InfoBox title="Builder tip">
          Design your agent to treat 402 as normal, not as an error. Log every quote with amount, asset, and network so spending stays visible and auditable.
        </InfoBox>
      </Section>

      <Section id="facts" icon="📌" title="Flow Mechanics" subtitle="Details that matter in code">
        <FeatureGrid items={[
  { t: "Discovery is automatic", d: "Agents need no price list upfront. The 402 response itself carries the full quote." },
  { t: "Budget check first", d: "A well-built agent compares the quote against a per-request cap and daily budget before paying." },
  { t: "Proof travels in headers", d: "Payment proof usually rides in an x-payment header on the retried request, keeping URLs clean." },
  { t: "Quotes expire", d: "Quotes carry a deadline, often a few minutes. Slow payers must fetch a fresh quote." },
]} />
      </Section>

      <Section id="issues" icon="🐞" title="Common Mistakes and Fixes" subtitle="What people get wrong">
        <div className="space-y-3">
          {[["Treating 402 as failure", "Map 402 to your quote handler, not your error handler. It is the start of the purchase, not the end."], ["Retrying without proof", "A second unpaid request just returns another 402. Attach payment proof before retrying."], ["Ignoring quote expiry", "Pay promptly or re-request the quote. Stale prices get rejected."]].map(([issue, fix]) => (
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
          Educational reference only. Test payment flows with tiny amounts first. Never give an agent an uncapped wallet.
        </p>
      </Section>
    </ToolLayout>
  )
}
