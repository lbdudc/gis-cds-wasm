/**
 * Common functions to create and modify layers
 */
import RepositoryFactory from "@/repositories/RepositoryFactory";
import layers from "../config-files/layers.json";
import { getStyle } from "@/components/map-viewer/common/map-styles-common";
import {
  GeoPackageLayer,
  GeoJSONLayer,
  WMSLayer,
  WCSLayer,
  GeoTIFFLayer,
  ShapeFileLayer,
} from "@lbdudc/map-viewer";

/**
 * Creates a WCS Layer.
 */
async function createWCSLayer(json, layerParams, layerInMap = {}) {
  const options = json.options;

  const availableStyles = _getAvailableStyles(json);
  const defaultStyle = _getDefaultStyle(json, availableStyles, layerInMap);

  var wcsLayer = new WCSLayer(
    {
      id: json.name,
      label: layerParams.label,
      baseLayer: false,
      selected: layerInMap.selected || layerInMap.selected == null,
      url: json.url || properties.GEOSERVER_URL + "/wcs",
      params: options,
      added: layerParams.added,
    },
    availableStyles,
    defaultStyle
  );

  await wcsLayer.createLayerFromGeoraster();
  return wcsLayer;
}

/**
 * Creates a GeoPackage Layer.
 */
async function createGeoPackageLayer(json, layerParams, layerInMap = {}) {
  const availableStyles = _getAvailableStyles(json);
  const defaultStyle = _getDefaultStyle(json, availableStyles, layerInMap);

  return await GeoPackageLayer.create(
    json.data,
    {
      id: json.name || layerParams.label,
      label: layerParams.label,
      baseLayer: false,
      selected: layerInMap.selected || layerInMap.selected == null, // if no value is given, it is shown in map
      url: json.url,
      added: layerParams.added,
    },
    availableStyles,
    defaultStyle
  );
}

/**
 * Creates a GeoTIFF Layer.
 */
async function createGeoTIFFLayer(json, layerParams, layerInMap = {}) {
  const options = json.options;

  const availableStyles = _getAvailableStyles(json);
  const defaultStyle = _getDefaultStyle(json, availableStyles, layerInMap);

  const geoTIFFLayer = new GeoTIFFLayer(
    {
      id: json.name,
      label: layerParams.label,
      baseLayer: false,
      selected: layerInMap.selected || layerInMap.selected == null, // if no value is given, it is shown in map
      url: json.url,
      params: options,
      added: layerParams.added,
      resolution: json.resolution,
      opacity: json.opacity,
    },
    availableStyles,
    defaultStyle
  );

  await geoTIFFLayer.createGeoRasterLayer();
  return geoTIFFLayer;
}

/**
 * Creates a Shapefile Layer.
 */
function createShapefileLayer(json, layerParams, layerInMap = {}) {
  const availableStyles = _getAvailableStyles(json);
  const defaultStyle = _getDefaultStyle(json, availableStyles, layerInMap);

  return new ShapeFileLayer(
    {
      id: json.name,
      label: layerParams.label,
      baseLayer: false,
      selected: layerInMap.selected || layerInMap.selected == null, // if no value is given, it is shown in map
      url: json.url,
      added: layerParams.added,
    },
    availableStyles,
    defaultStyle
  );
}

/**
 * Generates a unique layer ID for an existing map.
 */
function getUniqueLayerId(map, layerName, count = 1) {
  const uniqueId = `${layerName}.${count}`;
  if (map.getLayer(uniqueId)) {
    return getUniqueLayerId(map, layerName, count + 1);
  } else {
    return uniqueId;
  }
}

/**
 * Creates a WMS Layer.
 */
function createWMSLayer(json, layerParams, layerInMap = {}) {
  const options = json.options;

  const availableStyles = _getAvailableStyles(json);
  const defaultStyle = _getDefaultStyle(json, availableStyles, layerInMap);

  return new WMSLayer(
    {
      id: layerParams.label,
      label: layerParams.label,
      baseLayer: false,
      selected: layerInMap.selected || layerInMap.selected == null, // if no value is given, it is shown in map
      url: json.url,
      params: options,
      added: layerParams.added,
    },
    availableStyles,
    defaultStyle
  );
}

function createExternalGeoJSONLayer(json, layerParams, layerInMap = {}) {
  const availableStyles = _getAvailableStyles(json);
  const defaultStyle = _getDefaultStyle(json, availableStyles, layerInMap);

  return new GeoJSONLayer(
    json,
    {
      id: json.name || layerParams.label,
      label: layerParams.label,
      baseLayer: false,
      selected: layerInMap.selected || layerInMap.selected == null, // if no value is given, it is shown in map
      url: json.url,
      added: layerParams.added,
      type: layerParams.type,
    },
    availableStyles,
    defaultStyle
  );
}

async function onMapZoomChange(map, overlays) {
  // timeout of 0 so zoom has the new value
  await sleep(0);
  const zoom = map.getLeafletMap().getZoom();
  let newOverlay = Object.entries(map.options.layers).find(
    ([_, el]) =>
      !el.options.baseLayer &&
      !el.options?.selected &&
      el.options?.minZoom <= zoom &&
      el.options?.maxZoom >= zoom
  );

  // if layer not selected and on zoom interval
  if (newOverlay != null) {
    setNewOverlay(map, overlays, newOverlay);
  }
}

async function setNewOverlay(map, overlays, newOverlay) {
  let oldOverlay = Object.entries(map.options.layers).find(
    ([_, el]) => !el.options.baseLayer && el.options?.selected
  );
  const newOverlayKey = newOverlay[0];
  await changeOverlay(
    map,
    overlays,
    newOverlayKey,
    oldOverlay != null ? oldOverlay[0] : null
  );
}

async function changeOverlay(map, overlays, newOverlay, oldOverlay) {
  return new Promise(async (resolve) => {
    const getLayerId = (el) => {
      return el.options.id;
    };

    const getOverlayLayers = (selected) =>
      overlays
        ?.filter((el) => {
          if (selected) {
            return selected === getLayerId(el);
          } else {
            return getLayerId(el) === oldOverlay;
          }
        })
        .map((el) => map.getLayer(el.options.id));

    if (newOverlay != null) {
      await Promise.all(
        overlays.map((overlay) => {
          map.hideLayer(overlay);
        })
      );
    }
    if (oldOverlay != null) {
      const layers = getOverlayLayers(oldOverlay);
      if (layers != null)
        await Promise.all(
          layers.map((layer) => {
            map.hideLayer(layer);
          })
        );
    }
    if (newOverlay != null) {
      const layers = getOverlayLayers(newOverlay);
      if (layers != null)
        await Promise.all(
          layers.map((layer) => {
            map.showLayer(layer);
          })
        );
    }
    resolve();
  });
}

function _getAvailableStyles(json) {
  return json.availableStyles?.map((availableStyleName) =>
    getStyle(availableStyleName)
  );
}

function _getDefaultStyle(json, availableStyles, layerInMap) {
  return layerInMap.style != null
    ? availableStyles.find((style) => style.id === layerInMap.style)
    : json.defaultStyle != null
    ? availableStyles.find((style) => style.id === json.defaultStyle)
    : null;
}

function _getEntityNameFromJSON(json) {
  const prop = json.name != null ? "name" : "id";
  const nameParts = json[prop].split("-");
  if (nameParts.length > 3) {
    return (
      nameParts[0] +
      "-" +
      nameParts[1].charAt(0).toUpperCase() +
      nameParts[1].slice(1)
    );
  }
  return nameParts[0];
}

function _getRepositoryNameFromJSON(json) {
  return "RasterEntityRepository";
}

function _getPropertyNameFromJSON(json) {
  // returns last substring after a '-'
  const prop = json.entityName != null ? "name" : "id";
  const nameParts = json[prop].split("-");
  return nameParts[nameParts.length - 2].split(".")[0];
}

function _getBBoxPagination(bounds) {
  const augmentedBBox = _incrementBBox(
    bounds.getWest(),
    bounds.getEast(),
    bounds.getSouth(),
    bounds.getNorth()
  );

  const options = { params: {} };
  options.params.xmin = augmentedBBox.xmin;
  options.params.xmax = augmentedBBox.xmax;
  options.params.ymin = augmentedBBox.ymin;
  options.params.ymax = augmentedBBox.ymax;

  return options;
}

function _incrementBBox(xmin, xmax, ymin, ymax) {
  let incrementNS = (ymax - ymin) * 0.3;
  let incrementEW = (xmax - xmin) * 0.3;

  let augmentedXmin = xmin - incrementEW;
  let augmentedXmax = xmax + incrementEW;
  let augmentedYmin = ymin - incrementNS;
  let augmentedYmax = ymax + incrementNS;

  return {
    xmin: augmentedXmin,
    xmax: augmentedXmax,
    ymin: augmentedYmin,
    ymax: augmentedYmax,
  };
}

function sleep(timeout) {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, timeout)
  );
}

function createGeoJSONLayer(json, layerParams, layerInMap = {}, map) {
  const repository = RepositoryFactory.get(_getRepositoryNameFromJSON(json));
  const options = _getBBoxPagination(layerParams.bounds);
  options.params.zoom = map.getLeafletMap().getZoom();
  const popup = layerParams.hasOwnProperty("popupFn")
    ? layerParams.popupFn(layerInMap.form || json.form)
    : null;
  const availableStyles = _getAvailableStyles(json);
  const defaultStyle = _getDefaultStyle(json, availableStyles, layerInMap);
  const aux = () => {
    return new Promise(async (resolve) => {
      const data = await repository.getGeom("name", options);
      map.getLeafletMap().fire("layerchange", { name: json.name });
      resolve(data);
    });
  };

  return new GeoJSONLayer(
    aux,
    {
      id: json.name,
      label: layerParams.label,
      baseLayer: false,
      selected: layerInMap.selected || layerInMap.selected == null, // if no value is given, it is shown in map
      url: json.url,
      popup: popup,
      added: layerParams.added,
    },
    availableStyles,
    defaultStyle
  );
}

/**
 * Updates GeoJSON layer features within a given bounding box.
 */
function updateLayer(map, bbox, popupFn) {
  const layersToShow = layers.layers.filter(
    (layer) => layer.layerType === "geojson" && map.getLayer(layer.name)
  );

  const options = _getBBoxPagination(bbox);
  options.params.zoom = map.getLeafletMap().getZoom();

  layersToShow.forEach((json) => {
    const repository = RepositoryFactory.get(_getRepositoryNameFromJSON(json));

    repository.getGeom("name", options).then((data) => {
      if (data?.features?.length !== 0) {
        let layer = map.getLayer(json.name);
        layer
          .getLayer()
          .then((layr) => {
            _updateLayerData(layr, data);
            map.getLeafletMap().fire("layerchange", { name: json.name });
          })
          .finally(() => {});
      } else {
        map.getLeafletMap().fire("layerchange", { name: json.name });
      }
    });
  });
}

function _updateLayerData(layer, data) {
  if (Object.keys(layer._layers).length === 0) {
    layer.addData(data);
  } else {
    const dataObj = {};
    data.features.forEach((item) => (dataObj[item.id] = item));
    layer.eachLayer((subLayer) => {
      const found = dataObj[subLayer.feature.id];
      if (found) {
        delete dataObj[subLayer.feature.id];
      } else {
        layer.removeLayer(subLayer);
      }
    });

    const newFeatures = Object.values(dataObj);
    layer.addData(newFeatures);
  }
}

export {
  createWMSLayer,
  createGeoJSONLayer,
  createGeoPackageLayer,
  createWCSLayer,
  createGeoTIFFLayer,
  createShapefileLayer,
  getUniqueLayerId,
  createExternalGeoJSONLayer,
  updateLayer,
  onMapZoomChange,
};
