// Visitor Tracking with Cookie Management
export class VisitorTracker {
  constructor() {
    this.cookieName = 'trang_visitor_data'
    this.consentCookieName = 'trang_cookie_consent'
    this.weekKey = 'week_visits'
    this.totalKey = 'total_visits'
    this.lastVisitKey = 'last_visit'
  }

  // Check if user has given consent
  hasConsent() {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(this.consentCookieName) === 'accepted'
  }

  // Set consent
  setConsent(accepted) {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.consentCookieName, accepted ? 'accepted' : 'declined')
  }

  // Get visitor data from localStorage
  getVisitorData() {
    if (typeof window === 'undefined') return { weekVisits: 0, totalVisits: 0 }
    
    try {
      const data = localStorage.getItem(this.cookieName)
      if (!data) return { weekVisits: 0, totalVisits: 0 }
      
      const parsed = JSON.parse(data)
      const now = new Date()
      const lastVisit = new Date(parsed[this.lastVisitKey] || 0)
      
      // Check if it's a new week
      const weekDiff = Math.floor((now - lastVisit) / (7 * 24 * 60 * 60 * 1000))
      
      return {
        weekVisits: weekDiff > 0 ? 1 : (parsed[this.weekKey] || 0) + 1,
        totalVisits: (parsed[this.totalKey] || 0) + 1,
        lastVisit: now.toISOString()
      }
    } catch (error) {
      console.error('Error reading visitor data:', error)
      return { weekVisits: 1, totalVisits: 1, lastVisit: new Date().toISOString() }
    }
  }

  // Save visitor data to localStorage
  saveVisitorData(data) {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(this.cookieName, JSON.stringify(data))
    } catch (error) {
      console.error('Error saving visitor data:', error)
    }
  }

  // Track visitor
  trackVisitor() {
    if (!this.hasConsent()) return null
    
    const data = this.getVisitorData()
    this.saveVisitorData(data)
    
    return {
      weekVisits: data.weekVisits,
      totalVisits: data.totalVisits
    }
  }

  // Get formatted visitor stats
  getVisitorStats() {
    if (!this.hasConsent()) return { weekVisits: '0', totalVisits: '0' }
    
    const data = this.getVisitorData()
    return {
      weekVisits: data.weekVisits.toLocaleString('th-TH'),
      totalVisits: data.totalVisits.toLocaleString('th-TH')
    }
  }

  // Reset visitor data (for testing)
  resetVisitorData() {
    if (typeof window === 'undefined') return
    localStorage.removeItem(this.cookieName)
    localStorage.removeItem(this.consentCookieName)
  }
}

// Create singleton instance
export const visitorTracker = new VisitorTracker()
