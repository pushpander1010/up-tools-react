import { useState, useRef, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'

// Predefined meme templates (drawn on canvas)
const TEMPLATES = [
  {
    name: 'Classic',
    bg: '#ffffff',
    fg: '#000000',
    layout: 'top-bottom', // top text + bottom text
    drawBg: (ctx, W, H) => {
      // Simple white background with black border
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, W, H)
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 3
      ctx.strokeRect(3, 3, W - 6, H - 6)
      // Placeholder image area
      ctx.fillStyle = '#e5e7eb'
      ctx.fillRect(W * 0.15, H * 0.15, W * 0.7, H * 0.5)
      ctx.fillStyle = '#9ca3af'
      ctx.font = `${Math.max(12, W * 0.03)}px sans-serif`
      ctx.textAlign = 'center'
      ctx.fillText('Your Image Here', W / 2, H * 0.45)
    }
  },
  {
    name: 'Distracted BF',
    bg: '#1a1a2e',
    fg: '#ffffff',
    layout: 'top-bottom',
    drawBg: (ctx, W, H) => {
      ctx.fillStyle = '#1a1a2e'
      ctx.fillRect(0, 0, W, H)
      // Gradient accent
      const grad = ctx.createLinearGradient(0, 0, W, H)
      grad.addColorStop(0, '#e94560')
      grad.addColorStop(1, '#0f3460')
      ctx.fillStyle = grad
      ctx.fillRect(W * 0.05, H * 0.15, W * 0.9, H * 0.55)
      ctx.fillStyle = '#ffffff88'
      ctx.font = `${Math.max(12, W * 0.03)}px sans-serif`
      ctx.textAlign = 'center'
      ctx.fillText('Add your own image!', W / 2, H * 0.48)
    }
  },
  {
    name: 'Drake Hotline',
    bg: '#f5f0e8',
    fg: '#000000',
    layout: 'split', // left image, right text
    drawBg: (ctx, W, H) => {
      ctx.fillStyle = '#f5f0e8'
      ctx.fillRect(0, 0, W, H)
      // Two panel layout
      ctx.strokeStyle = '#d4c5a9'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(W * 0.5, 0)
      ctx.lineTo(W * 0.5, H)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, H * 0.5)
      ctx.lineTo(W * 0.5, H * 0.5)
      ctx.stroke()
      // Panel backgrounds
      ctx.fillStyle = '#e8dcc8'
      ctx.fillRect(W * 0.05, H * 0.05, W * 0.4, H * 0.4)
      ctx.fillRect(W * 0.05, H * 0.55, W * 0.4, H * 0.4)
      ctx.fillStyle = '#9ca3af'
      ctx.font = `${Math.max(10, W * 0.02)}px sans-serif`
      ctx.textAlign = 'center'
      ctx.fillText('Image', W * 0.25, H * 0.28)
      ctx.fillText('Image', W * 0.25, H * 0.78)
    }
  },
  {
    name: 'Blank Slate',
    bg: '#000000',
    fg: '#ffffff',
    layout: 'center',
    drawBg: (ctx, W, H) => {
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, W, H)
    }
  },
  {
    name: 'Gradient',
    bg: '#667eea',
    fg: '#ffffff',
    layout: 'center',
    drawBg: (ctx, W, H) => {
      const grad = ctx.createLinearGradient(0, 0, W, H)
      grad.addColorStop(0, '#667eea')
      grad.addColorStop(1, '#764ba2')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)
    }
  },
]

function wrapText(ctx, text, maxWidth, fontSize) {
  const words = text.split(' ')
  const lines = []
  let currentLine = ''

  for (const word of words) {
    const testLine = currentLine ? currentLine + ' ' + word : word
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
  }
  if (currentLine) lines.push(currentLine)
  return lines
}

function drawMeme(canvas, template, topText, bottomText, topColor, bottomColor) {
  const ctx = canvas.getContext('2d')
  const W = canvas.width
  const H = canvas.height

  // Draw template background
  template.drawBg(ctx, W, H)

  const fontSize = Math.max(18, Math.floor(W * 0.045))
  ctx.font = `bold ${fontSize}px Impact, Arial Black, sans-serif`
  ctx.textAlign = 'center'
  ctx.lineWidth = 3
  ctx.strokeStyle = '#000000'
  ctx.fillStyle = '#ffffff'

  // Top text
  if (topText) {
    const lines = wrapText(ctx, topText, W * 0.9, fontSize)
    const lineHeight = fontSize * 1.2
    const startY = Math.max(fontSize + 10, H * 0.05)
    lines.forEach((line, i) => {
      const y = startY + i * lineHeight
      ctx.strokeText(line, W / 2, y)
      ctx.fillStyle = topColor || '#ffffff'
      ctx.fillText(line, W / 2, y)
    })
  }

  // Bottom text
  if (bottomText) {
    const lines = wrapText(ctx, bottomText, W * 0.9, fontSize)
    const lineHeight = fontSize * 1.2
    const totalHeight = lines.length * lineHeight
    const startY = H - Math.max(fontSize + 10, H * 0.05) - (lines.length - 1) * lineHeight
    lines.forEach((line, i) => {
      const y = startY + i * lineHeight
      ctx.strokeText(line, W / 2, y)
      ctx.fillStyle = bottomColor || '#ffffff'
      ctx.fillText(line, W / 2, y)
    })
  }
}

export default function MemeGenerator() {
  const canvasRef = useRef(null)
  const [templateIdx, setTemplateIdx] = useState(0)
  const [topText, setTopText] = useState('WHEN THE CODE WORKS')
  const [bottomText, setBottomText] = useState('ON THE FIRST TRY')
  const [topColor, setTopColor] = useState('#ffffff')
  const [bottomColor, setBottomColor] = useState('#ffffff')
  const [canvasSize, setCanvasSize] = useState({ w: 500, h: 500 })

  const template = TEMPLATES[templateIdx]

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = canvasSize.w
    canvas.height = canvasSize.h
    drawMeme(canvas, template, topText, bottomText, topColor, bottomColor)
  }, [template, topText, bottomText, topColor, bottomColor, canvasSize])

  // Re-render on any change
  useState(() => { render() })

  const handleDownload = () => {
    render()
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `meme-${template.name.toLowerCase().replace(/\s+/g, '-')}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const handleSizeChange = (w, h) => {
    setCanvasSize({ w, h })
    setTimeout(render, 50)
  }

  return (
    <ToolLayout
      title="Meme Generator"
      desc="Create memes with customizable text overlay on classic templates. Download as PNG."
      icon="😂" iconBg="rgba(99,102,241,0.08)"
      category="fun" slug="meme-generator"
      faq={[
        { q: 'Can I use my own images?', a: 'Currently you can use the built-in templates. You can swap out the template background colors and add your text.' },
        { q: 'How do I download the meme?', a: 'Click the Download PNG button to save the meme to your device.' },
      ]}
      howItWorks={[
        'Choose a meme template.',
        'Type your top and bottom text.',
        'Adjust text colors if desired.',
        'Download the finished meme as PNG.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Meme Generator", "applicationCategory": "FunApplication",
        "url": "https://www.uptools.in/meme-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Template selector */}
        <div className="flex flex-wrap gap-2">
          {TEMPLATES.map((t, i) => (
            <button key={i} onClick={() => { setTemplateIdx(i); setTimeout(render, 50) }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${templateIdx === i ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-white/[0.06] text-slate-400 border border-white/[0.08] hover:text-white'}`}>
              {t.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Canvas preview */}
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
            <label className="block text-sm font-semibold text-slate-300 mb-3">Preview</label>
            <div className="flex justify-center">
              <canvas ref={canvasRef} className="max-w-full rounded-lg shadow-lg" />
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Top Text</label>
              <input type="text" value={topText} onChange={e => { setTopText(e.target.value); setTimeout(render, 10) }}
                className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50" />
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-slate-500">Color:</span>
                <input type="color" value={topColor} onChange={e => { setTopColor(e.target.value); setTimeout(render, 10) }}
                  className="w-6 h-6 rounded cursor-pointer border-0" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Bottom Text</label>
              <input type="text" value={bottomText} onChange={e => { setBottomText(e.target.value); setTimeout(render, 10) }}
                className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50" />
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-slate-500">Color:</span>
                <input type="color" value={bottomColor} onChange={e => { setBottomColor(e.target.value); setTimeout(render, 10) }}
                  className="w-6 h-6 rounded cursor-pointer border-0" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Size</label>
              <div className="flex gap-2">
                {[{ w: 400, h: 400, l: '400²' }, { w: 500, h: 500, l: '500²' }, { w: 600, h: 600, l: '600²' }, { w: 500, h: 350, l: 'Wide' }].map(s => (
                  <button key={s.l} onClick={() => handleSizeChange(s.w, s.h)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${canvasSize.w === s.w && canvasSize.h === s.h ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-500 hover:text-white'}`}>
                    {s.l}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => { render(); handleDownload() }}
              className="glow-btn text-sm px-6 py-2.5 rounded-xl font-semibold w-full mt-2">
              ⬇ Download PNG
            </button>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
