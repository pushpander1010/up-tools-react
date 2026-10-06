import { useState, useMemo, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

export const GAMES = [
  { slug: 'snake', title: 'Snake', icon: '🐍', desc: 'Eat food, grow your snake, avoid hitting yourself.', cat: 'Arcade', color: '#22c55e' },
  { slug: 'tetris', title: 'Tetris', icon: '🧱', desc: 'Arrange falling blocks to clear lines.', cat: 'Puzzle', color: '#6366f1' },
  { slug: '2048', title: '2048', icon: '🔢', desc: 'Slide and merge number tiles to reach 2048.', cat: 'Puzzle', color: '#f59e0b' },
  { slug: 'flappy-bird', title: 'Flappy Bird', icon: '🐦', desc: 'Navigate through pipes in this addictive arcade game.', cat: 'Arcade', color: '#06b6d4' },
  { slug: 'pac-man', title: 'Pac-Man', icon: '👾', desc: 'Eat dots and avoid ghosts in this classic arcade game.', cat: 'Arcade', color: '#eab308' },
  { slug: 'space-invaders', title: 'Space Invaders', icon: '🛸', desc: 'Blast the alien fleet and beat your high score.', cat: 'Arcade', color: '#8b5cf6' },
  { slug: 'breakout', title: 'Breakout', icon: '🧱', desc: 'Break all bricks with your paddle and ball.', cat: 'Arcade', color: '#ef4444' },
  { slug: 'ping-pong', title: 'Ping Pong', icon: '🏓', desc: 'Classic Pong against AI. First to 7 wins!', cat: 'Arcade', color: '#14b8a6' },
  { slug: 'tic-tac-toe', title: 'Tic Tac Toe', icon: '⭕', desc: 'Play against AI or a friend in this classic game.', cat: 'Board', color: '#f43f5e' },
  { slug: 'connect-4', title: 'Connect 4', icon: '🔵', desc: 'Drop discs and line up four in a row vs the computer.', cat: 'Board', color: '#3b82f6' },
  { slug: 'minesweeper', title: 'Minesweeper', icon: '💣', desc: 'Flag mines and clear safe tiles to win.', cat: 'Puzzle', color: '#f97316' },
  { slug: 'wordle', title: 'Wordle', icon: '🔤', desc: 'Guess the 5-letter word in 6 tries with color hints.', cat: 'Word', color: '#22c55e' },
  { slug: 'hangman', title: 'Hangman', icon: '🪢', desc: 'Guess the word letter by letter before time runs out.', cat: 'Word', color: '#a855f7' },
  { slug: 'word-scramble', title: 'Word Scramble', icon: '🔀', desc: 'Unscramble jumbled letters to find the hidden word.', cat: 'Word', color: '#ec4899' },
  { slug: 'quiz-trivia', title: 'Quiz Trivia', icon: '🧠', desc: 'Test your general knowledge with 100+ trivia questions.', cat: 'Trivia', color: '#8b5cf6' },
  { slug: 'memory-match', title: 'Memory Match', icon: '🃏', desc: 'Flip cards and match pairs to test your memory.', cat: 'Puzzle', color: '#06b6d4' },
  { slug: 'simon-says', title: 'Simon Says', icon: '🔴', desc: 'Remember and repeat the color sequence.', cat: 'Memory', color: '#ef4444' },
  { slug: 'rock-paper-scissors', title: 'Rock Paper Scissors', icon: '✂️', desc: 'Play the classic hand game against the computer.', cat: 'Quick', color: '#eab308' },
  { slug: 'whack-a-mole', title: 'Whack-a-Mole', icon: '🔨', desc: 'Hit the moles as they pop up from their holes.', cat: 'Arcade', color: '#f59e0b' },
  { slug: 'typing-speed', title: 'Typing Speed Test', icon: '⌨️', desc: 'Test your WPM and accuracy. How fast can you type?', cat: 'Typing', color: '#6366f1' },
  { slug: 'number-guessing', title: 'Number Guessing', icon: '🎲', desc: 'Guess the hidden number in the fewest tries.', cat: 'Quick', color: '#14b8a6' },
  { slug: 'color-rush', title: 'Color Rush', icon: '🌈', desc: 'Spot the odd color before time runs out.', cat: 'Quick', color: '#f43f5e' },
  { slug: 'reaction-time', title: 'Reaction Time Test', icon: '⚡', desc: 'Tap as fast as you can when the screen turns green.', cat: 'Quick', color: '#eab308' },
  { slug: 'love-test', title: 'Love Compatibility Test', icon: '💘', desc: 'Fun love quiz for couples.', cat: 'Quiz', color: '#ec4899' },
  { slug: 'friendship-test', title: 'Best Friend Compatibility', icon: '👫', desc: '2-player BFF quiz to test your friendship.', cat: 'Quiz', color: '#f97316' },
  { slug: 'dice-roller', title: 'Dice Roller', icon: '🎲', desc: 'Roll D4 to D20 virtual dice for board games and RPGs.', cat: 'Casual', color: '#6366f1' },
  { slug: 'coin-flip', title: 'Coin Flip', icon: '🪙', desc: 'Flip a virtual coin. Heads or tails? With stats.', cat: 'Casual', color: '#eab308' },
  { slug: 'wheel-of-names', title: 'Wheel of Names', icon: '🎡', desc: 'Spin a custom wheel to pick a random winner.', cat: 'Casual', color: '#8b5cf6' },
  { slug: 'solitaire', title: 'Solitaire', icon: '🃏', desc: 'Classic Klondike card game. Build suits and clear the deck.', cat: 'Card', color: '#22c55e' },
  { slug: 'hex-gl', title: 'HexGL Racing', icon: '🏎️', desc: '3D futuristic racing game. Race through neon-lit tracks at 60 FPS.', cat: 'Arcade', color: '#06b6d4' },
  { slug: 'super-sudoku', title: 'Super Sudoku', icon: '🔢', desc: 'Classic Sudoku with multiple difficulties, notes mode, and timer.', cat: 'Puzzle', color: '#6366f1' },
  { slug: 'bubble-shooter', title: 'Bubble Shooter', icon: '🫧', desc: 'Match and pop colored bubbles in this addictive arcade classic.', cat: 'Arcade', color: '#06b6d4' },
  { slug: 'battleship', title: 'Battleship', icon: '🚢', desc: 'Place your fleet and sink the enemy ships before time runs out.', cat: 'Board', color: '#f59e0b' },
  { slug: 'frogger', title: 'Frogger', icon: '🐸', desc: 'Guide your frog across roads and rivers to reach safety.', cat: 'Arcade', color: '#22c55e' },
  { slug: 'doodle-jump', title: 'Doodle Jump', icon: '📔', desc: 'Bounce upward on platforms and reach new heights.', cat: 'Arcade', color: '#a855f7' },
  { slug: 'chess', title: 'Chess', icon: '♟️', desc: 'Play chess against the AI. Full rules with check, castling, and promotion.', cat: 'Board', color: '#fbbf24' },
  { slug: 'tower-defense', title: 'Tower Defense', icon: '🏰', desc: 'Build towers to defend against waves of enemies.', cat: 'Strategy', color: '#ef4444' },
  { slug: 'memory-sequence', title: 'Memory Sequence', icon: '🧠', desc: 'Remember and repeat an increasingly long sequence of lights and sounds.', cat: 'Memory', color: '#8b5cf6' },
  { slug: 'sudoku', title: 'Sudoku', icon: '🔢', desc: 'Fill the 9×9 grid so each row, column and 3×3 box contains digits 1-9.', cat: 'Puzzle', color: '#6366f1' },
  { slug: 'gully-cricket', title: 'Gully Cricket Sixes', icon: '🏏', desc: 'Time your shot and smash sixes in this gully cricket hitting game.', cat: 'Arcade', color: '#22c55e' },
  { slug: 'tambola', title: 'Tambola Housie', icon: '🎱', desc: 'Classic Indian housie with auto number caller and win detection.', cat: 'Board', color: '#f59e0b' },
  { slug: 'fruit-slice', title: 'Fruit Slice', icon: '🍉', desc: 'Slice flying fruits and dodge bombs in this 60-second arcade rush.', cat: 'Arcade', color: '#ef4444' },
  { slug: 'endless-runner', title: 'Endless Runner', icon: '🏃', desc: 'Jump and double-jump over spikes. How far can you run?', cat: 'Arcade', color: '#06b6d4' },
  { slug: 'car-dodger', title: 'Highway Car Dodger', icon: '🚗', desc: 'Weave through highway traffic and grab near-miss bonuses.', cat: 'Arcade', color: '#8b5cf6' },
  { slug: 'math-sprint', title: 'Math Sprint', icon: '➗', desc: '60-second mental maths race with streak bonuses and 3 levels.', cat: 'Puzzle', color: '#6366f1' },
  { slug: 'snakes-ladders', title: 'Snakes & Ladders', icon: '🪜', desc: 'Race the computer to 100 in this classic board game.', cat: 'Board', color: '#84cc16' },
  { slug: 'balloon-pop', title: 'Balloon Pop', icon: '🎈', desc: 'Pop balloons in 45 seconds. Golden ones pay big!', cat: 'Arcade', color: '#ec4899' },
  { slug: 'stack-tower', title: 'Stack Tower', icon: '🗼', desc: 'Stack moving blocks sky-high. Perfect drops earn bonuses.', cat: 'Arcade', color: '#f97316' },
  { slug: 'dots-boxes', title: 'Dots & Boxes', icon: '⬛', desc: 'Outsmart the computer in this classic strategy duel.', cat: 'Board', color: '#14b8a6' },
  { slug: 'momo-merge', title: 'Momo Merge', icon: '🥟', desc: 'Drop cute momos, merge same sizes into bigger momos. 10 sizes, game over above the line.', cat: 'Puzzle', color: '#ec4899' },
]

const CATEGORIES = ['All', ...new Set(GAMES.map(g => g.cat))]
const CAT_ICON = { All: '🎮', Arcade: '🕹️', Puzzle: '🧩', Board: '♟️', Word: '🔤', Trivia: '🧠', Memory: '🃏', Quick: '⚡', Quiz: '💘', Casual: '🎲', Card: '🂡', Typing: '⌨️', Strategy: '🏰' }
const FEATURED_SLUGS = ['snake', 'tetris', '2048', 'flappy-bird', 'wordle', 'minesweeper']

export default function GamesPage() {
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState('All')
  const [recent] = useState(() => {
    try { return JSON.parse(localStorage.getItem('uptools-game-recent') || '[]') } catch { return [] }
  })

  const filtered = useMemo(() => {
    let list = GAMES
    if (activeCat !== 'All') list = list.filter(g => g.cat === activeCat)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(g => g.title.toLowerCase().includes(q) || g.desc.toLowerCase().includes(q) || g.cat.toLowerCase().includes(q))
    }
    return list
  }, [search, activeCat])

  const featured = useMemo(() => FEATURED_SLUGS.map(s => GAMES.find(g => g.slug === s)).filter(Boolean), [])
  const recentGames = useMemo(() => recent.slice(0, 4).map(s => GAMES.find(g => g.slug === s)).filter(Boolean), [recent])

  return (
    <>
      <Helmet>
        <title>Free Online Games - Play Instant Browser Games | UpTools</title>
        <meta name="description" content={`${GAMES.length}+ free browser games instantly — Snake, Tetris, Pac-Man, 2048, Wordle, Quiz, and more. No download, no sign-up.`} />
        <link rel="canonical" href="https://www.uptools.in/games/" />
        <meta property="og:title" content="Free Online Games | UpTools" />
        <meta property="og:description" content={`${GAMES.length}+ free browser games — no download, no sign-up.`} />
        <meta property="og:url" content="https://www.uptools.in/games/" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "WebApplication",
          "name": "Free Online Games", "applicationCategory": "GameApplication",
          "url": "https://www.uptools.in/games/",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
        }) }} />
      </Helmet>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-5" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span className="text-slate-700">›</span>
        <span className="text-slate-300 font-medium">Free Games</span>
      </nav>

      {/* Hero — arcade marquee */}
      <section className="p-7 mb-6 relative overflow-hidden rounded-3xl border border-fuchsia-500/20"
        style={{ background: 'linear-gradient(135deg, rgba(244,63,94,0.12), rgba(99,102,241,0.12) 50%, rgba(245,158,11,0.10))' }}>
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(244,63,94,0.18)' }} />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(99,102,241,0.15)' }} />
        <div className="relative">
          <div className="text-4xl mb-2 animate-bounce" style={{ animationDuration: '2.5s' }}>🕹️</div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight m-0 mb-2"
            style={{ background: 'linear-gradient(90deg, #f43f5e, #f97316, #eab308, #22c55e, #06b6d4, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            FREE GAMES
          </h1>
          <p className="text-slate-300 text-sm max-w-md font-medium">{GAMES.length}+ instant browser games — no download, no sign-up. Pick a card and play! 👇</p>
          <div className="flex gap-3 mt-4">
            <div className="px-4 py-2 rounded-2xl bg-white/[0.06] border border-white/10 text-center"><div className="text-xl font-black text-white">{GAMES.length}</div><div className="text-[11px] text-slate-400 font-semibold">Games 🎮</div></div>
            <div className="px-4 py-2 rounded-2xl bg-white/[0.06] border border-white/10 text-center"><div className="text-xl font-black text-white">0</div><div className="text-[11px] text-slate-400 font-semibold">Sign-ups 🚫</div></div>
            <div className="px-4 py-2 rounded-2xl bg-white/[0.06] border border-white/10 text-center"><div className="text-xl font-black text-emerald-400">100%</div><div className="text-[11px] text-slate-400 font-semibold">Free 🎉</div></div>
          </div>
        </div>
      </section>

      {/* Search + Categories */}
      <div className="glass p-4 mb-6 space-y-3">
        <div className="relative">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search games..."
            className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 pl-10 text-sm outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-400" />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCat(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                activeCat === cat
                  ? 'bg-gradient-to-r from-rose-500/25 to-indigo-500/25 border-rose-500/40 text-white shadow-lg shadow-rose-500/10 scale-105'
                  : 'bg-white/[0.04] border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.08] hover:scale-105'
              }`}>
              {CAT_ICON[cat] || '🎮'} {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Continue Playing */}
      {recentGames.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-slate-400 mb-3">⏱️ Continue Playing</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {recentGames.map(g => (
              <a key={g.slug} href={`/games/${g.slug}/`}
                className="glass p-4 group relative overflow-hidden no-underline block">
                <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(90deg, transparent, ${g.color}, transparent)` }} />
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{g.icon}</div>
                <h3 className="text-sm font-bold text-white">{g.title}</h3>
                <span className="text-xs text-slate-400">{g.cat}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Featured */}
      <div className="mb-6">
        <h2 className="text-base font-black text-white mb-3">🔥 Most Popular</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {featured.map(g => (
            <a key={g.slug} href={`/games/${g.slug}/`}
              className="p-5 group relative overflow-hidden no-underline block rounded-3xl border border-white/10 bg-white/[0.04] hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
              style={{ '--gc': g.color }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = g.color + '66'; e.currentTarget.style.boxShadow = `0 12px 40px -8px ${g.color}55` }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.boxShadow = '' }}>
              <div className="absolute top-0 left-0 right-0 h-1 opacity-80"
                style={{ background: `linear-gradient(90deg, transparent, ${g.color}, transparent)` }} />
              <div className="flex items-center gap-4">
                <div className="text-4xl group-hover:scale-125 group-hover:-rotate-6 transition-transform p-2 rounded-2xl"
                  style={{ background: g.color + '1a' }}>{g.icon}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-white mb-0.5">{g.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{g.desc}</p>
                </div>
                <span className="text-xs font-black py-2 px-4 shrink-0 rounded-full text-white group-hover:scale-110 transition-transform"
                  style={{ background: `linear-gradient(135deg, ${g.color}, ${g.color}aa)` }}>▶ Play</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* All Games */}
      <div>
        <h2 className="text-base font-black text-white mb-3">🕹️ All Games ({filtered.length})</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map(g => (
            <a key={g.slug} href={`/games/${g.slug}/`}
              className="p-4 group relative overflow-hidden no-underline block rounded-3xl border border-white/10 bg-white/[0.04] hover:-translate-y-1 transition-all duration-300"
              onMouseEnter={e => { e.currentTarget.style.borderColor = g.color + '66'; e.currentTarget.style.boxShadow = `0 12px 32px -10px ${g.color}66` }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.boxShadow = '' }}>
              <div className="absolute top-0 left-0 right-0 h-1 opacity-70"
                style={{ background: `linear-gradient(90deg, transparent, ${g.color}, transparent)` }} />
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-2 group-hover:scale-115 group-hover:-rotate-6 transition-transform"
                style={{ background: g.color + '1a' }}>{g.icon}</div>
              <h3 className="text-sm font-bold text-white mb-0.5">{g.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2 mb-2">{g.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full text-slate-300"
                  style={{ background: g.color + '1a' }}>{g.cat}</span>
                <span className="text-xs font-black text-white py-1 px-3 rounded-full"
                  style={{ background: `linear-gradient(135deg, ${g.color}, ${g.color}aa)` }}>▶</span>
              </div>
            </a>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="glass p-12 text-center">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-sm text-slate-400">No games match your search</p>
          </div>
        )}
      </div>
    </>
  )
}
