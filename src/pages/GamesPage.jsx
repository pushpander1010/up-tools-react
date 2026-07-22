import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

const games = [
  { slug: 'snake', title: 'Snake', icon: '🐍', desc: 'Classic snake game — eat, grow, survive.' },
  { slug: '2048', title: '2048', icon: '🔢', desc: 'Slide tiles and merge to reach 2048.' },
  { slug: 'tetris', title: 'Tetris', icon: '🧱', desc: 'Stack falling blocks and clear lines.' },
  { slug: 'pac-man', title: 'Pac-Man', icon: '👾', desc: 'Navigate the maze, eat dots, avoid ghosts.' },
  { slug: 'typing-speed', title: 'Typing Speed Test', icon: '⌨️', desc: 'Test your WPM and accuracy.' },
  { slug: 'hangman', title: 'Hangman', icon: '🪢', desc: 'Guess the word before the man hangs.' },
  { slug: 'quiz-trivia', title: 'Quiz Trivia', icon: '🧠', desc: '100+ general knowledge questions.' },
  { slug: 'tic-tac-toe', title: 'Tic-Tac-Toe', icon: '⭕', desc: 'Classic X and O against AI.' },
  { slug: 'memory-match', title: 'Memory Match', icon: '🃏', desc: 'Flip cards and find matching pairs.' },
  { slug: 'flappy-bird', title: 'Flappy Bird', icon: '🐦', desc: 'Tap to fly through obstacles.' },
  { slug: 'love-test', title: 'Love Compatibility Test', icon: '💘', desc: 'Fun love quiz for couples.' },
  { slug: 'friendship-test', title: 'Best Friend Compatibility', icon: '👫', desc: '2-player BFF quiz.' },
  { slug: 'word-scramble', title: 'Word Scramble', icon: '🔀', desc: 'Unscramble jumbled letters.' },
  { slug: 'dice-roller', title: 'Dice Roller', icon: '🎲', desc: 'Roll D4 to D20 virtual dice.' },
  { slug: 'coin-flip', title: 'Coin Flip', icon: '🪙', desc: 'Virtual coin toss with stats.' },
  { slug: 'ping-pong', title: 'Ping Pong', icon: '🏓', desc: 'Classic Pong against AI.' },
  { slug: 'wheel-of-names', title: 'Wheel of Names', icon: '🎡', desc: 'Spin a custom wheel to pick a winner.' },
]

export default function GamesPage() {
  return (
    <>
      <Helmet>
        <title>Free Online Games - Play Instant Browser Games | UpTools</title>
        <meta name="description" content="Play 24+ free browser games instantly — Snake, Tetris, Pac-Man, 2048, Quiz, and more. No download, no sign-up." />
      </Helmet>

      <section className="glass p-7 mb-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(244,63,94,0.1)' }} />
        <h1 className="text-3xl font-extrabold tracking-tight m-0 mb-2" style={{ background: 'linear-gradient(135deg, #fff, #f43f5e, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          🎮 Free Games
        </h1>
        <p className="text-slate-400 text-sm">Instant browser games — no download, no sign-up. Just click and play.</p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {games.map((g, i) => (
          <Link key={g.slug} to={`/games/${g.slug}/`}
            className="glass p-5 group relative overflow-hidden no-underline"
            style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: 'linear-gradient(90deg, transparent, #f43f5e, transparent)' }} />
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{g.icon}</div>
            <h3 className="text-base font-bold text-white mb-1">{g.title}</h3>
            <p className="text-xs text-slate-500">{g.desc}</p>
            <span className="glow-btn text-xs py-1.5 px-3 mt-3 inline-flex rounded-lg"
              style={{ background: 'linear-gradient(135deg, #f43f5e, #f97316)' }}>
              Play →
            </span>
          </Link>
        ))}
      </div>
    </>
  )
}
