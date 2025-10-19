# คู่มือโครงสร้างโค้ด - ระบบการดึงข้อมูล API

## 📁 โครงสร้างไฟล์และหน้าที่

### 1. Core API Files
```
utils/
├── apiService.js          # จัดการการเรียก API หลัก
├── map-utils.js           # Utilities สำหรับแผนที่
└── map-helpers.js         # Helper functions

hooks/
├── useLocationData.js     # Custom hook สำหรับจัดการ location data
├── useLocationFilter.js   # Hook สำหรับการกรองข้อมูล
└── use-map-state.js      # Hook สำหรับจัดการ map state

pages/
├── api/
│   └── location.js        # Next.js API route (proxy)
└── index.js              # หน้าหลักของแอปพลิเคชัน
```

### 2. Component Files
```
components/
├── map/
│   ├── interactive-map.js     # แผนที่หลัก
│   ├── enhanced-popup.js      # Popup สำหรับแสดงข้อมูล
│   └── custom-icons.js        # ไอคอนสำหรับแผนที่
├── cards/
│   └── localtion-cards.js     # การ์ดแสดงรายการสถานที่
└── search/
    └── search-interface.js    # หน้าต่างการค้นหา
```

## 🔧 การทำงานของแต่ละไฟล์

### 1. `utils/apiService.js` - API Service Layer

#### หน้าที่หลัก:
- จัดการการเรียก API ภายนอก
- ประมวลผลข้อมูลที่ได้รับ
- จัดการ error และ fallback

#### โครงสร้างหลัก:
```javascript
class ApiService {
  // ดึงข้อมูลสถานที่
  async getLocations(params = {}) {
    try {
      const response = await apiClient.get('/api/location', {
        params: { 
          ...sharedQueryParams, 
          ...params,
          page: params.page || 1,
          limit: params.limit || 10
        }
      })
      
      return {
        locations: this.processLocations(locations),
        pagination: pagination,
        searchFallback: response.data.searchFallback || false,
        searchError: response.data.searchError || null
      }
    } catch (error) {
      console.error('❌ Error fetching locations:', error)
      return { locations: [], pagination: {...} }
    }
  }

  // ประมวลผลข้อมูลให้เป็นรูปแบบที่ component ต้องการ
  processLocations(records) {
    return records.map(record => {
      // ตรวจสอบว่าเป็นข้อมูล API ใหม่หรือเก่า
      if (record.latitude && record.longitude) {
        // ประมวลผลข้อมูล API ใหม่
        return processNewApiStructure(record)
      } else {
        // ประมวลผลข้อมูล API เก่า
        return processOldApiStructure(record)
      }
    })
  }
}
```

#### การทำงาน:
1. **รับ parameters** จาก component
2. **เรียก API** ผ่าน Next.js API route
3. **ประมวลผลข้อมูล** ให้เป็นรูปแบบที่ต้องการ
4. **ส่งข้อมูลกลับ** พร้อม pagination และ metadata

### 2. `hooks/useLocationData.js` - Data Management Hook

#### หน้าที่หลัก:
- จัดการ state ของข้อมูลสถานที่
- จัดการ loading และ error states
- จัดการการค้นหาและกรองข้อมูล

#### โครงสร้างหลัก:
```javascript
export const useLocationData = (initialParams = {}) => {
  // State management
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchFallback, setSearchFallback] = useState(false)
  const [pagination, setPagination] = useState({...})

  // ฟังก์ชันหลักสำหรับดึงข้อมูล
  const fetchLocations = useCallback(async (params = {}) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await apiService.getLocations(params)
      setLocations(result.locations)
      setPagination(result.pagination)
      setSearchFallback(result.searchFallback || false)
    } catch (err) {
      setError(err.message)
      setLocations([])
    } finally {
      setLoading(false)
    }
  }, [])

  // ฟังก์ชันสำหรับค้นหา
  const search = useCallback(async (searchQuery, params = {}) => {
    try {
      await fetchLocations({ search: searchQuery, ...params })
    } catch (error) {
      console.log('🔍 Search failed, falling back to client-side filtering')
    }
  }, [fetchLocations])

  return {
    locations, loading, error, searchFallback, searchError,
    pagination, fetchLocations, search, filterByType, filterByYear,
    hasMore: pagination.page < pagination.totalPages
  }
}
```

#### การทำงาน:
1. **Initialization** - โหลดข้อมูลเมื่อ component mount
2. **State Management** - จัดการ loading, error, และ data states
3. **API Integration** - เชื่อมต่อกับ apiService
4. **Search & Filter** - จัดการการค้นหาและกรองข้อมูล

### 3. `pages/api/location.js` - API Proxy Route

#### หน้าที่หลัก:
- เป็น proxy ระหว่าง frontend และ external API
- จัดการ fallback mechanisms
- แปลงข้อมูลให้เป็นรูปแบบที่ต้องการ

#### โครงสร้างหลัก:
```javascript
export default async function handler(req, res) {
  try {
    const { page = 1, limit = 10, type, year, search } = req.query
    
    // ลองใช้ endpoint หลายตัว
    const endpoints = [
      `${apiUrl}/api/location`,      // endpoint หลัก
      `${apiUrl}/api/maps/local`,   // endpoint ใหม่
      `${apiUrl}/api/maps`          // endpoint สำรอง
    ]
    
    let response = null
    let usedEndpoint = null
    
    // ลองเรียก API จนกว่าจะสำเร็จ
    for (const endpoint of endpoints) {
      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          // Map parameters ตาม endpoint
          ...(search && endpoint.includes('maps') && { q: search }),
          ...(search && !endpoint.includes('maps') && { search }),
          ...(type && { type }),
          ...(year && { year })
        })
        
        const fullUrl = `${endpoint}?${queryParams.toString()}`
        response = await fetch(fullUrl, {...})
        
        if (response.ok) {
          usedEndpoint = endpoint
          break
        }
      } catch (error) {
        continue // ลอง endpoint ถัดไป
      }
    }
    
    // แปลงข้อมูลและส่งกลับ
    const data = await response.json()
    const transformedResponse = {
      success: data.success,
      data: data.data || [],
      pagination: {...},
      message: data.message,
      usedEndpoint: usedEndpoint
    }
    
    res.status(200).json(transformedResponse)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
```

#### การทำงาน:
1. **รับ request** จาก frontend
2. **ลองเรียก API** หลาย endpoint จนกว่าจะสำเร็จ
3. **แปลงข้อมูล** ให้เป็นรูปแบบที่ต้องการ
4. **ส่งข้อมูลกลับ** พร้อม metadata

### 4. `pages/index.js` - Main Application

#### หน้าที่หลัก:
- เป็นหน้าหลักของแอปพลิเคชัน
- จัดการการเชื่อมต่อระหว่าง components
- จัดการ user interactions

#### โครงสร้างหลัก:
```javascript
export default function GoogleMapsLayout() {
  // ใช้ custom hooks
  const {
    locations: apiLocations,
    loading: locationsLoading,
    error: locationsError,
    searchFallback,
    searchError,
    search: searchLocations,
    filterByType,
    filterByYear,
    refresh: refreshLocations
  } = useLocationData({ limit: 50 })

  // ใช้ location filter hook
  const {
    searchQuery, setSearchQuery,
    filterType, setFilterType,
    filterLocationType, setFilterLocationType,
    filterYear, setFilterYear,
    filteredLocations,
    filterOptions,
    filterStats,
    clearFilters
  } = useLocationFilter(apiLocations)

  // จัดการการค้นหา
  const handleSearchChange = (query) => {
    setSearchQuery(query)
    if (query.trim()) {
      searchLocations(query).catch((error) => {
        console.log('🔍 API search failed, using client-side filtering')
      })
    } else {
      refreshLocations()
    }
  }

  // จัดการการกรอง
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
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <Header />
      
      {/* Search Interface */}
      <SearchInterface
        searchQuery={searchQuery}
        setSearchQuery={handleSearchChange}
        filterType={filterType}
        setFilterType={setFilterType}
        filterLocationType={filterLocationType}
        setFilterLocationType={(value) => handleFilterChange('type', value)}
        filterYear={filterYear}
        setFilterYear={(value) => handleFilterChange('year', value)}
        loading={locationsLoading}
        error={locationsError}
        searchFallback={searchFallback}
        searchError={searchError}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Location Cards */}
        <LocationCards
          locations={filteredLocations}
          selectedLocation={selectedLocation}
          onLocationSelect={handleLocationSelect}
          onMoveToLocation={moveToLocation}
          loading={locationsLoading}
          error={locationsError}
        />

        {/* Interactive Map */}
        <InteractiveMap
          locations={filteredLocations}
          selectedLocation={selectedLocation}
          onLocationSelect={handleLocationSelect}
          mapRef={mapRef}
          onMapReady={handleMapReady}
        />
      </div>
    </div>
  )
}
```

#### การทำงาน:
1. **Initialize hooks** - เริ่มต้น custom hooks
2. **Handle user interactions** - จัดการการค้นหาและกรอง
3. **Render components** - แสดงผล UI components
4. **Manage state** - จัดการ state ระหว่าง components

### 5. `components/map/interactive-map.js` - Map Component

#### หน้าที่หลัก:
- แสดงแผนที่แบบ Interactive
- แสดง markers สำหรับแต่ละสถานที่
- จัดการการคลิกและ interaction

#### โครงสร้างหลัก:
```javascript
export default function InteractiveMap({
  locations = [],
  selectedLocation,
  onLocationSelect = () => {},
  mapRef,
  onMapReady,
}) {
  const [isClient, setIsClient] = useState(false)
  const [iconsReady, setIconsReady] = useState(false)

  // Initialize icons
  useEffect(() => {
    setIsClient(true)
    
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        // Fix default markers
        delete L.default.Icon.Default.prototype._getIconUrl
        L.default.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        })

        // สร้าง custom icons
        window.customIcons = createCustomIcons(L.default)
        setIconsReady(true)
      })
    }
  }, [])

  // แสดง loading state
  if (!isClient || !iconsReady) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>{!isClient ? "กำลังโหลดแผนที่..." : "กำลังเตรียมไอคอน..."}</p>
      </div>
    )
  }

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="h-full w-full z-0"
        whenCreated={(mapInstance) => {
          if (mapRef) {
            mapRef.current = mapInstance
          }
        }}
      >
        <MapController onMapReady={onMapReady} />
        
        {/* Render markers */}
        {iconsReady && locations.map((location) => {
          const customIcon = window.customIcons && window.customIcons[location.type] 
            ? window.customIcons[location.type] 
            : window.customIcons?.default;
            
          return (
            <Marker
              key={location.id}
              position={location.coordinates}
              icon={customIcon}
              eventHandlers={{
                click(e) {
                  onLocationSelect(location)
                }
              }}
            >
              <Popup>
                <EnhancedPopup location={location} />
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
```

#### การทำงาน:
1. **Initialize map** - เริ่มต้นแผนที่
2. **Load icons** - โหลดไอคอนสำหรับ markers
3. **Render markers** - แสดง markers สำหรับแต่ละสถานที่
4. **Handle interactions** - จัดการการคลิกและ interaction

## 🔄 Data Flow

### 1. การไหลของข้อมูล (Data Flow)
```
User Input (Search/Filter)
    ↓
useLocationData Hook
    ↓
apiService.getLocations()
    ↓
Next.js API Route (/api/location)
    ↓
External API Server
    ↓
Data Processing
    ↓
Component State Update
    ↓
UI Re-render
```

### 2. Error Handling Flow
```
API Call
    ↓
Try Primary Endpoint
    ↓
If 404/500 Error
    ↓
Try Secondary Endpoint
    ↓
If Still Error
    ↓
Try Tertiary Endpoint
    ↓
If All Fail
    ↓
Return Error State
```

### 3. Search Fallback Flow
```
User Types Search Query
    ↓
Try API Search
    ↓
If API Search Fails
    ↓
Use Client-side Filtering
    ↓
Show Search Fallback Warning
    ↓
Display Filtered Results
```

## 🛠️ การ Debug และ Monitoring

### 1. Console Logging
```javascript
// API Request Logging
console.log('🌐 Proxying request to:', fullUrl)
console.log('📋 Request parameters:', { page, limit, type, year, search })

// API Response Logging
console.log('📡 API response status:', response.status, response.statusText)
console.log('✅ API response received:', {
  success: data.success,
  dataLength: data.data?.length || 0,
  total: data.total,
  usedEndpoint: usedEndpoint
})

// Error Logging
console.error('❌ Error in location API proxy:', error)
```

### 2. Error Tracking
```javascript
// Track which endpoint is being used
console.log('🔄 Trying endpoint:', endpoint)
console.log('✅ Using endpoint:', usedEndpoint)

// Track search fallback
console.log('🔍 Search failed, falling back to client-side filtering')
console.log('🔄 Search fallback active:', searchFallback)
```

## 📊 Performance Considerations

### 1. Data Caching
```javascript
// Cache data in memory
const [cachedData, setCachedData] = useState({})
const [cacheTimestamp, setCacheTimestamp] = useState(null)

// Use cache if data is still fresh
if (cacheTimestamp && Date.now() - cacheTimestamp < 300000) {
  return cachedData
}
```

### 2. Lazy Loading
```javascript
// Load more data when needed
const loadMore = useCallback(async () => {
  if (loading || pagination.page >= pagination.totalPages) return
  
  const nextPage = pagination.page + 1
  const result = await apiService.getLocations({ page: nextPage })
  
  setLocations(prev => [...prev, ...result.locations])
  setPagination(result.pagination)
}, [loading, pagination])
```

### 3. Debounced Search
```javascript
// Debounce search input to avoid too many API calls
const debouncedSearch = useCallback(
  debounce((query) => {
    if (query.trim()) {
      searchLocations(query)
    } else {
      refreshLocations()
    }
  }, 300),
  [searchLocations, refreshLocations]
)
```

## 🎯 สรุปการทำงานของระบบ

ระบบนี้ทำงานผ่านการเชื่อมต่อระหว่าง components หลายตัว:

1. **Main Application** (`pages/index.js`) - จัดการการเชื่อมต่อและ user interactions
2. **Data Management** (`hooks/useLocationData.js`) - จัดการ state และ data fetching
3. **API Service** (`utils/apiService.js`) - จัดการการเรียก API และประมวลผลข้อมูล
4. **API Proxy** (`pages/api/location.js`) - เป็นตัวกลางระหว่าง frontend และ external API
5. **UI Components** - แสดงผลข้อมูลและจัดการ user interactions

ระบบนี้ถูกออกแบบมาให้มีความยืดหยุ่น, มีความเสถียร, และให้ประสบการณ์ผู้ใช้ที่ดีแม้ในสถานการณ์ที่ API ภายนอกมีปัญหา

---

*เอกสารนี้สร้างขึ้นเพื่ออธิบายโครงสร้างโค้ดและการทำงานของระบบการดึงข้อมูลจาก API*
