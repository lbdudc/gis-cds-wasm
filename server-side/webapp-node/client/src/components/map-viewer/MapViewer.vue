<template>
  <v-container fluid id="map-container">
    <v-row justify="start" class="mb-1 justify-end" no-gutters> </v-row>

    <div ref="map" id="map"></div>
  </v-container>
</template>
<script>
import maps from "./config-files/maps.json";
import layers from "./config-files/layers.json";
import properties from "@/properties";
import { updateLayer, onMapZoomChange } from "./common/map-layer-common";
import {
  createMap,
  loadBaseLayers,
  loadOverlaysLayers,
} from "./common/map-common";

import {} from "./common/map-controls";

let overlays = [];
let currentZoom = 3;

export default {
  name: "Map",
  data() {
    return {
      mapSelected: null,
      map: null,
      maps: [],
      viewOverlays: [],
      loadingMap: false,
    };
  },
  watch: {
    $route() {
      const routeSelectedMap = this.maps.find(
        (map) => map.name === this.$route.params.id
      );
      this.loadRouteMap(routeSelectedMap);
      this.viewOverlays = this.loadOverlays();
      // Needed for child to refresh his overlays
      this.refreshLayerManager();
    },
  },
  async mounted() {
    this.maps = maps.maps.map((map, index) => {
      return {
        id: index,
        name: map.name,
        label: this.$t("mapViewer.map-label." + map.name.replace(".", "-")),
      };
    });
    let mapFromRoute = null;

    if (this.$route.params.id) {
      mapFromRoute = this.maps.find(
        (map) => map.name === this.$route.params.id
      );
      this.loadRouteMap(mapFromRoute);
    }
    if (!mapFromRoute && this.maps.length === 1) {
      this.mapSelected = this.maps[0].id;
      this.changeRoute();
    } else if (this.$route.params.id) {
      this.changeRoute();
    }

    // update features on map move
    this.map.getLeafletMap().on("moveend", () => {
      const bbox = this.map.getLeafletMap().getBounds();
      updateLayer(this.map, bbox, this.geoJSONPopupFunction);
    });
  },
  beforeDestroy() {
    localStorage.setItem("state", JSON.stringify(this.map.exportState()));
  },
  methods: {
    loadOverlays() {
      return layers.layers.filter((l) =>
        maps.maps[this.mapSelected]?.layers.find(
          (mapLayer) => !mapLayer.baseLayer && mapLayer.name == l.name
        )
      );
    },
    changeRoute() {
      this.selectedCustom = this.maps[this.mapSelected].customId
        ? this.maps[this.mapSelected]
        : null;
      if (this.$route.params.id !== this.maps[this.mapSelected].name) {
        this.$router.replace({
          name: "MapViewer",
          params: {
            id: this.maps[this.mapSelected].name,
          },
        });
      }
    },
    loadRouteMap(routeMap) {
      if (routeMap) {
        this.mapSelected = routeMap.id;
        this.loadMap();
      }
    },
    async loadMap() {
      // If map is already created, we remove it
      if (this.map != null) {
        this.map.clearMap();
        this.map.getLeafletMap().off();
        this.map.getLeafletMap().remove();
      }

      // We don't continue creating a map if there is no one selected
      if (this.mapSelected == null) {
        return;
      }

      // Setting title's tab
      document.title =
        this.$t(`mapViewer.map-label.${maps.maps[this.mapSelected].name}`) +
        " - " +
        properties.APP_NAME;

      // Creating map
      this.map = createMap(this.mapSelected);
      this.map.centerView();
      this.setLayersRetrievedEventTrigger();

      // Loading base layers
      loadBaseLayers(this.map, this.mapSelected);

      // Loading overlays
      overlays = loadOverlaysLayers(
        this.map,
        this.mapSelected
      );

      // focusing visible layers if focus (by url params)
      if (this.$route.query.focus) {
        this.map.centerView("visible");
      }

      if (localStorage.getItem("state")) {
        const state = JSON.parse(localStorage.getItem("state"));

        this.map.importState(state);
        localStorage.removeItem("state");
      }

    },
    setLayersRetrievedEventTrigger() {
      let layersRendered = {};
      this.map.getLeafletMap().on("layerchange", (a) => {
        if (a.name) {
          layersRendered[a.name] = 0;
          if (Object.keys(layersRendered).length == 1) {
            this.map.getLeafletMap().on("moveend", () => {
              const bbox = this.map.getLeafletMap().getBounds();
              updateLayer(this.map, bbox, this.geoJSONPopupFunction);
            });
            setTimeout(() => {
              this.map.getLeafletMap().off("layerchange");
              this.setZoomEventTrigger();
              this.setMoveEndEventTrigger();
              document.dispatchEvent(
                new CustomEvent("layers-rendered", {
                  detail: { map: this.map },
                })
              );
            }, 0);
          }
        }
      });
    },
    setZoomEventTrigger() {
      this.map.getLeafletMap().on("zoomstart", () => {
        // if paginated layers present wait for them to be loaded
        let layersRendered = {};
        this.map.getLeafletMap().on("layerchange", (a) => {
          layersRendered[a.name] = 0;
          if (Object.keys(layersRendered).length == 1) {
            this.map.getLeafletMap().off("layerchange");
            layersRendered = {};
            setTimeout(() => {
              document.dispatchEvent(
                new CustomEvent("zoom-rendered", {
                  detail: { map: this.map },
                })
              );
            }, 0);
          }
        });
      });
    },
    setMoveEndEventTrigger() {
      currentZoom = this.map.getLeafletMap()._zoom;
      this.map.getLeafletMap().on("movestart", (e) => {
        if (currentZoom == e.target._zoom) {
          setTimeout(() => {
            document.dispatchEvent(
              new CustomEvent("move-rendered", {
                detail: { map: this.map },
              })
            );
          }, 0);
        } else {
          currentZoom = e.target._zoom;
        }
      });
    },
    refreshLayerManager() {
      this.loadingMap = true;
      setTimeout(() => {
        this.loadingMap = false;
      }, 0);
    },
  },
};
</script>

<style lang="css" scoped>
#map-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

#map {
  width: 100%;
  height: 100%;
  z-index: 1;
}

::v-deep .leaflet-top.leaflet-right {
  margin-top: 10px !important;
}

::v-deep .leaflet-top.leaflet-right .leaflet-control {
  margin-top: 0 !important;
}

::v-deep .leaflet-layer-manager-toggle {
  width: 30px !important;
  height: 30px !important;
}

::v-deep .leaflet-layer-manager-overlays {
  display: inline-grid;
}

::v-deep .leaflet-add-layer-control-icon {
  width: 30px !important;
  height: 30px !important;
}

::v-deep .leaflet-layer-manager-selector {
  vertical-align: text-top;
}

::v-deep .leaflet-layer-manager-style-selector {
  float: right;
  margin-right: 5px;
  margin-top: 3px;
}

::v-deep .leaflet-layer-manager-icon {
  max-height: 16px;
  position: relative;
  top: 4px;
}

::v-deep .leaflet-layer-manager-icon-square {
  display: inline-block;
  height: 13px;
  width: 16px;
  border: 2px solid white;
  border-right-width: 3px;
  border-bottom-width: 0px;
  margin-bottom: -1px;
  margin-top: 4px;
}

::v-deep .leaflet-layer-manager-button {
  float: right;
  margin-right: 5px;
  margin-top: 3px;
  background-repeat: no-repeat;
  background-size: 15px 15px;
  background-position: center;
  height: 16px;
  width: 10px;
}
</style>
