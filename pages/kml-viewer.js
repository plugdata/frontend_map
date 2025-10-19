'use client'
import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import mockKMLData from '../data/kml.js'

// Dynamic imports for React-Leaflet components to prevent SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false })
const Polygon = dynamic(() => import("react-leaflet").then(mod => mod.Polygon), { ssr: false })
const Polyline = dynamic(() => import("react-leaflet").then(mod => mod.Polyline), { ssr: false })

const DEFAULT_LAT = 17.487
const DEFAULT_LNG = 101.815

// ✅ helper: แปลง GeoJSON feature → latlng array
const parseCoords = (geometry) => {
  if (!geometry) return []
  const { type, coordinates } = geometry
  switch (type) {
    case "Polygon":
      return coordinates.map(ring => ring.map(pt => [pt[1], pt[0]]))
    case "MultiPolygon":
      return coordinates.flat().map(ring => ring.map(pt => [pt[1], pt[0]]))
    case "LineString":
      return [coordinates.map(pt => [pt[1], pt[0]])]
    default:
      return []
  }
}

// ✅ helper: zoom to bounds
const FitBounds = dynamic(
  () => import('react-leaflet').then((mod) => {
    const { useMap } = mod;
    return ({ layer }) => {
      const map = useMap();
      React.useEffect(() => {
        if (layer?.features) {
          import('leaflet').then((L) => {
            const coords = [];
            layer.features.forEach(f => {
              parseCoords(f.geometry).forEach(ring => {
                ring.forEach(pt => coords.push(pt));
              });
            });
            if (coords.length > 0) {
              const bounds = L.default.latLngBounds(coords);
              map.fitBounds(bounds, { padding: [20, 20] });
            }
          });
        }
      }, [layer, map]);
      return null;
    };
  }),
  { ssr: false }
);

export default function KMLViewer() {
  const [kmlData, setKmlData] = useState(null)
  const [mapCenter, setMapCenter] = useState([DEFAULT_LAT, DEFAULT_LNG])
  const [mapZoom, setMapZoom] = useState(13)


  // ✅ โหลด CSS ของ Leaflet runtime (แก้ปัญหา Rollup)
  useEffect(() => {
    if (!document.getElementById("leaflet-style")) {
      const link = document.createElement("link")
      link.id = "leaflet-style"
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      document.head.appendChild(link)
    }
  }, [])

  // ✅ fix marker icon (bug React-Leaflet)
  useEffect(() => {
    import('leaflet').then((L) => {
      delete L.default.Icon.Default.prototype._getIconUrl
      L.default.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      })
    })
  }, [])

  // ✅ Load mock data on component mount
  useEffect(() => {
    setKmlData(mockKMLData)
  }, [])


  return (
    <>
      <Head>
        <title>KML Viewer - Polygon Data</title>
      </Head>

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">KML Polygon Viewer</h1>

          {/* Map Container */}
          <div className="bg-white rounded-lg shadow-sm border p-4 relative">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: "400px", width: "100%", border: "1px solid #ccc", borderRadius: 6 }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {/* Render GeoJSON layer */}
              {kmlData?.features?.map((f, idx) => {
                const coords = parseCoords(f.geometry)
                if (!coords.length) return null
                return f.geometry.type.includes("Line") ? (
                  <Polyline key={idx} positions={coords} pathOptions={{ color: "#ff0000" }} />
                ) : (
                  <Polygon key={idx} positions={coords} pathOptions={{ color: "#ff0000" }} />
                )
              })}
              <FitBounds layer={kmlData} />

              
            </MapContainer>
            
          </div>

        </div>
      </div>
    </>
  )
}
