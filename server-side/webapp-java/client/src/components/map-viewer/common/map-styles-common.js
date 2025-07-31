/**
 * Common functions to get and create styles (using Map-Viewer library styles)
 */
import styles from "../config-files/styles.json";
import i18n from "@/plugins/i18n";

import {
  CategorizedLayerStyle,
  GeoJSONLayerStyle,
  StaticIntervalsLayerStyle,
  WMSLayerStyle,
} from "@lbdudc/map-viewer";

/**
 * Function to get the style parameters from the styles.json file from its name
 * @param styleName: style's name to find into styles.json file
 * @returns {*|null}: style parameters or null if it not found
 * @private
 */
function _getStyleParamsFromJSON(styleName) {
  return styles.styles.find((style) => style.name === styleName);
}

/**
 * Function to get the instance of a style (of any type) from its name
 * @param styleName: style's name to find into styles.json file
 * @returns {GeoJSONLayerStyle|WMSLayerStyle|CategorizedLayerStyle|null}: if the style exists, returns the corresponding instance of the style
 */
function getStyle(styleName) {
  const style = _getStyleParamsFromJSON(styleName);
  if (style == null) {
    return null;
  } else if (style.type === "GeoJSONLayerStyle") {
    return createGeoJSONStyle(style);
  } else if (
    style.type === "WMSLayerStyle" ||
    style.type === "WMSLayerSLDStyle"
  ) {
    return createWMSStyle(style);
  } else if (style.type === "CategorizedStyle") {
    return createCategorizedStyle(style);
  } else if (style.type === "StaticIntervalsStyle") {
    return createStaticIntervalsStyle(style);
  }
  return null;
}

/* Creators to obtain the corresponding style instance from the style parameters received */

function createCategorizedStyle(style) {
  let values = {};
  let valueTranslations = {};
  if (!style.cached) {
    for (const value in style.values) {
      values[value] = getStyle(style.values[value]);
    }

    Object.keys(style.values).forEach((value) => {
      valueTranslations[value] = {};
      i18n.availableLocales.forEach(
        (l) =>
          (valueTranslations[value][l] =
            i18n.messages[l]["mapViewer"]["style-legend-label"][value])
      );
    });
  }
  return new CategorizedLayerStyle(
    style.name,
    style.cached,
    style.property,
    values,
    style.defaultStyle,
    valueTranslations
  );
}

function createStaticIntervalsStyle(style) {
  let intervals = null;
  if (!style.cached) {
    intervals = JSON.parse(JSON.stringify(style.intervals));
    intervals.forEach((interval) => {
      interval.style = getStyle(interval.style);
    });
  }
  return new StaticIntervalsLayerStyle(
    style.name,
    style.cached,
    style.property,
    intervals
  );
}

function createGeoJSONStyle(style) {
  return new GeoJSONLayerStyle(style.name, {
    fillColor: style.fillColor,
    strokeColor: style.strokeColor,
    fillOpacity: style.fillOpacity,
    strokeOpacity: style.strokeOpacity,
    weight: style.weight,
    radius: style.radius,
  });
}

function createWMSStyle(style) {
  if (style.type === "WMSLayerSLDStyle") {
    const sldBody = !style.cached
      ? require("/src/components/map-viewer/config-files/sld-styles/" +
          style.name +
          ".sld").default
      : null;
    return new WMSLayerStyle(style.name, style.cached, null, null, sldBody);
  } else {
    let translatedLabel = null;
    if (style.legendLabel) {
      translatedLabel = i18n.availableLocales.map((l) => {
        return {
          locale: l,
          label:
            i18n.messages[l]["mapViewer"]["style-legend-label"][
              style.legendLabel
            ],
        };
      });
    }

    return new WMSLayerStyle(
      style.name,
      style.cached,
      style.geometryType,
      {
        fillColor: style.fillColor,
        strokeColor: style.strokeColor,
        fillOpacity: style.fillOpacity,
        strokeOpacity: style.strokeOpacity,
        weight: style.weight,
        legendLabel: translatedLabel,
      },
      style.sld
    );
  }
}

export {
  getStyle,
  createGeoJSONStyle,
  createWMSStyle,
  createCategorizedStyle,
  createStaticIntervalsStyle,
};
