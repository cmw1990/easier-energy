import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
    esbuildOptions: {
      target: 'es2020',
    },
  },
  build: {
    target: 'es2020',
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
  },
}));