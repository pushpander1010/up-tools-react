import { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import FAQ from '../components/FAQ'

const TITLE = 'Building with APIs: REST Endpoints, Payloads & Error Handling'
const DESC = 'Learn how software connects to AI models using REST APIs — interactive API call builder with endpoint picker, Bearer authentication headers, JSON request payloads, live response streaming, and HTTP status code & error simulators (200, 401, 429, 500). Includes production Python & JavaScript code, 5 practice questions, and 4 FAQs.'
const URL = 'https://www.uptools.in/learning/ai/building-with-apis/'

// ---------------------------------------------------------------------------
// Pre-configured API Endpoint Presets
// ---------------------------------------------------------------------------
const API_ENDPOINTS = [
  {
    id: 'chat-completions',
    name: '💬 Chat Completions (LLM)',
    method: 'POST',
    url: 'https://api.openai.com/v1/chat/completions',
    provider: 'OpenAI / DeepSeek / Mistral',
    defaultModel: 'gpt-4o-mini',
    defaultPrompt: 'Summarize the 3 key principles of REST API design in 2 concise sentences.',
    systemPrompt: 'You are a concise technical architect assistant.',
    models: ['gpt-4o-mini', 'gpt-4o', 'deepseek-chat', 'claude-3-5-sonnet'],
    tokenMultiplier: 1.0,
    costPer1kInput: 0.0129, // ₹ per 1k input tokens
    costPer1kOutput: 0.0519, // ₹ per 1k output tokens
    sampleResponse: {
      id: 'chatcmpl-9Ap82X9b1Kd42Lm9',
      object: 'chat.completion',
      created: 1728067200,
      model: 'gpt-4o-mini',
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: 'REST APIs use standard HTTP verbs (GET, POST, PUT, DELETE) to manage stateless resources identified by clear URI paths. They return structured data (typically JSON) alongside standard HTTP status codes to communicate outcome and errors.',
          },
          finish_reason: 'stop',
        },
      ],
      usage: {
        prompt_tokens: 34,
        completion_tokens: 42,
        total_tokens: 76,
      },
    },
  },
  {
    id: 'embeddings',
    name: '🧭 Text Embeddings (Vector Search)',
    method: 'POST',
    url: 'https://api.openai.com/v1/embeddings',
    provider: 'OpenAI Vector API',
    defaultModel: 'text-embedding-3-small',
    defaultPrompt: 'Semantic search query: How to secure API keys in production web apps?',
    systemPrompt: '',
    models: ['text-embedding-3-small', 'text-embedding-3-large'],
    tokenMultiplier: 0.2,
    costPer1kInput: 0.0017,
    costPer1kOutput: 0.0,
    sampleResponse: {
      object: 'list',
      data: [
        {
          object: 'embedding',
          index: 0,
          embedding: [0.0124, -0.0481, 0.0832, -0.0051, 0.0392, '... 1536 float dimensions ...'],
        },
      ],
      model: 'text-embedding-3-small',
      usage: {
        prompt_tokens: 14,
        total_tokens: 14,
      },
    },
  },
  {
    id: 'gemini-generate',
    name: '⚡ Google Gemini Content Generation',
    method: 'POST',
    url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    provider: 'Google Vertex / AI Studio',
    defaultModel: 'gemini-2.0-flash',
    defaultPrompt: 'Explain how exponential backoff prevents server cascading failures.',
    systemPrompt: 'You are an experienced site reliability engineer.',
    models: ['gemini-2.0-flash', 'gemini-1.5-pro'],
    tokenMultiplier: 0.8,
    costPer1kInput: 0.0086,
    costPer1kOutput: 0.0346,
    sampleResponse: {
      candidates: [
        {
          content: {
            parts: [
              {
                text: 'Exponential backoff progressively doubles the waiting interval between failed request retries (e.g., 1s, 2s, 4s, 8s). Combined with random jitter, it prevents the "thundering herd" problem where thousands of clients retry simultaneously, giving overloaded servers time to recover.',
              },
            ],
            role: 'model',
          },
          finishReason: 'STOP',
        },
      ],
      usageMetadata: {
        promptTokenCount: 22,
        candidatesTokenCount: 56,
        totalTokenCount: 78,
      },
    },
  },
  {
    id: 'image-generation',
    name: '🎨 Image Generation (DALL-E / Flux)',
    method: 'POST',
    url: 'https://api.openai.com/v1/images/generations',
    provider: 'OpenAI DALL-E 3',
    defaultModel: 'dall-e-3',
    defaultPrompt: 'Isometric 3D icon of a glowing microchip routing data packets through a secure firewall, dark cyber background.',
    systemPrompt: '',
    models: ['dall-e-3', 'dall-e-2'],
    tokenMultiplier: 1.5,
    costPer1kInput: 3.45,
    costPer1kOutput: 0.0,
    sampleResponse: {
      created: 1728067200,
      data: [
        {
          revised_prompt: 'A vibrant isometric 3D render of a futuristic microchip pulsing with cyan light as glowing data packets traverse a glass network firewall.',
          url: 'https://oaidalleapiprodscus.blob.core.windows.net/private/sample-image-render-result.png',
        },
      ],
    },
  },
]

// ---------------------------------------------------------------------------
// Simulated HTTP Error Catalog
// ---------------------------------------------------------------------------
const ERROR_SIMULATIONS = [
  {
    id: '200',
    code: 200,
    statusText: 'OK',
    label: '200 OK (Success)',
    color: '#10b981',
    description: 'Request succeeded. Valid API key, model inferred prompt, output returned.',
    errorBody: null,
  },
  {
    id: '401',
    code: 401,
    statusText: 'Unauthorized',
    label: '401 Unauthorized (Bad/Missing Key)',
    color: '#f59e0b',
    description: 'Missing or invalid Bearer API token. The provider rejected authorization.',
    errorBody: {
      error: {
        message: 'Incorrect API key provided: sk-inv***12. You can find your API key at https://platform.openai.com/account/api-keys.',
        type: 'invalid_request_error',
        param: null,
        code: 'invalid_api_key',
      },
    },
  },
  {
    id: '429-rate',
    code: 429,
    statusText: 'Too Many Requests',
    label: '429 Too Many Requests (Rate Limit)',
    color: '#ec4899',
    description: 'You exceeded your Requests-Per-Minute (RPM) or Tokens-Per-Minute (TPM) quota.',
    errorBody: {
      error: {
        message: 'Rate limit reached for model gpt-4o-mini in organization org-9842 on tokens per min (TPM). Limit: 60,000. Used: 62,400.',
        type: 'tokens',
        param: null,
        code: 'rate_limit_exceeded',
      },
    },
  },
  {
    id: '429-quota',
    code: 429,
    statusText: 'Too Many Requests',
    label: '429 Insufficient Quota (Billing Balance $0)',
    color: '#a855f7',
    description: 'Prepaid account credit balance is exhausted or billing card failed.',
    errorBody: {
      error: {
        message: 'You exceeded your current quota, please check your plan and billing details. For more information on this error, read the docs: https://platform.openai.com/docs/guides/error-codes/api-errors.',
        type: 'insufficient_quota',
        param: null,
        code: 'insufficient_quota',
      },
    },
  },
  {
    id: '400',
    code: 400,
    statusText: 'Bad Request',
    label: '400 Bad Request (Invalid JSON / Schema)',
    color: '#e11d48',
    description: 'Malformed JSON payload, unrecognized parameter, or context exceeded limit.',
    errorBody: {
      error: {
        message: "Invalid payload: 'messages' field is required and must be an array with at least one message object.",
        type: 'invalid_request_error',
        param: 'messages',
        code: null,
      },
    },
  },
  {
    id: '500',
    code: 500,
    statusText: 'Internal Server Error',
    label: '500 Internal Server Error (Cluster Crash)',
    color: '#ef4444',
    description: 'The AI provider GPU cluster encountered a transient internal failure. Retry with backoff.',
    errorBody: {
      error: {
        message: 'The server encountered an internal error while processing your request. Please retry your request after a brief delay.',
        type: 'server_error',
        param: null,
        code: 'internal_error',
      },
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
    q: 'What is the difference between an API Key and an End-User Login Password?',
    a: 'An API key is a programmatic credential generated for machine-to-machine communication, granting backend code authorized access to cloud AI models without human interactive logins or captcha prompts. API keys must never be shared, hardcoded in frontend React/Vue code, or committed to GitHub repositories. In contrast, passwords authenticate individual human users into web dashboards and are usually accompanied by two-factor authentication (2FA).',
  },
  {
    q: 'Why should you never call AI API endpoints directly from client-side browser JavaScript?',
    a: 'Calling AI APIs directly in browser JavaScript exposes your secret API key to anyone who opens Chrome Developer Tools (Network / Sources tabs). Malicious users can steal your key, run unauthorized queries, exhaust your prepaid quota, and generate thousands of dollars in cloud bills. Always proxy requests through your own backend server (Node.js, Python FastAPI, Go), where the API key remains securely stored in server environment variables (.env).',
  },
  {
    q: 'What does HTTP Status Code 429 mean in AI APIs, and how should production code handle it?',
    a: 'HTTP 429 indicates "Too Many Requests" — triggered either by exceeding your tier\'s rate limits (Requests Per Minute - RPM or Tokens Per Minute - TPM) or having zero prepaid billing credits. Production applications should handle 429 by implementing Exponential Backoff with Jitter: waiting 1 second, then 2s, 4s, 8s plus a random millisecond delay before retrying, rather than immediately hammering the endpoint in a tight loop.',
  },
  {
    q: 'What is Server-Sent Events (SSE) Streaming (stream: true), and why is it preferred for user chat interfaces?',
    a: 'Without streaming (stream: false), the client must wait 5 to 15 seconds while the entire response is generated on the server before receiving any data. With streaming (stream: true), the AI provider transmits tokens in real-time over an HTTP Server-Sent Events connection as soon as each word is predicted. This drops Time-To-First-Token (TTFT) to under 300ms, making user applications feel instantaneous and responsive.',
  },
  {
    q: 'What are JSON Mode and Structured Outputs, and why are they essential for building software with LLMs?',
    a: 'Standard LLMs generate conversational markdown text that can vary unpredictably. By enabling JSON Mode (e.g. response_format: { type: "json_object" }) or Strict JSON Schemas, the API guarantees that the model\'s output strictly adheres to a predefined JSON schema with exact keys, types, and arrays. This enables your backend code to safely run JSON.parse() without crashes or regex parsing hacks.',
  },
]

const FAQS = [
  {
    q: 'How do I securely store and load AI API keys in Node.js and Python projects?',
    a: 'Store your keys in a `.env` file located in the root directory of your project (e.g. `OPENAI_API_KEY=sk-proj-12345...`) and add `.env` to your `.gitignore` file so it is never committed to Git. In Python, load it using `from dotenv import load_dotenv; load_dotenv()`, and in Node.js use `process.env.OPENAI_API_KEY` (or `import "dotenv/config"`). In production, set environment variables directly in your cloud host (AWS Secrets Manager, Vercel Environment Variables, Render, or Docker secrets).',
  },
  {
    q: 'What is the difference between REST API calls and the official SDKs (e.g. openai or @google/genai npm packages)?',
    a: 'Under the hood, official SDKs make standard HTTP REST requests using `fetch` or `requests`. However, SDKs provide immense developer benefits: automatic type safety (TypeScript types / Python type hints), built-in automatic retries with exponential backoff on 429/500 errors, helper methods for stream parsing, and simplified parameter construction. Using official SDKs is recommended for production apps.',
  },
  {
    q: 'How do I estimate and cap API costs before deploying an AI-powered feature to thousands of users?',
    a: '1) Set hard billing spend limits in your AI provider dashboard (e.g. monthly spend cap of $50). 2) Restrict `max_tokens` in your request payload so run-away generations stop after 200-500 tokens. 3) Cache frequent query results in Redis so duplicate questions cost $0. 4) Route simple queries to low-cost tier-1 models (like GPT-4o-mini or Gemini 2.0 Flash) and reserve flagship models only for complex reasoning tasks.',
  },
  {
    q: 'Can I switch between OpenAI, Anthropic Claude, Google Gemini, and open-source models without rewriting all my API code?',
    a: 'Yes. Most modern AI providers (including DeepSeek, Mistral, Groq, Together AI, Perplexity, and Ollama) offer OpenAI-compatible REST endpoints. You simply change the `baseURL` (e.g., `baseURL: "https://api.deepseek.com"` or `http://localhost:11434/v1`) and replace the API key, keeping the exact same chat completions request and response structure. Alternatively, you can use unified proxy libraries like LiteLLM or OpenRouter.',
  },
]

const PY_CODE = `# Complete Production AI API Client in Python with Exponential Backoff, Streaming & Error Handling
# pip install openai python-dotenv requests
import os
import time
import random
import requests
from dotenv import load_dotenv
from openai import OpenAI, APIError, RateLimitError, AuthenticationError

load_dotenv()
API_KEY = os.getenv("OPENAI_API_KEY", "sk-proj-demo-key-replace-with-env")

# ---------------------------------------------------------------------------
# 1. Native REST Request with Requests & Exponential Backoff Retry Loop
# ---------------------------------------------------------------------------
def call_chat_api_raw_http(prompt: str, max_retries: int = 3) -> dict:
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": "You are a concise engineering assistant."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.4,
        "max_tokens": 300
    }

    for attempt in range(1, max_retries + 1):
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=15)
            
            # Handle standard status codes
            if response.status_code == 200:
                data = response.json()
                content = data["choices"][0]["message"]["content"]
                usage = data.get("usage", {})
                print(f"✓ Success! Tokens used: {usage.get('total_tokens', 0)}")
                return {"success": True, "content": content, "usage": usage}
            
            elif response.status_code == 429:
                wait_time = (2 ** attempt) + (random.randint(100, 1000) / 1000)
                print(f"⚠️ 429 Rate Limit. Retrying attempt {attempt}/{max_retries} after {wait_time:.2f}s...")
                time.sleep(wait_time)
            
            elif response.status_code == 401:
                print("❌ 401 Unauthorized: Invalid API key. Check .env file.")
                return {"success": False, "error": "Invalid API Key"}
            
            else:
                print(f"❌ HTTP {response.status_code}: {response.text}")
                if attempt == max_retries:
                    return {"success": False, "error": response.text}
                time.sleep(2)

        except requests.exceptions.Timeout:
            print(f"⏳ Request timed out (attempt {attempt}/{max_retries}).")
            time.sleep(2)
        except requests.exceptions.RequestException as e:
            print(f"🚨 Network Error: {e}")
            break

    return {"success": False, "error": "Max retries exceeded"}

# ---------------------------------------------------------------------------
# 2. Production Streaming Client with Official OpenAI SDK
# ---------------------------------------------------------------------------
def stream_ai_response(prompt: str):
    """Streams response word-by-word with ultra-low latency."""
    client = OpenAI(api_key=API_KEY)
    
    try:
        print("\\n⚡ Streaming live response:\\n" + "-" * 30)
        stream = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            stream=True,
            temperature=0.3
        )
        
        full_text = ""
        for chunk in stream:
            token = chunk.choices[0].delta.content or ""
            print(token, end="", flush=True)
            full_text += token
        print("\\n" + "-" * 30 + "\\n✓ Stream complete.")
        return full_text

    except AuthenticationError:
        print("❌ Auth Error: Check your OpenAI API Key.")
    except RateLimitError:
        print("⚠️ Rate Limit Exceeded or Quota Balance $0.")
    except APIError as e:
        print(f"🚨 OpenAI API Error: {e.message}")`

const JS_CODE = `// Complete Node.js / Express AI API Integration with Streaming & Safe Proxy
// npm install openai dotenv express
import 'dotenv/config';
import OpenAI from 'openai';
import express from 'express';

const app = express();
app.use(express.json());

// Initialize SDK with secure server-side environment key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 15000, // 15s timeout budget
  maxRetries: 3,  // Built-in exponential backoff on 429/500
});

// ---------------------------------------------------------------------------
// 1. Standard JSON Structured API Route
// ---------------------------------------------------------------------------
app.post('/api/generate-summary', async (req, res) => {
  const { documentText } = req.body;
  if (!documentText) {
    return res.status(400).json({ error: "Field 'documentText' is required." });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You extract key action items as strict JSON.' },
        { role: 'user', content: documentText }
      ],
      response_format: { type: 'json_object' }, // Guarantees valid parseable JSON
      temperature: 0.2,
    });

    const parsedJson = JSON.parse(completion.choices[0].message.content);
    res.json({
      success: true,
      data: parsedJson,
      tokensUsed: completion.usage.total_tokens
    });
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error(\`[OpenAI Error] Status: \${error.status}, Message: \${error.message}\`);
      return res.status(error.status || 500).json({ error: error.message, code: error.code });
    }
    res.status(500).json({ error: 'Internal Server Failure' });
  }
});

// ---------------------------------------------------------------------------
// 2. High-Speed Server-Sent Events (SSE) Live Stream Route
// ---------------------------------------------------------------------------
app.get('/api/chat-stream', async (req, res) => {
  const { prompt } = req.query;
  if (!prompt) return res.status(400).send("Query 'prompt' is required");

  // Configure SSE Response Headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: String(prompt) }],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        // Send SSE formatted chunk: data: <token>\n\n
        res.write(\`data: \${JSON.stringify({ token: content })}\\n\\n\`);
      }
    }
    res.write('data: [DONE]\\n\\n');
    res.end();
  } catch (err) {
    console.error('Streaming error:', err.message);
    res.write(\`data: \${JSON.stringify({ error: err.message })}\\n\\n\`);
    res.end();
  }
});

app.listen(3000, () => console.log('🚀 AI API Gateway running on http://localhost:3000'));`

export default function ApisPage() {
  const [activeTab, setActiveTab] = useState('builder') // 'builder' | 'status-codes' | 'architecture' | 'rules'
  
  // Builder Configuration State
  const [selectedEndpointId, setSelectedEndpointId] = useState(API_ENDPOINTS[0].id)
  const [apiKeyMode, setApiKeyMode] = useState('valid') // 'valid' | 'invalid' | 'missing'
  const [customApiKey, setCustomApiKey] = useState('sk-proj-89f4b2c1e8a7d0394827103847291048')
  const [showApiKey, setShowApiKey] = useState(false)
  const [model, setModel] = useState(API_ENDPOINTS[0].defaultModel)
  const [promptText, setPromptText] = useState(API_ENDPOINTS[0].defaultPrompt)
  const [temperature, setTemperature] = useState(0.5)
  const [maxTokens, setMaxTokens] = useState(256)
  const [isStreaming, setIsStreaming] = useState(true)
  const [simulatedErrorId, setSimulatedErrorId] = useState('200') // '200' | '401' | '429-rate' | '429-quota' | '400' | '500'

  // Execution & Live Animation State
  const [isCalling, setIsCalling] = useState(false)
  const [executionPhase, setExecutionPhase] = useState('idle') // 'idle' | 'transmitting' | 'gateway-auth' | 'gpu-infer' | 'streaming' | 'complete'
  const [streamedText, setStreamedText] = useState('')
  const [activeResponse, setActiveResponse] = useState(null)
  const [activeStatusCode, setActiveStatusCode] = useState(200)
  const [activeLatency, setActiveLatency] = useState(320)
  const [activeInspectorTab, setActiveInspectorTab] = useState('response-body') // 'response-body' | 'request-json' | 'headers'

  const canvasRef = useRef(null)
  const streamIntervalRef = useRef(null)

  // Current Endpoint Object
  const currentEndpoint = useMemo(() => {
    return API_ENDPOINTS.find(e => e.id === selectedEndpointId) || API_ENDPOINTS[0]
  }, [selectedEndpointId])

  // Current Error Simulation Object
  const currentError = useMemo(() => {
    // If API key is missing or invalid, force 401 unless overridden
    if (apiKeyMode === 'missing' || apiKeyMode === 'invalid') {
      return ERROR_SIMULATIONS.find(e => e.id === '401')
    }
    return ERROR_SIMULATIONS.find(e => e.id === simulatedErrorId) || ERROR_SIMULATIONS[0]
  }, [apiKeyMode, simulatedErrorId])

  // Computed Effective API Key Header
  const effectiveAuthHeader = useMemo(() => {
    if (apiKeyMode === 'missing') return null
    if (apiKeyMode === 'invalid') return 'Bearer sk-invalid-token-demo'
    return `Bearer ${customApiKey}`
  }, [apiKeyMode, customApiKey])

  // Computed Request JSON Payload
  const requestPayload = useMemo(() => {
    if (currentEndpoint.id === 'chat-completions') {
      return {
        model,
        messages: [
          ...(currentEndpoint.systemPrompt ? [{ role: 'system', content: currentEndpoint.systemPrompt }] : []),
          { role: 'user', content: promptText },
        ],
        temperature: Number(temperature),
        max_tokens: Number(maxTokens),
        stream: isStreaming,
      }
    } else if (currentEndpoint.id === 'embeddings') {
      return {
        model,
        input: promptText,
      }
    } else if (currentEndpoint.id === 'gemini-generate') {
      return {
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: {
          temperature: Number(temperature),
          maxOutputTokens: Number(maxTokens),
        },
      }
    } else {
      return {
        model,
        prompt: promptText,
        n: 1,
        size: '1024x1024',
      }
    }
  }, [currentEndpoint, model, promptText, temperature, maxTokens, isStreaming])

  // Handle Changing Endpoint
  const handleSelectEndpoint = (endpoint) => {
    setSelectedEndpointId(endpoint.id)
    setModel(endpoint.defaultModel)
    setPromptText(endpoint.defaultPrompt)
    setActiveResponse(null)
    setStreamedText('')
    setExecutionPhase('idle')
  }

  // Live Simulated API Dispatch
  const handleSendApiCall = () => {
    if (isCalling) return
    setIsCalling(true)
    setStreamedText('')
    setActiveResponse(null)

    // Stage 1: Transmitting over wire (0ms - 250ms)
    setExecutionPhase('transmitting')

    setTimeout(() => {
      // Stage 2: Gateway Auth & Rate Limit Check (250ms - 500ms)
      setExecutionPhase('gateway-auth')

      setTimeout(() => {
        // If 401 or immediate error
        if (currentError.code !== 200) {
          setExecutionPhase('complete')
          setIsCalling(false)
          setActiveStatusCode(currentError.code)
          setActiveLatency(140 + Math.floor(Math.random() * 80))
          setActiveResponse(currentError.errorBody)
          return
        }

        // Stage 3: GPU Inference Engine (500ms - 800ms)
        setExecutionPhase('gpu-infer')

        setTimeout(() => {
          // Stage 4: Streaming or Instant Result
          setActiveStatusCode(200)
          const targetResponse = currentEndpoint.sampleResponse
          const sampleFullText =
            currentEndpoint.id === 'chat-completions'
              ? targetResponse.choices[0].message.content
              : currentEndpoint.id === 'gemini-generate'
              ? targetResponse.candidates[0].content.parts[0].text
              : JSON.stringify(targetResponse, null, 2)

          if (isStreaming && (currentEndpoint.id === 'chat-completions' || currentEndpoint.id === 'gemini-generate')) {
            setExecutionPhase('streaming')
            const words = sampleFullText.split(' ')
            let currentIndex = 0

            streamIntervalRef.current = setInterval(() => {
              if (currentIndex < words.length) {
                setStreamedText(prev => (prev ? prev + ' ' + words[currentIndex] : words[currentIndex]))
                currentIndex++
              } else {
                clearInterval(streamIntervalRef.current)
                setExecutionPhase('complete')
                setIsCalling(false)
                setActiveLatency(340 + Math.floor(Math.random() * 120))
                setActiveResponse(targetResponse)
              }
            }, 60)
          } else {
            setExecutionPhase('complete')
            setIsCalling(false)
            setActiveLatency(280 + Math.floor(Math.random() * 100))
            setActiveResponse(targetResponse)
          }
        }, 350)
      }, 300)
    }, 250)
  }

  // Cleanup streaming timer on unmount
  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current)
    }
  }, [])

  // Visual Canvas Rendering: Network Packet Traversal & Latency Pipeline
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

    // Background Clear
    ctx.fillStyle = '#0a0f1d'
    ctx.fillRect(0, 0, width, height)

    // Left Panel: Dynamic HTTP Status Dial & Telemetry (38% width)
    const leftW = Math.floor(width * 0.38)
    const cx = leftW / 2 + 10
    const cy = height * 0.52
    const radius = 60

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
    ctx.lineWidth = 1
    ctx.strokeRect(10, 10, leftW - 10, height - 20)

    ctx.fillStyle = '#94a3b8'
    ctx.font = '10px monospace'
    ctx.fillText('LIVE HTTP STATUS & LATENCY', 20, 26)

    // Gauge Track
    const startAngle = Math.PI * 0.75
    const endAngle = Math.PI * 2.25
    const totalAngle = endAngle - startAngle

    ctx.beginPath()
    ctx.arc(cx, cy, radius, startAngle, endAngle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 10
    ctx.lineCap = 'round'
    ctx.stroke()

    // Determine status color & ratio
    let statusColor = currentError.color
    let statusNumber = currentError.code
    let progressRatio = statusNumber === 200 ? 0.95 : statusNumber === 429 ? 0.65 : 0.35

    if (executionPhase === 'transmitting' || executionPhase === 'gateway-auth' || executionPhase === 'gpu-infer') {
      statusColor = '#38bdf8'
      progressRatio = 0.5
    }

    ctx.beginPath()
    ctx.arc(cx, cy, radius, startAngle, startAngle + totalAngle * progressRatio)
    ctx.strokeStyle = statusColor
    ctx.lineWidth = 10
    ctx.lineCap = 'round'
    ctx.shadowColor = statusColor
    ctx.shadowBlur = 8
    ctx.stroke()
    ctx.shadowBlur = 0

    // Center Status Text
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 20px monospace'
    ctx.textAlign = 'center'
    ctx.fillText(
      isCalling ? '...' : `${statusNumber}`,
      cx,
      cy - 2
    )

    ctx.fillStyle = statusColor
    ctx.font = 'bold 9px sans-serif'
    ctx.fillText(
      isCalling ? 'IN FLIGHT' : currentError.statusText.toUpperCase(),
      cx,
      cy + 16
    )

    ctx.fillStyle = '#94a3b8'
    ctx.font = '9px monospace'
    ctx.fillText(
      isCalling ? 'REQUEST ACTIVE' : `RTT: ${activeLatency}ms`,
      cx,
      cy + 30
    )

    // Right Panel: 4-Node API Request Pipeline Flow Diagram
    const rightX = leftW + 20
    const rightW = width - rightX - 16

    ctx.textAlign = 'left'
    ctx.fillStyle = '#94a3b8'
    ctx.font = '11px sans-serif'
    ctx.fillText('API CALL PIPELINE: CLIENT ➔ GATEWAY ➔ GPU CLUSTER ➔ STREAM', rightX, 26)

    const nodeY = 82
    const nodeW = 72
    const nodeH = 46
    const gap = Math.floor((rightW - nodeW * 4) / 3)

    const n1X = rightX
    const n2X = n1X + nodeW + gap
    const n3X = n2X + nodeW + gap
    const n4X = n3X + nodeW + gap

    const nodes = [
      {
        x: n1X,
        title: '💻 Client App',
        sub: 'App / Server',
        active: executionPhase === 'transmitting' || executionPhase === 'complete',
        color: '#38bdf8',
      },
      {
        x: n2X,
        title: '🛡️ Auth Gate',
        sub: apiKeyMode === 'missing' ? 'No Key' : apiKeyMode === 'invalid' ? 'Bad Key' : 'Bearer Token',
        active: executionPhase === 'gateway-auth',
        color: apiKeyMode === 'valid' ? '#10b981' : '#f59e0b',
      },
      {
        x: n3X,
        title: '⚡ GPU Cluster',
        sub: model.split('-').slice(0, 2).join('-'),
        active: executionPhase === 'gpu-infer',
        color: '#a855f7',
      },
      {
        x: n4X,
        title: isStreaming ? '🌊 SSE Stream' : '📦 JSON Body',
        sub: isStreaming ? 'Chunk Tokens' : 'Bulk Payload',
        active: executionPhase === 'streaming' || (executionPhase === 'complete' && activeStatusCode === 200),
        color: '#10b981',
      },
    ]

    nodes.forEach((n) => {
      ctx.fillStyle = n.active ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.03)'
      ctx.strokeStyle = n.active ? n.color : 'rgba(255, 255, 255, 0.12)'
      ctx.lineWidth = n.active ? 1.5 : 1
      ctx.beginPath()
      ctx.roundRect(n.x, nodeY, nodeW, nodeH, 6)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 9px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(n.title, n.x + nodeW / 2, nodeY + 18)

      ctx.fillStyle = n.color
      ctx.font = '8px monospace'
      ctx.fillText(n.sub, n.x + nodeW / 2, nodeY + 34)
    })

    // Connecting Connector Lines & Animated Data Packet
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(n1X + nodeW, nodeY + nodeH / 2)
    ctx.lineTo(n2X, nodeY + nodeH / 2)
    ctx.moveTo(n2X + nodeW, nodeY + nodeH / 2)
    ctx.lineTo(n3X, nodeY + nodeH / 2)
    ctx.moveTo(n3X + nodeW, nodeY + nodeH / 2)
    ctx.lineTo(n4X, nodeY + nodeH / 2)
    ctx.stroke()

    // Bottom Telemetry Info
    ctx.textAlign = 'left'
    ctx.fillStyle = '#64748b'
    ctx.font = '10px sans-serif'
    ctx.fillText(
      `Endpoint: ${currentEndpoint.method} ${currentEndpoint.url.replace('https://api.openai.com', '')} | Auth: ${effectiveAuthHeader ? 'PRESENT' : 'NONE'} | Stream: ${isStreaming ? 'TRUE' : 'FALSE'}`,
      rightX,
      height - 16
    )
  }, [executionPhase, activeStatusCode, activeLatency, currentEndpoint, currentError, apiKeyMode, isStreaming, model, effectiveAuthHeader, isCalling])

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
    name: 'How to Build Software Applications with AI REST APIs',
    step: [
      {
        '@type': 'HowToStep',
        text: 'Acquire and Secure Your API Key: Generate an API key from the developer console (OpenAI, Anthropic, Google AI Studio) and store it in server environment variables (.env).',
      },
      {
        '@type': 'HowToStep',
        text: 'Construct the HTTP Request Payload: Format standard POST requests with Bearer Authentication headers, model name, messages array, and temperature hyperparameters.',
      },
      {
        '@type': 'HowToStep',
        text: 'Enable Server-Sent Events (SSE) Streaming: Set stream: true to receive token chunks immediately, delivering sub-300ms time-to-first-token UX.',
      },
      {
        '@type': 'HowToStep',
        text: 'Implement Exponential Backoff Retry Loops: Catch HTTP 429 and 500 errors and retry with progressive randomized delays to prevent cascading traffic failures.',
      },
      {
        '@type': 'HowToStep',
        text: 'Enforce Strict JSON Schema Validation: Use response_format JSON mode or tool function calling schemas to guarantee safe backend database ingestion.',
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
        <meta property="og:image" content="https://www.uptools.in/assets/learning/ai/ai-lesson14-hero.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${TITLE} | UpTools`} />
        <meta name="twitter:description" content={DESC} />
        <meta name="twitter:image" content="https://www.uptools.in/assets/learning/ai/ai-lesson14-hero.jpg" />
        <meta
          name="keywords"
          content="building with AI APIs, REST API tutorial, LLM API integration, OpenAI API Python, chat completions API, 429 rate limit exponential backoff, SSE streaming tokens, AI API authentication"
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
              { '@type': 'ListItem', position: 4, name: 'Building with APIs', item: URL },
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
        <span className="text-slate-300 font-medium">Building with APIs</span>
      </nav>

      {/* BADGE & HEADER */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 mb-4">
        <span>🔧</span> AI · Lesson 14 · Beginner
      </div>
      <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight m-0 mb-3">
        Building with APIs: REST Endpoints, Authentication, Payloads &amp; Error Handling
      </h1>
      <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-3xl">
        AI models aren’t just web chat boxes — they are high-speed cloud APIs waiting to power your software, mobile apps, and automated workflows. Learn how to construct <strong>HTTP POST requests</strong>, manage <strong>Bearer API authentication</strong>, stream tokens in real-time, and handle <strong>429 rate limits</strong> and <strong>500 server errors</strong> with production resilience.
      </p>

      <figure className="m-0 mb-6 rounded-xl border border-white/10 overflow-hidden">
        <img src="/assets/learning/ai/ai-lesson14-hero.jpg" alt="Robot plugging app blocks together with API keys" loading="lazy" />
      </figure>

      {/* LIVE INTERACTIVE SIMULATOR & API CALL BUILDER */}
      <section
        className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6"
        aria-label="Live AI REST API Simulator & Inspector"
      >
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-white m-0">▶ Live Demo: AI API Call Builder, Status Inspector &amp; Error Simulator</h2>
            <p className="text-xs text-slate-400 m-0 mt-0.5">
              Pick an endpoint, configure auth headers and request JSON, trigger the call, and inspect live packet streaming and status codes.
            </p>
          </div>
          <div className="flex rounded-xl bg-black/40 border border-white/10 p-1 flex-wrap gap-1">
            <button
              onClick={() => setActiveTab('builder')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-all ${
                activeTab === 'builder' ? 'bg-emerald-500/30 text-emerald-300' : 'text-slate-400 bg-transparent hover:text-white'
              }`}
            >
              ⚡ Live API Builder
            </button>
            <button
              onClick={() => setActiveTab('status-codes')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-all ${
                activeTab === 'status-codes' ? 'bg-emerald-500/30 text-emerald-300' : 'text-slate-400 bg-transparent hover:text-white'
              }`}
            >
              🚦 Status Codes &amp; Errors
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-all ${
                activeTab === 'architecture' ? 'bg-emerald-500/30 text-emerald-300' : 'text-slate-400 bg-transparent hover:text-white'
              }`}
            >
              🧱 REST Architecture
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition-all ${
                activeTab === 'rules' ? 'bg-emerald-500/30 text-emerald-300' : 'text-slate-400 bg-transparent hover:text-white'
              }`}
            >
              🛠️ 5 Production Rules
            </button>
          </div>
        </div>

        {/* TAB 1: LIVE API BUILDER */}
        {activeTab === 'builder' && (
          <div className="space-y-4">
            {/* ENDPOINT SELECTOR */}
            <div>
              <div className="text-xs font-semibold text-slate-400 mb-2">1. Select AI REST Endpoint:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {API_ENDPOINTS.map((endpoint) => (
                  <button
                    key={endpoint.id}
                    onClick={() => handleSelectEndpoint(endpoint)}
                    className={`p-2.5 rounded-xl text-left border cursor-pointer transition-all ${
                      selectedEndpointId === endpoint.id
                        ? 'bg-white/10 border-emerald-500/50 shadow-lg'
                        : 'bg-black/30 border-white/5 hover:border-white/20 text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold text-white truncate">{endpoint.name}</div>
                    <div className="text-[10px] text-emerald-400 font-mono mt-0.5 truncate">{endpoint.method} {endpoint.url.split('.com')[1] || endpoint.url.split('.googleapis.com')[1]}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* CANVAS NETWORK PIPELINE & STATUS GAUGE */}
            <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0a0f1d]">
              <canvas
                ref={canvasRef}
                width={700}
                height={210}
                className="w-full block"
                style={{ maxHeight: '230px' }}
              />
            </div>

            {/* TWO COLUMN WORKSPACE: CONFIGURATION VS LIVE INSPECTOR */}
            <div className="grid lg:grid-cols-2 gap-4">
              {/* LEFT COLUMN: REQUEST BUILDER CONTROLS */}
              <div className="space-y-3 rounded-xl bg-black/40 border border-white/10 p-4">
                <div className="flex items-center justify-between text-xs font-semibold text-white border-b border-white/10 pb-2">
                  <span>🛠️ Request Parameters</span>
                  <span className="text-[10px] font-mono text-slate-400">{currentEndpoint.provider}</span>
                </div>

                {/* API Key Management */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">Authorization Header (API Key):</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setApiKeyMode('valid')}
                        className={`px-2 py-0.5 rounded text-[10px] border cursor-pointer ${
                          apiKeyMode === 'valid' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-white/5 text-slate-400 border-transparent'
                        }`}
                      >
                        ✓ Valid Key
                      </button>
                      <button
                        onClick={() => setApiKeyMode('invalid')}
                        className={`px-2 py-0.5 rounded text-[10px] border cursor-pointer ${
                          apiKeyMode === 'invalid' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-white/5 text-slate-400 border-transparent'
                        }`}
                      >
                        ⚠️ Invalid Key
                      </button>
                      <button
                        onClick={() => setApiKeyMode('missing')}
                        className={`px-2 py-0.5 rounded text-[10px] border cursor-pointer ${
                          apiKeyMode === 'missing' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-white/5 text-slate-400 border-transparent'
                        }`}
                      >
                        ❌ Missing Key
                      </button>
                    </div>
                  </div>

                  <div className="relative flex items-center">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={apiKeyMode === 'missing' ? '' : apiKeyMode === 'invalid' ? 'sk-invalid-demo-key-1234' : customApiKey}
                      onChange={(e) => {
                        setCustomApiKey(e.target.value)
                        setApiKeyMode('valid')
                      }}
                      placeholder="Enter Bearer API key..."
                      className="w-full rounded-lg bg-black/60 border border-white/10 px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500/50"
                    />
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-2 text-[10px] text-slate-400 hover:text-white bg-transparent border-0 cursor-pointer"
                    >
                      {showApiKey ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                {/* Model & Temperature */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Model Selection:</label>
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full rounded-lg bg-black/60 border border-white/10 px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
                    >
                      {currentEndpoint.models.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span>Temperature:</span>
                      <span className="text-emerald-400 font-mono">{temperature}</span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="1.5"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* User Prompt Input */}
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Prompt / Message Content:</label>
                  <textarea
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    rows={3}
                    placeholder="Type user prompt to transmit in request payload..."
                    className="w-full rounded-lg bg-black/60 border border-white/10 p-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500/50 resize-y"
                  />
                </div>

                {/* Toggles & Error Simulator Switcher */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
                    <div>
                      <div className="text-[11px] font-bold text-white">Stream SSE</div>
                      <div className="text-[9px] text-slate-400">Tokens as they generate</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isStreaming}
                        onChange={(e) => setIsStreaming(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Simulate HTTP Status:</label>
                    <select
                      value={simulatedErrorId}
                      onChange={(e) => setSimulatedErrorId(e.target.value)}
                      className="w-full rounded-lg bg-black/60 border border-white/10 px-2 py-1.5 text-[11px] text-slate-200 focus:outline-none focus:border-emerald-500/50"
                    >
                      {ERROR_SIMULATIONS.map((err) => (
                        <option key={err.id} value={err.id}>
                          {err.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* SEND REQUEST ACTION BUTTON */}
                <button
                  onClick={handleSendApiCall}
                  disabled={isCalling}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border-0 cursor-pointer shadow-lg transition-all ${
                    isCalling
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                  }`}
                >
                  {isCalling ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                      <span>Transmitting HTTP Request...</span>
                    </>
                  ) : (
                    <>
                      <span>🚀 Send {currentEndpoint.method} Request</span>
                      <span className="text-[10px] opacity-75 font-mono">({currentEndpoint.url.split('/v1')[1] || '/generateContent'})</span>
                    </>
                  )}
                </button>
              </div>

              {/* RIGHT COLUMN: LIVE INSPECTOR & RESPONSE VIEWER */}
              <div className="space-y-2 flex flex-col">
                <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-xl p-1">
                  <div className="flex gap-1">
                    <button
                      onClick={() => setActiveInspectorTab('response-body')}
                      className={`text-xs font-semibold px-3 py-1 rounded-lg border-0 cursor-pointer ${
                        activeInspectorTab === 'response-body' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 bg-transparent'
                      }`}
                    >
                      📦 Response Body
                    </button>
                    <button
                      onClick={() => setActiveInspectorTab('request-json')}
                      className={`text-xs font-semibold px-3 py-1 rounded-lg border-0 cursor-pointer ${
                        activeInspectorTab === 'request-json' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 bg-transparent'
                      }`}
                    >
                      📤 Request Payload
                    </button>
                    <button
                      onClick={() => setActiveInspectorTab('headers')}
                      className={`text-xs font-semibold px-3 py-1 rounded-lg border-0 cursor-pointer ${
                        activeInspectorTab === 'headers' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 bg-transparent'
                      }`}
                    >
                      📑 Headers
                    </button>
                  </div>
                  <div className="flex items-center gap-2 pr-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      activeStatusCode === 200 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      HTTP {activeStatusCode}
                    </span>
                  </div>
                </div>

                {/* Tab Content Box */}
                <div className="flex-1 min-h-[300px] rounded-xl bg-black/50 border border-white/10 p-3 text-xs font-mono text-slate-200 overflow-y-auto leading-relaxed">
                  {activeInspectorTab === 'response-body' && (
                    <div>
                      {isCalling && isStreaming && (
                        <div className="space-y-2">
                          <div className="text-[10px] text-sky-400 flex items-center gap-1.5 animate-pulse">
                            <span className="inline-block w-2 h-2 rounded-full bg-sky-400" />
                            Streaming tokens via SSE connection...
                          </div>
                          <div className="whitespace-pre-wrap text-slate-200 bg-black/40 p-3 rounded-lg border border-white/5">
                            {streamedText || <span className="text-slate-500 italic">Awaiting first token chunk...</span>}
                          </div>
                        </div>
                      )}

                      {!isCalling && activeResponse && (
                        <pre className="m-0 text-[11px] leading-relaxed whitespace-pre-wrap select-all">
                          {JSON.stringify(activeResponse, null, 2)}
                        </pre>
                      )}

                      {!isCalling && !activeResponse && (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12 text-center">
                          <div className="text-2xl mb-2">⚡</div>
                          <div>Click <strong>Send POST Request</strong> on the left to execute API call</div>
                          <div className="text-[10px] text-slate-600 mt-1">Live response, status codes, and token usage will render here.</div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeInspectorTab === 'request-json' && (
                    <pre className="m-0 text-[11px] leading-relaxed text-slate-300 whitespace-pre-wrap select-all">
                      {JSON.stringify(requestPayload, null, 2)}
                    </pre>
                  )}

                  {activeInspectorTab === 'headers' && (
                    <div className="space-y-3 text-[11px]">
                      <div>
                        <div className="text-slate-400 font-bold mb-1">HTTP Request Headers:</div>
                        <div className="p-2 rounded bg-black/40 border border-white/5 space-y-1 text-slate-300 font-mono">
                          <div>POST {currentEndpoint.url} HTTP/2</div>
                          <div>Host: {currentEndpoint.url.replace('https://', '').split('/')[0]}</div>
                          <div>Content-Type: application/json</div>
                          <div className={effectiveAuthHeader ? 'text-emerald-300' : 'text-rose-400'}>
                            Authorization: {effectiveAuthHeader || '<MISSING_AUTH_HEADER>'}
                          </div>
                          <div>User-Agent: UpTools-ApiClient/1.0</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-slate-400 font-bold mb-1">HTTP Response Headers:</div>
                        <div className="p-2 rounded bg-black/40 border border-white/5 space-y-1 text-slate-300 font-mono">
                          <div className={activeStatusCode === 200 ? 'text-emerald-300' : 'text-rose-400'}>
                            HTTP/2 {activeStatusCode} {currentError.statusText}
                          </div>
                          <div>content-type: {isStreaming ? 'text/event-stream; charset=utf-8' : 'application/json'}</div>
                          <div>openai-processing-ms: {activeLatency}</div>
                          <div>x-ratelimit-remaining-requests: 4998</div>
                          <div>x-ratelimit-remaining-tokens: 58240</div>
                          <div>strict-transport-security: max-age=31536000</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Token Usage & Cost Estimator Summary */}
                <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 text-[11px] flex items-center justify-between flex-wrap gap-2">
                  <div className="text-slate-400">
                    Est. Cost per Call: <span className="text-emerald-300 font-mono font-bold">₹0.0031</span> (gpt-4o-mini)
                  </div>
                  <div className="text-slate-400">
                    Latency: <span className="text-sky-300 font-mono font-bold">{activeLatency} ms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STATUS CODES & ERROR MATRIX */}
        {activeTab === 'status-codes' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-300 leading-relaxed">
              Standard HTTP status codes returned by AI model providers, common triggers, and exact production remediation:
            </div>
            <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/40">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-slate-400">
                    <th className="p-3 font-bold">Code</th>
                    <th className="p-3 font-bold">Status</th>
                    <th className="p-3 font-bold">Root Cause</th>
                    <th className="p-3 font-bold">Production Fix</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="p-3 font-mono font-bold text-emerald-400">200</td>
                    <td className="p-3 text-white font-semibold">OK (Success)</td>
                    <td className="p-3 text-slate-300">Prompt processed successfully by inference cluster.</td>
                    <td className="p-3 text-emerald-300">Parse choices[0].message.content or stream chunks.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-rose-400">400</td>
                    <td className="p-3 text-white font-semibold">Bad Request</td>
                    <td className="p-3 text-slate-300">Malformed JSON, missing required "messages" array, or unsupported parameter.</td>
                    <td className="p-3 text-slate-300">Validate payload against provider schema with Zod / Pydantic before dispatch.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-amber-400">401</td>
                    <td className="p-3 text-white font-semibold">Unauthorized</td>
                    <td className="p-3 text-slate-300">Missing Authorization header, revoked key, or whitespace in token string.</td>
                    <td className="p-3 text-amber-300">Check .env file, verify key format (sk-proj-...), and regenerate revoked keys.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-pink-400">429</td>
                    <td className="p-3 text-white font-semibold">Rate Limit / Quota Exceeded</td>
                    <td className="p-3 text-slate-300">Exceeded RPM/TPM limits OR prepaid account billing balance is $0.</td>
                    <td className="p-3 text-pink-300">Implement Exponential Backoff + Jitter retry loop, and add prepaid credits.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-purple-400">500</td>
                    <td className="p-3 text-white font-semibold">Internal Server Error</td>
                    <td className="p-3 text-slate-300">Transient GPU crash, CUDA out-of-memory, or cloud datacenter outage.</td>
                    <td className="p-3 text-purple-300">Retry 2-3 times with backoff; fallback to backup provider (e.g. Gemini/Claude).</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-rose-500">503</td>
                    <td className="p-3 text-white font-semibold">Service Unavailable</td>
                    <td className="p-3 text-slate-300">High traffic spike, foundation model experiencing cluster capacity overload.</td>
                    <td className="p-3 text-slate-300">Check provider status page, enable circuit breaker, and route to tiered model.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: REST API ARCHITECTURE */}
        {activeTab === 'architecture' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-300 leading-relaxed">
              Core architectural concepts for integrating LLM foundation models into real-world applications:
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="rounded-xl bg-black/40 border border-emerald-500/20 p-3.5 space-y-1.5">
                <div className="text-xs font-bold text-emerald-400">1. Bearer Token Authorization</div>
                <p className="text-xs text-slate-300 m-0 leading-relaxed">
                  Every request requires an HTTP header: <code className="text-emerald-300 font-mono">Authorization: Bearer sk-...</code>. The gateway validates your organization ID and deducts token costs from your prepaid wallet.
                </p>
              </div>

              <div className="rounded-xl bg-black/40 border border-sky-500/20 p-3.5 space-y-1.5">
                <div className="text-xs font-bold text-sky-400">2. Server-Sent Events (SSE) Streaming</div>
                <p className="text-xs text-slate-300 m-0 leading-relaxed">
                  Setting <code className="text-sky-300 font-mono">stream: true</code> keeps the HTTP connection open, pushing tokens as small SSE events (<code className="text-sky-300 font-mono">data: &#123;"delta": ...&#125;</code>) rather than blocking until the full paragraph finishes.
                </p>
              </div>

              <div className="rounded-xl bg-black/40 border border-purple-500/20 p-3.5 space-y-1.5">
                <div className="text-xs font-bold text-purple-400">3. JSON Mode &amp; Structured Outputs</div>
                <p className="text-xs text-slate-300 m-0 leading-relaxed">
                  Enforce structured responses by passing <code className="text-purple-300 font-mono">response_format: &#123; type: "json_object" &#125;</code> or strict JSON Schemas, ensuring 100% parseable output for database insertion.
                </p>
              </div>

              <div className="rounded-xl bg-black/40 border border-amber-500/20 p-3.5 space-y-1.5">
                <div className="text-xs font-bold text-amber-400">4. Function / Tool Calling Endpoints</div>
                <p className="text-xs text-slate-300 m-0 leading-relaxed">
                  Provide tool definitions (name, parameters schema) in your request. When needed, the LLM stops and returns an exact JSON payload of function arguments for your code to execute.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: 5 PRODUCTION API RULES */}
        {activeTab === 'rules' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-300 leading-relaxed">
              5 essential engineering rules for deploying AI APIs into production systems:
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="rounded-xl bg-black/40 border border-emerald-500/20 p-3.5 space-y-1.5">
                <div className="text-xs font-bold text-emerald-400">1. Zero Client-Side Secret Keys</div>
                <p className="text-xs text-slate-300 m-0 leading-relaxed">
                  Never put <code className="text-emerald-300 font-mono">process.env.OPENAI_API_KEY</code> into frontend React, Next.js client components, or mobile bundles. Always dispatch from your own authenticated backend server.
                </p>
              </div>

              <div className="rounded-xl bg-black/40 border border-sky-500/20 p-3.5 space-y-1.5">
                <div className="text-xs font-bold text-sky-400">2. Exponential Backoff with Jitter</div>
                <p className="text-xs text-slate-300 m-0 leading-relaxed">
                  When receiving HTTP 429 or 503, pause for <code className="text-sky-300 font-mono">2^attempt + rand(0, 1000)ms</code> before retrying. This prevents thundering herds from crashing recovering servers.
                </p>
              </div>

              <div className="rounded-xl bg-black/40 border border-purple-500/20 p-3.5 space-y-1.5">
                <div className="text-xs font-bold text-purple-400">3. Set Strict Timeout Budgets</div>
                <p className="text-xs text-slate-300 m-0 leading-relaxed">
                  Never let API requests hang indefinitely. Configure a 10s to 15s timeout budget with <code className="text-purple-300 font-mono">AbortController</code> in JS or <code className="text-purple-300 font-mono">timeout=15</code> in Python.
                </p>
              </div>

              <div className="rounded-xl bg-black/40 border border-amber-500/20 p-3.5 space-y-1.5">
                <div className="text-xs font-bold text-amber-400">4. Cache Common AI Generations</div>
                <p className="text-xs text-slate-300 m-0 leading-relaxed">
                  Hash identical prompts with SHA-256 and cache LLM responses in Redis with a 24-hour TTL. You save money, bypass rate limits, and provide instant sub-10ms answers.
                </p>
              </div>

              <div className="rounded-xl bg-black/40 border border-rose-500/20 p-3.5 space-y-1.5 sm:col-span-2">
                <div className="text-xs font-bold text-rose-400">5. Multi-Provider Fallback Routing</div>
                <p className="text-xs text-slate-300 m-0 leading-relaxed">
                  Design your gateway to automatically fall back from primary models (e.g. OpenAI GPT-4o-mini) to secondary alternatives (e.g. Google Gemini 2.0 Flash or Claude 3.5 Haiku) if the primary provider reports an outage.
                </p>
              </div>
            </div>
          </div>
        )}

        <p className="text-[11px] text-slate-500 m-0 mt-3">
          💡 <strong>Key Takeaway:</strong> AI APIs use standard REST conventions. Treat models as remote microservices that accept JSON, return token streams, and require robust error handling and backend secret isolation.
        </p>
      </section>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <figure className="m-0 rounded-xl border border-white/10 overflow-hidden">
          <img src="/assets/learning/ai/ai-lesson14-flow.jpg" alt="API call flow from app to server and back" loading="lazy" />
        </figure>
        <figure className="m-0 rounded-xl border border-white/10 overflow-hidden">
          <img src="/assets/learning/ai/ai-lesson14-shipped.jpg" alt="Developer with working chatbot on laptop and phone" loading="lazy" />
        </figure>
      </div>
      {/* EXPLANATION / DEEP DIVE */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-white mt-0 mb-3">The 4 Pillars of Building Software with AI APIs</h2>
        <ol className="text-sm text-slate-300 leading-relaxed space-y-2.5 list-decimal pl-5 m-0">
          <li>
            <strong className="text-white">REST Endpoints &amp; JSON Payloads:</strong> Every interaction is an HTTP POST request carrying headers (Authorization, Content-Type) and a JSON body specifying the target model, conversation messages, temperature, and token constraints.
          </li>
          <li>
            <strong className="text-white">Authentication &amp; Secret Isolation:</strong> API keys provide full programmatic billing access. Storing them strictly in backend environment variables protects against catastrophic quota theft and unauthorized scraping.
          </li>
          <li>
            <strong className="text-white">Real-Time Streaming (SSE) vs Blocking:</strong> Using Server-Sent Events reduces time-to-first-token to under 300ms, streaming text chunks dynamically to deliver fluid user-facing chat and autocomplete interfaces.
          </li>
          <li>
            <strong className="text-white">Resilience &amp; Error Handling:</strong> Production AI integrations anticipate 429 rate limits, 500 server crashes, and network timeouts by implementing exponential backoff retries, fallback provider routing, and response schema enforcement.
          </li>
        </ol>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5 text-center">
          {[
            ['HTTP Verbs', 'POST & GET', 'Stateless JSON payloads'],
            ['Bearer Auth', 'sk-proj-...', 'Stored in server .env'],
            ['SSE Streaming', '< 300ms TTFT', 'Token chunk delivery'],
            ['Resilience', 'Backoff & Jitter', 'Automated 429 retries'],
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
        <h2 className="text-lg font-bold text-white mt-0 mb-3">Code: Production AI REST API Integration in Python &amp; JavaScript</h2>
        <p className="text-xs text-slate-400 mt-0 mb-4">
          Complete production-ready scripts featuring native HTTP calls, official SDK usage, exponential backoff retries, streaming, and error handling:
        </p>
        <div className="space-y-3">
          <CodeBlock lang="Python (Requests + OpenAI SDK with Exponential Backoff & Streaming)" code={PY_CODE} />
          <CodeBlock lang="JavaScript (Node.js / Express AI API Gateway & SSE Stream Route)" code={JS_CODE} />
        </div>
      </section>

      {/* PRACTICE QUESTIONS */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-white mt-0 mb-1">Practice questions</h2>
        <p className="text-xs text-slate-400 mt-0 mb-4">
          Test your understanding of AI REST endpoints, Bearer authentication, HTTP status codes, and streaming.
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

      {/* ENTERPRISE PRODUCTION API TIPS */}
      <section
        className="rounded-2xl border border-emerald-500/20 p-5 sm:p-6 mb-6"
        style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(17,24,39,0.4))' }}
      >
        <h2 className="text-lg font-bold text-white mt-0 mb-3">🛠️ Production AI API Checklist</h2>
        <ul className="text-sm text-slate-300 leading-relaxed space-y-2 list-disc pl-5 m-0">
          <li>
            <strong className="text-white">Store Keys Exclusively in Environment Variables:</strong> Use `.env` with `.gitignore` and never expose tokens in client-side code or mobile apps.
          </li>
          <li>
            <strong className="text-white">Enforce Strict Spend &amp; Rate Limits:</strong> Set monthly hard budget caps in your AI provider dashboard to avoid surprise runaway bills.
          </li>
          <li>
            <strong className="text-white">Implement Automated Backoff &amp; Jitter:</strong> Wrap all external API requests in retry middleware to smoothly handle temporary 429 and 500 spikes.
          </li>
          <li>
            <strong className="text-white">Adopt Server-Sent Events for User Interfaces:</strong> Stream output token by token to provide instant human responsiveness.
          </li>
          <li>
            <strong className="text-white">Enforce Structured Outputs for Backend Logic:</strong> Use JSON mode or typed function schemas to prevent hallucinated format errors in data pipelines.
          </li>
        </ul>
      </section>

      {/* FAQ ACCORDION COMPONENT */}
      <FAQ questions={FAQS} />

      {/* PREV / NEXT NAVIGATION */}
      <div className="flex items-center justify-between flex-wrap gap-3 mt-6">
        <Link to="/learning/ai/privacy-and-safety" className="text-sm font-semibold text-emerald-300 no-underline hover:text-white transition-colors">
          ← Lesson 13: Privacy and Safety with AI
        </Link>
        <Link to="/learning/ai" className="text-sm font-semibold text-emerald-300 no-underline hover:text-white transition-colors">
          All AI Lessons (Hub) →
        </Link>
      </div>
    </>
  )
}
