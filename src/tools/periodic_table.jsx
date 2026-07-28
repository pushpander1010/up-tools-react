import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'

// Complete periodic table data — 118 elements
// Each: [atomic#, symbol, name, mass, category, group, period, row, col]
// row/col = position in standard periodic table layout
const ELEMENTS = [
  [1,'H','Hydrogen','1.008','nonmetal',1,1,1,1],
  [2,'He','Helium','4.003','noble-gas',18,1,1,18],
  [3,'Li','Lithium','6.941','alkali',1,2,2,1],
  [4,'Be','Beryllium','9.012','alkaline',2,2,2,2],
  [5,'B','Boron','10.81','metalloid',13,2,2,13],
  [6,'C','Carbon','12.01','nonmetal',14,2,2,14],
  [7,'N','Nitrogen','14.01','nonmetal',15,2,2,15],
  [8,'O','Oxygen','16.00','nonmetal',16,2,2,16],
  [9,'F','Fluorine','19.00','halogen',17,2,2,17],
  [10,'Ne','Neon','20.18','noble-gas',18,2,2,18],
  [11,'Na','Sodium','22.99','alkali',1,3,3,1],
  [12,'Mg','Magnesium','24.31','alkaline',2,3,3,2],
  [13,'Al','Aluminium','26.98','post-transition',13,3,3,13],
  [14,'Si','Silicon','28.09','metalloid',14,3,3,14],
  [15,'P','Phosphorus','30.97','nonmetal',15,3,3,15],
  [16,'S','Sulfur','32.07','nonmetal',16,3,3,16],
  [17,'Cl','Chlorine','35.45','halogen',17,3,3,17],
  [18,'Ar','Argon','39.95','noble-gas',18,3,3,18],
  [19,'K','Potassium','39.10','alkali',1,4,4,1],
  [20,'Ca','Calcium','40.08','alkaline',2,4,4,2],
  [21,'Sc','Scandium','44.96','transition',3,4,4,3],
  [22,'Ti','Titanium','47.87','transition',4,4,4,4],
  [23,'V','Vanadium','50.94','transition',5,4,4,5],
  [24,'Cr','Chromium','52.00','transition',6,4,4,6],
  [25,'Mn','Manganese','54.94','transition',7,4,4,7],
  [26,'Fe','Iron','55.85','transition',8,4,4,8],
  [27,'Co','Cobalt','58.93','transition',9,4,4,9],
  [28,'Ni','Nickel','58.69','transition',10,4,4,10],
  [29,'Cu','Copper','63.55','transition',11,4,4,11],
  [30,'Zn','Zinc','65.38','transition',12,4,4,12],
  [31,'Ga','Gallium','69.72','post-transition',13,4,4,13],
  [32,'Ge','Germanium','72.63','metalloid',14,4,4,14],
  [33,'As','Arsenic','74.92','metalloid',15,4,4,15],
  [34,'Se','Selenium','78.97','nonmetal',16,4,4,16],
  [35,'Br','Bromine','79.90','halogen',17,4,4,17],
  [36,'Kr','Krypton','83.80','noble-gas',18,4,4,18],
  [37,'Rb','Rubidium','85.47','alkali',1,5,5,1],
  [38,'Sr','Strontium','87.62','alkaline',2,5,5,2],
  [39,'Y','Yttrium','88.91','transition',3,5,5,3],
  [40,'Zr','Zirconium','91.22','transition',4,5,5,4],
  [41,'Nb','Niobium','92.91','transition',5,5,5,5],
  [42,'Mo','Molybdenum','95.95','transition',6,5,5,6],
  [43,'Tc','Technetium','[98]','transition',7,5,5,7],
  [44,'Ru','Ruthenium','101.1','transition',8,5,5,8],
  [45,'Rh','Rhodium','102.9','transition',9,5,5,9],
  [46,'Pd','Palladium','106.4','transition',10,5,5,10],
  [47,'Ag','Silver','107.9','transition',11,5,5,11],
  [48,'Cd','Cadmium','112.4','transition',12,5,5,12],
  [49,'In','Indium','114.8','post-transition',13,5,5,13],
  [50,'Sn','Tin','118.7','post-transition',14,5,5,14],
  [51,'Sb','Antimony','121.8','metalloid',15,5,5,15],
  [52,'Te','Tellurium','127.6','metalloid',16,5,5,16],
  [53,'I','Iodine','126.9','halogen',17,5,5,17],
  [54,'Xe','Xenon','131.3','noble-gas',18,5,5,18],
  [55,'Cs','Caesium','132.9','alkali',1,6,6,1],
  [56,'Ba','Barium','137.3','alkaline',2,6,6,2],
  [57,'La','Lanthanum','138.9','lanthanide',3,6,9,3],
  [58,'Ce','Cerium','140.1','lanthanide',4,6,9,4],
  [59,'Pr','Praseodymium','140.9','lanthanide',5,6,9,5],
  [60,'Nd','Neodymium','144.2','lanthanide',6,6,9,6],
  [61,'Pm','Promethium','[145]','lanthanide',7,6,9,7],
  [62,'Sm','Samarium','150.4','lanthanide',8,6,9,8],
  [63,'Eu','Europium','152.0','lanthanide',9,6,9,9],
  [64,'Gd','Gadolinium','157.3','lanthanide',10,6,9,10],
  [65,'Tb','Terbium','158.9','lanthanide',11,6,9,11],
  [66,'Dy','Dysprosium','162.5','lanthanide',12,6,9,12],
  [67,'Ho','Holmium','164.9','lanthanide',13,6,9,13],
  [68,'Er','Erbium','167.3','lanthanide',14,6,9,14],
  [69,'Tm','Thulium','168.9','lanthanide',15,6,9,15],
  [70,'Yb','Ytterbium','173.0','lanthanide',16,6,9,16],
  [71,'Lu','Lutetium','175.0','lanthanide',17,6,9,17],
  [72,'Hf','Hafnium','178.5','transition',4,6,6,4],
  [73,'Ta','Tantalum','180.9','transition',5,6,6,5],
  [74,'W','Tungsten','183.8','transition',6,6,6,6],
  [75,'Re','Rhenium','186.2','transition',7,6,6,7],
  [76,'Os','Osmium','190.2','transition',8,6,6,8],
  [77,'Ir','Iridium','192.2','transition',9,6,6,9],
  [78,'Pt','Platinum','195.1','transition',10,6,6,10],
  [79,'Au','Gold','197.0','transition',11,6,6,11],
  [80,'Hg','Mercury','200.6','transition',12,6,6,12],
  [81,'Tl','Thallium','204.4','post-transition',13,6,6,13],
  [82,'Pb','Lead','207.2','post-transition',14,6,6,14],
  [83,'Bi','Bismuth','209.0','post-transition',15,6,6,15],
  [84,'Po','Polonium','[209]','post-transition',16,6,6,16],
  [85,'At','Astatine','[210]','halogen',17,6,6,17],
  [86,'Rn','Radon','[222]','noble-gas',18,6,6,18],
  [87,'Fr','Francium','[223]','alkali',1,7,7,1],
  [88,'Ra','Radium','[226]','alkaline',2,7,7,2],
  [89,'Ac','Actinium','[227]','actinide',3,7,10,3],
  [90,'Th','Thorium','232.0','actinide',4,7,10,4],
  [91,'Pa','Protactinium','231.0','actinide',5,7,10,5],
  [92,'U','Uranium','238.0','actinide',6,7,10,6],
  [93,'Np','Neptunium','[237]','actinide',7,7,10,7],
  [94,'Pu','Plutonium','[244]','actinide',8,7,10,8],
  [95,'Am','Americium','[243]','actinide',9,7,10,9],
  [96,'Cm','Curium','[247]','actinide',10,7,10,10],
  [97,'Bk','Berkelium','[247]','actinide',11,7,10,11],
  [98,'Cf','Californium','[251]','actinide',12,7,10,12],
  [99,'Es','Einsteinium','[252]','actinide',13,7,10,13],
  [100,'Fm','Fermium','[257]','actinide',14,7,10,14],
  [101,'Md','Mendelevium','[258]','actinide',15,7,10,15],
  [102,'No','Nobelium','[259]','actinide',16,7,10,16],
  [103,'Lr','Lawrencium','[266]','actinide',17,7,10,17],
  [104,'Rf','Rutherfordium','[267]','transition',4,7,7,4],
  [105,'Db','Dubnium','[268]','transition',5,7,7,5],
  [106,'Sg','Seaborgium','[269]','transition',6,7,7,6],
  [107,'Bh','Bohrium','[270]','transition',7,7,7,7],
  [108,'Hs','Hassium','[277]','transition',8,7,7,8],
  [109,'Mt','Meitnerium','[278]','transition',9,7,7,9],
  [110,'Ds','Darmstadtium','[281]','transition',10,7,7,10],
  [111,'Rg','Roentgenium','[282]','transition',11,7,7,11],
  [112,'Cn','Copernicium','[285]','transition',12,7,7,12],
  [113,'Nh','Nihonium','[286]','post-transition',13,7,7,13],
  [114,'Fl','Flerovium','[289]','post-transition',14,7,7,14],
  [115,'Mc','Moscovium','[290]','post-transition',15,7,7,15],
  [116,'Lv','Livermorium','[293]','post-transition',16,7,7,16],
  [117,'Ts','Tennessine','[294]','halogen',17,7,7,17],
  [118,'Og','Oganesson','[294]','noble-gas',18,7,7,18],
]

const CATEGORY_COLORS = {
  'nonmetal': '#10b981',
  'noble-gas': '#8b5cf6',
  'alkali': '#ef4444',
  'alkaline': '#f97316',
  'transition': '#3b82f6',
  'post-transition': '#14b8a6',
  'metalloid': '#a855f7',
  'lanthanide': '#ec4899',
  'actinide': '#f43f5e',
  'halogen': '#eab308',
}

const CATEGORY_LABELS = {
  'nonmetal': 'Nonmetal',
  'noble-gas': 'Noble Gas',
  'alkali': 'Alkali Metal',
  'alkaline': 'Alkaline Earth',
  'transition': 'Transition Metal',
  'post-transition': 'Post-Transition',
  'metalloid': 'Metalloid',
  'lanthanide': 'Lanthanide',
  'actinide': 'Actinide',
  'halogen': 'Halogen',
}

export default function PeriodicTable() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return ELEMENTS.filter(el => {
      if (categoryFilter && el[4] !== categoryFilter) return false
      if (q && !el[1].toLowerCase().includes(q) && !el[2].toLowerCase().includes(q) && !String(el[0]).includes(q)) return false
      return true
    }).map(el => el[0])
  }, [search, categoryFilter])

  const selectedEl = selected ? ELEMENTS.find(el => el[0] === selected) : null

  // Build grid for main table (rows 1-7, cols 1-18) + lanthanides/actinides (rows 9-10)
  const mainElements = ELEMENTS.filter(el => el[3] <= 7 && el[4] !== 'lanthanide' && el[4] !== 'actinide')
  const lanActElements = ELEMENTS.filter(el => el[3] >= 9)

  return (
    <ToolLayout
      title="Periodic Table"
      desc="Interactive periodic table of all 118 elements with search, category filter, and detailed element info."
      icon="🧪" iconBg="rgba(99,102,241,0.08)"
      category="education" slug="periodic-table"
      faq={[
        { q: 'What data is shown for each element?', a: 'Atomic number, symbol, name, atomic mass, and category (nonmetal, noble gas, transition metal, etc.).' },
        { q: 'How do I search for elements?', a: 'Type an element name, symbol, or atomic number in the search box. You can also filter by category.' },
      ]}
      howItWorks={[
        'Browse the full periodic table layout.',
        'Search by name, symbol, or atomic number.',
        'Filter by category using the color-coded legend.',
        'Click any element to see its details.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Periodic Table", "applicationCategory": "EducationalApplication",
        "url": "https://www.uptools.in/periodic-table/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="space-y-4">
        {/* Search and filter */}
        <div className="flex flex-wrap gap-3">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-indigo-500/50"
            placeholder="Search by name, symbol, or #..." />
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
            className="bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none">
            <option value="">All Categories</option>
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
            <button key={k} onClick={() => setCategoryFilter(categoryFilter === k ? '' : k)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-semibold transition-all ${categoryFilter === k ? 'ring-1 ring-white/30' : 'opacity-60 hover:opacity-100'}`}>
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: CATEGORY_COLORS[k] }} />
              <span className="text-slate-300">{v}</span>
            </button>
          ))}
        </div>

        {/* Main table */}
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[720px]">
            <div className="grid gap-[2px]" style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}>
              {Array.from({ length: 7 }, (_, row) =>
                Array.from({ length: 18 }, (_, col) => {
                  const el = mainElements.find(e => e[3] === row + 1 && e[5] === col + 1)
                  if (!el) return <div key={`${row}-${col}`} />
                  const isActive = filtered.includes(el[0])
                  const isSel = selected === el[0]
                  return (
                    <button key={el[0]}
                      onClick={() => setSelected(isSel ? null : el[0])}
                      disabled={!isActive}
                      className={`relative flex flex-col items-center justify-center rounded-md py-1 transition-all text-center
                        ${isSel ? 'ring-2 ring-white/50 scale-110 z-10' : ''}
                        ${isActive ? 'opacity-100 hover:scale-105 hover:z-10' : 'opacity-15'}`}
                      style={{ background: isActive ? `${CATEGORY_COLORS[el[4]]}22` : 'transparent' }}
                      title={`${el[2]} (${el[1]})`}>
                      <span className="text-[8px] text-slate-500 leading-none">{el[0]}</span>
                      <span className="text-[11px] font-bold leading-tight" style={{ color: CATEGORY_COLORS[el[4]] }}>{el[1]}</span>
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* Lanthanides & Actinides */}
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[400px]">
            <div className="grid gap-[2px]" style={{ gridTemplateColumns: 'repeat(17, minmax(0, 1fr))' }}>
              {lanActElements.map(el => {
                const isActive = filtered.includes(el[0])
                const isSel = selected === el[0]
                return (
                  <button key={el[0]}
                    onClick={() => setSelected(isSel ? null : el[0])}
                    disabled={!isActive}
                    className={`flex flex-col items-center justify-center rounded-md py-1 transition-all text-center
                      ${isSel ? 'ring-2 ring-white/50 scale-110 z-10' : ''}
                      ${isActive ? 'opacity-100 hover:scale-105' : 'opacity-15'}`}
                    style={{ background: isActive ? `${CATEGORY_COLORS[el[4]]}22` : 'transparent' }}>
                    <span className="text-[8px] text-slate-500 leading-none">{el[0]}</span>
                    <span className="text-[10px] font-bold leading-tight" style={{ color: CATEGORY_COLORS[el[4]] }}>{el[1]}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Selected element detail */}
        {selectedEl && (
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 flex flex-wrap items-center gap-6"
            style={{ borderColor: `${CATEGORY_COLORS[selectedEl[4]]}33` }}>
            <div className="flex flex-col items-center justify-center w-28 h-28 rounded-2xl"
              style={{ background: `${CATEGORY_COLORS[selectedEl[4]]}15`, border: `2px solid ${CATEGORY_COLORS[selectedEl[4]]}40` }}>
              <span className="text-xs text-slate-500">{selectedEl[0]}</span>
              <span className="text-3xl font-extrabold" style={{ color: CATEGORY_COLORS[selectedEl[4]] }}>{selectedEl[1]}</span>
              <span className="text-xs text-slate-400 font-medium">{selectedEl[2]}</span>
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="text-white font-bold text-lg">{selectedEl[2]}</div>
              <div className="text-slate-400">Symbol: <span className="text-white font-mono">{selectedEl[1]}</span></div>
              <div className="text-slate-400">Atomic Number: <span className="text-white font-mono">{selectedEl[0]}</span></div>
              <div className="text-slate-400">Atomic Mass: <span className="text-white font-mono">{selectedEl[2]} u</span></div>
              <div className="text-slate-400">Category: <span className="font-semibold" style={{ color: CATEGORY_COLORS[selectedEl[4]] }}>{CATEGORY_LABELS[selectedEl[4]]}</span></div>
              <div className="text-slate-400">Period: <span className="text-white font-mono">{selectedEl[3]}</span> &nbsp; Group: <span className="text-white font-mono">{selectedEl[4] === 'lanthanide' || selectedEl[4] === 'actinide' ? '—' : selectedEl[4]}</span></div>
            </div>
          </div>
        )}

        <div className="text-center text-xs text-slate-600">
          {filtered.length} of {ELEMENTS.length} elements shown
        </div>
      </div>
    </ToolLayout>
  )
}
