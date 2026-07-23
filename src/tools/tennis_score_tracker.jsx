import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'

const POINT_NAMES = ['0', '15', '30', '40', 'Ad']

function newMatch() {
  return {
    p1: { sets: [0, 0, 0], games: [0, 0, 0], points: 0 },
    p2: { sets: [0, 0, 0], games: [0, 0, 0], points: 0 },
    currentSet: 0,
    history: [],
  }
}

function addPointToState(state, player) {
  const next = {
    p1: { sets: [...state.p1.sets], games: [...state.p1.games], points: state.p1.points },
    p2: { sets: [...state.p2.sets], games: [...state.p2.games], points: state.p2.points },
    currentSet: state.currentSet,
    history: [...state.history, { p1: { sets: [...state.p1.sets], games: [...state.p1.games], points: state.p1.points }, p2: { sets: [...state.p2.sets], games: [...state.p2.games], points: state.p2.points }, currentSet: state.currentSet }],
  }

  const p = player === 1 ? next.p1 : next.p2
  const opp = player === 1 ? next.p2 : next.p1

  p.points++

  if (p.points >= 4 && p.points - opp.points >= 2) {
    p.games[next.currentSet]++
    p.points = 0
    opp.points = 0

    if (p.games[next.currentSet] >= 6 && p.games[next.currentSet] - opp.games[next.currentSet] >= 2) {
      p.sets[next.currentSet]++
      if (next.currentSet < 2) {
        next.currentSet++
        p.games[next.currentSet] = 0
        opp.games[next.currentSet] = 0
      }
    }
  } else if (p.points >= 3 && opp.points >= 3 && p.points === opp.points) {
    p.points = 3
  }

  return next
}

export default function tennis_score_tracker() {
  const [state, setState] = useState(newMatch)

  const addPoint = useCallback((player) => {
    setState(prev => addPointToState(prev, player))
  }, [])

  const undoPoint = useCallback(() => {
    setState(prev => {
      if (prev.history.length === 0) return prev
      const restored = prev.history[prev.history.length - 1]
      return { ...restored, history: prev.history.slice(0, -1) }
    })
  }, [])

  const resetSet = useCallback(() => {
    setState(prev => ({
      ...prev,
      p1: { ...prev.p1, games: prev.p1.games.map((g, i) => i === prev.currentSet ? 0 : g), points: 0 },
      p2: { ...prev.p2, games: prev.p2.games.map((g, i) => i === prev.currentSet ? 0 : g), points: 0 },
    }))
  }, [])

  const resetMatch = useCallback(() => setState(newMatch()), [])

  const totalSets = useCallback(() => {
    return state.p1.sets.reduce((a, b) => a + b, 0) + state.p2.sets.reduce((a, b) => a + b, 0)
  }, [state.p1.sets, state.p2.sets])

  const ScoreBox = ({ value, active, highlight }) => (
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-extrabold ${
      highlight ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
      active ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
      'bg-white/[0.04] text-slate-500 border border-white/5'
    }`}>
      {value}
    </div>
  )

  const PlayerSection = ({ name, player, num }) => (
    <div className="flex-1 space-y-3">
      <h3 className="text-center font-bold text-white text-sm">{name}</h3>
      {/* Sets + Points */}
      <div className="flex items-center justify-center gap-1.5">
        <ScoreBox value={state[`${player}`].sets[0]} active={state.currentSet === 0} />
        <ScoreBox value={state[`${player}`].sets[1]} active={state.currentSet === 1} />
        <ScoreBox value={state[`${player}`].sets[2]} active={state.currentSet === 2} />
        <div className="w-px h-8 bg-white/10 mx-1" />
        <ScoreBox
          value={POINT_NAMES[Math.min(state[`${player}`].points, 4)]}
          active
          highlight={state[`${player}`].points >= 3 && state.p1.points >= 3 && state.p2.points >= 3}
        />
      </div>
      {/* Points label */}
      <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-600 font-medium">
        <span className="w-12 text-center">S1</span>
        <span className="w-12 text-center">S2</span>
        <span className="w-12 text-center">S3</span>
        <div className="w-px h-4 mx-1" />
        <span className="w-12 text-center">PTS</span>
      </div>
      {/* Game score */}
      <div className="text-center text-xs text-slate-500 font-medium">
        Games: {state[`${player}`].games[state.currentSet]}
      </div>
      {/* Buttons */}
      <div className="flex gap-2">
        <button onClick={() => addPoint(num)}
          className="flex-1 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-bold hover:bg-indigo-400 transition-all active:scale-[0.98]">
          +1 Point
        </button>
        <button onClick={undoPoint}
          className="px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/8 text-slate-400 text-sm font-semibold hover:text-white transition-all">
          Undo
        </button>
      </div>
    </div>
  )

  return (
    <ToolLayout
      title="Tennis Score Tracker"
      desc="Track live tennis match scores, sets, games, and points in real time. Perfect for coaches, fans, and tournament organizers."
      icon="🎾" iconBg="rgba(34,197,94,0.08)"
      category="sports" slug="tennis-score-tracker"
      faq={[
        { q: 'How does tennis scoring work?', a: 'Points go 0 → 15 → 30 → 40 → Game. A player must win by 2 clear points at deuce. A set requires 6 games with a 2-game lead.' },
        { q: 'Can I undo a point?', a: 'Yes — tap the Undo button to revert the last point scored.' },
      ]}
      howItWorks={[
        "Tap +1 Point on the player's side to score.",
        "Points, games, and sets update automatically following tennis rules.",
        "Use Undo to revert the last point, or Reset to start over.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        name: "Tennis Score Tracker", "applicationCategory": "SportsApplication",
        url: "https://www.uptools.in/tennis-score-tracker/",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Scoreboard */}
        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.04] p-6">
          <div className="flex gap-6">
            <PlayerSection name="Player 1" player="p1" num={1} />
            <div className="w-px bg-white/8" />
            <PlayerSection name="Player 2" player="p2" num={2} />
          </div>

          {/* Set indicator */}
          <div className="mt-4 text-center">
            <span className="text-xs text-slate-500 font-medium">
              Set {state.currentSet + 1} of 3 · {totalSets()} total sets played
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <button onClick={resetSet}
            className="flex-1 py-3 rounded-xl bg-white/[0.06] border border-white/8 text-slate-400 text-sm font-semibold hover:text-white transition-all">
            Reset Set
          </button>
          <button onClick={resetMatch}
            className="flex-1 py-3 rounded-xl bg-white/[0.06] border border-white/8 text-slate-400 text-sm font-semibold hover:text-white transition-all">
            Reset Match
          </button>
        </div>

        {/* Match result (if one player has 2 sets) */}
        {(state.p1.sets.reduce((a, b) => a + b, 0) >= 2 || state.p2.sets.reduce((a, b) => a + b, 0) >= 2) && (
          <div className="rounded-3xl border-2 border-amber-500/20 bg-gradient-to-br from-amber-500/[0.08] via-white/[0.02] to-transparent p-6 text-center">
            <div className="text-3xl mb-2">🏆</div>
            <h3 className="text-lg font-extrabold text-white">
              {state.p1.sets.reduce((a, b) => a + b, 0) >= 2 ? 'Player 1' : 'Player 2'} Wins!
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              {state.p1.sets.reduce((a, b) => a + b, 0)} - {state.p2.sets.reduce((a, b) => a + b, 0)} sets
            </p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
