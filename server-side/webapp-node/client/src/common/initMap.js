/**
 * Crea un mapa con una capa base con unos id y centro determinados
 */
import { Map, TileLayer } from "@lbdudc/map-viewer";

const initMap = (leafletMapId, id, center) => {
  let map = new Map(leafletMapId, id, center);

  const baseLayer = new TileLayer({
    id: "Esri.WorldStreetMap",
    baseLayer: true,
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    options: {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012",
    },
  });

  map.addLayer(baseLayer);
  return map;
};

export default initMap;
