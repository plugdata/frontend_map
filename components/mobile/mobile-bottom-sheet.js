"use client"

import { useState } from "react"
import { ChevronUp, MapPin, Clock, Phone, Star } from "lucide-react"

export function MobileBottomSheet({ location }) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!location) return null

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30">
      {/* 🔹 หัว bottom sheet → พื้นขาว ขอบชมพูอ่อน */}
      <div className="bg-white text-pink-600 rounded-t-xl shadow-lg border-t-2 border-pink-300">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center shadow">
              <MapPin className="h-6 w-6 text-pink-500" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-800">{location.name}</h3>
              <p className="text-pink-400 text-sm">{location.type}</p>
            </div>
          </div>
          <ChevronUp className="h-5 w-5 text-pink-500" />
        </button>

        {isExpanded && (
          <div className="px-4 pb-4 border-t border-pink-200 bg-white text-gray-800 rounded-b-xl">
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-pink-500" />
                <span className="text-sm">{location.address}</span>
              </div>

              {location.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-pink-500" />
                  <span className="text-sm">{location.phone}</span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-pink-500" />
                <span className="text-sm">Mon-Fri 8:30am-5:00pm</span>
              </div>

              {location.rating && (
                <div className="flex items-center gap-3">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{location.rating} stars</span>
                </div>
              )}
            </div>

            <button className="w-full mt-4 bg-pink-500 text-white font-semibold py-3 rounded-lg shadow hover:bg-pink-600 transition">
              View event
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
