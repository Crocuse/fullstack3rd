const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("*", {
      target: "http://3.24.176.186:3001",
      changeOrigin: true,
    })
  );
};