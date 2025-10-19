"use client"

import { Phone, Clock, ArrowRight, MapPin, Star, Users, Calendar, Navigation, Download, Loader2, AlertCircle } from "lucide-react"

export function LocationCards({ locations, selectedLocation, onLocationSelect, onMoveToLocation, loading, error }) {
  // Loading state
  if (loading && locations.length === 0) {
    return (
      <div className="p-4 flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
          <p className="text-gray-600">กำลังโหลดข้อมูลสถานที่...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error && locations.length === 0) {
    return (
      <div className="p-4 flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <p className="text-red-600 font-medium">เกิดข้อผิดพลาด</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  // Empty state
  if (!loading && locations.length === 0) {
    return (
      <div className="p-4 flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3 text-center">
          <MapPin className="w-8 h-8 text-gray-400" />
          <p className="text-gray-600">ไม่พบข้อมูลสถานที่</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      {/* Loading overlay for additional data */}
      {loading && locations.length > 0 && (
        <div className="flex items-center justify-center py-2">
          <Loader2 className="w-4 h-4 animate-spin text-pink-500 mr-2" />
          <span className="text-sm text-gray-600">กำลังโหลดข้อมูลเพิ่มเติม...</span>
        </div>
      )}
      
      {locations.map((location) => (
        <div
          key={location.id}
          className={`bg-white border rounded-lg shadow-sm cursor-pointer transition-all hover:shadow-md ${
            selectedLocation?.id === location.id ? "ring-2 ring-pink-500 border-pink-500" : "border-gray-200"
          }`}
          onClick={() => onLocationSelect(location)}
        >
          {/* Image */}
          <div className="relative">
            <img 
              className="w-full h-48 object-cover rounded-t-lg" 
              src={location.image} 
              alt={location.name} 
            />
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{location.rating}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Header */}
            <div className="mb-3">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{location.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{location.address}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 text-sm mb-3 line-clamp-2">{location.description}</p>

            {/* Type, Year and Distance */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                  {location.type}
                </span>
                {location.year && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                    <Calendar className="w-3 h-3" />
                    {location.year}
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-600 font-medium">{location.distance}</span>
            </div>

            {/* Programs */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Programs:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {location.programs.map((program, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {program}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact and Hours */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{location.phone}</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 mt-0.5" />
                <span className="whitespace-pre-line">{location.openingHours}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button 
                className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-pink-700 border border-pink-200 rounded-lg hover:bg-pink-50 hover:border-pink-300 focus:ring-4 focus:outline-none focus:ring-pink-200 transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation(); // ป้องกันการ trigger onClick ของ card
                  console.log('Button clicked for location:', location);
                  console.log('onMoveToLocation function:', onMoveToLocation);
                  
                  // ไปที่หมุด - fly ไปยังตำแหน่งในแผนที่
                  if (onMoveToLocation) {
                    console.log('Calling onMoveToLocation...');
                    onMoveToLocation(location);
                  } else {
                    console.log('onMoveToLocation is not defined');
                  }
                }}
              >
                <Navigation className="w-4 h-4 mr-1" />
                ไปที่หมุด
              </button>
              <button 
                className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-pink-700 border border-pink-200 rounded-lg hover:bg-pink-50 hover:border-pink-300 focus:ring-4 focus:outline-none focus:ring-pink-200 transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation(); // ป้องกันการ trigger onClick ของ card
                  // โหลดเอกสาร
                  if (location.documentUrl) {
                    window.open(location.documentUrl, '_blank');
                  } else {
                    alert('ไม่มีเอกสารสำหรับสถานที่นี้');
                  }
                }}
              >
                <Download className="w-4 h-4 mr-1" />
                โหลดเอกสาร
              </button>
            </div>
            
          </div>
        </div>
      ))}
    </div>
  )
}
