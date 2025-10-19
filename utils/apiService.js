import axios from 'axios'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: '', // Use relative URL for client-side to route through Next.js API
  timeout: 15000, // Increased timeout
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.params)
    return config
  },
  (error) => {
    console.error('❌ API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`)
    console.log('📊 Response data structure:', {
      hasData: !!response.data,
      hasRecords: !!response.data?.records,
      recordsCount: response.data?.records?.length || 0,
      hasMeta: !!response.data?.meta
    })
    return response
  },
  (error) => {
    console.error('❌ API Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url
    })
    return Promise.reject(error)
  }
)

// Shared query parameters
const sharedQueryParams = {
  // สามารถเพิ่ม shared parameters ได้ที่นี่
  // เช่น authentication token, common filters, etc.
}

// API Service Class
class ApiService {
  // Get Map Points - AdminJS List API
  async getMapPoints(params = {}) {
    try {
      console.log('🗺️ Fetching map points with params:', params)
      
      const response = await apiClient.get('/api/test-proxy', {
        params: { 
          resource: 'Map',
          ...sharedQueryParams, 
          ...params,
          // AdminJS specific parameters
          direction: params.direction || 'desc',
          sortBy: params.sortBy || 'id', // Changed from '_id' to 'id'
          page: params.page || 1,
          perPage: params.perPage || 500
        }
      })
      
      console.log('🗺️ Map points response:', response.data)
      
      // AdminJS returns { meta, records } structure
      const records = response.data?.records || []
      console.log(`🗺️ Processing ${records.length} map points`)
      
      return this.processMapPoints(records)
    } catch (error) {
      console.error('❌ Error fetching map points:', error)
      return []
    }
  }

  // Get Building Control Data - AdminJS List API
  async getBuildingControl(params = {}) {
    try {
      console.log('🏗️ Fetching building control with params:', params)
      
      const response = await apiClient.get('/api/test-proxy', {
        params: { 
          resource: 'BuildingControl',
          ...sharedQueryParams, 
          ...params,
          direction: params.direction || 'desc',
          sortBy: params.sortBy || 'id', // Changed from '_id' to 'id'
          page: params.page || 1,
          perPage: params.perPage || 500
        }
      })
      
      console.log('🏗️ Building control response:', response.data)
      
      const records = response.data?.records || []
      console.log(`🏗️ Processing ${records.length} building control records`)
      
      return this.processBuildingControl(records)
    } catch (error) {
      console.error('❌ Error fetching building control:', error)
      return []
    }
  }

  // Get Risk Zone Data - AdminJS List API
  async getRiskZone(params = {}) {
    try {
      console.log('🚧 Fetching risk zone with params:', params)
      
      const response = await apiClient.get('/api/test-proxy', {
        params: { 
          resource: 'RiskZone',
          ...sharedQueryParams, 
          ...params,
          direction: params.direction || 'desc',
          sortBy: params.sortBy || 'id', // Changed from '_id' to 'id'
          page: params.page || 1,
          perPage: params.perPage || 500
        }
      })
      
      console.log('🚧 Risk zone response:', response.data)
      
      const records = response.data?.records || []
      console.log(`🚧 Processing ${records.length} risk zone records`)
      
      return this.processRiskZone(records)
    } catch (error) {
      console.error('❌ Error fetching risk zone:', error)
      return []
    }
  }

  // Get Zoning Plan Data - AdminJS List API
  async getZoningPlan(params = {}) {
    try {
      console.log('🏛️ Fetching zoning plan with params:', params)
      
      const response = await apiClient.get('/api/test-proxy', {
        params: { 
          resource: 'ZoningPlan',
          ...sharedQueryParams, 
          ...params,
          direction: params.direction || 'desc',
          sortBy: params.sortBy || 'id', // Changed from '_id' to 'id'
          page: params.page || 1,
          perPage: params.perPage || 500
        }
      })
      
      console.log('🏛️ Zoning plan response:', response.data)
      
      const records = response.data?.records || []
      console.log(`🏛️ Processing ${records.length} zoning plan records`)
      
      return this.processZoningPlan(records)
    } catch (error) {
      console.error('❌ Error fetching zoning plan:', error)
      return []
    }
  }

  // Get Uploads Data - AdminJS List API
  async getUploads(params = {}) {
    try {
      console.log('📁 Fetching uploads with params:', params)
      
      const response = await apiClient.get('/api/test-proxy', {
        params: { 
          resource: 'Uploads',
          ...sharedQueryParams, 
          ...params,
          direction: params.direction || 'desc',
          sortBy: params.sortBy || 'id', // Changed from '_id' to 'id'
          page: params.page || 1,
          perPage: params.perPage || 500
        }
      })
      
      console.log('📁 Uploads response:', response.data)
      
      const records = response.data?.records || []
      console.log(`📁 Processing ${records.length} upload records`)
      
      return this.processUploads(records)
    } catch (error) {
      console.error('❌ Error fetching uploads:', error)
      return []
    }
  }

  // Get Location Data - Try multiple endpoints
  async getLocations(params = {}) {
    try {
      console.log('📍 Fetching locations with params:', params)
      
      // Try the original location endpoint first
      const response = await apiClient.get('/api/location', {
        params: { 
          ...sharedQueryParams, 
          ...params,
          page: params.page || 1,
          limit: params.limit || 10
        }
      })
      
      console.log('📍 Locations response:', response.data)
      
      if (response.data?.success && response.data?.data) {
        const locations = response.data.data
        const total = response.data.total || locations.length
        console.log(`📍 Processing ${locations.length} location records`)
        
        return {
          locations: this.processLocations(locations),
          pagination: {
            page: 1,
            limit: locations.length,
            total: total,
            totalPages: 1
          },
          searchFallback: response.data.searchFallback || false,
          searchError: response.data.searchError || null,
          message: response.data.message || null
        }
      }
      
      return {
        locations: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
      }
    } catch (error) {
      console.error('❌ Error fetching locations:', error)
      return {
        locations: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
      }
    }
  }

  // Search API - AdminJS Search API
  async searchResource(resourceName, searchQuery, params = {}) {
    try {
      const response = await apiClient.get(`/api/test-proxy`, {
        params: { 
          resource: resourceName,
          search: searchQuery,
          ...sharedQueryParams, 
          ...params,
          page: params.page || 1,
          perPage: params.perPage || 500,
          sortBy: params.sortBy || 'id', // Changed from '_id' to 'id'
          direction: params.direction || 'desc'
        }
      })
      return response.data.records || []
    } catch (error) {
      console.error(`Error searching ${resourceName}:`, error)
      return []
    }
  }

  // Show API - AdminJS Show API
  async getRecord(resourceName, recordId) {
    try {
      const response = await apiClient.get(`/api/test-proxy`, {
        params: {
          resource: resourceName,
          recordId: recordId,
          action: 'show'
        }
      })
      return response.data.record || null
    } catch (error) {
      console.error(`Error fetching record ${recordId} from ${resourceName}:`, error)
      return null
    }
  }

  // Get all data for a specific point type
  async getDataByPointType(pointType, pointId) {
    try {
      let data = null
      let uploads = []

      switch (pointType) {
        case API_CONFIG.POINT_TYPES.BUILDING_CONTROL:
          data = await this.getBuildingControl({ id: pointId })
          uploads = await this.getUploads({ buildingControlId: pointId })
          break
        case API_CONFIG.POINT_TYPES.RISK_ZONE:
          data = await this.getRiskZone({ id: pointId })
          uploads = await this.getUploads({ riskZoneId: pointId })
          break
        case API_CONFIG.POINT_TYPES.ZONING_PLAN:
          data = await this.getZoningPlan({ id: pointId })
          uploads = await this.getUploads({ zoningPlanId: pointId })
          break
      }

      return {
        data: data[0] || null,
        uploads: uploads
      }
    } catch (error) {
      console.error('Error fetching data by point type:', error)
      return { data: null, uploads: [] }
    }
  }

  // Process Map Points Data - AdminJS record structure
  processMapPoints(records) {
    if (!Array.isArray(records)) return []
    
    return records.map(record => {
      const { id, name_local, house_no, road, subdistrict, district, province, postcode, latitude, longitude, created_at, updated_at } = record.params || {}
      
      return {
        id: id || record.id,
        type: this.getPointType(record.params),
        name: name_local,
        address: {
          houseNo: house_no,
          road: road,
          subdistrict: subdistrict,
          district: district,
          province: province,
          postcode: postcode
        },
        coordinates: {
          lat: latitude,
          lng: longitude
        },
        createdAt: created_at,
        updatedAt: updated_at,
        // AdminJS specific fields
        title: record.title,
        recordActions: record.recordActions || [],
        bulkActions: record.bulkActions || []
      }
    })
  }

  // Process Building Control Data - AdminJS record structure
  processBuildingControl(records) {
    if (!Array.isArray(records)) return []
    
    return records.map(record => {
      const { 
        id, 
        building_type, 
        use_purpose, 
        license_number, 
        quantity, 
        date, 
        fiscalYearId, 
        owner_id, 
        status, 
        createdAt 
      } = record.params || {}
      
      return {
        id: id || record.id,
        buildingType: building_type,
        usePurpose: use_purpose,
        licenseNumber: license_number,
        quantity: quantity,
        date: date,
        fiscalYearId: fiscalYearId,
        ownerId: owner_id,
        status: API_CONFIG.STATUS_MAPPING[status] || status,
        createdAt: createdAt,
        // AdminJS specific fields
        title: record.title,
        recordActions: record.recordActions || [],
        bulkActions: record.bulkActions || []
      }
    })
  }

  // Process Risk Zone Data - AdminJS record structure
  processRiskZone(records) {
    if (!Array.isArray(records)) return []
    
    return records.map(record => {
      const { 
        id, 
        zoneType, 
        description, 
        fiscalYear, 
        owner, 
        createdAt 
      } = record.params || {}
      
      return {
        id: id || record.id,
        zoneType: zoneType,
        description: description,
        fiscalYear: fiscalYear,
        owner: owner,
        createdAt: createdAt,
        // AdminJS specific fields
        title: record.title,
        recordActions: record.recordActions || [],
        bulkActions: record.bulkActions || []
      }
    })
  }

  // Process Zoning Plan Data - AdminJS record structure
  processZoningPlan(records) {
    if (!Array.isArray(records)) return []
    
    return records.map(record => {
      const { 
        id, 
        planType, 
        description, 
        fiscalYear, 
        owner, 
        status, 
        createdAt 
      } = record.params || {}
      
      return {
        id: id || record.id,
        planType: planType,
        description: description,
        fiscalYear: fiscalYear,
        owner: owner,
        status: API_CONFIG.STATUS_MAPPING[status] || status,
        createdAt: createdAt,
        // AdminJS specific fields
        title: record.title,
        recordActions: record.recordActions || [],
        bulkActions: record.bulkActions || []
      }
    })
  }

  // Process Uploads Data - AdminJS record structure
  processUploads(records) {
    if (!Array.isArray(records)) return []
    
    return records.map(record => {
      const { 
        id, 
        namefile, 
        url, 
        fileType, 
        size, 
        token, 
        buildingControlId, 
        riskZoneId, 
        zoningPlanId, 
        uploadedBy, 
        createdAt 
      } = record.params || {}
      
      return {
        id: id || record.id,
        name: namefile,
        url: getFileUrl(url),
        fileType: fileType,
        size: size,
        token: token,
        buildingControlId: buildingControlId,
        riskZoneId: riskZoneId,
        zoningPlanId: zoningPlanId,
        uploadedBy: uploadedBy,
        createdAt: createdAt,
        // AdminJS specific fields
        title: record.title,
        recordActions: record.recordActions || [],
        bulkActions: record.bulkActions || []
      }
    })
  }

  // Process Location Data - Handle both old and new API structures
  processLocations(records) {
    if (!Array.isArray(records)) return []
    
    return records.map(record => {
      // Check if this is the new API structure (has latitude/longitude)
      if (record.latitude && record.longitude) {
        // New API structure
        const { 
          id, 
          latitude, 
          longitude, 
          name_local, 
          house_no, 
          road, 
          subdistrict, 
          district, 
          province, 
          postcode,
          buildingControl
        } = record
        
        // Build address from components
        const addressParts = [house_no, road, subdistrict, district, province, postcode]
          .filter(part => part && part.trim())
        const address = addressParts.join(' ')
        
        // Extract building control info
        const buildingType = buildingControl?.building_type || 'Unknown'
        const usePurpose = buildingControl?.use_purpose || 'Unknown'
        const year = buildingControl?.year || new Date().getFullYear()
        
        return {
          id: id,
          name: name_local,
          address: address,
          phone: null,
          distance: "0 km",
          openingHours: null,
          programs: [buildingType, usePurpose],
          coordinates: [latitude, longitude],
          image: null,
          images: [],
          rating: 0,
          type: buildingType,
          description: `อาคารประเภท: ${buildingType}, วัตถุประสงค์: ${usePurpose}`,
          year: year,
          establishedYear: year,
          documentUrl: null,
          buildingControlId: buildingControl?.id,
          riskZoneId: null,
          zoningPlanId: null,
          fiscalYearId: buildingControl?.fiscalYearId,
          createdAt: null,
          updatedAt: null,
          rawData: record
        }
      } else {
        // Old API structure - use existing processing
        const { 
          id, 
          name, 
          address, 
          phone, 
          distance, 
          openingHours, 
          programs, 
          coordinates, 
          image, 
          images, 
          rating, 
          type, 
          description, 
          year, 
          establishedYear, 
          documentUrl,
          buildingControlId,
          riskZoneId,
          zoningPlanId,
          fiscalYearId,
          createdAt,
          updatedAt
        } = record
        
        return {
          id: id,
          name: name,
          address: address,
          phone: phone,
          distance: distance || "0 km",
          openingHours: openingHours,
          programs: programs || [],
          coordinates: coordinates || [0, 0],
          image: image,
          images: Array.isArray(images) ? images.filter(img => img && typeof img === 'object') : [],
          rating: rating || 0,
          type: type,
          description: description,
          year: year || establishedYear,
          establishedYear: establishedYear || year,
          documentUrl: documentUrl,
          buildingControlId: buildingControlId,
          riskZoneId: riskZoneId,
          zoningPlanId: zoningPlanId,
          fiscalYearId: fiscalYearId,
          createdAt: createdAt,
          updatedAt: updatedAt
        }
      }
    })
  }

  // Get Point Type from params
  getPointType(params) {
    if (params?.buildingControl) return 'buildingControl'
    if (params?.riskZone) return 'riskZone'
    if (params?.zoningPlan) return 'zoningPlan'
    return null
  }

  // Get Point Color based on type
  getPointColor(pointType) {
    switch (pointType) {
      case 'buildingControl':
        return '#3B82F6' // Blue
      case 'riskZone':
        return '#EF4444' // Red
      case 'zoningPlan':
        return '#10B981' // Green
      default:
        return '#6B7280' // Gray
    }
  }

  // Get Point Icon based on type
  getPointIcon(pointType) {
    switch (pointType) {
      case 'buildingControl':
        return '🏗️'
      case 'riskZone':
        return '⚠️'
      case 'zoningPlan':
        return '🏛️'
      default:
        return '📍'
    }
  }

  // Get AdminJS API metadata
  getApiMetadata(response) {
    return {
      total: response.meta?.total || 0,
      perPage: response.meta?.perPage || 10,
      page: response.meta?.page || 1,
      direction: response.meta?.direction || 'desc',
      sortBy: response.meta?.sortBy || 'id' // Changed from '_id' to 'id'
    }
  }
}

// Export singleton instance
export const apiService = new ApiService()

// Export for direct use
export default apiService 