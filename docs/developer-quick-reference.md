# คู่มืออ้างอิงด่วนสำหรับนักพัฒนา

## 🚀 การเริ่มต้นใช้งาน

### 1. การติดตั้งและรันโปรเจค
```bash
# ติดตั้ง dependencies
npm install

# รัน development server
npm run dev

# เปิดเบราว์เซอร์ที่ http://localhost:3000
```

### 2. การตั้งค่า Environment Variables
```bash
# สร้างไฟล์ .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:3002
```

## 📁 โครงสร้างไฟล์สำคัญ

```
├── pages/
│   ├── index.js              # หน้าหลัก
│   └── api/
│       └── location.js       # API proxy route
├── hooks/
│   ├── useLocationData.js    # Hook สำหรับจัดการข้อมูล
│   └── useLocationFilter.js  # Hook สำหรับการกรอง
├── utils/
│   └── apiService.js         # API service layer
├── components/
│   ├── map/
│   │   ├── interactive-map.js    # แผนที่หลัก
│   │   └── enhanced-popup.js     # Popup แสดงข้อมูล
│   ├── cards/
│   │   └── localtion-cards.js    # การ์ดรายการสถานที่
│   └── search/
│       └── search-interface.js   # หน้าต่างค้นหา
└── lib/
    └── custom-icons.js       # ไอคอนสำหรับแผนที่
```

## 🔧 API Endpoints

### 1. Internal API Routes
```
GET /api/location
- ดึงข้อมูลสถานที่
- Parameters: page, limit, type, year, search
- Response: { success, data, pagination, message }
```

### 2. External API Endpoints (Fallback Order)
```
1. /api/location          # Primary endpoint
2. /api/maps/local        # New maps endpoint  
3. /api/maps             # Alternative endpoint
```

## 🎯 การใช้งาน Hooks

### 1. useLocationData Hook
```javascript
import { useLocationData } from '../hooks/useLocationData'

const {
  locations,           // Array ของข้อมูลสถานที่
  loading,            // Loading state
  error,              // Error state
  searchFallback,     // Search fallback status
  searchError,        // Search error message
  pagination,         // Pagination info
  fetchLocations,     // ฟังก์ชันดึงข้อมูล
  search,             // ฟังก์ชันค้นหา
  filterByType,       // ฟังก์ชันกรองตามประเภท
  filterByYear,       // ฟังก์ชันกรองตามปี
  refresh,            // ฟังก์ชันรีเฟรชข้อมูล
  hasMore             // มีข้อมูลเพิ่มเติมหรือไม่
} = useLocationData({ limit: 50 })
```

### 2. useLocationFilter Hook
```javascript
import { useLocationFilter } from '../hooks/useLocationFilter'

const {
  searchQuery,        // คำค้นหา
  setSearchQuery,     // ฟังก์ชันตั้งค่าคำค้นหา
  filterType,         // ประเภทการกรอง
  setFilterType,      // ฟังก์ชันตั้งค่าประเภท
  filteredLocations,  // ข้อมูลที่กรองแล้ว
  filterOptions,      // ตัวเลือกการกรอง
  filterStats,        // สถิติการกรอง
  clearFilters        // ฟังก์ชันล้างการกรอง
} = useLocationFilter(locations)
```

## 🗺️ การใช้งาน Map Components

### 1. InteractiveMap Component
```javascript
import InteractiveMap from '../components/map/interactive-map'

<InteractiveMap
  locations={filteredLocations}           // ข้อมูลสถานที่
  selectedLocation={selectedLocation}     // สถานที่ที่เลือก
  onLocationSelect={handleLocationSelect} // ฟังก์ชันเมื่อเลือกสถานที่
  mapRef={mapRef}                        // Reference ของแผนที่
  onMapReady={handleMapReady}            // ฟังก์ชันเมื่อแผนที่พร้อม
/>
```

### 2. LocationCards Component
```javascript
import { LocationCards } from '../components/cards/localtion-cards'

<LocationCards
  locations={filteredLocations}           // ข้อมูลสถานที่
  selectedLocation={selectedLocation}     // สถานที่ที่เลือก
  onLocationSelect={handleLocationSelect} // ฟังก์ชันเมื่อเลือกสถานที่
  onMoveToLocation={moveToLocation}      // ฟังก์ชันเมื่อคลิกไปที่หมุด
  loading={locationsLoading}              // Loading state
  error={locationsError}                 // Error state
/>
```

### 3. SearchInterface Component
```javascript
import { SearchInterface } from '../components/search/search-interface'

<SearchInterface
  searchQuery={searchQuery}               // คำค้นหา
  setSearchQuery={handleSearchChange}     // ฟังก์ชันตั้งค่าคำค้นหา
  filterType={filterType}                 // ประเภทการกรอง
  setFilterType={setFilterType}           // ฟังก์ชันตั้งค่าประเภท
  filterLocationType={filterLocationType} // ประเภทสถานที่
  setFilterLocationType={handleFilterChange} // ฟังก์ชันตั้งค่าประเภทสถานที่
  filterYear={filterYear}                 // ปี
  setFilterYear={handleFilterChange}      // ฟังก์ชันตั้งค่าปี
  loading={locationsLoading}              // Loading state
  error={locationsError}                  // Error state
  searchFallback={searchFallback}        // Search fallback status
  searchError={searchError}               // Search error message
/>
```

## 🔍 การจัดการการค้นหา

### 1. การค้นหาผ่าน API
```javascript
const handleSearchChange = (query) => {
  setSearchQuery(query)
  if (query.trim()) {
    // ลองค้นหาผ่าน API ก่อน
    searchLocations(query).catch((error) => {
      console.log('🔍 API search failed, using client-side filtering')
      // ใช้ client-side filtering เป็น fallback
    })
  } else {
    refreshLocations()
  }
}
```

### 2. การกรองข้อมูล
```javascript
const handleFilterChange = (filterType, value) => {
  switch (filterType) {
    case 'type':
      setFilterLocationType(value)
      if (value !== "All types") {
        filterByType(value)  // กรองผ่าน API
      } else {
        refreshLocations()   // แสดงทั้งหมด
      }
      break
    case 'year':
      setFilterYear(value)
      if (value !== "All years") {
        filterByYear(parseInt(value))  // กรองผ่าน API
      } else {
        refreshLocations()             // แสดงทั้งหมด
      }
      break
  }
}
```

## 🛠️ การ Debug และ Monitoring

### 1. Console Logging
```javascript
// ดู API requests
console.log('🌐 Proxying request to:', fullUrl)
console.log('📋 Request parameters:', { page, limit, type, year, search })

// ดู API responses
console.log('📡 API response status:', response.status, response.statusText)
console.log('✅ API response received:', {
  success: data.success,
  dataLength: data.data?.length || 0,
  total: data.total,
  usedEndpoint: usedEndpoint
})

// ดู errors
console.error('❌ Error in location API proxy:', error)
```

### 2. Network Tab ใน Browser DevTools
- ดู API requests ที่ส่งไป
- ตรวจสอบ response status และ data
- ดู request headers และ parameters

### 3. React DevTools
- ดู component state และ props
- ตรวจสอบ hook values
- ดู re-renders และ performance

## 🚨 การแก้ไขปัญหาที่พบบ่อย

### 1. 404 Error - API Endpoint ไม่พบ
```javascript
// ตรวจสอบว่า external API server ทำงานอยู่
// ตรวจสอบ URL ใน environment variables
// ดู console logs เพื่อดูว่าใช้ endpoint ไหน

// วิธีแก้: ตรวจสอบ external API server
// หรือเปลี่ยน NEXT_PUBLIC_API_BASE_URL
```

### 2. Search ไม่ทำงาน
```javascript
// ตรวจสอบว่า search parameter ถูกส่งไปหรือไม่
// ดู console logs เพื่อดู search fallback status
// ตรวจสอบว่า client-side filtering ทำงานหรือไม่

// วิธีแก้: ตรวจสอบ search parameter mapping
// หรือใช้ client-side filtering เป็น fallback
```

### 3. Map ไม่แสดง Markers
```javascript
// ตรวจสอบว่า iconsReady เป็น true หรือไม่
// ตรวจสอบว่า locations มีข้อมูลหรือไม่
// ตรวจสอบว่า coordinates ถูกต้องหรือไม่

// วิธีแก้: ตรวจสอบ icon initialization
// หรือตรวจสอบ data structure
```

### 4. Loading State ไม่หาย
```javascript
// ตรวจสอบว่า API call สำเร็จหรือไม่
// ตรวจสอบว่า setLoading(false) ถูกเรียกหรือไม่
// ตรวจสอบ error handling

// วิธีแก้: ตรวจสอบ API response
// หรือตรวจสอบ error handling logic
```

## 📊 การ Monitor Performance

### 1. API Response Time
```javascript
// วัดเวลาการตอบสนองของ API
const startTime = Date.now()
const response = await fetch(url)
const endTime = Date.now()
console.log(`API response time: ${endTime - startTime}ms`)
```

### 2. Data Processing Time
```javascript
// วัดเวลาการประมวลผลข้อมูล
const startTime = Date.now()
const processedData = processLocations(rawData)
const endTime = Date.now()
console.log(`Data processing time: ${endTime - startTime}ms`)
```

### 3. Component Render Time
```javascript
// วัดเวลาการ render component
const startTime = Date.now()
// Component render
const endTime = Date.now()
console.log(`Component render time: ${endTime - startTime}ms`)
```

## 🔧 การ Customize

### 1. เพิ่ม Custom Icons
```javascript
// ใน lib/custom-icons.js
export const createCustomIcons = (L) => {
  return {
    // เพิ่มไอคอนใหม่
    'ประเภทใหม่': new L.Icon({
      iconUrl: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
        <svg width="25" height="41" viewBox="0 0 25 41">
          <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z" fill="#YOUR_COLOR"/>
          <circle cx="12.5" cy="12.5" r="6" fill="white"/>
        </svg>
      `),
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -41]
    })
  }
}
```

### 2. เพิ่ม Custom Filters
```javascript
// ใน hooks/useLocationFilter.js
const [customFilter, setCustomFilter] = useState("All")

const filteredLocations = useMemo(() => {
  let filtered = [...locations]
  
  // เพิ่ม custom filter logic
  if (customFilter !== "All") {
    filtered = filtered.filter(location => 
      location.customField === customFilter
    )
  }
  
  return filtered
}, [locations, customFilter, ...otherFilters])
```

### 3. เพิ่ม Custom API Endpoints
```javascript
// ใน pages/api/location.js
const endpoints = [
  `${apiUrl}/api/location`,      // endpoint หลัก
  `${apiUrl}/api/maps/local`,   // endpoint ใหม่
  `${apiUrl}/api/maps`,         // endpoint สำรอง
  `${apiUrl}/api/custom`        // เพิ่ม custom endpoint
]
```

## 📝 การเขียน Tests

### 1. Unit Tests สำหรับ Hooks
```javascript
// useLocationData.test.js
import { renderHook, act } from '@testing-library/react-hooks'
import { useLocationData } from '../hooks/useLocationData'

test('should fetch locations on mount', async () => {
  const { result } = renderHook(() => useLocationData())
  
  expect(result.current.loading).toBe(true)
  
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 100))
  })
  
  expect(result.current.loading).toBe(false)
  expect(result.current.locations).toBeDefined()
})
```

### 2. Integration Tests สำหรับ API
```javascript
// api/location.test.js
import { createMocks } from 'node-mocks-http'
import handler from '../pages/api/location'

test('should return locations data', async () => {
  const { req, res } = createMocks({
    method: 'GET',
    query: { page: 1, limit: 10 }
  })
  
  await handler(req, res)
  
  expect(res._getStatusCode()).toBe(200)
  expect(JSON.parse(res._getData())).toHaveProperty('success', true)
})
```

## 🎯 Best Practices

### 1. Error Handling
```javascript
// ใช้ try-catch สำหรับ async operations
try {
  const result = await apiService.getLocations(params)
  setLocations(result.locations)
} catch (error) {
  console.error('Error fetching locations:', error)
  setError(error.message)
}
```

### 2. Loading States
```javascript
// แสดง loading state ที่เหมาะสม
if (loading && locations.length === 0) {
  return <LoadingSpinner />
}

if (loading && locations.length > 0) {
  return <LoadingOverlay />
}
```

### 3. Performance Optimization
```javascript
// ใช้ useCallback สำหรับ functions
const handleSearchChange = useCallback((query) => {
  setSearchQuery(query)
  if (query.trim()) {
    searchLocations(query)
  } else {
    refreshLocations()
  }
}, [searchLocations, refreshLocations])

// ใช้ useMemo สำหรับ expensive calculations
const filteredLocations = useMemo(() => {
  return locations.filter(location => 
    location.name.includes(searchQuery)
  )
}, [locations, searchQuery])
```

---

*เอกสารนี้สร้างขึ้นเพื่อเป็นคู่มืออ้างอิงด่วนสำหรับนักพัฒนา*
