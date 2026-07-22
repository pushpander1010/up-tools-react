import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'

const NEW_SLABS = [{upTo:300000,rate:0},{upTo:700000,rate:5},{upTo:1000000,rate:10},{upTo:1200000,rate:15},{upTo:1500000,rate:20},{upTo:Infinity,rate:30}]
const OLD_SLABS = [{upTo:250000,rate:0},{upTo:500000,rate:5},{upTo:1000000,rate:20},{upTo:Infinity,rate:30}]
const STD=50000
function slabTax(inc,s){let t=0,p=0,r=inc;for(const x of s){const w=Math.min(r,x.upTo-p);if(w>0)t+=w*(x.rate/100);r-=w;p=x.upTo;if(r<=0)break}return t}
function hra(b,h,rent,m){if(!b||!h||!rent)return 0;return Math.min(h,Math.max(0,rent-.1*b),(m?.5:.4)*b)}
function fmt(n){return '\u20b9'+Math.round(n).toLocaleString('en-IN')}

export default function income_tax_tool(){
  const[I,setI]=useState('');const[sd,setSd]=useState(true);const[c80c,setC80c]=useState('');const[c80d,setC80d]=useState('');const[nps,setNps]=useState('');
  const[hraR,setHraR]=useState('');const[basic,setBasic]=useState('');const[rent,setRent]=useState('');const[metro,setMetro]=useState(false);const[hl,setHl]=useState('')
  const inc=parseFloat(I)||0
  const r=useMemo(()=>{if(inc<=0)return null;
    let nt=inc-(sd?STD:0);nt=Math.max(0,nt);let ntx=slabTax(nt,NEW_SLABS);if(nt<=700000)ntx=0;
    let ns=0;for(const b of[{o:5e6,rn:25,ro:37},{o:2e6,rn:15,ro:25},{o:1e6,rn:15,ro:15},{o:5e6,rn:10,ro:10}]){if(nt>b.o)ns=(b.rn/100)*ntx}
    const nc=(ntx+ns)*.04;const nTotal=ntx+ns+nc;
    const h=hra(parseFloat(basic)||0,parseFloat(hraR)||0,parseFloat(rent)||0,metro);
    const ded=Math.min(parseFloat(c80c)||0,150000)+(parseFloat(c80d)||0)+Math.min(parseFloat(nps)||0,50000)+h+Math.min(parseFloat(hl)||0,200000);
    let ot=inc-ded-(sd?STD:0);ot=Math.max(0,ot);let otx=slabTax(ot,OLD_SLABS);if(ot<=500000)otx=0;
    let os=0;for(const b of[{o:5e6,rn:25,ro:37},{o:2e6,rn:15,ro:25},{o:1e6,rn:15,ro:15},{o:5e6,rn:10,ro:10}]){if(ot>b.o)os=(b.ro/100)*otx}
    const oc=(otx+os)*.04;const oTotal=otx+os+oc;
    return{nt,ntx,ns,nc,nTotal,ot,otx,os,oc,oTotal,better:nTotal<=oTotal?'new':'old',save:Math.abs(nTotal-oTotal)}
  },[inc,sd,c80c,c80d,nps,hraR,basic,rent,metro,hl])

  return(
    <ToolLayout title="Income Tax Calculator India" desc="Compare old vs new income tax regime FY 2024-25. Calculate tax with 80C, 80D, HRA deductions."
      icon="🧾" iconBg="rgba(34,197,94,0.08)" category="tax" slug="income-tax-tool"
      faq={[{q:'Which regime is better?',a:'Enter your income and deductions — the calculator automatically shows which regime saves you more.'},{q:'What is standard deduction?',a:'₹50,000 flat deduction available in both old and new regimes for salaried individuals.'},{q:'What is cess?',a:'4% Health & Education cess is charged on total tax + surcharge.'}]}
      howItWorks={['Enter your annual gross income.','Toggle standard deduction (₹50,000).','Fill old regime deductions: 80C, 80D, NPS, HRA, home loan.','Compare both regimes side-by-side.','The calculator shows which regime saves you more.']}
      schema={{"@context":"https://schema.org","@type":"SoftwareApplication","name":"Income Tax Calculator India","applicationCategory":"FinanceApplication","url":"https://www.uptools.in/income-tax-tool/","offers":{"@type":"Offer","price":"0","priceCurrency":"INR"}}}
    >
      <div className="space-y-4">
        <div><label className="text-xs font-medium text-slate-400 mb-2 block">Annual Income (₹)</label>
          <input type="number" value={I} onChange={e=>setI(e.target.value)} placeholder="e.g. 1200000" className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white text-lg font-semibold outline-none focus:border-green-500/50 placeholder:text-slate-600"/></div>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={sd} onChange={e=>setSd(e.target.checked)} className="w-4 h-4 accent-green-500"/><span className="text-sm text-white">Standard Deduction (₹50,000)</span></label>
        <div className="p-5 rounded-2xl bg-white/3 border border-white/6">
          <h3 className="text-sm font-semibold text-green-400 mb-3">Old Regime Deductions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[{l:'80C (max ₹1.5L)',v:c80c,s:setC80c},{l:'80D (Health)',v:c80d,s:setC80d},{l:'NPS (max ₹50K)',v:nps,s:setNps},{l:'Home Loan Int',v:hl,s:setHl}].map(f=>(
              <div key={f.l}><label className="text-[11px] text-slate-500 mb-1 block">{f.l}</label>
              <input type="number" value={f.v} onChange={e=>f.s(e.target.value)} placeholder="0" className="w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-white text-sm outline-none"/></div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-white/6">
            <h4 className="text-xs text-slate-400 mb-2">HRA Exemption</h4>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="text-[11px] text-slate-500 block">Basic</label><input type="number" value={basic} onChange={e=>setBasic(e.target.value)} placeholder="0" className="w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-white text-sm outline-none"/></div>
              <div><label className="text-[11px] text-slate-500 block">HRA Recv</label><input type="number" value={hraR} onChange={e=>setHraR(e.target.value)} placeholder="0" className="w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-white text-sm outline-none"/></div>
              <div><label className="text-[11px] text-slate-500 block">Rent</label><input type="number" value={rent} onChange={e=>setRent(e.target.value)} placeholder="0" className="w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-white text-sm outline-none"/></div>
            </div>
            <label className="flex items-center gap-2 mt-2 cursor-pointer"><input type="checkbox" checked={metro} onChange={e=>setMetro(e.target.checked)} className="w-3.5 h-3.5 accent-purple-500"/><span className="text-xs text-slate-400">Metro city</span></label>
          </div>
        </div>
        {r&&(<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="p-5 rounded-2xl bg-brand/5 border border-brand/15">
            <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-semibold text-brand-light">New Regime</h3>{r.better==='new'&&<span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">BETTER</span>}</div>
            <div className="space-y-1.5 text-sm"><div className="flex justify-between"><span className="text-slate-400">Taxable</span><span className="text-white">{fmt(r.nt)}</span></div><div className="flex justify-between"><span className="text-slate-400">Tax</span><span className="text-white">{fmt(r.ntx)}</span></div><div className="flex justify-between"><span className="text-slate-400">Surcharge</span><span className="text-white">{fmt(r.ns)}</span></div><div className="flex justify-between"><span className="text-slate-400">Cess 4%</span><span className="text-white">{fmt(r.nc)}</span></div><div className="flex justify-between font-bold pt-2 border-t border-white/6"><span>Total</span><span className="text-brand-light">{fmt(r.nTotal)}</span></div></div>
          </div>
          <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/15">
            <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-semibold text-emerald-400">Old Regime</h3>{r.better==='old'&&<span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">BETTER</span>}</div>
            <div className="space-y-1.5 text-sm"><div className="flex justify-between"><span className="text-slate-400">Taxable</span><span className="text-white">{fmt(r.ot)}</span></div><div className="flex justify-between"><span className="text-slate-400">Tax</span><span className="text-white">{fmt(r.otx)}</span></div><div className="flex justify-between"><span className="text-slate-400">Surcharge</span><span className="text-white">{fmt(r.os)}</span></div><div className="flex justify-between"><span className="text-slate-400">Cess 4%</span><span className="text-white">{fmt(r.oc)}</span></div><div className="flex justify-between font-bold pt-2 border-t border-white/6"><span>Total</span><span className="text-emerald-400">{fmt(r.oTotal)}</span></div></div>
          </div>
          <div className="sm:col-span-2 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-brand/10 border border-emerald-500/20 text-center"><div className="text-xs text-slate-400">You save with</div><div className="text-xl font-extrabold gradient-text">{r.better==='new'?'New Regime':'Old Regime'}</div><div className="text-emerald-400 font-bold">{fmt(r.save)}</div></div>
        </div>)}
      </div>
    </ToolLayout>
  )
}