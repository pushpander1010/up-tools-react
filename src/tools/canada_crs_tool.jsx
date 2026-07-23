import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = v => new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(v || 0)

// ---------- IELTS → CLB (IRCC official thresholds) ----------
const IELTS_THRESHOLDS = {
  L: [[8.5, 10], [8.0, 9], [7.5, 8], [6.0, 7], [5.5, 6], [5.0, 5], [4.5, 4]],
  R: [[8.0, 10], [7.0, 9], [6.5, 8], [6.0, 7], [5.0, 6], [4.0, 5], [3.5, 4]],
  W: [[7.5, 10], [7.0, 9], [6.5, 8], [6.0, 7], [5.5, 6], [5.0, 5], [4.0, 4]],
  S: [[7.5, 10], [7.0, 9], [6.5, 8], [6.0, 7], [5.5, 6], [5.0, 5], [4.0, 4]],
}
const bandToCLB = (skill, band) => {
  const b = Number(band || 0)
  for (const [min, clb] of IELTS_THRESHOLDS[skill]) if (b >= min) return clb
  return 0
}

// ---------- Core scoring ----------
const AGE_SINGLE = { 17: 0, 18: 99, 19: 105, 20: 110, 21: 110, 22: 110, 23: 110, 24: 110, 25: 110, 26: 110, 27: 110, 28: 110, 29: 110, 30: 105, 31: 99, 32: 94, 33: 88, 34: 83, 35: 77, 36: 72, 37: 66, 38: 61, 39: 55, 40: 50, 41: 39, 42: 28, 43: 17, 44: 6 }
const AGE_SPOUSE = { 17: 0, 18: 90, 19: 95, 20: 100, 21: 100, 22: 100, 23: 100, 24: 100, 25: 100, 26: 100, 27: 100, 28: 100, 29: 100, 30: 95, 31: 90, 32: 85, 33: 80, 34: 75, 35: 70, 36: 65, 37: 60, 38: 55, 39: 50, 40: 45, 41: 35, 42: 25, 43: 15, 44: 5 }

function pointsAge(age, married) {
  const a = Math.max(0, Math.floor(Number(age || 0)))
  const map = married ? AGE_SPOUSE : AGE_SINGLE
  if (a <= 17 || a >= 45) return 0
  return map[a] ?? 0
}

function pointsEducation(level, married) {
  const single = { lessHS: 0, hs: 30, '1yr': 90, '2yr': 98, bachelor: 120, twoPlus: 128, master: 135, phd: 150 }
  const spouse = { lessHS: 0, hs: 28, '1yr': 84, '2yr': 91, bachelor: 112, twoPlus: 119, master: 126, phd: 140 }
  return (married ? spouse : single)[level] ?? 0
}

function firstLangAbilityPoints(clb, married) {
  if (clb >= 10) return married ? 32 : 34
  if (clb === 9) return married ? 29 : 31
  if (clb === 8) return married ? 22 : 23
  if (clb === 7) return married ? 16 : 17
  if (clb === 6) return married ? 8 : 9
  if (clb === 5 || clb === 4) return 6
  return 0
}

function pointsFirstOfficial(clb4, married) {
  return firstLangAbilityPoints(clb4.L, married) + firstLangAbilityPoints(clb4.R, married) +
    firstLangAbilityPoints(clb4.W, married) + firstLangAbilityPoints(clb4.S, married)
}

function secondLangAbilityPoints(clb) {
  if (clb >= 9) return 6
  if (clb >= 7) return 3
  if (clb >= 5) return 1
  return 0
}

function pointsSecondOfficial(clb4, married) {
  const p = secondLangAbilityPoints(clb4.L) + secondLangAbilityPoints(clb4.R) +
    secondLangAbilityPoints(clb4.W) + secondLangAbilityPoints(clb4.S)
  return Math.min(married ? 22 : 24, p)
}

function pointsCanadianExp(years, married) {
  const y = Math.floor(Math.max(0, Number(years || 0)))
  const single = [0, 40, 53, 64, 72, 80]
  const spouse = [0, 35, 46, 56, 63, 70]
  return (married ? spouse : single)[Math.min(5, y)]
}

// ---------- Skill transferability ----------
function allCLBAtLeast(clb4, n) { return clb4.L >= n && clb4.R >= n && clb4.W >= n && clb4.S >= n }

function bucketEducation(clb4, caExpYears, level) {
  let ptsLang = 0, ptsCA = 0
  const cat = (level === 'twoPlus' || level === 'master' || level === 'phd') ? '25_50' :
    (level === '1yr' || level === '2yr' || level === 'bachelor') ? '13_25' : '0'
  if (cat === '13_25') {
    if (allCLBAtLeast(clb4, 9)) ptsLang = 25; else if (allCLBAtLeast(clb4, 7)) ptsLang = 13
    const y = Math.floor(Math.max(0, Number(caExpYears || 0)))
    if (y >= 2) ptsCA = 25; else if (y >= 1) ptsCA = 13
  } else if (cat === '25_50') {
    if (allCLBAtLeast(clb4, 9)) ptsLang = 50; else if (allCLBAtLeast(clb4, 7)) ptsLang = 25
    const y = Math.floor(Math.max(0, Number(caExpYears || 0)))
    if (y >= 2) ptsCA = 50; else if (y >= 1) ptsCA = 25
  }
  return Math.min(50, ptsLang + ptsCA)
}

function bucketForeignWork(clb4, caExpYears, foreignYears) {
  const f = Math.floor(Math.max(0, Number(foreignYears || 0)))
  const yCA = Math.floor(Math.max(0, Number(caExpYears || 0)))
  let ptsLang = 0, ptsCA = 0
  if (f >= 1 && f <= 2) {
    if (allCLBAtLeast(clb4, 9)) ptsLang = 25; else if (allCLBAtLeast(clb4, 7)) ptsLang = 13
    if (yCA >= 2) ptsCA = 25; else if (yCA >= 1) ptsCA = 13
  } else if (f >= 3) {
    if (allCLBAtLeast(clb4, 9)) ptsLang = 50; else if (allCLBAtLeast(clb4, 7)) ptsLang = 25
    if (yCA >= 2) ptsCA = 50; else if (yCA >= 1) ptsCA = 25
  }
  return Math.min(50, ptsLang + ptsCA)
}

function bucketCertificate(certFlag, clb4) {
  if (certFlag !== 'yes') return 0
  if (allCLBAtLeast(clb4, 7)) return 50
  if (allCLBAtLeast(clb4, 5) && !(clb4.L >= 7 && clb4.R >= 7 && clb4.W >= 7 && clb4.S >= 7)) return 25
  return 0
}

function scoreTransferability({ edu, clb, caExp, forExp, cert }) {
  return Math.min(100, bucketEducation(clb, caExp, edu) + bucketForeignWork(clb, caExp, forExp) + bucketCertificate(cert, clb))
}

function scoreAdditional({ pnp, sibling, french, study }) {
  return Number(pnp || 0) + Number(sibling || 0) + Number(french || 0) + Number(study || 0)
}

// ---------- Main component ----------
export default function canada_crs_tool() {
  const { ref: resultRef, jumpTo } = useJumpToResult()

  // Form state
  const [marital, setMarital] = useState('single')
  const [age, setAge] = useState('')
  const [edu, setEdu] = useState('bachelor')
  const [langMode, setLangMode] = useState('clb')
  const [clbL, setClbL] = useState(''); const [clbR, setClbR] = useState('')
  const [clbW, setClbW] = useState(''); const [clbS, setClbS] = useState('')
  const [ieltsL, setIeltsL] = useState(''); const [ieltsR, setIeltsR] = useState('')
  const [ieltsW, setIeltsW] = useState(''); const [ieltsS, setIeltsS] = useState('')
  const [slbL, setSlbL] = useState(''); const [slbR, setSlbR] = useState('')
  const [slbW, setSlbW] = useState(''); const [slbS, setSlbS] = useState('')
  const [caExp, setCaExp] = useState(''); const [forExp, setForExp] = useState('')
  const [pnp, setPnp] = useState('0'); const [study, setStudy] = useState('0')
  const [sibling, setSibling] = useState('0'); const [french, setFrench] = useState('0')
  const [cert, setCert] = useState('none')
  const [showExtra, setShowExtra] = useState(false)
  const [showSecond, setShowSecond] = useState(false)

  const isIELTS = langMode === 'ielts'

  const result = useMemo(() => {
    const married = marital === 'married'

    // First language CLB
    const fl = isIELTS
      ? { L: bandToCLB('L', ieltsL), R: bandToCLB('R', ieltsR), W: bandToCLB('W', ieltsW), S: bandToCLB('S', ieltsS) }
      : { L: Math.max(0, Math.min(12, Math.round(Number(clbL || 0)))),
          R: Math.max(0, Math.min(12, Math.round(Number(clbR || 0)))),
          W: Math.max(0, Math.min(12, Math.round(Number(clbW || 0)))),
          S: Math.max(0, Math.min(12, Math.round(Number(clbS || 0)))) }

    // Second language
    const sl = { L: Math.max(0, Math.min(12, Math.round(Number(slbL || 0)))),
      R: Math.max(0, Math.min(12, Math.round(Number(slbR || 0)))),
      W: Math.max(0, Math.min(12, Math.round(Number(slbW || 0)))),
      S: Math.max(0, Math.min(12, Math.round(Number(slbS || 0)))) }

    const agePts = pointsAge(age, married)
    const eduPts = pointsEducation(edu, married)
    const lang1 = pointsFirstOfficial(fl, married)
    const lang2 = pointsSecondOfficial(sl, married)
    const caPts = pointsCanadianExp(caExp, married)
    const core = agePts + eduPts + lang1 + lang2 + caPts
    const trans = scoreTransferability({ edu, clb: fl, caExp, forExp, cert })
    const bonus = scoreAdditional({ pnp, sibling, french, study })
    const total = core + trans + bonus

    return { total, core, trans, bonus, fl, sl, hasInput: age || clbL || ieltsL || caExp }
  }, [marital, age, edu, langMode, clbL, clbR, clbW, clbS, ieltsL, ieltsR, ieltsW, ieltsS, slbL, slbR, slbW, slbS, caExp, forExp, pnp, study, sibling, french, cert])

  const inputClass = 'w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl px-5 py-4 text-2xl font-extrabold text-white outline-none focus:border-red-500/40 transition-all duration-300 placeholder:text-white/8'
  const selectClass = 'w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl px-5 py-4 text-white font-semibold outline-none focus:border-red-500/40 transition-all duration-200 [color-scheme:dark]'
  const smallInput = 'w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-white font-semibold outline-none focus:border-red-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]'

  return (
    <ToolLayout
      title="Canada CRS Score Calculator (Express Entry)"
      desc="Accurate 2025 Canada CRS calculator. Uses official IRCC age grid, CLB tables, IELTS→CLB conversion, second official language, skill-transferability caps."
      icon="🍁" iconBg="rgba(220,38,38,0.08)"
      category="canada" slug="canada-crs-tool"
      faq={[
        { q: 'What is CRS?', a: 'Comprehensive Ranking System — IRCC\'s point system for Express Entry immigration to Canada.' },
        { q: 'Are job-offer points included?', a: 'No. IRCC removed job-offer CRS points on March 25, 2025. This tool follows the new rules.' },
        { q: 'Do CLB 4-6 get language points?', a: 'Yes. First official language gives points from CLB 4 upward (per ability).' },
      ]}
      howItWorks={[
        'Pick language input type (CLB or IELTS).',
        'Enter IELTS/CLB & experience values.',
        'Add age, education, and optional factors.',
        'Click Calculate to see your CRS breakdown.',
      ]}
      schema={{
        '@context': 'https://schema.org', '@type': 'SoftwareApplication',
        name: 'Canada CRS Score Calculator', applicationCategory: 'UtilitiesApplication',
        url: 'https://www.uptools.in/canada-crs-tool/',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'CAD' }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Basic */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Marital status</label>
            <select value={marital} onChange={e => setMarital(e.target.value)} className={selectClass}>
              <option value="single">Single (no spouse)</option>
              <option value="married">Married / With spouse</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Age (years)</label>
            <input type="number" value={age} onChange={e => setAge(e.target.value)}
              placeholder="e.g., 29" min="17" max="99" step="1"
              className={smallInput} />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-slate-300 mb-2">Highest education (ECA-equivalent)</label>
            <select value={edu} onChange={e => setEdu(e.target.value)} className={selectClass}>
              <option value="lessHS">Less than high school</option>
              <option value="hs">High school</option>
              <option value="1yr">One-year post-secondary</option>
              <option value="2yr">Two-year post-secondary</option>
              <option value="bachelor">Bachelor's (3+ years)</option>
              <option value="twoPlus">Two or more credentials (one 3+ years)</option>
              <option value="master">Master's / professional degree</option>
              <option value="phd">Doctoral (PhD)</option>
            </select>
          </div>
        </div>

        {/* Language mode */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Language input type</label>
            <select value={langMode} onChange={e => setLangMode(e.target.value)} className={selectClass}>
              <option value="clb">CLB (0-12)</option>
              <option value="ielts">IELTS (General Training)</option>
            </select>
          </div>
          <div className="flex items-end text-xs text-slate-500 pb-1">
            {isIELTS ? 'IELTS→CLB uses IRCC thresholds per skill' : 'Enter CLB 0-12 directly'}
          </div>
        </div>

        {/* CLB inputs */}
        {!isIELTS && (
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold text-slate-300 mb-2">CLB Listening</label>
              <input type="number" value={clbL} onChange={e => setClbL(e.target.value)} placeholder="0-12" min="0" max="12" className={smallInput} /></div>
            <div><label className="block text-sm font-semibold text-slate-300 mb-2">CLB Reading</label>
              <input type="number" value={clbR} onChange={e => setClbR(e.target.value)} placeholder="0-12" min="0" max="12" className={smallInput} /></div>
            <div><label className="block text-sm font-semibold text-slate-300 mb-2">CLB Writing</label>
              <input type="number" value={clbW} onChange={e => setClbW(e.target.value)} placeholder="0-12" min="0" max="12" className={smallInput} /></div>
            <div><label className="block text-sm font-semibold text-slate-300 mb-2">CLB Speaking</label>
              <input type="number" value={clbS} onChange={e => setClbS(e.target.value)} placeholder="0-12" min="0" max="12" className={smallInput} /></div>
          </div>
        )}

        {/* IELTS inputs */}
        {isIELTS && (
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold text-slate-300 mb-2">IELTS Listening</label>
              <input type="number" value={ieltsL} onChange={e => setIeltsL(e.target.value)} placeholder="e.g., 8.5" min="0" max="9" step="0.5" className={smallInput} /></div>
            <div><label className="block text-sm font-semibold text-slate-300 mb-2">IELTS Reading</label>
              <input type="number" value={ieltsR} onChange={e => setIeltsR(e.target.value)} placeholder="e.g., 7.0" min="0" max="9" step="0.5" className={smallInput} /></div>
            <div><label className="block text-sm font-semibold text-slate-300 mb-2">IELTS Writing</label>
              <input type="number" value={ieltsW} onChange={e => setIeltsW(e.target.value)} placeholder="e.g., 7.0" min="0" max="9" step="0.5" className={smallInput} /></div>
            <div><label className="block text-sm font-semibold text-slate-300 mb-2">IELTS Speaking</label>
              <input type="number" value={ieltsS} onChange={e => setIeltsS(e.target.value)} placeholder="e.g., 7.5" min="0" max="9" step="0.5" className={smallInput} /></div>
            <div className="col-span-2 flex gap-2 flex-wrap text-xs text-slate-500">
              {isIELTS && ieltsL && <span className="bg-white/[0.06] px-2 py-1 rounded-lg">L→CLB {bandToCLB('L', ieltsL)}</span>}
              {isIELTS && ieltsR && <span className="bg-white/[0.06] px-2 py-1 rounded-lg">R→CLB {bandToCLB('R', ieltsR)}</span>}
              {isIELTS && ieltsW && <span className="bg-white/[0.06] px-2 py-1 rounded-lg">W→CLB {bandToCLB('W', ieltsW)}</span>}
              {isIELTS && ieltsS && <span className="bg-white/[0.06] px-2 py-1 rounded-lg">S→CLB {bandToCLB('S', ieltsS)}</span>}
            </div>
          </div>
        )}

        {/* Second official language */}
        <button onClick={() => setShowSecond(!showSecond)}
          className="text-sm text-slate-400 hover:text-white transition-colors font-medium">
          {showSecond ? '−' : '+'} Second official language (optional)
        </button>
        {showSecond && (
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-semibold text-slate-400 mb-1">2nd CLB Listening</label>
              <input type="number" value={slbL} onChange={e => setSlbL(e.target.value)} min="0" max="12" className={smallInput} /></div>
            <div><label className="block text-xs font-semibold text-slate-400 mb-1">2nd CLB Reading</label>
              <input type="number" value={slbR} onChange={e => setSlbR(e.target.value)} min="0" max="12" className={smallInput} /></div>
            <div><label className="block text-xs font-semibold text-slate-400 mb-1">2nd CLB Writing</label>
              <input type="number" value={slbW} onChange={e => setSlbW(e.target.value)} min="0" max="12" className={smallInput} /></div>
            <div><label className="block text-xs font-semibold text-slate-400 mb-1">2nd CLB Speaking</label>
              <input type="number" value={slbS} onChange={e => setSlbS(e.target.value)} min="0" max="12" className={smallInput} /></div>
          </div>
        )}

        {/* Work experience */}
        <div className="h-px bg-white/8" />
        <h3 className="text-sm font-bold text-slate-300">Work experience</h3>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-semibold text-slate-300 mb-2">Canadian experience (years)</label>
            <input type="number" value={caExp} onChange={e => setCaExp(e.target.value)} placeholder="e.g., 2.5" min="0" max="50" step="0.1" className={smallInput} /></div>
          <div><label className="block text-sm font-semibold text-slate-300 mb-2">Foreign experience (years)</label>
            <input type="number" value={forExp} onChange={e => setForExp(e.target.value)} placeholder="e.g., 3.6" min="0" max="50" step="0.1" className={smallInput} /></div>
        </div>

        {/* Additional & special */}
        <button onClick={() => setShowExtra(!showExtra)}
          className="text-sm text-slate-400 hover:text-white transition-colors font-medium">
          {showExtra ? '−' : '+'} Additional & special (optional)
        </button>
        {showExtra && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">PNP nomination</label>
              <select value={pnp} onChange={e => setPnp(e.target.value)} className={selectClass}>
                <option value="0">No</option><option value="600">Yes (600 pts)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Canadian study</label>
              <select value={study} onChange={e => setStudy(e.target.value)} className={selectClass}>
                <option value="0">None</option><option value="15">1-2 years (15)</option><option value="30">3+ years / Master's / PhD (30)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Sibling in Canada</label>
              <select value={sibling} onChange={e => setSibling(e.target.value)} className={selectClass}>
                <option value="0">No</option><option value="15">Yes (15)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">French bonus</label>
              <select value={french} onChange={e => setFrench(e.target.value)} className={selectClass}>
                <option value="0">None</option><option value="25">NCLC7+ & English ≤ CLB4 (25)</option><option value="50">NCLC7+ & English ≥ CLB5 (50)</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-400 mb-1">Certificate of qualification (trades)</label>
              <select value={cert} onChange={e => setCert(e.target.value)} className={selectClass}>
                <option value="none">No</option><option value="yes">Yes (Canadian province/territory)</option>
              </select>
              <p className="text-xs text-slate-500 mt-1">All CLB ≥7 → 50 pts | All CLB ≥5 with one &lt;7 → 25 pts</p>
            </div>
          </div>
        )}

        <div className="text-xs text-slate-500">IRCC removed job-offer CRS points (50/200) on Mar 25, 2025. This tool excludes them.</div>

        {/* Calculate button */}
        <button onClick={jumpTo}
          className="w-full py-4 rounded-2xl bg-red-500 text-white font-bold text-sm hover:bg-red-400 transition-all duration-200 active:scale-[0.98] shadow-lg shadow-red-500/20">
          🧮 Calculate CRS
        </button>

        {/* Result */}
        {result.hasInput ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-red-500/15 bg-gradient-to-br from-red-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider">CRS Summary</h3>
            </div>
            <div className="text-4xl font-extrabold text-white">{result.total}</div>
            <div className="text-sm text-slate-400 mt-1">Total CRS Score</div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Core / Human capital</span>
                <span className="font-bold text-white">{result.core}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Skill transferability</span>
                <span className="font-bold text-white">{result.trans}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Additional</span>
                <span className="font-bold text-white">{result.bonus}</span>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-white/[0.04] border border-white/8 text-xs text-slate-400">
              First language (CLB): L {result.fl.L}, R {result.fl.R}, W {result.fl.W}, S {result.fl.S}
              {(result.sl.L || result.sl.R || result.sl.W || result.sl.S) &&
                ` · Second: L ${result.sl.L}, R ${result.sl.R}, W ${result.sl.W}, S ${result.sl.S}`}
            </div>
            <p className="text-xs text-slate-500 mt-3">Sources: IRCC CRS criteria (updated May/Jul 2025)</p>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🍁</div>
            <p className="text-sm text-slate-600 font-medium">Enter details to see your CRS score</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
