import { useState, useCallback, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const LS = { STATS: 'ut_wordle_stats_v1', LAST: 'ut_wordle_last_v1' }

// Curated word lists (common 5-letter English words)
const ANSWERS = [
  'about','above','actor','acute','admit','adopt','adult','after','again','agent',
  'agree','ahead','alarm','album','alert','alien','align','alive','allow','alone',
  'alter','among','angel','anger','angle','angry','anime','ankle','apart','apple',
  'apply','arena','argue','arise','avoid','awake','award','aware','badge','baker',
  'basic','beach','beard','begun','being','below','bench','berry','birth','black',
  'blade','blame','blank','blast','blaze','bleed','blend','bless','blind','blink',
  'bliss','block','bloom','blown','board','bonus','boost','brain','brand','brave',
  'bread','break','breed','brick','brief','bring','broad','broke','brown','brush',
  'buddy','build','bunch','burst','buyer','cabin','candy','carry','catch','cause',
  'cease','chain','chair','chalk','chant','chaos','charm','chart','chase','cheap',
  'check','cheek','cheer','chess','chest','chief','child','chill','china','choir',
  'claim','clash','class','clean','clear','climb','cling','clock','clone','close',
  'cloud','coach','coast','could','count','court','cover','crack','craft','crane',
  'crash','crawl','crazy','cream','crest','crime','crisp','cross','crowd','crown',
  'cruel','crush','curve','cycle','daily','dance','death','debut','delay','demon',
  'depth','diary','dirty','dizzy','dodge','doing','doubt','dough','draft','drain',
  'drake','drama','drank','drawn','dream','dress','drink','drive','droit','drown',
  'drunk','dryer','dying','eager','early','earth','eight','elder','elect','elite',
  'email','ember','empty','enemy','enjoy','enter','entry','equal','error','essay',
  'event','every','exact','exile','exist','extra','faint','fairy','faith','false',
  'fancy','fault','feast','fence','ferry','fetch','fever','fewer','fiber','field',
  'fifth','fifty','fight','final','first','flame','flash','fleet','flesh','float',
  'flood','floor','flour','fluid','flush','focal','focus','force','forge','forth',
  'forum','found','frame','frank','fraud','fresh','front','frost','froze','fruit',
  'gauge','ghost','giant','given','glass','gleam','glide','globe','gloom','glove',
  'going','grace','grade','grain','grand','grant','graph','grasp','grass','grave',
  'great','greed','green','greet','grief','grill','grind','groan','groom','gross',
  'group','grove','grown','guard','guess','guest','guide','guild','guilt','guise',
  'happy','harsh','haste','haunt','haven','heart','heavy','hedge','hence','hobby',
  'honey','honor','horse','hotel','house','human','humor','hurry','ideal','image',
  'imply','index','indie','inner','input','irony','issue','ivory','jewel','joint',
  'joker','judge','juice','karma','knife','knock','known','label','large','laser',
  'latch','later','laugh','layer','learn','least','leave','legal','lemon','level',
  'light','limit','linen','liver','lodge','logic','login','loose','lover','lower',
  'loyal','lucky','lunch','lying','magic','major','maker','manor','march','match',
  'maybe','mayor','media','mercy','merit','metal','might','mimic','minor','minus',
  'model','money','month','moral','mount','mouse','mouth','movie','music','naive',
  'nerve','never','night','noble','noise','north','novel','nurse','occur','ocean',
  'offer','often','olive','onset','opera','orbit','order','organ','other','ought',
  'outer','owner','oxide','ozone','paint','panel','panic','paper','party','pasta',
  'patch','pause','peace','peach','penny','phase','phone','photo','piano','piece',
  'pilot','pinch','pitch','pixel','pizza','place','plain','plane','plant','plate',
  'plaza','plead','pluck','plumb','plume','point','polar','porch','posed','power',
  'press','price','pride','prime','print','prior','prize','proof','proud','prove',
  'psalm','pulse','punch','pupil','purse','queen','query','quest','queue','quick',
  'quiet','quota','quote','radar','radio','raise','rally','ranch','range','rapid',
  'ratio','reach','react','ready','realm','rebel','refer','reign','relax','relay',
  'remit','renew','repay','reply','rider','ridge','rifle','right','rigid','risky',
  'rival','river','robot','rocky','roman','rouge','rough','round','route','royal',
  'ruler','rural','sadly','saint','salad','sauce','scale','scare','scene','scent',
  'scope','score','scout','scrap','sense','serve','seven','shade','shaft','shake',
  'shall','shame','shape','share','shark','sharp','shawl','sheep','sheer','sheet',
  'shelf','shell','shift','shine','shirt','shock','shoot','shore','short','shout',
  'sight','sigma','since','sixth','sixty','skill','skull','slash','slate','sleep',
  'slice','slide','slope','small','smart','smell','smile','smoke','snake','solar',
  'solid','solve','sorry','south','space','spare','spark','speak','speed','spend',
  'spill','spine','spite','split','spoke','sport','spray','squad','stack','staff',
  'stage','stain','stake','stale','stall','stamp','stand','stare','stark','start',
  'state','steam','steel','steep','steer','stern','stick','stiff','still','stock',
  'stone','stood','store','storm','story','stout','stove','strip','stuck','study',
  'stuff','style','sugar','suite','super','surge','swamp','swarm','swear','sweep',
  'sweet','swift','swing','swirl','sword','syrup','table','taste','teach','teeth',
  'their','theme','thick','thing','think','third','thorn','those','three','threw',
  'throw','thumb','tiger','tight','timer','tired','title','toast','today','token',
  'total','touch','tough','tower','toxic','trace','track','trade','trail','train',
  'trait','trash','treat','trend','trial','tribe','trick','tried','truly','trump',
  'trunk','trust','truth','tumor','twice','twist','ultra','uncle','under','union',
  'unite','unity','until','upper','upset','urban','usage','usual','utter','vague',
  'valid','value','vapor','vault','video','vigor','vinyl','viral','virus','visit',
  'vista','vital','vivid','vocal','vodka','voice','voter','wages','waste','watch',
  'water','weary','weave','wedge','weigh','weird','whale','wheat','wheel','where',
  'which','while','white','whole','whose','woman','world','worry','worse','worst',
  'worth','would','wound','wrath','write','wrong','wrote','yacht','yield','young',
  'yours','youth','zero','zone'
]

const VALID_WORDS = new Set([...ANSWERS, ...[
  'abort','abuse','ached','acids','acorn','acres','acted','adapt','added','adept',
  'adore','adorn','aged','aegis','agents','afoot','agile','agile','aging','aglow',
  'agony','aides','aisle','alarm','alien','allay','alley','allot','allow','alloy',
  'aloft','along','aloof','altar','amber','amble','amend','ample','amuse','angel',
  'anger','angle','angry','anime','ankle','annex','antic','anvil','aorta','apart',
  'apple','apply','arena','arise','armor','aroma','arose','array','arrow','arson',
  'aside','asset','atlas','attic','audio','audit','avail','avert','avoid','await',
  'awake','award','aware','awful','azure','bacon','badge','badly','bagel','baker',
  'balmy','banal','banjo','baron','based','basic','basin','basis','batch','bathe',
  'beach','beard','beast','begin','being','below','bench','berry','birth','black',
  'blade','blame','bland','blank','blast','blaze','bleak','bleat','bleed','blend',
  'bless','blind','blink','bliss','blitz','bloat','block','blond','blood','bloom',
  'blown','bluff','blunt','blurt','blush','board','boast','bonus','boost','booth',
  'bound','brace','brain','brake','brass','brave','brawl','bread','break','breed',
  'brick','bride','brief','brine','bring','brink','brisk','broad','broil','brood',
  'brook','broth','brown','brush','brute','budge','buddy','build','bulge','bully',
  'bunch','burst','buyer','cabin','cable','camel','candy','cargo','carry','catch',
  'cater','cause','cedar','chain','chair','chalk','champ','chant','chaos','charm',
  'chart','chase','cheap','check','cheek','cheer','chess','chest','chief','child',
  'chili','chill','china','chirp','choir','choke','chord','chore','chose','chunk',
  'churn','cider','cigar','civic','civil','claim','clamp','clash','clasp','class',
  'clean','clear','clerk','click','cliff','climb','cling','cloak','clock','clone',
  'close','cloth','cloud','clout','clown','coach','coast','cobra','comet','comic',
  'comma','conch','coral','couch','could','count','coupe','court','cover','crack',
  'craft','cramp','crane','crash','crate','crave','crawl','craze','creak','cream',
  'creek','creep','crest','crime','crimp','crisp','cross','crowd','crown','crude',
  'cruel','crush','crust','cubic','curse','curve','cycle','daily','dairy','dance',
  'debug','decay','decoy','decry','defer','deity','delay','delta','demon','dense',
  'depot','depth','derby','detox','diary','digit','diner','dirty','disco','ditch',
  'dodge','doubt','dough','draft','drain','drake','drama','drape','drawl','drawn',
  'dread','dress','dried','drift','drill','drink','drive','droit','droll','drone',
  'drool','droop','drops','dross','drove','drown','drunk','dryer','dryly','duchy',
  'dunce','dwarf','dwell','dying','eager','eagle','early','earth','easel','eaten',
  'eaves','ebony','edict','eight','elbow','elder','elect','elite','elope','elude',
  'email','ember','emcee','empty','endow','enemy','enjoy','enter','entry','envoy',
  'epoch','equal','equip','erect','erode','error','essay','ether','evade','event',
  'every','evict','evoke','exact','exalt','excel','exert','exile','exist','expat',
  'expel','extra','exude','fable','facet','faint','fairy','faith','false','fancy',
  'farce','fatal','fatty','fault','fauna','feast','feint','fence','ferry','fetch',
  'fever','fiber','field','fiend','fifth','fifty','fight','filth','final','finch',
  'first','flame','flank','flare','flash','flask','fleet','flesh','flick','fling',
  'flint','float','flock','flood','floor','flora','flour','flout','fluid','fluke',
  'flung','flunk','flush','flute','focal','foggy','folly','force','forge','forte',
  'forth','forty','forum','fossil','foster','found','foyer','frail','frame','frank',
  'fraud','freak','freed','fresh','friar','fried','front','frost','frown','froze',
  'fruit','frump','fudge','fully','fungi','furry','fussy','fuzzy','gamma','gauge',
  'gaunt','gavel','giddy','given','gland','glare','glass','gleam','glide','glint',
  'globe','gloom','glory','gloss','glove','goose','gorge','gouge','grace','grade',
  'graft','grain','grand','grant','grape','graph','grasp','grass','grate','grave',
  'gravy','graze','great','greed','green','greet','grief','grill','grime','grimy',
  'grind','gripe','groan','groin','groom','grope','gross','group','grove','growl',
  'grown','gruel','gruff','guard','guava','guess','guest','guide','guild','guilt',
  'guise','gulch','gully','gummy','gusto','gusty','gypsy','habit','hairy','haste',
  'hasty','hatch','haunt','haven','heart','heavy','hedge','hefty','heron','hinge',
  'hippo','hitch','hoard','hobby','honey','honor','horse','hotel','hound','house',
  'human','humid','humor','hurry','hyena','ideal','image','imply','index','inept',
  'inert','infer','ingot','inner','input','inter','intro','irate','irony','issue',
  'ivory','jazzy','jewel','joker','jolly','judge','juice','juicy','karma','kayak',
  'knack','knead','kneel','knelt','knife','knock','knoll','label','lance','large',
  'laser','latch','later','lathe','laugh','layer','leach','learn','lease','leash',
  'least','leave','ledge','leech','legal','lemon','level','lever','light','lilac',
  'limit','linen','liner','lingo','llama','lodge','lofty','logic','loopy','loose',
  'lorry','lover','lower','loyal','lucid','lucky','lunar','lunch','lunge','lying',
  'lymph','lynch','lyric','macro','magic','major','maker','manor','maple','march',
  'marry','marsh','mason','match','maxim','maybe','mayor','mealy','media','mercy',
  'merit','merry','metal','meter','might','mimic','mince','miner','minor','minus',
  'mirth','model','moist','money','month','moose','moral','morph','mossy','motel',
  'motor','motto','mound','mount','mourn','mouse','mouth','movie','mower','mucus',
  'muddy','mural','murky','music','musty','naive','nerve','never','newly','niche',
  'night','noble','noise','north','notch','noted','novel','nudge','nurse','nylon',
  'occur','ocean','offer','often','olive','onset','opera','optic','orbit','order',
  'other','ought','outer','outdo','oxide','ozone','paint','paler','palsy','panel',
  'panic','paper','party','pasta','paste','patch','pause','peace','peach','pearl',
  'pedal','penal','perch','peril','petty','phase','phone','photo','piano','piece',
  'pilot','pinch','pitch','pixel','pizza','place','plaid','plain','plane','plank',
  'plant','plate','plaza','plead','pleat','plied','pluck','plumb','plume','plump',
  'plunk','plush','point','poker','polar','polio','polyp','poppy','porch','posed',
  'poser','pouch','pound','power','prank','prawn','press','price','pride','prime',
  'print','prior','prism','prize','probe','prone','proof','prose','proud','prove',
  'prowl','prude','prune','psalm','pulse','punch','pupil','purge','purse','pushy',
  'quack','quail','quake','qualm','queen','query','quest','queue','quick','quiet',
  'quill','quirk','quota','quote','rabbi','radar','radio','rally','ranch','range',
  'rapid','ratio','raven','reach','react','ready','realm','rebel','reign','relay',
  'remit','renal','renew','repay','repel','reply','resin','retro','rider','ridge',
  'rifle','right','rigid','risky','rival','river','roast','robin','robot','rocky',
  'rogue','rouge','rough','round','route','rover','royal','ruin','ruler','rumba',
  'rumor','rural','rusty','sadly','saint','salad','salon','salty','salve','sandy',
  'savor','scale','scalp','scare','scarf','scene','scent','scone','scope','score',
  'scout','scowl','scram','scrap','scrub','seize','sense','serum','serve','seven',
  'sever','shade','shaft','shake','shall','shame','shape','shard','share','shark',
  'sharp','shawl','shear','sheen','sheep','sheer','sheet','shelf','shell','shift',
  'shire','shirt','shock','shore','short','shout','shove','shown','shrub','shrug',
  'siege','sight','sigma','since','siren','sixth','sixty','skate','skill','skimp',
  'skull','slate','slave','sleek','sleep','sleet','slice','slide','slime','sling',
  'slink','slope','sloth','slump','smack','small','smart','smear','smell','smelt',
  'smile','smirk','smite','smith','smock','smoke','smoky','snack','snake','snare',
  'sneak','snide','snoop','snore','snort','snout','solar','solid','solve','sonic',
  'sorry','sound','south','space','spade','spank','spare','spark','speak','spear',
  'speed','spell','spend','spent','spice','spicy','spill','spine','spite','spoke',
  'spook','spool','spoon','sport','spray','sprig','squad','squid','stack','staff',
  'stage','stain','stair','stake','stale','stall','stamp','stand','stank','stare',
  'stark','start','stave','steam','steel','steep','steer','stern','stick','stiff',
  'still','sting','stink','stock','stoic','stoke','stole','stomp','stone','stood',
  'stool','stoop','store','stork','storm','story','stout','stove','strap','straw',
  'stray','strip','strut','stuck','study','stuff','stump','stung','stunk','style',
  'sugar','suite','super','surge','swamp','swarm','swear','sweat','sweep','sweet',
  'swell','swept','swift','swill','swine','swing','swipe','swirl','sword','swore',
  'sworn','swung','syrup','table','tacit','taint','taken','talon','taste','taunt',
  'teach','teeth','tempo','tenor','tense','tepid','tenth','theme','there','thick',
  'thief','thing','think','third','thorn','those','three','threw','throw','thumb',
  'thump','tiger','tight','tilth','timer','timid','tired','titan','title','toast',
  'today','token','tonal','tooth','topic','torch','total','touch','tough','towel',
  'tower','toxic','trace','track','trade','trail','train','trait','tramp','trash',
  'tread','treat','trend','triad','trial','tribe','trick','tried','trite','troll',
  'troop','trout','truce','truly','trump','trunk','trust','truth','tumor','tunic',
  'twice','twist','tying','ultra','uncle','under','undid','undue','unfit','unify',
  'union','unite','unity','unlit','until','upper','upset','urban','usage','usher',
  'usual','utter','vague','valid','valor','value','valve','vapor','vault','vaunt',
  'venom','venue','verge','verse','vigor','vinyl','viola','viper','viral','virus',
  'visit','vista','vital','vivid','vocal','vodka','vogue','voice','voter','vouch',
  'vowel','vulva','wacky','wager','wagon','waist','waste','watch','water','weary',
  'weave','wedge','weedy','weigh','weird','whale','wheat','wheel','where','which',
  'while','whine','whirl','white','whole','whose','widen','width','wield','windy',
  'witch','woman','world','worry','worse','worst','worth','would','wound','wrack',
  'wrath','wreak','wreck','wring','wrist','write','wrong','wrote','yacht','yearn',
  'yield','young','yours','youth','zebra','zippy','zonal'
]])

const KEY_ROWS = ['QWERTYUIOP','ASDFGHJKL','ZXCVBNM']

function getFeedback(guess, answer) {
  const feedback = Array(5).fill('absent')
  const answerArr = answer.split('')
  const guessArr = guess.split('')
  // First pass: correct positions
  for (let i = 0; i < 5; i++) {
    if (guessArr[i] === answerArr[i]) {
      feedback[i] = 'correct'
      answerArr[i] = null
      guessArr[i] = null
    }
  }
  // Second pass: wrong position
  for (let i = 0; i < 5; i++) {
    if (guessArr[i] === null) continue
    const idx = answerArr.indexOf(guessArr[i])
    if (idx !== -1) {
      feedback[i] = 'present'
      answerArr[idx] = null
    }
  }
  return feedback
}

function getKeyStates(guesses, feedbacks) {
  const states = {}
  for (let i = 0; i < guesses.length; i++) {
    for (let j = 0; j < 5; j++) {
      const key = guesses[i][j]
      const fb = feedbacks[i][j]
      if (fb === 'correct') states[key] = 'correct'
      else if (fb === 'present' && states[key] !== 'correct') states[key] = 'present'
      else if (!states[key]) states[key] = 'absent'
    }
  }
  return states
}

const COLORS = {
  correct: 'bg-emerald-500',
  present: 'bg-yellow-500',
  absent: 'bg-slate-700',
  empty: 'bg-transparent border-2 border-slate-600'
}

export default function games_wordle() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [answer, setAnswer] = useState(() => ANSWERS[Math.floor(Math.random()*ANSWERS.length)])
  const [guesses, setGuesses] = useState([])
  const [feedbacks, setFeedbacks] = useState([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [gameState, setGameState] = useState('playing') // playing, won, lost
  const [stats, setStats] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS.STATS)) || { played:0, won:0, streak:0, maxStreak:0, dist:[0,0,0,0,0,0] } }
    catch { return { played:0, won:0, streak:0, maxStreak:0, dist:[0,0,0,0,0,0] } }
  })
  const [shakeRow, setShakeRow] = useState(-1)
  const [revealedRows, setRevealedRows] = useState([])
  const [hardMode, setHardMode] = useState(false)
  const [toast, setToast] = useState('')
  const [showStats, setShowStats] = useState(false)
  const inputRef = useRef(null)
  const toastTimer = useRef(null)

  useEffect(() => { try { localStorage.setItem(LS.STATS, JSON.stringify(stats)) } catch {} }, [stats])

  const showToast = useCallback((msg) => {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 2000)
  }, [])

  const validateHardMode = useCallback((guess) => {
    if (!hardMode || guesses.length === 0) return true
    for (let i = 0; i < guesses.length; i++) {
      for (let j = 0; j < 5; j++) {
        if (feedbacks[i][j] === 'correct' && guess[j] !== guesses[i][j]) {
          showToast(`${j+1}th letter must be ${guesses[i][j].toUpperCase()}`)
          return false
        }
        if (feedbacks[i][j] === 'present' && !guess.includes(guesses[i][j])) {
          showToast(`Guess must contain ${guesses[i][j].toUpperCase()}`)
          return false
        }
      }
    }
    return true
  }, [guesses, feedbacks, hardMode, showToast])

  const submitGuess = useCallback(() => {
    if (gameState !== 'playing') return
    if (currentGuess.length !== 5) { showToast('Not enough letters'); setShakeRow(guesses.length); setTimeout(()=>setShakeRow(-1),600); return }
    if (!VALID_WORDS.has(currentGuess)) { showToast('Not in word list'); setShakeRow(guesses.length); setTimeout(()=>setShakeRow(-1),600); return }
    if (!validateHardMode(currentGuess)) { setShakeRow(guesses.length); setTimeout(()=>setShakeRow(-1),600); return }

    const fb = getFeedback(currentGuess, answer)
    const newGuesses = [...guesses, currentGuess]
    const newFeedbacks = [...feedbacks, fb]
    setGuesses(newGuesses)
    setFeedbacks(newFeedbacks)
    setCurrentGuess('')

    // Trigger flip animation
    setTimeout(() => setRevealedRows(prev => [...prev, newGuesses.length - 1]), 50)

    // Check win/lose
    if (currentGuess === answer) {
      setTimeout(() => {
        setGameState('won')
        setStats(prev => {
          const newDist = [...prev.dist]
          newDist[newGuesses.length - 1]++
          return { played: prev.played + 1, won: prev.won + 1, streak: prev.streak + 1, maxStreak: Math.max(prev.maxStreak, prev.streak + 1), dist: newDist }
        })
        try { localStorage.setItem(LS.LAST, JSON.stringify({ guesses: newGuesses.length, word: answer })) } catch {}
      }, 50 * 5 + 300)
    } else if (newGuesses.length >= 6) {
      setTimeout(() => {
        setGameState('lost')
        setStats(prev => ({ played: prev.played + 1, won: prev.won, streak: 0, maxStreak: Math.max(prev.maxStreak, prev.streak), dist: prev.dist }))
      }, 50 * 5 + 300)
    }
  }, [currentGuess, guesses, feedbacks, answer, gameState, validateHardMode, showToast])

  const handleKeyDown = useCallback((e) => {
    if (gameState !== 'playing') return
    if (e.key === 'Enter') { submitGuess(); return }
    if (e.key === 'Backspace') { setCurrentGuess(prev => prev.slice(0, -1)); return }
    if (/^[a-zA-Z]$/.test(e.key) && currentGuess.length < 5) {
      setCurrentGuess(prev => prev + e.key.toLowerCase())
      playTone(300 + currentGuess.length * 60, 0.05, 'sine', 0.04)
    }
  }, [gameState, currentGuess.length, submitGuess])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const handleKeyClick = useCallback((key) => {
    if (gameState !== 'playing') return
    if (key === 'ENTER') { submitGuess(); return }
    if (key === 'BACK') { setCurrentGuess(prev => prev.slice(0, -1)); return }
    if (currentGuess.length < 5) {
      setCurrentGuess(prev => prev + key.toLowerCase())
      playTone(300 + currentGuess.length * 60, 0.05, 'sine', 0.04)
    }
  }, [gameState, currentGuess.length, submitGuess])

  const newGame = useCallback(() => {
    setAnswer(ANSWERS[Math.floor(Math.random()*ANSWERS.length)])
    setGuesses([])
    setFeedbacks([])
    setCurrentGuess('')
    setGameState('playing')
    setRevealedRows([])
    setShowStats(false)
  }, [])

  const shareResults = useCallback(() => {
    const rows = feedbacks.map(fb => fb.map(f => f === 'correct' ? '🟩' : f === 'present' ? '🟨' : '⬛').join('')).join('\n')
    const text = `Wordle ${guesses.length}/6${hardMode ? '*' : ''}\n\n${rows}\n\nhttps://www.uptools.in/games/wordle/`
    if (navigator.share) navigator.share({ text }).catch(() => {})
    else { navigator.clipboard?.writeText(text); showToast('Copied to clipboard!') }
  }, [guesses, feedbacks, hardMode, showToast])

  const keyStates = getKeyStates(guesses, feedbacks)

  return (
    <ToolLayout
      title="Wordle Online - Free Word Guessing Game"
      desc="Play Wordle online for free! Guess the 5-letter word in 6 tries. Get color-coded feedback after each guess. Play daily or unlimited rounds."
      icon="🔤"
      iconBg="rgba(34,197,94,0.08)"
      category="fun"
      slug="games-wordle"
      faq={[
        { q: "How do I play Wordle?", a: "Type a 5-letter word and press Enter. Green means correct letter in correct position, yellow means correct letter wrong position, gray means letter is not in the word." },
        { q: "What is Hard Mode?", a: "In Hard Mode, you must use revealed hints in subsequent guesses. If a letter was revealed as green or yellow, it must appear in that position or be included in your guess." },
        { q: "Can I share my results?", a: "Yes! After completing a game, tap the Share button to copy your results as an emoji grid to share with friends." },
        { q: "How are my statistics tracked?", a: "Your games played, win percentage, current streak, and guess distribution are saved locally on your device." },
      ]}
      howItWorks={[
        "Type any valid 5-letter word and press Enter to submit your guess.",
        "After each guess, tiles change color: green (correct), yellow (wrong position), gray (not in word).",
        "Use the color clues to narrow down the answer in 6 attempts or fewer.",
        "Toggle Hard Mode for an extra challenge — revealed hints must be used.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "VideoGame",
        "name": "Wordle Online", "applicationCategory": "Game",
        "url": "https://www.uptools.in/games/wordle/",
        "genre": "Word Game", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-lg mx-auto space-y-5">
        {/* Toast */}
        {toast && <div className="text-center text-sm font-bold text-white bg-slate-800 py-2 px-4 rounded-xl animate-pulse">{toast}</div>}

        {/* Controls */}
        <div className="flex gap-2 justify-center items-center">
          <button onClick={() => setHardMode(h => !h)}
             className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${hardMode ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400' : 'bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:bg-white/[0.1]'}`}>
            {hardMode ? '🔒 Hard' : '🔓 Normal'}
          </button>
          <button onClick={() => setShowStats(s => !s)} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all">
            📊 Stats
          </button>
          <button onClick={newGame} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all">
            ⟲ New
          </button>
        </div>

        {/* Stats modal */}
        {showStats && (
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
            <h3 className="text-center text-lg font-bold text-white">Statistics</h3>
            <div className="grid grid-cols-4 gap-3 text-center">
              {[
                { val: stats.played, label: 'Played' },
                { val: stats.played ? Math.round(stats.won/stats.played*100) : 0, label: 'Win %' },
                { val: stats.streak, label: 'Streak' },
                { val: stats.maxStreak, label: 'Max Streak' },
              ].map(s => <div key={s.label}><div className="text-xl font-bold text-white">{s.val}</div><div className="text-xs text-slate-500">{s.label}</div></div>)}
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-2">Guess Distribution</h4>
              {stats.dist.map((count, i) => (
                <div key={i} className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-slate-400 w-3">{i+1}</span>
                  <div className="flex-1 h-5 rounded" style={{background: count > 0 ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.06)'}}>
                    <div className="h-full rounded text-xs font-bold text-white flex items-center justify-end px-2" style={{width:`${Math.max(8, count/Math.max(...stats.dist,1)*100)}%`, background:'rgba(99,102,241,0.7)'}}>
                      {count > 0 && count}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Game grid */}
        <div ref={resultRef} className="flex flex-col items-center gap-1.5 py-2">
          {Array.from({length: 6}).map((_, row) => (
            <div key={row} className={`flex gap-1.5 ${shakeRow === row ? 'animate-shake' : ''}`} style={shakeRow === row ? {animation:'shake 0.5s ease'} : {}}>
              {Array.from({length: 5}).map((_, col) => {
                const isCurrentRow = row === guesses.length && gameState === 'playing'
                const isPastRow = row < guesses.length
                const letter = isPastRow ? guesses[row][col] : isCurrentRow ? currentGuess[col] || '' : ''
                const fb = isPastRow ? feedbacks[row][col] : null
                const isRevealed = revealedRows.includes(row)

                let bgClass = 'bg-transparent border-2 border-slate-600'
                if (isPastRow && fb) {
                  if (fb === 'correct') bgClass = 'bg-emerald-500 border-emerald-500'
                  else if (fb === 'present') bgClass = 'bg-yellow-500 border-yellow-500'
                  else bgClass = 'bg-slate-700 border-slate-700'
                } else if (isCurrentRow && letter) {
                  bgClass = 'bg-transparent border-2 border-slate-400'
                }

                return (
                  <div key={col}
                    className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-xl sm:text-2xl font-bold uppercase text-white ${bgClass} rounded-md transition-all`}
                    style={isPastRow && isRevealed ? {
                      animation: `flipIn 0.3s ease ${col * 0.05}s`,
                      animationFillMode: 'both'
                    } : {}}>
                    {letter}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* On-screen keyboard */}
        <div className="space-y-1.5">
          {KEY_ROWS.map(row => (
            <div key={row} className="flex justify-center gap-1">
              {row === 'ZXCVBNM' && <div className="w-6"/>}
              {row.split('').map(key => {
                const state = keyStates[key]
                let bg = 'bg-slate-700'
                if (state === 'correct') bg = 'bg-emerald-600'
                else if (state === 'present') bg = 'bg-yellow-600'
                else if (state === 'absent') bg = 'bg-slate-800'
                return (
                  <button key={key} onClick={() => handleKeyClick(key)}
                    className={`${bg} text-white text-sm font-bold rounded-md h-12 flex-1 max-w-10 flex items-center justify-center active:scale-95 transition-transform`}>
                    {key}
                  </button>
                )
              })}
              {row === 'ZXCVBNM' && <div className="w-6"/>}
            </div>
          ))}
          <div className="flex justify-center gap-1">
            <button onClick={() => handleKeyClick('ENTER')}
              className="bg-slate-700 text-white text-xs font-bold rounded-md h-12 px-3 flex items-center justify-center active:scale-95 transition-transform">
              ENTER
            </button>
            <button onClick={() => handleKeyClick('BACK')}
              className="bg-slate-700 text-white text-xs font-bold rounded-md h-12 px-3 flex items-center justify-center active:scale-95 transition-transform">
              ⌫
            </button>
          </div>
        </div>

        {/* Game over */}
        {gameState !== 'playing' && (
          <div className="text-center p-5 bg-black/30 rounded-2xl border border-white/[0.06] space-y-3">
            <div className="text-4xl">{gameState === 'won' ? '🎉' : '😢'}</div>
            <h2 className="text-xl font-bold text-white">{gameState === 'won' ? 'Brilliant!' : `The word was: ${answer.toUpperCase()}`}</h2>
            {gameState === 'won' && <p className="text-sm text-slate-400">You got it in {guesses.length}/6{hardMode ? ' (Hard Mode)' : ''}!</p>}
            <div className="flex gap-2 justify-center">
              <button onClick={newGame} className="glow-btn px-5 py-2.5 text-sm">
               Play Again
             </button>
             {gameState === 'won' && (
                <button onClick={shareResults} className="px-5 py-2.5 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all">
                 📋 Share
               </button>
             )}
            </div>
          </div>
        )}

        <style>{`
          @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-4px)} 40%,80%{transform:translateX(4px)} }
          @keyframes flipIn { 0%{transform:rotateX(0)} 50%{transform:rotateX(90deg)} 100%{transform:rotateX(0)} }
          .animate-shake { animation: shake 0.5s ease; }
        `}</style>
      </div>
    </ToolLayout>
  )
}
