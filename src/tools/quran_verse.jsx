import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const API = 'https://api.alquran.cloud/v1'

const SURAH_NAMES = ['Al-Fatiha','Al-Baqarah','Ali Imran','An-Nisa','Al-Maidah','Al-Anam','Al-Araf','Al-Anfal','At-Tawbah','Yunus','Hud','Yusuf','Ar-Rad','Ibrahim','Al-Hijr','An-Nahl','Al-Isra','Al-Kahf','Maryam','Ta-Ha','Al-Anbiya','Al-Hajj','Al-Muminun','An-Nur','Al-Furqan','Ash-Shuara','An-Naml','Al-Qasas','Al-Ankabut','Ar-Rum','Luqman','As-Sajdah','Al-Ahzab','Saba','Fatir','Ya Sin','As-Saffat','Sad','Az-Zumar','Ghafir','Fussilat','Ash-Shura','Az-Zukhruf','Ad-Dukhan','Al-Jathiyah','Al-Ahqaf','Muhammad','Al-Fath','Al-Hujurat','Qaf','Adh-Dhariyat','At-Tur','An-Najm','Al-Qamar','Ar-Rahman','Al-Waqiah','Al-Hadid','Al-Mujadilah','Al-Hashr','Al-Mumtahanah','As-Saff','Al-Jumuah','Al-Munafiqun','At-Taghabun','At-Talaq','At-Tahrim','Al-Mulk','Al-Qalam','Al-Haqqah','Al-Maarij','Nuh','Al-Jinn','Al-Muzzammil','Al-Muddaththir','Al-Qiyamah','Al-Insan','Al-Mursalat','An-Naba','An-Naziat','Abasa','At-Takwir','Al-Infitar','Al-Mutaffifin','Al-Inshiqaq','Al-Buruj','At-Tariq','Al-Ala','Al-Ghashiyah','Al-Fajr','Al-Balad','Ash-Shams','Al-Lail','Ad-Duha','Ash-Sharh','At-Tin','Al-Alaq','Al-Qadr','Al-Bayyinah','Az-Zalzalah','Al-Adiyat','Al-Qariah','At-Takathur','Al-Asr','Al-Humazah','Al-Fil','Quraysh','Al-Maun','Al-Kawthar','Al-Kafirun','An-Nasr','Al-Masad','Al-Ikhlas','Al-Falaq','An-Nas']

const DAILY = [
  { s: 55, a: 13, ar: 'فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ', en: 'So which of the favors of your Lord would you deny?', ref: 'Ar-Rahman 55:13' },
  { s: 2, a: 286, ar: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا', en: 'Allah does not charge a soul except with that within its capacity.', ref: 'Al-Baqarah 2:286' },
  { s: 94, a: 6, ar: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', en: 'Indeed, with hardship comes ease.', ref: 'Ash-Sharh 94:6' },
  { s: 2, a: 216, ar: 'وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ', en: 'Perhaps you hate a thing and it is good for you.', ref: 'Al-Baqarah 2:216' },
  { s: 13, a: 28, ar: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', en: 'Verily, in the remembrance of Allah do hearts find rest.', ref: "Ar-Ra'd 13:28" },
  { s: 3, a: 200, ar: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', en: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the Fire.', ref: 'Al-Baqarah 2:201' }
]

export default function quran_verse() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [searchInput, setSearchInput] = useState('')
  const [verses, setVerses] = useState([])
  const [surahInfo, setSurahInfo] = useState(null)
  const [status, setStatus] = useState('')
  const [copied, setCopied] = useState(false)
  const [showList, setShowList] = useState(true)

  const daily = useMemo(() => {
    const idx = new Date().getDate() % DAILY.length
    return DAILY[idx]
  }, [])

  const loadSurah = useCallback(async (num) => {
    setStatus('Loading Surah...')
    setShowList(false)
    setVerses([])
    try {
      const [arR, enR] = await Promise.all([
        fetch(`${API}/surah/${num}/ar.alafasy`),
        fetch(`${API}/surah/${num}/en.asad`)
      ])
      const arD = await arR.json()
      const enD = await enR.json()
      if (arD.code === 200 && enD.code === 200) {
        const vs = arD.data.ayahs.map((a, i) => ({
          arabic: a.text,
          num: a.numberInSurah,
          translation: enD.data.ayahs[i]?.text || '',
          ref: `${arD.data.englishName} ${num}:${a.numberInSurah}`
        }))
        setVerses(vs)
        setSurahInfo({ name: arD.data.englishName, arabicName: arD.data.name, count: arD.data.numberOfAyahs })
        setStatus('')
      }
    } catch {
      setStatus('Error loading Surah.')
    }
  }, [])

  const searchSurah = useCallback((q) => {
    if (!q) return
    const num = parseInt(q)
    if (!isNaN(num) && num >= 1 && num <= 114) { loadSurah(num); return }
    const match = SURAH_NAMES.findIndex(n => n.toLowerCase().includes(q.toLowerCase()))
    if (match >= 0) { loadSurah(match + 1); return }
    setStatus('Surah not found. Try a number (1-14) or name like "Al-Fatiha".')
  }, [loadSurah])

  const copyVerse = useCallback(async (verse) => {
    const text = `${verse.arabic}\n\n${verse.translation}\n— ${verse.ref}`
    try { await navigator.clipboard.writeText(text) } catch { /* fallback */ }
    setCopied(verse.ref)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  return (
    <ToolLayout
      title="Quran Verse"
      desc="Browse the Holy Quran with Arabic text and English translations."
      icon="🕌" iconBg="rgba(34,197,94,0.08)"
      category="text" slug="quran-verse"
      faq={[
        { q: "What translations are available?", a: "Arabic (Alafasy) and English (Asad) translations are provided." },
        { q: "How many Surahs are there?", a: "The Quran contains 114 Surahs (chapters)." },
      ]}
      howItWorks={[
        "Browse all 114 Surahs by clicking on any name.",
        "Or search by Surah number or name.",
        "Read Arabic text with English translation side by side.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Quran Verse", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/quran-verse/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Daily Verse */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">✨ Daily Verse</div>
          <div className="text-lg text-white text-right mb-2" dir="rtl" style={{ fontFamily: 'serif' }}>{daily.ar}</div>
          <p className="text-sm text-slate-300">{daily.en}</p>
          <p className="text-xs text-slate-500 mt-1">{daily.ref}</p>
        </div>

        {/* Search */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <div className="flex gap-2">
            <input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { searchSurah(searchInput.trim()); jumpTo() } }}
              placeholder="Search Surah by name or number (1-114)..."
              className="flex-1 bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500/40 transition-all placeholder:text-slate-600" />
            <button onClick={() => { searchSurah(searchInput.trim()); jumpTo() }}
              className="px-5 py-3 rounded-xl text-sm font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all">
              🔎
            </button>
          </div>
        </div>

        {status && <div className="text-xs text-slate-400 text-center">{status}</div>}

        {/* Surah List */}
        {showList && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" ref={resultRef}>
            {SURAH_NAMES.map((name, i) => (
              <button key={i} onClick={() => { loadSurah(i + 1); jumpTo() }}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] transition-all text-left">
                <span className="text-xs text-white truncate">{name}</span>
                <span className="text-xs text-slate-500 ml-2">{i + 1}</span>
              </button>
            ))}
          </div>
        )}

        {/* Verses */}
        {surahInfo && !showList && (
          <div ref={resultRef}>
            <button onClick={() => { setShowList(true); setVerses([]); setSurahInfo(null) }}
              className="text-xs text-cyan-400 mb-3 hover:text-cyan-300 transition-all">
              ← Back to Surah list
            </button>
            <div className="text-sm font-bold text-white mb-3">
              {surahInfo.name} ({surahInfo.arabicName}) — {surahInfo.count} Ayahs
            </div>
            <div className="space-y-3">
              {verses.map((v, i) => (
                <div key={i} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
                  <div className="text-xl text-white text-right mb-2" dir="rtl" style={{ fontFamily: 'serif' }}>
                    {v.arabic} ﴿{v.num}﴾
                  </div>
                  <div className="text-sm text-slate-300 mb-2">{v.translation}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{v.ref}</span>
                    <button onClick={() => copyVerse(v)}
                      className={`text-xs px-2 py-1 rounded-lg transition-all ${copied === v.ref ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-500 hover:text-white'}`}>
                      {copied === v.ref ? '✅' : '📋'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
