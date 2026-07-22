export default function FAQ({ questions }) {
  // questions: [{ q: 'Question', a: 'Answer' }]
  return (
    <section className="glass p-6 mt-6">
      <h2 className="text-lg font-bold text-white mb-4">Frequently Asked Questions</h2>
      <div className="space-y-3">
        {questions.map((faq, i) => (
          <details key={i} className="group">
            <summary className="cursor-pointer text-sm font-semibold text-white py-2 list-none flex items-center gap-2">
              <span className="text-brand text-xs group-open:rotate-90 transition-transform">▶</span>
              {faq.q}
            </summary>
            <p className="text-xs text-slate-400 pl-5 pb-2 leading-relaxed">{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
