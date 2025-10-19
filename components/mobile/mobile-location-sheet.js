"use client"

import { useState } from "react"
import { ChevronUp, ChevronDown, MapPin, Clock, Phone } from "lucide-react"

export function MobileLocationSheet({ locations, selectedLocation, onLocationSelect }) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!locations?.length) return null

  return (
    <div className="md:hidden fixed bottom-20 left-0 right-0 z-30">
      {/* Sheet Handle */}
      <div className="bg-white border-t border-gray-200 rounded-t-xl shadow-lg">
        <button onClick={() => setIsExpanded(!isExpanded)} className="w-full p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="font-medium">
              {selectedLocation ? selectedLocation.name : `${locations.length} locations found`}
            </span>
          </div>
          {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
        </button>

        {/* Expanded Content */}
{/*         {isExpanded && (
          <div className="max-h-64 overflow-y-auto border-t border-gray-100">
            {locations.map((location) => (
              <button
                key={location.id}
                onClick={() => {
                  onLocationSelect(location)
                  setIsExpanded(false)
                }}
                className={`w-full p-4 text-left border-b border-gray-100 hover:bg-gray-50 ${
                  selectedLocation?.id === location.id ? "bg-blue-50" : ""
                }`}
              >
                <h3 className="font-medium mb-1">{location.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{location.address}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Mon-Fri 8:30am-5:00pm</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    <span>{location.phone}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )} */}
      </div>
    </div>
  )
}
