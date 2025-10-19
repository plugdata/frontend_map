'use client'
import { useState, useEffect } from 'react'
import Logo from '../ui/logo'
import { visitorTracker } from '../../utils/visitorTracking'
import { weatherService } from '../../utils/weatherService'
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [visitorStats, setVisitorStats] = useState({ weekVisits: '0', totalVisits: '0' })
  const [weatherInfo, setWeatherInfo] = useState({ 
    temperature: 32, 
    temperatureMax: 35,
    temperatureMin: 28,
    icon: '☀️', 
    description: 'ท้องฟ้าแจ่มใส',
    humidity: 65,
    windSpeed: 3.2,
    rain: 0,
    location: {
      province: 'ตรัง',
      amphoe: 'เมืองตรัง',
      tambon: 'ทับเที่ยง'
    }
  })

  // Load visitor stats and weather on component mount
  useEffect(() => {
    // Load visitor stats
    const stats = visitorTracker.getVisitorStats()
    setVisitorStats(stats)

    // Track visitor if consent is given
    if (visitorTracker.hasConsent()) {
      const newStats = visitorTracker.trackVisitor()
      if (newStats) {
        setVisitorStats({
          weekVisits: newStats.weekVisits.toLocaleString('th-TH'),
          totalVisits: newStats.totalVisits.toLocaleString('th-TH')
        })
      }
    }

    // Load weather data
    const loadWeather = async () => {
      try {
        const weather = await weatherService.getWeatherInfo()
        setWeatherInfo(weather)
      } catch (error) {
        console.error('Error loading weather:', error)
      }
    }

    loadWeather()
  }, [])

  return (
    <>
      {/* Main Navigation */}
      <nav className="bg-gradient-to-r from-pink-300 via-pink-200 to-pink-300 sticky top-0 z-50 text-pink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-16 h-16  rounded-lg flex items-center justify-center">
                  <div className="w-12 h-12">
                    <Logo />
                  </div>
                </div>
                  <div className="flex flex-col -space-y-1">
                    <h2 className="font-bold text-2xl text-blue-800 leading-none">กองช่าง</h2>
                    <p className="text-lg text-blue-600  font-semibold leading-none">เทศบาลนครตรัง</p>
                  </div>
                </div>
              </div>

            {/* Desktop Nav with Enhanced Hover Effects */}
            <div className="hidden lg:flex items-center gap-4">
              <a href="#map" className="relative px-6 py-3 rounded-lg font-medium transition-all duration-300 text-pink-800 hover:text-pink-900 hover:bg-pink-300/50 text-lg group">
                <span className="relative z-10">🗺️ แผนที่</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-700 transition-all duration-300 group-hover:w-full"></div>
              </a>
              <a href="#services" className="relative px-6 py-3 rounded-lg font-medium transition-all duration-300 text-pink-800 hover:text-pink-900 hover:bg-pink-300/50 text-lg group">
                <span className="relative z-10">🏛️ บริการประชาชน</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-700 transition-all duration-300 group-hover:w-full"></div>
              </a>
              <a href="#news" className="relative px-6 py-3 rounded-lg font-medium transition-all duration-300 text-pink-800 hover:text-pink-900 hover:bg-pink-300/50 text-lg group">
                <span className="relative z-10">📰 ข่าวสาร</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-700 transition-all duration-300 group-hover:w-full"></div>
              </a>
            </div>

            {/* Stats and Weather Section */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Visitor Stats */}
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-xs text-pink-600 font-medium">ผู้เข้าชมสัปดาห์</div>
                  <div className="text-lg font-bold text-pink-800">{visitorStats.weekVisits}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-pink-600 font-medium">ผู้เข้าชมทั้งหมด</div>
                  <div className="text-lg font-bold text-pink-800">{visitorStats.totalVisits}</div>
                </div>
              </div>

              {/* Weather */}
              <div className="flex items-center gap-2 bg-white/80 rounded-lg px-3 py-2">
                <div className="text-2xl">{weatherInfo.icon}</div>
                <div className="text-sm">
                  <div className="font-semibold text-pink-800">{weatherInfo.temperature}°C</div>
                  <div className="text-xs text-pink-600">
                    {weatherInfo.temperatureMax}°/{weatherInfo.temperatureMin}° {weatherInfo.location?.tambon || 'ตรัง'}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Hamburger */}
            <div className="lg:hidden">
              <button
                className="text-pink-800 hover:text-pink-900 focus:outline-none transition-colors duration-200"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown with Soft Design */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-gradient-to-b from-pink-100 to-white">
            <div className="px-4 py-4 space-y-3">
              {/* Map Mobile Menu */}
              <div className="relative">
                <a href="#map" className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl font-medium text-pink-800 text-lg shadow-sm border border-pink-300 hover:bg-pink-100 transition-colors duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  แผนที่
                </a>
              </div>

              {/* Services Mobile Menu */}
              <div className="relative">
                <a href="#services" className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl font-medium text-pink-800 text-lg shadow-sm border border-pink-300 hover:bg-pink-100 transition-colors duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  บริการประชาชน
                </a>
              </div>

              {/* News Mobile Menu */}
              <div className="relative">
                <a href="#news" className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl font-medium text-pink-800 text-lg shadow-sm border border-pink-300 hover:bg-pink-100 transition-colors duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
                  </svg>
                  ข่าวสาร
                </a>
              </div>

              {/* Mobile Stats and Weather */}
              <div className="pt-3 border-t border-pink-200">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-pink-200">
                    <div className="text-xs text-pink-600 font-medium">ผู้เข้าชมสัปดาห์</div>
                    <div className="text-lg font-bold text-pink-800">{visitorStats.weekVisits}</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-pink-200">
                    <div className="text-xs text-pink-600 font-medium">ผู้เข้าชมทั้งหมด</div>
                    <div className="text-lg font-bold text-pink-800">{visitorStats.totalVisits}</div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 bg-white rounded-lg px-4 py-3 shadow-sm border border-pink-200">
                  <div className="text-2xl">{weatherInfo.icon}</div>
                  <div className="text-sm">
                    <div className="font-semibold text-pink-800">{weatherInfo.temperature}°C</div>
                    <div className="text-xs text-pink-600">
                      {weatherInfo.temperatureMax}°/{weatherInfo.temperatureMin}° {weatherInfo.location?.tambon || 'ตรัง'}
                    </div>
                    {weatherInfo.rain > 0 && (
                      <div className="text-xs text-blue-600">ฝน {weatherInfo.rain}mm</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      
    </>
  )
}
