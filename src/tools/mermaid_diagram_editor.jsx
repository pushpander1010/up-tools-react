import { useState, useEffect, useRef, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const examples = {
  flowchart: `graph TD
    A[Start] -->|Step 1| B[Process Data]
    B --> C{Decision}
    C -->|Yes| D[Action A]
    C -->|No| E[Action B]
    D --> F[End]
    E --> F
    style A fill:#6366f1,stroke:#4f46e5,color:#fff
    style F fill:#10b981,stroke:#059669,color:#fff
    style C fill:#f59e0b,stroke:#d97706,color:#fff`,

  sequence: `sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Database

    User->>Frontend: Click Submit
    Frontend->>API: POST /api/data
    API->>Database: INSERT record
    Database-->>API: Success
    API-->>Frontend: 201 Created
    Frontend-->>User: Show success message`,

  class: `classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
    }
    class Dog {
        +fetch()
        +bark()
    }
    class Cat {
        +purr()
        +climb()
    }
    class Owner {
        +String name
        +addPet()
    }
    Animal <|-- Dog
    Animal <|-- Cat
    Owner "1" --> "*" Animal : has`,

  gantt: `gantt
    title Project Timeline
    dateFormat YYYY-MM-DD
    section Planning
    Requirements      :a1, 2026-01-01, 14d
    Design            :a2, after a1, 10d
    section Development
    Backend API       :b1, after a2, 20d
    Frontend UI       :b2, after a2, 25d
    section Testing
    Unit Tests        :c1, after b1, 7d
    Integration Tests :c2, after c1, 5d
    section Deployment
    Staging           :d1, after c2, 3d
    Production        :d2, after d1, 1d`,

  pie: `pie title Technology Usage
    "JavaScript" : 35
    "Python" : 25
    "TypeScript" : 20
    "Go" : 10
    "Rust" : 5
    "Other" : 5`,

  state: `stateDiagram-v2
    [*] --> Idle
    Idle --> Loading : fetch
    Loading --> Success : 200
    Loading --> Error : 4xx/5xx
    Success --> Idle : done
    Error --> Loading : retry
    Error --> Idle : dismiss`,

  er: `erDiagram
    USER {
        int id PK
        string name
        string email
    }
    POST {
        int id PK
        string title
        text body
        int author_id FK
    }
    COMMENT {
        int id PK
        text body
        int post_id FK
        int user_id FK
    }
    USER ||--o{ POST : writes
    POST ||--o{ COMMENT : has
    USER ||--o{ COMMENT : makes`,
}

export default function mermaid_diagram_editor() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const containerRef = useRef(null)
  const [code, setCode] = useState(examples.flowchart)
  const [error, setError] = useState('')
  const [svgContent, setSvgContent] = useState('')
  const [activeExample, setActiveExample] = useState('flowchart')
  const [copied, setCopied] = useState(false)
  const [zoom, setZoom] = useState(1)
  const mermaidId = useRef(0)

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-white text-sm font-mono outline-none focus:border-cyan-500/40 transition-all placeholder:text-slate-500 resize-none"

  const renderDiagram = useCallback(async () => {
    if (!code.trim()) {
      setSvgContent('')
      setError('')
      return
    }
    try {
      // Dynamic import mermaid from CDN
      const mermaid = await new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js'
        script.onload = () => resolve(window.mermaid)
        script.onerror = reject
        document.head.appendChild(script)
      })
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        themeVariables: {
          primaryColor: '#6366f1',
          primaryTextColor: '#e2e8f0',
          lineColor: '#64748b',
          fontSize: '14px',
          background: 'transparent',
          primaryBorderColor: '#6366f1',
        },
        securityLevel: 'loose',
        fontFamily: 'Inter, system-ui, sans-serif',
      })

      mermaidId.current += 1
      const id = `mermaid-${mermaidId.current}`
      const { svg } = await mermaid.render(id, code)
      setSvgContent(svg)
      setError('')
    } catch (e) {
      setError(e.message?.split('\n')[0] || 'Rendering error')
      setSvgContent('')
    }
  }, [code])

  useEffect(() => {
    const timer = setTimeout(renderDiagram, 400)
    return () => clearTimeout(timer)
  }, [renderDiagram])

  const loadExample = (key) => {
    setCode(examples[key])
    setActiveExample(key)
    setZoom(1)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadSVG = () => {
    if (!svgContent) return
    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = `diagram-${activeExample}-${Date.now()}.svg`
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
  }

  const downloadPNG = () => {
    if (!svgContent) return
    const canvas = document.createElement('canvas')
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)
    const img = new Image()
    img.onload = () => {
      canvas.width = img.width * 2
      canvas.height = img.height * 2
      const ctx = canvas.getContext('2d')
      ctx.scale(2, 2)
      ctx.drawImage(img, 0, 0)
      canvas.toBlob(blob => {
        const pngUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.download = `diagram-${activeExample}-${Date.now()}.png`
        link.href = pngUrl
        link.click()
        URL.revokeObjectURL(pngUrl)
      })
      URL.revokeObjectURL(url)
    }
    img.src = url
  }

  return (
    <ToolLayout
      title="Mermaid Diagram Editor"
      desc="Create flowcharts, sequence diagrams, class diagrams, and more using Mermaid.js syntax with live preview."
      icon="📊" iconBg="rgba(6,182,212,0.08)"
      category="dev" slug="mermaid-diagram-editor"
      faq={[
        { q: "What is Mermaid.js?", a: "Mermaid is a JavaScript library that renders Markdown-like text into diagrams (flowcharts, sequence diagrams, Gantt charts, etc.) in the browser." },
        { q: "What diagram types are supported?", a: "Flowcharts, sequence diagrams, class diagrams, state diagrams, ER diagrams, pie charts, Gantt charts, and more." },
        { q: "Can I export my diagrams?", a: "Yes! Export as SVG for vector quality or PNG for raster image. Both are high-resolution." },
      ]}
      howItWorks={[
        "Choose a diagram type from the example buttons or write your own.",
        "Edit the Mermaid syntax in the textarea.",
        "See your diagram render in real-time in the preview pane.",
        "Download as SVG or PNG when you're satisfied.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Mermaid Diagram Editor", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/mermaid-diagram-editor/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Example buttons */}
        <div className="flex flex-wrap gap-2">
          {Object.keys(examples).map(key => (
            <button key={key} onClick={() => loadExample(key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${activeExample === key ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' : 'bg-white/[0.06] text-slate-500 border border-white/8 hover:bg-cyan-500/10 hover:text-cyan-300'}`}>
              {key}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left: Code Editor */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-500">Mermaid Syntax</label>
              <button onClick={copyCode}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/8 text-slate-400 hover:text-white'}`}>
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
            </div>
            <textarea value={code} onChange={e => setCode(e.target.value)}
              className={`${inputClass} h-[420px]`}
              spellCheck={false} />
          </div>

          {/* Right: Preview */}
          <div className="space-y-3" ref={resultRef}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-slate-500">Preview</label>
                {error && <span className="text-xs text-red-400 font-mono truncate max-w-[200px]">⚠ {error}</span>}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white/[0.06] rounded-lg border border-white/8 px-2 py-1">
                  <button onClick={() => setZoom(z => Math.max(0.25, z - 0.25))}
                    className="text-xs text-slate-400 hover:text-white w-5 text-center transition-all">−</button>
                  <span className="text-[10px] text-slate-500 font-mono w-8 text-center">{Math.round(zoom * 100)}%</span>
                  <button onClick={() => setZoom(z => Math.min(3, z + 0.25))}
                    className="text-xs text-slate-400 hover:text-white w-5 text-center transition-all">+</button>
                </div>
                <button onClick={downloadSVG}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/5 border border-white/8 text-slate-400 hover:text-white transition-all">
                  SVG
                </button>
                <button onClick={downloadPNG}
                  className="glow-btn px-4 py-1.5 rounded-lg text-xs font-bold">
                  PNG ⬇
                </button>
              </div>
            </div>
            <div className="bg-slate-950/50 rounded-2xl border border-white/[0.08] min-h-[420px] flex items-center justify-center overflow-auto p-4"
              ref={containerRef}>
              {svgContent ? (
                <div style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.2s' }}
                  dangerouslySetInnerHTML={{ __html: svgContent }} />
              ) : error ? (
                <div className="text-center text-red-400 space-y-2">
                  <div className="text-3xl">⚠️</div>
                  <p className="text-sm font-semibold">Diagram Error</p>
                  <p className="text-xs text-slate-500 max-w-xs">{error}</p>
                </div>
              ) : (
                <div className="text-center text-slate-600 space-y-2">
                  <div className="text-4xl">📊</div>
                  <p className="text-sm">Write Mermaid syntax to see your diagram</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
