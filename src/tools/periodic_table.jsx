import { useState, useCallback, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'

// [atomicNumber, symbol, name, atomicMass, category, row, col, electronConfig, phase, density, meltingPt, boilingPt, yearDiscovered]
const EL = [
  [1,"H","Hydrogen",1.008,"nonmetal",1,1,"1s¹","Gas",0.00009,-259.16,-252.87,"1766"],
  [2,"He","Helium",4.003,"noble",1,18,"1s²","Gas",0.000179,-272.2,-268.93,"1868"],
  [3,"Li","Lithium",6.941,"alkali",2,1,"[He]2s¹","Solid",0.534,180.54,1342,"1817"],
  [4,"Be","Beryllium",9.012,"alkaline",2,2,"[He]2s²","Solid",1.85,1287,2470,"1798"],
  [5,"B","Boron",10.81,"metalloid",2,13,"[He]2s²2p¹","Solid",2.34,2075,4000,"1808"],
  [6,"C","Carbon",12.011,"nonmetal",2,14,"[He]2s²2p²","Solid",2.267,3550,4027,"Ancient"],
  [7,"N","Nitrogen",14.007,"nonmetal",2,15,"[He]2s²2p³","Gas",0.0012506,-210.0,-195.79,"1772"],
  [8,"O","Oxygen",15.999,"nonmetal",2,16,"[He]2s²2p⁴","Gas",0.001429,-218.79,-182.96,"1774"],
  [9,"F","Fluorine",18.998,"halogen",2,17,"[He]2s²2p⁵","Gas",0.001696,-219.67,-188.11,"1886"],
  [10,"Ne","Neon",20.18,"noble",2,18,"[He]2s²2p⁶","Gas",0.0008999,-248.59,-246.08,"1898"],
  [11,"Na","Sodium",22.99,"alkali",3,1,"[Ne]3s¹","Solid",0.971,97.79,882.94,"1807"],
  [12,"Mg","Magnesium",24.305,"alkaline",3,2,"[Ne]3s²","Solid",1.738,650,1091,"1755"],
  [13,"Al","Aluminium",26.982,"post-trans",3,13,"[Ne]3s²3p¹","Solid",2.698,660.32,2519,"1825"],
  [14,"Si","Silicon",28.086,"metalloid",3,14,"[Ne]3s²3p²","Solid",2.3296,1414,3265,"1824"],
  [15,"P","Phosphorus",30.974,"nonmetal",3,15,"[Ne]3s²3p³","Solid",1.82,44.15,280.5,"1669"],
  [16,"S","Sulfur",32.06,"nonmetal",3,16,"[Ne]3s²3p⁴","Solid",2.067,115.21,444.6,"Ancient"],
  [17,"Cl","Chlorine",35.45,"halogen",3,17,"[Ne]3s²3p⁵","Gas",0.003214,-101.5,-34.04,"1774"],
  [18,"Ar","Argon",39.948,"noble",3,18,"[Ne]3s²3p⁶","Gas",0.0017837,-189.34,-185.85,"1894"],
  [19,"K","Potassium",39.098,"alkali",4,1,"[Ar]4s¹","Solid",0.862,63.5,759,"1807"],
  [20,"Ca","Calcium",40.078,"alkaline",4,2,"[Ar]4s²","Solid",1.55,842,1484,"1808"],
  [21,"Sc","Scandium",44.956,"transition",4,3,"[Ar]3d¹4s²","Solid",2.989,1541,2836,"1879"],
  [22,"Ti","Titanium",47.867,"transition",4,4,"[Ar]3d²4s²","Solid",4.54,1668,3287,"1791"],
  [23,"V","Vanadium",50.942,"transition",4,5,"[Ar]3d³4s²","Solid",6.11,1910,3407,"1801"],
  [24,"Cr","Chromium",51.996,"transition",4,6,"[Ar]3d⁵4s¹","Solid",7.15,1907,2671,"1797"],
  [25,"Mn","Manganese",54.938,"transition",4,7,"[Ar]3d⁵4s²","Solid",7.44,1246,2061,"1774"],
  [26,"Fe","Iron",55.845,"transition",4,8,"[Ar]3d⁶4s²","Solid",7.874,1538,2862,"Ancient"],
  [27,"Co","Cobalt",58.933,"transition",4,9,"[Ar]3d⁷4s²","Solid",8.9,1495,2927,"1735"],
  [28,"Ni","Nickel",58.693,"transition",4,10,"[Ar]3d⁸4s²","Solid",8.912,1455,2913,"1751"],
  [29,"Cu","Copper",63.546,"transition",4,11,"[Ar]3d¹⁰4s¹","Solid",8.96,1084.62,2560,"Ancient"],
  [30,"Zn","Zinc",65.38,"transition",4,12,"[Ar]3d¹⁰4s²","Solid",7.134,419.53,907,"1746"],
  [31,"Ga","Gallium",69.723,"post-trans",4,13,"[Ar]3d¹⁰4s²4p¹","Solid",5.907,29.76,2204,"1875"],
  [32,"Ge","Germanium",72.63,"metalloid",4,14,"[Ar]3d¹⁰4s²4p²","Solid",5.323,938.25,2833,"1886"],
  [33,"As","Arsenic",74.922,"metalloid",4,15,"[Ar]3d¹⁰4s²4p³","Solid",5.776,817,614,"Ancient"],
  [34,"Se","Selenium",78.971,"nonmetal",4,16,"[Ar]3d¹⁰4s²4p⁴","Solid",4.809,221,685,"1817"],
  [35,"Br","Bromine",79.904,"halogen",4,17,"[Ar]3d¹⁰4s²4p⁵","Liquid",3.122,-7.2,58.8,"1826"],
  [36,"Kr","Krypton",83.798,"noble",4,18,"[Ar]3d¹⁰4s²4p⁶","Gas",0.003733,-157.37,-153.42,"1898"],
  [37,"Rb","Rubidium",85.468,"alkali",5,1,"[Kr]5s¹","Solid",1.532,39.31,688,"1861"],
  [38,"Sr","Strontium",87.62,"alkaline",5,2,"[Kr]5s²","Solid",2.64,777,1382,"1790"],
  [39,"Y","Yttrium",88.906,"transition",5,3,"[Kr]4d¹5s²","Solid",4.469,1526,3345,"1794"],
  [40,"Zr","Zirconium",91.224,"transition",5,4,"[Kr]4d²5s²","Solid",6.506,1855,4377,"1789"],
  [41,"Nb","Niobium",92.906,"transition",5,5,"[Kr]4d⁴5s¹","Solid",8.57,2477,4744,"1801"],
  [42,"Mo","Molybdenum",95.95,"transition",5,6,"[Kr]4d⁵5s¹","Solid",10.22,2623,4639,"1781"],
  [43,"Tc","Technetium",98,"transition",5,7,"[Kr]4d⁵5s²","Solid",11.5,2157,4265,"1937"],
  [44,"Ru","Ruthenium",101.07,"transition",5,8,"[Kr]4d⁷5s¹","Solid",12.37,2334,4150,"1844"],
  [45,"Rh","Rhodium",102.91,"transition",5,9,"[Kr]4d⁸5s¹","Solid",12.41,1964,3695,"1803"],
  [46,"Pd","Palladium",106.42,"transition",5,10,"[Kr]4d¹⁰","Solid",12.02,1554.9,2963,"1803"],
  [47,"Ag","Silver",107.87,"transition",5,11,"[Kr]4d¹⁰5s¹","Solid",10.501,961.78,2162,"Ancient"],
  [48,"Cd","Cadmium",112.41,"transition",5,12,"[Kr]4d¹⁰5s²","Solid",8.69,321.07,767,"1817"],
  [49,"In","Indium",114.82,"post-trans",5,13,"[Kr]4d¹⁰5s²5p¹","Solid",7.31,156.6,2072,"1863"],
  [50,"Sn","Tin",118.71,"post-trans",5,14,"[Kr]4d¹⁰5s²5p²","Solid",7.287,231.93,2602,"Ancient"],
  [51,"Sb","Antimony",121.76,"metalloid",5,15,"[Kr]4d¹⁰5s²5p³","Solid",6.685,630.63,1587,"Ancient"],
  [52,"Te","Tellurium",127.6,"metalloid",5,16,"[Kr]4d¹⁰5s²5p⁴","Solid",6.232,449.51,988,"1783"],
  [53,"I","Iodine",126.9,"halogen",5,17,"[Kr]4d¹⁰5s²5p⁵","Solid",4.93,113.7,184.3,"1811"],
  [54,"Xe","Xenon",131.29,"noble",5,18,"[Kr]4d¹⁰5s²5p⁶","Gas",0.005887,-111.75,-108.09,"1898"],
  [55,"Cs","Caesium",132.91,"alkali",6,1,"[Xe]6s¹","Solid",1.873,28.44,671,"1860"],
  [56,"Ba","Barium",137.33,"alkaline",6,2,"[Xe]6s²","Solid",3.594,727,1845,"1808"],
  [57,"La","Lanthanum",138.91,"lanthanide",9,3,"[Xe]5d¹6s²","Solid",6.145,920,3464,"1839"],
  [58,"Ce","Cerium",140.12,"lanthanide",9,4,"[Xe]4f¹5d¹6s²","Solid",6.77,798,3360,"1803"],
  [59,"Pr","Praseodymium",140.91,"lanthanide",9,5,"[Xe]4f³6s²","Solid",6.773,931,3290,"1885"],
  [60,"Nd","Neodymium",144.24,"lanthanide",9,6,"[Xe]4f⁴6s²","Solid",7.007,1021,3074,"1885"],
  [61,"Pm","Promethium",145,"lanthanide",9,7,"[Xe]4f⁵6s²","Solid",7.26,1042,3000,"1945"],
  [62,"Sm","Samarium",150.36,"lanthanide",9,8,"[Xe]4f⁶6s²","Solid",7.52,1074,1794,"1879"],
  [63,"Eu","Europium",151.96,"lanthanide",9,9,"[Xe]4f⁷6s²","Solid",5.243,822,1529,"1901"],
  [64,"Gd","Gadolinium",157.25,"lanthanide",9,10,"[Xe]4f⁷5d¹6s²","Solid",7.895,1313,3273,"1880"],
  [65,"Tb","Terbium",158.93,"lanthanide",9,11,"[Xe]4f⁹6s²","Solid",8.229,1356,3230,"1843"],
  [66,"Dy","Dysprosium",162.5,"lanthanide",9,12,"[Xe]4f¹⁰6s²","Solid",8.55,1412,2567,"1886"],
  [67,"Ho","Holmium",164.93,"lanthanide",9,13,"[Xe]4f¹¹6s²","Solid",8.795,1474,2700,"1878"],
  [68,"Er","Erbium",167.26,"lanthanide",9,14,"[Xe]4f¹²6s²","Solid",9.066,1529,2868,"1842"],
  [69,"Tm","Thulium",168.93,"lanthanide",9,15,"[Xe]4f¹³6s²","Solid",9.321,1545,1950,"1879"],
  [70,"Yb","Ytterbium",173.04,"lanthanide",9,16,"[Xe]4f¹⁴6s²","Solid",6.965,824,1196,"1878"],
  [71,"Lu","Lutetium",174.97,"lanthanide",9,17,"[Xe]4f¹⁴5d¹6s²","Solid",9.84,1663,3402,"1907"],
  [72,"Hf","Hafnium",178.49,"transition",6,4,"[Xe]4f¹⁴5d²6s²","Solid",13.31,2233,4603,"1923"],
  [73,"Ta","Tantalum",180.95,"transition",6,5,"[Xe]4f¹⁴5d³6s²","Solid",16.654,3017,5458,"1802"],
  [74,"W","Tungsten",183.84,"transition",6,6,"[Xe]4f¹⁴5d⁴6s²","Solid",19.25,3422,5555,"1783"],
  [75,"Re","Rhenium",186.21,"transition",6,7,"[Xe]4f¹⁴5d⁵6s²","Solid",21.02,3186,5596,"1925"],
  [76,"Os","Osmium",190.23,"transition",6,8,"[Xe]4f¹⁴5d⁶6s²","Solid",22.59,3033,5012,"1803"],
  [77,"Ir","Iridium",192.22,"transition",6,9,"[Xe]4f¹⁴5d⁷6s²","Solid",22.56,2446,4428,"1803"],
  [78,"Pt","Platinum",195.08,"transition",6,10,"[Xe]4f¹⁴5d⁹6s¹","Solid",21.46,1768.3,3825,"1735"],
  [79,"Au","Gold",196.97,"transition",6,11,"[Xe]4f¹⁴5d¹⁰6s¹","Solid",19.282,1064.18,2856,"Ancient"],
  [80,"Hg","Mercury",200.59,"transition",6,12,"[Xe]4f¹⁴5d¹⁰6s²","Liquid",13.5336,-38.83,356.73,"Ancient"],
  [81,"Tl","Thallium",204.38,"post-trans",6,13,"[Xe]4f¹⁴5d¹⁰6s²6p¹","Solid",11.85,304,1473,"1861"],
  [82,"Pb","Lead",207.2,"post-trans",6,14,"[Xe]4f¹⁴5d¹⁰6s²6p²","Solid",11.342,327.46,1749,"Ancient"],
  [83,"Bi","Bismuth",208.98,"post-trans",6,15,"[Xe]4f¹⁴5d¹⁰6s²6p³","Solid",9.807,271.4,1564,"1753"],
  [84,"Po","Polonium",209,"post-trans",6,16,"[Xe]4f¹⁴5d¹⁰6s²6p⁴","Solid",9.32,254,962,"1898"],
  [85,"At","Astatine",210,"halogen",6,17,"[Xe]4f¹⁴5d¹⁰6s²6p⁵","Solid",7,302,337,"1940"],
  [86,"Rn","Radon",222,"noble",6,18,"[Xe]4f¹⁴5d¹⁰6s²6p⁶","Gas",0.00973,-71,-61.7,"1900"],
  [87,"Fr","Francium",223,"alkali",7,1,"[Rn]7s¹","Solid",1.87,27,677,"1939"],
  [88,"Ra","Radium",226,"alkaline",7,2,"[Rn]7s²","Solid",5.5,700,1737,"1898"],
  [89,"Ac","Actinium",227,"actinide",10,3,"[Rn]6d¹7s²","Solid",10.07,1050,3198,"1899"],
  [90,"Th","Thorium",232.04,"actinide",10,4,"[Rn]6d²7s²","Solid",11.72,1750,4788,"1829"],
  [91,"Pa","Protactinium",231.04,"actinide",10,5,"[Rn]5f²6d¹7s²","Solid",15.37,1572,4027,"1913"],
  [92,"U","Uranium",238.03,"actinide",10,6,"[Rn]5f³6d¹7s²","Solid",18.95,1135,4131,"1789"],
  [93,"Np","Neptunium",237,"actinide",10,7,"[Rn]5f⁴6d¹7s²","Solid",20.45,644,3902,"1940"],
  [94,"Pu","Plutonium",244,"actinide",10,8,"[Rn]5f⁶7s²","Solid",19.84,640,3228,"1940"],
  [95,"Am","Americium",243,"actinide",10,9,"[Rn]5f⁷7s²","Solid",13.69,1176,2011,"1944"],
  [96,"Cm","Curium",247,"actinide",10,10,"[Rn]5f⁷6d¹7s²","Solid",13.51,1345,3110,"1944"],
  [97,"Bk","Berkelium",247,"actinide",10,11,"[Rn]5f⁹7s²","Solid",14.79,1050,2627,"1949"],
  [98,"Cf","Californium",251,"actinide",10,12,"[Rn]5f¹⁰7s²","Solid",15.1,900,1472,"1950"],
  [99,"Es","Einsteinium",252,"actinide",10,13,"[Rn]5f¹¹7s²","Solid",8.84,860,996,"1952"],
  [100,"Fm","Fermium",257,"actinide",10,14,"[Rn]5f¹²7s²","Solid",null,1527,null,"1952"],
  [101,"Md","Mendelevium",258,"actinide",10,15,"[Rn]5f¹³7s²","Solid",null,827,null,"1955"],
  [102,"No","Nobelium",259,"actinide",10,16,"[Rn]5f¹⁴7s²","Solid",null,827,null,"1958"],
  [103,"Lr","Lawrencium",266,"actinide",10,17,"[Rn]5f¹⁴7s²7p¹","Solid",null,1627,null,"1961"],
  [104,"Rf","Rutherfordium",267,"transition",7,4,"[Rn]5f¹⁴6d²7s²","Solid",null,2100,null,"1969"],
  [105,"Db","Dubnium",268,"transition",7,5,"[Rn]5f¹⁴6d³7s²","Solid",null,null,null,"1970"],
  [106,"Sg","Seaborgium",269,"transition",7,6,"[Rn]5f¹⁴6d⁴7s²","Solid",null,null,null,"1974"],
  [107,"Bh","Bohrium",270,"transition",7,7,"[Rn]5f¹⁴6d⁵7s²","Solid",null,null,null,"1981"],
  [108,"Hs","Hassium",277,"transition",7,8,"[Rn]5f¹⁴6d⁶7s²","Solid",null,null,null,"1984"],
  [109,"Mt","Meitnerium",278,"unknown",7,9,"[Rn]5f¹⁴6d⁷7s²","Solid",null,null,null,"1982"],
  [110,"Ds","Darmstadtium",281,"unknown",7,10,"[Rn]5f¹⁴6d⁸7s²","Solid",null,null,null,"1994"],
  [111,"Rg","Roentgenium",282,"unknown",7,11,"[Rn]5f¹⁴6d⁹7s²","Solid",null,null,null,"1994"],
  [112,"Cn","Copernicium",285,"unknown",7,12,"[Rn]5f¹⁴6d¹⁰7s²","Solid",null,null,null,"1996"],
  [113,"Nh","Nihonium",286,"unknown",7,13,"[Rn]5f¹⁴6d¹⁰7s²7p¹","Solid",null,null,null,"2003"],
  [114,"Fl","Flerovium",289,"unknown",7,14,"[Rn]5f¹⁴6d¹⁰7s²7p²","Solid",null,null,null,"1999"],
  [115,"Mc","Moscovium",290,"unknown",7,15,"[Rn]5f¹⁴6d¹⁰7s²7p³","Solid",null,null,null,"2003"],
  [116,"Lv","Livermorium",293,"unknown",7,16,"[Rn]5f¹⁴6d¹⁰7s²7p⁴","Solid",null,null,null,"2000"],
  [117,"Ts","Tennessine",294,"unknown",7,17,"[Rn]5f¹⁴6d¹⁰7s²7p⁵","Solid",null,null,null,"2010"],
  [118,"Og","Oganesson",294,"unknown",7,18,"[Rn]5f¹⁴6d¹⁰7s²7p⁶","Solid",null,null,null,"2002"]
];

const CATS = {
  alkali: { name: 'Alkali Metal', color: '#e74c3c', bg: 'rgba(231,76,60,.15)' },
  alkaline: { name: 'Alkaline Earth', color: '#e67e22', bg: 'rgba(230,126,34,.15)' },
  transition: { name: 'Transition Metal', color: '#f1c40f', bg: 'rgba(241,196,15,.12)' },
  'post-trans': { name: 'Post-Transition', color: '#2ecc71', bg: 'rgba(46,204,113,.15)' },
  metalloid: { name: 'Metalloid', color: '#1abc9c', bg: 'rgba(26,188,156,.15)' },
  nonmetal: { name: 'Reactive Nonmetal', color: '#3498db', bg: 'rgba(52,152,219,.15)' },
  halogen: { name: 'Halogen', color: '#9b59b6', bg: 'rgba(155,89,182,.15)' },
  noble: { name: 'Noble Gas', color: '#e84393', bg: 'rgba(232,67,147,.15)' },
  lanthanide: { name: 'Lanthanide', color: '#fd79a8', bg: 'rgba(253,121,168,.15)' },
  actinide: { name: 'Actinide', color: '#a29bfe', bg: 'rgba(162,155,254,.15)' },
  unknown: { name: 'Unknown Props', color: '#636e72', bg: 'rgba(99,110,114,.15)' },
};

export default function periodic_table() {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState(null);
  const [selectedEl, setSelectedEl] = useState(null);

  const filteredEls = useMemo(() => {
    const q = search.trim().toLowerCase();
    return EL.map(el => {
      const catMatch = !activeCat || el[4] === activeCat;
      const searchMatch = !q || el[2].toLowerCase().includes(q) || el[1].toLowerCase().includes(q);
      const highlight = q && searchMatch && catMatch && el[1].toLowerCase().startsWith(q);
      return { el, visible: catMatch && searchMatch, highlight };
    });
  }, [search, activeCat]);

  const showDetails = useCallback((z) => {
    const el = EL.find(e => e[0] === z);
    setSelectedEl(el);
  }, []);

  // Build grid cells
  const gridCells = useMemo(() => {
    const cells = [];
    // Rows 1-7
    for (let r = 1; r <= 7; r++) {
      for (let c = 1; c <= 18; c++) {
        const found = filteredEls.find(f => f.el[5] === r && f.el[6] === c);
        if (found) cells.push(found);
        else cells.push({ empty: true, key: `g${r}-${c}` });
      }
    }
    // Separator + labels
    cells.push({ separator: true, key: 'sep' });
    for (let c = 1; c <= 18; c++) {
      if (c === 1) cells.push({ label: '57-71', type: 'lanthanide-label', key: 'll' });
      else cells.push({ empty: true, key: `ll${c}` });
    }
    // Lanthanides (row 9)
    for (let c = 1; c <= 18; c++) {
      const found = filteredEls.find(f => f.el[5] === 9 && f.el[6] === c);
      if (found) cells.push(found);
      else cells.push({ empty: true, key: `l9-${c}` });
    }
    // Actinide label row
    for (let c = 1; c <= 18; c++) {
      if (c === 1) cells.push({ label: '89-103', type: 'actinide-label', key: 'al' });
      else cells.push({ empty: true, key: `al${c}` });
    }
    // Actinides (row 10)
    for (let c = 1; c <= 18; c++) {
      const found = filteredEls.find(f => f.el[5] === 10 && f.el[6] === c);
      if (found) cells.push(found);
      else cells.push({ empty: true, key: `a10-${c}` });
    }
    return cells;
  }, [filteredEls]);

  return (
    <ToolLayout
      title="Interactive Periodic Table of Elements"
      desc="All 118 elements. Click any element for full details. Search by name or symbol."
      icon="⚛️" iconBg="rgba(99,102,241,0.08)"
      category="education" slug="periodic-table"
    >
      <div className="max-w-6xl mx-auto space-y-3">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-2 focus-within:border-indigo-500/50">
            <svg className="w-4 h-4 opacity-40 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input className="flex-1 min-w-0 bg-transparent border-0 outline-0 text-white text-sm" placeholder="Search element by name or symbol…"
              value={search} onChange={e => setSearch(e.target.value)} />
            {search && <button onClick={() => setSearch('')} className="text-slate-400 hover:text-white text-xs px-1.5">✕</button>}
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2.5 justify-center">
            <button onClick={() => setActiveCat(null)} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${!activeCat ? 'bg-indigo-500/20 border-indigo-500 text-white' : 'bg-white/[0.04] border-white/[0.08] text-slate-400 hover:border-indigo-500/50'}`}>All</button>
            {Object.entries(CATS).map(([k, v]) => (
              <button key={k} onClick={() => setActiveCat(activeCat === k ? null : k)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${activeCat === k ? 'bg-indigo-500/20 border-indigo-500 text-white' : 'bg-white/[0.04] border-white/[0.08] text-slate-400 hover:border-indigo-500/50'}`}>
                <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: v.color }} />{v.name}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2 justify-center">
            {Object.entries(CATS).map(([k, v]) => (
              <span key={k} className="inline-flex items-center gap-1 text-[10px] text-slate-400 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
                <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: v.color }} />{v.name}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-2 overflow-x-auto">
          <div className="grid gap-px" style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}>
            {gridCells.map((cell, i) => {
              if (cell.empty) return <div key={cell.key} className="aspect-square" />;
              if (cell.separator) return <div key={cell.key} className="col-span-18 h-2" />;
              if (cell.label) {
                return <div key={cell.key} className="aspect-square flex items-end justify-end pr-1"><span className="text-[9px] text-slate-600">{cell.label}</span></div>;
              }
              const [num, sym, name, mass, cat] = cell.el;
              const c = CATS[cat];
              return (
                <button key={num} onClick={() => showDetails(num)}
                  className={`aspect-square rounded p-0.5 flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-110 hover:z-10 hover:shadow-lg border border-transparent ${!cell.visible ? 'opacity-10 pointer-events-none' : ''} ${cell.highlight ? 'ring-2 ring-white shadow-lg z-10' : ''}`}
                  style={{ background: c.bg, borderColor: c.color + '30', color: c.color }}
                  title={`${name} (${sym}) — ${mass} u`}>
                  <span className="text-[7px] leading-none opacity-80">{num}</span>
                  <span className="text-sm sm:text-base font-bold leading-tight">{sym}</span>
                  <span className="text-[5px] sm:text-[6px] leading-none opacity-75 truncate max-w-full text-center hidden sm:block">{name}</span>
                  <span className="text-[5px] sm:text-[6px] leading-none opacity-60 hidden sm:block">{mass}</span>
                </button>
              );
            })}
          </div>
        </div>

        {selectedEl && (
          <div className="bg-white/[0.04] border border-indigo-500/20 rounded-2xl p-5 animate-[fadeIn_0.2s_ease]">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-xl flex flex-col items-center justify-center font-bold text-white shrink-0"
                style={{ background: `linear-gradient(135deg, ${CATS[selectedEl[4]].color}, ${CATS[selectedEl[4]].color}cc)` }}>
                <span className="text-xs opacity-80">{selectedEl[0]}</span>
                <span className="text-3xl leading-tight">{selectedEl[1]}</span>
                <span className="text-[10px] opacity-90">{selectedEl[2]}</span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white m-0">{selectedEl[2]} ({selectedEl[1]})</h2>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mt-1" style={{ background: CATS[selectedEl[4]].bg, color: CATS[selectedEl[4]].color, border: `1px solid ${CATS[selectedEl[4]].color}40` }}>
                  {CATS[selectedEl[4]].name}
                </span>
              </div>
              <button onClick={() => setSelectedEl(null)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">✕</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                ['Atomic Number', selectedEl[0]],
                ['Symbol', selectedEl[1]],
                ['Name', selectedEl[2]],
                ['Atomic Mass', selectedEl[3] + ' u'],
                ['Category', CATS[selectedEl[4]].name],
                ['Electron Config', selectedEl[7]],
                ['Phase (STP)', selectedEl[8]],
                ['Density', selectedEl[9] !== null ? selectedEl[9] + ' g/cm³' : 'Unknown'],
                ['Melting Point', selectedEl[10] !== null ? selectedEl[10] + ' °C' : 'Unknown'],
                ['Boiling Point', selectedEl[11] !== null ? selectedEl[11] + ' °C' : 'Unknown'],
                ['Year Discovered', selectedEl[12]],
              ].map(([label, value]) => (
                <div key={label} className="px-3 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-lg">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">{label}</div>
                  <div className="text-sm text-white font-medium break-words">{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-sm font-bold text-slate-300 mb-2">About the Periodic Table</h2>
          <p className="text-xs text-slate-400 leading-relaxed m-0">The periodic table organizes 118 known chemical elements by atomic number, electron configuration, and recurring chemical properties. Elements in the same group (column) share similar chemical behaviors. The table was first devised by Dmitri Mendeleev in 1869.</p>
        </div>
      </div>
    </ToolLayout>
  )
}
