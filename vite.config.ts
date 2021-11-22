// https://vitejs.dev/config/

import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import html from 'vite-plugin-html';
import reactSvg from 'vite-plugin-react-svg';
import tsconfigPaths from 'vite-tsconfig-paths';

import globals from './config/globals';

export default defineConfig({
  plugins: [
    reactRefresh(),
    tsconfigPaths(),
    reactSvg({
      defaultExport: 'component',
    }),
    html({
      inject: {
        injectData: {
          title: 'BEDROOM PROJECTS',
        },
      },
    }),
  ],
  define: globals,
  server: {
    hmr: {
      clientPort: 443,
    },
  },
});
