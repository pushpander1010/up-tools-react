import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const defaultKeyframes = [
  { pct: 0, transform: 'scale(1)', opacity: '1', bg: '#6366f1' },
  { pct: 50, transform: 'scale(1.2)', opacity: '0.7', bg: '#8b5cf6' },
  { pct: 100, transform: 'scale(1)', opacity: '1', bg: '#6366f1' },
]

const presets = [
  {
    name: 'Bounce',
    keyframes: [
      { pct: 0, transform: 'translateY(0)', opacity: '1', bg: '#6366f1' },
      { pct: 30, transform: 'translateY(-40px)', opacity: '1', bg: '#8b5cf6' },
      { pct: 50, transform: 'translateY(0)', opacity: '1', bg: '#6366f1' },
      { pct: 70, transform: 'translateY(-20px)', opacity: '1', bg: '#a78bfa' },
      { pct: 100, transform: 'translateY(0)', opacity: '1', bg: '#6366f1' },
    ],
    duration: '1s',
    timing: 'ease-in-out',
    iteration: 'infinite',
  },
  {
    name: 'Pulse',
    keyframes: [
      { pct: 0, transform: 'scale(1)', opacity: '1', bg: '#6366f1' },
      { pct: 50, transform: 'scale(1.15)', opacity: '0.7', bg: '#a78bfa' },
      { pct: 100, transform: 'scale(1)', opacity: '1', bg: '#6366f1' },
    ],
    duration: '2s',
    timing: 'ease-in-out',
    iteration: 'infinite',
  },
  {
    name: 'Spin',
    keyframes: [
      { pct: 0, transform: 'rotate(0deg)', opacity: '1', bg: '#6366f1' },
      { pct: 100, transform: 'rotate(360deg)', opacity: '1', bg: '#6366f1' },
    ],
    duration: '1.5s',
    timing: 'linear',
    iteration: 'infinite',
  },
  {
    name: 'Fade In Out',
    keyframes: [
      { pct: 0, transform: 'none', opacity: '0', bg: '#6366f1' },
      { pct: 50, transform: 'none', opacity: '1', bg: '#8b5cf6' },
      { pct: 100, transform: 'none', opacity: '0', bg: '#6366f1' },
    ],
    duration: '2s',
    timing: 'ease-in-out',
    iteration: 'infinite',
  },
  {
    name: 'Shake',
    keyframes: [
      { pct: 0, transform: 'translateX(0)', opacity: '1', bg: '#6366f1' },
      { pct: 25, transform: 'translateX(-8px)', opacity: '1', bg: '#ef4444' },
      { pct: 50, transform: 'translateX(8px)', opacity: '1', bg: '#ef4444' },
      { pct: 75, transform: 'translateX(-4px)', opacity: '1', bg: '#f97316' },
      { pct: 100, transform: 'translateX(0)', opacity: '1', bg: '#6366f1' },
    ],
    duration: '0.5s',
    timing: 'ease-in-out',
    iteration: '3',
  },
]

const timingOptions = ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'cubic-bezier(0.68,-0.55,0.27,1.55)']
const directionOptions = ['normal', 'reverse', 'alternate', 'alternate-reverse']
const fillOptions = ['none', 'forwards', 'backwards', 'both']

export default function css_animation_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [keyframes, setKeyframes] = useState(defaultKeyframes)
  const [duration, setDuration] = useState('1s')
  const [delay, setDelay] = useState('0s')
  const [iteration, setIteration] = useState('infinite')
  const [direction, setDirection] = useState('normal')
  const [timing, setTiming] = useState('ease-in-out')
  const [fillMode, setFillMode] = useState('both')
  const [animName, setAnimName] = useState('myAnimation')
  const [copied, setCopied] = useState(false)
  const [playing, setPlaying] = useState(true)

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-2.5 text-white text-sm font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-400"

  const addKeyframe = () => {
    setKeyframes(prev => {
      const lastPct = prev[prev.length - 1]?.pct || 100
      const newPct = Math.min(lastPct + 10, 100)
      return [...prev, { pct: newPct, transform: 'none', opacity: '1', bg: '#6366f1' }]
    })
  }

  const updateKeyframe = (idx, field, val) => {
    setKeyframes(prev => prev.map((k, i) => i === idx ? { ...k, [field]: val } : k))
  }

  const removeKeyframe = (idx) => {
    setKeyframes(prev => prev.filter((_, i) => i !== idx))
  }

  const loadPreset = (p) => {
    setKeyframes(p.keyframes)
    setDuration(p.duration)
    setTiming(p.timing)
    setIteration(p.iteration)
    setPlaying(true)
  }

  const togglePlay = () => {
    setPlaying(false)
    setTimeout(() => setPlaying(true), 50)
  }

  const generateCSS = useCallback(() => {
    const sorted = [...keyframes].sort((a, b) => a.pct - b.pct)
    let css = `@keyframes ${animName} {\n`
    sorted.forEach(k => {
      css += `  ${k.pct}% {\n`
      css += `    transform: ${k.transform};\n`
      css += `    opacity: ${k.opacity};\n`
      css += `    background-color: ${k.bg};\n`
      css += `  }\n`
    })
    css += `}\n\n`
    css += `.animated-element {\n`
    css += `  animation-name: ${animName};\n`
    css += `  animation-duration: ${duration};\n`
    css += `  animation-timing-function: ${timing};\n`
    css += `  animation-delay: ${delay};\n`
    css += `  animation-iteration-count: ${iteration};\n`
    css += `  animation-direction: ${direction};\n`
    css += `  animation-fill-mode: ${fillMode};\n`
    css += `}`
    return css
  }, [keyframes, duration, delay, iteration, direction, timing, fillMode, animName])

  const css = generateCSS()

  const copyCSS = () => {
    navigator.clipboard.writeText(css)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const buildPreviewStyle = () => {
    const sorted = [...keyframes].sort((a, b) => a.pct - b.pct)
    const steps = sorted.map(k => `${k.pct}% { transform: ${k.transform}; opacity: ${k.opacity}; background-color: ${k.bg}; }`).join(' ')
    const kfStr = `@keyframes preview-anim { ${steps} }`
    return { kfStr, sorted }
  }

  const { kfStr } = buildPreviewStyle()

  return (
    <ToolLayout
      title="CSS Animation Generator"
      desc="Build CSS @keyframes visually with live preview. Adjust timing, duration, direction, and export production-ready CSS."
      icon="✨" iconBg="rgba(139,92,246,0.08)"
      category="dev" slug="css-animation-generator"
      faq={[
        { q: "What are CSS @keyframes?", a: "@keyframes define animation sequences. You specify styles at different percentages (0% to 100%) and CSS smoothly transitions between them." },
        { q: "How do I use the generated code?", a: "Copy the CSS, add it to your stylesheet. Apply the '.animated-element' class (or rename it) to any HTML element you want to animate." },
        { q: "Are animations production-ready?", a: "The generated CSS is clean and modern. For best performance, use transform and opacity (as this tool does) to leverage GPU acceleration." },
      ]}
      howItWorks={[
        "Choose a preset or build custom keyframes by adding percentage steps.",
        "Adjust animation properties: duration, delay, iteration count, direction, and fill mode.",
        "Watch the live preview update in real-time.",
        "Copy the generated CSS and paste it into your project.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "CSS Animation Generator", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/css-animation-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Inject dynamic keyframes */}
        <style>{kfStr}</style>

        {/* Presets */}
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-2 block">Presets</label>
          <div className="flex flex-wrap gap-2">
            {presets.map(p => (
              <button key={p.name} onClick={() => loadPreset(p)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white/[0.06] text-slate-400 border border-white/8 hover:bg-violet-500/15 hover:text-violet-300 hover:border-violet-500/30 transition-all">
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Controls */}
          <div className="space-y-5">
            {/* Animation Name */}
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-2 block">Animation Name</label>
              <input type="text" value={animName} onChange={e => setAnimName(e.target.value)}
                className={`${inputClass} font-mono`} placeholder="myAnimation" />
            </div>

            {/* Keyframes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-400">Keyframes</label>
                <button onClick={addKeyframe}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-violet-500/15 text-violet-300 border border-violet-500/30 hover:bg-violet-500/25 transition-all">
                  + Add Step
                </button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {keyframes.map((k, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                    <span className="text-xs font-mono text-slate-400 w-10 text-right shrink-0">{k.pct}%</span>
                    <input type="range" min="0" max="100" value={k.pct}
                      onChange={e => updateKeyframe(i, 'pct', parseInt(e.target.value))}
                      className="flex-1 accent-violet-500" />
                    <input type="text" value={k.transform}
                      onChange={e => updateKeyframe(i, 'transform', e.target.value)}
                      className="w-28 bg-white/[0.06] border border-white/8 rounded-lg px-2 py-1 text-xs font-mono text-white outline-none focus:border-violet-500/40" placeholder="transform" />
                    <input type="color" value={k.bg}
                      onChange={e => updateKeyframe(i, 'bg', e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent" />
                    <button onClick={() => removeKeyframe(i)}
                      className="w-6 h-6 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-all flex items-center justify-center">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Animation Properties */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1 block">Duration</label>
                <input type="text" value={duration} onChange={e => setDuration(e.target.value)}
                  className={inputClass} placeholder="1s" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1 block">Delay</label>
                <input type="text" value={delay} onChange={e => setDelay(e.target.value)}
                  className={inputClass} placeholder="0s" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1 block">Iterations</label>
                <input type="text" value={iteration} onChange={e => setIteration(e.target.value)}
                  className={inputClass} placeholder="infinite" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1 block">Fill Mode</label>
                <select value={fillMode} onChange={e => setFillMode(e.target.value)}
                  className={inputClass}>
                  {fillOptions.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1 block">Timing</label>
                <select value={timing} onChange={e => setTiming(e.target.value)}
                  className={inputClass}>
                  {timingOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1 block">Direction</label>
                <select value={direction} onChange={e => setDirection(e.target.value)}
                  className={inputClass}>
                  {directionOptions.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-400">Live Preview</label>
              <button onClick={togglePlay}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-white/[0.06] text-slate-400 border border-white/8 hover:bg-violet-500/15 hover:text-violet-300 transition-all">
                {playing ? '⏹ Reset' : '▶ Play'}
              </button>
            </div>
            <div className="bg-slate-900/50 rounded-2xl border border-white/[0.08] flex items-center justify-center h-48 relative overflow-hidden">
              <div className="grid grid-cols-3 grid-rows-3 gap-2 p-4 w-full h-full">
                {[0,1,2,3,4,5,6,7,8].map(idx => (
                  <div key={idx} className="rounded-xl"
                    style={playing ? {
                      animation: `preview-anim ${duration} ${timing} ${delay} ${iteration} ${direction} ${fillMode}`,
                      backgroundColor: keyframes[0]?.bg || '#6366f1',
                      opacity: keyframes[0]?.opacity || 1,
                    } : {
                      backgroundColor: keyframes[0]?.bg || '#6366f1',
                      opacity: keyframes[0]?.opacity || 1,
                    }} />
                ))}
              </div>
            </div>

            {/* Generated CSS */}
            <div ref={resultRef}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-400">Generated CSS</label>
                <button onClick={copyCSS}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/8 text-slate-400 hover:text-white'}`}>
                  {copied ? '✓ Copied' : '📋 Copy CSS'}
                </button>
              </div>
              <pre className="bg-slate-950/60 border border-white/[0.08] rounded-xl p-4 text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap max-h-80 overflow-y-auto">
                {css}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
