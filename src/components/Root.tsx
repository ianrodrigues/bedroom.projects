import React from 'react';
import { hotjar } from 'react-hotjar';
import { ReactLocation, Router } from 'react-location';
import { Route, elementsToRoutes } from 'react-location-elements-to-routes';
import { ThemeProvider } from 'styled-components';
import { QueryClient, QueryClientProvider } from 'react-query';

import theme from 'styles/theme';
import AssetsLoaderProvider from 'context/assetsLoaderProvider';

import App from './App';


if (__PROD__) {
  hotjar.initialize(HOTJAR_ID, HOTJAR_SNIPPET_V);
}

const reactLocation = new ReactLocation();
const queryClient = new QueryClient();


const Root: React.VFC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <AssetsLoaderProvider>
          <Router
            location={reactLocation}
            routes={elementsToRoutes(
              <Route path="/">
                {/* Vite complains if I turn this into a function to prevent duplication */}
                <Route path="photos/:slug" element={() => import('pages/PhotoDetail').then((mod) => <mod.default />)} />
                <Route path="film/:slug" element={() => import('pages/VideoDetail').then((mod) => <mod.default />)} />
                <Route path="grid" element={() => import('pages/Grid').then((mod) => <mod.default />)} />
                <Route path="info" element={() => import('pages/Info').then((mod) => <mod.default />)} />
              </Route>,
            )}
          >
            <App />
          </Router>
        </AssetsLoaderProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default Root;
