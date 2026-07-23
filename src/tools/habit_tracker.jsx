import { useState, useCallback, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const EMOJIS = ['💪', '📚', '🧘', '💧', '🏃', '✍️', '🎵', '🍎', '😴', '🧹']

const DEFAULT_HABITS = [
  { id: 1, name: 'Exercise', emoji: '💪', streak: 15, completed: false },
  { id: 2, name: 'Read', emoji: '📚', streak: 8, completed: false },
  { id: 3, name: 'Meditate', emoji: '🧘', streak: 5, completed: false },
  { id: 4, name: 'Drink Water', emoji: '💧', streak: 22, completed: false },
]

export default function habit_tracker() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [habits, setHabits] = useState(() => {
    try {
      const saved = localStorage.getItem('habit-tracker-habits')
      return saved ? JSON.parse(saved) : DEFAULT_HABITS
    } catch { return DEFAULT_HABITS }
  })
  const [newName, setNewName] = useState('')

  useEffect(() => {
    localStorage.setItem('habit-tracker-habits', JSON.stringify(habits))
  }, [habits])

  const addHabit = useCallback(() => {
    if (!newName.trim()) return
    const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
    setHabits(prev => [...prev, { id: Date.now(), name: newName.trim(), emoji, streak: 0, completed: false }])
    setNewName('')
  }, [newName])

  const toggleComplete = useCallback((id) => {
    setHabits(prev => prev.map(h =>
      h.id === id ? { ...h, completed: !h.completed, streak: !h.completed ? h.streak + 1 : h.streak } : h
    ))
  }, [])

  const removeHabit = useCallback((id) => {
    setHabits(prev => prev.filter(h => h.id !== id))
  }, [])

  const completedCount = habits.filter(h => h.completed).length

  return (
    <ToolLayout
      title="Habit Tracker"
      desc="Track daily habits and build streaks. Monitor your progress and stay motivated."
      icon="📊" iconBg="rgba(34,197,94,0.08)"
      category="health" slug="habit-tracker"
      faq={[
        { q: "Is my data saved?", a: "Yes, habits are saved in your browser's localStorage. Nothing is uploaded." },
        { q: "Can I track multiple habits?", a: "Yes, add unlimited habits and track them all." },
      ]}
      howItWorks={["Add habits you want to track", "Mark them complete each day", "Watch your streaks grow"]}
      schema={{"@context":"https://schema.org","@type":"SoftwareApplication","name":"Habit Tracker","applicationCategory":"HealthApplication","url":"https://www.uptools.in/habit-tracker/","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}}}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Add habit */}
        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-6 sm:p-8 space-y-4">
          <div className="flex gap-3">
            <input type="text" value={newName} onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addHabit()}
              placeholder="Add new habit (e.g., Exercise, Read, Meditate)"
              className="flex-1 bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-green-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark]" />
            <button onClick={() => { addHabit(); jumpTo() }}
              className="px-6 py-3 rounded-xl bg-green-500 text-white font-bold text-sm hover:bg-green-400 transition-all active:scale-[0.98]">
              Add
            </button>
          </div>
          <div className="text-sm text-slate-500">
            {completedCount}/{habits.length} completed today
          </div>
        </div>

        {/* Habits list */}
        <div ref={resultRef} className="space-y-3">
          {habits.length === 0 ? (
            <div className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
              <div className="text-4xl mb-3 opacity-20">📊</div>
              <p className="text-sm text-slate-600 font-medium">Add your first habit to get started</p>
            </div>
          ) : (
            habits.map(h => (
              <div key={h.id}
                className={`rounded-2xl border-2 p-5 flex items-center gap-4 transition-all ${
                  h.completed
                    ? 'border-green-500/30 bg-green-500/[0.06]'
                    : 'border-white/8 bg-white/[0.06] hover:border-white/12'
                }`}>
                <span className="text-2xl">{h.emoji}</span>
                <div className="flex-1">
                  <h3 className={`font-bold ${h.completed ? 'text-green-400 line-through' : 'text-white'}`}>{h.name}</h3>
                  <p className="text-xs text-slate-500">🔥 {h.streak} day streak</p>
                </div>
                <button onClick={() => toggleComplete(h.id)}
                  className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all ${
                    h.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-white/12 bg-white/[0.04] text-slate-500 hover:border-green-500/40'
                  }`}>
                  {h.completed ? '✓' : ''}
                </button>
                <button onClick={() => removeHabit(h.id)}
                  className="text-slate-600 hover:text-red-400 transition-colors text-sm">
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Tips */}
        <div className="rounded-3xl border-2 border-emerald-500/15 bg-emerald-500/[0.04] p-6">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-3">Tips for Success</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>✅ Start with 1-2 habits and build gradually</li>
            <li>✅ Track at the same time each day</li>
            <li>✅ Celebrate small wins and streaks</li>
            <li>✅ Don't break the chain - consistency is key</li>
            <li>✅ Review progress weekly</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  )
}
