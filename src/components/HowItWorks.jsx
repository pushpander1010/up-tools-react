export default function HowItWorks({ steps, title }) {
  if (!steps || steps.length === 0) return null

  return (
    <section
      className="glass p-6 sm:p-7 mt-6"
      style={{ containIntrinsicSize: '0 220px', contentVisibility: 'auto' }}
    >
      <div className="flex items-center gap-2.5 mb-4">
        <span className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-sm shrink-0">
          📐
        </span>
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-white m-0">
            How to Use {title || 'This Tool'}
          </h2>
          <p className="text-xs text-slate-400 m-0 mt-0.5">
            Follow these quick steps for instant, accurate results in your browser
          </p>
        </div>
      </div>

      <ol className="list-none p-0 m-0 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {steps.map((step, i) => (
          <li
            key={i}
            className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-indigo-500/25 transition-colors"
          >
            <span className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-xs font-extrabold text-indigo-300 shrink-0 mt-0.5">
              {i + 1}
            </span>
            <span className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {step}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
