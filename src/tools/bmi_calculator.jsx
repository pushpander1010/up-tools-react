import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
function calcBMI(w,h,u){if(u==='imperial'){w*=0.453592;h*=2.54}h/=100;if(w<=0||h<=0)return null;const b=w/(h*h);let cat,col;if(b<18.5){cat='Underweight';col='#0ea5e9'}else if(b<25){cat='Normal';col='#22c55e'}else if(b<30){cat='Overweight';col='#f59e0b'}else{cat='Obese';col='#ef4444'}return{bmi:b.toFixed(1),cat,col}}

export default function bmi_calculator(){
  const[w,setW]=useState('');const[h,setH]=useState('');const[u,setU]=useState('metric')
  const r=useMemo(()=>calcBMI(parseFloat(w),parseFloat(h),u),[w,h,u])

  return(
    <ToolLayout title="BMI Calculator" desc="Calculate your Body Mass Index instantly. Supports metric (kg/cm) and imperial (lbs/inches) units."
      icon="⚖️" iconBg="rgba(20,184,166,0.08)" category="health" slug="bmi-calculator"
      faq={[{q:'What is BMI?',a:'Body Mass Index — a measure of body fat based on height and weight.'},{q:'What is a healthy BMI?',a:'18.5 to 24.9 is considered normal weight.'},{q:'Is BMI accurate?',a:'BMI is a screening tool, not a diagnostic. It does not account for muscle mass, bone density, or body composition.'}]}
      howItWorks={['Choose metric or imperial units.','Enter your weight.','Enter your height.','View your BMI value, category, and visual scale.']}
      schema={{"@context":"https://schema.org","@type":"SoftwareApplication","name":"BMI Calculator","applicationCategory":"HealthApplication","url":"https://www.uptools.in/bmi-calculator/","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}}}
    >
      <div className="space-y-4">
        <div className="flex gap-2">{['metric','imperial'].map(x=>(<button key={x} onClick={()=>setU(x)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${u===x?'bg-teal-500/20 border-teal-500/40 text-teal-400':'bg-white/4 border-white/6 text-slate-400'}`}>{x==='metric'?'Metric (kg/cm)':'Imperial (lbs/in)'}</button>))}</div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-xs text-slate-400 mb-2 block">Weight ({u==='metric'?'kg':'lbs'})</label><input type="number" value={w} onChange={e=>setW(e.target.value)} placeholder="0" className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white text-lg font-semibold outline-none focus:border-teal-500/50 placeholder:text-slate-600"/></div>
          <div><label className="text-xs text-slate-400 mb-2 block">Height ({u==='metric'?'cm':'inches'})</label><input type="number" value={h} onChange={e=>setH(e.target.value)} placeholder="0" className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white text-lg font-semibold outline-none focus:border-teal-500/50 placeholder:text-slate-600"/></div>
        </div>
        {r&&<div className="p-6 rounded-2xl bg-white/3 border border-white/6 text-center">
          <div className="text-5xl font-extrabold" style={{color:r.col}}>{r.bmi}</div>
          <div className="text-sm font-bold mt-1" style={{color:r.col}}>{r.cat}</div>
          <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden mt-4"><div className="h-full rounded-full transition-all duration-500" style={{width:`${Math.min((parseFloat(r.bmi)/40)*100,100)}%`,background:r.col}}/></div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-2"><span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span></div>
        </div>}
      </div>
    </ToolLayout>
  )
}