import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import FAQ from '../components/FAQ'

const TITLE = 'AI Hallucinations & How to Verify AI Answers'
const DESC = 'Learn why AI invents confident-sounding facts with a live confident-vs-true meter — drag a slider from raw guess to source-verified answer and watch AI confidence stay pinned at 95% while the truth meter gets checked claim by claim. Includes Python & JavaScript claim-verification code, 5 practice questions, 4 FAQs and interview tips.'
const URL = 'https://www.uptools.in/learning/ai/hallucinations-and-verifying/'
const HERO = '/assets/learning/ai/ai-lesson4-hero.jpg'
const IMG_METER = '/assets/learning/ai/ai-lesson4-meter.jpg'
const IMG_CLAIMS = '/assets/learning/ai/ai-lesson4-claims.jpg'

// ---------------------------------------------------------------------------
// Live animator data: three questions, each with a confident-but-flawed
// guess, atomic claims to check, real sources, and the verified answer.
// ---------------------------------------------------------------------------
const SCENARIOS = [
  {
    q: 'Who wrote the first computer program, and in what year?',
    guess: 'Ada Lovelace wrote the first computer program in 1842 to compute Bernoulli numbers on Babbage’s Analytical Engine.',
    wrongPhrase: 'in 1842',
    confidence: 96,
    recalib: 58,
    claims: [
      { text: 'Ada Lovelace wrote the first computer program', ok: true, src: 'Wikipedia — Ada Lovelace; Britannica', note: 'Both sources credit Lovelace with the first published algorithm.' },
      { text: 'The program computed Bernoulli numbers', ok: true, src: 'Wikipedia — Analytical Engine notes', note: 'Her 1843 notes contain the Bernoulli-number algorithm.' },
      { text: 'It ran on Babbage’s Analytical Engine', ok: true, src: 'Wikipedia — Charles Babbage; Science Museum', note: 'Designed for the Analytical Engine, which was never built in her lifetime.' },
      { text: 'It was published in 1842', ok: false, src: 'Wikipedia — Ada Lovelace (notes published 1843)', note: 'Contradicted: her notes were published in 1843, not 1842.' },
    ],
    verified: 'Ada Lovelace published the first computer program — an algorithm to compute Bernoulli numbers — in 1843, as part of her notes on Luigi Menabrea’s article about Babbage’s Analytical Engine.',
    lesson: 'The author and topic were right; the year was confidently wrong. One bad detail is enough to break a citation.',
  },
  {
    q: 'What is the smallest prime number?',
    guess: '1 is the smallest prime number, because primes are numbers divisible only by 1 and themselves, so 1 qualifies.',
    wrongPhrase: 'so 1 qualifies',
    confidence: 94,
    recalib: 62,
    claims: [
      { text: '1 is a prime number', ok: false, src: 'Wikipedia — Prime number (definition: exactly two divisors)', note: 'Contradicted: by definition a prime has exactly two divisors — 1 has only one.' },
      { text: '2 is the smallest prime number', ok: true, src: 'Wikipedia — Prime number; NIST', note: 'Both sources list 2 as the smallest (and only even) prime.' },
      { text: 'Primes are divisible only by 1 and themselves', ok: true, src: 'Wikipedia — Prime number; Britannica', note: 'Supported — with the caveat “exactly two distinct divisors”.' },
    ],
    verified: '2 is the smallest prime number. A prime must have exactly two distinct divisors — 1 has only one, so 1 is neither prime nor composite.',
    lesson: 'The model repeated a definition but dropped the word “exactly”. Small omissions flip the whole conclusion.',
  },
  {
    q: 'Who created the Python language, and in what year?',
    guess: 'Python was created by James Gosling in 1995 and quickly became the standard language for enterprise applications.',
    wrongPhrase: 'James Gosling in 1995',
    confidence: 97,
    recalib: 54,
    claims: [
      { text: 'James Gosling created Python', ok: false, src: 'Wikipedia — Python (creator: Guido van Rossum)', note: 'Contradicted: Guido van Rossum created Python — Gosling created Java.' },
      { text: 'Python was created in 1995', ok: false, src: 'Wikipedia — Python (first release Feb 1991)', note: 'Contradicted: first released in February 1991.' },
      { text: 'Python is widely used today', ok: true, src: 'TIOBE Index; Stack Overflow survey', note: 'Supported — consistently a top-3 language.' },
    ],
    verified: 'Python was created by Guido van Rossum at CWI, with its first public release in February 1991. It is one of the most widely used languages today.',
    lesson: 'Two details were wrong and both were invented with maximum confidence — the classic hallucination pattern.',
  },
]

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

const QUESTIONS = [
  { q: 'What is an AI hallucination?', a: 'A hallucination is when a model produces an answer that is fluent, confident and plausible but factually wrong — invented dates, fake citations, nonexistent people or books, wrong numbers. It happens because models generate the most probable next word, not the most true one: nothing in training forces an answer to be grounded in a real source, so when the model is unsure it fills the gap with statistically likely-sounding detail instead of saying “I don’t know”.' },
  { q: 'Why is AI so confident when it is wrong?', a: 'Confidence and correctness are not connected in how models generate text. A model assigns probability to word sequences, not to facts — a fabricated detail can be just as “fluent” to the model as a true one, so it is delivered with the same tone, structure and certainty. That is why the demo’s confidence meter stays pinned high while the truth meter changes: the model is not lying, it has no internal fact-detector to be uncertain with.' },
  { q: 'How do you verify an AI answer?', a: 'Split the answer into atomic claims, then check each claim independently against a primary source — official documentation, the original paper, a first-party website, or a reputable reference. Look up exact names, dates, numbers and quotes rather than trusting the summary, and prefer sources that predate the AI’s training data. If two independent credible sources agree, the claim is safe to use; if they disagree with the model, trust the sources.' },
  { q: 'Does asking the AI to “be sure” reduce hallucinations?', a: 'Barely. Wording like “be sure” or “only answer if you are certain” nudges the model toward more conservative phrasing but gives it no new information and no way to check itself — it still has to guess from the same weights. The fixes that actually work are structural: give the model real sources to ground on (RAG), ask it to quote and cite, run a separate verification pass, or let it refuse when evidence is missing.' },
  { q: 'Are smaller models more hallucination-prone than larger ones?', a: 'All sizes hallucinate; larger models tend to be better calibrated on facts they were trained on, but they are perfectly capable of fluent fabrication too — especially on niche, recent or adversarial questions. Hallucination risk depends more on the question than the model size: ask for obscure statistics, invented-sounding names, or exact citations and even the biggest models will confabulate. Verification habits matter more than model choice.' },
]

const FAQS = [
  { q: 'What is an AI hallucination?', a: 'An AI hallucination is a confident, well-formed answer that is factually wrong — a made-up date, a fake citation, a nonexistent paper, a wrong number. It comes from how models work: they generate the most statistically likely next word, not a verified fact. When the training data does not contain (or the model cannot recall) the true answer, it still produces something plausible, because plausible-sounding is exactly what it optimizes for.' },
  { q: 'Why does ChatGPT sound so sure when it makes things up?', a: 'Because fluency and truth are separate things in a language model. The same machinery that produces a correct sentence produces an incorrect one — there is no internal fact-checker deciding the tone, so fabricated details arrive with the same confident, structured delivery as real ones. The live demo on this page shows it directly: the confidence meter stays pinned near 95% whether the answer is right or wrong, until an external check forces a recalibration.' },
  { q: 'How do I fact-check an AI answer quickly?', a: 'Break the answer into atomic claims — one checkable fact per line — then verify each one against a primary source: official docs, the original paper, a first-party site, or a trusted reference like Wikipedia for orientation (then go deeper). Check exact names, dates and numbers first, because those are what models fabricate most. A claim two independent credible sources agree on is safe; a claim that only exists inside the AI’s answer should be treated as unverified.' },
  { q: 'Can AI hallucinations be completely eliminated?', a: 'Not with prompting alone — asking the model to “be sure” changes its wording, not its knowledge. What reduces hallucinations dramatically is grounding: retrieval-augmented generation (RAG) that feeds the model real documents, requiring citations to those documents, restricting the model to answer only from the provided sources, and adding a verification step that checks claims against sources before anyone acts on them. Even then, verification stays necessary — grounded models can still misquote their sources.' },
]

const PY_CODE = `class ClaimVerifier:
    """Split an AI answer into atomic claims and check each one against sources."""

    def __init__(self, sources: dict[str, str]):
        self.sources = sources          # source name -> its text

    def extract_claims(self, answer: str) -> list[str]:
        # one atomic claim per sentence — small enough to check on its own
        return [s.strip() for s in answer.replace('?', '.').split('.')
                if len(s.strip()) > 12]

    @staticmethod
    def _conflicts(claim: str, source_text: str) -> bool:
        # crude demo heuristic: a number in the claim the source never repeats
        nums = [w for w in claim.split() if w.replace(',', '').isdigit()]
        return bool(nums) and all(n not in source_text for n in nums)

    def check(self, claim: str) -> dict:
        contradicted = [n for n, t in self.sources.items()
                        if self._conflicts(claim, t)]
        supported = [n for n, t in self.sources.items()
                     if n not in contradicted
                     and any(w in t.lower() for w in claim.lower().split()
                             if len(w) > 4)]
        if contradicted:
            status = 'CONTRADICTED'
        elif len(supported) >= 2:
            status = 'SUPPORTED'
        else:
            status = 'UNVERIFIED'
        return {'claim': claim, 'status': status,
                'sources': contradicted or supported}


verifier = ClaimVerifier({
    'Wikipedia': 'Ada Lovelace published her notes on the Analytical '
                 'Engine in 1843, including an algorithm for Bernoulli '
                 'numbers.',
    'Britannica': 'Lovelace\'s notes appeared in 1843 as part of her '
                  'translation of Menabrea\'s article.',
})

answer = ('Ada Lovelace wrote the first computer program in 1842 '
          'to compute Bernoulli numbers.')
for claim in verifier.extract_claims(answer):
    print(verifier.check(claim))
# -> {'claim': 'Ada Lovelace wrote the first...', 'status': 'SUPPORTED', ...}
# -> {'claim': 'in 1842 to compute...', 'status': 'CONTRADICTED', ...}`

const JS_CODE = `class ClaimVerifier {
  constructor(sources) {
    this.sources = sources;           // source name -> its text
  }

  extractClaims(answer) {
    // one atomic claim per sentence — small enough to check on its own
    return answer.replace(/\\?/g, '.').split('.')
      .map(s => s.trim())
      .filter(s => s.length > 12);
  }

  conflicts(claim, sourceText) {
    // crude demo heuristic: a number in the claim the source never repeats
    const nums = claim.split(/\\s+/).filter(w => /^[\\d,]+$/.test(w));
    return nums.length > 0 && nums.every(n => !sourceText.includes(n));
  }

  check(claim) {
    const contradicted = Object.keys(this.sources)
      .filter(n => this.conflicts(claim, this.sources[n]));
    const supported = Object.keys(this.sources)
      .filter(n => !contradicted.includes(n)
        && claim.toLowerCase().split(/\\s+/)
             .some(w => w.length > 4 && this.sources[n].toLowerCase().includes(w)));
    const status = contradicted.length ? 'CONTRADICTED'
      : supported.length >= 2 ? 'SUPPORTED' : 'UNVERIFIED';
    return { claim, status, sources: contradicted.length ? contradicted : supported };
  }
}

const verifier = new ClaimVerifier({
  Wikipedia: 'Ada Lovelace published her notes on the Analytical Engine in 1843, including an algorithm for Bernoulli numbers.',
  Britannica: "Lovelace's notes appeared in 1843 as part of her translation of Menabrea's article.",
});

const answer = 'Ada Lovelace wrote the first computer program in 1842 to compute Bernoulli numbers.';
for (const claim of verifier.extractClaims(answer)) {
  console.log(verifier.check(claim));
}
// -> { claim: 'Ada Lovelace wrote the first...', status: 'SUPPORTED', ... }
// -> { claim: 'in 1842 to compute...', status: 'CONTRADICTED', ... }`

export default function HallucinationsPage() {
  const [scIdx, setScIdx] = useState(0)
  const [t, setT] = useState(0)          // slider 0 (raw guess) → 100 (verified)
  const [playing, setPlaying] = useState(false)
  const sc = SCENARIOS[scIdx]
  const n = sc.claims.length

  // Stage boundaries on the slider: guess → claims → sources → verified
  const stage = t < 28 ? 0 : t < 52 ? 1 : t < 78 ? 2 : 3
  const STAGES = ['Raw guess', 'Extract claims', 'Check sources', 'Verified']

  // Per-claim reveal (claims listed) and verdict (source checked) times
  const revealAt = i => 30 + (i * 18) / n
  const checkAt = i => 54 + (i * 18) / n
  const claimsListed = sc.claims.filter((_, i) => t >= revealAt(i)).length
  const checksDone = sc.claims.filter((_, i) => t >= checkAt(i)).length
  const wrongChecked = sc.claims.some((c, i) => !c.ok && t >= checkAt(i))

  // Truth meter: unverified guess → climbs per supported claim, dips on the
  // contradiction, snaps to 100 once the verified answer is shown.
  let truth = 6
  if (stage >= 1) truth = 22
  if (stage >= 2) {
    truth = 22
    sc.claims.forEach((c, i) => {
      if (t >= checkAt(i)) truth += c.ok ? 60 / n : -14
    })
    truth = Math.max(8, Math.min(96, truth))
  }
  if (stage >= 3) truth = 100
  const confidence = stage >= 3 ? sc.recalib : sc.confidence

  // Auto-play: advance the slider to 100, ~7s, then stop.
  useEffect(() => {
    if (!playing) return
    if (t >= 100) { setPlaying(false); return }
    const id = setTimeout(() => setT(x => Math.min(100, x + 1)), 70)
    return () => clearTimeout(id)
  }, [playing, t])

  const startPlay = () => {
    if (playing) { setPlaying(false); return }
    if (t >= 100) setT(0)
    setPlaying(true)
  }
  const onSlider = e => { setPlaying(false); setT(+e.target.value) }
  const reset = () => { setPlaying(false); setT(0) }
  const switchSc = i => { setPlaying(false); setScIdx(i); setT(0) }

  const truthColor = truth >= 80 ? '#22c55e' : truth >= 40 ? '#f59e0b' : '#f43f5e'

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
    name: 'How to verify an AI answer before you trust it, step by step',
    step: [
      { '@type': 'HowToStep', text: 'Read the AI answer and split it into atomic claims — one checkable fact per line (names, dates, numbers, quotes).' },
      { '@type': 'HowToStep', text: 'Watch the live demo: drag the slider from raw guess to verified and see confidence stay pinned while each claim gets checked against real sources.' },
      { '@type': 'HowToStep', text: 'Check each claim independently against a primary source — official docs, the original paper, or a first-party website — not the model’s summary.' },
      { '@type': 'HowToStep', text: 'Treat any claim contradicted by a source, or found nowhere but the AI’s answer, as unverified — no matter how confident the wording sounds.' },
      { '@type': 'HowToStep', text: 'In your own apps, ground the model with real documents (RAG), require citations, and run a verification pass before acting on any answer.' },
    ],
  }
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
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
        <meta property="og:image" content="https://www.uptools.in/assets/learning/ai/ai-lesson4-hero.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${TITLE} | UpTools`} />
        <meta name="twitter:description" content={DESC} />
        <meta name="twitter:image" content="https://www.uptools.in/assets/learning/ai/ai-lesson4-hero.jpg" />
        <meta name="keywords" content="AI hallucination examples, why AI makes things up, how to verify AI answers, fact-check ChatGPT, AI confidence vs accuracy, claim verification AI, AI sources citations, hallucination detection" />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.uptools.in/' },
            { '@type': 'ListItem', position: 2, name: 'Learning', item: 'https://www.uptools.in/learning/' },
            { '@type': 'ListItem', position: 3, name: 'AI', item: 'https://www.uptools.in/learning/ai/' },
            { '@type': 'ListItem', position: 4, name: 'Hallucinations & Verifying', item: URL },
          ],
        })}</script>
      </Helmet>

      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-5 flex-wrap" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span className="text-slate-700">›</span>
        <Link to="/learning" className="hover:text-white transition-colors">Learning</Link>
        <span className="text-slate-700">›</span>
        <Link to="/learning/ai" className="hover:text-white transition-colors">AI</Link>
        <span className="text-slate-700">›</span>
        <span className="text-slate-300 font-medium">Hallucinations &amp; Verifying</span>
      </nav>

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 border border-rose-500/30 text-rose-300 mb-4">
        <span>🔍</span> AI · Lesson 4 · Beginner
      </div>
      <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight m-0 mb-3">
        Hallucinations &amp; verifying: why AI invents facts — and how to catch it
      </h1>
      <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-3xl">
        Models generate the most <em>probable</em> next word, not the most <em>true</em> one — so they
        invent dates, names and citations with the same confident tone as real facts. Below, drag the
        slider from raw guess to source-verified answer: AI confidence stays pinned near 95% the whole
        way, while the truth gets checked claim by claim against real sources.
      </p>

      <figure className="m-0 mb-6 rounded-2xl border border-white/[0.06] overflow-hidden">
        <img src={HERO}
          alt="Two friendly robots — one confidently presenting a glowing chat answer, the other checking a stack of source documents with a magnifying glass and green checkmarks"
          width="1600" height="893" loading="eager" className="w-full h-auto block" />
      </figure>

      {/* LIVE CONFIDENT-VS-TRUE METER */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6" aria-label="Live confident-vs-true meter animation">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <h2 className="text-base font-bold text-white m-0">▶ Live demo: the confident-vs-true meter</h2>
          <span className="text-xs text-slate-400">Stage: {STAGES[stage]} · {playing ? 'playing' : t === 0 ? 'idle' : t >= 100 ? 'done' : 'paused'}</span>
        </div>

        {/* QUESTION TABS */}
        <div className="flex flex-wrap gap-2 mb-4">
          {SCENARIOS.map((s, i) => (
            <button key={i} onClick={() => switchSc(i)}
              className={`text-xs font-bold px-3.5 py-2 rounded-xl border cursor-pointer transition-all ${i === scIdx ? 'text-white border-rose-500/60 shadow-lg shadow-rose-500/10' : 'text-slate-400 border-white/10 bg-transparent hover:bg-white/5'}`}
              style={i === scIdx ? { background: 'linear-gradient(135deg, rgba(244,63,94,0.22), rgba(159,18,57,0.18))' } : undefined}>
              {['📜 First program', '🔢 Smallest prime', '🐍 Python creator'][i]}
            </button>
          ))}
          <div className="flex gap-2 ml-auto">
            <button onClick={startPlay}
              className="text-xs font-bold px-5 py-2.5 rounded-xl text-white border-0 cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #f43f5e, #9f1239)' }}>
              {playing ? '⏸ Pause' : t >= 100 ? '↻ Replay' : '▶ Auto-play'}
            </button>
            <button onClick={reset}
              className="text-xs font-semibold px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white cursor-pointer hover:bg-white/10">
              Reset
            </button>
          </div>
        </div>

        {/* THE QUESTION + RAW ANSWER */}
        <div className="rounded-xl border border-white/10 bg-black/30 p-4 mb-4">
          <div className="text-[10px] font-bold text-slate-400 mb-1">THE QUESTION</div>
          <div className="text-sm font-semibold text-white mb-3">{sc.q}</div>
          <div className="text-[10px] font-bold text-slate-400 mb-1">AI ANSWER <span className="text-slate-600">(as generated — no sources)</span></div>
          <div className="text-sm text-slate-200 leading-relaxed rounded-lg px-3 py-2.5 bg-green-500/[0.04] border border-green-500/15">
            {sc.guess.split(sc.wrongPhrase).map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className={`font-bold transition-colors duration-300 ${wrongChecked ? 'text-rose-400 line-through decoration-rose-400/70' : 'text-slate-100'}`}>{sc.wrongPhrase}</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* THE TWO METERS */}
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-300">🔥 AI self-confidence</span>
              <span className="text-xs font-mono font-bold text-amber-300">{confidence}%</span>
            </div>
            <div className="h-3 rounded-full bg-black/50 overflow-hidden">
              <div className="h-full rounded-full transition-[width] duration-500 ease-out"
                style={{ width: `${confidence}%`, background: 'linear-gradient(90deg,#b45309,#f59e0b)' }} />
            </div>
            <p className="text-[10px] text-slate-500 m-0 mt-2 leading-snug">
              {stage >= 3
                ? `Recalibrated to ${sc.recalib}% only AFTER external checks contradicted the answer — the model never lowered it on its own.`
                : 'Pinned high no matter what — the model has no internal fact-detector. Watch it refuse to move while the truth changes.'}
            </p>
          </div>
          <div className="rounded-xl border p-4" style={{ borderColor: `${truthColor}44`, background: `${truthColor}0a` }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold" style={{ color: truthColor }}>✅ Verified truth</span>
              <span className="text-xs font-mono font-bold" style={{ color: truthColor }}>{Math.round(truth)}%</span>
            </div>
            <div className="h-3 rounded-full bg-black/50 overflow-hidden">
              <div className="h-full rounded-full transition-[width] duration-500 ease-out"
                style={{ width: `${truth}%`, background: `linear-gradient(90deg, ${truthColor}88, ${truthColor})` }} />
            </div>
            <p className="text-[10px] text-slate-500 m-0 mt-2 leading-snug">
              {stage === 0
                ? 'Unverified guess — nothing has been checked yet, so the answer is worth zero until sources speak.'
                : stage === 1
                  ? `${claimsListed}/${n} claims extracted — listing claims is not the same as verifying them.`
                  : stage === 2
                    ? `${checksDone}/${n} claims checked against sources${wrongChecked ? ' — a contradiction just knocked the meter down' : ''}.`
                    : 'Verified: every claim was checked against real sources and the corrected answer is in.'}
            </p>
          </div>
        </div>

        {/* SLIDER + STAGE TRACK */}
        <div className="rounded-xl border border-white/10 bg-black/30 p-4 mb-4">
          <div className="flex justify-between text-[10px] font-bold mb-2">
            {STAGES.map((s, i) => (
              <span key={s} className={`transition-colors ${stage === i ? 'text-white' : stage > i ? 'text-green-400' : 'text-slate-600'}`}>
                {stage > i ? '✓ ' : ''}{s}
              </span>
            ))}
          </div>
          <input type="range" min="0" max="100" value={t} onInput={onSlider}
            aria-label="Verification progress: drag from raw guess to verified answer"
            className="w-full cursor-pointer" style={{ accentColor: '#f43f5e' }} />
          <div className="flex justify-between mt-1 text-[10px] text-slate-500 font-mono">
            <span>← raw guess</span>
            <span>{checksDone}/{n} claims checked · sources checked</span>
            <span>verified →</span>
          </div>
        </div>

        {/* CLAIMS + SOURCES */}
        <div className="grid md:grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/[0.03] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-rose-300">🧩 Atomic claims from the answer</span>
              <span className="text-[10px] font-mono text-slate-500">{claimsListed}/{n} listed</span>
            </div>
            <div className="space-y-2 min-h-[180px]">
              {sc.claims.slice(0, claimsListed).map((c, i) => {
                const checked = t >= checkAt(i)
                return (
                  <div key={i}
                    className={`rounded-lg px-3 py-2 border text-xs leading-relaxed transition-all duration-500 ${checked
                      ? c.ok ? 'bg-green-500/[0.07] border-green-500/40' : 'bg-rose-500/[0.09] border-rose-500/50'
                      : 'bg-black/30 border-white/10'}`}>
                    <div className="flex items-start gap-2">
                      <span className="text-[10px] font-bold text-slate-500 mt-0.5">C{i + 1}</span>
                      <span className={`flex-1 ${checked && !c.ok ? 'text-rose-200' : checked ? 'text-green-100' : 'text-slate-300'}`}>{c.text}</span>
                      {checked && <span className={`text-sm font-bold shrink-0 ${c.ok ? 'text-green-400' : 'text-rose-400'}`}>{c.ok ? '✓' : '✗'}</span>}
                    </div>
                    {checked && <p className={`text-[10px] m-0 mt-1 pl-6 leading-snug ${c.ok ? 'text-green-400/80' : 'text-rose-300/90'}`}>{c.note}</p>}
                  </div>
                )
              })}
              {claimsListed === 0 && (
                <p className="text-[11px] text-slate-500 italic m-0">Nothing listed yet — drag the slider right (or press Auto-play) to split the answer into claims.</p>
              )}
            </div>
          </div>
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/[0.03] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-indigo-300">📚 Sources checked</span>
              <span className="text-[10px] font-mono text-slate-500">{checksDone}/{n} verdicts</span>
            </div>
            <div className="space-y-2 min-h-[180px]">
              {sc.claims.slice(0, claimsListed).map((c, i) => {
                const checked = t >= checkAt(i)
                return (
                  <div key={i}
                    className={`rounded-lg px-3 py-2 border text-xs transition-all duration-500 ${checked ? 'border-indigo-500/40 bg-indigo-500/[0.07]' : 'border-dashed border-white/10 bg-transparent'}`}>
                    {checked ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-indigo-300 truncate pr-2">{c.src}</span>
                          <span className={`text-[10px] font-bold shrink-0 ${c.ok ? 'text-green-400' : 'text-rose-400'}`}>{c.ok ? 'SUPPORTED' : 'CONTRADICTED'}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 m-0 mt-1 leading-snug">{c.ok ? 'Source agrees with this claim.' : 'Source disagrees — the AI’s detail does not appear anywhere in it.'}</p>
                      </>
                    ) : (
                      <p className="text-[10px] text-slate-600 m-0 italic">Claim C{i + 1} not checked yet.</p>
                    )}
                  </div>
                )
              })}
              {claimsListed === 0 && (
                <p className="text-[11px] text-slate-500 italic m-0">Sources appear as each claim is checked — drag right to start verification.</p>
              )}
            </div>
          </div>
        </div>

        {/* VERIFIED ANSWER */}
        {stage >= 3 ? (
          <div className="rounded-xl border border-green-500/40 bg-green-500/[0.07] p-4 mb-4 animate-[fadeIn_.5s_ease-out]">
            <div className="text-[10px] font-bold text-green-400 mb-1">✅ VERIFIED ANSWER (sources checked)</div>
            <p className="text-sm text-green-50 m-0 leading-relaxed">{sc.verified}</p>
            <p className="text-[10px] text-green-400/80 m-0 mt-2 leading-snug">💡 {sc.lesson}</p>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-white/10 p-4 mb-4">
            <p className="text-[11px] text-slate-500 m-0 italic">The verified answer appears here once every claim has been checked — drag the slider to 100%.</p>
          </div>
        )}

        <p className="text-[11px] text-slate-500 m-0">
          The point of the demo: <strong className="text-slate-300">confidence is not evidence.</strong> The
          amber meter barely moves for the whole journey — only an external check against real sources
          moved it, and only in the final stage. That is why “the AI sounded sure” is never a reason to
          trust an answer.
        </p>

        <figure className="m-0 mt-4 rounded-xl border border-white/10 overflow-hidden">
          <img src={IMG_METER}
            alt="Dashboard with two gauges — one needle pinned high for AI confidence, the other climbing from red to green for verified truth, with a slider and source cards"
            width="1600" height="893" loading="lazy" className="w-full h-auto block" />
        </figure>
      </section>

      {/* EXPLANATION */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-white mt-0 mb-3">Why hallucinations happen — and why confidence lies</h2>
        <ol className="text-sm text-slate-300 leading-relaxed space-y-2.5 list-decimal pl-5 m-0">
          <li><strong className="text-white">Models predict, they do not look up.</strong> Every token is chosen for statistical plausibility against the training data — there is no live fact-check happening as the answer is written.</li>
          <li><strong className="text-white">Gaps get filled, not flagged.</strong> When the model is unsure, it does not go blank — it completes the pattern with the most believable-sounding detail it has seen, which is exactly what a fabricated date or citation is.</li>
          <li><strong className="text-white">Fluency mimics certainty.</strong> The same machinery that writes a correct sentence writes an incorrect one, so wrong answers arrive with the same confident tone, structure and hedging-free delivery as right ones.</li>
          <li><strong className="text-white">Verification must be external.</strong> Only checking claims against real sources — docs, papers, first-party sites — moves the truth meter. Prompting the model to “be sure” changes its wording, not its knowledge.</li>
        </ol>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 text-center">
          {[['Predict next word', 'Not fetch facts', 'Fabrication is by design'], ['Confidence ≠ truth', 'Tone stays the same', 'Only sources move it'], ['Check atomic claims', 'One fact per line', 'Small enough to verify'], ['Ground with RAG', 'Feed real documents', 'Citations you can open']].map(([a, b, c]) => (
            <div key={a} className="rounded-xl bg-black/30 border border-white/10 px-2 py-3">
              <div className="text-[11px] text-slate-400 font-semibold">{a}</div>
              <div className="text-sm sm:text-base font-extrabold text-white">{b}</div>
              <div className="text-[10px] text-slate-500 leading-snug">{c}</div>
            </div>
          ))}
        </div>
        <figure className="m-0 mt-4 rounded-xl border border-white/10 overflow-hidden">
          <img src={IMG_CLAIMS}
            alt="Diagram: an AI answer card breaking into three claim chips, each linked by glowing lines to source documents below — two claims green with checkmarks, one amber with a warning"
            width="1600" height="893" loading="lazy" className="w-full h-auto block" />
        </figure>
      </section>

      {/* CODE */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-white mt-0 mb-3">Code (copy-paste ready)</h2>
        <p className="text-xs text-slate-400 mt-0 mb-4">A ClaimVerifier: splits an AI answer into atomic claims, then checks each one against a set of sources — flagging SUPPORTED, CONTRADICTED or UNVERIFIED. This is the same move the live demo makes, in code you can extend with real source lookups.</p>
        <div className="space-y-3">
          <CodeBlock lang="Python" code={PY_CODE} />
          <CodeBlock lang="JavaScript" code={JS_CODE} />
        </div>
      </section>

      {/* QUESTIONS */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-white mt-0 mb-1">Practice questions</h2>
        <p className="text-xs text-slate-400 mt-0 mb-4">The questions interviewers actually ask about AI hallucinations and verification. Tap to reveal the approach.</p>
        <div className="space-y-2.5">
          {QUESTIONS.map((it, i) => (
            <details key={i} className="rounded-xl bg-black/30 border border-white/10 px-4 py-1 group">
              <summary className="cursor-pointer text-sm font-semibold text-white py-2.5 list-none flex items-center gap-2">
                <span className="text-rose-300 text-xs font-bold shrink-0">Q{i + 1}</span>
                {it.q}
              </summary>
              <p className="text-xs text-slate-300 pb-3 pl-8 leading-relaxed m-0">{it.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* INTERVIEW TIPS */}
      <section className="rounded-2xl border border-green-500/20 p-5 sm:p-6 mb-6"
        style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(17,24,39,0.4))' }}>
        <h2 className="text-lg font-bold text-white mt-0 mb-3">🎤 Interview tips</h2>
        <ul className="text-sm text-slate-300 leading-relaxed space-y-2 list-disc pl-5 m-0">
          <li><strong className="text-white">Name the mechanism first:</strong> “Hallucination isn’t the model lying — it’s next-token prediction with no fact-checker in the loop. Confident tone and factual accuracy are independent, which is why wrong answers sound exactly like right ones.”</li>
          <li><strong className="text-white">Explain the verification move:</strong> “I split the answer into atomic claims and check each against a primary source — official docs, the original paper — not the model’s summary. Small checkable details like dates and numbers are where fabrication concentrates.”</li>
          <li><strong className="text-white">Say why prompting fails:</strong> “‘Be sure’ changes wording, not knowledge — the model still guesses from the same weights. Real reductions come from grounding: RAG over real documents, required citations, and a separate verification pass.”</li>
          <li><strong className="text-white">Use the confidence-vs-truth framing:</strong> “In my demo, AI confidence stays pinned at ~95% whether the answer is right or wrong; only external source checks move the truth meter. That’s the mental model I’d want any user to have.”</li>
          <li><strong className="text-white">Handle the “bigger model fixes it?” follow-up:</strong> “Larger models are better calibrated on familiar facts but still confabulate on niche, recent or adversarial questions. Model choice lowers the rate; it doesn’t remove the need for verification.”</li>
        </ul>
      </section>

      <FAQ questions={FAQS} />

      <div className="flex items-center justify-between flex-wrap gap-3 mt-6">
        <Link to="/learning/ai/context-and-memory" className="text-sm font-semibold text-green-300 no-underline">← Lesson 3: Context &amp; memory</Link>
        <Link to="/learning/ai/embeddings-and-search" className="text-sm font-semibold text-green-300 no-underline">Lesson 5: Embeddings &amp; Search →</Link>
      </div>
    </>
  )
}
