import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // ======buildingproblem -----------
  //  build: {
  //     chunkSizeWarningLimit: 1000,

  //   rollupOptions: {
  //     output: {
  //       manualChunks: {
  //         react: ["react", "react-dom"],
  //         router: ["react-router-dom"],
  //       },
  //     },
  //   },
  // },
  // ==========
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5256',
        changeOrigin: true,
        secure: false,
      },
    }
  },
})
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [react()],
// });
