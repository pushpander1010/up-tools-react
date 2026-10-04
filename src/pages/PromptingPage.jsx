import { useState, useMemo, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import FAQ from '../components/FAQ'

const TITLE = 'Prompting That Gets Results: Write AI Prompts That Work'
const DESC = 'Learn prompting that gets results with a live prompt improver — toggle context, examples and check rules and watch output quality bars climb. Includes a 5-step method, Python & JavaScript prompt-builder code, 5 practice questions, 4 FAQs and interview tips.'
const URL = 'https://www.uptools.in/learning/ai/prompting-that-gets-results/'

const DIMS = [
  { key: 'clarity', label: 'Clarity' },
  { key: 'specificity', label: 'Specificity' },
  { key: 'accuracy', label: 'Accuracy' },
  { key: 'completeness', label: 'Completeness' },
]
const TOGGLE_KEYS = ['context', 'examples', 'check']
const TOGGLE_META = {
  context: { icon: '🎯', label: 'Context', hint: 'Who you are, who the AI is, what situation this is' },
  examples: { icon: '📎', label: 'Examples', hint: 'Show the shape of the answer you want' },
  check: { icon: '✅', label: 'Check', hint: 'Rules the AI must verify before answering' },
}
const clamp = (n) => Math.max(3, Math.min(97, Math.round(n)))

const IMPROVER = [
  {
    id: 'email',
    label: 'Work email',
    vague: 'Write an email to my boss',
    base: { clarity: 18, specificity: 12, accuracy: 22, completeness: 10 },
    context: {
      text: 'You are my writing assistant. I am a frontend engineer asking my manager Priya about the Q3 report deadline. Tone: polite, direct, under 120 words.',
      adds: { clarity: 34, specificity: 40, accuracy: 20, completeness: 30 },
    },
    examples: {
      text: 'Example of the tone I want:\n“Hi Priya — quick question on the Q3 report: is Thursday still the deadline? I want to line up the design review before then.”',
      adds: { clarity: 15, specificity: 18, accuracy: 12, completeness: 24 },
    },
    check: {
      text: 'Before sending: state the deadline question in the first two lines, keep it under 120 words, and end with exactly one clear question.',
      adds: { clarity: 10, specificity: 12, accuracy: 26, completeness: 16 },
    },
  },
  {
    id: 'code',
    label: 'Python function',
    vague: 'Write a Python function',
    base: { clarity: 15, specificity: 8, accuracy: 20, completeness: 8 },
    context: {
      text: 'You are a senior Python engineer. Write a function that parses a CSV of invoices (columns: id, date, amount, currency) and returns the total per currency, skipping malformed rows.',
      adds: { clarity: 36, specificity: 44, accuracy: 22, completeness: 32 },
    },
    examples: {
      text: 'Example call and output:\nparse_totals("invoices.csv") -> {"USD": 1240.50, "EUR": 890.00}\nBad rows like ["", "2024-13-40", "abc", "USD"] are skipped, not crashed on.',
      adds: { clarity: 14, specificity: 20, accuracy: 16, completeness: 22 },
    },
    check: {
      text: 'Before answering: use type hints, handle the bad-row case explicitly, and include one usage example in the reply.',
      adds: { clarity: 10, specificity: 14, accuracy: 24, completeness: 18 },
    },
  },
  {
    id: 'study',
    label: 'Study plan',
    vague: 'Make me a study plan for DSA',
    base: { clarity: 20, specificity: 10, accuracy: 18, completeness: 12 },
    context: {
      text: 'You are a DSA mentor. I have an interview in 6 weeks, 1.5 hours per day, strong on arrays but weak on graphs and dynamic programming.',
      adds: { clarity: 32, specificity: 42, accuracy: 20, completeness: 34 },
    },
    examples: {
      text: 'Format example for one week:\nWeek 2 — Graphs: BFS (2 days), DFS (2 days), topological sort (1 day), 3 mixed problems (2 days). Daily: 1 easy revision + 1 timed problem.',
      adds: { clarity: 16, specificity: 16, accuracy: 12, completeness: 26 },
    },
    check: {
      text: 'Before answering: every week must have named topics, a problem count, and revision time. Flag any week that is unrealistic at 1.5 h/day.',
      adds: { clarity: 10, specificity: 12, accuracy: 22, completeness: 18 },
    },
  },
  {
    id: 'caption',
    label: 'Instagram caption',
    vague: 'Write a caption for my reel',
    base: { clarity: 16, specificity: 9, accuracy: 16, completeness: 10 },
    context: {
      text: 'You are a social media writer. The reel shows a 30-second demo of a free resume-scoring tool. Audience: Indian college students preparing for placements.',
      adds: { clarity: 34, specificity: 38, accuracy: 18, completeness: 30 },
    },
    examples: {
      text: 'Example hook I like:\n“Your resume gets 7 seconds. Here’s what a recruiter sees in the first 3.”\nKeep lines short — one idea per line, max 8 lines.',
      adds: { clarity: 16, specificity: 18, accuracy: 12, completeness: 20 },
    },
    check: {
      text: 'Before answering: first line must work as a hook on its own, include 3 niche hashtags, and no emoji spam (max 2).',
      adds: { clarity: 10, specificity: 12, accuracy: 20, completeness: 16 },
    },
  },
]

const STEP_SEQ = [
  { on: [], label: 'Vague prompt' },
  { on: ['context'], label: '+ Context' },
  { on: ['context', 'examples'], label: '+ Examples' },
  { on: ['context', 'examples', 'check'], label: '+ Check rules' },
]

function qualityFor(preset, onSet) {
  const out = { ...preset.base }
  for (const k of onSet) {
    const f = preset[k]
    if (!f) continue
    for (const d of DIMS) out[d.key] += f.adds[d.key]
  }
  const res = {}
  for (const d of DIMS) res[d.key] = clamp(out[d.key])
  return res
}
function overall(q) {
  return Math.round(DIMS.reduce((s, d) => s + q[d.key], 0) / DIMS.length)
}

const QUESTIONS = [
  { q: 'What actually makes a prompt “good”?', a: 'A good prompt removes the model’s guesswork: it names the role, the situation (context), the exact task, the shape of the answer (examples or format), and any rules to check against. The model is not lazy — it fills every gap with the most statistically likely default. Your job in prompting is to close those gaps so the default becomes your intent.' },
  { q: 'What is the difference between a system prompt and a user prompt?', a: 'The system prompt sets standing rules for the whole conversation — role, tone, constraints, what to refuse. The user prompt is the specific request for one turn. System instructions outrank user instructions in practice, so put durable rules (persona, output format, safety limits) there, and put the task-specific detail in the user message.' },
  { q: 'Why do examples (few-shot prompting) help so much?', a: 'Examples encode format, tone, length and level of detail faster than any description can. One good example teaches “what good looks like” more reliably than three paragraphs of instruction — the model pattern-matches to your example instead of guessing. Two or three varied examples usually beat one long one.' },
  { q: 'How long should a prompt be?', a: 'As long as it needs to be and not one word longer. Every sentence should reduce ambiguity — if a line does not change the likely answer, cut it. A tight 60-word prompt with role, context, task and check beats a rambling 400-word one, because irrelevant detail actively steers the model toward the wrong pattern.' },
  { q: 'What is chain-of-thought prompting and when should I use it?', a: 'It asks the model to reason step by step before giving the final answer (“think through this before answering”). Use it for multi-step problems — maths, logic, debugging, planning — where the final answer depends on intermediate steps. Skip it for simple lookups or rewrites; it adds tokens without adding accuracy there.' },
]

const FAQS = [
  { q: 'What is prompting and why does it matter?', a: 'Prompting is how you communicate the task to an AI model in plain language. It matters because the model has no idea who you are or what “good” means for your task — it only sees your words. A vague prompt gets the most generic answer possible; a prompt with role, context, examples and check rules gets an answer you can actually use. The same model, same question, different prompt — completely different quality.' },
  { q: 'What are the parts of a good prompt?', a: 'Four parts cover most jobs: role (“You are a senior Python engineer”), context (the situation, audience and constraints), the task stated concretely (what to produce, for whom), and checks or examples (the rules the answer must satisfy, or a sample of the shape you want). Add format instructions when the output must fit somewhere — a table, a caption under 80 words, JSON.' },
  { q: 'How do I get AI to stop giving generic answers?', a: 'Generic answers come from generic prompts. Add the missing detail the model is guessing: who the answer is for, what you already know, what you will do with it, and one example of the style you want. Then add a check line (“no filler phrases”, “lead with the strongest point”) — models follow explicit negative constraints far better than vague wishes like “make it good”.' },
  { q: 'Does prompt engineering still matter with better models?', a: 'Yes, but its shape changes. Better models guess your intent better from less, so you no longer need ritual phrases or fake “magic words”. What still matters is clarity: naming the real task, the real audience and the real constraints. Prompting is less about tricking the model and more about not hiding the point from it.' },
]

const PY_CODE = `from dataclasses import dataclass, field

@dataclass
class Prompt:
    role: str = ""
    context: str = ""
    task: str = ""
    examples: list = field(default_factory=list)
    checks: list = field(default_factory=list)
    output_format: str = ""

    def build(self) -> str:
        """Assemble a structured prompt from its parts."""
        parts = []
        if self.role:
            parts.append(f"You are {self.role}.")
        if self.context:
            parts.append(f"Context: {self.context}")
        parts.append(self.task)
        if self.examples:
            ex = "\\n".join(f"- {e}" for e in self.examples)
            parts.append(f"Examples of what I want:\\n{ex}")
        if self.checks:
            ck = "\\n".join(f"- {c}" for c in self.checks)
            parts.append(f"Check your answer against:\\n{ck}")
        if self.output_format:
            parts.append(f"Output format: {self.output_format}")
        return "\\n\\n".join(parts)

p = Prompt(
    role="senior Python engineer",
    context="Parsing a CSV of invoices: id, date, amount, currency",
    task="Write parse_totals(path) returning total per currency, skipping malformed rows.",
    examples=['parse_totals("in.csv") -> {"USD": 1240.50}'],
    checks=["use type hints", "handle bad rows explicitly", "include one usage example"],
)
print(p.build())`

const JS_CODE = `class Prompt {
  constructor({ role = "", context = "", task = "", examples = [], checks = [], outputFormat = "" } = {}) {
    this.role = role; this.context = context; this.task = task;
    this.examples = examples; this.checks = checks; this.outputFormat = outputFormat;
  }

  build() {
    // Assemble a structured prompt from its parts.
    const parts = [];
    if (this.role) parts.push(\`You are \${this.role}.\`);
    if (this.context) parts.push(\`Context: \${this.context}\`);
    parts.push(this.task);
    if (this.examples.length)
      parts.push("Examples of what I want:\\n" + this.examples.map(e => \`- \${e}\`).join("\\n"));
    if (this.checks.length)
      parts.push("Check your answer against:\\n" + this.checks.map(c => \`- \${c}\`).join("\\n"));
    if (this.outputFormat) parts.push(\`Output format: \${this.outputFormat}\`);
    return parts.join("\\n\\n");
  }
}

const p = new Prompt({
  role: "senior Python engineer",
  context: "Parsing a CSV of invoices: id, date, amount, currency",
  task: "Write parse_totals(path) returning total per currency, skipping malformed rows.",
  examples: ['parse_totals("in.csv") -> {"USD": 1240.50}'],
  checks: ["use type hints", "handle bad rows explicitly", "include one usage example"],
});
console.log(p.build());`

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

export default function PromptingPage() {
  const [presetIdx, setPresetIdx] = useState(0)
  const [on, setOn] = useState([])
  const [playing, setPlaying] = useState(false)
  const [step, setStep] = useState(0)
  const [bars, setBars] = useState({ clarity: 0, specificity: 0, accuracy: 0, completeness: 0 })
  const [beforeBars, setBeforeBars] = useState({ clarity: 0, specificity: 0, accuracy: 0, completeness: 0 })
  const barsRef = useRef(bars)
  const beforeRef = useRef(beforeBars)
  const timer = useRef(null)

  const preset = IMPROVER[Math.min(Math.max(presetIdx, 0), IMPROVER.length - 1)]
  const target = useMemo(() => qualityFor(preset, on), [preset, on])
  const beforeTarget = useMemo(() => qualityFor(preset, []), [preset])
  const score = overall(target)
  const beforeScore = overall(beforeTarget)
  const onSet = useMemo(() => new Set(on), [on])
  const targetKey = DIMS.map(d => `${d.key}:${target[d.key]}`).join('|')
  const beforeKey = DIMS.map(d => `${d.key}:${beforeTarget[d.key]}`).join('|')

  // Animate both bar groups toward their targets.
  useEffect(() => {
    const from = { ...barsRef.current }
    const t0 = performance.now()
    let raf = 0
    const tick = (now) => {
      const k = Math.min(1, (now - t0) / 600)
      const e = 1 - Math.pow(1 - k, 3)
      const next = {}
      for (const d of DIMS) next[d.key] = (from[d.key] || 0) + (target[d.key] - (from[d.key] || 0)) * e
      barsRef.current = next
      setBars(next)
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetKey])

  useEffect(() => {
    const from = { ...beforeRef.current }
    const t0 = performance.now()
    let raf = 0
    const tick = (now) => {
      const k = Math.min(1, (now - t0) / 600)
      const e = 1 - Math.pow(1 - k, 3)
      const next = {}
      for (const d of DIMS) next[d.key] = (from[d.key] || 0) + (beforeTarget[d.key] - (from[d.key] || 0)) * e
      beforeRef.current = next
      setBeforeBars(next)
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beforeKey])

  // Auto-play: step through vague -> +context -> +examples -> +check, then loop.
  useEffect(() => {
    if (!playing) return
    if (step >= STEP_SEQ.length - 1) {
      timer.current = setTimeout(() => { setStep(0); setOn([]) }, 1800)
      return () => clearTimeout(timer.current)
    }
    timer.current = setTimeout(() => {
      setStep(s => s + 1)
      setOn(STEP_SEQ[Math.min(step + 1, STEP_SEQ.length - 1)].on)
    }, 1400)
    return () => clearTimeout(timer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, step])

  const toggle = (key) => {
    setPlaying(false)
    setOn(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  }
  const loadPreset = (i) => {
    setPresetIdx(i)
    setOn([])
    setPlaying(false)
    setStep(0)
  }
  const startPlay = () => {
    if (playing) { setPlaying(false); return }
    setStep(0)
    setOn([])
    setPlaying(true)
  }

  const fragOrder = ['context', 'examples', 'check']
  const shownFrags = fragOrder.filter(k => onSet.has(k))

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
    name: 'How to write a prompt that gets results, step by step',
    step: [
      { '@type': 'HowToStep', text: 'Name the role: tell the AI who it is (“You are a senior Python engineer”).' },
      { '@type': 'HowToStep', text: 'Give context: the situation, audience and constraints the model cannot guess.' },
      { '@type': 'HowToStep', text: 'State the task concretely: what to produce, for whom, and how much.' },
      { '@type': 'HowToStep', text: 'Add examples or a format: show the shape of the answer you want.' },
      { '@type': 'HowToStep', text: 'Add check rules: the conditions the answer must satisfy before it is done.' },
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
        <meta property="og:image" content="https://www.uptools.in/assets/learning/ai/ai-lesson2-hero.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${TITLE} | UpTools`} />
        <meta name="twitter:description" content={DESC} />
        <meta name="twitter:image" content="https://www.uptools.in/assets/learning/ai/ai-lesson2-hero.jpg" />
        <meta name="keywords" content="prompt engineering, how to prompt AI, prompt engineering examples, few shot prompting, system prompt vs user prompt, get better AI answers, AI prompting guide, chain of thought prompting" />
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
            { '@type': 'ListItem', position: 4, name: 'Prompting That Gets Results', item: URL },
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
        <span className="text-slate-300 font-medium">Prompting</span>
      </nav>

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 border border-green-500/30 text-green-300 mb-4">
        <span>🎯</span> AI · Lesson 2 · Beginner
      </div>
      <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight m-0 mb-3">
        Prompting that gets results — the 4-part formula
      </h1>
      <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-3xl">
        The model is not stubborn — it is guessing. Every vague prompt leaves a gap, and the
        model fills it with the most generic answer it knows. Below, toggle context, examples
        and check rules and watch the output quality climb in real time.
      </p>

      <figure className="m-0 mb-6 rounded-2xl border border-white/[0.06] overflow-hidden">
        <img src="/assets/learning/ai/ai-lesson2-hero.jpg"
          alt="Friendly robot comparing a vague prompt with a structured prompt on a holographic screen"
          width="1600" height="893" loading="eager" className="w-full h-auto block" />
      </figure>

      {/* LIVE IMPROVER */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6" aria-label="Live prompt improver animation">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <h2 className="text-base font-bold text-white m-0">▶ Live demo: the prompt improver</h2>
          <span className="text-xs text-slate-400">Step {step + 1} / {STEP_SEQ.length} · {STEP_SEQ[step].label}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {IMPROVER.map((p, i) => (
            <button key={p.id} onClick={() => loadPreset(i)}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border cursor-pointer text-left ${presetIdx === i ? 'text-white border-green-500 bg-green-500/20' : 'text-slate-400 border-white/10 bg-transparent hover:bg-white/5'}`}>
              {p.label}
            </button>
          ))}
        </div>

        {/* TOGGLE CHIPS */}
        <div className="flex flex-wrap gap-2 mb-4">
          {TOGGLE_KEYS.map(k => {
            const m = TOGGLE_META[k]
            const active = onSet.has(k)
            return (
              <button key={k} onClick={() => toggle(k)} title={m.hint}
                className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl border cursor-pointer transition-all duration-300 ${active ? 'text-white border-green-500/60 shadow-lg shadow-green-500/10' : 'text-slate-400 border-white/10 bg-transparent hover:bg-white/5'}`}
                style={active ? { background: 'linear-gradient(135deg, rgba(34,197,94,0.22), rgba(21,128,61,0.18))' } : undefined}>
                <span className={`text-sm transition-transform duration-300 ${active ? 'scale-110' : ''}`}>{m.icon}</span>
                {m.label}
                <span className={`w-7 h-4 rounded-full relative transition-colors duration-300 ${active ? 'bg-green-500' : 'bg-white/10'}`}>
                  <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all duration-300 ${active ? 'left-3.5' : 'left-0.5'}`} />
                </span>
              </button>
            )
          })}
          <div className="flex gap-2 ml-auto">
            <button onClick={startPlay}
              className="text-xs font-bold px-5 py-2.5 rounded-xl text-white border-0 cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #22c55e, #15803d)' }}>
              {playing ? '⏸ Pause' : '▶ Auto-play'}
            </button>
            <button onClick={() => { setOn([]); setStep(0); setPlaying(false) }}
              className="text-xs font-semibold px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white cursor-pointer hover:bg-white/10">
              Reset
            </button>
          </div>
        </div>

        {/* BEFORE / AFTER */}
        <div className="grid md:grid-cols-2 gap-3 mb-4">
          {/* BEFORE */}
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/[0.04] p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-300">✗ BEFORE · vague prompt</span>
              <span className="text-xs font-mono text-rose-300">{beforeScore}/100</span>
            </div>
            <p className="text-sm text-slate-300 bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 leading-relaxed flex-1 m-0 font-mono">
              {preset.vague}
            </p>
            <p className="text-[11px] text-slate-500 mt-2 mb-0">Generic reply: the model guesses the role, audience and format — and usually guesses wrong.</p>
            <div className="mt-3 space-y-1.5">
              {DIMS.map(d => (
                <div key={d.key} className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 w-20 shrink-0">{d.label}</span>
                  <div className="flex-1 h-2 rounded-full bg-black/40 overflow-hidden">
                    <div className="h-full rounded-full transition-[width] duration-500 ease-out"
                      style={{ width: `${Math.max(2, beforeBars[d.key] || 0)}%`, background: 'linear-gradient(90deg,#9f1239,#e11d48)' }} />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 w-7 text-right">{(beforeBars[d.key] || 0).toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AFTER */}
          <div className="rounded-xl border border-green-500/25 bg-green-500/[0.04] p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-green-300">✓ AFTER · {on.length} improvement{on.length === 1 ? '' : 's'} applied</span>
              <span className={`text-xs font-mono font-bold ${score > beforeScore + 15 ? 'text-green-300' : 'text-slate-400'}`}>{score}/100</span>
            </div>
            <div className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 leading-relaxed text-sm text-slate-200 space-y-2">
              <p className="m-0 font-mono text-slate-400">{preset.vague}</p>
              {shownFrags.map(k => (
                <p key={k} className="m-0 font-mono text-green-200 border-l-2 border-green-500/50 pl-2.5 animate-[fadeIn_.4s_ease]"
                  style={{ animation: 'none' }}>
                  <span className="text-green-400 font-bold">{TOGGLE_META[k].icon} {TOGGLE_META[k].label}: </span>{preset[k].text}
                </p>
              ))}
              {shownFrags.length === 0 && (
                <p className="m-0 text-[11px] text-slate-500 italic">Toggle a chip above — the prompt builds up here and the bars react instantly.</p>
              )}
            </div>
            <div className="mt-3 space-y-1.5">
              {DIMS.map(d => (
                <div key={d.key} className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 w-20 shrink-0">{d.label}</span>
                  <div className="flex-1 h-2 rounded-full bg-black/40 overflow-hidden">
                    <div className="h-full rounded-full transition-[width] duration-500 ease-out"
                      style={{ width: `${Math.max(2, bars[d.key] || 0)}%`, background: 'linear-gradient(90deg,#15803d,#22c55e)' }} />
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 w-7 text-right">{(bars[d.key] || 0).toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* QUALITY SCORE STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {DIMS.map(d => {
            const delta = Math.round((bars[d.key] || 0) - (beforeBars[d.key] || 0))
            return (
              <div key={d.key} className="rounded-xl bg-black/30 border border-white/10 px-3 py-2.5 text-center">
                <div className="text-[10px] text-slate-400 font-semibold">{d.label}</div>
                <div className="text-lg font-extrabold text-white leading-tight">{(bars[d.key] || 0).toFixed(0)}<span className="text-[10px] text-slate-500 font-mono">/100</span></div>
                <div className={`text-[10px] font-bold ${delta > 0 ? 'text-green-400' : 'text-slate-600'}`}>{delta > 0 ? `▲ +${delta}` : '— base'}</div>
              </div>
            )
          })}
        </div>

        <p className="text-[11px] text-slate-500 m-0 mb-4">
          Bars = how well a typical model can serve that vague prompt vs the improved one on each dimension.
          Context fixes role & audience, examples fix format & tone, check rules fix completeness — all three together is the full formula.
        </p>

        <figure className="m-0 rounded-xl border border-white/10 overflow-hidden">
          <img src="/assets/learning/ai/ai-lesson2-improver.jpg"
            alt="Diagram: a vague prompt transformed through context, examples and check rules into a strong structured prompt"
            width="1600" height="893" loading="lazy" className="w-full h-auto block" />
        </figure>
      </section>

      {/* EXPLANATION */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-white mt-0 mb-3">The 4-part prompt formula</h2>
        <ol className="text-sm text-slate-300 leading-relaxed space-y-2.5 list-decimal pl-5 m-0">
          <li><strong className="text-white">Role.</strong> “You are a senior Python engineer.” This sets the voice, depth and vocabulary the model will default to — one line that does more than three paragraphs of tone description.</li>
          <li><strong className="text-white">Context.</strong> The situation, audience and constraints the model cannot guess: who reads this, what you already know, what the deadline is. This is the single biggest quality lever for any real task.</li>
          <li><strong className="text-white">Task.</strong> State it concretely — what to produce, for whom, how much. “Write a function” is a topic; “write parse_totals(path) that returns total per currency and skips malformed rows” is a task.</li>
          <li><strong className="text-white">Examples &amp; checks.</strong> Examples encode format and tone faster than description (“show me one like this”). Check rules state the conditions the answer must satisfy (“under 120 words, one clear question at the end”). Together they turn a plausible answer into a usable one.</li>
        </ol>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 text-center">
          {[['Role', 'Who the AI is', 'Sets voice & depth in one line'], ['Context', 'The situation', 'Closes the gaps the model guesses'], ['Task', 'What to produce', 'Concrete beats clever every time'], ['Examples + Checks', 'Shape & rules', 'Format right, answer usable']].map(([a, b, c]) => (
            <div key={a} className="rounded-xl bg-black/30 border border-white/10 px-2 py-3">
              <div className="text-[11px] text-slate-400 font-semibold">{a}</div>
              <div className="text-sm sm:text-base font-extrabold text-white">{b}</div>
              <div className="text-[10px] text-slate-500 leading-snug">{c}</div>
            </div>
          ))}
        </div>
        <figure className="m-0 mt-4 rounded-xl border border-white/10 overflow-hidden">
          <img src="/assets/learning/ai/ai-lesson2-structure.jpg"
            alt="Infographic of a structured prompt card with Role, Context, Task, Examples and Output format sections"
            width="1600" height="893" loading="lazy" className="w-full h-auto block" />
        </figure>
      </section>

      {/* CODE */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-white mt-0 mb-3">Code (copy-paste ready)</h2>
        <p className="text-xs text-slate-400 mt-0 mb-4">A Prompt builder that assembles role, context, task, examples and checks into one clean prompt string — reuse it anywhere you call an AI API.</p>
        <div className="space-y-3">
          <CodeBlock lang="Python" code={PY_CODE} />
          <CodeBlock lang="JavaScript" code={JS_CODE} />
        </div>
      </section>

      {/* QUESTIONS */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-white mt-0 mb-1">Practice questions</h2>
        <p className="text-xs text-slate-400 mt-0 mb-4">The questions interviewers actually ask about prompting. Tap to reveal the approach.</p>
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
          <li><strong className="text-white">Open with the 4-part formula:</strong> “A good prompt names the role, the context, the task, and the checks — remove any of the four and the model starts guessing.” Interviewers listen for structure, not slogans.</li>
          <li><strong className="text-white">Explain why vague prompts fail:</strong> “The model fills every gap with the most statistically likely default — prompting is about closing those gaps so the default becomes your intent.” This separates candidates who use AI from candidates who understand it.</li>
          <li><strong className="text-white">Separate system from user prompts:</strong> “System prompts carry standing rules — persona, format, safety limits. User prompts carry the task for this turn.” Kills the hardest follow-up before it is asked.</li>
          <li><strong className="text-white">Champion examples over adjectives:</strong> “One good example beats three paragraphs of ‘make it professional’ — the model pattern-matches to your example instead of guessing what you meant.”</li>
          <li><strong className="text-white">Ground it in the live demo:</strong> “Toggle context, then examples, then checks — watch specificity and completeness jump each time.” Referencing the live improver makes the answer stick.</li>
        </ul>
      </section>

      <FAQ questions={FAQS} />

      <div className="flex items-center justify-between flex-wrap gap-3 mt-6">
        <Link to="/learning/ai/how-ai-works" className="text-sm font-semibold text-green-300 no-underline">← Lesson 1: How AI works</Link>
        <Link to="/learning/ai/context-and-memory" className="text-sm font-semibold text-green-300 no-underline">Next: Lesson 3 — Context &amp; memory →</Link>
      </div>
    </>
  )
}
