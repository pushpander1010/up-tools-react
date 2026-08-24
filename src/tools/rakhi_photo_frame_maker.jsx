import { useState, useRef, useEffect, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const FRAMES = [
  {id:'classic',name:'Classic Saffron',desc:'Traditional double border'},
  {id:'royal',name:'Royal Maroon',desc:'Gold + maroon elegant'},
  {id:'floral',name:'Floral Pink',desc:'Soft festive florals'},
  {id:'gold',name:'Golden Glow',desc:'Luxury gold gradient'},
  {id:'modern',name:'Modern Minimal',desc:'Clean white + orange'},
  {id:'festive',name:'Festive Pop',desc:'Bright & playful'},
]
const SIZES = [
  {id:'1:1',label:'Square 1:1',w:1080,h:1080},
  {id:'4:5',label:'Portrait 4:5',w:1080,h:1350},
  {id:'9:16',label:'Story 9:16',w:1080,h:1920},
]
const FONTS = ['Poppins','Georgia','Cursive','Monospace']
const STICKERS = ['🪢','🎁','🪔','❤️','🌸','✨','🎉','🙏','💫','🦚']

export default function rakhi_photo_frame_maker(){
  const {ref:resultRef,jumpTo}=useJumpToResult()
  const canvasRef=useRef(null)
  const fileRef=useRef(null)
  const [frame,setFrame]=useState('classic')
  const [sizeIdx,setSizeIdx]=useState(0)
  const [name,setName]=useState('')
  const [msg,setMsg]=useState('Happy Raksha Bandhan 2026')
  const [fontIdx,setFontIdx]=useState(0)
  const [textColor,setTextColor]=useState('#7f1d1d')
  const [img,setImg]=useState(null)
  const imgRef=useRef(null)
  const [stickers,setStickers]=useState([])
  const [drag,setDrag]=useState(null)

  const onUpload=(e)=>{
    const f=e.target.files?.[0]
    if(!f) return
    const r=new FileReader()
    r.onload=()=>{
      const im=new Image()
      im.onload=()=>{imgRef.current=im; setImg(r.result)}
      im.src=r.result
    }
    r.readAsDataURL(f)
  }

  const addSticker=(emoji)=>{
    setStickers(s=>[...s,{id:Date.now()+Math.random(),emoji,x:0.5+ (Math.random()-0.5)*0.2,y:0.18+Math.random()*0.15,scale:1}])
  }

  const draw=useCallback(()=>{
    const cvs=canvasRef.current
    if(!cvs) return
    const {w:W,h:H}=SIZES[sizeIdx]
    cvs.width=W; cvs.height=H
    const ctx=cvs.getContext('2d')
    // bg
    ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H)
    // photo area
    const pad=28
    const photoTop=90
    const photoH=H-220
    // clip photo with rounded rect
    ctx.save()
    const rr=24
    ctx.beginPath()
    ctx.roundRect(pad,photoTop,W-pad*2,photoH,rr)
    ctx.clip()
    if(imgRef.current){
      const im=imgRef.current
      const scale=Math.max((W-pad*2)/im.width, photoH/im.height)
      const iw=im.width*scale, ih=im.height*scale
      const dx= pad + (W-pad*2 - iw)/2
      const dy= photoTop + (photoH - ih)/2
      ctx.drawImage(im,dx,dy,iw,ih)
    } else {
      ctx.fillStyle='#fef3c7'
      ctx.fillRect(pad,photoTop,W-pad*2,photoH)
      ctx.fillStyle='#7f1d1d'
      ctx.font='bold 32px sans-serif'
      ctx.textAlign='center'; ctx.textBaseline='middle'
      ctx.fillText('📸  Upload your photo',W/2,photoTop+photoH/2-20)
      ctx.font='600 15px sans-serif'; ctx.fillStyle='#92400e'
      ctx.fillText('Your photo will appear here',W/2,photoTop+photoH/2+20)
    }
    // frame border
    ctx.restore()
    ctx.save()
    ctx.strokeStyle='#0000'
    // draw frame depending on type
    const frameColors={
      classic:['#FF9933','#FFD700','#138808'],
      royal:['#7f1d1d','#dc2626','#fbbf24'],
      floral:['#be185d','#f472b6','#fbcfe8'],
      gold:['#92400e','#f59e0b','#fef3c7'],
      modern:['#ff6b35','#ffffff','#ffedd5'],
      festive:['#7c3aed','#ec4899','#fde68a'],
    }[frame]
    // outer border
    ctx.lineWidth=18
    ctx.strokeStyle=frameColors[0]
    ctx.strokeRect(pad-6,photoTop-6,W-pad*2+12,photoH+12)
    ctx.lineWidth=8
    ctx.strokeStyle=frameColors[1]
    ctx.strokeRect(pad-10,photoTop-10,W-pad*2+20,photoH+20)
    // corner diyas/rakhi emojis
    ctx.font='28px serif'; ctx.textAlign='center'
    ctx.fillText('🪢',pad+20,photoTop+24)
    ctx.fillText('🪢',W-pad-20,photoTop+24)
    ctx.fillText('🪔',pad+20,photoTop+photoH-10)
    ctx.fillText('🪔',W-pad-20,photoTop+photoH-10)
    ctx.restore()

    // top bar
    const g=ctx.createLinearGradient(0,0,W,0)
    g.addColorStop(0,frameColors[0]); g.addColorStop(1,frameColors[1])
    ctx.fillStyle=g
    ctx.beginPath(); ctx.roundRect(W/2-260,18,520,56,28); ctx.fill()
    ctx.fillStyle='#fff'; ctx.font='bold 22px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle'
    ctx.fillText('🪢  HAPPY RAKSHA BANDHAN 2026  🪢',W/2,46)

    // stickers
    stickers.forEach(s=>{
      ctx.save()
      ctx.translate(s.x*W, s.y*H)
      ctx.scale(s.scale,s.scale)
      ctx.font='48px serif'; ctx.textAlign='center'; ctx.textBaseline='middle'
      ctx.fillText(s.emoji,0,0)
      ctx.restore()
    })

    // bottom text card
    const cardH=110
    const cardY=H-108
    ctx.fillStyle='rgba(255,255,255,0.96)'
    ctx.beginPath(); ctx.roundRect(W/2-420,cardY,840,cardH,20); ctx.fill()
    ctx.strokeStyle='rgba(0,0,0,0.06)'; ctx.lineWidth=1; ctx.stroke()
    ctx.fillStyle=textColor
    ctx.textAlign='center'; ctx.textBaseline='middle'
    const fontMap=['700 38px Poppins, sans-serif','700 38px Georgia, serif','700 42px cursive','700 34px monospace']
    ctx.font=fontMap[fontIdx]||fontMap[0]
    const displayName=name.trim()||msg
    // wrap if too long
    if(ctx.measureText(displayName).width>W-140){
      ctx.font=fontMap[fontIdx].replace(/38px|42px|34px/,'30px')
    }
    ctx.fillText(displayName,W/2,cardY+38)
    ctx.fillStyle='#6b7280'; ctx.font='14px sans-serif'
    ctx.fillText('Made with ❤️  •  uptools.in  •  Share with love',W/2,cardY+72)

    // drag indicators
    if(drag){
      ctx.strokeStyle='#38bdf8'; ctx.lineWidth=3; ctx.setLineDash([10,6])
      ctx.strokeRect(pad,photoTop,W-pad*2,photoH)
      ctx.setLineDash([])
    }
  },[frame,sizeIdx,name,msg,fontIdx,textColor,img,stickers,drag])

  useEffect(()=>{draw()},[draw])

  const getPos=(e)=>{
    const rect=canvasRef.current.getBoundingClientRect()
    const {w:W,h:H}=SIZES[sizeIdx]
    return {
      x:(e.clientX-rect.left)/rect.width,
      y:(e.clientY-rect.top)/rect.height
    }
  }

  const onDown=(e)=>{
    if(stickers.length===0) return
    const p=getPos(e)
    // find nearest sticker
    let best=null, bestD=0.08
    stickers.forEach(s=>{
      const d=Math.hypot(s.x-p.x, s.y-p.y)
      if(d<bestD){bestD=d; best=s}
    })
    if(best) setDrag({id:best.id, sx:p.x, sy:p.y, bx:best.x, by:best.y})
  }
  const onMove=(e)=>{
    if(!drag) return
    const p=getPos(e)
    const dx=p.x-drag.sx, dy=p.y-drag.sy
    setStickers(arr=>arr.map(s=>s.id===drag.id?{...s,x:drag.bx+dx, y:drag.by+dy}:s))
  }
  const onUp=()=>setDrag(null)

  const download=()=>{
    const cvs=canvasRef.current
    const a=document.createElement('a')
    a.download=`rakhi-frame-${Date.now()}.png`
    a.href=cvs.toDataURL('image/png')
    a.click()
  }

  const share=async()=>{
    const cvs=canvasRef.current
    cvs.toBlob(async blob=>{
      if(navigator.share && blob){
        const file=new File([blob],`rakhi-frame.png`,{type:'image/png'})
        try{await navigator.share({files:[file],title:'Happy Raksha Bandhan'})}catch{}
      } else {
        window.open(`https://wa.me/?text=${encodeURIComponent('Happy Raksha Bandhan! 🪢 Made with uptools.in')}`,'_blank')
      }
    },'image/png')
  }

  const faq=[
    {q:"How to make Rakhi photo with name?",a:"Upload your photo, choose a frame, type name/message, adjust color and drag stickers, then download HD PNG. Works on phone and desktop — no signup needed."},
    {q:"Can I add my photo to Rakhi frame?",a:"Yes — click Upload Photo, your image is auto-fitted into the frame. You can switch sizes (Square, Portrait, Story) for Instagram, WhatsApp Status or printing."},
    {q:"Is this Rakhi photo frame free?",a:"100% free, no watermark on the main photo area (small uptools.in credit at bottom). Download unlimited HD images."},
    {q:"What size is best for WhatsApp DP?",a:"Use Square 1:1 for WhatsApp DP and Instagram post, Portrait 4:5 for feed, Story 9:16 for WhatsApp/Instagram Stories."},
    {q:"Can I add Hindi text?",a:"Yes — type in Hindi directly in the Name/Message field. Choose a Hindi-friendly font and set your text color."}
  ]
  const schema={"@context":"https://schema.org","@type":"FAQPage","mainEntity":faq.map(f=>({"@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}}))}

  return (
    <ToolLayout
      title="Rakhi Photo Frame & Greeting Card Maker with Name & Photo 2026 - Free Online"
      desc="Add your photo to beautiful Rakhi frames — 6 festive designs, name on image, stickers & HD download. Make Happy Raksha Bandhan greeting cards for WhatsApp, Instagram & DP in seconds."
      icon="🖼️"
      iconBg="linear-gradient(135deg,#7f1d1d,#f59e0b)"
      slug="rakhi-photo-frame-maker"
      category="images"
      faq={faq}
      schema={schema}
      howItWorks={["Upload your photo","Choose frame & size (1:1 / 4:5 / 9:16)","Add name/message & stickers","Download HD or share"]}
    >
      <div className="space-y-5">
        <div className="grid lg:grid-cols-[360px,1fr] gap-5">
          <div className="space-y-4">
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 space-y-4 shadow-sm">
              <button onClick={()=>fileRef.current?.click()} className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm">📸 Upload Photo</button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onUpload}/>
              {!img && <p className="text-xs text-gray-600 text-center">JPG, PNG — auto-fitted & cropped</p>}

              <div>
                <div className="text-xs font-bold text-gray-900 mb-2">Frame Style</div>
                <div className="grid grid-cols-2 gap-2">
                  {FRAMES.map(f=>(
                    <button key={f.id} onClick={()=>setFrame(f.id)} className={`p-3 rounded-xl border-2 text-left ${frame===f.id?'border-orange-500 bg-orange-50 shadow-sm':'border-gray-300 bg-white hover:border-orange-400 hover:bg-orange-50'}`}>
                      <div className="text-xs font-bold text-gray-900">{f.name}</div>
                      <div className="text-[11px] text-gray-600">{f.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-gray-900 mb-2">Size</div>
                <div className="flex gap-2">
                  {SIZES.map((s,i)=>(
                    <button key={s.id} onClick={()=>setSizeIdx(i)} className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 ${sizeIdx===i?'bg-gray-900 text-white border-gray-900 shadow-md':'bg-white text-gray-900 border-gray-300 hover:border-gray-400'}`}>{s.label}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-900">Name / Message on Card</label>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Aman & Priya" className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"/>
                <input value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Greeting (if no name)" className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"/>
                <div className="flex gap-2">
                  <select value={fontIdx} onChange={e=>setFontIdx(Number(e.target.value))} className="flex-1 px-3 py-2 rounded-xl border-2 border-gray-300 bg-white text-gray-900 text-xs font-medium">
                    {FONTS.map((f,i)=><option key={f} value={i}>{f}</option>)}
                  </select>
                  <input type="color" value={textColor} onChange={e=>setTextColor(e.target.value)} className="w-10 h-9 rounded-xl border-2 border-gray-300 p-1 bg-white"/>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-gray-900 mb-2">Stickers — tap to add, drag on canvas</div>
                <div className="flex flex-wrap gap-1.5">
                  {STICKERS.map(s=>(
                    <button key={s} onClick={()=>addSticker(s)} className="w-9 h-9 rounded-xl bg-amber-50 border-2 border-amber-300 text-lg hover:bg-amber-100 shadow-sm">{s}</button>
                  ))}
                </div>
                {stickers.length>0 && <button onClick={()=>setStickers([])} className="text-xs text-gray-700 font-semibold mt-2 underline">Clear stickers</button>}
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={download} className="flex-1 py-3 rounded-xl bg-gray-900 text-white font-bold text-sm shadow-md">⬇ Download HD</button>
              <button onClick={share} className="px-5 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-900 font-bold text-sm hover:bg-gray-50">Share</button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-3xl p-4 flex justify-center items-start">
            <canvas
              ref={canvasRef}
              onMouseDown={onDown}
              onMouseMove={onMove}
              onMouseUp={onUp}
              onMouseLeave={onUp}
              onTouchStart={e=>onDown(e.touches[0])}
              onTouchMove={e=>{e.preventDefault(); onMove(e.touches[0])}}
              onTouchEnd={onUp}
              className="w-full max-w-[520px] rounded-2xl shadow-xl bg-white touch-none"
              style={{aspectRatio: SIZES[sizeIdx].w/SIZES[sizeIdx].h}}
            />
          </div>
        </div>

        <div ref={resultRef} className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900">Rakhi Photo Frame with Name — Make Greeting Cards in Seconds</h2>
          <p className="text-sm text-gray-600 leading-relaxed mt-3">Add your favourite photo to a festive Rakhi frame, write your name and download a HD greeting card ready for WhatsApp, Instagram, DP or printing. No app needed — 6 designer frames, 3 sizes and stickers make every card personal.</p>
          <h3 className="font-bold text-gray-900 mt-6">How to create Rakhi photo frame?</h3>
          <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-1 mt-2">
            <li>Upload your photo (or siblings' photo) — auto-fitted to frame</li>
            <li>Pick a frame: Classic Saffron, Royal Maroon, Floral Pink, Golden Glow, Modern Minimal or Festive Pop</li>
            <li>Choose size: 1:1 for DP/post, 4:5 for Instagram feed, 9:16 for Story/Status</li>
            <li>Type name/message, pick font & color, add 🪢🎁🪔 stickers and drag to position</li>
            <li>Download HD PNG or Share directly to WhatsApp/Instagram</li>
          </ol>
          <p className="text-sm text-gray-600 mt-4"><b>Keywords:</b> rakhi photo frame, rakhi greeting card maker, happy raksha bandhan photo with name, rakhi images with name editor, rakhi dp maker — all covered in one tool without watermark.</p>
        </div>
      </div>
    </ToolLayout>
  )
}
