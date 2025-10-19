"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { moveToLocation } from "../../utils/map-utils";
import { tileLayers, defaultTileLayerKey } from "../../lib/title-layer";
import { createCustomIcons } from "../../lib/custom-icons";
import EnhancedPopup from "./enhanced-popup";
import { MapController } from "./map-controller";
import styles from "./popup-styles.module.css";
import KMLViewer from "./read-kml";
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const LayersControl = dynamic(
  () => import("react-leaflet").then((m) => m.LayersControl),
  { ssr: false }
);
const LayersControlBaseLayer = dynamic(
  () => import("react-leaflet").then((m) => m.LayersControl.BaseLayer),
  { ssr: false }
);
const LayersControlOverlay = dynamic(
  () => import("react-leaflet").then((m) => m.LayersControl.Overlay),
  { ssr: false }
);

export default function InteractiveMap({
  locations = [],
  selectedLocation,
  onLocationSelect = () => {},
  mapRef,
  selectedBaseLayer = defaultTileLayerKey,
  selectedOverlays = [],
  setSelectedBaseLayer,
  setSelectedOverlays,
  onMapReady,
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [iconsReady, setIconsReady] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Fix for default markers in Leaflet - only run on client side
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        delete L.default.Icon.Default.prototype._getIconUrl;
        L.default.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        // สร้าง custom icons ตามประเภท
        window.customIcons = createCustomIcons(L.default);
        
        // ตั้งค่าให้รู้ว่า icons พร้อมใช้งานแล้ว
        setIconsReady(true);
      });
    }
    
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    if (selectedLocation?.coordinates && mapRef?.current) {
      moveToLocation(mapRef, selectedLocation.coordinates, 14);
    }
  }, [selectedLocation, mapRef]);

  const defaultCenter = [7.5611, 99.6111]; // จังหวัดตรัง, ประเทศไทย
  const defaultZoom = 11; // สามารถปรับเพิ่ม/ลดตามต้องการ
  

  if (!isClient || !iconsReady) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-2"></div>
          <p className="text-gray-600">
            {!isClient ? "กำลังโหลดแผนที่..." : "กำลังเตรียมไอคอน..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="h-full w-full z-0"
        zoomControl={!isMobile}
        scrollWheelZoom
        whenCreated={(mapInstance) => {
          console.log('Map created:', mapInstance);
          if (mapRef) {
            mapRef.current = mapInstance;
            console.log('mapRef.current set to:', mapRef.current);
          }
        }}
      >
        <MapController onMapReady={onMapReady} />
        <LayersControl position="topright">
          {/* Base Layers */}
          {Object.entries(tileLayers.baseLayers).map(([key, layer]) => (
            <LayersControlBaseLayer
              key={key}
              checked={selectedBaseLayer === key}
              name={layer.name}
            >
              <TileLayer
                url={layer.url}
                attribution={layer.attribution}
                {...(layer.options || {})}
              />
            </LayersControlBaseLayer>
          ))}

          {/* Overlay Layers */}
          {Object.entries(tileLayers.overlayLayers).map(([key, layer]) => (
            <LayersControlOverlay
              key={key}
              checked={selectedOverlays.includes(key)}
              name={layer.name}
            >
              <TileLayer
                url={layer.url}
                attribution={layer.attribution}
                opacity={layer.opacity ?? 1}
                {...(layer.options || {})}
              />
            </LayersControlOverlay>
          ))}
        </LayersControl>
        
        {/* Only render markers when icons are ready */}
        {iconsReady && locations.map((location) => {
          // ตรวจสอบว่า customIcons พร้อมใช้งานหรือไม่
          const customIcon = window.customIcons && window.customIcons[location.type] 
            ? window.customIcons[location.type] 
            : window.customIcons?.default;
            
          return (
            <Marker
              key={location.id}
              position={location.coordinates}
              eventHandlers={{
                // Event handler สำหรับการคลิกที่ marker
                click(e) {
                  const location = e.target.getLatLng(); // ดึงพิกัดของ marker ที่คลิก
                  const map = e.target._map; // ดึง map instance จาก marker
                  if (map) {
                    // ใช้ setView แทน flyTo
                    const zoomLevel = 18;
                    map.setView(location, zoomLevel);
                  }
                  // เรียก onLocationSelect เพื่ออัปเดต selectedLocation
                  onLocationSelect(location);
                }
              }}
              icon={customIcon}
            >
              <Popup className={styles.customPopup}>
                <EnhancedPopup location={location} />
              </Popup>
            </Marker>
          );
        })}
        <KMLViewer />
      </MapContainer>
    </div>
  );
}
