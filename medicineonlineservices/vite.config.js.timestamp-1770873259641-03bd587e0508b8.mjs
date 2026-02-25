// vite.config.js
import { defineConfig } from "file:///E:/React+webapi/Ecommerencesite/Visualstudioreactcode/medicineonlineservices/node_modules/vite/dist/node/index.js";
import react from "file:///E:/React+webapi/Ecommerencesite/Visualstudioreactcode/medicineonlineservices/node_modules/@vitejs/plugin-react/dist/index.js";
var vite_config_default = defineConfig({
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
      "/api": {
        target: "http://localhost:5256",
        changeOrigin: true,
        secure: false
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxSZWFjdCt3ZWJhcGlcXFxcRWNvbW1lcmVuY2VzaXRlXFxcXFZpc3VhbHN0dWRpb3JlYWN0Y29kZVxcXFxtZWRpY2luZW9ubGluZXNlcnZpY2VzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFxSZWFjdCt3ZWJhcGlcXFxcRWNvbW1lcmVuY2VzaXRlXFxcXFZpc3VhbHN0dWRpb3JlYWN0Y29kZVxcXFxtZWRpY2luZW9ubGluZXNlcnZpY2VzXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi9SZWFjdCt3ZWJhcGkvRWNvbW1lcmVuY2VzaXRlL1Zpc3VhbHN0dWRpb3JlYWN0Y29kZS9tZWRpY2luZW9ubGluZXNlcnZpY2VzL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCldLFxuICAvLyA9PT09PT1idWlsZGluZ3Byb2JsZW0gLS0tLS0tLS0tLS1cbiAgLy8gIGJ1aWxkOiB7XG4gIC8vICAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDEwMDAsXG5cbiAgLy8gICByb2xsdXBPcHRpb25zOiB7XG4gIC8vICAgICBvdXRwdXQ6IHtcbiAgLy8gICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gIC8vICAgICAgICAgcmVhY3Q6IFtcInJlYWN0XCIsIFwicmVhY3QtZG9tXCJdLFxuICAvLyAgICAgICAgIHJvdXRlcjogW1wicmVhY3Qtcm91dGVyLWRvbVwiXSxcbiAgLy8gICAgICAgfSxcbiAgLy8gICAgIH0sXG4gIC8vICAgfSxcbiAgLy8gfSxcbiAgLy8gPT09PT09PT09PVxuICBzZXJ2ZXI6IHtcbiAgICBwcm94eToge1xuICAgICAgJy9hcGknOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6NTI1NicsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgc2VjdXJlOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgfVxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBZ2EsU0FBUyxvQkFBb0I7QUFDN2IsT0FBTyxXQUFXO0FBRWxCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBZWpCLFFBQVE7QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFFBQVE7QUFBQSxNQUNWO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
