import Vue from "vue";
import axios from "axios";
import { cacheAdapterEnhancer } from "axios-extensions";
import properties from "../properties";
import i18n from "@/plugins/i18n";

/* Fixes a problem with symbols codification (https://gitlab.lbd.org.es/GEMA/lps/lps/-/issues/616) */
function axiosSerializer(params) {
  let result = "";
  for (const param in params) {
    if (params[param] == null || params[param] === "") {
      continue;
    }
    if (result !== "") {
      result += "&";
    }
    result = result + param + "=" + params[param];
  }
  return result;
}

axios.defaults.paramsSerializer = { serialize: axiosSerializer };

const HTTP = axios.create({
  baseURL: properties.SERVER_URL,
  // allowing use of cache with 'cache' param (not enabled by default)
  headers: { "Cache-Control": "no-cache" },
  adapter: cacheAdapterEnhancer(axios.defaults.adapter, {
    enabledByDefault: false,
  }),
});
const onFailure = (title, message) => {
  Vue.notify({
    title: title,
    text: message,
    type: "error",
    ignoreDuplicates: true,
  });
};

const errorTitles = {
  400: "errors.badRequestError",
  401: "errors.auth_required.title",
  500: "errors.internalServerError",
};

const onResponseSuccess = (response) => response;

// si el servidor nos devuelve un 401 o 403,
// estamos intentando acceder a un recurso sin
// los permisos correctos
const onResponseFailure = (err) => {
  if (err.message === "Network Error") {
    Vue.notify({
      title: i18n.t("errors.serverUnavailable.title"),
      text: i18n.t("errors.serverUnavailable.content"),
      type: "error",
      duration: 30000,
      ignoreDuplicates: true,
    });
  } else if (err.code === "ERR_CANCELED") {
    return;
  } else {
    const status = err.response.status;
 if (status !== 404) { // eslint-disable-line
      const headerError = err.response.headers["x-app-error"];
      const errorParams = err.response.headers["x-app-params"] || "{}";
      const title = i18n.t(errorTitles[status] || "errors.generic");
      const message = headerError
        ? i18n.t(headerError, JSON.parse(errorParams))
        : i18n.t("errors.defaultServerErrorMessage");
      onFailure(title, message);
    }
  }
  return Promise.reject(err);
};

// en cada request hay que añadir el token de autenticación
// si es que lo tenemos
const onRequest = (config) => {
  return config;
};

HTTP.interceptors.response.use(onResponseSuccess, onResponseFailure);
HTTP.interceptors.request.use(onRequest);

export { HTTP };
