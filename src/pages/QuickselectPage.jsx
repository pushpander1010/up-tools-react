import { useState, useMemo, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import FAQ from '../components/FAQ'

const TITLE = 'Quickselect Algorithm Explained with Animation (Kth Smallest in O(n))'
const DESC = 'Learn Quickselect step by step with a live animation — find the kth smallest element without full sorting. Includes Python & JavaScript code, 5 practice questions and interview tips.'
const URL = 'https://www.uptools.in/learning/dsa/quickselect/'

// Build partition snapshots (Lomuto) for the visualizer
function buildSteps(arr, k) {
  const a = [...arr]
  const steps = []
  const push = (lo, hi, pivot, i, j, msg, done = []) =>
    steps.push({ arr: [...a], lo, hi, pivot, i, j, msg, done })

  function partition(lo, hi) {
    const pivot = a[hi]
    push(lo, hi, hi, lo, lo, `Pivot = ${pivot} (last element of [${lo}…${hi}]). Scan with j, track boundary i.`)
    let i = lo
    for (let j = lo; j < hi; j++) {
      push(lo, hi, hi, i, j, `Compare a[${j}] = ${a[j]} with pivot ${pivot}.`, done)
      if (a[j] <= pivot) {
        if (i !== j) {
          ;[a[i], a[j]] = [a[j], a[i]]
          push(lo, hi, hi, i, j, `✓ ${a[j]} ≤ ${pivot} — swap positions ${i} and ${j}.`, done)
        } else {
          push(lo, hi, hi, i, j, `✓ ${a[j]} ≤ ${pivot} — already in place, move boundary i forward.`, done)
        }
        i++
      } else {
        push(lo, hi, hi, i, j, `✗ ${a[j]} > ${pivot} — skip it, j moves on.`, done)
      }
    }
    ;[a[i], a[hi]] = [a[hi], a[i]]
    push(lo, hi, i, i, hi, `Place pivot ${pivot} at index ${i}. Left side ≤ pivot, right side > pivot.`, done)
    return i
  }

  function select(lo, hi, done) {
    if (lo === hi) {
      push(lo, hi, lo, -1, -1, `Only one element left — answer found: ${a[lo]}.`, [...done, lo])
      return a[lo]
    }
    const p = partition(lo, hi)
    if (k === p) {
      push(lo, hi, p, -1, -1, `🎯 Pivot landed exactly on index ${k} — answer is ${a[p]}!`, [...done, p])
      return a[p]
    }
    if (k < p) {
      push(lo, hi, p, -1, -1, `k=${k} is left of pivot index ${p} — recurse LEFT, ignore everything right of ${p}.`, [...done, p])
      return select(lo, p - 1, [...done, p])
    }
    push(lo, hi, p, -1, -1, `k=${k} is right of pivot index ${p} — recurse RIGHT, ignore everything left of ${p}.`, [...done, p])
    return select(p + 1, hi, [...done, p])
  }

  const answer = select(0, a.length - 1, [])
  return { steps, answer }
}

const QUESTIONS = [
  { q: 'Kth largest in an unsorted array (LeetCode 215)', a: 'Same as kth smallest with k = n − kth largest. Run Quickselect once — average O(n). The classic follow-up: "what if the array is a stream?" → use a min-heap of size k instead.' },
  { q: 'Top K frequent elements (LeetCode 347)', a: 'Count frequencies with a hash map, then Quickselect on the (value, frequency) pairs by frequency. Faster than sorting all unique elements when k is small.' },
  { q: 'K closest points to origin (LeetCode 973)', a: 'Compare by squared distance x² + y² (skip the sqrt). Quickselect partitions on distance and returns the k closest — no full sort needed.' },
  { q: 'Find the median without sorting', a: 'Median = kth smallest with k = n/2 (use the average of two middles for even n). Quickselect finds it in average O(n) — sorting would cost O(n log n).' },
  { q: 'Why does Quickselect average O(n)?', a: 'Each partition scans n, then n/2, then n/4… — the geometric series n + n/2 + n/4 + … sums to 2n, i.e. O(n). Worst case O(n²) happens only with consistently bad pivots (e.g. always smallest on sorted input).' },
]

const FAQS = [
  { q: 'What is the Quickselect algorithm?', a: 'Quickselect finds the kth smallest element in an unsorted array without sorting it fully. It partitions around a pivot (like Quicksort) but recurses into only one side — the side containing index k — giving O(n) average time.' },
  { q: 'Quickselect vs Quicksort — what is the difference?', a: 'Quicksort recurses into BOTH sides to sort everything (O(n log n)). Quickselect recurses into only ONE side because it only needs the element at index k (O(n) average). Same partition step, different goal.' },
  { q: 'What is the time complexity of Quickselect?', a: 'Average O(n), worst case O(n²) with bad pivots. Randomized pivot choice or median-of-medians keeps the worst case away in practice and theory respectively.' },
  { q: 'When should I use Quickselect in an interview?', a: 'Whenever a problem asks for kth smallest/largest, top-k, median, or closest-k without needing the full sorted order. Say the keywords "kth" + "unsorted" → think Quickselect, then mention the heap alternative and its tradeoff.' },
]

const PY_CODE = `def quickselect(nums, k):
    """Return kth smallest (0-indexed). Average O(n)."""
    import random
    lo, hi = 0, len(nums) - 1
    while True:
        if lo == hi:
            return nums[lo]
        # random pivot avoids worst case on sorted input
        p = random.randint(lo, hi)
        nums[p], nums[hi] = nums[hi], nums[p]
        pivot = nums[hi]
        i = lo
        for j in range(lo, hi):
            if nums[j] <= pivot:
                nums[i], nums[j] = nums[j], nums[i]
                i += 1
        nums[i], nums[hi] = nums[hi], nums[i]
        if k == i:
            return nums[i]
        elif k < i:
            hi = i - 1
        else:
            lo = i + 1`

const JS_CODE = `function quickselect(nums, k) {
  let lo = 0, hi = nums.length - 1;
  while (true) {
    if (lo === hi) return nums[lo];
    // random pivot avoids worst case on sorted input
    const r = lo + Math.floor(Math.random() * (hi - lo + 1));
    [nums[r], nums[hi]] = [nums[hi], nums[r]];
    const pivot = nums[hi];
    let i = lo;
    for (let j = lo; j < hi; j++) {
      if (nums[j] <= pivot) {
        [nums[i], nums[j]] = [nums[j], nums[i]];
        i++;
      }
    }
    [nums[i], nums[hi]] = [nums[hi], nums[i]];
    if (k === i) return nums[i];
    if (k < i) hi = i - 1;
    else lo = i + 1;
  }
}`

function CodeBlock({ lang, code }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="rounded-xl overflow-hidden border border-white/10">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5">
        <span className="text-xs font-bold text-slate-300">{lang}</span>
        <button onClick={() => { navigator.clipboard.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) }) }}
          className="text-xs font-semibold text-indigo-300 hover:text-white bg-transparent border-0 cursor-pointer">
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      </div>
      <pre className="m-0 p-4 text-xs leading-relaxed overflow-x-auto bg-black/40 text-slate-200"><code>{code}</code></pre>
    </div>
  )
}

export default function QuickselectPage() {
  const [input, setInput] = useState('7, 2, 9, 4, 3, 8, 1')
  const [k, setK] = useState(3)
  const [arr, setArr] = useState([7, 2, 9, 4, 3, 8, 1])
  const [stepIdx, setStepIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(900)
  const timer = useRef(null)

  const { steps, answer } = useMemo(() => {
    const kk = Math.max(0, Math.min(k, arr.length - 1))
    return buildSteps(arr, kk)
  }, [arr, k])

  const step = steps[Math.min(stepIdx, steps.length - 1)]

  useEffect(() => {
    if (playing) {
      if (stepIdx >= steps.length - 1) { setPlaying(false); return }
      timer.current = setTimeout(() => setStepIdx(i => i + 1), speed)
      return () => clearTimeout(timer.current)
    }
  }, [playing, stepIdx, steps.length, speed])

  const applyInput = () => {
    const nums = input.split(/[, ]+/).map(s => parseFloat(s.trim())).filter(n => !isNaN(n)).slice(0, 12)
    if (nums.length < 2) return
    setArr(nums)
    setK(k => Math.max(0, Math.min(k, nums.length - 1)))
    setStepIdx(0)
    setPlaying(false)
  }

  const max = Math.max(...arr, 1)
  const kk = Math.max(0, Math.min(k, arr.length - 1))

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: TITLE,
    description: DESC,
    image: 'https://www.uptools.in/assets/og/default.png',
    author: { '@type': 'Organization', name: 'UpTools', url: 'https://www.uptools.in/' },
    publisher: { '@type': 'Organization', name: 'UpTools', logo: { '@type': 'ImageObject', url: 'https://www.uptools.in/assets/logo/uptools-logo.svg' } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': URL },
  }
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How Quickselect finds the kth smallest element',
    step: [
      { '@type': 'HowToStep', text: 'Pick a pivot element from the array.' },
      { '@type': 'HowToStep', text: 'Partition: move elements smaller than the pivot left, larger ones right.' },
      { '@type': 'HowToStep', text: 'If the pivot lands on index k, return it — done.' },
      { '@type': 'HowToStep', text: 'Otherwise recurse only into the side containing k and repeat.' },
    ],
  }
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }

  const barColor = (idx) => {
    if ((step.done || []).includes(idx)) return 'linear-gradient(180deg,#22c55e,#15803d)'
    if (idx === step.pivot) return 'linear-gradient(180deg,#f59e0b,#b45309)'
    if (idx === step.i) return 'linear-gradient(180deg,#38bdf8,#0369a1)'
    if (idx === step.j) return 'linear-gradient(180deg,#a78bfa,#6d28d9)'
    if (idx < step.lo || idx > step.hi) return 'rgba(255,255,255,0.08)'
    return 'linear-gradient(180deg,#6366f1,#4338ca)'
  }

  return (
    <>
      <Helmet>
        <title>{TITLE} | UpTools</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={URL} />
        <meta property="og:title" content={`${TITLE} | UpTools`} />
        <meta property="og:description" content={DESC} />
        <meta property="og:url" content={URL} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="UpTools" />
        <meta property="og:image" content="https://www.uptools.in/assets/og/default.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${TITLE} | UpTools`} />
        <meta name="twitter:description" content={DESC} />
        <meta name="keywords" content="quickselect algorithm, quickselect explained, kth smallest element, quickselect animation, quickselect python, quickselect vs quicksort, selection algorithm O(n)" />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.uptools.in/' },
            { '@type': 'ListItem', position: 2, name: 'Learning', item: 'https://www.uptools.in/learning/' },
            { '@type': 'ListItem', position: 3, name: 'DSA', item: 'https://www.uptools.in/learning/dsa/' },
            { '@type': 'ListItem', position: 4, name: 'Quickselect', item: URL },
          ],
        })}</script>
      </Helmet>

      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-5 flex-wrap" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span className="text-slate-700">›</span>
        <Link to="/learning" className="hover:text-white transition-colors">Learning</Link>
        <span className="text-slate-700">›</span>
        <Link to="/learning/dsa" className="hover:text-white transition-colors">DSA</Link>
        <span className="text-slate-700">›</span>
        <span className="text-slate-300 font-medium">Quickselect</span>
      </nav>

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand/10 border border-brand/30 text-indigo-300 mb-4">
        <span>⚡</span> DSA · Selection Algorithm · Medium
      </div>
      <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight m-0 mb-3">
        Quickselect: find the kth smallest without sorting
      </h1>
      <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-3xl">
        Sorting to find one element is overkill. Quickselect partitions like Quicksort but
        chases only one side — averaging <strong className="text-white">O(n)</strong> time.
        Press play below and watch it work.
      </p>

      {/* ANIMATOR */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6" aria-label="Quickselect animation">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <h2 className="text-base font-bold text-white m-0">▶ Live animation</h2>
          <span className="text-xs text-slate-400">Step {Math.min(stepIdx + 1, steps.length)} / {steps.length}</span>
        </div>

        <div className="flex items-end justify-center gap-1.5 sm:gap-2.5 h-44 sm:h-56 mb-3" role="img"
          aria-label={`Quickselect animation, step ${stepIdx + 1}: ${step.msg}`}>
          {step.arr.map((v, idx) => (
            <div key={idx} className="flex-1 max-w-16 flex flex-col items-center gap-1.5 min-w-0">
              <span className="text-[11px] sm:text-xs font-bold text-white">{v}</span>
              <div className="w-full rounded-t-lg transition-all duration-300"
                style={{ height: `${Math.max(12, (v / max) * 130)}px`, background: barColor(idx) }} />
              <span className="text-[9px] sm:text-[10px] text-slate-500">[{idx}]</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400 mb-3">
          <span><span className="inline-block w-2.5 h-2.5 rounded-sm align-middle mr-1" style={{ background: '#f59e0b' }} /> pivot</span>
          <span><span className="inline-block w-2.5 h-2.5 rounded-sm align-middle mr-1" style={{ background: '#38bdf8' }} /> boundary i</span>
          <span><span className="inline-block w-2.5 h-2.5 rounded-sm align-middle mr-1" style={{ background: '#a78bfa' }} /> scanner j</span>
          <span><span className="inline-block w-2.5 h-2.5 rounded-sm align-middle mr-1" style={{ background: '#22c55e' }} /> settled</span>
          <span className="text-slate-500">grey = ignored this round</span>
        </div>

        <p className="text-sm text-slate-200 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 leading-relaxed min-h-12 m-0 mb-4">
          {step.msg}
        </p>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <button onClick={() => { setStepIdx(0); setPlaying(false) }}
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white cursor-pointer hover:bg-white/10">⏮ Reset</button>
          <button onClick={() => setStepIdx(i => Math.max(0, i - 1))}
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white cursor-pointer hover:bg-white/10">← Back</button>
          <button onClick={() => { if (stepIdx >= steps.length - 1) setStepIdx(0); setPlaying(p => !p) }}
            className="text-xs font-bold px-5 py-2 rounded-xl text-white border-0 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            {playing ? '⏸ Pause' : '▶ Play'}
          </button>
          <button onClick={() => setStepIdx(i => Math.min(steps.length - 1, i + 1))}
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white cursor-pointer hover:bg-white/10">Next →</button>
          <div className="flex items-center gap-1.5 ml-auto">
            {[{ l: 'Slow', v: 1400 }, { l: 'Normal', v: 900 }, { l: 'Fast', v: 400 }].map(s => (
              <button key={s.l} onClick={() => setSpeed(s.v)}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg border cursor-pointer ${speed === s.v ? 'text-white border-indigo-500 bg-indigo-500/20' : 'text-slate-400 border-white/10 bg-transparent'}`}>
                {s.l}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-[1fr_auto_auto] gap-2">
          <label className="flex items-center gap-2 text-xs text-slate-400">
            <span className="shrink-0 font-semibold">Array</span>
            <input value={input} onChange={e => setInput(e.target.value)}
              className="flex-1 min-w-0 text-xs px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono"
              placeholder="7, 2, 9, 4, 3, 8, 1" />
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold">k =</span>
            <input type="number" value={kk} min={0} max={arr.length - 1}
              onChange={e => { setK(Math.max(0, Math.min(arr.length - 1, parseInt(e.target.value) || 0))); setStepIdx(0); setPlaying(false) }}
              className="w-16 text-xs px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono" />
          </label>
          <button onClick={applyInput}
            className="text-xs font-bold px-4 py-2 rounded-xl text-white border-0 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #22c55e, #15803d)' }}>
            Try my array
          </button>
        </div>
        <p className="text-[11px] text-slate-500 mt-2 m-0">
          k is 0-indexed: k=0 → smallest, k=3 → 4th smallest. Current answer: <strong className="text-green-300">{answer}</strong> (sorted array would be {[...arr].sort((a, b) => a - b).join(', ')})
        </p>
      </section>

      {/* EXPLANATION */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-white mt-0 mb-3">How it works (4 steps)</h2>
        <ol className="text-sm text-slate-300 leading-relaxed space-y-2.5 list-decimal pl-5 m-0">
          <li><strong className="text-white">Pick a pivot.</strong> Any element works; random pivots avoid the worst case on sorted input.</li>
          <li><strong className="text-white">Partition around it.</strong> Walk through the array: everything ≤ pivot goes left, everything bigger goes right. The pivot lands in its final sorted position <em>p</em>.</li>
          <li><strong className="text-white">Compare p with k.</strong> If <em>p == k</em>, the pivot IS the answer — return it.</li>
          <li><strong className="text-white">Recurse one side only.</strong> If <em>k &lt; p</em>, repeat on the left half; else on the right half. The other half is thrown away — that is the whole trick.</li>
        </ol>
        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
          {[['Average', 'O(n)', 'Each round scans a fraction of the last'], ['Worst', 'O(n²)', 'Bad pivots every time (rare, fix with random pivot)'], ['Space', 'O(1)', 'In-place partitioning, iterative version']].map(([a, b, c]) => (
            <div key={a} className="rounded-xl bg-black/30 border border-white/10 px-2 py-3">
              <div className="text-[11px] text-slate-400 font-semibold">{a}</div>
              <div className="text-base sm:text-lg font-extrabold text-white">{b}</div>
              <div className="text-[10px] text-slate-500 leading-snug">{c}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CODE */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-white mt-0 mb-3">Code (copy-paste ready)</h2>
        <div className="space-y-3">
          <CodeBlock lang="Python" code={PY_CODE} />
          <CodeBlock lang="JavaScript" code={JS_CODE} />
        </div>
      </section>

      {/* QUESTIONS */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-white mt-0 mb-1">Practice questions</h2>
        <p className="text-xs text-slate-400 mt-0 mb-4">Real interview problems that reduce to Quickselect. Tap to reveal the approach.</p>
        <div className="space-y-2.5">
          {QUESTIONS.map((it, i) => (
            <details key={i} className="rounded-xl bg-black/30 border border-white/10 px-4 py-1 group">
              <summary className="cursor-pointer text-sm font-semibold text-white py-2.5 list-none flex items-center gap-2">
                <span className="text-indigo-300 text-xs font-bold shrink-0">Q{i + 1}</span>
                {it.q}
              </summary>
              <p className="text-xs text-slate-300 pb-3 pl-8 leading-relaxed m-0">{it.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* INTERVIEW TIPS */}
      <section className="rounded-2xl border border-indigo-500/20 p-5 sm:p-6 mb-6"
        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(17,24,39,0.4))' }}>
        <h2 className="text-lg font-bold text-white mt-0 mb-3">🎤 Interview tips</h2>
        <ul className="text-sm text-slate-300 leading-relaxed space-y-2 list-disc pl-5 m-0">
          <li><strong className="text-white">Say the trigger words:</strong> "kth element in an unsorted array → Quickselect, average O(n)." Interviewers listen for exactly this.</li>
          <li><strong className="text-white">Mention the tradeoff:</strong> "A heap also works in O(n log k) — better for streams, worse for one-shot arrays." Shows depth in one sentence.</li>
          <li><strong className="text-white">Name the worst case before they ask:</strong> "O(n²) with bad pivots, prevented by random pivot choice." Kills the hardest follow-up preemptively.</li>
          <li><strong className="text-white">Clarify k indexing:</strong> "Is k 0-indexed or 1-indexed?" — a 5-second question that prevents off-by-one bugs live.</li>
          <li><strong className="text-white">Offer the extension:</strong> "With median-of-medians pivot this is worst-case O(n) — the deterministic selection algorithm." Only if targeting top-tier roles.</li>
        </ul>
      </section>

      <FAQ questions={FAQS} />

      <div className="flex items-center justify-between flex-wrap gap-3 mt-6">
        <Link to="/learning/dsa" className="text-sm font-semibold text-indigo-300 no-underline">← All DSA lessons</Link>
        <span className="text-xs text-slate-500">Next up: Quicksort (coming soon)</span>
      </div>
    </>
  )
}
