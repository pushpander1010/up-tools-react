import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'

function calcEMI(p,r,n){if(p<=0||r<=0||n<=0)return null;const rate=r/12/100;const emi=p*rate*Math.pow(1+rate,n)/(Math.pow(1+rate,n)-1);return{emi,total:emi*n,interest:emi*n-p}}
function fmt(n){return '\u20b9'+Math.round(n).toLocaleString('en-IN')}

export default function emi_calculator(){
  const[P,setP]=useState('');const[R,setR]=useState('');const[T,setT]=useState('');const[tu,setTu]=useState('years')
  const p=parseFloat(P)||0;const r=parseFloat(R)||0;const n=tu==='years'?(parseFloat(T)||0)*12:(parseFloat(T)||0)
  const res=useMemo(()=>calcEMI(p,r,n),[p,r,n])
  const sched=useMemo(()=>{if(!res||n<=0)return[];const rate=r/12/100;let bal=p;const rows=[];for(let i=1;i<=n;i++){const ip=bal*rate;const pp=res.emi-ip;bal-=pp;rows.push({m:i,emi:res.emi,pp,ip,bal:Math.max(0,bal)})}return rows},[res,n,p,r])
  const disp=sched.length<=24?sched:[...sched.slice(0,12),null,...sched.slice(-12)]
  const pp=res?(p/res.total*100):50;const ip=res?(res.interest/res.total*100):50

  return(
    <ToolLayout title="EMI Calculator" desc="Calculate EMI for home loan, car loan, personal loan. See amortization schedule with principal vs interest breakdown."
      icon="📊" iconBg="rgba(34,197,94,0.08)" category="finance" slug="emi-calculator"
      faq={[{q:'What is EMI?',a:'Equated Monthly Installment — a fixed payment amount made by a borrower to a lender each month.'},{q:'How is EMI calculated?',a:'EMI = P × r × (1+r)^n / ((1+r)^n - 1), where P=principal, r=monthly rate, n=months.'},{q:'Should I prepay my loan?',a:'Prepaying reduces the principal, saving you interest. The higher the interest rate, the more you save.'}]}
      howItWorks={['Enter the loan principal amount.','Enter the annual interest rate.','Select tenure in years or months.','View your monthly EMI, total interest, and amortization schedule.']}
      schema={{"@context":"https://schema.org","@type":"SoftwareApplication","name":"EMI Calculator","applicationCategory":"FinanceApplication","url":"https://www.uptools.in/emi-calculator/","offers":{"@type":"Offer","price":"0","priceCurrency":"INR"}}}
    >
      <div className="space-y-4">
        <div><label className="text-xs text-slate-400 mb-2 block">Loan Amount (₹)</label><input type="number" value={P} onChange={e=>setP(e.target.value)} placeholder="2000000" className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white text-lg font-semibold outline-none focus:border-green-500/50 placeholder:text-slate-600"/></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-xs text-slate-400 mb-2 block">Rate (% p.a.)</label><input type="number" step="0.1" value={R} onChange={e=>setR(e.target.value)} placeholder="8.5" className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white text-lg font-semibold outline-none focus:border-green-500/50 placeholder:text-slate-600"/></div>
          <div><label className="text-xs text-slate-400 mb-2 block">Tenure</label><div className="flex gap-2"><input type="number" value={T} onChange={e=>setT(e.target.value)} placeholder="20" className="flex-1 bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white text-lg font-semibold outline-none placeholder:text-slate-600"/>
          <div className="flex flex-col gap-1">{['years','months'].map(u=><button key={u} onClick={()=>setTu(u)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${tu===u?'bg-green-500/20 text-green-400 border border-green-500/40':'bg-white/4 text-slate-500 border border-white/6'}`}>{u}</button>)}</div></div></div>
        </div>
        {res&&(<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 border border-emerald-500/20 text-center"><div className="text-[11px] text-slate-400">Monthly EMI</div><div className="text-xl font-extrabold gradient-text mt-1">{fmt(res.emi)}</div></div>
          <div className="p-4 rounded-2xl bg-white/3 border border-white/6 text-center"><div className="text-[11px] text-slate-400">Principal</div><div className="text-lg font-bold text-emerald-400 mt-1">{fmt(p)}</div></div>
          <div className="p-4 rounded-2xl bg-white/3 border border-white/6 text-center"><div className="text-[11px] text-slate-400">Total Interest</div><div className="text-lg font-bold text-rose-400 mt-1">{fmt(res.interest)}</div></div>
          <div className="p-4 rounded-2xl bg-white/3 border border-white/6 text-center"><div className="text-[11px] text-slate-400">Total Payment</div><div className="text-lg font-bold text-white mt-1">{fmt(res.total)}</div></div>
        </div>)}
        {res&&(<div className="p-4 rounded-2xl bg-white/3 border border-white/6">
          <div className="text-xs text-slate-400 mb-2 text-center">Principal vs Interest</div>
          <div className="w-28 h-28 mx-auto"><svg viewBox="0 0 36 36" className="w-full h-full -rotate-90"><circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3"/><circle cx="18" cy="18" r="15.9" fill="none" stroke="#22c55e" strokeWidth="3" strokeDasharray={`${pp} ${100-pp}`} strokeDashoffset="0"/><circle cx="18" cy="18" r="15.9" fill="none" stroke="#f43f5e" strokeWidth="3" strokeDasharray={`${ip} ${100-ip}`} strokeDashoffset={`${-pp}`}/></svg></div>
          <div className="flex justify-center gap-4 mt-2 text-[11px]"><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"/>Principal</span><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"/>Interest</span></div>
        </div>)}
        {disp.length>0&&(<div className="mt-4"><h3 className="text-sm font-semibold text-white mb-3">Amortization Schedule</h3><div className="overflow-x-auto"><table className="w-full text-xs"><thead><tr className="text-slate-500 border-b border-white/6"><th className="text-left py-2 px-2">Month</th><th className="text-right py-2 px-2">EMI</th><th className="text-right py-2 px-2">Principal</th><th className="text-right py-2 px-2">Interest</th><th className="text-right py-2 px-2">Balance</th></tr></thead><tbody>{disp.map((r,i)=>r===null?<tr key={i}><td colSpan={5} className="text-center py-1 text-slate-600">···</td></tr>:<tr key={i} className="border-b border-white/4"><td className="py-2 px-2 text-slate-400">{r.m}</td><td className="text-right py-2 px-2 text-white">{fmt(r.emi)}</td><td className="text-right py-2 px-2 text-emerald-400">{fmt(r.pp)}</td><td className="text-right py-2 px-2 text-rose-400">{fmt(r.ip)}</td><td className="text-right py-2 px-2 text-slate-400">{fmt(r.bal)}</td></tr>)}</tbody></table></div></div>)}
      </div>
    </ToolLayout>
  )
}