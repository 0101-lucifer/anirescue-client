import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'AniRescue Emergency Platform',
        short_name: 'AniRescue',
        description: 'AI-Powered Animal Rescue & Volunteer Coordination',
        theme_color: '#059669', // Tailwind emerald-600
        background_color: '#f8fafc', // Tailwind slate-50
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  // --- NEW: MICROSERVICES API GATEWAY PROXY ---
  server: {
    proxy: {
      // Whenever your React app fetches '/api/...', Vite will automatically 
      // intercept it and forward it to your Nginx Gateway on port 3000
      '/api': {
        target: `${import.meta.env.VITE_API_URL}`,
        changeOrigin: true,
        secure: false,
      }
    }
  }
});