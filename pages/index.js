"use client"

import { useState, useRef } from "react"
import dynamic from "next/dynamic"
import { SearchInterface } from "../components/search/search-interface"
import { LocationCards } from "../components/cards/localtion-cards"
import { useMapState } from "../hooks/use-map-state"
import { useLocationFilter } from "../hooks/useLocationFilter"
import { useLocationData } from "../hooks/useLocationData"
import { defaultTileLayerKey } from "../lib/title-layer"
import { MobileLocationCard } from "../components/mobile/mobile-location-card"
import { MobileBottomSheet } from "../components/mobile/mobile-bottom-sheet"
import { MobileHeader } from "../components/mobile/mobile-header"
import Header from "../components/layout/Header"   // ✅ header desktop
import CookieConsent from "../components/ui/CookieConsent"   // ✅ cookie consent
import { useScreenSize } from "react-screen-size-helper"

// Dynamic import for InteractiveMap to prevent SSR issues
const InteractiveMap = dynamic(
  () => import("../components/map/interactive-map"),
  { ssr: false }
)


export default function GoogleMapsLayout() {
  const { selectedLocation, setSelectedLocation } = useMapState()
  
  // Use the new location data hook for API fetching
  const {
    locations: apiLocations,
    loading: locationsLoading,
    error: locationsError,
    searchFallback,
    searchError,
    pagination,
    fetchLocations,
    search: searchLocations,
    filterByType,
    filterByYear,
    refresh: refreshLocations
  } = useLocationData({ limit: 50 }) // Fetch more locations initially
  
  // Use the location filter hook with API data
  const {
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
    filteredLocations,
    filterOptions,
    filterStats,
    clearFilters
  } = useLocationFilter(apiLocations)

  const [showLocationCard, setShowLocationCard] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [showMapControls, setShowMapControls] = useState(true)
  const [selectedBaseLayer, setSelectedBaseLayer] = useState(defaultTileLayerKey)
  const [selectedOverlays, setSelectedOverlays] = useState([])
  const mapRef = useRef(null)

  const {
    isLargeDesktop,
    isDesktop,
    isTablet,
    isMobile,
  } = useScreenSize({})

  const handleLocationSelect = (location) => {
    setSelectedLocation(location)
    setShowLocationCard(true)
  }

  const [mapInstance, setMapInstance] = useState(null)

  const handleMapReady = (map) => {
    console.log('Map ready callback:', map)
    setMapInstance(map)
  }

  const moveToLocation = (location) => {
    console.log('moveToLocation called with:', location)
    console.log('mapInstance:', mapInstance)
    
    if (mapInstance) {
      console.log('Map instance:', mapInstance)
      console.log('Location coordinates:', location.coordinates)
      
      const zoomLevel = 18
      console.log('Using zoom level:', zoomLevel)
      
      // ใช้ setView ซึ่งเป็น Leaflet API ที่ถูกต้อง
      mapInstance.setView(location.coordinates, zoomLevel)
      console.log('setView executed')
    } else {
      console.log('mapInstance is null - map not ready')
    }
  }

  // Handle search changes
  const handleSearchChange = (query) => {
    setSearchQuery(query)
    if (query.trim()) {
      // Try API search first
      searchLocations(query).catch((error) => {
        console.log('🔍 API search failed, using client-side filtering')
        // The useLocationFilter hook will handle client-side filtering
        // when API search fails, so we don't need to do anything here
      })
    } else {
      refreshLocations()
    }
  }

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    switch (filterType) {
      case 'type':
        setFilterLocationType(value)
        if (value !== "All types") {
          filterByType(value)
        } else {
          refreshLocations()
        }
        break
      case 'year':
        setFilterYear(value)
        if (value !== "All years") {
          filterByYear(parseInt(value))
        } else {
          refreshLocations()
        }
        break
      default:
        break
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* ✅ Header Responsive */}
      {isMobile && (
        <MobileHeader
          onFilterClick={() => setShowFilter(!showFilter)}
          onCloseMap={() => console.log("Close map clicked")}
          showMapControls={showMapControls}
        />
      )}

      {(isTablet || isDesktop || isLargeDesktop) && (
        <Header />
      )}

      {/* Debug (optional) */}
      {/* <div className="p-2 text-xs text-gray-500">
        Width: {currentWidth} | 
        {isMobile && " Mobile"} 
        {isTablet && " Tablet"} 
        {isDesktop && " Desktop"} 
        {isLargeDesktop && " Large Desktop"}
      </div> */}

      {/* Search (desktop/tablet only) */}
      <div className="hidden md:block">
        <SearchInterface
          searchQuery={searchQuery}
          setSearchQuery={handleSearchChange}
          filterType={filterType}
          setFilterType={setFilterType}
          filterLocationType={filterLocationType}
          setFilterLocationType={(value) => handleFilterChange('type', value)}
          filterYear={filterYear}
          setFilterYear={(value) => handleFilterChange('year', value)}
          sortBy={sortBy}
          setSortBy={setSortBy}
          maxDistance={maxDistance}
          setMaxDistance={setMaxDistance}
          filterOptions={filterOptions}
          filterStats={filterStats}
          clearFilters={clearFilters}
          loading={locationsLoading}
          error={locationsError}
          searchFallback={searchFallback}
          searchError={searchError}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="hidden md:block w-96 flex-shrink-0 bg-white border-r border-border overflow-y-auto">
          <LocationCards
            locations={filteredLocations}
            selectedLocation={selectedLocation}
            onLocationSelect={handleLocationSelect}
            onMoveToLocation={moveToLocation}
            loading={locationsLoading}
            error={locationsError}
          />
        </div>

        <div className="flex-1 relative mt-20 md:mt-0">

          {/* Conditional Map Rendering */}
            <InteractiveMap
              locations={filteredLocations}
              selectedLocation={selectedLocation}
              onLocationSelect={handleLocationSelect}
              mapRef={mapRef}
              selectedBaseLayer={selectedBaseLayer}
              selectedOverlays={selectedOverlays}
              setSelectedBaseLayer={setSelectedBaseLayer}
              setSelectedOverlays={setSelectedOverlays}
              onMapReady={handleMapReady}
            />
          
        </div>
      </div>

      {/* Mobile card + sheet */}
      {showLocationCard && selectedLocation && (
        <MobileLocationCard
          location={selectedLocation}
          onClose={() => setShowLocationCard(false)}
        />
      )}
      <MobileBottomSheet location={selectedLocation} />
      
      {/* Cookie Consent Banner */}
      <CookieConsent />
    </div>
  )
}
