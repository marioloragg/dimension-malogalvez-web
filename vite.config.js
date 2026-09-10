import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: {
    host: true,
  },
  build: {
    target: 'es2019',
    cssCodeSplit: false,
  },
});
