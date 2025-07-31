module.exports = {
  devServer: {
    host: "localhost",
    public: process.env.VUE_APP_PUBLIC_URL,
  },
  // ...other vue-cli plugin options...
  pwa: {
    // configure the workbox plugin
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      // we specify a custom service-worker in this route
      swSrc: "src/service-worker.js",
      // ...other Workbox options...
    },
  },
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  chainWebpack: (config) => {
    // Used to import .sld files when creating a custom SLD style
    config.module
      .rule("raw")
      .test(/\.sld$/)
      .use("raw-loader")
      .loader("raw-loader")
      .end();
  },
  parallel: false,
};
