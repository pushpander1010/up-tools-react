import { useState, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const GIFTS=[
  {name:'Personalized Rakhi Mug',price:399,forWhom:'Brother',interest:'Personalized',icon:'☕',desc:'Photo printed ceramic mug with Happy Rakhi text'},
  {name:'Engraved Wooden Rakhi',price:299,forWhom:'Brother',interest:'Traditional',icon:'🪢',desc:'Handmade wooden rakhi with name engraving'},
  {name:'Wrist Watch (Titan/Fastrack)',price:1999,forWhom:'Brother',interest:'Fashion',icon:'⌚',desc:'Classic analog watch — budget to premium'},
  {name:'Wireless Earbuds',price:1499,forWhom:'Brother',interest:'Tech',icon:'🎧',desc:'Bluetooth earbuds — Boat/Noise under 1500'},
  {name:'Perfume Gift Set',price:899,forWhom:'Brother',interest:'Fashion',icon:'🧴',desc:'Men perfume combo — Fogg, Park Avenue'},
  {name:'Wallet + Belt Combo',price:799,forWhom:'Brother',interest:'Fashion',icon:'👝',desc:'Leather wallet + belt set in gift box'},
  {name:'Gaming Mouse / Keyboard',price:1299,forWhom:'Brother',interest:'Tech',icon:'🎮',desc:'For gamer brother — RGB mouse or mini keyboard'},
  {name:'Photo Frame Collage',price:499,forWhom:'Brother',interest:'Personalized',icon:'🖼️',desc:'6-photo collage frame with Rakhi message'},
  {name:'Kurta Pyjama Set',price:999,forWhom:'Brother',interest:'Traditional',icon:'👘',desc:'Cotton kurta set for festive look'},
  {name:'Fitness Band',price:1799,forWhom:'Brother',interest:'Tech',icon:'⌚',desc:'Mi Band / Noise Fit for fitness freak brother'},
  {name:'Customized Name Pen',price:349,forWhom:'Brother',interest:'Personalized',icon:'🖊️',desc:'Metal pen with name engraved'},
  {name:'Grooming Kit',price:699,forWhom:'Brother',interest:'Fashion',icon:'💈',desc:'Beard trimmer + face wash combo'},
  {name:'Rakhi + Sweets Hamper',price:599,forWhom:'Brother',interest:'Traditional',icon:'🍬',desc:'Kaju katli + designer rakhi in box'},
  {name:'Bluetooth Speaker',price:999,forWhom:'Brother',interest:'Tech',icon:'🔊',desc:'Portable speaker — Boat Stone series'},
  {name:'Leather Diary + Pen',price:449,forWhom:'Brother',interest:'Personalized',icon:'📓',desc:'PU leather diary with name print'},
  {name:'Jewellery Set (Earrings + Necklace)',price:799,forWhom:'Sister',interest:'Fashion',icon:'💍',desc:'Oxidised / American diamond set'},
  {name:'Customized Cushion',price:499,forWhom:'Sister',interest:'Personalized',icon:'🛋️',desc:'Photo printed cushion with Rakhi quote'},
  {name:'Saree / Suit Piece',price:1299,forWhom:'Sister',interest:'Traditional',icon:'🥻',desc:'Cotton / georgette saree or salwar set'},
  {name:'Handbag / Clutch',price:899,forWhom:'Sister',interest:'Fashion',icon:'👜',desc:'Trendy sling bag or clutch'},
  {name:'Makeup Kit',price:999,forWhom:'Sister',interest:'Fashion',icon:'💄',desc:'Lakme / Maybelline mini kit'},
  {name:'Personalized LED Photo Lamp',price:649,forWhom:'Sister',interest:'Personalized',icon:'💡',desc:'3D illusion lamp with photo'},
  {name:'Smart Watch for Women',price:1999,forWhom:'Sister',interest:'Tech',icon:'⌚',desc:'Noise / Fastrack women smartwatch'},
  {name:'Chocolate Hamper',price:399,forWhom:'Sister',interest:'Traditional',icon:'🍫',desc:'Ferrero / Cadbury celebration box + rakhi'},
  {name:'Perfume for Women',price:799,forWhom:'Sister',interest:'Fashion',icon:'🌸',desc:'Engage / Titan Skinn mini set'},
  {name:'Photo Mug + Chocolates',price:549,forWhom:'Sister',interest:'Personalized',icon:'☕',desc:'Custom mug + Dairy Milk hamper'},
  {name:'Earrings (Jhumka)',price:299,forWhom:'Sister',interest:'Fashion',icon:'✨',desc:'Oxidised jhumka set under 300'},
  {name:'Kurti Set',price:899,forWhom:'Sister',interest:'Traditional',icon:'👗',desc:'Cotton kurti + palazzo — festive pick'},
  {name:'Polaroid Photos + String Lights',price:699,forWhom:'Sister',interest:'Personalized',icon:'📸',desc:'16 polaroids + fairy lights combo'},
  {name:'Skincare Hamper',price:749,forWhom:'Sister',interest:'Fashion',icon:'🧴',desc:'Mamaearth / Wow face care combo'},
  {name:'Teddy Bear + Card',price:399,forWhom:'Sister',interest:'Personalized',icon:'🧸',desc:'Cute teddy with handmade Rakhi card'},
  {name:'Bhaiya-Bhabhi Combo Rakhi Set',price:499,forWhom:'Bhaiya-Bhabhi',interest:'Traditional',icon:'🪢',desc:'Bhai rakhi + lumba for bhabhi + roli chawal'},
  {name:'Couple Coffee Mugs',price:599,forWhom:'Bhaiya-Bhabhi',interest:'Personalized',icon:'☕',desc:'Mr & Mrs mugs with photo'},
  {name:'Dry Fruit Hamper',price:899,forWhom:'Bhaiya-Bhabhi',interest:'Traditional',icon:'🥜',desc:'Almonds, cashew, pistachio gift box'},
  {name:'Home Decor Gift',price:749,forWhom:'Bhaiya-Bhabhi',interest:'Personalized',icon:'🏠',desc:'Wooden nameplate or wall hanging'},
  {name:'Saree for Bhabhi',price:1499,forWhom:'Bhaiya-Bhabhi',interest:'Fashion',icon:'🥻',desc:'Designer saree for bhabhi + rakhi for bhaiya'},
  {name:'Kids Rakhi Combo (Cartoon)',price:199,forWhom:'Kids',interest:'Traditional',icon:'🦸',desc:'Chhota Bheem / Avengers kids rakhi'},
  {name:'Stationery Gift Set',price:399,forWhom:'Kids',interest:'Personalized',icon:'🎒',desc:'Pencil box + diary + eraser set'},
  {name:'Chocolate + Toy Combo',price:499,forWhom:'Kids',interest:'Traditional',icon:'🧸',desc:'Teddy + chocolates + cartoon rakhi'},
  {name:'Story Books Set',price:349,forWhom:'Kids',interest:'Personalized',icon:'📚',desc:'2-3 illustrated story books'},
  {name:'Return Gift: Sweets Box',price:299,forWhom:'Sister',interest:'Traditional',icon:'🍬',desc:'Classic return gift — sweets + cash envelope design'},
]

const BUDGETS=['All','Under ₹500','₹500-1000','₹1000-2500','₹2500+']
function priceMatch(p, b){
  if(b==='All') return true
  if(b==='Under ₹500') return p<500
  if(b==='₹500-1000') return p>=500 && p<=1000
  if(b==='₹1000-2500') return p>1000 && p<=2500
  if(b==='₹2500+') return p>2500
  return true
}

const ZONES=[
  {label:'IST (India)',offset:330},
  {label:'GST (Dubai)',offset:240},
  {label:'BST (London)',offset:60},
  {label:'EDT (New York)',offset:-240},
  {label:'PDT (Los Angeles)',offset:-420},
  {label:'AEST (Sydney)',offset:600},
]

function Countdown(){
  const [t,setT]=useState({d:0,h:0,m:0,s:0,over:false})
  useEffect(()=>{
    const target=new Date('2026-08-28T05:57:00+05:30').getTime()
    const iv=setInterval(()=>{
      const diff=target-Date.now()
      if(diff<=0){setT({d:0,h:0,m:0,s:0,over:true});clearInterval(iv);return}
      setT({d:Math.floor(diff/86400000),h:Math.floor(diff%86400000/3600000),m:Math.floor(diff%3600000/60000),s:Math.floor(diff%60000/1000),over:false})
    },1000)
    return()=>clearInterval(iv)
  },[])
  if(t.over) return <div className="text-center py-4 font-bold text-green-700">🎉 Happy Raksha Bandhan! Today is the day! 🪢</div>
  return (
    <div className="grid grid-cols-4 gap-2">
      {[['Days',t.d],['Hours',t.h],['Mins',t.m],['Secs',t.s]].map(([l,v])=>(
        <div key={l} className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-3 text-center text-white">
          <div className="text-2xl font-black">{String(v).padStart(2,'0')}</div>
          <div className="text-[10px] font-bold uppercase tracking-widest opacity-90">{l}</div>
        </div>
      ))}
    </div>
  )
}

function fmtInZone(offsetMin){
  const base=new Date('2026-08-28T05:57:00+05:30')
  const utc=base.getTime() - (330*60000)
  const zoned=new Date(utc + offsetMin*60000)
  return zoned.toLocaleString('en-IN',{weekday:'short',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit',hour12:true})
}

export default function raksha_bandhan_muhurat_finder(){
  const {ref:resultRef,jumpTo}=useJumpToResult()
  const [forWhom,setForWhom]=useState('All')
  const [budget,setBudget]=useState('All')
  const [interest,setInterest]=useState('All')
  const [search,setSearch]=useState('')
  const [copied,setCopied]=useState(false)
  const [totalBudget,setTotalBudget]=useState(2000)
  const [recipients,setRecipients]=useState(2)

  const filtered=GIFTS.filter(g=>{
    if(forWhom!=='All' && g.forWhom!==forWhom) return false
    if(interest!=='All' && g.interest!==interest) return false
    if(!priceMatch(g.price,budget)) return false
    if(search && !g.name.toLowerCase().includes(search.toLowerCase()) && !g.desc.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const perPerson=recipients>0? Math.floor(totalBudget/recipients):0

  const muhuratText=`Raksha Bandhan 2026 — Friday, 28 August 2026\nPurnima: Aug 27 09:08 AM - Aug 28 09:48 AM IST\nShubh Muhurat: 05:57 AM - 09:48 AM IST (Bhadra ends before sunrise)\nAparahna: 01:30 PM - 04:00 PM (alternate if morning missed)`

  const copyMuhurat=()=>{
    navigator.clipboard.writeText(muhuratText)
    setCopied(true); setTimeout(()=>setCopied(false),1500)
  }

  const faq=[
    {q:"When is Raksha Bandhan 2026 date and shubh muhurat?",a:"Raksha Bandhan 2026 is Friday, 28 August 2026. Purnima Tithi: Aug 27 09:08 AM to Aug 28 09:48 AM. Shubh Muhurat to tie Rakhi: 05:57 AM to 09:48 AM IST. Bhadra ends before sunrise, so entire morning is auspicious. Aparahna backup: 01:30–04:00 PM."},
    {q:"Is there Bhadra on Raksha Bandhan 2026?",a:"No — Bhadra ends before sunrise on Aug 28, 2026. Rituals can be done freely in the morning muhurat without Bhadra restrictions."},
    {q:"What is the best gift for brother on Rakhi under 1000?",a:"Under ₹1000 best picks: wallet+belt combo (₹799), perfume set (₹899), photo frame collage (₹499), rakhi+sweets hamper (₹599). Filter by Brother + ₹500-1000 above to see 10+ ideas."},
    {q:"What gift to give sister on Raksha Bandhan?",a:"Top gifts for sister: jewellery set, handbag, customized cushion, LED photo lamp, chocolate hamper, saree/suit piece. Set For Whom=Sister and choose interest (Fashion/Personalized) to filter."},
    {q:"Rakhi gift ideas for Bhaiya-Bhabhi?",a:"Choose Bhaiya-Bhabhi combo: rakhi+lumba set (₹499), couple mugs (₹599), dry fruit hamper (₹899), saree for bhabhi + rakhi for bhaiya (₹1499)."},
    {q:"How to do Rakhi Puja Vidhi at home?",a:"1) Clean puja thali with rakhi, roli, chawal, diya, sweets 2) Apply tilak to brother 3) Tie rakhi on right wrist 4) Do aarti 5) Offer sweets 6) Brother gives gift & promises protection."},
  ]
  const schema={"@context":"https://schema.org","@type":"FAQPage","mainEntity":faq.map(f=>({"@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}}))}

  return (
    <ToolLayout
      title="Raksha Bandhan 2026 Date, Shubh Muhurat & Gift Finder - Rakhi Gifts for Brother & Sister"
      desc="Raksha Bandhan 2026 is 28 Aug — check Shubh Muhurat (05:57-09:48 AM), Bhadra, Puja Vidhi, live countdown & find perfect Rakhi gifts for brother, sister, Bhaiya-Bhabhi by budget (under 500 to 2500+)."
      icon="🎁"
      iconBg="linear-gradient(135deg,#dc2626,#f59e0b)"
      slug="raksha-bandhan-muhurat-finder"
      category="festival"
      faq={faq}
      schema={schema}
      howItWorks={["Check muhurat & countdown","Use gift finder filters (relation, budget, interest)","Copy muhurat or share gifts on WhatsApp","Pick & shop your perfect Rakhi gift"]}
    >
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-red-600 via-orange-500 to-amber-500 rounded-3xl p-6 sm:p-8 text-white">
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold">🪢 RAKSHA BANDHAN 2026 • MUHURAT & GIFTS</div>
          <h2 className="text-2xl sm:text-3xl font-black mt-3">Fri, 28 August 2026</h2>
          <p className="text-sm opacity-90 mt-1">Purnima • Shravan — Bhadra ends before sunrise, full morning auspicious</p>
          <div className="mt-5 max-w-md">
            <Countdown/>
            <div className="text-center text-xs opacity-80 mt-2">Countdown to Shubh Muhurat 05:57 AM IST</div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3 mt-6">
            <div className="bg-black/30 backdrop-blur rounded-2xl p-4 border border-white/20">
              <div className="text-xs font-bold uppercase tracking-widest text-white">Purnima Tithi</div>
              <div className="font-bold text-sm mt-1 text-white">27 Aug 09:08 AM<br/>→ 28 Aug 09:48 AM</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-gray-900 border-2 border-amber-300 shadow-lg">
              <div className="text-xs font-bold uppercase tracking-widest text-orange-600">Shubh Muhurat ⭐</div>
              <div className="font-black text-sm mt-1">05:57 AM — 09:48 AM</div>
              <div className="text-xs text-gray-600">Best time to tie Rakhi</div>
            </div>
            <div className="bg-black/30 backdrop-blur rounded-2xl p-4 border border-white/20">
              <div className="text-xs font-bold uppercase tracking-widest text-white">Bhadra</div>
              <div className="font-bold text-sm mt-1 text-white">Ends before sunrise</div>
              <div className="text-xs text-white/90">No restriction ✔</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-bold text-gray-900">📅 Muhurat Details & Time Zones</h3>
            <button onClick={copyMuhurat} className="px-4 py-1.5 rounded-full bg-gray-900 text-white text-xs font-bold">{copied?'Copied!':'Copy Muhurat'}</button>
          </div>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm">
              <thead><tr className="text-xs text-gray-500 border-b"><th className="text-left py-2">Event</th><th className="text-left py-2">IST (India)</th><th className="text-left py-2 hidden sm:table-cell">Other Zones</th></tr></thead>
              <tbody className="text-gray-800">
                <tr className="border-b"><td className="py-2 font-semibold">Purnima Begins</td><td className="py-2">27 Aug, 09:08 AM</td><td className="py-2 hidden sm:table-cell text-xs text-gray-500">{fmtInZone(240)} GST • {fmtInZone(-240)} EDT</td></tr>
                <tr className="border-b"><td className="py-2 font-semibold">Purnima Ends</td><td className="py-2">28 Aug, 09:48 AM</td><td className="py-2 hidden sm:table-cell text-xs text-gray-500">{fmtInZone(240)} GST • {fmtInZone(-240)} EDT</td></tr>
                <tr className="bg-amber-50"><td className="py-2 font-bold text-orange-700">Shubh Muhurat</td><td className="py-2 font-bold text-orange-700">28 Aug, 05:57–09:48 AM</td><td className="py-2 hidden sm:table-cell text-xs text-gray-600">Check zone below</td></tr>
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
            {ZONES.map(z=>(
              <div key={z.label} className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <div className="text-[11px] font-bold text-amber-800 uppercase tracking-widest">{z.label}</div>
                <div className="text-xs font-semibold text-gray-900 mt-1">{fmtInZone(z.offset)}</div>
                <div className="text-[11px] text-gray-500">28 Aug Muhurat</div>
              </div>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-5">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xs font-bold text-gray-900 mb-2">🪔 Puja Vidhi (5 Steps)</div>
              <ol className="list-decimal pl-4 text-xs text-gray-700 space-y-1 leading-relaxed">
                <li>Prepare thali: rakhi, roli, chawal, diya, sweets, gift</li>
                <li>Sister applies tilak & chawal on brother's forehead</li>
                <li>Tie rakhi on brother's right wrist, pray for wellbeing</li>
                <li>Do aarti, offer sweets to brother</li>
                <li>Brother gives gift & vows to protect sister always</li>
              </ol>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="text-xs font-bold text-green-800 mb-2">✔ Do's & ✘ Don'ts</div>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>✔ Tie rakhi in Shubh Muhurat (morning)</li>
                <li>✔ Face east or north while tying</li>
                <li>✘ Don't tie rakhi in Bhadra (not applicable 2026)</li>
                <li>✘ Don't use broken/used rakhi</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-orange-200 rounded-3xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🎁</span>
            <h3 className="font-black text-gray-900 text-lg">Rakhi Gift Finder — By Budget & Relation</h3>
          </div>
          <p className="text-xs text-gray-500 mb-4">40+ curated gifts — filter by for whom, budget and interest. Perfect for brother, sister, Bhaiya-Bhabhi & kids.</p>

          <div className="flex gap-2 flex-wrap">
            <select value={forWhom} onChange={e=>setForWhom(e.target.value)} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white">
              <option value="All">All Relations</option>
              <option>Brother</option>
              <option>Sister</option>
              <option>Bhaiya-Bhabhi</option>
              <option>Kids</option>
            </select>
            <select value={budget} onChange={e=>setBudget(e.target.value)} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white">
              {BUDGETS.map(b=><option key={b}>{b}</option>)}
            </select>
            <select value={interest} onChange={e=>setInterest(e.target.value)} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white">
              <option value="All">All Interests</option>
              <option>Personalized</option>
              <option>Fashion</option>
              <option>Tech</option>
              <option>Traditional</option>
            </select>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search gift..." className="flex-1 min-w-[140px] px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-400"/>
          </div>

          <div className="text-xs text-gray-500 mt-3">{filtered.length} gifts found {forWhom!=='All'?`• for ${forWhom}`:''} {budget!=='All'?`• ${budget}`:''}</div>

          <div ref={resultRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
            {filtered.map((g,i)=>(
              <div key={i} className="border border-gray-200 rounded-2xl p-4 hover:border-orange-200 hover:shadow-sm transition bg-white">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl">{g.icon}</div>
                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-gray-900 text-white">₹{g.price}</span>
                </div>
                <div className="font-bold text-sm text-gray-900 mt-3">{g.name}</div>
                <div className="text-xs text-gray-600 mt-1 leading-relaxed">{g.desc}</div>
                <div className="flex gap-1.5 mt-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-amber-100 text-amber-800">{g.forWhom}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-gray-100 text-gray-600">{g.interest}</span>
                </div>
              </div>
            ))}
            {filtered.length===0 && <div className="col-span-full text-center py-8 text-sm text-gray-500">No gifts match — try relaxing filters.</div>}
          </div>

          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <div className="text-xs font-bold text-amber-900 mb-3">💰 Budget Planner</div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-600">Total Budget ₹</label>
                <input type="range" min={500} max={10000} step={100} value={totalBudget} onChange={e=>setTotalBudget(Number(e.target.value))} className="w-full accent-orange-500 mt-1"/>
                <div className="flex justify-between text-xs font-bold"><span>₹500</span><span className="text-orange-600">₹{totalBudget}</span><span>₹10000</span></div>
              </div>
              <div>
                <label className="text-xs text-gray-600">Recipients</label>
                <div className="flex items-center gap-2 mt-1">
                  <button onClick={()=>setRecipients(Math.max(1,recipients-1))} className="w-8 h-8 rounded-full border bg-white font-bold">−</button>
                  <span className="font-black text-lg w-8 text-center">{recipients}</span>
                  <button onClick={()=>setRecipients(recipients+1)} className="w-8 h-8 rounded-full border bg-white font-bold">+</button>
                  <span className="ml-3 text-sm font-bold text-orange-600">₹{perPerson} per person</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">Tip: Under ₹500 → small rakhi combos; ₹1000+ → watches, gadgets, jewellery sets</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900">Raksha Bandhan 2026 Shubh Muhurat & Gift Guide</h2>
          <p className="text-sm text-gray-600 leading-relaxed mt-3">Raksha Bandhan 2026 falls on Friday, 28 August. Unlike some years, Bhadra ends well before sunrise, so the entire morning muhurat (05:57–09:48 AM IST) is auspicious to tie Rakhi. If morning is missed, Aparahna (01:30–04:00 PM) is the backup. Our gift finder covers every budget — under ₹500 for small combos, ₹500–1000 for popular picks, ₹1000–2500 for premium watches and sarees, and ₹2500+ for luxury hampers.</p>
          <h3 className="font-bold text-gray-900 mt-6">Why gifts matter on Rakhi?</h3>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">The gift is the brother's thank you for the rakhi and the sister's love. Personalized gifts (mugs, cushions, lamps) carry memories; traditional (sweets, kurta, rakhi hampers) honour culture; tech & fashion gifts delight modern siblings. Use filters above to find the perfect match in 10 seconds.</p>
          <p className="text-xs text-gray-500 mt-4"><b>Targets:</b> raksha bandhan 2026 date, shubh muhurat, bhadra time, rakhi puja vidhi, rakhi gift for brother/sister, rakhi gift ideas under 500/1000.</p>
        </div>
      </div>
    </ToolLayout>
  )
}
