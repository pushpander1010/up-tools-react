import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

const games = [
  { slug: 'snake', title: 'Snake', icon: '🐍', desc: 'Classic snake game — eat, grow, survive.', cat: 'Arcade' },
  { slug: 'tetris', title: 'Tetris', icon: '🧱', desc: 'Stack falling blocks and clear lines.', cat: 'Puzzle' },
  { slug: '2048', title: '2048', icon: '🔢', desc: 'Slide tiles and merge to reach 2048.', cat: 'Puzzle' },
  { slug: 'flappy-bird', title: 'Flappy Bird', icon: '🐦', desc: 'Tap to fly through obstacles.', cat: 'Arcade' },
  { slug: 'pac-man', title: 'Pac-Man', icon: '👾', desc: 'Navigate the maze, eat dots, avoid ghosts.', cat: 'Arcade' },
  { slug: 'space-invaders', title: 'Space Invaders', icon: '🛸', desc: 'Blast the alien fleet and beat your high score.', cat: 'Arcade' },
  { slug: 'breakout', title: 'Breakout', icon: '🧱', desc: 'Break all bricks with your paddle and ball.', cat: 'Arcade' },
  { slug: 'ping-pong', title: 'Ping Pong', icon: '🏓', desc: 'Classic Pong against AI. First to 7 wins!', cat: 'Arcade' },
  { slug: 'tic-tac-toe', title: 'Tic-Tac-Toe', icon: '⭕', desc: 'Classic X and O against AI or friend.', cat: 'Board' },
  { slug: 'connect-4', title: 'Connect 4', icon: '🔵', desc: 'Drop discs and line up four in a row.', cat: 'Board' },
  { slug: 'minesweeper', title: 'Minesweeper', icon: '💣', desc: 'Flag mines and clear safe tiles to win.', cat: 'Puzzle' },
  { slug: 'wordle', title: 'Wordle', icon: '🔤', desc: 'Guess the 5-letter word in 6 tries.', cat: 'Word' },
  { slug: 'hangman', title: 'Hangman', icon: '🪢', desc: 'Guess the word before the man hangs.', cat: 'Word' },
  { slug: 'word-scramble', title: 'Word Scramble', icon: '🔀', desc: 'Unscramble jumbled letters.', cat: 'Word' },
  { slug: 'quiz-trivia', title: 'Quiz Trivia', icon: '🧠', desc: '100+ general knowledge questions.', cat: 'Trivia' },
  { slug: 'memory-match', title: 'Memory Match', icon: '🃏', desc: 'Flip cards and find matching pairs.', cat: 'Puzzle' },
  { slug: 'simon-says', title: 'Simon Says', icon: '🔴', desc: 'Remember and repeat the color sequence.', cat: 'Memory' },
  { slug: 'rock-paper-scissors', title: 'Rock Paper Scissors', icon: '✂️', desc: 'Play the classic hand game vs computer.', cat: 'Quick' },
  { slug: 'whack-a-mole', title: 'Whack-a-Mole', icon: '🔨', desc: 'Hit the moles as they pop up.', cat: 'Arcade' },
  { slug: 'typing-speed', title: 'Typing Speed Test', icon: '⌨️', desc: 'Test your WPM and accuracy.', cat: 'Typing' },
  { slug: 'number-guessing', title: 'Number Guessing', icon: '🎲', desc: 'Guess the hidden number in fewest tries.', cat: 'Quick' },
  { slug: 'color-rush', title: 'Color Rush', icon: '🌈', desc: 'Spot the odd color before time runs out.', cat: 'Quick' },
  { slug: 'reaction-time', title: 'Reaction Time', icon: '⚡', desc: 'Tap as fast as you can when it turns green.', cat: 'Quick' },
  { slug: 'love-test', title: 'Love Compatibility Test', icon: '💘', desc: 'Fun love quiz for couples.', cat: 'Quiz' },
  { slug: 'friendship-test', title: 'Best Friend Compatibility', icon: '👫', desc: '2-player BFF quiz.', cat: 'Quiz' },
  { slug: 'dice-roller', title: 'Dice Roller', icon: '🎲', desc: 'Roll D4 to D20 virtual dice.', cat: 'Casual' },
  { slug: 'coin-flip', title: 'Coin Flip', icon: '🪙', desc: 'Virtual coin toss with stats.', cat: 'Casual' },
  { slug: 'wheel-of-names', title: 'Wheel of Names', icon: '🎡', desc: 'Spin a custom wheel to pick a winner.', cat: 'Casual' },
  { slug: 'solitaire', title: 'Solitaire', icon: '🃏', desc: 'Classic Klondike card game.', cat: 'Card' },
]

export default function GamesPage() {
  return (
    <>
      <Helmet>
        <title>Free Online Games - Play Instant Browser Games | UpTools</title>
        <meta name="description" content="Play 29+ free browser games instantly — Snake, Tetris, Pac-Man, 2048, Wordle, Quiz, and more. No download, no sign-up." />
      </Helmet>

      <section className="glass p-7 mb-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(244,63,94,0.1)' }} />
        <h1 className="text-3xl font-extrabold tracking-tight m-0 mb-2" style={{ background: 'linear-gradient(135deg, #fff, #f43f5e, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          🎮 Free Games
        </h1>
        <p className="text-slate-400 text-sm">{games.length}+ instant browser games — no download, no sign-up. Just click and play.</p>
      </section>

      {/* Featured Games */}
      <div className="mb-6">
        <h2 className="text-sm font-bold text-slate-400 mb-3">🔥 Most Popular</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {games.slice(0, 6).map((g) => (
            <a key={g.slug} href={`/games/${g.slug}/`}
              className="glass p-5 group relative overflow-hidden no-underline block">
              <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'linear-gradient(90deg, transparent, #f43f5e, transparent)' }} />
              <div className="flex items-center gap-3">
                <div className="text-4xl group-hover:scale-110 transition-transform">{g.icon}</div>
                <div>
                  <h3 className="text-base font-bold text-white mb-0.5">{g.title}</h3>
                  <p className="text-xs text-slate-500">{g.desc}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* All Games */}
      <div>
        <h2 className="text-sm font-bold text-slate-400 mb-3">🕹️ All Games ({games.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {games.map((g) => (
            <a key={g.slug} href={`/games/${g.slug}/`}
              className="glass p-5 group relative overflow-hidden no-underline block">
              <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'linear-gradient(90deg, transparent, #f43f5e, transparent)' }} />
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{g.icon}</div>
              <h3 className="text-sm font-bold text-white mb-1">{g.title}</h3>
              <p className="text-xs text-slate-500">{g.desc}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs px-2 py-0.5 rounded bg-white/[0.06] text-slate-500">{g.cat}</span>
                <span className="glow-btn text-xs py-1 px-2.5 rounded-lg inline-flex"
                  style={{ background: 'linear-gradient(135deg, #f43f5e, #f97316)' }}>
                  Play →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  )
}
