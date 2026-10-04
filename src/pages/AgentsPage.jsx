import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import FAQ from '../components/FAQ'

const TITLE = 'AI Agents That Do Tasks: How Autonomous AI Plans, Uses Tools & Takes Action'
const DESC = 'Learn how AI Agents work with an interactive step-by-step simulator — see an agent reason (ReAct loop), plan multi-step workflows, call search/database/email tools, and enforce human approval gates. Includes Python & JavaScript code, 5 practice questions, 4 FAQs and interview tips.'
const URL = 'https://www.uptools.in/learning/ai/ai-agents-that-do-tasks/'

// ---------------------------------------------------------------------------
// Sample Task Simulation Steps: Plan a Shop Sale Announcement
// ---------------------------------------------------------------------------
const TASK_PRESETS = [
  {
    id: 'sale-announcement',
    title: '🛍️ Plan Shop Sale Announcement (Flash Weekend Promo)',
    prompt: 'Plan and execute a 30% weekend flash sale announcement for Wireless Pro Earbuds to VIP subscribers.',
    steps: [
      {
        id: 1,
        phase: 'think',
        name: 'Reason & Plan Task',
        icon: '🧠',
        badge: 'Reasoning',
        color: '#3b82f6',
        thought: 'Goal: Announce a 30% discount promo for Wireless Earbuds. I need to verify inventory stock > 100 units, get current pricing margin, draft promotional copy with discount code FLASH30, verify compliance/anti-spam rules, and request approval before broadcasting to 14,000+ customers.',
        tool: null,
        toolCall: null,
        result: 'Plan established: [1] Check Inventory DB -> [2] Draft Copy -> [3] Policy/Spam Scan -> [4] Human Approval -> [5] Broadcast Email & Push.',
        duration: 1200,
      },
      {
        id: 2,
        phase: 'search',
        name: 'Search Inventory & Pricing DB',
        icon: '🔍',
        badge: 'Tool: Database Search',
        color: '#8b5cf6',
        thought: 'Checking database to ensure inventory can satisfy sale demand and margin covers 30% markdown.',
        tool: 'inventory_db.query',
        toolCall: {
          function: 'inventory_db.query',
          args: { sku: 'EARBUD-PRO-BLK', check_stock: true, calculate_margin: true, discount_percent: 30 },
        },
        result: {
          sku: 'EARBUD-PRO-BLK',
          product_name: 'AcousticPro ANC Wireless Earbuds',
          current_stock: 420,
          retail_price: '$69.99',
          sale_price: '$48.99',
          unit_cost: '$24.50',
          gross_margin: '49.9%',
          status: 'STOCK_AVAILABLE_HIGH',
        },
        duration: 1600,
      },
      {
        id: 3,
        phase: 'draft',
        name: 'Draft Marketing Announcement',
        icon: '✍️',
        badge: 'Model Action: Content Gen',
        color: '#06b6d4',
        thought: 'Synthesizing concise, high-converting copy with clear discount codes, expiration timestamps, and stock urgency.',
        tool: 'copywriter_ai.generate',
        toolCall: {
          function: 'copywriter_ai.generate',
          args: {
            channel: 'multichannel_email_push',
            headline: '48-Hour VIP Flash Sale: 30% Off AcousticPro Earbuds',
            coupon_code: 'FLASH30',
            scarcity_note: 'Only 420 units available',
            cta_url: 'https://shop.example.com/deals/earbuds-pro',
          },
        },
        result: {
          subject: '⚡ 48-Hour VIP Sale: 30% Off AcousticPro Earbuds (Code: FLASH30)',
          preview: 'Our highest-rated active noise cancelling earbuds are down to $48.99 this weekend only.',
          body_summary: 'Hi [Name], grab the AcousticPro ANC Earbuds for $48.99 (retail $69.99). Use code FLASH30 at checkout. 420 units available until Sunday midnight.',
          cta_button: 'Claim 30% Discount Now →',
        },
        duration: 1500,
      },
      {
        id: 4,
        phase: 'check',
        name: 'Automated Compliance & Spam Audit',
        icon: '🛡️',
        badge: 'Tool: Compliance Guard',
        color: '#10b981',
        thought: 'Running automated safety checks for CAN-SPAM Act compliance, unsub link verification, price accuracy, and spam filter trigger score.',
        tool: 'compliance_guard.scan',
        toolCall: {
          function: 'compliance_guard.scan',
          args: {
            text_payload: 'Subject + Body + Links',
            target_audience_count: 14250,
            check_unsubscribe_link: true,
            check_ftc_discount_truth: true,
          },
        },
        result: {
          status: 'PASSED_AUDIT',
          spam_score: '0.04 / 10.0 (Very Low Risk)',
          unsubscribe_header_valid: true,
          pricing_verified: '30% matches active coupon rules',
          ftc_clearance: true,
        },
        duration: 1400,
      },
      {
        id: 5,
        phase: 'approval',
        name: 'Human-in-the-Loop Approval Gate',
        icon: '🚦',
        badge: 'Safety Gate: Human Check',
        color: '#f59e0b',
        thought: 'Executing external write operations (sending messages to 14,250 subscribers) carries real business impact. Requesting human operator authorization before proceeding.',
        isGate: true,
        tool: 'security_gate.request_human_approval',
        toolCall: {
          action: 'BROADCAST_EMAIL_PUSH',
          recipients: 14250,
          cost_estimate: '$14.25',
          urgency: 'Medium',
        },
        result: {
          gate_status: 'AWAITING_OR_APPROVED',
          approver: 'Operator / Admin',
          note: 'Requires human confirmation before dispatching write tool calls.',
        },
        duration: 1000,
      },
      {
        id: 6,
        phase: 'send',
        name: 'Send Multi-Channel Broadcast',
        icon: '🚀',
        badge: 'Tool: Communication API',
        color: '#ec4899',
        thought: 'Human authorization confirmed. Invoking Notification Service API to queue batch email and mobile push delivery.',
        tool: 'notification_service.broadcast',
        toolCall: {
          function: 'notification_service.broadcast',
          args: {
            segment: 'vip_customers_tier_1',
            channels: ['email', 'app_push'],
            template_id: 'tmpl_sale_flash30',
            batch_concurrency: 500,
          },
        },
        result: {
          broadcast_id: 'bcast_8921_flash30',
          recipients_reached: 14250,
          delivery_rate: '99.8%',
          delivery_status: 'DELIVERED_SUCCESSFULLY',
          completed_at: '2026-10-04T16:05:00Z',
        },
        duration: 1600,
      },
    ],
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
    q: 'What is an AI Agent and how does it differ from a standard Chatbot or LLM?',
    a: 'A standard Large Language Model (LLM) is passive: it receives a single prompt, predicts the most probable next tokens from training weights, and stops. An AI Agent wraps that model with autonomous reasoning loops (like ReAct), external tools (APIs, calculators, database querying, web search), persistent memory, and decision-making capabilities. Instead of just replying with text, an agent breaks a high-level goal into sub-tasks, invokes tools, observes the results, corrects its plan if an error occurs, and executes actions in the real world.',
  },
  {
    q: 'How does the ReAct (Reason + Act) loop work?',
    a: 'ReAct combines chain-of-thought reasoning with tool execution in an iterative 4-stage cycle: (1) Thought: the model analyzes its goal and previous observations; (2) Action: the model decides which external tool to call (e.g. database_search); (3) Action Input: the model outputs the JSON arguments; (4) Observation: the environment executes the tool and injects the raw result back into the prompt context. The agent repeats this cycle until it has sufficient information to generate its Final Answer or complete the objective.',
  },
  {
    q: 'Why are Human-in-the-Loop (HITL) approval gates necessary in agent workflows?',
    a: 'Autonomous agents can make unexpected errors or misunderstand user intent. Read operations (like searching a wiki or checking inventory) are generally safe to execute automatically. However, sensitive write operations (such as sending emails to thousands of customers, charging credit cards, modifying production databases, or deleting files) require deterministic human approval gates where the agent pauses and asks an operator to confirm the exact payload before firing the irreversible API call.',
  },
  {
    q: 'How do Function Calling and Tool Schemas prevent AI hallucination during API execution?',
    a: 'Modern agent frameworks supply the LLM with structured JSON Schemas defining tool names, descriptions, parameter types, required arguments, and enums. Instead of hallucinating arbitrary code, the model outputs valid JSON conforming strictly to the requested schema. The host runtime parses and validates this JSON before executing the actual function, preventing invalid API calls and syntax errors.',
  },
  {
    q: 'How do you prevent AI agents from getting stuck in infinite loops and exhausting token budgets?',
    a: 'Production agent systems implement several safeguard layers: (1) Hard max-iteration limits (e.g., maximum 8–10 steps per task); (2) Token and wall-clock execution timeouts; (3) Loop detection algorithms that check if identical tool calls and arguments are repeated consecutively; (4) Error handling prompts that instruct the agent to halt and report blockers if a tool fails 3 times in a row; and (5) Idempotency keys on all write actions.',
  },
]

const FAQS = [
  {
    q: 'What is an AI Agent in simple terms?',
    a: 'Think of a standard AI as a smart advisor who only speaks to you in a chat window. An AI Agent is that same smart advisor equipped with hands and a computer: you give it a goal (e.g. "Find high-converting leads and schedule demo calls"), and it autonomously looks up information, writes emails, checks calendars, and completes the entire job step-by-step.',
  },
  {
    q: 'What kinds of tools can an AI agent use?',
    a: 'Any tool with an API or code interface! Common tools include: search engines (Google/Bing), SQL/NoSQL databases, code interpreters (running Python/JavaScript sandbox scripts), email/Slack messaging APIs, web scrapers, file parsers (PDF, Excel), and payment gateways (Stripe).',
  },
  {
    q: 'What is the difference between Single-Agent and Multi-Agent architectures?',
    a: 'In Single-Agent architectures, one model handles planning, tool calling, and output generation. In Multi-Agent architectures (like Orchestrator-Worker or Swarm patterns), specialized agents collaborate: a Planner agent outlines the strategy, a Coder agent writes scripts, a Reviewer agent audits the output, and a Supervisor agent approves the final deliverable.',
  },
  {
    q: 'Are AI Agents safe for production business use?',
    a: 'Yes, when built with proper guardrails: read-only defaults, human-in-the-loop approval gates for financial or communication actions, strict schema validation, rate-limiting, and comprehensive logging of all tool inputs and outputs for auditability.',
  },
]

const PY_CODE = `import json
from typing import Dict, Any

class SimpleAgent:
    """A zero-dependency demonstration of a ReAct Agent loop with tools and Human Approval."""

    def __init__(self, human_approval_enabled: bool = True):
        self.human_approval_enabled = human_approval_enabled
        self.tools = {
            "query_inventory": self._query_inventory,
            "draft_announcement": self._draft_announcement,
            "compliance_check": self._compliance_check,
            "send_broadcast": self._send_broadcast
        }
        self.execution_log = []

    def _query_inventory(self, sku: str) -> Dict[str, Any]:
        return {"sku": sku, "stock": 420, "price": 48.99, "status": "AVAILABLE"}

    def _draft_announcement(self, discount: int, code: str) -> Dict[str, Any]:
        return {"subject": f"⚡ VIP Sale: {discount}% Off with code {code}", "chars": 128}

    def _compliance_check(self, subject: str) -> Dict[str, Any]:
        return {"spam_score": 0.02, "compliant": True}

    def _send_broadcast(self, audience: str, channel: str) -> Dict[str, Any]:
        return {"status": "SUCCESS", "delivered_count": 14250}

    def run_plan(self, goal: str):
        print(f"🎯 Agent Goal: {goal}")
        steps = [
            ("query_inventory", {"sku": "EARBUD-PRO"}),
            ("draft_announcement", {"discount": 30, "code": "FLASH30"}),
            ("compliance_check", {"subject": "⚡ VIP Sale"}),
            ("send_broadcast", {"audience": "vip_customers", "channel": "email"}),
        ]

        for step_idx, (tool_name, args) in enumerate(steps, 1):
            print(f"\\n--- Step {step_idx}: Executing {tool_name} ---")
            
            # Check Human Approval Gate for sensitive write actions
            if tool_name == "send_broadcast" and self.human_approval_enabled:
                print("🚦 [GATE] Human approval required before broadcasting!")
                approved = input("Approve dispatch to 14,250 users? (y/n): ").strip().lower() == "y"
                if not approved:
                    print("❌ Action rejected by operator. Halting workflow.")
                    return False

            # Execute tool call
            tool_fn = self.tools[tool_name]
            result = tool_fn(**args)
            self.execution_log.append({"step": step_idx, "tool": tool_name, "result": result})
            print(f"✓ Observation: {json.dumps(result)}")

        print("\\n✅ All planned tasks completed successfully!")
        return True

# Example Execution
agent = SimpleAgent(human_approval_enabled=True)
agent.run_plan("Announce 30% weekend sale to VIP customers")`

const JS_CODE = `class AutonomousTaskAgent {
  constructor(options = { requireHumanApproval: true }) {
    this.requireHumanApproval = options.requireHumanApproval;
    this.tools = new Map();
    this.registerDefaultTools();
  }

  registerTool(name, description, fn) {
    this.tools.set(name, { description, fn });
  }

  registerDefaultTools() {
    this.registerTool('inventory_db', async (sku) => ({
      sku,
      stock: 420,
      price: '$48.99',
      margin: '49.9%'
    }));

    this.registerTool('copywriter', async (params) => ({
      headline: \`⚡ \${params.discount}% Off VIP Sale\`,
      coupon: params.code
    }));

    this.registerTool('compliance_guard', async () => ({
      spamScore: 0.04,
      passed: true
    }));

    this.registerTool('send_broadcast', async (payload) => ({
      dispatched: true,
      recipients: 14250,
      status: 'DELIVERED_SUCCESSFULLY'
    }));
  }

  async executeTask(taskGoal, onApprovalCallback) {
    console.log(\`🤖 Starting Autonomous Workflow: "\${taskGoal}"\`);
    
    const steps = [
      { tool: 'inventory_db', args: 'EARBUD-PRO-BLK', sensitive: false },
      { tool: 'copywriter', args: { discount: 30, code: 'FLASH30' }, sensitive: false },
      { tool: 'compliance_guard', args: {}, sensitive: false },
      { tool: 'send_broadcast', args: { segment: 'vip' }, sensitive: true }
    ];

    const history = [];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      console.log(\`[Step \${i + 1}] Invoking tool: \${step.tool}...\`);

      // Human-in-the-Loop Safety Gate
      if (step.sensitive && this.requireHumanApproval) {
        console.log('🚦 Action is sensitive. Pausing for human authorization...');
        const isApproved = onApprovalCallback ? await onApprovalCallback(step) : true;
        if (!isApproved) {
          throw new Error('Task halted: Operator rejected sensitive action.');
        }
      }

      const toolEntry = this.tools.get(step.tool);
      const observation = await toolEntry.fn(step.args);
      history.push({ step: i + 1, tool: step.tool, observation });
    }

    console.log('🎉 Task complete!');
    return history;
  }
}

// Example instantiation
const agent = new AutonomousTaskAgent({ requireHumanApproval: true });
// agent.executeTask('Launch Flash Promo', async () => window.confirm('Approve broadcast?'));`

export default function AgentsPage() {
  const [activeTab, setActiveTab] = useState('simulator') // 'simulator' | 'react_loop' | 'architecture'
  const [approvalGateEnabled, setApprovalGateEnabled] = useState(true)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [humanApprovalState, setHumanApprovalState] = useState('pending') // 'pending' | 'approved' | 'rejected'
  const [activeStepTab, setActiveStepTab] = useState('overview') // 'overview' | 'payload' | 'result'
  const timerRef = useRef(null)

  const currentTask = TASK_PRESETS[0]
  const steps = currentTask.steps
  const activeStep = steps[currentStepIndex] || steps[0]
  const isCompleted = currentStepIndex >= steps.length - 1 && humanApprovalState === 'approved'

  // Auto-play state machine runner
  useEffect(() => {
    if (isPlaying) {
      const step = steps[currentStepIndex]
      // If we reach the approval gate and gate is enabled and not approved yet -> pause and wait for user
      if (step && step.isGate && approvalGateEnabled && humanApprovalState === 'pending') {
        setIsPlaying(false)
        return
      }

      if (currentStepIndex < steps.length - 1) {
        timerRef.current = setTimeout(() => {
          setCurrentStepIndex(prev => prev + 1)
        }, step?.duration || 1400)
      } else {
        setIsPlaying(false)
      }
    }
    return () => clearTimeout(timerRef.current)
  }, [isPlaying, currentStepIndex, steps, approvalGateEnabled, humanApprovalState])

  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextIdx = currentStepIndex + 1
      const nextStep = steps[nextIdx]
      if (nextStep && nextStep.isGate && approvalGateEnabled && humanApprovalState === 'pending') {
        setCurrentStepIndex(nextIdx)
        setIsPlaying(false)
      } else {
        setCurrentStepIndex(nextIdx)
      }
    }
  }

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentStepIndex(0)
    setHumanApprovalState('pending')
  }

  const handleApprove = () => {
    setHumanApprovalState('approved')
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1)
      setIsPlaying(true)
    }
  }

  const handleReject = () => {
    setHumanApprovalState('rejected')
    setIsPlaying(false)
  }

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
    name: 'How AI Agents Plan and Execute Tasks Step-by-Step',
    step: [
      {
        '@type': 'HowToStep',
        text: 'Goal Definition & Reasoning: The user provides an objective, and the agent reasons to break it down into sequential sub-tasks.',
      },
      {
        '@type': 'HowToStep',
        text: 'Tool Selection & Function Calling: The agent selects the appropriate tool (DB query, web search, code interpreter) and formats structured JSON parameters.',
      },
      {
        '@type': 'HowToStep',
        text: 'Observation & Synthesis: The environment executes the tool and injects the observation into the context for the next reasoning step.',
      },
      {
        '@type': 'HowToStep',
        text: 'Human-in-the-Loop Approval: For sensitive write actions (emails, payments, database updates), the agent pauses for human verification.',
      },
      {
        '@type': 'HowToStep',
        text: 'Execution & Final Answer: The agent dispatches final actions and returns a verified completion summary to the user.',
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
        <meta property="og:image" content="https://www.uptools.in/assets/learning/ai/ai-lesson7-hero.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${TITLE} | UpTools`} />
        <meta name="twitter:description" content={DESC} />
        <meta name="twitter:image" content="https://www.uptools.in/assets/learning/ai/ai-lesson7-hero.jpg" />
        <meta
          name="keywords"
          content="AI agents explained, ReAct agent loop, autonomous AI tutorial, function calling AI, human in the loop AI, LLM tools, agentic workflows, Python AI agent code"
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
              { '@type': 'ListItem', position: 4, name: 'AI Agents That Do Tasks', item: URL },
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
        <span className="text-slate-300 font-medium">AI Agents That Do Tasks</span>
      </nav>

      {/* BADGE & HEADER */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/30 text-blue-300 mb-4">
        <span>🤖</span> AI · Lesson 7 · Beginner
      </div>
      <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight m-0 mb-3">
        AI Agents That Do Tasks: How Autonomous AI Plans, Uses Tools &amp; Takes Action
      </h1>
      <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-3xl">
        Standard AI only chats. <strong>AI Agents take action</strong>: they break complex goals into sub-tasks, reason through steps using the <strong>ReAct (Reason + Act) loop</strong>, call APIs and search databases, and pause for human approval before critical operations. Watch the live interactive agent simulator below to see an agent plan and execute a real-world shop sale announcement step-by-step.
 </p>
 <figure className="m-0 mb-6 rounded-xl border border-white/10 overflow-hidden">
 <img src="/assets/learning/ai/ai-lesson7-hero.jpg" alt="Robot agent working through a task checklist with tool icons" loading="lazy" />
 </figure>

 {/* LIVE INTERACTIVE ANIMATOR */}
      <section
        className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6"
        aria-label="Live AI Agent Task Planning and Tool Execution Simulator"
      >
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-white m-0">▶ Live Demo: Autonomous Task Execution &amp; Tool Calling Simulator</h2>
            <p className="text-xs text-slate-400 m-0 mt-0.5">
              Watch an agent plan, query inventory, draft copy, audit compliance, and request human clearance to broadcast.
            </p>
          </div>
          <div className="flex rounded-xl bg-black/40 border border-white/10 p-1">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-all ${
                activeTab === 'simulator' ? 'bg-blue-500/30 text-blue-300' : 'text-slate-400 bg-transparent hover:text-white'
              }`}
            >
              🤖 Live Agent Flow
            </button>
            <button
              onClick={() => setActiveTab('react_loop')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-all ${
                activeTab === 'react_loop' ? 'bg-blue-500/30 text-blue-300' : 'text-slate-400 bg-transparent hover:text-white'
              }`}
            >
              🔄 The ReAct Loop
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-all ${
                activeTab === 'architecture' ? 'bg-blue-500/30 text-blue-300' : 'text-slate-400 bg-transparent hover:text-white'
              }`}
            >
              🛡️ Safety &amp; Guardrails
            </button>
          </div>
        </div>

        {/* TAB 1: INTERACTIVE SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="space-y-4">
            {/* CONTROL TOOLBAR & HUMAN APPROVAL TOGGLE */}
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Assigned Autonomous Task Goal:
                  </label>
                  <div className="text-xs sm:text-sm font-semibold text-white flex items-center gap-2">
                    <span className="text-base">🎯</span> &ldquo;{currentTask.prompt}&rdquo;
                  </div>
                </div>

                {/* PLAY / STEP / RESET CONTROLS & TOGGLE */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Human-in-the-loop toggle */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs">
                    <span className="text-[11px] font-medium text-slate-300">Human Approval Gate:</span>
                    <button
                      onClick={() => setApprovalGateEnabled(prev => !prev)}
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border-0 cursor-pointer transition-all ${
                        approvalGateEnabled
                          ? 'bg-emerald-500 text-slate-950 font-extrabold'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {approvalGateEnabled ? 'ON (Safe)' : 'OFF (Full Auto)'}
                    </button>
                  </div>

                  {/* Play / Pause */}
                  <button
                    onClick={() => setIsPlaying(p => !p)}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs border-0 cursor-pointer transition-all flex items-center gap-1.5 shadow-sm shadow-blue-500/30"
                  >
                    {isPlaying ? '⏸ Pause' : '▶ Play Auto'}
                  </button>

                  {/* Step Forward */}
                  <button
                    onClick={handleStepForward}
                    disabled={currentStepIndex >= steps.length - 1}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs border border-white/10 cursor-pointer transition-all"
                  >
                    ⏭ Step Next
                  </button>

                  {/* Reset */}
                  <button
                    onClick={handleReset}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-semibold text-xs border border-white/10 cursor-pointer transition-all"
                  >
                    ↺ Reset
                  </button>
                </div>
              </div>
            </div>

            {/* STEP PROGRESS BAR */}
            <div className="rounded-xl border border-white/10 bg-slate-950/70 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>📊</span> Execution Pipeline Trace:
                </span>
                <span className="text-xs font-mono text-blue-400 font-bold">
                  Step {currentStepIndex + 1} of {steps.length}
                </span>
              </div>

              {/* Step pills line */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {steps.map((st, idx) => {
                  const isCurrent = idx === currentStepIndex
                  const isPast = idx < currentStepIndex
                  const isFuture = idx > currentStepIndex

                  return (
                    <button
                      key={st.id}
                      onClick={() => {
                        setIsPlaying(false)
                        setCurrentStepIndex(idx)
                      }}
                      className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-blue-500/20 border-blue-400 ring-2 ring-blue-400/40 shadow-sm shadow-blue-500/20'
                          : isPast
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : 'bg-white/[0.02] border-white/5 text-slate-500 opacity-60 hover:opacity-90'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                        <span>{st.icon} Step {st.id}</span>
                        {isPast && <span className="text-emerald-400">✓ Done</span>}
                        {isCurrent && <span className="text-blue-300 animate-pulse">● Active</span>}
                        {isFuture && <span className="text-slate-600">Pending</span>}
                      </div>
                      <div className="text-[11px] font-bold text-white truncate">{st.name}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* TWO-COLUMN DISPLAY: ACTIVE STEP DETAILS & LIVE TERMINAL LOG */}
            <div className="grid lg:grid-cols-12 gap-4">
              {/* LEFT: STEP REASONING, ACTION & TOOL CALL INSPECTOR */}
              <div className="lg:col-span-7 rounded-xl border border-white/10 bg-slate-950/80 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{activeStep.icon}</span>
                      <div>
                        <h3 className="text-sm font-bold text-white m-0 leading-tight">{activeStep.name}</h3>
                        <span className="text-[10px] font-mono text-slate-400">{activeStep.badge}</span>
                      </div>
                    </div>

                    <div className="flex gap-1 text-[10px]">
                      <button
                        onClick={() => setActiveStepTab('overview')}
                        className={`px-2 py-0.5 rounded border cursor-pointer ${
                          activeStepTab === 'overview'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-400'
                            : 'bg-transparent text-slate-400 border-white/10 hover:text-white'
                        }`}
                      >
                        Thought &amp; Output
                      </button>
                      {activeStep.toolCall && (
                        <button
                          onClick={() => setActiveStepTab('payload')}
                          className={`px-2 py-0.5 rounded border cursor-pointer ${
                            activeStepTab === 'payload'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-400'
                              : 'bg-transparent text-slate-400 border-white/10 hover:text-white'
                          }`}
                        >
                          Tool Call Payload
                        </button>
                      )}
                    </div>
                  </div>

                  {/* THOUGHT BUBBLE */}
                  <div className="rounded-xl bg-blue-500/10 border border-blue-500/30 p-3 mb-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-blue-300 mb-1 flex items-center gap-1.5">
                      <span>💭</span> Agent Reasoning (Thought):
                    </div>
                    <p className="text-xs text-blue-100 leading-relaxed m-0 italic">
                      &ldquo;{activeStep.thought}&rdquo;
                    </p>
                  </div>

                  {/* TAB CONTENT */}
                  {activeStepTab === 'overview' && (
                    <div className="space-y-3">
                      {/* Tool call badge */}
                      {activeStep.tool && (
                        <div className="rounded-lg bg-black/50 border border-white/10 p-2.5 text-xs">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                            External Tool Dispatched:
                          </span>
                          <span className="font-mono text-purple-300 font-bold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                            {activeStep.tool}()
                          </span>
                        </div>
                      )}

                      {/* Tool Output / Observation */}
                      <div className="rounded-lg bg-black/60 border border-white/10 p-3">
                        <div className="text-[10px] font-bold text-emerald-400 uppercase mb-1 flex items-center justify-between">
                          <span>Observation / Result:</span>
                          <span className="text-slate-500 font-mono text-[9px]">200 OK</span>
                        </div>
                        {typeof activeStep.result === 'string' ? (
                          <div className="text-xs text-slate-200 leading-relaxed font-mono">
                            {activeStep.result}
                          </div>
                        ) : (
                          <pre className="m-0 text-[11px] font-mono text-emerald-300 overflow-x-auto leading-tight">
                            {JSON.stringify(activeStep.result, null, 2)}
                          </pre>
                        )}
                      </div>
                    </div>
                  )}

                  {activeStepTab === 'payload' && activeStep.toolCall && (
                    <div className="rounded-lg bg-black/60 border border-white/10 p-3">
                      <div className="text-[10px] font-bold text-purple-400 uppercase mb-1">
                        Structured Function Call (JSON Arguments):
                      </div>
                      <pre className="m-0 text-[11px] font-mono text-purple-200 overflow-x-auto leading-tight">
                        {JSON.stringify(activeStep.toolCall, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* HUMAN APPROVAL GATE BANNER (IF ACTIVE STEP IS GATE) */}
                  {activeStep.isGate && (
                    <div className="mt-3 p-3.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-amber-300 flex items-center gap-1.5">
                          <span>🚦</span> Human Authorization Gate
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            humanApprovalState === 'approved'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : humanApprovalState === 'rejected'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                          }`}
                        >
                          {humanApprovalState === 'approved'
                            ? 'Approved ✓'
                            : humanApprovalState === 'rejected'
                            ? 'Rejected ✗'
                            : 'Awaiting Operator Approval'}
                        </span>
                      </div>

                      <p className="text-slate-300 text-[11px] leading-relaxed m-0 mb-3">
                        The agent wants to broadcast to <strong>14,250 subscribers</strong>. High-impact write actions require explicit operator sign-off before dispatching live notifications.
                      </p>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleApprove}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs border-0 cursor-pointer transition-all flex items-center gap-1 shadow-sm"
                        >
                          ✓ Approve &amp; Dispatch Broadcast
                        </button>
                        <button
                          onClick={handleReject}
                          className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-semibold text-xs border border-rose-500/30 cursor-pointer transition-all"
                        >
                          ✕ Reject / Abort Action
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                  <span>
                    Status:{' '}
                    <strong
                      className={
                        isCompleted
                          ? 'text-emerald-400'
                          : activeStep.isGate && humanApprovalState === 'pending'
                          ? 'text-amber-400'
                          : 'text-blue-400'
                      }
                    >
                      {isCompleted
                        ? 'Task 100% Completed'
                        : activeStep.isGate && humanApprovalState === 'pending'
                        ? 'Paused at Safety Gate'
                        : 'Executing Step in ReAct Loop'}
                    </strong>
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Step {currentStepIndex + 1} of {steps.length}
                  </span>
                </div>
              </div>

              {/* RIGHT: LIVE AGENT LOG TERMINAL */}
              <div className="lg:col-span-5 rounded-xl border border-white/10 bg-black/80 p-4 flex flex-col justify-between font-mono text-xs">
                <div>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                    <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Agent Execution Trace &amp; Log
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">runtime: v2.4</span>
                  </div>

                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 text-[11px]">
                    {steps.slice(0, currentStepIndex + 1).map((st, idx) => (
                      <div
                        key={st.id}
                        className={`p-2 rounded border ${
                          idx === currentStepIndex
                            ? 'bg-blue-500/10 border-blue-500/30 text-blue-200'
                            : 'bg-white/[0.02] border-white/5 text-slate-400'
                        }`}
                      >
                        <div className="text-[10px] font-bold text-slate-300 mb-0.5">
                          [{st.id}/{steps.length}] {st.phase.toUpperCase()} : {st.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {st.tool ? `tool: ${st.tool}()` : 'action: internal_planning'}
                        </div>
                        <div className="text-[10px] text-emerald-400 truncate mt-0.5">
                          ✓ {typeof st.result === 'string' ? st.result : 'Execution finished'}
                        </div>
                      </div>
                    ))}

                    {currentStepIndex === steps.length - 1 && humanApprovalState === 'approved' && (
                      <div className="p-2 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-[11px]">
                        🎉 WORKFLOW FINISHED: Sale announced to 14,250 users. 0 errors encountered.
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-white/10 text-[10px] text-slate-500 flex items-center justify-between">
                  <span>ReAct Loop Engine</span>
                  <span>Safety: Enforced</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: REACT LOOP EXPLANATION */}
        {activeTab === 'react_loop' && (
          <div className="rounded-xl border border-white/10 bg-black/30 p-5 mb-4">
            <h3 className="text-sm font-bold text-white mb-2">🔄 The ReAct (Reason + Act) Loop Explained</h3>
            <p className="text-xs text-slate-300 mb-5 leading-relaxed">
              Modern AI agents use the <strong>ReAct prompting framework</strong> (Reasoning + Acting) to solve complex goals. Instead of hallucinating answers, the agent continuously loops through 4 distinct phases:
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  step: '01',
                  title: 'Thought (Reasoning)',
                  icon: '🧠',
                  color: 'border-blue-500/30 bg-blue-500/[0.04]',
                  text: 'The model analyzes the user goal, current state, and past observations. It determines what missing data is needed to proceed.',
                },
                {
                  step: '02',
                  title: 'Action (Tool Choice)',
                  icon: '⚡',
                  color: 'border-purple-500/30 bg-purple-500/[0.04]',
                  text: 'The model outputs a specific tool name (e.g. database_search, web_scraper) to retrieve data or execute an action in the environment.',
                },
                {
                  step: '03',
                  title: 'Action Input (Payload)',
                  icon: '📦',
                  color: 'border-cyan-500/30 bg-cyan-500/[0.04]',
                  text: 'The agent formats strict JSON arguments (e.g. { "sku": "EARBUD-PRO" }) conforming to the tool’s predefined JSON Schema.',
                },
                {
                  step: '04',
                  title: 'Observation (Feedback)',
                  icon: '🔍',
                  color: 'border-emerald-500/30 bg-emerald-500/[0.04]',
                  text: 'The runtime executes the tool, returns the real-world output, and appends it to the prompt context. The agent loops back to Step 1.',
                },
              ].map(st => (
                <div key={st.step} className={`p-4 rounded-xl border ${st.color} flex flex-col justify-between`}>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{st.icon}</span>
                      <span className="text-xs font-mono font-extrabold text-slate-400">PHASE {st.step}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white mb-1.5">{st.title}</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed m-0">{st.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SAFETY GUARDRAILS & ARCHITECTURES */}
        {activeTab === 'architecture' && (
          <div className="rounded-xl border border-white/10 bg-black/30 p-5 mb-4">
            <h3 className="text-sm font-bold text-white mb-2">🛡️ Production Agent Safety Guardrails</h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Autonomous agents can fail or enter infinite loops without defensive architecture. Essential safeguards for real-world deployment:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-white/15 bg-white/5">
                    <th className="p-3 text-white font-bold">Safety Guardrail</th>
                    <th className="p-3 text-blue-300 font-bold">How It Protects Production</th>
                    <th className="p-3 text-emerald-300 font-bold">Best Practice Implementation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="p-3 font-semibold text-white">Human-in-the-Loop (HITL) Gate</td>
                    <td className="p-3 text-slate-300">Stops unauthorized emails, financial charges, or database deletions.</td>
                    <td className="p-3 text-emerald-300">Categorize tools as READ (auto) vs WRITE (require operator approval).</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Loop &amp; Budget Limits</td>
                    <td className="p-3 text-slate-300">Prevents runaway API bills and infinite recursion loops.</td>
                    <td className="p-3 text-emerald-300">Hard cap at 8–10 iterations and enforce token/cost budgets.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">JSON Schema Validation</td>
                    <td className="p-3 text-slate-300">Prevents hallucinated arguments or malformed API payloads.</td>
                    <td className="p-3 text-emerald-300">Validate tool inputs with Pydantic / Zod before invoking functions.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Idempotency Keys</td>
                    <td className="p-3 text-slate-300">Ensures retried network calls never execute duplicate charges or posts.</td>
                    <td className="p-3 text-emerald-300">Attach unique UUID idempotency keys to all write operations.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="text-[11px] text-slate-500 m-0">
          💡 <strong>Key Takeaway:</strong> A raw LLM generates text. An AI Agent uses that text to reason, invoke tools, inspect real-world outputs, and accomplish multi-step objectives autonomously with safety oversight.
        </p>
      </section>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <figure className="m-0 rounded-xl border border-white/10 overflow-hidden">
          <img src="/assets/learning/ai/ai-lesson7-loop.jpg" alt="Agent loop: think, act, observe, repeat" loading="lazy" />
        </figure>
        <figure className="m-0 rounded-xl border border-white/10 overflow-hidden">
          <img src="/assets/learning/ai/ai-lesson7-approval.jpg" alt="Agent pausing for human approval with checklist done" loading="lazy" />
        </figure>
      </div>
      {/* EXPLANATION */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-white mt-0 mb-3">How AI Agents Transform Language Models into Autonomous Workers</h2>
        <ol className="text-sm text-slate-300 leading-relaxed space-y-2.5 list-decimal pl-5 m-0">
          <li>
            <strong className="text-white">Planning and Goal Decomposition:</strong> High-level instructions (e.g. &ldquo;Plan our summer sale&rdquo;) are broken down into ordered, manageable sub-tasks.
          </li>
          <li>
            <strong className="text-white">Tool Calling (Function Invocation):</strong> Agents connect to external software — querying SQL databases, searching the web, executing code, or triggering notification APIs.
          </li>
          <li>
            <strong className="text-white">Self-Correction &amp; Observation:</strong> If a tool returns an error (e.g. &ldquo;Out of stock&rdquo;), the agent observes the failure and dynamically adjusts its plan.
          </li>
          <li>
            <strong className="text-white">Human Approval Gates:</strong> Dangerous or high-impact actions (sending messages, payments, deleting data) require operator authorization before firing.
          </li>
        </ol>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5 text-center">
          {[
            ['Goal Planning', 'Multi-step decomposition', 'ReAct reasoning loop'],
            ['Tool Calling', 'Structured JSON schemas', 'Database & API actions'],
            ['Self-Correction', 'Observation feedback', 'Dynamic error recovery'],
            ['Human Gate', 'HITL approval checks', 'Zero unauthorized writes'],
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
        <h2 className="text-lg font-bold text-white mt-0 mb-3">Code: Complete ReAct Agent with Tool Calling &amp; Approval Gate</h2>
        <p className="text-xs text-slate-400 mt-0 mb-4">
          A clean, zero-dependency implementation of an autonomous agent execution loop with tool registry, observation injection, and a human approval gate. Copy and run in Python or JavaScript:
        </p>
        <div className="space-y-3">
          <CodeBlock lang="Python" code={PY_CODE} />
          <CodeBlock lang="JavaScript" code={JS_CODE} />
        </div>
      </section>

      {/* PRACTICE QUESTIONS */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-white mt-0 mb-1">Practice questions</h2>
        <p className="text-xs text-slate-400 mt-0 mb-4">
          The questions interviewers and engineering teams ask about AI Agents, tool calling protocols, and safety. Tap to reveal the answer.
        </p>
        <div className="space-y-2.5">
          {QUESTIONS.map((it, i) => (
            <details key={i} className="rounded-xl bg-black/30 border border-white/10 px-4 py-1 group">
              <summary className="cursor-pointer text-sm font-semibold text-white py-2.5 list-none flex items-center gap-2">
                <span className="text-blue-400 text-xs font-bold shrink-0">Q{i + 1}</span>
                {it.q}
              </summary>
              <p className="text-xs text-slate-300 pb-3 pl-8 leading-relaxed m-0">{it.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* INTERVIEW TIPS */}
      <section
        className="rounded-2xl border border-blue-500/20 p-5 sm:p-6 mb-6"
        style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(17,24,39,0.4))' }}
      >
        <h2 className="text-lg font-bold text-white mt-0 mb-3">🎤 Interview tips</h2>
        <ul className="text-sm text-slate-300 leading-relaxed space-y-2 list-disc pl-5 m-0">
          <li>
            <strong className="text-white">Differentiate LLM vs Agent cleanly:</strong> &ldquo;An LLM is a reasoning engine. An Agent is that reasoning engine equipped with planning memory, tools/APIs to take action in the environment, and a loop to observe results.&rdquo;
          </li>
          <li>
            <strong className="text-white">Explain the ReAct Loop by heart:</strong> &ldquo;Thought (reason about current state) → Action (select tool) → Action Input (format JSON parameters) → Observation (parse tool execution output) → Repeat until Final Answer.&rdquo;
          </li>
          <li>
            <strong className="text-white">Emphasize Safety &amp; Human-in-the-Loop (HITL):</strong> &ldquo;Never allow autonomous agents to execute destructive or external write actions (e.g., payments, email blasts, DB deletions) without a deterministic operator approval gate.&rdquo;
          </li>
          <li>
            <strong className="text-white">Discuss Idempotency and Loop Guardrails:</strong> &ldquo;Always implement maximum iteration caps (e.g. 10 steps), token timeouts, loop-detection filters, and idempotency keys on write endpoints to prevent duplicate charges or infinite loops.&rdquo;
          </li>
          <li>
            <strong className="text-white">Explain Multi-Agent Orchestration:</strong> &ldquo;In multi-agent systems, we separate concerns: an Orchestrator/Supervisor agent delegates to specialized worker agents (e.g. Researcher, Coder, Reviewer) and aggregates their verified observations.&rdquo;
          </li>
        </ul>
      </section>

      {/* FAQ ACCORDION COMPONENT */}
      <FAQ questions={FAQS} />

      {/* PREV / NEXT NAVIGATION */}
      <div className="flex items-center justify-between flex-wrap gap-3 mt-6">
        <Link to="/learning/ai/rag-chat-with-documents" className="text-sm font-semibold text-blue-300 no-underline hover:text-white transition-colors">
          ← Lesson 6: Chat With Your Documents (RAG)
        </Link>
        <Link to="/learning/ai/image-generation-basics" className="text-sm font-semibold text-blue-300 no-underline hover:text-white transition-colors">
          Lesson 8: Image Generation Basics →
        </Link>
      </div>
    </>
  )
}
