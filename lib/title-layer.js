// การกำหนดค่า Tile Layers หลายแบบสำหรับแสดงแผนที่
export const tileLayers = {
    baseLayers: {
      OpenStreetMap: {
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        name: "OpenStreetMap",
      },
      "CartoDB Positron": {
        url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        attribution:
          '&copy; OpenStreetMap contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        name: "CartoDB Positron",
      },
      "CartoDB Dark": {
        url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        attribution:
          '&copy; OpenStreetMap contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        name: "CartoDB Dark",
      },
      "Stamen Terrain": {
        url: "https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png",
        attribution:
          'Map tiles by <a href="http://stamen.com">Stamen Design</a> (CC BY 3.0) — Map data &copy; OpenStreetMap',
        name: "Stamen Terrain",
      },
    },
    overlayLayers: {
      "OpenStreetMap Overlay": {
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        name: "OSM Overlay",
        opacity: 0.3,
      },
      Satellite: {
        url:
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attribution:
          "Tiles © Esri & partners",
        name: "Satellite",
        opacity: 0.7,
      },
    },
  };
  
  export const defaultTileLayerKey = "OpenStreetMap";
  