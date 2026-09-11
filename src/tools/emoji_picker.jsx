import { useState, useMemo, useCallback, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'

const EMOJIS = {
  Smileys: ['😀','😃','😄','😁','😅','😂','🤣','😊','😇','🙂','🙃','😉','😌','😍','🥰','😘','😗','😙','😚','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🫣','🤫','🤔','🫡','🤐','🤨','😐','😑','😶','🫥','😏','😒','🙄','😬','🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮','🥴','😵','🤯','🥺','😢','😭','😤','😠','😡','🤬','💀','☠️','💩','🤡','👹','👺','👻','👽','👾','🤖'],
  Gestures: ['👋','🤚','🖐️','✋','🖖','🫱','🫲','🫳','🫴','👌','🤌','🤏','✌️','🤞','🫰','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️','🫵','👍','👎','✊','👊','🤛','🤜','👏','🙌','🫶','👐','🤲','🤝','🙏','✍️','💅','🤳','💪','🦵','🦶','👂','🦻','👃','🧠','🫀','🫁','🦷','🦴','👀','👁️','👅','👄'],
  People: ['👶','🧒','👦','👧','🧑','👱','👨','👩','🧔','👴','👵','🙍','🙎','🙅','🙆','💁','🙋','🧏','🙇','🤦','🤷','👮','🕵️','💂','🥷','👷','🫅','🤴','👸','👳','👲','🧕','🤵','👰','🤰','🫃','🫄','👼','🎅','🤶','🦸','🦹','🧙','🧚','🧛','🧜','🧝','🧞','🧟','🧌','💆','💇','🚶','🧍','🧎','🏃','💃','🕺','🕴️','👯','🧖','🧗','🤸','⛹️','🏋️','🚴','🚵','🤼','🤽','🤾','🤺','⛷️','🏂','🏄','🚣','🏊','🤿'],
  Animals: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐻‍❄️','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🙈','🙉','🙊','🐒','🐔','🐧','🐦','🐤','🐣','🐥','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝','🐛','🦋','🐌','🐞','🐜','🪰','🪲','🪳','🦟','🦗','🕷️','🦂','🐢','🐍','🦎','🦖','🦕','🐙','🦑','🦐','🦞','🦀','🐡','🐠','🐟','🐬','🐳','🐋','🦈','🐊','🐅','🐆','🦓','🦍','🦧','🐘','🦛','🦏','🐪','🐫','🦒','🦘','🐃','🐂','🐄','🐎','🐖','🐏','🐑','🦙','🐐','🦌','🐕','🐩','🦮','🐕‍🦺','🐈','🐈‍⬛','🐓','🦃','🦤','🦚','🦜','🦢','🦩','🕊️','🐇','🦝','🦨','🦡','🦫','🦦','🦥','🐁','🐀','🐿️','🦔','🐾','🐉','🐲'],
  Food: ['🍏','🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🍆','🥑','🥦','🥬','🥒','🌶️','🫑','🌽','🥕','🫒','🧄','🧅','🥔','🍠','🫘','🥜','🌰','🍞','🥐','🥖','🥨','🧀','🥚','🍳','🧈','🥞','🧇','🥓','🥩','🍗','🍖','🦴','🌭','🍔','🍟','🍕','🫓','🥪','🥙','🧆','🌮','🌯','🫔','🥗','🥘','🥫','🍝','🍜','🍲','🍛','🍣','🍱','🥟','🦪','🍤','🍙','🍚','🍘','🍥','🥠','🥮','🍢','🍡','🍧','🍨','🍦','🥧','🧁','🍰','🎂','🍮','🍭','🍬','🍫','🍿','🍩','🍪','🥛','🍼','☕','🍵','🧃','🥤','🍶','🍺','🍻','🥂','🍷','🥃','🍸','🍹','🧉','🍾'],
  Travel: ['🌍','🌎','🌏','🌐','🗺️','🗾','🧭','🏔️','⛰️','🌋','🗻','🏕️','🏖️','🏜️','🏝️','🏞️','🏟️','🏛️','🏗️','🧱','🪨','🪵','🛖','🏘️','🏚️','🏠','🏡','🏢','🏣','🏤','🏥','🏦','🏨','🏩','🏪','🛒','🏩','⛩️','🕌','🕍','🛕','🕋','⛲','⛺','🌁','🌃','🏙️','🌄','🌅','🌆','🌇','🌉','🎠','🛝','🎡','🎢','🚂','🚃','🚄','🚅','🚆','🚇','🚈','🚉','🚊','🚝','🚞','🚋','🚌','🚍','🚎','🚐','🚑','🚒','🚓','🚔','🚕','🚖','🚗','🚘','🚙','🛻','🚚','🚛','🚜','🏍️','🛵','🚲','🛴','🛹','🛼','🚏','🛣️','🛤️','⛽','🛞','🚨','🚥','🚦','🛑','⚓','⛵','🛶','🚤','🛳️','⛴️','🛥️','🚢','✈️','🛩️','🛫','🛬','🪂','💺','🚁','🚟','🚠','🚡','🛰️','🚀','🛸','🌍','🌎','🌏','🗺️'],
  Activities: ['⚽','🏀','🏈','⚾','🥎','🎾','🏐','🏉','🥏','🎱','🪀','🏓','🏸','🏒','🏑','🥍','🏏','🪃','🥅','⛳','🪁','🏹','🎣','🤿','🥊','🥋','🎽','🛹','🛼','🛷','⛸️','🥌','🎿','🎯','🪃','🪁','🎮','🕹️','🎲','🧩','🎭','🎨','🧵','🪡','🧶','🪗','🪘','🎵','🎶','🎤','🎧','🎼','🎹','🥁','🪘','🎷','🎺','🪗','🎸','🪕','🎻','🎲','♟️','🎳','🏆','🥇','🥈','🥉','🏅','🎖️','🏵️','🎗️','🎫','🎟️','🎪','🤹','🎭','🩰','🎨','🎬','🎤','🎧','🎼'],
  Objects: ['⌚','📱','📲','💻','⌨️','🖥️','🖨️','🖱️','🖲️','🕹️','🗜️','💽','💾','💿','📀','📼','📷','📸','📹','🎥','📽️','🎞️','📞','☎️','📟','📠','📺','📻','🎙️','🎚️','🎛️','🧭','⏱️','⏲️','⏰','🕰️','⌛','⏳','📡','🔋','🪫','🔌','💡','🔦','🕯️','🪔','🧯','🛢️','💸','💵','💴','💶','💷','🪙','💰','💳','🪪','💎','⚖️','🪜','🧰','🪛','🔧','🔨','⚒️','🛠️','⛏️','🪚','🔩','⚙️','🪤','🧱','⛓️','🧲','🔫','💣','🧨','🪓','🔪','🗡️','⚔️','🛡️','🚬','⚰️','🪦','⚱️','🏺','🔮','📿','🧿','🪬','💈','⚗️','🔭','🔬','🕳️','🩹','🩺','🩻','🩼','💊','💉','🩸','🧬','🧫','🧪','🌡️','🧹','🪠','🧺','🧻','🚽','🚰','🚿','🛁','🛀','🧼','🪥','🪒','🧽','🪣','🧴','🛎️','🔑','🗝️','🚪','🛋️','🪑','🛏️','🪞','🪟','🧳','🧲','🪜'],
  Symbols: ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❤️‍🔥','❤️‍🩹','❣️','💕','💞','💓','💗','💖','💘','💝','💟','☮️','✝️','☪️','🕉️','☸️','✡️','🔯','🕎','☯️','☦️','🛐','⛎','♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓','🆔','⚛️','🉑','☢️','☣️','📴','📳','🈶','🈚','🈸','🈺','🈷️','✴️','🆚','💮','🉐','㊙️','㊗️','🈴','🈵','🈹','🈲','🅰️','🅱️','🆎','🆑','🅾️','🆘','❌','⭕','🛑','⛔','📛','🚫','💯','💢','♨️','🚷','🚯','🚳','🚱','🔞','📵','🚭','❗','❕','❓','❔','‼️','⁉️','🔅','🔆','〽️','⚠️','🚸','🔱','⚜️','🔰','♻️','✅','🈯','💹','❇️','✳️','❎','🌐','💠','Ⓜ️','🌀','💤','🏧','🚾','♿','🅿️','🛗','🈳','🈂️','🛂','🛃','🛄','🛅','🚹','🚺','🚼','⚧️','🚻','🚮','🎦','📶','🈁','🔣','ℹ️','🔤','🔡','🔠','🆖','🆗','🆙','🆒','🆕','🆓','0️⃣','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟','🔢','#️⃣','*️⃣','⏏️','▶️','⏸️','⏯️','⏹️','⏺️','⏭️','⏮️','⏩','⏪','⏫','⏬','◀️','🔼','🔽','➡️','⬅️','⬆️','⬇️','↗️','↘️','↙️','↖️','↕️','↔️','↪️','↩️','⤴️','⤵️','🔀','🔁','🔂','🔄','🔃','🎵','🎶','➕','➖','➗','✖️','🟰','♾️','💲','💱','™️','©️','®️','〰️','➰','➿','🔚','🔙','🔛','🔝','🔜','✔️','☑️','🔘','🔴','🟠','🟡','🟢','🔵','🟣','⚫','⚪','🟤','🔺','🔻','🔸','🔹','🔶','🔷','🔳','🔲','▪️','▫️','◾','◽','◼️','◻️','🟥','🟧','🟨','🟩','🟦','🟪','⬛','⬜','🟫','🔈','🔇','🔉','🔊','🔔','🔕','📣','📢'],
  Flags: ['🏁','🚩','🎌','🏴','🏳️','🏳️‍🌈','🏳️‍⚧️','🏴‍☠️','🇺🇸','🇬🇧','🇫🇷','🇩🇪','🇮🇹','🇪🇸','🇯🇵','🇰🇷','🇨🇳','🇮🇳','🇧🇷','🇨🇦','🇦🇺','🇲🇽','🇷🇺','🇸🇦','🇿🇦','🇳🇬','🇪🇬','🇹🇷','🇦🇷','🇨🇴','🇨🇱','🇵🇪','🇻🇪','🇪🇨','🇧🇴','🇵🇾','🇺🇾','🇮🇩','🇹🇭','🇻🇳','🇵🇭','🇲🇾','🇸🇬','🇳🇿','🇵🇰','🇧🇩','🇱🇰','🇮🇪','🇳🇱','🇧🇪','🇨🇭','🇦🇹','🇸🇪','🇳🇴','🇩🇰','🇫🇮','🇵🇱','🇨🇿','🇷🇴','🇺🇦','🇬🇷','🇵🇹','🇮🇱','🇦🇪','🇶🇦','🇰🇼','🇧🇭','🇴🇲','🇯🇴','🇱🇧','🇮🇶','🇮🇷','🇦🇫','🇵🇸','🇸🇾','🇾🇪','🇲🇦','🇩🇿','🇹🇳','🇱🇾','🇸🇩','🇨🇲','🇬🇭','🇰🇪','🇹🇿','🇪🇹','🇨🇩','🇦🇴','🇲🇿','🇿🇼','🇿🇲','🇲🇼','🇺🇬','🇷🇼','🇸🇳','🇲🇱','🇧🇫','🇳🇪','🇹🇩','🇨🇫','🇬🇦','🇨🇬','🇬🇼','🇨🇮','🇧🇮','🇱🇸','🇸🇿','🇧🇼','🇳🇦','🇲🇬','🇷🇪','🇲🇺','🇲🇻','🇸🇨','🇰🇲','🇲🇹','🇮🇸','🇪🇪','🇱🇻','🇱🇹','🇧🇬','🇭🇺','🇭🇷','🇷🇸','🇧🇦','🇲🇰','🇦🇱','🇲🇪','🇸🇮','🇸🇰'],
}

const CATS = Object.keys(EMOJIS)

export default function EmojiPicker() {
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState(CATS[0])
  const [copiedIdx, setCopiedIdx] = useState(null)
  const [toast, setToast] = useState(false)
  const toastRef = useRef(null)

  const emojis = useMemo(() => {
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      let all = []
      for (const c of CATS) {
        all = all.concat(EMOJIS[c].filter(e => e.includes(q) || e.toLowerCase().includes(q)))
      }
      return all
    }
    return EMOJIS[activeCat] || []
  }, [search, activeCat])

  const copyEmoji = useCallback((emoji, idx) => {
    navigator.clipboard.writeText(emoji)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 600)
    setToast(true)
    if (toastRef.current) clearTimeout(toastRef.current)
    toastRef.current = setTimeout(() => setToast(false), 1200)
  }, [])

  return (
    <ToolLayout
      title="Emoji Picker"
      desc="Emoji Picker - browse, search & copy 1500+ emojis organized by category, online free. Free online, no sign-up. Works on any device."
      icon="😄" iconBg="rgba(99,102,241,0.08)"
      category="fun" slug="emoji-picker"
      faq={[
        { q: "How do I copy an emoji?", a: "Click any emoji above and it copies instantly. Paste it into chats, posts, or bios." },
        { q: "How do I find a specific emoji?", a: "Type in the search box above or browse by category. 1500+ emojis, free with no sign-up." },
        { q: "Is this emoji picker free?", a: "Yes, completely free with no sign-up. Copy unlimited emojis on any device." },
        { q: "Do I need to sign up to copy emojis?", a: "No sign-up needed. Click any emoji above and paste it anywhere, free on any device." },
        { q: "Can I use emojis on any app?", a: "Yes. Copied emojis work in WhatsApp, Instagram, X, and every other app." },
        { q: "Does it work on mobile?", a: "Yes. Search and copy emojis free in your phone browser, no app needed." },
      ]}
      howItWorks={[
        "Search or browse 1500+ emojis by category above.",
        "Click any emoji to copy it instantly.",
        "Paste it anywhere - chats, posts, bios.",
      ]}
    >
      <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
        {/* Search + Size */}
        <div className="flex gap-2 mb-3">
          <input
            className="flex-1 bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition"
            type="text"
            placeholder="Search emojis..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Category tabs */}
        <div className="flex gap-1.5 flex-wrap mb-3">
          {CATS.map(c => (
            <button
              key={c}
              onClick={() => { setActiveCat(c); setSearch('') }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${
                c === activeCat && !search
                  ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                  : 'bg-white/[0.06] border-white/[0.08] text-slate-400 hover:bg-white/[0.1]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Emoji grid */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(42px,1fr))] gap-1 max-h-[420px] overflow-y-auto p-2 bg-black/20 rounded-xl">
          {emojis.map((e, i) => (
            <button
              key={`${e}-${i}`}
              onClick={() => copyEmoji(e, i)}
              className={`w-[40px] h-[40px] flex items-center justify-center text-[22px] rounded-lg border transition-all hover:scale-110 ${
                copiedIdx === i
                  ? 'bg-green-500/20 border-green-500'
                  : 'bg-white/[0.04] border-white/[0.06] hover:bg-indigo-500/20 hover:border-indigo-500'
              }`}
            >
              {e}
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-slate-400 mt-2">
          {emojis.length} emojis{search ? ' found' : ''}
        </p>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium z-50 shadow-lg animate-pulse">
          Copied!
        </div>
      )}
    </ToolLayout>
  )
}
