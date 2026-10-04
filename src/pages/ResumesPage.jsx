import { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import FAQ from '../components/FAQ'

const TITLE = 'AI for Resumes & Interviews: ATS Optimization, Bullet Power & Mock Prep'
const DESC = 'Master AI for resumes and interviews with an interactive resume bullet transformer & STAR interview simulator — watch weak bullets transform with metrics and action verbs, boost ATS match scores, practice behavioral mock questions, and explore Python & JavaScript prompt automation. Includes 5 practice questions, 4 FAQs and interview tips.'
const URL = 'https://www.uptools.in/learning/ai/ai-for-resumes-interviews/'

// ---------------------------------------------------------------------------
// Resume Bullet Presets & Step-by-Step Transformations
// ---------------------------------------------------------------------------
const RESUME_PRESETS = [
  {
    id: 'software-engineer',
    role: '💻 Software Engineer',
    targetJob: 'Senior Frontend / Fullstack Engineer',
    accentColor: '#10b981',
    steps: [
      {
        level: 'Weak (Vague & Passive)',
        score: 28,
        atsMatch: 30,
        impactScore: 22,
        clarityScore: 35,
        text: 'Worked on frontend features and fixed bugs for company web app.',
        verdict: 'Lacks action verbs, specific technologies, measurable metrics, and business outcomes.',
        chips: { verb: 'Worked', metric: 'None', skill: 'web app', outcome: 'None' },
      },
      {
        level: 'Step 1: Strong Action Verb',
        score: 52,
        atsMatch: 55,
        impactScore: 48,
        clarityScore: 60,
        text: 'Architected and engineered responsive frontend components and resolved critical customer-reported defects.',
        verdict: 'Stronger verbs, but still missing quantifiable scale, metrics, and specific stack.',
        chips: { verb: 'Architected, Engineered', metric: 'None', skill: 'frontend components', outcome: 'resolved defects' },
      },
      {
        level: 'Step 2: Add Quantifiable Metrics',
        score: 78,
        atsMatch: 76,
        impactScore: 82,
        clarityScore: 80,
        text: 'Architected and engineered 14 responsive frontend components, accelerating page load by 42% across 120,000+ daily active users.',
        verdict: 'Clear scale and measurable performance boost. Now add the exact tech stack to maximize ATS match.',
        chips: { verb: 'Architected, Engineered', metric: '14 components, 42% faster, 120k DAU', skill: 'frontend components', outcome: 'accelerated page load' },
      },
      {
        level: 'Step 3: Google X-Y-Z Masterclass',
        score: 97,
        atsMatch: 98,
        impactScore: 96,
        clarityScore: 98,
        text: 'Architected 14 modular React, TypeScript & Tailwind components with Redis caching, cutting page load latency by 42% for 120k DAU and reducing customer churn by 18%.',
        verdict: 'Exceptional. Accomplished [X] measured by [Y] by doing [Z]. High ATS keyword density and direct revenue impact.',
        chips: { verb: 'Architected', metric: '42% latency cut, 120k DAU, 18% churn reduction', skill: 'React, TypeScript, Tailwind, Redis', outcome: 'Cut latency & churn' },
      },
    ],
  },
  {
    id: 'data-analyst',
    role: '📊 Data Analyst / BI',
    targetJob: 'Data Analyst & Analytics Engineer',
    accentColor: '#06b6d4',
    steps: [
      {
        level: 'Weak (Vague & Passive)',
        score: 25,
        atsMatch: 28,
        impactScore: 20,
        clarityScore: 32,
        text: 'Handled sales spreadsheets and made charts for managers.',
        verdict: 'Passive tone, no mention of data scale, SQL/BI tools, or actionable business decisions.',
        chips: { verb: 'Handled, Made', metric: 'None', skill: 'spreadsheets, charts', outcome: 'None' },
      },
      {
        level: 'Step 1: Strong Action Verb',
        score: 50,
        atsMatch: 52,
        impactScore: 49,
        clarityScore: 58,
        text: 'Automated executive sales pipelines and delivered interactive KPI business dashboards for leadership.',
        verdict: 'Professional tone, but needs concrete financial figures and specific tooling.',
        chips: { verb: 'Automated, Delivered', metric: 'None', skill: 'KPI dashboards', outcome: 'executive reporting' },
      },
      {
        level: 'Step 2: Add Quantifiable Metrics',
        score: 77,
        atsMatch: 75,
        impactScore: 80,
        clarityScore: 78,
        text: 'Automated executive sales analytics across $4.8M in regional revenue, cutting manual weekly reporting cycles by 12 hours.',
        verdict: 'Strong measurable time and dollar impact. Elevate with specific analytical tech stack.',
        chips: { verb: 'Automated', metric: '$4.8M revenue, 12h/week saved', skill: 'sales analytics', outcome: 'cut manual cycles' },
      },
      {
        level: 'Step 3: Google X-Y-Z Masterclass',
        score: 96,
        atsMatch: 97,
        impactScore: 95,
        clarityScore: 96,
        text: 'Engineered automated SQL, dbt & Tableau reporting pipelines across $4.8M in revenue, saving 12h/week of manual triage and surfacing $320K in cross-sell opportunities.',
        verdict: 'High-signal bullet. Proves tool proficiency, automation capability, and direct commercial growth.',
        chips: { verb: 'Engineered', metric: '$4.8M revenue, 12h/wk saved, $320K cross-sell', skill: 'SQL, dbt, Tableau', outcome: 'Surfaced $320K cross-sell' },
      },
    ],
  },
  {
    id: 'product-manager',
    role: '🎯 Product / Project Manager',
    targetJob: 'Product Manager (SaaS & B2B)',
    accentColor: '#8b5cf6',
    steps: [
      {
        level: 'Weak (Vague & Passive)',
        score: 26,
        atsMatch: 30,
        impactScore: 24,
        clarityScore: 30,
        text: 'Managed product roadmaps and talked to engineers about user feedback.',
        verdict: 'Describes everyday responsibilities rather than achievements or measurable user adoption.',
        chips: { verb: 'Managed, Talked', metric: 'None', skill: 'roadmaps', outcome: 'None' },
      },
      {
        level: 'Step 1: Strong Action Verb',
        score: 54,
        atsMatch: 58,
        impactScore: 50,
        clarityScore: 62,
        text: 'Spearheaded quarterly product roadmaps and cross-functional feature discovery sessions with engineering.',
        verdict: 'Action-oriented language, but lacks tangible product outcomes and business impact.',
        chips: { verb: 'Spearheaded', metric: 'None', skill: 'product roadmaps, feature discovery', outcome: 'discovery sessions' },
      },
      {
        level: 'Step 2: Add Quantifiable Metrics',
        score: 80,
        atsMatch: 79,
        impactScore: 84,
        clarityScore: 82,
        text: 'Spearheaded roadmap execution for 3 flagship SaaS features from discovery to launch, achieving a 34% boost in onboarding activation.',
        verdict: 'Demonstrates end-to-end ownership and double-digit metric growth. Add team scale & ARR.',
        chips: { verb: 'Spearheaded', metric: '3 features, 34% activation boost', skill: 'SaaS discovery & launch', outcome: 'boosted onboarding' },
      },
      {
        level: 'Step 3: Google X-Y-Z Masterclass',
        score: 98,
        atsMatch: 99,
        impactScore: 98,
        clarityScore: 97,
        text: 'Spearheaded 3 zero-to-one SaaS feature launches with a 9-engineer Agile team, driving 34% higher onboarding activation and unlocking $620K in ARR within 90 days.',
        verdict: 'Flawless product bullet. Covers leadership scope, cross-functional size, activation rate, and bottom-line ARR.',
        chips: { verb: 'Spearheaded', metric: '3 launches, 9-engineer team, 34% activation, $620K ARR in 90d', skill: 'Agile, Zero-to-One SaaS', outcome: 'Unlocked $620K ARR' },
      },
    ],
  },
  {
    id: 'growth-marketing',
    role: '📈 Growth & Marketing Lead',
    targetJob: 'Performance & Growth Marketing Lead',
    accentColor: '#f59e0b',
    steps: [
      {
        level: 'Weak (Vague & Passive)',
        score: 24,
        atsMatch: 26,
        impactScore: 18,
        clarityScore: 30,
        text: 'Ran social media ads and wrote posts to increase brand awareness.',
        verdict: 'Sounds like an entry-level task list without conversion numbers or ad spend efficiency.',
        chips: { verb: 'Ran, Wrote', metric: 'None', skill: 'social media ads', outcome: 'None' },
      },
      {
        level: 'Step 1: Strong Action Verb',
        score: 51,
        atsMatch: 54,
        impactScore: 48,
        clarityScore: 59,
        text: 'Orchestrated performance marketing campaigns and optimized creative copy across digital channels.',
        verdict: 'Better vocabulary, but needs budgets, channels, and conversion metrics.',
        chips: { verb: 'Orchestrated, Optimized', metric: 'None', skill: 'performance marketing', outcome: 'channel optimization' },
      },
      {
        level: 'Step 2: Add Quantifiable Metrics',
        score: 79,
        atsMatch: 78,
        impactScore: 82,
        clarityScore: 81,
        text: 'Orchestrated performance ad campaigns with an $85,000 budget, driving a 210% increase in marketing qualified leads (MQLs).',
        verdict: 'Clear scale and lead growth. Finish with CAC, ROAS, and specific platform toolset.',
        chips: { verb: 'Orchestrated', metric: '$85k budget, 210% MQL increase', skill: 'performance campaigns', outcome: 'drove 210% MQLs' },
      },
      {
        level: 'Step 3: Google X-Y-Z Masterclass',
        score: 98,
        atsMatch: 99,
        impactScore: 97,
        clarityScore: 98,
        text: 'Orchestrated multi-channel paid acquisition across Google Ads & Meta ($85K budget), scaling MQL volume by 210% while slashing CAC by 32% with a 4.6x blended ROAS.',
        verdict: 'Elite marketing bullet. Proves platform mastery, volume scaling, cost efficiency, and exceptional return on ad spend.',
        chips: { verb: 'Orchestrated, Scaled', metric: '$85K budget, 210% MQLs, 32% CAC drop, 4.6x ROAS', skill: 'Google Ads, Meta Ads, Paid Acquisition', outcome: 'Scaled MQLs at 4.6x ROAS' },
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// STAR Behavioral Interview Presets
// ---------------------------------------------------------------------------
const INTERVIEW_PRESETS = [
  {
    id: 'production-outage',
    question: 'Tell me about a time you handled a critical system outage or urgent deadline under intense pressure.',
    category: 'Crisis Management & Technical Ownership',
    weakAnswer: {
      text: 'One time our website went down on a busy sale day and the database was running really slow. The team panicked, but I stayed late and restarted the servers and checked some logs. Eventually it worked again and my manager thanked me for helping out.',
      score: 3.2,
      critique: 'Lacks technical root cause analysis, prevention measures, and quantitative metrics. Passive tone ("eventually it worked").',
    },
    starAnswer: {
      situation: 'During Black Friday peak traffic, our core checkout API encountered 504 gateway timeouts, threatening 8,500 active customer checkout sessions.',
      task: 'As on-call engineer, I had to isolate the bottleneck, restore transaction throughput within our 15-minute SLA, and prevent data corruption.',
      action: 'I identified unindexed DB table lock contention, spun up AWS RDS read replicas, implemented Redis cache invalidation for hot inventory rows, and pushed an emergency hotfix.',
      result: 'Restored 100% checkout availability in 9 minutes, protecting $140K in revenue, and authored an automated load-testing suite preventing future regressions.',
      score: 9.8,
      critique: 'High signal. Precise technical decision-making (RDS read replicas, Redis caching), clear ownership, and measurable business and SLA metrics.',
    },
  },
  {
    id: 'team-disagreement',
    question: 'Describe a situation where you had a major disagreement with a team member or manager regarding project direction.',
    category: 'Collaboration & Influence',
    weakAnswer: {
      text: 'My manager wanted to use one tech stack, but I knew my favorite framework was much better and faster. We argued about it for a week in meetings. In the end, we went with my idea and the project turned out fine.',
      score: 3.5,
      critique: 'Red flag tone ("argued for a week", "favorite framework"). Lacks objective data-driven decision making and collaborative empathy.',
    },
    starAnswer: {
      situation: 'Our team was split between refactoring our legacy codebase into distributed microservices or optimizing a modular monolith for an urgent Q3 enterprise launch.',
      task: 'My tech lead favored microservices, while I was concerned about devops overhead jeopardizing our tight 8-week delivery timeline.',
      action: 'Rather than debate opinions, I built a 3-day proof-of-concept benchmarking CI/CD latency, network hops, and developer cognitive load, proposing a modular architecture with clean API boundaries.',
      result: 'The team and leadership adopted the benchmarked POC, shipping the enterprise release 2 weeks ahead of schedule with zero deployment incidents.',
      score: 9.6,
      critique: 'Replaces emotional arguments with objective POC benchmarks. Shows diplomatic leadership, speed-to-market focus, and empathy.',
    },
  },
  {
    id: 'failed-project',
    question: 'Tell me about a project that failed or did not meet expectations, and what you learned from the experience.',
    category: 'Extreme Ownership & Growth Mindset',
    weakAnswer: {
      text: 'We launched a new product recommendation widget, but users did not click on it. It was mostly the design team’s fault because the button was placed in an awkward spot. We ended up just taking it down.',
      score: 2.8,
      critique: 'Blames colleagues ("design team’s fault"). Shows zero self-reflection, lack of data diagnostics, and missed learnings.',
    },
    starAnswer: {
      situation: 'We spent 6 weeks building an AI smart search filter designed to increase e-commerce search-to-cart conversion rate by 15%.',
      task: 'Upon launch, our A/B test revealed only a 1.4% click-through rate with no statistically significant conversion uplift.',
      action: 'I led post-launch diagnostics: analyzed 150+ user session recordings, interviewed 8 customers, and realized our multi-step filter caused choice paralysis. I took ownership of skipping early clickable wireframe validation.',
      result: 'We redesigned the experience into a 1-click contextual quick-tag bar, lifting search conversion by 28%, and established a mandatory 5-user prototype test rule for all future roadmaps.',
      score: 9.7,
      critique: 'Exemplifies extreme ownership. Shows user research rigor, turns a setback into a 28% win, and creates an enduring organizational policy.',
    },
  },
]

function CodeBlock({ lang, code }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="rounded-xl overflow-hidden border border-white/10">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5">
        <span className="text-xs font-bold text-slate-300">{lang}</span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(code).then(() => {
              setCopied(true)
              setTimeout(() => setCopied(false), 1500)
            })
          }}
          className="text-xs font-semibold text-emerald-300 hover:text-white bg-transparent border-0 cursor-pointer"
        >
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      </div>
      <pre className="m-0 p-4 text-xs leading-relaxed overflow-x-auto bg-black/40 text-slate-200">
        <code>{code}</code>
      </pre>
    </div>
  )
}

const QUESTIONS = [
  {
    q: 'How do modern Applicant Tracking Systems (ATS) scan and rank resumes using AI and embeddings?',
    a: 'Traditional ATS used simple exact-keyword string matching (e.g. counting mentions of "Python"). Modern AI ATS platforms (such as Eightfold, Greenhouse with semantic search, and Workday AI) convert both your resume and the target Job Description (JD) into high-dimensional vector embeddings using transformer models. They compute cosine similarity across required skills, seniority level, technical stacks, and project impact. They also parse structured entities (job titles, dates, certifications, tools). Resumes that mirror the core vocabulary, skills hierarchy, and quantify business outcomes rank at the top of recruiter pipelines.',
  },
  {
    q: 'What is Google’s X-Y-Z Resume Formula and why is it the gold standard for bullet points?',
    a: 'Google’s X-Y-Z formula states: "Accomplished [X], as measured by [Y], by doing [Z]." For example: "Reduced average page checkout latency by 42% [X], as measured by Datadog APM metrics across 120k daily users [Y], by implementing Redis caching and optimizing GraphQL query resolvers [Z]." This formula forces you to lead with measurable impact, quantify the scope and business baseline, and prove your exact technical or strategic contributions.',
  },
  {
    q: 'How should you structure behavioral interview responses using the STAR method with AI coaching?',
    a: 'The STAR method structures behavioral answers into 4 distinct phases: 1) Situation (the high-stakes context and constraint), 2) Task (your specific individual responsibility or challenge), 3) Action (the concrete technical or leadership decisions YOU executed), and 4) Result (the quantifiable business impact, lessons learned, and metrics). When using AI for prep, feed your raw story and prompt the model: "Evaluate this draft against the STAR framework. Point out missing metrics, identify any passive language, and score technical ownership from 1 to 10."',
  },
  {
    q: 'What is the most effective prompt workflow for tailoring your resume to a specific job description without sounding robotic?',
    a: 'The best workflow uses a 3-step prompt chain: Step 1 (Gap Analysis): Feed the target job description and your master resume to AI and ask: "List top 5 missing hard skills and keywords present in the JD that are not evident in my resume." Step 2 (Experience Framing): Provide raw, truthful facts from your background and ask: "Rewrite these 3 bullets using the Google X-Y-Z formula to highlight [Skill A] and [Skill B] without inventing facts." Step 3 (Human Review): Read every rewritten bullet aloud, verify all numbers are 100% accurate, and adjust phrasing so it matches your authentic voice.',
  },
  {
    q: 'What are the biggest ethical and practical pitfalls when using AI for resumes and job interviews?',
    a: 'The two fatal traps are: 1) Hallucination / Resume Inflation: LLMs frequently invent impressive-sounding numbers, tools, or team sizes if unconstrained. Claiming skills you cannot defend in a technical deep-dive will immediately fail you in live interviews. 2) Generic AI Tone ("Buzzword Soup"): Overusing phrases like "Spearheaded revolutionary paradigm shifts" or "Leveraged synergy" screams AI-generated text to recruiters. Always enforce strict system instructions: "Use concise, crisp engineering language. Never invent data."',
  },
]

const FAQS = [
  {
    q: 'Can recruiters detect AI-written resumes, and will it hurt my application?',
    a: 'Recruiters cannot reliably detect AI usage through software detectors (which have high false-positive rates), but they immediately spot generic AI tropes: overly florid adjectives ("exceptional visionary"), lack of specific numbers, or repetitive bullet syntax across every company. If your bullet points are crisp, grounded in real metrics, and contain specific tools (e.g. "Kubernetes, Terraform, AWS EKS"), recruiters appreciate the clarity and high signal.',
  },
  {
    q: 'Should I submit different tailored resumes for every job or use one general master resume?',
    a: 'Top candidates maintain a Comprehensive Master Resume (3–4 pages detailing every project, metric, and skill) and use AI to generate tailored 1-page versions for each application. For a target role, AI helps re-order bullet points to place the most relevant technologies first, aligns terminology with the job description (e.g. "Continuous Integration" vs "CI/CD"), and removes irrelevant tangents.',
  },
  {
    q: 'How do I practice live mock interviews using voice AI and real-time LLM agents?',
    a: 'You can use conversational LLMs (such as ChatGPT Voice Mode, Claude, or custom WebRTC agents) by providing a strict persona prompt: "Act as a tough Bar Raiser / Principal Engineer conducting a 30-minute behavioral interview for a Senior Software Engineer role at Stripe. Ask one question at a time. After I answer, evaluate my STAR structure, point out gaps, and ask a probing follow-up before moving to the next question."',
  },
  {
    q: 'How do I quantify my achievements on my resume if my previous company did not track exact metrics?',
    a: 'You can estimate credible engineering and operational baselines: 1) Time Saved ("Automated data migration, saving 6 engineer-hours per sprint"), 2) Scale ("Managed infrastructure supporting 50+ microservices and 10TB daily log volume"), 3) Percentage Improvements ("Reduced Docker image build time by ~35%"), or 4) User / Team Scope ("Onboarded 12 new engineers with standardized documentation"). Never make up fake revenue numbers; focus on operational efficiency and speed.',
  },
]

const PY_CODE = `# Complete AI Resume Optimizer & Job Matcher in Python (OpenAI / Anthropic API)
import os
import json
import openai

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def optimize_resume_bullet(raw_bullet: str, target_role: str, tech_stack: list[str]) -> dict:
    """
    Transforms a weak resume bullet using Google's X-Y-Z formula
    (Accomplished [X] measured by [Y] by doing [Z]) and scores ATS readiness.
    """
    system_prompt = """
    You are an elite Tech Career Coach & ATS Resume Optimizer.
    Analyze the user's raw resume bullet and transform it into 3 progressive tiers:
    1. Action Verb Boost (Active voice, high agency)
    2. Quantified Impact (Metrics, scale, % change, time saved)
    3. Google X-Y-Z Formula (Accomplished [X] as measured by [Y], by doing [Z])
    
    Output strictly valid JSON with keys:
    - raw_score (0-100)
    - optimized_bullet
    - optimized_score (0-100)
    - action_verbs_used (list)
    - metrics_included (list)
    - ats_keywords (list)
    - feedback (concise critique)
    """

    user_message = f"""
    Target Role: {target_role}
    Required Tech Stack: {', '.join(tech_stack)}
    Raw Bullet: "{raw_bullet}"
    """

    response = client.chat.completions.create(
        model="gpt-4o",
        temperature=0.3, # Low temperature for factual, deterministic formatting
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ]
    )

    return json.loads(response.choices[0].message.content)

# Example Execution
if __name__ == "__main__":
    result = optimize_resume_bullet(
        raw_bullet="Helped build frontend features and fixed bugs for company web app.",
        target_role="Senior Frontend Engineer",
        tech_stack=["React", "TypeScript", "Tailwind CSS", "Redis", "Next.js"]
    )
    print("✅ Optimized Bullet:", result["optimized_bullet"])
    print(f"📈 Score Improvement: {result['raw_score']}/100 -> {result['optimized_score']}/100")
    print("🎯 ATS Keywords:", result["ats_keywords"])`

const JS_CODE = `// Real-Time STAR Behavioral Mock Interview Coach (Node.js & OpenAI SDK)
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function evaluateStarInterviewAnswer(question, candidateAnswer) {
  console.log(\`🎙️ Evaluating Candidate Answer for: "\${question}"...\\n\`);

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content: \`You are an executive Bar Raiser & Hiring Director.
Evaluate the candidate's interview answer strictly using the STAR methodology:
1. Situation: Was the context clear, high-stakes, and concise?
2. Task: Was the candidate's individual ownership defined?
3. Action: Were concrete technical decisions / leadership actions articulated?
4. Result: Were measurable outcomes, metrics, or revenue impacts included?

Provide a JSON output:
- overallScore: (1.0 to 10.0)
- starBreakdown: { situationScore, taskScore, actionScore, resultScore }
- detectedWeaknesses: [list]
- rewrittenStarVersion: { situation, task, action, result }
- nextProbingQuestion: "Follow-up question to test depth"\`
      },
      {
        role: "user",
        content: \`Interview Question: \${question}\\nCandidate Response: \${candidateAnswer}\`
      }
    ],
    response_format: { type: "json_object" }
  });

  const evaluation = JSON.parse(response.choices[0].message.content);
  console.log(\`⭐ Overall Score: \${evaluation.overallScore}/10\`);
  console.log("🚀 Rewritten STAR Result:", evaluation.rewrittenStarVersion.result);
  console.log("❓ Probing Follow-Up:", evaluation.nextProbingQuestion);
  return evaluation;
}

// Example Run
// evaluateStarInterviewAnswer(
//   "Tell me about a time you handled a critical outage.",
//   "The site went down on Black Friday and I stayed up late to restart the servers."
// );`

export default function ResumesPage() {
  const [activeTab, setActiveTab] = useState('bullet-optimizer') // 'bullet-optimizer' | 'star-interviews' | 'pillars' | 'cheat-sheet'
  const [selectedPresetId, setSelectedPresetId] = useState('software-engineer')
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedInterviewId, setSelectedInterviewId] = useState('production-outage')
  const [interviewMode, setInterviewMode] = useState('after') // 'before' | 'after'

  const canvasRef = useRef(null)
  const timerRef = useRef(null)

  const activePreset = useMemo(() => {
    return RESUME_PRESETS.find(p => p.id === selectedPresetId) || RESUME_PRESETS[0]
  }, [selectedPresetId])

  const activeStep = activePreset.steps[currentStepIndex] || activePreset.steps[0]

  const activeInterview = useMemo(() => {
    return INTERVIEW_PRESETS.find(p => p.id === selectedInterviewId) || INTERVIEW_PRESETS[0]
  }, [selectedInterviewId])

  // Auto-step player for bullet transformation
  useEffect(() => {
    if (isPlaying) {
      if (currentStepIndex < activePreset.steps.length - 1) {
        timerRef.current = setTimeout(() => {
          setCurrentStepIndex(prev => prev + 1)
        }, 2200)
      } else {
        setIsPlaying(false)
      }
    }
    return () => clearTimeout(timerRef.current)
  }, [isPlaying, currentStepIndex, activePreset.steps.length])

  // Reset step index when preset changes
  const handleSelectPreset = (p) => {
    setSelectedPresetId(p.id)
    setCurrentStepIndex(0)
    setIsPlaying(false)
  }

  // Visual Gauge & Scoreboard Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

    // Background clear
    ctx.fillStyle = '#0a0f1d'
    ctx.fillRect(0, 0, width, height)

    // Left Side: Circular Speedometer / Impact Score Gauge (45% width)
    const leftWidth = Math.floor(width * 0.44)
    const centerX = leftWidth / 2 + 10
    const centerY = height * 0.52
    const radius = 68

    // Outer subtle border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
    ctx.lineWidth = 1
    ctx.strokeRect(10, 10, leftWidth - 10, height - 20)

    // Header on left
    ctx.fillStyle = '#94a3b8'
    ctx.font = '10px monospace'
    ctx.fillText('RESUME STRENGTH GAUGE', 20, 26)

    // Gauge Track (Background Arc)
    const startAngle = Math.PI * 0.75
    const endAngle = Math.PI * 2.25
    const totalAngle = endAngle - startAngle

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, startAngle, endAngle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 12
    ctx.lineCap = 'round'
    ctx.stroke()

    // Gauge Active Progress Arc
    const scoreVal = activeStep.score
    const progressAngle = startAngle + totalAngle * (scoreVal / 100)

    let gaugeColor = '#ef4444' // red
    if (scoreVal > 75) gaugeColor = activePreset.accentColor // green/cyan/etc
    else if (scoreVal > 45) gaugeColor = '#f59e0b' // amber

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, startAngle, progressAngle)
    ctx.strokeStyle = gaugeColor
    ctx.lineWidth = 12
    ctx.lineCap = 'round'
    ctx.shadowColor = gaugeColor
    ctx.shadowBlur = 10
    ctx.stroke()
    ctx.shadowBlur = 0

    // Score Text in Center of Gauge
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 28px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`${scoreVal}`, centerX, centerY + 2)

    ctx.fillStyle = '#94a3b8'
    ctx.font = '11px sans-serif'
    ctx.fillText('/ 100 PTS', centerX, centerY + 20)

    ctx.fillStyle = gaugeColor
    ctx.font = 'bold 10px sans-serif'
    const tierName = scoreVal > 85 ? 'HIGH SIGNAL' : scoreVal > 65 ? 'GOOD IMPACT' : scoreVal > 40 ? 'AVERAGE' : 'WEAK / REJECT'
    ctx.fillText(tierName, centerX, centerY + 36)

    // -------------------------------------------------------------------------
    // Right Side: Multi-Metric Score Bars (ATS, Impact, Clarity)
    // -------------------------------------------------------------------------
    const rightX = leftWidth + 20
    const rightWidth = width - rightX - 16

    ctx.textAlign = 'left'
    ctx.fillStyle = '#94a3b8'
    ctx.font = '11px sans-serif'
    ctx.fillText('ATS & HIRING MANAGER SCORECARD', rightX, 26)

    const metrics = [
      { label: 'ATS Keyword Match', val: activeStep.atsMatch, color: '#38bdf8' },
      { label: 'Measurable Impact & Scope', val: activeStep.impactScore, color: '#10b981' },
      { label: 'Clarity & X-Y-Z Structure', val: activeStep.clarityScore, color: '#a855f7' },
    ]

    metrics.forEach((m, idx) => {
      const rowY = 56 + idx * 56

      // Label & Value
      ctx.fillStyle = '#e2e8f0'
      ctx.font = '12px sans-serif'
      ctx.fillText(m.label, rightX, rowY)

      ctx.fillStyle = m.color
      ctx.font = 'bold 12px monospace'
      ctx.textAlign = 'right'
      ctx.fillText(`${m.val}%`, rightX + rightWidth, rowY)
      ctx.textAlign = 'left'

      // Bar Background
      const barY = rowY + 8
      const barHeight = 8
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
      ctx.beginPath()
      ctx.roundRect(rightX, barY, rightWidth, barHeight, 4)
      ctx.fill()

      // Bar Progress Fill
      const fillW = Math.max(8, (rightWidth * m.val) / 100)
      ctx.fillStyle = m.color
      ctx.shadowColor = m.color
      ctx.shadowBlur = 6
      ctx.beginPath()
      ctx.roundRect(rightX, barY, fillW, barHeight, 4)
      ctx.fill()
      ctx.shadowBlur = 0
    })

    // Subtitle note
    ctx.fillStyle = '#64748b'
    ctx.font = '10px sans-serif'
    ctx.fillText(`Target Benchmark: ${activePreset.targetJob}`, rightX, height - 16)

  }, [activeStep, activePreset])

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: TITLE,
    description: DESC,
    image: 'https://www.uptools.in/assets/og/default.png',
    author: { '@type': 'Organization', name: 'UpTools', url: 'https://www.uptools.in/' },
    publisher: {
      '@type': 'Organization',
      name: 'UpTools',
      logo: { '@type': 'ImageObject', url: 'https://www.uptools.in/assets/logo/uptools-logo.svg' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': URL },
  }

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Supercharge Resumes and Ace Interviews Using AI',
    step: [
      {
        '@type': 'HowToStep',
        text: 'Extract Target Keywords: Feed the target job description to AI to extract essential hard skills, tools, and seniority requirements.',
      },
      {
        '@type': 'HowToStep',
        text: 'Deconstruct Weak Bullets: Identify passive verbs ("helped", "handled", "worked on") and lack of measurable baselines.',
      },
      {
        '@type': 'HowToStep',
        text: 'Apply the Google X-Y-Z Formula: Structure every bullet as "Accomplished [X], as measured by [Y], by doing [Z]" with hard metrics and tool names.',
      },
      {
        '@type': 'HowToStep',
        text: 'Structure STAR Behavioral Stories: Format interview responses into Situation, Task, Action, and Result with quantifiable business outcomes.',
      },
      {
        '@type': 'HowToStep',
        text: 'Run AI Mock Interview Simulations: Practice live answering with strict LLM system prompts acting as a Bar Raiser or Principal Engineer.',
      },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
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
        <meta property="og:image" content="https://www.uptools.in/assets/learning/ai/ai-lesson10-hero.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${TITLE} | UpTools`} />
        <meta name="twitter:description" content={DESC} />
        <meta name="twitter:image" content="https://www.uptools.in/assets/learning/ai/ai-lesson10-hero.jpg" />
        <meta
          name="keywords"
          content="AI for resumes, AI resume builder, ATS resume optimization, STAR method interview AI, Google XYZ formula, mock interview AI, resume prompt engineering, job search AI tools, career prep AI"
        />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.uptools.in/' },
              { '@type': 'ListItem', position: 2, name: 'Learning', item: 'https://www.uptools.in/learning/' },
              { '@type': 'ListItem', position: 3, name: 'AI', item: 'https://www.uptools.in/learning/ai/' },
              { '@type': 'ListItem', position: 4, name: 'AI for Resumes and Interviews', item: URL },
            ],
          })}
        </script>
      </Helmet>

      {/* BREADCRUMB */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-5 flex-wrap" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span className="text-slate-700">›</span>
        <Link to="/learning" className="hover:text-white transition-colors">Learning</Link>
        <span className="text-slate-700">›</span>
        <Link to="/learning/ai" className="hover:text-white transition-colors">AI</Link>
        <span className="text-slate-700">›</span>
        <span className="text-slate-300 font-medium">AI for Resumes and Interviews</span>
      </nav>

      {/* BADGE & HEADER */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 mb-4">
        <span>💼</span> AI · Lesson 10 · Beginner
      </div>
      <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight m-0 mb-3">
        AI for Resumes &amp; Interviews: ATS Optimization, Bullet Power &amp; Mock Prep
      </h1>
      <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-3xl">
        Landing top tech and corporate roles requires two superpowers: passing <strong>Applicant Tracking System (ATS) AI semantic filters</strong> with high-impact resume bullets, and delivering high-signal <strong>STAR-method responses</strong> during interviews. Discover how to use AI as your career accelerator — turning weak, passive job descriptions into quantified <strong>Google X-Y-Z achievements</strong> and running realistic mock interview simulations with real-time feedback.
 </p>
 <figure className="m-0 mb-6 rounded-xl border border-white/10 overflow-hidden">
 <img src="/assets/learning/ai/ai-lesson10-hero.jpg" alt="Robot polishing a resume with score meter rising" loading="lazy" />
 </figure>

 {/* LIVE INTERACTIVE ANIMATOR */}
      <section
        className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6"
        aria-label="Live Resume & Interview AI Simulator"
      >
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-white m-0">▶ Live Demo: Resume Bullet Transformer &amp; STAR Interview Lab</h2>
            <p className="text-xs text-slate-400 m-0 mt-0.5">
              Transform weak bullets step-by-step with real-time score meters, or toggle before/after STAR interview answers.
            </p>
          </div>
          <div className="flex rounded-xl bg-black/40 border border-white/10 p-1 flex-wrap gap-1">
            <button
              onClick={() => setActiveTab('bullet-optimizer')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-all ${
                activeTab === 'bullet-optimizer' ? 'bg-emerald-500/30 text-emerald-300' : 'text-slate-400 bg-transparent hover:text-white'
              }`}
            >
              📄 Bullet Transformer
            </button>
            <button
              onClick={() => setActiveTab('star-interviews')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-all ${
                activeTab === 'star-interviews' ? 'bg-emerald-500/30 text-emerald-300' : 'text-slate-400 bg-transparent hover:text-white'
              }`}
            >
              🎙️ STAR Interview Coach
            </button>
            <button
              onClick={() => setActiveTab('pillars')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-all ${
                activeTab === 'pillars' ? 'bg-emerald-500/30 text-emerald-300' : 'text-slate-400 bg-transparent hover:text-white'
              }`}
            >
              🏛️ 4 Core Pillars
            </button>
            <button
              onClick={() => setActiveTab('cheat-sheet')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-all ${
                activeTab === 'cheat-sheet' ? 'bg-emerald-500/30 text-emerald-300' : 'text-slate-400 bg-transparent hover:text-white'
              }`}
            >
              📊 ATS Scorecard Specs
            </button>
          </div>
        </div>

        {/* TAB 1: RESUME BULLET TRANSFORMER */}
        {activeTab === 'bullet-optimizer' && (
          <div className="space-y-4">
            {/* ROLE PRESETS */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs font-bold text-slate-400">Target Role Preset:</span>
              {RESUME_PRESETS.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(p)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${
                    selectedPresetId === p.id
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {p.role}
                </button>
              ))}
            </div>

            {/* CANVAS GAUGE & METERS */}
            <div className="rounded-xl overflow-hidden border border-white/10 bg-slate-950/80 p-2">
              <canvas
                ref={canvasRef}
                width={700}
                height={220}
                className="w-full h-auto block rounded-lg max-h-[240px]"
              />
            </div>

            {/* STEP PROGRESSION SELECTOR & CONTROLS */}
            <div className="rounded-xl bg-black/40 border border-white/10 p-4">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Evolution Stage:</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Step {currentStepIndex + 1} of {activePreset.steps.length}: {activeStep.level}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white border-0 cursor-pointer transition-colors"
                  >
                    {isPlaying ? '⏸ Pause' : '▶ Auto-Transform'}
                  </button>
                  <button
                    onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentStepIndex === 0}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-200 border-0 cursor-pointer disabled:opacity-30"
                  >
                    ← Step Back
                  </button>
                  <button
                    onClick={() => setCurrentStepIndex(prev => Math.min(activePreset.steps.length - 1, prev + 1))}
                    disabled={currentStepIndex === activePreset.steps.length - 1}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-200 border-0 cursor-pointer disabled:opacity-30"
                  >
                    Step Next →
                  </button>
                  <button
                    onClick={() => { setCurrentStepIndex(0); setIsPlaying(false); }}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-400 border-0 cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* STEP TABS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {activePreset.steps.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setCurrentStepIndex(idx); setIsPlaying(false); }}
                    className={`text-left p-2.5 rounded-lg border transition-all cursor-pointer ${
                      currentStepIndex === idx
                        ? 'bg-emerald-500/20 border-emerald-500/60 text-white ring-1 ring-emerald-500/40'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold">Stage {idx + 1}</span>
                      <span className={`font-mono font-bold ${s.score > 80 ? 'text-emerald-300' : s.score > 50 ? 'text-amber-300' : 'text-red-400'}`}>
                        {s.score} pts
                      </span>
                    </div>
                    <div className="text-[11px] truncate text-slate-300 font-medium">{s.level.split(':')[1] || s.level}</div>
                  </button>
                ))}
              </div>

              {/* TRANSFORMED BULLET DISPLAY */}
              <div className="rounded-xl border border-white/15 bg-black/60 p-4 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Resume Bullet Preview</span>
                  <span className="text-[11px] font-mono text-emerald-400">{activeStep.chips.verb !== 'Worked' ? '✓ AI Optimized' : '⚠ Raw Draft'}</span>
                </div>
                <div className="text-sm sm:text-base font-medium text-white leading-relaxed mb-3">
                  &ldquo;{activeStep.text}&rdquo;
                </div>
                <div className="text-xs text-slate-300 italic bg-white/5 p-2.5 rounded-lg border border-white/5">
                  <strong className="text-slate-200 font-semibold not-italic">AI Recruiter Assessment: </strong>
                  {activeStep.verdict}
                </div>
              </div>

              {/* COMPONENT BREAKDOWN CHIPS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                <div className="rounded-lg bg-white/5 border border-white/10 p-2.5">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">1. Action Verb</div>
                  <div className="text-xs font-bold text-amber-300 truncate mt-0.5">{activeStep.chips.verb}</div>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 p-2.5">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">2. Quantified Metric</div>
                  <div className="text-xs font-bold text-emerald-300 truncate mt-0.5">{activeStep.chips.metric}</div>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 p-2.5">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">3. Skill / Tech Stack</div>
                  <div className="text-xs font-bold text-cyan-300 truncate mt-0.5">{activeStep.chips.skill}</div>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 p-2.5">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">4. Business Outcome</div>
                  <div className="text-xs font-bold text-purple-300 truncate mt-0.5">{activeStep.chips.outcome}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STAR INTERVIEW COACH */}
        {activeTab === 'star-interviews' && (
          <div className="space-y-4">
            {/* QUESTION SELECTOR */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs font-bold text-slate-400">Behavioral Question:</span>
              {INTERVIEW_PRESETS.map(q => (
                <button
                  key={q.id}
                  onClick={() => setSelectedInterviewId(q.id)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${
                    selectedInterviewId === q.id
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {q.category}
                </button>
              ))}
            </div>

            {/* ACTIVE QUESTION BANNER */}
            <div className="rounded-xl bg-slate-900 border border-white/10 p-4">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                📌 Target Interview Question ({activeInterview.category})
              </div>
              <div className="text-sm sm:text-base font-bold text-white leading-snug">
                &ldquo;{activeInterview.question}&rdquo;
              </div>
            </div>

            {/* BEFORE / AFTER SWITCHER */}
            <div className="flex items-center justify-between flex-wrap gap-2 bg-black/40 p-2 rounded-xl border border-white/10">
              <div className="text-xs text-slate-400">
                Compare typical conversational response vs structured <strong>STAR methodology</strong>:
              </div>
              <div className="flex rounded-lg bg-slate-800 p-0.5 border border-white/10">
                <button
                  onClick={() => setInterviewMode('before')}
                  className={`text-xs font-bold px-3 py-1 rounded-md border-0 cursor-pointer transition-all ${
                    interviewMode === 'before'
                      ? 'bg-red-500/30 text-red-300 shadow'
                      : 'text-slate-400 bg-transparent hover:text-white'
                  }`}
                >
                  ❌ Before (Weak / Rambling)
                </button>
                <button
                  onClick={() => setInterviewMode('after')}
                  className={`text-xs font-bold px-3 py-1 rounded-md border-0 cursor-pointer transition-all ${
                    interviewMode === 'after'
                      ? 'bg-emerald-500/30 text-emerald-300 shadow'
                      : 'text-slate-400 bg-transparent hover:text-white'
                  }`}
                >
                  ⭐ After (AI STAR Masterclass)
                </button>
              </div>
            </div>

            {/* RESPONSE CONTENT VIEW */}
            {interviewMode === 'before' ? (
              <div className="rounded-xl border border-red-500/20 bg-red-950/20 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                    Candidate Draft (Score: {activeInterview.weakAnswer.score} / 10)
                  </span>
                  <span className="text-xs text-red-400 font-semibold">⚠️ Low Signal / High Risk</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-sans m-0">
                  &ldquo;{activeInterview.weakAnswer.text}&rdquo;
                </p>
                <div className="rounded-lg bg-black/40 border border-red-500/20 p-3 text-xs text-red-200 leading-relaxed">
                  <strong>AI Recruiter Feedback: </strong>
                  {activeInterview.weakAnswer.critique}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    ⭐ AI STAR Formatted Response (Score: {activeInterview.starAnswer.score} / 10)
                  </span>
                  <span className="text-xs text-emerald-300 font-semibold">✓ Strong Hire Signal</span>
                </div>

                <div className="grid gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-black/40 border border-blue-500/20">
                    <span className="font-bold text-blue-400 uppercase tracking-wider text-[10px] block mb-1">
                      [S] SITUATION (Context &amp; High Stakes)
                    </span>
                    <p className="text-slate-200 text-xs m-0 leading-relaxed">{activeInterview.starAnswer.situation}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-amber-500/20">
                    <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px] block mb-1">
                      [T] TASK (Personal Responsibility &amp; Constraints)
                    </span>
                    <p className="text-slate-200 text-xs m-0 leading-relaxed">{activeInterview.starAnswer.task}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-purple-500/20">
                    <span className="font-bold text-purple-400 uppercase tracking-wider text-[10px] block mb-1">
                      [A] ACTION (Specific Technical Decisions &amp; Execution)
                    </span>
                    <p className="text-slate-200 text-xs m-0 leading-relaxed">{activeInterview.starAnswer.action}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-emerald-500/20">
                    <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px] block mb-1">
                      [R] RESULT (Quantifiable Business Metrics &amp; Prevention)
                    </span>
                    <p className="text-slate-200 text-xs m-0 leading-relaxed">{activeInterview.starAnswer.result}</p>
                  </div>
                </div>

                <div className="rounded-lg bg-black/40 border border-emerald-500/30 p-3 text-xs text-emerald-200 leading-relaxed">
                  <strong>AI Recruiter Evaluation: </strong>
                  {activeInterview.starAnswer.critique}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: 4 PILLARS */}
        {activeTab === 'pillars' && (
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl bg-black/40 border border-white/10 p-4">
              <div className="text-xl mb-2">1. 🎯 Semantic ATS Keyword Mapping</div>
              <h3 className="text-sm font-bold text-white m-0 mb-1">Transformer Embeddings over Regex</h3>
              <p className="text-xs text-slate-300 leading-relaxed m-0">
                Modern ATS platforms (Workday, Eightfold) vectorize your resume and the target JD. AI helps extract semantic synonyms (e.g. &ldquo;CI/CD Pipelines&rdquo; vs &ldquo;Continuous Delivery&rdquo;) to maximize cosine similarity scores.
              </p>
            </div>
            <div className="rounded-xl bg-black/40 border border-white/10 p-4">
              <div className="text-xl mb-2">2. 📐 Google X-Y-Z Impact Formula</div>
              <h3 className="text-sm font-bold text-white m-0 mb-1">Accomplished [X] by [Y] with [Z]</h3>
              <p className="text-xs text-slate-300 leading-relaxed m-0">
                Replace vague duty descriptions with hard metrics. AI restructures unstructured work notes into concise 1–2 line bullets that immediately prove high return-on-investment to recruiters.
              </p>
            </div>
            <div className="rounded-xl bg-black/40 border border-white/10 p-4">
              <div className="text-xl mb-2">3. ⭐ STAR Behavioral Delivery</div>
              <h3 className="text-sm font-bold text-white m-0 mb-1">Situation, Task, Action, Result</h3>
              <p className="text-xs text-slate-300 leading-relaxed m-0">
                Avoid rambling in behavioral interviews. AI transforms raw anecdotes into concise 90-second narratives that emphasize your personal technical choices, diplomacy, and business outcomes.
              </p>
            </div>
            <div className="rounded-xl bg-black/40 border border-white/10 p-4">
              <div className="text-xl mb-2">4. 🤖 Rigorous Voice Mock Simulations</div>
              <h3 className="text-sm font-bold text-white m-0 mb-1">Bar Raiser Persona Prompts</h3>
              <p className="text-xs text-slate-300 leading-relaxed m-0">
                Practice with low-latency LLM voice agents programmed with realistic grading rubrics. AI tests your technical depth with follow-up probing questions to eliminate fluff and hesitation.
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: CHEAT SHEET SPECS */}
        {activeTab === 'cheat-sheet' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-300 leading-relaxed">
              Key engineering guidelines for crafting ATS-optimized resumes and high-signal interview responses with generative AI:
            </div>
            <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/40">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-slate-400">
                    <th className="p-3 font-bold">Evaluation Parameter</th>
                    <th className="p-3 font-bold">Target Benchmark</th>
                    <th className="p-3 font-bold">Recruiter Rationale &amp; AI Prompt Directive</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="p-3 font-semibold text-white">Bullet Word Count</td>
                    <td className="p-3 text-emerald-300 font-mono">18 – 28 words per bullet</td>
                    <td className="p-3 text-slate-300">Fits cleanly on 1–2 visual lines. Keeps recruiter eye-tracking smooth without cognitive fatigue.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Metric Density</td>
                    <td className="p-3 text-emerald-300 font-mono">&ge; 1 Hard Metric per bullet</td>
                    <td className="p-3 text-slate-300">Quantifies scale ($ revenue, % latency, team size, DAU). Eliminates subjective self-praise.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Action Verb Placement</td>
                    <td className="p-3 text-emerald-300 font-mono">First Word of Every Bullet</td>
                    <td className="p-3 text-slate-300">Strong transitive past-tense verbs (Architected, Spearheaded, Optimized) signal high individual agency.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">ATS Keyword Cosine Similarity</td>
                    <td className="p-3 text-emerald-300 font-mono">&gt; 0.82 Embedding Match</td>
                    <td className="p-3 text-slate-300">Semantic alignment between JD requirements and resume text without spammy exact-string stuffing.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">AI Temperature Setting</td>
                    <td className="p-3 text-emerald-300 font-mono">Temperature = 0.2 – 0.3</td>
                    <td className="p-3 text-slate-300">Low temperature ensures strict factual grounding and prevents AI from hallucinating fake experience.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="text-[11px] text-slate-500 m-0">
          💡 <strong>Key Takeaway:</strong> AI is an impact amplifier, not a fabricator. Use LLMs to structure your real engineering accomplishments into Google X-Y-Z bullets and practice STAR interview simulations before stepping into the room.
        </p>
      </section>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <figure className="m-0 rounded-xl border border-white/10 overflow-hidden">
          <img src="/assets/learning/ai/ai-lesson10-bullet.jpg" alt="Weak resume bullet becoming strong with numbers" loading="lazy" />
        </figure>
        <figure className="m-0 rounded-xl border border-white/10 overflow-hidden">
          <img src="/assets/learning/ai/ai-lesson10-interview.jpg" alt="Job seeker in interview with robot coach" loading="lazy" />
        </figure>
      </div>
      {/* EXPLANATION */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-white mt-0 mb-3">How AI Enhances the Hiring Pipeline for Candidates &amp; Recruiters</h2>
        <ol className="text-sm text-slate-300 leading-relaxed space-y-2.5 list-decimal pl-5 m-0">
          <li>
            <strong className="text-white">Semantic Job Description Extraction:</strong> Large language models ingest 500-word job descriptions, extract the top 10% hard skills (e.g. &ldquo;Distributed Systems&rdquo;, &ldquo;PostgreSQL indexing&rdquo;, &ldquo;GraphQL&rdquo;), and cluster them into essential vs nice-to-have requirements.
          </li>
          <li>
            <strong className="text-white">The Google X-Y-Z Formulation Engine:</strong> AI converts raw, rambling engineering notes into the structured format: &ldquo;Accomplished [X] as measured by [Y], by doing [Z]&rdquo; — highlighting your agency and business metrics.
          </li>
          <li>
            <strong className="text-white">ATS Keyword Density &amp; Format Optimization:</strong> AI ensures clean single-column hierarchy, eliminates unreadable graphics or tables that break ATS parsers, and verifies natural keyword flow.
          </li>
          <li>
            <strong className="text-white">STAR Behavioral Mock Interviewer:</strong> Prompting an LLM with specific evaluation criteria enables realistic voice or text mock sessions where the model diagnoses missing context, passive language, and score-reducing omissions in real time.
          </li>
        </ol>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5 text-center">
          {[
            ['Job Matcher', 'Semantic Parsing', 'Cosine similarity ranking'],
            ['Bullet Polisher', 'Google X-Y-Z', 'Action verbs & metrics'],
            ['STAR Coach', 'Behavioral Framing', '90-sec structured answers'],
            ['Anti-Hallucination', 'Truth-Grounded', 'Zero fake credentials'],
          ].map(([a, b, c]) => (
            <div key={a} className="rounded-xl bg-black/30 border border-white/10 px-2 py-3">
              <div className="text-[11px] text-slate-400 font-semibold">{a}</div>
              <div className="text-sm sm:text-base font-extrabold text-white">{b}</div>
              <div className="text-[10px] text-slate-500 leading-snug">{c}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CODE BLOCK */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-white mt-0 mb-3">Code: Resume Optimizer &amp; Mock Interview Evaluation in Python &amp; JavaScript</h2>
        <p className="text-xs text-slate-400 mt-0 mb-4">
          Automate resume bullet enhancement and build interactive STAR interview evaluation agents programmatically:
        </p>
        <div className="space-y-3">
          <CodeBlock lang="Python (OpenAI / JSON Mode / Prompt Chaining)" code={PY_CODE} />
          <CodeBlock lang="JavaScript (Node.js / OpenAI SDK / STAR Evaluator)" code={JS_CODE} />
        </div>
      </section>

      {/* PRACTICE QUESTIONS */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-white mt-0 mb-1">Practice questions</h2>
        <p className="text-xs text-slate-400 mt-0 mb-4">
          Key questions on how ATS algorithms evaluate applications and how to maximize interview conversion rates with AI.
        </p>
        <div className="space-y-2.5">
          {QUESTIONS.map((it, i) => (
            <details key={i} className="rounded-xl bg-black/30 border border-white/10 px-4 py-1 group">
              <summary className="cursor-pointer text-sm font-semibold text-white py-2.5 list-none flex items-center gap-2">
                <span className="text-emerald-400 text-xs font-bold shrink-0">Q{i + 1}</span>
                {it.q}
              </summary>
              <p className="text-xs text-slate-300 pb-3 pl-8 leading-relaxed m-0">{it.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* INTERVIEW TIPS */}
      <section
        className="rounded-2xl border border-emerald-500/20 p-5 sm:p-6 mb-6"
        style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(17,24,39,0.4))' }}
      >
        <h2 className="text-lg font-bold text-white mt-0 mb-3">💼 Career &amp; Interview Tips</h2>
        <ul className="text-sm text-slate-300 leading-relaxed space-y-2 list-disc pl-5 m-0">
          <li>
            <strong className="text-white">Lead with hard metrics, not adjectives:</strong> Replace &ldquo;Spearheaded a highly successful initiative&rdquo; with &ldquo;Spearheaded a migration cutting AWS compute costs by 31% ($42K/year)&rdquo;. Numbers build instant credibility.
          </li>
          <li>
            <strong className="text-white">Never let AI invent numbers or credentials:</strong> If an interviewer drills into a bullet point you cannot explain with deep technical nuance, it is an instant disqualification. Use AI only to format your real accomplishments.
          </li>
          <li>
            <strong className="text-white">Master the 90-second STAR rule:</strong> Behavioral interview answers should take between 60 to 90 seconds. Spend 15 seconds on Situation/Task, 45 seconds on your concrete Action, and 30 seconds on the Result and learnings.
          </li>
          <li>
            <strong className="text-white">Keep ATS formatting simple:</strong> Avoid multi-column layouts, tables, embedded graphics, or text boxes. Use standard clean headings (Experience, Education, Skills, Projects) with standard UTF-8 bullet characters.
          </li>
          <li>
            <strong className="text-white">Run voice mock practice before real rounds:</strong> Use interactive voice models with prompt personas to rehearse out loud. Practicing verbal cadence eliminates verbal filler (&ldquo;um&rdquo;, &ldquo;like&rdquo;) and builds unshakable confidence.
          </li>
        </ul>
      </section>

      {/* FAQ ACCORDION COMPONENT */}
      <FAQ questions={FAQS} />

      {/* PREV / NEXT NAVIGATION */}
      <div className="flex items-center justify-between flex-wrap gap-3 mt-6">
        <Link to="/learning/ai/voice-and-video-ai" className="text-sm font-semibold text-emerald-300 no-underline hover:text-white transition-colors">
          ← Lesson 9: Voice and Video AI
        </Link>
        <Link to="/learning/ai/ai-for-small-business" className="text-sm font-semibold text-emerald-300 no-underline hover:text-white transition-colors">
          Lesson 11: AI for Small Business →
        </Link>
      </div>
    </>
  )
}
