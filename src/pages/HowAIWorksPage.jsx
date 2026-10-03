import { useState, useMemo, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import FAQ from '../components/FAQ'

const TITLE = 'How AI Actually Works in Plain English with Animation'
const DESC = 'See how AI really works with a live next-word predictor — animated probability bars, a plain-English 5-step explanation, Python & JavaScript code, 5 practice questions, 4 FAQs and interview tips.'
const URL = 'https://www.uptools.in/learning/ai/how-ai-works/'

const PRESETS = [
  'The quick brown fox jumps over the lazy dog',
  'Machine learning models learn patterns from data',
  'A neural network adjusts its weights after every prediction',
  'The cat sat on the mat and then slept',
  'Practice every day and your skills keep growing',
  'Artificial intelligence can write text and answer questions',
]

const TEMPS = [
  { l: 'Low', v: 0.35, hint: 'picks the safest, most common word' },
  { l: 'Normal', v: 0.9, hint: 'balanced, realistic mix' },
  { l: 'Wild', v: 1.9, hint: 'flattens chances — surprises appear' },
]

const FALLBACK = ['the', 'and', 'a', 'to']

function clean(w) { return w.toLowerCase().replace(/[^a-z0-9']/g, '') }

// Tiny model: bigram + unigram counts built from the preset sentences.
const BIGRAM = new Map()
const UNIGRAM = new Map()
for (const s of PRESETS) {
  const ws = s.split(/\s+/).map(clean).filter(Boolean)
  for (let i = 0; i < ws.length; i++) {
    UNIGRAM.set(ws[i], (UNIGRAM.get(ws[i]) || 0) + 1)
    if (i > 0) {
      const key = ws[i - 1]
      if (!BIGRAM.has(key)) BIGRAM.set(key, new Map())
      const m = BIGRAM.get(key)
      m.set(ws[i], (m.get(ws[i]) || 0) + 1)
    }
  }
}

// Predict 4 candidate next words with temperature-scaled probabilities.
function predict(context, temperature) {
  const last = context[context.length - 1]
  let counts = new Map()
  if (last && BIGRAM.has(last)) {
    for (const [w, c] of BIGRAM.get(last)) counts.set(w, (counts.get(w) || 0) + c)
  }
  if (counts.size === 0) {
    for (const [w, c] of UNIGRAM) counts.set(w, c)
  }
  if (counts.size === 0) for (const w of FALLBACK) counts.set(w, 1)

  let top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4)
  const total = top.reduce((s, [, c]) => s + c, 0) || 1
  const powered = top.map(([, c]) => Math.pow(c / total, 1 / temperature))
  const ps = powered.reduce((s, x) => s + x, 0) || 1
  const out = top.map(([w], i) => ({ word: w, pct: (powered[i] / ps) * 100 }))

  // Pad to exactly 4 candidates so rendering is always index-safe.
  for (const w of FALLBACK) {
    if (out.length >= 4) break
    if (!out.some(o => o.word === w)) out.push({ word: w, pct: 0 })
  }
  while (out.length < 4) out.push({ word: `…${out.length}`, pct: 0 })
  return out
}

const QUESTIONS = [
  { q: 'What exactly is an "AI model"?', a: 'A very large function with adjustable numbers inside (called weights). Input goes in, a prediction comes out, and the numbers are tuned until the predictions are good. "Training" = tuning the numbers; "using" = running the function on new input.' },
  { q: 'Why does an LLM only predict the next word?', a: 'Because next-word prediction, scaled to billions of examples, quietly forces the model to learn grammar, facts and even reasoning patterns — all useful knowledge is needed to predict text well. Everything impressive (answers, code, translation) emerges from doing that simple task over and over.' },
  { q: 'What is the difference between training and inference?', a: 'Training is where the model reads examples, makes predictions and adjusts its weights after every mistake — slow and expensive. Inference is using the finished model to predict on new input — fast, and the weights no longer change. Your chat prompt runs inference.' },
  { q: 'What does the "temperature" setting actually do?', a: 'It scales the probability spread before a word is sampled. Low temperature sharpens the distribution (the model always picks the most likely word); high temperature flattens it (rare words become possible). Temperature controls creativity vs consistency — it does not add knowledge.' },
  { q: 'How can a next-word predictor write code or answer questions?', a: 'The training data contains questions with answers, code with comments, and explanations — so those patterns are learned like any other. The model generates a plausible continuation of the pattern it sees. It is pattern completion, not lookup, which is why it can sound insightful and also confidently wrong.' },
]

const FAQS = [
  { q: 'How does AI actually work (in plain English)?', a: 'An AI model is trained on huge numbers of examples. From them it learns statistical patterns — most powerfully, what word tends to come next. To produce an answer it guesses word after word, each guess shaped by everything it saw during training. Training adjusts internal numbers to reduce mistakes; using the model is just running those numbers on new input.' },
  { q: 'What is the difference between AI, machine learning and deep learning?', a: 'AI is the whole field of making machines do tasks that look smart. Machine learning is the approach where behaviour comes from learning patterns in data instead of hand-written rules. Deep learning is machine learning with neural networks having many layers — it powers image recognition, speech and LLMs.' },
  { q: 'Do AI models understand what they say?', a: 'Models learn such strong patterns that their outputs are usually useful and coherent — but they are not thinking beings. They produce statistically likely text, not checked truth. That is why they can be confidently wrong: a plausible next word is not the same as a verified fact.' },
  { q: 'Why do AI models make mistakes (hallucinate)?', a: 'Because generation is prediction, not search. When the training data was thin for a topic, the model fills gaps with whatever pattern looks right — which reads as a confident, invented fact. Fix habits: ask for sources, check important numbers, and treat first drafts as drafts.' },
]

const PY_CODE = `from collections import Counter

def train(sentences):
    """Build bigram + unigram counts from example sentences."""
    bigrams, unigrams = {}, Counter()
    for s in sentences:
        words = s.lower().split()
        unigrams.update(words)
        for a, b in zip(words, words[1:]):
            bigrams.setdefault(a, Counter())[b] += 1
    return bigrams, unigrams

def predict_next(text, bigrams, unigrams, temperature=1.0):
    """Top-4 next-word candidates, temperature-scaled."""
    last = text.lower().split()[-1]
    counts = bigrams.get(last) or unigrams
    total = sum(counts.values()) or 1
    # temperature < 1 sharpens, > 1 flattens the distribution
    powered = {w: (c / total) ** (1 / temperature) for w, c in counts.items()}
    s = sum(powered.values()) or 1
    ranked = sorted(powered.items(), key=lambda x: -x[1])[:4]
    return [(w, round(p / s * 100, 1)) for w, p in ranked]

corpus = [
    "the cat sat on the mat",
    "the dog ran to the park",
    "the quick brown fox jumps",
]
bigrams, unigrams = train(corpus)
print(predict_next("the", bigrams, unigrams, temperature=0.5))
# -> [('cat', 40.0), ('dog', 40.0), ('quick', 20.0)]`

const JS_CODE = `function train(sentences) {
  // Build bigram + unigram counts from example sentences.
  const bigrams = {}, unigrams = {};
  for (const s of sentences) {
    const words = s.toLowerCase().split(/\\s+/);
    for (const w of words) unigrams[w] = (unigrams[w] || 0) + 1;
    for (let i = 1; i < words.length; i++) {
      const a = words[i - 1], b = words[i];
      bigrams[a] = bigrams[a] || {};
      bigrams[a][b] = (bigrams[a][b] || 0) + 1;
    }
  }
  return { bigrams, unigrams };
}

function predictNext(text, model, temperature = 1) {
  const words = text.toLowerCase().split(/\\s+/).filter(Boolean);
  const last = words[words.length - 1] || '';
  const counts = model.bigrams[last] || model.unigrams;
  const entries = Object.entries(counts);
  const total = entries.reduce((s, [, c]) => s + c, 0) || 1;
  // temperature < 1 sharpens, > 1 flattens the distribution
  const powered = entries.map(([w, c]) => [w, (c / total) ** (1 / temperature)]);
  const sum = powered.reduce((s, [, p]) => s + p, 0) || 1;
  return powered
    .map(([w, p]) => [w, Math.round((p / sum) * 1000) / 10])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
}

const corpus = ['the cat sat on the mat', 'the dog ran to the park', 'the quick brown fox jumps'];
const model = train(corpus);
console.log(predictNext('the', model, 0.5));
// -> [['cat', 40], ['dog', 40], ['quick', 20]]`

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

export default function HowAIWorksPage() {
  const [input, setInput] = useState(PRESETS[1])
  const [stepIdx, setStepIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [tempIdx, setTempIdx] = useState(1)
  const [bars, setBars] = useState([0, 0, 0, 0])
  const barsRef = useRef([0, 0, 0, 0])
  const timer = useRef(null)

  const words = useMemo(
    () => input.split(/\s+/).map(clean).filter(Boolean).slice(0, 20),
    [input]
  )
  const stepCount = Math.max(words.length - 1, 1)
  const safeStep = Math.min(Math.max(stepIdx, 0), stepCount - 1)
  const context = useMemo(() => words.slice(0, safeStep + 1), [words, safeStep])
  const temperature = TEMPS[Math.min(Math.max(tempIdx, 0), TEMPS.length - 1)].v
  const cands = useMemo(() => predict(context, temperature), [context, temperature])
  const actual = safeStep + 1 < words.length ? words[safeStep + 1] : null
  const picked = cands[0] ? cands[0].word : null
  const isMatch = actual !== null && picked === actual
  const contextKey = cands.map(c => `${c.word}:${c.pct.toFixed(1)}`).join('|')

  // Animate probability bars toward the current targets (index-safe).
  useEffect(() => {
    const target = cands.map(c => c.pct)
    const from = [...barsRef.current]
    const t0 = performance.now()
    let raf = 0
    const tick = (now) => {
      const k = Math.min(1, (now - t0) / 550)
      const e = 1 - Math.pow(1 - k, 3)
      const next = target.map((tv, i) => (from[i] !== undefined ? from[i] + (tv - from[i]) * e : tv))
      barsRef.current = next
      setBars(next)
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextKey])

  useEffect(() => {
    if (!playing) return
    if (safeStep >= stepCount - 1) { setPlaying(false); return }
    timer.current = setTimeout(() => setStepIdx(i => i + 1), 1050)
    return () => clearTimeout(timer.current)
  }, [playing, safeStep, stepCount])

  const applyInput = (text) => {
    const ws = (text ?? input).split(/\s+/).map(clean).filter(Boolean)
    if (ws.length === 0) return
    setInput((text ?? input).trim().slice(0, 160))
    setStepIdx(0)
    setPlaying(false)
  }

  const loadPreset = (p) => {
    setInput(p)
    setStepIdx(0)
    setPlaying(false)
  }

  const shownContext = words.slice(0, safeStep + 1)
  const enoughWords = words.length >= 2

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
    name: 'How AI actually works, step by step',
    step: [
      { '@type': 'HowToStep', text: 'Collect examples: the model reads huge amounts of text.' },
      { '@type': 'HowToStep', text: 'Notice patterns: what words usually follow other words.' },
      { '@type': 'HowToStep', text: 'Train: guess, compare with the real word, adjust the weights, repeat.' },
      { '@type': 'HowToStep', text: 'Predict: on new input, the model guesses the next word over and over.' },
      { '@type': 'HowToStep', text: 'Learn from mistakes: every error nudges the weights — errors are the teacher.' },
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
        <meta property="og:image" content="https://www.uptools.in/assets/learning/ai/ai-lesson1-hero.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${TITLE} | UpTools`} />
        <meta name="twitter:description" content={DESC} />
        <meta name="twitter:image" content="https://www.uptools.in/assets/learning/ai/ai-lesson1-hero.jpg" />
        <meta name="keywords" content="how AI works, how does AI work explained, AI for beginners, next word prediction explained, how do LLMs work, AI training vs inference, machine learning plain english" />
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
            { '@type': 'ListItem', position: 4, name: 'How AI Actually Works', item: URL },
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
        <span className="text-slate-300 font-medium">How AI Works</span>
      </nav>

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 border border-green-500/30 text-green-300 mb-4">
        <span>📊</span> AI · Lesson 1 · Beginner
      </div>
      <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight m-0 mb-3">
        How AI actually works — in plain English
      </h1>
      <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-3xl">
        No maths degree, no jargon. AI is a pattern machine: it reads examples, learns
        what usually comes next, then guesses word after word. Press play below and
        watch it predict.
      </p>

      <figure className="m-0 mb-6 rounded-2xl border border-white/[0.06] overflow-hidden">
        <img src="/assets/learning/ai/ai-lesson1-hero.jpg"
          alt="Friendly robot predicting the future on a holographic tablet — How AI works"
          width="1600" height="893" loading="eager" className="w-full h-auto block" />
      </figure>

      {/* ANIMATOR */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6" aria-label="Next word predictor animation">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <h2 className="text-base font-bold text-white m-0">▶ Live animation: next-word predictor</h2>
          <span className="text-xs text-slate-400">Step {Math.min(safeStep + 1, stepCount)} / {stepCount}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {PRESETS.map(p => (
            <button key={p} onClick={() => loadPreset(p)}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border cursor-pointer text-left ${input === p ? 'text-white border-green-500 bg-green-500/20' : 'text-slate-400 border-white/10 bg-transparent hover:bg-white/5'}`}>
              {p.length > 34 ? p.slice(0, 32) + '…' : p}
            </button>
          ))}
        </div>

        <div className="flex items-end justify-center gap-2 sm:gap-4 h-44 sm:h-52 mb-3" role="img"
          aria-label={`Next word predictor, step ${safeStep + 1} of ${stepCount}`}>
          {cands.map((c, idx) => (
            <div key={`${c.word}-${idx}`} className="flex-1 max-w-24 flex flex-col items-center gap-1.5 min-w-0">
              <span className={`text-[11px] sm:text-xs font-bold truncate max-w-full ${idx === 0 ? 'text-white' : 'text-slate-300'}`}>{c.word}</span>
              <div className="w-full rounded-t-lg transition-[height] duration-500 ease-out"
                style={{
                  height: `${Math.max(4, (Math.min(bars[idx] || 0, 100) / 100) * 120)}px`,
                  background: idx === 0
                    ? 'linear-gradient(180deg,#22c55e,#15803d)'
                    : 'linear-gradient(180deg,#6366f1,#4338ca)',
                }} />
              <span className="text-[9px] sm:text-[10px] text-slate-500 font-mono">{(bars[idx] || 0).toFixed(0)}%</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400 mb-3">
          <span><span className="inline-block w-2.5 h-2.5 rounded-sm align-middle mr-1" style={{ background: '#22c55e' }} /> model's top pick</span>
          <span><span className="inline-block w-2.5 h-2.5 rounded-sm align-middle mr-1" style={{ background: '#6366f1' }} /> other candidates</span>
          <span className="text-slate-500">bars = probability of each next word</span>
        </div>

        <p className="text-sm text-slate-200 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 leading-relaxed min-h-12 m-0 mb-4">
          {enoughWords ? (
            <>
              After <span className="text-slate-400">“{shownContext.join(' ')}”</span> the model picks{' '}
              <strong className={isMatch ? 'text-green-300' : 'text-amber-300'}>“{picked}”</strong>{' '}
              ({cands[0] ? cands[0].pct.toFixed(0) : 0}% chance){' '}
              {isMatch
                ? <span className="text-green-300">— and the real text says the same. ✓</span>
                : actual
                  ? <span className="text-amber-300">— but the real text says “{actual}”. ✗</span>
                  : <span className="text-slate-400">(end of sentence — keep playing for the full sequence)</span>}
            </>
          ) : (
            <>Type at least two words below, or pick a preset sentence — the model needs some context before it can predict.</>
          )}
        </p>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <button onClick={() => { setStepIdx(0); setPlaying(false) }}
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white cursor-pointer hover:bg-white/10">⏮ Reset</button>
          <button onClick={() => setStepIdx(i => Math.max(0, i - 1))}
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white cursor-pointer hover:bg-white/10">← Back</button>
          <button onClick={() => { if (safeStep >= stepCount - 1) setStepIdx(0); setPlaying(p => !p) }}
            className="text-xs font-bold px-5 py-2 rounded-xl text-white border-0 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #22c55e, #15803d)' }}>
            {playing ? '⏸ Pause' : '▶ Play'}
          </button>
          <button onClick={() => setStepIdx(i => Math.min(stepCount - 1, i + 1))}
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white cursor-pointer hover:bg-white/10">Next →</button>
          <div className="flex items-center gap-1.5 ml-auto">
            {TEMPS.map((t, i) => (
              <button key={t.l} onClick={() => { setTempIdx(i); setPlaying(false) }}
                title={t.hint}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg border cursor-pointer ${tempIdx === i ? 'text-white border-green-500 bg-green-500/20' : 'text-slate-400 border-white/10 bg-transparent'}`}>
                {t.l}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-[1fr_auto] gap-2">
          <label className="flex items-center gap-2 text-xs text-slate-400">
            <span className="shrink-0 font-semibold">Sentence</span>
            <input value={input} onChange={e => setInput(e.target.value)} onBlur={e => applyInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') applyInput(e.target.value) }}
              className="flex-1 min-w-0 text-xs px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white"
              placeholder="Type a sentence…" />
          </label>
          <button onClick={() => applyInput()}
            className="text-xs font-bold px-4 py-2 rounded-xl text-white border-0 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            Predict next word
          </button>
        </div>
        <p className="text-[11px] text-slate-500 mt-2 m-0">
          Temperature {TEMPS[Math.min(Math.max(tempIdx, 0), TEMPS.length - 1)].l}: {TEMPS[Math.min(Math.max(tempIdx, 0), TEMPS.length - 1)].hint}. The tiny model here is trained on the preset sentences — a real LLM does the same thing on billions.
        </p>
        <figure className="m-0 mt-4 rounded-xl border border-white/10 overflow-hidden">
          <img src="/assets/learning/ai/ai-lesson1-next-word.jpg"
            alt="Coda the dog at a typewriter — an AI predicts the next word: eating → breakfast → chai"
            width="1600" height="893" loading="lazy" className="w-full h-auto block" />
        </figure>
      </section>

      {/* EXPLANATION */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-white mt-0 mb-3">How it works (5 steps)</h2>
        <ol className="text-sm text-slate-300 leading-relaxed space-y-2.5 list-decimal pl-5 m-0">
          <li><strong className="text-white">Examples.</strong> The model starts by reading enormous amounts of text — books, websites, articles. No rules are written by hand; the data is the teacher.</li>
          <li><strong className="text-white">Patterns.</strong> From those examples it notices what usually comes next: "the cat" not "the purple", "2 + 2 = 4" not "2 + 2 = 9". Patterns are stored as millions of numbers (weights).</li>
          <li><strong className="text-white">Training.</strong> It makes a guess, checks against the real next word, and nudges its numbers to be closer next time — billions of times. That loop is all "training" means.</li>
          <li><strong className="text-white">Prediction.</strong> On new input the trained model guesses the next word, then the next, then the next… one word at a time, repeating the same step thousands of times to produce an answer.</li>
          <li><strong className="text-white">Mistakes.</strong> Every wrong guess still teaches — errors are the signal that drives the numbers. After training, mistakes mainly happen where the examples were thin or the pattern is genuinely ambiguous.</li>
        </ol>
        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
          {[['Training', 'Reads examples', 'Billions of words — guess, compare, adjust, repeat'], ['Prediction', 'One word at a time', 'Repeated thousands of times to write an answer'], ['Memory', 'Billions of numbers', 'All learned patterns stored as weights']].map(([a, b, c]) => (
            <div key={a} className="rounded-xl bg-black/30 border border-white/10 px-2 py-3">
              <div className="text-[11px] text-slate-400 font-semibold">{a}</div>
              <div className="text-base sm:text-lg font-extrabold text-white">{b}</div>
              <div className="text-[10px] text-slate-500 leading-snug">{c}</div>
            </div>
          ))}
        </div>
        <figure className="m-0 mt-4 rounded-xl border border-white/10 overflow-hidden">
          <img src="/assets/learning/ai/ai-lesson1-training.jpg"
            alt="AI training model diagram: sentence examples flow into a neural network that becomes a trained language model"
            width="1600" height="893" loading="lazy" className="w-full h-auto block" />
        </figure>
      </section>

      {/* CODE */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-white mt-0 mb-3">Code (copy-paste ready)</h2>
        <p className="text-xs text-slate-400 mt-0 mb-4">A complete next-word predictor — train it on your own sentences and watch the probabilities move with temperature.</p>
        <div className="space-y-3">
          <CodeBlock lang="Python" code={PY_CODE} />
          <CodeBlock lang="JavaScript" code={JS_CODE} />
        </div>
      </section>

      {/* QUESTIONS */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-white mt-0 mb-1">Practice questions</h2>
        <p className="text-xs text-slate-400 mt-0 mb-4">The questions interviewers actually ask about AI basics. Tap to reveal the approach.</p>
        <div className="space-y-2.5">
          {QUESTIONS.map((it, i) => (
            <details key={i} className="rounded-xl bg-black/30 border border-white/10 px-4 py-1 group">
              <summary className="cursor-pointer text-sm font-semibold text-white py-2.5 list-none flex items-center gap-2">
                <span className="text-green-300 text-xs font-bold shrink-0">Q{i + 1}</span>
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
          <li><strong className="text-white">Open with the one-line model:</strong> "An LLM is a next-word predictor trained on a huge text corpus — everything else is that step repeated." Interviewers listen for exactly this.</li>
          <li><strong className="text-white">Separate the two phases:</strong> "Training adjusts weights from mistakes; inference runs the finished weights on new input." Confuses fewer candidates than mixing them up.</li>
          <li><strong className="text-white">Explain temperature like a knob:</strong> "Low temperature sharpens the distribution — the model always takes the safest word; high temperature flattens it — rare words become possible." One sentence covers creativity vs consistency.</li>
          <li><strong className="text-white">Name the failure mode preemptively:</strong> "It predicts plausible text, not verified truth — which is why hallucinations happen." Kills the hardest follow-up before it is asked.</li>
          <li><strong className="text-white">Ground it in the animation:</strong> "Prediction is just that — pick the most probable next word, append it, repeat." Referencing a live demo makes the answer stick.</li>
        </ul>
      </section>

      <FAQ questions={FAQS} />

      <div className="flex items-center justify-between flex-wrap gap-3 mt-6">
        <Link to="/learning/ai" className="text-sm font-semibold text-green-300 no-underline">← All AI lessons</Link>
        <span className="text-xs text-slate-500">Next up: Prompting that gets results (coming soon)</span>
      </div>
    </>
  )
}
