import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // --- Add this configuration ---
      jsxImportSource: '@emotion/react', // Or your preferred source like 'react'
      babel: { // Or 'swc' if you prefer SWC
        plugins: [
          // Add Babel plugin if needed, e.g., for Emotion CSS prop
          // '@emotion/babel-plugin',
        ],
        // Use babel-plugin-transform-react-jsx for JS files if not using SWC
      },
      // Tell the plugin to treat .js files as jsx
      include: '**/*.{jsx,js}',
      // ----------------------------
    })
  ],
  // You might still need optimizeDeps config depending on your dependencies
  optimizeDeps: {
    esbuildOptions: {
        loader: {
             '.js': 'jsx',
        }
    }
  },
})