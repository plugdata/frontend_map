"use client"

import { useState, useEffect, useCallback } from 'react'
import { apiService } from '../utils/apiService'

export const useLocationData = (initialParams = {}) => {
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchFallback, setSearchFallback] = useState(false)
  const [searchError, setSearchError] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  // Fetch locations with parameters
  const fetchLocations = useCallback(async (params = {}) => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('🔄 Fetching locations with params:', params)
      
      const result = await apiService.getLocations({
        page: pagination.page,
        limit: pagination.limit,
        ...params
      })
      
      console.log('✅ Locations fetched successfully:', result)
      
      setLocations(result.locations)
      setPagination(result.pagination)
      setSearchFallback(result.searchFallback || false)
      setSearchError(result.searchError || null)
      
    } catch (err) {
      console.error('❌ Error fetching locations:', err)
      setError(err.message || 'Failed to fetch locations')
      setLocations([])
      setSearchFallback(false)
      setSearchError(null)
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit])

  // Load more locations (pagination)
  const loadMore = useCallback(async (params = {}) => {
    if (loading || pagination.page >= pagination.totalPages) return
    
    setLoading(true)
    setError(null)
    
    try {
      const nextPage = pagination.page + 1
      console.log('🔄 Loading more locations, page:', nextPage)
      
      const result = await apiService.getLocations({
        page: nextPage,
        limit: pagination.limit,
        ...params
      })
      
      console.log('✅ More locations loaded:', result)
      
      setLocations(prev => [...prev, ...result.locations])
      setPagination(result.pagination)
      
    } catch (err) {
      console.error('❌ Error loading more locations:', err)
      setError(err.message || 'Failed to load more locations')
    } finally {
      setLoading(false)
    }
  }, [loading, pagination.page, pagination.limit, pagination.totalPages])

  // Refresh locations
  const refresh = useCallback(async (params = {}) => {
    setPagination(prev => ({ ...prev, page: 1 }))
    await fetchLocations(params)
  }, [fetchLocations])

  // Search locations
  const search = useCallback(async (searchQuery, params = {}) => {
    try {
      await fetchLocations({
        search: searchQuery,
        ...params
      })
    } catch (error) {
      console.log('🔍 Search failed, falling back to client-side search')
      // If API search fails, we'll handle it in the component level
      // by filtering the existing data
    }
  }, [fetchLocations])

  // Filter by type
  const filterByType = useCallback(async (type, params = {}) => {
    await fetchLocations({
      type: type,
      ...params
    })
  }, [fetchLocations])

  // Filter by year
  const filterByYear = useCallback(async (year, params = {}) => {
    await fetchLocations({
      year: year,
      ...params
    })
  }, [fetchLocations])

  // Initial load
  useEffect(() => {
    fetchLocations(initialParams)
  }, []) // Only run on mount

  return {
    locations,
    loading,
    error,
    searchFallback,
    searchError,
    pagination,
    fetchLocations,
    loadMore,
    refresh,
    search,
    filterByType,
    filterByYear,
    hasMore: pagination.page < pagination.totalPages
  }
}
