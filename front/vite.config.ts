import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   server: {
//     host: true,
//     port: 5173,
//     strictPort: true,
//   },
// })
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0', // обязательно для работы внутри Docker
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,
      interval: 100, // можно увеличить до 300–500, если грузит CPU
    },
  },
});
