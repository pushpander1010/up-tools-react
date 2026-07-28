import { useState, useCallback, useMemo, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'

const NAMED_COLORS = {aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgreen:"#006400",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",gold:"#ffd700",goldenrod:"#daa520",gray:"#808080",green:"#008000",greenyellow:"#adff2f",honeydew:"#f0fff0",hotpink:"#ff69b4",indianred:"#cd5c5c",indigo:"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",lavender:"#e6e6fa",lavenderblush:"#fff0f5",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgray:"#d3d3d3",lightgreen:"#90ee90",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslategray:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#00ff00",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370db",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#db7093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",rebeccapurple:"#663399",red:"#ff0000",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"}

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)) }

function hexToRgb(hex) {
  hex = hex.replace(/^#/, '')
  if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]
  if (hex.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(hex)) return null
  return { r: parseInt(hex.slice(0,2),16), g: parseInt(hex.slice(2,4),16), b: parseInt(hex.slice(4,6),16) }
}

function rgbToHex(r, g, b) {
  return '#' + [r,g,b].map(v => clamp(Math.round(v),0,255).toString(16).padStart(2,'0')).join('')
}

function rgbToHsl(r, g, b) {
  r/=255; g/=255; b/=255
  const max=Math.max(r,g,b), min=Math.min(r,g,b)
  let h, s, l=(max+min)/2
  if(max===min){h=s=0}
  else{
    const d=max-min
    s=l>0.5?d/(2-max-min):d/(max+min)
    if(max===r) h=((g-b)/d+(g<b?6:0))/6
    else if(max===g) h=((b-r)/d+2)/6
    else h=((r-g)/d+4)/6
  }
  return { h:Math.round(h*360), s:Math.round(s*100), l:Math.round(l*100) }
}

function hslToRgb(h,s,l) {
  h/=360;s/=100;l/=100
  let r,g,b
  if(s===0){r=g=b=l}
  else{
    const hue2rgb=(p,q,t)=>{
      if(t<0)t+=1;if(t>1)t-=1
      if(t<1/6)return p+(q-p)*6*t
      if(t<1/2)return q
      if(t<2/3)return p+(q-p)*(2/3-t)*6
      return p
    }
    const q=l<0.5?l*(1+s):l+s-l*s
    const p=2*l-q
    r=hue2rgb(p,q,h+1/3)
    g=hue2rgb(p,q,h)
    b=hue2rgb(p,q,h-1/3)
  }
  return {r:Math.round(r*255),g:Math.round(g*255),b:Math.round(b*255)}
}

function detectAndParse(input) {
  input = input.trim()
  if(/^#?[0-9a-fA-F]{3,6}$/.test(input)){
    const hex=input.startsWith('#')?input:'#'+input
    return hexToRgb(hex)
  }
  const rgbMatch=input.match(/^rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i)
  if(rgbMatch){
    return {r:clamp(+rgbMatch[1],0,255),g:clamp(+rgbMatch[2],0,255),b:clamp(+rgbMatch[3],0,255)}
  }
  const hslMatch=input.match(/^hsl\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\s*\)$/i)
  if(hslMatch){
    return hslToRgb(+hslMatch[1],+hslMatch[2],+hslMatch[3])
  }
  const bareMatch=input.match(/^(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})$/)
  if(bareMatch){
    return {r:clamp(+bareMatch[1],0,255),g:clamp(+bareMatch[2],0,255),b:clamp(+bareMatch[3],0,255)}
  }
  return null
}

function findNamedColor(r,g,b) {
  const hex=rgbToHex(r,g,b)
  for(const[name,val] of Object.entries(NAMED_COLORS)){
    if(val.toLowerCase()===hex.toLowerCase()) return name.charAt(0).toUpperCase()+name.slice(1)
  }
  return null
}

function luminance(r,g,b) {
  const a=[r,g,b].map(v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)})
  return 0.2126*a[0]+0.7152*a[1]+0.0722*a[2]
}
function textColorFor(r,g,b){return luminance(r,g,b)>0.4?'#000':'#fff'}

const QUICK_COLORS = [
  {name:'Red',hex:'#ff0000'},{name:'Orange',hex:'#ffa500'},{name:'Yellow',hex:'#ffff00'},
  {name:'Green',hex:'#008000'},{name:'Cyan',hex:'#00ffff'},{name:'Blue',hex:'#0000ff'},
  {name:'Purple',hex:'#800080'},{name:'Pink',hex:'#ffc0cb'},{name:'White',hex:'#ffffff'},
  {name:'Black',hex:'#000000'},{name:'Gray',hex:'#808080'},{name:'Brown',hex:'#a52a2a'},
  {name:'Lime',hex:'#00ff00'},{name:'Teal',hex:'#008080'},{name:'Navy',hex:'#000080'},
  {name:'Maroon',hex:'#800000'},{name:'Olive',hex:'#808000'},{name:'Coral',hex:'#ff7f50'},
  {name:'Gold',hex:'#ffd700'},{name:'Indigo',hex:'#4b0082'},
]

export default function HexToRgbConverter() {
  const [input, setInput] = useState('#6366f1')
  const [copied, setCopied] = useState('')

  const rgb = useMemo(() => detectAndParse(input), [input])
  const hex = useMemo(() => rgb ? rgbToHex(rgb.r, rgb.g, rgb.b).toUpperCase() : '', [rgb])
  const hsl = useMemo(() => rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null, [rgb])
  const name = useMemo(() => rgb ? findNamedColor(rgb.r, rgb.g, rgb.b) : null, [rgb])

  const copyVal = useCallback((text) => {
    navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(''), 1600)
  }, [])

  return (
    <ToolLayout
      title="HEX ↔ RGB Converter"
      desc="Convert between HEX, RGB & HSL color formats with live preview."
      icon="🌈" iconBg="rgba(99,102,241,0.08)"
      category="dev" slug="hex-to-rgb-converter"
    >
      <div className="max-w-[680px] mx-auto space-y-4">
        {/* Color Preview Swatch */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 text-center">
          <div
            className="w-full h-[120px] rounded-xl transition-colors duration-200 border"
            style={{
              background: rgb ? hex : '#1c1c28',
              borderColor: rgb ? (textColorFor(rgb.r,rgb.g,rgb.b)==='#000' ? 'rgba(0,0,0,.15)' : 'rgba(255,255,255,.15)') : 'rgba(255,255,255,.06)',
              borderWidth: !rgb ? '2px' : '1px',
              borderStyle: !rgb ? 'dashed' : 'solid',
            }}
          />
          {name && <div className="mt-2 text-sm font-semibold text-indigo-300">Named color: {name}</div>}
          {!rgb && <div className="mt-2 text-sm text-slate-400">Invalid color — try #FF0000, rgb(255,0,0), or hsl(0,100%,50%)</div>}
        </div>

        {/* Input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Enter a color (HEX, RGB, or HSL)</label>
          <div className="flex gap-2">
            <input
              className="flex-1 bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-indigo-500/50"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="#6366f1 or rgb(99,102,241) or hsl(239,84%,67%)"
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">💡 Supports: <code className="bg-white/[0.06] px-1.5 py-0.5 rounded text-[10px]">#RRGGBB</code> <code className="bg-white/[0.06] px-1.5 py-0.5 rounded text-[10px]">#RGB</code> <code className="bg-white/[0.06] px-1.5 py-0.5 rounded text-[10px]">rgb(r,g,b)</code> <code className="bg-white/[0.06] px-1.5 py-0.5 rounded text-[10px]">hsl(h,s%,l%)</code></p>
        </div>

        {/* Results */}
        {rgb && (
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
            <h2 className="text-base font-bold text-white mb-3">Converted Values</h2>

            {[
              { label: 'HEX', value: hex },
              { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
              { label: 'HSL', value: hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : '' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-3 py-2 border-b border-white/[0.04] last:border-0">
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] uppercase tracking-wider text-slate-500">{label}</span>
                  <div className="font-mono text-sm text-white break-all">{value}</div>
                </div>
                <button
                  onClick={() => copyVal(value)}
                  className="text-[11px] px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.1] transition shrink-0"
                >
                  {copied === value ? '✓ Copied' : '📋 Copy'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Quick Colors */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <h2 className="text-base font-bold text-white mb-3">Quick Colors</h2>
          <div className="flex flex-wrap gap-2">
            {QUICK_COLORS.map(c => (
              <button
                key={c.hex}
                title={c.name}
                onClick={() => setInput(c.hex)}
                className="w-9 h-9 rounded-lg border-2 border-white/[0.08] hover:scale-110 transition-all cursor-pointer"
                style={{ background: c.hex, boxShadow: `0 0 0 0 ${c.hex}` }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 12px ${c.hex}44` }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
              />
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
