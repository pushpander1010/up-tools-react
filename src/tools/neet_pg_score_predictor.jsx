import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const TOTAL_Q = 200
const MARKS_PER_Q = 4
const NEG_PER_WRONG = 1
const MAX_SCORE = TOTAL_Q * MARKS_PER_Q // 800

export default function neet_pg_score_predictor() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [correct, setCorrect] = useState('120')
  const [wrong, setWrong] = useState('50')
  const [result, setResult] = useState(null)

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-white font-semibold text-sm outline-none focus:border-teal-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"

  const analyze = useCallback(() => {
    const c = Math.max(0, parseInt(correct) || 0)
    const w = Math.max(0, parseInt(wrong) || 0)
    if (c + w > TOTAL_Q) { alert(`Correct + wrong cannot exceed ${TOTAL_Q} questions.`); return }
    const attempted = c + w
    const unattempted = TOTAL_Q - attempted
    const score = c * MARKS_PER_Q - w * NEG_PER_WRONG
    const accuracy = attempted > 0 ? (c / attempted) * 100 : 0
    const pctOfMax = (score / MAX_SCORE) * 100
    // Rough guidance bands (illustrative, varies yearly by difficulty/normalization)
    let band
    if (score >= 550) band = 'Strong: historically comfortable for broad branch options — still verify with the official merit list.'
    else if (score >= 450) band = 'Competitive: in the mix for many clinical seats depending on category, quota and that year cutoff.'
    else if (score >= 350) band = 'Borderline: possible in softer branches/quotas; keep counselling options wide and watch round-wise cutoffs.'
    else if (score >= 200) band = 'Below typical qualifying zone in most years — plan a re-attempt strategy alongside counselling.'
    else band = 'Very low: treat this as a diagnostic — analyze weak subjects before the next attempt.'
    const tip = w > c * 0.5
      ? 'High wrong count is eating your score: each wrong costs 1 mark. In a re-attempt, leave doubtful questions blank instead of guessing.'
      : accuracy >= 80
        ? 'Good accuracy. Extra marks now come from attempting more questions you actually know, not from riskier guesses.'
        : 'Balance attempt vs accuracy: blind guesses cost more than blanks. Attempt what you can eliminate to 50/50 or better.'
    setResult({ c, w, attempted, unattempted, score, accuracy, pctOfMax, band, tip })
    jumpTo()
  }, [correct, wrong, jumpTo])

  return (
    <ToolLayout
      title="NEET PG Score Predictor — Response Sheet to Marks (With Negative Marking)"
      desc="NEET PG score calculator: enter correct and wrong counts from your NBEMS response sheet to get your predicted score out of 800 with -1 negative marking, accuracy and attempt analysis."
      icon="🩺" iconBg="rgba(20,184,166,0.08)"
      category="education" slug="neet-pg-score-predictor"
      faq={[
        { q: 'How is the NEET PG score calculated?', a: `NEET PG has ${TOTAL_Q} questions of ${MARKS_PER_Q} marks each (${MAX_SCORE} total). Every wrong answer costs ${NEG_PER_WRONG} mark. Score = correct × ${MARKS_PER_Q} − wrong × ${NEG_PER_WRONG}. Unattempted questions score zero.` },
        { q: 'Where do I get correct/wrong counts?', a: 'Download your response sheet + provisional answer key from natboard.edu.in, match each response, and count correct vs wrong. Enter those two numbers here — this tool never sees your login or roll number.' },
        { q: 'Is this the official score?', a: 'No — a prediction from your own counting against the provisional key. The official NBEMS score (after challenges and normalization, if any) is final. Small counting errors swing the result, so re-verify borderline questions.' },
        { q: 'Should I guess or leave blank?', a: `A blind guess has a 1-in-4 hit rate: expected value ≈ 0 marks (25% × +${MARKS_PER_Q} minus 75% × -${NEG_PER_WRONG}). Guess only when you can eliminate at least two options; otherwise a blank (0) beats the average guess.` },
        { q: 'What is a safe score?', a: 'Cutoffs shift yearly with difficulty and normalization. As rough illustration: 550+ is historically strong, 450+ competitive, 350+ borderline. Always compare against the official merit list and previous round cutoffs for your category and quota.' },
        { q: 'Is my data kept private?', a: 'Yes. Everything runs in your browser. Nothing you enter is uploaded or stored.' },
      ]}
      howItWorks={[
        'Download your response sheet and the provisional answer key from natboard.edu.in.',
        'Count correct and wrong responses (unattempted = 200 minus both).',
        'Enter the two numbers here for predicted score, accuracy and attempt guidance.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "NEET PG Score Predictor", "applicationCategory": "EducationalApplication",
        "url": "https://www.uptools.in/neet-pg-score-predictor/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-3xl border-2 border-amber-500/15 bg-amber-500/[0.04] p-6">
          <h2 className="text-sm font-bold text-amber-400 mb-2">Before You Start</h2>
          <p className="text-sm text-slate-400 mb-3">This page predicts your score from counts <em>you</em> tally against the provisional key. It never logs in anywhere or fetches your result.</p>
          <div className="flex gap-3">
            <a href="https://natboard.edu.in/" target="_blank" rel="noopener" className="px-4 py-2 rounded-xl bg-teal-500 text-white text-xs font-bold hover:bg-teal-400 transition-all">Open NBEMS Official Site</a>
          </div>
        </div>

        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6">
          <h2 className="text-sm font-bold text-white mb-1">Enter Your Counts</h2>
          <p className="text-xs text-slate-400 mb-4">{TOTAL_Q} questions · +{MARKS_PER_Q} correct · −{NEG_PER_WRONG} wrong · max {MAX_SCORE}</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Correct answers</label>
              <input type="number" value={correct} onChange={e => setCorrect(e.target.value)} placeholder="e.g. 120" min="0" max={TOTAL_Q} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Wrong answers</label>
              <input type="number" value={wrong} onChange={e => setWrong(e.target.value)} placeholder="e.g. 50" min="0" max={TOTAL_Q} className={inputClass} />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={analyze} className="flex-1 py-3 rounded-xl bg-teal-500 text-white font-bold text-sm hover:bg-teal-400 transition-all">Predict My Score</button>
            <button onClick={() => { setCorrect('120'); setWrong('50'); setResult(null) }} className="px-4 py-3 rounded-xl bg-white/[0.06] border border-white/8 text-white text-xs font-bold hover:bg-white/10 transition-all">Demo</button>
          </div>
        </div>

        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-teal-500/15 bg-gradient-to-br from-teal-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <h3 className="text-sm font-bold text-teal-400 uppercase tracking-wider">Predicted Score</h3>
            </div>
            <div className="text-center mb-4">
              <div className="text-5xl font-black text-white">{result.score}</div>
              <div className="text-xs text-slate-400 mt-1">out of {MAX_SCORE} · {result.pctOfMax.toFixed(1)}% of max</div>
              <div className="text-[11px] text-slate-500 mt-1 font-mono">{result.c} × {MARKS_PER_Q} − {result.w} × {NEG_PER_WRONG}</div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4 text-center">
              <div className="rounded-xl border border-white/8 bg-white/[0.04] p-3">
                <div className="text-xs text-slate-400">Attempted</div>
                <div className="text-lg font-extrabold text-white">{result.attempted}<span className="text-xs text-slate-500">/{TOTAL_Q}</span></div>
              </div>
              <div className="rounded-xl border border-white/8 bg-white/[0.04] p-3">
                <div className="text-xs text-slate-400">Accuracy</div>
                <div className="text-lg font-extrabold text-white">{result.accuracy.toFixed(1)}%</div>
              </div>
              <div className="rounded-xl border border-white/8 bg-white/[0.04] p-3">
                <div className="text-xs text-slate-400">Left blank</div>
                <div className="text-lg font-extrabold text-white">{result.unattempted}</div>
              </div>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/[0.04] p-4 text-xs text-slate-300 leading-relaxed mb-3">
              <span className="font-bold text-white">Guidance: </span>{result.band}
            </div>
            <div className="rounded-xl border border-white/8 bg-white/[0.04] p-4 text-xs text-slate-300 leading-relaxed">
              <span className="font-bold text-white">Attempt tip: </span>{result.tip}
            </div>
            <p className="text-[11px] text-slate-600 mt-3">Illustrative bands only — official NBEMS merit list and round-wise cutoffs decide admissions. Re-verify counts against the final key.</p>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🩺</div>
            <p className="text-sm text-slate-600 font-medium">Enter correct + wrong and click Predict</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
