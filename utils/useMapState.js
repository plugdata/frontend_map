"use client"
import { useState } from "react"

export function useMapState() {
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [searchQuery, setSearchQuery] = useState("Burleigh Waters QLD 4220, Australia")
  const [filterType, setFilterType] = useState("All programs")

  return {
    selectedLocation,
    setSelectedLocation,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
  }
}
