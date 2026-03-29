import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: 'https://nhanchidanh1.github.io/chicken-invaders/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
