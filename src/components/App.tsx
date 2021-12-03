import * as i from 'types';
import React from 'react';
import { hotjar } from 'react-hotjar';
import { Outlet, useLocation } from 'react-location';
import { enableBodyScroll, disableBodyScroll } from 'body-scroll-lock';
import shallow from 'zustand/shallow';

import GlobalStyle from 'styles';
import useStore, { selectors } from 'state';
import { fetchMedia } from 'state/utils';
import { useMultiMatchRoute } from 'hooks';

import Header from 'modules/Header';
import Footer from 'common/navigation/Footer';
import RenderCanvas from 'common/presentation/RenderCanvas';

import { Name } from 'common/presentation/Name';
import Loader from './common/presentation/Loader';


const App: React.VFC = () => {
  const {
    setShowName, isAnyMenuOpen, isMenuOpen, loading: appLoading, showName,
  } = useStore(selectors.ui, shallow);
  const { matchRoute, multiMatchRoute } = useMultiMatchRoute();
  const location = useLocation();
  const [fullscreenMedia, setFullscreenMedia] = React.useState<i.MediaType | undefined>();
  const isHomepage = !!matchRoute({ to: '/' });
  const canvasVisible = isHomepage || isAnyMenuOpen();

  React.useEffect(() => {
    fetchMedia();
  }, []);

  React.useEffect(() => {
    if (multiMatchRoute(['/', 'grid'])) {
      setShowName(true);
    } else {
      setShowName(false);
    }
  }, [multiMatchRoute]);

  React.useEffect(() => {
    if (isHomepage || !isAnyMenuOpen()) {
      setFullscreenMedia(undefined);
    } else if (isMenuOpen.L) {
      setFullscreenMedia('photo');
    } else if (isMenuOpen.R) {
      setFullscreenMedia('video');
    }
  }, [isMenuOpen]);

  React.useEffect(() => {
    const body = document.querySelector('body');

    if (body) {
      if (appLoading) {
        disableBodyScroll(body);
      } else {
        enableBodyScroll(body);
      }
    }

    return function cleanup() {
      if (body) {
        enableBodyScroll(body);
      }
    };
  }, [appLoading]);

  React.useEffect(() => {
    if (__PROD__) {
      hotjar.stateChange(location.current.pathname);
    }
  }, [location.current.pathname]);

  return (
    <main>
      <GlobalStyle />
      <Outlet /> {/** Renders matching paths from react-location */}
      <RenderCanvas visible={canvasVisible} fullscreen={fullscreenMedia} />
      <Header />
      <Name $visible={appLoading === 'site' || showName}>bedroom</Name>
      <Loader />
      <Footer />
    </main>
  );
};

export default App;
