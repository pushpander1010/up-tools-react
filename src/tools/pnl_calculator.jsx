import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const MARKETS = {
  india: { label: 'India (NSE/BSE)', prefix: '₹' },
  us: { label: 'USA (NYSE/NASDAQ)', prefix: '$' },
}

const STOCKS = {
  india: [
    ["RELIANCE","Reliance Industries"],["TCS","Tata Consultancy Services"],["HDFCBANK","HDFC Bank"],
    ["INFY","Infosys"],["ICICIBANK","ICICI Bank"],["HINDUNILVR","Hindustan Unilever"],
    ["ITC","ITC Limited"],["SBIN","State Bank of India"],["BHARTIARTL","Bharti Airtel"],
    ["KOTAKBANK","Kotak Mahindra Bank"],["LT","Larsen & Toubro"],["AXISBANK","Axis Bank"],
    ["WIPRO","Wipro"],["TATAMOTORS","Tata Motors"],["SUNPHARMA","Sun Pharmaceutical"],
    ["MARUTI","Maruti Suzuki"],["TITAN","Titan Company"],["ADANIENT","Adani Enterprises"],
    ["BAJFINANCE","Bajaj Finance"],["HCLTECH","HCL Technologies"],["TECHM","Tech Mahindra"],
    ["ULTRACEMCO","UltraTech Cement"],["NTPC","NTPC Limited"],["ONGC","ONGC"],
    ["POWERGRID","Power Grid Corp"],["TATASTEEL","Tata Steel"],["JSWSTEEL","JSW Steel"],
    ["COALINDIA","Coal India"],["BPCL","Bharat Petroleum"],["DRREDDY","Dr. Reddy's Labs"],
    ["CIPLA","Cipla"],["DIVISLAB","Divi's Laboratories"],["EICHERMOT","Eicher Motors"],
    ["BAJAJFINSV","Bajaj Finserv"],["HEROMOTOCO","Hero MotoCorp"],["TATACONSUM","Tata Consumer"],
    ["APOLLOHOSP","Apollo Hospitals"],["NESTLEIND","Nestle India"],["BAJAJ-AUTO","Bajaj Auto"],
    ["BRITANNIA","Britannia Industries"],["ASIANPAINT","Asian Paints"],["HINDALCO","Hindalco"],
    ["INDUSINDBK","IndusInd Bank"],["GRASIM","Grasim Industries"],["TRENT","Trent"],
    ["DMART","Avenue Supermarts"],["ZOMATO","Zomato"],["PAYTM","One97 Communications"],
    ["NYKAA","FSN E-Commerce"],["POLICYBZR","PB Fintech"],["DELHIVERY","Delhivery"],
    ["LICI","Life Insurance Corp"],["IRCTC","IRCTC"],["HAL","Hindustan Aeronautics"],
    ["BEL","Bharat Electronics"],["SAIL","Steel Authority"],["TATACHEM","Tata Chemicals"],
    ["VEDL","Vedanta"],["ADANIPORTS","Adani Ports"],["COFORGE","Coforge"],
    ["MPHASIS","Mphasis"],["PERSISTENT","Persistent Systems"],["LTIM","LTIMindtree"],
    ["INDIGO","InterGlobe Aviation"],["GODREJCP","Godrej Consumer"],["DABUR","Dabur India"],
    ["MARICO","Marico"],["COLPAL","Colgate-Palmolive"],["PIDILITIND","Pidilite Industries"],
    ["ACC","ACC Limited"],["AMBUJACEM","Ambuja Cements"],["SHRIRAMFIN","Shriram Finance"],
    ["MUTHOOTFIN","Muthoot Finance"],["MANAPPURAM","Manappuram Finance"],["FEDERALBNK","Federal Bank"],
    ["BANDHANBNK","Bandhan Bank"],["IDFCFIRSTB","IDFC First Bank"],["PNB","Punjab National Bank"],
    ["CANBK","Canara Bank"],["UNIONBANK","Union Bank"],["BANKBARODA","Bank of Baroda"],
    ["UCO","UCO Bank"],["IOB","Indian Overseas Bank"],["CENTRALBK","Central Bank"],
    ["MAHABANK","Bank of Maharashtra"],["JINDALSTEL","Jindal Steel"],["NMDC","NMDC"],
    ["HINDZINC","Hindustan Zinc"],["NATIONALUM","National Aluminium"],["TATAPOWER","Tata Power"],
    ["TATAELXSI","Tata Elxsi"],["TATACOMM","Tata Communications"],["TATAINVEST","Tata Investment"],
    ["TORNTPHARM","Torrent Pharma"],["TORNTPOWER","Torrent Power"],["VOLTAS","Voltas"],
    ["WHIRLPOOL","Whirlpool India"],["ZEEL","Zee Entertainment"],["ZYDUSLIFE","Zydus Lifesciences"],
    ["HAVELLS","Havells India"],["POLYCAB","Polycab India"],["CROMPTON","Crompton Greaves"],
    ["VOLTAS","Voltas"],["BLUESTARCO","Blue Star"],["BATAINDIA","Bata India"],
    ["PAGEIND","Page Industries"],["KENNESYS","Kenvi Cosmetics"],["RECLTD","REC Limited"],
    ["PFC","Power Finance Corp"],["IREDA","Indian Renewable Energy"],["NAUKRI","Info Edge India"],
    ["INDIAMART","IndiaMART InterMESH"],["CDSL","Central Depository Services"],["BSE","BSE Limited"],
    ["CAMS","Computer Age Management"],["KFINTECH","KFin Technologies"],["MCX","Multi Commodity Exchange"],
    ["IIFL","IIFL Finance"],["CHOLAFIN","Cholamandalam Investment"],["SBICARD","SBI Cards"],
    ["HDFCLIFE","HDFC Life Insurance"],["SBILIFE","SBI Life Insurance"],["ICICIPRULI","ICICI Prudential"],
    ["LICHSGFIN","LIC Housing Finance"],["OBEROIRLTY","Oberoi Realty"],["PRESTIGE","Prestige Estates"],
    ["GODREJPROP","Godrej Properties"],["BRIGADE","Brigade Enterprises"],["SOBHA","Sobha Limited"],
    ["DLF","DLF Limited"],["PHOENIXLTD","Phoenix Mills"],["MAHLIFE","Mahindra Lifespaces"],
    ["LALPATHLAB","Dr Lal PathLabs"],["MAXHEALTH","Max Healthcare"],["ASTRAL","Astral Limited"],
    ["FINOLEX","Finolex Cables"],["CARBORUNIV","Carborundum Universal"],["SCHAEFFLER","Schaeffler India"],
    ["TIMKEN","Timken India"],["THERMAX","Thermax"],["KANSAINER","Kansai Nerolac"],
    ["BERGEPAINT","Berger Paints"],["KAJARIACER","Kajaria Ceramics"],["CENTURYPLY","Century Plyboards"],
    ["AMARAJABAT","Amara Raja Energy"],["EXIDEIND","Exide Industries"],["MINDACORP","Minda Corp"],
    ["SONACOMS","Sona BLW Precision"],["MOTHERSON","Motherson Sumi"],["BOSCHLTD","Bosch"],
    ["MRF","MRF Limited"],["APOLLOTYRE","Apollo Tyres"],["JKTYRE","JK Tyre"],
    ["BALKRISIND","Balkrishna Industries"],["ESCORTS","Escorts Kubota"],["VGUARD","V-Guard Industries"],
    ["CUMMINSIND","Cummins India"],["TATACONSUM","Tata Consumer"],["GODREJAGRO","Godrej Agrovet"],
    ["BRITANNIA","Britannia"],["EMAMILTD","Emami"],["GSKCONSUMER","GSK Consumer"],
    ["COLPAL","Colgate-Palmolive"],["NESTLEIND","Nestle India"],["UNITDSPR","United Spirits"],
    ["UBL","United Breweries"],["RADICO","Radico Khaitan"],["GLOBUSSPR","Global Spirits"],
    ["AUROPHARMA","Aurobindo Pharma"],["LUPIN","Lupin Limited"],["TORNTPHARM","Torrent Pharma"],
    ["ALKEM","Alkem Laboratories"],["IPCALAB","Ipca Laboratories"],["GRANULES","Granules India"],
    ["NATCOPHARM","Natco Pharma"],["LAURUSLABS","Laurus Labs"],["AJANTPHARM","Ajanta Pharma"],
    ["ERIS","Eris Lifesciences"],["JBCHEPHARM","JB Chemicals"],["GLENMARK","Glenmark Pharma"],
    ["SOLARINDS","Solar Industries"],["PARAS","Paras Defence"],["DATAPATTENS","Data Patterns"],
    ["BEL","Bharat Electronics"],["HAL","Hindustan Aeronautics"],["MAZAGON","Mazagon Dock"],
    ["COCHINSHIP","Cochin Shipyard"],["GRSE","Garden Reach Shipyard"],["BEML","BEML"],
    ["BHEL","Bharat Heavy Electricals"],["GAIL","GAIL India"],["PETRONET","Petronet LNG"],
    ["ATGL","Adani Total Gas"],["IGL","Indraprastha Gas"],["MGL","Mahanagar Gas"],
    ["INDIGOPNTS","Indigo Paints"],["KANSAINER","Kansai Nerolac"],["CAMS","CAMS"],
    ["AFFLE","Affle India"],["HAPPSTMNDS","Happiest Minds"],["ROUTE","Route Mobile"],
    ["TANLA","Tanla Platforms"],["ZENSAR","Zensar Technologies"],["BSOFT","Birlasoft"],
    ["POLYMEDICUM","Poly Medicure"],["SPARC","Sun Pharma Advanced"],["THEMISMED","Themis Medicare"],
    ["LALPATHLAB","Dr Lal PathLabs"],["METROPOLIS","Metropolis Healthcare"],
    ["ASTRAZEN","AstraZeneca Pharma"],["SANOFI","Sanofi India"],["ABBOTINDIA","Abbott India"],
    ["PFIZER","Pfizer India"],["GSKPHARMA","GlaxoSmithKline"],["NOVARTIS","Novartis India"],
    ["IPCALAB","Ipca Laboratories"],["AARTIIND","Aarti Industries"],["DEEPAKNTR","Deepak Nitrite"],
    ["ATUL","Atul Limited"],["NAVINFLUOR","Navin Fluorine"],["SRF","SRF Limited"],
    ["GUJFLUORO","Gujarat Fluorochemicals"],["FLUOROCHEM","Fluorochemicals"],
    ["CLEAN","Clean Science"],["ANURAS","Anupam Rasayan"],["YASHO","Yasho Industries"],
    ["AAVAS","Aavas Financiers"],["CANFINHOME","Can Fin Homes"],["APTUS","Aptus Value Housing"],
    ["HOMEFIRST","Home First Finance"],["POKHARNA","PNC Infratech"],["IRB","IRB Infrastructure"],
    ["NCC","NCC Limited"],["KEC","KEC International"],["RAILTEL","RailTel Corporation"],
    ["RVNL","Rail Vikas Nigam"],["IRFC","Indian Railway Finance"],["RECLTD","REC Limited"],
    ["PFC","Power Finance Corp"],["IRED","Indian Renewable Energy"],["SJVN","SJVN Limited"],
    ["NHPC","NHPC Limited"],["TATAPOWER","Tata Power"],["ADANIGREEN","Adani Green Energy"],
    ["ADANIENSOL","Adani Energy Solutions"],["NLC","NLC India"],["TARSONS","Tarsons Products"],
    ["MAPMYINDIA","C.E. Info Systems"],["RATNAMANI","Ratnamani Metals"],
    ["TATAMETALI","Tata Metaliks"],["MAHSEAMLES","Maharashtra Seamless"],
    ["JSL","Jindal Stainless"],["JSLHISAR","Jindal Stainless Hisar"],
    ["KALPATPOWR","Kalpataru Power"],["APTECHT","Aptech Limited"],["NETWORK18","Network18 Media"],
    ["TV18BRDCST","TV18 Broadcast"],["PVRINOX","PVR Inox"],["INOXGREEN","Inox Green Energy"],
    ["CRAFTSMAN","Craftsman Auto"],["CAMS","CAMS"],["KFINTECH","KFin Technologies"],
  ],
  us: [
    ["AAPL","Apple Inc."],["MSFT","Microsoft"],["AMZN","Amazon.com"],["NVDA","NVIDIA"],
    ["GOOGL","Alphabet (Class A)"],["GOOG","Alphabet (Class C)"],["META","Meta Platforms"],
    ["TSLA","Tesla Inc."],["BRK-B","Berkshire Hathaway"],["LLY","Eli Lilly"],
    ["AVGO","Broadcom"],["JPM","JPMorgan Chase"],["V","Visa Inc."],["XOM","Exxon Mobil"],
    ["UNH","UnitedHealth"],["WMT","Walmart"],["MA","Mastercard"],["JNJ","Johnson & Johnson"],
    ["PG","Procter & Gamble"],["HD","Home Depot"],["CVX","Chevron"],["MRK","Merck & Co."],
    ["ABBV","AbbVie"],["COST","Costco"],["KO","Coca-Cola"],["PEP","PepsiCo"],
    ["BAC","Bank of America"],["AMD","Advanced Micro Devices"],["CRM","Salesforce"],
    ["NFLX","Netflix"],["TMO","Thermo Fisher"],["LIN","Linde"],["CSCO","Cisco"],
    ["ORCL","Oracle"],["ACN","Accenture"],["DHR","Danaher"],["WFC","Wells Fargo"],
    ["MCD","McDonald's"],["ABT","Abbott Labs"],["QCOM","Qualcomm"],["TXN","Texas Instruments"],
    ["PM","Philip Morris"],["GE","GE Aerospace"],["AMGN","Amgen"],["INTC","Intel"],
    ["CAT","Caterpillar"],["NOW","ServiceNow"],["GS","Goldman Sachs"],["LOW","Lowe's"],
    ["HON","Honeywell"],["AMAT","Applied Materials"],["ISRG","Intuitive Surgical"],
    ["NEE","NextEra Energy"],["SPGI","S&P Global"],["BLK","BlackRock"],["VRTX","Vertex Pharma"],
    ["GILD","Gilead Sciences"],["ADP","ADP"],["ADI","Analog Devices"],["SYK","Stryker"],
    ["CB","Chubb"],["MMC","Marsh & McLennan"],["PLD","Prologis"],["CME","CME Group"],
    ["SO","Southern Company"],["DUK","Duke Energy"],["CL","Colgate-Palmolive"],["ZTS","Zoetis"],
    ["CI","Cigna"],["SCHW","Charles Schwab"],["MDLZ","Mondelez"],["TGT","Target"],
    ["BDX","Becton Dickinson"],["ICE","Intercontinental Exchange"],["WM","Waste Management"],
    ["SLB","Schlumberger"],["PFE","Pfizer"],["SNY","Sanofi"],["CMCSA","Comcast"],
    ["DIS","Walt Disney"],["T","AT&T"],["VZ","Verizon"],["NKE","Nike"],["BA","Boeing"],
    ["PYPL","PayPal"],["UBER","Uber"],["SQ","Block"],["COIN","Coinbase"],["PLTR","Palantir"],
    ["SOFI","SoFi"],["SNOW","Snowflake"],["RIVN","Rivian"],["LCID","Lucid"],
    ["NIO","NIO"],["RBLX","Roblox"],["SPOT","Spotify"],["ABNB","Airbnb"],["DASH","DoorDash"],
    ["NET","Cloudflare"],["DDOG","Datadog"],["CRWD","CrowdStrike"],["ZS","Zscaler"],
    ["PANW","Palo Alto Networks"],["FTNT","Fortinet"],["TTD","The Trade Desk"],
    ["ROKU","Roku"],["HOOD","Robinhood"],["W","Wayfair"],["CHWY","Chewy"],["DKNG","DraftKings"],
    ["MGM","MGM Resorts"],["LVS","Las Vegas Sands"],["WYNN","Wynn Resorts"],
    ["MAR","Marriott"],["HLT","Hilton"],["ORLY","O'Reilly"],["AZO","AutoZone"],
    ["TJX","TJX Companies"],["ROST","Ross Stores"],["BBY","Best Buy"],["TSM","TSMC"],
    ["ASML","ASML Holding"],["MRVL","Marvell Technology"],["MU","Micron Technology"],
    ["LRCX","Lam Research"],["KLAC","KLAC"],["SNPS","Synopsys"],["CDNS","Cadence Design"],
    ["NXPI","NXP Semiconductors"],["ARM","Arm Holdings"],["SMCI","Super Micro Computer"],
    ["IONQ","IonQ"],["RGTI","Rigetti Computing"],["QUBT","Quantum Computing"],
    ["MSTR","MicroStrategy"],["MARA","Marathon Digital"],["RIOT","Riot Platforms"],
    ["UPST","Upstart"],["AFRM","Affirm"],["LMND","Lemonade"],["OPEN","Opendoor"],
    ["PINS","Pinterest"],["SNAP","Snap Inc."],["BILI","Bilibili"],["PDD","PDD Holdings"],
    ["JD","JD.com"],["BABA","Alibaba"],["XPEV","XPeng"],["LI","Li Auto"],
    ["BGNE","BeiGene"],["ZLAB","Zai Lab"],["TAL","TAL Education"],["EDU","New Oriental"],
    ["GPN","Global Payments"],["FIS","Fidelity National"],["WDAY","Workday"],
    ["PCTY","Paylocity"],["PAYC","Paycom"],["RPD","Rapid7"],["S","SentinelOne"],
    ["CFLT","Confluent"],["MDB","MongoDB"],["DBX","Dropbox"],["BOX","Box"],
    ["DOCU","DocuSign"],["ZM","Zoom Video"],["PTON","Peloton"],["BYND","Beyond Meat"],
    ["SNDL","Sundial"],["TLRY","Tilray"],["CGC","Canopy Growth"],["ACB","Aurora Cannabis"],
    ["AI","C3.ai"],["BBAI","BigBear.ai"],["SOUN","SoundHound AI"],["SYM","Symbotic"],
    ["JOBY","Joby Aviation"],["ACHR","Archer Aviation"],["RKLB","Rocket Lab"],
    ["ASTS","AST SpaceMobile"],["LUNR","Intuitive Machines"],["RDW","Redwire"],
    ["GEV","GE Vernova"],["VST","Vistra"],["CEG","Constellation Energy"],["OKLO","Oklo Inc."],
    ["SMR","NuScale Power"],["NNE","Nano Nuclear Energy"],["LEU","Centrus Energy"],
    ["DAVE","Dave Inc."],["AFRM","Affirm"],["UPST","Upstart"],["SOFI","SoFi"],
    ["HOOD","Robinhood"],["CURL","Curl"],["HIMS","Hims & Hers Health"],["CLOV","Clover Health"],
    ["WISH","ContextLogic"],["BARK","Bark"],["FUBO","FuboTV"],["BYND","Beyond Meat"],
    ["NKLA","Nikola"],["FSR","Fisker"],["FFIE","Faraday Future"],["GOEV","Canoo"],
    ["RIDE","Lordstown Motors"],["MULN","Mullen Automotive"],["SBEV","Splash Beverage"],
    ["GFAI","Guardforce AI"],["MCOM","Somnigroup"],["SKLZ","Skillz"],["BIRD","Allbirds"],
    ["CLVS","Clovis Oncology"],["VCEL","Vericel"],["NVCR","NovoCure"],["IONS","Ionis Pharma"],
    ["CRSP","CRISPR Therapeutics"],["BEAM","Beam Therapeutics"],["EDIT","Editas Medicine"],
    ["NTLA","Intellia Therapeutics"],["VERV","Verve Therapeutics"],["RKTX","Rocket Pharmaceuticals"],
    ["BLUE","bluebird bio"],["QURE","uniQure"],["SRPT","Sarepta Therapeutics"],
    ["RARE","Ultragenyx Pharmaceutical"],["MDGL","Madrigal Pharmaceuticals"],
    ["ARQT","Arcutis Biotherapeutics"],["DERM","Dermavant Sciences"],
    ["KRTX","Karuna Therapeutics"],["AXSM","Axsome Therapeutics"],["CERE","Cerevel Therapeutics"],
    ["PRAX","Praxis Precision"],["BMRN","BioMarin"],["REGN","Regeneron"],
    ["ILMN","Illumina"],["PACB","Pacific Biosciences"],["ONT","Oxford Nanopore"],
    ["TWST","Twist Bioscience"],["DNA","Ginkgo Bioworks"],["RXRX","Recursion Pharma"],
    ["ABSI","AbCellera"],["SDGR","Schrodinger"],["CDNA","CareDx"],["EXAS","Exact Sciences"],
  ],
}

let nextId = 1
function makeRow() { return { id: nextId++, symbol: '', name: '', qty: '', buyPrice: '', sellPrice: '' } }

function AnimatedNumber({ value, prefix = '' }) {
  const [display, setDisplay] = useState(value)
  const frameRef = useState(null)
  return <span>{prefix}{Math.round(value).toLocaleString('en-IN')}</span>
}

export default function pnl_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [market, setMarket] = useState('india')
  const [rows, setRows] = useState([makeRow()])
  const [copied, setCopied] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeDropdown, setActiveDropdown] = useState(null)

  const prefix = MARKETS[market].prefix

  const filteredStocks = useMemo(() => {
    const stocks = STOCKS[market] || []
    if (!searchQuery) return stocks
    const q = searchQuery.toLowerCase()
    return stocks.filter(([s, n]) => s.toLowerCase().includes(q) || n.toLowerCase().includes(q))
  }, [market, searchQuery])

  const trades = useMemo(() => {
    return rows.map(r => {
      const qty = parseFloat(r.qty) || 0
      const buy = parseFloat(r.buyPrice) || 0
      const sell = parseFloat(r.sellPrice) || 0
      if (qty <= 0 || buy <= 0 || sell <= 0) return { ...r, pnl: 0, pnlPct: 0, invested: 0, returned: 0, valid: false }
      const invested = qty * buy, returned = qty * sell
      const pnl = returned - invested, pnlPct = invested > 0 ? (pnl / invested) * 100 : 0
      return { ...r, pnl, pnlPct, invested, returned, valid: true }
    })
  }, [rows])

  const totals = useMemo(() => {
    let ti = 0, tr = 0, tp = 0, vc = 0
    for (const t of trades) { if (t.valid) { ti += t.invested; tr += t.returned; tp += t.pnl; vc++ } }
    return { totalInvested: ti, totalReturned: tr, totalPnl: tp, totalPnlPct: ti > 0 ? (tp / ti) * 100 : 0, validCount: vc }
  }, [trades])

  const updateRow = useCallback((id, field, val) => setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: val } : r)), [])
  const addRow = useCallback(() => setRows(prev => [...prev, makeRow()]), [])
  const removeRow = useCallback((id) => setRows(prev => prev.length > 1 ? prev.filter(r => r.id !== id) : prev), [])

  const selectStock = useCallback((id, symbol, name) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, symbol, name } : r))
    setActiveDropdown(null)
    setSearchQuery('')
  }, [])

  const handleCopy = useCallback(() => {
    const lines = [`Share P&L Report`, `Market: ${MARKETS[market].label}`, '']
    trades.forEach(t => {
      if (t.valid) {
        lines.push(`${t.symbol} — ${t.name}`)
        lines.push(`  Qty: ${t.qty} | Buy: ${prefix}${parseFloat(t.buyPrice).toLocaleString('en-IN')} | Sell: ${prefix}${parseFloat(t.sellPrice).toLocaleString('en-IN')}`)
        lines.push(`  P&L: ${prefix}${Math.round(t.pnl).toLocaleString('en-IN')} (${t.pnlPct >= 0 ? '+' : ''}${t.pnlPct.toFixed(2)}%)`)
        lines.push('')
      }
    })
    lines.push(`Total Invested: ${prefix}${Math.round(totals.totalInvested).toLocaleString('en-IN')}`)
    lines.push(`Total P&L: ${prefix}${Math.round(totals.totalPnl).toLocaleString('en-IN')} (${totals.totalPnlPct >= 0 ? '+' : ''}${totals.totalPnlPct.toFixed(2)}%)`)
    navigator.clipboard.writeText(lines.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [trades, totals, market, prefix])

  const inputClass = "bg-white/[0.06] border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white font-semibold outline-none focus:border-yellow-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Share P&L Calculator"
      desc={`Track stock portfolio profit & loss across Indian (NSE/BSE) and US (NYSE/NASDAQ) markets. ${STOCKS.india.length} Indian + ${STOCKS.us.length} US stocks — complete list, multi-trade tracking.`}
      icon="📊" iconBg="rgba(234,179,8,0.08)"
      category="finance" slug="pnl-calculator"
      faq={[
        { q: 'How is share P&L calculated?', a: 'P&L = (Sell Price - Buy Price) × Quantity. Positive = profit, negative = loss.' },
        { q: 'How many stocks are available?', a: `We have ${STOCKS.india.length} Indian stocks (NSE/BSE) and ${STOCKS.us.length} US stocks (NYSE/NASDAQ) — the complete list of major listed companies.` },
        { q: 'Can I track multiple trades?', a: 'Yes — click "+ Add Trade" for unlimited rows. Total P&L across all trades is shown at the bottom.' },
      ]}
      howItWorks={[
        'Choose your market — India or USA.',
        'Search and select a stock from the complete list.',
        'Enter quantity, buy price, and sell price.',
        'Add more trades with "+ Add Trade".',
        'View per-trade and total P&L instantly.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Share P&L Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/pnl-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Market Selector */}
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(MARKETS).map(([key, m]) => (
            <button key={key} onClick={() => { setMarket(key); setRows([makeRow()]); setSearchQuery('') }}
              className={`py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 border-2
                ${market === key ? 'bg-yellow-500/15 border-yellow-500/30 text-yellow-400 shadow-lg shadow-yellow-500/10' : 'bg-white/[0.04] border-white/6 text-slate-500 hover:border-white/12 hover:text-slate-300'}`}>
              {m.label}
            </button>
          ))}
        </div>

        {/* Trade Rows */}
        <div className="space-y-3">
          {trades.map((t, i) => (
            <div key={t.id} className="rounded-2xl border-2 border-white/8 bg-white/[0.03] p-4 space-y-3" style={{ animation: 'slideUp 0.2s ease' }}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Trade #{i + 1}</span>
                {trades.length > 1 && <button onClick={() => removeRow(t.id)} className="text-red-400/40 hover:text-red-400 text-xs transition-colors">✕ Remove</button>}
              </div>

              {/* Stock Selector */}
              <div className="relative">
                <button onClick={() => { setActiveDropdown(activeDropdown === t.id ? null : t.id); setSearchQuery(t.symbol || '') }}
                  className={`w-full text-left ${inputClass} rounded-xl flex items-center justify-between cursor-pointer`}>
                  <span className={t.symbol ? 'text-white' : 'text-slate-500'}>{t.symbol ? `${t.symbol} — ${t.name}` : `Search ${STOCKS[market]?.length || 0} stocks...`}</span>
                  <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>

                {activeDropdown === t.id && (
                  <div className="absolute z-50 mt-1 w-full max-h-80 overflow-y-auto rounded-xl border border-white/10 bg-slate-900 shadow-2xl">
                    <div className="p-2 border-b border-white/8 sticky top-0 bg-slate-900 z-10">
                      <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                          placeholder={`Search ${filteredStocks.length} stocks...`}
                          className="w-full bg-white/[0.06] border border-white/8 rounded-lg pl-9 pr-3 py-2 text-sm text-white outline-none placeholder:text-slate-500"
                          onClick={e => e.stopPropagation()} autoFocus />
                      </div>
                    </div>
                    {filteredStocks.length === 0 && (
                      <div className="p-4 text-center text-xs text-slate-500">No stocks match "{searchQuery}"</div>
                    )}
                    {filteredStocks.slice(0, 50).map(([sym, name]) => (
                      <button key={sym} onClick={() => selectStock(t.id, sym, name)}
                        className="w-full text-left px-3 py-2 hover:bg-white/[0.06] transition-colors flex items-center justify-between border-b border-white/5 last:border-0">
                        <span className="text-sm font-bold text-white">{sym}</span>
                        <span className="text-xs text-slate-500 ml-2 truncate">{name}</span>
                      </button>
                    ))}
                    {filteredStocks.length > 50 && <div className="p-2 text-center text-[10px] text-slate-600">Showing 50 of {filteredStocks.length} — type to narrow</div>}
                  </div>
                )}
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Qty</label>
                  <input type="number" value={t.qty} onChange={e => updateRow(t.id, 'qty', e.target.value)} placeholder="0" min="1" className={`w-full ${inputClass} text-center`} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Buy {prefix}</label>
                  <input type="number" value={t.buyPrice} onChange={e => updateRow(t.id, 'buyPrice', e.target.value)} placeholder="0.00" min="0" step="0.01" className={`w-full ${inputClass} text-center`} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Sell {prefix}</label>
                  <input type="number" value={t.sellPrice} onChange={e => updateRow(t.id, 'sellPrice', e.target.value)} placeholder="0.00" min="0" step="0.01" className={`w-full ${inputClass} text-center`} />
                </div>
              </div>

              {/* Per-trade P&L */}
              {t.valid && (
                <div className={`flex items-center justify-between p-3 rounded-xl border ${t.pnl >= 0 ? 'bg-emerald-500/10 border-emerald-500/15' : 'bg-red-500/10 border-red-500/15'}`}>
                  <div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${t.pnl >= 0 ? 'bg-emerald-400' : 'bg-red-400'}`} /><span className="text-xs font-bold text-slate-400">{t.symbol}</span></div>
                  <div className="text-right">
                    <span className={`text-sm font-extrabold ${t.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{t.pnl >= 0 ? '+' : ''}{prefix}{Math.round(t.pnl).toLocaleString('en-IN')}</span>
                    <span className={`text-xs ml-2 ${t.pnl >= 0 ? 'text-emerald-400/60' : 'text-red-400/60'}`}>({t.pnlPct >= 0 ? '+' : ''}{t.pnlPct.toFixed(2)}%)</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <button onClick={addRow} className="w-full py-3 rounded-2xl border-2 border-dashed border-white/8 text-sm font-semibold text-slate-400 hover:text-white hover:border-white/15 transition-all">+ Add Trade</button>

        {/* Total P&L */}
        {totals.validCount > 0 && (
          <div ref={resultRef} className="rounded-3xl border-2 border-yellow-500/15 bg-gradient-to-br from-yellow-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden" style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" /><h3 className="text-sm font-bold text-yellow-400 uppercase tracking-wider">Portfolio Summary</h3></div>
              <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/5 border border-white/8 text-slate-400 hover:text-white hover:border-white/15 hover:bg-white/10 transition-all active:scale-95">{copied ? '✓ Copied!' : '📋 Copy'}</button>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
              <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.05] border border-white/8 min-w-0">
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Invested</div>
                <div className="text-sm sm:text-lg font-extrabold text-white mt-1 truncate">{prefix}{Math.round(totals.totalInvested).toLocaleString('en-IN')}</div>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.05] border border-white/8 min-w-0">
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Current</div>
                <div className="text-sm sm:text-lg font-extrabold text-white mt-1 truncate">{prefix}{Math.round(totals.totalReturned).toLocaleString('en-IN')}</div>
              </div>
              <div className={`p-2.5 sm:p-3 rounded-xl border min-w-0 ${totals.totalPnl >= 0 ? 'bg-emerald-500/10 border-emerald-500/15' : 'bg-red-500/10 border-red-500/15'}`}>
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">P&L</div>
                <div className={`text-sm sm:text-lg font-extrabold mt-1 truncate ${totals.totalPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{totals.totalPnl >= 0 ? '+' : ''}{prefix}{Math.round(Math.abs(totals.totalPnl)).toLocaleString('en-IN')}</div>
              </div>
            </div>
            <div className="flex gap-1 h-10 rounded-xl overflow-hidden mb-4">
              <div className="bg-white/15 rounded-l-xl flex items-center justify-center text-[10px] font-bold text-white/80 transition-all duration-500" style={{ width: `${totals.totalInvested > 0 ? (totals.totalInvested / totals.totalReturned) * 100 : 50}%` }}>Invested</div>
              <div className={`rounded-r-xl flex items-center justify-center text-[10px] font-bold text-white/80 transition-all duration-500 ${totals.totalPnl >= 0 ? 'bg-emerald-500/70' : 'bg-red-500/70'}`} style={{ width: `${totals.totalReturned > 0 ? (Math.abs(totals.totalPnl) / totals.totalReturned) * 100 : 50}%` }}>{totals.totalPnl >= 0 ? 'Profit' : 'Loss'}</div>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Invested: {prefix}{Math.round(totals.totalInvested).toLocaleString('en-IN')}</span>
              <span className={`font-bold ${totals.totalPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{totals.totalPnlPct >= 0 ? '+' : ''}{totals.totalPnlPct.toFixed(2)}% overall</span>
            </div>
          </div>
        )}

        {totals.validCount === 0 && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📊</div>
            <p className="text-sm text-slate-600 font-medium">Select a stock, enter quantity and buy/sell prices to calculate P&L</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
