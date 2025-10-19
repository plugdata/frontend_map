"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";

export function MapController({ onMapReady }) {
  const map = useMap();

  useEffect(() => {
    if (map && onMapReady) {
      console.log('Map ready in MapController:', map);
      onMapReady(map);
    }
  }, [map, onMapReady]);

  return null;
}
