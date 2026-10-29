export default function MeshBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Subtle architectural grid */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 80% 55% at 50% 0%, #000 35%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 55% at 50% 0%, #000 35%, transparent 100%)',
        }}
      />
      {/* Top primary ambient spotlight */}
      <div
        className="absolute -top-48 left-1/2 -translate-x-1/2 w-[960px] h-[460px] rounded-full blur-[120px] opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.45) 0%, rgba(14,165,233,0.2) 50%, transparent 75%)',
        }}
      />
      {/* Secondary subtle emerald accent */}
      <div
        className="absolute top-[28%] -right-40 w-[480px] h-[480px] rounded-full blur-[130px] opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(16,185,129,0.35) 0%, transparent 70%)',
        }}
      />
    </div>
  )
}
