import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import os from 'os';

export default defineConfig({
  plugins: [react()],
  // iCloud/Desktop papkalarida cache va watch muammolarini kamaytirish
  cacheDir: path.join(os.tmpdir(), 'arenatop-vite-cache'),
  server: {
    watch: {
      usePolling: true,
      interval: 1000,
    },
    proxy: {
      '/v1': {
        target: 'https://api.arenatop.uz',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
