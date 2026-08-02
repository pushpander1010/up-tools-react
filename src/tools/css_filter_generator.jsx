import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'

const FILTER_DEFAULTS = [
  { name: 'blur', label: 'Blur', unit: 'px', min: 0, max: 20, step: 0.1, default: 0 },
  { name: 'brightness', label: 'Brightness', unit: '%', min: 0, max: 300, step: 1, default: 100 },
  { name: 'contrast', label: 'Contrast', unit: '%', min: 0, max: 300, step: 1, default: 100 },
  { name: 'saturate', label: 'Saturate', unit: '%', min: 0, max: 300, step: 1, default: 100 },
  { name: 'sepia', label: 'Sepia', unit: '%', min: 0, max: 100, step: 1, default: 0 },
  { name: 'grayscale', label: 'Grayscale', unit: '%', min: 0, max: 100, step: 1, default: 0 },
  { name: 'invert', label: 'Invert', unit: '%', min: 0, max: 100, step: 1, default: 0 },
  { name: 'hue-rotate', label: 'Hue Rotate', unit: 'deg', min: 0, max: 360, step: 1, default: 0 },
  { name: 'opacity', label: 'Opacity', unit: '%', min: 0, max: 100, step: 1, default: 100 },
]

// Sample image for preview (a gradient placeholder)
const SAMPLE_IMG = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop'

export default function CssFilterGenerator() {
  const [values, setValues] = useState(() =>
    Object.fromEntries(FILTER_DEFAULTS.map(f => [f.name, f.default]))
  )
  const [imageUrl, setImageUrl] = useState(SAMPLE_IMG)
  const [copied, setCopied] = useState(false)

  const handleChange = (name, val) => {
    setValues(prev => ({ ...prev, [name]: Number(val) }))
  }

  const handleReset = () => {
    setValues(Object.fromEntries(FILTER_DEFAULTS.map(f => [f.name, f.default])))
  }

  const filterString = useMemo(() => {
    return FILTER_DEFAULTS
      .map(f => `${f.name}(${values[f.name]}${f.unit})`)
      .join(' ')
  }, [values])

  const cssCode = useMemo(() => {
    return `filter: ${filterString};`
  }, [filterString])

  const handleCopy = () => {
    navigator.clipboard.writeText(cssCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <ToolLayout
      title="CSS Filter Generator"
      desc="Visual CSS filter builder with live preview. Adjust blur, brightness, contrast, saturation and more — copy ready-to-use CSS."
      icon="🎬" iconBg="rgba(99,102,241,0.08)"
      category="dev" slug="css-filter-generator"
      faq={[
        { q: 'What are CSS filters?', a: 'CSS filters apply visual effects like blur, brightness, contrast, and color manipulation to HTML elements, similar to Photoshop filters.' },
        { q: 'Can I use these on any element?', a: 'Yes! The generated CSS filter property works on any HTML element — images, divs, videos, etc.' },
      ]}
      howItWorks={[
        'Adjust the filter sliders to see live visual changes.',
        'Customize the preview image URL if desired.',
        'Copy the generated CSS code to use in your project.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "CSS Filter Generator", "applicationCategory": "DeveloperApplication",
        "url": "https://www.uptools.in/css-filter-generator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Preview */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <label className="block text-sm font-semibold text-slate-300 mb-3">Live Preview</label>
          <div className="flex justify-center overflow-hidden rounded-xl">
            <img
              src={imageUrl}
              alt="Filter preview"
              className="max-w-full max-h-[350px] object-cover rounded-xl transition-all duration-200"
              style={{ filter: filterString }}
              onError={(e) => { e.target.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect fill="%23374151" width="600" height="400"/><text fill="%239ca3af" font-family="sans-serif" font-size="18" x="300" y="200" text-anchor="middle">Image failed to load</text></svg>') }}
            />
          </div>
          <input
            type="text"
            className="w-full mt-3 bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-2 text-xs text-slate-400 font-mono focus:outline-none focus:border-indigo-500/50"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            placeholder="Image URL..."
          />
        </div>

        {/* Sliders */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-semibold text-slate-300">Filter Controls</label>
            <button onClick={handleReset} className="text-xs text-slate-400 hover:text-white transition-colors">
              Reset All
            </button>
          </div>
          <div className="space-y-3">
            {FILTER_DEFAULTS.map(f => (
              <div key={f.name} className="flex items-center gap-3">
                <span className="text-xs text-slate-400 w-24 shrink-0 font-medium">{f.label}</span>
                <input
                  type="range"
                  min={f.min} max={f.max} step={f.step}
                  value={values[f.name]}
                  onChange={e => handleChange(f.name, e.target.value)}
                  className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-indigo-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <span className="text-xs text-indigo-300 font-mono w-16 text-right">
                  {values[f.name]}{f.unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CSS Output */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-slate-300">Generated CSS</label>
            <button onClick={handleCopy} className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="bg-black/30 rounded-xl p-4 text-sm text-emerald-400 font-mono overflow-x-auto whitespace-pre-wrap">
            {cssCode}
          </pre>
        </div>
      </div>
    </ToolLayout>
  )
}
