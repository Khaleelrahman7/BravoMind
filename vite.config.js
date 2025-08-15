import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    hmr: {
      // Try to handle connection issues gracefully
      timeout: 10000,
      overlay: true,
    },
    proxy: {
      '/api/nvidia': {
        target: 'https://integrate.api.nvidia.com/v1',
        changeOrigin: true,
        secure: false,
        timeout: 30000, // Increase timeout for API requests
        rewrite: (path) => path.replace(/^\/api\/nvidia/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Add the Authorization header to the proxy request
            const apiKey = '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';
            proxyReq.setHeader('Authorization', `Bearer ${apiKey}`);
            console.log('Sending Request to NVIDIA API:', req.method, req.url);
          });
          // Handle proxy response
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Response from NVIDIA API:', proxyRes.statusCode, req.url);
            // Handle CORS headers
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
          });
        }
      }
    }
  }
})
