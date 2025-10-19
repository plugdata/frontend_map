"use client"

import { useState, useEffect } from "react"
import { Search, X, Eye, ChevronDown, Filter, SlidersHorizontal, Loader2, AlertCircle } from "lucide-react"

export function SearchInterface({ 
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
  filterOptions,
  filterStats,
  clearFilters,
  loading,
  error,
  searchFallback,
  searchError
}) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  
  // Check if we're on the client side to avoid SSR issues
  const isClient = typeof window !== "undefined"
  
  // Use a state to track the display text to avoid hydration mismatch
  const [displayText, setDisplayText] = useState("Apprenticeship & Traineeship Services")
  
  // Update display text after component mounts to avoid hydration mismatch
  useEffect(() => {
    if (isClient && window.innerWidth < 768) {
      setDisplayText("A&T Services")
    }
  }, [isClient])

  return (
    <div className="bg-white border-b border-border">
      {/* Main Search Bar */}
      <div className="p-2 md:p-4">
        <div className="flex items-center gap-2 md:gap-4 max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 md:pl-10 pr-8 md:pr-10 py-2 text-sm md:text-base border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="ค้นหาสถานที่..."
              />
              {loading ? (
                <div className="absolute right-2 md:right-3 p-1">
                  <Loader2 className="h-3 w-3 md:h-4 md:w-4 text-pink-500 animate-spin" />
                </div>
              ) : searchQuery ? (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 md:right-3 p-1 hover:bg-muted rounded-full"
                >
                  <X className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                </button>
              ) : null}
            </div>
          </div>

          {/* View Toggle - Hidden on mobile */}
          <button className="hidden md:block p-2 hover:bg-muted rounded-lg">
            <Eye className="h-5 w-5 text-muted-foreground" />
          </button>

          {/* Program Filter */}
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="appearance-none bg-white border border-border rounded-lg px-2 md:px-4 py-2 pr-6 md:pr-8 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent cursor-pointer"
            >
              {filterOptions?.programs?.map((option) => (
                <option key={option} value={option}>
                  {option === "Apprenticeship & Traineeship Services" ? displayText : option}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-1 md:right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 md:h-4 md:w-4 text-muted-foreground pointer-events-none" />
          </div>

          {/* Advanced Filters Toggle */}
          <button 
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
              filterStats?.hasActiveFilters 
                ? "bg-pink-100 text-pink-700 hover:bg-pink-200" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">กรองข้อมูล</span>
          </button>
        </div>

        {/* Filter Stats */}
        {filterStats && (
          <div className="mt-2 text-sm text-gray-600 max-w-7xl mx-auto">
            แสดง {filterStats.filtered} จาก {filterStats.total} สถานที่
            {filterStats.hasActiveFilters && (
              <button 
                onClick={clearFilters}
                className="ml-2 text-pink-600 hover:text-pink-700 underline"
              >
                ล้างตัวกรอง
              </button>
            )}
          </div>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="border-t border-border bg-gray-50 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Location Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ประเภทเอกสาร
                </label>
                <select
                  value={filterLocationType}
                  onChange={(e) => setFilterLocationType(e.target.value)}
                  className="w-full bg-white border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  {filterOptions?.types?.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Year Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ปีงบประมาณ
                </label>
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="w-full bg-white border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  {filterOptions?.years?.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  เรียงตาม
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-white border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  {filterOptions?.sortOptions?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Max Distance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ระยะทางสูงสุด: {maxDistance} กม.
                </label>
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="10"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10 กม.</span>
                  <span>500 กม.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error indicator */}
      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {/* Search fallback warning */}
      {searchFallback && searchQuery && !loading && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span className="text-xs text-yellow-700">
              กำลังค้นหาในข้อมูลที่มีอยู่ (การค้นหาแบบ API ไม่พร้อมใช้งาน)
            </span>
          </div>
          {searchError && (
            <div className="mt-1 text-xs text-yellow-600">
              {searchError}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
