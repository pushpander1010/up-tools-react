import { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import FAQ from '../components/FAQ'

const TITLE = 'Fine-Tuning vs Prompting: When to Custom Train, Prompt, or Use RAG'
const DESC = 'Learn when to use Prompt Engineering, RAG (Retrieval-Augmented Generation), or Fine-Tuning — interactive decision flowchart animator, dynamic cost vs accuracy tradeoff simulator comparing prompting, RAG and fine-tuning on sample tasks, LoRA/PEFT concepts, production Python & JavaScript code, 5 practice questions, and 4 FAQs.'
const URL = 'https://www.uptools.in/learning/ai/finetuning-vs-prompting/'

// ---------------------------------------------------------------------------
// Real-world sample tasks for comparison
// ---------------------------------------------------------------------------
const SAMPLE_TASKS = [
  {
    id: 'customer-support',
    name: '🎧 E-commerce Support Bot',
    desc: 'Real-time order lookup, dynamic shipping policies & return FAQs.',
    knowledgeType: 'Dynamic / Frequently Changing',
    idealApproach: 'RAG (Retrieval-Augmented Generation)',
    bestChoice: 'rag',
    tokenInputPrompt: 1800,
    tokenInputRag: 650,
    tokenInputFT: 180,
    accuracy: { prompting: 72, rag: 95, finetune: 76 },
    latencyMs: { prompting: 780, rag: 620, finetune: 210 },
    setupCostUsd: { prompting: 0, rag: 15, finetune: 120 },
    costPer1kCalls: { prompting: 3.5, rag: 1.4, finetune: 0.5 },
    reasoning: 'Policies and inventory change daily. Fine-tuning bakes static facts into model weights that quickly become obsolete and cause hallucinations. RAG allows real-time vector document updates in under 2 seconds without retraining.',
    flowPath: ['start', 'dynamic-facts', 'rag-node'],
  },
  {
    id: 'sql-generation',
    name: '💻 Enterprise Text-to-SQL Engine',
    desc: 'Translating plain English to complex PostgreSQL queries with strict table join rules.',
    knowledgeType: 'Static Syntax & Strict Schema Rules',
    idealApproach: 'LoRA Fine-Tuning (Small 8B Model)',
    bestChoice: 'finetune',
    tokenInputPrompt: 2400,
    tokenInputRag: 950,
    tokenInputFT: 120,
    accuracy: { prompting: 68, rag: 81, finetune: 96 },
    latencyMs: { prompting: 920, rag: 750, finetune: 180 },
    setupCostUsd: { prompting: 0, rag: 25, finetune: 85 },
    costPer1kCalls: { prompting: 4.8, rag: 2.1, finetune: 0.35 },
    reasoning: 'Prompting requires pasting entire 40-table DDL schemas on every call, consuming huge context windows. Fine-tuning a small 8B model (Llama-3 or Mistral) bakes dialect syntax and table schema relations directly into weights, cutting input tokens by 95% and boosting accuracy.',
    flowPath: ['start', 'static-behavior', 'strict-format', 'high-volume', 'ft-node'],
  },
  {
    id: 'medical-summary',
    name: '🏥 Clinical Discharge Summaries',
    desc: 'Extracting patient symptoms into deterministic ICD-10 clinical discharge records.',
    knowledgeType: 'Strict Format + Patient Specifics',
    idealApproach: 'Fine-Tuning + RAG Hybrid',
    bestChoice: 'hybrid',
    tokenInputPrompt: 2100,
    tokenInputRag: 800,
    tokenInputFT: 220,
    accuracy: { prompting: 74, rag: 86, finetune: 98 },
    latencyMs: { prompting: 850, rag: 680, finetune: 260 },
    setupCostUsd: { prompting: 0, rag: 30, finetune: 250 },
    costPer1kCalls: { prompting: 4.2, rag: 1.8, finetune: 0.6 },
    reasoning: 'Medical formatting requires deterministic compliance with standardized medical dictionaries. Fine-tuning guarantees flawless structural output, while RAG retrieves individual patient test records from hospital EHR systems.',
    flowPath: ['start', 'strict-format', 'dynamic-facts', 'hybrid-node'],
  },
  {
    id: 'legal-contract',
    name: '⚖️ Legal M&A Clause Reviewer',
    desc: 'Auditing 100-page proprietary acquisition contracts for indemnification liability risks.',
    knowledgeType: 'Unique Private Documents',
    idealApproach: 'RAG + Prompt Engineering',
    bestChoice: 'rag',
    tokenInputPrompt: 3500,
    tokenInputRag: 900,
    tokenInputFT: 300,
    accuracy: { prompting: 64, rag: 94, finetune: 71 },
    latencyMs: { prompting: 1200, rag: 820, finetune: 310 },
    setupCostUsd: { prompting: 0, rag: 20, finetune: 180 },
    costPer1kCalls: { prompting: 7.2, rag: 1.9, finetune: 0.8 },
    reasoning: 'Every contract is completely unique and has never been seen in training data. Fine-tuning cannot memorize contract specifics without severe hallucination. RAG extracts exact verbatim paragraphs with page citations for legal compliance.',
    flowPath: ['start', 'dynamic-facts', 'rag-node'],
  },
  {
    id: 'brand-voice',
    name: '✍️ Brand Persona Copywriter',
    desc: 'Writing marketing copy with a quirky, sarcastic, and highly distinct corporate tone.',
    knowledgeType: 'Style, Voice & Cadence',
    idealApproach: 'LoRA Fine-Tuning',
    bestChoice: 'finetune',
    tokenInputPrompt: 1400,
    tokenInputRag: 700,
    tokenInputFT: 100,
    accuracy: { prompting: 66, rag: 73, finetune: 95 },
    latencyMs: { prompting: 650, rag: 580, finetune: 150 },
    setupCostUsd: { prompting: 0, rag: 10, finetune: 60 },
    costPer1kCalls: { prompting: 2.8, rag: 1.5, finetune: 0.28 },
    reasoning: 'Describing a nuanced voice in prompts requires 500+ words of few-shot examples that models frequently drift away from mid-generation. Fine-tuning internalizes vocabulary cadence and punctuation habits permanently.',
    flowPath: ['start', 'static-behavior', 'brand-tone', 'ft-node'],
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
    q: 'When should you choose Fine-Tuning over Prompt Engineering and RAG?',
    a: 'Choose Fine-Tuning when you need to teach an AI model how to behave rather than what to know. Specifically: 1) Enforcing strict, deterministic output structures (like custom JSON schemas or compiler-safe SQL syntax), 2) Internalizing a distinct brand voice or specialized medical/legal writing style, 3) Slashing inference latency and token costs by replacing a 70B parameter flagship model (like GPT-4o) with a compact 8B open-source model (like Llama 3 or Mistral) that doesn’t require lengthy few-shot prompts.',
  },
  {
    q: 'Can you use Fine-Tuning to teach an AI model new facts or private company documentation?',
    a: 'No. Fine-tuning is notoriously ineffective for injecting factual knowledge or private corporate data. When you fine-tune on factual text, the model learns the statistical writing style but frequently hallucinates dates, numbers, and policies with false confidence. Furthermore, updating facts requires an expensive retraining run. Use RAG (Retrieval-Augmented Generation) for facts, private docs, and real-time knowledge, because vector databases update instantly and provide verbatim citations.',
  },
  {
    q: 'What is LoRA (Low-Rank Adaptation) and why is it preferred over Full-Parameter Fine-Tuning?',
    a: 'Full-parameter fine-tuning modifies every single weight in a foundation model (e.g. all 8 billion weights in Llama-3-8B), requiring multiple high-end enterprise GPUs (A100/H100), massive VRAM, and generating multi-gigabyte checkpoints for every task. LoRA freezes 100% of the original model weights and injects tiny trainable rank-decomposition adapter matrices (typically Rank r=8 or 16) into attention layers. This trains less than 0.1% of the total parameters, cuts GPU VRAM requirements by 75%, and produces adapter files of only 20MB to 100MB that can be hot-swapped dynamically.',
  },
  {
    q: 'How does fine-tuning a smaller model save significant money at enterprise scale?',
    a: 'Prompting a flagship generalist model (e.g. GPT-4o) with 1,500 tokens of system instructions and few-shot examples costs approximately ₹0.30 to ₹0.60 per query. If you handle 1,000,000 queries per month, your API bill exceeds ₹3,00,000 to ₹6,00,000. By fine-tuning a compact 8B model (or GPT-4o-mini), the instructions are baked into the weights, reducing the input prompt to just 50 tokens. At scale, this reduces inference costs by 85% to 92%, paying for the upfront $50–$150 fine-tuning training cost in just a few days.',
  },
  {
    q: 'What does a standard instruction fine-tuning dataset look like, and how many examples are needed?',
    a: 'Instruction datasets are typically formatted as JSONL (JSON Lines) files where each line is an object containing a "messages" array with system, user, and assistant roles. For modern parameter-efficient fine-tuning (LoRA), data quality vastly outweighs quantity. As few as 200 to 1,000 meticulously verified, high-quality input-output pairs produce exceptional domain adaptation, whereas 50,000 noisy or inconsistent samples will degrade model coherence.',
  },
]

const FAQS = [
  {
    q: 'How much does it cost to fine-tune an AI model like GPT-4o-mini or Llama 3 with LoRA?',
    a: 'Fine-tuning costs are surprisingly affordable. Fine-tuning GPT-4o-mini on OpenAI’s managed platform with a 1,000-example dataset (~500,000 training tokens) costs approximately $1.50 to $5.00 (₹130 to ₹450) per training epoch. Fine-tuning an open-source model like Llama 3 8B using LoRA / QLoRA with Unsloth on a single cloud Nvidia A10G or T4 GPU (e.g., RunPod or Google Colab Pro) costs under $2.00 in compute credits and finishes in under 45 minutes.',
  },
  {
    q: 'What is Catastrophic Forgetting, and how do you prevent it during fine-tuning?',
    a: 'Catastrophic forgetting occurs when a neural network overfits to a narrow domain dataset during fine-tuning and loses its general reasoning, math, and conversational abilities. You can prevent it by: 1) Using LoRA/PEFT instead of full fine-tuning, keeping original base weights frozen, 2) Keeping the learning rate low (e.g. 1e-4 to 2e-5) with a cosine warmup schedule, 3) Limiting training to 2–3 epochs, and 4) Mixing a small percentage of general instruction data into your domain training set.',
  },
  {
    q: 'Can I combine RAG and Fine-Tuning in the same production AI architecture?',
    a: 'Yes, this is known as the "RAG + Fine-Tuning Hybrid Architecture" and represents the gold standard for enterprise AI. You fine-tune a model to master specialized output structures, domain terminology, and reasoning protocols (e.g. medical SOAP notes or legal compliance checklists), and then connect that fine-tuned model to a RAG pipeline that feeds dynamic, private customer files or live database records at runtime.',
  },
  {
    q: 'Do I need a cluster of enterprise GPUs to fine-tune open-source models?',
    a: 'No. Thanks to QLoRA (Quantized Low-Rank Adaptation), which loads base models in 4-bit NormalFloat precision while computing adapter gradients in 16-bit brain float, you can fine-tune an 8-billion parameter model (like Llama-3-8B) on a consumer GPU with just 16GB of VRAM (such as an RTX 4080 or T4). For higher throughput, serverless platforms like Together AI, Predibase, and Fireworks provide managed fine-tuning endpoints with zero GPU management.',
  },
]

const PY_CODE = `# Complete End-to-End Fine-Tuning Pipeline in Python
# 1. Prepare JSONL Dataset
# 2. Train with HuggingFace PEFT / LoRA (Unsloth / TRL)
# 3. Alternatively dispatch managed OpenAI Fine-Tuning Job

import json
import os

# ---------------------------------------------------------------------------
# Step 1: Format Domain Training Data into JSONL Messages Format
# ---------------------------------------------------------------------------
training_data = [
    {
        "messages": [
            {"role": "system", "content": "You are a specialized Text-to-SQL compiler for PostgreSQL."},
            {"role": "user", "content": "Find total revenue for customers in Tokyo during Q3 2026."},
            {"role": "assistant", "content": "SELECT c.id, c.name, SUM(o.amount) AS total_revenue FROM customers c JOIN orders o ON c.id = o.customer_id WHERE c.city = 'Tokyo' AND o.created_at BETWEEN '2026-07-01' AND '2026-09-30' GROUP BY c.id, c.name ORDER BY total_revenue DESC;"}
        ]
    },
    {
        "messages": [
            {"role": "system", "content": "You are a specialized Text-to-SQL compiler for PostgreSQL."},
            {"role": "user", "content": "Count active subscriptions that renewed in the last 7 days."},
            {"role": "assistant", "content": "SELECT COUNT(*) AS active_renewals FROM subscriptions WHERE status = 'active' AND last_renewed_at >= NOW() - INTERVAL '7 days';"}
        ]
    }
]

dataset_path = "sql_finetune_train.jsonl"
with open(dataset_path, "w", encoding="utf-8") as f:
    for entry in training_data:
        f.write(json.dumps(entry) + "\\n")
print(f"✓ Saved {len(training_data)} instruction samples to {dataset_path}")

# ---------------------------------------------------------------------------
# Step 2: Option A - Managed OpenAI Fine-Tuning (Cloud API)
# ---------------------------------------------------------------------------
def run_openai_finetuning():
    from openai import OpenAI
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    # Upload training file
    file_obj = client.files.create(
        file=open(dataset_path, "rb"),
        purpose="fine-tune"
    )
    print(f"✓ Uploaded file ID: {file_obj.id}")

    # Launch Fine-Tuning Job with gpt-4o-mini base model
    job = client.fine_tuning.jobs.create(
        training_file=file_obj.id,
        model="gpt-4o-mini-2024-07-18",
        hyperparameters={"n_epochs": 3, "batch_size": 2}
    )
    print(f"🚀 Launched OpenAI Fine-Tuning Job ID: {job.id} | Status: {job.status}")
    return job.id

# ---------------------------------------------------------------------------
# Step 3: Option B - Open-Source LoRA Fine-Tuning with Unsloth / Hugging Face
# ---------------------------------------------------------------------------
def run_local_lora_training():
    """
    Runs QLoRA on Llama-3-8B using Unsloth & Hugging Face TRL SFTTrainer.
    Requires: pip install unsloth torch transformers trl peft
    """
    from unsloth import FastLanguageModel
    from trl import SFTTrainer
    from transformers import TrainingArguments
    from datasets import load_dataset

    max_seq_length = 2048
    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name="unsloth/llama-3-8b-Instruct-bnb-4bit",
        max_seq_length=max_seq_length,
        load_in_4bit=True,
    )

    # Configure LoRA Adapter Layers
    model = FastLanguageModel.get_peft_model(
        model,
        r=16, # LoRA Rank
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
        lora_alpha=16,
        lora_dropout=0, # Optimized 0 for Unsloth
        bias="none",
    )

    # Load and format dataset
    dataset = load_dataset("json", data_files=dataset_path, split="train")

    trainer = SFTTrainer(
        model=model,
        tokenizer=tokenizer,
        train_dataset=dataset,
        dataset_text_field="messages",
        max_seq_length=max_seq_length,
        args=TrainingArguments(
            per_device_train_batch_size=2,
            gradient_accumulation_steps=4,
            warmup_steps=10,
            max_steps=60,
            learning_rate=2e-4,
            fp16=True,
            logging_steps=1,
            output_dir="outputs_sql_lora",
        ),
    )

    print("⚡ Starting LoRA fine-tuning training loop...")
    trainer.train()
    
    # Save lightweight 25MB LoRA adapter weights
    model.save_pretrained("lora_sql_adapter")
    tokenizer.save_pretrained("lora_sql_adapter")
    print("✓ Successfully saved LoRA adapter to ./lora_sql_adapter")`

const JS_CODE = `// Complete Node.js Managed Fine-Tuning & Model Evaluation Script
// npm install openai dotenv
import 'dotenv/config';
import OpenAI from 'openai';
import fs from 'fs';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function main() {
  console.log('--- 1. Uploading Fine-Tuning JSONL Training Set ---');
  const fileStream = fs.createReadStream('./sql_finetune_train.jsonl');
  
  const uploadResponse = await openai.files.create({
    file: fileStream,
    purpose: 'fine-tune',
  });
  console.log(\`✓ Training File Uploaded. File ID: \${uploadResponse.id}\`);

  console.log('\\n--- 2. Creating Managed Fine-Tuning Job ---');
  const fineTuneJob = await openai.fineTuning.jobs.create({
    training_file: uploadResponse.id,
    model: 'gpt-4o-mini-2024-07-18',
    hyperparameters: {
      n_epochs: 3,
    },
    suffix: 'sql-dialect-v1',
  });
  console.log(\`🚀 Fine-Tuning Job Created: \${fineTuneJob.id}\`);
  console.log(\`Current Status: \${fineTuneJob.status}\`);

  // -------------------------------------------------------------------------
  // 3. Inference with Custom Fine-Tuned Model Identifier
  // -------------------------------------------------------------------------
  // Once status is 'succeeded', your model is available under fineTuneJob.fine_tuned_model
  const customModelId = fineTuneJob.fine_tuned_model || 'ft:gpt-4o-mini-2024-07-18:my-org:sql-dialect-v1:9Ax4Kb2';

  console.log(\`\\n--- 3. Running Production Inference on \${customModelId} ---\`);
  try {
    const response = await openai.chat.completions.create({
      model: customModelId,
      messages: [
        { role: 'user', content: 'List top 5 products with stock under 10 units ordered by lowest inventory.' }
      ],
      temperature: 0.1, // Low temperature for deterministic SQL
    });

    console.log('✓ Fast Fine-Tuned Model Response:');
    console.log(response.choices[0].message.content);
    console.log(\`Tokens used (Prompt + Completion): \${response.usage.total_tokens}\`);
  } catch (err) {
    console.log('Model training in progress on cloud GPU cluster...');
  }
}

main().catch(console.error);`

export default function FinetunePage() {
  const [activeTab, setActiveTab] = useState('flowchart') // 'flowchart' | 'tradeoff' | 'matrix' | 'peft'
  const [selectedTaskId, setSelectedTaskId] = useState(SAMPLE_TASKS[0].id)
  
  // Tradeoff & ROI Simulator State
  const [monthlyVolume, setMonthlyVolume] = useState(50000)
  const [inputPromptTokens, setInputPromptTokens] = useState(1500) // Baseline prompt size
  const [activeApproach, setActiveApproach] = useState('all') // 'all' | 'prompting' | 'rag' | 'finetune'

  // Interactive Flowchart Wizard State
  const [flowDynamicKnowledge, setFlowDynamicKnowledge] = useState('no') // 'yes' | 'no'
  const [flowStrictFormat, setFlowStrictFormat] = useState('yes') // 'yes' | 'no'
  const [flowMonthlyScale, setFlowMonthlyScale] = useState('high') // 'low' | 'high'

  const canvasRef = useRef(null)

  // Current Selected Task
  const currentTask = useMemo(() => {
    return SAMPLE_TASKS.find(t => t.id === selectedTaskId) || SAMPLE_TASKS[0]
  }, [selectedTaskId])

  // Computed Dynamic Flow Decision Result
  const computedDecision = useMemo(() => {
    if (flowDynamicKnowledge === 'yes' && flowStrictFormat === 'yes') {
      return {
        strategy: 'RAG + Fine-Tuning Hybrid',
        color: '#a855f7',
        badge: '👑 Enterprise Gold Standard',
        desc: 'Fine-tune a compact 8B model to enforce strict clinical/legal formatting and domain syntax, while using RAG vector search to inject real-time private documents and dynamic facts.',
        nodeHighlight: 'hybrid',
      }
    }
    if (flowDynamicKnowledge === 'yes') {
      return {
        strategy: 'RAG (Retrieval-Augmented Generation)',
        color: '#38bdf8',
        badge: '📚 Dynamic Knowledge Winner',
        desc: 'Store facts, FAQs, and documents in a vector database (Pinecone/Chroma/pgvector). Update knowledge in 1 second without retraining model weights.',
        nodeHighlight: 'rag',
      }
    }
    if (flowStrictFormat === 'yes' && flowMonthlyScale === 'high') {
      return {
        strategy: 'LoRA Fine-Tuning (Small 8B Model)',
        color: '#10b981',
        badge: '⚡ High-Volume Cost & Latency Winner',
        desc: 'Bake format, syntax, and tone directly into model weights. Reduces input prompt size from 1,500 tokens to 50 tokens, slashing API costs by 90% and dropping latency to sub-200ms.',
        nodeHighlight: 'finetune',
      }
    }
    return {
      strategy: 'Prompt Engineering & Few-Shot Examples',
      color: '#f59e0b',
      badge: '🎯 Fast Prototyping Winner',
      desc: 'Use system instructions and 3–5 few-shot examples with modern flagship models (GPT-4o / Claude 3.5). Zero upfront training cost and immediate deployment.',
      nodeHighlight: 'prompting',
    }
  }, [flowDynamicKnowledge, flowStrictFormat, flowMonthlyScale])

  // Monthly Cost Calculations for Tradeoff Tab
  const calculatedCosts = useMemo(() => {
    // Standard flagship model token pricing: Input ₹0.02 / 1K, Output ₹0.08 / 1K
    // Small fine-tuned model token pricing: Input ₹0.003 / 1K, Output ₹0.012 / 1K
    // RAG overhead: Vector search + chunk embedding ₹0.001 / query
    const promptInputPerCall = inputPromptTokens
    const promptOutputPerCall = 250
    const costPrompting = (monthlyVolume * ((promptInputPerCall * 0.02 + promptOutputPerCall * 0.08) / 1000))

    const ragInputPerCall = 500 // Focused retrieved context
    const costRag = (monthlyVolume * ((ragInputPerCall * 0.02 + promptOutputPerCall * 0.08) / 1000)) + (monthlyVolume * 0.002)

    const ftInputPerCall = 80 // Minimal prompt since instructions are baked into weights
    const upfrontAmortizedMonthly = 1500 // ₹1,500 one-time fine-tune cost spread over month
    const costFineTuning = upfrontAmortizedMonthly + (monthlyVolume * ((ftInputPerCall * 0.004 + promptOutputPerCall * 0.015) / 1000))

    const savingsVsPrompting = Math.max(0, costPrompting - costFineTuning)
    const breakEvenQueries = Math.ceil(1500 / (((promptInputPerCall * 0.02 + promptOutputPerCall * 0.08) / 1000) - ((ftInputPerCall * 0.004 + promptOutputPerCall * 0.015) / 1000)))

    return {
      prompting: Math.round(costPrompting),
      rag: Math.round(costRag),
      finetuning: Math.round(costFineTuning),
      savings: Math.round(savingsVsPrompting),
      breakEven: breakEvenQueries > 0 ? breakEvenQueries : 12000,
    }
  }, [monthlyVolume, inputPromptTokens])

  // Canvas Flowchart Visualizer
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

    // Clear background
    ctx.fillStyle = '#0a0f1d'
    ctx.fillRect(0, 0, width, height)

    // Draw Flowchart Decision Graph
    // 4 Outcome Pillars: Prompting, RAG, Fine-Tuning, Hybrid
    const leftPad = 20
    const topPad = 35
    const cardW = 150
    const cardH = 50

    // Coordinates of 4 decision nodes
    const nodes = [
      {
        id: 'prompting',
        title: '🎯 Prompt Engineering',
        sub: 'Low Volume / Static Docs',
        x: leftPad,
        y: topPad + 20,
        color: '#f59e0b',
        active: computedDecision.nodeHighlight === 'prompting',
      },
      {
        id: 'rag',
        title: '📚 RAG (Vector DB)',
        sub: 'Dynamic Facts & Citations',
        x: leftPad + cardW + 20,
        y: topPad + 20,
        color: '#38bdf8',
        active: computedDecision.nodeHighlight === 'rag',
      },
      {
        id: 'finetune',
        title: '⚡ LoRA Fine-Tuning',
        sub: 'Format, Tone & Speed',
        x: leftPad + (cardW + 20) * 2,
        y: topPad + 20,
        color: '#10b981',
        active: computedDecision.nodeHighlight === 'finetune',
      },
      {
        id: 'hybrid',
        title: '👑 RAG + Fine-Tuning',
        sub: 'Enterprise Compliance',
        x: leftPad + (cardW + 20) * 3,
        y: topPad + 20,
        color: '#a855f7',
        active: computedDecision.nodeHighlight === 'hybrid',
      },
    ]

    // Draw connection pipes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(leftPad + cardW / 2, topPad + 130)
    ctx.lineTo(width - leftPad - cardW / 2, topPad + 130)
    ctx.stroke()

    // Draw active decision flow glow line
    nodes.forEach((n) => {
      const isSelected = n.active
      ctx.fillStyle = isSelected ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.03)'
      ctx.strokeStyle = isSelected ? n.color : 'rgba(255, 255, 255, 0.1)'
      ctx.lineWidth = isSelected ? 2 : 1

      if (isSelected) {
        ctx.shadowColor = n.color
        ctx.shadowBlur = 12
      }

      ctx.beginPath()
      ctx.roundRect(n.x, n.y, cardW, cardH, 8)
      ctx.fill()
      ctx.stroke()
      ctx.shadowBlur = 0

      // Node text
      ctx.fillStyle = isSelected ? '#ffffff' : '#94a3b8'
      ctx.font = isSelected ? 'bold 11px sans-serif' : '10px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(n.title, n.x + cardW / 2, n.y + 20)

      ctx.fillStyle = isSelected ? n.color : '#64748b'
      ctx.font = '9px monospace'
      ctx.fillText(n.sub, n.x + cardW / 2, n.y + 36)
    })

    // Bottom telemetry bar
    const barY = height - 55
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)'
    ctx.fillRect(leftPad, barY, width - leftPad * 2, 42)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
    ctx.strokeRect(leftPad, barY, width - leftPad * 2, 42)

    ctx.textAlign = 'left'
    ctx.fillStyle = '#94a3b8'
    ctx.font = '10px sans-serif'
    ctx.fillText(`RECOMMENDED ARCHITECTURE FOR CURRENT PARAMETERS:`, leftPad + 12, barY + 16)

    ctx.fillStyle = computedDecision.color
    ctx.font = 'bold 12px sans-serif'
    ctx.fillText(`${computedDecision.strategy} (${computedDecision.badge})`, leftPad + 12, barY + 32)
  }, [computedDecision])

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
    name: 'How to Choose Between Prompting, RAG, and Fine-Tuning for AI Applications',
    step: [
      {
        '@type': 'HowToStep',
        text: 'Assess Knowledge Dynamics: If your application requires real-time facts, inventory counts, or private company wikis, choose RAG. Fine-tuning bakes static facts that cause hallucinations.',
      },
      {
        '@type': 'HowToStep',
        text: 'Evaluate Output Structure & Latency: If you require deterministic JSON output schemas, strict SQL syntax, or sub-200ms latency on a compact 8B model, choose LoRA Fine-Tuning.',
      },
      {
        '@type': 'HowToStep',
        text: 'Benchmark Prompt Engineering Baseline: Always start by prototyping with zero-shot and few-shot prompt engineering on a flagship model to establish your quality bar.',
      },
      {
        '@type': 'HowToStep',
        text: 'Calculate Monthly Query Break-Even: If monthly volume exceeds 50,000 queries, fine-tuning a small model amortizes training costs and saves up to 85% on token bills.',
      },
      {
        '@type': 'HowToStep',
        text: 'Deploy RAG + Fine-Tuning Hybrid for Enterprise: Fine-tune for structural tone and reasoning protocol compliance, and feed dynamic retrieved chunks at inference time.',
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
        <meta property="og:image" content="https://www.uptools.in/assets/learning/ai/ai-lesson15-hero.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${TITLE} | UpTools`} />
        <meta name="twitter:description" content={DESC} />
        <meta name="twitter:image" content="https://www.uptools.in/assets/learning/ai/ai-lesson15-hero.jpg" />
        <meta
          name="keywords"
          content="fine-tuning vs prompting, RAG vs fine-tuning, LoRA fine tuning, parameter efficient fine tuning, PEFT, train custom LLM, prompt engineering vs fine tuning, AI cost trade-off, small models vs GPT-4o"
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
              { '@type': 'ListItem', position: 4, name: 'Fine-tuning vs Prompting', item: URL },
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
        <span className="text-slate-300 font-medium">Fine-tuning vs Prompting</span>
      </nav>

      {/* BADGE & HEADER */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 mb-4">
        <span>🎛️</span> AI · Lesson 15 · Beginner
      </div>
      <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight m-0 mb-3">
        Fine-Tuning vs Prompting: When to Custom Train, Prompt, or Use RAG
      </h1>
      <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-3xl">
        Should you craft a 1,000-token prompt, build a <strong>RAG vector pipeline</strong>, or train <strong>custom LoRA weights</strong> on a smaller model? Learn how to evaluate trade-offs in accuracy, latency, and cloud bills, avoid catastrophic hallucinations, and choose the optimal AI architecture for your application.
      </p>

      <figure className="m-0 mb-6 rounded-xl border border-white/10 overflow-hidden">
        <img src="/assets/learning/ai/ai-lesson15-hero.jpg" alt="Robot at a fork between prompting and training paths" loading="lazy" />
      </figure>

      {/* LIVE INTERACTIVE SIMULATOR & DECISION FLOWCHART */}
      <section
        className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6"
        aria-label="Live Fine-Tuning vs Prompting Decision Animator & Tradeoff Simulator"
      >
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-white m-0">▶ Live Decision Engine &amp; Cost/Accuracy Tradeoff Simulator</h2>
            <p className="text-xs text-slate-400 m-0 mt-0.5">
              Select real-world sample tasks, adjust decision criteria, and calculate volume break-even ROI between Prompting, RAG, and LoRA Fine-Tuning.
            </p>
          </div>
          <div className="flex rounded-xl bg-black/40 border border-white/10 p-1 flex-wrap gap-1">
            <button
              onClick={() => setActiveTab('flowchart')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-all ${
                activeTab === 'flowchart' ? 'bg-emerald-500/30 text-emerald-300' : 'text-slate-400 bg-transparent hover:text-white'
              }`}
            >
              🎛️ Decision Flowchart
            </button>
            <button
              onClick={() => setActiveTab('tradeoff')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-all ${
                activeTab === 'tradeoff' ? 'bg-emerald-500/30 text-emerald-300' : 'text-slate-400 bg-transparent hover:text-white'
              }`}
            >
              ⚖️ Cost vs Accuracy Slider
            </button>
            <button
              onClick={() => setActiveTab('matrix')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-all ${
                activeTab === 'matrix' ? 'bg-emerald-500/30 text-emerald-300' : 'text-slate-400 bg-transparent hover:text-white'
              }`}
            >
              📊 Comparison Matrix
            </button>
            <button
              onClick={() => setActiveTab('peft')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-all ${
                activeTab === 'peft' ? 'bg-emerald-500/30 text-emerald-300' : 'text-slate-400 bg-transparent hover:text-white'
              }`}
            >
              🧬 LoRA &amp; PEFT Tech
            </button>
          </div>
        </div>

        {/* TAB 1: FLOWCHART & SAMPLE TASK SELECTOR */}
        {activeTab === 'flowchart' && (
          <div className="space-y-4">
            {/* SAMPLE TASK PRESETS */}
            <div>
              <div className="text-xs font-semibold text-slate-400 mb-2">1. Explore Real-World Sample Use Cases:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                {SAMPLE_TASKS.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => {
                      setSelectedTaskId(task.id)
                      if (task.bestChoice === 'rag') {
                        setFlowDynamicKnowledge('yes')
                        setFlowStrictFormat('no')
                      } else if (task.bestChoice === 'finetune') {
                        setFlowDynamicKnowledge('no')
                        setFlowStrictFormat('yes')
                        setFlowMonthlyScale('high')
                      } else if (task.bestChoice === 'hybrid') {
                        setFlowDynamicKnowledge('yes')
                        setFlowStrictFormat('yes')
                      } else {
                        setFlowDynamicKnowledge('no')
                        setFlowStrictFormat('no')
                      }
                    }}
                    className={`p-2.5 rounded-xl text-left border cursor-pointer transition-all ${
                      selectedTaskId === task.id
                        ? 'bg-white/10 border-emerald-500/50 shadow-lg'
                        : 'bg-black/30 border-white/5 hover:border-white/20 text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold text-white truncate">{task.name}</div>
                    <div className="text-[10px] text-emerald-400 font-mono mt-0.5 truncate">{task.idealApproach}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* FLOWCHART CANVAS */}
            <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0a0f1d]">
              <canvas
                ref={canvasRef}
                width={700}
                height={160}
                className="w-full block"
                style={{ maxHeight: '180px' }}
              />
            </div>

            {/* TWO COLUMN INTERACTIVE WIZARD & TASK METRICS */}
            <div className="grid lg:grid-cols-2 gap-4">
              {/* LEFT COLUMN: INTERACTIVE CRITERIA CONTROLS */}
              <div className="space-y-3 rounded-xl bg-black/40 border border-white/10 p-4">
                <div className="flex items-center justify-between text-xs font-semibold text-white border-b border-white/10 pb-2">
                  <span>🛠️ Architecture Decision Criteria</span>
                  <span className="text-[10px] font-mono text-emerald-400">Interactive Evaluator</span>
                </div>

                {/* Criterion 1: Knowledge Freshness */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">1. Does it need real-time facts or private docs?</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setFlowDynamicKnowledge('yes')}
                      className={`py-1.5 px-3 rounded-lg text-xs font-semibold border cursor-pointer transition-all ${
                        flowDynamicKnowledge === 'yes'
                          ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
                          : 'bg-white/5 text-slate-400 border-transparent hover:text-white'
                      }`}
                    >
                      ✓ Yes (Dynamic / Live Facts)
                    </button>
                    <button
                      onClick={() => setFlowDynamicKnowledge('no')}
                      className={`py-1.5 px-3 rounded-lg text-xs font-semibold border cursor-pointer transition-all ${
                        flowDynamicKnowledge === 'no'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                          : 'bg-white/5 text-slate-400 border-transparent hover:text-white'
                      }`}
                    >
                      ✕ No (Static Rules / Syntax)
                    </button>
                  </div>
                </div>

                {/* Criterion 2: Formatting & Style Strictness */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">2. Is strict output formatting / tone required?</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setFlowStrictFormat('yes')}
                      className={`py-1.5 px-3 rounded-lg text-xs font-semibold border cursor-pointer transition-all ${
                        flowStrictFormat === 'yes'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                          : 'bg-white/5 text-slate-400 border-transparent hover:text-white'
                      }`}
                    >
                      ✓ Yes (Deterministic Style / SQL)
                    </button>
                    <button
                      onClick={() => setFlowStrictFormat('no')}
                      className={`py-1.5 px-3 rounded-lg text-xs font-semibold border cursor-pointer transition-all ${
                        flowStrictFormat === 'no'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                          : 'bg-white/5 text-slate-400 border-transparent hover:text-white'
                      }`}
                    >
                      ✕ No (General Natural Language)
                    </button>
                  </div>
                </div>

                {/* Criterion 3: Volume Scale */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">3. Expected monthly query volume:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setFlowMonthlyScale('high')}
                      className={`py-1.5 px-3 rounded-lg text-xs font-semibold border cursor-pointer transition-all ${
                        flowMonthlyScale === 'high'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                          : 'bg-white/5 text-slate-400 border-transparent hover:text-white'
                      }`}
                    >
                      🚀 High Scale (&gt;50K queries/mo)
                    </button>
                    <button
                      onClick={() => setFlowMonthlyScale('low')}
                      className={`py-1.5 px-3 rounded-lg text-xs font-semibold border cursor-pointer transition-all ${
                        flowMonthlyScale === 'low'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                          : 'bg-white/5 text-slate-400 border-transparent hover:text-white'
                      }`}
                    >
                      🌱 Low Scale (&lt;10K queries/mo)
                    </button>
                  </div>
                </div>

                {/* Live Recommendation Badge */}
                <div className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Recommended Strategy:</div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span style={{ color: computedDecision.color }}>●</span> {computedDecision.strategy}
                  </div>
                  <p className="text-xs text-slate-300 m-0 leading-relaxed pt-1">
                    {computedDecision.desc}
                  </p>
                </div>
              </div>

              {/* RIGHT COLUMN: ACTIVE TASK ANALYSIS & METRICS */}
              <div className="space-y-3 rounded-xl bg-black/40 border border-white/10 p-4">
                <div className="flex items-center justify-between text-xs font-semibold text-white border-b border-white/10 pb-2">
                  <span>📋 {currentTask.name}</span>
                  <span className="text-[10px] font-mono text-slate-400">Benchmark Metrics</span>
                </div>

                <p className="text-xs text-slate-300 m-0 leading-relaxed">
                  {currentTask.desc}
                </p>

                {/* 3-Way Head-to-Head Comparison Bars */}
                <div className="space-y-2.5 pt-1">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-amber-400 font-semibold">1. Prompt Engineering (Flagship LLM)</span>
                      <span className="text-slate-300 font-mono">{currentTask.accuracy.prompting}% Acc · {currentTask.latencyMs.prompting}ms</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full rounded-full" style={{ width: `${currentTask.accuracy.prompting}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-sky-400 font-semibold">2. RAG (Vector Document Retrieval)</span>
                      <span className="text-slate-300 font-mono">{currentTask.accuracy.rag}% Acc · {currentTask.latencyMs.rag}ms</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div className="bg-sky-400 h-full rounded-full" style={{ width: `${currentTask.accuracy.rag}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-emerald-400 font-semibold">3. LoRA Fine-Tuning (Compact 8B Model)</span>
                      <span className="text-slate-300 font-mono">{currentTask.accuracy.finetune}% Acc · {currentTask.latencyMs.finetune}ms</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${currentTask.accuracy.finetune}%` }} />
                    </div>
                  </div>
                </div>

                {/* Expert Engineering Rationale */}
                <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-xs text-slate-300 leading-relaxed">
                  <span className="font-bold text-emerald-400">💡 Deep-Dive Rationale: </span>
                  {currentTask.reasoning}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COST VS ACCURACY SLIDER */}
        {activeTab === 'tradeoff' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="text-xs font-bold text-white">Monthly Query Volume Slider:</div>
                  <div className="text-[11px] text-slate-400">Drag to observe the ROI break-even point where Fine-Tuning becomes drastically cheaper than Prompting.</div>
                </div>
                <div className="text-sm font-mono font-extrabold text-emerald-300 px-3 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                  {monthlyVolume.toLocaleString()} calls / month
                </div>
              </div>

              <input
                type="range"
                min="1000"
                max="500000"
                step="5000"
                value={monthlyVolume}
                onChange={(e) => setMonthlyVolume(parseInt(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-1">
                <div className="p-3 rounded-xl bg-black/50 border border-amber-500/30">
                  <div className="text-[10px] text-amber-400 uppercase font-semibold">1. Prompt Engineering</div>
                  <div className="text-base sm:text-lg font-mono font-bold text-white mt-1">₹{calculatedCosts.prompting.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">High input token cost</div>
                </div>

                <div className="p-3 rounded-xl bg-black/50 border border-sky-500/30">
                  <div className="text-[10px] text-sky-400 uppercase font-semibold">2. RAG Architecture</div>
                  <div className="text-base sm:text-lg font-mono font-bold text-white mt-1">₹{calculatedCosts.rag.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Vector DB + Top Chunks</div>
                </div>

                <div className="p-3 rounded-xl bg-black/50 border border-emerald-500/30">
                  <div className="text-[10px] text-emerald-400 uppercase font-semibold">3. LoRA Fine-Tuning</div>
                  <div className="text-base sm:text-lg font-mono font-bold text-emerald-300 mt-1">₹{calculatedCosts.finetuning.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Short prompt + 8B model</div>
                </div>

                <div className="p-3 rounded-xl bg-black/50 border border-purple-500/30">
                  <div className="text-[10px] text-purple-400 uppercase font-semibold">Monthly Savings</div>
                  <div className="text-base sm:text-lg font-mono font-bold text-purple-300 mt-1">₹{calculatedCosts.savings.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">vs Prompting Flagship</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-xs text-slate-300 leading-relaxed flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="font-bold text-white">🎯 Break-Even Analysis: </span>
                  At approximately <span className="font-mono text-emerald-300 font-bold">{calculatedCosts.breakEven.toLocaleString()} queries/month</span>, the $20–$50 upfront fine-tuning training cost is 100% paid off by saving 1,400 input tokens on every request.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: COMPARISON MATRIX */}
        {activeTab === 'matrix' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-300 leading-relaxed">
              Detailed technical comparison across Prompt Engineering, RAG, Parameter-Efficient Fine-Tuning (LoRA), and Full Foundation Pre-training:
            </div>
            <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/40">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-slate-400">
                    <th className="p-3 font-bold">Evaluation Axis</th>
                    <th className="p-3 font-bold text-amber-300">Prompt Engineering</th>
                    <th className="p-3 font-bold text-sky-300">RAG (Vector Search)</th>
                    <th className="p-3 font-bold text-emerald-300">LoRA Fine-Tuning</th>
                    <th className="p-3 font-bold text-purple-300">Full Pre-training</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="p-3 font-semibold text-white">Upfront Setup Cost</td>
                    <td className="p-3 text-emerald-400">₹0 (Instant)</td>
                    <td className="p-3 text-slate-300">₹500 - ₹5,000 (Vector DB)</td>
                    <td className="p-3 text-slate-300">₹200 - ₹3,000 (Cloud GPU)</td>
                    <td className="p-3 text-rose-400">₹5 Cr - ₹500 Cr (Supercomputer)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Inference Cost / Call</td>
                    <td className="p-3 text-rose-400">High (Long context)</td>
                    <td className="p-3 text-amber-300">Medium (Retrieved chunks)</td>
                    <td className="p-3 text-emerald-400">Ultra Low (Short prompt)</td>
                    <td className="p-3 text-slate-300">Depends on size</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Knowledge Freshness</td>
                    <td className="p-3 text-slate-300">Fixed at cut-off</td>
                    <td className="p-3 text-emerald-400">Real-time (&lt;1s update)</td>
                    <td className="p-3 text-rose-400">Static (Needs retraining)</td>
                    <td className="p-3 text-rose-400">Static (Frozen weights)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Style &amp; Tone Consistency</td>
                    <td className="p-3 text-amber-300">Moderate (Drifts easily)</td>
                    <td className="p-3 text-slate-300">Moderate</td>
                    <td className="p-3 text-emerald-400">Near 100% Deterministic</td>
                    <td className="p-3 text-emerald-400">High</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Data Labeled Samples</td>
                    <td className="p-3 text-emerald-400">0 - 5 examples</td>
                    <td className="p-3 text-slate-300">Raw PDF / Docs</td>
                    <td className="p-3 text-slate-300">200 - 2,000 pairs</td>
                    <td className="p-3 text-rose-400">Trillions of tokens</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Latency (TTFT)</td>
                    <td className="p-3 text-slate-300">600ms - 1500ms</td>
                    <td className="p-3 text-slate-300">500ms - 900ms</td>
                    <td className="p-3 text-emerald-400">120ms - 250ms (Small 8B)</td>
                    <td className="p-3 text-slate-300">Variable</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Hallucination Risk</td>
                    <td className="p-3 text-amber-300">Moderate</td>
                    <td className="p-3 text-emerald-400">Very Low (Source citations)</td>
                    <td className="p-3 text-rose-400">High on unknown facts</td>
                    <td className="p-3 text-amber-300">Standard LLM rate</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: LORA & PEFT ARCHITECTURE */}
        {activeTab === 'peft' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-300 leading-relaxed">
              Why Low-Rank Adaptation (LoRA) revolutionized modern AI customization:
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="rounded-xl bg-black/40 border border-emerald-500/20 p-3.5 space-y-1.5">
                <div className="text-xs font-bold text-emerald-400">1. Frozen Base Weights (W₀)</div>
                <p className="text-xs text-slate-300 m-0 leading-relaxed">
                  The original 8B/70B model parameters remain 100% frozen in GPU VRAM. Zero degradation to general foundational capabilities or language fluency.
                </p>
              </div>

              <div className="rounded-xl bg-black/40 border border-sky-500/20 p-3.5 space-y-1.5">
                <div className="text-xs font-bold text-sky-400">2. Low-Rank Adapter Matrices (A × B)</div>
                <p className="text-xs text-slate-300 m-0 leading-relaxed">
                  Instead of updating a huge <code className="text-sky-300 font-mono">d × d</code> matrix, LoRA trains two tiny low-rank matrices (<code className="text-sky-300 font-mono">d × r</code> and <code className="text-sky-300 font-mono">r × d</code> where <code className="text-sky-300 font-mono">r=8</code>), slashing trainable parameters by 99.9%.
                </p>
              </div>

              <div className="rounded-xl bg-black/40 border border-purple-500/20 p-3.5 space-y-1.5">
                <div className="text-xs font-bold text-purple-400">3. QLoRA 4-Bit NormalFloat Quantization</div>
                <p className="text-xs text-slate-300 m-0 leading-relaxed">
                  QLoRA quantizes the base model into 4-bit precision, enabling full fine-tuning of an 8B model on a consumer GPU with only 16GB VRAM (e.g. RTX 4080 or cloud T4).
                </p>
              </div>

              <div className="rounded-xl bg-black/40 border border-amber-500/20 p-3.5 space-y-1.5">
                <div className="text-xs font-bold text-amber-400">4. Multi-Tenant Adapter Hot-Swapping</div>
                <p className="text-xs text-slate-300 m-0 leading-relaxed">
                  Since each LoRA adapter is only 20MB to 50MB, a single server can serve thousands of custom fine-tuned company styles by dynamically switching adapters at runtime on the same base GPU.
                </p>
              </div>
            </div>
          </div>
        )}

        <p className="text-[11px] text-slate-500 m-0 mt-3">
          💡 <strong>Golden Rule:</strong> Use <strong>RAG</strong> to teach your model new facts and dynamic documents. Use <strong>Fine-Tuning</strong> to teach your model a specific format, language syntax, tone, and deterministic behavior.
        </p>
      </section>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <figure className="m-0 rounded-xl border border-white/10 overflow-hidden">
          <img src="/assets/learning/ai/ai-lesson15-compare.jpg" alt="Prompting versus RAG versus fine-tuning compared" loading="lazy" />
        </figure>
        <figure className="m-0 rounded-xl border border-white/10 overflow-hidden">
          <img src="/assets/learning/ai/ai-lesson15-launch.jpg" alt="Team launching a custom trained model" loading="lazy" />
        </figure>
      </div>
      {/* EXPLANATION / DEEP DIVE */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-white mt-0 mb-3">The 4 Pillars of the AI Customization Spectrum</h2>
        <ol className="text-sm text-slate-300 leading-relaxed space-y-2.5 list-decimal pl-5 m-0">
          <li>
            <strong className="text-white">Prompt Engineering &amp; Few-Shot Learning:</strong> The starting line for every AI project. You provide instructions, behavioral constraints, and 3–5 input-output examples directly in the context window. Ideal for fast prototyping and low-volume tasks.
          </li>
          <li>
            <strong className="text-white">Retrieval-Augmented Generation (RAG):</strong> Connects your LLM to private internal search engines (vector databases). The model receives dynamically retrieved document snippets right before answering, ensuring up-to-the-minute accuracy and source citations.
          </li>
          <li>
            <strong className="text-white">Parameter-Efficient Fine-Tuning (LoRA / QLoRA):</strong> Bakes specialized formatting, reasoning habits, and domain dialects directly into lightweight neural adapter weights. Reduces prompt token overhead by 90% and enables small 8B models to match flagship models on specific tasks.
          </li>
          <li>
            <strong className="text-white">The RAG + Fine-Tuning Hybrid:</strong> The enterprise pinnacle. You fine-tune a model to master specialized domain workflows (e.g. medical summaries or SQL generation) and feed it live customer records via RAG at inference time.
          </li>
        </ol>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5 text-center">
          {[
            ['Prompting', 'Context Window', 'Fastest to prototype'],
            ['RAG', 'Vector Database', 'Real-time facts & docs'],
            ['Fine-Tuning', 'Weight Updates', 'Tone, syntax & speed'],
            ['Hybrid', 'RAG + LoRA', 'Enterprise Gold Standard'],
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
        <h2 className="text-lg font-bold text-white mt-0 mb-3">Code: Dataset Preparation &amp; Fine-Tuning in Python &amp; JavaScript</h2>
        <p className="text-xs text-slate-400 mt-0 mb-4">
          Complete production-ready scripts featuring JSONL dataset preparation, cloud OpenAI fine-tuning, and open-source LoRA training with Hugging Face &amp; Unsloth:
        </p>
        <div className="space-y-3">
          <CodeBlock lang="Python (JSONL Dataset Prep + Hugging Face LoRA SFTTrainer + OpenAI API)" code={PY_CODE} />
          <CodeBlock lang="JavaScript (Node.js Managed OpenAI Fine-Tuning Dispatch & Custom Model Inference)" code={JS_CODE} />
        </div>
      </section>

      {/* PRACTICE QUESTIONS */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-white mt-0 mb-1">Practice questions</h2>
        <p className="text-xs text-slate-400 mt-0 mb-4">
          Test your understanding of Fine-Tuning, Prompt Engineering, RAG trade-offs, and LoRA architecture.
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

      {/* ENTERPRISE DECISION CHECKLIST */}
      <section
        className="rounded-2xl border border-emerald-500/20 p-5 sm:p-6 mb-6"
        style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(17,24,39,0.4))' }}
      >
        <h2 className="text-lg font-bold text-white mt-0 mb-3">🛠️ Enterprise Model Customization Checklist</h2>
        <ul className="text-sm text-slate-300 leading-relaxed space-y-2 list-disc pl-5 m-0">
          <li>
            <strong className="text-white">Always Start with Few-Shot Prompting:</strong> Never spend time collecting training datasets until you prove that few-shot prompting on a flagship model cannot solve the task.
          </li>
          <li>
            <strong className="text-white">Never Fine-Tune for Dynamic Facts:</strong> If data updates more than once a month, deploy a vector search RAG pipeline instead of fine-tuning.
          </li>
          <li>
            <strong className="text-white">Prioritize Dataset Quality over Quantity:</strong> 500 clean, human-audited prompt-response pairs will outperform 20,000 messy web-scraped examples.
          </li>
          <li>
            <strong className="text-white">Use LoRA to Prevent Catastrophic Forgetting:</strong> Keep foundation base weights frozen and train lightweight rank adapters to maintain general intelligence.
          </li>
          <li>
            <strong className="text-white">Calculate Volume Break-Even ROI:</strong> If monthly query volume exceeds 50,000, fine-tuning an 8B model will cut cloud API bills by up to 85%.
          </li>
        </ul>
      </section>

      {/* FAQ ACCORDION COMPONENT */}
      <FAQ questions={FAQS} />

      {/* PREV / NEXT NAVIGATION */}
      <div className="flex items-center justify-between flex-wrap gap-3 mt-6">
        <Link to="/learning/ai/building-with-apis" className="text-sm font-semibold text-emerald-300 no-underline hover:text-white transition-colors">
          ← Lesson 14: Building with APIs
        </Link>
        <Link to="/learning/ai/checking-ai-quality" className="text-sm font-semibold text-emerald-300 no-underline hover:text-white transition-colors">
          Lesson 16: Checking AI Quality →
        </Link>
      </div>
    </>
  )
}
