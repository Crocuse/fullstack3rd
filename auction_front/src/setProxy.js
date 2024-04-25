const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("*", {
      target: "http://13.54.151.221:3001",
      changeOrigin: true,
    })
  );
};