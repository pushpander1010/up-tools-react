import { useState, useCallback, useRef, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'

export default function todo_list_maker() {
  const [todos, setTodos] = useState(() => {
    try { return JSON.parse(localStorage.getItem('uptools.todos') || '[]') } catch { return [] }
  })
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState('all')
  const inputRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('uptools.todos', JSON.stringify(todos))
  }, [todos])

  const add = useCallback(() => {
    const text = input.trim()
    if (!text) return
    setTodos(prev => [...prev, { id: Date.now(), text, done: false, created: new Date().toISOString() }])
    setInput('')
    inputRef.current?.focus()
  }, [input])

  const toggle = useCallback((id) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }, [])

  const remove = useCallback((id) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }, [])

  const clearDone = useCallback(() => {
    setTodos(prev => prev.filter(t => !t.done))
  }, [])

  const filtered = todos.filter(t =>
    filter === 'all' ? true : filter === 'active' ? !t.done : t.done
  )

  const stats = {
    total: todos.length,
    done: todos.filter(t => t.done).length,
    active: todos.filter(t => !t.done).length,
  }

  return (
    <ToolLayout
      title="To-Do List Maker"
      desc="Simple, fast to-do list that saves to your browser. Track tasks with categories and completion status."
      icon="✅" iconBg="rgba(34,197,94,0.08)"
      category="productivity" slug="todo-list-maker"
      faq={[
        { q: 'Where are my tasks saved?', a: 'All tasks are saved in your browser\'s local storage. They persist between sessions but are not synced across devices.' },
        { q: 'Can I export my list?', a: 'Currently tasks are stored locally. You can copy them manually.' },
      ]}
      howItWorks={[
        'Type a task and press Enter or click Add.',
        'Click the checkbox to mark tasks as complete.',
        'Use filter tabs to view All, Active, or Completed tasks.',
        'Clear completed tasks with the Clear Done button.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "To-Do List Maker", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/todo-list-maker/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-lg mx-auto space-y-4">
        {/* Input */}
        <div className="flex gap-2">
          <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && add()}
            placeholder="What needs to be done?"
            className="flex-1 bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600" />
          <button onClick={add}
            className="glow-btn px-6 py-3 rounded-xl text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
            ➕ Add
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {['all', 'active', 'done'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all capitalize ${filter === f
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40'
                : 'bg-white/[0.04] text-slate-500 border border-white/8 hover:text-white'}`}>
              {f} {f === 'all' ? `(${stats.total})` : f === 'active' ? `(${stats.active})` : `(${stats.done})`}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: 'Total', val: stats.total, color: '#6366f1' },
            { label: 'Active', val: stats.active, color: '#f59e0b' },
            { label: 'Done', val: stats.done, color: '#22c55e' },
          ].map(s => (
            <div key={s.label} className="bg-black/20 rounded-xl py-3 px-2">
              <div className="text-lg font-extrabold" style={{ color: s.color }}>{s.val}</div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Todo List */}
        <div className="space-y-2">
          {filtered.length === 0 && (
            <div className="text-center py-10 text-sm text-slate-600">
              {todos.length === 0 ? '📝 No tasks yet. Add one above!' : 'No tasks in this filter.'}
            </div>
          )}
          {filtered.map(todo => (
            <div key={todo.id}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${todo.done
                ? 'bg-emerald-500/[0.04] border-emerald-500/10' : 'bg-white/[0.04] border-white/8'}`}>
              <button onClick={() => toggle(todo.id)}
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center text-xs transition-all flex-shrink-0 ${
                  todo.done ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'border-white/15 hover:border-indigo-500/40'}`}>
                {todo.done && '✓'}
              </button>
              <span className={`flex-1 text-sm ${todo.done ? 'text-slate-500 line-through' : 'text-white'}`}>
                {todo.text}
              </span>
              <button onClick={() => remove(todo.id)}
                className="text-slate-600 hover:text-red-400 transition-all text-sm px-1">✕</button>
            </div>
          ))}
        </div>

        {stats.done > 0 && (
          <button onClick={clearDone}
            className="w-full py-3 rounded-xl text-xs font-bold bg-white/[0.06] border border-white/8 text-slate-500 hover:text-red-400 transition-all">
            🗑️ Clear {stats.done} completed task{stats.done > 1 ? 's' : ''}
          </button>
        )}
      </div>
    </ToolLayout>
  )
}
