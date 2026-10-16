import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// "command" is "serve" for the dev server and "build" for npm run build.
export default defineConfig(({ command }) => ({
  // On GitHub Pages the app lives in a sub-folder: marcolobato.github.io/loci/
  // The built app needs to know that; the dev server stays at the root.
  base: command === 'build' ? '/loci/' : '/',
  plugins: [
    react(),
    // Serves the dev server over https:// with a self-signed certificate.
    // Browsers only allow the microphone and camera on secure pages, so
    // without this, recording would not work when testing on a phone.
    // Development only: it does nothing in the built app.
    basicSsl(),

    // Works offline: builds a service worker, a small background script that
    // keeps a copy of the app on the phone and serves it with no connection.
    // It only runs in the built app (npm run build), not on the dev server.
    VitePWA({
      // "prompt": a new version waits until the person agrees to reload,
      // instead of swapping the app underneath them mid-capture.
      // (The "new version" notice comes in a later step.)
      registerType: 'prompt',
      // Start the service worker automatically; no code needed in main.jsx.
      injectRegister: 'auto',
      // We already have our own public/manifest.webmanifest, linked in
      // index.html, so the plugin shouldn't make another.
      manifest: false,
      workbox: {
        // Keep a copy of everything the app is made of: code, styles, the
        // page itself, the icons, the granite texture and the manifest.
        globPatterns: ['**/*.{js,css,html,svg,png,webp,webmanifest}'],
        // Any address (?moments, ?catalog) opens the saved app when offline.
        navigateFallback: 'index.html',
        // The fonts come from Google, not from our files. Keep a copy the
        // first time they load, so offline Loci still uses Source Serif 4
        // and Source Code Pro instead of falling back to system fonts.
        runtimeCaching: [
          {
            // The small stylesheet that says which font files to use.
            urlPattern: ({ url }) => url.origin === 'https://fonts.googleapis.com',
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-stylesheets' },
          },
          {
            // The font files themselves. They never change, so keep them
            // for a year and never ask the network again.
            urlPattern: ({ url }) => url.origin === 'https://fonts.gstatic.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-files',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
}))
