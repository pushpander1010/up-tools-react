import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'

function calcAge(dob){if(!dob)return null;const b=new Date(dob),t=new Date();let y=t.getFullYear()-b.getFullYear(),m=t.getMonth()-b.getMonth(),d=t.getDate()-b.getDate();if(d<0){m--;d+=new Date(t.getFullYear(),t.getMonth(),0).getDate()}if(m<0){y--;m+=12}return{years:y,months:m,days:d,total:Math.floor((t-b)/864e5)}}
function zodiac(m,d){const s=[[1,20,'Capricorn','♑'],[2,19,'Aquarius','♒'],[3,21,'Pisces','♓'],[4,20,'Aries','♈'],[5,21,'Taurus','♉'],[6,21,'Gemini','♊'],[7,23,'Cancer','♋'],[8,23,'Leo','♌'],[9,23,'Virgo','♍'],[10,23,'Libra','♎'],[11,22,'Scorpio','♏'],[12,22,'Sagittarius','♐'],[12,32,'Capricorn','♑']];for(const[x,y,n,sy]of s)if(m===x&&d<=y)return{n,sy};return{n:'Capricorn',sy:'♑'}}

export default function age_calculator(){
  const[dob,setDob]=useState('');const age=useMemo(()=>calcAge(dob),[dob]);const z=dob?zodiac(new Date(dob).getMonth()+1,new Date(dob).getDate()):null
  const nextBday=dob?(()=>{const b=new Date(dob),t=new Date();let n=new Date(t.getFullYear(),b.getMonth(),b.getDate());if(n<=t)n.setFullYear(n.getFullYear());return Math.ceil((n-t)/864e5)})():null

  return(
    <ToolLayout title="Age Calculator" desc="Calculate your exact age in years, months, days. Find your zodiac sign and next birthday countdown."
      icon="🎂" iconBg="rgba(99,102,241,0.08)" category="text" slug="age-calculator"
      faq={[{q:'How is age calculated?',a:'From your date of birth to today, accounting for varying month lengths and leap years.'},{q:'What is a zodiac sign?',a:'Based on your birth date, assigned to one of 12 astrological signs.'}]}
      howItWorks={['Select your date of birth from the date picker.','View your exact age in years, months, and days.','Check your zodiac sign.','See how many days until your next birthday.']}
      schema={{"@context":"https://schema.org","@type":"SoftwareApplication","name":"Age Calculator","applicationCategory":"UtilitiesApplication","url":"https://www.uptools.in/age-calculator/","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}}}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><label className="text-xs text-slate-400 mb-2 block">Date of Birth</label><input type="date" value={dob} onChange={e=>setDob(e.target.value)} className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white text-lg font-semibold outline-none focus:border-brand/50"/>
        {age&&<div className="grid grid-cols-3 gap-3 mt-4">{[{v:age.years,l:'Years'},{v:age.months,l:'Months'},{v:age.days,l:'Days'}].map(x=>(<div key={x.l} className="p-4 rounded-2xl bg-white/3 border border-white/6 text-center"><div className="text-3xl font-extrabold gradient-text">{x.v}</div><div className="text-xs text-slate-500 mt-1">{x.l}</div></div>))}</div>}</div>
        <div className="space-y-3">{z&&<div className="p-5 rounded-2xl bg-white/3 border border-white/6 text-center"><div className="text-4xl mb-2">{z.sy}</div><div className="text-lg font-bold text-white">{z.n}</div><div className="text-xs text-slate-500">Zodiac Sign</div></div>}
        {nextBday!=null&&<div className="p-5 rounded-2xl bg-white/3 border border-white/6 text-center"><div className="text-3xl font-extrabold text-emerald-400">{nextBday}</div><div className="text-xs text-slate-500 mt-1">days until next birthday</div></div>}
        {age&&<div className="p-5 rounded-2xl bg-white/3 border border-white/6"><div className="text-xs text-slate-500 mb-1">Total Days Lived</div><div className="text-lg font-bold text-white">{age.total.toLocaleString()}</div></div>}</div>
      </div>
    </ToolLayout>
  )
}