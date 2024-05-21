const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        createProxyMiddleware('*', {
            target: process.env.REACT_APP_API_URL,
            changeOrigin: true,
            secure: true, // HTTPS 프록시를 위해 필요
            // onProxyReq: (proxyReq) => {
            //     // SSL 인증서 검증 비활성화 (필요한 경우)
            //     proxyReq.setHeader('Host', process.env.REACT_APP_API_URL.replace(/^https?:\/\//, ''));
            // },
        })
    );
};
