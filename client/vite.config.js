import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // ১. এই লাইনটা যোগ করো

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // ২. এই প্লাগইনটা এখানে কল করো
  ],
})