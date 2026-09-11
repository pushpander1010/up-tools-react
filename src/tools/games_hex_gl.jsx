import { useState, useCallback } from 'react'

export default function games_hex_gl() {
  const [launched, setLaunched] = useState(false)

  const launch = useCallback(() => {
    window.open('https://hexgl.bkcore.com/', '_blank', 'noopener')
    setLaunched(true)
  }, [])

  return (
    <GameShell
      name="HEXGL RACING"
      startAction={launch} startLabel="🏁 Launch HexGL" title="HexGL — 3D Futuristic Racing" desc="HexGL — 3D Futuristic Racing - race through a neon-lit futuristic track in this WebGL, online free. Play online free, no download. Works on mobile and desktop."
      icon="🏎️" iconBg="rgba(99,102,241,0.08)" category="fun" slug="games-hex-gl"
      faq={[
        { q: 'How do I control the ship?', a: 'Arrow Keys or WASD. Up/W to accelerate, Down/S to brake, Left/Right to steer.' },
        { q: 'Why does it open in a new tab?', a: 'HexGL is a full 3D WebGL game that requires its own page to run properly.' },
        { q: 'Can I play on mobile?', a: 'No, HexGL requires a keyboard. Desktop/laptop only.' },
        { q: "How do I play HexGL — 3D Futuristic Racing online free?", a: "Click Start and follow the on-screen steps. Use mouse, touch, or keyboard controls. No download needed." },
        { q: "Can I play HexGL — 3D Futuristic Racing without downloading?", a: "Yes. This HexGL — 3D Futuristic Racing runs in your browser with no install. Free on mobile and desktop." },
        { q: "How do I use this HexGL — 3D Futuristic Racing online free?", a: "Open the game above and press Start. Free with no login, works on mobile and desktop." },
      ]}
      howItWorks={[
        'HexGL is a futuristic 3D racing game by BKcore, rendered in WebGL.',
        'Click the button below to open it in a new tab.',
        'Use arrow keys to race through the neon track and reach the finish line.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "HexGL 3D Racing", "genre": "Racing",
        "url": "https://www.uptools.in/games/hex-gl/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="flex gap-4 max-w-6xl mx-auto overflow-hidden">
        <div className="flex-1 min-w-0 max-w-xl mx-auto space-y-5">
          <div className="glass p-8 text-center">
            <div className="text-6xl mb-4">🏎️</div>
            <h2 className="text-xl font-bold text-white mb-2">HexGL — 3D Racing</h2>
            <p className="text-sm text-slate-400 mb-6">A WebGL futuristic racing game. Requires WebGL support and a keyboard.</p>
            <button onClick={launch}
              className="glow-btn px-8 py-4 text-base">
              🏁 Launch HexGL
            </button>
            {launched && (
              <p className="text-xs text-green-400 mt-3">Opened in new tab. Close this tab and return to the game when done.</p>
            )}
          </div>
        </div>
      </div>
    </GameShell>
  )
}
