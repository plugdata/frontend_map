/* "use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { tileLayers } from "../../lib/title-layer";

const LayersControl = dynamic(
  () => import("react-leaflet").then((m) => m.LayersControl),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);

export default function MultipleTileLayers({ selectedBaseLayer, selectedOverlays = [] }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <LayersControl position="topright">
      {Object.entries(tileLayers.baseLayers).map(([key, layer]) => (
        <LayersControl.BaseLayer
          key={key}
          checked={selectedBaseLayer === key}
          name={layer.name}
        >
          <TileLayer
            url={layer.url}
            attribution={layer.attribution}
            {...(layer.options || {})}
          />
        </LayersControl.BaseLayer>
      ))}

      {Object.entries(tileLayers.overlayLayers).map(([key, layer]) => (
        <LayersControl.Overlay
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
        </LayersControl.Overlay>
      ))}
    </LayersControl>
  );
}
 */