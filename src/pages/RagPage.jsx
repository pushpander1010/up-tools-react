import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import FAQ from '../components/FAQ'

const TITLE = 'Chat With Your Documents (RAG): How AI Answers from Your Files'
const DESC = 'Learn Retrieval-Augmented Generation (RAG) with a live interactive simulator — ask questions across 3 sample documents, see retrieved chunks highlighted with source citations, and toggle RAG on/off to compare grounded vs hallucinated answers. Includes Python & JavaScript code, 5 practice questions, 4 FAQs and interview tips.'
const URL = 'https://www.uptools.in/learning/ai/rag-chat-with-documents/'

// ---------------------------------------------------------------------------
// Sample Knowledge Base Documents & Chunks
// ---------------------------------------------------------------------------
const SAMPLE_DOCS = [
  {
    id: 'doc-sec',
    title: 'Cloud Security & SLA Policy v4.2',
    icon: '🛡️',
    badge: 'Security',
    color: '#3b82f6',
    chunks: [
      {
        id: 'sec-1',
        title: 'Data Encryption & Compliance',
        text: 'All customer data at rest is encrypted using AES-256-GCM. Data in transit is enforced via TLS 1.3. Acme is SOC 2 Type II and ISO 27001 certified with annual third-party audits.',
        tags: ['encryption', 'aes-256', 'tls', 'soc2', 'compliance', 'security', 'iso27001'],
      },
      {
        id: 'sec-2',
        title: 'Service Level Agreement (SLA)',
        text: 'Enterprise tier guarantees 99.99% monthly uptime. If uptime drops below 99.99%, customers receive a 10% credit; below 99.5%, a 25% credit is automatically applied to the next billing cycle.',
        tags: ['sla', 'uptime', 'credit', 'enterprise', 'guarantee', '99.99%', 'downtime'],
      },
      {
        id: 'sec-3',
        title: 'Data Retention & Deletion',
        text: 'Upon account termination, all tenant databases and backup snapshots are permanently purged within 30 calendar days using DoD 5220.22-M wiping standards.',
        tags: ['retention', 'deletion', 'purge', '30 days', 'gdpr', 'termination', 'backup'],
      },
    ],
  },
  {
    id: 'doc-bill',
    title: 'Billing, Refunds & License Terms',
    icon: '💳',
    badge: 'Billing',
    color: '#10b981',
    chunks: [
      {
        id: 'bill-1',
        title: 'Refund Eligibility Window',
        text: 'Annual subscriptions are eligible for a full 100% refund within 14 calendar days of initial purchase. Monthly subscriptions are non-refundable but can be canceled at any time to prevent renewal.',
        tags: ['refund', 'annual', '14 days', 'money-back', 'monthly', 'cancellation', 'policy'],
      },
      {
        id: 'bill-2',
        title: 'Cancellation Process',
        text: 'To request a cancellation or refund, users must submit a ticket via support@acmecloud.io or use the billing dashboard under Settings > Billing > Request Cancellation.',
        tags: ['cancellation', 'refund', 'support@acmecloud.io', 'ticket', 'dashboard', 'how to cancel'],
      },
      {
        id: 'bill-3',
        title: 'License Transfers',
        text: 'Pro and Enterprise licenses may be transferred between corporate entities once per calendar quarter upon submission of written authorization from the primary account owner.',
        tags: ['license', 'transfer', 'corporate', 'quarter', 'enterprise', 'ownership'],
      },
    ],
  },
  {
    id: 'doc-api',
    title: 'Developer REST API & Rate Limits',
    icon: '⚡',
    badge: 'API Docs',
    color: '#a855f7',
    chunks: [
      {
        id: 'api-1',
        title: 'Authentication & Headers',
        text: 'All REST API requests require a Bearer token in the Authorization header: `Authorization: Bearer <API_KEY>`. API keys can be provisioned and rotated in the Developer Console.',
        tags: ['api', 'auth', 'authentication', 'bearer', 'token', 'header', 'key'],
      },
      {
        id: 'api-2',
        title: 'Rate Limits & Quotas',
        text: 'Free tier allows 60 requests/minute (1,000/day). Pro tier allows 600 req/min. Enterprise tier provides a dedicated baseline of 5,000 req/min with burst scaling up to 10,000 req/min.',
        tags: ['rate limit', 'quota', 'throughput', '60 req/min', '5000 req/min', 'burst', 'tier'],
      },
      {
        id: 'api-3',
        title: 'Webhook Retries & Backoff',
        text: 'Failed webhook deliveries follow exponential backoff: retrying after 5 seconds, 30 seconds, 5 minutes, and 1 hour. After 4 consecutive delivery failures, the webhook endpoint is disabled.',
        tags: ['webhook', 'retry', 'exponential backoff', 'failures', 'disabled', 'events'],
      },
    ],
  },
]

// Preset queries demonstrating grounded retrieval vs hallucinated guesses
const PRESET_QUERIES = [
  {
    id: 'q-refund',
    question: 'What is the refund window for annual plans and how do I request it?',
    relevantChunkIds: ['bill-1', 'bill-2'],
    ragAnswer:
      'According to the Billing Terms [Doc 2, Chunk 1], annual subscriptions are eligible for a full 100% refund within 14 calendar days of initial purchase. To request your refund, submit a ticket to support@acmecloud.io or navigate to Settings > Billing > Request Cancellation in your dashboard [Doc 2, Chunk 2]. Monthly plans are non-refundable.',
    hallucinatedAnswer:
      'Acme Cloud offers a generous 30-day no-questions-asked money-back guarantee for all customers! You can claim your full refund by emailing our finance team at refunds@acme-billing-support.net and your payment will be credited within 3-5 business days.',
    hallucinationWarning:
      '⚠️ Hallucination Alert: The model fabricated a "30-day guarantee" (the real policy is strictly 14 days for annual plans only) and invented a fake email address "refunds@acme-billing-support.net" (the real contact is support@acmecloud.io). Without RAG context, LLMs guess plausible policies.',
  },
  {
    id: 'q-sla',
    question: 'What is the Enterprise uptime SLA guarantee and what credits apply if breached?',
    relevantChunkIds: ['sec-2'],
    ragAnswer:
      'The Enterprise tier guarantees 99.99% monthly uptime [Doc 1, Chunk 2]. If uptime drops below 99.99%, customers receive a 10% credit. If uptime drops below 99.5%, a 25% credit is automatically credited to the following billing cycle [Doc 1, Chunk 2].',
    hallucinatedAnswer:
      'Enterprise plans come with a 99.9% uptime SLA. In case of downtime exceeding 1 hour, customers are entitled to a prorated 50% refund on their monthly subscription fee upon submitting an incident report within 7 days.',
    hallucinationWarning:
      '⚠️ Hallucination Alert: The model guessed a "99.9% SLA with 50% refund" — completely contradicting the true 99.99% guarantee and tiered 10%/25% automated credit structure in the security policy.',
  },
  {
    id: 'q-api',
    question: 'How do I authenticate API calls and what are the rate limits across tiers?',
    relevantChunkIds: ['api-1', 'api-2'],
    ragAnswer:
      'API calls require Bearer token authentication in the HTTP header: `Authorization: Bearer <API_KEY>` [Doc 3, Chunk 1]. Rate limits are tier-based [Doc 3, Chunk 2]: Free tier is 60 req/min (1,000/day), Pro tier is 600 req/min, and Enterprise tier has a 5,000 req/min baseline with bursts up to 10,000 req/min.',
    hallucinatedAnswer:
      'You can authenticate with an `X-Acme-API-Key` custom header or via Basic Auth with your username and password. Rate limits are standard at 100 requests per second for all paid developer tiers.',
    hallucinationWarning:
      '⚠️ Hallucination Alert: The model hallucinated an `X-Acme-API-Key` header and Basic Auth (which is insecure and unsupported), plus an arbitrary "100 req/sec" limit instead of the documented Bearer token and tier limits.',
  },
  {
    id: 'q-data',
    question: 'How is data encrypted and how long is customer data retained after cancellation?',
    relevantChunkIds: ['sec-1', 'sec-3'],
    ragAnswer:
      'Customer data at rest is encrypted with AES-256-GCM and data in transit requires TLS 1.3 [Doc 1, Chunk 1]. Upon account termination, all tenant databases and backup snapshots are permanently purged within 30 calendar days following DoD 5220.22-M standards [Doc 1, Chunk 3].',
    hallucinatedAnswer:
      'All data is encrypted using standard RSA-4096 and AES-128. If you cancel your account, your data is archived in cold storage for 90 days before deletion in compliance with European GDPR guidelines.',
    hallucinationWarning:
      '⚠️ Hallucination Alert: The model fabricated "90 days cold storage" and "AES-128", whereas the certified policy is AES-256-GCM and mandatory 30-day DoD 5220.22-M permanent purge.',
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
          className="text-xs font-semibold text-indigo-300 hover:text-white bg-transparent border-0 cursor-pointer"
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
    q: 'What is Retrieval-Augmented Generation (RAG) and why is it used?',
    a: 'Retrieval-Augmented Generation (RAG) is an AI architecture that enhances large language models by retrieving authoritative facts from an external knowledge base before generating an answer. Instead of relying solely on parametric memory (weights memorized during training, which become outdated and hallucinate), RAG retrieves relevant document chunks matching the user question, injects them into the prompt as verified context, and instructs the model to synthesize a cited answer directly from that context.',
  },
  {
    q: 'Why is RAG preferred over fine-tuning for enterprise knowledge bases?',
    a: 'RAG is vastly faster, cheaper, and more accurate for knowledge retrieval. Updating a RAG knowledge base takes seconds (just insert or delete document vectors in a vector database), whereas fine-tuning requires hours of GPU retraining and risks catastrophic forgetting. Furthermore, RAG provides exact source citations (verifiable page numbers/chunks) and enforces strict access control (users only retrieve documents their permissions allow), neither of which fine-tuning can guarantee.',
  },
  {
    q: 'What is document chunking and how does chunk size affect retrieval quality?',
    a: 'Chunking is the process of splitting long documents (PDFs, Markdown files, web pages) into smaller, semantically coherent passages before embedding them. If chunks are too large (e.g. 2,000 words), specific facts get diluted in the vector embedding and may exceed context limits. If chunks are too small (e.g. 20 words), the chunk lacks the surrounding context needed for accurate comprehension. Best practice is using 250–500 token chunks with 10–20% sliding overlap (e.g. 50 tokens) to preserve boundary continuity.',
  },
  {
    q: 'What is the "Lost in the Middle" problem in RAG pipelines?',
    a: 'Research shows LLMs attend most strongly to tokens placed at the very beginning and very end of their context window, frequently missing critical facts located in the middle of long prompts. To mitigate this in RAG, advanced pipelines sort retrieved chunks by relevance score and place the highest-scoring chunks at the top and bottom of the context block, or employ rerankers to pass only the top 3–5 most focused passages.',
  },
  {
    q: 'How does Hybrid Search (Dense + Sparse) improve RAG accuracy?',
    a: 'Dense vector search (embeddings) excels at understanding semantic intent and synonyms (e.g. finding "cancellation" when searching for "money back"), but struggles with exact SKU numbers, error codes, and proper nouns. Sparse search (BM25 / TF-IDF) excels at exact keyword matching. Hybrid search runs both retrieval methods in parallel and merges their rankings using Reciprocal Rank Fusion (RRF), delivering the highest retrieval precision.',
  },
]

const FAQS = [
  {
    q: 'What is RAG in plain English?',
    a: 'Imagine an open-book exam: instead of asking a student (the AI) to answer difficult questions from memory alone (where they might guess or make up facts), you hand them the exact textbook pages containing the answer right before they write. RAG does exactly this — it searches your company files, finds the right paragraphs, hands them to the AI, and says "Answer the question using only these paragraphs and cite your sources."',
  },
  {
    q: 'Can RAG work with private company PDFs, Word documents, and Notion wikis?',
    a: 'Yes! Any unstructured text — PDFs, Word documents (.docx), Markdown files, Google Docs, Notion pages, Zendesk tickets, or SQL databases — can be ingested. The files are parsed into text, split into chunks, converted into vector embeddings, and stored in a vector database (like Pinecone, Qdrant, Chroma, or pgvector) for instant semantic retrieval.',
  },
  {
    q: 'How does RAG prevent AI hallucinations?',
    a: 'By strictly constraining the LLM with a system prompt like: "Answer the user question strictly using the provided context chunks. If the answer cannot be found in the context, explicitly state \'I do not have enough information to answer this\'. Always cite the document title and chunk ID for every claim." Because the model is summarizing provided text rather than guessing from weights, hallucinations drop dramatically.',
  },
  {
    q: 'What happens when a document is updated or deleted in a RAG system?',
    a: 'When a document changes, its old chunk vectors are deleted from the vector database and the updated text is re-embedded and inserted. The next query immediately retrieves the updated policy without retraining or fine-tuning the model.',
  },
]

const PY_CODE = `import numpy as np

class InMemoryRAG:
    """Complete, self-contained in-memory RAG pipeline demonstration."""

    def __init__(self):
        self.chunks = []      # list of { doc_id, chunk_id, text, vector }

    @staticmethod
    def _cosine_sim(v1: np.ndarray, v2: np.ndarray) -> float:
        dot = np.dot(v1, v2)
        norm = np.linalg.norm(v1) * np.linalg.norm(v2)
        return float(dot / norm) if norm > 0 else 0.0

    def add_document_chunk(self, doc_name: str, chunk_id: str, text: str, embedding: list[float]):
        self.chunks.append({
            'doc_name': doc_name,
            'chunk_id': chunk_id,
            'text': text,
            'vector': np.array(embedding, dtype=np.float32)
        })

    def retrieve(self, query_embedding: list[float], top_k: int = 2) -> list[dict]:
        q_vec = np.array(query_embedding, dtype=np.float32)
        scored = []
        for c in self.chunks:
            score = self._cosine_sim(q_vec, c['vector'])
            scored.append({**c, 'similarity': round(score * 100, 1)})
        scored.sort(key=lambda x: x['similarity'], reverse=True)
        return scored[:top_k]

    def build_augmented_prompt(self, query: str, retrieved_chunks: list[dict]) -> str:
        context_str = "\\n\\n".join([
            f"[{c['doc_name']} - Chunk {c['chunk_id']}]\\n{c['text']}"
            for c in retrieved_chunks
        ])
        return (
            "System: You are an enterprise AI assistant. Answer the user question\\n"
            "STRICTLY using the provided context. Cite sources using [Doc, Chunk].\\n\\n"
            f"--- CONTEXT ---\\n{context_str}\\n----------------\\n\\n"
            f"User Question: {query}\\n"
            "Grounded Answer:"
        )


# Initialize Knowledge Base
rag = InMemoryRAG()
rag.add_document_chunk(
    'Billing Terms', '1',
    'Annual subscriptions are eligible for a 100% refund within 14 days of purchase.',
    [0.92, 0.10, 0.05]
)
rag.add_document_chunk(
    'Billing Terms', '2',
    'To request cancellation or refund, email support@acmecloud.io.',
    [0.89, 0.12, 0.08]
)
rag.add_document_chunk(
    'Security SLA', '1',
    'Enterprise tier guarantees 99.99% uptime with 10% credit on breach.',
    [0.05, 0.95, 0.02]
)

# Step 1 & 2: Embed Query & Retrieve Context
query = "What is the annual plan refund window and contact email?"
query_vec = [0.91, 0.11, 0.06]  # high billing semantic weight
top_chunks = rag.retrieve(query_vec, top_k=2)

# Step 3: Augment Prompt
prompt = rag.build_augmented_prompt(query, top_chunks)
print(prompt)`

const JS_CODE = `class SimpleRAGPipeline {
  constructor() {
    this.chunks = []; // { docName, chunkId, text, vector }
  }

  static cosineSimilarity(a, b) {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    return denom === 0 ? 0 : dot / denom;
  }

  addChunk(docName, chunkId, text, vector) {
    this.chunks.push({ docName, chunkId, text, vector });
  }

  retrieve(queryVector, topK = 2) {
    return this.chunks
      .map(c => ({
        ...c,
        similarity: +(SimpleRAGPipeline.cosineSimilarity(queryVector, c.vector) * 100).toFixed(1)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  }

  generatePrompt(query, retrievedChunks) {
    const context = retrievedChunks
      .map(c => \`[\${c.docName} - Chunk \${c.chunkId}]\\n\${c.text}\`)
      .join('\\n\\n');

    return \`System: Answer strictly using provided context with citations.
--- CONTEXT ---
\${context}
----------------
Question: \${query}
Grounded Answer:\`;
  }
}

// Example usage
const rag = new SimpleRAGPipeline();
rag.addChunk('Billing Terms', '1', 'Annual plans refundable within 14 days.', [0.92, 0.10, 0.05]);
rag.addChunk('Billing Terms', '2', 'Email support@acmecloud.io for refunds.', [0.89, 0.12, 0.08]);

const queryVec = [0.91, 0.11, 0.06];
const matches = rag.retrieve(queryVec, 2);
console.log(rag.generatePrompt('How do refunds work?', matches));`

export default function RagPage() {
  const [selectedPreset, setSelectedPreset] = useState(PRESET_QUERIES[0].id)
  const [ragEnabled, setRagEnabled] = useState(true)
  const [activeTab, setActiveTab] = useState('simulator') // 'simulator' | 'pipeline' | 'rag_vs_finetune'
  const [highlightedChunk, setHighlightedChunk] = useState(null)
  const [activeDocFilter, setActiveDocFilter] = useState('all')

  const currentQuery = useMemo(() => {
    return PRESET_QUERIES.find(p => p.id === selectedPreset) || PRESET_QUERIES[0]
  }, [selectedPreset])

  // Flatten all chunks across docs and compute mock relevance scores for demo
  const allChunksWithScores = useMemo(() => {
    return SAMPLE_DOCS.flatMap(doc =>
      doc.chunks.map(chunk => {
        const isTarget = currentQuery.relevantChunkIds.includes(chunk.id)
        // High similarity for relevant chunks, low for irrelevant
        let score = 0
        if (isTarget) {
          score = chunk.id === currentQuery.relevantChunkIds[0] ? 94.8 : 88.2
        } else {
          score = Math.floor(18 + ((chunk.id.charCodeAt(0) * 7 + chunk.id.charCodeAt(chunk.id.length - 1)) % 32))
        }
        return {
          ...chunk,
          docId: doc.id,
          docTitle: doc.title,
          docBadge: doc.badge,
          docIcon: doc.icon,
          docColor: doc.color,
          score,
          isRetrieved: isTarget && ragEnabled,
        }
      })
    ).sort((a, b) => b.score - a.score)
  }, [currentQuery, ragEnabled])

  const retrievedChunks = useMemo(() => {
    return allChunksWithScores.filter(c => c.isRetrieved)
  }, [allChunksWithScores])

  const filteredDocChunks = useMemo(() => {
    if (activeDocFilter === 'all') return allChunksWithScores
    return allChunksWithScores.filter(c => c.docId === activeDocFilter)
  }, [allChunksWithScores, activeDocFilter])

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
    name: 'How Retrieval-Augmented Generation (RAG) works step by step',
    step: [
      {
        '@type': 'HowToStep',
        text: 'Document Ingestion & Chunking: Split documents (PDFs, Markdown, wikis) into small passages (chunks) with semantic overlap.',
      },
      {
        '@type': 'HowToStep',
        text: 'Embedding & Vector Database Indexing: Convert chunks into vector embeddings and index them in a vector database.',
      },
      {
        '@type': 'HowToStep',
        text: 'Query Retrieval: Convert user questions into vectors and retrieve the top-k most relevant chunks using cosine similarity.',
      },
      {
        '@type': 'HowToStep',
        text: 'Prompt Augmentation: Inject the retrieved chunks as authoritative context into the LLM system prompt.',
      },
      {
        '@type': 'HowToStep',
        text: 'Grounded Generation: The LLM generates a factual response referencing and citing the retrieved document chunks.',
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
        <meta property="og:image" content="https://www.uptools.in/assets/learning/ai/ai-lesson6-hero.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${TITLE} | UpTools`} />
        <meta name="twitter:description" content={DESC} />
        <meta name="twitter:image" content="https://www.uptools.in/assets/learning/ai/ai-lesson6-hero.jpg" />
        <meta
          name="keywords"
          content="RAG explained, retrieval augmented generation tutorial, chat with documents AI, RAG vs fine-tuning, vector database RAG, ground LLM with sources, AI citation grounding, python RAG tutorial"
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
              { '@type': 'ListItem', position: 4, name: 'Chat With Your Documents (RAG)', item: URL },
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
        <span className="text-slate-300 font-medium">Chat With Your Documents (RAG)</span>
      </nav>

      {/* BADGE & HEADER */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 mb-4">
        <span>📚</span> AI · Lesson 6 · Beginner
      </div>
      <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight m-0 mb-3">
        Chat With Your Documents: How RAG Grounds AI in Real Facts
      </h1>
      <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-3xl">
        Standard AI answers from memory, which leads to confident hallucinations. <strong>Retrieval-Augmented Generation (RAG)</strong> gives the AI an open-book exam: it searches your PDFs, wikis, and policies, retrieves the exact relevant chunks, and cites them verbatim. Toggle RAG on and off below to see the difference between a source-grounded answer and an invented guess.
 </p>
 <figure className="m-0 mb-6 rounded-xl border border-white/10 overflow-hidden">
 <img src="/assets/learning/ai/ai-lesson6-hero.jpg" alt="Robot retrieving answers from stacked documents with citations" loading="lazy" />
 </figure>

 {/* LIVE INTERACTIVE ANIMATOR */}
      <section
        className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6"
        aria-label="Live RAG Document Retrieval and Grounding Simulator"
      >
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-white m-0">▶ Live Demo: RAG Knowledge Base &amp; Citation Simulator</h2>
            <p className="text-xs text-slate-400 m-0 mt-0.5">
              Select a question across 3 company documents and toggle RAG to witness grounded citations vs raw hallucination.
            </p>
          </div>
          <div className="flex rounded-xl bg-black/40 border border-white/10 p-1">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-all ${
                activeTab === 'simulator' ? 'bg-emerald-500/30 text-emerald-300' : 'text-slate-400 bg-transparent hover:text-white'
              }`}
            >
              🔍 Live RAG Chat
            </button>
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-all ${
                activeTab === 'pipeline' ? 'bg-emerald-500/30 text-emerald-300' : 'text-slate-400 bg-transparent hover:text-white'
              }`}
            >
              ⚙️ 4-Stage Pipeline
            </button>
            <button
              onClick={() => setActiveTab('rag_vs_finetune')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-all ${
                activeTab === 'rag_vs_finetune' ? 'bg-emerald-500/30 text-emerald-300' : 'text-slate-400 bg-transparent hover:text-white'
              }`}
            >
              ⚖️ RAG vs Fine-Tuning
            </button>
          </div>
        </div>

        {/* TAB 1: INTERACTIVE SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="space-y-4">
            {/* QUERY SELECTOR & RAG TOGGLE BAR */}
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    1. Choose a User Question to Ask:
                  </label>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {PRESET_QUERIES.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setSelectedPreset(p.id)
                          setHighlightedChunk(null)
                        }}
                        className={`text-left p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          selectedPreset === p.id
                            ? 'bg-emerald-500/20 border-emerald-400 text-white font-medium shadow-sm shadow-emerald-500/20'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span className="line-clamp-2">💬 {p.question}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* RAG ON / OFF SWITCH */}
                <div className="lg:w-72 bg-slate-900/80 rounded-xl p-3.5 border border-white/10 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${ragEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
                      Retrieval Mode:
                    </span>
                    <span className={`text-[11px] font-mono font-bold ${ragEnabled ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {ragEnabled ? 'RAG ON (Grounded)' : 'RAG OFF (Raw Guess)'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 bg-black/60 p-1 rounded-lg border border-white/10">
                    <button
                      onClick={() => setRagEnabled(true)}
                      className={`text-xs font-bold py-1.5 px-2 rounded-md border-0 cursor-pointer transition-all ${
                        ragEnabled
                          ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                          : 'bg-transparent text-slate-400 hover:text-white'
                      }`}
                    >
                      🛡️ RAG Active
                    </button>
                    <button
                      onClick={() => setRagEnabled(false)}
                      className={`text-xs font-bold py-1.5 px-2 rounded-md border-0 cursor-pointer transition-all ${
                        !ragEnabled
                          ? 'bg-rose-500 text-white shadow-md font-extrabold'
                          : 'bg-transparent text-slate-400 hover:text-white'
                      }`}
                    >
                      ❌ RAG Off
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-400 m-0 mt-2 leading-snug">
                    {ragEnabled
                      ? 'Vector search fetches exact matching chunks and injects them into the prompt.'
                      : 'Retrieval bypassed. AI relies solely on training weights, risking fabricated details.'}
                  </p>
                </div>
              </div>
            </div>

            {/* TWO-COLUMN LAYOUT: KNOWLEDGE BASE CHUNKS vs GENERATED ANSWER */}
            <div className="grid lg:grid-cols-12 gap-4">
              {/* LEFT: 3 SAMPLE DOCUMENTS WITH CHUNKS */}
              <div className="lg:col-span-7 rounded-xl border border-white/10 bg-slate-950/80 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">📁 Knowledge Base (3 Documents, 9 Chunks)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono">
                        Vector Index
                      </span>
                    </div>

                    {/* Filter doc pills */}
                    <div className="flex gap-1 text-[10px]">
                      <button
                        onClick={() => setActiveDocFilter('all')}
                        className={`px-2 py-0.5 rounded border cursor-pointer ${
                          activeDocFilter === 'all'
                            ? 'bg-white/20 text-white border-white/30'
                            : 'bg-transparent text-slate-400 border-white/10 hover:text-white'
                        }`}
                      >
                        All
                      </button>
                      {SAMPLE_DOCS.map(d => (
                        <button
                          key={d.id}
                          onClick={() => setActiveDocFilter(d.id)}
                          className={`px-2 py-0.5 rounded border cursor-pointer ${
                            activeDocFilter === d.id
                              ? 'bg-white/20 text-white border-white/30'
                              : 'bg-transparent text-slate-400 border-white/10 hover:text-white'
                          }`}
                        >
                          {d.icon} {d.badge}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Chunks List */}
                  <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
                    {filteredDocChunks.map(chunk => {
                      const isTarget = currentQuery.relevantChunkIds.includes(chunk.id)
                      const isHighlighted = highlightedChunk === chunk.id
                      const isRetrieved = chunk.isRetrieved

                      return (
                        <div
                          key={chunk.id}
                          id={`chunk-${chunk.id}`}
                          onMouseEnter={() => setHighlightedChunk(chunk.id)}
                          onMouseLeave={() => setHighlightedChunk(null)}
                          className={`p-3 rounded-xl border transition-all duration-300 ${
                            isHighlighted
                              ? 'ring-2 ring-emerald-400 bg-emerald-500/20 border-emerald-400 scale-[1.01]'
                              : isRetrieved
                              ? 'bg-emerald-500/[0.08] border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                              : 'bg-white/[0.02] border-white/5 opacity-60 hover:opacity-100 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm">{chunk.docIcon}</span>
                              <span className="text-xs font-bold text-white">{chunk.docTitle}</span>
                              <span className="text-[10px] font-mono text-slate-400 bg-black/40 px-1.5 py-0.2 rounded border border-white/10">
                                #{chunk.id}
                              </span>
                            </div>

                            {/* Cosine similarity badge */}
                            <div className="flex items-center gap-1.5">
                              {isRetrieved && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                  ✓ Retrieved ({chunk.score}%)
                                </span>
                              )}
                              {!ragEnabled && isTarget && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-white/10">
                                  Ignored (RAG Off)
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-xs text-slate-300 leading-relaxed m-0 mb-2">{chunk.text}</p>

                          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                            <div className="flex gap-1 flex-wrap">
                              {chunk.tags.slice(0, 4).map(tag => (
                                <span key={tag} className="bg-black/30 px-1.5 py-0.5 rounded border border-white/5">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                            <span>Similarity: {chunk.score}%</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                  <span>
                    Status: <strong className={ragEnabled ? 'text-emerald-400' : 'text-slate-500'}>
                      {ragEnabled ? `${retrievedChunks.length} Chunks Injected into Prompt Context` : '0 Chunks Injected'}
                    </strong>
                  </span>
                  <span className="text-[10px] text-slate-500">Hover a citation on the right to pinpoint its source chunk</span>
                </div>
              </div>

              {/* RIGHT: GENERATED AI RESPONSE & CITATION INSPECTOR */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {/* AI RESPONSE CARD */}
                <div
                  className={`rounded-xl border p-4 transition-all duration-500 flex-1 flex flex-col justify-between ${
                    ragEnabled
                      ? 'bg-slate-900/90 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                      : 'bg-rose-950/30 border-rose-500/40 shadow-lg shadow-rose-500/10'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{ragEnabled ? '🤖' : '⚠️'}</span>
                        <span className="text-xs font-bold text-white">
                          {ragEnabled ? 'Grounded AI Response' : 'Ungrounded AI Response'}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          ragEnabled
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        }`}
                      >
                        {ragEnabled ? '100% Factually Grounded' : '0% Grounded (Raw Guess)'}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 mb-3 text-xs leading-relaxed text-slate-100">
                      {ragEnabled ? (
                        <div>
                          {currentQuery.ragAnswer.split(/(\[Doc \d+, Chunk \d+\])/g).map((seg, idx) => {
                            if (/\[Doc \d+, Chunk \d+\]/.test(seg)) {
                              // map doc string to chunk ID
                              const isDoc1 = seg.includes('Doc 1')
                              const isDoc2 = seg.includes('Doc 2')
                              const isDoc3 = seg.includes('Doc 3')
                              const chunkNum = seg.match(/Chunk (\d+)/)?.[1] || '1'
                              const targetId = isDoc1 ? `sec-${chunkNum}` : isDoc2 ? `bill-${chunkNum}` : `api-${chunkNum}`

                              return (
                                <button
                                  key={idx}
                                  onMouseEnter={() => setHighlightedChunk(targetId)}
                                  onMouseLeave={() => setHighlightedChunk(null)}
                                  onClick={() => {
                                    const el = document.getElementById(`chunk-${targetId}`)
                                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                                  }}
                                  className="inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded bg-emerald-500/25 border border-emerald-400 text-emerald-300 font-mono text-[10px] font-bold cursor-pointer hover:bg-emerald-400 hover:text-slate-950 transition-colors"
                                  title="Click or hover to highlight source chunk in Knowledge Base"
                                >
                                  🔗 {seg}
                                </button>
                              )
                            }
                            return <span key={idx}>{seg}</span>
                          })}
                        </div>
                      ) : (
                        <div className="text-rose-100 italic">
                          &ldquo;{currentQuery.hallucinatedAnswer}&rdquo;
                        </div>
                      )}
                    </div>

                    {/* HALLUCINATION OR GROUNDING ALERT */}
                    {!ragEnabled ? (
                      <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-[11px] text-rose-200 leading-relaxed mb-2">
                        {currentQuery.hallucinationWarning}
                      </div>
                    ) : (
                      <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-200 leading-relaxed mb-2">
                        💡 <strong>Source Verification Verified:</strong> Every statement directly matches the retrieved chunks. The model was given strict instructions to answer only using provided text, preventing factual fabrication.
                      </div>
                    )}
                  </div>

                  {/* PROMPT AUGMENTATION INSPECTOR */}
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 flex items-center justify-between">
                      <span>Prompt Sent to LLM Context:</span>
                      <span className="font-mono text-emerald-400">
                        {ragEnabled ? `${retrievedChunks.length} Chunks Injected` : 'Zero Context'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-black/60 font-mono text-[10px] text-slate-300 border border-white/5 space-y-1">
                      <div className="text-slate-500 font-semibold">// System Prompt</div>
                      <div className="text-slate-400">
                        &quot;Answer strictly from the following context with citations.&quot;
                      </div>
                      <div className="text-slate-500 font-semibold mt-1">// Context Block</div>
                      <div className={ragEnabled ? 'text-emerald-300' : 'text-slate-600 italic'}>
                        {ragEnabled
                          ? retrievedChunks.map(c => `[${c.docBadge} - Chunk ${c.id}] ${c.text.slice(0, 45)}...`).join(' | ')
                          : '[Empty — No retrieved context]'}
                      </div>
                      <div className="text-slate-500 font-semibold mt-1">// User Prompt</div>
                      <div className="text-white">&quot;{currentQuery.question}&quot;</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 4-STAGE PIPELINE EXPLANATION */}
        {activeTab === 'pipeline' && (
          <div className="rounded-xl border border-white/10 bg-black/30 p-5 mb-4">
            <h3 className="text-sm font-bold text-white mb-2">⚙️ The 4-Stage Production RAG Pipeline</h3>
            <p className="text-xs text-slate-300 mb-5 leading-relaxed">
              How enterprise RAG turns raw PDFs, Word documents, and web pages into real-time accurate answers:
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  step: '01',
                  title: 'Chunking & Ingestion',
                  icon: '✂️',
                  color: 'border-blue-500/30 bg-blue-500/[0.04]',
                  text: 'Long documents are split into bite-sized 250–500 token passages with 50-token sliding overlap so sentences are never cut off in awkward positions.',
                },
                {
                  step: '02',
                  title: 'Vector Embedding',
                  icon: '🧭',
                  color: 'border-purple-500/30 bg-purple-500/[0.04]',
                  text: 'An embedding neural network (e.g. OpenAI text-embedding-3 or BGE) converts each chunk into a 1536-dimensional coordinate vector saved in a vector DB.',
                },
                {
                  step: '03',
                  title: 'Semantic Retrieval',
                  icon: '🔍',
                  color: 'border-emerald-500/30 bg-emerald-500/[0.04]',
                  text: 'When a user asks a question, their prompt is embedded into the same vector space to find the top 3–5 nearest document chunks using cosine similarity.',
                },
                {
                  step: '04',
                  title: 'Augmented Synthesis',
                  icon: '✨',
                  color: 'border-amber-500/30 bg-amber-500/[0.04]',
                  text: 'The retrieved chunks are assembled into the LLM system prompt context. The model generates a grounded answer with verifiable citation links.',
                },
              ].map(st => (
                <div key={st.step} className={`p-4 rounded-xl border ${st.color} flex flex-col justify-between`}>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{st.icon}</span>
                      <span className="text-xs font-mono font-extrabold text-slate-400">STEP {st.step}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white mb-1.5">{st.title}</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed m-0">{st.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: RAG VS FINE-TUNING */}
        {activeTab === 'rag_vs_finetune' && (
          <div className="rounded-xl border border-white/10 bg-black/30 p-5 mb-4">
            <h3 className="text-sm font-bold text-white mb-2">⚖️ Architecture Decision: RAG vs Fine-Tuning</h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              When should you use RAG vs Fine-tuning? In 95% of enterprise use cases, RAG is the superior choice for factual accuracy and dynamic knowledge:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-white/15 bg-white/5">
                    <th className="p-3 text-white font-bold">Evaluation Criteria</th>
                    <th className="p-3 text-emerald-300 font-bold">🛡️ Retrieval-Augmented Generation (RAG)</th>
                    <th className="p-3 text-purple-300 font-bold">🧠 Fine-Tuning (Model Training)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="p-3 font-semibold text-white">Knowledge Updates</td>
                    <td className="p-3 text-emerald-200">Instant (seconds) — add/delete vector in database</td>
                    <td className="p-3 text-slate-400">Slow (hours/days) — requires retraining dataset &amp; GPUs</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Hallucination Risk</td>
                    <td className="p-3 text-emerald-200">Very low — model restricted to cited passages</td>
                    <td className="p-3 text-rose-300">High — model memorizes facts imperfectly in weights</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Source Citations</td>
                    <td className="p-3 text-emerald-200">Exact page &amp; chunk citations provided</td>
                    <td className="p-3 text-slate-400">No citations possible (black-box weights)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Cost &amp; Infrastructure</td>
                    <td className="p-3 text-emerald-200">Low — commodity vector databases (Qdrant, Pinecone)</td>
                    <td className="p-3 text-slate-400">High — expensive GPU compute clusters</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Best Used For</td>
                    <td className="p-3 text-emerald-200">Knowledge bases, customer support, PDF Q&amp;A, dynamic policies</td>
                    <td className="p-3 text-purple-200">Teaching specific voice, tone, formatting, or novel syntax</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="text-[11px] text-slate-500 m-0">
          💡 <strong>Key Takeaway:</strong> Without RAG, large language models guess policies and numbers based on loose statistical patterns. With RAG, the model acts as an analytical research assistant reading from verified source documents.
        </p>
      </section>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <figure className="m-0 rounded-xl border border-white/10 overflow-hidden">
          <img src="/assets/learning/ai/ai-lesson6-pipeline.jpg" alt="RAG pipeline: retrieve relevant chunks then generate cited answer" loading="lazy" />
        </figure>
        <figure className="m-0 rounded-xl border border-white/10 overflow-hidden">
          <img src="/assets/learning/ai/ai-lesson6-grounded.jpg" alt="Grounded cited answer versus hallucinated answer" loading="lazy" />
        </figure>
      </div>
      {/* EXPLANATION */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-white mt-0 mb-3">How RAG Transforms AI into a Reliable Knowledge Engine</h2>
        <ol className="text-sm text-slate-300 leading-relaxed space-y-2.5 list-decimal pl-5 m-0">
          <li>
            <strong className="text-white">Parametric memory vs Non-parametric memory:</strong> An LLM’s weights are static (parametric memory). RAG gives it an external, updatable hard drive (non-parametric vector memory) where company knowledge lives.
          </li>
          <li>
            <strong className="text-white">Chunking preserves semantic coherence:</strong> Large PDFs are broken down into digestible chunks with overlap so concepts aren’t clipped mid-sentence.
          </li>
          <li>
            <strong className="text-white">Cosine similarity retrieves the exact passage:</strong> Embedding models convert the user question into vector coordinates and retrieve the closest paragraph in milliseconds.
          </li>
          <li>
            <strong className="text-white">Grounding and citations ensure auditability:</strong> Because the LLM quotes the source document and returns a chunk identifier, human reviewers can verify every claim in 1 click.
          </li>
        </ol>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5 text-center">
          {[
            ['Document Chunking', '250–500 token segments', 'Sliding window overlap'],
            ['Vector Retrieval', 'Sub-10ms nearest neighbor', 'Cosine similarity'],
            ['Prompt Grounding', 'Context injection', 'Zero hallucination constraint'],
            ['Audit Citations', 'Direct document links', 'Verifiable enterprise proof'],
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
        <h2 className="text-lg font-bold text-white mt-0 mb-3">Code: Complete In-Memory RAG Pipeline</h2>
        <p className="text-xs text-slate-400 mt-0 mb-4">
          A zero-dependency, end-to-end RAG architecture with vector indexing, semantic search, prompt augmentation, and source citation formatting. Copy and run in Python or JavaScript:
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
          The questions interviewers actually ask about RAG architectures, chunking strategies, and hallucination reduction. Tap to reveal the approach.
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
        <h2 className="text-lg font-bold text-white mt-0 mb-3">🎤 Interview tips</h2>
        <ul className="text-sm text-slate-300 leading-relaxed space-y-2 list-disc pl-5 m-0">
          <li>
            <strong className="text-white">Explain the core definition cleanly:</strong> &ldquo;RAG separates knowledge from compute. Instead of memorizing private facts into weights, we retrieve the exact relevant passages from a vector database at query time and inject them into the LLM context.&rdquo;
          </li>
          <li>
            <strong className="text-white">Highlight Hybrid Search (Dense + Sparse BM25):</strong> &ldquo;Pure vector search misses specific SKUs, invoice numbers, or exact product codes. In production, we always combine dense semantic embeddings with sparse BM25 keyword matching via Reciprocal Rank Fusion (RRF).&rdquo;
          </li>
          <li>
            <strong className="text-white">Mention Two-Stage Retrieval (Reranking):</strong> &ldquo;Bi-encoder embeddings retrieve a broad candidate pool of top-50 chunks in 5ms; then a Cross-Encoder reranker scores the top 5 chunks with high precision before passing them to the LLM.&rdquo;
          </li>
          <li>
            <strong className="text-white">Address Chunking Strategy:</strong> &ldquo;Don&apos;t just chunk by arbitrary characters. Explain hierarchical chunking (small chunks for vector matching, linked to larger parent documents for rich context) and semantic chunking by headings or markdown structure.&rdquo;
          </li>
          <li>
            <strong className="text-white">Know how to evaluate RAG systems (RAGAS framework):</strong> &ldquo;We evaluate RAG pipelines using four distinct metrics: Faithfulness (is the answer grounded in context?), Answer Relevance (does it answer the query?), Context Precision (did we retrieve clean chunks?), and Context Recall (did we find all required evidence?).&rdquo;
          </li>
        </ul>
      </section>

      {/* FAQ ACCORDION COMPONENT */}
      <FAQ questions={FAQS} />

      {/* PREV / NEXT NAVIGATION */}
      <div className="flex items-center justify-between flex-wrap gap-3 mt-6">
        <Link to="/learning/ai/embeddings-and-search" className="text-sm font-semibold text-emerald-300 no-underline hover:text-white transition-colors">
          ← Lesson 5: Embeddings &amp; Search
        </Link>
        <Link to="/learning/ai/ai-agents-that-do-tasks" className="text-sm font-semibold text-emerald-300 no-underline hover:text-white transition-colors">
          Lesson 7: AI Agents That Do Tasks →
        </Link>
      </div>
    </>
  )
}
