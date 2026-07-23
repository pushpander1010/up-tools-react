import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'

const GAMES = [
  { slug: 'snake', title: 'Snake', icon: '🐍', desc: 'Eat food, grow your snake, avoid hitting yourself.', tags: ['arcade', 'classic', 'reflex'], href: '/games/snake/' },
  { slug: 'tetris', title: 'Tetris', icon: '🧱', desc: 'Arrange falling blocks to clear lines.', tags: ['puzzle', 'classic', 'arcade', 'brain'], href: '/games/tetris/' },
  { slug: '2048', title: '2048', icon: '🔢', desc: 'Slide and merge number tiles to reach 2048.', tags: ['puzzle', 'number', 'brain'], href: '/games/2048/' },
  { slug: 'flappy-bird', title: 'Flappy Bird', icon: '🐦', desc: 'Navigate through pipes in this addictive arcade game.', tags: ['arcade', 'reflex', 'classic'], href: '/games/flappy-bird/' },
  { slug: 'pac-man', title: 'Pac-Man', icon: '👾', desc: 'Eat dots and avoid ghosts in this classic arcade game.', tags: ['arcade', 'classic', 'reflex'], href: '/games/pac-man/' },
  { slug: 'space-invaders', title: 'Space Invaders', icon: '🛸', desc: 'Blast the alien fleet and beat your high score.', tags: ['arcade', 'reflex', 'classic'], href: '/games/space-invaders/' },
  { slug: 'breakout', title: 'Breakout', icon: '🧱', desc: 'Break all bricks with your paddle and ball.', tags: ['arcade', 'reflex', 'classic'], href: '/games/breakout/' },
  { slug: 'ping-pong', title: 'Ping Pong', icon: '🏓', desc: 'Classic Pong against AI. First to 7 wins!', tags: ['arcade', 'classic', 'reflex'], href: '/games/ping-pong/' },
  { slug: 'tic-tac-toe', title: 'Tic Tac Toe', icon: '⭕', desc: 'Play against AI or a friend in this classic game.', tags: ['classic', 'board', 'brain'], href: '/games/tic-tac-toe/' },
  { slug: 'connect-4', title: 'Connect 4', icon: '🔵', desc: 'Drop discs and line up four in a row vs the computer.', tags: ['classic', 'board', 'brain'], href: '/games/connect-4/' },
  { slug: 'minesweeper', title: 'Minesweeper', icon: '💣', desc: 'Flag mines and clear safe tiles to win.', tags: ['puzzle', 'logic', 'classic'], href: '/games/minesweeper/' },
  { slug: 'wordle', title: 'Wordle', icon: '🔤', desc: 'Guess the 5-letter word in 6 tries with color hints.', tags: ['word', 'puzzle', 'brain'], href: '/games/wordle/' },
  { slug: 'hangman', title: 'Hangman', icon: '🪢', desc: 'Guess the word letter by letter before time runs out.', tags: ['word', 'classic', 'puzzle', 'brain'], href: '/games/hangman/' },
  { slug: 'word-scramble', title: 'Word Scramble', icon: '🔀', desc: 'Unscramble jumbled letters to find the hidden word.', tags: ['word', 'puzzle', 'brain'], href: '/games/word-scramble/' },
  { slug: 'quiz-trivia', title: 'Quiz Trivia', icon: '🧠', desc: 'Test your general knowledge with 100+ trivia questions.', tags: ['quiz', 'brain', 'educational'], href: '/games/quiz-trivia/' },
  { slug: 'memory-match', title: 'Memory Match', icon: '🃏', desc: 'Flip cards and match pairs to test your memory.', tags: ['puzzle', 'brain'], href: '/games/memory-match/' },
  { slug: 'simon-says', title: 'Simon Says', icon: '🔴', desc: 'Remember and repeat the color sequence.', tags: ['brain', 'memory', 'reflex'], href: '/games/simon-says/' },
  { slug: 'rock-paper-scissors', title: 'Rock Paper Scissors', icon: '✂️', desc: 'Play the classic hand game against the computer.', tags: ['classic', 'quick', 'brain'], href: '/games/rock-paper-scissors/' },
  { slug: 'whack-a-mole', title: 'Whack-a-Mole', icon: '🔨', desc: 'Hit the moles as they pop up from their holes.', tags: ['arcade', 'reflex', 'quick'], href: '/games/whack-a-mole/' },
  { slug: 'typing-speed', title: 'Typing Speed Test', icon: '⌨️', desc: 'Test your WPM and accuracy. How fast can you type?', tags: ['quick', 'brain', 'educational'], href: '/games/typing-speed/' },
  { slug: 'number-guessing', title: 'Number Guessing', icon: '🎲', desc: 'Guess the hidden number in the fewest tries.', tags: ['quick', 'brain', 'logic'], href: '/games/number-guessing/' },
  { slug: 'color-rush', title: 'Color Rush', icon: '🌈', desc: 'Spot the odd color before time runs out.', tags: ['reflex', 'quick', 'puzzle'], href: '/games/color-rush/' },
  { slug: 'reaction-time', title: 'Reaction Time Test', icon: '⚡', desc: 'Tap as fast as you can when the screen turns green.', tags: ['reflex', 'quick', 'brain'], href: '/games/reaction-time/' },
  { slug: 'love-test', title: 'Love Compatibility Test', icon: '💘', desc: 'Fun love quiz for couples.', tags: ['quiz', 'fun', 'social'], href: '/games/love-test/' },
  { slug: 'friendship-test', title: 'Best Friend Compatibility', icon: '👫', desc: '2-player BFF quiz to test your friendship.', tags: ['quiz', 'fun', 'social'], href: '/games/friendship-test/' },
  { slug: 'dice-roller', title: 'Dice Roller', icon: '🎲', desc: 'Roll D4 to D20 virtual dice for board games and RPGs.', tags: ['casual', 'quick', 'fun'], href: '/games/dice-roller/' },
  { slug: 'coin-flip', title: 'Coin Flip', icon: '🪙', desc: 'Flip a virtual coin. Heads or tails? With stats.', tags: ['casual', 'quick', 'fun'], href: '/games/coin-flip/' },
  { slug: 'wheel-of-names', title: 'Wheel of Names', icon: '🎡', desc: 'Spin a custom wheel to pick a random winner.', tags: ['casual', 'quick', 'fun'], href: '/games/wheel-of-names/' },
  { slug: 'solitaire', title: 'Solitaire', icon: '🃏', desc: 'Classic Klondike card game. Build suits and clear the deck.', tags: ['classic', 'card', 'puzzle', 'casual'], href: '/games/solitaire/' },
]

const ALL_TAGS = [...new Set(GAMES.flatMap(g => g.tags))]

export default function games() {
  const [search, setSearch] = useState('')
  const [activeFilters, setActiveFilters] = useState(new Set())
  const [recent, setRecent] = useState(() => {
    try { return JSON.parse(localStorage.getItem('uptools-game-recent') || '[]') } catch { return [] }
  })
  const [favs, setFavs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('uptools-game-favs') || '[]') } catch { return [] }
  })

  const toggleFilter = useCallback((tag) => {
    setActiveFilters(prev => {
      const next = new Set(prev)
      if (next.has(tag)) next.delete(tag); else next.add(tag)
      return next
    })
  }, [])

  const filtered = useMemo(() => {
    let list = GAMES
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(g => g.title.toLowerCase().includes(q) || g.desc.toLowerCase().includes(q) || g.tags.some(t => t.includes(q)))
    }
    if (activeFilters.size > 0) {
      list = list.filter(g => [...activeFilters].some(f => g.tags.includes(f)))
    }
    return list
  }, [search, activeFilters])

  const recentGames = useMemo(() => recent.map(slug => GAMES.find(g => g.slug === slug)).filter(Boolean), [recent])
  const favGames = useMemo(() => favs.map(slug => GAMES.find(g => g.slug === slug)).filter(Boolean), [favs])

  const toggleFav = useCallback((slug) => {
    setFavs(prev => {
      const next = prev.includes(slug) ? prev.filter(s => s !== slug) : [slug, ...prev]
      localStorage.setItem('uptools-game-favs', JSON.stringify(next))
      return next
    })
  }, [])

  const GameCard = ({ game }) => (
    <a href={game.href} className="glass p-4 group relative overflow-hidden no-underline block">
      <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: 'linear-gradient(90deg, transparent, #f43f5e, transparent)' }} />
      <div className="flex items-start gap-3">
        <div className="text-2xl group-hover:scale-110 transition-transform">{game.icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-all">{game.title}</h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{game.desc}</p>
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {game.tags.slice(0, 3).map(t => (
              <span key={t} className="text-xs px-2 py-0.5 rounded-lg bg-white/[0.06] text-slate-500 capitalize">{t}</span>
            ))}
          </div>
        </div>
        <button onClick={e => { e.preventDefault(); toggleFav(game.slug) }}
          className="text-lg opacity-50 hover:opacity-100 transition-all shrink-0">
          {favs.includes(game.slug) ? '⭐' : '☆'}
        </button>
      </div>
    </a>
  )

  return (
    <ToolLayout
      title="Free Online Games"
      desc={`${GAMES.length}+ free browser games. No sign-ups. Mobile-friendly.`}
      icon="🎮" iconBg="rgba(99,102,241,0.08)"
      category="fun" slug="games"
      faq={[
        { q: "Are these games really free?", a: "Yes! All games are 100% free with no sign-ups required." },
        { q: "Do games work on mobile?", a: "Yes, all games are mobile-responsive with touch controls." },
        { q: "How many games are there?", a: `${GAMES.length}+ games across arcade, puzzle, word, board, and casual categories.` },
      ]}
      howItWorks={[
        "Browse or search games by name or category.",
        "Filter by tags like arcade, puzzle, brain, etc.",
        "Click any game to play instantly in your browser.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "Free Online Games", "applicationCategory": "GameApplication",
        "url": "https://www.uptools.in/games/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Stats */}
        <div className="glass p-4">
          <div className="flex gap-8 justify-center text-center">
            <div><div className="text-2xl font-extrabold text-white">{GAMES.length}</div><div className="text-xs text-slate-500 font-medium">Games</div></div>
            <div><div className="text-2xl font-extrabold text-white">0</div><div className="text-xs text-slate-500 font-medium">Sign-ups</div></div>
            <div><div className="text-2xl font-extrabold text-emerald-400">100%</div><div className="text-xs text-slate-500 font-medium">Free</div></div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="glass p-4 space-y-3">
          <div className="relative">
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search games (e.g., snake, puzzle, word)..."
              className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 pl-10 text-sm outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500" />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {ALL_TAGS.map(tag => (
              <button key={tag} onClick={() => toggleFilter(tag)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all border ${
                  activeFilters.has(tag)
                    ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400'
                    : 'bg-white/[0.04] border-white/[0.06] text-slate-500 hover:text-white hover:bg-white/[0.08]'
                }`}>
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Recent */}
        {recentGames.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-slate-400 mb-3">⏱️ Continue Playing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recentGames.slice(0, 4).map(g => <GameCard key={g.slug} game={g} />)}
            </div>
          </div>
        )}

        {/* Favourites */}
        {favGames.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-slate-400 mb-3">⭐ Your Favourites</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {favGames.map(g => <GameCard key={g.slug} game={g} />)}
            </div>
          </div>
        )}

        {/* All Games */}
        <div>
          <h2 className="text-sm font-bold text-slate-400 mb-3">🕹️ All Games ({filtered.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map(g => <GameCard key={g.slug} game={g} />)}
          </div>
          {filtered.length === 0 && (
            <div className="glass p-12 text-center">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-sm text-slate-500">No games match your search</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
