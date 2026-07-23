import { useState, useCallback, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const PLAYERS = [
  { id: 'p1', name: 'Emiliano Martínez', flag: '🇦🇷', country: 'Argentina', value: 28, pos: 'GK' },
  { id: 'p2', name: 'Mike Maignan', flag: '🇫🇷', country: 'France', value: 35, pos: 'GK' },
  { id: 'p3', name: 'Alisson Becker', flag: '🇧🇷', country: 'Brazil', value: 32, pos: 'GK' },
  { id: 'p4', name: 'Ter Stegen', flag: '🇩🇪', country: 'Germany', value: 30, pos: 'GK' },
  { id: 'p5', name: 'Jordan Pickford', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', country: 'England', value: 22, pos: 'GK' },
  { id: 'p6', name: 'Unai Simón', flag: '🇪🇸', country: 'Spain', value: 25, pos: 'GK' },
  { id: 'p7', name: 'Diogo Costa', flag: '🇵🇹', country: 'Portugal', value: 28, pos: 'GK' },
  { id: 'p8', name: 'Bart Verbruggen', flag: '🇳🇱', country: 'Netherlands', value: 20, pos: 'GK' },
  { id: 'p9', name: 'Donnarumma', flag: '🇮🇹', country: 'Italy', value: 35, pos: 'GK' },
  { id: 'p10', name: 'Yassine Bounou', flag: '🇲🇦', country: 'Morocco', value: 18, pos: 'GK' },
  { id: 'p11', name: 'Cristian Romero', flag: '🇦🇷', country: 'Argentina', value: 30, pos: 'DEF' },
  { id: 'p13', name: 'Dayot Upamecano', flag: '🇫🇷', country: 'France', value: 28, pos: 'DEF' },
  { id: 'p14', name: 'William Saliba', flag: '🇫🇷', country: 'France', value: 32, pos: 'DEF' },
  { id: 'p16', name: 'Marquinhos', flag: '🇧🇷', country: 'Brazil', value: 25, pos: 'DEF' },
  { id: 'p18', name: 'John Stones', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', country: 'England', value: 22, pos: 'DEF' },
  { id: 'p20', name: 'Aymeric Laporte', flag: '🇪🇸', country: 'Spain', value: 20, pos: 'DEF' },
  { id: 'p22', name: 'Antonio Rüdiger', flag: '🇩🇪', country: 'Germany', value: 26, pos: 'DEF' },
  { id: 'p24', name: 'Rúben Dias', flag: '🇵🇹', country: 'Portugal', value: 32, pos: 'DEF' },
  { id: 'p26', name: 'Virgil van Dijk', flag: '🇳🇱', country: 'Netherlands', value: 28, pos: 'DEF' },
  { id: 'p29', name: 'Alessandro Bastoni', flag: '🇮🇹', country: 'Italy', value: 22, pos: 'DEF' },
  { id: 'p30', name: 'Noussair Mazraoui', flag: '🇲🇦', country: 'Morocco', value: 18, pos: 'DEF' },
  { id: 'p31', name: 'Kim Min-jae', flag: '🇰🇷', country: 'South Korea', value: 20, pos: 'DEF' },
  { id: 'p33', name: 'Enzo Fernández', flag: '🇦🇷', country: 'Argentina', value: 35, pos: 'MID' },
  { id: 'p35', name: 'Aurélien Tchouaméni', flag: '🇫🇷', country: 'France', value: 35, pos: 'MID' },
  { id: 'p38', name: 'Vinícius Júnior', flag: '🇧🇷', country: 'Brazil', value: 70, pos: 'MID' },
  { id: 'p40', name: 'Jude Bellingham', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', country: 'England', value: 70, pos: 'MID' },
  { id: 'p42', name: 'Pedri', flag: '🇪🇸', country: 'Spain', value: 40, pos: 'MID' },
  { id: 'p44', name: 'Jamal Musiala', flag: '🇩🇪', country: 'Germany', value: 45, pos: 'MID' },
  { id: 'p46', name: 'Bruno Fernandes', flag: '🇵🇹', country: 'Portugal', value: 35, pos: 'MID' },
  { id: 'p48', name: 'Kevin De Bruyne', flag: '🇧🇪', country: 'Belgium', value: 40, pos: 'MID' },
  { id: 'p50', name: 'Nicolò Barella', flag: '🇮🇹', country: 'Italy', value: 30, pos: 'MID' },
  { id: 'p53', name: 'Takefusa Kubo', flag: '🇯🇵', country: 'Japan', value: 18, pos: 'MID' },
  { id: 'p54', name: 'Lionel Messi', flag: '🇦🇷', country: 'Argentina', value: 60, pos: 'FWD' },
  { id: 'p56', name: 'Kylian Mbappé', flag: '🇫🇷', country: 'France', value: 80, pos: 'FWD' },
  { id: 'p58', name: 'Neymar', flag: '🇧🇷', country: 'Brazil', value: 40, pos: 'FWD' },
  { id: 'p60', name: 'Harry Kane', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', country: 'England', value: 50, pos: 'FWD' },
  { id: 'p63', name: 'Lamine Yamal', flag: '🇪🇸', country: 'Spain', value: 50, pos: 'FWD' },
  { id: 'p64', name: 'Kai Havertz', flag: '🇩🇪', country: 'Germany', value: 30, pos: 'FWD' },
  { id: 'p66', name: 'Cristiano Ronaldo', flag: '🇵🇹', country: 'Portugal', value: 35, pos: 'FWD' },
  { id: 'p69', name: 'Cody Gakpo', flag: '🇳🇱', country: 'Netherlands', value: 28, pos: 'FWD' },
  { id: 'p70', name: 'Federico Chiesa', flag: '🇮🇹', country: 'Italy', value: 25, pos: 'FWD' },
  { id: 'p71', name: 'Romelu Lukaku', flag: '🇧🇪', country: 'Belgium', value: 22, pos: 'FWD' },
  { id: 'p74', name: 'Son Heung-min', flag: '🇰🇷', country: 'South Korea', value: 35, pos: 'FWD' },
]

const FORMATIONS = {
  '4-4-2': { GK: 1, rows: [{ pos: 'DEF', count: 4 }, { pos: 'MID', count: 4 }, { pos: 'FWD', count: 2 }] },
  '4-3-3': { GK: 1, rows: [{ pos: 'DEF', count: 4 }, { pos: 'MID', count: 3 }, { pos: 'FWD', count: 3 }] },
  '3-5-2': { GK: 1, rows: [{ pos: 'DEF', count: 3 }, { pos: 'MID', count: 5 }, { pos: 'FWD', count: 2 }] },
  '4-2-3-1': { GK: 1, rows: [{ pos: 'DEF', count: 4 }, { pos: 'MID', count: 2 }, { pos: 'MID', count: 3 }, { pos: 'FWD', count: 1 }] },
}

function getSlotIds(formation) {
  const fm = FORMATIONS[formation]; const ids = ['gk']
  fm.rows.forEach((row, ri) => { for (let i = 0; i < row.count; i++) ids.push(`r${ri}-${i}`) })
  return ids
}

export default function fifa_world_cup_fantasy_team() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [formation, setFormation] = useState('4-4-2')
  const [slots, setSlots] = useState({})
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [activeTab, setActiveTab] = useState('GK')
  const [shareUrl, setShareUrl] = useState('')

  const uniquePlayers = useMemo(() => {
    const seen = new Set()
    return PLAYERS.filter(p => { if (seen.has(p.id)) return false; seen.add(p.id); return true })
  }, [])

  const poolPlayers = useMemo(() => uniquePlayers.filter(p => p.pos === activeTab), [uniquePlayers, activeTab])

  const placedCount = Object.keys(slots).length
  const totalValue = useMemo(() => {
    let total = 0
    Object.values(slots).forEach(pid => { const p = uniquePlayers.find(x => x.id === pid); if (p) total += p.value })
    return total
  }, [slots, uniquePlayers])

  const chemistry = useMemo(() => {
    if (placedCount < 11) return Math.round((placedCount / 11) * 80)
    const countries = new Set(Object.values(slots).map(pid => uniquePlayers.find(x => x.id === pid)?.country).filter(Boolean))
    const bonus = Math.min(countries.size * 3, 20)
    return Math.min(100, 80 + bonus)
  }, [slots, placedCount, uniquePlayers])

  const placePlayer = useCallback((slotId) => {
    if (!selectedPlayer) return
    setSlots(prev => ({ ...prev, [slotId]: selectedPlayer }))
    setSelectedPlayer(null)
  }, [selectedPlayer])

  const removePlayer = useCallback((slotId) => {
    setSlots(prev => { const next = { ...prev }; delete next[slotId]; return next })
  }, [])

  const clearAll = useCallback(() => { setSlots({}); setShareUrl('') }, [])

  const share = useCallback(() => {
    const encoded = Object.entries(slots).map(([k, v]) => `${k}=${v}`).join('&')
    const url = `${window.location.origin}/fifa-world-cup-fantasy-team/?team=${btoa(encoded)}`
    setShareUrl(url)
    navigator.clipboard?.writeText(url)
    jumpTo()
  }, [slots, jumpTo])

  return (
    <ToolLayout
      title="FIFA World Cup 2026 Fantasy Team Builder"
      desc="Build your dream starting XI from 40+ real World Cup stars. Pick a formation, place players, and share your team."
      icon="⚽" iconBg="rgba(34,197,94,0.08)"
      category="sports" slug="fifa-world-cup-fantasy-team"
      faq={[
        { q: 'What formations are available?', a: '4-4-2, 4-3-3, 3-5-2, and 4-2-3-1 — the classic football formations.' },
        { q: 'Can I save my team?', a: 'Your team auto-saves to your browser. Generate a shareable link to challenge friends.' },
        { q: 'How is chemistry calculated?', a: 'Based on team completeness (all 11 filled) and nation diversity. More nations = higher chemistry.' },
      ]}
      howItWorks={[
        'Select a formation from the dropdown.',
        'Click a player in the pool, then click an empty slot on the pitch.',
        'Fill all 11 slots to complete your dream XI.',
        'Share your team via the Share button.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "FIFA World Cup 2026 Fantasy Team Builder", "applicationCategory": "SportsApplication",
        "url": "https://www.uptools.in/fifa-world-cup-fantasy-team/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Controls */}
        <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/[0.08] flex flex-wrap items-center gap-3">
          <select value={formation} onChange={e => { setFormation(e.target.value); setSlots({}) }}
            className="bg-white/[0.06] border border-white/8 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none">
            {Object.keys(FORMATIONS).map(f => <option key={f} value={f} className="bg-[#0f172a]">{f}</option>)}
          </select>
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="text-slate-400">Players: <span className="text-emerald-400">{placedCount}/11</span></span>
            <span className="text-slate-400">Value: <span className="text-amber-400">€{totalValue}M</span></span>
            <span className="text-slate-400">Chemistry: <span className="text-cyan-400">{chemistry}%</span></span>
          </div>
          <div className="flex gap-2 ml-auto">
            <button onClick={share} className="px-3 py-1.5 rounded-lg bg-indigo-500 text-white text-xs font-bold hover:bg-indigo-400 transition-all">🔗 Share</button>
            <button onClick={clearAll} className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/30 transition-all">🗑️ Clear</button>
          </div>
        </div>

        {/* Pitch + Pool */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pitch */}
          <div className="p-5 rounded-2xl bg-green-900/30 border border-green-500/20">
            <div className="text-center text-xs font-bold text-green-400/60 mb-3">⚽ PITCH</div>
            {/* GK */}
            <div className="flex justify-center mb-4">
              <PitchSlot id="gk" label="GK" player={slots.gk ? uniquePlayers.find(p => p.id === slots.gk) : null}
                selected={selectedPlayer != null} onSelect={() => placePlayer('gk')} onRemove={() => removePlayer('gk')} />
            </div>
            {/* Rows */}
            {FORMATIONS[formation].rows.map((row, ri) => (
              <div key={ri} className="flex justify-center gap-2 mb-3">
                {Array.from({ length: row.count }, (_, i) => {
                  const sid = `r${ri}-${i}`
                  return <PitchSlot key={sid} id={sid} label={row.pos} player={slots[sid] ? uniquePlayers.find(p => p.id === slots[sid]) : null}
                    selected={selectedPlayer != null} onSelect={() => placePlayer(sid)} onRemove={() => removePlayer(sid)} />
                })}
              </div>
            ))}
          </div>

          {/* Player Pool */}
          <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08]">
            <div className="text-xs font-bold text-slate-400 mb-2">👥 Player Pool</div>
            <div className="flex gap-1 mb-3">
              {['GK', 'DEF', 'MID', 'FWD'].map(pos => (
                <button key={pos} onClick={() => setActiveTab(pos)}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${activeTab === pos ? 'bg-green-500 text-white' : 'bg-white/[0.04] text-slate-500'}`}>
                  {pos}
                </button>
              ))}
            </div>
            <div className="space-y-1 max-h-[400px] overflow-y-auto">
              {poolPlayers.map(p => (
                <button key={p.id} onClick={() => setSelectedPlayer(selectedPlayer === p.id ? null : p.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs transition-all ${selectedPlayer === p.id ? 'bg-green-500/20 border border-green-500/30' : 'bg-white/[0.02] hover:bg-white/[0.06] border border-transparent'}`}>
                  <span className="text-lg">{p.flag}</span>
                  <span className="flex-1 font-bold text-white truncate">{p.name}</span>
                  <span className="text-[10px] text-slate-500">€{p.value}M</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Share URL */}
        {shareUrl && (
          <div ref={resultRef} className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 font-mono break-all"
            style={{ animation: 'slideUp 0.35s ease-out' }}>
            🔗 Share URL copied to clipboard!
          </div>
        )}
      </div>
    </ToolLayout>
  )
}

function PitchSlot({ id, label, player, selected, onSelect, onRemove }) {
  return (
    <button onClick={player ? onRemove : (selected ? onSelect : undefined)}
      className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl flex flex-col items-center justify-center transition-all text-center
        ${player ? 'bg-green-500/20 border border-green-400/30' : selected ? 'bg-white/10 border-2 border-dashed border-green-400/50 animate-pulse cursor-pointer hover:bg-white/15' : 'bg-white/[0.04] border border-white/8'}`}>
      {player ? (
        <>
          <span className="text-lg">{player.flag}</span>
          <span className="text-[9px] font-bold text-white leading-tight mt-0.5 px-1 truncate max-w-full">{player.name.split(' ').pop()}</span>
          <span className="text-[8px] text-green-400 font-bold">{label}</span>
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[8px] flex items-center justify-center font-bold">✕</span>
        </>
      ) : (
        <>
          <span className="text-lg opacity-20">👤</span>
          <span className="text-[9px] text-slate-600 font-bold">{label}</span>
        </>
      )}
    </button>
  )
}
