import kml from '../../data/kml.js'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
const Polyline = dynamic(
    () => import("react-leaflet").then((m) => m.Polyline),
    { ssr: false }
  );
const Polygon = dynamic(
    () => import("react-leaflet").then((m) => m.Polygon),
    { ssr: false }
  );
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
/* const FitBounds = dynamic(
    () => import('react-leaflet').then((mod) => {
      const { useMap } = mod;
      return ({ layer }) => {
        const map = useMap();
       useEffect(() => {
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
  ); */

  export default function KMLViewer() {
    const [kmlData, setKmlData] = useState(null)
    useEffect(() => {
        setKmlData(kml)
    }, [])
    return (
        <div>
                  {/* Render GeoJSON layer */}
                  {kmlData?.features?.map((f, idx) => {
                 const coords = parseCoords(f.geometry)
                 if (!coords.length) return null
                 const color = f.properties.color || "#ff0000" // ใช้สีจาก properties หรือ default สีแดง
                 return f.geometry.type.includes("Line") ? (
                   <Polyline key={idx} positions={coords} pathOptions={{ color }} />
                 ) : (
                   <Polygon key={idx} positions={coords} pathOptions={{ color }} />
                 )
               })}
            {/*   <FitBounds layer={kmlData} /> */}

        </div>
    )
}