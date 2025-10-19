// ✅ Next.js API route: Robust version with JSON safety & fallback
export default async function handler(req, res) {
  // ✅ Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // ✅ Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // ✅ Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { page = 1, limit = 10, type, year, search } = req.query

    // ✅ Base URL
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002'

    // ✅ Endpoints to try in order
    const endpoints = [
      `${apiUrl}/api/maps/local`,
      `${apiUrl}/api/maps/json`,
      `${apiUrl}/api/test-kml-import`
    ]

    let response = null
    let lastError = null
    let usedEndpoint = null
    let data = {}

    // ✅ Try multiple endpoints
    for (const endpoint of endpoints) {
      try {
        console.log(`🔄 Trying endpoint: ${endpoint}`)

        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(search && { search }),
          ...(type && { type }),
          ...(year && { year }),
        })

        const fullUrl = `${endpoint}?${queryParams.toString()}`
        console.log('🌐 Fetching URL:', fullUrl)

        response = await fetch(fullUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          signal: AbortSignal.timeout(10000), // 10s timeout
        })

        console.log('📡 API response status:', response.status, response.statusText)

        // ✅ If response is ok → stop trying
        if (response.ok) {
          usedEndpoint = endpoint

          // ✅ Try reading raw text first
          const raw = await response.text()
          try {
            data = JSON.parse(raw)
          } catch (err) {
            console.warn('⚠️ Response not valid JSON:', err.message)
            data = {
              success: false,
              message: 'Invalid JSON from API',
              rawText: raw,
            }
          }
          break
        } else {
          // ✅ Log non-OK responses
          const errorText = await response.text().catch(() => '')
          console.warn(`❌ ${endpoint} responded ${response.status}: ${errorText}`)
          lastError = new Error(`API error ${response.status}`)
        }
      } catch (err) {
        console.error(`❌ Error contacting ${endpoint}:`, err.message)
        lastError = err
      }
    }

    // ✅ Handle all endpoints failed
    if (!response || !response.ok) {
      console.error('❌ All endpoints failed')
      throw lastError || new Error('All API endpoints failed')
    }

    // ✅ Normalize data format
    const transformedResponse = {
      success: !!data.success,
      message: data.message || 'Request completed',
      data: Array.isArray(data.data) ? data.data : [],
      pagination: {
        page: Number(data.pagination?.page) || Number(page) || 1,
        limit: Number(data.pagination?.limit) || Number(limit) || 10,
        total: Number(data.pagination?.total) || Number(data.total) || 0,
        totalPages: Number(data.pagination?.totalPages) || 1,
      },
      usedEndpoint: usedEndpoint || 'Unknown',
      raw: process.env.NODE_ENV !== 'production' ? data : undefined, // 🧩 Debug mode only
    }

    // ✅ Send success response
    console.log('✅ API response OK:', {
      usedEndpoint: transformedResponse.usedEndpoint,
      dataCount: transformedResponse.data.length,
      total: transformedResponse.pagination.total,
    })

    res.status(200).json(transformedResponse)
  } catch (error) {
    console.error('❌ Error in location API proxy:', error)

    // ✅ Graceful fallback response
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
      message: 'ไม่สามารถเชื่อมต่อ API ได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง',
    })
  }
}
