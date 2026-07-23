import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'

export default function how_to_calculate_gpa() {
  const [activeTab, setActiveTab] = useState('guide')

  return (
    <ToolLayout
      title="How to Calculate GPA"
      desc="A simple, step-by-step guide to calculating GPA on any scale — plus free calculators that do it for you."
      icon="🎓" iconBg="rgba(99,102,241,0.08)"
      category="education" slug="how-to-calculate-gpa"
      faq={[
        { q: "How do I calculate GPA on a 4.0 scale?", a: "Convert each letter grade to points (A=4, B=3, C=2, D=1, F=0), multiply by course credits, sum them, then divide by total credits." },
        { q: "What is the difference between GPA and CGPA?", a: "GPA is one term/semester; CGPA is the cumulative average across all terms." },
        { q: "How do I calculate weighted GPA?", a: "Weighted GPA adds points for honors/AP/IB courses (e.g. A=5 instead of 4)." },
      ]}
      howItWorks={["Convert letter grades to points", "Multiply each grade by course credits", "Sum quality points and divide by total credits"]}
      schema={{"@context":"https://schema.org","@type":"SoftwareApplication","name":"How to Calculate GPA","applicationCategory":"EducationalApplication","url":"https://www.uptools.in/how-to-calculate-gpa/","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}}}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Tabs */}
        <div className="flex gap-2">
          {[['guide', '📖 Guide'], ['scale', '📊 Grade Scale'], ['faq', '❓ FAQ']].map(([tab, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab
                  ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                  : 'bg-white/[0.06] text-slate-500 border border-white/8'
              }`}>{label}</button>
          ))}
        </div>

        {activeTab === 'guide' && (
          <div className="space-y-6">
            <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6 sm:p-8">
              <h2 className="text-lg font-bold text-white mb-3">Step 1 — Convert grades to points</h2>
              <p className="text-sm text-slate-400 mb-4">Use the standard 4.0 scale or weighted scale for honors/AP courses.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-white/8">
                    <th className="text-left py-2 text-slate-400 font-semibold">Letter</th>
                    <th className="text-left py-2 text-slate-400 font-semibold">4.0 Scale</th>
                    <th className="text-left py-2 text-slate-400 font-semibold">Weighted (AP)</th>
                  </tr></thead>
                  <tbody className="text-white">
                    {[['A', '4.0', '5.0'], ['B', '3.0', '4.0'], ['C', '2.0', '3.0'], ['D', '1.0', '2.0'], ['F', '0.0', '0.0']].map(([l, s, w]) => (
                      <tr key={l} className="border-b border-white/5"><td className="py-2 font-bold">{l}</td><td>{s}</td><td>{w}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6 sm:p-8">
              <h2 className="text-lg font-bold text-white mb-3">Step 2 — Multiply by credits</h2>
              <p className="text-sm text-slate-400">For each course: <b className="text-white">grade points × course credits = quality points</b>. Add all quality points, then divide by total credits attempted.</p>
              <p className="text-sm text-slate-400 mt-3"><b className="text-indigo-400">Example:</b> A (3 cr) + B (4 cr) + A (2 cr) → (4×3)+(3×4)+(4×2) = 12+12+8 = 32 ÷ 9 credits = <b className="text-white">3.56 GPA</b>.</p>
            </div>

            <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6 sm:p-8">
              <h2 className="text-lg font-bold text-white mb-3">Step 3 — CGPA (cumulative)</h2>
              <p className="text-sm text-slate-400">CGPA = total quality points across all semesters ÷ total credits. Or simply average your semester GPAs weighted by credits.</p>
              <div className="flex gap-3 mt-4">
                <a href="/gpa-calculator/" className="flex-1 text-center py-3 rounded-xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all">GPA Calculator →</a>
                <a href="/cgpa-calculator/" className="flex-1 text-center py-3 rounded-xl bg-white/[0.06] border border-white/8 text-slate-400 font-bold text-sm hover:bg-white/10 transition-all">CGPA Calculator →</a>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scale' && (
          <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6 sm:p-8">
            <h2 className="text-lg font-bold text-white mb-4">Grade Point Conversion</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[['A+', '4.0'], ['A', '4.0'], ['A-', '3.7'], ['B+', '3.3'], ['B', '3.0'], ['B-', '2.7'], ['C+', '2.3'], ['C', '2.0'], ['C-', '1.7'], ['D+', '1.3'], ['D', '1.0'], ['F', '0.0']].map(([g, p]) => (
                <div key={g} className="flex justify-between items-center py-2 px-3 rounded-xl bg-white/[0.04] border border-white/5">
                  <span className="text-white font-bold">{g}</span>
                  <span className="text-indigo-400 font-semibold">{p}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="space-y-4">
            {[
              { q: "How do I calculate weighted GPA?", a: "Add a point for honors/AP/IB courses (A=5 instead of 4), then run the same quality-points ÷ credits formula." },
              { q: "GPA vs CGPA?", a: "GPA = one term; CGPA = all terms combined. CGPA is what colleges and employers usually ask for." },
              { q: "Is a 3.5 GPA good?", a: "Yes — 3.5 is roughly an A-/B+ average, strong for most universities and scholarships." },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-5">
                <h3 className="text-white font-bold mb-2">{item.q}</h3>
                <p className="text-sm text-slate-400">{item.a}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
