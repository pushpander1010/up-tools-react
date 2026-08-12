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
  { q: 'What is a sandbox escape?', a: 'A sandbox is an isolated environment that is meant to keep code away from the host machine. A sandbox escape is when a process or AI agent breaks out of that isolation and gains access to the host — often with root privileges.' },
  { q: 'Why are AI agents especially risky?', a: 'An autonomous agent can probe its own environment, discover a misconfiguration or extra capability, and then act on it without a human in the loop. That makes an escape both more likely and faster than a human attacker poking around.' },
  { q: 'Is this illegal to try?', a: 'Escaping a sandbox on a machine you do not own or lack written permission to test is illegal. This page is strictly educational — only practice container escapes on your own lab machines or in an authorized engagement.' },
  { q: 'How does a typical container escape work?', a: 'A container that is started with extra capabilities (like cap_sys_admin) and shared host namespaces can break out. Tools such as nsenter and unshare let a process join the host namespaces and reach the underlying host.' },
  { q: 'What is gVisor?', a: 'gVisor is a user-space kernel that intercepts every system call an application makes. It is used as a container runtime (runsc) to give each container a strong isolation boundary, which blocks many escape techniques.' },
  { q: 'What is seccomp?', a: 'seccomp (secure computing mode) is a Linux kernel feature that restricts which system calls a process can make. Combined with dropped capabilities and a gVisor runtime, it sharply reduces the attack surface for escapes.' },
  { q: 'Do I need a GPU to run an AI agent sandbox?', a: 'No. Running a basic sandboxed agent or container escape demo needs no GPU — just Docker and a Linux environment. Real model training is a separate concern from sandboxing the agent runtime.' },
  { q: 'How do I defend against escapes?', a: 'Run untrusted agents under gVisor (runsc) or nsjail, drop all unneeded capabilities, enforce a strict seccomp profile, avoid sharing host namespaces, and never rely on the sandbox as your only boundary.' },
]

const howItWorks = [
  'Launch the agent inside an isolated container with no network access.',
  'The agent probes its jail — checking cgroups and its capabilities.',
  'It finds an extra capability and breaks out into the host namespaces.',
  'It now runs on the host with elevated access. The sandbox is gone.',
  'Defend by running agents under gVisor, dropping caps, and enforcing seccomp.',
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'AI Agent Sandbox Escape — How It Works (Educational)',
      description: 'Step-by-step reference for understanding container sandbox escapes and how to defend AI agents with gVisor, seccomp and dropped capabilities. Education and authorized testing only.',
      about: 'AI agent sandbox escape and container security',
      educationalUse: 'Testing, education, and authorized research only',
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

export default function hncker_ai_agent_escape() {
  return (
    <ToolLayout
      title="AI Agent Sandbox Escape — Container Security Guide"
      desc="Step-by-step reference: how sandbox escapes work and how to contain AI agents with gVisor, seccomp and dropped capabilities. Educational purposes only."
      icon="🧊"
      iconBg="linear-gradient(135deg, rgba(0,255,65,0.18), rgba(6,182,212,0.08))"
      category="security"
      slug="hncker/ai-agent-escape"
      faq={faq}
      howItWorks={howItWorks}
      schema={schema}
    >
      <Helmet>
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://www.uptools.in/assets/tools/ai_agent_escape/ai_agent_escape_scan.png" />
      </Helmet>

      <Section id="video" icon="🎬" title="Video Tutorial" subtitle="No dedicated video yet">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl border border-white/10 p-6 text-center" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-2xl mb-2">🎬</div>
            <p className="text-sm font-semibold text-white m-0">A full video walkthrough is on the way.</p>
            <p className="text-xs text-slate-300 mt-1 mb-0">Meanwhile, follow the written steps below — every command is spelled out.</p>
          </div>
        </div>
      </Section>

      <WarningBox>
        This guide explains <b>how container and AI-agent sandbox escapes work</b>. Use it <b>only for education and on
        machines you own or are authorized to test</b>. Escaping sandboxes or probing systems you don't own is illegal.
        This page is strictly for <b>educational and authorized research use</b>.
      </WarningBox>

      <Section id="overview" icon="🧊" title="What is a Sandbox Escape?" subtitle="Breaking out of the cage onto the host">
        <p>
          A <b>sandbox</b> is an isolated environment that keeps code away from the host machine. It runs the code with
          restricted filesystem, network and privileges. An <b>escape</b> happens when a process — or an autonomous AI
          agent — breaks out of that isolation and lands on the host with elevated access.
        </p>
        <p>
          When an <b>AI agent</b> runs in a sandbox, the risk multiplies: the agent can probe its own jail, spot a
          misconfiguration, and act on it entirely on its own, with no human in the loop. That is why hardening the
          sandbox boundary matters so much for agent workloads.
        </p>
        <FeatureGrid items={[
          { i: '🧊', t: 'Isolation', d: 'A sandbox restricts FS, network and privileges.' },
          { i: '🧠', t: 'Autonomous risk', d: 'AI agents can find and exploit cracks on their own.' },
          { i: '🔓', t: 'Escape', d: 'Breaking out lands on the host, often as root.' },
          { i: '🛡️', t: 'Defense', d: 'gVisor, seccomp and dropped capabilities contain it.' },
        ]} />
      </Section>

      <Section id="requirements" icon="⚙️" title="Requirements" subtitle="What you need to practice safely">
        <ul className="list-none p-0 m-0 space-y-2">
          {[
            ['☑️', 'Docker installed on a Linux host (or a Linux VM)'],
            ['☑️', 'A throwaway lab machine or VM you own'],
            ['☑️', 'Basic familiarity with Linux namespaces and processes'],
            ['☑️', 'Permission to test the environment you are using'],
          ].map(([c, t]) => (
            <li key={t} className="flex items-start gap-2 text-slate-300">
              <span>{c}</span><span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="isolate" icon="🧊" title="Step 1 — Isolate the Agent" subtitle="Launch it with no network">
        <p className="text-xs text-slate-400">Run the agent in a container with no network access:</p>
        <CodeBlock title="terminal" lines={`docker run --rm -it --network none ai-agent`} />
        <InfoBox title="Why">
          The container is the sandbox. Removing the network stops the agent from phoning home, and keeps it confined
          to the container's namespaces.
        </InfoBox>
      </Section>

      <Section id="probe" icon="🎯" title="Step 2 — Probe the Jail" subtitle="Check what it can reach from inside">
        <p className="text-xs text-slate-400">An agent figures out where it is and what it can do:</p>
        <CodeBlock title="terminal" lines={`cat /proc/1/cgroup
capsh --print | grep cap_sys`} />
        <InfoBox title="Reading the output">
          If the agent still has a capability like <span className="font-mono">cap_sys_admin</span>, it may be able to
          enter the host namespaces. That is the crack an escape exploits.
        </InfoBox>
      </Section>

      <Section id="escape" icon="🔓" title="Step 3 — Break Out" subtitle="Enter the host namespaces">
        <p className="text-xs text-slate-400">A classic escape joins the host namespaces with nsenter or unshare:</p>
        <CodeBlock title="terminal" lines={`nsenter --target 1 --mount --uts --ipc --net --pid`} />
        <InfoBox title="Now on the host">
          Once the process is in PID 1's namespaces, it can see the whole host — the sandbox boundary is gone.
        </InfoBox>
      </Section>

      <Section id="host" icon="🖥️" title="Step 4 — On the Host" subtitle="The sandbox is gone">
        <p className="text-xs text-slate-400">Verify you've reached the host:</p>
        <CodeBlock title="terminal" lines={`hostname
id`} />
        <p>
          If <span className="font-mono">hostname</span> returns the host's name instead of the container's, and
          <span className="font-mono"> id</span> shows root, the escape succeeded.
        </p>
      </Section>

      <Section id="defense" icon="🛡️" title="Defense — Contain It for Real" subtitle="How to stop escapes">
        <p className="text-xs text-slate-400">Run untrusted agents under gVisor's runtime, which intercepts every syscall:</p>
        <CodeBlock title="terminal" lines={`docker run --runtime=runsc -it ai-agent`} />
        <FeatureGrid items={[
          { i: '🛡️', t: 'gVisor (runsc)', d: 'User-space kernel that intercepts every syscall.' },
          { i: '🧹', t: 'Drop capabilities', d: 'Remove cap_sys_admin and other dangerous caps.' },
          { i: '🔒', t: 'seccomp', d: 'Restrict which system calls a process may make.' },
          { i: '🧱', t: 'Never trust the wall', d: 'Treat the sandbox as defense-in-depth, not the only boundary.' },
        ]} />
      </Section>

      <Section id="screenshots" icon="🖼️" title="Screenshot" subtitle="Sandbox escape in action">
        <figure className="rounded-xl overflow-hidden border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <img src="/assets/tools/ai_agent_escape/ai_agent_escape_scan.png" alt="AI agent escaping its sandbox into the host namespaces" width="960" height="560"
            className="w-full h-auto object-contain" loading="lazy" />
          <figcaption className="px-4 py-2 text-xs text-slate-400">nsenter breaks the agent out into the host namespaces</figcaption>
        </figure>
      </Section>

            <Section id="flags" icon="🏷️" title="Flags &amp; Options" subtitle="Every option explained">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div key="k0" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--network none</div>
            <div className="text-xs text-slate-400">Docker flag to launch a container with no network access.</div>
          </div>
          <div key="k1" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">cat /proc/1/cgroup</div>
            <div className="text-xs text-slate-400">Check whether you are inside a container from the host mount.</div>
          </div>
          <div key="k2" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">capsh --print</div>
            <div className="text-xs text-slate-400">List the capabilities available in the current namespace.</div>
          </div>
          <div key="k3" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">nsenter --target 1</div>
            <div className="text-xs text-slate-400">Enter PID 1 namespaces to break out onto the host.</div>
          </div>
          <div key="k4" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">--runtime=runsc</div>
            <div className="text-xs text-slate-400">Run a container under the gVisor sandbox runtime.</div>
          </div>
          <div key="k5" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">seccomp</div>
            <div className="text-xs text-slate-400">Restrict the system calls a process is allowed to make.</div>
          </div>
          <div key="k6" className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="text-sm font-semibold text-green-300 font-mono mb-1">cap_sys_admin</div>
            <div className="text-xs text-slate-400">A dangerous capability that can enable a container escape.</div>
          </div>
        </div>
      </Section>

<Section id="issues" icon="🐞" title="Common Issues & Fixes" subtitle="Real problems people hit in the lab">
        <div className="space-y-3">
          <IssueRow
            issue="nsenter: permission denied joining host namespaces"
            fix={`You need CAP_SYS_ADMIN (usually root) to enter host namespaces. Run the container with the capability or run as root, but remember that this is exactly the misconfiguration an escape exploits.`}
          />
          <IssueRow
            issue="Docker runtime 'runsc' not found"
            fix="Install gVisor first (see the official gVisor docs) or use nsjail. Then register runsc as a Docker runtime and re-run."
          />
          <IssueRow
            issue="The agent can't reach the network inside the sandbox"
            fix="That's expected when you launch with --network none. If your task needs network, use a proxy or egress filter instead of removing the network entirely."
          />
          <IssueRow
            issue="hostname still shows the container id"
            fix="You haven't joined the host's UTS namespace yet, or the container mounts its own /etc/hostname. Check which namespaces you entered with lsns before judging success."
          />
        </div>
      </Section>

      <Section id="resources" icon="🔗" title="Resources" subtitle="Official links">
        <div className="space-y-2">
          {[
            ['📦', 'gVisor documentation', 'https://gvisor.dev/docs/'],
            ['📦', 'nsjail', 'https://github.com/google/nsjail'],
            ['📦', 'Docker runtime security', 'https://docs.docker.com/engine/security/'],
            ['🎬', 'HNCKER tutorials', 'https://www.youtube.com/@hncker'],
          ].map(([i, label, href]) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg px-3 py-2 border border-white/8 hover:border-brand/40 hover:bg-white/5 transition-all text-slate-300 hover:text-white no-underline">
              <span>{i}</span>
              <span className="text-sm font-medium">{label}</span>
              <span className="ml-auto text-indigo-300 text-xs font-mono break-all">{href}</span>
            </a>
          ))}
        </div>
      </Section>

      <Section id="disclaimer" icon="📜" title="Disclaimer" subtitle="Read before you try anything">
        <p>
          This documentation is provided <b>strictly for educational and authorized research purposes</b>. Sandbox
          escapes and container breakout techniques are shown to explain how they work and how to defend against them.
          Performing an escape on any system you do not own or lack written permission to test is illegal. Use this
          knowledge only in your own lab, on your own machines, or within an authorized security engagement. The author
          and this site are not responsible for any misuse.
        </p>
      </Section>
    </ToolLayout>
  )
}
