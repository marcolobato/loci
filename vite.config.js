import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Serves the dev server over https:// with a self-signed certificate.
    // Browsers only allow the microphone and camera on secure pages, so
    // without this, recording would not work when testing on a phone.
    // Development only: it does nothing in the built app.
    basicSsl(),
  ],
})
