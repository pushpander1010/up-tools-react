import { Helmet } from 'react-helmet-async'
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

const faq = [
  { q: "What is Burp Suite?", a: "Burp Suite is the standard web-hacking proxy: your browser sends traffic through it, and it shows every request and response so you can read, pause, edit and replay them. Security testers use it to find broken access control, injection and logic bugs in web apps." },
  { q: "Is Burp Suite illegal?", a: "The Community Edition is free and legal for learning. Routing someone else's traffic through it or testing sites you do not own is illegal. Practice on PortSwigger's free Web Security Academy labs or DVWA on localhost." },
  { q: "What is Intercept?", a: "Intercept pauses each browser request inside Burp before it reaches the server, so you can read and edit it — change a price, a user ID, a role — then forward it. That is how testers prove the server trusts client input too much." },
  { q: "What is Repeater?", a: "Repeater lets you resend one request again and again with small edits and compare responses. Change one parameter at a time and watch what the server does — the core loop of manual web testing." },
  { q: "What is Intruder?", a: "Intruder automates payload lists through marked positions: usernames, passwords, IDs. In Community Edition it is rate-limited (single thread), which is fine for labs. Mark positions with add markers, pick a payload list, start the attack." },
  { q: "How do I make my browser trust Burp?", a: "Burp re-signs HTTPS with its own CA certificate, so install it: with the proxy on, visit http://burpsuite, download cacert.der, and import it into your browser as a trusted authority. Without this step HTTPS sites show certificate errors." },
  { q: "What is Decoder?", a: "Decoder converts data between formats — URL, Base64, hex, HTML entities — so you can read encoded cookies and tokens, edit them, and re-encode. Most session weirdness unravels here." },
  { q: "How do I protect my app from Burp-style testing?", a: "Validate everything server-side, use random CSRF tokens, set HttpOnly + Secure + SameSite cookies, rate-limit logins, and never trust prices, roles or IDs sent by the browser. Then invite testing on your own staging via the free labs." },
]

const howItWorks = [
  "Install Burp, set browser proxy to 127.0.0.1:8080.",
  "Install the Burp CA so HTTPS loads cleanly.",
  "Intercept a lab login and edit one field.",
  "Replay with Repeater, then fuzz with Intruder.",
  "Fix findings: server validation, CSRF, cookie flags.",
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: "Burp Suite — Web Proxy Guide (Educational)",
      description: "Step-by-step Burp Suite reference: intercept proxy, Repeater, Intruder, Decoder, and web-app defense.",
      about: "Burp Suite web proxy",
      educationalUse: 'Testing, education, and authorized use only',
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

export default function hncker_burp() {
  return (
    <ToolLayout
      title="Burp Suite — Web Proxy Guide"
      desc="Step-by-step Burp Suite reference: intercept, Repeater, Intruder and Decoder on your own lab apps (PortSwigger labs, DVWA). Educational use only."
      icon="🥺"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="security"
      slug="hncker/burp"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://www.uptools.in/assets/tools/burp/burp_scan.png" />
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
              <p className="text-sm font-semibold text-white m-0">Burp Suite — video walkthroughs on YouTube</p>
              <p className="text-xs text-slate-400 m-0 mt-1">Full tutorials on the @hncker channel. Watch, then practice below in your own lab.</p>
            </div>
          </a>
        </div>
      </Section>

      <WarningBox>
        Burp Suite intercepts and alters live web traffic. Use it <b>only on your own lab apps (PortSwigger Academy, DVWA) or targets with written permission</b>. Testing any other site is illegal. This page is for <b>educational and authorized use only</b>.
      </WarningBox>

      <Section id="overview" icon="🥺" title="What is Burp Suite?" subtitle="Read and edit live web traffic">
        <p>
          <b>Burp Suite</b> sits between your browser and the server, showing every request and response. Pause a login, change the username to an admin's, forward it — if the server obeys, you just found broken access control.
        </p>
        <p>
          Learn the proxy on PortSwigger's free labs and DVWA, then turn the same lens on your own apps: every tampered request that succeeds is a server-side fix waiting to happen.
        </p>
        <FeatureGrid items={[
  { i: "🔎", t: "Intercept proxy", d: "Pause and edit live requests." },
  { i: "🔁", t: "Repeater", d: "Replay one request with tweaks." },
  { i: "🚀", t: "Intruder", d: "Automate payload lists (lab use)." },
  { i: "🔢", t: "Decoder + Comparer", d: "Decode tokens, diff responses." },
]} />
      </Section>

      <Section id="requirements" icon="⚙️" title="Requirements" subtitle="What you need before running">
        <ul className="list-none p-0 m-0 space-y-2">
          {["Kali Linux (pre-installed) or any OS + Java", "Firefox/Chromium with proxy set to 127.0.0.1:8080", "A lab target: PortSwigger Academy labs or DVWA", "Written permission if anything is not yours"].map((t) => (
            <li key={t} className="flex items-start gap-2 text-slate-300">
              <span>☑️</span><span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="installation" icon="🛠️" title="Installation" subtitle="One command to install">
        <CodeBlock title="terminal" lines={`burpsuite --help
# Burp Suite Community ready`} />
        <CodeBlock title="debian / ubuntu" lines={`sudo apt update
sudo apt install burpsuite`} />
        <InfoBox title="Kali has it already">
          On Kali Linux Burp Suite Community is pre-installed. Elsewhere download it free from <span className="font-mono">portswigger.net/burp/communitydownload</span> (needs Java, bundled in the installer).
        </InfoBox>
      </Section>

      <Section id="intercept" icon="🚦" title="Step 1 — Intercept a Request" subtitle="Pause and read a login">
        <p className="text-xs text-slate-400">Turn Intercept on, log into your DVWA lab, and read the raw request:</p>
        <CodeBlock title="intercepted request" lines={`POST /login HTTP/1.1
username=admin&password=wrong
# 302 redirect vs 200 error: different = oracle`} />
        <InfoBox title="Read everything">
          Every line is editable: method, path, headers, body. Change one thing, forward, and watch the response. That loop is 80 percent of web testing.
        </InfoBox>
      </Section>

      <Section id="repeater" icon="🔁" title="Step 2 — Repeater" subtitle="Replay with edits">
        <p className="text-xs text-slate-400">Replay one request with small edits to prove weak checks:</p>
        <CodeBlock title="repeater" lines={`GET /profile?user=7  -> 200 Alice
GET /profile?user=8  -> 200 Bob (not you)
# IDOR: server never checked ownership`} />
        <InfoBox title="Tweak and resend">
          Send anything interesting with right-click to Repeater. Tweak, send, compare — status codes and response length tell you what worked.
        </InfoBox>
      </Section>

      <Section id="intruder" icon="🚀" title="Step 3 — Intruder (Lab Only)" subtitle="Automate payloads">
        <p className="text-xs text-slate-400">Fuzz a lab login field with a wordlist:</p>
        <CodeBlock title="intruder" lines={`POST /login: password=SECTIONrockyou.txtSECTION
# 302 on password=letmein: found it`} />
        <InfoBox title="Fuzz the field">
          Mark the password field, load rockyou.txt, start the attack. Community speed is throttled, which keeps labs safe — watch status codes flip on the right guess.
        </InfoBox>
      </Section>

      <Section id="decoder" icon="🔢" title="Step 4 — Decoder" subtitle="Read encoded data">
        <p className="text-xs text-slate-400">Decode a suspicious cookie or token:</p>
        <CodeBlock title="decoder" lines={`YWRtaW46dHJ1ZQ==
# Base64 decode -> admin:true (do not trust this)`} />
        <InfoBox title="Decode first">
          Paste any encoded cookie here first. Half of all session bugs become obvious once you can read what the server actually stored.
        </InfoBox>
      </Section>


      <Section id="defense" icon="🛡️" title="Defense — Harden Your Web App" subtitle="Fix what the proxy reveals">
        <CodeBlock title="terminal" lines={`Content-Security-Policy: default-src 'self'
# + HttpOnly + Secure + SameSite cookies`} />
        <FeatureGrid items={[
  { i: "🍪", t: "HttpOnly cookies", d: "Stolen XSS cannot read session tokens." },
  { i: "🔒", t: "CSRF tokens", d: "Random per-form tokens kill replay." },
  { i: "⏱️", t: "Rate limits", d: "Slow brute force to a crawl." },
  { i: "📋", t: "Server checks", d: "Never trust client-side validation." },
]} />
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshot" subtitle="Burp Suite in action">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/burp/burp_scan.png" alt="Burp Suite terminal session" width="960" height="540"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">Burp Suite intercepting a login request</figcaption>
        </figure>
      </Section>

      <Section id="flags" icon="🏷️" title="Flags &amp; Options" subtitle="Every option explained">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[["Intercept on/off", "Master switch: pause requests or let them flow."], ["Forward / Drop", "Send the paused request on, or kill it."], ["Add markers", "Mark Intruder payload positions with section signs."], ["Payloads", "Wordlists fed into marked positions."], ["Target scope", "Limit tools to your lab host only."], ["Proxy history", "Every request/response, searchable. "], ["Decoder tabs", "Decode as / Encode as chains."], ["Project options", "Upstream proxy, TLS, display filters."]].map(([flag, desc]) => (
            <div key={flag} className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="text-sm font-semibold text-green-300 font-mono mb-1">{flag}</div>
              <div className="text-xs text-slate-400">{desc}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="issues" icon="🐞" title="Common Issues & Fixes" subtitle="Real problems people hit">
        <div className="space-y-3">
          {[["Browser shows certificate errors on HTTPS", "The Burp CA is not trusted yet. With the proxy on visit http://burpsuite, download cacert.der, import it as a browser authority, and restart the browser."], ["Nothing appears in Proxy history", "The browser is not using the proxy, or the URL is out of scope. Set 127.0.0.1:8080 in browser proxy settings (FoxyProxy helps) and check Intercept is on."], ["Intruder runs very slowly", "Community Edition is single-threaded by design. That is normal — shrink the wordlist for labs or upgrade only if you do this professionally."], ["Localhost app refuses connection via proxy", "Some browsers bypass proxies for localhost. Use 127.0.0.1.nip.io style hostnames or toggle the browser's proxy-all setting so loopback flows through Burp."]].map(([issue, fix]) => (
            <IssueRow key={issue} issue={issue} fix={fix} />
          ))}
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links">
        <div className="space-y-2">
          {[["📚", "PortSwigger Academy (free labs)", "https://portswigger.net/web-security"], ["📖", "Burp docs", "https://portswigger.net/burp/documentation"], ["🎬", "HNCKER tutorials", "https://www.youtube.com/@hncker"]].map(([i, label, href]) => (
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
          This documentation is provided <b>strictly for educational and authorized purposes</b>. Burp Suite intercepts and modifies live web traffic, so use it only on your own lab apps (PortSwigger Web Security Academy, DVWA) or targets with written permission. Testing anyone else is illegal. The author and this site are not responsible for any misuse.
        </p>
      </Section>
    </ToolLayout>
  )
}
