import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['chart.js', 'dayjs']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});