const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = 3001;

// Enable CORS for all routes
app.use(cors());

// Proxy all requests to /api/cloudflare to the Cloudflare API
app.use('/api/cloudflare', createProxyMiddleware({
  target: 'https://api.cloudflare.com/client/v4',
  changeOrigin: true,
  pathRewrite: {
    '^/api/cloudflare': ''
  },
  onProxyReq: (proxyReq, req, res) => {
    // Log the request
    console.log(`Proxying request to: ${req.method} ${proxyReq.path}`);
  }
}));

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});
