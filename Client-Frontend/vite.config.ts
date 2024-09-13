import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import babel from 'vite-plugin-babel';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({
      babelConfig: {
        presets: ['@babel/preset-env', '@babel/preset-react'],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

