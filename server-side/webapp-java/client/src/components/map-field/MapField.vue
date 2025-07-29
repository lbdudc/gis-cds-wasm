<template>
  <div>
    <v-container class="ml-md-1 m-0 p-00" :ref="id" :id="id"></v-container>
  </div>
</template>

<script>
import initMap from "@/common/initMap";
import { polygon, multiPoint, lineString } from "@turf/helpers";

export default {
  name: "MapField",
  props: {
    entity: {},
    editable: {},
    propName: {},
    entityName: {},
    geomType: {},
    id: {
      required: false,
      type: String,
      default: "map",
    },
    height: {
      required: false,
      type: String,
      default: "200px",
    },
  },
  mounted() {
    var self = this;
    var geometryType = this.geomType;

    // setting map height
    this.$refs[this.id].style.height = this.height;

    this.map = initMap(this.id, this.id);

    var _map = this.map.getLeafletMap();
    var _feature;
    var _editBtn = new L.easyButton({
      states: [
        {
          stateName: "normal",
          icon: '<i class="mdi mdi-pencil"></i>',
          onClick: function (btn) {
            editFeature(geometryType);
            btn.state("editing");
          },
        },
        {
          stateName: "editing",
          icon: '<i class="mdi mdi-close-circle"></i>',
          title: "Editing element",
          onClick: function (btn) {
            stopEdition();
            btn.state("normal");
          },
        },
      ],
    });

    var _removeBtn = new L.easyButton(
      '<i class="mdi mdi-delete"></i>',
      function () {
        removeFeature();
      }
    );

    // Full screen button
    L.control.fullscreen({ forceSeparateButton: true }).addTo(_map);

    var _multiPointDrawer;
    var _singlePolygonDrawer;
    var _multiPolygonDrawer;
    var _singleLineDrawer;
    var _multiLineDrawer;
    self.featuresList = [];

    // Map parameters
    var layerGroup = L.featureGroup();
    self.center = {};

    self.edit = self.editable || false;

    activate();

    function activate() {
      // Layer group
      layerGroup.addTo(_map);
      if (self.entity[self.propName]) {
        addGeoJSON(self.entity[self.propName]);
      } else {
        _map.setZoom(2);
        _map.panTo([30, 10]);
      }

      _multiPointDrawer = new L.Draw.Marker(_map, { repeatMode: true });
      _singlePolygonDrawer = new L.Draw.Polygon(_map);
      _multiPolygonDrawer = new L.Draw.Polygon(_map, { repeatMode: true });
      _singleLineDrawer = new L.Draw.Polyline(_map);
      _multiLineDrawer = new L.Draw.Polyline(_map, { repeatMode: true });

      _map.on("draw:created", function (e) {
        _feature = e.layer;
        self.entity[self.propName] = _feature.toGeoJSON().geometry;
        stopEdition();
      });

      if (self.edit) {
        _editBtn.addTo(_map);
        _removeBtn.addTo(_map);
      }
    }

    function removeFeature() {
      if (_feature) {
        _map.removeLayer(_feature);
        self.entity[self.propName] = null;
      } else {
        if (self.featuresList.length > 0) {
          self.featuresList.forEach((feature) => {
            _map.removeLayer(feature);
          });
          self.entity[self.propName] = null;
          self.featuresList = [];
        }
      }
    }

    function addGeoJSON(json) {
      removeFeature();

      _feature = L.geoJson(json);
      _feature.addTo(_map);

      _map.fitBounds(_feature.getBounds());
    }

    function editFeature(type) {
      self.$refs[self.id].style.cursor = "pointer";
      if (_feature) {
        _map.removeLayer(_feature);
      }
      if (type == "Point") {
        _map.on("click", function (e) {
          _feature = L.marker(e.latlng);
          self.entity[self.propName] = _feature.toGeoJSON().geometry;
          stopEdition();
        });
      } else if (type == "MultiPoint") {
        _multiPointDrawer.enable();
      } else if (type == "Polygon") {
        _singlePolygonDrawer.enable();
      } else if (type == "MultiPolygon") {
        _multiPolygonDrawer.enable();
      } else if (type == "LineString") {
        _singleLineDrawer.enable();
      } else if (type == "MultiLineString") {
        _multiLineDrawer.enable();
      }
    }

    function stopEdition() {
      self.$refs[self.id].style.cursor = "grab";
      if (_feature) {
        _feature.addTo(_map);
        if (
          geometryType == "MultiPoint" ||
          geometryType == "MultiPolygon" ||
          geometryType == "MultiLineString"
        ) {
          if (_feature._latlng || _feature._latlngs) {
            self.featuresList.push(_feature);
            var geometry;
            var turfList = featureListConversion(self.featuresList);

            geometry = turfList[0];
            geometry.geometry.coordinates = [geometry.geometry.coordinates];
            geometry.geometry.type = geometryType;
            if (self.featuresList.length > 1) {
              turfList.slice(1).forEach((turfFeature) => {
                geometry.geometry.coordinates.push(
                  turfFeature.geometry.coordinates
                );
              });
            }

            var geoJSONGeometry = L.geoJSON(geometry).getLayers()[0];
            self.entity[self.propName] = geoJSONGeometry.feature;
            _feature = null;
          } else {
            _multiPointDrawer.disable();
            _multiPolygonDrawer.disable();
            _multiLineDrawer.disable();
          }
        } else {
          _map.off("click");
          _editBtn.state("normal");
          _singlePolygonDrawer.disable();
          _singleLineDrawer.disable();
        }
      } else {
        _multiPointDrawer.disable();
        _multiPolygonDrawer.disable();
        _multiLineDrawer.disable();
      }
    }

    function featureListConversion(featureList) {
      var newList = [];

      featureList.forEach(function (feature) {
        newList.push(featureConversion(feature));
      });

      return newList;
    }

    function featureConversion(feature) {
      var type = geometryType;
      var latLngs = feature.getLatLngs
        ? feature.getLatLngs()
        : feature.getLatLng();

      if (type == "MultiPolygon") {
        latLngs = latLngs[0];
      }

      if (type == "MultiPoint") {
        return multiPoint([latLngs.lng, latLngs.lat]);
      }

      var featureLatLngs = [];
      latLngs.forEach(function (latlng) {
        featureLatLngs.push([latlng.lng, latlng.lat]);
      });

      if (type == "MultiPolygon") {
        featureLatLngs.push(featureLatLngs[0]);
        return polygon([featureLatLngs]);
      }

      if (type == "MultiLineString") {
        return lineString(featureLatLngs);
      }
    }

    // If user activates location, have to fitbounds again after map is loaded
    _map.on("locationfound", () => {
      if (_feature) {
        _map.fitBounds(_feature.getBounds());
      } else {
        _map.setZoom(2);
        _map.panTo([30, 10]);
      }
    });
  },
};
</script>

<style scoped>
.container {
  width: auto;
  min-height: 400px;
  z-index: 3;
}
</style>
