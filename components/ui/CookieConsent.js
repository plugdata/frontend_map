'use client'
import { useState, useEffect } from 'react'
import { visitorTracker } from '../../utils/visitorTracking'

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if consent is already given
    const hasConsent = visitorTracker.hasConsent()
    if (!hasConsent) {
      // Show consent banner after a short delay
      const timer = setTimeout(() => {
        setShowConsent(true)
        setIsVisible(true)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    visitorTracker.setConsent(true)
    visitorTracker.trackVisitor() // Track the visit
    setIsVisible(false)
    
    // Hide banner after animation
    setTimeout(() => {
      setShowConsent(false)
    }, 300)
  }

  const handleDecline = () => {
    visitorTracker.setConsent(false)
    setIsVisible(false)
    
    // Hide banner after animation
    setTimeout(() => {
      setShowConsent(false)
    }, 300)
  }

  if (!showConsent) return null

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
    }`}>
      <div className="bg-gradient-to-r from-pink-100 to-pink-200 border-t border-pink-300 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Content */}
            <div className="flex-1">
              <h3 className="font-semibold text-pink-800 text-lg mb-2">
                🍪 การใช้คุกกี้ (Cookies)
              </h3>
              <p className="text-pink-700 text-sm leading-relaxed">
                เว็บไซต์นี้ใช้คุกกี้เพื่อเก็บข้อมูลการเข้าชมและปรับปรุงประสบการณ์การใช้งาน 
                ข้อมูลจะถูกเก็บไว้ในเครื่องของคุณเท่านั้นและไม่ส่งไปยังเซิร์ฟเวอร์ภายนอก
              </p>
              <div className="mt-2 text-xs text-pink-600">
                <strong>ข้อมูลที่เก็บ:</strong> จำนวนผู้เข้าชม, วันที่เข้าชมล่าสุด
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDecline}
                className="px-4 py-2 text-sm font-medium text-pink-700 bg-white border border-pink-300 rounded-lg hover:bg-pink-50 transition-colors duration-200"
              >
                ปฏิเสธ
              </button>
              <button
                onClick={handleAccept}
                className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-200 shadow-sm"
              >
                ยอมรับ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
