"use client"

import { useState, useMemo } from "react"

export const useLocationFilter = (locations) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("All programs")
  const [filterLocationType, setFilterLocationType] = useState("All types")
  const [filterYear, setFilterYear] = useState("All years")
  const [sortBy, setSortBy] = useState("distance") // distance, rating, name, year
  const [maxDistance, setMaxDistance] = useState(500) // km

  // Get unique filter options from location data
  const filterOptions = useMemo(() => {
    const programs = new Set()
    const types = new Set()
    const years = new Set()
    
    locations.forEach(location => {
      location.programs.forEach(program => programs.add(program))
      types.add(location.type)
      if (location.year) {
        years.add(location.year)
      }
    })
    
    return {
      programs: ["All programs", ...Array.from(programs).sort()],
      types: ["All types", ...Array.from(types).sort()],
      years: ["All years", ...Array.from(years).sort((a, b) => b - a)], // Sort years descending
      sortOptions: [
        { value: "distance", label: "Distance" },
        { value: "rating", label: "Rating" },
        { value: "name", label: "Name" },
        { value: "year", label: "Year (Newest)" }
      ]
    }
  }, [locations])

  // Filter and sort locations
  const filteredLocations = useMemo(() => {
    let filtered = [...locations]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(location => 
        location.name.toLowerCase().includes(query) ||
        location.address.toLowerCase().includes(query) ||
        location.description.toLowerCase().includes(query) ||
        location.programs.some(program => program.toLowerCase().includes(query))
      )
    }

    // Program filter
    if (filterType !== "All programs") {
      filtered = filtered.filter(location => 
        location.programs.includes(filterType)
      )
    }

    // Type filter
    if (filterLocationType !== "All types") {
      filtered = filtered.filter(location => 
        location.type === filterLocationType
      )
    }

    // Year filter
    if (filterYear !== "All years") {
      filtered = filtered.filter(location => 
        location.year === parseInt(filterYear)
      )
    }

    // Distance filter
    filtered = filtered.filter(location => {
      const distance = parseFloat(location.distance.replace(" km", ""))
      return distance <= maxDistance
    })

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "distance":
          const distanceA = parseFloat(a.distance.replace(" km", ""))
          const distanceB = parseFloat(b.distance.replace(" km", ""))
          return distanceA - distanceB
        case "rating":
          return b.rating - a.rating
        case "name":
          return a.name.localeCompare(b.name)
        case "year":
          return (b.year || 0) - (a.year || 0) // Newest first
        default:
          return 0
      }
    })

    return filtered
  }, [locations, searchQuery, filterType, filterLocationType, filterYear, sortBy, maxDistance])

  // Get filter statistics
  const filterStats = useMemo(() => {
    return {
      total: locations.length,
      filtered: filteredLocations.length,
      hasActiveFilters: searchQuery.trim() || filterType !== "All programs" || filterLocationType !== "All types" || filterYear !== "All years" || maxDistance < 500
    }
  }, [locations.length, filteredLocations.length, searchQuery, filterType, filterLocationType, filterYear, maxDistance])

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setFilterType("All programs")
    setFilterLocationType("All types")
    setFilterYear("All years")
    setSortBy("distance")
    setMaxDistance(500)
  }

  return {
    // State
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    filterLocationType,
    setFilterLocationType,
    filterYear,
    setFilterYear,
    sortBy,
    setSortBy,
    maxDistance,
    setMaxDistance,
    
    // Computed values
    filteredLocations,
    filterOptions,
    filterStats,
    
    // Actions
    clearFilters
  }
}
