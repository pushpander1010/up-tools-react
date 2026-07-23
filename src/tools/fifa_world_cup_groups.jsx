import { useState } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const GROUPS = [
  { name:'A', matches:['🇲🇽 Mexico 2-0 🇿🇦 South Africa','🇰🇷 South Korea 2-1 🇨🇿 Czech Republic'],
    teams:[{n:'Mexico',f:'🇲🇽',p:1,w:1,d:0,l:0,gf:2,ga:0,gd:2,pts:3},{n:'South Korea',f:'🇰🇷',p:1,w:1,d:0,l:0,gf:2,ga:1,gd:1,pts:3},{n:'Czech Republic',f:'🇨🇿',p:1,w:0,d:0,l:1,gf:1,ga:2,gd:-1,pts:0},{n:'South Africa',f:'🇿🇦',p:1,w:0,d:0,l:1,gf:0,ga:2,gd:-2,pts:0}] },
  { name:'B', matches:['🇨🇦 Canada 1-1 🇧🇦 Bosnia','🇶🇦 Qatar 1-1 🇨🇭 Switzerland'],
    teams:[{n:'Canada',f:'🇨🇦',p:1,w:0,d:1,l:0,gf:1,ga:1,gd:0,pts:1},{n:'Bosnia',f:'🇧🇦',p:1,w:0,d:1,l:0,gf:1,ga:1,gd:0,pts:1},{n:'Qatar',f:'🇶🇦',p:1,w:0,d:1,l:0,gf:1,ga:1,gd:0,pts:1},{n:'Switzerland',f:'🇨🇭',p:1,w:0,d:1,l:0,gf:1,ga:1,gd:0,pts:1}] },
  { name:'C', matches:['🇧🇷 Brazil 1-1 🇲🇦 Morocco','🇭🇹 Haiti 0-1 🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scotland'],
    teams:[{n:'Scotland',f:'🏴󠁧󠁢󠁳󠁣󠁴󠁿',p:1,w:1,d:0,l:0,gf:1,ga:0,gd:1,pts:3},{n:'Brazil',f:'🇧🇷',p:1,w:0,d:1,l:0,gf:1,ga:1,gd:0,pts:1},{n:'Morocco',f:'🇲🇦',p:1,w:0,d:1,l:0,gf:1,ga:1,gd:0,pts:1},{n:'Haiti',f:'🇭🇹',p:1,w:0,d:0,l:1,gf:0,ga:1,gd:-1,pts:0}] },
  { name:'D', matches:['🇺🇸 USA 4-1 🇵🇾 Paraguay','🇦🇺 Australia 2-0 🇹🇷 Turkey'],
    teams:[{n:'USA',f:'🇺🇸',p:1,w:1,d:0,l:0,gf:4,ga:1,gd:3,pts:3},{n:'Australia',f:'🇦🇺',p:1,w:1,d:0,l:0,gf:2,ga:0,gd:2,pts:3},{n:'Turkey',f:'🇹🇷',p:1,w:0,d:0,l:1,gf:0,ga:2,gd:-2,pts:0},{n:'Paraguay',f:'🇵🇾',p:1,w:0,d:0,l:1,gf:1,ga:4,gd:-3,pts:0}] },
  { name:'E', matches:['🇩🇪 Germany 7-1 🇨🇼 Curacao','🇨🇮 Ivory Coast vs 🇳🇴 Norway'],
    teams:[{n:'Germany',f:'🇩🇪',p:1,w:1,d:0,l:0,gf:7,ga:1,gd:6,pts:3},{n:'Ivory Coast',f:'🇨🇮',p:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0},{n:'Norway',f:'🇳🇴',p:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0},{n:'Curacao',f:'🇨🇼',p:1,w:0,d:0,l:1,gf:1,ga:7,gd:-6,pts:0}] },
  { name:'F', matches:['🇳🇱 Netherlands 1-1 🇯🇵 Japan','🇸🇪 Sweden vs 🇹🇳 Tunisia'],
    teams:[{n:'Netherlands',f:'🇳🇱',p:1,w:0,d:1,l:0,gf:1,ga:1,gd:0,pts:1},{n:'Japan',f:'🇯🇵',p:1,w:0,d:1,l:0,gf:1,ga:1,gd:0,pts:1},{n:'Sweden',f:'🇸🇪',p:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0},{n:'Tunisia',f:'🇹🇳',p:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0}] },
  { name:'G', matches:['🇧🇪 Belgium vs 🇮🇷 Iran','🇳🇿 New Zealand vs 🇪🇬 Egypt'],
    teams:[{n:'Belgium',f:'🇧🇪',p:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0},{n:'Iran',f:'🇮🇷',p:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0},{n:'New Zealand',f:'🇳🇿',p:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0},{n:'Egypt',f:'🇪🇬',p:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0}] },
  { name:'H', matches:['🇦🇷 Argentina vs 🇭🇷 Croatia','🇨🇩 DR Congo vs 🇯🇲 Jamaica'],
    teams:[{n:'Argentina',f:'🇦🇷',p:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0},{n:'Croatia',f:'🇭🇷',p:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0},{n:'DR Congo',f:'🇨🇩',p:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0},{n:'Jamaica',f:'🇯🇲',p:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0}] },
  { name:'I', matches:['🇮🇹 Italy vs 🇨🇲 Cameroon','🇵🇪 Peru vs 🇺🇦 Ukraine'],
    teams:[{n:'Italy',f:'🇮🇹',p:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0},{n:'Cameroon',f:'🇨🇲',p:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0},{n:'Peru',f:'🇵🇪',p:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0},{n:'Ukraine',f:'🇺🇦',p:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0}] },
  { name:'J', matches:['🇵🇹 Portugal vs 🇨🇴 Colombia','🇺🇾 Uruguay vs 🇸🇳 Senegal'],
    teams:[{n:'Portugal',f:'🇵🇹',p:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0},{n:'Colombia',f:'🇨🇴',p:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0},{n:'Uruguay',f:'🇺🇾',p:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0},{n:'Senegal',f:'🇸🇳',p:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0}] },
  { name:'K', matches:['🇫🇷 France vs 🇩🇿 Algeria','🇧🇷 Ecuador vs 🇳🇬 Nigeria'],
    teams:[{n:'France',f:'🇫🇷',p:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0},{n:'Algeria',f:'🇩🇿',p:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0},{n:'Ecuador',f:'🇪🇨',p:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0},{n:'Nigeria',f:'🇳🇬',p:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0}] },
  { name:'L', matches:['🏴󠁧󠁢󠁥󠁮󠁧󠁿 England vs 🇮🇶 Iraq','🇪🇸 Spain vs 🇸🇦 Saudi Arabia'],
    teams:[{n:'England',f:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',p:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0},{n:'Iraq',f:'🇮🇶',p:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0},{n:'Spain',f:'🇪🇸',p:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0},{n:'Saudi Arabia',f:'🇸🇦',p:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0}] },
]

export default function fifa_world_cup_groups() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [activeGroup, setActiveGroup] = useState('A')

  const group = GROUPS.find(g => g.name === activeGroup)

  return (
    <ToolLayout
      title="FIFA World Cup 2026 Groups & Standings"
      desc="Complete group stage table for all 12 groups with live points, goals, goal difference, and match results."
      icon="📊" iconBg="rgba(59,130,246,0.08)"
      category="fifa" slug="fifa-world-cup-groups"
      faq={[
        { q: "How many groups are there?", a: "12 groups (A-L) of 4 teams each, featuring all 48 qualified nations." },
        { q: "How many teams advance from each group?", a: "The top 2 from each group plus 8 best third-placed teams advance to the Round of 32." },
      ]}
      howItWorks={[
        "Click a group letter to view its standings and match results.",
        "Standings show matches played, wins, draws, losses, goals for/against, goal difference, and points.",
        "All 12 groups with 48 teams are covered.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "WebApplication",
        name: "FIFA World Cup 2026 Groups & Standings",
        url: "https://www.uptools.in/fifa-world-cup-groups/",
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6" ref={resultRef}>
        {/* Group tabs */}
        <div className="flex flex-wrap gap-1.5">
          {GROUPS.map(g => (
            <button key={g.name} onClick={() => { setActiveGroup(g.name); jumpTo() }}
              className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${activeGroup === g.name ? 'bg-indigo-500 text-white' : 'bg-white/[0.06] border border-white/8 text-slate-500 hover:text-white'}`}>
              {g.name}
            </button>
          ))}
        </div>

        {group && (
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] overflow-hidden">
            {/* Group header */}
            <div className="px-5 py-3 border-b border-white/8 bg-white/[0.03]">
              <h3 className="text-sm font-bold text-white">Group {group.name}</h3>
            </div>

            {/* Match results */}
            <div className="px-5 py-3 border-b border-white/5 space-y-1">
              {group.matches.map((m, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span className="text-slate-300">{m}</span>
                  <span className="text-slate-600 font-medium">FT</span>
                </div>
              ))}
            </div>

            {/* Standings table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-3 py-2 text-left text-[10px] text-slate-500 font-bold">#</th>
                    <th className="px-3 py-2 text-left text-[10px] text-slate-500 font-bold">Team</th>
                    <th className="px-2 py-2 text-center text-[10px] text-slate-500 font-bold">P</th>
                    <th className="px-2 py-2 text-center text-[10px] text-slate-500 font-bold">W</th>
                    <th className="px-2 py-2 text-center text-[10px] text-slate-500 font-bold">D</th>
                    <th className="px-2 py-2 text-center text-[10px] text-slate-500 font-bold">L</th>
                    <th className="px-2 py-2 text-center text-[10px] text-slate-500 font-bold">GF</th>
                    <th className="px-2 py-2 text-center text-[10px] text-slate-500 font-bold">GA</th>
                    <th className="px-2 py-2 text-center text-[10px] text-slate-500 font-bold">GD</th>
                    <th className="px-2 py-2 text-center text-[10px] text-slate-500 font-bold">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {group.teams.map((t, i) => (
                    <tr key={i} className={`border-b border-white/5 ${i < 2 ? 'bg-emerald-500/5' : ''}`}>
                      <td className="px-3 py-2 text-slate-500 font-medium">{i + 1}</td>
                      <td className="px-3 py-2 text-white font-semibold">{t.f} {t.n}</td>
                      <td className="px-2 py-2 text-center text-slate-400">{t.p}</td>
                      <td className="px-2 py-2 text-center text-slate-400">{t.w}</td>
                      <td className="px-2 py-2 text-center text-slate-400">{t.d}</td>
                      <td className="px-2 py-2 text-center text-slate-400">{t.l}</td>
                      <td className="px-2 py-2 text-center text-slate-400">{t.gf}</td>
                      <td className="px-2 py-2 text-center text-slate-400">{t.ga}</td>
                      <td className="px-2 py-2 text-center text-slate-400">{t.gd > 0 ? '+' : ''}{t.gd}</td>
                      <td className="px-2 py-2 text-center text-white font-bold">{t.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
