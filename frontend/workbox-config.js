module.exports = {
  globDirectory: 'build/',
  globPatterns: [
    '**/*.{js,css,html,png,svg,ico,webmanifest,json,txt,woff,woff2,ttf,eot}'
  ],
  globIgnores: [
    '**/node_modules/**/*',
    '**/src/**/*',
    '**/public/**/*',
    'workbox*.js',
    'sw*.js',
    '*.map'
  ],
  swDest: 'build/sw.js',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.openweathermap\.org\//,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'openweather-api-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 3600 // 1 hour
        },
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    },
    {
      urlPattern: /^https:\/\/bhuvan-app1\.nrsc\.gov\.in\//,
      handler: 'CacheFirst',
      options: {
        cacheName: 'bhuvan-api-cache',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 86400 // 24 hours
        }
      }
    },
    {
      urlPattern: /^https:\/\/api\.data\.gov\.in\//,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'datagov-api-cache',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 1800 // 30 minutes
        }
      }
    },
    {
      urlPattern: /\/api\//,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'app-api-cache',
        networkTimeoutSeconds: 5,
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 300 // 5 minutes
        }
      }
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images-cache',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 2592000 // 30 days
        }
      }
    },
    {
      urlPattern: /\.(?:js|css)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-assets-cache',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 2592000 // 30 days
        }
      }
    }
  ],
  navigateFallback: '/index.html',
  navigateFallbackAllowlist: [/^(?!\/__).*/],
  cleanupOutdatedCaches: true,
  clientsClaim: true,
  skipWaiting: true
};