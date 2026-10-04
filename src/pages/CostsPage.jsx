import { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import FAQ from '../components/FAQ'

const TITLE = 'AI Costs and Tokens: How AI Pricing Works & Monthly Budget Planner'
const DESC = 'Master AI token economics and API pricing with a live token counter & cost calculator in Indian Rupees (₹) across 3 model tiers, plus an interactive monthly budget planner slider. Explore input vs output pricing, prompt caching, tiered model routing, Python & JavaScript cost estimators, 5 practice questions, and 4 FAQs.'
const URL = 'https://www.uptools.in/learning/ai/ai-costs-and-tokens/'
const USD_TO_INR = 86.5

// ---------------------------------------------------------------------------
// Model Tiers Definition (Standard 2026 Industry Pricing per 1M Tokens)
// ---------------------------------------------------------------------------
const MODEL_TIERS = {
  fast: {
    id: 'fast',
    name: 'Tier 1: Fast & Ultra-Budget',
    models: 'GPT-4o-mini / Gemini 2.0 Flash / Claude 3.5 Haiku',
    accentColor: '#10b981',
    inputPer1M: 0.15, // $0.15
    outputPer1M: 0.60, // $0.60
    cachedInputPer1M: 0.075,
    speedLatency: '150 – 350 ms',
    bestFor: 'High-volume chatbots, classification, data extraction, translation, simple summaries',
  },
  flagship: {
    id: 'flagship',
    name: 'Tier 2: Flagship & Standard',
    models: 'GPT-4o / Claude 3.5 Sonnet / Gemini 1.5 Pro',
    accentColor: '#38bdf8',
    inputPer1M: 2.50, // $2.50
    outputPer1M: 10.00, // $10.00
    cachedInputPer1M: 1.25,
    speedLatency: '600 – 1,400 ms',
    bestFor: 'Complex code generation, nuanced reasoning, multi-document synthesis, legal analysis',
  },
  reasoning: {
    id: 'reasoning',
    name: 'Tier 3: Deep Reasoning & Heavy',
    models: 'OpenAI o1 & o3-mini / Claude 3.7 Sonnet (Thinking)',
    accentColor: '#a855f7',
    inputPer1M: 15.00, // $15.00
    outputPer1M: 60.00, // $60.00
    cachedInputPer1M: 7.50,
    speedLatency: '2,500 – 12,000 ms',
    bestFor: 'Mathematical proofs, multi-step algorithm design, competitive coding, deep research',
  },
}

// ---------------------------------------------------------------------------
// Sample Prompt Presets for Tokenizer
// ---------------------------------------------------------------------------
const TOKEN_PRESETS = [
  {
    id: 'support-chat',
    name: '💬 Customer Support Chat',
    category: 'Conversational Bot',
    text: 'Customer: "Hi, my order #UP-98421 was supposed to be delivered yesterday in Bengaluru, but the tracking page still says in-transit. Can you please check if it is out for delivery today and update my contact number to +91 98765 43210?"\n\nSystem: You are an empathetic logistics support agent for FastKart India. Verify order status from database, explain any courier delay politely, and confirm contact number updates.',
  },
  {
    id: 'rag-chunk',
    name: '📄 RAG Context & Code Review',
    category: 'Technical Context',
    text: 'def calculate_portfolio_var(weights: np.ndarray, cov_matrix: np.ndarray, confidence_level: float = 0.95) -> float:\n    """Calculates Value at Risk (VaR) using parametric variance-covariance methodology for equity portfolios."""\n    portfolio_variance = np.dot(weights.T, np.dot(cov_matrix, weights))\n    portfolio_stdev = np.sqrt(portfolio_variance)\n    z_score = stats.norm.ppf(confidence_level)\n    return float(z_score * portfolio_stdev)',
  },
  {
    id: 'multilingual-hindi',
    name: '🇮🇳 Multilingual & Indic Prompt',
    category: 'Indic / Non-Latin Tokens',
    text: 'नमस्ते! क्या आप मुझे बता सकते हैं कि 2026 के नए इनकम टैक्स स्लैब में ₹15,00,000 की वार्षिक आय पर कुल कितना टैक्स और सेस लगेगा? कृपया स्टैंडर्ड डिडक्शन ₹75,000 शामिल करके गणना समझाएं।',
  },
  {
    id: 'system-agent',
    name: '🤖 Autonomous Agent Prompt',
    category: 'Complex Structured Prompt',
    text: 'SYSTEM PROMPT:\nYou are an autonomous financial analysis agent with access to sql_query, web_search, and generate_chart tools.\n\nCRITICAL CONSTRAINTS:\n1. Never guess stock prices or earnings numbers.\n2. Always verify company ticker on NSE/BSE before executing database joins.\n3. Output final financial comparisons in strictly formatted markdown tables with currency notation in INR (₹).',
  },
]

// ---------------------------------------------------------------------------
// Approximate BPE Tokenizer for Demonstration & Visual Highlighting
// ---------------------------------------------------------------------------
const TOKEN_BG_COLORS = [
  'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'bg-sky-500/20 text-sky-300 border-sky-500/30',
  'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'bg-rose-500/20 text-rose-300 border-rose-500/30',
  'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
]

function tokenizeText(str) {
  if (!str) return []
  // Regex splitting by words, whitespace, symbols, non-ASCII multi-byte clusters
  // Simulates subword BPE tokenization chunks for visualization
  const pattern = /[\p{L}\p{N}]+|[^\s\p{L}\p{N}]+|\s+/gu
  const rawTokens = []
  let match

  while ((match = pattern.exec(str)) !== null) {
    const chunk = match[0]
    // Sub-divide long words into ~3-4 char subwords to reflect Byte-Pair Encoding
    if (chunk.length > 5 && /^[\p{L}\p{N}]+$/u.test(chunk)) {
      let i = 0
      while (i < chunk.length) {
        const sliceLen = Math.min(chunk.length - i, i === 0 ? 4 : 3)
        rawTokens.push(chunk.slice(i, i + sliceLen))
        i += sliceLen
      }
    } else {
      rawTokens.push(chunk)
    }
  }
  return rawTokens
}

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
    q: 'What is an AI token, and why do LLM providers bill by tokens instead of words or characters?',
    a: 'A token is the fundamental atomic unit of text processed by Large Language Models (LLMs). Neural networks cannot directly understand raw letters or sentences; instead, a Byte-Pair Encoding (BPE) tokenizer converts text into numerical token IDs. In English, 1 token roughly corresponds to 4 characters or ~0.75 words (e.g. "automation" is 1 token, while "unbelievable" is split into "un", "believ", "able"). Providers bill by tokens because GPU compute time, KV-cache memory consumption, and transformer matrix multiplications scale directly with the exact sequence length of input and generated tokens.',
  },
  {
    q: 'Why are output (completion) tokens priced 3x to 4x higher than input (prompt) tokens across almost all AI providers?',
    a: 'Input tokens and output tokens have vastly different computational characteristics: 1) Parallelism: Input prompt tokens are processed all at once in parallel using massive matrix multiplications across tensor cores in a single forward pass. 2) Sequential Generation: Output tokens must be generated autoregressively one single token at a time. Each generated token requires reading the entire previous Key-Value (KV) cache from high-bandwidth GPU memory (HBM), resulting in memory-bandwidth-bound inference that ties up expensive GPUs for hundreds of milliseconds per call.',
  },
  {
    q: 'How does Prompt Caching work, and how can it reduce input token costs by up to 50% to 90%?',
    a: 'When an application sends repeated context — such as a 3,000-token system prompt, API schema definitions, or RAG reference documents — providers like OpenAI, Anthropic, and Google store the precomputed KV-cache states in GPU memory. On subsequent requests that start with the exact same prefix, the model skips recomputing transformer attention layers for that static segment. Providers pass these hardware savings to developers as cached input discounts (e.g. Anthropic charges 90% less for cached prompt reads; OpenAI charges 50% less).',
  },
  {
    q: 'Why do non-English languages (like Hindi, Arabic, or Japanese) often cost 2x to 4x more tokens than English for the same sentence?',
    a: 'Most standard BPE tokenizers are trained predominantly on English-dominated web datasets. Common English words get single compact token IDs (e.g. "computer" = 1 token). In contrast, Indic scripts (like Devanagari) or non-Latin alphabets are split into individual unicode byte sequences or single characters (e.g. the Hindi word "कंप्यूटर" may require 6 to 8 tokens). Consequently, multilingual apps in India or Asia experience higher latency and 2x–4x higher token API bills unless modern multilingual tokenizers (such as Llama 3 or Gemini 2.0) are utilized.',
  },
  {
    q: 'What is Tiered Model Routing, and how does it prevent runaway LLM costs in production systems?',
    a: 'Tiered Model Routing is an architectural pattern where an ultra-fast, cheap classifier (or a Tier 1 mini model like GPT-4o-mini / Gemini 2.0 Flash costing ₹12 per 1M tokens) inspects incoming user queries. If the query is simple (FAQ, formatting, classification, extraction), the mini model handles it directly (resolving ~75–85% of traffic). Only when the prompt requires deep multi-step reasoning, mathematical deduction, or specialized code synthesis is the query escalated to an expensive flagship model (Tier 2/3). This reduces overall blended API bills by 70% to 85%.',
  },
]

const FAQS = [
  {
    q: 'How much does it cost in Indian Rupees (₹) to run 100,000 AI user queries per month?',
    a: 'Using a high-efficiency Tier 1 model (such as GPT-4o-mini or Gemini 2.0 Flash) with an average prompt of 1,000 tokens and 300 output tokens, 100,000 requests consume 100M input tokens ($15) and 30M output tokens ($18) for a total raw cost of $33 per month (approx. ₹2,850 INR). If using a Tier 2 flagship model (GPT-4o), that same volume costs $550/month (approx. ₹47,500 INR). With Tiered Routing and Prompt Caching, blended costs stay under ₹6,000 INR.',
  },
  {
    q: 'What is the difference between Context Window tokens and Max Output Generation tokens?',
    a: 'Context Window (e.g. 128k to 1M tokens) is the total combined sequence capacity the model can hold in memory at once (System Prompt + Chat History + RAG Documents + User Query + Model Response). Max Output Tokens (typically 4k to 16k tokens) is the strict upper ceiling the model can generate in a single response turn. Output tokens are strictly constrained to prevent accidental infinite loops and GPU memory starvation.',
  },
  {
    q: 'What are OpenAI o1/o3 and Claude 3.7 "Thinking Tokens" (Reasoning Tokens), and are they billed?',
    a: 'Yes. Reasoning models generate internal Chain-of-Thought (CoT) "thinking tokens" to deliberate, test hypotheses, and self-correct before outputting the final visible response. While these internal thinking tokens are invisible or collapsed in standard user interfaces, providers bill them at the full output completion token rate ($60 / 1M tokens on o1). A short 50-word final answer may consume 4,000 thinking tokens behind the scenes.',
  },
  {
    q: 'How does OpenAI/Anthropic Batch API pricing work for non-urgent tasks?',
    a: 'Both OpenAI and Anthropic offer a Batch API for asynchronous workloads that do not require real-time streaming (such as overnight data enrichment, document summarization, bulk evaluation, and embedding generation). You submit batches of requests and receive outputs within 24 hours at an automatic 50% discount across both input and output token rates with separate, higher rate limits.',
  },
]

const PY_CODE = `# Complete AI Token Counter, Cost Estimator & Model Router in Python
# pip install tiktoken openai anthropic
import os
import tiktoken
import openai

# 1. Precise Token Counting with tiktoken (cl100k_base / o200k_base)
def count_tokens(text: str, model: str = "gpt-4o") -> int:
    """Accurately calculates BPE token count for OpenAI models."""
    try:
        encoding = tiktoken.encoding_for_model(model)
    except KeyError:
        encoding = tiktoken.get_encoding("cl100k_base")
    return len(encoding.encode(text))

# 2. Real-Time Multi-Tier Cost Calculator (USD & INR)
RATES = {
    "gpt-4o-mini": {"in": 0.15 / 1e6, "out": 0.60 / 1e6, "cached_in": 0.075 / 1e6},
    "gpt-4o":      {"in": 2.50 / 1e6, "out": 10.00 / 1e6, "cached_in": 1.25 / 1e6},
    "o1":          {"in": 15.00 / 1e6, "out": 60.00 / 1e6, "cached_in": 7.50 / 1e6},
}
USD_TO_INR = 86.50

def estimate_cost(model: str, prompt_tokens: int, completion_tokens: int, cached_tokens: int = 0) -> dict:
    rates = RATES.get(model, RATES["gpt-4o-mini"])
    uncached_in = max(0, prompt_tokens - cached_tokens)
    
    cost_usd = (uncached_in * rates["in"]) + (cached_tokens * rates["cached_in"]) + (completion_tokens * rates["out"])
    cost_inr = cost_usd * USD_TO_INR
    
    return {
        "model": model,
        "total_tokens": prompt_tokens + completion_tokens,
        "cost_usd": round(cost_usd, 6),
        "cost_inr": round(cost_inr, 4),
        "cost_per_10k_calls_inr": round(cost_inr * 10000, 2),
    }

# 3. Intelligent Tiered Model Router Pattern
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def execute_smart_routed_query(user_query: str, system_prompt: str) -> str:
    """
    Routes simple/moderate queries to cheap GPT-4o-mini (Tier 1).
    Only escalates to heavy reasoning GPT-4o / o1 if complexity triggers are detected.
    Saves ~80% on monthly LLM API bills.
    """
    complexity_keywords = ["prove", "mathematical", "refactor architecture", "optimize kernel", "legal clause audit"]
    is_complex = any(k in user_query.lower() for k in complexity_keywords)
    
    selected_model = "gpt-4o" if is_complex else "gpt-4o-mini"
    
    response = client.chat.completions.create(
        model=selected_model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_query}
        ],
        temperature=0.2
    )
    
    # Track actual token usage reported by API
    usage = response.usage
    cost_data = estimate_cost(selected_model, usage.prompt_tokens, usage.completion_tokens)
    print(f"Executed via [{selected_model}] -> {usage.total_tokens} tokens = ₹{cost_data['cost_inr']} INR")
    
    return response.choices[0].message.content`

const JS_CODE = `// Complete AI Token Estimator, Budget Tracker & Middleware in Node.js
// npm install @dqbd/tiktoken openai
import { encoding_for_model } from '@dqbd/tiktoken';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const USD_TO_INR = 86.5;

// Model Tier Cost Configurations per 1M tokens
const TIER_PRICING = {
  'gpt-4o-mini': { inputUSD: 0.15, outputUSD: 0.60, cachedUSD: 0.075 },
  'gpt-4o':      { inputUSD: 2.50, outputUSD: 10.00, cachedUSD: 1.25 },
  'claude-3-5-sonnet': { inputUSD: 3.00, outputUSD: 15.00, cachedUSD: 0.30 },
};

// Fast Subword Token Estimator for Node.js Services
export function estimateTokens(text) {
  if (!text) return 0;
  // Standard English text averages ~3.8 characters per token
  // For precise tokenization, use encoding_for_model('gpt-4o')
  return Math.ceil(text.trim().length / 3.8);
}

// Compute Cost Breakdown in Rupees and USD
export function calculateCallCost(modelName, promptTokens, outputTokens, isCached = false) {
  const tier = TIER_PRICING[modelName] || TIER_PRICING['gpt-4o-mini'];
  const inputRate = isCached ? tier.cachedUSD : tier.inputUSD;
  
  const inputCostUSD = (promptTokens / 1_000_000) * inputRate;
  const outputCostUSD = (outputTokens / 1_000_000) * tier.outputUSD;
  const totalUSD = inputCostUSD + outputCostUSD;
  const totalINR = totalUSD * USD_TO_INR;

  return {
    model: modelName,
    promptTokens,
    outputTokens,
    totalTokens: promptTokens + outputTokens,
    totalUSD: Number(totalUSD.toFixed(6)),
    totalINR: Number(totalINR.toFixed(4)),
    costPer100kCallsINR: Number((totalINR * 100_000).toFixed(2))
  };
}

// Production Express Middleware for AI Cost Auditing
export function aiCostAuditMiddleware(req, res, next) {
  const start = Date.now();
  const originalJson = res.json;

  res.json = function(body) {
    if (body?.usage) {
      const { prompt_tokens, completion_tokens } = body.usage;
      const model = body.model || 'gpt-4o-mini';
      const cost = calculateCallCost(model, prompt_tokens, completion_tokens);
      console.log(\`[AI-COST-AUDIT] Model: \${model} | Tokens: \${cost.totalTokens} | Cost: ₹\${cost.totalINR} | Time: \${Date.now() - start}ms\`);
    }
    return originalJson.call(this, body);
  };
  next();
}`

export default function CostsPage() {
  const [activeTab, setActiveTab] = useState('tokenizer') // 'tokenizer' | 'budget-planner' | 'pricing-matrix' | 'cost-playbook'
  const [customText, setCustomText] = useState(TOKEN_PRESETS[0].text)
  const [selectedPresetId, setSelectedPresetId] = useState(TOKEN_PRESETS[0].id)
  const [estimatedOutputTokens, setEstimatedOutputTokens] = useState(350)
  const [isPromptCached, setIsPromptCached] = useState(false)

  // Budget Planner State
  const [dailyActiveUsers, setDailyActiveUsers] = useState(2500)
  const [promptsPerUserPerDay, setPromptsPerUserPerDay] = useState(6)
  const [plannerPromptTokens, setPlannerPromptTokens] = useState(1200)
  const [plannerOutputTokens, setPlannerOutputTokens] = useState(400)
  const [plannerModelTier, setPlannerModelTier] = useState('fast') // 'fast' | 'flagship' | 'reasoning' | 'blended'
  const [plannerCacheEnabled, setPlannerCacheEnabled] = useState(true)

  const canvasRef = useRef(null)

  // Tokenize the active input text
  const tokens = useMemo(() => {
    return tokenizeText(customText)
  }, [customText])

  const tokenCount = tokens.length
  const charCount = customText.length
  const wordCount = customText.trim() ? customText.trim().split(/\s+/).length : 0
  const charsPerToken = tokenCount > 0 ? (charCount / tokenCount).toFixed(2) : '0'

  // Real-time cost across 3 tiers for the active text in tokenizer tab
  const activeCosts = useMemo(() => {
    const calcTier = (tier) => {
      const inRate = isPromptCached ? tier.cachedInputPer1M : tier.inputPer1M
      const inCostUSD = (tokenCount / 1e6) * inRate
      const outCostUSD = (estimatedOutputTokens / 1e6) * tier.outputPer1M
      const totalUSD = inCostUSD + outCostUSD
      const totalINR = totalUSD * USD_TO_INR
      return {
        inCostINR: inCostUSD * USD_TO_INR,
        outCostINR: outCostUSD * USD_TO_INR,
        totalUSD,
        totalINR,
        costPer10kINR: totalINR * 10000,
        costPer100kINR: totalINR * 100000,
      }
    }
    return {
      fast: calcTier(MODEL_TIERS.fast),
      flagship: calcTier(MODEL_TIERS.flagship),
      reasoning: calcTier(MODEL_TIERS.reasoning),
    }
  }, [tokenCount, estimatedOutputTokens, isPromptCached])

  // Budget Planner Calculations
  const budgetSummary = useMemo(() => {
    const dailyCalls = dailyActiveUsers * promptsPerUserPerDay
    const monthlyCalls = dailyCalls * 30

    const monthlyInputTokens = monthlyCalls * plannerPromptTokens
    const monthlyOutputTokens = monthlyCalls * plannerOutputTokens
    const totalMonthlyTokens = monthlyInputTokens + monthlyOutputTokens

    const computeCost = (tierKey, cacheDiscount) => {
      const t = MODEL_TIERS[tierKey]
      const effectiveInRate = cacheDiscount ? (t.inputPer1M * 0.3 + t.cachedInputPer1M * 0.7) : t.inputPer1M
      const inCost = (monthlyInputTokens / 1e6) * effectiveInRate
      const outCost = (monthlyOutputTokens / 1e6) * t.outputPer1M
      return inCost + outCost
    }

    let monthlyCostUSD = 0
    if (plannerModelTier === 'fast') {
      monthlyCostUSD = computeCost('fast', plannerCacheEnabled)
    } else if (plannerModelTier === 'flagship') {
      monthlyCostUSD = computeCost('flagship', plannerCacheEnabled)
    } else if (plannerModelTier === 'reasoning') {
      monthlyCostUSD = computeCost('reasoning', plannerCacheEnabled)
    } else if (plannerModelTier === 'blended') {
      // 80% Fast Tier 1 + 20% Flagship Tier 2
      const fastCost = computeCost('fast', plannerCacheEnabled) * 0.8
      const flagCost = computeCost('flagship', plannerCacheEnabled) * 0.2
      monthlyCostUSD = fastCost + flagCost
    }

    const monthlyCostINR = monthlyCostUSD * USD_TO_INR
    const costPerUserPerMonthINR = dailyActiveUsers > 0 ? monthlyCostINR / dailyActiveUsers : 0
    const annualRunRateINR = monthlyCostINR * 12

    // Benchmark comparison vs 100% Flagship un-cached
    const unoptimizedFlagshipUSD = computeCost('flagship', false)
    const unoptimizedFlagshipINR = unoptimizedFlagshipUSD * USD_TO_INR
    const monthlySavingsINR = Math.max(0, unoptimizedFlagshipINR - monthlyCostINR)
    const savingsPercent = unoptimizedFlagshipINR > 0 ? Math.round((monthlySavingsINR / unoptimizedFlagshipINR) * 100) : 0

    return {
      monthlyCalls,
      totalMonthlyTokensM: (totalMonthlyTokens / 1e6).toFixed(1),
      monthlyInputTokensM: (monthlyInputTokens / 1e6).toFixed(1),
      monthlyOutputTokensM: (monthlyOutputTokens / 1e6).toFixed(1),
      monthlyCostUSD: Math.round(monthlyCostUSD),
      monthlyCostINR: Math.round(monthlyCostINR),
      costPerUserPerMonthINR: costPerUserPerMonthINR.toFixed(2),
      annualRunRateINR: Math.round(annualRunRateINR),
      monthlySavingsINR: Math.round(monthlySavingsINR),
      savingsPercent,
    }
  }, [dailyActiveUsers, promptsPerUserPerDay, plannerPromptTokens, plannerOutputTokens, plannerModelTier, plannerCacheEnabled])

  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id)
    setCustomText(preset.text)
  }

  // Visual Scorecard & Token Gauge Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

    // Background Clear
    ctx.fillStyle = '#0a0f1d'
    ctx.fillRect(0, 0, width, height)

    // Left Side: Circular Token Gauge (44% width)
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
    ctx.fillText('LIVE TOKEN LOAD GAUGE', 20, 26)

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

    // Gauge Active Progress Arc (Max benchmark ~ 500 tokens for single prompt demo)
    const tokenCap = 500
    const gaugeRatio = Math.min(1, Math.max(0.05, tokenCount / tokenCap))
    const progressAngle = startAngle + totalAngle * gaugeRatio
    const gaugeColor = tokenCount > 350 ? '#f59e0b' : '#10b981'

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
    ctx.font = 'bold 24px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`${tokenCount}`, centerX, centerY)

    ctx.fillStyle = '#94a3b8'
    ctx.font = '10px sans-serif'
    ctx.fillText('PROMPT TOKENS', centerX, centerY + 18)

    ctx.fillStyle = gaugeColor
    ctx.font = 'bold 9px sans-serif'
    ctx.fillText(`~${charsPerToken} CHARS/TOKEN`, centerX, centerY + 34)

    // Right Side: 3-Tier Cost Comparison Scorecard Bars
    const rightX = leftWidth + 20
    const rightWidth = width - rightX - 16

    ctx.textAlign = 'left'
    ctx.fillStyle = '#94a3b8'
    ctx.font = '11px sans-serif'
    ctx.fillText('RUNNING COST BENCHMARKS (10,000 CALLS)', rightX, 26)

    const tiers = [
      { label: 'Tier 1: Fast (GPT-4o-mini)', valINR: activeCosts.fast.costPer10kINR, color: '#10b981', max: 5000 },
      { label: 'Tier 2: Flagship (GPT-4o)', valINR: activeCosts.flagship.costPer10kINR, color: '#38bdf8', max: 5000 },
      { label: 'Tier 3: Reasoning (o1)', valINR: activeCosts.reasoning.costPer10kINR, color: '#a855f7', max: 5000 },
    ]

    tiers.forEach((t, idx) => {
      const rowY = 56 + idx * 56

      // Label & Value
      ctx.fillStyle = '#e2e8f0'
      ctx.font = '11px sans-serif'
      ctx.fillText(t.label, rightX, rowY)

      ctx.fillStyle = t.color
      ctx.font = 'bold 12px monospace'
      ctx.textAlign = 'right'
      ctx.fillText(`₹${t.valINR.toFixed(1)} INR`, rightX + rightWidth, rowY)
      ctx.textAlign = 'left'

      // Bar Background
      const barY = rowY + 8
      const barHeight = 8
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
      ctx.beginPath()
      ctx.roundRect(rightX, barY, rightWidth, barHeight, 4)
      ctx.fill()

      // Bar Progress Fill
      const fillW = Math.min(rightWidth, Math.max(8, (rightWidth * Math.log10(t.valINR + 1)) / Math.log10(tiers[2].valINR + 10)))
      ctx.fillStyle = t.color
      ctx.shadowColor = t.color
      ctx.shadowBlur = 6
      ctx.beginPath()
      ctx.roundRect(rightX, barY, fillW, barHeight, 4)
      ctx.fill()
      ctx.shadowBlur = 0
    })

    // Subtitle note
    ctx.fillStyle = '#64748b'
    ctx.font = '10px sans-serif'
    ctx.fillText(`Active Output Tokens: ${estimatedOutputTokens} | USD/INR: ₹${USD_TO_INR}`, rightX, height - 16)
  }, [tokenCount, charsPerToken, activeCosts, estimatedOutputTokens])

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
    name: 'How to Calculate, Forecast and Slash AI API Token Costs',
    step: [
      {
        '@type': 'HowToStep',
        text: 'Estimate Input and Output Token Volume: Measure your average prompt size (system instructions + RAG chunks + user queries) and expected generation length in subword BPE tokens.',
      },
      {
        '@type': 'HowToStep',
        text: 'Select Model Tier Based on Task Complexity: Route high-volume simple tasks to Tier 1 mini models (GPT-4o-mini, Gemini Flash) and reserve flagship Tier 2/3 models for heavy reasoning.',
      },
      {
        '@type': 'HowToStep',
        text: 'Enable Prompt Caching for Static Context: Structure your API calls so static system prompts and schemas remain at the start of the sequence to receive 50% to 90% caching discounts.',
      },
      {
        '@type': 'HowToStep',
        text: 'Implement Semantic Caching: Cache common LLM answers in a vector database (Redis / Upstash) to bypass LLM generation entirely for identical or near-duplicate user questions.',
      },
      {
        '@type': 'HowToStep',
        text: 'Enforce Strict Output Token Limits: Set max_tokens parameters and concise response instructions to prevent costly autoregressive generation runaways.',
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
        <meta property="og:image" content="https://www.uptools.in/assets/learning/ai/ai-lesson12-hero.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${TITLE} | UpTools`} />
        <meta name="twitter:description" content={DESC} />
        <meta name="twitter:image" content="https://www.uptools.in/assets/learning/ai/ai-lesson12-hero.jpg" />
        <meta
          name="keywords"
          content="AI token cost calculator, LLM pricing in rupees, AI tokens explained, GPT-4o mini cost, prompt caching pricing, AI monthly budget planner, token economics, reduce AI API bill"
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
              { '@type': 'ListItem', position: 4, name: 'AI Costs and Tokens', item: URL },
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
        <span className="text-slate-300 font-medium">AI Costs and Tokens</span>
      </nav>

      {/* BADGE & HEADER */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 mb-4">
        <span>🪙</span> AI · Lesson 12 · Beginner
      </div>
      <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight m-0 mb-3">
        AI Costs and Tokens: How AI Pricing Works &amp; Monthly Budget Planner
      </h1>
      <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-3xl">
        Every question you ask an AI model is broken into <strong>subword tokens</strong> — and billed based on exact input and output lengths. Discover how AI token economics work, why output tokens cost <strong>4x more than inputs</strong>, how to estimate API bills in <strong>Indian Rupees (₹)</strong> across 3 model tiers, and how top engineering teams use prompt caching and model routing to <strong>slash LLM bills by 85%</strong>.
      </p>

      <figure className="m-0 mb-6 rounded-xl border border-white/10 overflow-hidden">
        <img src="/assets/learning/ai/ai-lesson12-hero.jpg" alt="Robot counting word tokens like coins with price tags" loading="lazy" />
      </figure>

      {/* LIVE INTERACTIVE ANIMATOR */}
      <section
        className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6"
        aria-label="Live AI Tokenizer and Cost Calculator Simulator"
      >
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-white m-0">▶ Live Demo: Tokenizer, Real-Time Rupee Cost Meter &amp; Budget Planner</h2>
            <p className="text-xs text-slate-400 m-0 mt-0.5">
              Type custom text to inspect colored BPE tokens with real-time costs, or simulate monthly user scale.
            </p>
          </div>
          <div className="flex rounded-xl bg-black/40 border border-white/10 p-1 flex-wrap gap-1">
            <button
              onClick={() => setActiveTab('tokenizer')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-all ${
                activeTab === 'tokenizer' ? 'bg-emerald-500/30 text-emerald-300' : 'text-slate-400 bg-transparent hover:text-white'
              }`}
            >
              🪙 Live Tokenizer &amp; Cost
            </button>
            <button
              onClick={() => setActiveTab('budget-planner')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-all ${
                activeTab === 'budget-planner' ? 'bg-emerald-500/30 text-emerald-300' : 'text-slate-400 bg-transparent hover:text-white'
              }`}
            >
              📊 Monthly Budget Planner
            </button>
            <button
              onClick={() => setActiveTab('pricing-matrix')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-all ${
                activeTab === 'pricing-matrix' ? 'bg-emerald-500/30 text-emerald-300' : 'text-slate-400 bg-transparent hover:text-white'
              }`}
            >
              📋 Model Pricing Matrix
            </button>
            <button
              onClick={() => setActiveTab('cost-playbook')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-all ${
                activeTab === 'cost-playbook' ? 'bg-emerald-500/30 text-emerald-300' : 'text-slate-400 bg-transparent hover:text-white'
              }`}
            >
              ⚡ 5 Cost-Cutting Hacks
            </button>
          </div>
        </div>

        {/* TAB 1: LIVE TOKENIZER & REAL-TIME COST METER */}
        {activeTab === 'tokenizer' && (
          <div className="space-y-4">
            {/* SAMPLE PRESET PICKER */}
            <div>
              <div className="text-xs font-semibold text-slate-400 mb-2">Select Sample Prompt Preset or Type Below:</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TOKEN_PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-2.5 rounded-xl text-left border cursor-pointer transition-all ${
                      selectedPresetId === preset.id
                        ? 'bg-white/10 border-emerald-500/50 shadow-lg'
                        : 'bg-black/30 border-white/5 hover:border-white/20 text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold text-white truncate">{preset.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 truncate">{preset.category}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* CANVAS REAL-TIME TOKEN LOAD & TIER COST GAUGE */}
            <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0a0f1d]">
              <canvas
                ref={canvasRef}
                width={700}
                height={210}
                className="w-full block"
                style={{ maxHeight: '230px' }}
              />
            </div>

            {/* LIVE INTERACTIVE TEXT INPUT & TOKEN HIGHLIGHTER */}
            <div className="grid lg:grid-cols-2 gap-4">
              {/* Text Area */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-white">✏️ Input Prompt Text:</span>
                  <button
                    onClick={() => setCustomText('')}
                    className="text-[11px] text-slate-400 hover:text-white bg-transparent border-0 cursor-pointer"
                  >
                    Clear Text
                  </button>
                </div>
                <textarea
                  value={customText}
                  onChange={(e) => {
                    setCustomText(e.target.value)
                    setSelectedPresetId('')
                  }}
                  rows={6}
                  placeholder="Type or paste any text to see real-time token segmentation and cost..."
                  className="w-full rounded-xl bg-black/40 border border-white/10 p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500/50 resize-y"
                />

                <div className="flex items-center justify-between flex-wrap gap-2 text-[11px] text-slate-400 font-mono bg-black/30 p-2 rounded-lg border border-white/5">
                  <span>Characters: <strong className="text-white">{charCount}</strong></span>
                  <span>Words: <strong className="text-white">{wordCount}</strong></span>
                  <span>Tokens: <strong className="text-emerald-300">{tokenCount}</strong></span>
                  <span>Ratio: <strong className="text-sky-300">{charsPerToken} chars/tok</strong></span>
                </div>
              </div>

              {/* Visual Colored Token Chips Display */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-white">🔍 Highlighted Subword BPE Tokens:</span>
                  <span className="text-[11px] text-emerald-400 font-mono">{tokens.length} tokens parsed</span>
                </div>
                <div className="h-[148px] overflow-y-auto rounded-xl bg-black/50 border border-white/10 p-3 flex flex-wrap gap-1 content-start leading-relaxed">
                  {tokens.length === 0 ? (
                    <span className="text-xs text-slate-500 italic">No text provided. Type above to see tokens.</span>
                  ) : (
                    tokens.map((tok, i) => {
                      const colorClass = TOKEN_BG_COLORS[i % TOKEN_BG_COLORS.length]
                      return (
                        <span
                          key={i}
                          title={`Token #${i + 1}: "${tok}" (${tok.length} chars)`}
                          className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-mono border ${colorClass} transition-all hover:scale-110 cursor-help`}
                        >
                          {tok === ' ' ? '␣' : tok === '\n' ? '↵\n' : tok}
                        </span>
                      )
                    })
                  )}
                </div>
                <div className="text-[10px] text-slate-500 flex items-center justify-between">
                  <span>Hover over any token chip to inspect subword boundaries.</span>
                  <span>␣ = space, ↵ = newline</span>
                </div>
              </div>
            </div>

            {/* RESPONSE TOKEN SLIDER & CACHING TOGGLE */}
            <div className="rounded-xl bg-black/40 border border-white/10 p-4 space-y-3">
              <div className="grid sm:grid-cols-2 gap-4 items-center">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Expected Response Generation Size:</span>
                    <span className="text-sky-400 font-mono font-bold">{estimatedOutputTokens} output tokens</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="2000"
                    step="50"
                    value={estimatedOutputTokens}
                    onChange={(e) => setEstimatedOutputTokens(Number(e.target.value))}
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>50 (Short Answer)</span>
                    <span>500 (Detailed Email)</span>
                    <span>2000 (Long Article / Code)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                  <div>
                    <div className="text-xs font-bold text-white">Prompt Caching Discount (50% Off)</div>
                    <div className="text-[10px] text-slate-400">Applies when prompt prefix matches static KV-cache</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPromptCached}
                      onChange={(e) => setIsPromptCached(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>

              {/* 3 MODEL TIERS LIVE COST COMPARISON CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {/* Fast Tier */}
                <div className="rounded-xl bg-emerald-950/20 border border-emerald-500/30 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">Tier 1: Fast &amp; Mini</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Fastest</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono truncate">GPT-4o-mini / Gemini 2.0 Flash</div>
                  <div className="border-t border-white/5 pt-2">
                    <div className="text-[10px] text-slate-400">Cost per Single Query:</div>
                    <div className="text-lg font-extrabold text-emerald-300 font-mono">
                      ₹{activeCosts.fast.totalINR.toFixed(4)} <span className="text-[10px] text-slate-400 font-normal">(${(activeCosts.fast.totalUSD * 1000).toFixed(4)}¢)</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-300 font-mono bg-black/40 p-1.5 rounded flex justify-between">
                    <span>10,000 queries:</span>
                    <strong className="text-emerald-300">₹{activeCosts.fast.costPer10kINR.toFixed(1)} INR</strong>
                  </div>
                </div>

                {/* Flagship Tier */}
                <div className="rounded-xl bg-sky-950/20 border border-sky-500/30 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-400">Tier 2: Flagship</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300">Standard</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono truncate">GPT-4o / Claude 3.5 Sonnet</div>
                  <div className="border-t border-white/5 pt-2">
                    <div className="text-[10px] text-slate-400">Cost per Single Query:</div>
                    <div className="text-lg font-extrabold text-sky-300 font-mono">
                      ₹{activeCosts.flagship.totalINR.toFixed(3)} <span className="text-[10px] text-slate-400 font-normal">(${(activeCosts.flagship.totalUSD * 100).toFixed(3)}¢)</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-300 font-mono bg-black/40 p-1.5 rounded flex justify-between">
                    <span>10,000 queries:</span>
                    <strong className="text-sky-300">₹{activeCosts.flagship.costPer10kINR.toFixed(1)} INR</strong>
                  </div>
                </div>

                {/* Reasoning Tier */}
                <div className="rounded-xl bg-purple-950/20 border border-purple-500/30 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-400">Tier 3: Deep Reasoning</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">Heavy</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono truncate">OpenAI o1 / o3 / Claude 3.7</div>
                  <div className="border-t border-white/5 pt-2">
                    <div className="text-[10px] text-slate-400">Cost per Single Query:</div>
                    <div className="text-lg font-extrabold text-purple-300 font-mono">
                      ₹{activeCosts.reasoning.totalINR.toFixed(2)} <span className="text-[10px] text-slate-400 font-normal">(${(activeCosts.reasoning.totalUSD * 100).toFixed(2)}¢)</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-300 font-mono bg-black/40 p-1.5 rounded flex justify-between">
                    <span>10,000 queries:</span>
                    <strong className="text-purple-300">₹{activeCosts.reasoning.costPer10kINR.toFixed(0)} INR</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MONTHLY BUDGET PLANNER */}
        {activeTab === 'budget-planner' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-300 leading-relaxed">
              Model your application user traffic, average prompt/response sizes, and caching to forecast monthly LLM server bills:
            </div>

            {/* CONTROLS GRID */}
            <div className="rounded-xl bg-black/40 border border-white/10 p-4 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Daily Active Users */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-white">Daily Active Users (DAU):</span>
                    <span className="text-emerald-400 font-mono font-bold">{dailyActiveUsers.toLocaleString()} users</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="20000"
                    step="100"
                    value={dailyActiveUsers}
                    onChange={(e) => setDailyActiveUsers(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>100</span>
                    <span>5,000</span>
                    <span>20,000+</span>
                  </div>
                </div>

                {/* Queries per user */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-white">Daily Prompts per Active User:</span>
                    <span className="text-emerald-400 font-mono font-bold">{promptsPerUserPerDay} queries / day</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="25"
                    step="1"
                    value={promptsPerUserPerDay}
                    onChange={(e) => setPromptsPerUserPerDay(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>1 query</span>
                    <span>10 queries</span>
                    <span>25 queries</span>
                  </div>
                </div>

                {/* Average Prompt Tokens */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-white">Avg Prompt Size (System + Context):</span>
                    <span className="text-sky-400 font-mono font-bold">{plannerPromptTokens} tokens</span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="5000"
                    step="100"
                    value={plannerPromptTokens}
                    onChange={(e) => setPlannerPromptTokens(Number(e.target.value))}
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>200 (Short)</span>
                    <span>1,500 (RAG)</span>
                    <span>5,000 (Multi-doc)</span>
                  </div>
                </div>

                {/* Average Output Tokens */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-white">Avg Output Response Size:</span>
                    <span className="text-sky-400 font-mono font-bold">{plannerOutputTokens} tokens</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="2000"
                    step="50"
                    value={plannerOutputTokens}
                    onChange={(e) => setPlannerOutputTokens(Number(e.target.value))}
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>50 (Concise)</span>
                    <span>400 (Standard)</span>
                    <span>2,000 (Verbose)</span>
                  </div>
                </div>
              </div>

              {/* ARCHITECTURE TIER MIX & CACHING SELECTOR */}
              <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
                <div>
                  <label className="text-xs font-semibold text-white block mb-1.5">Model Architecture Strategy:</label>
                  <select
                    value={plannerModelTier}
                    onChange={(e) => setPlannerModelTier(e.target.value)}
                    className="w-full bg-[#111927] text-white border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="fast">⚡ 100% Tier 1 Fast (GPT-4o-mini / Gemini Flash) — Lowest Cost</option>
                    <option value="blended">🔀 Smart Tiered Router (80% Tier 1 + 20% Flagship) — Recommended</option>
                    <option value="flagship">🎯 100% Tier 2 Flagship (GPT-4o / Claude 3.5 Sonnet) — Premium Quality</option>
                    <option value="reasoning">🧠 100% Tier 3 Deep Reasoning (o1 / o3) — Research Heavy</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <div>
                    <div className="text-xs font-bold text-white">Enable Prompt Caching</div>
                    <div className="text-[10px] text-slate-400">70% cache hit rate on static system prefixes</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={plannerCacheEnabled}
                      onChange={(e) => setPlannerCacheEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>

              {/* FORECAST RESULTS SCORECARD */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="rounded-xl bg-emerald-950/30 border border-emerald-500/30 p-3 text-center">
                  <div className="text-[11px] text-slate-400">Monthly AI Bill (INR)</div>
                  <div className="text-xl font-extrabold text-emerald-300 font-mono mt-0.5">
                    ₹{budgetSummary.monthlyCostINR.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500">${budgetSummary.monthlyCostUSD.toLocaleString()} USD / month</div>
                </div>

                <div className="rounded-xl bg-sky-950/30 border border-sky-500/30 p-3 text-center">
                  <div className="text-[11px] text-slate-400">Monthly Query Volume</div>
                  <div className="text-xl font-extrabold text-sky-300 font-mono mt-0.5">
                    {(budgetSummary.monthlyCalls / 1e3).toFixed(0)}k req
                  </div>
                  <div className="text-[10px] text-slate-500">{budgetSummary.totalMonthlyTokensM}M Total Tokens</div>
                </div>

                <div className="rounded-xl bg-purple-950/30 border border-purple-500/30 p-3 text-center">
                  <div className="text-[11px] text-slate-400">Cost / Active User</div>
                  <div className="text-xl font-extrabold text-purple-300 font-mono mt-0.5">
                    ₹{budgetSummary.costPerUserPerMonthINR}
                  </div>
                  <div className="text-[10px] text-slate-500">per user / month</div>
                </div>

                <div className="rounded-xl bg-amber-950/30 border border-amber-500/30 p-3 text-center">
                  <div className="text-[11px] text-slate-400">Architecture Savings</div>
                  <div className="text-xl font-extrabold text-amber-300 font-mono mt-0.5">
                    {budgetSummary.savingsPercent}% Cut
                  </div>
                  <div className="text-[10px] text-slate-500">Saves ₹{budgetSummary.monthlySavingsINR.toLocaleString()}/mo</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: 2026 MODEL PRICING MATRIX */}
        {activeTab === 'pricing-matrix' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-300 leading-relaxed">
              Official industry pricing benchmarks per 1 Million tokens across major AI frontier and open-source models:
            </div>
            <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/40">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-slate-400">
                    <th className="p-3 font-bold">Model Name</th>
                    <th className="p-3 font-bold">Tier</th>
                    <th className="p-3 font-bold">Input (1M Tokens)</th>
                    <th className="p-3 font-bold">Output (1M Tokens)</th>
                    <th className="p-3 font-bold">Cached Input</th>
                    <th className="p-3 font-bold">Context Window</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="p-3 font-semibold text-white">Google Gemini 2.0 Flash</td>
                    <td className="p-3 text-emerald-400 font-mono">Ultra-Budget</td>
                    <td className="p-3 text-emerald-300 font-mono">$0.10 (₹8.6)</td>
                    <td className="p-3 text-emerald-300 font-mono">$0.40 (₹34.6)</td>
                    <td className="p-3 text-slate-300 font-mono">$0.025</td>
                    <td className="p-3 text-slate-400 font-mono">1,000,000</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">OpenAI GPT-4o-mini</td>
                    <td className="p-3 text-emerald-400 font-mono">Tier 1 Fast</td>
                    <td className="p-3 text-emerald-300 font-mono">$0.15 (₹12.9)</td>
                    <td className="p-3 text-emerald-300 font-mono">$0.60 (₹51.9)</td>
                    <td className="p-3 text-slate-300 font-mono">$0.075</td>
                    <td className="p-3 text-slate-400 font-mono">128,000</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Anthropic Claude 3.5 Haiku</td>
                    <td className="p-3 text-emerald-400 font-mono">Tier 1 Fast</td>
                    <td className="p-3 text-emerald-300 font-mono">$0.80 (₹69.2)</td>
                    <td className="p-3 text-emerald-300 font-mono">$4.00 (₹346.0)</td>
                    <td className="p-3 text-slate-300 font-mono">$0.080</td>
                    <td className="p-3 text-slate-400 font-mono">200,000</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">OpenAI GPT-4o</td>
                    <td className="p-3 text-sky-400 font-mono">Tier 2 Flagship</td>
                    <td className="p-3 text-sky-300 font-mono">$2.50 (₹216.2)</td>
                    <td className="p-3 text-sky-300 font-mono">$10.00 (₹865.0)</td>
                    <td className="p-3 text-slate-300 font-mono">$1.250</td>
                    <td className="p-3 text-slate-400 font-mono">128,000</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Anthropic Claude 3.5 Sonnet</td>
                    <td className="p-3 text-sky-400 font-mono">Tier 2 Flagship</td>
                    <td className="p-3 text-sky-300 font-mono">$3.00 (₹259.5)</td>
                    <td className="p-3 text-sky-300 font-mono">$15.00 (₹1,297.5)</td>
                    <td className="p-3 text-slate-300 font-mono">$0.300</td>
                    <td className="p-3 text-slate-400 font-mono">200,000</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">DeepSeek-V3 / R1 (API)</td>
                    <td className="p-3 text-amber-400 font-mono">Open Weight / Cloud</td>
                    <td className="p-3 text-amber-300 font-mono">$0.55 (₹47.5)</td>
                    <td className="p-3 text-amber-300 font-mono">$2.19 (₹189.4)</td>
                    <td className="p-3 text-slate-300 font-mono">$0.140</td>
                    <td className="p-3 text-slate-400 font-mono">64,000</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">OpenAI o1 / o3 Reasoning</td>
                    <td className="p-3 text-purple-400 font-mono">Tier 3 Deep Reason</td>
                    <td className="p-3 text-purple-300 font-mono">$15.00 (₹1,297.5)</td>
                    <td className="p-3 text-purple-300 font-mono">$60.00 (₹5,190.0)</td>
                    <td className="p-3 text-slate-300 font-mono">$7.500</td>
                    <td className="p-3 text-slate-400 font-mono">200,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: COST REDUCTION PLAYBOOK */}
        {activeTab === 'cost-playbook' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-300 leading-relaxed">
              5 essential engineering strategies used by high-scale production systems to keep AI unit costs profitable:
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="rounded-xl bg-black/40 border border-emerald-500/20 p-3.5 space-y-1.5">
                <div className="text-xs font-bold text-emerald-400">1. Prefix Prompt Caching</div>
                <p className="text-xs text-slate-300 m-0 leading-relaxed">
                  Position long system instructions, API documentation, and JSON schemas at the very start of your prompt. Providers automatically cache precomputed KV-cache layers, granting a 50% to 90% discount on input tokens.
                </p>
              </div>

              <div className="rounded-xl bg-black/40 border border-sky-500/20 p-3.5 space-y-1.5">
                <div className="text-xs font-bold text-sky-400">2. Two-Stage Tiered Router</div>
                <p className="text-xs text-slate-300 m-0 leading-relaxed">
                  Never route 100% of user queries directly to expensive flagship models. Use a Tier 1 mini model or regex classifier to answer 80% of routine traffic, reserving heavy models only for edge-case reasoning.
                </p>
              </div>

              <div className="rounded-xl bg-black/40 border border-purple-500/20 p-3.5 space-y-1.5">
                <div className="text-xs font-bold text-purple-400">3. Semantic Caching Layer</div>
                <p className="text-xs text-slate-300 m-0 leading-relaxed">
                  Store generated completions in a vector cache (Redis / Qdrant). When another user asks a semantically identical question (cosine similarity &gt; 0.95), serve the cached response with zero LLM API invocation cost and sub-10ms latency.
                </p>
              </div>

              <div className="rounded-xl bg-black/40 border border-amber-500/20 p-3.5 space-y-1.5">
                <div className="text-xs font-bold text-amber-400">4. Async Batch Processing (50% Off)</div>
                <p className="text-xs text-slate-300 m-0 leading-relaxed">
                  For non-realtime offline workloads (summaries, nightly data labeling, embedding backfills), dispatch tasks via the OpenAI or Anthropic Batch API for an unconditional 50% discount with 24-hour turnaround.
                </p>
              </div>

              <div className="rounded-xl bg-black/40 border border-rose-500/20 p-3.5 space-y-1.5 sm:col-span-2">
                <div className="text-xs font-bold text-rose-400">5. Strict Output Token Caps &amp; Compression</div>
                <p className="text-xs text-slate-300 m-0 leading-relaxed">
                  Since output tokens cost 4x more than inputs, always pass strict instructions: <em>"Respond in under 3 concise bullet points with max 80 words."</em> Pair this with an explicit <code className="text-rose-300 font-mono">max_tokens=250</code> cap to prevent runaway token spend.
                </p>
              </div>
            </div>
          </div>
        )}

        <p className="text-[11px] text-slate-500 m-0 mt-3">
          💡 <strong>Key Takeaway:</strong> AI cost is not determined by how many prompts you send, but by how many tokens you move across the wire. Small architectural choices (routing, caching, concise outputs) reduce costs by up to 85% with zero quality degradation.
        </p>
      </section>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <figure className="m-0 rounded-xl border border-white/10 overflow-hidden">
          <img src="/assets/learning/ai/ai-lesson12-tokens.jpg" alt="Text split into colored token pieces with costs" loading="lazy" />
        </figure>
        <figure className="m-0 rounded-xl border border-white/10 overflow-hidden">
          <img src="/assets/learning/ai/ai-lesson12-budget.jpg" alt="Shopkeeper planning monthly AI budget" loading="lazy" />
        </figure>
      </div>
      {/* EXPLANATION / DEEP DIVE */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-white mt-0 mb-3">The 4 Pillars of AI Token Economics &amp; Cost Optimization</h2>
        <ol className="text-sm text-slate-300 leading-relaxed space-y-2.5 list-decimal pl-5 m-0">
          <li>
            <strong className="text-white">Subword Tokenization (BPE &amp; SentencePiece):</strong> LLMs break text into subwords. English text averages ~4 characters per token (~75 words per 100 tokens), while non-Latin scripts (Hindi, Japanese, Arabic) or complex code can consume 2x to 4x more tokens for the same semantic message.
          </li>
          <li>
            <strong className="text-white">Input vs. Output Cost Asymmetry:</strong> Output tokens require autoregressive step-by-step matrix decoding where each token must read the entire past Key-Value memory cache. Consequently, cloud providers charge 3x to 4x higher prices for generated output tokens than for incoming prompt tokens.
          </li>
          <li>
            <strong className="text-white">Prefix Prompt Caching:</strong> When multiple API requests share an identical starting block (such as an agent persona, tool schemas, or system instructions), modern providers reuse precalculated KV states, slashing input pricing by 50% to 90% and cutting latency in half.
          </li>
          <li>
            <strong className="text-white">Tiered Multi-Model Architecture:</strong> High-performing engineering organizations never rely on a single model. They route ~80% of standard user traffic to fast mini models (costing ₹12 per 1M tokens) and only invoke flagship reasoning models for tasks that genuinely require deep logical deduction.
          </li>
        </ol>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5 text-center">
          {[
            ['Tokenizer BPE', '1 Token ≈ 4 Chars', '~75 words per 100 tokens'],
            ['Cost Asymmetry', 'Output is 4x Price', 'Sequential GPU decoding'],
            ['Prompt Caching', '50% – 90% Off', 'Reuses static KV cache'],
            ['Tiered Router', '85% Cost Cut', 'Right model for right task'],
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
        <h2 className="text-lg font-bold text-white mt-0 mb-3">Code: AI Token Counter, Cost Estimator &amp; Smart Router in Python &amp; JavaScript</h2>
        <p className="text-xs text-slate-400 mt-0 mb-4">
          Calculate token sequence lengths, estimate real-time Rupee &amp; USD costs, and route requests dynamically across model tiers:
        </p>
        <div className="space-y-3">
          <CodeBlock lang="Python (Tiktoken / Cost Estimator / Tiered Model Router)" code={PY_CODE} />
          <CodeBlock lang="JavaScript (Node.js / Express Middleware / Token Cost Audit)" code={JS_CODE} />
        </div>
      </section>

      {/* PRACTICE QUESTIONS */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-white mt-0 mb-1">Practice questions</h2>
        <p className="text-xs text-slate-400 mt-0 mb-4">
          Key questions on tokenization, input vs output pricing asymmetry, prompt caching, and cost forecasting.
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

      {/* COST CUTTING TIPS */}
      <section
        className="rounded-2xl border border-emerald-500/20 p-5 sm:p-6 mb-6"
        style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(17,24,39,0.4))' }}
      >
        <h2 className="text-lg font-bold text-white mt-0 mb-3">🪙 Production AI Cost Optimization Tips</h2>
        <ul className="text-sm text-slate-300 leading-relaxed space-y-2 list-disc pl-5 m-0">
          <li>
            <strong className="text-white">Audit System Prompts for Redundant Verbiage:</strong> Trimming 500 unnecessary filler words from a system prompt executed 500,000 times a month eliminates 325 Million redundant input tokens.
          </li>
          <li>
            <strong className="text-white">Order JSON Schemas &amp; Tool Definitions Statically:</strong> Prompt caching requires exact byte-for-byte prefix matching. Keep all system instructions, static tools, and instructions at the top, and append dynamic user queries strictly at the bottom.
          </li>
          <li>
            <strong className="text-white">Cap Output Generation Aggressively:</strong> Set <code className="text-emerald-300 font-mono">max_tokens</code> to the minimum viable length required for the response. Output tokens cost 4x more than prompt tokens and dominate overall invoice totals.
          </li>
          <li>
            <strong className="text-white">Deploy Vector Semantic Caching:</strong> Frequently repeated queries (such as FAQs or standard report generation) can be served from an in-memory Redis vector index in 5ms without invoking any external LLM API.
          </li>
          <li>
            <strong className="text-white">Utilize Async Batch APIs for Offline Pipelines:</strong> Move non-interactive background workflows (embeddings, batch evaluations, automated categorization) to the OpenAI/Anthropic Batch API for an immediate 50% discount.
          </li>
        </ul>
      </section>

      {/* FAQ ACCORDION COMPONENT */}
      <FAQ questions={FAQS} />

      {/* PREV / NEXT NAVIGATION */}
      <div className="flex items-center justify-between flex-wrap gap-3 mt-6">
        <Link to="/learning/ai/ai-for-small-business" className="text-sm font-semibold text-emerald-300 no-underline hover:text-white transition-colors">
          ← Lesson 11: AI for Small Business
        </Link>
        <Link to="/learning/ai/privacy-and-safety" className="text-sm font-semibold text-emerald-300 no-underline hover:text-white transition-colors">
          Lesson 13: Privacy and Safety with AI →
        </Link>
      </div>
    </>
  )
}
