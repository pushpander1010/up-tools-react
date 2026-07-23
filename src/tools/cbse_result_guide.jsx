import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'

export default function cbse_result_guide() {
  const [openFaq, setOpenFaq] = useState(null)

  const faqs = [
    { q: 'How do I check my CBSE result?', a: 'Use the official CBSE results portal with your roll number, school code, and admit card ID.' },
    { q: 'CGPA to percentage?', a: 'Multiply CGPA by 9.5. A 10 CGPA = 95%, 9 CGPA = 85.5%.' },
    { q: "What's a good 12th percentage?", a: '75%+ is solid for admissions; 90%+ unlocks top colleges and scholarships.' },
  ]

  return (
    <ToolLayout
      title="CBSE Result Guide 2026"
      desc="How to check your 10th/12th marks and turn your CGPA into a percentage — fast and free."
      icon="📘" iconBg="rgba(99,102,241,0.08)"
      category="education" slug="cbse-result-guide"
      faq={[
        { q: 'How do I check my CBSE result?', a: 'Visit the official CBSE results portal (results.cbse.nic.in), enter your roll number, school code, and admit card ID. Marks appear instantly.' },
        { q: 'How do I convert CGPA to percentage?', a: 'For CBSE, Percentage = CGPA × 9.5. So a 9.2 CGPA = 87.4%.' },
        { q: 'What is a good CBSE 12th percentage?', a: '75%+ is considered strong for most college admissions; 90%+ opens top-tier and scholarship doors.' },
      ]}
      howItWorks={[
        'Go to the official CBSE results portal.',
        'Enter roll number, school code, and admit card ID.',
        'Your subject marks and overall result appear instantly.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "CBSE Result Guide 2026", "applicationCategory": "EducationalApplication",
        "url": "https://www.uptools.in/cbse-result-guide/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Check Result */}
        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6">
          <h2 className="text-lg font-bold text-white mb-3">Check your result</h2>
          <ol className="space-y-3 text-sm text-slate-300 list-decimal list-inside">
            <li>Go to the official CBSE results portal.</li>
            <li>Enter roll number, school code, and admit card ID.</li>
            <li>Your subject marks and overall result appear instantly.</li>
          </ol>
        </div>

        {/* CGPA Converter */}
        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6">
          <h2 className="text-lg font-bold text-white mb-3">Convert CGPA to percentage</h2>
          <p className="text-sm text-slate-300 mb-2"><strong className="text-white">CBSE formula:</strong> Percentage = CGPA × 9.5</p>
          <p className="text-sm text-slate-400 mb-4">Example: CGPA 9.2 × 9.5 = <strong className="text-white">87.4%</strong>. Use our calculator for any value:</p>
          <a href="/cbse-percentage-calculator/" className="inline-block px-5 py-2.5 rounded-xl bg-indigo-500 text-white text-xs font-bold hover:bg-indigo-400 transition-all">
            CBSE % Calculator →
          </a>
        </div>

        {/* FAQ */}
        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6">
          <h2 className="text-lg font-bold text-white mb-4">Frequently asked questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-white/8 bg-white/[0.04] overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left">
                  <span className="text-sm font-semibold text-white">{faq.q}</span>
                  <span className={`text-slate-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>▾</span>
                </button>
                {openFaq === i && <div className="px-5 pb-4 text-sm text-slate-400">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Related */}
        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6">
          <h2 className="text-sm font-bold text-white mb-3">Related UpTools</h2>
          <div className="flex flex-wrap gap-2">
            <a href="/cbse-percentage-calculator/" className="px-4 py-2 rounded-xl bg-white/[0.06] border border-white/8 text-xs text-indigo-400 hover:bg-indigo-500/10 transition-all">CBSE % Calculator</a>
            <a href="/cbse-class-12-result/" className="px-4 py-2 rounded-xl bg-white/[0.06] border border-white/8 text-xs text-indigo-400 hover:bg-indigo-500/10 transition-all">Class 12 Result</a>
            <a href="/career-after-12/" className="px-4 py-2 rounded-xl bg-white/[0.06] border border-white/8 text-xs text-indigo-400 hover:bg-indigo-500/10 transition-all">Career After 12th</a>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
