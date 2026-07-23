import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const WMO = {
  0: ['☀️', 'Clear sky'], 1: ['🌤️', 'Mainly clear'], 2: ['⛅', 'Partly cloudy'], 3: ['☁️', 'Overcast'],
  45: ['🌫️', 'Foggy'], 48: ['🌫️', 'Rime fog'], 51: ['🌦️', 'Light drizzle'], 53: ['🌦️', 'Moderate drizzle'],
  55: ['🌧️', 'Dense drizzle'], 61: ['🌧️', 'Slight rain'], 63: ['🌧️', 'Moderate rain'], 65: ['🌧️', 'Heavy rain'],
  71: ['❄️', 'Slight snow'], 73: ['❄️', 'Moderate snow'], 75: ['❄️', 'Heavy snow'],
  80: ['🌦️', 'Rain showers'], 81: ['🌧️', 'Moderate showers'], 82: ['⛈️', 'Violent showers'],
  95: ['⛈️', 'Thunderstorm'], 96: ['⛈️', 'Thunderstorm + hail'], 99: ['⛈️', 'Thunderstorm + heavy hail'],
}

const DNAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function wmoIcon(code) { return (WMO[code] || ['🌈', 'Unknown'])[0] }
function wmoDesc(code) { return (WMO[code] || ['🌈', 'Unknown'])[1] }

export default function weather_forecast() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [city, setCity] = useState('')
  const [unit, setUnit] = useState('celsius')
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [recent, setRecent] = useState(() => {
    try { return JSON.parse(localStorage.getItem('uptools.weather.recent') || '[]') } catch { return [] }
  })

  const conv = useCallback((t) => unit === 'fahrenheit' ? Math.round(t * 9 / 5 + 32) : Math.round(t), [unit])
  const unitLabel = unit === 'cahrenheit' ? '°F' : '°C'

  const saveRecent = useCallback((name) => {
    setRecent(prev => {
      const next = [name, ...prev.filter(c => c !== name)].slice(0, 8)
      localStorage.setItem('uptools.weather.recent', JSON.stringify(next))
      return next
    })
  }, [])

  const searchCity = useCallback(async (q) => {
    if (!q) return
    setError('')
    setWeather(null)
    setLoading(true)
    try {
      const geoR = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`, {
        headers: { 'User-Agent': 'uptools-weather/1.0' }
      })
      const geo = await geoR.json()
      if (!geo.length) throw new Error('City not found')
      const { lat, lon, display_name } = geo[0]
      const name = display_name.split(',')[0]
      const wR = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&hourly=temperature_2m,weather_code&timezone=auto&forecast_days=7`)
      const w = await wR.json()
      w._name = name
      setWeather(w)
      saveRecent(name)
    } catch {
      setError(`Could not find weather for "${q}". Please check the city name.`)
    } finally {
      setLoading(false)
    }
  }, [saveRecent])

  const geoLocate = useCallback(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(async pos => {
      const { latitude: lat, longitude: lon } = pos.coords
      try {
        const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`, {
          headers: { 'User-Agent': 'uptools-weather/1.0' }
        })
        const d = await r.json()
        const cityName = d.address.city || d.address.town || d.address.village || ''
        if (cityName) { setCity(cityName); searchCity(cityName) }
      } catch { searchCity(`${lat},${lon}`) }
    })
  }, [searchCity])

  return (
    <ToolLayout
      title="Weather Forecast"
      desc="Check current weather and 7-day forecast for any city worldwide."
      icon="🌤️" iconBg="rgba(6,182,212,0.08)"
      category="dev" slug="weather-forecast"
      faq={[
        { q: "Where does weather data come from?", a: "Weather data is fetched from Open-Meteo, a free open-source weather API." },
        { q: "Is this tool free?", a: "Yes, completely free with no API key required." },
      ]}
      howItWorks={[
        "Enter a city name or click the location button for auto-detection.",
        "View current conditions, 7-day forecast, and hourly breakdown.",
        "Toggle between Celsius and Fahrenheit.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Weather Forecast", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/weather-forecast/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Search */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <div className="flex gap-2">
            <input type="text" value={city} onChange={e => setCity(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { searchCity(city.trim()); jumpTo() } }}
              placeholder="Enter city name..."
              className="flex-1 bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-500/40 transition-all placeholder:text-slate-600" />
            <button onClick={() => { searchCity(city.trim()); jumpTo() }}
              className="px-5 py-3 rounded-xl text-sm font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 transition-all">
              🔎
            </button>
            <button onClick={geoLocate}
              className="px-4 py-3 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">
              📍
            </button>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={() => setUnit('celsius')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${unit === 'celsius' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' : 'bg-white/[0.06] text-slate-500 border border-white/[0.08]'}`}>
              °C
            </button>
            <button onClick={() => setUnit('fahrenheit')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${unit === 'fahrenheit' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' : 'bg-white/[0.06] text-slate-500 border border-white/[0.08]'}`}>
              °F
            </button>
          </div>
        </div>

        {/* Recent */}
        {recent.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {recent.map((c, i) => (
              <button key={i} onClick={() => { setCity(c); searchCity(c); jumpTo() }}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">
                {c}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="w-6 h-6 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-400">Fetching weather...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-sm text-red-400 text-center">{error}</div>
        )}

        {/* Current Weather */}
        {weather && (
          <div ref={resultRef} className="space-y-4">
            <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-6">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h2 className="text-lg font-bold text-white">{weather._name}</h2>
                  <p className="text-xs text-slate-400">{wmoDesc(weather.current.weather_code)}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-extrabold text-white">{conv(weather.current.temperature_2m)}{unitLabel}</div>
                  <div className="text-xs text-slate-400">Feels {conv(weather.current.apparent_temperature)}{unitLabel}</div>
                </div>
              </div>
              <div className="flex gap-4 text-sm text-slate-400">
                <span>💧 {weather.current.relative_humidity_2m}%</span>
                <span>💨 {weather.current.wind_speed_10m} km/h</span>
                <span>{wmoIcon(weather.current.weather_code)}</span>
              </div>
            </div>

            {/* Hourly */}
            <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
              <div className="text-xs font-bold text-slate-400 mb-3">⏰ Hourly Forecast</div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {weather.hourly.temperature_2m.slice(0, 24).map((t, i) => {
                  const h = (new Date().getHours() + i) % 24
                  return (
                    <div key={i} className="flex-shrink-0 text-center p-2 rounded-xl bg-black/20 min-w-[60px]">
                      <div className="text-xs text-slate-500">{String(h).padStart(2, '0')}:00</div>
                      <div className="text-lg my-1">{wmoIcon(weather.hourly.weather_code[i])}</div>
                      <div className="text-xs text-white font-semibold">{conv(t)}{unitLabel}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 7-Day */}
            <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
              <div className="text-xs font-bold text-slate-400 mb-3">📅 7-Day Forecast</div>
              <div className="space-y-2">
                {weather.daily.time.map((day, i) => {
                  const d = new Date(day + 'T00:00:00')
                  return (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                      <div className="flex-1">
                        <div className="text-sm text-white font-semibold">{i === 0 ? 'Today' : DNAMES[d.getDay()]}</div>
                        <div className="text-xs text-slate-500">{d.toLocaleDateString('en', { month: 'short', day: 'numeric' })}</div>
                      </div>
                      <div className="text-2xl mx-3">{wmoIcon(weather.daily.weather_code[i])}</div>
                      <div className="text-right">
                        <span className="text-sm text-white font-semibold">{conv(weather.daily.temperature_2m_max[i])}</span>
                        <span className="text-sm text-slate-500 ml-1">{conv(weather.daily.temperature_2m_min[i])}</span>
                      </div>
                      <div className="text-xs text-slate-500 ml-3">💧{weather.daily.precipitation_sum[i]}mm</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {!weather && !loading && !error && (
          <div className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🌤️</div>
            <p className="text-sm text-slate-600 font-medium">Enter a city name to check the weather</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
