import { useState, useMemo, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'

const GAMES = [
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
]

const CATEGORIES = ['All', ...new Set(GAMES.map(g => g.cat))]
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

      {/* Hero */}
      <section className="glass p-7 mb-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(244,63,94,0.1)' }} />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(99,102,241,0.08)' }} />
        <div className="relative">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight m-0 mb-2"
            style={{ background: 'linear-gradient(135deg, #fff, #f43f5e, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            🎮 Free Games
          </h1>
          <p className="text-slate-400 text-sm max-w-md">{GAMES.length}+ instant browser games — no download, no sign-up. Just click and play.</p>
          <div className="flex gap-6 mt-4">
            <div className="text-center"><div className="text-xl font-extrabold text-white">{GAMES.length}</div><div className="text-xs text-slate-500">Games</div></div>
            <div className="text-center"><div className="text-xl font-extrabold text-white">0</div><div className="text-xs text-slate-500">Sign-ups</div></div>
            <div className="text-center"><div className="text-xl font-extrabold text-emerald-400">100%</div><div className="text-xs text-slate-500">Free</div></div>
          </div>
        </div>
      </section>

      {/* Search + Categories */}
      <div className="glass p-4 mb-6 space-y-3">
        <div className="relative">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search games..."
            className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 pl-10 text-sm outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500" />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCat(cat)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                activeCat === cat
                  ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400'
                  : 'bg-white/[0.04] border-white/[0.06] text-slate-500 hover:text-white hover:bg-white/[0.08]'
              }`}>
              {cat}
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
                <span className="text-xs text-slate-500">{g.cat}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Featured */}
      <div className="mb-6">
        <h2 className="text-sm font-bold text-slate-400 mb-3">🔥 Most Popular</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {featured.map(g => (
            <a key={g.slug} href={`/games/${g.slug}/`}
              className="glass p-5 group relative overflow-hidden no-underline block">
              <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(90deg, transparent, ${g.color}, transparent)` }} />
              <div className="flex items-center gap-4">
                <div className="text-4xl group-hover:scale-110 transition-transform">{g.icon}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-white mb-0.5">{g.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{g.desc}</p>
                </div>
                <span className="glow-btn text-xs py-1.5 px-3 shrink-0">Play →</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* All Games */}
      <div>
        <h2 className="text-sm font-bold text-slate-400 mb-3">🕹️ All Games ({filtered.length})</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map(g => (
            <a key={g.slug} href={`/games/${g.slug}/`}
              className="glass p-4 group relative overflow-hidden no-underline block">
              <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(90deg, transparent, ${g.color}, transparent)` }} />
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{g.icon}</div>
              <h3 className="text-sm font-bold text-white mb-0.5">{g.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 mb-2">{g.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-0.5 rounded-lg bg-white/[0.06] text-slate-500">{g.cat}</span>
                <span className="glow-btn text-xs py-1 px-2.5">Play →</span>
              </div>
            </a>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="glass p-12 text-center">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-sm text-slate-500">No games match your search</p>
          </div>
        )}
      </div>
    </>
  )
}
