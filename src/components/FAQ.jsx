export default function FAQ({ questions, title }) {
  if (!questions || questions.length === 0) return null

  return (
    <section
      className="glass p-6 sm:p-7 mt-6"
      style={{ containIntrinsicSize: '0 320px', contentVisibility: 'auto' }}
    >
      <div className="flex items-center gap-2.5 mb-4">
        <span className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-sm shrink-0">
          ❓
        </span>
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-white m-0">
            Frequently Asked Questions{title ? ` — ${title}` : ''}
          </h2>
          <p className="text-xs text-slate-400 m-0 mt-0.5">
            Common questions, formulas, and privacy details
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {questions.map((faq, i) => (
          <details
            key={i}
            open={i === 0}
            className="group rounded-2xl bg-white/[0.03] border border-white/[0.06] open:bg-white/[0.05] open:border-indigo-500/25 transition-all"
          >
            <summary className="cursor-pointer text-xs sm:text-sm font-semibold text-white px-4 py-3.5 list-none flex items-center justify-between gap-3 select-none">
              <span>{faq.q}</span>
              <span className="w-6 h-6 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-indigo-300 text-[10px] shrink-0 group-open:rotate-180 group-open:bg-indigo-500/20 transition-transform">
                ▼
              </span>
            </summary>
            <div className="px-4 pb-4 pt-0.5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/[0.04]">
              {faq.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
