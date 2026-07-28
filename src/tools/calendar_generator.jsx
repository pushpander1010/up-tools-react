import { useState, useRef, useCallback, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function renderMonth(y, m, sd) {
  const first = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const daysInPrev = new Date(y, m, 0).getDate();
  const today = new Date();
  const isToday = (d) => today.getFullYear() === y && today.getMonth() === m && today.getDate() === d;
  const order = [];
  for (let i = 0; i < 7; i++) order.push((sd + i) % 7);
  const startOffset = (first - sd + 7) % 7;
  let day = 1;
  let nextMonth = 1;
  const cells = [];
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 7; j++) {
      const idx = i * 7 + j;
      let d, isOther = false;
      if (idx < startOffset) { d = daysInPrev - startOffset + idx + 1; isOther = true; }
      else if (day <= daysInMonth) { d = day; day++; }
      else { d = nextMonth; nextMonth++; isOther = true; }
      const dow = order[j];
      cells.push({ d, isOther, isWeekend: dow === 0 || dow === 6, isToday: !isOther && isToday(d) });
    }
  }
  return { cells, order, title: MONTHS[m] + ' ' + y };
}

export default function calendar_generator() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [startDay, setStartDay] = useState(1);
  const [view, setView] = useState('month');
  const calRef = useRef(null);

  const months = useMemo(() => {
    if (view === 'year') {
      return Array.from({ length: 12 }, (_, i) => renderMonth(year, i, startDay));
    }
    return [renderMonth(year, month, startDay)];
  }, [year, month, startDay, view]);

  const downloadPNG = useCallback(() => {
    const el = calRef.current;
    if (!el) return;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" style="background:#111827;color:#e2e8f0;font-family:Inter,sans-serif;padding:16px">${el.innerHTML.replace(/class="/g, 'style="background:#111827;color:#e2e8f0;font-family:Inter,sans-serif" class="')}</div></foreignObject></svg>`;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = `calendar-${MONTHS[month]}-${year}.svg`;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  }, [year, month]);

  return (
    <ToolLayout
      title="Calendar Generator"
      desc="Generate printable monthly or yearly calendars. Customize year, month, start day, weekend highlighting."
      icon="📅" iconBg="rgba(99,102,241,0.08)"
      category="tools" slug="calendar-generator"
    >
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Year</label>
              <input type="number" min="1900" max="2100" className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                value={year} onChange={e => setYear(+e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Month</label>
              <select className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                value={month} onChange={e => setMonth(+e.target.value)}>
                {MONTHS.map((name, i) => <option key={i} value={i}>{name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Week Starts On</label>
              <select className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                value={startDay} onChange={e => setStartDay(+e.target.value)}>
                <option value={0}>Sunday</option>
                <option value={1}>Monday</option>
                <option value={6}>Saturday</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">View</label>
              <select className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                value={view} onChange={e => setView(e.target.value)}>
                <option value="month">Monthly</option>
                <option value="year">Yearly</option>
              </select>
            </div>
          </div>

          <div ref={calRef} className="mt-4">
            <div className={view === 'year' ? 'grid grid-cols-2 sm:grid-cols-3 gap-4' : ''}>
              {months.map((m, mi) => (
                <div key={mi}>
                  <div className="text-center text-sm font-bold text-slate-200 mb-2">{m.title}</div>
                  <div className="grid grid-cols-7 gap-0.5">
                    {m.order.map((d, i) => (
                      <div key={`h${i}`} className="text-center text-[11px] font-semibold py-1.5 text-indigo-400 bg-indigo-500/10 rounded">
                        {DAYS[d]}
                      </div>
                    ))}
                    {m.cells.map((cell, i) => {
                      let cls = 'text-center text-xs py-2 rounded bg-white/[0.04]';
                      if (cell.isOther) cls += ' opacity-30';
                      if (cell.isWeekend) cls += ' text-red-400';
                      if (cell.isToday) cls += ' bg-indigo-500/20 border border-indigo-500 font-bold text-white';
                      return <div key={i} className={cls}>{cell.d}</div>;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button onClick={downloadPNG} className="glow-btn text-xs px-4 py-2 rounded-xl">⬇️ Download SVG</button>
            <button onClick={() => window.print()} className="bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-xs px-4 py-2 rounded-xl text-slate-300 transition-all">🖨️ Print</button>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
