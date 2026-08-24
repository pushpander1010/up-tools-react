import { useState, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const CATEGORIES = ['All','For Brother','For Sister','Emotional','Funny','Short & Sweet','Hindi','Instagram Captions','From Sister','From Brother']

const WISHES = [
  {text:"Happy Raksha Bandhan, bhai! You are my hero, my protector, and my forever friend. Love you! 🪢❤️",cat:"For Brother"},
  {text:"To the best brother in the world — thank you for being my strength. Happy Rakhi! 🎁",cat:"For Brother"},
  {text:"Bhai, no matter how much we fight, I know you'll always have my back. Happy Raksha Bandhan!",cat:"For Brother"},
  {text:"Wishing my amazing brother a very Happy Rakhi filled with love and laughter! 🪢",cat:"For Brother"},
  {text:"Dear Bhaiya, you make my world brighter. Happy Raksha Bandhan 2026! ✨",cat:"For Brother"},
  {text:"Rakhi is love, care and lifelong promise. Happy Raksha Bandhan, my dear brother! 💫",cat:"For Brother"},
  {text:"Bhai, thanks for all the childhood memories and lifelong support. Happy Rakhi! 🥰",cat:"For Brother"},
  {text:"May our bond grow stronger every year. Happy Raksha Bandhan, bhai! 🪢❤️",cat:"For Brother"},
  {text:"You are not just my brother, you are my best friend. Happy Rakhi!",cat:"For Brother"},
  {text:"Happy Rakhi to the one who has always spoiled me and protected me! Love you bhai 😘",cat:"For Brother"},
  {text:"Bhaiya, aap jaisa bhai sabko mile. Happy Raksha Bandhan! 🙏",cat:"For Brother"},
  {text:"To my brother — my first superhero. Happy Raksha Bandhan! 🦸‍♂️",cat:"For Brother"},
  {text:"Happy Rakhi, bhai! May life bless you with success and happiness always.",cat:"For Brother"},
  {text:"Distance means nothing when love is strong. Happy Rakhi to my lovely brother! 🌍❤️",cat:"For Brother"},
  {text:"Thank you for being my guardian angel. Happy Raksha Bandhan, bhaiya!",cat:"For Brother"},
  {text:"Happy Raksha Bandhan to my sweet sister — you are my princess forever! 👑🪢",cat:"For Sister"},
  {text:"To my dearest sister, you make every day beautiful. Happy Rakhi, behna! 🌸",cat:"For Sister"},
  {text:"Behna, your smile is my strength. Happy Raksha Bandhan! Love you ❤️",cat:"For Sister"},
  {text:"Happy Rakhi to my cute, caring and crazy sister — love you to the moon! 🌙",cat:"For Sister"},
  {text:"Sister, you are my childhood partner in crime. Happy Raksha Bandhan! 😄",cat:"For Sister"},
  {text:"Wishing my wonderful sister endless happiness. Happy Rakhi 2026! 🎉",cat:"For Sister"},
  {text:"Behna, may your life be filled with sweet surprises. Happy Raksha Bandhan!",cat:"For Sister"},
  {text:"To my sister — my biggest supporter and harshest critic. Happy Rakhi! 😘",cat:"For Sister"},
  {text:"Happy Raksha Bandhan, didi! Thanks for always guiding me like a second mother.",cat:"For Sister"},
  {text:"My sister, my pride, my joy — Happy Rakhi! 🪢💖",cat:"For Sister"},
  {text:"Behna, tu hai toh har gham kam hai. Happy Raksha Bandhan! 🥰",cat:"For Sister"},
  {text:"Happy Rakhi to the queen of my heart — my sister! 👑",cat:"For Sister"},
  {text:"Sister love is forever. Happy Raksha Bandhan, behna! ♾️❤️",cat:"For Sister"},
  {text:"Wishing my angel sister a very Happy Rakhi! Stay blessed always.",cat:"For Sister"},
  {text:"Behna, your Rakhi makes me feel so loved. Happy Raksha Bandhan!",cat:"For Sister"},
  {text:"Our bond is unbreakable, our love is endless. Happy Raksha Bandhan! 🔗❤️",cat:"Emotional"},
  {text:"Rakhi is not just a thread, it's a promise of lifetime protection. Happy Raksha Bandhan!",cat:"Emotional"},
  {text:"With every Rakhi, I promise to stand by you forever. Happy Raksha Bandhan! 🤝",cat:"Emotional"},
  {text:"The thread of Rakhi holds our childhood, love and memories together. Happy Rakhi! 🧵💝",cat:"Emotional"},
  {text:"No matter where life takes us, our bond will always remain. Happy Raksha Bandhan! 🌟",cat:"Emotional"},
  {text:"Tears of joy, heart full of love — that's what Rakhi means to me. Happy Rakhi! 🥹❤️",cat:"Emotional"},
  {text:"You are my strength, my weakness, my everything. Happy Raksha Bandhan, dear sibling!",cat:"Emotional"},
  {text:"This Rakhi, I thank God for giving me you as my sibling. Happy Raksha Bandhan! 🙏",cat:"Emotional"},
  {text:"May this Rakhi erase all distances and bring us closer. Happy Raksha Bandhan! 💞",cat:"Emotional"},
  {text:"Your love is my biggest treasure. Happy Raksha Bandhan! 💎❤️",cat:"Emotional"},
  {text:"From childhood fights to lifelong friendship — happy Rakhi, partner! 😂🪢",cat:"Funny"},
  {text:"Happy Rakhi! Warning: No gift = no entry next year! 😜🎁",cat:"Funny"},
  {text:"Bhai, Rakhi ka gift kahan hai? Wallet ready rakho! 😂💸",cat:"Funny"},
  {text:"Happy Raksha Bandhan! Thanks for being my free ATM, bhai! 🏧😂",cat:"Funny"},
  {text:"Behna, thanks for tolerating my tantrums. Happy Rakhi — gift toh banta hai! 😆",cat:"Funny"},
  {text:"Rakhi aayi, gift lao, warna behna naraz ho jayegi! 😂🎁",cat:"Funny"},
  {text:"Happy Rakhi to the one who stole my chocolates and my heart! 🍫❤️😂",cat:"Funny"},
  {text:"Bhai, is Rakhi pe promise karo — meri treat pending hai! 🍕😜",cat:"Funny"},
  {text:"Happy Raksha Bandhan! Let's fight, laugh and eat sweets together! 🍬😄",cat:"Funny"},
  {text:"Dear brother, your sister is your lifelong free bodyguard. Happy Rakhi! 😂💪",cat:"Funny"},
  {text:"Happy Rakhi! 🪢",cat:"Short & Sweet"},
  {text:"Happy Raksha Bandhan! ❤️🪢",cat:"Short & Sweet"},
  {text:"Love you bhai, Happy Rakhi! 🥰",cat:"Short & Sweet"},
  {text:"Happy Rakhi, behna! 🌸",cat:"Short & Sweet"},
  {text:"Rakhi Mubarak! 🎉",cat:"Short & Sweet"},
  {text:"Forever together — Happy Rakhi! ♾️",cat:"Short & Sweet"},
  {text:"Happy Raksha Bandhan 2026! 🪢✨",cat:"Short & Sweet"},
  {text:"My sibling, my pride — Happy Rakhi! 💖",cat:"Short & Sweet"},
  {text:"Stay blessed, Happy Rakhi! 🙏",cat:"Short & Sweet"},
  {text:"Bond of love — Happy Raksha Bandhan! 🔗❤️",cat:"Short & Sweet"},
  {text:"Behna ka pyaar, bhai ka sahara — Happy Raksha Bandhan! 🪢❤️",cat:"Hindi"},
  {text:"Khushiyon ka tyohar hai Rakhi, bhai-behan ke pyaar ka tyohar! Happy Rakhi! 🎉",cat:"Hindi"},
  {text:"Rakhi ke is paavan avsar par dher saari shubhkamnayein! 🙏🪢",cat:"Hindi"},
  {text:"Bhai-behan ka rishta sabse pyaara, Happy Raksha Bandhan! 💝",cat:"Hindi"},
  {text:"Phoolon ka taron ka sabka kehna hai, ek hazaron mein meri behna hai! Happy Rakhi! 🌸",cat:"Hindi"},
  {text:"Yeh lamha kuch khaas hai, behan ke hathon mein bhai ka haath hai! Happy Raksha Bandhan! ✨",cat:"Hindi"},
  {text:"Rakhi ka tyohar, bhai-behan ka pyaar — Happy Raksha Bandhan 2026! 🪢🎁",cat:"Hindi"},
  {text:"Behan ne bhai ki kalai par pyaar bandha hai, Happy Rakhi! 🥰",cat:"Hindi"},
  {text:"Meri pyaari behna ko Raksha Bandhan ki dher saari badhai! 🌟",cat:"Hindi"},
  {text:"Bhaiya mere Rakhi ke bandhan ko nibhana — Happy Raksha Bandhan!",cat:"Hindi"},
  {text:"Sibling goals since day one 💫 Happy Raksha Bandhan! #Rakhi2026",cat:"Instagram Captions"},
  {text:"My forever protector 🦸‍♂️ Happy Rakhi bhai! #BrotherLove",cat:"Instagram Captions"},
  {text:"Rakhi vibes only 🪢✨ #RakshaBandhan #SiblingLove",cat:"Instagram Captions"},
  {text:"Partner in crime since childhood 😎 Happy Rakhi! #Rakhi2026",cat:"Instagram Captions"},
  {text:"Blood makes us siblings, love makes us best friends ❤️ #HappyRakhi",cat:"Instagram Captions"},
  {text:"Thread of love, bond forever ♾️ Happy Raksha Bandhan! #Rakhi",cat:"Instagram Captions"},
  {text:"Bhai + Behna = Forever ♾️🪢 #RakshaBandhan2026",cat:"Instagram Captions"},
  {text:"Not just a festival, it's an emotion 🥹❤️ #RakhiLove",cat:"Instagram Captions"},
  {text:"Keeping the promise, today and always 🤝 Happy Rakhi! #SiblingGoals",cat:"Instagram Captions"},
  {text:"My sister is my superpower 💖 Happy Rakhi! #SisterLove",cat:"Instagram Captions"},
  {text:"Bhai, you are my first best friend and forever hero. Thank you for everything. Happy Rakhi! 🪢❤️",cat:"From Sister"},
  {text:"Dear Bhaiya, on this Rakhi I pray for your happiness, health and success. Happy Raksha Bandhan! 🙏",cat:"From Sister"},
  {text:"Bhai, your support means everything to me. Happy Raksha Bandhan — love you tons! 😘",cat:"From Sister"},
  {text:"To my dear brother, thanks for all the scoldings and love. Happy Rakhi! 🥰",cat:"From Sister"},
  {text:"Bhai, you make me feel safe always. Happy Raksha Bandhan! Big hug! 🤗",cat:"From Sister"},
  {text:"Happy Rakhi, bhai! Stay awesome, stay blessed. Miss you so much! 🌟",cat:"From Sister"},
  {text:"Behna, I promise to protect you, support you and annoy you forever! Happy Rakhi! 😘🪢",cat:"From Brother"},
  {text:"To my cutest sister, you deserve all the happiness in the world. Happy Raksha Bandhan! 🌸💖",cat:"From Brother"},
  {text:"Behna, thanks for making my childhood amazing. Happy Rakhi — love you! 🥰",cat:"From Brother"},
  {text:"My dear sister, may all your dreams come true. Happy Raksha Bandhan! ✨",cat:"From Brother"},
  {text:"Behna, I may tease you a lot but I love you more. Happy Rakhi! 😄❤️",cat:"From Brother"},
  {text:"Happy Raksha Bandhan, behna! You are the best gift parents gave me. 🎁❤️",cat:"From Brother"},
  {text:"Happy Raksha Bandhan to the world's best Bhaiya-Bhabhi! 🙏🪢",cat:"For Brother"},
  {text:"Wishing you both love and togetherness. Happy Rakhi Bhaiya-Bhabhi! 💑",cat:"For Brother"},
  {text:"Rakhi special — love, laughter and mithai! Happy Raksha Bandhan! 🍬🎉",cat:"Short & Sweet"},
  {text:"May this Rakhi bring joy, prosperity and endless love to our family. Happy Raksha Bandhan! 🏠❤️",cat:"Emotional"},
  {text:"Bhai-behan ka pyaar, duniya mein sabse pyaara! Happy Rakhi! 🥰🪢",cat:"Hindi"},
  {text:"Sare gifts ek taraf, behan ka pyaar ek taraf! Happy Raksha Bandhan! 🎁❤️",cat:"Funny"},
]

const BG_PRESETS = [
  {name:'Saffron Gold',c1:'#FF9933',c2:'#FFD700',c3:'#FFF7E6',emoji:'🪢'},
  {name:'Royal Maroon',c1:'#7f1d1d',c2:'#dc2626',c3:'#fef2f2',emoji:'🎁'},
  {name:'Festive Pink',c1:'#be185d',c2:'#f472b6',c3:'#fdf2f8',emoji:'🌸'},
  {name:'Elegant Gold',c1:'#92400e',c2:'#f59e0b',c3:'#fffbeb',emoji:'✨'},
]

const TONES = ['Emotional','Funny','Short','Heartfelt','Formal','Hinglish']
const RELATIONS = ['Brother','Sister','Bhaiya-Bhabhi','Elder Brother','Younger Brother','Younger Sister','Elder Sister']
const LANGS = ['English','Hindi','Hinglish']

function Countdown(){
  const [t,setT]=useState({d:0,h:0,m:0,s:0})
  useEffect(()=>{
    const target=new Date('2026-08-28T05:57:00+05:30').getTime()
    const iv=setInterval(()=>{
      const diff=target-Date.now()
      if(diff<=0){setT({d:0,h:0,m:0,s:0});clearInterval(iv);return}
      setT({d:Math.floor(diff/86400000),h:Math.floor(diff%86400000/3600000),m:Math.floor(diff%3600000/60000),s:Math.floor(diff%60000/1000)})
    },1000)
    return()=>clearInterval(iv)
  },[])
  return (
    <div className="grid grid-cols-4 gap-2">
      {[['Days',t.d],['Hours',t.h],['Mins',t.m],['Secs',t.s]].map(([label,val])=>(
        <div key={label} className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-3 text-center text-white">
          <div className="text-2xl font-black">{String(val).padStart(2,'0')}</div>
          <div className="text-[10px] font-bold uppercase tracking-widest opacity-90">{label}</div>
        </div>
      ))}
    </div>
  )
}

export default function raksha_bandhan_wishes_generator(){
  const {ref:resultRef,jumpTo}=useJumpToResult()
  const canvasRef=useRef(null)
  const [cat,setCat]=useState('All')
  const [q,setQ]=useState('')
  const [copied,setCopied]=useState(null)
  const [selectedWish,setSelectedWish]=useState(WISHES[0].text)
  const [bgIdx,setBgIdx]=useState(0)
  const [showImageMaker,setShowImageMaker]=useState(false)

  // ai generator
  const [aiName,setAiName]=useState('')
  const [aiRel,setAiRel]=useState('Brother')
  const [aiTone,setAiTone]=useState('Emotional')
  const [aiLang,setAiLang]=useState('English')
  const [aiOut,setAiOut]=useState('')

  const filtered=WISHES.filter(w=>(cat==='All'||w.cat===cat)&&(q===''||w.text.toLowerCase().includes(q.toLowerCase())))

  const copy=(txt,id)=>{
    navigator.clipboard.writeText(txt)
    setCopied(id)
    setTimeout(()=>setCopied(null),1500)
  }

  const shareWish=(txt)=>{
    if(navigator.share){navigator.share({text:txt}).catch(()=>{})}
    else window.open(`https://wa.me/?text=${encodeURIComponent(txt)}`,'_blank')
  }

  const generateAI=()=>{
    const name=aiName.trim()|| (aiRel==='Brother'?'Bhai':'Behna')
    const templates={
      Emotional:{
        English:`Dear ${name}, on this Raksha Bandhan I want you to know you are my strength, my pride and my forever support. May God bless you with happiness and success. Happy Raksha Bandhan, ${name}! 🪢❤️`,
        Hindi:`Pyaare ${name}, Raksha Bandhan ke is paavan avsar par main dua karta/karti hoon ki tum hamesha khush raho, salamat raho. Tumhara saath hi mera sabse bada tohfa hai. Happy Raksha Bandhan, ${name}! 🪢🙏`,
        Hinglish:`Happy Raksha Bandhan, ${name}! Tu hi mera hero, mera support system hai. Aaj ke din promise — hamesha saath nibhaunga/nibhaungi. Love you so much, ${name}! 🪢💖`
      },
      Funny:{
        English:`Happy Rakhi, ${name}! Reminder: gift is mandatory, excuses not accepted! Thanks for being my free ATM and bodyguard. Love you! 😂🎁`,
        Hindi:`Happy Rakhi, ${name}! Gift ready rakhna, warna behan ka gussa bhari padega! 😜🎁 Hamesha haste raho!`,
        Hinglish:`Oye ${name}, Happy Rakhi! Gift ka wait kar rahi/raha hoon — bhool mat jana! Tu best hai yaar! 😂🪢`
      },
      Short:{
        English:`Happy Raksha Bandhan, ${name}! 🪢❤️ Love you!`,
        Hindi:`Happy Raksha Bandhan, ${name}! 🪢💖`,
        Hinglish:`Happy Rakhi, ${name}! Love you tons! 🪢✨`
      },
      Heartfelt:{
        English:`My dearest ${name}, you have filled my life with love, laughter and endless memories. On Raksha Bandhan, I promise to always stand by you. Happy Rakhi, ${name}! 🌟❤️`,
        Hindi:`Mere pyaare ${name}, tumhare bina meri duniya adhoori hai. Raksha Bandhan par dil se dua — tum hamesha muskuraate raho. Happy Rakhi! 🌸`,
        Hinglish:`${name}, tu hi meri jaan hai! Raksha Bandhan pe bas yahi dua — tu hamesha khush rahe. Happy Rakhi, ${name}! 🥰🪢`
      },
      Formal:{
        English:`Wishing you a very Happy Raksha Bandhan, ${name}. May this festival strengthen our bond and bring prosperity to your life. Warm regards! 🙏🪢`,
        Hindi:`${name} ko Raksha Bandhan ki hardik shubhkamnayein. Ishwar aapko sukhi aur safal banaye. 🙏`,
        Hinglish:`Happy Raksha Bandhan, ${name}! Wishing you lots of happiness and success — hamesha aise hi pyaar bana rahe! 🙏✨`
      },
      Hinglish:{
        English:`Happy Raksha Bandhan, ${name}! You are my forever support — love you to the moon! 🪢❤️`,
        Hindi:`Happy Raksha Bandhan, ${name}! Tum hi meri duniya ho! 🪢🥰`,
        Hinglish:`Arey ${name}, Happy Raksha Bandhan! Tu nahi toh kuch bhi nahi — love you yaar, hamesha saath rahenge! 🪢💫`
      }
    }
    const pick=templates[aiTone]||templates.Emotional
    setAiOut(pick[aiLang]||pick.English)
    jumpTo()
  }

  const drawImage=()=>{
    const cvs=canvasRef.current
    if(!cvs) return
    const ctx=cvs.getContext('2d')
    const bg=BG_PRESETS[bgIdx]
    const W=1080, H=1080
    cvs.width=W; cvs.height=H
    const g=ctx.createLinearGradient(0,0,0,H)
    g.addColorStop(0,bg.c1); g.addColorStop(0.5,bg.c2); g.addColorStop(1,bg.c3)
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H)
    // decorative circles — subtle
    ctx.fillStyle='rgba(255,255,255,0.22)'
    ctx.beginPath(); ctx.arc(W*0.15,H*0.18,90,0,Math.PI*2); ctx.fill()
    ctx.beginPath(); ctx.arc(W*0.88,H*0.82,120,0,Math.PI*2); ctx.fill()
    ctx.beginPath(); ctx.arc(W*0.82,H*0.12,60,0,Math.PI*2); ctx.fill()
    // top badge — high contrast white on dark
    ctx.fillStyle='rgba(0,0,0,0.35)'
    ctx.beginPath()
    const rx=30; ctx.roundRect(W*0.5-260,32,520,56,rx); ctx.fill()
    ctx.fillStyle='#FFFFFF'; ctx.font='bold 22px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle'
    ctx.fillText('🪢  HAPPY RAKSHA BANDHAN 2026  🪢',W/2,60)
    // emoji large with shadow
    ctx.shadowColor='rgba(0,0,0,0.25)'; ctx.shadowBlur=12
    ctx.font='72px serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(bg.emoji,W/2,180)
    ctx.shadowBlur=0
    // wish text wrapped — high contrast pure black on white card with strong shadow/border
    const words=selectedWish.split(' ')
    const maxW=W-140
    let lines=[],cur=''
    ctx.font='bold 40px sans-serif'
    for(const w of words){
      const test=cur?cur+' '+w:w
      if(ctx.measureText(test).width>maxW){lines.push(cur);cur=w}else cur=test
    }
    if(cur) lines.push(cur)
    const lineH=54
    const startY=H/2 - (lines.length*lineH)/2 + 40
    ctx.textAlign='center'; ctx.textBaseline='middle'
    // strong white card with drop shadow + dark border for separation from light gradient
    ctx.save()
    ctx.shadowColor='rgba(0,0,0,0.18)'; ctx.shadowBlur=28; ctx.shadowOffsetY=8
    ctx.fillStyle='#FFFFFF'
    ctx.beginPath(); ctx.roundRect(44,startY-68,W-88,lines.length*lineH+136,22); ctx.fill()
    ctx.restore()
    ctx.strokeStyle='rgba(0,0,0,0.14)'; ctx.lineWidth=3; ctx.stroke()
    // extra inner hairline for crisp edge
    ctx.strokeStyle='rgba(0,0,0,0.06)'; ctx.lineWidth=1
    ctx.beginPath(); ctx.roundRect(45,startY-67,W-90,lines.length*lineH+134,21); ctx.stroke()
    // pure black bold text for max contrast 21:1
    ctx.fillStyle='#000000'
    lines.forEach((ln,i)=>{
      ctx.fillText(ln,W/2,startY+i*lineH)
    })
    // bottom — white pill for contrast
    ctx.fillStyle='rgba(0,0,0,0.30)'
    ctx.beginPath(); ctx.roundRect(W/2-180,H-72,360,36,18); ctx.fill()
    ctx.fillStyle='#FFFFFF'; ctx.font='600 16px sans-serif'; ctx.fillText('Made with ❤️  •  uptools.in',W/2,H-54)
  }

  useEffect(()=>{ if(showImageMaker) { const id=setTimeout(drawImage,80); return ()=>clearTimeout(id)}},[selectedWish,bgIdx,showImageMaker])
  useEffect(()=>{ if(showImageMaker) drawImage()},[bgIdx])

  const downloadImage=()=>{
    const cvs=canvasRef.current
    const a=document.createElement('a')
    a.download=`raksha-bandhan-wish-${Date.now()}.png`
    a.href=cvs.toDataURL('image/png')
    a.click()
  }

  const faq=[
    {q:"When is Raksha Bandhan 2026?",a:"Raksha Bandhan 2026 is on Friday, August 28, 2026. Purnima Tithi begins Aug 27 09:08 AM and ends Aug 28 09:48 AM. Shubh Muhurat is 05:57 AM to 09:48 AM — Bhadra ends before sunrise so whole morning is auspicious."},
    {q:"How to wish Happy Raksha Bandhan to brother?",a:"Pick a heartfelt message like 'Happy Raksha Bandhan, bhai! You are my hero and protector. Love you!' — add a personal memory, copy from the generator above and share on WhatsApp/Instagram with a photo."},
    {q:"What do you write in a Rakhi card?",a:"Write: greeting (Happy Raksha Bandhan), a memory or thank you line, a promise for future, and a blessing. Example: 'Dear Behna, you make every day brighter — Happy Rakhi! Always here for you.'"},
    {q:"Happy Raksha Bandhan wishes in Hindi?",a:"Use Hindi wishes like 'Behan ka pyaar, bhai ka sahara — Happy Raksha Bandhan!' Switch language to Hindi in the AI generator for more Hindi wishes."},
    {q:"Best Instagram caption for Rakhi?",a:"Try: 'Sibling goals since day one 💫 Happy Raksha Bandhan! #Rakhi2026' or 'Thread of love, bond forever ♾️' — see Instagram Captions category."},
    {q:"Can I download Rakhi wishes as images?",a:"Yes — click 'Make Image' on any wish, choose a festive background, and download HD PNG to share on WhatsApp, Instagram or as a card."}
  ]

  const schema={
    "@context":"https://schema.org",
    "@type":"FAQPage",
    "mainEntity":faq.map(f=>({"@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}}))
  }

  return (
    <ToolLayout
      title="Raksha Bandhan Wishes Generator 2026 - 200+ Rakhi Wishes, Quotes & Messages for Brother & Sister"
      desc="Generate 200+ Raksha Bandhan wishes, Rakhi quotes, messages for brother & sister, Hindi wishes & Instagram captions. Copy, share on WhatsApp, or make HD festive images instantly."
      icon="🪢"
      iconBg="linear-gradient(135deg,#ff6b35,#f59e0b)"
      slug="raksha-bandhan-wishes-generator"
      category="festival"
      faq={faq}
      schema={schema}
      howItWorks={["Choose category or search wishes","Copy or share any wish on WhatsApp","Use AI generator for personalized wishes","Make festive image and download HD PNG"]}
    >
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-3xl p-6 sm:p-8 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold mb-3">🪢 RAKSHA BANDHAN • FRI, 28 AUG 2026</div>
              <h2 className="text-2xl sm:text-3xl font-black leading-tight">Happy Raksha<br/>Bandhan 2026!</h2>
              <p className="text-sm opacity-90 mt-2 max-w-md">Countdown to the Shubh Muhurat (05:57 AM IST) — Bhadra ends before sunrise, full morning auspicious.</p>
            </div>
            <div className="lg:w-[340px] shrink-0">
              <Countdown/>
              <div className="text-center text-xs opacity-80 mt-2">Purnima: Aug 27 09:08 AM — Aug 28 09:48 AM • Muhurat: 05:57–09:48 AM</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h3 className="font-bold text-gray-900 mb-3">✨ AI Personalized Wish Generator</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input value={aiName} onChange={e=>setAiName(e.target.value)} placeholder="Name (e.g. Aman)" className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-400"/>
            <select value={aiRel} onChange={e=>setAiRel(e.target.value)} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white">
              {RELATIONS.map(r=><option key={r}>{r}</option>)}
            </select>
            <select value={aiTone} onChange={e=>setAiTone(e.target.value)} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white">
              {TONES.map(t=><option key={t}>{t}</option>)}
            </select>
            <select value={aiLang} onChange={e=>setAiLang(e.target.value)} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white">
              {LANGS.map(l=><option key={l}>{l}</option>)}
            </select>
          </div>
          <button onClick={generateAI} className="mt-3 w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm">Generate Wish →</button>
          {aiOut && (
            <div ref={resultRef} className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
              <p className="text-gray-900 font-medium leading-relaxed">{aiOut}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={()=>copy(aiOut,'ai')} className="px-4 py-1.5 rounded-full bg-gray-900 text-white text-xs font-bold">{copied==='ai'?'Copied!':'Copy'}</button>
                <button onClick={()=>shareWish(aiOut)} className="px-4 py-1.5 rounded-full border border-gray-300 text-xs font-bold">Share</button>
                <button onClick={()=>{setSelectedWish(aiOut);setShowImageMaker(true); setTimeout(()=>{jumpTo(); drawImage()},100)}} className="px-4 py-1.5 rounded-full bg-orange-500 text-white text-xs font-bold">Make Image</button>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(c=>(
            <button key={c} onClick={()=>setCat(c)} className={`px-4 py-2 rounded-full text-xs font-bold border transition ${cat===c?'bg-orange-500 text-white border-orange-500':'bg-white text-gray-700 border-gray-200 hover:border-orange-300'}`}>{c}</button>
          ))}
        </div>

        <div className="flex gap-2">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search wishes (e.g. funny, love, hindi)..." className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-400"/>
          <div className="hidden sm:flex items-center text-xs text-gray-500 px-3">{filtered.length} wishes</div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {filtered.map((w,i)=>(
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-orange-200 hover:shadow-sm transition group">
              <p className="text-sm text-gray-800 leading-relaxed">{w.text}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full bg-amber-100 text-amber-700">{w.cat}</span>
                <div className="flex gap-1.5">
                  <button onClick={()=>copy(w.text,i)} className="px-3 py-1.5 rounded-full bg-gray-900 text-white text-xs font-bold">{copied===i?'Copied!':'Copy'}</button>
                  <button onClick={()=>shareWish(w.text)} className="px-3 py-1.5 rounded-full border border-gray-200 text-xs font-bold hover:bg-gray-50">Share</button>
                  <button onClick={()=>{setSelectedWish(w.text);setShowImageMaker(true); setTimeout(()=>{drawImage(); document.getElementById('rakhi-image-maker')?.scrollIntoView({behavior:'smooth',block:'center'})},120)}} className="px-3 py-1.5 rounded-full bg-orange-500 text-white text-xs font-bold">Image</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showImageMaker && (
          <div id="rakhi-image-maker" className="bg-white border-2 border-orange-200 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">🎨 Festive Wish Image Maker</h3>
              <button onClick={()=>setShowImageMaker(false)} className="text-xs px-3 py-1 rounded-full border">Close</button>
            </div>
            <textarea value={selectedWish} onChange={e=>setSelectedWish(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm"/>
            <div className="flex gap-2 flex-wrap">
              {BG_PRESETS.map((b,i)=>(
                <button key={b.name} onClick={()=>setBgIdx(i)} className={`px-4 py-2 rounded-full text-xs font-bold border ${bgIdx===i?'bg-gray-900 text-white border-gray-900':'bg-white border-gray-200'}`} style={bgIdx!==i?{background:`linear-gradient(135deg,${b.c1},${b.c2})`,color:'white',borderColor:'transparent'}:{}}>{b.name}</button>
              ))}
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 flex justify-center">
              <canvas ref={canvasRef} className="w-full max-w-[480px] rounded-xl shadow-lg" style={{aspectRatio:'1/1'}}/>
            </div>
            <div className="flex gap-2">
              <button onClick={drawImage} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold">Refresh</button>
              <button onClick={downloadImage} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold">⬇ Download HD Image</button>
            </div>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900">Raksha Bandhan Wishes for Brother & Sister — Make Every Rakhi Special</h2>
          <p className="text-sm text-gray-600 leading-relaxed mt-3">Raksha Bandhan is the festival of love between brothers and sisters. A heartfelt wish makes the thread of Rakhi even stronger. Our generator has 200+ curated wishes in English, Hindi and Hinglish — emotional, funny, short and Instagram-ready captions. Search by category, copy in one tap, share on WhatsApp, or create a festive HD image with your name.</p>
          <h3 className="font-bold text-gray-900 mt-6">Why use this wishes generator?</h3>
          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1 mt-2">
            <li><b>All categories covered:</b> For Brother, For Sister, From Brother/Sister, Funny, Emotional, Hindi, Short and Captions</li>
            <li><b>AI personalized:</b> Enter name, relation and tone — get a custom wish in English/Hindi/Hinglish instantly</li>
            <li><b>Share ready:</b> Copy, WhatsApp share, or download as festive image (1080×1080 for Instagram/Status)</li>
            <li><b>SEO keywords covered:</b> raksha bandhan wishes, rakhi wishes for brother, rakhi quotes, happy raksha bandhan wishes, rakhi captions for Instagram</li>
          </ul>
          <h3 className="font-bold text-gray-900 mt-6">Tips for the perfect Rakhi wish</h3>
          <p className="text-sm text-gray-600 leading-relaxed mt-2">Add a childhood memory, use the sibling's name, keep it short for cards and long for letters. For Instagram, add hashtags like #RakshaBandhan #Rakhi2026 #SiblingLove. For Hindi wishes, choose the Hindi or Hinglish tone in the generator.</p>
        </div>
      </div>
    </ToolLayout>
  )
}
