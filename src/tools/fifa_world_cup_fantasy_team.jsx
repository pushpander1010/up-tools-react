import { useState, useCallback, useMemo, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

/* ── PLAYER DATA ── */
const PLAYERS = [
  // Goalkeepers
  { id: 'p1',  name: 'Emiliano Martínez',  flag: '🇦🇷', country: 'Argentina',  value: 28, pos: 'GK' },
  { id: 'p2',  name: 'Mike Maignan',       flag: '🇫🇷', country: 'France',     value: 35, pos: 'GK' },
  { id: 'p3',  name: 'Alisson Becker',     flag: '🇧🇷', country: 'Brazil',     value: 32, pos: 'GK' },
  { id: 'p4',  name: 'Marc-André ter Stegen',flag:'🇩🇪', country: 'Germany',   value: 30, pos: 'GK' },
  { id: 'p5',  name: 'Jordan Pickford',    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', country: 'England',    value: 22, pos: 'GK' },
  { id: 'p6',  name: 'Unai Simón',         flag: '🇪🇸', country: 'Spain',      value: 25, pos: 'GK' },
  { id: 'p7',  name: 'Diogo Costa',        flag: '🇵🇹', country: 'Portugal',   value: 28, pos: 'GK' },
  { id: 'p8',  name: 'Bart Verbruggen',    flag: '🇳🇱', country: 'Netherlands',value: 20, pos: 'GK' },
  { id: 'p9',  name: 'Gianluigi Donnarumma',flag:'🇮🇹', country: 'Italy',      value: 35, pos: 'GK' },
  { id: 'p10', name: 'Yassine Bounou',     flag: '🇲🇦', country: 'Morocco',    value: 18, pos: 'GK' },
  // Defenders
  { id: 'p11', name: 'Cristian Romero',    flag: '🇦🇷', country: 'Argentina',  value: 30, pos: 'DEF' },
  { id: 'p12', name: 'Nicolás Otamendi',   flag: '🇦🇷', country: 'Argentina',  value: 12, pos: 'DEF' },
  { id: 'p13', name: 'Dayot Upamecano',    flag: '🇫🇷', country: 'France',     value: 28, pos: 'DEF' },
  { id: 'p14', name: 'William Saliba',     flag: '🇫🇷', country: 'France',     value: 32, pos: 'DEF' },
  { id: 'p15', name: 'Théo Hernandez',     flag: '🇫🇷', country: 'France',     value: 30, pos: 'DEF' },
  { id: 'p16', name: 'Marquinhos',         flag: '🇧🇷', country: 'Brazil',     value: 25, pos: 'DEF' },
  { id: 'p17', name: 'Éder Militão',       flag: '🇧🇷', country: 'Brazil',     value: 28, pos: 'DEF' },
  { id: 'p18', name: 'John Stones',        flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', country: 'England',    value: 22, pos: 'DEF' },
  { id: 'p19', name: 'Kyle Walker',        flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', country: 'England',    value: 15, pos: 'DEF' },
  { id: 'p20', name: 'Aymeric Laporte',    flag: '🇪🇸', country: 'Spain',      value: 20, pos: 'DEF' },
  { id: 'p21', name: 'Dani Carvajal',      flag: '🇪🇸', country: 'Spain',      value: 22, pos: 'DEF' },
  { id: 'p22', name: 'Antonio Rüdiger',    flag: '🇩🇪', country: 'Germany',    value: 26, pos: 'DEF' },
  { id: 'p23', name: 'David Raum',         flag: '🇩🇪', country: 'Germany',    value: 18, pos: 'DEF' },
  { id: 'p24', name: 'Rúben Dias',         flag: '🇵🇹', country: 'Portugal',   value: 32, pos: 'DEF' },
  { id: 'p25', name: 'Nuno Mendes',        flag: '🇵🇹', country: 'Portugal',   value: 25, pos: 'DEF' },
  { id: 'p26', name: 'Virgil van Dijk',    flag: '🇳🇱', country: 'Netherlands',value: 28, pos: 'DEF' },
  { id: 'p27', name: 'Matthijs de Ligt',   flag: '🇳🇱', country: 'Netherlands',value: 24, pos: 'DEF' },
  { id: 'p28', name: 'Giovanni Di Lorenzo',flag: '🇮🇹', country: 'Italy',      value: 20, pos: 'DEF' },
  { id: 'p29', name: 'Alessandro Bastoni', flag: '🇮🇹', country: 'Italy',      value: 22, pos: 'DEF' },
  { id: 'p30', name: 'Noussair Mazraoui',  flag: '🇲🇦', country: 'Morocco',    value: 18, pos: 'DEF' },
  { id: 'p31', name: 'Kim Min-jae',        flag: '🇰🇷', country: 'South Korea',value: 20, pos: 'DEF' },
  { id: 'p32', name: 'Takehiro Tomiyasu',  flag: '🇯🇵', country: 'Japan',      value: 18, pos: 'DEF' },
  // Midfielders
  { id: 'p33', name: 'Enzo Fernández',     flag: '🇦🇷', country: 'Argentina',  value: 35, pos: 'MID' },
  { id: 'p34', name: 'Rodrigo De Paul',    flag: '🇦🇷', country: 'Argentina',  value: 28, pos: 'MID' },
  { id: 'p35', name: 'Aurélien Tchouaméni',flag: '🇫🇷', country: 'France',     value: 35, pos: 'MID' },
  { id: 'p36', name: 'Eduardo Camavinga',  flag: '🇫🇷', country: 'France',     value: 32, pos: 'MID' },
  { id: 'p37', name: 'Kylian Mbappé',      flag: '🇫🇷', country: 'France',     value: 80, pos: 'MID' },
  { id: 'p38', name: 'Vinícius Júnior',    flag: '🇧🇷', country: 'Brazil',     value: 70, pos: 'MID' },
  { id: 'p39', name: 'Bruno Guimarães',    flag: '🇧🇷', country: 'Brazil',     value: 35, pos: 'MID' },
  { id: 'p40', name: 'Jude Bellingham',    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', country: 'England',    value: 70, pos: 'MID' },
  { id: 'p41', name: 'Declan Rice',        flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', country: 'England',    value: 45, pos: 'MID' },
  { id: 'p42', name: 'Pedri',              flag: '🇪🇸', country: 'Spain',      value: 40, pos: 'MID' },
  { id: 'p43', name: 'Rodri',              flag: '🇪🇸', country: 'Spain',      value: 45, pos: 'MID' },
  { id: 'p44', name: 'Jamal Musiala',      flag: '🇩🇪', country: 'Germany',    value: 45, pos: 'MID' },
  { id: 'p45', name: 'İlkay Gündoğan',     flag: '🇩🇪', country: 'Germany',    value: 25, pos: 'MID' },
  { id: 'p46', name: 'Bruno Fernandes',    flag: '🇵🇹', country: 'Portugal',   value: 35, pos: 'MID' },
  { id: 'p47', name: 'Frenkie de Jong',    flag: '🇳🇱', country: 'Netherlands',value: 30, pos: 'MID' },
  { id: 'p48', name: 'Kevin De Bruyne',    flag: '🇧🇪', country: 'Belgium',    value: 40, pos: 'MID' },
  { id: 'p49', name: 'Youri Tielemans',    flag: '🇧🇪', country: 'Belgium',    value: 22, pos: 'MID' },
  { id: 'p50', name: 'Nicolò Barella',     flag: '🇮🇹', country: 'Italy',      value: 30, pos: 'MID' },
  { id: 'p51', name: 'Sofyan Amrabat',     flag: '🇲🇦', country: 'Morocco',    value: 18, pos: 'MID' },
  { id: 'p52', name: 'Lee Kang-in',        flag: '🇰🇷', country: 'South Korea',value: 15, pos: 'MID' },
  { id: 'p53', name: 'Takefusa Kubo',      flag: '🇯🇵', country: 'Japan',      value: 18, pos: 'MID' },
  // Forwards
  { id: 'p54', name: 'Lionel Messi',       flag: '🇦🇷', country: 'Argentina',  value: 60, pos: 'FWD' },
  { id: 'p55', name: 'Lautaro Martínez',   flag: '🇦🇷', country: 'Argentina',  value: 45, pos: 'FWD' },
  { id: 'p56', name: 'Kylian Mbappé',      flag: '🇫🇷', country: 'France',     value: 80, pos: 'FWD' },
  { id: 'p57', name: 'Olivier Giroud',     flag: '🇫🇷', country: 'France',     value: 15, pos: 'FWD' },
  { id: 'p58', name: 'Neymar',             flag: '🇧🇷', country: 'Brazil',     value: 40, pos: 'FWD' },
  { id: 'p59', name: 'Richarlison',        flag: '🇧🇷', country: 'Brazil',     value: 25, pos: 'FWD' },
  { id: 'p60', name: 'Harry Kane',         flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', country: 'England',    value: 50, pos: 'FWD' },
  { id: 'p61', name: 'Bukayo Saka',        flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', country: 'England',    value: 45, pos: 'FWD' },
  { id: 'p62', name: 'Álvaro Morata',      flag: '🇪🇸', country: 'Spain',      value: 18, pos: 'FWD' },
  { id: 'p63', name: 'Lamine Yamal',       flag: '🇪🇸', country: 'Spain',      value: 50, pos: 'FWD' },
  { id: 'p64', name: 'Kai Havertz',        flag: '🇩🇪', country: 'Germany',    value: 30, pos: 'FWD' },
  { id: 'p65', name: 'Niclas Füllkrug',    flag: '🇩🇪', country: 'Germany',    value: 22, pos: 'FWD' },
  { id: 'p66', name: 'Cristiano Ronaldo',  flag: '🇵🇹', country: 'Portugal',   value: 35, pos: 'FWD' },
  { id: 'p67', name: 'Rafael Leão',        flag: '🇵🇹', country: 'Portugal',   value: 35, pos: 'FWD' },
  { id: 'p68', name: 'Memphis Depay',      flag: '🇳🇱', country: 'Netherlands',value: 20, pos: 'FWD' },
  { id: 'p69', name: 'Cody Gakpo',         flag: '🇳🇱', country: 'Netherlands',value: 28, pos: 'FWD' },
  { id: 'p70', name: 'Federico Chiesa',    flag: '🇮🇹', country: 'Italy',      value: 25, pos: 'FWD' },
  { id: 'p71', name: 'Romelu Lukaku',      flag: '🇧🇪', country: 'Belgium',    value: 22, pos: 'FWD' },
  { id: 'p72', name: 'Jeremy Doku',        flag: '🇧🇪', country: 'Belgium',    value: 30, pos: 'FWD' },
  { id: 'p73', name: 'Hakim Ziyech',       flag: '🇲🇦', country: 'Morocco',    value: 15, pos: 'FWD' },
  { id: 'p74', name: 'Son Heung-min',      flag: '🇰🇷', country: 'South Korea',value: 35, pos: 'FWD' },
  { id: 'p75', name: 'Daichi Kamada',      flag: '🇯🇵', country: 'Japan',      value: 15, pos: 'FWD' },
]

/* ── FORMATION DEFINITIONS ── */
const FORMATIONS = {
  '4-4-2':   { GK: 1, rows: [{ pos: 'DEF', count: 4, label: 'DEF' }, { pos: 'MID', count: 4, label: 'MID' }, { pos: 'FWD', count: 2, label: 'FWD' }] },
  '4-3-3':   { GK: 1, rows: [{ pos: 'DEF', count: 4, label: 'DEF' }, { pos: 'MID', count: 3, label: 'MID' }, { pos: 'FWD', count: 3, label: 'FWD' }] },
  '3-5-2':   { GK: 1, rows: [{ pos: 'DEF', count: 3, label: 'DEF' }, { pos: 'MID', count: 5, label: 'MID' }, { pos: 'FWD', count: 2, label: 'FWD' }] },
  '4-2-3-1': { GK: 1, rows: [{ pos: 'DEF', count: 4, label: 'DEF' }, { pos: 'MID', count: 2, label: 'CDM' }, { pos: 'MID', count: 3, label: 'CAM' }, { pos: 'FWD', count: 1, label: 'FWD' }] },
}

/* ── HELPERS ── */
function getUniquePlayers() {
  const seen = new Set()
  return PLAYERS.filter(p => { if (seen.has(p.id)) return false; seen.add(p.id); return true })
}

function getSlotIds(formation) {
  const fm = FORMATIONS[formation] || FORMATIONS['4-4-2']
  const ids = ['gk']
  fm.rows.forEach((row, ri) => { for (let i = 0; i < row.count; i++) ids.push(`r${ri}-${i}`) })
  return ids
}

function getSlotPos(formation, slotId) {
  if (slotId === 'gk') return { pos: 'GK', label: 'GK' }
  const fm = FORMATIONS[formation] || FORMATIONS['4-4-2']
  const parts = slotId.split('-')
  if (parts.length < 2) return { pos: 'MID', label: 'MID' }
  const ri = parseInt(parts[0].replace('r', ''))
  const row = fm.rows[ri]
  return row ? { pos: row.pos, label: row.label } : { pos: 'MID', label: 'MID' }
}

function isCompatible(playerPos, slotPos) {
  if (playerPos === slotPos) return true
  if ((playerPos === 'FWD' && slotPos === 'MID') || (playerPos === 'MID' && slotPos === 'FWD')) return true
  return false
}

function calcChemistry(slots) {
  const placed = Object.keys(slots).length
  if (placed === 0) return 0
  const lookup = {}
  getUniquePlayers().forEach(p => { lookup[p.id] = p })
  const nations = new Set()
  Object.values(slots).forEach(pid => { if (lookup[pid]) nations.add(lookup[pid].country) })
  const fillPct = placed / 11
  const diversityFactor = Math.min(nations.size / 5, 1)
  return Math.min(Math.round(fillPct * 60 + diversityFactor * 40), 100)
}

function calcTeamValue(slots) {
  const lookup = {}
  getUniquePlayers().forEach(p => { lookup[p.id] = p })
  let total = 0
  Object.values(slots).forEach(pid => { if (lookup[pid]) total += lookup[pid].value })
  return total
}

export default function fifa_world_cup_fantasy_team() {
  const { ref: resultRef, jumpTo } = useJumpToResult()

  const [formation, setFormation] = useState('4-4-2')
  const [slots, setSlots] = useState({})
  const [activePos, setActivePos] = useState('GK')
  const [selectedPlayerId, setSelectedPlayerId] = useState(null)
  const [showShare, setShowShare] = useState(false)
  const [shareUrl, setShareUrl] = useState('')

  // Load from URL or localStorage on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const encoded = params.get('t')
    if (encoded) {
      try {
        const data = JSON.parse(decodeURIComponent(atob(encoded)))
        if (data.formation) setFormation(data.formation)
        if (data.slots) setSlots(data.slots)
        return
      } catch {}
    }
    try {
      const raw = localStorage.getItem('wc2026_fantasy_team')
      if (raw) {
        const data = JSON.parse(raw)
        if (data.formation) setFormation(data.formation)
        if (data.slots) setSlots(data.slots)
      }
    } catch {}
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('wc2026_fantasy_team', JSON.stringify({ formation, slots }))
  }, [formation, slots])

  const placedCount = Object.keys(slots).length
  const teamValue = calcTeamValue(slots)
  const chemistry = calcChemistry(slots)
  const playerLookup = useMemo(() => {
    const l = {}; getUniquePlayers().forEach(p => { l[p.id] = p }); return l
  }, [])
  const placedIds = useMemo(() => new Set(Object.values(slots)), [slots])

  const poolPlayers = useMemo(() => {
    return getUniquePlayers().filter(p => p.pos === activePos)
  }, [activePos])

  const slotIds = useMemo(() => getSlotIds(formation), [formation])

  const handleSlotClick = useCallback((slotId) => {
    // If slot is filled, remove the player
    if (slots[slotId]) {
      setSlots(prev => { const n = { ...prev }; delete n[slotId]; return n })
      setSelectedPlayerId(null)
      return
    }
    // If a player is selected, place them
    if (selectedPlayerId) {
      const player = playerLookup[selectedPlayerId]
      if (!player) return
      const info = getSlotPos(formation, slotId)
      if (!isCompatible(player.pos, info.pos)) return
      // Remove player from any other slot first
      setSlots(prev => {
        const n = { ...prev }
        for (const [sid, pid] of Object.entries(n)) {
          if (pid === selectedPlayerId) { delete n[sid]; break }
        }
        n[slotId] = selectedPlayerId
        return n
      })
      setSelectedPlayerId(null)
      return
    }
    // Just toggle slot selection (visual only)
  }, [slots, selectedPlayerId, playerLookup, formation])

  const handlePlayerClick = useCallback((pid) => {
    setSelectedPlayerId(prev => prev === pid ? null : pid)
  }, [])

  const handleFormationChange = useCallback((newFormation) => {
    const oldSlots = { ...slots }
    const newSlotIds = getSlotIds(newFormation)
    const newSlots = {}
    const used = new Set()
    for (const [oldSlotId, pid] of Object.entries(oldSlots)) {
      const player = playerLookup[pid]
      if (!player) continue
      for (const newId of newSlotIds) {
        if (used.has(newId)) continue
        const info = getSlotPos(newFormation, newId)
        if (isCompatible(player.pos, info.pos)) {
          newSlots[newId] = pid
          used.add(newId)
          break
        }
      }
    }
    setFormation(newFormation)
    setSlots(newSlots)
    setSelectedPlayerId(null)
  }, [slots, playerLookup])

  const shareTeam = useCallback(() => {
    const encoded = btoa(encodeURIComponent(JSON.stringify({ formation, slots })))
    const url = window.location.origin + window.location.pathname + '?t=' + encoded
    setShareUrl(url)
    setShowShare(true)
  }, [formation, slots])

  const copyShareUrl = useCallback(() => {
    navigator.clipboard.writeText(shareUrl).then(() => alert('📋 Link copied to clipboard!'))
  }, [shareUrl])

  const clearTeam = useCallback(() => {
    if (!confirm('Clear your entire fantasy team?')) return
    setSlots({})
    setSelectedPlayerId(null)
  }, [])

  const POS_TABS = [
    { pos: 'GK', icon: '🧤', label: 'GK' },
    { pos: 'DEF', icon: '🛡️', label: 'DEF' },
    { pos: 'MID', icon: '🎯', label: 'MID' },
    { pos: 'FWD', icon: '⚽', label: 'FWD' },
  ]

  const PitchSlot = ({ slotId }) => {
    const info = getSlotPos(formation, slotId)
    const pid = slots[slotId]
    const player = pid ? playerLookup[pid] : null

    return (
      <button onClick={() => handleSlotClick(slotId)}
        className={`relative p-2 rounded-xl text-center transition-all min-h-[60px] ${
          player
            ? 'bg-white/[0.1] border border-indigo-500/30'
            : selectedPlayerId
              ? 'bg-indigo-500/10 border-2 border-dashed border-indigo-500/40 hover:bg-indigo-500/20 cursor-pointer'
              : 'bg-white/[0.03] border border-white/5 hover:bg-white/[0.06]'
        }`}>
        {player ? (
          <>
            <div className="text-lg">{player.flag}</div>
            <div className="text-[10px] font-bold text-white leading-tight mt-0.5">{player.name.split(' ').pop()}</div>
            <div className="text-[9px] text-slate-500">€{player.value}M</div>
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500/80 text-white text-[8px] font-bold flex items-center justify-center hover:bg-rose-500">×</div>
          </>
        ) : (
          <div className="text-[10px] text-slate-600 font-medium">{info.label}</div>
        )}
      </button>
    )
  }

  return (
    <ToolLayout
      title="FIFA World Cup 2026 Fantasy Team Builder"
      desc="Build your dream World Cup XI. Pick formations, place players, and share your team."
      icon="⚽" iconBg="rgba(59,130,246,0.08)"
      category="fifa" slug="fifa-world-cup-fantasy-team"
      faq={[
        { q: 'What is FIFA World Cup 2026 Fantasy Team Builder?', a: 'Build your dream starting XI from 60+ real players. Choose a formation, pick players by position, and save or share your team via URL.' },
        { q: 'How do I build my fantasy team?', a: 'Select a formation, click a player from the pool, then click an empty slot on the pitch. Fill all 11 slots to complete your dream XI.' },
        { q: 'Can I save and share my team?', a: 'Yes! Your team auto-saves to browser storage. Generate a shareable URL with your team encoded in the link.' },
      ]}
      howItWorks={[
        "Choose a formation — 4-4-2, 4-3-3, 3-5-2, or 4-2-3-1.",
        "Click a player from the pool organized by position (GK, DEF, MID, FWD).",
        "Click an empty slot on the pitch to place the selected player.",
        "Share your team via a generated link.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        name: "FIFA World Cup 2026 Fantasy Team Builder", "applicationCategory": "SportsApplication",
        url: "https://www.uptools.in/fifa-world-cup-fantasy-team/",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6" ref={resultRef}>
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <select value={formation} onChange={e => handleFormationChange(e.target.value)}
            className="bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-2.5 text-sm text-white font-semibold outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]">
            <option value="4-4-2">4-4-2</option>
            <option value="4-3-3">4-3-3</option>
            <option value="3-5-2">3-5-2</option>
            <option value="4-2-3-1">4-2-3-1</option>
          </select>
          <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
            <span>Players: <strong className="text-white">{placedCount}</strong>/11</span>
            <span>Value: <strong className="text-white">€{teamValue}M</strong></span>
            <span>Chem: <strong className="text-white">{chemistry}%</strong></span>
          </div>
          <div className="ml-auto flex gap-2">
            <button onClick={shareTeam} className="px-4 py-2 rounded-xl bg-indigo-500 text-white text-xs font-bold hover:bg-indigo-400 transition-all">🔗 Share</button>
            <button onClick={clearTeam} className="px-4 py-2 rounded-xl bg-white/[0.06] border border-white/8 text-slate-400 text-xs font-semibold hover:text-white transition-all">🗑️ Clear</button>
          </div>
        </div>

        {/* Share URL */}
        {showShare && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20" style={{ animation: 'slideUp 0.3s ease' }}>
            <input type="text" readOnly value={shareUrl} onClick={e => e.target.select()}
              className="flex-1 bg-white/[0.06] border border-white/8 rounded-lg px-3 py-2 text-xs text-white font-mono outline-none" />
            <button onClick={copyShareUrl} className="px-3 py-2 rounded-lg bg-indigo-500 text-white text-xs font-bold">📋 Copy</button>
            <button onClick={() => setShowShare(false)} className="text-slate-500 text-xs">✕</button>
          </div>
        )}

        {/* Builder Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pitch */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border-2 border-white/8 bg-gradient-to-b from-emerald-900/20 via-emerald-900/10 to-transparent p-4 sm:p-6">
              <div className="text-center text-[10px] font-bold text-emerald-400/60 uppercase tracking-wider mb-3">⚽ Pitch</div>
              <div className="space-y-2">
                {/* GK row */}
                <div className="flex justify-center">
                  <div className="w-32"><PitchSlot slotId="gk" /></div>
                </div>
                {/* Formation rows */}
                {(() => {
                  const fm = FORMATIONS[formation] || FORMATIONS['4-4-2']
                  let idx = 1
                  return fm.rows.map((row, ri) => {
                    const rowSlots = []
                    for (let i = 0; i < row.count; i++) {
                      rowSlots.push(<PitchSlot key={slotIds[idx]} slotId={slotIds[idx]} />)
                      idx++
                    }
                    return (
                      <div key={ri} className="flex justify-center gap-2">
                        {rowSlots}
                      </div>
                    )
                  })
                })()}
              </div>
            </div>
          </div>

          {/* Player Pool */}
          <div className="space-y-3">
            <div className="rounded-3xl border-2 border-white/8 bg-white/[0.04] p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-white">Player Pool</span>
                <span className="text-[10px] text-slate-500">Click player → click slot</span>
              </div>
              {/* Position Tabs */}
              <div className="flex gap-1.5 mb-3">
                {POS_TABS.map(t => (
                  <button key={t.pos} onClick={() => setActivePos(t.pos)}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                      activePos === t.pos ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-500 hover:text-white'
                    }`}>
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
              {/* Player List */}
              <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1">
                {poolPlayers.map(p => {
                  const isPlaced = placedIds.has(p.id)
                  const isSelected = selectedPlayerId === p.id
                  return (
                    <button key={p.id} onClick={() => !isPlaced && handlePlayerClick(p.id)}
                      disabled={isPlaced}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center gap-2 ${
                        isPlaced ? 'opacity-30 cursor-not-allowed' :
                        isSelected ? 'bg-indigo-500/20 border border-indigo-500/30 text-white' :
                        'bg-white/[0.03] border border-white/5 text-slate-400 hover:bg-white/[0.06] hover:text-white'
                      }`}>
                      <span className="text-base">{p.flag}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold truncate">{p.name}</div>
                        <div className="text-[10px] text-slate-500">{p.country}</div>
                      </div>
                      <span className="text-[10px] font-bold text-indigo-400">€{p.value}M</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
