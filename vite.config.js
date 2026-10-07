import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  // Required: serve MediaPipe WASM files from node_modules
  optimizeDeps: {
    exclude: ['@mediapipe/tasks-vision'],
  },
});
