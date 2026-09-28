import { useState, useCallback, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const TRUTHS = [
  "What is your most embarrassing moment in school?",
  "What is the last lie you told?",
  "Have you ever pretended to like a gift you hated?",
  "What is a secret hobby you've never told anyone about?",
  "Who is your celebrity crush right now?",
  "What is the most childish thing you still do?",
  "Have you ever snooped through someone's phone?",
  "What is your biggest pet peeve?",
  "If you could be invisible for a day, what would you do?",
  "What is the worst movie you've ever seen?",
  "Have you ever talked to yourself in the mirror?",
  "What is the funniest joke you know?",
  "If you could swap lives with anyone for a day, who?",
  "What is something you're secretly competitive about?",
  "Have you ever laughed so hard you cried?",
  "What is the worst food you've ever eaten?",
  "Do you still sleep with a stuffed animal?",
  "What is the most useless talent you have?",
  "Have you ever pretended to be someone else online?",
  "What is your guilty pleasure song?",
  "If you could ask your pet one question, what would it be?",
  "What is the weirdest search in your browser history?",
  "Have you ever broken something and blamed someone else?",
  "What is the bravest thing you've ever done?",
  "If you could time travel, would you go to the past or future?",
  "What is the most adventurous food you've tried?",
  "Have you ever written a secret diary entry?",
  "What is a rule you always break?",
  "If you won the lottery, what's the first thing you'd buy?",
  "What is your most irrational fear?",
  "Have you ever fallen asleep in class or a meeting?",
  "What is the strangest dream you've ever had?",
  "What song would be the theme song of your life?",
  "Have you ever pretended to read a book or paper?",
  "What is your hidden talent?",
  "If you could have any superpower, what would it be?",
  "What is the scariest thing you've ever done?",
  "Have you ever had a crush on a friend's sibling?",
  "What is your worst habit?",
  "What is the kindest thing a stranger has done for you?",
  "Have you ever kept a secret for over a year?",
  "What would your dream house look like?",
  "What is the last thing you Googled?",
  "Have you ever made up an excuse to leave a party early?",
]

const DARES = [
  "Do your best impression of a celebrity for 30 seconds.",
  "Speak in an accent for the next 3 rounds.",
  "Let the group choose your next social media profile picture.",
  "Do 10 push-ups right now.",
  "Sing the chorus of your favorite song out loud.",
  "Dance like nobody's watching for 20 seconds.",
  "Tell a joke that makes everyone groan.",
  "Make a funny face and keep it for the next round.",
  "Speak only in questions for the next 2 rounds.",
  "Call a friend and sing them happy birthday (even if it's not).",
  "Do your best animal impression.",
  "Act like a robot for the next minute.",
  "Tell the most dramatic story you can in 30 seconds.",
  "Swap shirts with the person to your left for 2 rounds.",
  "Balance a book on your head for 30 seconds.",
  "Do the chicken dance for 15 seconds.",
  "Write your name on a piece of paper using only your non-dominant hand.",
  "Spin around 5 times and then walk in a straight line.",
  "Make up a 4-line poem about the person to your right.",
  "Imitate a baby talking for the next round.",
  "Do a belly flop onto a pillow (safely!).",
  "Speak only in a whisper for the next 3 rounds.",
  "Pretend to be a news anchor delivering breaking news.",
  "Try to juggle 3 objects for 30 seconds.",
  "Do a dramatic reading of the last text message you received.",
  "Let someone draw a funny picture on your hand with a marker.",
  "Act out your favorite movie scene without words.",
  "Do 15 jumping jacks while counting backwards from 15.",
  "Make the person to your left laugh — you have 30 seconds.",
  "Speak in third person for the next 2 rounds.",
  "Do a slow-motion run across the room.",
  "Pretend your shoe is a phone and have a conversation.",
  "Recite the alphabet backwards as fast as you can.",
  "Give a 30-second motivational speech to a random object.",
  "Walk like a zombie for the next minute.",
  "Do your best impression of the host/game leader.",
  "Make up a handshake with the person across from you.",
  "Pretend to be a waiter taking everyone's order.",
  "Try to lick your elbow (everyone watches and laughs!).",
  "Do a handstand or hold a downward dog for 15 seconds.",
  "Draw a self-portrait in 30 seconds.",
  "Pretend to be a superhero introducing yourself.",
  "Speak like a pirate for the next 2 rounds.",
  "Do a dramatic hair flip.",
]

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
  return a
}

export default function truth_or_dare_generator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [mode, setMode] = useState('random')
  const [playerName, setPlayerName] = useState('')
  const [card, setCard] = useState(null)
  const [truthDeck, setTruthDeck] = useState(() => shuffleArray(TRUTHS))
  const [dareDeck, setDareDeck] = useState(() => shuffleArray(DARES))
  const [truthIdx, setTruthIdx] = useState(0)
  const [dareIdx, setDareIdx] = useState(0)

  const nextCard = useCallback(() => {
    let type, text

    if (mode === 'random') {
      type = Math.random() < 0.5 ? 'truth' : 'dare'
    } else {
      type = mode
    }

    if (type === 'truth') {
      if (truthIdx >= truthDeck.length) {
        const reshuffled = shuffleArray(TRUTHS)
        setTruthDeck(reshuffled)
        setTruthIdx(1)
        text = reshuffled[0]
      } else {
        text = truthDeck[truthIdx]
        setTruthIdx(prev => prev + 1)
      }
    } else {
      if (dareIdx >= dareDeck.length) {
        const reshuffled = shuffleArray(DARES)
        setDareDeck(reshuffled)
        setDareIdx(1)
        text = reshuffled[0]
      } else {
        text = dareDeck[dareIdx]
        setDareIdx(prev => prev + 1)
      }
    }

    setCard({ type, text, player: playerName.trim() || null })
    jumpTo()
  }, [mode, truthIdx, dareIdx, truthDeck, dareDeck, playerName, jumpTo])

  const modeOptions = [
    { value: 'truth', label: 'Truth', emoji: '🗣️' },
    { value: 'dare', label: 'Dare', emoji: '⚡' },
    { value: 'random', label: 'Random', emoji: '🎲' },
  ]

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400"

  return (
    <ToolLayout
      title="Truth or Dare Generator – Party Game Online"
      desc="Free online Truth or Dare generator with 40+ clean family-friendly truths and 40+ dares. Toggle Truth, Dare, or Random mode and play with friends."
      icon="🎉" iconBg="rgba(244,114,182,0.08)"
      category="fun" slug="truth-or-dare-generator"
      faq={[
        { q: "Are the questions family-friendly?", a: "Yes! All truths and dares are clean and appropriate for family game nights, parties, and all ages." },
        { q: "How does the deck system work?", a: "The generator shuffles all cards and draws them one by one. Once the deck is exhausted, it automatically reshuffles so you never see repeats until all cards have been played." },
        { q: "Do I need to enter player names?", a: "Player names are optional. If you enter a name, it will appear on the card for a more personalized experience." },
        { q: "Is this game free?", a: "Completely free with no sign-up. Works on mobile, tablet, and desktop browsers." },
      ]}
      howItWorks={[
        "Choose your mode: Truth, Dare, or let fate decide with Random.",
        "Optionally enter a player name to display on the card.",
        "Click Next Card to reveal your truth or dare challenge.",
        "Complete the challenge, then click Next Card again for the next one.",
        "When the deck runs out, it automatically reshuffles — no repeats until all cards are played.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Truth or Dare Generator", "applicationCategory": "GameApplication",
        "operatingSystem": "WebBrowser",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div className="flex gap-2">
            {modeOptions.map(m => (
              <button key={m.value} onClick={() => setMode(m.value)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold text-sm transition-all duration-200 ${
                  mode === m.value
                    ? 'border-pink-500/50 bg-pink-500/10 text-pink-400'
                    : 'border-white/8 bg-white/[0.04] text-slate-400 hover:border-white/15'
                }`}>
                <span>{m.emoji}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
          <input type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Player name (optional)" className={inputClass} />
        </div>

        <button onClick={nextCard}
          className="w-full py-4 rounded-2xl bg-pink-500 text-white font-bold text-sm hover:bg-pink-400 transition-all duration-200 active:scale-[0.98]">
          {card ? 'Next Card' : 'Start Playing'}
        </button>

        {card ? (
          <div ref={resultRef} className={`rounded-3xl border-2 p-6 sm:p-8 text-center overflow-hidden ${
            card.type === 'truth'
              ? 'border-sky-500/20 bg-gradient-to-br from-sky-500/[0.08] via-white/[0.01] to-transparent'
              : 'border-orange-500/20 bg-gradient-to-br from-orange-500/[0.08] via-white/[0.01] to-transparent'
          }`} style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
                card.type === 'truth'
                  ? 'text-sky-400 border-sky-500/30 bg-sky-500/10'
                  : 'text-orange-400 border-orange-500/30 bg-orange-500/10'
              }`}>
                {card.type === 'truth' ? '🗣️ Truth' : '⚡ Dare'}
              </span>
            </div>
            {card.player && (
              <p className="text-sm text-slate-400 font-bold mb-2">👤 {card.player}</p>
            )}
            <p className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
              {card.text}
            </p>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🎉</div>
            <p className="text-sm text-slate-600 font-medium">Pick a mode and click Start Playing</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
