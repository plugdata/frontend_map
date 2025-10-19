"use client"

import { useState } from "react"

export function useMapState() {
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [searchQuery, setSearchQuery] = useState("Burleigh Waters QLD 4220, Australia")
  const [filterType, setFilterType] = useState("All programs")

  // เพิ่มฟังก์ชัน moveMarker เพื่อเลื่อนกล้องไปที่ marker ใหม่
  const moveMarker = (mapRef, coordinates, zoom = 14) => {
    if (mapRef?.current && mapRef.current.flyTo) {
      mapRef.current.flyTo(coordinates, zoom, {
        duration: 1.5,
        easeLinearity: 0.25
      })
    }
  }

  return {
    selectedLocation,
    setSelectedLocation,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    moveMarker, // ✅ เพิ่มฟังก์ชัน moveMarker ใน return
  }
}
