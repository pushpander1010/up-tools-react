export default function HowItWorks({ steps }) {
  // steps: ['Enter your amount', 'Select the GST rate', 'View the breakdown']
  return (
    <section className="glass p-6 mt-6">
      <h2 className="text-lg font-bold text-white mb-4">📐 How It Works</h2>
      <div className="space-y-3">
        {steps.map((step, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-brand/20 border border-brand/40 flex items-center justify-center text-xs font-bold text-brand shrink-0 mt-0.5">
              {i + 1}
            </div>
            <p className="text-sm text-slate-400">{step}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
