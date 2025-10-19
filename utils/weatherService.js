// Weather Service using TMD (Thai Meteorological Department) API
export class WeatherService {
  constructor() {
    // Using TMD API - กรมอุตุนิยมวิทยาไทย
    this.apiKey = process.env.NEXT_PUBLIC_TMD_API_KEY || 'demo_key'
    this.baseUrl = 'https://data.tmd.go.th/nwpapi/v1'
    this.location = {
      province: 'ตรัง',
      amphoe: 'เมืองตรัง',
      tambon: 'ทับเที่ยง'
    }
    this.cacheKey = 'trang_weather_cache'
    this.cacheExpiry = 30 * 60 * 1000 // 30 minutes (TMD updates every 30 min)
  }

  // Get cached weather data
  getCachedWeather() {
    if (typeof window === 'undefined') return null
    
    try {
      const cached = localStorage.getItem(this.cacheKey)
      if (!cached) return null
      
      const data = JSON.parse(cached)
      const now = new Date().getTime()
      
      if (now - data.timestamp < this.cacheExpiry) {
        return data.weather
      }
      
      // Cache expired
      localStorage.removeItem(this.cacheKey)
      return null
    } catch (error) {
      console.error('Error reading weather cache:', error)
      return null
    }
  }

  // Cache weather data
  cacheWeather(weatherData) {
    if (typeof window === 'undefined') return
    
    try {
      const cacheData = {
        weather: weatherData,
        timestamp: new Date().getTime()
      }
      localStorage.setItem(this.cacheKey, JSON.stringify(cacheData))
    } catch (error) {
      console.error('Error caching weather data:', error)
    }
  }

  // Get weather icon based on TMD weather condition
  getWeatherIcon(condition, cloudCover, rain) {
    // TMD condition codes mapping
    const conditionMap = {
      'clear': '☀️',
      'partly_cloudy': '⛅',
      'cloudy': '☁️',
      'overcast': '☁️',
      'rain': '🌧️',
      'heavy_rain': '🌧️',
      'light_rain': '🌦️',
      'thunderstorm': '⛈️',
      'fog': '🌫️',
      'mist': '🌫️'
    }
    
    // Check for rain first
    if (rain > 0) {
      if (rain > 10) return '🌧️' // Heavy rain
      return '🌦️' // Light rain
    }
    
    // Use TMD condition if available
    if (condition && conditionMap[condition]) {
      return conditionMap[condition]
    }
    
    // Fallback to cloud cover
    if (cloudCover > 80) return '☁️' // Overcast
    if (cloudCover > 50) return '⛅' // Partly cloudy
    if (cloudCover > 20) return '🌤️' // Few clouds
    
    return '☀️' // Clear sky
  }

  // Get weather description in Thai
  getWeatherDescription(condition, cloudCover, rain) {
    // TMD condition descriptions
    const conditionDescriptions = {
      'clear': 'ท้องฟ้าแจ่มใส',
      'partly_cloudy': 'เมฆบางส่วน',
      'cloudy': 'เมฆมาก',
      'overcast': 'เมฆมาก',
      'rain': 'ฝนตก',
      'heavy_rain': 'ฝนตกหนัก',
      'light_rain': 'ฝนตกเล็กน้อย',
      'thunderstorm': 'ฝนฟ้าคะนอง',
      'fog': 'หมอก',
      'mist': 'หมอกบาง'
    }
    
    // Check for rain first
    if (rain > 0) {
      if (rain > 10) return 'ฝนตกหนัก'
      return 'ฝนตกเล็กน้อย'
    }
    
    // Use TMD condition if available
    if (condition && conditionDescriptions[condition]) {
      return conditionDescriptions[condition]
    }
    
    // Fallback to cloud cover
    if (cloudCover > 80) return 'เมฆมาก'
    if (cloudCover > 50) return 'เมฆบางส่วน'
    if (cloudCover > 20) return 'เมฆน้อย'
    
    return 'ท้องฟ้าแจ่มใส'
  }

  // Fetch weather data from TMD API
  async fetchWeatherData() {
    // Check cache first
    const cached = this.getCachedWeather()
    if (cached) {
      return cached
    }

    // If no API key, return mock data
    if (this.apiKey === 'demo_key') {
      const mockData = {
        temperature: 32,
        condition: 'clear sky',
        icon: '☀️',
        humidity: 65,
        windSpeed: 3.2,
        description: 'ท้องฟ้าแจ่มใส',
        cloudCover: 20,
        rain: 0
      }
      this.cacheWeather(mockData)
      return mockData
    }

    try {
      // TMD API endpoint for daily forecast by place (province/amphoe/tambon)
      const params = new URLSearchParams({
        province: this.location.province,
        amphoe: this.location.amphoe,
        tambon: this.location.tambon,
        fields: 'tc_max,tc_min,rh,rain,cloudlow,cloudmed,cloudhigh,ws10m,wd10m,cond',
        duration: '1',
        subarea: '0'
      })
      
      const url = `${this.baseUrl}/forecast/location/daily/place?${params.toString()}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'authorization': `Bearer ${this.apiKey}`
        }
      })
      
      if (!response.ok) {
        throw new Error(`TMD API error: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Parse TMD API response
      if (data.weather_forecast && data.weather_forecast.locations && data.weather_forecast.locations.length > 0) {
        const location = data.weather_forecast.locations[0]
        const forecast = location.forecasts[0]
        const forecastData = forecast.data
        
        // Calculate average temperature
        const avgTemp = Math.round((forecastData.tc_max + forecastData.tc_min) / 2)
        
        // Calculate total cloud cover
        const cloudCover = Math.round((forecastData.cloudlow + forecastData.cloudmed + forecastData.cloudhigh) / 3)
        
        // Get weather condition from TMD
        const condition = forecastData.cond || 'weather'
        
        const weatherData = {
          temperature: avgTemp,
          temperatureMax: Math.round(forecastData.tc_max),
          temperatureMin: Math.round(forecastData.tc_min),
          condition: condition,
          icon: this.getWeatherIcon(condition, cloudCover, forecastData.rain || 0),
          humidity: Math.round(forecastData.rh),
          windSpeed: Math.round(forecastData.ws10m * 1.94), // Convert m/s to knots
          windDirection: Math.round(forecastData.wd10m),
          description: this.getWeatherDescription(condition, cloudCover, forecastData.rain || 0),
          cloudCover: cloudCover,
          rain: forecastData.rain || 0,
          location: {
            province: location.location.province,
            amphoe: location.location.amphoe,
            tambon: location.location.tambon,
            lat: location.location.lat,
            lon: location.location.lon
          }
        }
        
        // Cache the data
        this.cacheWeather(weatherData)
        
        return weatherData
      } else {
        throw new Error('Invalid TMD API response format')
      }
    } catch (error) {
      console.error('Error fetching TMD weather data:', error)
      
      // Return fallback data
      const fallbackData = {
        temperature: 32,
        temperatureMax: 35,
        temperatureMin: 28,
        condition: 'clear sky',
        icon: '☀️',
        humidity: 65,
        windSpeed: 3.2,
        windDirection: 180,
        description: 'ไม่สามารถโหลดข้อมูลได้',
        cloudCover: 20,
        rain: 0
      }
      
      return fallbackData
    }
  }

  // Get formatted weather info
  async getWeatherInfo() {
    const weatherData = await this.fetchWeatherData()
    
    return {
      temperature: weatherData.temperature,
      temperatureMax: weatherData.temperatureMax,
      temperatureMin: weatherData.temperatureMin,
      icon: weatherData.icon,
      description: weatherData.description,
      humidity: weatherData.humidity,
      windSpeed: weatherData.windSpeed,
      windDirection: weatherData.windDirection,
      cloudCover: weatherData.cloudCover,
      rain: weatherData.rain,
      location: weatherData.location
    }
  }

  // Method to change location
  setLocation(province, amphoe = null, tambon = null) {
    this.location = {
      province: province,
      amphoe: amphoe,
      tambon: tambon
    }
    
    // Clear cache when location changes
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.cacheKey)
    }
  }
}

// Create singleton instance
export const weatherService = new WeatherService()
