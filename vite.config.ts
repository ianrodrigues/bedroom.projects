// https://vitejs.dev/config/

import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import html from 'vite-plugin-html';
import reactSvg from 'vite-plugin-react-svg';
import legacy from '@vitejs/plugin-legacy';
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
    legacy({
      targets: [
        '> 0.2%',
        'ie 11',
        'not dead',
        'not op_mini all',
      ],
    }),
  ],
  define: globals,
});
