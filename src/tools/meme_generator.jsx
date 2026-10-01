import { useState, useRef, useCallback, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'

/* roundRect polyfill for canvas context */
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (typeof r === 'number') r = { tl: r, tr: r, br: r, bl: r }
    else r = Object.assign({ tl: 0, tr: 0, br: 0, bl: 0 }, r)
    this.moveTo(x + r.tl, y)
    this.lineTo(x + w - r.tr, y)
    this.quadraticCurveTo(x + w, y, x + w, y + r.tr)
    this.lineTo(x + w, y + h - r.br)
    this.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h)
    this.lineTo(x + r.bl, y + h)
    this.quadraticCurveTo(x, y + h, x, y + h - r.bl)
    this.lineTo(x, y + r.tl)
    this.quadraticCurveTo(x, y, x + r.tl, y)
    this.closePath()
    return this
  }
}

/* Vector template drawing helpers */
function drawStickPerson(c, x, y, sz, col, armDir) {
  c.fillStyle = col
  c.strokeStyle = col
  c.lineWidth = 3
  c.beginPath()
  c.arc(x, y - sz * 0.6, sz * 0.25, 0, Math.PI * 2)
  c.fill()
  c.beginPath()
  c.moveTo(x, y - sz * 0.35)
  c.lineTo(x, y + sz * 0.2)
  c.stroke()
  if (armDir) {
    c.beginPath()
    c.moveTo(x, y - sz * 0.2)
    c.lineTo(x - sz * 0.4, y - sz)
    c.stroke()
    c.beginPath()
    c.moveTo(x, y - sz * 0.2)
    c.lineTo(x + sz * 0.3, y)
    c.stroke()
  } else {
    c.beginPath()
    c.moveTo(x, y - sz * 0.2)
    c.lineTo(x - sz * 0.3, y)
    c.stroke()
    c.beginPath()
    c.moveTo(x, y - sz * 0.2)
    c.lineTo(x + sz * 0.4, y + sz * 0.1)
    c.stroke()
  }
  c.beginPath()
  c.moveTo(x, y + sz * 0.2)
  c.lineTo(x - sz * 0.25, y + sz * 0.6)
  c.stroke()
  c.beginPath()
  c.moveTo(x, y + sz * 0.2)
  c.lineTo(x + sz * 0.25, y + sz * 0.6)
  c.stroke()
}

function drawRejectArrow(c, x, y, col) {
  c.strokeStyle = col
  c.lineWidth = 4
  c.beginPath()
  c.moveTo(x - 30, y)
  c.lineTo(x + 30, y)
  c.stroke()
  c.beginPath()
  c.moveTo(x - 20, y - 15)
  c.lineTo(x - 30, y)
  c.lineTo(x - 20, y + 15)
  c.stroke()
}

function drawApproveArrow(c, x, y, col) {
  c.strokeStyle = col
  c.lineWidth = 4
  c.beginPath()
  c.moveTo(x - 30, y)
  c.lineTo(x + 30, y)
  c.stroke()
  c.beginPath()
  c.moveTo(x + 20, y - 15)
  c.lineTo(x + 30, y)
  c.lineTo(x + 20, y + 15)
  c.stroke()
}

function drawGirlFigure(c, x, y, sz, col) {
  c.fillStyle = col
  c.strokeStyle = col
  c.lineWidth = 2
  c.beginPath()
  c.arc(x, y - sz * 0.5, sz * 0.2, 0, Math.PI * 2)
  c.fill()
  c.beginPath()
  c.arc(x, y - sz * 0.55, sz * 0.22, 0, Math.PI)
  c.stroke()
  c.beginPath()
  c.moveTo(x, y - sz * 0.3)
  c.lineTo(x - sz * 0.25, y + sz * 0.3)
  c.lineTo(x + sz * 0.25, y + sz * 0.3)
  c.closePath()
  c.fill()
  c.beginPath()
  c.moveTo(x - sz * 0.1, y + sz * 0.3)
  c.lineTo(x - sz * 0.15, y + sz * 0.6)
  c.stroke()
  c.beginPath()
  c.moveTo(x + sz * 0.1, y + sz * 0.3)
  c.lineTo(x + sz * 0.15, y + sz * 0.6)
  c.stroke()
}

function drawBoyFigure(c, x, y, sz, col, lookX) {
  c.fillStyle = col
  c.strokeStyle = col
  c.lineWidth = 2
  c.beginPath()
  c.arc(x, y - sz * 0.5, sz * 0.2, 0, Math.PI * 2)
  c.fill()
  c.fillRect(x - sz * 0.15, y - sz * 0.3, sz * 0.3, sz * 0.5)
  c.beginPath()
  c.moveTo(x - sz * 0.15, y - sz * 0.15)
  c.lineTo(x - sz * 0.4, y + sz * 0.1)
  c.stroke()
  c.beginPath()
  c.moveTo(x + sz * 0.15, y - sz * 0.15)
  c.lineTo(x + sz * 0.4, y + sz * 0.1)
  c.stroke()
  c.fillStyle = '#fff'
  const eyeOff = lookX > x ? 2 : -2
  c.fillRect(x - 6 + eyeOff, y - sz * 0.52, 4, 4)
  c.fillRect(x + 3 + eyeOff, y - sz * 0.52, 4, 4)
}

function drawSweatingPerson(c, x, y, sz, col) {
  c.fillStyle = col
  c.strokeStyle = '#fff'
  c.lineWidth = 2
  c.beginPath()
  c.arc(x, y + sz * 0.1, sz * 0.3, 0, Math.PI * 2)
  c.fill()
  c.fillRect(x - sz * 0.2, y + sz * 0.35, sz * 0.4, sz * 0.5)
  c.fillStyle = '#60a5fa'
  ;[[x + sz * 0.35, y], [x - sz * 0.35, y + sz * 0.1], [x + sz * 0.1, y - sz * 0.1]].forEach(([dx, dy]) => {
    c.beginPath()
    c.ellipse(dx, dy, 3, 5, 0, 0, Math.PI * 2)
    c.fill()
  })
}

function drawButton(c, x, y, w, h, col, label) {
  c.fillStyle = col
  c.beginPath()
  c.roundRect(x - w / 2, y - h / 2, w, h, 8)
  c.fill()
  c.strokeStyle = '#fff'
  c.lineWidth = 2
  c.beginPath()
  c.roundRect(x - w / 2, y - h / 2, w, h, 8)
  c.stroke()
  c.fillStyle = '#fff'
  c.font = 'bold 14px Impact, sans-serif'
  c.textAlign = 'center'
  c.textBaseline = 'middle'
  c.fillText(label, x, y)
}

function drawSittingPerson(c, x, y, sz, col) {
  c.fillStyle = col
  c.strokeStyle = col
  c.lineWidth = 3
  c.beginPath()
  c.arc(x, y - sz * 0.7, sz * 0.22, 0, Math.PI * 2)
  c.fill()
  c.beginPath()
  c.moveTo(x, y - sz * 0.48)
  c.lineTo(x, y + sz * 0.1)
  c.stroke()
  c.beginPath()
  c.moveTo(x, y - sz * 0.3)
  c.lineTo(x - sz * 0.5, y)
  c.stroke()
  c.beginPath()
  c.moveTo(x, y - sz * 0.3)
  c.lineTo(x + sz * 0.5, y)
  c.stroke()
  c.beginPath()
  c.moveTo(x, y + sz * 0.1)
  c.lineTo(x - sz * 0.3, y + sz * 0.5)
  c.stroke()
  c.beginPath()
  c.moveTo(x, y + sz * 0.1)
  c.lineTo(x + sz * 0.3, y + sz * 0.5)
  c.stroke()
}

function drawBrainIcon(c, x, y, sz, col) {
  c.fillStyle = col
  c.globalAlpha = 0.7
  c.beginPath()
  c.moveTo(x, y + sz)
  c.bezierCurveTo(x - sz, y + sz * 0.5, x - sz, y - sz * 0.5, x, y - sz)
  c.bezierCurveTo(x + sz, y - sz * 0.5, x + sz, y + sz * 0.5, x, y + sz)
  c.fill()
  c.strokeStyle = col
  c.lineWidth = 2
  c.beginPath()
  c.moveTo(x, y - sz)
  c.lineTo(x, y + sz)
  c.stroke()
  for (let i = -2; i <= 2; i++) {
    c.beginPath()
    c.moveTo(x, y + i * sz * 0.3)
    c.bezierCurveTo(x + sz * 0.3, y + i * sz * 0.3 - 5, x + sz * 0.5, y + i * sz * 0.3 + 5, x + sz * 0.7, y + i * sz * 0.3)
    c.stroke()
  }
  c.globalAlpha = 1
}

function drawFist(c, x, y, sz, col) {
  c.fillStyle = col
  c.strokeStyle = '#78350f'
  c.lineWidth = 3
  c.beginPath()
  c.roundRect(x - sz / 2, y - sz / 2, sz, sz, 12)
  c.fill()
  c.stroke()
  for (let i = 0; i < 4; i++) {
    c.fillStyle = col
    c.beginPath()
    c.roundRect(x - sz / 2 + 5 + i * 13, y - sz / 2 - 12, 10, 15, 5)
    c.fill()
    c.stroke()
  }
  c.beginPath()
  c.roundRect(x + sz / 2 - 5, y - sz / 4, 12, 20, 5)
  c.fill()
  c.stroke()
}

function drawThinkingHead(c, x, y, sz, col) {
  c.fillStyle = col
  c.strokeStyle = '#fbbf24'
  c.lineWidth = 3
  c.beginPath()
  c.arc(x, y, sz, 0, Math.PI * 2)
  c.fill()
  c.stroke()
  c.fillStyle = '#fbbf24'
  c.beginPath()
  c.moveTo(x + sz * 0.7, y - sz * 0.5)
  c.lineTo(x + sz * 1.2, y - sz * 0.9)
  c.lineTo(x + sz * 1.3, y - sz * 0.6)
  c.lineTo(x + sz * 0.8, y - sz * 0.3)
  c.closePath()
  c.fill()
  c.strokeStyle = '#fff'
  c.lineWidth = 2
  c.beginPath()
  c.arc(x, y + sz * 0.1, sz * 0.4, 0.1 * Math.PI, 0.9 * Math.PI)
  c.stroke()
  c.fillStyle = '#fff'
  c.beginPath()
  c.arc(x - sz * 0.3, y - sz * 0.15, sz * 0.08, 0, Math.PI * 2)
  c.fill()
  c.beginPath()
  c.arc(x + sz * 0.3, y - sz * 0.15, sz * 0.08, 0, Math.PI * 2)
  c.fill()
}

const TEMPLATES = [
  {
    id: 'drake',
    name: 'Drake Hotline',
    w: 600,
    h: 600,
    draw(c, w, h) {
      c.fillStyle = '#1e293b'
      c.fillRect(0, 0, w, h)
      c.fillStyle = '#0f172a'
      c.fillRect(20, 20, w - 40, h / 2 - 30)
      c.strokeStyle = '#e11d48'
      c.lineWidth = 2
      c.strokeRect(20, 20, w - 40, h / 2 - 30)
      drawStickPerson(c, w * 0.3, h / 4, 25, '#e11d48', true)
      drawRejectArrow(c, w * 0.7, h / 4, '#e11d48')
      c.fillStyle = '#312e81'
      c.fillRect(20, h / 2 + 10, w - 40, h / 2 - 30)
      c.strokeStyle = '#10b981'
      c.strokeRect(20, h / 2 + 10, w - 40, h / 2 - 30)
      drawStickPerson(c, w * 0.3, h * 3 / 4, 25, '#10b981', false)
      drawApproveArrow(c, w * 0.7, h * 3 / 4, '#10b981')
    },
    defaultTop: 'Writing tests first',
    defaultBottom: 'Writing tests after',
  },
  {
    id: 'distracted',
    name: 'Distracted BF',
    w: 600,
    h: 400,
    draw(c, w, h) {
      c.fillStyle = '#0f172a'
      c.fillRect(0, 0, w, h)
      c.fillStyle = '#1e293b'
      c.fillRect(0, h * 0.6, w, h * 0.4)
      c.fillStyle = '#334155'
      c.fillRect(0, h * 0.7, w, h * 0.08)
      for (let i = 0; i < w; i += 60) {
        c.fillStyle = '#fbbf24'
        c.fillRect(i, h * 0.735, 30, 6)
      }
      drawGirlFigure(c, w * 0.2, h * 0.4, 40, '#ec4899')
      drawBoyFigure(c, w * 0.48, h * 0.38, 42, '#6366f1', w * 0.2)
      drawGirlFigure(c, w * 0.78, h * 0.38, 38, '#f59e0b')
    },
    defaultTop: 'Me',
    defaultBottom: 'The bug I just fixed',
  },
  {
    id: 'twobuttons',
    name: 'Two Buttons',
    w: 600,
    h: 500,
    draw(c, w, h) {
      c.fillStyle = '#0f172a'
      c.fillRect(0, 0, w, h)
      drawSweatingPerson(c, w / 2, h * 0.15, 50, '#6366f1')
      drawButton(c, w * 0.25, h * 0.65, 90, 40, '#ef4444', 'A')
      drawButton(c, w * 0.75, h * 0.65, 90, 40, '#3b82f6', 'B')
    },
    defaultTop: 'Left button',
    defaultBottom: 'Right button',
  },
  {
    id: 'changemymind',
    name: 'Change My Mind',
    w: 600,
    h: 400,
    draw(c, w, h) {
      c.fillStyle = '#0f172a'
      c.fillRect(0, 0, w, h)
      c.fillStyle = '#92400e'
      c.fillRect(w * 0.15, h * 0.55, w * 0.7, 12)
      c.fillRect(w * 0.2, h * 0.56, 15, h * 0.35)
      c.fillRect(w * 0.78, h * 0.56, 15, h * 0.35)
      c.fillStyle = '#fef3c7'
      c.fillRect(w * 0.3, h * 0.2, w * 0.4, h * 0.35)
      c.strokeStyle = '#92400e'
      c.lineWidth = 3
      c.strokeRect(w * 0.3, h * 0.2, w * 0.4, h * 0.35)
      drawSittingPerson(c, w * 0.5, h * 0.75, 35, '#6366f1')
    },
    defaultTop: '',
    defaultBottom: 'Change my mind',
  },
  {
    id: 'expandingbrain',
    name: 'Expanding Brain',
    w: 600,
    h: 800,
    draw(c, w, h) {
      c.fillStyle = '#0f172a'
      c.fillRect(0, 0, w, h)
      ;[
        { y: 0, h: h / 4, col: '#334155', brain: '#94a3b8' },
        { y: h / 4, h: h / 4, col: '#1e3a5f', brain: '#60a5fa' },
        { y: h / 2, h: h / 4, col: '#4c1d95', brain: '#a78bfa' },
        { y: (3 * h) / 4, h: h / 4, col: '#7c2d12', brain: '#fbbf24' },
      ].forEach((p, i) => {
        c.fillStyle = p.col
        c.fillRect(0, p.y, w, p.h)
        c.strokeStyle = '#ffffff22'
        c.lineWidth = 1
        c.strokeRect(0, p.y, w, p.h)
        const sz = 12 + i * 10
        drawBrainIcon(c, w / 2 - 40, p.y + p.h / 2, sz, p.brain)
      })
    },
    defaultTop: 'Normal',
    defaultBottom: 'Galaxy brain',
  },
  {
    id: 'rollsafe',
    name: 'Roll Safe',
    w: 600,
    h: 400,
    draw(c, w, h) {
      c.fillStyle = '#0f172a'
      c.fillRect(0, 0, w, h)
      drawThinkingHead(c, w * 0.45, h * 0.4, 70, '#6366f1')
    },
    defaultTop: "Can't have bugs",
    defaultBottom: "If you don't write code",
  },
]

const COLOR_PRESETS = ['#ffffff', '#000000', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899']

const PHRASES = [
  ["When the tests pass", "But you didn't write any"],
  ["Nobody:", "Me: *writes code at 3 AM*"],
  ["That feeling when", "Your PR gets approved"],
  ["It's not a bug", "It's a feature"],
  ["One does not simply", "Write bug-free code"],
  ["This is fine", "*production is on fire*"],
  ["I don't always test", "But when I do, I do it in production"],
  ["Modern problems", "Require modern solutions"],
  ["They're the same picture", "Bugs and features"],
  ["Wait, that's illegal", "console.log everywhere"],
]

function drawMemeText(c, text, x, y, size, fill, stroke, strokeW, canvasW) {
  if (!text) return
  c.save()
  c.font = `bold ${size}px Impact, "Arial Black", sans-serif`
  c.textAlign = 'center'
  c.textBaseline = 'top'
  const maxW = canvasW * 0.92
  const words = text.split(' ')
  const lines = []
  let line = ''
  words.forEach((w) => {
    const test = line ? line + ' ' + w : w
    if (c.measureText(test).width > maxW && line) {
      lines.push(line)
      line = w
    } else {
      line = test
    }
  })
  if (line) lines.push(line)
  lines.forEach((l, i) => {
    const ly = y + i * (size * 1.15)
    if (strokeW > 0) {
      c.strokeStyle = stroke
      c.lineWidth = strokeW
      c.lineJoin = 'round'
      c.miterLimit = 2
      c.strokeText(l, x, ly)
    }
    c.fillStyle = fill
    c.fillText(l, x, ly)
  })
  c.restore()
}

export default function meme_generator() {
  const canvasRef = useRef(null)
  const customFileInputRef = useRef(null)
  const [selectedTemplate, setSelectedTemplate] = useState(0)
  const [customImage, setCustomImage] = useState(null)
  const [topText, setTopText] = useState(TEMPLATES[0].defaultTop)
  const [bottomText, setBottomText] = useState(TEMPLATES[0].defaultBottom)
  const [topSize, setTopSize] = useState(36)
  const [bottomSize, setBottomSize] = useState(36)
  const [topFill, setTopFill] = useState('#ffffff')
  const [bottomFill, setBottomFill] = useState('#ffffff')
  const [topStroke, setTopStroke] = useState('#000000')
  const [bottomStroke, setBottomStroke] = useState('#000000')
  const [topStrokeW, setTopStrokeW] = useState(4)
  const [bottomStrokeW, setBottomStrokeW] = useState(4)
  const [allCaps, setAllCaps] = useState(true)
  const [copied, setCopied] = useState(false)
  const [activeText, setActiveText] = useState('top')
  const [hintText, setHintText] = useState('💡 Click or tap canvas to position text.')
  const textPosRef = useRef({ top: { x: null, y: null }, bottom: { x: null, y: null } })
  const customUrlRef = useRef("")

  useEffect(() => {
    return () => {
      if (customUrlRef.current) URL.revokeObjectURL(customUrlRef.current)
    }
  }, [])

  const renderMeme = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (customImage) {
      ctx.drawImage(customImage, 0, 0, canvas.width, canvas.height)
    } else {
      const t = TEMPLATES[selectedTemplate]
      if (t) t.draw(ctx, canvas.width, canvas.height)
    }

    const tText = allCaps ? topText.toUpperCase() : topText
    const bText = allCaps ? bottomText.toUpperCase() : bottomText

    const tp = textPosRef.current
    if (tText) {
      const tx = tp.top.x ?? canvas.width / 2
      const ty = tp.top.y ?? Math.max(topSize + 8, canvas.height * 0.05)
      drawMemeText(ctx, tText, tx, ty, topSize, topFill, topStroke, topStrokeW, canvas.width)
    }
    if (bText) {
      const bx = tp.bottom.x ?? canvas.width / 2
      const by = tp.bottom.y ?? canvas.height - Math.max(bottomSize + 16, canvas.height * 0.16)
      drawMemeText(ctx, bText, bx, by, bottomSize, bottomFill, bottomStroke, bottomStrokeW, canvas.width)
    }
  }, [selectedTemplate, customImage, topText, bottomText, topSize, bottomSize, topFill, bottomFill, topStroke, bottomStroke, topStrokeW, bottomStrokeW, allCaps])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (customImage) {
      canvas.width = customImage.width
      canvas.height = customImage.height
    } else {
      const t = TEMPLATES[selectedTemplate]
      if (t) {
        canvas.width = t.w
        canvas.height = t.h
      }
    }
    renderMeme()
  }, [selectedTemplate, customImage, renderMeme])

  const handleCanvasClick = useCallback((e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const cx = (e.clientX - rect.left) * scaleX
    const cy = (e.clientY - rect.top) * scaleY
    const tp = textPosRef.current
    if (activeText === 'top') {
      tp.top.x = cx
      tp.top.y = cy
      setActiveText('bottom')
      setHintText('Now click to position BOTTOM text...')
    } else {
      tp.bottom.x = cx
      tp.bottom.y = cy
      setActiveText('top')
      setHintText('Now click to position TOP text...')
    }
    renderMeme()
  }, [activeText, renderMeme])

  const selectTemplate = useCallback((i) => {
    setCustomImage(null)
    const t = TEMPLATES[i]
    setSelectedTemplate(i)
    setTopText(t.defaultTop)
    setBottomText(t.defaultBottom)
    textPosRef.current = { top: { x: null, y: null }, bottom: { x: null, y: null } }
    setActiveText('top')
    setHintText('💡 Click or tap canvas to position text.')
  }, [])

  const handleCustomUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (customUrlRef.current) URL.revokeObjectURL(customUrlRef.current)
    const url = URL.createObjectURL(file)
    customUrlRef.current = url
    const img = new Image()
    img.onload = () => {
      setCustomImage(img)
      textPosRef.current = { top: { x: null, y: null }, bottom: { x: null, y: null } }
    }
    img.src = url
  }

  const randomize = useCallback(() => {
    const p = PHRASES[Math.floor(Math.random() * PHRASES.length)]
    setTopText(p[0] || "")
    setBottomText(p[1] || "")
    textPosRef.current = { top: { x: null, y: null }, bottom: { x: null, y: null } }
  }, [])

  const downloadMeme = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `meme-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    document.body.appendChild(link)
    link.click()
    link.remove()
  }, [])

  const copyToClipboard = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob(async (blob) => {
      if (blob) {
        try {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        } catch {
          /* clipboard copy error */
        }
      }
    }, 'image/png')
  }, [])

  const resetTextPos = useCallback((which) => {
    textPosRef.current[which] = { x: null, y: null }
    setActiveText(which)
    renderMeme()
  }, [renderMeme])

  return (
    <ToolLayout
      title="Meme Generator"
      desc="Meme Generator - choose a classic meme template, add your text, and download. 100% client-side, online free. Free online, no sign-up. Works on any device."
      icon="😂" iconBg="rgba(99,102,241,0.08)"
      category="fun" slug="meme-generator"
      faq={[
        { q: "How do I make a meme online free?", a: "Pick a template above, add your text, then download and share. Free, no sign-up." },
        { q: "Can I use it on mobile?", a: "Yes. Make memes in your phone browser and save directly to your device." },
        { q: "Is the meme generator free?", a: "Yes, completely free with no sign-up. Make unlimited memes on any device." },
        { q: "Do I need to sign up?", a: "No sign-up needed. Make unlimited memes free on any device." },
        { q: "Does it work on mobile?", a: "Yes. Make and save memes free in your phone browser, no app needed." },
        { q: "Can I share my meme?", a: "Yes. Download the image and share it on any app, free." },
      ]}
      howItWorks={[
        "Pick a meme template above.",
        "Add your top and bottom text.",
        "Download and share your meme.",
      ]}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Template selector */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">1) Choose Template or Upload Custom</h2>
            <button
              type="button"
              onClick={() => customFileInputRef.current?.click()}
              className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-slate-200 hover:text-white transition-colors"
            >
              📸 Upload Image
            </button>
            <input
              ref={customFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCustomUpload}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {TEMPLATES.map((tmpl, i) => {
              const isSelected = !customImage && i === selectedTemplate
              return (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => selectTemplate(i)}
                  className={`min-h-[64px] p-2 rounded-xl border text-center transition-all duration-200 ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-600/20 text-white ring-2 ring-indigo-500/50 shadow-md shadow-indigo-500/20 active:scale-95'
                      : 'border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 active:scale-95'
                  }`}
                >
                  <div className="text-xs font-bold truncate">
                    {isSelected && <span className="text-indigo-400 mr-1">✓</span>}
                    {tmpl.name}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{tmpl.w}×{tmpl.h}</div>
                </button>
              )
            })}
          </div>

          {customImage && (
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 font-semibold flex items-center justify-between">
              <span>✓ Custom image uploaded ({customImage.width}×{customImage.height} px)</span>
              <button
                type="button"
                onClick={() => selectTemplate(0)}
                className="text-xs underline text-indigo-400 hover:text-indigo-300"
              >
                Switch back to presets
              </button>
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Meme Canvas Preview</h2>
            <button
              type="button"
              onClick={randomize}
              className="min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-slate-200 hover:text-white transition-colors"
            >
              🎲 Random Phrase
            </button>
          </div>

          <div className="flex justify-center bg-black/40 rounded-xl overflow-hidden p-3 border border-white/[0.08]">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="max-w-full h-auto cursor-crosshair rounded-lg shadow-sm block"
            />
          </div>
          <p className="text-center text-xs text-slate-400 bg-white/[0.03] py-2 rounded-lg border border-white/[0.08]">{hintText}</p>
        </div>

        {/* Text Settings */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Captions &amp; Styling</span>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={allCaps}
                onChange={(e) => setAllCaps(e.target.checked)}
                className="w-4 h-4 accent-indigo-500 rounded"
              />
              ALL CAPS (Classic Meme)
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Text Card */}
            <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-200">⬆️ Top Caption</h3>
                <button
                  type="button"
                  onClick={() => resetTextPos('top')}
                  className="min-h-[38px] px-2.5 py-1 text-[11px] font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Reset Position
                </button>
              </div>

              <input
                className="w-full min-h-[44px] bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/50"
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
                placeholder="Top text..."
              />

              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Font Size</span>
                  <span className="font-bold text-indigo-400 font-mono">{topSize}px</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="72"
                  value={topSize}
                  onChange={(e) => setTopSize(+e.target.value)}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Text Color</label>
                <div className="flex flex-wrap gap-1.5">
                  {COLOR_PRESETS.map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setTopFill(col)}
                      className={`w-9 h-9 rounded-lg border-2 transition-transform ${
                        topFill === col ? 'ring-2 ring-indigo-500 scale-105 border-white' : 'border-white/20'
                      }`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Text Card */}
            <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-200">⬇️ Bottom Caption</h3>
                <button
                  type="button"
                  onClick={() => resetTextPos('bottom')}
                  className="min-h-[38px] px-2.5 py-1 text-[11px] font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Reset Position
                </button>
              </div>

              <input
                className="w-full min-h-[44px] bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/50"
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
                placeholder="Bottom text..."
              />

              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Font Size</span>
                  <span className="font-bold text-indigo-400 font-mono">{bottomSize}px</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="72"
                  value={bottomSize}
                  onChange={(e) => setBottomSize(+e.target.value)}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Text Color</label>
                <div className="flex flex-wrap gap-1.5">
                  {COLOR_PRESETS.map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setBottomFill(col)}
                      className={`w-9 h-9 rounded-lg border-2 transition-transform ${
                        bottomFill === col ? 'ring-2 ring-indigo-500 scale-105 border-white' : 'border-white/20'
                      }`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={downloadMeme}
              className="glow-btn min-h-[44px] flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2"
            >
              ⬇️ Download Meme (PNG)
            </button>
            <button
              type="button"
              onClick={copyToClipboard}
              className="min-h-[44px] px-5 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-slate-200 hover:text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              {copied ? '✓ Copied to Clipboard!' : '📋 Copy to Clipboard'}
            </button>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
