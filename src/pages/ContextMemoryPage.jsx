import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import FAQ from '../components/FAQ'

const TITLE = 'Context & Memory: Why AI Forgets and How to Make It Remember'
const DESC = 'Learn why AI forgets mid-conversation with a live sliding-context-window demo — watch tokens fill up, the oldest messages drop out, and toggle memory ON to see key facts survive. Includes a memory toggle simulator, Python & JavaScript chat-memory code, 5 practice questions, 4 FAQs and interview tips.'
const URL = 'https://www.uptools.in/learning/ai/context-and-memory/'
const HERO = '/assets/learning/ai/ai-lesson3-hero.jpg'
const IMG_WINDOW = '/assets/learning/ai/ai-lesson3-window.jpg'
const IMG_MEMORY = '/assets/learning/ai/ai-lesson3-memory.jpg'

const CAPACITY = 40 // token budget of the simulated context window

// Scripted conversation: each turn carries its own token weight.
// 'key' marks a fact the user states once — the memory test.
const CONVO = [
  { id: 1, from: 'user', text: 'Hi! I am preparing for my first job interview.', tokens: 12 },
  { id: 2, from: 'ai', text: 'Great — which role are you targeting?', tokens: 10, key: false },
  { id: 3, from: 'user', text: 'Frontend developer. Please keep answers short.', tokens: 12, key: true, fact: 'Keep answers short' },
  { id: 4, from: 'ai', text: 'Noted. Short answers it is. What company?', tokens: 10 },
  { id: 5, from: 'user', text: 'A fintech startup in Bengaluru.', tokens: 9 },
  { id: 6, from: 'ai', text: 'Fintech interview tips coming up. Ready?', tokens: 9 },
  { id: 7, from: 'user', text: 'What should I say when asked about weaknesses?', tokens: 14 },
  { id: 8, from: 'ai', text: 'Pick a real weakness plus what you are doing about it.', tokens: 13 },
  { id: 9, from: 'user', text: 'Got it. Also, my name is Aarav.', tokens: 9, key: true, fact: 'Name is Aarav' },
  { id: 10, from: 'ai', text: 'Thanks Aarav! Anything else about the interview?', tokens: 11 },
  { id: 11, from: 'user', text: 'How do I answer the salary question?', tokens: 11 },
  { id: 12, from: 'ai', text: 'Anchor to market range, then negotiate on benefits.', tokens: 13 },
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
  { q: 'What is a context window?', a: 'A context window is the maximum amount of text — measured in tokens — that a model can read at once when producing an answer. It includes your prompt, the conversation history, any documents you pasted, and the model’s own earlier replies. Everything the model "knows" for this turn lives inside that window; anything outside it is invisible to the model for this response.' },
  { q: 'Why does AI forget things I said earlier in the chat?', a: 'Because the conversation has slid past the window’s token limit. When a new message arrives and the window is full, the oldest tokens are dropped to make room — exactly like the sliding demo on this page. The model is not ignoring you; those words are literally no longer in its input for that turn. This is also why long chats feel like the AI "lost the plot" halfway through.' },
  { q: 'What is the difference between context and memory?', a: 'Context is what the model reads right now — a sliding window that resets every turn and resets entirely between sessions. Memory is information stored outside that window and deliberately re-injected into the prompt: saved facts, summaries of earlier turns, or retrieval from a database. Memory is a design choice you build; context is a constraint you work within.' },
  { q: 'How do apps make an AI remember me across chats?', a: 'They store facts or summaries outside the conversation and paste them back into the prompt at the start of every new session — a profile block ("user is Aarav, prefers short answers"), rolling summaries of past chats, or retrieval over saved notes. The model itself has no storage between sessions; every "memory" feature is an engineering layer on top of a stateless model.' },
  { q: 'Does a bigger context window solve the forgetting problem?', a: 'It postpones it, it does not remove it. A larger window lets a session hold more history, but tokens still get dropped eventually, and performance on very long contexts can degrade — models can lose track of details buried in the middle of a huge window. Durable recall still needs explicit memory: summaries, saved facts, or retrieval, re-injected each turn.' },
]

const FAQS = [
  { q: 'What is a context window in AI?', a: 'A context window is the total token budget a model can process for one response — think of it as the model’s short-term workspace. It holds your latest message, the earlier conversation, and anything else in the prompt (documents, instructions). Models are usually described by their window size, like 8K or 128K tokens. When the conversation grows past that limit, the oldest tokens are dropped to make room for new ones.' },
  { q: 'Why did the AI forget what I told it earlier?', a: 'Because the conversation outgrew the context window. New tokens push the oldest ones out — the same sliding mechanism the live demo on this page animates. Between sessions the window resets completely, so even a conversation that fit comfortably is gone the next day unless the app saved something outside it. That is why "the AI forgot my name" is almost always a window or storage issue, not the model being rude.' },
  { q: 'How do I make ChatGPT or other assistants remember my preferences?', a: 'Use whatever memory feature the app offers — saved custom instructions, memory settings, or project notes — because those features work by storing your facts outside the conversation and re-injecting them into the prompt each session. Outside an app, the manual version is the same idea: paste a short "about me" block at the start of a new chat. If the app has no memory feature, nothing you say in one chat reliably carries to the next.' },
  { q: 'Is a larger context window always better?', a: 'Not necessarily. Larger windows cost more to run (billed per token), and models can get "lost in the middle" — details buried deep in a very long context are attended to less reliably than details near the start or end. For most tasks a tight, well-organized prompt beats a giant dump of everything you have. Use bigger windows when the task genuinely needs the full document or history, and use explicit memory for facts that must never be forgotten.' },
]

const PY_CODE = `class ChatMemory:
    """Sliding context window + explicit memory that survives the slide."""

    def __init__(self, capacity: int = 40):
        self.capacity = capacity          # token budget of the window
        self.window: list[dict] = []     # sliding history, oldest first
        self.memory: list[str] = []      # saved facts, re-injected every turn
        self.dropped = 0                 # turns evicted by the window

    def _tokens(self, text: str) -> int:
        # crude proxy: ~1 token per word
        return max(1, len(text.split()))

    def say(self, speaker: str, text: str, key_fact: str | None = None):
        turn = {"speaker": speaker, "text": text,
                "tokens": self._tokens(text)}
        self.window.append(turn)
        if key_fact:
            self.memory.append(key_fact)   # remembered OUTSIDE the window

        # slide: evict oldest turns until the window fits again
        while sum(t["tokens"] for t in self.window) > self.capacity:
            self.window.pop(0)
            self.dropped += 1

    def build_prompt(self, question: str) -> str:
        # memory facts ride along at the top, untouched by the slide
        facts = "Facts about the user: " + "; ".join(self.memory) \\
            if self.memory else ""
        history = "\\n".join(
            f"{t['speaker']}: {t['text']}" for t in self.window
        )
        parts = [p for p in (facts, history, f"User: {question}") if p]
        return "\\n\\n".join(parts)


chat = ChatMemory(capacity=40)
chat.say("user", "I am preparing for my first interview.",
         key_fact="Keep answers short")
chat.say("ai", "Great, which role are you targeting?")
chat.say("user", "Frontend developer. Please keep answers short.")
for _ in range(6):  # chat keeps growing…
    chat.say("ai", "Noted, tell me more about the role.")
print(f"dropped turns: {chat.dropped}")
print(chat.build_prompt("How should I answer weaknesses?"))`

const JS_CODE = `class ChatMemory {
  constructor(capacity = 40) {
    this.capacity = capacity;   // token budget of the window
    this.window = [];           // sliding history, oldest first
    this.memory = [];           // saved facts, re-injected every turn
    this.dropped = 0;           // turns evicted by the window
  }

  tokens(text) {
    // crude proxy: ~1 token per word
    return Math.max(1, text.trim().split(/\\s+/).length);
  }

  say(speaker, text, keyFact = null) {
    this.window.push({ speaker, text, tokens: this.tokens(text) });
    if (keyFact) this.memory.push(keyFact);   // remembered OUTSIDE the window

    // slide: evict oldest turns until the window fits again
    while (this.window.reduce((s, t) => s + t.tokens, 0) > this.capacity) {
      this.window.shift();
      this.dropped += 1;
    }
  }

  buildPrompt(question) {
    const facts = this.memory.length
      ? "Facts about the user: " + this.memory.join("; ")
      : "";
    const history = this.window
      .map(t => \`\${t.speaker}: \${t.text}\`)
      .join("\\n");
    return [facts, history, "User: " + question]
      .filter(Boolean)
      .join("\\n\\n");
  }
}

const chat = new ChatMemory(40);
chat.say("user", "I am preparing for my first interview.", "Keep answers short");
chat.say("ai", "Great, which role are you targeting?");
chat.say("user", "Frontend developer. Please keep answers short.");
for (let i = 0; i < 6; i++) chat.say("ai", "Noted, tell me more.");
console.log("dropped turns:", chat.dropped);
console.log(chat.buildPrompt("How should I answer weaknesses?"));`

export default function ContextMemoryPage() {
  const [playing, setPlaying] = useState(false)
  const [step, setStep] = useState(0)          // how many turns have been played
  const [memoryOn, setMemoryOn] = useState(false)
  const [windowList, setWindowList] = useState([])  // visible turns in the window
  const [droppingId, setDroppingId] = useState(null) // turn currently sliding out
  const [memoryList, setMemoryList] = useState([])   // surviving key facts
  const timer = useRef(null)

  // Window state derived from the script up to `step`.
  // Without memory: key facts live only inside the sliding window.
  // With memory: key facts are also pinned in memory (re-injected each turn).
  useEffect(() => {
    const turns = CONVO.slice(0, step)
    // slide the window: evict oldest until within capacity
    const kept = []
    let used = 0
    for (let i = turns.length - 1; i >= 0; i--) {
      used += turns[i].tokens
      if (used > CAPACITY) break
      kept.unshift(turns[i])
    }
    setWindowList(kept)
    if (memoryOn) {
      setMemoryList(CONVO.slice(0, step).filter(t => t.key && t.fact).map(t => t.fact))
    } else {
      // memory off → facts slide out with everything else
      const factIds = new Set(kept.filter(t => t.key && t.fact).map(t => t.id))
      setMemoryList(CONVO.slice(0, step).filter(t => t.key && t.fact && !factIds.has(t.id)).map(t => t.fact))
    }
  }, [step, memoryOn])

  // Flash the turn that just got evicted.
  useEffect(() => {
    if (step === 0) { setDroppingId(null); return }
    const turns = CONVO.slice(0, step)
    const keptIds = new Set()
    let used = 0
    for (let i = turns.length - 1; i >= 0; i--) {
      used += turns[i].tokens
      if (used > CAPACITY) break
      keptIds.add(turns[i].id)
    }
    const evicted = turns.find(t => !keptIds.has(t.id))
    if (evicted) {
      setDroppingId(evicted.id)
      const t = setTimeout(() => setDroppingId(null), 900)
      return () => clearTimeout(t)
    }
  }, [step])

  // Auto-play: one turn every 1.6s, loop at the end.
  useEffect(() => {
    if (!playing) return
    if (step >= CONVO.length) {
      timer.current = setTimeout(() => setStep(0), 2200)
      return () => clearTimeout(timer.current)
    }
    timer.current = setTimeout(() => setStep(s => s + 1), 1600)
    return () => clearTimeout(timer.current)
  }, [playing, step])

  const startPlay = () => {
    if (playing) { setPlaying(false); return }
    setStep(0)
    setPlaying(true)
  }
  const reset = () => { setPlaying(false); setStep(0); setMemoryOn(false) }
  const toggleMemory = () => setMemoryOn(m => !m)

  const used = windowList.reduce((s, t) => s + t.tokens, 0)
  const droppedCount = CONVO.slice(0, step).length - windowList.length
  const lostFacts = memoryOn ? [] : CONVO.slice(0, step).filter(t => t.key && t.fact && !windowList.some(w => w.id === t.id)).map(t => t.fact)
  const survives = memoryOn && CONVO.slice(0, step).some(t => t.key && t.fact)

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
    name: 'How to make AI remember your preferences, step by step',
    step: [
      { '@type': 'HowToStep', text: 'Understand the constraint: every model reads only its context window — a limited token budget that slides as the chat grows.' },
      { '@type': 'HowToStep', text: 'Watch the oldest messages drop in the live demo — new tokens push old ones out, which is why long chats lose the plot.' },
      { '@type': 'HowToStep', text: 'Toggle memory ON: key facts get pinned outside the sliding window so they never drop.' },
      { '@type': 'HowToStep', text: 'In your own apps, re-inject saved facts or summaries at the top of every prompt — memory is engineered, not automatic.' },
      { '@type': 'HowToStep', text: 'Prefer a tight, well-organized prompt over a giant dump: bigger windows postpone forgetting, they do not remove it.' },
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
        <meta property="og:image" content="https://www.uptools.in/assets/learning/ai/ai-lesson3-hero.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${TITLE} | UpTools`} />
        <meta name="twitter:description" content={DESC} />
        <meta name="twitter:image" content="https://www.uptools.in/assets/learning/ai/ai-lesson3-hero.jpg" />
        <meta name="keywords" content="context window AI, why AI forgets, AI memory, sliding context window, tokens context limit, how ChatGPT remembers, AI conversation memory, re-inject facts prompt" />
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
            { '@type': 'ListItem', position: 4, name: 'Context & Memory', item: URL },
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
        <span className="text-slate-300 font-medium">Context &amp; Memory</span>
      </nav>

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 border border-green-500/30 text-green-300 mb-4">
        <span>🧠</span> AI · Lesson 3 · Beginner
      </div>
      <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight m-0 mb-3">
        Context &amp; memory: why AI forgets — and how to make it remember
      </h1>
      <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-3xl">
        Every AI chat is a sliding window, not a notebook. As new messages arrive, the oldest
        tokens drop out to stay inside the model’s token budget — which is why a long chat
        "forgets" your name. Below, watch a conversation fill a 40-token window in real time,
        then toggle memory ON to pin the facts that must never drop.
      </p>

      <figure className="m-0 mb-6 rounded-2xl border border-white/[0.06] overflow-hidden">
        <img src={HERO}
          alt="Friendly robot watching chat message tiles slide through a glowing context window while old tiles fade and drop away"
          width="1600" height="893" loading="eager" className="w-full h-auto block" />
      </figure>

      {/* LIVE SLIDING WINDOW DEMO */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6" aria-label="Live sliding context window animation">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <h2 className="text-base font-bold text-white m-0">▶ Live demo: the sliding context window</h2>
          <span className="text-xs text-slate-400">Turn {Math.min(step + 1, CONVO.length)} / {CONVO.length} · {playing ? 'playing' : step === 0 ? 'idle' : 'paused'}</span>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button onClick={toggleMemory}
            className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl border cursor-pointer transition-all duration-300 ${memoryOn ? 'text-white border-green-500/60 shadow-lg shadow-green-500/10' : 'text-slate-400 border-white/10 bg-transparent hover:bg-white/5'}`}
            style={memoryOn ? { background: 'linear-gradient(135deg, rgba(34,197,94,0.22), rgba(21,128,61,0.18))' } : undefined}>
            <span className={`text-sm transition-transform duration-300 ${memoryOn ? 'scale-110' : ''}`}>💾</span>
            Memory
            <span className={`w-7 h-4 rounded-full relative transition-colors duration-300 ${memoryOn ? 'bg-green-500' : 'bg-white/10'}`}>
              <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all duration-300 ${memoryOn ? 'left-3.5' : 'left-0.5'}`} />
            </span>
          </button>
          <div className="flex gap-2 ml-auto">
            <button onClick={startPlay}
              className="text-xs font-bold px-5 py-2.5 rounded-xl text-white border-0 cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #22c55e, #15803d)' }}>
              {playing ? '⏸ Pause' : '▶ Auto-play'}
            </button>
            <button onClick={reset}
              className="text-xs font-semibold px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white cursor-pointer hover:bg-white/10">
              Reset
            </button>
          </div>
        </div>

        {/* TOKEN METER */}
        <div className="rounded-xl border border-white/10 bg-black/30 p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300">Context window · capacity {CAPACITY} tokens</span>
            <span className={`text-xs font-mono font-bold ${used >= CAPACITY ? 'text-amber-300' : 'text-green-300'}`}>{used} / {CAPACITY} tokens used</span>
          </div>
          <div className="h-3 rounded-full bg-black/50 overflow-hidden">
            <div className="h-full rounded-full transition-[width] duration-700 ease-out"
              style={{ width: `${Math.min(100, (used / CAPACITY) * 100)}%`, background: used >= CAPACITY ? 'linear-gradient(90deg,#b45309,#f59e0b)' : 'linear-gradient(90deg,#15803d,#22c55e)' }} />
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-mono">
            <span>oldest turn</span>
            <span>{droppedCount > 0 ? `${droppedCount} turn${droppedCount === 1 ? '' : 's'} dropped so far` : 'nothing dropped yet'}</span>
            <span>newest turn</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3 mb-4">
          {/* SLIDING WINDOW */}
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/[0.04] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-indigo-300">🪟 Sliding window (what the model sees)</span>
              <span className="text-[10px] font-mono text-slate-500">{windowList.length} turn{windowList.length === 1 ? '' : 's'} in view</span>
            </div>
            <div className="space-y-2 min-h-[260px]">
              {windowList.map(t => (
                <div key={t.id}
                  className={`rounded-lg px-3 py-2 border text-xs leading-relaxed transition-all duration-500 ${t.from === 'user' ? 'bg-black/40 border-white/10 text-slate-200' : 'bg-green-500/[0.06] border-green-500/20 text-green-100'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-bold ${t.from === 'user' ? 'text-slate-400' : 'text-green-400'}`}>{t.from === 'user' ? '👤 User' : '🤖 AI'}</span>
                    <span className="text-[9px] font-mono text-slate-500">{t.tokens} tok {t.key && t.fact ? '· 🔑 key fact' : ''}</span>
                  </div>
                  {t.text}
                </div>
              ))}
              {droppingId !== null && (
                <div className="rounded-lg px-3 py-2 border border-rose-500/40 bg-rose-500/[0.08] text-xs text-rose-200 animate-pulse">
                  💔 Turn #{droppingId} pushed out of the window — the model can no longer see it
                </div>
              )}
              {windowList.length === 0 && droppingId === null && (
                <p className="text-[11px] text-slate-500 italic m-0">Window empty — press Auto-play to start the conversation.</p>
              )}
            </div>
          </div>

          {/* MEMORY PANEL */}
          <div className="rounded-xl border border-white/10 p-4 flex flex-col"
            style={memoryOn ? { background: 'linear-gradient(135deg, rgba(34,197,94,0.06), rgba(17,24,39,0.4))', borderColor: 'rgba(34,197,94,0.3)' } : { background: 'rgba(0,0,0,0.2)' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white">💾 Memory (facts outside the window)</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${memoryOn ? 'text-green-300 border-green-500/40 bg-green-500/10' : 'text-slate-500 border-white/10 bg-white/5'}`}>
                {memoryOn ? 'ON — re-injected every turn' : 'OFF'}
              </span>
            </div>

            <div className="flex-1 space-y-2 min-h-[160px]">
              {memoryOn && memoryList.length > 0 && memoryList.map((f, i) => (
                <div key={i} className="rounded-lg px-3 py-2.5 border border-green-500/40 bg-green-500/[0.1] text-xs text-green-100 animate-pulse">
                  🔑 {f} <span className="text-green-400/70 text-[10px]">— pinned, survives the slide</span>
                </div>
              ))}
              {memoryOn && memoryList.length === 0 && (
                <p className="text-[11px] text-slate-500 italic m-0">Memory is ON but no key fact has been stated yet — play the conversation.</p>
              )}
              {!memoryOn && (
                <div className="rounded-lg px-3 py-2.5 border border-dashed border-white/15 text-xs text-slate-500">
                  Memory is OFF. Any fact the user states lives only inside the sliding window —
                  once it scrolls out, it is gone.
                </div>
              )}
            </div>

            {/* WHAT THE AI STILL REMEMBERS */}
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="text-[10px] font-bold text-slate-400 mb-2">What the AI still knows about you:</div>
              <div className="flex flex-wrap gap-1.5">
                <span className={`text-[11px] px-2 py-0.5 rounded-full border ${memoryOn ? 'bg-green-500/10 text-green-300 border-green-500/30' : 'bg-rose-500/10 text-rose-300 border-rose-500/30 line-through'}`}>
                  💾 Keep answers short {memoryOn ? '✓' : '✗ lost'}
                </span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full border ${memoryOn ? 'bg-green-500/10 text-green-300 border-green-500/30' : 'bg-rose-500/10 text-rose-300 border-rose-500/30 line-through'}`}>
                  💾 Name is Aarav {memoryOn ? '✓' : '✗ lost'}
                </span>
                {lostFacts.map((f, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30">
                    🔻 {f} — dropped from the window
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 m-0 mb-4">
          {survives
            ? 'Memory ON: key facts are pinned outside the sliding window and re-injected at the top of every prompt — the model still knows you want short answers, even after 40+ tokens of chat.'
            : step > 3
              ? 'Memory OFF: the conversation has already pushed key facts out of the 40-token window — watch the user’s preferences turn red and disappear from what the AI knows.'
              : 'Memory OFF: facts live only in the sliding window. Play the conversation and watch them drop once new messages fill the 40-token budget.'}
        </p>

        <figure className="m-0 rounded-xl border border-white/10 overflow-hidden">
          <img src={IMG_WINDOW}
            alt="Diagram: a transparent context window filling with message tiles until the oldest tiles spill over the capacity line and fall away"
            width="1600" height="893" loading="lazy" className="w-full h-auto block" />
        </figure>
      </section>

      {/* EXPLANATION */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-white mt-0 mb-3">How context windows actually work</h2>
        <ol className="text-sm text-slate-300 leading-relaxed space-y-2.5 list-decimal pl-5 m-0">
          <li><strong className="text-white">Everything is tokens.</strong> Text is chopped into tokens (roughly word fragments) and the model reads them all at once — your message, the whole history, any pasted document. The count of those tokens is what has to fit in the window.</li>
          <li><strong className="text-white">The window slides.</strong> When a new turn arrives and the budget is full, the oldest tokens are evicted to make room. Nothing is "remembered" from them — the model literally cannot see them on the next turn. This is forgetting, mechanically.</li>
          <li><strong className="text-white">Sessions reset completely.</strong> Close the chat and the window starts empty. Every app that "remembers" you across days is storing facts somewhere outside the model and pasting them back into the prompt each session.</li>
          <li><strong className="text-white">Memory is a re-injection trick.</strong> Saved preferences, rolling summaries, or notes from a database get prepended to the prompt — so facts ride above the sliding window where nothing can evict them. That is the entire secret of AI "memory".</li>
        </ol>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 text-center">
          {[['Context window', 'The token budget', 'Everything visible this turn'], ['Sliding eviction', 'Oldest drops first', 'Why long chats lose the plot'], ['Memory toggle', 'Facts pinned outside', 'Survives the slide by design'], ['Session reset', 'Window starts empty', 'Memory must be engineered']].map(([a, b, c]) => (
            <div key={a} className="rounded-xl bg-black/30 border border-white/10 px-2 py-3">
              <div className="text-[11px] text-slate-400 font-semibold">{a}</div>
              <div className="text-sm sm:text-base font-extrabold text-white">{b}</div>
              <div className="text-[10px] text-slate-500 leading-snug">{c}</div>
            </div>
          ))}
        </div>
        <figure className="m-0 mt-4 rounded-xl border border-white/10 overflow-hidden">
          <img src={IMG_MEMORY}
            alt="Diagram: two robots — one with an empty faded memory bubble, the other with a glowing memory vault and a toggle switch keeping facts alive"
            width="1600" height="893" loading="lazy" className="w-full h-auto block" />
        </figure>
      </section>

      {/* CODE */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-white mt-0 mb-3">Code (copy-paste ready)</h2>
        <p className="text-xs text-slate-400 mt-0 mb-4">A ChatMemory class: a sliding window that evicts the oldest turns when the token budget fills, plus a memory list of key facts that gets re-injected at the top of every prompt — the same pattern every AI app’s "memory" feature uses.</p>
        <div className="space-y-3">
          <CodeBlock lang="Python" code={PY_CODE} />
          <CodeBlock lang="JavaScript" code={JS_CODE} />
        </div>
      </section>

      {/* QUESTIONS */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-white mt-0 mb-1">Practice questions</h2>
        <p className="text-xs text-slate-400 mt-0 mb-4">The questions interviewers actually ask about AI context and memory. Tap to reveal the approach.</p>
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
          <li><strong className="text-white">Open with the mechanism:</strong> “A context window is a token budget, not a notebook — when new tokens arrive, the oldest are evicted. Forgetting is mechanical, not the model being stubborn.” Interviewers reward the crisp mechanism over hand-waving.</li>
          <li><strong className="text-white">Separate context from memory:</strong> “Context is what the model reads this turn — it slides and resets. Memory is what you store outside the window and re-inject each turn. Apps that remember you are engineering that layer, not magic.”</li>
          <li><strong className="text-white">Name the standard techniques:</strong> “Pinned facts in the system prompt, rolling summaries of older turns, and retrieval from a vector store — all three are re-injection strategies that fight the sliding window.” Naming RAG here lands well.</li>
          <li><strong className="text-white">Handle the “bigger window” follow-up:</strong> “A larger window postpones forgetting and costs more tokens — and details buried in the middle of a huge context are attended to less reliably. Durable recall still needs explicit memory.”</li>
          <li><strong className="text-white">Ground it in the live demo:</strong> “Play the conversation with memory OFF and watch the name fact turn red and drop — then toggle memory ON and it survives at the top of the prompt.” Referencing the demo makes the answer concrete and memorable.</li>
        </ul>
      </section>

      <FAQ questions={FAQS} />

      <div className="flex items-center justify-between flex-wrap gap-3 mt-6">
        <Link to="/learning/ai/prompting-that-gets-results" className="text-sm font-semibold text-green-300 no-underline">← Lesson 2: Prompting that gets results</Link>
        <Link to="/learning/ai/hallucinations-and-verifying" className="text-sm font-semibold text-green-300 no-underline">Next: Lesson 4 — Hallucinations &amp; verifying →</Link>
      </div>
    </>
  )
}
