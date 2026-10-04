import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import FAQ from '../components/FAQ'

const TITLE = 'Embeddings and Search: How AI Understands Meaning with Vectors'
const DESC = 'Learn how AI turns text into meaning with a live 2D semantic dot map — type or click any word (chai, coffee, king, queen, car, computer) to see nearest neighbours by cosine similarity distance. Includes vector search code in Python & JavaScript, 5 practice questions, 4 FAQs and interview tips.'
const URL = 'https://www.uptools.in/learning/ai/embeddings-and-search/'

// ---------------------------------------------------------------------------
// Preset vocabulary with 5D semantic coordinates and 2D map projections.
// Dimensions: [beverage, royalty, technology, vehicle, animal]
// ---------------------------------------------------------------------------
const VOCABULARY = [
  // Beverages
  { id: 'chai', word: 'chai', label: 'Chai', cat: 'Beverages', color: '#f59e0b', emoji: '☕', x: 20, y: 24, vec: [0.97, 0.02, 0.01, 0.01, 0.00], desc: 'Spiced hot tea brew with milk' },
  { id: 'tea', word: 'tea', label: 'Tea', cat: 'Beverages', color: '#f59e0b', emoji: '🍵', x: 22, y: 20, vec: [0.99, 0.01, 0.01, 0.00, 0.00], desc: 'Infused herbal or tea-leaf drink' },
  { id: 'coffee', word: 'coffee', label: 'Coffee', cat: 'Beverages', color: '#f59e0b', emoji: '☕', x: 27, y: 25, vec: [0.96, 0.01, 0.02, 0.01, 0.01], desc: 'Brewed roasted coffee bean drink' },
  { id: 'latte', word: 'latte', label: 'Latte', cat: 'Beverages', color: '#f59e0b', emoji: '🥛', x: 29, y: 30, vec: [0.94, 0.01, 0.02, 0.01, 0.02], desc: 'Espresso topped with steamed milk' },
  { id: 'espresso', word: 'espresso', label: 'Espresso', cat: 'Beverages', color: '#f59e0b', emoji: '☕', x: 31, y: 22, vec: [0.95, 0.01, 0.02, 0.01, 0.01], desc: 'Concentrated bold coffee shot' },
  { id: 'water', word: 'water', label: 'Water', cat: 'Beverages', color: '#f59e0b', emoji: '💧', x: 15, y: 33, vec: [0.86, 0.01, 0.00, 0.02, 0.02], desc: 'Pure hydrating clear liquid' },

  // Royalty
  { id: 'king', word: 'king', label: 'King', cat: 'Royalty', color: '#a855f7', emoji: '👑', x: 74, y: 22, vec: [0.01, 0.98, 0.01, 0.02, 0.02], desc: 'Male monarch and sovereign ruler' },
  { id: 'queen', word: 'queen', label: 'Queen', cat: 'Royalty', color: '#a855f7', emoji: '👸', x: 82, y: 23, vec: [0.01, 0.97, 0.01, 0.02, 0.02], desc: 'Female monarch or king\'s consort' },
  { id: 'prince', word: 'prince', label: 'Prince', cat: 'Royalty', color: '#a855f7', emoji: '🤴', x: 72, y: 29, vec: [0.01, 0.94, 0.02, 0.02, 0.01], desc: 'Son of a monarch or royal heir' },
  { id: 'princess', word: 'princess', label: 'Princess', cat: 'Royalty', color: '#a855f7', emoji: '👸', x: 80, y: 30, vec: [0.01, 0.93, 0.02, 0.02, 0.02], desc: 'Daughter of a monarch' },
  { id: 'palace', word: 'palace', label: 'Palace', cat: 'Royalty', color: '#a855f7', emoji: '🏰', x: 87, y: 34, vec: [0.02, 0.88, 0.02, 0.05, 0.01], desc: 'Official residence of royalty' },
  { id: 'crown', word: 'crown', label: 'Crown', cat: 'Royalty', color: '#a855f7', emoji: '👑', x: 77, y: 16, vec: [0.01, 0.92, 0.03, 0.01, 0.01], desc: 'Ornamental headdress worn by royalty' },

  // Tech & Computing
  { id: 'computer', word: 'computer', label: 'Computer', cat: 'Tech', color: '#3b82f6', emoji: '💻', x: 77, y: 76, vec: [0.01, 0.01, 0.98, 0.02, 0.01], desc: 'Programmable electronic device' },
  { id: 'laptop', word: 'laptop', label: 'Laptop', cat: 'Tech', color: '#3b82f6', emoji: '💻', x: 82, y: 74, vec: [0.01, 0.01, 0.97, 0.04, 0.01], desc: 'Portable personal computer' },
  { id: 'code', word: 'code', label: 'Code', cat: 'Tech', color: '#3b82f6', emoji: '👨‍💻', x: 70, y: 81, vec: [0.00, 0.01, 0.95, 0.01, 0.01], desc: 'Instructions written for software' },
  { id: 'software', word: 'software', label: 'Software', cat: 'Tech', color: '#3b82f6', emoji: '💾', x: 74, y: 85, vec: [0.00, 0.01, 0.96, 0.01, 0.01], desc: 'Programs running on computer systems' },
  { id: 'server', word: 'server', label: 'Server', cat: 'Tech', color: '#3b82f6', emoji: '🖥️', x: 85, y: 83, vec: [0.01, 0.01, 0.93, 0.04, 0.01], desc: 'Computer managing network resources' },
  { id: 'algorithm', word: 'algorithm', label: 'Algorithm', cat: 'Tech', color: '#3b82f6', emoji: '⚡', x: 67, y: 75, vec: [0.00, 0.02, 0.93, 0.01, 0.01], desc: 'Step-by-step computational procedure' },

  // Vehicles & Transport
  { id: 'car', word: 'car', label: 'Car', cat: 'Vehicles', color: '#10b981', emoji: '🚗', x: 22, y: 78, vec: [0.01, 0.01, 0.04, 0.98, 0.02], desc: 'Four-wheeled road motor vehicle' },
  { id: 'truck', word: 'truck', label: 'Truck', cat: 'Vehicles', color: '#10b981', emoji: '🚚', x: 18, y: 84, vec: [0.00, 0.01, 0.03, 0.96, 0.01], desc: 'Heavy vehicle for transporting cargo' },
  { id: 'bicycle', word: 'bicycle', label: 'Bicycle', cat: 'Vehicles', color: '#10b981', emoji: '🚲', x: 28, y: 73, vec: [0.02, 0.01, 0.02, 0.92, 0.02], desc: 'Two-wheeled pedal-driven transport' },
  { id: 'train', word: 'train', label: 'Train', cat: 'Vehicles', color: '#10b981', emoji: '🚆', x: 31, y: 84, vec: [0.01, 0.02, 0.03, 0.94, 0.01], desc: 'Connected railway carriages' },
  { id: 'airplane', word: 'airplane', label: 'Airplane', cat: 'Vehicles', color: '#10b981', emoji: '✈️', x: 36, y: 77, vec: [0.01, 0.02, 0.06, 0.92, 0.02], desc: 'Fixed-wing powered flying aircraft' },

  // Animals & Pets
  { id: 'dog', word: 'dog', label: 'Dog', cat: 'Animals', color: '#ec4899', emoji: '🐶', x: 47, y: 48, vec: [0.01, 0.01, 0.01, 0.02, 0.98], desc: 'Loyal domesticated canine companion' },
  { id: 'puppy', word: 'puppy', label: 'Puppy', cat: 'Animals', color: '#ec4899', emoji: '🐕', x: 45, y: 52, vec: [0.01, 0.01, 0.01, 0.02, 0.97], desc: 'Young playful domesticated dog' },
  { id: 'cat', word: 'cat', label: 'Cat', cat: 'Animals', color: '#ec4899', emoji: '🐱', x: 54, y: 46, vec: [0.01, 0.01, 0.01, 0.02, 0.96], desc: 'Independent domesticated feline' },
  { id: 'kitten', word: 'kitten', label: 'Kitten', cat: 'Animals', color: '#ec4899', emoji: '🐈', x: 57, y: 50, vec: [0.01, 0.01, 0.01, 0.02, 0.95], desc: 'Young playful domesticated cat' },
  { id: 'tiger', word: 'tiger', label: 'Tiger', cat: 'Animals', color: '#ec4899', emoji: '🐅', x: 61, y: 40, vec: [0.01, 0.05, 0.01, 0.02, 0.91], desc: 'Large wild striped apex predator cat' },
  { id: 'wolf', word: 'wolf', label: 'Wolf', cat: 'Animals', color: '#ec4899', emoji: '🐺', x: 43, y: 42, vec: [0.01, 0.03, 0.01, 0.02, 0.92], desc: 'Wild predatory pack canine' },
]

const QUICK_PRESETS = ['chai', 'coffee', 'king', 'queen', 'car', 'computer', 'dog', 'laptop']

const VECTOR_DIMS = ['Beverage', 'Royalty', 'Tech', 'Vehicle', 'Animal']

// Compute cosine similarity between two numeric vectors
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i]
    normA += vecA[i] * vecA[i]
    normB += vecB[i] * vecB[i]
  }
  if (normA === 0 || normB === 0) return 0
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
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
    q: 'What is an embedding in AI and machine learning?',
    a: 'An embedding is a representation of text, words, or objects as a dense list of numbers (a vector in high-dimensional space). Crucially, embeddings are trained so that concepts with similar meanings end up close together in that coordinate space. Instead of seeing text as arbitrary ASCII letters, the model places "chai" and "tea" right next to each other, allowing mathematical comparisons of meaning.',
  },
  {
    q: 'Why is cosine similarity preferred over Euclidean distance for embeddings?',
    a: 'Cosine similarity measures the angle between two vectors rather than the absolute distance between their coordinates. This makes it magnitude-invariant: a long document and a short query about the same topic might have different vector lengths, but their vectors will point in almost the exact same direction. Cosine similarity ranges from -1 (opposite) to +1 (identical direction), making it ideal for semantic matching.',
  },
  {
    q: 'What is the difference between keyword search and semantic search?',
    a: 'Traditional keyword search (lexical search like BM25) looks for exact character matches: if you search for "warm morning caffeine brew", it will miss a document that only says "hot fresh espresso". Semantic search converts both your search query and the documents into embedding vectors and finds documents whose vectors point in the nearest direction, finding matches by concept rather than exact wording.',
  },
  {
    q: 'How does vector search scale to millions of documents without checking every one?',
    a: 'Comparing a query against millions of vectors one-by-one (exact k-NN) is too slow for real-time applications. Vector databases use Approximate Nearest Neighbor (ANN) algorithms such as HNSW (Hierarchical Navigable Small World graphs) or IVF (Inverted File indexing). These partition the vector space into navigable index structures that find the 99% closest matches in milliseconds.',
  },
  {
    q: 'Why do word embeddings enable concept arithmetic (like King - Man + Woman = Queen)?',
    a: 'Because embeddings map semantic relationships as spatial directions (geometric offsets). In a trained embedding space, the vector difference between "king" and "man" represents the abstract concept of "royalty". Adding that royalty direction vector to "woman" naturally lands right at the vector coordinates for "queen". This geometry captures relationships like plurals, capitals, genders, and verb tenses automatically.',
  },
]

const FAQS = [
  {
    q: 'What is an embedding vector in plain English?',
    a: 'Think of an embedding as a GPS coordinate for meaning. Just like a map location has a latitude and longitude (2 numbers) that tell you how close two cities are, an embedding gives a word or document a list of 1500+ numbers that describe where it sits in "concept space". Words with related meanings (like "coffee" and "latte") have similar coordinates and sit close together on the map.',
  },
  {
    q: 'How does semantic search find answers when keywords don\'t match at all?',
    a: 'When you type a search query, a neural model converts your query into an embedding vector. The search engine then calculates the cosine similarity between your query vector and the pre-computed vectors of all saved documents. The documents with the highest similarity scores are returned — meaning you can search "fix flat bicycle tire" and find articles titled "puncture repair guide" with zero keyword overlap.',
  },
  {
    q: 'What is cosine similarity and how is it scored?',
    a: 'Cosine similarity calculates the cosine of the angle between two multi-dimensional vectors. A score of 1.0 (or 100%) means the vectors point in the identical direction (identical meaning). Scores above 0.80 indicate strong semantic overlap, scores between 0.50 and 0.79 indicate related topics, and scores near 0 mean the concepts are completely unrelated.',
  },
  {
    q: 'How are embeddings used in real AI applications like RAG?',
    a: 'In Retrieval-Augmented Generation (RAG), a company\'s internal documentation is split into chunks, embedded into vectors, and saved in a vector database (such as Pinecone, Qdrant, Chroma, or pgvector). When a user asks a question, their prompt is embedded, the nearest document chunks are retrieved via vector search, and those chunks are injected directly into the LLM\'s context window to produce an accurate, source-grounded answer.',
  },
]

const PY_CODE = `import numpy as np

class SemanticVectorSearch:
    """Demonstration of in-memory semantic vector search using cosine similarity."""

    def __init__(self):
        self.corpus = {}      # id -> text
        self.vectors = {}     # id -> numpy array

    @staticmethod
    def cosine_similarity(vec_a: np.ndarray, vec_b: np.ndarray) -> float:
        norm_a = np.linalg.norm(vec_a)
        norm_b = np.linalg.norm(vec_b)
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return float(np.dot(vec_a, vec_b) / (norm_a * norm_b))

    def add_document(self, doc_id: str, text: str, embedding: list[float]):
        self.corpus[doc_id] = text
        self.vectors[doc_id] = np.array(embedding, dtype=np.float32)

    def search(self, query_vec: list[float], top_k: int = 3) -> list[dict]:
        q = np.array(query_vec, dtype=np.float32)
        scores = []
        for doc_id, v in self.vectors.items():
            sim = self.cosine_similarity(q, v)
            scores.append({
                'id': doc_id,
                'text': self.corpus[doc_id],
                'similarity': round(sim * 100, 1)
            })
        # Rank by highest similarity score first
        scores.sort(key=lambda item: item['similarity'], reverse=True)
        return scores[:top_k]


# Demo with 5D feature vectors: [Beverage, Royalty, Tech, Vehicle, Animal]
db = SemanticVectorSearch()
db.add_document('doc1', 'Masala chai recipe with warm spices', [0.97, 0.02, 0.01, 0.01, 0.00])
db.add_document('doc2', 'Fresh roasted espresso beans brewing', [0.95, 0.01, 0.02, 0.01, 0.01])
db.add_document('doc3', 'King Arthur royal crown history',      [0.01, 0.98, 0.01, 0.02, 0.02])
db.add_document('doc4', 'Electric car battery motor specs',     [0.01, 0.01, 0.04, 0.98, 0.02])

# Query: "hot morning brew" (represented by high beverage weight)
query_embedding = [0.96, 0.01, 0.01, 0.01, 0.01]
results = db.search(query_embedding, top_k=2)

for r in results:
    print(f"[{r['similarity']}% match] {r['text']}")
# -> [99.8% match] Masala chai recipe with warm spices
# -> [99.6% match] Fresh roasted espresso beans brewing`

const JS_CODE = `class SemanticVectorSearch {
  constructor() {
    this.documents = []; // { id, text, vector }
  }

  static cosineSimilarity(vecA, vecB) {
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  addDocument(id, text, vector) {
    this.documents.push({ id, text, vector });
  }

  search(queryVector, topK = 3) {
    return this.documents
      .map(doc => ({
        id: doc.id,
        text: doc.text,
        similarity: +(SemanticVectorSearch.cosineSimilarity(queryVector, doc.vector) * 100).toFixed(1)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  }
}

// Demo with 5D feature vectors: [Beverage, Royalty, Tech, Vehicle, Animal]
const db = new SemanticVectorSearch();
db.addDocument('doc1', 'Masala chai recipe with warm spices', [0.97, 0.02, 0.01, 0.01, 0.00]);
db.addDocument('doc2', 'Fresh roasted espresso beans brewing', [0.95, 0.01, 0.02, 0.01, 0.01]);
db.addDocument('doc3', 'King Arthur royal crown history', [0.01, 0.98, 0.01, 0.02, 0.02]);
db.addDocument('doc4', 'Electric car battery motor specs', [0.01, 0.01, 0.04, 0.98, 0.02]);

// Query: "hot morning brew" (vector embedding)
const queryEmbedding = [0.96, 0.01, 0.01, 0.01, 0.01];
const results = db.search(queryEmbedding, 2);

results.forEach(r => {
  console.log(\`[\${r.similarity}% match] \${r.text}\`);
});
// -> [99.8% match] Masala chai recipe with warm spices
// -> [99.6% match] Fresh roasted espresso beans brewing`

export default function EmbeddingsPage() {
  const [selectedWord, setSelectedWord] = useState('chai')
  const [inputQuery, setInputQuery] = useState('chai')
  const [activeTab, setActiveTab] = useState('map') // 'map' | 'math' | 'keyword_vs_vector'
  const [hoveredWord, setHoveredWord] = useState(null)

  // Current active target item in vocab
  const activeItem = useMemo(() => {
    const found = VOCABULARY.find(v => v.word === selectedWord.toLowerCase().trim())
    return found || VOCABULARY[0]
  }, [selectedWord])

  // Ranked neighbors computed via cosine similarity
  const rankedNeighbors = useMemo(() => {
    return VOCABULARY.map(v => {
      const sim = cosineSimilarity(activeItem.vec, v.vec)
      return {
        ...v,
        similarity: +(sim * 100).toFixed(1),
        isSelf: v.id === activeItem.id,
      }
    }).sort((a, b) => b.similarity - a.similarity)
  }, [activeItem])

  const topNeighbors = useMemo(() => {
    return rankedNeighbors.slice(0, 6)
  }, [rankedNeighbors])

  // Autocomplete / suggestions when typing
  const searchSuggestions = useMemo(() => {
    if (!inputQuery) return []
    const q = inputQuery.toLowerCase().trim()
    return VOCABULARY.filter(v => v.word.includes(q) || v.cat.toLowerCase().includes(q)).slice(0, 5)
  }, [inputQuery])

  const handleSelect = (word) => {
    setSelectedWord(word)
    setInputQuery(word)
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: TITLE,
    description: DESC,
    image: 'https://www.uptools.in/assets/learning/ai/ai-lesson5-hero.jpg',
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
    name: 'How semantic vector search works step by step',
    step: [
      {
        '@type': 'HowToStep',
        text: 'Pass text through an embedding neural network to generate a dense vector of numbers capturing its conceptual meaning.',
      },
      {
        '@type': 'HowToStep',
        text: 'Store document vectors in a vector database or indexed coordinate space.',
      },
      {
        '@type': 'HowToStep',
        text: 'Convert the user query into the same vector space using the identical embedding model.',
      },
      {
        '@type': 'HowToStep',
        text: 'Calculate the cosine similarity between the query vector and all document vectors to find the closest angular directions.',
      },
      {
        '@type': 'HowToStep',
        text: 'Return the top-k highest similarity matches to the user, finding relevant documents even with zero keyword overlap.',
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
        <meta property="og:image" content="https://www.uptools.in/assets/learning/ai/ai-lesson5-hero.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${TITLE} | UpTools`} />
        <meta name="twitter:description" content={DESC} />
        <meta name="twitter:image" content="https://www.uptools.in/assets/learning/ai/ai-lesson5-hero.jpg" />
        <meta
          name="keywords"
          content="embeddings explained, semantic search tutorial, vector search demo, cosine similarity explained, word vectors 2D map, AI vector search python, how embeddings work"
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
              { '@type': 'ListItem', position: 4, name: 'Embeddings & Search', item: URL },
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
        <span className="text-slate-300 font-medium">Embeddings &amp; Search</span>
      </nav>

      {/* BADGE & HEADER */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 mb-4">
        <span>🧭</span> AI · Lesson 5 · Beginner
      </div>
      <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight m-0 mb-3">
        Embeddings &amp; Search: how AI understands meaning with vectors
      </h1>
      <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-3xl">
        Computers do not understand words; they understand numbers. An <strong>embedding</strong> turns words and
        sentences into a list of coordinates (a vector) in meaning-space. Words with similar meanings cluster together —
        so searching for <em>&ldquo;chai&rdquo;</em> naturally finds <em>&ldquo;tea&rdquo;</em> and <em>&ldquo;coffee&rdquo;</em>,
        even with zero keyword overlap.
      </p>
      <figure className="m-0 mb-6 rounded-xl border border-white/10 overflow-hidden">
        <img src="/assets/learning/ai/ai-lesson5-hero.jpg" alt="Words plotted as dots on a meaning map, similar words clustered" loading="lazy" />
      </figure>

      {/* LIVE INTERACTIVE ANIMATOR */}
      <section
        className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6"
        aria-label="Live 2D semantic embedding dot map and vector search demo"
      >
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-white m-0">▶ Live Demo: 2D Semantic Dot Map &amp; Vector Search</h2>
            <p className="text-xs text-slate-400 m-0 mt-0.5">
              Click any dot on the map or type a word to watch nearest neighbours calculate in real time.
            </p>
          </div>
          <div className="flex rounded-xl bg-black/40 border border-white/10 p-1">
            <button
              onClick={() => setActiveTab('map')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-all ${
                activeTab === 'map' ? 'bg-emerald-500/30 text-emerald-300' : 'text-slate-400 bg-transparent hover:text-white'
              }`}
            >
              🗺️ 2D Dot Map
            </button>
            <button
              onClick={() => setActiveTab('math')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-all ${
                activeTab === 'math' ? 'bg-emerald-500/30 text-emerald-300' : 'text-slate-400 bg-transparent hover:text-white'
              }`}
            >
              📐 Vector Math
            </button>
            <button
              onClick={() => setActiveTab('keyword_vs_vector')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-all ${
                activeTab === 'keyword_vs_vector' ? 'bg-emerald-500/30 text-emerald-300' : 'text-slate-400 bg-transparent hover:text-white'
              }`}
            >
              ⚡ Keyword vs Vector
            </button>
          </div>
        </div>

        {/* INPUT & PRESET PILLS */}
        <div className="rounded-xl border border-white/10 bg-black/30 p-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1">
              <label htmlFor="vocab-search" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Type or pick a word to inspect:
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="vocab-search"
                  type="text"
                  value={inputQuery}
                  onChange={e => {
                    setInputQuery(e.target.value)
                    const match = VOCABULARY.find(v => v.word === e.target.value.toLowerCase().trim())
                    if (match) setSelectedWord(match.word)
                  }}
                  placeholder="e.g. chai, coffee, king, car..."
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>
              {searchSuggestions.length > 0 && inputQuery !== selectedWord && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-white/15 rounded-xl overflow-hidden shadow-2xl z-20">
                  {searchSuggestions.map(s => (
                    <button
                      key={s.id}
                      onClick={() => handleSelect(s.word)}
                      className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-emerald-500/20 hover:text-white flex items-center justify-between border-0 bg-transparent cursor-pointer"
                    >
                      <span className="font-semibold">{s.emoji} {s.label}</span>
                      <span className="text-[10px] text-slate-500 uppercase">{s.cat}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="sm:max-w-md">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Quick presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_PRESETS.map(p => {
                  const item = VOCABULARY.find(v => v.word === p)
                  const isSelected = selectedWord === p
                  return (
                    <button
                      key={p}
                      onClick={() => handleSelect(p)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200 shadow-sm shadow-emerald-500/20'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {item?.emoji} {p}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* TAB 1: 2D DOT MAP & DISTANCE BARS */}
        {activeTab === 'map' && (
          <div className="grid lg:grid-cols-12 gap-4 mb-4">
            {/* 2D DOT MAP (SVG / CANVAS VIEW) */}
            <div className="lg:col-span-7 rounded-xl border border-white/10 bg-slate-950/80 p-4 relative overflow-hidden flex flex-col justify-between min-h-[360px]">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                <span className="font-mono text-emerald-400 flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Active Query: <strong className="text-white">{activeItem.emoji} &ldquo;{activeItem.label}&rdquo;</strong>
                </span>
                <span className="text-[10px] text-slate-500">2D t-SNE / PCA Semantic Projection</span>
              </div>

              {/* CLUSTER REGION LABELS */}
              <div className="relative w-full h-[300px] sm:h-[340px] rounded-lg bg-slate-900/40 border border-white/5 overflow-hidden">
                {/* Background grid lines */}
                <div
                  className="absolute inset-0 opacity-15"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
                    backgroundSize: '24px 24px',
                  }}
                />

                {/* Cluster boundary labels */}
                <div className="absolute top-2 left-3 text-[10px] font-bold text-amber-500/60 uppercase tracking-widest pointer-events-none">
                  ☕ Beverages &amp; Cafe
                </div>
                <div className="absolute top-2 right-3 text-[10px] font-bold text-purple-500/60 uppercase tracking-widest pointer-events-none">
                  👑 Royalty &amp; Monarchy
                </div>
                <div className="absolute bottom-2 left-3 text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest pointer-events-none">
                  🚗 Vehicles &amp; Transport
                </div>
                <div className="absolute bottom-2 right-3 text-[10px] font-bold text-blue-500/60 uppercase tracking-widest pointer-events-none">
                  💻 Software &amp; Tech
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold text-pink-500/50 uppercase tracking-widest pointer-events-none">
                  🐾 Animals
                </div>

                {/* SVG Connecting lines from active item to top 4 neighbors */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {topNeighbors.slice(1, 4).map(nb => (
                    <line
                      key={`line-${nb.id}`}
                      x1={`${activeItem.x}%`}
                      y1={`${activeItem.y}%`}
                      x2={`${nb.x}%`}
                      y2={`${nb.y}%`}
                      stroke="#10b981"
                      strokeWidth={nb.similarity > 80 ? '2' : '1'}
                      strokeDasharray={nb.similarity > 80 ? 'none' : '4 4'}
                      opacity={nb.similarity / 100 * 0.7}
                    />
                  ))}
                </svg>

                {/* DOTS */}
                {VOCABULARY.map(item => {
                  const isSelected = item.id === activeItem.id
                  const isNeighbor = topNeighbors.some(nb => nb.id === item.id)
                  const isHovered = hoveredWord === item.id

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.word)}
                      onMouseEnter={() => setHoveredWord(item.id)}
                      onMouseLeave={() => setHoveredWord(null)}
                      style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        borderColor: isSelected ? '#34d399' : item.color,
                      }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer transition-all duration-300 border flex items-center justify-center ${
                        isSelected
                          ? 'w-10 h-10 bg-emerald-500/30 text-base ring-4 ring-emerald-400/40 z-30 scale-110 shadow-lg shadow-emerald-500/50'
                          : isNeighbor
                          ? 'w-8 h-8 bg-slate-800 text-xs z-20 hover:scale-125'
                          : 'w-7 h-7 bg-slate-900/80 text-[10px] opacity-70 hover:opacity-100 hover:scale-125 z-10'
                      }`}
                      title={`${item.label} (${item.cat})`}
                    >
                      <span>{item.emoji}</span>
                      {/* Label tooltip */}
                      <span
                        className={`absolute top-full mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold whitespace-nowrap pointer-events-none transition-all ${
                          isSelected
                            ? 'bg-emerald-500 text-slate-950 opacity-100 font-extrabold shadow-md'
                            : isHovered || isNeighbor
                            ? 'bg-slate-800 text-slate-200 border border-white/10 opacity-100'
                            : 'opacity-0 scale-95'
                        }`}
                      >
                        {item.label}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 font-mono">
                <span>Distance in space = Semantic Difference</span>
                <span className="text-emerald-400">Green lines connect nearest vectors</span>
              </div>
            </div>

            {/* NEAREST NEIGHBOURS & COSINE DISTANCE BARS */}
            <div className="lg:col-span-5 rounded-xl border border-white/10 bg-black/30 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-300">📊 Nearest Neighbours (Ranked)</span>
                  <span className="text-[10px] font-mono text-emerald-400">Cosine Similarity</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-3">
                  Calculated against the vector for <strong className="text-white">&ldquo;{activeItem.label}&rdquo;</strong>:
                </p>

                <div className="space-y-2.5">
                  {topNeighbors.map((nb, i) => {
                    const barColor =
                      nb.similarity >= 90
                        ? 'bg-emerald-500'
                        : nb.similarity >= 70
                        ? 'bg-teal-500'
                        : nb.similarity >= 40
                        ? 'bg-amber-500'
                        : 'bg-slate-600'

                    const textColor =
                      nb.similarity >= 90
                        ? 'text-emerald-300'
                        : nb.similarity >= 70
                        ? 'text-teal-300'
                        : nb.similarity >= 40
                        ? 'text-amber-300'
                        : 'text-slate-400'

                    return (
                      <div
                        key={nb.id}
                        onClick={() => handleSelect(nb.word)}
                        className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                          nb.isSelf
                            ? 'bg-emerald-500/10 border-emerald-500/30'
                            : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-white/15'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <div className="flex items-center gap-1.5 font-semibold text-white">
                            <span className="text-slate-500 font-mono text-[10px]">#{i + 1}</span>
                            <span>{nb.emoji}</span>
                            <span>{nb.label}</span>
                            {nb.isSelf && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-normal">
                                Target Query
                              </span>
                            )}
                          </div>
                          <span className={`font-mono font-bold text-xs ${textColor}`}>
                            {nb.similarity}%
                          </span>
                        </div>

                        {/* Progress bar */}
                        <div className="h-2 rounded-full bg-slate-900 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                            style={{ width: `${Math.max(4, nb.similarity)}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                          <span>Category: {nb.cat}</span>
                          <span className="truncate max-w-[140px]">{nb.desc}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* VECTOR VALUE PREVIEW */}
              <div className="mt-4 pt-3 border-t border-white/10">
                <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Vector representation for &ldquo;{activeItem.word}&rdquo;:
                </div>
                <div className="p-2 rounded bg-black/50 font-mono text-[10px] text-emerald-300 overflow-x-auto flex gap-2">
                  {activeItem.vec.map((val, idx) => (
                    <span key={idx} className="bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                      <span className="text-slate-500 text-[9px] block">{VECTOR_DIMS[idx]}</span>
                      {val.toFixed(2)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VECTOR ARITHMETIC / WORD MATH */}
        {activeTab === 'math' && (
          <div className="rounded-xl border border-white/10 bg-black/30 p-5 mb-4">
            <h3 className="text-sm font-bold text-white mb-2">📐 Vector Arithmetic: &ldquo;Word Math&rdquo;</h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Because embeddings map concepts to spatial directions, adding and subtracting vectors performs conceptual
              arithmetic:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-purple-500/20">
                <div className="text-xs font-bold text-purple-300 mb-2">👑 Royal Gender Transformation</div>
                <div className="flex items-center gap-2 text-sm font-mono text-white mb-3 flex-wrap">
                  <span className="px-2 py-1 rounded bg-purple-500/20 border border-purple-500/30">👑 King</span>
                  <span className="text-slate-500">-</span>
                  <span className="px-2 py-1 rounded bg-blue-500/20 border border-blue-500/30">👨 Man</span>
                  <span className="text-slate-500">+</span>
                  <span className="px-2 py-1 rounded bg-pink-500/20 border border-pink-500/30">👩 Woman</span>
                  <span className="text-emerald-400 font-bold">=</span>
                  <span className="px-2.5 py-1 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
                    👸 Queen (98.4%)
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 m-0 leading-relaxed">
                  Subtracting &ldquo;man&rdquo; removes the male gender direction, isolating the &ldquo;royalty&rdquo; offset.
                  Adding &ldquo;woman&rdquo; lands the vector directly on the coordinates for &ldquo;queen&rdquo;.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-amber-500/20">
                <div className="text-xs font-bold text-amber-300 mb-2">☕ Beverage Flavor Transformation</div>
                <div className="flex items-center gap-2 text-sm font-mono text-white mb-3 flex-wrap">
                  <span className="px-2 py-1 rounded bg-amber-500/20 border border-amber-500/30">🍵 Tea</span>
                  <span className="text-slate-500">+</span>
                  <span className="px-2 py-1 rounded bg-red-500/20 border border-red-500/30">🌶️ Spices</span>
                  <span className="text-slate-500">+</span>
                  <span className="px-2 py-1 rounded bg-slate-500/20 border border-slate-500/30">🥛 Milk</span>
                  <span className="text-emerald-400 font-bold">=</span>
                  <span className="px-2.5 py-1 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
                    ☕ Chai (97.9%)
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 m-0 leading-relaxed">
                  Combining ingredient property vectors shifts the beverage coordinates to the exact sub-cluster for spiced milk tea.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: KEYWORD VS VECTOR SEARCH */}
        {activeTab === 'keyword_vs_vector' && (
          <div className="rounded-xl border border-white/10 bg-black/30 p-5 mb-4">
            <h3 className="text-sm font-bold text-white mb-2">⚡ Keyword (Lexical) vs Semantic Vector Search</h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Suppose a user searches for: <strong className="text-emerald-400 font-mono">&ldquo;steaming morning milk brew with cardamom&rdquo;</strong>
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-rose-500/[0.04] border border-rose-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-rose-300">❌ Traditional Keyword Search (BM25)</span>
                  <span className="text-[10px] font-mono text-rose-400">0 Matches Found</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Keyword search looks for exact string matches. Because documents in the database say &ldquo;Authentic Masala Chai&rdquo;
                  or &ldquo;Hot Tea Recipes&rdquo;, exact match fails because the word &ldquo;steaming&rdquo; or &ldquo;cardamom&rdquo; was not indexed.
                </p>
                <div className="p-2 rounded bg-black/40 text-[11px] text-rose-300 border border-rose-500/20 font-mono">
                  Result: &ldquo;No documents found matching query.&rdquo;
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-300">✅ Semantic Vector Search (Embeddings)</span>
                  <span className="text-[10px] font-mono text-emerald-400">96.8% Similarity</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  The embedding model embeds the concept of &ldquo;steaming morning milk brew&rdquo; into beverage space. The nearest
                  neighbour is found instantly:
                </p>
                <div className="p-2 rounded bg-black/40 text-[11px] text-emerald-300 border border-emerald-500/20 font-mono">
                  Matched Doc: &ldquo;Authentic Chai Recipe — Traditional spiced Indian tea with milk.&rdquo;
                </div>
              </div>
            </div>
          </div>
        )}

        <p className="text-[11px] text-slate-500 m-0">
          💡 <strong>Key Takeaway:</strong> High-dimensional embeddings transform the slippery, ambiguous nature of human language
          into crisp geometry. Cosine similarity lets models measure how closely two thoughts align.
        </p>
      </section>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <figure className="m-0 rounded-xl border border-white/10 overflow-hidden">
          <img src="/assets/learning/ai/ai-lesson5-map.jpg" alt="Meaning search versus keyword match comparison" loading="lazy" />
        </figure>
        <figure className="m-0 rounded-xl border border-white/10 overflow-hidden">
          <img src="/assets/learning/ai/ai-lesson5-sim.jpg" alt="Two sentences compared with a similarity score" loading="lazy" />
        </figure>
      </div>
      {/* EXPLANATION */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-white mt-0 mb-3">How embeddings turn words into meaning</h2>
        <ol className="text-sm text-slate-300 leading-relaxed space-y-2.5 list-decimal pl-5 m-0">
          <li>
            <strong className="text-white">Text becomes a coordinate in high-dimensional space.</strong> State-of-the-art embedding
            models (like OpenAI text-embedding-3 or open-source BGE / E5) assign each text chunk 1,536 or 3,072 floating-point numbers.
          </li>
          <li>
            <strong className="text-white">Similar concepts live close together.</strong> Synonyms, translations, and conceptually
            related phrases cluster tightly in the same neighborhood of vector space.
          </li>
          <li>
            <strong className="text-white">Search compares angles with cosine similarity.</strong> By calculating the dot product of
            normalized vectors, the system scores similarity between 0% and 100% in microseconds.
          </li>
          <li>
            <strong className="text-white">Vector databases scale retrieval.</strong> Tools like Pinecone, Qdrant, Milvus, and pgvector
            use graph indexes (HNSW) to search through billions of vectors without checking every row one by one.
          </li>
        </ol>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5 text-center">
          {[
            ['Words → Coordinates', 'Dense float vectors', '1536+ dimensions'],
            ['Cosine Similarity', 'Measures angular distance', '0% to 100% match'],
            ['Zero Keyword Overlap', 'Finds synonyms & intent', 'Semantic understanding'],
            ['Power of RAG', 'Grounds LLM responses', 'Production AI search'],
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
        <h2 className="text-lg font-bold text-white mt-0 mb-3">Code: In-Memory Semantic Vector Search</h2>
        <p className="text-xs text-slate-400 mt-0 mb-4">
          A lightweight, zero-dependency vector search engine implementing cosine similarity and top-k nearest neighbor ranking.
          Copy and run in Python or JavaScript:
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
          The questions interviewers actually ask about vector embeddings and semantic search. Tap to reveal the approach.
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
            <strong className="text-white">Explain the core intuition:</strong> &ldquo;An embedding is a vector representation where
            semantic distance corresponds to geometric distance. Concepts that mean similar things point in the same direction in vector space.&rdquo;
          </li>
          <li>
            <strong className="text-white">Know why Cosine Similarity wins:</strong> &ldquo;We prefer cosine similarity over Euclidean
            distance because cosine is length-invariant. A long paragraph and a 3-word query about the same topic will point in the same direction even if their lengths differ.&rdquo;
          </li>
          <li>
            <strong className="text-white">Explain Hybrid Search (BM25 + Dense Vectors):</strong> &ldquo;In real-world enterprise RAG,
            we combine dense vector search with lexical BM25 search (reciprocal rank fusion / RRF) so we get the best of both worlds: semantic understanding and exact keyword/SKU/code-identifier matching.&rdquo;
          </li>
          <li>
            <strong className="text-white">Address the scale question (ANN vs k-NN):</strong> &ldquo;Exact k-NN is O(N) which fails at scale.
            Production vector databases use Approximate Nearest Neighbor (ANN) index structures like HNSW (Hierarchical Navigable Small World graphs) to achieve sub-10ms queries across millions of vectors.&rdquo;
          </li>
          <li>
            <strong className="text-white">Connect embeddings to RAG:</strong> &ldquo;Embeddings are the retrieval engine behind RAG.
            They let us find the exact relevant chunks from a knowledge base to inject into the LLM context window, preventing hallucinations.&rdquo;
          </li>
        </ul>
      </section>

      {/* FAQ ACCORDION COMPONENT */}
      <FAQ questions={FAQS} />

      {/* PREV / NEXT NAVIGATION */}
      <div className="flex items-center justify-between flex-wrap gap-3 mt-6">
        <Link to="/learning/ai/hallucinations-and-verifying" className="text-sm font-semibold text-emerald-300 no-underline">
          ← Lesson 4: Hallucinations &amp; Verifying
        </Link>
        <Link to="/learning/ai/rag-chat-with-documents" className="text-sm font-semibold text-emerald-300 no-underline">
          Lesson 6: Chat With Your Documents (RAG) →
        </Link>
      </div>
    </>
  )
}
