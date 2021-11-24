import React from 'react';
import { hotjar } from 'react-hotjar';
import { ReactLocation, Router } from 'react-location';
import { Route, elementsToRoutes } from 'react-location-elements-to-routes';
import { ThemeProvider } from 'styled-components';

import theme from 'styles/theme';
import AssetsLoaderProvider from 'context/assetsLoaderProvider';
import infoLoader from 'pages/Info/data';

import App from './App';


if (__PROD__) {
  hotjar.initialize(HOTJAR_ID, HOTJAR_SNIPPET_V);
}

const reactLocation = new ReactLocation();


const Root: React.VFC = () => {
  return (
    <ThemeProvider theme={theme}>
      <AssetsLoaderProvider>
        <Router
          location={reactLocation}
          routes={elementsToRoutes(
            <Route path="/">
              <Route
                path="photos/:slug"
                // Vite complains if I turn this into a function to prevent duplication
                element={() => import('pages/PhotoDetail').then((mod) => <mod.default />)}
              />
              <Route
                path="film/:slug"
                element={() => import('pages/VideoDetail').then((mod) => <mod.default />)}
              />
              <Route
                path="grid"
                element={() => import('pages/Grid').then((mod) => <mod.default />)}
              />
              <Route
                path="info"
                element={() => import('pages/Info').then((mod) => <mod.default />)}
                loader={infoLoader}
              />
            </Route>,
          )}
        >
          <App />
        </Router>
      </AssetsLoaderProvider>
    </ThemeProvider>
  );
};

export default Root;
