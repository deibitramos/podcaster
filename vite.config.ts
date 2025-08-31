import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import { visualizer } from 'rollup-plugin-visualizer';

const srcPath: string = path.resolve(__dirname, './src');

export default defineConfig({
  define: {
    '__DEV__': false,
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    minify: 'esbuild',
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-libs': ['react', 'react-dom', 'react-dom/client'],
        },
      },
    },
    sourcemap: false,
  },
  esbuild: {
    drop: ['console', 'debugger'],
    legalComments: 'none',
  },
  plugins: [
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    visualizer({ filename: 'dist/stats.html', open: true }),
  ],
  resolve: {
    alias: { '@': srcPath },
  },
});
