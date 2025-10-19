"use client"

import { MapPin, Star, X } from "lucide-react"

export function MobileLocationCard({ location, onClose }) {
  if (!location) return null

  return (
/*     <div className="md:hidden fixed top-32 left-4 right-4 bg-white rounded-lg shadow-lg z-40 overflow-hidden">
      {location.image && (
        <div className="h-32 bg-gray-200 relative">
          <img src={location.image || "/placeholder.svg"} alt={location.name} className="w-full h-full object-cover" />
          <button onClick={onClose} className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-purple-600" />
            <h3 className="font-semibold text-lg">{location.name}</h3>
          </div>
          {location.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{location.rating}</span>
            </div>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-3">{location.address}</p>

        {location.description && <p className="text-gray-700 text-sm">{location.description}</p>}
      </div>
    </div> */
    <></>
  )
}
