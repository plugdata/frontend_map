# คู่มือการดึงข้อมูลจาก API - ระบบแผนที่และสถานที่

## 📋 ภาพรวมระบบ

ระบบนี้ถูกออกแบบมาเพื่อดึงข้อมูลสถานที่จาก API ภายนอกและแสดงผลบนแผนที่แบบ Interactive โดยมีการจัดการข้อมูลแบบ Multi-layer และรองรับการค้นหาแบบ Real-time

## 🏗️ สถาปัตยกรรมระบบ

### 1. โครงสร้างการทำงาน
```
Frontend (Next.js) 
    ↓
API Route (/api/location.js)
    ↓
External API Server (localhost:3002)
    ↓
Data Processing & Display
```

### 2. องค์ประกอบหลัก
- **API Service** (`utils/apiService.js`) - จัดการการเรียก API
- **Custom Hook** (`hooks/useLocationData.js`) - จัดการ state และ data fetching
- **API Route** (`pages/api/location.js`) - Proxy สำหรับเรียก external API
- **Components** - แสดงผลข้อมูลบน UI

## 🔄 กระบวนการดึงข้อมูล

### 1. การเริ่มต้น (Initialization)
```javascript
// ใน pages/index.js
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
} = useLocationData({ limit: 50 })
```

**วิธีการทำงาน:**
1. **useLocationData Hook** เริ่มต้นการโหลดข้อมูล
2. เรียก `fetchLocations()` ด้วยพารามิเตอร์เริ่มต้น
3. แสดง loading state ขณะรอข้อมูล
4. ประมวลผลข้อมูลที่ได้รับ

### 2. การเรียก API (API Call Process)
```javascript
// ใน utils/apiService.js
async getLocations(params = {}) {
  try {
    console.log('📍 Fetching locations with params:', params)
    
    // เรียก API ผ่าน Next.js API route
    const response = await apiClient.get('/api/location', {
      params: { 
        ...sharedQueryParams, 
        ...params,
        page: params.page || 1,
        limit: params.limit || 10
      }
    })
    
    // ประมวลผลข้อมูลที่ได้รับ
    return {
      locations: this.processLocations(locations),
      pagination: pagination,
      searchFallback: response.data.searchFallback || false,
      searchError: response.data.searchError || null,
      message: response.data.message || null
    }
  } catch (error) {
    console.error('❌ Error fetching locations:', error)
    return { locations: [], pagination: {...} }
  }
}
```

### 3. API Route Proxy (pages/api/location.js)
```javascript
export default async function handler(req, res) {
  try {
    const { page = 1, limit = 10, type, year, search } = req.query
    
    // ลองใช้ endpoint หลายตัวตามลำดับความสำคัญ
    const endpoints = [
      `${apiUrl}/api/location`,      // endpoint หลัก
      `${apiUrl}/api/maps/local`,   // endpoint ใหม่
      `${apiUrl}/api/maps`          // endpoint สำรอง
    ]
    
    // ลองเรียก API จนกว่าจะสำเร็จ
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(fullUrl, {...})
        if (response.ok) {
          usedEndpoint = endpoint
          break
        }
      } catch (error) {
        continue // ลอง endpoint ถัดไป
      }
    }
    
    // ส่งข้อมูลกลับไปยัง frontend
    res.status(200).json(transformedResponse)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
```

## 📊 การประมวลผลข้อมูล

### 1. Data Processing (processLocations)
```javascript
processLocations(records) {
  return records.map(record => {
    // ตรวจสอบว่าเป็นข้อมูล API ใหม่หรือเก่า
    if (record.latitude && record.longitude) {
      // ข้อมูล API ใหม่ (maps/local)
      return {
        id: record.id,
        name: record.name_local,
        address: buildAddress(record),
        coordinates: [record.latitude, record.longitude],
        type: record.buildingControl?.building_type,
        description: `อาคารประเภท: ${buildingType}`,
        // ... ข้อมูลอื่นๆ
      }
    } else {
      // ข้อมูล API เก่า (location)
      return {
        id: record.id,
        name: record.name,
        address: record.address,
        coordinates: record.coordinates,
        // ... ข้อมูลอื่นๆ
      }
    }
  })
}
```

### 2. การสร้างที่อยู่ (Address Building)
```javascript
// สำหรับข้อมูล API ใหม่
const addressParts = [
  record.house_no,      // เลขที่
  record.road,          // ถนน
  record.subdistrict,   // ตำบล
  record.district,      // อำเภอ
  record.province,      // จังหวัด
  record.postcode       // รหัสไปรษณีย์
].filter(part => part && part.trim())

const address = addressParts.join(' ')
```

## 🔍 ระบบการค้นหา

### 1. การค้นหาแบบ Real-time
```javascript
// ใน pages/index.js
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

### 2. การจัดการ Search Fallback
```javascript
// ใน pages/api/location.js
// หากการค้นหาผ่าน API ล้มเหลว
if (search && response.status === 500) {
  console.log('🔄 Search failed, trying fallback...')
  
  // ลองเรียก API โดยไม่ใช้ search parameter
  const fallbackResponse = await fetch(fallbackUrl, {...})
  
  if (fallbackResponse.ok) {
    return res.status(200).json({
      ...fallbackData,
      searchFallback: true,
      searchError: 'Search functionality is temporarily unavailable',
      message: 'Showing all results instead of search results'
    })
  }
}
```

### 3. Client-side Search Fallback
```javascript
// ใน hooks/useLocationFilter.js
const filteredLocations = useMemo(() => {
  let filtered = [...locations]

  // ค้นหาจากชื่อ, ที่อยู่, คำอธิบาย
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase()
    filtered = filtered.filter(location => 
      location.name.toLowerCase().includes(query) ||
      location.address.toLowerCase().includes(query) ||
      location.description.toLowerCase().includes(query)
    )
  }

  return filtered
}, [locations, searchQuery, ...otherFilters])
```

## 🎯 การจัดการ State

### 1. Loading States
```javascript
// ใน hooks/useLocationData.js
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)
const [searchFallback, setSearchFallback] = useState(false)

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
```

### 2. Error Handling
```javascript
// การจัดการ Error แบบ Comprehensive
if (error && locations.length === 0) {
  return (
    <div className="error-container">
      <AlertCircle className="error-icon" />
      <p className="error-message">{error}</p>
      <button onClick={refresh}>ลองใหม่</button>
    </div>
  )
}
```

## 🗺️ การแสดงผลบนแผนที่

### 1. Map Integration
```javascript
// ใน components/map/interactive-map.js
{iconsReady && locations.map((location) => {
  const customIcon = window.customIcons && window.customIcons[location.type] 
    ? window.customIcons[location.type] 
    : window.customIcons?.default;
    
  return (
    <Marker
      key={location.id}
      position={location.coordinates}
      icon={customIcon}
    >
      <Popup>
        <EnhancedPopup location={location} />
      </Popup>
    </Marker>
  )
})}
```

### 2. Icon Management
```javascript
// ใน lib/custom-icons.js
export const createCustomIcons = (L) => {
  return {
    'อาคารพาณิชย์': new L.Icon({
      iconUrl: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
        <svg width="25" height="41" viewBox="0 0 25 41">
          <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z" fill="#3B82F6"/>
          <circle cx="12.5" cy="12.5" r="6" fill="white"/>
        </svg>
      `),
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -41]
    }),
    // ไอคอนอื่นๆ...
  }
}
```

## 🔧 การตั้งค่าและ Configuration

### 1. Environment Variables
```javascript
// ใน pages/api/location.js
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002'
```

### 2. API Client Configuration
```javascript
// ใน utils/apiService.js
const apiClient = axios.create({
  baseURL: '', // ใช้ relative URL สำหรับ client-side
  timeout: 15000, // timeout 15 วินาที
  headers: {
    'Content-Type': 'application/json',
  }
})
```

## 📈 การ Monitor และ Debug

### 1. Logging System
```javascript
// Comprehensive logging สำหรับ debugging
console.log('🌐 Proxying request to:', fullUrl)
console.log('📋 Request parameters:', { page, limit, type, year, search })
console.log('📡 API response status:', response.status, response.statusText)
console.log('✅ API response received:', {
  success: data.success,
  dataLength: data.data?.length || 0,
  total: data.total,
  usedEndpoint: usedEndpoint
})
```

### 2. Error Tracking
```javascript
// Error logging พร้อม context
console.error('❌ Error in location API proxy:', {
  error: error.message,
  endpoint: usedEndpoint,
  params: { page, limit, type, year, search },
  timestamp: new Date().toISOString()
})
```

## 🚀 การใช้งานในทางปฏิบัติ

### 1. การโหลดข้อมูลเริ่มต้น
```javascript
// ระบบจะโหลดข้อมูลอัตโนมัติเมื่อ component mount
useEffect(() => {
  fetchLocations(initialParams)
}, []) // รันครั้งเดียวเมื่อ mount
```

### 2. การค้นหา
```javascript
// ผู้ใช้พิมพ์ในช่องค้นหา
const handleSearch = (query) => {
  if (query.trim()) {
    searchLocations(query) // ลองค้นหาผ่าน API
  } else {
    refreshLocations() // โหลดข้อมูลทั้งหมด
  }
}
```

### 3. การกรองข้อมูล
```javascript
// กรองตามประเภท
const handleTypeFilter = (type) => {
  if (type !== "All types") {
    filterByType(type) // กรองผ่าน API
  } else {
    refreshLocations() // แสดงทั้งหมด
  }
}
```

## 🛡️ การจัดการ Error และ Fallback

### 1. Multi-Endpoint Strategy
```javascript
// ลองใช้ endpoint หลายตัว
const endpoints = [
  '/api/location',      // endpoint หลัก
  '/api/maps/local',   // endpoint ใหม่
  '/api/maps'          // endpoint สำรอง
]

// ลองทีละตัวจนกว่าจะสำเร็จ
for (const endpoint of endpoints) {
  try {
    const response = await fetch(endpoint)
    if (response.ok) break
  } catch (error) {
    continue // ลองตัวถัดไป
  }
}
```

### 2. Search Fallback
```javascript
// หากการค้นหาผ่าน API ล้มเหลว
if (searchFailed) {
  // ใช้ client-side filtering
  const filtered = locations.filter(location => 
    location.name.includes(searchQuery)
  )
  setLocations(filtered)
  setSearchFallback(true) // แจ้งผู้ใช้ว่าใช้ fallback
}
```

## 📊 Performance และ Optimization

### 1. Data Caching
```javascript
// Cache ข้อมูลใน memory
const [cachedData, setCachedData] = useState({})
const [cacheTimestamp, setCacheTimestamp] = useState(null)

// ใช้ cache หากข้อมูลยังใหม่
if (cacheTimestamp && Date.now() - cacheTimestamp < 300000) { // 5 นาที
  return cachedData
}
```

### 2. Lazy Loading
```javascript
// โหลดข้อมูลเพิ่มเติมเมื่อต้องการ
const loadMore = useCallback(async () => {
  if (loading || pagination.page >= pagination.totalPages) return
  
  const nextPage = pagination.page + 1
  const result = await apiService.getLocations({ page: nextPage })
  
  setLocations(prev => [...prev, ...result.locations])
  setPagination(result.pagination)
}, [loading, pagination])
```

## 🎯 สรุปการทำงาน

ระบบนี้ทำงานผ่านขั้นตอนหลักดังนี้:

1. **Initialization** - โหลดข้อมูลเริ่มต้นเมื่อ component mount
2. **API Call** - เรียก API ผ่าน Next.js API route
3. **Data Processing** - ประมวลผลข้อมูลให้เป็นรูปแบบที่ component ต้องการ
4. **State Management** - จัดการ loading, error, และ data states
5. **UI Rendering** - แสดงผลข้อมูลบนแผนที่และ UI components
6. **User Interaction** - รองรับการค้นหา, กรอง, และ interaction อื่นๆ
7. **Error Handling** - จัดการ error และ fallback mechanisms

ระบบนี้ถูกออกแบบมาให้มีความยืดหยุ่น, มีความเสถียร, และให้ประสบการณ์ผู้ใช้ที่ดีแม้ในสถานการณ์ที่ API ภายนอกมีปัญหา

---

*เอกสารนี้สร้างขึ้นเพื่ออธิบายการทำงานของระบบการดึงข้อมูลจาก API ในโปรเจคแผนที่ Interactive*
