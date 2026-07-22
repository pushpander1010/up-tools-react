export default function MeshBackground() {
  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="mesh-orb" style={{ width: 600, height: 600, top: '-10%', left: '-5%', background: 'radial-gradient(circle, rgba(99,102,241,0.22), transparent 70%)', animation: 'drift1 25s ease-in-out infinite alternate' }} />
        <div className="mesh-orb" style={{ width: 500, height: 500, top: '20%', right: '-10%', background: 'radial-gradient(circle, rgba(139,92,246,0.18), transparent 70%)', animation: 'drift2 20s ease-in-out infinite alternate-reverse' }} />
        <div className="mesh-orb" style={{ width: 400, height: 400, bottom: '10%', left: '30%', background: 'radial-gradient(circle, rgba(6,182,212,0.16), transparent 70%)', animation: 'drift3 30s ease-in-out infinite alternate' }} />
        <div className="mesh-orb" style={{ width: 350, height: 350, top: '60%', right: '20%', background: 'radial-gradient(circle, rgba(244,63,94,0.14), transparent 70%)', animation: 'drift1 22s ease-in-out infinite alternate-reverse' }} />
        <div className="mesh-orb" style={{ width: 450, height: 450, bottom: '-5%', right: '-5%', background: 'radial-gradient(circle, rgba(16,185,129,0.15), transparent 70%)', animation: 'drift2 28s ease-in-out infinite alternate' }} />
        <div className="mesh-orb" style={{ width: 420, height: 420, top: '75%', left: '15%', background: 'radial-gradient(circle, rgba(236,72,153,0.14), transparent 70%)', animation: 'drift2 24s ease-in-out infinite alternate' }} />
        <div className="mesh-orb" style={{ width: 350, height: 350, top: '5%', left: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.14), transparent 70%)', animation: 'drift3 20s ease-in-out infinite alternate-reverse' }} />
      </div>
      <style>{`
        .mesh-orb { position: absolute; border-radius: 50%; filter: blur(80px); }
        @keyframes drift1 { 0%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,-30px) scale(1.05)} 66%{transform:translate(-20px,40px) scale(0.95)} 100%{transform:translate(30px,20px) scale(1.02)} }
        @keyframes drift2 { 0%{transform:translate(0,0) scale(1)} 50%{transform:translate(-30px,20px) scale(1.08)} 100%{transform:translate(20px,-30px) scale(0.96)} }
        @keyframes drift3 { 0%{transform:translate(0,0) rotate(0deg)} 100%{transform:translate(30px,-20px) rotate(5deg)} }
        @media(prefers-reduced-motion:reduce){ .mesh-orb{animation:none!important} }
      `}</style>
    </>
  )
}
