"use client"

/**
 * Move (fly) map view ไปยังพิกัดที่กำหนด
 * @param {object} mapRef - React ref ของ Leaflet Map
 * @param {Array} coordinates - [lat, lng]
 * @param {number} zoom - ระดับซูม (default = 14)
 * @param {object} options - ตัวเลือก animation
 */
export function moveToLocation(mapRef, coordinates, zoom = 14, options = {}) {
  if (!mapRef?.current) return

  try {
    if (mapRef.current.flyTo) {
      mapRef.current.flyTo(coordinates, zoom, {
        duration: 1.5,
        easeLinearity: 0.25,
        ...options,
      })
    } else if (mapRef.current.setView) {
      mapRef.current.setView(coordinates, zoom, options)
    }
  } catch (error) {
    console.error("Error moving map to location:", error)
  }
}
