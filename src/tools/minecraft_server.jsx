import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'

const SERVER_IP = '161.118.188.85'
const SERVER_PORT = '25565'

export default function minecraft_server() {
  const [copied, setCopied] = useState(false)
  const address = `${SERVER_IP}:${SERVER_PORT}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) { /* clipboard blocked */ }
  }

  return (
    <ToolLayout
      title="Minecraft Server — Free Java Server"
      desc="Join our free public Minecraft Java server hosted on UpTools. Copy the server address, add it in Multiplayer, and play survival with friends — no signup needed."
      icon="⛏️"
      iconBg="rgba(34,197,94,0.12)"
      category="fun"
      slug="minecraft-server"
      faq={[
        {
          q: 'Is the Minecraft server free?',
          a: 'Yes — the server is completely free to join. You just need a paid Minecraft Java edition account (Mojang account), since the server runs in online-mode.'
        },
        {
          q: 'Which Minecraft version do I need?',
          a: 'The server runs the latest Minecraft Java release (26.2). Use any Java edition client of the same version to connect.'
        },
        {
          q: 'Is it Bedrock or Java edition?',
          a: 'This is a Java edition server. It is not compatible with Bedrock (Windows 10/console/mobile) players.'
        },
        {
          q: 'How do I connect?',
          a: 'Open Minecraft Java → Multiplayer → Add Server → paste the address 161.118.188.85:25565 → Done → join the server.'
        }
      ]}
      schema={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "Is the Minecraft server free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, completely free to join. You need a paid Minecraft Java edition account." } },
          { "@type": "Question", "name": "How do I connect to the Minecraft server?", "acceptedAnswer": { "@type": "Answer", "text": "Open Minecraft Java, go to Multiplayer, Add Server, and paste 161.118.188.85:25565." } }
        ]
      }}
    >
      <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6">
        {/* Server card */}
        <div className="rounded-2xl border border-green-500/20 bg-gradient-to-br from-green-500/10 to-transparent p-5 text-center">
          <div className="text-4xl mb-3">⛏️</div>
          <h2 className="text-xl font-bold text-white mb-1">UpTools Minecraft Server</h2>
          <p className="text-sm text-green-400 mb-4 font-medium flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Online — Survival
          </p>

          <div className="inline-flex items-center gap-2 rounded-xl bg-black/40 border border-white/10 px-4 py-3 font-mono text-lg text-green-300 select-all">
            {address}
          </div>

          <div className="mt-4">
            <button
              onClick={copy}
              className="glow-btn text-sm px-5 py-2.5 rounded-xl no-underline inline-block"
            >
              {copied ? '✓ Copied!' : 'Copy Server Address'}
            </button>
          </div>
        </div>

        {/* How to join */}
        <div className="mt-6">
          <h3 className="font-semibold text-white mb-3">How to join</h3>
          <ol className="space-y-2 text-sm text-slate-300 list-decimal list-inside">
            <li>Open <span className="text-white font-medium">Minecraft Java Edition</span> (version 26.2)</li>
            <li>Click <span className="text-white font-medium">Multiplayer</span> → <span className="text-white font-medium">Add Server</span></li>
            <li>Paste <span className="font-mono text-green-300">{address}</span> as the address</li>
            <li>Click <span className="text-white font-medium">Done</span>, then double-click the server to join</li>
          </ol>
          <p className="text-xs text-slate-500 mt-3">You need a legitimate Minecraft Java account (online-mode is on). The server is open to everyone — no whitelist, no signup.</p>
        </div>
      </div>
    </ToolLayout>
  )
}
