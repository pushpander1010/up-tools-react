import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
const CS={upper:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',lower:'abcdefghijklmnopqrstuvwxyz',numbers:'0123456789',symbols:'!@#$%^&*()_+-=[]{}|;:,.<>?'};
function gen(len,opts){let c='';if(opts.upper)c+=CS.upper;if(opts.lower)c+=CS.lower;if(opts.numbers)c+=CS.numbers;if(opts.symbols)c+=CS.symbols;if(!c)c=CS.lower;const a=new Uint32Array(len);crypto.getRandomValues(a);return Array.from(a,x=>c[x%c.length]).join('')}
function str(pw){let s=0;if(pw.length>=8)s++;if(pw.length>=12)s++;if(/[A-Z]/.test(pw)&&/[a-z]/.test(pw))s++;if(/[0-9]/.test(pw))s++;if(/[^A-Za-z0-9]/.test(pw))s++;if(pw.length>=16)s++;if(s<=2)return{l:'Weak',c:'#ef4444',w:'25%'};if(s<=3)return{l:'Fair',c:'#f59e0b',w:'50%'};if(s<=4)return{l:'Strong',c:'#22c55e',w:'75%'};return{l:'Very Strong',c:'#06b6d4',w:'100%'}}

export default function password_generator(){
  const[len,setLen]=useState(16);const[opts,setOpts]=useState({upper:true,lower:true,numbers:true,symbols:false});const[cnt,setCnt]=useState(5);const[pws,setPws]=useState([]);const[copied,setCopied]=useState(null)
  const gen2=useCallback(()=>{setPws(Array.from({length:cnt},()=>gen(len,opts)));setCopied(null)},[len,opts,cnt])
  const copy=(t,i)=>{navigator.clipboard.writeText(t);setCopied(i);setTimeout(()=>setCopied(null),1500)}
  if(!pws.length)setTimeout(gen2,0)

  return(
    <ToolLayout title="Password Generator" desc="Generate cryptographically secure passwords. Customize length, character sets. Batch generate multiple passwords."
      icon="🔐" iconBg="rgba(239,68,68,0.08)" category="security" slug="password-generator"
      faq={[{q:'Are these passwords secure?',a:'Yes. They use crypto.getRandomValues() — the same API banks use. No Math.random().'},{q:'How long should a password be?',a:'At least 12 characters for most accounts. 16+ for critical accounts like banking.'},{q:'Should I use symbols?',a:'Symbols add entropy. A 16-char password with symbols is extremely hard to brute-force.'}]}
      howItWorks={['Set the desired password length with the slider.','Toggle character sets (uppercase, lowercase, numbers, symbols).','Choose how many passwords to generate.','Click Generate and copy the one you like.']}
      schema={{"@context":"https://schema.org","@type":"SoftwareApplication","name":"Password Generator","applicationCategory":"SecurityApplication","url":"https://www.uptools.in/password-generator/","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}}}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-4">
          <div><div className="flex justify-between mb-2"><label className="text-xs text-slate-400">Length</label><span className="text-sm font-bold text-white">{len}</span></div><input type="range" min="6" max="64" value={len} onChange={e=>setLen(Number(e.target.value))} className="w-full accent-red-500"/></div>
          <div className="space-y-2">{[{k:'upper',l:'Uppercase (A-Z)'},{k:'lower',l:'Lowercase (a-z)'},{k:'numbers',l:'Numbers (0-9)'},{k:'symbols',l:'Symbols (!@#$)'}].map(o=>(<label key={o.k} className="flex items-center gap-3 py-1 cursor-pointer"><input type="checkbox" checked={opts[o.k]} onChange={()=>setOpts(p=>({...p,[o.k]:!p[o.k]}))} className="w-4 h-4 accent-red-500"/><span className="text-sm text-white">{o.l}</span></label>))}</div>
          <div><label className="text-xs text-slate-400 mb-2 block">Generate</label><div className="flex gap-2">{[1,3,5,10].map(n=><button key={n} onClick={()=>setCnt(n)} className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all border ${cnt===n?'bg-red-500/20 border-red-500/40 text-red-400':'bg-white/4 border-white/6 text-slate-400'}`}>{n}</button>)}</div></div>
          <button onClick={gen2} className="glow-btn w-full py-3 rounded-xl text-sm" style={{background:'linear-gradient(135deg,#ef4444,#dc2626)'}}>🔄 Generate</button>
        </div>
        <div className="lg:col-span-2 space-y-2">{pws.map((pw,i)=>{const s=str(pw);return(<div key={i} className="p-3 rounded-xl bg-white/3 border border-white/6"><div className="flex items-center gap-3 mb-2"><code className="flex-1 text-sm text-white font-mono break-all bg-white/4 rounded-lg px-3 py-2">{pw}</code><button onClick={()=>copy(pw,i)} className={`px-3 py-2 rounded-lg text-xs font-semibold shrink-0 ${copied===i?'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40':'bg-white/5 border border-white/8 text-slate-400 hover:text-white'}`}>{copied===i?'✓ Copied':'📋 Copy'}</button></div><div className="flex items-center gap-3"><div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden"><div className="h-full rounded-full transition-all" style={{width:s.w,background:s.c}}/></div><span className="text-[11px] font-medium" style={{color:s.c}}>{s.l}</span><span className="text-[10px] text-slate-600">{pw.length} chars</span></div></div>)})}</div>
      </div>
    </ToolLayout>
  )
}